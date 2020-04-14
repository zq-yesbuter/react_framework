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


function Index({ dispatch, location, namelist }) {
  const { nameList,ivrIntents } = namelist;
  console.log('nameList===>', nameList);
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
      <Menu.Item key={1} onClick={downloadResumes}>
        批量导出简历
      </Menu.Item>
      <Menu.Item key={2} onClick={batchExportInvent}>
        批量导出面试邀约
      </Menu.Item>
      <Menu.Item key={5}>删除</Menu.Item>
    </Menu>
  );
  const setting = {
    data: nameList || [],
    total: 0, // faqList.total,
    current: start / length + 1,
    columns: renderColumns(dispatch,ivrIntents),
    pageSize: length,
    loading,
    selectedRowKeys,
    // sortedInfo,
    onChange: (start, length) => {
      console.log('start==>', start, length);
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
        type: 'namelist/getNameList',
        payload: { start, length },
      });
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
  function downloadResumes() {
    // const resumeList = jobList.filter(item => selectedKeys.includes(item.applyId));
    // const resumeIds = resumeList.map(item => item.resumeId);
    // const fileName = '导出简历信息.zip';
    // let size = 0;
    // fetch('/resume/attachment/download', {
    //   method: 'POST',
    //   body: JSON.stringify({ resumeIds }),
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json; charset=utf-8',
    //   },
    // })
    //   .then(response => {
    //     if (response.status >= 200 && response.status < 300) {
    //       return response;
    //     }
    //     message.error(`请求错误 ${response.status}: 导出简历时发生错误！`);
    //     const errortext = codeMessage[response.status] || response.statusText;
    //     const error = new Error(errortext);
    //     error.name = response.status;
    //     error.response = response;
    //     throw error;
    //   }) // 取出body
    //   .then(response => response.body)
    //   .then(body => {
    //     // console.log('body====>jianli==>',body);
    //     const reader = body.getReader();
    //     return new ReadableStream({
    //       start(controller) {
    //         return pump();
    //         function pump() {
    //           return reader
    //             .read()
    //             .then(res => {
    //               // res  ({ done, value })
    //               // 读不到更多数据就关闭流
    //               // console.log(res,'res');
    //               const { done, value } = res;
    //               if (done) {
    //                 // console.log('end')
    //                 controller.close();
    //                 return;
    //               }
    //               size += value.length || 0;
    //               // console.log(size,"size")
    //               // 将下一个数据块置入流中
    //               controller.enqueue(value);
    //               return pump();
    //             })
    //             .catch(e => message.error(e.message));
    //         }
    //       },
    //     });
    //   })
    //   .then(stream => new Response(stream))
    //   .then(response => savingFile(response, fileName))
    //   .catch(err => message.error(err.message));
  }
  // 筛选条件
  function onSubmit(values) {
    console.log('values===>', values);
    const { name } = values;
    const reg = /^\d{1,11}$/;
    let nameObj = {};
    if (reg.test(name)) {
      nameObj = { tel: name, name: '' };
    } else {
      nameObj = { name, tel: '' };
    }

    // hadleSelectedKeys([]);
    dispatch({
      type: 'namelist/getNameList',
      payload: { ...nameObj },
    });
  }
  function batchExportInvent() {}
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
      />
    </Card>
  );
}

export default connect(({ namelist }) => {
  return {
    namelist,
  };
})(Index);
