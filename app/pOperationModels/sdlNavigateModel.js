/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-09-03 13:50:33
 * @LastEditTime: 2024-10-28 10:25:06
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationModels/sdlNavigateModel.js
 */
// sdlNavigate

import { SentencedToEmpty, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import Actions from '../utils/RouterUtils';
import { DeviceEventEmitter } from 'react-native';

export default Model.extend({
    namespace: 'sdlNavigate',
    state: {
        a: '',
        routeList: [],
        currentRoute: '',
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
            const { routeList } = yield select(state => state.sdlNavigate);
            let newList = [...routeList, payload.routeName];
            yield update({
                routeList: newList,
                currentRoute: payload.routeName
            });
            // if (payload.routeName == 'GTaskOfEnterprise') {
            //     DeviceEventEmitter.emit('net401', 'true');
            // }
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
            yield update({
                routeList: [payload.routeName],
                currentRoute: payload.routeName
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
            const { routeList } = yield select(state => state.sdlNavigate);
            routeList.pop();
            let newList = [...routeList];
            yield update({
                routeList: newList,
                currentRoute: routeList[routeList.length - 1]
            });
        },
    },
    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({});
        }
    }
});