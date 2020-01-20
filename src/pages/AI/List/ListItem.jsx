import React, { useState, useEffect } from 'react';
import { Radio, List, Spin, Input, Button, Table, Card, Checkbox, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import user from '@/assets/user.svg';
import styles from './ListItem.less';

const { Search } = Input;
function ListItem({
  onSelectItem,
  headImage,
  selectJobId,
  name,
  onChange,
  checked,
  status,
  applyDate,
  applyId,
  timeList,
  jobName,
  disabled,
  interviewTime,
  triggerTime,
  offerTime,
}) {
  const itemStyle = String(selectJobId) === applyId ? 'active' : 'normal';
  function formatStatus(status) {
    switch (status) {
      case 11:
        return '已解析';
      case 12:
        return '已评价（申请阶段）';
      case 13:
        return '已通过（申请阶段）';
      case 14:
        return '已拒绝（申请阶段）';
      case 21:
        return '待邀约';
      case 22:
        return '邀约中断';
      case 23:
        return '邀约未成功';
      case 24:
        return '邀约成功';
      case 31:
        return '已面试（面试阶段）';
      case 32:
        return '已评价（面试阶段）';
      case 33:
        return '已通过（面试阶段）';
      case 34:
        return '已拒绝（面试阶段）';
      case 71:
        return 'Offer待联系';
      case 72:
        return 'Offer已联系';
      case 73:
        return 'Offer未确认';
      case 74:
        return 'Offer已确认';
      default:
        return '无';
    }
  }
  function formatBackground(status) {
    switch (true) {
      case status > 10 && status < 20:
        return { color: 'gray' };
      case status === 23 || status === 14 || status === 34:
        return { color: 'red' };
      case status === 21 || status === 22 || status === 24:
        return { color: 'green' };
      case (status > 30 && status < 34) || status > 70:
        return { color: 'green' };
      default:
        return { color: 'red' };
    }
  }
  function formatInventTime(timeList, applyId) {
    const list = timeList.filter(item => item.applyId === applyId);
    return list.length ? list.slice(-1)[0].interviewTime : null;
  }
  return (
    <li className={styles[`chanceItem_${itemStyle}`]}>
      <Checkbox onChange={e => onChange(e, applyId)} checked={checked} disabled={disabled} />
      <div className={styles.item} onClick={() => onSelectItem(applyId)}>
        <div className={styles.itemAvatar}>
          <img src={headImage || user} alt="avatar" />
        </div>
        <div className={styles.itemBaseInfo}>
          <div>
            <span className={styles.name}>{name || '无'}</span>
            <span>{`(${jobName || '无'})`}</span>
          </div>
          <div>{formatStatus(status) || '无'}</div>
        </div>
        <div className={styles.itemTimeInfo}>
          {/* <Tooltip title="邀约时间" placement="topRight"> */}
          <div title="录用外呼时间" className={styles.inventTime} style={{ color: 'blue' }}>
            {status > 70 && offerTime ? offerTime : null}
          </div>
          <div title="外呼时间" className={styles.inventTime} style={formatBackground(status)}>
            {status > 20 && status < 70 && triggerTime ? triggerTime : null}
          </div>
          {/* </Tooltip> */}
          <div title="导入时间">{applyDate}</div>
        </div>
      </div>
    </li>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(ListItem);
