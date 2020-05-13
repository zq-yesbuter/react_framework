import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ListIndex from './MainBanner';

const tabs = [
  {
    key: '/AI/recruit/maintain/mainBanner',
    tab: '社招首页banner',
  },
  {
    key: '/AI/recruit/manPush/man',
    tab: '简历推荐',
  },
];
function Index({ match, routerData, location, dispatch }) {
  return (
    <PageHeaderWrapper
      tabList={tabs}
      tabActiveKey={location.pathname}
      onTabChange={active => {
        dispatch(routerRedux.push(active));
      }}
    >
      <ListIndex />
    </PageHeaderWrapper>
  );
}

const mapStateToProps = ({ recruit = {} }) => ({ recruit });
export default connect(mapStateToProps)(Index);