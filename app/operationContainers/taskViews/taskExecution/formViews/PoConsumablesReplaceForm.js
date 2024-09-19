//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import moment from 'moment';
import { connect } from 'react-redux';
import Picker from 'react-native-picker';
import { getToken } from '../../../../dvapack/storage';
import { NavigationActions, createAction, createNavigationOptions, ShowToast, SentencedToEmpty } from '../../../../utils';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, Touchable, PickerTouchable, PickerSingleTimeTouchable, SimplePicker, SimpleLoadingComponent } from '../../../../components';
import FormPicker from '../components/FormPicker';
import FormInput from '../components/FormInput';

// 供货商列表
// const PartList = [
//     {'name':'我公司供货',code:1}
//     ,{'name':'甲方供货',code:2}
// ];
// 易耗品更换记录表
@connect(({ taskModel }) => ({
    Record: taskModel.consumableRecord,
    nameCode: taskModel.nameCode,
    unitCode: taskModel.unitCode,
    consumablesReplace: taskModel.consumablesReplace,
    PartList: taskModel.PartList,
    editstatus: taskModel.editstatus
}))
class PoConsumablesReplaceForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '易耗品更换记录表',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
    constructor(props) {
        super(props);
        const user = getToken();
        this.state = {
            PartType: SentencedToEmpty(this, ['props', 'navigation', 'state', 'params', 'item', 'PartType'], SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1),// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
            PartName: this.getPartName(SentencedToEmpty(this, ['props', 'navigation', 'state', 'params', 'item', 'PartType'], 1)),// 供货类型显示字段
            chooseTime: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.ReplaceDate : moment().format('YYYY-MM-DD'),
            AnotherTimeOfChange: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.AnotherTimeOfChange : moment().format('YYYY-MM-DD'), //下一次更换时间
            consumablesName: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.ConsumablesName : '', //易耗品名称
            modelH: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.Model : '', //型号规格
            unit: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.Unit : '', //单位
            num: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.Num : '', //数量
            CisNum: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.CisNum : '', //CIS申请单据号
            reason: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.Remark : '', //更换原因
            // selectedStorehouse: this.props.navigation.state.params.item ? { StorehouseName: this.props.navigation.state.params.item.StorehouseName, ID: this.props.navigation.state.params.item.StorehouseId } : null, // 选中的仓库
            selectedStorehouse: this.props.navigation.state.params.item ? { 'dbo.T_Bas_Storehouse.StorehouseName': this.props.navigation.state.params.item.StorehouseName, 'dbo.T_Bas_Storehouse.ID': this.props.navigation.state.params.item.StorehouseId } : null, // 选中的仓库
            PartCode: this.props.navigation.state.params.item ? this.props.navigation.state.params.item.PartCode : '' // 存货编码
        };
        _me = this;
    }

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

    componentWillMount() { }
    _showUnitPicker() {
        let names = [];

        for (let i = 0; i < this.props.unitCode.length; i++) {
            names.push(this.props.unitCode[i].name);
        }
        let pickerData = names;

        let selectedValue = [names[0]];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '易耗品选择',
            wheelFlex: [1],
            onPickerConfirm: pickedValue => {
                this.setState({ unit: pickedValue[0] });
            },
            onPickerCancel: pickedValue => {
                // console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if (parseInt(targetValue[1]) === 2) {
                    if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
                        targetValue[2] = 29;
                    } else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
                        targetValue[2] = 28;
                    }
                } else if (targetValue[1] in { 4: 1, 6: 1, 9: 1, 11: 1 } && targetValue[2] > 30) {
                    targetValue[2] = 30;
                }
            }
        });
        Picker.show();
    }
    _showConNamePicker() {
        //易耗品选择
        let names = [];

        for (let i = 0; i < this.props.nameCode.length; i++) {
            names.push(this.props.nameCode[i].PartName + '|' + this.props.nameCode[i].Code + '|' + this.props.nameCode[i].Unit);
        }

        let pickerData = names;
        let selectedValue = [names[0]];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '易耗品选择',
            wheelFlex: [1],
            onPickerConfirm: pickedValue => {
                this.setState({ unit: pickedValue[0].split('|')[2], consumablesName: pickedValue[0].split('|')[0], modelH: pickedValue[0].split('|')[1] });
            },
            onPickerCancel: pickedValue => {
                // console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if (parseInt(targetValue[1]) === 2) {
                    if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
                        targetValue[2] = 29;
                    } else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
                        targetValue[2] = 28;
                    }
                } else if (targetValue[1] in { 4: 1, 6: 1, 9: 1, 11: 1 } && targetValue[2] > 30) {
                    targetValue[2] = 30;
                }
            }
        });
        Picker.show();
    }

    getTimeSelectOption = () => {
        let type = 'day';

        return {
            type: type,
            onSureClickListener: time => {
                this.setState({
                    chooseTime: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };
    getTimeSelectOptionA = () => {
        let type = 'day';

        return {
            type: type,
            onSureClickListener: time => {
                this.setState({
                    AnotherTimeOfChange: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };

    getSelectOption = () => {
        let defaultCode = '';
        if (this.props.navigation.state.params.item) {
            this.props.nameCode.map((item, key) => {
                if (item.PartName == this.props.navigation.state.params.item.ConsumablesName && item.Code == this.props.navigation.state.params.item.Model) {
                    defaultCode = item.ID;
                }
            });
        }
        return {
            codeKey: 'ID',
            disImage: true,
            showName: 'PartName',
            nameKey: 'value',
            placeHolder: '请选择',
            defaultCode,
            dataArr: this.props.nameCode,
            onSelectListener: item => {
                this.setState({ unit: item.Unit, consumablesName: item.PartName, modelH: item.Code });
            }
        };
    };

    render() {
        const user = getToken();
        return (
            <StatusPage style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} status={this.props.consumablesReplace.status} button={{ name: '重新加载', callback: () => { } }}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={styles.container}>
                        <View style={{ borderRadius: 2, width: SCREEN_WIDTH - 20, minHeight: 250, marginLeft: 10, marginTop: 20, backgroundColor: 'white', alignItems: 'center' }}>
                            <View style={{ height: 50, justifyContent: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20, justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={[styles.title]}>更换日期</Text>
                                    <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                    <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.chooseTime).format('YYYY-MM-DD')}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </PickerSingleTimeTouchable>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            {
                                SentencedToEmpty(user, ['IsShowTask'], false) ? null
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 40 }}>
                                        <FormPicker
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 15 }}
                                            propsRightIconStyle={{ tintColor: '#999999', width: 14, height: 14, marginRight: 5 }}
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
                                                        , StorehouseName: ''
                                                        , modelH: '',
                                                        consumablesName: '',
                                                        unit: '',
                                                        PartCode: '',
                                                        CisNum: ''
                                                    });
                                                }
                                            }}
                                            showText={this.state['PartName']}
                                            placeHolder="请选择"
                                        />
                                    </View>
                            }
                            {/* 仓库名称 */}
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 43 }}>
                                    <View style={{ height: 42, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={[styles.title]}>仓库名称</Text>
                                            <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                        </View>
                                        <Touchable
                                            onPress={() => {
                                                /** GetStorehouse */
                                                this.props.dispatch(createAction('taskModel/updateState')({ selectablePart: { status: -1 } }));
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'SelectSearchList',
                                                        params: {
                                                            tableType: 'Storehouse',
                                                            callback: item => {
                                                                this.setState({
                                                                    selectedStorehouse: item,
                                                                    modelH: '',
                                                                    consumablesName: '',
                                                                    unit: '',
                                                                    PartCode: ''
                                                                });
                                                            }
                                                        }
                                                    })
                                                );
                                            }}
                                            style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}
                                        >
                                            <Image style={{ width: 14, height: 14, marginRight: 15 }} source={require('../../../../images/right.png')} />
                                            <Text style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, marginRight: 15, fontSize: 14, flex: 1 }}>
                                                {SentencedToEmpty(this.state.selectedStorehouse, ['dbo.T_Bas_Storehouse.StorehouseName'], '') == '' ? '请选择' : this.state.selectedStorehouse['dbo.T_Bas_Storehouse.StorehouseName']}
                                            </Text>
                                        </Touchable>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : null
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 43 }}>
                                    <View style={{ height: 42, alignItems: 'center', flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <Text style={[styles.title, {}]}>易耗品名称</Text>
                                        <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                        <Touchable
                                            onPress={() => {
                                                if (this.state.selectedStorehouse) {
                                                    // this.props.dispatch(createAction('taskModel/updateState')({ selectablePart: { status: -1 } }));
                                                    this.props.dispatch(
                                                        NavigationActions.navigate({
                                                            routeName: 'SelectSearchList',
                                                            params: {
                                                                tableType: 'Consumables',
                                                                selectedStorehouseCode: SentencedToEmpty(this.state.selectedStorehouse, ['dbo.T_Bas_Storehouse.ID'], ''),
                                                                callback: item => {
                                                                    this.setState({
                                                                        modelH: item['Code'],
                                                                        consumablesName: item['PartName'],
                                                                        unit: item['Unit'],
                                                                        PartCode: item['PartCode']
                                                                    });
                                                                }
                                                            }
                                                        })
                                                    );
                                                } else {
                                                    ShowToast('请先选择仓库');
                                                }
                                            }}
                                            style={{ flexDirection: 'row', flex: 1, height: 42, alignItems: 'center', justifyContent: 'flex-end' }}
                                        >
                                            <Text numberOfLines={2} style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 15, fontSize: 14, textAlignVertical: 'top', flex: 1 }}>
                                                {this.state.consumablesName == '' ? '请选择' : this.state.consumablesName}
                                            </Text>
                                        </Touchable>
                                        <Image style={{ width: 14, height: 14, marginRight: 15 }} source={require('../../../../images/right.png')} />
                                    </View>

                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 40 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20, lineHeight: 18 }}
                                            label={'易耗品名称'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.consumablesName}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['consumablesName'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 43 }}>
                                    <View style={{ height: 42, alignItems: 'center', flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <Text style={[styles.title, { flex: 1 }]}>规格型号</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 30 }}>
                                            <Text numberOfLines={2} style={{ fontSize: 14, color: '#666666', lineHeight: 18 }}>
                                                {this.state.modelH}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 40 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20 }}
                                            label={'规格型号'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.modelH}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['modelH'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 43 }}>
                                    <View style={{ height: 42, alignItems: 'center', flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <Text style={[styles.title, { flex: 1 }]}>存货编码</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 30 }}>
                                            <Text style={{ fontSize: 14, color: '#666666' }}>{this.state.PartCode == '' ? '' : this.state.PartCode}</Text>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View> : null
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 43 }}>
                                    <View style={{ height: 42, alignItems: 'center', flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <Text style={[styles.title, { flex: 1 }]}>单位</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 30 }}>
                                            <Text style={{ fontSize: 14, color: '#666666' }}>{this.state.unit}</Text>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : <View style={{ height: 43, width: SCREEN_WIDTH - 40 }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20 }}
                                            label={'单位'}
                                            placeholder="请记录"
                                            keyboardType="default"
                                            value={this.state.unit}
                                            onChangeText={text => {
                                                let temp = {};
                                                temp['unit'] = text;
                                                this.setState(temp);
                                            }}
                                        />
                                    </View>
                            }
                            <View style={{ height: 43, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20, height: 42, alignItems: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.title, {}]}>数量</Text>
                                        <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                    </View>
                                    <TextInput
                                        editable={true}
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        placeholder="请输入数量"
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={text => {
                                            //动态更新组件内state 记录输入内容
                                            this.setState({ num: text });
                                        }}
                                        value={this.state.num + ''}
                                        style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, marginRight: 30, fontSize: 14, flex: 1 }}
                                    />
                                </View>
                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            {/* CIS申请单据号 */}
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 50, justifyContent: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <View style={{ flex: 1, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[styles.title, {}]}>CIS申请单据号</Text>
                                            <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                        </View>
                                        <TextInput
                                            editable={true}
                                            keyboardType={'default'}
                                            placeholder="请输入单据号"
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ CisNum: text });
                                            }}
                                            value={this.state.CisNum + ''}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 30, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </View>
                                </View> : null
                            }
                        </View>

                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginTop: 15,
                                    marginLeft: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 0,
                                    backgroundColor: globalcolor.white,
                                    borderRadius: 2
                                }
                            ]}
                        >
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>更换原因说明</Text>
                            <TextInput
                                editable={true}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    this.setState({ reason: text });
                                }}
                                style={[
                                    {
                                        minHeight: 100,
                                        width: SCREEN_WIDTH - 72,
                                        marginBottom: 20,
                                        color: globalcolor.datepickerGreyText,
                                        fontSize: 15,
                                        textAlign: 'left',
                                        textAlignVertical: 'top',
                                        padding: 4
                                    }
                                ]}
                                multiline={true}
                                value={this.state.reason}
                                numberOfLines={4}
                                placeholder={'请填写原因说明'}
                            />
                        </View>

                        <View style={[{ flex: 1 }]} />
                    </ScrollView>
                    {this.props.navigation.state.params.item ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginTop: 10 }]}
                            onPress={() => {
                                this.props.dispatch(createAction('taskModel/updateState')({ editstatus: { status: -1 } }));
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                lst.splice(this.props.navigation.state.params.key, 1);
                                const { ID } = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'formItem'], {});
                                _me.props.dispatch(
                                    createAction('taskModel/commitConsumablesReplace')({
                                        params: {
                                            TaskID: _me.props.Record.TaskID,
                                            TypeID: ID,
                                            Content: _me.props.Record.Content,
                                            CreateUserID: user.UserId,
                                            CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            RecordList: lst
                                        }
                                    })
                                );
                            }}
                        >
                            <View style={[styles.button, { marginLeft: -20 }]}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 10 }]}>删除记录</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    {
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.blue }, { marginTop: 10, marginBottom: 15 }]}
                            onPress={() => {
                                if (this.state.PartType == 1 && SentencedToEmpty(this.state.selectedStorehouse, ['dbo.T_Bas_Storehouse.StorehouseName'], '') == '') {
                                    ShowToast('您还未选择仓库！');
                                    return;
                                }
                                if (this.state.consumablesName == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('请选择需要更换的易耗品！');
                                    return;
                                }
                                if (this.state.modelH == '') {
                                    ShowToast('规格型号不能为空！');
                                    return;
                                }
                                if (this.state.PartType == 2 && this.state.unit == '') {
                                    //甲方供货 单位必填
                                    ShowToast('单位不能为空！');
                                    return;
                                }
                                if (this.state.num == '0' || this.state.num == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('请填写需要更换的易耗品数量！');
                                    return;
                                } else if (!(/^\d+(\.\d+)?$/.test(this.state.num))) {
                                    ShowToast('您输入的数量错误！');
                                    return;
                                }
                                if (this.state.PartType == 1 && this.state.CisNum == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('请填写CIS申请单据号！');
                                    return;
                                }
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                this.props.navigation.state.params.item
                                    ? (lst[this.props.navigation.state.params.key] = {
                                        PartType: this.state.PartType,
                                        StorehouseId: this.state.PartType == 1 ? this.state.selectedStorehouse['dbo.T_Bas_Storehouse.ID'] : '',
                                        StorehouseName: this.state.PartType == 1 ? this.state.selectedStorehouse['dbo.T_Bas_Storehouse.StorehouseName'] : '',
                                        PartCode: this.state.PartCode,
                                        ReplaceDate: moment(this.state.chooseTime).format('YYYY-MM-DD 00:00:00'),
                                        ConsumablesName: this.state.consumablesName,
                                        Model: this.state.modelH,
                                        Unit: this.state.unit,
                                        Num: this.state.num,
                                        CisNum: this.state.CisNum,
                                        Remark: this.state.reason,
                                        AnotherTimeOfChange: moment(this.state.AnotherTimeOfChange).format('YYYY-MM-DD 00:00:00')
                                    })
                                    : lst.push({
                                        PartType: this.state.PartType,
                                        StorehouseId: this.state.PartType == 1 ? this.state.selectedStorehouse['dbo.T_Bas_Storehouse.ID'] : '',
                                        StorehouseName: this.state.PartType == 1 ? this.state.selectedStorehouse['dbo.T_Bas_Storehouse.StorehouseName'] : '',
                                        PartCode: this.state.PartCode,
                                        ReplaceDate: moment(this.state.chooseTime).format('YYYY-MM-DD 00:00:00'),
                                        ConsumablesName: this.state.consumablesName,
                                        Model: this.state.modelH,
                                        Unit: this.state.unit,
                                        Num: this.state.num,
                                        CisNum: this.state.CisNum,
                                        Remark: this.state.reason,
                                        AnotherTimeOfChange: moment(this.state.AnotherTimeOfChange).format('YYYY-MM-DD 00:00:00')
                                    });
                                const { ID } = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'formItem'], {});
                                this.props.dispatch(createAction('taskModel/updateState')({ editstatus: { status: -2 } }));
                                this.props.dispatch(
                                    createAction('taskModel/commitConsumablesReplace')({
                                        params: {
                                            TaskID: this.props.Record.TaskID,
                                            TypeID: ID,
                                            Content: this.props.Record.Content,
                                            CreateUserID: user.UserId,
                                            CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            RecordList: lst
                                        }
                                    })
                                );
                            }}
                        >
                            <View style={[styles.button, { marginLeft: -20 }]}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 10 }]}>确定提交</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </KeyboardAvoidingView>
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column'
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
    },
    title: {
        marginLeft: 10,
        fontSize: 15,
        color: globalcolor.taskImfoLabel
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: SCREEN_WIDTH - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        marginLeft: 50
    }
});

//make this component available to the app
export default PoConsumablesReplaceForm;
