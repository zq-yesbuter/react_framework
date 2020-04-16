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
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import queryString from 'query-string';
import {
  editSignel,
  addSignel,
  cancelSignel,
} from '@/services/nameList';
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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function SingleSet({
  form,
  dispatch,
  namelist: { jobList = [], selectJobId, listValue },
  location,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = form;
  const { applyId, status } = listValue || {};
  const { search } = window.location;
  const {group:invitationId,intent}=queryString.parse(search);
  
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

  function quitCancel() {
    resetFields();
  }
  function cancelOffer() {
    resetFields();
  }

  function formatFieldItem(intent) {
    switch (intent) {
      case ('first_entry_invitation',
      'second_entry_invitation',
      'interview_research_invitation',
      'offer_invitation'):
        return (
          <Fragment>
            {getFieldDecorator('triggerTime', {
              initialValue:
                status !== 11 && Object.keys(listValue).length
                  ? (listValue.triggerTime ? moment(listValue.triggerTime) : null)
                  : null,
            })(
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 5 }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择外呼时间"
                style={{ marginRight: 10 }}
              />
            )}
          </Fragment>
        );
      case 'interview_invitation':
        return (
          <Fragment>
            {getFieldDecorator('triggerTime', {
              initialValue:
              status !== 11 && Object.keys(listValue).length
              ? (listValue.triggerTime ? moment(listValue.triggerTime) : null)
              : null,
            })(
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 5 }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择外呼时间"
                style={{ marginRight: 10 }}
              />
            )}
            {/* {getFieldDecorator('diff', {
              initialValue:
              status !== 11 && Object.keys(listValue).length
              ? moment(listValue.endTime).diff(listValue.startTime, 'minutes')
              : 60,
            })(
              <InputNumber
                style={{ marginRight: 10 }}
                min={0}
                max={160}
                formatter={value => `${value}分钟`}
                parser={value => value.replace('分钟', '')}
              />
            )} */}
            {getFieldDecorator('startTime', {
              initialValue:
              status !== 11 && Object.keys(listValue).length
                ? (listValue.time ? moment(listValue.time) : null)
                : null,
            })(
              <DatePicker
                disabledDate={disabledDate}
                // disabledTime={disabledDateTime}
                showTime={{ format: 'HH:mm', minuteStep: 5 }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择面试时间"
                style={{ marginRight: 10 }}
              />
            )}
          </Fragment>
        );
      default:
        return (
          <Fragment>
            {getFieldDecorator('triggerTime', {
              initialValue:
                status !== 11 && Object.keys(listValue).length
                  ? moment(listValue.triggerTime) || null
                  : null,
            })(
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 5 }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择外呼时间"
                style={{ marginRight: 10 }}
              />
            )}
          </Fragment>
        );
    }
  }

  function inventOnSubmit() {
    validateFields((err, values) => {
      if (!err) {
        const { triggerTime } = values;
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        const { id, applyId, status } = jobList.find(item => item.applyId === selectJobId) || {};
        let payload = {
          triggerTime: values.triggerTime.format(format),
          intent,
        };
        if(intent === 'interview_invitation') {
          payload.startTime=values.startTime
        }
        if (status === 1) {
          if (listValue && listValue.triggerTime) {
            if (moment(listValue.triggerTime) < moment().add(10, 'minutes')) {
              message.error('当前时间和外呼时间差小于10分钟，无法更新！');
              return;
            }
            if(intent === 'interview_invitation' ){
              if (values.startTime < moment().add(10, 'minutes')) {
                message.error('当前时间和面试时间差小于10分钟，无法更新！');
                return;
              }
            }
          }
          payload = { ...payload, updateId: invitationId };
          editSignel(payload)
            .then(data => {
              message.success('修改邀约成功');
            })
            .catch(e => message.error(e.message));
        }
        addSignel(payload).then(data => {
          message.success('新增邀约成功');
        }).catch(e => message.error(e.message));
      }
    });
  }

  function cancelInventConfirm() {
    if (listValue && listValue.triggerTime) {
      if (moment(listValue.triggerTime) < moment().add(10, 'minutes')) {
        message.error('当前时间和外呼时间差小于10分钟，无法取消！');
        return;
      }
    }
 
    cancelSignel({ intent, updateId:invitationId })
      .then(data => {
          message.success('取消邀约成功!');
          setFieldsValue({ triggerTime: null });
          if(intent === 'interview_invitation') {
            setFieldsValue({ startTime: null });
          }
        })
        .catch(e => message.error(e.message));
  }
 
  const disabled = !(status === 1 || status === 0 || status === '1' || status === '0');
  return (
    <div className={styles['gutter-box']}>
      <h3>外呼时间</h3>
      <div>
        {formatFieldItem(intent)}
        <Button onClick={inventOnSubmit} disabled={disabled}>
          更新
        </Button>
        {!disabled ? (
          <Popconfirm
            title="外呼时间和面试时间均会被取消，确认要取消吗？"
            onConfirm={cancelInventConfirm}
            onCancel={quitCancel}
          >
            <Button disabled={disabled} style={{ marginLeft: 20 }}>
              取消
            </Button>
          </Popconfirm>
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(SingleSet));
