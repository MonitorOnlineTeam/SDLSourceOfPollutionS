/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-12-08 16:37:17
 * @LastEditTime: 2024-12-09 15:19:49
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/forgotPassword/SendMsgButton.js
 */
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function SendMsgButton({ onPress = () => { } }) {
    const [coolDownTime, setCoolDownTime] = useState(0)
    // sendTime 从0开始，则会有两种按钮文字，如果从1开始则只有一种。
    const [sendTime, setSendTime] = useState(1)
    useEffect(() => {
        let intervalId;
        if (coolDownTime == 60) {
            setInterval(() => {
                let nextCoolDownTime = coolDownTime - 1;
                setCoolDownTime(prevTime => prevTime - 1);
            }, 1000)
        }
        return () => clearInterval(intervalId);
    }, [coolDownTime])
    useEffect(() => {
        if (coolDownTime == 0) {

        }
    }, [coolDownTime])
    const startCoolDown = () => {
        setCoolDownTime(60);
        setSendTime(prevTime => prevTime + 1);
    }
    if (coolDownTime > 0) {
        return (<View
            style={[{
                width: 112, height: 45
                , justifyContent: 'center', alignItems: 'center'
                , borderColor: '#EAEBEE', borderWidth: 1
                , borderRadius: 22
            }]}
        >
            <Text
                style={[{
                    fontSize: 16, color: '#999999'
                }]}
            >{`(${coolDownTime})`}</Text>
        </View>)
    }
    console.log('sendTime = ', sendTime);
    return (<TouchableOpacity
        onPress={() => {
            startCoolDown();
            onPress();
        }}
    >
        <View
            style={[{
                width: 112, height: 45
                , justifyContent: 'center', alignItems: 'center'
                , borderColor: '#EAEBEE', borderWidth: 1
                , borderRadius: 22
            }]}
        >
            {
                sendTime > 0 ? <Text
                    style={[{
                        fontSize: 16, color: '#999999'
                    }]}
                >{`重复发送`}</Text>
                    : <Text
                        style={[{
                            fontSize: 16, color: '#49A0FF'
                        }]}
                    >{'发送验证码'}</Text>
            }

        </View>
    </TouchableOpacity>
    )
}