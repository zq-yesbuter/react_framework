import React from 'react';
import { Form, Button, Select } from 'antd';
import { connect } from 'dva';
import TrimInput from '../../../components/TrimInput';
import { statusOptions } from '../contant';
import DateTimeRangePicker from '@/components/DateTimeRangePicker';

const { Option } = Select;
const FormItem = Form.Item;

interface Props {
  form: any;
  formatResult: any;
  onSubmit: any;
}
function QueryForm(props:Props) {
  const { form, formatResult, onSubmit } = props;
  const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };

  const { getFieldDecorator, resetFields } = form;
  return (
    <Form 
      layout="inline" 
      onSubmit={handleSubmit}>
      <FormItem label="任务名称">
        {getFieldDecorator('batchName')(
          <TrimInput placeholder="请输入任务名称" style={{width:200}} />
        )}
      </FormItem>
      <FormItem label="任务状态">
        {getFieldDecorator('status')(
          <Select allowClear placeholder="请选择任务状态" style={{width:200}}>
            {statusOptions.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)}
          </Select>)}
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
      {/* <FormItem label="人才搜索">
        {getFieldDecorator('channel', {})(<TrimInput className="test-input-space-name" />)}
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