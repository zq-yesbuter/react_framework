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
  Tabs,
  Radio,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { MonthPicker, RangePicker } = DatePicker;
const { TabPane } = Tabs;
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
function ImportModal({ visible, form, close, handleOk }) {
  const { getFieldDecorator, validateFields, resetFields } = form;

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (
    <Modal
      title="列表筛选"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        resetFields();
        close();
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="邀约状态" key="1">
          <Radio.Group>
            <Radio style={radioStyle} value={1}>
              邀约成功
            </Radio>
            <Radio style={radioStyle} value={2}>
              邀约失败
            </Radio>
          </Radio.Group>
        </TabPane>
        <TabPane tab="导入时间" key="2">
          <RangePicker
            // disabledDate={disabledDate}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
