/*
 * @Description: 2021.12.23 设备维修记录
 * @LastEditors: hxf
 * @Date: 2021-12-23 10:44:12
 * @LastEditTime: 2024-09-20 14:00:30
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/RepairRecordForm.js
 */

/**
 * model位置
 * @FilePath: /SDLMainProject/app/pOperationModels/taskModel.js
 * 
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Platform, ScrollView, Text, View, TouchableOpacity, StyleSheet, Image, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DeclareModule, SDLText, StatusPage, Button, AlertDialog, SimpleLoadingView } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../../utils';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import FormTextArea from '../components/FormTextArea';

@connect(({ repairRecordNewModel }) => ({
    repairSaveResult: repairRecordNewModel.repairSaveResult,
    repairDelResult: repairRecordNewModel.repairDelResult,
    repairRecordDetailResult: repairRecordNewModel.repairRecordDetailResult,
    repairRecordParamesResult: repairRecordNewModel.repairRecordParamesResult,
    StartTime: repairRecordNewModel.StartTime,
    EndTime: repairRecordNewModel.EndTime,
    dataArray: repairRecordNewModel.dataArray
}))
export default class RepairRecordForm extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '设备维修记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }, //标题居中
        });

    componentDidMount() {
        this.props.dispatch(createAction('repairRecordNewModel/updateState')({
            repairRecordDetailResult: { status: -1 }
        }));
        this.onRefresh();
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(createAction('repairRecordNewModel/getNewRepairRecordDetail')({ TypeID: ID }));
        this.props.dispatch(createAction('repairRecordNewModel/getRepairRecordParames')({}));
    }

    getMaintenanceDateOption = () => {
        return {
            defaultTime: moment(this.props.StartTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'day',
            onSureClickListener: time => {
                this.props.dispatch(
                    createAction('repairRecordNewModel/updateState')(
                        { StartTime: time }));
            },
        };
    }

    getDepartureTimeOption = () => {
        return {
            defaultTime: moment(this.props.EndTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: time => {
                this.props.dispatch(
                    createAction('repairRecordNewModel/updateState')(
                        { EndTime: time }));
            },
        };
    }

    upDateItem = (index, paramName, value) => {
        let newArray = [...this.props.dataArray];
        newArray[index][paramName] = value;
        this.props.dispatch(
            createAction('repairRecordNewModel/updateState')(
                { dataArray: newArray }));
    }

    commit = () => {
        // this.props.dispatch(createAction('repairRecordNewModel/updateState')({repairSaveResult:{status:-1}}));
        // let that = this;
        // setTimeout(() => {
        //     that.props.dispatch(createAction('repairRecordNewModel/saveRepairRecordOpr')({ }))
        // }, 1500);
        this.props.dispatch(createAction('repairRecordNewModel/saveRepairRecordOpr')({}))
    }

    getPageStatus = () => {
        // repairRecordDetailResult:repairRecordNewModel.repairRecordDetailResult,
        // repairRecordParamesResult:repairRecordNewModel.repairRecordParamesResult,
        let repairRecordDetailResult = this.props.repairRecordDetailResult;
        let repairRecordParamesResult = this.props.repairRecordParamesResult;
        if (repairRecordDetailResult.status == -1
            || repairRecordParamesResult.status == -1) {
            return -1;
        }
        if (repairRecordDetailResult.status != 200) {
            return repairRecordDetailResult.status;
        }
        if (repairRecordParamesResult.status != 200) {
            return repairRecordParamesResult.status;
        }
        if (repairRecordDetailResult.status == 200
            || repairRecordParamesResult.status == 200) {
            return 200;
        }
    }

    delConfirm = () => {
        this.props.dispatch(createAction('repairRecordNewModel/repairRecordDel')({}))
    }

    render() {
        let delFormOptions = {
            headTitle: '提示',
            messText: '确认删除该设备维修记录表吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: () => { }
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.delConfirm
                }
            ]
        };
        return (
            <StatusPage
                status={this.getPageStatus()}
                style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: globalcolor.backgroundGrey }}
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
                {/* <KeyboardAwareScrollView> */}
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View style={[{
                        marginTop: 8, width: SCREEN_WIDTH - 24, alignItems: 'center'
                        , backgroundColor: globalcolor.white, marginHorizontal: 12, paddingHorizontal: 6
                    }]}>
                        <FormDatePicker
                            required={true}
                            getPickerOption={this.getMaintenanceDateOption}
                            label={'维修日期'}
                            timeString={moment(this.props.StartTime).format('YYYY-MM-DD')}
                        />
                        <FormDatePicker
                            required={true}
                            getPickerOption={this.getDepartureTimeOption}
                            label={'离开时间'}
                            timeString={moment(this.props.EndTime).format('YYYY-MM-DD HH:00')}
                        />
                    </View>
                    <View style={[{
                        width: SCREEN_WIDTH - 24, alignItems: 'center'
                        , marginHorizontal: 12, paddingHorizontal: 6
                    }]}>
                        {
                            /**
                                EquipmentInfoID  主机名称型号ID 或名称型号
                                FaultPhenomenon 故障现象
                                FaultTime 故障时间
                                FaultUnitID 故障单元ID
                                FormMainID 主表ID
                                ProcessingMethod 处理方法
                                ProcessingResults 处理结果
                                Remark 备注
                                CauseAnalysis  原因分析
                                */
                            this.props.dataArray.map((item, index) => {
                                return (
                                    <View key={`record${index}`} style={[{
                                        width: SCREEN_WIDTH - 24, alignItems: 'center'
                                        , marginTop: 12
                                    }]}>
                                        <View style={[{
                                            width: SCREEN_WIDTH - 24, height: 32, flexDirection: 'row'
                                            , justifyContent: 'space-between'
                                        }]}>
                                            <Text style={[{ fontSize: 16 }]}>{`维修记录${index + 1}`}</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let newArray = [...this.props.dataArray];
                                                    newArray.splice(index, 1);
                                                    this.props.dispatch(
                                                        createAction('repairRecordNewModel/updateState')(
                                                            { dataArray: newArray }));
                                                }}
                                                style={{ flexDirection: 'row', flex: 1, marginTop: 1, justifyContent: 'flex-end' }}
                                            >
                                                <SDLText style={{ color: '#4aa0ff' }}>删除</SDLText>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[{
                                            width: SCREEN_WIDTH - 24, alignItems: 'center'
                                            , backgroundColor: globalcolor.white, paddingHorizontal: 6,
                                        }]}>
                                            <FormPicker
                                                required={true}
                                                label='故障单元'
                                                defaultCode={SentencedToEmpty(item, ['FaultUnitID'], '')}
                                                option={{
                                                    codeKey: 'ID',
                                                    nameKey: 'FaultUnitName',
                                                    defaultCode: SentencedToEmpty(item, ['FaultUnitID'], ''),
                                                    dataArr: SentencedToEmpty(this.props.repairRecordParamesResult, ['data', 'Datas', 'FaultUnitList'], []),
                                                    onSelectListener: callBackItem => {
                                                        let newArray = [...this.props.dataArray];
                                                        newArray[index].selectedFaultUnit = callBackItem;
                                                        newArray[index].FaultUnitID = callBackItem.ID;
                                                        newArray[index].FaultUnitName = callBackItem.FaultUnitName;
                                                        newArray[index].IsMaster = callBackItem.IsMaster;
                                                        newArray[index].EquipmentInfoID = '';
                                                        this.props.dispatch(
                                                            createAction('repairRecordNewModel/updateState')(
                                                                { dataArray: newArray }));
                                                    }
                                                }}
                                                showText={SentencedToEmpty(item, ['FaultUnitName'], '')}
                                                placeHolder='请选择'
                                            />
                                            <FormDatePicker
                                                required={true}
                                                getPickerOption={
                                                    () => {
                                                        return {
                                                            defaultTime: moment(item.FaultTime).format('YYYY-MM-DD HH:mm:ss'),
                                                            type: 'hour',
                                                            onSureClickListener: time => {
                                                                this.upDateItem(index, 'FaultTime', time);
                                                            },
                                                        };
                                                    }
                                                }
                                                label={'故障时间'}
                                                timeString={moment(item.FaultTime).format('YYYY-MM-DD HH:00')}
                                            />
                                            {
                                                // IsMaster 1 主机  2是其他吗？
                                                SentencedToEmpty(item, ['IsMaster'], 2) == 1 ? <FormPicker
                                                    label='主机名称型号'
                                                    defaultCode={SentencedToEmpty(item, ['EquipmentInfoID'], '')}
                                                    option={{
                                                        codeKey: 'ID',
                                                        nameKey: 'Name',
                                                        defaultCode: SentencedToEmpty(item, ['EquipmentInfoID'], ''),
                                                        dataArr: SentencedToEmpty(this.props.repairRecordParamesResult, ['data', 'Datas', 'EquipmentInfoList'], []),
                                                        onSelectListener: callBackItem => {
                                                            let newArray = [...this.props.dataArray];
                                                            newArray[index].selectedEquipmentInfo = callBackItem;
                                                            newArray[index].EquipmentInfoID = callBackItem.ID;
                                                            newArray[index].EquipmentNumber = callBackItem.EquipmentNumber;
                                                            newArray[index].EquipmentName = callBackItem.Name;
                                                            this.props.dispatch(
                                                                createAction('repairRecordNewModel/updateState')(
                                                                    { dataArray: newArray }));
                                                        }
                                                    }}
                                                    showText={SentencedToEmpty(item, ['EquipmentName'], '')}
                                                    placeHolder='请选择'
                                                /> : <FormInput
                                                    label={'名称型号'}
                                                    placeholder='请记录'
                                                    keyboardType='default'
                                                    value={item.EquipmentInfoID}
                                                    onChangeText={
                                                        (text) => {
                                                            this.upDateItem(index, 'EquipmentInfoID', text);
                                                        }
                                                    }
                                                />
                                            }
                                            <FormTextArea
                                                label='故障现象'
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=''
                                                value={item.FaultPhenomenon}
                                                onChangeText={(text) => {
                                                    this.upDateItem(index, 'FaultPhenomenon', text);
                                                }}
                                            />
                                            <FormTextArea
                                                label='原因分析'
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=''
                                                value={item.CauseAnalysis}
                                                onChangeText={(text) => {
                                                    this.upDateItem(index, 'CauseAnalysis', text);
                                                }}
                                            />
                                            <FormTextArea
                                                label='处理方法'
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=''
                                                value={item.ProcessingMethod}
                                                onChangeText={(text) => {
                                                    this.upDateItem(index, 'ProcessingMethod', text);
                                                }}
                                            />
                                            <FormTextArea
                                                label='处理结果'
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=''
                                                value={item.ProcessingResults}
                                                onChangeText={(text) => {
                                                    this.upDateItem(index, 'ProcessingResults', text);
                                                }}
                                            />
                                            <FormTextArea
                                                label='备注'
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=''
                                                value={item.Remark}
                                                onChangeText={(text) => {
                                                    this.upDateItem(index, 'Remark', text);
                                                }}
                                            />
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            let current = [...this.props.dataArray];
                            current.push({
                                FaultTime: moment().minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
                            });
                            this.props.dispatch(createAction('repairRecordNewModel/updateState')({
                                dataArray: current
                            }))
                        }}
                        style={{ marginVertical: 8, marginHorizontal: 12, width: SCREEN_WIDTH - 24, backgroundColor: 'white', height: 44, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <SDLText fontType="large" style={{ color: '#4aa0ff' }}>
                            {`添加维修记录`}
                        </SDLText>
                    </TouchableOpacity>
                </ScrollView>
                {/* </KeyboardAwareScrollView> */}
                <Button
                    text={'保存'}
                    style={{
                        width: SCREEN_WIDTH,
                        backgroundColor: '#4ca9ff',
                        height: 45,
                        borderRadius: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    textStyle={{ color: '#fff', fontSize: 15 }}
                    onPress={() => {
                        this.commit();
                    }}
                />
                <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        // this.deleteALL();
                        this.refs.delFormAlert.show();
                    }}
                >
                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit' ? (
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'删除'}</SDLText>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'表单'}</SDLText>
                        </View>
                    ) : null}
                </TouchableOpacity>
                <AlertDialog options={delFormOptions} ref="delFormAlert" />
                {this.props.repairSaveResult.status == -1 ? <SimpleLoadingView message={'正在保存中'} /> : null}
                {this.props.repairDelResult.status == -1 ? <SimpleLoadingView message={'正在删除表单'} /> : null}
            </StatusPage>
        )
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
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 15,
        color: globalcolor.textBlack
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 15,
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
    },
})