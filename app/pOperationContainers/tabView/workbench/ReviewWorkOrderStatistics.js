/*
 * @Description: 审核工单统计
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2022-05-29 15:10:14
 * @LastEditTime: 2024-09-12 18:26:20
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/workbench/ReviewWorkOrderStatistics.js
 */
import React, { Component } from 'react'
import { Platform, Text, View } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

@connect(({ notice }) => ({
    notAuditTaskMsgInfoResult: notice.notAuditTaskMsgInfoResult
}))
export default class ReviewWorkOrderStatistics extends Component {

    // static navigationOptions = ({ navigation }) => createNavigationOptions({
    //     title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '待审批工单统计'),
    //     headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    // });

    componentDidMount() {
        this.statusPageOnRefresh();
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route,['params','params','title'],'待审批工单统计'),
          });
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ notAuditTaskMsgInfoResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getNotAuditTaskMsgInfo')({
            ID: this.props.route.params.params.ID
        }))
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.notAuditTaskMsgInfoResult
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
                    {/* <Text numberOfLines={2} ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333'}}>
                    {'小王，你好！2022年4月21日-2022年5月20日完成 的运维工单存在待审批的工单，统计信息如下：'}
                </Text> */}
                    {/* <Text numberOfLines={2} ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333'}}>
                    {SentencedToEmpty(this.props.notAuditTaskMsgInfoResult,['data','Datas','msgContent'],'统计信息如下：')}
                </Text> */}
                    <Text ellipsizeMode={'tail'} style={{ marginTop: 10, width: SCREEN_WIDTH - 40, fontSize: 15, color: '#333333', lineHeight: 19 }}>
                        {SentencedToEmpty(this.props.notAuditTaskMsgInfoResult, ['data', 'Datas', 'msgContent'], '统计信息如下：')}
                    </Text>
                    <View style={{
                        height: 42, width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                        , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        , marginTop: 10
                    }}>
                        <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>{'待审核工单数量'}</Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginRight: 30 }}>{SentencedToEmpty(this.props.notAuditTaskMsgInfoResult, ['data', 'Datas', 'NotAuditTaskNum'], '--')}</Text>
                    </View>
                </View>
            </StatusPage>
        )
    }
}
