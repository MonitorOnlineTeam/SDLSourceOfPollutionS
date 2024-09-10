import { createAction, NavigationActions, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { getToken } from '../../dvapack/storage';
import { GetRepairList, GetBdEquipmentCode, GetBdStandardGasCode, GetPatrolList, GetBdList } from '../../utils/formutils';
import moment from 'moment';

/**
 * 故障记录表
 *
 */
export default Model.extend({
    namespace: 'equipmentFautModel',
    state: {
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
        faultRecordParamesResult: { status: -1 }, // 获取设备参数类别与异常类别接口
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },

    effects: {
        /** 提交表单信息 */
        *saveForm(
            {
                payload: { params, callback }
            },
            { call, put, update, take, select }
        ) {
            const { BaseInfo } = yield select(state => state.equipmentFautModel);
            yield update({ editstatus: { status: -2 } });

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddEquipmentFaultForm, params);

            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    //刷新任务详情的信息
                    // 不刷新表单详情
                    // yield put(createAction('getForm')({ params: { TypeID: BaseInfo.TypeID }, callback }));
                    // yield take('getForm/@@end');
                    //关闭等待进度
                    yield update({ editstatus: result });
                    yield put(NavigationActions.back());
                    callback();
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
                payload: { params, callback = () => { } }
            },
            { call, put, update, select, take }
        ) {
            yield update({ liststatus: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            params = { TaskID: taskDetail.ID, TypeID: params.TypeID };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetEquipmentFaultRecord, params);
            // const result = yield call(formSers.GetBdRecord, params);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    //数据不为空
                    let BaseInfo = data.Record; //基本信息
                    let MainInfo = { ...data.Record.Content }; //主表信息
                    if (SentencedToEmpty(MainInfo, ['EndTime'], '') == '') {
                        MainInfo.EndTime = moment().format('YYYY-MM-DD HH:00:00');
                    }
                    let RecordList = [];
                    RecordList = SentencedToEmpty(data, ['Record', 'RecordList'], []);
                    let List = [].concat(RecordList); //将码表数据和已经填写的项目组合成界面需要的数据

                    /**
                     * 返回 true 则请求状态由页面更新
                     */
                    const updateStatus = callback(BaseInfo, result);//liststatus
                    let logObject = {};
                    logObject.params = params;
                    logObject.result = SentencedToEmpty(result, ['data', 'Datas'], {});
                    logObject._response = SentencedToEmpty(result, ['request', '_response'], '-');
                    if (moment(SentencedToEmpty(MainInfo, ['BeginTime'], '')).isValid()) {
                        logObject.isValid = true;
                    }
                    // yield put(createAction('app/addClockInLog')({
                    //     //提交异常日志
                    //     msg: `${JSON.stringify(logObject)}`
                    // }))
                    if (updateStatus) {
                        //返回 true 则请求状态由页面更新
                        yield update({ BaseInfo, MainInfo, RecordList: RecordList, List });
                    } else {
                        yield update({ BaseInfo, MainInfo, RecordList: RecordList, List, liststatus: result });
                    }
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
        /**
         * 获取设备参数类别与异常类别接口
         * @param {*} param0 
         * @param {*} param1 
         */
        *getFaultRecordparames(
            {
                payload: { params, callback }
            },
            { call, put, update, select, take }
        ) {
            yield update({ faultRecordParamesResult: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            // const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetFaultRecordparames, {}, `DGIMN=${taskDetail.DGIMN}`);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetFaultRecordparames, { dgimn: taskDetail.DGIMN });
            // const result = yield call(authService.axiosAuthPost123, api.pOperationApi.OperationForm.GetFaultRecordparames, "DGIMN=wrwrsfs23424");
            yield update({ faultRecordParamesResult: result });
        },
        /** 删除表单 */
        *delForm(
            {
                payload: { params, callback }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { BaseInfo } = yield select(state => state.equipmentFautModel);
            if (BaseInfo && BaseInfo.ID) {
                //已经保存 执行删除方法 并刷新上一个页面
                params = { TaskID: taskDetail.ID, TypeID: BaseInfo.TypeID };
                // const result = yield call(formSers.DeleteBdRecord, params);
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteEquipmentFaultForm, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        //更新相关显示内容
                        // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                        // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                        yield put(NavigationActions.back());
                        yield update({ editstatus: { status: 200 } });
                        callback();
                    } else {
                        //关闭进度条
                        yield update({ editstatus: { status: 200 } });
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    // yield update({ liststatus: 'ok' });
                    yield update({ editstatus: { status: 200 } });
                    ShowToast('网络异常，删除失败');
                }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                yield update({ editstatus: { status: 200 } });
                yield put(NavigationActions.back());
            }
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
    }
});
