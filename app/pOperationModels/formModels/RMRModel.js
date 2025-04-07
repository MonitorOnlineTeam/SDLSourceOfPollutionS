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
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import {Model} from '../../dvapack';
import {GetRepairList, GetPatrolList} from '../../utils/formutils';
import moment from 'moment';
import {getToken} from '../../dvapack/storage';

export default Model.extend({
  namespace: 'RMRModel',
  state: {},
  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
  },
  effects: {
    //添加修改
    *AddOrUpdateRecord(
      {payload: {params, actionType, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm[actionType],
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    // 获取
    *GetAllRecord(
      {payload: {params, actionType, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm[actionType],
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    // 删除
    *DeleteRecord(
      {payload: {params, actionType, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm[actionType],
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    setupSubscriber({dispatch, listen}) {
      listen({});
    },
  },
});
