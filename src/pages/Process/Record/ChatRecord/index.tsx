import React, { useRef, useEffect } from 'react';
import { Avatar, Spin } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './index.less';

interface Props {
  namelist:any;
  loading:boolean;
  dispatch:Function;
}
function RecordList(props:Props) {
  const { namelist: { messageList = [] }, loading, dispatch } = props;
  const chatRef = useRef(null);

  useEffect(() => {
    return () => {
      // 对信息列表信息置空
      dispatch({
        type: 'namelist/save',
        payload: { messageList: [] },
      });
      if(chatRef && chatRef.current){
        chatRef.current.scrollTop = 0;
      }
    };
  }, []);

  function typeComponent(message:any) {
    const newMessage = JSON.parse(message);
    // eslint-disable-next-line compat/compat
    const [[type, value]] = Object.entries(newMessage);
    switch (type) {
      // case '3':
      //   return (
      //     <img style={{ width: '50%', height: 'auto' }} src={`${pathUrl}${value}`} alt="图片" />
      //   );
      // case '50':
      //   return <div className={styles.chatText}>视频/语音通话</div>;
      // case '43':
      //   return (
      //     <video
      //       style={{ marginTop: 2, width: '50%', height: 'auto' }}
      //       src={`${pathUrl}${value}`}
      //       controls="controls"
      //     >
      //       您的浏览器不支持 video 标签。
      //     </video>
      //   );
      case 'text':
        return <div className={styles.chatText}>{value}</div>;
      // case '34':
      //   return (
      //     <Fragment>
      //       {mType ? (
      //         <div className={styles.chatText}>
      //           <span>10“</span>
      //           <NormalAudio sourceProps={obj} />
      //         </div>
      //       ) : (
      //         <div className={styles.chatText}>
      //           <NormalAudio sourceProps={obj} type={mType} />
      //           <span>10“</span>
      //         </div>
      //       )}
      //       <div style={{ marginLeft: 48, marginTop: 5 }}>您好！请问明天有时间过来面试吗？</div>
      //     </Fragment>
      //     // <audio controls src={`${pathUrl}${value}`}>
      //     //   您的浏览器不支持 audio 标签
      //     // </audio>
      //   );
      default:
        return <div className={styles.chatText}>{value}</div>;
    }
  }

  function chatList() {
    const reg = /^JDGR/;
    if (messageList && messageList.length) {
      return messageList.map((item:{from:string;bizId:number|string;sheadUrl:string;timestamp:string|number|Date;message:string}) => {
        return (
          <li
            key={`${item.bizId}`}
            className={reg.test(item.from) ? styles.chatItemMine : styles.chatItemJoysec}
            id={String(item.timestamp)}
          >
            {reg.test(item.from) ? (
              <div>
                {item.sheadUrl ? (
                  <Avatar
                    size="large"
                    shape="square"
                    className={styles.avatar}
                    src={item.sheadUrl}
                  />
                ) : (
                  <Avatar size="large" className={styles.avatar} shape="square">
                    {item.from}
                  </Avatar>
                )}
                <div>
                  <div className={styles.chatName}>
                    {/* <span className={styles.chatTime}>{item.snickName}</span> */}
                    {/* <span > */}
                    {item.timestamp}
                    {/* </span> */}
                  </div>
                  {typeComponent(item.message)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex' }}> 
                {item.sheadUrl ? (
                  <Avatar size="large" shape="square" src={item.sheadUrl} />
                ) : (
                  <Avatar size="large" shape="square">
                    {item.from}
                  </Avatar>
                )}
                <div>
                  <div style={{ marginLeft: 15 }} className={styles.chatName}>
                    {/* <span className={styles.chatTime}>{item.snickName}</span> */}
                    {/* <span > */}
                    {item.timestamp}
                    {/* </span> */}
                  </div>
                  {typeComponent(item.message)}
                </div>
              </div>
            )}
          </li>
        );
        // }
      });
    }
    if (loading) {
      return (
        <div className={styles.bottomLoading}>
          <Spin />
        </div>
      );
    } 
    
    return (
      <div className={styles.noContent}>
        <span>暂时没有沟通记录</span>
      </div>
    );
  }

  return (
    <div className={styles.chatContent}>
      <div className={styles.chatPanel}>
        <div className={styles.chatPanelContainer} ref={chatRef} id='chatRecordRef'>
          <ul className={styles.chatList}>{chatList()}</ul>
        </div>
      </div>
    </div>
  );
}

export default connect(
  ({
    namelist = {},
    loading: {
      effects: { 'namelist/getMessage': loading },
    },
  }:{
    namelist: any;
    loading: any;
  }) => ({ namelist, loading })
)(RecordList);
