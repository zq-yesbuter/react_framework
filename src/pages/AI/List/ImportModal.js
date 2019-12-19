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
  message,
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
function ImportModal({ dispatch, visible, form, close, postList }) {
  const { getFieldDecorator, validateFields, resetFields } = form;
  const { fileList, setFileList } = useState([]);

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
  function beforeUpload(file) {
    console.log('文件格式==》', file.type);
    const fileType = ['pdf', 'word', 'excel', 'doc', 'docs'];
    const currentType = fileType.includes(file.type);
    if (!currentType) {
      message.error('请上传正确格式!');
      const files = form.getFieldValue('file');
      console.log('files===>', files);
      form.setFields({
        file: {
          value: files,
          // errors: [new Error('forbid ha')],
        },
      });
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    // return currentType && isLt2M;
  }
  function uploadChange({ file, fileList }) {
    if (file.status === 'uploading') {
      const files = form.getFieldValue('file');
      console.log('files===>', files);
      form.setFields({
        file: {
          value: files,
          // errors: [new Error('forbid ha')],
        },
      });
      console.log('notuploading===>', file, fileList, [...fileList, file]);
    }
    if (file.status === 'done') {
      console.log('done====>', file, fileList, [...fileList, file]);
    }
  }
  const uploadProps = {
    customRequest: () => {},
    beforeUpload,
    onChange: uploadChange,
    // defaultFileList: [
    //   {
    //     uid: '1',
    //     name: 'xxx.png',
    //     status: 'done',
    //     response: 'Server Error 500', // custom error message to show
    //     url: 'http://www.baidu.com/xxx.png',
    //   },
    //   {
    //     uid: '2',
    //     name: 'yyy.png',
    //     status: 'done',
    //     url: 'http://www.baidu.com/yyy.png',
    //   },
    //   {
    //     uid: '3',
    //     name: 'zzz.png',
    //     // status: 'error',
    //     response: 'Server Error 500', // custom error message to show
    //     url: 'http://www.baidu.com/zzz.png',
    //   },
    // ],
    // fileList,
    // directory: true,
  };
  function normFile(e) {
    // console.log('Upload event:===>', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
          {getFieldDecorator('channel', {
            rules: [{ required: true, message: '请选简历渠道!' }],
          })(
            <Select allowClear placeholder="请选择简历渠道">
              <Option key={1}>猎聘网</Option>
            </Select>
          )}
        </Item>
        <Item label="导入文件" required>
          {/* {getFieldDecorator('file', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
            rules: [
              {
                required: true,
                message: '请选择导入文件!',
              },
            ],
          })( */}
          <Upload {...uploadProps} multiple>
            <Button>
              <Icon type="upload" />
              选择文件
            </Button>
          </Upload>
          {/* )} */}
        </Item>
        {/* <Item label="导入人" required>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入导入人!' }],
          })(<Input placeholder="请输入导入人" />)}
        </Item> */}
        <Item label="简历岗位" required>
          {getFieldDecorator('jobId', {
            rules: [{ required: true, message: '请输入部门和岗位名!' }],
          })(
            <Select allowClear placeholder="请输入岗位">
              {postList.length && postList.map(({jobId,name}) => <Option key={jobId}>{name}</Option>)}
            </Select>)}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
