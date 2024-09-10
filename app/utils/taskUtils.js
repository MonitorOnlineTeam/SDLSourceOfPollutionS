import globalcolor from '../config/globalcolor';

export const createImageUrl = (Attachments, uploadurl) => {
    let ImageArr = [];
    Attachments.ThumbimgList.map((item, key) => {
        ImageArr.push({
            url: uploadurl + item,
            imageId: item.split('_thumbnail')[0],
            large: uploadurl + Attachments.ImgList[key]
        });
    });
    return ImageArr;
};

export const createPdfUrl = (Attachments, uploadurl) => {
    Attachments.map((item, key) => {
        item.pdfPath = uploadurl + item.FileSrc;
    });
};

export const getFormUrl = (item, neturl, ID, TaskStatus) => {
    /**
     * 2 StopCemsHistoryList
     * 1 RepairHistoryList
     * 3 ConsumablesReplaceHistoryList
     * 4 StandardGasRepalceHistoryList
     * 5 WQCQFInspectionHistoryList
     * 6 XSCYFInspectionHistoryList
     * 7 ZZCLFInspectionHistoryList
     * 8 JzHistoryList
     * 9 BdTestHistoryList
     * 10 DeviceExceptionHistoryList
     * 27 保养项更换记录表
     * { path: '/appoperation/appmaintainrepalcerecord/:TaskID/:TypeID', component: './AppOperation/AppMaintainRepalceRecord' },
     * 3 备件更换记录表
     * { path: '/appoperation/appsparepartreplacerecord/:TaskID/:TypeID', component: './AppOperation/AppSparePartReplaceRecord' },
     */
    // neturl = 'http://172.16.12.77:8000';//测试
    // if ((item.TypeName == 'StopCemsHistoryList' || item.TypeID == 2) && ID && ID != '') {
    //     //停机
    //     return neturl + '/appoperation/appstopcemsrecord' + '/' + ID + '/' + 2;
    // } else if ((item.TypeName == 'RepairHistoryList' || item.TypeID == 1) && ID && ID != '') {
    //     //维修
    //     return neturl + '/appoperation/apprepairrecord' + '/' + ID + '/' + 1;
    //     // } else if((item.TypeName == "ConsumablesReplaceHistoryList"||item.TypeID == 3)&&ID&&ID!=''){
    // } else if ((item.TypeName == 'ConsumablesReplaceHistoryList' || item.TypeID == 3) && ID && ID != '') {
    //     //易耗品
    //     // item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + 3;
    //     return neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + 3;
    // } else if ((item.TypeName == 'SparePartHistoryList' || item.TypeName == 'SparePartReplace' || item.TypeID == 28) && ID && ID != '') {
    //     //备件
    //     return neturl + '/appoperation/appsparepartreplacerecord' + '/' + ID + '/' + 28;
    // } else if ((item.TypeName == 'StandardGasRepalceHistoryList' || item.TypeName == 'ReagentRepalceHistoryList' || item.TypeID == 4) && ID && ID != '') {
    //     //标气
    //     return neturl + '/appoperation/appstandardgasrepalcerecord' + '/' + ID + '/' + 4;
    // } else if ((item.TypeName == 'WQCQFInspectionHistoryList' || item.TypeID == 5) && ID && ID != '') {
    //     //巡检 完全抽取法
    //     return neturl + '/appoperation/appcompleteextractionrecord' + '/' + ID + '/' + 5;
    // } else if ((item.TypeName == 'XSCYFInspectionHistoryList' || item.TypeID == 6) && ID && ID != '') {
    //     //巡检 稀释采样法
    //     return neturl + '/appoperation/appdilutionsamplingrecord' + '/' + ID + '/' + 6;
    // } else if ((item.TypeName == 'ZZCLFInspectionHistoryList' || item.TypeID == 7) && ID && ID != '') {
    //     //巡检 直接测量法
    //     return neturl + '/appoperation/appdirectmeasurementrecord' + '/' + ID + '/' + 7;
    // } else if ((item.TypeName == 'JzHistoryList' || item.TypeID == 8) && ID && ID != '') {
    //     //校准
    //     return neturl + '/appoperation/appjzrecord' + '/' + ID + '/' + 8;
    // } else if ((item.TypeName == 'BdTestHistoryList' || item.TypeID == 9) && ID && ID != '') {
    //     //校验
    //     return neturl + '/appoperation/appbdtestrecord' + '/' + ID + '/' + 9;
    // } else if ((item.TypeName == 'DeviceExceptionHistoryList' || item.TypeID == 10) && ID && ID != '') {
    //     //数据异常
    //     return neturl + '/appoperation/appdeviceexceptionrecord' + '/' + ID + '/' + 10;
    // } else if ((item.TypeName == 'Maintain' || item.TypeID == 27) && ID && ID != '') {
    //     //保养项更换记录表
    //     return neturl + '/appoperation/appmaintainrepalcerecord' + '/' + ID + '/' + 10;
    // } else if ((item.TypeID == 58 || item.TypeID == 59 || item.TypeID == 60) && ID && ID != '') {
    //     //设备故障小时记录
    //     return neturl + '/appoperation/appfailurehoursrecord' + '/' + ID + '/' + item.TypeID;
    // } else {
    //     item.formUrl = '';
    // }
    if ((item.TypeName == 'StopCemsHistoryList' || item.TypeID == 2) && ID && ID != '') {
        //停机
        return neturl + '/appoperation/appstopcemsrecord' + '/' + ID + '/' + 2;
    } else if ((item.TypeName == 'RepairHistoryList' || item.TypeID == 1|| item.TypeID == 12) && ID && ID != '') {
        //维修
        return neturl + '/appoperation/apprepairrecord' + '/' + ID + '/' + 1;
        // } else if((item.TypeName == "ConsumablesReplaceHistoryList"||item.TypeID == 3)&&ID&&ID!=''){
    } else if ((item.TypeName == 'ConsumablesReplaceHistoryList' || item.TypeID == 3|| item.TypeID == 14) && ID && ID != '') {
        //易耗品
        // item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + 3;
        return neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeName == 'SparePartHistoryList' || item.TypeName == 'SparePartReplace' || item.TypeID == 28|| item.TypeID == 20) && ID && ID != '') {
        //备件
        return neturl + '/appoperation/appsparepartreplacerecord' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeName == 'StandardGasRepalceHistoryList' || item.TypeName == 'ReagentRepalceHistoryList' || item.TypeID == 4) && ID && ID != '') {
        //标气
        return neturl + '/appoperation/appstandardgasrepalcerecord' + '/' + ID + '/' + 4;
    } else if ((item.TypeName == 'WQCQFInspectionHistoryList' || item.TypeID == 5) && ID && ID != '') {
        //巡检 完全抽取法
        return neturl + '/appoperation/appcompleteextractionrecord' + '/' + ID + '/' + 5;
    } else if ((item.TypeName == 'XSCYFInspectionHistoryList' || item.TypeID == 6) && ID && ID != '') {
        //巡检 稀释采样法
        return neturl + '/appoperation/appdilutionsamplingrecord' + '/' + ID + '/' + 6;
    } else if ((item.TypeName == 'ZZCLFInspectionHistoryList' || item.TypeID == 7) && ID && ID != '') {
        //巡检 直接测量法
        return neturl + '/appoperation/appdirectmeasurementrecord' + '/' + ID + '/' + 7;
    } else if ((item.TypeName == 'JzHistoryList' || item.TypeID == 8 ) && ID && ID != '') {
        //校准
        return neturl + '/appoperation/appjzrecord' + '/' + ID + '/' + 8;
    } else if ((item.TypeName == 'BdTestHistoryList' || item.TypeID == 9) && ID && ID != '') {
        //校验
        return neturl + '/appoperation/appbdtestrecord' + '/' + ID + '/' + 9;
    } else if ((item.TypeName == 'DeviceExceptionHistoryList' || item.TypeID == 10) && ID && ID != '') {
        //数据异常
        return neturl + '/appoperation/appdeviceexceptionrecord' + '/' + ID + '/' + 10;
    } else if ((item.TypeName == 'Maintain' || item.TypeID == 27) && ID && ID != '') {
        //保养项更换记录表
        return neturl + '/appoperation/appmaintainrepalcerecord' + '/' + ID + '/' + 10;
    } else if ((item.TypeID == 58 || item.TypeID == 59 ) && ID && ID != '') {
        //设备故障小时记录 20220428没有|| item.TypeID == 60
        return neturl + '/appoperation/appfailurehoursrecord' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 64  && ID && ID != '') {
        //设备参数变动记录 废气
        return neturl + '/appoperation/appGasDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeID == 65||item.TypeID == 73)  && ID && ID != '') {
        //上月委托第三方检测次数
        return neturl + '/appoperation/appThirdPartyTestingContent' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeID == 18||item.TypeID == 63)  && ID && ID != '') {
        //数据一致性记录表 实时
        return neturl + '/appoperation/appDataConsistencyRealTime' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeID == 66||item.TypeID == 74)  && ID && ID != '') {
        //数据一致性记录表 小时与日数据
        return neturl + '/appoperation/appDataConsistencyRealDate' + '/' + ID + '/' + item.TypeID;
    } else if ((item.TypeID == 62||item.TypeID == 61)  && ID && ID != '') {
        //配合检查记录 
        return neturl + '/appoperation/appCooperaInspection' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 19  && ID && ID != '') {
        //实际水样对比实验结果记录表
        return neturl + '/appoperation/comparisonTestResults' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 72  && ID && ID != '') {
        // 设备参数核对记录 水
        return neturl + '/appoperation/appDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 15  && ID && ID != '') {
        // 试剂更换记录表 水
        return neturl + '/appoperation/appreagentreplaceRecord' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 70  && ID && ID != '') {
        // 标准溶液检查记录 水
        return neturl + '/appoperation/appStandardSolutionVerificationRecord' + '/' + ID + '/' + item.TypeID;
    } else if (item.TypeID == 16  && ID && ID != '') {
        // 校准记录表 污水
        return neturl + '/appoperation/appWaterQualityCalibrationRecord' + '/' + ID + '/' + item.TypeID;
    } else {
        return '';
    }
};

