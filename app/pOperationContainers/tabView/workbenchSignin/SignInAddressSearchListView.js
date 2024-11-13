import {
    Image, Text, TouchableOpacity, View
    , NativeModules,
    Platform,
    StyleSheet,
    TextInput,
    Touchable
} from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { NavigationActions, SentencedToEmpty, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { Geolocation, stop } from 'react-native-amap-geolocation';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';

const AMapPOISearch = NativeModules.AMapPOISearch;
const AMapGeolocation = NativeModules.AMapGeolocation;

@connect(({ signInModel }) => ({
    listData: signInModel.listData,
    selectedIndex: signInModel.selectedIndex,
    hasMore: signInModel.hasMore,
    longitude: signInModel.longitude,
    latitude: signInModel.latitude,
    pageIndex: signInModel.pageIndex,
    listStatus: signInModel.listStatus
}))
export default class SignInAddressSearchListView extends Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            keywords: '',
            errorNum: 0,
            watchId: '',
        };
    }

    componentDidMount() {
        this.getSurroundings();
    }

    componentWillUnmount() {

    }

    getSurroundingsNextPage = () => {
        console.log('getSurroundingsNextPage');
        let pageIndex = this.props.pageIndex + 1;
        const _me = this;
        this.props.dispatch(createAction('signInModel/updateState')({
            pageIndex
        }));
        AMapPOISearch.doSearchQuery(
            {
                keywords: this.state.keywords,
                longitude: _me.props.longitude,
                latitude: _me.props.latitude,
                pageIndex: pageIndex
            },
            callback = (result) => {
                if (result.errorCode == 0) {
                    // _me.setState({
                    //     hasMore: false
                    //     , listData: _me.state.listData
                    //     , selectedPoint: null
                    //     , selectedIndex: -1
                    // });
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
                    // this.setState({
                    //     listData: oldData.concat(newData)
                    //     , selectedPoint: null
                    //     , selectedIndex: -1
                    // });
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
        // this.setState({
        //     longitude: locationResult.longitude,
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
                keywords: this.state.keywords,
                longitude: locationResult.longitude,
                latitude: locationResult.latitude,
                pageIndex: 1
            },
            callback = (result) => {
                // this.setState({
                //     selectedPoint: null,
                //     selectedIndex: -1,
                //     hasMore: true,
                //     listData: SentencedToEmpty(result, ['assets'], [])
                // });
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
                this.props.dispatch(createAction('signInModel/updateState')({
                    pageIndex: 1,
                    listStatus: 200,
                    selectedPoint: item,
                    selectedIndex: 0,
                    // selectedIndex: index,
                    hasMore: true,
                    listData: [item],
                    hasMore: false
                }));
                this.props.dispatch(NavigationActions.back());
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 48
                    , borderBottomWidth: 1, borderBottomColor: '#eee'
                    , borderTopWidth: 1, borderTopColor: index == 0 ? '#eee' : 'white'
                    , backgroundColor: 'white'
                    , alignItems: 'center'
                    , flexDirection: 'row'
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 72, height: 48
                        , justifyContent: 'center', marginLeft: 12
                    }]}
                >
                    <Text numberOfLines={1}
                        style={[{ fontSize: 14, color: '#333', marginLeft: 10 }]}
                    >{SentencedToEmpty(item, ['title'], '---')}</Text>
                    <Text numberOfLines={1}
                        style={[{ marginTop: 4, fontSize: 12, color: '#333', marginLeft: 10 }]}
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

    dismissSearch = () => {
        this.setState({ keywords: '' });
        // this.props.dispatch(createAction('map/dismissSearch')({}));
        AMapPOISearch.doSearchQuery(
            {
                keywords: '',
                longitude: this.props.longitude,
                latitude: this.props.latitude,
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
    };
    searchKey = () => {
        console.log('searchKey');
        this.props.dispatch(createAction('signInModel/updateState')({
            pageIndex: 1
        }));
        AMapPOISearch.doSearchQuery(
            {
                keywords: this.state.keywords,
                longitude: this.props.longitude,
                latitude: this.props.latitude,
                pageIndex: 1
            },
            callback = (result) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    listStatus: 200,
                    selectedPoint: null,
                    selectedIndex: -1,
                    hasMore: SentencedToEmpty(result, ['assets'], []).length < SentencedToEmpty(result, ['count'], 0),
                    listData: SentencedToEmpty(result, ['assets'], [])
                }));
                this.list.setListData(SentencedToEmpty(result, ['assets'], []));
            }
        );
    }

    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH, flex: 1, backgroundColor: 'white'
            }]}
        >
            <View style={styles.searchBar}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('signInModel/updateState')({
                            pageIndex: 1,
                            listStatus: -1,
                        }));
                        this.props.dispatch(NavigationActions.back());
                        AMapPOISearch.doSearchQuery(
                            {
                                keywords: '',
                                longitude: this.props.longitude,
                                latitude: this.props.latitude,
                                pageIndex: 1
                            },
                            callback = (result) => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    listStatus: 200,
                                    selectedPoint: null,
                                    selectedIndex: -1,
                                    hasMore: SentencedToEmpty(result, ['assets'], []).length < SentencedToEmpty(result, ['count'], 0),
                                    listData: SentencedToEmpty(result, ['assets'], [])
                                }));
                            }
                        );
                    }}
                >
                    <Image
                        resizeMethod={'resize'}
                        resizeMode={'contain'}
                        style={{ tintColor: 'white', width: 24, height: 24, marginLeft: 10, marginTop: 26 }}
                        source={Platform.OS == 'android'
                            // source={Platform.OS == 'ios'
                            ? require('../../../images/back-icon-android.png')
                            : require('../../../images/back-icon-ios.png')}
                    />
                </TouchableOpacity>
                {/* <View style={{ width: SCREEN_WIDTH * 0.14, height: 22, marginTop: 28 }} /> */}
                <View style={styles.search}>
                    <Image style={{ width: 17, height: 17, marginLeft: 5, marginTop: 5 }} source={require('../../../images/ic_datacheck.png')} />

                    <TextInput
                        returnKeyType="search"
                        // returnKeyType="default"
                        ref={ref => (this.searchInput = ref)}
                        onEndEditing={this.searchKey}
                        onChangeText={text => {
                            console.log('text', text);
                            // 动态更新组件内State记录用户名
                            this.setState({
                                keywords: `${text}`
                            });
                        }}
                        value={this.state.keywords}
                        style={{ color: '#333333', marginLeft: 8, textAlign: 'left', flex: 1, height: 30, paddingVertical: 0 }}
                        underlineColorAndroid="transparent"
                        placeholder="请输入点位名称"
                        placeholderTextColor={'#999999'}
                    />
                    {this.state.keywords != '' ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.dismissSearch();
                            }}
                            style={{ width: 32, height: 30, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Image style={{ width: 18, height: 18, tintColor: '#9a9a9a' }} source={require('../../../images/clear.png')} />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <Text
                    onPress={() => {
                        console.log('搜索 onPress');
                        this.props.dispatch(createAction('signInModel/updateState')({
                            pageIndex: 1
                        }));
                        AMapPOISearch.doSearchQuery(
                            {
                                keywords: this.state.keywords,
                                longitude: this.props.longitude,
                                latitude: this.props.latitude,
                                pageIndex: 1
                            },
                            callback = (result) => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    listStatus: 200,
                                    selectedPoint: null,
                                    selectedIndex: -1,
                                    hasMore: SentencedToEmpty(result, ['assets'], []).length < SentencedToEmpty(result, ['count'], 0),
                                    listData: SentencedToEmpty(result, ['assets'], [])
                                }));
                                this.list.setListData(SentencedToEmpty(result, ['assets'], []));
                            }
                        );
                    }}
                    style={{ fontSize: 14, color: '#fff', justifyContent: 'center', marginTop: 30, marginLeft: 10, marginRight: 13 }}
                >
                    搜索
                </Text>
            </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    searchImg: {
        width: 17,
        height: 17
    },
    searchBar: {
        height: 64,
        justifyContent: 'space-between',
        backgroundColor: globalcolor.headerBackgroundColor,
        flexDirection: 'row'
    },
    search: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 30,
        borderColor: '#ccc',
        borderRadius: 5,
        borderWidth: 1,
        marginTop: 24,
        paddingLeft: 5,
        width: SCREEN_WIDTH * 0.7
    },
    head: {
        backgroundColor: '#5688f6'
    },
    searchBtn: {
        position: 'absolute',
        top: 13,
        left: 24,
        width: 17,
        height: 17
    }
});