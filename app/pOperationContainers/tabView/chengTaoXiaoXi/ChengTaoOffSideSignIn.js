import {
    Image, ImageBackground, ScrollView, Text
    , TextInput, TouchableOpacity, View
    , NativeModules, Platform
} from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker'
import MapView from 'react-native-amap3d'
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction } from '../../../utils'
import { connect } from 'react-redux'
import { Geolocation, stop } from 'react-native-amap-geolocation';
import AutoTimerText from '../../components/AutoTimerText'


const AMapPOISearch = NativeModules.AMapPOISearch;
const AMapGeolocation = NativeModules.AMapGeolocation;

@connect(({ signInModel, CTModel }) => ({
    workTypeList: signInModel.workTypeList,
    workTypeSelectedItem: signInModel.workTypeSelectedItem,
    listData: signInModel.listData,
    signInEntItem: signInModel.signInEntItem,
    remark: signInModel.remark,

    signCount: CTModel.signCount,
}))
export default class ChengTaoOffSideSignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorNum: 0,
            watchId: '',
        };
    }

    componentDidMount() {
        this.props.dispatch(
            // createAction('signInModel/getLastSingInfo')({ 
            createAction('CTModel/getTodayOffsiteSign')({
                params: {
                    SignWorkType: 61
                }
            })
        );
        this.getSurroundings();
    }
    componentWillUnmount() {
        this.stopLocation();
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
                console.log(result);
                const listData = SentencedToEmpty(result, ['assets'], [])
                let selectedEnt = {};
                selectedEnt.entName = SentencedToEmpty(listData, [0, 'title'], '');
                const provinceName = SentencedToEmpty(listData, [0, 'provinceName'], '');
                const cityName = SentencedToEmpty(listData, [0, 'cityName'], '');
                const adName = SentencedToEmpty(listData, [0, 'adName'], '');
                if (provinceName == cityName) {
                    selectedEnt.address = provinceName + adName + SentencedToEmpty(listData, [0, 'address'], '');
                } else {
                    selectedEnt.address = provinceName + cityName + adName + SentencedToEmpty(listData, [0, 'address'], '');
                }
                selectedEnt.ProviceName = provinceName;
                selectedEnt.title = SentencedToEmpty(listData, [0, 'title'], '');
                selectedEnt.latitude = Number(SentencedToEmpty(listData, [0, 'LatLon', 'Latitude'], 0));
                selectedEnt.longitude = Number(SentencedToEmpty(listData, [0, 'LatLon', 'Longitude'], 0));
                this.props.dispatch(createAction('signInModel/updateState')({
                    listStatus: 200,
                    selectedPoint: null,
                    selectedIndex: -1,
                    hasMore: true,
                    listData: listData,
                    signInEntItem: selectedEnt, // 选中的企业
                }));
            }
        );
    }

    stopLocation = () => {
        if (this.state.watchId != '') {
            Geolocation.clearWatch(this.state.watchId);
        }
        stop();
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

    clockIn = () => {
        // 非现场只有签到
        const hasSignIn = false;
        /**
         * SignIn 必传参数  longitude、latitude、SignWorkType（现场、非现场）
         * 、WorkType（工作类型）、entID、SignType（1、签到 2 签退）
         * 、Address（地址信息 现场不用传）、Remark（备注 现场不用传）
         */
        let signInParams = {};
        signInParams.longitude = SentencedToEmpty(this.props, ['signInEntItem', 'longitude'], '');
        signInParams.latitude = SentencedToEmpty(this.props, ['signInEntItem', 'latitude'], '');
        signInParams.entID = SentencedToEmpty(this.props, ['signInEntItem', 'entCode'], '');
        signInParams.workType = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
        signInParams.SignWorkType = '61'; //60  运维现场   61 非现场 
        ShowLoadingToast('签到正在提交');
        // 非现场只有签到没有签退
        signInParams.SignType = 1; // 签到
        signInParams.address = this.props.signInEntItem.address;
        signInParams.ProviceName = this.props.signInEntItem.ProviceName;
        signInParams.Position = this.props.signInEntItem.title;
        signInParams.remark = this.props.remark;

        // signInModel
        this.props.dispatch(createAction('CTModel/offsiteSign')({
            params: signInParams
            , successCallBack: () => {
                /**
                 * 非现场获取签到次数
                 * SignWorkType: 61
                 * signCount
                 */
                this.props.dispatch(
                    // createAction('signInModel/getLastSingInfo')({ 
                    createAction('CTModel/getTodayOffsiteSign')({
                        params: {
                            // entID: signInParams.entID
                            SignWorkType: 61
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

    renderSignInBtton = () => {
        const workTypeId = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
        const latitude = SentencedToEmpty(this.props, ['signInEntItem', 'latitude'], '');
        const longitude = SentencedToEmpty(this.props, ['signInEntItem', 'longitude'], '');
        if (workTypeId == ''
            || latitude == ''
            || longitude == '') {
            return (<TouchableOpacity
                style={[{ marginTop: 20 }]}
                onPress={() => {
                    if (latitude == '' || longitude == '') {
                        ShowToast('定位失败，请进入微调选择');
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
                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{'签到'}</Text>
                </ImageBackground>
            </TouchableOpacity>);
        } else {
            return (<TouchableOpacity
                style={[{ marginTop: 20 }]}
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
                    source={require('../../../images/bg_off_site_sign_in_button.png')}
                >
                    <Text style={{ fontSize: 20, color: 'white', marginBottom: 8 }}>{'签到'}</Text>
                    <AutoTimerText textStyle={{ fontSize: 17, color: 'white' }} ref={ref => (this.autoTimerText = ref)} />
                </ImageBackground>
            </TouchableOpacity>);
        }
    }

    render() {
        return (
            <ScrollView style={[{
                width: SCREEN_WIDTH, flex: 1
                , backgroundColor: '#f2f2f2'
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH
                    , alignItems: 'center'
                    , backgroundColor: '#f2f2f2'
                }]}>
                    <View style={[{
                        width: SCREEN_WIDTH
                        , alignItems: 'center', backgroundColor: 'white'
                    }]}>
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

                                defaultCode={'code2'}
                                option={{
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], ''),
                                    dataArr: SentencedToEmpty(this.props, ['workTypeList'], []),
                                    onSelectListener: item => {
                                        this.props.dispatch(createAction('signInModel/updateState')({
                                            workTypeSelectedItem: item,
                                        }));
                                    }
                                }}
                                showText={SentencedToEmpty(
                                    this.props, ['workTypeSelectedItem', 'Name'], '请选择'
                                )}
                                placeHolder='请选择'
                            />
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 100
                            , marginTop: 10, backgroundColor: 'red'
                        }]}>
                            <MapView
                                style={{ width: SCREEN_WIDTH - 40, height: 100 }}
                                ref={ref => (this.mapView = ref)}
                                // cusMap={true}
                                locationEnabled={true}
                                locationType={'follow'}
                                rotateEnabled={false}
                                zoomEnabled={false}
                                scrollEnabled={false}
                                tiltEnabled={false}
                                zoomLevel={18}
                                // coordinate={region ? { latitude: region.latitude, longitude: region.longitude } : { latitude: 41.819963, longitude: 86.888151 }}
                                // center={region ? { latitude: region.latitude, longitude: region.longitude } : { latitude: 41.819963, longitude: 86.888151 }}
                                showsCompass={false} //指南针
                                showsScale={false} //比例尺
                                showsLabels={true} //文本标签
                                showsZoomControls={false} //是否显示放大缩小按钮
                            // region={region ? region : { latitude: 41.819963, longitude: 86.888151, latitudeDelta: 8, longitudeDelta: 8 }}
                            // onStatusChangeComplete={Platform.OS == 'android' ? this.onStatusChangeComplete : this.onStatusChangeCompleteiOS}
                            // polygonsArray={polys}
                            >
                            </MapView>
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 44
                            , borderBottomColor: '#E7E7E7', borderBottomWidth: 1
                            , alignItems: 'center', flexDirection: 'row'
                        }]}>
                            <Text
                                style={[{
                                    fontSize: 14, color: '#333333'
                                    , width: 64
                                }]}
                            >{'地址：'}</Text>
                            <View style={[{
                                height: 42, flex: 1
                                , alignItems: 'center'
                                , justifyContent: 'flex-end'
                                , flexDirection: 'row'
                            }]}>
                                <Text
                                    numberOfLines={1}
                                    style={[{
                                        color: '#333333',
                                        flex: 1, marginHorizontal: 4
                                    }]}
                                >
                                    {`${SentencedToEmpty(this.props
                                        , ['signInEntItem', 'entName'], '信息获取中...')}`}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.dispatch(NavigationActions.navigate({
                                            routeName: 'SignInAddressMap', params: {}
                                        }));
                                    }}
                                >
                                    <View style={[{
                                        width: 32, height: 42
                                        , justifyContent: 'center'
                                        , alignItems: 'flex-end'
                                    }]}>
                                        <Text
                                            style={[{
                                                color: '#459EFF', fontSize: 13
                                            }]}
                                        >{'微调'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 90
                            // , borderWidth: 1
                            , flexDirection: 'row', alignItems: 'flex-start'
                            , marginBottom: 8, marginTop: 12
                        }]}>
                            <Text style={[{
                                color: '#333333', fontSize: 14
                                , marginTop: 2
                            }]}>{'备注：'}</Text>
                            <TextInput
                                style={[{
                                    flex: 1, height: 90
                                    , textAlign: 'right',
                                    textAlignVertical: 'top'
                                    , lineHeight: 18
                                    , paddingVertical: 0
                                    , marginLeft: 4
                                    , color: '#333333'
                                }]}

                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    // this.setState({ reason: text });
                                    // onChangeText(text);
                                    this.props.dispatch(createAction('signInModel/updateState')({
                                        remark: text
                                    }));
                                }}
                                multiline={true}
                                numberOfLines={5}
                                placeholder={'请填写签到备注'}
                            >{`${SentencedToEmpty(this.props, ['remark'], '')}`}</TextInput>
                        </View>
                    </View>

                    {/* 按钮的位置 */}
                    {
                        this.renderSignInBtton()
                    }
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                marginTop: 10
                            }
                        ]}
                    >
                        <Image style={[{ width: 15, height: 15, marginRight: 6 }]} source={require('../../../images/ic_ct_range_into.png')} />
                        <Text style={[{ fontSize: 11, color: '#333333' }]}>{'今日你已签到'}</Text>
                        <Text style={[{ fontSize: 11, color: '#FF4141' }]}>{`${SentencedToEmpty(this.props, ['signCount'], 0)}`}</Text>
                        <Text style={[{ fontSize: 11, color: '#333333' }]}>{'次'}</Text>
                    </View>
                </View>
            </ScrollView >
        )
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