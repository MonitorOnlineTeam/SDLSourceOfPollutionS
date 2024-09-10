import { createAction, NavigationActions, delay, Storage, ShowToast, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
// import * as formSers from '../../services/formSers';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList, GetPatrolList } from '../../utils/formutils';
import moment from 'moment';
import { getToken } from '../../dvapack/storage';

/**
 * 巡检表单
 * LSK
 */
export default Model.extend({
    namespace: 'imageFormModel',
    state: {
        /** AttachID: "ab536b4c-cd94-4e83-96a6-f9915cdf690b"
        ImgList: []
        LowimgList: []
        ThumbimgList: []*/
        ImageForm: {},
        imageStatus: { status: -1 }
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },

    effects: {
        /** 提交表单信息 */
        *addImageForm(
            {
                payload: { params, callback }
            },
            { call, put, update, take, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.AddImageForm, params);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    callback(result.data.Datas.mainID);
                    // yield put(createAction('getForm')({ params: { FormMainID: result.data.Datas.mainID } }));
                    // yield take('getForm/@@end');
                    //关闭等待进度
                    // yield update({ ImageForm: {AttachID:result.data.Datas.attachID,ImgList:[]} });
                } else {
                    //提交失败
                    ShowToast('发生错误');
                }
            } else {
                //网络异常提交失败
                ShowToast(result.data.Message);
                yield update({ editstatus: { status: 200 } });
            }
        },

        /** 根据TaskID获取表单信息 */
        *getForm(
            {
                payload: { params, callback }
            },
            { call, put, update, select, take }
        ) {
            yield update({ imageStatus: { status: -1 } });
            // params = { FormMainID: params.FormMainID };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.GetImageForm, params);
            let data = {};
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    yield update({ ImageForm: data });
                    callback(data);
                } else {
                    //数据获取失败
                    // ShowToast('发生错误');
                }
            } else {
                //网络异常
            }
            yield update({ imageStatus: result });
        },

        /** 删除表单 */
        *delForm(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, update, take, select }
        ) {
            if (params.FormMainID) {
                //已经保存 执行删除方法 并刷新上一个页面
                params = { FormMainID: params.FormMainID };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.DeleteImageForm, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        //删除成功
                        //更新相关显示内容
                        // yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                        // yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                        callback();
                        ShowToast('删除成功');
                        yield put(NavigationActions.back());
                    } else {
                        //关闭进度条
                        ShowToast('发生错误，删除失败');
                    }
                } else {
                    //发生错误
                    //关闭进度条
                    // yield update({ liststatus: 'ok' });
                    ShowToast('发生错误，删除失败');
                }
                // const result = yield call(formSers.DeletePatrolRecordList, params);
                // if (result && result.requstresult && result.requstresult == 1) {
                //     //删除成功
                //     yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID })); //删除后刷新前一个页面
                //     yield take('excuteTask/getTaskDetailWithoutTaskDescription/@@end');
                //     yield put(NavigationActions.back());
                // } else if (result && result.requstresult && result.requstresult == 5) {
                //     //网络连接失败
                //     yield update({ editstatus: 'ok' });
                //     ShowToast('网络异常，删除失败');
                // } else {
                //     //发生错误
                //     yield update({ editstatus: 'ok' });
                //     ShowToast('发生错误，删除失败');
                // }
            } else {
                //没有ID 尚未保存 直接返回上一个页面
                yield delay(800); //预防界面变的太快 过于突兀
                yield put(NavigationActions.back());
            }
        },

        setupSubscriber({ dispatch, listen }) {
            listen({
                // MyPhoneList: ({ params }) => {
                //   dispatch({
                //     type: 'loadcontactlist',
                //     payload: {
                //     }
                //   });
                // },
            });
        }
    }
});
