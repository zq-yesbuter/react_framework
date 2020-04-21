import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';
import { formatTaskType } from '@/utils/utils';
import { statusOptions } from '../contant';

const renderColumns = (dispatch,ivrIntents) => {
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
      render:  intent => formatTaskType(ivrIntents,'intent',intent,'intentDesc'),
    },
    {
      title: '外呼名单',
      key: 'expectedCount',
      dataIndex: 'expectedCount',
      render: expectedCount => (`${expectedCount}人`),
    },
    {
      title: '外呼开始时间',
      key: 'triggerStartTime',
      dataIndex: 'triggerStartTime',
    },
    {
      title: '场景',
      key: 'scene',
      dataIndex: 'scene',
      render:  scene => formatTaskType(ivrIntents,'scene',scene,'sceneDesc'),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render:  status => formatTaskType(statusOptions,'value',status,'name'),
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
        const { name, intent,status} = value || {};
        return (
          <Fragment>
            {status > -1 ? (
              <Fragment>
                <a
                  onClick={() => {
                    dispatch(routerRedux.push({
                      pathname: '/AI/outging/config',
                      search: queryString.stringify({
                        intent,
                        id,
                      }),
                    }))
                  }}
                >
                  配置
                </a>
                <Divider type="vertical" />
              </Fragment>
            ):null
            }    
            <a onClick={
              () =>  {
                if(id){
                  dispatch(routerRedux.push({
                    pathname: '/AI/outging/namelist',
                    search: queryString.stringify({
                      intent,
                      id,
                    }),
                  })
                )
                }
              }}
            >
            名单
            </a>
          </Fragment>
        );
      },
    },
  ];

  return columns;
};
export default renderColumns;
