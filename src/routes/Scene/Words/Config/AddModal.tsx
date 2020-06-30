import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button, Card, Select, Form, message, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import { batchRelated, batchCancel } from '@/services/nameList';

const { Option } = Select;
const { Item } = Form;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
interface Props {
  dispatch: Function;
  form: any;
  namelist: any;
  loading: boolean;
  visible: boolean;
}
function Index(props: Props) {
  const { dispatch, form, namelist, loading, visible } = props;
  const { configValue, configNameList } = namelist;
  const { search } = window.location;
  const { getFieldDecorator, validateFields, setFieldsValue } = form;
  const [cancelLoading, setCancelLoading] = useState(false);
  const [sureLoading, setSureLoading] = useState(false);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'namelist/save',
        payload: { configNameList: [] },
      });
    };
  }, []);

  function handleOk() {
    validateFields((err: any, values: any) => {
      if (!err) {
        const { intent, triggerTime } = values;
        let { retry, sure } = values;
        if (sure === false) {
          retry = false;
        }
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        const { id } = queryString.parse(search);
        if (configNameList && !configNameList.length) {
          message.warn('没有名单无法设置，请先导入名单！');
          dispatch(
            routerRedux.push({
              pathname: `/AI/outging/namelist`,
              search: queryString.stringify({
                id,
                intent,
              }),
            })
          );
          return;
        }
        const invitations = configNameList.map((item: any) => item.invitationId);
        setSureLoading(true);
        batchRelated({
          id,
          intent,
          invitations,
          triggerTime: triggerTime.format('YYYY-MM-DD HH:mm:ss'),
          retry,
        })
          .then(() => {
            message.success('任务配置成功！');
            setSureLoading(false);
            dispatch({
              type: 'namelist/getConfigValue',
              payload: queryString.parse(search),
            });
          })
          .catch(e => {
            message.error(e.message);
            setSureLoading(false);
          });
      } else {
        message.error('请添加重复外呼配置！');
      }
    });
  }
  function cancel() {
    const { intent, id } = configValue;
    if (configNameList && !configNameList.length) {
      message.warn('没有名单无法取消，请先导入名单！');
      dispatch(
        routerRedux.push({
          pathname: `/AI/outging/namelist`,
          search: queryString.stringify({
            id,
            intent,
          }),
        })
      );
      return;
    }
    setCancelLoading(true);
    batchCancel({ intent, id })
      .then(body => {
        message.success('取消任务成功');
        setFieldsValue({ triggerTime: null });
        setCancelLoading(false);
        dispatch({
          type: 'namelist/getConfigValue',
          payload: queryString.parse(search),
        });
      })
      .catch(e => {
        message.error('取消任务失败');
        setCancelLoading(false);
      });
  }

  const { status } = configValue;
  const triggerDisabled = status === 3 || status === 4;
  return (
    <Modal
        title="设置录用通知时间"
        visible={visible}
        onOk={handleOk}
        onCancel={() => {
        // resetFields();
        close();
        // setDiffTimeList([]);
        }}
        >
      <Form {...formItemLayout}>
        <Item label="话术ID" required>
          <div style={{ marginLeft: 10 }}>
            {configNameList ? `${configNameList.length}` : null}
          </div>
        </Item>
        <Item {...formItemLayout} label="话术名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '话术名称必填！',
              },
            ],
            initialValue: configValue && configValue.id ? configValue.name : null,
          })(<Input style={{ width: '300px' }} placeholder="请输入话术名称" />)}
        </Item> 
        <Item {...formItemLayout} label="话术内容">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '话术内容必填！',
              },
            ],
            initialValue: configValue && configValue.id ? configValue.name : null,
          })(<TextArea
              placeholder="请输入话术内容"
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ width: '300px' }}
            />)}
        </Item>
        <Item {...formItemLayout} label="音频地址">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '音频地址必填！',
              },
            ],
            initialValue: configValue && configValue.id ? configValue.name : null,
          })(<Input style={{ width: '300px' }} placeholder="请输入音频地址" />)}
        </Item> 
        <Item label="数据调用" required>
          {getFieldDecorator(`retry`, {
              rules: [
                {
                  required: true,
                  message: '请添加！',
                },
              ],
            })(
              <Select
                mode="tags"
                placeholder="请选择数据调用"
                style={{ width: 300, marginRight: 8 }}
              >
                <Option value="无人接听" key="无人接听">
                  无人接听
                </Option>
              </Select>
            )}
        </Item>
        <Item label="候选人记录" required>
          {getFieldDecorator(`retry1`, {
              rules: [
                {
                  required: true,
                  message: '请添加！',
                },
              ],
            })(
              <Select
                mode="tags"
                placeholder="请选择候选人记录"
                style={{ width: 300, marginRight: 8 }}
              >
                <Option value="无人接听" key="无人接听">
                  无人接听
                </Option>
              </Select>
            )}
        </Item>
        <Item label="导入表格记录" required>
          {getFieldDecorator(`retryee`, {
              rules: [
                {
                  required: true,
                  message: '请添加！',
                },
              ],
            })(
              <Select
                mode="tags"
                placeholder="请选择导入表格记录"
                style={{ width: 300, marginRight: 8 }}
              >
                <Option value="无人接听" key="无人接听">
                  无人接听
                </Option>
              </Select>
            )}
        </Item>
        <Item {...tailLayout}>
          <Button
            htmlType="submit"
            type="primary"
            // className="test-input-search"
            onClick={() => handleOk()}
            disabled={triggerDisabled}
            loading={sureLoading}
            style={{ marginRight: '10px' }}
          >
            {status > 0 ? '更新配置' : '提交配置'}
          </Button>
          <Button
            style={{ marginRight: '10px' }}
            className="test-input-search"
            loading={cancelLoading}
            onClick={e => cancel()}
          >
            取消配置
          </Button>
          <Button
            htmlType="submit"
            // className="test-input-search"
            onClick={() => {
              dispatch(routerRedux.goBack());
            }}
          >
            返回
          </Button>
        </Item>
      </Form>
    </Modal>
  );
}

const mapStateToProps = ({
  namelist,
  loading: {
    effects: { 'namelist/getConfigValue': loading },
  },
}:{
  namelist:any;
  loading: any;
}) => ({ namelist, loading });
export default connect(mapStateToProps)(Form.create({})(Index));

