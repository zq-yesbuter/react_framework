import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';
import renderTable from '@/components/SelectTable';
import { formatTaskType } from '@/utils/utils';

const renderColumns = (dispatch,ivrIntents) => {
  const columns = [
    {
      title: '推荐人',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '推荐岗位',
      key: 'intent',
      dataIndex: 'intent',
      render:  intent => formatTaskType(ivrIntents,'intent',intent,'intentDesc'),
    },
    {
      title: '被推荐人',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '电话',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '邮箱',
      key: 'triggerStartTime',
      dataIndex: 'triggerStartTime',
    },
    {
      title: '推荐时间',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: '状态',
      key: 'status1',
      dataIndex: 'status1',
    },
    {
      title: '状态更新时间',
      key: 'operationTime',
      dataIndex: 'operationTime',
      width: 200,
      // render: modifiedDate => <DateFormat value={modifiedDate} />,
    },
    {
      title: '查看',
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
