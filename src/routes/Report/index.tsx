import React, { useState, useEffect, SetStateAction } from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';
import Pie from '@/components/Pie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import { lineData, data1Obj, data2Obj, data3Obj, data4Obj } from './contant';
import QueryForm from './QueryForm';
import LineChart from './LineChart';

const tabList = [
  {
    tab: '外呼报表',
    key: '/AI/report', 
  },
];

interface Props {
  dispatch: Function;
}
function Index(props: Props) {
  const { dispatch } = props;
  const [monthData, setMonthData] = useState(lineData['5']);
  const [month, setMonth] = useState(5);
  const [xAxisData, setXAxisData] = useState(['']);
  const [data1, setData1] = useState(data1Obj['5']);
  const [data2, setData2] = useState(data2Obj['5']);
  const [data3, setData3] = useState(data3Obj['5']);
  const [data4, setData4] = useState(data4Obj['5']['胡沙']);

  // 筛选条件
  function onSubmit(values: any) {
    const { time } = values;
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    const axis:number[] = Array.from(new Array(days).keys());
    const ss:string[]= axis.reduce((acc:string[], cur: number) => {
      return acc.concat(`${month}/${cur + 1}`);
    },[]);
    setXAxisData(ss);
    setMonth(month);
    if (month === 4) {
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

  function lengendClick(item: any):void {
    const { x, y } = item;
    if (x === '面试调研') {
      setData2(data2Obj[String(month)]);
      return;
    }
    setData2([
      { x: '完成调研', y: y, z: `${y * 60}s` },
      { x: '拒绝调研', y: 0, z: '0s' },
      { x: '中途挂机', y: 0, z: '0s' },
      { x: '无人接听', y: 0, z: '0s' },
    ]);
  }
  function lengendClick2(item: any) :void{
    const { x } = item;
    setData4(data4Obj[String(month)][x]);
  }
  return (
    <PageHeaderWrapper
      title='服务报表'
      breadcrumb={{
      routes: [
        { path: '/AI/outging', breadcrumbName: '招聘外呼' },
        { path: '/AI/record', breadcrumbName: '服务报表' },
      ],
      itemRender: (route, params, routes, paths) => {
        return <Link to={route.path}>{route.breadcrumbName}</Link>;
      },
    }}
      tabList={tabList}
      tabActiveKey={window.location.pathname}
      onTabChange={active => {
        dispatch(routerRedux.push(active));
      }}
    >
      <Card bordered={false} title="外呼报表">
        <QueryForm
          onSubmit={(data: any) => {
            onSubmit(data);
          }}
        />
        <LineChart xAxisData={xAxisData} monthData={monthData} />
        <Row gutter={50} style={{ marginBottom: 100, marginTop: 100 }}>
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="外呼类型分布"
              data={data1}
              height={254}
              lengendClick={lengendClick}
            />
          </Col>
          <Col span={12}>
            <Pie hasLegend subTitle="外呼结果分布" data={data2} height={254} />
          </Col>
        </Row>
        <Row gutter={50}>
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="使用人使用量分布"
              data={data3}
              height={254}
              lengendClick={lengendClick2}
            />
          </Col>
          <Col span={12}>
            <Pie hasLegend subTitle="外呼类型分布" data={data4} height={254} />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Index;
