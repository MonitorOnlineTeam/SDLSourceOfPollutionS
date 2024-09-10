/*
 * @Description: 成套 备件更换
 * @LastEditors: hxf
 * @Date: 2024-03-28 14:08:17
 * @LastEditTime: 2024-05-16 17:24:51
 * @FilePath: /SDLMainProject37/app/pOperationModels/CTSparePartsChangeModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast, ShowLoadingToast, ShowResult, createAction } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';


export default Model.extend({
    namespace: 'CTSparePartsChangeModel',
    state: {
        cemsSystemModelInventoryResult: { status: -1 }, // 获取所有的系统型号参数 结果
        cisPartsListResult: { status: -1 }, // 获取CIs申请单列表 结果

        equipmentInstalled: -1,// 点位情况 1有监测点    2设备未安装
        upDateEquipmentInstalled: -1,// 点位情况 1有监测点    2设备未安装
        FailureCauseList: [], //  故障原因列表
        addSpareReplacementRecordResult: { status: -1 },// 添加备件更换记录请求结果

        SpareReplacementRecordIndex: 1,
        SpareReplacementRecordPageSize: 20,
        SpareReplacementRecordType: 2, // 1.派单备件更换2.工作台备件更换
        SpareReplacementRecordTotal: 0,
        SpareReplacementRecordKeyVal: '', // 更换历史记录 搜索关键词
        SpareReplacementRecordList: [],// 备件更换历史记录
        SpareReplacementRecordListResult: { status: -1 },// 备件更换记录请求结果
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * GetCemsSystemModelInventory
         * 获取所有的系统型号参数
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCemsSystemModelInventory(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // params.calendarDate = moment().format('YYYY-MM-DD');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTSparePartsChangeModel.GetCemsSystemModelInventory
                , {
                    "Status": 1,// 必传值
                    "pageIndex": 1,
                    "pageSize": 200000  // （传大点）
                }
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                // // 2 不合格 4 已提交 5 申诉中
                // let dataList = [].concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                yield update({
                    cemsSystemModelInventoryResult: result,
                    // stayCheckServicesList: dataList
                });
                // setListData(dataList);
            } else {
                yield update({
                    cemsSystemModelInventoryResult: result
                });
                // setListData([]);
            }
        },
        /**
         * GetCisPartsList
         * 获取CIs申请单列表
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCisPartsList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield put(createAction('GeneralSearchModel/updateState')({
                remoteResult: { status: -1 },
            }));
            const { keyWords } = yield select(state => state.GeneralSearchModel);
            // if (keyWords == '') {
            //     yield put(createAction('GeneralSearchModel/updateState')({
            //         dataList: [],
            //         remoteResult: { status: 200 },
            //     }));
            // } else {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTSparePartsChangeModel.GetCisPartsList
                , {
                    keyVal: keyWords
                }
            );
            yield update({
                cisPartsListResult: result
                , failureCause: SentencedToEmpty(result
                    , ['data', 'Datas', 'FailureCause'], []
                ),//
            })
            if (result.status == 200) {
                // CloseToast();
                yield put(createAction('GeneralSearchModel/updateState')({
                    dataList: SentencedToEmpty(result
                        , ['data', 'Datas', 'CisCTParts'], []
                    ),
                    remoteResult: result,
                }));
            } else {
                yield put(createAction('GeneralSearchModel/updateState')({
                    dataList: SentencedToEmpty(result
                        , ['data', 'Datas', 'CisCTParts'], []
                    ),
                    remoteResult: result,
                }));
            }
            // }
        },
        /**
         * GetAppOperationPlanByPointList
         * 获取单点运维计划时间轴
         * @param {*} param0 
         * @param {*} param1 
         */
        *getAppOperationPlanByPointList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {

            const { tabSelectedIndex } = yield select(state => state.CTEquipmentPicAuditModel);
            ShowLoadingToast('正在提交');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.GetAppOperationPlanByPointList
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
        /**
         * AddSpareReplacementRecord
         * 获取单点运维计划时间轴
         * @param {*} param0 
         * @param {*} param1 
         */
        *addSpareReplacementRecord(
            {
                payload: { params = {}, successCallback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.AddSpareReplacementRecord
                , params
            );

            yield update({
                addSpareReplacementRecordResult: result
            })
            CloseToast();
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                ShowToast('提交成功');
                successCallback();
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * GetSpareReplacementRecordList
         * 成套备件更换 历史纪录
         * @param {*} param0 
         * @param {*} param1 
         */
        *getSpareReplacementRecordList(
            {
                payload: { params = {}
                    , setListData = () => { }
                    , successCallback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { SpareReplacementRecordList
                , SpareReplacementRecordIndex,
                SpareReplacementRecordPageSize,
                SpareReplacementRecordType, // 1.派单备件更换2.工作台备件更换
                SpareReplacementRecordKeyVal,// 搜索关键词
            } = yield select(state => state.CTSparePartsChangeModel);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.OperationPlan.GetSpareReplacementRecordList
                , {
                    ...params,
                    pageIndex: SpareReplacementRecordIndex
                    , pageSize: SpareReplacementRecordPageSize
                    , "recordType": SpareReplacementRecordType, // 1.派单备件更换2.工作台备件更换
                    KeyVal: SpareReplacementRecordKeyVal
                }
            );
            let newData = [];
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                const handleStatus = successCallback(result);
                if (!handleStatus) {
                    if (SpareReplacementRecordIndex == 1) {
                        newData = SentencedToEmpty(result, ['data', 'Datas'], []);
                        yield update({
                            SpareReplacementRecordList: newData,
                            SpareReplacementRecordListResult: result
                        })
                        setListData(newData);
                    } else {
                        newData = [].concat(SpareReplacementRecordList);
                        newData = newData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                        yield update({
                            SpareReplacementRecordList: newData,
                            SpareReplacementRecordListResult: result
                        })
                        setListData(newData);
                    }
                }
            } else {
                yield update({
                    SpareReplacementRecordList: [],
                    SpareReplacementRecordListResult: result
                })
                setListData([]);
            }
        },
        /**
         * DeleteSpareReplacementRecord
         * 删除备件更换记录
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteSpareReplacementRecord(
            {
                payload: { params = {}, successCallback = () => { }
                    , failCallback = () => { }
                }
            },
            { call, put, take, update, select }
        ) {
            yield update({ deleteInstallationPhotosRecordResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTSparePartsChangeModel.DeleteSpareReplacementRecord
                , params
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                ShowToast('删除成功');
                successCallback();
            } else {
                ShowToast('删除失败');
                failCallback();
            }
            yield update({
                deleteInstallationPhotosRecordResult: result
            });
        },
    },

    subscriptions: {}
});