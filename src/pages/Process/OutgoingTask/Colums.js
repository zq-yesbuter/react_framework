import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';

const renderColumns = dispatch => {
  const columns = [
    {
      title: '任务名',
      key: 'channel',
      dataIndex: 'channel',
    },
    {
      title: '任务类型',
      key: 'channelName',
      dataIndex: 'channelName',
    },
    {
      title: '外呼流程',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '外呼名单',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '外呼号段',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '外呼开始时间',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '更新人',
      key: 'modified',
      dataIndex: 'modified',
    },
    {
      title: '操作时间',
      key: 'modifiedDate',
      dataIndex: 'modifiedDate',
      width: 200,
      // render: modifiedDate => <DateFormat value={modifiedDate} />,
    },
    {
      title: '操作',
      key: 'channel',
      dataIndex: 'channel',
      width: 150,
      render: (channel, value) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch(routerRedux.push('/AI/outging/config'));
              }}
            >
              配置
            </a>
            <Divider type="vertical" />
            <a onClick={() => dispatch(routerRedux.push('/AI/outging/namelist'))}>名单</a>
          </Fragment>
        );
      },
    },
  ];

  return columns;
};
export default renderColumns;
