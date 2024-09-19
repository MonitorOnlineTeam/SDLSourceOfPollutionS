/*
 * @Description: 水质选择运维设备
 * @LastEditors: hxf
 * @Date: 2021-11-23 14:39:03
 * @LastEditTime: 2021-11-23 16:56:22
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/PointEquipmentList.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';

import { Button, StatusPage, Contact, LineSelectBar } from '../../../../components';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../../../utils';

@connect(({taskModel})=>({
    pointEquipmentResult:taskModel.pointEquipmentResult
}))
export default class PointEquipmentList extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        title: '设备选择',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount(){
        this.props.dispatch(createAction('taskModel/getMonitorPointEquipmentParameters')({}))
    }

    renderItem = ({item}) => {
        return <TouchableOpacity
            style={{
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                flex: 1,
                minHeight: 55,
                marginBottom: 1,
                justifyContent: 'center'
            }}
            onPress={() => {
                if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                    this.props.navigation.state.params.callback(item);
                }
                this.props.dispatch(NavigationActions.back());
            }}
        >
            <Text style={[{ marginLeft: 20, color: '#333333' }]}>{`${item?.EquipmentName}`}</Text>
        </TouchableOpacity>
    }
    
    render() {
        return (
            <StatusPage
                status={this.props.pointEquipmentResult.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onFreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    // this.onFreshData();
                }}
            >
                <FlatList
                    style={{
                        height: '100%',
                        width: SCREEN_WIDTH
                    }}
                    overScrollMode={'never'}
                    data={this.props.pointEquipmentResult?.data?.Datas}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={30}
                    refreshing={false}
                />
            </StatusPage>
        )
    }
}
