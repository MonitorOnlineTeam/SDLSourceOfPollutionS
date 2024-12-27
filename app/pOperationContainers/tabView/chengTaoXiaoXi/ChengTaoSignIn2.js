/*
 * @Description:对成套打卡功能进行升级
 * @LastEditors: hxf
 * @Date: 2023-09-06 14:20:53
 * @LastEditTime: 2024-12-09 11:35:41
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoSignIn2.js
 */
import moment from 'moment';
import React, { Component, PureComponent } from 'react';
import { DeviceEventEmitter, Alert, NativeModules, Platform, Text, TouchableOpacity, View, Image, ScrollView, Animated, PanResponder, ImageBackground, Modal } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { connect } from 'react-redux';
import { Geolocation, stop } from 'react-native-amap-geolocation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { CloseToast, createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../utils';
import IconDialog from '../../../operationContainers/taskViews/taskExecution/components/IconDialog';
import ChengTaoOffSideSignIn from './ChengTaoOffSideSignIn';
import ImageUploadTouchNetCore from '../../../components/form/images/ImageUploadTouchNetCore';
import { IMAGE_DEBUG, ImageUrlPrefix } from '../../../config';
import { getEncryptData } from '../../../dvapack/storage';
import ImageUploadTouch from '../../../components/form/images/ImageUploadTouch';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageDeleteTouch from '../../../components/form/images/ImageDeleteTouch';
import AutoTimerText from '../../components/AutoTimerText';
import { StatusPage } from '../../../components';
const AMapGeolocation = NativeModules.AMapGeolocation;
// const calenderComponentHeight = 300;
let calenderComponentHeight = 260;
// 240 在部分手机上显示过窄
const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY-MM-DD';

