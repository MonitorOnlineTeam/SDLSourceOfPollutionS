import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Platform, Linking, NativeModules } from 'react-native';
import { connect } from 'react-redux';
import { ModalParent } from '../..';
import { createAction, NavigationActions, ShowToast } from '../../../utils';
import { getEncryptData, getPasswordMobx, getToken, loadStorage } from '../../../dvapack/storage';
import { VersionInfo } from '../../../config/globalconst';
import { Touchable } from '../../../components';
import { AccountConfig, UrlInfo, CURRENT_PROJECT } from '../../../config/globalconst';
import color from '../../../config/globalcolor';
// import { jumpSystem } from 'react-native-alipush';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// import { ReactNativeUniappModule } from 'react-native-uniapp'
/**
 *个人中心
 */
@connect(({ app }) => ({
    appIndexInfoConfig: app.appIndexInfoConfig
}))
class Account extends PureComponent {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            encryData: '',
            Ticket: '',
            DownLoadPath: '',
            IOSDownLoadPath: '',
            UpdateContent: '',
            imageHeight: 0,
            imageWidth: 0,
            showTool: false
        };
    }
    async componentDidMount() {
        if (this.props.appIndexInfoConfig != null) {
            Image.getSize(UrlInfo.BaseUrl + this.props.appIndexInfoConfig.LogoURL, (width, height) => {
                this.setState({ imageHeight: height / 2, imageWidth: width / 2 });
            });
        }
        let encryData = await getEncryptData();
        const user = getToken();
        this.setState({
            encryData,
            Ticket: user.Ticket
        });
    }
    render() {
        const {
            RNRequestMonitor = {
                showWindow: () => {
                },
                hideWindow: () => {
                },
                addRecord: (strData) => {
                },
                addRecordData: (data) => {
                }
            }
        } = NativeModules;
        // console.log('Bearer ' + this.state.encryData + '$' + this.state.Ticket);
        return (
            <ScrollView style={styles.container}>
                {/*头像 用户名 联系方式等信息*/}
                <View style={{ width: SCREEN_WIDTH, height: 180, flexDirection: 'column', backgroundColor: color.headerBackgroundColor, alignItems: 'center', marginBottom: 10 }}>
                    <Touchable
                        onPress={() => {
                            if (Platform.OS == 'android') {
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'OfflineImageUploadTest',
                                        params: {

                                        }
                                    }))
                            }
                        }}
                    >
                        <Image source={require('../../../images/userlogo.png')} style={{ width: 70, height: 70, marginTop: 38, borderRadius: 35, alignSelf: 'center' }} />
                    </Touchable>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 6, alignSelf: 'center' }}>{getToken().UserName}</Text>
                </View>

                {AccountConfig.map((item, index) => {
                    let views = [];
                    views.push(
                        <Touchable
                            key={index.toString()}
                            style={{ backgroundColor: '#fff' }}
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
                    views.push(<Text key={`_${index}`} style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />);
                    return views;
                })}
                {this.props.appIndexInfoConfig != null ? (
                    <View>
                        <Image source={{ uri: UrlInfo.BaseUrl + this.props.appIndexInfoConfig.LogoURL }} style={{ marginTop: 52, alignSelf: 'center', width: this.state.imageWidth, height: this.state.imageHeight }} />
                        <Text style={{ fontSize: 12, marginTop: 32, alignSelf: 'center', textAlign: 'center', color: '#666' }}> {this.props.appIndexInfoConfig.AppName}</Text>
                        <Text style={{ fontSize: 11, marginTop: 15, alignSelf: 'center', textAlign: 'center', color: '#666' }}>{'Version ' + VersionInfo.app_version_name}</Text>
                        <Text style={{ fontSize: 15, marginTop: 15, alignSelf: 'center', textAlign: 'center', color: '#666' }}>{this.props.appIndexInfoConfig.CompanyName}</Text>
                    </View>
                ) : null}

                {/* <ModalParent ref="updateAlert" DownLoadPath={Platform.OS == 'ios' ? this.state.IOSDownLoadPath : this.state.DownLoadPath} UpdateContent={this.state.UpdateContent} /> */}
            </ScrollView>
        );
    }

    clickItem = ({ routeName, params }) => {
        if (routeName == 'wxPushBinding') {
            if (Platform.OS == 'android') {
                let encryData = getEncryptData();
                const password = getPasswordMobx();
                const user = getToken();
                // ReactNativeUniappModule.startUniPage({
                //     token: 'Bearer ' + user.dataAnalyzeTicket,
                //     proxyCode: encryData + '',
                //     userAccount: user.UserAccount,
                //     userPwd: password,
                //     department: '污染源技术服务部',
                //     UserId: user.UserId,
                // });
            }
        } else if (routeName == 'update') {
            this._checkUpdate();
        } else if (routeName == 'logout') {
            console.log('clickItem logout');
            this.props.dispatch(createAction('login/logout')());
        } else if (routeName == 'pushSetting') {
            if (Platform.OS == 'ios') {
                console.log('ios 插件未添加');
                // jumpSystem();
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
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7e7e7'
    },
    usertype: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        borderBottomColor: '#fefefe',
        borderBottomWidth: 1,
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
