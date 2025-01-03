import React from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SimpleMultipleItemPicker, SDLText, StatusPage } from '../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import { lockToPortrait, lockToLandscape } from 'react-native-orientation';
import moment from 'moment';
import { WindTransform, isWindDirection, getWindSpeed } from '../../utils/mapconfig';
/**
 * 
 *站点详情
 */
@connect(({ pointDetails, app }) => ({
    PollantCodes: pointDetails.PollantCodes,
    chartStatus: pointDetails.chartStatus,
    selectCodeArr: pointDetails.selectCodeArr,
    selectTime: pointDetails.selectTime,
    screenOrientation: app.screenOrientation, // 数据查询 屏幕方向
}))
export default class HistoryDataList extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        let selectCodeArr = [],
            selectNameArr = [];
        this.props.PollantCodes.map((item, key) => {
            if (key < 3) {
                selectCodeArr.push(SentencedToEmpty(item, [key, 'PollutantCode'], ''));
                selectNameArr.push(SentencedToEmpty(item, [key, 'PollutantName'], ''));
            }
        });
        this.state = {
            chartDatas: [],
            selectCodeArr,
            clickDatas: [],
            selectNameArr,
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    }
    getTimeSelectOption = () => {
        let type = this.props.datatype;
        return {
            formatStr: this.props.datatype == 'day' ? 'YYYY-MM-DD' : this.props.datatype == 'hour' ? 'MM/DD HH:00' : 'MM/DD HH:mm',
            type: type,
            defaultTime: this.props.selectTime,
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
        this.props.onRef(this); //将组件实例this传递给onRe
    }
    componentWillUnmount() {
        // this.resetScreenOrientation();
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
    }
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

    showUnit = (item) => {
        if (typeof item.Unit == 'undefined' && !item.Unit) {
            return '-';
        } else {
            if (this.props.datatype == 'realtime' && item.PollutantCode == 'b01') {
                return 'L/s';
            } else if (this.props.datatype == 'realtime' && item.PollutantCode == 'b02') {
                return 'm³/s';
            } else {
                return item.Unit
            }
        }
    }

    resetScreenOrientation = () => {
        console.log('resetScreenOrientation');
        this.props.dispatch(createAction('app/updateState')({
            screenOrientation: 'Portrait'
        }));
        lockToPortrait();
    }

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
        let selectCodeArr = this.props.selectCodeArr;
        // 将选中的污染物补充到三个
        while (selectCodeArr.length < 3) {
            selectCodeArr.push({ PollutantName: '-', Unit: null });
        }
        const screenOrientation = SentencedToEmpty(this.props, ['screenOrientation'], '');
        return (
            <StatusPage
                style={{ flex: 1 }}
                // style={{ flex: 0.95 }}
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
                <View
                    style={{
                        width: SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Portrait'
                            ? SCREEN_WIDTH : SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Landscape'
                                ? SCREEN_HEIGHT : SCREEN_WIDTH,
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
                    {/* <TouchableOpacity
                        style={{ marginHorizontal: 8 }}
                        onPress={() => {
                            if (screenOrientation == 'Portrait') {
                                this.props.dispatch(createAction('app/updateState')({
                                    screenOrientation: 'Landscape'
                                }));
                                lockToLandscape();
                            } else if (screenOrientation == 'Landscape') {
                                this.props.dispatch(createAction('app/updateState')({
                                    screenOrientation: 'Portrait'
                                }));
                                lockToPortrait();
                            }
                        }}
                    >
                        <View
                            style={{ width: 40, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Image
                                style={{ width: 32, height: 32 }}
                                source={
                                    screenOrientation == 'Portrait'
                                        ? require('../../images/ic_full_screen.png')
                                        : screenOrientation == 'Landscape'
                                            ? require('../../images/ic_cancel_full_screen.png')
                                            : require('../../images/ic_full_screen.png')
                                }
                            />
                        </View>
                    </TouchableOpacity> */}
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

                            // this.props.dispatch(NavigationActions.navigate({
                            //     routeName: 'HistoryDataLandscapeList',
                            //     params: {
                            //         datatype: this.props.datatype,
                            //         pageState: this.state,
                            //         dgimn: this.props.dgimn,
                            //     }
                            // }));
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
                <ScrollView style={{ flex: 1, flexDirection: 'row' }} showsHorizontalScrollIndicator={false} horizontal={true}>
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
                            data={[].concat(this.state.chartDatas).reverse()}
                            overScrollMode={'never'}
                            onScroll={this.props.onScroll}
                            renderItem={this._renderItemList}
                            keyExtractor={this._extraUniqueKey}
                            onEndReachedThreshold={0.5}
                            initialNumToRender={30}
                        />
                    </View>
                </ScrollView>
            </StatusPage >
        );
    }
}

const styles = StyleSheet.create({});
