import React, { Fragment } from 'react';
import { Card } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import EditorFlow from './EditorFlow';

function Index({dispatch}:{dispatch: Function}){
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          全局配置
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
      <EditorFlow/> 
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
    scene:any
  }) => {
    return {
      scene,
      // loading,
    };
  }
)(Index);
