import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import * as authService from '../services/auth';

export default Model.extend({
    namespace: 'websocket',
    state: {
        // RealTimeAlarms: [{ DGIMN: '62030231jnsp03', ParentCode: '999176e8-c9f1-4907-954e-20f3f65139f2' }, { DGIMN: '62030231jnsp01', ParentCode: '999176e8-c9f1-4907-954e-20f3f65139f2' }, { DGIMN: '51052216080303', ParentCode: '0051264' }]
        RealTimeAlarms: []
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 插入新的报警状态
         * @param {*} param0
         * @param {*} param1
         */
        *addAlarmNotices({ payload }, { call, put, take, update, select }) {
            let { RealTimeAlarms } = yield select(state => state.websocket);
            let newMessage = SentencedToEmpty(payload, ['newMessage'], []);
            let temp = [].concat(RealTimeAlarms).concat(newMessage);
            yield update({
                RealTimeAlarms: temp
            });
            // 频率未知 暂时去掉
            // yield put(
            //     createAction('alarm/getAlarmRecords')({
            //         params: {
            //             BeginTime: moment().format('YYYY-MM-DD 00:00:00'),
            //             EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            //             PageIndex: 1,
            //             PageSize: 20
            //         }
            //     })
            // );
        },
        /**
         * 初始化报警状态
         * @param {*} param0
         * @param {*} param1
         */
        *GetAlarmNotices(
            {
                payload: { isInit = false, callBack = () => { } }
            },
            { call, put, take, update, select }
        ) {
            let params = {
                BeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                EndTime: moment().format('YYYY-MM-DD 23:59:59'),
            };
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.GetSmallBellList, params);
            if (result && result.status == 200) {
                let RealTimeAlarms = SentencedToEmpty(result, ['data', 'Datas'], []);
                yield update({ RealTimeAlarms });
            }
        }
        // *GetAlarmNotices(
        //     {
        //         payload: { isInit = false, callBack = () => { } }
        //     },
        //     { call, put, take, update, select }
        // ) {
        //     let { RealTimeAlarms } = yield select(state => state.websocket);

        //     let params = {
        //         beginTime: moment().format('YYYY-MM-DD 00:00:00'),
        //         endTime: moment().format('YYYY-MM-DD 23:59:59'),
        //         DGIMN: ''
        //     };
        //     const result = yield call(authService.axiosAuthPost, api.pollutionApi.Alarm.GetAlarmNotices, params);
        //     if (result && result.status == 200) {
        //         let newRealTimeAlarms = SentencedToEmpty(result, ['data', 'Datas'], []);
        //         if (isInit) {
        //             newRealTimeAlarms = [].concat(newRealTimeAlarms);
        //         } else {
        //             newRealTimeAlarms = RealTimeAlarms.concat(newRealTimeAlarms);
        //         }

        //         console.log('newRealTimeAlarms' + newRealTimeAlarms);

        //         yield update({
        //             RealTimeAlarms: newRealTimeAlarms
        //         });
        //         callBack();
        //     } else {
        //         yield update({
        //             RealTimeAlarms: []
        //         });
        //         ShowToast('报警状态数据初始化失败');
        //     }
        // }
    },
    subscriptions: {}
});
