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
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';
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
function ImportModal({ dispatch, visible, form, close, postList, value, onCancel, namelist,intent}) {
  const { ivrIntents } = namelist;
  const { getFieldDecorator, validateFields, resetFields, setFields, getFieldValue, setFieldsValue } = form;
  const [fileList, setFileList] = useState([]);
  const [jobPostVisible, setJobPostVisible] = useState(false);

  // 导入名单
  function onSumbit() {
    validateFields((err, values) => {
      if (!err) {
        console.log('values===>',values);
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
        // console.log('fileList===>', fileList);
        fileList.forEach(file => {
          formData.append('file', file);
        }); 
        const { scene } = ivrIntents && ivrIntents.length && ivrIntents.find(item => item.intent === intent) || {};
        const params = { intent, scene};
        console.log('params===>', params);
        upload({ formData, params })
          .then(({success}) => {
            console.log('data===>',success);
            let invitations=[];
            invitations=success.map(item => item.invitationId) || [];
            const { search } = window.location;
            // const batchName = decodeURI(search.slice(1));
            const {id,intent}=queryString.parse(search);
            if(invitations.length){
               batchRelated({id,intent,triggerTime:triggerTime.format('YYYY-MM-DD HH:mm:ss'),invitations}) 
              .then(body => {
                message.success('外呼文件导入成功并且设置成功');
              })
              .catch(e => {});
            }else{
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

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }

  function intentChange() {
    setFieldsValue({ scene: null });
  }

  // const intent = getFieldValue('intent');
  return (
    <Modal
      visible={!!value}
      title="导入名单"
      destroyOnClose
      width={550}
      onOk={onSumbit}
      onCancel={() => {
        // this.setState({ selectSource: [], categoryIconUrl: '' });
        onCancel();
      }}
    >
      <Form {...formItemLayout}>
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
export default connect(mapStateToProps)(Form.create({})(forwardRef(ImportModal)));
