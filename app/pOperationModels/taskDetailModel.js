import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import { Model } from '../dvapack';
import { loadToken, saveRouterConfig, getToken, getRootUrl } from '../dvapack/storage';
import api from '../config/globalapi';
import { createImageUrl, delay } from '../utils';
import { createFormUrl } from '../utils/taskUtils';
import { UrlInfo } from '../config/globalconst';

export default Model.extend({
    namespace: 'taskDetailModel',
    state: {
        tabIndex: 0, //当前tab索引
        helperOperator: {}, //协助人信息
        delHelperOperator: {}, //删除协助人
        taskID: '',
        status: -1, //最外层的status
        errorMsg: '服务器加载错误',// 任务详情错误信息
        isSigned: false, //是否已经打卡
        isMyTask: false, //是否是本人的任务
        taskStatus: '', //任务状态  1待执行，2进行中，3已完成
        taskDetail: {}, //任务详情
        taskSingResult: { status: 200 }, //打卡状态
        clockInLongitude: 0
        , clockInLatitude: 0
        , clockInStatus: 0// 0 未打卡, 1 正常, 2 异常, 3 打卡异常
        , updateStatus: 200 // 任务完成后，更新处理说明状态
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取任务记录
         * @param {*} param0
         * @param {*} param1
         */
        *getTaskDetail(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { UserId } = getToken();
            const { taskID } = yield select(state => state.taskDetailModel);
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.GetTaskDetails, { userID: UserId, taskID: taskID });

            if (result.status == 200) {
                if (result.data && result.data.Datas && result.data.Datas[0]) {
                    const taskDetail = result.data.Datas[0];
                    taskDetail.CreateUser = taskDetail.CreateUserName; //为转发页面提供数据
                    taskDetail.CreateTime = taskDetail.CreateTime;
                    // taskDetail.TaskContentType =taskDetail.
                    const isMyTask = (UserId == taskDetail.ExecuteUserId);
                    const taskStatus = `${taskDetail.TaskStatus}`;
                    /**
                     * 判断已经打卡，true不需要打卡，如果任务为已经打卡，则不需要打卡
                     * 如果任务不是当前用户的，则不需要打卡
                     *  */
                    // const isSigned = (taskStatus == '2' || taskStatus == '3' || taskStatus == '10')||!isMyTask;
                    const isSigned = (taskStatus == '2' || taskStatus == '3' || taskStatus == '10');
                    console.log('任务详情-->');
                    console.log(taskDetail);
                    console.log('是否登录人是执行者-->' + isMyTask);
                    console.log('任务状态 1待执行，2进行中，3已完成-->' + taskStatus);
                    console.log('是否打卡-->' + isSigned);
                    let rootUrl = getRootUrl();
                    console.log('rootUrl = ', rootUrl);
                    console.log('taskDetail.TaskFormList ', taskDetail.TaskFormList);
                    // 测试数据
                    taskDetail.TaskFormList.push({
                        Abbreviation: "CEMS校准",
                        CnName: "示值误差和响应时间",
                        // FormMainID: "8f4c763c-104e-4255-8a5a-9b9cb41af8ee",
                        FormMainID: "",
                        ID: 1001,
                        IsRequired: 0,
                        IsSign: false,
                        RecordType: "1",
                        Status: 1,
                        TaskID: "37e7a6d7-b9c9-4764-a5b9-11d81dd76be9",
                        TaskStatus: 2,
                        Type: "1",
                        TypeID: 8,
                        TypeName: "shiZhiWuCha",
                        formUrl: "http://61.50.135.114:61002/appoperation/appjzrecord/37e7a6d7-b9c9-4764-a5b9-11d81dd76be9/8"
                    })
                    if (rootUrl.ReactUrl) {
                        createFormUrl(taskDetail.TaskFormList, rootUrl.ReactUrl, taskDetail.TaskID, taskDetail.TaskStatus);
                    }
                    /**
                     *  clockInLongitude
                        clockInLatitude
                        data    clockInStatus		1 正常，2 异常

                        clockInStatus:0,// 0 未打卡, 1 正常, 2 异常, 3 打卡异常
                     */
                    if (isSigned) {
                        yield update({
                            taskDetail, isMyTask, isSigned, taskStatus, status: 200, clockInStatus: SentencedToEmpty(taskDetail, ['clockInStatus'], 1)
                            , clockInLongitude: parseFloat(SentencedToEmpty(taskDetail, ['clockInLongitude'], 0))
                            , clockInLatitude: parseFloat(SentencedToEmpty(taskDetail, ['clockInLatitude'], 0))
                        });
                    } else {
                        yield update({ taskDetail, isMyTask, isSigned, taskStatus, status: 200, clockInStatus: 0 });
                    }
                    if (params && params.callback) {
                        params.callback(isSigned, isMyTask, taskStatus, taskDetail);
                    }

                    yield put(
                        createAction('taskModel/updateState')({
                            currentTask: taskDetail,
                            currnetTimeCardEnterprise: { Latitude: taskDetail.Latitude, Longitude: taskDetail.Longitude, Radius: taskDetail.OperationRadius, EntName: taskDetail.EnterpriseName, PointName: taskDetail.PointName }
                        })
                    );
                } else {
                    yield update({ taskDetail: {}, status: 0 });
                    yield put(createAction('taskModel/updateState')({ currentTask: null }));
                }
                return;
            }
            yield update({ taskDetail: {}, status: result.status, errorMsg: SentencedToEmpty(result, ['data', 'Message'], '服务器加载错误') });
        },

        //打卡
        *taskSignIn(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update }
        ) {
            //任务打卡
            yield update({ taskSingResult: { status: -1 } }); //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.TaskSignIn, params);
            callback();
            if (result.status == 200 && result.data.IsSuccess == true) {
                yield update({ isSigned: true, taskStatus: 2 });
                ShowToast('打卡成功');
                yield put('getTaskDetail', { params: {} });
            } else {
                ShowToast('提交失败');
            }
            yield update({ taskSingResult: result });
        },

        /**
         * 结束任务
         */
        *endTask(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { UserId } = getToken();
            const { taskID } = yield select(state => state.taskDetailModel);
            const realParams = {
                taskID: taskID,
                description: SentencedToEmpty(params, ['description'], ''), //params.description,
                IsComplete: true,
                fileUuid: taskID,
                longitude: 116.298168, //记得改
                latitude: 39.96501, //记得改
                CheckUserID: UserId
            };
            yield update({ status: -1 });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.PostTask, realParams);
            if (result.status == 200) {
                yield update({ tabIndex: 1 });
                yield put({ type: 'getTaskDetail', payload: { params: {} } });
                yield take('getTaskDetail/@@end');
                ShowToast('任务结束');
                return;
            }
            yield update({ status: 200 });
        },

        /**
         * 暂存任务
         */
        *saveTask(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { UserId } = getToken();
            const { taskID } = yield select(state => state.taskDetailModel);
            const realParams = {
                taskID: taskID,
                description: SentencedToEmpty(params, ['description'], ''), //params.description,
                IsComplete: false,
                fileUuid: taskID,
                CheckUserID: UserId
            };

            yield update({ status: -1 });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.PostTask, realParams);
            if (result.status == 200) {
                yield put({ type: 'getTaskDetail', payload: { params: {} } });
                yield take('getTaskDetail/@@end');

                ShowToast('任务保存成功');
                return;
            }
            yield update({ status: 200 });
        },
        /**
         * 任务完成后，6小时内，修改处理说明
         */
        *updateTask(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { UserId } = getToken();
            const { taskID } = yield select(state => state.taskDetailModel);
            const realParams = {
                "TaskId": taskID,
                "Description": SentencedToEmpty(params, ['description'], ''),
            };

            yield update({ updateStatus: -1 });
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.UpdateTask, realParams);
            if (result.status == 200) {
                // yield put({ type: 'getTaskDetail', payload: { params: {} } });
                // yield take('getTaskDetail/@@end');
                yield update({ updateStatus: 200 });

                ShowToast('处理说明修改成功');
                return;
            } else {
                ShowToast('处理说明修改失败');
            }
            yield update({ updateStatus: 200 });
        },
        /**
         * 添加协助人
         */
        *addTaskHelpers(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { taskID, helperOperator } = yield select(state => state.taskDetailModel);
            const realParams = {
                TaskID: taskID,
                OperationsUserId: SentencedToEmpty(helperOperator, ['User_ID'], 'unselected') //params.description,
            };

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.AddTaskHelpers, realParams);
            if (result.status == 200) {
                yield put({ type: 'getTaskDetail', payload: { params: {} } });
                yield take('getTaskDetail/@@end');

                ShowToast('添加协助人成功！');
                return;
            } else {
                ShowToast('未能成功添加协助人！');
            }
        },
        /**
         * 删除协助人
         */
        *deleteTaskHelpers(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { taskID, delHelperOperator } = yield select(state => state.taskDetailModel);
            const realParams = {
                TaskID: taskID,
                OperationsUserId: SentencedToEmpty(delHelperOperator, ['OperationsUserId'], 'unselected') //params.description,
            };

            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Task.DeleteTaskHelpers, realParams);
            if (result.status == 200) {
                yield put({ type: 'getTaskDetail', payload: { params: {} } });
                yield take('getTaskDetail/@@end');

                ShowToast('协助人已成功移除！');
                return;
            } else {
                ShowToast('协助人移除失败！');
            }
        },
        /**
         * 更新表单填写状态
         */
        *updateFormStatus(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { cID, isAdd = true } = payload;

            let newTaskFormList = [].concat(taskDetail.TaskFormList);
            let newTaskDetail = { ...taskDetail };
            if (isAdd) {
                newTaskFormList.map((item, index) => {
                    if (item.ID == cID) {
                        // 一般表单不通过FormMainID获取，所以填入临时变量表示已填写
                        item.FormMainID = new Date().getTime();
                    }
                })
            } else {
                newTaskFormList.map((item, index) => {
                    if (item.ID == cID) {
                        // 一般表单不通过FormMainID获取，所以填入临时变量表示已填写
                        item.FormMainID = '';
                    }
                })
            }

            newTaskDetail.TaskFormList = newTaskFormList;

            yield update({ taskDetail: newTaskDetail });
        }
    },

    subscriptions: {}
});
