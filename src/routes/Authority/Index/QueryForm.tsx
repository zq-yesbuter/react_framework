import React from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';
import TrimInput from '../../../components/TrimInput';

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
      <FormItem label="账号">
        {getFieldDecorator('loginName')(
          <TrimInput placeholder="请输入账号" style={{width:200}} />
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
