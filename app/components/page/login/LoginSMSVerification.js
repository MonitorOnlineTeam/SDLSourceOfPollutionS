import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Platform, Keyboard, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import { createAction, NavigationActions, SentencedToEmpty, isIphoneX, ShowToast, StackActions } from '../../../utils';
import { SCREEN_WIDTH, WINDOW_HEIGHT } from '../../../config/globalsize';
import { VersionInfo, CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, POLLUTION_PROJECT, UrlInfo } from '../../../config/globalconst';
import globalcolor from '../../../config/globalcolor';
import { saveStorage, loadStorage, getToken, getRootUrl, clearRootUrl, getEncryptData, loadRootUrl, clearEncryptData } from '../../../dvapack/storage';
import { LoginImage } from '../../../config/globalconst';
import { SDLText, ModalParent } from '../..';
import Orientation from 'react-native-orientation';
import CountdownText from './CountdownText';

/**
 * 等保 双重认证 登录
 */
const operationsStaff = 1;
@connect(({ login, baseModel }) => ({
    loginData: login.loginData,
    ProjectName: login.ProjectName,
    IsAgree: login.IsAgree,
    maintain: baseModel.maintain,
    maintenanceResult: baseModel.maintenanceResult,
}))
class Login extends Component {
    /**
     * 构造方法
     */
    constructor(props) {
        super(props);
        let urlConfig = getRootUrl();
        this.state = {
            startDelay: false,
            imageState: true,
            ForcedUpdate: false,
            DownLoadPath: '',
            IOSDownLoadPath: '',
            UpdateContent: '',
            User_Account: '',
            User_Pwd: '',
            VerificationStatus: '1',
            verification: '',
            loadingState: false,
            isremenber: false,
            contentHeight: 0,
            selectedCompanyIndex: -1,
            userRule: 0,
            logoImage: LoginImage
        };
        this.contentHeight = 0;
    }

