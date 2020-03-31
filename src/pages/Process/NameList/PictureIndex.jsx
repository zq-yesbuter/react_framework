import React, { PureComponent, Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Divider, Modal, Table, Dropdown, Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import UploadModal from './UploadModal';
import DateFormat from '../../../components/DateFormat';
import CategoryQueryForm from './PictureQueryForm';

// import { detail } from '../../../services/picture';

function Index({ dispatch, location, list }) {
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
  const columns = [
    {
      title: '姓名',
      key: 'channel',
      dataIndex: 'channel',
    },
    {
      title: '电话',
      key: 'channelName',
      dataIndex: 'channelName',
    },
    {
      title: '岗位',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '面试时长',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '面试地址',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '外呼时间',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '挂机时间',
      key: 'entity1',
      dataIndex: 'entity1',
    },
    {
      title: '挂机原因',
      key: 'entity2',
      dataIndex: 'entity3',
    },
    {
      title: '状态',
      key: 'entity6',
      dataIndex: 'entity6',
    },
    {
      title: '更新人',
      key: 'modified',
      dataIndex: 'modified',
    },
    {
      title: '操作时间',
      key: 'modifiedDate',
      dataIndex: 'modifiedDate',
      width: 200,
      // render: modifiedDate => <DateFormat value={modifiedDate} />,
    },
    {
      title: '操作',
      key: 'channel',
      dataIndex: 'channel',
      width: 150,
      render: (channel, value) => {
        return (
          <Fragment>
            <a
              onClick={() => {
                dispatch(routerRedux.push('/AI/record'));
              }}
            >
              查看记录
            </a>
          </Fragment>
        );
      },
    },
  ];

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
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
  function batchExportInvent() {}
  function onExportChange() {}
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

  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed:===> ', selectedRowKeys);
    setSelectedRowKeys({ selectedRowKeys });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Card
      bordered={false}
      title="外呼名单"
      extra={
        <Button
          icon="plus"
          type="primary"
          onClick={() => {
            setValue({});
          }}
        >
          导入
        </Button>
      }
    >
      <CategoryQueryForm
        value={query}
        onSubmit={data => {
          dispatch(
            routerRedux.push({
              // pathname: location.pathname,
              search: queryString.stringify({
                ...query,
                ...data,
              }),
            })
          );
        }}
      />
      <div>
        <div style={{ marginBottom: 16 }}>
          <Dropdown
            overlay={importMenu}
            trigger={['hover']}
            placement="bottomCenter"
            disabled={!hasSelected}
          >
            <Button type="primary" onClick={start} loading={loading}>
              批量操作
            </Button>
          </Dropdown>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={[{}]} />
      </div>
      <UploadModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        onSubmit={data => {
          setValue(null);
          // dispatch({
          //   type: 'picture/createOrUpdate',
          //   payload: data,
          // })
          //   .then(() => {
          //     message.success(data.id ? '修改成功' : '新增成功');
          //     dispatch({
          //       type: 'picture/reload',
          //     });
          //     this.setState({
          //       value: null,
          //     });
          //   })
          //   .catch(e => {
          //     message.warn(e.message);
          //   });
        }}
      />
    </Card>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Index);
