import React, { Fragment } from 'react';
import styles from './index.less';
import ChatRecord from './ChatRecord';
import ChatBottom from './ChatBottom';

export default function UserManage() {
  return (
    <Fragment>
      <ChatRecord />
      <ChatBottom />
    </Fragment>
  );
}
