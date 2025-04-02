import { createAction, NavigationActions, delay, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList, GetPatrolList } from '../../utils/formutils';
import moment from 'moment';
import { getToken, getEncryptData } from '../../dvapack/storage';
import { dataConsistencyModel } from '../taskModel';

/**
 * 零点量程漂移与校准 淄博 废水
 *
 */
export default Model.extend({
    namespace: 'calibrationRecordZbFs',
    state: {
        //列表页面state
        liststatus: {status:-1},
        //填写页面state
        commitstatus: 'ok',
        editstatus:{status:200}, // 提交状态
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
            MaintenanceManagementUnit: '' //维护单位
        },
        //校准列表
        RecordList: [],
        standardGasList: [], //标准物质名称
        unitsList: [],
        TaskID: '',
        JzConfigItemResult:{status:-1}, // 校准分析仪列表
        JzConfigItemSelectedList:[], // 校准选中的分析仪
        calibrationDataResult:{status:-1}, // 校准数据
        jzDeleteResult:{status:200},// 校准单删除子表 结果
        TypeID:'', // 表单类型
        TaskID:'', // 任务id
        signContent:'',
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 删除分析仪子表记录
         * @param {*} param0
         * @param {*} param1
         */
        *deleteJzItem(
            {
                payload:{params={},callback=()=>{}}
            },
            { call, put, update, take, select }
        ) {
            const { RecordList, MainInfo } = yield select(state => state.calibrationRecordZbFs);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteJzItemZbFs, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    yield update({jzDeleteResult:result});
                    yield put({
                        type: 'getInfo',
                        payload:{}
                    });
                    callback();
                } else {
                    //提交失败
                    ShowToast('删除时出现错误');
                    yield update({ jzDeleteResult:result });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ jzDeleteResult: { status: 200 } });
            }
        },
        /**
         * 获取 分析仪列表
         * @param {*} param0
         * @param {*} param1
         */
        *getJzItem(
            {
                payload={}
            },
            { call, put, update, take, select }
        ) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const { RecordList, MainInfo, TypeID, TaskID,JzConfigItemSelectedList } = yield select(state => state.calibrationRecordZbFs);
            const body = {
                TypeID:TypeID,
                TaskID:TaskID
            }; 
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetJzItemZBCEMSFs, body);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    yield update({JzConfigItemResult:result});
                    yield put({
                        type: 'getInfo',
                        payload:{}
                    });
                } else {
                    //提交失败
                    yield update({ JzConfigItemResult:result });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ editstatus: { status: 200 } });
            }
        },
        /**
         * 创建修改校准记录
         * @param {*} param0
         * @param {*} param1
         */
        *saveInfo(
            {
                payload: { index, record, callback, submitList=[] }
            },
            { call, put, update, take, select }
        ) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const { RecordList, MainInfo } = yield select(state => state.calibrationRecordZbFs);
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                Content: MainInfo,
                RecordList:submitList  // 新逻辑，只提交一条
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateJzRecordZbFs, body);
            yield update({editstatus:{status:200}})
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    yield put(createAction('taskDetailModel/updateFormStatus')({ 
                        cID: 81 }));
                        callback && callback();
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

            // const result = yield call(formSers.addOrUpdateJzRecord, body);
            // if (result.requstresult == 1) {
            //     callback();
            // }
        },
        *getInfo({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { JzConfigItemSelectedList, JzConfigItemResult } = yield select(state => state.calibrationRecordZbFs);
            const body = {
                TaskID: taskDetail.ID
            };
            let index = taskDetail.TaskFormList.findIndex(item => {
                if (item.TypeName == 'Fs81' && item.FormMainID) {
                    return true;
                } else {
                    return false;
                }
            });
            if (index == -1) {
                yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: taskDetail.ID }));
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetJzRecordZbFs, body);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    let recordList = [];
                    let updateIndex;
                    if (JzConfigItemSelectedList.length == 0) {
                        recordList = SentencedToEmpty(data, ['Record', 'RecordList'], []);
                        if( recordList?.[0]){
                            let data = [];
                            recordList.map(item=>{
                                data.push({...item,...item?.Data, Data: undefined})
                            })
                            recordList = data
                        }
                        const configItemList = SentencedToEmpty(JzConfigItemResult,['data','Datas'],[]);
                        recordList.map((item,index)=>{
                            updateIndex = configItemList.findIndex((seletedItem,selectedIndex)=>{
                                if (seletedItem.ItemName == item.ItemID) {
                                    return true;
                                }
                            });
                            if (updateIndex != -1) {
                                recordList[index] = {...configItemList[updateIndex],...item};
                            }
                        });
                    } else {
                        recordList = JzConfigItemSelectedList.concat([]);
                        let dataList = SentencedToEmpty(data, ['Record', 'RecordList'], []);
                        if( dataList?.[0]){
                            let data = [];
                            dataList.map(item=>{
                                data.push({...item,...item?.Data, Data: undefined})
                            })
                            dataList = data
                        }
                        dataList.map((item,index)=>{
                            updateIndex = recordList.findIndex((seletedItem,selectedIndex)=>{
                                if (seletedItem.ItemName == item.ItemID) {
                                    return true;
                                }
                            });
                            if (updateIndex != -1) {
                                recordList[updateIndex] = {...recordList[updateIndex],...item};
                            }
                        });
                    }
                    recordList = recordList.sort((a, b) => {
                        let sortA, sortB;
                        // if ((a.LdCalibrationIsOk && a.LdCalibrationIsOk != '') || (a.LcCalibrationIsOk && a.LcCalibrationIsOk != '')) {
                        //     sortA = true;
                        // } else {
                        //     sortA = false;
                        // }
                        // if ((b.LdCalibrationIsOk && b.LdCalibrationIsOk != '') || (b.LcCalibrationIsOk && b.LcCalibrationIsOk != '')) {
                        //     sortB = true;
                        // } else {
                        //     sortB = false;
                        // }
                        if ((sortA && sortB) || (!sortA && !sortB)) {
                            return 0;
                        } else {
                            if (sortA && !sortB) {
                                return 1;
                            } else {
                                return -1;
                            }
                        }
                    });
                    if (JzConfigItemSelectedList.length == 0) {
                        yield update({
                            JzConfigItemSelectedList:recordList,
                            liststatus: result,
                            RecordList: recordList,
                            standardGasList: SentencedToEmpty(data, ['Code'], []),
                            unitsList: result.data.Datas.UnitList,
                            TaskID: SentencedToEmpty(data, ['Record', 'TaskID'], []),
                            MainInfo: SentencedToEmpty(data, ['Record', 'Content'], []),
                            signContent:SentencedToEmpty(data, ['Record', 'SignContent'], '') || '' ,
                        });
                    } else {
                      
                        yield update({
                            liststatus: result,
                            RecordList: recordList,
                            standardGasList: SentencedToEmpty(data, ['Code'], []),
                            unitsList: result.data.Datas.UnitList,
                            TaskID: SentencedToEmpty(data, ['Record', 'TaskID'], []),
                            MainInfo: SentencedToEmpty(data, ['Record', 'Content'], []),
                            signContent:SentencedToEmpty(data, ['Record', 'SignContent'], '') || '' ,
                        });
                    }
                    
                } else {
                    //数据获取失败
                    // ShowToast('发生错误');
                    yield update({ liststatus: { status: 1000 } });
                }
            } else {
                //网络异常
                // ShowToast('网络异常');
                yield update({ liststatus: result });
            }
        },
        *checkDelForm({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let index = taskDetail.TaskFormList.findIndex(item => {
                if (item.TypeName == 'Fs81' && item.FormMainID) {
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
            yield update({editstatus:{status:-1}})
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let body = {
                TaskID: taskDetail.ID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteJzRecordZbFs, body);
            yield update({editstatus:{status:200}})
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //删除成功
                    yield put(createAction('taskDetailModel/updateFormStatus')({ 
                        cID: 81, isAdd:false }));
                    payload.callback(taskDetail.ID);
                } else {
                    //删除失败
                    ShowToast('发生错误');
                    yield update({ editstatus: { status: 200 } });
                }
            } else {
                //网络异常删除失败
                ShowToast('网络连接失败，请检查');
                yield update({ editstatus: { status: 200 } });
            }

        },
        *saveItem(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({editstatus:{status:-2}})
            let submitList = [];
            if (record) {
                submitList = record;
            } else {
                submitList = null;
            }
            yield put(createAction('saveInfo')({ submitList, callback }));
            yield take('saveInfo/@@end');
        },
        *addOrUpdateSign({ payload,callback }, { call, put, update, take, select }) {
            const user = getToken();
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { MainInfo } = yield select(state => state.calibrationRecordZbFs);
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                Content: MainInfo,
                ...payload,
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateJzRecordZbFs, body);
            if (result.status == 200) {
                ShowToast(result?.data?.Message || '提交签名成功');
            } else {
                ShowToast(result?.data?.Message || '网络连接失败，请检查');
            }
            payload.callback &&  payload.callback()
        },
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen, take }) {
            listen({
                CalibrationRecordListZbFs: ({ params }) => {
                    if (params.TypeName == 'Fs81') {
                        dispatch({
                            type: 'getJzItem',
                            payload: params
                        });
                    }
                }
            });
        }
    }
});
