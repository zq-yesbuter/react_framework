import React, { useState, useEffect, Fragment } from 'react';
import {
  Radio,
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
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListItem from './ListItem';
import ImportModal from './ImportModal';
import SetModal from './SetModal';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const sort = [{ key: '1', name: '按邀约时间排序' }, { key: '2', name: '按导入时间排序' }];
const filter = [
  { key: '1', name: '邀约状态' },
  { key: '2', name: '岗位' },
  { key: '3', name: '导入erp' },
  { key: '4', name: '导入时间' },
  { key: '5', name: '渠道' },
];
const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};
const data = [
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
function ChatList({ dispatch, chatrecord = {}, form }) {
  const { talker = '二傻' } = chatrecord;
  const [value, setValue] = useState();
  const [loading, setLoading] = useState([false]);
  const [checkUsername, setCheckUsername] = useState(talker);
  const [selectedKeys, hadleSelectedKeys] = useState([]);
  const [selectId, setSelectId] = useState();
  const [sortTitle, setSortTitle] = useState('排序');
  const [filterTitle, setFilterTitle] = useState('筛选');
  const [dataSource, setDataSource] = useState(data);
  const [allChecked, setAllChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);

  function handleTabs(e) {
    setValue(e.target.value);
    setLoading(true);
    dispatch({
      type: 'chatrecord/save',
      payload: {
        messageList: [],
        type: e.target.value,
        newTalk: true,
      },
    });
    dispatch({
      type: 'chatrecord/getChatList',
      payload: { type: e.target.value },
    });
  }

  function onSubmit() {
    form.validateFields((err, values) => {
      if (!err) {
        console.log('values===>', values);
      }
    });
  }
  function search() {
    const { getFieldDecorator } = form;
    return (
      <div className={styles.search}>
        {getFieldDecorator('name')(
          <Search placeholder="请根据姓名、手机号搜索" onSearch={onSubmit} />
        )}
        <Button icon="plus" style={{ marginLeft: 10 }} onClick={importResume}>
          导入简历
        </Button>
      </div>
    );
  }
  const importResume = () => setVisible(true);
  function onSelect({ selectedKeys }) {
    if (selectedKeys && selectedKeys.length) {
      setSortTitle(filterName(selectedKeys[0], sort));
    }
    form.setFieldsValue({ name1: selectedKeys[0] });
  }
  function onFilterSelect({ selectedKeys }) {
    if (selectedKeys && selectedKeys.length) {
      setFilterTitle(filterName(selectedKeys[0], filter));
    }
    form.setFieldsValue({ name2: selectedKeys[0] });
  }
  function header() {
    const { getFieldDecorator } = form;
    const sortMenu = (
      <Fragment>
        {getFieldDecorator('name1')(
          <Menu onSelect={onSelect}>
            {sort.map(({ key, name }) => (
              <Menu.Item key={key}>{name}</Menu.Item>
            ))}
          </Menu>
        )}
      </Fragment>
    );
    const filterMenu = (
      <Fragment>
        {getFieldDecorator('name2')(
          <Menu onSelect={onFilterSelect}>
            {filter.map(({ key, name }) => (
              <Menu.Item key={key}>{name}</Menu.Item>
            ))}
          </Menu>
        )}
      </Fragment>
    );
    return (
      <div className={styles.header}>
        <Dropdown overlay={sortMenu} trigger={['hover']} placement="bottomCenter">
          <div className={styles.common}>{sortTitle}</div>
        </Dropdown>
        <Dropdown overlay={filterMenu} trigger={['hover']} placement="bottomCenter">
          <div className={styles.common} style={{ marginLeft: 1 }}>
            {filterTitle}
          </div>
        </Dropdown>
      </div>
    );
  }
  function getMessage(username) {
    if (username === chatrecord.talker) {
      setCheckUsername(username);
      return;
    }
    dispatch({
      type: 'chatrecord/save',
      payload: {
        messageList: [],
        noLoading: true,
        newTalk: true,
      },
    });
    dispatch({
      type: 'chatrecord/getMessage',
      payload: { talker: username },
    });
    dispatch({
      type: 'chatrecord/save',
      payload: {
        talker: username,
      },
    });
    setCheckUsername(username);
  }

  const onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    // hadleSelectedRowKeys(selectedRowKeys);
  };

  function onSelectItem(id) {
    // console.log(id);
    setSelectId(id);
  }
  useEffect(() => {
    setCheckUsername(talker);
  }, [talker]);
  // 单选按钮
  function onChange(e, id) {
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    if (e.target.checked) {
      newSelectedKeys.push(id);
      newDataSource = dataSource.map(item => {
        return item.id === id ? { ...item, checked: true } : item;
      });
    } else {
      newSelectedKeys = newSelectedKeys.filter(item => item !== id);
      newDataSource = dataSource.map(item => {
        return item.id === id ? { ...item, checked: false } : item;
      });
    }
    if (newSelectedKeys && !newSelectedKeys.length) {
      setAllChecked(false);
    }
    if (newSelectedKeys && newSelectedKeys.length === newDataSource.length) {
      setAllChecked(true);
    }
    setDataSource(newDataSource);
    hadleSelectedKeys(newSelectedKeys);
  }
  // 全选按钮
  function onAllChange(e) {
    // console.log('e.target===>', e.target);
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    if (e.target.checked) {
      newDataSource = dataSource.map(item => ({ ...item, checked: true }));
      setAllChecked(true);
    } else {
      newSelectedKeys = [];
      newDataSource = dataSource.map(item => ({ ...item, checked: false }));
      setAllChecked(false);
    }
    setDataSource(newDataSource);
    hadleSelectedKeys(newSelectedKeys);
  }
  function component() {
    const { chatList, tableListLoading } = chatrecord;
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
      chatComponent = dataSource.map(item => (
        <ListItem
          key={item.id}
          {...item}
          onChange={onChange}
          onSelectItem={onSelectItem}
          selectId={selectId}
        />
      ));
    }
    return chatComponent;
  }
  function onExportChange({ selectedKeys }) {
    // console.log('xxxxxx');
    setSettingVisible(true);
  }
  function bottom() {
    const importMenu = (
      <Menu onClick={onExportChange}>
        <Menu.Item key={1}>导出简历/邀约结果</Menu.Item>
        <Menu.Item key={2}>批量设置邀约结果</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.bottom}>
        <Checkbox onChange={onAllChange} checked={allChecked}>
          全选
        </Checkbox>
        <Dropdown overlay={importMenu} trigger={['hover']} placement="bottomCenter">
          <Button style={{ width: 200 }}>导出邀约</Button>
        </Dropdown>
      </div>
    );
  }
  return (
    <Fragment>
      {search()}
      {header()}
      {component()}
      {bottom()}
      <ImportModal visible={visible} close={() => setVisible(false)} />
      <SetModal visible={settingVisible} close={() => setSettingVisible(false)} />
    </Fragment>
  );
}

const mapStateToProps = ({ chatrecord }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ChatList));
