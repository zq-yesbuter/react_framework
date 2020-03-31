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
import {
  batchInvent,
  editBatchInvitation,
  fetchInvitation,
  batchAddOfffer,
  batchEditOfffer,
  queryOffferInventIds,
} from '@/services/ai';
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
                startTime: begin.format('YYYY-MM-DD HH:mm'),
                endTime: begin.add(diff, 'minutes').format('YYYY-MM-DD HH:mm'),
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
        const { diff, triggerTime } = values;
        if (triggerTime < moment().add(10, 'minutes')) {
          message.error('外呼时间请设置为大于当前时间10分钟以上哦！');
          return;
        }
        const nameList = formatSelectedKeys(selectedKeys, jobList);
        let batch = [];
        // console.log('nameList====>',nameList);
        nameList.forEach(({ id, applyId, status }, index) => {
          batch.push({
            applicantId: id,
            applyId,
            status,
            triggerTime: triggerTime.format('YYYY-MM-DD HH:mm'),
          });
        });
        const addBatch = batch
          .filter(item => item.status !== 71)
          .map(({ status, ...item }) => item);
        let editBatch = batch.filter(item => item.status === 71).map(({ status, ...item }) => item);
        // console.log('add===>',addBatch,'editBatch===>',editBatch);
        let resolvedPromisesArray = [];
        if (editBatch.length) {
          const applyIds = editBatch.map(item => item.applyId) || [];
          queryOffferInventIds({ applyIds })
            .then(timeList => {
              editBatch = editBatch.map(item => {
                // console.log('timelist====>',timeList,formatInventTime(timeList, item.applyId))
                return { ...item, updateId: formatInventTime(timeList, item.applyId) || null };
              });
              //   console.log('editBatch===>',editBatch);
              resolvedPromisesArray.push(batchEditOfffer({ batch: editBatch }));
              if (addBatch.length) {
                resolvedPromisesArray.push(batchAddOfffer({ batch: addBatch }));
              }
              Promise.all(resolvedPromisesArray)
                .then(data => {
                  let errorCount = 0;
                  let successCount = 0;
                  let success = [];
                  data.forEach(item => {
                    errorCount += item.errorCount;
                    successCount += item.successCount;
                  });
                  if (!errorCount) {
                    message.success('批量邀约成功');
                  } else {
                    message.warn(`批量邀约成功${successCount}人，批量邀约失败${errorCount}人`);
                  }
                  setDiffTimeList([]);
                  resetFields();
                  close();
                  dispatch({
                    type: 'chatrecord/jobAppliedAsPostAll',
                  });
                  resetSelectList();
                })
                .catch(e => message.error(e.message));
            })
            .catch(e => message.error(`出现错误：${e.message}`));
        } else if (addBatch.length) {
          batchAddOfffer({ batch: addBatch })
            .then(data => {
              if (!data.errorCount) {
                message.success('批量邀约成功');
              } else {
                message.warn(
                  `批量邀约成功${data.successCount}人，批量邀约失败${data.errorCount}人`
                );
              }
              setDiffTimeList([]);
              resetFields();
              close();
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

  return (
    <Modal
      title="设置录用通知时间"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        resetFields();
        close();
        // setDiffTimeList([]);
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
      </Form>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ImportModal));
