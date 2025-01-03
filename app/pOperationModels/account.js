/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:15
 * @LastEditTime: 2024-12-25 15:40:17
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/account.js
 */
import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { getToken } from '../dvapack/storage';
import { axiosAuthPost } from '../services/auth';
import JSEncrypt from 'jsencrypt';
import { RSAPubSecret } from '../config';
export default Model.extend({
    namespace: 'account',
    state: {
        Complexity: true,
        userAccount: '',
        emailShow: '',
        accountHeaderId: '',// 我的头部id
        accountOptionList: [],// 我的选项列表
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *methodexample({ payload }, { call, put, take, update, select }) { },
        *SendEmailCode({ payload: { callback = () => { } } }
            , { call, put, take, update, select }) {
            /**
             * payload:{
             *  userAccount:'string',
             * }
             */
            const { userAccount } = yield select(state => state.account);
            const result = yield call(axiosAuthPost, api.changePwd.SendEmailCode, { userAccount });
            callback(result);
        },
        *RetrievePasswordByEmail({ payload: { params, callback = () => { } } }, { call, put, take, update, select }) {
            /**
             * payload:{
                userAccount:'string',
                code:'string',
                password:'string',
             }
             */
            console.log('RetrievePasswordByEmail payload = ', params);
            const result = yield call(axiosAuthPost, api.changePwd.RetrievePasswordByEmail, params);
            callback(result);
        },
        *changePass(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            let { constants } = yield select(state => state.app);
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(RSAPubSecret);
            const LocalPwd = getToken().LocalPwd;
            if (LocalPwd == params.userPwdOld) {
                const result = yield call(axiosAuthPost, api.pollutionApi.Account.ChangePwd, { Pwd: constants.isSecret == true ? encrypt.encrypt(params.userPwdNew) : params.userPwdNew });
                if (result.status == 200) {
                    ShowToast('密码修改成功，请重新登录');
                    yield put({ type: 'login/logout' });
                }
            } else {
                ShowToast('原始密码错误');
            }
            // const result = yield call(authService.axiosPost, api.pollutionApi.Account.ChangePwd, params);
            // if (result.status == 200 && result.data.requstresult == '1') {
            //     ShowToast(result.data.data);
            //     yield put({ type: 'login/logout' });
            // } else {
            //     ShowToast('提交失败');
            // }
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                example: ({ params }) => {
                    dispatch({
                        type: 'methodexample',
                        payload: {}
                    });
                }
            });
        }
    }
});
