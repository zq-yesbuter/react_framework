import React, { useState, useEffect, useImperativeHandle, useRef, Fragment } from 'react';
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
  Tooltip,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';
import ExportJsonExcel from 'js-export-excel';
import { upload, batchRelated } from '@/services/nameList';

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
function ImportModal({
  dispatch,
  visible,
  form,
  close,
  postList,
  value,
  onCancel,
  namelist,
  intent,
}) {
  const { ivrIntents } = namelist;
  const {
    getFieldDecorator,
    validateFields,
    resetFields,
    setFields,
    getFieldValue,
    setFieldsValue,
  } = form;
  const [fileList, setFileList] = useState([]);
  const [jobPostVisible, setJobPostVisible] = useState(false);

  // 导入名单
  function onSumbit() {
    validateFields((err, values) => {
      if (!err) {
        // const { triggerTime, scene } = values;
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
        fileList.forEach(file => {
          formData.append('file', file);
        });
        const { scene } =
          (ivrIntents && ivrIntents.length && ivrIntents.find(item => item.intent === intent)) ||
          {};
        const params = { intent, scene };
        upload({ formData, params })
          .then(({ success, successCount, errorCount, errorMessages }) => {
            let invitations = [];
            invitations = success.map(item => item.invitationId) || [];
            const { search } = window.location;
            // const batchName = decodeURI(search.slice(1));
            const { id, intent } = queryString.parse(search);
            if (invitations.length) {
              batchRelated({ id, intent, invitations, scene })
                .then(body => {
                  Modal.info({
                    title: '导入名单信息',
                    content: (
                      <div>
                        <p>{`导入成功${successCount}人`}</p>
                        {errorCount ? <p>{`导入失败${errorCount}人`}</p> : null}
                      </div>
                    ),
                    onOk() {},
                  });
                  // message.success('外呼文件导入成功并且设置成功');
                  dispatch({
                    type: 'namelist/fetchBatchDetail',
                    payload: { id, intent },
                  });
                  setFileList([]);
                })
                .catch(e => {});
            } else {
              message.error('外呼文件导入为空！');
            }
            resetFields();
            setFileList([]);
            onCancel();
          })
          .catch(e => message.error(e.message));
      }
    });
  }

  function beforeUpload(file) {
    const fileType = [
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

  function addJobPost() {
    setJobPostVisible(true);
  }
  function jobPostClose() {
    setJobPostVisible(false);
  }
  const uploadProps = {
    customRequest: () => {},
    onRemove,
    beforeUpload,
    fileList,
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }

  function intentChange() {
    setFieldsValue({ scene: null });
  }
  function formatTitle(intent) {
    switch (intent) {
      case 'first_entry_invitation':
        return '背调提醒';
      case 'interview_research_invitation':
        return '面试调研'
      case 'second_entry_invitation':
        return '入职提醒';
      case 'interview_invitation':
        return '面试邀约';
      default:
        return '外呼';
    }
  }

  function formatHeader(intent) {
    switch (intent) {
      case 'first_entry_invitation':
        return ['候选人姓名','电话','邮箱','时间（此列勿删，保持为空）','HR姓名','HR联系人电话','岗位（此列勿删，保持为空)'];
      case 'interview_research_invitation':
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','时间（此列勿删，保持为空）','HR姓名','HR联系人电话','岗位（此列勿删，保持为空）']
      case 'second_entry_invitation': 
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','入职时间','HR姓名','HR联系人电话','岗位（此列勿删，保持为空）']
      case 'interview_invitation':
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','面试时间','HR姓名','HR联系人电话','岗位']
      default:
        return ['候选人姓名','电话','邮箱','面试时间','HR姓名','HR联系人电话','岗位'];
    }
  }

  // 下载导入模版
  function templatedownload() {
    const { search } = window.location;
    const {intent}=queryString.parse(search);
    let option={};
    option.fileName = '导入模版';
    option.datas=[
      {
        sheetData:[],
        sheetName:'导入模版',
        // sheetFilter:['two','one'],
        sheetHeader:formatHeader(intent),
        columnWidths: [10, 10, 10, 10, 10, 10, 10],
      },
    ];
    
    const toExcel = new ExportJsonExcel(option); // new
    toExcel.saveExcel(); // 保存
  }
  // const intent = getFieldValue('intent');
  return (
    <Modal
      visible={!!value}
      title="导入名单"
      destroyOnClose
      width={550}
      onOk={_.debounce(onSumbit, 500)}
      onCancel={() => {
        setFileList([]);
        onCancel();
      }}
    >
      <Form {...formItemLayout}>
        <div style={{ textAlign: 'right' }}>
          <a style={{ cursor: 'pointer' }} onClick={_.debounce(templatedownload,500)}>模版下载</a>
        </div>
        {/* <Item label="选择类型">
          {getFieldDecorator('intent', {
            rules: [{ required: true, message: '请选择类型!' }],
          })(
            <Select 
              style={{ width: '300px' }}
              onChange={intentChange}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => <Option value={item.intent}>{item.intentDesc}</Option>)}
            </Select>
          )}
        </Item> */}
        {/* <Item label="选择模版">
          {getFieldDecorator('scence', {
            // rules: [{ required: true, message: '请选择模版!' }],
          })(
            <Select style={{ width: '200px' }}>
              <Option value="60">面试时间已分配</Option>
              <Option value="6=70">面试时间未分配</Option>
            </Select>
          )}
        </Item> */}
        {/* <Item label="外呼时间" required>
          {getFieldDecorator('triggerTime', {
            rules: [{ required: true, message: '请选择外呼时间!' }],
          })(
            <DatePicker
              showTime={{ format: 'HH:mm', minuteStep: 5 }}
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择外呼时间"
              style={{ width: 300 }}
            />
          )}
        </Item>
        <Item label="外呼场景">
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择外呼场景!' }],
          })(
            <Select
              style={{ width: '300px' }}
              placeholder="请选择外呼场景"
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.filter(item => item.intent === intent)
                      .map(({ scene,sceneDesc }) => {
                        return (
                          <Option value={scene} key={scene}>
                            {sceneDesc}
                          </Option>
                       );
                       })}
            </Select>
          )}
        </Item> */}
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
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
