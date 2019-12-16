import React, { useState, useEffect } from 'react';
import { Radio, List, Spin, Input, Button, Table, Card, Checkbox } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import user from '@/assets/user.svg';
import styles from './ListItem.less';

const { Search } = Input;
function ListItem({
  dispatch,
  onSelectItem,
  headImage,
  selectId,
  id,
  name,
  bespeakTime = new Date(),
  lastConnectTime = new Date(),
  onChange,
  content,
  checked,
}) {
  const avatarString = name || '空';
  // console.log(dispatch,onSelectItem,headImage,selectId,id,name,bespeakTime,lastConnectTime);
  // console.log('===>', selectId, id);
  const itemStyle = String(selectId) === id ? 'active' : 'normal';
  return (
    <li className={styles[`chanceItem_${itemStyle}`]}>
      <Checkbox onChange={e => onChange(e, id)} checked={checked} />
      <div className={styles.item} onClick={() => onSelectItem(id)}>
        <div className={styles.itemAvatar}>
          <img src={headImage || user} alt="avatar" />
        </div>
        <div className={styles.itemBaseInfo}>
          <div className={styles.name}>{name || '张三'}</div>
          <div>{content || '张三'}</div>
        </div>
        <div className={styles.itemTimeInfo}>
          <div title="邀约时间" style={{ color: '#ff4d4d' }}>
            {moment(bespeakTime).format('YY-MM-DD HH:mm')}
          </div>
          <div title="导入时间">{moment(lastConnectTime).format('YY-MM-DD HH:mm')}</div>
        </div>
      </div>
    </li>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(ListItem);
