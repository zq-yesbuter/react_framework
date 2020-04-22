import React, { Component, Fragment,forwardRef } from 'react';
import { routerRedux, Route, Switch, Redirect, Link } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card, Drawer, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SingleSet from './SingleSet';
import ChatRecord from './ChatRecord';
import Flow from './Flow';
import styles from './index.less';

function Index({ onClose, visible }) {
  return (
    // <PageHeaderWrapper
    //   title={
    //     <Fragment>
    //       沟通记录
    //       <a
    //         href="javascript:;"
    //         style={{
    //           padding: '5px 15px',
    //           fontSize: 14,
    //         }}
    //         onClick={e => {
    //           e.preventDefault();
    //           dispatch(routerRedux.goBack());
    //         }}
    //       >
    //         返回上一级
    //       </a>
    //     </Fragment>
    //   }
      // breadcrumb={{
      //   routes: [
      //     { path: '/AI/outging', breadcrumbName: '外呼任务' },
      //     { path: '/AI/namelist', breadcrumbName: '外呼名单' },
      //     { path: '/AI/record', breadcrumbName: '外呼记录' },
      //   ],
      //   itemRender: (route, params, routes, paths) => {
      //     return <Link to={route.path}>{route.breadcrumbName}</Link>;
      //   },
      // }}
    // >
    // </PageHeaderWrapper>
    <Drawer
      title="查看记录"
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ background:'#f7f7f7' }}
      className={styles.record}
    >
      <Row gutter={12}>
        <Col span={18}>
          <SingleSet />
          <ChatRecord />
        </Col>
        <Col span={6}>
          <Flow />
        </Col>
      </Row>
    </Drawer>
  );
}
export default connect(({ namelist = {} }) => ({ namelist }))(Index);
