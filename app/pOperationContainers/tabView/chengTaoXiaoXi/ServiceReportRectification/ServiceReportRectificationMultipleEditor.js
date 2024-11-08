/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-04-30 17:16:34
 * @LastEditTime: 2024-11-01 15:12:22
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationMultipleEditor.js
 */
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { AlertDialog, PickerTouchable, SimpleLoadingView, StatusPage } from '../../../../components';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { NavigationActions, SentencedToEmpty, ShowToast, createAction, createNavigationOptions } from '../../../../utils';
import ImageGrid from '../../../../components/form/images/ImageGrid';
import { connect } from 'react-redux';
import globalcolor from '../../../../config/globalcolor';

@connect(({ CTModel, CTServiceReportRectificationModel }) => ({
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult,
    addAcceptanceServiceRecordResult: CTModel.addAcceptanceServiceRecordResult,
    serviceDescResult: CTServiceReportRectificationModel.serviceDescResult,
    firstLevelSelectedIndex: CTServiceReportRectificationModel.firstLevelSelectedIndex,
    editData: CTServiceReportRectificationModel.editData,
}))
export default class ServiceReportRectificationMultipleEditor extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '验收服务报告 ',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        const incomeData = SentencedToEmpty(props
            , ['route', 'params', 'params', 'item'], []);
        incomeData.map((item, index) => {
            if (SentencedToEmpty(item, ['FileId'], '') == '') {
                item.FileId = new Date().getTime();
            }
        })
        this.state = {
            stateDatas: [].concat(incomeData)
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '服务报告整改'),
        });
    }

    componentDidMount() {
        this.onRefresh();
    }

    combinedData = (projectEntPointSysModelResult) => {
        const entList = SentencedToEmpty(projectEntPointSysModelResult, ['data', 'Datas'], [])
        const items = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'item'], [])
        items.map((item, index) => {
            entList.map((entItem, entIndex) => {
                if (item.EntId == entItem.EntId) {
                    item.pointList = entItem.PointList;
                }
            });
        })
        return items;
    }

    onRefresh = () => {
        const inParams = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        const recordId = SentencedToEmpty(inParams, ['item', 0, 'RecordId'], '');
        const serviceId = SentencedToEmpty(inParams, ['item', 0, 'ServiceId'], '');
        const mainId = SentencedToEmpty(inParams, ['item', 0, 'MainId'], '');
        const ProjectId = SentencedToEmpty(inParams, ['ProjectId'], '');

        // 需要参数projectId
        this.props.dispatch(createAction('CTModel/getProjectEntPointSysModel')({
            params: {
                "projectId": ProjectId,
            }
            , callback: (result) => {
                const stateDatas = this.combinedData(result);
                this.setState({
                    stateDatas,
                    entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                }, () => {
                    this.props.dispatch(createAction('CTModel/updateState')({
                        projectEntPointSysModelResult: result
                    }))
                });
                return true;
            }
        }));
    }

    getPageStatus = () => {
        return SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
    }

    isEdit = () => { return true; }

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

    getPointSelect = (index) => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            dataArr: SentencedToEmpty(this.state, ['stateDatas', index, 'pointList'], []),
            // dataArr: [],
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

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['addAcceptanceServiceRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />
        } else if (SentencedToEmpty(this.props, ['deleteAcceptanceServiceRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />
        } else {
            return null;
        }
    }

    cancelButton = () => { }
    confirmDeleteItem = () => {
        // 删除钱可能也需要参数校验
        const index = this.state.deleteItemIndex;
        let newData = SentencedToEmpty(this.state, ['stateDatas'], []).concat([]);
        newData.splice(index, 1);
        this.setState({
            stateDatas: newData
        });
    }
    confirmDeleteForm = () => { }

    checkParams = () => {
        let realCheckData = SentencedToEmpty(this.state, ['stateDatas'], []);
        if (realCheckData.length == 0) {
            ShowToast('表单数据不能为空！');
            return { checkStatus: false };
        }
        const params = SentencedToEmpty(this.props
            , ['route', 'params', 'params'], {}
        );
        const recordId = SentencedToEmpty(params, ['item', 0, 'RecordId'], '');
        const serviceId = SentencedToEmpty(params, ['item', 0, 'ServiceId'], '');
        let checkStatus = true;
        let cList = [], tempItem;
        realCheckData.map((item, index) => {
            tempItem = { ...item };
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
            // tempItem.fileId = SentencedToEmpty(tempItem
            //     , ['FileList', 'AttachID'], '')
            delete tempItem.FileList;
            // 服务端对首字母大小写不敏感
            // tempItem.mainId = item.MainId;
            // tempItem.serviceId = serviceId;
            // tempItem.recordId = recordId;
            cList.push(tempItem);
        });
        if (checkStatus) {
            const RecordId = SentencedToEmpty(cList, [0, 'RecordId'], '');
            const serviceId = SentencedToEmpty(cList, [0, 'ServiceId'], '');
            let params = {
                "mainId": SentencedToEmpty(cList, [0, 'MainId'], ''),
                "serviceId": serviceId,
                "RecordId": RecordId,
                cList
            }
            return { checkStatus: true, params };
        } else {
            return { checkStatus: false };
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
                // this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.onRefresh();
            }}
        >
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    {
                        SentencedToEmpty(this.state
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
                                                <Text style={[{ color: '#333333', fontSize: 13 }]}>{'删除'}</Text>
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
                                                        color: '#333333',
                                                        width: SCREEN_WIDTH - 150
                                                    }]}
                                                >{`${SentencedToEmpty(item, ['EntName'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../../../images/ic_arrows_right.png')} />
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
                                                <Text
                                                    numberOfLines={1}
                                                    style={[{
                                                        color: '#333333',
                                                        width: SCREEN_WIDTH - 150
                                                    }]}
                                                >{`${SentencedToEmpty(item, ['PointName'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../../../images/ic_arrows_right.png')} />
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
                                        // UUID={SentencedToEmpty(item
                                        //     , ['FileList', 'AttachID']
                                        //     , []
                                        // )}FileId
                                        UUID={SentencedToEmpty(item
                                            , ['FileId']
                                            , ''
                                        )}
                                        uploadCallback={items => {
                                            let commitList = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                            let tempImages = [].concat(SentencedToEmpty(commitList, [index, 'ImageObjectList'], []));
                                            let ImgNameList = [].concat(SentencedToEmpty(commitList, [index, 'FileList', 'ImgNameList'], []));
                                            items.map((item, index) => {
                                                ImgNameList.push(item.AttachID);
                                            })
                                            tempImages = tempImages.concat(items);
                                            commitList[index].ImageObjectList = tempImages;
                                            if (typeof commitList[index].FileList == 'undefined') {
                                                commitList[index].FileList = { ImgNameList: [] }
                                            }
                                            commitList[index].FileList.ImgNameList = [].concat(ImgNameList);
                                            this.setState({ stateDatas: commitList });
                                        }}
                                        delCallback={delImageIndex => {
                                            let commitList = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                            let ImgNameList = [].concat(SentencedToEmpty(commitList, [index, 'FileList', 'ImgNameList'], []));
                                            commitList[index].ImageObjectList.splice(delImageIndex, 1);
                                            ImgNameList.splice(delImageIndex, 1);
                                            commitList[index].FileList.ImgNameList = [].concat(ImgNameList);
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
                                    source={require('../../../../images/jiarecord.png')}
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
                                    // const paramsCheckResult = this.checkParams();
                                    // if (paramsCheckResult.checkStatus) {
                                    //     this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                                    //         params: paramsCheckResult.params
                                    //     }));
                                    // }
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
                                        params: paramsCheckResult.params,
                                        callback: () => {
                                            // 修改备注信息
                                            let newData = [].concat(this.props.editData);
                                            const firstItem = SentencedToEmpty(newData
                                                , [this.props.firstLevelSelectedIndex
                                                ], {});
                                            firstItem.ServiceList = [].concat(this.state.stateDatas);
                                            this.props.dispatch(NavigationActions.back());
                                            this.props.dispatch(createAction('CTServiceReportRectificationModel/updateState')({
                                                editData: newData
                                            }))
                                            return true;
                                        }
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