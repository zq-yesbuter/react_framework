import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const format = arr => {
  const newArr = _.cloneDeep(arr);
  if (newArr && newArr.length) {
    const keys = Object.keys(newArr[0]);
    let obj = {};
    keys.forEach(item => {
      obj[item] = [];
    });
    newArr.forEach(item => {
      for (let i in item) {
        obj[i].push(item[i]);
      }
    });
    return obj;
  } else {
    return {};
  }
};
export default class OnlineEcharts extends Component {
  getOption = () => {
    const { data: initData, options: { legend, series: initSeries, yAxis } } = this.props;
    const data = format(initData);
    let series = _.cloneDeep(initSeries);
    const xAxisData = initData.reduce((acc, cur) => {
      acc.push(
        1
        // cur.countDay
        //   .split('-')
        //   .join('/')
        //   .substr(-5)
      );
      return acc;
    }, []);
    // 处理series中的数据
    series.forEach(item => {
      const mapItem = data[item.data];
      if (item.type === 'line' && mapItem) {
        item.data = mapItem.map(val => {
          return {
            name: item.key,
            value: val && (String(val).includes('.') ? val.toFixed(2) : val),
          };
        });
        item.yAxisIndex = 1;
      } else if (data && mapItem) {
        item.data = mapItem.map(val => {
          return {
            name: item.key,
            value: val && (String(val).includes('.') ? val.toFixed(2) : val),
          };
        });
        item.label = {
          show: true,
          position: 'top',
        };
        item.barMaxWidth = 20;
        // item.barGap=0;
      } else if (Object.prototype.toString.call(item.data) !== '[object Array]') {
        item.data = [];
      }
    });
    return {
      legend,
      // hover上的数据
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let res = `<div><p>时间：${params[0].axisValue}</p></div>`;
          for (let i = 0; i < params.length; i++) {
            res += `<p>${params[i].seriesName}:${params[i].value}</p>`;
          }
          return res;
        },
      },
      color: [
        '#1890ff',
        '#2fc25b',
        '#13c2c2',
        '#facc14',
        '#00e9db',
        '#d0a00e',
        '#faad14',
        '#00c0e9',
        '#eb3600',
        '#d0570e',
      ],
      xAxis: {
        nameGap: 0,
        nameLocation: 'start',
        type: 'category',
        data: xAxisData,
      },
      yAxis,
      series,
    };
  };
  render() {
    return (
      <div>
        <ReactEcharts option={this.getOption()} />
      </div>
    );
  }
}