@connect(({ CTModel }) => ({
    selectedProject: CTModel.selectedProject
}))
export default class ChengTaoSignIn extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '签到'),
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

                <View style={[{ width: SCREEN_WIDTH, height: Platform.OS === 'ios' ? 84 : 50, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, marginTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 34 : 0 // Add bottom margin for iOS safe area
                 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                showView: 'sign'
                            });
                            this.props.navigation.setParams({
                                title: '签到'
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
                            this.props.navigation.setParams({
                                title: '统计'
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

@connect(({ CTModel, signInModel }) => ({
    topLevelTypeList: signInModel.topLevelTypeList, // 第一大类数据
    workTypeList: signInModel.workTypeList, // 工作类型数据

    selectedProject: CTModel.selectedProject,
    ctSignInProject: CTModel.ctSignInProject,
    orientationStatus: CTModel.orientationStatus,
    orientationFailureTimes: CTModel.orientationFailureTimes, // 最近定位错误的次数
    currentOrientationInfo: CTModel.currentOrientationInfo, // 定位信息
    fileUUID: CTModel.fileUUID,
}))
class SignInComponent extends Component {
    constructor(props) {
        super(props);
        _me = this;
        this.state = {
            lastLatitude: 0,
            lastLongitude: 0,
            signInType: 0,
            imageList: [],
            Imgs: [],
            largImage: [],
            modalVisible: false,
        };
        console.log('SignInComponent constructor');
        this.lastSignInTime = new Date().getTime();
    }

    componentDidMount() {
        // 非现场顶级类型获取
        this.props.dispatch(createAction('signInModel/getSignInType')({
            params: {}
        }));
        this.props.dispatch(
            createAction('CTModel/updateState')({
                ctSignInProject: { status: -1 },
                orientationStatus: 'unlocated',
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

        // 开启持续定位
        if (Platform.OS == 'ios') {
            AMapGeolocation.RNTransferIOSWithCallBack(data => {
                if (data == 'false') {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                } else {
                    let watchId = this.startLocation();
                    this.setState({ watchId });
                }
            });
        } else {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                if (isLocationEnabled) {
                    let watchId = _me.startLocation();
                    _me.setState({ watchId });
                } else {
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
        }
        stop();
    }

    // 签到
    clockIn = () => {
        let currentSignInTime = new Date().getTime();
        let sub = currentSignInTime - this.lastSignInTime;
        this.lastSignInTime = currentSignInTime;
        if (sub < 2000) {
            // 避免频繁点击
            ShowToast('请勿频繁点击');
            return;
        }
        if (this.props.orientationStatus == 'in') {
            ShowLoadingToast('签到信息上传中');
            //签到CheckType=1 签退CheckType=2
            /**
             * currentOrientationInfo
             * let resultInfo = {
                    longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                    , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                }
             * 
             */
            // if (SentencedToEmpty(this.state, ['Imgs'], []).length == 0) {
            //     ShowToast('签到照片不能为空');
            //     return;
            // }
            this.props.dispatch(
                createAction('CTModel/doCTSignIn')({
                    params: {
                        Files: this.props.fileUUID + '',
                        checkType: this.getSignInStatus() ? 2 : 1,
                        latitude: SentencedToEmpty(this.props, ['currentOrientationInfo', 'latitude'], ''),
                        longitude: SentencedToEmpty(this.props, ['currentOrientationInfo', 'longitude'], '')
                    },
                    successCallback: () => {
                        /**
                         * 清空图片，设置新的uuid
                         */
                        this.setState({
                            Imgs: []
                            , largImage: []
                        });
                        this.props.dispatch(createAction('CTModel/updateState')({
                            fileUUID: `ct_sign_in_${new Date().getTime()}`
                        }))
                        this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
                        CloseToast('签到结束');
                        ShowToast(`${this.getSignInStatus() ? '签退' : '签到'}成功`);
                        return true;
                    }
                })
            );
        } else {
            this.iconDialog.showModal();
        }
    };

    startLocation = () => {
        let watchId = '';
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            this.setState({ errorNum: 0, watchId: '' });
        }
        console.log('开始定位');
        watchId = Geolocation.watchPosition(
            success => {
                console.log(`定位一次${moment().format("HH:mm:ss")}`);
                console.log('location = ', success);
                if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0 || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        // lastOrientationInfo: null,
                        currentOrientationInfo: null,
                        orientationFailureTimes: this.props.orientationFailureTimes + 1,
                    }));
                    // this.props.dispatch(
                    //         createAction('app/addClockInLog')({
                    //             //提交异常日志
                    //             msg: `${JSON.stringify(success)}`
                    //         })
                    //     );
                } else {
                    if (this && typeof this != 'undefined' && this.updateLocationState && typeof this.updateLocationState == 'function') {
                        let resultInfo = {
                            longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                            , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                        }
                        this.props.dispatch(createAction('CTModel/updateState')({
                            lastOrientationInfo: resultInfo,
                            currentOrientationInfo: resultInfo,
                            orientationFailureTimes: 0,
                        }));
                        this.updateLocationState(success);
                    }
                }
            },
            error => {
                this.props.dispatch(createAction('CTModel/updateState')({
                    // lastOrientationInfo: null,
                    currentOrientationInfo: null,
                    orientationFailureTimes: this.props.orientationFailureTimes + 1,
                }));
                this.props.dispatch(
                    createAction('app/addClockInLog')({
                        //提交异常日志
                        msg: `${JSON.stringify(error)}`
                    })
                );
            }
        );
        return watchId;
    };

    updateLocationState = location => {
        this.setState({
            lastLatitude: location.coords.latitude,
            lastLongitude: location.coords.longitude
        });
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
                    this.props.dispatch(createAction('CTModel/updateState')({
                        orientationStatus: 'in'
                    }));
                } else {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        orientationStatus: 'out'
                    }));
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
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'CTSignInMap', params: { from: 'ChengTaoSignIn' } }));
                    }}
                >
                    <View style={[{
                        height: 48, paddingHorizontal: 10,
                    }]}>
                        <Text style={[{ color: '#333333' }]}>{'查看打卡范围'}</Text>
                    </View>
                </TouchableOpacity>
            </View>);
        }
    }

    renderSignInButton = () => {
        const ProjectId = SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty');
        if (ProjectId == 'emptyProjectOrProperty'
            || this.props.orientationStatus != 'in'
        ) {
            return (
                <ImageBackground
                    style={[
                        {
                            width: 160,
                            height: 160,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    ]}
                    source={require('../../../images/bg_ct_sign_in_inactive_button.png')}
                >
                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                    <AutoTimerText textStyle={{ fontSize: 17, color: 'white' }} ref={ref => (this.autoTimerText = ref)} />
                </ImageBackground>);
        } else {
            return (<TouchableOpacity
                onPress={() => {
                    this.clockIn();
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
            </TouchableOpacity>);
        }
    }

    getSignInType = (typeIndex) => {
        const topLevelTypeList = SentencedToEmpty(this.props, ['topLevelTypeList'], []);

        if (topLevelTypeList.length >= 2) {
            this.props.dispatch(createAction('signInModel/getSignInType')({
                params: {
                    ID: SentencedToEmpty(topLevelTypeList, [typeIndex, 'ID'], ''),
                    WorkType: 1, // 成套  运维不用传这个参数,成套非现场才会传这个参数

                }
            }));
        } else {
            this.setState({ signInType: 0 }
                , () => {
                    this.props.dispatch(createAction('signInModel/getSignInType')({
                        params: {}
                    }));
                });
        }
    }

    getextraInfo = () => {
        return ({
            EnterpriseName: SentencedToEmpty(this.props, ['selectedProject', 'EntName'], '企业名称为空'),
            PointName: '',
        })
    }

    render() {
        // console.log('largImage = ', this.state.largImage);
        // console.log('largImage = ', this.state.largImage);
        const topButtonWidth = SCREEN_WIDTH / 2;
        const dataList = SentencedToEmpty(this.props, ['ctSignInProject', 'data', 'Datas'], []);
        const ProxyCode = getEncryptData();
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    flexDirection: 'row', height: 44
                    , width: SCREEN_WIDTH, alignItems: 'center'
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white', marginBottom: 5
                }]}>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.setState({ signInType: 0 }
                                    , () => {
                                        // this.props.dispatch(createAction('signInModel/updateState')({
                                        //     workTypeSelectedItem: null,
                                        //     signInEntItem: null
                                        // }));
                                        // this.getSignInType(0);
                                    });
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 15
                                        , color: this.state.signInType == 0 ? '#4AA0FF' : '#666666'
                                    }]}>{'成套现场'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.state.signInType == 0 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.setState({
                                    signInType: 1,
                                    imageList: [],
                                    Imgs: [],
                                    largImage: [],
                                    modalVisible: false,
                                }
                                    , () => {
                                        this.props.dispatch(createAction('signInModel/updateState')({
                                            workTypeSelectedItem: null,
                                            signInEntItem: null,
                                            remark: '',
                                        }));
                                        this.props.dispatch(createAction('CTModel/updateState')({
                                            fileUUID: `ct_sign_in_${new Date().getTime()}`,
                                        }));
                                        this.getSignInType(1);
                                    });
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 15
                                        , color: this.state.signInType == 1 ? '#4AA0FF' : '#666666'
                                    }]}>{'非现场'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.state.signInType == 1 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.state.signInType == 0
                        ? <View
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
                                        <Text numberOfLines={1} style={[{ color: '#333333', width: SCREEN_WIDTH - 160 }]}>{`${this.getProjectName()}`}</Text>
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

                                {/* 图片控件 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 50,
                                        marginLeft: 25,
                                    }]}>
                                    <View
                                        style={[{
                                            height: 48, width: SCREEN_WIDTH - 50,
                                            justifyContent: 'center',
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                fontSize: 15,
                                                color: '#333333'
                                            }]}
                                        >{'签到照片'}</Text>
                                    </View>
                                    <View style={[{
                                        width: SCREEN_WIDTH - 50,
                                        height: 80,
                                        flexDirection: 'row',
                                    }]}>
                                        {SentencedToEmpty(this.props, ['selectedProject', 'ProjectId'], 'emptyProjectOrProperty') != 'emptyProjectOrProperty'
                                            ? <ImageUploadTouch
                                                hasOffline={false}
                                                style={{ width: 80, height: 80, marginBottom: 5 }}
                                                // componentType={'normal'}
                                                componentType={'signIn'}
                                                // extraInfo={{
                                                //     EnterpriseName: SentencedToEmpty(this.props, ['selectedProject', 'EntName'], '企业名称为空'),
                                                //     PointName: '',
                                                // }}
                                                extraInfo={this.getextraInfo()}
                                                uuid={this.props.fileUUID}
                                                callback={(images, callbackType = 'online') => {
                                                    const ProxyCode = getEncryptData();
                                                    let Imgs = [...this.state.Imgs];
                                                    let largImage = [].concat(this.state.largImage);
                                                    let newItem = [];
                                                    let tempObject;
                                                    if (callbackType == 'offline') {
                                                        images.map((item, key) => {
                                                            newItem.push({ AttachID: item.attachID });
                                                            Imgs.push({ uri: item.uri, type: callbackType });
                                                            tempObject = {
                                                                url: item.uri,
                                                                uri: item.uri,
                                                                AttachID: item.fileName
                                                            }
                                                            largImage.push(tempObject);
                                                        });
                                                    } else {
                                                        images.map((item, key) => {
                                                            newItem.push({ AttachID: item.attachID });
                                                            Imgs.push({ AttachID: item.attachID });
                                                            tempObject = {
                                                                url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.attachID}`
                                                                    : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`,
                                                                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.attachID}`
                                                                    : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`,
                                                                AttachID: item.attachID
                                                            }
                                                            largImage.push(tempObject);
                                                        });
                                                    }
                                                    this.setState({ Imgs: Imgs, largImage });
                                                    // uploadCallback(newItem);
                                                }}
                                            >
                                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 72, height: 72, marginTop: 8 }} />
                                            </ImageUploadTouch>
                                            : <TouchableOpacity
                                                onPress={() => {
                                                    ShowToast('请先选择运维企业再上传照片');
                                                }}
                                                style={{ width: 80, height: 80, marginBottom: 5 }}
                                            >
                                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 72, height: 72, marginTop: 8 }} />
                                            </TouchableOpacity>}
                                        <ScrollView
                                            ref={(scrollView) => { this.scrollView = scrollView; }}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                        >
                                            {
                                                this.state.Imgs.map((item, key) => {
                                                    const { type = 'online' } = item;
                                                    let source;
                                                    if (type == 'offline') {
                                                        source = {
                                                            uri: item.uri
                                                        }
                                                    } else {
                                                        source = {
                                                            uri: `${ImageUrlPrefix}${ProxyCode}/thumb_${item.AttachID}`,
                                                        };
                                                    }
                                                    console.log('source = ', source);
                                                    return (
                                                        <View
                                                            style={[{
                                                                marginLeft: 8
                                                                , width: 80, height: 80
                                                            }]}
                                                        >
                                                            <TouchableOpacity

                                                                onPress={() => {
                                                                    this.setState({
                                                                        modalVisible: true,
                                                                        index: key,
                                                                        showUrls: [
                                                                            {
                                                                                url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                                                                                    : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                                                                                AttachID: item.AttachID
                                                                                // You can pass props to <Image />.
                                                                                // props: {
                                                                                //     headers: { ProxyCode: encryData}
                                                                                // }
                                                                            }
                                                                        ]
                                                                    });
                                                                }}
                                                            >
                                                                <View
                                                                    style={[{
                                                                        height: 72, width: 72
                                                                        , justifyContent: 'center'
                                                                        , alignItems: 'center'
                                                                        , marginTop: 8
                                                                    }]}
                                                                >
                                                                    <Image
                                                                        resizeMethod={'resize'}
                                                                        style={[{ width: 72, height: 72 }]}
                                                                        source={source} />
                                                                </View>
                                                            </TouchableOpacity>
                                                            <View
                                                                style={[{
                                                                    position: 'absolute',
                                                                    right: 0,
                                                                    top: 0,
                                                                }]}
                                                            >
                                                                <ImageDeleteTouch
                                                                    AttachID={item.AttachID}
                                                                    callback={() => {
                                                                        let Imgs = [...this.state.Imgs];
                                                                        let largImage = [...this.state.largImage];
                                                                        Imgs.splice(key, 1);
                                                                        largImage.splice(key, 1);
                                                                        this.setState({ Imgs: Imgs, largImage });
                                                                    }}
                                                                >
                                                                    <Image source={require('../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                                                                </ImageDeleteTouch>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                        <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                                            <ImageViewer
                                                saveToLocalByLongPress={false}
                                                menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                                                onClick={() => {
                                                    {
                                                        this.setState({
                                                            modalVisible: false
                                                        });
                                                    }
                                                }}
                                                onSave={url => {
                                                    this.savePhoto(this.state.showUrls[0].url);
                                                }}
                                                imageUrls={this.state.largImage}
                                                // index={0}
                                                index={this.state.index}
                                                onChange={index => {
                                                    this.setState({ index });
                                                }}
                                            />
                                        </Modal>
                                    </View>
                                </View>
                                {/* 图片控件 */}

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
                                    {this.renderSignInButton()}
                                    {/* {this.getPromptMessageView()} */}
                                    <PromptMessageView />
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
                        : <ChengTaoOffSideSignIn />
                }

            </View>);
    }
}

