import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'CTRepair',
    state: {
        repairEntAndPoint: { status: -1 },
        selectEnt: {},
        selectPoint: {},
        repairRecordDetailResult: { status: -1 },
        repairRecordParamesResult: { status: -1 },
        repairSaveResult: { status: 200 },
        repairDelResult: { status: 200 },
        RepairDate: moment().format('YYYY-MM-DD'),
        DepartureTime: moment().format('YYYY-MM-DD HH:00'),
        dataArray: []
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 维修记录 选择的企业排口
         * @param {*} param0
         * @param {*} param1
         */
        *GetProjectEntPointSysModel({ payload }, { call, put, update, take, select }) {
            yield update({
                repairEntAndPoint: { status: -1 }
            });
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
        *GetRepairRecord({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetRepairRecord, payload);
            payload.callback(SentencedToEmpty(result, ['data', 'Datas'], []));
        },

        /**
         * 维修记录详情
         * @param {*} param0
         * @param {*} param1
         */
        // *getNewRepairRecordDetail({ payload }, { call, put, update, take, select }) {
        //     const { taskDetail } = yield select(state => state.taskDetailModel);

        //     const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetRepairRecord, payload);
        //     yield update({
        //         repairRecordDetailResult: result,
        //         StartTime: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'StartTime'], moment().format('YYYY-MM-DD')),
        //         EndTime: SentencedToEmpty(result, ['data', 'Datas', 'Record', 'Content', 'EndTime'], moment().format('YYYY-MM-DD HH:00')),
        //         dataArray: SentencedToEmpty(
        //             result,
        //             ['data', 'Datas'],
        //             [
        //                 {
        //                     faultTime: moment()
        //                         .minute(0)
        //                         .second(0)
        //                         .format('YYYY-MM-DD HH:mm:ss')
        //                 }
        //             ]
        //         )
        //     });
        // },
        /**
         * 维修记录 相关参数
         * @param {*} param0
         * @param {*} param1
         */
        *getRepairRecordParames({ payload }, { call, put, update, take, select }) {
            yield update({
                repairRecordParamesResult: { status: -1 }
            });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetRepairRecordParames, payload);
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

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddRepairRecord, payload);
            yield update({ repairSaveResult: result });
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('保存成功');
                yield put(NavigationActions.back());
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
         * 维修记录 删除表单
         * @param {*} param0
         * @param {*} param1
         */
        *repairRecordDel({ payload }, { call, put, update, take, select }) {
            yield update({ repairDelResult: { status: -1 } });

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteRepairRecord, payload);
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
