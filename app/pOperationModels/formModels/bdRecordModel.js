import { createAction, NavigationActions, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { getToken } from '../../dvapack/storage';
import { GetRepairList, GetBdEquipmentCode, GetBdStandardGasCode, GetPatrolList, GetBdList } from '../../utils/formutils';
import moment from 'moment';

/**
 * CEMS校验测试
 * LSK
 */
export default Model.extend({
    namespace: 'bdRecordModel',
    state: {
        // 标记页面初次加载状态
        initPage: true,
        //填写state
        editstatus: { status: 200 },
        //列表status
        liststatus: { status: -1 },
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
            EnterpriseName: '', //企业名称
            PointPosition: '', //安装地点
            MaintenanceManagementUnit: '', //维护管理单位
            CemsSupplier: '', //CEMS供应商
            CurrentCheckTime: '', //本次校验时间
            LastCheckTime: '', //上次校验时间
            cemsMainInstrumentCode: [], //CEMS主要仪器型号
            standardGas: [], //标气
            cbTestEquipment: [], //参比法测试设备
            CheckConclusionResult1: '', //结论1 如校验合格前对系统进行过处理、调整、参数修改，请说明：
            CheckConclusionResult2: '', //结论2 如校验后，颗粒物测量仪、流速仪的原校正系统改动，请说明：
            CheckIsOk: '', //校验是否合格
            CheckDate: '' //校验日期
        },
        //表单附表信息
        RecordList: [],
        //界面展示的信息
        List: [],
        //标气码表
        standardGas: [],
        //参比法测试设备码表
        cbTestEquipment: [],
        //当前选中的
        selectItem: null,
        // 校验测试所用到的标准气体
        bdSelectedStandardGas: [],
        // 校验测试所用到的设备
        bdSelectedEquipment: [],
        // 增加标准气体/测试设备 保存事件的提交状态
        additionResult: { status: 200 },
        // 子表删除状态
        delSubtableStatus: { status: 200 },
        // 删除 标准气体/测试设备项目
        delAdditionItmeStatus: { status: 200 },
        // 校验日期
        CurrentCheckTime: moment().format('YYYY-MM-DD HH:mm:00')
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
            if (params.TestResult == [] || params.TestResult == null || params.TestResult == '') {
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

        /**选择一条记录 */
        selectItem(
            state,
            {
                payload: { params }
            }
        ) {
            let selextItem = state.List[selectItem];
            return { ...state, ...{ selectItem: selextItem } };
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
            yield update({ editstatus: { status: -2 } });
            const { BaseInfo, MainInfo, RecordList } = yield select(state => state.bdRecordModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            //修改基础信息
            BaseInfo.CreateUserID = user.User_ID;
            BaseInfo.TaskID = taskDetail.ID;
            //加上主表信息
            BaseInfo.Content = MainInfo;
            //加上附表信息
            BaseInfo.RecordList = RecordList;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateBdRecord, BaseInfo);
            let needRefreshTask = false;
            if (!BaseInfo.ID) {
                needRefreshTask = true;
            }
            // const result = yield call(formSers.AddOrUpdateBdRecord, BaseInfo);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    // 本地修改任务详情表单列表状态 9 对比校验
                    yield put(createAction('taskDetailModel/updateFormStatus')({
                        cID: 9
                    }));
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }
                    // if (needRefreshTask) {
                    //     yield put('taskDetailModel/getTaskDetail', { params: {} });
                    // }
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
        },

        /** 最外层提交表单信息 */
        *saveMainForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -2 } });
            const { BaseInfo, MainInfo, RecordList, CurrentCheckTime } = yield select(state => state.bdRecordModel);
            if (CurrentCheckTime == '') {
                ShowToast('校验日期为必填');
                yield update({ editstatus: { status: 200 } });
                return;
            }
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            //修改基础信息
            BaseInfo.CreateUserID = user.User_ID;
            BaseInfo.TaskID = taskDetail.ID;
            //加上主表信息
            MainInfo.CurrentCheckTime = CurrentCheckTime
            BaseInfo.Content = MainInfo;
            //加上附表信息
            BaseInfo.RecordList = RecordList;
            // const result = yield call(formSers.AddOrUpdateBdRecord, BaseInfo);
            let needRefreshTask = false;
            if (!BaseInfo.ID) {
                needRefreshTask = true;
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateBdRecord, BaseInfo);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    // 本地修改任务详情表单列表状态 9 对比校验
                    yield put(createAction('taskDetailModel/updateFormStatus')({
                        cID: 9
                    }));
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }
                    // if (needRefreshTask) {
                    //     yield put('taskDetailModel/getTaskDetail', { params: {} });
                    // }
                    //关闭等待进度
                    yield update({ editstatus: { status: 200 }, liststatus: result });
                    yield put(createAction('getForm')({ params: {} }));
                    yield take('getForm/@@end');
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
        },

        /** 根据TaskID获取表单信息 */
        *getForm(
            {
                payload: { params }
            },
            { call, put, update, select, take }
        ) {
            yield update({ liststatus: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { initPage, List } = yield select(state => state.bdRecordModel);
            params = { TaskID: taskDetail.ID };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetBdRecord, params);
            // const result = yield call(formSers.GetBdRecord, params);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    //数据不为空
                    let BaseInfo = data.Record; //基本信息
                    let MainInfo = data.Record.Content; //主表信息
                    let RecordList = [];
                    if (data.Record.RecordList) RecordList = data.Record.RecordList; //附表信息
                    let Code = data.Code; //校验项目码表
                    let newList = GetBdList(RecordList, Code); //将码表数据和已经填写的项目组合成界面需要的数据
                    if (!initPage) {
                        newList.map((nItem, nIndex) => {
                            // console.log('nItem = ',nItem);
                            List.map((oItem, oIndex) => {
                                if (nItem.ItemID == oItem.ItemID
                                    && !nItem.IsComplete
                                    && nItem.EvaluateResults != 1
                                    && oItem.EvaluateResults == 2
                                ) {
                                    newList[nIndex] = oItem;
                                }
                            });
                        });
                    }
                    let standardGas = GetBdStandardGasCode(data.standardGas);
                    let cbTestEquipment = GetBdEquipmentCode(data.cbTestEquipment);
                    let StandardGasList = data.StandardGasList;
                    let TestEquipmentList = data.TestEquipmentList;
                    yield update({
                        initPage: false, BaseInfo, MainInfo, RecordList, List: newList, standardGas, cbTestEquipment, liststatus: result,
                        bdSelectedStandardGas: StandardGasList,
                        bdSelectedEquipment: TestEquipmentList,
                        CurrentCheckTime: SentencedToEmpty(MainInfo, ['CurrentCheckTime'], '') == '' ? moment().format('YYYY-MM-DD HH:mm:00') : MainInfo.CurrentCheckTime
                    });
                } else {
                    //数据获取失败
                    // ShowToast('发生错误');
                    yield update({ liststatus: { status: 1000 } });
                }
            } else {
                //网络异常
                yield update({ liststatus: result });
            }
        },

        /** 删除表单 */
        *delForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            // yield update({ liststatus: { status: -1 } });
            yield update({ editstatus: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { BaseInfo } = yield select(state => state.bdRecordModel);
            if (BaseInfo && BaseInfo.ID) {
                //已经保存 执行删除方法 并刷新上一个页面
                // params = { TaskID: taskDetail.ID };
                // DType=1 删除主表与子表FormMainID不能为空 
                params = {
                    DType: 1,
                    FormMainID: BaseInfo.ID
                    // TaskID: taskDetail.ID 
                };
                // const result = yield call(formSers.DeleteBdRecord, params);
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteBdRecord, params);
                if (result.status == 200) {
                    //关闭进度条
                    yield update({ editstatus: { status: 200 } });
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        // 本地修改任务详情表单列表状态 9 对比校验
                        yield put(createAction('taskDetailModel/updateFormStatus')({
                            cID: 9, isAdd: false
                        }));
                        //更新相关显示内容
                        // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                        // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                        yield put(NavigationActions.back());
                    } else {
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    yield update({ editstatus: { status: 200 } });
                    ShowToast('网络异常，删除失败');
                }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                // yield delay(800); //预防界面变的太快 过于突兀
                yield update({ editstatus: { status: 200 } });
                yield put(NavigationActions.back());
            }
        },
        /** 删除子表 */
        *delSubtable(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ delSubtableStatus: { status: -2 } });
            const { BaseInfo } = yield select(state => state.bdRecordModel);
            if (BaseInfo && BaseInfo.ID) {
                //已经保存 执行删除方法 并刷新上一个页面
                // params = { TaskID: taskDetail.ID };
                // DType=2 删除子表FormMainID不能为空并且ID不能为空 
                params.DType = 2;
                params.FormMainID = BaseInfo.ID;
                // const result = yield call(formSers.DeleteBdRecord, params);
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteBdRecord, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        //更新相关显示内容
                        // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                        // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                        yield update({ delSubtableStatus: result });
                        yield put('getForm', {});
                        yield put(NavigationActions.back());
                    } else {
                        //关闭进度条
                        yield update({ liststatus: { status: 200 } });
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    // yield update({ liststatus: 'ok' });
                    yield update({ liststatus: { status: 200 } });
                    ShowToast('网络异常，删除失败');
                }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                // yield delay(800); //预防界面变的太快 过于突兀
                yield put(NavigationActions.back());
            }
        },
        /** 
         * 增加 标气记录/测试设备记录
         */
        *addorUpdateCalibrationTestParams(
            {
                payload
            },
            { call, put, update, take, select }
        ) {
            yield update({ additionResult: { status: -1 } })
            /**
             *  ID 有id是修改没有id就是添加
                Name  标识名称或者测试项目名称
                Manufacturer 厂商
                ParamsType  1是标气2是测试设备
                ConcentrationValue 浓度值
                TestMethod 方法依据
                EquipmentModel 设备型号
                FormMainID 主表ID
             */

            const {
                ID = '',
                ParamsType,
                Name,
                ConcentrationValue = '',
                Manufacturer,
                EquipmentModel = '',
                TestMethod = '',
                Unit = '',
            } = payload;
            const { BaseInfo } = yield select(state => state.bdRecordModel);
            let params = {
                ID,
                ParamsType,
                Name,
                ConcentrationValue,
                Manufacturer,
                EquipmentModel,
                TestMethod,
            };
            if (Unit != '') {
                params.Unit = Unit;
            }
            params.FormMainID = BaseInfo.ID
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddorUpdateCalibrationTestParams, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    yield update({ additionResult: result })
                    yield put('getForm', {
                        params: {}
                    });
                    yield put(NavigationActions.back());
                } else {
                    //数据获取失败
                    yield update({ additionResult: result })
                    ShowToast('保存失败');
                }
            } else {
                //网络异常
                yield update({ additionResult: result })
                ShowToast('保存失败');
            }
        },
        *delAdditionItem(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ delAdditionItmeStatus: { status: -1 } });
            //已经保存 执行删除方法 并刷新上一个页面
            // params = { TaskID: taskDetail.ID };
            // DType=3 删除标气与测试设备列表ID不能为空
            params.DType = 3
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteBdRecord, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //删除成功
                    //更新相关显示内容
                    yield update({ delAdditionItmeStatus: result });
                    yield put('getForm', {});
                    yield put(NavigationActions.back());
                } else {
                    //关闭进度条
                    yield update({ delAdditionItmeStatus: { status: 200 } });
                    ShowToast('发生错误，删除失败');
                }
            } else {
                //发生错误
                //关闭进度条
                yield update({ delAdditionItmeStatus: { status: 200 } });
                ShowToast('网络异常，删除失败');
            }
        },
    },
    setupSubscriber({ dispatch, listen }) {
        listen({
            // MyPhoneList: ({ params }) => {
            //   dispatch({`
            //     type: 'loadcontactlist',
            //     payload: {
            //     }
            //   });
            // },
        });
    }
});
