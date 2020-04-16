import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Table,  Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import CategoryAddFormModal from './AddFormModal';
import DateFormat from '@/components/DateFormat';
import CategoryQueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { addBatch,batchRelated,batchCancel,batchDelete } from '@/services/nameList';


function Index({ dispatch, location, namelist }) {
  const { batchList,ivrIntents, batchCur, batchPageSize,batchRequest } = namelist;
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
            //   type: 'fetchBatchDetail',
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
        type: 'namelist/getBatch',
        payload: {pageNum:batchCur-1},
      });
      dispatch({
        type: 'namelist/save',
        payload: {batchRequest:{...batchRequest,pageNum:batchCur-1 }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    next: () => {
      dispatch({
        type: 'namelist/getBatch',
        payload: {pageNum:batchCur+1},
      });
      dispatch({
        type: 'namelist/save',
        payload: {batchRequest:{...batchRequest,pageNum:batchCur+1 }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    onSizeChange: pageSize => {
      dispatch({
        type: 'namelist/getBatch',
        payload: {pageSize},
      });
      dispatch({
        type: 'namelist/save',
        payload: {batchRequest:{...batchRequest,pageSize }},
      });
      setSelectedRowKeys({ selectedRowKeys:[] });
    },
    showNext: batchList && batchList.length < batchPageSize,
    // sortedInfo,
    onChange: (start, length) => {
      dispatch({
        type: 'namelist/getBatch',
        payload: {pageSize: length, pageNum: start || 1},
      });
      dispatch({
        type: 'namelist/save',
        payload: {batchRequest:{pageSize: length, pageNum: start || 1}},
      }); 
    
      // onChange(
      //   {
      //     start,
      //     length,
      //     status,
      //   },
      //   () => {
      //     onSubmit({
      //       start,
      //       length,
      //       status,
      //       modelCode,
      //       order: sorter.columnKey,
      //       dir: sorter.order,
      //     });
      //     this.pending = false;
      //   }
      // );
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
    handleDelete: (ids) => {
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
              type: 'namelist/getBatch',
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
    },
  };
 
  return (
    <Card
      bordered={false}
      title="外呼任务"
      extra={
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            setValue({});
          }}
        >
          新建任务
        </Button>
      }
    >
      <CategoryQueryForm
        value={query}
        onSubmit={data => {
          dispatch({
            type: 'namelist/save',
            payload: {taskQueryValue:data},
          }); 
          dispatch({
            type: 'namelist/getBatch',
            payload: data,
          });
        }}
      />
      {renderTable(setting)}
      <CategoryAddFormModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        onSubmit={data => {
          const {triggerTime,...rest } = data;
          addBatch(data)
          .then(body => {
            message.success('新增任务成功');
            dispatch({
              type: 'namelist/getBatch',
              payload: {},
            });
          })
          .catch(e => {});
          setValue(null);
        }}
      />
    </Card>
  );
}

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Index);
