import React, { useState } from 'react';
import {
  Button,
  Form,
  Modal,
  Upload,
  Icon,
  message,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import ExportJsonExcel from 'js-export-excel';
import queryString from 'query-string';
import { upload, batchRelated } from '@/services/nameList';

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

interface Props {
  dispatch: Function;
  form:any;
  value:any;
  onCancel:Function;
  namelist:any;
  intent:string;
}
interface Response {
  success?:any;
  successCount?:string|number;
  errorCount?:string|number;
  errorMessages?:string[];
}

function ImportModal(props:Props) {
  const {
    dispatch,
    form,
    value,
    onCancel,
    namelist,
    intent,
  } = props;
  const { ivrIntents } = namelist;
  const {
    getFieldDecorator,
    validateFields,
    resetFields,
    setFields,
  } = form;
  const [fileList, setFileList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 导入名单
  function onSumbit() {
    validateFields((err:Error) => {
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
          (ivrIntents && ivrIntents.length && ivrIntents.find((item:{intent:string}) => item.intent === intent)) ||
          {};
        const params = { intent, scene };
        setConfirmLoading(true);
        upload({ formData, params })
          .then((response:Response) => {
            const { success, successCount, errorCount, errorMessages } = response;
            let invitations = [];
            invitations = success.map((item:{invitationId:string|number}) => item.invitationId) || [];
            const { search } = window.location;
            // const batchName = decodeURI(search.slice(1));
            const { id } = queryString.parse(search);
            if (invitations.length) {
              batchRelated({ id, intent, invitations, scene })
                .then(() => {
                  Modal.info({
                    title: '导入名单信息',
                    content: (
                      <div>
                        <p>{`导入成功${successCount}人`}</p>
                        {errorCount ? <p>{`导入失败${errorCount}人${errorMessages && errorMessages.length ? `，错误原因【${errorMessages.join(',')}` : ''}】`}</p> : null}
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
                  setConfirmLoading(false);
                })
                .catch(e => {setConfirmLoading(false);});
            } else {
              message.error('外呼文件导入为空！');
              setConfirmLoading(false);
            }
            resetFields();
            setFileList([]);
            onCancel && onCancel();
          })
          .catch(e => {
            message.error(e.message);
            setConfirmLoading(false);
          });
      }
    });
  }

  function beforeUpload(file:any) {
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

  const uploadProps = {
    customRequest: () => {},
    onRemove,
    beforeUpload,
    fileList,
  };

  function formatHeader() {
    switch (intent) {
      case 'first_entry_invitation':
        return ['候选人姓名','电话','邮箱','时间（此列勿删，保持为空）','HR姓名','HR联系人电话','岗位（此列勿删，保持为空)'];
      case 'interview_research_invitation':
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','时间（此列勿删，保持为空）','HR姓名','HR联系人电话','岗位（此列勿删，保持为空）']
      case 'second_entry_invitation': 
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','入职时间（格式需精确到秒，保持如下格式）','HR姓名','HR联系人电话','岗位（此列勿删，保持为空）']
      case 'interview_invitation':
        return ['候选人姓名','电话','邮箱（此列勿删，保持为空）','面试时间（格式需精确到秒，保持如下格式）','HR姓名','HR联系人电话','岗位']
      default:
        return ['候选人姓名','电话','邮箱','面试时间（格式需精确到秒,保持如下格式）','HR姓名','HR联系人电话','岗位'];
    }
  }

   function formatData() {
    switch (intent) {
      case 'first_entry_invitation':
        return [{one:'梁主任',two:'18608001700',three:'test@jd.com',four:'',five:'胡女士',six:'18608001700',seven:''}];
      case 'interview_research_invitation':
       return [{one:'梁主任',two:'18608001700',three:'',four:'',five:'胡女士',six:'18608001700',seven:''}];
      case 'second_entry_invitation': 
        return [{one:'梁主任',two:'18608001700',three:'',four:'2020-04-20 09:00:00',five:'胡女士',six:'18608001700',seven:''}];
      case 'interview_invitation':
       return [{one:'梁主任',two:'18608001700',three:'',four:'2020-04-20 09:00:00',five:'胡女士',six:'18608001700',seven:'产品岗'}];
      default:
        return [{one:'梁主任',two:'18608001700',three:'test@jd.com',four:'2020-04-20 09:00:00',five:'胡女士',six:'18608001700',seven:'产品岗'}];
    }
  }
  // 下载导入模版
  function templatedownload() {
    const { search } = window.location;
    // eslint-disable-next-line no-shadow
    const {intent}=queryString.parse(search);
    let option={};
    option.fileName = '导入模版';
    option.datas=[
      {
        sheetData:formatData(intent),
        sheetName:'导入模版',
        // sheetFilter:['two','one'],
        sheetHeader:formatHeader(intent),
        columnWidths: [10, 10, 10, 10, 10, 10, 10],
      },
    ];
    
    const toExcel = new ExportJsonExcel(option); // new
    toExcel.saveExcel(); // 保存
  }
  return (
    <Modal
      visible={!!value}
      title="导入名单"
      destroyOnClose
      width={550}
      onOk={onSumbit}
      onCancel={() => {
        setFileList([]);
        onCancel();
      }}
      confirmLoading={confirmLoading}
    >
      <Form {...formItemLayout}>
        <div style={{ textAlign: 'right' }}>
          <a style={{ cursor: 'pointer' }} onClick={_.debounce(templatedownload,500)}>模版下载</a>
        </div>
        <Item label="导入文件" required>
          {getFieldDecorator('fileName')(
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" />
                选择文件
              </Button>
            </Upload>
          )}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
