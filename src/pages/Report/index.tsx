import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu, Row, Col, Spin } from 'antd';
import moment from 'moment';
import Pie from '@/components/Pie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import QueryForm from './QueryForm';
import LineChart from './LineChart';
 
import { stringify } from 'qs';
const tabList = [
  {
    tab: '外呼报表',
    key: '/AI/report',
  },
];

interface Props {
  dispatch: Function;
  namelist: any;
  loading: boolean;
}

const lineData={
  '4':[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,324,0,0,0,0,30,0,0,0,334],
  '5':[0,0,0,0,0,0,0,108,0,0,10,251,104,106,14,0,0,98,71,61,0,132,20,30,61,0,205,193,13,0,44]
}
const data1Obj={
  '4':[ 
    { x: '面试调研', y: 651, z:'78120s' },
    { x: '面试邀约', y: 0, z:'0s'},
    { x: '面试提醒', y: 0, z:'0s'},
    { x: '背调提醒', y: 0, z:'0s'},
    { x: '入职提醒', y: 51, z:'3060s' },
  ],
  '5':[
      { x: '面试调研', y: 1225, z:'147000s' },
      { x: '面试邀约', y: 44 , z:'2640s'},
      { x: '面试提醒', y: 107 , z:'6420s'},
      { x: '背调提醒', y: 50 , z:'3000s'},
      { x: '入职提醒', y: 95 , z:'5700s'},
    ],
};
const data2Obj={
  '4':[
    { x: '完成调研', y: 261,z:'57620s' },
    { x: '拒绝调研', y: 200,z:'10000s' },
    { x: '中途挂机', y: 130,z:'9600s' },
    { x: '无人接听',y: 60,z:'900s' },
  ],
  '5':[
    { x: '完成调研', y: 562,z:'127910s' },
    { x: '拒绝调研', y: 323,z:'17650s' },
    { x: '中途挂机', y: 154,z:'980s'},
    { x: '无人接听',y: 156,z:'460s' },
  ]
};
const data3Obj = {
  '4':[
    { x: '胡沙', y: 702,z:'42120s' },
    { x: '高成月', y: 30,z:'1800s' },
    { x: '崔雯靖', y: 0,z:'0s'},
  ],
  '5':[
    { x: '胡沙', y: 151,z:'9060s' },
    { x: '高成月', y: 1133,z:'135960s' },
    { x: '崔雯靖', y: 99,z:'5940s' },
  ],
};
const data4Obj = {
  '4':{
    '胡沙': [
      { x: '面试调研', y: 651,z:'18120s' },
    { x: '面试邀约', y: 0,z:'0s' },
    { x: '面试提醒', y: 0,z:'0s' },
    { x: '背调提醒', y: 0,z:'0s' },
    { x: '入职提醒', y: 51,z:'3060s' },],
    '高成月':[
      { x: '面试调研', y: 0,z:'0s' },
      { x: '面试邀约', y: 0,z:'0s' },
      { x: '面试提醒', y: 30,z:'1800s' },
      { x: '背调提醒', y: 0,z:'0s' },
      { x: '入职提醒', y: 0,z:'0s' },],
    '崔雯靖':[
      { x: '面试调研', y: 0,z:'0s' },
    { x: '面试邀约', y: 0,z:'0s' },
    { x: '面试提醒', y: 0,z:'0s' },
    { x: '背调提醒', y: 0,z:'0s' },
    { x: '入职提醒', y: 0,z:'0s' },],
  },
  '5':{
    '胡沙': [
      { x: '面试调研', y: 0,z:'0s' },
    { x: '面试邀约', y: 44,z:'2640s' },
    { x: '面试提醒', y: 107,z:'6420s' },
    { x: '背调提醒', y: 0,z:'0s' },
    { x: '入职提醒', y: 0,z:'0s' },],
    '高成月':[
      { x: '面试调研', y: 1133,z:'135960s' },
      { x: '面试邀约', y: 0,z:'0s' },
      { x: '面试提醒', y: 0,z:'0s' },
      { x: '背调提醒', y: 0,z:'0s' },
      { x: '入职提醒', y: 0,z:'0s' },],
    '崔雯靖':[
      { x: '面试调研', y: 0,z:'0s' },
      { x: '面试邀约', y: 0,z:'0s' },
      { x: '面试提醒', y: 0,z:'0s' },
      { x: '背调提醒', y: 20,z:'1200s' },
      { x: '入职提醒', y: 79,z:'47400s' },],
  },
};
function Index(props: Props) {
  const { dispatch, namelist, loading } = props;
  const { nameRequest, batchDetail } = namelist;
  const { status, name } = batchDetail;
  const { search } = window.location;
  const [monthData,setMonthData] = useState(lineData['5'])
  const [month, setMonth] = useState(5);
  const [xAxisData, setXAxisData] = useState([]);
  const [data1, setData1] = useState(data1Obj['5']);
  const [data2, setData2] = useState(data2Obj['5']);
  const [data3, setData3] = useState(data3Obj['5']);
  const [data4, setData4] = useState(data4Obj['5']['胡沙']);
  const { id, intent, dataStatus } = queryString.parse(search);

  // 筛选条件
  function onSubmit(values: any) {
    const { time } = values;
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    let axis = Array.from(new Array(days).keys());
    const ss = axis.reduce((acc, cur: number) => {
      return acc.concat(`${month}/${cur + 1}`);
    }, []);
    setXAxisData(ss);
    setMonth(month)
    if(month===4){
      setMonthData(lineData['4']);
      setData1(data1Obj['4']);
      setData2(data2Obj['4']);
      setData3(data3Obj['4']);
      setData4(data4Obj['4']['胡沙']);
      return;
    }
    setMonthData(lineData['5']);
    setData1(data1Obj['5']);
    setData2(data2Obj['5']);
    setData3(data3Obj['5']);
    setData4(data4Obj['5']['胡沙']);
  }

  useEffect(() => {
    onSubmit({ time: moment().set('month', 4) });
  }, []);

  const query = {}; //  queryString.parse(location.search)

  function lengendClick(item:any,i:number) {
    const {x,y} = item;
    if(x==='面试调研'){
      setData2(data2Obj[String(month)]);
      return;
    }
    setData2( 
      [{ x: '完成调研', y: y,z:`${y*60}s`  },
      { x: '拒绝调研', y: 0,z:'0s'  },
      { x: '中途挂机', y: 0,z:'0s'  },
      { x: '无人接听',y: 0,z:'0s'  }]);
  }
  function lengendClick2(item:any,i:numebr) {
    const {x,y} = item;
    setData4(data4Obj[String(month)][x]);
  }
  return (
    <PageHeaderWrapper
      tabList={tabList}
      tabActiveKey={window.location.pathname}
      onTabChange={active => {
        dispatch(routerRedux.push(active));
      }}
    >
      <Card bordered={false} title="外呼报表">
        <QueryForm
          value={query}
          onSubmit={(data: any) => {
            onSubmit(data);
          }}
        />
        <LineChart xAxisData={xAxisData} monthData={monthData}/>
        <Row gutter={50} style={{ marginBottom: 100, marginTop: 100 }}>
          <Col span={12}>
            {/* <Spin spinning={loading0}> */}
            <Pie
              hasLegend
              subTitle="外呼类型分布"
              data={data1}
              height={254}
              lengendClick={lengendClick}
            />
            {/* </Spin> */}
          </Col>
          <Col span={12}>
            {/* <Spin spinning={loading1}> */}
            <Pie hasLegend subTitle="外呼结果分布" data={data2} height={254} />
            {/* </Spin> */}
          </Col>
          {/* <Col span={2}></Col> */}
        </Row>
        <Row gutter={50}>
          <Col span={12}>
            {/* <Spin spinning={loading2}> */}
            <Pie
              hasLegend
              subTitle="使用人使用量分布"
              data={data3}
              height={254}
              lengendClick={lengendClick2}
            />
            {/* </Spin> */}
          </Col>
          <Col span={12}>
            {/* <Spin spinning={loading3}> */}
            <Pie hasLegend subTitle="外呼类型分布" data={data4} height={254} />
            {/* </Spin> */}
          </Col>
          {/* <Col span={2}></Col> */}
        </Row>
      </Card>
    </PageHeaderWrapper>
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
