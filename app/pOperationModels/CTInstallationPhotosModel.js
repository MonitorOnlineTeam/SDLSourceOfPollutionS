/*
 * @Description: 安装照片
 * @LastEditors: hxf
 * @Date: 2023-09-21 19:45:32
 * @LastEditTime: 2024-06-12 17:00:29
 * @FilePath: /SDLMainProject37/app/pOperationModels/CTInstallationPhotosModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'CTInstallationPhotosModel',
    state: {
        installationItemsListResult: { status: -1 }, // 安装照片项目
        installationPhotosRecordResult: { status: -1 },
        deleteInstallationPhotosRecordResult: { status: 200 },
        addInstallationPhotosRecordResult: { status: 200 },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * DeleteInstallationPhotosChildByID
         * 删除安装照片整改单条数据
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteInstallationPhotosChildByID(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // yield update({ equipmentAuditRectificationNumResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteInstallationPhotosChildByID
                , params// 1 不合格 2已提交 3申诉中
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                // yield update({
                //     equipmentAuditRectificationNumResult: result,
                //     equipmentAuditRectificationNum: SentencedToEmpty(result, ['data', 'Datas', 'UnqualifiedQuantity'], '-')
                // });
            } else {
                // yield update({
                //     equipmentAuditRectificationNumResult: result
                // });
            }
        },
        // *addWorkRecord(
        *addInstallationPhotosRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ addInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddInstallationPhotosRecord
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
                addInstallationPhotosRecordResult: result
            });
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