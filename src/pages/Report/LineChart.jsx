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
// 处理series中的数据
// series.forEach(item => {
//   const mapItem = data[item.data];
//   if (item.type === 'line' && mapItem) {
//     item.data = mapItem.map(val => {
//       return {
//         name: item.key,
//         value: val && (String(val).includes('.') ? val.toFixed(2) : val),
//       };
//     });
//     item.yAxisIndex = 1;
//   } else if (data && mapItem) {
//     item.data = mapItem.map(val => {
//       return {
//         name: item.key,
//         value: val && (String(val).includes('.') ? val.toFixed(2) : val),
//       };
//     });
//     item.label = {
//       show: true,
//       position: 'top',
//     };
//     item.barMaxWidth = 20;
//     // item.barGap=0;
//   } else if (Object.prototype.toString.call(item.data) !== '[object Array]') {
//     item.data = [];
//   }
// });
export default class OnlineEcharts extends Component {
  getOption = () => {
    // const {
    //   data: initData,
    //   options: { legend, series: initSeries, yAxis },
    // } = this.props;
    // const data = format(initData);
    // let series = _.cloneDeep(initSeries);
    const { xAxisData, monthData } = this.props;

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
      //   name: '增量(%)',
      //   position: 'right',
      //   splitLine: {
      //     show: false,
      //   },
      //   axisTick: {
      //     show: false,
      //   },
      //   axisLabel: {
      //     show: true,
      //     formatter: '{value} %', //右侧Y轴文字显示
      //   },
      // },
    ];
    const series = [
      // {
      //   name: '增量',
      //   type: 'line',
      //   yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
      //   smooth: true, //平滑曲线显示
      //   showAllSymbol: true, //显示所有图形。
      //   symbol: 'emptyCircle', //标记的图形为实心圆
      //   symbolSize: 6, //标记的大小
      //   itemStyle: {
      //     //折线拐点标志的样式
      //     color: '#2fc25b',
      //   },
      //   lineStyle: {
      //     color: '#2fc25b',
      //   },
      //   areaStyle: {
      //     color: 'rgba(5,140,255, 0.2)',
      //   },
      //   data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      // },
      {
        name: '外呼人数',
        type: 'bar',
        barWidth: 15,
        data: monthData,
        color:'#1890ff',
        itemStyle: {
          normal: {
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              // textStyle: { //数值样式
              //   color: 'black',
              //   fontSize: 16
              // }
            }
          }
        },
      },
    ];

    return {
      legend: {
        data: [ '外呼人数'],
        top: '15%',
        // textStyle: {
        //     color: "#ffffff"
        // }
      },
      // hover上的数据
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let res = `<div><p>外呼时间：${params[0].axisValue}</p></div>`;
          for (let i = 0; i < params.length; i++) {
            if(params[i].seriesName === '增量') {
              res += `<p>外呼${params[i].seriesName}:${params[i].value}%</p>`;
            }else{
              res += `<p>${params[i].seriesName}:${params[i].value}</p>`;
            }
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
      <div style={{marginTop:30}}>
        <ReactEcharts option={this.getOption()} />
      </div>
    );
  }
}
