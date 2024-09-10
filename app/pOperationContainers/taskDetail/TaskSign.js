/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2022-11-30 09:14:10
 * @LastEditTime: 2024-04-23 15:44:13
 * @FilePath: /SDLMainProject37_backup/app/pOperationContainers/taskDetail/TaskSign.js
 */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, NativeModules, Platform, Alert, Image } from 'react-native';
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../config/globalsize';
import AutoTimerText from '../../operationContainers/home/workbench/components/AutoTimerText';
import IconDialog from '../../operationContainers/taskViews/taskExecution/components/IconDialog';
import { SentencedToEmpty, NavigationActions, ShowLoadingToast, CloseToast, createAction, ShowToast } from '../../utils';
import { Geolocation, stop } from 'react-native-amap-geolocation';

const AMapGeolocation = NativeModules.AMapGeolocation;
let _me;

@connect(({ taskDetailModel }) => ({
    taskDetail: taskDetailModel.taskDetail,
    isSigned: taskDetailModel.isSigned,
    isMyTask: taskDetailModel.isMyTask
}))
export default class TaskSign extends Component {
    constructor(props) {
        super(props);
        _me = this;
        this.state = {
            lastLatitude: 0,
            lastLongitude: 0,
            clockingIn: false, // 定位状态
            orientationType: 'simple', // signIn simple
        };
    }

