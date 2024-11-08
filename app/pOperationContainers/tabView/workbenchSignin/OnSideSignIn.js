/*
 * @Description: 现场签到
 * @LastEditors: hxf
 * @Date: 2024-01-31 08:34:22
 * @LastEditTime: 2024-11-01 13:44:41
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbenchSignin/OnSideSignIn.js
 */
import {
    Image, ImageBackground, Text, TouchableOpacity
    , View, NativeModules, Platform, Alert,
    ScrollView,
    Modal
} from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker'
import moment from 'moment'
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction } from '../../../utils'
import { connect } from 'react-redux'
import { Geolocation, stop } from 'react-native-amap-geolocation';
import { StatusPage } from '../../../components'
import ImageUploadTouch from '../../../components/form/images/ImageUploadTouch'
import ImageDeleteTouch from '../../../components/form/images/ImageDeleteTouch'
import ImageViewer from 'react-native-image-zoom-viewer'
import { getEncryptData } from '../../../dvapack/storage'
import { IMAGE_DEBUG, ImageUrlPrefix } from '../../../config'
import AutoTimerText from '../../components/AutoTimerText'


const AMapGeolocation = NativeModules.AMapGeolocation;

@connect(({ signInModel }) => ({
    signInEntListResult: signInModel.signInEntListResult,// 获取企业列表请求的状态
    signInTypeResult: signInModel.signInTypeResult, // 获取工作类型请求的状态

    entListStatus: signInModel.entListStatus,
    workTypeList: signInModel.workTypeList,
    signInEntList: signInModel.signInEntList,
    workTypeSelectedItem: signInModel.workTypeSelectedItem, // 选中的工作类型
    signInEntItem: signInModel.signInEntItem, // 选中的企业
    signInTime: signInModel.signInTime, // 签到时间
    signOutTime: signInModel.signOutTime,// 签退时间
    orientationStatus: signInModel.orientationStatus, // 用户所在位置的状态码

    longitude: signInModel.longitude, // 用户位置，搜索中心经度
    latitude: signInModel.latitude,// 用户位置，搜索中心纬度
    signStatus: signInModel.signStatus, // signIn: true, signOut: true 可以签到，可以签退

    fileUUID: signInModel.fileUUID,
}))
export default class OnSideSignIn extends Component {

    static defaultProps = {
        // selectedProject: {
        //     ProjectId: '123'
        // },
        // orientationStatus: 'out'
    }

    constructor(props) {
        super(props);
        _me = this;
        this.state = {
            // lastLatitude: 0,
            // lastLongitude: 0,
            // errorNum: 0, watchId: ''
            imageList: [],
            Imgs: [],
            largImage: [],
            modalVisible: false,
        };
    }

    componentDidMount() {
        console.log('OnSideSignIn componentDidMount')
        this.onFreshData();
    }

