import 'babel-polyfill';
import React, { Fragment } from 'react';
import { Card, Typography, Alert, Col, Row } from 'antd';
import Chat from './Chat';
import List from './List';
import Resume from './Resume';
import styles from './index.less';

function Index() {
  function logout() {
    const logoutUrl = `/authenticate/erp/logout?callback=${encodeURIComponent(
      `${location.origin}/AI`
    )}`;
    window.location.href = logoutUrl;
  }
  return (
    <Fragment>
      <div className={styles.header}>
        <h1>AI招聘系统</h1>
        <span onClick={logout} className={styles.logout}>
          退出登录
        </span>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <List />
        </div>
        <div className={styles.center}>
          <Chat />
        </div>
        <div className={styles.right}>
          <Resume />
        </div>
      </div>
    </Fragment>
  );
}

export default Index;
