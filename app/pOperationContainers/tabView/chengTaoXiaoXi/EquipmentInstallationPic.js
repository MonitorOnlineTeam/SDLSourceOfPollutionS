/*
 * @Description: 安装照片
 * @LastEditors: hxf
 * @Date: 2023-09-20 14:26:06
 * @LastEditTime: 2024-08-29 19:35:03
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPic.js
 */
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { PickerTouchable, StatusPage, SimpleLoadingView, AlertDialog, MoreSelectTouchable } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import ImageGrid from '../../../components/form/images/ImageGrid';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast } from '../../../utils';
import moment from 'moment';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel, CTInstallationPhotosModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    ProjectID: CTModel.ProjectID,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    deleteInstallationPhotosRecordResult: CTInstallationPhotosModel.deleteInstallationPhotosRecordResult,
    addInstallationPhotosRecordResult: CTInstallationPhotosModel.addInstallationPhotosRecordResult,
    installationItemsListResult: CTInstallationPhotosModel.installationItemsListResult,
    installationPhotosRecordResult: CTInstallationPhotosModel.installationPhotosRecordResult,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult
}))
export default class EquipmentInstallationPic extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '安装照片',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        /**
            checkList: [{
                entItem:{},
                pointItem:{},
                systemModelItem:{}
            }]
         */
        this.state = {
            stateDatas: [],
            checkList: []
        };
    }

    componentDidMount() {
        this.onRefreshWithLoading();
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTModel/updateState')({
                projectEntPointSysModelResult: { status: -1 },
            })
        );
        this.props.dispatch(createAction('CTInstallationPhotosModel/updateState')({
            installationPhotosRecordResult: { status: -1 },
            installationItemsListResult: { status: -1 }
        }));
        this.props.dispatch(
            createAction('CTModel/getProjectEntPointSysModel')({
                params: {
                    projectId: SentencedToEmpty(this.props, ['ProjectID'], '')
                },
                callback: resulte => {
                    const ishandle = this.combinedData('projectEntPointSysModelResult', resulte);
                    if (!ishandle) {
                        this.setState(
                            {
                                entList: SentencedToEmpty(resulte, ['data', 'Datas'], [])
                            },
                            () => {
                                this.props.dispatch(
                                    createAction('CTModel/updateState')({
                                        projectEntPointSysModelResult: resulte
                                    })
                                );
                            }
                        );
                    }
                    return true;
                }
            })
        );
        this.props.dispatch(
            createAction('CTInstallationPhotosModel/getInstallationItemsList')({
                callback: (itemsListResult) => {
                    if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
                        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                        this.props.dispatch(
                            createAction('CTInstallationPhotosModel/getInstallationPhotosRecord')({
                                params: {
                                    mainId: this.props.dispatchId,
                                    serviceId: serviceId,
                                    recordId: recordId
                                },
                                callback: result => {
                                    const ishandle = this.combinedData('installationPhotosRecordResult', result, itemsListResult);
                                    if (!ishandle) {
                                        const commitData = this.formatData(result);
                                        this.setState({
                                            stateDatas: commitData
                                        }, () => {
                                            this.props.dispatch(createAction('CTInstallationPhotosModel/updateState')({
                                                installationPhotosRecordResult: result,
                                                installationItemsListResult: itemsListResult
                                            }));
                                        });
                                    }
                                    return true
                                }
                            })
                        );
                    } else {
                        this.props.dispatch(createAction('CTInstallationPhotosModel/updateState')({
                            installationPhotosRecordResult: { status: 200 },
                            installationItemsListResult: itemsListResult
                        }));
                    }
                    return true;
                }
            })
        );
    }

    formatData = (result, itemsListResult) => {
        let initPointLst = [];
        let commitData = [];
        SentencedToEmpty(result, ['data', 'Datas'], []).map(item => {
            if (
                initPointLst.findIndex((element, index, array) => {
                    return element.PointId == item.PointId
                        && element.SystemModel == item.SystemModel;
                }) >= 0
            ) {

            } else {
                initPointLst.push({
                    PointId: item.PointId,
                    PointName: item.PointName,
                    EntId: item.EntId,
                    EntName: item.EntName,
                    SystemModel: item.SystemModel,
                    SystemModelName: item.SystemModelName,
                });
            }
        });
        initPointLst.map(Point => {
            let ImageSubArr = [];
            SentencedToEmpty(result, ['data', 'Datas'], []).map(item => {
                if (item.PointId == Point.PointId
                    && item.SystemModel == Point.SystemModel) {
                    const imageList = SentencedToEmpty(item, ['InstallationPhotoList', 'ImgList'], []);
                    ImageSubArr.push({ ...item, uploadStatus: imageList.length > 0 ? 1 : 0 });
                }
            });
            commitData.push({ ...Point, ImageArray: ImageSubArr });
        });
        return commitData;
    }

    combinedData = (currentFunName, result, itemsListResult) => {
        let optionStatus, dataStatus, entlist, dataList;
        if (currentFunName == 'installationPhotosRecordResult') {
            optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000)
            dataStatus = result.status;
            entlist = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], [])
            dataList = this.formatData(result, itemsListResult);
        } else if (currentFunName == 'projectEntPointSysModelResult') {
            optionStatus = result.status
            dataStatus = SentencedToEmpty(this.props, ['installationPhotosRecordResult', 'status'], 1000)
            entlist = SentencedToEmpty(result, ['data', 'Datas'], [])
            dataList = this.formatData(SentencedToEmpty(this.props, ['installationPhotosRecordResult'], {})
                , SentencedToEmpty(this.props, ['installationItemsListResult'], {}));
        }
        if (optionStatus == 200 && dataStatus == 200) {
            let pointList = [];
            let checkList = [];
            // checkList: [{
            //     entItem: {},
            //     pointItem: {},
            //     systemModelItem: {}
            // }]
            let SystemModelIdList = [], systemModelItems = [];
            dataList.map((item, index) => {
                item.SystemModelId = item.SystemModel;
                SystemModelIdList = [];
                systemModelItems = [];
                if (item.SystemModel != '') {
                    SystemModelIdList = item.SystemModel.split(',');
                    SystemModelIdList.map((aItem, aIndex) => {
                        systemModelItems.push({
                            SystemModelID: aItem
                        });
                    });
                }
                checkList.push({
                    entItem: { EntId: item.EntId },
                    pointItem: { PointId: item.PointId },
                    systemModelItem: { SystemModel: item.SystemModel },
                    'systemModelItems': systemModelItems
                });
                entlist.map((entItem, entIndex) => {
                    if (entItem.EntId == item.EntId) {
                        item.PointList = entItem.PointList;
                        pointList = entItem.PointList;
                    }
                });
                pointList.map((pointItem, pointIndex) => {
                    if (pointItem.PointId == item.PointId) {
                        item.systemModleList = pointItem.systemModleList;
                    }
                });
            });
            if (currentFunName == 'installationPhotosRecordResult') {
                this.setState({
                    stateDatas: dataList,
                    checkList
                }, () => {
                    this.props.dispatch(createAction('CTInstallationPhotosModel/updateState')({
                        installationPhotosRecordResult: result,
                        installationItemsListResult: itemsListResult
                    }))
                });
            } else if (currentFunName == 'projectEntPointSysModelResult') {
                this.setState({
                    entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                    , stateDatas: dataList
                }, () => {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        projectEntPointSysModelResult: result
                    }))
                });
            }
            return true;
        }
        return false;
    }

    getEnterpriseSelect = (item, index) => {
        return {
            codeKey: 'EntId',
            nameKey: 'EntName',
            defaultCode: SentencedToEmpty(item, ['EntId'], ''),
            placeHolder: '请选择',
            dataArr: SentencedToEmpty(this.props.projectEntPointSysModelResult, ['data', 'Datas'], []),
            onSelectListener: selectedItem => {
                if (selectedItem && typeof selectedItem != 'undefined') {
                    let newItem = this.state.stateDatas[index];
                    newItem.EntId = selectedItem.EntId;
                    newItem.EntName = selectedItem.EntName;
                    newItem.PointList = SentencedToEmpty(selectedItem, ['PointList'], []);
                    newItem.PointId = '';
                    newItem.PointName = '';
                    newItem.SystemModelId = '';
                    newItem.SystemModelName = '';
                    let newDataArr = this.state.stateDatas;
                    newDataArr[index] = newItem;
                    // 为数据校验做准备
                    const checkList = [].concat(this.state.checkList);
                    checkList[index].entItem = selectedItem;
                    // 为数据校验做准备
                    this.setState({ stateDatas: newDataArr, checkList });
                }
            }
        };
    };

    getPointSelect = (item, index) => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            placeHolder: '请选择',
            defaultCode: SentencedToEmpty(item, ['PointId'], ''),
            dataArr: SentencedToEmpty(
                this.props.projectEntPointSysModelResult,
                [
                    'data',
                    'Datas',
                    SentencedToEmpty(this.props.projectEntPointSysModelResult, ['data', 'Datas'], []).findIndex((itema, indexa) => {
                        if (itema['EntId'] == SentencedToEmpty(this.state.stateDatas, [index, 'EntId'], '')) {
                            return true;
                        } else {
                            return false;
                        }
                    }),
                    'PointList'
                ],
                []
            ),
            onSelectListener: selectedItem => {
                // if (
                //     this.state.stateDatas.findIndex((CItem, CIndex) => {
                //         if (CItem.PointId == selectedItem.PointId
                //             && CIndex != index) return true;
                //     }) >= 0
                // ) {
                //     ShowToast('所选排口已经添加过，无法继续添加');
                //     return;
                // } else {
                if (selectedItem && typeof selectedItem != 'undefined') {
                    let newItem = this.state.stateDatas[index];
                    newItem.PointId = selectedItem.PointId;
                    newItem.PointName = selectedItem.PointName;
                    newItem.SystemModelId = '';
                    newItem.SystemModelName = '';
                    let newDataArr = this.state.stateDatas;
                    newDataArr[index] = newItem;
                    newDataArr[index].systemModleList = SentencedToEmpty(selectedItem, ['systemModleList'], []);
                    // 为数据校验做准备
                    const checkList = [].concat(this.state.checkList);
                    checkList[index].pointItem = selectedItem;
                    // 为数据校验做准备
                    this.setState({ stateDatas: newDataArr, checkList });
                }
                // }
            }
        };
    };

    getEquipmentSelect = (item, index) => {
        // 只有指导安装 才有这个选项
        // Systemodel = a.Col1,
        // SystemilodelNam
        return {
            codeKey: 'SystemModelID',
            nameKey: 'SystemModel',
            dataArr: SentencedToEmpty(this.state, ['stateDatas', index, 'systemModleList'], []),
            defaultCode: SentencedToEmpty(item, ['Systemodel'], ''),
            onSelectListener: selectedItem => {
                let hasDuplication = false;
                if (selectedItem && typeof selectedItem != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    // 开始检查
                    const PointId = newData[index].PointId;
                    const checkList = [].concat(this.state.checkList);
                    checkList.map((checkItem, checkIndex) => {
                        // console.log('checkItem = ', checkItem);
                        // console.log('PointId = ', PointId);
                        // console.log('selectedItem.SystemModelID = ', selectedItem.SystemModelID);
                        // console.log('==========');
                        if (checkIndex != index) {
                            if (
                                checkItem.pointItem.PointId == PointId
                                && checkItem.systemModelItem.SystemModel
                                == selectedItem.SystemModelID
                            ) {
                                // 出现重复的选项，拒绝此次操作
                                hasDuplication = true;
                            }
                        }
                    });
                    // 检查结束
                    if (hasDuplication) {
                        ShowToast('出现重复的监测点与设备型号的组合');
                    } else {
                        // 为数据校验做准备
                        checkList[index].systemModelItem = { ...selectedItem };
                        checkList[index].systemModelItem.SystemModel = selectedItem.SystemModelID;
                        // 为数据校验做准备
                        newData[index].SystemModelId = selectedItem.SystemModelID;
                        newData[index].SystemModelName = selectedItem.SystemModel;
                        this.setState({
                            stateDatas: newData,
                            checkList
                        });
                    }
                }
            }
        };
    };

    getEquipmentSelect2 = (index) => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.state, ['stateDatas', index, 'systemModleList'], []);
        const SystemCodeArrayStr = SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'SystemCode'], '');
        if (SystemCodeArrayStr != '') {
            selectCodes = SystemCodeArrayStr.split(',');
        }
        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            // placeHolderStr: '污染物',
            codeKey: 'SystemModelID',
            nameKey: 'SystemModel',
            // maxNum: 2,
            // selectCode: selectCodes,
            selectCode: [],
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                console.log('selectData = ', selectData);
                let codeArrayStr = '', nameArrayStr = '';
                // newData[index].SystemCode = item.SystemModelID;
                // newData[index].SystemName = item.SystemModel;
                selectData.map((dataItem, dataIndex) => {
                    if (dataIndex == 0) {
                        codeArrayStr = dataItem.SystemModelID;
                        nameArrayStr = dataItem.SystemModel;
                    } else {
                        codeArrayStr = codeArrayStr + ',' + dataItem.SystemModelID;
                        nameArrayStr = nameArrayStr + ',' + dataItem.SystemModel;
                    }
                });

                let hasDuplication = false;
                if (selectData && selectData.length > 0) {
                    let newData = [].concat(this.state.stateDatas);
                    // 开始检查
                    const PointId = newData[index].PointId;
                    const checkList = [].concat(this.state.checkList);
                    checkList.map((checkItem, checkIndex) => {
                        // console.log('checkItem = ', checkItem);
                        // console.log('PointId = ', PointId);
                        if (checkIndex != index) {
                            // if (
                            //     checkItem.pointItem.PointId == PointId
                            //     && checkItem.systemModelItem.SystemModel
                            //     == selectedItem.SystemModelID
                            // ) {
                            //     // 出现重复的选项，拒绝此次操作
                            //     hasDuplication = true;
                            // }

                            const checkModelList = SentencedToEmpty(checkItem, ['systemModelItems'], []);
                            checkModelList.map((_item, _index) => {
                                selectData.map((_sItem, _sIndex) => {
                                    // console.log('selectedItem.SystemModelID = ', _item.SystemModelID);
                                    // console.log('selectData.SystemModelID = ', _sItem.SystemModelID);
                                    // console.log('==========');
                                    if (checkItem.pointItem.PointId == PointId
                                        && _item.SystemModelID == _sItem.SystemModelID) {
                                        hasDuplication = true;
                                    }
                                });
                            });
                        }
                    });
                    // 检查结束
                    if (hasDuplication) {
                        ShowToast('出现重复的监测点与设备型号的组合');
                    } else {
                        // 为数据校验做准备
                        checkList[index].systemModelItems = [].concat(selectData);
                        // checkList[index].systemModelItem.SystemModel = selectedItem.SystemModelID;
                        // 为数据校验做准备
                        newData[index].SystemModelId = codeArrayStr;
                        newData[index].SystemModelName = nameArrayStr;
                        // newData[index].SystemModelId = selectedItem.SystemModelID;
                        // newData[index].SystemModelName = selectedItem.SystemModel;
                        this.setState({
                            stateDatas: newData,
                            checkList
                        });
                    }
                }

                // let newDuplicateServiceRecordList = [].concat(this.props.duplicateServiceRecordList);
                // if (newDuplicateServiceRecordList.length > index) {
                //     newDuplicateServiceRecordList[index].SystemName = nameArrayStr;
                //     newDuplicateServiceRecordList[index].SystemCode = codeArrayStr;
                // }
                // // if (deleteIndexList.length > 0) {
                // this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                //     duplicateServiceRecordList: newDuplicateServiceRecordList
                // }));
            }
        };
    }

    commitAllData = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        const stateDatas = SentencedToEmpty(this.state, ['stateDatas'], []);

        let chekPointEmpty = -1;
        let checkSystemModelEmpty = -1;
        let imageEmptyIndex = -1
            , imageEmptyTitl = ''
            , hasDuplication = false
            , duplicationIndex1 = -1
            , duplicationIndex2 = -1
            , couldUpdate = false;

        this.state.stateDatas.map((stateI, sI) => {
            if (stateI.PointId.length == 0) {
                chekPointEmpty = sI;
            }
            stateI.ImageArray.map((imageItem) => {
                // 原逻辑有一个为空就记录并报错,当前忽略了这个判断
                // if (imageItem.uploadStatus == 0 && imageEmptyIndex == -1) {
                //     imageEmptyIndex = sI + 1;
                //     imageEmptyTitl = imageItem.InstallationItemsName;
                // }
                // 有一个不为空就可以提交
                if (imageItem.uploadStatus == 1 || imageItem.uploadStatus == 2) {
                    couldUpdate = true;
                }
            });
        });
        stateDatas.map((item1, index1) => {
            stateDatas.map((item2, index2) => {
                if (index1 != index2
                    && item1.PointId == item2.PointId
                    && item1.SystemModelId == item2.SystemModelId
                ) {
                    hasDuplication = true;
                    duplicationIndex1 = index1;
                    duplicationIndex2 = index2;
                }
            });
        });
        stateDatas.map((item1, index1) => {
            if (SentencedToEmpty(item1, ['SystemModelId'], '') == '') {
                checkSystemModelEmpty = index1;
                return;
            } else {
                stateDatas.map((item2, index2) => {
                    if (index1 != index2
                        && item1.PointId == item2.PointId
                        && item1.SystemModelId == item2.SystemModelId
                    ) {
                        hasDuplication = true;
                        duplicationIndex1 = index1;
                        duplicationIndex2 = index2;
                    }
                });
            }
        });
        if (chekPointEmpty >= 0) {
            ShowToast(`请检查条目${chekPointEmpty + 1},完善点位信息`);
            return;
        } else if (checkSystemModelEmpty >= 0) {
            ShowToast(`请检查条目${checkSystemModelEmpty + 1},完善设备型号信息`);
            return;
        } else if (hasDuplication) {
            ShowToast(`条目${duplicationIndex1 + 1}与条目${duplicationIndex2 + 1}设备型号重复`);
        }
        else if (!couldUpdate) {
            // 不判断图片上传
            ShowToast(`您至少要上传一张照片！`);
            return;
        }
        // else if (imageEmptyIndex != -1) {
        //     // 不判断图片上传
        //     ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitl}未上传图片`);
        //     return;
        // } 
        else {
            let cList = [];
            /**
             * PointId:"ec06df1c-f5fc-4fb6-8774-2e8eedbe5815"
             */
            stateDatas.map(stateI => {
                stateI.ImageArray.map((item, index) => {
                    cList.push({
                        mainId: this.props.dispatchId, //派单ID
                        PointId: stateI.PointId, //多条时 传监测点ID
                        Col1: stateI.SystemModelId, //设备型号
                        serviceId: serviceId, //服务ID 大类
                        recordId: recordId, //表单ID 小类
                        InstallationItems: item.InstallationItems, //安装项 ID
                        InstallationPhoto: item.InstallationPhoto, //附件ID
                        Remark: item.Remark //备注
                    });
                });
            });
            this.props.dispatch(
                createAction('CTInstallationPhotosModel/addInstallationPhotosRecord')({
                    params: {
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        recordId: recordId,
                        cList
                    }
                })
            );
        }
    };

    deleteItemCommitAllData = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        const stateDatas = SentencedToEmpty(this.state, ['stateDatas'], []);

        let chekPointEmpty = -1;
        let imageEmptyIndex = -1
            , imageEmptyTitl = ''
            , hasDuplication = false
            , duplicationIndex1 = -1
            , duplicationIndex2 = -1
            , couldUpdate = false;

        this.state.stateDatas.map((stateI, sI) => {
            if (stateI.PointId.length == 0) {
                chekPointEmpty = sI;
            }
            stateI.ImageArray.map((imageItem) => {
                // 原逻辑有一个为空就记录并报错,当前忽略了这个判断
                // if (imageItem.uploadStatus == 0 && imageEmptyIndex == -1) {
                //     imageEmptyIndex = sI + 1;
                //     imageEmptyTitl = imageItem.InstallationItemsName;
                // }
                // 有一个不为空就可以提交，删除进行判断
                if (imageItem.uploadStatus == 1 || imageItem.uploadStatus == 2) {
                    couldUpdate = true;
                }
            });
        });
        stateDatas.map((item1, index1) => {
            stateDatas.map((item2, index2) => {
                if (index1 != index2
                    && item1.PointId == item2.PointId
                    && item1.SystemModelId == item2.SystemModelId
                ) {
                    hasDuplication = true;
                    duplicationIndex1 = index1;
                    duplicationIndex2 = index2;
                }
            });
        });

        if (hasDuplication) {
            ShowToast(`条目${duplicationIndex1 + 1}与条目${duplicationIndex2 + 1}设备型号重复`);
        } else if (chekPointEmpty >= 0) {
            ShowToast(`请检查条目${chekPointEmpty + 1},完善点位信息`);
            return;
        }
        // else if (!couldUpdate) {
        //     // 不判断图片上传
        //     ShowToast(`您至少要上传一张照片！`);
        //     return;
        // }
        // else if (imageEmptyIndex != -1) {
        //     // 不判断图片上传
        //     ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitl}未上传图片`);
        //     return;
        // } 
        else {
            let cList = [];
            /**
             * PointId:"ec06df1c-f5fc-4fb6-8774-2e8eedbe5815"
             */
            stateDatas.map(stateI => {
                stateI.ImageArray.map((item, index) => {
                    cList.push({
                        mainId: this.props.dispatchId, //派单ID
                        PointId: stateI.PointId, //多条时 传监测点ID
                        Col1: stateI.SystemModelId, //设备型号
                        serviceId: serviceId, //服务ID 大类
                        recordId: recordId, //表单ID 小类
                        InstallationItems: item.InstallationItems, //安装项 ID
                        InstallationPhoto: item.InstallationPhoto, //附件ID
                        Remark: item.Remark //备注
                    });
                });
            });
            this.props.dispatch(
                createAction('CTInstallationPhotosModel/addInstallationPhotosRecord')({
                    params: {
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        recordId: recordId,
                        cList
                    }
                    , callback: () => {
                        return true;
                    }
                })
            );
        }
    };

    getPageStatus = () => {
        // projectEntPointSysModelResult
        // workRecordResult
        const dataStatus = SentencedToEmpty(this.props, ['installationItemsListResult', 'status'], 1000)
        const reallyDataStatus = SentencedToEmpty(this.props, ['installationPhotosRecordResult', 'status'], 1000)
        const optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000)
        if (dataStatus == 404
            || optionStatus == 404
            || reallyDataStatus == 404
        ) {
            return 404;
        } else if (dataStatus == 1000
            || reallyDataStatus == 1000
            || optionStatus == 1000) {
            return 1000;
        } else if (dataStatus == -1
            || reallyDataStatus == -1
            || optionStatus == -1) {
            return -1;
        } else if (dataStatus == 0) {
            return 0;
        } else if (dataStatus == 200
            && reallyDataStatus == 200
            && optionStatus == 200) {
            return 200;
        } else {
            return 1000;
        }
    }

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['addInstallationPhotosRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />
        } else if (SentencedToEmpty(this.props, ['deleteInstallationPhotosRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />
        } else {
            return null;
        }
    }

    cancelButton = () => { }
    confirmDeleteForm = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTInstallationPhotosModel/deleteInstallationPhotosRecord')({
                params: {
                    mainId: this.props.dispatchId,
                    serviceId: serviceId,
                    recordId: recordId
                },
                callback: result => {

                }
            })
        );
    }

    judgeEnterprise = () => {
        // 未选中企业，选择监测点的提示信息
        ShowToast('您还没有选择企业，或者该企业下无监测点');
    }

    judgeSystemModle = () => {
        ShowToast('您还没有选择监测点，或者该监测点下无设备信息');
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let alertDeleteFormOptions = {
            headTitle: '提示',
            messText: '是否确定要删除此表单吗？',
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
                    onpress: this.confirmDeleteForm
                }
            ]
        };
        return (<StatusPage
            status={this.getPageStatus()}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onRefreshWithLoading();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefreshWithLoading();
            }}
        >
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    {/* {[0,1,2].map((item,index)=>{ */}
                    {SentencedToEmpty(this.state, ['stateDatas'], []).map((item, index) => {
                        return (
                            <View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', marginTop: index == 0 ? 0 : 4 }]}>
                                {/* 1 */}
                                <View
                                    style={[
                                        {
                                            height: 44,
                                            paddingLeft: 19,
                                            paddingRight: 19,
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                flexDirection: 'row'
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: 2,
                                                    height: 15,
                                                    backgroundColor: '#4DA9FF',
                                                    marginRight: 9
                                                }
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 15,
                                                    color: '#333333',
                                                    fontWeight: '700'
                                                }
                                            ]}
                                        >{`条目${index + 1}`}</Text>
                                    </View>
                                    {this.isEdit() ? <TouchableOpacity
                                        onPress={() => {
                                            let newDataArr = this.state.stateDatas;
                                            newDataArr.splice(index, 1);
                                            /**由于图片组件进行了内部封装，数据初始化后，无法通过常规办法更换，只能重新绘制 */
                                            this.props.dispatch(
                                                createAction('CTModel/updateState')({
                                                    projectEntPointSysModelResult: { ...this.props.projectEntPointSysModelResult, status: -1 }
                                                })
                                            );
                                            this.setState({ stateDatas: newDataArr }, () => {
                                                this.props.dispatch(
                                                    createAction('CTModel/updateState')({
                                                        projectEntPointSysModelResult: { ...this.props.projectEntPointSysModelResult, status: 200 }
                                                    })
                                                );
                                            });
                                        }}
                                    >
                                        <Text style={{ color: '#4aa0ff' }}>删除</Text>
                                    </TouchableOpacity> : null}
                                </View>
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            marginLeft: 19,
                                            height: 1,
                                            backgroundColor: '#EAEAEA'
                                        }
                                    ]}
                                />
                                {/* 1 */}
                                {/* 2 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业名称`}</Text>
                                        <PickerTouchable
                                            available={this.isEdit()}
                                            ref={ref => (this.pointS = ref)}
                                            option={this.getEnterpriseSelect(item, index)}
                                            // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                {/* <Text>{`${item.EntName || '请选择'}`}</Text> */}
                                                <Text
                                                    numberOfLines={1}
                                                    style={[{
                                                        width: SCREEN_WIDTH - 140
                                                    }]}
                                                >{`${item.EntName || ''}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                height: 1,
                                                backgroundColor: '#EAEAEA'
                                            }
                                        ]}
                                    />
                                </View>
                                {/* 2 */}
                                {/* 3 */}
                                {SentencedToEmpty(item, ['EntId'], '').length > 0 || true ? (
                                    <View
                                        style={[
                                            {
                                                height: 45,
                                                width: SCREEN_WIDTH,
                                                paddingHorizontal: 19,
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: SCREEN_WIDTH - 38,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点名称`}</Text>
                                            <PickerTouchable
                                                available={this.isEdit()}
                                                ref={ref => (this.pointS = ref)}
                                                option={this.getPointSelect(item, index)}
                                                onPress={SentencedToEmpty(this.state, ['stateDatas', index, 'PointList'], []).length == 0 ? this.judgeEnterprise : null}
                                                style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            flex: 1,
                                                            height: 44,
                                                            flexDirection: 'row',
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center'
                                                        }
                                                    ]}
                                                >
                                                    {/* <Text>{`${item.PointName || '请选择'}`}</Text> */}
                                                    <Text numberOfLines={1} style={[{ width: SCREEN_WIDTH - 150, textAlign: 'right' }]}>{`${item.PointName || ''}`}</Text>
                                                    <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                                </View>
                                            </PickerTouchable>
                                        </View>
                                        <View
                                            style={[
                                                {
                                                    width: SCREEN_WIDTH - 38,
                                                    height: 1,
                                                    backgroundColor: '#EAEAEA'
                                                }
                                            ]}
                                        />
                                    </View>
                                ) : null}

                                {/* 3 */}
                                {/* 3.1 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`设备型号`}</Text>
                                        {this.isEdit() ? <MoreSelectTouchable
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                            count={2}
                                            ref={ref => (this._systemPicker = ref)}
                                            option={this.getEquipmentSelect2(index)}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    numberOfLines={2}
                                                    style={[{ width: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(item, ['SystemModelName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </MoreSelectTouchable>
                                            : <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text>{`${SentencedToEmpty(item, ['SystemModelName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>}
                                        {/* <PickerTouchable
                                            available={this.isEdit()}
                                            ref={ref => (this.pointS = ref)}
                                            option={this.getEquipmentSelect(item, index)}
                                            onPress={SentencedToEmpty(this.state, ['stateDatas', index, 'systemModleList'], []).length == 0 ? this.judgeSystemModle : null}
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text>{`${SentencedToEmpty(item, ['SystemModelName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable> */}
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                height: 1,
                                                backgroundColor: '#EAEAEA'
                                            }
                                        ]}
                                    />
                                </View>
                                {/* 3.1 */}
                                {SentencedToEmpty(item, ['ImageArray'], []).map((sitem, sindex) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'EquipmentInstallationPicItemEditor',
                                                        params: {
                                                            title: sitem.InstallationItemsName,
                                                            item: sitem,
                                                            callback: changeI => {
                                                                let newStates = [].concat(this.state.stateDatas);
                                                                newStates[index]['ImageArray'][sindex] = changeI;
                                                                this.setState({ stateDatas: newStates });
                                                            },
                                                            deleteCallback: changeI => {
                                                                const that = this;
                                                                let newStates = [].concat(this.state.stateDatas);
                                                                newStates[index]['ImageArray'][sindex] = changeI;
                                                                this.setState({ stateDatas: newStates }
                                                                    , () => {
                                                                        that.deleteItemCommitAllData();
                                                                    }
                                                                );
                                                            }
                                                        }
                                                    })
                                                );
                                            }}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        height: 45,
                                                        width: SCREEN_WIDTH,
                                                        paddingHorizontal: 19,
                                                        justifyContent: 'center'
                                                    }
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            width: SCREEN_WIDTH - 38,
                                                            height: 44,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between'
                                                        }
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            {
                                                                fontSize: 14,
                                                                color: '#333333'
                                                            }
                                                        ]}
                                                    >{`${sitem.InstallationItemsName}`}</Text>
                                                    <Text
                                                        style={[
                                                            {
                                                                fontSize: 14,
                                                                color: sitem.uploadStatus == 1 ? '#3591F8' : '#333333'
                                                            }
                                                        ]}
                                                    >{`${sitem.uploadStatus == 1 ? '已上传' : sitem.uploadStatus == 2 ? '待上传' : '未上传'}`}</Text>
                                                </View>
                                                {index == 7 ? null : (
                                                    <View
                                                        style={[
                                                            {
                                                                width: SCREEN_WIDTH - 38,
                                                                height: 1,
                                                                backgroundColor: '#EAEAEA'
                                                            }
                                                        ]}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    })}
                    {this.isEdit() ? <View style={[{ backgroundColor: 'white' }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 38,
                                    marginLeft: 19,
                                    height: 1,
                                    backgroundColor: '#EAEAEA'
                                }
                            ]}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                let ImageSubArr = [];
                                SentencedToEmpty(this.props, ['installationItemsListResult', 'data', 'Datas'], []).map(subI => {
                                    ImageSubArr.push({ ...subI, newImageItem: true, InstallationPhoto: new Date().getTime() + subI.ChildID, InstallationItems: subI.ChildID, InstallationItemsName: subI.Name, uploadStatus: 0, Remark: '' });
                                });
                                datas.push({
                                    EntId: '',
                                    EntName: '',
                                    PointId: '',
                                    PointName: '',
                                    FileId: new Date().getTime(),
                                    Remark: '',
                                    ImageArray: ImageSubArr
                                });
                                const checkList = [].concat(this.state.checkList);
                                checkList.push({});
                                this.setState({
                                    stateDatas: datas,
                                    checkList
                                });
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH,
                                        height: 43,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: 'white'
                                    }
                                ]}
                            >
                                <Image
                                    style={[
                                        {
                                            height: 12,
                                            width: 12,
                                            tintColor: '#4DA9FF',
                                            marginRight: 2
                                        }
                                    ]}
                                    source={require('../../../images/jiarecord.png')}
                                />
                                <Text
                                    style={[
                                        {
                                            color: '#4DA9FF',
                                            fontSize: 15
                                        }
                                    ]}
                                >
                                    {'添加条目'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null}
                </ScrollView>
                {!this.isEdit() ? null : SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1 ? (
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                height: 84,
                                flexDirection: 'row',
                                paddingHorizontal: 10,
                                paddingVertical: 20,
                                justifyContent: 'space-between'
                            }
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.deleteFormAlert.show();
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: (SCREEN_WIDTH - 30) / 2,
                                        height: 44,
                                        borderRadius: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#FFA500'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: 17,
                                            color: '#FEFEFE'
                                        }
                                    ]}
                                >
                                    {'删除'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.commitAllData();
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: (SCREEN_WIDTH - 30) / 2,
                                        height: 44,
                                        borderRadius: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#4DA9FF'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        {
                                            fontSize: 17,
                                            color: '#FEFEFE'
                                        }
                                    ]}
                                >
                                    {'提交'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            this.commitAllData();
                        }}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    marginLeft: 10,
                                    height: 44,
                                    borderRadius: 2,
                                    backgroundColor: '#4DA9FF',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginVertical: 20
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        fontSize: 17,
                                        color: '#FEFEFE'
                                    }
                                ]}
                            >
                                {'提交'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <AlertDialog options={alertDeleteFormOptions} ref="deleteFormAlert" />
            {
                this.renderLoadingComponent()
            }
        </StatusPage>
        );
    }
}
