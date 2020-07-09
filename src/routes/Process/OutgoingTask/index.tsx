import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal } from 'antd';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import CategoryAddFormModal from './AddFormModal';
import QueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { addBatch, batchDelete } from '@/services/nameList';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Setting } from '@/utils/tscontant';

interface Props {
  dispatch: Function;
  namelist: any;
  loading: boolean;
}
interface ErrorProps {
  successCount?: number | undefined;
  errorCount?: number | undefined;
  errorMessages?: string[];
}

function Index(props: Props): any {
  const { dispatch, namelist, loading } = props;
  const { batchList, ivrIntents, batchCur, batchPageSize, batchRequest, batchTotal } = namelist;
  const [value, setValue] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { pathname }: { pathname: String } = window.location;
  const isAllDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'deleteAll';
  const isDelete = pathname.slice(pathname.lastIndexOf('/') + 1) === 'delete';
  const query = {};
  function handleDelete(ids: any) {
    Modal.confirm({
      title: '删除',
      content: (
        <div>
          <p>你确定要批量删除这些数据吗？</p>
        </div>
      ),
      onOk: () => {
        const selectArr: Array<string> = [];
        const selectObj = {};
        ids.forEach((id: string) => {
          const obj = batchList.find((item: { id: string; intent: string }) => item.id === id);
          selectArr.push(obj);
        });
        selectArr.forEach((item: any) => {
          if (Object.keys(selectObj).includes(item.intent)) {
            selectObj[item.intent].push(item.id);
          } else {
            selectObj[item.intent] = [item.id];
          }
        });
        const questAll: any[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const item in selectObj) {
          questAll.push(batchDelete({ intent: item, ids: selectObj[item] }));
        }
        // eslint-disable-next-line compat/compat
        Promise.all(questAll)
          .then((result) => {
            let successCount = 0;
            let errorCount = 0;
            let errorMessages: any[] = [];
            if (result && result.length) {
              result.forEach((item: ErrorProps) => {
                successCount += item.successCount || 0;
                errorCount += item.errorCount || 0;
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
          .catch((e) => {
            message.error(`删除失败！${e.message}`);
          });
      },
      okText: '确认',
      cancelText: '取消',
    });
  }

  const setting: Setting = {
    data: batchList,
    total: batchTotal,
    current: batchCur,
    pageSize: batchPageSize,
    columns: renderColumns(dispatch, ivrIntents),
    loading,
    selectedRowKeys,
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
    onChange: (pageNum: number, pageSize: number) => {
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
      onChange: (selectedRowKeys: any) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      getCheckboxProps: ({ status }: { status: number }) => ({
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
    <PageHeaderWrapper
      title="招聘任务"
      breadcrumb={{
        routes: [
          { path: '/AI/outgoing/list', breadcrumbName: '招聘外呼' },
          { path: '/AI/outgoing/list', breadcrumbName: '招聘任务' },
        ],
        itemRender: (route, params, routes, paths) => {
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
    >
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
                  setValue(true);
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
                      pathname: '/AI/outgoing/delete',
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
        <QueryForm
          onSubmit={(data: any): void => {
            const { dateStart, dateEnd, ...rest } = data;
            const taskQueryValue = {
              dateStart: dateStart + ' 00:00:00',
              dateEnd: dateEnd + ' 23:59:59',
              ...rest,
              pageSize: 20, pageNum: 1
            };
            const payload = isDelete ? { dataStatus: 2, ...taskQueryValue } : taskQueryValue;
            dispatch({
              type: 'namelist/save',
              payload: { taskQueryValue },
            });
            dispatch({
              type: 'namelist/save',
              payload: {
                batchRequest: isDelete ? { ...batchRequest, dataStatus: 2 } : batchRequest,
              },
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
            setValue(false);
          }}
          submitLoading={submitLoading}
          onSubmit={(data: any) => {
            setSubmitLoading(true);
            addBatch(data)
              .then(() => {
                message.success('新增任务成功');
                dispatch({
                  type: 'namelist/getBatch',
                  payload: {pageSize: 20, pageNum: 1},
                });
                setSubmitLoading(false);
              })
              .catch(() => {
                setSubmitLoading(false);
              });
            setValue(false);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

const mapStateToProps = ({
  namelist,
  loading: {
    effects: { 'namelist/getBatch': loading },
  },
}: {
  namelist: any;
  loading: any;
}) => {
  return {
    namelist,
    loading,
  };
};
export default connect(mapStateToProps)(Index);
