import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText, SimpleLoadingComponent } from '../../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, transformColorToTransparency, ShowToast } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../../components/FlatListWithHeaderAndFooter';
import PointBar from '../../../pollutionContainers/components/PointBar';
import TextLabel from '../../../pollutionContainers/components/TextLabel';
import { getToken } from '../../../dvapack/storage';
import globalcolor from '../../../config/globalcolor';
import { CURRENT_PROJECT } from '../../../config';
import BottomDialog from '../../../components/modal/BottomDialog';
import { alarmResponseing } from '../../../pOperationModels/taskModel';

/**
 * 报警记录/报警详情
 */
@connect(({ pointDetails, taskModel, app, alarm }) => ({
    isVerifyOrHandle: app.isVerifyOrHandle,
    alarmRecordsListData: pointDetails.alarmRecordsListData,
    alarmRecordsListDataSelected: pointDetails.alarmRecordsListDataSelected,
    alarmRecordsTotal: pointDetails.alarmRecordsTotal,
    alarmRecordsListResult: pointDetails.alarmRecordsListResult,
    alarmRecordsIndex: pointDetails.alarmRecordsIndex,
    alarmRecordsPointInfo: pointDetails.alarmRecordsPointInfo,
    alarmRecordsListTargetDGIMN: pointDetails.alarmRecordsListTargetDGIMN,
    isAlarmRes: taskModel.isAlarmRes,
    relatedToAlarmsTaskId: taskModel.relatedToAlarmsTaskId,

    alarmResponseAlarmDetailResult: alarm.alarmResponseAlarmDetailResult, //报警响应报警详情
    alarmResponseAlarmDetailData: alarm.alarmResponseAlarmDetailData, //报警响应报警详情
    responseRecordType: alarm.responseRecordType,
}))
export default class AlarmResponseAlarmDetail extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        const rightType = SentencedToEmpty(navigation, ['state', 'params', 'rightButtonType'], '');
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail' ? '报警详情' : '现场处置',
            headerRight: <View></View>
        });
    };

    constructor(props) {
        super(props);
        const { functionType } = this.props.route.params.params;
        this.state = {
            datatype: 0,
            functionType: functionType, //AlarmDetail 查看报警详情，AlarmResponse 报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)， AssociatedAlarm 任务关联报警 
            commitLoading: 200
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail' ? '报警详情' : '现场处置',
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onRefresh = index => {
        this.props.dispatch(createAction('alarm/updateState')({
            alarmResponseAlarmDetailResult: { status: -1 },
        }));
        if (this.props.responseRecordType == 'WorkbenchException'
            || this.props.responseRecordType == 'WorkbenchMiss'
        ) {
            this.props.dispatch(
                createAction('alarm/getExResponseInfoList')({
                    params: {
                    }
                })
            );
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            this.props.dispatch(
                createAction('alarm/getOverResponseInfoList')({
                    params: {
                    }
                })
            );
        }
    };

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('alarm/updateState')({
            alarmResponseAlarmDetailResult: { status: -1 },
        }));
        if (this.props.responseRecordType == 'WorkbenchException'
            || this.props.responseRecordType == 'WorkbenchMiss'
        ) {
            this.props.dispatch(
                createAction('alarm/getExResponseInfoList')({
                    params: {
                    }
                })
            );
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            this.props.dispatch(
                createAction('alarm/getOverResponseInfoList')({
                    params: {
                    }
                })
            );
        }
    };

    _onItemClick = item => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AlarmVerify', params: { alramData: [item], onRefresh: this.onRefresh } }));
    };

    selectItem = (item, index) => {

    };

    render() {
        // CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' && this.props.alarmRecordsListData.length > 0 && (this.state.functionType == 'AlarmResponse' || this.state.functionType == 'WorkbenchMiss'
        return (
            <View style={styles.container}>
                <StatusPage
                    status={this.props.alarmResponseAlarmDetailResult.status}
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
                            ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 4, backgroundColor: '#f2f2f2' }]} />}
                            pageSize={20}
                            hasMore={() => {
                                return false;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: index }));
                                this.props.dispatch(createAction('pointDetails/getAlarmRecords')({ setListData: this.list.setListData }));
                            }}
                            renderItem={({ item, index }) => {
                                if (this.state.functionType == 'TrendException') {
                                    return (
                                        <Touchable onPress={() => this.selectItem(item, index)} style={[{ minHeight: 110, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13, justifyContent: 'center' }]}>
                                            <View style={[{ flexDirection: 'row', alignItems: 'center', height: 42, alignItems: 'center' }]}>
                                                {/* 报警响应则创建任务不多选，核实 处置 超标核实进行多选操作 */}
                                                {/* <Image
                                                    style={{ marginRight: 5, height: 21, width: 21 }}
                                                    source={SentencedToEmpty(item, ['selected'], false) ? require('../../../images/ic_reported_check.png') : require('../../../images/ic_reported_uncheck.png')}
                                                /> */}
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
                                            </View>
                                            <View style={[{ width: SCREEN_WIDTH - 40, marginLeft: 7, height: 1, backgroundColor: '#E7E7E7' }]}></View>
                                            <View style={[{ marginTop: 10 }]} >
                                                <SDLText fontType={'normal'} style={[{ color: '#666', lineHeight: 20 }]}>
                                                    {`报警生成时间：${SentencedToEmpty(item, ['CreateTime'], '暂无提示信息')}`}
                                                </SDLText>
                                            </View>
                                            <View style={[{ marginBottom: 10, marginTop: 10 }]} >
                                                <SDLText fontType={'small'} style={[{ color: '#666', lineHeight: 20 }]}>
                                                    {SentencedToEmpty(item, ['AlarmMsg'], '暂无提示信息')}
                                                </SDLText>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'TrendAlarmDataChart', params: item }));
                                                }}
                                                style={{ width: SCREEN_WIDTH / 2, height: 22 }}>
                                                <Text style={{ color: globalcolor.headerBackgroundColor, fontSize: 14, textDecorationLine: 'underline' }}>{'查看变化趋势'}</Text>
                                            </TouchableOpacity>
                                        </Touchable>
                                    );
                                } else {
                                    return (
                                        <Touchable onPress={() => this.selectItem(item, index)} style={[{ minHeight: 92, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingLeft: 20, justifyContent: 'center' }]}>
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

                                                // <TouchableOpacity
                                                //     onPress={() => {
                                                //         if (SentencedToEmpty(item, ['DataType'], '') == 'DayData') {
                                                //             this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).format('YYYY-MM-DD 00:00:00') }));
                                                //         } else {
                                                //             this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss') }));
                                                //         }
                                                //         this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: item } }));
                                                //         // this.props.dispatch(NavigationActions.navigate({ routeName: 'TrendAlarmDataChart', params: item }));
                                                //     }}
                                                //     style={{ width: SCREEN_WIDTH / 2, height: 22 }}>
                                                //     <Text style={{ color: globalcolor.headerBackgroundColor, fontSize: 14, textDecorationLine: 'underline' }}>{'查看报警数据'}</Text>
                                                // </TouchableOpacity>
                                            }
                                        </Touchable>
                                    );
                                }
                            }}
                            data={this.props.alarmResponseAlarmDetailData}
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
