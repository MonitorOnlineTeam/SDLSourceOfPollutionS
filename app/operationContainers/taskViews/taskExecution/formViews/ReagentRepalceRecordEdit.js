//标准物质更换编辑
//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, ShowToast, NavigationActions } from '../../../../utils';
import { PickerSingleTimeTouchable, AlertDialog } from '../../../../components';

const saveItem = 0;
const deleteItem = 1;

/**
 * 试剂更换/标准物质 编辑
 */
@connect(({ taskModel }) => ({
    ReagentRepalceHistoryList: taskModel.ReagentRepalceHistoryList
}))
class ReagentRepalceRecordEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerMode: 'float',
            title: '试剂更换记录表',
            tabBarLable: '试剂更换记录表',
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                flex: 1,
                textAlign: 'center',
                fontSize: 17,
                marginRight: Platform.OS == 'android' ? 75 : 13
            }, //标题居中
            headerStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                height: 45
                //elevation: 0//去掉header下方的阴影
                //borderBottomWidth: 0,//去掉ios下的分割线
            }
        };
    };

    constructor(props) {
        super(props);
        if (props.navigation.state.params.index == -1) {
            this.state = {
                ReplaceDate: moment().toDate(), //更换时间
                showReplaceDate: moment().format('YYYY-MM-DD'),
                StandardGasName: '', //标气名称
                GasStrength: '', //气体浓度
                Unit: '', //单位
                Num: -1, //数量
                Supplier: '', //生产商
                PeriodOfValidity: moment().toDate(), //有效期
                showPeriodOfValidity: '请填写试剂失效日期', //有效期
                FormMainID: '',
                dialogType: saveItem
            };
        } else {
            let item = this.props.ReagentRepalceHistoryList[props.navigation.state.params.index];
            this.state = {
                ReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
                showReplaceDate: moment(item.ReplaceDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
                StandardGasName: item.ReagentName, //试剂名称
                GasStrength: item.SpecificationType, //试剂规格
                Unit: item.Unit, //单位
                Num: item.Num + '', //数量
                Supplier: item.Supplier, //生产商
                PeriodOfValidity: moment(item.PeriodOfValidity, 'YYYY-MM-DD HH:mm:ss').toDate(), //有效期
                showPeriodOfValidity: moment(item.PeriodOfValidity, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'), //有效期
                FormMainID: item.FormMainID,
                dialogType: saveItem
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

    getPeriodOfValidityOption = () => {
        return {
            defaultTime: this.state.PeriodOfValidity,
            type: 'day',
            onSureClickListener: time => {
                this.setState({
                    PeriodOfValidity: time,
                    showPeriodOfValidity: moment(time).format('YYYY-MM-DD')
                });
            }
        };
    };

    cancelButton = () => { };
    confirm = () => {
        //删除记录
        this.props.dispatch(
            createAction('taskModel/delItemReagent')({
                index: this.props.navigation.state.params.index,
                callback: () => {
                    this.props.dispatch(createAction('taskModel/getInfoReagent')({ createForm: false }));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    render() {
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
            <View style={[styles.container, { alignItems: 'center' }]}>
                <KeyboardAwareScrollView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginVertical: 22 }]}>
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
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>试剂名称：</Text>
                                <View style={[styles.innerlayout]}>
                                    {/* <Text style={[styles.textStyle]}>{this.state.StandardGasName==''?'请选择标准物质名称':this.state.StandardGasName}</Text> */}
                                    <TextInput
                                        style={[styles.textStyle]}
                                        placeholder={'请填写试剂名称'}
                                        placeholderTextColor={'#999999'}
                                        value={this.state.StandardGasName}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录
                                            this.setState({
                                                StandardGasName: text
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>试剂规格：</Text>
                                <TextInput
                                    value={this.state.GasStrength}
                                    ref={ref => (this._inputMachineHaltReason = ref)}
                                    style={[styles.textStyle, { flex: 1 }]}
                                    placeholder={'请填写试剂规格'}
                                    placeholderTextColor={'#999999'}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            GasStrength: text
                                        });
                                    }}
                                />
                            </View>
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>单位：</Text>
                                <View style={[styles.innerlayout]}>
                                    {/* <Text style={[styles.textStyle]}>{this.state.Unit==''?'请选择单位':this.state.Unit}</Text> */}
                                    <TextInput
                                        style={[styles.textStyle]}
                                        placeholder={'请输入单位'}
                                        placeholderTextColor={'#999999'}
                                        value={this.state.Unit}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录
                                            this.setState({
                                                Unit: text
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>数量：</Text>
                                <TouchableOpacity style={[styles.touchable]}>
                                    <View style={[styles.innerlayout]}>
                                        <TextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.Num}
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
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>生产商：</Text>
                                <View style={[styles.innerlayout]}>
                                    {/* <Text style={[styles.textStyle]}>{this.state.Supplier == ''?'请填写供应商':this.state.Supplier}</Text> */}
                                    <TextInput
                                        style={[styles.textStyle]}
                                        placeholder={'请填写生产商'}
                                        placeholderTextColor={'#999999'}
                                        value={this.state.Supplier}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录
                                            this.setState({
                                                Supplier: text
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 45, marginBottom: 10, alignItems: 'center' }]}>
                                <PickerSingleTimeTouchable option={this.getPeriodOfValidityOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', flex: 1 }}>
                                    <Text style={[styles.labelStyle]}>失效日期：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.showPeriodOfValidity}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </PickerSingleTimeTouchable>
                            </View>
                        </View>
                    </View>
                    <View style={[{ flex: 1 }]} />
                </KeyboardAwareScrollView>
                {this.props.navigation.state.params.index != -1 ? (
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
                            ShowToast('试剂更换时间不能为空！');
                        } else if (!this.state.PeriodOfValidity) {
                            ShowToast('标气失效日期不能为空！');
                        } else if (this.state.StandardGasName == '') {
                            ShowToast('未选择标气！');
                        } else if (this.state.GasStrength == '') {
                            ShowToast('未填写标气浓度！');
                        } else if (this.state.Unit == '') {
                            ShowToast('未选择标气单位！');
                        } else if (this.state.Num == -1) {
                            ShowToast('未填写标气数量！');
                        } else if (!(/^\d+(\.\d+)?$/.test(this.state.Num))) {
                            ShowToast('您输入的数量错误！');
                        } else if (this.state.Supplier == '') {
                            ShowToast('未填写生产商！');
                        } else {
                            this.props.dispatch(
                                createAction('taskModel/saveItemReagent')({
                                    index: this.props.navigation.state.params.index,
                                    record: {
                                        ReplaceDate: moment(this.state.ReplaceDate).format('YYYY-MM-DD') + ' 00:00:00',
                                        ReagentName: this.state.StandardGasName, //试剂名称
                                        SpecificationType: this.state.GasStrength, //试剂规格
                                        Unit: this.state.Unit, //单位
                                        Num: this.state.Num, //数量
                                        Supplier: this.state.Supplier, //生产商
                                        PeriodOfValidity: moment(this.state.PeriodOfValidity).format('YYYY-MM-DD') + ' 23:59:59', //有效期
                                        // FormMainID:'',
                                        dialogType: saveItem
                                    },
                                    callback: () => {
                                        this.props.dispatch(createAction('taskModel/getInfoReagent')({ createForm: false }));
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
                <AlertDialog options={options} ref="doAlert" />
            </View>
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
        height: 45,
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
    }
});

//make this component available to the app
export default ReagentRepalceRecordEdit;
