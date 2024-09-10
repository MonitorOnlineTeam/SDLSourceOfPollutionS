/*
 * @Description: 督察整改
 * @LastEditors: hxf
 * @Date: 2022-11-30 14:20:13
 * @LastEditTime: 2023-07-13 14:30:41
 * @FilePath: /SDLMainProject36/app/pOperationModels/supervision.js
 * @服务端开发人员 薛鹏宇
 */
import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty, ShowLoadingToast, CloseToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import * as authService from '../services/auth';

export default Model.extend({
    namespace: 'supervision',
    state: {
        rectificationNumResult:null,// 设施核查整改 计数器
        currentList:0,
        // 待整改 未整改2
        toBeCorrectedParams:{
            Rectification:0,
            Status:2,
            inspectorRectificationListIndex: 1,
            "pageSize": 20
        },
        toBeCorrectedResult:{status:-1},
        toBeCorrectedDataList:[],
        // 已整改 1
        alreadyCorrectedParams:{
            Rectification:0,
            Status:1,
            inspectorRectificationListIndex: 1,
            "pageSize": 20
        },
        alreadyCorrectedResult:{status:-1},
        alreadyCorrectedDataList:[],
        // 申诉中 5
        underAppealParams:{
            Rectification:0,
            Status:5,
            inspectorRectificationListIndex: 1,
            "pageSize": 20
        },
        underAppealResult:{status:-1},
        underAppealDataList:[],


        pageSize:20,
        Rectification:0,// 数据类型 0:未整改，1:已整改
        Status:2, // 列表类型 已整改1 未整改2 申诉中5
        inspectorRectificationListIndex: 1,
        inspectorRectificationListTotal: 0,
        inspectorRectificationListResult: { status: -1 },
        inspectorRectificationListData: [],
        correctedRectification:1,// 数据类型 0:未整改，1:已整改
        correctedIndex: 1,
        correctedTotal: 0,
        correctedResult: { status: -1 },
        correctedData: [],
        correctedBeginTime: moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'),
        correctedEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        rectificationID:'',// 督查记录详情 id
        inspectorRectificationInfoResult:{status:-1},// 督查记录详情 结果
        editItem:{},
        title:'',// 编辑页面显示的文字
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        
        /**
         * 手机端督察整改   待整改列表 
         * @param {*} Rectification
         * @param {*} Btime
         * @param {*} Etime
         * @param {*} pageIndex
         * @param {*} pageSize
         */
        *getToBeCorrectedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { toBeCorrectedParams, toBeCorrectedDataList } = yield select(state => state.supervision);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList
                , {...toBeCorrectedParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (toBeCorrectedParams.index == 1) {
                    yield update({ toBeCorrectedResult: result
                        , toBeCorrectedDataList:data
                    });
                    setListData(data);
                } else {
                    let newData =  toBeCorrectedDataList.concat(data);
                    yield update({ toBeCorrectedResult: result
                        , toBeCorrectedDataList:newData
                    });
                    setListData(newData);
                }
            } else {
                yield update({ toBeCorrectedResult: result, toBeCorrectedDataList:[] });
            }
        },
        /**
         * 手机端督察整改 已整改 列表
         */
        *getAlreadyCorrectedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { alreadyCorrectedParams, alreadyCorrectedDataList } = yield select(state => state.supervision);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList
                , {...alreadyCorrectedParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (alreadyCorrectedParams.index == 1) {
                    yield update({ alreadyCorrectedResult: result
                        , alreadyCorrectedDataList:data
                    });
                    setListData(data);
                } else {
                    let newData =  alreadyCorrectedDataList.concat(data);
                    yield update({ alreadyCorrectedResult: result
                        , alreadyCorrectedDataList:newData
                    });
                    setListData(newData);
                }
            } else {
                yield update({ alreadyCorrectedResult: result, alreadyCorrectedDataList:[] });
            }
        },
        /**
         * 手机端督察整改 申诉中 列表
         */
        *getUnderAppealList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { underAppealParams, underAppealDataList } = yield select(state => state.supervision);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList
                , {...underAppealParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (underAppealParams.index == 1) {
                    yield update({ underAppealResult: result
                        , underAppealDataList:data
                    });
                    setListData(data);
                } else {
                    let newData =  underAppealDataList.concat(data);
                    yield update({ underAppealResult: result
                        , underAppealDataList:newData
                    });
                    setListData(newData);
                }
            } else {
                yield update({ underAppealResult: result, underAppealDataList:[] });
            }
        },
        // *getToBeCorrectedList({ 
        //     payload: { setListData = (data, duration) => {} }
        // }, { call, put, take, update, select }) {

        //     let { toBeCorrectedParams
        //         , inspectorRectificationListTotal
        //         , inspectorRectificationListData } = yield select(state => state.supervision);
        //     let requestBegin = new Date().getTime();
        //     let params = toBeCorrectedParams
        //     const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList, params);
        //     let status = SentencedToEmpty(result, ['status'], -1);
        //     let newMoData = inspectorRectificationListData;
        //     if (status == 200) {
        //         if (inspectorRectificationListIndex == 1) {
        //             newMoData = SentencedToEmpty(result, ['data', 'Datas'], []);
        //             yield update({ inspectorRectificationListData: newMoData, inspectorRectificationListTotal: SentencedToEmpty(result, ['data', 'Total'], []), inspectorRectificationListResult: result });
        //         } else {
        //             newMoData = inspectorRectificationListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
        //             yield update({ inspectorRectificationListData: newMoData, inspectorRectificationListTotal: SentencedToEmpty(result, ['data', 'Total'], []), inspectorRectificationListResult: result });
        //         }
        //     } else {
        //         yield update({
        //             inspectorRectificationListResult: result
        //         });
        //     }
        //     let requestEnd = new Date().getTime();
        //     setListData(newMoData, requestEnd - requestBegin);
        // },
        /**
         * 手机端督察整改列表
         * @param {*} Rectification
         * @param {*} Btime
         * @param {*} Etime
         * @param {*} pageIndex
         * @param {*} pageSize
         */
        *getInspectorRectificationList({ 
            payload: { setListData = (data, duration) => {} }
        }, { call, put, take, update, select }) {

            let { Rectification
                , Status
                , inspectorRectificationListIndex
                , inspectorRectificationListTotal
                , inspectorRectificationListData } = yield select(state => state.supervision);
            let requestBegin = new Date().getTime();
            let params = {
                "Status":Status,
                "Rectification": Rectification,
                "pageIndex": inspectorRectificationListIndex,
                "pageSize": 20
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = inspectorRectificationListData;
            if (status == 200) {
                if (inspectorRectificationListIndex == 1) {
                    newMoData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ inspectorRectificationListData: newMoData, inspectorRectificationListTotal: SentencedToEmpty(result, ['data', 'Total'], []), inspectorRectificationListResult: result });
                } else {
                    newMoData = inspectorRectificationListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ inspectorRectificationListData: newMoData, inspectorRectificationListTotal: SentencedToEmpty(result, ['data', 'Total'], []), inspectorRectificationListResult: result });
                }
            } else {
                yield update({
                    inspectorRectificationListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        },
        /**
         * 手机端已经督察整改列表
         * @param {*} Rectification
         * @param {*} Btime
         * @param {*} Etime
         * @param {*} pageIndex
         * @param {*} pageSize
         */
        *getCorrectedInspectorRectificationList({ 
            payload: { setListData = (data, duration) => {} }
        }, { call, put, take, update, select }) {

            let { pageSize,
                correctedIndex,
                correctedTotal,
                correctedData,
                correctedBeginTime,
                correctedEndTime
                } = yield select(state => state.supervision);
            let requestBegin = new Date().getTime();
            let params = {
                "Rectification": 1,
                Status:3,
                Btime:correctedBeginTime,
                Etime:correctedEndTime,
                "pageIndex": correctedIndex,
                "pageSize": pageSize
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationList, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = correctedData;
            if (status == 200) {
                if (correctedIndex == 1) {
                    newMoData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ correctedData: newMoData, correctedTotal: SentencedToEmpty(result, ['data', 'Total'], []), correctedResult: result });
                } else {
                    newMoData = correctedData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ correctedData: newMoData, correctedTotal: SentencedToEmpty(result, ['data', 'Total'], []), correctedResult: result });
                }
            } else {
                yield update({
                    correctedResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        },
        /**
         * 手机端督察整改详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getInspectorRectificationInfoList({ 
            payload: { setListData = (data, duration) => {} }
        }, { call, put, take, update, select }) {
            const { rectificationID, Status } = yield select(state => state.supervision);
            let params = {
                // Rectification:0,
                ID:rectificationID,
                Status
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationInfoList, params);
            yield update({inspectorRectificationInfoResult:result})
        },
        /**
         * 手机端督察整改添加
         * @param {*} param0 
         * @param {*} param1 
         */
        *UpdateInspectorRectificationInfo({ 
            payload: {sendParams, callback = (data) => {} }
        }, { call, put, take, update, select }) {
            ShowLoadingToast('正在提交');
            let params = sendParams;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.UpdateInspectorRectificationInfo, params);
            if (result.status == 200&&result.data.IsSuccess == true) {
                callback();
                CloseToast('提交成功');
            } else {
                CloseToast();
                ShowToast('提交失败');
            }
        },
        /**
         * 手机端督察 申诉
         * @param {*} param0 
         * @param {*} param1 
         */
        *AppealInspectorRectificationInfo({ 
            payload: {sendParams, callback = (data) => {} }
        }, { call, put, take, update, select }) {
            ShowLoadingToast('正在提交');
            let params = sendParams;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.AppealInspectorRectificationInfo, params);
            if (result.status == 200&&result.data.IsSuccess == true) {
                callback();
                CloseToast();
                ShowToast('提交成功');
            } else {
                CloseToast();
                ShowToast('提交失败');
            }
        },
        /**
         * 手机端督察 撤回
         * @param {*} param0 
         * @param {*} param1 
         */
        *RevokeInspectorRectificationInfo({ 
            payload: {sendParams, callback = (data) => {} }
        }, { call, put, take, update, select }) {
            ShowLoadingToast('正在撤销这条记录');
            let params = sendParams;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.RevokeInspectorRectificationInfo, params);
            if (result.status == 200) {
                ShowToast('撤回成功');
                callback();
            } else {
                ShowToast('撤回失败');
            }
            // CloseToast('撤销成功');
        },
        /**
         * 手机端督察 计数器
         */
        *GetInspectorRectificationNum({ 
            payload: {sendParams, callback = (data) => {} }
        }, { call, put, take, update, select }) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.supervision.GetInspectorRectificationNum, {});
            yield update({ rectificationNumResult: result});
        },
    },
    subscriptions: {}
});
