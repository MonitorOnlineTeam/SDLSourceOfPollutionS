/*
 * @Description: 校准任务任务测试相关接口
 * @LastEditors: hxf
 * @Date: 2021-10-13 10:33:09
 * @LastEditTime: 2025-01-02 10:43:41
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/SignInTeamStatisticsModel.js
 */
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'SignInTeamStatisticsModel',
    state: {
        teamBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
        teamEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        personalBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
        personalEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        currentUserID: '',
        teamResult: { status: -1 },
        personalResult: { status: -1 },
        statisticsTypeList: [
            { label: '团队统计', value: 'team' },
            { label: '个人统计', value: 'personal' },
        ],// 统计类型列表
        statisticsType: 'team',//统计类型选中状态 team personal
        teamStatisticsType: 'signIn',// signIn noSignIn
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * GetTeamOperationSignIn
         * 团队统计一级页面
         * @param {*} param0
         * @param {*} param1
         */
        * getTeamOperationSignIn(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                teamResult: { status: -1 },
            });
            const {
                teamBeginTime,
                teamEndTime,
            } = yield select(state => state.SignInTeamStatisticsModel);
            let _params = {
                BeginTime: teamBeginTime
                , EndTime: teamEndTime
                // ,UserId
            };
            const result = yield call(dataAnalyzeAuth.axiosAuthPost
                , api.pOperationApi.CommonSignIn.GetTeamOperationSignIn
                , _params);
            yield update({
                teamResult: result
            });
            // if (result.status == 200) {
            //     yield update({
            //         topLevelTypeList: SentencedToEmpty(result
            //             , ['data', 'Datas', 'codeList'], []) // 第一大类数据
            //         , workTypeList: SentencedToEmpty(result
            //             , ['data', 'Datas', 'childList'], []), // 工作类型数据
            //     });
            // } else {
            //     yield update({
            //         topLevelTypeList: [] // 第一大类数据
            //         , workTypeList: [], // 工作类型数据
            //     });
            // }
        },
        /**
         * GetPersonSignList
         * 团队统计二级页面
         * @param {*} param0
         * @param {*} param1
         */
        * getPersonSignList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // personalBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
            //     personalEndTime: moment().format('YYYY-MM-DD 23:59:59'),
            yield update({
                personalResult: { status: -1 },
            });
            const {
                personalBeginTime,
                personalEndTime,
                currentUserID,
            } = yield select(state => state.SignInTeamStatisticsModel);
            let _params = {
                BeginTime: personalBeginTime
                , EndTime: personalEndTime
                , UserId: currentUserID
            };
            const result = yield call(dataAnalyzeAuth.axiosAuthPost
                , api.pOperationApi.CommonSignIn.GetPersonSignList
                , _params);
            yield update({
                personalResult: result
            });
            // if (result.status == 200) {
            //     yield update({
            //         topLevelTypeList: SentencedToEmpty(result
            //             , ['data', 'Datas', 'codeList'], []) // 第一大类数据
            //         , workTypeList: SentencedToEmpty(result
            //             , ['data', 'Datas', 'childList'], []), // 工作类型数据
            //     });
            // } else {
            //     yield update({
            //         topLevelTypeList: [] // 第一大类数据
            //         , workTypeList: [], // 工作类型数据
            //     });
            // }
        },
        /**
         * 企业报警tab计数
         * GetAlarmCountForEnt
         * @param {*} param0
         * @param {*} param1
         */
        * getAlarmCountForEnt(
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
        * getUnclaimedTaskList(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {

        },
    },

    subscriptions: {}
});
