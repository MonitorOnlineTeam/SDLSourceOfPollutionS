/*
 * @Author: Jiaqi 
 * @Date: 2019-04-15 15:20:20 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-04-16 09:39:08
 * @Desc 图表插件
 */
import React, { Component } from 'react';
import Echarts from 'native-echarts';

// 折线图默认主题颜色
const LINE_COLOR = ['#83b7ea', '#cfe2f5']

class Charts extends Component {
  constructor(props) {
    super(props);
    // 公共配置参数
    this._option = {
      title: {
        text: '',
        x: 'center'
      },
      legend: {
      },
    };
  }

  render() {
    return (
      <Echarts {...this.props} option={this._option} height={300} />
    );
  }
}

/**
 * 折线图
 * @props {String} title 标题
 * @props {Boolean} nolegend 是否显示图例
 * @props {Array} data 数据: [{name: '', value: []}]
 * @props {Array} label x轴数据
 * @props {Object} markLine 警戒线： {formatter: '超标', value: Number, color: String || Object}
 * @props {Array || String} color 主题颜色：#83b7ea' || ['#83b7ea', '#cfe2f5'] 多条线颜色不同时为数组
 * @props {Array} areaColor 区域颜色（渐变色0% - 100&）：['#83b7ea', '#cfe2f5']
 */

export class Line extends Charts {
  constructor(props) {
    super(props)

    // 配置项
    this._option = {
      ...this._option,
      ...Line._option
    };
  }


  _setOption() {
    // 主题颜色
    this._option.color = this.props.color ?
      (typeof this.props.color == 'string' ? [this.props.color] : this.props.color)
      : [LINE_COLOR[0]];
    // title
    this._option.title.text = this.props.title;
    // 是否显示图例
    !this.props.nolegend && (this._option.legend.data = this._getItemName(this.props.data || []));
    this._option.series = this._getItemData(this.props.data);
    this._option.xAxis.data = this.props.label || [];
  }

  render() {
    this._setOption()
    return super.render();
  }

  // 获取统计类目
  _getItemName(data) {
    return data.map(item => item.name);
  }
  // 获取统计数据
  _getItemData(data) {
    let _markLine = {};
    return data.map((item, index) => {
      // 警戒线设置
      if (index == 0 && this.props.markLine) {
        const { formatter = "超标", color = "#c74644", value = 0 } = this.props.markLine;
        _markLine = {
          markLine: {
            silent: true,
            label: {
              normal: {
                formatter: formatter
              }
            },
            data: [{
              yAxis: value
            }],
            lineStyle: {
              normal: {
                color: color,
              }
            },
          },
        }
      }
      return {
        name: item.name,
        type: 'line',
        data: item.value,
        areaStyle: {
          normal: {
            opacity: 0.9,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: this.props.areaColor ? this.props.areaColor[0] : LINE_COLOR[0] // 0% 处的颜色
              }, {
                offset: 1, color: this.props.areaColor ? this.props.areaColor[1] || this.props.areaColor[0] : LINE_COLOR[1] // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        },
        ..._markLine
      }
    })
  }
}

Line._option = {
  color: ['#83b7ea'],
  tooltip: {
    trigger: 'axis',
    formatter: '{b} {a}:{c}'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    splitLine: {
      show: true,     //是否显示网格线
      lineStyle: {
        color: '#ddd',
        type: 'dashed'
      }
    },
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#666'
      },
    },
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,     //去掉网格线
      lineStyle: {
        color: '#ddd',
        type: 'dashed'
      }
    },
    axisLine: { // 坐标轴线样式
      lineStyle: {
        color: '#666'
      },
    },
    axisTick: {
      show: false
    }
  },
  series: {
  }
}

/**
 * 柱状图 - 待扩展
 */
export class Bar extends Charts {
  constructor(props) {
    super(props)

    // 配置项
    this._option = {
      ...this._option,
      ...Bar._option
    };
  }
  render() {
    return super.render();
  }
}

Bar._option = {};

/**
 * 饼图 - 待扩展
 */
export class Pie extends Charts {
  constructor(props) {
    super(props)

    // 配置项
    this._option = {
      ...this._option,
      ...Pie._option
    };
  }
  render() {
    return super.render();
  }
}

Pie._option = {};

export default Charts;