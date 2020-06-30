import React, { Fragment } from 'react';
import _ from 'lodash';
import { Divider } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

const renderColumns = (dispatch:Function, showIntent:any, setShowVisible:any) => {
  const columns = [
    {
      title: '语料ID',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '语料',
      key: 'tel',
      dataIndex: 'tel',
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
                const { search } = window.location;
                const { dataStatus } = queryString.parse(search);
                
              }}
            >
              修改
            </a>
          </Fragment>
        );
      },
    },
  
  ];
  return columns;
};
export default renderColumns;
