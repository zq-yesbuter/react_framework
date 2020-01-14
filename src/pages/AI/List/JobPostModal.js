import React from 'react';
import {
  Input,
  Form,
  Modal,
  message,
} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { addJobPost } from '@/services/ai';
import styles from './index.less';

const { Item } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
function ImportModal({ dispatch, visible, form, close }) {
  const { getFieldDecorator, validateFields, resetFields, setFields } = form;

  function handleOk(){
    validateFields((err, values) => {
      if (!err) {
        addJobPost(values)
          .then(data => {
              message.success('添加岗位成功！');
              resetFields();
              close();
              dispatch({
                  type: 'chatrecord/queryInformation',
                  payload:{pageNum:1,pageSize:100},
              });
          })
          .catch(e => message.error(e.message));
        }
      });
  }

  return (
    <Modal
      title="添加岗位"
      visible={visible}
      onOk={handleOk}
      onCancel={close}
    >
      <Form {...formItemLayout}>
        <Item label="岗位名称" required>
          {getFieldDecorator('jobName')(<Input />)}
        </Item>
        <Item label="岗位描述">
          {getFieldDecorator('jobDesc')(<TextArea rows={7} />)}
        </Item>
      </Form>
    </Modal>

  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
