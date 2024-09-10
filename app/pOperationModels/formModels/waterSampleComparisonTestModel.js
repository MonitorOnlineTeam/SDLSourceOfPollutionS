/*
 * @Description: 实际水样比对试验结果记录表 model
 * @LastEditors: hxf
 * @Date: 2022-01-25 13:41:07
 * @LastEditTime: 2022-03-15 10:51:32
 * @FilePath: /SDLMainProject/app/pOperationModels/formModels/waterSampleComparisonTestModel.js
 */

import moment from 'moment';
import * as authService from '../../services/auth';
import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../../utils';
import { Model } from '../../dvapack';
import { loadToken, saveRouterConfig, getToken } from '../../dvapack/storage';
import api from '../../config/globalapi';
import { UrlInfo } from '../../config/globalconst';

export default Model.extend({
    namespace: 'waterSampleComparisonTestModel',
    state: {
        waterComparisonTestRecordListResult:{status:-1},
        waterComparisonTestRecordListSaveResult:{ status: 200}, // 保存提交状态
        // innerList:[
        //     {
        //         FirstPoint:'',//  第一点   标准浓度 与信号值用逗号分隔
        //         FourthPoint:'',// 第四点   标准浓度 与信号值用逗号分隔
        //         IsQualified:0,// 是否合格 0否 1是
        //         SecondPoint:'',// 第二点   标准浓度 与信号值用逗号分隔
        //         ThirdPoint:'',// 第三点   标准浓度 与信号值用逗号分隔
        //         CompletionTime:moment().format('YYYY-MM-DD HH:mm:ss'),// 校准完成时间
        //     }
        // ],
        content:{
            MaintenanceManagementUnit:'',
            TestTime:moment().format('YYYY-MM-DD HH:00:00'),
        },
        innerList:[],
        // AnalyzerID:'',// 项目ID
        // AnalyzerName:'',// 项目名称
        ParametersID:'',// 参数ID
        ParametersName:'',// 参数名称
        formDeleteResult:{status:200},// 表单删除命令执行状态
        itemDeleteResult:{status:200},// 单条记录删除命令执行状态
        loadingText:'命令执行中'
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取废水校准记录列表 
         * @param {*} param0 
         * @param {*} param1 
         */
        *getWaterComparisonTestRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID='', callback=()=>{} } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetWaterComparisonTestRecordList, body);
            yield update({ 
                waterComparisonTestRecordListResult: result,
                content:SentencedToEmpty(result,['data','Datas','Record','Content'],{
                    MaintenanceManagementUnit:'',
                    TestTime:moment().format('YYYY-MM-DD HH:00:00'),
                }),
            });
        },
        /**
         * 废水校准记录 添加废水校准记录表
         * @param {*} param0 
         * @param {*} param1 
         */
        *addWaterComparisonTestRecord({ payload }, { call, put, update, take, select }) {
            yield update({waterComparisonTestRecordListSaveResult:{status:-2}});
            // let { record, callback=()=>{} } = payload;
            const { waterComparisonTestRecordListResult, 
                innerList,
                content,
            } = yield select(state => state.waterSampleComparisonTestModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            let TypeID = SentencedToEmpty(waterComparisonTestRecordListResult
                    ,['data','Datas','Record','TypeID'],'');
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID,
                Content:content,
                RecordList: innerList
            };
            //    FormMainID:'',// 主表ID
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddWaterComparisonTestRecord, body);
            yield update({waterComparisonTestRecordListSaveResult:result});
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('保存成功');
                // 本地修改任务详情表单列表状态 
                yield put(createAction('taskDetailModel/updateFormStatus')({
                    cID: TypeID }));
                yield put('getWaterComparisonTestRecordList',{TypeID});
                yield put(NavigationActions.back());
            } else {
                ShowToast('提交失败');
            }
        },
        /**
         * 废水校准记录 删除表单
         * @param {*} param0 
         * @param {*} param1 
         * DType=1删除主表FormMainID不能为空,
         * DType=2删除子表FormMainID不能为空ID不能为空
         */
        /** 删除表单 */
        *delForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ formDeleteResult: { status: -1 } });
            const { waterComparisonTestRecordListResult } = yield select(state => state.waterSampleComparisonTestModel);
            if (SentencedToEmpty(waterComparisonTestRecordListResult
                ,['data','Datas','Record','ID'],'') != '') {
                //已经保存 执行删除方法 并刷新上一个页面
                // DType=1 删除主表与子表FormMainID不能为空 
                params = { 
                    DType:1,
                    FormMainID:SentencedToEmpty(waterComparisonTestRecordListResult
                        ,['data','Datas','Record','ID'],'')
                };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteWaterComparisonTestRecord, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        // 本地修改任务详情表单列表状态 
                        yield put(createAction('taskDetailModel/updateFormStatus')({
                            cID: SentencedToEmpty(waterComparisonTestRecordListResult
                            ,['data','Datas','Record','TypeID'],''),isAdd:false }));
                        //更新相关显示内容
                        yield update({ formDeleteResult: result });
                        yield put(NavigationActions.back());
                    } else {
                        //关闭进度条
                        yield update({ formDeleteResult: { status: 200 } });
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    yield update({ formDeleteResult: { status: 200 } });
                    ShowToast('网络异常，删除失败');
                }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                // yield delay(800); //预防界面变的太快 过于突兀
                yield update({ formDeleteResult: { status: 200 } });
                yield put(NavigationActions.back());
            }
        },
        /** 删除子表 */
        *delSubtable(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ itemDeleteResult: { status: -1 } });
            const { waterComparisonTestRecordListResult } = yield select(state => state.waterSampleComparisonTestModel);
            //已经保存 执行删除方法 并刷新上一个页面
            // DType=2 删除子表FormMainID不能为空并且ID不能为空 
            params.DType = 2;
            params.FormMainID = SentencedToEmpty(waterComparisonTestRecordListResult
                        ,['data','Datas','Record','ID'],'');
            // const result = yield call(formSers.DeleteBdRecord, params);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteWaterComparisonTestRecord, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //删除成功
                    //更新相关显示内容
                    yield update({itemDeleteResult:result});
                    yield put('getWaterComparisonTestRecordList',{TypeID:SentencedToEmpty(waterComparisonTestRecordListResult
                        ,['data','Datas','Record','TypeID'],'')});
                    yield put(NavigationActions.back());
                } else {
                    //关闭进度条
                    yield update({ itemDeleteResult: { status: 200 } });
                    ShowToast('发生错误，删除失败');
                }
            } else {
                //发生错误
                //关闭进度条
                // yield update({ liststatus: 'ok' });
                yield update({ itemDeleteResult: { status: 200 } });
                ShowToast('网络异常，删除失败');
            }
        },
    },

    subscriptions: {
        //所有model中至少要注册一次listen
        setupSubscriber({ dispatch, listen }) {
            listen({
                
            });
        }
    }
});