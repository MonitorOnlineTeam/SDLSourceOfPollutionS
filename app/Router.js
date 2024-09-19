/*
 * @Description: 
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2024-09-02 19:17:19
 * @LastEditTime: 2024-09-19 18:15:55
 * @FilePath: /SDLMainProject/app/Router.js
 */
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { init, Geolocation } from 'react-native-amap-geolocation';

import RootView from './framework/RootView';
import Actions from './utils/RouterUtils';
import BootPage from './components/page/login/BootPage';
import Login from './components/page/login/Login';
import MyTabView from './pOperationContainers/tabView/MyTabView';
import SetEnterpriseInformation from './components/page/login/SetEnterpriseInformation_dev';
import { loadRootUrl } from './dvapack/storage';
import AdvertBootPage from './components/page/login/AdvertBootPage';
import SearchList from './pOperationContainers/tabView/map/SearchList';
import GTaskOfEnterprise from './pOperationContainers/tabView/workbench/GTaskOfEnterprise';
import { NavigationActions } from './utils';
import { DeclareModule, SDLText } from './components';
import { dispatch } from '../index'
import { useDispatch } from 'react-redux';
import TaskRecord from './pOperationContainers/tabView/workbench/TaskRecord';
import CreateTask from './pOperationContainers/tabView/workbench/CreateTask';
import AnnouncementsList from './pOperationContainers/tabView/workbench/AnnouncementsList';
import CusWebView from './components/CusWebView';
import PointDetail from './pollutionContainers/pointDetails/PointDetail';
import HistoryData from './pollutionContainers/pointDetails/HistoryData';
import TestView from './pOperationContainers/TestView';
import ContactOperation from './pOperationContainers/components/ContactOperation';
import SearchListWithoutLoad from './components/page/SearchListWithoutLoad';
import GTasks from './pOperationContainers/tabView/workbench/GTasks';
import TaskDetail from './pOperationContainers/taskDetail/TaskDetail';
import WaterMaskCamera from './pOperationContainers/taskDetail/WaterMaskCamera';
import DownLoadAPP from './components/page/account/DownLoadAPP';
import OverData from './pollutionContainers/pointDetails/OverData';
import ExceptionData from './pollutionContainers/pointDetails/ExceptionData';
import MissDataList from './pollutionContainers/pointDetails/MissDataList';
import OverAlarmVerify from './pOperationContainers/tabView/alarm/OverAlarmVerify';
import VerifyRecords from './pollutionContainers/pointDetails/VerifyRecords';
import SignInEnter from './pOperationContainers/tabView/workbenchSignin/SignInEnter';
import SupplementarySignIn from './pOperationContainers/tabView/workbenchSignin/SupplementarySignIn';
import SignInStatistics from './pOperationContainers/tabView/workbenchSignin/SignInStatistics';
import SupplementarySignInRecord from './pOperationContainers/tabView/workbenchSignin/SupplementarySignInRecord';
import SupplementarySignInApprove from './pOperationContainers/tabView/workbenchSignin/SupplementarySignInApprove';
import ChengTaoSignIn from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoSignIn2';
import CTProjectInfoList from './pOperationContainers/tabView/chengTaoXiaoXi/CTProjectInfoList';
import SparePartsChangeEditor from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeEditor';
import SparePartsChangeRecords from './pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeRecords';
import OverWarning from './pOperationContainers/tabView/workbench/OverWarning';
import OverAlarm from './pOperationContainers/tabView/workbench/OverAlarm';
import ExceptionAlarm from './pOperationContainers/tabView/workbench/ExceptionAlarm';
import MissAlarm from './pOperationContainers/tabView/workbench/MissAlarm';
import AlarmRecords from './pollutionContainers/pointDetails/AlarmRecords';
// import Login from './components/page/login/Login';
// const dispatch = useDispatch();

