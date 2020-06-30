import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu } from 'antd';
import queryString from 'query-string';
import QueryForm from '@/components/QueryForm';
import renderTable from '@/components/SelectTable';
import { Setting } from '@/utils/tscontant';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import renderColumns from './Colums';

interface Props {
  dispatch: Function;
  intent: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, intent, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, nameTotal } = intent;
  const { search } = window.location;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showVisible, setShowVisible] = useState(false);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'picture/init',
      });
    };
  }, []);
  const query = [{type:'input',label:'搜索', key:'name', placeholder:'请输入'},
  {type:'select',label:'状态筛选',key:'status',placeholder:'请选择状态',optionValue:[]}];
  const importMenu = (
    <Menu>
      <Menu.Item key={2}>批量导出沟通汇总信息</Menu.Item>
    </Menu>
  );
  const setting:Setting = {
    current: nameCur,
    columns: renderColumns(dispatch, intent, setShowVisible),
    pageSize: namePageSize,
    loading,
    selectedRowKeys,
    showNext: nameList && nameList.length < namePageSize,
    data: nameList || [],
    total: nameTotal,
    onChange: (pageNum: number, pageSize: number) => {
      dispatch({
        type: 'intent/fetchBatchDetail',
        payload: { pageNum, pageSize, intent },
      });
      dispatch({
        type: 'intent/save',
        payload: { nameRequest: { ...nameRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: (pageSize: number) => {
      dispatch({
        type: 'intent/fetchBatchDetail',
        payload: { pageSize, intent },
      });
      dispatch({
        type: 'intent/save',
        payload: { nameRequest: { ...nameRequest, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    rowKey: 'invitationId',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys:any) => {
        setSelectedRowKeys(selectedRowKeys);
      },
    },
    importMenu,
    hasImport: true,
    hideSelect: true,
  };

  // 筛选条件
  function onSubmit(values: any) {
    const payload = { intent, ...values };
    dispatch({
      type: 'intent/fetchBatchDetail',
      payload,
    });
    dispatch({
      type: 'intent/save',
      payload: { nameRequest: { ...nameRequest, ...values } },
    });
  }

  return (
    <PageHeaderWrapper
      title="场景配置"
      breadcrumb={{
        routes: [
          { path: '/AI/scene/list', breadcrumbName: '场景配置' },
          { path: '/AI/scene/list', breadcrumbName: '场景列表' },
        ],
        itemRender: (route, params, routes, paths) => {
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
    >
      <Card
        bordered={false}
        title="意图配置"
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              dispatch(
                routerRedux.push({pathname:'/AI/intention/config'})
              )
            }}
          >
            新增意图
          </Button>
        }
      >
        <QueryForm
          value={query}
          onSubmit={(data: any) => {
            onSubmit(data);
          }}
        />
        {renderTable(setting)}
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(
  ({
    intent,
    loading: {
      effects: { 'intent/fetchBatchDetail': loading },
    },
  }) => {
    return {
      intent,
      loading,
    };
  }
)(Index);
