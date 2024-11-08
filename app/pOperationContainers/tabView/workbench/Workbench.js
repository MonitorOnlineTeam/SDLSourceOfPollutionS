import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, ImageBackground, DeviceEventEmitter, Platform } from 'react-native';
import { connect } from 'react-redux';
// import { createStackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty, NavigationActions } from '../../../utils';
import { Touchable, SDLText, StatusPage, PullToRefresh, LoadingComponent, PickerTouchable, SimpleLoadingView } from '../../../components';
import TextAdvertisement from '../../../components/TextAdvertisement';
import { getToken } from '../../../dvapack/storage';
import globalcolor from '../../../config/globalcolor';
import TextLabel from '../../components/TextLabel';
// import PullToRefresh from '../../../test/PullToRefresh';
// import LoadingComponent from '../../../test/LoadingComponent';
// const a = [
//     { label: '待办任务', numkey: 'GTasks', countkey: 'TaskCount', dcountkey: '' },
//     { label: '超标报警', numkey: 'OverAlarm', countkey: 'OverCount', dcountkey: 'overAlarmCount' },
//     { label: '异常报警', numkey: 'ExceptionAlarm', countkey: 'AlarmCount', dcountkey: 'exceptionAlarmCount' },
//     { label: '缺失报警', numkey: 'MissAlarm', countkey: 'MissAlarm', dcountkey: 'missAlarmCount' }
// ];
const a = [
    { label: '待办任务', numkey: 'GTaskOfEnterprise', countkey: 'TaskCount', dcountkey: '' },
    { label: '待我审批', numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 } }
    // { label: '申请工单', img: require('../../../images/renwushenqing.png'), numkey: 'CreateTask' },
    // { label: '工单记录', img: require('../../../images/renwujilu.png'), numkey: 'TaskRecord' },
];
const c = [
    { label: '超标预警', numkey: 'OverWarning', countkey: 'OverWarning', dcountkey: 'OverWarningCount' },
    { label: '超标报警', numkey: 'OverAlarm', countkey: 'OverCount', dcountkey: 'overAlarmCount' },
    { label: '异常报警', numkey: 'ExceptionAlarm', countkey: 'AlarmCount', dcountkey: 'exceptionAlarmCount' },
    { label: '缺失报警', numkey: 'MissAlarm', countkey: 'MissAlarm', dcountkey: 'missAlarmCount' }
];
// const b = [
//     // { label: '创建任务', img: require('../../../images/renwushenqing.png'), numkey: 'CreateTask' },
//     { label: '待我审批', numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 }  },
//     { label: '申请工单', img: require('../../../images/renwushenqing.png'), numkey: 'CreateTask' },
//     { label: '领取工单', img: require('../../../images/renwujilu.png'), numkey: 'ManualClaimTask' },
//     { label: '运营到期', img: require('../../../images/renwujilu.png'), numkey: 'ContractExpiresStatistics' },
//     { label: '任务记录', img: require('../../../images/renwujilu.png'), numkey: 'TaskRecord' },
//     { label: '运维统计', img: require('../../../images/renwushenpi.png'), numkey: 'Statistics' },
//     { label: '运维日历', numkey: 'MonthException', countkey: 'ExceptionCount' },
//     { label: '运维知识库', img: require('../../../images/changqudaka.png'), numkey: 'OperationKnowledge', params: { pageType: 'OperationKnowledge' } },
//     // { label: '通知', img: require('../../../images/tongzhi.png'), numkey: 'Notice', countkey: 'ExistsNewNotice' },
//     { label: '故障反馈', img: require('../../../images/renwujilu.png'), numkey: 'EquipmentFailureFeedbackList' },
//     { label: '督查记录', img: require('../../../images/renwujilu.png'), numkey: 'InspectionRecords' },
// ];
const b = [
    // { label: '任务记录', img: require('../../../images/renwujilu.png'), numkey: 'TaskRecord' },
    // { label: '运维日历', numkey: 'MonthException', countkey: 'ExceptionCount' },
    { label: '宝武运维', img: require('../../../images/renwujilu.png'), numkey: 'SHEnterpriseList' },
    { label: '故障反馈', img: require('../../../images/renwujilu.png'), numkey: 'EquipmentFailureFeedbackList' },
    // { label: '关键参数核查', img: require('../../../images/renwujilu.png'), numkey: 'InspectionRecords' },
    { label: '关键参数核查', img: require('../../../images/renwujilu.png'), numkey: 'KeyParameterVerificationList' },
    // { label: '设施核查整改', img: require('../../../images/renwujilu.png'), numkey: 'ResponseToSupervision' },
    { label: '设施核查整改', img: require('../../../images/renwujilu.png'), numkey: 'SuperviserRectifyList' }
    // { label: '运维知识库', img: require('../../../images/changqudaka.png'), numkey: 'OperationKnowledge', params: { pageType: 'OperationKnowledge' } },

    // { label: '创建任务', img: require('../../../images/renwushenqing.png'), numkey: 'CreateTask' },
    // { label: '待我审批', numkey: 'PerformApproval', countkey: 'PerformApprovalCount', dcountkey: 'PerformApprovalCount', params: { pageType: 1 }  },
    // { label: '申请工单', img: require('../../../images/renwushenqing.png'), numkey: 'CreateTask' },
    // { label: '领取工单', img: require('../../../images/renwujilu.png'), numkey: 'ManualClaimTask' },

    // { label: '运营到期', img: require('../../../images/renwujilu.png'), numkey: 'ContractExpiresStatistics' },
    // { label: '运维统计', img: require('../../../images/renwushenpi.png'), numkey: 'Statistics' },
    // { label: '通知', img: require('../../../images/tongzhi.png'), numkey: 'Notice', countkey: 'ExistsNewNotice' },
];

const list = [
    // { router: 'GTaskOfEnterprise', name: '待办', params: {} },
    { router: 'GTasks', name: '待办', params: {} },
    { router: 'CreateTask', name: '创建任务', params: {} },
    { router: 'MonthException', name: '月度异常', params: {} },
    { router: 'Notice', name: '通知', params: {} },
    { router: 'OperationKnowledge', name: '运维资料库', params: { pageType: 'OperationKnowledge' } },
    { router: 'TaskRecord', name: '任务记录', params: {} },
    { router: 'Statistics', name: '统计', params: {} }
];

/**
 * 工作台
 * @class Audit
 * @extends {Component}
 */
// @connect(({ CTModel, login, app, alarm, approvalModel
//     , helpCenter, keyParameterVerificationModel, supervision
//     , alarmAnaly, modelAnalysisAectificationModel, BWModel
//     , CTEquipmentPicAuditModel, CTServiceReportRectificationModel
//     , abnormalTask }) => ({

//         equipmentAuditRectificationNum: CTEquipmentPicAuditModel.equipmentAuditRectificationNum,
//         noticeContentResult: helpCenter.noticeContentResult,
//         homeData: app.homeData,
//         exceptionAlarmCount: alarm.exceptionAlarmCount, //首页异常报警数量
//         overAlarmCount: alarm.overAlarmCount, //首页超标报警数量
//         missAlarmCount: alarm.missAlarmCount, //首页缺失报警数量
//         OverWarningCount: alarm.OverWarningCount, // 首页预警（分钟超标报警）数量
//         PerformApprovalCount: approvalModel.PerformApprovalCount, // 待审批任务数
//         checkedRectificationListCount: abnormalTask.checkedRectificationListCount, // 异常识别2.0 任务整改数
//         checkTaskCount: abnormalTask.checkTaskCount, // 异常识别2.0 任务数

//         OperationKeyParameterCountResult: keyParameterVerificationModel.OperationKeyParameterCountResult, // 关键参数核查 计数
//         rectificationNumResult: supervision.rectificationNumResult, // 设施核查整改 计数
//         workerBenchMenu: login.workerBenchMenu, // 动态菜单
//         anaCount: alarmAnaly.anaCount,
//         testFunctionStatus: login.testFunctionStatus, // 未上线功能状态
//         menuList: login.menuList, // 可根据此数据加在工作台接口
//         serviceDispatchResult: CTModel.serviceDispatchResult, // 成套待办 模型发布需注释掉
//         checkedRectificationListGResult: modelAnalysisAectificationModel.checkedRectificationListGResult, // 模型整改

//         tabList: login.tabList,
//         tabSelectIndex: login.tabSelectIndex,

//         executiveStatisticsParams: BWModel.executiveStatisticsParams, // 工单执行统计刷新参数
//         completeTaskCountParams: BWModel.completeTaskCountParams, // 完成工单统计刷新参数
//         serviceStatusNum: CTServiceReportRectificationModel.serviceStatusNum, // 服务报告整改工作台数字
//     }))
// @connect(({ app, login, helpCenter }) => ({
//     homeData: app.homeData,

//     workerBenchMenu: login.workerBenchMenu, // 动态菜单
//     testFunctionStatus: login.testFunctionStatus, // 未上线功能状态
//     menuList: login.menuList, // 可根据此数据加在工作台接口
//     tabList: login.tabList,
//     tabSelectIndex: login.tabSelectIndex,

