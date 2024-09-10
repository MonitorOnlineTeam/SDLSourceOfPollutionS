/*
 * @Description: 宝武相关事件
 * @LastEditors: hxf
 * @Date: 2023-05-06 08:44:32
 * @LastEditTime: 2024-08-14 14:29:29
 * @FilePath: /SDLMainProject37/app/pOperationModels/requestTestModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, bwFormatArray, CloseToast, createAction } from '../utils';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import { getToken } from '../dvapack/storage';

export default Model.extend({
    namespace: 'requestTestModel',
    state: {
        url: '',
        response: '',
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * GetUserOpenID
         * 获取微信openID
         * @param {*} param0
         * @param {*} param1
         */
        * getUserOpenID(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const user = getToken();
            console.log('user = ', user);
            result = yield call(dataAnalyzeAuth.axiosAuthPost, api.wxPush.GetUserOpenID, {
                userID: user.UserId
            });

            console.log('result = ', result);
        },
        /**
         * ResetUserWechatInfo
         * 重制微信注册信息
         * @param {*} param0
         * @param {*} param1
         */
        * resetUserWechatInfo(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const user = getToken();
            console.log('user = ', user);
            result = yield call(dataAnalyzeAuth.axiosAuthPost, api.wxPush.ResetUserWechatInfo, {
                "user_ID": [
                    user.UserId
                ],
            });

            console.log('result = ', result);
        },
        /**
         * TestPushWeChatInfo
         * 发送测试微信消息
         * @param {*} param0
         * @param {*} param1
         */
        * testPushWeChatInfo(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const user = getToken();
            console.log('user = ', user);
            result = yield call(dataAnalyzeAuth.axiosAuthPost, api.wxPush.TestPushWeChatInfo, {
                "userID": user.UserId
            });

            console.log('result = ', result);
        },
        /**
         * testGetBaidu
         * 测试访问百度
         * @param {*} param0
         * @param {*} param1
         */
        * testGetBaidu(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                url: '',
                response: '',
            });
            const result = yield authService.testRequest('https://www.baidu.com', 'get');
            console.log('result = ', result);
            const _result = { ...result };
            delete _result.data;
            delete _result.request;
            yield update({
                url: 'https://www.baidu.com',
                response: JSON.stringify(_result),
            });
            /**
             * http://61.50.135.114:61003/wwwroot/Upload/AppConfig.json
             * http://cs.chsdl.com/%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.html
             * 
             */
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
         * testGetProxy80
         * 测试访问代理80
         * @param {*} param0
         * @param {*} param1
         */
        * testGetProxy80(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                url: '',
                response: '',
            });
            const result = yield authService.testRequest('http://cs.chsdl.com/隐私政策.html', 'get');
            console.log('result = ', result);
            yield update({
                url: 'http://cs.chsdl.com/隐私政策.html',
                response: JSON.stringify(result),
            });
        },
        /**
         * testGetProxy80
         * 测试访问代理80
         * @param {*} param0
         * @param {*} param1
         */
        * testGetProxy5017(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                url: '',
                response: '',
            });
            const result = yield authService.testRequest('https://cs.chsdl.com:5017/', 'get');
            console.log('result = ', result);
            yield update({
                url: 'https://cs.chsdl.com:5017/',
                response: JSON.stringify(result),
            });
        },
        /**
         * testGetDirect80
         * 测试直连访问配置文件80
         * @param {*} param0
         * @param {*} param1
         */
        * testGetDirect80(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                url: '',
                response: '',
            });
            const result = yield authService.testRequest('http://61.50.135.114:61003/wwwroot/Upload/AppConfig.json', 'get');
            console.log('result = ', result);
            yield update({
                url: 'http://61.50.135.114:61003/wwwroot/Upload/AppConfig.json',
                response: JSON.stringify(result),
            });
        },
        /**
         * testGetProxy5017AppConfig
         * 测试访问代理AppConfig
         * @param {*} param0
         * @param {*} param1
         */
        * testGetProxy5017AppConfig(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                url: '',
                response: '',
            });
            const result = yield authService.testRequest('https://cs.chsdl.com:5017/api61000/AppConfig.json', 'get');
            console.log('result = ', result);
            yield update({
                url: 'https://cs.chsdl.com:5017/api61000/AppConfig.json',
                response: JSON.stringify(result),
            });
        },
    },

    subscriptions: {}
});