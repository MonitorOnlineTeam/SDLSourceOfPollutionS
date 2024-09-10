import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'CTPeiHeJianCha',
    state: {
        cooperationInsParametersResult: { status: 200 }, // 配合检查参数
        cooperationInspectionRecordResult: { status: -1 }, // 配合检查记录
        editstatus: { status: 200 }, // 提交状态
        selectEnt: {},
        selectPoint: {}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 配合检查 选择的企业排口
         * @param {*} param0
         * @param {*} param1
         */
        *GetProjectEntPointSysModel({ payload }, { call, put, update, take, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetProjectEntPointSysModel, payload);
            yield update({
                repairEntAndPoint: result
            });
        },

        /**
         * 维修记录列表
         * @param {*} param0
         * @param {*} param1
         */
        *GetCooperateRecord({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetCooperateRecord, payload);
            payload.callback(SentencedToEmpty(result, ['data', 'Datas'], []));
        },

        /**
         * 配合检查 相关参数
         * @param {*} param0
         * @param {*} param1
         */
        *GetCooperationInsParameters({ payload }, { call, put, update, take, select }) {
            yield update({
                cooperationInsParametersResult: { status: -1 }
            });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetCooperationInsParameters, payload);
            payload.callback(result);
            yield update({
                cooperationInsParametersResult: result
            });
        },
        /**
         * 配合检查 保存记录
         * @param {*} param0
         * @param {*} param1
         */
        *addCooperationInspectionRecord({ payload }, { call, put, update, take, select }) {
            yield update({ repairSaveResult: { status: -1 } });

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddCooperateRecord, payload);
            yield update({ repairSaveResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                const { secondItem } = yield select(state => state.CTModel);
                let newSecondItem = {...secondItem};
                newSecondItem.RecordStatus = 1;
                yield put('CTModel/updateState',{secondItem:newSecondItem});
                ShowToast('保存成功');
                // 本地修改任务详情表单列表状态
                const { dispatchId } = yield select(state => state.CTModel);
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            } else {
                ShowToast('提交失败');
                yield update({ repairSaveResult: { status: 200 } });
            }
        },
        /**
         * 配合检查 删除表单
         * @param {*} param0
         * @param {*} param1
         */
        *DeleteCooperateRecord({ payload }, { call, put, update, take, select }) {
            yield update({ repairDelResult: { status: -1 } });

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteCooperateRecord, payload);
            yield update({ repairDelResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('删除成功');

                const { dispatchId } = yield select(state => state.CTModel);
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
                yield put(NavigationActions.back());
            } else {
                ShowToast('删除失败');
            }
        }
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});
