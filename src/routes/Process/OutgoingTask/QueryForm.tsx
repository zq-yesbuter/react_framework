import React from 'react';
import { Form, Button, Select, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { FormComponentProps } from 'antd/lib/form/Form';
import { statusOptions } from '../contant';
import DateTimeRangePicker from '@/components/DateRangePicker';

const { Option } = Select;
const FormItem = Form.Item;
const now = moment().subtract(14, 'days');
const deadLine = moment();
const format = 'YYYY-MM-DD';

interface IFormComponentProps extends FormComponentProps {
  onSubmit: Function;
}
class QueryForm extends React.Component<IFormComponentProps> {
  constructor(props: IFormComponentProps) {
    super(props);
  }

  handleSubmit = () => {
    const { form, onSubmit } = this.props;
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator, resetFields } = form;
    return (
      <Form layout="inline">
        <FormItem label="任务名称">
          {getFieldDecorator('batchName')(
            <Input placeholder="请输入任务名称" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem label="任务状态">
          {getFieldDecorator('status')(
            <Select allowClear placeholder="请选择任务状态" style={{ width: 200 }}>
              {statusOptions.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="时间选项">
          <DateTimeRangePicker
            names={['dateStart', 'dateEnd']}
            form={form}
            options={[
              {
                initialValue: now.format(format),
              },
              {
                initialValue: deadLine.format(format),
              },
            ]}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit}>
            搜索
          </Button>
          <Button
            style={{ margin: '0 10px' }}
            onClick={(e) => {
              resetFields();
              this.handleSubmit();
            }}
          >
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default connect(({ namelist }: { namelist: any }) => {
  return {
    namelist,
  };
})(Form.create({})(QueryForm));
