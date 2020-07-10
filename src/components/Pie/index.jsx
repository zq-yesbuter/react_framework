import React, { Component } from 'react';
import { Chart, Tooltip, Geom, Coord } from 'bizcharts';
import { DataView } from '@antv/data-set';
import { Divider, Icon, Tooltip as AntTooltip } from 'antd';
import classNames from 'classnames';
import ReactFitText from 'react-fittext';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import './index.less';

/* eslint react/no-danger:0 */
@autoHeight()
export default class Pie extends Component {
  state = {
    legendData: [],
    staticLegendData: [],
    legendBlock: false,
    selIndex: 0,
    start: 0,
    length: 5,
    oneHeight:350,
  };

  componentDidMount() {
    this.getLegendData();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      // because of charts data create when rendered
      // so there is a trick for get rendered time
      const { legendData, staticLegendData } = this.state;
      this.setState(
        {
          legendData: [...legendData],
          staticLegendData: [...staticLegendData],
          start: 0,
        },
        () => {
          this.getLegendData();
        }
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.resize.cancel();
    this.setState({start: 0});
  }
  
  // 展开
  handleListChange = (e) => {
    e && e.preventDefault();
    const { start, length, staticLegendData } = this.state;
    const { lengendClick, expandKey, expandObj } = this.props;
    const s = start + length >= staticLegendData.length ? 0 : start + length;
    let newLegendData = staticLegendData.slice(0) || [];
    if (newLegendData.length) {
      newLegendData = newLegendData.map((item) => ({ ...item, checked: true }));
      newLegendData[0].checked = false;
      lengendClick && lengendClick(newLegendData[0]);
    }

    let height = 350;
    if(expandKey==='one' || expandKey==='two'){
      height = (Math.max(expandObj.one.length,expandObj.two.length)+ 2) * 33;
      // this.setState({oneHeight:height},() => {
      //   // fedBack(expandKey,true)
      // });
      // if(expandKey ==='two'){
      //   if(expandObj.one.expand) {
      //     height = (Math.max(expandObj.one.length,expandObj.two.length)+ 2) * 33;
      //   }else{
      //     height = (expandObj.two.length+ 2) * 33;
      //   }
      // }else if(expandKey ==='one'){
      //   if(expandObj.two.expand) {
      //     height = (Math.max(expandObj.one.length,expandObj.two.length)+ 2) * 33;
      //   }else{
      //     height = (expandObj.one.length+ 2) * 33;
      //   }
      // }else if(expandKey === 'three'){
      //   if(expandObj.four.expand) {
      //     height = (Math.max(expandObj.three.length,expandObj.four.length)+ 2) * 33;
      //   }else{
      //     height = (expandObj.three.length+ 2) * 33;
      //   }
      // }else if(expandKey === 'four'){
      //   if(expandObj.three.expand) {
      //     height = (Math.max(expandObj.three.length,expandObj.four.length)+ 2) * 33;
      //   }else{
      //     height = (expandObj.four.length+ 2) * 33;
      //   }
      // }
      // this.setState({oneHeight:height});
      console.log('height====>',height,expandObj.one.length,expandObj.two.length,'expandKey==>',expandKey);
    }else{
      height = (Math.max(expandObj.three.length,expandObj.four.length)+ 2) * 33;
      // this.setState({oneHeight:height},() => {
      //   // fedBack(expandKey,true)
      // });
    }
    console.log('height====>',height,'expandKey==>',expandKey);
    this.setState((state) => {
      return {
        ...state,
        legendData: newLegendData,
        start: s,
        // oneHeight:600,
        oneHeight:height,
      };
    });

    // this.setState(state => {
    //   return ({
    //     ...state,
    //     legendData: newLegendData.map((item,i) => (i===0 ? {...item,checked:true} : {...item})),
    //     start: s,
    //   })
    // });
  };

  handleListShou = (e) => {
    e && e.preventDefault();
    const { start, length, staticLegendData } = this.state;
    const { lengendClick, expandClick} = this.props;
    const s = start + length >= staticLegendData.length ? 0 : start + length;
    let newLegendData = staticLegendData.slice(0,5) || [];
    if (newLegendData.length) {
      newLegendData = newLegendData.map((item) => ({ ...item, checked: true }));
      newLegendData[0].checked = false;
      lengendClick && lengendClick(newLegendData[0]);
    }
    this.setState({oneHeight:350},() => {
      // fedBack(expandKey,false)
    });

    this.setState((state) => {
      return {
        ...state,
        legendData: newLegendData,
        start: s,
      };
    },() => {
      // expandClick(newLegendData.length,false);
    });
  };

  getG2Instance = (chart) => {
    this.chart = chart;
  };

  // for custom lengend view
  getLegendData = () => {
    const { selIndex, start, length } = this.state;
    if (!this.chart) return;
    const geom = this.chart.getAllGeoms()[0]; // 获取所有的图形
    const items = geom.get('dataArray') || []; // 获取图形对应的

    let legendData = items.map((item) => {
      /* eslint no-underscore-dangle:0 */
      const origin = item[0]._origin;
      origin.color = item[0].color;
      origin.checked = true;
      return origin;
    });
    const { lengendClick } = this.props;
    if (lengendClick) {
      legendData = legendData.map((item, i) =>
        selIndex === i ? { ...item, checked: false } : { ...item }
      );
    }
    this.setState({
      legendData: legendData.slice(start, start + length),
      staticLegendData: legendData,
    });
  };

  handleRoot = (n) => {
    this.root = n;
  };

  handleLegendClick = (item, i) => {
    const { lengendClick } = this.props;
    if (lengendClick) {
      const newItem = item;
      newItem.checked = false;
      let { legendData } = this.state;
      legendData = legendData.map((item) => ({ ...item, checked: true }));
      legendData[i] = newItem;
      // this.setState({ selIndex: i });
      // if (this.chart) {
      //   this.chart.filter('x', val => filteredLegendData.indexOf(val) > -1);
      // }
      this.setState({
        legendData,
      });
      lengendClick(item, i);
      return;
    }
    // const newItem = item;
    // newItem.checked = !newItem.checked;

    // const { legendData } = this.state;
    // legendData[i] = newItem;

    // const filteredLegendData = legendData.filter((l) => l.checked).map((l) => l.x);

    // if (this.chart) {
    //   this.chart.filter('x', (val) => filteredLegendData.indexOf(val) > -1);
    // }

    // this.setState({
    //   legendData,
    // });
  };

  // for window resize auto responsive legend
  @Bind()
  @Debounce(300)
  resize() {
    const { hasLegend } = this.props;
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize);
      return;
    }
    const { legendBlock } = this.state;
    if (this.root.parentNode.clientWidth <= 380) {
      if (!legendBlock) {
        this.setState({
          legendBlock: true,
        });
      }
    } else if (legendBlock) {
      this.setState({
        legendBlock: false,
      });
    }
  }

  render() {
    const {
      valueFormat,
      subTitle,
      total,
      hasLegend = false,
      className,
      style,
      height,
      forceFit = true,
      percent = 0,
      color,
      inner = 0.75,
      animate = true,
      colors,
      lineWidth = 1,
      lengendClick,
    } = this.props;

    const { legendData, legendBlock, staticLegendData } = this.state;
    const pieClassName = classNames('pie', className, {
      hasLegend: !!hasLegend,
      legendBlock: legendBlock,
    });

    const {
      data: propsData,
      selected: propsSelected = true,
      tooltip: propsTooltip = true,
    } = this.props;

    let data = propsData || [];
    let selected = propsSelected;
    let tooltip = propsTooltip;

    const defaultColors = colors;
    // let data = this.props.data || [];
    // let selected = this.props.selected || true;
    // let tooltip = this.props.tooltip || true;
    let formatColor;

    const scale = {
      x: {
        type: 'cat',
        range: [0, 1],
      },
      y: {
        min: 0,
      },
    };

    if (percent) {
      selected = false;
      tooltip = false;
      formatColor = (value) => {
        if (value === '占比') {
          return color || 'rgba(24, 144, 255, 0.85)';
        } else {
          return '#F0F2F5';
        }
      };

      data = [
        {
          x: '占比',
          y: parseFloat(percent),
        },
        {
          x: '反比',
          y: 100 - parseFloat(percent),
        },
      ];
    }

    const tooltipFormat = [
      'x*percent',
      (x, p) => ({
        name: x,
        value: `${(p * 100).toFixed(2)}%`,
      }),
    ];

    const padding = [12, 0, 12, 0];

    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'y',
      dimension: 'x',
      as: 'percent',
    });
    console.log(staticLegendData.length,staticLegendData.length === legendData.length,legendData.length );
    const {oneHeight} = this.state;
    return (
      <div ref={this.handleRoot} className={pieClassName} style={{height:oneHeight,display:'flex',alignItems:'center'}}>
        <ReactFitText maxFontSize={25}>
          <div className="chart">
            <Chart
              scale={scale}
              height={height}
              forceFit={forceFit}
              data={dv}
              padding={padding}
              animate={animate}
              onGetG2Instance={this.getG2Instance}
            >
              {!!tooltip && <Tooltip showTitle={false} />}
              <Coord type="theta" innerRadius={inner} />
              <Geom
                style={{ lineWidth, stroke: '#fff' }}
                tooltip={tooltip && tooltipFormat}
                type="intervalStack"
                position="percent"
                color={['x', percent ? formatColor : defaultColors]}
                selected={selected}
              />
            </Chart>

            {(subTitle || total) && (
              <div className="total">
                {subTitle && <h4 className="pie-sub-title">{subTitle}</h4>}
                {/* eslint-disable-next-line */}
                {total && (
                  <div className="pie-stat">{typeof total === 'function' ? total() : total}</div>
                )}
              </div>
            )}
          </div>
        </ReactFitText>

        {hasLegend && (
          <ul className="legend">
            {legendData &&
              legendData
                .filter((x) => x.x !== '暂无数据')
                .map((item, i) => (
                  <li
                    key={item.x}
                    onClick={() => this.handleLegendClick(item, i)}
                    style={{
                      backgroundColor:
                        lengendClick && !item.checked ? 'rgba(24,144,255,0.6)' : '#fff',
                    }}
                  >
                    <span
                      className="dot"
                      style={{
                        backgroundColor: !lengendClick && !item.checked ? '#aaa' : item.color,
                      }}
                    />
                    {item.x && item.x.length > 4 ? (
                      <AntTooltip title={item.x}>
                        <span
                          className="legendTitle"
                          style={{
                            color: lengendClick && !item.checked ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                          }}
                        >
                          {item.x}
                        </span>
                      </AntTooltip>
                    ) : (
                      <span
                        className="legendTitle"
                        style={{
                          color: lengendClick && !item.checked ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                        }}
                      >
                        {item.x}
                      </span>
                    )}
                    <Divider type="vertical" />
                    <span
                      className="percent"
                      style={{
                        color: lengendClick && !item.checked ? '#fff' : 'rgba(0, 0, 0, 0.45)',
                      }}
                    >
                      {`${(isNaN(item.percent) ? 0 : item.percent * 100).toFixed(2)}%`}
                    </span>
                    <span
                      className="value"
                      style={{
                        color: lengendClick && !item.checked ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                      }}
                    >
                      {valueFormat ? valueFormat(item.y) : item.y}
                    </span>
                    <span
                      className="value"
                      style={{
                        color: lengendClick && !item.checked ? '#fff' : 'rgba(0, 0, 0, 0.65)',
                        marginLeft: 0,
                      }}
                    >
                      {item.z}
                    </span>
                  </li>
                ))}
            {staticLegendData.length > 5 && (
              <li style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {staticLegendData.length === legendData.length ? <a onClick={this.handleListShou}>收起</a> : <a onClick={this.handleListChange}>展开</a>}
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }
}
