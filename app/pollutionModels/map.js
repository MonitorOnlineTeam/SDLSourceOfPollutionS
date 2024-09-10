import moment from 'moment';

import { GetEntCoordinates } from './utils';
import { createAction, NavigationActions, Storage, StackActions, ShowToast } from '../utils';
import coordinate from '../utils/coordinate';
import { Model } from '../dvapack';
import api from '../config/globalapi';
import { axiosAuthPost, axiosAuthGet } from '../services/auth';
import { getToken } from '../dvapack/storage';
import Base64 from 'react-native-base64-master';
export default Model.extend({
    namespace: 'map',
    state: {
        curPage: 'list',// list map
        mapStatus: 200,
        mapListStatus: 200,
        searchStatus: 200, //搜索为了体验性，最好开始不转圈
        selectEnt: null, //选中的企业实体
        isSearching: false,

        legends: null, //图例

        selectPoint: null, //选中的站点
        popStatus: -1, //点击站点 弹出气泡的状态
        popData: null, //点击站点 弹出气泡的数据

        searchText: '', //搜索的文案，存在与不存在影响地图顶部展示效果
        searchEntList: [], //搜索的企业列表
        searchhistoryList: [], //搜索历史

        defaultEntList: [], //默认的企业列表
        defaultRegion: null, //中心坐标和经纬跨度组成 地图区域的默认范围

        showEntList: [], //展现给用户的企业列表
        showPointList: [], //展现给用户的站点列表

        showRegion: null, //中心坐标和经纬跨度组成 地图区域的显示范围

        selectEnt_List: null, //选中的企业实体 列表专用
        showEntList_List: null, //展现给用户的企业列表 列表专用
        showPointList_List: [], //展现给用户的站点列表 列表专用

        otherPointList: [], //大气站、水站等监测点 默认展示在地图

        addOrDelStickyEntCode: null, //置顶的企业ID
        addOrDel: null //置顶的操作 1代表置顶 0代表取消
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        /**
         * 首次加载企业列表，并获取经纬度信息
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *loadEntListFirstTime(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { source } = params;
            if (source == 'map') {
                yield update({ mapStatus: -1 });
            } else {
                yield update({ mapListStatus: -1 });
            }
            const result = yield call(axiosAuthGet, api.pollutionApi.PointInfo.GetMonitorTargetList, null, 'strName=');
            if (result.status == 200) {
                if (result.data.Datas && result.data.Datas[0]) {
                    let defaultRegion = coordinate.getRegionByPoints(result.data.Datas, 'Longitude', 'Latitude'); //算出经纬度范围来

                    const entList = [];
                    let otherPointList = [];
                    result.data.Datas.map(item => {
                        if (item.Points && item.Points.length > 0) {
                            let otherList = item.Points; //大气站、水站等监测点 默认展示在地图

                            otherPointList = otherPointList.concat(otherList);
                        } else {
                            entList.push(item); //地图上的企业列表 不包含监测站 只包含监测点
                        }
                    });
                    if (result.data.Datas.length == 1) {
                        yield update({ defaultEntList: result.data.Datas });

                        yield put('getPointListByEntCode', {
                            params: {
                                entCode: result.data.Datas[0]['Id'],
                                source: 'map'
                            }
                        });
                        yield take('getPointListByEntCode/@@end');
                        yield update({ showEntList: entList, showEntList_List: result.data.Datas, defaultRegion, otherPointList: otherPointList });
                    } else {
                        yield update({ defaultEntList: result.data.Datas, showEntList: entList, showEntList_List: result.data.Datas, defaultRegion, otherPointList: otherPointList, showRegion: defaultRegion });
                    }
                } else {
                    yield update({ defaultEntList: [] });
                    ShowToast('查询结果为空');
                }
            }
            if (source == 'map') {
                yield update({ mapStatus: 200 });
            } else {
                yield update({ mapListStatus: result.status });
            }
        },

        /**
         * 刷新企业列表
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *refreshEntList({ payload }, { call, put, take, update, select }) {
            // yield update({ mapStatus: -1 });
            // const result = yield call(axiosAuthGet, api.pollutionApi.PointInfo.GetMonitorTargetList, null, 'strName=');
            // if (result.status == 200) {
            //     if (result.data.Datas && result.data.Datas[0]) {
            //         yield update({ defaultEntList: result.data.Datas });
            //     } else {
            //         yield update({ defaultEntList: [] });
            //         ShowToast('查询结果为空');
            //     }
            // }
            // yield update({ mapStatus: result.status });
        },
        /*
         * 置顶
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *addOrDelStickyEnt(
            {
                payload: { }
            },
            { call, put, take, update, select }
        ) {
            //type 1置顶 2取消

            const { addOrDelStickyEntCode, addOrDel } = yield select(state => state.map);

            if (addOrDelStickyEntCode == null || addOrDel == null) {
                ShowToast('参数问题');
                return;
            }
            const result = yield call(axiosAuthPost, api.pollutionApi.PointInfo.AddOrDelStickyEnt, null, `EntCode=${addOrDelStickyEntCode}&type=${addOrDel}`);

            if (result.status == 200) {
                yield put(createAction('loadEntListFirstTime')({ params: { source: 'mapList' } }));
                //刷新 新的企业列表
                yield put(createAction('enterpriseListModel/getMonitorTargetList')({}));
            } else {
                ShowToast('置顶失败');
            }
        },

        /**
         * 根据企业code获取站点列表
         *
         * params 中为entCode
         * @param {*} {
         *                 payload: { params }
         *             }
         * @param {*} { call, put, take, update, select }
         */
        *getPointListByEntCode(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { entCode, source } = params;
            if (source == 'map') {
                yield update({ mapStatus: -1 });
            } else {
                yield update({ mapListStatus: -1 });
            }
            const { defaultEntList } = yield select(state => state.map);
            const selectEnt = defaultEntList.find(item => item.Id == entCode); //！点击企业时候 根据企业id 找出选中的企业实体 用来找到企业名字 厂区图等信息
            const result = yield call(axiosAuthGet, api.pollutionApi.PointInfo.GetPoints, null, `monitorTargetId=${entCode}`);
            if (result.status == 200) {
                if (result.data.Datas && result.data.Datas[0]) {
                    //将厂区图数据重新组装成app需要的格式 并且 算出地图需要显示的范围
                    let { lines, region: showRegion } = GetEntCoordinates(selectEnt.CoordinateSet);
                    if (showRegion == null) {
                        showRegion = coordinate.getRegionByPoints(result.data.Datas, 'Longitude', 'Latitude');
                    }
                    if (showRegion && showRegion.longitude) {
                        showRegion.longitude = showRegion.longitude + Math.random() * 0.0001;
                    }
                    selectEnt.lines = lines; //厂区边界 存到企业信息里

                    const showPointList = result.data.Datas;
                    // 排序由服务端控制
                    // showPointList.sort((a, b) => {
                    //     return a.PollutantType > b.PollutantType ? 1 : -1;
                    // });

                    if (selectEnt.Points && selectEnt.Points.length > 0) {
                        //选中大气站 水站时候不更新地图
                        yield update({ showPointList_List: showPointList, selectEnt_List: selectEnt, selectPoint: null });
                    } else {
                        //更新 需要展示的排口 地图展示范围 选中企业
                        yield update({ showPointList: showPointList, showPointList_List: showPointList, showRegion: { ...showRegion }, selectEnt_List: selectEnt, selectEnt: selectEnt, selectPoint: null });
                    }
                } else {
                    yield update({ showPointList: [], showPointList_List: [] });
                    ShowToast('查询结果为空');
                }
            }
            if (source == 'map') {
                yield update({ mapStatus: 200 });
            } else {
                yield update({ mapListStatus: result.status });
            }
        },
        /**
         * 取消站点展示
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *dismissPoints({ payload }, { call, put, take, update, select }) {
            yield update({ showPointList: [], selectEnt: null, selectPoint: null, showPointList_List: [], selectEnt_List: null });
        },

        /**
         * 获取站点实时数据
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *getPointLastData(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { DGIMN } = params;
            const { showPointList, otherPointList } = yield select(state => state.map);
            let selectPoint = showPointList.find(item => item.DGIMN == DGIMN);
            //点击大气站、水站等监测点 根据其他站点找出选中的站点
            if (selectPoint == null || typeof selectPoint == 'undefined') selectPoint = otherPointList.find(item => item.DGIMN == DGIMN);
            yield update({ selectPoint, popData: null, popStatus: -1 });

            const postParams = { DGIMNs: DGIMN, dataType: 'HourData', isLastest: true, pollutantTypes: selectPoint.PollutantType };
            const result = yield call(axiosAuthPost, api.pollutionApi.Data.AllTypeSummaryList, postParams);

            if (result.status == 200) {
                if (result.data.Datas && result.data.Datas[0]) {
                    yield update({ popData: result.data.Datas[0], popStatus: 200 });
                } else {
                    yield update({ popData: {}, popStatus: 200 });
                }
            } else if (result.status == 404) {
                yield update({ popData: {}, popStatus: 200 });
            } else if (result.status == 1000) {
                yield update({ popData: {}, popStatus: 200 });
            }
        },

        /**
         * 获取图例
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *GetPhoneMapLegend({ payload }, { call, put, take, update, select }) {
            const result = yield call(axiosAuthGet, api.pollutionApi.PointInfo.GetPhoneMapLegend, null);
            if (result.status == 200) {
                if (result.data && result.data.Datas) {
                    yield update({ legends: result.data.Datas });
                    return;
                }
            }
            yield update({ legends: null });
        },

        /**
         * 搜索企业
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *searchEntList(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            console.log('searchEntList');
            const { text } = params;
            if (text) {
                yield update({ searchStatus: -1, searchText: text, isSearching: true });
                const { regionCode } = yield select(state => state.enterpriseListModel)
                let paramsStr = `strName=${params.text}`;
                if (regionCode && regionCode != '') {
                    paramsStr = paramsStr + '&regionCode=' + regionCode;
                }
                const result = yield call(axiosAuthGet, api.pollutionApi.PointInfo.GetMonitorTargetList, null, paramsStr);
                if (result.status == 200) {
                    if (result.data.Datas && result.data.Datas[0]) {
                        const entList = [];
                        result.data.Datas.map(item => {
                            if (item.Points && item.Points.length > 0) {
                            } else {
                                entList.push(item); //查询企业列表 不包含监测站
                            }
                        });
                        yield update({ searchEntList: entList });
                    } else {
                        yield update({ searchEntList: [] });
                    }
                }
                yield update({ searchStatus: result.status });
            } else {
                yield update({ searchEntList: [], isSearching: false });
            }
        },
        /**
         * 取消搜索
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *dismissSearch({ payload }, { call, put, take, update, select }) {
            yield update({ searchEntList: [], searchText: '', isSearching: false });
        },
        /**
         * 获取搜索历史
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *getSearchHistory({ payload }, { call, put, take, update, select }) {
            const { UserId } = getToken();
            const { regionCode } = yield select(state => state.enterpriseListModel)
            const params = {
                configId: 'searchHistory',
                pageIndex: 1,
                pageSize: 10,
                ConditionWhere: JSON.stringify({ rel: '$and', group: [{ rel: '$and', group: [{ Key: 'dbo__T_Bas_SearchHistory__User_ID', Value: UserId, Where: '$like' }] }] })
            };
            if (regionCode && regionCode != '') {
                params.ConditionWhere = JSON.stringify({
                    rel: '$and', group: [{
                        rel: '$and', group: [{ Key: 'dbo__T_Bas_SearchHistory__User_ID', Value: UserId, Where: '$like' }
                            , { "Key": "dbo__T_Bas_SearchHistory__RegionCode", "Value": regionCode, "Where": "$=" }]
                    }]
                })
            }
            // if (global.constants.isSecret == true) {
            //     params.configId = Base64.encode(params.configId);
            //     params.ConditionWhere = Base64.encode(params.ConditionWhere);
            // }
            const result = yield call(axiosAuthPost, api.pollutionApi.PointInfo.GetSearchHistory, params);
            if (result.status == 200) {
                if (result.data.Datas.DataSource && result.data.Datas.DataSource[0]) {
                    // key dbo.T_Bas_SearchHistory.SearchContent
                    // key dbo.T_Bas_SearchHistory.SearchTime
                    yield update({ searchhistoryList: result.data.Datas.DataSource });
                } else {
                    yield update({ searchhistoryList: [] });
                }
            }
        },
        /**
         * 清理搜索历史
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *clearSearchHistory({ payload }, { call, put, take, update, select }) {
            const { UserId } = getToken();

            const result = yield call(axiosAuthPost, api.pollutionApi.PointInfo.DelSearchHistory, null, `userId=${UserId}`);
            if (result.status == 200) {
                if (result.data.IsSuccess) {
                    yield update({ searchhistoryList: [] });
                    return;
                }
            }
            console.log('删除失败');
        },
        /**
         * 插入搜索内容
         * @param {*} { payload }
         * @param {*} { call, put, take, update, select }
         */
        *insertSearchText(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            const { UserId } = getToken();
            const { SearchContent } = params;
            const { regionCode } = yield select(state => state.enterpriseListModel)
            let paramStr = `userId=${UserId}&content=${SearchContent}`;
            if (regionCode && regionCode != '') {
                paramStr = paramStr + `&regionCode=${regionCode}`;
            } else {
                paramStr = paramStr + `&regionCode=${''}`;
            }
            const result = yield call(axiosAuthPost, api.pollutionApi.PointInfo.AddSearchHistory, null, paramStr);
            if (result.status == 200) {
                if (result.data.IsSuccess) {
                    console.log('保存成功');
                    return;
                }
            }
            console.log('保存失败');
        },

        *resetPage(
            {
                payload: { params }
            },
            { call, put, take, update, select }
        ) {
            yield update({
                mapStatus: 200,
                mapListStatus: 200,
                searchStatus: 200, //搜索为了体验性，最好开始不转圈
                selectEnt: null, //选中的企业实体
                isSearching: false,

                legends: null, //图例

                selectPoint: null, //选中的站点
                popStatus: -1, //点击站点 弹出气泡的状态
                popData: null, //点击站点 弹出气泡的数据

                searchText: '', //搜索的文案，存在与不存在影响地图顶部展示效果
                searchEntList: [], //搜索的企业列表
                searchhistoryList: [], //搜索历史

                defaultEntList: [], //默认的企业列表
                defaultRegion: null, //中心坐标和经纬跨度组成 地图区域的默认范围

                showEntList: [], //展现给用户的企业列表
                showPointList: [], //展现给用户的站点列表

                showRegion: null, //中心坐标和经纬跨度组成 地图区域的显示范围

                selectEnt_List: null, //选中的企业实体 列表专用
                showEntList_List: null, //展现给用户的企业列表 列表专用
                showPointList_List: [], //展现给用户的站点列表 列表专用

                otherPointList: [] //大气站、水站等监测点 默认展示在地图
            });
        }
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
