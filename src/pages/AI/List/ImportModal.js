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
import { resumeApplyAsFile } from '@/services/ai';
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
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const [fileList, setFileList] = useState([]);

  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        console.log('values===>', values);
        const { jobId, channel } = values;
        if (!fileList.length) {
          setFields({
            fileName: {
              errors: [new Error('请上传简历文件')],
            },
          });
          return;
        }
        setFields({
          fileName: {
            errors: null,
          },
        });
        const formData = new FormData();
        fileList.forEach((file, index) => {
          formData.append(`resumeAttach${index}`, file);
        });
        // const params = {
        //   jobId,
        //   channel,
        //   resumeAttach:formData,
        // };
        formData.append('jobId', jobId);
        formData.append('channel', channel);
        resumeApplyAsFile(formData)
          .then(data => {
            message.success('简历导入成功');
            close();
          })
          .catch(e => message.error(e.message));
      }
    });
  }
  function beforeUpload(file) {
    console.log('文件格式==》', file.type, file.size);
    const fileType = [
      '.doc',
      '.docx',
      '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
    ];
    const currentType = fileType.includes(file.type);
    if (!currentType) {
      message.error('只支持word或pdf格式，请上传正确格式!');
      return false;
    }
    return true;
  }

  function uploadChange({ fileList, file }) {
    if (file.status === 'error') {
      const error = file.error.message || '未知错误';
      message.error(error);
      // setFileList(fileList)
    } else if (file.status === 'removed') {
      // setFileList(fileList)
    } else if (file.status !== undefined) {
      console.log('file.status==>', file.status);
      fileList = fileList.map(item => ({ ...item, status: 'done' }));
      setFileList(fileList);
    }
  }

  const uploadProps = {
    customRequest: () => {},
    beforeUpload,
    onChange: uploadChange,
    fileList,
  };
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
              <Option key="liepin">猎聘网</Option>
            </Select>
          )}
        </Item>
        <Item label="导入文件" required>
          {getFieldDecorator('fileName')(
            <Upload {...uploadProps}>
              {/* <Spin
                spinning={uploading}
                indicator={<Icon type="loading" style={{ fontSize: 24 }} />}
              > */}
              <Button>
                <Icon type="upload" />
                选择文件
              </Button>
              {/* </Spin> */}
            </Upload>
          )}
        </Item>
        <Item label="简历岗位" required>
          {getFieldDecorator('jobId', {
            rules: [{ required: true, message: '请输入部门和岗位名!' }],
          })(
            <Select allowClear placeholder="请选择岗位">
              {postList.length &&
                postList.map(({ jobId, name }) => <Option key={jobId}>{name}</Option>)}
            </Select>
          )}
        </Item>
        {/* <Item label="导入人" required>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入导入人!' }],
          })(<Input placeholder="请输入导入人" />)}
        </Item> */}
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
