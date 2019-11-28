import React, { useState, useEffect, Fragment } from 'react';
import {
  Radio,
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
  Upload,
  Icon,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
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
      title="导入简历"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        resetFields();
        close();
      }}
    >
      <Form {...formItemLayout}>
        <Item label="简历渠道" required>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选简历渠道!' }],
          })(
            <Select allowClear placeholder="请选择简历渠道">
              <Option key={1}>猎聘网</Option>
            </Select>
          )}
        </Item>
        <Item label="导入文件" required>
          {getFieldDecorator('file', {
            rules: [
              {
                required: true,
                message: '请选择导入文件!',
              },
            ],
          })(
            <Upload>
              <Button>
                <Icon type="upload" />
                选择文件
              </Button>
            </Upload>
          )}
        </Item>
        <Item label="导入人" required>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入导入人!' }],
          })(<Input placeholder="请输入导入人" />)}
        </Item>
        <Item label="简历岗位" required>
          {getFieldDecorator('name1', {
            rules: [{ required: true, message: '请输入部门和岗位名!' }],
          })(<Input placeholder="请输入部门和岗位名" />)}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
