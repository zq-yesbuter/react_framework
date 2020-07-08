import React, { useState, useEffect, SetStateAction } from 'react';
import { Card, Row, Col, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Pie from '@/components/Pie';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux, Link } from 'dva/router';
import _ from 'lodash';
import {
  lineData,
  data1Obj,
  data2Obj,
  data3Obj,
  data4Obj,
  mock,
  mock1,
  mock2,
  data1111,
  orgz,
  singelData,
  data66,
  data33,
} from './contant';
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
const noData = [
  {
    x: '暂无数据',
    y: 1,
    z: '0s',
  },
];
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
  remark?: any;
  scene?: any;
}
interface QueryData {
  startTime: string;
  endTime: string;
  tenantId?: string | number;
}

function formatRemark(remark: any) {
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

function formatScene(ivrIntents: any, scene: any) {
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

// 扁平化数组
const fn = (source, res = [] as any[]) => {
  source.forEach((el) => {
    res.push(el);
    el.children && el.children.length > 0 ? fn(el.children, res) : '';
  });
  return res;
};

// 对断层数据的处理
function formatNotTree(list = [] as any[],source) {
  // const cloneList = _.cloneDeep(list);
  const recursion = (source) => {
    if(!source){
      return;
    }
    return source.map((el) => {
      const checkArray = list.filter((val) => el.tenantId === val.tenantId);
      return checkArray.length ? ({...el,children:recursion(el.children),data:checkArray }) : ({...el,children:recursion(el.children)})
    })
  }
  return recursion([formatTree(source)]);
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
    let payload: QueryData = {
      startTime: moment(time).startOf('month').format(format),
      endTime: moment(time).endOf('month').format(format),
    };
    payload = tenantId ? { ...payload, tenantId } : payload;
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    const axis: number[] = Array.from(new Array(days).keys());
    const ss: string[] = axis.reduce((acc: string[], cur: number) => {
      return acc.concat(`${month}/${cur > 8 ? cur + 1 : `0${cur+1}`}`);
    }, []);
    setXAxisData(ss);
    setMonth(month);
    dispatch({
      type: 'report/getDepartment',
      payload: { pageSize: 1000, pageNum: 1 },
    })
      .then((baseDepartList) => {
        dispatch({
          type: 'report/save',
          payload: { treeDepartList: [formatTree(baseDepartList)] },
        });
        // 查基本数据
        dispatch({
          type: 'report/getReport',
          payload,
        })
          .then((list) => {
            // const list = data1111;
            if (!list && !list.length) {
              setMonthData([{ name: '', value: [] }]);
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
            newList.forEach((item) => {
              // const checkObj = orgz.find((val:{tenantId: string}) => item.tenantId === val.tenantId);
              const checkObj = baseDepartList.find(
                (val: { tenantId: string }) => item.tenantId === val.tenantId
              );
              if (checkObj) {
                const parentId = checkObj.parentId;
                const name = checkObj.name;
                const id = checkObj.id;
                parentList.push({ ...item, parentId, name, id });
              }
            });
            console.log('构造parentId数据=>', parentList,'newList=>',newList,newList.every((item) => item.tenantId === newList[0].tenantId));
            if (newList.every((item) => item.tenantId === newList[0].tenantId)) {
              let baseData = [] as any[];
              ss.forEach((x) => {
                const filterArr = newList.filter((item) => item.time === x);
                console.log('filterArr====>',filterArr,x);
                baseData.push(filterArr.reduce((acc, cur) => acc + cur.count, 0));
              });
              const monthData = [{ name: parentList[0] && parentList[0].name, value: baseData }];
              setMonthData(monthData);
              console.log('扁平化的monthData===>',monthData);
              return;
            }

            // if (!parentList.find((val) => !val.parentId)) {
            //   // const noParent = orgz.find((val) => !val.parentId);
            //   const noParent = baseDepartList.find((val) => !val.parentId);
            //   parentList.push(noParent);
            // }
            // 有多个树状结构时
            const root = formatNotTree(parentList,baseDepartList) || [];
            console.log('root=====>dauncheg', root);
            if (root.length && root[0].children) {
              const data = root[0].children;

              const s = new Set(); //实例化对象
              data.forEach((item) => s.add(item.tenantId)); //添加值（Set可以去掉重复数据）
              let newData = Array.from({ length: s.size }, () => []) as any[]; //创建指定长度数组并添值
              data.forEach((item: any) => {
                let index = [...s].indexOf(item.tenantId); //找到指定下标
                newData[index].push(item); //添加数据
              });

              console.log('相同的数据合并--->', newData);
              const strucData = newData.map((item) => fn(item));
              console.log('扁平化的=>', strucData);
              let monthData = [] as any[];
              strucData.map((val, index) => {
                monthData[index] = { name: val[0].name, value: [] };
                ss.forEach((x) => {
                  let filterArr = [] as any[];
                  val.forEach((item) => {
                    if(item.data) {
                      filterArr = item.data.filter(val => val.time === x)
                    }
                  });
                  console.log('val====>',val,x,'filterArr',filterArr);
                  monthData[index].value.push(filterArr.reduce((acc, cur) => acc + cur.count, 0));
                });
              });
              monthData = monthData.filter(item =>  !(item.value.every(val => val === 0)));
              console.log('最终数据=>', monthData,);
              setMonthData(monthData);
            } else {
              setMonthData([]);
            }
          })
          .catch((e) => message.error(e.message));
      })
      .catch((e) => message.error(e.message));

    // 查场景数据
    dispatch({
      type: 'report/getScene',
      payload,
    })
      .then((list: Array<List>) => {
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
          if (remark && remark.length) {
            const datalist = formatRemark(remark);
            setData2(datalist);
          }
        } else {
          setData1(noData);
          setData2(noData);
        }
      })
      .catch((e) => message.error(e.message));

    // 查操作人数据
    dispatch({
      type: 'report/getOperation',
      payload,
    })
      .then((list: Array<List>) => {
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
            const datalist = formatScene(ivrIntents, scene);
            setData4(datalist);
          }
        } else {
          setData3(noData);
          setData4(noData);
        }
      })
      .catch((e) => message.error(e.message));
  }

  useEffect(() => {
    onSubmit({ time: moment() });
  }, []);

  function lengendClick(item: any): void {
    const { x, y } = item;
    const list = data1.filter((item) => item.x === x) || [{}];
    const remark = objToArrObj(list[0].remark);
    if (remark && remark.length) {
      const list = formatRemark(remark);
      setData2(list);
      return;
    }
    setData2(noData);
  }

  function lengendClick2(item: any): void {
    const { x } = item;
    const list = data3.filter((item) => item.x === x) || [{}];
    const scene = objToArrObj(list[0].scene);
    if (scene && scene.length) {
      const list = formatScene(ivrIntents, scene);
      setData4(list);
      return;
    }
    setData4(noData);
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
        <LineChart xAxisData={xAxisData} monthData={monthData} legend={legend} />
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
