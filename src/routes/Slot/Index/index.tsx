import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu } from 'antd';
import queryString from 'query-string';
import QueryForm from '@/components/QueryForm';
import renderTable from '@/components/SelectTable';
import { Setting } from '@/utils/tscontant';
import renderColumns from './Colums';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';

interface Props {
  dispatch: Function;
  slot: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, slot, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, batchDetail, nameTotal } = slot;
  const { search } = window.location;
  const { id, intent, dataStatus } = queryString.parse(search);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showVisible, setShowVisible] = useState(false);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'picture/init',
      });
    };
  }, []);

  const query = [
    { type: 'input', label: '搜索', key: 'name', placeholder: '请输入' },
    {
      type: 'select',
      label: '状态筛选',
      key: 'status',
      placeholder: '请选择状态',
      optionValue: [],
    },
  ];

  const importMenu = (
    <Menu>
      <Menu.Item key={2}>批量导出沟通汇总信息</Menu.Item>
    </Menu>
  );

  const setting: Setting = {
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
        type: 'slot/fetchBatchDetail',
        payload: { pageNum, pageSize, id, intent },
      });
      dispatch({
        type: 'slot/save',
        payload: { nameRequest: { ...nameRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: (pageSize: number) => {
      dispatch({
        type: 'slot/fetchBatchDetail',
        payload: { pageSize, id, intent },
      });
      dispatch({
        type: 'slot/save',
        payload: { nameRequest: { ...nameRequest, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    rowKey: 'invitationId',
    rowSelection: {
      selectedRowKeys,
      onChange: (selectedRowKeys: any) => {
        setSelectedRowKeys(selectedRowKeys);
      },
    },
    importMenu,
    hasImport: true,
    hideSelect: true,
  };

  // 筛选条件
  function onSubmit(values: any) {
    const payload = dataStatus
      ? { dataStatus: 2, id, intent, ...values }
      : { id, intent, ...values };
    dispatch({
      type: 'slot/fetchBatchDetail',
      payload,
    });
    dispatch({
      type: 'slot/save',
      payload: dataStatus
        ? { nameRequest: { ...nameRequest, dataStatus: 2, ...values } }
        : { nameRequest: { ...nameRequest, ...values } },
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
        title="词槽配置"
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              dispatch(routerRedux.push({ pathname: '/AI/slot/config' }));
            }}
          >
            新增词槽
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
    slot,
    loading: {
      effects: { 'slot/fetchBatchDetail': loading },
    },
  }) => {
    return {
      slot,
      loading,
    };
  }
)(Index);
