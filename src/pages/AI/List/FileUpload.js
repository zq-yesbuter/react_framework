import React, { useState, useEffect, useImperativeHandle,forwardRef, useRef } from 'react';
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
  Tabs,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { importFile } from '@/services/ai';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
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
function ImportModal({ dispatch, visible, form, close, postList,fileRef }) {
// console.log('refs===>',fileRef);
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const [fileList, setFileList] = useState([]);

  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(fileRef, () => ({
    // changeVal 就是暴露给父组件的方法
    handleOk: (newVal) => {
      validateFields((err, values) => {
        if (!err) {
        const { jobId } = values;
        if (!fileList.length) {
            setFields({
            fileName: {
                errors: [new Error('请上传外呼文件')],
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
        // console.log('fileList===>', fileList);
        fileList.forEach(file => {
            formData.append('resumeFile', file);
        });
        const urlParams = { jobId };
        importFile({ formData, urlParams })
            .then(data => {
            message.success('外呼文件导入成功');
            resetFields();
            setFileList([]);
            close();
            dispatch({
                type: 'chatrecord/jobAppliedAsPostAll',
            });
            })
            .catch(e => message.error(e.message));
        }
        });
    },
    handleCancel:  () => {
      resetFields();
      setFileList([]);
      close();
    },
  }));

  function beforeUpload(file) {
    // console.log('tile===>',file,file.type, file.size)
    const fileType = [
    //   '.doc',
      '.xls',
      '.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '',
      'application/vnd.ms-excel',
    //   'application/msword',
    //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const currentType = fileType.includes(file.type);
    if (!currentType) {
      message.error('只支持excel表格，请上传正确格式!');
      return false;
    }
    setFileList([file]);
    return false;
  }

  function onRemove(file) {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  }

  const uploadProps = {
    customRequest: () => {},
    onRemove,
    beforeUpload,
    fileList,
  };

  return (
    <Form {...formItemLayout}>
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
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(forwardRef(ImportModal)));
