import moment from 'moment';

import { createAction, Storage, StackActions, ShowToast, SentencedToEmpty, NavigationActions } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { loadToken, saveRouterConfig, getToken } from '../dvapack/storage';
import api from '../config/globalapi';
import { createImageUrl, delay } from '../utils';
import { createFormUrl } from '../utils/taskUtils';
import { UrlInfo } from '../config/globalconst';
import JSEncrypt from 'jsencrypt';
import Base64 from 'react-native-base64-master';

export let alarmResponseing = false; // 防止连点
export default Model.extend({
    namespace: 'taskModel',
    state: {
        PartList: [
            { 'name': '我公司供货', code: 1 }
            , { 'name': '甲方供货', code: 2 }
        ],
        entID: '',// 待办任务所属企业id
        recordTypeID: '',// 待办任务类型id
        alarmResponseStatus: { status: -1 }, //报警响应的状态
        isAlarmRes: true, //报警是否响应的状态
        relatedToAlarmsTaskId: '', //异常/缺失超标报警关联任务id
        currentTask: null, //转发所用当前任务相关信息
        selectableMaintenanceStaff: { status: -1 }, //可转移任务运维人员
        searchtableMaintenanceStaff: { status: -1 }, //搜索人员
        selectablePart: { status: 200 }, //可选备件
        searchtablePart: { status: 200 }, //搜索备件
        selectTransUser: {}, //接手人
        currnetTimeCardEnterprise: { Latitude: '', Longitude: '', Radius: '' }, //当前打卡的企业坐标信息
        TaskID: '', //用于任务转发
        taskStatistics: -1,
        taskStatisticsData: {},
        applyData: { status: 200 },
        TaskRecordIndex: 1,
        TaskRecordTotal: 0,
        TaskRecordResult: { status: -1 },
        TaskRecordData: [],
        TaskRecordbeginTime: moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00'),
        TaskRecordendTime: moment().format('YYYY-MM-DD 23:59:59'),
        //待办任务相关参数
        unhandleTaskListPageIndex: 1,
        unhandleTaskListPageSize: 20,
        unhandleTaskListTotal: 0,
        unhandleTaskListData: [],
        unhandleTaskListResult: { status: -1 },
        UnhandleTaskTypeListResult: { status: -1 },//包含待办任务的企业
        taskType: { status: -1 },
        sparePartsReplace: { status: -1 }, //备品备件记录
        sparePartsRecord: {},
        taskType: { status: -1 },
        consumablesReplace: { status: -1 }, //易耗品记录
        consumableRecord: {},
        editstatus: { status: 200 }, // 提交状态
        gasRecordList: [], //标气更换记录表 与试剂（污水）更换公用
        gasRecordListStatus: { status: -1 }, //保存标气更换记录请求状态，和其他所有信息,与试剂（污水）更换公用
        standardGasList: [], //标准物质名称
        unitsList: [], //标气的单位
        nameCode: [], //易耗品数组
        unitCode: [], //易耗品单位
        pointEquipmentResult: { status: -1 },// 污水 试剂更换记录表 填写时使用的设备信息
        standardLiquidRepalceRecordListResult: { status: -1 }, // 污水 试剂更换记录表
        standardLiquidRepalceRecordList: [], // 试剂更换记录列表
        remoteAlarmHandleResult: { status: 200 },// 异常报警和缺失报警的 无需处理｜｜远程处理的提交状态

        taskRecordSearchStr: '',// 任务记录搜索字符串
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 标准气体列表
         * 标准试剂列表（水）
         * @param {*} param0
         * @param {*} param1
         */
        *getStandardGasList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetStandardGasList, params);
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas'], []);
                yield update({ searchtablePart: result, selectablePart: result });
            } else {
                ShowToast('可选物品列表获取失败。');
                yield update({ searchtablePart: result, selectablePart: result });
            }
        },
        /**
         * 备品备件列表
         * 易耗品列表
         * @param {*} param0
         * @param {*} param1
         */
        *getSparePartsList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetSparePartsList, params);
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas'], []);
                yield update({ searchtablePart: result, selectablePart: result });
            } else {
                ShowToast('可选物品列表获取失败。');
                yield update({ searchtablePart: result, selectablePart: result });
            }
        },
        /**
         * 获取仓库列表
         * @param {*} param0
         * @param {*} param1
         */
        *getStorehouse(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            // const result = yield call(authService.axiosAuthGet, api.pOperationApi.OperationForm.GetStorehouse, {});
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Data.GetListPager,
                {
                    "configId": "Storehouse", "pageIndex": 1, "pageSize": 10000
                    , "ConditionWhere": "{\"rel\":\"$and\",\"group\":[{\"rel\":\"$and\",\"group\":[{\"Key\":\"dbo__T_Bas_Storehouse__StorehouseStatus\",\"Value\":\"1\",\"Where\":\"$=\"}]}]}"
                });
            if (result.status == 200) {
                // result.data.data = SentencedToEmpty(result, ['data', 'Datas'], []);
                result.data.data = SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []);
                yield update({ selectablePart: result });
            } else {
                ShowToast('可选物品列表获取失败。');
                yield update({ selectablePart: result });
            }
        },

        /**
         * 获取任务记录
         * @param {*} param0
         * @param {*} param1
         */
        *getTaskRecords(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { TaskRecordIndex, TaskRecordTotal, TaskRecordData, taskRecordSearchStr } = yield select(state => state.taskModel);
            let requestBegin = new Date().getTime();
            params.IsApp = '1';
            params.eprWhere = taskRecordSearchStr;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.TaskRecords, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = TaskRecordData;
            if (status == 200) {
                if (TaskRecordIndex == 1) {
                    newMoData = TaskRecordData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ TaskRecordData: newMoData, TaskRecordTotal: SentencedToEmpty(result, ['data', 'Total'], []), TaskRecordResult: result });
                } else {
                    newMoData = TaskRecordData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ TaskRecordData: newMoData, TaskRecordTotal: SentencedToEmpty(result, ['data', 'Total'], []), TaskRecordResult: result });
                }
            } else {
                yield update({
                    TaskRecordResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        },
        /**
         * 获取可以创建的任务类型
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *getTaskType(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            //所有任务类型

            yield update({ taskType: { status: -1 } });
            //post请求
            // const result = yield call(authService.axiosAuthGet, api.pOperationApi.Task.TaskType, params);
            let urlParam = `PollutantType=${params.PollutantType}&isApplication=${params.isApplication}`;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.TaskType, params, urlParam);
            if (result.status == 200) {
                params.callback(SentencedToEmpty(result, ['data', 'Datas'], []));
            }
            yield update({ taskType: result });
        },
        /**
         * 获取运维统计信息
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *GetOperationStatistics(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            yield update({ taskStatisticsData: {}, taskStatistics: -1 });

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetOperationStatistics, params);

            if (result.status == 200) {
                if (result.data.Datas) {
                    yield update({ taskStatisticsData: result.data.Datas, taskStatistics: 200 });
                } else {
                    yield update({ taskStatisticsData: {}, taskStatistics: 200 });
                }
                return;
            }
            yield update({ taskStatisticsData: {}, taskStatistics: 200 });
        },
        *commitTaskApply(
            {
                payload: { params, successMsg = '申请提交成功', errorMsg = '提交失败', backViewFun = () => { } }
            },
            { call, put, take, update }
        ) {
            //任务申请
            yield update({ applyData: { status: -1 } }); //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.CreatTask, params);
            if (result.status == 200 && result.data.IsSuccess == true) {
                ShowToast(successMsg);
                backViewFun();
            } else {
                ShowToast(result.data.Message);
            }
            yield update({ applyData: result });
        },
        *CreateAndFinishTask(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update }
        ) {
            if (!alarmResponseing) {
                alarmResponseing = true;
                yield update({ remoteAlarmHandleResult: { status: -1 } });
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.CreateAndFinishTask, params);
                yield update({ remoteAlarmHandleResult: result });
                if (result.status == 200 && result.data.IsSuccess == true) {
                    alarmResponseing = false;
                    ShowToast('提交成功');
                    callback();
                    yield put(NavigationActions.back());
                } else {
                    alarmResponseing = false;
                    ShowToast('提交失败');
                }
            }

        },
        *alarmResponse(
            {
                payload: { params
                    , successCallback = () => { }
                    , failureCallBack = () => { }
                }
            },
            { call, put, take, update }
        ) {
            //报警响应
            yield update({ alarmResponseStatus: { status: -1 } }); //post请求
            if (!alarmResponseing) {
                alarmResponseing = true;
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.CreatTask, params);
                if (result.status == 200 && result.data.IsSuccess == true) {
                    successCallback();
                    ShowToast('响应成功，请到待办任务查看相关任务');
                    alarmResponseing = false;
                } else {
                    failureCallBack();
                    ShowToast('响应失败');
                    alarmResponseing = false;
                }
                yield update({ alarmResponseStatus: result });
            }
        },
        *isAlarmResponse(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update }
        ) {
            alarmResponseing = false;
            //判断报警是否响应
            yield update({ isAlarmRes: true }); //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.isAlarmRes, params);
            // if (result.status == 200 && result.data.IsSuccess == true) {
            // } else {
            // }
            // yield update({ isAlarmRes: result.data.Datas });
            if (result.status == 200 && result.data.IsSuccess == true) {
                /**
                 * state 代表任务处理状态 false 表示有任务未处理完成，报警为已响应状态
                 *                      true 表示有任务已处理完成，报警为可以 响应
                 */
                const state = SentencedToEmpty(result, ['data', 'Datas'], {}).state;
                yield update({ isAlarmRes: typeof state == 'undefined' ? true : state, relatedToAlarmsTaskId: SentencedToEmpty(result, ['data', 'Datas', 'taskID'], '') });
                callback();
            } else {
                yield update({ isAlarmRes: false, relatedToAlarmsTaskId: '' });
                // 当运维人员查看报警时，不能正确获取响应状态，则不显示报警列表，显示请求错误页面要求用户刷新。
                yield put(createAction('pointDetails/updateState')({ alarmRecordsListResult: { status: 1000 } }));
            }
        },
        *getUnhandleTaskTypeList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.GetUnhandleTaskTypeList, {});
            yield update({
                UnhandleTaskTypeListResult: result
            });
            let requestEnd = new Date().getTime();
        },
        *getUnhandleTaskList(
            {
                payload: { setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { unhandleTaskListPageIndex, unhandleTaskListPageSize, unhandleTaskListData
                , entID// 待办任务所属企业id
                , recordTypeID// 待办任务类型id 
            } = yield select(state => state.taskModel);
            let requestBegin = new Date().getTime();
            let params = {
                pageIndex: unhandleTaskListPageIndex,
                pageSize: unhandleTaskListPageSize
            };
            if (entID != '') params.entID = entID;
            if (recordTypeID != '') params.recordType = recordTypeID;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.GetUnhandleTaskList, params);
            let newUnhandleTaskListData = [];
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200) {
                if (unhandleTaskListPageIndex == 1) {
                    newUnhandleTaskListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newUnhandleTaskListData = unhandleTaskListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
            }
            yield update({
                unhandleTaskListTotal: SentencedToEmpty(result, ['data', 'Total'], 0),
                unhandleTaskListData: newUnhandleTaskListData,
                unhandleTaskListResult: result
            });
            let requestEnd = new Date().getTime();
            setListData(newUnhandleTaskListData, requestEnd - requestBegin);
        },
        *postRetransmission(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            /**
             * TaskID: '00553062-ade0-420d-a7d4-c657397dbf20',
                ToUserId: '766f911d-5e41-4bbf-b705-add427a16e77',
                Remark: '暂时没时间，转发一下'

                {"TaskID": "06e2f273-9d07-4de3-9be5-e8605f20698e","FromUserId":"eb85dbe8-49fd-4918-9ba1-34f7c337bd44","ToUserId": "766f911d-5e41-4bbf-b705-add427a16e77","Remark": "暂时没时间，转发一下"}
             */
            // params.ToUserId = '2acd1422-8474-4709-8cfc-d8b7c4628fac';
            let TaskIds = SentencedToEmpty(params, ['TaskId'], '');
            let taskIdArray = TaskIds.split(',');
            if (taskIdArray.length == 2 && taskIdArray[1] == '') {
                params.TaskId = taskIdArray[0];
            }
            let user = getToken();
            params.FromUserId = user.UserId;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.PostRetransmission, params);
            if (result.status == 200) {
                callback();
                ShowToast('任务转移成功');
            } else {
                ShowToast('任务转移失败');
            }
        },
        *getPersonGroup(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.GetOperationsUserList, params);
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas'], []);
                yield update({ selectableMaintenanceStaff: result });
            } else {
                ShowToast('运维人员列表获取失败。');
                yield update({ selectableMaintenanceStaff: result });
            }
        },

        //获取可选择备件列表
        *getTablePart(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            if (global.constants.isSecret == true) {
                params.ConfigId = Base64.encode(params.ConfigId);
                params.ConditionWhere = Base64.encode(params.ConditionWhere);
            }

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.PartSearch, params);
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []);
                yield update({ selectablePart: result });
            } else {
                ShowToast('可选物品列表获取失败。');
                yield update({ selectablePart: result });
            }
        },

        //搜索备件列表
        *searchPart(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            if (global.constants.isSecret == true) {
                params.ConfigId = Base64.encode(params.ConfigId);
                params.ConditionWhere = Base64.encode(params.ConditionWhere);
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.PartSearch, params);
            let searchLst = [];
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas', 'DataSource'], []);
                yield update({ searchtablePart: result });
            } else {
                ShowToast('搜索失败');
                yield update({ searchtablePart: result });
            }
        },
        //搜索转发人列表
        *searchPersonGroup(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.GetOperationsUserList, params, `userName=${params.UserName}`);
            let searchLst = [];
            if (result.status == 200) {
                result.data.data = SentencedToEmpty(result, ['data', 'Datas'], []);
                result.data.data.map((item, key) => {
                    item.data.map(itemSub => {
                        searchLst.push({ ...itemSub, User_Name: itemSub.title });
                    });
                });
                result.data.data = searchLst;
                yield update({ searchtableMaintenanceStaff: result });
            } else {
                ShowToast('运维人员列表获取失败。');
                yield update({ searchtableMaintenanceStaff: result });
            }
        },
        //备件表单操作
        *getSparePartsRecord(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            //查询备件记录
            yield update({ sparePartsReplace: { status: -1 } });
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetSparePartReplaceRecordList, params);
            if (result.status == 200) {
                // 废弃逻辑 返回默认值保证正常使用
                SentencedToEmpty(result, ['data', 'Datas', 'Code'], []).map(item => {
                    item.PartNameShow = `${item.PartName}|${item.Manufacturer}（${item.Code}）|${item.Unit}`;
                });
                yield update({ sparePartsRecord: result.data.Datas.Record, sparePartsReplace: result });
            } else {
                yield update({ sparePartsReplace: result });
            }
        },
        *commitSpareParts(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            // yield update({ sparePartsReplace: { status: -1 } });
            //添加备件记录
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddSparePartReplaceRecord, params);
            yield update({ editstatus: { status: 200 } });
            if (result.status == 200 && result.data.IsSuccess) {
                const { sparePartsRecord } = yield select(state => state.taskModel)
                const { TypeID } = sparePartsRecord;
                ShowToast('操作成功');
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID
                }));
                yield put(NavigationActions.back());
                yield put(createAction('getSparePartsRecord')({ params: { TaskID: params.TaskID, TypeID: params.TypeID } }));
            } else {
                ShowToast('提交失败');
            }
        },
        *deleteSpareParts(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            yield update({ editstatus: { status: -1 } });
            //删除备件记录表单
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteSparePartReplaceRecord, params);
            yield update({ editstatus: { status: 200 } });
            if (result.status == 200 && result.data.IsSuccess) {
                const { TypeID } = params;
                console.log('TypeID = ', TypeID);
                ShowToast('操作成功');
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID, isAdd: false
                }));
                yield put(NavigationActions.back());
                yield put(createAction('getSparePartsRecord')({ params }));
                yield put(createAction('getTaskDetailWithoutTaskDescription')({}));
            } else {
                ShowToast('提交失败');
            }
        },
        *getConsumablesReplace(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            //查询易耗品记录
            yield update({ consumablesReplace: { status: -1 } });
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.ConsumablesLst, params);
            //   yield update({ consumablesReplace: result ,});
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                let currentCode = [];
                // 废弃逻辑 返回默认值保证正常使用
                SentencedToEmpty(result, ['data', 'Datas', 'Code'], []).map((item, key) => {
                    // item.value = item.StandardGasName + '-' + item.Manufacturer + '-' + item.Unit;
                    item.value = item.PartName + '|' + item.Manufacturer + '|' + item.Code + '|' + item.Unit;
                    currentCode.push(item);
                });
                yield update({ consumableRecord: result.data.Datas.Record, consumablesReplace: result, nameCode: currentCode, unitCode: result.data.Datas.Code1 });
            }
            yield update({ consumablesReplace: result });
            //刷新任务详情的表单列表 完成
        },
        *commitConsumablesReplace(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            //添加易耗品记录
            const { TypeID } = params;
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddConsumables, params);
            yield update({ editstatus: { status: 200 } });
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('操作成功');
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID
                }));
                yield put(NavigationActions.back());
                yield put(createAction('getConsumablesReplace')({ params: { TaskID: params.TaskID, TypeID: params.TypeID, } }));
            } else {
                ShowToast('提交失败');
            }
        },
        *deleteConsumablesReplace(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            yield update({ editstatus: { status: -1 } });
            //删除易耗品记录表单
            const { TypeID } = params;
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteConsumables, params);
            yield update({ editstatus: { status: 200 } });
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('操作成功');
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID, isAdd: false
                }));
                yield put(NavigationActions.back());
                yield put(createAction('getConsumablesReplace')({ params }));
                yield put(createAction('getTaskDetailWithoutTaskDescription')({}));
            } else {
                ShowToast('提交失败');
            }
        },

        //有关标气更换的相关action
        /**
         * 创建标气更换记录
         * @param {*} param0
         * @param {*} param1
         */
        *saveInfoGas(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            const { gasRecordList, gasRecordListStatus } = yield select(state => state.taskModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                // Content: {
                //     EnterpriseName: taskDetail.EnterpriseName,
                //     PointPosition: '', //安装地点
                //     MaintenanceManagementUnit: '' //所属运维公司
                // },
                Content: SentencedToEmpty(gasRecordListStatus
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: gasRecordList
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddStandardGasRepalceRecord, body);
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: 4
                }));// 4 标气记录
                callback();
            } else {
                ShowToast('提交失败');
            }
            yield update({ editstatus: { status: 200 } })
        },
        *getInfoGas({ payload }, { call, put, update, take, select }) {
            if (payload.createForm) {
                yield update({ gasRecordList: [], gasRecordListStatus: { status: -1 } });
            } else {
                const { taskDetail } = yield select(state => state.taskDetailModel);
                const body = {
                    TaskID: taskDetail.ID
                };

                //刷新任务详情的表单列表 完成
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetStandardGasRepalceRecordList, body);
                if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    let currentCode = [];
                    // 废弃逻辑 返回默认值保证正常使用
                    SentencedToEmpty(result, ['data', 'Datas', 'Code'], []).map((item, key) => {
                        item.value = item.StandardGasName + '-' + item.Manufacturer + '-' + item.Unit;
                        currentCode.push(item);
                    });
                    yield update({ gasRecordList: result.data.Datas.Record.RecordList, gasRecordListStatus: result, standardGasList: currentCode });
                } else {
                    yield update({ gasRecordListStatus: result });
                }
            }
        },
        *checkDelFormGas({ payload }, { call, put, update, take, select }) {
            const { TaskFormList } = yield select(state => state.taskModel);
            let index = TaskFormList.findIndex(item => {
                if (item.TypeName == 'StandardGasRepalceHistoryList' && item.FormMainID) {
                    return true;
                } else {
                    return false;
                }
            });
            if (index != -1) {
                payload.callback();
            } else {
                ShowToast('表单未完全创建无需删除');
            }
        },
        *delFormGas({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -1 } })
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let body = {
                TaskID: taskDetail.ID
            };
            // const result = yield call(formSers.deleteStandardGasRepalceRecord, body);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteStandardGasRepalceRecord, body);
            if (result && result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                // 本地修改表单列表状态
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: 4, isAdd: false
                }));// 4 标气记录
                payload.callback(taskDetail.ID);
                yield update({ gasRecordList: [] });
            }
            yield update({ editstatus: { status: 200 } })
        },
        *delItemGas(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -1 } })
            const { gasRecordList } = yield select(state => state.taskModel);
            gasRecordList.splice(index, 1);
            yield update({ gasRecordList });
            yield put(createAction('saveInfoGas')({ callback }));
            yield take('saveInfoGas/@@end');
        },
        *saveItemGas(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -2 } })
            const { gasRecordList } = yield select(state => state.taskModel);
            if (index == -1) {
                gasRecordList.push(record);
            } else {
                gasRecordList[index] = record;
            }
            yield update({ gasRecordList });
            yield put(createAction('saveInfoGas')({ callback }));
            yield take('saveInfoGas/@@end');
        },
        /**
         * GetStandardLiquidRepalceRecordList 获取列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getStandardLiquidRepalceRecordList({ payload }, { call, put, update, take, select }) {
            if (payload.createForm) {
                yield update({ gasRecordList: [], gasRecordListStatus: { status: -1 } });
            } else {
                const { taskDetail } = yield select(state => state.taskDetailModel);
                const body = {
                    TaskID: taskDetail.ID
                };

                //刷新任务详情的表单列表 完成
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetStandardLiquidRepalceRecordList, body);
                yield update({
                    standardLiquidRepalceRecordListResult: result
                    , standardLiquidRepalceRecordList: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList'], [])
                });
            }
        },
        /**
         * GetMonitorPointEquipmentParameters 获取设备列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getMonitorPointEquipmentParameters({ payload }, { call, put, update, take, select }) {
            if (payload.createForm) {
                yield update({ gasRecordList: [], gasRecordListStatus: { status: -1 } });
            } else {
                const { taskDetail } = yield select(state => state.taskDetailModel);
                const body = {
                    TaskID: taskDetail.ID
                };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetMonitorPointEquipmentParameters, body, `DGIMN=${taskDetail.DGIMN}`);
                yield update({ pointEquipmentResult: result });
            }
        },
        /**
         * 保存单条试剂更换记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *saveItemStandardLiquidRepalce(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -2 } })
            const { standardLiquidRepalceRecordList } = yield select(state => state.taskModel);
            let newList = [...standardLiquidRepalceRecordList]
            if (index == -1) {
                newList.push(record);
            } else {
                newList[index] = record;
            }
            yield update({ standardLiquidRepalceRecordList: newList });
            yield put(createAction('saveAllStandardLiquidRepalce')({ callback }));
            yield take('saveAllStandardLiquidRepalce/@@end');
        },
        /**
         * 删除单条试剂更换记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *delItemStandardLiquidRepalce(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -1 } })
            const { standardLiquidRepalceRecordList } = yield select(state => state.taskModel);
            let newList = [...standardLiquidRepalceRecordList]
            newList.splice(index, 1);
            yield update({ standardLiquidRepalceRecordList: newList });
            yield put(createAction('saveAllStandardLiquidRepalce')({ callback }));
            yield take('saveAllStandardLiquidRepalce/@@end');
        },
        /**
         * 保存完整的试剂更换记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *saveAllStandardLiquidRepalce(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            const { standardLiquidRepalceRecordList
                , standardLiquidRepalceRecordListResult } = yield select(state => state.taskModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                // Content: {
                //     EnterpriseName: taskDetail.EnterpriseName,
                //     PointPosition: '', //安装地点
                //     MaintenanceManagementUnit: '' //所属运维公司
                // },
                Content: SentencedToEmpty(standardLiquidRepalceRecordListResult
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: standardLiquidRepalceRecordList
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddStandardLiquidRepalceRecord, body);
            yield update({ editstatus: { status: 200 } })
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                callback();
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * 删除试剂更换表单
         * @param {*} param0 
         * @param {*} param1 
         */
        *delFormStandardLiquidRepalce({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -1 } })
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let body = {
                TaskID: taskDetail.ID
            };
            // const result = yield call(formSers.deleteStandardGasRepalceRecord, body);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteStandardLiquidsRepalceRecord, body);
            if (result && result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                payload.callback(taskDetail.ID);
                yield update({ standardLiquidRepalceRecordList: [], editstatus: { status: 200 } });
            } else {
                yield update({ editstatus: { status: 200 } })
            }
        },
        /**
         * 撤销任务
         * @param {*} param0 
         * @param {*} param1 
         */
        *revokeTask(
            {
                payload: { item, callback = () => { } }
            },
            { call, put, update, take, select }
        ) {
            if (item) {
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.RevokeManualTake, {
                    taskID: item.TaskID
                });
                if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    yield put({ type: 'getUnhandleTaskList', payload: {} })
                    ShowToast('任务撤回成功！');
                } else {
                    ShowToast('任务撤回失败！');
                }
            } else {
                ShowToast('任务信息异常，未执行撤回！');
            }
            callback();
        }
    },

    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({
                TaskRecord: ({ params }) => {
                    dispatch(
                        createAction('updateState')({
                            TaskRecordbeginTime: moment()
                                .subtract(7, 'day')
                                .format('YYYY-MM-DD 00:00:00'),
                            TaskRecordendTime: moment().format('YYYY-MM-DD 23:59:59')
                        })
                    );
                },
                PoStandardGasRepalceForm: ({ params }) => {
                    dispatch({
                        type: 'getInfoGas',
                        payload: params
                    });
                },
                PoStandardLiquidReplaceRecord: ({ params }) => {
                    dispatch({
                        type: 'updateState',
                        payload: { standardLiquidRepalceRecordListResult: { status: -1 } }
                    });
                    dispatch({
                        type: 'getStandardLiquidRepalceRecordList',
                        payload: params
                    });
                }
            });
        }
    }
});

