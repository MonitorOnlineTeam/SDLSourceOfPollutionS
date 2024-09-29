/*
 * @Description: 横屏 列表和图表 入口
 * @LastEditors: hxf
 * @Date: 2024-06-26 09:07:50
 * @LastEditTime: 2024-09-27 15:16:27
 * @FilePath: /SDLMainProject/app/pollutionContainers/pointDetails/HistoryDataLandscape.js
 */
import { StatusBar, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { lockToPortrait, lockToLandscape } from 'react-native-orientation';
import { SCREEN_WIDTH, WINDOW_HEIGHT } from '../../config/globalsize';
import { SimplePickerSingleTime } from '../../components';
import { NavigationActions, SentencedToEmpty, createAction } from '../../utils';
import SimpleLandscapeMultipleItemPicker from '../../components/LandscapeComponents/SimpleLandscapeMultipleItemPicker';
import globalcolor from '../../config/globalcolor';
import HistoryDataLandscapeChart from './HistoryDataLandscapeChart';
import HistoryDataLandscapeList from './HistoryDataLandscapeList';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';

@connect(({ pointDetails, app, historyDataModel }) => ({
    PollantCodes: pointDetails.PollantCodes,
    chartStatus: pointDetails.chartStatus,
    selectCodeArr: pointDetails.selectCodeArr,
    selectTime: pointDetails.selectTime,
    screenOrientation: app.screenOrientation, // 数据查询 屏幕方向

    chartOrList: historyDataModel.chartOrList,
    datatype: historyDataModel.datatype,
    signInType: historyDataModel.signInType
}))
export default class HistoryDataLandscape extends Component {
    // static navigationOptions = {
    //     header: null
    // };

    constructor(props) {
        super(props);
        const pageState = SentencedToEmpty(props, ['route', 'params', 'params', 'pageState'], {});
        this.state = {
            // chartDatas: [],
            // signInType: this.getSignInTypeCode(),
            signInType: 0,
            datatype: 'hour',
            // datatype: this.props.navigation.state.params.datatype,
            ...pageState
        };
    }

    componentDidMount() {
        lockToLandscape();
    }

    componentWillUnmount() {
        lockToPortrait();
        const setRightButtonState = SentencedToEmpty(this.props, ['route', 'params', 'params', 'setRightButtonState'], () => { });
        const goToPage = SentencedToEmpty(this.props, ['route', 'params', 'params', 'goToPage'], () => { });
        setRightButtonState(this.props.chartOrList);
        goToPage({
            signInType: this.props.signInType,
            datatype: this.props.datatype
        });
    }

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

    getTimeSelectOption = () => {
        let type = this.props.datatype;
        return {
            formatStr: this.props.datatype == 'day' ? 'YYYY-MM-DD' : 'MM/DD HH:00',
            type: type,
            defaultTime: this.props.selectTime,
            onSureClickListener: time => {
                this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(time).format('YYYY-MM-DD HH:mm:ss') }));
                if (this.props.chartOrList == 'chart') {
                    // this.refs.chart1.wrappedInstance.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
                    this.chart1.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
                } else {
                    // this.refs.list1.wrappedInstance.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
                    this.list1.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
                }
                // this.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
            }
        };
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
                // this.refreshNewOPData(this.props.selectTime, selectData);
                if (this.props.chartOrList == 'chart') {
                    // this.refs.chart1.wrappedInstance.refreshNewOPData(this.props.selectTime, selectData);
                    this.chart1.refreshNewOPData(this.props.selectTime, selectData);
                } else {
                    // this.refs.list1.wrappedInstance.refreshNewOPData(this.props.selectTime, selectData);
                    this.list1.refreshNewOPData(this.props.selectTime, selectData);
                }
            }
        };
    };

    getData = () => {
        let _this = this;
        setTimeout(() => {
            if (_this.props.chartOrList == 'chart') {
                // _this.refs.chart1.wrappedInstance.refreshData();
                _this.chart1.refreshData();
            } else {
                // _this.refs.list1.wrappedInstance.refreshData();
                _this.list1.refreshData();
            }
        }, 100);
    };

    render() {
        // console.log('WINDOW_HEIGHT - 160 = ', WINDOW_HEIGHT - 160);
        const topButtonWidth = SCREEN_WIDTH / 6;
        return (
            <View
                style={[
                    {
                        width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT,
                        flex: 1
                    }
                ]}
            >
                <StatusBar hidden={true} />
                <View
                    style={[
                        {
                            width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT,
                            height: 44,
                            flexDirection: 'row',
                            backgroundColor: 'white',
                            alignItems: 'center'
                        }
                    ]}
                >
                    {/* <Text
                        style={[{
                            fontSize: 18, marginLeft: 10
                        }]}
                    >{'数据查询'}</Text> */}

                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                height: 44,
                                width: (SCREEN_WIDTH * 3) / 5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'white'
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    flex: 1,
                                    height: 44,
                                    flexDirection: 'row'
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.props.dispatch(
                                        createAction('historyDataModel/updateState')({
                                            datatype: 'hour',
                                            signInType: 0
                                        })
                                    );
                                    this.getData();
                                    // this.setState({
                                    //     signInType: 0,
                                    //     datatype: 'hour'
                                    // }, () => {
                                    //     this.refreshData();
                                    // })
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: topButtonWidth,
                                            height: 44,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2
                                            }
                                        ]}
                                    ></View>
                                    <View
                                        style={[
                                            {
                                                width: topButtonWidth,
                                                height: 40,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 15,
                                                    color: this.props.signInType == 0 ? '#4AA0FF' : '#666666'
                                                }
                                            ]}
                                        >
                                            {'小时'}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2,
                                                backgroundColor: this.props.signInType == 0 ? '#4AA0FF' : 'white'
                                            }
                                        ]}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    height: 44,
                                    flexDirection: 'row',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.props.dispatch(
                                        createAction('historyDataModel/updateState')({
                                            datatype: 'day',
                                            signInType: 1
                                        })
                                    );
                                    this.getData();
                                    // this.setState({
                                    //     signInType: 1,
                                    //     datatype: 'day'
                                    // }, () => {
                                    //     this.refreshData();
                                    // })
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: topButtonWidth,
                                            height: 44,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2
                                            }
                                        ]}
                                    ></View>
                                    <View
                                        style={[
                                            {
                                                width: topButtonWidth,
                                                height: 40,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 15,
                                                    color: this.props.signInType == 1 ? '#4AA0FF' : '#666666'
                                                }
                                            ]}
                                        >
                                            {'日均'}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2,
                                                backgroundColor: this.props.signInType == 1 ? '#4AA0FF' : 'white'
                                            }
                                        ]}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    height: 44,
                                    flexDirection: 'row',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.props.dispatch(
                                        createAction('historyDataModel/updateState')({
                                            datatype: 'realtime',
                                            signInType: 2
                                        })
                                    );
                                    this.getData();
                                    // this.setState({
                                    //     signInType: 2,
                                    //     datatype: 'realtime'
                                    // }, () => {
                                    //     this.refreshData();
                                    // })
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: topButtonWidth,
                                            height: 44,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2
                                            }
                                        ]}
                                    ></View>
                                    <View
                                        style={[
                                            {
                                                width: topButtonWidth,
                                                height: 40,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 15,
                                                    color: this.props.signInType == 2 ? '#4AA0FF' : '#666666'
                                                }
                                            ]}
                                        >
                                            {'实时'}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2,
                                                backgroundColor: this.props.signInType == 2 ? '#4AA0FF' : 'white'
                                            }
                                        ]}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    height: 44,
                                    flexDirection: 'row',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <TouchableOpacity
                                style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    this.props.dispatch(
                                        createAction('historyDataModel/updateState')({
                                            datatype: 'minute',
                                            signInType: 3
                                        })
                                    );
                                    this.getData();
                                    // if (this.props.chartOrList == 'chart') {
                                    //     this.refs.chart.refreshData();
                                    // } else {
                                    //     this.refs.list.refreshData();
                                    // }
                                    // this.setState({
                                    //     signInType: 3,
                                    //     datatype: 'minute'
                                    // }, () => {
                                    //     this.refreshData();
                                    // })
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: topButtonWidth,
                                            height: 44,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2
                                            }
                                        ]}
                                    ></View>
                                    <View
                                        style={[
                                            {
                                                width: topButtonWidth,
                                                height: 40,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 15,
                                                    color: this.props.signInType == 3 ? '#4AA0FF' : '#666666'
                                                }
                                            ]}
                                        >
                                            {'分钟'}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: 40,
                                                height: 2,
                                                backgroundColor: this.props.signInType == 3 ? '#4AA0FF' : 'white'
                                            }
                                        ]}
                                    ></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* {this.state.datatype == 'month' ? <SDLText style={{ marginLeft: 15 }}>最近12个月</SDLText> : <SimplePickerSingleTime orientation={'LANDSCAPE'} style={{ width: 120 }} option={this.getTimeSelectOption()} />} */}
                    {this.props.datatype == 'month' ? <SDLText style={{ marginLeft: 15 }}>最近12个月</SDLText> : this.getTimePicker()}
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
                                this.props.dispatch(
                                    createAction('pointDetails/updateState')({
                                        chartStatus: { status: -1 }
                                    })
                                );
                                this.props.dispatch(
                                    createAction('historyDataModel/updateState')({
                                        chartOrList: 'list'
                                    })
                                );
                            } else {
                                this.props.dispatch(
                                    createAction('pointDetails/updateState')({
                                        chartStatus: { status: -1 }
                                    })
                                );
                                this.props.dispatch(
                                    createAction('historyDataModel/updateState')({
                                        chartOrList: 'chart'
                                    })
                                );
                            }
                            this.getData();
                        }}
                    >
                        <View
                            style={[
                                {
                                    width: 32,
                                    height: 32,
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: globalcolor.antBlue
                                }
                            ]}
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
                            this.props.dispatch(NavigationActions.back());
                        }}
                    >
                        <View style={{ width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 32, height: 32 }} source={require('../../images/ic_cancel_full_screen.png')} />
                        </View>
                    </TouchableOpacity>
                </View >
                {/**
                     * const setRightButtonState = SentencedToEmpty(this.props
                            , ['navigation', 'state', 'params', 'setRightButtonState']
                            , () => { })
                        const goToPage = SentencedToEmpty(this.props
                            , ['navigation', 'state', 'params', 'goToPage']
                            , () => { })
                     */
                    this.props.chartOrList == 'chart' ? (
                        <HistoryDataLandscapeChart
                            // ref="chart1"
                            onRef={ref => (this.chart1 = ref)}
                            pageState={SentencedToEmpty(this.props, ['route', 'params', 'params', 'pageState'], {})}
                            datatype={this.props.route.params.params.datatype}
                            setRightButtonState={SentencedToEmpty(this.props, ['route', 'params', 'params', 'setRightButtonState'], () => { })}
                            goToPage={SentencedToEmpty(this.props, ['route', 'params', 'params', 'goToPage'], () => { })}
                            dgimn={this.props.route.params.params.dgimn}
                        />
                    ) : (
                        <HistoryDataLandscapeList
                            // ref="list1"
                            onRef={ref => (this.list1 = ref)}
                            pageState={SentencedToEmpty(this.props, ['route', 'params', 'params', 'pageState'], {})}
                            datatype={this.props.route.params.params.datatype}
                            setRightButtonState={SentencedToEmpty(this.props, ['route', 'params', 'params', 'setRightButtonState'], () => { })}
                            goToPage={SentencedToEmpty(this.props, ['route', 'params', 'params', 'goToPage'], () => { })}
                            dgimn={this.props.route.params.params.dgimn}
                        />
                    )
                }
            </View >
        );
    }
}