export const createFormUrl = (TaskFormList, neturl, ID, TaskStatus) => {
    /**
     * 2 StopCemsHistoryList
     * 1 RepairHistoryList
     * 3 ConsumablesReplaceHistoryList
     * 4 StandardGasRepalceHistoryList
     * 5 WQCQFInspectionHistoryList
     * 6 XSCYFInspectionHistoryList
     * 7 ZZCLFInspectionHistoryList
     * 8 JzHistoryList
     * 9 BdTestHistoryList
     * 10 DeviceExceptionHistoryList
     * 27 保养项更换记录表
     * { path: '/appoperation/appmaintainrepalcerecord/:TaskID/:TypeID', component: './AppOperation/AppMaintainRepalceRecord' },
     * 3 备件更换记录表
     * { path: '/appoperation/appsparepartreplacerecord/:TaskID/:TypeID', component: './AppOperation/AppSparePartReplaceRecord' },
     */
    // neturl = 'http://172.16.12.77:8000';//测试
    TaskFormList.map(item => {
        item.TaskStatus = TaskStatus;
        console.log('createFormUrl');
        if ((item.TypeName == 'StopCemsHistoryList' || item.TypeID == 2) && ID && ID != '') {
            //停机
            item.formUrl = neturl + '/appoperation/appstopcemsrecord' + '/' + ID + '/' + 2;
        } else if ((item.TypeName == 'RepairHistoryList' || item.TypeID == 1|| item.TypeID == 12) && ID && ID != '') {
            //维修
            item.formUrl = neturl + '/appoperation/apprepairrecord' + '/' + ID + '/' + 1;
            // } else if((item.TypeName == "ConsumablesReplaceHistoryList"||item.TypeID == 3)&&ID&&ID!=''){
        } else if ((item.TypeName == 'ConsumablesReplaceHistoryList' || item.TypeID == 3|| item.TypeID == 14) && ID && ID != '') {
            //易耗品
            // item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + 3;
            item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeName == 'SparePartHistoryList' || item.TypeName == 'SparePartReplace' || item.TypeID == 28|| item.TypeID == 20) && ID && ID != '') {
            //备件
            item.formUrl = neturl + '/appoperation/appsparepartreplacerecord' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeName == 'StandardGasRepalceHistoryList' || item.TypeName == 'ReagentRepalceHistoryList' || item.TypeID == 4) && ID && ID != '') {
            //标气
            item.formUrl = neturl + '/appoperation/appstandardgasrepalcerecord' + '/' + ID + '/' + 4;
        } else if ((item.TypeName == 'WQCQFInspectionHistoryList' || item.TypeID == 5) && ID && ID != '') {
            //巡检 完全抽取法
            item.formUrl = neturl + '/appoperation/appcompleteextractionrecord' + '/' + ID + '/' + 5;
        } else if ((item.TypeName == 'XSCYFInspectionHistoryList' || item.TypeID == 6) && ID && ID != '') {
            //巡检 稀释采样法
            item.formUrl = neturl + '/appoperation/appdilutionsamplingrecord' + '/' + ID + '/' + 6;
        } else if ((item.TypeName == 'ZZCLFInspectionHistoryList' || item.TypeID == 7) && ID && ID != '') {
            //巡检 直接测量法
            item.formUrl = neturl + '/appoperation/appdirectmeasurementrecord' + '/' + ID + '/' + 7;
        } else if ((item.TypeName == 'JzHistoryList' || item.TypeID == 8 ) && ID && ID != '') {
            //校准
            item.formUrl = neturl + '/appoperation/appjzrecord' + '/' + ID + '/' + 8;
        } else if ((item.TypeName == 'BdTestHistoryList' || item.TypeID == 9) && ID && ID != '') {
            //校验
            item.formUrl = neturl + '/appoperation/appbdtestrecord' + '/' + ID + '/' + 9;
        } else if ((item.TypeName == 'DeviceExceptionHistoryList' || item.TypeID == 10) && ID && ID != '') {
            //数据异常
            item.formUrl = neturl + '/appoperation/appdeviceexceptionrecord' + '/' + ID + '/' + 10;
        } else if ((item.TypeName == 'Maintain' || item.TypeID == 27) && ID && ID != '') {
            //保养项更换记录表
            item.formUrl = neturl + '/appoperation/appmaintainrepalcerecord' + '/' + ID + '/' + 10;
        } else if ((item.TypeID == 58 || item.TypeID == 59 ) && ID && ID != '') {
            //设备故障小时记录 20220428没有|| item.TypeID == 60
            item.formUrl = neturl + '/appoperation/appfailurehoursrecord' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 64  && ID && ID != '') {
            //设备参数变动记录 废气
            item.formUrl = neturl + '/appoperation/appGasDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeID == 65||item.TypeID == 73)  && ID && ID != '') {
            //上月委托第三方检测次数
            item.formUrl = neturl + '/appoperation/appThirdPartyTestingContent' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeID == 18||item.TypeID == 63)  && ID && ID != '') {
            //数据一致性记录表 实时
            item.formUrl = neturl + '/appoperation/appDataConsistencyRealTime' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeID == 66||item.TypeID == 74)  && ID && ID != '') {
            //数据一致性记录表 小时与日数据
            item.formUrl = neturl + '/appoperation/appDataConsistencyRealDate' + '/' + ID + '/' + item.TypeID;
        } else if ((item.TypeID == 62||item.TypeID == 61)  && ID && ID != '') {
            //配合检查记录 
            item.formUrl = neturl + '/appoperation/appCooperaInspection' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 19  && ID && ID != '') {
            //实际水样对比实验结果记录表
            item.formUrl = neturl + '/appoperation/comparisonTestResults' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 72  && ID && ID != '') {
            // 设备参数核对记录 水
            item.formUrl = neturl + '/appoperation/appDeviceParameterChange' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 15  && ID && ID != '') {
            // 试剂更换记录表 水
            item.formUrl = neturl + '/appoperation/appreagentreplaceRecord' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 70  && ID && ID != '') {
            // 标准溶液检查记录 水
            item.formUrl = neturl + '/appoperation/appStandardSolutionVerificationRecord' + '/' + ID + '/' + item.TypeID;
        } else if (item.TypeID == 16  && ID && ID != '') {
            // 校准记录表 污水
            item.formUrl = neturl + '/appoperation/appWaterQualityCalibrationRecord' + '/' + ID + '/' + item.TypeID;
        } else {
            item.formUrl = '';
        }
    });
};

