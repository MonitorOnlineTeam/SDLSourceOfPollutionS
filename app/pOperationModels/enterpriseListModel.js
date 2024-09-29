import {
  createAction,
  NavigationActions,
  Storage,
  StackActions,
  ShowToast,
  SentencedToEmpty,
} from '../utils';
import * as authService from '../services/auth';
import {Model} from '../dvapack';
import api from '../config/globalapi';
import {axiosAuthPost, axiosAuthGet} from '../services/auth';
import moment from 'moment';
export default Model.extend({
  namespace: 'enterpriseListModel',
  state: {
    // 获取排口得任务记录
    TaskRecordIndex: 1,
    TaskRecordTotal: 0,
    TaskRecordResult: {status: -1},
    TaskRecordData: [],
    TaskRecordData: [],
    TaskRecordbeginTime: moment()
      .subtract(7, 'day')
      .format('YYYY-MM-DD 00:00:00'),
    TaskRecordendTime: moment().format('YYYY-MM-DD 23:59:59'),

    constructionCorpsListResult: {status: -1},
    monitorTargetListResult: {status: -1},
    targetType: 1,
    strName: '',
    regionItem: {},
    regionCode: null,
    siteData: {status: -1},
    airPointLst: {status: -1},
    airPointDetails: {status: -1},
    HomeStatusBarColor: '#aaa',
    systemMenu: [],
    commitStopResult: {status: 200},
    deleteStopsStatus: {status: -1},
    BaseFacilitiesResult: {status: -1},
    commitBaseFac: {status: 200},
    enterpriseListResult: {status: -1},
  },

  reducers: {
    updateState(state, {payload}) {
      return {...state, ...payload};
    },
  },
  effects: {
    /**
     * 新疆获取行政区接口  师团列表接口
     * @param {*} param0
     * @param {*} param1
     */
    *getEnterpriseListApp(
      {payload: {params, callback = (data, duration) => {}}},
      {call, put, update, take, select},
    ) {
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.xj.GetEnterpriseListApp,
        params,
      );
      let status = SentencedToEmpty(result, ['status'], -1);
      yield update({
        enterpriseListResult: result,
      });
      callback();
    },
    /**
     * 获取排口得任务记录
     */
    *getOperationHistoryRecordByDGIMN(
      {payload: {params, setListData = (data, duration) => {}}},
      {call, put, update, take, select},
    ) {
      /**
             * POST rest/PollutantSourceApi/XJHomeApi/GetConstructionCorpsList
                获取排口得任务记录。
             */
      let requestBegin = new Date().getTime();
      let {TaskRecordIndex, TaskRecordData} = yield select(
        state => state.enterpriseListModel,
      );
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.xj.GetOperationHistoryRecordByDGIMN,
        params,
      );
      let status = SentencedToEmpty(result, ['status'], -1);
      let newMoData = TaskRecordData;
      if (status == 200) {
        if (TaskRecordIndex == 1) {
          newMoData = TaskRecordData = SentencedToEmpty(
            result,
            ['data', 'Datas'],
            [],
          );
          yield update({
            TaskRecordData: newMoData,
            TaskRecordTotal: SentencedToEmpty(result, ['data', 'Total'], []),
            TaskRecordResult: result,
          });
        } else {
          newMoData = TaskRecordData.concat(
            SentencedToEmpty(result, ['data', 'Datas'], []),
          );
          yield update({
            TaskRecordData: newMoData,
            TaskRecordTotal: SentencedToEmpty(result, ['data', 'Total'], []),
            TaskRecordResult: result,
          });
        }
      } else {
        yield update({
          TaskRecordResult: result,
        });
      }
      let requestEnd = new Date().getTime();
      setListData(newMoData, requestEnd - requestBegin);
    },
    /**
     * 获取行政区接口
     */
    *getConstructionCorpsList({payload}, {call, put, update, take, select}) {
      /**
             * POST rest/PollutantSourceApi/XJHomeApi/GetConstructionCorpsList
                行政区接口参数为空。
             */
      yield update({constructionCorpsListResult: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.xj.GetConstructionCorpsList,
        {},
      );
      if (
        typeof SentencedToEmpty(result, ['data'], {}).Datas != 'undefined' &&
        SentencedToEmpty(result, ['data'], {}).Datas
      ) {
        let options = result.data.Datas;
        options.unshift({Name: '全部', RegionCode: null});
        result.data.Datas = options;
      }
      yield update({constructionCorpsListResult: result});
    },
    *getMenu({payload: {params}}, {call, put, take, update, select}) {
      //排口下菜单
      yield update({ponitInfo: {status: -1}});
      const {MenuID} = yield select(state => state.app);
      const result = yield call(
        authService.axiosAuthPost,
        api.pollutionApi.PointDetails.SystemMenu,
        {
          menu_id: MenuID,
        },
      );

      yield update({systemMenu: result.data.Datas});
    },
    /**
     * 获取企业列表
     */
    *getMonitorTargetList(
      {payload: {setListData = (data, duration) => {}}},
      {call, put, update, take, select},
    ) {
      /**
             * 
                GET rest/PollutantSourceApi/MonitorTargetApi/GetMonitorTargetList?targetType={targetType}&strName={strName}&regionCode={regionCode}
                企业列表，targetType	
                1:污染源，2:空气站,3:河段,4:工地。strName	
                企业简称和名称。regionCode	
                行政区编码
             */
      yield update({monitorTargetListResult: {status: -1}});
      let {targetType, strName, regionCode} = yield select(
        state => state.enterpriseListModel,
      );
      let paramString = `targetType=${targetType}&strName=${strName}`;
      if (regionCode) {
        paramString = paramString + '&regionCode=' + regionCode;
      }
      let requestBegin = new Date().getTime();
      const result = yield call(
        axiosAuthGet,
        api.pollutionApi.PointInfo.GetMonitorTargetList,
        null,
        paramString,
      );
      let requestEnd = new Date().getTime();
      setListData(
        SentencedToEmpty(result, ['data', 'Datas'], []),
        requestEnd - requestBegin,
      );
      yield update({monitorTargetListResult: result});
    },
    /**
     * 获取空气站列表
     */
    *getAirPointList(
      {payload: {setListData = (data, duration) => {}}},
      {call, put, update, take, select},
    ) {
      yield update({airPointLst: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.GetAirPointList,
        {
          DataType: 'HourData',
          Time: moment().subtract(1, 'hours').format('YYYY-MM-DD HH:00:00'),
        },
      );

      yield update({airPointLst: result});
    },
    /**
     * 获取空气站详情数据
     */
    *getAirPointDetails(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      yield update({airPointDetails: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.GetAirPointDetails,
        params,
      );
      if (result.status == 200) {
        callback(result);
      }
      yield update({airPointDetails: result});
    },
    /**
     * 停运上报
     */
    *commitStops(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      // debugger
      let {outputStopListDGIMN} = yield select(state => state.pointDetails);
      params.DGIMN = outputStopListDGIMN;
      yield update({commitStopResult: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.CommitStop,
        params,
      );
      if (result.data.IsSuccess) {
        callback();
        yield put('pointDetails/getOutputStopList', {});
      } else {
        ShowToast({
          message: result.data.Message,
          alertType: 'error',
        });
      }
      yield update({commitStopResult: result});
    },
    /**
     * 停运上报修改
     */
    *updateStops(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      let {outputStopListDGIMN} = yield select(state => state.pointDetails);
      params.DGIMN = outputStopListDGIMN;
      yield update({commitStopResult: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.UpdateStop,
        params,
      );

      yield update({commitStopResult: result});
      yield put('pointDetails/getOutputStopList', {});
      callback();
    },
    /**
     * 异常上报
     */
    *commitAbnomal(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      let {abnormalListDGIMN} = yield select(state => state.pointDetails);
      params.DGIMN = abnormalListDGIMN;
      yield update({commitAbnormalResult: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.CommitAbnormal,
        params,
      );

      yield update({commitAbnormalResult: result});
      yield put('pointDetails/getAbnormalList', {});
      callback();
    },
    /**
     * 基础设施设置提交
     */
    *commitBaseFac(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      yield update({commitBaseFac: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.CommitBaseFac,
        params,
      );

      yield put('pointDetails/getPointInfo', {params: {DGIMN: params.DGIMN}});

      yield update({commitBaseFac: result});
      callback();
    },
    /**
     * 基础信息设置页面数据
     */
    *BaseFacilities(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      yield update({BaseFacilitiesResult: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pOperationApi.OperationForm.BaseFacilitiesInfo,
        params,
      );

      yield update({BaseFacilitiesResult: result});
    },
    /**
     * 删除停运记录
     */
    *deleteStopsRec(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      yield update({deleteStopsStatus: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.DeleteStopRec,
        null,
        `ID=${params.ID}`,
      );
      yield update({deleteStopsStatus: result});
      yield put('pointDetails/getOutputStopList', {});
      // callback();
    },
    /**
     * 删除异常报告记录
     */
    *deleteAbnormalRec(
      {payload: {params, callback}},
      {call, put, update, take, select},
    ) {
      yield update({deleteStopsStatus: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.DeleteAbnormalRec,
        null,
        `ID=${params.ID}`,
      );
      yield update({deleteStopsStatus: result});
      yield put('pointDetails/getAbnormalList', {});
      // callback();
    },
    /**
     * 获取企业下所有站点数据
     */
    *getSiteDataList({payload: {params}}, {call, put, update, take, select}) {
      yield update({siteData: {status: -1}});
      const result = yield call(
        axiosAuthPost,
        api.pollutionApi.PointInfo.GetSiteDatas,
        params,
      );

      yield update({siteData: result});
    },
    /**
     * 获取更新信息
     */
    *getEnterpriseType({payload: {params}}, {call, put, take, update}) {
      //post请求
      const result = yield call(
        authService.axiosAuthGet,
        api.pollutionApi.Account.UpdateConfig,
        params,
      );
    },
  },
  subscriptions: {},
});
