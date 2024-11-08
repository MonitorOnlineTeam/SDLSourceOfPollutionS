/*
 * @Description: 成套位置异常展示地图
 * @LastEditors: hxf
 * @Date: 2024-01-25 14:39:41
 * @LastEditTime: 2024-11-01 16:49:05
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/CTSignInMap.js
 */
import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Image } from 'react-native';
// import Map from '../../../components/Map';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import IconDialog from '../../../operationContainers/taskViews/taskExecution/components/IconDialog';
// import IconDialog from '../../../components/IconDialog';
import { Tag } from 'antd-mobile-rn';
import { MapView, Marker } from 'react-native-amap3d';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { connect } from 'react-redux';
var react_native_1 = require('react-native');
var AMapGeolocation = react_native_1.NativeModules.AMapGeolocation;

export default class CTSignInMap extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '查看打卡范围',
            headerRight: SentencedToEmpty(navigation, ['state', 'params', 'headerRight'], <View></View>)
        });

    componentDidMount() {
        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.iconDialog.showModal();
                    }}
                >
                    <Text style={{ color: 'white', marginRight: 8 }}>说明</Text>
                </TouchableOpacity>
            )
        });
    }

    isChengTaoSignIn = () => {
        const from = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'from'], 'task')
        if (from == 'ChengTaoSignIn') {
            return true;
        } else {
            return false;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Map />
                <IconDialog hasCloseButton={true} ref={ref => (this.iconDialog = ref)} icUri={require('../../../images/ic_dialog_no_check_in.png')}>
                    <View style={{ width: 270, height: 150, alignItems: 'center' }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/userlocal.png')} />
                                <Text style={[{ color: '#333333' }]}>{'您的当前位置'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/enterpriselocal.png')} />
                                <Text style={[{ color: '#333333' }]}>{this.isChengTaoSignIn() ? '项目位置' : '监测点位置'}</Text>
                            </View>
                            {/* 大家都认为标记这个位置不合适
                            <View style={{flexDirection:'row', alignItems:'center',marginBottom:10}}>
                                <Image
                                    style={{height:13,width:13,tintColor:'#FF9912',marginRight:8}}
                                    source={require('../../../images/ic_audit_invalid.png')}
                                />
                                <Text>{'当前打卡可能出现打卡异常'}</Text>
                            </View> */}

                            {this.isChengTaoSignIn() ? null : <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/ic_audit_invalid.png')} />
                                <Text style={[{ color: '#333333' }]}>{'打卡异常的位置'}</Text>
                            </View>}
                            {this.isChengTaoSignIn() ? null : <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image style={{ height: 13, width: 13, marginRight: 8 }} source={require('../../../images/auditselect.png')} />
                                <Text style={[{ color: '#333333' }]}>{'无异常的打卡位置'}</Text>
                            </View>}
                        </View>
                    </View>
                </IconDialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // backgroundColor: 'red',
    }
});


@connect(({ taskModel, taskDetailModel }) => ({
    currnetTimeCardEnterprise: taskModel.currnetTimeCardEnterprise,
    clockInLongitude: taskDetailModel.clockInLongitude,
    clockInLatitude: taskDetailModel.clockInLatitude,
    clockInStatus: taskDetailModel.clockInStatus //1 正常，2 异常
}))
class Map extends Component {

    static defaultProps = {
        mapType: 'standard'
    };

    constructor(props) {
        super(props);
        me = this;
        this.state = {
            mapType: props.mapType,
            active: 0,

            currentLocal: { latitude: 40.198783, longitude: 116.289805 }
        };
    }