export const createFormUrlByTypeID = (TaskFormList, neturl) => {
    /**
     * 2 StopCemsHistoryList
     * 1 RepairHistoryList
     * 3 ConsumablesReplaceHistoryList
     * 4 StandardGasRepalceHistoryList
     * 5 WQCQFInspectionHistoryList
     * 6 XSCYFInspectionHistoryList
     * 7 ZZCLFInspectionHistoryList
     * 8 JzHistoryList
     * 9 BdTestHistoryList
     * 10 DeviceExceptionHistoryList
     */
    // neturl = 'http://172.16.12.77:8000';//测试
    if (TaskFormList && TaskFormList.length > 0) {
        TaskFormList.map(item => {
            if (item.TypeID == 2 && item.TaskID && item.TaskID != '') {
                //停机
                item.formUrl = neturl + '/appoperation/appstopcemsrecord' + '/' + item.TaskID + '/' + 2;
            } else if (item.TypeID == 1 && item.TaskID && item.TaskID != '') {
                //维修
                item.formUrl = neturl + '/appoperation/apprepairrecord' + '/' + item.TaskID + '/' + 1;
            } else if (item.TypeID == 3 && item.TaskID && item.TaskID != '') {
                //易耗品
                item.formUrl = neturl + '/appoperation/appconsumablesreplacerecord' + '/' + item.TaskID + '/' + 3;
            } else if (item.TypeID == 4 && item.TaskID && item.TaskID != '') {
                //标气
                item.formUrl = neturl + '/appoperation/appstandardgasreplacerecord' + '/' + item.TaskID + '/' + 4;
            } else if (item.TypeID == 5 && item.TaskID && item.TaskID != '') {
                //巡检 完全抽取法
                item.formUrl = neturl + '/appoperation/appcompleteextractionrecord' + '/' + item.TaskID + '/' + 5;
            } else if (item.TypeID == 6 && item.TaskID && item.TaskID != '') {
                //巡检 稀释采样法
                item.formUrl = neturl + '/appoperation/appdilutionsamplingrecord' + '/' + item.TaskID + '/' + 6;
            } else if (item.TypeID == 7 && item.TaskID && item.TaskID != '') {
                //巡检 直接测量法
                item.formUrl = neturl + '/appoperation/appdirectmeasurementrecord' + '/' + item.TaskID + '/' + 7;
            } else if (item.TypeID == 8 && item.TaskID && item.TaskID != '') {
                //校准
                item.formUrl = neturl + '/appoperation/appjzrecord' + '/' + item.TaskID + '/' + 8;
            } else if (item.TypeID == '9' && item.TaskID && item.TaskID != '') {
                //校验
                item.formUrl = neturl + '/appoperation/appbdtestrecord' + '/' + item.TaskID + '/' + 9;
            } else if (item.TypeID == 10 && item.TaskID && item.TaskID != '') {
                //数据异常
                item.formUrl = neturl + '/appoperation/appdeviceexceptionrecord' + '/' + item.TaskID + '/' + 10;
            } else {
                item.formUrl = '';
            }
        });
    }
};

