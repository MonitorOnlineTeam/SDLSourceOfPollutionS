/*
 * @Description: 成套在主tab上增加消息模块
 * @LastEditors: hxf
 * @Date: 2023-09-04 08:59:54
 * @LastEditTime: 2024-12-27 15:26:24
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/chengTaoXiaoXi/index.js
 */
import Popover from 'react-native-popover';
import React, { Component } from 'react'
import { StyleSheet, ImageBackground, Text, TouchableOpacity, View, Image } from 'react-native'
// import { createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SDLText, StatusPage, AlertDialog } from '../../../components';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';
import globalcolor from '../../../config/globalcolor';

@connect(({ notice }) => ({
    pushMessageListResult: notice.pushMessageListResult,
    pushMessageListList: notice.pushMessageListList,

    noticeMessageInfoListIndex: notice.noticeMessageInfoListIndex,
    noticeMessageInfoListTotal: notice.noticeMessageInfoListTotal,
    noticeMessageInfoListResult: notice.noticeMessageInfoListResult,
    noticeMessageInfoListData: notice.noticeMessageInfoListData
}))
class index extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '消息',
            // headerTitleStyle: { marginLeft: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            placement: 'bottom',
            // buttonRect: {},
            buttonRect: { x: 100 - 100 / 2, y: 100 - 80, width: 100, height: 40 }
            , contentData: ''
            , optionItem: null
            , optionIndex: -1
        };
    }

    componentDidMount() {
        this.viewDidAppear = this.props.navigation.addListener('didFocus', obj => {
            // console.log('didFocus');
            this.statusPageOnRefresh();
        });
    }

    onRefresh = () => {
        // this.props.dispatch(createAction('notice/updateState')({ pushMessageListResult : { status: -1}}));
        this.props.dispatch(createAction('notice/getNewPushMessageList')({ setListData: this.list.setListData }))
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ pushMessageListResult: { status: -1 } }));
        this.props.dispatch(createAction('notice/getNewPushMessageList')({}))
    }

    getLocalTitle = (item) => {
        switch (item.MsgType) {
            /**
             * MsgType
             * 1(工单消息),12(审核结果),13(督查结果),14(运营到期通知)
             * ,15(更换提醒),16(绩效消息),17(系统设施核查消息),18(关键参数核查),19(成套任务))
             * 1 包含 pushType [5(任务打回),6(任务转发),7(提醒（任务创建）),8(系统派单)
             */
            case '1':// 'taskMessage' 工单消息
                return '工单消息';
            case '12': // 'auditingMessage' 审核结果
                return '审核结果';
            case '15':// 'changeMessage' 更换提醒
                return '更换提醒';
            case '14': // 'expireMessage' 运营到期通知
                return '运营到期通知';
            case '13':// 'inspectorMessage' 督查结果
                return '督查结果';
            case '17'://'InspectorRectificationMessage' 系统设施核查消息
                return '系统设施核查消息';
            case '18':// 'keyParameterMessage' 关键参数核查
                return '关键参数核查';
            case '16':// 'achievementsMessage' 绩效消息
                return '绩效消息';
            case '19'://  成套消息
                return '成套任务消息';
            default:
                return item.MsgTitle;
        }
    }

    getImageIcon = (index, item) => {
        // switch(item.localType) {
        switch (item.MsgType) {
            case '1':// 'taskMessage' 工单消息
                return require('../../../images/ic_msg_workorder.png');
            case '19':// 成套工单消息
                return require('../../../images/ic_msg_workorder.png');
            case '12': // 'auditingMessage' 审核结果
                return require('../../../images/ic_msg_audit.png');
            case '15':// 'changeMessage' 更换提醒
                return require('../../../images/ic_msg_replace.png');
            case '14': // 'expireMessage' 运营到期通知
                return require('../../../images/ic_msg_operation_due.png');
            case '13':// 'inspectorMessage' 督查结果
                return require('../../../images/ic_msg_inspection.png');
            case '17'://'InspectorRectificationMessage' 系统设施核查消息
                return require('../../../images/ic_msg_inspection.png');
            case '18':// 'keyParameterMessage' 关键参数核查
                return require('../../../images/ic_msg_inspection.png');
            case '16':// 'achievementsMessage' 绩效消息
                return require('../../../images/ic_msg_performance.png');
            default:
                // return require('../../../images/ic_msg_dispatch_task.png');
                return require('../../../images/ic_msg_workorder.png');
        }
    }

    _renderItem = ({ item, index }) => {
        return (<TouchableOpacity
            onLongPress={e => {
                this.setState({
                    optionItem: item,
                    optionIndex: index
                });
                const {
                    nativeEvent: { pageX, pageY }
                } = e;
                const width = 100,
                    height = 40;
                let placement = 'bottom';
                if (pageY > SCREEN_HEIGHT - 140) placement = 'top';
                let contentData = '置顶';
                if (item.IsSticky == 1) {
                    //取消置顶操作
                    contentData = '取消置顶';
                } else {
                    //置顶操作
                }
                this.setState({
                    optionItem: item,
                    optionIndex: index,
                    isVisible: true,
                    contentData,
                    placement,
                    // buttonRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
                    buttonRect: { x: 56.25, y: 22.70, width: 100, height: 40 }
                });
            }}
            onPress={() => {
                this.props.dispatch(createAction('notice/updateState')({
                    PushType: item.PushType
                    , messageTypeId: item.ID
                    , MsgType: item.MsgType
                }));
                let title = item.MsgTitle;
                switch (item.MsgType) {
                    case '1':// 'taskMessage' 工单消息
                        title = '工单消息';
                        break;
                    case '12': // 'auditingMessage' 审核结果
                        title = '审核结果';
                        break;
                    case '15':// 'changeMessage' 更换提醒
                        title = '更换提醒';
                        break;
                    case '14': // 'expireMessage' 运营到期通知
                        title = '运营到期提醒';
                        break;
                    case '13':// 'inspectorMessage' 督查结果
                        title = '督查结果';
                        break;
                    case '17'://'InspectorRectificationMessage' 系统设施核查消息
                        title = '系统设施核查消息';
                        break;
                    case '18':// 'keyParameterMessage' 关键参数核查
                        title = '关键参数核查消息';
                        break;
                    case '16':// 'achievementsMessage' 绩效消息
                        title = '绩效消息';
                        break;
                    case '19':// 成套工单消息
                        title = '成套工单消息';
                        break;
                    case '23':// 报警信息
                        title = '报警信息';
                        break;
                }
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'ServiceDispatchMessage',
                    // params: { title:'服务派单' }
                    params: { title }
                }));
            }}
        >
            <View style={{ width: SCREEN_WIDTH, height: 65, backgroundColor: SentencedToEmpty(item, ['IsSticky'], -1) == 1 ? '#F5F5F5' : 'white' }}>
                <View style={[{
                    width: SCREEN_WIDTH - 20, height: 64, flexDirection: 'row'
                    , alignItems: 'center', marginLeft: 21,
                }]}>
                    {/* <View style={[{backgroundColor:'#4D89FF', height:35, width:35}]} /> */}
                    <Image source={this.getImageIcon(index, item)} style={[{ width: 35, height: 35 }]} />
                    <View style={[{ flex: 1, height: 36, marginLeft: 6, justifyContent: 'space-between' }]}>
                        <View style={[{
                            width: SCREEN_WIDTH - 61, flexDirection: 'row'
                            , justifyContent: 'space-between'
                        }]}
                        >
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`${this.getLocalTitle(item)}`}</Text>
                            <Text style={[{ fontSize: 11, color: '#666666', marginRight: 21 }]}>{`${SentencedToEmpty(item, ['Col5'], '-----')}`}</Text>
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH - 61, flexDirection: 'row'
                            , justifyContent: 'space-between', alignItems: 'center'
                        }]}
                        >
                            <Text numberOfLines={1} style={[{ fontSize: 13, color: '#666666', flex: 1 }]}>{`${SentencedToEmpty(item, ['Msg'], '----------')}`}</Text>
                            {SentencedToEmpty(item, ['NoReadCount'], 0) != 0 ? <ImageBackground
                                style={[{
                                    height: 24, width: 18, marginRight: 18, marginLeft: 12
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                                source={require('../../../images/bg_red_point_with_num.png')}
                            >
                                <Text style={[{ fontSize: 8, color: 'white', padding: 0, textAlign: 'center', height: 8, lineHeight: 8 }]}>{`${item.NoReadCount}`}</Text>
                            </ImageBackground> : <View style={[{ width: 38 }]} />}
                        </View>
                    </View>
                </View>
                <View style={[{ marginLeft: 21, width: SCREEN_WIDTH - 42, height: 1, backgroundColor: '#EAEAEA' }]} />
            </View>
        </TouchableOpacity>)
    }

    closePopover = () => {
        this.setState({ isVisible: false });
    }

    cancelButton = () => {

    }

    confirm = () => {
        const item = this.state.optionItem;
        let params = {
            pushType: [item.MsgType]
        };
        if (item.MsgType == 1) {
            params.pushType = [5, 6, 7, 8];
        }
        this.props.dispatch(createAction('notice/deleteMessageByPushType')({
            params
        }));
    }

    render() {
        console.log('state = ', this.state);
        let alertOptions = {
            headTitle: '提示',
            messText: `确定要删除${SentencedToEmpty(this.state, ['optionItem', 'MsgTitle'], '此消息')}吗？`,
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        const displayArea = { x: 0, y: 44 + 20, width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 44 - 44 - 20 };
        console.log('displayArea = ', displayArea);
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.pushMessageListResult
                    , ['status'], 200)}
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
                <View style={styles.container}>
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
                        data={this.props.pushMessageListList}
                    />
                </View>
                <Popover
                    isVisible={this.state.isVisible}
                    fromRect={this.state.buttonRect}
                    displayArea={displayArea}
                    placement={this.state.placement}
                    onClose={this.closePopover}
                >
                    <View style={styles.popoverContent}>
                        <TouchableOpacity
                            onPress={() => {
                                const item = this.state.optionItem;
                                let params = {
                                    MsgType: item.MsgType
                                };
                                if (item.IsSticky == 0) {
                                    params.SType = 1;
                                } else {
                                    params.SType = 0;
                                }
                                this.props.dispatch(createAction('notice/stickyMessage')({
                                    params
                                }));
                                this.closePopover();
                            }}
                        >
                            <View style={[{
                                height: 40, width: 100
                                , justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <SDLText>{this.state.contentData}</SDLText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.doAlert.show();

                                this.closePopover();
                            }}
                        >
                            <View style={[{
                                height: 40, width: 100
                                , justifyContent: 'center', alignItems: 'center'
                            }]}>
                                <SDLText>{'删除'}</SDLText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Popover>
                <AlertDialog options={alertOptions} ref="doAlert" />
            </StatusPage>
        )
    }

}

// export default createStackNavigator({ index });
export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    popoverContent: {
        width: 100,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    popoverText: {
        color: '#333333'
    }
});