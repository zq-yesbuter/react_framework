import React, { useState, useEffect } from 'react';
import { Radio, DatePicker, Select,Input } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import styles from './index.less';
import { getDateString } from '@/utils/utils';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;
const { Option } = Select;
function ChatHeader({ dispatch, wechatrecord={} }) {
  const { wechatList=[], conUserName='jjj' } = wechatrecord;
  const [value, setValue] = useState(getDateString('today'));
  const [selectValue, setSelectValue] = useState(conUserName);

  let absoluteDateValue = null;
  if (value) {
    const [startDate, endDate] = value.split(',');
    absoluteDateValue = [moment(startDate, dateFormat), moment(endDate, dateFormat)];
  }
  useEffect(() => {
    dispatch({
      type: 'wechatrecord/save',
      payload: {
        time: getDateString('today'),
        conUserName: selectValue,
        type: 3,
      },
    });
  }, []);
  useEffect(
    () => {
      setSelectValue(conUserName);
    },
    [conUserName],
  );

  return (
    <div
      style={{
        display: 'flex',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 2,
      }}
    >
      <Input/>
    </div>
  );
}

ChatHeader.propTypes = {
  wechatrecord: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = ({ wechatrecord }) => ({ wechatrecord });
export default connect(mapStateToProps)(ChatHeader);
