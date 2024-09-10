import { StatusBar, Text, TouchableOpacity, View, Image, ScrollView, Platform } from 'react-native';
import React, { Component } from 'react';
import { lockToPortrait, lockToLandscape } from 'react-native-orientation';
import { SCREEN_WIDTH, WINDOW_HEIGHT } from '../../config/globalsize';
import { Echarts } from 'react-native-secharts';
import { NavigationActions, SentencedToEmpty, createAction } from '../../utils';
import SimpleLandscapeMultipleItemPicker from '../../components/LandscapeComponents/SimpleLandscapeMultipleItemPicker';
import { SDLText, SimplePickerSingleTime, StatusPage } from '../../components';
import { connect } from 'react-redux';
import { getDataStatusByData } from '../../pollutionModels/utils';
import { WindTransform, isWindDirection } from '../../utils/mapconfig';
import moment from 'moment';
import globalcolor from '../../config/globalcolor';

@connect(
    ({ pointDetails, app, historyDataModel }) => ({
        PollantCodes: pointDetails.PollantCodes,
        chartStatus: pointDetails.chartStatus,
        selectCodeArr: pointDetails.selectCodeArr,
        selectTime: pointDetails.selectTime,
        screenOrientation: app.screenOrientation, // 数据查询 屏幕方向

        chartOrList: historyDataModel.chartOrList,
        datatype: historyDataModel.datatype
    }),
    null,
    null,
    { withRef: true }
)
export default class HistoryDataLandscapeChart extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        // const pageState = SentencedToEmpty(props, ['navigation', 'state', 'params', 'pageState'], {})
        const pageState = this.props.pageState;
        this.state = {
            height: SCREEN_WIDTH,
            width: WINDOW_HEIGHT,
            chartDatas: [],
            signInType: this.getSignInTypeCode(),
            // datatype: this.props.navigation.state.params.datatype,
            datatype: this.props.datatype,
            option1: {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        var relVal = params[0].name;

                        for (var i = 0; i < params.length; i++) {
                            var v = params[i].value;
                            if (typeof v == 'undefined') {
                                v = '--';
                            } //默认值
                            if (params[i].data) {
                                if (params[i].data.unit) v = '' + v + params[i].data.unit;
                                if (params[i].data.direction) v = '' + v + params[i].data.direction;
                            }
                            relVal +=
                                '<div class="circle" style= "font-size: 0.7rem;display:none;margin-top:-4px"><span style="background-color:' +
                                params[i].color +
                                ';display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;"></span>' +
                                params[i].seriesName +
                                ' : ' +
                                v +
                                '</div>';
                        }
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
                            //坐标轴在 grid 区域中的分隔线。
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
            },
            ...pageState
        };
    }

    componentDidMount() {
        lockToLandscape();
    }

    // componentWillUnmount() {
    //     lockToPortrait();
    //     console.log(this.props)
    //     // const setRightButtonState = SentencedToEmpty(this.props
    //     //     , ['navigation', 'state', 'params', 'setRightButtonState']
    //     //     , () => { })
    //     // const goToPage = SentencedToEmpty(this.props
    //     //     , ['navigation', 'state', 'params', 'goToPage']
    //     //     , () => { })
    //     const setRightButtonState = SentencedToEmpty(this.props
    //         , ['setRightButtonState']
    //         , () => { })
    //     const goToPage = SentencedToEmpty(this.props
    //         , ['goToPage']
    //         , () => { })
    //     setRightButtonState(this.props.chartOrList);
    //     goToPage({
    //         signInType: this.state.signInType,
    //         datatype: this.state.datatype
    //     });
    // }

    getSignInTypeCode = () => {
        // const datatype = this.props.navigation.state.params.datatype;
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
    };

    onPress = e => {
        this.setState({ clickDatas: e });
    };

    refreshData = () => {
        console.log('chart refreshData');
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
                    // DGIMNs: this.props.navigation.state.params.dgimn,
                    // datatype: this.props.datatype,
                    // DGIMNs: this.props.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[0],

                    endTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: this.callback
            })
        );
    };

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

    editOption = datas => {
        console.log('HistoryDataLandscapeChart editOption');
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
                    // .replace(' ', '\n')
                );
            } else if (this.props.datatype == 'month') {
                xData.push(moment(item.MonitorTime).format('YYYY-MM'));
            } else {
                xData.push(
                    moment(item.MonitorTime)
                        .format('HH:mm MM/DD')
                        .replace(' ', '\\nn')
                    // .replace(' ', '\n')
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
                    selectedMode: false //取消图例上的点击事件
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
                            //坐标轴刻度标签的相关设置。

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

    getTimeSelectOption = () => {
        let type = this.props.datatype;
        return {
            formatStr: this.props.datatype == 'day' ? 'YYYY-MM-DD' : 'MM/DD HH:00',
            type: type,
            defaultTime: this.props.selectTime,
            onSureClickListener: time => {
                this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(time).format('YYYY-MM-DD HH:mm:ss') }));
                this.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
            }
        };
    };

    refreshNewOPData(time, code) {
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
                    // DGIMNs: this.props.navigation.state.params.dgimn,
                    // datatype: this.props.datatype,
                    // DGIMNs: this.props.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(time, this.props.datatype)[0],

                    endTime: this.getRequestTime(time, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                // callback: data => {
                //     this.editOption(data);
                //     this.setState({ chartDatas: data });
                // }
                callback: this.callback
            })
        );
    }
    callback = data => {
        console.log('chart refreshData callback');
        this.editOption(data);
        this.setState({ chartDatas: data });
    };

    getTimePicker = () => {
        if (this.props.datatype == 'hour') {
            return <SimplePickerSingleTime key={'hour'} orientation={'LANDSCAPE'} style={{ width: 120 }} option={this.getTimeSelectOption()} />;
        } else if (this.props.datatype == 'day') {
            return <SimplePickerSingleTime key={'day'} orientation={'LANDSCAPE'} style={{ width: 120 }} option={this.getTimeSelectOption()} />;
        } else if (this.props.datatype == 'minute') {
            return <SimplePickerSingleTime key={'minute'} orientation={'LANDSCAPE'} style={{ width: 120 }} option={this.getTimeSelectOption()} />;
        } else if (this.props.datatype == 'realtime') {
            return <SimplePickerSingleTime key={'realtime'} orientation={'LANDSCAPE'} style={{ width: 120 }} option={this.getTimeSelectOption()} />;
        } else {
            return null;
        }
    };

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

    render() {
        const topButtonWidth = SCREEN_WIDTH / 6;
        return (
            <StatusPage
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
                style={[
                    {
                        width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT,
                        flex: 1
                    }
                ]}
            >
                {/* <StatusBar hidden={true} />
                <View
                    style={[{
                        width: WINDOW_HEIGHT, height: 44
                        , flexDirection: 'row', backgroundColor: 'white'
                        , alignItems: 'center'
                    }]}
                >
                    <View style={[{
                        flexDirection: 'row', height: 44
                        , width: SCREEN_WIDTH * 3 / 5, alignItems: 'center'
                        , justifyContent: 'space-between'
                        , backgroundColor: 'white'
                    }]}>
                        <View style={[{
                            flex: 1, height: 44, flexDirection: 'row'
                        }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.setState({
                                        signInType: 0,
                                        datatype: 'hour'
                                    }, () => {
                                        this.refreshData();
                                    })
                                }}
                            >
                                <View
                                    style={[{
                                        width: topButtonWidth, height: 44
                                        , alignItems: 'center'
                                    }]}
                                >
                                    <View style={[{
                                        width: 40, height: 2
                                    }]}></View>
                                    <View style={[{
                                        width: topButtonWidth, height: 40
                                        , alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Text style={[{
                                            fontSize: 15
                                            , color: this.state.signInType == 0 ? '#4AA0FF' : '#666666'
                                        }]}>{'小时'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: this.state.signInType == 0 ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            flex: 1, height: 44, flexDirection: 'row'
                            , backgroundColor: 'white'
                        }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.setState({
                                        signInType: 1,
                                        datatype: 'day'
                                    }, () => {
                                        this.refreshData();
                                    })
                                }}
                            >
                                <View
                                    style={[{
                                        width: topButtonWidth, height: 44
                                        , alignItems: 'center'
                                    }]}
                                >
                                    <View style={[{
                                        width: 40, height: 2
                                    }]}></View>
                                    <View style={[{
                                        width: topButtonWidth, height: 40
                                        , alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Text style={[{
                                            fontSize: 15
                                            , color: this.state.signInType == 1 ? '#4AA0FF' : '#666666'
                                        }]}>{'日均'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: this.state.signInType == 1 ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            flex: 1, height: 44, flexDirection: 'row'
                            , backgroundColor: 'white'
                        }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.setState({
                                        signInType: 2,
                                        datatype: 'realtime'
                                    }, () => {
                                        this.refreshData();
                                    })
                                }}
                            >
                                <View
                                    style={[{
                                        width: topButtonWidth, height: 44
                                        , alignItems: 'center'
                                    }]}
                                >
                                    <View style={[{
                                        width: 40, height: 2
                                    }]}></View>
                                    <View style={[{
                                        width: topButtonWidth, height: 40
                                        , alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Text style={[{
                                            fontSize: 15
                                            , color: this.state.signInType == 2 ? '#4AA0FF' : '#666666'
                                        }]}>{'实时'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: this.state.signInType == 2 ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[{
                            flex: 1, height: 44, flexDirection: 'row'
                            , backgroundColor: 'white'
                        }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.setState({
                                        signInType: 3,
                                        datatype: 'minute'
                                    }, () => {
                                        this.refreshData();
                                    })
                                }}
                            >
                                <View
                                    style={[{
                                        width: topButtonWidth, height: 44
                                        , alignItems: 'center'
                                    }]}
                                >
                                    <View style={[{
                                        width: 40, height: 2
                                    }]}></View>
                                    <View style={[{
                                        width: topButtonWidth, height: 40
                                        , alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Text style={[{
                                            fontSize: 15
                                            , color: this.state.signInType == 3 ? '#4AA0FF' : '#666666'
                                        }]}>{'分钟'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: this.state.signInType == 3 ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.datatype == 'month' ? <SDLText style={{ marginLeft: 15 }}>最近12个月</SDLText> : this.getTimePicker()}
                    <SimpleLandscapeMultipleItemPicker
                        orientation={'LANDSCAPE'}
                        ref={ref => {
                            this.simpleMultipleItemPicker = ref;
                        }}
                        option={this.getPointTypeOption()}
                        style={[{ width: 150 }]}
                    />
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        style={{ marginLeft: 8, height: 44, width: 44, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            if (this.props.chartOrList == 'chart') {
                                this.props.dispatch(createAction('historyDataModel/updateState')({
                                    chartOrList: 'list',
                                }));
                            } else {
                                this.props.dispatch(createAction('historyDataModel/updateState')({
                                    chartOrList: 'chart',
                                }));
                            }
                        }}
                    >
                        <View
                            style={[{
                                width: 32, height: 32, borderRadius: 16
                                , justifyContent: 'center', alignItems: 'center'
                                , backgroundColor: globalcolor.antBlue
                            }]}
                        >
                            <Image
                                source={this.props.chartOrList == 'list' ? require('../../images/ic_chart_change.png') : require('../../images/ic_map_list.png')}
                                // source={require('../../images/ic_chart_change.png')}
                                style={{ width: 18, height: 18 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginHorizontal: 8 }}
                        onPress={() => {
                            this.props.dispatch(NavigationActions.back())
                        }}
                    >
                        <View
                            style={{ width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Image
                                style={{ width: 32, height: 32 }}
                                source={
                                    require('../../images/ic_cancel_full_screen.png')
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </View> */}
                <View
                    style={[
                        {
                            width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT,
                            height: Platform.OS == 'ios' ? '100%' : SCREEN_WIDTH - 44,
                            flexDirection: 'row'
                        }
                    ]}
                    onLayout={event => {
                        console.log('b height = ', SentencedToEmpty(event, ['nativeEvent', 'layout', 'height'], -1));
                        console.log('b width = ', SentencedToEmpty(event, ['nativeEvent', 'layout', 'width'], -1));
                        this.setState({
                            width: SentencedToEmpty(event, ['nativeEvent', 'layout', 'width'], -1),
                            height: SentencedToEmpty(event, ['nativeEvent', 'layout', 'height'], -1)
                        });
                    }}
                >
                    {typeof this.state.option1 == 'undefined' ? null : (
                        <Echarts
                            option={this.state.option1}
                            height={Platform.OS == 'ios' ? this.state.height : SCREEN_WIDTH - 44}
                            onPress={this.onPress}
                            width={Platform.OS == 'ios' ? this.state.width - SCREEN_WIDTH / 3 : WINDOW_HEIGHT - SCREEN_WIDTH / 3 - 8}
                        />
                    )}
                    <ScrollView
                        style={[
                            {
                                width: SCREEN_WIDTH / 3,
                                height: Platform.OS == 'ios' ? '100%' : SCREEN_WIDTH - 44,
                                marginHorizontal: 4,
                                backgroundColor: 'white'
                            }
                        ]}
                    >
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
                                        width: SCREEN_WIDTH / 3,
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
                    </ScrollView>
                </View>
            </StatusPage>
        );
    }
}
