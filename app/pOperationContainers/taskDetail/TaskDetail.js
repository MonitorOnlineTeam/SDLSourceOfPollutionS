import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Platform, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
// import { createStackNavigator, NavigationActions } from 'react-navigation';
// import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { Geolocation, stop } from 'react-native-amap-geolocation';

// import MyTabBar from '../../operationContainers/taskViews/taskExecution/components/MyTabBar';
import TaskInfo from './TaskInfo';
import TaskHandle from './TaskHandle';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty, NavigationActions } from '../../utils';
import { StatusPage, Touchable, ModalParent, SDLText, SimpleLoadingView } from '../../components';
import Mask from '../../components/Mask';
import globalcolor from '../../config/globalcolor';
import TaskSign from './TaskSign';
// import IconDialog from '../../operationContainers/taskViews/taskExecution/components/IconDialog';
import SDLTabButton from '../../components/SDLTabButton';
import AutoTimerText from '../components/AutoTimerText';
import IconDialog from '../../components/IconDialog';

var react_native_1 = require('react-native');
var AMapGeolocation = react_native_1.NativeModules.AMapGeolocation;
let _me;
/**
 * 任务详情
 * @class TaskDetail
 * @extends {Component}
 */
@connect(({ taskDetailModel }) => ({
    tabIndex: taskDetailModel.tabIndex,
    status: taskDetailModel.status,
    errorMsg: taskDetailModel.errorMsg, // 任务详情错误信息
    taskDetail: taskDetailModel.taskDetail,
    isMyTask: taskDetailModel.isMyTask,
    taskStatus: taskDetailModel.taskStatus,
    taskSingResult: taskDetailModel.taskSingResult
}))
export default class TaskDetail extends Component {
    // static navigationOptions = ({ navigation }) =>
    //     createNavigationOptions({
    //         title: '任务详情',
    //         headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
    //     });

