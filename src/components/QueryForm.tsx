import React from 'react';
import { Form, Button, Select } from 'antd';
import { connect } from 'dva';
import TrimInput from './TrimInput';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  form: any;
  formatResult: any;
  onSubmit: any;
  namelist: any;
  value: any;
}
interface Item {
  type: string;
  label: string;
  key: string;
  placeholder: string;
  optionValue?: any;
}
function QueryForm(props: Props) {
  const { form, formatResult, onSubmit, value } = props;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };

  const { getFieldDecorator, resetFields } = form;

  function formatItem(item: Item) {
    const { type, label, key, placeholder, optionValue } = item;
    switch (type) {
      case 'input':
        return (
          <FormItem label={label}>
            {getFieldDecorator(key)(<TrimInput placeholder={placeholder} />)}
          </FormItem>
        );
      case 'select':
        return (
          <FormItem label={label}>
            {getFieldDecorator(key)(
              <Select placeholder={placeholder} style={{ width: 300 }}>
                {optionValue.map(() => (
                  <Option value={1} key={1}>
                    1
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        );
      default:
        return (
          <FormItem label={label}>
            {getFieldDecorator(key)(<TrimInput placeholder={placeholder} />)}
          </FormItem>
        );
    }
  }
  console.log(value);
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      {value.map((item: Item) => formatItem(item))}
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

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(QueryForm));
