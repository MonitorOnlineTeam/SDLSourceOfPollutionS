/*
 * @Description: 维修项目编辑
 * @LastEditors: hxf
 * @Date: 2025-04-11 16:27:30
 * @LastEditTime: 2025-04-23 19:33:48
 * @FilePath: /sdlsourceofpollutions/app/operationContainers/taskViews/taskExecution/formViews/zibo/CEMSMaintenanceItem.js
 */
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AlertDialog, StatusPage } from '../../../../../components'
import { SCREEN_WIDTH } from '../../../../../config/globalsize'
import FormPicker from '../../components/FormPicker'
import { createAction, NavigationActions, SentencedToEmpty, ShowToast } from '../../../../../utils'
import globalcolor from '../../../../../config/globalcolor'
import FormInput from '../../components/FormInput'
import FormTextArea from '../../components/FormTextArea'
import FormDatePicker from '../../components/FormDatePicker'
import moment from 'moment'
import { Image } from 'react-native-animatable'
import { useSelector } from 'react-redux'
import { dispatch } from '../../../../../..'

export default function CEMSMaintenanceItem(props) {
    const { Content
        , equipmentList = []
        , oneRepairRecord, recordList = []
        , repairRecordIndex = -1
        , signContent = ''
        , BDRYPic = [], BDJGPic = []
    } = useSelector(state => state.zbRepairRecordModel)

    let _delDialogRef = useRef();

    useEffect(() => {
        const record = SentencedToEmpty(props, ['route', 'params', 'params'], -1);
        if (record != -1) {
            // 填充已有的信息

        }
    }, [])

    const isEdit = () => {
        return true;
    }

    const isNewRecord = () => {
        const ID = SentencedToEmpty(oneRepairRecord, ['ID'], '');
        if (ID == '') {
            return true;
        } else {
            return false;
        }
    }

    const getDepartureTimeOption = () => {
        return {
            defaultTime: SentencedToEmpty(oneRepairRecord, ['LeaveTime']
                , moment().format('YYYY-MM-DD HH:mm:ss')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...oneRepairRecord };
                newData.LeaveTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    oneRepairRecord: newData
                }));
            },
        };
    }

    // child table
    const childTableCheck = () => {

        if (SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '') == ''
            || ((SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '') == 830
                || SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '') == 840)
                && SentencedToEmpty(oneRepairRecord, ['OtherEquipment'], '') == '')
        ) {
            ShowToast({
                message: '设备不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(oneRepairRecord, ['RepairDescribe'], '') == '') {
            ShowToast({
                message: '检修情况描述不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(oneRepairRecord, ['RepairAfterRun'], '') == '') {
            ShowToast({
                message: '维修后系统运行情况不能为空！',
                alertType: 'error',
            });
            return false;
        }

        // if (SentencedToEmpty(Content, ['WorkingDateBegin'], '') == '') {
        //     // ShowToast('工作时间不能为空！');
        //     ShowToast({
        //         message: '工作时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }
        // if (SentencedToEmpty(Content, ['WorkingDateEnd'], '') == '') {
        //     // ShowToast('结束时间不能为空！');
        //     ShowToast({
        //         message: '结束时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }
        // if (SentencedToEmpty(Content, ['EntName'], '') == '') {
        //     // ShowToast('维护管理单位不能为空！');
        //     ShowToast({
        //         message: '维护管理单位不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }
        // EntUserName
        // BDSB
        // if (SentencedToEmpty(Content, ['EntUserName'], '') == '') {
        //     // ShowToast('运维人不能为空！');
        //     ShowToast({
        //         message: '运维人不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['CheckBTime'], '') == '') {
        //     // ShowToast('故障开始时间不能为空！');
        //     ShowToast({
        //         message: '故障开始时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['CheckETime'], '') == '') {
        //     // ShowToast('故障结束时间不能为空！');
        //     ShowToast({
        //         message: '故障结束时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['MaintenanceBeginTime'], '') == '') {
        //     // ShowToast('维修开始时间不能为空！');
        //     ShowToast({
        //         message: '维修开始时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['MaintenanceEndTime'], '') == '') {
        //     // ShowToast('维修结束时间不能为空！');
        //     ShowToast({
        //         message: '维修结束时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['InspectionDate'], '') == '') {
        //     // ShowToast('停机时间不能为空！');
        //     ShowToast({
        //         message: '停机时间不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['BDJG'], '') == ''
        //     || BDJGPic.length == 0) {
        //     // ShowToast('维修前照片不能为空！');
        //     ShowToast({
        //         message: '维修前照片不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (SentencedToEmpty(Content, ['BDRY'], '') == ''
        //     || BDRYPic.length == 0) {
        //     // ShowToast('维修后照片不能为空！');
        //     ShowToast({
        //         message: '维修后照片不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        // if (signContent == '') {
        //     // ShowToast('运维人员签字不能为空！');
        //     ShowToast({
        //         message: '运维人员签字不能为空！',
        //         alertType: 'error',
        //     });
        //     return false;
        // }

        return true;
    }

    const cancelButton = () => { }
    const confirm = () => {
        let newData = [].concat(recordList);
        newData.splice(repairRecordIndex, 1);
        dispatch(createAction('zbRepairRecordModel/updateState')({
            recordList: newData
        }));
        dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({
            callback: (IsSuccess) => {
                if (IsSuccess) {
                    ShowToast('删除成功');
                    dispatch(NavigationActions.back());
                } else {
                    ShowToast('删除失败');
                }
            }
        }))
    }

    let delOptions = {
        headTitle: '提示',
        messText: `确认要删除维修项目吗？`,
        headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
        buttons: [
            {
                txt: '取消',
                btnStyle: { backgroundColor: 'transparent' },
                txtStyle: { color: globalcolor.headerBackgroundColor },
                onpress: cancelButton
            },
            {
                txt: '确定',
                btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                txtStyle: { color: '#ffffff' },
                onpress: confirm
            }
        ]
    };

    return (
        <StatusPage
            status={200}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                // this.statusPageOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.statusPageOnRefresh();
            }}
        >
            <ScrollView
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, alignItems: 'center'
                    }]}
                >
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormPicker
                            editable={isEdit()}
                            propsRightIconStyle={{ width: 18 }}
                            required={true}
                            label="设备"
                            defaultCode={SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '')}
                            option={{
                                codeKey: 'ChildID',
                                nameKey: 'showStr',
                                defaultCode: SentencedToEmpty(oneRepairRecord, ['EquipmentId'], ''),
                                dataArr: equipmentList,
                                onSelectListener: callBackItem => {
                                    let newData = { ...oneRepairRecord };
                                    newData.EquipmentId = callBackItem.ChildID;
                                    newData.EquipmentName = callBackItem.showStr;
                                    if (callBackItem.ChildID == 830 || callBackItem.ChildID == 840) {
                                        newData.OtherEquipment = '';
                                    }
                                    dispatch(createAction('zbRepairRecordModel/updateState')({
                                        oneRepairRecord: newData
                                    }));
                                }
                            }}
                            showText={SentencedToEmpty(oneRepairRecord, ['EquipmentName'], '')}
                            placeHolder={isEdit() ? "请选择" : '未选择'}
                        />
                    </View>
                    {
                        (SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '') == 830
                            || SentencedToEmpty(oneRepairRecord, ['EquipmentId'], '') == 840)
                            ? <View
                                style={[
                                    styles.rowLayout, {}
                                ]}>
                                <FormInput
                                    required={true}
                                    editable={isEdit()}
                                    label={'其他设备名称'}
                                    placeholder="请记录"
                                    keyboardType="default"
                                    value={SentencedToEmpty(oneRepairRecord, ['OtherEquipment'], '')}
                                    onChangeText={text => {
                                        let newData = { ...oneRepairRecord };
                                        newData.OtherEquipment = text;
                                        dispatch(createAction('zbRepairRecordModel/updateState')({
                                            oneRepairRecord: newData
                                        }));
                                    }}
                                />
                            </View> : null
                    }
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormInput
                            required={true}
                            editable={isEdit()}
                            label={'检修情况描述'}
                            placeholder="请记录"
                            keyboardType="default"
                            value={SentencedToEmpty(oneRepairRecord, ['RepairDescribe'], '')}
                            onChangeText={text => {
                                let newData = { ...oneRepairRecord };
                                newData.RepairDescribe = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormInput
                            required={false}
                            editable={isEdit()}
                            label='更换部件'
                            placeholder="请记录"
                            keyboardType="default"
                            value={SentencedToEmpty(oneRepairRecord, ['ReplaceComponents'], '')}
                            onChangeText={text => {
                                let newData = { ...oneRepairRecord };
                                newData.ReplaceComponents = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormTextArea
                            required={true}
                            label='维修后系统运行情况'
                            areaWidth={SCREEN_WIDTH - 36}
                            placeholder=''
                            value={SentencedToEmpty(oneRepairRecord, ['RepairAfterRun'], '')}
                            onChangeText={(text) => {
                                let newData = { ...oneRepairRecord };
                                newData.RepairAfterRun = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormTextArea
                            label='站房清理'
                            areaWidth={SCREEN_WIDTH - 36}
                            placeholder=''
                            value={SentencedToEmpty(oneRepairRecord, ['StationClean'], '')}
                            onChangeText={(text) => {
                                let newData = { ...oneRepairRecord };
                                newData.StationClean = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormTextArea
                            label='停机检修情况总结'
                            areaWidth={SCREEN_WIDTH - 36}
                            placeholder=''
                            value={SentencedToEmpty(oneRepairRecord, ['ShutdownSituation'], '')}
                            onChangeText={(text) => {
                                let newData = { ...oneRepairRecord };
                                newData.ShutdownSituation = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormTextArea
                            label='备注'
                            areaWidth={SCREEN_WIDTH - 36}
                            placeholder=''
                            value={SentencedToEmpty(oneRepairRecord, ['Remark'], '')}
                            onChangeText={(text) => {
                                let newData = { ...oneRepairRecord };
                                newData.Remark = text;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    oneRepairRecord: newData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            // required={true}
                            getPickerOption={getDepartureTimeOption}
                            label={'离开时间'}
                            timeString={
                                SentencedToEmpty(oneRepairRecord, ['LeaveTime'], '请选择离开时间')
                            }
                        />
                    </View>

                </View>
            </ScrollView>
            {!isNewRecord() ?
                <View
                    style={[{
                        width: SCREEN_WIDTH
                        , flexDirection: 'row'
                        , justifyContent: 'space-around', alignItems: 'center'
                    }]}
                >
                    <TouchableOpacity
                        style={{
                            width: (SCREEN_WIDTH - 100) / 2,
                            marginTop: 10,
                            marginBottom: 15,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#4499f0',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            // this.commit();
                            if (repairRecordIndex != -1
                                && recordList.length > repairRecordIndex
                            ) {
                                let newData = [].concat(recordList);
                                newData[repairRecordIndex] = oneRepairRecord;
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    recordList: newData
                                }));
                                dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({
                                    callback: (IsSuccess) => {
                                        if (IsSuccess) {
                                            ShowToast('保存成功');
                                            dispatch(NavigationActions.back());
                                        } else {
                                            ShowToast('保存失败');
                                        }
                                    }
                                }))
                            } else {
                                ShowToast('数据错误');
                            }
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>保存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: (SCREEN_WIDTH - 100) / 2,
                            marginVertical: 10,
                            marginBottom: 15,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#ee9944',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            if (recordList.length <= 1) {
                                ShowToast({
                                    // message: '维修记录不能为空！',
                                    message: '最后一条维修记录不能删除！',
                                    alertType: 'error',
                                });
                                return;
                            } else if (repairRecordIndex != -1
                                && recordList.length > repairRecordIndex
                            ) {
                                _delDialogRef.current.show();

                            } else {
                                ShowToast('数据错误');
                            }
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>删除记录</Text>
                    </TouchableOpacity>

                </View>
                : <View
                    style={[{
                        width: SCREEN_WIDTH
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    <TouchableOpacity
                        style={styles.commit}
                        onPress={() => {
                            // this.commit();
                            if (childTableCheck()) {
                                let newData = [].concat(recordList);
                                newData.push(oneRepairRecord);
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    recordList: newData
                                }));
                                dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({
                                    callback: (IsSuccess) => {
                                        if (IsSuccess) {
                                            ShowToast('保存成功');
                                            dispatch(NavigationActions.back());
                                        } else {
                                            ShowToast('保存失败');
                                        }
                                    }
                                }))
                            }
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>保存</Text>
                    </TouchableOpacity>
                </View>
            }
            <AlertDialog options={delOptions} ref={_delDialogRef} />
        </StatusPage >
    )
}

const styles = StyleSheet.create({
    rowLayout: {
        width: SCREEN_WIDTH - 24,
        alignItems: 'center',
        backgroundColor: globalcolor.white,
        marginHorizontal: 12,
        paddingHorizontal: 6,
        // marginTop: 12,
        borderRadius: 4,
    },
    commit: {
        marginBottom: 15,
        marginTop: 10,
        width: 282,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4499f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    del: {

    },
    // scrollView: {
    //     flex: 1,
    //     width: SCREEN_WIDTH,
    // },
    // layoutWithBottomBorder: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingVertical: 12,
    //     borderBottomWidth: 1,
    //     borderBottomColor: globalcolor.borderBottomColor,
    //     width: SCREEN_WIDTH - 26,
    // },
    // labelStyle: {
    //     fontSize: 14,
    //     color: globalcolor.taskFormLabel,
    //     width: 70,
    // },
    // timeRangeContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // timeValue: {
    //     fontSize: 14,
    //     color: globalcolor.taskFormValue,
    //     textAlign: 'center',
    // },
    // sectionHeader: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     padding: 12,
    //     backgroundColor: globalcolor.white,
    // },
    // sectionTitle: {
    //     fontSize: 15,
    //     color: globalcolor.taskFormLabel,
    //     flex: 1,
    // },
    // arrow: {
    //     width: 20,
    //     height: 20,
    // },
    // sectionContent: {
    //     padding: 12,
    //     borderTopWidth: 1,
    //     borderTopColor: globalcolor.borderBottomColor,
    // },
    // checkListContainer: {
    //     width: '100%',
    // },
    // inputContainer: {
    //     width: '100%',
    //     paddingVertical: 10,
    // },
    // imageUploadContainer: {
    //     width: '100%',
    //     paddingVertical: 10,
    // },
    // checkItem: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     paddingVertical: 2,
    //     borderBottomWidth: 1,
    //     borderBottomColor: globalcolor.borderBottomColor,
    //     paddingRight: 20,
    // },
    // checkItemTitle: {
    //     fontSize: 14,
    //     color: globalcolor.taskFormLabel,
    //     flex: 1,
    // },
    // buttonContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     width: '100%',
    //     marginVertical: 20,
    // },
    // button: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     height: 40,
    //     borderRadius: 4,
    //     paddingHorizontal: 16,
    //     flex: 1,
    //     marginHorizontal: 6,
    // },
    // submitButton: {
    //     backgroundColor: globalcolor.blue,
    // },
    // deleteButton: {
    //     backgroundColor: globalcolor.red,
    // },
    // signatureContainer: {
    //     width: '100%',
    //     marginBottom: 12,
    // },
    // signatureWrapper: {
    //     width: SCREEN_WIDTH - 26,
    //     height: 100,
    //     borderWidth: 1,
    //     borderColor: globalcolor.borderBottomColor,
    //     borderRadius: 4,
    //     overflow: 'hidden',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // signaturePreview: {
    //     width: '100%',
    //     height: '100%',
    //     resizeMode: 'contain',
    // },
    // signaturePlaceholder: {
    //     color: '#999',
    //     fontSize: 14,
    // },
    // signatureTitle: {
    //     fontSize: 14,
    //     color: '#333333',
    //     marginBottom: 10,
    // },
    // completedIndicator: {
    //     width: 20,
    //     height: 20,
    //     borderRadius: 10,
    //     borderWidth: 1,
    //     borderColor: globalcolor.borderBottomColor,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // completedText: {
    //     fontSize: 14,
    //     color: globalcolor.taskFormLabel,
    // },
    // formItem: {
    //     width: '100%',
    //     paddingVertical: 10,
    // },
    // buttonText: {
    //     color: globalcolor.whiteFont,
    //     fontSize: 15,
    // },
});