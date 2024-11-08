/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-08-21 15:00:35
 * @LastEditTime: 2024-11-05 14:09:42
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationModels/login.js
 */
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    clearToken,
    saveSwitchToken,
    loadSwitchToken,
    saveToken,
    saveStorage,
    clearRootUrl,
    loadStorage,
    storageload,
    saveRootUrl,
    saveRouterConfig,
    loadWebsocketToken,
    saveWebsocketToken,
    getWebsocketToken,
    saveEncryptDataWithData,
    getEncryptData
} from '../dvapack/storage';
import JSEncrypt from 'jsencrypt';
import moment from 'moment';

import qs from 'qs';
import { createAction, Storage, ShowToast, openWebSocket, SentencedToEmpty, secondlevelDataHandle } from '../utils';
import { axiosAuthLogin } from '../services/auth';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import api from '../config/globalapi';
import { Model } from '../dvapack';
import { RSAPubSecret, UrlInfo } from '../config/globalconst';
import Actions, { NavigationActions } from '../utils/RouterUtils';
import { addAlias, removeAlias } from 'react-native-alipush';
// import { isSecret } from '../config/globalconfig';
// import { TabBarItem } from 'react-native-vector-icons/Ionicons';
let ws = null;
let _dispatch = null;

const PUB_KEY =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsx1/cEpUmSwUwwPU0SciWcVK\n' +
    'mDORBGwSBjJg8SL2GrCMC1+Rwz81IsBSkhog7O+BiXEOk/5frE8ryZOpOm/3PmdW\n' +
    'imEORkTdS94MilEsk+6Ozd9GnAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC\n' +
    '894cUqq1aH9h44SwyQIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';
const PRIV_KEY =
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICWwIBAAKBgQCxsx1/cEpUmSwUwwPU0SciWcVKmDORBGwSBjJg8SL2GrCMC1+R\n' +
    'wz81IsBSkhog7O+BiXEOk/5frE8ryZOpOm/3PmdWimEORkTdS94MilEsk+6Ozd9G\n' +
    'nAz6Txyk07yDDwCEmA3DoFY2hfKg5vPoskKA0QBC894cUqq1aH9h44SwyQIDAQAB\n' +
    'AoGAEH9Ato9R80MqHr5RGX2WXL/JS2jQZr7qmozFOg9A7+if6cx3gaSG9nOkt7W1\n' +
    'I8fjX1sHajNOmwq36eiDoyMX+EwloEJXmvDJocpObzIGGKcCIkowhdhpcgAE0qmv\n' +
    'FFi2LOK2Z48jcPXmOCHywXQLBs7GGFvWmgAqo8bP9OmdC7UCQQDqSuLEZjgWPS94\n' +
    'BgwzkHD6ZLgaKzOzPH8iXh7EVqReGUXf16owVkuMWLF7hq02fXt7G4kjdztlmfCy\n' +
    '8fZPM02VAkEAwinro2YxG4aGHvtVnizEArHp9YdIW+lBy5vrTgyYG2gpTBMfdore\n' +
    'hElI9eR6vhJMpudx1epcpjmS52cJn7OBZQJAFScvtCW6eJ+Lkp2RKnKnEKRZTtuJ\n' +
    'rmwO2m5+/qEH9Ar6GQyiq/yOk5xKYem1586KgIHq7s3MCg9NAQsBfwMVxQJAKmbN\n' +
    'NtnST5iJIarxf6F3DL+dwCjS/H9sBvL96AWIEjQlEJ/8dv7MqUb3z/sdcvS8GJbi\n' +
    'nTyZDxPzqOUvjNi+oQJAPumO909O6mbqrtDmvz100JMQdILNzc+wynM45hu/Yj5V\n' +
    'qMiC7KMtCE3xaEMd21EzRtusJvGWY3KhLHNCcUx4jg==\n' +
    '-----END RSA PRIVATE KEY-----\n';

