import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button, Card, Select, Form, message } from 'antd';
import { connect } from 'dva';
import { routerRedux, Link  } from 'dva/router';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import { batchRelated, batchCancel } from '@/services/nameList';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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
}
function Index(props: Props) {
  const { dispatch, form, namelist, loading } = props;
  const { configValue, ivrIntents, configNameList } = namelist;
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
          .catch((e) => {
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
      .then((body) => {
        message.success('取消任务成功');
        setFieldsValue({ triggerTime: null });
        setCancelLoading(false);
        dispatch({
          type: 'namelist/getConfigValue',
          payload: queryString.parse(search),
        });
      })
      .catch((e) => {
        message.error('取消任务失败');
        setCancelLoading(false);
      });
  }

  function intentChange() {
    setFieldsValue({ scene: null });
  }

  const { status } = configValue;
  const triggerDisabled = status === 3 || status === 4;
  return (
    <PageHeaderWrapper
      title="新增场景"
      breadcrumb={{
        routes: [
          { path: '/AI/scene/list', breadcrumbName: '场景配置' },
          { path: '/AI/scene/list', breadcrumbName: '场景列表' },
          { path: '/AI/scene/add', breadcrumbName: '添加场景' },
        ],
        itemRender: (route, params, routes, paths) => {
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
    >
      <Card
        bordered={false}
        loading={loading}
        title={
          <Fragment>
            新增场景
            <a
              href="javascript:;"
              style={{
                padding: '5px 15px',
                fontSize: 14,
              }}
              onClick={(e) => {
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
          <Item label="场景ID" required>
            <div style={{ marginLeft: 10 }}>
              {configNameList ? `${configNameList.length}` : null}
            </div>
          </Item>
          <Item {...formItemLayout} label="场景名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '场景名称必填！',
                },
              ],
              initialValue: configValue && configValue.id ? configValue.name : null,
            })(<Input style={{ width: '300px' }} placeholder="请输入场景名称" />)}
          </Item>
          <Item label="数据调用">
            {getFieldDecorator('intent', {
              rules: [{ required: true, message: '请选择数据调用!' }],
              initialValue: configValue && configValue.id ? configValue.intent : [],
            })(
              <Select
                mode="multiple"
                style={{ width: '300px' }}
                placeholder="请选择数据调用"
                onChange={() => {
                  intentChange();
                }}
              >
                {ivrIntents &&
                  ivrIntents.length &&
                  ivrIntents.map((item: { intent: string; intentDesc: string }) => (
                    <Option value={item.intent} key={item.intent}>
                      {item.intentDesc}
                    </Option>
                  ))}
              </Select>
            )}
          </Item>
          <Item label="词槽匹配">
            {getFieldDecorator('intent', {
              rules: [{ required: true, message: '请选择词槽匹配!' }],
              initialValue: configValue && configValue.id ? configValue.intent : [],
            })(
              <Select
                mode="multiple"
                style={{ width: '300px' }}
                placeholder="请选择词槽匹配"
                onChange={() => {
                  intentChange();
                }}
              >
                {ivrIntents &&
                  ivrIntents.length &&
                  ivrIntents.map((item: { intent: string; intentDesc: string }) => (
                    <Option value={item.intent} key={item.intent}>
                      {item.intentDesc}
                    </Option>
                  ))}
              </Select>
            )}
          </Item>
          <Item label="启用状态">
            {getFieldDecorator('intent', {
              rules: [{ required: true, message: '请选择启用状态!' }],
              initialValue: configValue && configValue.id ? configValue.intent : [],
            })(
              <Select
                style={{ width: '300px' }}
                placeholder="请选择启用状态"
                onChange={() => {
                  intentChange();
                }}
              >
                <Option value={1} key={1}>
                  启用
                </Option>
                <Option value={0} key={0}>
                  停用
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
              新增场景
            </Button>
            <Button
              style={{ marginRight: '10px' }}
              className="test-input-search"
              loading={cancelLoading}
              onClick={(e) => cancel()}
            >
              删除场景
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
    </PageHeaderWrapper>
  );
}

const mapStateToProps = ({
  namelist,
  loading: {
    effects: { 'namelist/getConfigValue': loading },
  },
}: {
  namelist: any;
  loading: any;
}) => ({
  namelist,
  loading,
});
export default connect(mapStateToProps)(Form.create({})(Index));
