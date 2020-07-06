import React from 'react';
import { Form, Button, DatePicker ,TreeSelect } from 'antd';
import moment from 'moment';
import {connect} from 'dva'; 
import { FormComponentProps } from 'antd/lib/form/Form';

const { TreeNode } = TreeSelect;
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
interface IFormComponentProps extends FormComponentProps {
  onSubmit: Function;
  report: any;
  user: any;
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
  loop = (data) => {
    return data && data.map(item => {
      const title = (
        <span className="title">{item.name}</span>
      );
      if (item.children && item.children.length) {
        return (
          <TreeNode value={item.tenantId} title={title} item={item}>
            {this.loop(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode value={item.tenantId} title={title} item={item} />;
      }
    });
  };
  render(){
    const {
      form,
      onSubmit,
      report: {treeDepartList},
      user: {currentUser = {}},
    } = this.props;
    const { getFieldDecorator, resetFields } = form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="所属部门">
          {getFieldDecorator('tenantId', {
            initialValue:currentUser.tenantId,
          })(<TreeSelect
            showSearch
            style={{ width: 200 }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
            // onChange={this.onChange}
          >
            {this.loop(treeDepartList)}
          </TreeSelect>)}
        </FormItem>
        <FormItem label="时间">{getFieldDecorator('time',{
          initialValue:moment(),
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
  report,
  user,
}: {
  report: any;
  user: any;
}) => {
  return {
    report,
    user,
  };
})(Form.create({})(QueryForm));
