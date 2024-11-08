/*
 * @Description: 表单两项切换
 * @LastEditors: hxf
 * @Date: 2022-01-09 14:46:49
 * @LastEditTime: 2024-11-04 17:06:46
 * @FilePath: /SDLSourceOfPollutionS/app/operationContainers/taskViews/taskExecution/components/Form2Switch.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import globalcolor from '../../../../config/globalcolor';

export default class Form2Switch extends Component {
    render() {
        let {
            last = false,
            label = '标题',
            showField = 'name',
            valueField = 'value',
            data = [{ name: '有', value: true }, { name: '无', value: false }],
            value,
            onChange = () => { },
            required = false,
            editable = true,
        } = this.props;
        if (data.length == 0) {
            data = [];
            data[0] = {};
            data[1] = {};
            data[0][showField] = '有'
            data[0][valueField] = true
            data[1][showField] = '无'
            data[1][valueField] = false
        } else if (data.length == 1) {
            data[1] = {};
            data[1][showField] = '无'
            data[1][valueField] = false
        }
        return (
            <View style={[styles.layoutStyle, last ? {} : styles.bottomBorder]}>
                {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                <View style={[styles.touchable]}>
                    <TouchableOpacity
                        onPress={() => {
                            if (editable) {
                                onChange(data[0][valueField])
                            }
                        }}
                        style={[styles.innerlayout, { height: 44, paddingRight: 10, justifyContent: 'flex-end' }]}>
                        <View style={[{
                            height: 10, width: 10, backgroundColor: '#EEEEEE'
                            , marginRight: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5
                        }]}>
                            {
                                data[0][valueField] === value ?
                                    <View style={{ height: 6, width: 6, backgroundColor: '#4AA0FF', borderRadius: 3 }} />
                                    : null
                            }
                        </View>
                        <Text style={[{ color: '#333333' }]}>{data[0][showField]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (editable) {
                                onChange(data[1][valueField])
                            }
                        }}
                        style={[styles.innerlayout, { height: 44, paddingRight: 10, justifyContent: 'flex-end' }]}>
                        <View style={[{
                            height: 10, width: 10, backgroundColor: '#EEEEEE'
                            , marginRight: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5
                        }]}>
                            {
                                data[1][valueField] === value ?
                                    <View style={{ height: 6, width: 6, backgroundColor: '#4AA0FF', borderRadius: 3 }} />
                                    : null
                            }
                        </View>
                        <Text style={[{ color: '#333333' }]}>{data[1][showField]}</Text>
                    </TouchableOpacity>
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