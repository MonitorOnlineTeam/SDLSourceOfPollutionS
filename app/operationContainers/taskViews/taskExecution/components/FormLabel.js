/*
 * @Description: 表单标题 
 * @LastEditors: hxf
 * @Date: 2023-02-08 10:47:31
 * @LastEditTime: 2023-02-23 10:37:55
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/components/FormLabel.js
 */
import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import globalcolor from '../../../../config/globalcolor';

export default class FormLabel extends Component {
    render() {
        const { label, last=false, itemHeight=44, propsLabelStyle={}, required=false } = this.props;
        return(<View style={[styles.layout,last?{}:styles.bottomBorder,{height:itemHeight}]}>
            <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height:itemHeight }}>
                {required?<Text style={[styles.labelStyle,propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                <Text numberOfLines={1} style={[styles.labelStyle,propsLabelStyle,]}>{`${label}`}</Text>
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center'
    },
    bottomBorder:{
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor, 
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
})