// export const handleTaskLogList = (TaskLogList) => {
//     let timeArr;
//     let logLength_1 = TaskLogList.length - 1;
//     TaskLogList.map((item,key)=>{
//         timeArr = item.CreateTime.split(' ');
//         item.time = timeArr[0].substr(5,5)+'\n'+timeArr[1].substr(0,5);
//         if (item.TaskStatus ==1) {
//             //待执行 创建任务
//             if (key == logLength_1){
//                 item.icon = require('../images/createTask_current.png');
//                 item.timeColor = globalcolor.importantFont;
//             } else {
//                 item.icon = require('../images/createTask.png');
//                 item.timeColor = globalcolor.datepickerGreyText;
//             }
//         } else if (item.TaskStatus == 9) {
//             //签到
//             if (key == logLength_1){
//                 item.icon = require('../images/clockIn_current.png');
//                 item.timeColor = globalcolor.importantFont;
//             } else {
//                 item.icon = require('../images/clockIn.png');
//                 item.timeColor = globalcolor.datepickerGreyText;
//             }
//         } else if (item.TaskStatus == 2) {
//             //暂存
//             if (key == logLength_1){
//                 item.icon = require('../images/saveTask_current.png');
//                 item.timeColor = globalcolor.importantFont;
//             } else {
//                 item.icon = require('../images/saveTask.png');
//                 item.timeColor = globalcolor.datepickerGreyText;
//             }
//         } else {
//             //3 完成
//             if (key == logLength_1){
//                 item.icon = require('../images/completeTask_current.png');
//                 item.timeColor = globalcolor.importantFont;
//             } else {
//                 item.icon = require('../images/completeTask.png');
//                 item.timeColor = globalcolor.datepickerGreyText;
//             }
//         }
//     });
// };
