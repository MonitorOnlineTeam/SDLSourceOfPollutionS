import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Platform, Linking, NativeModules, ImageBackground, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ReactNativeUniappModule } from 'react-native-uniapp'

import { ModalParent } from '../..';
import { createAction, NavigationActions, ShowToast, SentencedToEmpty } from '../../../utils';
import { getEncryptData, getPasswordMobx, getToken, loadStorage } from '../../../dvapack/storage';
import { VersionInfo } from '../../../config/globalconst';
import { Touchable } from '../../../components';
import { AccountConfig, UrlInfo, CURRENT_PROJECT } from '../../../config/globalconst';
import color from '../../../config/globalcolor';
// import UpdateModal from '../login/UpdateModal';

import { jumpSystem } from 'react-native-alipush';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 *个人中心
 */
@connect(({ app, provisioning, account }) => ({
    accountOptionList: account.accountOptionList,
    appIndexInfoConfig: app.appIndexInfoConfig,
    personalCenterOrderResult: provisioning.personalCenterOrderResult
}))
class Account extends PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            DownLoadPath: '',
            IOSDownLoadPath: '',
            UpdateContent: '',
            imageHeight: 0,
            imageWidth: 0
        };
    }
    componentDidMount() {
        if (this.props.appIndexInfoConfig != null) {
            Image.getSize(UrlInfo.BaseUrl + this.props.appIndexInfoConfig.LogoURL, (width, height) => {
                this.setState({ imageHeight: height / 2, imageWidth: width / 2 });
            });
        }

        this.props.dispatch(createAction('provisioning/getPersonalCenterOrder')({}));
        // this.props.dispatch(createAction('provisioning/getPersonalCenterOrderInfo')({}));
    }
    render() {
        console.log('SCREEN_WIDTH = ', SCREEN_WIDTH);
        console.log('AccountConfig = ', AccountConfig);
        return (
            <ScrollView style={styles.container}>
                {/*头像 用户名 联系方式等信息*/}
                {/* <View style={{ width: SCREEN_WIDTH, height: 180, flexDirection: 'column', backgroundColor: color.headerBackgroundColor, alignItems: 'center', marginBottom: 10 }}>
                    <Touchable>
                        <Image source={{ uri: 'http://172.16.9.13:5012/api/transfer/get?Router=upload/gg.png' }} style={{ width: 70, height: 70, marginTop: 38, borderRadius: 35, alignSelf: 'center' }} />
                        <Image source={require('../../../images/userlogo.png')} style={{ width: 70, height: 70, marginTop: 38, borderRadius: 35, alignSelf: 'center' }} />
                    </Touchable>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 6, alignSelf: 'center' }}>{getToken().User_Name}</Text>
                </View> */}
                {/* , alignSelf: 'center' */}
                {/* <View style={{height:40,width:SCREEN_WIDTH,backgroundColor:'#4aa0ff'}}></View> */}
                <ImageBackground source={require('../../../images/bg_new_account_header.png')} style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH * 0.82) }}>
                    <View style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.35, flexDirection: 'row' }}>
                        <Image source={require('../../../images/userlogo.png')} style={{ width: 58, height: 58, marginTop: 36, marginLeft: 15, borderRadius: 29 }} />
                        <View style={{ marginLeft: 10, marginTop: 45 }}>
                            <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: 'bold' }}>{getToken().UserName}</Text>
                            <Text style={{ color: '#ffffff', fontSize: 12, marginTop: 5 }}>{`最近点位服务到期：${SentencedToEmpty(this.props
                                , ['personalCenterOrderResult', 'data', 'Datas', 'ExpirationDate'], '----')}`}</Text>
                            <Text style={{ color: '#ffffff', fontSize: 12, marginTop: 4 }}>{`服务过期点位数量：${SentencedToEmpty(this.props
                                , ['personalCenterOrderResult', 'data', 'Datas', 'ExpirationNum'], '0')}`}</Text>
                            <TouchableOpacity style={{ marginTop: 4 }}
                                onPress={() => {
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'ProvisioningOfAllPoints'
                                    }))
                                }}
                            >
                                <View style={{
                                    width: 83, height: 20, borderRadius: 8
                                    , backgroundColor: '#1578C6', flexDirection: 'row', justifyContent: 'center'
                                    , justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image source={require('../../../images/ic_location_blue.png')} style={{ width: 9, height: 13 }} />
                                    <Text style={{ color: '#ffffff', fontSize: 11, marginLeft: 5 }}>{`全部点位 >`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{ width: SCREEN_WIDTH, height: ((AccountConfig.length * 48)) }}></View>
                <View style={{
                    position: 'absolute', width: SCREEN_WIDTH, top: (SCREEN_WIDTH * 0.35 + 40)
                    , height: SCREEN_WIDTH, left: 0
                }}>
                    {/* {AccountConfig.map((item, index) => { */}
                    {
                        this.props.accountOptionList.map((item, index) => {
                            return (
                                <Touchable
                                    key={index.toString()}
                                    style={{ marginLeft: 12, marginBottom: 8 }}
                                    onPress={() => {
                                        this.clickItem(item);
                                    }}
                                >
                                    <View style={styles.usertype}>
                                        <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, flex: 1 }}>{item.title}</Text>
                                        <Image source={require('../../../images/right.png')} style={{ width: 16, height: 16, marginRight: 20 }} />
                                    </View>
                                </Touchable>
                            );
                        })
                    }
                </View >
                {
                    this.props.appIndexInfoConfig != null ? (
                        <View>
                            <Image source={{ uri: UrlInfo.BaseUrl + this.props.appIndexInfoConfig.LogoURL }} style={{ marginTop: 52, alignSelf: 'center', width: this.state.imageWidth, height: this.state.imageHeight }} />
                            <Text style={{ fontSize: 12, marginTop: 32, alignSelf: 'center', textAlign: 'center', color: '#666' }}> {this.props.appIndexInfoConfig.AppName}</Text>
                            <Text style={{ fontSize: 11, marginTop: 15, alignSelf: 'center', textAlign: 'center', color: '#666' }}>{'Version ' + VersionInfo.app_version_name}</Text>
                            <Text style={{ fontSize: 15, marginTop: 15, alignSelf: 'center', textAlign: 'center', color: '#666' }}>{this.props.appIndexInfoConfig.CompanyName}</Text>
                        </View>
                    ) : null
                }

                {/* <ModalParent ref="updateAlert" DownLoadPath={Platform.OS == 'ios' ? this.state.IOSDownLoadPath : this.state.DownLoadPath} UpdateContent={this.state.UpdateContent} /> */}
                {/*<UpdateModal />*/}
                <ModalParent ref="updateAlert" DownLoadPath={Platform.OS == 'ios' ? this.state.IOSDownLoadPath : this.state.DownLoadPath} UpdateContent={this.state.UpdateContent} />
            </ScrollView >
        );
    }

    clickItem = ({ routeName, params }) => {
        if (routeName == 'wxPushBinding') {
            if (Platform.OS == 'android') {
                let encryData = getEncryptData();
                const password = getPasswordMobx();
                const user = getToken();
                ReactNativeUniappModule.startUniPage({
                    token: 'Bearer ' + user.dataAnalyzeTicket,
                    proxyCode: encryData + '',
                    userAccount: user.UserAccount,
                    userPwd: password,
                    department: '污染源技术服务部',
                    UserId: user.UserId,
                });
            }
        } else if (routeName == 'update') {
            this._checkUpdate();
        } else if (routeName == 'logout') {
            console.log('clickItem logout');
            this.props.dispatch(createAction('login/logout')());
        } else if (routeName == 'pushSetting') {
            if (Platform.OS == 'ios') {
                jumpSystem();
            } else {
                this.props.dispatch(NavigationActions.navigate({ routeName: 'pushSetting' }));
            }
        } else {
            this.props.dispatch(NavigationActions.navigate({ routeName: routeName, params: params }));
        }
    };

    //版本更新
    _checkUpdate = () => {
        // 手写全量更新
        this.props.dispatch(
            createAction('baseModel/chechUpdate')({
                successCallback: result => {
                    this.setState({ IOSDownLoadPath: result.data.IOSDownLoadPath, DownLoadPath: result.data.DownLoadPath, UpdateContent: result.data.UpdateContent });
                    if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
                        if (Platform.OS == 'ios') {
                            if (VersionInfo.app_version_code != result.data.IOSVersionCode) {
                                this.refs.updateAlert.showModal();
                            } else {
                                ShowToast('已经是最新版本');
                                //                        this.setState({ syncMessage: '已经是最新版本' });
                            }
                        } else {
                            if (VersionInfo.app_version_code != result.data.VersionCode) {
                                this.refs.updateAlert.showModal();
                            } else {
                                ShowToast('已经是最新版本');
                                // this.setState({ syncMessage: '已经是最新版本' });
                            }
                        }
                    } else {
                        if (Platform.OS == 'ios') {
                            if (VersionInfo.app_version_code < result.data.IOSVersionCode) {
                                this.refs.updateAlert.showModal();
                            } else {
                                ShowToast('已经是最新版本');
                                //                        this.setState({ syncMessage: '已经是最新版本' });
                            }
                        } else {
                            if (VersionInfo.app_version_code < result.data.VersionCode) {
                                this.refs.updateAlert.showModal();
                            } else {
                                ShowToast('已经是最新版本');
                                // this.setState({ syncMessage: '已经是最新版本' });
                            }
                        }
                    }
                },
                failureCallback: reason => {
                    //                this.setState({ syncMessage: reason });
                }
            })
        );
    };
    // _checkUpdate = () => {
    //     // 手写全量更新
    //     this.props.dispatch(
    //         createAction('baseModel/chechUpdate')({
    //             needToast: true
    //             // successCallback: result => {
    //             //     this.setState({ IOSDownLoadPath: result.data.IOSDownLoadPath, DownLoadPath: result.data.DownLoadPath, UpdateContent: result.data.UpdateContent });
    //             //     if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
    //             //         if (Platform.OS == 'ios') {
    //             //             if (VersionInfo.app_version_code != result.data.IOSVersionCode) {
    //             //                 this.refs.updateAlert.showModal();
    //             //             } else {
    //             //                 ShowToast('已经是最新版本');
    //             //                 //                        this.setState({ syncMessage: '已经是最新版本' });
    //             //             }
    //             //         } else {
    //             //             if (VersionInfo.app_version_code != result.data.VersionCode) {
    //             //                 this.refs.updateAlert.showModal();
    //             //             } else {
    //             //                 ShowToast('已经是最新版本');
    //             //                 // this.setState({ syncMessage: '已经是最新版本' });
    //             //             }
    //             //         }
    //             //     } else {
    //             //         if (Platform.OS == 'ios') {
    //             //             if (VersionInfo.app_version_code < result.data.IOSVersionCode) {
    //             //                 this.refs.updateAlert.showModal();
    //             //             } else {
    //             //                 ShowToast('已经是最新版本');
    //             //                 //                        this.setState({ syncMessage: '已经是最新版本' });
    //             //             }
    //             //         } else {
    //             //             if (VersionInfo.app_version_code < result.data.VersionCode) {
    //             //                 this.refs.updateAlert.showModal();
    //             //             } else {
    //             //                 ShowToast('已经是最新版本');
    //             //                 // this.setState({ syncMessage: '已经是最新版本' });
    //             //             }
    //             //         }
    //             //     }
    //             // },
    //             // failureCallback: reason => {
    //             //     //                this.setState({ syncMessage: reason });
    //             // }
    //         })
    //     );
    // };
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    usertype: {
        flexDirection: 'row',
        borderRadius: 10,
        width: SCREEN_WIDTH - 24,
        backgroundColor: '#ffffff',
        height: 40,
        alignItems: 'center'
    },
    icon: {
        width: 32,
        height: 32
    }
});

//make this component available to the app
export default Account;
