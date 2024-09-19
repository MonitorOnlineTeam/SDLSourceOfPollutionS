/*
 * @Description: 表单文本输入区域
 * @LastEditors: hxf
 * @Date: 2021-11-25 18:21:52
 * @LastEditTime: 2024-03-23 14:14:50
 * @FilePath: /SDLMainProject37/app/operationContainers/taskViews/taskExecution/components/FormTextArea.js
 */
import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize'

export default class FormTextArea extends Component {
    render() {
        const {
            last = false,
            label = '标题',
            placeholder = '请输入',
            keyboardType = 'default',
            value = '',
            onChangeText = () => { },
            required = false,
            areaWidth = (SCREEN_WIDTH - 72),
            areaHeight = 100,
            editable = true,
            numberOfLines = 4,
        } = this.props;
        return (
            <View
                style={[
                    {
                        // width: SCREEN_WIDTH - 20,
                        // marginTop: 15,
                        // marginLeft: 10,
                        // paddingHorizontal: 10,
                        backgroundColor: globalcolor.white,
                    }, last ? {} : styles.bottomBorder
                ]}
            >
                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>{label}</Text>
                </View>
                <TextInput
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
                            fontSize: 15,
                            textAlign: 'left',
                            textAlignVertical: 'top',
                            padding: 4
                        }
                    ]}
                    multiline={true}
                    value={value}
                    numberOfLines={numberOfLines}
                    placeholder={placeholder}
                />
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