//     noticeContentResult: helpCenter.noticeContentResult,

// }))
@connect(({ CTModel, login, app, alarm, approvalModel
    , helpCenter, keyParameterVerificationModel, supervision
    , alarmAnaly, modelAnalysisAectificationModel, BWModel
    , CTEquipmentPicAuditModel, CTServiceReportRectificationModel
    , abnormalTask }) => ({

        equipmentAuditRectificationNum: CTEquipmentPicAuditModel.equipmentAuditRectificationNum,
        noticeContentResult: helpCenter.noticeContentResult,
        homeData: app.homeData,
        exceptionAlarmCount: alarm.exceptionAlarmCount, //首页异常报警数量
        overAlarmCount: alarm.overAlarmCount, //首页超标报警数量
        missAlarmCount: alarm.missAlarmCount, //首页缺失报警数量
        OverWarningCount: alarm.OverWarningCount, // 首页预警（分钟超标报警）数量
        PerformApprovalCount: approvalModel.PerformApprovalCount, // 待审批任务数
        checkedRectificationListCount: abnormalTask.checkedRectificationListCount, // 异常识别2.0 任务整改数
        checkTaskCount: abnormalTask.checkTaskCount, // 异常识别2.0 任务数

        OperationKeyParameterCountResult: keyParameterVerificationModel.OperationKeyParameterCountResult, // 关键参数核查 计数
        rectificationNumResult: supervision.rectificationNumResult, // 设施核查整改 计数
        workerBenchMenu: login.workerBenchMenu, // 动态菜单
        anaCount: alarmAnaly.anaCount,
        testFunctionStatus: login.testFunctionStatus, // 未上线功能状态
        menuList: login.menuList, // 可根据此数据加在工作台接口
        serviceDispatchResult: CTModel.serviceDispatchResult, // 成套待办 模型发布需注释掉
        checkedRectificationListGResult: modelAnalysisAectificationModel.checkedRectificationListGResult, // 模型整改

        tabList: login.tabList,
        tabSelectIndex: login.tabSelectIndex,

        executiveStatisticsParams: BWModel.executiveStatisticsParams, // 工单执行统计刷新参数
        completeTaskCountParams: BWModel.completeTaskCountParams, // 完成工单统计刷新参数
        serviceStatusNum: CTServiceReportRectificationModel.serviceStatusNum, // 服务报告整改工作台数字
    }))
