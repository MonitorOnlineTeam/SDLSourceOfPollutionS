/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-08-21 15:00:35
 * @LastEditTime: 2025-02-13 15:42:25
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/login.js
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
import { getVersionInfo, RSAPubSecret, UrlInfo } from '../config/globalconst';
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
        tabSelectIndex: 0, // 工作台Tab 选中下标
        routerConfig: [],
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *loadglobalvariable({ payload }, { call, put, update, take }) {
            // 重置企业报警tab的状态，第一次点击切换到超标报警页面
            yield put(createAction('tabAlarmListModel/updateState')({
                alarmTabLoadTimes: 0,
                alarmType: 0 // 企业报警tab 默认为0
            }));
            // 登陆有初始化获取tab报警计数
            yield put(createAction('tabAlarmListModel/getAlarmCountForEnt')({}));
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
            let pointNemuData = [];
            let accountOptionList = []
                , accountHeaderId = '';
            let tabAlarmWarningButton = [],
                tabAlarmOverButton = [],
                tabAlarmMissExceptionButton = [],
                tabAlarmExceptionButton = [];
            SentencedToEmpty(user, ['MenuDatas'], []).map((item, index) => {

                if (item.id == '317a708d-f762-44a3-b27e-a96beffbec65'
                    || item.id == "2252fc9d-4316-4f85-8cd2-c715668e0443"
                ) {
                    initialRouteName = 'Workbench';
                    topLevelRouter.push({ routeName: 'Workbench' });
                    workerBenchMenuData = SentencedToEmpty(item, ['children'], []);
                }
                if (item.id == 'fe88216b-e18b-4280-95d3-38bf925776ef'
                    || item.id == "23e15626-7a94-422f-af3c-afa91c017498"
                ) {
                    topLevelRouter.push({ routeName: 'PollutionAll' });
                    pointNemuData = SentencedToEmpty(item, ['children'], []);
                }
                if (item.id == '221530a9-a6dc-46ac-9035-779e201e8cef'
                    || item.id == "896bb82b-4935-4f2e-886c-ef0ab38e8124"
                ) {
                    topLevelRouter.push({ routeName: 'chengTaoXiaoXi' });
                }
                if (item.id == '0313dd66-fe89-4845-b233-fda0a4fcf4d7'
                    || item.id == "94845b3b-f536-4402-b969-f3d455480b8b"
                ) {
                    // 此处添加主路由信息
                    topLevelRouter.push({ routeName: 'Account' });
                    console.log('Account = ', item);
                    const inComeOptions = SentencedToEmpty(item, ['children'], []);
                    inComeOptions.map((iCOItem, iCOIndex) => {
                        if (iCOItem.id == "929253d2-68e0-43d9-bfd5-b35baa7889b0"
                            || iCOItem.name == "页面头部1"
                        ) {
                            // "页面头部1"
                            accountHeaderId = iCOItem.id;
                        } else if (iCOItem.id == "b1320831-30c3-4429-98ad-b3f5217c228e"
                            || iCOItem.name == "页面头部2"
                        ) {
                            // "页面头部2"
                            accountHeaderId = iCOItem.id;
                        } else {
                            if (iCOItem.id == "aa7b487f-2624-437e-a222-c7195e19f344"
                            ) {
                                // "帮助中心"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'HelpCenter';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "8573b113-234e-45cb-9743-f48ce7d7d19c"
                            ) {
                                // "下载应用"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'DownLoadAPP';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "1092cb08-cefb-4cd9-a630-d30e216f43ff"
                            ) {
                                // "我的证书"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'OperaStaffInfo';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "50f10ab5-1c79-4b8e-8467-5ad6b4e5a276"
                            ) {
                                // "账户与安全"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'AccountSecurity';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "77e104bf-2b4c-4bb8-b6a9-7e34d4d405b0"
                            ) {
                                // "推送设置"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'PushSetting';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "233cb731-abce-4baa-aa9e-edad31dfa85a"
                            ) {
                                // "微信公众号绑定"
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'WXBinding';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "81b1ea71-9721-4e39-bdef-e4f1b822bf28"
                            ) {
                                // "版本更新"
                                iCOItem.title = `版本更新 (v${getVersionInfo().app_version_name})`;
                                iCOItem.routeName = 'update';
                                iCOItem.params = {};
                            } else if (iCOItem.id == "836fab55-bd7f-40f4-a954-fd20075eb7ba"
                            ) {
                                // 
                                iCOItem.title = iCOItem.name;
                                iCOItem.routeName = 'logout';
                                iCOItem.params = {};
                            }
                            accountOptionList.push(iCOItem);
                        }
                    });
                }
                if (item.id == "0111e4bc-e277-4657-97b1-c55eb57e34c0"
                ) {
                    // 数据 数据一览
                    if (initialRouteName != 'Workbench') {
                        initialRouteName = 'DataForm'
                    }
                    topLevelRouter.push({ routeName: 'DataForm' });
                }
                if (item.id == "7004d17e-e41b-4da0-b7e3-c4555525bb8b"
                ) {
                    // 报警 企业用户
                    topLevelRouter.push({ routeName: 'Alarm' });
                    const buttonList = SentencedToEmpty(item, ['buttonList'], []);
                    buttonList.forEach((buttonItem, buttonIndex) => {
                        if (buttonItem.code = 'xiangying') {
                            tabAlarmMissExceptionButton.push(buttonItem);
                            tabAlarmExceptionButton.push(buttonItem);
                        } else if (buttonItem.code = 'chaobiao') {
                            tabAlarmOverButton.push(buttonItem);
                        }
                    })
                }
                if (item.id == "48303d4a-55fc-4c95-b27e-eef155c96ab7"
                ) {
                    // 预警 企业用户
                    topLevelRouter.push({ routeName: 'OverWarning' });
                }
            });
            yield put({
                type: 'tabAlarmListModel/updateState', payload: {
                    tabAlarmWarningButton,
                    tabAlarmOverButton,
                    tabAlarmMissExceptionButton,
                    tabAlarmExceptionButton,
                }
            });
            console.log('initialRouteName = ', initialRouteName);
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
            let workWarningButton = [],
                workAlarmOverButton = [],
                workAlarmMissExceptionButton = [],
                workAlarmExceptionButton = []
                , signInButtonlist = [{ label: '个人统计', value: 'personal' },]
                , signInButton
                , _statisticsType = 'personal';
            workerBenchMenuData.map((tabDataItem, tabIndex) => {
                console.log('tabDataItem = ', tabDataItem);
                if (tabDataItem.id == "3de2ed1b-c267-4167-b6bb-dbec254f6306"
                ) {
                    // 常用
                    const changyong = SentencedToEmpty(tabDataItem, ['children'], []);
                    changyong.map((changyongItem, changyongIndex) => {
                        if (changyongItem.id == "8e16a74a-9861-481e-ada8-21d0e9d5be89"
                        ) {
                            const qiandaoButton = SentencedToEmpty(changyongItem, ['buttonList'], []);
                            qiandaoButton.map((qiandaoButtonItem, qiandaoButtonIndex) => {
                                if (qiandaoButtonItem.code == 'teamButton') {
                                    _statisticsType = 'team';
                                    if (signInButtonlist.length == 1) {
                                        signInButtonlist.unshift({ label: '团队统计', value: 'team' });
                                    }
                                }
                            })
                        }
                        if (changyongItem.id == "8078b7f7-179d-40c6-829b-d1cd8a9277f2"
                        ) {
                            const qiandaoButton = SentencedToEmpty(changyongItem, ['buttonList'], []);
                            qiandaoButton.map((qiandaoButtonItem, qiandaoButtonIndex) => {
                                if (qiandaoButtonItem.code == 'teamButton') {
                                    _statisticsType = 'team';
                                    if (signInButtonlist.length == 1) {
                                        signInButtonlist.unshift({ label: '团队统计', value: 'team' });
                                    }
                                }
                            })
                        }
                    })
                }
                if (tabDataItem.id == '72eaa231-8d3a-4b88-9fd8-ba872ff915ed') {
                    // 工作台个人
                    const geRen = SentencedToEmpty(tabDataItem, ['children'], []);
                    geRen.map((geRenItem, geRenIndex) => {
                        if (geRenItem.id == 'a908b089-2cfe-4393-879a-aee09b342f69'
                        ) {
                            console.log('geRenItem = ', geRenItem);
                            // 数据报警
                            const shuJuBaoJing = SentencedToEmpty(geRenItem, ['children'], []);
                            shuJuBaoJing.map((shuJuBaoJingItem, shuJuBaoJingIndex) => {
                                console.log('shuJuBaoJing children = ', SentencedToEmpty(shuJuBaoJingItem, ['children'], []));
                                if (shuJuBaoJingItem.id == '1e959259-4c86-46b6-9afa-3a9526ec7ffe') {
                                    // "超标预警"
                                    workWarningButton = SentencedToEmpty(shuJuBaoJingItem, ['buttonList'], []);
                                } else if (shuJuBaoJingItem.id == "2efd3446-d7e7-4dbd-b1f7-0d09d307f788") {
                                    // 超标报警
                                    workAlarmOverButton = SentencedToEmpty(shuJuBaoJingItem, ['buttonList'], []);
                                } else if (shuJuBaoJingItem.id == "12e56c69-5e5c-4494-8ee4-03623c513ff2") {
                                    // 异常报警
                                    workAlarmExceptionButton = SentencedToEmpty(shuJuBaoJingItem, ['buttonList'], []);
                                } else if (shuJuBaoJingItem.id == "e347aca5-3dbb-4112-aaf1-998699834e2c") {
                                    // 丢失报警
                                    workAlarmMissExceptionButton = SentencedToEmpty(shuJuBaoJingItem, ['buttonList'], []);
                                }
                            })
                        }
                    })
                }
                tabItem = { ...tabDataItem };
                menuList = [];
                testItem = tabDataItem;
                if (SentencedToEmpty(tabDataItem, ['id'], '') == 'f418da8c-fcc7-4784-8b54-1b4f182ba331'
                    || SentencedToEmpty(tabDataItem, ['id'], '') == '3de2ed1b-c267-4167-b6bb-dbec254f6306'
                ) {
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
            yield put({
                type: 'alarm/updateState',
                payload: {
                    workWarningButton,
                    workAlarmOverButton,
                    workAlarmExceptionButton,
                    workAlarmMissExceptionButton
                }
            });
            console.log('tabList = ', tabList);
            console.log('statisticsType = ', _statisticsType);
            yield put({
                type: 'SignInTeamStatisticsModel/updateState',
                payload: {
                    statisticsTypeList: signInButtonlist,
                    statisticsType: _statisticsType
                }
            });
            // 指控测试 质控
            pointNemuData.push({
                id: '312c53c1-e9ff-4745-8c8b-eb642822b7dc',
                name: '质控记录'
            });
            pointNemuData.push({
                id: '50d2c460-7262-44a5-a0fa-2b2b568fe0bc',
                name: '手动指控'
            });
            yield put({
                type: 'pointDetails/updateState',
                payload: {
                    systemMenu: pointNemuData
                }
            });
            yield put({
                type: 'account/updateState',
                payload: {
                    accountHeaderId,// 我的头部id
                    accountOptionList,// 我的选项列表
                }
            });
            // accountHeaderId = iCOItem.id;
            // accountOptionList.push(iCOItem);
            yield update({
                menuList: SentencedToEmpty(tabList, [0, 'menuList'], []),
                workerBenchMenu: SentencedToEmpty(tabList, [0, 'editWorkBenchData'], []),
                tabList,
                initialRouteName,
                tabSelectIndex: 0,
                routerConfig: topLevelRouter
            });
            yield put(NavigationActions.reset({ routeName: 'MyTab' }));
            // 初始化一些数据

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

            // yield saveRouterConfig(topLevelRouter);
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

        * getIsNeedSecrect(action, { call, put }) {
            console.log('getIsNeedSecrect 停用是否加密方法');
            // const isNeedSecret = yield call(authService.axiosGet, api.pollutionApi.Account.getIsNeedSecret, {});
            // if (isNeedSecret.status == 200 || (typeof isNeedSecret.data != 'undefined' && isNeedSecret.data && isNeedSecret.data.StatusCode == 200)) {
            //     global.constants.isSecret = isNeedSecret.data.Datas.ClearTransmission == '0' ? true : false;
            // }
        },

        // 获取系统配置信息
        * getSystemConfigInfo(action, { call, put }) {
            const result = yield call(authService.axiosGet, api.pollutionApi.Account.GetSystemConfigInfo, {});
            if (result.data.IsSuccess) {
                yield put({
                    type: 'app/updateState',
                    payload: {
                        configInfo: result.data.Datas
                    }
                })
            }
        },

        /**
         * PostMessageCode
         * 获取验证码
         * @param {*} param0
         * @param {*} param1
         */
        * postMessageCode({ payload }, { call, put, update, take, select }) {
            const result = yield call(axiosAuthLogin, api.pollutionApi.Account.PostMessageCode, payload);
            if (result.status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('验证码已发送');
            } else {
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], '验证码发送失败'));
            }
        },
        * login({ payload }, { call, put, update, take, select }) {
            /**
             * 公司运维没有相关逻辑，服务端不提供是否加密的配置信息
             * 同时因为此接口修改，导致错误信息401，因此去掉这部分逻辑
             * yield put('getIsNeedSecrect', {});
             * yield take('getIsNeedSecrect/@@end');
             */
            yield put('getSystemConfigInfo', {});
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
                login.data.Datas.dataAnalyzeTicket = SentencedToEmpty(tokenData, ['data', 'access_token'], '');
            }
            if (login.status == 200) {
                login.data.Datas.LocalPwd = payload.User_Pwd;
                login.data.Datas.userSource = 'pOperation'; //运维标识 由于有些页面 污染源监控和运维是共用的 通过此标识区分开
                yield saveToken(login.data.Datas);
                yield update({ loginData: { status: 200 } }); //结束转圈
                yield put('loadglobalvariable', { user: login.data.Datas, _dispatch });
            } else {
                if (SentencedToEmpty(login, ['data', 'Message'], '') == '请勾选阅读并接受《用户监测数据许可协议》') {
                    yield update({ loginData: { status: 200 }, needSignAgreement: true });
                } else {
                    yield update({ loginData: { status: 200 } });
                }
            }
        },

        * logout(action, { call, put }) {
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
        * processingWebSocketData({ payload: { params, callback } }, { call, put, take, update }) {
            console.log('processingWebSocketData');
        },

        * getEnterpriseConfig({ payload }, { call, put, take, update }) {
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
        * reloadEnterpriseConfig({ payload }, { call, put, take, update }) {
            yield clearToken();

            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(PUB_KEY);
            encrypt.setPrivateKey(PRIV_KEY);
            // nginx代理
            saveEncryptDataWithData(encrypt.encrypt(payload.AuthCode), payload.AuthCode);

            const result = yield authService.getUrlConfig(payload.AuthCode);

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
