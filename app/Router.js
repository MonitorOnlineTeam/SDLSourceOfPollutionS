/*
 * @Description: 
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2024-09-02 19:17:19
 * @LastEditTime: 2024-09-19 17:27:58
 * @FilePath: /SDLMainProject/app/Router.js
 */
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
// import Login from './components/page/login/Login';
// const dispatch = useDispatch();

//jab
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


//jab 消息中心
Actions.pushViewWithName(ServiceDispatchMessage, 'ServiceDispatchMessage');
Actions.pushViewWithName(NormalMessageDetail, 'NormalMessageDetail');//  成套通用消息详情
Actions.pushViewWithName(SuperviseRectifyDetail, 'SuperviseRectifyDetail', { title: '督查结果' });//督查整改详情
Actions.pushViewWithName(PerformanceDetail, 'PerformanceDetail', { title: '绩效消息' });//绩效消息详情
Actions.pushViewWithName(ReviewWorkOrderStatistics, 'ReviewWorkOrderStatistics');//绩效消息-审核工单统计详情
Actions.pushViewWithName(ServiceReminderInfoDetail, 'ServiceReminderInfoDetail', { title: '服务提醒' });// 服务提醒详情
// Actions.pushViewWithName(ChengTaoTaskDetail, 'ChengTaoTaskDetail', { title: '派单详情' });// 成套派单详情

//jab 我的
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
        async function init() {
            await loadRootUrl();
        }
        init();
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