import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu } from 'antd';
import queryString from 'query-string';
import QueryForm from '@/components/QueryForm';
import renderTable from '@/components/SelectTable';
import renderColumns from './Colums';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';

interface Props {
  dispatch: Function;
  rule: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, rule, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, batchDetail, nameTotal } = rule;
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

  const query = [{type:'input',label:'搜索', key:'name', placeholder:'请输入'},
  {type:'select',label:'状态筛选',key:'status',placeholder:'请选择状态',optionValue:[]}];
  const importMenu = (
    <Menu>
      <Menu.Item key={2}>批量导出沟通汇总信息</Menu.Item>
    </Menu>
  );

  const setting = {
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
        type: 'rule/fetchBatchDetail',
        payload: { pageNum, pageSize, id, intent },
      });
      dispatch({
        type: 'rule/save',
        payload: { nameRequest: { ...nameRequest, pageNum, pageSize } },
      });
      setSelectedRowKeys([]);
    },
    onSizeChange: (pageSize: number) => {
      dispatch({
        type: 'rule/fetchBatchDetail',
        payload: { pageSize, id, intent },
      });
      dispatch({
        type: 'rule/save',
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
      type: 'rule/fetchBatchDetail',
      payload,
    });
    dispatch({
      type: 'rule/save',
      payload: dataStatus
        ? { nameRequest: { ...nameRequest, dataStatus: 2, ...values } }
        : { nameRequest: { ...nameRequest, ...values } },
    });
  }

  return (
    <PageHeaderWrapper
      title="规则配置"
      breadcrumb={{
        routes: [
          { path: '/AI/rule/list', breadcrumbName: '规则配置' },
          { path: '/AI/rule/list', breadcrumbName: '场景列表' },
        ],
        itemRender: (route, params, routes, paths) => {
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
    >
      <Card
        bordered={false}
        title="规则配置"
        extra={
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              dispatch(
                routerRedux.push({pathname:'/AI/rule/config'})
              )
            }}
          >
            新增规则
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
    rule,
    loading: {
      effects: { 'rule/fetchBatchDetail': loading },
    },
  }) => {
    return {
      rule,
      loading,
    };
  }
)(Index);
