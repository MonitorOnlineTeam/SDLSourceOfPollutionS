/*
 * @Description: 成套待办
 * @LastEditors: hxf
 * @Date: 2023-09-14 13:55:06
 * @LastEditTime: 2025-04-17 16:04:40
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationModels/zbRepairRecordModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, EncodeUtf8, createAction, CloseToast, ShowLoadingToast } from '../utils';
import * as authService from '../services/auth';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';
import { getEncryptData, getToken, loadToken } from '../dvapack/storage';
import { UrlInfo } from '../config';

export default Model.extend({
    namespace: 'zbRepairRecordModel',
    state: {
        equipmentList: [],
        RepairRecordZBResult: { status: -1 },
        Content: {},
        "taskID": '',
        "typeID": '',
        recordList: [],
        signContent: '',
        oneRepairRecord: {
            EquipmentId: '',//设备ID
            RepairDescribe: '',//检修情况描述
            ReplaceComponents: '',//更换部件
            RepairAfterRun: '',//维修后系统运行情况
            StationClean: '',//站房清理
            ShutdownSituation: '',//停机检修情况总结
            Remark: '',//备注
        },
        repairRecordIndex: -1,
        BDRYPic: [],//维修后图片
        BDJGPic: [], //维修前图片(显示）
        delItemIndex: -1,// 主表删除子表的索引
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取维修记录-淄博
         * GetRepairRecordZB
         * @param {*} param0
         * @param {*} param1
         */
        *getRepairRecordZB({ payload: { params = {}, setListData = () => { } } }, { call, put, take, update, select }) {
            console.log('params = ', params);
            const {
                taskID,
                typeID,
            } = yield select(state => state.zbRepairRecordModel);
            let _params = {
                taskID,
                typeID,
            }
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetRepairRecordZB, _params);
            console.log('result = ', result);
            if (result.status == 200) {
                // data Datas 0 CEMSList NMHCCEMSList
                let CEMSList = SentencedToEmpty(result, ['data', 'Datas', 0, 'CEMSList'], []);
                CEMSList.map(item => {
                    item.showStr = '常规CEMS-' + item.Name

                })
                let NMHCCEMSList = SentencedToEmpty(result, ['data', 'Datas', 0, 'NMHCCEMSList'], []);
                NMHCCEMSList.map(item => {
                    item.showStr = 'NMHC-CEMS-' + item.Name

                })
                let equipmentList = [].concat(CEMSList, NMHCCEMSList);
                console.log('equipmentList = ', equipmentList);
                let Content = SentencedToEmpty(result, ['data', 'Datas', 0, 'Main', 'Content'], {});
                Content.WorkingDateBegin = moment(Content.WorkingDateBegin).format('YYYY-MM-DD HH:mm');
                Content.WorkingDateEnd = moment(Content.WorkingDateEnd).format('YYYY-MM-DD HH:mm');
                Content.CheckBTime = moment(Content.CheckBTime).format('YYYY-MM-DD HH:mm');
                Content.CheckETime = moment(Content.CheckETime).format('YYYY-MM-DD HH:mm');
                Content.MaintenanceBeginTime = moment(Content.MaintenanceBeginTime).format('YYYY-MM-DD HH:mm');
                Content.MaintenanceEndTime = moment(Content.MaintenanceEndTime).format('YYYY-MM-DD HH:mm');
                Content.InspectionDate = moment(Content.InspectionDate).format('YYYY-MM-DD HH:mm');
                Content.BDJG = SentencedToEmpty(Content, ['BDJG'], 'BDJG' + new Date().getTime());//维修前图片
                Content.BDRY = SentencedToEmpty(Content, ['BDRY'], 'BDRY' + new Date().getTime());//维修后图片(存图片ID)
                const _BDRYPic = SentencedToEmpty(Content, ['BDRYPic', 'ImgNameList'], []);//维修后图片列表
                let BDRYPic = [];
                _BDRYPic.map(item => {
                    BDRYPic.push({ AttachID: item });
                })
                const _BDJGPic = SentencedToEmpty(Content, ['BDJGPic', 'ImgNameList'], []);//维修前图片
                let BDJGPic = [];
                _BDJGPic.map(item => {
                    BDJGPic.push({ AttachID: item });
                })
                const RecordList = SentencedToEmpty(result, ['data', 'Datas', 0, 'RecordList'], [])
                RecordList.map(item => {
                    if (SentencedToEmpty(item, ['LeaveTime'], '') != '') {
                        item.LeaveTime = moment(item.LeaveTime).format('YYYY-MM-DD HH:mm');
                    }
                    if (item.EquipmentId == 830
                        || item.EquipmentId == 840
                    ) {
                        let equipmentIndex = -1;
                        equipmentIndex = NMHCCEMSList.findIndex((eItem) => {
                            return eItem.ChildID == item.EquipmentId
                        });
                        if (equipmentIndex != -1) {
                            item.EquipmentName = 'NMHC-CEMS-' + item.EquipmentName
                        }
                        equipmentIndex = CEMSList.findIndex((eItem) => {
                            return eItem.ChildID == item.EquipmentId
                        });
                        if (equipmentIndex != -1) {
                            item.EquipmentName = '常规CEMS-' + item.EquipmentName
                        }
                    }
                })
                yield update({
                    RepairRecordZBResult: result,
                    equipmentList,
                    Content: SentencedToEmpty(result, ['data', 'Datas', 0, 'Main', 'Content'], {}),
                    recordList: SentencedToEmpty(result, ['data', 'Datas', 0, 'RecordList'], []),
                    BDRYPic, BDJGPic
                });
            } else {
                yield update({
                    RepairRecordZBResult: result,
                    equipmentList: [],
                });
            }
        },
        /**
         * 新增或更新维修记录-淄博
         * AddOrUpdateRepairRecordZB
         * @param {*} param0
         * @param {*} param1
         */
        * addOrUpdateRepairRecordZB({ payload: { params = {}, callback = () => { } } }, { call, put, take, update, select }) {
            ShowLoadingToast('提交中...')
            const { taskID, typeID
                , Content, recordList, signContent
            } = yield select(state => state.zbRepairRecordModel);
            let _params = {
                "taskID": taskID,
                "typeID": typeID,
                content: Content,
                recordList: recordList,
                signContent
            }
            console.log('_params = ', _params);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddOrUpdateRepairRecordZB, _params);
            CloseToast();
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                callback(true);
                yield put({
                    type: 'getRepairRecordZB',
                    payload: {}
                })
            } else {
                callback(false);
            }
        },
        /**
         * 删除维修记录-淄博
         * DeleteRepairRecordZB 
         */
        * deleteRepairRecordZB({ payload: { params = {}, callback = () => { } } }, { call, put, take, update, select }) {
            ShowLoadingToast('正在删除记录...')
            const { RepairRecordZBResult } = yield select(state => state.zbRepairRecordModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteRepairRecordZB
                , {
                    formMainID: SentencedToEmpty(RepairRecordZBResult, ['data', 'Datas', 0, 'Main', 'ID'], '')
                });
            CloseToast();
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                ShowToast('删除成功');
                callback(true);
            } else {
                ShowToast('删除失败');
                callback(false);
            }
        },
    },

    subscriptions: {}
});
