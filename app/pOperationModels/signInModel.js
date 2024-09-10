/*
 * @Description: 宝武相关事件
 * @LastEditors: hxf
 * @Date: 2023-05-06 08:44:32
 * @LastEditTime: 2024-04-23 18:05:41
 * @FilePath: /SDLMainProject37_backup/app/pOperationModels/signInModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, bwFormatArray, CloseToast, createAction } from '../utils';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import { getToken } from '../dvapack/storage';

export default Model.extend({
    namespace: 'signInModel',
    state: {
        signInType: 0, // 签到类型

        longitude: '', // 用户位置，搜索中心经度
        latitude: '',// 用户位置，搜索中心纬度
        pageIndex: 1, // 高德搜索分页索引

        listData: [] // 列表数据
        , listStatus: -1 // 列表加载状态
        , selectedPoint: null // 选中的建筑物
        , selectedIndex: -1   // 选中的建筑物的索引
        , hasMore: true       // 是否有下一页

        , topLevelTypeList: [] // 第一大类数据
        , workTypeList: [] // 工作类型数据
        , signInTypeResult: { status: -1 } //工作类型请求结果
        , signInEntList: [] // 运维企业列表
        , signInEntListResult: { status: -1 } // 运维企业请求结果
        , fileUUID: `_sign_in_${new Date().getTime()}`// 签到照片 id


        , commonSignInProject: { status: -1 },
        orientationStatus: 'unlocated',

        entListStatus: 0,// 0 未获取  1 已获取

        workTypeSelectedItem: null, // 选中的工作类型
        signInEntItem: null, // 选中的企业

        signInTime: '', // 签到时间
        signOutTime: '',// 签退时间

        signStatus: null, // signIn: true, signOut: true 可以签到，可以签退
        remark: '',// 备注

        signCount: 0, // 非现场签到次数

        // 补签 现场类型
        supplementaryWorkTypeResult: { status: -1 }
        , supplementaryWorkTypeList: [], // 工作类型数据
        supplementaryWorkTypeSelectedItem: null, // 选中的工作类型

        supplementaryTypeList: [],
        supplementaryTypeSelectedItem: null,
        supplementaryDate: moment().format('YYYY-MM-DD'), // 补签日期
        supplementaryArriveTime: moment().format('YYYY-MM-DD HH:00'), // 补签到达时间
        supplementaryLeaveTime: moment().format('YYYY-MM-DD HH:00'), // 补签离开时间

        supplementaryImageID: '',// 补签 图片uuid
        supplementaryImageList: [],// 补签 图片列表
        supplementaryStatement: '',// 补签说明

        allSignInEntList: [], // 补签 所有企业列表
        allSignInEntListResult: { status: -1 },// 补签 所有企业列表请求结果
        replenishmentSelectedEntItem: null, // 选中的补签企业

        // 统计
        calenderData: [], // 存在记录的日期信息
        ctSignInHistoryListResult: { status: -1 }, // 签到统计查询结果（月）
        calenderCurrentMonth: moment().format('YYYY-MM-DD'),
        calenderSelectedDate: '',
        calenderDataObject: {},

        // 检测用户是否有权撤销或者修改补签记录
        updAndRevokeStatusResult: { status: 200 },
        signID: '', // 修改补签记录时需要这个参数
        appID: '',// 修改补签记录时需要这个参数
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * GetSignInType
         * 获取打卡类型
         * @param {*} param0
         * @param {*} param1
         */
        * getSignInType(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetSignInType, params);
            if (result.status == 200) {
                yield update({
                    topLevelTypeList: SentencedToEmpty(result
                        , ['data', 'Datas', 'codeList'], []) // 第一大类数据
                    , workTypeList: SentencedToEmpty(result
                        , ['data', 'Datas', 'childList'], []), // 工作类型数据
                });
            } else {
                yield update({
                    topLevelTypeList: [] // 第一大类数据
                    , workTypeList: [], // 工作类型数据
                });
            }
        },
        /**
         * GetSignInType
         * 获取补签的现场类型
         * 获取打卡类型
         * @param {*} param0
         * @param {*} param1
         */
        * getSupplementarySignInType(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetSignInType, {});
            if (result.status == 200) {
                yield update({
                    supplementaryWorkTypeResult: result
                    , supplementaryWorkTypeList: SentencedToEmpty(result
                        , ['data', 'Datas', 'childList'], []), // 工作类型数据
                });
            } else {
                yield update({
                    supplementaryWorkTypeResult: result
                    , supplementaryWorkTypeList: [], // 工作类型数据
                });
            }
        },
        /**
         * GetSignInEntList
         * 获取通用打卡 企业列表
         * @param {*} param0
         * @param {*} param1
         */
        * getSignInEntList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetSignInEntList, params);
            if (result.status == 200) {
                yield update({
                    entListStatus: 1
                    , signInEntList: SentencedToEmpty(result
                        , ['data', 'Datas'], []) // 运维企业列表
                    , signInEntListResult: result // 运维企业请求结果
                });
            } else {
                yield update({
                    signInEntList: []// 运维企业列表
                    , signInEntListResult: result // 运维企业请求结果
                });
            }
        },
        /**
         * getAllSignInEntList
         * 获取通用打卡 补卡 企业列表
         * @param {*} param0
         * @param {*} param1
         */
        * getAllSignInEntList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost
                , api.pOperationApi.CommonSignIn.GetSignInEntList
                , {
                    AllEnt: true,
                    longitude: 0,
                    latitude: 0,
                });
            if (result.status == 200) {
                yield update({
                    allSignInEntList: SentencedToEmpty(result
                        , ['data', 'Datas'], []) // 运维企业列表
                    , allSignInEntListResult: result // 运维企业请求结果
                });
            } else {
                yield update({
                    allSignInEntList: []// 运维企业列表
                    , allSignInEntListResult: result // 运维企业请求结果
                });
            }
        },
        /**
         * GetLastSingInfo
         * 获取通用打卡 上次打卡记录
         * @param {*} param0
         * @param {*} param1
         */
        * getLastSingInfo(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetLastSingInfo, params);
            if (result.status == 200) {
                if (SentencedToEmpty(params, ['SignWorkType'], '') == 61) {
                    yield update({
                        signCount: SentencedToEmpty(result, ['data', 'Datas', 'signCount'], 0)
                    });
                } else {
                    const data = SentencedToEmpty(result, ['data', 'Datas'], {})
                    const entID = SentencedToEmpty(data, ['entID'], '');
                    let selectedWorkType = {};
                    let selectedEnt = {};
                    const signInTime = SentencedToEmpty(data, ['signInTime'], '');
                    let signOutTime = SentencedToEmpty(data, ['signOutTime'], '');
                    // if (signInTime == '') {
                    //     signOutTime = ''
                    // }
                    if (entID == '') {
                        // 最近没有打卡记录
                        yield update({
                            // workTypeSelectedItem: selectedWorkType, // 选中的工作类型
                            // signInEntItem: selectedEnt, // 选中的企业
                            signInTime,
                            signOutTime
                        });
                    } else {
                        selectedWorkType.ChildID = SentencedToEmpty(data, ['WorkType'], '');
                        if (selectedWorkType.ChildID == '574') {
                            let signInCheckParams = { WorkType: selectedWorkType.ChildID };
                            yield put(createAction('signInModel/getSignStatus')({
                                params: signInCheckParams
                                , successCallBack: (result) => { }
                                , failCallBack: () => {
                                    ShowToast('签到校验错误');
                                }
                            }));
                        }
                        selectedWorkType.Name = SentencedToEmpty(data, ['WorkTypeName'], '');
                        if (!selectedWorkType.ChildID || selectedWorkType.ChildID == ''
                            || !selectedWorkType.Name || selectedWorkType.Name == '') {
                            ShowToast('最近一条记录的工作类型错误');
                            return;
                        }
                        selectedEnt.entCode = SentencedToEmpty(data, ['entID'], '');
                        selectedEnt.entName = SentencedToEmpty(data, ['entName'], '');
                        selectedEnt.latitude = Number(SentencedToEmpty(data, ['entlatitude'], 0));
                        selectedEnt.longitude = Number(SentencedToEmpty(data, ['entlongitude'], 0));
                        selectedEnt.radius = SentencedToEmpty(data, ['Radius'], '');
                        if (!selectedEnt.entCode || selectedEnt.entCode == ''
                            || !selectedEnt.entName || selectedEnt.entName == ''
                            || !selectedEnt.latitude || selectedEnt.latitude == ''
                            || !selectedEnt.longitude || selectedEnt.longitude == ''
                            || !selectedEnt.radius || selectedEnt.radius == '') {
                            ShowToast('最近一条记录的运维企业错误');
                            return;
                        }
                        yield update({
                            workTypeSelectedItem: selectedWorkType, // 选中的工作类型
                            signInEntItem: selectedEnt, // 选中的企业
                            signInTime,
                            signOutTime
                        });
                    }
                }
            } else {
                //     yield update({
                //         signInEntList: []// 运维企业列表
                //         , signInEntListResult: result // 运维企业请求结果
                //     });
            }
        },
        /**
         * SignIn
         * 获取通用打卡 企业列表
         * @param {*} param0
         * @param {*} param1
         */
        * signIn(
            {
                payload: {
                    params = {}
                    , successCallBack = () => { }
                    , failCallBack = () => { }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.SignIn, params);
            // 关闭提交loading
            if (result.status == 200) {
                successCallBack();
            } else {
                failCallBack(result);
                // 向服务端记录日志
                let logData = {};
                logData.functionType = `signIn`;
                const token = getToken();
                logData.UserAccount = token.UserAccount
                logData.UserName = token.UserName
                logData.status = result.status
                logData.url = api.pOperationApi.CommonSignIn.SignIn;
                logData.params = params;
                logData.time = moment().format('YYYY-MM-DD HH:mm:ss');
                logData._response = SentencedToEmpty(result, ['request', '_response'], '');

                yield put(
                    createAction('app/addClockInLog')({
                        //提交异常日志
                        msg: `${JSON.stringify(logData)}`
                    })
                );
            }
        },
        /**
         * GetSignStatus
         * 获取通用打卡 企业列表
         * @param {*} param0
         * @param {*} param1
         */
        * getSignStatus(
            {
                payload: {
                    params = {}
                    , successCallBack = () => { }
                    , failCallBack = () => { }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetSignStatus, params);
            // 关闭提交loading

            console.log('result.status == 200 = ', result.status == 200);
            console.log('IsSuccess = ', SentencedToEmpty(result, ['data', 'IsSuccess'], false));
            console.log('IsSuccess = ', result.data.IsSuccess);
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                successCallBack(SentencedToEmpty(result, ['data', 'Datas'], {}));
                yield update({
                    signStatus: SentencedToEmpty(result, ['data', 'Datas'], {})
                });
            } else {
                failCallBack();

                // 向服务端记录日志
                let logData = {};
                logData.functionType = `getSignStatus`;
                const token = getToken();
                logData.UserAccount = token.UserAccount
                logData.UserName = token.UserName
                logData.status = result.status
                logData.url = api.pOperationApi.CommonSignIn.GetSignStatus;
                logData.params = params;
                logData.time = moment().format('YYYY-MM-DD HH:mm:ss');
                logData._response = SentencedToEmpty(result, ['request', '_response'], '');

                yield put(
                    createAction('app/addClockInLog')({
                        //提交异常日志
                        msg: `${JSON.stringify(logData)}`
                    })
                );
            }
        },
        /**
         * RepairSignIn
         * 补签申请
         * @param {*} param0
         * @param {*} param1
         */
        * repairSignIn(
            {
                payload: { params = {}, successCallback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.RepairSignIn, params);
            if (result.status == 200) {
                successCallback();
                CloseToast();
            } else {
                CloseToast();
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            }
        },
        /**
         * GetSignInHistoryList
         * 签到统计
         */
        * getSignInHistoryList(
            {
                payload: {
                    params = {},
                    callback = () => {
                        return false;
                    }
                }
            },
            { call, put, take, update, select }
        ) {
            const { projectInfoListSearchStr } = yield select(state => state.CTModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetSignInHistoryList, params);
            /**
             * item.date = date;
             * item.style = { backgroundColor: '#fc953f' };
             */
            let calenderData = [],
                dataObject = {};
            if (result.status == 200) {
                const rawData = SentencedToEmpty(result, ['data', 'Datas'], []);
                rawData.map((item, index) => {
                    for (var key in item) {
                        calenderData.push({
                            date: key,
                            style: { backgroundColor: '#4AA0FF' }
                        });
                        dataObject[key] = item[key];
                    }
                });
            }
            yield update({ calenderData, ctSignInHistoryListResult: result, calenderDataObject: dataObject });
        },
        /**
         * GetUpdAndRevokeStatus
         * 获取撤销修改状态
         * @param {*} param0
         * @param {*} param1
         */
        * getUpdAndRevokeStatus(
            {
                payload: { params = {}, successCallback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.GetUpdAndRevokeStatus, params);
            yield update({ updAndRevokeStatusResult: result });
        },
        /**
         * RevokeApproved
         * 撤销补签
         * @param {*} param0
         * @param {*} param1
         */
        * revokeApproved(
            {
                payload: { params = {}, successCallback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.RevokeApproved, params);
            // yield update({ updAndRevokeStatusResult: result });
            if (result.status === 200) {
                yield update({
                    approvalPage: 1,
                    pendingData: { status: -1 },
                });
                yield put(createAction('approvalModel/getTaskListRight')({
                    params: {
                        taskType: 2,
                        type: 1,// 我发起的审批记录
                        pageIndex: 1,
                        pageSize: 10
                    }
                }));
                yield put(NavigationActions.back());
                ShowToast('撤销成功');
            } else {
                ShowToast('撤销失败');
            }
        },
        /**
         * UpdateApproved
         * 修改补签申请前获取数据
         * @param {*} param0
         * @param {*} param1
         */
        * updateApproved(
            {
                payload: {
                    params = {}
                    , successCallback = (response) => {
                        // 关闭进度
                        // 跳转编辑页面
                    }, failureCallback = (error) => {
                        // 关闭进度
                        // 报错
                    }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CommonSignIn.UpdateApproved, params);
            if (result.status == 200) {
                const data = SentencedToEmpty(result, ['data', 'Datas'], {});
                const ArriveTime = SentencedToEmpty(data, ['ArriveTime'], '');
                const LeaveTime = SentencedToEmpty(data, ['LeaveTime'], '');
                let supplementaryDate = ArriveTime;
                if (supplementaryDate == '') {
                    supplementaryDate = LeaveTime;
                }
                const FileList = SentencedToEmpty(data, ['FileList'], []);
                let imageList = [];
                FileList.map((item) => {
                    imageList.push({
                        AttachID: item.FileName
                    });
                });
                const WorkType = SentencedToEmpty(data, ['WorkType'], '');
                let supplementaryTypeList = [];
                if (WorkType == '572') {
                    supplementaryTypeList = [
                        { ID: '2', Name: '签退' },
                        { ID: '3', Name: '签到签退' },
                    ]
                } else if (WorkType == '573') {
                    supplementaryTypeList = [
                        { ID: '2', Name: '签退' },
                        { ID: '3', Name: '签到签退' },
                    ]
                } else {
                    supplementaryTypeList = [
                        { ID: '1', Name: '签到' },
                        { ID: '2', Name: '签退' },
                    ]
                }

                /**
                 * 如果是修改需要传
                 * signID、appID
                 */
                yield update({
                    signID: SentencedToEmpty(data, ['signID'], ''), // 修改补签记录时需要这个参数
                    appID: SentencedToEmpty(data, ['appID'], ''),// 修改补签记录时需要这个参数
                    supplementaryTypeSelectedItem: {
                        'ID': SentencedToEmpty(data, ['RepairSignType'], ''),
                        'Name': SentencedToEmpty(data, ['RepairSignTypeName'], '补签类型错误'),
                    },
                    supplementaryTypeList: supplementaryTypeList,
                    supplementaryWorkTypeSelectedItem: {
                        ChildID: SentencedToEmpty(data, ['WorkType'], '')
                        , Name: SentencedToEmpty(data, ['WorkTypeName'], '现场类型错误')
                    },
                    supplementaryWorkTypeResult: { status: -1 },
                    replenishmentSelectedEntItem: {
                        entCode: SentencedToEmpty(data, ['entID'], ''),
                        entName: SentencedToEmpty(data, ['entName'], '企业信息异常'),
                    },// 运维企业
                    supplementaryDate: supplementaryDate,
                    supplementaryArriveTime: ArriveTime,
                    supplementaryLeaveTime: LeaveTime,
                    supplementaryImageID: SentencedToEmpty(data, ['File'], `supplementaryImage${new Date().getTime()}`),
                    supplementaryImageList: imageList,
                    supplementaryStatement: SentencedToEmpty(data, ['Remark'], ''),
                });
                successCallback(result);
            } else {
                failureCallback(result);
            }
        },
    },

    subscriptions: {}
});