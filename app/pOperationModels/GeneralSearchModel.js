/*
 * @Description: 本地搜索列表 Model
 * @LastEditors: hxf
 * @Date: 2024-03-28 14:08:17
 * @LastEditTime: 2024-06-03 14:49:27
 * @FilePath: /SDLMainProject37/app/pOperationModels/GeneralSearchModel.js
 */
import { SentencedToEmpty, ShowToast, NavigationActions, CloseToast, ShowLoadingToast, ShowResult } from '../utils';
import * as dataAnalyzeAuth from '../services/dataAnalyzeAuth';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import moment from 'moment';


export default Model.extend({
    namespace: 'GeneralSearchModel',
    state: {
        keyWords: '',
        dataList: [],
        remoteResult: { status: 200 },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {

        /**
         * test
         * 获取所有的系统型号参数
         * @param {*} param0 
         * @param {*} param1 
         */
        *test(
            {
                payload: { params = {}, setListData = () => { } }
            },
            { call, put, take, update, select }
        ) {

        },
    },

    subscriptions: {}
});