class Workbench extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '工作台'
            // headerTitleStyle: { marginLeft: Platform.OS === 'android' ? 76 : 0 },
            // headerRight: (
            //     <TouchableOpacity
            //         onPress={() => {
            //             navigation.state.params.navigatePress();
            //         }}
            //     >
            //         <Image source={require('../../../images/ic_message_bell.png')} style={[{ width: 20, marginRight: 16, fontSize: 20, height: 20 }]} />
            //         {SentencedToEmpty(navigation, ['state', 'params', 'ExistsNewNotice'], false) ? (
            //             <View style={[{ height: 6, minWidth: 6, position: 'absolute', right: 16, backgroundColor: 'red', borderRadius: 3, paddingHorizontal: 1 }]}></View>
            //         ) : null}
            //     </TouchableOpacity>
            // )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            test: false,
            refreshing: false
        };
    }
    componentWillUnmount() {
        // 移除监听
        // this.viewDidAppear.remove();
        this.subscription.remove();
    }
    onFreshData = (pullToRefreshCallback = () => { }) => {
        console.log('refresh');
        SentencedToEmpty(this.props, ['workerBenchMenu'], []).map((item, index) => {
            /**
             * "工单执行统计" executiveStatisticsParams
             * "322ac13e-fadf-43ed-a7a6-b2ccde37f390"
             * "完成工单统计" completeTaskCountParams
             * "0c8da383-b312-431b-8ff5-f24f75c7f933"
             */
            if (item.id == "322ac13e-fadf-43ed-a7a6-b2ccde37f390") {
                console.log('refresh 工单执行统计');
                // 工单执行统计
                this.props.dispatch(createAction('BWModel/getOperationTaskStatisticsInfoByDay')({
                    params: this.props.executiveStatisticsParams
                }));

            } else if (item.id == "0c8da383-b312-431b-8ff5-f24f75c7f933") {
                // 完成工单统计
                this.props.dispatch(createAction('BWModel/getCompleteTaskCount')({
                    params: this.props.completeTaskCountParams
                }));
            }
        })
        this.props.dispatch(
            createAction('alarm/updateState')({
                sourceType: ''
            })
        );
        this.props.dispatch(
            createAction('pointDetails/updateState')({
                sourceType: ''
            })
        );

        // 获取关键参数核查 计数
        // this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
        // 设施核查整改 计数
        // this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
        this.loadAdvertisement(false);
        let haveGTaskOfEnterprise = false;
        SentencedToEmpty(this.props, ['menuList'], []).map((item, index) => {
            console.log('refresh item = ', item);

            if (SentencedToEmpty(item, ['numkey'], '') == 'ServiceReportRectificationList') {
                // 服务报告整改
                // this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
                //     equipmentAuditRectificationNum: '-'
                // }));
                this.props.dispatch(createAction('CTServiceReportRectificationModel/GetServiceStatusNum')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'EquipmentInstallationPicAudit') {
                // 安装照片整改
                this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
                    equipmentAuditRectificationNum: '-'
                }));
                this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'ChengTaoGTask') {
                // 获取成套代办数量
                this.props.dispatch(
                    createAction('CTModel/getServiceDispatch')({
                        callback: () => {
                            if (typeof pullToRefreshCallback == 'function') {
                                pullToRefreshCallback();
                            }
                        }
                    })
                );
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'AnalysisModelAbnormalRectificationList') {
                // 获取模型整改数量
                this.props.dispatch(createAction('modelAnalysisAectificationModel/getCheckedRectificationList')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'AlarmSectionList') {
                // 获取异常识别数量
                this.props.dispatch(
                    createAction('alarmAnaly/getOperationKeyParameterCount')({
                        beginTime: moment()
                            .subtract(1, 'month')
                            .format('YYYY-MM-DD 00:00:00'),
                        endTime: moment().format('YYYY-MM-DD 23:59:59')
                    })
                );
            }

            if (SentencedToEmpty(item, ['numkey'], '') == 'KeyParameterVerificationList') {
                // 获取关键参数核查 计数
                this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'SuperviserRectifyList') {
                // 设施核查整改 计数
                this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
            }

            // 待办任务
            /**
             * 目前用户分为三类
             * 公司运维用户
             * 宝武运维用户
             * 成套用户
             *
             * 如果包含待办任务，则其他计数接口应该都需要
             */
            if (SentencedToEmpty(item, ['numkey'], '') == 'GTaskOfEnterprise') {
                haveGTaskOfEnterprise = true;
                // 待办任务和一些报警工作台计数
                this.props.dispatch(
                    createAction('app/getWorkbenchInfo')({
                        params: {
                            showRef: false,
                            noticeCallback: ExistsNewNotice => {
                                this.noticeCallback(ExistsNewNotice);
                                if (typeof pullToRefreshCallback == 'function') {
                                    pullToRefreshCallback();
                                } else {
                                    this.setState({ refreshing: false });
                                }
                            }
                        }
                    })
                );
            }

            if (SentencedToEmpty(item, ['numkey'], '') == "TaskToBeVerifiedList") {
                // 2273c00d-7594-4f85-8174-b46903a93ff7
                // 异常识别2.0任务待核查
                // console.log('TaskToBeVerifiedList item = ', item);
                let buttons = [];
                SentencedToEmpty(item, ['buttonList'], [])
                    .map(btn => {
                        buttons.push({ ModelGuid: btn.code.replace(/[^0-9]/g, ''), ModelName: btn.name });
                    });
                buttons = buttons.sort((a, b) => {
                    return a.ModelGuid - b.ModelGuid;
                });
                this.props.dispatch(
                    createAction('abnormalTask/updateState')({
                        getCheckedListParams: {
                            IsTotal: true,
                            CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
                            beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
                            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            serchName: '',
                            pageSize: 200,
                            pageIndex: 1
                        }
                    })
                );
                this.props.dispatch(
                    createAction('abnormalTask/GetCheckedList')({
                        IsTotal: true,
                        CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
                        beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
                        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        serchName: '',
                        pageSize: 200,
                        pageIndex: 1
                    })
                );
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'MissionVerificationRectificationList') {
                // 异常识别2.0刷新
                // console.log('异常识别2.0刷新 item = ', item);
                // this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
                this.props.dispatch(createAction('abnormalTask/getCheckedRectificationList')({
                    params: {
                        pageIndex: 1, pageSize: 1000,
                        IsTotal: true
                    }
                }));
            }

            /**
             *  ✅label: '待办任务', numkey: 'GTaskOfEnterprise'
                ✅label: '超标预警', numkey: 'OverWarning'
                ✅label: '超标报警', numkey: 'OverAlarm'
                ✅label: '异常报警', numkey: 'ExceptionAlarm'
                ✅label: '缺失报警', numkey: 'MissAlarm'

                label: '待我审批', numkey: 'PerformApproval'
                ❌label: '故障反馈', numkey: 'EquipmentFailureFeedbackList'
                ❌label: '宝武运维', numkey: 'SHEnterpriseList'
                ✅✅label: '关键参数核查', numkey: 'KeyParameterVerificationList'
                ✅✅label: '设施核查整改', numkey: 'SuperviserRectifyList'
                ❌label: '领取工单', numkey: 'ManualClaimTask'
                ✅✅label: '异常识别', numkey: 'AlarmSectionList'
                ✅✅label: '成套待办', numkey: 'ChengTaoGTask'
                ❌label: '成套签到', numkey: 'ChengTaoSignIn'
                ✅✅label: '模型整改', numkey: 'AnalysisModelAbnormalRectificationList'
             */
        });
        // 获取异常识别 计数
        // let user = getToken();
        // if (user.IsShowTask == false) {
        //     this.props.dispatch(
        //         createAction('alarmAnaly/getOperationKeyParameterCount')({
        //             beginTime: moment()
        //                 .subtract(1, 'month')
        //                 .format('YYYY-MM-DD 00:00:00'),
        //             endTime: moment().format('YYYY-MM-DD 23:59:59')
        //         })
        //     );
        // }
        //刷新消息计数器
        this.props.dispatch(createAction('notice/getNewPushMessageList')({}));
        if (!haveGTaskOfEnterprise) {
            if (typeof pullToRefreshCallback == 'function') {
                pullToRefreshCallback();
            } else {
                this.setState({ refreshing: false });
            }
        }
    };
    onFreshDataWithParams = menuList => {
        // 切换 常用、个人、全员 使用此方法刷新工作台数据
        console.log('onFreshDataWithParams');
        this.props.dispatch(
            createAction('alarm/updateState')({
                sourceType: ''
            })
        );
        this.props.dispatch(
            createAction('pointDetails/updateState')({
                sourceType: ''
            })
        );

        this.loadAdvertisement(false);
        let haveGTaskOfEnterprise = false;
        menuList.map((item, index) => {
            console.log('onFreshDataWithParams item = ', item);

            if (SentencedToEmpty(item, ['numkey'], '') == "TaskToBeVerifiedList") {
                // 2273c00d-7594-4f85-8174-b46903a93ff7
                // 异常识别2.0任务待核查
                console.log('TaskToBeVerifiedList item = ', item);
                let buttons = [];
                SentencedToEmpty(item, ['buttonList'], [])
                    .map(btn => {
                        buttons.push({ ModelGuid: btn.code.replace(/[^0-9]/g, ''), ModelName: btn.name });
                    });
                buttons = buttons.sort((a, b) => {
                    return a.ModelGuid - b.ModelGuid;
                });
                this.props.dispatch(
                    createAction('abnormalTask/updateState')({
                        getCheckedListParams: {
                            IsTotal: true,
                            CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
                            beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
                            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            serchName: '',
                            pageSize: 200,
                            pageIndex: 1
                        }
                    })
                );
                this.props.dispatch(
                    createAction('abnormalTask/GetCheckedList')({
                        IsTotal: true,
                        CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
                        beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
                        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        serchName: '',
                        pageSize: 200,
                        pageIndex: 1
                    })
                );
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'MissionVerificationRectificationList') {
                // 异常识别2.0刷新
                console.log('异常识别2.0刷新 item = ', item);
                this.props.dispatch(createAction('abnormalTask/getCheckedRectificationList')({
                    params: {
                        pageIndex: 1, pageSize: 1000,
                        IsTotal: true
                    }
                }));
            }

            if (SentencedToEmpty(item, ['numkey'], '') == 'ServiceReportRectificationList') {
                // 服务报告整改
                // this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
                //     equipmentAuditRectificationNum: '-'
                // }));
                this.props.dispatch(createAction('CTServiceReportRectificationModel/GetServiceStatusNum')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'EquipmentInstallationPicAudit') {
                // 安装照片整改
                this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
                    equipmentAuditRectificationNum: '-'
                }));
                this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'ChengTaoGTask') {
                // 获取成套代办数量
                this.props.dispatch(
                    createAction('CTModel/getServiceDispatch')({
                        callback: () => {
                            if (typeof pullToRefreshCallback == 'function') {
                                pullToRefreshCallback();
                            }
                        }
                    })
                );
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'AnalysisModelAbnormalRectificationList') {
                // 获取模型整改数量
                this.props.dispatch(createAction('modelAnalysisAectificationModel/getCheckedRectificationList')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'AlarmSectionList') {
                // 获取异常识别数量
                this.props.dispatch(
                    createAction('alarmAnaly/getOperationKeyParameterCount')({
                        beginTime: moment()
                            .subtract(1, 'month')
                            .format('YYYY-MM-DD 00:00:00'),
                        endTime: moment().format('YYYY-MM-DD 23:59:59')
                    })
                );
            }

            if (SentencedToEmpty(item, ['numkey'], '') == 'KeyParameterVerificationList') {
                // 获取关键参数核查 计数
                this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
            }
            if (SentencedToEmpty(item, ['numkey'], '') == 'SuperviserRectifyList') {
                // 设施核查整改 计数
                this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
            }

            // 待办任务
            /**
             * 目前用户分为三类
             * 公司运维用户
             * 宝武运维用户
             * 成套用户
             *
             * 如果包含待办任务，则其他计数接口应该都需要
             */
            if (SentencedToEmpty(item, ['numkey'], '') == 'GTaskOfEnterprise') {
                haveGTaskOfEnterprise = true;
                // 待办任务和一些报警工作台计数
                this.props.dispatch(
                    createAction('app/getWorkbenchInfo')({
                        params: {
                            showRef: false,
                            noticeCallback: ExistsNewNotice => {
                                this.noticeCallback(ExistsNewNotice);
                                if (typeof pullToRefreshCallback == 'function') {
                                    pullToRefreshCallback();
                                } else {
                                    this.setState({ refreshing: false });
                                }
                            }
                        }
                    })
                );
            }
            /**
             *  ✅label: '待办任务', numkey: 'GTaskOfEnterprise'
                ✅label: '超标预警', numkey: 'OverWarning'
                ✅label: '超标报警', numkey: 'OverAlarm'
                ✅label: '异常报警', numkey: 'ExceptionAlarm'
                ✅label: '缺失报警', numkey: 'MissAlarm'

                label: '待我审批', numkey: 'PerformApproval'
                ❌label: '故障反馈', numkey: 'EquipmentFailureFeedbackList'
                ❌label: '宝武运维', numkey: 'SHEnterpriseList'
                ✅✅label: '关键参数核查', numkey: 'KeyParameterVerificationList'
                ✅✅label: '设施核查整改', numkey: 'SuperviserRectifyList'
                ❌label: '领取工单', numkey: 'ManualClaimTask'
                ✅✅label: '异常识别', numkey: 'AlarmSectionList'
                ✅✅label: '成套待办', numkey: 'ChengTaoGTask'
                ❌label: '成套签到', numkey: 'ChengTaoSignIn'
                ✅✅label: '模型整改', numkey: 'AnalysisModelAbnormalRectificationList'
             */
        });
        //刷新消息计数器
        this.props.dispatch(createAction('notice/getNewPushMessageList')({}));
        if (!haveGTaskOfEnterprise) {
            if (typeof pullToRefreshCallback == 'function') {
                pullToRefreshCallback();
            } else {
                this.setState({ refreshing: false });
            }
        }
    };
    componentDidMount() {
        this.props.dispatch(
            createAction('notice/updateState')({
                messageCount: 0
            })
        );
        this.props.dispatch(
            createAction('app/updateState')({
                homeData: { status: 200 }
            })
        );
        this.noticeCallback(false);
        // 添加监听 
        this.subscription = DeviceEventEmitter.addListener('refresh', this.onFreshData);
        // this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
        //     console.log('didFocus');
        //     this.props.dispatch(
        //         createAction('alarm/updateState')({
        //             sourceType: ''
        //         })
        //     );
        //     this.props.dispatch(
        //         createAction('pointDetails/updateState')({
        //             sourceType: ''
        //         })
        //     );

        //     // let user = getToken();
        //     // if (user.IsShowTask == false) {
        //     //     // 获取异常识别 计数
        //     //     this.props.dispatch(
        //     //         createAction('alarmAnaly/getOperationKeyParameterCount')({
        //     //             beginTime: moment()
        //     //                 .subtract(1, 'month')
        //     //                 .format('YYYY-MM-DD 00:00:00'),
        //     //             endTime: moment().format('YYYY-MM-DD 23:59:59')
        //     //         })
        //     //     );
        //     // }

        this.loadAdvertisement(false);
        //     SentencedToEmpty(this.props, ['menuList'], []).map((item, index) => {
        //         console.log('didFocus item = ', item);
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'ServiceReportRectificationList') {
        //             // 服务报告整改
        //             // this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
        //             //     equipmentAuditRectificationNum: '-'
        //             // }));
        //             this.props.dispatch(createAction('CTServiceReportRectificationModel/GetServiceStatusNum')({}));
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'GTaskOfEnterprise') {
        //             // 待办任务和一些报警工作台计数
        //             this.props.dispatch(
        //                 createAction('app/getWorkbenchInfo')({
        //                     params: {
        //                         showRef: true,
        //                         noticeCallback: this.noticeCallback
        //                     }
        //                 })
        //             );
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'EquipmentInstallationPicAudit') {
        //             // 安装照片整改
        //             this.props.dispatch(createAction('CTEquipmentPicAuditModel/updateState')({
        //                 equipmentAuditRectificationNum: '-'
        //             }));
        //             this.props.dispatch(createAction('CTEquipmentPicAuditModel/getEquipmentAuditRectificationNum')({}));
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'ChengTaoGTask') {
        //             // 获取成套代办数量
        //             this.props.dispatch(createAction('CTModel/getServiceDispatch')({}));
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'AnalysisModelAbnormalRectificationList') {
        //             // 获取模型整改数量
        //             this.props.dispatch(createAction('modelAnalysisAectificationModel/getCheckedRectificationList')({}));
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'AlarmSectionList') {
        //             // 获取异常识别数量
        //             this.props.dispatch(
        //                 createAction('alarmAnaly/getOperationKeyParameterCount')({
        //                     beginTime: moment()
        //                         .subtract(1, 'month')
        //                         .format('YYYY-MM-DD 00:00:00'),
        //                     endTime: moment().format('YYYY-MM-DD 23:59:59')
        //                 })
        //             );
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'KeyParameterVerificationList') {
        //             // 获取关键参数核查 计数
        //             this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
        //         }
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'SuperviserRectifyList') {
        //             // 设施核查整改 计数
        //             this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
        //         }

        //         if (SentencedToEmpty(item, ['numkey'], '') == "TaskToBeVerifiedList") {
        //             // 2273c00d-7594-4f85-8174-b46903a93ff7
        //             // 异常识别2.0任务待核查
        //             // console.log('TaskToBeVerifiedList item = ', item);
        //             let buttons = [];
        //             SentencedToEmpty(item, ['buttonList'], [])
        //                 .map(btn => {
        //                     buttons.push({ ModelGuid: btn.code.replace(/[^0-9]/g, ''), ModelName: btn.name });
        //                 });
        //             buttons = buttons.sort((a, b) => {
        //                 return a.ModelGuid - b.ModelGuid;
        //             });
        //             this.props.dispatch(
        //                 createAction('abnormalTask/updateState')({
        //                     getCheckedListParams: {
        //                         IsTotal: true,
        //                         CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
        //                         beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
        //                         endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        //                         serchName: '',
        //                         pageSize: 200,
        //                         pageIndex: 1
        //                     }
        //                 })
        //             );
        //             this.props.dispatch(
        //                 createAction('abnormalTask/GetCheckedList')({
        //                     IsTotal: true,
        //                     CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
        //                     beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'),
        //                     endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        //                     serchName: '',
        //                     pageSize: 200,
        //                     pageIndex: 1
        //                 })
        //             );
        //         }
        //         // 异常识别2.0刷新
        //         if (SentencedToEmpty(item, ['numkey'], '') == 'MissionVerificationRectificationList') {
        //             // 异常识别2.0刷新
        //             // console.log('异常识别2.0刷新 item = ', item);
        //             // this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
        //             this.props.dispatch(createAction('abnormalTask/getCheckedRectificationList')({
        //                 params: {
        //                     pageIndex: 1, pageSize: 1000,
        //                     IsTotal: true
        //                 }
        //             }));
        //         }
        //     });
        //     SentencedToEmpty(this.props, ['workerBenchMenu'], []).map((item, index) => {
        //         /**
        //          * "工单执行统计" executiveStatisticsParams
        //          * "322ac13e-fadf-43ed-a7a6-b2ccde37f390"
        //          * "完成工单统计" completeTaskCountParams
        //          * "0c8da383-b312-431b-8ff5-f24f75c7f933"
        //          */
        //         if (item.id == "322ac13e-fadf-43ed-a7a6-b2ccde37f390") {
        //             // 工单执行统计
        //             this.props.dispatch(createAction('BWModel/getOperationTaskStatisticsInfoByDay')({
        //                 params: this.props.executiveStatisticsParams
        //             }));

        //         } else if (item.id == "0c8da383-b312-431b-8ff5-f24f75c7f933") {
        //             // 完成工单统计
        //             this.props.dispatch(createAction('BWModel/getCompleteTaskCount')({
        //                 params: this.props.completeTaskCountParams
        //             }));
        //         }
        //     })
        // });
        //刷新消息计数器
        this.props.dispatch(createAction('notice/getNewPushMessageList')({}));
        this.onFreshData();
    }

    loadAdvertisement = isInit => {
        console.log('loadAdvertisement');
        if (isInit) {
            this.props.dispatch(
                createAction('helpCenter/updateState')({
                    noticeContentPageIndex: 1,
                    // 滚屏只显示前五条
                    noticeContentPageSize: 5,
                    noticeContentResult: { status: -1 }
                })
            );
        } else {
            this.props.dispatch(
                createAction('helpCenter/updateState')({
                    noticeContentPageIndex: 1,
                    // 滚屏只显示前五条
                    noticeContentPageSize: 5
                })
            );
        }
        this.props.dispatch(createAction('helpCenter/getNoticeContentList')({}));
    };

    noticeCallback = ExistsNewNotice => {
        this.props.navigation.setParams({
            navigatePress: () => {
                this.props.dispatch(NavigationActions.navigate({ routeName: 'Notice', params: {} }));
            },
            ExistsNewNotice
        });
    };

    click = item => {
        SentencedToEmpty(this, ['refs', '_pullToRefresh', 'resetLastPositionY'], () => { })();

        if (item.numkey == 'SignInEnter') {
            this.props.dispatch(
                createAction('signInModel/updateState')({
                    fileUUID: `_sign_in_${new Date().getTime()}`,
                    workTypeSelectedItem: null, // 选中的工作类型
                    signInEntItem: null, // 选中的企业
                    signInType: 0
                })
            );
        } else if (item.numkey == 'ChengTaoSignIn') {
            this.props.dispatch(
                createAction('CTModel/updateState')({
                    fileUUID: `ct_sign_in_${new Date().getTime()}`
                })
            );
        } else if (item.numkey == 'OverWarning') {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'OverWarning'
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'OverWarning'
                })
            );
        } else if (item.numkey == 'ExceptionAlarm') {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'WorkbenchException'
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'WorkbenchException'
                })
            );
        } else if (item.numkey == 'OverAlarm') {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'WorkbenchOver'
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'WorkbenchOver'
                })
            );
        } else if (item.numkey == 'MissAlarm') {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'WorkbenchMiss'
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'WorkbenchMiss'
                })
            );
        } else if (item.numkey == 'PerformApproval') {
            this.props.dispatch(
                createAction('approvalModel/updateState')({
                    pendingData: { status: -1 }
                })
            );
        } else if (item.numkey == 'ChengTaoSignIn') {
            this.props.dispatch(
                createAction('CTModel/updateState')({
                    projectInfoListSearchStr: '',
                    selectedProject: {}
                })
            );
        } else if (item.numkey == 'SuperviserRectifyList') {
            this.props.dispatch(createAction('supervision/updateState')({ listTabIndex: 0 }));
        } else if (item.numkey == 'KeyParameterVerificationList') {
            this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({ listTabIndex: 0 }));
        }
        console.log('routeName = ', item.numkey);
        this.props.dispatch(NavigationActions.navigate({ routeName: item.numkey, params: item.params }));
    };

    renderFirstLevel = (item, index) => {
        const itemsLength = SentencedToEmpty(item, ['children'], []).length;
        // 用于测试
        // if (index == 0
        //     && SentencedToEmpty(item, ['children'], []).length == 8) {
        //     SentencedToEmpty(item, ['children'], []).push({ id: 123, label: '服务报告整改', img: require('../../../images/renwujilu.png'), dcountkey: 'ServiceReportRectificationList', numkey: 'ServiceReportRectificationList' });
        // }
        // if (index == 0
        //     && SentencedToEmpty(item, ['children'], []).length == 5) {
        //     SentencedToEmpty(item, ['children'], []).push({ id: 123, label: '备件更换', img: require('../../../images/renwujilu.png'), dcountkey: 'SparePartsChangeEditor', numkey: 'SparePartsChangeEditor' });
        // }
        // if (index == 0
        //     && SentencedToEmpty(item, ['children'], []).length == 6) {
        //     SentencedToEmpty(item, ['children'], []).push({ id: 123, label: '运维计划', img: require('../../../images/renwujilu.png'), dcountkey: 'OperationPlanEnter', numkey: 'OperationPlanEnter' });
        // }
        // if (index == 0
        //     && SentencedToEmpty(item, ['children'], []).length == 7) {
        //     SentencedToEmpty(item, ['children'], []).push({ id: 123, label: '服务提醒', img: require('../../../images/renwujilu.png'), dcountkey: 'ServiceReminderCalendar', numkey: 'ServiceReminderCalendar' });
        // }
        if (itemsLength > 0) {
            const lineNum = Math.ceil(itemsLength / 4);
            // let contentHeight = 92 * lineNum + 78;
            let contentHeight = 92 * lineNum + 53;
            return (
                <View
                    style={{
                        height: contentHeight,
                        // minHeight: 170,
                        backgroundColor: 'white',
                        width: SCREEN_WIDTH,
                        marginTop: 5
                    }}
                >
                    <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 15, paddingVertical: 0, marginTop: 13 }}>
                        {/* <Text style={{ fontSize: 16 }}>日常关注</Text> */}
                        <Text style={{ fontSize: 16, color: '#333333' }}>{`${SentencedToEmpty(item, ['name'], '---')}`}</Text>
                    </View>
                    <View style={{ width: SCREEN_WIDTH, flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
                        {SentencedToEmpty(item, ['children'], []).map((item, key) => {
                            return this.renderSecondLevel(item, key);
                        })}
                        {/* {
                            index == 0 ? this.renderSecondLevel({ id: 123, label: '_签到', img: require('../../../images/renwujilu.png'), dcountkey: 'SignInEnter', numkey: 'SignInEnter' }, '123')
                                : null
                        } */}
                        {/* {
                            index == 0 ? this.renderSecondLevel({ id: 123, label: '模型整改', img: require('../../../images/renwujilu.png'), dcountkey: 'AnalysisModelAbnormalRectificationList', numkey: 'AnalysisModelAbnormalRectificationList' }, '123')
                                : null
                        } */}
                    </View>
                </View>
            );
        }
    };

    renderSecondLevel = (item, key) => {
        /**
         * 
         *  图片
            领取工单			021d1519-b23d-48fd-8130-0e0bf44bd728
            成套签到            b8b30732-3dae-46c4-aeaf-2114c0516c06
     
     
            计数
            超标预警			401cc92e-7ef3-430f-8dc1-57d64b09c352
            待我审批			2fa0ef8d-dd69-46a3-b159-5ab105912c0a
            待办任务			0fc20ea8-5091-4d03-b964-8aa3e2dda124
            成套待办			185ef6e1-96b4-48bd-b36f-2949a03fd8f2
     
            各种报警（4个）
     
     
            特殊计数
            设施核查整改		4e66e62b-66f1-41fe-a595-37312c549bdb
            关键参数核查		f8c7b7dc-6441-40bb-bc7a-9bb4da5f211f
     
            宝武运维            ae4426a8-cdd3-4d5d-b2da-2b5f349373a2
     
            弃用的
            运维日历
            通知
         */
        // 图片
        /**
         * 故障反馈     735faa4e-4e9c-45cd-8802-f9553126acba
         * 领取工单		021d1519-b23d-48fd-8130-0e0bf44bd728
         * 宝武运维     ae4426a8-cdd3-4d5d-b2da-2b5f349373a2
         */
        let showCount = '-';
        if (item.id == '9e9bd943-1d5b-46c1-a0a9-c53bea71b552') {
            // 服务提醒
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == 'be671aa8-f21f-4230-87d6-6c12d2912d6c') {
            // 备件更换
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        // else if (item.id == '834900f4-4820-4143-87d2-1116377a46e3') {
        //     // 服务报告整改
        //     return (
        //         <TouchableOpacity
        //             key={`a${key}`}
        //             onPress={() => {
        //                 this.click(item);
        //             }}
        //         >
        //             <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
        //                 <Image style={{ width: 48, height: 48 }} source={item.img} />
        //                 <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
        //             </View>
        //         </TouchableOpacity>
        //     );
        // } 
        else if (item.id == 'efbd94a3-e794-457b-91f7-592df4b91af4') {
            // 异常整改 模型整改
            showCount = SentencedToEmpty(this.props, ['checkedRectificationListGResult', 'data', 'Total'], '-');
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{showCount}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '185ef6e1-96b4-48bd-b36f-2949a03fd8f2') {
            // 成套待办
            showCount = SentencedToEmpty(this.props, ['serviceDispatchResult', 'data', 'Total'], '-');
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{showCount}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == 'b8b30732-3dae-46c4-aeaf-2114c0516c06'
            // || item.id == '96f4f52d-fc33-4293-b62f-653cc9370288'
        ) {
            // 成套签到
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '27d6140f-0acb-4c54-bea1-61ef1ef36ac6') {
            // 运维签到
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '740171a4-a61d-4c14-bfa8-af32466574cc') {
            // 异常识别创建任务
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '2273c00d-7594-4f85-8174-b46903a93ff7') {
            // 待核查任务
            // return (
            //     <TouchableOpacity
            //         key={`a${key}`}
            //         onPress={() => {
            //             this.click(item);
            //         }}
            //     >
            //         <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            //             <Image style={{ width: 48, height: 48 }} source={item.img} />
            //             <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
            //         </View>
            //     </TouchableOpacity>
            // );
            return (
                <TouchableOpacity
                    key={`a1${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{SentencedToEmpty(this.props, [item.dcountkey], '-')}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '735faa4e-4e9c-45cd-8802-f9553126acba' || item.id == '021d1519-b23d-48fd-8130-0e0bf44bd728' || item.id == 'ae4426a8-cdd3-4d5d-b2da-2b5f349373a2') {
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Image style={{ width: 48, height: 48 }} source={item.img} />
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '153aecef-0ca7-470e-8503-b6df1ef592bf') {
            // 异常识别	153aecef-0ca7-470e-8503-b6df1ef592bf

            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        if (this.props.anaCount == '-') {
                        } else {
                            this.click(item);
                        }
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{this.props.anaCount}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == '4e66e62b-66f1-41fe-a595-37312c549bdb') {
            // 设施核查整改		4e66e62b-66f1-41fe-a595-37312c549bdb
            count = SentencedToEmpty(this.props.rectificationNumResult, ['data', 'Datas'], {});
            showCount = SentencedToEmpty(count, ['DaiZG'], 0) + SentencedToEmpty(count, ['ShenSZ'], 0) + SentencedToEmpty(count, ['YiZG'], 0);
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{showCount}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (item.id == 'f8c7b7dc-6441-40bb-bc7a-9bb4da5f211f') {
            // 关键参数核查		f8c7b7dc-6441-40bb-bc7a-9bb4da5f211f
            count = SentencedToEmpty(this.props.OperationKeyParameterCountResult, ['data', 'Datas'], {});
            showCount = SentencedToEmpty(count, ['noSubmit'], 0) + SentencedToEmpty(count, ['submit'], 0) + SentencedToEmpty(count, ['norectified'], 0) + SentencedToEmpty(count, ['rectified'], 0) + SentencedToEmpty(count, ['appeal'], 0);
            return (
                <TouchableOpacity
                    key={`a${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[{ color: '#666666' }]}>{showCount}</Text>
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            // 计数
            return (
                <TouchableOpacity
                    key={`a1${key}`}
                    onPress={() => {
                        this.click(item);
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH / 4, height: 72, marginTop: 10, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ height: 48, width: 48, backgroundColor: '#f0f0f0', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }]}>
                            {item.id == '0fc20ea8-5091-4d03-b964-8aa3e2dda124' ? (
                                <Text style={[{ color: '#666666' }]}>{this.props.homeData.status == 200 ? SentencedToEmpty(this.props, ['homeData', 'data', 'Datas', item.countkey], 0) : '-'}</Text>
                            ) : (
                                <Text style={[{ color: '#666666' }]}>{SentencedToEmpty(this.props, [item.dcountkey], '-')}</Text>
                            )}
                        </View>
                        <Text style={[{ marginTop: 10, color: '#666666' }]}>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };

    onRefreshing = () => {
        this.setState(
            {
                refreshing: true
            },
            () => {
                this.onFreshData(() => {
                    this.setState({
                        refreshing: false
                    });
                });
            }
        );
    };

    getTaskExecutiveStatisticsView = () => {
        const tabList = SentencedToEmpty(this.props
            , ['tabList'], [])
        console.log('tabList = ', tabList);
        // if (tabList.length > 0
        //     && tabList[this.props.tabIndex].name == '全员'
        // ) {

        // } else {
        //     return null;
        // }
    }

    render() {
        // return (<View><Text>workbench</Text></View>);
        // console.log('workerBenchMenu = ', SentencedToEmpty(this.props, ['workerBenchMenu'], []));
        const workerBenchMenu = SentencedToEmpty(this.props, ['workerBenchMenu'], {});
        const user = getToken();
        const tabLength = SentencedToEmpty(this.props, ['tabList'], []).length;
        let topButtonWidth = SCREEN_WIDTH;
        if (tabLength > 0) {
            topButtonWidth = SCREEN_WIDTH / tabLength;
        }
        console.log('123');
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                {SentencedToEmpty(this.props, ['noticeContentResult', 'status'], -1) == 200 && SentencedToEmpty(this.props, ['noticeContentResult', 'data', 'Datas'], []).length > 0 ? (
                    <TouchableOpacity
                        style={[{ zIndex: 200, marginBottom: 1 }]}
                        onPress={() => {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'AnnouncementsList',
                                    params: {}
                                })
                            );
                        }}
                    >
                        <View
                            style={{
                                width: SCREEN_WIDTH,
                                height: 40,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                marginBottom: this.props.homeData.status == 200 ? 0 : 10
                            }}
                        >
                            <Image style={{ width: 16, height: 16, marginLeft: 13, marginRight: 10 }} source={require('../../../images/ic_trumpet.png')} />

                            <TextAdvertisement propWidth={SCREEN_WIDTH - 67} />
                            <Image style={{ width: 16, height: 16, marginRight: 12 }} source={require('../../../images/right.png')} />
                        </View>
                    </TouchableOpacity>
                ) : null}
                <StatusPage
                    status={this.props.homeData.status}
                    // status={200}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        this.props.dispatch(createAction('app/updateState')({ homeData: { status: -1 } }));
                        //空页面按钮回调
                        this.onFreshData();
                    }}
                    onErrorPress={() => {
                        this.props.dispatch(createAction('app/updateState')({ homeData: { status: -1 } }));
                        //错误页面按钮回调
                        this.onFreshData();
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                zIndex: 999
                            }
                        ]}
                    >
                        <View style={[{
                            flexDirection: 'row', height: 44
                            , width: SCREEN_WIDTH, alignItems: 'center'
                            , justifyContent: 'space-between'
                            , backgroundColor: 'white'
                            , zIndex: 999
                        }]}>
                            {
                                SentencedToEmpty(this.props
                                    , ['tabList'], []).map((tabItem, tabIndex) => {
                                        console.log('tabList tabItem = ', tabItem);
                                        return (<View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                                onPress={() => {
                                                    this.props.dispatch(
                                                        createAction('login/updateState')({
                                                            tabSelectIndex: tabIndex,
                                                            menuList: SentencedToEmpty(tabItem, ['menuList'], [])
                                                            , workerBenchMenu: SentencedToEmpty(tabItem, ['editWorkBenchData'], []),
                                                        }));
                                                    this.onFreshDataWithParams(SentencedToEmpty(tabItem, ['menuList'], []));
                                                    if (tabItem.name == "全员") {
                                                        const beginTime = moment().format('YYYY-MM-DD 00:00:00')
                                                        const endTime = moment().format('YYYY-MM-DD 23:59:59')

                                                        this.props.dispatch(createAction('BWModel/updateState')({
                                                            executiveStatisticsResult: { status: -1 },
                                                            completeTaskCountResult: { status: -1 },
                                                            executiveStatisticsSelected: 1,
                                                            completeTaskCountSelected: 1,
                                                            executiveStatisticsParams: { beginTime, endTime },
                                                            completeTaskCountParams: { beginTime, endTime },
                                                        }));
                                                        // 工单执行统计

                                                        this.props.dispatch(createAction('BWModel/getOperationTaskStatisticsInfoByDay')({
                                                            params: { beginTime, endTime }
                                                        }));
                                                        this.props.dispatch(createAction('BWModel/getCompleteTaskCount')({
                                                            params: { beginTime, endTime }
                                                        }));
                                                    }
                                                }}
                                            >
                                                <View
                                                    style={[{
                                                        width: topButtonWidth, height: 44
                                                        , alignItems: 'center'
                                                    }]}
                                                >
                                                    <View style={[{
                                                        width: topButtonWidth, height: 42
                                                        , alignItems: 'center', justifyContent: 'center'
                                                    }]}>
                                                        <Text style={[{
                                                            fontSize: 15
                                                            , color: this.props.tabSelectIndex == tabIndex ? '#4AA0FF' : '#666666'
                                                        }]}>{SentencedToEmpty(tabItem, ['name'], `第${tabIndex + 1}类`)}</Text>
                                                    </View>
                                                    <View style={[{
                                                        width: 40, height: 2
                                                        , backgroundColor: this.props.tabSelectIndex == tabIndex ? '#4AA0FF' : 'white'
                                                    }]}>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>);
                                    })
                            }
                        </View>
                    </View>
                    <PullToRefresh ref='_pullToRefresh' style={[{ flex: 1 }]} HeaderComponent={LoadingComponent} refreshing={this.state.refreshing} enableRrefresh={this.state.enableRrefresh} onRefresh={this.onRefreshing}>
                        <ScrollView
                            style={{ flex: 1 }}
                        >
                            {
                                this.getTaskExecutiveStatisticsView()
                            }
                            {SentencedToEmpty(this.props, ['workerBenchMenu'], []).map((item, index) => {
                                /**
                                 * "工单执行统计"
                                 * "322ac13e-fadf-43ed-a7a6-b2ccde37f390"
                                 * "完成工单统计"
                                 * "0c8da383-b312-431b-8ff5-f24f75c7f933"
                                 */
                                console.log('item.id = ', item.id);
                                if (item.id == "322ac13e-fadf-43ed-a7a6-b2ccde37f390") {
                                    // 工单执行统计
                                    return (<ExecutiveStatistics />);
                                } else if (item.id == "0c8da383-b312-431b-8ff5-f24f75c7f933") {
                                    // 完成工单统计
                                    return (<CompleteTaskStatistics />);
                                } else {
                                    return this.renderFirstLevel(item, index);
                                }
                            })}
                        </ScrollView>
                    </PullToRefresh>
                    <ExecutiveLoadingView />
                </StatusPage>
            </View>
        );
    }
}

