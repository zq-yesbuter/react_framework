import React, { Fragment, useState } from 'react';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { Divider, Popover, Spin } from 'antd';
import { formatTaskType } from '@/utils/utils';
import { statusOptions } from '../contant';
import { getProResult } from '@/services/nameList';

interface Value {
  intent: string;
  status: number | string;
  createdTime: any;
  actualCount?: any;
}
const renderColumns = (dispatch: Function, ivrIntents: any, content, setcontent) => {
  // const [visible, setVisible] = useState(false);
  // const handleVisibleChange = (visible) => {
  //   setVisible(visible);
  // };
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
      title: '外呼平均时长',
      key: 'totalTimeElapsedSec',
      dataIndex: 'totalTimeElapsedSec',
      render: (totalTimeElapsedSec: number, value: Value) => {
        const { actualCount } = value || {};
        return (
          <Fragment>{actualCount ? (totalTimeElapsedSec / actualCount).toFixed(2) : 0}</Fragment>
        );
      },
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
      title: '创建人',
      key: 'created',
      dataIndex: 'created',
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
        const { intent, status, createdTime, actualCount } = value || {};
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
                        pathname: '/AI/outgoing/config',
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
                      pathname: '/AI/outgoing/namelist',
                      search: queryString.stringify(search),
                    })
                  );
                }
              }}
            >
              名单
            </a>
            {status > 3 && (
              <Fragment>
                <Divider type="vertical" />
                <Popover
                  content={content}
                  title="挂机原因占比"
                  trigger="click"
                  placement="topRight"
                  // visible={visible}
                  // onVisibleChange={handleVisibleChange}
                >
                  <a
                    onClick={() => {
                      setcontent(<Spin size="small" />);
                      getProResult({ batchId: id }).then((data) => {
                        if (data && data.length) {
                          const newData = data.sort((a, b) => b.count - a.count);
                          const result = (
                            <div>
                              {newData.map((cur) => (
                                <p>{`${cur.remark} :   ${
                                  actualCount
                                    ? `${Math.round((cur.count / actualCount) * 10000) / 100}%`
                                    : '0%'
                                }`}</p>
                              ))}
                            </div>
                          );
                          setcontent(result);
                        } else {
                          setcontent(<div>暂无数据</div>);
                        }
                      });
                    }}
                  >
                    查看
                  </a>
                </Popover>
              </Fragment>
            )}
          </Fragment>
        );
      },
    },
  ];

  return columns;
};
export default renderColumns;
