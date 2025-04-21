/**
 * 全局api
 * liz
 * 2016.12.19
 */
export default api = {
    /*用户信息*/
    author: {
        GetEnterpriseByAuth: 'rest/PollutantSourceApi/LoginApi/ValidateAuthorCode', //验证授权码，企业用户获取企业服务器配置
        login: 'rest/AtmosphericCenterStation/Author/IsLogins', //中心站登录
        operationLogin: 'rest/PollutantSourceApi/PAuthor/IsLoginsMobile', //运维登录
        surfaceWaterApiLogin: 'rest/SurfaceWaterApi/WAuthor/IsLoginsMobile',
        gridLogin: 'rest/AtmosphereApi/GridAuthor/IsLogins', //网格化登录
        gridAppSetting: 'AppConfig/mianyang/app_config.json',
        gridMapSetting: 'AppConfig/mianyang//map_line.json'
    },

    //网格化
    gridmap: {
        GetExceptUnFeedBackThree: '/rest/AtmosphereApi/NewAlarmGridData/GetExceptUnFeedBackThree', //获取报警信息，通过参数控制反馈情况筛选
        GetExceptUnFeedBackOne: '/rest/AtmosphereApi/NewAlarmGridData/GetExceptUnFeedBackOne', //获取一级二级未反馈报警-列表 获取今日报警
        statistica: '/rest/AtmosphereApi/NewAlarmGridData/GetWarningPiesPhone', //报警统计数据
        FeedbackList: '/rest/AtmosphereApi/NewAlarmGridData/GetExceptFeedBack', //报警已反馈
        gridMapData: 'rest/AtmosphereApi/PointAndData/GetPointAllList', //获取地图数据
        gridPointDetails: 'rest/AtmosphereApi/Data/GetPointAQIData', //站点详情的数据
        gridPointDetailsBasw: 'rest/AtmosphereApi/PointAndData/GetOnePoint', //站点详情的数据
        GetCheckEarlyWarningInfo: '/rest/AtmosphereApi/NewAlarmGridData/GetOneFeedBack', //获取反馈单子
        GetAlarmPollutiontype: '/rest/AtmosphereApi/NewAlarmGridData/GetEarlyWarningPollutiontype', //查询反馈可选污染因素
        Associated: '/rest/AtmosphereApi/NewAlarmGridData/AlarmFeedbankRelation', //关联反馈单子
        uploadimage: '/rest/AtmosphereApi/UploadImage/UploadImage', //图片上传
        editCommit: '/rest/AtmosphereApi/PointAndData/EditPoints', //信息编辑提交
        AddEarlyWarningFeedback: '/rest/AtmosphereApi/NewAlarmGridData/AddExceptFeedbackNew', //反馈提交全部
        ResetPwd: '/rest/AtmosphereApi/GridAuthor/ResetPwd' //修改密码
    },
    //视频
    video: {
        getYsyToken: '/rest/AtmosphereApi/Ysy/GetToken' //获取萤石云token
    },
    //网格化
    gridAccount: {
        regeCode: 'https://restapi.amap.com/v3/geocode/regeo', //逆地理编码
        siteAcquisition: 'rest/AtmosphereApi/PointAndData/GetPointLists', //站点采集列表
        siteThreeRegion: 'rest/AtmosphereApi/Region/GetRegionThree', //编辑站点获取三级区域
        editCommit: 'rest/AtmosphereApi/PointAndData/EditPoints', //信息编辑提交
        realtime: 'rest/AtmosphereApi/RealTime/GetRealTimeDataTop', //编辑站点实时数据
        cMN: 'rest/AtmosphereApi/SiteRelation/EditsceneMNAddSystemAndSceneAll', // 修改MN
        delPhoto: 'rest/AtmosphereApi/UploadImage/DelOnePhoto', //删除八方位图片
        uploadimage: 'rest/AtmosphereApi/UploadImage/UploadImage', //图片上传
        GetreporTypeList: '/rest/AtmosphereApi/UploadImage/GetreporTypeList', //获取报告类型
        Getreportlist: '/rest/AtmosphereApi/UploadImage/Getreportlist', //报告列表
        GetLastReport: 'rest/AtmosphereApi/UploadImage/GetLastReport' //获取最新报告
    },
    //网格化排名
    gridRank: {
        GetPointAQIRankData: 'rest/AtmosphereApi/Data/GetPointAQIData', //站点排名
        GetCityData: 'rest/AtmosphereApi/Data/GetCityData', //区域 小时 日均 月均
        GetPointList: 'rest/AtmosphereApi/PointAndData/GetPointList' //站点搜索
    },
    //水质相关
    waterhome: {
        HomeData: 'rest/SurfaceWaterApi/WRealTime/AppGetRealTimeDataList', //水质首页数据
        //netcore ✅ GetUnclaimedTaskList: 'rest/PollutantSourceApi/TaskProcessingApi/GetUnclaimedTaskList', // 获取待领取列表
        GetUnclaimedTaskList: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetUnclaimedTaskList', // 获取待领取列表
        //netcore ✅ GetUnclaimedTaskCount: 'rest/PollutantSourceApi/TaskProcessingApi/GetUnclaimedTaskCount', // 待领取分类计数
        GetUnclaimedTaskCount: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetUnclaimedTaskCount', // 待领取分类计数
        //netcore ✅ GetReceivingRecordList: 'rest/PollutantSourceApi/TaskProcessingApi/GetReceivingRecordList', // 获取待领取记录
        GetReceivingRecordList: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetReceivingRecordList', // 获取待领取记录
        //netcore ✅ ReceiveTask: 'rest/PollutantSourceApi/TaskProcessingApi/ReceiveTask', // 领取任务/弃领任务
        ReceiveTask: 'rest/PollutantSourceApi/OperationWorkbenchApi/ReceiveTask', // 领取任务/弃领任务
        GetOperationPhoneExpirePointList: 'rest/PollutantSourceApi/BaseDataApi/GetOperationPhoneExpirePointList', // 运维提醒分析
        //netcore ✅ GetCalibrationTaskStatus: 'rest/PollutantSourceApi/TaskFormApi/GetCalibrationTaskStatus' // 判断站点是否可以创建校准任务
        GetCalibrationTaskStatus: 'rest/PollutantSourceApi/OperationWorkbenchApi/JudgeCalibrationTaskStatus' // 判断站点是否可以创建校准任务
    },
    //预警
    wateralarm: {
        AlarmData: 'rest/SurfaceWaterApi/WExceptionData/GetExceptionProcessingData', //水质首页数据
        AlarmDetails: 'rest/SurfaceWaterApi/WExceptionData/AppGetExceptionProcessingDetails' //预警详情
    },

    /*水质断面*/
    wPointDetails: {
        GetValleyTree: 'rest/SurfaceWaterApi/WTree/GetValleyTree', //获取流域树
        GetPoint: 'rest/SurfaceWaterApi/WPointAndData/GetPoint', //断面信息
        AppGetRealTimeByMN: 'rest/SurfaceWaterApi/WRealTime/AppGetRealTimeByMN', //断面实时状态
        AppGetHourData: 'rest/SurfaceWaterApi/WHour/AppGetHourData', //断面详情
        AppMultiplePointData: 'rest/SurfaceWaterApi/WHour/AppMultiplePointData', //多断面对比
        GetExceptionProcessingData: 'rest/SurfaceWaterApi/WExceptionData/GetExceptionProcessingData' //重要预警
    },

    //水质审核
    waterAudit: {
        getAuditList: 'rest/SurfaceWaterApi/WAuditData/AppAuditDataParticulars', //审核列表
        auditOperation: 'rest/SurfaceWaterApi/WAuditData/AppEditAuditData', //审核操作
        getAuditDetail: 'rest/SurfaceWaterApi/WAuditData/AppAuditDataparticularss' //审核详情
    },

    //运维个人中心
    operationaccount: {
        ChangePass: 'rest/PollutantSourceApi/PAuthor/ResetPwd', //修改密码
        //netcore ✅ AddClockInLog: 'rest/PollutantSourceApi/BaseDataApi/AddClockInLog' // 服务端记录日志
        AddClockInLog: 'rest/PollutantSourceApi/OperationWorkbenchApi/AddSignInLog' // 服务端记录日志
    },

    /*运维任务*/
    operationaltasks: {
        TaskType: 'rest/PollutantSourceApi/PTask/GetTaskContentType', //任务的类型
        TodoTask: 'rest/PollutantSourceApi/PTask/GetTaskListByApp', //代办
        AbnormalDataTask: 'rest/PollutantSourceApi/PTask/GetAbnormalTaskList', //异常任务列表
        Home: 'rest/PollutantSourceApi/PTask/GetIndexNoticeNum', //首页数据
        EnterpriseInfo: 'rest/PollutantSourceApi/PTask/GetEntAndPoint', //获取运维的企业的信息
        GetEntAndPointNameByMN: 'rest/PollutantSourceApi/PTask/GetEntAndPointNameByMN', //通过MN查询企业信息
        TaskApply: 'rest/PollutantSourceApi/PTask/InsertApplication', //任务申请
        GetNoticeList: 'rest/PollutantSourceApi/PTask/GetNoticeList', //获取通知消息
        GetTaskDetails: 'rest/PollutantSourceApi/PTask/GetTaskDetails', //获取运维任务详情
        UpdateTask: 'rest/PollutantSourceApi/PTask/UpdateTask', //提交运维任务
        UploadImage: 'rest/PollutantSourceApi/PUploadImage/FTPUploadImage', //上传图片
        DeleteImage: 'rest/PollutantSourceApi/PUploadImage/DeleteImage', //删除图片
        GetPersonGroup: 'rest/PollutantSourceApi/PTask/GetPersonGroup', //获取人员信息（带部门）
        PostRetransmission: 'rest/PollutantSourceApi/PTask/PostRetransmission', //任务转发(手机APP接口)
        GetFactoryPunchCard: 'rest/PollutantSourceApi/PTask/GetFactoryPunchCard', //打卡列表(手机APP接口)
        PostFactoryPunchCard: 'rest/PollutantSourceApi/PTask/PostFactoryPunchCard', //厂区打卡(手机APP接口)

        GetOperationCycleByMonth: 'rest/PollutantSourceApi/PProject/GetOperationCycleByMonth', //日历请求的数据调用此接口 运维 到期统计
        GetOperationCycleByDay: 'rest/PollutantSourceApi/PProject/GetOperationCycleByDay', // 查看一天运维合同到期统计

        GetStandardGasReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/GetStandardGasReplaceRecord', //获取标气更换记录表单
        AddStandardGasReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/AddStandardGasReplaceRecord', //添加标气更换记录主表表单
        DeleteStandardGasReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/DeleteStandardGasReplaceRecord', //删除标气更换记录表单
        GetStandardGasReplaceHistoryList: 'rest/PollutantSourceApi/PTaskForm/GetStandardGasReplaceHistoryList', //获取标气表单历史纪录接口
        GetReagentReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/GetReagentReplaceRecord', //获取试剂更换记录表单
        AddReagentReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/AddReagentReplaceRecord', //添加试剂更换记录主表表单
        DeleteReagentReplaceRecord: 'rest/PollutantSourceApi/PTaskForm/DeleteReagentReplaceRecord', //删除试剂更换记录表单
        GetReagentReplaceHistoryList: 'rest/PollutantSourceApi/PTaskForm/GetReagentReplaceHistoryList', //获取试剂表单历史纪录接口
        GetTaskRecordList: 'rest/PollutantSourceApi/PTask/GetTaskRecordList', //任务记录
        ConsumablesLst: 'rest/PollutantSourceApi/PTaskForm/GetConsumablesReplaceRecord', //易耗品记录
        AddConsumables: 'rest/PollutantSourceApi/PTaskForm/AddConsumablesReplaceRecord', //添加易耗品的表单
        DeleteConsumables: 'rest/PollutantSourceApi/PTaskForm/DeleteConsumablesReplaceRecord', //删除易耗品记录表单
        SparePartsLst: 'rest/PollutantSourceApi/PTaskForm/GetSparePartReplaceRecord', //备件表单记录
        AddSpareParts: 'rest/PollutantSourceApi/PTaskForm/AddSparePartRecord', //添加备件的表单
        DeleteSpareParts: 'rest/PollutantSourceApi/PTaskForm/DeleteSparePartReplaceRecord' //删除备件记录表单
    },
    /*审批*/
    approval: {
        // pending: 'rest/PollutantSourceApi/PTask/GetTaskListRight', //待审批
        //netcore ✅ pending: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskListRight', //待审批
        pending: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetApprovedTaskList', //待审批
        // ExamApplication: 'rest/PollutantSourceApi/PTask/ExamApplication', //对任务申请进行审核
        //netcore ✅ ExamApplication: 'rest/PollutantSourceApi/TaskProcessingApi/ExamApplication', //对任务申请进行审核
        ExamApplication: 'rest/PollutantSourceApi/OperationWorkbenchApi/AuditTask', //对任务申请进行审核
        // GetTaskListRightByTaskID: 'rest/PollutantSourceApi/PTask/GetTaskListRightByTaskID' //获取单个任务的审批详情
        //netcore ✅ GetTaskListRightByTaskID: 'rest/PollutantSourceApi/TaskProcessingApi/GetTaskListRightByTaskID' //获取单个任务的审批详情
        GetTaskListRightByTaskID: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetTaskAuditDetails' //获取单个任务的审批详情
    },

    //大气个人中心
    airproaccount: {
        ChangePass: 'rest/AtmosphericCenterStation/Author/UpdatePwd', //修改密码
        GetAlarmRecordList: 'rest/AtmosphericCenterStation/AlarmRecord/GetAlarmRecordList' //报警信息
    },
    /*大气系统配置*/
    system: {
        GetMobileConfig: 'rest/AtmosphericCenterStation/Config/GetMobileConfig',
        GetCommonPointList: 'rest/AtmosphericCenterStation/Cod/GetCommonPointList' //获取可见的站点
    },
    /*系统首页*/
    home: {
        MobileHomePage: 'rest/AtmosphericCenterStation/LatestData/MobileHomePage' //首页
    },
    /*排名一览*/
    preview: {
        GetPointAQIRankData: 'rest/AtmosphericCenterStation/RankData/GetPointAQIRankData', //站点 小时 日均
        GetPointIQIRankData: 'rest/AtmosphericCenterStation/RankData/GetPointIQIRankData', //站点 月均 年均
        GetAreaAQIRankData: 'rest/AtmosphericCenterStation/RankData/GetAreaAQIRankData', //区域 小时 日均
        GetAreaIQIRankData: 'rest/AtmosphericCenterStation/RankData/GetAreaIQIRankData' //区域 月均 年均
    },
    /**审核 */
    audit: {
        HourToExamineOper: 'rest/AtmosphericCenterStation/ToExamine/HourToExamineOper', //审核操作
        GetToExamineList: 'rest/AtmosphericCenterStation/ToExamine/GetToExamineList', //审核状态一览-列表
        GetDataCompare: 'rest/AtmosphericCenterStation/ToExamine/GetDataCompare', //数据相关一致性检查-列表
        DataComplement: 'rest/AtmosphericCenterStation/ToExamine/DataComplement', //数据回补
        GetHourToExamineList: 'rest/AtmosphericCenterStation/ToExamine/GetHourToExamineList', //日报审核
        GetToExamineHistory: 'rest/AtmosphericCenterStation/ToExamine/GetToExamineHistory', //站点审核一览日历图
        DayToExamineOper: 'rest/AtmosphericCenterStation/ToExamine/DayToExamineOper', //日报审核-保存审核/保存审核并上报/保存复核/保存复核并上报/撤销
        GetHourCompareData: 'rest/AtmosphericCenterStation/ToExamine/GetHourCompareData', //实况标况对比
        GetHourToExamineHistory: 'rest/AtmosphericCenterStation/ToExamine/GetHourToExamineHistory', //审核历史记录
        GetPollutionExamHistory: 'rest/AtmosphericCenterStation/ToExamine/GetPollutionExamHistory', //审核互动
        GetSurroundingPoint: 'rest/AtmosphericCenterStation/ToExamine/GetSurroundingPoint', //获取周边站点
        SurroundingPointData: 'rest/AtmosphericCenterStation/ToExamine/SurroundingPointData' //周边站点对比
    },
    /*历史数据数据*/
    Data: {
        GetHistoryData: 'rest/AtmosphericCenterStation/HistoryData/GetHistoryData', //查询历史数据(实时，五分钟)
        GetHistoryAQIData: 'rest/AtmosphericCenterStation/HistoryData/GetHistoryAQIData', //查询历史数据(小时，日)
        GetHistoryIQIData: 'rest/AtmosphericCenterStation/HistoryData/GetHistoryIQIData', //查询历史数据(周，月，季，年)
        GetPointInfo: 'rest/AtmosphericCenterStation/Common/GetPointInfo' //站点信息
    },
    map: {
        GetLatestData: 'rest/AtmosphericCenterStation/LatestData/GetLatestData' //地图数据
    },
    /*基础表*/
    cod: {
        GetPollutantList: 'rest/AtmosphericCenterStation/Cod/GetPollutantList', //获取当前用户可查看监测因子集合
        UpConfigCode: 'rest/AtmosphericCenterStation/Cod/UpConfigCode', //修改当前用户查看区域监测因子的顺序
        GetOnePointPollutantList: 'rest/AtmosphericCenterStation/Cod/GetOnePointPollutantList' //获取单站点监测因子集合
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
            GetAirDetailAndDatas: 'rest/PollutantSourceApi/MonDataApi/GetAirDetailAndDatas', //获取空气站地图信息
            GetConstructionCorpsList: 'rest/PollutantSourceApi/XJHomeApi/GetConstructionCorpsList', //获取兵团信息 师团列表
            GetEnterpriseListApp: 'rest/PollutantSourceApi/BaseDataApi/GetEnterpriseListApp' // 行政区列表 师团列表
        },
        Account: {
            //初始化报警状态
            GetAlarmNotices: 'rest/PollutantSourceApi/AlarmDataApi/GetAlarmNotices',
            //netcore ✅ ChangePwd: 'rest/PollutantSourceApi/AuthorApi/ChangePwd',
            ChangePwd: 'rest/PollutantSourceApi/LoginApi/ChangePwd',
            Login: 'rest/PollutantSourceApi/LoginApi/Login', //登录
            PostMessageCode: 'rest/PollutantSourceApi/LoginApi/PostMessageCode', // 获取验证码
            LoginDataAnalyze: 'rest/PollutantSourceApi/LoginApi/Login', //数据分析登录
            GetToken: 'rest/PollutantSourceOAuth/connect/token', //身份认证token
            UpdateConfig: 'rest/PollutantSourceApi/SystemSettingApi/GetAndroidOrIosSettings', //更新配置
            getIsNeedSecret: 'rest/PollutantSourceApi/SystemSettingApi/GetSystemConfigInfo', //获取是否需要对参数加密
            GetSystemConfigInfo: 'rest/PollutantSourceApi/ConfigureApi/GetSystemConfigInfo', // 获取系统配置

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
            // AddOrDelStickyEnt: 'rest/PollutantSourceApi/MonitorTargetApi/AddOrDelStickyEnt', //置顶监控标
            AddOrDelStickyEnt: 'rest/PollutantSourceApi/MonitorTargetApi/EntStickyOperate',//置顶监控标
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
            GetListPager: 'rest/PollutantSourceApi/AutoFormDataApi/GetListPager', // netcore autoform
            // GetPollutantTypeList: 'rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeList', //污染物类型
            GetPollutantTypeList: '/rest/PollutantSourceApi/MonitorPollutantApi/GetPollutantTypeList', //污染物类型
            // GetPollutantTypeCode: '/rest/PollutantSourceApi/BaseDataApi/GetPollutantTypeCode', //污染物编码
            GetPollutantTypeCode: '/rest/PollutantSourceApi/MonitorPollutantApi/GetPollutantTypeCode', //污染物编码
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
            GetExceptionInfoList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetExceptionInfoList', // 缺失和异常 报警响应记录
            GetExResponseInfoList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetExResponseInfoList', // 异常报警详情
            GetOverAlarmInfoList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetOverAlarmInfoList',// 超标报警响应记录详情
            GetOverResponseInfoList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetOverResponseInfoList',// 超标报警 报警详情
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
    AbnormalDataTask: {
        GetClueDatas: '/rest/PollutantSourceApi/Clue/GetClueDatas', //获取线索列表
        GetWaitCheckDatas: '/rest/PollutantSourceApi/Clue/GetWaitCheckDatas', //报警记录
        GetPlanDatas: '/rest/PollutantSourceApi/Clue/GetPlanDatas', //获取可选方案
        GetCheckRoleDatas: '/rest/PollutantSourceApi/Clue/GetCheckRoleDatas', //可选核查人
        AddPlanTask: '/rest/PollutantSourceApi/Clue/AddPlanTask', //生成任务
        GetPreTakeFlagDatas: '/rest/PollutantSourceApi/Clue/GetPreTakeFlagDatas', //专家意见列表
        GetCheckedView: '/rest/PollutantSourceApi/Clue/GetCheckedView', //报警核查详情
        UpdatePlanItem: '/rest/PollutantSourceApi/Clue/UpdatePlanItem', //核查详情保存或者提交
        CheckConfirm: '/rest/PollutantSourceApi/Clue/CheckConfirm', //核查确认
        GetCheckedList: '/rest/PollutantSourceApi/Clue/GetCheckedList', //待核查任务列表
        RepulseCheck: '/rest/PollutantSourceApi/Clue/RepulseCheck', // 打回核查任务
    },
    ClueDetails: {
        //线索详情
        GetSnapshotData: 'rest/PollutantSourceApi/WarningV2/GetSnapshotData', //线索图表请求参数
        GetSingleWarning: 'rest/PollutantSourceApi/WarningV2/GetSingleWarning', //线索基本信息
        GetAllTypeDataListForModel: 'rest/PollutantSourceApi/WarningV2/GetAllTypeDataListForModel', //数据图表
        StatisLinearCoefficient: 'rest/PollutantSourceApi/WarningV2/StatisLinearCoefficient', //相关系数表
        StatisPolValueNumsByDGIMN: 'rest/PollutantSourceApi/WarningV2/StatisPolValueNumsByDGIMN', //密度直方图
        GetHourDataForPhenomenon: 'rest/PollutantSourceApi/WarningV2/GetHourDataForPhenomenon', //数据现象图
        GetPointParamsRange: 'rest/PollutantSourceApi/WarningV2/GetPointParamsRange', //波动范围查询
        GetCheckedRectificationList: 'rest/PollutantSourceApi/WarningV2/GetCheckedRectificationList', //波动范围查询
        GetCheckedRectificationApprovals: 'rest/PollutantSourceApi/WarningV2/GetCheckedRectificationApprovals', //波动范围查询
        GetWarningVerifyCheckInfo: 'rest/PollutantSourceApi/WarningV2/GetWarningVerifyCheckInfo', //核实流程页面
        UpdateCheckedRectification: '/rest/PollutantSourceApi/WarningV2/UpdateCheckedRectification', // 模型整改
        CheckedRectification: '/rest/PollutantSourceApi/WarningV2/CheckedRectification', // 督查人复核

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
        GetPollutantListByDgimn: 'rest/PollutantSourceApi/MonitorPollutantApi/GetPollutantListByDgimn', //污染因子列表

        GetWarningVerifyCheckInfo: 'rest/PollutantSourceApi/Warning/GetWarningVerifyCheckInfo', //核实流程页面
        GetWorkNumsAndFlag: 'rest/PollutantSourceApi/Warning/GetWorkNumsAndFlag', //异常识别工作台显示数量，角色类型

        GetSnapshotData: 'rest/PollutantSourceApi/Warning/GetSnapshotData', //报警图表数据
        UploadFiles: '/rest/PollutantSourceApi/UploadApi/UploadFiles', //报警核实上传图片
        GetWarningVerifyInfor: 'rest/PollutantSourceApi/Warning/GetWarningVerifyInfor', //获取报警核实详情
        InsertWarningVerify: 'rest/PollutantSourceApi/Warning/InsertWarningVerify', //报警核实操作
        GetModelExceptionNumsByPointAuth: 'rest/PollutantSourceApi/Warning/GetModelExceptionNumsByPointAuth', //运维人线索分组列表
        GetModelExceptionNums: 'rest/PollutantSourceApi/Warning/GetModelExceptionNums' //运维人线索分组列表
    },
    ModelAnalysisAectification: {
        // 模型整改
        GetCheckedRectificationList: '/rest/PollutantSourceApi/Warning/GetCheckedRectificationList', // 整改复合列表
        UpdateCheckedRectification: '/rest/PollutantSourceApi/Warning/UpdateCheckedRectification', // 模型整改
        GetCheckedRectificationApprovals: '/rest/PollutantSourceApi/Warning/GetCheckedRectificationApprovals', // 获取整改复核详情
        CheckedRectification: '/rest/PollutantSourceApi/Warning/CheckedRectification' // 督查人复核
    },
    pOperationApi: {
        General: {
            //netcore 运维APP上是否允许申请巡检工单
            GetOperationSetting: 'rest/PollutantSourceApi/ConfigureApi/GetOperationSetting' //运维APP上是否允许申请巡检工单
        },
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
            RetransmissionKeyParameter: 'rest/PollutantSourceApi/KeyParameter/RetransmissionKeyParameter' // 关键参数核查任务转发
        },
        WorkBench: {
            GetAlarmCountForEnt: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetAlarmCountForEnt', // 获取企业报警数量
            GetNoticeMessageInfoList: 'rest/PollutantSourceApi/OperationBasicApi/GetNoticeMessageInfoList', //获取APP通知列表
            GetOperationDocuments: 'rest/PollutantSourceApi/OperationBasicApi/GetOperationDocuments', //获取运维资料库
            GetOperationStatistics: 'rest/PollutantSourceApi/OperationBasicApi/GetOperationStatistics', //获取运维统计
            //netcore ✅ GetHomeTypeCount: 'rest/PollutantSourceApi/OperationBasicApi/GetConsoleTypeCount', //获取工作台各个标签数量
            GetWorkbenchInfo: 'rest/PollutantSourceApi/OperationWorkbenchApi/GetWorkbenchInfo', //获取工作台各个标签数量
            //netcore ✅ GetNoticeContentList: 'rest/PollutantSourceApi/BaseDataApi/GetNoticeContentList' //公告列表
            GetNoticeContentList: 'rest/PollutantSourceApi/NoticeApi/GetNoticeList', //公告列表

            GetOperationTaskStatisticsInfoByDay: '/rest/PollutantSourceApi/VisualDashBoardApi/GetOperationTaskStatisticsInfoByDay', // 工单执行情况
        },
        Message: {
            // 消息中心 20220531
            //netcore ✅ GetPushMessageList: 'rest/PollutantSourceApi/OperationBasicApi/GetPushMessageList', // 消息中心
            GetPushMessageList: 'rest/PollutantSourceApi/MessageApi/GetPushMessageList', // 消息中心
            //netcore ✅ GetMessageInfoList: 'rest/PollutantSourceApi/OperationBasicApi/GetMessageInfoList', // 消息中心详情
            GetMessageInfoList: 'rest/PollutantSourceApi/MessageApi/GetMessageInfoList', // 消息中心详情
            GetServiceReminderInfo: 'rest/PollutantSourceApi/CTBaseDataApi/GetServiceReminderInfo', // 服务提醒消息详情
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
            GetRemoteInspectorList: 'rest/PollutantSourceApi/KeyParameterApi/GetKeyParameterCheckList', // 督查记录 列表

            // 示值误差和响应时间
            GetIndicationErrorSystemResponseRecordListForApp: 'rest/PollutantSourceApi/GasOperationFormApi/GetIndicationErrorSystemResponseRecordListForApp', // 获取示值误差及响应时间列表
            // 计算示值误差
            GetIndicationError: 'rest/PollutantSourceApi/GasOperationFormApi/GetIndicationError', // 获取示值误差
            // 添加或修改示值误差及响应时间
            AddOrUpdateIndicationErrorSystemResponseRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateIndicationErrorSystemResponseRecord', // 添加或修改示值误差及响应时间
            // 删除示值误差及响应时间量程
            DeleteErrorSystemResponseRecordInfo: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteErrorSystemResponseRecordInfo', // 删除示值误差及响应时间
            // 删除示值误差及响应时间整个表单
            DeleteErrorSystemResponseRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteErrorSystemResponseRecord', // 删除示值误差及响应时间
            // 示值误差和响应时间
            GetIndicationErrorSystemResponseRecordListForAppZB: 'rest/PollutantSourceApi/GasOperationFormApi/GetIndicationErrorSystemResponseRecordListForAppZB', // 获取示值误差列表
            // 添加或修改示值误差及响应时间
            AddOrUpdateIndicationErrorSystemResponseRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateIndicationErrorSystemResponseRecordZB', // 添加或修改示值误差及响应时间
            // 提交示值误差及响应时间 - 主表
            SubmitIndicationErrorSystemResponseRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/SubmitIndicationErrorSystemResponseRecordZB', // 提交示值误差及响应时间
            // 删除示值误差及响应时间量程
            DeleteErrorSystemResponseRecordInfoZB: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteErrorSystemResponseRecordInfoZB', // 删除示值误差及响应时间
            // 删除示值误差及响应时间整个表单
            DeleteErrorSystemResponseRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteErrorSystemResponseRecordZB', // 删除示值误差及响应时间

            /**
            * 淄博项目 校准 废气
            */
            GetJzRecordZb: 'rest/PollutantSourceApi/GasOperationFormApi/GetCemsCalibrationRecordZB', // 获取单个任务的校准记录
            AddOrUpdateJzRecordZb: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateCemsCalibrationRecordListZB', // 新增或更新校准记录  
            GetJzItemZBCEMS: 'rest/PollutantSourceApi/GasOperationFormApi/GetJzItemZBCEMS', // 废气校准项
            DeleteJzRecordZb: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteCemsCalibrationRecordZB', //删除指定任务的校准表单数据
            DeleteJzItemZb: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteJzItemZB', // 校准 删除子表

            /**
            * 淄博项目 校准 废水
            */
            GetJzRecordZbFs: 'rest/PollutantSourceApi/GasOperationFormApi/GetFSCalibrationRecordZB', // 获取单个任务的校准记录
            AddOrUpdateJzRecordZbFs: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateFSCalibrationRecordListZB', // 新增或更新校准记录  
            GetJzItemZBCEMSFs: 'rest/PollutantSourceApi/GasOperationFormApi/GetJzItemZBFS', // 废水校准项
            DeleteJzRecordZbFs: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteFSCalibrationRecordZB', //删除指定任务的校准表单数据
            DeleteJzItemZbFs: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteJzItemZBFS', // 校准 删除子表

            /**
             * 2025.3.26
             * 淄博巡检
             */
            // 添加修改完全抽取法 CEMS 日常巡检
            AddOrUpdateAllExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateAllExInspectionRecord', // 淄博巡检
            // 获取完全抽取法 CEMS 日常巡检
            GetAllExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetAllExInspectionRecord',
            // 删除完全抽取法 CEMS 日常巡检
            DeleteAllExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteAllExInspectionRecord',
            // 添加修改稀释采样法 CEMS 日常巡检
            AddOrUpdateXSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateXSExInspectionRecord',
            // 获取稀释采样法 CEMS 日常巡检
            GetXSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetXSExInspectionRecord',
            // 删除稀释采样法 CEMS 日常巡检
            DeleteXSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteXSExInspectionRecord',
            // 添加修改直接测量法 CEMS 日常巡检
            AddOrUpdateZJExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateZJExInspectionRecord',
            // 获取直接测量法 CEMS 日常巡检
            GetZJExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetZJExInspectionRecord',
            // 删除直接测量法 CEMS 日常巡检
            DeleteZJExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteZJExInspectionRecord',
            // 获取 VOCs 监测日常巡检
            GetVOCsExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetVOCsExInspectionRecord',
            // 添加修改 VOCs 监测日常巡检
            AddOrUpdateVOCsExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateVOCsExInspectionRecord',
            // 删除 VOCs 监测日常巡检
            DeleteVOCsExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteVOCsExInspectionRecord',
            // 添加修改废水监测日常巡检
            AddOrUpdateFSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateFSExInspectionRecord',
            // 获取废水监测日常巡检
            GetFSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/GetFSExInspectionRecord',
            // 删除废水监测日常巡检
            DeleteFSExInspectionRecord: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteFSExInspectionRecord',

            /**
             * 2025.4.1
             * 淄博标准物质更换
             */
            GetStandardGasRepalceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/GetStandardGasRepalceRecordZB', // 获取标准物质更换记录
            AddOrUpdateStandardGasRepalceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateStandardGasRepalceRecordZB', // 新增或更新标准物质更换记录
            DeletetStandardGasRepalceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetStandardGasRepalceRecordZB', // 删除标准物质更换记录
            GetStandardGasRepalceLastDate: 'rest/PollutantSourceApi/GasOperationFormApi/GetStandardGasRepalceLastDate', // 计算上次更换日期和浓度中高低
            SubmitStandardGasRepalceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/SubmitStandardGasRepalceRecordZB', // 提交标准物质更换记录
            DeletetStandardGasRepalceRecordZBById: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetStandardGasRepalceRecordZBById', // 删除标准物质更换记录

            /**
             * 2025.4.7
             * 淄博易耗品更换
             */
            GetConsumablesReplaceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/GetConsumablesReplaceRecordZB', // 获取易耗品更换记录
            AddOrUpdateConsumablesReplaceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateConsumablesReplaceRecordZB', // 新增或更新易耗品更换记录
            DeletetConsumablesReplaceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetConsumablesReplaceRecordZB', // 删除易耗品更换记录
            DeletetConsumablesReplaceRecordZBById: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetConsumablesReplaceRecordZBById', // 删除易耗品更换记录 - 单条
            SubmitConsumablesReplaceRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/SubmitConsumablesReplaceRecordZB', // 提交易耗品更换记录 签名等信息

            /**
             * 2025.4.8
             * 淄博校验测试
             */
            GetVerificationTestRecordZBList: 'rest/PollutantSourceApi/GasOperationFormApi/GetVerificationTestRecordZBList', // 获取
            AddOrUpdateVerificationTestRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateVerificationTestRecordZB', // 添加
            DeleteVerificationTestRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteVerificationTestRecordZB', // 删除
            AddorUpdateVerificationTestParamsZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddorUpdateVerificationTestParamsZB', // 添加表格
            /**
             * 2025.4.14
             * CEMS设备维修记录
             */
            AddOrUpdateRepairRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateRepairRecordZB',// 新增或更新维修记录-淄博
            GetRepairRecordZB: 'rest/PollutantSourceApi/GasOperationFormApi/GetRepairRecordZB',// 获取维修记录-淄博
            DeleteRepairRecordZB: '/rest/PollutantSourceApi/GasOperationFormApi/DeleteRepairRecordZB',// 删除维修记录-淄博





















                   
            /**
             * 2025.4.15
             * 宝武项目
             */
            AddOperationUserBW: 'rest/PollutantSourceApi/GasOperationFormApi/AddOperationUserBW', //人员清单 添加
            GetOperationUserBW: 'rest/PollutantSourceApi/GasOperationFormApi/GetOperationUserBW', //人员清单
            DelOperationUserBW: 'rest/PollutantSourceApi/GasOperationFormApi/DelOperationUserBW', //人员清单 删除
            //标准物质更换
            GetStandardGasRepalceRecordBW: '/rest/PollutantSourceApi/GasOperationFormApi/GetStandardGasRepalceRecordBW', //废气-获取更换记录
            AddOrUpdateStandardGasRepalceRecordBW: '/rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateStandardGasRepalceRecordBW', //废气-新增或者更新单条记录
            SubmitStandardGasRepalceRecordBW: '/rest/PollutantSourceApi/GasOperationFormApi/SubmitStandardGasRepalceRecordBW', //废气-提交记录
            DeletetStandardGasRepalceRecordBWById: '/rest/PollutantSourceApi/GasOperationFormApi/DeletetStandardGasRepalceRecordBWById', //废气-单条记录删除
            DeletetStandardGasRepalceRecordBW: '/rest/PollutantSourceApi/GasOperationFormApi/DeletetStandardGasRepalceRecordBW', //废气-表单删除
            //易耗品更换
            GetConsumablesReplaceRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/GetConsumablesReplaceRecordBW', //废气-获取更换记录
            AddOrUpdateConsumablesReplaceRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateConsumablesReplaceRecordBW', // 废气-新增或者更新单条记录
            SubmitConsumablesReplaceRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/SubmitConsumablesReplaceRecordBW', //废气-提交记录
            DeletetConsumablesReplaceRecordBWById: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetConsumablesReplaceRecordBWById', // 废气-单条记录删除
            DeletetConsumablesReplaceRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/DeletetConsumablesReplaceRecordBW', // 废气-表单删除
             //校验测试
            GetVerificationTestRecordBWList: 'rest/PollutantSourceApi/GasOperationFormApi/GetVerificationTestRecordBWList', //废气-获取更换记录
            AddOrUpdateVerificationTestRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/AddOrUpdateVerificationTestRecordBW', //废气-新增或者更新记录
            AddorUpdateVerificationTestParamsBW: 'rest/PollutantSourceApi/GasOperationFormApi/AddorUpdateVerificationTestParamsBW', // 废气-添加或修改标气或测试设备或参比监测信息
            DeleteVerificationTestRecordBW: 'rest/PollutantSourceApi/GasOperationFormApi/DeleteVerificationTestRecordBW', // 废气-表单或者记录删除

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
            GetInspectorRectificationNum: 'rest/PollutantSourceApi/SystemFacilityVerification/GetInspectorRectificationNum' // 手机端督察整改 计数器
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
            OffsiteSign: '/rest/PollutantSourceApi/CTBaseDataApi/OffsiteSign', // 非现场签到
            GetTodayOffsiteSign: '/rest/PollutantSourceApi/CTBaseDataApi/GetTodayOffsiteSign', // 成套非现场签到计数
            GetCTSignInHistoryList: '/rest/PollutantSourceApi/CTBaseDataApi/GetCTSignInHistoryList', // 签到统计
            GetOffsiteSignHistoryList: '/rest/PollutantSourceApi/CTBaseDataApi/GetOffsiteSignHistoryList', // 非现场签到统计
            GetSignHistoryList: '/rest/PollutantSourceApi/CTBaseDataApi/GetSignHistoryList', // 现场和非现场合并 获取签到统计
            GetCheckInProjectList: '/rest/PollutantSourceApi/CTBaseDataApi/GetCheckInProjectList', // 签到获取点位列表

            GetProjectEntPointSysModel: '/rest/PollutantSourceApi/CTBaseDataApi/GetProjectEntPointSysModel', // 获取派单对应的企业监测点系统型号
            UploadFiles: '/rest/PollutantSourceApi/CTBaseDataApi/UploadFiles', // 上传图片
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
            DeleteInstallationPhotosChildByID: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteInstallationPhotosChildByID', // 删除安装照片整改单条数据

            // 设置参数照片
            AddParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddParameterSettingsPhotoRecord', // 添加接口
            DeleteParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteParameterSettingsPhotoRecord', // 删除接口
            GetParameterSettingsPhotoRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetParameterSettingsPhotoRecord', // 获取安装照片列表或者实体

            // 派单详情 服务统计
            GetRecordQuestion: '/rest/PollutantSourceApi/CTBaseDataApi/GetRecordQuestion', // 超时、重复派单原因码表
            GetOverTimeServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetOverTimeServiceRecord', // 超时派单信息
            AddOrUpdOverTimeServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddOrUpdOverTimeServiceRecord', // 添加或修改超时派单信息
            GetRepeatServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetRepeatServiceRecord', // 重复派单信息
            AddOrUpdRepeatServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddOrUpdRepeatServiceRecord', //添加修改重复服务表单

            GetProblemsServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetProblemsServiceRecord', // 遗留问题表单
            AddOrUpdProblemsServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddOrUpdProblemsServiceRecord', // 添加遗留表单

            GetWarrantyServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/GetWarrantyServiceRecord', // 获取质保内服务表单
            AddOrUpdWarrantyServiceRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddOrUpdWarrantyServiceRecord', // 添加或修改质保内服务表单

            GetServiceRecordStatus: '/rest/PollutantSourceApi/CTBaseDataApi/GetServiceRecordStatus', // 获取服务统计表单状态

            // 设备照片审核
            GetEquipmentAuditRectificationList: 'rest/PollutantSourceApi/CustomerSatisfaction/GetEquipmentAuditRectificationList', // 获取照片审核列表参数
            EquipmentAuditRectificationSubmit: '/rest/PollutantSourceApi/CustomerSatisfaction/EquipmentAuditRectificationSubmit', // 整改提交
            EquipmentAuditRectificationAppeal: 'rest/PollutantSourceApi/CustomerSatisfaction/EquipmentAuditRectificationAppeal', // 申诉提交
            GetEquipmentAuditRectificationNum: '/rest/PollutantSourceApi/CustomerSatisfaction/GetEquipmentAuditRectificationNum', // 获取整改照片数量

            // 成套 服务提醒
            GetServiceReminderList: '/rest/PollutantSourceApi/CustomerSatisfaction/GetServiceReminderList', // 提醒服务列表
            AddServiceReminder: '/rest/PollutantSourceApi/CustomerSatisfaction/AddServiceReminder', // 添加服务提醒
            DeleteServiceReminder: '/rest/PollutantSourceApi/CustomerSatisfaction/DeleteServiceReminder', // 删除提醒
            GetServiceReminderView: '/rest/PollutantSourceApi/CustomerSatisfaction/GetServiceReminderView' // 提醒详情
        },
        /**
         * 2024.02.19
         * 通用签到
         */
        CommonSignIn: {
            GetSignInType: '/rest/PollutantSourceApi/OperationSignInApi/GetSignInType', // 获取打卡类型
            GetSignInEntList: '/rest/PollutantSourceApi/OperationSignInApi/GetSignInEntList', // 获取打卡企业列表
            SignIn: '/rest/PollutantSourceApi/OperationSignInApi/SignIn', // 签到打卡
            RepairSignIn: '/rest/PollutantSourceApi/OperationSignInApi/RepairSignIn', // 补卡
            GetLastSingInfo: '/rest/PollutantSourceApi/OperationSignInApi/GetLastSingInfo', // 获取上次打卡信息
            GetSignInHistoryList: '/rest/PollutantSourceApi/OperationSignInApi/GetSignInHistoryList', // 获取签到历史信息
            GetSignStatus: '/rest/PollutantSourceApi/OperationSignInApi/GetSignStatus', // 获取当前时间是否能打卡 夜班 编码 574
            GetUpdAndRevokeStatus: '/rest/PollutantSourceApi/OperationSignInApi/GetUpdAndRevokeStatus',// 获取撤销修改状态
            RevokeApproved: '/rest/PollutantSourceApi/OperationSignInApi/RevokeApproved',// 撤销已申请的补卡
            UpdateApproved: '/rest/PollutantSourceApi/OperationSignInApi/UpdateApproved',// 获取需要修改的补签记录的信息

            GetTeamOperationSignIn: '/rest/PollutantSourceApi/OperationSignInApi/GetTeamOperationSignIn',// 团队统计1
            GetPersonSignList: '/rest/PollutantSourceApi/OperationSignInApi/GetPersonSignList',// 团队统计2
        },
        /**
         * 2024.04.26
         * 服务报告整改
         */
        ServiceReportRectification: {
            GetServiceStatusNum: '/rest/PollutantSourceApi/CTProjectExecutionApi/GetServiceStatusNum', // 手机端服务报告整改数字
            GetStayCheckServices: '/rest/PollutantSourceApi/CTProjectExecutionApi/GetStayCheckServices', // 服务报告审核列表
            GetServiceDesc: '/rest/PollutantSourceApi/CTProjectExecutionApi/GetServiceDesc', // 获取服务报告详情
            AuditService: '/rest/PollutantSourceApi/CTProjectExecutionApi/AuditService', // 审查服务报告
            // GetDealOpinions: '/rest/PollutantSourceApi/CTProjectExecutionApi/GetDealOpinions', // 获取服务报告审核流程
        }
        /**
         * 2024.05.09
         * 运维计划
         */
        , OperationPlan: {
            GetAppOperationPlanCalendarDateList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetAppOperationPlanCalendarDateList', // 获取日历运维派单计划
            GetAppOperationPlanList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetAppOperationPlanList', // 获取单点运维计划
            GetAppOperationPlanByPointList: '/rest/PollutantSourceApi/OperationWorkbenchApi/GetAppOperationPlanByPointList', // 获取单点运维计划时间轴 
            AddSpareReplacementRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddSpareReplacementRecord', // 添加备件更换
            GetSpareReplacementRecordList: '/rest/PollutantSourceApi/CTBaseDataApi/GetSpareReplacementRecordList', // 成套备件更换 历史纪录
        }
        /**
         * 2024.05.10
         * 成套 备件更换
         */
        , CTSparePartsChangeModel: {
            GetCemsSystemModelInventory: '/rest/PollutantSourceApi/DebuggingEquipment/GetCemsSystemModelInventory', // 获取所有的系统型号参数
            // CTApi/ GetProjectEntPointSysModel
            AddSpareReplacementRecord: '/rest/PollutantSourceApi/CTBaseDataApi/AddSpareReplacementRecord', // 添加备件更换
            GetCisPartsList: '/rest/PollutantSourceApi/CTBaseDataApi/GetCisPartsList', // 获取CIs申请单列表
            DeleteSpareReplacementRecord: '/rest/PollutantSourceApi/CTBaseDataApi/DeleteSpareReplacementRecord', // 删除备件更换
        },
        // 指控
        qualityControl: {
            GetQCAStatus: '/rest/PollutantSourceApi/QCStatus/GetQCAStatus', // 获取状态 （质控仪状态和cems状态）
            GetQCAInfo: '/rest/PollutantSourceApi/QCAnalyzerManagement/GetQCAInfo', // 获取质控仪信息
            // GetNewQCARecord: 'rest/PollutantSourceApi/QualityControlApi/GetNewQCARecord', // 获取质控日志
            GetNewQCARecord: 'rest/PollutantSourceApi/QCRecord/GetQCDetailRecord', // 获取质控日志
            // GetQCAResultRecord: 'rest/PollutantSourceApi/QualityControlApi/GetQCAResultRecord', // 获取质控结果记录
            GetQCAResultRecord: '/rest/PollutantSourceApi/QCProcess/GetQCARecordList', // 获取质控结果记录
            // SendQCACheckCMD: 'rest/PollutantSourceApi/QualityControlApi/SendQCACheckCMD', // 执行质控
            SendQCACheckCMD: 'rest/PollutantSourceApi/QCRemote/SendQCACheckCMD', // 执行质控
            // GetQCAResultInfo: 'rest/PollutantSourceApi/QualityControlApi/GetQCAResultInfo' // 获取质控详情
            GetQCAResultInfo: 'rest/PollutantSourceApi/QCProcess/GetQCProcessData' // 获取质控详情
        }
    },
    gridOperation: {
        GetPointLists: 'rest/AtmosphereApi/PointAndData/GetPointLists'
    },
    wxPush: {
        ResetUserWechatInfo: '/rest/PollutantSourceApi/UserApi/ResetUserWechatInfo', // 重制微信注册信息
        GetUserOpenID: '/rest/PollutantSourceApi/UserApi/GetUserOpenID', // 获取微信openID
        TestPushWeChatInfo: '/rest/PollutantSourceApi/UserApi/TestPushWeChatInfo', // 发送测试微信消息
    },
    changePwd: {
        SendEmailCode: '/rest/PollutantSourceApi/LoginApi/SendEmailCode', // 发送邮箱验证码
        RetrievePasswordByEmail: '/rest/PollutantSourceApi/LoginApi/RetrievePasswordByEmail', // 通过邮箱找回密码
    },
    provisioning: {
        //netcore ✅ GetPersonalCenterOrder: 'rest/PollutantSourceApi/TaskFormApi/GetPersonalCenterOrder', // 一级 开通记录
        GetPersonalCenterOrder: 'rest/PollutantSourceApi/CustomerRenew/GetAppCustomerRenewList', // 一级 开通记录
        //netcore ✅ GetGetPersonalCenterOrderInfo: 'rest/PollutantSourceApi/TaskFormApi/GetGetPersonalCenterOrderInfo', // 二级 开通记录
        GetGetPersonalCenterOrderInfo: 'rest/PollutantSourceApi/CustomerRenew/GetAppCustomerRenewInfo', // 二级 开通记录
    }
};