@connect(({ BWModel }) => ({
    executiveStatisticsResult: BWModel.executiveStatisticsResult,
    completeTaskCountResult: BWModel.completeTaskCountResult,
}))
class ExecutiveLoadingView extends PureComponent {
    render() {
        const excutiveStatus = SentencedToEmpty(this.props, ['executiveStatisticsResult', 'status'], 200);
        const completeStatus = SentencedToEmpty(this.props, ['completeTaskCountResult', 'status'], 200);
        if (excutiveStatus == -1 || completeStatus == -1) {
            return <SimpleLoadingView message={'加载中...'} />
        } else {
            return null;
        }
    }
}

@connect(({ BWModel }) => ({
    executiveStatisticsResult: BWModel.executiveStatisticsResult,
    completeTaskCountResult: BWModel.completeTaskCountResult,
    executiveStatisticsSelected: BWModel.executiveStatisticsSelected,
}))
class ExecutiveStatistics extends Component {

    render() {
        console.log('executiveStatisticsSelected = ', this.props.executiveStatisticsSelected);
        let _paramsList = [{ label: '完成工单', code: 'completeCount' },
        { label: '超时完成工单', code: 'overTimeCompleteCount' },
        ];
        if (this.props.executiveStatisticsSelected == 1) {
            _paramsList = [
                { label: '完成工单', code: 'completeCount' },
                { label: '超时完成工单', code: 'overTimeCompleteCount' },
                { label: '未完成工单', code: 'notCompleteCount' },
                { label: '超时未完成工单', code: 'overTimeNotCompleteCount' },
            ];
        }
        return (<View>
            <WorkbenchStatistics
                selected={this.props.executiveStatisticsSelected}
                label={'工单执行统计'}
                data={SentencedToEmpty(this.props, ['executiveStatisticsResult', 'data', 'Datas'], {})}
                getNewData={(item) => {
                    console.log('ExecutiveStatistics item = ', item);
                    // { code: '1', name: '今天' }, { code: '2', name: '昨天' }, { code: '3', name: '前天' }, { code: '4', name: '近7天' }

                    let beginTime = '', // 开始时间   
                        endTime = ''; //结束时间
                    if (item.code == 1) {
                        beginTime = moment().format('YYYY-MM-DD 00:00:00')
                        endTime = moment().format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 2) {
                        beginTime = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 3) {
                        beginTime = moment().subtract(2, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().subtract(2, 'days').format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 4) {
                        beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().format('YYYY-MM-DD 23:59:59')
                    }
                    this.props.dispatch(createAction('BWModel/updateState')({
                        executiveStatisticsSelected: item.code,
                        executiveStatisticsParams: { beginTime, endTime },
                        executiveStatisticsResult: { status: -1 },
                    }));

                    this.props.dispatch(createAction('BWModel/getOperationTaskStatisticsInfoByDay')({
                        params: { beginTime, endTime }
                    }));
                }}
                paramsList={_paramsList}
            />
        </View>);
    }
}

@connect(({ BWModel }) => ({
    completeTaskCountResult: BWModel.completeTaskCountResult,
    completeTaskCountSelected: BWModel.completeTaskCountSelected,
}))
class CompleteTaskStatistics extends Component {
    render() {
        const itemList = [
            { label: '巡检工单', code: 'inspectionCount' },
            { label: `${'校准'}工单`, code: 'calibrationCount' },
            { label: `${'维修'}工单`, code: 'repairCount' },
            { label: `${'参数核对'}工单`, code: 'matchingComparisonCount' },
            { label: `${'配合检查'}工单`, code: 'cooperationInspectionCount' },
            { label: `${'校验测试'}工单`, code: 'calibrationTestCount' },
            { label: `${'配合比对'}工单`, code: 'coordinationComparisonCount' },
            { label: `${'维护'}工单`, code: 'maintainReportCount' },
            { label: `${'备品备件更换'}工单`, code: 'sparesCount' },
            { label: `${'易耗品更换'}工单`, code: 'consumablesCount' },
            { label: `${'标准物质更换'}工单`, code: 'standCount' },
            { label: `${'试剂更换'}工单`, code: 'reagentCount' },
            { label: `${'异常处理'}工单`, code: 'dealExceptionCount' },
        ]
        const data = SentencedToEmpty(this.props, ['completeTaskCountResult', 'data', 'Datas'], {});
        let count = 0, newObj = {};
        for (let key in data) {
            if (SentencedToEmpty(data, [key]) > 0) {
                newObj[key] = data[key];
                count++;
            }
        }
        if (count == 0 && false) {
            return null;
        } else {
            return (<WorkbenchStatistics
                selected={this.props.completeTaskCountSelected}
                label={'完成工单统计'}
                data={newObj}
                getNewData={(item) => {
                    // console.log('CompleteTaskStatistics item = ', item);
                    // { code: '1', name: '今天' }, { code: '2', name: '昨天' }, { code: '3', name: '前天' }, { code: '4', name: '近7天' }

                    let beginTime = '', // 开始时间   
                        endTime = ''; //结束时间
                    if (item.code == 1) {
                        beginTime = moment().format('YYYY-MM-DD 00:00:00')
                        endTime = moment().format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 2) {
                        beginTime = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 3) {
                        beginTime = moment().subtract(2, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().subtract(2, 'days').format('YYYY-MM-DD 23:59:59')
                    } else if (item.code == 4) {
                        beginTime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
                        endTime = moment().format('YYYY-MM-DD 23:59:59')
                    }
                    this.props.dispatch(createAction('BWModel/updateState')({
                        completeTaskCountSelected: item.code,
                        completeTaskCountParams: { beginTime, endTime },
                        completeTaskCountResult: { status: -1 },
                    }));

                    this.props.dispatch(createAction('BWModel/getCompleteTaskCount')({
                        params: { beginTime, endTime }
                    }));
                }
                }
                paramsList={itemList}
            />);
        }
    }
}

@connect(({ BWModel }) => ({
    completeTaskCountParams: BWModel.completeTaskCountParams,
    executiveStatisticsParams: BWModel.executiveStatisticsParams,
}))
class WorkbenchStatistics extends Component {

