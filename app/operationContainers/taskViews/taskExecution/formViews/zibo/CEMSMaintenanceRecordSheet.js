/*
 * @Description: CMES维修记录表
 * @LastEditors: hxf
 * @Date: 2025-04-11 11:00:45
 * @LastEditTime: 2025-04-18 11:32:58
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/zibo/CEMSMaintenanceRecordSheet.js
 */
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AlertDialog, StatusPage } from '../../../../../components'
import { SCREEN_WIDTH } from '../../../../../config/globalsize';
import globalcolor from '../../../../../config/globalcolor';
import { createAction, NavigationActions, SentencedToEmpty, ShowToast } from '../../../../../utils';
import FormDatePicker from '../../components/FormDatePicker';
import moment from 'moment';
import FormInput from '../../components/FormInput';
import FormText from '../../components/FormText';
import { dispatch } from '../../../../../..';
import FormImagePicker from '../../components/FormImagePicker';
import { useSelector } from 'react-redux';

export default function CEMSMaintenanceRecordSheet(props) {

    // const [signContent, setSignContent] = useState('');
    // const [confirmDelItem, setConfirmDelItem] = useState(() => { });
    const { Content, RepairRecordZBResult
        , recordList = []
        , BDRYPic = [], BDJGPic = []
        , delItemIndex, signContent
    } = useSelector(state => state.zbRepairRecordModel);

    let _delDialogRef = useRef();
    let _delItemDialogRef = useRef();
    let _delThis = useRef();
    // const Content = {
    //     WorkingDateBegin: '2025-04-08 15:00:00',
    //     WorkingDateEnd: '2025-04-10 16:00:00',
    // }

    _delThis.current = {
        confirmDelItem: () => {
            if (recordList.length <= 1) {
                ShowToast({
                    message: '维修记录不能为空！',
                    alertType: 'error',
                });
                return;
            }
            let newRecordList = [].concat(recordList);
            newRecordList.splice(delItemIndex, 1);
            dispatch(createAction('zbRepairRecordModel/updateState')({ recordList: newRecordList }));
            dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({}));
        }
    };
    // useEffect(() => {
    //     console.log('delItemIndex = ', delItemIndex);
    //     console.log('BDRYPic = ', BDRYPic);
    // }, [delItemIndex, BDRYPic]);

    useEffect(() => {
        dispatch(createAction('zbRepairRecordModel/updateState')({
            "taskID": SentencedToEmpty(props, ['route', 'params', 'params', 'TaskID'], ''),
            "typeID": SentencedToEmpty(props, ['route', 'params', 'params', 'TypeID'], ''),
        }))
        dispatch(createAction('zbRepairRecordModel/getRepairRecordZB')({
            params: {
                "taskID": SentencedToEmpty(props, ['route', 'params', 'params', 'TaskID'], ''),
                "typeID": SentencedToEmpty(props, ['route', 'params', 'params', 'TypeID'], ''),
            }
        }));
        return () => {
            DeviceEventEmitter.emit('refreshTask', {
                newMessage: '刷新'
            });
        }
    }, []);

    useEffect(() => {
        dispatch(createAction('zbRepairRecordModel/updateState')({
            signContent: SentencedToEmpty(RepairRecordZBResult, ['data', 'Datas', 0, 'Main', 'SignContent'], '')
        }));
    }, [RepairRecordZBResult, Content]);

    const isEdit = () => {
        return true;
    }

    const isNewRecord = () => {
        if (SentencedToEmpty(RepairRecordZBResult, ['data', 'Datas', 0, 'Main', 'ID'], '') == '') {
            return true;
        } else {
            return false;
        }
    }

    const getFailureStartTimeOption = () => {
        return {
            defaultTime: SentencedToEmpty(Content, ['CheckBTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...Content };
                newData.CheckBTime = moment(time).format('YYYY-MM-DD HH:mm');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    // CheckBTime: moment(time).format('YYYY-MM-DD HH:mm')
                    Content: newData
                }))
            },
        };
    }

    const getEndOFailureTimeOption = () => {
        return {
            defaultTime: SentencedToEmpty(Content, ['CheckETime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...Content };
                newData.CheckETime = moment(time).format('YYYY-MM-DD HH:mm');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    // CheckETime: moment(time).format('YYYY-MM-DD HH:mm')
                    Content: newData
                }))
            },
        };
    }

    const getMaintenanceStartTimeOption = () => {
        return {
            defaultTime: SentencedToEmpty(Content, ['MaintenanceBeginTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...Content };
                newData.MaintenanceBeginTime = moment(time).format('YYYY-MM-DD HH:mm');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    // MaintenanceBeginTime: moment(time).format('YYYY-MM-DD HH:mm')
                    Content: newData
                }))
            },
        };
    }

    const getEndTimeOfMaintenanceOption = () => {
        return {
            defaultTime: SentencedToEmpty(Content, ['MaintenanceEndTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...Content };
                newData.MaintenanceEndTime = moment(time).format('YYYY-MM-DD HH:mm');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    // MaintenanceEndTime: moment(time).format('YYYY-MM-DD HH:mm')
                    Content: newData
                }))
            },
        };
    }

    const getDowTimeOption = () => {
        return {
            defaultTime: SentencedToEmpty(Content, ['InspectionDate'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                // InspectionDate
                let newData = { ...Content };
                newData.InspectionDate = moment(time).format('YYYY-MM-DD HH:mm');
                dispatch(createAction('zbRepairRecordModel/updateState')({
                    // InspectionDate: moment(time).format('YYYY-MM-DD HH:mm')
                    Content: newData
                }))
            },
        };
    }

    // 处理签名完成
    const handleSignature = signature => {
        // setSignContent(signature);
        dispatch(createAction('zbRepairRecordModel/updateState')({
            signContent: signature,
        }));
        // this.setState({
        //     signContent: signature,
        //     signTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });
    };

    // 处理签名取消
    const handleSignatureCancel = () => {
        this.props.navigation.goBack();
    };
    // 打开签名页面
    const openSignaturePage = () => {

        dispatch(
            NavigationActions.navigate({
                routeName: 'SignaturePage',
                params: {
                    onOK: handleSignature,
                    onCancel: handleSignatureCancel,
                    signature: signContent,
                    // signature: this.state.formData.signature,
                },
            }),
        );
    };
    const cancelButton = () => { }
    const confirm = () => {
        dispatch(createAction('zbRepairRecordModel/deleteRepairRecordZB')({
            callback: () => {
                dispatch(NavigationActions.back());
            }
        }));
    }

    let delItemOptions = {
        headTitle: '提示',
        messText: `确认要删除这条维修记录吗？`,
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
                // onpress: confirmDelItem
                onpress: () => {
                    _delThis.current.confirmDelItem()
                }
            }
        ]
    };

    let options = {
        headTitle: '提示',
        messText: `确认要删除${SentencedToEmpty(props, ['route', 'params', 'params', 'CnName'], '维修记录')}吗？`,
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

    // Master table child table
    const masterTableCheck = (checkOption = {}) => {
        if (SentencedToEmpty(Content, ['WorkingDateBegin'], '') == '') {
            // ShowToast('工作时间不能为空！');
            ShowToast({
                message: '工作时间不能为空！',
                alertType: 'error',
            });
            return false;
        }
        if (SentencedToEmpty(Content, ['WorkingDateEnd'], '') == '') {
            // ShowToast('结束时间不能为空！');
            ShowToast({
                message: '结束时间不能为空！',
                alertType: 'error',
            });
            return false;
        }
        if (SentencedToEmpty(Content, ['EntName'], '') == '') {
            // ShowToast('维护管理单位不能为空！');
            ShowToast({
                message: '维护管理单位不能为空！',
                alertType: 'error',
            });
            return false;
        }
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

        if (SentencedToEmpty(Content, ['CheckBTime'], '') == '') {
            // ShowToast('故障开始时间不能为空！');
            ShowToast({
                message: '故障开始时间不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['CheckETime'], '') == '') {
            // ShowToast('故障结束时间不能为空！');
            ShowToast({
                message: '故障结束时间不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['MaintenanceBeginTime'], '') == '') {
            // ShowToast('维修开始时间不能为空！');
            ShowToast({
                message: '维修开始时间不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['MaintenanceEndTime'], '') == '') {
            // ShowToast('维修结束时间不能为空！');
            ShowToast({
                message: '维修结束时间不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['InspectionDate'], '') == '') {
            // ShowToast('停机时间不能为空！');
            ShowToast({
                message: '停机时间不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['BDJG'], '') == ''
            || BDJGPic.length == 0) {
            // ShowToast('维修前照片不能为空！');
            ShowToast({
                message: '维修前照片不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (SentencedToEmpty(Content, ['BDRY'], '') == ''
            || BDRYPic.length == 0) {
            // ShowToast('维修后照片不能为空！');
            ShowToast({
                message: '维修后照片不能为空！',
                alertType: 'error',
            });
            return false;
        }

        if (signContent == '') {
            // ShowToast('运维人员签字不能为空！');
            ShowToast({
                message: '运维人员签字不能为空！',
                alertType: 'error',
            });
            return false;
        }

        const checkList = SentencedToEmpty(checkOption, ['checkList'], true);
        if (checkList && recordList.length == 0) {
            // ShowToast('维修项目不能为空！');
            ShowToast({
                message: '维修项目不能为空！',
                alertType: 'error',
            });
            return false;
        }
        return true;
    }

    return (
        <StatusPage
            status={SentencedToEmpty(RepairRecordZBResult, ['status'], 1000)}
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
                        <FormDatePicker
                            required={true}
                            getPickerOption={() => ({
                                defaultTime: Content.WorkingDateBegin,
                                type: 'miniute',
                                onSureClickListener: time => {
                                    let newData = { ...Content };
                                    newData.WorkingDateBegin = moment(time).format('YYYY-MM-DD HH:mm');
                                    dispatch(createAction('zbRepairRecordModel/updateState')({
                                        Content: newData
                                    }))
                                },
                            })}
                            label={'工作时间'}
                            timeString={moment(Content.WorkingDateBegin).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )}
                        />
                        <FormDatePicker
                            required={true}
                            getPickerOption={() => ({
                                defaultTime: Content.WorkingDateEnd,
                                type: 'miniute',
                                onSureClickListener: time => {
                                    let newData = { ...Content };
                                    newData.WorkingDateEnd = moment(time).format('YYYY-MM-DD HH:mm');
                                    dispatch(createAction('zbRepairRecordModel/updateState')({
                                        Content: newData
                                    }))
                                },
                            })}
                            label={'结束时间'}
                            timeString={moment(Content.WorkingDateEnd).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )}
                        />
                    </View>
                    <View
                        style={[styles.rowLayout, {}]}
                    >
                        <FormInput
                            required={true}
                            editable={isEdit()}
                            // label={'行业俗称/去向单位内部名称'}
                            label={'维护管理单位'}
                            placeholder="请记录"
                            keyboardType="default"
                            value={SentencedToEmpty(Content, ['EntName'], '')}
                            onChangeText={text => {
                                let newData = { ...Content };
                                newData.EntName = text;
                                dispatch(createAction()({
                                    Content: newData
                                }));
                            }}
                        />
                    </View>
                    {true ? null : <View
                        style={[styles.rowLayout, {}]}
                    >
                        <FormText
                            required={true}
                            label={'运维人'}
                            showString={SentencedToEmpty(Content, ['BDSB'], '请选择')}
                            onPress={() => {
                                dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'ContactOperationMultiple',
                                        // routeName: 'ContactOperation',
                                        params: {
                                            selectType: 'people',
                                            callFrom: 'addHelper',
                                            EntUserName: Content.EntUserName,
                                            callback: items => {
                                                let EntUserName = '', BDSB = '';
                                                items.map((item, index) => {
                                                    if (index == 0) {
                                                        EntUserName = item.item.User_ID;
                                                        BDSB = item.item.title;
                                                    } else {
                                                        EntUserName = EntUserName + ',' + item.item.User_ID;
                                                        BDSB = BDSB + ',' + item.item.title;

                                                    }
                                                })
                                                let newData = { ...Content };
                                                newData.EntUserName = EntUserName;
                                                newData.BDSB = BDSB;
                                                dispatch(createAction('zbRepairRecordModel/updateState')({ Content: newData }));
                                            }
                                        }
                                    })
                                );
                            }}
                        />
                    </View>}
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            required={true}
                            getPickerOption={getFailureStartTimeOption}
                            label={'故障开始时间'}
                            timeString={
                                SentencedToEmpty(Content, ['CheckBTime'], '请选择开始时间')
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            required={true}
                            getPickerOption={getEndOFailureTimeOption}
                            label={'故障结束时间'}
                            timeString={
                                SentencedToEmpty(Content, ['CheckETime'], '请选择结束时间')
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            required={true}
                            getPickerOption={getMaintenanceStartTimeOption}
                            label={'维修开始时间'}
                            timeString={
                                SentencedToEmpty(Content, ['MaintenanceBeginTime'], '请选择开始时间')
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            required={true}
                            getPickerOption={getEndTimeOfMaintenanceOption}
                            label={'维修结束时间'}
                            timeString={
                                SentencedToEmpty(Content, ['MaintenanceEndTime'], '请选择结束时间')
                            }
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            rightIconStyle={{}}
                            required={true}
                            getPickerOption={getDowTimeOption}
                            label={'停机时间'}
                            timeString={
                                SentencedToEmpty(Content, ['InspectionDate'], '请选择停机时间')
                            }
                        />
                    </View>
                    <TouchableOpacity
                        style={[{ marginVertical: 6 }]}
                        onPress={() => {
                            if (masterTableCheck({ checkList: false })) {
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    repairRecordIndex: -1,
                                    oneRepairRecord: {}
                                }));
                                dispatch(NavigationActions.navigate({
                                    routeName: 'CEMSMaintenanceItem',
                                    params: {
                                    }
                                }));
                            }
                        }}
                    >
                        <View style={{
                            width: SCREEN_WIDTH - 24,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            backgroundColor: 'white',
                            borderRadius: 4,
                        }}>
                            <Text style={{
                                fontSize: 15,
                                color: globalcolor.taskImfoLabel,
                            }}>{'添加维修项目'}</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        recordList.map((item, index) => {
                            return (<View
                                style={[{
                                    width: SCREEN_WIDTH - 24,
                                    borderRadius: 8,
                                    paddingVertical: 10,
                                    backgroundColor: 'white',
                                    marginBottom: 6
                                }]}
                            >
                                <View
                                    style={[{
                                        flexDirection: 'row',
                                        width: SCREEN_WIDTH - 24,
                                        alignItems: 'center',
                                        paddingHorizontal: 8,
                                        justifyContent: 'space-between',
                                    }]}
                                >
                                    <View
                                        style={[{ flexDirection: 'row' }]}
                                    >
                                        <Text
                                            style={[{
                                                fontSize: 15,
                                                color: '#666666'
                                            }]}
                                        >{'设备'}</Text>
                                        <Text
                                            numberOfLines={1}
                                            style={[{
                                                width: SCREEN_WIDTH - 134,
                                                marginLeft: 6,
                                                fontSize: 15,
                                                color: '#333333'
                                            }]}
                                        >{SentencedToEmpty(item, ['EquipmentName'], '---')}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dispatch(createAction('zbRepairRecordModel/updateState')({
                                                delItemIndex: index
                                            }));
                                            _delItemDialogRef.current.show();
                                        }}
                                    >
                                        <View
                                            style={[{
                                                height: 32, width: 64
                                                , justifyContent: 'center', alignItems: 'center', borderRadius: 16
                                            }]}
                                        >
                                            <Text style={[{ fontSize: 13 }]} >{'删除'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(createAction('zbRepairRecordModel/updateState')({
                                            repairRecordIndex: index,
                                            oneRepairRecord: item
                                        }));
                                        dispatch(NavigationActions.navigate({
                                            routeName: 'CEMSMaintenanceItem',
                                            params: {
                                                item
                                            }
                                        }));
                                    }}
                                >
                                    <View
                                        style={[{
                                            flexDirection: 'row',
                                            width: SCREEN_WIDTH - 24,
                                            alignItems: 'center',
                                            paddingHorizontal: 8,
                                            marginVertical: 4,
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                fontSize: 15,
                                                color: '#666666',
                                                width: 90
                                            }]}
                                        >{'检修情况描述'}</Text>
                                        <Text
                                            style={[{
                                                marginLeft: 6,
                                                fontSize: 15,
                                                color: '#333333'
                                            }]}
                                        >{SentencedToEmpty(item, ['RepairDescribe'], '---')}</Text>
                                    </View>
                                    <View
                                        style={[{
                                            flexDirection: 'row',
                                            width: SCREEN_WIDTH - 24,
                                            alignItems: 'center',
                                            paddingHorizontal: 8,
                                            marginVertical: 8,
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                fontSize: 15,
                                                color: '#666666',
                                                width: 90
                                            }]}
                                        >{'更换部件'}</Text>
                                        <Text
                                            style={[{
                                                marginLeft: 6,
                                                fontSize: 15,
                                                color: '#333333'
                                            }]}
                                        >{SentencedToEmpty(item, ['ReplaceComponents'], '---')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>);
                        })
                    }
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormImagePicker
                            required={true}
                            label={'维修前（故障体现、报警等）'}
                            imageGridWidth={SCREEN_WIDTH - 40}
                            localId={SentencedToEmpty(Content
                                , ['BDJG'], ''
                            )}
                            Imgs={
                                BDJGPic
                            }
                            delCallback={(key) => {
                                let delImgList = [].concat(BDJGPic);
                                delImgList.splice(key, 1);
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    BDJGPic: delImgList
                                }));
                            }}
                            uploadCallback={(images) => {
                                let addData = [].concat(BDJGPic);
                                images.map((item) => {
                                    addData.push({ AttachID: item.AttachID });
                                });
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    BDJGPic: addData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormImagePicker
                            required={true}
                            label={'维修后'}
                            imageGridWidth={SCREEN_WIDTH - 40}
                            localId={SentencedToEmpty(Content
                                , ['BDRY'], ''
                            )}
                            Imgs={
                                BDRYPic
                            }
                            delCallback={(key) => {
                                let delImgList = [].concat(BDRYPic);
                                delImgList.splice(key, 1);
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    BDRYPic: delImgList
                                }));
                            }}
                            uploadCallback={(images) => {
                                let addData = [].concat(BDRYPic);
                                images.map((item) => {
                                    addData.push({ AttachID: item.AttachID });
                                });
                                dispatch(createAction('zbRepairRecordModel/updateState')({
                                    BDRYPic: addData
                                }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}
                    >
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center'
                            , width: SCREEN_WIDTH - 26
                        }]}>
                            {<Text style={[{
                                fontSize: 14,
                                color: globalcolor.textBlack
                            }, { color: 'red' }]}>*</Text>}
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }, {
                                fontSize: 14,
                                color: globalcolor.textBlack
                            }]}>{'运维人员签字'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.signatureWrapper}
                            onPress={openSignaturePage}>
                            {signContent ? (
                                <Image
                                    source={{ uri: signContent }}
                                    style={[styles.signaturePreview, {}]}
                                />
                            ) : (
                                <Text style={styles.signaturePlaceholder}>
                                    点击此处签名
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {isNewRecord() ? <View
                style={[{
                    width: SCREEN_WIDTH
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >
                <TouchableOpacity
                    style={styles.commit}
                    onPress={() => {
                        // this.commit();
                        if (masterTableCheck()) {
                            dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({
                                callback: (IsSuccess) => {
                                    if (IsSuccess) {
                                        ShowToast('保存成功');
                                    } else {
                                        ShowToast('保存失败');
                                    }
                                }
                            }))
                        }
                    }}
                >
                    <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                    <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                </TouchableOpacity>
            </View>
                : <View
                    style={[{
                        width: SCREEN_WIDTH
                        , flexDirection: 'row'
                        , justifyContent: 'space-around', alignItems: 'center'
                    }]}
                >
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
                            _delDialogRef.current.show();
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>删除记录</Text>
                    </TouchableOpacity>
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
                            // let newData = [].concat(recordList);
                            // newData.push(oneRepairRecord);
                            // dispatch(createAction('zbRepairRecordModel/updateState')({
                            //     recordList: newData
                            // }));
                            if (masterTableCheck()) {
                                dispatch(createAction('zbRepairRecordModel/addOrUpdateRepairRecordZB')({
                                    callback: (IsSuccess) => {
                                        if (IsSuccess) {
                                            ShowToast('保存成功');
                                        } else {
                                            ShowToast('保存失败');
                                        }
                                    }
                                }))
                            }
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                    </TouchableOpacity>
                </View>}
            <AlertDialog options={options} ref={_delDialogRef} />
            <AlertDialog options={delItemOptions} ref={_delItemDialogRef} />
        </StatusPage>
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
    signatureContainer: {
        width: '100%',
        marginBottom: 12,
    },
    signatureWrapper: {
        width: SCREEN_WIDTH - 26,
        height: 100,
        borderWidth: 1,
        borderColor: globalcolor.borderBottomColor,
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signaturePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    signaturePlaceholder: {
        color: '#999',
        fontSize: 14,
    },
    signatureTitle: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 10,
    },
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