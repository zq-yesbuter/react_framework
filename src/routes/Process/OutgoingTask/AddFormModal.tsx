import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select } from 'antd';
import _ from 'lodash';
import TrimInput from '@/components/TrimInput';
import { unique } from './utils';

const { Option } = Select;
const { Item } = Form;

interface Props {
  form: any;
  onCancel: any;
  onSubmit: any;
  value: boolean | undefined;
  namelist: any;
  submitLoading: boolean;
}
interface Item {
  scene: string;
  sceneDesc: string;
}
function AddFormModal(props: Props) {
  const { form, onCancel, onSubmit, value, namelist, submitLoading } = props;
  const { ivrIntents } = namelist;
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
  function intentChange() {
    setFieldsValue({ scene: null });
  }

  const intent = getFieldValue('intent');
  const newIvrIntents = unique(_.cloneDeep(ivrIntents));
  return (
    <Modal
      visible={!!value}
      title={getFieldValue('id') ? '修改任务' : '添加任务'}
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
        <Item {...formItemLayout} label="任务名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '任务名必填！',
              },
            ],
          })(<TrimInput placeholder="请输入任务名" />)}
        </Item>
        <Item label="外呼类型" {...formItemLayout}>
          {getFieldDecorator('intent', {
            rules: [{ required: true, message: '请选择外呼类型!' }],
          })(
            <Select
              placeholder="请选择外呼类型"
              onChange={() => {
                intentChange();
              }}
            >
              {newIvrIntents &&
                newIvrIntents.length &&
                newIvrIntents.map(
                  (item: { intent: string | number | undefined; intentDesc: string }) => (
                    <Option value={item.intent} key={item.intent}>
                      {item.intentDesc}
                    </Option>
                  )
                )}
            </Select>
          )}
        </Item>
        <Item label="外呼场景" {...formItemLayout}>
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择外呼场景!' }],
          })(
            <Select
              // style={{ width: '300px' }}
              placeholder="请选择外呼场景"
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .filter((item: { intent: any }) => item.intent === intent)
                  .map((item: Item) => {
                    const { scene, sceneDesc } = item;
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(AddFormModal));
