import React, { useState, useEffect } from 'react';
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
  onlineData,
  onlineOrgz,
  online2,
  one,
  oneO,
} from './contant';
import QueryForm from './QueryForm';
import LineChart from './LineChart';
import { formatTaskType, objToArrObj, formatTree } from '@/utils/utils';
import { getIvrIntents } from '@/services/nameList';

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
  return remarkList
    .sort((a, b) => b.count - a.count)
    .map(({ count, total_time_elapsed_sec, x }) => ({
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
  return sceneList
    .sort((a, b) => b.count - a.count)
    .map(({ count, total_time_elapsed_sec, x }) => ({
      x,
      y: count,
      z: `${total_time_elapsed_sec}s`,
    }));
}

// 扁平化数组
const flatFn = (source, res = [] as any[]) => {
  source.forEach((el) => {
    res.push(el);
    el.children && el.children.length > 0 ? flatFn(el.children, res) : '';
  });
  return res;
};

// 对断层数据的处理
function formatNotTree(list = [] as any[], source, id?) {
  const recursion = (source) => {
    if (!source) {
      return;
    }
    return source.map((el) => {
      const checkArray = list.filter((val) => el.tenantId === val.tenantId);
      return checkArray.length
        ? { ...el, children: recursion(el.children), data: checkArray }
        : { ...el, children: recursion(el.children) };
    });
  };
  return recursion([formatBaseTree(source, id)]);
}

function formatBaseTree(departList = [], id) {
  const cloneList = _.cloneDeep(departList);
  const idMapping = cloneList.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});
  let root = {};
  cloneList.forEach((el) => {
    // 判断根节点
    if (id ? el.tenantId === id : !el.parentId) {
      root = el;
      return;
    }
    // 用映射表找到父元素
    const parentEl = cloneList[idMapping[el.parentId]] || {};
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
  });
  return root;
}

// 构造一个二维数组，将tenantId相同的放在同一个数组里
function formatTwoDimension(data) {
  const s = new Set(); //实例化对象
  data.forEach((item) => s.add(item.tenantId)); //添加值（Set可以去掉重复数据）
  let newData = Array.from({ length: s.size }, () => []) as any[]; //创建指定长度数组并添值
  data.forEach((item: any) => {
    let index = [...s].indexOf(item.tenantId); //找到指定下标
    newData[index].push(item); //添加数据
  });
  return newData;
}

