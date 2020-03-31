import React, { PureComponent } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import mapValueToFields from '../../../utils/mapValueToFields';
import TrimInput from '../../../components/TrimInput';

const FormItem = Form.Item;
const createForm = Form.create;

function QueryForm({ form, formatResult, onSubmit }) {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };

  const { getFieldDecorator, getFieldValue, resetFields } = form;
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="任务状态">
        {getFieldDecorator('channel', {})(<TrimInput className="test-input-space-name" />)}
      </FormItem>
      <FormItem label="时间选项">
        {getFieldDecorator('channel', {})(<TrimInput className="test-input-space-name" />)}
      </FormItem>
      <FormItem label="人才搜索">
        {getFieldDecorator('channel', {})(<TrimInput className="test-input-space-name" />)}
      </FormItem>
      <FormItem>
        <Button htmlType="submit" type="primary" className="test-input-search">
          搜索
        </Button>
        <Button
          style={{ margin: '0 10px' }}
          className="test-input-search"
          onClick={e => {
            resetFields();
            handleSubmit(e);
          }}
        >
          重置
        </Button>
      </FormItem>
    </Form>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(QueryForm));
