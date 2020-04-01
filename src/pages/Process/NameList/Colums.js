import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';

const renderColumns = dispatch => {
  const columns = [
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '电话',
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: '岗位',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '面试时长',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '面试地址',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '外呼时间',
      key: 'entity8',
      dataIndex: 'entity8',
    },
    {
      title: '挂机时间',
      key: 'entity1',
      dataIndex: 'entity1',
    },
    {
      title: '挂机原因',
      key: 'entity2',
      dataIndex: 'entity3',
    },
    {
      title: '状态',
      key: 'entity6',
      dataIndex: 'entity6',
    },
    {
      title: '更新人',
      key: 'modified',
      dataIndex: 'modified',
    },
    {
      title: '操作时间',
      key: 'modifiedDate',
      dataIndex: 'modifiedDate',
      width: 200,
      // render: modifiedDate => <DateFormat value={modifiedDate} />,
    },
    {
      title: '操作',
      key: 'applyId',
      dataIndex: 'applyId',
      width: 150,
      render: (applyId, value) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/AI/record',
                    search: queryString.stringify({
                      applyId,
                    }),
                  })
                );
              }}
            >
              查看记录
            </a>
          </Fragment>
        );
      },
    },
  ];

  return columns;
};
export default renderColumns;
