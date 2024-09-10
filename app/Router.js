/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-09-02 19:17:19
 * @LastEditTime: 2024-09-06 17:26:39
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