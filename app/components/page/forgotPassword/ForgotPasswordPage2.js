/*
 * @Description: 找回密码第一步
 * @LastEditors: hxf
 * @Date: 2024-12-05 10:41:24
 * @LastEditTime: 2024-12-09 16:55:03
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/forgotPassword/ForgotPasswordPage2.js
 */
import { View, Text, Image, TouchableOpacity, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import CaptchaImage from './CaptchaImage';
import { connect, useSelector } from 'react-redux';
import { dispatch } from '../../../../index';
import { CloseToast, createAction, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../utils';
import { TextInput } from '../..';
import SendMsgButton from './SendMsgButton';


export default function ForgotPasswordPage2({ setStep }) {

    const [yzm, setYzm] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { emailShow, userAccount } = useSelector(state => state.account);


    const isStrong = value => {
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
    return (
        <View
            style={[{
                width: SCREEN_WIDTH, flex: 1
                , alignItems: 'center'
                , borderWidth: 1, backgroundColor: 'white'
            }]}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH,
                }]}
            >
                <TouchableOpacity
                    onPress={() => {
                        // dispatch(NavigationActions.back())
                        setStep(1)
                    }}
                    style={[{
                        marginLeft: 15, marginTop: 21
                    }]}
                >
                    <Image
                        resizeMethod={'resize'}
                        resizeMode={'contain'}
                        style={{ tintColor: 'black', width: 24, height: 24, }}
                        source={Platform.OS == 'android'
                            // source={Platform.OS == 'ios'
                            ? require('../../../images/back-icon-android.png')
                            : require('../../../images/back-icon-ios.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={[{
                width: SCREEN_WIDTH, flex: 1,
                justifyContent: 'center'
            }]}>
                <Text
                    style={[{
                        fontSize: 25, color: 'black'
                        , fontWeight: 'bold', marginLeft: 38

                    }]}
                >{'重置密码'}</Text>
                <View style={[{
                    height: 108, justifyContent: 'center'
                    , width: SCREEN_WIDTH - 64, marginLeft: 32
                }]}>
                    <Text
                        style={[{
                            color: '#999999', fontSize: 15
                        }]}
                    >验证码已经发送至<Text
                        style={[{
                            color: '#49A0FF', fontSize: 15
                        }]}
                    >
                            {`${emailShow}`}</Text></Text>
                    <Text
                        style={[{
                            color: '#999999', fontSize: 15
                        }]}
                    >请输入邮件内的验证码进行重置密码，验证 码有效期为24小时 </Text>
                </View>
                <View
                    style={[{
                        width: SCREEN_WIDTH,
                        alignItems: 'center'
                    }]}
                >

                    <View
                        style={[{
                            width: SCREEN_WIDTH - 64, height: 47
                            , flexDirection: 'row'
                        }]}
                    >
                        <View
                            style={[{
                                height: 45, flex: 1, marginRight: 13
                                , backgroundColor: '#F1F2F6', borderRadius: 22
                                , paddingHorizontal: 20
                            }]}
                        >
                            <TextInput
                                maxLength={6}
                                style={[{
                                    fontSize: 16, color: '#333333'
                                }]}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    setYzm(text);
                                    // this.setState({ userName: text });
                                    // onChangeText(text);
                                }}
                                placeholder={'请输入验证码'}
                            >{yzm}</TextInput>
                        </View>
                        <SendMsgButton
                            onPress={() => {
                                dispatch(createAction('account/SendEmailCode')({}));
                            }}
                        />
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 64, height: 45
                            , backgroundColor: '#F1F2F6', borderRadius: 22
                            , paddingHorizontal: 20, marginTop: 12
                        }]}
                    >
                        <TextInput
                            style={[{
                                fontSize: 16, color: '#333333'
                            }]}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                setNewPassword(text);
                                // this.setState({ userName: text });
                                // onChangeText(text);
                            }}
                            placeholder={'请输入新密码'}
                        >{newPassword}</TextInput>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 64, height: 45
                            , backgroundColor: '#F1F2F6', borderRadius: 22
                            , paddingHorizontal: 20, marginTop: 12
                        }]}
                    >
                        <TextInput
                            style={[{
                                fontSize: 16, color: '#333333'
                            }]}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                setReEnterPassword(text);
                            }}
                            placeholder={'请确认新密码'}
                        >{reEnterPassword}</TextInput>
                    </View>
                    {errorMsg != '' ? <Text style={[{
                        width: SCREEN_WIDTH - 80,
                        fontSize: 14, color: '#FF0000', marginTop: 10
                    }]}>{errorMsg}</Text> : null}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setErrorMsg('');

                        if (yzm.trim() == '') {
                            ShowToast('验证码不能为空');
                            setErrorMsg('验证码不能为空');
                            return;
                        }
                        if (newPassword.trim() == '') {
                            ShowToast('新密码不能为空');
                            setErrorMsg('新密码不能为空');
                            return;
                        }
                        let strongCheckStatue = isStrong(newPassword);
                        if (!strongCheckStatue) {
                            setErrorMsg('密码要求最少8位并且包含字母、数字、特殊字符');
                            return;
                        }
                        if (reEnterPassword.trim() == '') {
                            ShowToast('确认密码不能为空');
                            setErrorMsg('确认密码不能为空');
                            return;
                        }


                        if (newPassword !== reEnterPassword) {
                            ShowToast('两次输入密码不一致');
                            setErrorMsg('两次输入密码不一致');
                        } else {
                            setErrorMsg('');
                            ShowLoadingToast('正在提交...');
                            dispatch(createAction('account/RetrievePasswordByEmail')({
                                params: {
                                    userAccount: userAccount,
                                    code: yzm,
                                    password: newPassword,
                                },
                                callback: (result) => {
                                    CloseToast();
                                    if (result.status == 200
                                        && SentencedToEmpty(result, ['data', 'IsSuccess'], false)
                                    ) {
                                        setStep(3)
                                    } else {
                                        console.log('fail error msg = ', SentencedToEmpty(result, ['data', 'Datas'], '提交失败'));
                                        setErrorMsg(SentencedToEmpty(result, ['data', 'Datas'], '提交失败'));
                                    }
                                }
                            }));
                            // setStep(3)
                            // navigation.navigate('ForgotPasswordPage2');
                        }
                    }}
                    style={[{
                        marginLeft: 32, marginTop: 48
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 64, height: 45
                            , backgroundColor: '#49A0FF'
                            , justifyContent: 'center', alignItems: 'center'
                            , borderRadius: 22
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 19, color: 'white',
                                fontWeight: 'blod'
                            }]}
                        >{'提交'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 24,
                }]}
            >

            </View>
            {/* <Text style={[{ color: 'black' }]}>找回密码第一步</Text>
            <TouchableOpacity
                style={[{
                    flexDirection: 'row',
                    alignItems: 'center'
                }, { width: 100, justifyContent: 'center' }]}
                onPress={() => {
                }}
            >
                <Text style={{ fontSize: 14, color: '#4aa0ff' }}>忘记密码</Text>
            </TouchableOpacity> */}
        </View>
    )
}