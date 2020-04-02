import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ConfigIndex from './ConfigIndex';
import NotFound from '../../404';

function Index() {
  return (
    <PageHeaderWrapper
      // title="外呼管理 - 外呼任务配置"
      // breadcrumb={{
      //   routes: [
      //     { path: '/AI/outging', breadcrumbName: '外呼管理' },
      //     { path: '/AI/outging', breadcrumbName: '外呼任务' },
      //     { path: '/AI/config', breadcrumbName: '任务配置' },
      //   ],
      //   itemRender: (route, params, routes, paths) => {
      //     return <Link to={route.path}>{route.breadcrumbName}</Link>;
      //   },
      // }}
    >
      {/* <Switch> */}
      <ConfigIndex />
      {/* <Route render={NotFound} />
      </Switch> */}
    </PageHeaderWrapper>
  );
}

export default Index;
