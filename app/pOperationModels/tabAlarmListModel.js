/*
 * @Description: 校准任务任务测试相关接口
 * @LastEditors: hxf
 * @Date: 2021-10-13 10:33:09
 * @LastEditTime: 2025-01-02 18:26:20
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/tabAlarmListModel.js
 */
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'tabAlarmListModel',
    state: {
        alarmType: 0,
        alarmTabLoadTimes: 0,// 当第一次启动企业报警tab加载超标报警
        alarmTabBegin: moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
        alarmTabEnd: moment().format('YYYY-MM-DD HH:mm:ss'),
        tabAlarmAllCount: 0,
        dataExceptionCount: 0,
        dataOverHourCount: 0,
        dataOverMinuteCount: 0,

        tabAlarmWarningButton: [],
        tabAlarmOverButton: [],
        tabAlarmMissExceptionButton: [],
        tabAlarmExceptionButton: [],
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 企业报警tab计数
         * GetAlarmCountForEnt
         * @param {*} param0
         * @param {*} param1
         */
        *getAlarmCountForEnt(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const { alarmTabBegin, alarmTabEnd } = yield select(state => state.tabAlarmListModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetAlarmCountForEnt
                , {
                    "beginTime": alarmTabBegin,
                    "endTime": alarmTabEnd,
                });
            if (SentencedToEmpty(result, ['status'], 1000) == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                yield update({
                    tabAlarmAllCount: SentencedToEmpty(result, ['data', 'Datas', 'allCount'], 0),
                    dataExceptionCount: SentencedToEmpty(result, ['data', 'Datas', 'dataExceptionCount'], 0),
                    dataOverHourCount: SentencedToEmpty(result, ['data', 'Datas', 'dataOverHourCount'], 0),
                    dataOverMinuteCount: SentencedToEmpty(result, ['data', 'Datas', 'dataOverMinuteCount'], 0)
                });
            }
        },
        /**
         * 中文注释
         * @param {*} param0
         * @param {*} param1
         */
        *getUnclaimedTaskList(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {

        },
    },

    subscriptions: {}
});
