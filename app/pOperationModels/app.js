import { Model } from '../dvapack';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import { axiosPost } from '../services/auth';
import api from '../config/globalapi';
import { loadToken, saveRouterConfig } from '../dvapack/storage';
import * as authService from '../services/auth';
import moment from 'moment';
export default Model.extend({
    namespace: 'app',
    state: {
        hideStatusBar: false,
        constants: {
            isSecret: false,
            name: '百度'
        },
        networkTest: false,// 是否需要网络测试
        screenOrientation: 'Portrait',// 数据查询 屏幕方向 // Portrait Landscape
        // MenuID: '317a708d-f762-44a3-b27e-a96beffbec65',
        MenuID: '367b3493-d182-4e60-aac9-910a547a9693',
        pointDetailMenuID: '8cb21091-3290-416c-b98c-9002b725f139',
        verifyStateCod: [{ name: '全部', code: '0' }, { name: '无异常', code: '1' }, { name: '有异常', code: '2' }],
        VerifyType: [{ name: '设备故障', code: '1' }, { name: '突发性环境污染', code: '2' }, { name: '区域性污染', code: '3' }, { name: '其他原因', code: '4' }],
        enterpriseData: { status: -1 }, //企业信息
        enterpriseSearchData: { status: -1 }, //搜索企业信息
        noticeData: { status: -1 }, //通知消息
        selectEnterprise: { EntName: '请选择' }, //选择的企业
        homeData: { status: -1 },
        taskType: { status: -1 }, //任务的类型数据
        noticeMessageInfoListIndex: 1, //通知记录数据页码
        noticeMessageInfoListTotal: 0, //通知记录数据总数
        noticeMessageInfoListResult: { status: -1 }, //通知记录数据请求结果
        noticeMessageInfoListData: [], //通知记录的数据

        pointListByEntResult: { status: 200 },
        operationSettingResult: null, // 运维配置信息
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * GetOperationSetting
         * 运维APP上是否允许申请巡检工单
         * @param {*} param0 
         * @param {*} param1 
         */
        *getOperationSetting(
            {
                payload: { params, successMsg = '申请提交成功', errorMsg = '提交失败', backViewFun = () => { } }
            },
            { call, put, take, update }
        ) {
            //运维APP上是否允许申请巡检工单
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.General.GetOperationSetting, {});
            // result.data.Datas.InspectionType = 1; // 测试用
            yield update({ operationSettingResult: result });
        },
        /**
         * 记录日志
         * AddClockInLog
         * @param {*} param0 
         * @param {*} param1 
         */
        *addClockInLog({ payload }, { call, put, take, update }) {
            const { msg = '' } = payload;
            const result = yield call(authService.axiosAuthPost, api.operationaccount.AddClockInLog, {
                'Msg': msg
            });
        },
        /**
         * 获取任务类型
         * 用于任务审批
         * @param {*} param0 
         * @param {*} param1 
         */
        *getTaskType({ payload }, { call, put, take, update }) {
            //所有任务类型

            yield update({ taskType: { status: -1 } });
            //post请求
            const result = yield call(authService.axiosPost, api.operationaltasks.TaskType);
            if (result.status == 200) {
                let newTypeData = result.data.data;
                newTypeData.unshift({ ContentTypeName: '全部类型', ID: '' });
                result.data.data = newTypeData;
            }
            yield update({ taskType: result });
        },
        /**
         * 检查版本更新
         */
        *chechUpdate({ payload }, { call, put, update, take, select }) {
            const result = yield call(authService.checkUpdateUrl, {});
            if (result.requstresult == 0) {
                payload.failureCallback(result.reason);
            } else if (result.requstresult == 1) {
                payload.successCallback(result);
            }
        },
        *getEnterpriseType(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            let enterArr = [];
            //获取企业列表
            yield update({ enterpriseData: { status: -1 } });
            //post请求
            const result = yield call(authService.axiosAuthGet, api.pollutionApi.PointInfo.CreatTaskTarget, null, `targetType=${params.targetType}&&strName=`);
            if (result.status == 200) {
                result.data.Datas.map(item => {
                    item.EntName = item.Name;
                    enterArr.push(item);
                });
                result.data.data = enterArr;
            }
            yield update({ enterpriseData: result });
        },
        *searchEnterpriseType(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            let enterArr = [];
            //搜索企业
            yield update({ enterpriseSearchData: { status: -1 } });
            const result = yield call(authService.axiosAuthGet, api.pollutionApi.PointInfo.CreatTaskTarget, null, `targetType=${params.targetType}&&strName=${params.EntName}`);
            if (result.status == 200) {
                result.data.Datas.map(item => {
                    item.EntName = item.Name;
                    enterArr.push(item);
                });
                result.data.data = enterArr;
            }
            yield update({ enterpriseSearchData: result });
        },
        /**
         * 根据企业code获取站点列表
         *
         * params 中为entCode
         * @param {*} {
         *                 payload: { params }
         *             }
         * @param {*} { call, put, take, update, select }
         */
        *getPointListByEntCode(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            yield update({ pointListByEntResult: { status: -1 } });
            const { entCode, source, callback } = params;

            const { selectEnterprise } = yield select(state => state.app);
            let newSelectEnterprise = { ...selectEnterprise };
            const result = yield call(authService.axiosAuthGet, api.pollutionApi.PointInfo.GetPoints, null, `monitorTargetId=${entCode}`);
            if (result.status == 200) {
                newSelectEnterprise.PointList = result.data.Datas;
                callback(result.data.Datas);
            }
            yield update({ selectEnterprise: newSelectEnterprise, pointListByEntResult: { status: 200 } });
        },
        *getWorkbenchInfo(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            //主页代办之类请求
            if (params.showRef == true) {
                yield update({ homeData: { status: -1 } });
            }
            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetWorkbenchInfo);

            yield update({ homeData: result });
            const { noticeCallback = () => { } } = params;
            noticeCallback(SentencedToEmpty(result, ['data', 'Datas', 'ExistsNewNotice'], false));
            yield put(
                createAction('alarm/getAlarmCount')({
                    params: {
                        alarmType: 'WorkbenchOver'
                    }
                })
            );
            yield put(
                createAction('alarm/getAlarmCount')({
                    params: {
                        alarmType: 'WorkbenchException'
                    }
                })
            );
            yield put(
                createAction('alarm/getAlarmCount')({
                    params: {
                        alarmType: 'WorkbenchMiss'
                    }
                })
            );
            yield put(
                createAction('alarm/getAlarmCount')({
                    params: {
                        alarmType: 'OverWarning'
                    }
                })
            );
            // 工作台待审批计数
            yield put(
                createAction('approvalModel/getTaskListRight')({
                    params: {
                        type: '0',
                        pageIndex: 1,
                        pageSize: 10
                    }
                })
            );
        },
        *getNoticeMessageInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { noticeMessageInfoListIndex, noticeMessageInfoListTotal, noticeMessageInfoListData } = yield select(state => state.app);
            let requestBegin = new Date().getTime();

            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetNoticeMessageInfoList, params);

            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = noticeMessageInfoListData;
            if (status == 200) {
                if (noticeMessageInfoListIndex == 1) {
                    newMoData = noticeMessageInfoListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ noticeMessageInfoListData: newMoData, noticeMessageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], []), noticeMessageInfoListResult: result });
                } else {
                    newMoData = noticeMessageInfoListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ noticeMessageInfoListData: newMoData, noticeMessageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], []), noticeMessageInfoListResult: result });
                }
            } else {
                yield update({
                    noticeMessageInfoListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
