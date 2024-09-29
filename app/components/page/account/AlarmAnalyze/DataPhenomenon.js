import React, { Component } from 'react';
import { Text, View, Platform, Image, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { PickerRangeDayTouchable, StatusPage, FlatListWithHeaderAndFooter, SimplePickerRangeDay, SimplePicker } from '../../../../components';
import { Echarts, echarts } from 'react-native-secharts';
@connect(({ alarmAnaly, abnormalTask }) => ({
    PointCluePollutant: abnormalTask.PointCluePollutant,
    alarmChartData: abnormalTask.alarmChartData,
    phenomenonChart: abnormalTask.phenomenonChart
}))
export default class DataPhenomenon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionArray: [],
            selectPhenomenonType: '1', // 1：零值 2：恒值 3：陡变
            selectDGIMN: props.route.params.params.DGIMN || '',
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            selectTime: [
                moment(SentencedToEmpty(props.alarmChartData, ['data', 'Datas', 'BeginTime'], null))
                    .subtract(2, 'days')
                    .format('YYYY-MM-DD 00:00:00'),
                moment(SentencedToEmpty(props.alarmChartData, ['data', 'Datas', 'EndTime'], null))
                    .add(2, 'days')
                    .format('YYYY-MM-DD 23:59:59')
            ]
        };
    }
    componentWillUnmount() {
        this.props.navigation.setOptions({
            title: '数据现象',
          });
        this.props.route.params.params.callback();
    }
    componentDidMount() {
        this.getData();
    }
    getDataTypeSelectOption = () => {
        return {
            codeKey: 'PhenomenonType',
            nameKey: 'PhenomenonTypeName',
            placeHolder: '零值',
            dataArr: [
                {
                    PhenomenonType: '1',
                    PhenomenonTypeName: '零值'
                },
                {
                    PhenomenonType: '2',
                    PhenomenonTypeName: '恒值'
                },
                {
                    PhenomenonType: '3',
                    PhenomenonTypeName: '陡变'
                }
            ],
            defaultCode: '1',
            onSelectListener: item => {
                this.setState({ selectPhenomenonType: item.PhenomenonType }, () => {
                    this.getData();
                });
            }
        };
    };
    getData = () => {
        this.props.dispatch(
            createAction('abnormalTask/GetPollutantListByDgimn')({
                dataType: 'Phenomenon',
                PhenomenonType: this.state.selectPhenomenonType,
                DGIMNs: this.state.selectDGIMN,
                selectTime: this.state.selectTime,
                PollutantList: this.props.PointCluePollutant,
                callback: result => {
                    let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                    const PollutantArr = this.props.PointCluePollutant;
                    let colors = this.state.colors;
                    let chartArr = [];
                    PollutantArr.map((item, idx) => {
                        let xAxisData = [];
                        let yAxisData = [];
                        let upMarkArea = [];
                        let upSubMarkArea = [];
                        // let upMarkArea = [];
                        let downSubMarkArea = [];

                        for (let i = 0; i < data.length; i++) {
                            xAxisData.push(data[i]['MonitorTime']);
                            yAxisData.push(data[i][item.PollutantCode]);
                            let sItem = data[i];
                            if (this.state.selectPhenomenonType == 1) {
                                if (upSubMarkArea.length < 2) {
                                    if (sItem[`${item.PollutantCode}_ME`] == 1) {
                                        if (upSubMarkArea.length == 0) {
                                            upSubMarkArea.push({
                                                name: '零值',
                                                xAxis: sItem['MonitorTime'],
                                                itemStyle: {
                                                    color: '#fbcfe8'
                                                }
                                            });
                                        }
                                    } else {
                                        if (upSubMarkArea.length == 1) {
                                            upSubMarkArea.push({
                                                xAxis: sItem['MonitorTime']
                                            });
                                        }
                                    }
                                } else {
                                    upMarkArea.push(upSubMarkArea);
                                    upSubMarkArea = [];
                                }
                            } else if (this.state.selectPhenomenonType == 2) {
                                if (upSubMarkArea.length < 2) {
                                    if (sItem[`${item.PollutantCode}_ME`] == 1) {
                                        if (upSubMarkArea.length == 0) {
                                            upSubMarkArea.push({
                                                name: '恒值',
                                                xAxis: sItem['MonitorTime'],
                                                itemStyle: {
                                                    color: '#fbcfe8'
                                                }
                                            });
                                        }
                                    } else {
                                        if (upSubMarkArea.length == 1) {
                                            upSubMarkArea.push({
                                                xAxis: sItem['MonitorTime']
                                            });
                                        }
                                    }
                                } else {
                                    upMarkArea.push(upSubMarkArea);
                                    upSubMarkArea = [];
                                }
                            } else if (this.state.selectPhenomenonType == 3) {
                                if (downSubMarkArea.length < 2) {
                                    if (sItem[`${item.PollutantCode}_ME`] == 2) {
                                        if (downSubMarkArea.length == 0) {
                                            downSubMarkArea.push({
                                                name: '陡降',
                                                xAxis: sItem['MonitorTime'],
                                                itemStyle: {
                                                    color: '#bae6fd'
                                                }
                                            });
                                        }
                                    } else {
                                        if (downSubMarkArea.length == 1) {
                                            downSubMarkArea.push({
                                                xAxis: sItem['MonitorTime']
                                            });
                                        }
                                    }
                                } else {
                                    upMarkArea.push(downSubMarkArea);
                                    downSubMarkArea = [];
                                }
                                if (upSubMarkArea.length < 2) {
                                    if (sItem[`${item.PollutantCode}_ME`] == 1) {
                                        if (upSubMarkArea.length == 0) {
                                            upSubMarkArea.push({
                                                name: '陡升',
                                                xAxis: sItem['MonitorTime'],
                                                itemStyle: {
                                                    color: '#fbcfe8'
                                                }
                                            });
                                        }
                                    } else {
                                        if (upSubMarkArea.length == 1) {
                                            upSubMarkArea.push({
                                                xAxis: sItem['MonitorTime']
                                            });
                                        }
                                    }
                                } else {
                                    upMarkArea.push(upSubMarkArea);
                                    upSubMarkArea = [];
                                }
                            }
                        }

                        chartArr.push({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross'
                                }
                            },
                            xAxis: {
                                type: 'category',
                                data: xAxisData
                            },
                            grid: { left: '12%', top: 20, width: '82%', height: '80%' },
                            yAxis: {
                                type: 'value'
                            },
                            series: [
                                {
                                    itemStyle: {
                                        color: colors[idx % 9]
                                    },
                                    data: yAxisData,
                                    markArea: {
                                        label: {
                                            color: 'rgba(228, 223, 223, 1)',
                                            formatter: params => {
                                                return params.name;
                                            }
                                        },

                                        data: upMarkArea
                                    },
                                    type: 'line',
                                    lineStyle: {
                                        color: colors[idx % 9]
                                    },
                                    smooth: true
                                }
                            ]
                        });
                    });

                    this.setState({
                        optionArray: chartArr
                    });
                }
            })
        );
    };
    getRangeDaySelectOption = () => {
        return {
            defaultTime: this.state.selectTime[0],
            start: this.state.selectTime[0],
            end: this.state.selectTime[1],
            formatStr: 'YYYY/MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.setState({ selectDateRange: '', selectTime: [startMoment.format('YYYY-MM-DD 00:00:00'), endMoment.format('YYYY-MM-DD 23:59:59')] }, () => {
                    this.getData();
                });
            }
        };
    };
    render() {
        const PollutantArr = this.props.PointCluePollutant;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 13 }}>
                    <SimplePickerRangeDay style={[{ maxWidth: 200 }]} option={this.getRangeDaySelectOption()} />
                    <SimplePicker option={this.getDataTypeSelectOption()} style={[{ width: 120 }]} />
                </View>
                <StatusPage
                    status={this.props.phenomenonChart.status}
                    errorBtnText={'点击重试'}
                    emptyBtnText={'点击重试'}
                    onErrorPress={() => {
                        this.getData();
                    }}
                    onEmptyPress={() => {
                        this.getData();
                    }}
                >
                    <ScrollView style={[{ flex: 1, marginTop: 10 }]}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                            {PollutantArr.map((item, idx) => {
                                return (
                                    <View style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                                        <Text>{item.PollutantName}</Text>
                                        {this.state.optionArray.length > 0 && <Echarts option={this.state.optionArray[idx]} width={SCREEN_WIDTH - 30} height={260} />}
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                </StatusPage>
            </View>
        );
    }
}
