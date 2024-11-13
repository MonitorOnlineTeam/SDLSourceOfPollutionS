/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-09-20 14:55:47
 * @LastEditTime: 2024-11-11 13:46:36
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationEditor.js
 */
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../../components';
import ImageGrid from '../../../../components/form/images/ImageGrid';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../../utils';
import { UrlInfo } from '../../../../config';
import { getEncryptData } from '../../../../dvapack/storage';

// ServiceReportRectificationMultipleEditor

@connect(({ CTModel, CTServiceReportRectificationModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    addAcceptanceServiceRecordResult: CTModel.addAcceptanceServiceRecordResult,
    firstLevelSelectedIndex: CTServiceReportRectificationModel.firstLevelSelectedIndex,
    serviceDescResult: CTServiceReportRectificationModel.serviceDescResult,
}))
export default class ServiceReportRectificationEditor extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '服务报告整改'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            imageUUID: SentencedToEmpty(this.props
                , ['route', 'params', 'params', 'item', 'FileList', 'AttachID'], new Date().getTime()),
            Remark: SentencedToEmpty(props
                , ['route', 'params', 'params', 'item', 'Remark'], ''),
            images: [],
            nativeStatus: 200
        };
        // console.log('ServiceReportRectificationEditor constructor props = ', props);
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '服务报告整改'),
        });
    }

    componentDidMount() {
        const ProxyCode = getEncryptData();
        let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        let newImages = [];

        SentencedToEmpty(params, ['item', 'FileList', 'ImgNameList'], [])
            .map(Image => {
                newImages.push({
                    AttachID: Image,
                    url: `${UrlInfo.BaseUrl}api${ProxyCode}/${Image}`
                });
            });
        this.setState({ images: newImages, callbackImages: SentencedToEmpty(params, ['item', 'InstallationPhotoList', 'ImgList'], []), Remark: SentencedToEmpty(params, ['item', 'Remark'], '') });
    }

    componentWillUnmount() {

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
        console.log('props = ', this.props);
        return (
            <View
                style={[
                    {
                        width: SCREEN_WIDTH,
                        flex: 1
                    }
                ]}
            >
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    minHeight: 154,
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
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text style={[{ color: '#333333' }]}>{'照片'}</Text>
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
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH,
                                        minHeight: 36
                                    }
                                ]}
                            >
                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'netCore'}
                                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    Imgs={SentencedToEmpty(this.state, ['images'], [])}
                                    UUID={this.state.imageUUID}
                                    uploadCallback={(items = []) => {
                                        // 修改照片
                                        const firstItem = SentencedToEmpty(this.props
                                            , [
                                                'serviceDescResult', 'data', 'Datas'
                                                , 'ReportDesc', this.props.firstLevelSelectedIndex
                                            ], {});
                                        const metaData = SentencedToEmpty(firstItem, ['ServiceList', 0], {});
                                        console.log('metaData = ', metaData);
                                        let newImgNameList = SentencedToEmpty(metaData, ['FileList', 'ImgNameList'], []).concat([]);
                                        // 修改照片
                                        let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                        let newCallbackImages = SentencedToEmpty(this.state, ['callbackImages'], [])
                                        // newCallbackImages.push(items[0].url);
                                        // newCallbackImages.push(items[0].AttachID);
                                        items.map((item, index) => {
                                            newCallbackImages.push(item.AttachID);
                                            newImgNameList.push(item.AttachID);
                                        });
                                        this.setState({
                                            images: newImages
                                            , callbackImages: newCallbackImages
                                        });

                                        // 修改照片
                                        if (typeof metaData.FileList != 'undefined') {
                                            metaData.FileList.ImgNameList = newImgNameList;
                                            let newData = { ...this.props.serviceDescResult };
                                            newData.data.Datas.ReportDesc[this.props.firstLevelSelectedIndex].ServiceList[0] = metaData;
                                            this.props.dispatch(createAction('CTServiceReportRectificationModel/updateState')({
                                                serviceDescResult: newData
                                            }))
                                        }
                                    }}
                                    delCallback={index => {
                                        let newImages = [].concat(SentencedToEmpty(this.state, ['images'], []));
                                        let newCallbackImages = [].concat(SentencedToEmpty(this.state, ['callbackImages'], []));
                                        newImages.splice(index, 1);
                                        newCallbackImages.splice(index, 1);
                                        this.setState({
                                            images: newImages
                                            , callbackImages: newCallbackImages
                                        });

                                        // 修改照片
                                        const firstItem = SentencedToEmpty(this.props
                                            , [
                                                'serviceDescResult', 'data', 'Datas'
                                                , 'ReportDesc', this.props.firstLevelSelectedIndex
                                            ], {});
                                        const metaData = SentencedToEmpty(firstItem, ['ServiceList', 0], {});

                                        let newImgNameList = SentencedToEmpty(metaData, ['FileList', 'ImgNameList'], []).concat([]);
                                        newImgNameList.splice(index, 1);
                                        if (typeof metaData.FileList != 'undefined') {
                                            metaData.FileList.ImgNameList = newImgNameList;
                                            let newData = { ...this.props.serviceDescResult };
                                            newData.data.Datas.ReportDesc[this.props.firstLevelSelectedIndex].ServiceList[0] = metaData;
                                            this.props.dispatch(createAction('CTServiceReportRectificationModel/updateState')({
                                                serviceDescResult: newData
                                            }))
                                        }
                                    }}
                                />
                            </View>
                        </View>
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
                                <Text style={[{ color: '#333333' }]}>{'备注'}</Text>
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
                            <TextInput
                                editable={this.isEdit()}
                                multiline={true}
                                placeholder={this.isEdit() ? '请填写备注' : '未填写备注信息'}
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
                                onChangeText={text => this.setState({ Remark: text })}
                            >
                                {`${this.state.Remark}`}
                            </TextInput>
                        </View>
                    </View>
                </ScrollView>

                {this.isEdit() ? <TouchableOpacity
                    onPress={() => {
                        // ShowLoadingToast('提交中');
                        const serviceId = SentencedToEmpty
                            (this.props
                                , ['route', 'params'
                                    , 'params', 'item'
                                    , 'ServiceId'], '');
                        const recordId = SentencedToEmpty
                            (this.props
                                , ['route', 'params'
                                    , 'params', 'item'
                                    , 'RecordId'], '');
                        const mainId = SentencedToEmpty
                            (this.props
                                , ['route', 'params'
                                    , 'params', 'item'
                                    , 'MainId'], '');
                        let params = {
                            "mainId": mainId,
                            "serviceId": serviceId,
                            "recordId": recordId,
                            "cList": [
                                {
                                    "mainId": mainId,
                                    "fileId": this.state.imageUUID,
                                    "remark": this.state.Remark,
                                    "serviceId": serviceId,
                                    "recordId": recordId
                                }
                            ]
                        }



                        this.props.dispatch(createAction('CTModel/addAcceptanceServiceRecord')({
                            params: params,
                            callback: () => {
                                // 修改备注信息
                                const firstItem = SentencedToEmpty(this.props
                                    , [
                                        'serviceDescResult', 'data', 'Datas'
                                        , 'ReportDesc', this.props.firstLevelSelectedIndex
                                    ], {});
                                const metaData = SentencedToEmpty(firstItem, ['ServiceList', 0], {});
                                let imageNames = [];
                                this.state.images.map((item, index) => {
                                    imageNames.push(item.AttachID);
                                });
                                if (typeof metaData.FileList === 'undefined') {
                                    metaData.FileList = {
                                        AttachID: this.state.imageUUID,
                                        ImgNameList: imageNames
                                    }
                                } else {
                                    metaData.FileList.ImgNameList = imageNames;
                                }
                                metaData.Remark = this.state.Remark;
                                let newData = { ...this.props.serviceDescResult };
                                newData.data.Datas.ReportDesc[this.props.firstLevelSelectedIndex].ServiceList[0] = metaData;
                                this.props.dispatch(createAction('CTServiceReportRectificationModel/updateState')({
                                    serviceDescResult: newData,
                                    editData: newData.data.Datas.ReportDesc
                                }))
                                this.props.dispatch(NavigationActions.back());
                                return true;
                            }
                        }));
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
                </TouchableOpacity> : null}
                {SentencedToEmpty(this.props, ['addAcceptanceServiceRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'提交中'} /> : null}
            </View>
        );
    }
}
