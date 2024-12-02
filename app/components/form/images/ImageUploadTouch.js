import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions, View, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { ShowToast, ShowLoadingToast, CloseToast, createAction, NavigationActions } from '../../../utils';
import { DeviceEventEmitter } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import OperationAlertDialog from '../../modal/OperationAlertDialog';
import { pressentController, CameraWaterMaskModule } from 'react-native-camera-water-mask';
// import {
//     OfflineImageUploadModule, saveImageToLocal, offlineLaunchCamera, checkPermission
//     , test1, test2, offlineLaunchImageLibrary
// } from 'react-native-offline-image-upload';
import { getToken } from '../../../dvapack/storage';
const { width, height } = Dimensions.get('window');
let that;
const options = {
    mediaType: 'photo',
    // title: '选择照片',
    // cancelButtonTitle: '关闭',
    // takePhotoButtonTitle: '打开相机',
    // chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    selectionLimit: 5,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

const iosOptions = { imageCount: 15 };
@connect()
export default class ImageUploadTouch extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        that = this;
    }
    componentDidMount() { }

    uploadImageCallBack = (img, isSuccess, type = 'online') => {
        console.log('上传图片回调', img, isSuccess);
        CloseToast();
        console.log('isSuccess = ', isSuccess);
        if (isSuccess) {
            console.log('isSuccess2 = ', isSuccess);
            this.props.callback(img, type);
            if (type == 'online') {
                ShowToast({
                    message: '上传成功',
                    alertType: 'success',
                });
                // MessageBarManager.showAlert({
                //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
                //     alertType: 'success',
                // })

            } else if (type == 'offline') {
                ShowToast({
                    message: '离线保存成功',
                    alertType: 'error',
                });
                // MessageBarManager.showAlert({
                //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
                //     alertType: 'error',
                // })
            }
        } else {
            let logObject = {};
            logObject.result = img;
            this.props.dispatch(createAction('app/addClockInLog')({
                //提交异常日志
                msg: `${JSON.stringify(logObject)}`
            }));
            if (type == 'online') {
                ShowToast('上传失败！');
            } else if (type == 'offline') {
                ShowToast('离线保存失败');
            }
        }
        this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
        return;
    };

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
                const { componentType } = this.props;
                const _this = this;
                if (componentType == 'normal') {
                    _this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'WaterMaskCamera',
                            params: {
                                // uuid
                                uuid: _this.props.uuid,
                                picType: 'normal', // 普通图片 不传就是水印相机
                                callback: this.uploadImageCallBack
                            }
                        })
                    );
                } else if (componentType == 'taskhandle') {
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
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    requestPermission = async () => {
        console.log('SyanImagePicker = ', SyanImagePicker);
        SyanImagePicker.checkPermisson({}, (res) => {
            console.log('res = ', res);
            const { hasPermission } = res;
            if (hasPermission) {
                // SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
                //     if (err) {
                //         // 取消选择
                //         return;
                //     }

                //     if (selectedPhotos.length <= 0) {
                //         return;
                //     } else {
                //         ShowLoadingToast('正在上传图片');
                //         that.props.dispatch(
                //             createAction('imageModel/uploadimage')({
                //                 images: selectedPhotos,
                //                 uuid: uuid,
                //                 callback: this.uploadImageCallBack
                //             })
                //         );
                //     }
                // });
            }
        })
        // try {
        //     const granted = await PermissionsAndroid.request(
        //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //         {
        //             title: '申请读写手机存储权限',
        //             message:
        //                 '一个很牛逼的应用想借用你的摄像头，' +
        //                 '然后你就可以拍出酷炫的皂片啦。',
        //             buttonNeutral: '等会再问我',
        //             buttonNegative: '不行',
        //             buttonPositive: '好吧',
        //         },
        //     );
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //         // console.log('现在你获得摄像头权限了');
        //         SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
        //             if (err) {
        //                 // 取消选择
        //                 return;
        //             }

        //             if (selectedPhotos.length <= 0) {
        //                 return;
        //             } else {
        //                 ShowLoadingToast('正在上传图片');
        //                 that.props.dispatch(
        //                     createAction('imageModel/uploadimage')({
        //                         images: selectedPhotos,
        //                         uuid: uuid,
        //                         callback: this.uploadImageCallBack
        //                     })
        //                 );
        //             }
        //         });
        //     } else {
        //         // console.log('用户并不给你');
        //         ShowToast({
        //             message: '您拒绝了权限申请，无法使用该功能',
        //             alertType: 'success',
        //         });
        //     }
        // } catch (err) {
        //     console.warn(err);
        // }
    };

    render() {
        const { hasOffline = false, interfaceName = '', style, children, uploadMethods, uuid, delegate, onPress = () => { }, componentType, extraInfo } = this.props;
        const user = getToken();
        let dialogOptions = {
            headTitle: '选择照片',
            messText: null,
            buttonDirection: hasOffline ? 'column' : 'row',
            innersHeight: 100,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: hasOffline ? [
                {
                    txt: '拍照离线保存',
                    btnStyle: { backgroundColor: '#fff', height: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        const _this = this;
                        if (componentType == 'taskhandle' || componentType == 'signIn') {
                            CameraWaterMaskModule.checkPermission(function (args) {
                                if (args) {
                                    if (componentType == 'taskhandle') {
                                        _this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'WaterMaskCamera',
                                                params: {
                                                    uuid: _this.props.uuid,
                                                    saveType: 'offline',
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
                                                    uuid: _this.props.uuid,
                                                    saveType: 'offline',
                                                    callback: _this.uploadImageCallBack
                                                }
                                            })
                                        );
                                    }

                                }
                            });
                        } else {
                            launchCamera(options, response => {
                                const { assets = [] } = response;
                                let imageObj = null;
                                if (assets.length <= 0) {
                                    return;
                                } else {
                                    imageObj = assets[0];
                                    ShowLoadingToast('正在上传图片');
                                    that.props.dispatch(
                                        createAction('imageModel/uploadimage')({
                                            image: imageObj,
                                            images: assets,
                                            uuid: this.props.uuid,
                                            callback: this.uploadImageCallBack
                                        })
                                    );
                                }
                            });
                        }
                    }
                },
                {
                    txt: '相册离线保存',
                    // btnStyle: { backgroundColor: '#fff' },
                    btnStyle: { backgroundColor: '#fff', height: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        // offlineLaunchImageLibrary(
                        //     {
                        //         ...options
                        //         , ...{
                        //             uuid: uuid,
                        //             imageFrom: 5, // OTHER
                        //             userName: user.UserName,//.UserAccount,
                        //             userId: user.UserId,
                        //         }
                        //     }
                        //     , response => {
                        //         console.log('response = ', response);
                        //         const { assets = [] } = response;
                        //         this.uploadImageCallBack(assets, true, "offline");

                        //         let imageObj = null;
                        //         if (assets.length <= 0) {
                        //             return;
                        //         } else {
                        //             imageObj = assets[0];
                        //             // saveImageToLocal({ url: assets[0].uri }, response => { })
                        //         }
                        //     });
                    }
                    // launchImageLibrary(options, response => {
                    //     const { assets = [] } = response;
                    //     let imageObj = null;
                    //     if (assets.length <= 0) {
                    //         return;
                    //     } else {
                    //         imageObj = assets[0];
                    //         ShowLoadingToast('正在上传图片');
                    //         that.props.dispatch(
                    //             createAction('imageModel/uploadimage')({
                    //                 image: imageObj,
                    //                 images: assets,
                    //                 // uuid: uuid,
                    //                 uuid: this.props.uuid,
                    //                 callback: this.uploadImageCallBack
                    //             })
                    //         );
                    //     }
                    // });
                },
                {
                    txt: '打开相机',
                    btnStyle: { backgroundColor: '#fff', height: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
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
                                launchCamera(options, response => {
                                    const { assets = [] } = response;
                                    let imageObj = null;
                                    if (assets.length <= 0) {
                                        return;
                                    } else {
                                        imageObj = assets[0];
                                        ShowLoadingToast('正在上传图片');
                                        // this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                        that.props.dispatch(
                                            createAction('imageModel/uploadimage')({
                                                image: imageObj,
                                                images: assets,
                                                // uuid: uuid,
                                                uuid: this.props.uuid,
                                                callback: this.uploadImageCallBack
                                            })
                                        );
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    txt: '选择照片',
                    // btnStyle: { backgroundColor: '#fff' },
                    btnStyle: { backgroundColor: '#fff', height: 40, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        launchImageLibrary(options, response => {
                            const { assets = [] } = response;
                            let imageObj = null;
                            if (assets.length <= 0) {
                                return;
                            } else {
                                imageObj = assets[0];
                                ShowLoadingToast('正在上传图片');
                                that.props.dispatch(
                                    createAction('imageModel/uploadimage')({
                                        image: imageObj,
                                        images: assets,
                                        // uuid: uuid,
                                        uuid: this.props.uuid,
                                        callback: this.uploadImageCallBack
                                    })
                                );
                                // that.props.dispatch(
                                //     createAction('imageModel/uploadimage_test')({
                                //         image: imageObj,
                                //         images: assets,
                                //         uuid: uuid,
                                //         callback: this.uploadImageCallBack
                                //     })
                                // );
                            }
                        });
                    }
                }
            ] : [
                {
                    txt: '打开相机',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        {
                            // const _this = this;
                            if (componentType == 'taskhandle' || componentType == 'signIn'
                                // || componentType == 'normal'
                            ) {
                                this.requestCameraPermission();
                                //     CameraWaterMaskModule.checkPermission(function (args) {
                                //         console.log('checkPermission:', args);
                                //         if (args) {
                                //             // setShowState(true);
                                //             if (componentType == 'taskhandle') {
                                //                 _this.props.dispatch(
                                //                     NavigationActions.navigate({
                                //                         routeName: 'WaterMaskCamera',
                                //                         params: {
                                //                             // uuid
                                //                             uuid: _this.props.uuid,
                                //                         }
                                //                     })
                                //                 );
                                //             } else if (componentType == 'signIn') {
                                //                 _this.props.dispatch(
                                //                     createAction('taskDetailModel/updateState')({
                                //                         taskDetail: { EnterpriseName: _this.props.extraInfo.EnterpriseName }
                                //                     })
                                //                 );
                                //                 _this.props.dispatch(
                                //                     NavigationActions.navigate({
                                //                         routeName: 'WaterMaskCamera',
                                //                         params: {
                                //                             // uuid
                                //                             uuid: _this.props.uuid,
                                //                             callback: _this.uploadImageCallBack
                                //                         }
                                //                     })
                                //                 );
                                //             }

                                //         } else {
                                //             // ToastAndroid.show('请先开启相机权限', ToastAndroid.SHORT);
                                //             console.log('请先开启相机权限');
                                //         }
                                //     });

                                //     // this.props.dispatch(NavigationActions.navigate({ routeName: 'WaterMaskCamera' }));
                            } else {
                                launchCamera(options, response => {
                                    const { assets = [] } = response;
                                    let imageObj = null;
                                    if (assets.length <= 0) {
                                        return;
                                    } else {
                                        imageObj = assets[0];
                                        ShowLoadingToast('正在上传图片');
                                        // this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                        that.props.dispatch(
                                            createAction('imageModel/uploadimage')({
                                                image: imageObj,
                                                images: assets,
                                                // uuid: uuid,
                                                uuid: this.props.uuid,
                                                callback: this.uploadImageCallBack
                                            })
                                        );
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    txt: '选择照片',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        // this.requestPermission();
                        SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
                            if (err) {
                                // 取消选择
                                return;
                            }

                            if (selectedPhotos.length <= 0) {
                                return;
                            } else {
                                ShowLoadingToast('正在上传图片');
                                that.props.dispatch(
                                    createAction('imageModel/uploadimage')({
                                        images: selectedPhotos,
                                        uuid: this.props.uuid,
                                        callback: this.uploadImageCallBack
                                    })
                                );
                            }
                        });

                        // launchImageLibrary(options, response => {
                        //     console.log('response = ', response);
                        //     const { assets = [] } = response;
                        //     let imageObj = null;
                        //     if (assets.length <= 0) {
                        //         return;
                        //     } else {
                        //         imageObj = assets[0];
                        //         ShowLoadingToast('正在上传图片');
                        //         that.props.dispatch(
                        //             createAction('imageModel/uploadimage')({
                        //                 image: imageObj,
                        //                 images: assets,
                        //                 // uuid: uuid,
                        //                 uuid: this.props.uuid,
                        //                 callback: this.uploadImageCallBack
                        //             })
                        //         );
                        //     }
                        // });
                    }
                }
            ]
        };
        return (
            <View>
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
                                                        uuid: this.props.uuid,
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
                                                            uuid: this.props.uuid,
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
                                                uuid: this.props.uuid,
                                                callback: this.uploadImageCallBack
                                            })
                                        );
                                    }
                                });
                            }

                            return;
                        }
                        // 下面是Android逻辑
                        if (componentType == 'taskhandle' || componentType == 'signIn') {
                            this.refs.doAlert.show();
                        } else {
                            SyanImagePicker.showImagePicker(iosOptions, (err, selectedPhotos) => {
                                if (err) {
                                    // 取消选择
                                    return;
                                }

                                if (selectedPhotos.length <= 0) {
                                    return;
                                } else {
                                    ShowLoadingToast('正在上传图片');
                                    that.props.dispatch(
                                        createAction('imageModel/uploadimage')({
                                            images: selectedPhotos,
                                            uuid: this.props.uuid,
                                            callback: this.uploadImageCallBack
                                        })
                                    );
                                }
                            });
                        }
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
