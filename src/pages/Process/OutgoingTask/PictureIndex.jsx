import React, { PureComponent, Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Divider, Modal, Table, Dropdown, Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import CategoryAddFormModal from './AddFormModal';
// import StandardTable from '../../../components/StandardTable';
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
      title: '任务名',
      key: 'channel',
      dataIndex: 'channel',
    },
    {
      title: '任务类型',
      key: 'channelName',
      dataIndex: 'channelName',
    },
    {
      title: '外呼流程',
      key: 'terminalType',
      dataIndex: 'terminalType',
    },
    {
      title: '外呼名单',
      key: 'entity',
      dataIndex: 'entity',
    },
    {
      title: '外呼号段',
      key: 'keywords',
      dataIndex: 'keywords',
    },
    {
      title: '外呼开始时间',
      key: 'entity',
      dataIndex: 'entity',
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
                dispatch(routerRedux.push('/AI/config'));
              }}
            >
              配置
            </a>
            <Divider type="vertical" />
            <a onClick={() => dispatch(routerRedux.push('/AI/namelist'))}>名单</a>
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
  const hasSelected = selectedRowKeys.length > 0;
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
      <CategoryAddFormModal
        value={value}
        onCancel={() => {
          setValue(null);
        }}
        onSubmit={data => {
          dispatch({
            type: 'picture/createOrUpdate',
            payload: data,
          })
            .then(() => {
              message.success(data.id ? '修改成功' : '新增成功');
              dispatch({
                type: 'picture/reload',
              });
              this.setState({
                value: null,
              });
            })
            .catch(e => {
              message.warn(e.message);
            });
        }}
      />
    </Card>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Index);
