//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import moment from 'moment';

import Echarts from 'native-echarts';

/**
 * AQI柱状图
 */
export default class AqiBar extends PureComponent {
    static defaultProps = {
        height: 200
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <Echarts option={this.getOption()} width={this.props.width} height={this.props.height} />
            </View>
        );
    }

    getOption = () => {
        let data = [];
        let dataAxis = [];
        let i = 0;
        if (this.props.cityAQIDataList) {
            this.props.cityAQIDataList.map((item, index) => {
                let aqi = item.AQI;
                if (aqi == -99 || aqi == 0) aqi = null;
                data.push(aqi);
                dataAxis.push(moment(item.MonitorTime).format('HH'));
            });
        }

        return {
            grid: {
                top: 10,
                bottom: 20
            },
            tooltip: {
                confine: false,
                trigger: 'axis',
                position: function (point, params, dom, rect, size) {
                    //其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层
                    //div和tooltip提示框的大小
                    let x = point[0]; //
                    let y = point[1];
                    if (x > 240) {
                        x = 240;
                    }
                    return [x, '10%'];
                }
            },
            xAxis: {
                data: dataAxis,
                axisTick: {
                    //坐标轴刻度相关设置。
                    show: false
                },
                axisLabel: {
                    //坐标轴刻度标签的相关设置。
                    show: true,
                    interval: 1,
                    inside: false,
                    textStyle: {
                        color: '#999',
                        fontWeight: 'normal',
                        fontSize: 10
                    },
                    formatter: function (value, index) {
                        'show source';
                        return value;
                    }
                },
                splitLine: {
                    //坐标轴在 grid 区域中的分隔线。
                    show: false
                },
                splitArea: {
                    //坐标轴在 grid 区域中的分隔区域，默认不显示。
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#cccccc'
                    }
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        type: 'dotted'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#999',
                        fontSize: 10
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#cccccc'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                {
                    type: 'bar',
                    name: 'AQI',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                const iaqi = params.value;
                                if (iaqi > 0 && iaqi <= 50) {
                                    return '#4cd077';
                                } else if (iaqi > 50 && iaqi <= 100) {
                                    return '#fdd22a';
                                } else if (iaqi > 100 && iaqi <= 150) {
                                    return '#f49d15';
                                } else if (iaqi > 150 && iaqi <= 200) {
                                    return '#f17171';
                                } else if (iaqi > 200 && iaqi <= 300) {
                                    return '#d05696';
                                } else if (iaqi > 300 && iaqi < 500) {
                                    return '#a14458';
                                } else if (iaqi >= 500) {
                                    //爆表
                                    return '#000000';
                                }
                                return '#489ae3';
                            }
                        }
                    },
                    data: data
                }
            ]
        };
    };
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000000'
    }
});
