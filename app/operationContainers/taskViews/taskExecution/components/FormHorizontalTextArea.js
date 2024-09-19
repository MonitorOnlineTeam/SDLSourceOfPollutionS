/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-02-09 09:06:04
 * @LastEditTime: 2023-07-27 15:43:05
 * @FilePath: /SDLMainProject36/app/operationContainers/taskViews/taskExecution/components/FormHorizontalTextArea.js
 */
import React, { Component } from 'react'
import { Text, TextInput, View, StyleSheet } from 'react-native'
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';

export default class FormHorizontalTextArea extends Component {
    render() {
        const { 
            last=false,
            label='标题',
            labelStyle={},
            inputStyle={},
            placeholder='请输入',
            keyboardType='default',
            value='',
            onChangeText=()=>{},
            required=false,
            areaWidth=(SCREEN_WIDTH - 72),
            areaHeight=0,
            editable=true,
            numberOfLines=4
         } = this.props;
        let dynamicParameter = {};
         if (numberOfLines>0) {
            dynamicParameter.numberOfLines = numberOfLines;
         }
        return (
            <View
                style={[
                    {
                        backgroundColor: globalcolor.white,
                        flexDirection:'row',
                        alignItems:'flex-start'
                    },last?{}:styles.bottomBorder
                ]}
            >
                <View style={[{flexDirection:'row', alignItems:'center',}]}>
                    {required?<Text style={[styles.labelStyle,{color:'red'} ]}>*</Text>:null}
                    <Text style={[{paddingTop:0, fontSize: 15, color: globalcolor.taskImfoLabel}, labelStyle]}>{label}</Text>
                </View>
                {
                    editable?<TextInput
                        editable={editable}
                        onChangeText={text => {
                            //动态更新组件内state 记录输入内容
                            // this.setState({ reason: text });
                            onChangeText(text);
                        }}
                        style={[
                            {
                                minHeight: areaHeight,
                                width: areaWidth,
                                marginBottom: 20,
                                color: globalcolor.datepickerGreyText,
                                fontSize: 14,
                                textAlign: 'left',
                                textAlignVertical: 'top',
                                paddingTop:0
                            },inputStyle
                        ]}
                        multiline={true}
                        value={value}
                        // numberOfLines={4}
                        placeholder={placeholder}
                        {...dynamicParameter}
                    />
                    :<Text style={[
                            {
                                minHeight: areaHeight,
                                width: areaWidth,
                                marginBottom: 20,
                                color: globalcolor.datepickerGreyText,
                                fontSize: 14,
                                textAlign: 'left',
                                textAlignVertical: 'top',
                                paddingTop:0
                            },inputStyle
                        ]}
                        {...dynamicParameter}
                    >
                        {value}
                    </Text>
                }
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        marginBottom: 10, 
        alignItems: 'center'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.textBlack
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
})