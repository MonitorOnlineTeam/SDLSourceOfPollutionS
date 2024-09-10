import React from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, ShowToast } from '../../../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SDLText, StatusPage, SimplePickerRangeDay, SimplePicker } from '../../../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import moment from 'moment';
import { lockToLandscapeLeft, lockToLandscapeRight, lockToPortrait } from 'react-native-orientation';
import globalcolor from '../../../../config/globalcolor';
/**
 *
 *图表数据
 */
@connect(({ abnormalTask }) => ({
    AlarmDataChartValue: abnormalTask.AlarmDataChartValue,
    PointSelectCluePollutant: abnormalTask.PointSelectCluePollutant,
    PointCluePollutant: abnormalTask.PointCluePollutant,
    alarmChartData: abnormalTask.alarmChartData
}))
export default class AlarmDataChart extends React.Component {
    static navigationOptions = {
        header: null
    };
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        console.log('数据列表2.0');
        this.state = {
            selectDGIMN: props.navigation.state.params.DGIMN || '',
            hideEchart: false,
            selectDateRange: '两周',
            colors: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
            selectTime: [
                moment(SentencedToEmpty(props.alarmChartData, ['data', 'Datas', 'BeginTime'], null))
                    .subtract(2, 'days')
                    .format('YYYY-MM-DD 00:00:00'),
                moment(SentencedToEmpty(props.alarmChartData, ['data', 'Datas', 'EndTime'], null))
                    .add(2, 'days')
                    .format('YYYY-MM-DD 23:59:59')
            ],
            option1: {}
        };

        this.echart1 = React.createRef();
    }

    componentDidMount() {
        this.refreshData();
        if (Platform.OS == 'ios') {
            lockToLandscapeRight();
        } else {
            lockToLandscapeLeft();
        }
    }

    componentWillUnmount() {
        lockToPortrait();
    }

    refreshData() {
        this.props.dispatch(
            createAction(`abnormalTask/GetPollutantListByDgimn`)({
                DGIMNs: this.state.selectDGIMN,
                selectTime: this.state.selectTime,
                PollutantList: this.props.PointCluePollutant,
                callback: data => {
                    this.setState({
                        option1: this.getLinearCoefficientOption()
                    });
                }
            })
        );
    }
    getDataTypeSelectOption = () => {
        let PointArr = SentencedToEmpty(this.props.alarmChartData, ['data', 'Datas', 'chartData', 0, 'data'], []);
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            placeHolder: this.props.navigation.state.params.PointName,
            dataArr: PointArr.length > 0 && PointArr[0].DGIMN ? PointArr : [{ PointName: this.props.navigation.state.params.PointName, DGIMN: this.props.navigation.state.params.DGIMN }],
            defaultCode: '',
            onSelectListener: item => {
                this.setState({ selectDGIMN: item.DGIMN }, () => {
                    this.refreshData();
                });
            }
        };
    };
    getLinearCoefficientOption = () => {
        let self = this;
        const PollutantArr = this.props.PointCluePollutant;
        // prettier-ignore
        const ChartArr = SentencedToEmpty(this.props.AlarmDataChartValue, ['data', 'Datas',], []);
        // prettier-ignore
        const PollutanStArr = this.props.PointSelectCluePollutant;
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
                if (item['WorkCon'] == '停运' || item['ModelWCFlag'] == '停运') {
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
                top: Platform.OS == 'android' ? '13%' : '11%',
                bottom: '10%',
                left: '21%',
                right: '21%'
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
    getRangeDaySelectOption = () => {
        return {
            defaultTime: this.state.selectTime[0],
            start: this.state.selectTime[0],
            end: this.state.selectTime[1],
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.setState({ selectDateRange: '', selectTime: [startMoment.format('YYYY-MM-DD 00:00:00'), endMoment.format('YYYY-MM-DD 23:59:59')] }, () => {
                    this.refreshData();
                });
            }
        };
    };
    render() {
        let self = this;

        return (
            <View style={{ flex: 1 }}>
                <StatusPage
                    style={{ flex: 1 }}
                    errorPaddingTop={50}
                    emptyPaddingTop={50}
                    status={this.props.AlarmDataChartValue.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.refreshData();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.refreshData();
                    }}
                >
                    {this.props.AlarmDataChartValue.status == 200 ? (
                        <View style={{ flex: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', paddingRight: 100, alignItems: 'center' }}>
                                {this.props.PointCluePollutant.map((item, idx) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                let nowSelect = this.props.PointSelectCluePollutant;

                                                if (
                                                    nowSelect.findIndex(subI => {
                                                        if (subI.PollutantName == item.PollutantName) return true;
                                                    }) < 0
                                                ) {
                                                    if (nowSelect.length >= 6) {
                                                        ShowToast('同时最多支持选择6种因子');
                                                        return;
                                                    } else {
                                                        nowSelect.push(item);
                                                    }
                                                } else {
                                                    nowSelect.splice(
                                                        this.props.PointSelectCluePollutant.findIndex(subI => {
                                                            if (subI.PollutantName == item.PollutantName) return true;
                                                        }),
                                                        1
                                                    );
                                                }
                                                self.setState({ hideEchart: true }, () => {
                                                    let newOP = self.getLinearCoefficientOption();
                                                    self.setState({ option1: newOP, hideEchart: false });
                                                });
                                            }}
                                            style={{
                                                backgroundColor:
                                                    this.props.PointSelectCluePollutant.findIndex(subI => {
                                                        if (subI.PollutantName == item.PollutantName) return true;
                                                    }) < 0
                                                        ? '#ccc'
                                                        : this.state.colors[
                                                        this.props.PointSelectCluePollutant.findIndex(subI => {
                                                            if (subI.PollutantName == item.PollutantName) return true;
                                                        })
                                                        ],
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 5,
                                                marginTop: 5,
                                                marginLeft: 5
                                            }}
                                        >
                                            <Text style={{ color: '#fff' }}>{item.PollutantName}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                                {/* <View style={[{ flex: 1, flexDirection: 'row-reverse' }]}>
                                    <SimplePicker option={this.getDataTypeSelectOption()} style={[{ width: 150 }]} />
                                </View> */}
                            </View>
                            <View style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                {this.state.hideEchart == false ? <Echarts option={self.state.option1} width={SCREEN_HEIGHT} height={SCREEN_WIDTH - 140} onPress={this.onPress} /> : null}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', paddingRight: 100, alignItems: 'center' }}>
                                <Text>时间选择:</Text>

                                <SimplePickerRangeDay style={[{ width: 120, marginLeft: 15 }]} option={this.getRangeDaySelectOption()} />
                                <SimplePicker option={this.getDataTypeSelectOption()} style={[{ width: 120, marginLeft: 15 }]} />
                                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                                    <Text>图例：</Text>
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
                    ) : null}
                </StatusPage>
                <TouchableOpacity
                    style={{ position: 'absolute', right: 0, top: 0, width: 48, height: 48, borderRadius: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: globalcolor.headerBackgroundColor }}
                    onPress={() => {
                        lockToPortrait();
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <SDLText style={{ color: '#fff' }}>返回</SDLText>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({});
