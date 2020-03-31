import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';
import moment from 'moment';

export default function DateFormat(format = 'YYYY-MM-DD HH:mm:ss', value) {
  if (!value) {
    return null;
  }
  return <Fragment>{moment(value * 1).format(format)}</Fragment>;
}
