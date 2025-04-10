/*
 * @Description:
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2023-06-16 17:09:37
 * @LastEditTime: 2025-03-31 19:50:12
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/index.js
 */
/**
 * 已迁移 未完成
 *
 */
/**
 * 已完成
 *
 */
import appModel from './app';
import sdlNavigateModel from './sdlNavigateModel';
import login from './login'; //登录
import account from './account'; //个人中心
import websocket from './websocket'; //websocket
import map from '../pollutionModels/map';
import pointDetails from '../pollutionModels/pointDetails';
import abnormalTask from './abnormalTask';
import alarm from '../pollutionModels/alarm';
import taskModel, { detectionTimesModel, repairRecordNewModel } from './taskModel';
// import exceptionModel from './exceptionModel';
import taskDetailModel from './taskDetailModel';
import notice from './notice';
// import configLoad from '../pollutionModels/configLoad';
import bdRecordModel from './formModels/bdRecordModel';
import bdRecordZBModel from './formModels/bdRecordZBModel';
// import patrolRecordModel from './formModels/patrolRecordModel';
import calibrationRecord from './formModels/calibrationRecord';
import patrolModel from './formModels/patrolModel';
// import equipmentAbnormal from './formModels/equipmentAbnormal';
// import machineryMaintenanceModel from './formModels/machineryMaintenanceModel';
import imageFormModel from './formModels/imageFormModel';
import imageModel from '../components/form/images/imageModel';
// import repairRecordModel from './formModels/repairRecordModel';
// import machineHaltRecord from './formModels/machineHaltRecord';
import equipmentFautModel from './formModels/equipmentFautModel';
// import commitStopResult from '../xinjiangBranch/models/enterpriseListModel';
import commitStopResult from './enterpriseListModel';
import claimTaskModels from './claimTaskModels';
import { peiHeJianChaModel, dataConsistencyModel } from './taskModel';
import waterCalibrationFormModel from './formModels/waterCalibrationFormModel'; // 水质校准记录 model
// import approvalModel from '../operationModels/approvalModel';
import standardSolutionCheckModel from './formModels/standardSolutionCheckModel'; // 标准溶液核查记录
// import waterParametersChangeModel from './formModels/waterParametersChangeModel'; // 设备参数变动记录表 废水 参数核对记录
// import gasParametersChangeModel from './formModels/gasParametersChangeModel'; // 设备参数变动记录表 烟气 设备参数变动记录表
import waterSampleComparisonTestModel from './formModels/waterSampleComparisonTestModel'; // 实际水样比对试验结果记录表
import indicationErrorAndResponseTimeModel from './formModels/indicationErrorAndResponseTimeModel'; // 示值误差和响应时间
import equipmentFailureFeedbackModel from './equipmentFailureFeedbackModel';
// import inspectionRecordsModel from './inspectionRecordsModel';
// import helpCenter from '../models/helpCenter';
import supervision from './supervision';
import keyParameterVerificationModel from './keyParameterVerificationModel';
import BWModel from './BWModel';
// import alarmAnaly from './alarmAnaly';
import alarmAnaly from './alarmAnaly_1';
import CTModel from './CTModel';
import CTRepair from './CTRepair';
import CTPeiHeJianCha from './CTPeiHeJianCha';
import CT7FormModel from './CT7FormModel';
import CTWorkRecordModel from './CTWorkRecordModel';
import CTParameterSettingPicModel from './CTParameterSettingPicModel';
import CTInstallationPhotosModel from './CTInstallationPhotosModel';
import modelAnalysisAectificationModel from './modelAnalysisAectificationModel';
import signInModel from './signInModel';
import CTServiceStatisticsModel from './CTServiceStatisticsModel';
import CTEquipmentPicAuditModel from './CTEquipmentPicAuditModel';
import CTServiceReminderModel from './CTServiceReminderModel';
import CTServiceReportRectificationModel from './CTServiceReportRectificationModel';
import operationPlanModel from './operationPlanModel';
import CTSparePartsChangeModel from './CTSparePartsChangeModel';
import GeneralSearchModel from './GeneralSearchModel';
import historyDataModel from './historyDataModel';
// import requestTestModel from './requestTestModel';
import baseModel from './model';
import helpCenter from './helpCenter';
import approvalModel from './approvalModel';
import tabAlarmListModel from './tabAlarmListModel';
import qualityControl from './qualityControl';
import dataForm from './dataForm';
import provisioning from './provisioning';
import SignInTeamStatisticsModel from './SignInTeamStatisticsModel';
/**淄博项目 */
import calibrationRecordZb from './formModels/calibrationRecordZb';
import calibrationRecordZbFs from './formModels/calibrationRecordZbFs';


