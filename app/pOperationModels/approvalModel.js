import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { loadToken, saveRouterConfig } from '../dvapack/storage';
import api from '../config/globalapi';
export default Model.extend({
    namespace: 'approvalModel',
    state: {
        pendingData: { status: -1 },
        approvalPage: 1,
        currentApproval: {},
        PerformApprovalCount:0,
        approvalStatue:{status:200}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        // *getTaskListRight(
        //     {
        //         payload: { params }
        //     },
        //     { call, put, take, select, update }
        // ) {
        //     //待审批
        //     if (params.pageIndex == 1) {
        //         yield update({ pendingData: { status: -1 } });
        //     }

        //     //post请求
        //     const result = yield call(authService.axiosPost, api.approval.pending, params);
        //     if (params.pageIndex == 1) {
        //         if (result && result.status == 200 && result.data.data.length == 0) {
        //             result.status = 0;
        //         }
        //         yield update({ pendingData: result });
        //     } else {
        //         const { pendingData } = yield select(state => state.approvalModel);
        //         let newPendingData = pendingData.data.data;
        //         newPendingData = newPendingData.concat(result.data.data);
        //         // todoData.data.data.concat(result.data.data)
        //         result.data.data = newPendingData;
        //         yield update({ pendingData: result });
        //     }
        //     // yield update({ pendingData:result });
        // },
        *getTaskListRight(
            {
                payload: { params }
            },
            { call, put, take, select, update }
        ) {
            const { PerformApprovalCount } = yield select(state => state.approvalModel);
            //待审批
            if (params.pageIndex == 1) {
                yield update({ pendingData: { status: -1 } });
            }

            //post请求
            const result = yield call(authService.axiosAuthPost, api.approval.pending, params);
            if (params.pageIndex == 1) {
                if (result && result.status == 200 && result.data.Datas.length == 0) {
                    result.status = 0;
                }
                let workBenchCount = PerformApprovalCount;
                if (params.type == '0') {
                    workBenchCount = SentencedToEmpty(result,['data','Total'],0);
                }
                yield update({ pendingData: result, PerformApprovalCount: workBenchCount});
            } else {
                const { pendingData } = yield select(state => state.approvalModel);
                let newPendingData = SentencedToEmpty(pendingData,['data','Datas'],[]);
                newPendingData = newPendingData.concat(result.data.Datas);
                // todoData.data.data.concat(result.data.data)
                result.data.Datas = newPendingData;
                let workBenchCount = PerformApprovalCount;
                if (params.type == '0') {
                    workBenchCount = result.data.Total
                }
                yield update({ pendingData: result, PerformApprovalCount: workBenchCount });
            }
            // yield update({ pendingData:result });
        },
        *examApplication(
            {
                payload: { params, callback }
            },
            { call, put, take, update }
        ) {
            yield update({approvalStatue:{status:-1}})
            const result = yield call(authService.axiosAuthPost, api.approval.ExamApplication, params);
            yield update({approvalStatue:result})
            if (result && result.status == 200) {
                callback();
            } else {
                ShowToast('审批提交失败');
            }
        },
        //获取单个任务的审批详情
        *getTaskListRightByTaskID(
            {
                payload: { params, callback }
            },
            { call, put, take, update }
        ) {
            const result = yield call(authService.axiosPost, api.approval.GetTaskListRightByTaskID, params);
            if (result && result.status == 200 && result.data.data.length > 0) {
                callback(result.data.data[0]);
            } else {
                ShowToast('获取审批信息失败');
            }
        }
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({
                HistoryData: ({ params }) => {}
            });
        }
    }
});
