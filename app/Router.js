/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2024-09-02 19:17:19
 * @LastEditTime: 2025-02-26 17:21:51
 * @FilePath: /SDLSourceOfPollutionS_dev/app/Router.js
 */
import { View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { init, Geolocation } from 'react-native-amap-geolocation';

// import { ReactNativeUniappModule } from 'react-native-uniapp'


import RootView from './framework/RootView';
import Actions from './utils/RouterUtils';
import BootPage from './components/page/login/BootPage';
import Login from './components/page/login/Login';
import MyTabView from './pOperationContainers/tabView/MyTabView';
import SetEnterpriseInformation from './components/page/login/SetEnterpriseInformation_dev';
import { loadRootUrl } from './dvapack/storage';
import AdvertBootPage from './components/page/login/AdvertBootPage';
import SearchList from './pOperationContainers/tabView/map/SearchList';
import GTaskOfEnterprise from './pOperationContainers/tabView/workbench/GTaskOfEnterprise';
import { NavigationActions } from './utils';
import { DeclareModule, SDLText } from './components';
import { dispatch } from '../index'
import { useDispatch, useSelector } from 'react-redux';
import TaskRecord from './pOperationContainers/tabView/workbench/TaskRecord';
import CreateTask from './pOperationContainers/tabView/workbench/CreateTask';
import AnnouncementsList from './pOperationContainers/tabView/workbench/AnnouncementsList';
import CusWebView from './components/CusWebView';
import PointDetail from './pollutionContainers/pointDetails/PointDetail';
import HistoryData from './pollutionContainers/pointDetails/HistoryData';
import HistoryDataLandscape from './pollutionContainers/pointDetails/HistoryDataLandscape';
import HistoryDataLandscapeChart from './pollutionContainers/pointDetails/HistoryDataLandscapeChart';
import HistoryDataLandscapeList from './pollutionContainers/pointDetails/HistoryDataLandscapeList';
import SuspendProductionList from './pollutionContainers/pointDetails/SuspendProductionList';
import SuspendReport from './xinjiangBranch/containers/SuspendReport';

import AbnormalityReportLst from './pollutionContainers/pointDetails/AbnormalityReportLst';
import AbnormalityReportDetails from './pollutionContainers/pointDetails/AbnormalityReportDetails';
import AbnormalityReport from './xinjiangBranch/containers/AbnormalityReport';

import OperationLog from './pollutionContainers/pointDetails/OperationLog';
import PointTaskRecord from './pollutionContainers/pointDetails/PointTaskRecord';
import OverLimits from './pollutionContainers/pointDetails/OverLimits';
import InformationBankOfEquipment from './pollutionContainers/pointDetails/InformationBankOfEquipment';


import SuspendProductionDetail from './pollutionContainers/pointDetails/SuspendProductionDetail';
import TestView from './pOperationContainers/TestView';
import ContactOperation from './pOperationContainers/components/ContactOperation';
import SearchListWithoutLoad from './components/page/SearchListWithoutLoad';
import GTasks from './pOperationContainers/tabView/workbench/GTasks';
import TaskDetail from './pOperationContainers/taskDetail/TaskDetail';
import WaterMaskCamera from './pOperationContainers/taskDetail/WaterMaskCamera';
import OverData from './pollutionContainers/pointDetails/OverData';
import ExceptionData from './pollutionContainers/pointDetails/ExceptionData';
import MissDataList from './pollutionContainers/pointDetails/MissDataList';
import OverAlarmVerify from './pOperationContainers/tabView/alarm/OverAlarmVerify';
import VerifyRecords from './pollutionContainers/pointDetails/VerifyRecords';
import SignInEnter from './pOperationContainers/tabView/workbenchSignin/SignInEnter';
import SupplementarySignIn from './pOperationContainers/tabView/workbenchSignin/SupplementarySignIn';
import SignInStatistics from './pOperationContainers/tabView/workbenchSignin/SignInStatistics';
import SignInStatisticsWithTeam from './pOperationContainers/tabView/workbenchSignin/SignInStatisticsWithTeam';
import SupplementarySignInRecord from './pOperationContainers/tabView/workbenchSignin/SupplementarySignInRecord';
import SupplementarySignInApprove from './pOperationContainers/tabView/workbenchSignin/SupplementarySignInApprove';
import ChengTaoSignIn from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoSignIn2';
import CTProjectInfoList from './pOperationContainers/tabView/chengTaoXiaoXi/CTProjectInfoList';
import SparePartsChangeEditor from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeEditor';
import SparePartsChangeRecords from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeRecords';
import OverWarning from './pOperationContainers/tabView/workbench/OverWarning';
import OverAlarm from './pOperationContainers/tabView/workbench/OverAlarm';
import ExceptionAlarm from './pOperationContainers/tabView/workbench/ExceptionAlarm';
import MissAlarm from './pOperationContainers/tabView/workbench/MissAlarm';
import AlarmHandleDetail from './pOperationContainers/tabView/workbench/AlarmHandleDetail';
import AlarmResponseAlarmDetail from './pOperationContainers/tabView/workbench/AlarmResponseAlarmDetail';
import AlarmResponseRecord from './pOperationContainers/tabView/workbench/AlarmResponseRecord';

import AlarmRecords from './pollutionContainers/pointDetails/AlarmRecords';
// import RemoteAlarmHandleEditer from './pOperationContainers/tabView/alarm/RemoteAlarmHandleEditer';
// import Login from './components/page/login/Login';
// const dispatch = useDispatch();

/**
 * 异常数据识别1.0
 */
import AlarmSectionList from './components/page/account/AlarmSectionList'
import AlarmAnalyList from './components/page/account/AlarmAnalyList'
import VerifyProgress from './components/page/account/AlarmAnalyze_1/VerifyProgress'
import AlarmDetails from './components/page/account/AlarmAnalyze/AlarmDetails'
import AlarmDataChart from './components/page/account/AlarmAnalyze_1/AlarmDataChart'
import AlarmDataChart2 from './components/page/account/AlarmAnalyze/AlarmDataChart'
import StatisPolValueNumsByDGIMN from './components/page/account/AlarmAnalyze/StatisPolValueNumsByDGIMN'
import FluctuationRange from './components/page/account/AlarmAnalyze_1/FluctuationRange'
import StatisLinearCoefficient from './components/page/account/AlarmAnalyze/StatisLinearCoefficient'
import AlarmVerifyAnalyze from './components/page/account/AlarmAnalyze/AlarmVerifyAnalyze'
import AlarmReview from './components/page/account/AlarmAnalyze/AlarmReview'

import AnalysisModelAbnormalRectificationList from './pOperationContainers/AnalysisModelModification/AnalysisModelAbnormalRectificationList'
import RectificationReviewDetails from './pOperationContainers/AnalysisModelModification/RectificationReviewDetails'
import AnalysisModelAbnormalRectificationRecords from './pOperationContainers/AnalysisModelModification/AnalysisModelAbnormalRectificationRecords'
import AbnormalVerifyDetails from './pOperationContainers/AnalysisModelModification/AbnormalVerifyDetails'
import AbnormalRectification from './pOperationContainers/AnalysisModelModification/AbnormalRectification'
import RectificationReviewExecution from './pOperationContainers/AnalysisModelModification/RectificationReviewExecution'

/**
 * 异常数据识别2.0
 */
import AbnormalEnterpriseList from './pOperationContainers/MissionVerification/AbnormalEnterpriseList'
import AbnormalOneETypeList from './pOperationContainers/MissionVerification/AbnormalOneETypeList'
import TaskProduce from './pOperationContainers/MissionVerification/TaskProduce'
import TaskToBeVerifiedList from './pOperationContainers/MissionVerification/TaskToBeVerifiedList'
import ClueDetail from './pOperationContainers/MissionVerification/ClueDetail'
import CheckDetails from './pOperationContainers/MissionVerification/CheckDetails'
import StopRange from './components/page/account/AlarmAnalyze/StopRange'
import DataPhenomenon from './components/page/account/AlarmAnalyze/DataPhenomenon'

import MissionVerificationRectificationList from './pOperationContainers/MissionVerification/MissionVerificationRectificationList'
import MissionAnalysisModelAbnormalRectificationRecords from './pOperationContainers/MissionVerification/MissionAnalysisModelAbnormalRectificationRecords'
import CheckRoleList from './pOperationContainers/MissionVerification/CheckRoleList'
import RepulseMissionVerification from './pOperationContainers/MissionVerification/RepulseMissionVerification'
import RepulseCheckList from './pOperationContainers/MissionVerification/RepulseCheckList'
import MissionAbnormalVerifyDetails from './pOperationContainers/MissionVerification/MissionAbnormalVerifyDetails'
import MissionAbnormalRectification from './pOperationContainers/MissionVerification/MissionAbnormalRectification'
import MissionRectificationReviewDetails from './pOperationContainers/MissionVerification/MissionRectificationReviewDetails'
import MissionRectificationReviewExecution from './pOperationContainers/MissionVerification/MissionRectificationReviewExecution'

/* jab */
import ServiceDispatchMessage from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceDispatchMessage';
import NormalMessageDetail from './pOperationContainers/tabView/chengTaoXiaoXi/NormalMessageDetail';
import PerformanceDetail from './pOperationContainers/tabView/workbench/PerformanceDetail';
import SuperviseRectifyDetail from './pOperationContainers/tabView/workbench/SuperviseRectifyDetail';
import ServiceReminderInfoDetail from './pOperationContainers/tabView/workbench/ServiceReminderInfoDetail';
import ReviewWorkOrderStatistics from './pOperationContainers/tabView/workbench/ReviewWorkOrderStatistics';
// import ChengTaoTaskDetail from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoTaskDetail';
import HelpCenter from './components/page/account/HelpCenter';
import DownLoadAPP from './components/page/account/DownLoadAPP';
import OperaStaffInfo from './pollutionContainers/pointDetails/OperaStaffInfo';
import AccountSecurity from './components/page/account/AccountSecurity';
import PushSetting from './components/page/account/PushSetting';
import RepairRecordForm from './operationContainers/taskViews/taskExecution/formViews/RepairRecordForm';
import CalibrationRecordList from './operationContainers/taskViews/taskExecution/formViews/CalibrationRecordList';
import CalibrationRecordEdit from './operationContainers/taskViews/taskExecution/formViews/CalibrationRecordEdit';
import SparePartsRecord from './operationContainers/taskViews/taskExecution/formViews/PoSparePartsRecord';
import BdRecordList from './operationContainers/taskViews/taskExecution/formViews/BdRecordList';
import BdRecordEdit from './operationContainers/taskViews/taskExecution/formViews/BdRecordEdit';
import SparePartsForm from './operationContainers/taskViews/taskExecution/formViews/PoSparePartsForm';
import BdSelectedEdit from './operationContainers/taskViews/taskExecution/formViews/BdSelectedEdit';
import BdItemSetting from './operationContainers/taskViews/taskExecution/formViews/BdItemSetting';
import SelectSearchList from './pOperationContainers/taskDetail/SelectSearchList';
import PoConsumablesReplaceRecord from './operationContainers/taskViews/taskExecution/formViews/PoConsumablesReplaceRecord';
import PoConsumablesReplaceForm from './operationContainers/taskViews/taskExecution/formViews/PoConsumablesReplaceForm';
import PoStandardGasRepalceForm from './operationContainers/taskViews/taskExecution/formViews/PoStandardGasRepalceForm';
import PoStandardGasReplacementRecord from './operationContainers/taskViews/taskExecution/formViews/PoStandardGasReplacementRecord';
import PoPeihejianchaJilu from './operationContainers/taskViews/taskExecution/formViews/PoPeihejianchaJilu';
import PerformApproval from './operationContainers/approval/PerformApproval';
import CalibrationRecordTime from './operationContainers/taskViews/taskExecution/formViews/CalibrationRecordTime';
import ImageForm from './pOperationContainers/taskDetail/ImageForm';
import EquipmentFaultForm from './pOperationContainers/taskDetail/EquipmentFaultForm';
import WaterCalibrationForm from './operationContainers/taskViews/taskExecution/formViews/WaterCalibrationForm';
import WaterCalibrationItemEdit from './operationContainers/taskViews/taskExecution/formViews/WaterCalibrationItemEdit';
import StandardSolutionCheckForm from './operationContainers/taskViews/taskExecution/formViews/StandardSolutionCheckForm';
import StandardSolutionCheckItemEdit from './operationContainers/taskViews/taskExecution/formViews/StandardSolutionCheckItemEdit';
import WaterSampleComparisonTestForm from './operationContainers/taskViews/taskExecution/formViews/WaterSampleComparisonTestForm';
import WaterSampleComparisonTestItemEdit from './operationContainers/taskViews/taskExecution/formViews/WaterSampleComparisonTestItemEdit';
import PoStandardLiquidReplaceRecord from './operationContainers/taskViews/taskExecution/formViews/PoStandardLiquidReplaceRecord';
import PoStandardLiquidReplaceForm from './operationContainers/taskViews/taskExecution/formViews/PoStandardLiquidReplaceForm';
import ChengTaoGTask from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoGTask';
import ChengTaoTaskRecord from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoTaskRecord';
import ChengTaoTaskDetail from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoTaskDetail';
import AcceptanceServiceReportSingle from './pOperationContainers/tabView/chengTaoXiaoXi/AcceptanceServiceReportSingle';
import SevenFormViewSingle from './pOperationContainers/tabView/chengTaoXiaoXi/SevenFormViewSingle';
import WorkRecordSingle from './pOperationContainers/tabView/chengTaoXiaoXi/WorkRecordSingle';
import AcceptanceServiceReportMultiple from './pOperationContainers/tabView/chengTaoXiaoXi/AcceptanceServiceReportMultiple';
import WorkRecord72 from './pOperationContainers/tabView/chengTaoXiaoXi/WorkRecord72';
import SevenFormViewMultiple from './pOperationContainers/tabView/chengTaoXiaoXi/SevenFormViewMultiple';
import EquipmentInstallationPic from './pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPic';
import DebuggingDetection72 from './pOperationContainers/tabView/chengTaoXiaoXi/DebuggingDetection72';
import ParameterSettingPic from './pOperationContainers/tabView/chengTaoXiaoXi/ParameterSettingPic';
import CTPeiHeJianChaList from './pOperationContainers/tabView/chengTaoXiaoXi/CTPeiHeJianChaList';
import RepairRecords from './pOperationContainers/tabView/chengTaoXiaoXi/RepairRecords';
import EquipmentInstallationPicItemEditor from './pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPicItemEditor';
import CTPeiHeJianChaSubmitForm from './pOperationContainers/tabView/chengTaoXiaoXi/CTPeiHeJianChaSubmitForm';
import RepairSubmitForm from './pOperationContainers/tabView/chengTaoXiaoXi/RepairSubmitForm';
import EquipmentInstallationPicAudit from './pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPicAudit';
import EquipmentInstallationPicAuditEditor from './pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPicAuditEditor';
import ServiceUnderWarranty from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceUnderWarranty';
import TimeoutService from './pOperationContainers/tabView/chengTaoXiaoXi/TimeoutService';
import DuplicateService from './pOperationContainers/tabView/chengTaoXiaoXi/DuplicateService';
import LeftoverProblem from './pOperationContainers/tabView/chengTaoXiaoXi/LeftoverProblem';
import ServiceReportRectificationList from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationList';
import ServiceReportRectificationDetail from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationDetail';
import ServiceReminderCalendar from './pOperationContainers/ServiceReminder/ServiceReminderCalendar';
import ServiceReminderDetailEditor from './pOperationContainers/ServiceReminder/ServiceReminderDetailEditor';
import ContractNumberLocalSearchList from './pOperationContainers/ServiceReminder/ContractNumberLocalSearchList';
import KeyParameterVerificationList from './pOperationContainers/KeyParameterVerification/KeyParameterVerificationList';
import KeyParameterVerificationCompleted from './pOperationContainers/KeyParameterVerification/KeyParameterVerificationCompleted';
import KeyParameterVerificationEditView from './pOperationContainers/KeyParameterVerification/KeyParameterVerificationEditView';
import KeyParameterTransfer from './pOperationContainers/KeyParameterVerification/KeyParameterTransfer';
import VerificationProblem from './pOperationContainers/KeyParameterVerification/VerificationProblem';
import KeyParameterVerificationProblemDetail from './pOperationContainers/KeyParameterVerification/KeyParameterVerificationProblemDetail';
import SuperviserRectifyList from './pOperationContainers/SuperviserRectify/SuperviserRectifyList';
import CorrectedSupervisionRecords from './pOperationContainers/tabView/workbench/CorrectedSupervisionRecords';
import SupervisionDetail from './pOperationContainers/SuperviserRectify/SupervisionDetail';
import SupervisionItemEditor from './pOperationContainers/tabView/workbench/SupervisionItemEditor';
import SupervisionItemAppeal from './pOperationContainers/SuperviserRectify/SupervisionItemAppeal';
import AgreementView from './components/page/login/AgreementView';
import EquipmentFailureFeedbackList from './pOperationContainers/tabView/workbench/EquipmentFailureFeedbackList';
import EquipmentFailureFeedbackEdit from './pOperationContainers/tabView/workbench/EquipmentFailureFeedbackEdit';
import EquipmentFailureFeedbackDetail from './pOperationContainers/tabView/workbench/EquipmentFailureFeedbackDetail';
import AdvertisingPage from './components/page/login/AdvertisingPage';
import AlarmVerifyDetail from './pOperationContainers/tabView/alarm/AlarmVerifyDetail';
import SignInAddressMap from './pOperationContainers/tabView/workbenchSignin/SignInAddressMap';
import WarningDetail from './pOperationContainers/tabView/workbench/WarningDetail';
import RemoteAlarmHandleEditer from './pOperationContainers/tabView/alarm/RemoteAlarmHandleEditer';
import ManualClaimTask_bw from './pOperationContainers/tabView/workbench/ManualClaimTask_bw';
import OperationPlanEnter from './pOperationContainers/operationPlan/OperationPlanEnter';
import ClaimTaskList from './pOperationContainers/tabView/workbench/ClaimTaskList';
import ApprovalDetails from './operationContainers/approval/ApprovalDetails';
import EquipmentAuditRectificationAppeal from './pOperationContainers/tabView/chengTaoXiaoXi/EquipmentAuditRectificationAppeal';
import ServiceReportRectificationMultipleEditor from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationMultipleEditor';
import ServiceReportRectificationEditor from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationEditor';
import ServiceReportRectificationAppeal from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationAppeal';
import TaskTransfer from './operationContainers/taskViews/taskExecution/TaskTransfer';
import SignInAddressSearchListView from './pOperationContainers/tabView/workbenchSignin/SignInAddressSearchListView';
import GeneralRemoteSearchList from './components/GeneralRemoteSearchList';
import ScopeMap from './operationContainers/taskViews/taskExecution/ScopeMap';
import GeneralLocalSearchList from './components/GeneralLocalSearchList';
import SparePartsChangeDetail from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeDetail';
import SparePartsChangeUpdate from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeUpdate';
import CTSignInMap from './pOperationContainers/tabView/chengTaoXiaoXi/CTSignInMap';
import ForgotPasswordPage1 from './components/page/forgotPassword/ForgotPasswordPage1';
import ForgotPasswordPage2 from './components/page/forgotPassword/ForgotPasswordPage2';
import WXBinding from './components/page/account/WXBinding';
import QualityControlRecordList from './pOperationContainers/qualityControl/QualityControlRecordList';
import QualityControlPanel from './pOperationContainers/qualityControl/QualityControlPanel';
import DoQualityControl from './pOperationContainers/qualityControl/DoQualityControl';
import ProvisioningOfAllPoints from './components/page/account/ProvisioningOfAllPoints';
import ProvisioningRecords from './components/page/account/ProvisioningRecords';
import SignInstatisticsWithPersonal from './pOperationContainers/tabView/workbenchSignin/SignInstatisticsWithPersonal';
import QualityControlDailyRecord from './pOperationContainers/qualityControl/QualityControlDailyRecord';
import QualityControlRecordDetail from './pOperationContainers/qualityControl/QualityControlRecordDetail';
import IndicationErrorAndResponseTimeList from './operationContainers/taskViews/taskExecution/formViews/IndicationErrorAndResponseTimeList';
import IndicationErrorAndResponseTimeEditor from './operationContainers/taskViews/taskExecution/formViews/IndicationErrorAndResponseTimeEditor';
import Patrol_CEM from './operationContainers/taskViews/taskExecution/formViews/Patrol_CEM';
import SignaturePage from './operationContainers/taskViews/taskExecution/formViews/components/SignaturePage';
// import OfflineImageUploadList from './components/page/account/OfflineImageUploadList';
function Test() {
    return (
        <View>
            <Text>Router</Text>
        </View>
    )
}
Actions.pushViewWithName(BootPage, 'BootPage', { headerShown: false });
Actions.pushViewWithName(AdvertBootPage, 'AdvertBootPage', { headerShown: false });
Actions.pushViewWithName(AdvertisingPage, 'AdvertisingPage', { title: '公告' });
Actions.pushViewWithName(Login, 'Login', { headerShown: false });
Actions.pushViewWithName(AgreementView, 'AgreementView', { title: '用户协议' });
Actions.pushViewWithName(SetEnterpriseInformation, 'SetEnterpriseInformation', { headerShown: false });
Actions.pushViewWithName(MyTabView, 'MyTab', { headerShown: false });
Actions.pushViewWithName(SearchList, 'SearchList', { headerShown: false });
Actions.pushViewWithName(ManualClaimTask_bw, 'ManualClaimTask', { title: '领取工单' });
Actions.pushViewWithName(OperationPlanEnter, 'OperationPlanEnter', { title: '运维计划' });
Actions.pushViewWithName(ClaimTaskList, 'ClaimTaskList', { title: '领取记录' });

Actions.pushViewWithName(GTaskOfEnterprise, 'GTaskOfEnterprise', {
    title: '待办任务', headerRight: () => (
        <TouchableOpacity
            onPress={() => {
                dispatch(NavigationActions.navigate({ routeName: 'TaskRecord' }));
            }}
        >
            <SDLText style={{ color: '#fff', marginLeft: 16 }}>{'工单记录'}</SDLText>
        </TouchableOpacity>
    )
});
Actions.pushViewWithName(TaskRecord, 'TaskRecord', {
    title: '任务记录', headerRight: () => (
        <DeclareModule
            contentRender={() => {
                return <Text style={[{ fontSize: 13, color: 'white', marginLeft: 16 }]}>{'说明'}</Text>;
            }}
            options={{
                headTitle: '说明',
                innersHeight: 140,
                messText: `任务工单在结束后720分钟内允许修改。`,
                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                buttons: [
                    {
                        txt: '知道了',
                        btnStyle: { backgroundColor: '#fff' },
                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                        onpress: () => { }
                    }
                ]
            }}
        />
    )
});
Actions.pushViewWithName(CreateTask, 'CreateTask', { title: '创建任务' });
Actions.pushViewWithName(RepairRecordForm, 'RepairRecordForm', { title: '设备维修记录' });
Actions.pushViewWithName(CalibrationRecordList, 'CalibrationRecordList', { title: '零点量程漂移校准' });
Actions.pushViewWithName(CalibrationRecordEdit, 'CalibrationRecordEdit', { title: '校准记录表' });
Actions.pushViewWithName(SparePartsRecord, 'SparePartsRecord', { title: '备件更换记录表' });
Actions.pushViewWithName(SparePartsForm, 'SparePartsForm', { title: '备件更换记录' });
Actions.pushViewWithName(SelectSearchList, 'SelectSearchList', { title: '备件更换记录' });
Actions.pushViewWithName(BdRecordList, 'BdRecordList', { title: '校验测试记录' });
Actions.pushViewWithName(BdRecordEdit, 'BdRecordEdit', { title: '校验测试记录' });
Actions.pushViewWithName(BdSelectedEdit, 'BdSelectedEdit', { title: '校验测试记录' });
Actions.pushViewWithName(BdItemSetting, 'BdItemSetting', { title: '校验测试配置' });
Actions.pushViewWithName(PoConsumablesReplaceRecord, 'PoConsumablesReplaceRecord', { title: '易耗品更换记录' });
Actions.pushViewWithName(PoConsumablesReplaceForm, 'PoConsumablesReplaceForm', { title: '易耗品更换记录表' });
Actions.pushViewWithName(PoStandardGasRepalceForm, 'PoStandardGasRepalceForm', { title: '标准物质更换记录表' });
Actions.pushViewWithName(PoStandardGasReplacementRecord, 'PoStandardGasReplacementRecord', { title: '标准物质更换记录表' });
Actions.pushViewWithName(PoPeihejianchaJilu, 'PoPeihejianchaJilu', { title: '配合检查记录表' });
Actions.pushViewWithName(CalibrationRecordTime, 'CalibrationRecordTime', { title: '校准执行时间' });
Actions.pushViewWithName(ImageForm, 'ImageForm', { title: '校准执行时间' });
Actions.pushViewWithName(EquipmentFaultForm, 'EquipmentFaultForm', { title: '异常小时数记录' });
// 污水运维单据
Actions.pushViewWithName(WaterCalibrationForm, 'WaterCalibrationForm', { title: '水质校准记录表' });
Actions.pushViewWithName(WaterCalibrationItemEdit, 'WaterCalibrationItemEdit', { title: '水质校准记录表' });
Actions.pushViewWithName(StandardSolutionCheckForm, 'StandardSolutionCheckForm', { title: '标液检查记录' });
Actions.pushViewWithName(StandardSolutionCheckItemEdit, 'StandardSolutionCheckItemEdit', { title: '标液检查记录' });
Actions.pushViewWithName(WaterSampleComparisonTestForm, 'WaterSampleComparisonTestForm', { title: '水样比对试验记录' });
Actions.pushViewWithName(WaterSampleComparisonTestItemEdit, 'WaterSampleComparisonTestItemEdit', { title: '水样比对试验记录' });
Actions.pushViewWithName(PoStandardLiquidReplaceRecord, 'PoStandardLiquidReplaceRecord', { title: '试剂更换记录表' });
Actions.pushViewWithName(PoStandardLiquidReplaceForm, 'PoStandardLiquidReplaceForm', { title: '试剂更换记录表' });


// 待我审批
Actions.pushViewWithName(PerformApproval, 'PerformApproval', { title: '审批' });
Actions.pushViewWithName(ApprovalDetails, 'ApprovalDetails', { title: '审批' });


Actions.pushViewWithName(AnnouncementsList, 'AnnouncementsList', { title: '通知公告' });
Actions.pushViewWithName(CusWebView, 'CusWebView', { title: '公告详情' });
Actions.pushViewWithName(PointDetail, 'PointDetail', { title: '站点详情' });
Actions.pushViewWithName(HistoryData, 'HistoryData', { title: '数据查询' });
Actions.pushViewWithName(HistoryDataLandscape, 'HistoryDataLandscape', { headerShown: false }); //  切换横评 数据查询
Actions.pushViewWithName(HistoryDataLandscapeChart, 'HistoryDataLandscapeChart');//横评 数据查询 图表
Actions.pushViewWithName(HistoryDataLandscapeList, 'HistoryDataLandscapeList'); //横评 数据查询 列表

Actions.pushViewWithName(SuspendProductionList, 'SuspendProductionList', { title: '停运上报' }); //停运上报
Actions.pushViewWithName(SuspendProductionDetail, 'SuspendProductionDetail', { title: '停运详情' }); //停运详情
Actions.pushViewWithName(SuspendReport, 'SuspendReport', { title: '停运上报' }); //停运上报界面

Actions.pushViewWithName(AbnormalityReportLst, 'AbnormalityReportLst', { title: '异常报告上报' }); //异常报告上报列表
Actions.pushViewWithName(AbnormalityReport, 'AbnormalityReport', { title: '异常报告上报' }); //异常上报页面
Actions.pushViewWithName(AbnormalityReportDetails, 'AbnormalityReportDetails', { title: '异常上报详情' }); //异常上报详情

Actions.pushViewWithName(PointTaskRecord, 'PointTaskRecord', { title: '运维工单' }); //运维工单

Actions.pushViewWithName(OperationLog, 'OperationLog', { title: '运维日志' }); //运维日志
Actions.pushViewWithName(OverLimits, 'OverLimits', { title: '排放限值' }); //排放限值
Actions.pushViewWithName(InformationBankOfEquipment, 'InformationBankOfEquipment', { title: '设备资料库' }); //设备资料库

Actions.pushViewWithName(TestView, 'TestView', { title: '测试页面' });
Actions.pushViewWithName(ContactOperation, 'ContactOperation', { title: '监测目标' });
Actions.pushViewWithName(SearchListWithoutLoad, 'SearchListWithoutLoad', { title: '监测点选择' });
Actions.pushViewWithName(GTasks, 'GTasks', { title: '待办任务' });
Actions.pushViewWithName(TaskTransfer, 'TaskTransfer', { title: '任务转移' });

Actions.pushViewWithName(TaskDetail, 'TaskDetail', { title: '任务详情' });
Actions.pushViewWithName(WaterMaskCamera, 'WaterMaskCamera', { headerShown: false });
Actions.pushViewWithName(OverData, 'OverData', { title: '超标数据' });
Actions.pushViewWithName(ExceptionData, 'ExceptionData', { title: '异常数据' });
Actions.pushViewWithName(MissDataList, 'MissDataList', { title: '缺失数据' });
// Actions.pushViewWithName(OverAlarmVerify, 'OverAlarmVerify', { title: '超标核实记录' });
Actions.    pushViewWithName(VerifyRecords, 'VerifyRecords', { title: '超标核实记录' });
Actions.pushViewWithName(AlarmVerifyDetail, 'AlarmVerifyDetail', { title: '核实信息' });

Actions.pushViewWithName(SignInEnter, 'SignInEnter', { title: '签到' });
Actions.pushViewWithName(SupplementarySignIn, 'SupplementarySignIn', {
    title: '补签', headerRight: () => (
        <TouchableOpacity
            onPress={() => {
                dispatch(NavigationActions.navigate({
                    routeName: 'SupplementarySignInRecord'
                    , params: {}
                }));
            }}
        >
            <SDLText style={{ color: '#fff', marginLeft: 16 }}>{'补签记录'}</SDLText>
        </TouchableOpacity>
    )
});
Actions.pushViewWithName(SignInAddressMap, 'SignInAddressMap', { title: '地点微调' });
Actions.pushViewWithName(SignInAddressSearchListView, 'SignInAddressSearchListView', { headerShown: false });
Actions.pushViewWithName(ScopeMap, 'ScopeMap', { title: '查看打卡范围' });

Actions.pushViewWithName(SignInStatistics, 'SignInStatistics', { title: '统计' });
Actions.pushView(SignInStatisticsWithTeam, { title: '统计' });
Actions.pushView(SignInstatisticsWithPersonal, { title: '个人统计' });

Actions.pushViewWithName(SupplementarySignInRecord, 'SupplementarySignInRecord', { title: '补签记录' });
Actions.pushViewWithName(SupplementarySignInApprove, 'SupplementarySignInApprove', { title: '补签记录' });

// 模型1.0
Actions.pushViewWithName(AlarmSectionList, 'AlarmSectionList', { title: '异常识别线索' });
Actions.pushViewWithName(AlarmAnalyList, 'AlarmAnalyList', { title: '异常识别线索' });
Actions.pushViewWithName(VerifyProgress, 'VerifyProgress', { title: '线索核实' });
Actions.pushViewWithName(AlarmDetails, 'AlarmDetails', { title: '报警信息' });
Actions.pushViewWithName(AlarmDataChart, 'AlarmDataChart', { title: '数据列表' });
Actions.pushViewWithName(StatisPolValueNumsByDGIMN, 'StatisPolValueNumsByDGIMN', { title: '密度分布直方图' });
Actions.pushViewWithName(FluctuationRange, 'FluctuationRange', { title: '波动范围' });
Actions.pushViewWithName(StatisLinearCoefficient, 'StatisLinearCoefficient'); // 图表数据
Actions.pushViewWithName(AlarmVerifyAnalyze, 'AlarmVerifyAnalyze', { title: '报警核实' });
Actions.pushViewWithName(AlarmReview, 'AlarmReview', { title: '复核' });

Actions.pushViewWithName(AnalysisModelAbnormalRectificationList, 'AnalysisModelAbnormalRectificationList', { title: '异常整改' }); // 异常整改
Actions.pushViewWithName(RectificationReviewDetails, 'RectificationReviewDetails', { title: '整改复核详情' });
Actions.pushViewWithName(AnalysisModelAbnormalRectificationRecords, 'AnalysisModelAbnormalRectificationRecords', { title: '整改记录' });
Actions.pushViewWithName(AbnormalVerifyDetails, 'AbnormalVerifyDetails', { title: '核实详情' });
Actions.pushViewWithName(AbnormalRectification, 'AbnormalRectification', { title: '异常整改' });
Actions.pushViewWithName(RectificationReviewExecution, 'RectificationReviewExecution', { title: '整改复核' });


// 模型2.0
Actions.pushViewWithName(AbnormalEnterpriseList, 'AbnormalEnterpriseList', { title: '异常识别线索' });
Actions.pushViewWithName(AbnormalOneETypeList, 'AbnormalOneETypeList', { title: '异常识别线索' });
Actions.pushViewWithName(TaskProduce, 'TaskProduce', { title: '任务生成' });
Actions.pushViewWithName(AlarmDataChart2, 'AlarmDataChart2', { title: '数据列表' });
Actions.pushViewWithName(TaskToBeVerifiedList, 'TaskToBeVerifiedList', { title: '核查任务' });
Actions.pushViewWithName(ClueDetail, 'ClueDetail', { title: '线索详情' });
Actions.pushViewWithName(CheckDetails, 'CheckDetails', { title: '核查详情' });
Actions.pushViewWithName(StopRange, 'StopRange', { title: '停运范围' });
Actions.pushViewWithName(DataPhenomenon, 'DataPhenomenon', { title: '数据现象' });


Actions.pushViewWithName(MissionVerificationRectificationList, 'MissionVerificationRectificationList', { title: '异常整改' });
Actions.pushViewWithName(MissionAnalysisModelAbnormalRectificationRecords, 'MissionAnalysisModelAbnormalRectificationRecords', { title: '整改记录' });
Actions.pushViewWithName(CheckRoleList, 'CheckRoleList', { title: '用户名册' });
Actions.pushViewWithName(RepulseMissionVerification, 'RepulseMissionVerification', { title: '打回' });
Actions.pushViewWithName(RepulseCheckList, 'RepulseCheckList', { title: '打回记录' });
Actions.pushViewWithName(MissionAbnormalVerifyDetails, 'MissionAbnormalVerifyDetails', { title: '核实详情' });
Actions.pushViewWithName(MissionAbnormalRectification, 'MissionAbnormalRectification', { title: '异常整改' });
Actions.pushViewWithName(MissionRectificationReviewDetails, 'MissionRectificationReviewDetails', { title: '整改复核' });
Actions.pushViewWithName(MissionRectificationReviewExecution, 'MissionRectificationReviewExecution', { title: '整改复核' });




//成套签到
Actions.pushViewWithName(ChengTaoSignIn, 'ChengTaoSignIn', { title: '签到' });
Actions.pushViewWithName(CTSignInMap, 'CTSignInMap', { title: '查看打卡范围' });
Actions.pushViewWithName(CTProjectInfoList, 'CTProjectInfoList', { title: '项目信息' });

// 成套备件更换
Actions.pushViewWithName(SparePartsChangeEditor, 'SparePartsChangeEditor', { title: '备件更换' });
Actions.pushViewWithName(SparePartsChangeRecords, 'SparePartsChangeRecords', { title: '备件更换历史记录' });
Actions.pushViewWithName(SparePartsChangeDetail, 'SparePartsChangeDetail', { title: '更换详情' });
Actions.pushViewWithName(SparePartsChangeUpdate, 'SparePartsChangeUpdate', { title: '备件更换' });

// 数据报警
Actions.pushViewWithName(OverWarning, 'OverWarning', { title: '超标预警' });
Actions.pushViewWithName(WarningDetail, 'WarningDetail', { title: '报警详情' });
Actions.pushViewWithName(OverAlarm, 'OverAlarm', { title: '超标报警' });
Actions.pushViewWithName(ExceptionAlarm, 'ExceptionAlarm', { title: '异常报警' });
Actions.pushViewWithName(MissAlarm, 'MissAlarm', { title: '异常报警' });
Actions.pushViewWithName(AlarmRecords, 'AlarmRecords', { title: '报警详情' });
Actions.pushViewWithName(RemoteAlarmHandleEditer, 'RemoteAlarmHandleEditer', { title: '报警详情' });


AlarmResponseRecord
Actions.pushViewWithName(AlarmHandleDetail, 'AlarmHandleDetail', { title: '报警响应记录' });
Actions.pushViewWithName(AlarmResponseAlarmDetail, 'AlarmResponseAlarmDetail', { title: '报警详情' });
Actions.pushViewWithName(AlarmResponseRecord, 'AlarmResponseRecord', { title: '报警响应记录' });


Actions.pushViewWithName(OverAlarmVerify, 'OverAlarmVerify', { title: '超标核实' });
// Actions.pushViewWithName(RemoteAlarmHandleEditer, 'RemoteAlarmHandleEditer', { title: '报警处理登记表' });


// 消息中心
Actions.pushViewWithName(ServiceDispatchMessage, 'ServiceDispatchMessage');
Actions.pushViewWithName(NormalMessageDetail, 'NormalMessageDetail');//  成套通用消息详情
Actions.pushViewWithName(SuperviseRectifyDetail, 'SuperviseRectifyDetail', { title: '督查结果' });//督查整改详情
Actions.pushViewWithName(PerformanceDetail, 'PerformanceDetail', { title: '绩效消息' });//绩效消息详情
Actions.pushViewWithName(ReviewWorkOrderStatistics, 'ReviewWorkOrderStatistics');//绩效消息-审核工单统计详情
Actions.pushViewWithName(ServiceReminderInfoDetail, 'ServiceReminderInfoDetail', { title: '服务提醒' });// 服务提醒详情
// Actions.pushViewWithName(ChengTaoTaskDetail, 'ChengTaoTaskDetail', { title: '派单详情' });// 成套派单详情

// 我的
Actions.pushViewWithName(HelpCenter, 'HelpCenter', { title: '帮助中心' }); //帮助中心
Actions.pushViewWithName(DownLoadAPP, 'DownLoadAPP', { title: '下载应用' }); //下载应用
Actions.pushViewWithName(OperaStaffInfo, 'OperaStaffInfo', { title: '我的证书' }); //查看运维人员信息
Actions.pushViewWithName(AccountSecurity, 'AccountSecurity', { title: '账户与安全' }); //下载应用
Actions.pushViewWithName(PushSetting, 'PushSetting', { title: '推送设置' }); //推送设置
// Actions.pushViewWithName(OfflineImageUploadList, 'OfflineImageUploadList', { title: '离线图片上传' }); //离线图片上传

// 成套任务
Actions.pushViewWithName(ChengTaoGTask, 'ChengTaoGTask', { title: '待办任务' }); //待办任务
Actions.pushViewWithName(ChengTaoTaskRecord, 'ChengTaoTaskRecord', { title: '派单记录' }); //派单记录
Actions.pushViewWithName(ChengTaoTaskDetail, 'ChengTaoTaskDetail', { title: '派单详情' }); //派单详情
Actions.pushViewWithName(AcceptanceServiceReportSingle, 'AcceptanceServiceReportSingle', { title: '验收服务报告' }); //验收服务报告 单

Actions.pushViewWithName(SevenFormViewSingle, 'SevenFormViewSingle', { title: 'SevenFormViewSingle' }); // 七表单 单
Actions.pushViewWithName(WorkRecordSingle, 'WorkRecordSingle', { title: '工作记录' }); //工作记录 单
Actions.pushViewWithName(AcceptanceServiceReportMultiple, 'AcceptanceServiceReportMultiple', { title: '验收服务报告' }); //验收服务报告 多
Actions.pushViewWithName(WorkRecord72, 'WorkRecord72', { title: '工作记录' }); //工作记录 多
Actions.pushViewWithName(SevenFormViewMultiple, 'SevenFormViewMultiple', { title: 'SevenFormViewMultiple' }); //七表单 多
Actions.pushViewWithName(EquipmentInstallationPic, 'EquipmentInstallationPic', { title: '安装照片' }); //安装照片
Actions.pushViewWithName(EquipmentInstallationPicItemEditor, 'EquipmentInstallationPicItemEditor', { title: '安装照片' }); //安装照片

Actions.pushViewWithName(DebuggingDetection72, 'DebuggingDetection72', { title: '72小时调试检测' }); //72小时调试检测
Actions.pushViewWithName(ParameterSettingPic, 'ParameterSettingPic', { title: '参数设置照片' }); //参数设置照片
Actions.pushViewWithName(CTPeiHeJianChaList, 'CTPeiHeJianChaList', { title: '第三方检查汇报' }); //第三方检查汇报
Actions.pushViewWithName(CTPeiHeJianChaSubmitForm, 'CTPeiHeJianChaSubmitForm', { title: '第三方检查汇报' }); //第三方检查汇报
Actions.pushViewWithName(RepairRecords, 'RepairRecords', { title: '维修记录' }); //维修记录
Actions.pushViewWithName(RepairSubmitForm, 'RepairSubmitForm', { title: '设备维修记录' }); //设备维修记录
// 安装照片整改
Actions.pushViewWithName(EquipmentInstallationPicAudit, 'EquipmentInstallationPicAudit', { title: '安装照片不合格' }); //安装照片不合格
Actions.pushViewWithName(EquipmentInstallationPicAuditEditor, 'EquipmentInstallationPicAuditEditor', { title: '安装照片不合格' }); //安装照片不合格
Actions.pushViewWithName(EquipmentAuditRectificationAppeal, 'EquipmentAuditRectificationAppeal', { title: '申诉' }); //安装照片不合格 申诉

// 质保内服务填报
Actions.pushViewWithName(ServiceUnderWarranty, 'ServiceUnderWarranty', { title: '质保内服务填报' }); //质保内服务填报
// 超时服务填报
Actions.pushViewWithName(TimeoutService, 'TimeoutService', { title: '超时服务填报' }); //超时服务填报
// 重复服务填报
Actions.pushViewWithName(DuplicateService, 'DuplicateService', { title: '重复服务填报' }); //重复服务填报
// 遗留问题填报
Actions.pushViewWithName(LeftoverProblem, 'LeftoverProblem', { title: '遗留问题填报' }); //遗留问题填报
// 服务报告整改
Actions.pushViewWithName(ServiceReportRectificationList, 'ServiceReportRectificationList', { title: '服务报告整改' }); //服务报告整改
Actions.pushViewWithName(ServiceReportRectificationDetail, 'ServiceReportRectificationDetail', { title: '验收服务报告整改' }); //验收服务报告整改
Actions.pushViewWithName(ServiceReportRectificationMultipleEditor, 'ServiceReportRectificationMultipleEditor', { title: '验收服务报告整改' }); //验收服务报告整改 编辑 多条
Actions.pushViewWithName(ServiceReportRectificationEditor, 'ServiceReportRectificationEditor', { title: '验收服务报告整改' }); //验收服务报告整改 编辑 单条
Actions.pushViewWithName(ServiceReportRectificationAppeal, 'ServiceReportRectificationAppeal', { title: '申诉' }); //验收服务报告整改 编辑 单条

// 服务提醒
Actions.pushViewWithName(ServiceReminderCalendar, 'ServiceReminderCalendar', { title: '服务提醒' }); //服务提醒
Actions.pushViewWithName(ServiceReminderDetailEditor, 'ServiceReminderDetailEditor', { title: '添加服务提醒' }); //添加服务提醒
Actions.pushViewWithName(ContractNumberLocalSearchList, 'ContractNumberLocalSearchList', { title: '合同信息' }); //合同信息
// 关键参数核查(当前版本废弃)
Actions.pushViewWithName(KeyParameterVerificationList, 'KeyParameterVerificationList', { title: '关键参数核查' }); //关键参数核查
Actions.pushViewWithName(KeyParameterVerificationCompleted, 'KeyParameterVerificationCompleted', { title: '已完成核查记录' }); //已完成核查记录
Actions.pushViewWithName(KeyParameterVerificationEditView, 'KeyParameterVerificationEditView', { title: '修改核查信息' }); //修改核查信息
Actions.pushViewWithName(KeyParameterTransfer, 'KeyParameterTransfer', { title: '关键参数核查转移' }); //关键参数核查转移
Actions.pushViewWithName(VerificationProblem, 'VerificationProblem', { title: '核查问题' }); //核查问题
Actions.pushViewWithName(KeyParameterVerificationProblemDetail, 'KeyParameterVerificationProblemDetail', { title: '问题详情' }); //问题详情
// 设施核查整改
Actions.pushViewWithName(SuperviserRectifyList, 'SuperviserRectifyList', { title: '设施核查' }); //设施核查
Actions.pushViewWithName(CorrectedSupervisionRecords, 'CorrectedSupervisionRecords', { title: '督查已整改记录' }); //督查已整改记录
Actions.pushViewWithName(SupervisionDetail, 'SupervisionDetail', { title: '督查整改详情' }); //督查整改详情
Actions.pushViewWithName(SupervisionItemEditor, 'SupervisionItemEditor', { title: '督查整改详情' }); //督查整改详情
Actions.pushViewWithName(SupervisionItemAppeal, 'SupervisionItemAppeal', { title: '督查整改详情' }); //督查整改详情
// 故障反馈
Actions.pushViewWithName(EquipmentFailureFeedbackList, 'EquipmentFailureFeedbackList', { title: '设备故障反馈' }); //设备故障反馈
Actions.pushViewWithName(EquipmentFailureFeedbackEdit, 'EquipmentFailureFeedbackEdit', { title: '故障反馈记录' }); //故障反馈记录
Actions.pushViewWithName(EquipmentFailureFeedbackDetail, 'EquipmentFailureFeedbackDetail', { title: '故障反馈记录' }); //故障反馈记录

Actions.pushViewWithName(GeneralRemoteSearchList, 'GeneralRemoteSearchList', { title: '本地列表' }); //本地列表
Actions.pushViewWithName(GeneralLocalSearchList, 'GeneralLocalSearchList', { title: '本地列表' }); //本地列表
// 质控
Actions.pushViewWithName(QualityControlRecordList, 'QualityControlRecordList', { title: '核查记录' }); //核查记录
Actions.pushViewWithName(QualityControlPanel, 'QualityControlPanel', { title: '核查记录' }); //核查记录
Actions.pushViewWithName(DoQualityControl, 'DoQualityControl', { title: '手动核查' }); //手动核查
Actions.pushViewWithName(QualityControlDailyRecord, 'QualityControlDailyRecord', { title: '质控记录' }); //手动核查
Actions.pushViewWithName(QualityControlRecordDetail, 'QualityControlRecordDetail', { title: '质控记录详情' }); //手动核查



//忘记密码
Actions.pushView(ForgotPasswordPage1, { headerShown: false }); //修改密码1
Actions.pushView(ForgotPasswordPage2, { headerShown: false }); //修改密码2

Actions.pushView(WXBinding, { title: '微信推送绑定' }); //微信绑定
Actions.pushViewWithName(ProvisioningOfAllPoints, 'ProvisioningOfAllPoints', { title: '全部点位' }); //全部点位 开通记录
Actions.pushViewWithName(ProvisioningRecords, 'ProvisioningRecords', { title: '开通记录' }); //开通记录

// 任务表单 示值误差和响应时间 入口
Actions.pushViewWithName(IndicationErrorAndResponseTimeList, 'IndicationErrorAndResponseTimeList', { title: '示值误差和响应时间' });
Actions.pushViewWithName(IndicationErrorAndResponseTimeEditor, 'IndicationErrorAndResponseTimeEditor', { title: '示值误差和响应时间' });

// 巡检完全抽取法
Actions.pushViewWithName(Patrol_CEM, 'Patrol_CEM', { title: '完全抽取法CEMS日常巡检记录表' });
Actions.pushViewWithName(SignaturePage, 'SignaturePage', { title: '签名'});

Actions.pushView(Test, { headerShown: false });

const Stack = createNativeStackNavigator();
export default function Router() {
    // const { currentRoute } = useSelector(state => state.sdlNavigate);
    const sdlNavigate = useSelector(state => state.sdlNavigate);
    console.log('currentRoute  = ', sdlNavigate.currentRoute);
    useEffect(() => {
        async function initf() {
            await loadRootUrl();
            init({
                ios: '9df5f713ad0f0b8d2550436f5793e371',
                android:
                    CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_PROJECT'
                        ? // ? '4502a480cb8cefdeb655628a5c89c36d'
                        '90af9eb2dd0b43367d0102d81842b5f7'
                        : CURRENT_PROJECT == 'GRID_PROJECT'
                            ? 'c1e5f6237a8bdd6d80cca037d9d48721'
                            : CURRENT_PROJECT == 'GRID_ORERATION_PROJECT'
                                ? 'e0038624faec949f08168cc5dc41222a'
                                : '90af9eb2dd0b43367d0102d81842b5f7'
            }); //后台定位~
        }
        initf();
        // ReactNativeUniappModule.init();
        //监听401 重新登录
        const listener401 = DeviceEventEmitter.addListener('net401', () => {
            Actions.reset({
                index: 1,
                routes: [
                    { name: 'Login' },
                ],
            });
        });
        return () => {
            // componentWillUnmount
            listener401.remove();
        }
    }, [])

    // 推送消息监听 需要进一步调试，暂不使用
    //初始化阿里推送监听
    initAlipushListener = () => {
        DeviceEventEmitter.addListener('onMessage', this.onMessage);
        DeviceEventEmitter.addListener('onNotification', this.onNotification);
        DeviceEventEmitter.addListener('onNotificationOpened', this.onNotificationOpened);
    };

    // 解绑阿里推送监听
    removeAlipushListener = () => {
        DeviceEventEmitter.removeListener('onMessage', this.onMessage);
        DeviceEventEmitter.removeListener('onNotification', this.onNotification);
        DeviceEventEmitter.removeListener('onNotificationOpened', this.onNotificationOpened);
    };

    onNotificationOpened = e => {
        console.log('Message onNotificationOpened. Title:' + e.title + ', Content:' + e.content);
    };

    //事件处理逻辑
    onMessage = e => {
        console.log('Message Received. Title:' + e.title + ', Content:' + e.content);
    };
    onNotification = e => {
        console.log('Notification Received.Title:' + e.title + ', Content:' + e.content);
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
                <Stack.Screen
                    name="RootView"
                    component={RootView}
                />
                {/* <Stack.Screen
                    name="RootView"
                    component={Test}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
