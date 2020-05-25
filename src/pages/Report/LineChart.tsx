import React from 'react';
import moment from 'moment';
import CommonCharts from './CommonCharts';

const axiasFunc = (time = [moment().subtract(7, 'd'), moment().subtract(1, 'd')]) => {
    const [begin, end] = time;
    const axias = [begin.format('MM/DD')];
    let step = end.diff(begin, 'days');
    return Array(step)
      .fill(0)
      .reduce(acc => {
        acc.push(begin.add(1, 'day').format('MM/DD'));
        return acc;
      }, axias);
  };

function LineChart() {
  const options = {
    time:[moment().subtract(7, 'd'), moment().subtract(1, 'd')],
    axias:axiasFunc(),
    title: '订单金额',
    data: [1,2,3],
    options: {
        // 图表的title
        legend: {
          data: [
            '外呼量',
            '环比',
          ],
        },
        series:  [{ key: 'newUserCount', data: 'newUserCount', name: '外呼量', type: 'bar', val: 5 },
        {
          key: 'partici',
          data: 'partici',
          name: '环比',
          type: 'line',
          val: 7,
          col: 1,
        },],
        yAxis: [
          {
            name: '绝对值',
            type: 'value',
            splitLine: false,
          },
          {
            name: '增量(%)',
            type: 'value',
            splitLine: false,
            inverse: false, // 起始点
          },
        ],
      },
    // average: formatAvg(fourAvgData, ORDERAMOUNT),
  };
  return (
    <CommonCharts
        {...options}
    />
  );
}
export default LineChart;
