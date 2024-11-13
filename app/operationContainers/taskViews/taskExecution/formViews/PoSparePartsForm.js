//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import moment from 'moment';
import { connect } from 'react-redux';
import { getToken } from '../../../../dvapack/storage';
import { NavigationActions, createAction, createNavigationOptions, ShowToast, SentencedToEmpty } from '../../../../utils';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, Touchable, PickerTouchable, PickerSingleTimeTouchable, SimplePicker, SimpleLoadingComponent } from '../../../../components';
import FormPicker from '../components/FormPicker';
import FormInput from '../components/FormInput';
// 易耗品更换记录表
@connect(({ taskModel }) => ({
    Record: taskModel.sparePartsRecord,
    sparePartsReplace: taskModel.sparePartsReplace,
    PartList: taskModel.PartList,
    editstatus: taskModel.editstatus
}))
class SparePartsForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '备件更换记录表',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
    constructor(props) {
        super(props);
        // console.log('constructor this.props.navigation.state.params.item = ', this.props.navigation.state.params.item);
        const user = getToken();
        // SentencedToEmpty(user,['IsShowTask'],false)
        // console.log('IsShowTask = ',SentencedToEmpty(user,['IsShowTask'],false));
        this.state = {
            PartType: SentencedToEmpty(this, ['props', 'route', 'params', 'params', 'item', 'PartType'], SentencedToEmpty(user, ['IsShowTask'], false) ? 2 : 1),// 供货类型 字段名称PartType   下拉列表 1 我公司供货 2 甲方供货  默认1
            PartName: this.getPartName(SentencedToEmpty(this, ['props', 'route', 'params', 'params', 'item', 'PartType'], 1)),// 供货类型显示字段
            chooseTime: this.props.route.params.params.item ? this.props.route.params.params.item.ReplaceDate : moment().format('YYYY-MM-DD'),
            consumablesName: this.props.route.params.params.item ? this.props.route.params.params.item.ConsumablesName : '', //易耗品名称
            modelH: this.props.route.params.params.item ? this.props.route.params.params.item.Model : '', //型号规格
            unit: this.props.route.params.params.item ? this.props.route.params.params.item.Unit : '', //单位
            num: this.props.route.params.params.item ? this.props.route.params.params.item.Num : '', //数量
            CisNum: this.props.route.params.params.item ? this.props.route.params.params.item.CisNum : '', //CIS申请单据号
            AnotherTimeOfChange: this.props.route.params.params.item
                ? this.props.route.params.params.item.AnotherTimeOfChange + ''
                : moment()
                    .add(1, 'month')
                    .format('YYYY-MM-DD HH:mm:ss'), //下次更换时间
            reason: this.props.route.params.params.item ? this.props.route.params.params.item.Remark : '', //更换原因
            // selectedStorehouse: this.props.navigation.state.params.item ? { StorehouseName: this.props.navigation.state.params.item.StorehouseName, ID: this.props.navigation.state.params.item.StorehouseId } : null, // 选中的仓库
            selectedStorehouse: this.props.route.params.params.item ? { 'dbo.T_Bas_Storehouse.StorehouseName': this.props.route.params.params.item.StorehouseName, 'dbo.T_Bas_Storehouse.ID': this.props.route.params.params.item.StorehouseId } : null, // 选中的仓库
            PartCode: this.props.route.params.params.item ? this.props.route.params.params.item.PartCode : '' // 存货编码
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

    getTimeSelectOption = () => {
        let type = 'day';

        return {
            defaultTime: this.props.route.params.params.item ? this.props.route.params.params.item.ReplaceDate : moment().format('YYYY-MM-DD HH:mm:ss'),
            type: type,
            onSureClickListener: time => {
                this.setState({
                    chooseTime: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };

    getAnotherTimeSelectOption = () => {
        let type = 'day';

        return {
            defaultTime: this.props.route.params.params.item ? this.props.route.params.params.item.AnotherTimeOfChange : moment().format('YYYY-MM-DD HH:mm:ss'),
            type: type,
            onSureClickListener: time => {
                this.setState({
                    AnotherTimeOfChange: moment(time).format('YYYY-MM-DD 00:00:00')
                });
            }
        };
    };

    getSpareTypeSelectOption = () => {
        return {
            codeKey: 'Code',
            showName: 'PartName',
            nameKey: 'PartNameShow',
            placeHolder: '请选择',
            defaultCode: this.props.route.params.params.item ? this.props.route.params.params.item.Model : '',
            dataArr: SentencedToEmpty(this.props.sparePartsReplace, ['data', 'Datas', 'Code'], []),
            onSelectListener: item => {
                this.setState({
                    modelH: item.Code,
                    consumablesName: item.PartName,
                    unit: item.Unit
                });
            }
        };
    };

    render() {
        const user = getToken();
        return (
            <StatusPage style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} status={this.props.sparePartsReplace.status} button={{ name: '重新加载', callback: () => { } }}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={styles.container}>
                        <View style={{ borderRadius: 2, width: SCREEN_WIDTH - 20, minHeight: 250, marginLeft: 10, marginTop: 20, backgroundColor: 'white', alignItems: 'center' }}>
                            <View style={{ height: 50 }}>
                                <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={[styles.title]}>更换日期</Text>
                                        <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                    </View>
                                    <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15, height: 25 }}>
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.chooseTime).format('YYYY-MM-DD')}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </PickerSingleTimeTouchable>
                                </View>
                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            {
                                SentencedToEmpty(user, ['IsShowTask'], false) ? null
                                    : <View style={{ height: 50, width: SCREEN_WIDTH - 40, justifyContent: 'center' }}>
                                        <FormPicker
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                height: 25,
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20 }}
                                            propsRightIconStyle={{ tintColor: globalcolor.blue, height: 16, width: 30, marginRight: 15 }}
                                            label="供货来源"
                                            defaultCode={this.state.PartType}
                                            option={{
                                                codeKey: 'code',
                                                nameKey: 'name',
                                                defaultCode: this.state.PartType,
                                                dataArr: this.props.PartList,
                                                onSelectListener: item => {
                                                    this.setState({
                                                        PartType: item.code, PartName: item.name,
                                                        selectedStorehouse: null,
                                                        consumablesName: '',
                                                        unit: '',
                                                        modelH: '',
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
                                this.state.PartType == 1 ? <View style={{ height: 50 }}>
                                    <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
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
                                            style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}
                                        >
                                            <Text numberOfLines={1} style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, marginRight: 15, fontSize: 14, flex: 1 }}>
                                                {SentencedToEmpty(this.state.selectedStorehouse, ['dbo.T_Bas_Storehouse.StorehouseName'], '') == '' ? '请选择' : this.state.selectedStorehouse['dbo.T_Bas_Storehouse.StorehouseName']}
                                            </Text>
                                            <Image style={{ tintColor: globalcolor.blue, height: 16, marginRight: 15 }} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                                        </Touchable>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View> : null
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 50 }}>
                                    <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                            <Text style={[styles.title]}>备件名称</Text>
                                            <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                        </View>
                                        <Touchable
                                            onPress={() => {
                                                if (this.state.selectedStorehouse) {
                                                    this.props.dispatch(createAction('taskModel/updateState')({ selectablePart: { status: -1 } }));
                                                    this.props.dispatch(
                                                        NavigationActions.navigate({
                                                            routeName: 'SelectSearchList',
                                                            params: {
                                                                tableType: 'SparePart',
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
                                            style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}
                                        >
                                            <Text numberOfLines={2} style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, marginRight: 15, fontSize: 14, flex: 1, lineHeight: 18 }}>
                                                {this.state.consumablesName == '' ? '请选择' : this.state.consumablesName}
                                            </Text>
                                            {/* <SimplePicker option={this.getSpareTypeSelectOption()} style={[{ height: 25, marginTop: 21, width: SCREEN_WIDTH / 2 }]} /> */}
                                            <Image style={{ tintColor: globalcolor.blue, height: 16, marginRight: 15 }} resizeMode={'contain'} source={require('../../../../images/right.png')} />
                                        </Touchable>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View> : <View style={{ height: 50, width: SCREEN_WIDTH - 40, justifyContent: 'center' }}>
                                    <FormInput
                                        required={true}
                                        requireIconPosition={'right'}
                                        hasColon={false}
                                        propsLabelStyle={{
                                            height: 25,
                                            fontSize: 15
                                            , color: globalcolor.taskImfoLabel
                                        }}
                                        propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20, padding: 0 }}
                                        label={'备件名称'}
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
                                this.state.PartType == 1 ? <View style={{ height: 50 }}>
                                    <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <Text style={[styles.title, { flex: 1 }]}>规格型号</Text>
                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                            <Text numberOfLines={2} style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1, lineHeight: 18 }}>
                                                {this.state.modelH == '' ? '--' : this.state.modelH}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : <View style={{ height: 50, width: SCREEN_WIDTH - 40, justifyContent: 'flex-end' }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                height: 25,
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20, padding: 0 }}
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
                                this.state.PartType == 1 ? <View style={{ height: 50 }}>
                                    <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <Text style={[styles.title, { flex: 1 }]}>存货编码</Text>
                                        <View style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                            <Text
                                                numberOfLines={1}
                                                style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                            >
                                                {this.state.PartCode == '' ? '--' : this.state.PartCode}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View> : null
                            }
                            {
                                // 1 我公司供货 2 甲方供货  默认1
                                this.state.PartType == 1 ? <View style={{ height: 50 }}>
                                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                        <Text style={[styles.title, { flex: 1 }]}>单位</Text>
                                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                            <Text style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}>
                                                {this.state.unit == '' ? '--' : this.state.unit}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                                </View>
                                    : <View style={{ height: 50, width: SCREEN_WIDTH - 40, justifyContent: 'flex-end' }}>
                                        <FormInput
                                            required={true}
                                            requireIconPosition={'right'}
                                            hasColon={false}
                                            propsLabelStyle={{
                                                height: 25,
                                                fontSize: 15
                                                , color: globalcolor.taskImfoLabel
                                            }}
                                            propsTextStyle={{ color: '#666666', fontSize: 14, marginRight: 20, padding: 0 }}
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


                            {/* <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={[styles.title]}>数量</Text>
                                        <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                        <TextInput
                                            editable={true}
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            placeholderTextColor="gray"
                                            placeholder="请输入数量"
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ num: text });
                                            }}
                                            value={this.state.num + ''}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                            <View style={{ height: 50, justifyContent: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20, height: 50, alignItems: 'center' }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.title, {}]}>数量</Text>
                                        <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                    </View>
                                    <TextInput
                                        editable={true}
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        placeholder="请输入数量"
                                        placeholderTextColor={'#999999'}
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
                                this.state.PartType == 1 ? <View style={{ height: 58, justifyContent: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                        <View style={{ flex: 1, marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[styles.title, {}]}>CIS申请单据号</Text>
                                            <Text style={[styles.title, { color: 'red' }]}>*</Text>
                                        </View>
                                        <TextInput
                                            editable={true}
                                            keyboardType={'default'}
                                            placeholder="请输入单据号"
                                            placeholderTextColor={'#999999'}
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ CisNum: text });
                                            }}
                                            value={this.state.CisNum + ''}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 30, marginTop: 14, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
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
                                placeholderTextColor={'#999999'}
                            />
                        </View>

                        <View style={[{ flex: 1 }]} />
                    </ScrollView>
                    {this.props.route.params.params.item ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginTop: 10 }]}
                            onPress={() => {
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'formItem'], {});
                                lst.splice(this.props.route.params.params.key, 1);
                                _me.props.dispatch(createAction('taskModel/updateState')({ editstatus: { status: -1 } }));
                                _me.props.dispatch(
                                    createAction('taskModel/commitSpareParts')({
                                        params: {
                                            TaskID: _me.props.Record.TaskID,
                                            TypeID: ID,
                                            Content: _me.props.Record.Content,
                                            CreateUserID: user.User_ID,
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
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                /***
                                ID	
                                FormMainID	
                                ReplaceDate	
                                ConsumablesName	
                                AnotherTimeOfChange	
                                Model	
                                Unit	
                                Num	
                                Remark
                                 */

                                if (this.state.PartType == '') {
                                    ShowToast('您还未选择供货来源！');
                                    return;
                                }
                                if (this.state.PartType == 1 && SentencedToEmpty(this.state.selectedStorehouse, ['dbo.T_Bas_Storehouse.ID'], '') == '') {
                                    ShowToast('您还未选择仓库！');
                                    return;
                                }
                                if (this.state.PartType == 1 && this.state.PartCode == '') {
                                    ShowToast('您还未选择需要更换的备件！');
                                    return;
                                }
                                if (this.state.PartType == 2 && this.state.consumablesName == '') {
                                    ShowToast('您还未录入需要更换的备件！');
                                    return;
                                }
                                if (this.state.PartType == 2 && this.state.modelH == '') {
                                    ShowToast('您还未录入规格型号！');
                                    return;
                                }
                                if (this.state.num == '' || this.state.num == '0') {
                                    ShowToast('您还未设置备件更换的数量！');
                                    return;
                                } else if (!(/^\d+(\.\d+)?$/.test(this.state.num))) {
                                    ShowToast('您输入的数量错误！');
                                    return;
                                }
                                if (this.state.PartType == 2 && this.state.unit == '') {
                                    ShowToast('单位不能为空！');
                                    return;
                                }
                                if (this.state.PartType == 1 && this.state.CisNum == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('请填写CIS申请单据号！');
                                    return;
                                }
                                if (this.state.AnotherTimeOfChange == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('您还未设置备件的下次更换时间！');
                                    return;
                                }
                                this.props.route.params.params.item
                                    ? (lst[this.props.route.params.params.key] = {
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
                                        AnotherTimeOfChange: this.state.AnotherTimeOfChange
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
                                        AnotherTimeOfChange: this.state.AnotherTimeOfChange
                                    });
                                // console.log('commitSpareParts  param = ', {
                                //     TaskID: this.props.Record.TaskID,
                                //     Content: this.props.Record.Content,
                                //     CreateUserID: user.UserId,
                                //     CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                //     RecordList: lst
                                // });
                                const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'formItem'], {});
                                _me.props.dispatch(createAction('taskModel/updateState')({ editstatus: { status: -2 } }));
                                this.props.dispatch(
                                    createAction('taskModel/commitSpareParts')({
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
export default SparePartsForm;
