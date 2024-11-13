/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-08-26 10:59:39
 * @LastEditTime: 2024-11-12 16:40:50
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/MissionVerification/RepulseMissionVerification.js
 */
import { Image, Platform, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { Component } from 'react'
import SyanImagePicker from 'react-native-syan-image-picker';

import { CloseToast, createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../utils';
import { AlertDialog, OperationAlertDialog, SDLText } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { ImageUrlPrefix } from '../../config';
import { getEncryptData } from '../../dvapack/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import { generateRdStr } from '../../gridModels/mathUtils';
import globalcolor from '../../config/globalcolor';

const options = {
    mediaType: 'photo',
    quality: 0.7,
    selectionLimit: 6,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
let that;
let editSiIndex = 0;

@connect()
export default class RepulseMissionVerification extends Component {
    static defaultProps = {
        editCommitEnable: true
    }

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            FileUuidArray: [], //方案步骤图片uuid数组
            planItems: [], //方案执行步骤
        }

        props.navigation.setOptions({
            title: '打回',
        });
    }

    componentDidMount() {
        console.log('props = ', this.props);
        const oPlanItem = SentencedToEmpty(this.props, ['route', 'params', 'params', 'PlanItem'], []);
        let newPlanItem = []
            , imageList = [];
        let uuidArr = [];

        oPlanItem.map((oItem, oIndex) => {
            imageList = [];
            // SentencedToEmpty(oItem, ['ReAttachment', 'ImgNameList'], [])
            //     .map((imageItem, imageIndex) => {
            //         imageList.push({
            //             FileName: imageItem,
            //         })
            //     });
            uuidArr.push(generateRdStr());
            newPlanItem.push({
                planItemAttachment: imageList,
                planItemCode: oItem.ID,
                planItemContent: oItem.QTitle,
                planItemDesc: oItem.QContent
            })
        });
        this.setState({
            planItems: newPlanItem,
            FileUuidArray: uuidArr,
        })
    }

    renderCheckStep = (si, idx) => {
        return (
            <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, marginTop: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 13, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SDLText style={{ color: 'red' }}>*</SDLText>
                        <SDLText style={{}}>{`${idx + 1}.核查内容`}</SDLText>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput
                            editable={this.props.editCommitEnable}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                let newplanItems = this.state.planItems;
                                si.planItemContent = text;
                                newplanItems[idx] = si;
                                this.setState({ planItems: newplanItems }, () => {
                                    this.forceUpdate();
                                });
                            }}
                            value={si.planItemContent}
                            placeholder="请输入内容标题"
                            placeholderTextColor={'#999999'}
                            style={{ backgroundColor: 'white', color: '#333', borderColor: '#999', marginRight: 15, borderWidth: 0.5, paddingVertical: 2, paddingHorizontal: 13, maxWidth: SCREEN_WIDTH - 150 }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                let newplanItems = this.state.planItems;
                                newplanItems.splice(idx, 1);
                                this.setState({ planItems: newplanItems }, () => {
                                    this.forceUpdate();
                                });
                            }}
                        >
                            <Text style={{ color: '#4AA0FF' }}>删除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, marginTop: 1, backgroundColor: '#ffffff', paddingHorizontal: 13, paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SDLText style={{ color: 'red' }}>*</SDLText>
                        <SDLText style={{}}>核查描述</SDLText>
                    </View>
                    <TextInput
                        editable={this.props.editCommitEnable}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        onChangeText={text => {
                            let newplanItems = this.state.planItems;
                            si.planItemDesc = text;
                            newplanItems[idx] = si;
                            this.setState({ planItems: newplanItems }, () => {
                                this.forceUpdate();
                            });
                        }}
                        value={si.planItemDesc}
                        multiline={true}
                        placeholder="请输入描述信息"
                        placeholderTextColor={'#999999'}
                        style={{ width: SCREEN_WIDTH - 26, backgroundColor: 'white', marginTop: 10, minHeight: 60, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginTop: 5 }}>
                    {this.renderPickedImage(si, idx)}
                    {this.props.editCommitEnable == true ? (
                        <TouchableOpacity
                            onPress={() => {
                                editSi = si;
                                editSiIndex = idx;
                                if (Platform.OS == 'ios') {
                                    SyanImagePicker.showImagePicker({ imageCount: 6 }, (err, selectedPhotos) => {
                                        if (err) {
                                            // 取消选择
                                            return;
                                        }

                                        if (selectedPhotos.length < 1) {
                                            return;
                                        } else {
                                            that.props.dispatch(
                                                createAction('imageModel/uploadimage')({
                                                    image: selectedPhotos[0],
                                                    images: selectedPhotos,
                                                    uuid: that.state.FileUuidArray[idx],
                                                    callback: (img, isSuccess) => {
                                                        that.uploadImageCallBack(img, isSuccess, si, idx);
                                                    }
                                                })
                                            );
                                        }
                                    });
                                    return;
                                }
                                SyanImagePicker.showImagePicker({ imageCount: 6 }, (err, selectedPhotos) => {
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
                                                uuid: that.state.FileUuidArray[idx],
                                                callback: (img, isSuccess) => {
                                                    that.uploadImageCallBack(img, isSuccess, si, idx);
                                                }
                                            })
                                        );
                                    }
                                });
                                // this.refs.doAlert.show();
                            }}
                            style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25 }}
                        >
                            <Image source={require('../../images/addpic.png')} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginBottom: 5 }} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    };

    renderPickedImage = (si, idx) => {
        const rtnVal = [];
        const ProxyCode = getEncryptData();

        si.planItemAttachment.map((item, key) => {
            const source = item.FileName != '' ? { uri: `${ImageUrlPrefix}${ProxyCode}/thumb_${item.FileName}` } : require('../../images/addpic.png');
            rtnVal.push(
                <View key={item.FileName} style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginTop: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            let showImageArr = [];
                            si.planItemAttachment.map((sitem, skey) => {
                                showImageArr.push({ url: `${ImageUrlPrefix}${ProxyCode}/${sitem.FileName}` });
                            });

                            this.setState({
                                modalVisible: true,
                                showImageIndex: key,
                                showImages: showImageArr
                            });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: SCREEN_WIDTH / 4 - 10, width: SCREEN_WIDTH / 4 - 15 }]} />
                    </TouchableOpacity>
                    {this.props.editCommitEnable == true ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    createAction('abnormalTask/DelPhotoRelation')({
                                        params: {
                                            code: item.FileName,
                                            callback: () => {
                                                const removeIndex = si.planItemAttachment.findIndex((value, index, arr) => value.FileName === item.FileName);

                                                let newImages = si.planItemAttachment;
                                                newImages.splice(removeIndex, 1);
                                                let newplanItems = this.state.planItems;
                                                si.planItemAttachment = newImages;
                                                newplanItems[idx] = si;
                                                this.setState({ planItems: newplanItems }, () => {
                                                    this.forceUpdate();
                                                });
                                            }
                                        }
                                    })
                                );
                            }}
                            style={[{ position: 'absolute', top: 2, right: 2 }]}
                        >
                            <Image source={require('../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            );
        });
        return rtnVal;
    };

    uploadImageCallBack = (images, isSuccess, si, idx) => {
        si = editSi;
        idx = editSiIndex;
        if (isSuccess) {
            let newImages = si.planItemAttachment;
            images.map(img => {
                newImages.push({
                    FileName: img.attachID
                });
            });

            let newplanItems = this.state.planItems;
            si.planItemAttachment = newImages;
            newplanItems[idx] = si;
            this.setState({ planItems: newplanItems }, () => {
                this.forceUpdate();
            });

            CloseToast('上传成功');
        } else {
            CloseToast();
            ShowToast('上传失败！');
        }
    };

    addEmptyAction() {
        let newplanItems = this.state.planItems;
        newplanItems.push({
            planItemCode: '',
            planItemContent: '',
            planItemDesc: '',
            planItemAttachment: []
        });
        let uuidArr = this.state.FileUuidArray;
        uuidArr.push(generateRdStr());
        this.setState({ planItems: newplanItems, FileUuidArray: uuidArr }, () => {
            this.forceUpdate();
        });
    }

    confirm = () => {
        let submitPlanItem = [];
        let tempItem = {};
        this.state.planItems.map((item, index) => {
            tempItem = { ...item };
            tempItem.planItemAttachment = this.state.FileUuidArray[index];
            submitPlanItem.push(tempItem);
        });
        this.props.dispatch(createAction('abnormalTask/RepulseCheck')({
            params: {
                "modelCheckedGuid": this.props.route.params.params.ModelCheckedGuid,
                "planItems": submitPlanItem
            },
            callback: () => {
                this.props.dispatch(NavigationActions.back());
                this.props.dispatch(NavigationActions.back());
            }
        }));
    }

    render() {
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
                        launchCamera(options, response => {
                            const { assets = [] } = response;
                            let imageObj = null;
                            if (assets.length <= 0) {
                                return;
                            } else {
                                imageObj = assets[0];
                                ShowLoadingToast('正在上传图片');
                                that.props.dispatch(
                                    // createAction('abnormalTask/uploadimage')({
                                    createAction('imageModel/uploadimage')({
                                        image: imageObj,
                                        images: assets,
                                        uuid: this.state.FileUuidArray[editSiIndex],
                                        callback: this.uploadImageCallBack
                                    })
                                );
                            }
                        });
                    }
                },
                {
                    txt: '选择照片',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        launchImageLibrary(options, response => {
                            console.log('response = ', response);
                            const { assets = [] } = response;
                            let imageObj = null;
                            if (assets.length <= 0) {
                                return;
                            } else {
                                imageObj = assets[0];
                                ShowLoadingToast('正在上传图片');
                                that.props.dispatch(
                                    // createAction('abnormalTask/uploadimage')({
                                    createAction('imageModel/uploadimage')({
                                        image: imageObj,
                                        images: assets,
                                        uuid: this.state.FileUuidArray[editSiIndex],
                                        callback: this.uploadImageCallBack
                                    })
                                );
                            }
                        });
                    }
                }
            ]
        };

        let alertOptions = {
            headTitle: '提示',
            messText: '确定要打回这条记录吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    // onpress: this.cancelButton
                    onpress: () => { }
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };


        return (<View
            style={[{
                width: SCREEN_WIDTH, flex: 1
                , alignItems: 'center'
            }]}
        >
            <ScrollView
                nestedScrollEnabled={true}
                style={[{ flex: 1, paddingTop: 0 }]} showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 10, backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: 'row', padding: 13, alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 3, height: 14, backgroundColor: '#4AA0FF' }}></View>
                            <SDLText style={{ marginLeft: 5 }}>核查动作</SDLText>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.addEmptyAction();
                            }}
                        >
                            <Image style={{ width: 25, height: 25 }} source={require('../../images/ic_add_suspend_production.png')}></Image>
                        </TouchableOpacity>
                    </View>
                    {this.state.planItems.map((si, idx) => {
                        return this.renderCheckStep(si, idx);
                    })}
                    <OperationAlertDialog options={dialogOptions} ref="doAlert" />
                    <AlertDialog options={alertOptions} ref="submitAlert" />
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={() => {
                    this.refs.submitAlert.show();
                    // let submitPlanItem = [];
                    // let tempItem = {};
                    // this.state.planItems.map((item, index) => {
                    //     tempItem = { ...item };
                    //     tempItem.planItemAttachment = this.state.FileUuidArray[index];
                    //     submitPlanItem.push(tempItem);
                    // });
                    // this.props.dispatch(createAction('abnormalTask/RepulseCheck')({
                    //     params: {
                    //         "modelCheckedGuid": this.props.navigation.state.params.ModelCheckedGuid,
                    //         "planItems": submitPlanItem
                    //     }
                    // }));
                }}
                style={[{
                    marginVertical: 8
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH * 0.9, height: 50, backgroundColor: '#4AA0FF'
                        , alignItems: 'center', justifyContent: 'center'
                        , borderRadius: 8
                    }]}
                >
                    <SDLText style={{ color: '#fff' }}>打回</SDLText>
                </View>
            </TouchableOpacity>
        </View>
        )
    }
}