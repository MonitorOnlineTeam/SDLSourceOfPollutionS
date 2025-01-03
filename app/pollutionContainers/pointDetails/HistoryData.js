/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-04-25 09:20:10
 * @LastEditTime: 2025-01-03 09:56:08
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pollutionContainers/pointDetails/HistoryData.js
 */
import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, Dimensions, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
// import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { StatusPage, Touchable, PickerTouchable } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../utils';
import HistoryDataChart from './HistoryDataChart';
import HistoryDataList from './HistoryDataList';
import moment from 'moment';
import SDLTabButton from '../../components/SDLTabButton';
/**
 * 历史数据
 */
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
let that;
@connect(({ pointDetails, app, historyDataModel }) => ({
    PollantCodes: pointDetails.PollantCodes,
    ponitInfo: pointDetails.ponitInfo,
    screenOrientation: app.screenOrientation, // 数据查询 屏幕方向

    showIndex: historyDataModel.showIndex,
    chartOrList: historyDataModel.chartOrList,
}))
export default class HistoryData extends PureComponent {
    // static navigationOptions = ({ navigation }) =>
    //     createNavigationOptions({
    //         title: '数据查询',
    //         headerRight: (
    //             <TouchableOpacity
    //                 style={{ height: 44, width: 44, justifyContent: 'center', alignItems: 'center' }}
    //                 onPress={() => {
    //                     if (that.props.PollantCodes.length > 0) {
    //                         if (that.props.chartOrList == 'chart') {
    //                             navigation.state.params.changeChartOrListPress('list');

    //                             that.setState({ chartOrList: 'list' }, () => {
    //                                 that.onChange(that.props.showIndex, 'list');
    //                             });
    //                         } else {
    //                             navigation.state.params.changeChartOrListPress('chart');

    //                             that.setState({ chartOrList: 'chart' }, () => {
    //                                 that.onChange(that.props.showIndex, 'chart');
    //                             });
    //                         }
    //                     } else {
    //                         ShowToast('无法获取污染因子配置，请退出页面重试');
    //                     }
    //                 }}
    //             >
    //                 <Image
    //                     source={navigation.state.params && navigation.state.params.chartOrList == 'list' ? require('../../images/ic_chart_change.png') : require('../../images/ic_map_list.png')}
    //                     style={{ width: 18, height: 18, marginRight: 16 }}
    //                 />
    //             </TouchableOpacity>
    //         )
    //     });

    constructor(props) {
        super(props);
        that = this;

        // const getShowIndex = () => {
        //     const params = SentencedToEmpty(props, [
        //         'navigation', 'state', 'params', 'params'
        //     ], {});
        //     if (SentencedToEmpty(params, ['sourceType'], '') == "OverWarning") {
        //         return 3;
        //     } else {
        //         if (SentencedToEmpty(params, ['DataType'], '') == 'DayData') {
        //             return 1
        //         } else {
        //             return 0;
        //         }
        //     }
        // }


        // this.showIndex = getShowIndex();
        this.state = {
            // datatype: 0,
            // showIndex: getShowIndex(),
            chartOrList: 'chart'
        };
        // this.props.navigation.setParams({
        //     chartOrList: this.props.chartOrList,
        //     changeChartOrListPress: chartOrList => {
        //         this.props.dispatch(createAction('historyDataModel/updateState')({
        //             chartOrList: chartOrList,
        //         }));
        //         this.props.navigation.setParams({ chartOrList });
        //     }
        // });


    }

    setRightButtonState = (chartOrList) => {
        // this.props.navigation.setParams({ chartOrList });
        this.props.dispatch(createAction('historyDataModel/updateState')({
            chartOrList
        }));
    }

    goToPage = ({ signInType, datatype }) => {
        // this.refs.tabView.goToPage(signInType);
        this.props.dispatch(createAction('historyDataModel/updateState')({
            showIndex: signInType,
        }));
    }

