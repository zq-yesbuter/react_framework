import React, { useState, useEffect, Fragment, useRef } from 'react';
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
  Alert,
} from 'antd';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListItem from './ListItem';
import ImportModal from './ImportModal';
import SetModal from './SetModal';
import OfferModal from './OfferModal';
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
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function ChatList({
  dispatch,
  chatrecord: {
    jobList = [],
    selectJobId,
    timeList = [],
    tableLoading,
    postList,
    bottomLoading,
    notData,
    pageNum,
    selectedKeys,
    showNotice,
  },
  form,
}) {
  const [value, setValue] = useState();
  // const [selectedKeys, hadleSelectedKeys] = useState([]);
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
  const [showMore, setShowMore] = useState(false);
  const [offerVisible, setOfferVisible] = useState(false);
  const listRef = useRef(null);

  // useEffect(() => {
  //   dispatch({
  //     type: 'chatrecord/jobAppliedAsPostAll',
  //   });
  // }, []);

  function onSubmit(paramOrderBy, newDateStart, newStatus, newDateEnd, pageNum) {
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
          requestValue = { ...requestValue, status: newStatus === true ? undefined : newStatus };
        }

        const reg = /^\d{1,11}$/;
        let nameObj = {};
        if (reg.test(name)) {
          nameObj = { tel: name, name: '' };
        } else {
          nameObj = { name, tel: '' };
        }
        if (pageNum !== 1) {
          dispatch({
            type: 'chatrecord/loadMoreList',
            payload: { ...nameObj, ...requestValue, pageSize: 20, pageNum },
          });
          dispatch({
            type: 'chatrecord/save',
            payload: {
              requestFilter: { orderBy: { applyDate: 'DESC' }, ...nameObj, ...requestValue },
            },
          });
          return;
        }

        // hadleSelectedKeys([]);
        dispatch({
          type: 'chatrecord/jobAppliedAsPostAll',
          payload: { ...nameObj, ...requestValue, pageSize: 20, pageNum },
        });
        dispatch({
          type: 'chatrecord/save',
          payload: {
            requestFilter: { orderBy: { applyDate: 'DESC' }, ...nameObj, ...requestValue},
            selectedKeys:[],
          },
        });
      }
    });
  }
  function handleScroll() {
    const { clientHeight, scrollHeight, scrollTop } = (listRef && listRef.current) || {};
    if (clientHeight < scrollHeight) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
    if (scrollHeight - (scrollTop + clientHeight) < 10) {
      if (!notData) {
        const newPageNum = pageNum + 1;
        onSubmit(undefined, undefined, undefined, undefined, newPageNum);
        dispatch({
          type: 'chatrecord/save',
          payload: {
            pageNum: newPageNum,
          },
        });
      }
    }
  }

  function search() {
    const { getFieldDecorator } = form;
    return (
      <div className={styles.search}>
        {getFieldDecorator('name')(
          <Search
            placeholder="请根据姓名、手机号搜索"
            onSearch={() => onSubmit(undefined, undefined, undefined, undefined, 1)}
          />
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
    onSubmit(e.key, undefined, undefined, undefined, 1);
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
      type: 'chatrecord/queryTimeList',
      payload: {
        selectJobId,
      },
    });
    dispatch({
      type: 'chatrecord/queryOfferTimeList',
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
    dispatch({
      type: 'chatrecord/save',
      payload: {
        selectedKeys: newSelectedKeys,
      },
    });
    // hadleSelectedKeys(newSelectedKeys);
  }

  // 全选按钮
  function onAllChange(e) {
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    if (e.target.checked) {
      newDataSource = jobList.map(item => ({ ...item, checked: !item.disabled }));
      newSelectedKeys = jobList.filter(item => !item.disabled).map(item => item.applyId);
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
        selectedKeys: newSelectedKeys,
      },
    });
    // hadleSelectedKeys(newSelectedKeys);
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
      chatComponent = (
        <Fragment>
          {jobList.map(item => (
            <ListItem
              key={item.applyId}
              {...item}
              onChange={onChange}
              onSelectItem={onSelectItem}
              selectJobId={selectJobId}
              timeList={timeList}
            />
          ))}
          {showMore ? (
            <div className={styles.noBottomContent}>
              {bottomLoading ? <Spin /> : notData ? '没有更多数据了！' : null}
            </div>
          ) : null}
        </Fragment>
      );
    }
    return chatComponent;
  }
  function onExportChange({ selectedKeys }) {
    // console.log('xxxxxx');
    setSettingVisible(true);
  }
  const savingFile = (response, fileName) => {
    const that = this;
    response.blob().then(blob => {
      if (typeof FileReader === 'undefined') {
        message.error('您的浏览器不支持 FileReader，请升级浏览器');
      }
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        let resu = '';
        try {
          resu = JSON.parse(reader.result);
          // resu = eval('('+ reader.result + ')')
          if (resu.code === 500) {
            message.error(resu.msg);
          } else if (resu.code === 401) {
            message.error(resu.msg);
          }
        } catch (e) {
          // 捕获错误 说明是文本字符串
          resu = reader.result;
          downloadBlob(blob, fileName);
        }
      });
      reader.readAsText(blob);
      // 下载
      function downloadBlob(blob, fileName) {
        let blobUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }
    });
  };
  function downloadResumes() {
    const resumeList = jobList.filter(item => selectedKeys.includes(item.applyId));
    const resumeIds = resumeList.map(item => item.resumeId);
    const fileName = '导出简历信息.zip';
    let size = 0;
    fetch('/tenant/job/apply/resume/attachment/download', {
      method: 'POST',
      body: JSON.stringify({ resumeIds }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        message.error(`请求错误 ${response.status}: 导出简历时发生错误！`);
        const errortext = codeMessage[response.status] || response.statusText;
        const error = new Error(errortext);
        error.name = response.status;
        error.response = response;
        throw error;
      }) // 取出body
      .then(response => response.body)
      .then(body => {
        // console.log('body====>jianli==>',body);
        const reader = body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader
                .read()
                .then(res => {
                  // res  ({ done, value })
                  // 读不到更多数据就关闭流
                  // console.log(res,'res');
                  const { done, value } = res;
                  if (done) {
                    // console.log('end')
                    controller.close();
                    return;
                  }
                  size += value.length || 0;
                  // console.log(size,"size")
                  // 将下一个数据块置入流中
                  controller.enqueue(value);
                  return pump();
                })
                .catch(e => message.error(e.message));
            }
          },
        });
      })
      .then(stream => new Response(stream))
      .then(response => savingFile(response, fileName))
      .catch(err => message.error(err.message));
  }
  function onSizeChange(page, pageSize) {
    // console.log('page===>', page, 'pageSize==>', pageSize);
  }
  function onShowSizeChange(page, pageSize) {
    // console.log('page===>', page, 'pageSize==>', pageSize);
  }
  function onOfferChange() {
    setOfferVisible(true);
  }
  function batchExportInvent() {
    const resumeList = jobList.filter(item => selectedKeys.includes(item.applyId));
    const applyIds = resumeList.map(item => item.applyId);
    const fileName = '导出邀约信息.xlsx';
    let size = 0;
    fetch('/data/interview/invitations/all', {
      method: 'POST',
      body: JSON.stringify({ applyIds, pageNum: 1, pageSize: 500, orderBy: { applyDate: 'DESC' } }),
      headers: {
        Accept: 'application/vnd.ms-excel',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        message.error(`请求错误 ${response.status}: 导出邀约信息时发生错误！`);
        const errortext = codeMessage[response.status] || response.statusText;
        const error = new Error(errortext);
        error.name = response.status;
        error.response = response;
        throw error;
      }) // 取出body
      .then(response => response.body)
      .then(body => {
        const reader = body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader
                .read()
                .then(res => {
                  // res  ({ done, value })
                  // 读不到更多数据就关闭流
                  // console.log(res,'res');
                  const { done, value } = res;
                  if (done) {
                    // console.log('end')
                    controller.close();
                    return;
                  }
                  size += value.length || 0;
                  // console.log(size,"size")
                  // 将下一个数据块置入流中
                  controller.enqueue(value);
                  return pump();
                })
                .catch(e => message.error(e.message));
            }
          },
        });
      })
      .then(stream => new Response(stream))
      .then(response => savingFile(response, fileName))
      .catch(err => message.error(err.message));
  }
  // 导出offer邀约信息
  function batchOfferInvent() {
    const resumeList = jobList.filter(item => selectedKeys.includes(item.applyId));
    const applyIds = resumeList.map(item => item.applyId);
    const fileName = '导出offer邀约信息.xlsx';
    let size = 0;
    fetch('/data/offer/invitations/all', {
      method: 'POST',
      body: JSON.stringify({ applyIds, pageNum: 1, pageSize: 500, orderBy: { applyDate: 'DESC' } }),
      headers: {
        Accept: 'application/vnd.ms-excel',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        message.error(`请求错误 ${response.status}: 导出邀约信息时发生错误！`);
        const errortext = codeMessage[response.status] || response.statusText;
        const error = new Error(errortext);
        error.name = response.status;
        error.response = response;
        throw error;
      }) // 取出body
      .then(response => response.body)
      .then(body => {
        const reader = body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader
                .read()
                .then(res => {
                  // res  ({ done, value })
                  // 读不到更多数据就关闭流
                  // console.log(res,'res');
                  const { done, value } = res;
                  if (done) {
                    // console.log('end')
                    controller.close();
                    return;
                  }
                  size += value.length || 0;
                  // console.log(size,"size")
                  // 将下一个数据块置入流中
                  controller.enqueue(value);
                  return pump();
                })
                .catch(e => message.error(e.message));
            }
          },
        });
      })
      .then(stream => new Response(stream))
      .then(response => savingFile(response, fileName))
      .catch(err => message.error(err.message));
  }
  function bottom() {
    const importMenu = (
      <Menu>
        <Menu.Item key={1} onClick={downloadResumes}>
          批量导出简历
        </Menu.Item>
        <Menu.Item key={2} onClick={batchExportInvent}>
          批量导出面试邀约
        </Menu.Item>
        <Menu.Item key={3} onClick={batchOfferInvent}>
          批量导出录用邀约
        </Menu.Item>
        {/* <Menu.Item key={3}>导出简历+邀约</Menu.Item> */}
        {/* <Menu.Item key={4} onClick={onExportChange}>
          分配邀约面试时间
        </Menu.Item> */}
        <Menu.Item key={5} onClick={onOfferChange}>
          分配录用通知时间
        </Menu.Item>
      </Menu>
    );
    return (
      <Fragment>
        {/* <Pagination
          size="small"
          total={50}
          showSizeChanger
          showQuickJumper
          style={{ position: 'fixed', bottom: 60, backgroundColor: '#fff' }}
          pageSize={20}
          onChange={onSizeChange}
          onShowSizeChange={onShowSizeChange}
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
  // 筛选条件查询时发的请求
  function handleOk(dateStart, status, dateEnd) {
    setDateEnd(dateEnd ? dateEnd.format('YYYY-MM-DD HH:mm:ss') : dateEnd);
    setDateStart(dateStart ? dateStart.format('YYYY-MM-DD HH:mm:ss') : dateStart);
    setStatus(status === true ? undefined : status);
    onSubmit(undefined, dateStart, status, dateEnd, 1);
  }
  function resetSelectList() {
    let newSelectedKeys = [...selectedKeys];
    let newDataSource = [];
    newSelectedKeys = [];
    newDataSource = jobList.map(item => ({ ...item, checked: false }));
    setAllChecked(false);
    dispatch({
      type: 'chatrecord/save',
      payload: {
        jobList: newDataSource,
        selectedKeys: newSelectedKeys,
      },
    });
    // hadleSelectedKeys(newSelectedKeys);
  }
  return (
    <Fragment>
      {search()}
      {header()}
      {showNotice ? (
        <div className={styles.noticeFix}>
          <div>
            有新的信息变化，请
            {/* <Icon
              type="sync"
              onClick={() => {
                dispatch({
                  type: 'chatrecord/jobAppliedAsPostAll',
                });
                // window.location.reload();
                // dispatch({type:'chatrecord/save',payload:{showNotice:false}})
                setShowNotice(false); 
              }}
              style={{ fontSize: '17px', color: '#08c', marginLeft: 7, marginRight: 7 }}
            /> */}
            <span
              onClick={() => {
               dispatch({
                type: 'chatrecord/jobAppliedAsPostAll',
              });
              // window.location.reload();
              dispatch({type:'chatrecord/save',payload:{showNotice:false}})
              // setShowNotice(false); 
            }} 
            >
            点击刷新
            </span>
            查看
          </div>
        </div>
     ) : null}
      <div className={styles.listContent} ref={listRef} onScroll={_.throttle(handleScroll, 1000)}>
        {component()}
      </div>
      {bottom()}
      <ImportModal visible={visible} close={() => setVisible(false)} postList={postList} />
      <SetModal
        visible={settingVisible}
        selectedKeys={selectedKeys}
        close={() => setSettingVisible(false)}
        jobList={jobList}
        resetSelectList={resetSelectList}
      />
      <FilterModal
        visible={filterVisible}
        close={() => setFilterVisible(false)}
        handleOk={handleOk}
      />
      <OfferModal
        visible={offerVisible}
        selectedKeys={selectedKeys}
        close={() => setOfferVisible(false)}
        jobList={jobList}
        resetSelectList={resetSelectList}
      />
    </Fragment>
  );
}

const mapStateToProps = ({ chatrecord }) => ({ chatrecord });
export default connect(mapStateToProps)(Form.create({})(ChatList));
