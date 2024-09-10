import { createAction, NavigationActions, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList } from '../../utils/formutils';
import { getToken } from '../../dvapack/storage';

/**
 * 维修表单
 * LSK
 */
export default Model.extend({
    namespace: 'machineHaltRecord',
    state: {
        //列表页面state
        liststatus: { status: -1 },
        //填写页面state
        commitstatus: 'ok',
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
        //停机列表
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
                payload: { index, record, callback, failureBack }
            },
            { call, put, update, take, select }
        ) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const { RecordList } = yield select(state => state.machineHaltRecord);
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                Content: {
                    EnterpriseName: taskDetail.EnterpriseName,
                    PointPosition: '', //安装地点
                    StopSummary: '' //停机情况总结
                },
                // "CreateTime":"2018-12-03 14:50:56",
                RecordList: RecordList
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.PostStopCemsOpr, body);
            if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                callback();
            } else {
                failureBack();
                ShowToast(result.reason);
            }
        },
        *getInfo({ payload }, { call, put, update, take, select }) {
            yield update({ liststatus: { status: -1 } });
            if (payload.createForm) {
                yield update({ RecordList: [] });
            } else {
                // const { BaseInfo, MainInfo, SubInfoList } = yield select(state => state.repairRecordModel);
                const { taskDetail } = yield select(state => state.taskDetailModel);
                const body = {
                    TaskID: taskDetail.ID
                };

                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.PostStopCemsDetail, body);

                let data = {};

                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        data = SentencedToEmpty(result, ['data', 'Datas'], {});
                        //数据不为空
                        let BaseInfo = data.Record; //基本信息
                        let MainInfo = data.Record.Content; //主表信息
                        let SubInfoList = [];
                        if (data.Record.RecordList) SubInfoList = data.Record.RecordList; //附表信息

                        yield update({ RecordList: SubInfoList, liststatus: result });
                    } else {
                        //数据获取失败
                        // ShowToast('发生错误');
                        yield update({ liststatus: { status: 1000 } });
                    }
                } else {
                    //网络异常
                    yield update({ liststatus: result });
                }
            }
        },
        *checkDelForm({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let index = taskDetail.TaskFormList.findIndex(item => {
                if (item.TypeName == 'StopCemsHistoryList' && item.FormMainID) {
                    return true;
                } else {
                    return false;
                }
            });
            if (index != -1) {
                payload.callback();
            } else {
                ShowToast('表单未完全创建无需删除');
            }
        },
        *delForm({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let body = {
                TaskID: taskDetail.ID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.PostStopCemsDel, body);
            if (result && result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                payload.callback(taskDetail.ID);
            }
        },
        *delItem(
            {
                payload: { index, record, callback, failureBack }
            },
            { call, put, update, take, select }
        ) {
            const { RecordList } = yield select(state => state.machineHaltRecord);
            RecordList.splice(index, 1);
            yield update({ RecordList });
            yield put(createAction('saveInfo')({ callback, failureBack }));
            yield take('saveInfo/@@end');
        },
        *saveItem(
            {
                payload: { index, record, callback, failureBack }
            },
            { call, put, update, take, select }
        ) {
            yield update({ liststatus: { status: -2 } });
            const { RecordList } = yield select(state => state.machineHaltRecord);
            if (index == -1) {
                RecordList.push(record);
            } else {
                RecordList[index] = record;
            }
            yield update({ RecordList });
            yield put(createAction('saveInfo')({ callback, failureBack }));
            yield take('saveInfo/@@end');
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                MachineHaltRecord: ({ params }) => {
                    dispatch({
                        type: 'getInfo',
                        payload: params
                    });
                }
            });
        }
    }
});
