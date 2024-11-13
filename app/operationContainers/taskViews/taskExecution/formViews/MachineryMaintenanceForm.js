//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import moment from 'moment';
import { connect } from 'react-redux';
import { getToken } from '../../../../dvapack/storage';
import { NavigationActions, createAction, createNavigationOptions, ShowToast, SentencedToEmpty } from '../../../../utils';
import globalcolor from '../../../../config/globalcolor';
import { StatusPage, Touchable, PickerTouchable, PickerSingleTimeTouchable, SimplePicker } from '../../../../components';
// 易耗品更换记录表
@connect(({ machineryMaintenanceModel }) => ({
    Record: machineryMaintenanceModel.machineryMaintenanceRecord,
    machineryMaintenanceReplace: machineryMaintenanceModel.machineryMaintenanceReplace
}))
class MachineryMaintenanceForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '设备保养记录表',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
    constructor(props) {
        super(props);
        this.state = {
            chooseTime: this.props.navigation.state.params ? this.props.navigation.state.params.item.DateOfChange : moment().format('YYYY-MM-DD 00:00:00'),
            consumablesName: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'MaintainName'], ''), //保养项
            modelH: this.props.navigation.state.params ? this.props.navigation.state.params.item.Model : '', //型号规格
            unit: this.props.navigation.state.params ? this.props.navigation.state.params.item.Unit : '', //单位
            num: this.props.navigation.state.params ? this.props.navigation.state.params.item.Num + '' : '', //数量
            AnotherTimeOfChange: this.props.navigation.state.params
                ? this.props.navigation.state.params.item.AnotherTimeOfChange + ''
                : moment()
                    .add(1, 'month')
                    .format('YYYY-MM-DD 00:00:00'), //下次更换时间
            reason: this.props.navigation.state.params ? this.props.navigation.state.params.item.Remark : '' //更换原因
        };
        _me = this;
    }
    componentWillMount() { }

    getTimeSelectOption = () => {
        let type = 'day';

        return {
            defaultTime: this.props.navigation.state.params ? this.props.navigation.state.params.item.DateOfChange : moment().format('YYYY-MM-DD HH:mm:ss'),
            type: type,
            onSureClickListener: time => {
                this.setState({
                    chooseTime: moment(time).format('YYYY-MM-DD 00:00:00')
                });
            }
        };
    };

    getAnotherTimeSelectOption = () => {
        let type = 'day';

        return {
            defaultTime: this.props.navigation.state.params ? this.props.navigation.state.params.item.AnotherTimeOfChange : moment().format('YYYY-MM-DD HH:mm:ss'),
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
            codeKey: 'MaintainName',
            nameKey: 'MaintainName',
            placeHolder: '请选择',
            defaultCode: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'MaintainName'], '--'),
            dataArr: SentencedToEmpty(this.props.machineryMaintenanceReplace, ['data', 'Datas', 'Code'], []),
            onSelectListener: item => {
                this.setState({
                    modelH: item.MaintainCode,
                    consumablesName: item.MaintainName
                });
            }
        };
    };

    render() {
        return (
            <StatusPage style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} status={this.props.machineryMaintenanceReplace.status} button={{ name: '重新加载', callback: () => { } }}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                    <ScrollView style={styles.container}>
                        <View style={{ borderRadius: 2, width: SCREEN_WIDTH - 20, minHeight: 100, marginLeft: 10, marginTop: 20, backgroundColor: 'white' }}>
                            <View style={{ height: 50 }}>
                                <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={[styles.title]}>保养日期</Text>
                                    <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15, height: 25, marginTop: 21 }}>
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.chooseTime).format('YYYY-MM-DD')}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </PickerSingleTimeTouchable>
                                </View>
                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            <View style={{ height: 50 }}>
                                <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, alignItems: 'center' }}>
                                    <Text style={[styles.title, { flex: 1 }]}>保养内容</Text>
                                    <View style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center' }}>
                                        <Touchable
                                            onPress={() => {
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'SelectSearchList',
                                                        params: {
                                                            tableType: 'MachineryMaintenance',
                                                            callback: item => {
                                                                this.setState({
                                                                    modelH: item['dbo.T_Cod_MaintainBase.MaintainCode'],
                                                                    consumablesName: item['dbo.T_Cod_MaintainBase.MaintainName']
                                                                });
                                                            }
                                                        }
                                                    })
                                                );
                                            }}
                                            style={{ flexDirection: 'row', flex: 1, alignContent: 'flex-end', alignItems: 'center', flexDirection: 'row-reverse' }}
                                        >
                                            <Text style={{ textAlign: 'right', color: '#666666', width: SCREEN_WIDTH, height: 24, paddingVertical: 0, marginRight: 15, marginTop: 10, fontSize: 14, textAlignVertical: 'top', flex: 1 }}>
                                                {this.state.consumablesName == '' ? '请选择' : this.state.consumablesName}
                                            </Text>
                                            {/* <SimplePicker option={this.getSpareTypeSelectOption()} style={[{ height: 25, marginTop: 21, width: SCREEN_WIDTH / 2 }]} /> */}
                                        </Touchable>
                                        <Image style={{ tintColor: globalcolor.blue, width: 18, marginRight: 15, marginLeft: 16 }} resizeMode={'contain'} source={require('../../../../images/ic_arrows_right.png')} />
                                    </View>
                                </View>

                                <View style={{ marginTop: 1, width: SCREEN_WIDTH - 40, marginLeft: 10, height: 1, backgroundColor: '#efeeee' }} />
                            </View>
                            <View style={{ height: 50 }}>
                                <View style={{ height: 50, flexDirection: 'row', width: SCREEN_WIDTH - 20, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={[styles.title]}>下次保养日期</Text>
                                    <PickerSingleTimeTouchable
                                        option={this.getAnotherTimeSelectOption()}
                                        style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15, height: 25, marginTop: 10 }}
                                    >
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.AnotherTimeOfChange).format('YYYY-MM-DD')}</Text>
                                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </PickerSingleTimeTouchable>
                                </View>
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
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>备注</Text>
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
                    {this.props.navigation.state.params ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginTop: 10 }]}
                            onPress={() => {
                                let lst = this.props.Record.RecordList;
                                const user = getToken();
                                lst.splice(this.props.navigation.state.params.key, 1);

                                _me.props.dispatch(
                                    createAction('machineryMaintenanceModel/commitMaintainRecord')({
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
                                let lst = SentencedToEmpty(this.props.Record, ['RecordList'], []);
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
                                if (this.state.AnotherTimeOfChange == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('您还未设置备件的下次预计更换时间！');
                                    return;
                                }
                                if (this.state.consumablesName == '') {
                                    //数据库必填字段，但是接口中未标明，可能导致报错
                                    ShowToast('请选择保养内容！');
                                    return;
                                }
                                /**
                                ID	
                                DateOfChange	
                                MaintainCode	
                                AnotherTimeOfChange	
                                FormMainID	
                                Remark
                                 */
                                this.props.navigation.state.params
                                    ? (lst[this.props.navigation.state.params.key] = {
                                        DateOfChange: this.state.chooseTime,
                                        MaintainName: this.state.consumablesName,
                                        MaintainCode: this.state.modelH,
                                        //   Unit: this.state.unit,
                                        //   Num: this.state.num,
                                        Remark: this.state.reason,
                                        AnotherTimeOfChange: this.state.AnotherTimeOfChange
                                    })
                                    : lst.push({
                                        DateOfChange: this.state.chooseTime,
                                        MaintainName: this.state.consumablesName,
                                        MaintainCode: this.state.modelH,
                                        //   Unit: this.state.unit,
                                        //   Num: this.state.num,
                                        Remark: this.state.reason,
                                        AnotherTimeOfChange: this.state.AnotherTimeOfChange
                                    });
                                this.props.dispatch(
                                    createAction('machineryMaintenanceModel/commitMaintainRecord')({
                                        params: {
                                            TaskID: this.props.Record.TaskID,
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
export default MachineryMaintenanceForm;
