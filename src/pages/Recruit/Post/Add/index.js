import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ConfigIndex from './Add';

function Index() {
  return (
    <PageHeaderWrapper>
      <ConfigIndex />
    </PageHeaderWrapper>
  );
}

export default Index;
