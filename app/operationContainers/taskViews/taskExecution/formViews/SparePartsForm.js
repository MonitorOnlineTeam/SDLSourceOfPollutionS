//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import moment from 'moment';
import { connect } from 'react-redux';
import { getToken } from '../../../../dvapack/storage';
import { NavigationActions, createAction, createNavigationOptions } from '../../../../utils';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, Touchable, PickerTouchable, PickerSingleTimeTouchable } from '../../../../components';
// 易耗品更换记录表
@connect(({ taskModel }) => ({
    Record: taskModel.sparePartsRecord
}))
class SparePartsForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '备件更换记录表'
    });
    constructor(props) {
        super(props);
        this.state = {
            chooseTime: this.props.navigation.state.params ? this.props.navigation.state.params.item.ReplaceDate : moment().format('YYYY-MM-DD HH:mm:ss'),
            consumablesName: this.props.navigation.state.params ? this.props.navigation.state.params.item.SparePartName : '', //易耗品名称
            modelH: this.props.navigation.state.params ? this.props.navigation.state.params.item.Model : '', //型号规格
            unit: this.props.navigation.state.params ? this.props.navigation.state.params.item.Unit : '', //单位
            num: this.props.navigation.state.params ? this.props.navigation.state.params.item.Num + '' : '', //数量
            reason: this.props.navigation.state.params ? this.props.navigation.state.params.item.Remark : '' //更换原因
        };
        _me = this;
    }
    componentWillMount() {}

    getTimeSelectOption = () => {
        let type = 'day';

        return {
            type: type,
            onSureClickListener: time => {
                this.setState({
                    chooseTime: moment(time).format('YYYY-MM-DD 00:00:00')
                });
            }
        };
    };

    render() {
        return (
            <StatusPage style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} status={this.props.commitstatus} button={{ name: '重新加载', callback: () => {} }}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={styles.container}>
                        <View style={{ borderRadius: 2, width: SCREEN_WIDTH - 20, minHeight: 250, marginLeft: 10, marginTop: 20, backgroundColor: 'white' }}>
                            <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20, justifyContent: 'flex-start' }}>
                                    <Text style={[styles.title]}>更换日期</Text>
                                    <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.chooseTime).format('YYYY-MM-DD')}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </PickerSingleTimeTouchable>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                    <Text style={[styles.title, { flex: 1 }]}>备件名称</Text>
                                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                        <TextInput
                                            editable={true}
                                            placeholderTextColor="gray"
                                            placeholder="请输入备件名称"
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ consumablesName: text });
                                            }}
                                            value={this.state.consumablesName}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>

                            <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                    <Text style={[styles.title, { flex: 1 }]}>规格型号</Text>
                                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                        <TextInput
                                            editable={true}
                                            placeholderTextColor="gray"
                                            placeholder="请输入规格型号"
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ modelH: text });
                                            }}
                                            value={this.state.modelH}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>

                            <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                    <Text style={[styles.title, { flex: 1 }]}>单位</Text>
                                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: 10, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}>
                                        <TextInput
                                            editable={true}
                                            placeholderTextColor="gray"
                                            placeholder="请输入物品单位"
                                            autoCapitalize={'none'}
                                            autoCorrect={false}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={text => {
                                                //动态更新组件内state 记录输入内容
                                                this.setState({ unit: text });
                                            }}
                                            value={this.state.unit}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>

                            <View style={{ height: 50 }}>
                                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 20 }}>
                                    <Text style={[styles.title, { flex: 1 }]}>数量</Text>
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
                                            value={this.state.num}
                                            style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
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
                    {this.props.navigation.state.params ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginTop: 10 }]}
                            onPress={() => {
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                lst.splice(this.props.navigation.state.params.key, 1);

                                _me.props.dispatch(
                                    createAction('taskModel/commitSpareParts')({
                                        params: {
                                            TaskID: _me.props.Record.TaskID,
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
                                this.props.navigation.state.params
                                    ? (lst[this.props.navigation.state.params.key] = {
                                          ReplaceDate: this.state.chooseTime,
                                          SparePartName: this.state.consumablesName,
                                          Model: this.state.modelH,
                                          Unit: this.state.unit,
                                          Num: this.state.num,
                                          Remark: this.state.reason
                                      })
                                    : lst.push({
                                          ReplaceDate: this.state.chooseTime,
                                          SparePartName: this.state.consumablesName,
                                          Model: this.state.modelH,
                                          Unit: this.state.unit,
                                          Num: this.state.num,
                                          Remark: this.state.reason
                                      });

                                this.props.dispatch(
                                    createAction('taskModel/commitSpareParts')({
                                        params: {
                                            TaskID: this.props.Record.TaskID,
                                            Content: this.props.Record.Content,
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
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 10 }]}>确定提交</Text>
                            </View>
                        </TouchableOpacity>
                    }
                </KeyboardAvoidingView>
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
export default SparePartsForm;
