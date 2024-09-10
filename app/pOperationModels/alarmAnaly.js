import { Model } from '../dvapack';

import api from '../config/globalapi';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import * as authService from '../services/auth';
import moment from 'moment';
import { SentencedToEmpty, ShowToast } from '../utils';
import { getEncryptData, loadToken } from '../dvapack/storage';
import { UrlInfo } from '../config';
export default Model.extend({
    namespace: 'alarmAnaly',
    state: {
        //菜单管理
        alramButtonList: [], //异常识别不同账号操作按钮数据
        proFlag: 0, //（0：不是省区经理，1：省区经理）
        anaCount: '-', //异常识别工作台显示数量
        //报警记录相关
        alarmAnalyBeginTime: moment()
            .subtract(1, 'month')
            .format('YYYY-MM-DD 00:00:00'),
        alarmAnalyEndTime: moment().format('YYYY-MM-DD 23:59:59'),
        alarmAnalyDataType: 'HourData',
        alarmAnalyIndex: 1,
        alarmAnalyTotal: 0,
        alarmAnalyListTargetDGIMN: 'yastqsn0000002',
        overLimitsDGIMN: '',
        alarmAnalyListData: [],
        alarmAnalyListResult: { status: -1 },
        ExceptionNumsByPointAuth: { status: -1 },
        /**可选模型类型 */
        MoldList: [],
        /**报警详情 */
        alarmDetailInfo: { status: -1 },
        alarmChartData: {},
        showDataSort: [],
        fluctuationRange: { status: -1 },
        StatisPolValue: { status: -1 },
        StatisLinearCoefficientValue: { status: -1 },
        AlarmDataChartValue: { status: -1 },
        AlarmChartPollutant: {},
        /**报警核实 */
        commitVerifyResult: { status: 200 },
        alarmVerifyDetail: { status: 200 },
        editCommitEnable: true,

        /**核实流程 */
        WarningVerifyCheckInfo: { status: -1 }
    },

    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 异常识别tab 计数
         */
        *getOperationKeyParameterCount({ payload }, { call, put, take, update, select }) {
            const { workerBenchMenu } = yield select(state => state.login);
            let alramBtnArr = [];
            workerBenchMenu.map(item => {
                if (item.id === '90eea7ec-90b1-4b7b-82c0-ef961ae90329') {
                    item.children.map(sItem => {
                        if (sItem.id === '153aecef-0ca7-470e-8503-b6df1ef592bf') {
                            alramBtnArr = sItem.buttonList;
                        }
                    });
                }
            });
            // proFlag（0：不是省区经理，1：省区经理）
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetWorkNumsAndFlag, payload);
            yield update({ anaCount: SentencedToEmpty(result, ['data', 'Datas', 'total'], 0), alramButtonList: alramBtnArr, proFlag: SentencedToEmpty(result, ['data', 'Datas', 'proFlag'], 0) });
        },
        //核实详情页，获取核实流程
        *GetWarningVerifyCheckInfo({ payload }, { update, take, call, put }) {
            yield update({ WarningVerifyCheckInfo: { status: -1 } });
            const { callback = () => { } } = payload;
            let params = { ...payload };
            delete params.callback;
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetWarningVerifyCheckInfo, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ WarningVerifyCheckInfo: result });
                callback(result);
            } else {
                yield update({ WarningVerifyCheckInfo: { status: 1000 } });
            }
        },
        /**
         * 获取运维人报警分组列表
         * @param {*} param0
         * @param {*} param1
         */
        *GetModelExceptionNumsByPointAuth({ payload }, { call, put, take, update, select }) {
            let result;
            const { proFlag, alarmAnalyBeginTime, alarmAnalyEndTime } = yield select(state => state.alarmAnaly);
            payload.beginTime = alarmAnalyBeginTime;
            payload.endTime = alarmAnalyEndTime;
            if (proFlag == 1) {
                //省区经理
                result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetModelExceptionNums, payload);
            } else {
                result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetModelExceptionNumsByPointAuth, payload);
            }

            yield update({
                ExceptionNumsByPointAuth: result
            });
        },
        /**
         * 获取报警核实详情
         */
        *GetWarningVerifyInfor({ payload }, { call, put, update, take, select }) {
            yield update({ alarmVerifyDetail: { status: -1 } });
            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetWarningVerifyInfor, payload);
            if (SentencedToEmpty(result, ['data', 'Datas', 'CheckedResult'], '') != '') {
                payload.callback(SentencedToEmpty(result, ['data', 'Datas'], {}));
            }
            yield update({ alarmVerifyDetail: result });
        },
        /**
         * 报警核实
         */
        *commitVerify({ payload: { params, callback } }, { call, put, update, take, select }) {
            yield update({ commitVerifyResult: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.InsertWarningVerify, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                callback();
            } else {
                ShowToast('提交失败');
            }
            yield update({ commitVerifyResult: result });
        },
        //反馈上传图片
        *uploadimage({ payload: { image, images = [], callback, uuid } }, { call }) {
            const user = yield loadToken();
            let formdata = new FormData();
            console.log('images = ', images);
            console.log('uuid = ', uuid);
            console.log('callback = ', callback);
            // 单张
            var file = { uri: image.uri, type: 'multipart/form-data', name: 'image.jpg' };
            formdata.append('file', file);
            formdata.append('FileActualType', '2');
            formdata.append('FileUuid', uuid);
            formdata.append('type', '2');
            formdata.append('FileTypes', '2');
            // console.log('uuid = ',uuid);
            fetch(UrlInfo.DataAnalyze + api.DataAnalyze.UploadFiles, {
                method: 'POST',
                bodyType: 'file', //后端接收的类型
                body: formdata,
                headers: {
                    authorization: 'Bearer ' + user.dataAnalyzeTicket
                }
            })
                .then(res => {
                    let url = JSON.parse(res._bodyInit).Datas;

                    for (let index = 0; index < images.length; index++) {
                        let attachIDArr = url.split('/');
                        images[index].attachID = attachIDArr[attachIDArr.length - 1];
                        images[index].url = url;
                    }
                    console.log('上传成功');
                    callback(images, true);
                })
                .catch(error => {
                    console.log('上传失败：', error);
                    callback('', false);
                });
        },
        //删除反馈图片
        *DelPhotoRelation({ payload: { params } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.pollutionApi.Alarm.delPhoto, {
                Guid: params.code,
                noCancelFlag: true
            });
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                params.callback();
            } else {
                ShowToast('删除失败');
            }
        },
        //波动范围获取污染因子
        *GetRangePollutantListByDgimn({ payload }, { update, take, call, put }) {
            yield update({ AlarmDataChartValue: { status: -1 }, AlarmChartPollutant: [] });
            const result = yield call(authService.axiosAuthPost, api.DataAnalyze.GetPollutantListByDgimn, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ AlarmChartPollutant: result });
            } else {
                yield update({ AlarmDataChartValue: { status: 1000 }, AlarmChartPollutant: {} });
            }
        },
        //获取污染因子
        *GetPollutantListByDgimn({ payload }, { update, take, call, put }) {
            yield update({ AlarmDataChartValue: { status: -1 }, AlarmChartPollutant: [] });
            const result = yield call(authService.axiosAuthPost, api.DataAnalyze.GetPollutantListByDgimn, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                let pollutanCodeList = [];
                let pollttantSelect = [];
                SentencedToEmpty(result, ['data', 'Datas'], []).map((item, idx) => {
                    pollutanCodeList.push(item.PollutantCode);
                    if (pollttantSelect.length < 6) {
                        if (
                            ['02', '03', 's01', 's03', 's05'].findIndex(subI => {
                                if (subI == item.PollutantCode) return true;
                            }) >= 0
                        ) {
                            pollttantSelect.push(item);
                        }
                    }
                });
                result.pollutanCodeList = pollutanCodeList;
                result.pollttantSelect = pollttantSelect;
                yield update({ AlarmChartPollutant: result });
                yield put('AlarmDataChartValue', {
                    callback: payload.callback,
                    DGIMNs: payload.DGIMNs,
                    beginTime: payload.selectTime[0],
                    endTime: payload.selectTime[1],
                    pollutantCodes: pollutanCodeList.toString(),
                    isAsc: true,
                    IsSupplyData: false
                });
            } else {
                yield update({ AlarmDataChartValue: { status: 1000 }, AlarmChartPollutant: {} });
            }
        },
        //数据图表
        *AlarmDataChartValue({ payload }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetAllTypeDataListForModel, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ AlarmDataChartValue: result });
                payload.callback(result);
            } else {
                yield update({ AlarmDataChartValue: result });
            }
        },
        //相关系数表
        *StatisLinearCoefficient({ payload }, { update, take, call, put }) {
            yield update({ StatisLinearCoefficientValue: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.StatisLinearCoefficient, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ StatisLinearCoefficientValue: result });
            } else {
                yield update({ StatisLinearCoefficientValue: result });
            }
        },
        //密度直方图
        *StatisPolValueNumsByDGIMN({ payload }, { update, take, call, put }) {
            yield update({ StatisPolValue: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.StatisPolValueNumsByDGIMN, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                yield update({ StatisPolValue: result });
            } else {
                yield update({ StatisPolValue: result });
            }
        },
        //波动范围查询
        *GetPointParamsRange({ payload }, { update, take, call, put }) {
            yield update({ fluctuationRange: { status: -1 } });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.ClueDetails.GetPointParamsRange, payload);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                result.imageKeys = Object.keys(SentencedToEmpty(result.data.Datas, ['image'], []));
                yield update({ fluctuationRange: result });
            } else {
                yield update({ fluctuationRange: result });
            }
        },
        //查询暂停标识
        *IsHaveStopTime({ payload: { params } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.IsHaveStopTime, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                params.callback(result.data.Datas);
            } else {
                params.callback(false);
            }
        },
        //设置报警暂停时间
        *SetStopTime({ payload: { params } }, { update, take, call, put }) {
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.SetStopTime, params);
            if (result.data && result.data != null && result.data.IsSuccess == true) {
                ShowToast(result.data.Message);
                params.callback();
            } else {
                ShowToast('设置失败');
            }
        },
        /**获取报警详情 */
        *getSingleWarning({ payload }, { call, put, take, update }) {
            yield update({ alarmDetailInfo: { status: -1 } });
            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetSingleWarning, payload);
            yield put('getSnapshotData', {
                ID: payload.modelWarningGuid
            });
            yield take('getSnapshotData/@@end');

            yield update({ alarmDetailInfo: result });
        },
        /**获取报警图表数据 */
        *getSnapshotData({ payload }, { call, put, take, update }) {
            yield update({ alarmChartData: {} });
            //post请求
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetSnapshotData + '?ID=' + payload.ID, null);
            let showArr = [];
            SentencedToEmpty(result, ['data', 'Datas', 'chartData'], []).map(() => {
                showArr.push(0);
            });
            yield update({ alarmChartData: result, showDataSort: showArr });
        },
        /**
         
         * 
         * 获取可选模型类型
         * @param {*} param0
         * @param {*} param1
         */
        *getMoldListType({ payload: { params, callback = () => { } } }, { call, put, take, update, select }) {
            yield update({ MoldList: [] });
            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.GetMoldList, {});
            if (result.status == 200) {
                let MoldList = [];
                let MoldListSec = SentencedToEmpty(result, ['data', 'Datas'], []);
                MoldListSec.map(item => {
                    MoldList = MoldList.concat(item.ModelList);
                });
                yield update({ MoldList: MoldList });
                callback(MoldList);
            } else {
                ShowToast('获取预警筛选类型出错');
                yield update({ MoldList: [], alarmAnalyListResult: { status: 1000 } });
            }
        },
        /**
         * 获取报警记录
         * @param {*} param0
         * @param {*} param1
         */
        *getalarmAnalyList({ payload: { setListData = (data, duration) => { }, warningTypeCode, params } }, { call, put, take, update, select }) {
            let { alarmAnalyIndex, alarmAnalyBeginTime, alarmAnalyEndTime, alarmAnalyDataType, alarmAnalyListData } = yield select(state => state.alarmAnaly);
            if (alarmAnalyIndex == 1) {
                yield update({
                    alarmAnalyListResult: { status: -1 }
                });
            }
            let requestBegin = new Date().getTime();

            const result = yield call(dataAnalyzeAuth.axiosAuthPost, api.DataAnalyze.WarningList, {
                beginTime: alarmAnalyBeginTime,
                endTime: alarmAnalyEndTime,
                pageSize: '20',
                pageIndex: alarmAnalyIndex,
                ...params
            });
            let status = SentencedToEmpty(result, ['status'], -1);
            let newalarmAnalyListData = alarmAnalyListData;
            if (status == 200) {
                if (alarmAnalyIndex == 1) {
                    newalarmAnalyListData = SentencedToEmpty(result, ['data', 'Datas'], []);
                } else {
                    newalarmAnalyListData = alarmAnalyListData.concat(SentencedToEmpty(result, ['data', 'Datas'], []));
                }
                yield update({
                    alarmAnalyListData: newalarmAnalyListData,
                    alarmAnalyListResult: result,
                    alarmAnalyTotal: SentencedToEmpty(result, ['data', 'Total'], [])
                });
            } else {
                yield update({
                    alarmAnalyListResult: result
                });
            }
            let requestEnd = new Date().getTime();
            setListData(newalarmAnalyListData, requestEnd - requestBegin);
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            dispatch({ type: 'loadStorage' });
        }
    }
});
