/*
 * @Description: 成套 服务报告整改
 * @LastEditors: hxf
 * @Date: 2024-03-28 14:08:17
 * @LastEditTime: 2024-06-07 14:13:32
 * @FilePath: /SDLMainProject37/app/pOperationModels/CTServiceReportRectificationModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast, ShowLoadingToast, ShowResult } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { year } from '../components/SDLPicker/constant/baseConstant';

export default Model.extend({
    namespace: 'CTServiceReportRectificationModel',
    state: {
        tabSelectedIndex: 1, // 1 不合格    2 已提交    3 申诉中
        stayCheckServicesListResult: { status: -1 },
        stayCheckServicesList: [],

        serviceDescResult: { status: -1 }, // 服务报告详情请求结果
        editData: [],// 可编辑数据
        firstLevelSelectedIndex: 0, // 整改详情 选中大类

        auditServiceStatus: { status: 200 }, // 申诉或者整改的提交状态

        serviceStatusNum: '-', // 服务报告整改工作台数字
        serviceStatusNumResult: { status: -1 }, // 服务报告整改工作台数字请求结果
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * GetServiceStatusNum
         * 手机端服务报告整改数字
         */
        *GetServiceStatusNum(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ serviceStatusNumResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.ServiceReportRectification.GetServiceStatusNum
                , {}
            );
            yield update({
                serviceStatusNum: SentencedToEmpty(result, ['data', 'Datas', 'UnqualifiedQuantity'], '-'), // 服务报告整改工作台数字
                serviceStatusNumResult: result
            });
            // if (result.status == 200
            //     && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
            // } else {
            //     yield update({
            //         stayCheckServicesListResult: result
            //     });
            // }
        },
        /**
         * GetStayCheckServices
         * 服务报告审核列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getStayCheckServices(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ stayCheckServicesListResult: { status: -1 } });
            //tabSelectedIndex 1 不合格 2已提交 3申诉中
            const { tabSelectedIndex } = yield select(state => state.CTServiceReportRectificationModel)
            /**
             * AuditStatus == "2"  "不合格" ; 
             * AuditStatus == "4"  "已提交" ; 
             * AuditStatus == "5"  "申诉中"
             *  */
            let _auditStatus = 2;
            if (tabSelectedIndex == 1) {
                _auditStatus = 2;
            } else if (tabSelectedIndex == 2) {
                _auditStatus = 4;
            } else if (tabSelectedIndex == 3) {
                _auditStatus = 5;
            }
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.ServiceReportRectification.GetStayCheckServices
                , {
                    "AuditStatus": _auditStatus
                }
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                // 2 不合格 4 已提交 5 申诉中
                let dataList = [].concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                yield update({
                    stayCheckServicesListResult: result,
                    stayCheckServicesList: dataList
                });
                setListData(dataList);
            } else {
                yield update({
                    stayCheckServicesListResult: result
                });
                setListData([]);
            }
        },
        /**
         * GetServiceDesc
         * 获取服务报告详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getServiceDesc(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            // const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            // yield update({ addInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.ServiceReportRectification.GetServiceDesc
                , params
            );
            // console.log('result = ', result);

            if (result.status == 200
                && result.data.IsSuccess
            ) {
                yield update({
                    serviceDescResult: result,
                    editData: SentencedToEmpty(result, ['data', 'Datas', 'ReportDesc'], [])
                })
                // CloseToast();
                // yield put(NavigationActions.back());
                // yield put({
                //     type: 'getEquipmentAuditRectificationList'
                //     , payload: { params: { "auditType": tabSelectedIndex } }
                // });
            } else {
                yield update({
                    serviceDescResult: result
                })
            }
        },
        /**
         * AuditService
         * 审查服务报告
         * @param {*} param0 
         * @param {*} param1 
         */
        *auditService(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {

            const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            ShowLoadingToast('正在提交');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.ServiceReportRectification.AuditService
                , params
            );
            if (result.status == 200
                && result.data.IsSuccess) {
                CloseToast();
                callback();
                // yield put(NavigationActions.back());
                // yield put(NavigationActions.back());
                // yield put({
                //     type: 'getEquipmentAuditRectificationList'
                //     , payload: { params: { "auditType": tabSelectedIndex } }
                // });
            } else {
                CloseToast();
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            }
        },
        // *getWorkRecord(
        *getInstallationPhotosRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetInstallationPhotosRecord
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        installationPhotosRecordResult: result
                    });
                }
            } else {
                yield update({
                    installationPhotosRecordResult: result
                });
            }
        },
        // 加载项目
        *getInstallationItemsList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetInstallationItemsList
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        installationItemsListResult: result
                    });
                }
            } else {
                yield update({
                    installationItemsListResult: result
                });
            }
        },
        // *deleteWorkRecord(
        *deleteInstallationPhotosRecord(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ deleteInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteInstallationPhotosRecord
                , params
            );
            if (result.status == 200) {
                ShowToast('删除成功');
                yield put(NavigationActions.back());
                const { dispatchId } = yield select(state => state.CTModel)
                yield put('CTModel/getServiceDispatchTypeAndRecord', {
                    params: {
                        dispatchId
                    }
                });
            }
            yield update({
                deleteInstallationPhotosRecordResult: result
            });
        },
    },

    subscriptions: {}
});