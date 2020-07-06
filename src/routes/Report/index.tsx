import React, { useState, useEffect, SetStateAction } from 'react';
import { Card, Row, Col, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Pie from '@/components/Pie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import { lineData, data1Obj, data2Obj, data3Obj, data4Obj, mock } from './contant';
import QueryForm from './QueryForm';
import LineChart from './LineChart';
import { formatTaskType, objToArrObj, formatTree } from '@/utils/utils';

const tabList = [
  {
    tab: '外呼报表',
    key: '/AI/report',
  },
];
const format = 'YYYY-MM-DD HH:mm:ss';
const noData = [{
  x: '暂无数据',
  y: 1,
  z: '0s'
}];
interface Props {
  dispatch: Function;
  report: any;
}
interface List {
  count: any;
  total_time_elapsed_sec: any;
  scene: string;
  remark?: any;
  operator?: any;
}
interface PieData {
  x: string;
  y: number;
  z: string;
  remark? : any;
  scene?: any;
}
interface QueryData {
  startTime: string;
  endTime: string;
  tenantId?: string | number;
}

function formatRemark(remark:any) {
  let remarkList = [] as any[];
  remark.map((item) => {
    Object.keys(item).forEach((i) => {
      remarkList.push({ x: i, ...item[i] });
    });
  });
  return remarkList.map(({ count, total_time_elapsed_sec, x }) => ({
    x,
    y: count,
    z: `${total_time_elapsed_sec}s`,
  }));
}

function formatScene(ivrIntents:any,scene:any) {
  let sceneList = [] as any[];
  scene.map((item) => {
    Object.keys(item).forEach((i) => {
      sceneList.push({
        x: formatTaskType(ivrIntents, 'scene', i, 'sceneDesc'),
        ...item[i],
      });
    });
  });
  return sceneList.map(({ count, total_time_elapsed_sec, x }) => ({
    x,
    y: count,
    z: `${total_time_elapsed_sec}s`,
  }));
}

const fn = (source,res=[] as any[])=>{
  source.forEach(el=>{
    res.push(el);
    el.children && el.children.length>0 ? fn(el.children,res) : ""
  });
  return res;
}
function Index(props: Props) {
  const { dispatch, report } = props;
  const { ivrIntents, baseDepartList } = report;
  const [monthData, setMonthData] = useState([] as any[]);
  const [month, setMonth] = useState(5);
  const [xAxisData, setXAxisData] = useState(['']);
  const [data1, setData1] = useState(noData as Array<PieData>);
  const [data2, setData2] = useState(noData as Array<PieData>);
  const [data3, setData3] = useState(noData as Array<PieData>);
  const [data4, setData4] = useState(noData as Array<PieData>);
  const [legend, setLegend] = useState([] as any[]);

  // 筛选条件
  function onSubmit(values: any) {
    const { time, tenantId } = values;
    // console.log('tim===>',time,moment(time).startOf('month').format(format),moment(time).endOf('month').format(format));
    let payload:QueryData = {
      startTime: moment(time).startOf('month').format(format),
      endTime: moment(time).endOf('month').format(format),
    };
    payload = tenantId ? {...payload, tenantId } : payload;
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    const axis: number[] = Array.from(new Array(days).keys());
    const ss: string[] = axis.reduce((acc: string[], cur: number) => {
      return acc.concat(`${month}/${cur + 1}`);
    }, []);
    setXAxisData(ss);
    setMonth(month);
    dispatch({
      type: 'report/getDepartment',
      payload: { pageSize: 1000, pageNum: 1 },
    }).then((baseDepartList) => {
      dispatch({
        type: 'report/save',
        payload: {treeDepartList: [formatTree(baseDepartList)]},
      })
      // 查基本数据
      dispatch({
        type: 'report/getReport',
        payload,
      }).then((list) => {
        if(!list && !list.length){
          setLegend([]);
          setMonthData([]);
          return;
        }
        const newList = list.map((item) => ({
          ...item,
          time:
            item.time.slice(-5)[0] === '0'
              ? item.time.slice(-4).replace('-', '/')
              : item.time.slice(-5).replace('-', '/'),
        }));
        let parentList = [] as any[];
        newList.forEach(item => {
          if(baseDepartList.find((val:{tenantId: string}) => item.tenantId === val.tenantId)){
            const checkObj = baseDepartList.find(val => item.tenantId === val.tenantId);
            const parentId = checkObj.parentId;
            const name = checkObj.name;
            const id = checkObj.id;
            parentList.push({...item, parentId,name,id})
          }
        });
        if(newList.every(item => item.tenantId === newList[0].tenantId)) {
          let monthData = [] as any[];
          ss.forEach((x) => {
            if (newList.find((item) => item.time === x)) {
              monthData.push(newList.find((item: { time: string }) => item.time === x).count);
            } else {
              monthData.push(0);
            }
          });
          const series = [{
            name: parentList[0] && parentList[0].name,
            type: 'bar',
            barWidth: 15,
            stack: 'aa',
            label: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'inside',
              formatter: function (p) {
                return p.value > 0 ? p.value : '';
              },
            },
            yAxisIndex: 0,
            data: monthData,
          }];
          const newLegend = [parentList[0] && parentList[0].name];
          setLegend(newLegend);
          setMonthData(series);
          return;
        }
        // 有多个树状结构时
        const root = formatTree(parentList) || {};
        if(Object.keys(root).length && root.children){
          const data = root.children;
          const strucData = data.map(item => fn([item]));
          let monthData = [] as any[];
          strucData.map((val,index) => {
            monthData[index] = {name:val[0].name,value:[]};
            ss.forEach((x) => {
              if (val.find((item) => item.time === x)) {
                monthData[index].value.push(val.find((item: { time: string }) => item.time === x).count);
              } else {
                monthData[index].value.push(0);
              }
            });
          })
        }
          const series = monthData.map(item => ({
            name: item.name,
            type: 'bar',
            barWidth: 15,
            stack: 'aa',
            label: {
              show: true,
              textStyle: {
                color: '#fff',
              },
              position: 'inside',
              formatter: function (p) {
                return p.value > 0 ? p.value : '';
              },
            },
            yAxisIndex: 0,
            data: item.value,
          }));
          const newLegend = monthData.map(item => item.name);
          setLegend(newLegend);
          setMonthData(series);
     
        
      });
    })
   

    // 查场景数据
    dispatch({
      type: 'report/getScene',
      payload,
    }).then((list: Array<List>) => {
      if (list && list.length) {
        // 第一行左侧
        const strData1 = list.map(({ count, total_time_elapsed_sec, scene, remark }) => ({
          x: formatTaskType(ivrIntents, 'scene', scene, 'sceneDesc'),
          y: count,
          z: `${total_time_elapsed_sec}s`,
          remark,
        }));
        setData1(strData1);
        // 第一行右侧
        const remark = objToArrObj(list[0].remark);
        if (remark  && remark.length) {
          const datalist = formatRemark(remark);
          setData2(datalist);
        }
      }
    });

    // 查操作人数据
    dispatch({
      type: 'report/getOperation',
      payload,
    }).then((list: Array<List>) => {
      if (list && list.length) {
        // 第二行左侧
        const strData3 = list.map(({ count, total_time_elapsed_sec, operator, scene }) => ({
          x: operator,
          y: count,
          z: `${total_time_elapsed_sec}s`,
          scene,
        }));
        setData3(strData3);
        // 第二行右侧
        const scene = objToArrObj(list[0].scene);
        if (scene && scene.length) {
          const datalist = formatScene(ivrIntents,scene);
          setData4(datalist);
        }
      }
    });
  }

  useEffect(() => {
    onSubmit({ time: moment() });
  }, []);

  function lengendClick(item: any): void {
    const { x, y } = item;
    const list = data1.filter(item => item.x === x) || [{}];
    const remark = objToArrObj(list[0].remark);
    if (remark  && remark.length) {
      const list = formatRemark(remark);
      setData2(list);
      return;
    }
    setData2(noData);
  }

  function lengendClick2(item: any): void {
    const { x } = item;
    const list = data3.filter(item => item.x === x) || [{}];
    const scene = objToArrObj(list[0].scene);
    if (scene  && scene.length) {
      const list = formatScene(ivrIntents,scene);
      setData2(list);
      return;
    }
    setData2(noData);
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
        <LineChart xAxisData={xAxisData} monthData={monthData} legend={legend}/>
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

export default connect(({ report = {}, user }) => ({ report, user }))(Index);
