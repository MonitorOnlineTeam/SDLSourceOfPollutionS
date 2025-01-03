import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { SentencedToEmpty } from '../utils';
import { getInformationBankOfEquipmentFileUrl } from './utils';
import * as authService from '../services/auth';
import { CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, VersionInfo } from '../config';
import 'jsencrypt';
import Base64 from 'react-native-base64-master';
export default Model.extend({
    namespace: 'pointDetails',
    state: {
        //停产列表
        outputStopListDGIMN: '',
        outputStopList: [],
        outputStopListResult: { status: -1 },
        outputStopListIndex: 1,
        outputStopListPageSize: 20,
        outputStopListTotal: 0,

        abnormalListDGIMN: '',
        abnormalList: [],
        abnormalListResult: { status: -1 },
        abnormalListIndex: 1,
        abnormalPageSize: 20,
        abnormalListTotal: 0,

        verifyIndex: 1,
        verifyTotal: 0,
        verifyListData: [],
        selectCodeArr: [], //历史数据选中的污染因子
        verifyAlarmRecordResult: { status: -1 }, //已核实的关联报警数据
        selectTime: moment().format('YYYY-MM-DD HH:mm:ss'), //历史数据选中时间
        videoLstResult: { status: -1 },
        verifyListTargetDGIMN: '42102320160824',
        verifyListResult: { status: -1 },
        verifyBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        verifyEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        /**
         * rest/PollutantSourceApi/MonitorAlarmApi/OpetaionVerifyList
         * VerifyState 0全部 1工艺超标 2设备异常
         */
        VerifyState: 0,
        //超标记录相关
        overDataBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        overDataEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        overDataDataType: 'HourData',
        overDataIndex: 1,
        overDataTotal: 0,
        overDataListTargetDGIMN: 'yastqsn0000002',
        overLimitsDGIMN: '',
        overDataListData: [],
        overDataListResult: { status: -1 },
        ponitInfo: { status: -1 },
        systemMenu: [],
        PollantCodes: [],
        ChartLstDatas: [],
        chartStatus: { status: -1 },
        // 报警记录相关
        alarmRecordsBeginTime: moment()
            .subtract(50, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        alarmRecordsEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        alarmType: '',
        alarmRecordsIndex: 1,
        alarmRecordsTotal: 0,
        alarmRecordsListTargetDGIMN: 'yastqsn0000002',
        alarmRecordsListData: [],
        alarmRecordsListDataSelected: {},
        alarmRecordsListResult: { status: -1 },
        alarmRecordsPointInfo: {},
        // 运维日志
        operationLogsBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        operationLogsEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        operationLogsType: -1,
        operationLogsIndex: 1,
        operationLogsTotal: 0,
        operationLogsListTargetDGIMN: '62262431qlsp02',
        operationLogsListData: [],
        operationLogsRecordType: [],
        operationLogsListResult: { status: -1 },
        operationStaffInfo: { status: -1 },
        //设备资料库相关
        equipmentInfoDGIMN: '62020131jhdp02',
        equipmentInfoFileName: '',
        equipmentInfoListData: [],
        equipmentInfoListResult: { status: -1 },
        cityAQIDataList: [], //站点详情aqi列表
        cityNewModel: {}, //站点最新数据
        sourceType: '',
        overLimitsResult: { status: -1 },

        // 新疆 数据缺失记录
        missDataListResult: { status: -1 },
        missDataListData: [],
        missDataListIndex: 1,
        missDataListTotal: 0,
        missDataListDataType: 'HourData',
        missDataListBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        missDataListEndTime: moment().format('YYYY-MM-DD 23:59:59')
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 异常报告列表接口
         * @param {*} param0
         * @param {*} param1
         */
        *getAbnormalList(
            {
                payload: { params, setListData = data => { } }
            },
            { call, put, take, update, select }
        ) {
            let { abnormalListDGIMN, abnormalListIndex, abnormalPageSize, abnormalList } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.GetAbnormalList, {
                DGIMN: abnormalListDGIMN,
                pageSize: abnormalPageSize,
                pageIndex: abnormalListIndex
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newOutputStopList = abnormalList;
            if (status == 200) {
                if (abnormalListIndex == 1) {
                    newOutputStopList = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newOutputStopList = abnormalList.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    abnormalList: newOutputStopList,
                    abnormalListResult: result
                });
            } else {
                yield update({
                    abnormalListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(abnormalList, requestEnd - requestBegin);
        },
        /**
         * 停产列表接口
         * @param {*} param0
         * @param {*} param1
         */
        *getOutputStopList(
            {
                payload: { params, setListData = data => { } }
            },
            { call, put, take, update, select }
        ) {
            let { outputStopListDGIMN, outputStopListIndex, outputStopListPageSize, outputStopList } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.GetOutputStopList, {
                DGIMN: outputStopListDGIMN,
                pageSize: outputStopListPageSize,
                pageIndex: outputStopListIndex
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newOutputStopList = outputStopList;
            if (status == 200) {
                if (outputStopListIndex == 1) {
                    newOutputStopList = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newOutputStopList = outputStopList.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    outputStopList: newOutputStopList,
                    outputStopListResult: result
                });
            } else {
                yield update({
                    outputStopListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newOutputStopList, requestEnd - requestBegin);
        },
        /**
         * 获取运维人员信息
         * @param {*} param0
         * @param {*} param1
         */
        *operationStaffInfo(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.StaffInfo, params);
            yield update({ operationStaffInfo: result });
        },
        *methodexample({ payload }, { call, put, take, update, select }) { },
        /**
         * 获取设备资料库列表
         * @param {*} param0
         * @param {*} param1
         */
        *getEquipmentInfo(
            {
                payload: { setListData = (data, duration) => { }, apiParam = api.pollutionApi.PointDetails.GetEquipmentInfo }
            },
            { call, put, take, update, select }
        ) {
            let { equipmentInfoDGIMN, equipmentInfoFileName } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, apiParam, {
                PointCode: equipmentInfoDGIMN,
                FileName: equipmentInfoFileName
            });
            let newEquipmentInfoListData = [];
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200) {
                newEquipmentInfoListData = SentencedToEmpty(result, ['data', 'Datas', 'mlist'], []);
                newEquipmentInfoListData.map((item, index) => {
                    item.fileUrl = getInformationBankOfEquipmentFileUrl(SentencedToEmpty(item, ['AttachmentName'], ''), '企业/');
                });
            }
            yield update({
                equipmentInfoListData: newEquipmentInfoListData,
                equipmentInfoListResult: result
            });
            let requestEnd = new Date().getTime();
            setListData(newEquipmentInfoListData, requestEnd - requestBegin);
        },
        /**
         * 获取运维记录
         * @param {*} param0
         * @param {*} param1
         */
        *getOperationLogs(
            {
                payload: { setListData = data => { }, setDataArr = () => { } }
            },
            { call, put, take, update, select }
        ) {
            let { operationLogsListTargetDGIMN, operationLogsIndex, operationLogsBeginTime, operationLogsEndTime, operationLogsType, operationLogsListData, operationLogsRecordType } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();
            let param = {
                beginTime: operationLogsBeginTime,
                endTime: operationLogsEndTime,
                // RecordType: operationLogsType,
                DGIMN: operationLogsListTargetDGIMN,
                pageSize: '20',
                pageIndex: operationLogsIndex
            };
            if (operationLogsType != -1 && operationLogsRecordType.length > 0) {
                param.RecordType = operationLogsType;
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.GetMobileOperationPageList, param);
            // SentencedToEmpty(result, ['data', 'Datas','RecordType'], [])
            let newOperationLogsListData = operationLogsListData;
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200) {
                if (operationLogsIndex == 1) {
                    newOperationLogsListData = [];
                    SentencedToEmpty(result, ['data', 'Datas', 'FormList'], []).map((item, index) => {
                        newOperationLogsListData = newOperationLogsListData.concat(SentencedToEmpty(item, ['Nodes'], []));
                    });
                } else {
                    SentencedToEmpty(result, ['data', 'Datas', 'FormList'], []).map((item, index) => {
                        newOperationLogsListData = newOperationLogsListData.concat(SentencedToEmpty(item, ['Nodes'], []));
                    });
                }
            }
            let requestEnd = new Date().getTime();
            if (requestEnd - requestBegin < 1500) {
                let numberMillis = 1500 - (requestEnd - requestBegin),
                    needWait = true;
                var now = new Date();
                var exitTime = now.getTime() + numberMillis;
                while (needWait) {
                    now = new Date();
                    if (now.getTime() > exitTime) needWait = false;
                }
            }
            //如果两次更新不同步，会导致时间轴错位,未正确获取返回值执行该方法，关闭加载状态
            setListData(newOperationLogsListData);
            if (status == 200) {
                yield update({
                    operationLogsListData: newOperationLogsListData,
                    operationLogsRecordType: SentencedToEmpty(result, ['data', 'Datas', 'RecordType'], []),
                    operationLogsListResult: result,
                    operationLogsTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
                //设置选择器的项目，数据由页面自行订阅
                setDataArr();
            } else {
                yield update({
                    operationLogsListResult: result
                });
            }
        },

        /**
         * 获取已核实关联的报警记录
         * @param {*} param0
         * @param {*} param1
         */
        *getAlarmVerifyDetailsRecords(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            let apic = '';
            if (params.isOpreationVerify == true) {
                apic = api.pollutionApi.Alarm.GetOpVerifyDetailsRecords;
            } else {
                apic = api.pollutionApi.Alarm.GetAlarmVerifyDetailsRecords;
            }
            const result = yield call(authService.axiosAuthPost, apic, params);
            yield update({ verifyAlarmRecordResult: result });
        },
        /**
         * 获取视频列表
         * @param {*} param0
         * @param {*} param1
         */
        *getVideoList(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.GetVideoList, null, 'DGIMN=' + params.DGIMN);
            yield update({ videoLstResult: result });
        },
        /**
         * 获取超标限值
         * @param {*} param0
         * @param {*} param1
         */
        *getOverLimits(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            let { overLimitsDGIMN } = yield select(state => state.pointDetails);
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.GetOverLimits, null, 'DGIMN=' + overLimitsDGIMN);
            yield update({ overLimitsResult: result });
        },

        /**
         * 获取报警记录
         * @param {*} param0
         * @param {*} param1
         */
        *getAlarmRecords(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { sourceType, alarmRecordsListTargetDGIMN, alarmRecordsIndex, alarmRecordsBeginTime, alarmRecordsEndTime, alarmType, alarmRecordsListData } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();

            const params = { noCancelFlag: true };
            let url = api.pollutionApi.Alarm.GetMonitorAlarmDatas;
            switch (sourceType) {
                case 'tabWorkbenchException': //运维工作台异常 异常报警
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '0,1,3,4';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                case 'tabWorkbenchOver': //运维工作台超标 接口需要换了
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    params.DataType = 'HourData,DayData';
                    break;
                case 'tabOverWarning': //预警 分钟报警
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        // .subtract(7, 'days')
                        .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    params.DataType = 'MinuteData';
                    break;
                case 'OverWarning':
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    params.DataType = 'MinuteData';
                    break;
                case 'WorkbenchOver': //运维工作台超标 接口需要换了
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        .subtract(14, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    params.DataType = 'HourData,DayData';
                    break;
                case 'WorkbenchException': //运维工作台异常
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        .subtract(14, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '0,1,3,4';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    break;
                case 'TrendException'://数据变化趋势异常报警
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '16';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';//1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                case 'WorkbenchMiss': //运维工作台异常
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = moment()
                        .subtract(14, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '12';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '1';
                    break;
                case 'AssociatedAlarm':
                    let { taskDetail } = yield select(state => state.taskDetailModel);
                    // params.TaskID = taskDetail.TaskID;
                    // params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.taskID = taskDetail.TaskID;
                    params.dgimn = alarmRecordsListTargetDGIMN;
                    url = api.pOperationApi.Task.GetTaskAlarmList;
                    break;
                default:
                    params.IsPaging = false;
                    params.DGIMN = alarmRecordsListTargetDGIMN;
                    params.BeginTime = alarmRecordsBeginTime;
                    params.EndTime = alarmRecordsEndTime;
                    params.AlarmType = '2';
                    params.pageIndex = alarmRecordsIndex;
                    params.pageSize = 10000;
                    params.AllData = '';
            }

            const result = yield call(authService.axiosAuthPost, url, params);

            let status = SentencedToEmpty(result, ['status'], -1);
            let newAlarmRecordsListData = alarmRecordsListData;
            if (status == 200) {
                let pointInfo = { ...SentencedToEmpty(result, ['data', 'Datas', 0], []) };
                delete pointInfo.AlarmMsg;
                if (alarmRecordsIndex == 1) {
                    newAlarmRecordsListData = SentencedToEmpty(result, ['data', 'Datas', 0, 'AlarmMsg'], []);
                } else {
                    newAlarmRecordsListData = alarmRecordsListData.concat(SentencedToEmpty(result, ['data', 'Datas', 0, 'AlarmMsg'], []));
                }
                yield update({
                    alarmRecordsListData: newAlarmRecordsListData,
                    alarmRecordsListResult: result,
                    alarmRecordsPointInfo: pointInfo
                    // alarmRecordsTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
            } else {
                yield update({
                    alarmRecordsListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newAlarmRecordsListData, requestEnd - requestBegin);
        },
        /**
         * 获取超标记录
         * @param {*} param0
         * @param {*} param1
         */
        *getOverDataList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { overDataListTargetDGIMN, overDataIndex, overDataBeginTime, overDataEndTime, overDataDataType, overDataListData } = yield select(state => state.pointDetails);
            let requestBegin = new Date().getTime();
            if (overDataDataType == 'HourData') {
                overDataBeginTime = moment(overDataBeginTime)
                    .add('hours', 1)
                    .format('YYYY-MM-DD HH:mm:ss');
                overDataEndTime = moment(overDataEndTime)
                    .add('seconds', 1)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.GetOverData, {
                beginTime: overDataBeginTime,
                endTime: overDataEndTime,
                dataType: overDataDataType,
                DGIMN: [overDataListTargetDGIMN],
                pageSize: '20',
                pageIndex: overDataIndex
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newOverDataListData = overDataListData;
            if (status == 200) {
                if (overDataIndex == 1) {
                    newOverDataListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newOverDataListData = overDataListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    overDataListData: newOverDataListData,
                    overDataListResult: result,
                    overDataTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
            } else {
                yield update({
                    overDataListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newOverDataListData, requestEnd - requestBegin);
        },
        /**
         * 获取运维人员 超标核实记录
         * @param {*} param0
         * @param {*} param1
         */
        *getOpetaionVerifyList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { verifyListTargetDGIMN, verifyIndex, verifyBeginTime, verifyEndTime, VerifyState, verifyListData } = yield select(state => state.pointDetails);

            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.OpetaionVerifyList, {
                IsPaging: true,
                DGIMN: verifyListTargetDGIMN,
                BeginTime: verifyBeginTime,
                EndTime: verifyEndTime,
                PageIndex: verifyIndex,
                PageSize: 20,
                VerifyType: VerifyState
                // AlarmType: 'sample string 4',
                // OpenId: 'sample string 5',
                // EntCode: 'sample string 6',
                // AllData: 'sample string 7'
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newVerifyListData = verifyListData;
            if (status == 200) {
                if (verifyIndex == 1) {
                    newVerifyListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newVerifyListData = verifyListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    verifyListData: newVerifyListData,
                    verifyListResult: result,
                    verifyTotal: SentencedToEmpty(result, ['data', 'Datas', 'Total'], [])
                });
            } else {
                yield update({
                    verifyListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newVerifyListData, requestEnd - requestBegin);
        },
        /**
         * 获取核实记录
         * @param {*} param0
         * @param {*} param1
         */
        *getVerifyRecordList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { verifyListTargetDGIMN, verifyIndex, verifyBeginTime, verifyEndTime, VerifyState, verifyListData } = yield select(state => state.pointDetails);
            let { constants } = yield select(state => state.app);
            let innerParam = {
                rel: '$and',
                group: [
                    {
                        rel: '$and',
                        group: [
                            { Key: 'dbo.T_Bas_CommonPoint.DGIMN', Value: verifyListTargetDGIMN, Where: '$=' },
                            { Key: 'dbo.T_Cod_ExceptionVerify.VerifyTime', Value: verifyBeginTime, Where: '$gte' },
                            { Key: 'dbo.T_Cod_ExceptionVerify.VerifyTime', Value: verifyEndTime, Where: '$lte' }
                        ]
                    }
                ]
            };
            if (VerifyState != 0) {
                innerParam.group[0].group.push({ Key: 'dbo.T_Cod_ExceptionVerify.VerifyState', Value: VerifyState, Where: '$=' });
            }
            let requestBegin = new Date().getTime();

            let params = {
                configId: 'ExceptionVerify',
                pageIndex: verifyIndex,
                pageSize: 20,
                ConditionWhere: JSON.stringify(innerParam)
            };
            if (constants.isSecret == true) {
                params.configId = Base64.encode(params.configId);
                params.ConditionWhere = Base64.encode(params.ConditionWhere);
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.GetListPager, params);
            // console.log('getVerifyRecordList result = ', result);
            // console.log('getVerifyRecordList result = ', JSON.stringify(SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], [])));
            // 列表包含下拉刷新功能，不适合使用系统空页面
            // if (SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []).length == 0) {
            //     result.status = 1000;
            // }
            let status = SentencedToEmpty(result, ['status'], -1);
            let newVerifyListData = verifyListData;
            if (status == 200) {
                if (verifyIndex == 1) {
                    newVerifyListData = SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []);
                } else {
                    newVerifyListData = verifyListData.concat(SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []));
                }
                yield update({
                    verifyListData: newVerifyListData,
                    verifyListResult: result,
                    verifyTotal: SentencedToEmpty(result, ['data', 'Datas', 'Total'], [])
                });
            } else {
                yield update({
                    verifyListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newVerifyListData, requestEnd - requestBegin);
        },
        *getPointInfo(
            {
                payload: { params, callback }
            },
            { call, put, take, update }
        ) {
            //站点基本信息
            yield update({ ponitInfo: { status: -1 } });
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.PointInfo, params);
            if (result && result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'Datas'], []).length > 0) {
                    // 从登陆中获取配置，不再单独获取站点详情菜单
                    // PollutantTypeCode 5 :废水 12:废气 特殊处理
                    yield put('getMenu', {
                        params: {
                            info: result
                        }
                    });
                    yield update({ ponitInfo: result });
                } else {
                    yield update({ ponitInfo: { status: 0 } });
                }
            } else {
                yield update({ ponitInfo: result });
            }
        },
        *getMenu(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            //排口下菜单
            // yield update({ ponitInfo: { status: -1 } });
            const { pointDetailMenuID } = yield select(state => state.app);
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.SystemMenu, {
                menu_id: pointDetailMenuID
            });
            if (result && result.status == 200 && (params.info.data.Datas[0]['PollutantTypeCode'] == '5' || params.info.data.Datas[0]['PollutantTypeCode'] == '12')) {
                console.log("getMenu 1");
                let menuDate = result.data.Datas;
                menuDate.push({
                    id: '50d2c460-7262-44a5-a0fa-2b2b568fe0bc',
                    name: '手动指控'
                });
                console.log('getMenu menuDate = ', menuDate);
                yield put('getHourData', {
                    params: {
                        info: params.info,
                        menu: menuDate
                    }
                });
            } else {
                console.log("getMenu 2");
                let menuDate = SentencedToEmpty(result, ['data', 'Datas'], []);
                menuDate.push({
                    id: '50d2c460-7262-44a5-a0fa-2b2b568fe0bc',
                    name: '质控记录'
                });
                menuDate.push({
                    id: '312c53c1-e9ff-4745-8c8b-eb642822b7dc',
                    name: '手动指控'
                });
                // yield update({ ponitInfo: params.info, systemMenu: menuDate });
            }
        },
        *getHourData(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            //获取排口小时数据
            yield update({ ponitInfo: { status: -1 } });
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.PointHourData, {
                DGIMNs: params.info.data.Datas[0]['DGIMN'],
                endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                beginTime: moment()
                    .subtract(24, 'hour')
                    .format('YYYY-MM-DD HH:mm:ss'),
                dataType: 'hour',
                isAsc: true,
                IsSupplyData: true
            });
            let cityNewModel = {};

            if (result && result.status == 200) {
                for (let i = result.data.Datas.length - 1; i > 0; i--) {
                    if (SentencedToEmpty(result.data.Datas[i], ['AQI'], '') != '') {
                        cityNewModel = result.data.Datas[i];
                        break;
                    }
                }
                yield update({ ponitInfo: params.info, systemMenu: params.menu, cityNewModel: cityNewModel, cityAQIDataList: result.data.Datas });
            } else {
            }
        },
        *getPollantCodes(
            {
                payload: { params, callBack }
            },
            { call, put, select, update }
        ) {
            let { ponitInfo } = yield select(state => state.pointDetails);
            //排口下的污染因子
            yield update({ chartStatus: { status: -1 } });
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.PollantCodes, params);
            let polluArr = [];

            if (result && result.status == 200) {
                result.data.Datas.map((item, Key) => {
                    polluArr.push(item);
                });
                if (SentencedToEmpty(ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '') == '5') {
                    yield update({
                        PollantCodes: [
                            { AlarmType: 0, Color: null, DGIMN: null, LowerValue: null, PollutantCode: 'AQI', PollutantName: 'AQI', Sort: 1, StandardValue: null, StandardValueStr: null, Unit: '', UpperValue: null },
                            ...result.data.Datas
                        ],
                        selectCodeArr: [{ AlarmType: 0, Color: null, DGIMN: null, LowerValue: null, PollutantCode: 'AQI', PollutantName: 'AQI', Sort: 1, StandardValue: null, StandardValueStr: null, Unit: '', UpperValue: null }, ...polluArr]
                    });
                    callBack(result.data.IsSuccess, [
                        { AlarmType: 0, Color: null, DGIMN: null, LowerValue: null, PollutantCode: 'AQI', PollutantName: 'AQI', Sort: 1, StandardValue: null, StandardValueStr: null, Unit: '', UpperValue: null },
                        ...polluArr
                    ]);
                } else {
                    yield update({ PollantCodes: result.data.Datas, selectCodeArr: polluArr });
                    callBack(result.data.IsSuccess, polluArr);
                }
            } else {
                callBack(false, []);
            }
        },
        *getChartLstDatas(
            {
                // payload: { params, callback }
                payload
            },
            { call, put, take, update }
        ) {
            const params = payload.params;
            const callback = payload.callback;
            //排口下数据
            yield update({ chartStatus: { status: -1 } });
            params.pollutantCodes = '';
            params.noCancelFlag = true;
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.PointDetails.ChartLstDatas, params);

            if (result && result.status == 200) {
                if (params.datatype == 'month') {
                    result.data.Datas.map(item => {
                        item.AQI = item.IQI;
                    });
                }
                callback(result.data.Datas);
                yield update({ ChartLstDatas: result.data.Datas, chartStatus: result });
            } else {
                yield update({ ChartLstDatas: [], chartStatus: result });
                callback([]);
            }
        },
        /**
         * 缺失数据
         * @param {*} param0
         * @param {*} param1
         */
        *getMissDataList(
            {
                payload: { params, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * missDataListResult: [],
        missDataListData: [],
        missDataListIndex: 1,
        missDataListTotal: 0,
        missDataListDataType: 'HourData',
        missDataListBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        missDataListEndTime: moment().format('YYYY-MM-DD 23:59:59')
             */
            // 缺失数据
            const { ponitInfo, missDataListData, missDataListIndex, missDataListTotal, missDataListDataType, missDataListBeginTime, missDataListEndTime } = yield select(state => state.pointDetails);
            console.log('ponitInfo = ', ponitInfo);
            let modelParams = {};
            modelParams.DGIMN = [ponitInfo.data.Datas[0].DGIMN];
            modelParams.pageIndex = missDataListIndex;
            modelParams.pageSize = 20;
            modelParams.dataType = missDataListDataType;
            modelParams.beginTime = missDataListBeginTime;
            modelParams.endTime = missDataListEndTime;
            if (SentencedToEmpty(ponitInfo, ['data', 'Datas', 0, 'PollutantTypeCode'], -1) == 5) {
                // 等于5  就是空气站
                modelParams.Atmosphere = 1;
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.xj.GetMissDataList, modelParams);

            if (result && result.status == 200) {
                let newData = [];
                if (missDataListIndex == 1) {
                    newData = result.data.Datas;
                } else {
                    newData = [].concat(missDataListData);
                    newData = newData.concat(result.data.Datas);
                }
                yield update({ missDataListData: newData, missDataListResult: result, missDataListTotal: result.data.Total });
                setListData(newData);
            } else {
                yield update({ ChartLstDatas: [], missDataListResult: result, missDataListTotal: 0 });
                setListData([]);
            }
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                example: ({ params }) => {
                    dispatch({
                        type: 'methodexample',
                        payload: {}
                    });
                }
                // VerifyRecords: ({ params }) => {
                //     dispatch({
                //         type: 'getVerifyRecordList',
                //         payload: {}
                //     });
                // },
                // OverData: ({ params }) => {
                //     dispatch({
                //         type: 'getOverDataList',
                //         payload: {}
                //     });
                // }
            });
        }
    }
});