    componentWillUnmount() {
        if (Platform.OS == 'ios') {
            AMapGeolocation.RNTransferIOSWithCallBack(data => {
                if (data == 'false') {
                } else {
                    Geolocation.getCurrentPosition(location => this.updateLocationState(location));
                    if (SentencedToEmpty(this, ['watchId'], '') != '') {
                        Geolocation.clearWatch(this.watchId);
                    }
                }
            });
        }
        if (Platform.OS == 'android') {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                console.log('isLocationEnabled = ', isLocationEnabled);
                if (isLocationEnabled
                    && SentencedToEmpty(me, ['watchId'], '') != '') {
                    Geolocation.clearWatch(me.watchId);
                }
            });
        }
    }
    componentDidMount() {
        this.watchId = Geolocation.watchPosition(
            location => me.updateLocationState(location),
            error => console.log(error)
        );
        console.log('this.watchId = ', this.watchId);
    }
    updateLocationState = location => {
        //latitude: 40.110477, longitude: 116.299076
        if (this.props.currnetTimeCardEnterprise.Latitude == '' || this.props.currnetTimeCardEnterprise.Latitude == '') {

        } else if (location) {
            location.timestamp = new Date(location.timestamp).toLocaleString();
            console.log('location.coords = ', location.coords);
            this.setState({ currentLocal: location.coords });
        }
    };

    // 改变地图模式
    _changeType(type, index) {
        this.setState({
            mapType: type,
            active: index
        });
    }

    render() {
        if (this.props.currnetTimeCardEnterprise.Latitude == '' || this.props.currnetTimeCardEnterprise.Latitude == '') {
            ShowToast('无法获取企业坐标，请联系管理员');
            return <SDLText>无法获取到企业坐标，请联系管理员</SDLText>;
        }
        const { mapCoordinate, PolylineData } = this.props;
        const iconSize = 20;
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    zoomLevel={12}
                    tiltEnabled={false} // 是否启用倾斜手势，用于改变视角
                    rotateEnabled={false} // 是否启用旋转手势，用于调整方向
                    showsCompass={false} // 是否显示指南针
                    showsScale={false} // 是否显示比例尺
                    zoomEnabled={true}
                    showsZoomControls={true} // 是否启用放大缩小按钮 android显示
                    // showsLabels={false} // 是否显示文本标签
                    mapType={this.state.mapType}
                    coordinate={{
                        latitude: this.props.currnetTimeCardEnterprise.Latitude,
                        longitude: this.props.currnetTimeCardEnterprise.Longitude
                    }}
                    center={{
                        latitude: this.props.currnetTimeCardEnterprise.Latitude,
                        longitude: this.props.currnetTimeCardEnterprise.Longitude
                    }}
                    circleDic={{
                        radius: parseFloat(this.props.currnetTimeCardEnterprise.Radius),
                        coordinates: [
                            {
                                latitude: this.props.currnetTimeCardEnterprise.Latitude,
                                longitude: this.props.currnetTimeCardEnterprise.Longitude
                            }
                        ]
                    }}
                    polylinesArray={PolylineData}
                >
                    <MapView.Circle
                        strokeWidth={1}
                        strokeColor="rgba(77, 169, 255, 0.14)"
                        fillColor="rgba(77, 169, 255, 0.14)"
                        radius={parseFloat(this.props.currnetTimeCardEnterprise.Radius)}
                        coordinate={{
                            latitude: this.props.currnetTimeCardEnterprise.Latitude,
                            longitude: this.props.currnetTimeCardEnterprise.Longitude
                        }}
                    />
                    {
                        // 绘制坐标点
                        <MapView.Marker
                            active={true}
                            centerOffset={{ x: 0, y: -11.5 }}
                            // image="enterpriselocal"
                            title={this.props.currnetTimeCardEnterprise.PointName}
                            draggable={false}
                            // description='Hello world!'
                            coordinate={{
                                latitude: this.props.currnetTimeCardEnterprise.Latitude,
                                longitude: this.props.currnetTimeCardEnterprise.Longitude
                            }}
                            icon={() => {
                                return <Image style={{ height: iconSize, width: iconSize }} source={require('../../../images/enterpriselocal.png')} />;
                            }}
                        />
                    }
                    {/**
                            打卡 前 发现打卡异常
                            clockInStatus:0,// 0 未打卡, 1 正常, 2 异常, 3 打卡异常
                            大家都认为标记这个位置不合适
                         */
                        this.props.clockInStatus == 3 && false ? (
                            // 绘制坐标点
                            <MapView.Marker
                                // active
                                title="打卡位置"
                                draggable={false}
                                // description='Hello world!'
                                coordinate={{
                                    latitude: this.props.clockInLatitude,
                                    longitude: this.props.clockInLongitude
                                    // latitude:40.07
                                    // ,longitude:116.32
                                }}
                                icon={() => {
                                    return <Image style={{ height: iconSize, width: iconSize, tintColor: '#FF9912' }} source={require('../../../images/ic_audit_invalid.png')} />;
                                }}
                            >
                                <View></View>
                            </MapView.Marker>
                        ) : null}
                    {/**已经记录的打卡异常 */
                        this.props.clockInStatus == 2 ? (
                            <MapView.Marker
                                // active
                                title="打卡位置"
                                draggable={false}
                                // description='Hello world!'
                                coordinate={{
                                    latitude: this.props.clockInLatitude,
                                    longitude: this.props.clockInLongitude
                                    // latitude:40.06
                                    // ,longitude:116.38
                                }}
                                icon={() => {
                                    return <Image style={{ height: iconSize, width: iconSize }} source={require('../../../images/ic_audit_invalid.png')} />;
                                }}
                            >
                                <View></View>
                            </MapView.Marker>
                        ) : null}
                    {/**已经记录的打卡异常 */
                        this.props.clockInStatus == 1 ? (
                            <MapView.Marker
                                // active
                                title="打卡位置"
                                draggable={false}
                                // description='Hello world!'
                                coordinate={{
                                    latitude: this.props.clockInLatitude,
                                    longitude: this.props.clockInLongitude
                                    // latitude:40.09
                                    // ,longitude:116.29
                                }}
                                icon={() => {
                                    return <Image style={{ height: iconSize, width: iconSize }} source={require('../../../images/auditselect.png')} />;
                                }}
                            >
                                <View></View>
                            </MapView.Marker>
                        ) : null}
                    {
                        // 当前位置 人的位置
                        <MapView.Marker
                            // active
                            title="我的位置"
                            // image="userlocal"
                            draggable={false}
                            // description='Hello world!'
                            coordinate={{
                                latitude: this.state.currentLocal.latitude,
                                longitude: this.state.currentLocal.longitude
                            }}
                            icon={() => {
                                return <Image style={{ height: iconSize, width: iconSize }} source={require('../../../images/userlocal.png')} />;
                            }}
                        >
                            <View></View>
                        </MapView.Marker>
                    }
                    {// 绘制厂界
                        PolylineData && (
                            <MapView.Polyline
                                width={2}
                                // color={globalcolor.headerBackgroundColor}
                                color="#439bf0"
                                coordinates={PolylineData}
                            />
                        )}
                </MapView>
            </View>
        );
    }
}

