import { Model } from '../dvapack';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import { axiosPost } from '../services/auth';
import api from '../config/globalapi';
import { loadToken, saveRouterConfig } from '../dvapack/storage';
import * as authService from '../services/auth';
const messageTypeItems = [{ key: 'taskMessage', title: '工单消息', icon: require('../images/ic_msg_workorder.png'), time: '18:05', msg: '派单' }
    , { key: 'auditingMessage', title: '审核结果', icon: require('../images/ic_msg_audit.png'), time: '昨天', msg: '审核通过' }
    , { key: 'changeMessage', title: '更换提醒', icon: require('../images/ic_msg_replace.png'), time: '星期六', msg: '标气更换' }
    , { key: 'expireMessage', title: '运营到期通知', icon: require('../images/ic_msg_operation_due.png'), time: '星期五', msg: 'YY2021-038运营即将到期，请及时补签' }
    , { key: 'inspectorMessage', title: '督查结果', icon: require('../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'InspectorRectificationMessage', title: '系统设施核查消息', icon: require('../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'keyParameterMessage', title: '关键参数核查', icon: require('../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'achievementsMessage', title: '绩效消息', icon: require('../images/ic_msg_performance.png'), time: '05-13', msg: '督查合格' }
]

export default Model.extend({
    namespace: 'notice',
    state: {
        inspectorMessageResult: { status: -1 }, // 督查整改详情
        serviceReminderInfoResult: { status: -1 }, // 服务提醒消息详情结果
        coefficientMsgInfoResult: { status: -1 }, //绩效信息详细
        notAuditTaskMsgInfoResult: { status: -1 },// 未审批工单详细
        operationInfoListResult: { status: -1 }, // 运营到期通知
        pushMessageListResult: { status: -1 },// 消息中心返回结果
        pushMessageListList: [],// 消息中心返回 列表
        PushType: '', // 消息中心详情页 的 消息类型
        MsgType: '', // tab消息类型 与PushType类型相同，工单消息不同
        messageTypeId: '', // 消息中心项 id
        messageInfoListResult: { status: -1 }, // 消息详情 数据
        messageInfoList: [],
        messageInfoListTotal: 0,
        messageInfoListIndex: 1,
        messageInfoListPageSize: 20,
        noticeData: { status: -1 }, //通知消息
        noticeMessageInfoListIndex: 1, //通知记录数据页码
        noticeMessageInfoListTotal: 0, //通知记录数据总数
        noticeMessageInfoListResult: { status: -1 }, //通知记录数据请求结果
        noticeMessageInfoListData: [], //通知记录的数据
        allMessageReadResult: { status: 200 },
        messageCount: 0, // 消息计数器
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 服务提醒消息详情
         * GetServiceReminderInfo ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getServiceReminderInfo(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetServiceReminderInfo, {
                ID: payload.ID
            });
            yield update({ serviceReminderInfoResult: result });
        },
        /**
         * 设施督查整改提醒-详情
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getInspectorMessage(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetInspectorMessage, {
                ID: payload.ID
            });
            yield update({ inspectorMessageResult: result });
        },
        /**
         * 绩效信息详细
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getCoefficientMsgInfo(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetCoefficientMsgInfo, {
                ID: payload.ID
            });
            yield update({ coefficientMsgInfoResult: result });
        },
        /**
         * 未审批工单详细
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNotAuditTaskMsgInfo(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetNotAuditTaskMsgInfo, {
                ID: payload.ID
            });
            yield update({ notAuditTaskMsgInfoResult: result });
        },
        /**
         * 通知运维详情列表 运营到期统计
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getOperationInfoList(
            {
                payload
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetOperationInfoList, {
                ID: payload.ID
            });
            yield update({ operationInfoListResult: result });
        },
        /**
         *  tab消息中心
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNewPushMessageList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const requestBegin = new Date().getTime();
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetPushMessageList, {});
            const Datas = SentencedToEmpty(result, ['data', 'Datas'], []);
            let itemCount = 0, total = 0;
            Datas.map((oneTypeMessage, index) => {
                itemCount = Number(SentencedToEmpty(oneTypeMessage, ['NoReadCount'], 0));
                total = total + itemCount;
            });
            if (total > 99) {
                total = 99;
            }
            yield update({ messageCount: total, pushMessageListResult: result, pushMessageListList: Datas });
            const requestEnd = new Date().getTime();
            setListData(Datas, requestEnd - requestBegin);
        },
        /**
         *  消息中心
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getPushMessageList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetPushMessageList, {});
            yield update({ pushMessageListResult: result });
        },
        /**
         * 消息中心详情
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *getMessageInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            const { PushType, messageTypeId
                , messageInfoListIndex, messageInfoListPageSize
                , messageInfoList } = yield select(state => state.notice);
            let requestBegin = new Date().getTime();
            if (PushType != ''
                && messageTypeId != '') {
                /**
                 * 5    任务打回
                 * 6    任务转发
                 * 7    提醒（任务创建）
                 * 8    系统派单
                 */
                let params = {
                    pushType: (PushType == 5 || PushType == 6
                        || PushType == 7 || PushType == 8
                        ? [5, 6, 7, 8] : [PushType]),
                    // ID:messageTypeId,
                    pageIndex: messageInfoListIndex,
                    pageSize: messageInfoListPageSize,
                }
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.GetMessageInfoList, params);
                // IsRead 1已读 其它未读
                if (messageInfoListIndex == 1) {
                    let newData = SentencedToEmpty(result, ['data', 'Datas'], [])
                    //找到第一条已读
                    let firstRead = true;
                    newData.map((item, index) => {
                        if (item.isView) {
                            if (firstRead) {
                                item.firstRead = true
                                firstRead = false;
                            }
                        }
                    });
                    yield update({
                        messageInfoListResult: result
                        , messageInfoList: newData
                        , messageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], 0)
                    });
                } else {
                    let newData = messageInfoList.concat(SentencedToEmpty(result, ['data', 'Datas'], []))
                    //找到第一条已读
                    let firstRead = true;
                    newData.map((item, index) => {
                        if (item.isView) {
                            if (firstRead) {
                                item.firstRead = true
                                firstRead = false;
                            }
                        }
                    });
                    yield update({
                        messageInfoListResult: result
                        , messageInfoList: newData
                        , messageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], 0)
                    });
                }
                let requestEnd = new Date().getTime();
                setListData(SentencedToEmpty(result, ['data', 'Datas'], []), requestEnd - requestBegin);
            } else {
                ShowToast('数据中心参数错误');
            }
        },
        /**
         * 消息中心 设置已读
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *setMessageRead(
            {
                payload: { params, success = () => { }, failure = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ allMessageReadResult: { status: -1 } });
            let pushType = SentencedToEmpty(params, ['pushType'], '')
            if (pushType != '') {
                let requstParams = {};
                if (pushType != 'all') {
                    requstParams.pushType = pushType
                }
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.SetMessageRead, requstParams);
                let status = SentencedToEmpty(result, ['status'], -1);
                yield update({ allMessageReadResult: result });
                if (status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    success();
                    // yield put({type:'getPushMessageList',payload:{}})
                    yield put({ type: 'getNewPushMessageList', payload: {} })
                } else {
                    failure();
                }
            }
        },
        /**
         * 消息中心 设置已读
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *updateMessageReadByMsgType(
            {
                payload: { params, success = () => { }, failure = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ allMessageReadResult: { status: -1 } });
            let pushType = SentencedToEmpty(params, ['pushType'], '')
            if (pushType != '') {
                let requstParams = {};
                if (pushType != 'all') {
                    requstParams.pushType = pushType
                }
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.UpdateMessageReadByMsgType, requstParams);
                let status = SentencedToEmpty(result, ['status'], -1);
                yield update({ allMessageReadResult: result });
                if (status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    success();
                    // yield put({type:'getPushMessageList',payload:{}})
                    yield put({ type: 'getNewPushMessageList', payload: {} })
                } else {
                    failure();
                }
            }
        },
        /**
         * netcore 可能不需要了，等待验证
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNoticeMessageInfoList(
            {
                payload: { params, setListData = (data, duration) => { } }
            },
            { call, put, take, update, select }
        ) {
            let { noticeMessageInfoListIndex, noticeMessageInfoListTotal, noticeMessageInfoListData } = yield select(state => state.notice);
            let requestBegin = new Date().getTime();

            //post请求
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.WorkBench.GetNoticeMessageInfoList, params);

            let status = SentencedToEmpty(result, ['status'], -1);
            let newMoData = noticeMessageInfoListData;
            if (status == 200) {
                if (noticeMessageInfoListIndex == 1) {
                    newMoData = noticeMessageInfoListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                    yield update({ noticeMessageInfoListData: newMoData, noticeMessageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], []), noticeMessageInfoListResult: result });
                } else {
                    newMoData = noticeMessageInfoListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                    yield update({ noticeMessageInfoListData: newMoData, noticeMessageInfoListTotal: SentencedToEmpty(result, ['data', 'Total'], []), noticeMessageInfoListResult: result });
                }
            } else {
                yield update({
                    noticeMessageInfoListResult: result
                });
            }
            console.log('newMoData = ', newMoData);
            let requestEnd = new Date().getTime();
            setListData(newMoData, requestEnd - requestBegin);
        },
        /**
         * 更新单条消息已读
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *updateMessageRead(
            {
                payload: { params, success = () => { }, failure = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // UpdateMessageRead
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.UpdateMessageRead, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                success();
                const { messageInfoList } = yield select(state => state.notice);
                let newData = [].concat(messageInfoList);
                newData[params.index].IsRead = 1;
                yield update({ 'messageInfoList': newData });
                // yield put({type:'getPushMessageList',payload:{}})
                yield put({ type: 'getNewPushMessageList', payload: {} })
            } else {
                failure();
            }
        },
        /**
         * 置顶/取消置顶
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *stickyMessage(
            {
                payload: { params, success = () => { }, failure = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.StickyMessage, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                success();
                yield put({ type: 'getNewPushMessageList', payload: {} })
            } else {
                failure();
            }
        },
        /**
         * 根据消息类型物理删除一类消息
         * netcore ✅
         * @param {*} param0 
         * @param {*} param1 
         */
        *deleteMessageByPushType(
            {
                payload: { params, success = () => { }, failure = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.Message.DeleteMessageByPushType, params);
            let status = SentencedToEmpty(result, ['status'], -1);
            if (status == 200 && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                success();
                yield put({ type: 'getNewPushMessageList', payload: {} })
            } else {
                failure();
            }
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
