import { createAction, NavigationActions, delay, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList, GetPatrolList } from '../../utils/formutils';
import moment from 'moment';
import { getToken, getEncryptData } from '../../dvapack/storage';

/**
 * 零点量程漂移与校准
 *
 */
export default Model.extend({
    namespace: 'calibrationRecord',
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
            const { RecordList, MainInfo } = yield select(state => state.calibrationRecord);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteJzItem, params);
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
            const { RecordList, MainInfo, TypeID, TaskID } = yield select(state => state.calibrationRecord);
            const body = {
                TypeID:TypeID,
                TaskID:TaskID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetJzItem, body);
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
            const { RecordList, MainInfo } = yield select(state => state.calibrationRecord);
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                // Content: {
                //     EnterpriseName: taskDetail.EnterpriseName,
                //     PointPosition: '', //安装地点
                //     StopSummary: '' //停机情况总结
                // },
                Content: MainInfo,
                // "CreateTime":"2018-12-03 14:50:56",
                // RecordList: RecordList //愿有逻辑，全部提交
                RecordList:submitList  // 新逻辑，只提交一条
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateJzRecord, body);
            yield update({editstatus:{status:200}})
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    yield put(createAction('taskDetailModel/updateFormStatus')({ 
                        cID: 8 }));
                    callback();
                    // let ProxyCode = getEncryptData();
                    // if (ProxyCode == 61002) {
                    //     //对测试库记录，如果出现错误数据，可以查看日志
                    //     yield put(createAction('app/addClockInLog')({//提交异常日志
                    //         msg:`{"target":"saveJzRecordLog","msgType":"SaveJzRecord","taskDetailID":"${taskDetail.ID}","data":${JSON.stringify(body)}}`
                    //     }))
                    // }
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
            const { JzConfigItemSelectedList, JzConfigItemResult } = yield select(state => state.calibrationRecord);
            const body = {
                TaskID: taskDetail.ID
            };
            let index = taskDetail.TaskFormList.findIndex(item => {
                if (item.TypeName == 'JzHistoryList' && item.FormMainID) {
                    return true;
                } else {
                    return false;
                }
            });
            if (index == -1) {
                yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: taskDetail.ID }));
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetJzRecord, body);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    let recordList = [];
                    let updateIndex;
                    if (JzConfigItemSelectedList.length == 0) {
                        recordList = SentencedToEmpty(data, ['Record', 'RecordList'], []);
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
                        if ((a.LdCalibrationIsOk && a.LdCalibrationIsOk != '') || (a.LcCalibrationIsOk && a.LcCalibrationIsOk != '')) {
                            sortA = true;
                        } else {
                            sortA = false;
                        }
                        if ((b.LdCalibrationIsOk && b.LdCalibrationIsOk != '') || (b.LcCalibrationIsOk && b.LcCalibrationIsOk != '')) {
                            sortB = true;
                        } else {
                            sortB = false;
                        }
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
                            MainInfo: SentencedToEmpty(data, ['Record', 'Content'], [])
                        });
                    } else {
                        yield update({
                            liststatus: result,
                            RecordList: recordList,
                            standardGasList: SentencedToEmpty(data, ['Code'], []),
                            unitsList: result.data.Datas.UnitList,
                            TaskID: SentencedToEmpty(data, ['Record', 'TaskID'], []),
                            MainInfo: SentencedToEmpty(data, ['Record', 'Content'], [])
                        });
                    }
                    
                    // let ProxyCode = getEncryptData();
                    // if (ProxyCode == 61002) {
                    //     //对测试库记录，如果出现错误数据，可以查看日志
                    //     yield put(createAction('app/addClockInLog')({//提交异常日志
                    //         msg:`{"target":"saveJzRecordLog","msgType":"GetJzRecord","taskDetailID":"${taskDetail.ID}","data":${JSON.stringify(result)}}`
                    //     }))
                    // }
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
                if (item.TypeName == 'JzHistoryList' && item.FormMainID) {
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
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteJzRecord, body);
            yield update({editstatus:{status:200}})
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //删除成功
                    yield put(createAction('taskDetailModel/updateFormStatus')({ 
                        cID: 8, isAdd:false }));
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
            // const result = yield call(formSers.deleteJzRecord, body);
            // if (result && result.requstresult == 1) {
            //     payload.callback(TaskDetail.ID);
            // }
        },
        *delItem(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            // yield update({editstatus:{status:-1}})
            // const { RecordList } = yield select(state => state.calibrationRecord);
            // let currentItemID = '';
            // RecordList.map((item,index)=>{
            //     currentItemID = '';
            //     currentItemID = item.ItemID;
            //     if (!item.LdCalibrationIsOk
            //         ||item.LdCalibrationIsOk == '') {
            //         RecordList[index] = {
            //             ID: '',
            //             ItemID: currentItemID,
            //             LqNdz: '', //零气浓度值
            //             LdLastCalibrationValue: '', //上一次校准值
            //             LdCalibrationPreValue: '', //校准前
            //             LdPy: '', //零点漂移%F.S.
            //             LdCalibrationIsOk: '', //是否正常
            //             LdCalibrationSufValue: '', //校准后
            //             BqNdz: '', //标气浓度值
            //             LcLastCalibrationValue: '', //量程 上一次校准值
            //             LcCalibrationPreValue: '', //校准前
            //             LcPy: '', //量程漂移%F.S.
            //             LcCalibrationIsOk: '', //是否正常
            //             LcCalibrationSufValue: '', //校准后
            //             FormMainID: '', //主表ID
            //             FxyYl: '', //分析仪原理
            //             FxyLc: '', //分析仪量程
            //             JlUnit: '' //计量单位
            //         }
            //     }
            //     if (item.ItemID == record.ItemID) {
            //         RecordList[index] = {
            //             ID: '',
            //             ItemID: record.ItemID,
            //             LqNdz: '', //零气浓度值
            //             LdLastCalibrationValue: '', //上一次校准值
            //             LdCalibrationPreValue: '', //校准前
            //             LdPy: '', //零点漂移%F.S.
            //             LdCalibrationIsOk: '', //是否正常
            //             LdCalibrationSufValue: '', //校准后
            //             BqNdz: '', //标气浓度值
            //             LcLastCalibrationValue: '', //量程 上一次校准值
            //             LcCalibrationPreValue: '', //校准前
            //             LcPy: '', //量程漂移%F.S.
            //             LcCalibrationIsOk: '', //是否正常
            //             LcCalibrationSufValue: '', //校准后
            //             FormMainID: '', //主表ID
            //             FxyYl: '', //分析仪原理
            //             FxyLc: '', //分析仪量程
            //             JlUnit: '' //计量单位
            //         };
            //     }
            // });
            // yield update({ RecordList });
            // yield put(createAction('saveInfo')({ callback }));
            // yield take('saveInfo/@@end');
        },
        *saveItem(
            {
                payload: { index, record, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({editstatus:{status:-2}})
            // const { RecordList } = yield select(state => state.calibrationRecord);
            // let editIndex = RecordList.findIndex((item,index)=>{
            //     return item.ItemID == record.ItemID;
            // })
            // let editIndex = -1;
            // let currentItemID = '';
            // RecordList.map((item,index)=>{
            //     currentItemID = '';
            //     currentItemID = item.ItemID;
            //     // if (item.ItemID == record.ItemID) {
            //     //     editIndex = index;
            //     // }
            //     if (!item.LdCalibrationIsOk
            //         ||item.LdCalibrationIsOk == '') {
            //         RecordList[index] = {
            //             ID: '',
            //             ItemID: currentItemID,
            //             LqNdz: '', //零气浓度值
            //             LdLastCalibrationValue: '', //上一次校准值
            //             LdCalibrationPreValue: '', //校准前
            //             LdPy: '', //零点漂移%F.S.
            //             LdCalibrationIsOk: '', //是否正常
            //             LdCalibrationSufValue: '', //校准后
            //             BqNdz: '', //标气浓度值
            //             LcLastCalibrationValue: '', //量程 上一次校准值
            //             LcCalibrationPreValue: '', //校准前
            //             LcPy: '', //量程漂移%F.S.
            //             LcCalibrationIsOk: '', //是否正常
            //             LcCalibrationSufValue: '', //校准后
            //             FormMainID: '', //主表ID
            //             FxyYl: '', //分析仪原理
            //             FxyLc: '', //分析仪量程
            //             JlUnit: '' //计量单位
            //         }
            //     }
            //     if (item.ItemID == record.ItemID) {
            //         RecordList[index] = record;
            //     }
            // });

            // if (editIndex != -1) {
            //     RecordList[editIndex] = record;
            // }
            // yield update({ RecordList });
            let submitList = [];
            if (record) {
                // submitList.push(record);
                submitList = record;
            } else {
                submitList = null;
            }
            yield put(createAction('saveInfo')({ submitList, callback }));
            yield take('saveInfo/@@end');
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen, take }) {
            listen({
                CalibrationRecordList: ({ params }) => {
                    if (params.TypeName == 'JzHistoryList') {
                        // dispatch({
                        //     type: 'getInfo',
                        //     payload: params
                        // });
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
