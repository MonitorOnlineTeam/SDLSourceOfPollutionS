/*
 * @Description: 安装照片审核
 * @LastEditors: hxf
 * @Date: 2024-03-28 14:08:17
 * @LastEditTime: 2024-06-13 17:20:45
 * @FilePath: /SDLMainProject37/app/pOperationModels/CTEquipmentPicAuditModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast, ShowLoadingToast } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'CTEquipmentPicAuditModel',
    state: {
        tabSelectedIndex: 1, // 1 不合格    2 已提交    3 申诉中
        equipmentAuditRectificationListResult: { status: -1 },
        equipmentAuditRectificationList: [],
        equipmentAuditRectificationNumResult: { status: -1 },// 获取照片审核列表数量
        equipmentAuditRectificationNum: '-',// 工作台显示数字
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * DeleteInstallationPhotosChildByID
         * 删除安装照片整改单条数据
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteInstallationPhotosChildByID(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // yield update({ equipmentAuditRectificationNumResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteInstallationPhotosChildByID
                , params// 1 不合格 2已提交 3申诉中
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                // yield update({
                //     equipmentAuditRectificationNumResult: result,
                //     equipmentAuditRectificationNum: SentencedToEmpty(result, ['data', 'Datas', 'UnqualifiedQuantity'], '-')
                // });
            } else {
                // yield update({
                //     equipmentAuditRectificationNumResult: result
                // });
            }
        },
        /**
         * GetEquipmentAuditRectificationNum
         * 获取照片审核列表参数
         * @param {*} param0 
         * @param {*} param1 
         */
        *getEquipmentAuditRectificationNum(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * UnqualifiedQuantity 不合格数量  
             * AppealsQuantity 申诉中数量 
             * SubmittedQuantity已提交数量
             */
            // yield update({ equipmentAuditRectificationNumResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetEquipmentAuditRectificationNum
                , params// 1 不合格 2已提交 3申诉中
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                yield update({
                    equipmentAuditRectificationNumResult: result,
                    equipmentAuditRectificationNum: SentencedToEmpty(result, ['data', 'Datas', 'UnqualifiedQuantity'], '-')
                });
            } else {
                yield update({
                    equipmentAuditRectificationNumResult: result
                });
            }
        },
        /**
         * GetEquipmentAuditRectificationList
         * 获取照片审核列表参数
         * @param {*} param0 
         * @param {*} param1 
         */
        *getEquipmentAuditRectificationList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ equipmentAuditRectificationListResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetEquipmentAuditRectificationList
                , params// 1 不合格 2已提交 3申诉中
            );
            if (result.status == 200) {
                // 0 未上传 1 已上传 2 待上传
                let dataList = [].concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                let photoList = [];
                dataList.map((item, index) => {
                    photoList = [].concat(SentencedToEmpty(item, ['ChildList'], []));
                    photoList.map((photoItem, photoIndex) => {
                        const ImgList = SentencedToEmpty(photoItem
                            , ['InstallationPhoto', 'ImgList'], []);
                        if (ImgList.length > 0) {
                            photoItem.uploadStatus = 1;
                        } else {
                            photoItem.uploadStatus = 0;
                        }
                    });
                    item.ChildList = photoList;
                });
                yield update({
                    equipmentAuditRectificationListResult: result,
                    equipmentAuditRectificationList: dataList
                    // SentencedToEmpty(result, ['data', 'Datas'], []),
                });
                setListData(dataList);
            } else {
                yield update({
                    equipmentAuditRectificationListResult: result
                });
                setListData([]);
            }
        },
        /**
         * EquipmentAuditRectificationSubmit
         * 整改提交
         * @param {*} param0 
         * @param {*} param1 
         */
        *equipmentAuditRectificationSubmit(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            // yield update({ addInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.EquipmentAuditRectificationSubmit
                , params
            );
            console.log('result = ', result);
            if (result.status == 200) {
                CloseToast();
                yield put(NavigationActions.back());
                yield put({
                    type: 'getEquipmentAuditRectificationList'
                    , payload: { params: { "auditType": tabSelectedIndex } }
                });
                yield put({
                    type: 'getEquipmentAuditRectificationNum'
                    , payload: { params: {} }
                });
            } else {
                CloseToast();
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], ''));
            }
        },
        /**
         * EquipmentAuditRectificationAppeal
         * 申诉提交
         * @param {*} param0 
         * @param {*} param1 
         */
        *equipmentAuditRectificationAppeal(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            ShowLoadingToast('正在提交');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.EquipmentAuditRectificationAppeal
                , params
            );
            if (result.status == 200) {
                CloseToast();
                yield put(NavigationActions.back());
                yield put(NavigationActions.back());
                yield put({
                    type: 'getEquipmentAuditRectificationList'
                    , payload: { params: { "auditType": tabSelectedIndex } }
                });
                yield put({
                    type: 'getEquipmentAuditRectificationNum'
                    , payload: { params: {} }
                });
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