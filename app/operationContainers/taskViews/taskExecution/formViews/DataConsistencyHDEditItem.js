/*
 * @Description: 数据一致性（小时日均数据）记录 编辑
 * @LastEditors: hxf
 * @Date: 2021-12-16 16:59:35
 * @LastEditTime: 2024-07-01 19:12:02
 * @FilePath: /SDLMainProject37_1/app/operationContainers/taskViews/taskExecution/formViews/DataConsistencyHDEditItem.js
 */

import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, setPlatformValue } from '../../../../utils';
import FormInput from '../components/FormInput';
import { FormInputWidthUnit, SystemPlatformDataWidthUnit } from './DataConsistencyEditItem';

@connect(({ dataConsistencyModel }) => ({
    hdEditstatus: dataConsistencyModel.hdEditstatus,
    hDate: dataConsistencyModel.hDate, // 表单日期 小时
    dDate: dataConsistencyModel.dDate // 表单日期 日
}))
export default class DataConsistencyHDEditItem extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '数据一致性（小时日均数据）记录',
            title: '数据一致性记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            ...SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item'], {})
        };
    }

    cancelButton = () => {};

    confirm = () => {
        const { item } = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {});
        this.props.dispatch(
            createAction('dataConsistencyModel/deleteDataConsistencyRecordNew')({
                params: {
                    ZiID: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'ID'], ''),
                    DataType: item.DataType
                }
            })
        );
    };

    render() {
        const { item, columnList = [], unitList = [], platformTypeList = [] } = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {});
        let options = {
            headTitle: '提示',
            messText: '确认删除该数据一致性记录吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1, backgroundColor: globalcolor.backgroundGrey, paddingLeft: 12 }]}>
                <Text style={[styles.title, { marginTop: 12 }]}>{item.PollutantName}</Text>
                <ScrollView>
                    <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center', backgroundColor: globalcolor.white, paddingHorizontal: 6, marginTop: 12 }]}>
                        {columnList.map((rowItem, rowIndex) => {
                            if (rowItem.type == 3) {
                                return (
                                    <FormInputWidthUnit
                                        key={`a${rowIndex}`}
                                        last={columnList.length - 1 == rowIndex}
                                        label={rowItem.key}
                                        selectorPlaceHolder="请选择单位"
                                        textPlaceHolder="当前数值"
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(this.state[rowItem.key], 1),
                                            dataArr: unitList,
                                            onSelectListener: item => {
                                                let temp = {};
                                                temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], item.Name, 1);
                                                this.setState(temp);
                                            }
                                        }}
                                        showText={getPlatformValue(this.state[rowItem.key], 1)}
                                        textValue={getPlatformValue(this.state[rowItem.key], 0)}
                                        onChangeText={text => {
                                            let temp = {};
                                            temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], text, 0);
                                            this.setState(temp);
                                        }}
                                    />
                                );
                            } else if (rowItem.type == 4) {
                                return (
                                    <SystemPlatformDataWidthUnit
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        key={`key${rowIndex}`}
                                        label={rowItem.key}
                                        textPlaceHolder="当前数值"
                                        textValue={getPlatformValue(this.state[rowItem.key], 1)}
                                        onChangeText={text => {
                                            let temp = {};
                                            temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], text, 1, 3);
                                            this.setState(temp);
                                        }}
                                        option1={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(this.state[rowItem.key], 0, 3),
                                            dataArr: platformTypeList,
                                            onSelectListener: item => {
                                                let temp = {};
                                                temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], item.Name, 0, 3);
                                                this.setState(temp);
                                            }
                                        }}
                                        showText1={getPlatformValue(this.state[rowItem.key], 0, 3)}
                                        selectorPlaceHolder1={'请选择平台'}
                                        option2={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(this.state[rowItem.key], 2, 3),
                                            dataArr: unitList,
                                            onSelectListener: item => {
                                                let temp = {};
                                                temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], item.Name, 2, 3);
                                                this.setState(temp);
                                            }
                                        }}
                                        showText2={getPlatformValue(this.state[rowItem.key], 2, 3)}
                                        selectorPlaceHolder2={'请选择单位'}
                                    />
                                );
                            } else {
                                return (
                                    <FormInput
                                        label={rowItem.key}
                                        placeholder="请记录"
                                        keyboardType="default"
                                        value={this.state[rowItem.key]}
                                        onChangeText={text => {
                                            let temp = {};
                                            temp[rowItem.key] = text;
                                            this.setState(temp);
                                        }}
                                    />
                                );
                            }
                        })}
                    </View>
                </ScrollView>
                <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center' }]}>
                    {SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'ID'], '') != '' ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                            onPress={() => {
                                this.refs.doAlert.show();
                            }}
                        >
                            <View style={styles.button}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                        onPress={() => {
                            let result = {};
                            result['PollutantCode'] = this.state['PollutantCode'];
                            result['PollutantName'] = this.state['PollutantName'];
                            result['DataTime'] = this.props.hDate;
                            if (item.DataType == 2) {
                                // 小时
                                result['DataTime'] = this.props.hDate;
                            } else if (item.DataType == 3) {
                                // 日
                                result['DataTime'] = this.props.dDate;
                            }
                            columnList.map((rowItem, rowIndex) => {
                                if (rowItem.type == 3) {
                                    const haveChar = this.state[rowItem.key].indexOf(',') != -1;
                                    if (haveChar) {
                                        result[rowItem.key] = this.state[rowItem.key];
                                    } else {
                                        result[rowItem.key] = ',';
                                    }
                                } else if (rowItem.type == 4) {
                                    const haveChar = this.state[rowItem.key].indexOf(',') != -1;
                                    if (haveChar) {
                                        result[rowItem.key] = this.state[rowItem.key];
                                    } else {
                                        result[rowItem.key] = ',,';
                                    }
                                } else {
                                    result[rowItem.key] = this.state[rowItem.key];
                                }
                            });
                            result.DataType = item.DataType;
                            this.props.dispatch(createAction('dataConsistencyModel/addDataConsistencyRecordNew')({ record: result }));
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.hdEditstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.hdEditstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        lineHeight: 24,
        fontSize: 15,
        color: '#333333'
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    }
});
