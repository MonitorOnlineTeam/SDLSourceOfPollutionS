import React, { Component } from 'react'
import { Platform, Text, Touchable, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SDLText, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import TextLabel from '../../../pollutionContainers/components/TextLabel';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

@connect(({ notice })=>({
    PushType:notice.PushType,
    messageInfoListResult: notice.messageInfoListResult,
    messageInfoList:notice.messageInfoList,
    messageInfoListTotal:notice.messageInfoListTotal,
    messageInfoListPageSize:notice.messageInfoListPageSize
}))
export default class NormalMessage extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: SentencedToEmpty(navigation,['state','params','title'],'待审批工单统计'),
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    onRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:1 }));
        this.props.dispatch(createAction('notice/getMessageInfoList')({}))
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:1, messageInfoListResult : { status: -1}}));
        this.props.dispatch(createAction('notice/getMessageInfoList')({setListData:()=>{
            /**
             * 5    任务打回
             * 6    任务转发
             * 7    提醒（任务创建）
             * 8    系统派单
             */
            /**
            设置为已读
            */
            this.props.dispatch(createAction('notice/setMessageRead')({params:{pushType:this.props.PushType == 8?[5,6,7,8]:this.props.PushType}}))
        }}))
    }


    renderItem = ({ item, index }) => {
        // 新版中MessageType名字发生冲突，使用 pushType 代替
        let MessageType = SentencedToEmpty(item, ['pushType'], 7);
        return(<TouchableOpacity style={[{ minHeight: 100, width: SCREEN_WIDTH, backgroundColor: '#fff', justifyContent: 'center' }]}>
            <View style={[{ minHeight: 100, width: SCREEN_WIDTH, paddingLeft: 5, paddingRight: 8, flexDirection: 'row', alignItems: 'center', paddingTop: 15 }]}>
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
                        <SDLText fontType={'normal'}>{`${item.title}`}</SDLText>
                        {item && item.TaskTypeName ? (
                            <TextLabel
                                style={{ marginLeft: 10 }}
                                text={SentencedToEmpty(item, ['TaskTypeName'], '')}
                                color={MessageType == 7 ? '#a9d49a' : MessageType == 2 || MessageType == 8 ? '#e1ba96' : MessageType == 6 ? '#e1a097' : MessageType == 5 ? '#97bee0' : '#a9d49a'}
                            />
                        ) : null}
                        <View style={[{ flex: 1 }]} />
                    </View>
                    {/* 长时间超标未反馈  */}
                    {/* 信息已经整合到Msg中 {MessageType == 9 ? null : <SDLText fontType={'small'} style={[{ marginTop: 6 }]}>{`${SentencedToEmpty(item, ['ParentName'], ' ') + '-' + SentencedToEmpty(item, ['PointName'], ' ')}`}</SDLText>} */}
                    <SDLText numberOfLines={3} android_hyphenationFrequency={'full'} fontType={'small'} style={[{ marginTop: 8, lineHeight:20, marginBottom:8 }]}>{`${SentencedToEmpty(item, ['Msg'], '-')}\t`}</SDLText>
                </View>
            </View>
        </TouchableOpacity>)
    };

    refreshNavigator = action => {
        if (action == 'logout') {
        this.setState({
            scenes: Actions.create(
            <Scene key="root">
                <Scene hideNavBar key="Login" component={Login} title="登录" />
            </Scene>,
            ),
        });
        } else if (action == 'login') {
        this.setState({
            scenes: Actions.create(getRouters(getMenu())),
        });
        }
    };

    render() {
        return (
            <StatusPage
                status={this.props.messageInfoListResult.status}
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
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={this.props.messageInfoListPageSize}
                    hasMore={() => {
                        return this.props.messageInfoList.length < this.props.messageInfoListTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:index }));
                        this.props.dispatch(createAction('notice/getMessageInfoList')({ setListData: this.list.setListData }))
                    }}
                    renderItem={this.renderItem}
                    data={this.props.messageInfoList}
                />
            </StatusPage>
        );
    }
}
