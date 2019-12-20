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
  Pagination,
  message,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListItem from './ListItem';
import ImportModal from './ImportModal';
import SetModal from './SetModal';
import FilterModal from './FilterModal';
import { batchExportResume } from '@/services/ai';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;
const { Item } = Form;
const sort = [
  { key: 'ASC', name: '按导入时间升序排序' },
  { key: 'DESC', name: '按导入时间降序排序' },
]; // { key: '1', name: '按邀约时间排序' },
const filter = [
  // { key: '1', name: '邀约状态' },
  { key: '2', name: '岗位' },
  // { key: '3', name: '导入erp' },
  { key: '4', name: '导入时间' },
  // { key: '5', name: '渠道' },
];
const filterName = (key, arr) => {
  return arr.find(item => item.key === key) && arr.find(item => item.key === key).name;
};

function ChatList({
  dispatch,
  chatrecord: { jobList = [], selectJobId, timeList = [], tableLoading, postList },
  form,
}) {
  const [value, setValue] = useState();
  const [selectedKeys, hadleSelectedKeys] = useState([]);
  const [sortTitle, setSortTitle] = useState('排序');
  const [filterTitle, setFilterTitle] = useState('筛选');
  const [allChecked, setAllChecked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [dateStart, setDateStart] = useState();
  const [status, setStatus] = useState();
  const [dateEnd, setDateEnd] = useState();

  useEffect(() => {
    dispatch({
      type: 'chatrecord/jobAppliedAsPostAll',
    });
    dispatch({
      type: 'chatrecord/queryInformation',
    });
  }, []);

  function onSubmit(paramOrderBy, newDateStart, newStatus, newDateEnd) {
    form.validateFields((err, values) => {
      if (!err) {
        const { name } = values;
        let requestValue = { dateStart, status, dateEnd };
        if (orderBy) {
          requestValue = { ...requestValue, orderBy: { applyDate: orderBy } };
        }
        if (paramOrderBy) {
          requestValue = { ...requestValue, orderBy: { applyDate: paramOrderBy } };
        }
        if (newDateStart) {
          requestValue = { ...requestValue, dateStart: newDateStart.format('YYYY-MM-DD HH:mm:ss') };
        }
        if (newDateEnd) {
          requestValue = { ...requestValue, dateEnd: newDateEnd.format('YYYY-MM-DD HH:mm:ss') };
        }
        if (newStatus) {
          requestValue = { ...requestValue, status: newStatus };
        }
        dispatch({
          type: 'chatrecord/jobAppliedAsPostAll',
          payload: { name, ...requestValue },
        });
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
  const importResume = () => {
    setVisible(true);
  };
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
  function sortSelect(e) {
    setOrderBy(e.key);
    onSubmit(e.key);
  }
  function header() {
    const { getFieldDecorator } = form;
    const sortMenu = (
      <Fragment>
        {getFieldDecorator('orderBy')(
          <Menu onSelect={sortSelect}>
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
        {/* <Dropdown overlay={filterMenu} trigger={['hover']} placement="bottomCenter"> */}
        <div
          className={styles.common}
          style={{ marginLeft: 1 }}
          onClick={() => setFilterVisible(true)}
        >
          {filterTitle}
        </div>
        {/* </Dropdown> */}
      </div>
    );
  }

  function onSelectItem(selectJobId) {
    dispatch({
      type: 'chatrecord/save',
      payload: {
        selectJobId,
      },
    });
    dispatch({
      type: 'chatrecord/getFlowList',
      payload: {
        selectJobId,
      },
    });
    dispatch({
      type: 'chatrecord/getMessage',
      payload: {
        group: selectJobId,
      },
    });
    const { resumeId } = jobList.find(item => item.applyId === selectJobId);
    dispatch({
      type: 'chatrecord/fetchResume',
      payload: {
        resumeId,
      },
    });
  }

  // 单选按钮
  function onChange(e, applyId) {
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    if (e.target.checked) {
      newSelectedKeys.push(applyId);
      newDataSource = jobList.map(item => {
        return item.applyId === applyId ? { ...item, checked: true } : item;
      });
    } else {
      newSelectedKeys = newSelectedKeys.filter(item => item !== applyId);
      newDataSource = jobList.map(item => {
        return item.applyId === applyId ? { ...item, checked: false } : item;
      });
    }
    if (newSelectedKeys && !newSelectedKeys.length) {
      setAllChecked(false);
    }
    if (newSelectedKeys && newSelectedKeys.length === newDataSource.length) {
      setAllChecked(true);
    }
    dispatch({
      type: 'chatrecord/save',
      payload: {
        jobList: newDataSource,
      },
    });
    hadleSelectedKeys(newSelectedKeys);
  }

  // 全选按钮
  function onAllChange(e) {
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    if (e.target.checked) {
      newDataSource = jobList.map(item => ({ ...item, checked: true }));
      newSelectedKeys = jobList.map(item => item.applyId);
      setAllChecked(true);
    } else {
      newSelectedKeys = [];
      newDataSource = jobList.map(item => ({ ...item, checked: false }));
      setAllChecked(false);
    }
    dispatch({
      type: 'chatrecord/save',
      payload: {
        jobList: newDataSource,
      },
    });
    hadleSelectedKeys(newSelectedKeys);
  }
  function component() {
    let chatComponent;
    if (tableLoading) {
      chatComponent = (
        <div className={styles.noContent}>
          <Spin />
        </div>
      );
    } else if (!jobList.length) {
      chatComponent = (
        <div className={styles.noContent}>
          <span>没有数据</span>
        </div>
      );
    } else {
      chatComponent = jobList.map(item => (
        <ListItem
          key={item.applyId}
          {...item}
          onChange={onChange}
          onSelectItem={onSelectItem}
          selectJobId={selectJobId}
          timeList={timeList}
        />
      ));
    }
    return chatComponent;
  }
  function onExportChange({ selectedKeys }) {
    // console.log('xxxxxx');
    setSettingVisible(true);
  }
  function onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
  }
  function bottom() {
    const importMenu = (
      <Menu>
        <Menu.Item
          key={1}
          onClick={() => {
            batchExportResume({ applyIds: selectedKeys })
              .then(res => {
                console.log('res', res);
                const blob = res.data;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = e => {
                  const a = document.createElement('a');
                  a.download = '文件名称.zip';
                  // 后端设置的文件名称在res.headers的 "content-disposition": "form-data; name=\"attachment\"; filename=\"20181211191944.zip\"",
                  a.href = e.target.result;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                };
                message.success('导出简历成功！');
              })
              .catch(e => message.error(e.message));
          }}
        >
          批量导出简历
        </Menu.Item>
        {/* <Menu.Item key={2}>导出邀约</Menu.Item> */}
        {/* <Menu.Item key={3}>导出简历+邀约</Menu.Item> */}
        <Menu.Item key={4} onClick={onExportChange}>
          分配邀约时间
        </Menu.Item>
      </Menu>
    );
    return (
      <Fragment>
        {/* <Pagination
          style={{position:'fixed',bottom:60,backgroundColor:'#fff'}}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={3}
          total={500}
        /> */}
        <div className={styles.bottom}>
          <Checkbox onChange={onAllChange} checked={allChecked}>
            全选
          </Checkbox>
          <Dropdown
            overlay={importMenu}
            trigger={['hover']}
            placement="bottomCenter"
            disabled={!selectedKeys.length}
          >
            <Button style={{ width: 200 }}>批量操作</Button>
          </Dropdown>
        </div>
      </Fragment>
    );
  }
  function handleOk(dateStart, status, dateEnd) {
    setDateEnd(dateEnd ? dateEnd.format('YYYY-MM-DD HH:mm:ss') : dateEnd);
    setDateStart(dateStart ? dateStart.format('YYYY-MM-DD HH:mm:ss') : dateStart);
    setStatus(status);
    setStatus(status);
    onSubmit(undefined, dateStart, status, dateEnd);
  }
  return (
    <Fragment>
      {search()}
      {header()}
      <div className={styles.listContent}>{component()}</div>
      {bottom()}
      <ImportModal visible={visible} close={() => setVisible(false)} postList={postList} />
      <SetModal
        visible={settingVisible}
        selectedKeys={selectedKeys}
        close={() => setSettingVisible(false)}
        jobList={jobList}
      />
      <FilterModal
        visible={filterVisible}
        close={() => setFilterVisible(false)}
        handleOk={handleOk}
      />
    </Fragment>
  );
}

const mapStateToProps = ({ chatrecord }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ChatList));