    // 打卡
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
            this.setState({ errorNum: 0 });
        }
        const taskInfo = {
            EnterpriseName: this.props.taskDetail.EnterpriseName,
            PointName: this.props.taskDetail.PointName,
            TaskCode: this.props.taskDetail.TaskCode
        };
        watchId = Geolocation.watchPosition(
            success => {
                if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0 || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                    if (this.state.errorNum + 1 == 5) {
                        this.setState({ errorNum: 0 }); //计数器归零
                        Geolocation.clearWatch(watchId); //清楚监听
                        this.setState({ clockingIn: false }); //停止打卡按钮转圈
                        // this.props.dispatch(
                        //     createAction('app/addClockInLog')({
                        //         //提交异常日志
                        //         msg: `${JSON.stringify(success)}`
                        //     })
                        // );
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
                if (this.state.errorNum + 1 == 5) {
                    this.setState({ errorNum: 0 }); //计数器归零
                    Geolocation.clearWatch(watchId); //清楚监听
                    this.setState({ clockingIn: false }); //停止打卡按钮转圈
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
                latitude: SentencedToEmpty(this.props, ['taskDetail', 'Latitude'], 0),
                longitude: SentencedToEmpty(this.props, ['taskDetail', 'Longitude'], 0),
                Anolatitude: location.coords.latitude,
                Anolongitude: location.coords.longitude
            });
        } else {
            distanceResult = AMapGeolocation.RNTransferDistance(SentencedToEmpty(this.props, ['taskDetail', 'Latitude'], 0), SentencedToEmpty(this.props, ['taskDetail', 'Longitude'], 0), location.coords.latitude, location.coords.longitude);
        }

        /**
         * 40.07,116.32,40.09,116.29
         * 40.07,116.32,40.06,116.38
         */
        // let distanceResult = AMapGeolocation.RNTransferDistance(40.07,116.32,40.06,116.38);
        distanceResult
            .then(result => {
                if (result.distance <= SentencedToEmpty(this.props, ['taskDetail', 'OperationRadius'], 0)) {
                    ShowLoadingToast('打卡信息上传中');
                    this.props.dispatch(
                        createAction('taskDetailModel/taskSignIn')({
                            params: {
                                taskID: this.props.taskDetail.ID,
                                longitude: location.coords.longitude,
                                latitude: location.coords.latitude
                            },
                            callback: () => {
                                CloseToast('打卡结束');
                            }
                        })
                    );
                } else {
                    if (this.iconDialog) {
                        this.iconDialog.showModal();
                    }
                }
            })
            .catch(error => {
                console.log('error = ', error);
            });
    };

    render() {
        let signTime = '';
        if (this.props.isSigned) {
            let TaskLogList = SentencedToEmpty(this.props, ['taskDetail', 'TaskLogList'], []);
            TaskLogList.map((item, index) => {
                if (item.TaskStatus == 9) {
                    signTime = SentencedToEmpty(item, ['CreateTime'], '');
                }
            });
        }
        return (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                {/* 预加载 */}
                <Image style={{ height: 0, width: 0 }} source={require('../../images/enterpriselocal.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../images/ic_audit_invalid.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../images/auditselect.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../../images/userlocal.png')} />
                <View
                    style={{
                        marginTop: 11,
                        width: SCREEN_WIDTH,
                        flex: 1,
                        alignItems: 'center',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <View
                        style={{
                            width: SCREEN_WIDTH - 50,
                            height: 56,
                            backgroundColor: '#F2F2F2',
                            borderRadius: 10,
                            marginTop: 10,
                            flexDirection: 'row'
                        }}
                    >
                        <View
                            style={{
                                borderRightWidth: 1,
                                borderRightColor: '#DFDFDF',
                                height: 56,
                                flex: 1,
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                justifyContent: 'center',
                                paddingLeft: 15
                            }}
                        >
                            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center' }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: '#333333'
                                    }}
                                >{`打卡状态：${this.props.isSigned ? '已打卡' : '未打卡'}`}</Text>
                                {SentencedToEmpty(this.props, ['taskDetail', 'clockInStatus'], 1) == 2 ? (
                                    <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FF9912', borderRadius: 4, height: 14 }}>
                                        <Text style={{ fontSize: 12, color: '#FF9912' }}>{'异常'}</Text>
                                    </View>
                                ) : null}
                            </View>
                            {this.props.isMyTask ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#666666'
                                        }}
                                    >{`打卡时间：`}</Text>
                                    {this.props.isSigned ? (
                                        <Text style={{ fontSize: 12, color: '#666666' }}>{signTime == '' ? '----' : signTime.split(' ')[0]}</Text>
                                    ) : (
                                        <AutoTimerText textStyle={{ fontSize: 12, color: '#666666' }} ref={ref => (this.autoTimerText = ref)} />
                                    )}
                                </View>
                            ) : this.props.isSigned ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#666666'
                                        }}
                                    >{`打卡时间：`}</Text>
                                    <Text style={{ fontSize: 12, color: '#666666' }}>{signTime == '' ? '----' : signTime.split(' ')[0]}</Text>
                                </View>
                            ) : null}
                        </View>
                        {this.props.isSigned ? (
                            <TouchableOpacity
                                onPress={() => {
                                    // 查看打卡记录
                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap' }));
                                }}
                            >
                                <View
                                    style={{
                                        height: 56,
                                        width: 140,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: '#333333', marginRight: 8 }}>{`查看打卡${SentencedToEmpty(this.props, ['taskDetail', 'clockInStatus'], 1) == 2 ? '异常' : '记录'}`}</Text>
                                    <Text style={{ fontSize: 15, color: '#999999' }}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    if (SentencedToEmpty(this.props, ['taskDetail', 'Longitude'], -1) == -1 || SentencedToEmpty(this.props, ['taskDetail', 'Latitude'], -1) == -1) {
                                        ShowToast('企业信息异常，无法获取该任务的站点坐标。');
                                    } else {
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap' }));
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        height: 56,
                                        width: 140,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: '#333333', marginRight: 8 }}>{'查看打卡范围'}</Text>
                                    <Text style={{ fontSize: 15, color: '#999999' }}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    {!this.props.isMyTask ? (
                        this.props.isSigned ? (
                            <View style={{ width: 138, height: 138, borderRadius: 69, backgroundColor: '#BEC3CC', marginTop: 128, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{'已打卡'}</Text>
                                <Text style={{ fontSize: 17, color: 'white' }}>{signTime == '' ? '----' : signTime.split(' ')[1]}</Text>
                            </View>
                        ) : null
                    ) : this.props.isSigned ? (
                        <View style={{ width: 138, height: 138, borderRadius: 69, backgroundColor: '#BEC3CC', marginTop: 128, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{'已打卡'}</Text>
                            <Text style={{ fontSize: 17, color: 'white' }}>{signTime == '' ? '----' : signTime.split(' ')[1]}</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                // if (this.iconDialog) {
                                //     this.iconDialog.showModal();
                                // }
                                // let distanceResult = AMapGeolocation.RNTransferDistance(40.07,116.32,40.09,116.29);
                                // let distanceResult = AMapGeolocation.RNTransferDistance(40.07,116.32,40.06,116.38);
                                // 116.38,40.06 40.07,116.32 40.09,116.29
                                // distanceResult.then((result)=>{
                                //     console.log('distance = ',result);
                                // }).catch((error)=>{
                                //     console.log('error = ',error);
                                // })
                                this.clockIn();
                            }}
                            style={{
                                marginTop: 128
                            }}
                        >
                            <View style={{ width: 138, height: 138, borderRadius: 69, backgroundColor: '#4DA9FF', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{'任务打卡'}</Text>
                                <AutoTimerText textStyle={{ fontSize: 17, color: 'white' }} ref={ref => (this.autoTimerText = ref)} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <IconDialog hasCloseButton={true} ref={ref => (this.iconDialog = ref)} icUri={require('../../images/ic_dialog_check_in_error.png')}>
                    <View style={{ width: 270, height: 172, alignItems: 'center' }}>
                        <Text style={{ fontSize: 17, color: '#333333', marginVertical: 15 }}>{'打卡异常提示'}</Text>
                        <Text style={{ fontSize: 14, color: '#666666', marginBottom: 15, width: 237, marginLeft: 15 }}>{'您的当前位置处于厂区范围之外，可能造成打卡异常，您确认继续打卡吗？'}</Text>
                        <View style={{ flexDirection: 'row', width: 270, justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                style={{}}
                                onPress={() => {
                                    this.iconDialog.hide();
                                    this.props.dispatch(
                                        createAction('taskDetailModel/updateState')({
                                            clockInLongitude: this.state.lastLongitude,
                                            clockInLatitude: this.state.lastLatitude,
                                            clockInStatus: 3 //1 正常，2 异常
                                        })
                                    );
                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'ScopeMap' }));
                                }}
                            >
                                <View style={{ width: 112, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#F7F7F7' }}>
                                    <Text style={{ fontSize: 17, color: '#333333' }}>{'查看打卡信息'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                            </TouchableOpacity>
                        </View>
                    </View>
                </IconDialog>
            </View>
        );
    }
}
