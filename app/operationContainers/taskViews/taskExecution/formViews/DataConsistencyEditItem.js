/*
 * @Description: 数据一致性（实时数据）记录 编辑页面
 * @LastEditors: hxf
 * @Date: 2021-12-13 17:00:21
 * @LastEditTime: 2024-09-25 18:39:05
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/DataConsistencyEditItem.js
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, SentencedToEmpty, createNavigationOptions, NavigationActions, setPlatformValue, getPlatformValue } from '../../../../utils';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import { AlertDialog, PickerTouchable, SimpleLoadingComponent, SimpleLoadingView } from '../../../../components';

@connect(({ dataConsistencyModel }) => ({
    editstatus: dataConsistencyModel.editstatus,
    date: dataConsistencyModel.date // 表单日期
}))
export default class DataConsistencyEditItem extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '数据一致性（实时数据）记录',
            title: '数据一致性记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            ...SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {})
        };
    }

    cancelButton = () => { };

    confirm = () => {
        this.props.dispatch(
            createAction('dataConsistencyModel/deleteDataConsistencyRecord')({
                params: { ZiID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ID'], '') }
            })
        );
    };

    render() {
        const { item, columnList = [], unitList = [], platformTypeList = [] } = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
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
                <KeyboardAwareScrollView>
                    <ScrollView>
                        <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center', backgroundColor: globalcolor.white, paddingHorizontal: 6, marginTop: 12 }]}>
                            {columnList.map((rowItem, rowIndex) => {
                                if (rowItem.type == 1) {
                                    return (
                                        <FormInput
                                            last={columnList.length - 1 == rowIndex}
                                            label={rowItem.key}
                                            placeholder="当前数值"
                                            keyboardType="default"
                                            value={this.state[rowItem.key]}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp[rowItem.key] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    );
                                } else if (rowItem.type == 2) {
                                    return (
                                        <FormPicker
                                            last={columnList.length - 1 == rowIndex}
                                            label="单位"
                                            defaultCode={this.state[rowItem.key]}
                                            option={{
                                                codeKey: 'Name',
                                                nameKey: 'Name',
                                                defaultCode: this.state[rowItem.key],
                                                dataArr: unitList,
                                                onSelectListener: item => {
                                                    let temp = {};
                                                    temp[rowItem.key] = item.Name;
                                                    this.setState(temp);
                                                }
                                            }}
                                            showText={this.state[rowItem.key]}
                                            placeHolder="请选择"
                                        />
                                    );
                                } else if (rowItem.type == 3) {
                                    return (
                                        <SystemPlatformData
                                            last={columnList.length - 1 == rowIndex}
                                            label={rowItem.key}
                                            selectorPlaceHolder="请选择平台"
                                            textPlaceHolder="当前数值"
                                            option={{
                                                codeKey: 'Name',
                                                nameKey: 'Name',
                                                defaultCode: getPlatformValue(this.state[rowItem.key], 0),
                                                dataArr: platformTypeList,
                                                onSelectListener: item => {
                                                    let temp = {};
                                                    temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], item.Name, 0);
                                                    this.setState(temp);
                                                }
                                            }}
                                            showText={getPlatformValue(this.state[rowItem.key], 0)}
                                            textValue={getPlatformValue(this.state[rowItem.key], 1)}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp[rowItem.key] = setPlatformValue(this.state[rowItem.key], text, 1);
                                                this.setState(temp);
                                            }}
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
                </KeyboardAwareScrollView>
                <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center' }]}>
                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ID'], '') != '' ? (
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
                            result['DataTime'] = this.props.date;
                            columnList.map((rowItem, rowIndex) => {
                                if (rowItem.type == 3) {
                                    const haveChar = this.state[rowItem.key].indexOf(',') != -1;
                                    if (haveChar) {
                                        result[rowItem.key] = this.state[rowItem.key];
                                    } else {
                                        result[rowItem.key] = ',';
                                    }
                                } else {
                                    result[rowItem.key] = this.state[rowItem.key];
                                }
                            });
                            this.props.dispatch(createAction('dataConsistencyModel/addDataConsistencyRecord')({ record: result }));
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
                {/* 以后补充提交和删除的loading {this.props.taskSingResult.status == -1 ? <SimpleLoadingView message={'打卡中'} /> : null} */}
            </View>
        );
    }
}

