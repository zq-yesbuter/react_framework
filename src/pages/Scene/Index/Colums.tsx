import React, { Fragment } from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { formatNameType } from '@/utils/utils';


const renderColumns = (dispatch:Function, showIntent:any, setShowVisible:any) => {
  const columns = [
    {
      title: '场景ID',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '场景名称',
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: '数据调用',
      key: 'job',
      dataIndex: 'job',
    },
    {
      title: '词槽匹配',
      key: 'triggerTime',
      dataIndex: 'triggerTime',
    },
    {
      title: '状态',
      key: 'startTime',
      dataIndex: 'startTime',
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
      width: 150,
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
              流程配置
            </a>
            <a
              onClick={() => {
                const { search } = window.location;
                const { dataStatus } = queryString.parse(search);
              }}
            >
              话术配置
            </a>
            <a
              onClick={() => {
                const { search } = window.location;
                const { dataStatus } = queryString.parse(search);
              }}
            >
              文本测试
            </a>
          </Fragment>
        );
      },
    },
  
  ];
  return columns;
};
export default renderColumns;
