/*
 * @Description: 运维计划 Model
 * @LastEditors: hxf
 * @Date: 2024-03-28 14:08:17
 * @LastEditTime: 2024-11-11 11:34:55
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationModels/operationPlanModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast, ShowLoadingToast, ShowResult, SentencedToEmptyTimeString } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

/**
 *  GetAppOperationPlanCalendarDateList:  // 获取日历运维派单计划
    GetAppOperationPlanList:  // 获取单点运维计划
    GetAppOperationPlanByPointList   获取单点运维计划时间轴 
 */

export default Model.extend({
    namespace: 'operationPlanModel',
    state: {
        tabSelectedIndex: 1, // 1 每日计划    2 单点计划

        calenderCurrentMonth: moment().format('YYYY-MM-DD'),
        calenderSelectedDate: moment().format('YYYY-MM-DD'),
        calenderData: [],
        appOperationPlanCalendarDateListResult: { status: 200 },
        calenderDataObject: {},

        appOperationPlanListResult: { status: 200 }, // 单点运维计划 请求结果
        appOperationPlanList: [], // 单点运维计划 一级列表

        currentPlanID: '',
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * GetAppOperationPlanCalendarDateList
         * 获取日历运维派单计划
         * @param {*} param0 
         * @param {*} param1 
         */
        *getAppOperationPlanCalendarDateList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // params.calendarDate = moment().format('YYYY-MM-DD');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.GetAppOperationPlanCalendarDateList
                , params
            );
            let calenderData = [],
                dataObject = {};
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                SentencedToEmpty(result, ['data', 'Datas'], []).map(item => {

                })
                const rawData = SentencedToEmpty(result, ['data', 'Datas'], []);
                rawData.map((item, index) => {
                    for (var key in item) {
                        calenderData.push({
                            date: key,
                            style: { backgroundColor: '#4AA0FF' }
                        });
                        dataObject[key] = item[key];
                    }
                });
                yield update({ calenderData, appOperationPlanCalendarDateListResult: result, calenderDataObject: dataObject });
            } else {
                yield update({ calenderData, appOperationPlanCalendarDateListResult: result, calenderDataObject: dataObject });
            }
        },
        /**
         * GetAppOperationPlanList
         * 获取单点运维计划
         * @param {*} param0 
         * @param {*} param1 
         */
        *getAppOperationPlanList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            // const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            yield update({ appOperationPlanListResult: { status: -1 } });
            // debugger
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.GetAppOperationPlanList
                , params
            );
            // console.log('result = ', result);
            const sectionlist = SentencedToEmpty(result, ['data', 'Datas'], []);
            let list2 = [], beginTime = '', endTime = '';
            sectionlist.map(item => {
                list2 = item.pointList;
                list2.map(item2 => {
                    beginTime = SentencedToEmptyTimeString(item2, ['beginTime'], 'notDate', 'YYYY.MM.DD')
                    endTime = SentencedToEmptyTimeString(item2, ['entTime'], 'notDate', 'YYYY.MM.DD')

                    item2.title = `${SentencedToEmpty(item2, ['pointName'], '----')}(${beginTime}~${endTime})`
                })
                item.data = list2;
            })
            yield update({
                appOperationPlanListResult: result,
                appOperationPlanList: sectionlist
            })
            if (result.status == 200) {
                // CloseToast();
                // yield put(NavigationActions.back());
                // yield put({
                //     type: 'getEquipmentAuditRectificationList'
                //     , payload: { params: { "auditType": tabSelectedIndex } }
                // });
            } else {
                // CloseToast();
                // ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            }
        },
        /**
         * GetAppOperationPlanByPointList
         * 获取单点运维计划时间轴
         * @param {*} param0 
         * @param {*} param1 
         */
        *getAppOperationPlanByPointList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {

            const { currentPlanID } = yield select(state => state.operationPlanModel);
            ShowLoadingToast('正在提交');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.GetAppOperationPlanByPointList
                , {
                    planID: currentPlanID
                }
            );
            yield update({
                appOperationPlanByPointListResult: result,
                appOperationPlanByPointList: SentencedToEmpty(result, ['data', 'Datas'], [])
            })
            if (result.status == 200
                && result.data.IsSuccess) {
                CloseToast();
                callback();
                // yield put(NavigationActions.back());
                // yield put(NavigationActions.back());
                // yield put({
                //     type: 'getEquipmentAuditRectificationList'
                //     , payload: { params: { "auditType": tabSelectedIndex } }
                // });
            } else {
                CloseToast();
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            }
        },
        // *getWorkRecord(
        *getInstallationPhotosRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetInstallationPhotosRecord
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        installationPhotosRecordResult: result
                    });
                }
            } else {
                yield update({
                    installationPhotosRecordResult: result
                });
            }
        },
        // 加载项目
        *getInstallationItemsList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetInstallationItemsList
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        installationItemsListResult: result
                    });
                }
            } else {
                yield update({
                    installationItemsListResult: result
                });
            }
        },
        // *deleteWorkRecord(
        *deleteInstallationPhotosRecord(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ deleteInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteInstallationPhotosRecord
                , params
            );
            if (result.status == 200) {
                ShowToast('删除成功');
                yield put(NavigationActions.back());
                const { dispatchId } = yield select(state => state.CTModel)
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            }
            yield update({
                deleteInstallationPhotosRecordResult: result
            });
        },
    },

    subscriptions: {}
});