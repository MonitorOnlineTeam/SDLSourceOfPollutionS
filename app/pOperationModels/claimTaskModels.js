/*
 * @Description: 校准任务任务测试相关接口
 * @LastEditors: hxf
 * @Date: 2021-10-13 10:33:09
 * @LastEditTime: 2023-06-26 14:08:31
 * @FilePath: /SDLMainProject36/app/pOperationModels/claimTaskModels.js
 */
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'claimTaskModels',
    state: {
        searchWord:'',
        claimTaskResultWater:{status:-1},
        claimTaskResultGas:{status:-1},
        receivingRecordListResult:{status:-1},
        tabPageIndex:0,
        operationPhoneExpirePointListResult:{status : -1},// 运维到期点位统计
        selectedTaskType:1, //1 废气巡检 3 废气校准 7 废水巡检 9 废水校准
        unclaimedGasTaskCountResult:{status:-1}, // 领取工单，工单类型计数器
        unclaimedWaterTaskCountResult:{status:-1}, // 领取工单，工单类型计数器
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取待领取列表
         * @param {*} param0
         * @param {*} param1
         */
        *getUnclaimedTaskList(
            {
                payload: { params,callback=()=>{} }
            },
            { call, put, take, update, select }
        ) {
            let beginTime = new Date().getTime();
            const { searchWord, selectedTaskType } = yield select(state=>state.claimTaskModels);
            params.PointName = searchWord;
            params.TaskType = selectedTaskType;
            // 宝武领取工单的任务类型
            /**
             * TaskType
                废水： 9-校准		7-巡检
                cems：3-校准		1-巡检
             */
            const result = yield call(authService.axiosAuthPost, api.waterhome.GetUnclaimedTaskList, params);
            if (params.PollutantType == 1) {
                yield update({ claimTaskResultWater:result });
            } else if (params.PollutantType == 2) {
                yield update({ claimTaskResultGas:result });
            }
            let endTime = new Date().getTime();
            callback(SentencedToEmpty(result,['data','Datas'],[]),(endTime-beginTime));
        },
        /**
         * 获取待领取列表
         * @param {*} param0
         * @param {*} param1
         */
        *getUnclaimedTaskCount(
            {
                payload: { params,callback }
            },
            { call, put, take, update, select }
        ) {
            // let beginTime = new Date().getTime();
            yield update({ unclaimedTaskCountResult:{status:-1} });
            // const { searchWord } = yield select(state=>state.claimTaskModels);
            // params.PointName = searchWord;
            const result = yield call(authService.axiosAuthPost, api.waterhome.GetUnclaimedTaskCount, params);
            
            if (params.PollutantType == 1) {
                yield update({ unclaimedWaterTaskCountResult:result });
            } else if (params.PollutantType == 2) {
                yield update({ unclaimedGasTaskCountResult:result });
            }
            // yield update({ unclaimedTaskCountResult:result });
            // if (params.PollutantType == 1) {
            //     yield update({ claimTaskResultWater:result });
            // } else if (params.PollutantType == 2) {
            //     yield update({ claimTaskResultGas:result });
            // }
            // let endTime = new Date().getTime();
            // callback(SentencedToEmpty(result,['data','Datas'],[]),(endTime-beginTime));
        },
        /**
             * GetReceivingRecordList 获取待领取记录
             * params = {
                BeginTime,
                EndTime
               }
        */
        *getReceivingRecordList(
            {
                payload: { params,success=()=>{},failure=()=>{} }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.waterhome.GetReceivingRecordList, params);
            if (result.status == 200) {
                yield update({ receivingRecordListResult:result });
            }
        },
        /**
             * ReceiveTask  领取任务/弃领任务
                参数  Type（1、领取；2、弃领） TaskID
        */
        *receiveTask(
            {
                payload: { params,success=()=>{},failure=()=>{}}
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.waterhome.ReceiveTask, params);
            if (result.status == 200) {
                yield update({ receivingRecordListResult:result });
                success();
            } else {
                yield update({ receivingRecordListResult:result });
                failure();
            }
        },
        /**
             * getOperationPhoneExpirePointList  运维提醒分析
                参数  Type（1、领取；2、弃领） TaskID
        */
        *getOperationPhoneExpirePointList(
            {
                payload: { params,success=()=>{},failure=()=>{}}
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.waterhome.GetOperationPhoneExpirePointList, params);
            if (result.status == 200) {
                yield update({ operationPhoneExpirePointListResult:result });
                success();
            } else {
                yield update({ operationPhoneExpirePointListResult:result });
                failure();
            }
        },
        /**
            * getCalibrationTaskStatus  判断站点是否可以创建校准任务
            1、已领取未完成 2、未领取 0、可以创建
        */
        *getCalibrationTaskStatus(
            {
                payload: { params,success=()=>{},failure=()=>{}}
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.waterhome.GetCalibrationTaskStatus, params);
            if (result.status == 200) {
                success(result.data.Datas);
            } else {
                failure();
            }
        },
    },

    subscriptions: {}
});
