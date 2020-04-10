import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select ,DatePicker} from 'antd';
import moment from 'moment';
import mapValueToFields from '@/utils/mapValueToFields';
import TrimInput from '@/components/TrimInput';

const Option = Select.Option;
const { Item } = Form;

function AddFormModal({ dispatch, form, onCancel, onSubmit, value ,namelist}) {
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

  const { getFieldDecorator, getFieldValue } = form;

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
          })(<TrimInput className="test-input-space-name" placeholder="请输入任务名" />)}
        </Item>
        {/* <Item label="外呼类型" {...formItemLayout}>
          {getFieldDecorator('intent', {
            rules: [{ required: true, message: '请选择面试时长!' }],
          })(
            <Select
              style={{ width: '300px' }}
              placeholder="请选择外呼类型"
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => <Option value={item.intent}>{item.intentDesc}</Option>)}
            </Select>
          )}
        </Item>
        <Item label="外呼场景" {...formItemLayout}>
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择外呼场景!' }],
          })(
            <Select
              style={{ width: '300px' }}
              placeholder="请选择外呼场景"
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => <Option value={item.scene}>{item.sceneDesc}</Option>)}
            </Select>
          )}
        </Item>
        <Item label="外呼时间" required>
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
        </Item> */}
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(AddFormModal));
