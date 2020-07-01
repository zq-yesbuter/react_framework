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
function ImportModal({ dispatch, visible, form, cancel }) {
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
      title="单条新增"
      visible={visible}
      onOk={handleOk}
      onCancel={cancel}
    >
      <Form {...formItemLayout}>
        <Item label="词汇ID" required>
          {getFieldDecorator('jobName')(<Input style={{width:300}} />)}
        </Item>
        <Item label="词汇内容">
          {getFieldDecorator('jobDesc')(<Input style={{width:300}} />)}
        </Item>
      </Form>
    </Modal>

  );
}
const mapStateToProps = ({ intent = {} }) => ({ intent });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
