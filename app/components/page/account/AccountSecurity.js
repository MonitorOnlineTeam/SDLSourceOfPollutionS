//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, Dimensions, TouchableOpacity, Image } from 'react-native';
import { createAction, ShowToast, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';
import { getToken, loadStorage } from '../../../dvapack/storage';
import { CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, POLLUTION_PROJECT } from './../../../config/globalconst';
import OperationAlertDialog from '../../modal/OperationAlertDialog';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
/**
 *账户安全
 *HelenChen
 * @class AccountSecurity
 * @extends {Component}
 */
@connect(({ app, loading, account }) => ({
    ResetPwdInfo: app.ResetPwdInfo,
    user: app.user,
    Complexity: account.Complexity,
    // loading: loading.effects['app/ResetPwd']
}))
class AccountSecurity extends PureComponent {
    // static navigationOptions = ({ navigation }) => {
    //     const user = getToken();
    //     let pwdSimple = typeof user.Complexity == 'boolean' && !user.Complexity;
    //     // console.log('AccountSecurity user = ',user);
    //     // console.log('AccountSecurity pwdSimple = ',pwdSimple);
    //     // console.log('AccountSecurity Complexity = ',(typeof user.Complexity == 'boolean' && !user.Complexity));
    //     // if (pwdSimple&&false) {
    //     if (pwdSimple) {
    //         return createNavigationOptions({
    //             title: '账户安全'
    //         });
    //     } else {
    //         return createNavigationOptions({
    //             title: '账户安全',
    //             headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
    //         });
    //     }
    // };

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newpassword: '',
            surenewpassword: '',
            passwordInputState: true,
            newpasswordInputState: true,
            surenewpasswordInputState: true,
            passwordIsSimpleOptions: {
                innersHeight: 130,
                messText: `密码过于简单，请进行修改！`,
                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                buttons: [
                    {
                        txt: '确定',
                        btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                        onpress: () => {}
                    }
                ]
            }
        };
    }

    async componentDidMount() {
        const loginmsg = await loadStorage('loginmsg');
        this.setState({
            password: loginmsg.User_Pwd
        });
        if (!this.props.Complexity) {
            SentencedToEmpty(this, ['refs', 'passwordIsSimpleAlert', 'show'], () => {})();
        }
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('account/updateState')({ Complexity: true }));
    }

    isStrong = value => {
        // let regex = new RegExp('^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,}$');
        // let regex = new RegExp('^(?![\d]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*]+$)(?![^\da-zA-Z~!@#$%^&*]+$).{8,}$');
        let regex = new RegExp('^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*]).{8,}$');

        if (regex.test(value)) {
            return true;
        } else {
            ShowToast('密码要求8位以上并且包含字母、数字、特殊字符');
            return false;
        }
    };

    change = () => {
        this.props.dispatch(
            createAction('account/changePass')({
                params: {
                    userPwdOld: this.state.password,
                    userPwdNew: this.state.newpassword,
                    userPwdTwo: this.state.surenewpassword
                }
            })
        );
    };

    changePsw = () => {
        if (this.state.password) {
            if (this.state.newpassword) {
                if (this.state.surenewpassword) {
                    if (this.state.newpassword == this.state.surenewpassword) {
                        if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT) {
                            //污染源项目要求代码复杂性判断
                            if (this.isStrong(this.state.newpassword)) {
                                this.change();
                            }
                        } else {
                            this.change();
                        }
                    } else ShowToast('两次输入的新密码不一致');
                } else ShowToast('新密码不可为空');
            } else ShowToast('新密码不可为空');
        } else ShowToast('原密码不可为空');
    };
    render() {
        let user = getToken();
        return (
            <View style={styles.container}>
                <View style={{ height: 248, flexDirection: 'column', backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                    <View style={styles.usertype}>
                        <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, width: 60 }}>登录名</Text>
                        <Text style={{ fontSize: 14, color: '#999999', marginLeft: 20 }}>{user.UserAccount}</Text>
                    </View>
                    <Text style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />

                    <View style={styles.usertype}>
                        <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, width: 60 }}>原密码</Text>
                        <TextInput
                            clearTextOnFocus={false}
                            blurOnSubmit={true}
                            keyboardType="default"
                            placeholderTextColor="#999999"
                            placeholder="请输入原密码"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            clearButtonMode="always"
                            secureTextEntry={this.state.passwordInputState}
                            onChangeText={text => {
                                this.setState({
                                    password: text
                                });
                            }}
                            value={this.state.password}
                            style={styles.textinputstyle}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    passwordInputState: !this.state.passwordInputState
                                });
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: 45,
                                        height: 45,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {this.state.passwordInputState == false ? (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/xianshi.png')} />
                                ) : (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/yincang.png')} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />

                    <View style={styles.usertype}>
                        <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, width: 60 }}>新密码</Text>
                        <TextInput
                            clearTextOnFocus={false}
                            blurOnSubmit={true}
                            keyboardType="default"
                            placeholderTextColor="#999999"
                            placeholder="填写新密码"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            clearButtonMode="always"
                            secureTextEntry={this.state.newpasswordInputState}
                            onChangeText={text => {
                                this.setState({
                                    newpassword: text
                                });
                            }}
                            value={this.state.newpassword}
                            style={styles.textinputstyle}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    newpasswordInputState: !this.state.newpasswordInputState
                                });
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: 45,
                                        height: 45,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {this.state.newpasswordInputState == false ? (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/xianshi.png')} />
                                ) : (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/yincang.png')} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />

                    <View style={styles.usertype}>
                        <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, width: 60 }}>确认密码</Text>
                        <TextInput
                            clearTextOnFocus={false}
                            blurOnSubmit={true}
                            keyboardType="default"
                            placeholderTextColor="#999999"
                            placeholder="确认新密码"
                            autoCapitalize="none"
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            clearButtonMode="always"
                            secureTextEntry={this.state.surenewpasswordInputState}
                            onChangeText={text => {
                                this.setState({
                                    surenewpassword: text
                                });
                            }}
                            value={this.state.surenewpassword}
                            style={styles.textinputstyle}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    surenewpasswordInputState: !this.state.surenewpasswordInputState
                                });
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: 45,
                                        height: 45,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {this.state.surenewpasswordInputState == false ? (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/xianshi.png')} />
                                ) : (
                                    <Image style={{ width: 14, height: 14, alignSelf: 'center', marginRight: 10 }} source={require('../../../images/yincang.png')} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />
                    <TouchableOpacity
                        style={{ width: 170, height: 36, marginTop: 16, backgroundColor: globalcolor.headerBackgroundColor, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                        onPress={() => {
                            this.changePsw();
                        }}
                    >
                        <Text style={{ fontSize: 14, color: '#ffffff', textAlign: 'center', textAlignVertical: 'center' }}>修改密码</Text>
                    </TouchableOpacity>
                </View>
                <OperationAlertDialog options={this.state.passwordIsSimpleOptions} ref="passwordIsSimpleAlert" />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    usertype: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 20,
        borderBottomColor: '#fefefe',
        borderBottomWidth: 1,
        height: 45,
        alignItems: 'center'
    },
    textinputstyle: {
        // width: SCREEN_WIDTH,
        flex: 1,
        marginLeft: 20,
        paddingTop: 1,
        paddingBottom: 1,
        color: '#999999',
        height: 20,
        fontSize: 14
    }
});

//make this component available to the app
export default AccountSecurity;
