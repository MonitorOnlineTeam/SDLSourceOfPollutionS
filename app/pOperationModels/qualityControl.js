/*
 * @Description: 质控功能的model
 * @LastEditors: hxf
 * @Date: 2020-12-03 10:18:05
 * @LastEditTime: 2024-07-08 10:07:16
 * @FilePath: /SDLMainProject/app/pollutionModels/qualityControl.js
 */
import moment from 'moment';
import { AsyncStorage } from 'react-native';
import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { loadToken, getRootUrl } from '../dvapack/storage';
import { SentencedToEmpty } from '../utils';
import * as authService from '../services/auth';
import RNFS from 'react-native-fs';
import { UrlInfo, CURRENT_PROJECT, VersionInfo, POLLUTION_ORERATION_PROJECT } from '../config/globalconst';
export default Model.extend({
    namespace: 'qualityControl',
    state: {
        currentDGIMN: '',// 当前监测点id 质控记录列表
        currentQCAType: null,// 当前质控类型
        QCAResultRecordIndex: 1,// 质控记录页码
        QCAResultRecordTotal: 0,// 质控记录总数
        QCAResultRecordResult: { status: -1 },// 质控记录列表 请求状态
        QCAResultRecordData: [],// 质控记录列表 纯数据
        CNTypeList: [],// 质控记录列表 核查类型
        CNTypeObjectList: [],
        CNPollutantCodeList: [], // 质控记录列表 污染物类型
        CNPollutantCodeObjectList: [],
        CNTypeLabelString: '全部核查',
        QCAResultRecordTime: { label: '全部时间', value: 'all' },// 质控记录列表 时间筛选条件
        QCAStatusResult: { status: -1 },// 质控仪状态 和 CEMS状态
        QCAInfoResult: { status: -1 },// 质控信息
        doQualityControlCurrentPollutant: null,// 当前质控的污染因子
        n2Info: {},// 氮气信息
        StandardValue: '',// 盲样参考值
        NewQCARecordResult: { status: -1 },//质控日志
        QCACheckCMDResult: { status: 200 },
        QCAResultInfoResult: {
            status: -1, chartOption: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    padding: 32,
                    data: ['测量浓度', '配比标气浓度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                ]
            }
        }
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 获取质控详情
         * @param {*} param0 
         * @param {*} param1 
         */
        *getQCAResultInfo(
            {
                payload: { params, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            const { currentDGIMN, QCAResultRecordIndex, QCAResultRecordData, CNTypeList, CNPollutantCodeList, QCAResultRecordTime } = yield select(state => state.qualityControl);
            let requireParams = {
                MonitorTime: SentencedToEmpty(params, ['MonitorTime'], ''),
                EndTime: SentencedToEmpty(params, ['EndTime'], ''),
                PollutantCode: SentencedToEmpty(params, ['PollutantCode'], ''),
                DGIMN: currentDGIMN,
                QCAType: SentencedToEmpty(params, ['CN'], '')
            };
            const QCAResultInfoResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAResultInfo, requireParams);
            if (QCAResultInfoResult.status == 200) {
                QCAResultInfoResult.chartOption = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        padding: 32,
                        data: ['测量浓度', '配比标气浓度']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: SentencedToEmpty(QCAResultInfoResult, ['data', 'Datas', 'timeList'], [])
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '测量浓度',
                            type: 'line',
                            stack: '总量',
                            data: SentencedToEmpty(QCAResultInfoResult, ['data', 'Datas', 'concent'], [])
                        },
                        {
                            name: '配比标气浓度',
                            type: 'line',
                            stack: '总量',
                            data: SentencedToEmpty(QCAResultInfoResult, ['data', 'Datas', 'ratio'], [])
                        },
                    ]
                }
                yield update({ QCAResultInfoResult });
            } else {
                yield update({ QCAResultInfoResult });
            }
        },
        *getQCAResultRecord(
            {
                payload: { params, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            const { currentDGIMN, QCAResultRecordIndex, QCAResultRecordData, CNTypeList, CNPollutantCodeList, QCAResultRecordTime } = yield select(state => state.qualityControl);
            let requireParams = {
                DGIMN: currentDGIMN,
                CNType: CNTypeList,
                PollutantCode: CNPollutantCodeList,
                // BeginTime: '',
                // EndTime: '',
                PageIndex: QCAResultRecordIndex,
                PageSize: 20
            };
            if (SentencedToEmpty(QCAResultRecordTime, ['value'], 'all') != 'all') {
                let BeginTime = QCAResultRecordTime.value;
                let EndTime = moment(QCAResultRecordTime.value).add(1, 'month').subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss');
                requireParams.BeginTime = BeginTime;
                requireParams.EndTime = EndTime;
            }
            const QCAResultRecordResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAResultRecord, requireParams);
            let newQCAResultRecordData = [].concat(QCAResultRecordData);
            if (QCAResultRecordResult.status == 200) {
                if (QCAResultRecordIndex == 1) {
                    newQCAResultRecordData = SentencedToEmpty(QCAResultRecordResult, ['data', 'Datas'], []);
                    yield update({ QCAResultRecordResult: QCAResultRecordResult, QCAResultRecordData: SentencedToEmpty(QCAResultRecordResult, ['data', 'Datas'], []), QCAResultRecordTotal: QCAResultRecordResult.data.Total });
                } else {
                    newQCAResultRecordData = newQCAResultRecordData.concat(SentencedToEmpty(QCAResultRecordResult, ['data', 'Datas'], []));
                    yield update({ QCAResultRecordResult: QCAResultRecordResult, QCAResultRecordData: newQCAResultRecordData, QCAResultRecordTotal: QCAResultRecordResult.data.Total });
                }
            } else {
                if (QCAResultRecordIndex == 1) {
                    newQCAResultRecordData = [];
                    yield update({ QCAResultRecordResult: QCAResultRecordResult, QCAResultRecordData: [], QCAResultRecordTotal: 0 });
                } else {
                    yield update({ QCAResultRecordResult: QCAResultRecordResult, QCAResultRecordTotal: QCAResultRecordResult.data.Total });
                }
            }
            let requestEnd = new Date().getTime();
            setListData(newQCAResultRecordData, requestEnd - requestBegin);
        },
        /**
         * 获取质控仪 和 CEMS 的状态
         * @param {*} param0 
         * @param {*} param1 
         */
        *getQCAStatus(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            yield update({ QCAStatusResult: { status: -1 } });
            const { currentDGIMN } = yield select(state => state.qualityControl);
            const QCAStatusResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAStatus, {
                DGIMN: currentDGIMN,
            });
            if (QCAStatusResult.status == 200) {
                yield update({ QCAStatusResult });
            } else {
                ShowToast('质控仪状态获取失败！');
                yield update({ QCAStatusResult });
            }
            callback();
        },
        *getQCAInfo(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const { currentDGIMN } = yield select(state => state.qualityControl);
            const QCAInfoResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAInfo, {
                DGIMN: currentDGIMN,
            });
            if (QCAInfoResult.status == 200) {
                yield update({ QCAInfoResult });
            } else {
                ShowToast('质控信息获取失败！');
                yield update({ QCAInfoResult });
            }
        },
        /**
         * 开始核查
         * @param {*} param0 
         * @param {*} param1 
         */
        *sendQCACheckCMD(
            {
                payload: { params, callback = () => { } }
            },
            { call, put, take, update, select }
        ) {
            // 执行质控 SendQCACheckCMD
            /**
             * 
             * "DGIMN": currentDGIMN,
             * "Method": 1,操作类别()
             * 
             * "PollutantCode": "sample string 2",标气CODE
                "QCAType": 1,质控核查类别
                "StandardValue": 1.1 浓度值（盲样）
             */
            const { currentDGIMN } = yield select(state => state.qualityControl);
            const QCACheckCMDResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.SendQCACheckCMD, {
                "DGIMN": currentDGIMN,
                "Method": 1,
                ...params
            });

            if (QCACheckCMDResult.status == 200) {
                yield update({ QCACheckCMDResult });
                callback();
            } else {
                yield update({ QCACheckCMDResult });
                ShowToast(SentencedToEmpty(QCACheckCMDResult, ['data', 'Message'], '核查失败！'));
            }
        },
        /**
         * 单点最新韵味日志
         * @param {*} param0 
         * @param {*} param1 
         */
        *getNewQCARecord(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const { currentDGIMN, doQualityControlCurrentPollutant, currentQCAType, StandardValue } = yield select(state => state.qualityControl);
            if (!doQualityControlCurrentPollutant) {
                ShowToast('缺少查询条件：污染物');
                yield update({ NewQCARecordResult: { status: 200 } });
                return;
            }
            if (currentQCAType.code == '3105' && StandardValue == '') {
                ShowToast('缺少查询条件：盲样参考值');
                yield update({ NewQCARecordResult: { status: 200 } });
                return;
            }
            let aParams = {
                "DGIMN": currentDGIMN,
                "PollutantCode": doQualityControlCurrentPollutant.GasCode,
                "QCAType": currentQCAType.code,
                "Method": 1,
            };
            if (currentQCAType.code == '3105') {
                aParams.StandardValue = StandardValue;
            }

            const NewQCARecordResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetNewQCARecord, aParams);
            if (NewQCARecordResult.status == 200) {
                yield update({ NewQCARecordResult });
            } else {
                ShowToast('日志获取失败！');
                yield update({ NewQCARecordResult });
            }
        },
        /**
         * 测试接口
         * @param {*} param0 
         * @param {*} param1 
         */
        *test(
            {
                payload: { params, callback }
            },
            { call, put, take, update, select }
        ) {
            const { currentDGIMN } = yield select(state => state.qualityControl);
            const QCAResultRecordResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAResultRecord, {
                DGIMN: currentDGIMN,
                // CNType: '',
                // PollutantCode: '',
                // BeginTime: '',
                // EndTime: '',
                PageIndex: 1,
                PageSize: 20
            });

            const QCAStatusResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAStatus, {
                DGIMN: currentDGIMN,
            });

            const QCAInfoResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetQCAInfo, {
                DGIMN: currentDGIMN,
            });

            const NewQCARecordResult = yield call(authService.axiosAuthPost, api.pOperationApi.qualityControl.GetNewQCARecord, {
                "DGIMN": currentDGIMN,
                "PollutantCode": "sample string 2",
                "QCAType": 1,
                "Method": 1,
                "StandardValue": 1.1
            });
        },
    },
    subscriptions: {
        setupSubscriber({ dispatch, listen }) {
            listen({
                example: ({ params }) => {
                    dispatch({
                        type: 'methodexample',
                        payload: {}
                    });
                }
            });
        }
    }
});
