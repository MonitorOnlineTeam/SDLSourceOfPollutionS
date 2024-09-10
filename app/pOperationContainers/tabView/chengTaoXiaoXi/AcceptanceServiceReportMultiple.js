/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-09-18 09:29:20
 * @LastEditTime: 2024-06-03 16:55:53
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/AcceptanceServiceReportMultiple.js
 */

import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import { connect } from 'react-redux';
import { PickerTouchable, StatusPage, AlertDialog, SimpleLoadingView } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize'
import ImageGrid from '../../../components/form/images/ImageGrid';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    ProjectID: CTModel.ProjectID,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    acceptanceServiceRecordResult: CTModel.acceptanceServiceRecordResult,
    addAcceptanceServiceRecordResult: CTModel.addAcceptanceServiceRecordResult,
    deleteAcceptanceServiceRecordResult: CTModel.deleteAcceptanceServiceRecordResult,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult,// 点位信息
}))
export default class AcceptanceServiceReportMultiple extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '验收服务报告 ',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            stateDatas: [
                // {
                //     pointList:[],// 监测点列表
                //     EntId: "",
                //     EntName: "",
                //     PointId: "",
                //     PointName: "",
                //     FileId: "1695112599975",
                //     Remark: "369",
                //     ImageArray:[]
                // }
            ],
            entList: [],
            deleteItemIndex: 0
        }
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
            this.props.dispatch(createAction('CTModel/getAcceptanceServiceRecord')({
                params: {
                    "mainId": this.props.dispatchId,
                    "serviceId": serviceId,
                    "recordId": recordId,
                }
                , callback: (result) => {
                    const ishandle = this.combinedData('acceptanceServiceRecordResult', result);
                    if (!ishandle) {
                        const data = SentencedToEmpty(result, ['data', 'Datas'], []);
                        let newData = [].concat(data);
                        let newImages = [];
                        newData.map((recordItem, recordIndex) => {
                            newImages = [];
                            SentencedToEmpty(recordItem, ['FileList', 'ImgList'], []).map((item, index) => {
                                newImages.push(
                                    { AttachID: SentencedToEmpty(recordItem, ['FileList', 'ImgNameList', index], ''), url: item }
                                );
                            })
                            recordItem.ImageObjectList = newImages;
                        });

                        this.setState({
                            stateDatas: newData
                        }, () => {
                            this.props.dispatch(createAction('CTModel/updateState')({
                                acceptanceServiceRecordResult: result
                            }))
                        });
                    }

                }
            }));
        }

        this.props.dispatch(createAction('CTModel/getProjectEntPointSysModel')({
            params: {
                "projectId": SentencedToEmpty(this.props, ['ProjectID'], ''),
            }
            , callback: (result) => {
                const ishandle = this.combinedData('projectEntPointSysModelResult', result);
                if (!ishandle) {
                    this.setState({
                        entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                    }, () => {
                        this.props.dispatch(createAction('CTModel/updateState')({
                            projectEntPointSysModelResult: result
                        }))
                    });
                }
                return true;
            }
        }));
    }

    combinedData = (currentFunName, result) => {
        // projectEntPointSysModelResult
        // acceptanceServiceRecordResult
        let optionStatus, dataStatus, entlist, dataList;
        if (currentFunName == 'acceptanceServiceRecordResult') {
            optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000)
            dataStatus = result.status;
            entlist = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], [])
            dataList = SentencedToEmpty(result, ['data', 'Datas'], []);

            let newData = [].concat(dataList);
            let newImages = [];
            newData.map((recordItem, recordIndex) => {
                newImages = [];
                SentencedToEmpty(recordItem, ['FileList', 'ImgList'], []).map((item, index) => {
                    newImages.push(
                        { AttachID: SentencedToEmpty(recordItem, ['FileList', 'ImgNameList', index], ''), url: item }
                    );
                })
                recordItem.ImageObjectList = newImages;
            });
            dataList = newData;
        } else if (currentFunName == 'projectEntPointSysModelResult') {
            optionStatus = result.status
            dataStatus = SentencedToEmpty(this.props, ['acceptanceServiceRecordResult', 'status'], 1000)
            entlist = SentencedToEmpty(result, ['data', 'Datas'], [])
            dataList = SentencedToEmpty(this.props, ['acceptanceServiceRecordResult', 'data', 'Datas'], []);
        }
        if (optionStatus == 200 && dataStatus == 200) {
            dataList.map((item, index) => {
                entlist.map((entItem, entIndex) => {
                    if (entItem.EntId == item.EntId) {
                        item.pointList = entItem.PointList;
                    }
                });
            });
            if (currentFunName == 'acceptanceServiceRecordResult') {
                this.setState({
                    stateDatas: dataList
                }, () => {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        acceptanceServiceRecordResult: result
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

    getEnterpriseSelect = (index) => {
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
                    // 清空数据 end
                    newData[index].pointList = SentencedToEmpty(item, ['PointList'], [])
                    this.setState({
                        stateDatas: newData,
                    });
                }
            }
        };
    }

    judgeEnterprise = () => {
        // 未选中企业，选择监测点的提示信息
        ShowToast('您还没有选择企业，或者该企业下无监测点');
    }

    getPointSelect = (index) => {
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
                    this.setState({
                        stateDatas: newData,
                    });
                }
            }
        };
    }

    getPageStatus = () => {
        const dataStatus = SentencedToEmpty(this.props,
            ['acceptanceServiceRecordResult', 'status'], 1000);
        const optionStatus = SentencedToEmpty(this.props
            , ['projectEntPointSysModelResult', 'status'], 1000);
        /**
         *  neterror: 404,
            content: 200,
            error: 1000,
            empty: 0,
            init: -1,
            loading: -1,
            commit: -2
         */
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

    cancelButton = () => { }
    confirmDeleteItem = () => {
        // 删除钱可能也需要参数校验
        const index = this.state.deleteItemIndex;
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let commitList = [];
        let newItem = {};
        SentencedToEmpty(this.state, ['stateDatas'], []).map((item, currentIndex) => {
            if (currentIndex != index) {
                newItem = { ...item };
                delete newItem.ImgNameList;
                delete newItem.ImgList;
                delete newItem.ImageObjectList;
                newItem.mainId = this.props.dispatchId;
                newItem.serviceId = serviceId;
                newItem.recordId = recordId;
                commitList.push(newItem);
            }
        });
        this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
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
        this.props.dispatch(createAction('CTModel/deleteAcceptanceServiceRecord')({
            params: {
                "mainId": this.props.dispatchId,
                "serviceId": serviceId,
                "recordId": recordId,
            }
        }));
    }

    renderLoadingComponent = () => {
        // addAcceptanceServiceRecordResult:CTModel.addAcceptanceServiceRecordResult,
        // deleteAcceptanceServiceRecordResult:CTModel.deleteAcceptanceServiceRecordResult,
        if (SentencedToEmpty(this.props, ['addAcceptanceServiceRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />
        } else if (SentencedToEmpty(this.props, ['deleteAcceptanceServiceRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />
        } else {
            return null;
        }
    }

    checkParams = () => {
        let realCheckData = SentencedToEmpty(this.state, ['stateDatas'], []);
        if (realCheckData.length == 0) {
            ShowToast('表单数据不能为空！');
            return { checkStatus: false };
        }
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        let checkStatus = true;
        let cList = [], tempItem;
        realCheckData.map((item, index) => {
            tempItem = item;
            if (item.PointId == '') {
                ShowToast(`第${index + 1}条记录的测试点不能为空`);
                checkStatus = false;
                return false;
            }
            if (SentencedToEmpty(item, ['ImageObjectList'], []).length == 0) {
                ShowToast(`第${index + 1}条记录的验收服务报告照片缺失`);
                checkStatus = false;
                return false;
            }

            delete tempItem.ImgNameList;
            delete tempItem.ImgList;
            // delete tempItem.ImageObjectList;
            tempItem.mainId = this.props.dispatchId;
            tempItem.serviceId = serviceId;
            tempItem.recordId = recordId;
            cList.push(tempItem);
        });
        if (checkStatus) {
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
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
            messText: '确定要删除这条记录吗？',
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
                this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefresh();
            }}
        >
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    {/* {[0,1,2].map((item,index)=>{ */}
                    {SentencedToEmpty(this.state
                        , ['stateDatas'], []
                    ).map((item, index) => {
                        return (<View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', marginTop: index == 0 ? 0 : 4 }]}>
                            {/* 1 */}
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH
                                , paddingHorizontal: 19, justifyContent: 'center'
                            }]}>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , flexDirection: 'row', alignItems: 'center'
                                    }]}
                                >
                                    <View
                                        style={[{
                                            width: 2, height: 15
                                            , backgroundColor: '#4DA9FF'
                                            , marginRight: 9
                                        }]}
                                    />
                                    <Text style={[{
                                        fontSize: 15, color: '#333333'
                                        , fontWeight: '700'
                                    }]}>{`条目${index + 1}`}</Text>
                                    <View style={[{ flex: 1 }]} />
                                    {this.isEdit() ? <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                deleteItemIndex: index
                                            }, () => {
                                                this.refs.deleteItemAlert.show();
                                            });
                                        }}
                                    >
                                        <View style={[{
                                            height: 40, width: 80
                                            , justifyContent: 'center', alignItems: 'flex-end'
                                        }]}>
                                            <Text style={[{ fontSize: 13 }]}>{'删除'}</Text>
                                        </View>
                                    </TouchableOpacity> : null}
                                </View>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 38, marginLeft: 19
                                    , height: 1, backgroundColor: '#EAEAEA'
                                }]}
                            />
                            {/* 1 */}
                            {/* 2 */}
                            <View style={[{
                                height: 45, width: SCREEN_WIDTH
                                , paddingHorizontal: 19, justifyContent: 'center'
                            }]}>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , flexDirection: 'row', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业名称`}</Text>
                                    <PickerTouchable
                                        available={this.isEdit()}
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getEnterpriseSelect(index)}
                                        // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                        style={[{
                                            flex: 1, height: 44
                                            , flexDirection: 'row'
                                        }]}
                                    >
                                        <View style={[{
                                            flex: 1, height: 44
                                            , flexDirection: 'row'
                                            , justifyContent: 'flex-end', alignItems: 'center'
                                        }]}>
                                            <Text
                                                numberOfLines={1}
                                                style={[{
                                                    width: SCREEN_WIDTH - 140
                                                }]}
                                            >{`${SentencedToEmpty(item, ['EntName'], '')}`}</Text>
                                            <Image
                                                style={[{ height: 15, width: 15 }]}
                                                source={require('../../../images/ic_arrows_right.png')} />
                                        </View>
                                    </PickerTouchable>
                                </View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , height: 1, backgroundColor: '#EAEAEA'
                                    }]}
                                />
                            </View>
                            {/* 2 */}
                            {/* 3 */}
                            <View style={[{
                                height: 45, width: SCREEN_WIDTH
                                , paddingHorizontal: 19, justifyContent: 'center'
                            }]}>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , flexDirection: 'row', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点名称`}</Text>
                                    <PickerTouchable
                                        available={this.isEdit()}
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getPointSelect(index)}
                                        onPress={SentencedToEmpty(this.state, ['stateDatas', index, 'pointList'], []).length == 0 ? this.judgeEnterprise : null}
                                        // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                        style={[{
                                            flex: 1, height: 44
                                            , flexDirection: 'row'
                                        }]}
                                    >
                                        <View style={[{
                                            flex: 1, height: 44
                                            , flexDirection: 'row'
                                            , justifyContent: 'flex-end', alignItems: 'center'
                                        }]}>
                                            <Text>{`${SentencedToEmpty(item, ['PointName'], '')}`}</Text>
                                            <Image
                                                style={[{ height: 15, width: 15 }]}
                                                source={require('../../../images/ic_arrows_right.png')} />
                                        </View>
                                    </PickerTouchable>
                                </View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , height: 1, backgroundColor: '#EAEAEA'
                                    }]}
                                />
                            </View>
                            <View style={[{
                                width: SCREEN_WIDTH, paddingHorizontal: 19
                            }]}>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38, height: 36
                                        , paddingTop: 15, flexDirection: 'row'
                                    }]}
                                >
                                    <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                    <Text
                                        style={[{
                                            fontSize: 15, color: '#333333'
                                        }]}
                                    >{'验收服务报告照片'}</Text>
                                </View>
                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'netCore'}
                                    style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 10, backgroundColor: '#fff' }}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    Imgs={SentencedToEmpty(item
                                        , ['ImageObjectList']
                                        , []
                                    )}
                                    UUID={SentencedToEmpty(item, ['FileId'], '')}
                                    uploadCallback={items => {
                                        let commitList = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                        let tempImages = [].concat(SentencedToEmpty(commitList, [index, 'ImageObjectList'], []));
                                        tempImages = tempImages.concat(items);
                                        commitList[index].ImageObjectList = tempImages;
                                        this.setState({ stateDatas: commitList });
                                    }}
                                    delCallback={delImageIndex => {
                                        let commitList = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                        commitList[index].ImageObjectList.splice(delImageIndex, 1);
                                        this.setState({ stateDatas: commitList });
                                    }}
                                />
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38
                                        , height: 1, backgroundColor: '#EAEAEA'
                                    }]}
                                />
                            </View>
                            {/* 3 */}
                            {/* 4 */}
                            <View style={[{
                                width: SCREEN_WIDTH, minHeight: 107
                                , marginTop: 5, backgroundColor: 'white'
                            }]}>
                                <View style={[{
                                    height: 44, width: SCREEN_WIDTH
                                    , paddingHorizontal: 19, justifyContent: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 14, color: '#333333'
                                    }]}>{'备注'}</Text>
                                </View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 38, marginLeft: 19
                                        , height: 1, backgroundColor: '#EAEAEA'
                                    }]}
                                />
                                <TextInput
                                    editable={this.isEdit()}
                                    multiline={true}
                                    placeholder={true ? '请填写备注' : '暂无备注信息'}
                                    style={{
                                        width: SCREEN_WIDTH - 38 + 15
                                        , marginLeft: 19, marginRight: 4, minHeight: 40
                                        , marginTop: 4, marginBottom: 15
                                        , textAlignVertical: 'top', color: '#666666'
                                        , fontSize: 15
                                    }}
                                    onChangeText={text => {
                                        let commitList = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                        commitList[index].Remark = text;
                                        this.setState({ stateDatas: commitList })
                                    }}
                                >
                                    {`${SentencedToEmpty(item, ['Remark'], '')}`}
                                </TextInput>
                            </View>
                            {/* 4 */}
                        </View>);
                    })}
                    {this.isEdit() ? <View style={[{ backgroundColor: 'white' }]}>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 38, marginLeft: 19
                                , height: 1, backgroundColor: '#EAEAEA'
                            }]}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                datas.push({
                                    pointList: [],// 监测点列表
                                    EntId: "",
                                    EntName: "",
                                    PointId: "",
                                    PointName: "",
                                    FileId: new Date().getTime(),
                                    Remark: "",
                                    ImageArray: []
                                });
                                this.setState({
                                    stateDatas: datas
                                });
                            }}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH, height: 43
                                    , justifyContent: 'center', alignItems: 'center'
                                    , flexDirection: 'row', backgroundColor: 'white'
                                }]}
                            >
                                <Image
                                    style={[{
                                        height: 12, width: 12
                                        , tintColor: '#4DA9FF'
                                        , marginRight: 2
                                    }]}
                                    source={require('../../../images/jiarecord.png')}
                                />
                                <Text style={[{
                                    color: '#4DA9FF', fontSize: 15
                                }]}>{'添加条目'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null}

                </ScrollView>
                {
                    !this.isEdit() ? null : SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1
                        ? <View
                            style={[{
                                width: SCREEN_WIDTH, height: 84
                                , flexDirection: 'row', paddingHorizontal: 10
                                , paddingVertical: 20, justifyContent: 'space-between'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.refs.deleteFormAlert.show();
                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 30) / 2, height: 44
                                        , borderRadius: 2, justifyContent: 'center'
                                        , alignItems: 'center', backgroundColor: '#FFA500'
                                    }]}
                                >
                                    <Text style={[{
                                        fontSize: 17, color: '#FEFEFE'
                                    }]}>{'删除'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    const paramsCheckResult = this.checkParams();
                                    if (paramsCheckResult.checkStatus) {
                                        this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                                            params: paramsCheckResult.params
                                        }));
                                    }
                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 30) / 2, height: 44
                                        , borderRadius: 2, justifyContent: 'center'
                                        , alignItems: 'center', backgroundColor: '#4DA9FF'
                                    }]}
                                >
                                    <Text style={[{
                                        fontSize: 17, color: '#FEFEFE'
                                    }]}>{'提交'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        : <TouchableOpacity
                            onPress={() => {
                                const paramsCheckResult = this.checkParams();
                                if (paramsCheckResult.checkStatus) {
                                    this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                                        params: paramsCheckResult.params
                                    }));
                                }
                                /**
                                 * [
                                        {
                                        "id": "string",
                                        "mainId": this.props.dispatchId,
                                        "PointId": "string",
                                        "fileId": this.state.TimeS,
                                        "remark": this.state.remark,
                                        "serviceId": serviceId,
                                        "recordId": recordId
                                        }
                                    ]
                                 */
                            }}
                            style={[{
                                marginHorizontal: 10, marginBottom: 20
                                , marginTop: 10
                            }]}
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
                }
            </View>
            <AlertDialog options={alertDeleteFormOptions} ref="deleteFormAlert" />
            <AlertDialog options={alertDeleteItemOptions} ref="deleteItemAlert" />
            {
                this.renderLoadingComponent()
            }
        </StatusPage>)
    }
}
