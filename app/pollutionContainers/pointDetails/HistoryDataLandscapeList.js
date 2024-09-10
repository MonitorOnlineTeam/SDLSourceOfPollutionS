/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2024-06-14 14:02:27
 * @LastEditTime: 2024-07-10 10:05:01
 * @FilePath: /SDLMainProject37/app/pollutionContainers/pointDetails/HistoryDataLandscapeList.js
 */
/*
 * @Description: 横评 数据查询列表
 * @LastEditors: hxf
 * @Date: 2024-06-14 14:02:27
 * @LastEditTime: 2024-06-20 17:31:22
 * @FilePath: /SDLMainProject37/app/pollutionContainers/pointDetails/HistoryDataLandscapeList.js
 */
import { FlatList, Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import { lockToPortrait, lockToLandscape } from 'react-native-orientation';
import { SCREEN_HEIGHT, SCREEN_WIDTH, WINDOW_HEIGHT } from '../../config/globalsize';
import { connect } from 'react-redux';
import { SDLText, SimplePickerSingleTime, StatusPage } from '../../components';
import { NavigationActions, SentencedToEmpty, createAction } from '../../utils';
import moment from 'moment';
import { WindTransform, isWindDirection, getWindSpeed } from '../../utils/mapconfig';
import SimpleLandscapeMultipleItemPicker from '../../components/LandscapeComponents/SimpleLandscapeMultipleItemPicker';

@connect(
    ({ pointDetails, app, historyDataModel }) => ({
        PollantCodes: pointDetails.PollantCodes,
        chartStatus: pointDetails.chartStatus,
        selectCodeArr: pointDetails.selectCodeArr,
        selectTime: pointDetails.selectTime,
        screenOrientation: app.screenOrientation, // 数据查询 屏幕方向

        datatype: historyDataModel.datatype
    }),
    null,
    null,
    { withRef: true }
)
export default class HistoryDataLandscapeList extends Component {
    static navigationOptions = {
        header: null
    };

    static defaultProps = {
        signInType: 0
    };

    constructor(props) {
        super(props);
        // const pageState = SentencedToEmpty(props, ['navigation', 'state', 'params', 'pageState'], {})
        const pageState = SentencedToEmpty(props, ['pageState'], {});
        this.state = {
            chartDatas: [],
            signInType: this.getSignInTypeCode(),
            // datatype: this.props.navigation.state.params.datatype,
            datatype: this.props.datatype,
            ...pageState
        };
    }

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

    componentDidMount() {
        lockToLandscape();
    }

    // componentWillUnmount() {
    //     lockToPortrait();
    // }

    //FlatList key
    _extraUniqueKey = (item, index) => `index109${index}${item}`;
    _renderItemList = item => {
        let page = this;
        return (
            <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', width: (SCREEN_WIDTH / 4) * (this.props.selectCodeArr.length + 1) + 10, height: 50, justifyContent: 'space-between', marginTop: 1 }}>
                <SDLText style={{ fontSize: 14, color: '#868686', width: SCREEN_WIDTH / 4, padding: 3, marginLeft: 10, textAlign: 'center', alignSelf: 'center' }}>
                    {this.props.datatype == 'day'
                        ? moment(item.item.MonitorTime).format('YYYY/MM/DD')
                        : this.props.datatype == 'realtime'
                            ? moment(item.item.MonitorTime)
                                .format('MM/DD HH:mm:ss')
                                .replace(' ', '\n')
                            : this.props.datatype == 'month'
                                ? moment(item.item.MonitorTime).format('YYYY-MM')
                                : moment(item.item.MonitorTime).format('MM/DD HH:mm')}
                </SDLText>

                {this.props.selectCodeArr.map((code, key) => {
                    {
                        /***数据查询，实时和分钟的不显示AQI列 */
                    }
                    if ((page.props.datatype == 'realtime' || page.props.datatype == 'minute') && SentencedToEmpty(code, ['PollutantCode'], '') == 'AQI') {
                        return null;
                    }
                    code = code.PollutantCode;
                    return (
                        <View key={`_${key}`} style={{ width: SCREEN_WIDTH / 4, alignItems: 'center', justifyContent: 'center' }}>
                            <View
                                style={{
                                    minWidth: 50,
                                    backgroundColor: item.item[code + '_params'] ? (item.item[code + '_params'].split('§')[0] == 0 ? 'red' : item.item[code + '_params'].split('§')[0] == 1 ? '#FF8C00' : 'white') : 'white',
                                    alignSelf: 'center',
                                    borderRadius: 25
                                }}
                            >
                                <SDLText style={{ color: item.item[code + '_params'] ? 'white' : '#666', padding: 3, fontSize: 14, textAlignVertical: 'center', textAlign: 'center', maxWidth: SCREEN_WIDTH / 4 - 8 }}>
                                    {/* {isWindDirection(code) ? WindTransform(item.item[code], item.item[getWindSpeed()]) : this.getValue(item, code)} */}
                                    {isWindDirection(code) ? WindTransform(item.item[code], item.item[getWindSpeed()]) : this.getValue(item, code + '_flag')}
                                </SDLText>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    getValue(item, code) {
        if (item.item[code] === 0 || item.item[code] === '0') {
            return item.item[code];
        }
        if (item.item[code] == '' || item.item[code] == null || typeof item.item[code] == undefined) {
            return '---';
        }
        return item.item[code];
    }

    showUnit = item => {
        if (typeof item.Unit == 'undefined' && !item.Unit) {
            return '-';
        } else {
            if (this.props.datatype == 'realtime' && item.PollutantCode == 'b01') {
                return 'L/s';
            } else if (this.props.datatype == 'realtime' && item.PollutantCode == 'b02') {
                return 'm³/s';
            } else {
                return item.Unit;
            }
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
                this.refreshNewOPData(moment(time).format('YYYY-MM-DD HH:mm:ss'), this.props.selectCodeArr);
            }
        };
    };

    refreshNewOPData(time, code) {
        let codeStr = '';
        code.map(item => {
            codeStr = codeStr + ',' + item.PollutantCode;
        });
        this.props.dispatch(
            createAction('pointDetails/getChartLstDatas')({
                params: {
                    datatype: this.props.datatype,
                    DGIMNs: this.props.dgimn,
                    // DGIMNs: this.props.navigation.state.params.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(time, this.props.datatype)[0],

                    endTime: this.getRequestTime(time, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: data => {
                    this.setState({ chartDatas: data });
                }
            })
        );
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
            beginTime =
                moment(time)
                    .subtract(1440, 'minutes')
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

    refreshData = () => {
        let codeStr = '';
        this.props.selectCodeArr.map(item => {
            codeStr = codeStr + ',' + item.PollutantCode;
        });
        this.props.dispatch(
            createAction('pointDetails/getChartLstDatas')({
                params: {
                    datatype: this.props.datatype,
                    DGIMNs: this.props.dgimn,
                    // DGIMNs: this.props.navigation.state.params.dgimn,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[0],

                    endTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: data => {
                    this.setState({ chartDatas: data });
                }
            })
        );
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
                style={[{ width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT, flex: 1 }]}
            >
                {/* <StatusBar hidden={true} />
                <View
                    style={[{
                        width: WINDOW_HEIGHT, height: 44
                        , flexDirection: 'row', backgroundColor: '#ffffff'
                        , alignItems: 'center'
                    }]}
                >
                    <View style={[{
                        flexDirection: 'row', height: 44
                        , width: SCREEN_WIDTH * 3 / 5, alignItems: 'center'
                        , justifyContent: 'space-between'
                    }]}>
                        <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
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
                                        , alignItems: 'center', backgroundColor: 'white'
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
                        <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
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
                        <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
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
                        <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
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
                <ScrollView style={{ width: Platform.OS == 'ios' ? '100%' : WINDOW_HEIGHT, flex: 1, flexDirection: 'row' }} showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ height: 50, width: (SCREEN_WIDTH / 4) * (this.props.selectCodeArr.length + 1) + 10, backgroundColor: '#f0f0f0', marginBottom: 0, marginTop: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', height: 40, marginTop: 10, borderBottomColor: '#f0f0f0', borderBottomWidth: 0.5 }}>
                                <SDLText style={{ marginLeft: 10, color: '#333333', width: SCREEN_WIDTH / 4, textAlign: 'center' }}>时间</SDLText>
                                {/***数据查询，实时和分钟的不显示AQI列 */}
                                {this.props.selectCodeArr.map((item, index) => {
                                    if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
                                        return null;
                                    }
                                    if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
                                        return (
                                            <SDLText key={`title${index}`} style={{ color: '#333333', width: SCREEN_WIDTH / 4, textAlign: 'center' }}>
                                                {`${'综合指数'}`}
                                            </SDLText>
                                        );
                                    }
                                    if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
                                        return (
                                            <SDLText key={`title${index}`} style={{ color: '#333333', width: SCREEN_WIDTH / 4, textAlign: 'center' }}>
                                                {`${'AQI'}`}
                                            </SDLText>
                                        );
                                    }
                                    return (
                                        <SDLText key={`title${index}`} style={{ color: '#333333', width: SCREEN_WIDTH / 4, textAlign: 'center' }}>
                                            {`${item.PollutantName}${SentencedToEmpty(item, ['PollutantName'], '-') == '-' ? '' : '(' + this.showUnit(item) + ')'}`}
                                        </SDLText>
                                    );
                                })}
                            </View>
                        </View>
                        <FlatList
                            style={{
                                flex: 1
                            }}
                            data={[].concat(SentencedToEmpty(this.state, ['chartDatas'], [])).reverse()}
                            overScrollMode={'never'}
                            onScroll={this.props.onScroll}
                            renderItem={this._renderItemList}
                            keyExtractor={this._extraUniqueKey}
                            onEndReachedThreshold={0.5}
                            initialNumToRender={30}
                        />
                    </View>
                </ScrollView>
            </StatusPage>
        );
    }
}
