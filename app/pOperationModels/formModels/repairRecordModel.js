import { createAction, NavigationActions, Storage, ShowToast, delay, StackActions, fast, slow, SentencedToEmpty } from '../../utils';
import * as authService from '../../services/auth';
import api from '../../config/globalapi';
import { Model } from '../../dvapack';
import { GetRepairList } from '../../utils/formutils';
import moment from 'moment';
import { getToken } from '../../dvapack/storage';

/**
 * 维修表单
 * LSK
 */
export default Model.extend({
    namespace: 'repairRecordModel',
    state: {
        //列表页面state
        liststatus: { status: -1 },
        //填写页面state
        editstatus: { status: -1 },
        //表单基本信息
        BaseInfo: {
            ID: '',
            DGIMN: null,
            TaskID: '',
            TypeID: 1,
            CreateUserID: '',
            CreateTime: '',
            RecordList: [],
            SignContent: null,
            SignTime: null
        },
        //表单主表信息
        MainInfo: {
            EnterpriseName: '',
            PointPosition: '',
            IsClear: '',
            RepairSummary: '',
            Remark: '',
            StartTime: '',
            EndTime: ''
        },
        //表单附表信息
        SubInfoList: {},
        //当前选中需要编辑的附表
        ItemPageData: {
            ItemID: '',
            ItemName: '',
            RepairDescription: '',
            ChangeSpareparts: '',
            IsClear: '',
            RepairSummary: '',
            Completed: ''
        },
        //维修项目列表（包含已维修和未维修）
        List: [],
        //维修项目码表
        EnumRepair: [],
        //更换部件码表
        EnumPart: []
    },

    reducers: {
        /** 选中一个维修项目进行修改 */
        selectSubInfo(
            state,
            {
                payload: { params }
            }
        ) {
            ItemPageData = {
                ItemID: '',
                ItemName: '',
                RepairDescription: '',
                ChangeSpareparts: '',
                IsClear: '',
                RepairSummary: '',
                Completed: ''
            };
            const Item = { ...ItemPageData, ...state.List[params.selectIndex] };
            Item.IsClear = state.MainInfo.IsClear;
            Item.RepairSummary = state.MainInfo.RepairSummary;
            return { ...state, ...{ ItemPageData: Item } };
        },

        /** 保存当前选中的item */
        saveItem(
            state,
            {
                payload: { params }
            }
        ) {
            //保存附表
            const SubInfoList = state.SubInfoList;
            let i = 0;
            for (i = 0; i < SubInfoList.length; i++) {
                if (SubInfoList[i].ItemID == params.ItemID) {
                    SubInfoList.splice(i, 1, params);
                    break;
                }
            }
            if (i == SubInfoList.length) SubInfoList.push(params);
            //保存主表
            const MainInfo = state.MainInfo;
            MainInfo.IsClear = params.IsClear; //是否清理
            MainInfo.RepairSummary = params.RepairSummary; //总结
            // MainInfo.StartTime=params.StartTime;//开始维修时间
            MainInfo.StartTime = moment().format('YYYY-MM-DD HH:mm:ss'); //开始维修时间
            // MainInfo.EndTime=params.EndTime;//结束维修时间
            MainInfo.EndTime = moment().format('YYYY-MM-DD HH:mm:ss'); //结束维修时间
            return { ...state, ...{ SubInfoList, MainInfo } };
        },

        /** 删除当前选中的item */
        delItem(
            state,
            {
                payload: { params }
            }
        ) {
            const ItemPageData = state.ItemPageData;
            const SubInfoList = state.SubInfoList;
            for (let i = 0; i < SubInfoList.length; i++) {
                if (SubInfoList[i].ItemID == ItemPageData.ItemID) {
                    SubInfoList.splice(i, 1);
                    break;
                }
            }
            return { ...state, ...{ SubInfoList } };
        },

        updateState(state, { payload }) {
            return { ...state, ...payload };
        }
    },

    effects: {
        /** 提交表单信息 */
        *saveForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            yield update({ editstatus: { status: -1 } });
            const { BaseInfo, MainInfo, SubInfoList } = yield select(state => state.repairRecordModel);
            const { taskDetail } = yield select(state => state.taskDetailModel);
            user = getToken();
            //修改基础信息
            BaseInfo.CreateUserID = user.UserId;
            BaseInfo.TaskID = taskDetail.ID;
            //加上主表信息
            BaseInfo.Content = MainInfo;
            //加上附表信息
            BaseInfo.RecordList = SubInfoList;
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.RepairRecordOpr, BaseInfo);
            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    //提交成功
                    //刷新任务详情的信息
                    //     if (BaseInfo.ID == null || BaseInfo.ID == '') {
                    //         yield put(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: TaskDetail.ID }));
                    //     }
                    yield put(createAction('getForm')({ params: {} }));
                    yield take('getForm/@@end');
                    //关闭等待进度
                    yield update({ editstatus: result });
                    yield put(NavigationActions.back());
                } else {
                    //提交失败
                    ShowToast('发生错误');
                    yield update({ editstatus: { status: 200 } });
                }
            } else {
                //网络异常提交失败
                ShowToast('网络连接失败，请检查');
                yield update({ editstatus: { status: 200 } });
            }
        },

        /** 根据TaskID获取表单信息 */
        *getForm(
            {
                payload: { params }
            },
            { call, put, update, select, take }
        ) {
            yield update({ liststatus: { status: -1 } });
            const { taskDetail } = yield select(state => state.taskDetailModel);
            params = { TaskID: taskDetail.ID };
            const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.RepairRecordDetail, params);
            let data = {};

            if (result.status == 200) {
                if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                    data = SentencedToEmpty(result, ['data', 'Datas'], {});
                    //数据不为空
                    let BaseInfo = data.Record; //基本信息
                    let MainInfo = data.Record.Content; //主表信息
                    let SubInfoList = [];
                    if (data.Record.RecordList) SubInfoList = data.Record.RecordList; //附表信息
                    let EnumRepair = data.Code; //维修项目码表
                    let EnumPart = data.SparePart; //更换部件码表
                    let List = GetRepairList(EnumRepair, SubInfoList); //所有的维修项目列表（将【已维修】与【未维修】组合成一个列表展示出来）
                    yield update({ BaseInfo, MainInfo, SubInfoList, EnumRepair, EnumPart, List, liststatus: result.status });
                } else {
                    //数据获取失败
                    // ShowToast('发生错误');
                    yield update({ liststatus: { status: 1000 } });
                }
            } else {
                //网络异常
                yield update({ liststatus: result });
            }
        },

        /** 删除表单 */
        *delForm(
            {
                payload: { params }
            },
            { call, put, update, take, select }
        ) {
            //接口需要数据 {"TaskID": "sample string 1","TypeID": 2,"DGIMN": "sample string 3"}
            const { taskDetail } = yield select(state => state.taskDetailModel);
            const { BaseInfo } = yield select(state => state.repairRecordModel);
            if (BaseInfo && BaseInfo.ID) {
                //已经保存 执行删除方法 并刷新上一个页面
                params = { TaskID: taskDetail.ID };
                const result = yield call(authService.axiosAuthPost, api.pOperationApi.OperationForm.RepairRecordDel, params);
                if (result.status == 200) {
                    if (SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                        data = SentencedToEmpty(result, ['data', 'Datas'], {});
                        yield put(NavigationActions.back());
                    } else {
                        //数据获取失败
                        // ShowToast('发生错误');
                        yield update({ liststatus: { status: 1000 } });
                    }
                } else {
                    //网络异常
                    yield update({ liststatus: result });
                }
            }
        },

        setupSubscriber({ dispatch, listen }) {
            listen({
                // RepairRecordEdit:()=>{
                //     dispatch(
                //       {
                //         type:'updateState',
                //         payload:{params:{editstatus:'default',}}
                //       }
                //     );
                // },
            });
        }
    }
});
