import moment from 'moment';
import { AsyncStorage } from 'react-native';
import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { loadToken, getRootUrl, getEncryptData } from '../dvapack/storage';
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import RNFS from 'react-native-fs';
import JSEncrypt from 'jsencrypt';
import { UrlInfo, CURRENT_PROJECT, VersionInfo, POLLUTION_ORERATION_PROJECT } from '../config/globalconst';
export default Model.extend({
    namespace: 'alarm',
    state: {
        overDataTypes: [], //运维人员 超标核实 工艺超标 超标类型列表
        overDataTypeResult: { status: -1 }, //运维人员 超标核实 工艺超标 超标类型列表 请求状态
        monitorAlarmIndex: 1, //报警首页数据页码
        monitorAlarmTotal: 0, //报警首页数据总数
        monitorAlarmResult: { status: -1 }, //报警首页数据请求结果
        monitorAlarmData: [], //报警首页的数据
        //异常数据相关参数
        exceptionDataBeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        exceptionDataEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        exceptionDataDataType: 'HourData',
        exceptionDataIndex: 1,
        exceptionDataTotal: 0,
        exceptionDataListTargetDGIMN: 'yastqsn0000002',
        exceptionDataListData: [],
        exceptionDataListResult: { status: -1 },
        alarmVerifyDetailsRuslt: { status: -1 }, //报警核实详情
        trendCountRuslt: { status: -1 }, // 异常报警 趋势报警 计数结果
        sourceType: '', //点击的来源：WorkbenchOver运维工作台超标，运维工作台异常WorkbenchException

        // 默认一个月
        missBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
        missEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        missEntName: '',
        missPageIndex: 1,
        missResult: { status: -1 },
        missData: [],
        missDataLength: 0,
        responseRecordType: '',

        overBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
        overEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        overEntName: '',
        overPageIndex: 1,
        overResult: { status: -1 },
        overData: [],
        overDataLength: 0,

        exceptionBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
        exceptionEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        exceptionEntName: '',
        exceptionPageIndex: 1,
        exceptionResult: { status: -1 },
        exceptionData: [],
        exceptionDataLength: 0,

        taskID: '',
        DGIMN: '',
        VID: '',

        alarmResponseAlarmDetailResult: { status: -1 }, //报警响应报警详情
        alarmResponseAlarmDetailData: [], //报警响应报警详情 数据
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 运维人员 超标核实 工艺超标 超标类型获取接口
         * 已废除，调换成GetOverDataOperation
         * 
         * 20221025 启用次接口，停用GetOverDataOperation
         * @param {*} param0
         * @param {*} param1
         */
        *getOverDataType(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ overDataTypes: { status: -1 }, overDataTypes: [] });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.GetOverDataType, {});
            if (result.status == 200) {
                let overDataTypes = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (overDataTypes.length == 0) {
                    yield update({ overDataTypes, overDataTypeResult: { status: 0 } });
                } else {
                    yield update({ overDataTypes, overDataTypeResult: result });
                    callback(result);
                }
                // yield update({ overDataTypes: [], overDataTypeResult: { status: 0 } });
            } else {
                yield update({ overDataTypes: [], overDataTypeResult: result });
            }
        },
        /**
         * 该接口为硬编码
         * 改回原来的接口getOverDataType
         * 运维人员 超标核实 可选项获取
         * @param {*} param0
         * @param {*} param1
         */
        *GetOverDataOperation(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ overDataTypeResult: { status: -1 }, overDataTypes: [] });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.GetOverDataOperation, {});
            if (result.status == 200) {
                let overDataTypes = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (overDataTypes.length == 0) {
                    yield update({ overDataTypes, overDataTypeResult: { status: 0 } });
                } else {
                    yield update({ overDataTypes, overDataTypeResult: result });
                }
                // yield update({ overDataTypes: [], overDataTypeResult: { status: 0 } });
            } else {
                yield update({ overDataTypes: [], overDataTypeResult: result });
            }
            callback(result)
        },
        /**
         * 运维人 核实 超标报警
         * @param {*} param0
         * @param {*} param1
         */
        *operationVerifyAdd(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.OperationVerifyAdd, params);
            if (result.status == 200) {
                let MN = SentencedToEmpty(params, ['Data', 'DGIMN'], '');
                // 刷新 运维报警核实多选列表
                yield update({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } });
                yield put(createAction('pointDetails/getAlarmRecords')({}));
                yield take('pointDetails/getAlarmRecords/@@end');
                yield put(
                    createAction('taskModel/isAlarmResponse')({
                        params: {
                            taskFrom: '2',
                            DGIMNs: MN
                        }
                    })
                );
                yield take('taskModel/isAlarmResponse/@@end');
                yield update({ monitorAlarmIndex: 1, monitorAlarmTotal: 0, monitorAlarmResult: { status: -1 } });
                // 刷新运维报警 点位列表
                yield put('getAlarmRecords', {
                    params: {
                        BeginTime: moment()
                            .subtract(1, 'days')
                            .format('YYYY-MM-DD 00:00:00'),
                        EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                        AlarmType: '',
                        PageIndex: 1,
                        PageSize: 20
                    }
                });
                callback(result.data.IsSuccess);
            } else {
                callback(false);
            }
        },
        /**
         * 获取报警数量
         * @param {*} param0
         * @param {*} param1
         */
        *getAlarmCount(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let alarmType = params.alarmType;

            let url = api.pollutionApi.Alarm.GetMonitorAlarmDatas;

            switch (alarmType) {
                case 'OverWarning': //预警 分钟报警
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.DataType = 'MinuteData';
                    break;
                case 'WorkbenchOver': //运维工作台超标 接口需要换了
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.DataType = 'HourData,DayData';
                    break;
                case 'WorkbenchException': //运维工作台异常
                    // 数据异常报警 数据变化趋势异常报警
                    url = api.pollutionApi.Alarm.GetMonitorAlarmDatasCount;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    // params.AlarmType = '0,1,3,4';
                    params.AlarmType = '0,1,3,4,16';
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                case 'WorkbenchMiss':
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '12';
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                default:
                    params.AllData = ''; //1是查看未响应的的报警信息 空为查看所有的报警信息
            }
            params.noCancelFlag = true;
            const result = yield call(authService.axiosAuthPost, url, params);
            let status = SentencedToEmpty(result, ['status'], -1);

            if (status == 200) {
                /** 
                *   exceptionAlarmCount:'-',//首页异常报警数量
                    overAlarmCount:'-',//首页超标报警数量
                    missAlarmCount:'-',//首页缺失报警数量
                */
                if (alarmType == 'WorkbenchException') {
                    // yield update({ exceptionAlarmCount: SentencedToEmpty(result, ['data', 'Total'], '-') });
                    yield update({
                        exceptionAlarmCount: SentencedToEmpty(result, ['data', 'Datas', 'allCount'], '-')
                        , trendCountRuslt: result
                    });
                } else if (alarmType == 'WorkbenchOver') {
                    yield update({ overAlarmCount: SentencedToEmpty(result, ['data', 'Total'], '-') });
                } else if (alarmType == 'WorkbenchMiss') {
                    yield update({ missAlarmCount: SentencedToEmpty(result, ['data', 'Total'], '-') });
                } else if (alarmType == 'OverWarning') {
                    yield update({ OverWarningCount: SentencedToEmpty(result, ['data', 'Total'], '-') });
                }
            } else {
            }
        },
        /**
         * 报警响应记录
         * GetExceptionInfoList
         * @param {*} param0
         * @param {*} param1
         */
        *getExceptionInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {

            const { responseRecordType } = yield select(state => state.alarm);
            let _params = {};
            if (responseRecordType == 'WorkbenchMiss') {
                const {
                    missBeginTime,
                    missEndTime,
                    missEntName,
                    missPageIndex,
                } = yield select(state => state.alarm);
                _params = {
                    "beginTime": missBeginTime,
                    "endTime": missEndTime,
                    pageIndex: missPageIndex,
                    // "pageSize": 20,// 分页无效，暂时不用分页
                    entName: missEntName,
                    alarmType: 12
                }
            } else if (responseRecordType == 'WorkbenchException') {
                const {
                    exceptionBeginTime,
                    exceptionEndTime,
                    exceptionPageIndex,
                    // "pageSize": 20,// 分页无效，暂时不用分页
                    exceptionEntName,
                } = yield select(state => state.alarm);
                _params = {
                    "beginTime": exceptionBeginTime,
                    "endTime": exceptionEndTime,
                    pageIndex: exceptionPageIndex,
                    entName: exceptionEntName,
                    alarmType: 0
                }
            } else if (responseRecordType == 'WorkbenchOver') {
                const {
                    overBeginTime,
                    overEndTime,
                    overPageIndex,
                    overEntName,
                } = yield select(state => state.alarm);
                _params = {
                    "beginTime": overBeginTime,
                    "endTime": overEndTime,
                    pageIndex: overPageIndex,
                    // "pageSize": 20,// 分页无效，暂时不用分页
                    entName: overEntName,
                }
            }
            let result;
            if (responseRecordType == 'WorkbenchMiss'
                || responseRecordType == 'WorkbenchException'
            ) {
                result = yield call(authService.axiosAuthPost
                    , api.pollutionApi.Alarm.GetExceptionInfoList
                    , _params);
            } else if (responseRecordType == 'WorkbenchOver') {
                result = yield call(authService.axiosAuthPost
                    , api.pollutionApi.Alarm.GetOverAlarmInfoList
                    , _params);
            }

            let listData = [];
            /**
             * missResult: { status: -1 },
                missData: [],
                overResult: { status: -1 },
                overData: [],
                exceptionResult: { status: -1 },
                exceptionData: [],
             */
            let updateParams = {};
            if (_params.pageIndex == 1) {
                listData = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (responseRecordType == 'WorkbenchMiss') {
                    updateParams['missData'] = listData;
                    updateParams['missResult'] = result;
                    updateParams['missDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.missData, 0);
                } else if (responseRecordType == 'WorkbenchException') {
                    updateParams['exceptionData'] = listData;
                    updateParams['exceptionResult'] = result;
                    updateParams['exceptionDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.exceptionData, 0);
                } else if (responseRecordType == 'WorkbenchOver') {
                    updateParams['overData'] = listData;
                    updateParams['overResult'] = result;
                    updateParams['overDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.overData, 0);
                }
            } else {
                listData = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (responseRecordType == 'WorkbenchMiss') {
                    const {
                        missData,
                    } = yield select(state => state.alarm);
                    updateParams['missData'] = missData.concat(listData);
                    updateParams['missResult'] = result;
                    updateParams['missDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.missData, 0);
                } else if (responseRecordType == 'WorkbenchException') {
                    const {
                        exceptionData,
                    } = yield select(state => state.alarm);
                    updateParams['exceptionData'] = exceptionData.concat(listData);
                    updateParams['exceptionResult'] = result;
                    updateParams['exceptionDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.exceptionData, 0);
                } else if (responseRecordType == 'WorkbenchOver') {
                    const {
                        overData,
                    } = yield select(state => state.alarm);
                    updateParams['overData'] = overData.concat(listData);
                    updateParams['overResult'] = result;
                    updateParams['overDataLength'] = SentencedToEmpty(result, ['data', 'Total'], 0);
                    yield update(updateParams);
                    setListData(updateParams.overData, 0);
                }
            }

        },
        /**
         * 异常报警详情
         * GetExResponseInfoList
         * @param {*} param0
         * @param {*} param1
         */
        * getExResponseInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const {
                taskID,
                DGIMN,
            } = yield select(state => state.alarm);
            const result = yield call(authService.axiosAuthPost
                , api.pollutionApi.Alarm.GetExResponseInfoList
                , { taskID, DGIMN });

            yield update({
                alarmResponseAlarmDetailResult: result, //报警响应报警详情
                alarmResponseAlarmDetailData: SentencedToEmpty(result, ['data', 'Datas'], []), //报警响应报警详情
            })
            if (result.status == 200) {
                // let pointInfo = { ...SentencedToEmpty(result, ['data', 'Datas', 0], []) };
                // delete pointInfo.AlarmMsg;
                let item = SentencedToEmpty(result, ['data', 'Datas'], [])[0];
                let pointInfo = {
                    DGIMN: SentencedToEmpty(item, ['DGIMN'], ''),
                    Abbreviation: SentencedToEmpty(item, ['TargetName'], ''),
                    PointName: SentencedToEmpty(item, ['PointName'], ''),
                    PollutantType: SentencedToEmpty(item, ['PollutantType'], ''),
                    Status: SentencedToEmpty(item, ['Status'], ''),
                }
                yield put(createAction('pointDetails/updateState')({
                    alarmRecordsPointInfo: pointInfo
                }));
            }
        },
        /**
         * 超标报警 报警详情
         * GetOverResponseInfoList
         * @param {*} param0
         * @param {*} param1
         */
        * getOverResponseInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const {
                VID,
                DGIMN,
            } = yield select(state => state.alarm);
            const result = yield call(authService.axiosAuthPost
                , api.pollutionApi.Alarm.GetOverResponseInfoList
                , { VID, DGIMN });

            yield update({
                alarmResponseAlarmDetailResult: result, //报警响应报警详情
                alarmResponseAlarmDetailData: SentencedToEmpty(result, ['data', 'Datas'], []), //报警响应报警详情
            })
            if (result.status == 200) {
                // let pointInfo = { ...SentencedToEmpty(result, ['data', 'Datas', 0], []) };
                // delete pointInfo.AlarmMsg;
                let item = SentencedToEmpty(result, ['data', 'Datas'], [])[0];
                let pointInfo = {
                    DGIMN: SentencedToEmpty(item, ['DGIMN'], ''),
                    Abbreviation: SentencedToEmpty(item, ['TargetName'], ''),
                    PointName: SentencedToEmpty(item, ['PointName'], ''),
                    PollutantType: SentencedToEmpty(item, ['PollutantType'], ''),
                    Status: SentencedToEmpty(item, ['Status'], ''),
                }
                yield put(createAction('pointDetails/updateState')({
                    alarmRecordsPointInfo: pointInfo
                }));
            }
        },
        /**
         * 获取报警记录
         * @param {*} param0
         * @param {*} param1
         */
        *getAlarmRecords(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { monitorAlarmIndex, monitorAlarmData, sourceType } = yield select(state => state.alarm);

            let url = api.pollutionApi.Alarm.GetMonitorAlarmDatas;

            switch (sourceType) {
                case 'OverWarning': //预警 分钟报警
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.BeginTime = moment()
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.DataType = 'MinuteData';
                    break;
                case 'WorkbenchOver': //运维工作台超标 接口需要换了
                    url = api.pollutionApi.Alarm.GetOperationOverData;
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '2';
                    params.DataType = 'HourData,DayData';
                    break;
                case 'WorkbenchException': //运维工作台异常 异常报警
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '0,1,3,4';
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                case 'TrendException'://数据变化趋势异常报警
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '16';
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                case 'WorkbenchMiss':
                    params.BeginTime = moment()
                        // .subtract(30, 'days')
                        .subtract(7, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    params.EndTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    params.AlarmType = '12';
                    params.AllData = '1'; //1是查看未响应的的报警信息 空为查看所有的报警信息
                    break;
                default:
                    params.AllData = ''; //1是查看未响应的的报警信息 空为查看所有的报警信息
            }
            params.noCancelFlag = true;
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, url, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = monitorAlarmData;
            if (status == 200) {
                if (monitorAlarmIndex == 1) {
                    newMoData = monitorAlarmData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ monitorAlarmData: newMoData, monitorAlarmTotal: SentencedToEmpty(result, ['data', 'Total'], []), monitorAlarmResult: result });
                } else {
                    newMoData = monitorAlarmData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ monitorAlarmData: newMoData, monitorAlarmTotal: SentencedToEmpty(result, ['data', 'Total'], []), monitorAlarmResult: result });
                }
            } else {
                yield update({
                    monitorAlarmResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        },

        *methodexample({ payload }, { call, put, take, update, select }) { },

        *verifySubmit(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.VerifySubmit, params);
            if (result.status == 200) {
                callback(result.data.IsSuccess);
            } else {
                callback(false);
            }
        },
        *getAlarmVerifyDetails(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            yield update({ alarmVerifyDetailsRuslt: { status: -1 } });
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(RSAPubSecret);
            if (global.constants.isSecret == true) {
                params.configId = encrypt.encrypt(params.ConfigId);
            }
            const result = yield call(authService.axiosAuthGet, api.pollutionApi.Alarm.VerifyDetails, params);
            let imageUrls = [];
            let imgStr = '';
            let encryData = getEncryptData();
            const rootUrl = getRootUrl();
            if (result.status == 200 && result.data.Datas[0]['dbo.T_Cod_ExceptionVerify.VerifyImage'] != null) {
                imgStr = SentencedToEmpty(result.data.Datas[0], ['dbo.T_Cod_ExceptionVerify.VerifyImage'], '');
                let imageLst = imgStr.split(';');
                imageLst.map((item, key) => {
                    imageUrls.push({
                        // url: `${UrlInfo.ImageUrl + item.split('|')[0]}/Attachment?code=${encryData}`,
                        // url: `${UrlInfo.ImageUrl + item.split('|')[0]}`,
                        url: `${rootUrl.ReactUrl}/upload/${item.split('|')[0]}`,
                        // You can pass props to <Image />.
                        // props: {
                        //     headers: { ProxyCode: encryData}
                        // }
                    });
                });
            }
            result.imgUrls = imageUrls;
            yield update({ alarmVerifyDetailsRuslt: result });
        },

        *getExceptionDataList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { exceptionDataListTargetDGIMN, exceptionDataIndex, exceptionDataBeginTime, exceptionDataEndTime, exceptionDataDataType, exceptionDataListData, exceptionDataTotal } = yield select(state => state.alarm);
            let requestBegin = new Date().getTime();
            if (exceptionDataDataType == 'HourData') {
                exceptionDataBeginTime = moment(exceptionDataBeginTime)
                    .add('hours', 1)
                    .format('YYYY-MM-DD HH:mm:ss');
                exceptionDataEndTime = moment(exceptionDataEndTime)
                    .add('seconds', 1)
                    .format('YYYY-MM-DD HH:mm:ss');
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Data.GetExceptionData, {
                beginTime: exceptionDataBeginTime,
                endTime: exceptionDataEndTime,
                dataType: exceptionDataDataType,
                DGIMN: [exceptionDataListTargetDGIMN],
                pageSize: '20',
                pageIndex: exceptionDataIndex
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newExceptionDataListData = exceptionDataListData;
            if (status == 200) {
                if (exceptionDataIndex == 1) {
                    newExceptionDataListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newExceptionDataListData = exceptionDataListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    exceptionDataListData: newExceptionDataListData,
                    exceptionDataListResult: result,
                    exceptionDataTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
            } else {
                yield update({
                    exceptionDataListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newExceptionDataListData, requestEnd - requestBegin);
        },
        //反馈上传图片
        *uploadimage(
            {
                payload: { image, callback, uuid }
            },
            { call }
        ) {
            if (!image.fileName) {
                image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
            }

            let encryData = getEncryptData();
            // let encryData = '';
            // yield AsyncStorage.getItem('encryptData', function (error, result) {
            //     if (error) {
            //         encryData = '';
            //     } else {
            //         if (result == null) {
            //             encryData = '';
            //         } else {
            //             encryData = result;
            //         }
            //     }
            // });
            const user = yield loadToken();

            var file = { uri: image.uri, type: 'multipart/form-data', name: 'image.jpg' };
            let formdata = new FormData();
            formdata.append('file', file);
            formdata.append('FileUuid', uuid);
            formdata.append('FileTypes', '2');
            console.log('*uploadimage');
            fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.uploadimage, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    // Authorization: 'Bearer ' + encryData + '$' + user.Ticket
                    ProxyCode: encryData,
                    Authorization: 'Bearer ' + user.Ticket
                }
            })
                .then(res => {
                    console.log('*uploadimage res = ', res);
                    image.attachID = JSON.parse(res._bodyInit).Datas;
                    callback(image, true);
                })
                .catch(error => {
                    console.log('error = ', error);
                    callback('', false);
                });
        },
        //删除反馈图片
        *DelPhotoRelation(
            {
                payload: { params }
            },
            { update, take, call, put }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.delPhoto, {
                Guid: params.code
            });
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                params.callback();
            } else {
                ShowToast('删除失败');
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
            });
        }
    }
});
