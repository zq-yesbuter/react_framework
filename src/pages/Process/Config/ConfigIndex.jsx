import React, { useState, useEffect, Fragment } from 'react';
import {
  List,
  Spin,
  Input,
  Button,
  Table,
  Card,
  Checkbox,
  Select,
  Divider,
  Menu,
  Dropdown,
  Form,
  Modal,
  Icon,
  InputNumber,
  DatePicker,
  Tag,
  message,
} from 'antd';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';
import { addBatch, batchRelated, batchCancel } from '@/services/nameList';
import { flatten } from '@/utils/utils';
import styles from './index.less';
import TrimInput from '@/components/TrimInput';
import mapValueToFields from '@/utils/mapValueToFields';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { MonthPicker, RangePicker } = DatePicker;
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
// const tailLayout = {
//   wrapperCol: { offset: 8, span: 20 },
// };
const formatSelectedKeys = (selectedKeys = [], jobList) => {
  let arr = [];
  selectedKeys.forEach(val => {
    const arrItem = jobList.find(item => item.applyId === val);
    arr.push(arrItem);
  });
  return arr;
};

function Index({
  dispatch,
  form,
  namelist,
}) {
  const { configValue, ivrIntents, configNameList } = namelist;
  const { search } = window.location;
  const batchName = decodeURI(search.slice(1));
  const [diffTimeList, setDiffTimeList] = useState([]);
  const { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue } = form;
  const [ repeat, setRepeat ] = useState(true);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'namelist/save',
        payload: { configNameList: [] },
      });
    };
  }, []);

  function formatInventTime(timeList, applyId) {
    const list = timeList.filter(item => item.applyId === applyId);
    return list.length ? list.slice(-1)[0].invitationId : null;
  }
  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        const { name, intent, scene, triggerTime, retry } = values;
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
        const invitations = configNameList.map(item => item.invitationId);
        batchRelated({
          id,
          intent,
          invitations,
          triggerTime: triggerTime.format('YYYY-MM-DD HH:mm:ss'),
          retry,
        })
          .then(body => {
            message.success('任务配置成功！');
          })
          .catch(e => {
            message.error(e.message);
          });
      }
    });
  }
  function cancel() {
    const { intent, id } = configValue;
    batchCancel({ intent, id })
      .then(body => {
        message.success('取消任务成功');
        resetFields();
      })
      .catch(e => {
        message.error('取消任务失败');
      });
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().subtract(1, 'days');
  }
  function addTime() {
    if (!getFieldValue('time')) {
      message.warn('请选择时间段再添加！');
      return;
    }
    setDiffTimeList([...diffTimeList, getFieldValue('time')]);
    setFieldsValue({ time: '' });
  }
  function handleClose(index) {
    const newDiffTimeList = [...diffTimeList];
    newDiffTimeList.splice(index, 1);
    setDiffTimeList(newDiffTimeList);
  }

  function intentChange(e) {
    setFieldsValue({ scene: null });
  }

  function repeatChange(e) {
    setRepeat(e.target.checked);
  }

  function formatRepeat(repeat) {
    if (repeat) {
      return (
        <div className={styles['inline-select']}>
          {getFieldDecorator('retry', {
            rules: [
              {
                required: true,
                message: '重复外呼类型必填！',
              },
            ],
            initialValue: true,
          })(
            <Select>
              <Option value={true} key={true}>默认配置</Option>
            </Select>
          )}
          <Checkbox checked={repeat} onChange={repeatChange}>选择重复外呼默认配置</Checkbox>
        </div>
      );
    }
    return (
      <div className={styles['inline-select']}>
        {getFieldDecorator(`retry['reasons']`, {
          rules: [
            {
              required: true,
              message: '请添加！',
            },
          ],
        })(
          <Select mode="tags" placeholder="输入添加">
            <Option value="无人接听" key="无人接听">无人接听</Option>
          </Select>
        )}
        {getFieldDecorator(`retry['delay']`, {
          rules: [
            {
              required: true,
              message: '请添加！',
            },
          ],
        })(
          <Select>
            <Option value={10} key={10}>10分钟</Option>
            <Option value={20} key={20}>20分钟</Option>
            <Option value={30} key={30}>30分钟</Option>
            <Option value={50} key={40}>40分钟</Option>
            <Option value={60} key={60}>60分钟</Option>
          </Select>
        )}
        <Checkbox checked={repeat} onChange={repeatChange}>选择重复外呼默认配置</Checkbox>
      </div>
    );
    
  }

  const selectIntent = getFieldValue('intent');
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          任务配置
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
            {configNameList.length
              ? configNameList.map((item, index) => (
                  <Tag color="blue" key={index}>
                    {(item && item.name) || null}
                  </Tag>
                ))
              : null}
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
                ivrIntents.map(item => <Option value={item.intent} key={item.intent}>{item.intentDesc}</Option>)}
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
                  .filter(item => item.intent === selectIntent)
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
        <Item label="外呼时间" required>
          {getFieldDecorator('triggerTime', {
            rules: [{ required: true, message: '请选择外呼时间!' }],
            initialValue:
              configValue && configValue.id ? moment(configValue.triggerStartTime) : null,
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
          {formatRepeat(repeat)}
        </Item>
        <Item {...tailLayout}>
          <Button
            htmlType="submit"
            type="primary"
            // className="test-input-search"
            onClick={() => handleOk()}
          >
            提交任务
          </Button>
          {configValue && configValue.id && (
            <Button
              style={{ marginLeft: '10px' }}
              className="test-input-search"
              onClick={e => {
                cancel();
              }}
            >
              取消任务
            </Button>
          )}
          <Button
            style={{ marginLeft: '10px' }}
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

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Form.create({})(Index));