// 配合检查
export const peiHeJianChaModel = Model.extend({
    namespace: 'peiHeJianChaModel',
    state: {
        cooperationInsParametersResult: { status: -1 },// 配合检查参数
        cooperationInspectionRecordResult: { status: -1 },// 配合检查记录
        editstatus: { status: 200 },// 提交状态
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取配合检查记录表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCooperationInspectionRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID = '', callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetCooperationInspectionRecordList, body);
            if (result.status == 200 && result.data.IsSuccess) {
                callback(result);
            }
            yield update({ cooperationInspectionRecordResult: result });
        },
        /**
         * 获取参数列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCooperationInsParameters({ payload: { callback = () => { } } }, { call, put, update, take, select }) {
            let body = {
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetCooperationInsParameters, body);
            if (result.status == 200 && result.data.IsSuccess) {
                callback(result);
            }
            yield update({ cooperationInsParametersResult: result });
        },
        /**
         * 添加/修改配合检验记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *addCooperationInspectionRecord({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -2 } })
            let { record, callback, TypeID } = payload;
            const { cooperationInspectionRecordResult } = yield select(state => state.peiHeJianChaModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID,
                Content: SentencedToEmpty(cooperationInspectionRecordResult
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: [record]
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddCooperationInspectionRecord, body);
            yield update({ editstatus: { status: 200 } })
            if (result.status == 200 && result.data.IsSuccess) {
                // 本地修改任务详情表单列表状态 
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID
                }));
                callback();
            }
        },
        /**
         * 删除配合检验记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteCooperationInspectionRecord({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -1 } })
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID, callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteCooperationInspectionRecord, body);
            yield update({ editstatus: { status: 200 } })
            if (result && result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('配合检查记录删除成功');
                // 本地修改任务详情表单列表状态 
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID, isAdd: false
                }));
                yield put(NavigationActions.back());
                callback(taskDetail.ID);
            }
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({
                // TaskRecord: ({ params }) => {
                //     dispatch(
                //         createAction('updateState')({
                //             TaskRecordbeginTime: moment()
                //                 .subtract(7, 'day')
                //                 .format('YYYY-MM-DD 00:00:00'),
                //             TaskRecordendTime: moment().format('YYYY-MM-DD 23:59:59')
                //         })
                //     );
                // },
            });
        }
    }
})

/**
 * 2021.12.14
 * 数据一致性（实时数据）记录
 */
export const dataConsistencyModel = Model.extend({
    namespace: 'dataConsistencyModel',
    state: {
        dataConsistencyRecordListResult: { status: -1 },// 数据一致性（实时数据）记录 查询结果
        editstatus: { status: 200 },
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        dataConsistencyHDRecordListResult: { status: -1 }, // 数据一致性（实时数据）记录 查询结果
        hdEditstatus: { status: 200 },
        hDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 数据一致性（小时）
        dDate: moment().format('YYYY-MM-DD HH:mm:ss'), // 数据一致性（日数据）
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 数据一致性（实时数据）记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *getDataConsistencyRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID = '', callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetDataConsistencyRecordList, body);
            // if (result.status == 200 && result.data.IsSuccess) {
            //     callback(result);
            // }
            yield update({
                dataConsistencyRecordListResult: result
                , date: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'DataTime'], '') == '' ?
                    moment().format('YYYY-MM-DD HH:mm:ss') : result.data.Datas.Record.Content.DataTime
            });
        },
        /**
         * 添加/修改 数据一致性（实时数据）
         * @param {*} param0 
         * @param {*} param1 
         */
        *addDataConsistencyRecord({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -2 } })
            let { record, callback = () => { } } = payload;
            const { dataConsistencyRecordListResult } = yield select(state => state.dataConsistencyModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            let TypeID = SentencedToEmpty(dataConsistencyRecordListResult
                , ['data', 'Datas', 'Record', 'TypeID'], '');
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID,
                Content: SentencedToEmpty(dataConsistencyRecordListResult
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: [record]
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddDataConsistencyRecord, body);
            if (result.status == 200 && result.data.IsSuccess) {
                // callback();
                yield put(NavigationActions.back());
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID
                }));
                yield put(createAction('getDataConsistencyRecordList')({
                    TypeID
                }));
            }
            yield update({ editstatus: { status: 200 } })
        },
        /**
         * 数据一致性（实时数据） 修改时间
         * @param {*} param0 
         * @param {*} param1 
         */
        *updateConsistencyTime({ payload }, { call, put, update, take, select }) {
            let { date = '', dDate = '', hDate = '', callback = () => { }, oldDate, TypeID, setTime = () => { } } = payload;
            yield update({ date: date });
            const { dataConsistencyRecordListResult } = yield select(state => state.dataConsistencyModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            // DataType 1实时 2小时 3日
            let DataType = 0;
            // if (SentencedToEmpty(dataConsistencyRecordListResult
            //         ,['data','Datas','Record','TypeID'],'') == 63) {
            //     DataType = 1;
            // }
            let body = {
                ID: taskDetail.ID,
                TypeID,
            }
            if (date != '') {
                // DataType = 1;
                body.DataType = 1;
                body.ConsistencyTime = date;
            } else if (hDate != '') {
                // DataType = 2;
                body.DataType = 2;
                body.ConsistencyTime = hDate;
            } else if (dDate != '') {
                body.DataType = 3;
                body.ConsistencyTime = dDate;
            }

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.UpdateConsistencyTime, body);
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('日期修改成功')
                if (date != '') {
                    yield update({ date });
                } else if (hDate != '') {
                    yield update({ hDate });
                } else if (dDate != '') {
                    yield update({ dDate });
                }
            } else {
                if (result.data.StatusCode == 200 && !result.data.IsSuccess) {
                    if (date != '') {
                        ShowToast('未提交实时数据，无法修改数据时间')
                    } else if (hDate != '') {
                        ShowToast('未提交小时数据，无法修改数据时间')
                    } else if (dDate != '') {
                        ShowToast('未提交日数据，无法修改数据时间')
                    }
                } else {
                    ShowToast('日期修改失败')
                }
                setTime(oldDate)
                if (date != '') {
                    yield update({ date: oldDate });
                } else if (hDate != '') {
                    yield update({ hDate: oldDate });
                } else if (dDate != '') {
                    yield update({ dDate: oldDate });
                }
            }
        },
        /**
         * 数据一致性（实时数据） 删除
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteDataConsistencyRecord({ payload }, { call, put, update, take, select }) {
            yield update({ editstatus: { status: -1 } })
            let { params = {}, callback = () => { } } = payload;
            const { dataConsistencyRecordListResult } = yield select(state => state.dataConsistencyModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteDataConsistencyRecord, params);
            if (result.status == 200 && result.data.IsSuccess) {
                let TypeID = SentencedToEmpty(dataConsistencyRecordListResult, ['data', 'Datas', 'Record', 'TypeID'], '')
                ShowToast('删除成功')
                yield put(NavigationActions.back());
                if (SentencedToEmpty(params, ['ZiID'], '') != '') {
                    yield put(createAction('getDataConsistencyRecordList')({
                        TypeID
                    }));
                } else if (SentencedToEmpty(params, ['ZhuID'], '') != '') {
                    yield put(createAction('taskDetailModel/updateFormStatus')({
                        cID: TypeID, isAdd: false
                    }));
                }
            } else {
                ShowToast('删除失败')
            }
            yield update({ editstatus: { status: 200 } })
        },
        /**
         * 数据一致性（小时与日数据）记录 获取数据
         * @param {*} param0 
         * @param {*} param1 
         */
        *getDataConsistencyHDRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID = '', callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetDataConsistencyRecordNewList, body);
            // if (result.status == 200 && result.data.IsSuccess) {
            //     callback(result);
            // }
            const dataList = SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList'], []);
            let hDate = '', // 数据一致性（小时）
                dDate = ''; // 数据一致性（日数据）
            // DataType 1实时 2小时 3日
            dataList.map((item, index) => {
                if (item.IsWrite == 1 && item.DataType == 2 && hDate == '') {
                    hDate = SentencedToEmpty(item, ['DataTime'], moment().format('YYYY-MM-DD HH:00:00'));
                } else if (item.IsWrite == 1 && item.DataType == 3 && dDate == '') {
                    dDate = SentencedToEmpty(item, ['DataTime'], moment().format('YYYY-MM-DD 00:00:00'));
                }
            })
            // 如果 列表中没有记录，需要填充默认值
            if (hDate == '') {
                hDate = moment().format('YYYY-MM-DD HH:00:00');
            }
            if (dDate == '') {
                dDate = moment().format('YYYY-MM-DD 00:00:00');
            }
            yield update({
                dataConsistencyHDRecordListResult: result
                , date: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'DataTime'], '') == '' ?
                    moment().format('YYYY-MM-DD HH:mm:ss') : result.data.Datas.Record.Content.DataTime,
                hDate, dDate
            });
        },
        /**
         * 添加/修改 数据一致性（小时与日数据）
         * @param {*} param0 
         * @param {*} param1 
         */
        *addDataConsistencyRecordNew({ payload }, { call, put, update, take, select }) {
            yield update({ hdEditstatus: { status: -2 } })
            let { record, callback = () => { } } = payload;
            const { dataConsistencyHDRecordListResult } = yield select(state => state.dataConsistencyModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let TypeID = SentencedToEmpty(dataConsistencyHDRecordListResult
                , ['data', 'Datas', 'Record', 'TypeID'], '');
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID,
                Content: SentencedToEmpty(dataConsistencyHDRecordListResult
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: [record]
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddDataConsistencyRecordNew, body);
            if (result.status == 200 && result.data.IsSuccess) {
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID
                }));
                yield put(NavigationActions.back());
                yield put(createAction('getDataConsistencyHDRecordList')({
                    TypeID: SentencedToEmpty(dataConsistencyHDRecordListResult
                        , ['data', 'Datas', 'Record', 'TypeID'], '')
                }));
            }
            yield update({ hdEditstatus: { status: 200 } })
        },
        /**
         * 数据一致性（小时与日数据） 删除
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteDataConsistencyRecordNew({ payload }, { call, put, update, take, select }) {
            yield update({ hdEditstatus: { status: -1 } })
            let { params = {}, callback = () => { } } = payload;
            const { dataConsistencyHDRecordListResult } = yield select(state => state.dataConsistencyModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteDataConsistencyRecord, params);
            if (result.status == 200 && result.data.IsSuccess) {
                let TypeID = SentencedToEmpty(dataConsistencyHDRecordListResult, ['data', 'Datas', 'Record', 'TypeID'], '')
                ShowToast('删除成功')
                yield put(NavigationActions.back());
                if (SentencedToEmpty(params, ['ZiID'], '') != '') {
                    // yield put(NavigationActions.back({key:'DataConsistencyHDRecord'}));
                    yield put(createAction('getDataConsistencyHDRecordList')({
                        TypeID
                    }));
                } else if (SentencedToEmpty(params, ['ZhuID'], '') != '') {
                    yield put(createAction('taskDetailModel/updateFormStatus')({
                        cID: TypeID, isAdd: false
                    }));
                } else {
                    // yield put(NavigationActions.back({key:'TaskDetail'}));
                }
            } else {
                ShowToast('删除失败')
            }
            yield update({ hdEditstatus: { status: 200 } })
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});

/**
 * 2021.12.23
 * 维修记录
 */
