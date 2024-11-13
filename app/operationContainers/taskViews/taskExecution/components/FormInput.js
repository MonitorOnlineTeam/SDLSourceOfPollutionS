/*
 * @Description: 表单input
 * @LastEditors: hxf
 * @Date: 2021-11-25 14:49:25
 * @LastEditTime: 2024-11-11 14:26:26
 * @FilePath: /SDLSourceOfPollutionS/app/operationContainers/taskViews/taskExecution/components/FormInput.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';

export default class FormInput extends Component {

    render() {
        const {
            editable = true,
            last = false,
            label = '标题',
            placeholder = '请输入',
            keyboardType = 'default',
            value = '',
            onChangeText = () => { },
            required = false
            , propsLabelStyle = {}, propsTextStyle = {}, propsHolderStyle = {}
            , hasColon = true, requireIconPosition = 'left'
        } = this.props;
        return (
            <View style={[styles.layoutStyle, last ? {} : styles.bottomBorder]}>
                {required && requireIconPosition == 'left' ? <Text style={[styles.labelStyle, propsLabelStyle, { color: 'red' }]}>*</Text> : null}
                <Text numberOfLines={1} style={[styles.labelStyle, propsLabelStyle,]}>{`${label}${hasColon ? '：' : ''}`}</Text>
                {required && requireIconPosition == 'right' ? <Text style={[{ marginLeft: 10, fontSize: 15, }, propsLabelStyle, { color: 'red' }]}>*</Text> : null}
                <TextInput
                    editable={editable}
                    numberOfLines={1}
                    keyboardType={keyboardType}
                    value={value + ''}
                    style={[styles.textStyle, propsTextStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={'#999999'}
                    onChangeText={text => {
                        onChangeText(text);
                    }}
                />
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
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        textAlign: 'right',
        flex: 1,
        fontSize: 14,
        color: globalcolor.datepickerGreyText,
    },
})