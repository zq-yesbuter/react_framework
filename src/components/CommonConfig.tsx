import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button, Card, Select, Form, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import TrimInput from './TrimInput';
import { batchRelated, batchCancel } from '@/services/nameList';

const { Option } = Select;
const { Item } = Form;
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
  title: string;
  value: any;
}

interface Item {
    type: string;
    label: string;
    key: string;
    placeholder: string;
    optionValue?: any;
  }

function Index(props: Props) {
  const { dispatch, form, namelist, loading, title,value } = props;
  const { configValue, ivrIntents, configNameList } = namelist;
  const { search } = window.location;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
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

  function formatItem(item: Item) {
    const { type, label, key, placeholder, optionValue } = item;
    switch (type) {
      case 'input':
        return (
          <Item label={label}>
            {getFieldDecorator(key)(<TrimInput placeholder={placeholder} />)}
          </Item>
        );
      case 'select':
        return (
          <Item label={label}>
            {getFieldDecorator(key)(
              <Select placeholder={placeholder} style={{ width: 300 }}>
                {optionValue.map(() => (
                  <Option value={1} key={1}>
                    1
                  </Option>
                ))}
              </Select>
            )}
          </Item>
        );
        case 'div': 
        return (
          <Item label={label} required>
            <div style={{ marginLeft: 10 }}>{configNameList ? `${configNameList.length}` : null}</div>
          </Item>
        );
      default:
        return (
          <Item label={label}>
            {getFieldDecorator(key)(<TrimInput placeholder={placeholder} />)}
          </Item>
        );
    }
  }
  return (
    <Card
      bordered={false}
      loading={loading}
      title={
        <Fragment>
          {title}
          <a
            href="javascript:;"
            style={{
              padding: '5px 15px',
              fontSize: 14,
            }}
            onClick={e => {
              e.preventDefault();
              dispatch(routerRedux.goBack());
            }}
          >
            返回上一级
          </a>
        </Fragment>
      }
    >
      <Form {...formItemLayout}>
        {value.map((item: Item) => formatItem(item))}
        {/* <Item label="意图ID" required>
       
        </Item>
        <Item {...formItemLayout} label="意图名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '意图名称必填！',
              },
            ],
            initialValue: configValue && configValue.id ? configValue.name : null,
          })(<Input style={{ width: '300px' }} placeholder="请输入意图名称" />)}
        </Item>
        <Item {...formItemLayout} label="启用状态">
          {getFieldDecorator('sure', {
            rules: [
              {
                required: true,
                message: '请选择！',
              },
            ],
          })(
            <Select
              style={{ width: 300, marginRight: 10 }}
              onChange={formRepeatChange}
              placeholder="请选择启用状态"
            >
              <Option value={1} key={1}>
                是
              </Option>
              <Option value={2} key={2}>
                否
              </Option>
            </Select>
          )}
        </Item> */}
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
            提交
          </Button>
          <Button
            style={{ marginRight: '10px' }}
            className="test-input-search"
            loading={cancelLoading}
            onClick={e => cancel()}
          >
            重置
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
    </Card>
  );
}

const mapStateToProps = ({
  namelist = {},
  loading: {
    effects: { 'namelist/getConfigValue': loading },
  },
}) => ({ namelist, loading });
export default connect(mapStateToProps)(Form.create({})(Index));