export const repairRecordNewModel = Model.extend({
    namespace: 'repairRecordNewModel',
    state: {
        repairRecordDetailResult: { status: -1 },
        repairRecordParamesResult: { status: -1 },
        repairSaveResult: { status: 200 },
        repairDelResult: { status: 200 },
        StartTime: moment().format('YYYY-MM-DD'),
        EndTime: moment().format('YYYY-MM-DD HH:00'),
        dataArray: []
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 维修记录详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNewRepairRecordDetail({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID = '', callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.NewRepairRecordDetail, body);
            yield update({
                repairRecordDetailResult: result
                , StartTime: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'StartTime'], moment().format('YYYY-MM-DD'))
                , EndTime: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'EndTime'], moment().format('YYYY-MM-DD HH:00'))
                , dataArray: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList'], [])
            });
        },
        /**
         * 维修记录 相关参数
         * @param {*} param0 
         * @param {*} param1 
         */
        *getRepairRecordParames({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetRepairRecordParames, body);
            yield update({
                repairRecordParamesResult: result
            });
        },
        /**
         * 维修记录 保存记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *saveRepairRecordOpr({ payload }, { call, put, update, take, select }) {
            yield update({ repairSaveResult: { status: -1 } });
            let { record, callback = () => { }, TypeID } = payload;
            const { repairRecordDetailResult, dataArray, StartTime, EndTime } = yield select(state => state.repairRecordNewModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            let newContent = {
                ...SentencedToEmpty(repairRecordDetailResult
                    , ['data', 'Datas', 'Record', 'Content'], {})
            };
            newContent.StartTime = StartTime;
            newContent.EndTime = EndTime;
            // 检查故障单元是否选择
            let requireStatus = true;
            if (dataArray.length == 0) {
                requireStatus = false;
            }
            dataArray.map((item, index) => {
                if (SentencedToEmpty(item, ['FaultUnitID'], '') == '') {
                    requireStatus = false;
                }
            })

            if (requireStatus) {
                const body = {
                    TaskID: taskDetail.ID,
                    CreateUserID: user.UserId,
                    TypeID: SentencedToEmpty(repairRecordDetailResult
                        , ['data', 'Datas', 'Record', 'TypeID'], ''),
                    Content: newContent,
                    RecordList: dataArray
                };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.RepairRecordOpr, body);
                yield update({ repairSaveResult: result });
                if (result.status == 200 && result.data.IsSuccess) {
                    ShowToast('保存成功');
                    // 本地修改任务详情表单列表状态 
                    yield put(createAction('taskDetailModel/updateFormStatus')({
                        cID: SentencedToEmpty(repairRecordDetailResult
                            , ['data', 'Datas', 'Record', 'TypeID'], '')
                    }));
                    yield put(NavigationActions.back());
                } else {
                    ShowToast('提交失败');
                    yield update({ repairSaveResult: { status: 200 } });
                }
            } else {
                if (dataArray.length == 0) {
                    ShowToast('维修记录不能为空');
                } else {
                    ShowToast('故障单元不能为空');
                }
                yield update({ repairSaveResult: { status: 200 } });
            }
        },
        /**
         * 维修记录 删除表单
         * @param {*} param0 
         * @param {*} param1 
         */
        *repairRecordDel({ payload }, { call, put, update, take, select }) {
            yield update({ repairDelResult: { status: -1 } });
            let { record, callback = () => { }, TypeID } = payload;
            const { repairRecordDetailResult } = yield select(state => state.repairRecordNewModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                TypeID: SentencedToEmpty(repairRecordDetailResult
                    , ['data', 'Datas', 'Record', 'TypeID'], '')
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.RepairRecordDel, body);
            yield update({ repairDelResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('删除成功');
                // 本地修改任务详情表单列表状态 9 对比校验
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: SentencedToEmpty(repairRecordDetailResult
                        , ['data', 'Datas', 'Record', 'TypeID'], ''), isAdd: false
                }));
                yield put(NavigationActions.back());
            } else {
                ShowToast('删除失败');
            }
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});