    onChange = (e, type) => {
        this.props.dispatch(createAction('historyDataModel/updateState')({
            showIndex: e,
        }));
        setTimeout(() => {
            switch (type || this.props.chartOrList) {
                case 'chart':
                    switch (e) {
                        case 0:
                            if (that.hour) that.hour.refreshData();
                            break;
                        case 1:
                            if (this.day) this.day.refreshData();
                            break;
                        case 2:
                            if (this.realtime) this.realtime.refreshData();
                            break;
                        case 3:
                            if (this.minute) this.minute.refreshData();
                            break;
                        case 4:
                            if (this.month) this.month.refreshData();
                            break;
                        default:
                            break;
                    }
                    break;
                case 'list':
                    switch (e) {
                        case 0:
                            if (that.hourl) that.hourl.refreshData();
                            break;
                        case 1:
                            if (this.dayl) this.dayl.refreshData();
                            break;
                        case 2:
                            if (this.realtimel) this.realtimel.refreshData();
                            break;
                        case 3:
                            if (this.minutel) this.minutel.refreshData();
                            break;
                        case 4:
                            if (this.monthl) this.monthl.refreshData();
                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    break;
            }
        })
    };

    setHeadOption = () => { //点击切换右上角图标
        this.props.navigation.setOptions({
            title: '数据查询',
            headerRight: () => {
                return <TouchableOpacity
                    style={{ height: 44, width: 44, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        if (this.props.PollantCodes.length > 0) {
                            this.props.dispatch(createAction('historyDataModel/updateState')({
                                chartOrList: this.props.chartOrList == 'chart' ? 'list' : 'chart',
                            }));
                            // if (that.props.chartOrList == 'chart') {
                            //     route.params.params.changeChartOrListPress('list');

                            //     that.setState({ chartOrList: 'list' }, () => {
                            //         that.onChange(that.props.showIndex, 'list');
                            //     });
                            // } else {
                            //     route.params.params.changeChartOrListPress('chart');

                            //     that.setState({ chartOrList: 'chart' }, () => {
                            //         that.onChange(that.props.showIndex, 'chart');
                            //     });
                            // }
                        } else {
                            ShowToast('无法获取污染因子配置，请退出页面重试');
                        }
                    }}
                >
                    <Image
                        source={this.props.chartOrList == 'list' ? require('../../images/ic_chart_change.png') : require('../../images/ic_map_list.png')}
                        style={{ width: 18, height: 18, marginRight: 16 }}
                    />
                </TouchableOpacity>
            }
        });
    }
    componentWillUnmount() {
        this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment().format('YYYY-MM-DD HH:mm:ss') }));
        this.props.dispatch(createAction('app/updateState')({ hideStatusBar: false }));
    }
    componentDidMount() {
        // this.props.dispatch(createAction('app/updateState')({ hideStatusBar: true }));
        this.props.dispatch(createAction('pointDetails/getPollantCodes')({ params: { DGIMNs: this.props.route.params.params.DGIMN }, callBack: this.callBack }));
        this.setHeadOption()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.chartOrList !== this.props.chartOrList) {
            this.setHeadOption()
            this.onChange(that.props.showIndex, this.props.chartOrList);
        }
    }
    callBack = (isSuc, pollArr) => {
        // 如果传入的数据包含因子，则将因子设置为传入的值
        const params = SentencedToEmpty(this.props, [
            'navigation', 'state', 'params', 'params'
        ], {});
        if ('PollutantCode' in params) {
            if (params.PollutantCode != 'All') {
                let index = pollArr.findIndex((item) => {
                    return item.PollutantCode == params.PollutantCode;
                });
                if (index != -1) {
                    this.props.dispatch(createAction('pointDetails/updateState')({
                        selectCodeArr: [
                            { AlarmType: 0, Color: null, DGIMN: null, LowerValue: null, PollutantCode: params.PollutantCode, PollutantName: pollArr[index].PollutantName, Sort: 1, StandardValue: null, StandardValueStr: null, Unit: '', UpperValue: null }
                        ]
                    }));
                }
            } else {
                // 传入参数为All则不需要修改，获取因子后就会全部选中
            }
        }

        if (isSuc == true && pollArr.length > 0) {
            that.onChange(this.props.showIndex);
        } else if (isSuc == true && pollArr.length == 0) {
            ShowToast('该站点暂未配置污染因子');
        } else {
            ShowToast('获取污染因子失败，请退出重试');
        }
    }

    getViewWidth = () => {
        const width = SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Portrait'
            ? SCREEN_WIDTH : SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Landscape'
                ? SCREEN_HEIGHT : SCREEN_WIDTH;
        return width;
    }

    getViewHeight = () => {
        const height = SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Portrait'
            ? SCREEN_HEIGHT : SentencedToEmpty(this.props, ['screenOrientation'], '') == 'Landscape'
                ? SCREEN_WIDTH - 50 : SCREEN_HEIGHT;
        return height;
    }

    render() {
        const { showIndex } = this.props;
        if (this.props.PollantCodes.length > 0) {
            return (
                <View>
                    {/* {this.props.chartOrList == 'chart' ? ( */}
                    <View style={{
                        // width: SCREEN_WIDTH,
                        width: this.getViewWidth(),
                        height: '100%'
                    }}>
                        <View style={[{
                            flexDirection: 'row', height: 44
                            , width: SCREEN_WIDTH, alignItems: 'center'
                            , justifyContent: 'space-between'
                            , backgroundColor: 'white', marginBottom: 5
                        }]}
                        >
                            {
                                ['小时', '日均', '实时', '分钟'].map((item, index) => <SDLTabButton
                                    topButtonWidth={SCREEN_WIDTH / 4}
                                    selected={index == this.props.showIndex}
                                    label={item}
                                    onPress={obj => {
                                        this.onChange(index, this.props.chartOrList);
                                    }}
                                />)
                            }
                            {/* <SDLTabButton
                                    topButtonWidth={SCREEN_WIDTH / 4}
                                    selected={true}
                                    label='小时'
                                />
                                <SDLTabButton
                                    topButtonWidth={SCREEN_WIDTH / 4}
                                    selected={false}
                                    label='日均'
                                />
                                <SDLTabButton
                                    topButtonWidth={SCREEN_WIDTH / 4}
                                    selected={false}
                                    label='分钟'
                                />
                                <SDLTabButton
                                    topButtonWidth={SCREEN_WIDTH / 4}
                                    selected={false}
                                    label='月均'
                                />  */}
                        </View>
                        {this.props.chartOrList == 'chart' ?
                            this.props.showIndex == 0 ?
                                <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.hour = ref)}
                                    listKey="a" key="1" tabLabel="小时"
                                    onScroll={this.onScroll} datatype="hour"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN} />
                                : this.props.showIndex == 1 ? <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.day = ref)} listKey="b"
                                    key="2" tabLabel="日均"
                                    onScroll={this.onScroll} datatype="day"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN} />
                                    : this.props.showIndex == 2 ? <HistoryDataChart
                                        goToPage={this.goToPage}
                                        setRightButtonState={this.setRightButtonState}
                                        onRef={ref => (this.realtime = ref)}
                                        listKey="c"
                                        key="3"
                                        tabLabel="实时"
                                        onScroll={this.onScroll}
                                        datatype="realtime"
                                        showIndex={this.props.showIndex}
                                        dgimn={this.props.route.params.params.DGIMN}
                                    />
                                        : this.props.showIndex == 3 ? <HistoryDataChart
                                            goToPage={this.goToPage}
                                            setRightButtonState={this.setRightButtonState}
                                            onRef={ref => (this.minute = ref)}
                                            listKey="d"
                                            key="4"
                                            tabLabel="分钟"
                                            onScroll={this.onScroll}
                                            datatype="minute"
                                            showIndex={this.props.showIndex}
                                            dgimn={this.props.route.params.params.DGIMN}
                                        />
                                            : null

                            :
                            showIndex == 0 ? <HistoryDataList
                                goToPage={this.goToPage}
                                setRightButtonState={this.setRightButtonState}
                                onRef={ref => (this.hourl = ref)} listKey="e" key="5" tabLabel="小时" onScroll={this.onScroll} datatype="hour" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                :
                                showIndex == 1 ? <HistoryDataList
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.dayl = ref)} listKey="f" key="6" tabLabel="日均" onScroll={this.onScroll} datatype="day" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                    :
                                    showIndex == 2 ? <HistoryDataList
                                        goToPage={this.goToPage}
                                        setRightButtonState={this.setRightButtonState}
                                        onRef={ref => (this.realtimel = ref)}
                                        listKey="g"
                                        key="7"
                                        tabLabel="实时"
                                        onScroll={this.onScroll}
                                        datatype="realtime"
                                        showIndex={this.props.showIndex}
                                        dgimn={this.props.route.params.params.DGIMN}
                                    />
                                        :
                                        showIndex == 3 ? <HistoryDataList
                                            goToPage={this.goToPage}
                                            setRightButtonState={this.setRightButtonState}
                                            onRef={ref => (this.minutel = ref)}
                                            listKey="h"
                                            key="8"
                                            tabLabel="分钟"
                                            onScroll={this.onScroll}
                                            datatype="minute"
                                            showIndex={this.props.showIndex}
                                            dgimn={this.props.route.params.params.DGIMN}
                                        />
                                            :
                                            null
                        }

                        {/* {SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '') == '5' ? (
                            <HistoryDataList
                                goToPage={this.goToPage}
                                setRightButtonState={this.setRightButtonState}
                                onRef={ref => (this.monthl = ref)}
                                listKey="h"
                                key="9"
                                tabLabel="月均"
                                onScroll={this.onScroll}
                                datatype="month"
                                showIndex={this.props.showIndex}
                                dgimn={this.props.route.params.params.DGIMN}
                            />
                        ) : null} */}
                    </View>
                    {/* <ScrollableTabView
                                ref='tabView'
                                onChangeTab={obj => {
                                    this.props.chartOrList == 'chart' ? this.onChange(obj.i) : null;
                                }}
                                initialPage={this.props.showIndex}
                                page={this.props.showIndex}
                                style={{ flex: 1 }}
                                renderTabBar={() => <DefaultTabBar tabStyle={{ marginTop: 12 }} />}
                                tabBarUnderlineStyle={{ width: SCREEN_WIDTH / 4, height: 1, backgroundColor: '#4aa0ff', marginBottom: -1 }}
                                tabBarPosition="top"
                                locked={true}
                                scrollWithoutAnimation={false}
                                tabBarUnderlineColor="#4aa0ff"
                                tabBarBackgroundColor="#FFFFFF"
                                tabBarActiveTextColor="#4aa0ff"
                                tabBarInactiveTextColor="#666666"
                                tabBarTextStyle={{ fontSize: 13 }}
                            >
                                <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.hour = ref)} listKey="a" key="1" tabLabel="小时" onScroll={this.onScroll} datatype="hour" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.day = ref)} listKey="b" key="2" tabLabel="日均" onScroll={this.onScroll} datatype="day" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.realtime = ref)}
                                    listKey="c"
                                    key="3"
                                    tabLabel="实时"
                                    onScroll={this.onScroll}
                                    datatype="realtime"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN}
                                />
                                <HistoryDataChart
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.minute = ref)}
                                    listKey="d"
                                    key="4"
                                    tabLabel="分钟"
                                    onScroll={this.onScroll}
                                    datatype="minute"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN}
                                />
                                {SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '') == '5' ? (
                                    <HistoryDataChart
                                        goToPage={this.goToPage}
                                        setRightButtonState={this.setRightButtonState}
                                        onRef={ref => (this.month = ref)}
                                        listKey="d"
                                        key="5"
                                        tabLabel="月均"
                                        onScroll={this.onScroll}
                                        datatype="month"
                                        showIndex={this.props.showIndex}
                                        dgimn={this.props.route.params.params.DGIMN}
                                    />
                                ) : null}
                            </ScrollableTabView> */}

                    {/* ) :  */}



                    {/* } */}
                    {/* {this.props.chartOrList == 'chart' ? null : ( */}
                    {/*      <View style={{ width: this.getViewWidth(), height: this.getViewHeight() }}> */}

                    {/* <ScrollableTabView
                                ref='tabView'
                                onChangeTab={obj => {
                                    this.props.chartOrList == 'chart' ? null : this.onChange(obj.i);
                                }}
                                initialPage={this.props.showIndex}
                                page={this.props.showIndex}
                                style={{ height: SCREEN_HEIGHT }}
                                renderTabBar={() => <DefaultTabBar tabStyle={{ marginTop: 12 }} />}
                                tabBarUnderlineStyle={{ width: SCREEN_WIDTH / 4, height: 1, backgroundColor: '#4aa0ff', marginBottom: -1 }}
                                tabBarPosition="top"
                                locked={true}
                                scrollWithoutAnimation={false}
                                tabBarUnderlineColor="#4aa0ff"
                                tabBarBackgroundColor="#FFFFFF"
                                tabBarActiveTextColor="#4aa0ff"
                                tabBarInactiveTextColor="#666666"
                                tabBarTextStyle={{ fontSize: 13 }}
                            >
                                <HistoryDataList
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.hourl = ref)} listKey="e" key="5" tabLabel="小时" onScroll={this.onScroll} datatype="hour" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                <HistoryDataList
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.dayl = ref)} listKey="f" key="6" tabLabel="日均" onScroll={this.onScroll} datatype="day" showIndex={this.props.showIndex} dgimn={this.props.route.params.params.DGIMN} />
                                <HistoryDataList
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.realtimel = ref)}
                                    listKey="g"
                                    key="7"
                                    tabLabel="实时"
                                    onScroll={this.onScroll}
                                    datatype="realtime"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN}
                                />
                                <HistoryDataList
                                    goToPage={this.goToPage}
                                    setRightButtonState={this.setRightButtonState}
                                    onRef={ref => (this.minutel = ref)}
                                    listKey="h"
                                    key="8"
                                    tabLabel="分钟"
                                    onScroll={this.onScroll}
                                    datatype="minute"
                                    showIndex={this.props.showIndex}
                                    dgimn={this.props.route.params.params.DGIMN}
                                />
                                {SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '') == '5' ? (
                                    <HistoryDataList
                                        goToPage={this.goToPage}
                                        setRightButtonState={this.setRightButtonState}
                                        onRef={ref => (this.monthl = ref)}
                                        listKey="h"
                                        key="9"
                                        tabLabel="月均"
                                        onScroll={this.onScroll}
                                        datatype="month"
                                        showIndex={this.props.showIndex}
                                        dgimn={this.props.route.params.params.DGIMN}
                                    />
                                ) : null}
                            </ScrollableTabView> */}
                    {/*  </View> */}
                    {/* )} */}
                </View>
            );
        }
        return null;
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
