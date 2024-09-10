import { createAction, NavigationActions, Storage, StackActions, ShowToast, openWebSocket, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import api from '../config/globalapi';
import { Model } from '../dvapack';
import moment from 'moment';

export default Model.extend({
    namespace: 'exceptionModel',
    state: {
        CalendarDate: moment().format('YYYY-MM-01 HH:mm:ss'),
        ExceptionCalenderData: [],
        ExceptionCalenderDataResult: {},
        seletedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        StatisticsData: [], //当日运维记录文字总结
        ExceptionTasks: [], //异常任务记录
        FuturePointInfo: [], //待运维企业列表
        StatisticsDataStr: '',
        ExceptionTasksResult: {}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取指定日期的各类任务单书、异常任务列表
         */
        *getTaskInfoByDate({ payload }, { call, put, take, update, select }) {
            let { seletedDate } = yield select(state => state.exceptionModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.GetTaskInfoByDate, {
                CalendarDate: seletedDate
            });
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let StatisticsData = SentencedToEmpty(result, ['data', 'Datas', 'StatisticsData'], []);
                let StatisticsDataStr = '';
                if (StatisticsData.length == 0) {
                    StatisticsDataStr = '';
                } else {
                    StatisticsDataStr = StatisticsData.join(',');
                }
                yield update({
                    StatisticsData,
                    StatisticsDataStr,
                    ExceptionTasks: SentencedToEmpty(result, ['data', 'Datas', 'ExceptionTasks'], []),
                    FuturePointInfo: SentencedToEmpty(result, ['data', 'Datas', 'FuturePointInfo'], []),
                    ExceptionTasksResult: result
                });
            } else {
                yield update({ StatisticsData: [], StatisticsDataStr: '', ExceptionTasks: [], ExceptionTasksResult: result });
            }
        },
        /**
         * 获取指定月份各类异常信息
         * @param {*} param0
         * @param {*} param1
         */
        *getMobileCalendarInfo({ payload }, { call, put, take, update, select }) {
            let { CalendarDate } = yield select(state => state.exceptionModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.GetMobileCalendarInfo, {
                CalendarDate
            });
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let newExceptionCalenderData = SentencedToEmpty(result, ['data', 'Datas', 'futureTimeList'], []);
                // let newExceptionCalenderData = SentencedToEmpty(result, ['data', 'Datas'], []);
                newExceptionCalenderData.map((item, index) => {
                    let date = SentencedToEmpty(item, ['ExcetionDate'], '');
                    if (date != '') {
                        item.date = date;
                        let TaskFlag = SentencedToEmpty(item, ['TaskFlag'], -1);
                        if (TaskFlag == 2) {
                            item.style = { backgroundColor: '#fc953f' };
                        } else if (TaskFlag == 1) {
                            item.style = { backgroundColor: '#4d8ffa' };
                        } else if (TaskFlag == 3) {
                            item.style = { backgroundColor: '#99d55d' };
                        } else {
                            item.style = { backgroundColor: '#00000000' };
                        }
                    }
                });
                yield update({ ExceptionCalenderData: newExceptionCalenderData, ExceptionCalenderDataResult: result });
            }
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
