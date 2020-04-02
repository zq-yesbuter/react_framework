import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ListIndex from './ListIndex';

function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper>
      <ListIndex />
    </PageHeaderWrapper>
  );
}

export default Index;
