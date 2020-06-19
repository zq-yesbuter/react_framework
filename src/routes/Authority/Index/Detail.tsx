import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select, TreeSelect } from 'antd';
import _ from 'lodash';
import TrimInput from '@/components/TrimInput';

const { Option } = Select;
const { Item } = Form;
const { TreeNode } = TreeSelect;

interface Props {
  form: any;
  onCancel: any;
  onSubmit: any;
  value: any;
  auth: any;
  submitLoading: boolean;
}
interface Item {
  scene: string;
  sceneDesc: string;
}
function Detail(props: Props) {
  const { form, onCancel, onSubmit, value, auth:{treeDepartList=[],baseDepartList=[]}, submitLoading } = props;
  useEffect(() => {
    return () => { };
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

  function format(tenantId,baseDepartList){
    const ivrValue = baseDepartList && baseDepartList.find(e => e.tenantId === tenantId) || {};
    return ivrValue && Object.keys(ivrValue).length ? ivrValue.id : null
  }
  const loop = (data) => {
    return data.map(item => {
      const title = (
        <span className="title">{item.name}</span>
      );
      if (item.children && item.children.length) {
        return (
          <TreeNode value={item.id} title={title} item={item}>
            {loop(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode value={item.id} title={title} item={item} />;
      }
    });
  };
  return (
    <Modal
      visible={!!value}
      title={getFieldValue('id') ? '修改用户' : '添加用户'}
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
        <Item label="姓名" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入姓名!' }],
            initialValue:!!value && Object.keys(value).length ? value.name : null,
          })(
            <TrimInput placeholder="请输入姓名" />
          )}
        </Item>
        <Item label="账号类型" {...formItemLayout}>
          {getFieldDecorator('loginSource', {
            rules: [{ required: true, message: '请选择账号类型!' }],
            initialValue:'erp',
          })(
            <Select
              placeholder="请选择外呼类型"
              disabled={!!value && !!Object.keys(value).length}
            >
              <Option value='erp' key='erp'>erp</Option>
            </Select>
          )}
        </Item>
        <Item label="账号" {...formItemLayout}>
          {getFieldDecorator('loginName', {
            rules: [{ required: true, message: '请输入账号!' }],
            initialValue:!!value && Object.keys(value).length ? value.loginName : null,
          })(
            <TrimInput placeholder="请输入账号" disabled={!!value && Object.keys(value).length && value.loginName} />
          )}
        </Item>
        <Item {...formItemLayout} label="所属部门">
          {getFieldDecorator('organizationId', {
            initialValue:!!value && Object.keys(value).length ? value.tenantId && format(value.tenantId,baseDepartList) : null,
            rules: [
              {
                required: true,
                message: '所属部门必填！',
              },
            ],
          })(<TreeSelect
            showSearch
            style={{ width: '100%' }}
            // value={this.state.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
            // onChange={this.onChange}
          >
            {loop(treeDepartList)}
          </TreeSelect>)}
        </Item>
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ auth = {} }) => ({ auth });
export default connect(mapStateToProps)(Form.create({})(Detail));
