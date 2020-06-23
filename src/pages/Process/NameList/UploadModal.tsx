import React, { useState } from 'react';
import { Button, Form, Modal, Upload, Icon, message } from 'antd';
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

const sceneObj = {
  '12056': '实习生面试邀约',
  '12073': '面试提醒',
  '12063': '背调提醒',
  '12064': '入职提醒',
  '12065': '面试调研',
  '12072': '面试调研（新）',
  '12095': 'CHO校招offer确认',
  '12096': '京东健康面试邀约(医生助理)',
  '12097': '面试提醒(物流)',
  '12098': '背调提醒(物流)',
  '12099': '入职提醒(物流)',
};

interface Props {
  dispatch: Function;
  form: any;
  value: any;
  onCancel: Function;
  namelist: any;
  intent: string;
  scene: string;
}
interface Response {
  success?: any;
  successCount?: string | number;
  errorCount?: string | number;
  errorMessages?: string[];
}

function ImportModal(props: Props) {
  const { dispatch, form, value, onCancel, namelist, intent, scene } = props;
  const { ivrIntents } = namelist;
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;
  const [fileList, setFileList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 导入名单
  function onSumbit() {
    validateFields((err: Error) => {
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
        // const { scene } =
        //   (ivrIntents && ivrIntents.length && ivrIntents.find((item:{intent:string}) => item.intent === intent)) ||
        //   {};
        const params = { intent, scene };
        setConfirmLoading(true);
        upload({ formData, params })
          .then((response: Response) => {
            const { success, successCount, errorCount, errorMessages } = response;
            let invitations = [];
            invitations =
              success.map((item: { invitationId: string | number }) => item.invitationId) || [];
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
                        {errorCount ? (
                          <p>{`导入失败${errorCount}人${
                            errorMessages && errorMessages.length
                              ? `，错误原因【${errorMessages.join(',')}`
                              : ''
                          }】`}</p>
                        ) : null}
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
                .catch(e => {
                  setConfirmLoading(false);
                });
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

  function beforeUpload(file: any) {
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
    switch (scene) {
      case '14019': //'实习生面试邀约',
        return ['候选人姓名', '电话', '邮箱', '面试时间', 'HR姓名', 'HR联系人电话', '岗位'];
      case '12073':
      case '12097': //'面试提醒',面试提醒（物流）
        return [
          '姓名',
          '电话',
          '邮箱',
          '面试官',
          '面试时间',
          '面试地点',
          '需求名称',
          '岗位名称',
          '应聘部门',
          '招聘负责人',
        ];
      case '12063':
      case '12098': //'背调提醒',背调提醒（物流）
        return [
          '一级部门',
          '招聘负责人erp',
          '职级',
          '候选人姓名',
          '电话',
          '邮箱',
          '应聘状态',
          '发放offer日期',
          '接受offer日期',
          '入职时间',
          'HR姓名',
          'HR电话',
        ];
      case '12064':
      case '12099': //'入职提醒',入职提醒（物流）
        return [
          '一级部门',
          '招聘负责人erp',
          '职级',
          '候选人姓名',
          '电话',
          '邮箱',
          '应聘状态',
          '发放offer日期',
          '接受offer日期',
          '入职时间',
          'HR姓名',
          'HR电话',
        ];
      case '12065': //'面试调研',
        return ['候选人姓名', '电话', 'HR姓名', 'HR联系人电话'];
      case '12072': //'面试调研（新）',
        return ['候选人姓名', '电话', 'HR姓名', 'HR联系人电话'];
      case '12095': //CHO校招offer确认
        return ['候选人姓名', '电话', '邮箱', 'offer发放时间', 'HR姓名', 'HR联系人电话'];
      case '12096': //京东健康面试邀约（医生助理）
        return ['候选人姓名', '电话', '邮箱', '面试时间', 'HR姓名', 'HR联系人电话'];
      default:
        return ['候选人姓名', '电话', '邮箱', '面试时间', 'HR姓名', 'HR联系人电话', '岗位'];
    }
  }

  function formatData() {
    switch (scene) {
      case '14019': //'实习生面试邀约',
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: 'test@jd.com',
            four: '2020-04-20 09:00:00',
            five: '胡女士',
            six: '18608001700',
            seven: '软件开发工程师岗',
          },
        ];
      case '12073':
      case '12097': //'面试提醒',面试提醒（物流）
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: 'test@jd.com',
            four: '张三',
            five: '2020-05-26 22:38',
            six: '电话面试',
            seven: '智能城市事业部-新增名额-招聘需求（30人）',
            eight: '软件开发工程师岗',
            nine: '京东集团-京东数字科技-智能城市部-城市操作系统部',
            ten: 'jd007',
          },
        ];
      case '12063':
      case '12098': //'背调提醒',背调提醒（物流）
        return [
          {
            one: '智能城市事业部',
            two: 'jd007',
            three: 'p1',
            four: '张三',
            five: '18608001700',
            six: 'test@jd.com',
            seven: 'offer已发',
            eight: '2020-05-26 22:38',
            nine: '2020-05-26 22:38',
            ten: '2020-05-26 22:38',
            eleven: '胡女士',
            twelve: '18608001700',
          },
        ];
      case '12064':
      case '12099': //'入职提醒',入职提醒（物流）
        return [
          {
            one: '智能城市事业部',
            two: 'jd007',
            three: 'p1',
            four: '张三',
            five: '18608001700',
            six: 'test@jd.com',
            seven: 'offer已发',
            eight: '2020-05-26 22:38',
            nine: '2020-05-26 22:38',
            ten: '2020-05-26 22:38',
            eleven: '胡女士',
            twelve: '18608001700',
          },
        ];
      case '12065': //'面试调研',
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: '胡女士',
            four: '18608001700',
          },
        ];
      case '12072': //'面试调研（新）',
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: '胡女士',
            four: '18608001700',
          },
        ];
      case '12095': //CHO校招offer确认
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: 'test@jd.com',
            four: '2020-04-20 09:00:00',
            five: '胡女士',
            six: '18608001700',
          },
        ];
      case '12096': //京东健康面试邀约（医生助理）
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: 'test@jd.com',
            four: '2020-04-20 09:00:00',
            five: '胡女士',
            six: '18608001700',
          },
        ];
      default:
        return [
          {
            one: '梁主任',
            two: '18608001700',
            three: 'test@jd.com',
            four: '2020-04-20 09:00:00',
            five: '胡女士',
            six: '18608001700',
            seven: '软件开发工程师岗',
          },
        ];
    }
  }
  // 下载导入模版
  function templatedownload() {
    const { search } = window.location;
    // eslint-disable-next-line no-shadow
    const { intent } = queryString.parse(search);
    let option = {};
    option.fileName = `${sceneObj[scene]}导入模版`;
    option.datas = [
      {
        sheetData: formatData(scene),
        sheetName: '导入模版',
        // sheetFilter:['two','one'],
        sheetHeader: formatHeader(scene),
        columnWidths: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
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
          <a style={{ cursor: 'pointer' }} onClick={_.debounce(templatedownload, 500)}>
            {`${sceneObj[scene]}-模版下载`}
          </a>
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