export function registerModels(app) {
    app.model(appModel);
    app.model(sdlNavigateModel);
    app.model(baseModel);
    app.model(alarmAnaly);
    app.model(abnormalTask);
    app.model(CTPeiHeJianCha);
    app.model(helpCenter);
    app.model(login);
    app.model(account);
    app.model(websocket);
    app.model(taskModel);
    app.model(map);
    app.model(pointDetails);
    app.model(alarm);
    app.model(notice);
    // app.model(exceptionModel);
    app.model(taskDetailModel);
    // app.model(configLoad);
    app.model(bdRecordModel); //比对校验
    app.model(bdRecordZBModel); //比对校验 淄博
    // app.model(patrolRecordModel); //巡检
    app.model(calibrationRecord); //零点量程漂移与校准
    app.model(patrolModel); //巡检
    // app.model(equipmentAbnormal); //异常数据
    // app.model(machineryMaintenanceModel); //设备保养
    // app.model(repairRecordModel); //维修记录表
    // app.model(machineHaltRecord); //停机记录表
    app.model(equipmentFautModel); //设备故障记录
    app.model(imageFormModel);
    app.model(imageModel);
    app.model(commitStopResult); //停运上报
    app.model(claimTaskModels); // 领取工单
    // // 表单model
    app.model(peiHeJianChaModel); // 配合检查记录
    // app.model(dataConsistencyModel); // 数据一致性（实时数据）记录
    app.model(repairRecordNewModel); // 维修记录
    // app.model(detectionTimesModel); // 上月委托第三方检测次数
    app.model(waterCalibrationFormModel); // 废水 校准记录表
    app.model(approvalModel); // 任务审批
    app.model(standardSolutionCheckModel); // 标准溶液核查记录
    // app.model(waterParametersChangeModel); // 设备参数变动记录表 废水 参数核对记录
    // app.model(gasParametersChangeModel); // 设备参数变动记录表 烟气 设备参数变动记录表
    app.model(waterSampleComparisonTestModel); // 实际水样比对试验结果记录表
    app.model(indicationErrorAndResponseTimeModel); // 示值误差和响应时间
    app.model(equipmentFailureFeedbackModel); // 设备故障反馈
    // app.model(inspectionRecordsModel); // 督查记录
    app.model(supervision); // 督查整改
    app.model(keyParameterVerificationModel); // 关键参数核查
    app.model(BWModel); // 宝武 上海环保接口
    app.model(CTModel); // 成套相关功能
    app.model(CTRepair);
    app.model(CT7FormModel); // 成套 七张表单
    app.model(CTWorkRecordModel); // 成套 工作记录
    app.model(CTParameterSettingPicModel); // 成套 参数设置照片
    app.model(CTInstallationPhotosModel); // 成套 安装照片
    app.model(CTServiceStatisticsModel); // 成套 派单详情 服务统计
    app.model(modelAnalysisAectificationModel); // 模型报警整改
    app.model(signInModel); // 签到相关
    app.model(CTEquipmentPicAuditModel); // 签到相关
    app.model(CTServiceReminderModel); // 服务提醒
    app.model(CTServiceReportRectificationModel); // 服务报告整改
    app.model(operationPlanModel); // 运维计划
    app.model(CTSparePartsChangeModel); // 成套 备件更换
    app.model(GeneralSearchModel); // 通用搜索model
    app.model(historyDataModel); // 历史数据model
    // app.model(requestTestModel); // 网络请求本地测试
    app.model(qualityControl); // 质量控制
    app.model(dataForm); // 数据一览
    app.model(provisioning); //开通记录
    app.model(tabAlarmListModel); // tab报警列表 
    app.model(SignInTeamStatisticsModel); // 签到团队统计 
    
    /**淄博项目 */
    app.model(calibrationRecordZb); //零点量程漂移与校准 淄博 废气
    app.model(calibrationRecordZbFs); //零点量程漂移与校准 淄博 废水
}
