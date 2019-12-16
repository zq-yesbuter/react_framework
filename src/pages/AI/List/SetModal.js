import React, { useState, useEffect, Fragment } from 'react';
import {
  List,
  Spin,
  Input,
  Button,
  Table,
  Card,
  Checkbox,
  Select,
  Divider,
  Menu,
  Dropdown,
  Form,
  Modal,
  Icon,
  InputNumber,
  DatePicker,
  Tag,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { MonthPicker, RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
function ImportModal({ dispatch, visible, form, close }) {
  const { getFieldDecorator, validateFields, resetFields } = form;
  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        // console.log('values===>', values);
        // dispatch({
        //   type: 'planControl/saveWxUser',
        //   payload: {
        //     operatorId,
        //     type,
        //     userIds,
        //   },
        // }).then(() => {
        //   handleOk();
        // }).catch(() => {});
      }
    });
  }
  return (
    <Modal
      title="设置邀约时间"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        resetFields();
        close();
      }}
    >
      <Form {...formItemLayout}>
        <Item label="邀约人数" required>
          <Fragment>
            <Tag color="cyan">cyan</Tag>
          </Fragment>
        </Item>
        <Item label="可选时段" required>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择时段!' }],
          })(
            <RangePicker
              // disabledDate={disabledDate}
              // disabledTime={disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          )}
        </Item>
        <Item label="面试时长">
          {getFieldDecorator('name2', {
            initialValue: 100,
          })(
            <InputNumber
              style={{ flex: 1 }}
              min={0}
              max={100}
              formatter={value => `${value}分钟`}
              parser={value => value.replace('分钟', '')}
            />
          )}
        </Item>
        <Item label="短信发送" required>
          {getFieldDecorator('name', {
            defaultValue: 1,
            rules: [{ required: true, message: '请输入导入人!' }],
          })(
            <Select>
              <Option value="1">立即发送</Option>
            </Select>
          )}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
