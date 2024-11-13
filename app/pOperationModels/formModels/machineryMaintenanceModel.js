import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../../utils';
import * as authService from '../../services/auth';
import { Model } from '../../dvapack';
import { loadToken, saveRouterConfig, getToken } from '../../dvapack/storage';
import api from '../../config/globalapi';
import { createImageUrl, delay } from '../../utils';
import { createFormUrl } from '../../utils/taskUtils';
import { UrlInfo } from '../../config/globalconst';

/**
 * 保养记录表
 * hxf
 */
export default Model.extend({
    namespace: 'machineryMaintenanceModel',
    state: {
        // sparePartsReplace: { status: -1 }, //备品备件记录
        // sparePartsRecord: {}
        machineryMaintenanceReplace: { status: -1 }, //保养记录
        machineryMaintenanceRecord: {}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        //备件表单操作
        *getMaintainRecordDetail(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            //查询备件记录
            yield update({ machineryMaintenanceReplace: { status: -1 } });
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.MaintainRecordDetail, params);
            if (result.status == 200) {
                yield update({ machineryMaintenanceRecord: result.data.Datas.Record, machineryMaintenanceReplace: result });
            } else {
                yield update({ machineryMaintenanceReplace: result });
            }
            //只刷新任务详情的表单列表
            // const { TaskFormList } = yield select(state => state.taskModel);
            // let index = TaskFormList.findIndex(item => {
            //     if (item.TypeName == 'SparePartHistoryList' && item.FormMainID) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // });
            // if (index == -1) {
            //     //表单生成需要更改界面，但是界面刷新textinput的内容会被替换
            //     yield put(createAction('getTaskDetailWithoutTaskDescription')({}));
            // }
            //刷新任务详情的表单列表 完成
        },
        *commitMaintainRecord(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            yield update({ machineryMaintenanceReplace: { status: -1 } });
            //添加备件记录
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.MaintainRecordOpr, params);
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('操作成功');
                yield put(NavigationActions.back());
                yield put(createAction('getMaintainRecordDetail')({ params: { TaskID: params.TaskID } }));
            } else {
                ShowToast('提交失败');
            }
        },
        *deleteMaintainRecord(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            //删除备件记录表单

            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.MaintainRecordDel, params);
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('操作成功');
                yield update({ machineryMaintenanceReplace: { status: 200 } });
                yield put(NavigationActions.back());
                //刷新任务详情
                yield put(createAction('getTaskDetailWithoutTaskDescription')({}));
            } else {
                ShowToast('提交失败');
            }
        }
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
                // }
            });
        }
    }
});
