import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu, Row ,Col,Spin } from 'antd';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import ReactEcharts from 'echarts-for-react';
import QueryForm from './QueryForm';
import LineChart from './LineChart';

interface Props {
  dispatch: Function;
  namelist: any;
  loading: boolean;
}

function Index(props: Props) {
  const { dispatch, namelist, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, batchDetail, nameTotal } = namelist;
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
    <Card
      bordered={false}
      title="外呼报表"
    >
      <QueryForm
        value={query}
        onSubmit={(data: any) => {
          onSubmit(data);
        }}
      />
      <LineChart />
      <Card bordered={false} title="流程动态" style={{ marginTop: 20 }}>
          <Row gutter={50}>
            <Col span={12}>
              {/* <Spin spinning={loading0}> */}
                <div style={{ position: 'absolute', right: 0, top: 0, textAlign: 'right' }}>
                  <p> 新增启用流程:{1}个</p>
                  <p> 新增下线:{1}个</p>
                </div>
                {/* <Pie hasLegend subTitle="服务引导流程" data={data0} height={294} /> */}
              {/* </Spin> */}
            </Col>
            <Col span={12}>
              {/* <Spin spinning={loading1}> */}
                {/* <Pie hasLegend subTitle="已启用流程业务分布" data={data1} height={294} /> */}
              {/* </Spin> */}
            </Col>
          </Row>
        </Card>
        <Card bordered={false} title="反馈动态" style={{ marginTop: 20 }}>
          <Row gutter={50}>
            <Col span={12}>
              {/* <Spin spinning={loading2}> */}
                <p style={{ position: 'absolute', right: 0, top: 0 }}>
                  {' '}
                  新增反馈:{2}个
                </p>
                {/* <Pie hasLegend subTitle="反馈处理进度" data={data2} height={294} /> */}
              {/* </Spin> */}
            </Col>
            <Col span={12}>
              {/* <Spin spinning={loading3}> */}
                {/* <Pie hasLegend subTitle="反馈概要" data={data3} height={294} /> */}
              {/* </Spin> */}
            </Col>
          </Row>
        </Card>

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
