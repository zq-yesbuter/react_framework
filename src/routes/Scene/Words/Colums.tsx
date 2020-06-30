import React, { Fragment } from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import NormalAudio from '@/components/NormalAudio';

const renderColumns = (dispatch:Function, showIntent:any, setShowVisible:any) => {
  const columns = [
    {
      title: '话术ID',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '话术名称',
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: '话术内容',
      key: 'job',
      dataIndex: 'job',
    },
    {
      title: '试听',
      key: 'triggerTime',
      dataIndex: 'triggerTime',
      width: 350,
      render:(answer:any) =>
      <NormalAudio
        sourceProps={{
          src: answer,
        }}
      />
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
                dispatch(
                  routerRedux.push({
                    pathname: `/AI/scene/words/config`,
                  })
                );
              }}
            >
              编辑
            </a>
          </Fragment>
        );
      },
    },
  
  ];
  return columns;
};
export default renderColumns;
