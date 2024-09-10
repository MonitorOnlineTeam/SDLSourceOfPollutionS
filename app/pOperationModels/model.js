/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-11-17 13:47:50
 * @LastEditTime: 2024-06-03 16:55:49
 * @FilePath: /SDLMainProject37/app/models/model.js
 */
import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { loadToken, saveRouterConfig } from '../dvapack/storage';
import api from '../config/globalapi';
import { CURRENT_PROJECT } from '../config';
export default Model.extend({
    namespace: 'baseModel',
    state: {
        maintain: false,
        showAdvertising: false,
        maintenanceResult: null
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 检查版本更新
         */
        *chechUpdate({ payload: {
            successCallback = () => { }
            , failureCallback = () => { }
        } }, { call, put, update, take, select }) {
            if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
                const result = yield call(authService.axiosAuthGet, api.pollutionApi.Account.UpdateConfig, {});
                if (result.status == 200 && result.data.IsSuccess == true) {
                    result.data = result.data.Datas;
                    successCallback(result);
                } else {
                    failureCallback('获取更新配置失败');
                }
            } else {
                const result = yield call(authService.checkUpdateUrl, {});
                if (result.requstresult == 0) {
                    failureCallback(result.reason);
                } else if (result.requstresult == 1) {
                    // result.data.maintain = true;
                    // result.data.maintenance = {
                    //     title:'系统维护公告',
                    //     subTitle:'维护时间：9月14日13:30起',
                    //     start:'尊敬的用户',
                    //     content:'我们将于9月14日13:30起进行系统维护，预计完成时间为17:00。维护期间智慧运维APP、公司运维平台、智慧运维小程序将暂停使用，还请您提前做好相关安排，耐心等待。',
                    //     end:'给您带来的不便敬请谅解',
                    //     sender:'智慧环保'
                    // };
                    yield update({
                        maintain: SentencedToEmpty(result, ['data', 'maintain'], false)
                        , maintenanceResult: result
                    })
                    successCallback(result);
                }
            }
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
