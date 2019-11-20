import React,{ Fragment } from 'react';
import { Card, Typography, Alert } from 'antd';
import Chat from './Chat';
import List from './List';
import styles from './index.less';

export default () => (
    <Fragment>
      <div className={styles.header}>
        <h1>AI招聘系统</h1>
      </div>
      <div className={styles.container} >
        <div className={styles.left} ><List/></div>
        <div className={styles.center} ><Chat/></div>
        <div className={styles.right} ></div>
      </div>
    </Fragment>
);
