import React, { Component } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ListIndex from './Post/ListIndex';

const tabs = [
  {
    key: '/AI/recruit/manPush/post',
    tab: '岗位推荐',
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
