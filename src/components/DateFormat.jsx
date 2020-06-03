import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';
import moment from 'moment';

export default class DateFormat extends PureComponent {
  static defaultProps = {
    format: 'YYYY-MM-DD HH:mm:ss',
  };
  render() {
    const { value, format } = this.props;
    if (!value) {
      return null;
    }
    return <Fragment>{moment(value * 1).format(format)}</Fragment>;
  }
}