export default Model.extend({
    namespace: 'login',
    state: {
        // initialRouteName: 'Workbench', // 初始化
        initialRouteName: '', // 初始化
        IsAgree: true, // 用户协议勾选状态
        needSignAgreement: false,
        loginData: {},
        login: false,
        loading: true,
        fetching: false,
        ProjectName: '设备运维',
        LoadingData: { status: 'loading' },
        workerBenchMenu: {},
        menuList: [], // 可根据此数据加在工作台接口
        testFunctionStatus: true, // 未上线功能控制
        tabList: [], // 工作台Tab 常用、个人、全员
        tabSelectIndex: 0 // 工作台Tab 选中下标
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *loadglobalvariable({ payload }, { call, put, update, take }) {
            const { user, _dispatch } = payload;

            // if (user.RoleIds == '2b345cf3-1440-4898-84c8-93f9a64f8daf') {
            //     //运维人员
            //     yield update({ proFlag: 1 });
            // } else if (user.RoleIds == '2b345cf3-1440-4898-84c8-93f9a64f8daf') {
            //     yield update({ proFlag: 1 });
            // }
            // setCookies(UrlInfo.FormUrl, user.Ticket);
            let workerBenchMenuData = [];
            let topLevelRouter = [];
            // let initialRouteName = 'Workbench';
            let initialRouteName = '';
            SentencedToEmpty(user, ['MenuDatas'], []).map((item, index) => {
                if (item.id == '317a708d-f762-44a3-b27e-a96beffbec65') {
                    initialRouteName = 'Workbench';
                    topLevelRouter.push({ routeName: 'Workbench' });
                    workerBenchMenuData = SentencedToEmpty(item, ['children'], []);
                }
                if (item.id == 'fe88216b-e18b-4280-95d3-38bf925776ef') {
                    topLevelRouter.push({ routeName: 'PollutionAll' });
                }
                if (item.id == '221530a9-a6dc-46ac-9035-779e201e8cef') {
                    topLevelRouter.push({ routeName: 'chengTaoXiaoXi' });
                }
                if (item.id == '0313dd66-fe89-4845-b233-fda0a4fcf4d7') {
                    topLevelRouter.push({ routeName: 'Account' });
                }
            });
            // let workerBenchMenuData = SentencedToEmpty(user, ['MenuDatas'], []);
            // console.log('workerBenchMenuData = ', workerBenchMenuData);
            // let editWorkBenchData = {};
            let editWorkBenchData = [];
            /**
             * 日常关注     f418da8c-fcc7-4784-8b54-1b4f182ba330
             * 数据报警     90eea7ec-90b1-4b7b-82c0-ef961ae90329
             * 常规应用     d92e9aab-486f-4cb5-abd6-344674d4b0d5
             */
            let firstlevel = {},
                secondlevel = [],
                menuList = [],
                tabList = [],
                tabItem = {};
            workerBenchMenuData.map((tabDataItem, tabIndex) => {
                tabItem = { ...tabDataItem };
                menuList = [];
                testItem = tabDataItem;
                if (SentencedToEmpty(tabDataItem, ['id'], '') == 'f418da8c-fcc7-4784-8b54-1b4f182ba331') {
                    // firstlevel = { ...tabDataItem };
                    // editWorkBenchData.push(firstlevel);
                    testItem = { ...tabDataItem };
                    testItem.children = [tabDataItem];
                }
                const { editWorkBenchDataResult, menuListResult } = secondlevelDataHandle(testItem);

                tabItem.editWorkBenchData = editWorkBenchDataResult;
                tabItem.menuList = menuListResult;
                tabList.push(tabItem);
            });

            yield update({
                menuList: SentencedToEmpty(tabList, [0, 'menuList'], []),
                workerBenchMenu: SentencedToEmpty(tabList, [0, 'editWorkBenchData'], []),
                tabList,
                initialRouteName,
                tabSelectIndex: 0
            });

            yield put(NavigationActions.reset({ routeName: 'MyTab' }));
            // 获取通用配置信息
            yield put({ type: 'app/getOperationSetting', payload: {} });
            addAlias(user.UserId, (str = '') => {
                if (str.indexOf('errorCode') != -1) {
                    _dispatch(
                        createAction('app/addClockInLog')({
                            //阿里云注册别名产生的错误日志
                            msg: `{"target":"addAlias","msgType":"addAlias","UserId":${user.UserId},"data":${str}}`
                        })
                    );
                }
            });

            yield saveRouterConfig(topLevelRouter);
            yield put({ type: 'map/resetPage', payload: {} }); //清空地图

            let websocketToken = yield loadWebsocketToken();
            if (websocketToken) {
                console.log('websocketToken = ', websocketToken.websocketToken);
            }
            if (!websocketToken || (websocketToken && websocketToken.hasClose)) {
                ws = openWebSocket(
                    data => {
                        if (SentencedToEmpty(data, ['MessageType'], '') == 'Alarm') {
                            // 处理数据将更新过来的数据放入对应位置
                            _dispatch(createAction('websocket/addAlarmNotices')({ newMessage: newMessage }));
                        }
                    },
                    message => {
                        console.log('onerror');
                    }
                );
                yield saveWebsocketToken({ websocketToken: ws._socketId, hasClose: false });
            } else {
                console.log('WebSocket restart');
                ws = openWebSocket(
                    () => { },
                    () => { }
                );
                ws._socketId = websocketToken.websocketToken;
                ws.close();

                yield setTimeout(() => {
                    ws = openWebSocket(
                        () => { },
                        () => { },
                        () => {
                            ws.close();
                        },
                        () => {
                            ws = openWebSocket(
                                data => {
                                    // 开始接收数据
                                    if (SentencedToEmpty(data, ['MessageType'], '') == 'Alarm') {
                                        let newMessage = SentencedToEmpty(data, ['Message'], []);
                                        _dispatch(createAction('websocket/addAlarmNotices')({ newMessage: newMessage }));
                                    }
                                },
                                () => { }
                            );
                        }
                    );
                }, 5000);
            }

            if (typeof user.Complexity == 'boolean' && !user.Complexity) {
                yield put(
                    createAction('account/updateState')({
                        Complexity: user.Complexity
                    })
                );
                yield put(NavigationActions.reset({ routeName: 'AccountSecurity' }));
                // 强制修改
                // yield put(
                //     StackActions.reset({
                //         index: 0,
                //         actions: [NavigationActions.navigate({ routeName: 'AccountSecurity' })]
                //     })
                // );
            }
        },

        *getIsNeedSecrect(action, { call, put }) {
            console.log('getIsNeedSecrect 停用是否加密方法');
            // const isNeedSecret = yield call(authService.axiosGet, api.pollutionApi.Account.getIsNeedSecret, {});
            // if (isNeedSecret.status == 200 || (typeof isNeedSecret.data != 'undefined' && isNeedSecret.data && isNeedSecret.data.StatusCode == 200)) {
            //     global.constants.isSecret = isNeedSecret.data.Datas.ClearTransmission == '0' ? true : false;
            // }
        },

        /**
         * PostMessageCode
         * 获取验证码
         * @param {*} param0
         * @param {*} param1
         */
        *postMessageCode({ payload }, { call, put, update, take, select }) {
            const result = yield call(axiosAuthLogin, api.pollutionApi.Account.PostMessageCode, payload);
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('验证码已发送');
            } else {
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], '验证码发送失败'));
            }
        },
        *login({ payload }, { call, put, update, take, select }) {
            /**
             * 公司运维没有相关逻辑，服务端不提供是否加密的配置信息
             * 同时因为此接口修改，导致错误信息401，因此去掉这部分逻辑
             * yield put('getIsNeedSecrect', {});
             * yield take('getIsNeedSecrect/@@end');
             */

            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(RSAPubSecret);

            if (yield loadSwitchToken()) {
            } else {
                yield saveSwitchToken({ mapPageDefSwitch: 'list' }); //地图页面 默认显示地图还是列表
            }
            yield update({ loginData: { status: -1 } });
            _dispatch = payload.dispatch;
            const { MenuID } = yield select(state => state.app);
            const { IsAgree } = yield select(state => state.login);
            const params = {
                //新的登录需要转一下
                UserAccount: payload.User_Account,
                UserPwd: payload.User_Pwd,
                IsLastest: payload.IsLastest,
                MenuID: MenuID,
                LoginFlag: 'OperationApp',
                applicationId: 'sdlzhyw_com.chsdlenterprise.intelligenceoperations',
                IsAgree,
                RememberMe: true
            };
            // 短信验证字段，注销此判断即可停用验证码接口，同时需要修改Login.js
            // if (payload.VerificationStatus) {
            //     params.VerificationStatus = payload.VerificationStatus;// 需要验证码
            //     params.VerificationCode = payload.VerificationCode; // 验证码
            // }
            const analyzeParams = {
                //新的登录需要转一下
                UserAccount: payload.User_Account,
                UserPwd: payload.User_Pwd,
                LoginFlag: 'true',
                MenuId: '',
                RememberMe: true
            };
            // if (global.constants.isSecret == true) {
            //     (params.UserAccount = encrypt.encrypt(params.UserAccount)), (params.UserPwd = encrypt.encrypt(params.UserPwd)), (params.MenuID = encrypt.encrypt(params.MenuID));
            // }

            const login = yield call(axiosAuthLogin, api.pollutionApi.Account.Login, params);
            let tokenData = null;

            if (login.status == 200) {
                tokenData = yield call(
                    dataAnalyzeAuth.axiosAuthPost,
                    api.pollutionApi.Account.GetToken,
                    qs.stringify({
                        client_id: 'WryWebClient',
                        client_secret: 'Web_P@ssw0rd_!@#$%',
                        grant_type: 'password',
                        username: payload.User_Account,
                        password: payload.User_Pwd
                    })
                );
                console.log('tokenData = ', tokenData);
                login.data.Datas.dataAnalyzeTicket = SentencedToEmpty(tokenData, ['data', 'access_token'], '');
            }
            if (login.status == 200) {
                login.data.Datas.LocalPwd = payload.User_Pwd;
                login.data.Datas.userSource = 'pOperation'; //运维标识 由于有些页面 污染源监控和运维是共用的 通过此标识区分开
                yield saveToken(login.data.Datas);
                yield update({ loginData: { status: 200 } }); //结束转圈
                console.log('login 2');

                yield put('loadglobalvariable', { user: login.data.Datas, _dispatch });
            } else {
                if (SentencedToEmpty(login, ['data', 'Message'], '') == '请勾选阅读并接受《用户监测数据许可协议》') {
                    yield update({ loginData: { status: 200 }, needSignAgreement: true });
                } else {
                    yield update({ loginData: { status: 200 } });
                }
            }
        },

        *logout(action, { call, put }) {
            yield clearToken();
            // removeAlias();
            // Actions.reset({
            //     index: 1,
            //     routes: [
            //         { name: 'Login' },
            //     ],
            // });
            yield put(NavigationActions.reset({ routeName: 'Login' }));
            // yield put(
            //     StackActions.reset({
            //         index: 0,
            //         actions: [NavigationActions.navigate({ routeName: 'Login' })]
            //     })
            // );
        },
        *processingWebSocketData({ payload: { params, callback } }, { call, put, take, update }) {
            console.log('processingWebSocketData');
        },

        *getEnterpriseConfig({ payload }, { call, put, take, update }) {
            yield clearToken();

            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(PUB_KEY);
            encrypt.setPrivateKey(PRIV_KEY);
            // encrypt.encrypt(payload.AuthCode);

            // //存储密文数据
            // AsyncStorage.setItem('encryptData', encrypt.encrypt(payload.AuthCode), function (error) {
            //     if (error) {
            //     } else {
            //     }
            // });
            // nginx代理
            saveEncryptDataWithData(encrypt.encrypt(payload.AuthCode), payload.AuthCode);

            const result = yield authService.getUrlConfig(payload.AuthCode);
            console.log('result = ', result);

            // yield saveRootUrl({
            //     JianGuanAPPName: "运维企业版",
            //     Logo: "gg.png",
            //     ProjectName: "智慧运维监管平台",
            //     ReactUrl: "http://61.50.135.114:61001",
            //     SystemName: "智慧运维监管平台",
            //     WebSocket: "220.171.32.30:8182/",
            // });

            if (result && typeof result != 'undefined' && result.status == 200) {
                if (result.data.msg == 'authorcode faild') {
                    yield clearRootUrl();
                    // ShowToast(`授权码验证失败`);
                    ShowToast(`授权码验证失败2:${result}`);
                    yield put(createAction('app/updateState')({ networkTest: true }));
                } else {
                    yield saveRootUrl(result.data);
                    yield update({ ProjectName: SentencedToEmpty(result, ['data', 'SystemName'], '设备运维') }); //刷新登录页面
                    yield put(NavigationActions.reset({ routeName: 'Login' }));
                    // yield put(
                    //     StackActions.reset({
                    //         index: 0,
                    //         actions: [NavigationActions.navigate({ routeName: 'Login' })]
                    //     })
                    // );
                }
            } else {
                yield clearRootUrl();
                // ShowToast('授权码验证失败');
                ShowToast(`授权码验证失败1:${result}`);
                yield put(createAction('app/updateState')({ networkTest: true }));
            }
        },
        *reloadEnterpriseConfig({ payload }, { call, put, take, update }) {
            yield clearToken();

            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(PUB_KEY);
            encrypt.setPrivateKey(PRIV_KEY);
            // nginx代理
            saveEncryptDataWithData(encrypt.encrypt(payload.AuthCode), payload.AuthCode);

            const result = yield authService.getUrlConfig(payload.AuthCode);
            console.log('result = ', result);

            if (result && typeof result != 'undefined' && result.status == 200) {
                if (result.data.msg == 'authorcode faild') {
                    yield clearRootUrl();
                    ShowToast('授权码验证失败');
                } else {
                    yield saveRootUrl(result.data);
                    yield update({ ProjectName: SentencedToEmpty(result, ['data', 'SystemName'], '设备运维') }); //刷新登录页面
                }
            } else {
                yield clearRootUrl();
                ShowToast('授权码验证失败');
            }
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
