/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:15
 * @LastEditTime: 2024-10-21 15:24:06
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/ExceptionAlarm.js
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, NavigationActions } from '../../../utils';
import { DeclareModule, StatusPagem, SimpleLoadingComponent, Touchable } from '../../../components';
// import AlarmList from '../../../pollutionContainers/tabView/alarm/AlarmList';
import Popover from 'react-native-popover';
import AlarmList from '../alarm/AlarmList';

/**
 * 异常报警
 * @class Notice
 * @extends {Component}
 */
@connect()
export default class ExceptionAlarm extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return createNavigationOptions({
    //         title: '异常报警',
    //         headerRight: (
    //             <DeclareModule
    //                 contentRender={() => {
    //                     return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
    //                 }}
    //                 options={{
    //                     headTitle: '响应时限说明',
    //                     innersHeight: 220,
    //                     messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
    //                     headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
    //                     buttons: [
    //                         {
    //                             txt: '知道了',
    //                             btnStyle: { backgroundColor: '#fff' },
    //                             txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
    //                             onpress: () => { }
    //                         }
    //                     ]
    //                 }}
    //             />
    //         )
    //     });
    // }

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            spinnerRect: {},
        };
        this.props.navigation.setOptions({
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
                }}
                options={{
                    headTitle: '响应时限说明',
                    innersHeight: 220,
                    messText: `报警信息如在8:30-17:30发生，需要在8小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
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
        return <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
            <AlarmList />
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
