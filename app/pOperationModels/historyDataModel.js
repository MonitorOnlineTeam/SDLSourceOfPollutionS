/*
 * @Description: 校准任务任务测试相关接口
 * @LastEditors: hxf
 * @Date: 2021-10-13 10:33:09
 * @LastEditTime: 2024-06-26 10:48:36
 * @FilePath: /SDLMainProject37/app/pOperationModels/historyDataModel.js
 */
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'historyDataModel',
    state: {
        showIndex: 0,
        chartOrList: 'chart',
        datatype: '',
        signInType: 0,
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
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
