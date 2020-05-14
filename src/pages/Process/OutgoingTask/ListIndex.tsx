/* eslint-disable guard-for-in */
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import CategoryAddFormModal from './AddFormModal';
import CategoryQueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { addBatch,batchDelete } from '@/services/nameList';

interface Props {
  dispatch: Function;
  namelist: any;
}
function Index(props:Props) {
  const { dispatch, namelist } = props;
  const { batchList,ivrIntents, batchCur, batchPageSize,batchRequest,batchTotal } = namelist;
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    // return () => {
    //   dispatch({
    //     type: 'picture/init',l
    //   });
    // };
  }, []);
  const { pathname } = window.location;
  const isAllDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'deleteAll';
  const isDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'delete';
  const query = {};
  function handleDelete(ids) {
    Modal.confirm({
      title: '删除',
      content: (
        <div>
          <p>你确定要批量删除这些数据吗？</p>
        </div>
      ),
      onOk: () => {
        const selectArr: Array<string>=[];
        const selectObj = {};
        ids.forEach((id: string) => {
          const obj = batchList.find((item: { id: string,intent: string }) => item.id === id);
          selectArr.push(obj);
        });
        selectArr.forEach((item:any) => {
          if(Object.keys(selectObj).includes(item.intent)){
            selectObj[item.intent].push(item.id)
          }else{
            selectObj[item.intent] = [item.id]
          }
        });
        const questAll = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const item in selectObj) {
          questAll.push(batchDelete({ intent: item, ids: selectObj[item] }));
        }
        // eslint-disable-next-line compat/compat
        Promise.all(questAll)
          .then(result => {
            let successCount = 0;
            let errorCount = 0;
            let errorMessages = [];
            if (result && result.length) {
              result.forEach(item => {
                successCount += item.successCount;
                errorCount += item.errorCount;
                errorMessages = errorMessages.concat(item.errorMessages);
              });
            }
            Modal.info({
              title: '删除信息反馈',
              content: (
                <div>
                  <p>{`删除成功${successCount}条`}</p>
                  {errorCount ? (
                    <p>{`删除失败${errorCount}条${
                      errorMessages.length ? `，错误原因【${errorMessages.join(',')}` : ''
                    }】`}</p>
                  ) : null}
                </div>
              ),
              onOk() {},
            });
            dispatch({
              type: 'namelist/getBatch',
              payload: {},
            });
            setSelectedRowKeys([]);
          })
          .catch(e => {
            message.error(`删除失败！${e.message}`);
          });
      },
      okText: '确认',
      cancelText: '取消',
    });
  }
  const setting = {
    data: batchList,
    total: batchTotal,
    current: batchCur,
    pageSize: batchPageSize,
    columns: renderColumns(dispatch, ivrIntents),
    loading,
    selectedRowKeys,
    prev: () => {
      dispatch({
        type: 'namelist/getBatch',
        payload: { pageNum: batchCur - 1 },
      });
      dispatch({
        type: 'namelist/save',
        payload: { batchRequest: { ...batchRequest, pageNum: batchCur - 1 } },
      });
      setSelectedRowKeys([]);
    },
    next: () => {
      dispatch({
        type: 'namelist/getBatch',
        payload: { pageNum: batchCur + 1 },
      });
      dispatch({
        type: 'namelist/save',
        payload: { batchRequest: { ...batchRequest, pageNum: batchCur + 1 } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: (pageSize: number) => {
      dispatch({
        type: 'namelist/getBatch',
        payload: { pageSize },
      });
      dispatch({
        type: 'namelist/save',
        payload: { batchRequest: { ...batchRequest, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    showNext: batchList && batchList.length < batchPageSize,
    onChange: (pageNum:number, pageSize:number) => {
      dispatch({
        type: 'namelist/getBatch',
        payload: { pageNum, pageSize },
      });
      dispatch({
        type: 'namelist/save',
        payload: { batchRequest: { ...batchRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    rowKey: 'id',
    rowSelection: {
      selectedRowKeys,
      // eslint-disable-next-line no-shadow
      onChange: (selectedRowKeys:string[]|number[]) => {
        setSelectedRowKeys(selectedRowKeys);
        // this.setState({ , selectedRows });
      },
      getCheckboxProps: ({ status }:{status:number}) => ({
        disabled: isAllDelete ? false : status === 3 || status === 4,
      }),
    },
    formatOperation: (selectedRowKeys: string[] | any[], hasSelected: any) => {
      return (
        <div style={{ marginTop: 10 }}>
          {isDelete ? null : (
            <Fragment>
              <Button disabled={!hasSelected} onClick={() => handleDelete(selectedRowKeys)}>
                删除
              </Button>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
              </span>
            </Fragment>
          )}
        </div>
      );
    },
  };

  return (
    <Card
      bordered={false}
      title="外呼任务"
      extra={
        <Fragment>
          {isDelete ? null : (
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setValue({});
              }}
            >
              新建任务
            </Button>
          )}
          {isAllDelete ? (
            <Button
              onClick={() => {
                dispatch(
                  routerRedux.push({
                    pathname: '/AI/outging/delete',
                  })
                );
              }}
              style={{ marginLeft: 10 }}
            >
              已删除任务
            </Button>
          ) : null}
        </Fragment>
      }
    >
      <CategoryQueryForm
        value={query}
        onSubmit={data => {
          const payload = isDelete ? { dataStatus: 2, ...data } : data;
          dispatch({
            type: 'namelist/save',
            payload: { taskQueryValue: data },
          });
          dispatch({
            type: 'namelist/save',
            payload: { batchRequest: isDelete ? { ...batchRequest, dataStatus: 2 } : batchRequest },
          });
          dispatch({
            type: 'namelist/getBatch',
            payload,
          });
        }}
      />
      {renderTable(setting)}
      <CategoryAddFormModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        submitLoading={submitLoading}
        onSubmit={(data: any) => {
          setSubmitLoading(true);
          addBatch(data)
            .then(() => {
              message.success('新增任务成功');
              dispatch({
                type: 'namelist/getBatch',
                payload: {},
              });
              setSubmitLoading(false);
            })
            .catch(() => {
              setSubmitLoading(false);
            });
          setValue(null);
        }}
      />
    </Card>
  );
}

const mapStateToProps = ({ namelist = {} }) => ({ namelist });
export default connect(mapStateToProps)(Index);
