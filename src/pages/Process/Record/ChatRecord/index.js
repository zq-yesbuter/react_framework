/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Avatar, Spin, Icon } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import styles from './index.less';

function RecordList({
  dispatch,
  namelist: { messageList = [], newTalk, noLoading = false, bottomLoading = false },
  loading,
}) {
  const chatRef = useRef(null);
  const intervalRef = useRef(null);
  const [pageNo, setPageNo] = useState(0);
  const [scroll, setScroll] = useState(true);
  const [showNotice, setShowNotice] = useState(false);

  function handleScroll() {
    const clientHeight = chatRef.current.clientHeight;
    const scrollHeight = chatRef.current.scrollHeight;
    const { scrollTop } = chatRef.current;
    // if (noLoading) {
    //   if (newTalk) {
    //     setPageNo(0);
    //   }
    //   if (scrollTop === 0) {
    //     dispatch({
    //       type: 'chatrecord/getMessage',
    //       payload: {
    //         pageNo: pageNo + 1,
    //         pageSize: 10,
    //       },
    //     });
    //     dispatch({
    //       type: 'chatrecord/save',
    //       payload: {
    //         newTalk: false,
    //       },
    //     });
    //     if (pageNo > 0) {
    //       setScroll(false);
    //     }
    //     setPageNo(pageNo + 1);
    //   }
    // }
  }
  // useEffect(() => {
  //   console.log('didmount===>', process.env);
  //   let { search, origin } = document.location || {};
  //   if (!search) {
  //     search = localStorage.getItem('token');
  //   }
  //   const url = search ? `/sse/messages${search}` : '/sse/messages';
  //   let stocks = new EventSource(url);
  //   stocks.onopen = () => {
  //     console.log('open==>');
  //   }
  //   stocks.onmessage = (event) => {
  //     console.log('message===>',event);
  //     dispatch({type:'chatrecord/save',payload:{showNotice:true}});
  //     // setShowNotice(true);
  //   };
  //   stocks.onerror = (event) => {
  //     console.log('error==>');
  //     // new EventSource(`/sse/messages${search}`);
  //   };
  //   return () => {
  //     if (stocks != null) {
  //       stocks.close();
  //       console.log('Disconnected');
  //     }
  //   };

  // console.log('didmount===>', process.env);
  // try {
  //   let { search, origin } = document.location || {};
  //   if (!search) {
  //     search = localStorage.getItem('token');
  //   }
  //   let publicPath = 'http://aijob.jd.com:8088';
  //   if (process.env.NODE_ENV === 'development') {
  //     publicPath = 'http://jddai.jd.com:8088';
  //   } else if (process.env.NODE_ENV === 'beta' || process.env.NODE_ENV === 'betahuangcun') {
  //     publicPath = 'http://aijob.jd.com:8088';
  //   }
  //   let socket = new SockJS(`${publicPath}/ws/messaging${search}`, null, {
  //     transports: 'websocket',
  //   });
  //   const stompClient = Stomp.over(socket);
  //   // stompClient.heartbeat.outgoing = 20000;
  //   // stompClient.heartbeat.incoming = 20000;
  //   stompClient.connect({}, frame => {
  //     stompClient.subscribe('/ws/operator/queue/event', response => {
  //       const show = Object.keys(JSON.parse(response.body)).length;
  //       show && setShowNotice(true);
  //     });
  //   });
  //   let id = setInterval(() => {
  //     if (stompClient === null || !stompClient.connected) {
  //       console.log('断开重连！');
  //       stompClient.connect({}, frame => {
  //         stompClient.subscribe('/ws/operator/queue/event', response => {
  //           const show = Object.keys(JSON.parse(response.body)).length;
  //           show && setShowNotice(true);
  //         });
  //       });
  //     }
  //   }, 30000);
  //   intervalRef.current = id;
  //   return () => {
  //     if (stompClient != null) {
  //       stompClient.disconnect();
  //       console.log('Disconnected');
  //     }
  //     clearInterval(intervalRef.current);
  //   };
  // } catch (e) {
  //   // 捕获异常，防止js error
  //   // donothing
  //   console.log('socket error', e);
  // }
  // }, []);

  // useEffect(() => {
  //   if (scroll || newTalk) {
  //     ref.current.scrollTop = ref.current.scrollHeight;
  //   }
  // });

  function typeComponent(message, mType) {
    const newMessage = JSON.parse(message);
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
      return messageList.map((item, index) => {
        return (
          <li
            key={`${item.bizId}-${index}`}
            className={reg.test(item.from) ? styles.chatItemMine : styles.chatItemJoysec}
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
                    {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
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
                    {moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
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
    return (
      <div className={styles.noContent}>
        <span>暂时没有沟通记录</span>
      </div>
    );
  }

  function bottomLoadingHtml() {
    // const {  } = chatrecord;
    if (loading) {
      return (
        <div className={styles.bottomLoading}>
          <Spin />
        </div>
      );
    }
    return null;
  }

  return (
    <div className={styles.chatContent}>
      {/* <div className={styles.recordHeader}>沟通记录</div> */}
      {bottomLoadingHtml()}
      <div className={styles.chatPanel}>
        <div className={styles.chatPanelContainer} ref={chatRef} onScroll={handleScroll}>
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
  }) => ({ namelist, loading })
)(RecordList);
