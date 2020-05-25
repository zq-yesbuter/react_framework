import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu, Row, Col, Spin } from 'antd';
import Pie from '@/components/Pie';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import QueryForm from './QueryForm';
import LineChart from './LineChart';

interface Props {
  dispatch: Function;
  namelist: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, namelist, loading } = props;
  const { nameRequest, batchDetail } = namelist;
  const { status, name } = batchDetail;
  const { search } = window.location;
  const { id, intent, dataStatus } = queryString.parse(search);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'picture/init',
      });
    };
  }, []);

  const query = {}; //  queryString.parse(location.search)

  // 筛选条件
  function onSubmit(values: any) {
    const payload = dataStatus
      ? { dataStatus: 2, id, intent, ...values }
      : { id, intent, ...values };
    dispatch({
      type: 'namelist/fetchBatchDetail',
      payload,
    });
    dispatch({
      type: 'namelist/save',
      payload: dataStatus
        ? { nameRequest: { ...nameRequest, dataStatus: 2, ...values } }
        : { nameRequest: { ...nameRequest, ...values } },
    });
  }

  return (
    <Card bordered={false} title="外呼报表">
      <QueryForm
        value={query}
        onSubmit={(data: any) => {
          onSubmit(data);
        }}
      />
      <LineChart />
      <Row gutter={50} style={{marginBottom:100,marginTop:100}}>
        <Col span={11}>
          {/* <Spin spinning={loading0}> */}
          <div style={{ position: 'absolute', right: 0, top: 0, textAlign: 'right' }}>
            <p> 新增启用流程:{1}个</p>
            <p> 新增下线:{1}个</p>
          </div>
          <Pie
            hasLegend
            subTitle="外呼类型分布"
            data={[
              { x: '启用', y: 47 },
              { x: '未启用', y: 69 },
            ]}
            height={294}
          />
          {/* </Spin> */}
        </Col>
        <Col span={11}>
          {/* <Spin spinning={loading1}> */}
          <Pie
            hasLegend
            subTitle="外呼结果分布"
            data={[
              { x: '理财', y: 8 },
              { x: '钱包+生活应用', y: 3 },
              { x: '一级目录ZY', y: 2 },
              { x: '售后咨询', y: 3 },
              { x: '联系人工', y: 4 },
              { x: '保险', y: 12 },
              { x: '众筹', y: 3 },
              { x: '客服管理', y: 1 },
              { x: '服务引导目录Auto', y: 13 },
              { x: '白条', y: 9 },
              { x: '产品咨询', y: 1 },
              { x: '农村金融', y: 1 },
            ]}
            height={294}
          />
          {/* </Spin> */}
        </Col>
        <Col span={2}></Col>
      </Row>
      <Row gutter={50}>
        <Col span={11}>
          {/* <Spin spinning={loading2}> */}
          <p style={{ position: 'absolute', right: 0, top: 0 }}>新增反馈:{2}个</p>
          <Pie
            hasLegend
            subTitle="使用人使用量分布"
            data={[
              { x: '处理完成', y: 34 },
              { x: '待处理', y: 215 },
              { x: '处理中', y: 17 },
            ]}
            height={294}
          />
          {/* </Spin> */}
        </Col>
        <Col span={11}>
          {/* <Spin spinning={loading3}> */}
          <Pie
            hasLegend
            subTitle="外呼类型分布"
            data={[
              { x: '知识更新', y: 108 },
              { x: '操作繁琐', y: 50 },
              { x: '补充流程', y: 52 },
              { x: '流程错误', y: 32 },
              { x: '展示不清晰', y: 26 },
            ]}
            height={294}
          />
          {/* </Spin> */}
        </Col>
        <Col span={2}></Col>
      </Row>
    </Card>
  );
}

export default connect(
  ({
    namelist,
    loading: {
      effects: { 'namelist/fetchBatchDetail': loading },
    },
  }) => {
    return {
      namelist,
      loading,
    };
  }
)(Index);
