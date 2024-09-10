/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-09-05 16:47:21
 * @LastEditTime: 2024-08-12 16:32:19
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/ServiceDispatchMessage.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SimpleLoadingComponent, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast } from '../../../utils';

@connect(({ notice }) => ({
    PushType: notice.PushType,
    messageInfoListResult: notice.messageInfoListResult,
    messageInfoList: notice.messageInfoList,
    messageInfoListTotal: notice.messageInfoListTotal,
    messageInfoListPageSize: notice.messageInfoListPageSize,
    allMessageReadResult: notice.allMessageReadResult
}))
export default class ServiceDispatchMessage extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '消息'),
            headerRight: (
                <TouchableOpacity
                    style={{ width: 56, height: 32, marginRight: 10, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    <Text style={[{ fontSize: 12, color: '#FFFFFF' }]}>{'全部已读'}</Text>
                </TouchableOpacity>
            )
        });
    };

    componentDidMount() {
        this.statusPageOnRefresh();
        this.props.dispatch(createAction('notice/setMessageRead')({
            params: {
                pushType:
                    this.props.PushType == 5
                        || this.props.PushType == 6
                        || this.props.PushType == 7
                        || this.props.PushType == 8 ? [5, 6, 7, 8]
                        : [this.props.PushType]
            }
            , success: () => {
                // this.props.dispatch(NavigationActions.back());
                // ShowToast(`${SentencedToEmpty(this.props.navigation, ['state', 'params', 'title'], '消息')}全部置为已读`);
            }
        }))
        this.props.navigation.setParams({
            navigatePress: () => {
                this.props.dispatch(createAction('notice/updateMessageReadByMsgType')({
                    params: {
                        pushType:
                            this.props.PushType == 5
                                || this.props.PushType == 6
                                || this.props.PushType == 7
                                || this.props.PushType == 8 ? [5, 6, 7, 8]
                                : [this.props.PushType]
                    }
                    , success: () => {
                        this.statusPageOnRefresh();
                        // this.props.dispatch(NavigationActions.back());
                        // ShowToast(`${SentencedToEmpty(this.props.navigation, ['state', 'params', 'title'], '消息')}全部置为已读`);
                    }
                }))
                // this.props.dispatch(createAction('notice/setMessageRead')({
                //     params: {
                //         pushType:
                //             this.props.PushType == 5
                //                 || this.props.PushType == 6
                //                 || this.props.PushType == 7
                //                 || this.props.PushType == 8 ? [5, 6, 7, 8]
                //                 : [this.props.PushType]
                //     }
                //     , success: () => {
                //         this.props.dispatch(NavigationActions.back());
                //         ShowToast(`${SentencedToEmpty(this.props.navigation, ['state', 'params', 'title'], '消息')}全部置为已读`);
                //     }
                // }))
            }
        });
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex: 1, messageInfoListResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getMessageInfoList')({}))
    }

    onRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex: 1, messageInfoListResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getMessageInfoList')({ setListData: this.list.setListData }))
    }

    _renderItem = ({ item, index }) => {
        // IsRead 1已读 其它未读
        // let read = index%2==1
        const read = SentencedToEmpty(item, ['IsRead'], -1) == 1
        return (<View style={{ width: SCREEN_WIDTH }}>

            {SentencedToEmpty(item, ['firstRead'], false) ? <View style={[{
                width: SCREEN_WIDTH, height: 42, flexDirection: 'row'
                , justifyContent: 'center', alignItems: 'center'
            }]}>
                <View style={[{ width: 35, height: 1, backgroundColor: '#999999' }]} />
                <Text style={[{ fontSize: 11, color: '#999999', marginHorizontal: 10 }]}>{'以下均已读'}</Text>
                <View style={[{ width: 35, height: 1, backgroundColor: '#999999' }]} />
            </View> : null}
            <View style={{
                width: SCREEN_WIDTH, height: 38
                , justifyContent: 'center', alignItems: 'center'
            }}>
                <Text style={[{ fontSize: 11, color: '#999999' }]}>{`${SentencedToEmpty(item, ['dateTime'], '')}`}</Text>
            </View>
            <TouchableOpacity
                onPress={() => {
                    /**
                     * MsgType
                     * 1(工单消息),12(审核结果),13(督查结果),14(运营到期通知)
                     * ,15(更换提醒),16(绩效消息),17(系统设施核查消息),18(关键参数核查)
                     * 1 包含 pushType [5(任务打回),6(任务转发),7(提醒（任务创建）),8(系统派单)]
                     * 20 模型报警整改通知
                     */
                    /**
                     * 以下为NormalMessage
                     * item.key == 'taskMessage'// 工单消息
                     * MsgType 1,pushType [5(任务打回),6(任务转发),7(提醒（任务创建）),8(系统派单)]
                     * item.key == 'keyParameterMessage'// 关键参数核查
                     * MsgType 18(关键参数核查)
                     * item.key == 'inspectorMessage'// 督查结果
                     * MsgType 13(督查结果)
                     * item.key == 'auditingMessage'// 审核结果
                     * MsgType 12(审核结果)
                     * NormalMessage 将消息内容单独展示一下，避免item中省略的部分展示不全
                     */
                    this.props.dispatch(createAction('notice/updateMessageRead')({
                        params: { ID: item.ID, index }
                    }));
                    if (item.pushType == 26) {
                        // 服务提醒
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'ServiceReminderInfoDetail',
                            params: {
                                title: item.title,
                                ID: item.ID
                            }
                        }))
                        // this.props.dispatch(createAction('notice/getServiceReminderInfo')({
                        //     ID: item.ID
                        // }));
                    } else if (item.pushType == 5
                        || item.pushType == 6
                        || item.pushType == 7
                        || item.pushType == 8
                        || item.pushType == 12
                        || item.pushType == 13
                        || item.pushType == 18
                        || item.pushType == 20
                    ) {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'NormalMessageDetail',
                            params: {
                                ...item
                                , viewTitle: SentencedToEmpty(this.props
                                    , ['navigation', 'state', 'params', 'title']
                                    , '消息标题'
                                )
                            }
                        }));
                    } else if (item.pushType == 17) {
                        if (item.messageType == 1) {
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'SuperviseRectifyDetail',
                                params: {
                                    title: item.title,
                                    ID: item.ID
                                }
                            }))
                        } else {
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'NormalMessageDetail',
                                params: {
                                    ...item
                                    , viewTitle: SentencedToEmpty(this.props
                                        , ['navigation', 'state', 'params', 'title']
                                        , '消息123'
                                    )
                                }
                            }));
                        }

                    } else if (item.pushType == 15
                        || item.pushType == 14
                    ) {
                        // 15 'changeMessage' 更换提醒(没有测试数据)
                        // 14 'expireMessage' 运营到期通知
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'NormalMessageDetail',
                            params: {
                                ...item
                                , viewTitle: SentencedToEmpty(this.props
                                    , ['navigation', 'state', 'params', 'title']
                                    , '更换提醒'
                                )
                            }
                        }));
                    } else if (item.pushType == 16) {
                        // 16 'achievementsMessage' 绩效消息
                        if (item.messageType == 1) {
                            // "绩效统计"
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'PerformanceDetail',
                                params: {
                                    title: item.title,
                                    ID: item.ID
                                }
                            }))
                        } else if (item.messageType == 2) {
                            // "待审批工单统计"
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'ReviewWorkOrderStatistics',
                                params: {
                                    title: item.title,
                                    ID: item.ID
                                }
                            }))
                        }
                    } else if (item.pushType == 19) {
                        // "成套任务"
                        const Param = SentencedToEmpty(item, ['Param'], '');
                        if (Param == '') {
                            ShowToast('参数错误');
                        } else {
                            const paramObject = JSON.parse(JSON.parse(Param));
                            if (SentencedToEmpty(paramObject, ['ID'], '') != ''
                                && SentencedToEmpty(paramObject, ['ProjectID'], '') != ''
                            ) {
                                this.props.dispatch(createAction('CTModel/updateState')({
                                    dispatchId: paramObject.ID,
                                    ProjectID: paramObject.ProjectID,
                                    OneServiceDispatchResult: { status: -1 },
                                    chengTaoTaskDetailData: { RecordId: paramObject.ID }
                                }));
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'ChengTaoTaskDetail',
                                    params: null
                                }));
                                //加载数据
                                this.props.dispatch(createAction('CTModel/getOneServiceDispatch')({
                                    params: {
                                        ID: paramObject.ID
                                    }
                                }));
                                this.props.dispatch(createAction('CTModel/getServiceDispatchTypeAndRecord')({
                                    params: {
                                        dispatchId: paramObject.ID
                                    }
                                }));
                            } else {
                                ShowToast('参数错误');
                            }
                        }
                        // this.props.dispatch(NavigationActions.navigate({
                        //     routeName: 'ReviewWorkOrderStatistics',
                        //     params: {
                        //         title:item.title,
                        //         ID:item.ID
                        //     }
                        // }))
                    } else {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'NormalMessageDetail',
                            params: {
                                ...item
                                , viewTitle: SentencedToEmpty(this.props
                                    , ['navigation', 'state', 'params', 'title']
                                    , '消息标题'
                                )
                            }
                        }));
                    }
                }}
            >
                <View style={[{
                    width: SCREEN_WIDTH, height: 88
                    , paddingVertical: 15, backgroundColor: '#ffffff'
                }]}>
                    <View style={[{
                        width: SCREEN_WIDTH - 42, marginLeft: 18
                        , flexDirection: 'row', justifyContent: 'space-between'
                    }]}>
                        <Text style={{ fontSize: 14, color: read ? '#999999' : '#333333', marginTop: 1 }}>{`${SentencedToEmpty(item, ['title'], '---')}`}</Text>
                        <View>
                            <Text style={{ fontSize: 11, color: read ? '#999999' : '#4AA0FF' }}>{'查看详情'}</Text>
                            {read ? null : <View style={{
                                height: 6, width: 6, borderRadius: 3
                                , backgroundColor: '#FF4138', position: 'absolute', right: -6, top: 0
                            }} />}
                        </View>
                    </View>
                    <Text
                        numberOfLines={2}
                        style={[{
                            width: SCREEN_WIDTH - 44, marginLeft: 18
                            , flexDirection: 'row', marginTop: 6
                            , fontSize: 13, color: read ? '#999999' : '#666666'
                            , lineHeight: 17, flexWrap: 'wrap'
                        }]}
                    >
                        {`${SentencedToEmpty(item, ['Msg'], '----------')}`}
                    </Text>
                </View>
            </TouchableOpacity>

        </View>)
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props, ['messageInfoListResult', 'status'], 200)}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.statusPageOnRefresh();
                }}
            >
                {/* <View style={{width:SCREEN_WIDTH,height:8}}></View> */}
                <FlatListWithHeaderAndFooter
                    ref={ref => (this.list = ref)}
                    // pageSize={this.props.pageSize}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    hasMore={() => {
                        return false;
                        // return SentencedToEmpty(this.props,['faultFeedbackList'],[]).length < this.props.faultFeedbackListTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        // this.onRefresh(index);
                    }}
                    renderItem={this._renderItem}
                    data={SentencedToEmpty(this.props, ['messageInfoList'], [])}
                />
                {SentencedToEmpty(this.props, ['allMessageReadResult', 'status'], 200) == -1
                    ? <SimpleLoadingComponent message={'全部置成已读中...'} /> : (null)}
            </StatusPage>
        )
    }
}
