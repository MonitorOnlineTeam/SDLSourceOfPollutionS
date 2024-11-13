/*
 * @Description: 非现场签到 微调地图
 * @LastEditors: hxf
 * @Date: 2024-02-02 09:34:42
 * @LastEditTime: 2024-11-11 11:41:05
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbenchSignin/SignInAddressMap.js
 */
import {
    Image, Text, TouchableOpacity, View
    , NativeModules,
    Platform
} from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { NavigationActions, SentencedToEmpty, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import globalcolor from '../../../config/globalcolor';
import MapView from 'react-native-amap3d';
import { Geolocation, stop } from 'react-native-amap-geolocation';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { connect } from 'react-redux';

const AMapPOISearch = NativeModules.AMapPOISearch;
const AMapGeolocation = NativeModules.AMapGeolocation;

@connect(({ signInModel }) => ({
    selectedPoint: signInModel.selectedPoint,
    longitude: signInModel.longitude,
    latitude: signInModel.latitude,
}))
export default class SignInAddressMap extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '地点微调',
            // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
            headerRight: (
                <TouchableOpacity
                    style={{ width: 44, height: 40, justifyContent: 'center' }}
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    <Text style={[{ fontSize: 12, color: globalcolor.whiteFont }]}>{'确定'}</Text>
                </TouchableOpacity>
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            errorNum: 0,
            watchId: '',
            longitude: '',
            latitude: '',
            pageIndex: 1,
            listData: [],
            hasMore: true
            , selectedPoint: null
            , selectedIndex: -1
        };

        this.props.navigation.setOptions({
            headerRight: () => <TouchableOpacity
                style={{ width: 44, height: 40, justifyContent: 'center' }}
                onPress={() => {
                    console.log('navigatePress selectedPoint = ', this.props.selectedPoint)
                    let selectedEnt = {};
                    selectedEnt.entName = SentencedToEmpty(this.props, ['selectedPoint', 'title'], '');
                    selectedEnt.address = SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');

                    const provinceName = SentencedToEmpty(this.props, ['selectedPoint', 'provinceName'], '');
                    const cityName = SentencedToEmpty(this.props, ['selectedPoint', 'cityName'], '');
                    const adName = SentencedToEmpty(this.props, ['selectedPoint', 'adName'], '');
                    if (provinceName == cityName) {
                        selectedEnt.address = provinceName + adName + SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');
                    } else {
                        selectedEnt.address = provinceName + cityName + adName + SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');
                    }
                    selectedEnt.ProviceName = provinceName;
                    selectedEnt.title = SentencedToEmpty(this.props, ['selectedPoint', 'title'], '');

                    selectedEnt.latitude = Number(SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Latitude'], 0));
                    selectedEnt.longitude = Number(SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Longitude'], 0));
                    this.props.dispatch(createAction('signInModel/updateState')({
                        signInEntItem: selectedEnt, // 选中的企业
                    }));
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ fontSize: 12, color: globalcolor.whiteFont }]}>{'确定'}</Text>
            </TouchableOpacity>
        });


        // this.props.navigation.setParams({
        //     navigatePress: () => {
        //         console.log('navigatePress selectedPoint = ', this.props.selectedPoint)
        //         let selectedEnt = {};
        //         selectedEnt.entName = SentencedToEmpty(this.props, ['selectedPoint', 'title'], '');
        //         selectedEnt.address = SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');

        //         const provinceName = SentencedToEmpty(this.props, ['selectedPoint', 'provinceName'], '');
        //         const cityName = SentencedToEmpty(this.props, ['selectedPoint', 'cityName'], '');
        //         const adName = SentencedToEmpty(this.props, ['selectedPoint', 'adName'], '');
        //         if (provinceName == cityName) {
        //             selectedEnt.address = provinceName + adName + SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');
        //         } else {
        //             selectedEnt.address = provinceName + cityName + adName + SentencedToEmpty(this.props, ['selectedPoint', 'address'], '');
        //         }
        //         selectedEnt.ProviceName = provinceName;
        //         selectedEnt.title = SentencedToEmpty(this.props, ['selectedPoint', 'title'], '');

        //         selectedEnt.latitude = Number(SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Latitude'], 0));
        //         selectedEnt.longitude = Number(SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Longitude'], 0));
        //         this.props.dispatch(createAction('signInModel/updateState')({
        //             signInEntItem: selectedEnt, // 选中的企业
        //         }));
        //         this.props.dispatch(NavigationActions.back());
        //     },
        // });
    }

    componentDidMount() {
        // this.getSurroundings();
    }

    getSurroundings = async () => {
        // 开始loading

        let hasPermission = await checkPermission();
        if (!hasPermission) {
            Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
            return;
        }

        let locationResult = await this.startLocation();
        if (!locationResult.success) {
            ShowToast('定位失败,请刷新');
            return;
        }

        this.props.dispatch(createAction('signInModel/updateState')({
            longitude: locationResult.longitude,
            latitude: locationResult.latitude,
            pageIndex: 1,
            listStatus: -1
        }));
        AMapPOISearch.doSearchQuery(
            {
                keywords: '',
                longitude: locationResult.longitude,
                latitude: locationResult.latitude,
                pageIndex: 1
            },
            callback = (result) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    listStatus: 200,
                    selectedPoint: null,
                    selectedIndex: -1,
                    hasMore: true,
                    listData: SentencedToEmpty(result, ['assets'], [])
                }));
                // this.list.setListData(SentencedToEmpty(result, ['assets'], []));
            }
        );
    }



    startLocation = () => {
        // debugger
        let watchId = '';
        let _me = this;
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            _me.setState({ errorNum: 0, watchId: '' });
        }
        // console.log('开始定位');
        return new Promise((resolve, reject) => {
            watchId = Geolocation.watchPosition(
                success => {
                    // debugger
                    if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0
                        || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                        if (_me.state.errorNum >= 5) {
                            resolve({ success: false, msg: '坐标获取失败' });
                            _me.stopLocation();
                        } else {
                            _me.setState({ errorNum: _me.state.errorNum + 1 });
                        }
                    } else {
                        let resultInfo = {
                            longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                            , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                        }
                        _me.setState({ errorNum: 0 });

                        resolve({ success: true, ...resultInfo });
                        _me.stopLocation();
                    }
                },
                error => {
                    if (_me.state.errorNum >= 5) {
                        resolve({ success: false, msg: `${'定位失败'},${JSON.stringify(error)}` });
                        _me.stopLocation();
                    } else {
                        _me.setState({ errorNum: _me.state.errorNum + 1 });
                    }
                }
            );

            _me.setState({ watchId: watchId })
        });
    };

    stopLocation = () => {
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
        }
        stop();
    }



    showPiont = () => {
        const latitude = SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Latitude'], '');
        const longitude = SentencedToEmpty(this.props, ['selectedPoint', 'LatLon', 'Longitude'], '');
        let numberLatitude = Number(latitude);
        let numberLongitude = Number(longitude);
        if (latitude != ''
            && longitude != ''
        ) {
            return (<MapView.Marker
                key={`point_${'123'}`}
                onPress={() => {
                    // this.clickPoint(item.DGIMN); //点击排口 弹出pop
                }}
                infoWindowDisabled={false}
                anchor={{ x: 0.5, y: 0.5 }}
                cusBottomMargin={-10} //距离marker顶部高
                //头部50+表格行数*30+上下空间20，这俩属性安卓可能用不到，ios原生地图气泡宽高
                // cusViewHeight={popHeight}
                // cusViewWidth={305}
                coordinate={{ latitude: numberLatitude, longitude: numberLongitude }}
                icon={() => {
                    const circleSize = 18;
                    // const imageSize = 13;
                    const imageSize = 26;
                    return (<Image
                        style={{
                            width: imageSize, height: imageSize
                            , tintColor: '#FFA500'
                        }}
                        source={require('../../../images/icon_location.png')}
                    />);
                }}
            >
                {/* <MapPopContainer
                    showPollutantNum={showPollutantNum}
                    height={popHeight}
                    pointInfo={item}
                    onDismiss={() => {
                        this.mapView.destorydd();
                    }}
                /> */}
            </MapView.Marker>);
        }
    }

    render() {
        let latitude = this.props.latitude;
        let longitude = this.props.longitude;
        if (this.props.selectedPoint == null) {
            if (this.props.latitude != '') {
                latitude = Number(this.props.latitude)
            }
            if (this.props.longitude != '') {
                longitude = Number(this.props.longitude)
            }
        } else {
            if (this.props.selectedPoint.LatLon.Latitude != '') {
                latitude = Number(this.props.selectedPoint.LatLon.Latitude)
            } else if (this.props.latitude != '') {
                latitude = Number(this.props.latitude)
            }
            if (this.props.selectedPoint.LatLon.Longitude != '') {
                longitude = Number(this.props.selectedPoint.LatLon.Longitude)
            } else if (this.props.longitude != '') {
                longitude = Number(this.props.longitude)
            }
        }
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <TouchableOpacity
                    onPress={() => {
                        // SignInAddressSearchListView
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'SignInAddressSearchListView',
                        }));
                    }}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH, height: 40
                            , backgroundColor: 'white'
                            , justifyContent: 'center', alignItems: 'center'
                        }]}
                    >
                        <View
                            style={[{
                                backgroundColor: '#eeeeee', flexDirection: 'row',
                                width: SCREEN_WIDTH - 16, height: 32, alignItems: 'center'
                                , borderRadius: 8
                            }]}
                        >
                            <Image
                                source={require('../../../images/ic_search.png')}
                                style={[{ tintColor: '#999999', height: 20, width: 20, marginLeft: 8 }]}
                            />
                            <Text
                                style={[{ fontSize: 14, color: '#999999', marginLeft: 8 }]}
                            >{'搜索地点'}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
                <View
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                    }]}
                >
                    {
                        // 预加载图片，避免显示异常
                        <Image
                            style={{
                                width: 0, height: 0
                            }}
                            source={require('../../../images/icon_location.png')}
                        />
                    }
                    {latitude != '' && longitude != '' ? <MapView
                        style={{ width: SCREEN_WIDTH, flex: 1 }}
                        ref={ref => (this.mapView = ref)}
                        // cusMap={true}
                        locationEnabled={false}
                        locationType={'follow'}
                        rotateEnabled={false}
                        tiltEnabled={false}
                        zoomLevel={18}
                        coordinate={{ latitude: latitude, longitude: longitude }}
                        // center={{ latitude: 41.819963, longitude: 86.888151, }}
                        showsCompass={false} //指南针
                        showsScale={false} //比例尺
                        showsLabels={true} //文本标签
                        showsZoomControls={false} //是否显示放大缩小按钮
                    // region={region ? region : { latitude: 41.819963, longitude: 86.888151, latitudeDelta: 8, longitudeDelta: 8 }}
                    // onStatusChangeComplete={Platform.OS == 'android' ? this.onStatusChangeComplete : this.onStatusChangeCompleteiOS}
                    // polygonsArray={polys}
                    >
                        {
                            this.showPiont()
                        }
                    </MapView> : null}
                    {/* 刷新 */}
                    <TouchableOpacity
                        style={{ width: 40, height: 40, position: 'absolute', right: 13, bottom: 13, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.getSurroundings();
                        }}
                    >
                        <Image style={{ width: 20, height: 20 }} source={require('../../../images/map_refresh_option.png')} />
                    </TouchableOpacity>
                </View>
                <SignInAddressList />
            </View>
        )
    }
}

