//import liraries
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { getToken } from '../../../../dvapack/storage';
import { createAction, ShowToast, selectPic, SentencedToEmpty } from '../../../../utils';

const imageSize = (SCREEN_WIDTH - 12) / 4 - 16;
const enterpriseUser = 0;
const operationsStaff = 1;

const options = {
    title: '选择照片',
    cancelButtonTitle: '关闭',
    takePhotoButtonTitle: '打开相机',
    chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

@connect(({ taskModel }) => ({
    currentTask: taskModel.currentTask,
    Attachments: taskModel.Attachments
}))
class ImageViewPicker extends Component {
    constructor(props) {
        super(props);
        let user = getToken();
        this.state = {
            files: this.props.Attachments && this.props.Attachments.ThumbimgList ? this.props.Attachments.ThumbimgList : [],
            // files:[{},{},{},{},{},{},],
            sheets: [{}],
            doConfirm: false,
            willingAddForm: null,
            description: '',
            // RoleEnum:user.RoleEnum,
            User_ID: user.User_ID
        };
    }

    componentWillReceiveProps(nextProps) {
        let a = {};
        if (nextProps.Attachments) {
            if (nextProps.Attachments && nextProps.Attachments.ThumbimgList) {
                a.files = nextProps.Attachments.ThumbimgList;
            }
            this.setState(a);
        }
    }

    _deleteImage = item => {
        this.props.dispatch(
            createAction('taskModel/deleteImage')({
                attachID: item.imageId,
                callback: () => {
                    let _index = this.state.files.findIndex(_fitem => {
                        if (_fitem.imageId == item.imageId) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (_index != -1) {
                        let _file = this.state.files;
                        _file.splice(_index, 1);
                        this.setState({ files: _file });
                    }
                }
            })
        );
    };

    render() {
        return (
            <View style={[styles.container, {}]}>
                {/* this.state.RoleEnum == operationsStaff
                    &&this.props.TaskDetail.ExecuteUserId == this.state.User_ID? :(null)*/}
                {SentencedToEmpty(this.props.currentTask, ['OperationsUserID'], '') == this.state.User_ID &&
                    (SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == 1 || SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == 2) ? (
                    <TouchableOpacity
                        onPress={() => {
                            let TaskStatus = SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '');
                            if (SentencedToEmpty(this.props.currentTask, ['OperationsUserID'], '') != this.state.User_ID) {
                                ShowToast('当前用户无权限');
                            } else if (TaskStatus == 2 || TaskStatus == 1) {
                                //判断用户是否有权限从相册选择图片
                                if (SentencedToEmpty(this.props.currentTask, ['IsSltPicUpload'], false)) {
                                    ImagePicker.showImagePicker(options, response => {
                                        if (response.didCancel) {
                                        } else if (response.error) {
                                        } else if (response.customButton) {
                                        } else {
                                            //上传图片
                                            let imageFile = response;
                                            this.props.dispatch(
                                                createAction('taskModel/upLoadImage')({
                                                    imageFile,
                                                    callback: imageId => {
                                                        let files = this.state.files;
                                                        files.push({
                                                            height: imageFile.height,
                                                            url: imageFile.uri,
                                                            width: imageFile.width,
                                                            data: imageFile.data,
                                                            large: imageFile.uri,
                                                            imageId
                                                        });
                                                        this.setState({
                                                            files
                                                        });
                                                    }
                                                })
                                            );
                                        }
                                    });
                                } else {
                                    selectPic(imageFile => {
                                        //上传图片
                                        this.props.dispatch(
                                            createAction('taskModel/upLoadImage')({
                                                imageFile,
                                                callback: imageId => {
                                                    let files = this.state.files;
                                                    files.push({
                                                        height: imageFile.height,
                                                        url: imageFile.uri,
                                                        width: imageFile.width,
                                                        data: imageFile.data,
                                                        large: imageFile.uri,
                                                        imageId
                                                    });
                                                    this.setState({ files });
                                                }
                                            })
                                        );
                                    });
                                }
                            } else if (TaskStatus == 1) {
                                // this.props._showClockIn();
                            } else {
                                ShowToast('任务未处于执行状态');
                            }
                        }}
                    >
                        <View
                            style={[
                                {
                                    height: imageSize + 16,
                                    width: imageSize,
                                    marginHorizontal: 8,
                                    paddingVertical: 8
                                }
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        height: imageSize,
                                        width: imageSize,
                                        backgroundColor: globalcolor.backgroundGrey,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Image
                                    source={require('../../../../images/icon_take_photo.png')}
                                    style={{
                                        height: 19,
                                        width: 25
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : null}
                {this.state.files.map((item, key) => {
                    return (
                        <View
                            key={item.imageId && typeof item.imageId != 'undefined' ? item.imageId : key}
                            style={[
                                {
                                    height: imageSize + 16,
                                    width: imageSize,
                                    marginHorizontal: 8,
                                    paddingVertical: 8
                                }
                            ]}
                        >
                            <Image
                                resizeMode={'center'}
                                source={{ uri: item.url }}
                                // source={require('../../../../images/picture_holder.png')}
                                defaultSource={require('../../../../images/picture_holder.png')}
                                style={{
                                    backgroundColor: globalcolor.backgroundGrey,
                                    height: imageSize,
                                    width: imageSize
                                }}
                            />
                            {SentencedToEmpty(this.props.currentTask, ['OperationsUserID'], '') == this.state.User_ID &&
                                (SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == 1 || SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == 2) ? (
                                <TouchableOpacity
                                    style={[{ position: 'absolute', top: 10, right: 2 }]}
                                    onPress={() => {
                                        this._deleteImage(item);
                                    }}
                                >
                                    <Image source={require('../../../../images/icon_close_red.png')} style={[{ height: 20, width: 20 }]} />
                                </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                                style={[{ position: 'absolute', top: 30, left: 0 }]}
                                onPress={() => {
                                    this.props._showImageDetail(item);
                                }}
                            >
                                <View style={[{ height: imageSize - 22, width: imageSize - 22 }]} />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        minHeight: imageSize + 16,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalcolor.white,
        paddingHorizontal: 6,
        paddingVertical: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    }
});

//make this component available to the app
export default ImageViewPicker;
