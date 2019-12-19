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
    sm: { span: 18 },
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
      onOk={() => {
        validateFields((err, values) => {
          if (!err) {
            const { setDateStart, status, setDateEnd } = values;
            handleOk(setDateStart, status, setDateEnd);
            close();
          }
        });
      }}
      onCancel={() => {
        resetFields();
        handleOk(undefined, undefined, undefined);
        close();
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="邀约状态" key="1">
          <Item>
            {getFieldDecorator('status')(
              <Radio.Group>
                <Radio style={radioStyle} value={21}>
                  已申请（邀约阶段）
                </Radio>
                <Radio style={radioStyle} value={22}>
                  已邀约（邀约阶段）
                </Radio>
                <Radio style={radioStyle} value={23}>
                  已拒绝（邀约阶段）
                </Radio>
                <Radio style={radioStyle} value={24}>
                  已接受（邀约阶段）
                </Radio>
              </Radio.Group>
            )}
          </Item>
        </TabPane>
        <TabPane tab="导入时间" key="2">
          <Item label="导入开始时间">
            {getFieldDecorator('setDateStart')(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择导入开始时间"
                style={{ display: 'block' }}
              />
            )}
          </Item>
          <Item label="导入结束时间">
            {getFieldDecorator('setDateEnd')(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择导入结束时间"
                style={{ display: 'block' }}
              />
            )}
          </Item>
        </TabPane>
      </Tabs>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