/* jab */
import ServiceDispatchMessage from './pOperationContainers/tabView/chengTaoXiaoXi/ServiceDispatchMessage';
import NormalMessageDetail from './pOperationContainers/tabView/chengTaoXiaoXi/NormalMessageDetail';
import PerformanceDetail from './pOperationContainers/tabView/workbench/PerformanceDetail';
import SuperviseRectifyDetail from './pOperationContainers/tabView/workbench/SuperviseRectifyDetail';
import ServiceReminderInfoDetail from './pOperationContainers/tabView/workbench/ServiceReminderInfoDetail';
import ReviewWorkOrderStatistics from './pOperationContainers/tabView/workbench/ReviewWorkOrderStatistics';
// import ChengTaoTaskDetail from './pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoTaskDetail';
import HelpCenter from './components/page/account/HelpCenter';
import DownLoadAPP from './components/page/account/DownLoadAPP';
import OperaStaffInfo from './pollutionContainers/pointDetails/OperaStaffInfo';
import AccountSecurity from './components/page/account/AccountSecurity';
import PushSetting from './components/page/account/PushSetting';
// import OfflineImageUploadList from './components/page/account/OfflineImageUploadList';
function Test() {
    return (
        <View>
            <Text>Router</Text>
        </View>
    )
}
Actions.pushViewWithName(BootPage, 'BootPage', { headerShown: false });
Actions.pushViewWithName(AdvertBootPage, 'AdvertBootPage', { headerShown: false });
Actions.pushViewWithName(Login, 'Login', { headerShown: false });
Actions.pushViewWithName(SetEnterpriseInformation, 'SetEnterpriseInformation', { headerShown: false });
Actions.pushViewWithName(MyTabView, 'MyTab', { headerShown: false });
Actions.pushViewWithName(SearchList, 'SearchList', { headerShown: false });
Actions.pushViewWithName(GTaskOfEnterprise, 'GTaskOfEnterprise', {
    title: '待办任务', headerRight: () => (
        <TouchableOpacity
            onPress={() => {
                dispatch(NavigationActions.navigate({ routeName: 'TaskRecord' }));
            }}
        >
            <SDLText style={{ color: '#fff', marginLeft: 16 }}>{'工单记录'}</SDLText>
        </TouchableOpacity>
    )
});
Actions.pushViewWithName(TaskRecord, 'TaskRecord', {
    title: '任务记录', headerRight: () => (
        <DeclareModule
            contentRender={() => {
                return <Text style={[{ fontSize: 13, color: 'white', marginLeft: 16 }]}>{'说明'}</Text>;
            }}
            options={{
                headTitle: '说明',
                innersHeight: 140,
                messText: `任务工单在结束后720分钟内允许修改。`,
                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                buttons: [
                    {
                        txt: '知道了',
                        btnStyle: { backgroundColor: '#fff' },
                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                        onpress: () => { }
                    }
                ]
            }}
        />
    )
});
Actions.pushViewWithName(CreateTask, 'CreateTask', { title: '创建任务' });
Actions.pushViewWithName(AnnouncementsList, 'AnnouncementsList', { title: '通知公告' });
Actions.pushViewWithName(CusWebView, 'CusWebView', { title: '公告详情' });
Actions.pushViewWithName(PointDetail, 'PointDetail', { title: '站点详情' });
Actions.pushViewWithName(HistoryData, 'HistoryData', { title: '数据查询' });
Actions.pushViewWithName(TestView, 'TestView', { title: '测试页面' });
Actions.pushViewWithName(ContactOperation, 'ContactOperation', { title: '监测目标' });
Actions.pushViewWithName(SearchListWithoutLoad, 'SearchListWithoutLoad', { title: '监测点选择' });
Actions.pushViewWithName(GTasks, 'GTasks', { title: '待办任务' });
Actions.pushViewWithName(TaskDetail, 'TaskDetail', { title: '任务详情' });
Actions.pushViewWithName(WaterMaskCamera, 'WaterMaskCamera', { headerShown: false });
Actions.pushViewWithName(DownLoadAPP, 'DownLoadAPP', { title: '下载应用' });
Actions.pushViewWithName(OverData, 'OverData', { title: '超标数据' });
Actions.pushViewWithName(ExceptionData, 'ExceptionData', { title: '异常数据' });
Actions.pushViewWithName(MissDataList, 'MissDataList', { title: '确实数据' });
// Actions.pushViewWithName(OverAlarmVerify, 'OverAlarmVerify', { title: '超标核实记录' });
Actions.pushViewWithName(VerifyRecords, 'VerifyRecords', { title: '超标核实记录' });
Actions.pushViewWithName(SignInEnter, 'SignInEnter', { title: '签到' });
Actions.pushViewWithName(SupplementarySignIn, 'SupplementarySignIn', {
    title: '补签', headerRight: () => (
        <TouchableOpacity
            onPress={() => {
                dispatch(NavigationActions.navigate({
                    routeName: 'SupplementarySignInRecord'
                    , params: {}
                }));
            }}
        >
            <SDLText style={{ color: '#fff', marginLeft: 16 }}>{'补签记录'}</SDLText>
        </TouchableOpacity>
    )
});
Actions.pushViewWithName(SignInStatistics, 'SignInStatistics', { title: '统计' });
Actions.pushViewWithName(SupplementarySignInRecord, 'SupplementarySignInRecord', { title: '补签记录' });
Actions.pushViewWithName(SupplementarySignInApprove, 'SupplementarySignInApprove', { title: '补签记录' });

