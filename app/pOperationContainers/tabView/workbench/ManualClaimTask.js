/*
 * @Description: 手动领取工单
 * @LastEditors: hxf
 * @Date: 2021-09-29 16:40:17
 * @LastEditTime: 2024-11-01 14:29:50
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbench/ManualClaimTask.js
 */

import React, { Component } from 'react'
import { Text, View, Dimensions, TouchableOpacity, Image, TextInput, Platform } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Popover from 'react-native-popover';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../utils';
import MyTabBar from '../../../operationContainers/taskViews/taskExecution/components/MyTabBarWithCount';
import { FlatListWithHeaderAndFooter, OperationAlertDialog, AlertDialog, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@connect(({ claimTaskModels }) => ({
    claimTaskResultWater: claimTaskModels.claimTaskResultWater,
    claimTaskResultGas: claimTaskModels.claimTaskResultGas,
    tabPageIndex: claimTaskModels.tabPageIndex,
}))
export default class ManualClaimTask extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '领取工单',
            headerTitleStyle: { marginRight: 0 },
            headerRight: (
                <View>
                    <TouchableOpacity
                        style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
                        onPress={(e) => {
                            const {
                                nativeEvent: { pageX, pageY }
                            } = e;
                            navigation.state.params.navigateRightPress(pageX, pageY);
                        }}
                    >
                        <Image source={require('../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
                    </TouchableOpacity>
                </View>
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            spinnerRect: {},
            // 废水 1 废气 2
            PollutantType: 1,
            task: null,
        }
        this.props.navigation.setParams({
            navigateRightPress: (pageX, pageY) => {
                this.showSpinner(pageX, pageY);
            }
        });
    }

    componentDidMount() {
        this.props.dispatch(createAction('claimTaskModels/updateState')({ searchWord: '', PollutantType: 1, tabPageIndex: 0, claimTaskResultWater: { status: -1 } }));

        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
    }

    //显示下拉列表
    // showSpinner = (pageX, pageY) => {
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

    _renderItemList = ({ item: { pointName, entName, createTime, taskID, overHour, overDay } }) => {
        return <TouchableOpacity
            onPress={() => {
                this.setState({ task: { pointName, entName, createTime, taskID, overHour, overDay } });
                this.refs.receiveCalibration.show();
            }}>
            <View style={[{
                height: 107.5, width: SCREEN_WIDTH, backgroundColor: 'white'
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <View style={[{
                    flex: 1, height: 79.5, marginTop: 14.5, marginBottom: 13.5, marginLeft: 19
                    , justifyContent: 'space-between'
                }]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[{ color: '#333333', fontSize: 15 }]}>{`${pointName}`}</Text>
                        <View style={[{ width: 45, height: 16, backgroundColor: "#A7CFFC", justifyContent: 'center', alignItems: 'center', marginLeft: 5 }]}>
                            <Text style={[{ color: 'white', fontSize: 10 }]}>{'校准'}</Text>
                        </View>
                    </View>
                    <Text style={[{ fontSize: 12, color: '#666666' }]}>{`企业名称：${entName}`}</Text>
                    <Text style={[{ fontSize: 12, color: '#666666' }]}>{`创建时间：${createTime}`}</Text>
                    {
                        /**overHour<0 表示联网出现错误 任务已经超时 */
                        overHour < 0 ? <Text style={[{ color: '#F14D4D', fontSize: 10 }]}>{`工单即将关闭`}</Text>
                            : <Text style={[{ color: '#F14D4D', fontSize: 10 }]}>{`工单${overDay == 0 && overHour == 0 ? '' : '于'}${overDay != 0 ? overDay + '天' : ''}${overHour != 0 ? overHour + '小时' : ''}${overDay == 0 && overHour == 0 ? '即将' : '后'}自动关闭`}</Text>
                    }
                </View>
                <View style={[{
                    height: 34, width: 34, backgroundColor: '#F78259', marginHorizontal: 14.5, borderRadius: 17
                    , justifyContent: 'center', alignItems: 'center'
                }]}>
                    <Text style={[{ fontSize: 12, color: 'white' }]}>{'领取'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    }

    onItemClick = (label) => {
        if (label == '功能说明') {
            this.refs.doAlert.show();
            this.setState({
                isVisible: false
            });
        } else if (label == '领取记录') {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'ClaimTaskList', params: {} }));
            this.setState({
                isVisible: false
            });
        }
    }

    _onChangeTab = (index) => {
        let params = { PollutantType: 1 };
        if (index == 0) {
            params.PollutantType = 1;
        } else if (index == 1) {
            params.PollutantType = 2;
        }
        this.getData(params);
    }

    getData = (params, callback = () => { }) => {
        this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params, callback }))
    }

    receiveTask = () => {
        if (typeof this.state.task != 'undefined' && this.state.task) {
            // 参数  Type（1、领取；2、弃领） TaskID
            this.props.dispatch(createAction('claimTaskModels/receiveTask')({
                params: { Type: 1, TaskID: this.state.task.taskID }
                , success: () => {
                    ShowToast('任务领取成功');
                    let tabPageIndex = this.props.tabPageIndex;
                    let params = {};
                    let callback = null;
                    if (tabPageIndex == 0) {
                        params.claimTaskResultWater = { status: -1 }
                        params.PollutantType = 1;
                        callback = this.waterList.setListData;
                    } else if (tabPageIndex == 1) {
                        params.claimTaskResultGas = { status: -1 }
                        params.PollutantType = 2;
                        callback = SentencedToEmpty(this, ['gasList', 'setListData'], () => { });
                    } else {
                        params.claimTaskResultWater = { status: -1 }
                    }
                    this.getData(params);
                }
                , failure: () => {
                    ShowToast('任务领取失败');
                }
            }));
        } else {
            ShowToast('任务信息错误');
        }
    }

    receiveCalibrationOptions = {
        headTitle: '提示',
        messText: '是否确定要领取此任务吗？',
        headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
        buttons: [
            {
                txt: '取消',
                btnStyle: { backgroundColor: 'transparent' },
                txtStyle: { color: globalcolor.headerBackgroundColor },
                onpress: () => { }
            },
            {
                txt: '确定',
                btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                txtStyle: { color: '#ffffff' },
                onpress: this.receiveTask
            }
        ]
    };

    render() {
        var options = {
            headTitle: '说明',
            innersHeight: 280,
            messText: `此页面是废水废气校准工单领取页面：
1、校准工单：废水、废气设备校准的第一个工单需要手工创建，以后新的校准工单则在已有校准工单结束后自动生成。
2、监测点运维到期或运维状态设置成已结束，系统则停止派发工单。
3、新生成工单处于待领取状态，工程师在此页面领取，领取后工单则出现待办任务中。领取后请及时完成，如放弃执行此次校准，请在待办任务中弃领工单或转发给实际执行人；
4、废水废气监测设备校准周期最长不超过7日，如果自动派发的工单在7日内不能领取完成，系统将会自动关闭工单。关闭的工单将影响校准完成率。`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '知道了',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <View style={{ width: SCREEN_WIDTH, height: '100%', backgroundColor: 'white' }}>
                <View
                    style={{
                        height: 40,
                        backgroundColor: globalcolor.headerBackgroundColor,
                        width: SCREEN_WIDTH,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'输入企业、点位搜索'}
                        style={{
                            color: '#333333',
                            textAlign: 'center',
                            width: SCREEN_WIDTH - 80,
                            borderColor: '#cccccc',
                            borderWidth: 0.5,
                            borderRadius: 15,
                            height: 30,
                            backgroundColor: '#fff',
                            paddingVertical: 0
                        }}
                        onChangeText={text => {
                            //动态更新组件内 记录输入内容
                            this.props.dispatch(createAction('claimTaskModels/updateState')({ searchWord: text }));
                            if (text == '') {
                                if (this.props.tabPageIndex == 0) {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
                                } else {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
                                }
                            }
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                    />
                    {
                        Platform.OS == 'android' ? <TouchableOpacity
                            style={{ marginLeft: -30 }}
                            onPress={() => {
                                this.refs.keyWordInput.clear();
                                this.props.dispatch(createAction('claimTaskModels/updateState')({ searchWord: '' }));
                                if (this.props.tabPageIndex == 0) {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
                                } else {
                                    this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
                                }
                            }}
                        >
                            <Image source={require('../../../images/clear.png')} style={{ width: 15, height: 15 }} />
                        </TouchableOpacity> : null
                    }
                    <TouchableOpacity
                        style={{ marginLeft: 30 }}
                        onPress={() => {
                            if (this.props.tabPageIndex == 0) {
                                this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 1, noCancelFlag: true }, callback: () => { } }))
                            } else {
                                this.props.dispatch(createAction('claimTaskModels/getUnclaimedTaskList')({ params: { PollutantType: 2, noCancelFlag: true }, callback: () => { } }))
                            }
                        }}
                    >
                        <Text style={{ fontSize: 15, color: 'white' }} >{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollableTabView
                    onChangeTab={obj => {
                        let params = { tabPageIndex: obj.i, };
                        if (obj.i == 0) {
                            params.claimTaskResultWater = { status: -1 }
                        } else if (obj.i == 1) {
                            params.claimTaskResultGas = { status: -1 }
                        } else {
                            params.claimTaskResultWater = { status: -1 }
                        }
                        this.props.dispatch(createAction('claimTaskModels/updateState')(params));
                        this._onChangeTab(obj.i);
                    }}
                    // initialPage={1}
                    style={{ flex: 1, width: SCREEN_WIDTH, }}
                    renderTabBar={() => <MyTabBar tabNames={[{ label: '废水', count: SentencedToEmpty(this.props.claimTaskResultWater, ['data', 'Total'], -1) },
                    { label: '废气', count: SentencedToEmpty(this.props.claimTaskResultGas, ['data', 'Total'], -1) }]} />}
                    tabBarUnderlineStyle={{
                        width: SCREEN_WIDTH / 2,
                        height: 2,
                        backgroundColor: '#4aa1fd',
                        marginBottom: -1
                    }}
                    tabBarPosition="top"
                    scrollWithoutAnimation={false}
                    tabBarUnderlineColor="#4aa1fd"
                    tabBarBackgroundColor="#FFFFFF"
                    tabBarActiveTextColor="#4aa1fd"
                    tabBarInactiveTextColor="#000033"
                    tabBarTextStyle={{ fontSize: 15, backgroundColor: 'red' }}
                >
                    <View tabLabel="废水" style={{ flex: 1 }}>
                        <View style={[{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }]}>
                        </View>
                        {
                            this.props.tabPageIndex == 0
                                ? <StatusPage
                                    backRef={SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'needRefresh'], 'true') == 'true'}
                                    status={this.props.claimTaskResultWater.status}
                                    errorBtnText={'点击重试'}
                                    emptyBtnText={'点击重试'}
                                    onErrorPress={() => {
                                        let params = { PollutantType: 1 };
                                        this.getData(params);
                                    }}
                                    onEmptyPress={() => {
                                        let params = { PollutantType: 1 };
                                        this.getData(params);
                                    }}
                                >
                                    <FlatListWithHeaderAndFooter
                                        style={[{ backgroundColor: '#f2f2f2' }]}
                                        ref={ref => (this.waterList = ref)}
                                        ItemSeparatorComponent={() => {
                                            return (
                                                <View style={[{ height: 10.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                                    <View style={[{ height: 10.5, width: SCREEN_WIDTH - 13, backgroundColor: '#f2f2f2' }]} />
                                                </View>
                                            );
                                        }}
                                        pageSize={20}
                                        hasMore={() => {
                                            return false;
                                        }}
                                        onRefresh={index => {
                                            let params = { PollutantType: 1 };
                                            this.getData(params, this.waterList.setListData);
                                        }}
                                        onEndReached={index => {
                                            // 不分页
                                        }}
                                        renderItem={item => {
                                            return this._renderItemList(item);
                                        }}
                                        data={SentencedToEmpty(this.props.claimTaskResultWater, ['data', 'Datas'], [])}
                                    />
                                </StatusPage>
                                : <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}></View>
                        }
                        {/*
                            // 数据样例
                            [{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            },{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            },{
                                pointName:'废水排放口',
                                entName:'新疆白鹭纤维有限公司',
                                createTime:'2020-08-13 15:33',
                                taskID:'',
                                overHour:'14',
                                overDay:'5'
                            }]
                         */}
                    </View>
                    <View tabLabel="废气" style={{ flex: 1 }}>
                        <View style={[{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }]}></View>
                        {
                            this.props.tabPageIndex == 1
                                ? <StatusPage
                                    backRef={SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'needRefresh'], 'true') == 'true'}
                                    status={this.props.claimTaskResultGas.status}
                                    errorBtnText={'点击重试'}
                                    emptyBtnText={'点击重试'}
                                    onErrorPress={() => {
                                        let params = { PollutantType: 2 };
                                        this.getData(params);
                                    }}
                                    onEmptyPress={() => {
                                        let params = { PollutantType: 2 };
                                        this.getData(params);
                                    }}
                                >
                                    <FlatListWithHeaderAndFooter
                                        style={[{ backgroundColor: '#f2f2f2' }]}
                                        ref={ref => (this.gasList = ref)}
                                        ItemSeparatorComponent={() => {
                                            return (
                                                <View style={[{ height: 10.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                                    <View style={[{ height: 10.5, width: SCREEN_WIDTH - 13, backgroundColor: '#f2f2f2' }]} />
                                                </View>
                                            );
                                        }}
                                        pageSize={20}
                                        hasMore={() => {
                                            return false;
                                        }}
                                        onRefresh={index => {
                                            let params = { PollutantType: 2 };
                                            this.getData(params, SentencedToEmpty(this, ['gasList', 'setListData'], () => { }));
                                        }}
                                        onEndReached={index => {
                                            // 不分页
                                        }}
                                        renderItem={item => {
                                            return this._renderItemList(item);
                                        }}
                                        data={SentencedToEmpty(this.props.claimTaskResultGas, ['data', 'Datas'], [])}
                                    />
                                </StatusPage>
                                : <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}></View>
                        }
                    </View>
                </ScrollableTabView>
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
                    style={{ backgroundColor: 'red' }}
                >
                    <View style={{ alignItems: 'center' }}>
                        {['领取记录', '功能说明'].map((result, i, arr) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => this.onItemClick(arr[i])} underlayColor="transparent">
                                    <Text style={{ fontSize: 16, color: 'white', padding: 8, fontWeight: '400' }}>{arr[i]}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Popover>
                <OperationAlertDialog options={options} ref="doAlert" />
                <AlertDialog options={this.receiveCalibrationOptions} ref="receiveCalibration" />
            </View>
        )
    }
}
