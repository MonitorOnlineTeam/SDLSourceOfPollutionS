/*
 * @Description: 关键参数核查
 * @LastEditors: hxf
 * @Date: 2023-02-09 11:49:21
 * @LastEditTime: 2023-08-17 10:52:38
 * @FilePath: /SDLMainProject36/app/pOperationModels/keyParameterVerificationModel.js
 */
import { createAction, NavigationActions, Storage, StackActions, ShowToast, openWebSocket, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import api from '../config/globalapi';
import { Model } from '../dvapack';
import moment from 'moment';

export default Model.extend({
    namespace: 'keyParameterVerificationModel',
    state: {
        operationKeyParameterDetailItem:null,// 待提交 选中项目
        // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
        // 待提交 1
        unsubmitParams:{
            // index:1,
            // pageSize:20,
            typeID:1,
        },
        unsubmitResult:{status:-1},
        unsubmitDataList:[],
        // 已提交 2
        submittedParams:{
            // index:1,
            // pageSize:20,
            typeID:2,
        },
        submittedResult:{status:-1},
        submittedDataList:[],
        // 待整改 3
        toBeCorrectedParams:{
            // index:1,
            // pageSize:20,
            typeID:3,
        },
        toBeCorrectedResult:{status:-1},
        toBeCorrectedDataList:[],
        // 已整改 4
        alreadyCorrectedParams:{
            // index:1,
            // pageSize:20,
            typeID:4,
        },
        alreadyCorrectedResult:{status:-1},
        alreadyCorrectedDataList:[],
        // 申诉中 5
        underAppealParams:{
            // index:1,
            // pageSize:20,
            typeID:5,
        },
        underAppealResult:{status:-1},
        underAppealDataList:[],
        // 已完成 6
        completedRecordsParams:{
            // index:1,
            // pageSize:20,
            typeID:6,
            beginTime:moment().subtract(1,'months').format('YYYY-MM-DD 00:00:00'),
            endTime:moment().format('YYYY-MM-DD 23:59:59')
        },
        completedRecordsResult:{status:-1},
        completedRecordsDataList:[],
        // 新增核查信息 配置信息
        KeyParameterCodeListResult:{status:-1},
        // 待提交item id
        operationKeyParameterDetailId:'',
        // 核查信息提交对象
        keyParameterVerificationEditData:{
            DGIMN:'',
            list:[
                {
                    "Type": "sample string 2",
                    "File": "sample string 3",
                    "Remark": "sample string 4",
                }
            ]
        },
        // 核查信息提交对象 提交结果及状态
        addOrUpdOperationKeyParameterResult:{status:200},
        operationKeyParameterDetailResult:{status:-1},
        // 关键参数核查 tab 计数
        OperationKeyParameterCountResult:{status:-1},
        // 删除记录 参数
        deleteRecordParams:{},
        // 删除记录 结果和状态
        deleteOperationKeyResult:{status:200},
        // 核查问题                
        verificationProblemDetailResult:null,
        // 整改参数
        rectifyVerificationProblemParams:{
            id:'',
            typeID:'',
            DGIMN:'',
            list:[
                {
                    ID:'',
                    Remark:'',
                    File:'',
                    SubmitStatus:1,
                }
            ]
        },
        // 待整改详情参数
        verificationProblemParams:{
            typeID: 3,
            id:''
        }
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 关键参数核查 tab 计数
         */
        *getOperationKeyParameterCount({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterCount
                , {});
            yield update({ OperationKeyParameterCountResult: result});
        },
        /**
         * 关键参数核查 删除记录
         */
        *deleteOperationKeyParameter({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
            let { deleteRecordParams } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.DeleteOperationKeyParameter
                , deleteRecordParams);
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                
                if (deleteRecordParams.typeID == 1){
                    yield update({
                        unsubmitResult: {status:-1},
                    })
                    yield put(createAction('getUnsubmitList')({}));
                } else if (deleteRecordParams.typeID == 2){
                    yield update({
                        submittedResult:{status:-1},
                    })
                    yield put(createAction('getSubmittedList')({}));
                }
                yield put(createAction('getOperationKeyParameterCount')({}));
            }
            yield update({ deleteRecordParams: {},deleteOperationKeyResult:result});
        },
        /**
         * 关键参数核查 待提交 列表
         */
        *getUnsubmitList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
            let { unsubmitParams, unsubmitDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
                , {...unsubmitParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (unsubmitParams.index == 1) {
                    yield update({ unsubmitResult: result
                        , unsubmitDataList:data
                    });
                    setListData(data);
                } else {
                    let newData =  unsubmitDataList.concat(data);
                    yield update({ unsubmitResult: result
                        , unsubmitDataList:newData
                    });
                    setListData(newData);
                }
            } else {
                yield update({ unsubmitResult: result, unsubmitDataList:[] });
            }
        },
        /**
         * 关键参数核查 已提交 列表
         */
        *getSubmittedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { submittedParams, submittedDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
                , {...submittedParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                if (submittedParams.index == 1) {
                    yield update({ submittedResult: result
                        , submittedDataList:data
                    });
                    setListData(data);
                } else {
                    let newData =  submittedDataList.concat(data);
                    yield update({ submittedResult: result
                        , submittedDataList:newData
                    });
                    setListData(newData);
                }
            } else {
                yield update({ submittedResult: result, submittedDataList:[] });
            }
        },
        /**
         * 关键参数核查 待整改 列表
         */
        *getToBeCorrectedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { toBeCorrectedParams, toBeCorrectedDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
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
         * 关键参数核查 已整改 列表
         */
        *getAlreadyCorrectedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { alreadyCorrectedParams, alreadyCorrectedDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
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
         * 关键参数核查 申诉中 列表
         */
        *getUnderAppealList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { underAppealParams, underAppealDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
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
        /**
         * 
         * 关键参数核查 已完成核查记录 列表
         */
        *getKeyParameterVerificationCompletedList({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { completedRecordsParams, completedRecordsDataList } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterList
                , {...completedRecordsParams,noCancelFlag:true});
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let data = SentencedToEmpty(result, ['data', 'Datas'], []);
                yield update({ completedRecordsResult: result
                    , completedRecordsDataList:data
                });
                setListData(data);
                // if (completedRecordsParams.index == 1) {
                //     yield update({ completedRecordsResult: result
                //         , completedRecordsDataList:data
                //     });
                //     setListData(data);
                // } else {
                //     let newData =  completedRecordsDataList.concat(data);
                //     yield update({ completedRecordsResult: result
                //         , completedRecordsDataList:newData
                //     });
                //     setListData(newData);
                // }
            } else {
                yield update({ completedRecordsResult: result, completedRecordsDataList:[] });
            }
        },
        /**
         * 
         * 关键参数核查 核查信息列表 获取因子列表列表
         */
        *getKeyParameterCodeList({ payload:{callback = data => {}} }, { call, put, take, update, select }) {
            let { keyParameterVerificationEditData } = yield select(state => state.keyParameterVerificationModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetKeyParameterCodeList
                , {});
            let list = SentencedToEmpty(result,['data','Datas'],[]);
            let data = []
            list.map((item,key)=>{
                data.push({
                    "Type": item.id,
                    "File": `${key}_${new Date().getTime()}`,
                    "Remark": "",
                });
            })
            let newKeyParameterVerificationEditData = {...keyParameterVerificationEditData};
            newKeyParameterVerificationEditData.list = data;
            yield update({KeyParameterCodeListResult:result
                , keyParameterVerificationEditData:newKeyParameterVerificationEditData});
            callback();
        },
        /**
         * 
         * 关键参数核查 新增核查信息 
         */
        *addOrUpdOperationKeyParameter({ payload:{setListData = data => {}} }, { call, put, take, update, select }) {
            let { keyParameterVerificationEditData } = yield select(state => state.keyParameterVerificationModel);
            //数据校验
            if (SentencedToEmpty(keyParameterVerificationEditData,['DGIMN'],'') == '' ) {
                ShowToast('请选择企业与监测点');
                return;
            }
            let dataList = SentencedToEmpty(keyParameterVerificationEditData,['list'],[]);
            let notFilled = false;
            dataList.map((record,index)=>{
                if (SentencedToEmpty(record,['fileList'],[]).length==0
                    &&SentencedToEmpty(record,['Remark'],'')=='') {
                    notFilled = true;
                }
                
            })
            // submitStatus 1暂存 2提交
            if (notFilled&&keyParameterVerificationEditData.submitStatus == 2) {
                ShowToast('请上传图片或填写备注信息');
                return;
            }
            yield update({
                addOrUpdOperationKeyParameterResult:{status:-1}
            });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.AddOrUpdOperationKeyParameter
                , keyParameterVerificationEditData);
            let submitStatus = keyParameterVerificationEditData.submitStatus;
            // submitStatus 1暂存 2提交
            if (result.status == 200 && result.data.IsSuccess == true) {
                
                yield update({
                    addOrUpdOperationKeyParameterResult:result,
                    unsubmitResult: {status:-1},
                    submittedResult:{status:-1},
                });
                if (submitStatus == 1) {
                    ShowToast('暂存成功');
                } else if (submitStatus == 2) {
                    ShowToast('提交成功');
                }
                yield put(NavigationActions.back());
                yield put(createAction('getUnsubmitList')({}));
                yield put(createAction('getSubmittedList')({}));
                yield put(createAction('getOperationKeyParameterCount')({}));
            } else {
                if (submitStatus == 1) {
                    ShowToast('暂存失败');
                } else if (submitStatus == 2) {
                    ShowToast('提交失败');
                }
                yield update({
                    addOrUpdOperationKeyParameterResult:result
                });
            }
            
        },
        /**
         * 
         * 关键参数核查 获取列表详情
         */
        *getOperationKeyParameterDetailList({ payload:{params,dispatch=()=>{},setDataToPointPicker=()=>{}} }, { call, put, take, update, select }) {
            let {   KeyParameterCodeListResult
                    , keyParameterVerificationEditData
                    , operationKeyParameterDetailItem
                } = yield select(state => state.keyParameterVerificationModel);
            // 此处需要传递列表id
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterDetailList
                , params);
            let editData = SentencedToEmpty(result,['data','Datas'],[]);
            let list = SentencedToEmpty(KeyParameterCodeListResult,['data','Datas'],[]);
            let data = []
            let dataIndex,fileRecords;
            if(editData.length==list.length) {
                list.map((item,key)=>{
                    dataIndex = editData.findIndex((formItem,index)=>{
                        return formItem.typeID == item.id;
                    })
                    if (dataIndex!=-1) {
                        // 服务端 设置AttachID 就可以去掉这部分逻辑
                        fileRecords = editData[dataIndex].fileList.concat([]);
                        fileRecords.map((imageItem,imageIndex)=>{
                            imageItem.AttachID = imageItem.FileName;
                        })
                        data.push({
                            "ID":`${SentencedToEmpty(editData,[dataIndex,'id'],'')}`,
                            "Type": item.id,
                            "File": `${SentencedToEmpty(editData,[dataIndex,'fileID'],'empty_id')}`,
                            "Remark": `${SentencedToEmpty(editData,[dataIndex,'remark'],'')}`,
                            fileList:fileRecords
                        });
                    }
                })

                
                yield put(createAction('app/updateState')({
                    selectEnterprise:{
                        Id: SentencedToEmpty(editData,[0,'entID'],''),
                        EntName:SentencedToEmpty(editData,[0,'entName'],''),
                        Name:SentencedToEmpty(editData,[0,'entName'],'')
                    }
                }));
                const { selectEnterprise } = yield select(state => state.app)
                if (SentencedToEmpty(editData,[0,'entID'],'')!='') {
                    yield put(createAction('app/getPointListByEntCode')({
                        params: {
                            entCode: SentencedToEmpty(editData,[0,'entID'],''),
                            callback: pointItem => {
                                let newData = {...selectEnterprise};
                                newData.PointList = pointItem
                                // dispatch(createAction('app/updateState')({
                                //     selectEnterprise:newData
                                // }));
                            }
                        }
                    }));
                }
                
                let newKeyParameterVerificationEditData = {...keyParameterVerificationEditData};
                newKeyParameterVerificationEditData.list = data;
                newKeyParameterVerificationEditData.id = params.id;
                newKeyParameterVerificationEditData.DGIMN = SentencedToEmpty(editData,[0,'DGIMN'],'');
                newKeyParameterVerificationEditData.selectPointItem = {
                    PointName:SentencedToEmpty(editData,[0,'pointName'],''),
                    DGIMN:SentencedToEmpty(editData,[0,'DGIMN'],'')
                };
                // setDataToPointPicker({
                //     PointName:SentencedToEmpty(editData,[0,'pointName'],''),
                //     DGIMN:SentencedToEmpty(editData,[0,'DGIMN'],'')
                // });
                yield update({operationKeyParameterDetailResult:result
                    , keyParameterVerificationEditData:newKeyParameterVerificationEditData
                });
            } else {
                // 企业信息 从前一级获取到
                // yield put(createAction('app/updateState')({
                //     selectEnterprise:{
                //         Id: SentencedToEmpty(operationKeyParameterDetailItem,['entID'],''),
                //         EntName:SentencedToEmpty(operationKeyParameterDetailItem,['entName'],''),
                //         Name:SentencedToEmpty(operationKeyParameterDetailItem,['entName'],''),
                //     },
                // }));
                // setDataToPointPicker({
                //     PointName:SentencedToEmpty(operationKeyParameterDetailItem,['pointName'],''),
                //     DGIMN:SentencedToEmpty(operationKeyParameterDetailItem,['DGIMN'],'')
                // });
                let newKeyParameterVerificationEditData = {...keyParameterVerificationEditData};
                newKeyParameterVerificationEditData.id = params.id;
                // newKeyParameterVerificationEditData.selectPointItem = {
                //     DGIMN:SentencedToEmpty(operationKeyParameterDetailItem,['DGIMN'],''),
                //     PointName:SentencedToEmpty(operationKeyParameterDetailItem,['pointName'],'')
                // }
                // newKeyParameterVerificationEditData.DGIMN = SentencedToEmpty(operationKeyParameterDetailItem,['DGIMN'],'');
                yield update({operationKeyParameterDetailResult:result
                    , keyParameterVerificationEditData:newKeyParameterVerificationEditData
                });
            }
        },
        /**
         * 
         * 关键参数核查 获取待整改详情
         */
        *getVerificationProblemDetail({ payload:{params,dispatch=()=>{},setListData=()=>{}} }, { call, put, take, update, select }) {
            // 此处需要传递列表id
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.GetOperationKeyParameterDetailList
                , params);
            
            yield update({ verificationProblemDetailResult:result });
            setListData(SentencedToEmpty(result,['data','Datas'],[]));
        },
        /**
         * 关键参数核查 整改提交 申诉提交
         */
        *rectifyVerificationProblem({ payload:{params,dispatch=()=>{}} }, { call, put, take, update, select }) {
            const { rectifyVerificationProblemParams, verificationProblemParams } = yield select(state => state.keyParameterVerificationModel);
            const { isLast=false } = rectifyVerificationProblemParams;
            // 此处需要传递列表id
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.AddOrUpdOperationKeyParameter
                , rectifyVerificationProblemParams);
            if (result.status == 200 && result.data.IsSuccess == true) {
                ShowToast('提交成功');
                yield put(createAction('getVerificationProblemDetail')(
                    {
                        params:verificationProblemParams
                    }
                ))
                yield put(createAction('getToBeCorrectedList')({}));
                yield put(createAction('getOperationKeyParameterCount')({}));
                yield put(NavigationActions.back());
                if (isLast) {
                    yield put(NavigationActions.back());
                }
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * 关键参数核查 申诉or整改 撤销
         */
        *withdrawQuestionKeyParameter({ payload:{params,superListData={},type='',dispatch=()=>{},isLast=false } }, { call, put, take, update, select }) {
            const { rectifyVerificationProblemParams } = yield select(state => state.keyParameterVerificationModel);
            // 此处需要传递列表id
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.WithdrawQuestionKeyParameter
                , params);
            if (result.status == 200 && result.data.IsSuccess == true) {
                ShowToast('提交成功');
                // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                if (type=='Rectify') {
                    yield put(createAction('getVerificationProblemDetail')(
                        {
                            params:{
                                typeID: 4,
                                id:superListData.id
                            },
                        }
                    ))
                    yield put(createAction('getAlreadyCorrectedList')({}));
                } else if(type=='Appeal')  {
                    yield put(createAction('getVerificationProblemDetail')(
                        {
                            params:{
                                typeID: 5,
                                id:superListData.id
                            },
                        }
                    ))
                    yield put(createAction('getUnderAppealList')({}));
                }
                yield put(createAction('getOperationKeyParameterCount')({}));
                yield put(NavigationActions.back());
                if (isLast) {
                    yield put(NavigationActions.back());
                }
            } else {
                ShowToast('提交失败');
            }
        },



        
        /**
         * 获取指定月份各类异常信息
         * @param {*} param0
         * @param {*} param1
         */
        *getMobileCalendarInfo({ payload }, { call, put, take, update, select }) {
            let { CalendarDate } = yield select(state => state.exceptionModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Exception.GetMobileCalendarInfo, {
                CalendarDate
            });
            if (SentencedToEmpty(result, ['status'], -1) == 200) {
                let newExceptionCalenderData = SentencedToEmpty(result, ['data', 'Datas', 'futureTimeList'], []);
                // let newExceptionCalenderData = SentencedToEmpty(result, ['data', 'Datas'], []);
                newExceptionCalenderData.map((item, index) => {
                    let date = SentencedToEmpty(item, ['ExcetionDate'], '');
                    if (date != '') {
                        item.date = date;
                        let TaskFlag = SentencedToEmpty(item, ['TaskFlag'], -1);
                        if (TaskFlag == 2) {
                            item.style = { backgroundColor: '#fc953f' };
                        } else if (TaskFlag == 1) {
                            item.style = { backgroundColor: '#4d8ffa' };
                        } else if (TaskFlag == 3) {
                            item.style = { backgroundColor: '#99d55d' };
                        } else {
                            item.style = { backgroundColor: '#00000000' };
                        }
                    }
                });
                yield update({ ExceptionCalenderData: newExceptionCalenderData, ExceptionCalenderDataResult: result });
            }
        },
        /**
         * 关键参数核查转发
         * keyParameterVerificationModel/RetransmissionKeyParameter
         * @param {*} param0 
         * @param {*} param1 
         */
        *RetransmissionKeyParameter({ payload:{ params, callback=()=>{}, failureCallback=()=>{} } }, { call, put, take, update, select }) {

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.KeyParameterVerification.RetransmissionKeyParameter
                , params
            );
            // yield update({ keyParameterRetransmissionResult:result});
            if (result.status == 200 && result.data.IsSuccess == true) {
                ShowToast('转发成功');
                callback();
            } else {
                failureCallback();
                ShowToast('转发失败');
            }
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
