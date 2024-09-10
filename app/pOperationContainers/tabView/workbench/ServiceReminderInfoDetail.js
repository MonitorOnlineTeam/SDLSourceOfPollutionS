/*
 * @Description: 审核工单统计
 * @LastEditors: hxf
 * @Date: 2022-05-29 15:10:14
 * @LastEditTime: 2024-08-12 16:44:53
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/workbench/ServiceReminderInfoDetail.js
 */
import React, { Component } from 'react'
import { Platform, Text, View } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

@connect(({ notice }) => ({
    serviceReminderInfoResult: notice.serviceReminderInfoResult
}))
export default class ServiceReminderInfoDetail extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '待审批工单统计'),
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ serviceReminderInfoResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getServiceReminderInfo')({
            ID: this.props.navigation.state.params.ID
        }))
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.serviceReminderInfoResult
                    , ['status'], 1000)}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.statusPageOnRefresh();
                }}
            >
                <View style={{ width: SCREEN_WIDTH, alignItems: 'center' }}>
                    <Text ellipsizeMode={'tail'} style={{ marginTop: 10, width: SCREEN_WIDTH - 40, fontSize: 15, color: '#333333', lineHeight: 19 }}>
                        {SentencedToEmpty(this.props.serviceReminderInfoResult, ['data', 'Datas', 'msgContent'], '统计信息如下：')}
                    </Text>
                    <View style={{
                        height: 42, width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                        , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        , marginTop: 10
                    }}>
                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>{'预计开始时间:'}</Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginRight: 30 }}>{SentencedToEmpty(this.props.serviceReminderInfoResult, ['data', 'Datas', 'ExpectedTime'], '--')}</Text>
                    </View>
                    <Text ellipsizeMode={'tail'} style={{ marginTop: 10, width: SCREEN_WIDTH - 40, fontSize: 15, color: '#333333', lineHeight: 19 }}>
                        {`服务提醒说明:${SentencedToEmpty(this.props.serviceReminderInfoResult, ['data', 'Datas', 'RemindMsg'], '')}`}
                    </Text>
                </View>
            </StatusPage>
        )
    }
}
