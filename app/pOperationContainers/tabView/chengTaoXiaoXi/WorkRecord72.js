/*
 * @Description: 多条 工作记录 支持 指导安装和72小时调试的特殊属性
 * @LastEditors: hxf
 * @Date: 2023-09-19 19:33:41
 * @LastEditTime: 2024-11-11 13:51:34
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/WorkRecord72.js
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Platform, Text, View, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { PickerSingleTimeTouchable, PickerTouchable, StatusPage, AlertDialog, SimpleLoadingView } from '../../../components';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel, CTWorkRecordModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    ProjectID: CTModel.ProjectID,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult, // 点位信息
    workRecordResult: CTWorkRecordModel.workRecordResult,
    deleteWorkRecordResult: CTWorkRecordModel.deleteWorkRecordResult,
    addWorkRecordResult: CTWorkRecordModel.addWorkRecordResult
}))
export default class WorkRecord72 extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '工作记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            deleteItemIndex: -1, // 删除的item的索引
            DepartureTime: moment().format('YYYY-MM-DD HH:mm'),
            stateDatas: [
                // {
                //     EntId: "",
                //     EntName: "",
                //     PointId: "",
                //     PointName: "",
                //     FileId: "1695112599975",
                //     Remark: "369",
                //     ImageArray:[],
                //     workingHours:''
                // }
            ],
            entList: [], // 企业列表
            // pointList:[],// 监测点列表
            // systemModleList:[], // 设备型号列表
            completionStatusList: [
                { code: 1, label: '已完成' },
                { code: 0, label: '未完成' }
            ] // 完成状态列表
        };
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTWorkRecordModel/updateState')({
                workRecordResult: { status: -1 }
            })
        );
        this.onRefresh();
    };

    onRefresh = () => {
        this.props.dispatch(
            createAction('CTModel/getProjectEntPointSysModel')({
                params: {
                    projectId: SentencedToEmpty(this.props, ['ProjectID'], '')
                },
                callback: result => {
                    const ishandle = this.combinedData('projectEntPointSysModelResult', result);
                    if (!ishandle) {
                        this.setState(
                            {
                                entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                            },
                            () => {
                                this.props.dispatch(
                                    createAction('CTModel/updateState')({
                                        projectEntPointSysModelResult: result
                                    })
                                );
                            }
                        );
                    }
                    return true;
                }
            })
        );

        if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            this.props.dispatch(
                createAction('CTWorkRecordModel/getWorkRecord')({
                    params: {
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        RecordId: RecordId
                    },
                    callback: result => {
                        const ishandle = this.combinedData('workRecordResult', result);
                        if (!ishandle) {
                            const data = SentencedToEmpty(result, ['data', 'Datas'], {});
                            this.setState(
                                {
                                    DepartureTime: SentencedToEmpty(data, ['0', 'DepartureTime'], moment().format('YYYY-MM-DD HH:mm')),
                                    stateDatas: data
                                },
                                () => {
                                    this.props.dispatch(
                                        createAction('CTWorkRecordModel/updateState')({
                                            workRecordResult: result
                                        })
                                    );
                                }
                            );
                        }
                        return true;
                    }
                })
            );
        }
    };

    combinedData = (currentFunName, result) => {
        let optionStatus, dataStatus, entlist, dataList;
        if (currentFunName == 'workRecordResult') {
            optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
            dataStatus = result.status;
            entlist = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], []);
            dataList = SentencedToEmpty(result, ['data', 'Datas'], []);
        } else if (currentFunName == 'projectEntPointSysModelResult') {
            optionStatus = result.status;
            dataStatus = SentencedToEmpty(this.props, ['workRecordResult', 'status'], 1000);
            entlist = SentencedToEmpty(result, ['data', 'Datas'], []);
            dataList = SentencedToEmpty(this.props, ['workRecordResult', 'data', 'Datas'], []);
        }
        if (optionStatus == 200 && dataStatus == 200) {
            dataList.map((item, index) => {
                entlist.map((entItem, entIndex) => {
                    if (entItem.EntId == item.EntId) {
                        item.pointList = entItem.PointList;
                        entItem.PointList.map((pointItem, pointIndex) => {
                            if (pointItem.PointId == item.PointId) {
                                item.systemModleList = pointItem.systemModleList;
                            }
                        });
                    }
                });
            });
            if (currentFunName == 'workRecordResult') {
                this.setState(
                    {
                        DepartureTime: SentencedToEmpty(dataList, ['0', 'DepartureTime'], moment().format('YYYY-MM-DD HH:mm')),
                        stateDatas: dataList
                    },
                    () => {
                        this.props.dispatch(
                            createAction('CTWorkRecordModel/updateState')({
                                workRecordResult: result
                            })
                        );
                    }
                );
            } else if (currentFunName == 'projectEntPointSysModelResult') {
                this.setState(
                    {
                        entList: SentencedToEmpty(result, ['data', 'Datas'], []),
                        stateDatas: dataList
                    },
                    () => {
                        this.props.dispatch(
                            createAction('CTModel/updateState')({
                                projectEntPointSysModelResult: result
                            })
                        );
                    }
                );
            }
            return true;
        }
        return false;
    };

    getDepartureTimeOption = index => {
        let type = 'minute';

        return {
            defaultTime: this.state.DepartureTime,
            type: type,
            onSureClickListener: time => {
                this.setState({
                    DepartureTime: moment(time).format('YYYY-MM-DD HH:mm')
                });
            }
        };
    };

    getCompletionTimeOption = index => {
        let type = 'minute';

        return {
            defaultTime: SentencedToEmpty(this.state, ['stateDatas', index, 'CompletionTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: type,
            onSureClickListener: time => {
                let newData = [].concat(this.state.stateDatas);
                newData[index].CompletionTime = moment(time).format('YYYY-MM-DD HH:mm');
                this.setState({
                    stateDatas: newData
                });
            }
        };
    };

    getEnterpriseSelect = index => {
        return {
            codeKey: 'EntId',
            nameKey: 'EntName',
            dataArr: this.state.entList,
            defaultCode: SentencedToEmpty(this.state, ['stateDatas', index, 'EntId'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].EntId = item.EntId;
                    newData[index].EntName = item.EntName;
                    // 清空数据
                    newData[index].PointId = '';
                    newData[index].PointName = '';
                    newData[index].systemModleList = [];
                    newData[index].SystemModelId = '';
                    newData[index].SystemModelName = '';
                    // 清空数据 end
                    newData[index].pointList = SentencedToEmpty(item, ['PointList'], []);
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    getPointSelect = index => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            dataArr: SentencedToEmpty(this.state, ['stateDatas', index, 'pointList'], []),
            defaultCode: SentencedToEmpty(this.state, ['stateDatas', index, 'PointId'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].PointId = item.PointId;
                    newData[index].PointName = item.PointName;
                    // 清空数据
                    newData[index].SystemModelId = '';
                    newData[index].SystemModelName = '';
                    // 清空数据 end
                    newData[index].systemModleList = SentencedToEmpty(item, ['systemModleList'], []);
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    judgeEnterprise = () => {
        // 未选中企业，选择监测点的提示信息
        ShowToast('您还没有选择企业，或者该企业下无监测点');
    };

    judgePoint = () => {
        // 未选中企业，选择监测点的提示信息
        ShowToast('您还没有选择监测点，或者该监测点下没有设备信息');
    };

    getCompletionStatusLabel = (index, key) => {
        //'CompletionStatus'
        const item = this.state.completionStatusList.filter((item, listIndex) => {
            if (key == 'Col1') {
                return item.code == SentencedToEmpty(this.state, ['stateDatas', index, key], 0);
            } else {
                return item.code == SentencedToEmpty(this.state, ['stateDatas', index, key], 0);
            }
        });
        return SentencedToEmpty(item, [0, 'label'], '');
    };

    debugStatusTransform = inComelabel => {
        if (typeof inComelabel == 'number') {
            return inComelabel;
        }
        if (inComelabel == 1) {
            return 1;
        } else {
            return 0;
        }
    };

    // 完成状态 配置
    getCompletionStatusSelectOption = index => {
        return {
            codeKey: 'code',
            nameKey: 'label',
            dataArr: this.state.completionStatusList,
            defaultCode: SentencedToEmpty(this.state, ['stateDatas', index, 'CompletionStatus'], 0),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].CompletionStatus = item.code;
                    newData[index].CompletionTime = moment().format('YYYY-MM-DD HH:mm');
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    // 是否调试完成 配置
    getCompleteDebuggingStatusSelectOption = index => {
        return {
            codeKey: 'code',
            nameKey: 'label',
            dataArr: this.state.completionStatusList,
            defaultCode: this.debugStatusTransform(SentencedToEmpty(this.state, ['stateDatas', index, 'Col1'], 0)),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].Col1 = item.code;
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    getEquipmentSelect = index => {
        // 只有指导安装 才有这个选项
        return {
            codeKey: 'SystemModelID',
            nameKey: 'SystemModel',
            dataArr: SentencedToEmpty(this.state, ['stateDatas', index, 'systemModleList'], []),
            defaultCode: SentencedToEmpty(this.state, ['stateDatas', index, 'SystemModelID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].SystemModelId = item.SystemModelID;
                    newData[index].SystemModelName = item.SystemModel;
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    getPageStatus = () => {
        // projectEntPointSysModelResult
        // workRecordResult
        const dataStatus = SentencedToEmpty(this.props, ['workRecordResult', 'status'], 1000);
        const optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
        if (dataStatus == 404 || optionStatus == 404) {
            return 404;
        } else if (dataStatus == 1000 || optionStatus == 1000) {
            return 1000;
        } else if (dataStatus == -1 || optionStatus == -1) {
            return -1;
        } else if (dataStatus == 0) {
            return 0;
        } else if (dataStatus == 200 && optionStatus == 200) {
            return 200;
        } else {
            return 1000;
        }
    };

    checkParams = checkData => {
        let realCheckData = checkData;
        if (typeof commitList == 'undefined' || !commitList) {
            realCheckData = SentencedToEmpty(this.state, ['stateDatas'], []);
        }
        if (realCheckData.length == 0) {
            ShowToast('表单数据不能为空！');
            return { checkStatus: false };
        }
        let checkStatus = true;
        let cList = [],
            tempItem;
        realCheckData.map((item, index) => {
            tempItem = item;
            if (item.PointId == '') {
                ShowToast(`第${index + 1}条记录的测试点不能为空`);
                checkStatus = false;
                return false;
            }
            {/* 4	以下一级类型下的工作记录需要校验设备型号
                指导安装 3 
                静态调试 4      
                72小时调试检测 7
                项目验收 10
            */}
            if (
                (this.props.firstItem.ItemId == 4
                    || this.props.firstItem.ItemId == 3
                    || this.props.firstItem.ItemId == 7
                    || this.props.firstItem.ItemId == 10
                )
                && item.SystemModelId == '') {
                ShowToast(`第${index + 1}条记录的设备型号不能为空`);
                checkStatus = false;
                return false;
            }

            if (SentencedToEmpty(item, ['ActualHour'], '') == '') {
                ShowToast(`第${index + 1}条记录的实际工时未填写`);
                checkStatus = false;
                return false;
            } else if (!/^\d+(\.\d+)?$/.test(SentencedToEmpty(item, ['ActualHour'], ''))) {
                ShowToast(`第${index + 1}条记录的实际工时数字格式非法`);
                checkStatus = false;
                return false;
            }

            if (item.CompletionStatus != 0 && item.CompletionStatus != 1) {
                ShowToast(`第${index + 1}条记录未选择完成状态`);
                checkStatus = false;
                return false;
            }
            if (SentencedToEmpty(item, ['CompletionStatus'], 0) == 1 && SentencedToEmpty(item, ['CompletionTime'], '') == '') {
                ShowToast(`第${index + 1}条记录的完成时间未填写`);
                checkStatus = false;
                return false;
            }

            if (
                this.props.firstItem.ItemId == 7 &&
                item.Col1 != 0 &&
                item.Col1 != 1 // 默认选中未完成
            ) {
                ShowToast(`第${index + 1}条记录的调试完成状态未选中`);
                checkStatus = false;
                return false;
            }

            if (SentencedToEmpty(item, ['CompletionStatus'], 0) == 0) {
                tempItem = { ...item };
                delete tempItem.CompletionTime;
            }
            // 去掉 离开现场时间
            // tempItem.DepartureTime = this.state.DepartureTime;

            cList.push(tempItem);
            //         "cList": [
            //             {
            //             "mainId": this.props.dispatchId,//派单ID
            //             "PointId": "08fe3409-ad65-499e-9f3f-9ba981ce85fe",//多条时 传监测点ID
            //             "Remark": "备注123", //备注
            //             "SystemModelId": "63d86c14-cacd-466c-bdcc-7a8efd28f3d1", //系统型号ID (指导安装大类下的工作记录要传这个)
            //             "ActualHour": 8, //实际工时
            //             "CompletionStatus": 1,//完成状态 （0 未完成 1已完成 ，已完成时必填完成时间）
            //             "CompletionTime": moment().format('YYYY-MM-DD HH:mm:ss'), //完成时间
            //             "DepartureTime": moment().add(2,'hours').format('YYYY-MM-DD HH:mm:ss'),//离开现场时间
            //             "serviceId": serviceId,//服务ID 大类
            //             "RecordId": RecordId,//表单ID 小类
            //             }
        });
        if (checkStatus) {
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            let params = {
                mainId: this.props.dispatchId,
                serviceId: serviceId,
                RecordId: RecordId,
                cList
            };
            return { checkStatus: true, params };
        } else {
            return { checkStatus: false };
        }
    };

    cancelButton = () => { };
    confirmDeleteItem = () => {
        const index = this.state.deleteItemIndex;
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let commitList = [];
        let newItem = {};
        SentencedToEmpty(this.state, ['stateDatas'], []).map((item, currentIndex) => {
            if (currentIndex != index) {
                newItem = { ...item };
                // newItem.mainId = this.props.dispatchId;
                // newItem.serviceId = serviceId;
                // newItem.recordId = recordId;
                commitList.push(newItem);
            }
        });
        this.props.dispatch(
            createAction('CTWorkRecordModel/addWorkRecord')({
                params: {
                    mainId: this.props.dispatchId,
                    serviceId: serviceId,
                    recordId: recordId,
                    cList: commitList
                },
                callback: () => {
                    ShowToast('删除成功');
                    let newData = SentencedToEmpty(this.state, ['stateDatas'], []).concat([]);
                    newData.splice(index, 1);
                    this.setState({
                        stateDatas: newData
                    });
                    return true;
                }
            })
        );
    };

    confirmDeleteForm = () => {
        const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTWorkRecordModel/deleteWorkRecord')({
                // this.props.dispatch(createAction('CTModel/deleteAcceptanceServiceRecord')({
                params: {
                    mainId: this.props.dispatchId,
                    serviceId: serviceId,
                    RecordId: RecordId
                },
                callback: result => { }
            })
        );
    };

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['addWorkRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />;
        } else if (SentencedToEmpty(this.props, ['deleteWorkRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />;
        } else {
            return null;
        }
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
        let alertDeleteItemOptions = {
            headTitle: '提示',
            messText: '是否确定要删除这条记录吗？',
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
                    onpress: this.confirmDeleteItem
                }
            ]
        };
        let alertDeleteFormOptions = {
            headTitle: '提示',
            messText: '是否确定要删除此工作记录？',
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
        return (
            <StatusPage
                status={this.getPageStatus()}
                // status={200}
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
                <View
                    style={[
                        {
                            width: SCREEN_WIDTH,
                            flex: 1
                        }
                    ]}
                >
                    {/* <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                height: 44,
                                backgroundColor: 'white',
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
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
                        >
                            {'离开现场时间'}
                        </Text>
                        <PickerSingleTimeTouchable
                            available={this.isEdit()}
                            option={this.getDepartureTimeOption()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 0, height: 25 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.DepartureTime).format('YYYY-MM-DD HH:mm')}</Text>
                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                        </PickerSingleTimeTouchable>
                    </View> */}
                    <ScrollView style={[{ width: SCREEN_WIDTH, marginTop: 5 }]}>
                        {// [1,2,3].map((item,index)=>{ stateDatas
                            SentencedToEmpty(this.state, ['stateDatas'], []).map((item, index) => {
                                return (
                                    <View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', marginTop: index == 0 ? 0 : 4 }]}>
                                        {/* 1 */}
                                        <View
                                            style={[
                                                {
                                                    height: 44,
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
                                                <View style={[{ flex: 1 }]} />
                                                {this.isEdit() ? <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState(
                                                            {
                                                                deleteItemIndex: index
                                                            },
                                                            () => {
                                                                this.refs.deleteItemAlert.show();
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <View style={[{ height: 40, width: 80, justifyContent: 'center', alignItems: 'flex-end' }]}>
                                                        <Text style={[{ color: '#333333', fontSize: 13 }]}>{'删除'}</Text>
                                                    </View>
                                                </TouchableOpacity> : null}
                                            </View>
                                        </View>
                                        {/* 1 */}
                                        {/* 2 */}
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
                                                    option={this.getEnterpriseSelect(index)}
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
                                                        <Text
                                                            numberOfLines={1}
                                                            style={[{
                                                                color: '#333333',
                                                                width: SCREEN_WIDTH - 140
                                                            }]}
                                                        >{`${SentencedToEmpty(item, ['EntName'], '')}`}</Text>
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
                                                    option={this.getPointSelect(index)}
                                                    onPress={SentencedToEmpty(this.state, ['stateDatas', index, 'pointList'], []).length == 0 ? this.judgeEnterprise : null}
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
                                                        <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item, ['PointName'], '')}`}</Text>
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
                                        {/* 3 */}
                                        {/* 4 变动  */}
                                        {/* 4	
                                            指导安装 3 
                                            静态调试 4      
                                            72小时调试检测 7
                                            项目验收 10
                                        */}
                                        {this.props.firstItem.ItemId == 3
                                            || this.props.firstItem.ItemId == 4
                                            || this.props.firstItem.ItemId == 7
                                            || this.props.firstItem.ItemId == 10
                                            ? (
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
                                                        <PickerTouchable
                                                            available={this.isEdit()}
                                                            ref={ref => (this.pointS = ref)}
                                                            option={this.getEquipmentSelect(index)}
                                                            onPress={SentencedToEmpty(this.state, ['stateDatas', index, 'systemModleList'], []).length == 0 ? this.judgePoint : null}
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
                                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.state, ['stateDatas', index, 'SystemModelName'], '')}`}</Text>
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
                                        {/* 4 */}
                                        {/* 5 */}
                                        <View
                                            style={[
                                                {
                                                    height: 45,
                                                    width: SCREEN_WIDTH,
                                                    paddingHorizontal: 19,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: SCREEN_WIDTH - 38,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                                <Text style={[{ fontSize: 14, color: '#333333' }]}>{`实际工时（小时）`}</Text>
                                                <TextInput
                                                    editable={this.isEdit()}
                                                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                    placeholder=""
                                                    autoCapitalize={'none'}
                                                    autoCorrect={false}
                                                    underlineColorAndroid={'transparent'}
                                                    onChangeText={text => {
                                                        //动态更新组件内state 记录输入内容
                                                        // this.setState({ num: text });
                                                        let newData = [].concat(this.state.stateDatas);
                                                        newData[index].ActualHour = text;
                                                        this.setState({
                                                            stateDatas: newData
                                                        });
                                                    }}
                                                    value={SentencedToEmpty(item, ['ActualHour'], '') + ''}
                                                    style={{ textAlign: 'right', color: '#666666', marginRight: 0, fontSize: 14, flex: 1, height: 40 }}
                                                />
                                                {/* <Text style={[{ fontSize:14, color:'#333333' }]}>{`小时`}</Text> */}
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
                                        {/* 5 */}
                                        {/* 6 */}
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
                                                <Text style={[{ fontSize: 14, color: '#333333' }]}>{`完成状态`}</Text>
                                                <PickerTouchable
                                                    available={this.isEdit()}
                                                    ref={ref => (this.pointS = ref)}
                                                    option={this.getCompletionStatusSelectOption(index)}
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
                                                        <Text style={[{ color: '#333333' }]}>{`${this.getCompletionStatusLabel(index, 'CompletionStatus')}`}</Text>
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
                                        {/* 6 */}
                                        {/* 7 */}
                                        {SentencedToEmpty(this.state, ['stateDatas', index, 'CompletionStatus'], 0) == 1 ? (
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
                                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`完成时间`}</Text>
                                                    <PickerSingleTimeTouchable
                                                        available={this.isEdit()}
                                                        option={this.getCompletionTimeOption(index)} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 0, height: 44 }}>
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
                                                            <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.stateDatas[index].CompletionTime).format('YYYY-MM-DD HH:mm')}</Text>
                                                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                                        </View>
                                                    </PickerSingleTimeTouchable>
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
                                        {/* 7 */}
                                        {/* 8 */}
                                        {this.props.firstItem.ItemId == 7 ? (
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
                                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`是否调试完成`}</Text>
                                                    <PickerTouchable
                                                        available={this.isEdit()}
                                                        ref={ref => (this.pointS = ref)}
                                                        option={this.getCompleteDebuggingStatusSelectOption(index)}
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
                                                            <Text style={[{ color: '#333333' }]}>{`${this.getCompletionStatusLabel(index, 'Col1')}`}</Text>
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
                                        {/* 8 */}
                                        {/* 9 */}
                                        <View
                                            style={[
                                                {
                                                    width: SCREEN_WIDTH,
                                                    minHeight: 107,
                                                    marginTop: 5,
                                                    backgroundColor: 'white'
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        height: 44,
                                                        width: SCREEN_WIDTH,
                                                        paddingHorizontal: 19,
                                                        justifyContent: 'center'
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
                                                >
                                                    {'工作内容'}
                                                </Text>
                                            </View>
                                            <TextInput
                                                editable={this.isEdit()}
                                                multiline={true}
                                                placeholder={this.isEdit() ? '请填写工作内容' : '未记录工作内容'}
                                                placeholderTextColor={'#999999'}
                                                style={{
                                                    width: SCREEN_WIDTH - 38 + 15,
                                                    marginLeft: 19,
                                                    marginRight: 4,
                                                    minHeight: 40,
                                                    marginTop: 4,
                                                    marginBottom: 15,
                                                    textAlignVertical: 'top',
                                                    color: '#666666',
                                                    fontSize: 15
                                                }}
                                                onChangeText={text => {
                                                    let newData = [].concat(this.state.stateDatas);
                                                    newData[index].Remark = text;
                                                    this.setState({
                                                        stateDatas: newData
                                                    });
                                                }}
                                            >
                                                {`${SentencedToEmpty(item, ['Remark'], '')}`}
                                            </TextInput>
                                        </View>
                                        {/* 9 */}
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
                                    /**
                                     * 单条
                                     * 1	前期勘查
                                     * 2	设备验货
                                     * 14	其它
                                     * 特殊
                                     * 3	指导安装
                                     * "systemModelId": "string",// 系统型号ID
                                     *
                                     * 7	72小时调试检测
                                     * 72小时调试检测的工作记录加一个是否调试完成接口的字段Col1
                                     * 1 完成
                                     * 0 未完成
                                     *
                                     * 其他是多条
                                     */
                                    let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                    const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                                    const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                                    let item = {
                                        pointList: [], // 监测点列表

                                        mainId: this.props.dispatchId,
                                        serviceId: serviceId,
                                        RecordId: RecordId,
                                        PointId: '', //多条时 传监测点ID
                                        Remark: '', //备注
                                        // "SystemModelId": "string",// 系统型号ID (指导安装大类下的工作记录要传这个)
                                        ActualHour: '', //实际工时
                                        CompletionStatus: -1, //完成状态 默认不选中 （0 未完成 1已完成 ，已完成时必填完成时间）
                                        CompletionTime: moment().format('YYYY-MM-DD HH:mm'), //完成时间
                                        DepartureTime: moment().format('YYYY-MM-DD HH:mm') //离开现场时间
                                        // "Col1": 0,//是否调试完成  72小时调试检测的工作记录加一个是否调试完成接口的字段Col1
                                    };
                                    // 4	静态调试
                                    if (this.props.firstItem.ItemId == 4 || this.props.firstItem.ItemId == 3
                                        || this.props.firstItem.ItemId == 7
                                        || this.props.firstItem.ItemId == 10) {
                                        // 3	指导安装
                                        item.SystemModelId = '';
                                        item.systemModleList = []; // 设备型号列表
                                    }
                                    if (this.props.firstItem.ItemId == 7) {
                                        // 7	72小时调试检测
                                        // item.Col1 = 0; // 默认选中未完成
                                        item.Col1 = -1; // 默认不选中
                                    }
                                    datas.push(item);
                                    this.setState({
                                        stateDatas: datas
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
                                    const paramsCheckResult = this.checkParams();
                                    if (paramsCheckResult.checkStatus) {
                                        this.props.dispatch(createAction('CTWorkRecordModel/addWorkRecord')({ params: paramsCheckResult.params }));
                                    }
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
                                const paramsCheckResult = this.checkParams();
                                if (paramsCheckResult.checkStatus) {
                                    this.props.dispatch(createAction('CTWorkRecordModel/addWorkRecord')({ params: paramsCheckResult.params }));
                                }
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
                <AlertDialog options={alertDeleteItemOptions} ref="deleteItemAlert" />
                {this.renderLoadingComponent()}
            </StatusPage>
        );
    }
}
