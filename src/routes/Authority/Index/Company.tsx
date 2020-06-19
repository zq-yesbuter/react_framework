import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal } from 'antd';
import _ from 'lodash';
import TrimInput from '@/components/TrimInput';

const { Item } = Form;

interface Props {
  form: any;
  onCancel: any;
  onSubmit: any;
  value: any;
  namelist: any;
  submitLoading: boolean;
}
interface Item {
  scene: string;
  sceneDesc: string;
}
function Detail(props: Props) {
  const { form, onCancel, onSubmit, value, submitLoading } = props;
  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        if (onSubmit) {
          onSubmit(values);
        }
      }
    });
  };

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  getFieldDecorator('id');

  return (
    <Modal
      visible={!!value}
      title={getFieldValue('id') ? '修改部门' : '添加部门'}
      destroyOnClose
      width={550}
      onOk={handleSubmit}
      onCancel={() => {
        // this.setState({ selectSource: [], categoryIconUrl: '' });
        onCancel();
      }}
      confirmLoading={submitLoading}
    >
      <Form layout="horizontal">
        <Item {...formItemLayout} label="部门名称">
          {getFieldDecorator('organizationName', {
            rules: [
              {
                required: true,
                message: '部门名称必填！',
              },
            ],
          })(<TrimInput placeholder="请输入部门名称" />)}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ auth = {} }) => ({ auth });
export default connect(mapStateToProps)(Form.create({})(Detail));
