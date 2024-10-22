/*
 * @Description: 运维计划入口
 * @LastEditors: hxf
 * @Date: 2024-05-08 16:06:31
 * @LastEditTime: 2024-10-12 15:52:03
 * @FilePath: /SDLMainProject/app/pOperationContainers/operationPlan/OperationPlanEnter.js
 */
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../config/globalsize'
import { createAction, createNavigationOptions } from '../../utils';
import { connect } from 'react-redux';
import DailyPlan from './DailyPlan';
import PointPlan from './PointPlan';
import { StatusPage } from '../../components';

@connect(({ operationPlanModel }) => ({
    tabSelectedIndex: operationPlanModel.tabSelectedIndex
}))
export default class OperationPlanEnter extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '运维计划',
            // headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        this.props.dispatch(createAction('operationPlanModel/updateState')({
            tabSelectedIndex: 1
        }))
    }

    render() {
        const topButtonWidth = SCREEN_WIDTH / 2;
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    flexDirection: 'row', height: 44
                    , width: SCREEN_WIDTH, alignItems: 'center'
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white', marginBottom: 5
                }]}>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.props.dispatch(createAction('operationPlanModel/updateState')({
                                    tabSelectedIndex: 1
                                }))
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'head'}
                                        style={[{
                                            fontSize: 15
                                            , color: this.props.tabSelectedIndex == 1 ? '#4AA0FF' : '#666666'
                                        }]}>{'每日计划'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.tabSelectedIndex == 1 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.props.dispatch(createAction('operationPlanModel/updateState')({
                                    tabSelectedIndex: 2,

                                }))
                                // 请求数据
                                this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanList')({}));
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={'head'}
                                        style={[{
                                            fontSize: 15
                                            , color: this.props.tabSelectedIndex == 2 ? '#4AA0FF' : '#666666'
                                        }]}>{'单点计划'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.tabSelectedIndex == 2 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <StatusPage
                    backRef={true}
                    status={200}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                    }}
                > */}
                {this.props.tabSelectedIndex == 1 ? <DailyPlan /> : null}
                {this.props.tabSelectedIndex == 2 ? <PointPlan /> : null}
                {/* </StatusPage> */}
            </View>
        )
    }
}