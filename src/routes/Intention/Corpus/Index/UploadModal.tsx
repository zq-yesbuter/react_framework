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
  visible:boolean;
  cancel:Function;
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
    visible,
    cancel,
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
  const [fileList, setFileList] = useState([] as any[]);
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
            cancel && cancel();
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


  return (
    <Modal
      visible={visible}
      title="导入名单"
      destroyOnClose
      width={550}
      onOk={onSumbit}
      onCancel={() => {
        setFileList([]);
        cancel();
      }}
      confirmLoading={confirmLoading}
    >
      <Form {...formItemLayout}>
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
