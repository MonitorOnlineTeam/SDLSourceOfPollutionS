/**
 * 全局api
 * liz
 * 2016.12.19
 */
export default api = {
    /*用户信息*/
    //网格化
    //视频
    video: {
        getYsyToken: '/rest/AtmosphereApi/Ysy/GetToken' //获取萤石云token
    },
    //网格化
    //网格化排名
    //水质相关
    waterhome: {
        //netcore ✅ GetCalibrationTaskStatus: 'rest/PollutantSourceApi/TaskFormApi/GetCalibrationTaskStatus' // 判断站点是否可以创建校准任务
        GetCalibrationTaskStatus: 'rest/PollutantSourceApi/OperationWorkbenchApi/JudgeCalibrationTaskStatus' // 判断站点是否可以创建校准任务
    },
    //预警
    /*水质断面*/
    //水质审核
    //运维个人中心
    operationaccount: {
        //netcore ✅ AddClockInLog: 'rest/PollutantSourceApi/BaseDataApi/AddClockInLog' // 服务端记录日志
        AddClockInLog: 'rest/PollutantSourceApi/OperationWorkbenchApi/AddSignInLog' // 服务端记录日志
    },

    /*运维任务*/
    /*审批*/
    approval: {
        //netcore ✅ pending: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskListRight', //待审批
        pending: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetApprovedTaskList', //待审批
        //netcore ✅ ExamApplication: 'rest/PollutantSourceApi/TaskProcessingApi/ExamApplication', //对任务申请进行审核
        ExamApplication: 'rest/PollutantSourceApi/OperationWorkbenchApi/AuditTask', //对任务申请进行审核
        //netcore ✅ GetTaskListRightByTaskID: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskListRightByTaskID' //获取单个任务的审批详情
        GetTaskListRightByTaskID: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetTaskAuditDetails' //获取单个任务的审批详情
    },
    /* 污染源API */
    pollutionApi: {
        /*新疆项目 */
        xj: {
            //netcore ✅ GetMissDataList: 'rest/PollutantSourceApi/BaseDataApi/GetMissDataList', // 缺失数据
            GetMissDataList: 'rest/PollutantSourceApi/ExceptionDataApi/GetMissDataList', // 缺失数据
            //netcore ✅ GetOperationHistoryRecordByDGIMN: 'rest/PollutantSourceApi/TaskProcessingApi/GetOperationHistoryRecordByDGIMN', // 获取排口得任务记录
            GetOperationHistoryRecordByDGIMN: 'rest/PollutantSourceApi/WorkOrderApi/GetPointOperationTaskList', // 获取排口得任务记录
            //netcore ✅ GetAirSettingAndPollutant: 'rest/PollutantSourceApi/MonDataApi/GetAirSettingAndPollutant', //新疆兵团 空气站地理信息和监测因子
            GetAirSettingAndPollutant: 'rest/PollutantSourceApi/BaseDataApi/GetAirSettingAndPollutant', //新疆兵团 空气站地理信息和监测因子
        },
        Account: {
            //初始化报警状态
            //netcore ✅ ChangePwd: 'rest/PollutantSourceApi/AuthorApi/ChangePwd',
            ChangePwd: 'rest/PollutantSourceApi/LoginApi/ChangePwd',
            Login: 'rest/PollutantSourceApi/LoginApi/Login', //登录
            PostMessageCode: 'rest/PollutantSourceApi/LoginApi/PostMessageCode', // 获取验证码
            GetToken: 'rest/PollutantSourceOAuth/connect/token', //身份认证token
            UpdateConfig: 'rest/PollutantSourceApi/SystemSettingApi/GetAndroidOrIosSettings', //更新配置 监管服务端控制更新接口

            //修改密码
            //获取码表
            //netcore ✅ GetHelpCenterList: 'rest/PollutantSourceApi/BaseDataApi/GetHelpCenterList', //帮助中心 一级
            GetHelpCenterList: 'rest/PollutantSourceApi/HelpCenterApi/GetQuestionTypeList', //帮助中心 一级
            //netcore ✅ GetQuestionDetialList: 'rest/PollutantSourceApi/BaseDataApi/GetQuestionDetialList' //帮助中心
            GetQuestionDetialList: 'rest/PollutantSourceApi/HelpCenterApi/GetQuestionList' //帮助中心
        },
        PointInfo: {
            //netcore ✅ CreatTaskTarget: 'rest/PollutantSourceApi/MonitorTargetApi/GetOperationTargetList', //创建任务获取监控标
            CreatTaskTarget: 'rest/PollutantSourceApi/MonitorTargetApi/GetMonitorTargetList', //创建任务获取监控标
            GetMonitorTargetList: 'rest/PollutantSourceApi/MonitorTargetApi/GetMonitorTargetList', //获取监控标
            AddOrDelStickyEnt: 'rest/PollutantSourceApi/MonitorTargetApi/AddOrDelStickyEnt', //置顶监控标
            GetPoints: 'rest/PollutantSourceApi/MonitorPointApi/GetPoints', //获取监测点
            //netcore ✅ GetPhoneMapLegend: 'rest/PollutantSourceApi/MonitorTargetApi/GetPhoneMapLegend', //获取图例
            GetPhoneMapLegend: 'rest/PollutantSourceApi/MonitorPollutantApi/GetPollutantTypeTargetList', //获取图例
            DelSearchHistory: 'rest/PollutantSourceApi/MonitorTargetApi/ClearHistory', //删除搜索历史
            GetSearchHistory: 'rest/PollutantSourceApi/AutoFormDataApi/GetListPager', //获取搜索历史
            AddSearchHistory: 'rest/PollutantSourceApi/MonitorTargetApi/HistoryAdd', //插入搜索历史
            //netcore ✅ GetSiteDatas: 'rest/PollutantSourceApi/MonDataApi/GetMonDataToXinJiang', //企业下所有排口数据
            GetSiteDatas: 'rest/PollutantSourceApi/MonBasicDataApi/GetMonDataToXinJiang', //企业下所有排口数据
            GetAirPointList: 'rest/PollutantSourceApi/MonDataApi/GetAirDataToXinJiang', //空气站列表
            GetAirPointDetails: 'rest/PollutantSourceApi/MonDataApi/GetAirHistoryData', //空气站详情
            //netcore ✅ CommitStop: 'rest/PollutantSourceApi/OutputStopApi/AddOutputStop', //停运上报
            CommitStop: 'rest/PollutantSourceApi/OutputStopApi/AddOutputStop', //停运上报
            //netcore ✅ UpdateStop: 'rest/PollutantSourceApi/OutputStopApi/UpdateOutputStop', //停运上报修改
            UpdateStop: '/rest/PollutantSourceApi/OutputStopApi/UpdateOutputStop', //停运上报修改
            DeleteStopRec: 'rest/PollutantSourceApi/OutputStopApi/DeleteOutputStopById', //删除停运记录
            //netcore ✅ CommitAbnormal: 'rest/PollutantSourceApi/ExceptionApi/AddOrEdtExceptionReported', //异常上报
            CommitAbnormal: 'rest/PollutantSourceApi/ExceptionDataApi/AddOrEdtExceptionReported', //异常上报
            //netcore ✅ DeleteAbnormalRec: 'rest/PollutantSourceApi/ExceptionApi/DeleteExceptionReported', //删除异常上报记录
            DeleteAbnormalRec: 'rest/PollutantSourceApi/ExceptionDataApi/DeleteExceptionReported', //删除异常上报记录
            CommitBaseFac: 'rest/PollutantSourceApi/BaseDataApi/UpdateDGIMNBase' //基础信息设置
        },
        PointDetails: {
            //netcore ✅ GetAbnormalList: 'rest/PollutantSourceApi/ExceptionApi/GetExceptionReportedList', //异常报告列表接口
            GetAbnormalList: 'rest/PollutantSourceApi/ExceptionApi/GetExceptionReportList', //异常报告列表接口
            //netcore ✅ GetOutputStopList: 'rest/PollutantSourceApi/POutputStop/GetOutputStopList', //停产列表接口
            GetOutputStopList: 'rest/PollutantSourceApi/OutputStopApi/GetOutputStopList', //停产列表接口
            //netcore ✅ PointHourData: 'rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList', //站点小时数据
            PointHourData: 'rest/PollutantSourceApi/MonBasicDataApi/GetAllTypeDataList', //站点小时数据
            //netcore ✅ StaffInfo: 'rest/PollutantSourceApi/UserInfosApi/GetCurrentUserInfo', //运维人员信息
            StaffInfo: 'rest/PollutantSourceApi/UserApi/GetCurrentUserInfo', //运维人员信息
            GetVideoList: 'rest/PollutantSourceApi/VideoApi/GetCameraMonitorList', //视频列表
            //netcore ✅ GetOverLimits: 'rest/PollutantSourceApi/MonitorPointApi/GetAstrictValueByDGIMN', //获取排口的超标限值
            GetOverLimits: 'rest/PollutantSourceApi/MonitorPollutantApi/GetAstrictValueByDGIMN', //获取排口的超标限值
            //netcore ✅ PointInfo: 'rest/PollutantSourceApi/BaseDataApi/GetServicesData', //获取站点基本信息
            PointInfo: 'rest/PollutantSourceApi/MonitorTargetApi/GetMonitorPointList', //获取站点基本信息
            //netcore ✅ SystemMenu: 'rest/PollutantSourceApi/AuthorApi/GetSysMenuByUserID', //获取系统菜单
            SystemMenu: 'rest/PollutantSourceApi/MenuApi/GetSysMenuByUserID', //获取系统菜单
            //netcore ✅ PollantCodes: 'rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', //获取排口污染因子
            PollantCodes: 'rest/PollutantSourceApi/MonitorPollutantApi/GetPollutantListByDgimn', //获取排口污染因子
            GetLocalMemoryExceptionProcessing: 'rest/PollutantSourceApi/AlarmDataApi/GetLocalMemoryExceptionProcessing', //获取报警记录
            //netcore ✅ GetMobileOperationPageList: 'rest/PollutantSourceApi/TaskProcessingApi/GetMobileOperationPageList', //获取运维日志
            GetMobileOperationPageList: 'rest/PollutantSourceApi/OperationLogsApi/GetOperationLogsList', //获取运维日志
            //netcore ✅ GetEquipmentInfo: 'rest/PollutantSourceApi/OperationBasicApi/GetEquipmentInfo', //获取监测点下设备资料信息
            GetEquipmentInfo: 'rest/PollutantSourceApi/EquipmentApi/GetEquipmentInfo', //获取监测点下设备资料信息
            //netcore ✅ ChartLstDatas: 'rest/PollutantSourceApi/MonDataApi/GetAllTypeDataList' //获取排口的图表数据
            ChartLstDatas: 'rest/PollutantSourceApi/MonBasicDataApi/GetAllTypeDataList' //获取排口的图表数据
        },
        Data: {
            GetListPager: 'rest/PollutantSourceApi/AutoFormDataApi/GetListPager',// netcore autoform
            GetPollutantTypeList: 'rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', //污染物类型
            GetPollutantTypeCode: '/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', //污染物编码
            //数据相关信息
            //netcore ✅ AllTypeSummaryList: 'rest/PollutantSourceApi/BaseDataApi/AllTypeSummaryList', //获取最新监控数据
            AllTypeSummaryList: 'rest/PollutantSourceApi/MonBasicDataApi/AllTypeSummaryList', //获取最新监控数据
            GetCityDayDataCnemcList: 'rest/PollutantSourceApi/MonDataApi/GetCityDayDataCnemcList', //获取空气质量首页的数据
            //历史数据
            //超标数据
            //异常数据
            //netcore ✅ GetExceptionData: '/rest/PollutantSourceApi/BaseDataApi/GetExceptionData'
            GetExceptionData: '/rest/PollutantSourceApi/ExceptionDataApi/GetExceptionData'
        },
        Alarm: {
            GetSmallBellList: 'rest/PollutantSourceApi/OperationBasicApi/GetSmallBellList', //获取报警通知 用于渲染各个页面的小铃铛
            //首页报警排口
            //netcore ✅ AlarmHomeData: 'rest/PollutantSourceApi/MonitorAlarmApi/GetMonitorAlarmDatas',
            AlarmHomeData: '/rest/PollutantSourceApi/AlarmVerifyManageApi/GetMonitorAlarmDatas',
            //报警列表
            //netcore ✅ GetMonitorAlarmDatas: 'rest/PollutantSourceApi/MonitorAlarmApi/GetMonitorAlarmDatas',
            GetMonitorAlarmDatas: '/rest/PollutantSourceApi/AlarmVerifyManageApi/GetMonitorAlarmDatas',
            // 异常报警 + 数据变化趋势异常报警 计数接口
            //netcore ✅ GetMonitorAlarmDatasCount: 'rest/PollutantSourceApi/MonitorAlarmApi/GetMonitorAlarmDatasCount',
            GetMonitorAlarmDatasCount: '/rest/PollutantSourceApi/AlarmVerifyManageApi/GetMonitorAlarmDatasCount',
            //netcore ✅ GetOperationOverData: 'rest/PollutantSourceApi/MonitorAlarmApi/GetOperationOverData', //新疆兵团用
            GetOperationOverData: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetOverDataList', //新疆兵团用
            //超标数据
            //netcore ✅ GetOverData: 'rest/PollutantSourceApi/BaseDataApi/GetOverData',
            GetOverData: 'rest/PollutantSourceApi/OverDataApi/GetOverData',
            //单点报警记录
            //报警
            //核实记录
            //netcore ✅ 使用新的autoform，在effect中修改地址 GetListPager: 'rest/PollutantSourceApi/AutoFormDataApi/GetListPager',
            //netcore uploadimage: 'rest/PollutantSourceApi/UploadApi/PostFiles', //图片上传
            uploadimage: 'rest/PollutantSourceApi/UploadApi/UploadPicture', //图片上传
            UploadFiles: 'rest/PollutantSourceApi/UploadApi/UploadFiles', //图片上传
            //netcore ✅ PostFilesAddWater: 'rest/PollutantSourceApi/UploadApi/PostFilesAddWater', //图片上传 水印
            PostFilesAddWater: 'rest/PollutantSourceApi/UploadApi/UploadFilesAddWater', //图片上传 水印
            delPhoto: 'rest/PollutantSourceApi/UploadApi/DeleteAttach', //删图片
            VerifySubmit: 'rest/PollutantSourceApi/MonitorAlarmApi/AlarmVerifyAdd', //核实提交
            GetAlarmNotices: 'rest/PollutantSourceApi/AlarmDataApi/GetAlarmNotices', //获取报警通知 用于渲染各个页面的小铃铛
            VerifyDetails: 'rest/PollutantSourceApi/AutoFormDataApi/GetFormData', //报警核实的详情
            GetAlarmVerifyDetailsRecords: 'rest/PollutantSourceApi/ExceptionApi/GetAlarmRecordDetails', //已核实的关联报警
            GetOpVerifyDetailsRecords: 'rest/PollutantSourceApi/MonitorAlarmApi/GetRelaOverData' //运维已核实的关联超标报警
        }
    },
    DataAnalyze: {
        WarningList: 'rest/PollutantSourceApi/Warning/GetModelExceptionListByPointAuth', //报警和单子列表
        GetMoldList: 'rest/PollutantSourceApi/Mold/GetMoldList', //模型类型
        GetSingleWarning: 'rest/PollutantSourceApi/Warning/GetSingleWarning', //报警详情
        SetStopTime: '/rest/PollutantSourceApi/Warning/SetStopTime', //报警暂停时间设置
        IsHaveStopTime: '/rest/PollutantSourceApi/Warning/IsHaveStopTime', //报警暂停标识查询
        GetPointParamsRange: 'rest/PollutantSourceApi/Warning/GetPointParamsRange', //波动范围查询
        StatisPolValueNumsByDGIMN: 'rest/PollutantSourceApi/Warning/StatisPolValueNumsByDGIMN', //密度直方图
        StatisLinearCoefficient: 'rest/PollutantSourceApi/Warning/StatisLinearCoefficient', //相关系数表
        GetAllTypeDataListForModel: 'rest/PollutantSourceApi/Warning/GetAllTypeDataListForModel', //数据图表
        GetPollutantListByDgimn: 'rest/PollutantSourceApi/BaseDataApi/GetPollutantListByDgimn', //污染因子列表
        GetWarningVerifyCheckInfo: 'rest/PollutantSourceApi/Warning/GetWarningVerifyCheckInfo', //核实流程页面
        GetWorkNumsAndFlag: 'rest/PollutantSourceApi/Warning/GetWorkNumsAndFlag', //异常识别工作台显示数量，角色类型

        GetSnapshotData: 'rest/PollutantSourceApi/Warning/GetSnapshotData', //报警图表数据
        UploadFiles: '/rest/PollutantSourceApi/UploadApi/UploadFiles', //报警核实上传图片
        GetWarningVerifyInfor: 'rest/PollutantSourceApi/Warning/GetWarningVerifyInfor', //获取报警核实详情
        InsertWarningVerify: 'rest/PollutantSourceApi/Warning/InsertWarningVerify', //报警核实操作
        GetModelExceptionNumsByPointAuth: 'rest/PollutantSourceApi/Warning/GetModelExceptionNumsByPointAuth', //运维人线索分组列表
        GetModelExceptionNums: 'rest/PollutantSourceApi/Warning/GetModelExceptionNums' //运维人线索分组列表
    },
    ModelAnalysisAectification: { // 模型整改
        GetCheckedRectificationList: '/rest/PollutantSourceApi/Warning/GetCheckedRectificationList', // 整改复合列表
        UpdateCheckedRectification: '/rest/PollutantSourceApi/Warning/UpdateCheckedRectification', // 模型整改
        GetCheckedRectificationApprovals: '/rest/PollutantSourceApi/Warning/GetCheckedRectificationApprovals', // 获取整改复核详情
        CheckedRectification: '/rest/PollutantSourceApi/Warning/CheckedRectification', // 督查人复核
    },
    pOperationApi: {
        KeyParameterVerification: {
            WithdrawQuestionKeyParameter: 'rest/PollutantSourceApi/TaskProcessingApi/WithdrawQuestionKeyParameter', // 关键参数核查 申诉or整改 撤销
            //netcore ✅ GetOperationKeyParameterCount: 'rest/PollutantSourceApi/TaskProcessingApi/GetOperationKeyParameterCount', // 关键参数核查 列表计数器
            GetOperationKeyParameterCount: 'rest/PollutantSourceApi/KeyParameter/GetOperationKeyParameterCount', // 关键参数核查 列表计数器
            //netcore ✅ GetOperationKeyParameterList: 'rest/PollutantSourceApi/TaskProcessingApi/GetOperationKeyParameterList', // 关键参数核查 一级列表
            GetOperationKeyParameterList: 'rest/PollutantSourceApi/KeyParameter/GetOperationKeyParameterList', // 关键参数核查 一级列表
            //netcore ✅ GetOperationKeyParameterDetailList: 'rest/PollutantSourceApi/TaskProcessingApi/GetOperationKeyParameterDetailList', // 关键参数核查 列表详情
            GetOperationKeyParameterDetailList: 'rest/PollutantSourceApi/KeyParameter/GetOperationKeyParameterDetailList', // 关键参数核查 列表详情
            //netcore ✅ AddOrUpdOperationKeyParameter: 'rest/PollutantSourceApi/TaskProcessingApi/AddOrUpdOperationKeyParameter', // 关键参数核查 创建核查记录
            AddOrUpdOperationKeyParameter: 'rest/PollutantSourceApi/KeyParameter/AddOrUpdOperationKeyParameter', // 关键参数核查 创建核查记录
            //netcore ✅ GetKeyParameterCodeList: 'rest/PollutantSourceApi/TaskProcessingApi/GetKeyParameterCodeList', // 关键参数核查 获取核查信息配置信息
            GetKeyParameterCodeList: 'rest/PollutantSourceApi/KeyParameter/GetKeyParameterCodeList', // 关键参数核查 获取核查信息配置信息
            //netcore ✅ DeleteOperationKeyParameter: 'rest/PollutantSourceApi/TaskProcessingApi/DeleteOperationKeyParameter', // 关键参数核查 撤销/删除记录
            DeleteOperationKeyParameter: 'rest/PollutantSourceApi/KeyParameter/DeleteOperationKeyParameter', // 关键参数核查 撤销/删除记录
            //netcore ✅ RetransmissionKeyParameter: 'rest/PollutantSourceApi/TaskProcessingApi/RetransmissionKeyParameter', // 关键参数核查任务转发
            RetransmissionKeyParameter: 'rest/PollutantSourceApi/KeyParameter/RetransmissionKeyParameter', // 关键参数核查任务转发
        },
        WorkBench: {
            GetNoticeMessageInfoList: 'rest/PollutantSourceApi/OperationBasicApi/GetNoticeMessageInfoList', //获取APP通知列表
            GetOperationDocuments: 'rest/PollutantSourceApi/OperationBasicApi/GetOperationDocuments', //获取运维资料库
            GetOperationStatistics: 'rest/PollutantSourceApi/OperationBasicApi/GetOperationStatistics', //获取运维统计
            //netcore ✅ GetHomeTypeCount: 'rest/PollutantSourceApi/OperationBasicApi/GetConsoleTypeCount', //获取工作台各个标签数量
            GetWorkbenchInfo: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetWorkbenchInfo', //获取工作台各个标签数量
            //netcore ✅ GetNoticeContentList: 'rest/PollutantSourceApi/BaseDataApi/GetNoticeContentList' //公告列表
            GetNoticeContentList: 'rest/PollutantSourceApi/NoticeApi/GetNoticeList' //公告列表
        },
        Message: {
            // 消息中心 20220531
            //netcore ✅ GetPushMessageList: 'rest/PollutantSourceApi/OperationBasicApi/GetPushMessageList', // 消息中心
            GetPushMessageList: 'rest/PollutantSourceApi/MessageApi/GetPushMessageList', // 消息中心
            //netcore ✅ GetMessageInfoList: 'rest/PollutantSourceApi/OperationBasicApi/GetMessageInfoList', // 消息中心详情
            GetMessageInfoList: 'rest/PollutantSourceApi/MessageApi/GetMessageInfoList', // 消息中心详情
            //netcore ✅ SetMessageRead: 'rest/PollutantSourceApi/OperationBasicApi/SetMessageRead', // 设置消息已读
            SetMessageRead: 'rest/PollutantSourceApi/MessageApi/SetMessageRead', // 设置消息已读
            //netcore ✅✅ UpdateMessageReadByMsgType: 'rest/PollutantSourceApi/OperationBasicApi/UpdateMessageReadByMsgType', // 设置消息条目已读
            UpdateMessageReadByMsgType: 'rest/PollutantSourceApi/MessageApi/UpdateMessageReadByMsgType', // 设置消息条目已读
            //netcore ✅ GetOperationInfoList: 'rest/PollutantSourceApi/OperationBasicApi/GetOperationInfoList', // 通知运维详情列表 运营到期统计
            GetOperationInfoList: 'rest/PollutantSourceApi/MessageApi/GetOperationExpireRemindList', // 通知运维详情列表 运营到期统计
            //netcore ✅ GetCoefficientMsgInfo: 'rest/PollutantSourceApi/BaseDataApi/GetCoefficientMsgInfo', // 绩效信息详细
            GetCoefficientMsgInfo: 'rest/PollutantSourceApi/MessageApi/GetCoefficientInfo', // 绩效信息详细
            //netcore ✅ GetNotAuditTaskMsgInfo: 'rest/PollutantSourceApi/BaseDataApi/GetNotAuditTaskMsgInfo', // 未审批工单详细
            GetNotAuditTaskMsgInfo: 'rest/PollutantSourceApi/MessageApi/GetNotAuditTaskInfo', // 未审批工单详细
            // 20230807
            //netcore ✅ GetInspectorMessage: 'rest/PollutantSourceApi/TaskFormApi/GetInspectorMessage', // 设施督查整改提醒-详情
            GetInspectorMessage: 'rest/PollutantSourceApi/MessageApi/GetInspectorMessage', // 设施督查整改提醒-详情
            // 20230912
            //netcore ✅✅ UpdateMessageRead: 'rest/PollutantSourceApi/OperationBasicApi/UpdateMessageRead', //更新单条消息已读
            UpdateMessageRead: 'rest/PollutantSourceApi/MessageApi/UpdateMessageRead', //更新单条消息已读
            //20230913 tab message
            //netcore ✅✅ StickyMessage: 'rest/PollutantSourceApi/OperationBasicApi/StickyMessage', // 消息一级列表item置顶接口
            StickyMessage: 'rest/PollutantSourceApi/MessageApi/StickyMessage', // 消息一级列表item置顶接口
            //netcore ✅ DeleteMessageByPushType: 'rest/PollutantSourceApi/OperationBasicApi/DeleteMessageByPushType' // 根据消息类型物理删除一类消息
            DeleteMessageByPushType: 'rest/PollutantSourceApi/MessageApi/DeleteMessageByPushType' // 根据消息类型物理删除一类消息
        },
        Task: {
            //netcore ✅ AddTaskHelpers: 'rest/PollutantSourceApi/TaskProcessingApi/AddTaskHelpers', // 添加协助人
            AddTaskHelpers: 'rest/PollutantSourceApi/OperationWorkbenchApi/AddTaskHelpers', // 添加协助人
            //netcore ✅ DeleteTaskHelpers: 'rest/PollutantSourceApi/TaskProcessingApi/DeleteTaskHelpers', //删除协助人
            DeleteTaskHelpers: 'rest/PollutantSourceApi/OperationWorkbenchApi/DeleteTaskHelpers', //删除协助人
            //netcore ✅ TaskType: 'rest/PollutantSourceApi/UserInfosApi/GetRecordType', //创建任务可选类型
            TaskType: 'rest/PollutantSourceApi/OperationWorkbenchApi/GeteTaskOrderTypeByPollutantType', //创建任务可选类型
            //netcore ✅ PostRetransmission: 'rest/PollutantSourceApi/TaskProcessingApi/PostRetransmission', //任务转发
            PostRetransmission: 'rest/PollutantSourceApi/WorkOrderApi/PostRetransmission', //任务转发
            //netcore ✅ GetOperationsUserList: 'rest/PollutantSourceApi/UserInfosApi/GetOperationsUserList', //转发人查询
            GetOperationsUserList: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetOperationsUserList', //转发人查询
            PartSearch: 'rest/PollutantSourceApi/AutoFormDataApi/GetListPager', //备件搜索
            //netcore ✅ CreatTask: 'rest/PollutantSourceApi/TaskProcessingApi/AddTask', //创建任务
            CreatTask: 'rest/PollutantSourceApi/OperationWorkbenchApi/AddTask', //创建任务
            //netcore ✅ isAlarmRes: 'rest/PollutantSourceApi/TaskProcessingApi/GetPointTaskStatus', //判断报警状态是否响应
            isAlarmRes: 'rest/PollutantSourceApi/OperationWorkbenchApi/JudgeAlarmResponseTaskStatus', //判断报警状态是否响应
            //netcore ✅ GetUnhandleTaskList: 'rest/PollutantSourceApi/OperationBasicApi/GetUnhandleTaskList', //获取待办任务
            GetUnhandleTaskList: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetUnhandleTaskList', //获取待办任务
            //netcore ✅ GetUnhandleTaskTypeList: 'rest/PollutantSourceApi/OperationBasicApi/GetUnhandleTaskTypeList', // 待办任务企业
            GetUnhandleTaskTypeList: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetUnhandleTaskTypeList', // 待办任务企业
            //netcore ✅ TaskRecords: 'rest/PollutantSourceApi/TaskProcessingApi/GetOperationHistoryRecordPageList', //任务记录
            TaskRecords: 'rest/PollutantSourceApi/WorkOrderApi/GetOperationTaskList', //任务记录
            //netcore ✅ GetTaskDetails: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskDetails', //任务详情
            GetTaskDetails: 'rest/PollutantSourceApi/WorkOrderApi/GetTaskDetails', //任务详情
            //netcore ✅ PostTask: 'rest/PollutantSourceApi/TaskProcessingApi/PostTask', //提交任务 结束任务
            PostTask: 'rest/PollutantSourceApi/OperationWorkbenchApi/PostTask', //提交任务 结束任务
            //netcore ✅ TaskSignIn: 'rest/PollutantSourceApi/TaskProcessingApi/PostTaskSignIn', //打卡
            TaskSignIn: 'rest/PollutantSourceApi/OperationWorkbenchApi/PostTaskSignIn', //打卡
            //netcore ✅ RevokeManualTake: 'rest/PollutantSourceApi/TaskProcessingApi/RevokeManualTake', // 撤销手工创建任务
            RevokeManualTake: 'rest/PollutantSourceApi/OperationWorkbenchApi/RevokeManualCreateTake', // 撤销手工创建任务
            //netcore ✅ UpdateTask: 'rest/PollutantSourceApi/TaskProcessingApi/UpdateTask', // 任务结束后，6小时内可以修改任务信息，用于修改处理说明
            UpdateTask: 'rest/PollutantSourceApi/WorkOrderApi/UpdateTaskdescription', // 任务结束后，6小时内可以修改任务信息，用于修改处理说明
            // GetTaskAlarmList:'rest/PollutantSourceApi/MonitorAlarmApi/GetTaskAlarmList', // 任务关联的报警
            //netcore ✅ GetTaskAlarmList: 'rest/PollutantSourceApi/MonitorAlarmApi/GetTaskAlarmListNew' // 任务关联的报警
            GetTaskAlarmList: '/rest/PollutantSourceApi/AlarmVerifyManageApi/GetTaskAlarmListNew' // 任务关联的报警
        },
        Exception: {
            //netcore ✅ GetOverDataType: 'rest/PollutantSourceApi/MonitorAlarmApi/GetOverDataType', //获取 运维人员 超标核实 工艺超标 超标类型获取接口
            GetOverDataType: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetOverDataType', //获取 运维人员 超标核实 工艺超标 超标类型获取接口
            GetOverDataOperation: 'rest/PollutantSourceApi/MonitorAlarmApi/GetOverToExamineOperation', //获取 运维人员 超标核实 可选类型(废气)
            //netcore ✅ OperationVerifyAdd: 'rest/PollutantSourceApi/MonitorAlarmApi/OperationVerifyAdd', // 运维人核实 超标报警
            OperationVerifyAdd: '/rest/PollutantSourceApi/AlarmVerifyManageApi/OperationVerifyAdd', // 运维人核实 超标报警
            //netcore ✅ OpetaionVerifyList: 'rest/PollutantSourceApi/MonitorAlarmApi/OpetaionVerifyList', // 运维人核实 超标报警 的核实记录
            OpetaionVerifyList: 'rest/PollutantSourceApi/AlarmVerifyManageApi/OpetaionVerifyList', // 运维人核实 超标报警 的核实记录

            //netcore ✅ GetTaskInfoByDate: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskInfoByDate', //获取指定日期的各类任务单书、异常任务列表
            GetTaskInfoByDate: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetTaskInfoByDate', //获取指定日期的各类任务单书、异常任务列表
            //netcore ✅ GetMobileCalendarInfo: 'rest/PollutantSourceApi/TaskProcessingApi/GetMobileCalendarInfo', //获取指定月份各类异常信息
            GetMobileCalendarInfo: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetMobileCalendarInfo', //获取指定月份各类异常信息
            //netcore ✅ CreateAndFinishTask: 'rest/PollutantSourceApi/TaskProcessingApi/CreateAndFinishTask' // 3无需处理 2远程处理 处理异常报警和确实报警
            CreateAndFinishTask: '/rest/PollutantSourceApi/OperationWorkbenchApi/CreateAndFinishTask' // 3无需处理 2远程处理 处理异常报警和确实报警
        },
        OperationForm: {
            //netcore ✅ GetStandardGasList: 'rest/PollutantSourceApi/TaskFormApi/GetStandardGasList', // 可以更换标准物质（PartType  1.标气2.标液  ，PartName 存货编码或名称 搜索用） 的列表
            GetStandardGasList: 'rest/PollutantSourceApi/ConsumablesApi/GetStandardGasList', // 可以更换标准物质（PartType  1.标气2.标液  ，PartName 存货编码或名称 搜索用） 的列表

            //netcore ✅  GetStorehouse: 'rest/PollutantSourceApi/SparepartManageApi/GetStorehouse', // 获取仓库名称
            GetSparePartsList: 'rest/PollutantSourceApi/ConsumablesApi/GetSparepartList', // 查询备件列表

            //netcore ✅ MaintainRecordDetail: 'rest/PollutantSourceApi/TaskFormApi/MaintainRecordDetail', //保养记录表单
            MaintainRecordDetail: 'rest/PollutantSourceApi/GasOperationFormApi/GetMaintainRecordList', //保养记录表单
            //netcore ✅ MaintainRecordOpr: 'rest/PollutantSourceApi/TaskFormApi/MaintainRecordOpr', //保养记录新增/修改
            MaintainRecordOpr: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateMaintainRecord', //保养记录新增/修改
            //netcore ✅ MaintainRecordDel: 'rest/PollutantSourceApi/TaskFormApi/MaintainRecordDel', //保养记录删除
            MaintainRecordDel: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteMaintainRecord', //保养记录删除

            //netcore ✅ DeviceExceptionDetail: 'rest/PollutantSourceApi/TaskFormApi/DeviceExceptionDetail', //设备数据异常记录详情
            DeviceExceptionDetail: 'rest/PollutantSourceApi/GasOperationFormApi/GetExceptionRecordList', //设备数据异常记录详情
            //netcore ✅ DeviceExceptionAdd: 'rest/PollutantSourceApi/TaskFormApi/DeviceExceptionAdd', //设备数据异常记录表新增/修改
            DeviceExceptionAdd: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateExceptionRecord', //设备数据异常记录表新增/修改
            //netcore ✅ DeviceExceptionDel: 'rest/PollutantSourceApi/TaskFormApi/DeviceExceptionDel', //设备数据异常记录表删除
            DeviceExceptionDel: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteExceptionRecord', //设备数据异常记录表删除

            //netcore ✅ GetSparePartReplaceRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetSparePartReplaceRecordList', //获取备品更换记录表单
            GetSparePartReplaceRecordList: 'rest/PollutantSourceApi/ConsumableMaterialApi/GetSparePartReplaceRecordList', //获取备品更换记录表单
            //netcore ✅ DeleteSparePartReplaceRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteSparePartReplaceRecord', //删除备品更换记录表单
            DeleteSparePartReplaceRecord: 'rest/PollutantSourceApi/ConsumableMaterialApi/DeleteSparePartReplaceRecord', //删除备品更换记录表单
            //netcore ✅ AddSparePartReplaceRecord: 'rest/PollutantSourceApi/TaskFormApi/AddSparePartReplaceRecord', //添加备品更换记录主表表单
            AddSparePartReplaceRecord: 'rest/PollutantSourceApi/ConsumableMaterialApi/AddOrUpdateSparePartReplaceRecord', //添加备品更换记录主表表单

            AddPatrolRecord: 'rest/PollutantSourceApi/TaskFormApi/AddPatrolRecord', //巡检表单 保存
            DeletePatrolRecordList: 'rest/PollutantSourceApi/TaskFormApi/DeletePatrolRecordList', //巡检表单 删除
            GetPatrolRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetPatrolRecordList', //巡检表单 获取
            RepairRecordOpr: '/rest/PollutantSourceApi/TaskFormApi/RepairRecordOpr', //维修表单 保存
            // RepairRecordDel: '/rest/PollutantSourceApi/TaskFormApi/RepairRecordDel', //维修表单 删除
            //netcore ✅ PostStopCemsOpr: '/rest/PollutantSourceApi/TaskFormApi/PostStopCemsOpr', //停机记录新增/修改
            PostStopCemsOpr: '/rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateShutdownRecord', //停机记录新增/修改
            //netcore ✅ PostStopCemsDel: '/rest/PollutantSourceApi/TaskFormApi/PostStopCemsDel', //停机记录删除
            PostStopCemsDel: '/rest/PollutantSourceApi/GasOperationFormApi/DeleteShutdownRecord', //停机记录删除
            PostStopCemsList: '/rest/PollutantSourceApi/TaskFormApi/PostStopCemsList', //停机记录历史列表
            //netcore ✅ PostStopCemsDetail: '/rest/PollutantSourceApi/TaskFormApi/PostStopCemsDetail', //停机表单内容信息
            PostStopCemsDetail: '/rest/PollutantSourceApi/GasOperationFormApi/GetShutdownRecordList', //停机表单内容信息
            RepairRecordDetail: '/rest/PollutantSourceApi/GasOperationFormApi/GetRepairRecordForPCList', //维修表单 获取
            //netcore ✅ ConsumablesLst: 'rest/PollutantSourceApi/TaskFormApi/GetConsumablesReplaceRecordList', //易耗品记录
            ConsumablesLst: 'rest/PollutantSourceApi/ConsumableMaterialApi/GetConsumablesReplaceRecordList', //易耗品记录
            //netcore ✅ AddConsumables: 'rest/PollutantSourceApi/TaskFormApi/AddFormInfo', //添加易耗品的表单
            AddConsumables: 'rest/PollutantSourceApi/ConsumableMaterialApi/AddOrUpdateConsumablesReplaceRecord', //添加易耗品的表单
            //netcore ✅ DeleteConsumables: 'rest/PollutantSourceApi/TaskFormApi/DeleteConsumablesReplaceRecord', //删除易耗品记录表单
            DeleteConsumables: 'rest/PollutantSourceApi/ConsumableMaterialApi/DeleteConsumablesReplaceRecord', //删除易耗品记录表单
            /**
             * 2022.1.6
             * DType=1 删除主表与子表FormMainID不能为空
             * DType=2 删除子表FormMainID不能为空并且ID不能为空
             * DType=3 删除标气与测试设备列表ID不能为空
             */
            //netcore ✅ DeleteBdRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteBdRecord', //CEMS校验测试表单 删除
            DeleteBdRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteVerificationTestRecord', //CEMS校验测试表单 删除
            //netcore ✅ AddOrUpdateBdRecord: 'rest/PollutantSourceApi/TaskFormApi/AddOrUpdateBdRecord', //CEMS校验测试表单 保存
            AddOrUpdateBdRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateVerificationTestRecord', //CEMS校验测试表单 保存
            //netcore ✅ GetBdRecord: 'rest/PollutantSourceApi/TaskFormApi/GetBdRecord', //CEMS校验测试表单 获取
            GetBdRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetVerificationTestRecordList', //CEMS校验测试表单 获取
            //netcore ✅ GetEquipmentFaultRecord: 'rest/PollutantSourceApi/TaskFormApi/FaultRecordDetail', //故障小时记录
            GetEquipmentFaultRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetFailureHoursRecordList', //故障小时记录
            //netcore ✅ GetFaultRecordparames: 'rest/PollutantSourceApi/TaskFormApi/GetFaultRecordparames', // 获取设备参数类别与异常类别接口
            GetFaultRecordparames: 'rest/PollutantSourceApi/GasOperationFormApi/GetFaultRecordparames', // 获取设备参数类别与异常类别接口
            //netcore ✅ AddEquipmentFaultForm: 'rest/PollutantSourceApi/TaskFormApi/FaultRecordOpr', //故障小时记录添加
            AddEquipmentFaultForm: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateFailureHoursRecord', //故障小时记录添加
            //netcore ✅ DeleteEquipmentFaultForm: 'rest/PollutantSourceApi/TaskFormApi/FaultRecordDel', //删除故障小时记录表
            DeleteEquipmentFaultForm: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteFailureHoursRecord', //删除故障小时记录表

            // GetJzRecord: 'rest/PollutantSourceApi/TaskFormApi/GetJzRecord', // 烟气校准
            GetJzRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetCemsCalibrationRecord', // 烟气校准
            //netcore ✅ DeleteJzRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteJzRecord', // 烟气校准
            DeleteJzRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteCemsCalibrationRecord', // 烟气校准
            //netcore ✅ AddOrUpdateJzRecord: 'rest/PollutantSourceApi/TaskFormApi/AddOrUpdateJzRecord', // 烟气校准
            AddOrUpdateJzRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateCemsCalibrationRecordList', // 烟气校准
            //netcore ✅ GetJzItem: 'rest/PollutantSourceApi/TaskFormApi/GetJzItem', // 烟气校准
            GetJzItem: 'rest/PollutantSourceApi/GasOperationFormApi/GetJzItem', // 烟气校准
            //netcore ✅ DeleteJzItem: 'rest/PollutantSourceApi/TaskFormApi/DeleteJzItem', // 烟气校准 删除子表
            DeleteJzItem: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteJzItem', // 烟气校准 删除子表

            //netcore ✅ AddImageForm: 'rest/PollutantSourceApi/TaskFormApi/AddOperationFormPic', //添加图片表单
            AddImageForm: 'rest/PollutantSourceApi/OperationWorkbenchApi/AddTaskPictureRecord', //添加图片表单
            //netcore ✅ GetStandardGasRepalceRecordList: '/rest/PollutantSourceApi/TaskFormApi/GetStandardGasRepalceRecordList', //获取标气更换记录表单
            GetStandardGasRepalceRecordList: '/rest/PollutantSourceApi/ConsumableMaterialApi/GetStandardGasRepalceRecordList', //获取标气更换记录表单
            //netcore ✅ AddStandardGasRepalceRecord: '/rest/PollutantSourceApi/TaskFormApi/AddStandardGasRepalceRecord', //添加标气更换记录主表表单
            AddStandardGasRepalceRecord: '/rest/PollutantSourceApi/ConsumableMaterialApi/AddOrUpdateStandardGasRepalceRecord', //添加标气更换记录主表表单
            //netcore ✅ DeleteStandardGasRepalceRecord: '/rest/PollutantSourceApi/TaskFormApi/DeleteStandardGasRepalceRecord', //删除标气更换记录表单
            DeleteStandardGasRepalceRecord: '/rest/PollutantSourceApi/ConsumableMaterialApi/DeleteStandardGasRepalceRecord', //删除标气更换记录表单
            //netcore ✅ GetImageForm: 'rest/PollutantSourceApi/TaskFormApi/GetOperationFormPicList', //获取运维表单照片（废水、扬尘、VOC)
            GetImageForm: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetTaskPictureRecord', //获取运维表单照片（废水、扬尘、VOC)
            //netcore ✅ DeleteImageForm: 'rest/PollutantSourceApi/TaskFormApi/DeleteOperationFormPic', //删除运维表单照片（废水、扬尘、VOC)
            DeleteImageForm: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteOperationRecordPic', //删除运维表单照片（废水、扬尘、VOC)
            BaseFacilitiesInfo: 'rest/PollutantSourceApi/BaseDataApi/GetDGIMNBase', //基础设施设置信息

            //netcore ✅ GetStandardLiquidRepalceRecordList: '/rest/PollutantSourceApi/TaskFormApi/GetStandardLiquidRepalceRecordList', //获取试剂更换记录表单（污水）
            GetStandardLiquidRepalceRecordList: '/rest/PollutantSourceApi/ConsumableMaterialApi/GetReagentRepalceRecordList', //获取试剂更换记录表单（污水）
            //netcore ✅ AddStandardLiquidRepalceRecord: '/rest/PollutantSourceApi/TaskFormApi/AddStandardLiquidRepalceRecord', //添加试剂更换记录主表表单（污水）
            AddStandardLiquidRepalceRecord: '/rest/PollutantSourceApi/ConsumableMaterialApi/AddReagentRepalceRecord', //添加试剂更换记录主表表单（污水）
            //netcore ✅ DeleteStandardLiquidsRepalceRecord: '/rest/PollutantSourceApi/TaskFormApi/DeleteStandardLiquidsRepalceRecord', //删除试剂更换记录表单（污水）
            DeleteStandardLiquidsRepalceRecord: '/rest/PollutantSourceApi/ConsumableMaterialApi/DeleteReagentRepalceRecord', //删除试剂更换记录表单（污水）
            GetMonitorPointEquipmentParameters: 'rest/PollutantSourceApi/TaskFormApi/GetMonitorPointEquipmentParameters', //（水质实际更换不使用此接口） 试剂更换时，获取设备列表 ?DGIMN={DGIMN}

            // 配合检查
            //netcore ✅ GetCooperationInspectionRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetCooperationInspectionRecordList', //获取配合检查记录单列表
            GetCooperationInspectionRecordList: 'rest/PollutantSourceApi/GasOperationFormApi/GetCooperationInspectionRecordForPCList', //获取配合检查记录单列表
            //netcore ✅ AddCooperationInspectionRecord: 'rest/PollutantSourceApi/TaskFormApi/AddCooperationInspectionRecord', // 添加配合检查记录单
            AddCooperationInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddCooperationInspectionRecord', // 添加配合检查记录单
            //netcore ✅ DeleteCooperationInspectionRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteCooperationInspectionRecord', // 删除配合检查记录单
            DeleteCooperationInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteCooperationInspectionRecord', // 删除配合检查记录单
            GetCooperationInsParametersById: 'rest/PollutantSourceApi/TaskFormApi/GetCooperationInsParametersById', // {ID} 获取配合检查记录一些参数（未使用）
            //netcore ✅ GetCooperationInsParameters: 'rest/PollutantSourceApi/TaskFormApi/GetCooperationInsParameters', // 配合检查 可选项
            GetCooperationInsParameters: 'rest/PollutantSourceApi/GasOperationFormApi/GetCooperationInsParametersInfo', // 配合检查 可选项

            /**
             * 2021.12.14
             * 数据一致性（实时数据）记录
             */
            //netcore ✅ GetDataConsistencyRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetDataConsistencyRecordList', // 数据一致性（实时数据）记录 获取数据
            GetDataConsistencyRecordList: 'rest/PollutantSourceApi/GasOperationFormApi/GetDataConsistencyRecordList', // 数据一致性（实时数据）记录 获取数据
            //netcore ✅ AddDataConsistencyRecord: 'rest/PollutantSourceApi/TaskFormApi/AddDataConsistencyRecord', // 数据一致性（实时数据）记录 添加单条
            AddDataConsistencyRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateDataConsistencyRecord', // 数据一致性（实时数据）记录 添加单条
            //netcore ✅ UpdateConsistencyTime: 'rest/PollutantSourceApi/TaskFormApi/UpdateConsistencyTime', // 数据一致性（实时数据）记录 修改日期
            UpdateConsistencyTime: 'rest/PollutantSourceApi/GasOperationFormApi/UpdateDataConsistencyTime', // 数据一致性（实时数据）记录 修改日期
            //netcore ✅ DeleteDataConsistencyRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteDataConsistencyRecord', //  数据一致性（实时数据）记录 删除表单
            DeleteDataConsistencyRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteDataConsistencyRecord', //  数据一致性（实时数据）记录 删除表单

            //netcore ✅ GetDataConsistencyRecordNewList: 'rest/PollutantSourceApi/TaskFormApi/GetDataConsistencyRecordNewList', // 数据一致性（小时与日数据）记录 获取数据
            GetDataConsistencyRecordNewList: 'rest/PollutantSourceApi/GasOperationFormApi/GetHourDayDataConsistencyRecordList', // 数据一致性（小时与日数据）记录 获取数据
            //netcore ✅ AddDataConsistencyRecordNew: 'rest/PollutantSourceApi/TaskFormApi/AddDataConsistencyRecordNew', // 数据一致性（小时与日数据）记录 添加单条
            AddDataConsistencyRecordNew: 'rest/PollutantSourceApi/GasOperationFormApi/AddHourDayDataConsistencyRecord', // 数据一致性（小时与日数据）记录 添加单条

            /**
             * 2021.12.23
             * 维修记录
             */
            //netcore ✅ NewRepairRecordDetail: 'rest/PollutantSourceApi/TaskFormApi/RepairRecordDetail', // 维修记录详情
            NewRepairRecordDetail: 'rest/PollutantSourceApi/GasOperationFormApi/GetRepairRecordForPCList', // 维修记录详情
            //netcore ✅ GetRepairRecordParames: 'rest/PollutantSourceApi/TaskFormApi/GetRepairRecordParames', // 维修记录 相关参数
            GetRepairRecordParames: 'rest/PollutantSourceApi/GasOperationFormApi/GetRepairRecordParamesInfo', // 维修记录 相关参数
            //netcore ✅ RepairRecordOpr: 'rest/PollutantSourceApi/TaskFormApi/RepairRecordOpr', // 维修记录新增/修改
            RepairRecordOpr: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateRepairRecord', // 维修记录新增/修改
            //netcore ✅ RepairRecordDel: 'rest/PollutantSourceApi/TaskFormApi/RepairRecordDel', // 维修记录删除
            RepairRecordDel: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteRepairRecord', // 维修记录删除

            /**
             * 2021.12.0
             * 上月委托第三方检测次数
             */
            //netcore ✅ AddDetectionTimesRecord: 'rest/PollutantSourceApi/TaskFormApi/AddDetectionTimesRecord', // 添加、修改上月委托第三方检测次数
            AddDetectionTimesRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateThirdPartyMonitoringRecord', // 添加、修改上月委托第三方检测次数
            //netcore ✅ DeleteDetectionTimesRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteDetectionTimesRecord', // 删除上月委托第三方检测次数
            DeleteDetectionTimesRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteThirdPartyMonitoringRecord', // 删除上月委托第三方检测次数
            //netcore ✅ GetDetectionTimesRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetDetectionTimesRecordList', // 上月委托第三方检测次数列表
            GetDetectionTimesRecordList: 'rest/PollutantSourceApi/GasOperationFormApi/GetThirdPartyMonitoringRecordList', // 上月委托第三方检测次数列表

            /**
             * 2022.1.5
             * CEMS校验测试表单
             * 增加 标气记录/测试设备记录
             * 1是标气2是测试设备
             */
            //netcore ✅ AddorUpdateCalibrationTestParams: 'rest/PollutantSourceApi/TaskFormApi/AddorUpdateCalibrationTestParams', //
            AddorUpdateCalibrationTestParams: 'rest/PollutantSourceApi/GasOperationFormApi/AddorUpdateVerificationTestParams', //
            /**
             * 2022.1.6
             * 废水校准表单接口
             */
            //netcore ✅ GetWaterCalibrationRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetWaterCalibrationRecordList', // 获取废水校准记录列表
            GetWaterCalibrationRecordList: 'rest/PollutantSourceApi/WaterOperationFormApi/GetWaterCalibrationRecordList', // 获取废水校准记录列表
            //netcore ✅ AddWaterCalibrationRecord: 'rest/PollutantSourceApi/TaskFormApi/AddWaterCalibrationRecord', // 添加废水记录表
            AddWaterCalibrationRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/AddOrUpdateWaterCalibrationRecord', // 添加废水记录表
            /**
             * DType=1删除主表FormMainID不能为空,DType=2删除子表FormMainID不能为空ID不能为空
             */
            //netcore ✅ DeleteWaterCalibrationRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteWaterCalibrationRecord', // 删除废水校准记录主表或子表
            DeleteWaterCalibrationRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/DeleteWaterCalibrationRecord', // 删除废水校准记录主表或子表

            /**
             * 2022.1.20
             * 标准溶液核查接口
             */
            //netcore ✅ GetWaterCheckRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetWaterCheckRecordList', // 标准溶液核查记录列表
            GetWaterCheckRecordList: 'rest/PollutantSourceApi/WaterOperationFormApi/GetWaterCheckRecordList', // 标准溶液核查记录列表
            //netcore ✅ AddWaterCheckRecordRecord: 'rest/PollutantSourceApi/TaskFormApi/AddWaterCheckRecordRecord', // 添加或修改标准溶液核查记录
            AddWaterCheckRecordRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/AddWaterCheckRecordRecord', // 添加或修改标准溶液核查记录
            //netcore ✅ DeleteWaterCheckRecordRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteWaterCheckRecordRecord', // 删除标准溶液核查记录
            DeleteWaterCheckRecordRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/DeleteWaterCheckRecordRecord', // 删除标准溶液核查记录

            /**
             * 2022.1.21
             * 废水参数变动
             * 设备参数核对记录
             */
            //netcore ✅ GetWaterParametersChangeRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetWaterParametersChangeRecordList', // 废水参数变动表单列表
            GetWaterParametersChangeRecordList: 'rest/PollutantSourceApi/WaterOperationFormApi/GetWaterParametersChangeRecordList', // 废水参数变动表单列表
            //netcore ✅ AddWaterParametersChangeRecord: 'rest/PollutantSourceApi/TaskFormApi/AddWaterParametersChangeRecord', // 添加或修改废水参数变动表单
            AddWaterParametersChangeRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/AddWaterParametersChangeRecord', // 添加或修改废水参数变动表单
            //netcore ✅ DeleteWaterParametersChangeRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteWaterParametersChangeRecord', // 删除废水参数变动记录
            DeleteWaterParametersChangeRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/DeleteWaterParametersChangeRecord', // 删除废水参数变动记录

            /**
             * 2022.1.23
             * 废气参数变动接口
             */
            //netcore ✅ GetGasParametersChangeRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetGasParametersChangeRecordList', // 废气参数变动表单列
            GetGasParametersChangeRecordList: 'rest/PollutantSourceApi/GasOperationFormApi/GetGasParametersChangeRecordList', // 废气参数变动表单列
            //netcore ✅ AddGasParametersChangeRecord: 'rest/PollutantSourceApi/TaskFormApi/AddGasParametersChangeRecord', // 添加或修改废气参数变动表单列表
            AddGasParametersChangeRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateGasParametersChangeRecord', // 添加或修改废气参数变动表单列表
            //netcore ✅ DeleteGasParametersChangeRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteGasParametersChangeRecord', // 删除废气参数变动记录
            DeleteGasParametersChangeRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteGasParametersChangeRecord', // 删除废气参数变动记录

            /**
             * 2022.1.25
             * 实际水样比对试验结果记录表
             */
            //netcore ✅ GetWaterComparisonTestRecordList: 'rest/PollutantSourceApi/TaskFormApi/GetWaterComparisonTestRecordList', // 实际水样比对试验结果记录表列表
            GetWaterComparisonTestRecordList: 'rest/PollutantSourceApi/WaterOperationFormApi/GetWaterComparisonTestRecordList', // 实际水样比对试验结果记录表列表
            //netcore ✅ AddWaterComparisonTestRecord: 'rest/PollutantSourceApi/TaskFormApi/AddWaterComparisonTestRecord', // 添加或修改实际水样比对试验结果记录表
            AddWaterComparisonTestRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/AddWaterComparisonTestRecord', // 添加或修改实际水样比对试验结果记录表
            //netcore ✅ DeleteWaterComparisonTestRecord: 'rest/PollutantSourceApi/TaskFormApi/DeleteWaterComparisonTestRecord', // 删除实际水样比对试验结果记录表
            DeleteWaterComparisonTestRecord: 'rest/PollutantSourceApi/WaterOperationFormApi/DeleteWaterComparisonTestRecord', // 删除实际水样比对试验结果记录表

            /**
             * 2022.2.14
             * 实际水样比对试验结果记录表
             */
            //netcore ✅ ✅ ✅ AddFaultFeedback: 'rest/PollutantSourceApi/TaskFormApi/AddFaultFeedback', // 添加或修改设备故障上报
            AddFaultFeedback: 'rest/PollutantSourceApi/EquipmentFailure/AddOrUpdateEquipmentFaultFeedback', // 添加或修改设备故障上报
            //netcore ✅ ✅ ✅ GetFaultFeedbackList: 'rest/PollutantSourceApi/TaskFormApi/GetFaultFeedbackList', // 设备故障反馈列表与详情
            GetFaultFeedbackList: 'rest/PollutantSourceApi/EquipmentFailure/GetEquipmentFaultFeedbackList', // 设备故障反馈列表与详情
            //netcore ✅ ✅ ✅ GetFaultFeedbackParames: 'rest/PollutantSourceApi/TaskFormApi/GetFaultFeedbackParames', // 获取故障单元模块
            GetFaultFeedbackParames: 'rest/PollutantSourceApi/EquipmentFailure/GetFaultFeedbackParamesInfo', // 获取故障单元模块
            //netcore ✅ ✅ ✅ DeleteFaultFeedback: 'rest/PollutantSourceApi/TaskFormApi/DeleteFaultFeedback', // 获取故障单元模块
            DeleteFaultFeedback: 'rest/PollutantSourceApi/EquipmentFailure/DeleteEquipmentFaultFeedback', // 获取故障单元模块

            /**
             * 2022.3.24
             * 督查记录
             */
            //netcore ✅ GetRemoteInspectorList: 'rest/PollutantSourceApi/TaskProcessingApi/GetRemoteInspectorList' // 督查记录 列表
            GetRemoteInspectorList: 'rest/PollutantSourceApi/KeyParameterApi/GetKeyParameterCheckList' // 督查记录 列表
        },
        /**
         * 2022.11.30
         * 督查整改
         */
        supervision: {
            //netcore ✅ GetInspectorRectificationList: 'rest/PollutantSourceApi/TaskFormApi/GetInspectorRectificationList', // 手机端督察整改列表
            GetInspectorRectificationList: 'rest/PollutantSourceApi/SystemFacilityVerification/GetInspectorRectificationList', // 手机端督察整改列表
            //netcore ✅ GetInspectorRectificationInfoList: 'rest/PollutantSourceApi/TaskFormApi/GetInspectorRectificationInfoList', // 手机端督察整改详情
            GetInspectorRectificationInfoList: 'rest/PollutantSourceApi/SystemFacilityVerification/GetInspectorRectificationInfoList', // 手机端督察整改详情
            // UpdateInspectorRectificationInfo: 'rest/PollutantSourceApi/TaskFormApi/UpdateInspectorRectificationInfo', // 手机端督察整改添加
            UpdateInspectorRectificationInfo: 'rest/PollutantSourceApi/SystemFacilityVerification/UpdateInspectorRectificationInfo', // 手机端督察整改添加
            //netcore ✅ AppealInspectorRectificationInfo: 'rest/PollutantSourceApi/TaskFormApi/AppealInspectorRectificationInfo', // 手机端督察整改 申诉
            AppealInspectorRectificationInfo: '/rest/PollutantSourceApi/SystemFacilityVerification/AppealInspectorRectificationInfo', // 手机端督察整改 申诉
            //netcore ✅ RevokeInspectorRectificationInfo: 'rest/PollutantSourceApi/TaskFormApi/RevokeInspectorRectificationInfo', // 手机端督察整改 撤回
            RevokeInspectorRectificationInfo: '/rest/PollutantSourceApi/SystemFacilityVerification/RevokeInspectorRectificationInfo', // 手机端督察整改 撤回
            //netcore ✅ GetInspectorRectificationNum: 'rest/PollutantSourceApi/TaskFormApi/GetInspectorRectificationNum', // 手机端督察整改 计数器
            GetInspectorRectificationNum: 'rest/PollutantSourceApi/SystemFacilityVerification/GetInspectorRectificationNum', // 手机端督察整改 计数器
        },
        /**
         * 2023.5.5
         * 宝武接口
         */
        BWApi: {
            BWWebService: 'rest/PollutantSourceApi/OperationHomeApi/BWWebService' //
        },
        /**
         * 2023.09.14
         * 成套接口
         */
        CTApi: {
            UpdateServiceDispatch: '/rest/PollutantSourceApi/CTBaseDataApi/UpdateServiceDispatch', // 成套任务完成

            GetCTSignInProject: '/rest/PollutantSourceApi/CTBaseDataApi/GetCTSignInProject', // 获取当前登录人今天已签到未签退的签到信息
            CTSignIn: '/rest/PollutantSourceApi/CTBaseDataApi/CTSignIn', // 签到接口
            GetCTSignInHistoryList: '/rest/PollutantSourceApi/CTBaseDataApi/GetCTSignInHistoryList', // 签到统计
            GetCheckInProjectList: '/rest/PollutantSourceApi/CTBaseDataApi/GetCheckInProjectList', // 签到获取点位列表

            GetProjectEntPointSysModel: '/rest/PollutantSourceApi/CTBaseDataApi/GetProjectEntPointSysModel',// 获取派单对应的企业监测点系统型号 
            UploadFiles: '/rest/PollutantSourceApi/CTBaseDataApi/UploadFiles',// 上传图片
            DeleteAttach: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteAttach', // 删除图片

            GetServiceDispatch: '/rest/PollutantSourceApi/CTBaseDataApi/GetServiceDispatch', // 成套待办
            GetServiceDispatchTypeAndRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetServiceDispatchTypeAndRecord', // 获取派单服务类型与表单类型

            AddAcceptanceServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddAcceptanceServiceRecord', // 成套任务提交       验收服务报告
            GetAcceptanceServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetAcceptanceServiceRecord', // 获取验收服务报告列表或者实体 验收服务报告
            DeleteAcceptanceServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteAcceptanceServiceRecord', //  删除验收服务报告 验收服务报告

            AddRepairRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddRepairRecord', // 成套任务提交     维修记录添加
            GetRepairRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetRepairRecord', // 获取验收服务报告列表或者实体
            DeleteRepairRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteRepairRecord', //  删除验收服务报告
            GetRepairRecordParames: '/rest/PollutantSourceApi/CTBaseDataApi/GetRepairRecordParames',
            GetProjectEntPointSysModel: 'rest/PollutantSourceApi/CTBaseDataApi/GetProjectEntPointSysModel',

            AddCooperateRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddCooperateRecord', // 成套任务提交     配合检查记录添加
            GetCooperateRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetCooperateRecord', // 获取验收服务报告列表或者实体
            DeleteCooperateRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteCooperateRecord', //  删除验收服务报告
            GetCooperationInsParameters: '/rest/PollutantSourceApi/CTBaseDataApi/GetCooperationInsParameters',

            AddWorkRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddWorkRecord', // 工作记录 添加
            DeleteWorkRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteWorkRecord', // 工作记录 删除
            GetWorkRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetWorkRecord', // 工作记录 获取

            // 现场勘查信息，验货单，项目交接单，安装报告，72小时调试检测，比对监测报告，验收资料
            AddPublicRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddPublicRecord', // 添加
            DeletePublicRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeletePublicRecord', // 删除
            GetPublicRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetPublicRecord', // 获取信息

            // 安装照片
            AddInstallationPhotosRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddInstallationPhotosRecord', // 添加或修改安装照片
            DeleteInstallationPhotosRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteInstallationPhotosRecord', // 删除安装照片
            GetInstallationPhotosRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetInstallationPhotosRecord', // 获取安装照片列表或者实体
            GetInstallationItemsList: '/rest/PollutantSourceApi/CTBaseDataApi/GetInstallationItemsList', // 安装照片表单下项目

            // 设置参数照片
            AddParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddParameterSettingsPhotoRecord', // 添加接口
            DeleteParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteParameterSettingsPhotoRecord', // 删除接口
            GetParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetParameterSettingsPhotoRecord', // 获取安装照片列表或者实体
        }
    },
    gridOperation: {
        GetPointLists: 'rest/AtmosphereApi/PointAndData/GetPointLists'
    }
};
