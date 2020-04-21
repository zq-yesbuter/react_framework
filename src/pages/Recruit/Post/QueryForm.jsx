import React, { PureComponent } from 'react';
import { Form, Button, DatePicker, Select, Input } from 'antd';
import { connect } from 'dva';
import mapValueToFields from '../../../utils/mapValueToFields';
import TrimInput from '../../../components/TrimInput';
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
      <FormItem label="时间筛选"> 
        <DateTimeRangePicker
          names={['dateStart', 'dateEnd']}
          form={form}
        />
      </FormItem>
      <FormItem label="状态筛选">
        {getFieldDecorator('status')(
          <Select allowClear placeholder="请选择状态" style={{width:200}}>
            {statusOptions.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
          </Select>)}
      </FormItem>
      <FormItem label="岗位搜索">
        {getFieldDecorator('batchName')(
          <Input placeholder="请输入岗位" style={{width:200}} />
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
