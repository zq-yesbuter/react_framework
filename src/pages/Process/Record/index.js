import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SingleSet from './SingleSet';
import ChatRecord from './ChatRecord';

function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper>
      <SingleSet />
      <ChatRecord />
    </PageHeaderWrapper>
  );
}

export default Index;
