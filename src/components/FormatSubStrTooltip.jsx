import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import { formatSubStr } from '../config';

export default class FormatSubStrTooltip extends PureComponent {
  render() {
    const { length = 14, str = '' } = this.props;
    const formatStr = formatSubStr(str, length);

    return str.length > length ? <Tooltip title={str}>{formatStr}</Tooltip> : str;
  }
}
