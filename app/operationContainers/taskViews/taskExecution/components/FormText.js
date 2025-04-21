/*
 * @Description: 表单统一文字展示
 * @LastEditors: hxf
 * @Date: 2021-12-14 13:42:55
 * @LastEditTime: 2025-04-15 15:41:07
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/components/FormText.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'

import globalcolor from '../../../../config/globalcolor';

export default class FormText extends Component {
    render() {
        const { label = '标题', showString, last = false, itemHeight = 44, required = false, onPress = false
            , numberOfLines = 1
        } = this.props;
        return (
            <View style={[styles.layout, last ? {} : styles.bottomBorder, { height: itemHeight }]}>
                <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height: itemHeight }}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                    {onPress ? <TouchableOpacity onPress={onPress} style={[styles.innerlayout]} >
                        <Text numberOfLines={numberOfLines} style={[styles.textStyle, { marginLeft: 16 }]}>{showString}</Text>
                    </TouchableOpacity>
                        : <View style={[styles.innerlayout]}>
                            <Text style={[styles.textStyle, { marginLeft: 16 }]}>{showString}</Text>
                        </View>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1,
        textAlign: 'right'
    },
})
