/*
 * @Description: 找回密码第一步
 * @LastEditors: hxf
 * @Date: 2024-12-05 10:41:24
 * @LastEditTime: 2024-12-11 11:01:26
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/forgotPassword/ForgotPasswordPageSuccesss.js
 */
import { View, Text, Image, TouchableOpacity, NativeModules } from 'react-native'
import React, { useState } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import CaptchaImage from './CaptchaImage';
import { connect } from 'react-redux'; import { dispatch } from '../../../../index';
import { NavigationActions, ShowToast } from '../../../utils';


export default function ForgotPasswordPageSuccesss({ setStep }) {

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
                        setStep(2)
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
                justifyContent: 'center', alignItems: 'center'
            }]}>

                <Image
                    style={[{
                        width: 80, height: 80
                        , marginBottom: 31
                    }]}
                    source={require('../../../images/ic_change_password.png')}
                />
                <Text
                    style={[{
                        fontSize: 17, color: '#414141', fontWeight: 'bold'
                    }]}
                >{'您的密码已重置成功，请牢记！'}</Text>
                <TouchableOpacity
                    onPress={() => {
                        dispatch(NavigationActions.back())
                    }}
                    style={[{
                        marginTop: 75
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
                        >{'返回登录页'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}