/*
 * @Description: 设备故障反馈记录
 * @LastEditors: hxf
 * @Date: 2022-02-14 14:49:23
 * @LastEditTime: 2023-12-13 09:42:47
 * @FilePath: /SDLMainProject37/app/pOperationModels/equipmentFailureFeedbackModel.js
 */
import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { loadToken, saveRouterConfig, getToken } from '../dvapack/storage';
import api from '../config/globalapi';
import { createImageUrl, delay } from '../utils';
import { createFormUrl } from '../utils/taskUtils';
import { UrlInfo } from '../config/globalconst';
import moment from 'moment';

export default Model.extend({
    namespace: 'equipmentFailureFeedbackModel',
    state: {
        FaultBTime: moment().subtract(7, 'days').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),// 列表开始时间
        FaultETime: moment().hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss'),// 列表结束时间
        PollutantTypeCode: '0',// 列表污染源类型
        dataArray: {
            ID: '',
            FaultTime: moment().minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
        }, // 可编辑数据
        faultFeedbackParamesResult: { status: -1 },// 设备故障反馈参数
        faultFeedbackListResult: { status: -1 },// 设备故障反馈 记录
        faultFeedbackListTotal: 0,
        faultFeedbackList: [],
        index: 1,
        pageSize: 20,
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取设备故障反馈记录表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getFaultFeedbackList({ payload }, { call, put, update, take, select }) {
            let requestBegin = new Date().getTime();
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { FaultBTime, FaultETime, PollutantTypeCode, index, pageSize, faultFeedbackListResult, faultFeedbackList } = yield select(state => state.equipmentFailureFeedbackModel);
            const { setListData = () => { } } = payload;
            let body = {
                FaultBTime,
                FaultETime,
                pageIndex: index,
                pageSize,
            };
            if (PollutantTypeCode == 1 || PollutantTypeCode == 2) {
                body.PollutantTypeCode = PollutantTypeCode;
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetFaultFeedbackList, body);
            let newData = [];
            if (result.status == 200) {
                if (index == 1) {
                    newData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newData = faultFeedbackList.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
            }

            yield update({
                faultFeedbackList: newData,
                faultFeedbackListResult: result,
                faultFeedbackListTotal: SentencedToEmpty(result, ['data', 'Total'], 0)
            });
            let requestEnd = new Date().getTime();
            setListData(newData, requestEnd - requestBegin);
        },
        /**
         * 获取参数列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getFaultFeedbackParames({ payload: { DGIMN, callback = () => { } } }, { call, put, update, take, select }) {
            let body = {
                DGIMN
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetFaultFeedbackParames, body, `DGIMN=${DGIMN}`);
            if (result.status == 200 && result.data.IsSuccess) {
                callback(result);
            }
            yield update({ faultFeedbackParamesResult: result });
        },
        /**
         * 添加/修改设备故障反馈记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *addFaultFeedback({ payload }, { call, put, update, take, select }) {
            let { selectPointItem } = payload;
            const { dataArray } = yield select(state => state.equipmentFailureFeedbackModel);
            const { selectEnterprise, } = yield select(state => state.app);
            let user = getToken();
            const body = {
                ID: SentencedToEmpty(dataArray, ['ID'], ''),//   id
                DGIMN: selectPointItem.DGIMN,// 排口编号
                CauseAnalysis: SentencedToEmpty(dataArray, ['CauseAnalysis'], ''),//   原因分析
                EquipmentInfoID: SentencedToEmpty(dataArray, ['EquipmentInfoID'], ''),// 是主机就填写ID 否则手动填写
                EquipmentNumber: SentencedToEmpty(dataArray, ['EquipmentNumber'], ''),// 有主机就带出序列号否则为空
                FaultPhenomenon: SentencedToEmpty(dataArray, ['FaultPhenomenon'], ''),// 故障现象
                FaultTime: SentencedToEmpty(dataArray, ['FaultTime'], ''),// 故障时间
                FaultUnitID: SentencedToEmpty(dataArray, ['FaultUnitID'], ''),// 故障单元ID
                ProcessingMethod: SentencedToEmpty(dataArray, ['ProcessingMethod'], ''),// 处理方法
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddFaultFeedback, body);
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('保存成功');
                yield put(NavigationActions.back());
                yield update({ index: 1 });
                yield put('getFaultFeedbackList', {})
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * 删除设备故障反馈记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteFaultFeedback({ payload }, { call, put, update, take, select }) {
            const { ID, callback = () => { } } = payload;
            let body = {
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteFaultFeedback + `?ID=${ID}`, body);
            if (result && result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('设备故障反馈记录删除成功');
                callback();
                yield update({ index: 1 });
                yield put('getFaultFeedbackList', {})
            }
        },
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
                // },
            });
        }
    }
})