/*
 * @Description: 试剂更换记录编辑页面
 * @LastEditors: hxf
 * @Date: 2021-11-22 16:18:28
 * @LastEditTime: 2024-09-25 21:01:47
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/PoStandardLiquidReplaceForm.js
 */

//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, ShowToast, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../../../utils';
import { PickerSingleTimeTouchable, AlertDialog, StatusPage, SimplePicker, Touchable, SimpleLoadingComponent } from '../../../../components';
import Picker from 'react-native-picker';
import FormPicker from '../components/FormPicker';
import FormInput from '../components/FormInput';
import { getToken } from '../../../../dvapack/storage';
/**
 * 试剂更换记录编辑页面
 */
const saveItem = 0;
const deleteItem = 1;
@connect(({ taskModel }) => ({
    standardLiquidRepalceRecordList: taskModel.standardLiquidRepalceRecordList,
    standardLiquidRepalceRecordListResult: taskModel.standardLiquidRepalceRecordListResult,
    PartList: taskModel.PartList,
    editstatus: taskModel.editstatus
}))
class PoStandardLiquidReplaceForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '试剂更换记录表',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    getPartName = (code) => {
        let index = this.props.PartList.findIndex((item) => {
            return item.code == code;
        })
        if (index == -1) {
            return '请选择'
        } else {
            return this.props.PartList[index].name
        }
    }

    constructor(props) {
        super(props);
        const user = getToken();
        if (props.route.params.params.index == -1) {
            this.state = {
                PartType: SentencedToEmpty(this, ['props', 'route', 'params', 'params', 'item', 'PartType'], SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1),// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
                PartName: this.getPartName(SentencedToEmpty(this, ['props', 'route', 'params', 'params', 'item', 'PartType'], 1)),// 供货类型显示字段
                // pointEquipmentSelected:null, // 需要更换试剂的设备
                ReplaceDate: moment().toDate(), //更换时间
                showReplaceDate: moment().format('YYYY-MM-DD'),
                StandardGasName: '', //试剂名称
                Unit: '', //单位
                Num: '', //数量
                Supplier: '', //供应商
                AnotherTimeOfChange: moment()
                    .add(1, 'years')
                    .toDate(), //有效期
                showAnotherTimeOfChange: moment()
                    .add(1, 'years')
                    .format('YYYY-MM-DD'), //有效期
                FormMainID: '',
                dialogType: saveItem,
                gasStrengthList: [],
                PartCode: '', // 存货编码
                Component: '' // 规格型号
            };
        } else {
            let item = this.props.standardLiquidRepalceRecordList[props.route.params.params.index];
            this.state = {
                PartType: SentencedToEmpty(item, ['PartType'], SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1),// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
                PartName: this.getPartName(SentencedToEmpty(item, ['PartType'], 1)),// 供货类型显示字段   
                // pointEquipmentSelected:{EquipmentName:item.EquipmentName}, // 需要更换试剂的设备
                ReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                showReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                StandardGasName: item.StandardLiquidName, //试剂名称
                Unit: item.Unit, //单位
                Num: item.Num, //数量
                Supplier: item.Supplier, //供应商
                AnotherTimeOfChange: moment(item.AnotherTimeOfChange, 'YYYY-MM-DD HH:mm:ss').toDate(), //有效期
                showAnotherTimeOfChange: moment(item.AnotherTimeOfChange, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), //有效期
                FormMainID: item.FormMainID,
                dialogType: saveItem,
                gasStrengthList: [],
                PartCode: item.InventoryCode, // 存货编码
                Component: item.LiquidStrength // 规格型号
            };
        }
    }

    getReplaceDateOption = () => {
        return {
            defaultTime: this.state.ReplaceDate,
            type: 'day',
            onSureClickListener: time => {
                this.setState({
                    ReplaceDate: time,
                    showReplaceDate: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };

    getAnotherTimeOfChangeOption = () => {
        return {
            defaultTime: this.state.AnotherTimeOfChange,
            type: 'day',
            onSureClickListener: time => {
                this.setState({
                    AnotherTimeOfChange: time,
                    showAnotherTimeOfChange: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };
    cancelButton = () => { };
    confirm = () => {
        //删除记录
        this.props.dispatch(
            createAction('taskModel/delItemStandardLiquidRepalce')({
                index: this.props.route.params.params.index,
                callback: () => {
                    this.props.dispatch(createAction('taskModel/getStandardLiquidRepalceRecordList')({ createForm: false }));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    render() {
        const user = getToken();
        var options = {
            headTitle: '提示',
            messText: '确认删除该试剂更换记录吗？',
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
            <StatusPage
                status={this.props.standardLiquidRepalceRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                {/* <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                </KeyboardAwareScrollView> */}
                <ScrollView
                    style={[{ width: SCREEN_WIDTH, flex: 1 }]}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginVertical: 22, justifyContent: 'center' }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 24,
                                    paddingHorizontal: 24,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            {/* <View style={[styles.layoutWithBottomBorder,{alignItems:'center'}]}>
                                <Text style={[styles.labelStyle]}>设备名称：</Text>
                                <Text style={[styles.labelStyle,{color:'red'} ]}>*</Text>
                                <View style={[styles.innerlayout]}>
                                    <Touchable
                                        onPress={() => {
                                            this.props.dispatch(createAction('taskModel/updateState')({pointEquipmentResult:{status:-1}}))
                                            this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'PointEquipmentList',
                                                    params: {
                                                        tableType: 'PoStandardLiquidReplaceForm',
                                                        callback: item => {
                                                            this.setState({
                                                                pointEquipmentSelected:item
                                                            });
                                                        }
                                                    }
                                                })
                                            );
                                        }}
                                        style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse', alignItems:'center', height: 24, }}
                                    >
                                        <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24, }}>
                                            {SentencedToEmpty(this.state.pointEquipmentSelected,['EquipmentName'],'请选择') }
                                        </Text>
                                    </Touchable>
                                    <Image style={{ tintColor: globalcolor.blue, height: 16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_right.png')} />
                                </View>
                            </View> */}
                            <View style={[styles.layoutWithBottomBorder]}>
                                <PickerSingleTimeTouchable option={this.getReplaceDateOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                                    <Text style={[styles.labelStyle]}>更换日期：</Text>
                                    <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.showReplaceDate}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </PickerSingleTimeTouchable>
                            </View>
                            <View style={[styles.layoutWithBottomBorder]}>
                                <PickerSingleTimeTouchable option={this.getAnotherTimeOfChangeOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                                    <Text style={[styles.labelStyle]}>有效日期：</Text>
                                    <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.showAnotherTimeOfChange}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </PickerSingleTimeTouchable>
                            </View>
                            {
                                SentencedToEmpty(user, ['IsShowTask'], false) ? null
                                    : <View style={{ height: 45, width: SCREEN_WIDTH - 72 }}>
                                        <FormPicker
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.textBlack
                                            }}
                                            propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 15 }}
                                            // propsRightIconStyle={{tintColor:'#999999',width: 14, height: 14, marginRight: 5}}
                                            label="供货来源"
                                            defaultCode={this.state.PartType}
                                            option={{
                                                codeKey: 'code',
                                                nameKey: 'name',
                                                defaultCode: this.state.PartType,
                                                dataArr: this.props.PartList,
                                                onSelectListener: item => {
                                                    this.setState({
                                                        PartType: item.code, PartName: item.name
                                                        , Component: ''
                                                        , Supplier: ''
                                                        , modelH: '',
                                                        StandardGasName: '',
                                                        Unit: '',
                                                        PartCode: ''
                                                    });
                                                }
                                            }}
                                            showText={this.state['PartName']}
                                            placeHolder="请选择"
                                        />
                                    </View>
                            }
                            {/* 存货编码 */}
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder, { alignItems: 'center' }]}>
                                    <Text style={[styles.labelStyle]}>存货编码：</Text>
                                    <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Touchable
                                            onPress={() => {
                                                // this.props.dispatch(createAction('taskModel/updateState')({ selectablePart: { status: -1 } }));
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'SelectSearchList',
                                                        params: {
                                                            tableType: 'StandardLiquid',
                                                            callback: item => {
                                                                this.setState({
                                                                    PartCode: item['StandardGasCode'],
                                                                    StandardGasName: item['StandardGasName'],
                                                                    Unit: item['Unit'],
                                                                    Supplier: item['Manufacturer'],
                                                                    GasStrength: item['StandardGasDensity'],
                                                                    Component: item['Component']
                                                                });
                                                            }
                                                        }
                                                    })
                                                );
                                            }}
                                            style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse', alignItems: 'center', height: 24 }}
                                        >
                                            <Text style={{ textAlign: 'right', color: globalcolor.datepickerGreyText, width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 13, fontSize: 14, flex: 1, height: 24, lineHeight: 24 }}>
                                                {this.state.PartCode == '' ? '请选择' : this.state.PartCode}
                                            </Text>
                                        </Touchable>
                                        <Image style={{ tintColor: globalcolor.blue, height: 16 }} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                                    </View>
                                </View> : null
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>试剂名称：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.StandardGasName == '' ? '--' : this.state.StandardGasName}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 45, width: SCREEN_WIDTH - 72 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.textBlack
                                            }}
                                            propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                                            label={'试剂名称'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.StandardGasName}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['StandardGasName'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder, { alignItems: 'center' }]}>
                                    <Text style={[styles.labelStyle]}>规格型号：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.Component == '' ? '' : this.state.Component}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 45, width: SCREEN_WIDTH - 72 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.textBlack
                                            }}
                                            propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                                            label={'规格型号'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.Component}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['Component'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>供应商：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.Supplier == '' ? '请填写供应商' : this.state.Supplier}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 45, width: SCREEN_WIDTH - 72 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.textBlack
                                            }}
                                            propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                                            label={'供应商'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.Supplier}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['Supplier'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>数量：</Text>
                                <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text>
                                <TouchableOpacity style={[styles.touchable]}>
                                    <View style={[styles.innerlayout]}>
                                        <TextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.Num + ''}
                                            ref={ref => (this._inputMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请输入数量'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    Num: text
                                                });
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={[{
                                    flexDirection: 'row',
                                    height: 45,
                                    marginTop: 10,
                                    alignItems: 'center'
                                }]}>
                                    <Text style={[styles.labelStyle]}>单位：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.Unit == '' ? '请选择单位' : this.state.Unit}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 45, width: SCREEN_WIDTH - 72, marginBottom: 10 }}>
                                        <FormInput
                                            last={true}
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.textBlack
                                            }}
                                            propsTextStyle={{ color: globalcolor.datepickerGreyText, fontSize: 14, marginRight: 0 }}
                                            label={'单位'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.Unit}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['Unit'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                        </View>
                        {this.props.route.params.params.index != -1 ? (
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
                                /**
                                废弃判空条件
                                 else if (this.state.GasStrength == '') {
                                    ShowToast('未填写试剂浓度！');
                                }
                                 */
                                //添加修改试剂更换记录
                                if (!this.state.ReplaceDate) {
                                    ShowToast('试剂更换时间不能为空！');
                                } else if (!this.state.AnotherTimeOfChange || this.state.showAnotherTimeOfChange == '请选择日期') {
                                    ShowToast('请选择有效日期！');
                                } else if (this.state.StandardGasName == '') {
                                    ShowToast('未选择试剂！');
                                } else if (this.state.PartType == 2 && this.state.Unit == '') {
                                    ShowToast('单位不能为空！');
                                } else if (this.state.Num == -1 || this.state.Num == '') {
                                    ShowToast('未填写试剂数量！');
                                    // } else if (!(/^\d+(\.\d+)?$/.test(this.state.Num))) {
                                } else if (!(/^[1-9]\d*$/.test(this.state.Num))) {
                                    ShowToast('数量只支持整数！');
                                } else if (this.state.Supplier == '') {
                                    ShowToast('未填写供应商！');
                                } else if (this.state.Component == '') {
                                    ShowToast('未填写规格型号！');
                                } else {
                                    this.props.dispatch(
                                        createAction('taskModel/saveItemStandardLiquidRepalce')({
                                            index: this.props.route.params.params.index,
                                            record: {
                                                PartType: this.state.PartType,
                                                // EquipmentName: SentencedToEmpty(this.state.pointEquipmentSelected,['EquipmentName'],''),//设备厂家
                                                InventoryCode: this.state.PartCode, // 存货编码
                                                AnotherTimeOfChange: moment(this.state.AnotherTimeOfChange).format('YYYY-MM-DD') + ' 23:59:59', //  有效期
                                                ReplaceDate: moment(this.state.ReplaceDate).format('YYYY-MM-DD HH:mm:ss'), // 更换日期
                                                StandardLiquidName: this.state.StandardGasName, //试剂名称
                                                LiquidStrength: this.state.Component, //规格型号
                                                Unit: this.state.Unit, //单位
                                                Num: this.state.Num, //数量
                                                Supplier: this.state.Supplier, //供应商
                                                dialogType: saveItem
                                            },
                                            callback: () => {
                                                this.props.dispatch(createAction('taskModel/getStandardLiquidRepalceRecordList')({ createForm: false }));
                                                this.props.dispatch(NavigationActions.back());
                                            }
                                        })
                                    );
                                }
                            }}
                        >
                            <View style={styles.button}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
                <AlertDialog options={options} ref="doAlert" />
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalcolor.backgroundGrey
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        minHeight: 45,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 15,
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
        fontSize: 15,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right',
        lineHeight: 19
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
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

//make this component available to the app
export default PoStandardLiquidReplaceForm;