export class FormInputWidthUnit extends Component {
    render() {
        const {
            last = false,
            label = '标题',
            option = {
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            showText = '',
            selectorPlaceHolder = '请选择',
            required = false,
            keyboardType = 'default',
            textPlaceHolder = '请输入',
            textValue = '',
            onChangeText = () => { }
        } = this.props;
        return (
            <View style={[styles.layoutStyle, styles.bottomBorder]}>
                {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                <View style={[styles.touchable, {}]}>
                    <View style={[styles.innerlayout, { height: 45 }]}>
                        <TextInput
                            keyboardType={keyboardType}
                            value={textValue + ''}
                            style={[
                                styles.textStyle,
                                {
                                    flex: 1,
                                    ...Platform.select({
                                        ios: {
                                            lineHeight: 17
                                        },
                                        android: {}
                                    })
                                }
                            ]}
                            placeholder={textPlaceHolder}
                            onChangeText={text => {
                                onChangeText(text);
                            }}
                        />
                    </View>
                    <View
                        style={[
                            {
                                flexDirection: 'row',
                                height: 45,
                                alignItems: 'center'
                            }
                        ]}
                    >
                        <PickerTouchable option={option} style={{ flexDirection: 'row', height: 44, alignItems: 'center' }}>
                            <Text style={{ textAlign: 'right', color: '#4AA0FF', paddingVertical: 0, marginRight: 9, fontSize: 14, height: 44, lineHeight: 43 }}>{showText == '' ? selectorPlaceHolder : showText}</Text>
                            <Image style={{ tintColor: '#4AA0FF', height: 16, width: 16 }} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                        </PickerTouchable>
                    </View>
                </View>
            </View>
        );
    }
}

class SystemPlatformData extends Component {
    render() {
        const {
            last = false,
            label = '标题',
            option = {
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            defaultCode = '',
            showText = '',
            selectorPlaceHolder = '请选择',
            required = false,
            keyboardType = 'default',
            textPlaceHolder = '请输入',
            textValue = '',
            onChangeText = () => { }
        } = this.props;
        // return(<View style={[styles.layoutStyle,last?{}:styles.bottomBorder]}>
        //     {required?<Text style={[styles.labelStyle,{color:'red'} ]}>*</Text>:null}
        //     <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
        //     <View style={[styles.innerlayout]}>
        //         <PickerTouchable option={option} style={{flexDirection:'row',height:45,alignItems:'center', flex:1}}>
        //             <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }}>
        //                 {showText == '' ? selectorPlaceHolder : showText}
        //             </Text>
        //             <Image style={{ tintColor: globalcolor.blue, height: 16, width:16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_down.png')} />
        //         </PickerTouchable>
        //     </View>
        //     <View style={[styles.innerlayout,{marginLeft:8}]}>
        //         <TextInput
        //             keyboardType={keyboardType}
        //             value={textValue + ''}
        //             style={[styles.textStyle
        //                 , { flex: 1,
        //                     borderTopWidth:1,borderTopColor:globalcolor.borderBottomColor,
        //                     borderLeftWidth:1,borderLeftColor:globalcolor.borderBottomColor,
        //                     borderRightWidth:1,borderRightColor:globalcolor.borderBottomColor, }
        //                 ,last?{borderBottomWidth:1,borderBottomColor:globalcolor.borderBottomColor}:{}
        //             ]}
        //             placeholder={textPlaceHolder}
        //             onChangeText={text => {
        //                 onChangeText(text);
        //             }}
        //         />
        //     </View>
        // </View>)
        return (
            <View style={{ width: '100%' }}>
                <View style={[styles.layoutStyle, styles.bottomBorder, { justifyContent: 'space-between' }]}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                    <View style={[styles.innerlayout]}>
                        <PickerTouchable option={option} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                            <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24 }}>
                                {showText == '' ? selectorPlaceHolder : showText}
                            </Text>
                            <Image style={{ tintColor: globalcolor.blue, height: 16, width: 16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_down.png')} />
                        </PickerTouchable>
                    </View>
                </View>
                <View style={[styles.layoutStyle, styles.bottomBorder, { justifyContent: 'space-between', marginLeft: 10 }]}>
                    <Text style={[styles.labelStyle]}>{`${'当前数值'}：`}</Text>
                    <View style={[styles.innerlayout, { marginLeft: 8 }]}>
                        <TextInput
                            keyboardType={keyboardType}
                            value={textValue + ''}
                            style={[styles.textStyle, { flex: 1 }]}
                            placeholder={textPlaceHolder}
                            onChangeText={text => {
                                onChangeText(text);
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export class SystemPlatformDataWidthUnit extends Component {
    render() {
        const {
            key = '1',
            last = false,
            label = '标题',
            required = false,
            option1 = {
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            showText1 = '',
            selectorPlaceHolder1 = '请选择',
            option2 = {
                codeKey: 'code',
                nameKey: 'name',
                defaultCode: '',
                dataArr: [],
                onSelectListener: item => {
                    console.log(item);
                }
            },
            showText2 = '',
            selectorPlaceHolder2 = '请选择',
            keyboardType = 'default',
            textPlaceHolder = '请输入',
            textValue = '',
            onChangeText = () => { }
        } = this.props;
        // return(<View key style={[{width:'100%'}]}>
        //     <View style={[{flexDirection:'row'}]}>
        //         {required?<Text style={[styles.labelStyle,{color:'red'} ]}>*</Text>:null}
        //         <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
        //     </View>
        //     <View style={[styles.layoutStyle,styles.bottomBorder,{borderTopWidth:1,borderTopColor: globalcolor.borderBottomColor}]}>
        //         <View style={[styles.innerlayout]}>
        //             <PickerTouchable option={option1} style={{flexDirection:'row',height:45,alignItems:'center', flex:1}}>
        //                 <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }}>
        //                     {showText1 == '' ? selectorPlaceHolder1 : showText1}
        //                 </Text>
        //                 <Image style={{ tintColor: globalcolor.blue, height: 16, width:16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_down.png')} />
        //             </PickerTouchable>
        //         </View>
        //         <View style={[styles.innerlayout,{marginLeft:8}]}>
        //             <TextInput
        //                 keyboardType={keyboardType}
        //                 value={textValue + ''}
        //                 style={[styles.textStyle
        //                     , { flex: 1,
        //                         borderLeftWidth:1,borderLeftColor:globalcolor.borderBottomColor,
        //                         borderRightWidth:1,borderRightColor:globalcolor.borderBottomColor, }
        //                     ,last?{borderBottomWidth:1,borderBottomColor:globalcolor.borderBottomColor}:{}
        //                 ]}
        //                 placeholder={textPlaceHolder}
        //                 onChangeText={text => {
        //                     onChangeText(text);
        //                 }}
        //             />
        //         </View>
        //         <View style={[styles.innerlayout]}>
        //             <PickerTouchable option={option2} style={{flexDirection:'row',height:45,alignItems:'center', flex:1}}>
        //                 <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }}>
        //                     {showText2 == '' ? selectorPlaceHolder2 : showText2}
        //                 </Text>
        //                 <Image style={{ tintColor: globalcolor.blue, height: 16, width:16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_down.png')} />
        //             </PickerTouchable>
        //         </View>
        //     </View>
        // </View>)
        return (
            <View style={[{ width: '100%' }]}>
                <View style={[styles.layoutStyle, styles.bottomBorder, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                    <Text style={[styles.labelStyle]}>{`${label}：`}</Text>
                    <View style={[styles.innerlayout]}>
                        <PickerTouchable option={option1} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                            <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24 }}>
                                {showText1 == '' ? selectorPlaceHolder1 : showText1}
                            </Text>
                            <Image style={{ tintColor: globalcolor.datepickerGreyText, height: 16, width: 16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_down.png')} />
                        </PickerTouchable>
                    </View>
                </View>
                <View style={[styles.layoutStyle, styles.bottomBorder, { marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={[styles.labelStyle]}>{`${'当前数值'}：`}</Text>
                    <View style={[styles.innerlayout, { marginLeft: 8 }]}>
                        <TextInput
                            keyboardType={keyboardType}
                            value={textValue + ''}
                            style={[styles.textStyle]}
                            placeholder={textPlaceHolder}
                            onChangeText={text => {
                                onChangeText(text);
                            }}
                        />
                    </View>
                    <View style={[styles.innerlayout]}>
                        <PickerTouchable option={option2} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                            <Text style={{ textAlign: 'right', color: globalcolor.blue, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24 }}>
                                {showText2 == '' ? selectorPlaceHolder2 : showText2}
                            </Text>
                            <Image style={{ tintColor: globalcolor.blue, height: 16, width: 16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_right.png')} />
                        </PickerTouchable>
                    </View>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    title: {
        lineHeight: 24,
        fontSize: 15,
        color: '#333333'
    },
    layoutStyle: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor
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
        height: 44,
        lineHeight: 22,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    }
});
