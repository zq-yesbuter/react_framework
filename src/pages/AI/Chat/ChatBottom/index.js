/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Spin, Col, Row, Form, DatePicker, Button, InputNumber, Steps } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import styles from './index.less';

const { Item } = Form;
const { Step } = Steps;
const { RangePicker } = DatePicker;
const result = [
  {
    title: moment().format('YYYY-MM-DD HH:mm'),
    description: '发送短信',
    id: '1',
  },
  {
    title: moment().format('YYYY-MM-DD HH:mm'),
    description: '发送短信',
    id: '2',
  },
  {
    title: moment().format('YYYY-MM-DD HH:mm'),
    description: '发送短信',
    id: '3',
  },
  {
    title: moment().format('YYYY-MM-DD HH:mm'),
    description: '发送短信',
    id: '4',
  },
];
function RecordBottom({ form }) {
  const { getFieldDecorator, validateFields } = form;
  function onSubmit() {
    validateFields((err, values) => {
      if (!err) {
        // console.log('values====>', values);
      }
    });
  }
  return (
    <Row gutter={16} style={{ marginLeft: 20, marginRight: 20 }}>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>计划邀约时间</h3>
          <Item>
            {getFieldDecorator('name1')(
              <DatePicker showTime placeholder="选择计划邀约时间" style={{ width: '100%' }} />
            )}
          </Item>
          <Item>
            {getFieldDecorator('name2', {
              initialValue: 100,
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                formatter={value => `${value}分钟`}
                parser={value => value.replace('分钟', '')}
              />
            )}
          </Item>
          <Button onClick={onSubmit} block>
            发送邀约短信
          </Button>
        </div>
      </Col>
      <Col className={styles['gutter-row']} span={8}>
        <div className={styles['gutter-box']}>
          <h3>邀约记录/结果</h3>
          <Steps progressDot direction="vertical" current={5}>
            {result.map(({ title, description, id }) => (
              <Step title={title} description={description} key={id} />
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
