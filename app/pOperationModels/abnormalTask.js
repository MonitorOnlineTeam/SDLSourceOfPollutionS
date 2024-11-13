import { Model } from '../dvapack';

import api from '../config/globalapi';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import * as authService from '../services/auth';
import moment from 'moment';
import { NavigationActions, SentencedToEmpty, ShowToast } from '../utils';
import { getEncryptData, loadToken } from '../dvapack/storage';
import { UrlInfo } from '../config';
export default Model.extend({
    namespace: 'abnormalTask',
    state: {
        //任务生成

        checkPlanList: [], //获取方案列表
        checkUserList: [], //可选核查人列表
        takeFlagList: [], //可选专家意见列表

        //任务执行
        checkTaskList: {}, //获取任务列表
        checkTaskCount: 0, // 异常识别 任务记录 数量
        checkSearchTaskList: [], //获取任务搜索列表
        chekTaskDetail: { chekTaskDetail: { status: -1 } }, //获取核查任务详情

        //报警记录相关
        alarmAnalyBeginTime: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DD 00:00:00'),
        alarmAnalyEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        alarmAnalyDataType: 'HourData',
        alarmAnalyIndex: 1,
        alarmAnalyTotal: 0,
        alarmAnalyListTargetDGIMN: 'yastqsn0000002',
        overLimitsDGIMN: '',
        alarmAnalyListData: [],
        alarmAnalyListResult: { status: -1 },
        ExceptionNumsByPointAuth: { status: -1 },
        clueDatasPageIndex: 1,
        clueDatasTotal: 0,
        clueDatasList: [],

        /**线索详情 */
        alarmDetailInfo: { status: -1 },
        alarmChartData: {},
        showDataSort: [],
        phenomenonChart: { status: -1 },
        fluctuationRange: { status: -1 },
        StatisPolValue: { status: -1 },
        StatisLinearCoefficientValue: { status: -1 },
        AlarmDataChartValue: { status: -1 },
        PointCluePollutant: [], //站点污染因子列表
        PointSelectCluePollutant: [], //图表数据选中的污染因子
        /**报警核实 */
        commitVerifyResult: { status: 200 },
        alarmVerifyDetail: { status: 200 },
        editCommitEnable: true,

        checkedRectificationListGResult: { status: -1 },
        recheckItemId: '',// 复核记录id 用于获取复核详情
        checkedRectificationApprovalsResult: { status: -1 }, // 复核详情
        /**核实流程 */
        WarningVerifyCheckInfo: { status: -1 },
        /**报警详情 */
        alarmChartData: {},
        showDataSort: [],
        proFlag: 0, //（0：不是省区经理，1：省区经理）
        role: 'operationStaff', // 异常整改用户角色

        updateCheckedRectificationResult: { status: 200 },
        checkedRectificationListCount: 0,// 整改计数
        checkedRectificationResult: { status: 200 }, // 整改复核提交状态

        // expertCheckedRectificationListCount: 0,// 专家整改计数
        // operationStaffCheckedRectificationListCount: 0, // 运维人员整改计数

        "btime": moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),// 整改记录参数 列表开始时间
        "etime": moment().format('YYYY-MM-DD 23:59:59'),// 整改记录参数 列表结束时间
        checkedRectificationCompleteListResult: { status: -1 },
        checkedRectificationCompleteListData: [],
        completeIndex: 1,
        completePageSize: 20,

        getCheckedListParams: null, // 核查任务列表参数
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 模型整改 获取已处理异常整改
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCheckedRectificationCompleteList(
            {
                payload: { params = { pageIndex: 1, pageSize: 1000 }, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const {
                btime, etime,
                completeIndex, completePageSize
                , checkedRectificationCompleteListData
            } = yield select(state => state.abnormalTask);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetCheckedRectificationList
                , {
                    "pageIndex": completeIndex,
                    "pageSize": completePageSize,
                    btime,
                    etime,
                    // "isComplete": true
                    "isComplete": 3
                }
            );
            if (result.status == 200) {
                let newData
                if (completeIndex == 1) {
                    newData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({
                        checkedRectificationCompleteListData: newData,
                        checkedRectificationCompleteListResult: result
                    });
                } else {
                    newData = [].concat(checkedRectificationCompleteListData)
                    newData.push(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({
                        checkedRectificationCompleteListData: newData,
                        checkedRectificationCompleteListResult: result
                    });
                }
                setListData(newData);
            } else {
                setListData([]);
            }
        },
        /**
         * 整改复核
         * CheckedRectification
         * @param {*} param0 
         * @param {*} param1 
         */
        *checkedRectification(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * {{
                "id": "string",
                "approvalRemarks": "string", // 复核描述
                "approvalDocs": "string", // 图片id
                "approvalStatus": "string" // 复核状态 1 通过 2 驳回
                }} 
            */
            yield update({
                checkedRectificationResult: { status: -1 }
            });
            const { recheckItemId } = yield select(state => state.abnormalTask);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.CheckedRectification
                , params
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
                && SentencedToEmpty(result, ['data', 'Datas'], false)) {
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        checkedRectificationResult: result
                    });
                    yield put(NavigationActions.back());
                    yield put(NavigationActions.back());
                    yield put('getCheckedRectificationList', {});
                }
            }
        },
        /**
         * 模型整改 提交整改
         * @param {*} param0 
         * @param {*} param1 
         */
        *updateCheckedRectification(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * "id": "string",
             * "rectificationDes": "string",  // 整改描述
             * "rectificationMaterial": "string", // 图片id
             * "completeTime": "2023-10-31T02:30:39.978Z" // 完成时间 精确到小时
             */
            // console.log('UpdateCheckedRectification params = ', params);
            yield update({ updateCheckedRectificationResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.UpdateCheckedRectification
                , params
            );
            // console.log('UpdateCheckedRectification result = ', result);
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
                && SentencedToEmpty(result, ['data', 'Datas'], false)) {
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        updateCheckedRectificationResult: result
                    });
                    yield put(NavigationActions.back());
                    yield put(NavigationActions.back());
                    yield put('getCheckedRectificationList', {});
                }
            }
        },
        //核实详情页，获取核实流程
        *GetWarningVerifyCheckInfo({ payload }, { update, take, call, put }) {
            yield update({ WarningVerifyCheckInfo: { status: -1 } });
            const { callback = () => { } } = payload;
            let params = { ...payload };
            delete params.callback;
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetWarningVerifyCheckInfo, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ WarningVerifyCheckInfo: result });
                callback(result);
            } else {
                yield update({ WarningVerifyCheckInfo: { status: 1000 } });
            }
        },
        /**
         * GetCheckedRectificationApprovals
         * 获取整改复核详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCheckedRectificationApprovals(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * "id": "string", item id
             * //"rectificationDes": "string",
             * //"rectificationMaterial": "string",
             * //"completeTime": "2023-10-31T09:29:38.730Z"
             */
            const { recheckItemId } = yield select(state => state.abnormalTask);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetCheckedRectificationApprovals
                // , params
                , { id: recheckItemId }
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        checkedRectificationApprovalsResult: result
                    });
                }
            }
        },
        /**
         * 整改列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCheckedRectificationList(
            {
                payload: { params = { pageIndex: 1, pageSize: 1000 }, callback = () => { return false }, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // IsExpert: 为空代表运维人只查询自己整改的单子，不为空代表专家查询所有自己能看到的点位的整改单子
            // IsComplete参数修改为需要查询整改单子的状态
            // params.IsComplete = 1;
            const { role } = yield select(state => state.abnormalTask);
            let _params = { ...params };
            // if (role == 'expert') {
            //     _params = { ...params, IsComplete: 2, IsExpert: 1, noCancelFlag: true };
            // } else {
            //     _params = { ...params, IsComplete: 1, noCancelFlag: true };
            // }
            // let _params = { ...params, IsComplete: 1 };
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetCheckedRectificationList
                , _params
            );
            // console.log('getCheckedRectificationList result = ', result);
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    let updateParams = {
                        checkedRectificationListGResult: result,
                        checkedRectificationListCount: SentencedToEmpty(result, ['data', 'Total'], 0)
                    };
                    // if (role == 'expert') {
                    //     updateParams.expertCheckedRectificationListCount = SentencedToEmpty(result, ['data', 'Total'], 0);
                    // } else {
                    //     updateParams.operationStaffCheckedRectificationListCount = SentencedToEmpty(result, ['data', 'Total'], 0);
                    // }
                    yield update(updateParams);
                    setListData(SentencedToEmpty(result, ['data', 'Datas'], []))
                }
            }
        },
        //获取图表数据
        *GetPollutantListByDgimn({ payload }, { update, take, call, put, select }) {
            yield update({ AlarmDataChartValue: { status: -1 }, phenomenonChart: { status: -1 } });
            const result = yield call(authService.axiosAuthPost, api.DataAnalyze.GetPollutantListByDgimn, { DGIMNs: payload.DGIMNs });
            let PointCluePollutant = SentencedToEmpty(result, ['data', 'Datas'], []);
            let pollutanCodeList = [];
            PointCluePollutant.map(item => {
                pollutanCodeList.push(item.PollutantCode);
            });
            yield update({ PointCluePollutant: PointCluePollutant });
            if (payload.dataType == 'Phenomenon') {
                yield put('GetHourDataForPhenomenon', {
                    callback: payload.callback,
                    DGIMNs: payload.DGIMNs,
                    beginTime: payload.selectTime[0],
                    endTime: payload.selectTime[1],
                    PhenomenonType: payload.PhenomenonType,
                    pollutantCodes: pollutanCodeList.toString(),
                    isAsc: true,
                    IsSupplyData: false
                });
            } else {
                yield put('AlarmDataChartValue', {
                    callback: payload.callback,
                    DGIMNs: payload.DGIMNs,
                    beginTime: payload.selectTime[0],
                    endTime: payload.selectTime[1],
                    pollutantCodes: pollutanCodeList.toString(),
                    isAsc: true,
                    IsSupplyData: false
                });
            }
        },
        //数据现象图表
        *GetHourDataForPhenomenon({ payload }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetHourDataForPhenomenon, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ phenomenonChart: result });
                payload.callback(result);
            } else {
                yield update({ phenomenonChart: result });
            }
        },
        //数据图表
        *AlarmDataChartValue({ payload }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetAllTypeDataListForModel, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ AlarmDataChartValue: result });
                payload.callback && payload.callback(result);
            } else {
                yield update({ AlarmDataChartValue: result });
            }
        },
        /**获取报警详情 */
        *getSingleWarning({ payload }, { call, put, take, update }) {
            yield update({ alarmDetailInfo: { status: -1 } });
            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetSingleWarning, payload);
            yield put('getSnapshotData', {
                ID: payload.modelWarningGuid,
                DGIMNs: SentencedToEmpty(result, ['data', 'Datas', 'Dgimn'], '')
            });
            yield take('getSnapshotData/@@end');

            yield update({ alarmDetailInfo: result });
        },
        /**获取报警快照信息 */
        *getSnapshotData({ payload }, { call, put, take, update }) {
            yield update({ alarmChartData: {}, AlarmDataChartValue: { status: -1 } });

            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetSnapshotData + '?ID=' + payload.ID, null);

            if (result.data && result.data != null && result.data.IsSuccess == true) {
                if (SentencedToEmpty(result, ['data', 'Datas', 'rtnFinal'], []).length > 0) {
                    result.data.Datas.PollutantList = SentencedToEmpty(result, ['data', 'Datas', 'rtnFinal', 0, 'Column'], []);
                    const dateString = SentencedToEmpty(result, ['data', 'Datas', 'describe'], '');
                    const timeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/g; // 正则匹配格式如2024-05-10 13:45:30
                    // 使用正则匹配所有时间
                    const timeStrings = [];
                    let match;
                    while ((match = timeRegex.exec(dateString)) !== null) {
                        timeStrings.push(match[0]);
                    }
                    if (timeStrings.length > 1) {
                        result.data.Datas.BeginTime = timeStrings[0];
                        result.data.Datas.EndTime = timeStrings[1];
                    } else {
                        result.data.Datas.BeginTime = SentencedToEmpty(result, ['data', 'Datas', 'rtnFinal', 0, 'Data', 0, 'Time'], '');
                        result.data.Datas.EndTime = SentencedToEmpty(result, ['data', 'Datas', 'rtnFinal', 0, 'Data', 0, 'Time'], '');
                    }
                }
                let pollttantSelect = [];
                let pollutanCodeListStr = [];
                SentencedToEmpty(result, ['data', 'Datas', 'PollutantList'], []).map((item, idx) => {
                    pollutanCodeListStr.push(item.PollutantCode);

                    if (pollttantSelect.length < 6) {
                        if (
                            ['02', '03', 's01', 's03', 's05'].findIndex(subI => {
                                if (subI == item.PollutantCode) return true;
                            }) >= 0
                        ) {
                            pollttantSelect.push(item);
                        }
                    }
                });
                if (pollttantSelect.length == 0) {
                    pollttantSelect.push(SentencedToEmpty(result, ['data', 'Datas', 'PollutantList', 0], {}));
                }
                if (SentencedToEmpty(result, ['data', 'Datas', 'PollutantList'], []).length > 0 && result.data.Datas.BeginTime && SentencedToEmpty(result, ['data', 'Datas', 'rtnFinal'], []).length == 0) {
                    yield put('AlarmDataChartValue', {
                        DGIMNs: payload.DGIMNs,
                        beginTime: moment(result.data.Datas.BeginTime)
                            .subtract(2, 'days')
                            .format('YYYY-MM-DD 00:00:00'),
                        endTime: moment(result.data.Datas.EndTime)
                            .add(2, 'days')
                            .format('YYYY-MM-DD 23:59:59'),
                        pollutantCodes: pollutanCodeListStr.toString(),
                        isAsc: true,
                        IsSupplyData: false
                    });
                    yield take('AlarmDataChartValue/@@end');
                }
                yield update({ alarmChartData: result, PointSelectCluePollutant: pollttantSelect });
            } else {
                yield update({ alarmChartData: result, PointSelectCluePollutant: [] });
            }
        },

        /**
         * 可选方案列表
         */
        *GetPlanDatas({ payload }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetPlanDatas, payload);
            yield update({ checkPlanList: SentencedToEmpty(result, ['data', 'Datas'], []) });
        },

        /**
         * 可选核查人列表
         */
        *GetCheckRoleDatas({ payload }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetCheckRoleDatas, payload);
            let userList = [];
            SentencedToEmpty(result, ['data', 'Datas'], [])
                .map((item, index) => {
                    userList = userList.concat(item.Users);
                });
            // yield update({ checkUserList: SentencedToEmpty(result, ['data', 'Datas'], []) });
            yield update({ checkUserList: userList });
        },

        /**
         * 可选专家意见列表
         */
        *GetPreTakeFlagDatas({ payload }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetPreTakeFlagDatas, payload);
            yield update({ takeFlagList: SentencedToEmpty(result, ['data', 'Datas'], []) });
        },

        /**
         * 待核查任务列表
         */
        *GetCheckedList({ payload }, { call, put, take, update, select }) {
            const { getCheckedListParams } = yield select(state => state.abnormalTask);
            if (getCheckedListParams) {
                // const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetCheckedList, payload);
                const result = yield call(
                    dataAnalyzeAuth.axiosAuthPost
                    , api.AbnormalDataTask.GetCheckedList
                    , getCheckedListParams);
                if (SentencedToEmpty(payload, ['IsTotal'], false)) {
                    yield update({ checkTaskList: result, checkTaskCount: SentencedToEmpty(result, ['data', 'Total'], 0) });
                } else {
                    yield update({ checkTaskList: result });
                }
            } else {
                ShowToast("参数错误");
            }
        },

        /**
         * 报警分组企业列表
         * @param {*} param0
         * @param {*} param1
         */
        *GetClueDatas({ payload }, { call, put, take, update, select }) {
            let result;
            const {
                clueDatasPageIndex, alarmAnalyIndex
                , alarmAnalyBeginTime, alarmAnalyEndTime
                , clueDatasList
            } = yield select(state => state.abnormalTask);
            payload.beginTime = alarmAnalyBeginTime;
            payload.endTime = alarmAnalyEndTime;
            payload.pageIndex = clueDatasPageIndex;
            // payload.pageIndex = 1;
            // payload.pageSize = 1000;
            payload.pageSize = 20;
            payload.IsReal = 1;

            result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetClueDatas, payload);
            let newData = [];
            if (clueDatasPageIndex == 1) {
                newData = [].concat(SentencedToEmpty(result, ['data', 'Datas', 'showWarnings'], []));
                yield update({
                    ExceptionNumsByPointAuth: result,
                    clueDatasList: newData,
                    clueDatasTotal: SentencedToEmpty(result, ['data', 'Total'], 0)
                });
            } else {
                newData = clueDatasList.concat(SentencedToEmpty(result, ['data', 'Datas', 'showWarnings'], []));
                yield update({
                    ExceptionNumsByPointAuth: result,
                    clueDatasList: newData,
                    clueDatasTotal: SentencedToEmpty(result, ['data', 'Total'], 0)
                });
            }

            if (payload.setListData) {
                payload.setListData(newData, 1000);
            }
        },
        /**
         * 获取报警核实详情
         */
        *GetCheckedView({ payload }, { call, put, update, take, select }) {
            // yield update({ chekTaskDetail: { status: -1 } });
            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetCheckedView, payload);

            yield update({ chekTaskDetail: result });
        },
        /**
         * 任务生成
         */
        *AddPlanTask({ payload: { params, callback } }, { call, put, update, take, select }) {
            yield update({ commitVerifyResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.AddPlanTask, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                callback();
            } else {
                ShowToast('提交失败');
            }
            yield update({ commitVerifyResult: result });
        },
        //反馈上传图片
        *uploadimage({ payload: { image, images = [], callback, uuid } }, { call }) {
            const user = yield loadToken();
            let formdata = new FormData();
            // 单张
            var file = { uri: image.uri, type: 'multipart/form-data', name: 'image.jpg' };
            formdata.append('file', file);
            formdata.append('FileActualType', '2');
            formdata.append('FileUuid', uuid);
            formdata.append('type', '2');
            formdata.append('FileTypes', '2');
            // console.log('uuid = ',uuid);
            fetch(UrlInfo.AbnormalDataTask + api.AbnormalDataTask.UploadFiles, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    authorization: 'Bearer ' + user.dataAnalyzeTicket
                }
            })
                .then(res => {
                    let url = JSON.parse(res._bodyInit).Datas;

                    for (let index = 0; index < images.length; index++) {
                        let attachIDArr = url.split('/');
                        images[index].attachID = attachIDArr[attachIDArr.length - 1];
                        images[index].url = url;
                    }
                    console.log('上传成功');
                    callback(images, true);
                })
                .catch(error => {
                    console.log('上传失败：', error);
                    callback('', false);
                });
        },
        //删除反馈图片
        *DelPhotoRelation({ payload: { params } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pollutionApi.Alarm.delPhoto, {
                Guid: params.code,
                noCancelFlag: true
            });
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                params.callback();
            } else {
                ShowToast('删除失败');
            }
        },

        //核查详情保存或者提交
        *UpdatePlanItem({ payload: { params, callback } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.UpdatePlanItem, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                callback();
            } else {
                ShowToast('设置失败');
            }
        },
        //核查详情保存或者提交
        *UpdatePlanItem({ payload: { params, callback } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.UpdatePlanItem, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                callback();
            } else {
                ShowToast('设置失败');
            }
        },
        //核查详情确认
        *CheckConfirm({ payload: { params, callback } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.CheckConfirm, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                callback();
            } else {
                ShowToast('设置失败');
            }
        },
        //核查详情确认
        *RepulseCheck({ payload: { params, callback = () => { } } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.RepulseCheck, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                yield put({
                    type: 'GetCheckedList',
                    payload: {}
                })
                callback();
            } else {
                ShowToast('设置失败');
            }
        },
        /**
         * 获取报警记录
         * @param {*} param0
         * @param {*} param1
         */
        *GetWaitCheckDatas({ payload: { setListData = (data, duration) => { }, warningTypeCode, params } }, { call, put, take, update, select }) {
            let { alarmAnalyIndex, alarmAnalyBeginTime, alarmAnalyEndTime, alarmAnalyDataType, alarmAnalyListData } = yield select(state => state.abnormalTask);
            if (alarmAnalyIndex == 1) {
                yield update({
                    alarmAnalyListResult: { status: -1 }
                });
            }
            let requestBegin = new Date().getTime();
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.AbnormalDataTask.GetWaitCheckDatas, {
                beginTime: alarmAnalyBeginTime,
                endTime: alarmAnalyEndTime,
                pageSize: '20',
                pageIndex: alarmAnalyIndex,
                GetWaitCheckDatas: 1,
                "IsReal": 1,
                ...params
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newalarmAnalyListData = alarmAnalyListData;
            if (status == 200) {
                if (alarmAnalyIndex == 1) {
                    newalarmAnalyListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newalarmAnalyListData = alarmAnalyListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    alarmAnalyListData: newalarmAnalyListData,
                    alarmAnalyListResult: result,
                    alarmAnalyTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
            } else {
                yield update({
                    alarmAnalyListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newalarmAnalyListData, requestEnd - requestBegin);
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
