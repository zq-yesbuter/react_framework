import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import { formatNameType } from '@/utils/utils';
import { nameStatus } from '../contant';

function formatTime(intent:string) {
  switch (intent) {
    case ('first_entry_invitation', 'interview_research_invitation'):
      return '时间';
    case 'second_entry_invitation':
      return '入职时间';
    case 'interview_invitation':
      return '面试时间';
    default:
      return '时间';
  }
}
const renderColumns = (dispatch:Function, showIntent:string, setShowVisible:any) => {
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
      key: 'job',
      dataIndex: 'job',
    },
    {
      title: '外呼时间',
      key: 'triggerTime',
      dataIndex: 'triggerTime',
    },
    {
      title: formatTime(showIntent),
      key: 'startTime',
      dataIndex: 'startTime',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status:string | number, record:any) => {
        return formatNameType(nameStatus, 'value', status, 'name', record);
      },
    },
    {
      title: '挂机原因',
      key: 'result',
      dataIndex: 'result',
      render: result =>
        result && result.indexOf('#') > 0 ? result.slice(result.indexOf('#') + 1) : result,
    },
    {
      title: '通话时长(秒)',
      key: 'roundStartTime',
      dataIndex: 'roundStartTime',
      render: (roundStartTime, record) => {
        const { roundEndTime } = record;
        if (roundEndTime && roundStartTime) {
          return (moment(roundEndTime) - moment(roundStartTime)) / 1000;
        }
        return '';
      },
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
      render: (group:string|number, value:{intent:string|any}) => {
        const { intent } = value;
        return (
          <Fragment>
            <a
              onClick={() => {
                const { search } = window.location;
                const { dataStatus } = queryString.parse(search);
                // dispatch(
                //   routerRedux.push({
                //     pathname: '/AI/outging/namelist',
                //     search: queryString.stringify({...queryString.parse(search),invitationId:
                //     }),
                //   })
                // );
                dispatch({
                  type: 'namelist/getMessage',
                  payload: dataStatus ? { group, intent, dataStatus: 2 } : { group, intent },
                });
                dispatch({
                  type: 'namelist/getSigleFlowlist',
                  payload: dataStatus
                    ? { id: group, intent, dataStatus: 2 }
                    : { id: group, intent },
                });
                setShowVisible(true);
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
    //   title: 'contact',
    //   key: 'contact',
    //   dataIndex: 'contact',
    // },
    // {
    //   title: '面试时长',
    //   key: 'entity',
    //   dataIndex: 'entity',
    // },
    // {
    //   title: '面试地址',
    //   key: 'address',
    //   dataIndex: 'address',
    // },
    // {
    //   title: '应用',
    //   key: 'appCode',
    //   dataIndex: 'appCode',
    // },
    // {
    //   title: '待确定结束时间',
    //   key: 'endTime',
    //   dataIndex: 'endTime',
    // },
  ];

  const cloneColumns = _.cloneDeep(columns);
  if (showIntent !== 'interview_invitation') {
    cloneColumns.splice(2, 1);
  }
  if (showIntent === 'first_entry_invitation' || showIntent === 'interview_research_invitation') {
    cloneColumns.splice(3, 1);
  }
  return cloneColumns;
};
export default renderColumns;