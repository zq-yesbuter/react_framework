/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Spin,
  Col,
  Row,
  Form,
  DatePicker,
  Button,
  InputNumber,
  Steps,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './index.less';

const { Item } = Form;
const { Step } = Steps;
const { RangePicker } = DatePicker;
function formatStatus(status) {
  switch (status) {
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
function RecordBottom({ form, dispatch, chatrecord: { jobList = [], selectJobId, flowList } }) {
  const { getFieldDecorator, validateFields } = form;
  function onSubmit() {
    validateFields((err, values) => {
      if (!err) {
        const interviewStartTime = values.interviewStartTime.format('YYYY-MM-DD HH:mm:ss');
        const interviewEndTime = values.interviewStartTime
          .add(values.diff, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
        const { id, applyId } = jobList.find(item => item.applyId === selectJobId) || {};
        dispatch({
          type: 'chatrecord/addInvitation',
          payload: {
            applicantId: id,
            applyId,
            interviewStartTime,
            interviewEndTime,
            triggerTime: values.triggerTime.format('YYYY-MM-DD HH:mm:ss'),
          },
        })
          .then(data => {
            message.success('邀约成功');
          })
          .catch(e => message.error());
      }
    });
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  return (
    <Row gutter={8} style={{ marginLeft: 8, marginRight: 8 }}>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>计划邀约时间</h3>
          <div style={{ marginBottom: 10 }}>
            {getFieldDecorator('interviewStartTime')(
              <DatePicker
                showTime
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择计划邀约面试时间"
                style={{ display: 'block' }}
              />
            )}
          </div>
          <div style={{ marginBottom: 10 }}>
            {getFieldDecorator('diff', {
              initialValue: 60,
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
          <div style={{ marginBottom: 10 }}>
            {getFieldDecorator('triggerTime')(
              <DatePicker
                showTime
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择外呼时间"
                style={{ display: 'block' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onSubmit} disabled={!selectJobId}>
              更新
            </Button>
            {/* <Button disabled={!selectJobId} onClick={onSubmit}>外呼</Button> */}
          </div>
        </div>
      </Col>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']} style={{ display: 'relative' }}>
          <h3 style={{ display: 'fixed', zIndex: 100 }}>邀约记录/结果</h3>
          <Steps progressDot direction="vertical" current={100}>
            {flowList &&
              flowList.length &&
              flowList.map(({ status, roundStartTime, remark }, index) => (
                <Step
                  title={`【${formatStatus(status)}】${roundStartTime}`}
                  description={remark}
                  key={index}
                />
              ))}
          </Steps>
        </div>
      </Col>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>简历测评/人才标签</h3>
        </div>
      </Col>
    </Row>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(RecordBottom));
