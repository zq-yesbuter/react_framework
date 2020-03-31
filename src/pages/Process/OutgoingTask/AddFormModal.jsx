import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select } from 'antd';
import mapValueToFields from '@/utils/mapValueToFields';
import TrimInput from '@/components/TrimInput';

const FormItem = Form.Item;
const Option = Select.Option;

function AddFormModal({ dispatch, form, onCancel, onSubmit, value }) {
  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      const { keywords } = values;
      values.keywords = typeof keywords === 'string' ? keywords : keywords.join(',');
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
        <FormItem {...formItemLayout} label="任务名">
          {getFieldDecorator('keywords', {
            rules: [
              {
                required: true,
                message: '任务名必填！',
              },
            ],
          })(<TrimInput className="test-input-space-name" placeholder="请输入任务名" />)}
        </FormItem>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(AddFormModal));
