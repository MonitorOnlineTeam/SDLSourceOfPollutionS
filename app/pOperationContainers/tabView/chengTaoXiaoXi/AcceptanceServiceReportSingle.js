/*
 * @Description: 验收服务报告
 * @LastEditors: hxf
 * @Date: 2023-09-18 09:27:53
 * @LastEditTime: 2024-05-07 15:52:30
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/AcceptanceServiceReportSingle.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../components';
import ImageGrid from '../../../components/form/images/ImageGrid';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';

@connect(({ CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    acceptanceServiceRecordResult: CTModel.acceptanceServiceRecordResult,
    addAcceptanceServiceRecordResult: CTModel.addAcceptanceServiceRecordResult,
    deleteAcceptanceServiceRecordResult: CTModel.deleteAcceptanceServiceRecordResult,
}))
export default class AcceptanceServiceReportSingle extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '验收服务报告',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            TimeS: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AttachmentId'], new Date().getTime()),
            remark: '',
            images: [],
            nativeStatus: 200
        };
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTModel/updateState')({
                acceptanceServiceRecordResult: { status: -1 }
            })
        );
        this.onRefresh();
    }

    onRefresh = () => {
        if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
            this.setState({
                nativeStatus: -1
            });
            const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            this.props.dispatch(createAction('CTModel/getAcceptanceServiceRecord')({
                params: {
                    "mainId": this.props.dispatchId,
                    "serviceId": serviceId,
                    "recordId": recordId,
                }
                , callback: (result) => {
                    const data = SentencedToEmpty(result, ['data', 'Datas', 0], {});
                    let newImages = [];
                    SentencedToEmpty(data, ['FileList', 'ImgList'], []).map((item, index) => {
                        newImages.push(
                            { AttachID: SentencedToEmpty(data, ['FileList', 'ImgNameList', index], ''), url: item }
                        );
                    })
                    this.setState({
                        TimeS: SentencedToEmpty(data, ['FileId'], new Date().getTime()),
                        remark: SentencedToEmpty(data, ['Remark'], ''),
                        images: newImages,
                        nativeStatus: 200
                    }, () => {
                        this.props.dispatch(createAction('CTModel/updateState')({
                            acceptanceServiceRecordResult: result
                        }))
                    });
                }
            }));
        } else {
            this.setState({
                nativeStatus: 200
            });
        }
    }


    cancelButton = () => { }
    confirm = () => {
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

    checkParams = () => {
        if (SentencedToEmpty(this.state, ['images'], []).length > 0) {
            return true;
        } else {
            ShowToast('验收服务报告照片为必填项');
            return false;
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
        let alertOptions = {
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
                    onpress: this.confirm
                }
            ]
        };
        return (<StatusPage
            status={SentencedToEmpty(this.props
                , ['acceptanceServiceRecordResult', 'status'], 1000)}
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
                width: SCREEN_WIDTH, flex: 1
            }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View
                        style={[{
                            width: SCREEN_WIDTH
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH, minHeight: 154
                                , backgroundColor: 'white'
                            }]}
                        >
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH, flexDirection: 'row'
                                , paddingHorizontal: 19, alignItems: 'center'
                            }]}>
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text>{'验收服务报告照片'}</Text>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 38, marginLeft: 19
                                    , height: 1, backgroundColor: '#EAEAEA'
                                }]}
                            />
                            <View style={[{
                                width: SCREEN_WIDTH
                            }]}>
                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'netCore'}
                                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    Imgs={SentencedToEmpty(this.state
                                        , ['images']
                                        , []
                                    )}
                                    UUID={this.state.TimeS}
                                    uploadCallback={items => {
                                        let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                        this.setState({
                                            images: newImages
                                        });
                                    }}
                                    delCallback={index => {
                                        let newImages = [].concat(SentencedToEmpty(this.state, ['images'], []));
                                        newImages.splice(index, 1);
                                        this.setState({
                                            images: newImages
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH, minHeight: 107
                            , marginTop: 5, backgroundColor: 'white'
                        }]}>
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH
                                , paddingHorizontal: 19, justifyContent: 'center'
                            }]}>
                                <Text>{'备注'}</Text>
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
                                onChangeText={text => this.setState({ remark: text })}
                            >
                                {`${this.state.remark}`}
                            </TextInput>
                        </View>
                    </View>
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
                                    this.refs.doAlert.show();
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
                                    if (this.checkParams()) {
                                        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                                        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                                        this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                                            params: {
                                                "mainId": this.props.dispatchId,
                                                "serviceId": serviceId,
                                                "recordId": recordId,
                                                "cList": [
                                                    {
                                                        // "id": "string",
                                                        "mainId": this.props.dispatchId,
                                                        // "pointId": "string",
                                                        "fileId": this.state.TimeS,
                                                        "remark": this.state.remark,
                                                        "serviceId": serviceId,
                                                        "recordId": recordId
                                                    }
                                                ]
                                            }
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
                                if (this.checkParams()) {
                                    const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                                    const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                                    this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                                        params: {
                                            "mainId": this.props.dispatchId,
                                            "serviceId": serviceId,
                                            "recordId": recordId,
                                            "cList": [
                                                {
                                                    // "id": "string",
                                                    "mainId": this.props.dispatchId,
                                                    // "pointId": "string",
                                                    "fileId": this.state.TimeS,
                                                    "remark": this.state.remark,
                                                    "serviceId": serviceId,
                                                    "recordId": recordId
                                                }
                                            ]
                                        }
                                    }));
                                }
                            }}
                        >
                            <View style={[{
                                width: SCREEN_WIDTH - 20, marginLeft: 10
                                , height: 44, borderRadius: 2
                                , backgroundColor: '#4DA9FF'
                                , justifyContent: 'center', alignItems: 'center'
                                , marginVertical: 20
                            }]}>
                                <Text style={[{
                                    fontSize: 17, color: '#FEFEFE'
                                }]}>{'提交'}</Text>
                            </View>
                        </TouchableOpacity>
                }
            </View>
            <AlertDialog options={alertOptions} ref="doAlert" />
            {SentencedToEmpty(this.props, ['addAcceptanceServiceRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'提交中'} /> : null}
            {SentencedToEmpty(this.props, ['deleteAcceptanceServiceRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'删除中'} /> : null}
        </StatusPage>
        )
    }
}
