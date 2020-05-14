import React from 'react';
import { Form, Button, Select } from 'antd';
import { connect } from 'dva';
import TrimInput from '../../../components/TrimInput';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  form: any;
  formatResult: any;
  onSubmit: any;
  namelist: any;
}
function QueryForm(props: Props) {
  const {
    form,
    formatResult,
    onSubmit,
    namelist: { resultList },
  } = props;
  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        onSubmit(typeof formatResult === 'function' ? formatResult(values) : values);
      }
    });
  };
  // // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  // useImperativeHandle(ref, () => ({
  //   // reset 就是暴露给父组件的方法
  //   reset: () => {
  //     const { getFieldDecorator, resetFields } = form;

  //   }
  // }));
  const { getFieldDecorator, resetFields } = form;
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem label="搜索">{getFieldDecorator('name')(<TrimInput placeholder='请输入场景名字' />)}</FormItem>
      <FormItem label="状态筛选">
        {getFieldDecorator('status')(
          <Select placeholder="请选择状态" style={{ width: 200 }}>
            <Option value={1} key={1}>
              1
            </Option>
          </Select>
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

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(QueryForm));
