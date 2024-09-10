/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-05-09 11:08:35
 * @LastEditTime: 2024-05-31 09:00:37
 * @FilePath: /SDLMainProject37/app/pOperationContainers/operationPlan/PointPlan.js
 */
import { SectionList, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../config/globalsize';
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../utils';
import { connect } from 'react-redux';
import { StatusPage } from '../../components';
import globalcolor from '../../config/globalcolor';

@connect(({ operationPlanModel }) => ({
    appOperationPlanListResult: operationPlanModel.appOperationPlanListResult, // 单点运维计划 请求结果
    appOperationPlanList: operationPlanModel.appOperationPlanList, // 单点运维计划 一级列表
}))
export default class PointPlan extends Component {

    componentDidMount() {

    }

    refresh = () => {
        this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanList')({}));
    }

    render() {
        return (
            <StatusPage
                backRef={true}
                status={SentencedToEmpty(this.props, ['appOperationPlanListResult', 'status'], 200)}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.refresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.refresh();
                }}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                    }]}
                >
                    <SectionList
                        // sections={DATA}
                        sections={SentencedToEmpty(this.props, ['appOperationPlanList'], [])}
                        keyExtractor={(item, index) => item.planID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {

                                    this.props.dispatch(createAction('operationPlanModel/updateState')({
                                        currentPlanID: item.planID
                                    }));
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'PointPlanDetail',
                                        params: {
                                            item
                                        }
                                    }))
                                }}
                            >
                                <View style={[{
                                    minHeight: 32, width: SCREEN_WIDTH
                                    , flexDirection: 'row'
                                    , alignItems: 'center', backgroundColor: 'white'
                                }]}>
                                    <Text style={[{
                                        width: SCREEN_WIDTH - 54
                                        , marginLeft: 20, color: '#333333'
                                        , fontSize: 15, lineHeight: 19
                                    }]}>{item.title}<Text
                                        style={[{
                                            color: globalcolor.antBlue
                                            , fontSize: 13
                                        }]}
                                    >{SentencedToEmpty(item, ['recordTypeName'], '')}</Text></Text>
                                    <Image
                                        style={[{
                                            width: 10, height: 10
                                            , marginRight: 20, marginLeft: 4
                                        }]}
                                        source={require('../../images/ic_arrows_right.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                        // renderSectionHeader={({ section: { title } }) => (
                        renderSectionHeader={({ section: { entName } }) => (
                            <View
                                style={[{
                                    width: SCREEN_WIDTH, height: 40
                                    , alignItems: 'center'
                                    , backgroundColor: 'white'
                                    , marginTop: 5
                                }]}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[{
                                        width: SCREEN_WIDTH - 40
                                        , marginLeft: 0, color: '#333333'
                                        , fontSize: 15, marginTop: 10
                                    }]}>{entName}</Text>
                            </View>
                        )}
                    />
                </View>
            </StatusPage>
        )
    }
}