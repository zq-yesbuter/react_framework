import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';

const renderColumns = dispatch => {
  const columns = [
    {
      title: '任务名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '任务类型',
      key: 'intent',
      dataIndex: 'intent',
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
      key: 'triggerStartTime',
      dataIndex: 'triggerStartTime',
    },
    {
      title: '更新人',
      key: 'operator',
      dataIndex: 'operator',
    },
    {
      title: '操作时间',
      key: 'operationTime',
      dataIndex: 'operationTime',
      width: 200,
      // render: modifiedDate => <DateFormat value={modifiedDate} />,
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      width: 150,
      render: (id, value) => {
        console.log(value)
        const { name } = value || {};
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch({
                  type: 'namelist/save',
                  payload: {configValue:value},
                });
                dispatch(routerRedux.push(`/AI/outging/config?${name}`));
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
