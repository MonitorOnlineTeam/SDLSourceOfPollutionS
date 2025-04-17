import {
  createAction,
  NavigationActions,
  delay,
  Storage,
  ShowToast,
  StackActions,
  fast,
  slow,
  SentencedToEmpty,
} from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import {Model} from '../../dvapack';

/**
 * 巡检表单
 * LSK
 */
export default Model.extend({
  namespace: 'indicationErrorAndResponseTimeModel',
  state: {
    list: [],
  },
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
  },

  effects: {
    // 获取示值误差和响应时间数据
    *GetIndicationErrorSystemResponseRecordList(
      {payload: {params, callback, isZB}},
      {call, put, update, take, select},
    ) {
      const apiUrl = isZB
        ? api.pOperationApi.OperationForm
            .GetIndicationErrorSystemResponseRecordListForAppZB
        : api.pOperationApi.OperationForm
            .GetIndicationErrorSystemResponseRecordListForApp;
      const result = yield call(authService.axiosAuthPost, apiUrl, params);
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          callback(SentencedToEmpty(result, ['data', 'Datas'], {}));
        } else {
          //提交失败
          ShowToast('发生错误');
        }
      } else {
        //网络异常提交失败
        ShowToast(result.data.Message);
      }
    },
    // 计算示值误差
    *GetIndicationError(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.GetIndicationError,
        params,
      );
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('计算成功');
          callback(SentencedToEmpty(result, ['data', 'Datas'], {}));
        } else {
          ShowToast('发生错误');
        }
      } else {
        ShowToast(result.data.Message);
      }
    },
    // 添加或修改示值误差及响应时间
    *AddOrUpdateIndicationErrorSystemResponseRecord(
      {payload: {params, callback, isZB}},
      {call, put, update, take, select},
    ) {
      const apiUrl = isZB
        ? api.pOperationApi.OperationForm
            .AddOrUpdateIndicationErrorSystemResponseRecordZB
        : api.pOperationApi.OperationForm
            .AddOrUpdateIndicationErrorSystemResponseRecord;
      const result = yield call(authService.axiosAuthPost, apiUrl, params);
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('保存成功');
          callback();
        } else {
          ShowToast('发生错误');
        }
      } else {
        ShowToast(result.data.Message);
      }
    },
    // 提交示值误差及响应时间 - 淄博主表
    *SubmitIndicationErrorSystemResponseRecordZB(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm
          .SubmitIndicationErrorSystemResponseRecordZB,
        params,
      );
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('提交成功');
          callback();
        } else {
          ShowToast('发生错误');
        }
      } else {
        ShowToast(result.data.Message);
      }
    },
    // 删除示值误差及响应时间量程
    *DeleteErrorSystemResponseRecordInfo(
      {payload: {params, callback, isZB}},
      {call, put, update, take, select},
    ) {
      const apiUrl = isZB
        ? api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecordInfoZB
        : api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecordInfo;
      const result = yield call(authService.axiosAuthPost, apiUrl, params);
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('删除成功');
          callback();
        } else {
          ShowToast('发生错误');
        }
      } else {
        ShowToast(result.data.Message);
      }
    },
    // 删除示值误差及响应时间整个表单
    *DeleteErrorSystemResponseRecord(
      {payload: {params, callback, isZB}},
      {call, put, update, take, select},
    ) {
      const apiUrl = isZB
        ? api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecordZB
        : api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecord;
      const result = yield call(authService.axiosAuthPost, apiUrl, params);
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('删除成功');
          callback();
        } else {
          ShowToast('发生错误');
        }
      }
    },
    setupSubscriber({dispatch, listen}) {
      listen({
        // MyPhoneList: ({ params }) => {
        //   dispatch({
        //     type: 'loadcontactlist',
        //     payload: {
        //     }
        //   });
        // },
      });
    },
  },
});
