/*
 * @Description: 督查记录 model
 * @LastEditors: hxf
 * @Date: 2022-03-24 13:57:31
 * @LastEditTime: 2022-05-06 11:16:48
 * @FilePath: /SDLMainProject/app/pOperationModels/inspectionRecordsModel.js
 */
import { createAction, NavigationActions, Storage, StackActions, ShowToast, openWebSocket, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import api from '../config/globalapi';
import { Model } from '../dvapack';
import moment from 'moment';
import { getRootUrl } from '../dvapack/storage';

export default Model.extend({
    namespace: 'inspectionRecordsModel',
    state: {
        remoteInspectorListResult:{status:-1},
        remoteInspectorListData:[],
        remoteInspectorListTotal:0,
        CheckStatus:-1, // 督查审核状态 1为合格  2 为不合格 ‘’为全部
        DateTime: moment().format('YYYY-MM-DD 00:00:00'), // 督查时间
        BeginTime:moment().subtract(30,'days').format('YYYY-MM-DD 00:00:00'),// 督查开始时间
        EndTime:moment().format('YYYY-MM-DD 23:59:59'),// 督查结束时间
        EntCode:'', // 企业id
        PageSize:20, // 每页大小
        PageIndex:1, // 页码
        isChecked: 1,// 手机端只能查询已核实的督查记录表
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 督查记录 获取列表
         */
        *getRemoteInspectorList({ payload:{setListData=()=>{}} }, { call, put, take, update, select }) {
            const { CheckStatus, DateTime
            , EntCode, PageSize
            , PageIndex
            , remoteInspectorListData
            , BeginTime, EndTime } = yield select(state => state.inspectionRecordsModel)
            const { selectEnterprise } = yield select(state => state.app)
            let params = {
                CheckStatus: CheckStatus == -1? '':CheckStatus,
                // DateTime,
                BeginTime,
                EndTime,
                EntCode:SentencedToEmpty(selectEnterprise,['Id'],''),
                PageSize,
                PageIndex,
                isChecked: 1,
            }
            let requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetRemoteInspectorList, params);
            let requestEnd = new Date().getTime();
            if (result.status == 200) {
                let rootUrl = getRootUrl();
                if (PageIndex == 1) {
                    let newData = SentencedToEmpty(result,['data','Datas'],[]);
                    newData.map((item,index)=>{
                        item.formUrl = rootUrl.ReactUrl + '/appoperation/appRemoteSupervisionDetail' + '/' + item.id
                    })
                    if (newData.length == 0) {
                        result.status = 0
                    }
                    yield update({remoteInspectorListData:newData
                        , remoteInspectorListResult:result,remoteInspectorListTotal:SentencedToEmpty(result,['data','Total'],0)})
                    setListData(newData, requestEnd - requestBegin);
                } else {
                    let nextPage = SentencedToEmpty(result,['data','Datas'],[]);
                    nextPage.map((item,index)=>{
                        item.formUrl = rootUrl.ReactUrl + '/appoperation/appRemoteSupervisionDetail' + '/' + item.id
                    })
                    let newData = remoteInspectorListData.concat(nextPage);
                    yield update({remoteInspectorListData:newData
                        , remoteInspectorListResult:result,remoteInspectorListTotal:SentencedToEmpty(result,['data','Total'],0)})
                    setListData(newData, requestEnd - requestBegin);
                }
            } else {
                yield update({remoteInspectorListResult:result,remoteInspectorListTotal:0})
            }
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
