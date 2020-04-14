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
import { addBatch,batchRelated,batchCancel } from '@/services/nameList';


function Index({ dispatch, location, namelist }) {
  const { batchList,ivrIntents, batchCur, batchPageSize } = namelist;
  console.log('batchllist===>', batchList);
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
            dispatch({
              type: 'picture/reload',
            });
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
    console.log('selectedRowKeys changed:===> ', selectedRowKeys);
    setSelectedRowKeys({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  console.log(batchCur*batchPageSize,batchCur*batchPageSize + 1,)
  const setting = {
    data: batchList,
    total:  batchList && batchList.length, // < batchCur*batchPageSize ? batchList.length : batchCur*batchPageSize + 1,
    current: batchCur,
    columns: renderColumns(dispatch,ivrIntents),
    pageSize: batchPageSize,
    loading,
    selectedRowKeys,
    prev: () => {

    },
    next: () => {

    },
    showNext: batchList && batchList.length < batchPageSize,
    // sortedInfo,
    onChange: (start, length) => {
      console.log('start==>修改页码选择==》', start, length);
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
    rowKey: 'applyId',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed:===> ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys);
        // this.setState({ , selectedRows });
      },
    },
    importMenu,
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
          console.log('data===>', data); 
          dispatch({
            type: 'namelist/save',
            payload: {taskQueryValue:data},
          }); 
          dispatch({
            type: 'namelist/getBatch',
            payload: data,
          });
          // dispatch(
          //   routerRedux.push({
          //     // pathname: location.pathname,
          //     search: queryString.stringify({
          //       ...query,
          //       ...data,
          //     }),
          //   })
          // );
        }}
      />
      {renderTable(setting)}
      <CategoryAddFormModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        onSubmit={data => {
          console.log('data===>',data);
           dispatch({
            type: 'namelist/addBatchname',
            payload: data,
          })  
          message.success(data.id ? '修改成功' : '新增成功');
          // const {triggerTime,...rest } = data;
          // addBatch({triggerTime: triggerTime.format('YYYY-MM-DD HH:mm'),...rest})
          // .then(body => {
                
          // })
          // .catch(e => {});
          setValue(null);
        }}
      />
    </Card>
  );
}

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Index);
