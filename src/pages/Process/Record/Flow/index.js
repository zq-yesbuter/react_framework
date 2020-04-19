/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Col,
  Row,
  Form,
  DatePicker,
  Button,
  InputNumber,
  Steps,
  message,
  Tag,
  Popconfirm,
  Tabs,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import {
  batchInvent,
  editBatchInvitation,
  fetchInvitation,
  cancelInvent,
  editInvitation,
  addInvitation,
  singleEditOfffer,
  singleAddOfffer,
  queryOffferInventIds,
  cancelOfffer,
} from '@/services/ai';
import { flatten } from '@/utils/utils';
import styles from './index.less';

const { Item } = Form;
const { Step } = Steps;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const format = 'YYYY-MM-DD HH:mm';
// const colors = ['cyan','blue','geekblue','lime','green','purple','magenta','red','volcano','orange','gold'];
const colors = [
  '#f50',
  '#2db7f5',
  '#87d068',
  '#108ee9',
  '#1BB8A8',
  '#f50',
  '#2db7f5',
  '#87d068',
  '#108ee9',
  '#1BB8A8',
];

function formatStatus(status) {
  switch (status) {
    case 0:
      return '邀约取消';
    case 1:
      return '邀约已接受';
    case 2:
      return '邀约已拒绝';
    case 3:
      return '邀约待确定';
    case 4:
      return '邀约异常';
    default:
      return '无';
  }
}
function formatPhoneStatus(status) {
  switch (status) {
    case 0:
      return '短信已发送';
    case 1:
      return '短信发送成功';
    case 2:
      return '短信发送失败';
    default:
      return '无';
  }
}
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function RecordBottom({
  form,
  dispatch,
  namelist: {
    jobList = [],
    selectJobId,
    flowList,
    backShowTime,
    // resumeObj: { resumeEvaluation },
    offerBackShowTime,
    offerFlowList,
    phoneMessage,
    offerPhoneMessage,
  },
  loading,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = form;
  const prevSelectJobId = usePrevious(selectJobId);
  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (prevSelectJobId !== selectJobId) {
        resetFields();
      }
    }
  });

  function onSubmit() {
    validateFields((err, values) => {
      if (!err) {
        const { triggerTime } = values;
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        if (!values.startTime) {
          message.error('请选择面试时间！');
          return;
        }
        const startTime = values.startTime.format(format);
        const endTime = values.startTime.add(values.diff, 'minutes').format(format);
        const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
        let payload = {
          applicantId: id,
          applyId,
          startTime,
          endTime,
          triggerTime: values.triggerTime.format(format),
        };
        if (status === 21) {
          if (backShowTime && backShowTime.triggerTime) {
            if (moment(backShowTime.triggerTime) < moment().add(10, 'minutes')) {
              message.error('当前时间和外呼时间差小于10分钟，无法更新！');
              return;
            }
            if (values.startTime < moment().add(10, 'minutes')) {
              message.error('当前时间和面试时间差小于10分钟，无法更新！');
              return;
            }
          }
          fetchInvitation({ applyIds: [applyId] })
            .then(time => {
              const updateId = time.length ? time.slice(-1)[0].invitationId : null;
              payload = { ...payload, updateId };
              editInvitation(payload)
                .then(data => {
                  message.success('修改邀约成功');
                  // dispatch({
                  //   type: 'chatrecord/updateSingleInvent',
                  // });
                  dispatch({
                    type: 'chatrecord/jobAppliedAsPostAll',
                  });
                })
                .catch(e => message.error(e.message));
            })
            .catch(e => Promise.reject(e));
          return;
        }
        addInvitation(payload)
          .then(data => {
            message.success('新增邀约成功');
            // dispatch({
            //   type: 'chatrecord/updateSingleInvent',
            // });

            dispatch({
              type: 'chatrecord/jobAppliedAsPostAll',
            });
          })
          .catch(e => message.error(e.message));
      }
    });
  }
  function onOfferSubmit() {
    validateFields((err, values) => {
      if (!err) {
        const { offerTriggerTime } = values;
        if (offerTriggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
        let payload = {
          applicantId: id,
          applyId,
          triggerTime: values.offerTriggerTime.format(format),
        };
        if (status === 71) {
          if (offerBackShowTime && offerBackShowTime.triggerTime) {
            if (moment(offerBackShowTime.triggerTime) < moment().add(10, 'minutes')) {
              message.error('当前时间和外呼时间差小于10分钟，无法更新！');
              return;
            }
          }
          queryOffferInventIds({ applyIds: [applyId] })
            .then(time => {
              const updateId = time.length ? time.slice(-1)[0].invitationId : null;
              payload = { ...payload, updateId };
              singleEditOfffer(payload)
                .then(data => {
                  message.success('修改录用邀约成功');
                  dispatch({
                    type: 'chatrecord/jobAppliedAsPostAll',
                  });
                })
                .catch(e => message.error(e.message));
            })
            .catch(e => Promise.reject(e));
          return;
        }
        singleAddOfffer(payload)
          .then(data => {
            message.success('新增录用邀约成功');
            dispatch({
              type: 'chatrecord/jobAppliedAsPostAll',
            });
          })
          .catch(e => message.error(e.message));
      }
    });
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }
  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  function disabledDateTime(current) {
    return {
      disabledHours: () => range(0, 24).splice(0, moment().hours()),
      disabledMinutes: () => range(0, 60).splice(0, moment().minutes() + 5),
      disabledSeconds: () => range(0, 60).splice(0, moment().seconds()),
    };
  }
  function cancelConfirm() {
    if (backShowTime && backShowTime.triggerTime) {
      if (moment(backShowTime.triggerTime) < moment().add(10, 'minutes')) {
        message.error('当前时间和外呼时间差小于10分钟，无法取消！');
        return;
      }
    }
    const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
    fetchInvitation({ applyIds: [applyId] }).then(time => {
      const updateId = time.length ? time.slice(-1)[0].invitationId : null;
      cancelInvent({ updateId })
        .then(data => {
          message.success('取消邀约成功!');
          dispatch({
            type: 'chatrecord/jobAppliedAsPostAll',
          });
          // dispatch({
          //   type: 'chatrecord/queryTimeList',
          //   payload: {
          //     selectJobId,
          //   },
          // });
          setFieldsValue({ triggerTime: null, startTime: null, diff: 60 });
        })
        .catch(e => message.error(e.message));
    });
  }
  function cancelOfferConfirm() {
    if (offerBackShowTime && offerBackShowTime.triggerTime) {
      if (moment(offerBackShowTime.triggerTime) < moment().add(10, 'minutes')) {
        message.error('当前时间和外呼时间差小于10分钟，无法取消！');
        return;
      }
    }
    const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
    queryOffferInventIds({ applyIds: [applyId] }).then(time => {
      const updateId = time.length ? time.slice(-1)[0].invitationId : null;
      cancelOfffer({ updateId })
        .then(data => {
          message.success('取消录用邀约成功!');
          dispatch({
            type: 'chatrecord/jobAppliedAsPostAll',
          });
          // dispatch({
          //   type: 'chatrecord/queryTimeList',
          //   payload: {
          //     selectJobId,
          //   },
          // });
          setFieldsValue({ offerTriggerTime: null });
        })
        .catch(e => message.error(e.message));
    });
  }
  function quitCancel() {
    resetFields();
  }
  function cancelOffer() {
    resetFields();
  }

  return (
    <div className={styles['gutter-box']}>
      <h3>外呼记录/结果</h3>
      <div className={styles.scroll}>
        {loading ? (
          <Spin style={{ marginTop: 50 }} />
        ) : (
          <Steps progressDot direction="vertical" current={10000}>
            {flowList &&
              flowList.length &&
              flowList.map(
                (
                  { status, roundStartTime, remark, interviewConfirmTime, roundEndTime, channel },
                  index
                ) => (
                  <Step
                    title={
                      channel ? `【${formatPhoneStatus(status)}】` : `【${formatStatus(status)}】`
                    }
                    description={
                      <div>
                        {roundStartTime ? <p>{`外呼开始时间： ${roundStartTime}`}</p> : null}
                        {roundEndTime ? <p>{`外呼结束时间： ${roundEndTime}`}</p> : null}
                        {interviewConfirmTime ? (
                          <p style={{ color: 'red', fontWeight: 400 }}>
                            {`用户期望面试时间： ${interviewConfirmTime}`}
                          </p>
                        ) : null}
                        <p>{channel ? null : remark}</p>
                      </div>
                    }
                    key={index}
                  />
                )
              )}
          </Steps>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = ({
  namelist = {},
  loading: {
    effects: { 'namelist/getSigleFlowlist': loading },
  },
}) => ({ namelist, loading });
export default connect(mapStateToProps)(Form.create({})(RecordBottom));
