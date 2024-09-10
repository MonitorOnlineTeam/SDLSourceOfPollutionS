import React, { PureComponent, Component } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Echarts, echarts } from 'react-native-secharts';

import globalcolor from '../../config/globalcolor';
import { SDLText, StatusPage, AlertDialog } from '../../components';
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../config/globalsize';
let alertContent = [];
@connect(({ abnormalTask }) => ({
    alarmDetailInfo: abnormalTask.alarmDetailInfo,
    alarmChartData: abnormalTask.alarmChartData,
    showDataSort: abnormalTask.showDataSort,
    alramButtonList: abnormalTask.alramButtonList,
    AlarmDataChartValue: abnormalTask.AlarmDataChartValue
}))
class ClueDetail extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '线索详情',
            headerRight: navigation.state.params.headerRight,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        console.log('线索详情2.0');
        this.state = {
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
        };
        this.alarmObj = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {});
    }

    componentDidMount() {
        this.statusPageOnRefresh();

        alertContent = [
            {
                text: '数据列表',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            // routeName: 'AlarmDataChart',
                            routeName: 'AlarmDataChart2',
                            params: { ...this.alarmObj }
                        })
                    );
                }
            },
            {
                text: '密度分布直方图',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'StatisPolValueNumsByDGIMN',
                            params: { ...this.alarmObj, type: 'StatisPolValueNumsByDGIMN' }
                        })
                    );
                }
            },
            {
                text: '波动范围',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'FluctuationRange',
                            params: this.alarmObj
                        })
                    );
                }
            },
            {
                text: '停用范围',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'StopRange',
                            params: this.alarmObj
                        })
                    );
                }
            },
            {
                text: '相关系数表',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'StatisLinearCoefficient',
                            params: { ...this.alarmObj, type: 'StatisLinearCoefficient' }
                        })
                    );
                }
            },
            {
                text: '数据现象',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'DataPhenomenon',
                            params: {
                                ...this.alarmObj,
                                callback: () => {
                                    this.statusPageOnRefresh();
                                }
                            }
                        })
                    );
                }
            },
            {
                text: '取消',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                }
            }
        ];
    }
    statusPageOnRefresh = () => {
        this.props.dispatch(
            createAction('abnormalTask/getSingleWarning')({
                modelWarningGuid: this.alarmObj.WarningCode || this.alarmObj.ModelWarningGuid
            })
        );
    };
    getTrendOption = (item, idx) => {
        //使用其它排放口烟气代替本排放口烟气
        //同一现场借用其他合格监测设备数据
        //引用错误、虚假的原始信号值
        let series = [];
        let xData = [];
        let yData = [];
        let colors = ['#5873C7', '#90CB74', '#EA7BCC', '#32cd32', '#6495ed'];
        let formatDates = [];
        let legends = [];
        SentencedToEmpty(item, ['data'], []).map((subI, subId) => {
            if (subId == 0) {
                subI.date.map(subDate => {
                    formatDates.push(moment(subDate).format('MM-DD HH:mm'));
                });
            }
            legends.push(subI.PointName ? subI.PointName : subI.pollutantName);
            series.push({
                name: subI.PointName ? subI.PointName : subI.pollutantName,
                type: 'line',
                data: subI.data,
                color: colors[subId]
            });
            yData.push({
                axisLine: {
                    show: true
                },
                type: 'value',

                axisTick: {
                    show: false
                },

                //设置网格线颜色
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#999999'],
                        width: 0.5,
                        type: 'solid'
                    }
                }
            });
        });
        xData.push({
            axisLine: {
                show: true // 不显示坐标轴线
            },

            type: 'category',

            //设置网格线颜色
            splitLine: {
                show: true,
                lineStyle: {
                    color: ['#999999'],
                    width: 0.5,
                    type: 'solid'
                }
            },
            axisTick: {
                show: false
            },

            data: formatDates
        });
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legends
            },
            grid: { left: '12%', top: '12%', width: '82%', height: '78%' },

            xAxis: xData,
            yAxis: yData,

            series: series
        };
        return option;
    };
    getSandianOption = (item, idx) => {
        //使用其它排放口烟气代替本排放口烟气
        //同一现场借用其他合格监测设备数据
        //引用错误、虚假的原始信号值
        let dataAll = [];
        let markLineOpt = [];
        let datas1 = SentencedToEmpty(item, ['data', 0, 'data'], []);
        let datas2 = SentencedToEmpty(item, ['data', 1, 'data'], []);
        datas1.map((subI, subId) => {
            dataAll.push([subI, datas2[subId]]);
        });
        markLineOpt = {
            animation: false,
            label: {
                formatter: 'R² = ' + SentencedToEmpty(item, ['linear'], ''),
                align: 'right'
            },
            lineStyle: {
                type: 'solid'
            },
            tooltip: {
                formatter: 'R² = ' + SentencedToEmpty(item, ['linear'], '')
            },
            data: [
                [
                    {
                        coord: item.startPoint,
                        symbol: 'none'
                    },
                    {
                        coord: item.endPoint,
                        symbol: 'none'
                    }
                ]
            ]
        };

        let option = {
            grid: [{ left: '12%', top: '12%', width: '82%', height: '73%' }],
            tooltip: {
                formatter: '{a}<br />({c})'
            },
            xAxis: {
                min: item.startPoint[0],
                max: item.endPoint[0]
            },
            yAxis: {
                min: item.startPoint[1],
                max: item.endPoint[1]
            },
            series: [
                {
                    type: 'scatter',
                    name:
                        SentencedToEmpty(item, ['data', 0, 'pollutantName'], '') != ''
                            ? SentencedToEmpty(item, ['data', 0, 'pollutantName'], '') + ',' + SentencedToEmpty(item, ['data', 1, 'pollutantName'], '')
                            : SentencedToEmpty(item, ['data', 0, 'PointName'], '') + ',' + SentencedToEmpty(item, ['data', 1, 'PointName'], ''),
                    data: dataAll,
                    markLine: markLineOpt
                }
            ]
        };
        return option;
    };

    getOption = (item, idx) => {
        let self = this;
        const PollutantArr = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'PollutantList'], []);
        // prettier-ignore
        const ChartArr = SentencedToEmpty(this.props.AlarmDataChartValue, ['data', 'Datas',], []);
        // prettier-ignore
        const PollutanStArr = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'PollutantList'], []);
        let markLineArr = [];
        let xAxisArr = [];
        let yAxisArr = [];
        let seriesArr = [];
        let PollutantNameArr = [];
        let showColors = [];
        let markAreaArr = []; //停运区域
        let subMarkArea = [];
        let markAreaArr2 = []; //停炉区域
        let ModelWCSubMarkArea = [];
        let markAreaArr3 = []; //启炉区域
        let ModelWCSubMarkStartArea = [];

        let markPointArr = []; //人为干预点
        let markPointArr2 = []; //设备故障点
        let markPointArr3 = []; //运行管理异常点
        let markPointArr4 = []; //数据现象异常
        let markPointArr5 = []; //数据上传标记

        if (SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'EndTime'], '') == SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'BeginTime'], '')) {
            markLineArr.push({ name: '报警', xAxis: moment(SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'BeginTime'], '')).format('YYYY-MM-DD HH:mm') });
        } else {
            markLineArr.push({ name: '开始', xAxis: moment(SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'BeginTime'], '')).format('YYYY-MM-DD HH:mm') });

            markLineArr.push({ name: '结束', xAxis: moment(SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'EndTime'], '')).format('YYYY-MM-DD HH:mm') });
        }

        ChartArr.map(function (item) {
            if (item.WCArtificialFlag != '' || item.QHArtificialFlag != '') {
                markPointArr.push({ name: '人为干预', xAxis: item['MonitorTime'], yAxis: 0.1 });
            }
            if (item.WCFaultFlag != '' || item.QHFaultFlag != '') {
                markPointArr2.push({ name: '设备故障', xAxis: item['MonitorTime'], yAxis: 0.2 });
            }
            if (item.WCOperationFlag != '' || item.QHOperationFlag != '') {
                markPointArr3.push({ name: '运行管理异常', xAxis: item['MonitorTime'], yAxis: 0.3 });
            }

            if (item.WCShortDataExcept != '') {
                markPointArr4.push({ name: '数据现象异常', xAxis: item['MonitorTime'], yAxis: 0.4 });
            }
            if (item.WCPollutantFlag != '') {
                markPointArr5.push({ name: '数据上传标记', xAxis: item['MonitorTime'], yAxis: 0.5 });
            }
            if (subMarkArea.length < 2) {
                if (item['WorkCon'] == '停运') {
                    if (subMarkArea.length == 0) {
                        subMarkArea.push({
                            name: '停运',
                            xAxis: item['MonitorTime']
                        });
                    }
                } else {
                    if (subMarkArea.length > 0) {
                        subMarkArea.push({
                            name: '停运',
                            xAxis: item['MonitorTime']
                        });
                    }
                }
            } else {
                markAreaArr.push(subMarkArea);
                subMarkArea = [];
            }

            if (ModelWCSubMarkArea.length < 2) {
                if (item['ModelWCFlag'] == '停炉' || item['ModelQHFlag'] == '停炉') {
                    if (ModelWCSubMarkArea.length == 0) {
                        ModelWCSubMarkArea.push({
                            name: '停炉',
                            xAxis: item['MonitorTime']
                        });
                    }
                } else {
                    if (ModelWCSubMarkArea.length > 0) {
                        ModelWCSubMarkArea.push({
                            name: '停炉',
                            xAxis: item['MonitorTime']
                        });
                    }
                }
            } else {
                markAreaArr2.push(ModelWCSubMarkArea);
                ModelWCSubMarkArea = [];
            }
            if (ModelWCSubMarkStartArea.length < 2) {
                if (item['ModelWCFlag'] == '启炉' || item['ModelQHFlag'] == '启炉') {
                    if (ModelWCSubMarkStartArea.length == 0) {
                        ModelWCSubMarkStartArea.push({
                            name: '启炉',
                            xAxis: item['MonitorTime']
                        });
                    }
                } else {
                    if (ModelWCSubMarkStartArea.length > 0) {
                        ModelWCSubMarkStartArea.push({
                            name: '启炉',
                            xAxis: item['MonitorTime']
                        });
                    }
                }
            } else {
                markAreaArr3.push(ModelWCSubMarkStartArea);
                ModelWCSubMarkStartArea = [];
            }
            xAxisArr.push(item['MonitorTime']);
        });

        PollutantArr.map(function (item, idx) {
            let selectIndex = PollutanStArr.findIndex(subI => {
                if (subI.PollutantName == item.PollutantName) return true;
            });
            if (selectIndex < 0) {
            } else {
                showColors.push(self.state.colors[selectIndex]);
                yAxisArr.push({
                    type: 'value',
                    offset: selectIndex <= 2 ? selectIndex * 50 : (selectIndex - 3) * 50,
                    name: item.PollutantName,
                    alignTicks: true,
                    position: selectIndex <= 2 ? 'left' : 'right',
                    axisLine: {
                        show: true
                    }
                });

                let data = [];
                ChartArr.map(function (subitem) {
                    data.push({
                        WCShortDataExcept: subitem['WCShortDataExcept'],
                        WCPollutantFlag: subitem['WCPollutantFlag'],
                        WCOperationFlag: subitem['WCOperationFlag'],
                        WCArtificialFlag: subitem['WCArtificialFlag'],
                        WCFaultFlag: subitem['WCFaultFlag'],
                        value: subitem[item.PollutantCode],
                        workingFlagName: subitem['WorkCon'],
                        dataFlagName: subitem[item.PollutantCode + '_Flag'] || '-',
                        unit: '8'
                    });
                });
                PollutantNameArr.push(item.PollutantName);
                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',
                    data: data,
                    yAxisIndex: selectIndex,
                    markLine: {
                        label: {
                            formatter: params => {
                                return params.name;
                            }
                        },
                        lineStyle: {
                            color: 'red'
                        },
                        data: markLineArr
                    },
                    markArea: {
                        label: {
                            color: 'rgba(228, 223, 223, 1)',
                            formatter: params => {
                                return params.name;
                            }
                        },
                        itemStyle: {
                            color: '#e5e7eb'
                        },
                        data: markAreaArr
                    }
                });

                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markArea: {
                        label: {
                            color: 'rgba(228, 223, 223, 1)',
                            formatter: params => {
                                return params.name;
                            }
                        },
                        itemStyle: {
                            color: '#fbcfe8'
                        },
                        data: markAreaArr2
                    }
                });
                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markArea: {
                        label: {
                            color: 'rgba(228, 223, 223, 1)',
                            formatter: params => {
                                return params.name;
                            }
                        },
                        itemStyle: {
                            color: '#bae6fd'
                        },
                        data: markAreaArr3
                    }
                });

                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#c026d3'
                        },
                        data: markPointArr
                    }
                });

                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#e11d48'
                        },
                        data: markPointArr2
                    }
                });

                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#faad14'
                        },
                        data: markPointArr3
                    }
                });
                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#e879f9'
                        },
                        data: markPointArr4
                    }
                });
                seriesArr.push({
                    name: item.PollutantName,
                    type: 'line',

                    markPoint: {
                        symbol: 'circle',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#4AA9FF'
                        },
                        data: markPointArr5
                    }
                });
            }
        });

        let option = {
            tooltip: {
                position: function (point, params, dom, rect, size) {
                    // 固定在顶部
                    return [point[0], '8%'];
                },
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function (params) {
                    var htmlStr = '<div style="height: auto;display: flex;flex-direction: column;justify-content:space-between;align-items:flex-start;"><span style="color: #fff;">' + params[0].axisValue + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'工况：'}${params[0].data.workingFlagName}` + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'人为干预：'}${params[0].data.WCArtificialFlag}` + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'故障原因：'}${params[0].data.WCFaultFlag}` + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'运行管理异常：'}${params[0].data.WCOperationFlag}` + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'数据现象异常：'}${params[0].data.WCShortDataExcept}` + '</span>';
                    htmlStr += '<span style="color: #fff;">' + `${'数据上传标记：'}${params[0].data.WCPollutantFlag}` + '</span>';
                    for (var i = 0; i < params.length; i++) {
                        htmlStr += '<span style="color: #fff;">' + params[i].marker + params[i].seriesName + ':' + params[i].value + '(' + params[i].data.dataFlagName + ')' + '</span>';
                    }
                    htmlStr += '</div>';
                    return htmlStr;
                }
            },
            grid: {
                top: 30,
                bottom: 30,
                left: 23,
                right: 13
            },

            xAxis: {
                data: xAxisArr
            },

            dataZoom: [
                {
                    id: 'dataZoomX',
                    type: 'inside',
                    filterMode: 'empty'
                }
            ],
            color: showColors,
            yAxis: yAxisArr,
            axisSame: true, // 让y轴格数一致
            series: seriesArr
        };

        return option;
    };
    renderTable() {
        let views = [];

        let rtnFinal = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'rtnFinal'], []);
        if (rtnFinal.length > 0) {
            rtnFinal.map(rtnItem => {
                let rtnViews = [];
                let titleArr = [{ PollutantName: '时间', PollutantCode: 'Time' }, ...SentencedToEmpty(rtnItem, ['Column'], [])];
                let Data = SentencedToEmpty(rtnItem, ['Data'], []);
                let titleColumnViews = [];
                titleArr.map((item, idx) => {
                    if (item.PollutantCode == 'Error' || item.PollutantCode == '基准氧含量' || item.PollutantCode == '备案基准氧含量') {
                    } else {
                        rtnViews.push(
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <View style={{ backgroundColor: '#F3F3F3', height: 1, marginBottom: 10, marginTop: 10, width: '100%' }}></View>

                                <View style={{ flexDirection: 'row', flexWrap: 'nowrap', minHeight: 40, alignItems: 'center' }}>
                                    {Data.map(subI => {
                                        return <Text style={[styles.content, { color: '#666', fontSize: 15, width: 100, textAlign: 'center' }]}>{subI[item.PollutantCode]}</Text>;
                                    })}
                                </View>
                            </View>
                        );
                        titleColumnViews.push(
                            <View style={{ alignItems: 'center', marginTop: 10, minHeight: 61 }}>
                                <View style={{ backgroundColor: '#F3F3F3', height: 1, marginBottom: 10, marginTop: 10, width: '100%' }}></View>

                                <Text style={[styles.content, { color: '#333', fontSize: 15, textAlign: 'center', width: 100 }]}>{item.PollutantName}</Text>
                            </View>
                        );
                    }
                });
                views.push(
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{titleColumnViews}</View>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{rtnViews}</View>
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: '#ADDBFF', width: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {titleArr.map(item => {
                                    {
                                        return item.PollutantCode == 'Error' || item.PollutantCode == '基准氧含量' || item.PollutantCode == '备案基准氧含量' ? (
                                            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                                <Text style={{ fontSize: 17, color: '#333', fontWeight: 'bold' }}>{item.PollutantName}</Text>
                                                <Text style={{ fontSize: 13, color: '#333', marginTop: 10 }}>{Data[0][item.PollutantCode]}</Text>
                                            </View>
                                        ) : null;
                                    }
                                })}
                            </View>
                        </View>
                    </View>
                );
            });
        } else {
            let titleArr = [{ PollutantName: '时间', PollutantCode: 'Time' }, ...SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'Column'], [])];
            let Data = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'Data'], []);
            titleArr.map((item, idx) => {
                views.push(
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ backgroundColor: '#F3F3F3', height: 1, width: '100%', marginBottom: 10, marginTop: 10 }}></View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
                            <Text style={[styles.content, { color: '#333', fontSize: 15, width: '38%', textAlign: 'center' }]}>{item.PollutantName}</Text>

                            {item.PollutantCode == 'Error' ? (
                                <Text style={[styles.content, { color: 'red', fontSize: 17, width: '60%', textAlign: 'center' }]}>{Data[0][item.PollutantCode]}</Text>
                            ) : (
                                Data.map(subI => {
                                    return <Text style={[styles.content, { color: '#666', fontSize: 15, width: Data.length > 1 ? '30%' : '60%', textAlign: 'center' }]}>{subI[item.PollutantCode]}</Text>;
                                })
                            )}
                        </View>
                    </View>
                );
            });
        }

        return views;
    }

    renderChart() {
        let views = [];
        let chartData = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas']);
        if (chartData && chartData.BeginTime && chartData.EndTime) {
            return (
                <View style={{ height: 300, backgroundColor: '#ffffff', marginTop: 20 }}>
                    <Echarts option={this.getOption()} height={260} flex={1} />
                    <View style={{ flexDirection: 'row' }}>
                        <Text>图例：</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 5 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#c026d3', borderRadius: 5 }}></View>
                                <Text style={{ color: '#666', fontSize: 12, marginLeft: 3 }}>人为干预</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 15 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#e11d48', borderRadius: 5 }}></View>
                                <Text style={{ color: '#666', fontSize: 12, marginLeft: 3 }}>设备故障</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 15 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#faad14', borderRadius: 5 }}></View>
                                <Text style={{ color: '#666', fontSize: 12, marginLeft: 3 }}>运行管理异常</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 15 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#e879f9', borderRadius: 5 }}></View>
                                <Text style={{ color: '#666', fontSize: 12, marginLeft: 3 }}>数据现象异常</Text>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 15 }}>
                                <View style={{ width: 10, height: 10, backgroundColor: '#4AA9FF', borderRadius: 5 }}></View>
                                <Text style={{ color: '#666', fontSize: 12, marginLeft: 3 }}>数据上传标记</Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        } else if (chartData && chartData[0].chartData) {
            SentencedToEmpty(chartData, [0, 'chartData'], []).map((item, idx) => {
                {
                    views.push(
                        <View style={{ marginTop: 10 }}>
                            <Text style={[styles.content, { color: '#333', fontSize: 15 }]}>{item.title}</Text>
                            <View style={{ height: 180, backgroundColor: '#ffffff' }}>
                                <Echarts option={this.getSandianOption(item, idx)} height={180} flex={1} />
                            </View>
                            <View style={{ height: 180, backgroundColor: '#ffffff', marginTop: 10 }}>
                                <Echarts option={this.getTrendOption(item, idx)} height={180} flex={1} />
                            </View>
                        </View>
                    );
                }
            });
        }

        return views;
    }

    render() {
        var options = {
            hiddenTitle: true,
            innersHeight: 420
        };
        let data = SentencedToEmpty(this.props.alarmDetailInfo, ['data', 'Datas'], {});
        let chartData = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas'], {});
        let showChart = true;
        if (chartData.rtnFinal) {
            showChart = false;
        }
        return (
            <StatusPage
                status={this.props.alarmDetailInfo.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.statusPageOnRefresh();
                }}
            >
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH, padding: 13 }}>
                    <View style={[styles.card]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                                <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                    线索信息
                                </SDLText>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    if (Platform.OS == 'ios') {
                                        Alert.alert('提示', '请选择数据类型', alertContent);
                                    } else {
                                        this.refs.doAlert3.show();
                                    }
                                }}
                                style={{ backgroundColor: '#4AA0FF', width: 100, height: 40, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <SDLText fontType={'large'} style={{ color: '#fff' }}>
                                    线索数据
                                </SDLText>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>场景类型：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['WarningTypeName'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>发现时间：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['WarningTime'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>企业：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['EntNmae'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>排放口：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['PointName'], '-')}`}</SDLText>
                        </View>

                        <View style={[styles.oneRow, { paddingRight: 23 }]}>
                            <SDLText style={[styles.label]}>线索内容：</SDLText>
                            <SDLText style={[styles.content, { flex: 1 }]}>{`${SentencedToEmpty(data, ['WarningContent'], '暂未填写')}`}</SDLText>
                        </View>
                    </View>
                    <View style={[styles.card, { marginTop: 13, marginBottom: 20 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                线索特征
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <SDLText
                            textBreakStrategy="simple"
                            style={[{ fontFamily: '', width: SCREEN_WIDTH - 54, marginTop: 10, color: globalcolor.recordde, fontSize: 15, lineHeight: 21 }]}>{`${SentencedToEmpty(chartData, ['describe'], '')} `}</SDLText>

                        {showChart == true ? this.renderChart() : this.renderTable()}
                    </View>
                    <View style={{ flex: 1, height: 100 }}></View>
                </KeyboardAwareScrollView>
                <AlertDialog components={<MyView />} options={options} ref="doAlert3" />
            </StatusPage>
        );
    }
}
class MyView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                {alertContent.map((item, index) => {
                    return (
                        <TouchableOpacity onPress={item.onPress} style={{ padding: 18, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text key={index} style={{ color: 'rgba(0,111,255,1)', fontSize: 18, marginLeft: 10 }}>
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    },
    oneRow: {
        width: SCREEN_WIDTH - 28,
        flexDirection: 'row',
        marginVertical: 7
    },
    card: {
        paddingRight: 13,
        paddingHorizontal: 14,
        paddingVertical: 13,
        backgroundColor: 'white',
        borderRadius: 5
    },
    label: {
        width: 82,
        color: '#666666',
        fontSize: 14,
        marginRight: 5
    },
    content: {
        color: globalcolor.recordde,
        fontSize: 15,
        lineHeight: 18
    }
});

//make this component available to the app
export default ClueDetail;
