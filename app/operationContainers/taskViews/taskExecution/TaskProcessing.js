import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Modal, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { BoxShadow } from 'react-native-shadow';
import { connect } from 'react-redux';
import moment from 'moment';

import { PickerTouchable, ModalParent } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../config/globalsize';
import ImageViewPicker from './components/ImageViewPicker';
import { SentencedToEmpty, createAction, StackActions, NavigationActions, ShowToast } from '../../../utils';
import { getToken } from '../../../dvapack/storage';
import Mask from '../../../components/Mask';
import TaskFormCreateList from './components/TaskFormCreateList';
import ConfirmDialog from './components/ConfirmDialog';
import FormListView from './components/FormListView';
import ImageViewer from 'react-native-image-zoom-viewer';
let _me = {};

const ic_arrows_down = require('../../../images/ic_arrows_down.png');
/**任务执行tab页 */
@connect(({ taskModel }) => ({
    currentTask: taskModel.currentTask,
    EquipmentStatus: taskModel.EquipmentStatus
}))
export default class TaskProcessing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectItem: {},
            isLeftoverProblem: SentencedToEmpty(this.props.currentTask, ['IsExistRemainingProblems'], '0') == '1' ? { code: '1', name: '是' } : { code: '0', name: '否' },
            doConfirm: false,
            User_ID: getToken().User_ID,
            WorkTime: SentencedToEmpty(this.props.currentTask, ['WorkTime'], ''),
            Description: SentencedToEmpty(this.props.currentTask, ['Description'], ''),
            RemProCompletionCycle: SentencedToEmpty(this.props.currentTask, ['RemProCompletionCycle'], ''),
            RemainingProblemsDescription: SentencedToEmpty(this.props.currentTask, ['RemainingProblemsDescription'], ''),
            large: '',
            modalVisible: false,
            showUrls: []
        };
        _me = this;
    }

    getEnterprise = () => {
        const dataArr = [
            { code: '01', name: '企业1' },
            { code: '02', name: '企业2' },
            { code: '03', name: '企业3' }
        ];
        return {
            codeKey: 'code',
            nameKey: 'name',
            defaultCode: '01',
            dataArr,
            onSelectListener: item => {
                this.setState({
                    selectItem: item
                });
            }
        };
    };

    canExecute = () => {
        let boolCanExecute = false;
        if (SentencedToEmpty(this.props.currentTask, ['OperationsUserID'], '') == getToken().User_ID) {
            if (SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == '') {
                boolCanExecute = false;
            } else if (this.props.currentTask.TaskStatus == 1) {
                boolCanExecute = true;
            } else if (this.props.currentTask.TaskStatus == 2) {
                boolCanExecute = true;
            } else if (this.props.currentTask.TaskStatus == 3) {
                boolCanExecute = false;
            }
        } else {
            boolCanExecute = false;
        }
        return boolCanExecute;
    };
    //初始化设备状态选项
    initEquipmentStatusOption = (ID, key) => {
        // console.log('initEquipmentStatusOption = ',SentencedToEmpty(this.props.EquipmentStatus,[key,'EquipmentOperationStatus'],null));
        const dataArr = this.props.currentTask.AllStatus;
        return {
            codeKey: 'ID',
            nameKey: 'Name',
            defaultCode: SentencedToEmpty(this.props.EquipmentStatus, [key, 'EquipmentOperationStatus'], null),
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(createAction('taskModel/setEquipmentStatus')({ ID, selected: item.ID }));
            }
        };
    };
    //初始化是否为遗留问题选项
    initIsLeftoverProblem = () => {
        const dataArr = [
            { code: '1', name: '是' },
            { code: '0', name: '否' }
        ];
        return {
            codeKey: 'code',
            nameKey: 'name',
            defaultCode: SentencedToEmpty(this.props.currentTask, ['IsExistRemainingProblems'], '0'),
            dataArr,
            onSelectListener: item => {
                this.setState({
                    isLeftoverProblem: item
                });
            }
        };
    };
    //初始化可创建表单列表
    initCreatFormList = () => {
        const dataArr = [];
        SentencedToEmpty(this.props.currentTask, ['TaskFormList'], []).map((item, key) => {
            if (!item.FormMainID) {
                dataArr.push(item);
            }
        });
        return { codeKey: 'TypeName', nameKey: 'CnName', defaultCode: '01', dataArr, onSelectListener: item => { } };
    };

    getStatusStr = equipment => {
        let str = '请选择设备状态';
        this.props.currentTask.AllStatus.map((item, key) => {
            if (equipment.EquipmentOperationStatus == item.ID) {
                str = item.Name;
            }
        });
        return str;
    };

    // refreshTaskData = () => {
    //     console.log('refreshTaskData');
    //     this.props.dispatch(createAction('taskModel/GetTaskDetails')({'TaskID':this.props.currentTask.TaskID, 'DGIMN':this.props.currentTask.DGIMN, canTransmitTask: true }));
    // }

    renderEquipmentStatus = () => {
        //设备唯一id 由EquipmentCode变更至ID。2020-03-19
        let equipmentViews = [];
        this.props.EquipmentStatus.map((item, key) => {
            let statusStr = this.getStatusStr(item);
            equipmentViews.push(
                <View key={'EquipmentStatus' + key}>
                    <View style={[styles.selectRow]}>
                        <PickerTouchable option={this.initEquipmentStatusOption(item.ID, key)} style={[styles.row]} available={this.canExecute()}>
                            <Text style={[styles.label, { minWidth: 80 }]}>{`${item.EquipmentTypeName}`}</Text>
                            <Text style={[styles.content]}>{statusStr}</Text>
                            <Image style={{ width: 10, height: 10, marginRight: 8 }} source={ic_arrows_down} />
                        </PickerTouchable>
                    </View>
                    <View style={[styles.selectRow]}>
                        <View style={[styles.row]}>
                            <TextInput
                                style={[{ flex: 1, fontSize: 14, color: '#666666' }]}
                                defaultValue={SentencedToEmpty(item, ['ExceptionDescription'], '') + ''}
                                onChangeText={text => {
                                    this.props.dispatch(createAction('taskModel/setEquipmentExceptionDescription')({ ID: item.ID, ExceptionDescription: text }));
                                }}
                                editable={this.canExecute()}
                                placeholder={'设备异常简单描述'}
                                placeholderTextColor={globalcolor.placeholderTextColor}
                            />
                        </View>
                    </View>
                </View>
            );
        });
        return <View>{equipmentViews}</View>;
    };

    _addTaskFormDialog = () => {
        this._modalParent.showModal();
    };

    render() {
        let TaskFormNo = 1;
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_elapsed_time.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>工作时长</Text>
                            </View>
                        </View>
                        <View style={[styles.selectRow, { marginBottom: 15 }]}>
                            <TextInput
                                style={[{ width: SCREEN_WIDTH - 38, fontSize: 14, color: '#666666', textAlignVertical: 'top' }]}
                                defaultValue={SentencedToEmpty(this.props.currentTask, ['WorkTime'], '') + ''}
                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                editable={this.canExecute()}
                                placeholder={'请输入小时数'}
                                multiline={true}
                                numberOfLines={2}
                                placeholderTextColor={globalcolor.placeholderTextColor}
                                onChangeText={text => {
                                    // 动态更新组件内State记录
                                    this.setState({
                                        WorkTime: text
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_task_processing.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>处理情况</Text>
                            </View>
                        </View>
                        <View style={[styles.selectRow, { marginBottom: 15 }]}>
                            <TextInput
                                style={[{ width: SCREEN_WIDTH - 38, fontSize: 14, color: '#666666', textAlignVertical: 'top' }]}
                                defaultValue={SentencedToEmpty(this.props.currentTask, ['Description'], '')}
                                editable={this.canExecute()}
                                placeholder={'请输入处理情况说明'}
                                multiline={true}
                                numberOfLines={2}
                                placeholderTextColor={globalcolor.placeholderTextColor}
                                onChangeText={text => {
                                    // 动态更新组件内State记录
                                    this.setState({
                                        Description: text
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_equipment_status.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>设备状态</Text>
                            </View>
                        </View>
                        {/* 渲染设备状态 */
                            this.renderEquipmentStatus()}
                        <View style={[{ height: 15 }]} />
                    </View>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_omissions_error.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>遗留问题</Text>
                            </View>
                        </View>
                        <View style={[styles.selectRow]}>
                            <PickerTouchable option={this.initIsLeftoverProblem()} style={[styles.row]} available={this.canExecute()}>
                                <Text style={[styles.label]}>{'是否有遗留问题'}</Text>
                                <Text style={[styles.content]}>{this.state.isLeftoverProblem.name}</Text>
                                <Image style={{ width: 10, height: 10, marginRight: 8 }} source={ic_arrows_down} />
                            </PickerTouchable>
                        </View>
                        <View style={[styles.selectRow]}>
                            <View style={[styles.row]}>
                                <Text style={[styles.label]}>{'处理完成周期'}</Text>
                                <TextInput
                                    style={[{ flex: 1, fontSize: 14, color: '#666666' }]}
                                    defaultValue={SentencedToEmpty(this.props.currentTask, ['RemProCompletionCycle'], '')}
                                    editable={this.canExecute()}
                                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                    placeholder={'请输入天数'}
                                    placeholderTextColor={globalcolor.placeholderTextColor}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            RemProCompletionCycle: text
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[{ width: SCREEN_WIDTH - 26, height: 45, justifyContent: 'center' }]}>
                            <Text style={[styles.label, { marginLeft: 6 }]}>{'简单描述'}</Text>
                        </View>
                        <View style={[styles.selectRow, { marginBottom: 15 }]}>
                            <TextInput
                                style={[{ width: SCREEN_WIDTH - 38, fontSize: 14, color: '#666666', textAlignVertical: 'top' }]}
                                editable={this.canExecute()}
                                defaultValue={SentencedToEmpty(this.props.currentTask, ['RemainingProblemsDescription'], '')}
                                placeholder={'遗留问题简单描述'}
                                multiline={true}
                                numberOfLines={2}
                                placeholderTextColor={globalcolor.placeholderTextColor}
                                onChangeText={text => {
                                    // 动态更新组件内State记录
                                    this.setState({
                                        RemainingProblemsDescription: text
                                    });
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_upload_pictures.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>上传图片</Text>
                            </View>
                        </View>
                        <ImageViewPicker
                            // TaskStatus={this.props.TaskDetail.TaskStatus}
                            _showClockIn={() => {
                                // this.props._showClockIn();
                            }}
                            _showImageDetail={image => {
                                this.setState({
                                    modalVisible: true,
                                    showUrls: [
                                        {
                                            url: image.large,
                                            // You can pass props to <Image />.
                                            props: {
                                                // headers: ...
                                            }
                                        }
                                    ]
                                });
                            }}
                        />
                    </View>
                    <View style={[styles.card]}>
                        <View style={[{ width: SCREEN_WIDTH - 26, marginTop: 10 }]}>
                            <View style={[{ flexDirection: 'row' }]}>
                                <Image style={[styles.icon]} source={require('../../../images/icon_add_new_form.png')} />
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>添加表单</Text>
                            </View>
                        </View>
                        {/** 表单显示组件 */}
                        <FormListView />
                        {this.canExecute() ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.props.currentTask.TaskStatus == 2) {
                                        this._addTaskFormDialog();
                                    }
                                    if (this.props.currentTask.TaskStatus == 1) {
                                        // this.props._showClockIn();
                                        this._addTaskFormDialog();
                                    }
                                }}
                            >
                                <View style={[{ width: SCREEN_WIDTH, height: 40, flexDirection: 'row', alignItems: 'center' }]}>
                                    <Icon name={'plus-square'} size={20} style={{ color: globalcolor.datepickerGreyText, marginLeft: 13, marginRight: 4 }} />
                                    <Text>添加表单</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </KeyboardAwareScrollView>
                {this.canExecute() ? (
                    <View style={[{ height: 45, width: SCREEN_WIDTH, flexDirection: 'row' }]}>
                        <BoxShadow setting={{ height: 45, width: SCREEN_WIDTH / 2 - 1, color: '#666', border: 2, radius: 0, opacity: 0.5, x: 0, y: 0 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // this.props.dispatch(StackActions.push({
                                    //     routeName: 'ConsumablesReplaceRecord',params:{'TaskID':this.props.currentTask.TaskID},
                                    // }));
                                    //需要判断当天是否有进场记录
                                    let signInfo = SentencedToEmpty(this.props.currentTask, ['SignInfo'], []);
                                    if (signInfo.length == 0) {
                                        this.props.dispatch(
                                            createAction('taskModel/updateState')({
                                                currnetTimeCardEnterprise: {
                                                    EntCode: SentencedToEmpty(this.props.currentTask, ['EntCode'], ''),
                                                    EntName: SentencedToEmpty(this.props.currentTask, ['EntName'], ''),
                                                    Latitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Latitude'], 40.812903)),
                                                    Longitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Longitude'], 111.683724)),
                                                    Radius: parseFloat(SentencedToEmpty(this.props.currentTask, ['Radius'], 1000))
                                                }
                                            })
                                        );
                                        ShowToast('您还未进行厂区打卡');
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'PunchingTimeCard',
                                                params: {
                                                    // refreshTaskData: this.refreshTaskData
                                                }
                                            })
                                        );
                                    } else if (this.state.WorkTime === '' || this.state.WorkTime == null || isNaN(this.state.WorkTime)) {
                                        ShowToast('未正确填写工作时长');
                                    } else {
                                        this.props.dispatch(
                                            createAction('taskModel/saveTask')({
                                                WorkTime: this.state.WorkTime,
                                                // 'CompleteTime':'',
                                                Description: this.state.Description,
                                                IsExistRemainingProblems: this.state.isLeftoverProblem.code,
                                                RemainingProblemsDescription: this.state.RemainingProblemsDescription,
                                                RemProCompletionCycle: this.state.RemProCompletionCycle,
                                                TaskStatus: 2
                                            })
                                        );
                                    }
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH / 2 - 1,
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 15, color: '#666666' }]}>暂存任务</Text>
                                </View>
                            </TouchableOpacity>
                        </BoxShadow>
                        <BoxShadow setting={{ height: 45, width: SCREEN_WIDTH / 2 - 1, color: '#666', border: 2, radius: 0, opacity: 0.5, x: 0, y: 0 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    let signInfo = SentencedToEmpty(this.props.currentTask, ['SignInfo'], []);
                                    if (signInfo.length == 0) {
                                        this.props.dispatch(
                                            createAction('taskModel/updateState')({
                                                currnetTimeCardEnterprise: {
                                                    EntCode: SentencedToEmpty(this.props.currentTask, ['EntCode'], ''),
                                                    EntName: SentencedToEmpty(this.props.currentTask, ['EntName'], ''),
                                                    Latitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Latitude'], 40.812903)),
                                                    Longitude: parseFloat(SentencedToEmpty(this.props.currentTask, ['Longitude'], 111.683724)),
                                                    Radius: parseFloat(SentencedToEmpty(this.props.currentTask, ['Radius'], 1000))
                                                }
                                            })
                                        );
                                        ShowToast('您还未进行厂区打卡');
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'PunchingTimeCard',
                                                params: {
                                                    // refreshTaskData: this.refreshTaskData
                                                }
                                            })
                                        );
                                    } else if (this.state.WorkTime === '' || this.state.WorkTime == null || isNaN(this.state.WorkTime)) {
                                        ShowToast('未正确填写工作时长');
                                    } else {
                                        this.props.dispatch(
                                            createAction('taskModel/saveTask')({
                                                WorkTime: this.state.WorkTime,
                                                Description: this.state.Description,
                                                CompleteTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                IsExistRemainingProblems: this.state.isLeftoverProblem.name,
                                                RemainingProblemsDescription: this.state.RemainingProblemsDescription,
                                                RemProCompletionCycle: this.state.RemProCompletionCycle,
                                                TaskStatus: 3
                                            })
                                        );
                                    }
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH / 2 - 1,
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 15, color: '#4ba1ff' }]}>结束任务</Text>
                                </View>
                            </TouchableOpacity>
                        </BoxShadow>
                    </View>
                ) : null}
                <ModalParent ref={ref => (this._modalParent = ref)}>
                    {this.state.doConfirm ? (
                        <Mask
                            style={{ justifyContent: 'center' }}
                            hideDialog={() => {
                                this._modalParent.hideModal();
                                this.setState({ doConfirm: false });
                            }}
                        >
                            <ConfirmDialog
                                title={'确认'}
                                description={this.state.willingAddForm.CnName ? '确认创建《' + this.state.willingAddForm.CnName + '》吗？' : '确认创建该表单吗？'}
                                doPositive={() => {
                                    //dialog确定
                                    //后续创建表单操作
                                    //关闭遮罩，关闭确认dialog
                                    this._modalParent.hideModal();
                                    this.setState({ doConfirm: false, willingAddForm: {} });
                                    // 停机记录表
                                    if (this.state.willingAddForm.TypeName == 'ReagentRepalceHistoryList') {
                                        //标准物质更换/水质标准物质
                                        this.props.dispatch(createAction('taskModel/getInfoReagent')({ createForm: true }));
                                        //使用push 不触发拦截器
                                        this.props.dispatch(
                                            StackActions.push({
                                                routeName: 'ReagentRepalceHistoryList',
                                                params: { ...this.state.willingAddForm, createForm: true }
                                            })
                                        );
                                        this.props.dispatch(
                                            StackActions.push({
                                                routeName: 'ReagentRepalceRecordEdit',
                                                params: { index: -1 }
                                            })
                                        );
                                    } else if (this.state.willingAddForm.TypeName == 'StandardGasRepalceHistoryList') {
                                        //标准气体更换
                                        this.props.dispatch(createAction('taskModel/getInfoGas')({ createForm: true }));
                                        //使用push 不触发拦截器
                                        this.props.dispatch(
                                            StackActions.push({
                                                routeName: 'StandardGasRepalceForm',
                                                params: { ...this.state.willingAddForm, createForm: true }
                                            })
                                        );
                                        this.props.dispatch(
                                            StackActions.push({
                                                routeName: 'StandardGasReplacementRecord',
                                                params: { index: -1 }
                                            })
                                        );
                                    } else if (this.state.willingAddForm.TypeName == 'ConsumablesReplaceHistoryList') {
                                        //易耗品更换记录表
                                        this.props.dispatch(
                                            StackActions.push({
                                                routeName: 'ConsumablesReplaceRecord',
                                                params: { TaskID: this.props.currentTask.TaskID }
                                            })
                                        );
                                    } else if (this.state.willingAddForm.TypeName == 'SparePartHistoryList') {
                                        //备件更换记录表
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'SparePartsRecord', params: { TaskID: this.props.currentTask.TaskID } }));
                                    }
                                }}
                                doNegative={() => {
                                    //dialog取消
                                    this._modalParent.hideModal();
                                    this.setState({ doConfirm: false, willingAddForm: {} });
                                }}
                            />
                        </Mask>
                    ) : (
                        <Mask
                            hideDialog={() => {
                                this._modalParent.hideModal();
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <TaskFormCreateList
                                showConfirmDialog={item => {
                                    this.setState({ doConfirm: true, willingAddForm: item });
                                }}
                            />
                        </Mask>
                    )}
                </ModalParent>

                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        onClick={() => {
                            {
                                this.setState({
                                    modalVisible: false
                                });
                            }
                        }}
                        imageUrls={this.state.showUrls}
                        index={0}
                    />
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    card: {
        backgroundColor: 'white',
        marginTop: 11,
        width: SCREEN_WIDTH,
        paddingHorizontal: 13,
        alignItems: 'center'
    },
    icon: {
        height: 24,
        width: 24,
        marginRight: 5
    },
    row: {
        width: SCREEN_WIDTH - 38,
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    selectRow: {
        width: SCREEN_WIDTH - 26,
        height: 45,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginRight: 42
    },
    content: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        textAlign: 'right',
        paddingRight: 8
    }
});
