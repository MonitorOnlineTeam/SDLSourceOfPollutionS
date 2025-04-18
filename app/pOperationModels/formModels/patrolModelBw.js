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
import { Model } from '../../dvapack';
import { GetRepairList, GetPatrolList } from '../../utils/formutils';
import moment from 'moment';
import { getToken } from '../../dvapack/storage';

export default Model.extend({
  namespace: 'patrolModelBw',
  state: {},
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    //运维人员列表
    *GetOperationUserBW(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.GetOperationUserBW,
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    *AddOperationUserBW(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.AddOperationUserBW,
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    *DelOperationUserBW(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.DelOperationUserBW,
        params,
      );
      if (result.status != 200) {
        ShowToast(result.message);
      }
      callback && callback(result);
    },
    //添加修改
    *AddOrUpdateRecord(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
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
    // 获取记录
    *GetAllRecord(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
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
    // 删除表单 表单和记录
    *DeleteRecord(
      { payload: { params, actionType, callback } },
      { call, put, update, take, select },
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
    setupSubscriber({ dispatch, listen }) {
      listen({});
    },
  },
});
