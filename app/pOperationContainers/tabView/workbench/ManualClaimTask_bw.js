/*
 * @Description: 手动领取工单
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2021-09-29 16:40:17
 * @LastEditTime: 2025-04-10 14:38:56
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbench/ManualClaimTask_bw.js
 */

import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, Image, TextInput, Platform, StyleSheet } from 'react-native'
// import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Popover from 'react-native-popover';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../utils';
import MyTabBar from '../../../operationContainers/taskViews/taskExecution/components/MyTabBarWithCount';
import { FlatListWithHeaderAndFooter, OperationAlertDialog, AlertDialog, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import moment from 'moment';
import SDLTabButton from '../../../components/SDLTabButton';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@connect(({ claimTaskModels }) => ({
    claimTaskResultWater: claimTaskModels.claimTaskResultWater,
    claimTaskResultGas: claimTaskModels.claimTaskResultGas,
    tabPageIndex: claimTaskModels.tabPageIndex,
    selectedTaskType: claimTaskModels.selectedTaskType, //1 废气巡检 3 废气校准 7 废水巡检 9 废水校准 20 废气示值误差  33 废气检验测试
    unclaimedWaterTaskCountResult: claimTaskModels.unclaimedWaterTaskCountResult,
    unclaimedGasTaskCountResult: claimTaskModels.unclaimedGasTaskCountResult
}))
export default class ManualClaimTask extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return createNavigationOptions({
    //         title: '领取工单',
    //         headerTitleStyle: { marginRight: 0 },
    //         headerRight: (
    //             <View>
    //                 <TouchableOpacity
    //                     style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
    //                     onPress={(e) => {
    //                         const {
    //                             nativeEvent: { pageX, pageY }
    //                         } = e;
    //                         navigation.state.params.navigateRightPress(pageX, pageY);
    //                     }}
    //                 >
    //                     <Image source={require('../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
    //                 </TouchableOpacity>
    //             </View>
    //         )
    //     });
    // };

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            spinnerRect: {},
            // 废水 1 废气 2
            PollutantType: 1,
            task: null,
        }
        this.props.navigation.setParams({
            navigateRightPress: (pageX, pageY) => {
                this.showSpinner(pageX, pageY);
            }
        });

        this.props.navigation.setOptions({
            headerRight: () => <View>
                <TouchableOpacity
                    style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
                    onPress={(e) => {
                        const {
                            nativeEvent: { pageX, pageY }
                        } = e;
                        this.showSpinner(pageX, pageY);
                    }}
                >
                    <Image source={require('../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
                </TouchableOpacity>
            </View>
        });
    }

    componentDidMount() {
        this.props.dispatch(createAction('claimTaskModels/updateState')({ selectedTaskType: 1, searchWord: '', PollutantType: 2, tabPageIndex: 0, claimTaskResultWater: { status: -1 } }));

        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: { PollutantType: 2, TaskType: '1,3', noCancelFlag: true }, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: { PollutantType: 1, TaskType: '7,9', noCancelFlag: true }, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
    }

    //显示下拉列表
    // showSpinner = (pageX, pageY) => {
    showSpinner = (pageX, pageY) => {
        pageY = 35;
        const width = 44,
            height = 44;
        const placement = 'bottom';
        this.setState({
            isVisible: true,
            spinnerRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
        });
    };

    //隐藏下拉列表
    closeSpinner() {
        this.setState({
            isVisible: false
        });
    }

    getTimeStr = (time) => {
        if (typeof time == 'string'
            && time != ''
        ) {
            const tMoment = moment(time);
            if (tMoment.isValid()) {
                const time = tMoment.format('YYYY-MM-DD HH:mm');
                return time;
            } else {
                return '----/--/-- --:--';
            }
        } else {
            return '----/--/-- --:--';
        }

    }

    getOperationUserTag = (taskStatus, operationUser = '') => {
        if (taskStatus != 11
            && operationUser != ''
        ) {
            return <Text
                style={[{
                    fontSize: 11, color: '#F78259'
                    , position: 'absolute', top: 22, right: 15
                }]}
            >{`${operationUser}已领取`}</Text>
        } else {
            return null;
        }
    }

    _renderItemList = ({ item:
        { pointName, entName, createTime, taskID, overHour
            , overDay, recordTypeName = '--'
            , overTime // 有效期
            , taskStatus // 不等于 11 为已领取
            , operationUser // 领取人
            , dgimn
        } }) => {
        const selectedTaskType = this.props.selectedTaskType;
        return <View style={[{
            height: 140, width: SCREEN_WIDTH, backgroundColor: 'white'
            , justifyContent: 'center'
        }]}>
            <TouchableOpacity
                onPress={() => {
                    if (taskStatus == 11) {
                        this.setState({ task: { pointName, entName, createTime, taskID, overHour, overDay } });
                        this.refs.receiveCalibration.show();
                    } else {
                        ShowToast('该任务已被领取')
                    }
                }}>
                <View style={[{
                    height: 79.5, width: SCREEN_WIDTH - 38, marginTop: 14.5, marginHorizontal: 19
                    , justifyContent: 'space-between',
                }]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[{ color: '#333333', fontSize: 15 }]}>{`${pointName}`}</Text>
                        <View style={[{ width: 45, height: 16, backgroundColor: "#A7CFFC", justifyContent: 'center', alignItems: 'center', marginLeft: 5 }]}>
                            <Text style={[{ color: 'white', fontSize: 10 }]}>{recordTypeName}</Text>
                        </View>
                    </View>
                    <Text style={[{ fontSize: 12, color: '#666666' }]}>{`企业名称：${entName}`}</Text>
                    <View style={[{
                        width: SCREEN_WIDTH - 38, flexDirection: 'row', alignItems: 'center'
                    }]}>
                        <Text style={[{ flex: 1, fontSize: 11, color: '#666666' }]}>{`派单时间：${this.getTimeStr(createTime)}`}</Text>
                        <Text style={[{ flex: 1, fontSize: 11, color: '#666666' }]}>{`有效期：${this.getTimeStr(overTime)}`}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={[{
                width: SCREEN_WIDTH - 38, height: 32, marginLeft: 19
                , flexDirection: "row", justifyContent: 'flex-end'
            }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PointTaskRecord', params: { DGIMN: dgimn } }));
                    }}
                    style={[{

                    }]}
                >
                    <View
                        style={[{
                            width: 80, height: 32, justifyContent: 'center', alignItems: 'flex-end'
                        }]}
                    >
                        <Text style={[{ fontSize: 12, color: globalcolor.antBlue }]}>{`${'工单记录>'}`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                this.getOperationUserTag(taskStatus, operationUser)
            }
            {taskStatus == 11 ? <TouchableOpacity
                style={[{
                    position: 'absolute', top: 37, right: 15
                }]}
                onPress={() => {
                    if (taskStatus == 11) {
                        this.setState({ task: { pointName, entName, createTime, taskID, overHour, overDay } });
                        this.refs.receiveCalibration.show();
                    } else {
                        ShowToast('该任务已被领取')
                    }
                }}><View style={[{
                    height: 34, width: 34, backgroundColor: '#F78259', borderRadius: 17
                    , justifyContent: 'center', alignItems: 'center'
                }]}>
                    <Text style={[{ fontSize: 12, color: 'white' }]}>{'领取'}</Text>
                </View>
            </TouchableOpacity> : null}
        </View>
    }

    onItemClick = (label) => {
        if (label == '运维计划') {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'OperationPlanEnter', params: {} }));
            this.setState({
                isVisible: false
            });
        } else if (label == '功能说明') {
            const _this = this;
            this.setState({
                isVisible: false
            }, () => {
                _this.refs.doAlert.show();
            });
        } else if (label == '领取记录') {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'ClaimTaskList', params: {} }));
            this.setState({
                isVisible: false
            });
        }
    }

    _onChangeTab = (index) => {
        let listParams = { PollutantType: 1 };
        let gasCountParams = { noCancelFlag: true }
            , waterCountParams = { noCancelFlag: true };
        if (index == 0) {
            listParams.PollutantType = 2;
            listParams.TaskType = '1';
            this.props.dispatch(createAction('claimTaskModels/updateState')({ claimTaskResultGas: { status: -1 } }));
        } else if (index == 1) {
            listParams.PollutantType = 1;
            listParams.TaskType = '7';
            this.props.dispatch(createAction('claimTaskModels/updateState')({ claimTaskResultWater: { status: -1 } }));
        }
        gasCountParams.PollutantType = 2;
        gasCountParams.TaskType = '1,3';
        waterCountParams.PollutantType = 1;
        waterCountParams.TaskType = '7,9';
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: gasCountParams }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: waterCountParams }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
    }

    getData = (params, callback = () => { }) => {
        const selectedTaskType = this.props.selectedTaskType;
        let gasCountParams = { noCancelFlag: true }
            , waterCountParams = { noCancelFlag: true }, listParams = {};
        if (params.PollutantType == 2) {
            listParams.PollutantType = 2;
            listParams.TaskType = selectedTaskType
        } else if (params.PollutantType == 1) {
            listParams.PollutantType = 1;
            listParams.TaskType = selectedTaskType
        }
        gasCountParams.PollutantType = 2;
        gasCountParams.TaskType = '1,3';
        waterCountParams.PollutantType = 1;
        waterCountParams.TaskType = '7,9';
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: gasCountParams, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskCount')({ params: waterCountParams, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams, callback }))
    }

    receiveTask = () => {
        if (typeof this.state.task != 'undefined' && this.state.task) {
            // 参数  Type（1、领取；2、弃领） TaskID
            this.props.dispatch(createAction('claimTaskModels/receiveTask')({
                params: { Type: 1, TaskID: this.state.task.taskID }
                , success: () => {
                    ShowToast('任务领取成功');
                    let tabPageIndex = this.props.tabPageIndex;
                    let params = { PollutantType: 1 };
                    let listParams = { PollutantType: 1 };
                    let callback = null;
                    if (tabPageIndex == 0) {
                        listParams.claimTaskResultGas = { status: -1 }
                        listParams.PollutantType = 2;
                        callback = SentencedToEmpty(this, ['gasList', 'setListData'], () => { });
                        params.PollutantType = 2;
                        params.TaskType = '1,3';
                    } else if (tabPageIndex == 1) {
                        listParams.claimTaskResultWater = { status: -1 }
                        listParams.PollutantType = 1;
                        callback = this.waterList.setListData;
                        params.PollutantType = 1;
                        params.TaskType = '7,9';
                    } else {
                        listParams.claimTaskResultWater = { status: -1 }
                        params.PollutantType = 1;
                        params.TaskType = '7,9';
                    }
                    this.getData(params);
                }
                , failure: () => {
                    ShowToast('任务领取失败');
                }
            }));
        } else {
            ShowToast('任务信息错误');
        }
    }

    receiveCalibrationOptions = {
        headTitle: '提示',
        messText: '确定要领取此任务吗？',
        headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
        buttons: [
            {
                txt: '取消',
                btnStyle: { backgroundColor: 'transparent' },
                txtStyle: { color: globalcolor.headerBackgroundColor },
                onpress: () => { }
            },
            {
                txt: '确定',
                btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                txtStyle: { color: '#ffffff' },
                onpress: this.receiveTask
            }
        ]
    };

    render() {
        /**
         * 1、校准工单：废水、废气设备校准的第一个工单需要手工创建，以后新的校准工单则在已有校准工单结束后自动生成。
2、监测点运维到期或运维状态设置成已结束，系统则停止派发工单。
3、新生成工单处于待领取状态，工程师在此页面领取，领取后工单则出现待办任务中。领取后请及时完成，如放弃执行此次校准，请在待办任务中弃领工单或转发给实际执行人；
4、废水废气监测设备校准周期最长不超过7日，如果自动派发的工单在7日内不能领取完成，系统将会自动关闭工单。关闭的工单将影响校准完成率。
         * 
         */
        var options = {
            headTitle: '说明',
            innersHeight: 280,
            messText: `此页面是废水废气校准工单领取页面：
1、监测点运维到期或运维状态设置成已结束，系统则停止派发工单。
2、新生成工单处于待领取状态，工程师在此页面领取，领取后工单则出现待办任务中。领取后请及时完成，如放弃执行此次校准，请在待办任务中弃领工单或转发给实际执行人；`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '知道了',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: this.confirm
                }
            ]
        };
        const selectedTaskType = this.props.selectedTaskType;
        return (
            <View style={{ width: SCREEN_WIDTH, height: '100%', backgroundColor: 'white' }}>
                <View
                    style={{
                        height: 40,
                        backgroundColor: globalcolor.headerBackgroundColor,
                        width: SCREEN_WIDTH,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'输入企业、点位搜索'}
                        placeholderTextColor={'#999999'}
                        style={{
                            color: '#333333',
                            textAlign: 'center',
                            width: SCREEN_WIDTH - 80,
                            borderColor: '#cccccc',
                            borderWidth: 0.5,
                            borderRadius: 15,
                            height: 30,
                            backgroundColor: '#fff',
                            paddingVertical: 0
                        }}
                        onChangeText={text => {
                            //动态更新组件内 记录输入内容
                            this.props.dispatch(createAction('claimTaskModels/updateState')({ searchWord: text }));
                            if (text == '') {
                                if (this.props.tabPageIndex == 0) {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
                                } else {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
                                }
                            }
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                    />
                    {
                        Platform.OS == 'android' ? <TouchableOpacity
                            style={{ marginLeft: -30 }}
                            onPress={() => {
                                this.refs.keyWordInput.clear();
                                this.props.dispatch(createAction('claimTaskModels/updateState')({ searchWord: '' }));
                                if (this.props.tabPageIndex == 0) {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, TaskType: selectedTaskType, noCancelFlag: true }, callback: () => { } }))
                                } else {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, TaskType: selectedTaskType, noCancelFlag: true }, callback: () => { } }))
                                }
                            }}
                        >
                            <Image source={require('../../../images/clear.png')} style={{ width: 15, height: 15 }} />
                        </TouchableOpacity> : null
                    }
                    <TouchableOpacity
                        style={{ marginLeft: 30 }}
                        onPress={() => {
                            if (this.props.tabPageIndex == 0) {
                                this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, TaskType: selectedTaskType, noCancelFlag: true }, callback: () => { } }))
                            } else {
                                this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, TaskType: selectedTaskType, noCancelFlag: true }, callback: () => { } }))
                            }
                        }}
                    >
                        <Text style={{ fontSize: 15, color: 'white' }} >{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[{
                    flexDirection: 'row', height: 44
                    , width: SCREEN_WIDTH, alignItems: 'center'
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white', marginBottom: 5
                }]}>
                    <SDLTabButton
                        topButtonWidth={SCREEN_WIDTH / 2}
                        selected={this.props.tabPageIndex == 0}
                        label={`废气(${(SentencedToEmpty(this.props
                            , ['unclaimedGasTaskCountResult', 'data'
                                , 'Datas', 'calibrationCount'], 0)
                            + SentencedToEmpty(this.props
                                , ['unclaimedGasTaskCountResult', 'data'
                                    , 'Datas', 'inspectionCount'], 0))})`}
                        onPress={() => {
                            let params = { tabPageIndex: 0, };
                            params.claimTaskResultGas = { status: -1 }
                            params.selectedTaskType = 1;

                            this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                            this._onChangeTab(0);
                        }}
                    />
                    <SDLTabButton
                        topButtonWidth={SCREEN_WIDTH / 2}
                        selected={this.props.tabPageIndex == 1}
                        label={`废水(${(SentencedToEmpty(this.props
                            , ['unclaimedWaterTaskCountResult', 'data'
                                , 'Datas', 'inspectionCount'], 0)
                            + SentencedToEmpty(this.props
                                , ['unclaimedWaterTaskCountResult', 'data'
                                    , 'Datas', 'calibrationCount'], 0))})`}
                        onPress={() => {
                            let params = { tabPageIndex: 1, };
                            params.claimTaskResultWater = { status: -1 }
                            params.selectedTaskType = 7;

                            this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                            this._onChangeTab(1);
                        }}
                    />
                </View>
                {
                    this.props.tabPageIndex == 0 ?
                        <View tabLabel="废气" style={{ flex: 1 }}>
                            <View style={[{
                                width: SCREEN_WIDTH, height: 52
                                , flexDirection: 'row', alignItems: 'center'
                                , paddingLeft: 8, backgroundColor: 'white', borderTopColor: "#f2f2f2"
                                , borderTopWidth: 1
                            }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        let params = {}, listParams = {};
                                        params.selectedTaskType = 1;
                                        params.claimTaskResultGas = { status: -1 }
                                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                        listParams.PollutantType = 2;
                                        listParams.TaskType = '1';
                                        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                    }}
                                    style={{ marginLeft: 12 }}>
                                    <View style={[selectedTaskType == 1 ? styles.selectedContainer : styles.unSelectedContainer]}>
                                        <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                        <Text style={[selectedTaskType == 1 ? styles.selectedText : styles.unSelectedText]}>{'巡检'}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['unclaimedGasTaskCountResult', 'data'
                                                    , 'Datas', 'inspectionCount'], 0) == 0
                                                ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                : <View style={[{
                                                    width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}>
                                                    <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                        , ['unclaimedGasTaskCountResult', 'data'
                                                            , 'Datas', 'inspectionCount'], 0)}</Text>
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        let params = {}, listParams = {};
                                        params.selectedTaskType = 3;
                                        params.claimTaskResultGas = { status: -1 }
                                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                        listParams.PollutantType = 2;
                                        listParams.TaskType = '3';
                                        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                    }}
                                    style={{ marginLeft: 12 }}>
                                    <View style={[selectedTaskType == 3 ? styles.selectedContainer : styles.unSelectedContainer
                                    ]}>
                                        <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                        <Text style={[selectedTaskType == 3 ? styles.selectedText : styles.unSelectedText]}>{'校准'}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['unclaimedGasTaskCountResult', 'data'
                                                    , 'Datas', 'calibrationCount'], 0) == 0
                                                ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                : <View style={[{
                                                    width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}>
                                                    <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                        , ['unclaimedGasTaskCountResult', 'data'
                                                            , 'Datas', 'calibrationCount'], 0)}</Text>
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        let params = {}, listParams = {};
                                        params.selectedTaskType = 33;
                                        params.claimTaskResultGas = { status: -1 }
                                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                        listParams.PollutantType = 2;
                                        listParams.TaskType = '33';
                                        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                    }}
                                    style={{ marginLeft: 12 }}>
                                    <View style={[selectedTaskType == 33 ? styles.selectedContainer : styles.unSelectedContainer,
                                     {width:80}
                                    ]}>
                                        <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                        <Text style={[selectedTaskType == 33 ? styles.selectedText : styles.unSelectedText]}>{'示值误差'}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['unclaimedGasTaskCountResult', 'data'
                                                    , 'Datas', 'szwcCount'], 0) == 0
                                                ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                : <View style={[{
                                                    width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}>
                                                    <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                        , ['unclaimedGasTaskCountResult', 'data'
                                                            , 'Datas', 'szwcCount'], 0)}</Text>
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        let params = {}, listParams = {};
                                        params.selectedTaskType = 20;
                                        params.claimTaskResultGas = { status: -1 }
                                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                        listParams.PollutantType = 2;
                                        listParams.TaskType = '20';
                                        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                    }}
                                    style={{ marginLeft: 12 }}>
                                    <View style={[selectedTaskType == 20 ? styles.selectedContainer : styles.unSelectedContainer,
                                    {width:80}
                                    ]}>
                                        <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                        <Text style={[selectedTaskType == 20 ? styles.selectedText : styles.unSelectedText]}>{'校验测试'}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['unclaimedGasTaskCountResult', 'data'
                                                    , 'Datas', 'jycsCount'], 0) == 0
                                                ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                : <View style={[{
                                                    width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}>
                                                    <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                        , ['unclaimedGasTaskCountResult', 'data'
                                                            , 'Datas', 'jycsCount'], 0)}</Text>
                                                </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }]}>
                            </View>
                            {
                                this.props.tabPageIndex == 0
                                    ? <StatusPage
                                        backRef={SentencedToEmpty(this.props, ['route', 'params', 'params', 'needRefresh'], 'true') == 'true'}
                                        status={this.props.claimTaskResultGas.status}
                                        errorBtnText={'点击重试'}
                                        emptyBtnText={'点击重试'}
                                        onErrorPress={() => {
                                            let listParams = { PollutantType: 2 };
                                            let params = { PollutantType: 2 };
                                            listParams.claimTaskResultGas = { status: -1 }
                                            listParams.PollutantType = 2;
                                            callback = SentencedToEmpty(this, ['gasList', 'setListData'], () => { });
                                            params.PollutantType = 2;
                                            params.TaskType = '1,3';

                                            this.getData(params);
                                        }}
                                        onEmptyPress={() => {
                                            let params = { PollutantType: 1 };
                                            this.getData(params);
                                        }}
                                    >
                                        <FlatListWithHeaderAndFooter
                                            style={[{ backgroundColor: '#f2f2f2' }]}
                                            ref={ref => (this.gasList = ref)}
                                            ItemSeparatorComponent={() => {
                                                return (
                                                    <View style={[{ height: 10.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                                        <View style={[{ height: 10.5, width: SCREEN_WIDTH - 13, backgroundColor: '#f2f2f2' }]} />
                                                    </View>
                                                );
                                            }}
                                            pageSize={20}
                                            hasMore={() => {
                                                return false;
                                            }}
                                            onRefresh={index => {
                                                let params = { PollutantType: 2 };
                                                this.getData(params, SentencedToEmpty(this, ['gasList', 'setListData'], () => { }));
                                            }}
                                            onEndReached={index => {
                                                // 不分页
                                            }}
                                            renderItem={item => {
                                                return this._renderItemList(item);
                                            }}
                                            data={SentencedToEmpty(this.props.claimTaskResultGas, ['data', 'Datas'], [])}
                                        />
                                    </StatusPage>
                                    : <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}></View>
                            }
                            {/*
                            // 数据样例
                            [{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            },{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            },{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            }]
                         */}
                        </View>
                        : this.props.tabPageIndex == 1 ?
                            <View tabLabel="废水" style={{ flex: 1 }}>
                                <View style={[{
                                    width: SCREEN_WIDTH, height: 52
                                    , flexDirection: 'row', alignItems: 'center'
                                    , paddingLeft: 8, backgroundColor: 'white', borderTopColor: "#f2f2f2"
                                    , borderTopWidth: 1
                                }]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let params = {}, listParams = {};
                                            params.selectedTaskType = 7;
                                            params.claimTaskResultWater = { status: -1 }
                                            this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                            listParams.PollutantType = 1;
                                            listParams.TaskType = '7';
                                            this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                        }}
                                        style={{ marginLeft: 12 }}>
                                        <View style={[selectedTaskType == 7 ? styles.selectedContainer : styles.unSelectedContainer]}>
                                            <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                            <Text style={[selectedTaskType == 7 ? styles.selectedText : styles.unSelectedText]}>{'巡检'}</Text>
                                            {
                                                SentencedToEmpty(this.props
                                                    , ['unclaimedWaterTaskCountResult', 'data'
                                                        , 'Datas', 'inspectionCount'], 0) == 0
                                                    ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                    : <View style={[{
                                                        width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                        , justifyContent: 'center', alignItems: 'center'
                                                    }]}>
                                                        <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                            , ['unclaimedWaterTaskCountResult', 'data'
                                                                , 'Datas', 'inspectionCount'], 0)}</Text>
                                                    </View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let params = {}, listParams = {};
                                            params.selectedTaskType = 9;
                                            params.claimTaskResultWater = { status: -1 }
                                            this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                                            listParams.PollutantType = 1;
                                            listParams.TaskType = '9';
                                            this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: listParams }))
                                        }}
                                        style={{ marginLeft: 12 }}>
                                        <View style={[selectedTaskType == 9 ? styles.selectedContainer : styles.unSelectedContainer
                                        ]}>
                                            <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                            <Text style={[selectedTaskType == 9 ? styles.selectedText : styles.unSelectedText]}>{'校准'}</Text>
                                            {
                                                SentencedToEmpty(this.props
                                                    , ['unclaimedWaterTaskCountResult', 'data'
                                                        , 'Datas', 'calibrationCount'], 0) == 0
                                                    ? <View style={[{ width: 12, height: 12, backgroundColor: '#00000000', borderRadius: 6 }]}></View>
                                                    : <View style={[{
                                                        width: 12, height: 12, backgroundColor: '#ff0000', borderRadius: 6, marginBottom: 17.5
                                                        , justifyContent: 'center', alignItems: 'center'
                                                    }]}>
                                                        <Text style={{ fontSize: 7, color: '#ffffff' }}>{SentencedToEmpty(this.props
                                                            , ['unclaimedWaterTaskCountResult', 'data'
                                                                , 'Datas', 'calibrationCount'], 0)}</Text>
                                                    </View>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }]}></View>
                                {
                                    this.props.tabPageIndex == 1
                                        ? <StatusPage
                                            backRef={SentencedToEmpty(this.props, ['route', 'params', 'params', 'needRefresh'], 'true') == 'true'}
                                            status={this.props.claimTaskResultWater.status}
                                            errorBtnText={'点击重试'}
                                            emptyBtnText={'点击重试'}
                                            onErrorPress={() => {
                                                let params = { PollutantType: 2 };
                                                this.getData(params);
                                            }}
                                            onEmptyPress={() => {
                                                let params = { PollutantType: 2 };
                                                this.getData(params);
                                            }}
                                        >
                                            <FlatListWithHeaderAndFooter
                                                style={[{ backgroundColor: '#f2f2f2' }]}
                                                ref={ref => (this.waterList = ref)}
                                                ItemSeparatorComponent={() => {
                                                    return (
                                                        <View style={[{ height: 10.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                                            <View style={[{ height: 10.5, width: SCREEN_WIDTH - 13, backgroundColor: '#f2f2f2' }]} />
                                                        </View>
                                                    );
                                                }}
                                                pageSize={20}
                                                hasMore={() => {
                                                    return false;
                                                }}
                                                onRefresh={index => {
                                                    let params = { PollutantType: 1 };
                                                    this.getData(params, this.waterList.setListData);
                                                }}
                                                onEndReached={index => {
                                                    // 不分页
                                                }}
                                                renderItem={item => {
                                                    return this._renderItemList(item);
                                                }}
                                                data={SentencedToEmpty(this.props.claimTaskResultWater, ['data', 'Datas'], [])}
                                            />
                                        </StatusPage>
                                        : <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}></View>
                                }
                            </View>
                            : null
                }
                {/* <ScrollableTabView
                    onChangeTab={obj => {
                        let params = { tabPageIndex: obj.i, };
                        if (obj.i == 0) {
                            params.claimTaskResultGas = { status: -1 }
                            params.selectedTaskType = 1;
                        } else if (obj.i == 1) {
                            params.claimTaskResultWater = { status: -1 }
                            params.selectedTaskType = 7;
                        } else {
                            params.claimTaskResultGas = { status: -1 }
                        }
                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                        this._onChangeTab(obj.i);
                    }}
                    // initialPage={1}
                    style={{ flex: 1, width: SCREEN_WIDTH, }}
                    renderTabBar={() => <MyTabBar tabNames={[
                        {
                            label: '废气', count: (SentencedToEmpty(this.props
                                , ['unclaimedGasTaskCountResult', 'data'
                                    , 'Datas', 'calibrationCount'], 0)
                                + SentencedToEmpty(this.props
                                    , ['unclaimedGasTaskCountResult', 'data'
                                        , 'Datas', 'inspectionCount'], 0))
                        },
                        {
                            label: '废水', count: (SentencedToEmpty(this.props
                                , ['unclaimedWaterTaskCountResult', 'data'
                                    , 'Datas', 'inspectionCount'], 0)
                                + SentencedToEmpty(this.props
                                    , ['unclaimedWaterTaskCountResult', 'data'
                                        , 'Datas', 'calibrationCount'], 0))
                        },
                    ]} />}
                    tabBarUnderlineStyle={{
                        width: SCREEN_WIDTH / 2,
                        height: 2,
                        backgroundColor: '#4aa1fd',
                        marginBottom: -1
                    }}
                    tabBarPosition="top"
                    scrollWithoutAnimation={false}
                    tabBarUnderlineColor="#4aa1fd"
                    tabBarBackgroundColor="#FFFFFF"
                    tabBarActiveTextColor="#4aa1fd"
                    tabBarInactiveTextColor="#000033"
                    tabBarTextStyle={{ fontSize: 15, backgroundColor: 'red' }}
                >
                    
                </ScrollableTabView> */}
                <Popover
                    //设置可见性
                    isVisible={this.state.isVisible}
                    //设置下拉位置
                    fromRect={this.state.spinnerRect}
                    placement="bottom"
                    //点击下拉框外范围关闭下拉框
                    onClose={() => this.closeSpinner()}
                    //设置内容样式
                    contentStyle={{ opacity: 0.82, backgroundColor: '#343434' }}
                    style={{ backgroundColor: 'red' }}
                    contentHeight={135}
                >
                    <View style={{ alignItems: 'center', }}>
                        {['运维计划', '领取记录', '功能说明'].map((result, i, arr) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => this.onItemClick(arr[i])} underlayColor="transparent">
                                    <Text style={{ fontSize: 16, color: 'white', padding: 8, fontWeight: '400' }}>{arr[i]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Popover>
                <OperationAlertDialog options={options} ref="doAlert" />
                <AlertDialog options={this.receiveCalibrationOptions} ref="receiveCalibration" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    selectedContainer: {
        width: 55
        , height: 28
        , backgroundColor: '#ECF5FF'
        , borderRadius: 2.5
        , justifyContent: 'center'
        , alignItems: 'center'
        , flexDirection: 'row'
    },
    selectedText: {
        fontSize: 13
        , color: '#4AA0FF'
    },
    unSelectedContainer: {
        width: 55, height: 28
        , backgroundColor: '#F5F5F5'
        , borderRadius: 2.5
        , justifyContent: 'center'
        , alignItems: 'center'
        , flexDirection: 'row'
    },
    unSelectedText: {
        fontSize: 13
        , color: '#999999'
    },
})