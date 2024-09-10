import { createAction, NavigationActions, delay, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList, GetPatrolList } from '../../utils/formutils';
import moment from 'moment';
import { getToken } from '../../dvapack/storage';

/**
 * 巡检表单
 * LSK
 */
export default Model.extend({
    namespace: 'patrolRecordModel',
    state: {
        //填写state
        editstatus: 'loading',
        //表单基本信息
        BaseInfo: {
            ID: '',
            TaskID: '',
            TypeID: '',
            CreateUserID: '',
            RecordList: [],
            SignContent: null,
            SignTime: null
        },
        //表单主表信息
        MainInfo: {
            EnterpriseName: '',
            PointPosition: '',
            MaintenanceManagementUnit: '',
            PatrolDate: '',
            GasCemsEquipmentManufacturer: '',
            GasCemsCode: '',
            KlwCemsEquipmentManufacturer: '',
            KlwCemsCode: '',
            ExceptionHandling: '',
            Remark1: '',
            Remark2: '',
            Remark3: '',
            Remark4: '',
            Remark5: '',
            Remark6: '',
            Remark7: ''
        },
        //表单附表信息
        RecordList: {},
        //界面展示的信息
        List: [],
        //码表
        Code: [],
        //表单类型
        TypeID: ''
    },

    reducers: {
        /** 保存附表信息 */
        saveItem(
            state,
            {
                payload: { params }
            }
        ) {
            const RecordList = state.RecordList;
            //选择为空时候删除该附表信息
            if (params.MintenanceDescription == '') {
                for (let i = 0; i < RecordList.length; i++) {
                    if (RecordList[i].ItemID == params.ItemID) {
                        RecordList.splice(i, 1);
                        break;
                    }
                }
            }
            //选择不为空时候修改该附表信息
            let i = 0;
            for (i = 0; i < RecordList.length; i++) {
                if (RecordList[i].ItemID == params.ItemID) {
                    RecordList.splice(i, 1, params);
                    break;
                }
            }
            //附表信息中无这条信息 插入
            if (i == RecordList.length) RecordList.push(params);
            return { ...state, ...{ RecordList } };
        },

        /** 保存主表信息 */
        saveMainInfo(
            state,
            {
                payload: { params }
            }
        ) {
            let MainInfo = state.MainInfo;
            MainInfo = { ...MainInfo, ...params };
            return { ...state, ...{ MainInfo } };
        },

        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },

    effects: {
        /** 提交表单信息 */
        *saveForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -1 } });
            const { TypeID, BaseInfo, MainInfo, RecordList } = yield select(state => state.patrolRecordModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            user = getToken();
            //修改基础信息
            BaseInfo.CreateUserID = user.User_ID;
            BaseInfo.TaskID = taskDetail.ID;
            //加上主表信息
            BaseInfo.Content = MainInfo;
            //加上附表信息
            BaseInfo.RecordList = RecordList;
            BaseInfo.TypeID = TypeID; //不设置正确的巡检单类型，接口返回成功，但是任务存储失败
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddPatrolRecord, BaseInfo);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }
                    yield put(createAction('getForm')({ params: {} }));
                    yield take('getForm/@@end');
                    //关闭等待进度
                    yield update({ editstatus: result });
                    yield put(NavigationActions.back());
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
            // const result = yield call(formSers.AddPatrolRecord, BaseInfo);
            // if (result && result.requstresult && result.requstresult == 1) {
            //     //提交成功
            //     yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
            //     yield put(createAction('getForm')({ params: {} }));
            //     yield take('getForm/@@end');
            //     yield update({ editstatus: 'ok' });
            //     ShowToast('保存成功');
            // } else if (result && result.requstresult && result.requstresult == 5) {
            //     //网络连接失败
            //     yield update({ editstatus: 'default' });
            //     ShowToast('网络连接失败，请检查');
            // } else {
            //     //发生错误
            //     yield update({ editstatus: 'default' });
            //     ShowToast('发生错误');
            // }
        },

        /** 根据TaskID获取表单信息 */
        *getForm(
            {
                payload: { params }
            },
            { call, put, update, select, take }
        ) {
            yield update({ editstatus: 'loading' });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID } = yield select(state => state.patrolRecordModel);
            params = { TaskID: taskDetail.ID, TypeID: TypeID };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetPatrolRecordList, params);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    //数据不为空
                    let BaseInfo = data.Record; //基本信息
                    let MainInfo = data.Record.Content; //主表信息
                    let RecordList = [];
                    if (data.Record.RecordList) RecordList = data.Record.RecordList; //附表信息
                    let Code = data.Code; //维修项目码表
                    let List = GetPatrolList(RecordList, Code, MainInfo); //将码表数据和已经填写的项目组合成界面需要的数据
                    yield update({ BaseInfo, MainInfo, RecordList, Code, List, editstatus: result });
                } else {
                    //数据获取失败
                    // ShowToast('发生错误');
                    yield update({ liststatus: { status: 1000 } });
                }
            } else {
                //网络异常
                yield update({ liststatus: result });
            }
            // const result = yield call(formSers.GetPatrolRecordList, params);
            // if (result && result.requstresult && result.requstresult == 1) {
            //     //获取数据成功
            //     if (result.data) {
            //         //数据不为空
            //         let BaseInfo = result.data.Record; //基本信息
            //         let MainInfo = result.data.Record.Content; //主表信息
            //         let RecordList = [];
            //         if (result.data.Record.RecordList) RecordList = result.data.Record.RecordList; //附表信息
            //         let Code = result.data.Code; //维修项目码表
            //         let List = GetPatrolList(RecordList, Code, MainInfo); //将码表数据和已经填写的项目组合成界面需要的数据
            //         yield update({ BaseInfo, MainInfo, RecordList, Code, List, editstatus: 'ok' });
            //     } else {
            //         //数据为空
            //         yield update({ editstatus: 'nodata' });
            //     }
            // } else if (result && result.requstresult && result.requstresult == 5) {
            //     //网络连接失败
            //     yield update({ editstatus: 'neterror' });
            // } else {
            //     //发生错误
            //     yield update({ editstatus: 'error' });
            // }
        },

        /** 删除表单 */
        *delForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            console.log('model delForm');
            yield update({ editstatus: 'loading' });
            //接口需要数据 {"TaskID": "sample string 1","TypeID": 2,"DGIMN": "sample string 3"}
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { BaseInfo } = yield select(state => state.patrolRecordModel);
            if (BaseInfo && BaseInfo.ID) {
                //已经保存 执行删除方法 并刷新上一个页面
                params = { TaskID: taskDetail.ID };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeletePatrolRecordList, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        //更新相关显示内容
                        // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                        // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                        yield put(NavigationActions.back());
                        yield update({ List: [], editstatus: result });
                    } else {
                        //关闭进度条
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    // yield update({ liststatus: 'ok' });
                    ShowToast('网络异常，删除失败');
                }
                // const result = yield call(formSers.DeletePatrolRecordList, params);
                // if (result && result.requstresult && result.requstresult == 1) {
                //     //删除成功
                //     yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                //     yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                //     yield put(NavigationActions.back());
                // } else if (result && result.requstresult && result.requstresult == 5) {
                //     //网络连接失败
                //     yield update({ editstatus: 'ok' });
                //     ShowToast('网络异常，删除失败');
                // } else {
                //     //发生错误
                //     yield update({ editstatus: 'ok' });
                //     ShowToast('发生错误，删除失败');
                // }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                yield delay(800); //预防界面变的太快 过于突兀
                yield put(NavigationActions.back());
            }
        },

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
