/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-09-29 14:28:11
 * @LastEditTime: 2024-07-01 19:07:34
 * @FilePath: /SDLMainProject37_1/app/models/helpCenter.js
 */
import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { getToken, loadToken, saveRouterConfig } from '../dvapack/storage';
import api from '../config/globalapi';
import { CURRENT_PROJECT } from '../config';
export default Model.extend({
    namespace: 'helpCenter',
    state: {
        noticeContentPageIndex: 1,
        noticeContentPageSize: 20,
        noticeContentResult: { status: -1 },
        noticeContentData: [],
        noticeContentTotal: 0,

        firstLevel: 515,
        helpCenterPageIndex: 1,
        helpCenterPageSize: 20,
        helpCenterResult: { status: -1 },
        QuestionDetialListResult: { status: -1 },
        helpCenterData: [],
        helpCenterTotal: 0,
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 帮助中心
         * 帮助中心 一级
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getHelpCenterList({ payload: {
            params,
            setListData = data => { },
            successCallback = () => { }
            , failureCallback = () => { }
        } }, { call, put, update, take, select }) {
            let requestBegin = new Date().getTime();
            const {
                helpCenterPageIndex,
                helpCenterPageSize,
                helpCenterData,
                firstLevel
            } = yield select(state => state.helpCenter);
            // let hasSecondLevel = params.hasOwnProperty('secondLevel');
            let hasSecondLevel = params.hasOwnProperty('firstLevel');
            let hasQuestionName = params.hasOwnProperty('QuestionName');
            let requestParams = {
                pageIndex: helpCenterPageIndex,
                pageSize: helpCenterPageSize,
                // firstLevel,
            };
            let url = '';
            if (hasSecondLevel || hasQuestionName) {
                url = api.pollutionApi.Account.GetQuestionDetialList;
                requestParams.appStatus = 1;
            } else {
                url = api.pollutionApi.Account.GetHelpCenterList;
            }

            requestParams = { ...requestParams, ...params };
            const result = yield call(authService.axiosAuthPost, url, requestParams);
            if (hasSecondLevel || hasQuestionName) {
                let newDatas = [];
                if (helpCenterPageIndex == 1) {
                    newDatas = SentencedToEmpty(result, ['data', 'Datas']);
                    yield update({
                        QuestionDetialListResult: result
                        , helpCenterTotal: SentencedToEmpty(result, ['data', 'Total'])
                        , helpCenterData: newDatas
                    });
                } else {
                    newDatas = helpCenterData.concat(SentencedToEmpty(result, ['data', 'Datas'], []))
                    yield update({
                        QuestionDetialListResult: result
                        , helpCenterData: newDatas
                    });
                }
                let requestEnd = new Date().getTime();
                setListData(newDatas, requestEnd - requestBegin);
            } else {
                if (result.status == 200
                    && SentencedToEmpty(result
                        , ['data', 'Datas', 'appPage', 'children', 0, 'contentList'], []).length == 0
                    && SentencedToEmpty(result
                        , ['data', 'Datas', 'appPage', 'children', 1, 'contentList'], []).length == 0) {
                    result.status = 0;
                }
                yield update({ helpCenterResult: result });
            }

        },
        /**
         * 公告列表
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNoticeContentList({ payload: { setListData = data => { } } }, { call, put, update, take, select }) {
            let requestBegin = new Date().getTime();
            const user = getToken();
            const { noticeContentPageIndex,
                noticeContentPageSize,
                noticeContentData, } = yield select(state => state.helpCenter)
            let params = {
                UserID: user.UserId,
                pageIndex: noticeContentPageIndex,
                pageSize: noticeContentPageSize,
                ToppingOrder: 1,// 排序
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetNoticeContentList, params);
            let newDatas = [];
            if (noticeContentPageIndex == 1) {
                newDatas = SentencedToEmpty(result, ['data', 'Datas']);
                yield update({
                    noticeContentResult: result
                    , noticeContentTotal: SentencedToEmpty(result, ['data', 'Total'])
                    , noticeContentData: newDatas
                });
            } else {
                newDatas = noticeContentData.concat(SentencedToEmpty(result, ['data', 'Datas'], []))
                yield update({
                    noticeContentResult: result
                    , noticeContentData: newDatas
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newDatas, requestEnd - requestBegin);
        },
        /**
         * 获取更新信息
         */
        *getEnterpriseType(
            {
                payload: { params }
            },
            { call, put, take, update }
        ) {
            //post请求
            const result = yield call(authService.axiosAuthGet, api.pollutionApi.Account.UpdateConfig, params);
        }
    },
    subscriptions: {}
});