//成套签到
Actions.pushViewWithName(ChengTaoSignIn, 'ChengTaoSignIn', { title: '签到' });
Actions.pushViewWithName(CTProjectInfoList, 'CTProjectInfoList', { title: '项目信息' });

// 成套备件更换
Actions.pushViewWithName(SparePartsChangeEditor, 'SparePartsChangeEditor', { title: '备件更换' });
Actions.pushViewWithName(SparePartsChangeRecords, 'SparePartsChangeRecords', { title: '备件更换历史记录' });

// 数据报警
Actions.pushViewWithName(OverWarning, 'OverWarning', { title: '超标预警' });
Actions.pushViewWithName(OverAlarm, 'OverAlarm', { title: '超标报警' });
Actions.pushViewWithName(ExceptionAlarm, 'ExceptionAlarm', { title: '异常报警' });
Actions.pushViewWithName(MissAlarm, 'MissAlarm', { title: '异常报警' });
Actions.pushViewWithName(AlarmRecords, 'AlarmRecords', { title: '报警详情' });

/* jab */
// 消息中心
Actions.pushViewWithName(ServiceDispatchMessage, 'ServiceDispatchMessage');
Actions.pushViewWithName(NormalMessageDetail, 'NormalMessageDetail');//  成套通用消息详情
Actions.pushViewWithName(SuperviseRectifyDetail, 'SuperviseRectifyDetail', { title: '督查结果' });//督查整改详情
Actions.pushViewWithName(PerformanceDetail, 'PerformanceDetail', { title: '绩效消息' });//绩效消息详情
Actions.pushViewWithName(ReviewWorkOrderStatistics, 'ReviewWorkOrderStatistics');//绩效消息-审核工单统计详情
Actions.pushViewWithName(ServiceReminderInfoDetail, 'ServiceReminderInfoDetail', { title: '服务提醒' });// 服务提醒详情
// Actions.pushViewWithName(ChengTaoTaskDetail, 'ChengTaoTaskDetail', { title: '派单详情' });// 成套派单详情
// 我的
Actions.pushViewWithName(HelpCenter, 'HelpCenter', { title: '帮助中心' }); //帮助中心
Actions.pushViewWithName(DownLoadAPP, 'DownLoadAPP', { title: '下载应用' }); //下载应用
Actions.pushViewWithName(OperaStaffInfo, 'OperaStaffInfo', { title: '我的证书' }); //查看运维人员信息
Actions.pushViewWithName(AccountSecurity, 'AccountSecurity', { title: '账户与安全' }); //下载应用
Actions.pushViewWithName(PushSetting, 'PushSetting', { title: '推送设置' }); //推送设置
// Actions.pushViewWithName(OfflineImageUploadList, 'OfflineImageUploadList', { title: '离线图片上传' }); //离线图片上传



Actions.pushView(Test, { headerShown: false });

const Stack = createNativeStackNavigator();
export default function Router() {

    useEffect(() => {
        async function initf() {
            await loadRootUrl();
            init({
                ios: '9df5f713ad0f0b8d2550436f5793e371',
                android:
                    CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_PROJECT'
                        ? // ? '4502a480cb8cefdeb655628a5c89c36d'
                        '90af9eb2dd0b43367d0102d81842b5f7'
                        : CURRENT_PROJECT == 'GRID_PROJECT'
                            ? 'c1e5f6237a8bdd6d80cca037d9d48721'
                            : CURRENT_PROJECT == 'GRID_ORERATION_PROJECT'
                                ? 'e0038624faec949f08168cc5dc41222a'
                                : '90af9eb2dd0b43367d0102d81842b5f7'
            }); //后台定位~
        }
        initf();
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
                <Stack.Screen
                    name="RootView"
                    component={RootView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}