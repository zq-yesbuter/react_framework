import React, { PureComponent } from 'react';
import { Form, Button, DatePicker, Select, Input } from 'antd';
import { connect } from 'dva';
import mapValueToFields from '../../../utils/mapValueToFields';
import TrimInput from '../../../components/TrimInput';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';

const FormItem = Form.Item;
const createForm = Form.create;
const { Option } = Select;
const statusOptions = [
  {value:1,name:'已申请'},
  {value:2,name:'已完成'},
  {value:3,name:'已拒绝'},
  {value:4,name:'已接受'},
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

  const { getFieldDecorator, getFieldValue, resetFields } = form;
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="人才搜索">
        {getFieldDecorator('name')(<Input />)}
      </FormItem>
      <FormItem label="时间选项">
        <DateTimeRangePicker
          names={['dateStart', 'dateEnd']}
          form={form}
        />
        {/* {getFieldDecorator('triggerTime', {})(
          <DatePicker
            // showTime={{ format: 'HH:mm', minuteStep: 5 }}
            // disabledDate={disabledDate}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            style={{ width:250 }}
          />)} */}
      </FormItem>
      <FormItem label="状态筛选">
        {getFieldDecorator('status')( 
          <Select placeholder="请选择状态" style={{width:200}}>
            {statusOptions.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
          </Select>)}
      </FormItem>
      {/* <FormItem label="挂机原因">
        {getFieldDecorator('channel2', {})(
          <Select allowClear placeholder="请选择岗位" style={{width:200}}>
            <Option value={null}>全部</Option>
          </Select>)}
      </FormItem>
      <FormItem label="岗位筛选">
        {getFieldDecorator('channel3', {})(
          <Select allowClear placeholder="请选择岗位" style={{width:200}}>
            <Option value={null}>全部</Option>
          </Select>)}
      </FormItem> */}
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
