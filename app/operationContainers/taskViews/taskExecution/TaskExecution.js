//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';

import globalcolor from '../../../config/globalcolor';
import TaskImformation from './TaskInfo';
import TaskProcessing from './TaskProcessing';
import { createAction, ShowToast, NavigationActions, SentencedToEmpty, createNavigationOptions } from '../../../utils';
import MyTabBar from './components/MyTabBar';
import { getToken } from '../../../dvapack/storage';
import { SimpleLoadingComponent, StatusPage, AlertDialog } from '../../../components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@connect(({ taskModel, loading }) => ({
    currentTask: taskModel.currentTask,
    saveTaskStatus: taskModel.saveTaskStatus,
    getTaskDetailsStatus: taskModel.getTaskDetailsStatus,
    upLoadImageLoading: loading.effects['taskModel/upLoadImage'],
    deleteImageLoading: loading.effects['taskModel/deleteImage']
}))
class TaskExecution extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '任务详情',
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        if (SentencedToEmpty(navigation, ['state', 'params', 'canTransmitTask'], false) && navigation.state.params.transmitTask) {
                            navigation.state.params.transmitTask();
                        }
                    }}
                >
                    {SentencedToEmpty(navigation, ['state', 'params', 'canTransmitTask'], false) ? <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> : <View />}
                </TouchableOpacity>
            )
        });
    // ({ navigation }) => {
    //     return {
    //         headerMode: 'float',
    //         title: '任务详情',
    //         tabBarLable: '任务详情',
    //         animationEnabled: false,
    //         headerBackTitle: null,
    //         headerTintColor: '#ffffff',
    //         headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17 }, //标题居中
    //         headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 45 },
    //         headerRight: (
    //             <TouchableOpacity
    //                 onPress={() => {
    //                     if (SentencedToEmpty(navigation, ['state', 'params', 'canTransmitTask'], false) && navigation.state.params.transmitTask) {
    //                         navigation.state.params.transmitTask();
    //                     }
    //                 }}
    //             >
    //                 {SentencedToEmpty(navigation, ['state', 'params', 'canTransmitTask'], false) ? <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> : <View />}
    //             </TouchableOpacity>
    //         )
    //     };
    // };

    constructor(props) {
        super(props);
        let user = getToken();
        this.state = {
            startTask: false,
            //下拉列表大小范围
            spinnerRect: { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2, width: 200, height: 200 },
            user,
            menuView: <View />,
            dialogType: null
        };
        this.props.navigation.setParams({ transmitTask: this.transmitTask });
    }

    transmitTask = () => {
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'TaskTransfer',
                params: {}
            })
        );
    };

    componentDidMount() {
        // let signInfo = SentencedToEmpty(this.props.getTaskDetailsStatus, ['data', 'data', 'SignInfo'], []),
        //     TaskStatus = SentencedToEmpty(this.props.getTaskDetailsStatus, ['data', 'data', 'TaskStatus'], 3);
        // console.log('signInfo = ', signInfo);
        // console.log('TaskStatus = ', TaskStatus);
        // console.log('currentTask = ', this.props.currentTask);
        // console.log('typeof = ', typeof this.refs.doAlert);
        // if (signInfo.length == 0 && (TaskStatus == 1 || TaskStatus == 2)) {
        //     if (typeof this.refs.doAlert != 'undefined') {
        //         this.refs.doAlert.show();
        //     }
        // }
    }

    componentWillReceiveProps(nextProps) {
        // let signInfo = SentencedToEmpty(nextProps.currentTask, ['SignInfo'], []),
        //     TaskStatus = SentencedToEmpty(nextProps.currentTask, ['TaskStatus'], 3);
        // console.log('signInfo = ', signInfo);
        // console.log('TaskStatus = ', TaskStatus);
        // console.log('currentTask = ', nextProps.currentTask);
        // console.log('typeof = ', typeof this.refs.doAlert);
        // if (signInfo.length == 0 && (TaskStatus == 1 || TaskStatus == 2)) {
        //     // if (typeof this.refs.doAlert != 'undefined') {
        //     this.refs.doAlert.show();
        //     // }
        // }
    }

    onChange = e => {
        const i = e;
    };

    _showClockIn = () => {
        this.props.dispatch(createAction('excuteTask/clockinTimer')());
        if (this._modalParent) {
            this._modalParent.showModal();
        }
    };

    //显示下拉列表
    showSpinner() {
        this.refs.spinner.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                spinnerRect: { x: 290, y: 0, width: 140, height: 0 }
            });
        });
    }

    //隐藏下拉列表
    closeSpinner() {
        this.setState({
            isVisible: false
        });
    }

    onRefresh = () => {
        this.props.dispatch(createAction('taskModel/GetTaskDetails')({}));
    };

    cancelButton = () => {};
    // refreshTaskData = () => {
    //     this.props.dispatch(createAction('taskModel/GetTaskDetails')({}));
    //     let currentTask = this.props.currentTask;
    //     currentTask.SignInfo = [{}];
    //     this.props.dispatch(createAction('taskModel/updateState')({ currentTask }));
    // };
    confirm = () => {
        this.props.dispatch(
            createAction('taskModel/updateState')({
                currnetTimeCardEnterprise: {
                    TaskID: SentencedToEmpty(this.props.currentTask, ['TaskCode'], ''),
                    EntCode: SentencedToEmpty(this.props.currentTask, ['EntCode'], ''),
                    EntName: SentencedToEmpty(this.props.currentTask, ['EntName'], ''),
                    Latitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Latitude'], 40.812903)),
                    Longitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Longitude'], 111.683724)),
                    Radius: parseFloat(SentencedToEmpty(this.props.currentTask, ['Radius'], 1000))
                }
            })
        );
        ShowToast('您还未进行厂区打卡');
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'PunchingTimeCard',
                params: {
                    // refreshTaskData: this.refreshTaskData
                }
            })
        );
    };

    render() {
        console.log('TaskExecution render');
        let options = {
            headTitle: '提示',
            messText: '请先进行打卡操作！',
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
        return (
            <View style={styles.container}>
                <StatusPage
                    status={this.props.getTaskDetailsStatus.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.onRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.onRefresh();
                    }}
                >
                    {this.props.saveTaskStatus.status == -1 ? <SimpleLoadingComponent message={'正在提交申请'} /> : null}
                    {this.props.upLoadImageLoading ? <SimpleLoadingComponent message={'正在上传图片'} /> : null}
                    {this.props.deleteImageLoading ? <SimpleLoadingComponent message={'正在删除图片'} /> : null}
                    <ScrollableTabView
                        onChangeTab={obj => {
                            this.onChange(obj.i);
                        }}
                        // initialPage={1}
                        style={{ height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}
                        renderTabBar={() => <MyTabBar tabNames={['基本信息', '任务处理']} />}
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
                        <TaskImformation
                            tabLabel="基本信息"
                            listKey="a"
                            key="0"
                            onRefresh={() => {
                                this.props.navigation.state.params.onRefresh();
                            }}
                        />
                        <TaskProcessing
                            tabLabel="任务处理"
                            listKey="b"
                            key="1"
                            _showClockIn={this._showClockIn}
                            _reFreshParentPage={() => {
                                this.props.navigation.state.params._onRefresh();
                            }}
                        />
                    </ScrollableTabView>
                </StatusPage>
                <AlertDialog options={options} ref="doAlert" />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalcolor.white
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 400,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    contextStyle: {
        margin: 50,
        flex: 1
    },
    triggerStyle: {
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    overlayStyle: {
        left: 0,
        marginTop: 50
    }
});

//make this component available to the app
export default TaskExecution;
