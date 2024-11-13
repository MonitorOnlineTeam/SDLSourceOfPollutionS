/*
 * @Description: 表单 量程input
 * @LastEditors: hxf
 * @Date: 2022-01-12 16:27:12
 * @LastEditTime: 2024-11-11 14:26:00
 * @FilePath: /SDLSourceOfPollutionS/app/operationContainers/taskViews/taskExecution/components/FormRangInput.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'

import globalcolor from '../../../../config/globalcolor';

export default class FormRangInput extends Component {

    render() {
        const {
            last = false,
            label = '标题',
            rangSeparator = ',',
            upperLimitPlaceholder = '请输入最大值',
            lowerLimitPlaceholder = '请输入最小值',
            keyboardType = 'default',
            upperLimitValue = '',
            lowerLimitValue = '',
            onChangeText = () => { },
            required = false
        } = this.props;
        return (
            <View style={[styles.layoutStyle, last ? {} : styles.bottomBorder]}>
                {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                <View style={[styles.touchable, { justifyContent: 'flex-end' }]}>
                    <TextInput
                        keyboardType={keyboardType}
                        value={lowerLimitValue + ''}
                        style={[styles.textStyle, { textAlign: 'right' }]}
                        placeholder={lowerLimitPlaceholder}
                        placeholderTextColor={'#999999'}
                        onChangeText={text => {
                            onChangeText([text, upperLimitValue]);
                        }}
                    />
                    <Text style={{ fontSize: 14, color: globalcolor.datepickerGreyText, }}>{rangSeparator}</Text>
                    <TextInput
                        keyboardType={keyboardType}
                        value={upperLimitValue + ''}
                        style={[styles.textStyle]}
                        placeholder={upperLimitPlaceholder}
                        placeholderTextColor={'#999999'}
                        onChangeText={text => {
                            onChangeText([lowerLimitValue, text]);
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        flexDirection: 'row',
        height: 45,
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
    textStyle: {
        fontSize: 14,
        minWidth: 30,
        color: globalcolor.datepickerGreyText,
    },
})