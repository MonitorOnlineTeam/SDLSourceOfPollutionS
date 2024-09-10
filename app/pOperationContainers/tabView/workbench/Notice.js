import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../../utils';
import { StatusPagem, SimpleLoadingComponent, Touchable, StatusPage, FlatListWithHeaderAndFooter, SDLText } from '../../../components';
import TextLabel from '../../../pollutionContainers/components/TextLabel';

/**
 * source={index==0? require('../../../images/ic_msg_workorder.png')
    :index==1?require('../../../images/ic_msg_audit.png')
    :index==2?require('../../../images/ic_msg_replace.png')
    :index==3?require('../../../images/ic_msg_operation_due.png')
    :index==4?require('../../../images/ic_msg_inspection.png')
    :index==5?require('../../../images/ic_msg_performance.png')
    :require('../../../images/ic_msg_audit.png')
 */
const items = [{ key: 'taskMessage', title: '工单消息', icon: require('../../../images/ic_msg_workorder.png'), time: '18:05', msg: '派单' }
    , { key: 'auditingMessage', title: '审核结果', icon: require('../../../images/ic_msg_audit.png'), time: '昨天', msg: '审核通过' }
    , { key: 'changeMessage', title: '更换提醒', icon: require('../../../images/ic_msg_replace.png'), time: '星期六', msg: '标气更换' }
    , { key: 'expireMessage', title: '运营到期通知', icon: require('../../../images/ic_msg_operation_due.png'), time: '星期五', msg: 'YY2021-038运营即将到期，请及时补签' }
    , { key: 'inspectorMessage', title: '督查结果', icon: require('../../../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'InspectorRectificationMessage', title: '系统设施核查消息', icon: require('../../../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'keyParameterMessage', title: '关键参数核查', icon: require('../../../images/ic_msg_inspection.png'), time: '星期五', msg: '督查合格' }
    , { key: 'achievementsMessage', title: '绩效消息', icon: require('../../../images/ic_msg_performance.png'), time: '05-13', msg: '督查合格' }
]
/**
 * 通知
 * @class Notice
 * @extends {Component}
 */
@connect(({ notice }) => ({
    pushMessageListResult: notice.pushMessageListResult,

    noticeMessageInfoListIndex: notice.noticeMessageInfoListIndex,
    noticeMessageInfoListTotal: notice.noticeMessageInfoListTotal,
    noticeMessageInfoListResult: notice.noticeMessageInfoListResult,
    noticeMessageInfoListData: notice.noticeMessageInfoListData
}))
export default class Notice extends Component {
    static navigationOptions = ({ navigation }) => createNavigationOptions({
        // title: '通知',
        title: '消息中心',
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    navigation.state.params.navigatePress();
                }}
            >
                <Text style={{ marginRight: 10, color: '#fff' }}>全部已读</Text>
            </TouchableOpacity>
        )
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress: () => {
                // 全部已读 
                this.props.dispatch(createAction('notice/setMessageRead')({
                    params: { pushType: 'all' }
                    , success: () => {
                        ShowToast('全部设置为已读');
                    }, failure: () => {
                        ShowToast('设置失败');
                    }
                }))
            }
        });
        this.onRefresh()
    }

    onRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ pushMessageListResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getPushMessageList')({}))
    }

    // onRefresh = index => {
    //     this.props.dispatch(createAction('notice/updateState')({ noticeMessageInfoListIndex: index, noticeMessageInfoListTotal: 0 }));
    //     this.props.dispatch(
    //         createAction('notice/getNoticeMessageInfoList')({
    //             params: {
    //                 PageIndex: index,
    //                 PageSize: 20
    //             },
    //             setListData: this.list.setListData
    //         })
    //     );
    // };

    // statusOnRefresh = () => {
    //     this.props.dispatch(createAction('notice/updateState')({ noticeMessageInfoListIndex: 1, noticeMessageInfoListTotal: 0, noticeMessageInfoListResult: { status: -1 } }));
    //     this.props.dispatch(
    //         createAction('notice/getNoticeMessageInfoList')({
    //             params: {
    //                 PageIndex: 1,
    //                 PageSize: 20
    //             }
    //         })
    //     );
    // };
    onPress = (item, index) => { };
    /**
     * 
     * 		/// <summary>
                /// 任务完成
                /// </summary>
                [Description("任务完成")]
                TaskComplete=0,
        	
                /// <summary>
                /// 任务督办
                /// </summary>
                [Description("任务督办")]
                TaskSupervise=1,
        	
                /// <summary>
                /// 专工派单通知
                /// </summary>
                [Description("专工派单通知")]
                TaskDispatch=2,
        	
                /// <summary>
                /// 备品备件更换通知
                /// </summary>
                [Description("备品备件更换通知")]
                ComponentsReplace=3,
        	
                /// <summary>
                /// 任务撤回
                /// </summary>
                [Description("任务撤回")]
                TaskRevoke=4,
        	
                /// <summary>
                /// 任务打回
                /// </summary>
                [Description("任务打回")]
                TaskRepulse=5,
        	
                /// <summary>
                /// 任务转发
                /// </summary>
                [Description("任务转发")]
                Forward=6,
        	
                /// <summary>
                /// 提醒
                /// </summary>
                [Description("提醒")]
                Remind=7,
        	
                /// <summary>
                /// 系统派单
                /// </summary>
                [Description("系统派单")]
                SystemCreateTask=8,
     * 
     */
    renderItem = ({ item, index }) => {
        let MessageType = SentencedToEmpty(item, ['MessageType'], 7);
        return (
            <Touchable onPress={() => this.onPress(item, index)} style={[{ minHeight: 87, width: SCREEN_WIDTH, backgroundColor: '#fff', justifyContent: 'center' }]}>
                <View style={[{ minHeight: 87, width: SCREEN_WIDTH, paddingLeft: 5, paddingRight: 13, flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingBottom: 14 }]}>
                    <Image
                        source={
                            MessageType == 7
                                ? require('../../../images/ic_notification_remind.png')
                                : MessageType == 8 || MessageType == 2
                                    ? require('../../../images/ic_notification_send_orders.png')
                                    : MessageType == 6
                                        ? require('../../../images/ic_notification_transmit.png')
                                        : MessageType == 5
                                            ? require('../../../images/ic_notification_reject.png')
                                            : require('../../../images/ic_notification_remind.png')
                        }
                        style={[{ height: 37, width: 37, margin: 10 }]}
                    />
                    <View style={[{ flex: 1 }]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                            {/* <SDLText fontType={'normal'}>{`${item == 1 ? '提醒' : item == 2 ? '派单' : item == 3 ? '转发' : item == 4 ? '打回' : '打回'}`}</SDLText> */}
                            <SDLText fontType={'normal'}>{`${item.MssageTitle}`}</SDLText>
                            {item && item.TaskTypeName ? (
                                <TextLabel
                                    style={{ marginLeft: 10 }}
                                    text={SentencedToEmpty(item, ['TaskTypeName'], '')}
                                    color={MessageType == 7 ? '#a9d49a' : MessageType == 2 || MessageType == 8 ? '#e1ba96' : MessageType == 6 ? '#e1a097' : MessageType == 5 ? '#97bee0' : '#a9d49a'}
                                />
                            ) : null}
                            <View style={[{ flex: 1 }]} />
                            {/* <Image source={require('../../../images/calendarRight.png')} style={[{ height: 11, width: 11 }]} /> */}
                        </View>
                        {/* 长时间超标未反馈 */
                            MessageType == 9 ? null : <SDLText fontType={'small'} style={[{ marginTop: 6 }]}>{`${SentencedToEmpty(item, ['ParentName'], ' ') + '-' + SentencedToEmpty(item, ['PointName'], ' ')}`}</SDLText>}
                        <SDLText fontType={'small'} style={[{ marginTop: 8 }]}>{`${SentencedToEmpty(item, ['Mssage'], '-')}`}</SDLText>
                    </View>
                </View>
            </Touchable>
        );
    };
    // render() {
    //     return (
    //         <StatusPage
    //             status={this.props.noticeMessageInfoListResult.status}
    //             backRef={true}
    //             //页面是否有回调按钮，如果不传，没有按钮，
    //             emptyBtnText={'重新请求'}
    //             errorBtnText={'点击重试'}
    //             onEmptyPress={() => {
    //                 //空页面按钮回调
    //                 console.log('重新刷新');
    //                 this.statusOnRefresh();
    //             }}
    //             onErrorPress={() => {
    //                 //错误页面按钮回调
    //                 console.log('错误操作回调');
    //                 this.statusOnRefresh();
    //             }}
    //         >
    //             <FlatListWithHeaderAndFooter
    //                 style={[{ backgroundColor: '#f2f2f2' }]}
    //                 ref={ref => (this.list = ref)}
    //                 ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
    //                 pageSize={20}
    //                 hasMore={() => {
    //                     return this.props.noticeMessageInfoListData.length < this.props.noticeMessageInfoListTotal;
    //                 }}
    //                 onRefresh={index => {
    //                     this.onRefresh(index);
    //                 }}
    //                 onEndReached={index => {
    //                     console.log('onEndReached index = ',index);
    //                     // 不知道有没有用
    //                     // this.props.dispatch(createAction('app/updateState')({ noticeMessageInfoListIndex: index }));
    //                     this.props.dispatch(createAction('notice/updateState')({ noticeMessageInfoListIndex: index }));
    //                     this.props.dispatch(
    //                         createAction('notice/getNoticeMessageInfoList')({
    //                             params: {
    //                                 PageIndex: index,
    //                                 PageSize: 20
    //                             },
    //                             setListData: this.list.setListData
    //                         })
    //                     );
    //                 }}
    //                 renderItem={this.renderItem}
    //                 data={this.props.noticeMessageInfoListData}
    //             />
    //         </StatusPage>
    //     );
    // }
    render() {
        return (<StatusPage
            status={SentencedToEmpty(this.props.pushMessageListResult
                , ['status'], 200)}
            backRef={true}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                console.log('重新刷新');
                // this.statusOnRefresh();
                this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                console.log('错误操作回调');
                // this.statusOnRefresh();
                this.onRefresh();
            }}
        >
            {
                items.map((item, index) => {
                    let Datas = SentencedToEmpty(this.props.pushMessageListResult
                        , ['data', 'Datas'], {})
                    if (SentencedToEmpty(Datas, [item.key, 'ID'], '') != '') {
                        const itemData = SentencedToEmpty(Datas, [item.key,], {})
                        return <TouchableOpacity
                            key={item.key}
                            style={{
                                height: 80, width: SCREEN_WIDTH, backgroundColor: 'white', flexDirection: 'row'
                                , alignItems: 'center'
                            }}
                            onPress={() => {
                                /**
                                 * taskMessage  工单消息
                                    inspectorMessage    督查结果
                                 */
                                console.log('PushType = ', Datas[item.key].PushType);
                                this.props.dispatch(createAction('notice/updateState')({
                                    PushType: Datas[item.key].PushType
                                    , messageTypeId: Datas[item.key].ID
                                }));

                                if (item.key == 'InspectorRectificationMessage') {
                                    // 督查整改
                                    this.props.dispatch(NavigationActions.navigate({
                                        // routeName: 'NormalMessage',
                                        routeName: 'InspectorRectificationReminder',
                                        params: {
                                            // title:'督查整改消息'
                                            // title:'设施核查整改'
                                            title: '系统设施核查消息'
                                        }
                                    }))
                                } else if (item.key == 'keyParameterMessage') {
                                    // 关键参数核查
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'NormalMessage',
                                        params: {
                                            title: '关键参数核查消息'
                                        }
                                    }))
                                } else if (item.key == 'taskMessage') {
                                    // 工单消息
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'NormalMessage',
                                        params: {
                                            title: '工单消息'
                                        }
                                    }))
                                } else if (item.key == 'inspectorMessage') {
                                    // 督查结果
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'NormalMessage',
                                        params: {
                                            title: '督查结果'
                                        }
                                    }))
                                } else if (item.key == 'auditingMessage') {
                                    // 审核结果
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'NormalMessage',
                                        params: {
                                            title: '审核结果',
                                        }
                                    }))
                                } else if (item.key == 'changeMessage') {
                                    // 更换提醒
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'ReplaceReminder',
                                        params: {

                                        }
                                    }))
                                } else if (item.key == 'expireMessage') {
                                    // 运营到期通知
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'OperationExpirationReminder',
                                        params: {

                                        }
                                    }))
                                } else if (item.key == 'achievementsMessage') {
                                    // 绩效消息
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'PerformanceMessage',
                                        params: {

                                        }
                                    }))
                                }
                            }}>
                            <View style={{ height: 48, width: 48, marginLeft: 18, flexDirection: 'row' }}>
                                <Image style={{ height: 48, width: 48 }}
                                    source={item.icon}
                                />
                                {!itemData.IsView ? <View style={[{
                                    width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5A5A', marginLeft: -12, marginTop
                                        : 4
                                }]}></View> : null}
                            </View>
                            <View style={{ height: 80, flex: 1, marginLeft: 15, justifyContent: 'center', borderBottomColor: '#F3F3F3', borderBottomWidth: 1 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 100, justifyContent: 'space-between' }}>
                                    <SDLText fontType={'large'} >{item.title}</SDLText>
                                    <SDLText fontType={'small'} style={{ color: '#999999' }} >{SentencedToEmpty(itemData, ['Col5'], '')}</SDLText>
                                </View>
                                <SDLText fontType={'small'} numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#666666', marginTop: 10 }}>{SentencedToEmpty(itemData, ['Msg'], '')}</SDLText>
                            </View>
                        </TouchableOpacity>
                    }
                })
            }
        </StatusPage>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
