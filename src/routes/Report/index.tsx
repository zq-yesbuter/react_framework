import React, { useState, useEffect, SetStateAction } from 'react';
import { Card, Row, Col, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Pie from '@/components/Pie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import { lineData, data1Obj, data2Obj, data3Obj, data4Obj } from './contant';
import QueryForm from './QueryForm';
import LineChart from './LineChart';
import { formatTaskType, objToArrObj } from '@/utils/utils';

const tabList = [
  {
    tab: '外呼报表',
    key: '/AI/report',
  },
];
const format = 'YYYY-MM-DD HH:mm:ss';
interface Props {
  dispatch: Function;
  report: any;
}
interface List {
  count: any;
  total_time_elapsed_sec: any;
  scene: string;
  remark: any;
}
function Index(props: Props) {
  const { dispatch, report } = props;
  const { ivrIntents } = report;
  const [monthData, setMonthData] = useState([] as any[]);
  const [month, setMonth] = useState(5);
  const [xAxisData, setXAxisData] = useState(['']);
  const [data1, setData1] = useState([] as any[]);
  const [data2, setData2] = useState([] as any[]);
  const [data3, setData3] = useState([] as any[]);
  const [data4, setData4] = useState([] as any[]);

  // 筛选条件
  function onSubmit(values: any) {
    const { time } = values;
    // console.log('tim===>',time,moment(time).startOf('month').format(format),moment(time).endOf('month').format(format));
    const payload = {
      startTime: moment(time).startOf('month').format(format),
      endTime: moment(time).endOf('month').format(format),
    };
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    const axis: number[] = Array.from(new Array(days).keys());
    const ss: string[] = axis.reduce((acc: string[], cur: number) => {
      return acc.concat(`${month}/${cur + 1}`);
    }, []);
    setXAxisData(ss);
    setMonth(month);
    // 查基本数据
    dispatch({
      type: 'report/getReport',
      payload,
    }).then((list) => {
      const newList = list.map((item) => ({
        ...item,
        time:
          item.time.slice(-5)[0] === '0'
            ? item.time.slice(-4).replace('-', '/')
            : item.time.slice(-5).replace('-', '/'),
      }));
      const strucData = [] as any[];
      ss.forEach((x) => {
        if (newList.find((item) => item.time === x)) {
          strucData.push(newList.find((item: { time: string }) => item.time === x).count);
        } else {
          strucData.push(0);
        }
      });
      setMonthData(strucData);
    });

    // 查场景数据
    dispatch({
      type: 'report/getScene',
      payload,
    }).then((list: Array<List>) => {
      const strData1 = list.map(({ count, total_time_elapsed_sec, scene, remark }) => ({
        x: formatTaskType(ivrIntents, 'scene', scene, 'sceneDesc'),
        y: count,
        z: `${total_time_elapsed_sec}s`,
        remark,
      }));
      setData1(strData1);
      if (list && list.length) {
        const remark = objToArrObj(list[0].remark);
        if (remark.length) {
          let remarkList = [] as any[];
          remark.map((item) => {
            Object.keys(item).forEach((i) => {
              remarkList.push({ x: i, ...item[i] });
            });
          });
          remarkList = remarkList.map(({ count, total_time_elapsed_sec, x }) => ({
            x,
            y: count,
            z: `${total_time_elapsed_sec}s`,
          }));
          setData2(remarkList);
        } else {
          setData2([]);
        }
      }
    });

    // 查操作人数据
    dispatch({
      type: 'report/getOperation',
      payload,
    }).then((list) => {
      const strData3 = list.map(({ count, total_time_elapsed_sec, operator }) => ({
        x: operator,
        y: count,
        z: `${total_time_elapsed_sec}s`,
      }));
      setData3(strData3);
      console.log('strData3===>', strData3);
      if (list && list.length) {
        const scene = objToArrObj(list[0].scene);
        if (scene.length) {
          let sceneList = [] as any[];
          scene.map((item) => {
            Object.keys(item).forEach((i) => {
              sceneList.push({
                x: formatTaskType(ivrIntents, 'scene', i, 'sceneDesc'),
                ...item[i],
              });
            });
          });
          sceneList = sceneList.map(({ count, total_time_elapsed_sec, x }) => ({
            x,
            y: count,
            z: `${total_time_elapsed_sec}s`,
          }));
          setData4(sceneList);
        }
      } else {
        setData4([]);
      }
    });

    // if (month === 4) {
    //   setData1(data1Obj['4']);
    //   setData2(data2Obj['4']);
    //   setData3(data3Obj['4']);
    //   setData4(data4Obj['4']['胡沙']);
    //   return;
    // }
    // setMonthData(lineData['5']);
    // setData1(data1Obj['5']);
    // setData2(data2Obj['5']);
    // setData3(data3Obj['5']);
    // setData4(data4Obj['5']['胡沙']);
  }

  useEffect(() => {
    onSubmit({ time: moment() });
  }, []);

  function lengendClick(item: any): void {
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
  function lengendClick2(item: any): void {
    const { x } = item;
    setData4(data4Obj[String(month)][x]);
  }
  return (
    <PageHeaderWrapper
      title="服务报表"
      breadcrumb={{
        routes: [
          { path: '/AI/outgoing/list', breadcrumbName: '招聘外呼' },
          { path: '/AI/record', breadcrumbName: '服务报表' },
        ],
        itemRender: (route, params, routes, paths) => {
          return <Link to={route.path}>{route.breadcrumbName}</Link>;
        },
      }}
      tabList={tabList}
      tabActiveKey={window.location.pathname}
      onTabChange={(active) => {
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

export default connect(({ report = {} }) => ({ report }))(Index);
