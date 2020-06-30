import React, { Fragment } from 'react';
import _ from 'lodash';
import { Divider } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

const renderColumns = (dispatch:Function, showIntent:any, setShowVisible:any) => {
  const columns = [
    {
      title: '意图ID',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '意图类型',
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: '意图名称',
      key: 'job',
      dataIndex: 'job',
    },
    {
      title: '语料数量',
      key: 'triggerTime',
      dataIndex: 'triggerTime',
    },
    {
      title: '意图状态',
      key: 'startTime',
      dataIndex: 'startTime',
    },
    {
      title: '最近训练时间',
      key: 'startTim',
      dataIndex: 'startTim',
    },
    {
      title: '操作人',
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
      key: 'invitationId',
      dataIndex: 'invitationId',
      width: 250,
      render: (group:string|number, value:{intent:string|any}) => {
        const { intent } = value;
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: `/AI/intention/config`,
                  })
                );
              }}
            >
              意图管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: `/AI/intention/corpus`,
                  })
                );
              }}
            >
              查看语料
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                const { search } = window.location;
                const { dataStatus } = queryString.parse(search);
              }}
            >
              训练
            </a>
          </Fragment>
        );
      },
    },
  
  ];
  return columns;
};
export default renderColumns;
