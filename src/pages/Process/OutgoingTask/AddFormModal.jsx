import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select ,DatePicker,Input} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import mapValueToFields from '@/utils/mapValueToFields';
import TrimInput from '@/components/TrimInput';

const Option = Select.Option;
const { Item } = Form;

function AddFormModal({ dispatch, form, onCancel, onSubmit, value ,namelist,submitLoading}) {
  const { ivrIntents } = namelist;
  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit && onSubmit(values);
      }
    });
  };

  const { getFieldDecorator, getFieldValue,setFieldsValue } = form;

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }
  const sourceId = getFieldValue('terminalType');
  getFieldDecorator('id');
  function intentChange(e) {
    setFieldsValue({ scene: null });
  }
  const intent = getFieldValue('intent');
  return (
    <Modal
      visible={!!value}
      title={getFieldValue('id') ? '修改任务' : '添加任务'}
      destroyOnClose
      width={550}
      onOk={handleSubmit}
      onCancel={() => {
        // this.setState({ selectSource: [], categoryIconUrl: '' });
        onCancel();
      }}
      confirmLoading={submitLoading}
    >
      <Form layout="horizontal">
        <Item {...formItemLayout} label="任务名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '任务名必填！',
              },
            ],
          })(<Input placeholder="请输入任务名" />)}
        </Item>
        <Item label="外呼类型" {...formItemLayout}>
          {getFieldDecorator('intent', {
            rules: [{ required: true, message: '请选择外呼类型!' }],
          })(
            <Select
              placeholder="请选择外呼类型"
              onChange={() => {intentChange()}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => <Option value={item.intent} key={item.intent}>{item.intentDesc}</Option>)}
            </Select>
          )}
        </Item>
        <Item label="外呼场景" {...formItemLayout}>
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择外呼场景!' }],
          })(
            <Select
              // style={{ width: '300px' }}
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
        </Item>
        {/* <Item label="外呼时间" required {...formItemLayout}>
          {getFieldDecorator('triggerTime', {
            rules: [{ required: true, message: '请选择外呼时间!' }],
          })(
            <DatePicker
              showTime={{ format: 'HH:mm', minuteStep: 5 }}
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择外呼时间"
              style={{ width: 335 }}
            />
          )}
        </Item> */}
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(AddFormModal));
