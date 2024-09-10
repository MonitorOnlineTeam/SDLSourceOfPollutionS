/*
 * @Description: 参数设置照片
 * @LastEditors: hxf
 * @Date: 2023-09-20 14:10:14
 * @LastEditTime: 2023-10-20 09:52:48
 * @FilePath: /SDLMainProject36/app/pOperationContainers/tabView/chengTaoXiaoXi/ParameterSettingPic.js
 */
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { PickerTouchable, StatusPage, AlertDialog, SimpleLoadingView } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import ImageGrid from '../../../components/form/images/ImageGrid';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel, CTParameterSettingPicModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    ProjectID: CTModel.ProjectID,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    parameterSettingsPhotoRecordResult: CTParameterSettingPicModel.parameterSettingsPhotoRecordResult,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult,
    addParameterSettingsPhotoRecordResult: CTParameterSettingPicModel.addParameterSettingsPhotoRecordResult,
    deleteParameterSettingsPhotoRecordResult: CTParameterSettingPicModel.deleteParameterSettingsPhotoRecordResult,
}))
export default class ParameterSettingPic extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '参数设置照片',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            stateDatas: [],
            entList: []
        };
    }

    componentDidMount() {
        this.onRefreshWithLoading();
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTParameterSettingPicModel/updateState')({
                parameterSettingsPhotoRecordResult: { status: -1 }
            })
        );
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
            const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            this.props.dispatch(
                createAction('CTParameterSettingPicModel/getParameterSettingsPhotoRecord')({
                    params: {
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        recordId: recordId
                    },
                    callback: result => {
                        const ishandle = this.combinedData('parameterSettingsPhotoRecordResult', result);
                        if (!ishandle) {
                            const data = SentencedToEmpty(result, ['data', 'Datas'], []);
                            let initStateData = [];
                            data.map(item => {
                                let images = [];
                                SentencedToEmpty(item, ['SetPhotoList', 'ImgList'], []).map(picItem => {
                                    images.push({
                                        AttachID: picItem.split('/')[picItem.split('/').length - 1],
                                        url: picItem
                                    });
                                });
                                initStateData.push({ ...item, ImageArray: images });
                            });
                            this.setState({ stateDatas: initStateData }
                                , () => {
                                    this.props.dispatch(
                                        createAction('CTParameterSettingPicModel/updateState')({
                                            parameterSettingsPhotoRecordResult: result
                                        })
                                    );
                                }
                            );
                        }
                        return true;
                    }
                })
            );
        } else {
            this.props.dispatch(
                createAction('CTParameterSettingPicModel/updateState')({
                    parameterSettingsPhotoRecordResult: { status: 200 }
                })
            );
        }
    }

    combinedData = (currentFunName, result) => {
        let optionStatus, dataStatus, entlist, dataList;
        if (currentFunName == 'parameterSettingsPhotoRecordResult') {
            optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000)
            dataStatus = result.status;
            entlist = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], [])
            dataList = SentencedToEmpty(result, ['data', 'Datas'], []);
        } else if (currentFunName == 'projectEntPointSysModelResult') {
            optionStatus = result.status
            dataStatus = SentencedToEmpty(this.props, ['parameterSettingsPhotoRecordResult', 'status'], 1000)
            entlist = SentencedToEmpty(result, ['data', 'Datas'], [])
            dataList = SentencedToEmpty(this.props, ['parameterSettingsPhotoRecordResult', 'data', 'Datas'], []);
        }
        if (optionStatus == 200 && dataStatus == 200) {
            dataList.map((item, index) => {
                let images = [];
                SentencedToEmpty(item, ['SetPhotoList', 'ImgList'], []).map(picItem => {
                    images.push({
                        AttachID: picItem.split('/')[picItem.split('/').length - 1],
                        url: picItem
                    });
                });
                item.ImageArray = images;
                entlist.map((entItem, entIndex) => {
                    if (entItem.EntId == item.EntId) {
                        item.PointList = entItem.PointList;
                    }
                });
            });
            if (currentFunName == 'parameterSettingsPhotoRecordResult') {
                this.setState({
                    stateDatas: dataList
                }, () => {
                    this.props.dispatch(createAction('CTParameterSettingPicModel/updateState')({
                        parameterSettingsPhotoRecordResult: result
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
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newItem = this.state.stateDatas[index];
                    newItem.EntId = item.EntId;
                    newItem.EntName = item.EntName;
                    newItem.PointList = SentencedToEmpty(item, ['PointList'], []);
                    newItem.PointId = '';
                    newItem.PointName = '';
                    let newDataArr = this.state.stateDatas;
                    newDataArr[index] = newItem;
                    this.setState({ stateDatas: newDataArr });
                }
            }
        };
    };
    getParams = (item, index) => {
        return {
            placeHolder: '请选择',
            codeKey: 'ParameterSetter',
            nameKey: 'ParameterSetterName',
            defaultCode: SentencedToEmpty(item, ['ParameterSetter'], ''),
            dataArr: [
                { ParameterSetter: '1', ParameterSetterName: '雪迪龙' },
                { ParameterSetter: '2', ParameterSetterName: '客户' }
            ],
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newItem = this.state.stateDatas[index];
                    newItem.ParameterSetter = item.ParameterSetter;
                    newItem.ParameterSetterName = item.ParameterSetterName;
                    let newDataArr = this.state.stateDatas;
                    newDataArr[index] = newItem;
                    this.setState({ stateDatas: newDataArr });
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
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newItem = this.state.stateDatas[index];
                    newItem.PointId = item.PointId;
                    newItem.PointName = item.PointName;
                    let newDataArr = this.state.stateDatas;
                    newDataArr[index] = newItem;
                    this.setState({ stateDatas: newDataArr });
                }
            }
        };
    };

    checkParams = (checkData) => {
        let realCheckData = SentencedToEmpty(this.state, ['stateDatas'], [])
        if (realCheckData.length == 0) {
            ShowToast('表单数据不能为空！');
            return { checkStatus: false };
        }

        const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let checkStatus = true;
        let cList = [], tempItem;
        realCheckData.map((item, index) => {
            tempItem = { ...item };
            if (item.PointId == '') {
                ShowToast(`第${index + 1}条记录的测试点不能为空`);
                checkStatus = false;
                return false;
            }

            if (item.ParameterSetter == '') {
                ShowToast(`第${index + 1}条记录的参数设置方不能为空`);
                checkStatus = false;
                return false;
            }

            if (SentencedToEmpty(item, ['ImageArray'], []).length == 0) {
                ShowToast(`第${index + 1}条记录的${item.ParameterSetter == 1 ? '参数设置照片' : '客户告知函及函件发送方式截图'}不能为空`);
                checkStatus = false;
                return false;
            }

            tempItem.mainId = this.props.dispatchId; // 派单ID
            tempItem.serviceId = serviceId; // 服务ID 大类
            tempItem.RecordId = RecordId; // 表单ID 小类

            cList.push(tempItem);
        });
        if (checkStatus) {

            let params = {
                "mainId": this.props.dispatchId,
                "serviceId": serviceId,
                "RecordId": RecordId,
                cList
            }
            return { checkStatus: true, params };
        } else {
            return { checkStatus: false };
        }

    }

    getPageStatus = () => {
        const dataStatus = SentencedToEmpty(this.props, ['parameterSettingsPhotoRecordResult', 'status'], 1000)
        const optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000)
        if (dataStatus == 404
            || optionStatus == 404
        ) {
            return 404;
        } else if (dataStatus == 1000
            || optionStatus == 1000) {
            return 1000;
        } else if (dataStatus == -1
            || optionStatus == -1) {
            return -1;
        } else if (dataStatus == 0) {
            return 0;
        } else if (dataStatus == 200
            && optionStatus == 200) {
            return 200;
        } else {
            return 1000;
        }
    }

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['addParameterSettingsPhotoRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />
        } else if (SentencedToEmpty(this.props, ['deleteParameterSettingsPhotoRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />
        } else {
            return null;
        }
    }

    cancelButton = () => { }
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
        this.props.dispatch(createAction('CTParameterSettingPicModel/addParameterSettingsPhotoRecord')({
            params: {
                "mainId": this.props.dispatchId,
                "serviceId": serviceId,
                "recordId": recordId,
                "cList": commitList
            }
            , callback: () => {
                ShowToast('删除成功');
                let newData = SentencedToEmpty(this.state, ['stateDatas'], []).concat([]);
                newData.splice(index, 1);
                this.setState({
                    stateDatas: newData
                });
                return true;
            }
        }));

    }

    confirmDeleteForm = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTParameterSettingPicModel/deleteParameterSettingsPhotoRecord')({
                params: {
                    mainId: this.props.dispatchId,
                    serviceId: serviceId,
                    recordId: recordId
                },
                callback: result => { }
            })
        );
    }

    judgeEnterprise = () => {
        // 未选中企业，选择监测点的提示信息
        ShowToast('您还没有选择企业，或者该企业下无监测点');
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
            messText: '是否确定要删除此报告吗？',
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
                {SentencedToEmpty(this.props.projectEntPointSysModelResult, ['status'], '') == 200 ? (
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
                                                this.setState({
                                                    deleteItemIndex: index
                                                }, () => {
                                                    this.refs.deleteItemAlert.show();
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
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[{
                                                            width: SCREEN_WIDTH - 140
                                                        }]}
                                                    >{`${item.EntName || '请选择'}`}</Text>
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
                                                        <Text>{`${item.PointName || '请选择'}`}</Text>
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

                                    {/* 3*/}
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
                                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`参数设置方`}</Text>
                                            <PickerTouchable
                                                available={this.isEdit()}
                                                ref={ref => (this.pointS = ref)}
                                                option={this.getParams(item, index)}
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
                                                    <Text>{`${item.ParameterSetterName || '请选择'}`}</Text>
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
                                    {SentencedToEmpty(item, ['ParameterSetter'], '').length > 0 ? (
                                        <View
                                            style={[
                                                {
                                                    width: SCREEN_WIDTH,
                                                    paddingHorizontal: 19
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: SCREEN_WIDTH - 38,
                                                        height: 36, flexDirection: 'row',
                                                        paddingTop: 15
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                                <Text
                                                    style={[
                                                        {
                                                            fontSize: 15,
                                                            color: '#333333'
                                                        }
                                                    ]}
                                                >
                                                    {item.ParameterSetter == 1 ? '参数设置照片' : '客户告知函及函件发送方式截图'}
                                                </Text>
                                            </View>
                                            <ImageGrid
                                                buttonPosition={'behind'}
                                                interfaceName={'netCore'}
                                                style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 10, backgroundColor: '#fff' }}
                                                isUpload={this.isEdit()}
                                                isDel={this.isEdit()}
                                                Imgs={item.ImageArray}
                                                UUID={item.SetPhoto}
                                                uploadCallback={items => {
                                                    let newItem = this.state.stateDatas[index];
                                                    items.map(picI => {
                                                        newItem.ImageArray.push(picI);
                                                    });

                                                    let newDataArr = this.state.stateDatas;
                                                    newDataArr[index] = newItem;
                                                    this.setState({ stateDatas: newDataArr });
                                                }}
                                                delCallback={idx => {
                                                    let newItem = this.state.stateDatas[index];

                                                    newItem.ImageArray.splice(idx, 1);

                                                    let newDataArr = this.state.stateDatas;
                                                    newDataArr[index] = newItem;
                                                    this.setState({ stateDatas: newDataArr });
                                                }}
                                            />
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
                                                {'备注'}
                                            </Text>
                                        </View>

                                        <TextInput
                                            editable={this.isEdit()}
                                            multiline={true}
                                            placeholder={true ? '请填写备注' : '暂无备注信息'}
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
                                                let newItem = this.state.stateDatas[index];
                                                newItem.Remark = text;
                                                let newDataArr = this.state.stateDatas;
                                                newDataArr[index] = newItem;
                                                this.setState({ stateDatas: newDataArr });
                                            }}
                                        >
                                            {`${item.Remark || ''}`}
                                        </TextInput>
                                    </View>
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
                                    datas.push({
                                        EntId: '',
                                        EntName: '',
                                        PointId: '',
                                        PointName: '',
                                        ParameterSetter: '',
                                        ParameterSetterName: '',
                                        SetPhoto: new Date().getTime(),
                                        Remark: '',
                                        ImageArray: []
                                    });
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
                ) : null}

                {!this.isEdit() ? null : SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1 || true ? (
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
                                    this.props.dispatch(
                                        createAction('CTParameterSettingPicModel/addParameterSettingsPhotoRecord')({
                                            params: paramsCheckResult.params
                                        })
                                    );
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
                                this.props.dispatch(
                                    createAction('CTParameterSettingPicModel/addParameterSettingsPhotoRecord')({
                                        params: paramsCheckResult.params
                                    })
                                );
                            }
                        }}
                        style={[
                            {
                                marginHorizontal: 10,
                                marginBottom: 20,
                                marginTop: 10
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    height: 44,
                                    borderRadius: 2,
                                    backgroundColor: '#4DA9FF',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <AlertDialog options={alertDeleteFormOptions} ref="deleteFormAlert" />
                <AlertDialog options={alertDeleteItemOptions} ref="deleteItemAlert" />
                {
                    this.renderLoadingComponent()
                }
            </View>
        </StatusPage>
        );
    }
}