    getStr = (selected) => {
        const pickerItems = [{ code: '1', name: '今天' }, { code: '2', name: '昨天' }, { code: '3', name: '前天' }, { code: '4', name: '近7天' }]
        let str = '未选中';
        pickerItems.map((item, index) => {
            if (item.code == selected) {
                str = item.name;
            }
        })
        return str;
    }

    onClick = (item) => {
        const that = this;
        this.props.dispatch(createAction('GeneralSearchModel/updateState')({
            dataList: [],
            keyWords: '',
        }));
        [{ label: '完成工单', code: 'completeCount' },
        { label: '超时完成工单', code: 'overTimeCompleteCount' },
        { label: '未完成工单', code: 'notCompleteCount' },
        { label: '超时未完成工单', code: 'overTimeNotCompleteCount' },
        ];
        [
            { label: '巡检工单', code: 'inspectionCount' },
            { label: `${'校准'}工单`, code: 'calibrationCount' },
            { label: `${'维修'}工单`, code: 'repairCount' },
            { label: `${'参数核对'}工单`, code: 'matchingComparisonCount' },
            { label: `${'配合检查'}工单`, code: 'cooperationInspectionCount' },
            { label: `${'校验测试'}工单`, code: 'calibrationTestCount' },
            { label: `${'配合比对'}工单`, code: 'coordinationComparisonCount' },
            { label: `${'维护'}工单`, code: 'maintainReportCount' },
            { label: `${'备品备件更换'}工单`, code: 'sparesCount' },
            { label: `${'易耗品更换'}工单`, code: 'consumablesCount' },
            { label: `${'标准物质更换'}工单`, code: 'standCount' },
            { label: `${'试剂更换'}工单`, code: 'reagentCount' },
            { label: `${'异常处理'}工单`, code: 'dealExceptionCount' },
        ];
        let params = {
            IsQueryAllUser: false,
            exceptionType: '0',
            IsPaging: true,
            operationUserId: getToken().UserId,
            // beginTime: this.props.TaskRecordbeginTime,
            // endTime: this.props.TaskRecordendTime,
            // completeBeginTime: this.props.TaskRecordbeginTime,
            // completeEndTime: this.props.TaskRecordendTime,
            pageIndex: 1,
            pageSize: 1000
        }
        /**
         * ExceptionType 运维状态 1、打卡异常 2、报警响应超时 3、工作超时
         * TaskStatusList  任务状态  可以多选  1、待执行 2、执行中 3、已完成  10系统关闭 11 待领取
         */
        switch (item.code) {
            case 'completeCount':
                // 完成工单
                params.TaskStatusList = [3];
                params.CompleteTime = `${this.props.executiveStatisticsParams.beginTime},${this.props.executiveStatisticsParams.endTime}`;
                break;
            case 'overTimeCompleteCount':
                // 超时完成工单
                params.TaskStatusList = [3];
                params.ExceptionType = 3;
                params.CompleteTime = `${this.props.executiveStatisticsParams.beginTime},${this.props.executiveStatisticsParams.endTime}`;
                break;
            case 'notCompleteCount':
                // 未完成工单
                // params.TaskStatusList = [1, 2, 10, 11];
                params.TaskStatusList = [1, 2, 11];
                // params.CreateTime = `${this.props.executiveStatisticsParams.beginTime},${this.props.executiveStatisticsParams.endTime}`;
                break;
            case 'overTimeNotCompleteCount':
                // 超时未完成工单
                // params.TaskStatusList = [1, 2, 10, 11];
                params.TaskStatusList = [1, 2, 11];
                params.ExceptionType = 3;
                // params.CreateTime = `${this.props.executiveStatisticsParams.beginTime},${this.props.executiveStatisticsParams.endTime}`;
                break;
            case 'inspectionCount':
                // 巡检工单
                params.TaskStatusList = [3];
                params.TaskTypeList = [1, 7];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'calibrationCount':
                // 校准
                params.TaskStatusList = [3];
                params.TaskTypeList = [3, 9];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'repairCount':
                // 维修
                params.TaskStatusList = [3];
                params.TaskTypeList = [21, 22];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'matchingComparisonCount':
                // 参数核对
                params.TaskStatusList = [3];
                params.TaskTypeList = [23, 24];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'cooperationInspectionCount':
                // 配合检查
                params.TaskStatusList = [3];
                params.TaskTypeList = [12, 6];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'calibrationTestCount':
                // 校验测试
                params.TaskStatusList = [3];
                params.TaskTypeList = [19, 20];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'coordinationComparisonCount':
                // 配合比对
                params.TaskStatusList = [3];
                params.TaskTypeList = [11, 5];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'maintainReportCount':
                // 维护
                params.TaskStatusList = [3];
                params.TaskTypeList = [2, 8];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'sparesCount':
                // 备品备件更换
                params.TaskStatusList = [3];
                params.TaskTypeList = [25, 28];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'consumablesCount':
                // 易耗品更换
                params.TaskStatusList = [3];
                params.TaskTypeList = [26, 29];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'standCount':
                // 标准物质更换
                params.TaskStatusList = [3];
                params.TaskTypeList = [30];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'reagentCount':
                // 试剂更换
                params.TaskStatusList = [3];
                params.TaskTypeList = [27];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
            case 'dealExceptionCount':
                // 异常处理
                params.TaskStatusList = [3];
                params.TaskTypeList = [31, 32];
                params.CompleteTime = `${this.props.completeTaskCountParams.beginTime},${this.props.completeTaskCountParams.endTime}`;
                break;
        }
        this.props.dispatch(
            createAction('BWModel/getTaskStatisticsList')({
                params,
            })
        );
        this.props.dispatch(
            createAction('GeneralSearchModel/updateState')({
                keyWords: '',
            })
        );

        this.props.dispatch(NavigationActions.navigate({
            routeName: 'GeneralRemoteSearchList',
            params: {
                title: SentencedToEmpty(item, ['label'], '工单'),
                searchPlaceHolder: '请输入关键字',
                emptyStringShowEmpty: false,
                doRemoteSearch: () => {

                    this.props.dispatch(
                        createAction('BWModel/getTaskStatisticsList')({
                            // params: {
                            //     IsQueryAllUser: false,
                            //     exceptionType: '0',
                            //     IsPaging: true,
                            //     operationUserId: getToken().UserId,
                            //     // beginTime: this.props.TaskRecordbeginTime,
                            //     // endTime: this.props.TaskRecordendTime,
                            //     completeBeginTime: this.props.TaskRecordbeginTime,
                            //     completeEndTime: this.props.TaskRecordendTime,
                            //     pageIndex: index,
                            //     pageSize: 20
                            // },
                            params,
                            // setListData: this.list.setListData
                        })
                    );
                },
                renderItem: (item, index, that) => {
                    return (
                        <TouchableOpacity
                            key={`${index}`}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#ffffff',
                                width: SCREEN_WIDTH,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                this.props.dispatch(createAction('taskModel/updateState')({ TaskID: item.TaskID, DGIMN: item.DGIMN, TaskCode: item.TaskCode }));
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'TaskDetail',
                                        params: {
                                            taskID: item.ID
                                        }
                                    })
                                );
                            }}
                        >
                            <View style={{ width: SCREEN_WIDTH - 26, marginLeft: 13, marginRight: 13 }}>
                                <SDLText style={{ marginTop: 15, fontSize: 15, color: '#333', lineHeight: 18 }}>{`${item.EntName}-${item.PointName}`}</SDLText>
                                <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 13, marginRight: 13 }]}>
                                    <View style={[{ flex: 1 }]}>
                                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>

