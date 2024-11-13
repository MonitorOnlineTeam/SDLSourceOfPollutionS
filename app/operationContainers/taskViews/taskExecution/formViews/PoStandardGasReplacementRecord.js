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
 * 标准气体更换记录编辑页面
 */
const saveItem = 0;
const deleteItem = 1;
@connect(({ taskModel }) => ({
    editstatus: taskModel.editstatus,
    gasRecordList: taskModel.gasRecordList,
    standardGasList: taskModel.standardGasList,
    PartList: taskModel.PartList,
    gasRecordListStatus: taskModel.gasRecordListStatus
}))
class PoStandardGasReplacementRecord extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '标准物质更换记录表',
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
                PartType: SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1,// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
                PartName: this.getPartName(1),// 供货类型显示字段
                ReplaceDate: moment().toDate(), //更换时间
                showReplaceDate: moment().format('YYYY-MM-DD'),
                StandardGasName: '', //标气名称
                GasStrength: '', //气体浓度（废弃)，当前表示 规格型号
                // Component: '', //规格型号
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
                PartCode: '' // 存货编码
            };
        } else {
            let item = this.props.gasRecordList[props.route.params.params.index];
            this.state = {
                PartType: SentencedToEmpty(item, ['PartType'], SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1),// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
                PartName: this.getPartName(SentencedToEmpty(item, ['PartType'], 1)),// 供货类型显示字段
                ReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                showReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                StandardGasName: item.StandardGasName, //标气名称
                GasStrength: item.GasStrength, //气体浓度（废弃) 当前表示 规格型号
                // Component:item.Component,//规格型号
                Unit: item.Unit, //单位
                Num: item.Num, //数量
                Supplier: item.Supplier, //供应商
                AnotherTimeOfChange: moment(item.AnotherTimeOfChange, 'YYYY-MM-DD HH:mm:ss').toDate(), //有效期
                showAnotherTimeOfChange: moment(item.AnotherTimeOfChange, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), //有效期
                FormMainID: item.FormMainID,
                dialogType: saveItem,
                gasStrengthList: [],
                PartCode: item.StandardGasBottleCode // 存货编码
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
    _showStandardGasPicker = (currentValue, callback) => {
        let values = [];
        this.props.standardGasList.map(item => {
            values.push(item.StandardGasName + '-' + item.Manufacturer + '-' + item.Unit);
        });
        let pickerData = values;
        let selectedValue = [values[0]];

        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '标准气体选择',
            wheelFlex: [1],
            pickerRowWidth: SCREEN_WIDTH - 40,
            onPickerConfirm: pickedValue => {
                callback(pickedValue[0]);
            },
            onPickerCancel: pickedValue => {
                // console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => { }
        });
        Picker.show();
    };
    cancelButton = () => { };
    confirm = () => {
        //删除记录
        this.props.dispatch(
            createAction('taskModel/delItemGas')({
                index: this.props.route.params.params.index,
                callback: () => {
                    this.props.dispatch(createAction('taskModel/getInfoGas')({ createForm: false }));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    getGasStrengthSelectOption = () => {
        let defaultCode = '';
        let defaultGasStrengthList = this.state.gasStrengthList;
        if (this.props.route.params.params.index != -1) {
            let selectedGas = this.props.gasRecordList[this.props.route.params.params.index];
            defaultCode = selectedGas.GasStrength;
            this.props.standardGasList.map((item, key) => {
                if (selectedGas.StandardGasName == item.StandardGasName && selectedGas.Supplier == item.Manufacturer) {
                    defaultGasStrengthList.push(item);
                }
            });
        }

        return {
            codeKey: 'StandardGasDensity',
            nameKey: 'StandardGasDensity',
            placeHolder: '请选择',
            defaultCode,
            disImage: true,
            dataArr: defaultGasStrengthList,
            onSelectListener: item => {
                this.setState({
                    GasStrength: item.StandardGasDensity
                });
            }
        };
    };

    getStandardGasSelectOption = () => {
        let defaultCode = '';
        let valueArr = [],
            itemArr = [];
        this.props.standardGasList.map((item, key) => {
            if (valueArr.indexOf(item.value) == -1) {
                valueArr.push(item.value);
                itemArr.push(item);
            }
        });
        if (this.props.route.params.params.index != -1) {
            let selectedGas = this.props.gasRecordList[this.props.route.params.params.index];
            itemArr.map((item, key) => {
                // if (selectedGas.StandardGasName == item.StandardGasName && selectedGas.Supplier == item.Manufacturer && selectedGas.GasStrength == item.StandardGasDensity) {
                //     defaultCode = item.StandardGasName;
                // }
                if (selectedGas.StandardGasName + '-' + selectedGas.Supplier + '-' + selectedGas.Unit == item.value) {
                    defaultCode = item.value;
                }
            });
        }
        return {
            codeKey: 'value',
            showName: 'StandardGasName',
            nameKey: 'value',
            placeHolder: '请选择',
            defaultCode,
            dataArr: itemArr,
            onSelectListener: item => {
                let gasStrengthList = this.state.gasStrengthList;
                gasStrengthList.length = 0;
                this.props.standardGasList.map(_item => {
                    if (_item.StandardGasName == item.StandardGasName && _item.Manufacturer == item.Manufacturer) {
                        gasStrengthList.push(_item);
                    }
                });
                this.setState({ StandardGasName: item.StandardGasName, Unit: item.Unit, Supplier: item.Manufacturer, gasStrengthList });
            }
        };
    };

    render() {
        const user = getToken();
        var options = {
            headTitle: '提示',
            messText: '确认删除该标气更换记录吗？',
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
                status={this.props.gasRecordListStatus.status}
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
                {/* <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}> */}
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
                            <View style={[styles.layoutWithBottomBorder]}>
                                <PickerSingleTimeTouchable option={this.getReplaceDateOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                                    <Text style={[styles.labelStyle]}>更换日期：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.showReplaceDate}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </PickerSingleTimeTouchable>
                            </View>
                            <View style={[styles.layoutWithBottomBorder, { marginBottom: 10 }]}>
                                <PickerSingleTimeTouchable option={this.getAnotherTimeOfChangeOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                                    <Text style={[styles.labelStyle]}>有效日期：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.showAnotherTimeOfChange}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </PickerSingleTimeTouchable>
                            </View>
                            {
                                SentencedToEmpty(user, ['IsShowTask'], false) ? null
                                    : <View style={[{ height: 43, width: SCREEN_WIDTH - 72 }, { marginBottom: 10 }]}>
                                        <FormPicker
                                            required={true}
                                            requireIconPosition={'left'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                // marginLeft:10,
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
                                                        , StandardGasName: '',
                                                        Unit: '',
                                                        PartCode: '',
                                                        Supplier: '',
                                                        GasStrength: ''
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
                                    <Text style={[{ fontSize: 15, color: 'red' }]}>*</Text>
                                    <Text style={[styles.labelStyle]}>存货编码：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Touchable
                                            onPress={() => {
                                                // this.props.dispatch(createAction('taskModel/updateState')({ selectablePart: { status: -1 } }));
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'SelectSearchList',
                                                        params: {
                                                            tableType: 'StandardGas',
                                                            callback: item => {
                                                                this.setState({
                                                                    PartCode: item['StandardGasCode'],
                                                                    StandardGasName: item['StandardGasName'],
                                                                    Unit: item['Unit'],
                                                                    Supplier: item['Manufacturer'],
                                                                    // GasStrength: item['StandardGasDensity']
                                                                    GasStrength: item['Component']
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
                                    <Text style={[styles.labelStyle]}>标准物质名称：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle, { lineHeight: 20 }]}>{this.state.StandardGasName == '' ? '--' : this.state.StandardGasName}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 72 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'left'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                // marginLeft:10,
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 0 }}
                                            label={'标准物质名称'}
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
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>供应商：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.Supplier == '' ? '请填写供应商' : this.state.Supplier}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 72 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'left'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 0 }}
                                            label={'供应商'}
                                            placeholder="请输入供应商"
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

                            <View style={[styles.layoutWithBottomBorder, { alignItems: 'center' }]}>
                                {/* <Text style={[styles.labelStyle]}>浓度：</Text> */}
                                <Text style={[{ fontSize: 15, color: 'red' }]}>*</Text>
                                <Text style={[styles.labelStyle]}>规格型号：</Text>
                                <TextInput
                                    value={this.state.GasStrength}
                                    ref={ref => (this._inputMachineHaltReason = ref)}
                                    style={[styles.textStyle, { flex: 1, lineHeight: 20, }]}
                                    placeholder={'请填写规格型号'}
                                    placeholderTextColor={'#999999'}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            GasStrength: text
                                        });
                                    }}
                                />
                                {/* <View style={[styles.innerlayout]}>
                                    <Text style={[styles.textStyle]}>{this.state.GasStrength == '' ? '' : this.state.GasStrength}</Text>
                                </View> */}
                                {/* <SimplePicker textStyle={styles.textStyle} option={this.getGasStrengthSelectOption()} style={[{ height: 25, flex: 1, paddingRight: 0, justifyContent: 'flex-end' }]} />
                                <Image style={{ width: 14, height: 14 }} source={require('../../../../images/right.png')} /> */}
                            </View>

                            <View style={[styles.layoutWithBottomBorder, { flexDirection: 'row', height: 45, alignItems: 'center' }]}>
                                <Text style={[{ fontSize: 15, color: 'red' }]}>*</Text>
                                <Text style={[styles.labelStyle]}>数量：</Text>
                                <TouchableOpacity style={[styles.touchable]}>
                                    <View style={[styles.innerlayout]}>
                                        <TextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.Num + ''}
                                            ref={ref => (this._inputMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请输入数量'}
                                            placeholderTextColor={'#999999'}
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
                                this.state.PartType == 1 ? <View style={[styles.layoutWithBottomBorder, { marginBottom: 10 }]}>
                                    <Text style={[{ fontSize: 15, color: 'red' }]}>*</Text>
                                    <Text style={[styles.labelStyle]}>单位：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.Unit == '' ? '请选择单位' : this.state.Unit}</Text>
                                    </View>
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 72, marginBottom: 10 }}>
                                        <FormInput
                                            last={true}
                                            required={true}
                                            requireIconPosition={'left'}
                                            hasColon={true}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 0 }}
                                            label={'单位'}
                                            placeholder="请输入单位"
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
                                //添加修改标气更换记录
                                if (!this.state.ReplaceDate) {
                                    ShowToast('标气更换时间不能为空！');
                                } else if (!this.state.AnotherTimeOfChange || this.state.showAnotherTimeOfChange == '请选择日期') {
                                    ShowToast('请选择有效日期！');
                                } else if (this.state.PartType == '') {
                                    ShowToast('请选择供货来源');
                                } else if (this.state.StandardGasName == '') {
                                    ShowToast('未选择标气！');
                                } else if (this.state.GasStrength == '') {
                                    // ShowToast('未填写标气浓度！');
                                    ShowToast('未填写标气规格型号！');
                                } else if (this.state.PartType == 2 && this.state.Unit == '') {
                                    ShowToast('单位不能为空！');
                                } else if (this.state.Num == -1 || this.state.Num == '') {
                                    ShowToast('未填写标气数量！');
                                    // } else if (!(/^\d+(\.\d+)?$/.test(this.state.Num))) {
                                } else if (!(/^[1-9]\d*$/.test(this.state.Num))) {
                                    //^[1-9]\d*$
                                    ShowToast('数量只支持整数！');
                                } else if (this.state.Supplier == '') {
                                    ShowToast('未填写供应商！');
                                } else {
                                    this.props.dispatch(
                                        createAction('taskModel/saveItemGas')({
                                            index: this.props.route.params.params.index,
                                            record: {
                                                PartType: this.state.PartType,
                                                StandardGasBottleCode: this.state.PartCode, // 存货编码
                                                AnotherTimeOfChange: moment(this.state.AnotherTimeOfChange).format('YYYY-MM-DD') + ' 23:59:59', //  有效期
                                                ReplaceDate: moment(this.state.ReplaceDate).format('YYYY-MM-DD HH:mm:ss'), // 更换日期
                                                StandardGasName: this.state.StandardGasName, //标气名称
                                                // GasStrength: this.state.GasStrength, //气体浓度
                                                // Component: this.state.Component, //规格型号
                                                GasStrength: this.state.GasStrength, //规格型号 彭宇说的用浓度字段存规格型号
                                                Unit: this.state.Unit, //单位
                                                Num: this.state.Num, //数量
                                                Supplier: this.state.Supplier, //供应商
                                                dialogType: saveItem
                                            },
                                            callback: () => {
                                                this.props.dispatch(createAction('taskModel/getInfoGas')({ createForm: false }));
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

                {/* </KeyboardAwareScrollView> */}
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
        textAlign: 'right'
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
    },
    title: {
        marginRight: 10,
        fontSize: 15,
        color: globalcolor.taskImfoLabel
    }
});

//make this component available to the app
export default PoStandardGasReplacementRecord;
