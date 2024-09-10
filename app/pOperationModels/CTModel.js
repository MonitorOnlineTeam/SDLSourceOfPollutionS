/*
 * @Description: 成套待办
 * @LastEditors: hxf
 * @Date: 2023-09-14 13:55:06
 * @LastEditTime: 2024-07-11 10:33:05
 * @FilePath: /SDLMainProject37/app/pOperationModels/CTModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, EncodeUtf8, createAction, CloseToast } from '../utils';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import { getEncryptData, getToken, loadToken } from '../dvapack/storage';
import { UrlInfo } from '../config';
import { Alert } from 'react-native';

export default Model.extend({
    namespace: 'CTModel',
    state: {
        dispatchId: '',
        ProjectID: '',
        serviceDispatchData: [],
        serviceDispatchResult: { status: -1 },
        completedPageIndex: 1,
        completedPageSize: 20,
        serviceDispatchCompletedData: [],
        serviceDispatchCompletedResult: { status: -1 },
        serviceDispatchTypeAndRecordResult: { status: -1 },
        secondItem: null,
        firstItem: null,
        chengTaoTaskDetailData: null, // 待办列表选中的项目

        acceptanceServiceRecordResult: { status: -1 },
        deleteAcceptanceServiceRecordResult: { status: 200 },
        addAcceptanceServiceRecordResult: { status: 200 },
        calenderData: [], // 存在记录的日期信息
        ctSignInHistoryListResult: { status: -1 }, // 签到统计查询结果（月）
        calenderCurrentMonth: moment().format('YYYY-MM-DD'),
        // calenderSelectedDate:moment().format('YYYY-MM-DD'),
        calenderSelectedDate: '',
        calenderDataObject: {},

        OneServiceDispatchResult: { status: 200 }, // 单个成套任务
        updateServiceDispatchResult: { status: 200 }, // 成套任务完成

        orientationStatus: 'unlocated', // 打卡范围 unlocated 未定位，in 范围内，out 范围外

        lastOrientationInfo: null,
        currentOrientationInfo: null,
        orientationFailureTimes: 10,

        signCount: 0, // 非现场签到计数

        fileUUID: `ct_sign_in_${new Date().getTime()}`,// 签到照片 id

    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 成套任务完成
         * UpdateServiceDispatch
         * @param {*} param0
         * @param {*} param1
         */
        *updateServiceDispatch({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            yield update({ updateServiceDispatchResult: { status: -1 } });
            const { dispatchId } = yield select(state => state.CTModel);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.UpdateServiceDispatch, {
                ID: dispatchId,
                TaskStatus: 3 // TaskStatus 1 待处理 2 进行中 3 已结束
            });
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('提交成功');
                yield update({
                    serviceDispatchResult: { status: -1 }
                });
                yield put('getServiceDispatch', {
                    params: {}
                });
                yield put(NavigationActions.back());
            }
            yield update({ updateServiceDispatchResult: result });
        },
        /**
         * M_GetALLOperationTask
         * 获取待领取列表
         * @param {*} param0
         * @param {*} param1
         */
        *getServiceDispatch({ payload: { callback = () => { }, params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceDispatch, {
                // const result = yield call(authService.axiosAuthPost, api.pOperationApi.CTApi.GetServiceDispatch, {
                IsServiceUser: true,
                TaskStatus: '1,2' // 1 待办 2 进行中 3 完成
            });
            let newData = [];
            newData = SentencedToEmpty(result, ['data', 'Datas'], []);
            // let status = SentencedToEmpty(result, ['status'], -1);
            // if (status == 200) {
            //     if (unhandleTaskListPageIndex == 1) {
            //         newUnhandleTaskListData = SentencedToEmpty(result, ['data', 'Datas'], []);
            //     } else {
            //         newUnhandleTaskListData = unhandleTaskListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
            //     }
            // }
            yield update({
                // unhandleTaskListTotal: SentencedToEmpty(result, ['data', 'Total'], 0),
                serviceDispatchData: newData,
                serviceDispatchResult: result
            });
            callback();
            setListData(newData);
        },
        /**
         * M_GetALLOperationTask
         * 一条成套任务
         * @param {*} param0
         * @param {*} param1
         */
        *getOneServiceDispatch({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost
                , api.pOperationApi.CTApi.GetServiceDispatch
                , params);
            let newData = [];
            newData = SentencedToEmpty(result, ['data', 'Datas'], []);

            yield update({
                OneServiceDispatchResult: result
            });
        },
        /**
         * M_GetALLOperationTask
         * 获取已完成列表
         * @param {*} param0
         * @param {*} param1
         */
        *getServiceDispatchCompleted({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            const { completedPageIndex, completedPageSize, serviceDispatchCompletedData } = yield select(state => state.CTModel);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceDispatch, {
                pageIndex: completedPageIndex,
                pageSize: completedPageSize,
                IsServiceUser: true,
                TaskStatus: '3' // 1 待办 2 进行中 3 完成
            });
            let newData = [],
                currentPage = [];
            if (completedPageIndex == 1) {
                newData = SentencedToEmpty(result, ['data', 'Datas'], []);
            } else {
                newData = [].concat(serviceDispatchCompletedData);
                currentPage = SentencedToEmpty(result, ['data', 'Datas'], []);
                newData.concat(currentPage);
            }
            yield update({
                serviceDispatchCompletedData: newData,
                serviceDispatchCompletedResult: result
            });
            setListData(newData);
        },
        //GetServiceDispatchTypeAndRecord
        *getServiceDispatchTypeAndRecord({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceDispatchTypeAndRecord, params);
            yield update({
                serviceDispatchTypeAndRecordResult: result
            });
        },
        // AddAcceptanceServiceRecord
        *addAcceptanceServiceRecord(
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
            yield update({ addAcceptanceServiceRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddAcceptanceServiceRecord, params);
            if (result.status == 200) {
                ShowToast('提交成功');
                const handleResult = callback(result);
                if (!handleResult) {
                    yield put(NavigationActions.back());
                    const { dispatchId } = yield select(state => state.CTModel);
                    yield put('getServiceDispatchTypeAndRecord', {
                        params: {
                            dispatchId
                        }
                    });
                }
            }
            yield update({
                addAcceptanceServiceRecordResult: result
            });
        },
        *getAcceptanceServiceRecord({ payload: { params = {}, callback = () => { } } }, { call, put, take, update, select }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetAcceptanceServiceRecord, params);
            if (result.status == 200) {
                // callback(SentencedToEmpty(result, ['data', 'Datas', 0], {}));
                callback(result);
            }
            yield update({
                acceptanceServiceRecordResult: result
            });
        },
        *deleteAcceptanceServiceRecord({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            yield update({ deleteAcceptanceServiceRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteAcceptanceServiceRecord, params);
            if (result.status == 200) {
                ShowToast('删除成功');
                yield put(NavigationActions.back());
                const { dispatchId } = yield select(state => state.CTModel);
                yield put('getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            }
            yield update({
                deleteAcceptanceServiceRecordResult: result
            });
        },

        //反馈上传图片
        *uploadimage({ payload: { image, images = [], callback, uuid } }, { call }) {
            const user = yield loadToken();
            const encryData = getEncryptData();
            let formdata = new FormData();
            // 单张
            var file = { uri: image.uri, type: 'multipart/form-data', name: 'image.jpg' };
            formdata.append('file', file);
            formdata.append('FileActualType', '2');
            formdata.append('FileUuid', uuid);
            formdata.append('type', '2');
            // fetch(UrlInfo.DataAnalyze + api.pOperationApi.CTApi.UploadFiles, {
            fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.UploadFiles, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    authorization: 'Bearer ' + user.dataAnalyzeTicket,
                    ProxyCode: encryData
                }
            })
                .then(res => {
                    console.log('res = ', res);
                    let url = JSON.parse(res._bodyInit).Datas;
                    console.log('url = ', url);
                    // let url = SentencedToEmpty(JSON.parse(res._bodyInit), ['Datas', 'fNameList', 0], '');

                    for (let index = 0; index < images.length; index++) {
                        let attachIDArr = url.split('/');
                        images[index].attachID = attachIDArr[attachIDArr.length - 1];
                        images[index].url = url;
                    }
                    callback(images, true);
                })
                .catch(error => {
                    console.log('error = ', error);
                    callback('', false);
                });
        },
        //反馈上传图片 测试
        *uploadimage_test({ payload: { image, images = [], callback, uuid } }, { call }) {
            console.log('uploadimage_test');
            const user = yield loadToken();
            let formdata = new FormData();
            // 单张
            var file = { uri: image.uri, type: 'multipart/form-data', name: 'image.jpg' };
            formdata.append('file', file);
            formdata.append('FileActualType', '2');
            formdata.append('FileUuid', uuid);
            // formdata.append('type', '2');
            fetch(UrlInfo.BaseUrl + api.pollutionApi.Alarm.uploadimage, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    authorization: 'Bearer ' + user.dataAnalyzeTicket,
                    ProxyCode: '62545'
                }
            })
                .then(res => {
                    console.log('success res = ', res);
                    let url = JSON.parse(res._bodyInit).Datas;

                    for (let index = 0; index < images.length; index++) {
                        let attachIDArr = url.split('/');
                        images[index].attachID = attachIDArr[attachIDArr.length - 1];
                        images[index].url = url;
                    }
                    callback(images, true);
                })
                .catch(error => {
                    console.log('error = ', error);
                    callback('', false);
                });
        },
        //删除反馈图片
        *DelPhotoRelation({ payload: { params } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteAttach, {
                Guid: params.code,
                noCancelFlag: true
            });
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                params.callback();
            } else {
                ShowToast('删除失败');
            }
        },
        //上传文件
        *uploadFile({ payload: { file, callback, uuid } }, { call }) {
            if (file && file.size > 10000000) {
                callback('文件过大，上传失败', false);
                return;
            }
            let encryData = getEncryptData();

            const user = yield loadToken();
            var upfile = { uri: 'file://' + file.uri, type: 'multipart/form-data', name: EncodeUtf8(file.name) };
            let formdata = new FormData();
            formdata.append('file', upfile);
            formdata.append('FileUuid', uuid);
            formdata.append('FileTypes', '2');
            fetch(UrlInfo.DataAnalyze + api.pOperationApi.CTApi.UploadFiles, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    Authorization: 'Bearer ' + user.dataAnalyzeTicket,
                    ProxyCode: encryData
                }
            })
                .then(res => {
                    if (res._bodyText && res._bodyText != '') {
                        let obj = JSON.parse(res._bodyText);
                        let url = JSON.parse(res._bodyInit).Datas;
                        if (obj.IsSuccess) {
                            // file.AttachID = obj.Datas;
                            let attachIDArr = url.split('/');
                            file.attachID = attachIDArr[attachIDArr.length - 1];
                            file.url = url;
                        }
                    }
                    callback(file, true);
                })
                .catch(error => {
                    // console.log(error);
                    callback('上传失败' + error, false);
                });
        },
        /**
         * GetProjectEntPointSysModel
         * 获取 projectId对应的企业、点位信息
         */
        *getProjectEntPointSysModel(
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
            yield update({
                projectEntPointSysModelResult: { status: -1 }
            });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetProjectEntPointSysModel, params);
            if (result.status == 200) {
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        projectEntPointSysModelResult: result
                    });
                }
            } else {
                yield update({
                    projectEntPointSysModelResult: result
                });
            }
        },
        /**
         * GetCTSignInProject
         * 获取当前登录人今天已签到未签退的签到信息
         * 获取某个企业的签到信息
         */
        *getCTSignInProject(
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
            /**
             * params:{projectId:123}
             */
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetCTSignInProject, params);
            if (result.status == 200) {
                const handleResult = callback(result);
                if (handleResult) {
                    // 表示获取最近的打卡记录
                    let data = SentencedToEmpty(result, ['data', 'Datas', 0], null);
                    if (data) {
                        // PLongitude  PLatitude  项目坐标
                        yield update({
                            ctSignInProject: result,
                            selectedProject: {
                                ID: SentencedToEmpty(data, ['ProjectId'], ''),
                                Range: SentencedToEmpty(data, ['CheckRanges'], ''),
                                // , Latitude: SentencedToEmpty(data,['Latitude'],0)
                                // , Longitude: SentencedToEmpty(data,['Longitude'],0)
                                Latitude: SentencedToEmpty(data, ['PLatitude'], 0),
                                Longitude: SentencedToEmpty(data, ['PLongitude'], 0),
                                ProjectName: SentencedToEmpty(data, ['ProjectName'], ''),
                                ProjectId: SentencedToEmpty(data, ['ProjectId'], ''),
                                EntId: SentencedToEmpty(data, ['EntId'], ''),
                                EntName: SentencedToEmpty(data, ['EntName'], '')
                            }
                        });
                    } else {
                        yield update({ ctSignInProject: result });
                    }
                } else {
                    yield update({ ctSignInProject: result });
                }
                //     if (!handleResult) {
                //         yield update({
                //             projectEntPointSysModelResult:result
                //         });
                //     }
            }
        },
        /**
         * GetCheckInProjectList
         * 获取成套签到项目列表
         */
        *GetCheckInProjectList({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            const { projectInfoListSearchStr } = yield select(state => state.CTModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetCheckInProjectList, { keyValue: projectInfoListSearchStr });
            if (result.status == 200) {
                yield update({
                    checkInProjectListResult: result,
                    checkInProjectList: SentencedToEmpty(result, ['data', 'Datas'], [])
                });
                setListData(SentencedToEmpty(result, ['data', 'Datas'], []));
            } else {
                yield update({
                    checkInProjectListResult: result,
                    checkInProjectList: []
                });
                setListData([]);
            }
        },
        /**
         * CTSignIn
         * 成套签到
         * @param {*} param0
         * @param {*} param1
         */
        *doCTSignIn(
            {
                payload: {
                    params = {},
                    successCallback = () => {
                        return false;
                    }
                }
            },
            { call, put, take, update, select }
        ) {
            const { selectedProject } = yield select(state => state.CTModel);
            // latitude:location.coords.latitude
            // ,longitude:location.coords.longitude
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.CTSignIn, {
                Files: SentencedToEmpty(params, ['Files'], 'emptyProjectOrProperty'), // 图片uuid
                checkType: SentencedToEmpty(params, ['checkType'], 'emptyProjectOrProperty'), //签到CheckType=1 签退CheckType=2
                projectId: SentencedToEmpty(selectedProject, ['ProjectId'], 'emptyProjectOrProperty'), //项目ID
                entId: SentencedToEmpty(selectedProject, ['EntId'], 'emptyProjectOrProperty_EntId'), //项目ID
                longitude: SentencedToEmpty(params, ['longitude'], 0), //经度
                latitude: SentencedToEmpty(params, ['latitude'], 0), //纬度
                checkRange: SentencedToEmpty(selectedProject, ['Range'], 'emptyProjectOrProperty') //打开半径
            });

            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                successCallback();
                yield put('getCTSignInProject', {
                    params: {
                        projectId: SentencedToEmpty(selectedProject, ['ProjectId'], 'emptyProjectOrProperty')
                    }
                });
            } else {
                CloseToast('签到结束');
                ShowToast('签到失败');
                // 向服务端记录日志
                let logData = {};
                logData.functionType = `CTSignIn`;
                const token = getToken();
                logData.UserAccount = token.UserAccount
                logData.UserName = token.UserName
                logData.status = result.status
                logData.url = api.pOperationApi.CTApi.CTSignIn;
                logData.params = {
                    Files: SentencedToEmpty(params, ['Files'], 'emptyProjectOrProperty'), // 图片uuid
                    checkType: SentencedToEmpty(params, ['checkType'], 'emptyProjectOrProperty'), //签到CheckType=1 签退CheckType=2
                    projectId: SentencedToEmpty(selectedProject, ['ProjectId'], 'emptyProjectOrProperty'), //项目ID
                    entId: SentencedToEmpty(selectedProject, ['EntId'], 'emptyProjectOrProperty_EntId'), //项目ID
                    longitude: SentencedToEmpty(params, ['longitude'], 0), //经度
                    latitude: SentencedToEmpty(params, ['latitude'], 0), //纬度
                    checkRange: SentencedToEmpty(selectedProject, ['Range'], 'emptyProjectOrProperty') //打开半径
                };
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
         * OffsiteSign
         * 非现场签到
         * @param {*} param0
         * @param {*} param1
         */
        * offsiteSign(
            {
                payload: {
                    params = {}
                    , successCallBack = () => { }
                    , failCallBack = () => { }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.OffsiteSign, params);
            // 关闭提交loading

            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                successCallBack();
            } else {
                failCallBack(result);
                // 向服务端记录日志
                let logData = {};
                logData.functionType = `ct_offsiteSign`;
                const token = getToken();
                logData.UserAccount = token.UserAccount
                logData.UserName = token.UserName
                logData.status = result.status
                logData.url = api.pOperationApi.CTApi.OffsiteSign;
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
         * GetTodayOffsiteSign
         * 非现场签到次数
         * @param {*} param0
         * @param {*} param1
         */
        * getTodayOffsiteSign(
            {
                payload: {
                    params = {}
                    , successCallBack = () => { }
                    , failCallBack = () => { }
                }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetTodayOffsiteSign, params);
            // 关闭提交loading
            if (result.status == 200) {
                yield update({
                    signCount: SentencedToEmpty(result, ["data", "Datas"], '-')
                });
                successCallBack();
            } else {
                failCallBack(result);
            }
        },
        /**
         * GetCTSignInHistoryList
         * 签到统计
         * 弃用
         */
        * getCTSignInHistoryList(
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

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetCTSignInHistoryList, params);
            /**
             * item.date = date;
             * item.style = { backgroundColor: '#fc953f' };
             */
            const rawData = SentencedToEmpty(result, ['data', 'Datas'], []);
            let calenderData = [],
                dataObject = {};
            rawData.map((item, index) => {
                for (var key in item) {
                    calenderData.push({
                        date: key,
                        style: { backgroundColor: '#4AA0FF' }
                    });
                    dataObject[key] = item[key];
                }
            });
            yield update({ calenderData, ctSignInHistoryListResult: result, calenderDataObject: dataObject });
            // if (result.status == 200) {
            //     const handleResult = callback(result);
            //     if (!handleResult) {
            //         yield update({
            //             projectEntPointSysModelResult:result
            //         });
            //     }
            // }
        },
        /**
         * GetOffsiteSignHistoryList
         * 非现场签到统计
         * 弃用
         */
        * getOffsiteSignHistoryList(
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

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetOffsiteSignHistoryList, params);
            /**
             * item.date = date;
             * item.style = { backgroundColor: '#fc953f' };
             */
            const rawData = SentencedToEmpty(result, ['data', 'Datas'], []);
            let calenderData = [],
                dataObject = {};
            rawData.map((item, index) => {
                for (var key in item) {
                    calenderData.push({
                        date: key,
                        style: { backgroundColor: '#4AA0FF' }
                    });
                    dataObject[key] = item[key];
                }
            });
            yield update({ calenderData, ctSignInHistoryListResult: result, calenderDataObject: dataObject });
            // if (result.status == 200) {
            //     const handleResult = callback(result);
            //     if (!handleResult) {
            //         yield update({
            //             projectEntPointSysModelResult:result
            //         });
            //     }
            // }
        },
        /**
         * GetSignHistoryList
         * 现场签到和非现场签到合并接口
         * @param {*} param0 
         * @param {*} param1 
         */
        * getSignHistoryList(
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
            // const { projectInfoListSearchStr } = yield select(state => state.CTModel);

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetSignHistoryList
                , params);
            /**
             * item.date = date;
             * item.style = { backgroundColor: '#fc953f' };
             */
            const rawData = SentencedToEmpty(result, ['data', 'Datas'], []);
            let calenderData = [],
                dataObject = {};
            rawData.map((item, index) => {
                for (var key in item) {
                    calenderData.push({
                        date: key,
                        style: { backgroundColor: '#4AA0FF' }
                    });
                    dataObject[key] = item[key];
                }
            });
            yield update({ calenderData, ctSignInHistoryListResult: result, calenderDataObject: dataObject });
            // if (result.status == 200) {
            //     const handleResult = callback(result);
            //     if (!handleResult) {
            //         yield update({
            //             projectEntPointSysModelResult:result
            //         });
            //     }
            // }
        }
    },

    subscriptions: {}
});