/**
 * 2021.12.30
 * 上月委托第三方检测次数
 */
export const detectionTimesModel = Model.extend({
    namespace: 'detectionTimesNewModel',
    state: {
        detectionTimesRecordListResult: { status: -1 },
        checkDate: moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
        checkTimes: '',
        detectionTimesSaveResult: { status: 200 },
        detectionTimesDelResult: { status: 200 },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 维修记录详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getDetectionTimesRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID = '', callback = () => { } } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetDetectionTimesRecordList, body);
            yield update({
                detectionTimesRecordListResult: result,
                checkDate: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList', 0, 'DataTime'], moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss')),
                checkTimes: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'RecordList', 0, 'Times'], '')
            });
        },
        /**
         * 上月委托第三方检测次数 保存记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *addDetectionTimesRecord({ payload }, { call, put, update, take, select }) {
            yield update({ detectionTimesSaveResult: { status: -1 } });
            let { record, callback = () => { }, TypeID } = payload;
            const { detectionTimesRecordListResult, checkDate, checkTimes } = yield select(state => state.detectionTimesNewModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID: SentencedToEmpty(detectionTimesRecordListResult
                    , ['data', 'Datas', 'Record', 'TypeID'], ''),
                Content: SentencedToEmpty(detectionTimesRecordListResult
                    , ['data', 'Datas', 'Record', 'Content'], {}),
                RecordList: [{
                    "DataTime": checkDate,
                    "Times": checkTimes
                }]
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddDetectionTimesRecord, body);
            yield update({ detectionTimesSaveResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('保存成功');
                // 本地修改任务详情表单列表状态 
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: SentencedToEmpty(detectionTimesRecordListResult
                        , ['data', 'Datas', 'Record', 'TypeID'], '')
                }));
                yield put(NavigationActions.back());
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * 维修记录 删除表单
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteDetectionTimesRecord({ payload }, { call, put, update, take, select }) {
            yield update({ detectionTimesDelResult: { status: -1 } });
            let { record, callback = () => { }, TypeID } = payload;
            const { detectionTimesRecordListResult } = yield select(state => state.detectionTimesNewModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                TypeID: SentencedToEmpty(detectionTimesRecordListResult
                    , ['data', 'Datas', 'Record', 'TypeID'], '')
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteDetectionTimesRecord, body);
            yield update({ detectionTimesDelResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('删除成功');
                // 本地修改任务详情表单列表状态 
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: SentencedToEmpty(detectionTimesRecordListResult
                        , ['data', 'Datas', 'Record', 'TypeID'], ''), isAdd: false
                }));
                yield put(NavigationActions.back());
            } else {
                ShowToast('删除失败');
            }
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});