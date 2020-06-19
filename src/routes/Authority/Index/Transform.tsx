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
        <Item {...formItemLayout} label="调整到的部门ID">
          {getFieldDecorator('updateId', {
            rules: [
              {
                required: true,
                message: '调整到的部门ID必填！',
              },
            ],
          })(<TrimInput placeholder="请输入调整到的部门ID" />)}
        </Item>
        <Item {...formItemLayout} label="被调整的人员">
          {getFieldDecorator('tenantId', {
            rules: [
              {
                required: true,
                message: '被调整的人员必填！',
              },
            ],
          })(<TrimInput placeholder="请输入被调整的人员ID" />)}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ auth = {} }) => ({ auth });
export default connect(mapStateToProps)(Form.create({})(Detail));
