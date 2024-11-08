import moment from 'moment';
import React, { Component } from 'react';
import { Platform, ScrollView, Text, View, TouchableOpacity, StyleSheet, Image, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DeclareModule, SDLText, StatusPage, Button, AlertDialog, SimpleLoadingView } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';
import FormDatePicker from '../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import FormInput from '../../../operationContainers/taskViews/taskExecution/components/FormInput';
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';

@connect(({ CTRepair, CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    ProjectID: CTModel.ProjectID,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    selectEnt: CTRepair.selectEnt,
    selectPoint: CTRepair.selectPoint,
    repairEntAndPoint: CTRepair.repairEntAndPoint,
    repairSaveResult: CTRepair.repairSaveResult,
    repairDelResult: CTRepair.repairDelResult,

    repairRecordParamesResult: CTRepair.repairRecordParamesResult,
    RepairDate: CTRepair.RepairDate,
    DepartureTime: CTRepair.DepartureTime,
    selectEnt: CTRepair.selectEnt,
    dataArray: CTRepair.dataArray
}))
export default class RepairSubmitForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '设备维修记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            loadFormParams: true
        }
    }

    componentDidMount() {
        console.log(this.props);
        this.props.dispatch(
            createAction('CTRepair/updateState')({
                repairRecordDetailResult: { status: -1 }
            })
        );
        const PointId = SentencedToEmpty(this.props, ['dataArray', 0, 'PointId'], '');
        if (PointId == '') {
            this.setState({
                loadFormParams: false
            }, () => {
                this.onRefresh();
            })
        } else {
            this.onRefresh();
        }

    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    onRefresh = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');

        this.props.dispatch(
            createAction('CTRepair/GetProjectEntPointSysModel')({
                projectId: this.props.ProjectID
            })
        );
        const PointId = SentencedToEmpty(this.props, ['dataArray', 0, 'PointId'], '');
        if (PointId != '') {
            // this.props.dispatch(createAction('CTRepair/getRepairRecordParames')({ mainId: this.props.dispatchId, serviceId: serviceId, recordId: recordId }));
            this.props.dispatch(createAction('CTRepair/getRepairRecordParames')({ PointId }));
        } else {
            this.props.dispatch(createAction('CTRepair/updateState')({ repairRecordParamesResult: { status: 200 } }));
        }
    };

    getMaintenanceDateOption = () => {
        return {
            defaultTime: moment(this.props.RepairDate).format('YYYY-MM-DD HH:mm:ss'),
            type: 'day',
            onSureClickListener: time => {
                this.props.dispatch(createAction('CTRepair/updateState')({ RepairDate: time }));
            }
        };
    };

    getDepartureTimeOption = () => {
        return {
            defaultTime: moment(this.props.DepartureTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: time => {
                this.props.dispatch(createAction('CTRepair/updateState')({ DepartureTime: time }));
            }
        };
    };

    upDateItem = (index, paramName, value) => {
        let newArray = [...this.props.dataArray];
        newArray[index][paramName] = value;
        this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray }));
    };

    commit = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let commitData = { ...this.props.dataArray[0] };
        if (!commitData.PointId) {
            ShowToast('请选择企业和监测点');
            return;
        }
        if (!commitData.FaultUnitID) {
            ShowToast('请选择故障单元');
            return;
        }
        // commitData.repairDate = this.props.StartTime;
        // commitData.departureTime = this.props.EndTime;
        commitData.RepairDate = this.props.RepairDate;
        commitData.DepartureTime = this.props.DepartureTime;
        commitData.mainId = this.props.dispatchId;
        commitData.recordId = recordId;
        commitData.serviceId = serviceId;

        this.props.route.params.callback(commitData);
        this.props.navigation.goBack();
        // this.props.dispatch(createAction('CTRepair/saveRepairRecordOpr')({}));
    };

    getPageStatus = () => {
        let repairRecordDetailResult = this.props.repairEntAndPoint;
        let repairRecordParamesResult = this.props.repairRecordParamesResult;
        if (this.state.loadFormParams) {
            if (repairRecordDetailResult.status == -1 || repairRecordParamesResult.status == -1) {
                return -1;
            }
        } else {
            if (repairRecordDetailResult.status == -1) {
                return -1;
            }
        }

        if (repairRecordDetailResult.status != 200) {
            return repairRecordDetailResult.status;
        }
        if (this.state.loadFormParams && repairRecordParamesResult.status != 200) {
            return repairRecordParamesResult.status;
        }
        if (this.state.loadFormParams) {
            if (repairRecordDetailResult.status == 200 && repairRecordParamesResult.status == 200) {
                this.setState({
                    loadFormParams: false
                });
                return 200;
            }
        } else {
            if (repairRecordDetailResult.status == 200) {
                return 200;
            }
        }

    };

    delConfirm = () => {
        let commitData = { ...this.props.dataArray[0] };

        this.props.route.params.callback({ index: commitData.index });
        this.props.navigation.goBack();
    };

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let delFormOptions = {
            headTitle: '提示',
            messText: '确认删除本条维修记录表吗？',
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
                    const PointId = SentencedToEmpty(this.props, ['dataArray', 0, 'PointId'], '');
                    this.setState({
                        loadFormParams: PointId != ''
                    }, () => {
                        this.onRefresh();
                    })
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    const PointId = SentencedToEmpty(this.props, ['dataArray', 0, 'PointId'], '');
                    this.setState({
                        loadFormParams: PointId != ''
                    }, () => {
                        this.onRefresh();
                    })
                    // this.onRefresh();
                }}
            >
                {/* <KeyboardAwareScrollView> */}
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View style={[{ marginTop: 8, width: SCREEN_WIDTH - 24, alignItems: 'center', backgroundColor: globalcolor.white, marginHorizontal: 12, paddingHorizontal: 6 }]}>
                        <FormDatePicker
                            editable={this.isEdit()}
                            required={true} getPickerOption={this.getMaintenanceDateOption} label={'维修日期'} timeString={moment(this.props.RepairDate).format('YYYY-MM-DD')} />
                        <FormDatePicker
                            editable={this.isEdit()}
                            required={true} getPickerOption={this.getDepartureTimeOption} label={'离开时间'} timeString={moment(this.props.DepartureTime).format('YYYY-MM-DD HH:00')} />
                    </View>
                    <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center', marginHorizontal: 12, paddingHorizontal: 6 }]}>
                        {/**
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
                                    <View key={`record${index}`} style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center', marginTop: 12 }]}>
                                        <View style={[{ width: SCREEN_WIDTH - 24, height: 32, flexDirection: 'row', justifyContent: 'space-between' }]}>
                                            <Text style={[{ color: '#333333', fontSize: 16 }]}>{`维修记录`}</Text>
                                            {false ? <TouchableOpacity
                                                onPress={() => {
                                                    let newArray = [...this.props.dataArray];
                                                    newArray.splice(index, 1);
                                                    this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray }));
                                                }}
                                                style={{ flexDirection: 'row', flex: 1, marginTop: 1, justifyContent: 'flex-end' }}
                                            >
                                                <SDLText style={{ color: '#4aa0ff' }}>删除</SDLText>
                                            </TouchableOpacity> : null}
                                        </View>
                                        <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center', backgroundColor: globalcolor.white, paddingHorizontal: 6 }]}>
                                            <FormPicker
                                                editable={this.isEdit()}
                                                required={true}
                                                label="企业名称"
                                                defaultCode={SentencedToEmpty(item, ['EntId'], '')}
                                                option={{
                                                    codeKey: 'EntId',
                                                    nameKey: 'EntName',
                                                    defaultCode: SentencedToEmpty(item, ['EntId'], ''),
                                                    dataArr: SentencedToEmpty(this.props.repairEntAndPoint, ['data', 'Datas'], []),
                                                    onSelectListener: callBackItem => {
                                                        let newArray = [...this.props.dataArray];
                                                        newArray[index].EntId = callBackItem.EntId;
                                                        newArray[index].EntName = callBackItem.EntName;

                                                        // 清除数据
                                                        newArray[index].PointId = '';
                                                        newArray[index].PointName = '';

                                                        newArray[index].selectedFaultUnit = null;
                                                        newArray[index].FaultUnitID = '';
                                                        newArray[index].FaultUnitName = '';
                                                        newArray[index].IsMaster = '';

                                                        newArray[index].selectedEquipmentInfo = null;
                                                        newArray[index].EquipmentInfoID = '';
                                                        newArray[index].equipmentNumber = '';
                                                        newArray[index].EquipmentName = '';

                                                        newArray[index].selectEnt = callBackItem;
                                                        this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray, selectEnt: callBackItem }));
                                                    }
                                                }}
                                                showText={SentencedToEmpty(item, ['EntName'], '')}
                                                placeHolder={this.isEdit() ? "请选择" : '未选择'}
                                            />
                                            {item.EntId ? (
                                                <FormPicker
                                                    editable={this.isEdit()}
                                                    required={true}
                                                    label="监测点名称"
                                                    defaultCode={SentencedToEmpty(item, ['PointId'], [])}
                                                    option={{
                                                        codeKey: 'PointId',
                                                        nameKey: 'PointName',
                                                        defaultCode: SentencedToEmpty(item, ['PointId'], []),
                                                        dataArr: SentencedToEmpty(
                                                            this.props.repairEntAndPoint,
                                                            [
                                                                'data',
                                                                'Datas',
                                                                SentencedToEmpty(this.props.repairEntAndPoint, ['data', 'Datas'], []).findIndex((itema, indexa) => {
                                                                    if (itema['EntId'] == SentencedToEmpty(item, ['EntId'], '')) {
                                                                        return true;
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                }),
                                                                'PointList'
                                                            ],
                                                            []
                                                        ),
                                                        onSelectListener: callBackItem => {
                                                            // let newArray = [...this.props.dataArray];
                                                            let newArray = [].concat(this.props.dataArray);
                                                            newArray[index].PointId = callBackItem.PointId;
                                                            newArray[index].PointName = callBackItem.PointName;

                                                            // 清除数据
                                                            newArray[index].selectedFaultUnit = null;
                                                            newArray[index].FaultUnitID = '';
                                                            newArray[index].FaultUnitName = '';
                                                            newArray[index].IsMaster = '';

                                                            newArray[index].selectedEquipmentInfo = null;
                                                            newArray[index].EquipmentInfoID = '';
                                                            newArray[index].equipmentNumber = '';
                                                            newArray[index].EquipmentName = '';


                                                            this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray }));
                                                            this.props.dispatch(createAction('CTRepair/getRepairRecordParames')({ PointId: callBackItem.PointId }));

                                                        }
                                                    }}
                                                    showText={SentencedToEmpty(item, ['PointName'], '')}
                                                    placeHolder={this.isEdit() ? "请选择" : '未选择'}
                                                />
                                            ) : null}

                                            <FormPicker
                                                editable={this.isEdit()}
                                                required={true}
                                                label="故障单元"
                                                defaultCode={SentencedToEmpty(item, ['FaultUnitID'], '')}
                                                option={{
                                                    codeKey: 'ID',
                                                    nameKey: 'FaultUnitName',
                                                    defaultCode: SentencedToEmpty(item, ['FaultUnitID'], ''),
                                                    dataArr: SentencedToEmpty(this.props.repairRecordParamesResult, ['data', 'Datas', 'FaultUnitList'], []),
                                                    onSelectListener: callBackItem => {
                                                        // let newArray = [...this.props.dataArray];
                                                        let newArray = [].concat(this.props.dataArray);
                                                        tempItem = { ...newArray[index] };
                                                        tempItem.selectedFaultUnit = callBackItem;
                                                        tempItem.FaultUnitID = callBackItem.ID;
                                                        tempItem.FaultUnitName = callBackItem.FaultUnitName;
                                                        tempItem.IsMaster = callBackItem.IsMaster;


                                                        // 清除数据
                                                        tempItem.selectedEquipmentInfo = null;
                                                        tempItem.EquipmentInfoID = '';
                                                        tempItem.equipmentNumber = '';
                                                        tempItem.EquipmentName = '';

                                                        newArray[0] = tempItem;

                                                        this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray }));
                                                    }
                                                }}
                                                showText={SentencedToEmpty(item, ['FaultUnitName'], '')}
                                                placeHolder={this.isEdit() ? "请选择" : '未选择'}
                                            />
                                            <FormDatePicker
                                                editable={this.isEdit()}
                                                required={true}
                                                getPickerOption={() => {
                                                    return {
                                                        defaultTime: moment(item.FaultTime).format('YYYY-MM-DD HH:mm:ss'),
                                                        type: 'hour',
                                                        onSureClickListener: time => {
                                                            this.upDateItem(index, 'FaultTime', time);
                                                        }
                                                    };
                                                }}
                                                label={'故障时间'}
                                                timeString={moment(item.FaultTime).format('YYYY-MM-DD HH:00')}
                                            />
                                            {// IsMaster 1 主机  2是其他吗？
                                                SentencedToEmpty(item, ['IsMaster'], 2) == 1 ? (
                                                    <FormPicker
                                                        editable={this.isEdit()}
                                                        label="主机名称型号"
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
                                                                newArray[index].equipmentNumber = callBackItem.equipmentNumber;
                                                                newArray[index].EquipmentName = callBackItem.Name;
                                                                this.props.dispatch(createAction('CTRepair/updateState')({ dataArray: newArray }));
                                                            }
                                                        }}
                                                        showText={SentencedToEmpty(item, ['EquipmentName'], '')}
                                                        placeHolder={this.isEdit() ? "请选择" : '未选择'}
                                                    />
                                                ) : (
                                                    <FormInput
                                                        editable={this.isEdit()}
                                                        label={'名称型号'}
                                                        placeholder="请记录"
                                                        keyboardType="default"
                                                        value={item.EquipmentInfoID}
                                                        onChangeText={text => {
                                                            this.upDateItem(index, 'EquipmentInfoID', text);
                                                        }}
                                                    />
                                                )}
                                            <FormTextArea
                                                editable={this.isEdit()}
                                                label="故障现象"
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=""
                                                value={item.FaultPhenomenon}
                                                onChangeText={text => {
                                                    this.upDateItem(index, 'FaultPhenomenon', text);
                                                }}
                                            />
                                            <FormTextArea
                                                editable={this.isEdit()}
                                                label="原因分析"
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=""
                                                value={item.CauseAnalysis}
                                                onChangeText={text => {
                                                    this.upDateItem(index, 'CauseAnalysis', text);
                                                }}
                                            />
                                            <FormTextArea
                                                editable={this.isEdit()}
                                                label="处理方法"
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=""
                                                value={item.ProcessingMethod}
                                                onChangeText={text => {
                                                    this.upDateItem(index, 'ProcessingMethod', text);
                                                }}
                                            />
                                            <FormTextArea
                                                editable={this.isEdit()}
                                                label="处理结果"
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=""
                                                value={item.ProcessingResults}
                                                onChangeText={text => {
                                                    this.upDateItem(index, 'ProcessingResults', text);
                                                }}
                                            />
                                            <FormTextArea
                                                editable={this.isEdit()}
                                                label="备注"
                                                areaWidth={SCREEN_WIDTH - 36}
                                                placeholder=""
                                                value={item.Remark}
                                                onChangeText={text => {
                                                    this.upDateItem(index, 'Remark', text);
                                                }}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                    </View>
                </ScrollView>
                {/* </KeyboardAwareScrollView> */}
                {this.isEdit() ? < Button
                    text={'添加'}
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
                /> : null}
                {this.isEdit() ? <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        // this.deleteALL();
                        this.refs.delFormAlert.show();
                    }}
                >
                    {SentencedToEmpty(this.props, ['dataArray', 0, 'PointId'], '') != '' ? (
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'删除'}</SDLText>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'表单'}</SDLText>
                        </View>
                    ) : null}
                </TouchableOpacity> : null}
                <AlertDialog options={delFormOptions} ref="delFormAlert" />
                {this.props.repairSaveResult.status == -1 ? <SimpleLoadingView message={'正在保存中'} /> : null}
                {this.props.repairDelResult.status == -1 ? <SimpleLoadingView message={'正在删除表单'} /> : null}
            </StatusPage>
        );
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
        borderBottomColor: globalcolor.borderBottomColor
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
    }
});