    constructor(props) {
        super(props);
        this.state = {
            clockingIn: false,
            errorNum: 0
        };
        _me = this;
    }
    updateLocationState = location => {
        this.props.dispatch(
            createAction('taskDetailModel/taskSignIn')({
                params: {
                    taskID: this.props.taskDetail.ID,
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude
                },
                callback: () => {
                    this.setState({ clockingIn: false })
                    this._modalParent.hideModal();
                }
            })
        );
    };
    startLocation = () => {
        let watchId = '';
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            this.setState({ errorNum: 0 });
        }
        const taskInfo = {
            EnterpriseName: this.props.taskDetail.EnterpriseName,
            PointName: this.props.taskDetail.PointName,
            TaskCode: this.props.taskDetail.TaskCode
        }
        watchId = Geolocation.watchPosition(
            success => {
                //测试代码，定位5次后停止定位
                // console.log(`打卡第${this.state.errorNum+1}次，成功`);
                // if(this.state.errorNum+1==5){
                //     this.setState({errorNum:0});
                //     Geolocation.clearWatch(watchId);
                // }
                // console.log(success);
                // console.log('==============');
                // this.setState({errorNum:this.state.errorNum+1});

                // console.log('=============')
                // console.log(success);
                // console.log(JSON.stringify(taskInfo))
                // console.log('===========')
                /**
                 * longitude: location.coords.longitude,
                    latitude: location.coords.latitude
                 */
                if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0
                    || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                    if (this.state.errorNum + 1 == 5) {
                        this.setState({ errorNum: 0 });//计数器归零
                        Geolocation.clearWatch(watchId);//清楚监听
                        this.setState({ clockingIn: false })//停止打卡按钮转圈
                        this._modalParent.hideModal();//隐藏打卡按钮
                        this.props.dispatch(createAction('app/addClockInLog')({//提交异常日志
                            msg: `${JSON.stringify(success)}`
                        }))
                        stop();
                        ShowToast('定位错误 ' + JSON.stringify({ ...taskInfo, ...success }));
                    }
                    this.setState({ errorNum: this.state.errorNum + 1 });
                } else {
                    if (this && typeof this != 'undefined' && this.updateLocationState && typeof this.updateLocationState == 'function') {
                        this.updateLocationState(success);
                        this.setState({ errorNum: 0 });
                        Geolocation.clearWatch(watchId);
                    }
                    stop();
                }
            },
            error => {
                //测试代码 定位5次后停止定位
                // console.log(`打卡第${this.state.errorNum+1}次，失败`);
                // if(this.state.errorNum+1==5){
                //     Geolocation.clearWatch(watchId);
                //     this.setState({ clockingIn: false })
                //  }
                //  console.log('==============');
                // this.setState({errorNum:this.state.errorNum+1});

                if (this.state.errorNum + 1 == 5) {
                    this.setState({ errorNum: 0 });//计数器归零
                    Geolocation.clearWatch(watchId);//清楚监听
                    this.setState({ clockingIn: false })//停止打卡按钮转圈
                    this._modalParent.hideModal();//隐藏打卡按钮
                    this.props.dispatch(createAction('app/addClockInLog')({//提交异常日志
                        msg: `${JSON.stringify(error)}`
                    }))
                    stop();
                    ShowToast('定位错误 ' + JSON.stringify({ ...taskInfo, ...error }));
                }

                this.setState({ errorNum: this.state.errorNum + 1 });
            }
        );

        // watchId = Geolocation.getCurrentPosition(
        //     location => {
        //         if (this && typeof this != 'undefined' && this.updateLocationState && typeof this.updateLocationState == 'function') {
        //             // this.updateLocationState(location);
        //             this.setState({ clockingIn: false })

        //         }
        //     },
        //     error => {
        //         this.setState({ clockingIn: false })
        //         this._modalParent.hideModal();
        //         // console.log(error)
        //         this.props.dispatch(createAction('app/addClockInLog')({
        //             msg:JSON.stringify(error)
        //         }))
        //         ShowToast('定位错误 '+JSON.stringify(error));
        //     }
        // );
        return watchId;
    };
    componentDidMount() {
        // this.props.dispatch(createAction('taskDetailModel/updateState')({status:-1}))
        if (SentencedToEmpty(this.props, ['route', 'params', 'params', 'needApproval'], false)) {
            this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 1 }));
        } else {
            this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 0 }));
        }
        this.refreshSubScription = DeviceEventEmitter.addListener('refreshTask', message => {
            this.onRefresh();
        });
        // console.log('this = ', this);
        // this.props.navigation.setOptions({
        //     title: '123'
        //     , headerRight: () => <TouchableOpacity
        //         onPress={() => {
        //             console.log('321');
        //         }}
        //     >
        //         <View style={[{ width: 80, height: 40, justifyContent: 'center', alignItems: 'center' }]}>
        //             <Text>123</Text>
        //         </View>
        //     </TouchableOpacity>
        // });

        this.props.navigation.setOptions({
            headerRight: () => <View />
        });

        // const { taskID } = this.props.navigation.state.params;
        const { taskID } = this.props.route.params.params;
        this.props.dispatch(createAction('taskDetailModel/updateState')({ status: -1, taskID, errorMsg: '服务器加载错误' }));
        this.onRefresh();
        // this.props.navigation.setParams({
        //     headerRight: <View />
        // });
    }

    onRefresh = () => {
        this.props.dispatch(
            createAction('taskDetailModel/getTaskDetail')({
                params: {
                    callback: (isSign, isMyTask, taskStatus) => {
                        // 任务是我的，切任务状态不是完成和系统关闭，则可以转发
                        if (isMyTask && (taskStatus != '3' && taskStatus != '10')) {
                            //设置标题右侧按钮
                            //需要判断是否支持转发
                            this.props.navigation.setOptions({
                                headerRight: () => <TouchableOpacity
                                    onPress={() => {
                                        console.log('taskDetail = ', this.props.taskDetail);
                                        if (!this.props.isMyTask) {
                                            ShowToast('该任务无执行权限');
                                        } else if (this.props.taskStatus == '3') {
                                            ShowToast('已完成的任务无法转发');
                                        } else {
                                            this.props.dispatch(createAction('taskModel/updateState')({ TaskCode: this.props.taskDetail.TaskCode }));
                                            this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'TaskTransfer',
                                                    params: {}
                                                })
                                            );
                                        }
                                    }}
                                >
                                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'转发'}</SDLText>
                                </TouchableOpacity>
                            });
                            // this.props.navigation.setParams({
                            //     headerRight: (
                            //         <TouchableOpacity
                            //             onPress={() => {
                            //                 console.log('taskDetail = ', this.props.taskDetail);
                            //                 if (!this.props.isMyTask) {
                            //                     ShowToast('该任务无执行权限');
                            //                 } else if (this.props.taskStatus == '3') {
                            //                     ShowToast('已完成的任务无法转发');
                            //                 } else {
                            //                     this.props.dispatch(createAction('taskModel/updateState')({ TaskCode: this.props.taskDetail.TaskCode }));
                            //                     this.props.dispatch(
                            //                         NavigationActions.navigate({
                            //                             routeName: 'TaskTransfer',
                            //                             params: {}
                            //                         })
                            //                     );
                            //                 }
                            //             }}
                            //         >
                            //             <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'转发'}</SDLText>
                            //         </TouchableOpacity>
                            //     )
                            // });
                        }
                        if (isSign == false) {
                            if (this._modalParent) {
                                // 原打卡首次弹出
                                // this._modalParent.showModal();
                            }
                        }
                        const { from = 'other' } = this.props.route.params.params;
                        if (from == 'AlarmResponseRecord') {
                            // 来自异常报警响应记录
                            this.props.dispatch(createAction('taskDetailModel/updateState')({
                                tabIndex: 1
                            }));
                        }
                    }
                }
            })
        );
    };

    isEdit = () => {
        const { isMyTask, taskStatus, taskDetail } = this.props;
        if (!isMyTask) {
            return false; //不是我的任务不可以编辑
        }
        if ((taskStatus == '3' || taskStatus == '10') && !SentencedToEmpty(taskDetail, ['UpdateStatus'], false)) {
            //UpdateStatus 任务完成后一段时间内仍然可以修改，通过该字段控制，可能是6小时
            return false; //任务已完成,不可编辑 任务状态  1待执行，2进行中，3已完成
        }
        return true;
    };

    // 打卡
    clockIn = () => {
        if (Platform.OS == 'ios') {
            AMapGeolocation.RNTransferIOSWithCallBack(data => {
                if (data == 'false') {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                } else {
                    let watchId = this.startLocation();
                    this.setState({ watchId, clockingIn: true });
                    // this._modalParent.hideModal();
                }
            });
        } else {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                if (isLocationEnabled) {
                    let watchId = _me.startLocation();
                    _me.setState({ watchId, clockingIn: true });
                    // _me._modalParent.hideModal();
                } else {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                }
            });
        }
    }

    onChange = e => {
        const i = e;
    };
    componentWillUnmount() {
        // 页面销毁时移除 任务详情的更新监听
        this.refreshSubScription.remove();
        if (this.state.watchId != '') {
            stop();
            Geolocation.clearWatch(this.state.watchId);
        }
        this.props.dispatch(createAction('taskModel/updateState')({ currentTask: null }));
        //推出时刷新待办列表
        this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: 1, unhandleTaskListTotal: 0, unhandleTaskListResult: { status: -1 } }));
        this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({}));
        this.props.dispatch(createAction('taskModel/getUnhandleTaskTypeList')({}))
    }
    render() {
        // console.log(this.state)
        // console.log(this.props);
        // console.log(SentencedToEmpty(this.props,['navigation','state','params','needApproval'],false));
        let hideSign = SentencedToEmpty(this.props, ['taskDetail', 'OperationFlag'], '1') == 2
            || SentencedToEmpty(this.props, ['taskDetail', 'OperationFlag'], '1') == 3;
        return (
            <View style={styles.container}>
                {this.props.taskSingResult.status == -1 ? <SimpleLoadingView message={'打卡中'} /> : null}
                <StatusPage
                    status={this.props.status}
                    errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                    errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.props.dispatch(createAction('taskDetailModel/updateState')({ status: -1 }));
                        this.onRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.props.dispatch(createAction('taskDetailModel/updateState')({ status: -1 }));
                        this.onRefresh();
                    }}
                >
                    {this.props.status == -1 ? <SimpleLoadingView message={'正在提交申请'} /> : null}
                    {/* {this.props.upLoadImageLoading ? <SimpleLoadingView message={'正在上传图片'} /> : null}
                    {this.props.deleteImageLoading ? <SimpleLoadingView message={'正在删除图片'} /> : null} */}
                    <View style={[{
                        flexDirection: 'row', height: 44
                        , width: SCREEN_WIDTH, alignItems: 'center'
                        , justifyContent: 'space-between'
                        , backgroundColor: 'white', marginBottom: 5
                    }]}>
                        {hideSign ? null : <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.tabIndex == 0}
                            label='签到打卡'
                            onPress={() => {
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 0 }));
                            }}
                        />}
                        {hideSign ? <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 2}
                            selected={this.props.tabIndex == 0}
                            label='基本信息'
                            onPress={() => {
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 0 }));
                            }}
                        /> : <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.tabIndex == 1}
                            label='基本信息'
                            onPress={() => {
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 1 }));
                            }}
                        />}
                        {hideSign ? <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 2}
                            selected={this.props.tabIndex == 1}
                            label='任务处理'
                            onPress={() => {
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 1 }));
                            }}
                        /> : <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.tabIndex == 2}
                            label='任务处理'
                            onPress={() => {
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 2 }));
                            }}
                        />}
                    </View>
                    {
                        this.props.tabIndex == 0
                            ? hideSign ? <TaskInfo
                                tabLabel="基本信息"
                                listKey="a"
                                key="0"
                                needApproval={SentencedToEmpty(this.props, ['route', 'params', 'params', 'needApproval'], false)}
                            /> : <TaskSign
                                tabLabel="打卡"
                                listKey="c"
                                key="3"
                            />
                            : this.props.tabIndex == 1
                                ? hideSign ? <TaskHandle
                                    taskSign={() => {
                                        // if (this._modalParent) {
                                        //     this._modalParent.showModal();
                                        // }
                                        if (this.iconDialog) {
                                            this.iconDialog.showModal();
                                        }
                                    }}
                                    tabLabel="任务处理"
                                    listKey="b"
                                    key="1"
                                /> : <TaskInfo
                                    tabLabel="基本信息"
                                    listKey="a"
                                    key="0"
                                    needApproval={SentencedToEmpty(this.props, ['route', 'params', 'params', 'needApproval'], false)}
                                // onRefresh={() => {
                                // this.props.navigation.state.params.onRefresh();
                                // }}
                                />
                                : this.props.tabIndex == 2
                                    ? <TaskHandle
                                        taskSign={() => {
                                            // if (this._modalParent) {
                                            //     this._modalParent.showModal();
                                            // }
                                            if (this.iconDialog) {
                                                this.iconDialog.showModal();
                                            }
                                        }}
                                        tabLabel="任务处理"
                                        listKey="b"
                                        key="1"
                                    /> : null
                    }
                    {/* <ScrollableTabView
                        ref={ref => (this.scrollableTabView = ref)}
                        onChangeTab={obj => {
                            this.onChange(obj.i);
                            // console.log('onChangeTab = ',obj);
                        }}
                        // initialPage={1}
                        style={{ flex: 1, width: SCREEN_WIDTH }}
                        renderTabBar={() => <MyTabBar tabNames={hideSign ? ['基本信息', '任务处理'] : ['签到打卡', '基本信息', '任务处理']} />}
                        tabBarUnderlineStyle={{
                            width: hideSign ? SCREEN_WIDTH / 2 : SCREEN_WIDTH / 3,
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
                        {
                            hideSign ? null
                                : <TaskSign
                                    tabLabel="打卡"
                                    listKey="c"
                                    key="3"
                                />
                        }
                        <TaskInfo
                            tabLabel="基本信息"
                            listKey="a"
                            key="0"
                            needApproval={SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'needApproval'], false)}
                        // onRefresh={() => {
                        // this.props.navigation.state.params.onRefresh();
                        // }}
                        />
                        <TaskHandle
                            taskSign={() => {
                                // if (this._modalParent) {
                                //     this._modalParent.showModal();
                                // }
                                if (this.iconDialog) {
                                    this.iconDialog.showModal();
                                }
                            }}
                            tabLabel="任务处理"
                            listKey="b"
                            key="1"
                        />
                    </ScrollableTabView> */}
                </StatusPage>
                <ModalParent ref={ref => (this._modalParent = ref)}>
                    <Mask
                        hideDialog={() => {
                            this._modalParent.hideModal();
                        }}
                        style={{ justifyContent: 'center' }}
                    >
                        {
                            this.state.clockingIn ?
                                <View
                                    style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: globalcolor.headerBackgroundColor, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <ActivityIndicator color={'#fff'} size="small" />
                                    <SDLText style={{ color: '#fff', fontSize: 16, marginVertical: 10 }}>任务打卡</SDLText>
                                    <AutoTimerText ref={ref => (this.autoTimerText = ref)} />
                                </View>
                                : <Touchable
                                    onPress={() => {
                                        this.clockIn();
                                    }}
                                    style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: globalcolor.headerBackgroundColor, alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <SDLText style={{ color: '#fff', fontSize: 16, marginVertical: 10 }}>任务打卡</SDLText>
                                    <AutoTimerText ref={ref => (this.autoTimerText = ref)} />
                                </Touchable>
                        }
                        <TouchableOpacity
                            style={[{ height: 32, marginTop: 10 }]}
                            onPress={() => {
                                this._modalParent.hideModal();
                                if (SentencedToEmpty(this.props, ['taskDetail', 'Longitude'], -1) == -1 || SentencedToEmpty(this.props, ['taskDetail', 'Latitude'], -1) == -1) {
                                    ShowToast('企业信息异常，无法获取该任务的站点坐标。');
                                } else {
                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap' }));
                                }
                            }}
                        >
                            <SDLText style={[{ fontSize: 13, color: '#fff' }]}>查看打卡范围</SDLText>
                        </TouchableOpacity>
                    </Mask>
                </ModalParent>
                <IconDialog
                    ref={ref => (this.iconDialog = ref)}
                    icUri={require('../../images/ic_dialog_no_check_in.png')}
                >
                    <View style={{
                        width: 270, height: 150, alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 17, color: '#333333', marginVertical: 15 }}>{'未打卡提示'}</Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginBottom: 15 }}>{'打卡后才能执行任务'}</Text>
                        <TouchableOpacity
                            style={{}}
                            onPress={() => {
                                // if (this.scrollableTabView) {
                                //     this.scrollableTabView.goToPage(0)
                                // }
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 0 }));
                                this.iconDialog.hide();
                            }}
                        >
                            <View style={{
                                width: 210, height: 44, justifyContent: 'center'
                                , alignItems: 'center', borderRadius: 10, backgroundColor: '#4DA9FF'
                            }}>
                                <Text style={{ fontSize: 17, color: 'white' }}>{'前往打卡'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </IconDialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
