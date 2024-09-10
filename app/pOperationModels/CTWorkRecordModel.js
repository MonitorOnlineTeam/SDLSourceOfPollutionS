/*
 * @Description: 工作记录
 * @LastEditors: hxf
 * @Date: 2023-09-21 19:45:32
 * @LastEditTime: 2024-04-24 13:42:19
 * @FilePath: /SDLMainProject37_backup/app/pOperationModels/CTWorkRecordModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, createAction } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import { getToken } from '../dvapack/storage';

export default Model.extend({
    namespace: 'CTWorkRecordModel',
    state: {
        workRecordResult: { status: -1 },
        deleteWorkRecordResult: { status: 200 },
        addWorkRecordResult: { status: 200 },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

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
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
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
            } else {
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], '提交失败'));
            }
            yield update({
                addWorkRecordResult: result
            });
        },
        // *getPublicRecord(
        * getWorkRecord(
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
        * deleteWorkRecord(
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