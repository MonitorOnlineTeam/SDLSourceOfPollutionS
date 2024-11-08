/*
 * @Description:主页 tabview
 * @LastEditors: hxf
 * @Date: 2023-08-09 11:24:20
 * @LastEditTime: 2024-11-01 11:18:29
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/MyTabView.js
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { View, Text, Image } from 'react-native'
import { useSelector } from 'react-redux';
import globalcolor from '../../config/globalcolor';
import Actions from '../../utils/RouterUtils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRouterConfig } from '../../dvapack/storage';
import Account from '../../components/page/account/Account';
import Workbench from './workbench/Workbench';
import ChengTaoXiaoXi from './chengTaoXiaoXi'
import PollutionAll from './map/PollutionAll';
import { Touchable } from '../../components';
import { dispatch } from '../../../index'
import { createAction, NavigationActions } from '../../utils';


const Tab = createBottomTabNavigator();

// 路由的地址是这个方法的名字 目前是'MyTab'
export default function MyTab() {
    // const { tabviews } = useSelector(state => state.router);
    const { curPage } = useSelector(state => state.map);
    // console.log('tabviews = ', tabviews);
    let tabviews = [];
    let navs = getRouterConfig();
    console.log('navs = ', navs);
    console.log('curPage = ', curPage);
    navs.forEach((item) => {
        if (item.routeName == 'Account') {
            Account.name = 'Account';
            tabviews.push({
                view: Account, options: {
                    headerShown: false
                }
            });
        } else if (item.routeName == 'chengTaoXiaoXi') {
            ChengTaoXiaoXi.name = 'chengTaoXiaoXi';
            tabviews.push({
                view: ChengTaoXiaoXi, options: {
                    title: '消息',
                    headerStyle: {
                        backgroundColor: globalcolor.headerBackgroundColor,
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerTitleAlign: 'center',
                    // headerLeft: (props) => {
                    //     return (<Pressable >
                    //         <Image source={require('@images/ic_map.png')} style={[{ width: 20, marginLeft: 16, height: 20 }]} />
                    //     </Pressable>)
                    // },
                    // headerRight: (props) => {
                    //     return (<Pressable >
                    //         <Image source={require('@images/ic_search.png')} style={[{ width: 20, marginRight: 16, height: 20 }]} />
                    //     </Pressable>)
                    // }
                }
            });
        } else if (item.routeName == 'PollutionAll') {
            PollutionAll.name = 'PollutionAll';
            let name = '监控';
            let leftImg = require('../../images/ic_map.png');
            if (curPage == 'map') {
                name = '地图';
                leftImg = require('../../images/ic_map_list.png');
            } else {
                name = '监控';
                leftImg = require('../../images/ic_map.png');
            }
            tabviews.push({
                view: PollutionAll, options: {
                    title: name,
                    headerStyle: {
                        backgroundColor: globalcolor.headerBackgroundColor,
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerTitleAlign: 'center',
                    headerLeft: (props) => {
                        return (<Touchable
                            style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                // navigation.state.params.navigateLeftPress();
                                if (curPage == 'map') {
                                    dispatch(createAction('map/updateState')({ curPage: 'list' }));
                                } else {
                                    // this.props.dispatch();
                                    console.log('dispatch = ', dispatch);
                                    dispatch(createAction('map/updateState')({ curPage: 'map' }));
                                }
                            }}
                        >
                            <Image style={{ width: 18, height: 18 }} source={leftImg} />
                        </Touchable>);
                        //     return (<Pressable >
                        //         <Image source={require('@images/ic_map.png')} style={[{ width: 20, marginLeft: 16, height: 20 }]} />
                        //     </Pressable>)
                    },
                    headerRight: (props) => {
                        return (<Touchable
                            style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                dispatch(NavigationActions.navigate({ routeName: 'SearchList' }));
                            }}
                        >
                            <Image style={{ width: 18, height: 18 }} source={require('../../images/ic_search.png')} />
                        </Touchable>);
                    }
                }
            });
        } else if (item.routeName == 'Workbench') {
            Workbench.name = 'Workbench';
            tabviews.push({
                view: Workbench, options: {
                    title: '工作台',
                    headerStyle: {
                        backgroundColor: globalcolor.headerBackgroundColor,
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerTitleAlign: 'center',
                    // headerLeft: (props) => {
                    //     return (<Pressable >
                    //         <Image source={require('@images/ic_map.png')} style={[{ width: 20, marginLeft: 16, height: 20 }]} />
                    //     </Pressable>)
                    // },
                    // headerRight: (props) => {
                    //     return (<Pressable >
                    //         <Image source={require('@images/ic_search.png')} style={[{ width: 20, marginRight: 16, height: 20 }]} />
                    //     </Pressable>)
                    // }
                }
            });
        }
    })

    let createBottomTabOption = {
        initTabName: 'Workbench'
        , _tabBarIcon: (route, focused) => {
            if (route.name == 'Account') {
                return <Image
                    source={require('../../images/ic_tab_account.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            } else if (route.name == 'Workbench') {
                return <Image
                    source={require('../../images/ic_tab_alarm.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            } else if (route.name == 'chengTaoXiaoXi') {
                return <Image
                    source={require('../../images/ic_tab_message.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            } else if (route.name == 'PollutionAll') {
                return <Image
                    source={require('../../images/ic_tab_data.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            } else {
                return <Image
                    source={require('../../images/ic_tab_account.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            }
        }
        , _tabBarLabel: (route, focused) => {
            console.log('_tabBarIcon route = ', route);
            // return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{'监控'}</Text>
            if (route.name == 'Account') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'我的'}</Text>
            } else if (route.name == 'Workbench') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'工作台'}</Text>
            } else if (route.name == 'chengTaoXiaoXi') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'消息'}</Text>
            } else if (route.name == 'PollutionAll') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'监控'}</Text>
            } else {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'功能'}</Text>
            }
            // if (route.name == 'PollutionSourceMonitoring') {
            //     return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{'监控'}</Text>
            // } else if (route.name == 'WorkBench') {
            //     return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{'工作台'}</Text>
            // } else if (route.name == 'Account') {
            //     return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{'我的'}</Text>
            // } else {
            //     return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{route.name}</Text>
            // }
        }
    }
    return (
        <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
            {
                Actions.createBottomTab(tabviews, createBottomTabOption)()
            }
            {/* <Text>tebView</Text> */}
        </View>
    )
}
