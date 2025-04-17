import React, { Component } from 'react';
import {
    View, StyleSheet, Image, TouchableOpacity
    , TouchableWithoutFeedback, Platform, Text
    , KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
// import { createStackNavigator, NavigationActions } from 'react-navigation';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { SCREEN_WIDTH } from '../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, StackActions, SentencedToEmpty, NavigationActions, CloseToast } from '../../utils';
import { StatusPage, SimpleLoadingComponent, Touchable, SDLText, TextInput, PickerTouchable, AlertDialog, SimpleLoadingView } from '../../components';

import globalcolor from '../../config/globalcolor';
import ImageGrid from '../../components/form/images/ImageGrid';

/**
 * 任务处理
 * @class TaskHandle
 * @extends {Component}
 */

@connect(({ taskDetailModel }) => ({
    taskID: taskDetailModel.taskID,
    taskDetail: taskDetailModel.taskDetail,
    updateStatus: taskDetailModel.updateStatus,
    isSigned: taskDetailModel.isSigned, //是否已经打卡
    isMyTask: taskDetailModel.isMyTask, //是否是本人的任务
    taskStatus: taskDetailModel.taskStatus //任务状态  1待执行，2进行中，3已完成， 10 系统关闭
}))
export default class TaskHandle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Images: []
        };
    }

    componentDidMount() {
        const { taskDetail } = this.props;
        const ImgList = SentencedToEmpty(taskDetail, ['Attachments', 'ImgList'], []);
        const Images = [];
        if (ImgList && ImgList.length > 0) {
            ImgList.map(item => {
                Images.push({ AttachID: item });
            });
        }
        this.setState({
            TaskContent: taskDetail.TaskDescription ? taskDetail.TaskDescription : '', //输入内容
            Images: [] //图片
        });
    }

    /**
     * 是否可以编辑
     * @memberof TaskHandle
     */
    isEdit = () => {
        const { isMyTask, taskStatus, taskDetail } = this.props;
        if (!isMyTask) {
            return false; //不是我的任务不可以编辑
        }
        //  3已完成， 10 系统关闭
        if ((taskStatus == '3' || taskStatus == '10') && !SentencedToEmpty(taskDetail, ['UpdateStatus'], false)) {
            //UpdateStatus 任务完成后一段时间内仍然可以修改，通过该字段控制，可能是6小时
            return false; //任务已完成,不可编辑 任务状态  1待执行，2进行中，3已完成
        }
        return true;
    };

    renderUpdateButton = () => {
        const { isMyTask, taskStatus, taskDetail } = this.props;
        //  3已完成， 10 系统关闭
        if (isMyTask && (taskStatus == '3' || taskStatus == '10') && SentencedToEmpty(taskDetail, ['UpdateStatus'], false)) {
            //任务结束 6小时内可以修改，此按钮用于修改处理说明
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (SentencedToEmpty(this, ['state', 'TaskContent'], '').trim() == '') {
                            ShowToast('任务处理说明不能为空');
                            return;
                        }
                        this.props.dispatch(
                            createAction('taskDetailModel/updateTask')({
                                params: {
                                    description: this.state.TaskContent
                                }
                            })
                        );
                    }}
                    style={[
                        {
                            width: SCREEN_WIDTH - 26,
                            marginTop: 10,
                            height: 56,
                            marginLeft: 13,
                            borderRadius: 4,
                            backgroundColor: '#339afe',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    ]}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'修改处理说明'}
                    </SDLText>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    };

    /* 渲染标题bar */
    renderBar = (imageRequire, text, iconStyles) => {
        let useIconStyles = { width: 22, height: 22, marginLeft: 13 };
        if (iconStyles && typeof iconStyles != 'undefined') {
            useIconStyles = iconStyles;
        }
        return (
            <View style={{ width: SCREEN_WIDTH, height: 40, flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#fff' }}>
                <Image style={[useIconStyles]} source={imageRequire} />
                <SDLText fontType={'normal'} style={{ color: '#333', fontWeight: 'bold', marginLeft: 6 }}>
                    {text}
                </SDLText>
                {text == '上传图片' ? (
                    <Text style={[{ backgroundColor: '#9cc6f5', fontSize: 10, color: 'white', borderRadius: 2, paddingHorizontal: 6, marginLeft: 5, height: 17, lineHeight: 17 }]}>{`纸质单据照片请在“添加台账”功能中选择台账后上传`}</Text>
                ) : null}
                {text == '协助人员' && this.isEdit() ? (
                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                        <Touchable
                            onPress={() => {
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'ContactOperation',
                                        params: {
                                            selectType: 'people',
                                            callFrom: 'addHelper',
                                            callback: item => {
                                                this.props.dispatch(createAction('taskDetailModel/updateState')({ helperOperator: item }));
                                                this.props.dispatch(createAction('taskDetailModel/addTaskHelpers')({}));
                                            }
                                        }
                                    })
                                );
                            }}
                        >
                            <SDLText fontType={'normal'} style={{ color: '#4aa0ff', fontWeight: 'bold', marginHorizontal: 16 }}>
                                {`添加`}
                            </SDLText>
                        </Touchable>
                    </View>
                ) : null}
            </View>
        );
    };

    /* 渲染底部按钮 */
    renderBottomBtn = () => {
        const { taskStatus } = this.props;
        //  3已完成， 10 系统关闭
        if (taskStatus == '3' || taskStatus == '10' || !this.isEdit()) return null;
        return (
            <View style={{ width: SCREEN_WIDTH, height: 56, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 13, paddingRight: 13, paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff' }}>
                <Touchable
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH / 2 - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.dispatch(
                            createAction('taskDetailModel/saveTask')({
                                params: {
                                    description: this.state.TaskContent
                                }
                            })
                        );
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'暂存此任务'}
                    </SDLText>
                </Touchable>
                <Touchable
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH / 2 - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        let haveMainId = true;
                        let formNameArr = [];

                        const { TaskFormList } = this.props.taskDetail;
                        // 如果所有表单都不是必填
                        let allCanbeNull = true;
                        let isCalibrationForm = false, // 是否为 CEMS零点量程漂移与校准记录表
                            hasFillIn = true; // 常规CEMS零点量程漂移与校准记录表是否可以结束任务（0:否，1:是）
                        TaskFormList.map(item => {
                            // 常规CEMS零点量程漂移与校准记录表是否可以结束任务（0:否，1:是）
                            if (item.TypeID == 8) {
                                isCalibrationForm = true;
                                if (typeof item.Status == 'number' && item.Status == 0) {
                                    hasFillIn = false;
                                } else {
                                    hasFillIn = true;
                                }
                            }
                            if (item.IsRequired == 1 && SentencedToEmpty(item, ['FormMainID'], '') == '') {
                                allCanbeNull = false;
                                // 某张表单必填，但是没有FormMainID，则不能完成任务
                                haveMainId = false;
                                formNameArr.push(item.Abbreviation);
                            }
                        });
                        if (!haveMainId && allCanbeNull) {
                            // 如果 没有表单必填，则认为任务可以完成
                            haveMainId = true;
                        }
                        // 原有巡检必须填写故障小时数表单逻辑
                        if (`${SentencedToEmpty(this.props.taskDetail, ['TaskTypeText'], '')}` == '巡检') {
                            const { TaskFormList } = this.props.taskDetail;
                            TaskFormList.map(item => {
                                if (item.TypeName == 'FaultHistoryList' && SentencedToEmpty(item, ['FormMainID'], '') == '') {
                                    haveMainId = false;
                                    let findIndex = formNameArr.findIndex((formNameItem, nameIndex) => {
                                        return formNameItem == item.Abbreviation;
                                    });
                                    if (findIndex == -1) {
                                        formNameArr.push(item.Abbreviation);
                                    }
                                }
                            });
                        }
                        if ((`${SentencedToEmpty(this.props.taskDetail, ['TaskTypeText'], '')}` == '巡检' && haveMainId == true) || (`${SentencedToEmpty(this.props.taskDetail, ['TaskTypeText'], '')}` != '巡检' && haveMainId)) {
                            // 常规CEMS零点量程漂移与校准记录表是否可以结束任务（0:否，1:是）
                            if (isCalibrationForm) {
                                // 是否为 常规CEMS零点量程漂移与校准记录表
                                if (hasFillIn) {
                                    if (SentencedToEmpty(this.state, ['TaskContent'], '') == '') {
                                        ShowToast(`处理说明不能为空`);
                                    } else {
                                        // 常规CEMS零点量程漂移与校准记录表是否可以结束任务（0:否，1:是）
                                        this.props.dispatch(
                                            createAction('taskDetailModel/endTask')({
                                                params: {
                                                    description: this.state.TaskContent
                                                }
                                            })
                                        );
                                    }
                                } else {
                                    ShowToast(`请填写${'常规CEMS零点量程漂移与校准记录表'}`);
                                }
                            } else {
                                // 处理说明不能为空
                                if (SentencedToEmpty(this.state, ['TaskContent'], '').replace(/\s/g, "") == '') {
                                    ShowToast(`处理说明不能为空`);
                                } else {
                                    this.props.dispatch(
                                        createAction('taskDetailModel/endTask')({
                                            params: {
                                                description: this.state.TaskContent
                                            }
                                        })
                                    );
                                }
                            }
                        } else {
                            // ShowToast('请先填写故障小时记录表再进行提交');
                            let formNameStr = '';
                            formNameArr.map((formNameItem, nameIndex) => {
                                if (nameIndex == 0) {
                                    formNameStr = formNameItem;
                                } else {
                                    formNameStr = formNameStr + ',' + formNameItem;
                                }
                            });
                            // ShowToast('您有必填表单未填写');
                            ShowToast(`${formNameStr}为必填表单`);
                        }
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'结束此任务'}
                    </SDLText>
                </Touchable>
            </View>
        );
    };

    /* 渲染表单 */
    renderForms = () => {
        const selectFormList = [];
        const noSelectFormList = [];
        const { TaskFormList } = this.props.taskDetail;
        TaskFormList.map(item => {
            if (item.FormMainID) {
                selectFormList.push(item); //有FormMainID为已经填写了的表单
            } else {
                noSelectFormList.push(item); //没有FormMainID为尚未填写了的表单
            }
        });

        let defaultCode = '';
        if (noSelectFormList && noSelectFormList[0]) defaultCode = noSelectFormList[0].TypeName;
        return (
            <View style={{ width: SCREEN_WIDTH, minHeight: 100, backgroundColor: 'white', paddingBottom: 10 }}>
                {this.renderFormAddButton(defaultCode, noSelectFormList)}
                {selectFormList.map((item, index) => {
                    return (
                        <Touchable
                            key={index}
                            style={{ flexDirection: 'row', alignItems: 'center', height: 32 }}
                            onPress={() => {
                                // console.log('item = ', item);
                                this.openForm(item);
                            }}
                        >
                            <View style={{ width: 18, height: 18, marginLeft: 18, borderRadius: 4, backgroundColor: '#999', justifyContent: 'center', alignItems: 'center' }}>
                                <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                                    {index + 1}
                                </SDLText>
                            </View>

                            <SDLText fontType={'small'} style={{ color: '#666', marginLeft: 4 }}>
                                {item.CnName}
                            </SDLText>
                        </Touchable>
                    );
                })}
            </View>
        );
    };

    renderFormAddButton = (defaultCode, noSelectFormList) => {
        if (this.isEdit()) {
            return (
                <PickerTouchable
                    option={{
                        codeKey: 'TypeName',
                        nameKey: 'CnName',
                        defaultCode,
                        dataArr: noSelectFormList,
                        onSelectListener: item => {
                            this.openForm(item);
                        }
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', height: 32, backgroundColor: '#fff' }}
                >
                    <View style={{ width: 18, height: 18, marginLeft: 18, borderRadius: 4, backgroundColor: '#999', justifyContent: 'center', alignItems: 'center' }}>
                        <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                            {'+'}
                        </SDLText>
                    </View>

                    <SDLText fontType={'small'} style={{ color: '#666', marginLeft: 4 }}>
                        {'添加台账'}
                    </SDLText>
                </PickerTouchable>
            );
        }
    };

    openForm = item => {
        /*if (this.props.taskDetail.PollutantType == '2') {
            if (this.isEdit()) {
                switch (item.ID) {
                    case 9: //对比校验
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'BdRecordList', params: {} }));
                        break;
                    case 5: //日常巡检-完全抽取法
                    case 6: //日常巡检-稀释采样法
                    case 7: //日常巡检-直接测量法
                        this.props.dispatch(createAction('patrolRecordModel/updateState')({ TypeID: item.ID }));
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PatrolRecord', params: {} }));
                        break;
                    case 1: //维修记录表
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'RepairRecordList', params: {} }));
                        break;
                    case 2: //停机记录表
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'MachineHaltRecord', params: { TypeName: 'StopCemsHistoryList' } }));
                        break;
                    case 3: //易耗品记录表
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PoConsumablesReplaceRecord', params: { TypeName: 'ConsumablesReplaceRecord' } }));
                        break;
                    case 4: //标气记录
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PoStandardGasRepalceForm', params: { TypeName: 'StandardGasRepalceHistoryList' } }));
                        break;
                    case 8: //零点量程漂移校准
                        this.props.dispatch(createAction('calibrationRecord/getInfo')({ createForm: true }));
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'CalibrationRecordList',
                                params: { ...item, createForm: true }
                            })
                        );
                        break;
                    case 28: //备品备件更换记录
                        // console.log('taskDetail = ', this.props.taskDetail);
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'SparePartsRecord', params: { TaskID: this.props.taskDetail.TaskID } }));
                        break;
                    case 10: //设备数据异常记录表
                        // console.log('taskDetail = ', this.props.taskDetail);
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'EquipmentAbnormalForm', params: { TaskID: this.props.taskDetail.TaskID } }));
                        break;
                    case 27: //设备保养
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'MachineryMaintenanceRecords', params: { TaskID: this.props.taskDetail.TaskID } }));
                        break;
                }
            } else {
                console.log('item = ', item);
                if (typeof item.formUrl != 'undefined' && item.formUrl != '') {
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: item.formUrl, title: item.CnName, item, reloadList: () => {} } }));
                } else {
                    ShowToast('表单浏览功能敬请期待。');
                }
            }
        } else {
            this.props.dispatch(
                StackActions.push({
                    routeName: 'ImageForm',
                    params: { ...item, createForm: item.FormMainID != null ? true : false }
                })
            );
        }*/
        if (this.isEdit()) {
            if (item.TypeName == 'FaultHistoryList') {
                // 异常小时数记录
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'EquipmentFaultForm',
                        params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                    })
                );
            } else {
                // 0：图片   1：电子表单    Type字段
                if (item.Type == '0') {
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'ImageForm'
                        , params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                    }));

                } else if (item.Type == '1') {
                    switch (item.ID) {
                        case 74: // 示值误差和响应时间
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'IndicationErrorAndResponseTimeList',
                                    params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 92: // 示值误差和响应时间 - 淄博
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'IndicationErrorAndResponseTimeList_zb',
                                    params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 76: // 巡检完全抽取法
                        case 77: // 巡检稀释采样法
                        case 78: // 巡检直接测量法
                        case 79: // 巡检 VOCs 监测
                        case 80: // 巡检废水
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'Patrol_CEM',
                                    params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 83: // 标准物质更换
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'RMR',
                                    params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 84: // 废气-易耗品更换
                        case 85: // 废水-易耗品更换
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'ConsumableReplace',
                                    params: { ...item, PollutantType: this.props.taskDetail?.PollutantType, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 86: // 校验测试记录表
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'BdRecordList_zb', params: {} }));
                            break;
                        case 59: // 异常小时数记录 废气
                        case 58: // 异常小时数记录 废水
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'EquipmentFaultForm',
                                    params: { ...item, createForm: item.FormMainID != null ? true : false, viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                                })
                            );
                            break;
                        case 9: //对比校验
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'BdRecordList', params: {} }));
                            break;
                        case 5: //日常巡检-完全抽取法
                        case 6: //日常巡检-稀释采样法
                        case 7: //日常巡检-直接测量法
                            this.props.dispatch(createAction('patrolRecordModel/updateState')({ TypeID: item.ID }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'PatrolRecord', params: {} }));
                            break;
                        case 1: //维修记录表 废气
                        case 12: //维修记录表 废水
                            // this.props.dispatch(NavigationActions.navigate({ routeName: 'RepairRecordList', params: {} }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'RepairRecordForm', params: { item } }));
                            break;
                        case 2: //停机记录表
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'MachineHaltRecord', params: { TypeName: 'StopCemsHistoryList' } }));
                            break;
                        case 3: //易耗品记录表 废气
                        case 14: //易耗品记录表 废水
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'PoConsumablesReplaceRecord', params: { TypeName: 'ConsumablesReplaceRecord', item } }));
                            break;
                        case 4: //标气记录
                            this.props.dispatch(createAction('taskModel/getInfoGas')({ params: { TypeName: 'StandardGasRepalceHistoryList' } }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'PoStandardGasRepalceForm', params: { TypeName: 'StandardGasRepalceHistoryList' } }));
                            break;
                        case 8: //零点量程漂移校准
                            // this.props.dispatch(createAction('calibrationRecord/getInfo')({ createForm: true }));
                            this.props.dispatch(
                                createAction('calibrationRecord/updateState')({
                                    liststatus: { status: -1 },
                                    JzConfigItemResult: { status: -1 },
                                    JzConfigItemSelectedList: [],
                                    TypeID: item.TypeID,
                                    TaskID: item.TaskID
                                })
                            );
                            this.props.dispatch(createAction('calibrationRecord/getJzItem')({ ...item, createForm: true }));
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'CalibrationRecordList',
                                    params: { ...item, createForm: true }
                                })
                            );
                            break;
                        case 28: //备品备件更换记录
                        case 20: //备品备件更换记录 污水
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'SparePartsRecord', params: { TaskID: this.props.taskDetail.TaskID, item } }));
                            break;
                        case 10: //设备数据异常记录表
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'EquipmentAbnormalForm', params: { TaskID: this.props.taskDetail.TaskID } }));
                            break;
                        case 27: //设备保养
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'MachineryMaintenanceRecords', params: { TaskID: this.props.taskDetail.TaskID } }));
                            break;
                        case 15: //试剂更换记录
                            this.props.dispatch(createAction('taskModel/updateState')({
                                standardLiquidRepalceRecordListResult: { status: -1 }
                            }));
                            this.props.dispatch(createAction('taskModel/getStandardLiquidRepalceRecordList')({
                                TypeName: 'StandardLiquidReplaceHistoryList'
                            }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'PoStandardLiquidReplaceRecord', params: { TypeName: 'StandardLiquidReplaceHistoryList' } }));
                            break;
                        case 61: // 废水 配合检查
                        case 62: // 废气 配合检查
                            this.props.dispatch(createAction('peiHeJianChaModel/updateState')({ cooperationInspectionRecordResult: { status: -1 } }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'PoPeihejianchaJilu', params: { item } }));
                            break;
                        case 63: // 数据一致性（实时数据）记录 废气
                        case 18: // 数据一致性（实时数据）记录 废水
                            // this.props.dispatch(createAction('peiHeJianChaModel/updateState')({cooperationInspectionRecordResult:{status:-1}}));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyRecord', params: { item } }));
                            break;
                        case 65: // 上月委托第三方检测次数 废气
                        case 73: // 上月委托第三方检测次数 废水
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'DetectionTimesForm', params: { item } }));
                            break;
                        case 66: // 数据一致性（小时日均数据）记录 废气
                        case 74: // 数据一致性（小时日均数据）记录 废水
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyHDRecord', params: { item } }));
                            break;
                        case 16: // 水质校准记录表
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterCalibrationForm', params: { item } }));
                            // 测试代码
                            // this.props.dispatch(NavigationActions.navigate({ routeName: 'StandardSolutionCheckForm', params: { item } }));
                            // this.props.dispatch(NavigationActions.navigate({ routeName: 'GasEquipmentParametersChangeForm', params: { item } }));
                            // this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterEquipmentParametersChangeForm', params: { item } }));
                            break;
                        case 70: // 标液检查记录
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'StandardSolutionCheckForm', params: { item } }));
                            break;
                        case 72: // 设备参数核对记录 参数核对记录 污水设备参数变动记录表
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterEquipmentParametersChangeForm', params: { item } }));
                            break;
                        case 64: // 废气参数变动接口 设备参数核对记录
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'GasEquipmentParametersChangeForm', params: { item } }));
                            break;
                        case 19: // 实际水样比对试验结果记录表 水污染源校验记录
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterSampleComparisonTestForm', params: { item } }));
                            break;
                        /**淄博项目 */
                        case 81: //零点量程漂移校准 废水
                            this.props.dispatch(
                                createAction('calibrationRecordZbFs/updateState')({
                                    liststatus: { status: -1 },
                                    JzConfigItemResult: { status: -1 },
                                    JzConfigItemSelectedList: [],
                                    TypeID: item.TypeID,
                                    TaskID: item.TaskID
                                })
                            );
                            this.props.dispatch(createAction('calibrationRecordZbFs/getJzItem')({ ...item, createForm: true }));
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'CalibrationRecordListZbFs',
                                    params: { ...item, createForm: true, }
                                })
                            );
                            break;
                        case 82: //零点量程漂移校准 废气
                            this.props.dispatch(
                                createAction('calibrationRecordZb/updateState')({
                                    liststatus: { status: -1 },
                                    JzConfigItemResult: { status: -1 },
                                    JzConfigItemSelectedList: [],
                                    TypeID: item.TypeID,
                                    TaskID: item.TaskID
                                })
                            );
                            this.props.dispatch(createAction('calibrationRecordZb/getJzItem')({ ...item, createForm: true }));
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'CalibrationRecordListZb',
                                    params: { ...item, createForm: true, }
                                })
                            );
                            break;
                    }
                }
            }
        } else {
            if (SentencedToEmpty(item, ['RecordType'], 0) == '0') {
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'ImageForm'
                        , params: { ...item, createForm: item.FormMainID != null ? true : false, isEdit: 'noEdit', viewTitle: SentencedToEmpty(item, ['CnName'], '图片表单') }
                    })
                );
            } else if (SentencedToEmpty(item, ['RecordType'], 0) == '1') {
                this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: item.formUrl, title: item.CnName, item, reloadList: () => { } } }));
                // this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: 'http://172.16.9.8:6789/appoperation/appsparepartreplacerecord/85938da9-1561-44c5-aa9f-6826757a3003/28', title: item.CnName, item, reloadList: () => {} } }));
            }
        }
    };

    renderTaskHelpersList = () => {
        return (
            <View style={{ width: SCREEN_WIDTH, minHeight: 100, backgroundColor: 'white', paddingHorizontal: 13 }}>
                <View style={{ backgroundColor: '#e7e7e7', height: 0.5 }} />
                {SentencedToEmpty(this.props.taskDetail, ['TaskHelpersPeople'], []).map((item, index) => {
                    return (
                        <View key={`helper${index}`} style={[{ borderBottomWidth: 0.5, borderBottomColor: '#e7e7e7', paddingLeft: 10, paddingRight: 19, height: 44, flexDirection: 'row', alignItems: 'center' }]}>
                            <SDLText style={[{ color: '#666' }]}>{SentencedToEmpty(item, ['User_Name'], '未知用户')}</SDLText>
                            <View style={{ flex: 1 }} />
                            {this.isEdit() ? (
                                <Touchable
                                    style={[{ height: 19, width: 19 }]}
                                    onPress={() => {
                                        this.props.dispatch(createAction('taskDetailModel/updateState')({ delHelperOperator: item }));
                                        this.refs.doAlert.show();
                                    }}
                                >
                                    <Image style={[{ height: 19, width: 19 }]} source={require('../../images/ic_del_helper.png')} />
                                </Touchable>
                            ) : null}
                        </View>
                    );
                })}
                <View />
            </View>
        );
    };

    //真正开始执行协助人删除
    confirm = () => {
        this.props.dispatch(createAction('taskDetailModel/deleteTaskHelpers')({}));
    };

    render() {
        // console.log('updateStatus = ',this.props.updateStatus);
        const { taskDetail } = this.props;
        // const ImgList = SentencedToEmpty(taskDetail, ['Attachments', 'ImgList'], []);
        const ImgList = SentencedToEmpty(taskDetail, ['Attachments', 'ImgNameList'], []);
        const Images = [];
        if (ImgList && ImgList.length > 0) {
            ImgList.map(item => {
                Images.push({ AttachID: item });
            });
        }
        // console.log('Images = ',Images);
        const { isSigned, taskID } = this.props;
        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要删除此协助人吗？',
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
            <View style={styles.container}>
                <ScrollView style={[styles.container]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? "padding" : "height"}
                        style={styles.container}>
                        {this.renderBar(require('../../images/icon_task_processing.png'), '处理说明')}
                        <View style={{ width: SCREEN_WIDTH, minHeight: 60, backgroundColor: '#fff' }}>
                            {
                                <TextInput
                                    editable={this.isEdit()}
                                    multiline={true}
                                    placeholder={this.isEdit() ? '请填写任务处理说明' : '暂无任务处理说明'}
                                    placeholderTextColor={'#999999'}
                                    style={{ marginHorizontal: 13, minHeight: 40, marginTop: 4, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#e7e7e7', textAlignVertical: 'top', color: '#666666' }}
                                    onChangeText={text => this.setState({ TaskContent: text })}
                                >
                                    {this.state.TaskContent}
                                </TextInput>
                                /*
                                <TextInput
                                    editable={this.isEdit()}
                                    multiline={true}
                                    style={{ marginHorizontal: 13, height: 80, marginTop: 4, marginBottom: 10, borderWidth: 1, borderRadius: 3, borderColor: '#e7e7e7', textAlignVertical: 'top' }}
                                    onChangeText={text => this.setState({ TaskContent: text })}
                                >
                                    {this.state.TaskContent}
                                </TextInput>*/
                            }
                        </View>
                        {this.renderUpdateButton()}
                        {this.renderBar(require('../../images/icon_add_new_form.png'), '运维台账')}
                        {this.renderForms()}
                        {this.renderBar(require('../../images/icon_upload_pictures.png'), '上传图片')}
                        <ImageGrid
                            componentType={'taskhandle'}
                            extraInfo={taskDetail}
                            style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                            Imgs={Images}
                            isUpload={this.isEdit()}
                            isDel={this.isEdit()}
                            UUID={SentencedToEmpty(taskDetail, ['AttachmentsId'], taskID)}
                            uploadCallback={items => {
                                console.log('uploadCallback', items);
                                let newTaskDetail = { ...taskDetail };
                                // let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgList'], [])); 
                                let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgNameList'], []));
                                items.map(imageItem => {
                                    newImgList.push(imageItem.AttachID);
                                });
                                let Attachments = SentencedToEmpty(taskDetail, ['Attachments'], {});
                                Attachments.ImgNameList = newImgList;
                                newTaskDetail.Attachments = Attachments;
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
                            }}
                            delCallback={index => {
                                console.log('delCallback=', index);
                                let newTaskDetail = { ...taskDetail };
                                // let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgList'], []));
                                let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgNameList'], []));
                                newImgList.splice(index, 1);
                                let Attachments = SentencedToEmpty(taskDetail, ['Attachments'], {});
                                Attachments.ImgNameList = newImgList;
                                newTaskDetail.Attachments = Attachments;
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
                                CloseToast();
                            }}
                        />
                        {this.renderBar(require('../../images/ic_add_helper.png'), '协助人员')}
                        {this.renderTaskHelpersList()}
                    </KeyboardAvoidingView>
                </ScrollView>
                {this.renderBottomBtn()}
                {SentencedToEmpty(this.props, ['taskDetail', 'OperationFlag'], '1') == 2 || isSigned ? null : <Touchable style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0 }} onPress={this.props.taskSign} />}
                <AlertDialog options={alertOptions} ref="doAlert" />
                {this.props.updateStatus == -1 ? <SimpleLoadingView message={'提交中'} /> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        backgroundColor: globalcolor.statusPageBackgroundColor
    }
});
