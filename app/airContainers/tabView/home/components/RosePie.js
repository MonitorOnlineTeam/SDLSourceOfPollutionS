//import liraries
import React, { PureComponent } from 'react';
import { View, Image, Platform, StyleSheet, Text } from 'react-native';

import Echarts from 'native-echarts';

const ic_up = require('../../../../images/ic_up.png');
const ic_down = require('../../../../images/ic_down.png');
const ic_hold = require('../../../../images/ic_hold.png');
/**
 * 空气质量优良天数统计
 */
class RosePie extends PureComponent {
    static defaultProps = {
        color: ['#4cd077', '#f49d15', '#f17171', '#d05696', '#a14458', '#000000'],
        backgroundColor: '#ffffff',
        height: 160,
        width: 120
    };

    constructor(props) {
        super(props);
        this.state = {
            type: props.type
        };
    }

    render() {
        const cityStatResult = this.props.cityStatResult;
        if (!cityStatResult) return null;
        const data = [];
        if (this.state.type == 'year') {
            data.push({
                value: cityStatResult.year.thisYearOne,
                name: '优良',
                compare: cityStatResult.year.lastYearOne
            });
            data.push({
                value: cityStatResult.year.thisYearTwo,
                name: '轻度',
                compare: cityStatResult.year.lastYearTwo
            });
            data.push({
                value: cityStatResult.year.thisYearThree,
                name: '中度',
                compare: cityStatResult.year.lastYearThree
            });
            data.push({
                value: cityStatResult.year.thisYearFour,
                name: '重度',
                compare: cityStatResult.year.lastYearFour
            });
            data.push({
                value: cityStatResult.year.thisYearFive,
                name: '严重',
                compare: cityStatResult.year.lastYearFive
            });
            data.push({ value: cityStatResult.year.thisYearSix, name: '爆表', compare: cityStatResult.year.lastSixe });
        } else if (this.state.type == 'month') {
            data.push({
                value: cityStatResult.month.thisMonthOne,
                name: '优良',
                compare: cityStatResult.month.lastMonthOne
            });
            data.push({
                value: cityStatResult.month.thisMonthTwo,
                name: '轻度',
                compare: cityStatResult.month.lastMonthTwo
            });
            data.push({
                value: cityStatResult.month.thisMonthThree,
                name: '中度',
                compare: cityStatResult.month.lastMonthThree
            });
            data.push({
                value: cityStatResult.month.thisMonthFour,
                name: '重度',
                compare: cityStatResult.month.lastMonthFour
            });
            data.push({
                value: cityStatResult.month.thisMonthFive,
                name: '严重',
                compare: cityStatResult.month.lastMonthFive
            });
            data.push({
                value: cityStatResult.month.thisMonthSix,
                name: '爆表',
                compare: cityStatResult.month.lastMonthSixe
            });
        }

        return (
            <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
                <Echarts option={this.getOption(data)} width={this.props.width} height={this.props.height} />
                <View style={{ flexDirection: 'column', marginLeft: 40 }}>
                    {data.map((item, key) => this.getLegend(item, key))}
                </View>
                <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                    <Text style={{ fontSize: 15, color: '#42778f' }}>同</Text>
                    <Text style={{ fontSize: 15, color: '#42778f' }}>比</Text>
                </View>
                <View style={{ flexDirection: 'column' }}>{data.map((item, key) => this.getCompare(item, key))}</View>
            </View>
        );
    }

    setType = type => {
        this.setState({ type });
    };

    getLegend = (item, key) => {
        return (
            <View
                key={key.toString()}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: key == 0 ? 0 : 10 }}
            >
                <View style={{ width: 8, height: 8, backgroundColor: this.props.color[key] }} />
                <Text style={{ fontSize: 14, color: '#666' }}>{item.name}</Text>
            </View>
        );
    };

    getCompare = (item, key) => {
        let img = ic_hold;
        let dis = '';
        if (item.compare > 0) img = ic_up;
        else if (item.compare < 0) img = ic_down;

        let v = Math.abs(item.compare);
        if (v == 0) dis = '持平';
        else dis = `${v}天`;
        return (
            <View
                key={key.toString()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 54,
                    justifyContent: 'flex-end',
                    marginTop: key == 0 ? 0 : 10
                }}
            >
                <Text style={{ fontSize: 14, color: '#666', marginRight: 4 }}>{dis}</Text>
                <Image style={{ width: 10, height: 10 }} source={img} />
            </View>
        );
    };

    getOption = data => {
        const sortData = [...data];
        const sortColor = [];
        sortData.map((item, key) => {
            item.color = this.props.color[key];
        });
        sortData.sort(function(a, b) {
            return a.value - b.value;
        });
        sortData.map((item, key) => {
            sortColor.push(item.color);
        });
        return {
            //API文档：https://www.echartsjs.com/option.html#series-pie
            backgroundColor: this.props.backgroundColor,
            grid: {
                top: 10
            },
            series: [
                {
                    name: '空气质量优良天数统计', //系列名称
                    type: 'pie',
                    legendHoverLink: true, //是否启用图例 hover 时的联动高亮
                    hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
                    hoverOffset: 10, //高亮扇区的偏移距离
                    clockwise: false, //饼图的扇区是否是顺时针排布。
                    startAngle: 90, //起始角度，支持范围[0, 360]。
                    minAngle: 0, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
                    minShowLabelAngle: 0, //小于这个角度（0 ~ 360）的扇区，不显示标签（label 和 labelLine）。
                    avoidLabelOverlap: true, //是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。
                    stillShowZeroSum: true, //是否在数据和为0（一般情况下所有数据为0） 的时候不显示扇区。
                    radius: '100%', //饼图的半径
                    center: ['50%', '50%'], //饼图的中心（圆心）坐标
                    //                   roseType: 'radius',//是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：'radius' 扇区圆心角展现数据的百分比，半径展现数据的大小。'area' 所有扇区圆心角相同，仅通过半径展现数据大小。
                    label: {
                        normal: {
                            show: false
                        }
                    }, //饼图图形上的文本标签
                    labelLine: {
                        normal: {
                            show: false
                        }
                    }, //标签的视觉引导线样式
                    data: sortData
                }
            ],
            color: sortColor
        };
    };
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8'
    }
});

//make this component available to the app
export default RosePie;