    static navigationOptions = {
        header: null,
        title: '',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 0 }
    };


    async componentDidMount() {
        this.loadNativeConfig();
        Orientation.lockToPortrait();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

        const loginmsg = await loadStorage('loginmsg');
        const userRule = await loadStorage('userRule');

        if (loginmsg != null) {
            this.setState(loginmsg);
            this.setState({ userRule });
        } else {
            this.setState({ userRule });
        }
        this._checkUpdate();
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();
        let urlConfig = getRootUrl();
        this.setState({
            logoImage:
                (CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') && urlConfig && urlConfig.Logo ? { uri: `${rootUrl.ReactUrl}/upload/${urlConfig['Logo']}` } : LoginImage
            // (CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') && urlConfig && urlConfig.Logo ? { uri: `${UrlInfo.ImageUrl + urlConfig['Logo']}`,headers:{ ProxyCode: encryData} } : LoginImage
            // (CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT') && urlConfig && urlConfig.Logo ? { uri: `${UrlInfo.ImageUrl + urlConfig['Logo']}/Attachment?code=${encryData}` } : LoginImage
        });
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    _keyboardDidShow() { }

    _keyboardDidHide() {
        Keyboard.dismiss();
    }

    /**
     * 调整界面高度
     */
    scrollViewLayout = event => {
        if (Platform.OS === 'ios') {
            this.setState({ contentHeight: WINDOW_HEIGHT - 64 });
        } else if (this.state.contentHeight == 0) {
            this.setState({ contentHeight: event.nativeEvent.layout.height });
        }
    };

    /**
     * 登录方法
     */
    login = async () => {
        const ProxyCode = getEncryptData();
        const username = this.userNameInput.props.value;
        const password = this.passWordInput.props.value;
        if (username == '') {
            ShowToast('账号不能为空');
            return;
        }
        if (password == '') {
            ShowToast('密码不能为空');
            return;
        }
        if (ProxyCode == '61002' || ProxyCode == '61000') {
            if (this.props.IsAgree) {
                let versionCode = '';
                if (Platform.OS == 'android') {
                    versionCode = SentencedToEmpty(this.props, ['maintenanceResult', 'data', 'VersionCode'], '');
                } else {
                    versionCode = SentencedToEmpty(this.props, ['maintenanceResult', 'data', 'IOSVersionCode'], '');
                }
                if (versionCode <= VersionInfo.app_version_code
                    || versionCode == '') {
                    if (this.state.VerificationStatus
                        && this.state.verification == ''
                    ) {
                        ShowToast('验证码不能为空');
                        return;
                    }
                    let params = {
                        User_Account: username,
                        User_Pwd: password,
                        // 判断当前客户端是否为最新客户端
                        IsLastest: versionCode <= VersionInfo.app_version_code || versionCode == '',
                        LoginDevice: Platform.OS == 'android' ? 'Android' : 'iOS',
                        dispatch: this.props.dispatch,
                    }
                    if (this.state.VerificationStatus) {
                        params.VerificationStatus = 1;// 需要验证码
                        params.VerificationCode = this.state.verification; // 验证码
                    }
                    this.props.dispatch(
                        createAction('login/login')(params)
                    );
                } else {
                    ShowToast('当前不是最新版App，请更新后使用！')
                }
            } else {
                ShowToast('请勾选阅读并接受用户监测数据许可协议')
            }
        } else {
            let versionCode = '';
            if (Platform.OS == 'android') {
                versionCode = SentencedToEmpty(this.props, ['maintenanceResult', 'data', 'VersionCode'], '');
            } else {
                versionCode = SentencedToEmpty(this.props, ['maintenanceResult', 'data', 'IOSVersionCode'], '');
            }
            if (versionCode <= VersionInfo.app_version_code
                || versionCode == '') {
                this.props.dispatch(
                    createAction('login/login')({
                        User_Account: username,
                        User_Pwd: password,
                        // 判断当前客户端是否为最新客户端
                        IsLastest: versionCode <= VersionInfo.app_version_code || versionCode == '',
                        LoginDevice: Platform.OS == 'android' ? 'Android' : 'iOS',
                        dispatch: this.props.dispatch
                    })
                );
            } else {
                ShowToast('当前不是最新版App，请更新后使用！')
            }
        }


        /**
         * 选中‘记住密码’则存储密码
         */
        if (this.state.isremenber) {
            this.state.User_Account = username;
            this.state.User_Pwd = password;
            this.state.imageState = true;
            this.state.verification = '';
            this.state.startDelay = false;
            await saveStorage('loginmsg', this.state);
        } else {
            const loginInfo = {
                User_Account: this.state.username,
                User_Pwd: password,
                isremenber: false,
                imageState: true
            };
            await saveStorage('loginmsg', loginInfo);
        }
    };

    loadNativeConfig = async () => {
        // await loadRootUrl();
        let rootUrl = getRootUrl();
        this.props.dispatch(createAction('login/updateState')({ ProjectName: SentencedToEmpty(rootUrl, ['SystemName'], '污染源监控平台') }));
        if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT) {
            if (this.props.maintain) {

            } else if ((typeof rootUrl == 'undefined' || !rootUrl)) {
                if (!this.props.maintain) {
                    this.props.dispatch(
                        StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'SetEnterpriseInformation' })]
                        })
                    );
                }
            }
        }
    }

    //版本更新
    _checkUpdate = () => {
        // 手写全量更新
        this.props.dispatch(
            createAction('baseModel/chechUpdate')({
                successCallback: result => {
                    this.setState({
                        IOSDownLoadPath: result.data.IOSDownLoadPath, DownLoadPath: result.data.DownLoadPath, UpdateContent: result.data.UpdateContent
                        , ForcedUpdate: SentencedToEmpty(result, ['data', 'ForcedUpdate'], false)
                    });
                    if (CURRENT_PROJECT == 'POLLUTION_PROJECT') {
                        if (Platform.OS == 'ios') {
                            if (VersionInfo.app_version_code != result.data.IOSVersionCode) {
                                if (this.refs && this.refs.updateAlert) this.refs.updateAlert.showModal();
                                else console.log('报空了');
                            } else {
                                // ShowToast('已经是最新版本');
                                //                        this.setState({ syncMessage: '已经是最新版本' });
                            }
                        } else {
                            if (VersionInfo.app_version_code != result.data.VersionCode) {
                                if (this.refs && this.refs.updateAlert) this.refs.updateAlert.showModal();
                                else console.log('报空了');
                            } else {
                                // ShowToast('已经是最新版本');
                                // this.setState({ syncMessage: '已经是最新版本' });
                            }
                        }
                    } else {
                        if (Platform.OS == 'ios') {
                            if (VersionInfo.app_version_code < result.data.IOSVersionCode) {
                                if (this.refs && this.refs.updateAlert) this.refs.updateAlert.showModal();
                                else console.log('报空了');
                            } else {
                                // ShowToast('已经是最新版本');
                                //                        this.setState({ syncMessage: '已经是最新版本' });
                            }
                        } else {
                            if (VersionInfo.app_version_code < result.data.VersionCode) {
                                if (this.refs && this.refs.updateAlert) this.refs.updateAlert.showModal();
                                else console.log('报空了');
                            } else {
                                // ShowToast('已经是最新版本');
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

    onPressChang = () => {
        this.setState({
            imageState: !this.state.imageState
        });
    };

    render() {
        const ProxyCode = getEncryptData();
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    onLayout={event => {
                        this.scrollViewLayout(event);
                    }}
                >
                    <View style={[styles.LoginForm, { height: this.state.contentHeight }]}>
                        <Image
                            style={{ width: 272, height: 108, marginTop: 94, marginBottom: CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? -19 : 55, backgroundColor: '#fff' }}
                            source={this.state.logoImage}
                            onError={({ nativeEvent: { error } }) => {
                                this.setState({ logoImage: LoginImage });
                            }}
                        />
                        {CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? (
                            <View style={{ height: 22, width: SCREEN_WIDTH, backgroundColor: '#fff', marginBottom: 55, alignItems: 'center' }}>
                                <Text style={{ color: '#33CCFF', fontSize: 17, fontWeight: '500' }}>{this.props.ProjectName}</Text>
                            </View>
                        ) : null}

                        <View style={[styles.TextInputStyle, { marginBottom: 12 }]}>
                            <Image style={{ width: 20, height: 20, marginLeft: 18 }} source={require('../../../images/login_user.png')} />
                            <TextInput
                                ref={ref => (this.userNameInput = ref)}
                                keyboardType="default"
                                clearTextOnFocus={false}
                                blurOnSubmit={true}
                                placeholderTextColor={'#999'}
                                placeholder="请输入用户名"
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid="transparent"
                                clearButtonMode="always"
                                onChangeText={text => {
                                    // 动态更新组件内State记录用户名
                                    this.setState({
                                        username: text
                                    });
                                }}
                                value={this.state.username}
                                style={{
                                    flex: 1,
                                    paddingLeft: 10,
                                    paddingTop: 1,
                                    paddingBottom: 1,
                                    color: '#333',
                                    height: 20
                                }}
                            />
                        </View>
                        <View style={[styles.TextInputStyle, { marginBottom: 12 }]}>
                            <Image style={{ width: 20, height: 20, marginLeft: 18 }} source={require('../../../images/login_password.png')} />
                            <TextInput
                                ref={ref => (this.passWordInput = ref)}
                                clearTextOnFocus={false}
                                blurOnSubmit={true}
                                keyboardType="default"
                                placeholderTextColor={'#999'}
                                placeholder="请输入密码"
                                autoCapitalize="none"
                                autoCorrect={false}
                                underlineColorAndroid="transparent"
                                clearButtonMode="always"
                                secureTextEntry={this.state.imageState}
                                onChangeText={text => {
                                    // 动态更新组件内State记录密码
                                    this.setState({
                                        password: text
                                    });
                                }}
                                value={this.state.password}
                                style={{
                                    flex: 1,
                                    paddingLeft: 10,
                                    paddingTop: 1,
                                    paddingBottom: 1,
                                    height: 20,
                                    color: '#333'
                                }}
                            />
                            <TouchableWithoutFeedback style={{ marginRight: 10 }} onPress={this.onPressChang}>
                                {this.state.imageState == false ? (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/xianshi.png')} />
                                ) : (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/yincang.png')} />
                                )}
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[{
                            flexDirection: 'row',
                            width: 272,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            marginBottom: 20
                        }]}>
                            <View style={[{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 44,
                                borderRadius: 22,
                                borderWidth: 1,
                                borderColor: '#d9d9d9',
                                flex: 1,
                                marginRight: 16
                            }]}>
                                <TextInput
                                    clearTextOnFocus={false}
                                    blurOnSubmit={true}
                                    keyboardType="default"
                                    placeholderTextColor={'#999'}
                                    placeholder="请输入验证码"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid="transparent"
                                    clearButtonMode="always"
                                    onChangeText={text => {
                                        // 动态更新组件内State记录密码
                                        this.setState({
                                            verification: text
                                        });
                                    }}
                                    value={this.state.verification}
                                    style={{
                                        flex: 1,
                                        paddingLeft: 10,
                                        marginLeft: 10,
                                        paddingTop: 1,
                                        paddingBottom: 1,
                                        height: 20,
                                        color: '#333'
                                    }}
                                />
                            </View>
                            {
                                this.state.startDelay ? <View
                                >
                                    <View style={[{
                                        width: 96, height: 44, borderRadius: 22
                                        , borderWidth: 1, borderColor: '#4aa0ff'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}>
                                        <Text style={[{ color: '#4aa0ff' }]}><CountdownText textStyle={{ fontSize: 16, color: '#808A87' }} duration={60}
                                            prefix={'等待'}
                                            endCallback={() => {
                                                this.setState({ startDelay: false });
                                            }}
                                            changeCallback={(remainingTime) => { }}
                                        /></Text>
                                    </View>
                                </View>
                                    : <TouchableOpacity
                                        onPress={() => {

                                            if (this.state.username == '') {
                                                ShowToast('获取验证码前，请输入您的账号');
                                                return;
                                            }
                                            this.setState({ startDelay: true }, () => {
                                                this.props.dispatch(createAction('login/postMessageCode')({ UserAccount: this.state.username }));
                                            });
                                        }}
                                    >
                                        <View style={[{
                                            width: 96, height: 44, borderRadius: 22
                                            , borderWidth: 1, borderColor: '#4aa0ff'
                                            , justifyContent: 'center', alignItems: 'center'
                                        }]}>
                                            <Text style={[{ color: '#4aa0ff' }]}>{'获取验证码'}</Text>
                                        </View>
                                    </TouchableOpacity>
                            }
                        </View>

                        {this.props.loginData.status == -1 ? (
                            <TouchableOpacity style={styles.button} onPress={this.login}>
                                <View style={[styles.button, { backgroundColor: '#4aa0ff' }]}>
                                    <ActivityIndicator color={'#fff'} size="small" />
                                    <Text style={[{ color: '#fff', fontSize: 20 }]}>正在登录</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={this.login}>
                                <View style={[styles.button, { backgroundColor: '#4aa0ff' }]}>
                                    <Text style={[{ color: '#fff', fontSize: 20 }]}>登录</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* <View style={styles.checkStyle}>
                            <TouchableOpacity
                                style={styles.checkStyleDetail}
                                onPress={() => {
                                    // 动态更新组件内State记录记住我
                                    this.setState({
                                        isremenber: !this.state.isremenber
                                    });
                                }}
                            >
                                <Image source={this.state.isremenber ? require('../../../images/login_checkbox_on.png') : require('../../../images/login_checkbox_off.png')} style={{ width: 21, height: 21 }} />
                                <Text style={{ fontSize: 14, color: '#666', marginLeft: 3 }}>记住密码</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: SCREEN_WIDTH,
                            height: 40,
                            marginTop: 20
                        }}>
                            <TouchableOpacity
                                style={[styles.checkStyleDetail, { width: 100, justifyContent: 'flex-end' }]}
                                onPress={() => {
                                    // 动态更新组件内State记录记住我
                                    this.setState({
                                        isremenber: !this.state.isremenber
                                    });
                                }}
                            >
                                <Image source={this.state.isremenber ? require('../../../images/login_checkbox_on.png') : require('../../../images/login_checkbox_off.png')} style={{ width: 21, height: 21 }} />
                                <Text style={{ fontSize: 14, color: '#4aa0ff', marginLeft: 3 }}>记住密码</Text>
                            </TouchableOpacity>
                            {CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT ? (
                                <View style={{ width: 1, height: 20, backgroundColor: "#666", marginHorizontal: 10 }}></View>
                            ) : null}
                            {CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT
                                ? (<TouchableOpacity
                                    style={[{ width: 100, alignItems: 'flex-start' }]}
                                    onPress={() => {
                                        this.props.dispatch(
                                            StackActions.reset({
                                                index: 0,
                                                actions: [NavigationActions.navigate({ routeName: 'SetEnterpriseInformation' })]
                                            })
                                        );
                                        // this.props.dispatch(NavigationActions.navigate({ routeName: 'SetEnterpriseInformation' }));
                                        // this.props.dispatch(NavigationActions.back());
                                        this.props.dispatch(createAction('login/updateState')({ needSignAgreement: false, IsAgree: true }))
                                        clearRootUrl();
                                        clearEncryptData();
                                    }}
                                >
                                    <Text style={{ fontSize: 14, color: '#666', marginLeft: 3 }}>重新认证</Text>
                                </TouchableOpacity>) : null}
                        </View>
                        <View style={{ flex: 1 }} />
                        {/* {CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT ? (
                            <TouchableOpacity
                                style={{ marginBottom: isIphoneX() ? 30 : 10 }}
                                onPress={() => {
                                    this.props.dispatch(NavigationActions.navigate({ routeName: 'SetEnterpriseInformation' }));
                                    // this.props.dispatch(NavigationActions.back());
                                    this.props.dispatch(createAction('login/updateState')({needSignAgreement:false,IsAgree:true}))
                                    clearRootUrl();
                                }}
                            >
                                <SDLText fontType={'small'} style={[{ color: '#666', fontSize: 20 }]}>
                                    重新认证
                                </SDLText>
                            </TouchableOpacity>
                        ) : (
                            <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{`v${VersionInfo.app_version_name}`}</Text>
                        )} */}
                        {CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT ?
                            null : (
                                <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{`v${VersionInfo.app_version_name}`}</Text>
                            )}
                        {
                            ProxyCode == 61000 || ProxyCode == 61002 ?
                                <View style={{
                                    height: 40,
                                    marginVertical: 8,
                                    flexDirection: 'row',
                                    width: SCREEN_WIDTH,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TouchableOpacity
                                        style={styles.checkStyleDetail}
                                        onPress={() => {
                                            // 动态更新组件内State记录记住我
                                            this.props.dispatch(createAction('login/updateState')({ IsAgree: !this.props.IsAgree }))
                                        }}
                                    >
                                        <Image source={this.props.IsAgree ? require('../../../images/login_checkbox_on.png') : require('../../../images/login_checkbox_off.png')} style={{ width: 21, height: 21 }} />
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ fontSize: 14, color: '#666', marginLeft: 3 }}>阅读并接受</Text>
                                        <TouchableOpacity
                                            style={styles.checkStyleDetail}
                                            onPress={() => {
                                                this.props.dispatch(NavigationActions.navigate({ routeName: 'AgreementView' }))
                                            }}
                                        >
                                            <Text style={{ fontSize: 14, color: '#4aa0ff', marginLeft: 3 }}>《用户监测数据许可协议》</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View> : null
                        }
                        {CURRENT_PROJECT == 'AIR_PROJECT' || CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? null : (
                            <Text style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{'北京雪迪龙科技股份有限公司'}</Text>
                        )}
                        {CURRENT_PROJECT == 'AIR_PROJECT' || CURRENT_PROJECT == 'POLLUTION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' ? null : (
                            <Text style={{ fontSize: 12, color: '#999', marginBottom: 15 }}>{'Copyright@2019 SDL.All Rights Reserved'}</Text>
                        )}
                    </View>
                </ScrollView>
                <ModalParent ref="updateAlert" ForcedUpdate={this.state.ForcedUpdate} DownLoadPath={Platform.OS == 'ios' ? this.state.IOSDownLoadPath : this.state.DownLoadPath} UpdateContent={this.state.UpdateContent} />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    launchImageStyle: {
        width: SCREEN_WIDTH
    },
    LoginForm: {
        flex: 1,
        alignItems: 'center',
        width: SCREEN_WIDTH
    },
    TextInputStyle: {
        flexDirection: 'row',
        width: 272,
        height: 44,
        borderWidth: 0.5,
        borderRadius: 22,
        borderColor: '#d9d9d9',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    checkStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: SCREEN_WIDTH - 100,
        height: 40,
        marginTop: 20
    },
    checkStyleDetail: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        height: 52,
        width: SCREEN_WIDTH - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        flexDirection: 'row'
    }
});

export default Login;