// 扁平化数组
function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
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
  const [lineValue, setLineValue] = useState([] as any[]);
  const [oneLineData, setOnelineData] = useState({
    one: { expand: false, length: 5 },
    two: { expand: false, length: 5 },
  });
  const [twoLineData, setTwolineData] = useState({
    three: { expand: false, length: 5 },
    four: { expand: false, length: 5 },
  });
  function onSubmit(values: any) {
    const { time, tenantId } = values;
    let payload: QueryData = {
      startTime: moment(time).startOf('month').format(format),
      endTime: moment(time).endOf('month').format(format),
    };
    payload = tenantId ? { ...payload, tenantId } : payload;
    const days = moment(time).daysInMonth();
    const month: number = moment(time).month() + 1;
    const axis: number[] = Array.from(new Array(days).keys());
    const ss: string[] = axis.reduce((acc: string[], cur: number) => {
      return acc.concat(`${month}/${cur > 8 ? cur + 1 : `0${cur + 1}`}`);
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
            // const list = one;
            if (!list && !list.length) {
              setMonthData([{ name: '', value: [] }]);
              setLineValue([]);
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
              // const checkObj = oneO.find(
              //   (val: { tenantId: string }) => item.tenantId === val.tenantId
              // );
              const checkObj = baseDepartList.find(
                (val: { tenantId: string }) => item.tenantId === val.tenantId
              );
              if (checkObj) {
                const { parentId, name, id } = checkObj;
                parentList.push({ ...item, parentId, name, id });
              }
            });
            if (newList.every((item) => item.tenantId === newList[0].tenantId)) {
              let baseData = [] as any[];
              ss.forEach((x) => {
                const filterArr = newList.filter((item) => item.time === x);
                baseData.push(filterArr.reduce((acc, cur) => acc + cur.count, 0));
              });
              const monthData = [{ name: parentList[0] && parentList[0].name, value: baseData }];
              setMonthData(monthData);
              setLineValue([]);
              // setLineValue([
              //   { name: parentList[0] && `${parentList[0].name}总量`, value: baseData },
              // ]);
              // console.log('扁平化的monthData===>', monthData);
              return;
            }
            // 有多个树状结构时
            const root = formatNotTree(parentList, baseDepartList, tenantId) || [];
            // const root = formatNotTree(parentList, oneO, tenantId) || [];
            // console.log('root=====>dauncheg', root);
            if (root.length) {
              const data =
                root[0].children && root[0].children.length
                  ? [{ ...root[0], children: undefined }, ...root[0].children]
                  : [root[0]];
              // console.log('包含根节点的所有的数据的总和==>', data);
              const newData = formatTwoDimension(data);
              // console.log('相同的数据合并--->', newData);
              const strucData = newData.map((item) => flatFn(item));
              // console.log('扁平化的=>', strucData);
              const lineData = flatten(strucData);
              const flatValue = lineData.reduce(
                (acc, cur) => acc.concat(cur.data && cur.data.length ? cur.data : []),
                []
              );
              // console.log('flatValue====>', flatValue);
              let lineValue = [] as any[];
              ss.forEach((x) => {
                let filterArr = [] as any[];
                filterArr = flatValue.filter((val) => val.time === x);
                lineValue.push(filterArr.reduce((acc, cur) => acc + cur.count, 0));
              });
              // console.log('lineData===>', lineData, 'lineValue==>', lineValue);
              setLineValue([{ name: data[0] && `${data[0].name}总量`, value: lineValue }]);
              let monthData = [] as any[];
              // const splitFirstList = strucData.slice(1);
              strucData.map((val, index) => {
                monthData[index] = { name: val[0] && val[0].name, value: [] };
                ss.forEach((x) => {
                  let filterArr = [] as any[];
                  const filterList = val.reduce(
                    (acc, cur) => acc.concat(cur.data && cur.data.length ? cur.data : []),
                    []
                  );
                  // console.log('filterList===>', filterList);
                  filterArr = filterList.filter((val) => val.time === x);
                  // console.log('val====>', val, x, 'filterArr', filterArr);
                  monthData[index].value.push(filterArr.reduce((acc, cur) => acc + cur.count, 0));
                });
              });
              monthData = monthData.filter((item) => !item.value.every((val) => val === 0));
              // console.log('最终数据=>', monthData);
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
          if (ivrIntents && ivrIntents.length) {
            setOneLine(list, ivrIntents);
          } else {
            getIvrIntents()
              .then((ivrIntents) => {
                setOneLine(list, ivrIntents);
              })
              .catch((e) => message.error(e.message));
          }
        } else {
          setData1(noData);
          setData2(noData);
          setOnelineData({ one: { expand: false, length: 5 }, two: { expand: false, length: 5 } });
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
          if (ivrIntents && ivrIntents.length) {
            setTwoLine(list, ivrIntents);
          } else {
            getIvrIntents()
              .then((ivrIntents) => {
                setTwoLine(list, ivrIntents);
              })
              .catch((e) => message.error(e.message));
          }
        } else {
          setData3(noData);
          setData4(noData);
          setTwolineData({
            three: { expand: false, length: 5 },
            four: { expand: false, length: 5 },
          });
        }
      })
      .catch((e) => message.error(e.message));
  }

  useEffect(() => {
    onSubmit({ time: moment() });
  }, []);

  function setOneLine(list, ivrIntents) {
    // 第一行左侧
    const strData1 = list
      .sort((a, b) => b.count - a.count)
      .map(({ count, total_time_elapsed_sec, scene, remark }) => ({
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
      setOnelineData({
        one: { length: strData1.length, expand: false },
        two: { length: datalist.length, expand: false },
      });
    } else {
      setData2(noData);
      setOnelineData({
        one: { length: strData1.length, expand: false },
        two: { length: 5, expand: false },
      });
    }
  }

  function setTwoLine(list, ivrIntents) {
    // 第二行左侧
    const strData3 = list
      .sort((a, b) => b.count - a.count)
      .map(({ count, total_time_elapsed_sec, operator, scene }) => ({
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
      setTwolineData({
        three: { expand: false, length: strData3.length },
        four: { expand: false, length: datalist.length },
      });
    } else {
      setTwolineData({
        three: { expand: false, length: strData3.length },
        four: { expand: false, length: 5 },
      });
    }
  }

  function lengendClick(item: any): void {
    const { x, y } = item;
    const list = data1.filter((item) => item.x === x) || [{}];
    const remark = (list[0] && objToArrObj(list[0].remark)) || [];
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
    const scene = (list[0] && objToArrObj(list[0].scene)) || [];
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
        <LineChart xAxisData={xAxisData} monthData={monthData} lineValue={lineValue} />
        <Row type="flex" align="middle">
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="外呼类型分布"
              data={data1}
              height={254}
              // expandClick={oneHeightClick}
              lengendClick={lengendClick}
              expandObj={oneLineData}
              expandKey="one"
              // fedBack={fedBack}
            />
          </Col>
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="外呼结果分布"
              data={data2}
              height={254}
              expandObj={oneLineData}
              expandKey="two"
              // fedBack={fedBack}
              // expandClick={twoHeightClick}
            />
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="使用人使用量分布"
              data={data3}
              height={254}
              expandObj={twoLineData}
              lengendClick={lengendClick2}
              expandKey="three"
            />
          </Col>
          <Col span={12}>
            <Pie
              hasLegend
              subTitle="外呼类型分布"
              data={data4}
              height={254}
              expandObj={twoLineData}
              expandKey="four"
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ report = {}, user }) => ({ report, user }))(Index);
