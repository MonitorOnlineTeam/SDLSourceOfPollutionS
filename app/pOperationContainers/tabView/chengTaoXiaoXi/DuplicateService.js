/*
 * @Description: 重复服务填报 
 * @LastEditors: hxf
 * @Date: 2024-03-20 09:35:41
 * @LastEditTime: 2024-07-10 10:07:11
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/DuplicateService.js
 */
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import Form2Switch from '../../../operationContainers/taskViews/taskExecution/components/Form2Switch';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { MoreSelectTouchable, PickerTouchable, StatusPage } from '../../../components';
import { connect } from 'react-redux';

@connect(({ CTModel, CTServiceStatisticsModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    ProjectID: CTModel.ProjectID,
    duplicateServiceRecordResult: CTServiceStatisticsModel.duplicateServiceRecordResult,
    duplicateServiceHasData: CTServiceStatisticsModel.duplicateServiceHasData,
    duplicateServiceRecordList: CTServiceStatisticsModel.duplicateServiceRecordList,
    recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult,
}))
export default class DuplicateService extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '重复服务填报',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            entList: [], // 企业列表
            // pointList:[],// 监测点列表
            // systemModleList:[], // 设备型号列表
        };
    }

    componentDidMount() {
        this.onRefreshWithLoading();
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表
            duplicateServiceRecordResult: { status: -1 }, // 超时派单信息
            duplicateServiceRecordList: [], // 记录列表
            duplicateServicHasData: '', // 是否有重复服务表单
        }));
        // 参数 questionType （必传）  65 、 超时原因 66、重复派单原因   
        this.props.dispatch(createAction('CTServiceStatisticsModel/getRecordQuestion')({
            params: { questionType: 66 }
        }));
        this.props.dispatch(createAction('CTServiceStatisticsModel/getRepeatServiceRecord')({
            params: {},
            callback: result => {
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                if (SentencedToEmpty(Datas, ['ID'], '') == '') {
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordResult: result,
                        duplicateServiceHasData: '',
                    }));
                } else if (
                    typeof Datas.HasData == 'boolean' && !Datas.HasData
                ) {
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordResult: result,
                        duplicateServiceHasData: false,
                    }));
                } else {
                    let resList = SentencedToEmpty(Datas, ['resList'], []);
                    resList.map((item, index) => {
                        item.InfoList = item.resList;
                    });
                    const projectEntPointSysModelList = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], []);

                    const ishandle = this.combinedData(projectEntPointSysModelList, resList);
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordResult: result,
                        duplicateServiceHasData: SentencedToEmpty(Datas, ['HasData'], ''),
                    }));
                }
                return true;
            }
        }));
        this.props.dispatch(
            createAction('CTModel/getProjectEntPointSysModel')({
                params: {
                    projectId: SentencedToEmpty(this.props, ['ProjectID'], '')
                },
                callback: result => {
                    const duplicateServiceRecordList = SentencedToEmpty(this.props, ['duplicateServiceRecordList'], []);
                    const ishandle = this.combinedData(SentencedToEmpty(result, ['data', 'Datas'], [])
                        , duplicateServiceRecordList);
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
    }

    combinedData = (projectEntPointSysModelList, duplicateServiceRecordList) => {
        // 获取点位和设备型号的数据表
        let newDuplicateServiceRecordList = [].concat(duplicateServiceRecordList);
        let entIndex = -1, pointIndex = -1;
        newDuplicateServiceRecordList.map((item, index) => {
            console.log('resList = ', item.resList);
            item.InfoList = item.resList;
            if (SentencedToEmpty(item, ['EntID'], '') != '') {
                entIndex = projectEntPointSysModelList.findIndex(x => x.EntId == item.EntID);
                if (entIndex != -1) {
                    item.pointList = SentencedToEmpty(projectEntPointSysModelList, [entIndex, 'PointList'], []);
                    if (SentencedToEmpty(item, ['PointID'], '') != '') {
                        pointIndex = item.pointList.findIndex(y => y.PointId == item.PointID);
                        if (pointIndex != -1) {
                            item.systemModleList = SentencedToEmpty(item.pointList, [pointIndex, 'systemModleList'], []);
                        }
                    }
                }

            }
        });
        console.log('newDuplicateServiceRecordList = ', newDuplicateServiceRecordList);
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            duplicateServiceRecordList: newDuplicateServiceRecordList
        }));
        return false;
    };

    getPageStatus = () => {
        // projectEntPointSysModelResult
        // duplicateServiceRecordResult
        // recordQuestionResult
        const projectEntPointSysModelStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
        const duplicateServiceRecordStatus = SentencedToEmpty(this.props, ['duplicateServiceRecordResult', 'status'], 1000);
        const recordQuestionStatus = SentencedToEmpty(this.props, ['recordQuestionResult', 'status'], 1000);
        if (projectEntPointSysModelStatus == 200
            && duplicateServiceRecordStatus == 200
            && recordQuestionStatus == 200) {
            return 200;
        } else if (projectEntPointSysModelStatus == -1
            || duplicateServiceRecordStatus == -1
            || recordQuestionStatus == -1) {
            return -1;
        } else {
            if (projectEntPointSysModelStatus != 200
                && projectEntPointSysModelStatus != -1) {
                return projectEntPointSysModelStatus;
            }
            if (duplicateServiceRecordStatus != 200
                && duplicateServiceRecordStatus != -1) {
                return duplicateServiceRecordStatus;
            }
            if (recordQuestionStatus != 200
                && recordQuestionStatus != -1) {
                return recordQuestionStatus;
            }
        }

    }

    isEdit = () => {
        const duplicateServiceHasData = SentencedToEmpty(this.props, ['duplicateServiceHasData'], false);
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    getEnterpriseSelect = index => {
        return {
            codeKey: 'EntId',
            nameKey: 'EntName',
            dataArr: this.state.entList,
            // dataArr: [],
            defaultCode: SentencedToEmpty(this.state, ['duplicateServiceRecordList', index, 'EntID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props, ['duplicateServiceRecordList'], [])
                    );
                    //     EntID: '',// 企业id
                    //     PointID: '',// 点位id
                    //     SystemCode: '',// 系统编码 设备型号
                    // newData[index].EntId = item.EntId;
                    newData[index].EntID = item.EntId;
                    newData[index].EntName = item.EntName;
                    // 清空数据
                    newData[index].PointID = '';
                    newData[index].PointName = '';
                    newData[index].systemModleList = [];
                    newData[index].SystemCode = '';
                    newData[index].SystemName = '';
                    // 清空数据 end
                    newData[index].pointList = SentencedToEmpty(item, ['PointList'], []);
                    //     this.setState({
                    //         stateDatas: newData
                    //     });
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordList: newData
                    }));
                }
            }
        };
    };

    getPointSelect = index => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            dataArr: SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'pointList'], []),
            defaultCode: SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'PointID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props, ['duplicateServiceRecordList'], [])
                    );
                    newData[index].PointID = item.PointId;
                    newData[index].PointName = item.PointName;
                    //     // 清空数据
                    newData[index].SystemCode = '';
                    newData[index].SystemName = '';
                    // 清空数据 end
                    newData[index].systemModleList = SentencedToEmpty(item, ['systemModleList'], []);
                    //     this.setState({
                    //         stateDatas: newData
                    //     });
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordList: newData
                    }));
                }
            }
        };
    };

    getEquipmentSelect = index => {
        return {
            codeKey: 'SystemModelID',
            nameKey: 'SystemModel',
            dataArr: SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'systemModleList'], []),
            defaultCode: SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'SystemCode'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props, ['duplicateServiceRecordList'], [])
                    );
                    newData[index].SystemCode = item.SystemModelID;
                    newData[index].SystemName = item.SystemModel;
                    // this.setState({
                    //     stateDatas: newData
                    // });
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordList: newData
                    }));
                }
            }
        };
    };

    getEquipmentSelect2 = (index) => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'systemModleList'], []);
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
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                let codeArrayStr = '', nameArrayStr = '';
                // newData[index].SystemCode = item.SystemModelID;
                // newData[index].SystemName = item.SystemModel;
                selectData.map((item, index) => {
                    if (index == 0) {
                        codeArrayStr = item.SystemModelID;
                        nameArrayStr = item.SystemModel;
                    } else {
                        codeArrayStr = codeArrayStr + ',' + item.SystemModelID;
                        nameArrayStr = nameArrayStr + ',' + item.SystemModel;
                    }
                });
                let newDuplicateServiceRecordList = [].concat(this.props.duplicateServiceRecordList);
                if (newDuplicateServiceRecordList.length > index) {
                    newDuplicateServiceRecordList[index].SystemName = nameArrayStr;
                    newDuplicateServiceRecordList[index].SystemCode = codeArrayStr;
                }
                console.log('newDuplicateServiceRecordList = ', newDuplicateServiceRecordList);
                // if (deleteIndexList.length > 0) {
                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                    duplicateServiceRecordList: newDuplicateServiceRecordList
                }));
                // }
            }
        };
    }

    getTimeoutCauseOption = (index) => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['recordQuestionResult', 'data', 'Datas'], []);
        const duplicateServiceRecordList = SentencedToEmpty(this.props, ['duplicateServiceRecordList'], []);
        SentencedToEmpty(duplicateServiceRecordList
            , [index, 'InfoList'], [])
            .map((item, index) => {
                selectCodes.push(item.QuestionID)
            });

        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            // placeHolderStr: '污染物',
            codeKey: 'ChildID',
            nameKey: 'Name',
            // maxNum: 2,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                selectData.map((item, index) => {
                    item.QuestionID = item.ChildID;
                    item.QuestionName = item.Name;
                });
                let findIndex = -1;
                let selectedIndexList = [];
                let deleteIndexList = [];
                SentencedToEmpty(this.props
                    , ['duplicateServiceRecordList', index, 'InfoList'], [])
                    .map((item, index) => {
                        console.log('duplicateServiceRecordList item = ', item);
                        // if (SentencedToEmpty(item, ['ChildID'], '') != '') {
                        if (SentencedToEmpty(item, ['QuestionID'], '') != '') {
                            findIndex = selectCode.findIndex(codeItem => {
                                if (codeItem == item.QuestionID) {
                                    return true;
                                }
                            });
                            if (findIndex == -1) {
                                deleteIndexList.push({ findIndex, dataIndex: index, recordId: item.ChildID, recordName: item.Name });
                            } else {
                                selectedIndexList.push({ findIndex, dataIndex: index });
                            }
                        }
                    });
                selectedIndexList.map(selectedDateItem => {
                    console.log(selectData[selectedDateItem.findIndex]);
                    selectData[selectedDateItem.findIndex] = {
                        ...selectData[selectedDateItem.findIndex],
                        ...this.props.duplicateServiceRecordList[index].InfoList[selectedDateItem.dataIndex]
                    };
                });
                console.log('deleteIndexList = ', deleteIndexList)
                console.log('selectData = ', selectData)
                let newDuplicateServiceRecordList = [].concat(this.props.duplicateServiceRecordList);
                // debugger
                if (newDuplicateServiceRecordList.length > index) {
                    newDuplicateServiceRecordList[index].InfoList = selectData;
                }
                console.log('newDuplicateServiceRecordList = ', newDuplicateServiceRecordList);
                if (deleteIndexList.length > 0) {
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        duplicateServiceRecordList: newDuplicateServiceRecordList
                    }));
                } else {
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        // RecordList: selectData, 
                        duplicateServiceRecordList: newDuplicateServiceRecordList
                    }));
                }
            }
        };
    }

    judgeEnterprise = () => {
        ShowToast('未选中企业');
    }

    judgePoint = () => {
        ShowToast('未选中监测点');
    }

    render() {
        console.log('render DuplicateService duplicateServiceHasData = ', this.props.duplicateServiceHasData);
        const duplicateServiceRecordList = SentencedToEmpty(this.props, ['duplicateServiceRecordList'], []);
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
            <View style={[{
                width: SCREEN_WIDTH,
                flex: 1
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH, height: 44
                    , paddingHorizontal: 20
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#fff'
                }]}>
                    <Form2Switch
                        editable={this.isEdit()}
                        label='是否有重复服务'
                        data={[{ name: '是', value: true }, { name: '否', value: false }]}
                        value={SentencedToEmpty(this.props, ['duplicateServiceHasData'], '')}
                        onChange={(value) => {
                            // duplicateServiceHasData
                            // console.log('duplicateServiceHasData = ', value);
                            let params = {
                                duplicateServiceHasData: value
                            }
                            if (!value) {
                                params.duplicateServiceRecordList = [];
                                this.props.dispatch(
                                    createAction('CTServiceStatisticsModel/updateState')(params));
                            } else {
                                params.duplicateServiceRecordResult = { status: -1 };
                                this.props.dispatch(
                                    createAction('CTServiceStatisticsModel/updateState')(params));
                                this.props.dispatch(createAction('CTServiceStatisticsModel/getRepeatServiceRecord')({
                                    params: {},
                                    callback: result => {
                                        const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                                        let resList = SentencedToEmpty(Datas, ['resList'], []);
                                        resList.map((item, index) => {
                                            item.InfoList = item.resList;
                                        });
                                        const projectEntPointSysModelList = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], []);

                                        const ishandle = this.combinedData(projectEntPointSysModelList, resList);

                                        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                            duplicateServiceRecordResult: result,
                                            // duplicateServiceHasData: SentencedToEmpty(Datas, ['HasData'], false),
                                            duplicateServiceHasData: value,
                                        }));
                                        return true;
                                    }
                                }));
                            }
                            this.props.dispatch(
                                createAction('CTServiceStatisticsModel/updateState')(params));
                        }}
                    />
                </View>
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH, marginTop: 5
                    }]}
                >
                    {SentencedToEmpty(this.props, ['duplicateServiceRecordList'], [])
                        .map((item, index) => {
                            return (<View
                                style={[{
                                    width: SCREEN_WIDTH,
                                    alignItems: 'center', marginBottom: 5
                                    , paddingBottom: 4
                                }]}
                            >
                                {/* 0 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH, height: 30
                                        , flexDirection: 'row', paddingLeft: 19
                                        , paddingRight: 13, justifyContent: 'space-between'
                                        , alignItems: 'center'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 12, color: '#666666',
                                        }]}
                                    >{`服务表单${index + 1}`}</Text>
                                    {this.isEdit() ? <TouchableOpacity
                                        onPress={() => {
                                            const duplicateServiceRecordList
                                                = SentencedToEmpty(this.props, ['duplicateServiceRecordList'], [])
                                            let newDuplicateServiceRecordList = [].concat(duplicateServiceRecordList);
                                            newDuplicateServiceRecordList.splice(index, 1);
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                duplicateServiceRecordList: newDuplicateServiceRecordList
                                            }));
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: 80, height: 61
                                                , justifyContent: 'center', alignItems: 'flex-end'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    fontSize: 12, color: '#4AA0FF',
                                                }]}
                                            >{`删除`}</Text>
                                        </View>
                                    </TouchableOpacity> : null}
                                </View>
                                {/* 0 */}
                                {/* 1 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            backgroundColor: '#fff',
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
                                                        width: SCREEN_WIDTH - 140
                                                        , textAlign: 'right',
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
                                {/* 1 */}
                                {/* 2 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            backgroundColor: '#fff',
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
                                            onPress={SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'EntID'], '') == '' ? this.judgeEnterprise : null}
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
                                                <Text>{`${SentencedToEmpty(item, ['PointName'], '')}`}</Text>
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
                                            backgroundColor: '#fff',
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
                                                <Text>{`${SentencedToEmpty(item, ['SystemName'], '')}`}</Text>
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
                                                <Text>{`${SentencedToEmpty(item, ['SystemName'], '')}`}</Text>
                                            </View>}
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
                                {/* 4 */}
                                {
                                    this.isEdit() ? < MoreSelectTouchable
                                        count={2}
                                        ref={ref => (this._picker = ref)}
                                        option={this.getTimeoutCauseOption(index)}
                                    >
                                        <View style={[{
                                            width: SCREEN_WIDTH, height: 60
                                            , justifyContent: 'center', alignItems: 'center', alignItems: 'center'
                                            , backgroundColor: '#fff'
                                        }]}>
                                            <View
                                                style={[{
                                                    width: 150, height: 30,
                                                    borderRadius: 5,
                                                    backgroundColor: '#F6F6F6'
                                                    , justifyContent: 'center', alignItems: 'center'
                                                }]}
                                            >
                                                <Text
                                                    style={[{
                                                        color: '#4AA0FF', fontSize: 14
                                                    }]}
                                                >{'重复服务原因'}</Text>
                                            </View>
                                        </View>
                                    </MoreSelectTouchable> : null}
                                {/* 4 */}
                                {
                                    SentencedToEmpty(item, ['InfoList'], []).
                                        map((innerItem, innerIndex) => {
                                            console.log('innerItem = ', innerItem);
                                            return (<View style={[{
                                                backgroundColor: '#fff',
                                                width: SCREEN_WIDTH
                                                , height: 124
                                                // , height: 44
                                                , alignItems: 'center'
                                            }]}>
                                                <View
                                                    style={[{
                                                        width: SCREEN_WIDTH - 40, height: 44
                                                        , flexDirection: 'row', alignItems: 'center'
                                                        , justifyContent: 'space-between'
                                                    }]}
                                                >
                                                    <Text style={[{
                                                        fontSize: 14, color: '#333333'
                                                    }]}>{`${innerIndex + 1}、${innerItem.QuestionName}`}</Text>
                                                    <TextInput
                                                        editable={this.isEdit()}
                                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                        style={[{
                                                            fontSize: 11, color: '#999999'
                                                            , textAlign: 'right', backgroundColor: '#F6F6F6'
                                                            , height: 21, paddingVertical: 0
                                                        }]}
                                                        placeholder={'重复服务次数'}
                                                        onChangeText={text => {
                                                            /**
                                                             * index innerIndex
                                                             */
                                                            let newItem = { ...innerItem }
                                                            newItem.RepeatCount = text;
                                                            let newList = [].concat(duplicateServiceRecordList);
                                                            newList[index].InfoList[innerIndex] = newItem;
                                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                                duplicateServiceRecordList: newList
                                                            }));
                                                        }}
                                                    >
                                                        {SentencedToEmpty(innerItem, ['RepeatCount'], '')}
                                                    </TextInput>
                                                </View>
                                                <TextInput
                                                    editable={this.isEdit()}
                                                    style={[{
                                                        width: SCREEN_WIDTH - 42,
                                                        fontSize: 14, color: '#999999'
                                                        , textAlign: 'left', textAlignVertical: 'top'
                                                        , backgroundColor: '#F6F6F6'
                                                        , height: 70, paddingVertical: 0
                                                    }]}
                                                    placeholder={'问题详细描述'}
                                                    onChangeText={text => {
                                                        let newItem = { ...innerItem }
                                                        newItem.Remark = text;
                                                        let newList = [].concat(duplicateServiceRecordList);
                                                        newList[index].InfoList[innerIndex] = newItem;
                                                        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                            duplicateServiceRecordList: newList
                                                        }));
                                                    }}
                                                >
                                                    {SentencedToEmpty(innerItem, ['Remark'], '')}
                                                </TextInput>
                                            </View>);
                                        })
                                }
                            </View>)
                        })}
                    {this.isEdit() && SentencedToEmpty(this.props, ['duplicateServiceHasData'], false) ? <View style={[{ backgroundColor: 'white' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                let duplicateServiceRecordList = [].concat(SentencedToEmpty(this.props, ['duplicateServiceRecordList'], []));
                                duplicateServiceRecordList.push(
                                    {
                                        EntID: '',// 企业id
                                        PointID: '',// 点位id
                                        SystemCode: '',// 系统编码 设备型号
                                        InfoList: [
                                            // {
                                            //     QuestionID: '',//原因码表Code
                                            //     RepeatCount: '',//重复次数
                                            //     Remark: '',//详细描述
                                            // }
                                        ],//重复服务内容
                                    }
                                );
                                // console.log('duplicateServiceRecordList = ', duplicateServiceRecordList);
                                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                    duplicateServiceRecordList
                                }));
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
                {this.isEdit() ? <View
                    style={[{
                        width: SCREEN_WIDTH, height: 75
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            const duplicateServiceHasData = SentencedToEmpty(this.props, ['duplicateServiceHasData'], '');
                            const duplicateServiceRecordList = SentencedToEmpty(this.props, ['duplicateServiceRecordList'], []);
                            console.log('duplicateServiceHasData = ', duplicateServiceHasData);
                            if (duplicateServiceHasData === '') {
                                ShowToast('是否有重复服务表单为必选项');
                                return;
                            } else if (duplicateServiceHasData) {
                                if (duplicateServiceRecordList.length > 0) {
                                    let allCorrect = true, errorItemIndex = -1
                                        , errorReason = '';
                                    duplicateServiceRecordList.map(
                                        (item, index) => {
                                            if (SentencedToEmpty(item, ['EntID'], '') == '') {
                                                if (allCorrect) {
                                                    errorItemIndex = index;
                                                    allCorrect = false;
                                                    errorReason = '未选择企业';
                                                }
                                            }
                                            if (SentencedToEmpty(item, ['PointID'], '') == '') {
                                                if (allCorrect) {
                                                    errorItemIndex = index;
                                                    allCorrect = false;
                                                    errorReason = '未选择监测点';
                                                }
                                            }
                                            if (SentencedToEmpty(item, ['SystemCode'], '') == '') {
                                                if (allCorrect) {
                                                    errorItemIndex = index;
                                                    allCorrect = false;
                                                    errorReason = '未选择设备型号';
                                                }
                                            }
                                            let InfoList = SentencedToEmpty(item, ['InfoList'], [])
                                            if (InfoList.length == 0) {
                                                if (allCorrect) {
                                                    errorItemIndex = index;
                                                    allCorrect = false;
                                                    errorReason = '缺少重复服务的原因';
                                                }
                                            } else {
                                                InfoList.map((innerItem, innerIndex) => {
                                                    if (SentencedToEmpty(innerItem, ['QuestionID'], '') == '') {
                                                        if (allCorrect) {
                                                            errorItemIndex = index;
                                                            allCorrect = false;
                                                            errorReason = '重复服务原因编码错误';
                                                        }
                                                    }
                                                    let RepeatCount = SentencedToEmpty(innerItem, ['RepeatCount'], '')
                                                    console.log('RepeatCount = ', RepeatCount);
                                                    let testResult = /^[0-9]*[1-9][0-9]*$/.test(RepeatCount);
                                                    console.log('testResult = ', testResult);
                                                    if (!testResult) {
                                                        if (allCorrect) {
                                                            errorItemIndex = index;
                                                            allCorrect = false;
                                                            errorReason = `第${innerIndex + 1}条记录的重复次数错误`;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    );
                                    if (allCorrect) {
                                        ShowLoadingToast('正在提交');
                                        this.props.dispatch(createAction('CTServiceStatisticsModel/addOrUpdRepeatServiceRecord')({}));
                                    } else {
                                        ShowToast(`第${errorItemIndex + 1}项${errorReason}！`);
                                    }
                                } else {
                                    ShowToast('未添加重复服务记录');
                                }
                            } else {
                                ShowLoadingToast('正在提交');
                                this.props.dispatch(createAction('CTServiceStatisticsModel/addOrUpdRepeatServiceRecord')({}));
                            }
                        }}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 20, height: 44
                                , borderRadius: 2, backgroundColor: '#4DA9FF'
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                </View> : null}
            </View>
        </StatusPage >)
    }
}