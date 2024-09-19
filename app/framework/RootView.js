import { createNativeStackNavigator, HeaderBackButton } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useRef } from 'react'
import { View, Text, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import LoadingManager from './LoadingManager'

import { createAction, getCommonHeaderStyle, SentencedToEmpty } from '../utils';
import { SimpleLoadingView } from '../components';
import GlobalLoadingView from './GlobalLoadingView';
// import SimpleLoadingView from '@oldProjectComponent/SimpleLoadingView';

const Stack = createNativeStackNavigator();
let ViewList = [];

const Tab = createBottomTabNavigator();
let exportNavigation = null;
let lo
export default function RootView({ navigation }) {
    let _messagebarRef = useRef();
    let _loadingViewRef = useRef();
    useLayoutEffect(() => {
        // Register the alert located on this master page
        // This MessageBar will be accessible from the current (same) component, and from its child component
        // The MessageBar is then declared only once, in your main component.
        MessageBarManager.registerMessageBar(_messagebarRef.current);
        LoadingManager.registerLoadingView(_loadingViewRef.current);
        return () => {
            MessageBarManager.unregisterMessageBar();
            LoadingManager.unregisterMessageBar();
        }
    }, [])
    exportNavigation = navigation;
    return (<View style={[{ width: "100%", flex: 1 }]}>
        <Stack.Navigator >
            {
                ViewList.map((item, index) => {
                    return <Stack.Screen options={item.options} key={`Stack${index}`} name={item.view.name} component={item.view} />
                })
            }
        </Stack.Navigator>
        <GlobalLoadingView ref={_loadingViewRef} message={'loadingMessage'} />
        <MessageBar messageStyle={{ textAlign: 'center' }} ref={_messagebarRef} />
    </View>
    )
}

export const getNavigation = () => {
    return exportNavigation;
};

export class MyActions {
    navigate = (props, params = {}) => {
        exportNavigation.navigate(props, params);
    }
    reset = (props, params = {}) => {
        exportNavigation.reset(props, params);
    }
    back = () => {
        exportNavigation.goBack();
    }

    pushView = (view, options = {}) => {
        let isDuplication = false;
        ViewList.map((item, index) => {
            if (item.view.name == view.name) {
                isDuplication = true;
            }
        });
        ViewList.push({ view, options });
    }
    setOptions = (options = {}) => {
        console.log('setOptions options = ', options);
        console.log('setOptions exportNavigation = ', exportNavigation);
        exportNavigation.setOptions(options);
    }
    pushViewWithName = (view, name, options = {}) => {
        let isDuplication = false;
        ViewList.map((item, index) => {
            if (item.view.name == name) {
                isDuplication = true;
            }
        });
        if (!isDuplication) {
            view.name = name;
            ViewList.push({ view, options: { ...getCommonHeaderStyle(), ...options } });
        }
    }
    createBottomTab = (views = [], option) => {
        return function MyTab() {
            const options = { headerShown: false };
            const {
                _tabBarIcon = (route) => {
                    // console.log('_tabBarIcon route = ',route);
                }
                , _tabBarLabel = (route) => {

                }
            } = option;
            return (
                <Tab.Navigator
                    initialRouteName={SentencedToEmpty(option, ['initTabName'], views[0].view.name)}
                    screenOptions={({ route }) => ({
                        tabBarLabel: ({ focused, color, size }) => {
                            return _tabBarLabel(route, focused);
                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            return _tabBarIcon(route, focused);
                        },
                        tabBarActiveTintColor: 'tomato',
                        tabBarInactiveTintColor: 'gray',
                    })}
                >
                    {
                        views.map((item, index) => {
                            let optionsObject = SentencedToEmpty(item, ['options'], null);
                            if (optionsObject) {
                                console.log('item.view.name = ', item.view.name);
                                return <Tab.Screen options={item.options} key={`Tab${index}`} name={item.view.name} component={item.view} />
                            } else {
                                return <Tab.Screen options={options} key={`Tab${index}`} name={item.view.name} component={item.view} />
                            }
                        })
                    }
                </Tab.Navigator>
            )
        }
    }
}

export class MyNavigationActions {
    navigate = (params = {}) => {
        return createAction('sdlNavigate/navigate')(params);
    }
    reset = (params = {}) => {
        return createAction('sdlNavigate/reset')(params);
    }
    back = () => {
        return createAction('sdlNavigate/back')({});
    }
}




