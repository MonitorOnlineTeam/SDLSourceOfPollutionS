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
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm
          .GetIndicationErrorSystemResponseRecordListForApp,
        params,
      );
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
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm
          .AddOrUpdateIndicationErrorSystemResponseRecord,
        params,
      );
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
    // 删除示值误差及响应时间量程
    *DeleteErrorSystemResponseRecordInfo(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecordInfo,
        params,
      );
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
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        authService.axiosAuthPost,
        api.pOperationApi.OperationForm.DeleteErrorSystemResponseRecord,
        params,
      );
      if (result.status == 200) {
        if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
          ShowToast('删除成功');
          callback();
        } else {
          ShowToast('发生错误');
        }
      }
    },
    // /** 根据TaskID获取表单信息 */
    // *getForm({payload: {params, callback}}, {call, put, update, select, take}) {
    //   yield update({imageStatus: {status: -1}});
    //   // params = { FormMainID: params.FormMainID };
    //   const result = yield call(
    //     authService.axiosAuthPost,
    //     api.pOperationApi.OperationForm.GetImageForm,
    //     params,
    //   );
    //   let data = {};
    //   if (result.status == 200) {
    //     if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
    //       data = SentencedToEmpty(result, ['data', 'Datas'], {});
    //       yield update({ImageForm: data});
    //       callback(data);
    //     } else {
    //       //数据获取失败
    //       // ShowToast('发生错误');
    //     }
    //   } else {
    //     //网络异常
    //   }
    //   yield update({imageStatus: result});
    // },

    // /** 删除表单 */
    // *delForm(
    //   {payload: {params, callback = () => {}}},
    //   {call, put, update, take, select},
    // ) {
    //   if (params.FormMainID) {
    //     //已经保存 执行删除方法 并刷新上一个页面
    //     params = {FormMainID: params.FormMainID};
    //     const result = yield call(
    //       authService.axiosAuthPost,
    //       api.pOperationApi.OperationForm.DeleteImageForm,
    //       params,
    //     );
    //     if (result.status == 200) {
    //       if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
    //         //删除成功
    //         //更新相关显示内容
    //         // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
    //         // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
    //         callback();
    //         ShowToast('删除成功');
    //         yield put(NavigationActions.back());
    //       } else {
    //         //关闭进度条
    //         ShowToast('发生错误，删除失败');
    //       }
    //     } else {
    //       //发生错误
    //       //关闭进度条
    //       // yield update({ liststatus: 'ok' });
    //       ShowToast('发生错误，删除失败');
    //     }
    //     // const result = yield call(formSers.DeletePatrolRecordList, params);
    //     // if (result && result.requstresult && result.requstresult == 1) {
    //     //     //删除成功
    //     //     yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
    //     //     yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
    //     //     yield put(NavigationActions.back());
    //     // } else if (result && result.requstresult && result.requstresult == 5) {
    //     //     //网络连接失败
    //     //     yield update({ editstatus: 'ok' });
    //     //     ShowToast('网络异常，删除失败');
    //     // } else {
    //     //     //发生错误
    //     //     yield update({ editstatus: 'ok' });
    //     //     ShowToast('发生错误，删除失败');
    //     // }
    //   } else {
    //     //没有ID 尚未保存 直接返回上一个页面
    //     yield delay(800); //预防界面变的太快 过于突兀
    //     yield put(NavigationActions.back());
    //   }
    // },

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
