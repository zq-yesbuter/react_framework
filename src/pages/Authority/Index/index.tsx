import React, { Fragment, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Row, Col, Tree, Tooltip, Icon, message, Button, Table } from 'antd';
import Detail from './Detail';
import Department from './Department';
import Company from './Company';
import { editDepartment, addUser } from '@/services/auth';
import './index.less';

const { TreeNode } = Tree;
interface Props {
  auth: any;
  dispatch: Function;
}
function Index(props:Props) {
  const {
    auth: { treeDepartList = [], userList = [],baseUserList = [], baseDepartList = [] },
    dispatch,
  } = props;
  const [visible, setVisible] = useState(false);
  const [addDepart, setAddDepart] = useState(false);
  const [companyVisible, setCompanyVisible] = useState(false);
  const [addId, setAddId] = useState();
  const [selectedKeys,setSelectedKeys] = useState([]);
  const [spin,setSpin] = useState(false);

  const renderTreeActions = (item:any) => {
    const commonContent = (
      <Fragment>
        <Tooltip title="添加子部门">
          <Icon
            className="active"
            type="plus-circle"
            theme="outlined"
            onClick={() => {
              setCompanyVisible(true);
              setAddId(item.id);
            }}
          />
        </Tooltip>
      </Fragment>
    );
    return <span className="extra">{commonContent}</span>;
  };

  const loop = (data: any[]) => {
    return data.map(item => {
      const title = (
        <Fragment>
          <span className="title">{item.name}</span>
          {renderTreeActions(item)}
        </Fragment>
      );
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.tenantId} title={title} item={item}>
            {loop(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode key={item.tenantId} title={title} item={item} />;
      }
    });
  };

  function addDepartment(payload: any) {
    dispatch({
      type: 'auth/creactSub',
      payload,
    }).then(() => {
      message.success('创建成功！');
      setAddDepart(false);
      dispatch({
        type: 'auth/fetchDepartment',
      });
    });
  }

  function format(tenantId: string, baseDepartList: any[]) {
    const ivrValue = (baseDepartList && baseDepartList.find(e => e.tenantId === tenantId)) || {};
    return ivrValue && Object.keys(ivrValue).length ? ivrValue.name : null;
  }

  function formatId(id: any, baseDepartList: any[]) {
    const ivrValue = (baseDepartList && baseDepartList.find(e => e.id === id)) || {};
    return ivrValue && Object.keys(ivrValue).length ? ivrValue.tenantId : null;
  }

  const onSelect = (selectedKeys:any) => {
    setSelectedKeys(selectedKeys);
    if(selectedKeys.length) { 
      const filterList = baseUserList.filter((item:any) => item.tenantId === selectedKeys[0]);
      dispatch({
        type: 'auth/save',
        payload: { userList: filterList },
      });
    }
  };

  const renderColumns = (dispatch: Function, baseDepartList: any[]) => {
    const columns = [
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '所属部门',
        key: 'tenantId',
        dataIndex: 'tenantId',
        render: (tenantId: string) => format(tenantId, baseDepartList),
      },
      {
        title: '操作',
        key: 'id',
        dataIndex: 'id',
        width: 150,
        render: (id: number | string, value: any) => {
          return (
            <Fragment>
              <a
                onClick={() => {
                  setVisible(value);
                }}
              >
                编辑
              </a>
            </Fragment>
          );
        },
      },
    ];

    return columns;
  };
  const pagination = {
    pageSize:1000,
  };
  return (
    <PageHeaderWrapper>
      <Card>
        <Row gutter={32} className="knowledge-detail">
          <Col className="pop-up" span={6}>
            <h3>部门管理</h3>
            <a
              href="javascript:;"
              style={{ margin: '8px 0' }}
              onClick={e => {
                e.preventDefault();
                setAddDepart(true);
              }}
            >
              <Icon className="active" type="plus" theme="outlined" />
              <span>添加一级部门</span>
            </a>
            <Tree
              className="knowledge-detail__tree"
              selectedKeys={selectedKeys}
              onSelect={onSelect}
            >
              {loop(treeDepartList)}
            </Tree>
          </Col>
          <Col span={'18'}>
            <div style={{ display: 'flex' }}>
              <a onClick={
                () => {
                  setSelectedKeys([]);
                  setSpin(true);
                  dispatch({
                    type: 'auth/query',
                    payload: { pageSize: 1000, pageNum: 1 },
                  }).then(() => {
                    setSpin(false);
                    message.success('已查看所有用户！');
                  });
              }}><Icon type="redo" style={{fontSize:24}} spin={spin}/></a>
              <Button
                type="primary"
                style={{ marginLeft: 'auto' }}
                onClick={() => setVisible(true)}
              >
                新增用户
              </Button>
            </div>
            <Table
              style={{ marginTop: 15 }}
              size="small"
              dataSource={userList || []}
              columns={renderColumns(dispatch, baseDepartList) || []}
              pagination={pagination}
            />
          </Col>
        </Row>
      </Card>
      <Detail
        value={visible}
        onCancel={() => setVisible(false)}
        onSubmit={(data: any) => {
          if (!!visible && Object.keys(visible).length) {
            const { operatorId } = visible;
            const { organizationId } = data;
            editDepartment({
              tenantId: formatId(organizationId, baseDepartList),
              updateId: operatorId,
            })
              .then(data => {
                message.success('修改成功！');
                setVisible(false);
                dispatch({
                  type: 'auth/query',
                  payload: { pageSize: 1000, pageNum: 1 },
                }).then(() => {
                  setSpin(false);
                  setSelectedKeys([]);
                });
              })
              .catch(e => message.error(e.message));
          } else {
            addUser(data).then(data => {
              message.success('添加用户成功了！');
              setVisible(false);
              dispatch({
                type: 'auth/query',
                payload: { pageSize: 1000, pageNum: 1 },
              }).then(() => {
                setSpin(false);
                setSelectedKeys([]);
              });
            });
          }
        }}
      />
      <Department
        value={addDepart}
        onCancel={() => setAddDepart(false)}
        onSubmit={(data: any) => {
          addDepartment(data);
        }}
      />
      <Company
        value={companyVisible}
        onCancel={() => setCompanyVisible(false)}
        onSubmit={(data: any) => {
          dispatch({
            type: 'auth/creactSub',
            payload: { organizationId: addId, ...data },
          }).then(() => {
            message.success('创建成功！');
            setCompanyVisible(false);
            dispatch({
              type: 'auth/fetchDepartment',
            });
          });
        }}
      />
    </PageHeaderWrapper>
  );
}
export default connect(({ auth }: { auth: any }) => {
  return {
    auth,
  };
})(Index);