    onFreshData = () => {
        this.props.dispatch(
            createAction('signInModel/getLastSingInfo')({
                params: { SignWorkType: 60 }
            })
        );
        this.props.dispatch(
            createAction('signInModel/updateState')({
                signInTime: '', // 签到时间
                signOutTime: '',// 签退时间
                commonSignInProject: { status: -1 },
                orientationStatus: 'unlocated'
                , entListStatus: 0 //未获取运维企业信息
                , signInEntListResult: { status: -1 }// 获取企业列表请求的状态
                , signInTypeResult: { status: -1 }// 获取工作类型请求的状态
            })
        );
        /**
         * 获取打卡数据
         * 方法在SignInEnter中
         * 这样只有第一次进入签到页的时候才会触发
         * 切换运维现场和非现场时不在获取最近一条数据
         */

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
                    _me.props.dispatch(
                        createAction('signInModel/updateState')({
                            signInTypeResult: { status: 1000 },
                            signInEntListResult: { status: 1000 }// 获取企业列表请求的状态
                        })
                    );
                    Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                }
            });
        }
    }


    startLocation = () => {
        let watchId = '';
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            // this.setState({ errorNum: 0, watchId: '' });
        }
        console.log('开始定位');
        watchId = Geolocation.watchPosition(
            success => {
                // console.log(`定位一次${moment().format("HH:mm:ss")}`);
                // console.log('location = ', success);
                if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0
                    || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                    // this.props.dispatch(createAction('CTModel/updateState')({
                    //     currentOrientationInfo: null,
                    //     orientationFailureTimes: this.props.orientationFailureTimes + 1,
                    // }));
                } else {
                    if (this && typeof this != 'undefined'
                        && this.updateLocationState
                        && typeof this.updateLocationState == 'function') {
                        let resultInfo = {
                            longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                            , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                        }
                        if (this.props.entListStatus == 0) {
                            // 未获取 运维企业 列表
                            this.props.dispatch(createAction('signInModel/getSignInEntList')({
                                params: {
                                    longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                                    , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                                }
                            }));

                        };
                    }
                    // this.props.dispatch(createAction('CTModel/updateState')({
                    //     lastOrientationInfo: resultInfo,
                    //     currentOrientationInfo: resultInfo,
                    //     orientationFailureTimes: 0,
                    // }));
                    this.updateLocationState(success);
                }
            },
            error => {
                console.log('定位错误error = ', error);
                if (this.state.watchId != '') {
                    Geolocation.clearWatch(this.state.watchId);
                }
                stop();
                this.props.dispatch(
                    createAction('signInModel/updateState')({
                        signInTypeResult: { status: 1000 },
                        signInEntListResult: { status: 1000 }// 获取企业列表请求的状态
                    })
                );
                ShowToast('定位失败，无法获取企业列表，请您打卡定位权限');
            }
        );
        return watchId;
    };

    updateLocationState = location => {
        // this.setState({
        //     lastLatitude: location.coords.latitude,
        //     lastLongitude: location.coords.longitude
        // });
        this.props.dispatch(createAction('signInModel/updateState')({
            longitude: location.coords.longitude, // 用户位置，搜索中心经度
            latitude: location.coords.latitude, // 用户位置，搜索中心纬度
        }))

        //开始测量距离
        let distanceResult;
        if (Platform.OS == 'ios') {
            distanceResult = AMapGeolocation.RNTransferDistance({
                latitude: SentencedToEmpty(this.props, ['signInEntItem', 'latitude'], 0),
                longitude: SentencedToEmpty(this.props, ['signInEntItem', 'longitude'], 0),
                Anolatitude: location.coords.latitude,
                Anolongitude: location.coords.longitude
            });
        } else {
            distanceResult = AMapGeolocation.RNTransferDistance(
                SentencedToEmpty(this.props, ['signInEntItem', 'latitude'], 0),
                SentencedToEmpty(this.props, ['signInEntItem', 'longitude'], 0),
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
                // console.log('result.distance = ', result.distance);
                if (result.distance <= SentencedToEmpty(this.props, ['signInEntItem', 'radius'], 0) * 1000) {
                    this.props.dispatch(createAction('signInModel/updateState')({
                        orientationStatus: 'in'
                    }));
                } else {
                    this.props.dispatch(createAction('signInModel/updateState')({
                        orientationStatus: 'out'
                    }));
                }
            })
            .catch(error => {
                console.log('error = ', error);
            });
    }

    componentWillUnmount() {
        console.log('OnSideSignIn componentWillUnmount')
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
        }
        stop();
    }

    hasSignIn = () => {
        const signInTime = SentencedToEmpty(this.props, ['signInTime'], '');
        if (signInTime == '') {
            return false;
        } else {
            return true;
        }
    }

    hasSignOut = () => {
        const signOutTime = SentencedToEmpty(this.props, ['signOutTime'], '');
        if (signOutTime == '') {
            return false;
        } else {
            return true;
        }
    }

    getSignInStatus = () => {
        /**
         * 不允许夜班后连白班
         * 排除夜班后切换至 非驻场运维现场和驻场运维白班
         * 不会出现夜班 signInTime存在影响白班打卡的情况
         */
        const signInTime = SentencedToEmpty(this.props, ['signInTime'], '');
        const signOutTime = SentencedToEmpty(this.props, ['signOutTime'], '');
        // 如果存在签到时间则可以签退
        // 夜班可能出现只有签退，这时候需要继续刷新签退
        // if (signInTime != '' || signOutTime != '') {
        //     return true;
        // } else {
        //     return false;
        // }

        if (SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '')
            == "574") {
            // 夜班
            const signIn = SentencedToEmpty(this.props, ['signStatus', 'signIn'], false);
            const signOut = SentencedToEmpty(this.props, ['signStatus', 'signOut'], false);
            if (!signIn && signOut) {
                return true;
            } else {
                return false;
            }
        } else {
            if (signInTime != '' && signOutTime == '') {
                return true;
            } else {
                return false;
            }
        }
    }

    getPromptMessageView = () => {
        const ProjectName = SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], 'emptyProjectOrProperty');
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
    }

    getManualRefreshView = () => {
        const entCode = SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], 'emptyProjectOrProperty');
        if (entCode == 'emptyProjectOrProperty'
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
                                    Latitude: SentencedToEmpty(this.props, ['signInEntItem', 'latitude'], ''),
                                    Longitude: SentencedToEmpty(this.props, ['signInEntItem', 'longitude'], ''),
                                    Radius: SentencedToEmpty(this.props, ['signInEntItem', 'radius'], 3) * 1000,
                                    PointName: SentencedToEmpty(this.props, ['signInEntItem', 'entName'], 'ProjectName')
                                }
                            })
                        );
                        // 却少定位信息
                        // this.props.dispatch(
                        //     createAction('taskDetailModel/updateState')({
                        //         clockInLongitude: this.state.lastLongitude,
                        //         clockInLatitude: this.state.lastLatitude,
                        //         clockInStatus: 3 //1 正常，2 异常
                        //     })
                        // );
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap', params: { from: 'ChengTaoSignIn' } }));
                    }}
                >
                    <View style={[{
                        height: 48, paddingHorizontal: 10,
                    }]}>
                        <Text style={{ color: '#333333' }}>{'查看打卡范围'}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity></TouchableOpacity> */}
            </View>);
        }
    }

    getLoadStatus = () => {
        // signInEntListResult: signInModel.signInEntListResult,// 获取企业列表请求的状态
        //     signInTypeResult: signInModel.signInTypeResult, // 获取工作类型请求的状态 好想不再使用
        const entListResultStatus = SentencedToEmpty(this.props
            , ['signInEntListResult', 'status'], 1000);
        const signInTypeResultStatus = SentencedToEmpty(this.props
            , ['signInEntListResult', 'status'], 1000);
        if (entListResultStatus == 200
            && signInTypeResultStatus == 200) {
            return 200;
        } else if (entListResultStatus == -1
            || signInTypeResultStatus == -1) {
            return -1;
        } else {
            return 1000;
        }

    }

    clockIn = () => {
        // if (SentencedToEmpty(this.state, ['Imgs'], []).length == 0) {
        //     ShowToast('签到照片不能为空');
        //     return;
        // }
        const hasSignIn = this.getSignInStatus();
        /**
         * SignIn 必传参数  longitude、latitude、SignWorkType（现场、非现场）
         * 、WorkType（工作类型）、entID、SignType（1、签到 2 签退）
         * 、Address（地址信息 现场不用传）、Remark（备注 现场不用传）
         */
        let signInParams = {};
        signInParams.longitude = SentencedToEmpty(this.props, ['longitude'], '');
        signInParams.latitude = SentencedToEmpty(this.props, ['latitude'], '');
        signInParams.entID = SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], '');
        signInParams.WorkType = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
        signInParams.SignWorkType = '60'; //60  运维现场   61 非现场 
        signInParams.File = this.props.fileUUID + '';

        if (hasSignIn) {
            ShowLoadingToast('签退正在提交');
            signInParams.SignType = 2;
        } else {
            ShowLoadingToast('签到正在提交');
            signInParams.SignType = 1;
        }
        // 检验夜班打卡是否在可签到的时间段内
        let signInCheckParams = { WorkType: signInParams.WorkType };
        this.props.dispatch(createAction('signInModel/getSignStatus')({
            params: signInCheckParams
            , successCallBack: (result) => {
                // 检验成功则 执行签到
                if (hasSignIn) {
                    if (!SentencedToEmpty(result, ['signOut'], false)) {
                        CloseToast();
                        ShowToast('不在夜班签退的时间段内');
                        return;
                    }
                } else {
                    if (!SentencedToEmpty(result, ['signIn'], false)) {
                        CloseToast();
                        ShowToast('不在夜班签到的时间段内');
                        return;
                    }
                }
                const _this = this;
                this.props.dispatch(createAction('signInModel/signIn')({
                    params: signInParams
                    , successCallBack: () => {
                        console.log('successCallBack');
                        this.props.dispatch(
                            createAction('signInModel/updateState')({
                                fileUUID: `_sign_in_${new Date().getTime()}`
                            })
                        );
                        _this.setState({
                            Imgs: []
                            , largImage: []
                        });
                        this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
                        _this.props.dispatch(
                            createAction('signInModel/getLastSingInfo')({
                                params: {
                                    SignWorkType: 60,
                                    entID: signInParams.entID,
                                    fileUUID: `_sign_in_${new Date().getTime()}`
                                }
                            })
                        );
                        CloseToast();
                    }
                    , failCallBack: (result) => {
                        CloseToast();
                        ShowToast(SentencedToEmpty(result
                            , ['data', 'Message']
                            , hasSignIn ? '签退错误' : '签到错误'));
                    }
                }));
            }
            , failCallBack: () => {
                CloseToast();
                ShowToast('夜班签到校验错误');
            }
        }));
    }

    renderSignInBtton = () => {
        const workTypeId = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
        const entCode = SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], '');

        if (workTypeId == '' || entCode == '') {
            return (<TouchableOpacity
                onPress={() => {
                    if (entCode == '') {
                        ShowToast('未选择运维企业');
                    } else if (workTypeId == '') {
                        ShowToast('未选择工作类型');
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
                    source={require('../../../images/bg_ct_sign_in_inactive_button.png')}
                >
                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                </ImageBackground>
            </TouchableOpacity>);
        } else {
            if (workTypeId == '574') {
                // 夜班
                const signIn = SentencedToEmpty(this.props, ['signStatus', 'signIn'], false);
                const signOut = SentencedToEmpty(this.props, ['signStatus', 'signOut'], false);
                if (!signIn && !signOut) {
                    // 非夜班打卡时间段
                    return (<TouchableOpacity
                        onPress={() => {
                            ShowToast('不在夜班打卡时间');
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
                            source={require('../../../images/bg_ct_sign_in_inactive_button.png')}
                        >
                            <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                        </ImageBackground>
                    </TouchableOpacity>);
                } else {
                    if (this.props.orientationStatus != 'in') {
                        return (<TouchableOpacity
                            onPress={() => {
                                ShowToast('超出签到范围');
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
                                source={require('../../../images/bg_ct_sign_in_inactive_button.png')}
                            >
                                <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                            </ImageBackground>
                        </TouchableOpacity>);
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
            } else {
                // 白班
                if (this.props.orientationStatus != 'in') {
                    return (<TouchableOpacity
                        onPress={() => {
                            ShowToast('超出签到范围');
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
                            source={require('../../../images/bg_ct_sign_in_inactive_button.png')}
                        >
                            <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{this.getSignInStatus() ? '签退' : '签到'}</Text>
                        </ImageBackground>
                    </TouchableOpacity>);
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
        }
    }

    renderImageComponent = () => {
        const ProxyCode = getEncryptData();
        {/* 图片控件 */ }
        return (<View
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
                {SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], '') != ''
                    ? <ImageUploadTouch
                        style={{ width: 80, height: 80, marginBottom: 5 }}
                        // componentType={'normal'}
                        componentType={'signIn'}
                        extraInfo={{
                            EnterpriseName: SentencedToEmpty(
                                this.props, ['signInEntItem', 'entName'], ''
                            ),
                            PointName: '',
                        }}
                        uuid={this.props.fileUUID}
                        callback={images => {
                            const ProxyCode = getEncryptData();
                            let Imgs = [...this.state.Imgs];
                            let largImage = [].concat(this.state.largImage);
                            let newItem = [];
                            let tempObject;
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
                    ref={ref => (this.scrollView = ref)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        this.state.Imgs.map((item, key) => {
                            let source = {
                                uri: `${ImageUrlPrefix}${ProxyCode}/thumb_${item.AttachID}`,
                            };
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
        </View>)
        {/* 图片控件 */ }
    }

    render() {
        return (<StatusPage
            // backRef={'true'}
            status={this.getLoadStatus()}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onFreshData();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onFreshData();
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH, flex: 1
                , alignItems: 'center'
                , backgroundColor: '#fff'
            }]}>
                {/* 预加载 */}
                <Image style={{ height: 0, width: 0 }} source={require('../../../images/enterpriselocal.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../../images/ic_audit_invalid.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../../images/auditselect.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../../images/userlocal.png')} />
                <View style={[{
                    width: SCREEN_WIDTH - 40, height: 44
                    , justifyContent: 'center',
                }]}>
                    <FormPicker
                        hasColon={true}
                        label='工作类型'
                        propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                        propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                        propsHolderStyle={{ marginRight: 10 }}
                        propsRightIconStyle={{ tintColor: '#999999', width: 16 }}

                        defaultCode={SentencedToEmpty(
                            this.props, ['workTypeSelectedItem', 'ChildID'], ''
                        )}
                        option={{
                            codeKey: 'ChildID',
                            nameKey: 'Name',
                            defaultCode: SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], ''),
                            dataArr: SentencedToEmpty(this.props, ['workTypeList'], []),
                            onSelectListener: item => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    workTypeSelectedItem: item
                                }));
                                let signInCheckParams = { WorkType: SentencedToEmpty(item, ['ChildID'], '') };

                                const entCode = SentencedToEmpty(
                                    this.props, ['signInEntItem', 'entCode'], ''
                                );
                                if (entCode != '') {
                                    signInCheckParams.entID = entCode;
                                }
                                this.props.dispatch(createAction('signInModel/getSignStatus')({
                                    params: signInCheckParams
                                    , successCallBack: (result) => { }
                                    , failCallBack: () => {
                                        ShowToast('签到校验错误');
                                    }
                                }));
                                if (entCode != '') {
                                    let params = {
                                        SignWorkType: 60,
                                        entID: entCode,
                                        WorkType: item.ChildID
                                    };
                                    // 切换企业获取打卡记录
                                    this.props.dispatch(
                                        createAction('signInModel/getLastSingInfo')({
                                            'params': params
                                        })
                                    );
                                }
                            }
                        }}
                        showText={SentencedToEmpty(
                            this.props, ['workTypeSelectedItem', 'Name'], '请选择'
                        )}
                        placeHolder='请选择'
                    />
                </View>
                <View style={[{
                    width: SCREEN_WIDTH - 40, height: 44
                    , justifyContent: 'center',
                }]}>
                    <FormPicker
                        hasColon={true}
                        label='运维企业'
                        propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                        propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                        propsHolderStyle={{ marginRight: 10 }}
                        propsRightIconStyle={{ tintColor: '#999999', width: 16 }}

                        defaultCode={SentencedToEmpty(
                            this.props, ['signInEntItem', 'entCode'], ''
                        )}
                        option={{
                            codeKey: 'entCode',
                            nameKey: 'entName',
                            defaultCode: SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], ''),
                            dataArr: SentencedToEmpty(this.props, ['signInEntList'], []),
                            onSelectListener: item => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    signInEntItem: item,
                                    orientationStatus: 'unlocated'
                                }));
                                /**
                                 * 如果存在workTypeSelectedItem，
                                 * 查询时需要带上这个参数
                                 */
                                let params = {
                                    SignWorkType: 60,
                                    entID: item.entCode
                                };
                                const WorkType = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
                                if (WorkType != '') {
                                    params.WorkType = WorkType;

                                    let signInCheckParams = { WorkType: WorkType };
                                    signInCheckParams.entID = item.entCode;
                                    this.props.dispatch(createAction('signInModel/getSignStatus')({
                                        params: signInCheckParams
                                        , successCallBack: (result) => { }
                                        , failCallBack: () => {
                                            ShowToast('签到校验错误');
                                        }
                                    }));
                                }
                                // 切换企业获取打卡记录
                                this.props.dispatch(
                                    createAction('signInModel/getLastSingInfo')({
                                        'params': params
                                    })
                                );
                            }
                        }}
                        showText={SentencedToEmpty(
                            this.props, ['signInEntItem', 'entName'], '请选择'
                        )}
                        placeHolder='请选择'
                    />
                </View>

                <View style={[{
                    width: SCREEN_WIDTH, flexDirection: 'row', height: 56
                    , alignItems: 'center', justifyContent: 'space-between'
                    , marginTop: 15, paddingHorizontal: 20
                }, {}]}>
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
                            <Text style={[{ fontSize: 12, color: '#666666', marginTop: 4 }]}>{this.hasSignIn() ? moment(this.props.signInTime).format('HH:mm:ss') : ''}</Text>
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
                            <Text style={[{ fontSize: 12, color: '#666666', marginTop: 4 }]}>{this.hasSignOut() ? moment(this.props.signOutTime).format('HH:mm:ss') : null}</Text>
                        </View>
                    </View>
                </View>

                {this.renderImageComponent()}

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
                    {
                        this.renderSignInBtton()
                    }
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                    {this.getPromptMessageView()}
                    {this.getManualRefreshView()}
                </View>
            </View >
        </StatusPage >
        )
    }
}