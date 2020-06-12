import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider } from 'antd';
import { formatTaskType } from '@/utils/utils';
import { statusOptions } from '../contant';

interface Value {
  intent: string;
  status: number | string;
  createdTime: any;
}
const renderColumns = (dispatch: Function, ivrIntents: any) => {
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
      render: (intent: string) => formatTaskType(ivrIntents, 'intent', intent, 'intentDesc'),
    },
    {
      title: '外呼名单',
      key: 'expectedCount',
      dataIndex: 'expectedCount',
      render: (expectedCount: number) => `${expectedCount}人`,
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
      render: (scene: string) => formatTaskType(ivrIntents, 'scene', scene, 'sceneDesc'),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status: number) => formatTaskType(statusOptions, 'value', status, 'name'),
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
      render: (id: number | string, value: Value) => {
        const { intent, status, createdTime } = value || {};
        const { pathname } = window.location;
        const isDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'delete';
        const search = isDelete
          ? { dataStatus: 2, intent, id, createdTime }
          : { intent, id, createdTime };
        return (
          <Fragment>
            {status > -1 ? (
              <Fragment>
                <a
                  onClick={() => {
                    dispatch(
                      routerRedux.push({
                        pathname: '/AI/outging/config',
                        search: queryString.stringify(search),
                      })
                    );
                  }}
                >
                  配置
                </a>
                <Divider type="vertical" />
              </Fragment>
            ) : null}
            <a
              onClick={() => {
                if (id) {
                  dispatch(
                    routerRedux.push({
                      pathname: '/AI/outging/namelist',
                      search: queryString.stringify(search),
                    })
                  );
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
