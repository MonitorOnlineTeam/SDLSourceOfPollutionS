/*
 * @Description: 表单保存按钮
 * @LastEditors: hxf
 * @Date: 2022-01-10 10:24:10
 * @LastEditTime: 2022-01-10 13:46:58
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/components/FormSaveButton.js
 */


import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SCREEN_WIDTH } from '../../../../config/globalsize'

export default class FormSaveButton extends Component {
    render() {
        const {
            onPress
        } = this.props;
        return (
            <TouchableOpacity 
                onPress={()=>{
                    onPress()
                }}
                style={[{height:44, width:SCREEN_WIDTH-20
                    ,backgroundColor:'#4DA9FF'
                    ,justifyContent:'center',alignItems:'center'
                }]}
            >
                <Text style={{fontSize:17,color:'white'}}>保存</Text>
            </TouchableOpacity>
        )
    }
}

export class FormDeleteButton extends Component {
    render() {
        const {
            onPress
        } = this.props;
        return (
            <TouchableOpacity 
                onPress={()=>{
                    onPress()
                }}
                style={[{height:44, width:SCREEN_WIDTH-20
                    ,backgroundColor:'#BDBDBD'
                    ,justifyContent:'center',alignItems:'center'
                }]}
            >
                <Text style={{fontSize:17,color:'white'}}>删除</Text>
            </TouchableOpacity>
        )
    }
}