@connect(({ CTModel }) => ({
    selectedProject: CTModel.selectedProject,
    orientationStatus: CTModel.orientationStatus,
}))
class PromptMessageView extends PureComponent {
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
        } else if (this.props.orientationFailureTimes > 0) {
            // 定位失败
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
                    <Text style={[{ fontSize: 11, color: '#666666' }]}>{`${this.props.orientationFailureTimes > 1 ? '定位失败' + this.props.orientationFailureTimes + '次,请移动到开阔地带' : '定位失败，请移动到开阔地带'
                        }`}</Text>
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
    render() {
        return this.getPromptMessageView();
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
            selectedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            listType: 0,
            largImage: [],
            index: 0,
            modalVisible: false,
            loadingStatus: -1,
        };
    }

    getCalenderRows = (currentMonth) => {
        console.log('calenderCurrentMonth = ', currentMonth);
        let oDateMoment = moment(currentMonth).date(1);
        console.log('oDateMoment = ', oDateMoment);
        console.log('oDateMoment = ', oDateMoment.format('YYYY-MM-DD'));
        console.log('day = ', oDateMoment.day());
        let weekDay = oDateMoment.day();
        let dateMoment4 = moment(currentMonth).date(4);
        let dateMoment3 = moment(currentMonth).date(3);
        console.log('dateMoment4 = ', dateMoment4.day());
        console.log('dateMoment3 = ', dateMoment3.day());
        let dateMoment10 = moment(currentMonth).date(10);
        console.log('dateMoment10 = ', dateMoment10.day());
        let firstRowLength = 1;
        if (weekDay == 0) {
            firstRowLength = 1;
        } else {
            firstRowLength = 8 - weekDay;
        }
        let dateLength = moment(currentMonth).add('months', 1).date(0).date();
        console.log('dateLength = ', dateLength);
        let a = moment().month(2).date(0).date();
        console.log('a = ', a);

        let remainder = (dateLength - firstRowLength) % 7;
        let rowsNumber = 1 + Math.floor((dateLength - firstRowLength) / 7);
        if (remainder > 0) {
            rowsNumber = rowsNumber + 1;
        }
        console.log('rowsNumber = ', rowsNumber);
        return rowsNumber;
    }

    componentDidMount() {

        this.props.dispatch(
            createAction('CTModel/getSignHistoryList')({
                params: {
                    recordDate: moment().format('YYYY-MM-DD')
                },
                callback: result => { }
            })
        );
        let currentMonth = moment().format('YYYY-MM-DD');
        this.props.dispatch(
            createAction('CTModel/updateState')({
                calenderSelectedDate: currentMonth,
                calenderCurrentMonth: currentMonth
            })
        );
        // 动态高度 start
        const rowLength = this.getCalenderRows(currentMonth);
        if (rowLength > 5) {
            let otherHeight = (rowLength - 5) * 40;
            calenderComponentHeight = 260 + otherHeight;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        } else {
            calenderComponentHeight = 260;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        }
        // 动态高度 end

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

    getTag = (tagType) => {
        // #FFA415
        let _color = '#FFA415';
        if (tagType == '非现场') {
            _color = '#FFA415';
        } else {
            _color = '#4F6BF8';
        }
        return (<View style={{ flexDirection: 'row', width: 44, height: 16 }}>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: 'transparent', borderRightColor: _color
                    , borderTopColor: 'transparent', borderBottomColor: _color
                }]}
            ></View>
            <View
                style={[{
                    height: 16, flex: 1
                    , backgroundColor: _color
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >

                <Text
                    style={[{
                        color: 'white', fontSize: 8
                        , padding: 0, lineHeight: 10
                    }]}
                >{`${tagType}`}</Text>
            </View>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: _color, borderRightColor: 'transparent'
                    , borderTopColor: _color, borderBottomColor: 'transparent'
                }]}
            ></View>
        </View>);
    }

    getSignInTypeStr = (signInType) => {
        // 签到CheckType=1 签退CheckType=2  
        if (signInType == 1) {
            return '签到';
        } else if (signInType == 2) {
            return '签退'
        } else {
            return '未知'
        }
    }

    renderLineItem = (item, index, length = 0) => {
        if (item.SignType == '非现场') {
            return (<View
                style={[{
                    width: SCREEN_WIDTH - 20, height: 142
                    , paddingVertical: 15, paddingHorizontal: 15
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white'
                    , marginBottom: 5, borderRadius: 5
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 50, flexDirection: 'row'
                        , alignItems: 'center'
                    }]}
                >
                    {
                        this.getTag(item.SignType)
                    }
                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{SentencedToEmpty(item, ['Time'], '--:--')}</Text>

                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.getSignInTypeStr(SentencedToEmpty(item, ['CheckType'], -1))}</Text>
                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 14, color: '#000028'
                            , marginLeft: 8, width: SCREEN_WIDTH - 192
                        }]}
                    >{SentencedToEmpty(item, ['Position'], '')}</Text>

                </View>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'地址'}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{SentencedToEmpty(item, ['Address'], '')}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'工作类型'}</Text>
                <Text
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{SentencedToEmpty(item, ['WorkTypeName'], '')}</Text>
            </View>);
        } else {
            return (<View
                style={[{
                    width: SCREEN_WIDTH - 20, height: 142
                    , paddingVertical: 15, paddingHorizontal: 15
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white'
                    , marginBottom: 5, borderRadius: 5
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 50, flexDirection: 'row'
                        , alignItems: 'center'
                    }]}
                >
                    {
                        this.getTag(item.SignType)
                    }
                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{SentencedToEmpty(item, ['Time'], '--:--')}</Text>

                    <Text
                        style={[{
                            fontSize: 14, color: '#000028'
                        }]}
                    >{this.getSignInTypeStr(SentencedToEmpty(item, ['CheckType'], -1))}</Text>
                    {/* <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 14, color: '#000028'
                            , marginLeft: 8
                        }]}
                    >{SentencedToEmpty(item, ['Position'], '')}</Text> */}

                </View>
                <Text
                    style={[{
                        fontSize: 13, color: '#666666'
                    }]}
                >{'企业'}</Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        fontSize: 13, color: '#333333'
                    }]}
                >{`${SentencedToEmpty(item, ['EntName'], '------')}`}</Text>
                <TouchableOpacity
                    onPress={() => {
                        let ImgNameList = SentencedToEmpty(item, ['Files', 'ImgNameList'], []);
                        if (ImgNameList.length == 0) {
                            ShowToast('未上传图片');
                        } else {
                            const ProxyCode = getEncryptData();
                            let largImage = [];
                            ImgNameList.map((item, key) => {
                                largImage.push({
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${item}`,
                                    AttachID: item
                                });
                            });
                            this.setState({
                                largImage
                            }, () => {
                                this.setState({
                                    modalVisible: true,
                                    index: 0
                                });
                            });
                        }
                    }}
                >
                    <Text
                        style={[{
                            fontSize: 13, color: '#666666'
                        }]}
                    >{'签到图片'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        let ImgNameList = SentencedToEmpty(item, ['Files', 'ImgNameList'], []);
                        if (ImgNameList.length == 0) {
                            ShowToast('未上传图片');
                        } else {
                            const ProxyCode = getEncryptData();
                            let largImage = [];
                            ImgNameList.map((item, key) => {
                                largImage.push({
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${item}`,
                                    AttachID: item
                                });
                            });
                            this.setState({
                                largImage
                            }, () => {
                                this.setState({
                                    modalVisible: true,
                                    index: 0
                                });
                            });
                        }
                    }}
                >
                    <Text
                        style={[{
                            fontSize: 13, color: '#333333'
                        }]}
                    >{`${SentencedToEmpty(item, ['Files', 'ImgNameList'], []).length}张`}</Text>
                </TouchableOpacity>
            </View>);
        }

        // return (
        //     <View
        //         style={[
        //             {
        //                 width: SCREEN_WIDTH - 40,
        //                 height: 60,
        //                 flexDirection: 'row'
        //             }
        //         ]}
        //     >
        //         <View
        //             style={[
        //                 {
        //                     width: 26,
        //                     height: 60,
        //                     alignItems: 'center'
        //                 }
        //             ]}
        //         >
        //             {index != 0 ? (
        //                 <View
        //                     style={[
        //                         {
        //                             width: 1,
        //                             height: 10,
        //                             marginBottom: 6,
        //                             backgroundColor: '#EAEAEA'
        //                         }
        //                     ]}
        //                 />
        //             ) : (
        //                 <View
        //                     style={[
        //                         {
        //                             width: 1,
        //                             height: 10,
        //                             marginBottom: 6
        //                         }
        //                     ]}
        //                 />
        //             )}
        //             <View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#999999' }]} />
        //             {index != length - 1 ? (
        //                 <View
        //                     style={[
        //                         {
        //                             width: 1,
        //                             height: 32,
        //                             marginTop: 6,
        //                             backgroundColor: '#EAEAEA'
        //                         }
        //                     ]}
        //                 />
        //             ) : null}
        //         </View>

        //         <View style={[{
        //             width: SCREEN_WIDTH - 66, height: 60
        //         }]}>
        //             <Text numberOfLines={1} style={[{ marginTop: 10, fontSize: 14, color: '#000028' }]}>
        //                 {`${this.state.listType == 1 ? '签到' : item.CheckType == 1 ? '签到' : '签退'}：${this.state.listType == 1 ? item.SignTime : moment(item.CheckInTime).format('HH:mm')}`}
        //             </Text>
        //             <View style={[{
        //                 flexDirection: 'row', width: SCREEN_WIDTH - 66
        //                 , height: 28, marginTop: 4
        //             }]}>
        //                 <Image
        //                     style={[{ width: 10, height: 10, marginTop: 4 }]}
        //                     source={require('../../../images/icon_location.png')} />
        //                 <Text
        //                     numberOfLines={2}
        //                     style={[{ fontSize: 11, color: '#666666', lineHeight: 15 }]}
        //                 >
        //                     {`${SentencedToEmpty(this, ['state', 'listType'], 0) == 0
        //                         ? SentencedToEmpty(item, ['ProjectName'], '')
        //                         : SentencedToEmpty(item, ['Address'], '')
        //                         }`}
        //                 </Text>
        //             </View>
        //         </View>
        //     </View>
        // );
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
        // 动态高度 start
        this.setState({
            loadingStatus: -1
        });
        const rowLength = this.getCalenderRows(nextDate);
        if (rowLength > 5) {
            let otherHeight = (rowLength - 5) * 40;
            calenderComponentHeight = 260 + otherHeight;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        } else {
            calenderComponentHeight = 260;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        }
        // 动态高度 end
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
        this.props.dispatch(
            createAction('CTModel/getSignHistoryList')({
                params: {
                    recordDate: nextDate.format('YYYY-MM-DD')
                },
                callback: result => { }
            })
        );
    }

    previousDateFun = () => {
        let previousDate = moment(this.props.calenderCurrentMonth).subtract(1, 'months');
        // 动态高度 start
        this.setState({
            loadingStatus: -1
        });
        const rowLength = this.getCalenderRows(previousDate);
        if (rowLength > 5) {
            let otherHeight = (rowLength - 5) * 40;
            calenderComponentHeight = 260 + otherHeight;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        } else {
            calenderComponentHeight = 260;
            this.setState({
                calendarHeight: new Animated.Value(calenderComponentHeight)
                , loadingStatus: 200
            });
        }
        // 动态高度 end
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
        this.props.dispatch(
            createAction('CTModel/getSignHistoryList')({
                params: {
                    recordDate: previousDate.format('YYYY-MM-DD')
                },
                callback: result => { }
            })
        );
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
        this.getCalenderRows(this.props.calenderCurrentMonth);
        // console.log(' calenderSelectedDate = ', this.props.calenderSelectedDate);
        // console.log(this.props.calenderSelectedDate + " = " + SentencedToEmpty(this.props
        //     , ['calenderDataObject', this.props.calenderSelectedDate], ''));
        return (<StatusPage
            status={this.state.loadingStatus}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
            }}
            onErrorPress={() => {
                //错误页面按钮回调
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH, flex: 1
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH - 20, marginTop: 10
                    , marginLeft: 10, backgroundColor: '#ffffff'
                    , borderRadius: 5
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
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40,
                        }]}
                    >
                        <Animated.View style={[{ height: this.state.calendarHeight, width: SCREEN_WIDTH - 40 }]}>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40
                                }]}
                            >
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
                            </View>
                        </Animated.View>
                        <View style={[{
                            height: 16, width: SCREEN_WIDTH - 40,
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
                                <View style={[{ height: 16, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center' }]}>
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
                        </View>
                    </View>
                </View >
                <Animated.View
                    style={[{ width: SCREEN_WIDTH - 40, flex: 1, marginBottom: 10 }]}
                >
                    {
                        SentencedToEmpty(this.props
                            , ['calenderDataObject'
                                , this.props.calenderSelectedDate
                                , 'StatisticMsg'], '') == ''
                            ? null
                            : <View style={[{
                                width: SCREEN_WIDTH - 20, marginVertical: 5
                                , marginLeft: 10, backgroundColor: '#ffffff'
                                , borderRadius: 5
                                // , flex: 1
                                , alignItems: 'center'
                                , height: 40, justifyContent: 'center'
                            }]}>
                                <View style={[{
                                    width: SCREEN_WIDTH - 40
                                    , flexDirection: 'row'
                                }]}>
                                    <Text
                                        numberOfLines={2}
                                        style={[{
                                            width: SCREEN_WIDTH - 40,
                                            fontSize: 11, color: '#666666'
                                            // , marginTop: 17
                                            , lineHeight: 16
                                        }]}>{
                                            `${this.getText()}`
                                        }</Text>
                                </View>
                            </View>
                    }


                    {
                        SentencedToEmpty(this.props
                            , ['calenderDataObject'
                                , this.props.calenderSelectedDate
                                , 'DataList'], []).length == 0
                            ? null
                            : <View style={[{
                                width: SCREEN_WIDTH - 20
                                , marginLeft: 10
                                // , backgroundColor: '#ffffff'
                                , borderRadius: 5, flex: 1
                                , alignItems: 'center'
                            }]}>
                                <ScrollView
                                    style={[{
                                        width: SCREEN_WIDTH - 20, flex: 1
                                    }]}>
                                    {
                                        this.getList().map((item, index) => {
                                            return this.renderLineItem(item, index, this.getList().length);
                                        })
                                    }
                                </ScrollView>
                            </View>
                    }
                </Animated.View>
                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                        onClick={() => {
                            {
                                this.setState({
                                    modalVisible: false
                                });
                            }
                        }}
                        onSave={url => {
                            // this.savePhoto(this.state.largImage[0].url);
                        }}
                        imageUrls={this.state.largImage}
                        // index={0}
                        index={this.state.index}
                    />
                </Modal>
            </View >
        </StatusPage>
        );
    }
}