@connect(({ signInModel }) => ({
    listData: signInModel.listData,
    selectedIndex: signInModel.selectedIndex,
    hasMore: signInModel.hasMore,
    longitude: signInModel.longitude,
    latitude: signInModel.latitude,
    pageIndex: signInModel.pageIndex,
    listStatus: signInModel.listStatus,
    selectedPoint: signInModel.selectedPoint,
}))
class SignInAddressList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorNum: 0,
            watchId: '',
        };
    }

    componentDidMount() {
        this.getSurroundings();
    }

    getSurroundingsNextPage = () => {
        let pageIndex = this.props.pageIndex + 1;
        const _me = this;
        this.props.dispatch(createAction('signInModel/updateState')({
            pageIndex
        }));
        AMapPOISearch.doSearchQuery(
            {
                keywords: '',
                longitude: _me.props.longitude,
                latitude: _me.props.latitude,
                pageIndex: pageIndex
            },
            callback = (result) => {
                if (result.errorCode == 0) {

                    this.props.dispatch(createAction('signInModel/updateState')({
                        hasMore: false
                        , listData: _me.props.listData
                        , selectedPoint: null
                        , selectedIndex: -1
                    }));
                    this.list.setListData(_me.props.listData);
                } else {
                    const oldData = _me.props.listData;
                    const newData = SentencedToEmpty(result, ['assets'], []);
                    this.props.dispatch(createAction('signInModel/updateState')({
                        listData: oldData.concat(newData)
                        , selectedPoint: null
                        , selectedIndex: -1
                    }));
                    this.list.setListData(oldData.concat(newData));
                }
            }
        );
    }

    getSurroundings = async () => {
        // 开始loading

        let hasPermission = await checkPermission();
        if (!hasPermission) {
            Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
            return;
        }

        let locationResult = await this.startLocation();
        if (!locationResult.success) {
            ShowToast('定位失败,请刷新');
            return;
        }
        //     latitude: locationResult.latitude,
        //     pageIndex: 1
        // });
        this.props.dispatch(createAction('signInModel/updateState')({
            longitude: locationResult.longitude,
            latitude: locationResult.latitude,
            pageIndex: 1,
            listStatus: -1
        }));
        AMapPOISearch.doSearchQuery(
            {
                keywords: '',
                longitude: locationResult.longitude,
                latitude: locationResult.latitude,
                pageIndex: 1
            },
            callback = (result) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    listStatus: 200,
                    selectedPoint: null,
                    selectedIndex: -1,
                    hasMore: true,
                    listData: SentencedToEmpty(result, ['assets'], [])
                }));
                this.list.setListData(SentencedToEmpty(result, ['assets'], []));
            }
        );
    }
    startLocation = () => {
        // debugger
        let watchId = '';
        let _me = this;
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
            _me.setState({ errorNum: 0, watchId: '' });
        }
        // console.log('开始定位');
        return new Promise((resolve, reject) => {
            watchId = Geolocation.watchPosition(
                success => {
                    // debugger
                    if (SentencedToEmpty(success, ['coords', 'longitude'], 0) == 0
                        || SentencedToEmpty(success, ['coords', 'latitude'], 0) == 0) {
                        if (_me.state.errorNum >= 5) {
                            resolve({ success: false, msg: '坐标获取失败' });
                            _me.stopLocation();
                        } else {
                            _me.setState({ errorNum: _me.state.errorNum + 1 });
                        }
                    } else {
                        let resultInfo = {
                            longitude: SentencedToEmpty(success, ['coords', 'longitude'], 0)
                            , latitude: SentencedToEmpty(success, ['coords', 'latitude'], 0)
                        }
                        _me.setState({ errorNum: 0 });

                        resolve({ success: true, ...resultInfo });
                        _me.stopLocation();
                    }
                },
                error => {
                    if (_me.state.errorNum >= 5) {
                        resolve({ success: false, msg: `${'定位失败'},${JSON.stringify(error)}` });
                        _me.stopLocation();
                    } else {
                        _me.setState({ errorNum: _me.state.errorNum + 1 });
                    }
                }
            );

            _me.setState({ watchId: watchId })
        });
    };

    stopLocation = () => {
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
        }
        stop();
    }

    renderItem = ({ item, index }) => {
        return (<TouchableOpacity
            onPress={() => {
                // this.setState({
                //     selectedPoint: item,
                //     selectedIndex: index
                // });
                this.props.dispatch(createAction('signInModel/updateState')({
                    selectedPoint: item,
                    selectedIndex: index
                }));
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 60
                    , borderBottomWidth: 1, borderBottomColor: '#eee'
                    , borderTopWidth: 1, borderTopColor: index == 0 ? '#eee' : 'white'
                    , backgroundColor: 'white'
                    , alignItems: 'center'
                    , flexDirection: 'row'
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 72, height: 60
                        , justifyContent: 'center', marginLeft: 12
                    }]}
                >
                    <Text numberOfLines={1}
                        style={[{ fontSize: 15, color: '#333333', marginLeft: 10 }]}
                    >{SentencedToEmpty(item, ['title'], '---')}</Text>
                    <Text numberOfLines={1}
                        style={[{ marginTop: 4, fontSize: 10, color: '#999999', marginLeft: 10 }]}
                    >{SentencedToEmpty(item, ['address'], '---')}</Text>
                </View>
                {
                    SentencedToEmpty(this.props, ['selectedIndex'], -1) == index
                        ? <Image
                            style={[{
                                width: 24, height: 24, marginLeft: 12
                            }]}
                            source={require('../../../images/fuhetongguo.png')}
                        /> : null
                }
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH, flex: 2, backgroundColor: 'white'
            }]}
        >
            <StatusPage
                backRef={true}
                status={this.props.listStatus}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.getSurroundings();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.getSurroundings();
                }}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        return this.props.hasMore;
                    }}
                    onRefresh={index => {
                        this.getSurroundings();
                    }}
                    onEndReached={index => {
                        this.getSurroundingsNextPage();
                    }}
                    renderItem={this.renderItem}
                    data={this.props.listData}
                />
            </StatusPage>
        </View>);
    }
}

const checkPermission = async () => {
    return new Promise((resolve, reject) => {
        if (Platform.OS == 'ios') {
            AMapGeolocation.RNTransferIOSWithCallBack(data => {
                if (data == 'false') {
                    // Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                    reject(false);
                } else {
                    // let watchId = this.startLocation();
                    // this.setState({ watchId });
                    resolve(true);
                }
            });
        } else {
            let data = AMapGeolocation.RNTransferIsLocationEnabled();
            data.then(function (a) {
                let isLocationEnabled = SentencedToEmpty(a, ['isLocationEnabled'], false);
                if (isLocationEnabled) {
                    // let watchId = _me.startLocation();
                    // _me.setState({ watchId });
                    resolve(true);
                } else {
                    reject(false);
                    // Alert.alert('提示', '无法获取您的位置，请检查您是否开启定位权限');
                }
            });
        }
    });
}