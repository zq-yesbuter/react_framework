/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Avatar, Spin } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import NormalAudio from './ChatAudio';
import styles from './index.less';

function RecordList({ dispatch, chatrecord = {} }) {
  const ref = useRef(null);
  const [pageNo, setPageNo] = useState(0);
  const [scroll, setScroll] = useState(true);
  const {
    noLoading = false,
    newTalk,
    messageList = [
      { snickName: 'jhhhhh', content: 'nisyhsziiiiid', mtype: '34', type: 1 },
      { snickName: 'jhhhhh', content: 'nisyhsziiiii', mtype: '34', type: 0 },
      {
        snickName: 'jhhhhh',
        content:
          'nisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiidddddnisyhsziiiiiddddd',
        type: 0,
      },
      { snickName: 'jhhhhh', content: 'nisyhsziiiii', type: 0 },
      { snickName: 'jhhhhh', content: 'nisyhsziiiii', type: 1 },
      { snickName: 'jhhhhh', content: 'nisyhsziiiii', type: 1 },
    ],
  } = chatrecord;
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
          type: 'chatrecord/getMessage',
          payload: {
            pageNo: pageNo + 1,
            pageSize: 10,
          },
        });
        dispatch({
          type: 'chatrecord/save',
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

  function typeComponent(type, value, mType) {
    const obj = {
      src:
        'http://m8.music.126.net/20191127154612/0dd9cbdfd4c165e98274a3d02bc6a5e6/ymusic/a070/01e3/498c/17d6757b74ea1b5c8ef721e9a0653962.mp3',
    };
    switch (type) {
      case '3':
        return (
          <img style={{ width: '50%', height: 'auto' }} src={`${pathUrl}${value}`} alt="图片" />
        );
      case '50':
        return <div className={styles.chatText}>视频/语音通话</div>;
      case '43':
        return (
          <video
            style={{ marginTop: 2, width: '50%', height: 'auto' }}
            src={`${pathUrl}${value}`}
            controls="controls"
          >
            您的浏览器不支持 video 标签。
          </video>
        );
      case '1':
        return <div className={styles.chatText}>{value}</div>;
      case '34':
        return (
          <Fragment>
            {mType ? (
              <div className={styles.chatText}>
                <span>10“</span>
                <NormalAudio sourceProps={obj} />
              </div>
            ) : (
              <div className={styles.chatText}>
                <NormalAudio sourceProps={obj} type={mType} />
                <span>10“</span>
              </div>
            )}
            <div style={{ marginLeft: 48, marginTop: 5 }}>您好！请问明天有时间过来面试吗？</div>
          </Fragment>
          // <audio controls src={`${pathUrl}${value}`}>
          //   您的浏览器不支持 audio 标签
          // </audio>
        );
      default:
        return <div className={styles.chatText}>{value}</div>;
    }
  }

  function chatList() {
    if (messageList && messageList.length !== 0) {
      return messageList.map((item, index) => {
        return (
          <li key={index} className={item.type ? styles.chatItemMine : styles.chatItemJoysec}>
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
                  <div className={styles.chatName}>
                    {/* <span className={styles.chatTime}>{item.snickName}</span> */}
                    {/* <span > */}
                    {moment().format('YYYY-MM-DD HH:mm:ss')}
                    {/* </span> */}
                  </div>
                  {typeComponent(`${item.mtype}`, item.content, item.type)}
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
                  <div style={{ marginLeft: 15 }} className={styles.chatName}>
                    {/* <span className={styles.chatTime}>{item.snickName}</span> */}
                    {/* <span > */}
                    {moment().format('YYYY-MM-DD HH:mm:ss')}
                    {/* </span> */}
                  </div>
                  {typeComponent(`${item.mtype}`, item.content, item.type)}
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
    const { bottomLoading } = chatrecord;
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
  chatrecord: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });

export default connect(mapStateToProps)(RecordList);
