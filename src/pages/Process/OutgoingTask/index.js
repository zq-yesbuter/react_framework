import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ListIndex from './ListIndex';

function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper title="外呼管理 - 外呼任务">
      <ListIndex />
    </PageHeaderWrapper>
  );
}

export default Index;
