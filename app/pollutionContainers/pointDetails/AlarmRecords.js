import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText, SimpleLoadingComponent, AlertDialog } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, transformColorToTransparency, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';
import PointBar from '../components/PointBar';
import TextLabel from '../components/TextLabel';
import { getToken } from '../../dvapack/storage';
import globalcolor from '../../config/globalcolor';
import { CURRENT_PROJECT } from '../../config';
import BottomDialog from '../../components/modal/BottomDialog';
import { alarmResponseing } from '../../pOperationModels/taskModel';

/**
 * 报警记录/报警详情
 */
@connect(({ pointDetails, taskModel, app }) => ({
    isVerifyOrHandle: app.isVerifyOrHandle,
    alarmRecordsListData: pointDetails.alarmRecordsListData,
    alarmRecordsListDataSelected: pointDetails.alarmRecordsListDataSelected,
    alarmRecordsTotal: pointDetails.alarmRecordsTotal,
    alarmRecordsListResult: pointDetails.alarmRecordsListResult,
    alarmRecordsIndex: pointDetails.alarmRecordsIndex,
    alarmRecordsPointInfo: pointDetails.alarmRecordsPointInfo,
    alarmRecordsListTargetDGIMN: pointDetails.alarmRecordsListTargetDGIMN,
    isAlarmRes: taskModel.isAlarmRes,
    relatedToAlarmsTaskId: taskModel.relatedToAlarmsTaskId
}))
export default class AlarmRecords extends PureComponent {
    // static navigationOptions = ({ navigation }) => {
    //     const rightType = SentencedToEmpty(navigation, ['state', 'params', 'rightButtonType'], '');
    //     return createNavigationOptions({
    //         title: SentencedToEmpty(navigation, ['state', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail' ? '报警详情' : '现场处置',
    //         headerRight: <View></View>
    //     });
    // };

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
        let beginTime, endTime;
        if (SentencedToEmpty(this.props.route, ['params', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail') {
            beginTime = moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD 00:00:00');
            endTime = moment().format('YYYY-MM-DD 23:59:59');
        } else {
            beginTime = moment()
                .subtract(7, 'day')
                .format('YYYY-MM-DD 00:00:00');
            endTime = moment().format('YYYY-MM-DD 23:59:59');
        }

        this.props.dispatch(
            createAction('pointDetails/updateState')({
                alarmRecordsBeginTime: beginTime,
                alarmRecordsEndTime: endTime
            })
        );

        this.statusPageOnRefresh();
    }

    componentWillUnmount() {
        if (this.state.functionType == 'TrendException'
            || this.state.functionType == 'AlarmResponse'
        ) {
            this.getCount();
            this.props.dispatch(
                createAction('alarm/getAlarmRecords')({
                    params: {
                        BeginTime: moment()
                            .format('YYYY-MM-DD 00:00:00'),
                        EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        AlarmType: '2',
                        PageIndex: 1,
                        PageSize: 20
                    },
                })
            );
        }
    }

    getCount = () => {
        this.props.dispatch(createAction('alarm/getAlarmCount')({
            params: {
                alarmType: 'WorkbenchException'
            }
        }));
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        endTime = moment().format('YYYY-MM-DD 23:59:59');
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        alarmRecordsIndex: 1,
                        alarmRecordsTotal: 0,
                        alarmRecordsBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        alarmRecordsEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );
                // this.list.onRefresh();
                if (this.props.alarmRecordsListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    getAlarmTypeSelectOption = () => {
        const dataArr = [{ code: 0, name: '数据异常' }, { code: 1, name: '参数异常' }, { code: 2, name: '数据超标' }, { code: 3, name: '状态异常' }, { code: 4, name: '逻辑异常' }, { code: 5, name: '超标预警' }];
        const dataArrEx = [{ code: 0, name: '数据异常' }, { code: 2, name: '数据超标' }, { code: 5, name: '超标预警' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '报警类型',
            defaultCode: '',
            dataArr: CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? dataArrEx : dataArr,
            onSelectListener: item => {
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        alarmType: item.code
                    })
                );
                // this.list.onRefresh();
                if (this.props.alarmRecordsListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    onRefresh = index => {
        this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: index, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [] }));
        this.props.dispatch(createAction('pointDetails/getAlarmRecords')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        let MN = this.props.alarmRecordsListTargetDGIMN;
        this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } }));
        // 获取报警信息
        this.props.dispatch(createAction('pointDetails/getAlarmRecords')({}));
        if (CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') {
            let params = {
                // ImplementDate: this.state.selectTime,
                taskFrom: '2',
                // remark: this.state.remark,
                DGIMNs: MN
                // createUserId:getToken().UserId,
                // operationsUserId:getToken().UserId
            };
            // 如果是缺失数据报警则增加此标示
            if (this.state.functionType == 'WorkbenchMiss') {
                params.missData = 1;
            }
            // 获取按钮状态
            this.props.dispatch(
                createAction('taskModel/isAlarmResponse')({
                    params
                    , callback: () => {
                        const { functionType } = this.props.route.params.params;
                    }
                })
            );
        }
    };

    _onItemClick = item => {
        this.props.dispatch(NavigationActions.navigate({ routeName: 'AlarmVerify', params: { alramData: [item], onRefresh: this.onRefresh } }));
    };

    selectItem = (item, index) => {
        let newAlarmRecordsListData = this.props.alarmRecordsListData.concat([]);
        let newAlarmRecordsListDataSelected = { ...this.props.alarmRecordsListDataSelected };
        if (SentencedToEmpty(newAlarmRecordsListData[index], ['selected'], false)) {
            newAlarmRecordsListData[index].selected = false;
            delete newAlarmRecordsListDataSelected[index];
        } else {
            newAlarmRecordsListData[index].selected = true;
            newAlarmRecordsListDataSelected[index] = item;
        }
        this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsListData: newAlarmRecordsListData, alarmRecordsListDataSelected: newAlarmRecordsListDataSelected }));
        this.list.setListData(newAlarmRecordsListData);
    };

    cancelButton = () => { }
    confirm = () => {
        let recordType = '';
        this.setState({ commitLoading: -1 }, () => {
            //如果是废气废水的话默认响应巡检标签，扬尘或者voc响应维修标签
            if (SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null) == 2) {
                //废气
                // recordType = '2'; //维护/维修
                recordType = '32'; //异常处理
            } else if (SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null) == 1) {
                //废水
                // recordType = '8'; //维护/维修
                recordType = '31'; //异常处理
            } else if (SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null) == 12) {
                //扬尘
                recordType = '28'; //设备异常处理
            } else if (SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null) == 5) {
                //大气
                recordType = '14'; //维护/维修
            } else if (SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null) == 10) {
                //voc
                recordType = '27'; //设备异常处理
            } else {
                recordType = '29'; //设备异常处理
            }
            //this.props.alarmRecordsListData[0].OperationEntCode
            let params = {
                OperationFlag: 1, // 现场处理
                // ImplementDate: this.state.selectTime,
                taskFrom: '2',
                // remark: this.state.remark,
                DGIMNs: this.props.alarmRecordsListTargetDGIMN,
                RecordType: recordType
                // createUserId:getToken().UserId,
                // operationsUserId:getToken().UserId
            };
            // 如果是缺失数据报警则增加此标示
            if (this.state.functionType == 'WorkbenchMiss') {
                params.missData = 1;
            }
            /**
             * 接口中增加 时间记录
             * this.props.alarmRecordsListData
             * beginTime、endTime
             */
            const alarmlist = this.props.alarmRecordsListData;
            if (alarmlist.length > 0) {
                params.endTime = alarmlist[0].AlarmTime;
                params.beginTime = alarmlist[alarmlist.length - 1].AlarmTime;
            }
            let alarmID = [];
            alarmlist.map((item, index) => {
                // 待定
                alarmID.push(item.ID);
            });
            params.alarmID = alarmID;
            this.props.dispatch(
                createAction('taskModel/alarmResponse')({
                    params
                    , successCallback: () => {
                        this.setState({ commitLoading: 200 });
                        this.props.dispatch(NavigationActions.back({ routeName: 'Workbench' }));
                    }
                    , failureCallBack: () => {
                        this.setState({ commitLoading: 200 });
                    }
                })
            );
        });
    }

    render() {
        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要现场处理该报警信息吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        // CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' && this.props.alarmRecordsListData.length > 0 && (this.state.functionType == 'AlarmResponse' || this.state.functionType == 'WorkbenchMiss'
        return (
            <View style={styles.container}>
                {SentencedToEmpty(this.props.route, ['params', 'params', 'pageType'], 'AlarmDetail') == 'AlarmDetail' ? null : (
                    <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#fff', marginBottom: 10 }]}>
                        <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                        {/* <SimplePicker option={this.getAlarmTypeSelectOption()} /> */}
                    </View>
                )}

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
                            ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 4, backgroundColor: '#f2f2f2' }]} />}
                            pageSize={20}
                            hasMore={() => {
                                return this.props.alarmRecordsListData.length < this.props.alarmRecordsTotal;
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
                                                <Image
                                                    style={{ marginRight: 5, height: 21, width: 21 }}
                                                    source={SentencedToEmpty(item, ['selected'], false) ? require('../../images/ic_reported_check.png') : require('../../images/ic_reported_uncheck.png')}
                                                />
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
                                                {this.state.functionType == 'OverVerify' || this.state.functionType == 'AlarmVerify' ? (
                                                    <Image
                                                        style={{ marginRight: 5, height: 21, width: 21 }}
                                                        source={SentencedToEmpty(item, ['selected'], false) ? require('../../images/ic_reported_check.png') : require('../../images/ic_reported_uncheck.png')}
                                                    />
                                                ) : null}
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
                                                        <Image source={require('../../images/ic_response_timeout.png')}
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
                                                <Image source={require('../../images/ic_time.png')}
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
                                                        if (SentencedToEmpty(item, ['DataType'], '') == 'DayData') {
                                                            this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).format('YYYY-MM-DD 00:00:00') }));
                                                        } else {
                                                            this.props.dispatch(createAction('pointDetails/updateState')({ selectTime: moment(item.AlarmTime).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss') }));
                                                        }
                                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: item.DGIMN, params: item } }));
                                                        // this.props.dispatch(NavigationActions.navigate({ routeName: 'TrendAlarmDataChart', params: item }));
                                                    }}
                                                    style={{ width: SCREEN_WIDTH / 2, height: 22 }}>
                                                    <Text style={{ color: globalcolor.headerBackgroundColor, fontSize: 14, textDecorationLine: 'underline' }}>{'查看报警数据'}</Text>
                                                </TouchableOpacity>
                                            }
                                        </Touchable>
                                    );
                                }
                            }}
                            data={this.props.alarmRecordsListData}
                        />
                    </View>
                    {(this.state.functionType == 'TrendException') && this.props.alarmRecordsListData.length > 0 ? (
                        <Touchable
                            onPress={() => {
                                //多选点击右上角进行核实
                                let newArray = [];
                                let that = this;
                                Object.keys(this.props.alarmRecordsListDataSelected).forEach(function (key) {
                                    newArray.push(that.props.alarmRecordsListDataSelected[key]);
                                });
                                if (newArray.length > 0) {
                                    // if (this.state.functionType == 'AlarmVerify') {
                                    //     //监控 进行核实或者处置
                                    //     if (this.props.isVerifyOrHandle == 'handle') {
                                    //         this.props.dispatch(NavigationActions.navigate({ routeName: 'Disposal', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                    //     } else {
                                    //         this.props.dispatch(NavigationActions.navigate({ routeName: 'AlarmVerify', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                    //     }
                                    // } else 
                                    if (this.state.functionType == 'TrendException') {
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'TrendAlarmVerify', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                    } else {
                                        //运维进行超标核实
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'OverAlarmVerify', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                    }
                                } else {
                                    ShowToast('未选中任何报警记录');
                                }
                            }}
                            style={{
                                marginBottom: 10,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH - 20,
                                marginLeft: 10,
                                height: 52,
                                backgroundColor: globalcolor.headerBackgroundColor
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 18 }}>{this.props.isVerifyOrHandle == 'handle' ? '处置' : '核实'}</Text>
                        </Touchable>
                    ) : null}
                    {(this.state.functionType == 'OverVerify' || this.state.functionType == 'AlarmVerify') && this.props.alarmRecordsListData.length > 0 ? (
                        <Touchable
                            onPress={() => {
                                //多选点击右上角进行核实
                                let newArray = [];
                                let that = this;
                                Object.keys(this.props.alarmRecordsListDataSelected).forEach(function (key) {
                                    newArray.push(that.props.alarmRecordsListDataSelected[key]);
                                });
                                if (newArray.length > 0) {
                                    if (this.state.functionType == 'AlarmVerify') {
                                        //监控 进行核实或者处置
                                        if (this.props.isVerifyOrHandle == 'handle') {
                                            this.props.dispatch(NavigationActions.navigate({ routeName: 'Disposal', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                        } else {
                                            this.props.dispatch(NavigationActions.navigate({ routeName: 'AlarmVerify', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                        }
                                    } else {
                                        //运维进行超标核实
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'OverAlarmVerify', params: { alramData: newArray, onRefresh: this.statusPageOnRefresh } }));
                                    }
                                } else {
                                    ShowToast('未选中任何报警记录');
                                }
                            }}
                            style={{
                                marginBottom: 10,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: SCREEN_WIDTH - 20,
                                marginLeft: 10,
                                height: 52,
                                backgroundColor: globalcolor.headerBackgroundColor
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 18 }}>{this.props.isVerifyOrHandle == 'handle' ? '处置' : '核实'}</Text>
                        </Touchable>
                    ) : null}
                    {CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' && this.props.alarmRecordsListData.length > 0 && (this.state.functionType == 'AlarmResponse' || this.state.functionType == 'WorkbenchMiss') ? (
                        <Touchable
                            onPress={() => {
                                if (this.props.isAlarmRes == false) {
                                    ShowToast('报警已经生成任务，请到待办中查看');
                                    return;
                                } else {
                                    this.refs.respondTypeSelect.showModal();
                                }
                            }}
                            style={{ marginBottom: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', width: SCREEN_WIDTH - 20, marginLeft: 10, height: 52, backgroundColor: globalcolor.headerBackgroundColor }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 18 }}>{this.props.isAlarmRes == false ? '已响应' : '响应'}</Text>
                        </Touchable>
                    ) : null}
                    {this.state.commitLoading == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                    <BottomDialog ref="respondTypeSelect">
                        <View style={{
                            width: SCREEN_WIDTH - 30, height: 186, borderRadius: 12
                            , alignItems: 'center', justifyContent: 'space-around', backgroundColor: globalcolor.lightGreyBackground
                            , marginBottom: 24
                        }}>
                            <View style={{
                                width: SCREEN_WIDTH - 30, height: 24, flexDirection: 'row', justifyContent: 'flex-end'
                                , borderRadius: 12
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.respondTypeSelect.hideModal();
                                    }}
                                >
                                    <Image style={{ height: 24, width: 24 }} source={require('../../images/icon_reject_approval.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: SCREEN_WIDTH - 30, flex: 2, borderRadius: 12
                                , alignItems: 'center', justifyContent: 'space-around', backgroundColor: globalcolor.lightGreyBackground
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.respondTypeSelect.hideModal();
                                        let recordType = '';
                                        //如果是废气废水的话默认响应巡检标签，扬尘或者voc响应维修标签
                                        const PollutantType = SentencedToEmpty(this.props.alarmRecordsPointInfo, ['PollutantType'], null);
                                        if (PollutantType == 2) {
                                            //废气
                                            // recordType = '2'; //维护/维修
                                            recordType = '32'; //异常处理
                                        } else if (PollutantType == 1) {
                                            //废水
                                            // recordType = '8'; //维护/维修
                                            recordType = '31'; //异常处理
                                        } else if (PollutantType == 12) {
                                            //扬尘
                                            recordType = '28'; //设备异常处理
                                        } else if (PollutantType == 5) {
                                            //大气
                                            recordType = '14'; //维护/维修
                                        } else if (PollutantType == 10) {
                                            //voc
                                            recordType = '27'; //设备异常处理
                                        } else {
                                            recordType = '29'; //设备异常处理
                                        }
                                        let params = {
                                            title: '报警无需处理登记表',
                                            OperationFlag: 3, // 无需处理
                                            recordType,
                                            operationEntCode: SentencedToEmpty(this.props.route, ['params', 'params', 'OperationEntCode'], ''),
                                            DGIMN: SentencedToEmpty(this.props, ['alarmRecordsListResult', 'data', 'Datas', 0, 'DGIMN'], ''),
                                        };
                                        if (this.state.functionType == 'WorkbenchMiss') {
                                            params.missData = 1;
                                        }
                                        /**
                                         * 接口中增加 时间记录
                                         * this.props.alarmRecordsListData
                                         * beginTime、endTime
                                         */
                                        const alarmlist = this.props.alarmRecordsListData;
                                        if (alarmlist.length > 0) {
                                            params.endTime = alarmlist[0].AlarmTime;
                                            params.beginTime = alarmlist[alarmlist.length - 1].AlarmTime;
                                        }
                                        let alarmID = [];
                                        alarmlist.map((item, index) => {
                                            // 待定
                                            alarmID.push(item.ID);
                                        });
                                        params.alarmID = alarmID;
                                        // 无需处理
                                        this.props.dispatch(NavigationActions
                                            .navigate({
                                                routeName: 'RemoteAlarmHandleEditer',
                                                params
                                            }))
                                    }}
                                >
                                    <View style={[{
                                        width: SCREEN_WIDTH - 76, height: 40
                                        , borderRadius: 20, backgroundColor: 'white'
                                        , justifyContent: 'center', alignItems: 'center', borderWidth: 1
                                    }]}>
                                        <Text style={{ fontSize: 15, color: '#666666' }}>{'无需处理'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.respondTypeSelect.hideModal();
                                        let params = {
                                            title: '报警远程处理登记表',
                                            OperationFlag: 2, // 远程处理
                                            DGIMN: SentencedToEmpty(this.props, ['alarmRecordsListResult', 'data', 'Datas', 0, 'DGIMN'], ''),
                                        };
                                        if (this.state.functionType == 'WorkbenchMiss') {
                                            params.missData = 1;
                                        }
                                        /**
                                         * 接口中增加 时间记录
                                         * this.props.alarmRecordsListData
                                         * beginTime、endTime
                                         */
                                        const alarmlist = this.props.alarmRecordsListData;
                                        if (alarmlist.length > 0) {
                                            params.endTime = alarmlist[0].AlarmTime;
                                            params.beginTime = alarmlist[alarmlist.length - 1].AlarmTime;
                                        }
                                        let alarmID = [];
                                        alarmlist.map((item, index) => {
                                            // 待定
                                            alarmID.push(item.ID);
                                        });
                                        params.alarmID = alarmID;
                                        // 远程处理
                                        this.props.dispatch(NavigationActions
                                            .navigate({
                                                routeName: 'RemoteAlarmHandleEditer',
                                                params
                                            }))
                                    }}
                                >
                                    <View style={[{
                                        width: SCREEN_WIDTH - 76, height: 40
                                        , borderRadius: 20, backgroundColor: '#228B22'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}>
                                        <Text style={{ fontSize: 15, color: '#fff' }}>{'远程处理'}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.respondTypeSelect.hideModal(() => {
                                            this.refs.doAlert.show();
                                        });
                                    }}
                                >
                                    <View style={[{
                                        width: SCREEN_WIDTH - 76, height: 40
                                        , borderRadius: 20, backgroundColor: globalcolor.antBlue
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}>
                                        <Text style={{ fontSize: 15, color: '#fff' }}>{'现场处理'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </BottomDialog>
                    <AlertDialog options={alertOptions} ref="doAlert" />
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
