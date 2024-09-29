import moment from 'moment';
import RNFS from 'react-native-fs';

import { createAction, NavigationActions, Storage, StackActions, ShowToast, SentencedToEmpty } from '../utils';
import { Model } from '../dvapack';
import { loadToken } from '../dvapack/storage';
import api from '../config/globalapi';
import * as authService from '../services/auth';

export default Model.extend({
    namespace: 'alarm',
    state: {
        allAlarmData: {},
        exceptUnFeedBackOne: {},
        statisticalData: { polluntList: [] },
        pieData: [],
        legendName: [],
        haveFeedbackData: {},
        feedbackBeginTime: null,
        feedbackAEndTime: null,
        onePointAllAlarmData: {},

        exceptUnFeedBackThree: [],
        multiSelectUnFeedback: [],
        showDetailIndex: -1,
        selectDGIMN: '',
        CheckEarlyWarningInfoData: { feedback: {}, imgList: [] },
        WarningPollutiontype: [],
        CheckEarlyWarningInfoDataStatus: {},
        AssociatedAlarmData: {}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *test({ payload }, { put, call, select, update }) {
            console.log('effects test');
        },
        //获取已反馈的数据
        *GetDoneFeedData(
            {
                payload: { params }
            },
            { put, call, select, update }
        ) {
            yield update({ haveFeedbackData: { status: -1 } });
            let body = { ...params };
            if (typeof params.beginTime == 'undefined' || typeof params.endTime == 'undefined') {
                const { feedbackBeginTime, feedbackAEndTime } = yield select(state => state.alarm);
                if (typeof feedbackBeginTime == 'undefined' || typeof feedbackAEndTime == 'undefined' || !feedbackBeginTime || !feedbackAEndTime) {
                    body.beginTime = starttime = moment()
                        .add(-3, 'days')
                        .format('YYYY-MM-DD 00:00:00');
                    body.endTime = moment().format('YYYY-MM-DD 23:59:59');
                } else {
                    body.beginTime = feedbackBeginTime;
                    body.endTime = feedbackAEndTime;
                }
            }
            const result = yield call(authService.axiosPost, api.gridmap.FeedbackList, body);
            if (result.status == 200) {
                if (typeof params.beginTime == 'undefined' || typeof params.endTime == 'undefined') {
                    yield update({ haveFeedbackData: result });
                } else {
                    yield update({ haveFeedbackData: result, feedbackBeginTime: params.beginTime, feedbackAEndTime: params.endTime });
                }
            } else {
            }
        },
        //获取今日报警记录
        *getAllAlarmData({ payload }, { update, put, call, select }) {
            yield update({ allAlarmData: { status: -1 } });
            //生产查询时间生成逻辑
            let endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            let starttime = moment().format('YYYY-MM-DD 00:00:00');
            //测试 查询时间生成逻辑
            // let endtime = moment('2019-07-09').format('YYYY-MM-DD 23:59:59');
            // let starttime = moment('2019-07-08').format('YYYY-MM-DD 00:00:00');
            const result = yield call(authService.axiosPost, api.gridmap.GetExceptUnFeedBackThree, { beginTime: starttime, endTime: endtime });

            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    if (SentencedToEmpty(data, ['data'], [].length > 0)) {
                        yield update({
                            allAlarmData: result
                        });
                    } else {
                        yield update({
                            allAlarmData: { status: 0 }
                        });
                    }
                } else {
                    yield update({
                        allAlarmData: { status: 1000 }
                    });
                }
            } else {
                yield update({
                    allAlarmData: result
                });
            }
        },
        //获取单站点今日报警记录
        *getOnePointAllAlarmData({ payload }, { update, put, call, select }) {
            yield update({ onePointAllAlarmData: { status: -1 } });
            let endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            let starttime = moment().format('YYYY-MM-DD 00:00:00');
            const result = yield call(authService.axiosPost, api.gridmap.GetExceptUnFeedBackThree, { beginTime: starttime, endTime: endtime, DGIMN: payload.DGIMN });
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    if (SentencedToEmpty(data, ['data'], [].length > 0)) {
                        yield update({
                            onePointAllAlarmData: result
                        });
                    } else {
                        yield update({
                            onePointAllAlarmData: { status: 0 }
                        });
                    }
                } else {
                    yield update({
                        onePointAllAlarmData: { status: 1000 }
                    });
                }
            } else {
                yield update({
                    onePointAllAlarmData: result
                });
            }
        },
        //站点报警数量统计
        *getExceptUnFeedBackOne({ payload }, { update, put, call, select }) {
            yield update({ exceptUnFeedBackOne: { status: -1 } });
            let endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            let starttime = moment().format('YYYY-MM-DD 00:00:00');
            const result = yield call(authService.axiosPost, api.gridmap.GetExceptUnFeedBackOne, { beginTime: starttime, endTime: endtime });
            const statisticaResult = yield call(authService.axiosPost, api.gridmap.statistica, {});

            if (result.status == 200 && statisticaResult.status == 200) {
                let pieData = [],
                    legendName = [];
                SentencedToEmpty(statisticaResult, ['data', 'data', 'feedbackList'], []).map(ic => {
                    pieData.push({ value: ic.AlarmCount, name: ic.Name });
                    legendName.push(ic.Name);
                });
                yield update({ exceptUnFeedBackOne: result, statisticalData: SentencedToEmpty(statisticaResult, ['data', 'data'], {}), pieData, legendName });
            } else {
                yield update({ exceptUnFeedBackOne: { status: 1000 } });
            }
        },
        //获取报警统计数据
        *GetstatisticalData({ payload }, { updatehide, put, call, select }) {
            //在getExceptUnFeedBackOne中一并执行，暂时弃用次事件
            // const result = yield call(authService.axiosPost, api.gridmap.statistica, {});
            // console.log('GetstatisticalData result = ', result);
            // const result = yield call(alrmFirstchangeService.GetstatisticalData, {});
            // let a = [];
            // result.data.feedbackList.map(ic => {
            //     a.push({ value: ic.AlarmCount, label: ic.Name });
            // });
            // yield updatehide({
            //     statisticalData: result.data,
            //     pieData: a
            // });
        },
        //获取刷新今日未反馈报警
        *getExceptUnFeedBackThree({ payload }, { update, put, call, select }) {
            yield update({
                exceptUnFeedBackThree: { status: -1 }
            });
            //生产查询时间逻辑
            let endtime = moment().format('YYYY-MM-DD HH:mm:ss');
            let starttime = moment().format('YYYY-MM-DD 00:00:00');
            //测试逻辑
            // let endtime = moment('2019-07-08').format('YYYY-MM-DD 23:59:59');
            // let starttime = moment('2019-07-07').format('YYYY-MM-DD 00:00:00');
            const result = yield call(authService.axiosPost, api.gridmap.GetExceptUnFeedBackThree, { beginTime: starttime, endTime: endtime, state: 0 });
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    if (SentencedToEmpty(data, ['data'], [].length > 0)) {
                        yield update({
                            exceptUnFeedBackThree: result,
                            multiSelectUnFeedback: [],
                            selectDGIMN: '',
                            showDetailIndex: -1
                        });
                    } else {
                        yield update({
                            exceptUnFeedBackThree: { status: 0 },
                            multiSelectUnFeedback: [],
                            selectDGIMN: '',
                            showDetailIndex: -1
                        });
                    }
                } else {
                    yield update({
                        exceptUnFeedBackThree: { status: 1000 },
                        multiSelectUnFeedback: [],
                        selectDGIMN: '',
                        showDetailIndex: -1
                    });
                }
            } else {
                yield update({
                    exceptUnFeedBackThree: result,
                    multiSelectUnFeedback: [],
                    selectDGIMN: '',
                    showDetailIndex: -1
                });
            }
            // if (data.requstresult == 1) {
            //     yield update({
            //         exceptUnFeedBackThree: data.data,
            //         multiSelectUnFeedback: [],
            //         selectDGIMN: ''
            //     });
            // } else {
            //     yield update({
            //         exceptUnFeedBackThree: [],
            //         multiSelectUnFeedback: [],
            //         selectDGIMN: ''
            //     });
            // }
        },
        //多选需要反馈的报警
        *clickExceptUnFeedBackThreeItem(
            {
                payload: { index }
            },
            { update, put, call, select }
        ) {
            let { multiSelectUnFeedback, exceptUnFeedBackThree, selectDGIMN } = yield select(state => state.alarm);
            let dataArray = SentencedToEmpty(exceptUnFeedBackThree, ['data', 'data'], []);
            if (selectDGIMN == '' || selectDGIMN == dataArray[index].DGIMN) {
                let multiSelectUnFeedbackIndex = multiSelectUnFeedback.indexOf(index);
                if (multiSelectUnFeedbackIndex == -1) {
                    multiSelectUnFeedback.push(index);
                    selectDGIMN = dataArray[index].DGIMN;
                } else {
                    multiSelectUnFeedback.splice(multiSelectUnFeedbackIndex, 1);
                    if (multiSelectUnFeedback.length == 0) {
                        selectDGIMN = '';
                    }
                }

                if (typeof dataArray[index].multiSelected != 'undefined' && dataArray[index].multiSelected) {
                    dataArray[index].multiSelected = false;
                } else {
                    dataArray[index].multiSelected = true;
                }
                exceptUnFeedBackThree.data.data = dataArray;
                exceptUnFeedBackThree = { ...exceptUnFeedBackThree };
                yield update({
                    exceptUnFeedBackThree,
                    multiSelectUnFeedback,
                    selectDGIMN
                });
            } else {
                ShowToast('批量反馈只能用于同一站点');
            }
        },
        //显示一条未反馈的详情
        *setShowDetails(
            {
                payload: { index }
            },
            { update, put, call, select }
        ) {
            let { showDetailIndex, exceptUnFeedBackThree } = yield select(state => state.alarm);
            let dataArray = SentencedToEmpty(exceptUnFeedBackThree, ['data', 'data'], []);
            if (showDetailIndex == index) {
                showDetailIndex = -1;
                if (typeof dataArray[index].isShowDetail != 'undefined' && dataArray[index].isShowDetail) {
                    dataArray[index].isShowDetail = false;
                }
            } else {
                if (showDetailIndex != -1) {
                    dataArray[showDetailIndex].isShowDetail = false;
                }
                if (typeof dataArray[index].isShowDetail != 'undefined' && dataArray[index].isShowDetail) {
                    dataArray[index].isShowDetail = false;
                } else {
                    dataArray[index].isShowDetail = true;
                }
                showDetailIndex = index;
            }
            exceptUnFeedBackThree.data.data = dataArray;
            exceptUnFeedBackThree = { ...exceptUnFeedBackThree };
            // let newArray = exceptUnFeedBackThree.slice();
            yield update({
                exceptUnFeedBackThree,
                showDetailIndex
            });
        },
        //获取选中未反馈报警的id字符串
        *getAllSelectIds({ payload }, { update, put, call, select }) {
            let { exceptUnFeedBackThree } = yield select(state => state.alarm);
            let idsStr = '',
                Latitude = 0,
                Longitude = 0,
                DGIMN = '',
                pointName = '';
            let dataArray = SentencedToEmpty(exceptUnFeedBackThree, ['data', 'data'], []);
            dataArray.map((item, key) => {
                if (typeof item.multiSelected != 'undefined' && item.multiSelected) {
                    if (idsStr == '') {
                        idsStr = `${item.id}`;
                        Latitude = item.Latitude;
                        Longitude = item.Longitude;
                        DGIMN = item.DGIMN;
                        pointName = item.pointName;
                    } else {
                        idsStr = idsStr + ',' + item.id;
                    }
                }
            });
            if (typeof payload.callback != 'undefined') {
                if (idsStr == '') {
                    ShowToast('您还没有选择需要反馈的记录');
                } else {
                    payload.callback({
                        idsStr,
                        Latitude,
                        Longitude,
                        DGIMN,
                        pointName
                    });
                }
            }
        },
        *GetCheckEarlyWarningInfo(
            {
                payload: { ID }
            },
            { put, call, update }
        ) {
            yield update({
                CheckEarlyWarningInfoDataStatus: { status: -1 }
            });
            const result = yield call(authService.axiosPost, api.gridmap.GetCheckEarlyWarningInfo, { feedbackID: ID }, `&feedbackID=${ID}`);

            if (result.status == 200) {
                yield update({ CheckEarlyWarningInfoData: result.data.data });
            }
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    if (SentencedToEmpty(data, ['data'], [].length > 0)) {
                        yield update({ CheckEarlyWarningInfoDataStatus: result, CheckEarlyWarningInfoData: result.data.data });
                    } else {
                        yield update({
                            CheckEarlyWarningInfoDataStatus: { status: 0 },
                            CheckEarlyWarningInfoData: { feedback: {}, imgList: [] }
                        });
                    }
                } else {
                    yield update({
                        CheckEarlyWarningInfoDataStatus: { status: 1000 },
                        CheckEarlyWarningInfoData: { feedback: {}, imgList: [] }
                    });
                }
            } else {
                yield update({
                    CheckEarlyWarningInfoDataStatus: result,
                    CheckEarlyWarningInfoData: { feedback: {}, imgList: [] }
                });
            }
        },
        //查询可反馈的污染类型
        *GetWarningPollutiontype({ payload }, { update, put, call, select }) {
            const result = yield call(authService.axiosPost, api.gridmap.GetAlarmPollutiontype, {});
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    yield update({ WarningPollutiontype: data.data });
                } else {
                    yield update({ WarningPollutiontype: [] });
                }
            } else {
                yield update({ WarningPollutiontype: [] });
            }
        },
        //关联反馈单子
        *AssociatedAlarmDone(
            {
                payload: { params }
            },
            { updatehide, put, call, select }
        ) {
            const result = yield call(authService.axiosPost, api.gridmap.Associated, params);
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    yield put('getExceptUnFeedBackThree');
                    ShowToast('操作成功');
                } else {
                    ShowToast('操作失败');
                }
            } else {
                ShowToast('操作失败');
            }
        },
        //获取反馈单子关联的预警数据
        *GetAssociatedAlarmData(
            {
                payload: { params }
            },
            { update, put, call, select }
        ) {
            yield update({
                AssociatedAlarmData: { status: -1 }
            });
            const result = yield call(authService.axiosPost, api.gridmap.GetExceptUnFeedBackThree, {
                FeedBackID: params.FeedBackID
            });
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    if (SentencedToEmpty(data, ['data'], [].length > 0)) {
                        yield update({ AssociatedAlarmData: result });
                    } else {
                        yield update({
                            AssociatedAlarmData: { status: 0 }
                        });
                    }
                } else {
                    yield update({
                        AssociatedAlarmData: { status: 1000 }
                    });
                }
            } else {
                yield update({
                    CheckEarlyWarningInfoDataStatus: result,
                    CheckEarlyWarningInfoData: { feedback: {}, imgList: [] }
                });
            }
        },
        //反馈上传图片
        *uploadimage(
            {
                payload: { image, callback, uuid }
            },
            { call }
        ) {
            if (!image.fileName) {
                image.fileName = image.uri.split('/')[image.uri.split('/').length - 1];
            }
            const base64 = yield RNFS.readFile(image.uri, 'base64');
            let attachID = new Date().getTime();
            const body = {
                fileType: `.${image.fileName.split('.')[1].toLowerCase()}`,
                img: base64,
                attachID: attachID,
                IsUploadSuccess: true,
                IsPc: false,
                fileName: 'uploadimage',
                uuid: uuid
            };
            const result = yield call(authService.axiosPost, api.gridmap.uploadimage, body);
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    image.uploadID = data.data;
                    image.attachID = attachID;
                    callback(image, true);
                } else {
                    callback('', false);
                }
            } else {
                callback('', false);
            }
            // const { data } = yield call(alarmService.uploadimage, {
            //     uuid: uuid,
            //     Img: image,
            //     FileType: `.${image.fileName.split('.')[1].toLowerCase()}`
            // });
            // image.uploadID = data;

            // callback(image);
        },
        //删除反馈图片
        *DelPhotoRelation(
            {
                payload: { params }
            },
            { update, take, call, put }
        ) {
            const result = yield call(authService.axiosPost, api.gridAccount.delPhoto, null, '&photoID=' + params.code);

            if (result.data && result.data != null && result.data.requstresult === '1') {
                ShowToast('删除成功');
                params.callback();
            } else {
                ShowToast('删除失败');
            }
        },
        /**
         * 提交反馈
         * @param {any} { payload: { postjson, successCallback ,failCallback ,checkboxIndexmap } }
         * @param {any} { callWithSpinning, update, put, call, select }
         */
        *SummitAll(
            {
                payload: { postjson, successCallback, failCallback, checkboxIndexmap }
            },
            { call, updatehide, put, select }
        ) {
            const user = yield loadToken();
            const body = {
                DGIMN: postjson.DGIMN,
                ExceptionProcessingID: postjson.ExceptionProcessingID,
                WarningReason: postjson.WarningReason,
                SceneDescription: postjson.sceneDescription,
                ImageID: postjson.ImageID,
                personalFeedback: user.User_Account,
                feedbackTime: postjson.feedbackTime,
                RecoveryTime: postjson.RecoveryTime,
                Longitude: postjson.longitude,
                Latitude: postjson.latitude,
                isRecord: 1
            };
            const result = yield call(authService.axiosPost, api.gridmap.AddEarlyWarningFeedback, body);
            // const result = yield call(alarmService.AddEarlyWarningFeedback, postjson, { imagelist: [] });
            // if (result && result.requstresult === '1') {
            //     successCallback();
            // } else {
            //     failCallback();
            // }
            if (result.status == 200) {
                let data = SentencedToEmpty(result, ['data'], {});
                if (data.requstresult == 1) {
                    successCallback();
                } else {
                    failCallback();
                }
            } else {
                failCallback();
            }
        }
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                OnePointAllAlarm: ({ params }) => {
                    dispatch({
                        type: 'getOnePointAllAlarmData',
                        payload: {
                            DGIMN: params.DGIMN
                        }
                    });
                }
            });
        }
    }
});
