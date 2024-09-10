/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:15
 * @LastEditTime: 2024-07-29 10:58:51
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/workbench/ExceptionAlarm.js
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { DeclareModule, StatusPagem, SimpleLoadingComponent, Touchable } from '../../../components';
import AlarmList from '../../../pollutionContainers/tabView/alarm/AlarmList';
import Popover from 'react-native-popover';

/**
 * 异常报警
 * @class Notice
 * @extends {Component}
 */
@connect()
export default class ExceptionAlarm extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '异常报警',
            headerRight: (
                <DeclareModule
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
            )
            // headerRight: (
            //     <View>
            //         <TouchableOpacity
            //             style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
            //             onPress={(e) => {
            //                 const {
            //                     nativeEvent: { pageX, pageY }
            //                 } = e;
            //                 navigation.state.params.navigateRightPress(pageX, pageY);
            //             }}
            //         >
            //             <Image source={require('../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
            //         </TouchableOpacity>
            //     </View>
            // )
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            spinnerRect: {},
        };
        this.props.navigation.setParams({
            navigateRightPress: (pageX, pageY) => {
                this.showSpinner(pageX, pageY);
            }
        });
    }

    //显示下拉列表
    showSpinner = (pageX, pageY) => {
        pageY = 35;
        const width = 44,
            height = 44;
        const placement = 'bottom';
        this.setState({
            isVisible: true,
            spinnerRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
        });
    };

    //隐藏下拉列表
    closeSpinner() {
        this.setState({
            isVisible: false
        });
    }

    onItemClick = (label) => {
        if (label == '响应时限说明') {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'OperationPlanEnter', params: {} }));
            this.setState({
                isVisible: false
            });
        } else if (label == '响应核实历史') {
            const _this = this;
            this.setState({
                isVisible: false
            }, () => {
                _this.refs.doAlert.show();
            });
        }
    }

    render() {
        return <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
            <AlarmList />
            <Popover
                //设置可见性
                isVisible={this.state.isVisible}
                //设置下拉位置
                fromRect={this.state.spinnerRect}
                placement="bottom"
                //点击下拉框外范围关闭下拉框
                onClose={() => this.closeSpinner()}
                //设置内容样式
                contentStyle={{ opacity: 0.82, backgroundColor: '#343434' }}
                // style={{ backgroundColor: 'red' }}
                contentHeight={135}
            >
                <View style={{ alignItems: 'center', }}>
                    {['响应时限说明', '响应核实历史'].map((result, i, arr) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => this.onItemClick(arr[i])} underlayColor="transparent">
                                <Text style={{ fontSize: 16, color: 'white', padding: 8, fontWeight: '400' }}>{arr[i]}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Popover>
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