                                            <SDLText style={{ color: '#666' }}>{item.TaskFromName}</SDLText>
                                            {SentencedToEmpty(item, ['ExceptionTypeName'], '') != '' ? <SDLText style={{ color: '#666' }}>{' | '}</SDLText> : null}
                                            {SentencedToEmpty(item, ['ExceptionTypeName'], '') != '' ? <SDLText style={{ color: '#D28B38' }}>{item.ExceptionTypeName}</SDLText> : null}
                                            {/* {SentencedToEmpty(item, ['taskOverName'], '') != '' ? <SDLText style={{ color: '#666' }}>{' | '}</SDLText> : null}
                                            {SentencedToEmpty(item, ['taskOverName'], '') != '' ? <SDLText style={{ color: '#D28B38' }}>{item.taskOverName}</SDLText> : null} */}

                                            {SentencedToEmpty(item, ['RecordName'], '') == '' ? null : <TextLabel style={{ marginLeft: 4 }} color={'#75A5FB'} text={item.RecordName} />}
                                        </View>
                                        <SDLText style={{ marginTop: 15, color: '#666', lineHeight: 16 }}>{`运维人员：${SentencedToEmpty(item, ['OperationsUserName'], '---')}`}</SDLText>
                                    </View>
                                    <View style={[{
                                        position: 'absolute', top: 8, right: 10, zIndex: 100
                                    }]}>
                                        {
                                            SentencedToEmpty(item, ['TaskStatus'], -1) == 3
                                                ? <Image style={{
                                                    width: 100, height: 100,
                                                }} source={require('../../../images/img_record_complete.png')} />
                                                : SentencedToEmpty(item, ['TaskStatus'], -1) != 3 ? <Image style={{
                                                    width: 100, height: 100,
                                                }} source={require('../../../images/img_record_unfinished.png')} />
                                                    : <View style={{ width: 100, height: 100, marginRight: 13 }} />
                                        }
                                    </View>
                                </View>
                                {SentencedToEmpty(item, ['CompleteTime'], '') == '' ? null : <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <SDLText style={{ flex: 1, color: '#666' }}>{'完成时间：' + moment(item.CompleteTime).format('YYYY/MM/DD HH:mm')}</SDLText>
                                </View>}
                                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                    <SDLText style={{ flex: 1, color: '#666' }}>{'派发时间：' + (SentencedToEmpty(item, ['CreateTime'], '') == '' ? '---/--/-- --:--' : moment(item.CreateTime).format('YYYY/MM/DD HH:mm'))}</SDLText>
                                </View>
                                {/* {
                                    SentencedToEmpty(item, ['CompleteTime'], '') == '' ? <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <SDLText style={{ flex: 1, color: '#ffffff' }}>{' '}</SDLText>
                                    </View> : null
                                } */}

