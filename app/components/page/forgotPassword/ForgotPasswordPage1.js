/*
 * @Description: 找回密码第一步
 * @LastEditors: hxf
 * @Date: 2024-12-05 10:41:24
 * @LastEditTime: 2024-12-09 16:28:09
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/forgotPassword/ForgotPasswordPage1.js
 */
import { View, Text, Image, TouchableOpacity, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import CaptchaImage from './CaptchaImage';
import { connect } from 'react-redux';
import { dispatch } from '../../../../index';
import { CloseToast, createAction, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../utils';
import { TextInput } from '../..';
import ForgotPasswordPage2 from './ForgotPasswordPage2';
import ForgotPasswordPageSuccesss from './ForgotPasswordPageSuccesss';


export default function ForgotPasswordPage1() {

    const [userName, setUserName] = useState('');
    const [captchaStr, setCaptchaStr] = useState('');
    const [checkCaptchaStr, setCheckCaptchaStr] = useState('');
    const [checkStatus, setCheckStatus] = useState(200);
    const [noEmailErrorMsg, setNoEmailErrorMsg] = useState('在平台未绑定邮箱，请联系管理员!');
    const [step, setStep] = useState(1);

    if (step == 1) {
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
                            dispatch(NavigationActions.back())
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
                            , marginBottom: 80
                        }]}
                    >{'找回密码'}</Text>
                    <View
                        style={[{
                            width: SCREEN_WIDTH,
                            alignItems: 'center'
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 64, height: 45
                                , backgroundColor: '#F1F2F6', borderRadius: 22
                                , paddingHorizontal: 20
                            }]}
                        >
                            <TextInput
                                style={[{
                                    fontSize: 16, color: '#333333'
                                }]}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    setUserName(text);
                                    // this.setState({ userName: text });
                                    // onChangeText(text);
                                }}
                                placeholder={'请输入登录名'}
                            >{userName}</TextInput>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 64, height: 47
                                , marginTop: 12, flexDirection: 'row'
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
                                    maxLength={4}
                                    style={[{
                                        fontSize: 16, color: '#333333'
                                    }]}
                                    onChangeText={text => {
                                        //动态更新组件内state 记录输入内容
                                        setCaptchaStr(text);
                                        // this.setState({ userName: text });
                                        // onChangeText(text);
                                    }}
                                    placeholder={'请输入验证码'}
                                >{captchaStr}</TextInput>
                            </View>
                            <CaptchaImage
                                backFun={(captchaString) => {
                                    console.log('CaptchaImage backFun ', captchaString);
                                    setCheckCaptchaStr(captchaString);
                                }}
                            />
                        </View>
                        {checkStatus == -2 ? <Text style={[{
                            width: SCREEN_WIDTH - 80,
                            fontSize: 14, color: '#FF0000', marginTop: 10
                        }]}>{'验证码不正确'}</Text> : null}
                        {checkStatus == -3 ? <Text style={[{
                            width: SCREEN_WIDTH - 80,
                            fontSize: 14, color: '#FF0000', marginTop: 10
                        }]}>{noEmailErrorMsg}</Text> : null}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (userName.trim() == '') {
                                ShowToast('用户名不能为空');
                                return;
                            }
                            if (captchaStr.trim() == '') {
                                ShowToast('验证码不能为空');
                                return;
                            }
                            let lowerCaptchaStr = captchaStr.toLowerCase();
                            let lowerCheckCaptchaStr = checkCaptchaStr.toLowerCase();
                            if (lowerCaptchaStr !== lowerCheckCaptchaStr) {
                                setCheckStatus(-2);
                            } else {
                                setCheckStatus(200);
                                // setCheckStatus(-3);
                                // dispatch(NavigationActions.navigate({
                                //     routeName: 'ForgotPasswordPage2'
                                //     , params: {}
                                // }))
                                ShowLoadingToast('请稍后...');
                                dispatch(createAction('account/updateState')({
                                    userAccount: userName
                                }));
                                dispatch(createAction('account/SendEmailCode')({
                                    callback: (result) => {
                                        CloseToast();
                                        console.log('SendEmailCode result = ', result);
                                        if (result.status == 200
                                            && SentencedToEmpty(result, ['data', 'IsSuccess'], false)) {
                                            setStep(2)
                                            // const { curPage } = useSelector(state => state.account);
                                            dispatch(createAction('account/updateState')({
                                                emailShow: SentencedToEmpty(result, ['data', 'Datas'], '---')
                                            }));
                                        } else {
                                            setCheckStatus(-3);
                                            setNoEmailErrorMsg(SentencedToEmpty(result, ['data', 'Datas'], '在平台未绑定邮箱，请联系管理员!'));
                                        }
                                    }
                                }));
                            }
                            // dispatch(NavigationActions.navigate({
                            //     routeName: 'ForgotPasswordPage2'
                            //     , params: {}
                            // }))
                        }}
                        style={[{
                            marginLeft: 32, marginTop: 130
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
                            >{'下一步'}</Text>
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
    if (step == 2) {
        return <ForgotPasswordPage2
            setStep={setStep}
        />
    }

    if (step == 3) {
        return <ForgotPasswordPageSuccesss
            setStep={setStep}
        />
    }
}