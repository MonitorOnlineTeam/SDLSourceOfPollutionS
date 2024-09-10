/*
 * @Description: 模型整改 model
 * @LastEditors: hxf
 * @Date: 2023-10-30 11:16:16
 * @LastEditTime: 2023-11-03 13:34:54
 * @FilePath: /SDLMainProject36/app/pOperationModels/modelAnalysisAectificationModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'modelAnalysisAectificationModel',
    state: {
        updateCheckedRectificationResult: { status: 200 },
        recheckItemId: '',// 复核记录id 用于获取复核详情
        checkedRectificationApprovalsResult: { status: -1 }, // 复核详情

        checkedRectificationCompleteListResult: { status: -1 },
        checkedRectificationCompleteListData: [],
        completeIndex: 1,
        completePageSize: 20,

        checkedRectificationListGResult: { status: -1 },
        deleteWorkRecordResult: { status: 200 },
        addWorkRecordResult: { status: 200 },

        checkedRectificationResult: { status: 200 }, // 整改复核提交状态
        "btime": moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),// 整改记录参数 列表开始时间
        "etime": moment().format('YYYY-MM-DD 23:59:59'),// 整改记录参数 列表结束时间
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 模型整改 获取未处理异常整改
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCheckedRectificationList(
            {
                payload: { params = { pageIndex: 1, pageSize: 1000 }, callback = () => { return false }, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ModelAnalysisAectification.GetCheckedRectificationList
                , params
            );
            // console.log('getCheckedRectificationList result = ', result);
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        checkedRectificationListGResult: result
                    });
                    setListData(SentencedToEmpty(result, ['data', 'Datas'], []))
                }
            }
        },
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
            } = yield select(state => state.modelAnalysisAectificationModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ModelAnalysisAectification.GetCheckedRectificationList
                , {
                    "pageIndex": completeIndex,
                    "pageSize": completePageSize,
                    btime,
                    etime,
                    "isComplete": true
                }
            );
            console.log('getCheckedRectificationCompleteList result = ', result);
            // checkedRectificationCompleteListResult: { status: -1 },
            // checkedRectificationCompleteListData: [],
            // completeIndex: 1,
            // completePageSize: 20,
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
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ModelAnalysisAectification.UpdateCheckedRectification
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
            const { recheckItemId } = yield select(state => state.modelAnalysisAectificationModel);
            console.log('GetCheckedRectificationApprovals params = ', params);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ModelAnalysisAectification.GetCheckedRectificationApprovals
                // , params
                , { id: recheckItemId }
            );
            console.log('GetCheckedRectificationApprovals result = ', result);
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
            const { recheckItemId } = yield select(state => state.modelAnalysisAectificationModel);

            // console.log('CheckedRectification params = ', params);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ModelAnalysisAectification.CheckedRectification
                , params
                // , {
                //     id: recheckItemId,
                //     approvalRemarks: '复核意见202311011710',
                //     approvalDocs: `fhtp_${new Date().getTime()}`,
                //     approvalStatus: 1
                // }
            );
            console.log('CheckedRectification result = ', result);
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
        // *addPublicRecord(
        *addWorkRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ addWorkRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddWorkRecord
                , params
            );
            if (result.status == 200) {
                const handleResult = callback(result);
                if (!handleResult) {
                    ShowToast('提交成功');
                    yield put(NavigationActions.back());
                }
                const { dispatchId } = yield select(state => state.CTModel)
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            }
            yield update({
                addWorkRecordResult: result
            });
        },
        // *getPublicRecord(
        *getWorkRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetWorkRecord
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        workRecordResult: result
                    });
                }
            }
            // yield update({
            //     acceptanceServiceRecordResult:result
            // });
        },
        // *deletePublicRecord(
        *deleteWorkRecord(
            {
                payload: { params = {}, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ deleteWorkRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteWorkRecord
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
                deleteWorkRecordResult: result
            });
        },
    },

    subscriptions: {}
});