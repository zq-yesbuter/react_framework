import React from 'react';
import { Form, Button, DatePicker  } from 'antd';
import moment from 'moment';
import {connect} from 'dva'; 
import { FormComponentProps } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
interface IFormComponentProps extends FormComponentProps {
  onSubmit: Function;
}
class QueryForm extends React.Component<IFormComponentProps> {
  constructor(props: IFormComponentProps) {
    super(props);
  }


  handleSubmit = (e: any) => {
    e.preventDefault();
    const {
      form,
      onSubmit,
    } = this.props;
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };
  render(){
    const {
      form,
      onSubmit,
    } = this.props;
    const { getFieldDecorator, resetFields } = form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
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
              this.handleSubmit(e);
            }}
          >
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }
  
}

export default connect(({
  namelist,
}: {
  namelist: any;
}) => {
  return {
    namelist,
  };
})(Form.create({})(QueryForm));
