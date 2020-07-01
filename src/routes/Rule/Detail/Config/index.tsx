import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button, Card, Select, Form, message } from 'antd';
import { connect } from 'dva';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import { batchRelated, batchCancel } from '@/services/nameList';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';

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
  rule: any;
  loading: boolean;
}
function Index(props: Props) {
  const { dispatch, form, rule, loading } = props;
  const { configValue, ivrIntents, configNameList } = rule;
  const { search } = window.location;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, setFields } = form;
  const [cancelLoading, setCancelLoading] = useState(false);
  const [sureLoading, setSureLoading] = useState(false);
  const [ruleList, setRuleList] = useState([{}]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'rule/save',
        payload: { configNameList: [] },
      });
    };
  }, []);

  function handleOk() {
    validateFields((err: any, values: any) => {
      if (!err) {
        console.log('values===>', values);

        // const invitations = configNameList.map((item: any) => item.invitationId);
        // setSureLoading(true);
        // batchRelated({
        //   id,
        //   intent,
        //   invitations,
        //   triggerTime: triggerTime.format('YYYY-MM-DD HH:mm:ss'),
        //   retry,
        // })
        //   .then(() => {
        //     message.success('任务配置成功！');
        //     setSureLoading(false);
        //     dispatch({
        //       type: 'rule/getConfigValue',
        //       payload: queryString.parse(search),
        //     });
        //   })
        //   .catch(e => {
        //     message.error(e.message);
        //     setSureLoading(false);
        //   });
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
          pathname: `/AI/outging/rule`,
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
          type: 'rule/getConfigValue',
          payload: queryString.parse(search),
        });
      })
      .catch((e) => {
        message.error('取消任务失败');
        setCancelLoading(false);
      });
  }

  function formRepeatChange(e: any) {
    // setRepeat(e);
    if (!e) {
      const newConfigNameList = _.cloneDeep(configNameList);
      if (newConfigNameList && newConfigNameList.length) {
        newConfigNameList[0].retries = {};
      }
      dispatch({
        type: 'rule/save',
        payload: { configNameList: newConfigNameList },
      });
    }
  }

  const { status } = configValue;
  const triggerDisabled = status === 3 || status === 4;
  function addRule() {
    const cloneRuleList = _.cloneDeep(ruleList);
    cloneRuleList.push({});
    setRuleList(cloneRuleList);
  }
  function deleteRule(index: number) {
    const rule = getFieldValue('rule');
    console.log(
      'ryle',
      rule,
      rule.filter((item: any, key: number) => key !== index)
    );
    // setFields({
    //   rule: {
    //     value: rule.filter((item:any, key:number) => key !== index),
    //   },
    // });
    // setFields({value})
    form.setFieldsValue({
      rule: rule.filter((item: any, key: number) => key !== index),
    });
    const cloneRuleList = _.cloneDeep(ruleList);
    cloneRuleList.splice(index, 1);
    setRuleList(cloneRuleList);
  }
  return (
    <PageHeaderWrapper
      title="规则配置"
      breadcrumb={{
        routes: [
          { path: '/AI/scene/list', breadcrumbName: '规则配置' },
          { path: '/AI/scene/list', breadcrumbName: '场景列表' },
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
            规则编辑
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
          <Item label="ID" required>
            <div style={{ marginLeft: 10 }}>
              {configNameList ? `${configNameList.length}` : null}
            </div>
          </Item>
          {ruleList.map((item: any, index: number) => {
            return (
              <Fragment>
                <Item {...formItemLayout} label="规则">
                  {getFieldDecorator(`rule[${index}].name`, {
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
                      placeholder="请选择规则"
                    >
                      <Option value={1} key={1}>
                        等于
                      </Option>
                      <Option value={2} key={2}>
                        包含
                      </Option>
                      <Option value={3} key={3}>
                        不等于
                      </Option>
                      <Option value={4} key={4}>
                        大于
                      </Option>
                      <Option value={5} key={5}>
                        小于
                      </Option>
                      <Option value={6} key={6}>
                        不包含
                      </Option>
                    </Select>
                  )}
                  {index ? (
                    <a style={{ marginLeft: 5 }} onClick={() => deleteRule(index)}>
                      删除
                    </a>
                  ) : (
                    <a style={{ marginLeft: 5 }} onClick={addRule}>
                      新增“且”规则
                    </a>
                  )}
                </Item>
                <Item {...tailLayout}>
                  {getFieldDecorator(`rule[${index}].type`, {
                    rules: [
                      {
                        required: true,
                        message: '请选择！',
                      },
                    ],
                  })(<Input style={{ width: 300 }} />)}
                </Item>
              </Fragment>
            );
          })}
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
              onClick={(e) => cancel()}
            >
              删除
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
  rule = {},
  loading: {
    effects: { 'rule/getConfigValue': loading },
  },
}: {
  rule: any;
  loading: any;
}) => ({ rule, loading });
export default connect(mapStateToProps)(Form.create({})(Index));
