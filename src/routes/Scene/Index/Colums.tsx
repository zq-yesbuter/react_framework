import React, { Fragment } from 'react';
import _ from 'lodash';
import { Divider } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

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
      width: 250,
      render: (group:string|number, value:{intent:string|any}) => {
        const { intent } = value;
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch(
                routerRedux.push({
                  pathname: `/AI/scene/process`,
                })
              );
              }}
            >
              流程配置
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: `/AI/scene/words`,
                  })
                );
              }}
            >
              话术配置
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/AI/scene/textTest',
                  })
                );
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
