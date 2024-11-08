/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-09-20 14:55:47
 * @LastEditTime: 2024-11-01 16:18:37
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationPicItemEditor.js
 */
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../components';
import ImageGrid from '../../../components/form/images/ImageGrid';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';

@connect(({ CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
}))
export default class EquipmentInstallationPicItemEditor extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '安装照片'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            InstallationPhoto: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'InstallationPhoto'], new Date().getTime()),
            // InstallationPhoto: this.getImageUUid(),
            Remark: '',
            images: [],
            nativeStatus: 200,
            // normal  delete
            callbackType: 'normal',
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '跳转时未提供标题信息')
        });
    }

    // getImageUUid = () => {
    //     const params = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {});
    //     if (params.item.uploadStatus == 0) {
    //         return new Date().getTime()+params.item.ChildID;
    //     } else {
    //         return SentencedToEmpty(params, [ 'item', 'InstallationPhoto'], new Date().getTime())
    //     }
    // }

    componentDidMount() {
        let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        let newImages = [];
        SentencedToEmpty(params, ['item', 'InstallationPhotoList', 'ImgList'], []).map(Image => {
            newImages.push({
                AttachID: Image.split('/')[Image.split('/').length - 1],
                url: Image
            });
        });
        this.setState({ callbackType: 'normal', images: newImages, callbackImages: SentencedToEmpty(params, ['item', 'InstallationPhotoList', 'ImgList'], []), Remark: SentencedToEmpty(params, ['item', 'Remark'], '') });
    }

    canDelete = () => {
        // 1 已上传     2 待上传    其他 未上传
        let item = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        if (item.uploadStatus == 1) {
            return { able: true, _type: 1 };
        } else if (item.uploadStatus == 2) {
            return { able: true, _type: 2 };
        } else {
            return { able: false };
        }
    }

    componentWillUnmount() {
        let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        let callbackData = { ...params.item };
        callbackData.InstallationPhoto = this.state.InstallationPhoto;
        if (SentencedToEmpty(this.state, ['callbackImages'], []).length > 0) {
            if ('InstallationPhotoList' in params.item) {
                callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
            } else {
                callbackData.InstallationPhotoList = {};
                callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
            }
            if (params.item.uploadStatus == 0) {
                params.callback({ ...callbackData, Remark: this.state.Remark, uploadStatus: 2 });
            } else {
                params.callback({ ...callbackData, Remark: this.state.Remark });
            }
        } else {
            if ('InstallationPhotoList' in params.item) {
                callbackData.InstallationPhotoList.ImgList = [];
            } else {
                callbackData.InstallationPhotoList = {};
                callbackData.InstallationPhotoList.ImgList = [];
            }
            if (SentencedToEmpty(this.state, ['callbackType'], 'normal') == 'normal') {
                params.callback({ ...callbackData, Remark: this.state.Remark, uploadStatus: 0 });
            } else if (SentencedToEmpty(this.state, ['callbackType'], 'normal') == 'delete') {
                const { deleteCallback } = params;
                deleteCallback({ ...callbackData, Remark: this.state.Remark, uploadStatus: 0 });
            }
        }
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        const params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        const { origin = 'task' } = params;
        if (origin == 'audit') {
            return true;
        } else if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    renderSingleButton = () => {
        return (<TouchableOpacity
            onPress={() => {
                if (SentencedToEmpty(this.state, ['callbackImages'], []).length == 0) {
                    ShowToast('照片是必传信息！');
                    return;
                }
                let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
                // 0 未上传 1 已上传 2 待上传
                // params.callback({ ...params.item, Remark: this.state.Remark, uploadStatus: 0 });
                let callbackData = { ...params.item };
                if ('InstallationPhotoList' in params.item) {
                    callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
                } else {
                    callbackData.InstallationPhotoList = {};
                    callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
                }
                if (params.item.uploadStatus == 0) {
                    //'InstallationPhotoList', 'ImgList'
                    // params.callback({ ...params.item, Remark: this.state.Remark, uploadStatus: 2 });
                    params.callback({ ...callbackData, Remark: this.state.Remark, uploadStatus: 2 });
                } else {
                    // params.callback({ ...params.item, Remark: this.state.Remark });
                    params.callback({ ...callbackData, Remark: this.state.Remark });
                }
                this.props.navigation.goBack();
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
        </TouchableOpacity>);
    }

    renderDoubleButton = () => {
        return (<View
            style={[{
                width: SCREEN_WIDTH, flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
            }]}
        >
            <TouchableOpacity
                onPress={() => {
                    const deleteState = this.canDelete();
                    let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});

                    if (deleteState._type == 1
                        || (deleteState._type == 2 && !SentencedToEmpty(params, ['item', 'newImageItem'], false))
                    ) {
                        // 1已提交，接口删除
                        const that = this;
                        this.setState({
                            InstallationPhoto: new Date().getTime()
                            , callbackImages: []
                            , Remark: ''
                            , callbackType: 'delete'
                        }, () => {
                            that.props.navigation.goBack();
                        });
                        // this.props.dispatch(createAction('CTInstallationPhotosModel/deleteInstallationPhotosChildByID')({
                        //     params: { id: params.item.ID },
                        // }));
                    } else if (deleteState._type == 2 && SentencedToEmpty(params, ['item', 'newImageItem'], false)) {
                        // 2待提交，本地删除   
                        const that = this;
                        this.setState({
                            InstallationPhoto: new Date().getTime()
                            , callbackImages: []
                            , Remark: ''
                        }, () => {
                            that.props.navigation.goBack();
                        });
                        // let callbackData = { ...params.item };
                        // callbackData.InstallationPhoto = new Date();
                        // if ('InstallationPhotoList' in params.item) {
                        //     callbackData.InstallationPhotoList.ImgList = [];
                        // } else {
                        //     callbackData.InstallationPhotoList = {};
                        //     callbackData.InstallationPhotoList.ImgList = [];
                        // }
                        // params.callback({ ...callbackData, Remark: '', uploadStatus: 0 });
                        // this.props.navigation.goBack();
                    }
                }}
            >
                <View
                    style={[
                        {
                            width: (SCREEN_WIDTH - 30) / 2,
                            height: 44,
                            borderRadius: 2,
                            backgroundColor: '#FFA500',
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
                        {'删除'}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    if (SentencedToEmpty(this.state, ['callbackImages'], []).length == 0) {
                        ShowToast('照片是必传信息！');
                        return;
                    }
                    let params = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
                    // 0 未上传 1 已上传 2 待上传
                    // params.callback({ ...params.item, Remark: this.state.Remark, uploadStatus: 0 });
                    let callbackData = { ...params.item };
                    if ('InstallationPhotoList' in params.item) {
                        callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
                    } else {
                        callbackData.InstallationPhotoList = {};
                        callbackData.InstallationPhotoList.ImgList = this.state.callbackImages;
                    }
                    if (params.item.uploadStatus == 0) {
                        //'InstallationPhotoList', 'ImgList'
                        // params.callback({ ...params.item, Remark: this.state.Remark, uploadStatus: 2 });
                        params.callback({ ...callbackData, Remark: this.state.Remark, uploadStatus: 2 });
                    } else {
                        // params.callback({ ...params.item, Remark: this.state.Remark });
                        params.callback({ ...callbackData, Remark: this.state.Remark });
                    }
                    this.props.navigation.goBack();
                }}
            >
                <View
                    style={[
                        {
                            width: (SCREEN_WIDTH - 30) / 2,
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
        </View>);
    }

    render() {
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
                                    UUID={this.state.InstallationPhoto}
                                    uploadCallback={(items = []) => {
                                        let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                        let newCallbackImages = SentencedToEmpty(this.state, ['callbackImages'], [])
                                        // newCallbackImages.push(items[0].url);
                                        // newCallbackImages.push(items[0].AttachID);
                                        items.map((item, index) => {
                                            newCallbackImages.push(item.AttachID);
                                        });
                                        this.setState({
                                            images: newImages
                                            , callbackImages: newCallbackImages
                                        });
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

                {this.isEdit() ? this.canDelete().able ?
                    this.renderDoubleButton()
                    : this.renderSingleButton() : null}
            </View>
        );
    }
}
