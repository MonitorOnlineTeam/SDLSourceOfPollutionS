// 现场勘查信息✅，验货单✅，项目交接单，安装报告，72小时调试检测，比对监测报告，验收资料

import { SentencedToEmpty, ShowToast, NavigationActions } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';

export default Model.extend({
    namespace: 'CT7FormModel',
    state: {
        publicRecordResult:{status:-1},
        deletePublicRecordResult:{status:200},
        addPublicRecordResult:{status:200},
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        
        // *addAcceptanceServiceRecord(
        *addPublicRecord(
            {
                payload: { params={},callback=()=>{return false} }
            },
            { call, put, take, update, select }
        ) {
            yield update({ addPublicRecordResult:{ status:-1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.AddPublicRecord
                , params
            );
            if (result.status == 200) {
                const handleResult = callback(result);
                if (!handleResult) {
                    ShowToast('提交成功');
                    yield put(NavigationActions.back());
                }
                const { dispatchId } = yield select(state => state.CTModel)
                yield put('CTModel/getServiceDispatchTypeAndRecord',{
                    params:{
                        dispatchId
                    }
                });
            }
            yield update({
                addPublicRecordResult:result
            });
        },
        // *getAcceptanceServiceRecord(
        *getPublicRecord(
            {
                payload: { params={},callback=()=>{return false} }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.GetPublicRecord
                , params
            );
            if (result.status == 200) {
                // callback(SentencedToEmpty(result,['data','Datas',0],{}));
                const handleResult = callback(result);
                if (!handleResult) {
                    yield update({
                        publicRecordResult:result
                    });
                }
            } else {
                yield update({
                    publicRecordResult:result
                });
            }
            // yield update({
            //     acceptanceServiceRecordResult:result
            // });
        },
        // *deleteAcceptanceServiceRecord(
        *deletePublicRecord(
            {
                payload: { params={},setListData=()=>{} }
            },
            { call, put, take, update, select }
        ) {
            yield update({ deletePublicRecordResult:{ status:-1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pOperationApi.CTApi.DeletePublicRecord
                , params
            );
            if (result.status == 200) {
                ShowToast('删除成功');
                yield put(NavigationActions.back());
                const { dispatchId } = yield select(state => state.CTModel)
                yield put('CTModel/getServiceDispatchTypeAndRecord',{
                    params:{
                        dispatchId
                    }
                });
            }
            yield update({
                deletePublicRecordResult:result
            });
        },
    },

    subscriptions: {}
});