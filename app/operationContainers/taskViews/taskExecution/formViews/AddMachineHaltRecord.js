//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Picker from 'react-native-picker';
import moment from 'moment';
import { connect } from 'react-redux';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { AlertDialog, ModalParent, SimpleLoadingComponent } from '../../../../components';
import { createAction, ShowToast, NavigationActions, createNavigationOptions } from '../../../../utils';

import { TextInput } from '../../../../components';
import Mask from '../../../../components/SDLPicker/component/Mask';
import ConfirmDialog from '../components/ConfirmDialog';

const saveItem = 0;
const deleteItem = 1;
// create a component
@connect(({ machineHaltRecord }) => ({
    RecordList: machineHaltRecord.RecordList,
    liststatus: machineHaltRecord.liststatus
}))
class AddMachineHaltRecord extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '添加停运记录表',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        if (props.navigation.state.params.index == -1) {
            this.state = {
                startDate: null,
                endDate: null,
                MachineHaltReason: '',
                defaultValue: '请输入停机描述',
                dialogType: saveItem
            };
        } else {
            let item = this.props.RecordList[props.navigation.state.params.index];
            this.state = {
                startDate: moment(item.BeginTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
                endDate: moment(item.EndTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
                MachineHaltReason: item.ChangeSpareparts,
                defaultValue: item.ChangeSpareparts,
                dialogType: saveItem
            };
        }
        _me = this;
    }

    _showTimePicker(date, callback) {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];

        for (let i = 1; i < 51; i++) {
            years.push(i + 1980 + '年');
        }
        for (let i = 1; i < 13; i++) {
            months.push(i < 10 ? '0' + i + '月' : i + '月');
        }
        for (let i = 1; i < 25; i++) {
            hours.push(i < 10 ? '0' + i + '时' : i + '时');
        }
        for (let i = 1; i < 32; i++) {
            days.push(i + '日');
        }
        for (let i = 1; i < 61; i++) {
            minutes.push(i < 10 ? '0' + i + '分' : i + '分');
        }
        let pickerData = [years, months, days, hours, minutes];

        date = date ? date : new Date();
        let selectedValue = [
            date.getFullYear() + '年',
            date.getMonth() + 1 + '月',
            date.getDate() + '日',
            date.getHours() < 10 ? '0' + date.getHours() + '时' : date.getHours() + '时',
            date.getMinutes() < 10 ? '0' + date.getMinutes() + '分' : date.getMinutes() + '分'
        ];
        Picker.init({
            pickerData,
            selectedValue,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerTitleText: '时间选择',
            wheelFlex: [1, 1, 1, 1, 1],
            onPickerConfirm: pickedValue => {
                // let timeStr = pickedValue[0].replace('年','-')+pickedValue[1].replace('月','-')+pickedValue[2].replace('日',' ')+pickedValue[3].replace('时',':')+pickedValue[4].replace('分',':')+':00';
                // console.log('area', timeStr);
                let date = moment()
                    .set('year', pickedValue[0].replace('年', ''))
                    .set('month', pickedValue[1].replace('月', '') - 1)
                    .set('date', pickedValue[2].replace('日', ''))
                    .set('hour', pickedValue[3].replace('时', ''))
                    .set('minute', pickedValue[4].replace('分', ''))
                    .toDate();
                callback(date);
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
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if (k !== 3) {
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }

    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除所有维修记录的表单',
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
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.container}>
                {this.props.liststatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                <ScrollView>
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
                            <View style={[{ flexDirection: 'row', height: 45, marginTop: 10, borderBottomWidth: 1, alignItems: 'center', borderBottomColor: globalcolor.borderBottomColor }]}>
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>停机开始时间：</Text>
                                <TouchableOpacity
                                    style={[{ flex: 1, flexDirection: 'row', height: 45, alignItems: 'center' }]}
                                    onPress={() => {
                                        this._showTimePicker(this.state.startDate, date => {
                                            this.setState({ startDate: date });
                                        });
                                    }}
                                >
                                    <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                                        <Text style={[{ fontSize: 15, color: globalcolor.taskFormLabel, flex: 1, textAlign: 'right' }]}>{this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD HH:mm') : '请选择日期'}</Text>
                                        <Image style={{ tintColor: globalcolor.blue, height: 16, width: 18, marginLeft: 16 }} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 45, marginBottom: 10, alignItems: 'center' }]}>
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>停机结束时间：</Text>
                                <TouchableOpacity
                                    style={[{ flex: 1, flexDirection: 'row', height: 45, alignItems: 'center' }]}
                                    onPress={() => {
                                        this._showTimePicker(this.state.endDate, date => {
                                            this.setState({ endDate: date });
                                        });
                                    }}
                                >
                                    <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                                        <Text style={[{ fontSize: 15, color: globalcolor.taskFormLabel, flex: 1, textAlign: 'right' }]}>{this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD HH:mm') : '请选择日期'}</Text>
                                        <Image style={{ tintColor: globalcolor.blue, height: 16, width: 18, marginLeft: 16 }} resizeMode={'contain'} source={require('../../../../images/icon_select_date.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 24,
                                marginLeft: 12,
                                paddingHorizontal: 24,
                                borderRadius: 2,
                                backgroundColor: globalcolor.white
                            }
                        ]}
                    >
                        <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>停机原因</Text>
                        <TextInput
                            ref={ref => (this._input = ref)}
                            // value={this.state.MachineHaltReason}
                            // defaultValue={this.state.defaultValue}
                            style={[{ minHeight: 100, width: SCREEN_WIDTH - 72, marginBottom: 20, color: globalcolor.taskFormLabel, fontSize: 15, textAlign: 'left', textAlignVertical: 'top', padding: 4 }]}
                            multiline={true}
                            numberOfLines={4}
                            placeholder={'请填写原因说明'}
                            onChangeText={text => {
                                // 动态更新组件内State记录用户名
                                this.setState({
                                    MachineHaltReason: text
                                });
                            }}
                        />
                    </View>
                    <View style={[{ flex: 1 }]} />
                    {this.props.navigation.state.params.index != -1 ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10, marginLeft: (SCREEN_WIDTH - 282) / 2 }]}
                            onPress={() => {
                                this.setState({ dialogType: deleteItem });
                                this._modalParent.showModal();
                            }}
                        >
                            <View style={styles.button}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 20, marginLeft: 8 }]}>删除记录</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.blue }, { marginTop: 15, marginLeft: (SCREEN_WIDTH - 282) / 2 }]}
                        onPress={() => {
                            // this.setState({dialogType:saveItem});
                            // this._modalParent.showModal();
                            if (this.state.startDate && this.state.endDate) {
                                this.props.dispatch(
                                    createAction('machineHaltRecord/saveItem')({
                                        index: this.props.navigation.state.params.index,
                                        record: {
                                            BeginTime: moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss'),
                                            EndTime: moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            ChangeSpareparts: this.state.MachineHaltReason
                                        },
                                        callback: () => {
                                            this.props.dispatch(createAction('machineHaltRecord/getInfo')({ createForm: false }));
                                            // this._modalParent.hideModal();
                                            this.props.dispatch(NavigationActions.back());
                                        },
                                        failureBack: () => {
                                            // this._modalParent.hideModal();
                                        }
                                    })
                                );
                            } else {
                                this._modalParent.hideModal();
                                ShowToast('停机开始时间或结束时间不能为空！');
                            }
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                        </View>
                    </TouchableOpacity>
                    <ModalParent ref={ref => (this._modalParent = ref)}>
                        <Mask
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                            hideDialog={() => {
                                this._modalParent.hideModal();
                                this.setState({ doConfirm: false });
                            }}
                        >
                            <ConfirmDialog
                                title={'确认'}
                                description={this.state.dialogType == deleteItem ? '确认删除该停机记录吗？' : '确认提交停机记录吗？'}
                                doPositive={() => {
                                    //dialog确定
                                    if (this.state.dialogType == deleteItem) {
                                        //删除停机记录
                                        this.props.dispatch(
                                            createAction('machineHaltRecord/delItem')({
                                                index: this.props.navigation.state.params.index,
                                                callback: () => {
                                                    this.props.dispatch(createAction('machineHaltRecord/getInfo')({ createForm: false }));
                                                    this._modalParent.hideModal();
                                                    this.props.dispatch(NavigationActions.back());
                                                },
                                                failureBack: () => {
                                                    this._modalParent.hideModal();
                                                }
                                            })
                                        );
                                    } else {
                                        //添加修改停机记录
                                        // if (this.state.startDate&&this.state.endDate) {
                                        //     this.props.dispatch(createAction('machineHaltRecord/saveItem')({
                                        //         index:this.props.navigation.state.params.index,
                                        //         record:{
                                        //             BeginTime:moment(this.state.startDate).format('YYYY-MM-DD HH:mm:ss'),
                                        //             EndTime:moment(this.state.endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        //             ChangeSpareparts:this._input.props.value,
                                        //         },
                                        //         callback:()=>{
                                        //             this.props.dispatch(createAction('machineHaltRecord/getInfo')({createForm:false}));
                                        //             this._modalParent.hideModal();
                                        //             this.props.dispatch(NavigationActions.back());
                                        //         },
                                        //     }));
                                        // } else{
                                        //     this._modalParent.hideModal();
                                        //     ShowToast('停机开始时间或结束时间不能为空！');
                                        // }
                                    }
                                }}
                                doNegative={() => {
                                    //dialog取消
                                    this._modalParent.hideModal();
                                    this.setState({ doConfirm: false, willingAddForm: {} });
                                }}
                            />
                        </Mask>
                    </ModalParent>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
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
export default AddMachineHaltRecord;
