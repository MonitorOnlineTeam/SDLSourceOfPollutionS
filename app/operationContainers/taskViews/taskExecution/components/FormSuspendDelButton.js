/*
 * @Description: 悬浮删除按钮
 * @LastEditors: hxf
 * @Date: 2022-01-09 19:32:31
 * @LastEditTime: 2023-03-20 11:01:46
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/components/FormSuspendDelButton.js
 */

import React, { Component } from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'

export default class FormSuspendDelButton extends Component {
    render() {
        const {
            onPress=()=>{}
        } = this.props;
        return (
            <TouchableOpacity
                onPress={()=>{
                    onPress()
                }}
                style={[{position:'absolute',bottom:64,right:18
                ,width:60,height:60}]}
            >
                <ImageBackground 
                    resizeMode={'stretch'}
                    style={{height:60,width:60,paddingLeft:17}}
                    source={require('../../../../images/bi_suspend_del_btn.png')}
                >
                    <Text style={{marginTop: 9, fontSize:13,color:'white',paddingVertical:0}}>删除</Text>
                    <Text style={{fontSize:13,color:'white',paddingVertical:0}}>表单</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}
