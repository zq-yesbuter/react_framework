import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';
import renderTable from '@/components/SelectTable';
import { formatTaskType } from '@/utils/utils';

const renderColumns = (dispatch,ivrIntents) => {
  const columns = [
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '性别',
      key: 'intent',
      dataIndex: 'intent',
      render:  intent => formatTaskType(ivrIntents,'intent',intent,'intentDesc'),
    },
    {
      title: '年龄',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '学历',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '电话',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '邮箱',
      key: 'triggerStartTime',
      dataIndex: 'triggerStartTime',
    },
    {
      title: '申请岗位',
      key: 'scene',
      dataIndex: 'scene',
      render:  scene => formatTaskType(ivrIntents,'scene',scene,'sceneDesc'),
    },
    {
      title: '申请时间',
      key: 'status',
      dataIndex: 'status',
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
              评测结果
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
            推荐岗位
            </a>
          </Fragment>
        );
      },
    },
  ];

  return columns;
};
export default renderColumns;
