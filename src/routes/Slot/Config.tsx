import React from 'react';
import CommonConfig from '@/components/CommonConfig';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';

function Config(props) {
  const query = [
    { type: 'div', label: '词槽ID', key: 'name1', placeholder: '请输入' },
    { type: 'input', label: '词槽名称', key: 'name', placeholder: '请输入' },
    {
      type: 'select',
      label: '启用状态',
      key: 'status',
      placeholder: '请选择状态',
      optionValue: [],
    },
  ];

  function onSubmit(data) {}

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
      <CommonConfig
        value={query}
        onSubmit={(data: any) => {
          onSubmit(data);
        }}
        title="词槽设置"
      />
    </PageHeaderWrapper>
  );
}

export default Config;
