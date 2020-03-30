import 'babel-polyfill';
import React, { Fragment } from 'react';
import { Card, Typography, Alert, Col, Row } from 'antd';
import Chat from './Chat';
import List from './List';
import Resume from './Resume';
import styles from './index.less';

function Index() {
  return (
    <Fragment>
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
