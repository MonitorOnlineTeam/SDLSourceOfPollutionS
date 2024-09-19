import React from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction } from '../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SimpleMultipleItemPicker, SDLText, StatusPage } from '../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import { getImageByType, getDataStatusByData } from '../../pollutionModels/utils';
import moment from 'moment';
import { WindTransform, isWindDirection, getWindSpeed } from '../../utils/mapconfig';
import RNEChartsPro from 'react-native-echarts-pro';

/**
 *
 *站点详情
 */
@connect(({ pointDetails, historyDataModel }) => ({
    PollantCodes: pointDetails.PollantCodes,
    chartStatus: pointDetails.chartStatus,
    selectCodeArr: pointDetails.selectCodeArr,
    selectTime: pointDetails.selectTime,

    chartOrList: historyDataModel.chartOrList,
}))
export default class HistoryDataChart extends React.Component {
    static propTypes = {};

    static defaultProps = {};
    constructor(props) {
        super(props);
        this.state = {
            chartDatas: [],
            clickDatas: [],
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            option1: {
                tooltip: {
                    trigger: 'axis',
                    show: true,
                    formatter: function (params) {
                        'show source';
                        var seen = [];
                        var paramsString = JSON.stringify(params, function (key, val) {
                            if (val != null && typeof val == 'object') {
                                if (seen.indexOf(val) >= 0) {
                                    return;
                                }
                                seen.push(val);
                            }
                            return val;
                        });
                        window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: paramsString }));
                        return null;
                    }
                },
                legend: {
                    data: [],
                    y: '20px'
                },
                grid: {
                    show: true,
                    top: 50,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        type: 'category',
                        gridIndex: 0,
                        axisTick: {
                            show: false
                        },

                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            interval: 5,
                            lineStyle: {
                                type: 'line'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999',
                                fontSize: 12
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    }
                ],
                series: []
            }
        };
    }
    getTimeSelectOption = () => {
        let type = this.props.datatype;

        return {
            formatStr: this.props.datatype == 'day' ? 'YYYY-MM-DD' : 'MM/DD HH:00',
            defaultTime: this.props.selectTime,
            type: type,
            onSureClickListener: time => {
                this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(time).format('YYYY-MM-DD HH:mm:ss') }));
                this.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
            }
        };
    };
    refreshNewOPData = (time, code) => {
        let codeStr = '';
        code.map(item => {
            codeStr = codeStr + ',' + item.PollutantCode;
        });
        this.setState({ clickDatas: [] });
        this.props.dispatch(
            createAction('pointDetails/getChartLstDatas')({
                params: {
                    datatype: this.props.datatype,
                    DGIMNs: this.props.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(time, this.props.datatype)[0],

                    endTime: this.getRequestTime(time, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: data => {
                    this.editOption(data);
                    this.setState({ chartDatas: data });
                }
            })
        );
    }
    getPointTypeOption = () => {
        let selectCodes = [];
        let dataSource = [];
        this.props.selectCodeArr.map(item => {
            selectCodes.push(item.PollutantCode);
        });
        this.props.PollantCodes.map(item => {
            if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
                return;
            }
            if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
                item.PollutantName = '综合指数';
            }
            if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
                item.PollutantName = 'AQI';
            }
            dataSource.push(item);
        });
        return {
            contentWidth: 106,
            selectName: '选择污染物',
            placeHolderStr: '污染物',
            codeKey: 'PollutantCode',
            nameKey: 'PollutantName',
            // maxNum: 3,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode, selectNameStr, selectCodeStr, selectData }) => {
                this.props.dispatch(createAction('pointDetails/updateState')({ selectCodeArr: selectData }));
                this.refreshNewOPData(this.props.selectTime, selectData);
            }
        };
    };
    onPress = e => {
        this.setState({ clickDatas: e });
    };
    componentDidMount() {
        // console.log(this.state.option1.tooltip.formatter.toString(),'11111111111111111')
        this.props.onRef(this); //将组件实例this传递给onRe
    }
    getRequestTime(time, type) {
        let beginTime;
        let endTime;
        if (type == 'hour') {
            beginTime = moment(time)
                .subtract(24, 'hours')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'day') {
            beginTime = moment(time)
                .subtract(31, 'days')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time)
                .subtract(1, 'days')
                .format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'realtime') {
            beginTime = moment(time)
                .subtract(1, 'hours')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'minute') {
            // beginTime =
            //     moment(time)
            //         .subtract(1440, 'minutes')
            //         .format('YYYY-MM-DD HH:mm:ss')
            //         .substr(0, 15) + '0:00';
            /**
             * 20240205
             * 张洪斌
             * 分钟数据减少条数，查询最近3小时
             */
            beginTime =
                moment(time)
                    .subtract(180, 'minutes')
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
            endTime =
                moment(time)
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
        } else {
            beginTime =
                moment(time)
                    .subtract(12, 'months')
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
            endTime =
                moment(time)
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
        }
        return [beginTime, endTime];
    }
    refreshData = () => {
        let codeStr = '';
        this.props.selectCodeArr.map(item => {
            codeStr = codeStr + ',' + item.PollutantCode;
        });
        this.setState({ clickDatas: [] });

        this.props.dispatch(
            createAction('pointDetails/getChartLstDatas')({
                params: {
                    datatype: this.props.datatype,
                    DGIMNs: this.props.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[0],

                    endTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: data => {
                    this.setState({ chartDatas: data });
                    this.editOption(data);
                }
            })
        );
    }
    editOption = datas => {
        let colors = ['#88ff2b', '#13cfe8', '#ffdc00'];
        let xData = [];
        let seriesData = [];
        let useSeries = [];
        let legendNames = [];
        this.props.selectCodeArr.map(item => {
            if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
                item.PollutantName = '综合指数';
            }
            if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
                return;
            }
            if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
                item.PollutantName = 'AQI';
            }
            legendNames.push(item.PollutantName);
        });
        for (let i = 0; i < this.props.selectCodeArr.length; i++) {
            seriesData.push([]);
        }
        datas.map(item => {
            if (this.props.datatype == 'day') {
                xData.push(moment(item.MonitorTime).format('YY/MM/DD'));
            } else if (this.props.datatype == 'realtime') {
                xData.push(
                    moment(item.MonitorTime)
                        .format('HH:mm:ss MM/DD')
                        .replace(' ', '\\nn')
                );
            } else if (this.props.datatype == 'month') {
                xData.push(moment(item.MonitorTime).format('YYYY-MM'));
            } else {
                xData.push(
                    moment(item.MonitorTime)
                        .format('HH:mm MM/DD')
                        .replace(' ', '\\nn')
                );
            }

            for (let i = 0; i < this.props.selectCodeArr.length; i++) {
                if (item[this.props.selectCodeArr[i].PollutantCode] && typeof item[this.props.selectCodeArr[i].PollutantCode] != 'undefined') {
                    seriesData[i].push(item[this.props.selectCodeArr[i].PollutantCode]);
                } else {
                    seriesData[i].push('-');
                }
            }
        });
        for (let i = 0; i < this.props.selectCodeArr.length; i++) {
            useSeries.push({
                name: this.props.selectCodeArr[i].PollutantName,
                showSymbol: false,
                type: 'line',
                itemStyle: {
                    normal: {
                        color: colors[i]
                    }
                },
                data: seriesData[i]
            });
        }
        this.setState({
            option1: {
                ...this.state.option1,
                legend: {
                    y: '10px',
                    data: legendNames,
                    type: 'scroll',
                    selectedMode: false
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        type: 'category',
                        gridIndex: 0,
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999',
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        },
                        data: xData
                    }
                ],
                series: useSeries
            }
        });
    };

    getSignInTypeCode = () => {
        const datatype = this.props.datatype;
        if (datatype == 'hour') {
            return 0;
        } else if (datatype == 'day') {
            return 1;
        } else if (datatype == 'realtime') {
            return 2;
        } else if (datatype == 'minute') {
            return 3;
        }
    }

    render() {
        // return <View><Text>historyDataChart</Text></View>
        return (
            <StatusPage
                style={{ flex: 1, width: SCREEN_WIDTH }}
                status={this.props.chartStatus.status}
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
                {this.props.chartStatus.status == 200 ? (
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                height: 50,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                alignItems: 'center'
                            }}
                        >
                            {this.props.datatype == 'month' ? <SDLText style={{ marginLeft: 15 }}>最近12个月</SDLText> : <SimplePickerSingleTime style={{ width: 120 }} option={this.getTimeSelectOption()} />}

                            <SimpleMultipleItemPicker
                                ref={ref => {
                                    this.simpleMultipleItemPicker = ref;
                                }}
                                option={this.getPointTypeOption()}
                                style={[{ width: 150 }]}
                            />
                            <TouchableOpacity
                                style={{ marginHorizontal: 8 }}
                                onPress={() => {
                                    this.props.dispatch(createAction('historyDataModel/updateState')({
                                        datatype: this.props.datatype,
                                        signInType: this.getSignInTypeCode()
                                    }));
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'HistoryDataLandscape',
                                        params: {
                                            datatype: this.props.datatype,
                                            pageState: this.state,
                                            dgimn: this.props.dgimn,
                                            setRightButtonState: this.props.setRightButtonState,
                                            goToPage: this.props.goToPage,
                                        },
                                    }));
                                }}
                            >
                                <View
                                    style={{ width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Image
                                        style={{ width: 32, height: 32 }}
                                        source={
                                            require('../../images/ic_full_screen.png')
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', height: 250, width: SCREEN_WIDTH, marginTop: 10 }}>
                            {/* <Echarts option={this.state.option1} height={250} onPress={this.onPress} width={SCREEN_WIDTH} /> */}
                            <RNEChartsPro width={SCREEN_WIDTH} height={250} option={this.state.option1} onPress={this.onPress} />
                        </View>
                        <ScrollView
                            style={{
                                width: SCREEN_WIDTH,
                                marginTop: 10,
                                flex: 1,
                                backgroundColor: '#fff'
                            }}
                        >
                            <View style={{ width: SCREEN_WIDTH - 16, marginLeft: 13, flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.props.selectCodeArr.map((item, key) => {
                                    if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
                                        return null;
                                    } else if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
                                        item.PollutantName = '综合指数';
                                    } else if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
                                        item.PollutantName = 'AQI';
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={`a${key}`}
                                            onPress={() => { }}
                                            style={{
                                                borderRadius: 3,
                                                marginBottom: 5,
                                                marginHorizontal: 5,
                                                width: (SCREEN_WIDTH - 46) / 3,
                                                height: 74,
                                                backgroundColor: '#DEEEFF',
                                                justifyContent: 'center',

                                                marginTop: 10
                                            }}
                                        >
                                            <View style={[{ justifyContent: 'center', marginLeft: 5 }]}>
                                                {this.state.clickDatas.length > 0 &&
                                                    this.state.chartDatas[this.state.clickDatas[0].dataIndex][item.PollutantCode + '_params'] != undefined &&
                                                    this.state.chartDatas[this.state.clickDatas[0].dataIndex][item.PollutantCode + '_params'].split('§')[0] == 0 ? (
                                                        <View
                                                            style={{
                                                                borderTopLeftRadius: 13,
                                                                borderTopRightRadius: 10,
                                                                borderBottomRightRadius: 10,

                                                                backgroundColor: getDataStatusByData(this.state.chartDatas[this.state.clickDatas[0].dataIndex], item.PollutantCode).color,
                                                                width: 28,
                                                                height: 20,
                                                                position: 'absolute',
                                                                right: 2,
                                                                top: -8,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Text style={{ fontSize: 10, color: '#fff' }}>超标</Text>
                                                        </View>
                                                    ) : this.state.clickDatas.length > 0 &&
                                                        this.state.chartDatas[this.state.clickDatas[0].dataIndex][item.PollutantCode + '_params'] != undefined &&
                                                        this.state.chartDatas[this.state.clickDatas[0].dataIndex][item.PollutantCode + '_params'].split('§')[0] == 1 ? (
                                                            <View
                                                                style={{
                                                                    borderTopLeftRadius: 13,
                                                                    borderTopRightRadius: 10,
                                                                    borderBottomRightRadius: 10,
                                                                    backgroundColor: getDataStatusByData(this.state.chartDatas[this.state.clickDatas[0].dataIndex], item.PollutantCode).color,
                                                                    width: 28,
                                                                    height: 20,
                                                                    position: 'absolute',
                                                                    right: 2,
                                                                    top: -8,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <Text style={{ fontSize: 10, color: '#fff' }}>异常</Text>
                                                            </View>
                                                        ) : null}
                                                <SDLText>{item.PollutantName}</SDLText>
                                                <SDLText fontType={'small'} style={[{ marginTop: 6 }]}>
                                                    {this.state.clickDatas.length > 0 ? this.state.clickDatas[0].axisValue.replace('\n', ' ') : '---'}
                                                </SDLText>

                                                <SDLText fontType={'small'} style={[{ marginTop: 6 }]}>
                                                    {this.state.clickDatas.length > 0 && this.state.clickDatas[key] && (this.state.clickDatas[key].value || this.state.clickDatas[key].value === 0)
                                                        ? isWindDirection(item.PollutantCode)
                                                            ? WindTransform(this.state.clickDatas[key].value, this.state.chartDatas[this.state.clickDatas[0].dataIndex][getWindSpeed()])
                                                            : this.state.clickDatas[key].value + (this.props.datatype == 'realtime' && item.PollutantCode == 'b02' ? 'm³/s' : item.Unit)
                                                        : '---'}
                                                </SDLText>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ) : null
                }
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({});
