/*
 * @Description: 表单普通单选
 * @LastEditors: hxf
 * @Date: 2021-11-25 10:54:51
 * @LastEditTime: 2024-07-01 19:09:58
 * @FilePath: /SDLMainProject37_1/app/operationContainers/taskViews/taskExecution/components/FormPicker.js
 */
import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

import globalcolor from '../../../../config/globalcolor';
import { PickerTouchable } from '../../../../components';
import { SCREEN_WIDTH } from '../../../../config/globalsize'

export default class FormPicker extends Component {
    render() {
        const dataArr = [
            { code: 'code1', name: '选项1' },
            { code: 'code2', name: '选项2' },
            { code: 'code3', name: '选项3' },
        ];
        const {
            editable = true,
            last = false,
            label = '标题',
            option = {
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                dataArr,
                onSelectListener: item => {
                }
            },
            defaultCode = ''
            , showText = '', placeHolder = '请选择', required = false
            , propsLabelStyle = {}, propsTextStyle = {}, propsHolderStyle = {}
            , propsRightIconStyle = {}, hasColon = true, requireIconPosition = 'left' } = this.props;
        option.defaultCode = defaultCode;
        return (<View style={[styles.layoutStyle, last ? {} : styles.bottomBorder, {}]}>
            {required && requireIconPosition == 'left' ? <Text style={[styles.labelStyle, propsLabelStyle, { color: 'red' }]}>*</Text> : null}
            <Text style={[styles.labelStyle, propsLabelStyle]}>{`${label}${hasColon ? '：' : ''}`}</Text>
            {required && requireIconPosition == 'right' ? <Text style={[{ marginLeft: 10, fontSize: 15, }, propsLabelStyle, { color: 'red' }]}>*</Text> : null}
            <View style={[styles.innerlayout]}>
                {editable ? <PickerTouchable option={option} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <Text numberOfLines={2} style={[{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }
                        , showText == '' ? propsHolderStyle : propsTextStyle]}>
                        {showText == '' ? placeHolder : showText}
                    </Text>
                    <Image style={[{ tintColor: globalcolor.blue, height: 16, }, propsRightIconStyle]} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                </PickerTouchable>
                    : <View style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1, justifyContent: 'flex-end', }}>
                        <Text numberOfLines={2} style={[{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }
                            , showText == '' ? propsHolderStyle : propsTextStyle]}>
                            {showText == '' ? placeHolder : showText}
                        </Text>
                        <Image style={[{ tintColor: globalcolor.blue, height: 16, }, propsRightIconStyle]} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                    </View>}
            </View>
        </View>)
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
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    // textStyle: {
    //     fontSize: 15,
    //     color: globalcolor.datepickerGreyText,
    //     flex: 1,
    //     textAlign: 'right'
    // },
    // timeIcon: {
    //     tintColor: globalcolor.blue,
    //     height: 16,
    //     width: 18,
    //     marginLeft: 16
    // },
})