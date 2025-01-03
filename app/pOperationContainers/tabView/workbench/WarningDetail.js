/*
 * @Description: 预警详情，分钟数据报警
 * @LastEditors: hxf
 * @Date: 2022-08-22 16:15:44
 * @LastEditTime: 2025-01-03 10:27:10
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/workbench/WarningDetail.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, Touchable, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SDLText, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import PointBar from '../../../pollutionContainers/components/PointBar';
import TextLabel from '../../../pollutionContainers/components/TextLabel';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils';

@connect(({ pointDetails, taskModel, app }) => ({
    isVerifyOrHandle: app.isVerifyOrHandle,
    alarmRecordsListData: pointDetails.alarmRecordsListData,
    alarmRecordsListDataSelected: pointDetails.alarmRecordsListDataSelected,
    alarmRecordsTotal: pointDetails.alarmRecordsTotal,
    alarmRecordsListResult: pointDetails.alarmRecordsListResult,
    alarmRecordsIndex: pointDetails.alarmRecordsIndex,
    alarmRecordsPointInfo: pointDetails.alarmRecordsPointInfo,
    alarmRecordsListTargetDGIMN: pointDetails.alarmRecordsListTargetDGIMN,
    isAlarmRes: taskModel.isAlarmRes
}))
export default class WarningDetail extends Component {

    static navigationOptions = createNavigationOptions({
        title: '报警详情',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let beginTime, endTime;
        beginTime = moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD 00:00:00');
        endTime = moment().format('YYYY-MM-DD 23:59:59');

        this.props.dispatch(
            createAction('pointDetails/updateState')({
                alarmRecordsBeginTime: beginTime,
                alarmRecordsEndTime: endTime
            })
        );

        this.statusPageOnRefresh();
    }

    onRefresh = index => {
        this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: index, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [] }));
        this.props.dispatch(createAction('pointDetails/getAlarmRecords')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        let MN = this.props.alarmRecordsListTargetDGIMN;
        this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } }));
        this.props.dispatch(createAction('pointDetails/getAlarmRecords')({}));
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusPage
                    status={this.props.alarmRecordsListResult.status}
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
                    <View style={styles.container}>
                        {SentencedToEmpty(this.props.route, ['params', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail' ? (
                            <PointBar
                                style={{ width: SCREEN_WIDTH, marginBottom: 10 }}
                                DGIMN={SentencedToEmpty(this.props.alarmRecordsPointInfo, ['DGIMN'], null)}
                                entName={SentencedToEmpty(this.props.alarmRecordsPointInfo, ['Abbreviation'], null)}
                                pointName={SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PointName'], null)}
                                status={SentencedToEmpty(this.props.alarmRecordsPointInfo, ['Status'], null)}
                                pollutantType={SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null)}
                            />
                        ) : null}

                        <FlatListWithHeaderAndFooter
                            ref={ref => (this.list = ref)}
                            pageSize={20}
                            hasMore={() => {
                                // return this.props.alarmRecordsListData.length < this.props.alarmRecordsTotal;
                                return false;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                // this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: index }));
                                // this.props.dispatch(createAction('pointDetails/getAlarmRecords')({ setListData: this.list.setListData }));
                            }}
                            renderItem={({ item, index }) => {
                                return (<View onPress={() => this.selectItem(item, index)} style={[{ minHeight: 92, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingLeft: 20, justifyContent: 'center' }]}>
                                    <View style={[{ flexDirection: 'row', alignItems: 'center', height: 42, width: SCREEN_WIDTH - 20 }]}>
                                        {/* 报警响应则创建任务不多选，核实 处置 超标核实进行多选操作 */}
                                        {/* {this.state.functionType == 'OverVerify' || this.state.functionType == 'AlarmVerify' ? (
                                            <Image
                                                style={{ marginRight: 5, height: 21, width: 21 }}
                                                source={SentencedToEmpty(item, ['selected'], false) ? require('../../../images/ic_reported_check.png') : require('../../../images/ic_reported_uncheck.png')}
                                            />
                                        ) : null} */}
                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                            {SentencedToEmpty(item, ['FirstTime'], '')}
                                        </SDLText>
                                        {SentencedToEmpty(item, ['AlarmTag'], '')
                                            .split(',')
                                            .map((typeT, index) => {
                                                if (typeT != '') {
                                                    return <TextLabel key={`${typeT}-${index}`} style={{ marginLeft: 3 }} color={'#ff5b5a'} text={typeT} />;
                                                }
                                            })}
                                        {
                                            /**
                                             *    State = expl.State,
                                                    StateName = expl.State == "1" ? "" : "响应超时"
                                             */
                                            SentencedToEmpty(item, ['State'], -1) == 2 ? <View style={[{ height: 42, flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }]}>
                                                <Image source={require('../../../images/ic_response_timeout.png')}
                                                    style={[{ width: 52, height: 16 }]}
                                                />
                                            </View> : null
                                        }

                                    </View>
                                    <View style={[{ width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#E7E7E7' }]}></View>
                                    <View style={[{ marginTop: 10 }]} onPress={() => this._onItemClick(item)}>
                                        <SDLText fontType={'normal'} style={[{ color: '#666', lineHeight: 20, width: SCREEN_WIDTH - 40 }]}>
                                            {SentencedToEmpty(item, ['AlarmMsg'], '暂无提示信息')}
                                        </SDLText>
                                    </View>
                                    <View style={[{ marginBottom: 8, marginTop: 8, flexDirection: 'row', alignItems: 'center' }]} >
                                        <Image source={require('../../../images/ic_time.png')}
                                            style={[{ width: 12, height: 12, marginRight: 4 }]}
                                        />
                                        <SDLText fontType={'small'} style={[{ color: '#AAAAAA', lineHeight: 20, width: SCREEN_WIDTH - 40 }]}>
                                            {`报警生成时间：${SentencedToEmpty(item, ['CreateTime'], 'xxxx-xx-xx xx:xx')}`}
                                        </SDLText>
                                    </View>

                                    {
                                        /**
                                         * 以前缺失报警不显示 查看报警数据
                                         * item.AlarmType == 12 ? null
                                         * 
                                         * 10102 APP缺失报警也增加上查看数据功能。（APP端）
                                         * 要求缺失数据也展示相关功能
                                         * 
                                         * // 缺失数据不展示历史数据
                                         * item.AlarmType == 12 ? null
                                         */

                                        <TouchableOpacity
                                            onPress={() => {
                                                // if (SentencedToEmpty(item, ['DataType'], '') == 'DayData') {
                                                //     this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).format('YYYY-MM-DD 00:00:00') }));
                                                // } else {
                                                //     this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss') }));
                                                // }
                                                // this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: item } }));
                                                this.props.dispatch(createAction('pointDetails/updateState')({
                                                    selectTime: moment(item.AlarmTime)
                                                        // .subtract(3, 'hours')
                                                        .format('YYYY-MM-DD HH:mm:ss')
                                                }));
                                                this.props.dispatch(createAction('historyDataModel/updateState')({
                                                    showIndex: 3, // 0 小时 1 日均 2 实时 3 分钟
                                                }));
                                                this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: { sourceType: 'OverWarning', ...item } } }));
                                            }}
                                            style={{ width: SCREEN_WIDTH / 2, height: 22 }}>
                                            <Text style={{ color: globalcolor.headerBackgroundColor, fontSize: 14, textDecorationLine: 'underline' }}>{'查看报警数据'}</Text>
                                        </TouchableOpacity>
                                    }
                                </View>);
                                return (<View
                                    onPress={() => {
                                        this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss') }));
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: { sourceType: 'OverWarning', ...item } } }));
                                    }}
                                    style={[{ minHeight: 92, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13, justifyContent: 'center' }]} >
                                    <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }]}>
                                        {/* 报警响应则创建任务不多选，核实 处置 超标核实进行多选操作 */}
                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                            {SentencedToEmpty(item, ['AlarmTime'], 'xxxx-xx-xx xx:xx')}
                                        </SDLText>
                                        {SentencedToEmpty(item, ['AlarmTag'], '')
                                            .split(',')
                                            .map((typeT, index) => {
                                                if (typeT != '') {
                                                    return <TextLabel key={`${typeT}-${index}`} style={{ marginLeft: 3 }} color={'#ff5b5a'} text={typeT} />;
                                                }
                                            })}
                                    </View>
                                    <View style={[{ marginTop: 10 }]} >
                                        <SDLText fontType={'normal'} style={[{ color: '#666', lineHeight: 20 }]}>
                                            {`报警生成时间：${SentencedToEmpty(item, ['CreateTime'], 'xxxx-xx-xx xx:xx')}`}
                                        </SDLText>
                                    </View>
                                    <View style={[{ marginBottom: 15, marginTop: 10 }]} onPress={() => this._onItemClick(item)}>
                                        <SDLText fontType={'small'} style={[{ color: '#666', lineHeight: 20 }]}>
                                            {SentencedToEmpty(item, ['AlarmMsg'], '暂无提示信息')}
                                        </SDLText>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss') }));
                                            this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: { sourceType: 'OverWarning', ...item } } }));
                                        }}
                                        style={{ width: SCREEN_WIDTH / 2, height: 22 }}>
                                        <Text style={{ color: globalcolor.headerBackgroundColor, fontSize: 14, textDecorationLine: 'underline' }}>{'查看报警数据'}</Text>
                                    </TouchableOpacity>
                                </View>);
                            }}
                            data={this.props.alarmRecordsListData}
                        />
                    </View>
                </StatusPage>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }
});