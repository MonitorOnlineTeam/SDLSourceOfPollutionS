// 现场勘查信息✅，验货单✅，项目交接单，安装报告，72小时调试检测，比对监测报告，验收资料

import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'CTServiceStatisticsModel',
    state: {
        recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表 
        overTimeServiceRecordResult: { status: -1 }, // 超时派单信息 
        timeoutCauseList: [], // 超时服务列表
        timeoutCauseHasData: '', // 是否有超时服务表单

        duplicateServiceHasData: '', // 是否有重复服务表单
        duplicateServiceRecordResult: { status: -1 },// 是否有重复服务信息
        duplicateServiceRecordList: [
            // {
            //     EntID: '',// 企业id
            //     PointID: '',// 点位id
            //     SystemCode: '',// 系统编码 设备型号
            //     InfoList: [
            //         {
            //             QuestionID: '',//原因码表Code
            //             RepeatCount: '',//重复次数
            //             Remark: '',//详细描述
            //         }
            //     ],//重复服务内容
            // }
        ], // 重复服务填报列表

        // 遗留问题填报
        leftoverProblemHasData: null,// 是否有遗留问题
        leftoverProblemProblemDescription: '',// 遗留问题描述
        leftoverProblemResult: { status: -1 },
        leftoverProblemImageUUID: '',
        leftoverProblemImageList: [],

        // 质保内服务
        warrantyServiceRecordResult: { status: -1 }, // 质保内服务获取历史数据
        serviceUnderWarrantyLoadDataStatus: -1,
        serviceUnderWarrantySubmitParams: {
            ID: '',
            RecordId: '', // 成套任务id
            HasData: '', // 是否有表单 （true 是 false 否）
            BeginTime: '',// 本次服务开始时间
            EndTime: '', // 本次服务结束时间
            ProjectCount: '', // 合同要求时长
            ServiceCount: '', // 本次服务时长
            workDuration: '', // 服务最大时长
            ServiceHoursUnderWarranty: '',// 质保内工作时长
            productCategoryList: [
                {
                    Level: '',// 索引
                    Type: '', // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                    InfoList: [
                        {
                            QuestionID: '', //类别ID
                            ServiceCount: '', // 服务时长
                            SolveStatus: '', // 是否解决（true 是 false 否）
                            Remark: '', // 未解决原因
                        }
                    ], // 二级列表
                }
            ], // 一级列表
            serviceReasonsList: [
                {
                    Level: '',// 索引
                    Type: '', // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                    InfoList: [
                        {
                            QuestionID: '', //类别ID
                            ServiceCount: '', // 服务时长
                            SolveStatus: '', // 是否解决（true 是 false 否）
                            Remark: '', // 未解决原因
                        }
                    ], // 二级列表
                }
            ], // 一级列表
        },
        // productCategoryList: [],// 产品类别可选项
        // ServiceReason: [],// 服务原因可选项
        serviceRecordStatusResult: { status: -1 }

    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * 超时、重复派单原因码表 
         * GetRecordQuestion
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因   
        *      68质保内服务-产品类别  69质保内服务-服务原因 
         * @param {*} param1 
         */
        *getRecordQuestion(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ recordQuestionResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetRecordQuestion
                , params
            );
            if (result.status == 200) {
                // const handleResult = callback(result);
                // if (!handleResult) {
                //     ShowToast('提交成功');
                //     yield put(NavigationActions.back());
                // }
                // const { dispatchId } = yield select(state => state.CTModel)
                // yield put('CTModel/getServiceDispatchTypeAndRecord', {
                //     params: {
                //         dispatchId
                //     }
                // });
            }
            yield update({
                recordQuestionResult: result
            });
        },
        /**
         * 超时派单信息 
         * GetOverTimeServiceRecord
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        *getOverTimeServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ overTimeServiceRecordResult: { status: -1 } });
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetOverTimeServiceRecord
                , {
                    RecordId: chengTaoTaskDetailData.ID
                }
            );
            if (result.status == 200) {
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                if (SentencedToEmpty(Datas, ['ID'], '') == '') {
                    yield update({
                        overTimeServiceRecordResult: result,
                        timeoutCauseHasData: '',
                        timeoutCauseList: SentencedToEmpty(Datas, ['resList'], [])
                    });
                } else {
                    yield update({
                        overTimeServiceRecordResult: result,
                        timeoutCauseHasData: SentencedToEmpty(Datas, ['HasData'], false),
                        timeoutCauseList: SentencedToEmpty(Datas, ['resList'], [])
                    });
                }

            } else {
                yield update({
                    overTimeServiceRecordResult: result
                });
            }
        },
        /**
         * 复服务表单 
         * GetRepeatServiceRecord
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        *getRepeatServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            // yield update({ overTimeServiceRecordResult: { status: -1 } });
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetRepeatServiceRecord
                , {
                    RecordId: chengTaoTaskDetailData.ID
                }
            );
            if (result.status == 200) {
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                if (SentencedToEmpty(Datas, ['ID'], '') == ''
                    || !SentencedToEmpty(Datas, ['HasData'], false)) {
                    const handle = callback(result);
                    if (!handle) {
                        yield update({
                            duplicateServiceRecordResult: result,
                            duplicateServiceHasData: SentencedToEmpty(Datas, ['HasData'], ''),
                        });
                    }
                } else {
                    let resList = SentencedToEmpty(Datas, ['resList'], []);
                    resList.map((item, index) => {
                        item.InfoList = item.resList;
                    });
                    const handle = callback(result);
                    if (!handle) {
                        yield update({
                            duplicateServiceRecordResult: result,
                            duplicateServiceHasData: SentencedToEmpty(Datas, ['HasData'], false),
                            duplicateServiceRecordList: resList
                        });
                    }
                }
            } else {
                yield update({
                    duplicateServiceRecordResult: result
                });
            }
        },
        /**
         * 遗留问题表单 
         * GetProblemsServiceRecord
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        *getProblemsServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetProblemsServiceRecord
                , {
                    RecordId: chengTaoTaskDetailData.ID
                }
            );
            if (result.status == 200) {
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                if (SentencedToEmpty(Datas, ['ID'], '') == '') {
                    // 无记录
                    yield update({
                        leftoverProblemResult: result,
                    });
                } else if (!SentencedToEmpty(Datas, ['HasData'], false)) {
                    yield update({
                        leftoverProblemResult: result,
                        leftoverProblemHasData: SentencedToEmpty(Datas, ['HasData'], false),
                    });
                } else {
                    let upDateParams = {
                        leftoverProblemResult: result,
                        leftoverProblemHasData: SentencedToEmpty(Datas, ['HasData'], false),
                        leftoverProblemProblemDescription: SentencedToEmpty(Datas, ['Remark'], false),
                    };
                    const uuid = SentencedToEmpty(Datas, ['File', 0, 'FileUuid'], '');
                    if (uuid != '') {
                        upDateParams.leftoverProblemImageUUID = uuid;
                        // AttachID
                        let imageList = [];
                        SentencedToEmpty(Datas, ['File'], []).map((item, index) => {
                            imageList.push({
                                AttachID: item.FileName,
                            });
                        });
                        upDateParams.leftoverProblemImageList = imageList;
                    }
                    yield update(upDateParams);
                }

            } else {
                yield update({
                    duplicateServiceRecordResult: result
                });
            }
        },
        /**
         * 获取质保内服务表单 
         * GetWarrantyServiceRecord
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        *getWarrantyServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetWarrantyServiceRecord
                , {
                    RecordId: chengTaoTaskDetailData.ID
                }
            );
            if (result.status == 200) {
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                if (SentencedToEmpty(Datas, ['ID'], '') == '') {
                    // 无记录
                    yield update({
                        warrantyServiceRecordResult: result,
                        serviceUnderWarrantySubmitParams: {
                            HasData: '', // 是否有表单 （true 是 false 否）
                        },
                    });
                } else if (!SentencedToEmpty(Datas, ['HasData'], false)) {
                    yield update({
                        warrantyServiceRecordResult: result,
                        serviceUnderWarrantySubmitParams: {
                            ID: SentencedToEmpty(Datas, ['ID'], ''),
                            RecordId: SentencedToEmpty(Datas, ['RecordId'], ''), // 成套任务id
                            // HasData: false, // 是否有表单 （true 是 false 否）
                            HasData: false, // 是否有表单 （true 是 false 否）
                            BeginTime: '',// 本次服务开始时间
                            EndTime: '', // 本次服务结束时间
                            ProjectCount: '', // 合同要求时长
                            ServiceCount: '', // 本次服务时长
                            workDuration: '', // 服务最大时长
                            ServiceHoursUnderWarranty: '',// 质保内工作时长
                            productCategoryList: [

                            ], // 一级列表
                            serviceReasonsList: [

                            ], // 一级列表
                        },
                    });
                } else {
                    yield update({
                        warrantyServiceRecordResult: result,
                        serviceUnderWarrantySubmitParams:
                            SentencedToEmpty(result, ['data', 'Datas'], {})
                    });
                }
            } else {
                yield update({
                    warrantyServiceRecordResult: result
                });
            }
        },
        /**
         * 添加或修改超时派单信息 
         * AddOrUpdOverTimeServiceRecord
         * @param {*} param    
         * @param {*} param1 
         */
        *addOrUpdOverTimeServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * ID 表单ID（有则修改 无则添加）
             * HasData是否有表单 （true 是 false 否）
             * RecordId派单ID
             * InfoList超时原因列表
             *      QuestionID原因码表Code、
             *      OverTime超时时长
             */
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { overTimeServiceRecordResult
                , timeoutCauseHasData
                , timeoutCauseList = [] } = yield select(state => state.CTServiceStatisticsModel)
            const ID = SentencedToEmpty(overTimeServiceRecordResult, ['data', 'Datas', 'ID'], '')
            params.RecordId = chengTaoTaskDetailData.ID;
            params.HasData = timeoutCauseHasData;
            if (typeof ID == 'string' && ID != ''
                && ID.length > 0) {
                params.ID = ID;
            }
            if (timeoutCauseHasData) {
                let InfoList = [];
                timeoutCauseList.map((item, index) => {
                    InfoList.push({
                        QuestionID: item.QuestionID,
                        OverTime: item.OverTime
                    });
                });
                params.InfoList = InfoList;
            }
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddOrUpdOverTimeServiceRecord
                , params
            );
            CloseToast();
            if (result.status == 200) {
                yield put(NavigationActions.back());
                yield put('getServiceRecordStatus', {});
            } else {
                ShowToast(SentencedToEmpty(result, ['Message'], '提交错误'));
            }
        },
        /**
         * 添加修改重复服务表单 
         * AddOrUpdRepeatServiceRecord
         * @param {*} param    
         * @param {*} param1 
         */
        *addOrUpdRepeatServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * ID 表单ID（有则修改 无则添加）
             * HasData是否有表单 （true 是 false 否）
             * RecordId（必传） 派单ID
             * RecordList 一级列表
             *      EntID 企业id
             *      PointID 点位id
             *      SystemCode  设备型号
             *      InfoList    二级列表
             *          QuestionID原因码表Code
             *          RepeatCount重复次数
             *          Remark详细描述
             */
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { duplicateServiceRecordResult
                , duplicateServiceHasData
                , duplicateServiceRecordList = [] } = yield select(state => state.CTServiceStatisticsModel)
            const ID = SentencedToEmpty(duplicateServiceRecordResult, ['data', 'Datas', 'ID'], '')
            params.RecordId = chengTaoTaskDetailData.ID;
            params.HasData = duplicateServiceHasData;
            if (typeof ID == 'string' && ID != ''
                && ID.length > 0) {
                params.ID = ID;
            }
            if (duplicateServiceHasData) {
                let RecordList = [], InfoList = [], InfoListMeta;
                duplicateServiceRecordList.map((item, index) => {
                    InfoList = [];
                    InfoListMeta = SentencedToEmpty(item, ['InfoList'], []);
                    InfoListMeta.map((innerItem, innerIndex) => {
                        InfoList.push({
                            QuestionID: innerItem.QuestionID,
                            RepeatCount: innerItem.RepeatCount,
                            Remark: innerItem.Remark
                        });
                    });
                    RecordList.push({
                        EntID: item.EntID,
                        PointID: item.PointID,
                        SystemCode: item.SystemCode,
                        InfoList: InfoList
                    });

                });
                params.RecordList = RecordList;
            } else {
                params.RecordList = [];
            }
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddOrUpdRepeatServiceRecord
                , params
            );
            CloseToast();
            if (result.status == 200) {
                yield put(NavigationActions.back());
                yield put('getServiceRecordStatus', {});
            } else {
                ShowToast(SentencedToEmpty(result, ['Message'], '提交错误'));
            }
        },
        /**
         * 添加遗留表单
         * AddOrUpdProblemsServiceRecord
         * @param {*} param    
         * @param {*} param1 
         */
        *addOrUpdProblemsServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * RecordId（必传）派单ID
             * HasData 是否有表单 （true 是 false 否）
             * File文件
             * Remark备注
             */
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { leftoverProblemHasData,// 是否有遗留问题
                leftoverProblemProblemDescription,// 遗留问题描述
                leftoverProblemResult,
                leftoverProblemImageUUID } = yield select(state => state.CTServiceStatisticsModel)
            const ID = SentencedToEmpty(leftoverProblemResult, ['data', 'Datas', 'ID'], '')
            params.RecordId = chengTaoTaskDetailData.ID;
            params.HasData = leftoverProblemHasData;
            if (typeof ID == 'string' && ID != ''
                && ID.length > 0) {
                params.ID = ID;
            }
            if (leftoverProblemHasData) {
                params.Remark = leftoverProblemProblemDescription;
                params.File = leftoverProblemImageUUID;
            }
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddOrUpdProblemsServiceRecord
                , params
            );
            CloseToast();
            if (result.status == 200) {
                yield put(NavigationActions.back());
                yield put('getServiceRecordStatus', {});
            } else {
                ShowToast(SentencedToEmpty(result, ['Message'], '提交错误'));
            }
        },
        /**
         * 添加或修改质保内服务表单
         * AddOrUpdWarrantyServiceRecord
         * @param {*} param    
         * @param {*} param1 
         */
        *addOrUpdWarrantyServiceRecord(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * RecordId（必传）派单ID
             * HasData 是否有表单 （true 是 false 否）
             * File文件
             * Remark备注
             */
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { serviceUnderWarrantySubmitParams } = yield select(state => state.CTServiceStatisticsModel)
            // const ID = SentencedToEmpty(leftoverProblemResult, ['data', 'Datas', 'ID'], '')
            serviceUnderWarrantySubmitParams.RecordId = chengTaoTaskDetailData.ID;
            // if (typeof ID == 'string' && ID != ''
            //     && ID.length > 0) {
            //     params.ID = ID;
            // }
            if (serviceUnderWarrantySubmitParams.HasData) {
                SentencedToEmpty(serviceUnderWarrantySubmitParams
                    , ['productCategoryList'], [])
                    .map((item, index) => {
                        item.Level = index;
                    });
                SentencedToEmpty(serviceUnderWarrantySubmitParams
                    , ['serviceReasonsList'], [])
                    .map((item, index) => {
                        item.Level = index;
                    });
            } else {
                serviceUnderWarrantySubmitParams.BeginTime = '';// 本次服务开始时间
                serviceUnderWarrantySubmitParams.EndTime = ''; // 本次服务结束时间
                serviceUnderWarrantySubmitParams.ProjectCount = ''; // 合同要求时长
                serviceUnderWarrantySubmitParams.ServiceCount = ''; // 本次服务时长
                serviceUnderWarrantySubmitParams.productCategoryList = []; // 本次服务时长
                serviceUnderWarrantySubmitParams.serviceReasonsList = []; // 本次服务时长
            }

            // 测试暂时不提交
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddOrUpdWarrantyServiceRecord
                , serviceUnderWarrantySubmitParams
            );
            CloseToast();
            if (result.status == 200) {
                yield put(NavigationActions.back());
                yield put('getServiceRecordStatus', {});
            } else {
                ShowToast(SentencedToEmpty(result, ['Message'], '提交错误'));
            }
        },
        /**
         * 获取服务统计表单状态
         * GetServiceRecordStatus
         * @param {*} param    
         * @param {*} param1 
         */
        *getServiceRecordStatus(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            /**
             * RecordId（必传）派单ID
             * HasData 是否有表单 （true 是 false 否）
             * File文件
             * Remark备注
             */
            yield update({
                serviceRecordStatusResult: { status: -1 }
            });
            const { chengTaoTaskDetailData } = yield select(state => state.CTModel)

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceRecordStatus
                , {
                    RecordId: chengTaoTaskDetailData.ID
                }
            );
            // overTimeRecord超时服务、repeatRecord重复表单、problemsRecord遗留问题 、warrantyRecord质保内服务
            yield update({
                serviceRecordStatusResult: result
            });
        },
    },

    subscriptions: {}
});