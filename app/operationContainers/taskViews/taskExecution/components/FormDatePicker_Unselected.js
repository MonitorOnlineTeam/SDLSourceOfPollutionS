/*
 * @Description: 表单统一日期选择器
 * @LastEditors: hxf
 * @Date: 2021-11-22 14:47:40
 * @LastEditTime: 2024-04-17 10:18:10
 * @FilePath: /SDLMainProject37/app/operationContainers/taskViews/taskExecution/components/FormDatePicker_Unselected.js
 */

import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'

import globalcolor from '../../../../config/globalcolor';
import { PickerSingleTimeTouchable } from '../../../../components';
import PickerView from '../../../../components/SDLPicker/PickerView';
import moment from 'moment';
import { SentencedToEmpty } from '../../../../utils';

export default class FormDatePicker_Unselected extends Component {

    setTime = defaultTime => {
        SentencedToEmpty(this
            , ['timeTouchable', 'setTime']
            , () => { })(defaultTime);
    };
    render() {
        const { showRightIcon = true, editable = true, last = false, getPickerOption = () => { }, label, timeString, required
            , rightIcon = require('../../../../images/icon_select_date.png')
            , rightIconStyle = {}
        } = this.props;
        return (
            <View style={[styles.layout, last ? {} : styles.bottomBorder]}>
                {editable ? <PickerSingleTimeTouchable
                    ref={ref => this.timeTouchable = ref}
                    option={{
                        pickerType: 'SingleTimeWheel_Unselected',
                        ...getPickerOption()
                        , beforeCheck: () => {
                            if (this.props.onPress) {
                                this.props.onPress();
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                    <View style={[styles.innerlayout]}>
                        <Text style={[styles.textStyle]}>{timeString}</Text>
                        {showRightIcon ? <Image style={[styles.timeIcon, rightIconStyle]} resizeMode={'contain'} source={rightIcon} /> : null}
                    </View>
                </PickerSingleTimeTouchable>
                    : <View style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                        {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                        <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                        <View style={[styles.innerlayout]}>
                            <Text style={[styles.textStyle]}>{timeString}</Text>
                            <Image style={[styles.timeIcon, rightIconStyle]} resizeMode={'contain'} source={rightIcon} />
                        </View>
                    </View>
                }
            </View>
        )
    }
}

export class FormDateTimePicker extends Component {

    static defaultProps = {
        callback: () => { },
        defaultValue: moment(),
    }

    render() {
        const { showRightIcon = true, getPickerOption = () => { }, label, timeString, required, last } = this.props;
        return (<View style={[styles.layout, last ? {} : styles.bottomBorder, {}]}>
            {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
            <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
            <TouchableOpacity
                onPress={() => {
                    this._pickerView.showPicker();
                }}
                style={[styles.innerlayout]}>
                <Text style={[styles.textStyle]}>{timeString}</Text>
                {showRightIcon ? <Image style={[styles.timeIcon]} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} /> : null}
            </TouchableOpacity>
            <PickerView
                defaultValue={this.props.defaultValue}
                pickerType={'SingleTime'}
                format={'YYYY-MM-DD HH:mm:ss'}
                ref={ref => (this._pickerView = ref)}
                callback={(resultMoment) => {
                    // console.log(resultMoment.format('YYYY-MM-DD HH:mm:ss'));
                    this.props.callback(resultMoment);
                }}
            />
        </View>)
    }
}

const styles = StyleSheet.create({
    layoutWithBottomBorder: {
        flexDirection: 'row',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    layout: {
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
    textStyle: {
        fontSize: 14,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
    },
})