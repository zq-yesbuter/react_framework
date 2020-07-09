import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { equals } from '@/utils/utils';

var data = {
  title: ['总计', '北京', '上海', '浙江', '深圳', '广东', '宁波', '云南', '江苏', '湖南', '其他'],
  attainment_rate: [60, 80, 90, 60, 70, 80, 90, 60, 70, 90, 500],
  productivity_1: [0, 45, 8, 100, 110, 70, 80, 90, 100, 100, 500],
  productivity_2: [0, 45, 8, 100, 110, 70, 80, 90, 100, 100, 500],
};

export default class OnlineEcharts extends Component {
  componentDidUpdate(props) {
    if (!equals(props.monthData, this.props.monthData)) {
      // console.log('=====>两个类型====》',props.monthData,this.props.monthData,equals(props.monthData,this.props.monthData));
      let echarts_instance = this._echarts_react.getEchartsInstance();
      // then you can use any API of echarts.
      echarts_instance.clear();
      //使用刚指定的配置项和数据显示图表。
      echarts_instance.setOption(this.getOption(), true);
    }
  }
  getOption = () => {
    const { xAxisData, monthData, legend, lineValue } = this.props;
    let series = monthData.map((item) => ({
      name: item.name,
      type: 'bar',
      // barWidth: 18,
      barMaxWidth: 25,
      stack: 'aa',
      label: {
        show: true,
        textStyle: {
          color: '#000',
        },
        position: 'inside',
        formatter: function (p) {
          return p.value > 0 ? p.value : '';
        },
      },
      yAxisIndex: 0,
      data: item.value,
    }));
    // series.push({
    //   name: lineValue[0] && lineValue[0].name,
    //   type: 'line',
    //   yAxisIndex: 0,
    //   smooth: true, //是否平滑
    //   showAllSymbol: true,
    //   // symbol: 'circle',
    //   symbolSize: 5,
    //   label: {
    //     show: true,
    //     position: 'top',
    //     textStyle: {
    //       color: '#6c50f3', //'#6c50f3',
    //     },
    //     formatter: function (p) {
    //       return p.value > 0 ? p.value : '';
    //     },
    //   },
    //   itemStyle: {
    //     normal: {
    //       color: '#6c50f3',
    //       lineStyle: {
    //         color: '#6c50f3',
    //         width: 1,
    //       },
    //     },
    //   },
    //   tooltip: {
    //     trigger: 'axis',
    //   },
    //   data: lineValue[0] && lineValue[0].value,
    // });
    // console.log('lineValue====>', lineValue);
    let newLegend = monthData.map((item) => item.name);
    // if (lineValue[0] && lineValue[0].name) {
    //   newLegend.push(lineValue[0].name);
    // }
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
      // {
      //   type: 'value',
      //   name: '外呼总量',
      //   splitLine: {
      //     show: false,
      //   },
      //   axisTick: {
      //     show: true,
      //   },
      // },
    ];

    return {
      legend: {
        data: newLegend,
        top: '1%',
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
        <ReactEcharts option={this.getOption()} ref={(c) => (this._echarts_react = c)} />
      </div>
    );
  }
}
