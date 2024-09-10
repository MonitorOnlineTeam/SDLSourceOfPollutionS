import { createAction, NavigationActions, delay, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList } from '../../utils/formutils';
import moment from 'moment';
import { getToken } from '../../dvapack/storage';

/**
 * 维修表单
 * LSK
 */
export default Model.extend({
    namespace: 'equipmentAbnormal',
    state: {
        //列表页面state
        liststatus: -1,
        //填写页面state
        commitstatus: 'ok',
        nameCode: [],
        unitCode: [],
        Record: {},
        //表单基本信息
        BaseInfo: {
            ID: '',
            DGIMN: null,
            TaskID: '',
            TypeID: 1,
            CreateUserID: '',
            CreateTime: '',
            RecordList: [],
            SignContent: null,
            SignTime: null
        },
        //表单主表信息
        MainInfo: {
            EnterpriseName: '', //企业名称
            PointPosition: '', //安装地点
            StopSummary: '' //停机情况总结
        },
        //易耗品更换记录列表
        RecordList: []
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 创建修改停机记录
         * @param {*} param0
         * @param {*} param1
         */
        *saveInfo(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            params.TaskID = taskDetail.ID;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeviceExceptionAdd, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }
                    // yield update({ liststatus: result.status });
                    // yield put(NavigationActions.back());
                    ShowToast('提交成功');
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    // yield update({ editstatus: { liststatus: 200 } });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                // yield update({ editstatus: { liststatus: 200 } });
            }
            // const result = yield call(formSers.equipABCommit, params);
            // if (result && result.requstresult && result.requstresult == 1) {
            //     //提交成功
            //     yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: taskDetail.ID }));
            //     yield put(createAction('getForm')({ params: {} }));
            //     yield take('getForm/@@end');
            //     yield update({ liststatus: 'ok' });
            //     ShowToast('保存成功');
            // } else if (result && result.requstresult && result.requstresult == 5) {
            //     //网络连接失败
            //     yield update({ liststatus: 'default' });
            //     ShowToast('网络连接失败，请检查');
            // } else {
            //     //发生错误
            //     yield update({ liststatus: 'default' });
            //     ShowToast('发生错误');
            // }
        },
        *getInfo(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ liststatus: -1 });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            params.TaskID = taskDetail.ID;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeviceExceptionDetail, params);
            // const result = yield call(formSers.equipABRecordDetail, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    yield update({ BaseInfo: result.data.Datas.Record, Record: result.data.Datas.Record, liststatus: result.status });
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    yield update({ editstatus: { status: 200 } });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ editstatus: { status: 200 } });
            }
            // if (result && result.requstresult && result.requstresult == 1) {
            //     //获取数据成功
            //     if (result.data) {
            //         //数据不为空

            //         yield update({ BaseInfo: result.data.record, Record: result.data.Record, liststatus: 'ok' });
            //     } else {
            //         //数据为空
            //         yield update({ liststatus: 'nodata' });
            //     }
            // } else if (result && result.requstresult && result.requstresult == 5) {
            //     //网络连接失败
            //     yield update({ liststatus: 'neterror' });
            // } else {
            //     //发生错误
            //     yield update({ liststatus: 'error' });
            // }
        },
        *delForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ liststatus: -1 });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { BaseInfo } = yield select(state => state.equipmentAbnormal);
            params.TaskID = taskDetail.ID;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeviceExceptionDel, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }

                    yield update({ BaseInfo: {}, Record: {}, liststatus: result.status });
                    ShowToast('表单删除成功');
                    yield put(NavigationActions.back());
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    // yield update({ editstatus: { liststatus: 200 } });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                // yield update({ editstatus: { liststatus: 200 } });
            }
            // const result = yield call(formSers.equipmentABDelete, params);
            // if(result.requstresult == 1){
            //   ShowToast('删除成功')
            //   yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({taskID:taskDetail.ID}));
            //   yield update({RecordList:[]});
            // }else
            // {
            //   ShowToast('删除失败')
            // }

            // if (BaseInfo && BaseInfo.ID) {
            //     //已经保存 执行删除方法 并刷新上一个页面
            //     params = { TaskID: taskDetail.ID };
            //     const result = yield call(formSers.DeletePatrolRecordList, params);
            //     if (result && result.requstresult && result.requstresult == 1) {
            //         //删除成功
            //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: taskDetail.ID })); //删除后刷新前一个页面
            //         yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
            //         yield put(NavigationActions.back());
            //     } else if (result && result.requstresult && result.requstresult == 5) {
            //         //网络连接失败
            //         yield update({ liststatus: 'ok' });
            //         ShowToast('网络异常，删除失败');
            //     } else {
            //         //发生错误
            //         yield update({ liststatus: 'ok' });
            //         ShowToast('发生错误，删除失败');
            //     }
            // } else {
            //     //没有ID 尚未保存 直接返回上一个页面
            //     yield delay(800); //预防界面变的太快 过于突兀
            //     yield put(NavigationActions.back());
            // }
        },
        *delItem(
            {
                payload: { index, record }
            },
            { call, put, update, take }
        ) {},
        *saveItem(
            {
                payload: { index, record }
            },
            { call, put, update, take }
        ) {},

        setupSubscriber({ dispatch, listen }) {
            listen({
                // MyPhoneList: ({ params }) => {
                //   dispatch({
                //     type: 'loadcontactlist',
                //     payload: {
                //     }
                //   });
                // },
            });
        }
    }
});
