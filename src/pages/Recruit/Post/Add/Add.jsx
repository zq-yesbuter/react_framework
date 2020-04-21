import React, { useState, useEffect ,Fragment} from 'react';
import { connect } from 'dva';
import { Form, Modal, Select, DatePicker, Card } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import mapValueToFields from '@/utils/mapValueToFields';
import TrimInput from '@/components/TrimInput';

const Option = Select.Option;
const { Item } = Form;
const { TextArea } = TrimInput;
function AddFormModal({ dispatch, form, onCancel, onSubmit, value, recruit }) {
  const { ivrIntents } = recruit;
  console.log('ivrIntents====>', recruit);
  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        onSubmit && onSubmit(values);
      }
    });
  };

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }
  const sourceId = getFieldValue('terminalType');
  getFieldDecorator('id');
  function intentChange(e) {
    setFieldsValue({ scene: null });
  }
  const intent = getFieldValue('intent');
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          添加岗位
          <a
            href="javascript:;"
            style={{
              padding: '5px 15px',
              fontSize: 14,
            }}
            onClick={e => {
              e.preventDefault();
              dispatch(routerRedux.goBack());
              // dispatch(routerRedux.push('/statistics/insight/hotspotInsight'));
            }}
          >
            返回上一级
          </a>
        </Fragment>
      }
    >
      <Form layout="horizontal">
        <Item label="岗位类型" {...formItemLayout}>
          {getFieldDecorator('intent', {
            rules: [{ required: true, message: '请选择岗位类型!' }],
          })(
            <Select
              placeholder="请选择岗位类型"
              onChange={() => {
                intentChange();
              }}
              style={{width:400}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => (
                  <Option value={item.intent} key={item.intent}>
                    {item.intentDesc}
                  </Option>
                ))}
            </Select>
          )}
        </Item>
        <Item {...formItemLayout} label="需求编号">
          {getFieldDecorator('number', {
            rules: [
              {
                required: true,
                message: '需求编号必填！',
              },
            ],
          })(<TrimInput placeholder="请输入需求编号" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="需求名称">
          {getFieldDecorator('name6', {
            rules: [
              {
                required: true,
                message: '需求名称必填！',
              },
            ],
          })(<TrimInput placeholder="请输入需求名称" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="岗位名称">
          {getFieldDecorator('jobName', {
            rules: [
              {
                required: true,
                message: '岗位名称必填！',
              },
            ],
          })(<TrimInput placeholder="请输入岗位名称" style={{width:400}} />)}
        </Item>
        <Item label="需求部门" {...formItemLayout}>
          {getFieldDecorator('scene4', {
            rules: [{ required: true, message: '请选择需求部门!' }],
          })(
            <Select
              // style={{ width: '300px' }}
              placeholder="请选择需求部门"
              style={{width:400}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .map(({ scene, sceneDesc }) => {
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </Item>
        <Item label="岗位职级" {...formItemLayout}>
          {getFieldDecorator('scene1', {
            rules: [{ required: true, message: '请选择岗位职级!' }],
          })(
            <Select
              placeholder="请选择岗位职级"
              style={{width:400}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .map(({ scene, sceneDesc }) => {
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </Item>
        <Item label="需求来源" {...formItemLayout}>
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择需求来源!' }],
          })(
            <Select
              placeholder="请选择需求来源"
              style={{width:400}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .map(({ scene, sceneDesc }) => {
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </Item>
        <Item {...formItemLayout} label="需求名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '需求名称必填！',
              },
            ],
          })(<TrimInput placeholder="请输入需求名称" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="离职ERP">
          {getFieldDecorator('erp', {
            rules: [
              {
                required: true,
                message: '离职ERP必填！',
              },
            ],
          })(<TrimInput placeholder="请输入离职ERP" style={{width:400}} />)}
        </Item>
        <Item label="招聘类型" {...formItemLayout}>
          {getFieldDecorator('type1', {
            rules: [{ required: true, message: '请选择招聘类型!' }],
          })(
            <Select
              placeholder="请选择招聘类型"
              style={{width:400}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents
                  .map(({ scene, sceneDesc }) => {
                    return (
                      <Option value={scene} key={scene}>
                        {sceneDesc}
                      </Option>
                    );
                  })}
            </Select>
          )}
        </Item>
        <Item {...formItemLayout} label="招聘人数">
          {getFieldDecorator('number', {
            rules: [
              {
                required: true,
                message: '招聘人数必填！',
              },
            ],
          })(<TrimInput placeholder="请输入招聘人数" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="对外名称">
          {getFieldDecorator('out', {
            rules: [
              {
                required: true,
                message: '对外名称必填！',
              },
            ],
          })(<TrimInput placeholder="请输入对外名称" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="招聘负责人">
          {getFieldDecorator('outiner', {
            rules: [
              {
                required: true,
                message: '招聘负责人必填！',
              },
            ],
          })(<TrimInput placeholder="请输入招聘负责人" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="汇报对象">
          {getFieldDecorator('ou', {
            rules: [
              {
                required: true,
                message: '汇报对象必填！',
              },
            ],
          })(<TrimInput placeholder="请输入汇报对象" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="工作城市">
          {getFieldDecorator('outinerdddd', {
            rules: [
              {
                required: true,
                message: '工作城市必填！',
              },
            ],
          })(<TrimInput placeholder="请输入工作城市" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="学历要求">
          {getFieldDecorator('outinerdd', {
            rules: [
              {
                required: true,
                message: '学历要求必填！',
              },
            ],
          })(<TrimInput placeholder="请输入学历要求" style={{width:400}} />)}
        </Item>
        <Item {...formItemLayout} label="岗位要求">
          {getFieldDecorator('o', {
            rules: [
              {
                required: true,
                message: '岗位要求必填！',
              },
            ],
          })(<TextArea placeholder="请输入岗位要求" style={{width:400}} rows={4} />)}
        </Item>
        <Item {...formItemLayout} label="任职资格">
          {getFieldDecorator('o4', {
            rules: [
              {
                required: true,
                message: '任职资格必填！',
              },
            ],
          })(<TextArea placeholder="请输入任职资格" style={{width:400}} rows={4} />)}
        </Item>
      </Form>
    </Card>
  );
}
const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(Form.create({})(AddFormModal));
