/*
 * @Description: 表单图片选择器
 * @LastEditors: hxf
 * @Date: 2021-11-30 15:36:39
 * @LastEditTime: 2024-03-01 15:06:26
 * @FilePath: /SDLMainProject37/app/operationContainers/taskViews/taskExecution/components/FormImagePicker.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize'
import ImageGrid from '../../../../components/form/images/ImageGrid';

export default class FormImagePicker extends Component {
    render() {
        const {
            label = '图片',
            Imgs = [],
            isUpload = true,
            isDel = true,
            localId = '123',
            required = false,
            imageGridWidth = SCREEN_WIDTH - 72,
            uploadCallback = () => { },
            delCallback = () => { },
        } = this.props;
        return (
            <View style={[styles.layoutStyle, false ? {} : styles.bottomBorder]}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[styles.labelStyle, { marginVertical: 10 }]}>{`${label}：`}</Text>
                </View>
                <View style={[{
                    minHeight: 100,
                    width: imageGridWidth,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center'
                }]}>
                    <ImageGrid
                        uploadCallback={uploadCallback}
                        delCallback={delCallback}
                        style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                        Imgs={Imgs}
                        isUpload={isUpload}
                        isDel={isDel}
                        UUID={localId} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        minHeight: 45,
        marginTop: 10,
        marginBottom: 10,
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.textBlack
    },
});