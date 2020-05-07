import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import UploadModal from './UploadModal';
// eslint-disable-next-line import/extensions
import QueryForm from './QueryForm.jsx';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { nameBatchDelete } from '@/services/nameList';
import Record from '../Record';

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
const savingFile = (response, fileName) => {
  // 下载
  function downloadBlob(blob) {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  }
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
  });
};
function Index({ dispatch, namelist, loading }) {
  const {
    nameList,
    nameCur,
    namePageSize,
    nameRequest,
    batchDetail,
    nameTotal,
  } = namelist;
  const { status, name } = batchDetail;
  const { search } = window.location;
  const { id, intent } = queryString.parse(search);
  const [value, setValue] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showVisible,setShowVisible] = useState(false);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'picture/init',
      });
    };
  }, []);

  const query = {}; //  queryString.parse(location.search);
  const importMenu = (
    <Menu>
      <Menu.Item key={2}>
        批量导出沟通汇总信息
      </Menu.Item>
    </Menu>
  );

  function handleDelete(updateIds) {
    Modal.confirm({
      title: '删除',
      content: (
        <div>
          <p>你确定要批量删除这些数据吗？</p>
        </div>
      ),
      onOk: () => {
        if (status === 1) {
          if (updateIds.length >= namePageSize) {
            dispatch({
              type: 'namelist/deleteMore',
              payload: { namePageSize, pageNum: nameCur + 1 },
            }).then(response => {
              const { data: deleteNameList } = response;
              if (deleteNameList.length) {
                nameBatchDelete({ intent, updateIds })
                  .then(({ successCount, errorCount, errorMessages }) => {
                    Modal.info({
                      title: '删除信息反馈',
                      content: (
                        <div>
                          <p>{`删除成功${successCount}人`}</p>
                          {errorCount ? (
                            <p>{`删除失败${errorCount}人${
                              errorMessages && errorMessages.length
                                ? `，错误原因【${errorMessages.join(',')}`
                                : ''
                            }】`}
                            </p>
                          ) : null}
                        </div>
                      ),
                      onOk() {},
                    });
                    dispatch({
                      type: 'namelist/fetchBatchDetail',
                      payload: { id, intent },
                    });
                  })
                  .catch(e => {
                    message.error(e.message);
                  });
              } else {
                Modal.confirm({
                  title: '该任务处于待外呼状态，您确认要删除勾选的名单数据吗？',
                  content: '所有名单都被删除时任务会自动回退到【已创建】状态',
                  onOk() {
                    nameBatchDelete({ intent, updateIds })
                      .then(({ successCount, errorCount, errorMessages }) => {
                        Modal.info({
                          title: '删除信息反馈',
                          content: (
                            <div>
                              <p>{`删除成功${successCount}人`}</p>
                              {errorCount ? (
                                <p>{`删除失败${errorCount}人${
                                  errorMessages && errorMessages.length
                                    ? `，错误原因【${errorMessages.join(',')}`
                                    : ''
                                }】`}
                                </p>
                              ) : null}
                            </div>
                          ),
                          onOk() {},
                        });
                        dispatch({
                          type: 'namelist/fetchBatchDetail',
                          payload: { id, intent },
                        });
                      })
                      .catch(e => {
                        message.error(e.message);
                      });
                  },
                  onCancel() {
                    console.log('Cancel');
                  },
                  okText: '确认',
                  cancelText: '取消',
                });
              }
            });
          } else {
            Modal.confirm({
              title: '该任务处于待外呼状态，您确认要删除勾选的名单数据吗？',
              content: '所有名单都被删除时任务会自动回退到【已创建】状态',
              onOk() {
                nameBatchDelete({ intent, updateIds })
                  .then(({ successCount, errorCount, errorMessages }) => {
                    Modal.info({
                      title: '删除信息反馈',
                      content: (
                        <div>
                          <p>{`删除成功${successCount}人`}</p>
                          {errorCount ? (
                            <p>{`删除失败${errorCount}人${
                              errorMessages && errorMessages.length
                                ? `，错误原因【${errorMessages.join(',')}`
                                : ''
                            }】`}
                            </p>
                          ) : null}
                        </div>
                      ),
                      onOk() {},
                    });
                    dispatch({
                      type: 'namelist/fetchBatchDetail',
                      payload: { id, intent },
                    });
                  })
                  .catch(e => {
                    message.error(e.message);
                  });
              },
              onCancel() {
                console.log('Cancel');
              },
              okText: '确认',
              cancelText: '取消',
            });
          }
        } else {
          nameBatchDelete({ intent, updateIds })
            .then(({ successCount, errorCount, errorMessages }) => {
              Modal.info({
                title: '删除信息反馈',
                content: (
                  <div>
                    <p>{`删除成功${successCount}人`}</p>
                    {errorCount ? (
                      <p>{`删除失败${errorCount}人${
                        errorMessages && errorMessages.length
                          ? `，错误原因【${errorMessages.join(',')}`
                          : ''
                      }】`}
                      </p>
                    ) : null}
                  </div>
                ),
                onOk() {},
              });
              dispatch({
                type: 'namelist/fetchBatchDetail',
                payload: { id, intent },
              });
            })
            .catch(e => {
              message.error(e.message);
            });
        }
      },
      okText: '确认',
      cancelText: '取消',
    });
  }
  function batchExportInvent(invitationIds) {
    const fileName = '导出邀约信息.xlsx';
    // eslint-disable-next-line no-unused-vars
    let size = 0;
    fetch(`/data/${intent}/list/all`, {
      method: 'POST',
      body: JSON.stringify({
        invitationIds,
        pageNum: 1,
        pageSize: 500,
        orderBy: { applyDate: 'DESC' },
      }),
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
        // eslint-disable-next-line compat/compat
        return new ReadableStream({
          start(controller) {
            function pump() {
              return reader
                .read()
                .then(res => {
                  // res  ({ done, value })
                  // 读不到更多数据就关闭流
                  // eslint-disable-next-line no-shadow
                  const { done, value } = res;
                  if (done) {
                    controller.close();
                    return;
                  }
                  size += value.length || 0;
                  // 将下一个数据块置入流中
                  controller.enqueue(value);
                  return pump();
                })
                .catch(e => message.error(e.message));
            }
            return pump();
          },
        });
      })
      // eslint-disable-next-line compat/compat
      .then(stream => new Response(stream))
      .then(response => savingFile(response, fileName))
      .catch(err => message.error(err.message));
  }
  function exportFunction(ids) {
    Modal.confirm({
      title: '导出名单',
      content: (
        <div>
          <p>确认导出名单这些数据吗？</p>
        </div>
      ),
      onOk: () => {
        batchExportInvent(ids);
      },
      okText: '确认',
      cancelText: '取消',
    });
  }
  const setting = {
    current: nameCur,
    columns: renderColumns(dispatch, intent,setShowVisible),
    pageSize: namePageSize,
    loading,
    selectedRowKeys,
    showNext: nameList && nameList.length < namePageSize,
    data: nameList || [],
    total: nameTotal,
    onChange: (pageNum, pageSize) => {
      dispatch({
        type: 'namelist/fetchBatchDetail',
        payload: { pageNum, pageSize, id, intent },
      });
      dispatch({
        type: 'namelist/save',
        payload: { nameRequest: { ...nameRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    prev: () => {
      dispatch({
        type: 'namelist/fetchBatchDetail',
        payload: { pageNum: nameCur - 1, id, intent },
      });
      dispatch({
        type: 'namelist/save',
        payload: { nameRequest: { ...nameRequest, pageNum: nameCur - 1 } },
      });
      setSelectedRowKeys([]);
    },
    next: () => {
      dispatch({
        type: 'namelist/fetchBatchDetail',
        payload: { pageNum: nameCur + 1, id, intent },
      });
      dispatch({
        type: 'namelist/save',
        payload: { nameRequestt: { ...nameRequest, pageNum: nameCur + 1 } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: pageSize => {
      dispatch({
        type: 'namelist/fetchBatchDetail',
        payload: { pageSize, id, intent },
      });
      dispatch({
        type: 'namelist/save',
        payload: { nameRequest: { ...nameRequest, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    rowKey: 'invitationId',
    rowSelection: {
      selectedRowKeys,
      // eslint-disable-next-line no-shadow
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
        // this.setState({ , selectedRows });
      },
    },
    importMenu,
    hasImport: true,
    // eslint-disable-next-line no-shadow
    formatOperation: (selectedRowKeys, hasSelected) => {
      return (
        <div style={{ marginTop: 10 }}>
          <Button disabled={!hasSelected} onClick={() => handleDelete(selectedRowKeys)}>
            删除
          </Button>
          <Button
            disabled={!hasSelected}
            onClick={() => exportFunction(selectedRowKeys)}
            style={{ marginLeft: 10 }}
          >
            导出邀约信息
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}
          </span>
        </div>
      );
    },
  };

  // 筛选条件
  function onSubmit(values) {
    dispatch({
      type: 'namelist/fetchBatchDetail',
      payload: { id, intent, ...values },
    });
    dispatch({
      type: 'namelist/save',
      payload: { nameRequest: { ...nameRequest, ...values} },
    });
  }

  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          {`任务${name} - 外呼名单`}
          <a
            href="javascript:;"
            style={{
              padding: '5px 15px',
              fontSize: 14,
            }}
            onClick={e => {
              e.preventDefault();
              dispatch({
                type: 'namelist/save',
                payload: { nameRequest: {pageSize: 50, pageNum: 1} },
              });
              dispatch(routerRedux.goBack());
            }}
          >
            返回上一级
          </a>
        </Fragment>
      }
      extra={
        <Button
          icon="upload"
          type="primary"
          onClick={() => {
            setValue({});
          }}
          disabled={status === 3 || status === 4}
        >
          导入
        </Button>
      }
    >
      <QueryForm
        value={query}
        onSubmit={data => {
          onSubmit(data);
        }}
      />
      {renderTable(setting)}
      <UploadModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        intent={intent}
      />
      <Record 
        visible={showVisible}
        onClose={() => {
          setShowVisible(false);
          dispatch({
            type: 'namelist/save',
            payload: { messageList: []},
          });
          if(document.getElementById('chatRecordRef')){
            document.getElementById('chatRecordRef').scrollTop = 0;
          }
        }}
      />
    </Card>
  );
}
  
// }

export default connect(
  ({
    namelist,
    loading: {
      effects: { 'namelist/fetchBatchDetail': loading },
    },
  }) => {
    return {
      namelist,
      loading,
    };
  }
)(Index);
