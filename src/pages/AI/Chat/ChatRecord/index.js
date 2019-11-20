/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Spin } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './index.less';

function RecordList({ dispatch, wechatrecord={} }) {
  const ref = useRef(null);
  const [pageNo, setPageNo] = useState(0);
  const [scroll, setScroll] = useState(true);
  const { noLoading=false, newTalk, messageList=[{snickName:'jhhhhh',content:'nisyhsziiiii'},{snickName:'jhhhhh',content:'nisyhsziiiii'},{snickName:'jhhhhh',content:'nisyhsziiiii'},{snickName:'jhhhhh',content:'nisyhsziiiii'},{snickName:'jhhhhh',content:'nisyhsziiiii'},{snickName:'jhhhhh',content:'nisyhsziiiii'}] } = wechatrecord;
  const pathUrl = 'http://testimg.highso.com.cn/';
  function handleScroll() {
    // const clientHeight = ref.current.clientHeight;
    // const scrollHeight = ref.current.scrollHeight;
    const { scrollTop } = ref.current;
    if (noLoading) {
      if (newTalk) {
        setPageNo(0);
      }
      if (scrollTop === 0) {
        dispatch({
          type: 'wechatrecord/getMessage',
          payload: {
            pageNo: pageNo + 1,
            pageSize: 10,
          },
        });
        dispatch({
          type: 'wechatrecord/save',
          payload: {
            newTalk: false,
          },
        });
        if (pageNo > 0) {
          setScroll(false);
        }
        setPageNo(pageNo + 1);
      }
    }
  }

  useEffect(() => {
    if (scroll || newTalk) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  });

  function typeComponent(type, value) {
    console.log(type, value);
    switch (type) {
      case '3':
        return (
          <img style={{ width: '50%', height: 'auto' }} src={`${pathUrl}${value}`} alt="图片" />
        );
      case '50':
        return <div className={styles.chatText}>视频/语音通话</div>;
      case '43':
        return (
          <video style={{ marginTop: 2,width: '50%', height: 'auto' }} src={`${pathUrl}${value}`} controls="controls">
            您的浏览器不支持 video 标签。
          </video>
        );
      case '1':
        return <div className={styles.chatText}>{value}</div>;
      case '34':
        return (
          <audio controls src={`${pathUrl}${value}`}>
            您的浏览器不支持 audio 标签
          </audio>
        );
      default:
        return <div className={styles.chatText}>{value}</div>;
    }
  }

  function chatList() {
    if (messageList && messageList.length !== 0) {
      return messageList.map((item, index) => {
        if (`${item.mtype}` === '10000' || `${item.mtype}` === '570425393') {
          return (
            <div style={{ textAlign: 'center' }} key={index}>
              {item.content}
            </div>
          );
        }
        return (
          <li
            key={index}
            className={item.username === item.suserName ? styles.chatItemMine : styles.chatItemJoysec}
          >
            {item.username === item.suserName ? (
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
                    {item.snickName}
                  </Avatar>
                )}
                <div>
                  <div>
                    <span className={styles.chatTime}>{item.snickName}</span>
                    <span className={styles.chatName}>{item.time}</span>
                  </div>
                  {typeComponent(`${item.mtype}`, item.content)}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex' }}>
                {item.sheadUrl ? (
                  <Avatar size="large" shape="square" src={item.sheadUrl} />
                ) : (
                  <Avatar size="large" shape="square">
                    {item.snickName}
                  </Avatar>
                )}

                <div>
                  <div style={{ marginLeft: 15 }}>
                    <span className={styles.chatTime}>{item.snickName}</span>
                    <span className={styles.chatName}>{item.time}</span>
                  </div>
                  {typeComponent(`${item.mtype}`, item.content)}
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
        <span>没有数据</span>
      </div>
    );
  }

  function bottomLoadingHtml() {
    const { bottomLoading } = wechatrecord;
    if (bottomLoading) {
      return (
        <div className={styles.bottomLoading}>
          <Spin />
        </div>
      );
    }
    return null;
  }

  return (
    <div className={styles.right}>
      {/* <div className={styles.recordHeader}>沟通记录</div> */}
      {bottomLoadingHtml()}
      <div className={styles.chatPanel}>
        <div className={styles.chatPanelContainer} ref={ref} onScroll={handleScroll}>
          <ul className={styles.chatList}>{chatList()}</ul>
        </div>
      </div>
    </div>
  );
}

RecordList.propTypes = {
  wechatrecord: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ wechatrecord }) => ({ wechatrecord });

export default connect(mapStateToProps)(RecordList);
