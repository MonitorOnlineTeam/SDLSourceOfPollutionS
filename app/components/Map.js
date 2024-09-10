import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { Tag } from 'antd-mobile-rn';
import PropTypes from 'prop-types';
import { MapView, Marker } from 'react-native-amap3d';
import { init, Geolocation } from 'react-native-amap-geolocation';
import { connect } from 'react-redux';
import { ShowToast, SentencedToEmpty, NavigationActions } from '../utils';
import { SDLText } from '.';
var react_native_1 = require('react-native');
var AMapGeolocation = react_native_1.NativeModules.AMapGeolocation;

@connect(({ taskModel, taskDetailModel }) => ({
    currnetTimeCardEnterprise: taskModel.currnetTimeCardEnterprise,
    clockInLongitude: taskDetailModel.clockInLongitude,
    clockInLatitude: taskDetailModel.clockInLatitude,
    clockInStatus: taskDetailModel.clockInStatus //1 正常，2 异常
}))
class Map extends PureComponent {
    static propTypes = {
        mapType: PropTypes.String, // 地图显示类型
        markerList: PropTypes.Array, // 坐标点数据
        PolylineData: PropTypes.Array // 绘制厂界坐标数据
    };

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
                    Geolocation.clearWatch();
                }
            });
        }
        if (Platform.OS == 'android') {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                console.log('isLocationEnabled = ', isLocationEnabled);
                if (isLocationEnabled) {
                    Geolocation.getCurrentPosition(location => SentencedToEmpty(me, ['updateLocationState'], () => { })(location));
                    Geolocation.clearWatch();
                }
            });
        }
    }
    componentDidMount() {


        Geolocation.watchPosition(
            location => me.updateLocationState(location),
            error => console.log(error)
        );
    }
    updateLocationState = location => {
        //latitude: 40.110477, longitude: 116.299076
        if (this.props.currnetTimeCardEnterprise.Latitude == '' || this.props.currnetTimeCardEnterprise.Latitude == '') {

        } else if (location) {
            // location.timestamp = new Date(location.timestamp).toLocaleString();
            // console.log('location.coords = ', location.coords);
            if (SentencedToEmpty(location, ['coords', 'latitude'], '') != ''
                && SentencedToEmpty(location, ['coords', 'longitude'], '') != ''
            ) {
                this.setState({ currentLocal: location.coords });
            }
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
                <Image style={{ height: 0, width: 0 }} source={require('../images/enterpriselocal.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../images/ic_audit_invalid.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../images/auditselect.png')} />
                <Image style={{ height: 0, width: 0 }} source={require('../images/userlocal.png')} />
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
                                return <Image style={{ height: iconSize, width: iconSize }} source={require('../images/enterpriselocal.png')} />;
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
                                    return <Image style={{ height: iconSize, width: iconSize, tintColor: '#FF9912' }} source={require('../images/ic_audit_invalid.png')} />;
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
                                    return <Image style={{ height: iconSize, width: iconSize }} source={require('../images/ic_audit_invalid.png')} />;
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
                                    return <Image style={{ height: iconSize, width: iconSize }} source={require('../images/auditselect.png')} />;
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
                                return <Image style={{ height: iconSize, width: iconSize }} source={require('../images/userlocal.png')} />;
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

const styles = StyleSheet.create({});

export default Map;
