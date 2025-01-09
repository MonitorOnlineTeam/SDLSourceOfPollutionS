/*
 * @Description:主页 tabview
 * @LastEditors: hxf
 * @Date: 2023-08-09 11:24:20
 * @LastEditTime: 2025-01-09 10:41:31
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/MyTabView.js
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { useSelector } from 'react-redux';
import globalcolor from '../../config/globalcolor';
import Actions from '../../utils/RouterUtils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRouterConfig } from '../../dvapack/storage';
import Account from '../../components/page/account/Account';
import NewAccount from '../../components/page/account/NewAccount';
import Workbench from './workbench/Workbench';
import ChengTaoXiaoXi from './chengTaoXiaoXi'
import PollutionAll from './map/PollutionAll';
import { Touchable } from '../../components';
import { dispatch } from '../../../index'
import { createAction, NavigationActions } from '../../utils';
import DataForm from './data/DataForm';
import OverWarning from './workbench/OverWarning';
import Alarm from './alarm/Alarm';
import moment from 'moment';
import TabAlarmList from './alarm/TabAlarmList';


const Tab = createBottomTabNavigator();

// 路由的地址是这个方法的名字 目前是'MyTab'
export default function MyTab() {
    const { showPointList_List, curPage } = useSelector(state => state.map);
    // showPointList: map.showPointList_List
    const { routerConfig } = useSelector(state => state.login);
    const { messageCount } = useSelector(state => state.notice);
    const { tabAlarmAllCount,
        tabAlarmWarningButton, tabAlarmOverButton,
        tabAlarmMissExceptionButton,
        tabAlarmExceptionButton,
    } = useSelector(state => state.tabAlarmListModel);
    const { accountHeaderId // 我的头部id
        , accountOptionList // 我的选项列表
    } = useSelector(state => state.account);
    const { OverWarningCount, monitorAlarmTotal,
        workWarningButton,
        workAlarmOverButton,
        workAlarmMissExceptionButton,
        workAlarmExceptionButton,
    } = useSelector(state => state.alarm);
    const { initialRouteName } = useSelector(state => state.login);
    const { alarmTabLoadTimes } = useSelector(state => state.tabAlarmListModel);
    let newTabviews = [];
    const [tabviews, setTabviews] = useState([]);
    const [warningTabLoadTimes, setWarningTabLoadTimes] = useState(0);
    // const [alarmTabLoadTimes, setAlarmTabLoadTimes] = useState(0);
    const [dataFormLoadTimes, setDataFormLoadTimes] = useState(0);
    const [chengTaoXiaoXiLoadTimes, setChengTaoXiaoXiLoadTimes] = useState(0);
    useEffect(() => {
        let navs = routerConfig;
        newTabviews = [];
        navs.forEach((item) => {
            if (item.routeName == 'Account') {
                if (accountHeaderId == "b1320831-30c3-4429-98ad-b3f5217c228e"
                ) {
                    // 头部2 企业
                    NewAccount.name = 'Account';
                    newTabviews.push({
                        view: NewAccount, options: {
                            headerShown: false
                        }
                    });
                } else {
                    // "929253d2-68e0-43d9-bfd5-b35baa7889b0"
                    //  头部1 运维人员
                    Account.name = 'Account';
                    newTabviews.push({
                        view: Account, options: {
                            headerShown: false
                        }
                    });
                }

            } else if (item.routeName == 'DataForm') {
                DataForm.name = 'DataForm';
                newTabviews.push({
                    view: DataForm, options: {
                        title: '数据一览',
                        headerStyle: {
                            backgroundColor: globalcolor.headerBackgroundColor,
                        },
                        headerTitleStyle: {
                            color: 'white'
                        },
                        headerTitleAlign: 'center',
                    }
                });
            } else if (item.routeName == 'chengTaoXiaoXi') {
                ChengTaoXiaoXi.name = 'chengTaoXiaoXi';
                if (messageCount > 0) {
                    newTabviews.push({
                        view: ChengTaoXiaoXi, options: {
                            tabBarBadge: messageCount,
                            title: '消息',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                } else {
                    newTabviews.push({
                        view: ChengTaoXiaoXi, options: {
                            title: '消息',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                }

                // OverWarning.name = 'OverWarning';
                // if (OverWarningCount > 0) {
                //     newTabviews.push({
                //         view: OverWarning, options: {
                //             tabBarBadge: OverWarningCount,
                //             title: '预警',
                //             headerStyle: {
                //                 backgroundColor: globalcolor.headerBackgroundColor,
                //             },
                //             headerTitleStyle: {
                //                 color: 'white'
                //             },
                //             headerTitleAlign: 'center',
                //         }
                //     });
                // } else {
                //     newTabviews.push({
                //         view: OverWarning, options: {
                //             title: '预警',
                //             headerStyle: {
                //                 backgroundColor: globalcolor.headerBackgroundColor,
                //             },
                //             headerTitleStyle: {
                //                 color: 'white'
                //             },
                //             headerTitleAlign: 'center',
                //         }
                //     });
                // }

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
                newTabviews.push({
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
                                        dispatch(createAction('map/updateState')({ curPage: 'map' }));
                                    }
                                }}
                            >
                                <Image style={{ width: 18, height: 18 }} source={leftImg} />
                            </Touchable>);
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
                newTabviews.push({
                    view: Workbench, options: {
                        title: '工作台',
                        headerStyle: {
                            backgroundColor: globalcolor.headerBackgroundColor,
                        },
                        headerTitleStyle: {
                            color: 'white'
                        },
                        headerTitleAlign: 'center',
                    }
                });

                // Alarm.name = 'Alarm';
                // if (monitorAlarmTotal > 0) {
                //     newTabviews.push({
                //         view: Alarm, options: {
                //             tabBarBadge: monitorAlarmTotal,
                //             title: '报警',
                //             headerStyle: {
                //                 backgroundColor: globalcolor.headerBackgroundColor,
                //             },
                //             headerTitleStyle: {
                //                 color: 'white'
                //             },
                //             headerTitleAlign: 'center',
                //         }
                //     });
                // } else {
                //     newTabviews.push({
                //         view: Alarm, options: {
                //             title: '报警',
                //             headerStyle: {
                //                 backgroundColor: globalcolor.headerBackgroundColor,
                //             },
                //             headerTitleStyle: {
                //                 color: 'white'
                //             },
                //             headerTitleAlign: 'center',
                //         }
                //     });
                // }
            } else if (item.routeName == 'OverWarning') {
                OverWarning.name = 'OverWarning';
                if (OverWarningCount > 0) {
                    newTabviews.push({
                        view: OverWarning, options: {
                            tabBarBadge: OverWarningCount,
                            title: '预警',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                } else {
                    newTabviews.push({
                        view: OverWarning, options: {
                            title: '预警',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                }
            } else if (item.routeName == 'Alarm') {
                // Alarm.name = 'Alarm';
                // TabAlarmList.name = 'Alarm';
                if (tabAlarmAllCount > 0) {
                    newTabviews.push({
                        view: TabAlarmList, options: {
                            tabBarBadge: tabAlarmAllCount,
                            title: '报警',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                } else {
                    newTabviews.push({
                        view: TabAlarmList, options: {
                            title: '报警',
                            headerStyle: {
                                backgroundColor: globalcolor.headerBackgroundColor,
                            },
                            headerTitleStyle: {
                                color: 'white'
                            },
                            headerTitleAlign: 'center',
                        }
                    });
                }
            }
        })
        setTabviews(newTabviews);
    }, [routerConfig, messageCount
        , curPage, OverWarningCount
        , monitorAlarmTotal, accountHeaderId
        , tabAlarmAllCount])

    console.log('createBottomTabOption initialRouteName = ', initialRouteName);
    let createBottomTabOption = {
        // initTabName: 'Workbench' 
        initTabName: initialRouteName
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
            } else if (route.name == 'OverWarning') {
                return <Image
                    source={require('../../images/ic_tab_alarm.png')}
                    style={{ width: 24, height: 24, tintColor: focused ? globalcolor.headerBackgroundColor : 'grey' }}
                />;
            } else if (route.name == 'Alarm' || route.name == 'TabAlarmList') {
                return <Image
                    source={require('../../images/ic_tab_alarm.png')}
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
            // return <Text style={focused ? { color: globalcolor.tintblue } : {}} >{'监控'}</Text>
            if (route.name == 'Account') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'我的'}</Text>
            } else if (route.name == 'Workbench') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'工作台'}</Text>
            } else if (route.name == 'chengTaoXiaoXi') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'消息'}</Text>
            } else if (route.name == 'PollutionAll') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'监控'}</Text>
            } else if (route.name == 'DataForm') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'数据'}</Text>
            } else if (route.name == 'OverWarning') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'预警'}</Text>
            } else if (route.name == 'Alarm' || route.name == 'TabAlarmList') {
                return <Text style={focused ? { color: globalcolor.headerBackgroundColor } : { color: '#666666' }} >{'报警'}</Text>
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
                Actions.createBottomTab(tabviews, createBottomTabOption
                    , (routeName) => {
                        // 点击tab 触发此事件
                        console.log('routeName = ', routeName);

                        dispatch(createAction('tabAlarmListModel/getAlarmCountForEnt')({}));

                        if (routeName == 'chengTaoXiaoXi') {
                            if (typeof chengTaoXiaoXiLoadTimes == 'number'
                                && chengTaoXiaoXiLoadTimes != 0
                            ) {
                                dispatch(createAction('notice/updateState')({ pushMessageListResult: { status: -1 } }));
                            } else {
                                setChengTaoXiaoXiLoadTimes(1);
                            }
                        }
                        dispatch(createAction('notice/getNewPushMessageList')({}));
                        dispatch(createAction('alarm/getAlarmCount')({
                            params: {
                                alarmType: 'WorkbenchOver'
                            }
                        }));
                        dispatch(createAction('alarm/getAlarmCount')({
                            params: {
                                alarmType: 'OverWarning'
                            }
                        }));
                        if (routeName == 'OverWarning') {
                            dispatch(
                                createAction('pointDetails/updateState')({
                                    sourceType: 'OverWarning'
                                })
                            );
                            dispatch(createAction('alarm/updateState')({
                                monitorAlarmIndex: 1, monitorAlarmTotal: 0
                                , monitorAlarmResult: { status: -1 }
                                , sourceType: 'tabOverWarning'
                            }));
                            if (typeof warningTabLoadTimes == 'number'
                                && warningTabLoadTimes !== 0
                            ) {
                                dispatch(
                                    createAction('alarm/getAlarmRecords')({
                                        params: {
                                            BeginTime: moment()
                                                .subtract(1, 'days')
                                                .format('YYYY-MM-DD 00:00:00'),
                                            EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            AlarmType: '2',
                                            PageIndex: 1,
                                            PageSize: 20
                                        }
                                    })
                                );
                            } else {
                                setWarningTabLoadTimes(1);
                            }
                        }
                        if (routeName == 'Workbench') {
                            console.log('workWarningButton = ', workWarningButton);
                            console.log('workAlarmOverButton = ', workAlarmOverButton);
                            console.log('workAlarmMissExceptionButton = ', workAlarmMissExceptionButton);
                            console.log('workAlarmExceptionButton = ', workAlarmExceptionButton);
                            dispatch(createAction('alarm/updateState')({
                                warningButton: workWarningButton,
                                alarmOverButton: workAlarmOverButton,
                                alarmMissExceptionButton: workAlarmMissExceptionButton,
                                alarmExceptionButton: workAlarmExceptionButton,
                            }));
                        }
                        if (routeName == 'Alarm'
                            || routeName == 'TabAlarmList'
                        ) {

                            if (typeof alarmTabLoadTimes == 'number'
                                && alarmTabLoadTimes !== 0
                            ) {
                                dispatch(createAction('tabAlarmListModel/updateState')({
                                    alarmType: 0,
                                }));
                                dispatch(
                                    createAction('pointDetails/updateState')({
                                        sourceType: 'WorkbenchOver'
                                    })
                                );
                                dispatch(createAction('alarm/updateState')({
                                    sourceType: 'tabWorkbenchOver',
                                    monitorAlarmIndex: 1, monitorAlarmTotal: 0
                                    , monitorAlarmResult: { status: -1 },
                                    warningButton: tabAlarmWarningButton,
                                    alarmOverButton: tabAlarmOverButton,
                                    alarmMissExceptionButton: tabAlarmMissExceptionButton,
                                    alarmExceptionButton: tabAlarmExceptionButton,
                                }));
                                dispatch(
                                    createAction('alarm/getAlarmRecords')({
                                        params: {
                                            BeginTime: moment()
                                                // .subtract(1, 'days')
                                                .format('YYYY-MM-DD 00:00:00'),
                                            EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            AlarmType: '2',
                                            PageIndex: 1,
                                            PageSize: 20
                                        }
                                    })
                                );
                            } else {
                                console.log('alarmTabLoadTimes = ', alarmTabLoadTimes);
                                dispatch(
                                    createAction('pointDetails/updateState')({
                                        sourceType: 'tabWorkbenchOver'
                                        // sourceType: 'WorkbenchOver'
                                    })
                                );
                                dispatch(createAction('tabAlarmListModel/updateState')({
                                    alarmType: 0,
                                    alarmTabLoadTimes: 1
                                }));
                                dispatch(createAction('alarm/updateState')({
                                    monitorAlarmIndex: 1, monitorAlarmTotal: 0
                                    , monitorAlarmResult: { status: -1 }
                                    // , sourceType: 'WorkbenchOver'
                                    , sourceType: 'tabWorkbenchOver',
                                    warningButton: tabAlarmWarningButton,
                                    alarmOverButton: tabAlarmOverButton,
                                    alarmMissExceptionButton: tabAlarmMissExceptionButton,
                                    alarmExceptionButton: tabAlarmExceptionButton,
                                }));
                                dispatch(
                                    createAction('alarm/getAlarmRecords')({
                                        params: {
                                            BeginTime: moment()
                                                // .subtract(1, 'days')
                                                .format('YYYY-MM-DD 00:00:00'),
                                            EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            AlarmType: '2',
                                            PageIndex: 1,
                                            PageSize: 20
                                        }
                                    })
                                );
                                // setAlarmTabLoadTimes(1);

                            }

                        }
                        if (routeName == 'DataForm') {
                            if (typeof dataFormLoadTimes == 'number'
                                && dataFormLoadTimes !== 0
                            ) {
                                dispatch(createAction('dataForm/getData')({}));
                            } else {
                                setDataFormLoadTimes(1);
                            }
                        }
                        // PollutionAll 列表和地图不刷新 维持原业务逻辑

                        // dispatch(createAction('notice/updateState')({messageCount: messageCount + 1 }));
                    })()
            }
            {/* <Text>tebView</Text> */}
        </View>
    )
}
