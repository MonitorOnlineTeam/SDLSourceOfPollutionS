import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { DeclareModule, StatusPagem, SimpleLoadingComponent, Touchable } from '../../../components';
import AlarmList from '../alarm/AlarmList';
// import AlarmList from '../../../pollutionContainers/tabView/alarm/AlarmList';

/**
 * 异常报警
 * @class Notice
 * @extends {Component}
 */
@connect()
export default class ExceptionAlarm extends Component {
    // static navigationOptions = createNavigationOptions({
    //     title: '数据缺失报警',
    //     // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    //     headerRight: (
    //         <DeclareModule
    //             contentRender={() => {
    //                 return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
    //             }}
    //             options={{
    //                 headTitle: '响应时限说明',
    //                 innersHeight: 220,
    //                 messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
    //                 headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
    //                 buttons: [
    //                     {
    //                         txt: '知道了',
    //                         btnStyle: { backgroundColor: '#fff' },
    //                         txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
    //                         onpress: () => { }
    //                     }
    //                 ]
    //             }}
    //         />
    //     )
    // });

    constructor(props) {
        super(props);
        this.state = {};
        this.props.navigation.setOptions({
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
                }}
                options={{
                    headTitle: '响应时限说明',
                    innersHeight: 220,
                    messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
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
        });
    }
    render() {
        return <AlarmList />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});