/*
 * @Description: 宝武相关事件
 * @LastEditors: hxf
 * @Date: 2023-05-06 08:44:32
 * @LastEditTime: 2024-06-15 17:28:55
 * @FilePath: /SDLMainProject37_backup_2/app/pOperationModels/BWModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, bwFormatArray, createAction } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';

export default Model.extend({
    namespace: 'BWModel',
    state: {
        getALLOperationTaskResult: { status: -1 },//运维任务信息列表 
        getALLOperationTaskData: [],//运维任务信息列表 
        aLLOperationQuestionName: '',// 运维任务信息列表 的过滤条件
        IDtoOPTID: '', // 任务 ID
        OTID: '', // 任务类别 ID 

        getOperationTaskByIDResult: { status: -1 }, // 点位列表
        getOperationTaskByIDData: [], // 点位列表
        operationTaskByIDQuestionName: '', // 点位列表 的过滤条件
        operationPlanList: [], // 运维计划列表
        validCycleList: [],// 有效 运维周期 列表
        OPCID: '', // 运维计划周期 ID
        OPTPID: '',//运维计划 ID

        // 任务信息
        getOperationSchemeListResult: { status: -1 },//任务信息列表 
        getOperationSchemeListData: [],//任务信息列表 

        uploadData: {}, // 提交数据
        loadUploadOptionStatus: { status: -1 },// 上传运维数据页面的选项加载状态
        loadUploadImageStatus: { status: 200 },// 图片上传状态
        // uploadOpenationTime:moment().format('YYYY-DD-MM HH:mm'),
        uploadOpenationTime: '',

        pickerSearchStr: '', // 搜索字符串
        openationTaskTypeResult: {}, // 运维任务类别 
        openationTaskTypeData: [],// 运维任务类别 数据
        openationTaskTypeSelectedItems: [], //  运维任务类别 选中

        getOperationDetailListResult: {}, // 运维内容 作为元数据的备份   不单独加载相关数据，使用 M_GetOperationTaskByID 中的
        getOperationDetailListData: [], // 运维内容 数据 不单独加载相关数据，使用 M_GetOperationTaskByID 中的
        originalOperationDetailListData: [],// 运维内容  获取的原数据，用于本地过滤
        getOperationDetailSelectedItems: [], //  运维内容 选中

        getALLWorkersListResult: {}, // 人员信息
        getALLWorkersListData: [], // 人员信息 数据
        originalWorkersListData: [], // 人员信息  原数据，用于本地过滤
        getALLWorkersSelectedItems: [], //  人员信息 选中

        getALLDevicesListResult: {}, // 设备信息
        getALLDevicesListData: [], // 设备信息 数据
        originalDevicesListData: [], // 设备信息 原数据，用于本地过滤
        getALLDevicesSelectedItems: [], //  设备信息 选中

        executiveStatisticsSelected: 1,
        completeTaskCountSelected: 1,
        executiveStatisticsParams: {
            beginTime: moment().format('YYYY-MM-DD 00:00:00')
            , endTime: moment().format('YYYY-MM-DD 23:59:59')
        },
        completeTaskCountParams: {
            beginTime: moment().format('YYYY-MM-DD 00:00:00')
            , endTime: moment().format('YYYY-MM-DD 23:59:59')
        },
        executiveStatisticsResult: { status: 200 }, // 工单执行统计
        completeTaskCountResult: { status: 200 }, // 工单完成统计
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *getTaskStatisticsList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield put(createAction('GeneralSearchModel/updateState')({
                remoteResult: { status: -1 },
            }));
            const { keyWords } = yield select(state => state.GeneralSearchModel);
            params.indexWhere = keyWords;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.TaskRecords, params);

            yield put(createAction('GeneralSearchModel/updateState')({
                dataList: SentencedToEmpty(result
                    , ['data', 'Datas'], []
                ),
                remoteResult: result,
            }));
        },
        /**
         * GetOperationTaskStatisticsInfoByDay
         * 工单执行情况
         */
        *getOperationTaskStatisticsInfoByDay(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            params.noCancelFlag = true;
            const result = yield call(authService.axiosAuthPost
                , api.pOperationApi.WorkBench.GetOperationTaskStatisticsInfoByDay
                , params);
            yield update({ executiveStatisticsResult: result });
        },
        *getCompleteTaskCount(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            params.noCancelFlag = true;
            const result = yield call(authService.axiosAuthPost
                , api.pOperationApi.WorkBench.GetOperationTaskStatisticsInfoByDay
                , params);
            yield update({ completeTaskCountResult: result });

        },
        /**
         * M_GetALLOperationTask
         * 获取待领取列表
         * @param {*} param0
         * @param {*} param1
         */
        *getALLOperationTask(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            /**
             * functionName 接口名称
             * 
             * paramList与xmlParamList参数只能同时存在一个，xmlParamList优先级更高
             * paramList
             * xmlParamList
             */
            const { aLLOperationQuestionName } = yield select(state => state.BWModel);
            const reallQuestionName = aLLOperationQuestionName.trim()
            params = {
                functionName: 'M_GetALLOperationTask',
                paramList: {}
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService, params);
            /**
             *  ID 任务 ID
                CID 合同 ID
                RWBH 任务编号
                RWMC 任务名称
                OTID 任务类别 ID
                RWLY 任务来源
                PROVINCE 省
                CITY 市
                DISTRICT 县
                RWRQKS 任务开始日期
                RWRQJS 任务结束日期
                RWGS 任务概述
             */
            let requestEnd = new Date().getTime();
            if (result.status == 200 && result.data.IsSuccess) {
                let data = SentencedToEmpty(result, [
                    'data', 'Datas', 'soap:Envelope', 'soap:Body', 'M_GetALLOperationTaskResponse'
                    , 'M_GetALLOperationTaskResult', 'Items', 'Item'
                ], [])
                if (reallQuestionName == '') {
                    yield update({
                        getALLOperationTaskResult: result,//运维任务信息列表 
                        getALLOperationTaskData: data,//运维任务信息列表 
                    });
                    setListData(data, requestEnd - requestBegin);
                } else {
                    let filterData = data.filter((item) => {
                        return item.RWMC.indexOf(aLLOperationQuestionName) != -1
                    });
                    yield update({
                        getALLOperationTaskResult: result,//运维任务信息列表 
                        getALLOperationTaskData: filterData,//运维任务信息列表 
                    });
                    setListData(filterData, requestEnd - requestBegin);
                }
            } else {
                yield update({
                    getALLOperationTaskResult: result,//运维任务信息列表 
                    getALLOperationTaskData: [],//运维任务信息列表 
                });
            }
        },
        /**
         * M_GetOperationTaskByID
         * 运维任务信息
         * @param {*} param0
         * @param {*} param1
         */
        *getOperationTaskByID(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            yield put('getOperationSchemeList', {});
            yield take('getOperationSchemeList/@@end');
            const { IDtoOPTID, operationTaskByIDQuestionName, getOperationSchemeListData } = yield select(state => state.BWModel);
            const reallOperationTaskByIDQuestionName = operationTaskByIDQuestionName.trim()
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    functionName: 'M_GetOperationTaskByID',
                    paramList: { OPTID: IDtoOPTID }
                });
            let requestEnd = new Date().getTime();
            // getOperationTaskByIDResult:{status:-1}, // 点位列表
            // getOperationTaskByIDData:[], // 点位列表
            // OperationTaskByIDQuestionName:'', // 点位列表 的过滤条件
            // const planList = SentencedToEmpty(result
            //     ,['data','Datas','soap:Envelope','soap:Body'
            //         ,'M_GetOperationTaskByIDResponse'
            //         ,'M_GetOperationTaskByIDResult', 'Items'
            //         , 'Item', 'PLANS', 'Item'
            //     ], []
            // );
            // console.log('planList = ',planList);
            if (result.status == 200 && result.data.IsSuccess) {
                let data = SentencedToEmpty(result, [
                    'data', 'Datas', 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                    , 'M_GetOperationTaskByIDResult', 'Items', 'Item'
                    , 'SCHEMES', 'Item'
                ], []);
                let itemIndex = -1;
                let outData = [];
                if (reallOperationTaskByIDQuestionName == '') {
                    if (typeof data == 'object' && data) {
                        if (Array.isArray(data)) {
                            data.map((item, index) => {
                                itemIndex = getOperationSchemeListData.findIndex((dataItem) => {
                                    return dataItem.ID == item.ID;
                                });
                                data[index] = { ...item, ...getOperationSchemeListData[itemIndex] };
                            });
                            outData = data;
                        } else {
                            itemIndex = getOperationSchemeListData.findIndex((dataItem) => {
                                return dataItem.ID == data.ID;
                            });
                            if (itemIndex != -1) {
                                data = { ...data, ...getOperationSchemeListData[itemIndex] };
                            }
                            outData.push(data);
                        }
                    }

                    /**
                     * 生成运维内容
                     */
                    let plans = SentencedToEmpty(result, ['data', 'Datas'
                        , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                        , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'PLANS', 'Item'
                    ], [])
                    let operationContentList, resultContentList = [], oneContent;

                    // if (Array.isArray(plans)) {

                    // } else {
                    //     temp = [];
                    //     temp.push(plans.item);
                    //     plans = temp;
                    // }
                    bwFormatArray(plans).map((plansItem, plansIndex) => {
                        operationContentList = SentencedToEmpty(plansItem, ['Arrays', 'Item'], []);
                        if (Array.isArray(operationContentList)) {
                            operationContentList.map((contentItem, contentIndex) => {
                                oneContent = { ...contentItem };
                                oneContent.plan = plansItem;
                                resultContentList.push(oneContent);
                            });
                        } else {
                            oneContent = { ...operationContentList };
                            oneContent.plan = plansItem;
                            resultContentList.push(oneContent);
                        }
                    });

                    yield update({
                        getOperationTaskByIDResult: result,//点位列表 
                        getOperationTaskByIDData: outData,//点位列表 
                        // getOperationDetailListData:resultContentList, // 运维内容过
                        // getOperationDetailListResult:resultContentList, // 作为元数据的备份
                        // operationPlanList:planList, // 运维计划列表
                    });
                    setListData(outData, requestEnd - requestBegin);
                } else {
                    if (typeof data == 'object' && data) {
                        let filterData = [];
                        if (Array.isArray(data)) {
                            filterData = data.filter((item) => {
                                return item.MC.indexOf(reallOperationTaskByIDQuestionName) != -1
                            });
                        } else {
                            filterData = [data].filter((item) => {
                                return item.MC.indexOf(reallOperationTaskByIDQuestionName) != -1
                            });
                        }
                        filterData.map((item, index) => {
                            itemIndex = getOperationSchemeListData.findIndex((dataItem) => {
                                return dataItem.ID == item.ID;
                            });
                            filterData[index] = { ...item, ...getOperationSchemeListData[itemIndex] };
                        });
                        outData = filterData;
                    }

                    yield update({
                        getOperationTaskByIDResult: result,//点位列表 
                        getOperationTaskByIDData: outData,//点位列表
                        // operationPlanList:planList, // 运维计划列表
                    });
                    setListData(outData, requestEnd - requestBegin);
                }
            } else {
                yield update({
                    getOperationTaskByIDResult: result,//点位列表 
                    getOperationTaskByIDData: [],//点位列表 
                    // operationPlanList:[], // 运维计划列表
                });
            }
        },
        /**
         * 运维点位列表
         * M_GetOperationSchemeList
         * 
         */
        // *getMonitorTaskSchemeByMTID(
        *getOperationSchemeList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'M_GetOperationSchemeList',
                    paramList: {}
                });
            if (result.status == 200 && result.data.IsSuccess) {
                let data = SentencedToEmpty(result, [
                    'data', 'Datas', 'soap:Envelope', 'soap:Body', 'M_GetOperationSchemeListResponse'
                    , 'M_GetOperationSchemeListResult', 'Items', 'Item'
                ], []);
                yield update({
                    getOperationSchemeListResult: result,//点位列表 
                    getOperationSchemeListData: data,//点位列表 
                });
            } else {
                yield update({
                    getOperationSchemeListResult: result,//点位列表 
                    getOperationSchemeListData: [],//点位列表 
                });
            }
        },
        /**
         * 加载上传数据的入口
         * @param {*} param0 
         * @param {*} param1 
         */
        *loadUploadOption(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const { OTID, getOperationTaskByIDResult } = yield select(state => state.BWModel);
            yield update({
                loadUploadOptionStatus: { status: -1 },

                openationTaskTypeResult: {}, // 运维任务类别 
                openationTaskTypeData: [],// 运维任务类别 数据
                openationTaskTypeSelectedItems: [], //  运维任务类别 选中

                getOperationDetailListResult: {}, // 运维内容    不单独加载相关数据，使用 M_GetOperationTaskByID 中的
                getOperationDetailListData: [], // 运维内容 数据 不单独加载相关数据，使用 M_GetOperationTaskByID 中的
                originalOperationDetailListData: [],// 运维内容 原数据，用于本地过滤
                getALLWorkersListResult: {}, // 人员信息
                getALLWorkersListData: [], // 人员信息 数据
                originalWorkersListData: [], // 人员信息 原数据，用于本地过滤
                getALLDevicesListResult: {}, // 设备信息
                getALLDevicesListData: [], // 设备信息 数据
                originalDevicesListData: [], // 设备信息  原数据，用于本地过滤
            });

            // 运维任务类别
            // const openationTaskTypeResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
            // , {
            //     noCancelFlag:true,
            //     functionName:'M_OpenationTaskType',
            //     paramList:{}
            // });
            // yield update({
            //     openationTaskTypeResult,
            //     openationTaskTypeData:SentencedToEmpty(openationTaskTypeResult
            //         ,['data','Datas','soap:Envelope'
            //         , 'soap:Body','M_OpenationTaskTypeResponse'
            //         , 'M_OpenationTaskTypeResult','Items','Item'
            //         ],[]    
            //     )
            // });
            // if (openationTaskTypeResult.status == 200&&openationTaskTypeResult.data.IsSuccess) {
            // } else {
            //     yield update({
            //         loadUploadOptionStatus:{status:1000}
            //     });
            //     ShowToast('运维任务类别获取失败！');
            //     return;
            // }

            // 运维内容 getOperationDetailListResult 数据 与 M_GetOperationTaskByID/.../PLANS中的数据 结合使用
            const getOperationDetailListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'M_GetOperationDetailList',
                    paramList: {}
                });

            let plans = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'PLANS', 'Item'
            ], [])
            let operationContentList, resultContentList = [], oneContent;
            bwFormatArray(plans).map((plansItem, plansIndex) => {
                operationContentList = SentencedToEmpty(plansItem, ['Arrays', 'Item'], []);
                if (Array.isArray(operationContentList)) {
                    bwFormatArray(operationContentList).map((contentItem, contentIndex) => {
                        oneContent = { ...contentItem };
                        oneContent.plan = plansItem;
                        resultContentList.push(oneContent);
                    });
                } else {
                    oneContent = { ...operationContentList };
                    oneContent.plan = plansItem;
                    resultContentList.push(oneContent);
                }
            });

            let afterFilterData = [];
            bwFormatArray(SentencedToEmpty(getOperationDetailListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'M_GetOperationDetailListResponse'
                    , 'M_GetOperationDetailListResult', 'Items', 'Item'
                ], []
            )).map((item, index) => {
                if (item.OTID == OTID) {
                    let i = 0;
                    for (i = 0; i < resultContentList.length; i++) {
                        if (item.DETAILNAME == resultContentList[i].DETAILNAME) {
                            afterFilterData.push({ ...resultContentList[i], ...item });
                        } else {
                        }
                    }
                }
            });

            yield update({
                getOperationDetailListResult,
                getOperationDetailListData: afterFilterData,
                originalOperationDetailListData: afterFilterData,
            });
            if (getOperationDetailListResult.status == 200 && getOperationDetailListResult.data.IsSuccess) {
            } else {
                yield update({
                    loadUploadOptionStatus: { status: 1000 }
                });
                ShowToast('运维内容获取失败！');
                return;
            }

            // 人员信息 getALLWorkersListResult
            const getALLWorkersListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'B_GetALLWorkersList',
                    paramList: {}
                });
            let aLLWorkersList = SentencedToEmpty(getALLWorkersListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'B_GetALLWorkersListResponse'
                    , 'B_GetALLWorkersListResult', 'Items', 'Item'
                ], []
            );
            let workers = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'WORKERS', 'Item'
            ], []);
            let optionWorkers = [];
            bwFormatArray(aLLWorkersList).map((allItem, allIndex) => {
                bwFormatArray(workers).map((taskWorkerItem, taskWorkerIndex) => {
                    if (allItem.XM == taskWorkerItem.XM) {
                        optionWorkers.push(allItem);
                    }
                });
            });
            yield update({
                getALLWorkersListResult,
                getALLWorkersListData: optionWorkers,
                originalWorkersListData: optionWorkers
            });
            if (getALLWorkersListResult.status == 200 && getALLWorkersListResult.data.IsSuccess) {
            } else {
                yield update({
                    loadUploadOptionStatus: { status: 1000 }
                });
                ShowToast('人员信息获取失败！');
                return;
            }

            // 设备信息 getALLDevicesListResult
            const getALLDevicesListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'B_GetALLDevicesList',
                    paramList: {}
                });
            let aLLDevicesList = SentencedToEmpty(getALLDevicesListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'B_GetALLDevicesListResponse'
                    , 'B_GetALLDevicesListResult', 'Items', 'Item'
                ], []
            );
            let devices = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'DEVICES', 'Item'
            ], []);
            let optionDevices = [];
            bwFormatArray(aLLDevicesList).map((allItem, allIndex) => {
                bwFormatArray(devices).map((taskDevicesItem, taskDecicesIndex) => {
                    if (allItem.SBMC == taskDevicesItem.SBMC) {
                        optionDevices.push(allItem);
                    }
                });
            });
            yield update({
                getALLDevicesListResult,
                getALLDevicesListData: optionDevices,
                originalDevicesListData: optionDevices
            });
            if (getALLDevicesListResult.status == 200 && getALLDevicesListResult.data.IsSuccess) {
            } else {
                yield update({
                    loadUploadOptionStatus: { status: 1000 }
                });
                ShowToast('设备信息获取失败！');
                return;
            }
            yield update({ loadUploadOptionStatus: { status: 200 } });
        },
        /**
         * 运维任务类别 openationTaskTypeResult
         * M_OpenationTaskType
         */
        *openationTaskType(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {

            yield update({ openationTaskTypeResult: { status: -1 } });
            const { pickerSearchStr, openationTaskTypeData
                , openationTaskTypeSelectedItems } = yield select(state => state.BWModel)
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'M_OpenationTaskType',
                    paramList: {}
                });
            let newData = [];
            let newSelectedData = [];
            if (result.status == 200 && result.data.IsSuccess) {
                let allData = SentencedToEmpty(result
                    , ['data', 'Datas', 'soap:Envelope'
                        , 'soap:Body', 'M_OpenationTaskTypeResponse'
                        , 'M_OpenationTaskTypeResult', 'Items', 'Item'
                    ]
                );

                let hasSelectedIndex = -1;
                bwFormatArray(openationTaskTypeSelectedItems).map(
                    (seletedItem, selectedIndex) => {
                        hasSelectedIndex = allData.findIndex((alldataItem, alldataIndex) => {
                            return alldataItem.ID == seletedItem.ID;
                        });
                        allData[hasSelectedIndex].selectedStatus = true;
                        if (hasSelectedIndex != -1) {
                            newSelectedData.push(allData[hasSelectedIndex]);
                        }
                    }
                );

                let originalData = allData;
                bwFormatArray(originalData).map((item, index) => {
                    if (item.NAME.indexOf(pickerSearchStr) != -1
                        || `${item.ID}`.indexOf(pickerSearchStr) != -1
                    ) {
                        newData.push(item);
                    }
                });

                yield update({
                    openationTaskTypeResult: result,
                    openationTaskTypeData: newData,
                    openationTaskTypeSelectedItems: newSelectedData
                });
                setListData(newData);
            } else {
                yield update({
                    openationTaskTypeResult: result,
                    openationTaskTypeData: newData,
                    openationTaskTypeSelectedItems: newSelectedData
                });
                setListData(newData);
            }
        },
        /**
         * 运维内容
         * M_GetOperationDetailList
         * (弃用) 使用 M_GetOperationTaskByID 中的
         * Items:->Item:->PLANS:Item: 0:->Arrays:Item: {ID: "117513", DETAILNAME: "校准颗粒物"}
         */
        *getOperationDetailList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ getOperationDetailListResult: { status: -1 }, getOperationDetailSelectedItems: [] });
            const { OTID, getOperationTaskByIDResult } = yield select(state => state.BWModel);

            // 运维内容 getOperationDetailListResult 数据 与 M_GetOperationTaskByID/.../PLANS中的数据 结合使用
            const getOperationDetailListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'M_GetOperationDetailList',
                    paramList: {}
                });

            let plans = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'PLANS', 'Item'
            ], [])
            let operationContentList, resultContentList = [], oneContent;
            bwFormatArray(plans).map((plansItem, plansIndex) => {
                operationContentList = SentencedToEmpty(plansItem, ['Arrays', 'Item'], []);
                if (Array.isArray(operationContentList)) {
                    operationContentList.map((contentItem, contentIndex) => {
                        oneContent = { ...contentItem };
                        oneContent.plan = plansItem;
                        resultContentList.push(oneContent);
                    });
                } else {
                    oneContent = { ...operationContentList };
                    oneContent.plan = plansItem;
                    resultContentList.push(oneContent);
                }
            });

            let afterFilterData = [];
            bwFormatArray(SentencedToEmpty(getOperationDetailListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'M_GetOperationDetailListResponse'
                    , 'M_GetOperationDetailListResult', 'Items', 'Item'
                ], []
            )).map((item, index) => {
                if (item.OTID == OTID) {
                    let i = 0;
                    for (i = 0; i < resultContentList.length; i++) {
                        if (item.DETAILNAME == resultContentList[i].DETAILNAME) {
                            afterFilterData.push({ ...resultContentList[i], ...item });
                        } else {
                        }
                    }
                }
            });


            if (getOperationDetailListResult.status == 200 && getOperationDetailListResult.data.IsSuccess) {
                yield update({
                    getOperationDetailListResult,
                    getOperationDetailListData: afterFilterData,
                    originalOperationDetailListData: afterFilterData,
                });
                setListData(afterFilterData);
            } else {
                yield update({
                    getOperationDetailListResult,
                    getOperationDetailListData: [],
                    originalOperationDetailListData: [],
                });
                setListData([]);
                ShowToast('运维内容获取失败！');
                return;
            }
        },
        /**
         * 人员信息
         * B_GetALLWorkersList
         */
        *getALLWorkersList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ getALLWorkersListResult: { status: -1 }, getALLWorkersSelectedItems: [] });
            const { OTID, getOperationTaskByIDResult } = yield select(state => state.BWModel);

            // 人员信息 getALLWorkersListResult
            const getALLWorkersListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'B_GetALLWorkersList',
                    paramList: {}
                });
            let aLLWorkersList = SentencedToEmpty(getALLWorkersListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'B_GetALLWorkersListResponse'
                    , 'B_GetALLWorkersListResult', 'Items', 'Item'
                ], []
            );
            let workers = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'WORKERS', 'Item'
            ], []);
            let optionWorkers = [];
            bwFormatArray(aLLWorkersList).map((allItem, allIndex) => {
                bwFormatArray(workers).map((taskWorkerItem, taskWorkerIndex) => {
                    if (allItem.XM == taskWorkerItem.XM) {
                        optionWorkers.push(allItem);
                    }
                });
            });

            if (getALLWorkersListResult.status == 200 && getALLWorkersListResult.data.IsSuccess) {
                yield update({
                    getALLWorkersListResult,
                    getALLWorkersListData: optionWorkers,
                    originalWorkersListData: optionWorkers
                });
                setListData(optionWorkers);
            } else {
                yield update({
                    getALLWorkersListResult,
                    getALLWorkersListData: [],
                    originalWorkersListData: []
                });
                setListData([]);
                ShowToast('人员信息获取失败！');
                return;
            }
        },
        /**
         * 设备信息
         * B_GetALLDevicesList
         */
        *getALLDevicesList(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ getALLDevicesListResult: { status: -1 }, getALLDevicesSelectedItems: [] });
            const { OTID, getOperationTaskByIDResult } = yield select(state => state.BWModel);

            // 设备信息 getALLDevicesListResult
            const getALLDevicesListResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , {
                    noCancelFlag: true,
                    functionName: 'B_GetALLDevicesList',
                    paramList: {}
                });
            let aLLDevicesList = SentencedToEmpty(getALLDevicesListResult
                , ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'B_GetALLDevicesListResponse'
                    , 'B_GetALLDevicesListResult', 'Items', 'Item'
                ], []
            );
            let devices = SentencedToEmpty(getOperationTaskByIDResult, ['data', 'Datas'
                , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                , 'M_GetOperationTaskByIDResult', 'Items', 'Item', 'DEVICES', 'Item'
            ], []);
            let optionDevices = [];
            bwFormatArray(aLLDevicesList).map((allItem, allIndex) => {
                bwFormatArray(devices).map((taskDevicesItem, taskDecicesIndex) => {
                    if (allItem.SBMC == taskDevicesItem.SBMC) {
                        optionDevices.push(allItem);
                    }
                });
            });

            if (getALLDevicesListResult.status == 200 && getALLDevicesListResult.data.IsSuccess) {
                yield update({
                    getALLDevicesListResult,
                    getALLDevicesListData: optionDevices,
                    originalDevicesListData: optionDevices
                });
                setListData(optionDevices);
            } else {
                yield update({
                    getALLDevicesListResult,
                    getALLDevicesListData: [],
                    originalDevicesListData: []
                });
                setListData([]);
                ShowToast('设备信息获取失败！');
                return;
            }


        },
        /**
         * 运维记录上传
         * M_InsertOperationTaskPlanLog
         */
        *insertOperationTaskPlanLog(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const { uploadData } = yield select(state => state.BWModel);
            /**
             * 由于测试库 服务器时间 慢9分钟可能导致提交失败，
             * 照片上传时间和运维时间不能晚于服务器时间
             * 因此时间距离当前时间间隔小于10分钟，进行手动做出偏移
             */
            const standardMonent = moment().subtract(10, 'minutes');

            if (moment(uploadData.xmlParamList[0].YWDATE).isAfter(standardMonent)) {
                uploadData.xmlParamList[0].YWDATE = standardMonent.format('YYYY-MM-DD HH:mm:ss');
            }
            if (moment(uploadData.xmlParamList[0].YWSJ).isAfter(standardMonent)) {
                uploadData.xmlParamList[0].YWSJ = standardMonent.format('YYYY-MM-DD HH:mm:ss');
            }
            [1, 2, 3, 4].map((numItem, numIndex) => {
                if (moment(uploadData.xmlParamList[0][`PATH${numItem}_UPLOADTIME`])
                    .isAfter(standardMonent)) {
                    uploadData.xmlParamList[0][`PATH${numItem}_UPLOADTIME`]
                        = standardMonent.format('YYYY-MM-DD HH:mm:ss');
                }

            });

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                , uploadData
            );
            if (result.status == 200 && result.data.IsSuccess) {
                const ResultStruct = SentencedToEmpty(result, ['data', 'Datas', 'soap:Envelope'
                    , 'soap:Body', 'M_InsertOperationTaskPlanLogResponse'
                    , 'M_InsertOperationTaskPlanLogResult', 'ResultStruct'
                ], {})
                const succes = SentencedToEmpty(ResultStruct, ['succes'], 'False');
                if (succes == "True") {
                    ShowToast(SentencedToEmpty(ResultStruct, ['message'], '上传成功'));
                    yield put(NavigationActions.back());
                } else {
                    let message = SentencedToEmpty(ResultStruct, ['message'], '上传失败');
                    let msgArr = message.split('：');
                    if (msgArr.length > 1) {
                        ShowToast(msgArr[(msgArr.length - 1)]);
                    } else {
                        ShowToast('上传失败');
                    }
                }
            } else {
                ShowToast('上传失败');
            }
            /**
             *  uploadData:{
                    noCancelFlag:true,
                    functionName:'M_InsertOperationTaskPlanLog',
                    
                    paramList:{
                        ID:item.ID,
                    },
                    xmlParamList:[{
                        OPTPID:'', // 运维计划 ID
                        OTSID:SentencedToEmpty(item,['ID'],''), // 运维点位 ID
                        YWSJ:'', // 运维记录保存时间
                        YWDATE:moment().format('YYYY-MM-DD HH:mm:ss'), // 运维时间
                        ODID:'', // 运维内容 ID
                        OPCID:'', // 运维计划周期 ID
                        YWRY:'', // 运维人员（逗号分隔如：128634,128635）
                        YWSB:'', // 运维设备（逗号分隔如：128634,128635）
                        
                        PATH1:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH1_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH2:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH2_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH3:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH3_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH4:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH4_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH5:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH5_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH6:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH6_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH7:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH7_UPLOADTIME:'', //图片上传时间（真实时间）
                        PATH8:'', // 图片名称（调用附件上传接口产生图片名）
                        PATH8_UPLOADTIME:'', //图片上传时间（真实时间）

                        YWMS:'', // 必填 异常说明（异常情况补录必填）

                        X:item.LONGITUDE, // 经度
                        Y:item.LATITUDE, // 维度
                        IS_SPECIAL:0, // 是否异常补录（0 正常 1 补录）
                    }]
                }
             */
        },
        /**
         * 反馈上传图片
         * AppendFile
         * @param {*} param0 
         * @param {*} param1 
         */
        *uploadimage({ payload: { byteArray
            , fileName, successCallback = () => { }
            , imageIndex
        } }, { call, put, take, update, select }) {
            yield update({ loadUploadImageStatus: { status: -1 } });
            const { uploadData } = yield select(state => state.BWModel);
            // 获取后缀
            if (fileName == '') {
                ShowToast("图片创建失败");
                yield update({ loadUploadImageStatus: { status: 200 } });
                return;
            } else {
                let strArr = fileName.split('.');
                const createNameResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                    , {
                        noCancelFlag: true,
                        "functionName": "CreateFile",
                        "paramList": {
                            "fileName": `${new Date().getTime()}.${strArr[1]}`,
                            "fileType": 9
                        }
                    });

                const serverImageName = SentencedToEmpty(createNameResult
                    , ['data', 'Datas', 'soap:Envelope'
                        , 'soap:Body', 'CreateFileResponse'
                        , 'CreateFileResult', 'ResultStruct'
                        , 'message'
                    ], ''
                );
                if (createNameResult.status == 200
                    && SentencedToEmpty(createNameResult
                        , ['data', 'Datas', 'soap:Envelope'
                            , 'soap:Body', 'CreateFileResponse'
                            , 'CreateFileResult', 'ResultStruct'
                            , 'succes'
                        ], '') == 'True'
                    && serverImageName != ''
                ) {
                    const startUploadTime = moment()
                        .format('YYYY-MM-DD HH:mm:ss');
                    // 开始上传
                    const uploadResult = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService
                        , {
                            noCancelFlag: true,
                            functionName: 'AppendFile',
                            "paramList": {
                                "fileNameNew": serverImageName,
                                "fileType": 9,
                                "buffer": byteArray
                            }
                        });
                    if (uploadResult.status == 200) {
                        let newUploadData = { ...uploadData };
                        // newUploadData['xmlParamList'][0][`PATH${imageIndex+1}`] = serverImageName;
                        // newUploadData['xmlParamList'][0][`PATH${imageIndex+1}_UPLOADTIME`] = startUploadTime;
                        newUploadData.xmlParamList[0][`PATH${imageIndex + 1}`] = serverImageName;
                        newUploadData.xmlParamList[0][`PATH${imageIndex + 1}_UPLOADTIME`] = startUploadTime;

                        yield update({ uploadData: newUploadData });
                        yield update({ loadUploadImageStatus: { status: 200 } });
                        successCallback();
                    } else {
                        ShowToast("图片上传失败");
                        yield update({ loadUploadImageStatus: { status: 200 } });
                        return;
                    }
                } else {
                    ShowToast("图片创建失败");
                    yield update({ loadUploadImageStatus: { status: 200 } });
                    return;
                }
            }
        },

        /**
         * 运维周期过滤
         * @param {*} param0 
         * @param {*} param1 
         */
        *filterCycleData({ payload }, { call, put, take, update, select }) {
            const { operationPlanList = [], uploadData } = yield select(state => state.BWModel);
            // newUploadData.xmlParamList[0].OPTPID = OPTPID; // 运维计划由运维内容反推而来
            const OPTPID = SentencedToEmpty(uploadData, ['xmlParamList', 0, 'OPTPID'], '');
            let validCycleList = [];
            if (OPTPID != '' && operationPlanList.length > 0) {
                // 符合过滤条件
                let strArr = OPTPID.split(',');
                bwFormatArray(operationPlanList).map((planItem, planIndex) => {
                    strArr.map((planIdItem, planIdIndex) => {
                        // M_GetOperationTaskPlanList   OPTPID 任务计划
                        if (planIdItem == planItem.OPTPID) {
                            if (SentencedToEmpty(validCycleList, [planIdIndex], null) != null) {
                                validCycleList[planIdIndex].push(planItem);
                            } else {
                                validCycleList[planIdIndex] = [];
                                validCycleList[planIdIndex].push(planItem);
                            }
                        }
                    });
                });
                yield update({ validCycleList });
            }
        },
        /**
         * M_GetOperationTaskPlanList
         * 运维任务计划周期列表（进行中）
         */
        *getOperationTaskPlanList({ payload }, { call, put, take, update, select }) {
            const { IDtoOPTID } = yield select(state => state.BWModel);
            // M_GetOperationTaskPlanList
            let params = {
                noCancelFlag: true,
                functionName: 'M_GetOperationTaskPlanList',
                paramList: {
                    OPTID: IDtoOPTID
                }
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.BWApi.BWWebService, params);
            const planList = SentencedToEmpty(result
                , ['data', 'Datas', 'soap:Envelope', 'soap:Body'
                    , 'M_GetOperationTaskPlanListResponse'
                    , 'M_GetOperationTaskPlanListResult', 'Items'
                    , 'Item'
                ], []
            );
            yield update({
                operationPlanList: planList, // 运维计划列表
            });
        },
    },

    subscriptions: {}
});