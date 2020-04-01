import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  Fragment,
} from 'react';
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
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { importFile } from '@/services/ai';

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
function ImportModal({ dispatch, visible, form, close, postList, value, onCancel }) {
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const [fileList, setFileList] = useState([]);
  const [jobPostVisible, setJobPostVisible] = useState(false);

  function onSumbit() {
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
            onCancel();
            // dispatch({
            //   type: 'chatrecord/jobAppliedAsPostAll',
            // });
          })
          .catch(e => message.error(e.message));
      }
    });
  }

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

  return (
    <Modal
      visible={!!value}
      title="导入名单"
      destroyOnClose
      width={750}
      onOk={onSumbit}
      onCancel={() => {
        // this.setState({ selectSource: [], categoryIconUrl: '' });
        onCancel();
      }}
    >
      <Form {...formItemLayout}>
        <Item label="选择类型">
          {getFieldDecorator('type', {
            // rules: [{ required: true, message: '请选择类型!' }],
          })(
            <Select style={{ width: '200px' }}>
              <Option value="no">面试邀约</Option>
              <Option value="60">面试调研</Option>
            </Select>
          )}
        </Item>
        <Item label="选择模版">
          {getFieldDecorator('scence', {
            // rules: [{ required: true, message: '请选择模版!' }],
          })(
            <Select style={{ width: '200px' }}>
              <Option value="60">面试时间已分配</Option>
              <Option value="6=70">面试时间未分配</Option>
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
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(forwardRef(ImportModal)));
