import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { formatTaskType } from '@/utils/utils';
import { statusOptions } from '../contant';

const renderColumns = (dispatch,ivrIntents) => {
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
    // {
    //   title: '岗位',
    //   key: 'jobName',
    //   dataIndex: 'jobName',
    // },
    // {
    //   title: '面试时长',
    //   key: 'entity',
    //   dataIndex: 'entity',
    // },
    {
      title: '面试地址',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: '外呼时间',
      key: 'triggerTime',
      dataIndex: 'triggerTime',
    },
    {
      title: '应用',
      key: 'appCode',
      dataIndex: 'appCode',
    },
    {
      title: '待确定开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
    },
    {
      title: '待确定结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
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
      key: 'invitationId',
      dataIndex: 'invitationId',
      width: 150,
      render: (group, value) => {
        const { intent } = value;
        return (
          <Fragment>
            <a
              onClick={() => {
                // dispatch({
                //   type: 'namelist/save',
                //   payload: {listValue:value},
                // });
                dispatch(
                  routerRedux.push({
                    pathname: '/AI/outging/record',
                    search: queryString.stringify({
                      group,
                      intent,
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
    // {
    //   title: '挂机时间',
    //   key: 'entity1',
    //   dataIndex: 'entity1',
    // },
    // {
    //   title: '挂机原因',
    //   key: 'entity2',
    //   dataIndex: 'entity3',
    // },
    
    // {
    //   title: 'contact',
    //   key: 'contact',
    //   dataIndex: 'contact',
    // },
  ];

  return columns;
};
export default renderColumns;
