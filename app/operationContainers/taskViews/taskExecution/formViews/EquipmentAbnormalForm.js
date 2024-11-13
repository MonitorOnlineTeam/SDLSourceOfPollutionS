//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, DeviceEventEmitter } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { getToken } from '../../../../dvapack/storage';
import moment from 'moment';
import { connect } from 'react-redux';
import { NavigationActions, createAction, createNavigationOptions } from '../../../../utils';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, Touchable, PickerTouchable, AlertDialog, TextInput } from '../../../../components';
// 设备数据异常记录表

@connect(({ equipmentAbnormal }) => ({
    Record: equipmentAbnormal.Record,
    liststatus: equipmentAbnormal.liststatus
}))
class EquipmentAbnormalForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '设备数据异常记录表',

        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    _me.props.dispatch(
                        createAction('equipmentAbnormal/delForm')({
                            params: {}
                        })
                    );
                }}
            >
                <Text style={{ color: 'white', height: 20, width: 32, marginHorizontal: 16 }}>删除</Text>
            </TouchableOpacity>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            // oldRecord: {},
            // chooseTime: moment().format('YYYY-MM-DD HH') + ':00',
            // initId: '0',
            // condition: '', //状况
            // reason: '', //异常原因
            // instructions: '' //处理说明
            oldRecord: this.props.Record.RecordList ? this.props.Record.RecordList : {},
            chooseTime: moment().format('YYYY-MM-DD HH') + ':00',
            initId: this.props.Record.RecordList ? this.props.Record.RecordList[0].IsOk : '0',
            condition: this.props.Record.RecordList ? this.props.Record.RecordList[0].ExceptionStatus : '', //状况
            reason: this.props.Record.RecordList ? this.props.Record.RecordList[0].ExceptionReason : '', //异常原因
            instructions: this.props.Record.RecordList ? this.props.Record.RecordList[0].DealingSituations : '' //处理说明
        };
        _me = this;
    }
    componentWillMount() {
        this.props.dispatch(
            createAction('equipmentAbnormal/getInfo')({
                params: {
                    // TaskID: '00553062-ade0-420d-a7d4-c657397dbf20'
                    TaskID: this.props.navigation.state.params.TaskID
                }
            })
        );
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    render() {
        return (
            <StatusPage
                status={this.props.liststatus}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onRefresh();
                    this.goTo();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={[styles.container, { flex: 1 }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginTop: 15,
                                    marginLeft: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>异常状况</Text>
                            <TextInput
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    this.setState({ condition: text });
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
                                value={this.state.condition}
                                numberOfLines={4}
                                placeholder={'请填写原因说明'}
                                placeholderTextColor={'#999999'}
                            />
                        </View>

                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginTop: 10,
                                    marginLeft: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>异常原因</Text>
                            <TextInput
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

                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginTop: 10,
                                    marginLeft: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>处理情况</Text>
                            <TextInput
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    this.setState({ instructions: text });
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
                                numberOfLines={4}
                                placeholder={'请填写原因说明'}
                                placeholderTextColor={'#999999'}
                                value={this.state.instructions}
                            />
                        </View>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginTop: 10,
                                    marginLeft: 10,
                                    paddingHorizontal: 10,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <View style={styles.item}>
                                <Text style={[styles.label, { color: '#333333' }]}>是否正常恢复运行</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                                        onPress={() => {
                                            this.setState({ initId: '1' });
                                        }}
                                    >
                                        <Text style={[styles.value, { color: '#333333' }]}>是</Text>
                                        <Image source={this.state.initId == '1' ? require('../../../../images/duihao.png') : require('../../../../images/checkbox_off.png')} style={{ width: 15, height: 15, marginLeft: 12 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                                        onPress={() => {
                                            this.setState({ initId: '0' });
                                        }}
                                    >
                                        <Text style={[styles.value, { color: '#333333' }]}>否</Text>
                                        <Image source={this.state.initId == '0' ? require('../../../../images/cuohao.png') : require('../../../../images/checkbox_off.png')} style={{ width: 15, height: 15, marginLeft: 12 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* <View style={[{flex:1,}]}></View> */}
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.blue }, { marginTop: 10, marginBottom: 15 }]}
                        onPress={() => {
                            let lst = this.state.oldRecord;
                            const user = getToken();
                            lst = [
                                {
                                    ExceptionStatus: this.state.condition,
                                    ExceptionReason: this.state.reason,
                                    DealingSituations: this.state.instructions,
                                    IsOk: this.state.initId
                                }
                            ];

                            this.props.dispatch(
                                createAction('equipmentAbnormal/saveInfo')({
                                    params: {
                                        TaskID: this.props.Record.TaskID,
                                        Content: this.props.Record.Content,
                                        CreateUserID: user.UserId,
                                        CreateTime: this.props.Record.CreateTime,
                                        RecordList: lst
                                    }
                                })
                            );
                            this.props.dispatch(NavigationActions.back({}));
                            this.props.dispatch(
                                createAction('equipmentAbnormal/getInfo')({
                                    params: {
                                        TaskID: this.props.Record.TaskID
                                    }
                                })
                            );
                        }}
                    >
                        <View style={[styles.button, { marginLeft: -20 }]}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 20, marginLeft: 10 }]}>确定提交</Text>
                        </View>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        // minHeight: Platform.OS == 'android' ? SCREEN_HEIGHT - 90 : SCREEN_HEIGHT,
        backgroundColor: '#efeeee',
        flexDirection: 'column',
        flex: 1
    },
    title: {
        height: 25,
        marginLeft: 10,
        fontSize: 15,
        marginTop: 23,
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
export default EquipmentAbnormalForm;
