/*
 * @Description: 开通记录
 * @LastEditors: hxf
 * @Date: 2022-07-25 18:45:50
 * @LastEditTime: 2022-07-27 09:12:54
 * @FilePath: /SDLMainProject52/app/pollutionModels/provisioning.js
 */
import moment from 'moment';

import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { SentencedToEmpty } from '../utils';
import { getInformationBankOfEquipmentFileUrl } from './utils';
import * as authService from '../services/auth';
import { CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, VersionInfo } from '../config';
import 'jsencrypt';
import Base64 from 'react-native-base64-master';
export default Model.extend({
    namespace: 'provisioning',
    state: {
        point:{},
        searchValue:'',
        orderID:"",
        personalCenterOrderResult:{status:-1},
        personalCenterOrderInfoResult:{status:-1}
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 异常报告列表接口
         * @param {*} param0
         * @param {*} param1
         */
        *getPersonalCenterOrder(
            {
                payload: { params, setListData = data => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            let { searchValue } = yield select(state => state.provisioning);
            const result = yield call(authService.axiosAuthPost, api.provisioning.GetPersonalCenterOrder, {
                KeyValue: searchValue,
            });
            SentencedToEmpty(result
                ,['data','Datas','query'],[]).map((item)=>{
                    if (moment().isAfter(item.ExpirationDate,'date')) {
                        item.expire = true
                    } else {
                        item.expire = false
                    }
                })
            let requestEnd = new Date().getTime();
            yield update({personalCenterOrderResult:result});
            setListData(SentencedToEmpty(result
                        ,['data','Datas','query'],[]), requestEnd - requestBegin);
        },
        /**
         * 异常报告列表接口
         * @param {*} param0
         * @param {*} param1
         */
        *getPersonalCenterOrderInfo(
            {
                payload: { params, setListData = data => { } }
            },
            { call, put, take, update, select }
        ) {
            let requestBegin = new Date().getTime();
            let { orderID } = yield select(state => state.provisioning);
            const result = yield call(authService.axiosAuthPost, api.provisioning.GetGetPersonalCenterOrderInfo, {
                OrderID: orderID,
            });
            let requestEnd = new Date().getTime();
            yield update({ personalCenterOrderInfoResult: result });

            setListData(SentencedToEmpty(result
                        ,['data','Datas'],[]), requestEnd - requestBegin);
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
