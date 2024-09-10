/*
 * @Description: 水印相机
 * @LastEditors: hxf
 * @Date: 2023-06-01 14:09:24
 * @LastEditTime: 2024-08-22 09:48:57
 * @FilePath: /SDLMainProject37/app/pOperationContainers/taskDetail/WaterMaskCamera.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, TouchableOpacity } from 'react-native'
import { CameraWaterMaskComponent, takePhoto, releaseView } from 'react-native-camera-water-mask';
import { saveWaterMaskImage } from 'react-native-offline-image-upload';

import { SCREEN_WIDTH } from '../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty, NavigationActions, createAction, ShowToast, ShowLoadingToast, CloseToast } from '../../utils';
import { connect } from 'react-redux';
import { getToken } from '../../dvapack/storage';
import moment from 'moment';

const options = {
    mediaType: 'photo',
    quality: 0.7,
    selectionLimit: 5,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

@connect(({ taskDetailModel }) => ({
    taskDetail: taskDetailModel.taskDetail,
}))
export default class WaterMaskCamera extends Component {
    static navigationOptions = createNavigationOptions({
        title: '水印相机',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            takingPhoto: false
        };
    }

    componentWillUnmount() {
        this.cameraView.sendCommand();
        releaseView();
    }

    uploadImageCallBack = (images, isSuccess) => {
        if (isSuccess) {
            // this.props.callback(img);
            const { taskDetail } = this.props;
            let newTaskDetail = { ...taskDetail };
            // let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgList'], []));
            let newImgList = [].concat(SentencedToEmpty(taskDetail, ['Attachments', 'ImgNameList'], []));
            images.map((imageItem) => {
                newImgList.push(imageItem.attachID)
            });
            let Attachments = SentencedToEmpty(taskDetail, ['Attachments'], {});
            Attachments.ImgNameList = newImgList;
            newTaskDetail.Attachments = Attachments;
            const navigationCallback = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'callback'], () => { return false; });
            const callbackHandle = navigationCallback(images, true, SentencedToEmpty(this.props
                , ['navigation', 'state', 'params', 'saveType'], 'online'
            ));
            if (!callbackHandle) {
                this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
            }
            this.props.dispatch(NavigationActions.back());
            ShowToast('上传成功');
        } else {
            if (images == '') {
                ShowToast('上传失败！');
            } else {
                // console.log('images', images);
                ShowToast(images);
            }

        }
        this.setState({
            takingPhoto: false
        });
        this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
    }

    render() {
        console.log('props = ', this.props);
        const saveType = SentencedToEmpty(this.props
            , ['navigation', 'state', 'params', 'saveType'], 'online'
        )
        console.log('saveType = ', saveType);
        // `${SentencedToEmpty(this.props.taskDetail, ['EnterpriseName'], '')}-${SentencedToEmpty(this.props.taskDetail, ['PointName'], '')}`
        // console.log('WaterMaskCamera EnterpriseName = '
        //     , SentencedToEmpty(this.props.taskDetail, ['EnterpriseName'], ''));
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <CameraWaterMaskComponent
                    ref={ref => this.cameraView = ref}
                    key='1'
                    style={[{ width: SCREEN_WIDTH, flex: 1 }]}
                    enterpriseName={SentencedToEmpty(this.props.taskDetail, ['EnterpriseName'], '')}
                    pointName={SentencedToEmpty(this.props.taskDetail, ['PointName'], '')}
                />
                <View style={[{
                    width: SCREEN_WIDTH, height: 96
                    , justifyContent: 'center', alignItems: 'center'
                }]}>
                    {
                        !this.state.takingPhoto
                            ? <TouchableOpacity
                                onPress={() => {
                                    let that = this;
                                    if (!this.state.takingPhoto) {
                                        this.setState({ takingPhoto: true }
                                            , () => {
                                                let uuid = this.props.navigation.state.params.uuid;
                                                takePhoto(options, response => {
                                                    const { assets = [] } = response;
                                                    let imageObj = null;
                                                    if (assets.length <= 0) {
                                                        if (SentencedToEmpty(response, ['errorCode'], '') == 9527) {
                                                            this.props.dispatch(NavigationActions.back());
                                                        }
                                                        return;
                                                    } else {
                                                        // 处理经纬度，保留6位小数
                                                        var regPos = /^[+-]?[0-9]+.?[0-9]*/;
                                                        const o_lat = response.str_lat;
                                                        const o_long = response.str_long;
                                                        let tempArr = [], tempTail = ''
                                                            , tail5, tail6, tail7;
                                                        let r_lat = o_lat;
                                                        let r_long = o_long;
                                                        if (regPos.test(o_lat)) {
                                                            if (o_lat.indexOf('.') != -1) {
                                                                tempArr = o_lat.split('.');
                                                                if (tempArr[1].length > 6) {
                                                                    tempTail = tempArr[1];
                                                                    tail5 = tempTail.slice(0, 5); // 不包含索引5，第六位
                                                                    tail6 = tempTail.slice(5, 6); // 
                                                                    tail7 = tempTail.slice(6, 7); // 
                                                                    if (tail7 >= 5) {
                                                                        tail6 = Number(tail6) + 1;
                                                                    }
                                                                    r_lat = tempArr[0] + '.' + tail5 + tail6;
                                                                } else {

                                                                }
                                                            }
                                                        }
                                                        if (regPos.test(o_long)) {
                                                            if (o_long.indexOf('.') != -1) {
                                                                tempArr = o_long.split('.');
                                                                if (tempArr[1].length > 6) {
                                                                    tempTail = tempArr[1];
                                                                    tail5 = tempTail.slice(0, 5); // 不包含索引5，第六位
                                                                    tail6 = tempTail.slice(5, 6); // 
                                                                    tail7 = tempTail.slice(6, 7); // 
                                                                    if (tail7 >= 5) {
                                                                        tail6 = Number(tail6) + 1;
                                                                    }
                                                                    r_long = tempArr[0] + '.' + tail5 + tail6;
                                                                } else {

                                                                }
                                                            }
                                                        }
                                                        // 处理经纬度
                                                        imageObj = assets[0];
                                                        ShowLoadingToast('正在上传图片');
                                                        if (saveType == 'offline') {
                                                            console.log('imageObj = ', imageObj);
                                                            setTimeout(() => {
                                                                const time = moment().format('YYYY-MM-DD HH:mm:ss');
                                                                const user = getToken();
                                                                saveWaterMaskImage({
                                                                    imageId: new Date().getTime() + '',
                                                                    uuid: uuid,
                                                                    urlstr: imageObj.uri,
                                                                    imageFrom: 6, // CT_SIGN_IN_WATER_MASK
                                                                    saveTime: time,
                                                                    saveTimel: new Date().getTime(),
                                                                    userName: user.UserName,
                                                                    userId: user.UserId,
                                                                    waterMaskEntName: response.EntName,
                                                                    waterMaskPointName: response.PointName,
                                                                    waterMaskAddress: response.RegionName,
                                                                    waterMaskLocation: `${r_long},${r_lat}`,
                                                                    signInTime: time,
                                                                }, response => {
                                                                    const { saveStatus, msg } = response;
                                                                    CloseToast();
                                                                    if (saveStatus) {
                                                                        this.uploadImageCallBack([{ uri: imageObj.uri }], true);
                                                                    }
                                                                });
                                                            }, 2000)
                                                        } else {
                                                            this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                                            that.props.dispatch(
                                                                createAction('imageModel/uploadimageWaterMask')({
                                                                    // createAction('imageModel/uploadimage')({
                                                                    image: imageObj,
                                                                    images: assets,
                                                                    uuid: uuid,
                                                                    imageParams: {
                                                                        EntName: response.EntName,
                                                                        PointName: response.PointName,
                                                                        RegionName: response.RegionName,
                                                                        str_lat: r_lat,
                                                                        str_long: r_long,
                                                                    },
                                                                    callback: this.uploadImageCallBack
                                                                })
                                                            );
                                                        }
                                                    }
                                                });
                                            }
                                        );
                                    }

                                }}
                            >
                                <View style={[{
                                    width: 72, height: 72
                                    , backgroundColor: 'red', borderWidth: 4
                                    , borderColor: 'white', borderRadius: 36
                                }]}>

                                </View>
                            </TouchableOpacity>
                            : <TouchableOpacity
                                onPress={() => {

                                }}
                            >
                                <View style={[{
                                    width: 72, height: 72
                                    , backgroundColor: 'red', borderWidth: 4
                                    , borderColor: 'white', borderRadius: 36
                                }]}>

                                </View>
                            </TouchableOpacity>
                    }

                </View>
            </View>
        )
    }
}
