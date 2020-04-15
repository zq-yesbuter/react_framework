import React, { PureComponent, Fragment, useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Divider, Modal, Table, Dropdown, Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import UploadModal from './UploadModal';
import DateFormat from '../../../components/DateFormat';
import QueryForm from './QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { nameBatchDelete } from '@/services/nameList';

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
function Index({ dispatch, location, namelist }) {
  const { nameList, ivrIntents, nameCur, namePageSize, nameRequest } = namelist;
  const { search } = window.location;
  const {id,intent}=queryString.parse(search);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'picture/init',
      });
    };
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
      {/* <Menu.Item key={1} onClick={downloadResumes}>
        批量导出简历
      </Menu.Item> */}
      <Menu.Item key={2} onClick={batchExportInvent}>
        批量导出沟通汇总信息
      </Menu.Item>
      {/* <Menu.Item key={5}>删除</Menu.Item> */}
    </Menu>
  );

  // const batchName = decodeURI(search.slice(1));
  const setting = {
    current: nameCur,
    columns: renderColumns(dispatch,ivrIntents),
    pageSize: namePageSize,
    loading,
    selectedRowKeys,
    showNext: nameList && nameList.length < namePageSize,
    data: nameList || [],
    total:  nameList && nameList.length,
    onChange: (start, length) => {
      // this.setState(
      //   ({ fields }) => ({
      //     fields: {
      //       ...fields,
      //       start,
      //       length,
      //     },
      //   }),
      //   () => {
      //     this.handleSubmit();
      //     this.pending = false;
      //   }
      // );
      
      dispatch({
        type: 'namelist/getBatchDetail',
        payload: { start, length },
      });
      setSelectedRowKeys([]);
      // this.setState({
      //   selectedRows: [],
      //   sortedInfo: sorter,
      // });
    },
    prev: () => {
      dispatch({
        type: 'namelist/getBatchDetail',
        payload: {pageNum:nameCur-1, id,intent},
      });
      dispatch({
        type: 'namelist/save',
        payload: {nameRequest:{...nameRequest,pageNum:nameCur-1 }},
      });
    },
    next: () => {
      dispatch({
        type: 'namelist/getBatchDetail',
        payload: {pageNum:nameCur+1,id,intent},
      });
      dispatch({
        type: 'namelist/save',
        payload: {nameRequestt:{...nameRequest,pageNum:nameCur+1 }},
      });
    },
    onSizeChange: pageSize => {
      dispatch({
        type: 'namelist/getBatchDetail',
        payload: {pageSize,id,intent},
      });
      dispatch({
        type: 'namelist/save',
        payload: {nameRequest:{...nameRequest,pageSize }},
      });
    },
    rowKey: 'invitationId',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        // this.setState({ , selectedRows });
      },
    },
    importMenu,
    hasImport: true,
    exportFunction: (ids) => {
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
    },
    handleDelete: (updateIds) => {
      Modal.confirm({
        title: '删除',
        content: (
          <div>
            <p>你确定要批量删除这些数据吗？</p>
          </div>
        ),
        onOk: () => {
          nameBatchDelete({ intent, updateIds }).then(() => {
            dispatch({
              type: 'namelist/getBatchDetail',
              payload: { id, intent },
            });
          })
          .catch(e => {
            message.error(e.message);
          });
        },
        okText: '确认',
        cancelText: '取消',
      });
    },
  };
  // 筛选条件
  function onSubmit(values) {
    dispatch({
      type: 'namelist/getBatchDetail',
      payload: { id,intent,...values },
    });
    dispatch({
      type: 'namelist/save',
      payload: {nameRequest:values},
    }); 
  }

  function batchExportInvent(invitationIds) {
    const fileName = '导出邀约信息.xlsx';
    let size = 0;
    fetch(`/data/${intent}/list/all`, {
      method: 'POST',
      body: JSON.stringify({ invitationIds, pageNum: 1, pageSize: 500, orderBy: { applyDate: 'DESC' } }),
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
          },
        });
      })
      .then(stream => new Response(stream))
      .then(response => savingFile(response, fileName))
      .catch(err => message.error(err.message));
  }

  function onExportChange() {}

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          外呼名单
          <a
            href="javascript:;"
            style={{
              padding: '5px 15px',
              fontSize: 14,
            }}
            onClick={e => {
              e.preventDefault();
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
    </Card>
  );
}

export default connect(({ namelist }) => {
  return {
    namelist,
  };
})(Index);