                            </View>
                        </TouchableOpacity>
                    );
                },
                callback: (item) => {
                    // this.setState({

                    // });
                }
            }
        }));
    }

    render() {
        const { label
            , paramsList = []
        } = this.props;
        const pickerItems = [{ code: '1', name: '今天' }, { code: '2', name: '昨天' }, { code: '3', name: '前天' }, { code: '4', name: '近7天' }]
        return (<View
            style={[{
                width: SCREEN_WIDTH, alignItems: 'center'
                , backgroundColor: 'white'
                , marginTop: 5
            }]}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH - 34, height: 45
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 34, height: 44
                        , flexDirection: 'row', alignItems: 'center'
                        , justifyContent: 'space-between'
                    }]}
                >
                    <View
                        style={[{ flexDirection: 'row', alignItems: 'center' }]}
                    >
                        <Image
                            source={label == '完成工单统计' ? require('../../../images/ic_finish_task.png') : require('../../../images/ic_task_execute.png')}
                            style={[{
                                width: 15, height: 15, marginRight: 7
                            }]}
                        />
                        <Text style={[{ fontSize: 15, color: '#333333' }]}>{label}</Text>
                    </View>
                    <PickerTouchable
                        option={{
                            codeKey: 'code',
                            nameKey: 'name',
                            defaultCode: this.props.selected,
                            dataArr: pickerItems,
                            onSelectListener: item => {
                                console.log('item = ', item);
                                this.props.getNewData(item)
                            }
                        }}
                        style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                        <Text numberOfLines={2}
                            style={[{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }
                            ]}>
                            {this.getStr(this.props.selected)}
                        </Text>
                        <Image style={[{ height: 16, width: 16 }]} source={require('../../../images/down.png')} />
                    </PickerTouchable>
                </View>
                <View style={[{ width: SCREEN_WIDTH - 36, height: 1, backgroundColor: '#E7E7E7' }]} />
            </View>
            <View
                style={[{
                    flexDirection: 'row', paddingLeft: 17, paddingRight: 7
                    , paddingTop: 15, paddingBottom: 5, flexWrap: 'wrap'
                    , width: SCREEN_WIDTH
                }]}
            >
                {paramsList.map((item, index) => {
                    if (label == '完成工单统计') {
                        if (SentencedToEmpty(this.props, ['data', item.code], 0) > 0) {
                            return (<TouchableOpacity
                                onPress={() => {
                                    this.onClick(item);
                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 44) / 2, height: 28
                                        , backgroundColor: '#F7F8FA'
                                        , flexDirection: 'row', alignItems: 'center'
                                        , justifyContent: 'space-between', paddingHorizontal: 10
                                        , marginBottom: 10, marginRight: 10, borderRadius: 5
                                    }]}
                                >
                                    <Text style={[{ fontSize: 12, color: '#666666' }]}>{item.label}</Text>
                                    <Text style={[{ fontSize: 12, color: '#4AA0FF' }]}>{`${SentencedToEmpty(this.props, ['data', item.code], 0)}个`}</Text>
                                </View>
                            </TouchableOpacity>)
                        }
                    } else {
                        return (<TouchableOpacity
                            onPress={() => {
                                this.onClick(item);
                            }}
                        >
                            <View
                                style={[{
                                    width: (SCREEN_WIDTH - 44) / 2, height: 28
                                    , backgroundColor: '#F7F8FA'
                                    , flexDirection: 'row', alignItems: 'center'
                                    , justifyContent: 'space-between', paddingHorizontal: 10
                                    , marginBottom: 10, marginRight: 10, borderRadius: 5
                                }]}
                            >
                                <Text style={[{ fontSize: 12, color: '#666666' }]}>{item.label}</Text>
                                <Text style={[{ fontSize: 12, color: '#4AA0FF' }]}>{`${SentencedToEmpty(this.props, ['data', item.code], 0)}个`}</Text>
                            </View>
                        </TouchableOpacity>)
                    }

                })}
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});

// export default createStackNavigator({ Workbench });
export default Workbench;

class TextStyle1 extends Component {
    render() {
        return (
            <Text
                numberOfLines={1}
                style={[{
                    fontSize: 13, color: '#333333'
                    , flex: 1
                }]}
            >{this.props.children}</Text>
        )
    }
}

class TextStyle2 extends Component {
    render() {
        return (
            <Text
                numberOfLines={1}
                style={[{
                    fontSize: 12, color: '#999999'
                    , maxWidth: SCREEN_WIDTH / 2 - 20,
                }]}
            >
                {this.props.children}
            </Text>
        )
    }
}