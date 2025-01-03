import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { getToken } from '../dvapack/storage';
import * as authService from '../services/auth';
import { WindTransform, getWindDirection, getWindSpeed } from '../utils/mapconfig';

export default Model.extend({
    namespace: 'dataForm',
    state: {
        allTypeSummaryList: [],
        allTypeSummaryListResult: [],
        pollutantTypeCode: [],
        pollutantTypeCodeResult: { status: -1 },
        pollutantTypeList: [],
        selectPollutantType: -1,
        selectTimeType: 'HourData',
        time: moment()
            .subtract(1, 'hours')
            .format('YYYY-MM-DD HH:00:00'),
        pointName: '',
        pollutantTypeListResult: { status: -1 },
        dataList: []
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *methodexample({ payload }, { call, put, take, update, select }) { },

        *init({ payload }, { call, put, take, update, select }) {
            yield update({ pollutantTypeCodeResult: { status: -1 }, pollutantTypeListResult: { status: -1 } });
            let { pollutantTypeList } = yield select(state => state.dataForm);
            if (pollutantTypeList.length == 0) {
                yield put({ type: 'getPollutantTypeList', payload: {} });
                yield take('getPollutantTypeList/@@end');
            }
            let { selectPollutantType } = yield select(state => state.dataForm);
            // if (selectPollutantType != -1) {
            yield put({ type: 'getPollutantTypeCode', payload: {} });
            yield take('getPollutantTypeCode/@@end');
            // }
            yield put({ type: 'getData', payload: {} });
        },
        *getData({ payload }, { call, put, take, update, select }) {
            yield update({ allTypeSummaryListResult: { status: -1 } });
            let { selectPollutantType, selectTimeType, pointName, time } = yield select(state => state.dataForm);
            let params = {};
            if (selectTimeType == 'HourData' || selectTimeType == 'DayData') {
                params = {
                    dataType: selectTimeType,
                    pollutantTypes: selectPollutantType,
                    time,
                    pointName
                };
            } else {
                params = {
                    dataType: selectTimeType,
                    isLastest: true,
                    pollutantTypes: selectPollutantType,
                    pointName
                };
            }
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Data.AllTypeSummaryList, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                    let windDirectionCode = getWindDirection(),
                        windSpeedCode = getWindSpeed();
                    data.map((item, index) => {
                        if (SentencedToEmpty(item, [windDirectionCode], '') != '' && (SentencedToEmpty(item, [windSpeedCode], '') != '' || item[windSpeedCode] == 0)) {
                            item[windDirectionCode] = WindTransform(item[windDirectionCode], item[windSpeedCode]);
                        }
                    });
                    if (data.length > 0) {
                        yield update({ allTypeSummaryListResult: result, allTypeSummaryList: data });
                    } else {
                        yield update({ allTypeSummaryListResult: { status: 0 } });
                    }
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    yield update({ allTypeSummaryListResult: result });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ allTypeSummaryListResult: result });
            }
        },
        *setPollutantType({ payload }, { call, put, take, update, select }) {
            yield update({ allTypeSummaryListResult: { status: -1 } });
            let { selectPollutantType } = yield select(state => state.dataForm);
            if (selectPollutantType != -1) {
                yield put({ type: 'getPollutantTypeCode', payload: {} });
                yield take('getPollutantTypeCode/@@end');
            }
            yield put({ type: 'getData', payload: {} });
        },
        *getPollutantTypeList({ payload }, { call, put, take, update, select }) {
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Data.GetPollutantTypeList, {});
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    let pollutantTypeList = [];
                    let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                    if (data.length > 0) {
                        data.map((item, index) => {
                            pollutantTypeList.push({ showValue: SentencedToEmpty(item, ['pollutantTypeName'], '--'), value: SentencedToEmpty(item, ['pollutantTypeCode'], 'pollutantType' + index), selectColor: '#4c9fff' });
                        });
                        yield update({ pollutantTypeListResult: result, pollutantTypeList, selectPollutantType: pollutantTypeList[0].value });
                    } else {
                        yield update({ pollutantTypeListResult: { status: 0 }, pollutantTypeList: [], selectPollutantType: -1 });
                    }
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    yield update({ pollutantTypeListResult: result });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ pollutantTypeListResult: result });
            }
        },
        *getPollutantTypeCode({ payload }, { call, put, take, update, select }) {
            let { selectPollutantType, selectTimeType } = yield select(state => state.dataForm);
            const result = yield call(authService.axiosAuthPost, api.pollutionApi.Data.GetPollutantTypeCode, { pollutantTypes: selectPollutantType });
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    let pollutantTypeCode = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ pollutantTypeCodeResult: result, pollutantTypeCode });
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    yield update({ pollutantTypeCodeResult: result });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ pollutantTypeCodeResult: result });
            }
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                // example: ({ params }) => {
                //     dispatch({
                //         type: 'methodexample',
                //         payload: {}
                //     });
                // }
            });
        }
    }
});
