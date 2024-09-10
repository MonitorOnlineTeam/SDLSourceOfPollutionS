/*
 * @Description: 标准溶液核查接口
 * @LastEditors: hxf
 * @Date: 2022-01-20 19:15:09
 * @LastEditTime: 2022-03-15 13:48:10
 * @FilePath: /SDLMainProject/app/pOperationModels/formModels/standardSolutionCheckModel.js
 */

import moment from 'moment';
import * as authService from '../../services/auth';
import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../../utils';
import { Model } from '../../dvapack';
import { loadToken, saveRouterConfig, getToken } from '../../dvapack/storage';
import api from '../../config/globalapi';
import { UrlInfo } from '../../config/globalconst';

export default Model.extend({
    namespace: 'standardSolutionCheckModel',
    state: {
        waterCheckRecordListResult:{status:-1},
        waterCheckRecordListSaveResult:{ status: 200}, // 保存提交状态
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
        innerList:[],
        AnalyzerID:'',// 项目ID
        AnalyzerName:'',// 项目名称
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
        *getWaterCheckRecordList({ payload }, { call, put, update, take, select }) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { TypeID='', callback=()=>{} } = payload;
            let body = {
                TaskID: taskDetail.ID,
                TypeID
            };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetWaterCheckRecordList, body);
            yield update({ 
                waterCheckRecordListResult: result,
            });
        },
        /**
         * 废水校准记录 添加废水校准记录表
         * @param {*} param0 
         * @param {*} param1 
         */
        *addWaterCheckRecordRecord({ payload }, { call, put, update, take, select }) {
            yield update({waterCheckRecordListSaveResult:{status:-2}});
            // let { record, callback=()=>{} } = payload;
            const { waterCheckRecordListResult, 
                innerList,
            } = yield select(state => state.standardSolutionCheckModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            let user = getToken();
            const body = {
                TaskID: taskDetail.ID,
                CreateUserID: user.UserId,
                TypeID:SentencedToEmpty(waterCheckRecordListResult
                    ,['data','Datas','Record','TypeID'],''),
                Content:SentencedToEmpty(waterCheckRecordListResult
                    ,['data','Datas','Record','Content'],{}),
                RecordList: innerList
            };
            //    FormMainID:'',// 主表ID
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddWaterCheckRecordRecord, body);
            yield update({waterCheckRecordListSaveResult:result});
            if (result.status == 200 && result.data.IsSuccess) {
                ShowToast('保存成功');
                yield put('getWaterCheckRecordList',{TypeID:SentencedToEmpty(waterCheckRecordListResult
                        ,['data','Datas','Record','TypeID'],'')});
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
            const { waterCheckRecordListResult } = yield select(state => state.standardSolutionCheckModel);
            if (SentencedToEmpty(waterCheckRecordListResult
                ,['data','Datas','Record','ID'],'') != '') {
                //已经保存 执行删除方法 并刷新上一个页面
                // DType=1 删除主表与子表FormMainID不能为空 
                params = { 
                    DType:1,
                    FormMainID:SentencedToEmpty(waterCheckRecordListResult
                        ,['data','Datas','Record','ID'],'')
                };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteWaterCheckRecordRecord, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
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
            const { waterCheckRecordListResult } = yield select(state => state.standardSolutionCheckModel);
            //已经保存 执行删除方法 并刷新上一个页面
            // DType=2 删除子表FormMainID不能为空并且ID不能为空 
            params.DType = 2;
            params.FormMainID = SentencedToEmpty(waterCheckRecordListResult
                        ,['data','Datas','Record','ID'],'');
            // const result = yield call(formSers.DeleteBdRecord, params);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteWaterCheckRecordRecord, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //删除成功
                    //更新相关显示内容
                    yield update({itemDeleteResult:result});
                    yield put('getWaterCheckRecordList',{TypeID:SentencedToEmpty(waterCheckRecordListResult
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