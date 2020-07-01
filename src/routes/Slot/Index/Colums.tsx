import React, { Fragment } from 'react';
import _ from 'lodash';
import { Divider } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

const renderColumns = (dispatch:Function, showIntent:any, setShowVisible:any) => {
  const columns = [
    {
      title: '词槽ID',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '词槽名称',
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: '词汇数量',
      key: 'job',
      dataIndex: 'job',
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
                    pathname: '/AI/slot/config',
                  })
                );
              }}
            >
              词槽管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: `/AI/slot/vocalbulary`,
                  })
                );
              }}
            >
              词汇配置
            </a>
          </Fragment>
        );
      },
    },
  
  ];
  return columns;
};
export default renderColumns;
