import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ListIndex from './ListIndex';
import NotFound from '../../404';

function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper
      // title="名单列表"
      // breadcrumb={{
      //   routes: [
      //     { path: '/AI/outging', breadcrumbName: '外呼管理' },
      //     { path: '/AI/outging', breadcrumbName: '外呼任务' },
      //     { path: '/AI/namelist', breadcrumbName: '外呼名单' },
      //   ],
      //   itemRender: (route, params, routes, paths) => {
      //     return <Link to={route.path}>{route.breadcrumbName}</Link>;
      //   },
      // }}
    >
      <Switch>
        <ListIndex />
        {/* <Route exact path="/users" component={MyComponent} /> */}
        <Route component={NotFound} />
      </Switch>
      {/* <ListIndex /> */}
    </PageHeaderWrapper>
  );
}

export default Index;
