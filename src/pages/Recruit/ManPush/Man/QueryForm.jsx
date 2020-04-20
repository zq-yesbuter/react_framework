import React, { PureComponent } from 'react';
import { Form, Button, DatePicker, Select, Input } from 'antd';
import { connect } from 'dva';
// import { statusOptions } from '../contant';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';

const { Option } = Select;
const FormItem = Form.Item;
const createForm = Form.create;
const statusOptions = [
  {value:'1',name:'已申请'},
  {value:'2',name:'已完成'},
  {value:'3',name:'已拒绝'},
  {value:'4',name:'已接受'},
]

function QueryForm({ form, formatResult, onSubmit }) {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };

  const { getFieldDecorator, getFieldValue, resetFields,setFieldsValue } = form;
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="搜索">
        {getFieldDecorator('batchName')(
          <Input placeholder="请输入任务名称" style={{width:200}} />
        )}
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
