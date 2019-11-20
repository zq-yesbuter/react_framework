import React, { useState, useEffect,Fragment } from 'react';
import { Radio, List, Spin,Input,Button,Table ,Card,Checkbox,Select,Divider } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListItem from './ListItem';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
function ChatList({ dispatch, wechatrecord={} }) {
  const { talker='二傻' } = wechatrecord;
  const tabs = [{ name: '排序', value: 3 }, { name: '筛选', value: 2 }];
  const [value, setValue] = useState();
  const [loading, setLoading] = useState([false]);
  const [checkUsername, setCheckUsername] = useState(talker);
  const [selectedKeys, hadleSelectedKeys] = useState([])
  const [selectId,setSelectId] = useState();

  function handleTabs(e) {
    setValue(e.target.value);
    setLoading(true);
    dispatch({
      type: 'wechatrecord/save',
      payload: {
        messageList: [],
        type: e.target.value,
        newTalk:true,
      },
    });
    dispatch({
      type: 'wechatrecord/getChatList',
      payload: { type: e.target.value },
    });
  }
const dataSource = [
  {
    id: '1',
    name: '胡彦斌',
    content: '邀约成功',
  },
  {
    id: '2',
    name: '胡彦',
    content: '邀约失败',
  },
  {
    id: '3',
    name: '胡',
    content: '待邀约',
  },
];

  function header() {
    return (
      <Radio.Group value={value} onChange={handleTabs}>
        {tabs.map(({ name, value: key }) => (
          <Radio.Button
            className={styles.radioButton}
            style={{ minWidth: '160px', textAlign: 'center' }}
            key={name}
            value={key}
          >
            {name}
          </Radio.Button>
        ))}
      </Radio.Group>
    );
  }
  function getMessage(username) {
    if (username === wechatrecord.talker) {
      setCheckUsername(username);
      return;
    }
    dispatch({
      type: 'wechatrecord/save',
      payload: {
        messageList: [],
        noLoading: true,
        newTalk: true,
      },
    });
    dispatch({
      type: 'wechatrecord/getMessage',
      payload: { talker: username },
    });
    dispatch({
      type: 'wechatrecord/save',
      payload: {
        talker: username,
      },
    });
    setCheckUsername(username);
  }

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    hadleSelectedRowKeys(selectedRowKeys)
  };

  function onSelectItem(id) {
    console.log(id);
    setSelectId(id);
  }
  useEffect(() => {
    setCheckUsername(talker);
  }, [talker]);
  function onChange(e,id) {
    console.log('e==>',e,'id===>',id)
    let newSelectedKeys=[...selectedKeys];
    if(e.target.checked){
      newSelectedKeys.push(id);
    }else{
      newSelectedKeys=newSelectedKeys.filter(item => item!==id);
    }
    console.log('=========',newSelectedKeys);
    hadleSelectedKeys(newSelectedKeys);
  }
  function onAllChange(){

  }
  function component() {
    const { chatList, tableListLoading } = wechatrecord;
    let chatComponent;
    if (tableListLoading) {
      chatComponent = (
        <div className={styles.tableLoading}>
          <Spin tip="加载中..." />
        </div>
      );
    } else if (!loading && !chatList.length) {
      chatComponent = (
        <div className={styles.noContent}>
          <span>没有数据</span>
        </div>
      );
    } else {
      chatComponent = dataSource.map(item => (<ListItem {...item} onChange={onChange} onSelectItem={onSelectItem} selectId={selectId} />) )
    }
    return chatComponent;
  }
  function bottom(){
    return (
      <div className={styles.bottom}>
        <Divider />
        <div className={styles.bottomContent}>
          <Checkbox onChange={onAllChange}>全选</Checkbox>
          <Select
            showSearch
            style={{ width: 200 }}
            onChange={onExportChange}
          >
            <Option value="1">导出简历/邀约结果</Option>
            <Option value="2">批量设置邀约结果</Option>
          </Select>
        </div>
      </div>  
    );
  }
  function onExportChange() {

  }
  return (
    <Fragment>
      <div className={styles.search}>
         <Search
          placeholder="请根据姓名、手机号搜索"
          onSearch={value => console.log(value)}
        />
        <Button icon="plus" style={{marginLeft:10}}/>
      </div>
      {header()}
      {component()}
      {bottom()}
    </Fragment>
  );
}

ChatList.propTypes = {
  wechatrecord: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = ({ wechatrecord }) => ({ wechatrecord });
export default connect(mapStateToProps)(ChatList);
