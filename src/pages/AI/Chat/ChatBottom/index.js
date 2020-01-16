/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
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
} from '@/services/ai';
import { flatten } from '@/utils/utils';
import styles from './index.less';

const { Item } = Form;
const { Step } = Steps;
const { RangePicker } = DatePicker;
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
  chatrecord: {
    jobList = [],
    selectJobId,
    flowList,
    backShowTime,
    resumeObj: { resumeEvaluation },
  },
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
        const interviewStartTime = values.interviewStartTime.format(format);
        const interviewEndTime = values.interviewStartTime
          .add(values.diff, 'minutes')
          .format(format);
        const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
        let payload = {
          applicantId: id,
          applyId,
          interviewStartTime,
          interviewEndTime,
          triggerTime: values.triggerTime.format(format),
        };
        if (status === 21) {
          if (backShowTime && backShowTime.triggerTime) {
            if (moment(backShowTime.triggerTime) < moment().add(10, 'minutes')) {
              message.error('当前时间和外呼时间差小于10分钟，无法更新！');
              return;
            }
            if (values.interviewStartTime < moment().add(10, 'minutes')) {
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
          setFieldsValue({'triggerTime':null,interviewStartTime:null,diff:60});
        })
        .catch(e => message.error(e.message));
    });
  }
  function quitCancel() {
    resetFields();
  }


  const { status } = jobList.find(item => item.applyId === selectJobId) || {};
  // console.log('status===>1111111',status,backShowTime,'=====>',moment(backShowTime.interviewEndTime).diff(backShowTime.interviewTime,'minutes'))
  const labelList = flatten(
    (resumeEvaluation && resumeEvaluation.details && Object.values(resumeEvaluation.details)) || []
  );
  return (
    <Row gutter={8} style={{ marginLeft: 8, marginRight: 8 }}>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>邀约/面试时间</h3>
          <div className={styles.scroll} style={{ paddingTop: 15 }}>
            <div style={{ marginBottom: 15 }}>
              {getFieldDecorator('triggerTime', {
                initialValue:
                status !== 11 && Object.keys(backShowTime).length
                ? moment(backShowTime.triggerTime)
                    : null,
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm', minuteStep: 5 }}
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择外呼时间"
                  style={{ display: 'block' }}
                />
              )}
            </div>
            <div style={{ marginBottom: 15 }}>
              {getFieldDecorator('diff', {
                initialValue:
                  status !== 11 && Object.keys(backShowTime).length
                    ? moment(backShowTime.interviewEndTime).diff(
                        backShowTime.interviewTime,
                        'minutes'
                      )
                    : 60,
              })(
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={160}
                  formatter={value => `${value}分钟`}
                  parser={value => value.replace('分钟', '')}
                />
              )}
            </div>
            <div style={{ marginBottom: 15 }}>
              {getFieldDecorator('interviewStartTime', {
                initialValue:
                status !== 11 && Object.keys(backShowTime).length
                ? moment(backShowTime.interviewTime)
                    : null,
              })(
                <DatePicker
                  disabledDate={disabledDate}
                  // disabledTime={disabledDateTime}
                  showTime={{ format: 'HH:mm', minuteStep: 5 }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择面试时间"
                  style={{ display: 'block' }}
                />
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={onSubmit} disabled={!selectJobId || status === 24}>
                更新
              </Button>
              {selectJobId && status === 21 ? (
                <Popconfirm
                  title="外呼时间和面试时间均会被取消，确认要取消吗？"
                  onConfirm={cancelConfirm}
                  onCancel={quitCancel}
                >
                  <Button disabled={!selectJobId || status !== 21} style={{ marginLeft: 20 }}>
                    取消
                  </Button>
                </Popconfirm>
              ) : null}
            </div>
          </div>
        </div>
      </Col>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>邀约记录/结果</h3>
          <div className={styles.scroll}>
            <Steps progressDot direction="vertical" current={10000}>
              {flowList &&
                flowList.length &&
                flowList.map(
                  (
                    { status, roundStartTime, remark, interviewConfirmTime, roundEndTime },
                    index
                  ) => (
                    <Step
                      title={`【${formatStatus(status)}】`}
                      description={
                        <div>
                          {roundStartTime ? <p>{`邀约外呼开始时间： ${roundStartTime}`}</p> : null}
                          {roundEndTime ? <p>{`邀约外呼结束时间： ${roundEndTime}`}</p> : null}
                          {interviewConfirmTime ? (
                            <p style={{color:'red',fontWeight:400}}>{`用户期望面试时间： ${interviewConfirmTime}`}</p>) :
                          null}
                          <p>{remark}</p>
                        </div>
                      }
                      key={index}
                    />
                  )
                )}
            </Steps>
          </div>
        </div>
      </Col>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>简历/人才标签</h3>
          <div className={styles.scroll} style={{ paddingTop: 15 }}>
            {labelList.length
              ? labelList.map((item, index) => (
                  <Tag color={colors[index]} key={index} style={{ marginBottom: 8 }}>
                    {item}
                  </Tag>
                ))
              : null}
          </div>
        </div>
      </Col>
    </Row>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(RecordBottom));
