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
import _ from 'lodash';
import moment from 'moment';
import { batchInvent, editBatchInvitation, fetchInvitation } from '@/services/ai';
import { flatten } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const { MonthPicker, RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formatSelectedKeys = (selectedKeys, jobList) => {
  let arr = [];
  selectedKeys.forEach(val => {
    const arrItem = jobList.find(item => item.applyId === val);
    arr.push(arrItem);
  });
  return arr;
};
const formatTime = (diffTimeList, selectedKeys, diff) => {
  let list = [];
  const newData = _.cloneDeep(diffTimeList);
  newData.forEach(item => {
    const [begin, end] = item;
    const diffTime = end.diff(begin, 'minutes');
    // eslint-disable-next-line radix
    const len = parseInt(diffTime / diff);
    const show =
      len > 0
        ? Array(len)
            .fill(0)
            .reduce(acc => {
              acc.push({
                interviewStartTime: begin.format('YYYY-MM-DD HH:mm'),
                interviewEndTime: begin.add(diff, 'minutes').format('YYYY-MM-DD HH:mm'),
              });
              return acc;
            }, [])
        : [];
    list.push(...show);
  });
  return list;
};
function ImportModal({ dispatch, visible, form, close, selectedKeys, jobList, resetSelectList }) {
  const [diffTimeList, setDiffTimeList] = useState([]);
  const { getFieldDecorator, validateFields, resetFields, getFieldValue, setFieldsValue } = form;

  function formatInventTime(timeList, applyId) {
    const list = timeList.filter(item => item.applyId === applyId);
    return list.length ? list.slice(-1)[0].invitationId : null;
  }
  function handleOk() {
    validateFields((err, values) => {
      if (!err) {
        if (!diffTimeList.length) {
          message.warn('选择了时间段需要点击添加按钮哦！');
          return;
        }
        const { diff, triggerTime } = values;
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        let allTime = 0;
        diffTimeList.forEach(([begin, end]) => {
          const diffTime = end.diff(begin, 'minutes');
          allTime += diffTime / diff;
        });
        if (allTime < selectedKeys.length) {
          message.warn('请选择足够批量人数的面试时间的时间段！');
          return;
        }
        const timeList = formatTime(diffTimeList, selectedKeys, diff);
        // console.log('formatTime====>',timeList);
        const nameList = formatSelectedKeys(selectedKeys, jobList);
        let batch = [];
        // console.log('nameList====>',nameList);
        nameList.forEach(({ id, applyId, status }, index) => {
          batch.push({
            applicantId: id,
            applyId,
            status,
            triggerTime: triggerTime.format('YYYY-MM-DD HH:mm'),
            ...timeList[index],
          });
        });
        const addBatch = batch
          .filter(item => item.status !== 21)
          .map(({ status, ...item }) => item);
        let editBatch = batch.filter(item => item.status === 21).map(({ status, ...item }) => item);
        // console.log('add===>',addBatch,'editBatch===>',editBatch);
        let resolvedPromisesArray = [];
        if (editBatch.length) {
          const applyIds = editBatch.map(item => item.applyId) || [];
          fetchInvitation({ applyIds })
            .then(timeList => {
              editBatch = editBatch.map(item => {
                // console.log('timelist====>',timeList,formatInventTime(timeList, item.applyId))
                return { ...item, updateId: formatInventTime(timeList, item.applyId) || null };
              });
              // console.log('editBatch===>',editBatch);
              resolvedPromisesArray.push(editBatchInvitation({ batch: editBatch }));
              if (addBatch.length) {
                resolvedPromisesArray.push(batchInvent({ batch: addBatch }));
              }
              Promise.all(resolvedPromisesArray)
                .then(data => {
                  let errorCount=0;
                  let successCount=0;
                  let success = [];
                  data.forEach(item => {
                    errorCount+=item.errorCount;
                    successCount+=item.successCount;
                    // success.push(item.success);
                  })
                  console.log('success===>',success)
                  if(!errorCount){
                    message.success('批量邀约成功');
                  }else{
                    message.warn(`批量邀约成功${successCount}人，批量邀约失败${errorCount}人`);
                  }
                  // const successList = flatten(success);
                  // console.log(errorCount,successCount,successList);
                  // Modal.info({
                  //   title: '批量邀约成功',
                  //   content: (
                  //     <div>
                  //       <p>{`邀约成功${successCount}人，邀约失败${errorCount}人`}</p>
                  //       {formatSelectedKeys(successList,jobList).map(item =>
                  //         <p>{`${item ? item.name : null}邀约成功`}</p>
                  //       )}
                  //     </div>
                  //   ),
                  //   onOk() {() => close()},
                  // });
                  resetFields();
                  setDiffTimeList([]);
                  close();
                  dispatch({
                    type: 'chatrecord/jobAppliedAsPostAll',
                  });
                  // dispatch({
                  //   type: 'chatrecord/updateSingleInvent',
                  // });
                  resetSelectList();
                })
                .catch(e => message.error(e.message));
            })
            .catch(e => message.error(`出现错误：${e.message}`));
        } else if (addBatch.length) {
          batchInvent({ batch: addBatch })
            .then(data => {
              // message.success('批量邀约成功');
              if(!data.errorCount){
                message.success('批量邀约成功');
              }else{
                message.warn(`批量邀约成功${data.successCount}人，批量邀约失败${data.errorCount}人`);
              }
              // Modal.info({
              //   title: '批量新增邀约成功',
              //   content: (
              //     <div>
              //       <p>{`邀约成功${data.successCount}人，邀约失败${data.errorCount}人`}</p>
              //       {formatSelectedKeys(data.success,jobList).map(item =>
              //         <p>{`${item.name}邀约成功`}</p>
              //       )}
              //     </div>
              //   ),
              //   // onOk() {() => close()},
              // });
              resetFields();
              setDiffTimeList([]);
              close();
              // dispatch({
              //   type: 'chatrecord/updateSingleInvent',
              // });
              dispatch({
                type: 'chatrecord/jobAppliedAsPostAll',
              });
              resetSelectList();
            })
            .catch(e => message.error(e.message));
        }
      }
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
  return (
    <Modal
      title="设置邀约时间"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        resetFields();
        close();
        setDiffTimeList([]);
      }}
    >
      <Form {...formItemLayout}>
        <Item label="面试邀约人" required>
          <div style={{ marginLeft: 10 }}>
            {formatSelectedKeys(selectedKeys, jobList).length
              ? formatSelectedKeys(selectedKeys, jobList).map((item, index) => (
                  <Tag color="blue" key={index}>
                    {(item && item.name) || null}
                  </Tag>
                ))
              : null}
          </div>
        </Item>
        <Item label="外呼时间" required>
          {getFieldDecorator('triggerTime', {
            rules: [{ required: true, message: '请选择外呼时间!' }],
          })(
            <DatePicker
              showTime={{ format: 'HH:mm', minuteStep: 5 }}
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择外呼时间"
              style={{ display: 'block' }}
            />
          )}
        </Item>
        <Item label="面试时长">
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
                  // defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
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
        ) : null}
        {/* <Item label="短信发送" required>
          {getFieldDecorator('name', {
            defaultValue: 1,
            rules: [{ required: true, message: '请输入导入人!' }],
          })(
            <Select>
              <Option value="1">立即发送</Option>
            </Select>
          )}
        </Item> */}
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
