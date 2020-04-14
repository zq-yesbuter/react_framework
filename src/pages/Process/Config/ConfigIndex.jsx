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
  visible,
  form,
  close,
  selectedKeys,
  jobList,
  resetSelectList,
  location,
  namelist,
}) {
  const { configValue, ivrIntents, configNameList } = namelist;
  console.log('confifValue====>', configValue, ivrIntents );
  const { search } = window.location;
  const batchName = decodeURI(search.slice(1));
  const [diffTimeList, setDiffTimeList] = useState([]);
  const { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue } = form;

  useEffect(() => {
    return () => {
      dispatch({
        type: 'namelist/save',
        payload: {configNameList: []},
      });
    }
  },[]);

  function formatInventTime(timeList, applyId) {
    const list = timeList.filter(item => item.applyId === applyId);
    return list.length ? list.slice(-1)[0].invitationId : null;
  }
  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        // invitations
        console.log('vlues===>',values);
        const { name, intent, scene, triggerTime } = values;
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        addBatch({name, intent, scene,triggerTime:triggerTime.format('YYYY-MM-DD HH:mm:ss')})
          .then(({id}) => {
            console.log('创建成功了===》',invitations);
            console.log('invitations===>',invitations);
            if(invitations && !invitations.length){
              dispatch(routerRedux.push({
                pathname: `/AI/outging/namelist`,
                search: queryString.stringify({
                  id,
                  intent,
                })
              }));
              return;
            }
            
            batchRelated({id,intent,triggerTime,invitations}) 
              .then(body => {
                
              })
              .catch(e => {});
            })
            .catch(e => {
              console.error(e)
            });

          // fetchInvitation({ applyIds })
          //   .then(timeList => {
          //     editBatch = editBatch.map(item => {
          //       // console.log('timelist====>',timeList,formatInventTime(timeList, item.applyId))
          //       return { ...item, updateId: formatInventTime(timeList, item.applyId) || null };
          //     });
          //     // console.log('editBatch===>',editBatch);
          //     resolvedPromisesArray.push(editBatchInvitation({ batch: editBatch }));
          //     if (addBatch.length) {
          //       resolvedPromisesArray.push(batchInvent({ batch: addBatch }));
          //     }
          //     Promise.all(resolvedPromisesArray)
          //       .then(data => {
          //         let errorCount = 0;
          //         let successCount = 0;
          //         let success = [];
          //         data.forEach(item => {
          //           errorCount += item.errorCount;
          //           successCount += item.successCount;
          //           // success.push(item.success);
          //         });
          //         console.log('success===>', success);
          //         if (!errorCount) {
          //           message.success('批量邀约成功');
          //         } else {
          //           message.warn(`批量邀约成功${successCount}人，批量邀约失败${errorCount}人`);
          //         }
          //         // const successList = flatten(success);
          //         // console.log(errorCount,successCount,successList);
          //         // Modal.info({
          //         //   title: '批量邀约成功',
          //         //   content: (
          //         //     <div>
          //         //       <p>{`邀约成功${successCount}人，邀约失败${errorCount}人`}</p>
          //         //       {formatSelectedKeys(successList,jobList).map(item =>
          //         //         <p>{`${item ? item.name : null}邀约成功`}</p>
          //         //       )}
          //         //     </div>
          //         //   ),
          //         //   onOk() {() => close()},
          //         // });
          //         resetFields();
          //         setDiffTimeList([]);
          //         close();
          //         dispatch({
          //           type: 'chatrecord/jobAppliedAsPostAll',
          //         });
          //         // dispatch({
          //         //   type: 'chatrecord/updateSingleInvent',
          //         // });
          //         resetSelectList();
          //       })
          //       .catch(e => message.error(e.message));
          //   })
          //   .catch(e => message.error(`出现错误：${e.message}`));
       
      }
    });
  }
  function cancel() {
    const { intent,id } = configValue;
    batchCancel({intent,id})
    .then(body => {
      message.success('取消任务成功');
      resetFields();
    })
    .catch(e => {message.error('取消任务失败')  });
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
  const intent = getFieldValue('intent');
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
            initialValue:  configValue && configValue.id ? 
            configValue.name
            : batchName,
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
            initialValue:
            configValue && configValue.id ? 
              configValue.intent
              : null,
          })(
            <Select
              style={{ width: '300px' }}
              placeholder="请选择外呼类型"
              onChange={() => {intentChange()}}
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.map(item => <Option value={item.intent}>{item.intentDesc}</Option>)}
            </Select>
          )}
        </Item>
        <Item label="外呼场景">
          {getFieldDecorator('scene', {
            rules: [{ required: true, message: '请选择外呼场景!' }],
            initialValue:
            configValue && configValue.id ? 
              configValue.scene
              : null,
          })(
            <Select
              style={{ width: '300px' }}
              placeholder="请选择外呼场景"
            >
              {ivrIntents &&
                ivrIntents.length &&
                ivrIntents.filter(item => item.intent === intent)
                      .map(({ scene,sceneDesc }) => {
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
            configValue && configValue.id ? 
              moment(configValue.triggerStartTime)
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
        {/* <Item label="重复外呼">
          {getFieldDecorator('name', {
            // rules: [{ message: '请输入' }],s
          })(
            <Select style={{ width: 300 }} placeholder="请选择是否重复外呼">
              <Option value="yes">是</Option>
              <Option value="no">否</Option>
            </Select>
          )}
        </Item> */}
        {/* <Item label="面试时长">
          {getFieldDecorator('diff', {
            initialValue: 60,
            rules: [{ required: true, message: '请选择面试时长!' }],
          })(
            <InputNumber
              style={{ flex: 1 }}
              min={0}
              max={160}
              formatter={value => `${value}分钟`}
              parser={value => value.replace('分钟', '')}
            />
          )}
        </Item>
        <Item label="面试时段" required>
          <div style={{ display: 'flex', marginLeft: 5 }}>
            {getFieldDecorator('time')(
              <RangePicker
                disabledDate={disabledDate}
                // disabledTime={disabledRangeTime}
                showTime={{
                  hideDisabledOptions: true,
                  format: 'HH:mm',
                  minuteStep: 5,
                }}
                format="YYYY-MM-DD HH:mm"
              />
            )}
            <Button type="primary" style={{ marginLeft: 5 }} onClick={addTime}>
              +
            </Button>
          </div>
        </Item>
        {diffTimeList.length ? (
          <div style={{ marginLeft: 80, marginBottom: 10 }}>
            {diffTimeList.map(([begin, end], index) => (
              <Tag
                key={index}
                closable
                color="blue"
                onClose={() => handleClose(index)}
                style={{ marginBottom: 5 }}
              >
                {`${begin.format('YYYY-MM-DD HH:mm')}  ~   ${end.format('YYYY-MM-DD HH:mm')}`}
              </Tag>
            ))}
          </div>
        ) : null} */}
        {/* <Item label="重复外呼">
          <div className={styles['inline-select']}>
            {getFieldDecorator('name', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">未接听</Option>
                <Option value="2">已拒听</Option>
                <Option value="3">无</Option>
              </Select>
            )}
            {getFieldDecorator('name1', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">1小时</Option>
                <Option value="2">2小时</Option>
                <Option value="3">3小时</Option>
              </Select>
            )}
            {getFieldDecorator('name2', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">1次</Option>
                <Option value="2">2次</Option>
                <Option value="3">3次</Option>
              </Select>
            )}
          </div>
        </Item>
        <Item label="挂机外呼">
          <div className={styles['inline-select']}>
            {getFieldDecorator('name', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">未接听</Option>
                <Option value="2">已拒听</Option>
                <Option value="3">无</Option>
              </Select>
            )}
            {getFieldDecorator('name1', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">1小时</Option>
                <Option value="2">2小时</Option>
                <Option value="3">3小时</Option>
              </Select>
            )}
            {getFieldDecorator('name2', {
              defaultValue: '1',
              // rules: [{ message: '请输入' }],
            })(
              <Select>
                <Option value="1">1次</Option>
                <Option value="2">2次</Option>
                <Option value="3">3次</Option>
              </Select>
            )}
          </div>
        </Item> */}
        <Item {...tailLayout}>
          <Button
            htmlType="submit"
            type="primary"
            // className="test-input-search"
            onClick={() => handleOk()}
          >
            提交任务
          </Button>
          {configValue && configValue.id && 
            <Button
              style={{ marginLeft: '10px' }}
              className="test-input-search"
              onClick={e => {cancel()}}
            >
              取消任务
            </Button>
          }
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
export default connect(mapStateToProps)(
  Form.create({})(Index));
