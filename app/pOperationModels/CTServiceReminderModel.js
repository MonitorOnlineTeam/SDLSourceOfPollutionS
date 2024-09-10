// 现场勘查信息✅，验货单✅，项目交接单，安装报告，72小时调试检测，比对监测报告，验收资料

import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'CTServiceReminderModel',
    state: {
        serviceTypeList: [
            {
                ServiceName: '72小时调试检测',
                ServiceId: 1, //1  72小时调试检测    2 验收
            }
            , {
                ServiceName: '验收',
                ServiceId: 2,
            }
        ],
        pointList: [],// 监测点列表
        calenderCurrentMonth: moment().format('YYYY-MM-DD'), // 当前月份
        // recordDate: moment().format('YYYY-MM-DD 01:00'), // 查询月份的完整日期
        recordDate: moment().format('YYYY-MM-DD'), // 查询月份的完整日期
        detailID: '', // 详情ID
        addServiceReminderParams: {
            // "id": "", // 主表ID  如果是修改一定要传
            "ID": "cba5bf52-3f4f-4944-93dc-2bedb18dcd66",
            "ProjectID": "0165dda7-ad59-41c5-b2c3-757d82cb5712", // 项目ID
            "PointId": "5995644f-4eb2-42cb-8eb6-489d8777f9b3", // 监测点ID
            "ServiceId": "1", // 服务内容ID 1  72小时调试检测    2 验收
            "RemindMsg": "测试服务提醒说明文字", // 服务提醒说明
            "ExpectedTime": "2024-04-18 14:30", // 预计开始时间
            "serviceReminderInfoList": [//  子表

                {
                    "MType": "1", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                    // "ReminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                    "EModel": "1"  // 开始提醒枚举
                }
                , {
                    "MType": "2", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                    // "ReminderTime": "2024-04-14 14:30", // 提醒时间一定要传 计算好
                    "EModel": "1"  // 开始提醒枚举
                }
                , {
                    "MType": "3", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                    "ReminderTime": "2024-04-18 14:15", // 提醒时间一定要传 计算好
                    "EModel": "1"  // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
                }
                , {
                    "MType": "4", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                    "ReminderTime": "2024-04-18 12:30", // 提醒时间一定要传 计算好
                    "EModel": "4"  // 开始提醒枚举
                }
            ]
        }, // 提醒服务表单

        contractNumberList: [], // 合同编号列表
        contractNumberSearchString: '', // 合同编号搜索字符串
        contractNumberSearchList: [], // 合同编号搜索列表
        calenderData: [], // 日历标点样式
        calenderDataObject: {}, // 获取实际的数据
        // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
        startReminderOptionList: [
            {
                label: '无提醒',
                value: '-1'
            }
            , {
                label: '15分钟前',
                value: '1'
            }
            , {
                label: '30分钟前',
                value: '2'
            }
            , {
                label: '1小时前',
                value: '3'
            }
            , {
                label: '2小时前',
                value: '4'
            }
        ],
        serviceReminderListResult: { status: -1 }, // 获取服务提醒信息
        addServiceReminderResult: { status: 200 }, // 添加服务提醒 请求结果
        serviceReminderViewResult: { status: 200 }, // 提醒详情 请求结果

        deleteServiceReminderResult: { status: 200 }, // 删除服务提醒 请求结果
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * 提醒服务列表
         * GetServiceReminderList
         * @param {*} recordDate  查询月份的完整日期
         * 2024-04-11T10:18:10 建议是当月一号
         * @param {*} param1 
         */
        *getServiceReminderList(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { recordDate } = yield select(state => state.CTServiceReminderModel)
            const paramDate = moment(recordDate).format('YYYY-MM-DD 01:00');
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceReminderList
                , {
                    recordDate: paramDate
                }
            );
            if (result.status == 200) {
                const rawData = SentencedToEmpty(result, ['data', 'Datas', 'MainInfo'], []);
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
                yield update({
                    calenderData,
                    calenderDataObject: dataObject,
                    serviceReminderListResult: result,
                    contractNumberList: SentencedToEmpty(result, ['data', 'Datas', 'ProjectList'], []),
                });
            } else {
                yield update({
                    serviceReminderListResult: result
                });
            }

        },
        /**
         * 添加服务提醒 
         * AddServiceReminder
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        *addServiceReminder(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ addServiceReminderResult: { status: -1 } });
            // const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { addServiceReminderParams } = yield select(state => state.CTServiceReminderModel)
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddServiceReminder
                , addServiceReminderParams
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                callback();
            } else {
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], '请求发生错误'));
            }
            yield update({ addServiceReminderResult: result });
        },
        /**
         * 提醒详情 
         * GetServiceReminderView
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        * getServiceReminderView(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            // yield update({ overTimeServiceRecordResult: { status: -1 } });
            // const { chengTaoTaskDetailData } = yield select(state => state.CTModel)
            const { detailID, contractNumberList } = yield select(state => state.CTServiceReminderModel);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetServiceReminderView
                , {
                    ID: detailID
                }
            );
            const data = SentencedToEmpty(result, ['data', 'Datas'], {});
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
            ) {
                const ProjectID = data.ProjectID;
                let pointList = [];
                contractNumberList.map((item, index) => {
                    if (item.ProjectID == ProjectID) {
                        pointList = item.PointList;
                    }
                })
                let addServiceReminderParams = { ...data };
                const ChildList = SentencedToEmpty(data, ['ChildList'], []);
                let searchIndex = -1;
                let serviceReminderInfoList = [];
                let tempItem = {};
                const getEModelName = (EModel) => {
                    // 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
                    if (EModel == 1) {
                        return '15分钟';
                    } else if (EModel == 2) {
                        return '30分钟';
                    } else if (EModel == 3) {
                        return '1小时';
                    } else if (EModel == 4) {
                        return '2小时';
                    } else {
                        return '无提醒';
                    }
                }

                [0, 1, 2, 3].map((item, index) => {
                    searchIndex = -1;
                    if (item == 0) {
                        searchIndex = ChildList.findIndex((childItem, childIndex) => {
                            if (childItem.MType == 1) {
                                return true;
                            }
                        })
                        if (searchIndex == -1) {
                            serviceReminderInfoList.push({
                                "MType": "1", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "reminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-2"  // 开始提醒枚举
                            })
                        } else {
                            tempItem = { ...ChildList[searchIndex] };
                            tempItem.ReminderTime = moment(tempItem.ReminderTime).format('YYYY-MM-DD');
                            serviceReminderInfoList.push(tempItem);
                        }
                    }
                    if (item == 1) {
                        searchIndex = ChildList.findIndex((childItem, childIndex) => {
                            if (childItem.MType == 2) {
                                return true;
                            }
                        })
                        if (searchIndex == -1) {
                            serviceReminderInfoList.push({
                                "MType": "2", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "reminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-2"  // 开始提醒枚举
                            })
                        } else {
                            tempItem = { ...ChildList[searchIndex] };
                            tempItem.ReminderTime = moment(tempItem.ReminderTime).format('YYYY-MM-DD');
                            serviceReminderInfoList.push(tempItem);
                        }
                    }
                    if (item == 2) {
                        searchIndex = ChildList.findIndex((childItem, childIndex) => {
                            if (childItem.MType == 3) {
                                return true;
                            }
                        })
                        if (searchIndex == -1) {
                            serviceReminderInfoList.push({
                                "MType": "3", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "reminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-1"  // 开始提醒枚举
                            })
                        } else {
                            tempItem = { ...ChildList[searchIndex] };
                            tempItem.EModelName = getEModelName(tempItem.EModel);
                            serviceReminderInfoList.push(tempItem);
                        }
                    }
                    if (item == 3) {
                        searchIndex = ChildList.findIndex((childItem, childIndex) => {
                            if (childItem.MType == 4) {
                                return true;
                            }
                        })
                        if (searchIndex == -1) {
                            serviceReminderInfoList.push({
                                "MType": "4", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "reminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-1"  // 开始提醒枚举
                            })
                        } else {
                            tempItem = { ...ChildList[searchIndex] };
                            tempItem.EModelName = getEModelName(tempItem.EModel);
                            serviceReminderInfoList.push(tempItem);
                        }
                    }
                });
                addServiceReminderParams.serviceReminderInfoList = serviceReminderInfoList;
                yield update({
                    serviceReminderViewResult: result,
                    addServiceReminderParams,
                    pointList,
                })
            } else {

            }
        },
        /**
         * 删除提醒 
         * DeleteServiceReminder
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        * deleteServiceReminder(
            {
                payload: { params = {}, callback = () => { return false } }
            },
            { call, put, take, update, select }
        ) {
            const { detailID } = yield select(state => state.CTServiceReminderModel);
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeleteServiceReminder
                , {
                    ID: detailID
                }
            );
            if (result.status == 200
                && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                callback();
            } else {
                ShowToast(SentencedToEmpty(result, ['data', 'Message'], '请求发生错误'));
            }
            yield update({
                deleteServiceReminderResult: result,
            })
        },
        /**
         * 获取质保内服务表单 
         * GetWarrantyServiceRecord
         * @param {*} questionType （必传）  65 、 超时原因 66、重复派单原因    
         * @param {*} param1 
         */
        * getWarrantyServiceRecord(
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
                    });
                } else if (!SentencedToEmpty(Datas, ['HasData'], false)) {
                    yield update({
                        warrantyServiceRecordResult: result,
                        serviceUnderWarrantySubmitParams: {
                            ID: SentencedToEmpty(Datas, ['ID'], ''),
                            RecordId: SentencedToEmpty(Datas, ['RecordId'], ''), // 成套任务id
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
        * addOrUpdOverTimeServiceRecord(
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
        * addOrUpdRepeatServiceRecord(
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
        * addOrUpdProblemsServiceRecord(
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
        * addOrUpdWarrantyServiceRecord(
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
        * getServiceRecordStatus(
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