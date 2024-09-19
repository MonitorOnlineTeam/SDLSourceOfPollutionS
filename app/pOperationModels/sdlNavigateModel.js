/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-09-03 13:50:33
 * @LastEditTime: 2024-09-13 14:28:18
 * @FilePath: /SDLMainProject/app/pOperationModels/sdlNavigateModel.js
 */
// sdlNavigate

import { SentencedToEmpty, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import Actions from '../utils/RouterUtils';

export default Model.extend({
    namespace: 'sdlNavigate',
    state: {
        a: '',
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 导航到
         * @param {*} param0
         * @param {*} param1
         */
        *navigate({ payload }, { call, put, update, take, select }) {
            console.log('payload = ', payload);
            Actions.navigate(payload.routeName, {
                params: SentencedToEmpty(payload, ['params'], {})
            });
        },

        /**
         * 重制路由
         * @param {*} param0
         * @param {*} param1
         */
        *reset({ payload }, { call, put, update, take, select }) {
            Actions.reset({
                index: 1,
                routes: [
                    { name: payload.routeName },
                ],
            });
        },
        /**
         * 返回上一级
         * @param {*} param0
         * @param {*} param1
         */
        *back({ payload }, { call, put, update, take, select }) {
            console.log('back effect payload = ', payload);
            Actions.back();
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});