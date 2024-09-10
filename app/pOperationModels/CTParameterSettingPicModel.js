/*
 * @Description: 工作记录
 * @LastEditors: hxf
 * @Date: 2023-09-21 19:45:32
 * @LastEditTime: 2023-09-22 09:16:31
 * @FilePath: /SDLMainProject36/app/pOperationModels/CTParameterSettingPicModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'CTParameterSettingPicModel',
    state: {
        parameterSettingsPhotoRecordResult: { status: -1 },
        deleteParameterSettingsPhotoRecordResult: { status: 200 },
        addParameterSettingsPhotoRecordResult: { status: 200 }
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        // *addWorkRecord(
        *addParameterSettingsPhotoRecord(
            {
                payload: {
                    params = {},
                    callback = () => {
                        return false;
                    }
                }
            },
            { call, put, take, update, select }
        ) {
            yield update({ addParameterSettingsPhotoRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddParameterSettingsPhotoRecord, params);
            if (result.status == 200) {
                const handleResult = callback(result);
                if (!handleResult) {
                    ShowToast('提交成功');
                    // 本地修改任务详情表单列表状态
                    const { dispatchId } = yield select(state => state.CTModel);
                    yield put('CTModel/getServiceDispatchTypeAndRecord', {
                        params: {
                            dispatchId
                        }
                    });
                }
            }
            yield update({
                addParameterSettingsPhotoRecordResult: result
            });
        },
        // *getWorkRecord(
        *getParameterSettingsPhotoRecord(
            {
                payload: {
                    params = {},
                    callback = () => {
                        return false;
                    }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetParameterSettingsPhotoRecord, params);
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        parameterSettingsPhotoRecordResult: result
                    });
                }
            }
            // yield update({
            //     acceptanceServiceRecordResult:result
            // });
        },
        // *deleteWorkRecord(
        *deleteParameterSettingsPhotoRecord({ payload: { params = {}, setListData = () => {} } }, { call, put, take, update, select }) {
            yield update({ deleteParameterSettingsPhotoRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteParameterSettingsPhotoRecord, params);
            if (result.status == 200) {
                ShowToast('删除成功');
                yield put(NavigationActions.back());
                const { dispatchId } = yield select(state => state.CTModel);
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            }
            yield update({
                deleteParameterSettingsPhotoRecordResult: result
            });
        }
    },

    subscriptions: {}
});
