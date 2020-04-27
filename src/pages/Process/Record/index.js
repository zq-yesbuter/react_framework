import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Drawer, Button, message } from 'antd';
import SingleSet from './SingleSet';
import ChatRecord from './ChatRecord';
import Flow from './Flow';
import styles from './index.less';

function Index({ onClose, visible,namelist:{nameList,listValue},dispatch }) {
  const { intent,invitationId} = listValue;
  const index = nameList.findIndex(item => item.invitationId === invitationId )
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
      title={
        <Fragment>
          查看记录
          <Button
            style={{
              marginLeft: 10,
            }}
            disabled={index === 0}
            onClick={e => {
              e.preventDefault();
              if(index === 0){
                message.warn('已经是第一条了，没有上一条了～');
                return;
              }
              const group = nameList[index-1] && nameList[index-1].invitationId;
              if(group) {
                dispatch({
                  type: 'namelist/getMessage',
                  payload: { group, intent },
                });
                dispatch({
                  type: 'namelist/getSigleFlowlist',
                  payload: { id: group, intent },
                });
              }
            }}
          >
            上一条
          </Button>
          <Button
            style={{
              marginLeft: 10,
            }}
            disabled={index === nameList.length-1}
            onClick={()=>{
              if(index === nameList.length){
                message.warn('已经是最后一条了，没有下一条了～');
                return;
              }
              const group = nameList[index+1] && nameList[index+1].invitationId;
              if(group) {
                dispatch({
                  type: 'namelist/getMessage',
                  payload: { group, intent },
                });
                dispatch({
                  type: 'namelist/getSigleFlowlist',
                  payload: { id: group, intent },
                });
              }
            }}
          >
            下一条
          </Button>
        </Fragment>
      }
      width={1200}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ background: '#f7f7f7' }}
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
