import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ConfigIndex from './ConfigIndex';

function Index() {
  return (
    <PageHeaderWrapper>
      <ConfigIndex />
    </PageHeaderWrapper>
  );
}

export default Index;
