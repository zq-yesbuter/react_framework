import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Table,  Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import DateFormat from '@/components/DateFormat';
import CategoryQueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { addBatch,batchRelated,batchCancel,batchDelete } from '@/services/nameList';


function Index({ dispatch, location, recruit }) {
  const { batchList,ivrIntents, batchCur, batchPageSize,batchRequest } = recruit;
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    // return () => {
    //   dispatch({
    //     type: 'picture/init',
    //   });
    // };
  }, []);

  const handleRemoveConfirm = value => {
    const { id } = value;
    Modal.confirm({
      title: '删除',
      content: (
        <div>
          <p>你确定要删除该条吗</p>
        </div>
      ),
      onOk: () => {
        dispatch({
          type: 'picture/removeCategory',
          payload: { id },
        })
          .then(() => {
            message.success('删除成功!');
            // dispatch({
            //   type: 'getBatchDetail',
            //   payload: queryString.parse(search),
            // });
          })
          .catch(e => {
            message.warn(e.message);
          });
      },
      okText: '确认',
      cancelText: '取消',
    });
  };

  const query = {}; //  queryString.parse(location.search);
 
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const importMenu = (
    <Menu>
      <Menu.Item key={5}>删除</Menu.Item>
    </Menu>
  );

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const setting = {
    data: batchList,
    total:  batchList && batchList.length, // < batchCur*batchPageSize ? batchList.length : batchCur*batchPageSize + 1,
    current: batchCur,
    columns: renderColumns(dispatch,ivrIntents),
    pageSize: batchPageSize,
    loading,
    selectedRowKeys,
    prev: () => {
      dispatch({
        type: 'recruit/getBatch',
        payload: {pageNum:batchCur-1},
      });
      dispatch({
        type: 'recruit/save',
        payload: {batchRequest:{...batchRequest,pageNum:batchCur-1 }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    next: () => {
      dispatch({
        type: 'recruit/getBatch',
        payload: {pageNum:batchCur+1},
      });
      dispatch({
        type: 'recruit/save',
        payload: {batchRequest:{...batchRequest,pageNum:batchCur+1 }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    onSizeChange: pageSize => {
      dispatch({
        type: 'recruit/getBatch',
        payload: {pageSize},
      });
      dispatch({
        type: 'recruit/save',
        payload: {batchRequest:{...batchRequest,pageSize }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    showNext: batchList && batchList.length < batchPageSize,
    // sortedInfo,
    onChange: (start, length) => {
      dispatch({
        type: 'recruit/getBatch',
        payload: {pageSize: length, pageNum: start || 1},
      });
      dispatch({
        type: 'recruit/save',
        payload: {batchRequest:{pageSize: length, pageNum: start || 1}},
      }); 
      setSelectedRowKeys([]);
      // this.setState({
      //   selectedRows: [],
      //   sortedInfo: sorter,
      // });
    },
    rowKey: 'id',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        // this.setState({ , selectedRows });
      },
    },
    importMenu,
    formatOperation: (selectedRowKeys,hasSelected) => {
      return (
        <div style={{marginTop:10}}>
          <Button disabled={!hasSelected} onClick={() => handleDelete(selectedRowKeys)}>移入面试</Button>
          <Button disabled={!hasSelected} onClick={() => handleDelete(selectedRowKeys)} style={{ marginLeft: 8 }}>筛选未通过</Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
          </span>
        </div>
      )
    },
  };
  
  function  handleDelete(ids){
    Modal.confirm({
      title: '删除',
      content: (
        <div>
          <p>你确定要批量删除这些数据吗？</p>
        </div>
      ),
      onOk: () => {
        let selectArr=[];
        let selectObj = {};
        ids.forEach(id => {
          const selectObj = batchList.find(item => item.id === id);
          selectArr.push(selectObj);
        });
        selectArr.forEach(item => {
          if(Object.keys(selectObj).includes(item.intent)){
            selectObj[item.intent].push(item.id)
          }else{
            selectObj[item.intent] = [item.id]
          }
        })
        let questAll = [];
        for (let item in selectObj) {
          questAll.push(batchDelete({ intent:item, ids:selectObj[item] }) )
        }
        Promise.all(questAll).then((result) => {
          message.success('删除成功！');
          dispatch({
            type: 'recruit/getBatch',
            payload: {},
          });  
          setSelectedRowKeys([]);  
        }).catch((error) => {
          message.error('删除失败！');
        })
      },
      okText: '确认',
      cancelText: '取消',
    });
  };
 
  return (
    <Card
      bordered={false}
      title="内推记录"
      extra={
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            dispatch(routerRedux.push('/AI/recruit/post/add'));
           }}
        >
          新建岗位
        </Button>
      }
    >
      <CategoryQueryForm
        value={query}
        onSubmit={data => {
          dispatch({
            type: 'recruit/save',
            payload: {taskQueryValue:data},
          }); 
          dispatch({
            type: 'recruit/getBatch',
            payload: data,
          });
        }}
      />
      {renderTable(setting)}
    </Card>
  );
}

const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(Index);
