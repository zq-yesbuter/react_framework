import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PictureIndex from './PictureIndex';

function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper>
      <PictureIndex />
    </PageHeaderWrapper>
  );
}

export default Index;
