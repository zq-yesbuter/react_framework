import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';
import renderTable from '@/components/SelectTable';
import { formatTaskType } from '@/utils/utils';
import { statusOptions } from '../contant';

const renderColumns = (dispatch,ivrIntents) => {
  const columns = [
    {
      title: '岗位类型',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '岗位名称',
      key: 'intent',
      dataIndex: 'intent',
      render:  intent => formatTaskType(ivrIntents,'intent',intent,'intentDesc'),
    },
    {
      title: '对外名称',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '需求部门',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '招聘人数',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '工作城市',
      key: 'scene',
      dataIndex: 'scene',
      render:  scene => formatTaskType(ivrIntents,'scene',scene,'sceneDesc'),
    },
    {
      title: '学历要求',
      key: 'status',
      dataIndex: 'status',
      render:  status => formatTaskType(statusOptions,'value',status,'name'),
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
        const { name, intent} = value || {};
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch({
                  type: 'recruit/configNameList',
                  payload: {id,intent},
                });
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
            <a onClick={
              () =>  {
                if(id){
                  dispatch(routerRedux.push({
                    pathname: '/AI/outging/recruit',
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
