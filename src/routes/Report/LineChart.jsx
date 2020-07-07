import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

var data = {
  title: ['总计', '北京', '上海', '浙江', '深圳', '广东', '宁波', '云南', '江苏', '湖南', '其他'],
  attainment_rate: [60, 80, 90, 60, 70, 80, 90, 60, 70, 90, 500],
  productivity_1: [0, 45, 8, 100, 110, 70, 80, 90, 100, 100, 500],
  productivity_2: [0, 45, 8, 100, 110, 70, 80, 90, 100, 100, 500],
};

export default class OnlineEcharts extends Component {
  getOption = () => {
    const { xAxisData, monthData, legend } = this.props;
    const series = monthData.map(item => ({
      name: item.name,
      type: 'bar',
      barWidth: 18,
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
    const yAxis = [
      {
        type: 'value',
        name: '外呼人数',
        splitLine: {
          show: false,
        },
        axisTick: {
          show: true,
        },
      },
    ];

    return {
      legend: {
        data: newLegend,
        top: '15%',
      },
      // hover上的数据
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let res = `<div><p>外呼时间：${params[0].axisValue}</p></div>`;
          for (let i = 0; i < params.length; i++) {
            // if (params[i].seriesName === '增量') {
            //   res += `<p>外呼${params[i].seriesName}:${params[i].value}%</p>`;
            // } else {
              res += `<p>${params[i].seriesName}:${params[i].value}</p>`;
            // }
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
      <div style={{ marginTop: 30 }}>
        <ReactEcharts option={this.getOption()} />
      </div>
    );
  }
}
