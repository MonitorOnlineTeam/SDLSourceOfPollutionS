import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dimensions, View, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { ShowToast, ShowLoadingToast, CloseToast, createAction, NavigationActions } from '../../../utils';
import { DeviceEventEmitter } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import OperationAlertDialog from '../../modal/OperationAlertDialog';
import { pressentController, CameraWaterMaskModule } from 'react-native-camera-water-mask';
const { width, height } = Dimensions.get('window');
let that;
const options = {
    mediaType: 'photo',
    // title: '选择照片',
    // cancelButtonTitle: '关闭',
    // takePhotoButtonTitle: '打开相机',
    // chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    selectionLimit: 1,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const iosOptions = { imageCount: 1 };
@connect()
export default class ImageUploadTouchNetCore extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
        that = this;
    }
    componentDidMount() { }

    uploadImageCallBack = (img, isSuccess) => {
        // console.log('img = ',img);
        if (isSuccess) {
            this.props.callback(img);
            ShowToast('上传成功');
        } else {
            ShowToast('上传失败！');
        }
        this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
    };

    render() {
        const { interfaceName = 'netCore', style, children, uploadMethods, uuid, delegate, onPress = () => { }, componentType, extraInfo } = this.props;
        const dialogOptions = {
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
                            if (componentType == 'taskhandle') {
                                CameraWaterMaskModule.checkPermission(function (args) {
                                    if (args) {
                                        // setShowState(true);
                                        _this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'WaterMaskCamera',
                                                params: {
                                                    uuid
                                                }
                                            })
                                        );
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
                                        if (interfaceName == 'netCore') {
                                            that.props.dispatch(
                                                createAction('CTModel/uploadimage')({
                                                    image: imageObj,
                                                    images: assets,
                                                    uuid: uuid,
                                                    callback: this.uploadImageCallBack
                                                })
                                            );
                                        } else if (interfaceName == 'DataAnalyze') {
                                            that.props.dispatch(
                                                createAction('alarmAnaly/uploadimage')({
                                                    image: imageObj,
                                                    images: assets,
                                                    uuid: uuid,
                                                    callback: this.uploadImageCallBack
                                                })
                                            );
                                        }

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
                        launchImageLibrary(options, response => {
                            const { assets = [] } = response;
                            let imageObj = null;
                            if (assets.length <= 0) {
                                return;
                            } else {
                                imageObj = assets[0];
                                ShowLoadingToast('正在上传图片');
                                if (interfaceName == 'netCore') {
                                    that.props.dispatch(
                                        createAction('CTModel/uploadimage')({
                                            image: imageObj,
                                            images: assets,
                                            uuid: uuid,
                                            callback: this.uploadImageCallBack
                                        })
                                    );
                                } else if (interfaceName == 'DataAnalyze') {
                                    that.props.dispatch(
                                        createAction('alarmAnaly/uploadimage')({
                                            image: imageObj,
                                            images: assets,
                                            uuid: uuid,
                                            callback: this.uploadImageCallBack
                                        })
                                    );
                                }
                            }
                        });
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
                                                    createAction('CTModel/uploadimage')({
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
                                                        createAction('CTModel/uploadimage')({
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
                                        if (interfaceName == 'netCore') {
                                            that.props.dispatch(
                                                createAction('CTModel/uploadimage')({
                                                    image: selectedPhotos[0],
                                                    images: selectedPhotos,
                                                    uuid: uuid,
                                                    callback: this.uploadImageCallBack
                                                })
                                            );
                                        } else if (interfaceName == 'DataAnalyze') {
                                            that.props.dispatch(
                                                createAction('alarmAnaly/uploadimage')({
                                                    image: selectedPhotos[0],
                                                    images: selectedPhotos,
                                                    uuid: uuid,
                                                    callback: this.uploadImageCallBack
                                                })
                                            );
                                        }
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
