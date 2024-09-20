import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import { Image, Dimensions, View, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform, Text } from 'react-native';
import { ShowToast, ShowLoadingToast, CloseToast, createAction, NavigationActions } from '../../../utils';
import { DeviceEventEmitter } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import OperationAlertDialog from '../../modal/OperationAlertDialog';
import {
    OfflineImageUploadModule, saveImageToLocal, offlineLaunchCamera, checkPermission
    , test1, test2, offlineLaunchImageLibrary
} from 'react-native-offline-image-upload';
const { width, height } = Dimensions.get('window');
let that;
const options = {
    mediaType: 'photo',
    // title: '选择照片',
    // cancelButtonTitle: '关闭',
    // takePhotoButtonTitle: '打开相机',
    // chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    // videoQuality: 'high',
    selectionLimit: 5,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const iosOptions = {};
@connect()
export default class OfflineImageUploadTouch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            testIndex: 0,
        };
        that = this;
    }
    componentDidMount() { }

    uploadImageCallBack = (img, isSuccess) => {
        console.log('上传图片回调', img, isSuccess);
        if (isSuccess) {
            this.props.callback(img);
            ShowToast('上传成功');
        } else {
            ShowToast('上传失败！');
            // if (img == '') {
            //     ShowToast('上传失败！');
            // } else {
            //     ShowToast(img);
            // }
        }
        this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
        return;
    };

    takePhoto = () => {
        this.setState({ testIndex: this.state.testIndex + 1 }
            , () => {
                // offlineLaunchCamera(
                //     {
                //         ...options
                //         , ...{
                //             uuid: this.state.testIndex + '',
                //             imageFrom: 1,
                //             userName: 'SDLCS05',
                //             userId: 'SDLCS05',
                //         }
                //     }
                //     , response => {
                //         // launchCamera(options, response => {
                //         const { assets = [] } = response;
                //         let imageObj = null;
                //         if (assets.length <= 0) {
                //             return;
                //         } else {
                //             imageObj = assets[0];
                //             console.log('assets = ', assets);
                //             // console.log('OfflineImageUploadModule = ', OfflineImageUploadModule);
                //             // console.log('saveImageToLocal = ', saveImageToLocal);
                //             // saveImageToLocal({ url: assets[0].uri }, response => { })
                //         }
                //     });
            });
    }

    imagePikcerFun = () => {
        this.setState({ testIndex: this.state.testIndex + 1 }
            , () => {
                offlineLaunchImageLibrary(
                    {
                        ...options
                        , ...{
                            uuid: this.state.testIndex + '',
                            imageFrom: 1,
                            userName: 'SDLCS05',
                            userId: 'SDLCS05',
                        }
                    }
                    , response => {
                        const { assets = [] } = response;
                        let imageObj = null;
                        if (assets.length <= 0) {
                            return;
                        } else {
                            imageObj = assets[0];
                            // saveImageToLocal({ url: assets[0].uri }, response => { })
                        }
                    });
            }
        );

    }

    render() {
        const { interfaceName = '', style, children, uploadMethods, uuid, delegate, onPress = () => { }, componentType, extraInfo } = this.props;
        let dialogOptions = {
            headTitle: '选择照片',
            messText: null,
            innersHeight: 100,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '打开相机',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        {
                            const _this = this;
                            if (componentType == 'taskhandle' || componentType == 'signIn') {
                                CameraWaterMaskModule.checkPermission(function (args) {
                                    if (args) {
                                        // setShowState(true);
                                        if (componentType == 'taskhandle') {
                                            _this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'WaterMaskCamera',
                                                    params: {
                                                        // uuid
                                                        uuid: _this.props.uuid,
                                                    }
                                                })
                                            );
                                        } else if (componentType == 'signIn') {
                                            _this.props.dispatch(
                                                createAction('taskDetailModel/updateState')({
                                                    taskDetail: { EnterpriseName: _this.props.extraInfo.EnterpriseName }
                                                })
                                            );
                                            _this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'WaterMaskCamera',
                                                    params: {
                                                        // uuid
                                                        uuid: _this.props.uuid,
                                                        callback: _this.uploadImageCallBack
                                                    }
                                                })
                                            );
                                        }

                                    }
                                });

                                // this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterMaskCamera' }));
                            } else {
                                this.takePhoto();
                                // offlineLaunchCamera(options, response => {
                                //     // launchCamera(options, response => {
                                //     const { assets = [] } = response;
                                //     let imageObj = null;
                                //     if (assets.length <= 0) {
                                //         return;
                                //     } else {
                                //         imageObj = assets[0];
                                //         console.log('assets = ', assets);
                                //         console.log('OfflineImageUploadModule = ', OfflineImageUploadModule);
                                //         console.log('saveImageToLocal = ', saveImageToLocal);
                                //         saveImageToLocal({ url: assets[0].uri }, response => { })
                                //         // ShowLoadingToast('正在上传图片');
                                //         // this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                //         // that.props.dispatch(
                                //         //     createAction('imageModel/uploadimage')({
                                //         //         image: imageObj,
                                //         //         images: assets,
                                //         //         // uuid: uuid,
                                //         //         uuid: this.props.uuid,
                                //         //         callback: this.uploadImageCallBack
                                //         //     })
                                //         // );
                                //     }
                                // });
                            }
                        }
                    }
                },
                {
                    txt: '选择照片',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        this.imagePikcerFun();
                        // offlineLaunchImageLibrary(options, response => {
                        //     const { assets = [] } = response;
                        //     let imageObj = null;
                        //     if (assets.length <= 0) {
                        //         return;
                        //     } else {
                        //         imageObj = assets[0];
                        //         saveImageToLocal({ url: assets[0].uri }, response => { })
                        //         // ShowLoadingToast('正在上传图片');
                        //         // that.props.dispatch(
                        //         //     createAction('imageModel/uploadimage')({
                        //         //         image: imageObj,
                        //         //         images: assets,
                        //         //         // uuid: uuid,
                        //         //         uuid: this.props.uuid,
                        //         //         callback: this.uploadImageCallBack
                        //         //     })
                        //         // );
                        //         // that.props.dispatch(
                        //         //     createAction('imageModel/uploadimage_test')({
                        //         //         image: imageObj,
                        //         //         images: assets,
                        //         //         uuid: uuid,
                        //         //         callback: this.uploadImageCallBack
                        //         //     })
                        //         // );
                        //     }
                        // });
                    }
                }
            ]
        };
        return (
            <View>
                <Image
                    style={[{ width: 100, height: 100 }]}
                    source={{ uri: "file:///data/user/0/com.chsdlenterprise.intelligenceoperations/files/offlineImageDir/rn_image_picker_lib_temp_97fa5615-678f-4a43-aa69-c845a41122da.jpg" }}
                />
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('requestTestModel/getUserOpenID')({}));
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>getUserOpenID</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('requestTestModel/resetUserWechatInfo')({}));
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>resetUserWechatInfo</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('requestTestModel/testPushWeChatInfo')({}));
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>testPushWeChatInfo</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        test1({}, response => {

                        });
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>test1</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        test2({}, response => {

                        });
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>test2</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        checkPermission({}, response => {

                        });
                    }}
                >
                    <View style={[{
                        width: 100, height: 48, borderWidth: 1
                        , justifyContent: 'center', alignItems: 'center', borderColor: '#f97740'
                    }]}>
                        <Text>checkPermission</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onPress();
                        if (Platform.OS == 'ios') {
                            if (componentType == 'taskhandle') {
                                Alert.alert('请选择相片模式', '', [
                                    {
                                        text: '使用水印相机',
                                        onPress: () => {
                                            pressentController(extraInfo['EnterpriseName'] || '企业名称', extraInfo['PointName'] || '排口名称', img => {
                                                that.props.dispatch(
                                                    createAction('imageModel/uploadimage')({
                                                        images: [img],
                                                        uuid: uuid,
                                                        callback: this.uploadImageCallBack
                                                    })
                                                );
                                            });
                                        }
                                    },
                                    {
                                        text: '获取相册图片',
                                        onPress: () => {
                                            SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
                                                if (err) {
                                                    // 取消选择
                                                    return;
                                                }

                                                if (selectedPhotos.length <= 0) {
                                                    return;
                                                } else {
                                                    that.props.dispatch(
                                                        createAction('imageModel/uploadimage')({
                                                            images: selectedPhotos,
                                                            uuid: uuid,
                                                            callback: this.uploadImageCallBack
                                                        })
                                                    );
                                                }
                                            });
                                        }
                                    },
                                    {
                                        text: '取消',
                                        onPress: () => { },
                                        style: 'cancel'
                                    }
                                ]);
                            } else {
                                SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
                                    if (err) {
                                        // 取消选择
                                        return;
                                    }

                                    if (selectedPhotos.length <= 0) {
                                        return;
                                    } else {
                                        that.props.dispatch(
                                            createAction('imageModel/uploadimage')({
                                                images: selectedPhotos,
                                                uuid: uuid,
                                                callback: this.uploadImageCallBack
                                            })
                                        );
                                    }
                                });
                            }

                            return;
                        }
                        this.refs.doAlert.show();
                    }}
                    style={style}
                >
                    {children}
                </TouchableOpacity>
                <OperationAlertDialog options={dialogOptions} ref="doAlert" />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2',
        marginTop: 30
    },
    item: {
        flexDirection: 'row'
    }
});
