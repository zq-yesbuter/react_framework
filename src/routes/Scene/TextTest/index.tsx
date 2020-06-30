import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';

function Index({dispatch}:{dispatch: Function}){
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          文本测试
          <a
            href="javascript:;"
            style={{
              padding: '5px 15px',
              fontSize: 14,
            }}
            onClick={e => {
              e.preventDefault();
              dispatch(routerRedux.goBack());
            }}
          >
            返回上一级
          </a>
        </Fragment>
      }
    >
        看着自己有点像傻子·····
    </Card>
  );
}

export default connect(
  ({
    scene,
    // loading: {
    //   effects: { 'namelist/fetchBatchDetail': loading },
    // },
  }:{
    scene:any;
  }) => {
    return {
      scene,
      // loading,
    };
  }
)(Index);
