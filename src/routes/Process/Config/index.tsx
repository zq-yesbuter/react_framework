import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button, Card, Select, Form, DatePicker, message } from 'antd';
import { connect } from 'dva';
import queryString from 'query-string';
import _ from 'lodash';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
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
}
function Index(props: Props) {
  const { dispatch, form, namelist, loading } = props;
  const { configValue = {}, ivrIntents, configNameList } = namelist;
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
        if (sure === 0) {
          retry = false;
        }
        if (triggerTime < moment().add(5, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间5分钟以上哦！');
          return;
        }
        const { id } = queryString.parse(search);
        if (configNameList && !configNameList.length) {
          message.warn('没有名单无法设置，请先导入名单！');
          dispatch(
            routerRedux.push({
              pathname: `/AI/outgoing/namelist`,
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
              type: 'namelist/configNameList',
              payload: queryString.parse(search),
            });
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
          pathname: `/AI/outgoing/namelist`,
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
  function disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }

  function intentChange() {
    setFieldsValue({ scene: null });
  }

  function formRepeatChange(e: any) {
    // setRepeat(e);
    if (!e) {
      const newConfigNameList = _.cloneDeep(configNameList);
      if (newConfigNameList && newConfigNameList.length) {
        newConfigNameList[0].retries = {};
      }
      dispatch({
        type: 'namelist/save',
        payload: { configNameList: newConfigNameList },
      });
    }
  }

  function formatRepeat() {
    let retry = {};
    if (configNameList && configNameList.length) {
      const { retries } = configNameList[0] || {};
      if (retries && retries.length) {
        retries[0] &&
          retries[0].retries &&
          retries[0].retries.forEach((item: any) => Object.assign(retry, item));
      }
    }
    const showSure =
      getFieldValue('sure') === undefined || getFieldValue('sure') === 0
        ? retry && Object.keys(retry).length
        : getFieldValue('sure');
    // console.log('=====>',getFieldValue('sure'),getFieldValue('sure') === undefined,(retry && Object.keys(retry).length),getFieldValue('sure'));
    return (
      <div>
        {getFieldDecorator('sure', {
          initialValue: retry && Object.keys(retry).length ? 1 : 0,
          rules: [
            {
              required: true,
              message: '请选择！',
            },
          ],
        })(
          <Select
            style={{ width: 200, marginRight: 10 }}
            onChange={formRepeatChange}
            placeholder="请选择是否重复外呼"
          >
            <Option value={1} key={1}>
              是
            </Option>
            <Option value={0} key={0}>
              否
            </Option>
          </Select>
        )}
        {showSure ? (
          <Fragment>
            {getFieldDecorator(`retry['reasons']`, {
              initialValue: retry && Object.keys(retry).length ? retry['reasons'] : [],
              rules: [
                {
                  required: true,
                  message: '请添加！',
                },
              ],
            })(
              <Select
                mode="tags"
                placeholder="输入并按enter键添加"
                style={{ width: 200, marginRight: 8 }}
              >
                <Option value="无人接听" key="无人接听">
                  无人接听
                </Option>
              </Select>
            )}
            {getFieldDecorator(`retry['delay']`, {
              initialValue: retry && Object.keys(retry).length ? retry['delayed'] / 60 : null,
              rules: [
                {
                  required: true,
                  message: '请添加！',
                },
              ],
            })(
              <Select style={{ width: 200, marginRight: 10 }}>
                <Option value={5} key={5}>
                  5分钟
                </Option>
                <Option value={10} key={10}>
                  10分钟
                </Option>
                <Option value={20} key={20}>
                  20分钟
                </Option>
                <Option value={30} key={30}>
                  30分钟
                </Option>
                <Option value={50} key={40}>
                  40分钟
                </Option>
                <Option value={60} key={60}>
                  60分钟
                </Option>
              </Select>
            )}
          </Fragment>
        ) : null}
      </div>
    );
  }

  const selectIntent = getFieldValue('intent');
  const { status } = configValue;
  const triggerDisabled = status === 3 || status === 4;
  return (
    <PageHeaderWrapper
      title="外呼配置"
      breadcrumb={{
        routes: [
          { path: '/AI/outgoing/list', breadcrumbName: '招聘外呼' },
          { path: '/AI/outgoing/config', breadcrumbName: '外呼配置' },
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
            任务配置
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
          <Item {...formItemLayout} label="任务名">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '任务名必填！',
                },
              ],
              initialValue: configValue && configValue.id ? configValue.name : null,
            })(<Input style={{ width: '300px' }} placeholder="请输入任务名" />)}
          </Item>
          <Item label="外呼名单" required>
            <div style={{ marginLeft: 10 }}>
              {configNameList ? `共${configNameList.length}人` : null}
            </div>
          </Item>
          <Item label="外呼类型">
            {getFieldDecorator('intent', {
              rules: [{ required: true, message: '请选择外呼类型!' }],
              initialValue: configValue && configValue.id ? configValue.intent : null,
            })(
              <Select
                style={{ width: '300px' }}
                placeholder="请选择外呼类型"
                onChange={() => {
                  intentChange();
                }}
                disabled
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
          <Item label="外呼场景">
            {getFieldDecorator('scene', {
              rules: [{ required: true, message: '请选择外呼场景!' }],
              initialValue: configValue && configValue.id ? configValue.scene : null,
            })(
              <Select style={{ width: '300px' }} placeholder="请选择外呼场景" disabled>
                {ivrIntents &&
                  ivrIntents.length &&
                  ivrIntents
                    .filter(
                      (item: { intent: string; intentDesc?: string }) =>
                        item.intent === selectIntent
                    )
                    .map((val: { scene: string; sceneDesc: string }) => {
                      const { scene, sceneDesc } = val;
                      return (
                        <Option value={scene} key={scene}>
                          {sceneDesc}
                        </Option>
                      );
                    })}
              </Select>
            )}
          </Item>
          <Item label="外呼时间" required>
            {getFieldDecorator('triggerTime', {
              rules: [{ required: true, message: '请选择外呼时间!' }],
              initialValue:
                configValue && configValue.id
                  ? configValue.triggerStartTime
                    ? moment(configValue.triggerStartTime)
                    : null
                  : null,
            })(
              <DatePicker
                showTime={{ format: 'HH:mm', minuteStep: 5 }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择外呼时间"
                style={{ width: 300 }}
              />
            )}
          </Item>
          {/* <Item label="重复外呼" required>
          {getFieldDecorator('retry', {
             rules: [{ required: true, message: '请选择是否重复外呼!' }],
             initialValue:true,
          })(
            <Select style={{ width: 300 }} placeholder="请选择是否重复外呼">
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          )}
        </Item> */}
          <Item label="重复外呼" required>
            {formatRepeat()}
          </Item>
          <Item {...tailLayout}>
            {status < 3 && (
              <Button
                htmlType="submit"
                type="primary"
                // className="test-input-search"
                onClick={() => handleOk()}
                disabled={triggerDisabled}
                loading={sureLoading}
                style={{ marginRight: '10px' }}
              >
                {status > 0 ? '更新任务' : '提交任务'}
              </Button>
            )}
            {status === 1 && (
              <Button
                style={{ marginRight: '10px' }}
                className="test-input-search"
                loading={cancelLoading}
                onClick={(e) => cancel()}
              >
                取消任务
              </Button>
            )}
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
  namelist = {},
  loading: {
    effects: { 'namelist/getConfigValue': loading },
  },
}) => ({ namelist, loading });
export default connect(mapStateToProps)(Form.create({})(Index));
