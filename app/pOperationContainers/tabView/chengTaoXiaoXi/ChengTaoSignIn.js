/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-09-06 14:20:53
 * @LastEditTime: 2024-02-04 09:05:57
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoSignIn.js
 */
import moment from 'moment';
import React, { Component } from 'react';
import { DeviceEventEmitter, Alert, NativeModules, Platform, Text, TouchableOpacity, View, Image, ScrollView, Animated, PanResponder, ImageBackground } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { connect } from 'react-redux';
import { Geolocation, stop } from 'react-native-amap-geolocation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import AutoTimerText from '../../../operationContainers/home/workbench/components/AutoTimerText';
import { CloseToast, createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../utils';
import IconDialog from '../../../operationContainers/taskViews/taskExecution/components/IconDialog';
const AMapGeolocation = NativeModules.AMapGeolocation;
const calenderComponentHeight = 300;
const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY-MM-DD';

@connect(({ CTModel }) => ({
    selectedProject: CTModel.selectedProject
}))
export default class ChengTaoSignIn extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '签到',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            showView: 'sign'
        };
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refresh', 'true');
    }

    render() {
        return (
            <View
                style={[
                    {
                        width: SCREEN_WIDTH,
                        flex: 1
                    }
                ]}
            >
                {this.state.showView == 'sign' ? <SignInComponent /> : null}
                {this.state.showView == 'statistics' ? <ChengTaoSigninStatistics /> : null}

                <View style={[{ width: SCREEN_WIDTH, height: 50, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, marginTop: 10 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                showView: 'sign'
                            });
                        }}
                    >
                        <View>
                            <Image
                                style={[
                                    {
                                        height: 18,
                                        width: 18,
                                        tintColor: this.state.showView == 'sign' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                                source={require('../../../images/ic_ct_tab_sign_in.png')}
                            />
                            <Text
                                style={[
                                    {
                                        fontSize: 11,
                                        color: this.state.showView == 'sign' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                            >
                                {`${'签到'}`}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                showView: 'statistics'
                            });
                        }}
                    >
                        <View>
                            <Image
                                style={[
                                    {
                                        height: 18,
                                        width: 18,
                                        tintColor: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                                source={require('../../../images/ic_ct_tab_signin_statistics.png')}
                            />
                            <Text
                                style={[
                                    {
                                        fontSize: 11,
                                        color: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                            >
                                {`${'统计'}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

@connect(({ CTModel }) => ({
    selectedProject: CTModel.selectedProject,
    ctSignInProject: CTModel.ctSignInProject,
    orientationStatus: CTModel.orientationStatus
}))
class SignInComponent extends Component {
    constructor(props) {
        super(props);
        _me = this;
        this.state = {
            lastLatitude: 0,
            lastLongitude: 0,
            clockingIn: false,
            orientationType: 'simple', // sighIn 签到 simple 单纯定位
            // orientationStatus: '' // in 在打卡范围内， out 在范围外
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('CTModel/updateState')({
                ctSignInProject: { status: -1 },
                orientationStatus: 'unlocated'
            })
        );
        this.props.dispatch(
            createAction('CTModel/getCTSignInProject')({
                params: {},
                callback: result => {
                    return true;
                }
            })
        );
        const myView = this;
        // 执行一次
        if (!myView.state.clockingIn) {
            myView.setState({ orientationType: 'simple' });
            myView.clockIn();
        }
        this.timer = setInterval(() => {
            if (!myView.state.clockingIn) {
                myView.setState({ orientationType: 'simple' });
                myView.clockIn();
            }
        }, 15000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // 签到
    clockIn = () => {
        if (Platform.OS == 'ios') {
            AMapGeolocation.RNTransferIOSWithCallBack(data => {
                if (data == 'false') {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                } else {
                    let watchId = this.startLocation();
                    this.setState({ watchId, clockingIn: true });
                }
            });
        } else {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                if (isLocationEnabled) {
                    let watchId = _me.startLocation();
                    _me.setState({ watchId, clockingIn: true });
                } else {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                }
            });
        }
    };

    startLocation = () => {
        let watchId = '';
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            this.setState({ errorNum: 0, watchId: '' });
        }
        const taskInfo = {
            //selectedProject
            CustomRegion: SentencedToEmpty(this.props, ['selectedProject', 'CustomRegion'], 'emptyProjectOrProperty'),
            ProjectName: SentencedToEmpty(this.props, ['selectedProject', 'ProjectName'], 'emptyProjectOrProperty'),
            ProjectId: SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty')
        };
        watchId = Geolocation.watchPosition(
            success => {
                if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0 || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                    if (this.state.errorNum + 1 == 5) {
                        this.setState({ errorNum: 0 }); //计数器归零
                        Geolocation.clearWatch(watchId); //清楚监听
                        this.setState({ clockingIn: false, watchId: '' }); //停止打卡按钮转圈
                        this.props.dispatch(
                            createAction('app/addClockInLog')({
                                //提交异常日志
                                msg: `${JSON.stringify(success)}`
                            })
                        );
                        stop();
                        ShowToast('定位错误 ' + JSON.stringify({ ...taskInfo, ...success }));
                    }
                    this.setState({ errorNum: this.state.errorNum + 1 });
                } else {
                    if (this && typeof this != 'undefined' && this.updateLocationState && typeof this.updateLocationState == 'function') {
                        this.updateLocationState(success);
                        this.setState({ errorNum: 0, clockingIn: false, watchId: '' });

                        Geolocation.clearWatch(watchId);
                    }
                    stop();
                }
            },
            error => {
                if (this.state.errorNum + 1 == 5) {
                    this.setState({ errorNum: 0 }); //计数器归零
                    Geolocation.clearWatch(watchId); //清楚监听
                    this.setState({ clockingIn: false, watchId: '' }); //停止打卡按钮转圈
                    this.props.dispatch(
                        createAction('app/addClockInLog')({
                            //提交异常日志
                            msg: `${JSON.stringify(error)}`
                        })
                    );
                    stop();
                    ShowToast('定位错误 ' + JSON.stringify({ ...taskInfo, ...error }));
                }

                this.setState({ errorNum: this.state.errorNum + 1 });
            }
        );
        return watchId;
    };

    updateLocationState = location => {
        this.setState({
            lastLatitude: location.coords.latitude,
            lastLongitude: location.coords.longitude
        });
        SentencedToEmpty(this.props, ['taskDetail', 'Longitude'], -1) == -1 || SentencedToEmpty(this.props, ['taskDetail', 'Latitude'], -1) == -1;
        let distanceResult;
        if (Platform.OS == 'ios') {
            distanceResult = AMapGeolocation.RNTransferDistance({
                latitude: SentencedToEmpty(this.props, ['selectedProject', 'Latitude'], 0),
                longitude: SentencedToEmpty(this.props, ['selectedProject', 'Longitude'], 0),
                Anolatitude: location.coords.latitude,
                Anolongitude: location.coords.longitude
            });
        } else {
            distanceResult = AMapGeolocation.RNTransferDistance(
                SentencedToEmpty(this.props, ['selectedProject', 'Latitude'], 0),
                SentencedToEmpty(this.props, ['selectedProject', 'Longitude'], 0),
                location.coords.latitude,
                location.coords.longitude
            );
        }

        /**
         * 40.07,116.32,40.09,116.29
         * 40.07,116.32,40.06,116.38
         */
        distanceResult
            .then(result => {
                if (result.distance <= SentencedToEmpty(this.props, ['selectedProject', 'Range'], 0)) {
                    // this.setState({ orientationStatus: 'in' });
                    this.props.dispatch(createAction('CTModel/updateState')({
                        orientationStatus: 'in'
                    }));
                    if (this.state.orientationType == 'sighIn') {
                        // sighIn 签到 simple 单纯定位
                        ShowLoadingToast('签到信息上传中');
                        //签到CheckType=1 签退CheckType=2
                        this.props.dispatch(
                            createAction('CTModel/doCTSignIn')({
                                params: {
                                    checkType: this.getSignInStatus() ? 2 : 1,
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude
                                },
                                callback: () => {
                                    CloseToast('签到结束');
                                    ShowToast(`${this.getSignInStatus() ? '签退' : '签到'}成功`);
                                    return true;
                                }
                            })
                        );
                    }
                } else {
                    // this.setState({ orientationStatus: 'out' });
                    this.props.dispatch(createAction('CTModel/updateState')({
                        orientationStatus: 'out'
                    }));
                    if (this.iconDialog && this.state.orientationType == 'sighIn') {
                        this.iconDialog.showModal();
                    }
                }
            })
            .catch(error => {
                console.log('error = ', error);
            });
    };

    getSignInStatus = () => {
        const dataList = SentencedToEmpty(this.props, ['ctSignInProject', 'data', 'Datas'], []);
        if (dataList.length == 1) {
            // 显示签退
            return true;
        } else {
            // 显示签到
            return false;
        }
    };

    hasSignIn = () => {
        const dataList = SentencedToEmpty(this.props, ['ctSignInProject', 'data', 'Datas'], []);
        if (dataList.length > 0 && SentencedToEmpty(dataList, [0, 'CheckType'], -1) == 1) {
            return true;
        } else {
            return false;
        }
    };
    hasSignOut = () => {
        const dataList = SentencedToEmpty(this.props, ['ctSignInProject', 'data', 'Datas'], []);
        if (dataList.length > 1 && SentencedToEmpty(dataList, [dataList.length - 1, 'CheckType'], -1) == 2) {
            return true;
        } else {
            return false;
        }
    };

    getProjectName = () => {
        const ProjectId = SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty');
        if (ProjectId == 'emptyProjectOrProperty') {
            return '请选择企业';
        } else {
            // return SentencedToEmpty(this.props, ['selectedProject', 'ProjectName'], '项目名称为空');
            return SentencedToEmpty(this.props, ['selectedProject', 'EntName'], '企业名称为空');
        }
    };

    getPromptMessageView = () => {
        const ProjectName = SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty');
        if (ProjectName == 'emptyProjectOrProperty') {
            return (
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            marginTop: 10
                        }
                    ]}
                >
                    <Image style={[{ width: 15, height: 15, marginRight: 6 }]} source={require('../../../images/ic_ct_sign_in_unselected_project.png')} />
                    <Text style={[{ fontSize: 11, color: '#666666' }]}>{'未选中企业'}</Text>
                </View>
            );
            // } else if (this.state.orientationStatus == 'in') {
        } else if (this.props.orientationStatus == 'unlocated') {
            // 未定位
            return (
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            marginTop: 10
                        }
                    ]}
                >
                    <Image style={[{ width: 15, height: 15, marginRight: 6 }]} source={require('../../../images/ic_ct_sign_in_position_out.png')} />
                    <Text style={[{ fontSize: 11, color: '#666666' }]}>{'正在定位请稍后'}</Text>
                </View>
            );
        } else if (this.props.orientationStatus == 'in') {
            return (
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            marginTop: 10
                        }
                    ]}
                >
                    <Image style={[{ width: 15, height: 15, marginRight: 6 }]} source={require('../../../images/ic_ct_range_into.png')} />
                    <Text style={[{ fontSize: 11, color: '#058BFA' }]}>{'已进入签到范围内'}</Text>
                </View>
            );
            // } else if (this.state.orientationStatus == 'out') {
        } else if (this.props.orientationStatus == 'out') {
            return (
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            marginTop: 10
                        }
                    ]}
                >
                    <Image style={[{ width: 15, height: 15, marginRight: 6 }]} source={require('../../../images/ic_ct_sign_in_position_out.png')} />
                    <Text style={[{ fontSize: 11, color: '#666666' }]}>{'超出签到范围'}</Text>
                </View>
            );
        }
    };

    getManualRefreshView = () => {
        const ProjectName = SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty');
        if (ProjectName == 'emptyProjectOrProperty'
            || this.props.orientationStatus == 'in'
        ) {
            return null;
        } else {
            return (<View style={[{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10,
            }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(
                            createAction('taskModel/updateState')({
                                currnetTimeCardEnterprise: {
                                    Latitude: SentencedToEmpty(this.props, ['selectedProject', 'Latitude'], ''),
                                    Longitude: SentencedToEmpty(this.props, ['selectedProject', 'Longitude'], ''),
                                    Radius: SentencedToEmpty(this.props, ['selectedProject', 'Range'], 3000),
                                    PointName: SentencedToEmpty(this.props, ['selectedProject', 'ProjectName'], 'ProjectName')
                                }
                            })
                        );
                        this.props.dispatch(
                            createAction('taskDetailModel/updateState')({
                                clockInLongitude: this.state.lastLongitude,
                                clockInLatitude: this.state.lastLatitude,
                                clockInStatus: 3 //1 正常，2 异常
                            })
                        );
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap', params: { from: 'ChengTaoSignIn' } }));
                    }}
                >
                    <View style={[{
                        height: 48, paddingHorizontal: 10,
                    }]}>
                        <Text>{'查看打卡范围'}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity></TouchableOpacity> */}
            </View>);
        }
    }

    render() {
        const dataList = SentencedToEmpty(this.props, ['ctSignInProject', 'data', 'Datas'], []);
        return (
            <View
                style={[
                    {
                        width: SCREEN_WIDTH,
                        flex: 1
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={() => {
                        // CTProjectInfoList
                        this.props.dispatch(
                            createAction('CTModel/updateState')({
                                projectInfoListSearchStr: ''
                            })
                        );
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'CTProjectInfoList',
                                params: {}
                            })
                        );
                    }}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                height: 44,
                                flexDirection: 'row',
                                backgroundColor: '#ffffff',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20
                            }
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: 15,
                                    color: '#333333'
                                }
                            ]}
                        >
                            {'企业名称'}
                        </Text>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            {/* <Text>{`${SentencedToEmpty(this.props, ['selectedProject', 'ProjectName'], '请选择项目')}`}</Text> */}
                            <Text>{`${this.getProjectName()}`}</Text>
                            <Image style={[{ width: 15, height: 15, marginLeft: 8 }]} source={require('../../../images/calendarRight.png')} />
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={[{ width: SCREEN_WIDTH, flex: 1, marginTop: 5, backgroundColor: '#ffffff' }]}>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: (SCREEN_WIDTH - 55) / 2,
                                    height: 56,
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }
                            ]}
                        >
                            {this.hasSignIn() ? (
                                <View
                                    style={[
                                        {
                                            width: 32,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Image style={[{ width: 15, height: 15, marginTop: 11 }]} source={require('../../../images/ic_ct_had_sign_in.png')} />
                                </View>
                            ) : (
                                <View style={[{ width: 10 }]} />
                            )}
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        marginTop: 7
                                    }
                                ]}
                            >
                                <Text style={[{ fontSize: 15, color: '#333333' }]}>{this.hasSignIn() ? '已签到' : '未签到'}</Text>
                                <Text style={[{ fontSize: 12, color: '#666666', marginTop: 4 }]}>{this.hasSignIn() ? moment(dataList[0].CheckInTime).format('HH:mm:ss') : ''}</Text>
                            </View>
                        </View>
                        <View
                            style={[
                                {
                                    width: (SCREEN_WIDTH - 55) / 2,
                                    height: 56,
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: 10,
                                    flexDirection: 'row'
                                }
                            ]}
                        >
                            {this.hasSignOut() ? (
                                <View
                                    style={[
                                        {
                                            width: 32,
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Image style={[{ width: 15, height: 15, marginTop: 11 }]} source={require('../../../images/ic_ct_had_sign_in.png')} />
                                </View>
                            ) : (
                                <View style={[{ width: 10 }]} />
                            )}
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        marginTop: 7
                                    }
                                ]}
                            >
                                <Text style={[{ fontSize: 15, color: '#333333' }]}>{this.hasSignOut() ? '已签退' : '未签退'}</Text>
                                <Text style={[{ fontSize: 12, color: '#666666', marginTop: 4 }]}>{this.hasSignOut() ? moment(dataList[dataList.length - 1].CheckInTime).format('HH:mm:ss') : null}</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                const ProjectId = SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty');
                                if (ProjectId != 'emptyProjectOrProperty') {
                                    this.setState({ orientationType: 'sighIn' });
                                    //签到CheckType=1 签退CheckType=2
                                    if (!this.state.clockingIn) {
                                        this.clockIn();
                                    }
                                } else {
                                    ShowToast('未选择企业');
                                }
                            }}
                        >
                            <ImageBackground
                                style={[
                                    {
                                        width: 160,
                                        height: 160,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                                source={require('../../../images/bg_ct_sign_in_button.png')}
                            >
                                <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                                <AutoTimerText textStyle={{ fontSize: 17, color: 'white' }} ref={ref => (this.autoTimerText = ref)} />
                            </ImageBackground>
                        </TouchableOpacity>
                        {this.getPromptMessageView()}
                        {this.getManualRefreshView()}
                    </View>
                </View>
                <IconDialog hasCloseButton={true} ref={ref => (this.iconDialog = ref)} icUri={require('../../../images/ic_dialog_check_in_error.png')}>
                    <View style={{ width: 270, height: 172, alignItems: 'center' }}>
                        <Text style={{ fontSize: 17, color: '#333333', marginVertical: 15 }}>{'异常提示'}</Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginBottom: 15, width: 237, marginLeft: 15, lineHeight: 19 }}>{'您的当前位置处于项目执行范围之外，无法签到或签退。'}</Text>
                        <View style={{ flexDirection: 'row', width: 270, justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                style={{}}
                                onPress={() => {
                                    this.iconDialog.hide();
                                    this.props.dispatch(
                                        createAction('taskModel/updateState')({
                                            currnetTimeCardEnterprise: {
                                                Latitude: SentencedToEmpty(this.props, ['selectedProject', 'Latitude'], ''),
                                                Longitude: SentencedToEmpty(this.props, ['selectedProject', 'Longitude'], ''),
                                                Radius: SentencedToEmpty(this.props, ['selectedProject', 'Range'], 3000),
                                                PointName: SentencedToEmpty(this.props, ['selectedProject', 'ProjectName'], 'ProjectName')
                                            }
                                        })
                                    );
                                    this.props.dispatch(
                                        createAction('taskDetailModel/updateState')({
                                            clockInLongitude: this.state.lastLongitude,
                                            clockInLatitude: this.state.lastLatitude,
                                            clockInStatus: 3 //1 正常，2 异常
                                        })
                                    );
                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap', params: { from: 'ChengTaoSignIn' } }));
                                }}
                            >
                                <View style={{ width: 224, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#F7F7F7' }}>
                                    <Text style={{ fontSize: 17, color: '#333333' }}>{'查看范围信息'}</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                            style={{}}
                            onPress={() => {
                                this.iconDialog.hide();
                                ShowLoadingToast('打卡信息上传中');
                                this.props.dispatch(
                                    createAction('taskDetailModel/taskSignIn')({
                                        params: {
                                            taskID: this.props.taskDetail.ID,
                                            longitude: this.state.lastLongitude,
                                            latitude: this.state.lastLatitude
                                        },
                                        callback: () => {
                                            CloseToast('打卡结束');
                                        }
                                    })
                                );
                            }}
                        >
                            <View style={{ width: 112, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#4DA9FF' }}>
                                <Text style={{ fontSize: 17, color: 'white' }}>{'继续打卡'}</Text>
                            </View>
                        </TouchableOpacity> */}
                        </View>
                    </View>
                </IconDialog>
            </View>
        );
    }
}

@connect(({ CTModel }) => ({
    calenderData: CTModel.calenderData,
    ctSignInHistoryListResult: CTModel.ctSignInHistoryListResult,
    calenderCurrentMonth: CTModel.calenderCurrentMonth,
    calenderSelectedDate: CTModel.calenderSelectedDate,
    calenderDataObject: CTModel.calenderDataObject
}))
class ChengTaoSigninStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarHeight: new Animated.Value(calenderComponentHeight), // 0-300 calenderComponentHeight
            panResponder: {},
            hideCalendar: false,
            calenderOpacity: 1,
            startPosition: 0,
            selectedDate: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('CTModel/updateState')({
                calenderSelectedDate: moment().format('YYYY-MM-DD'),
                calenderCurrentMonth: moment().format('YYYY-MM-DD')
            })
        );
        this.props.dispatch(
            createAction('CTModel/getCTSignInHistoryList')({
                params: {
                    recordDate: moment().format('YYYY-MM-DD')
                },
                callback: result => { }
            })
        );

        let panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //是否成为响应者
                return true;
            },
            onPanResponderGrant: () => {
                //开始手势操作
                // console.log('this.state.calendarHeight._value = ', this.state.calendarHeight._value);
                // console.log('this.state.calendarHeight._offset = ', this.state.calendarHeight._offset);
                //是Animated的方法
                this.setState({ startPosition: this.state.calendarHeight._offset });
                this.state.calendarHeight.setOffset(this.state.calendarHeight._offset);
            },
            onPanResponderMove: (e, gestureState) => {
                let newData = this.state.calendarHeight;
                let abc = -(gestureState.y0 - gestureState.moveY);
                let realValue = 0;
                if (abc > 0) {
                    realValue = -calenderComponentHeight + abc;
                } else {
                    if (this.state.startPosition >= 0) {
                        realValue = abc;
                    } else {
                        realValue = newData._offset + abc;
                        if (realValue > -calenderComponentHeight) {
                            realValue = calenderComponentHeight;
                        } else {
                            realValue = newData._offset + abc;
                        }
                    }
                }
                newData.setOffset(realValue);
                if (newData._offset == -calenderComponentHeight && abc < 0) {
                } else if (realValue <= 0) {
                    this.setState({
                        calendarHeight: newData
                    });
                }
            },
            onPanResponderRelease: () => {
                let newData = this.state.calendarHeight;
                if (this.state.calendarHeight._offset < -200) {
                    newData.setOffset(-newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: true
                    });
                } else {
                    newData.setOffset(calenderComponentHeight - newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: false
                    });
                }
            }
        });
        this.setState({ panResponder: panResponder });
    }

    renderLineItem = (item, index, length = 0) => {
        return (
            <View
                style={[
                    {
                        width: SCREEN_WIDTH - 40,
                        height: 60,
                        flexDirection: 'row'
                    }
                ]}
            >
                <View
                    style={[
                        {
                            width: 26,
                            height: 60,
                            alignItems: 'center'
                        }
                    ]}
                >
                    {index != 0 ? (
                        <View
                            style
                            style={[
                                {
                                    width: 1,
                                    height: 10,
                                    marginBottom: 6,
                                    backgroundColor: '#EAEAEA'
                                }
                            ]}
                        />
                    ) : (
                        <View
                            style
                            style={[
                                {
                                    width: 1,
                                    height: 10,
                                    marginBottom: 6
                                }
                            ]}
                        />
                    )}
                    <View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#999999' }]} />
                    {index != length - 1 ? (
                        <View
                            style
                            style={[
                                {
                                    width: 1,
                                    height: 32,
                                    marginTop: 6,
                                    backgroundColor: '#EAEAEA'
                                }
                            ]}
                        />
                    ) : null}
                </View>

                <View style={[{
                    width: SCREEN_WIDTH - 66, height: 60
                }]}>
                    <Text numberOfLines={1} style={[{ marginTop: 10, fontSize: 14, color: '#000028' }]}>{`${item.CheckType == 1 ? '签到' : '签退'}：${moment(item.CheckInTime).format('HH:mm')}`}</Text>
                    <View style={[{
                        flexDirection: 'row', width: SCREEN_WIDTH - 66
                        , height: 28, marginTop: 4
                    }]}>
                        <Image
                            style={[{ width: 10, height: 10, marginTop: 4 }]}
                            source={require('../../../images/icon_location.png')} />
                        <Text
                            numberOfLines={2}
                            style={[{ fontSize: 11, color: '#666666', lineHeight: 15 }]}
                        >
                            {`${SentencedToEmpty(item, ['ProjectName'], '')}`}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    /** 
    <View
                    style={[
                        {
                            width: SCREEN_WIDTH - 66,
                            height: 60
                        }
                    ]}
                >
                    <Text numberOfLines={1} style={[{ marginTop: 10, fontSize: 14, color: '#000028' }]}>
                        {'签到：08:02'}
                {index!=0?<View style 
                    style={[{
                        width:1, height:10, marginBottom:6
                        , backgroundColor:'#EAEAEA'
                    }]}
                />:<View style 
                    style={[{
                        width:1, height:10, marginBottom:6
                    }]}
                />}
                <View 
                    style={[{width:6,height:6
                        ,borderRadius:3,backgroundColor:'#999999'}]}
                />
                {index!=length-1?<View style 
                    style={[{
                        width:1, height:32, marginTop:6
                        , backgroundColor:'#EAEAEA'
                    }]}
                />:null}
            </View>
    */

    showCalenderFun = (nextFun = () => { }) => {
        if (this.state.calendarHeight._value == calenderComponentHeight) {
            this.setState({ hideCalendar: true, calenderOpacity: 0 }, () => {
                nextFun();
            });
        } else if (this.state.calendarHeight._value == 0) {
            this.setState({ hideCalendar: false }, () => {
                nextFun();
            });
        }
    };

    onDateChange = (date) => {
        this.props.dispatch(createAction('CTModel/updateState')({
            calenderSelectedDate: date.format('YYYY-MM-DD')
        }));
    }
    onSwipe = (gestureName, gestureState) => {
        switch (gestureName) {
            case SWIPE_LEFT:
                this.nextDateFun();
                break;
            case SWIPE_RIGHT:
                this.previousDateFun();
                break;
        }
    };

    nextDateFun = () => {
        let nextDate = moment(this.props.calenderCurrentMonth).add(1, 'months');
        let selectedDate = nextDate.format("YYYY-MM-01");
        if (nextDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = nextDate.format(formatStr);
        let newCalendarDate = nextDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressNext();
        this.props.dispatch(
            createAction('CTModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: nextDate,
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('CTModel/getCTSignInHistoryList')({
            params: {
                'recordDate': nextDate.format('YYYY-MM-DD')
            }
            , callback: (result) => {

            }
        }));
    }

    previousDateFun = () => {
        let previousDate = moment(this.props.calenderCurrentMonth).subtract(1, 'months');
        let selectedDate = previousDate.format("YYYY-MM-01");
        if (previousDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = previousDate.format(formatStr);
        let newCalendarDate = previousDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressPrevious();
        this.props.dispatch(
            createAction('CTModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: previousDate
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('CTModel/getCTSignInHistoryList')({
            params: {
                'recordDate': previousDate.format('YYYY-MM-DD')
            }
            , callback: (result) => {

            }
        }));
    }

    getMonthAndDate = () => {
        if (this.props.calenderSelectedDate == '') {
            return moment(this.props.calenderCurrentMonth).format('MM')
        } else {
            return moment(this.props.calenderSelectedDate).format('MM.DD')
        }
    }

    getText = () => {
        if (this.props.calenderSelectedDate == '') {
            return '';
        } else {
            return SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.calenderSelectedDate, 'StatisticMsg'], '')
        }
    }

    getList = () => {
        if (this.props.calenderSelectedDate == '') {
            return [];
        } else {
            return SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.calenderSelectedDate, 'DataList'], [])
        }
    }

    render() {
        return (<View style={[{
            width: SCREEN_WIDTH, flex: 1
        }]}>
            <View style={[{
                width: SCREEN_WIDTH - 20, marginTop: 10
                , marginLeft: 10, backgroundColor: '#ffffff'
                , borderRadius: 5, flex: 1
                , alignItems: 'center'
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH - 40, height: 40
                    , flexDirection: 'row', alignItems: 'flex-end'
                    , paddingBottom: 6
                }]}>
                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`${`${moment(this.props.calenderCurrentMonth).format("YYYY")}年`}`}</Text>
                    <Text style={[{ fontSize: 14, color: '#333333', marginLeft: 16 }]}>{`${this.getMonthAndDate()}`}</Text>
                    <View style={[{ flex: 1 }]} />
                    {!this.state.hideCalendar ? <TouchableOpacity
                        onPress={() => {
                            this.previousDateFun();
                        }}
                    >
                        <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                            <Image style={[{ width: 28, height: 28 }]} source={require('../../../images/calenderLeft.png')} />
                        </View>
                    </TouchableOpacity> : null}
                    {!this.state.hideCalendar ? <TouchableOpacity
                        onPress={() => {
                            this.nextDateFun();
                        }}
                    >
                        <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'center' }]}>
                            <Image style={[{ width: 28, height: 28 }]} source={require('../../../images/calendarRight.png')} />
                        </View>
                    </TouchableOpacity> : null}
                </View>

                {this.state.hideCalendar ? null : <View style={[{ opacity: this.state.calenderOpacity, width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#EAEAEA' }]}></View>}
                <Animated.View style={[{ height: this.state.calendarHeight, width: SCREEN_WIDTH - 40, }]}>
                    {this.state.hideCalendar ? null : <CalendarPicker
                        ref={ref => (this.CalendarPicker = ref)}
                        showHeader={false}
                        startFromMonday={true}
                        selectedStartDate={this.props.calenderSelectedDate}
                        // selectedEndDate={this.state.selectedEndDate}
                        initialDate={this.props.calenderSelectedDate}
                        weekdays={['一', '二', '三', '四', '五', '六', '日']}
                        months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                        previousTitle={require('../../../images/calenderLeft.png')}
                        nextTitle={require('../../../images/calendarRight.png')}
                        // minDate={minDate}
                        // maxDate={maxDate}
                        todayBackgroundColor="#EEE685"
                        selectedDayColor="#dff0ff"
                        selectedDayTextColor="#333333"
                        onDateChange={this.onDateChange}
                        onSwipe={this.onSwipe}
                        customDotDatesStyles={this.props.calenderData}
                    />}
                </Animated.View>
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.calendarHeight._value == 0) {
                            this.showCalenderFun(() => {
                                Animated.spring(
                                    this.state.calendarHeight, // Auto-multiplexed
                                    { toValue: calenderComponentHeight } // Back to zero
                                ).start(() => {
                                    this.setState({ calenderOpacity: 1 });
                                });
                            });
                        } else if (this.state.calendarHeight._value == calenderComponentHeight) {
                            this.showCalenderFun(() => {
                                Animated.spring(
                                    this.state.calendarHeight, // Auto-multiplexed
                                    { toValue: 0 } // Back to zero
                                ).start(() => {
                                    // this.setState({hideCalendar:true});
                                });
                            });
                        }
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center' }]}>
                        <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                        {/* <View style={[{width:20,height:8,backgroundColor:'#EAEAEA'}]}></View> */}
                        <Image
                            style={[{ width: 20, height: 8 }]}
                            source={this.state.hideCalendar
                                ? require('../../../images/ic_ct_calendar_down.png')
                                : require('../../../images/ic_ct_calendar_up.png')
                            }
                        />
                        <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                    </View>
                </TouchableOpacity>
                <Animated.View
                    style={[{ width: SCREEN_WIDTH - 40, flex: 1, marginBottom: 10 }]}
                // {...this.state.panResponder.panHandlers }
                >
                    <View style={[{
                        width: SCREEN_WIDTH - 40, flex: 1
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.calendarHeight._value == 0) {
                                    this.showCalenderFun(() => {
                                        Animated.spring(
                                            this.state.calendarHeight, // Auto-multiplexed
                                            { toValue: calenderComponentHeight } // Back to zero
                                        ).start(() => {
                                            this.setState({ calenderOpacity: 1 });
                                        });
                                    });
                                } else if (this.state.calendarHeight._value == calenderComponentHeight) {
                                    this.showCalenderFun(() => {
                                        Animated.spring(
                                            this.state.calendarHeight, // Auto-multiplexed
                                            { toValue: 0 } // Back to zero
                                        ).start(() => {
                                            // this.setState({hideCalendar:true});
                                        });
                                    });
                                }
                            }}
                        >
                            <View style={[{
                                width: SCREEN_WIDTH - 40, height: 38
                            }]}>

                                {/* <Text style={[{
                                    fontSize:11,color:'#666666'
                                    , marginTop:17
                                }]}>{
                                    `${'统计：签到4次，签退4次，总工时5.2小时'}`
                                }</Text> */}
                                <Text style={[{
                                    fontSize: 11, color: '#666666'
                                    , marginTop: 17
                                }]}>{
                                        `${this.getText()}`
                                    }</Text>
                            </View>
                        </TouchableOpacity>
                        <ScrollView style={[{
                            width: SCREEN_WIDTH - 40, flex: 1
                        }]}>
                            {
                                this.getList().map((item, index) => {
                                    return this.renderLineItem(item, index, this.getList().length);
                                })
                            }
                        </ScrollView>
                    </View>
                </Animated.View>
            </View>
        </View>
        );
    }
}
