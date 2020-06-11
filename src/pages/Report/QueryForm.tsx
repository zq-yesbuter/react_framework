import React from 'react';
import { Form, Button, DatePicker  } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

interface Props {
  form: any;
  onSubmit: any;
}
function QueryForm(props: Props) {
  const {
    form,
    onSubmit,
  } = props;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };
  const { getFieldDecorator, resetFields } = form;
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="时间">{getFieldDecorator('time',{
        initialValue:moment().set('month', 4) 
      })(
        <MonthPicker />)}</FormItem>
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

export default Form.create({})(QueryForm);
