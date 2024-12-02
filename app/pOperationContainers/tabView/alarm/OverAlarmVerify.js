import React, { PureComponent } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Platform, TextInput, AsyncStorage, Modal, Alert, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { getEncryptData, getRootUrl, getToken, loadStorage } from '../../../dvapack/storage';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusPage, SelectButton, SimplePickerSingleTime, SDLText, SimplePicker, SimpleLoadingComponent, OperationAlertDialog, AlertDialog } from '../../../components';
import { createNavigationOptions, NavigationActions, createAction, ShowLoadingToast, CloseToast, ShowToast, SentencedToEmpty } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../../config/globalconst';
const ic_arrows_down = require('../../../images/ic_arrows_down.png');

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import globalcolor from '../../../config/globalcolor';
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
let that;
/**
 * 超标核实
 */
@connect(({ app, pointDetails, alarm }) => ({
    VerifyType: app.VerifyType,
    overDataTypes: alarm.overDataTypes,
    overDataTypeResult: alarm.overDataTypeResult,
    alarmRecordsPointInfo: pointDetails.alarmRecordsPointInfo
}))
export default class OverAlarmVerify extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '超标核实',
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        // 确认核实
                        let ExceptionProcessingIDStr = '';
                        navigation.state.params.alramData.map(item => {
                            ExceptionProcessingIDStr = ExceptionProcessingIDStr + item.ID + ',';
                        });
                        let formdataJson = {
                            cuid: that.state.TimeS,
                            EntCode: that.props.alarmRecordsPointInfo.TargetId,
                            DGIMN: navigation.state.params.alramData[0].DGIMN,
                            VerifyState: that.state.selectedOverDataType.code,
                            VerifyType: that.state.selectedOverDataType.code,
                            RecoveryDateTime: that.state.recoverTime,
                            VerifyImage: that.state.TimeS,
                            VerifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                            VerifyPerSon: getToken().User_Name,

                            VerifyMessage: that.state.VerifyMessage
                        };
                        let verifyState = SentencedToEmpty(that.state, ['selectedOverDataType', 'code'], -1);
                        if (verifyState == -1) {
                            ShowToast('请选择检查状态！');
                            return;
                        }

                        // 备注
                        if (SentencedToEmpty(that.state, ['VerifyMessage'], '') == '') {
                            ShowToast('备注信息不能为空！');
                            return;
                        }
                        that.setState({ loading: true });

                        that.props.dispatch(
                            createAction('alarm/operationVerifyAdd')({
                                params: {
                                    ExceptionProcessingID: ExceptionProcessingIDStr,
                                    // 选择的检查状态，接口获取
                                    State: that.state.selectedOverDataType.code,
                                    Remark: that.state.VerifyMessage,
                                    // TechnologyOverType: that.state.selectedOverDataType.ID,
                                    Data: formdataJson
                                },
                                callback: that.callback
                            })
                        );
                    }}
                >
                    <Image source={require('../../../images/ic_ok.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                </TouchableOpacity>
            )
        });

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            datatype: 0,
            loading: false,
            selectedOverDataType: {}, //选中的类型
            encryData: '',
            imagelist: [],
            imgUrls: [],
            VerifyState: {},
            VerifyMessage: '',
            VerifyType: {},
            modalVisible: false,
            recoverTime: moment()
                .add(4, 'hours')
                .format('YYYY-MM-DD HH:mm:ss'),
            TimeS: new Date().getTime(),
            dataArray: [
                {
                    title: '工艺超标',
                    id: 1
                },
                {
                    title: '设备异常',
                    id: 2
                }
            ]
        };
        this.props.navigation.setOptions({
            headerRight: () => <TouchableOpacity
                onPress={() => {
                    let verifyState = SentencedToEmpty(that.state, ['selectedOverDataType', 'code'], -1);
                    if (verifyState == -1) {
                        ShowToast('请选择检查状态！');
                        return;
                    }

                    // 备注
                    if (SentencedToEmpty(that.state, ['VerifyMessage'], '').trim() == '') {
                        ShowToast('备注信息不能为空！');
                        return;
                    }
                    this.refs.doAlert.show();
                }}
            >
                <Image source={require('../../../images/ic_ok.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
            </TouchableOpacity>
        });
    }
    callback = isSuccess => {
        this.setState({ loading: false });
        if (isSuccess == true) {
            if (this.state.selectedOverDataType.code == 2) {
                Alert.alert(
                    '温馨提示',
                    '核实已提交，您是否需要创建任务',
                    [
                        {
                            text: '确定',
                            onPress: () => {
                                this.props.dispatch(NavigationActions.back());
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'CreateTask',
                                        params: { needRefresh: 'false' }
                                    })
                                );
                            }
                        },
                        {
                            text: '取消',
                            onPress: () => {
                                this.props.dispatch(NavigationActions.back());
                            }
                        }
                    ],
                    { cancelable: true }
                );
            } else {
                ShowToast('提交成功');

                this.props.dispatch(NavigationActions.back());
            }
        } else {
            ShowToast('提交失败');
        }
    };
    getTimeSelectOption = () => {
        let type = this.props.datatype;
        let defaultTime;
        defaultTime = moment()
            .add(4, 'hours')
            .format('YYYY-MM-DD HH:mm:ss');
        return {
            formatStr: 'YYYY/MM/DD HH:mm',
            defaultTime: defaultTime,
            type: type,
            onSureClickListener: time => {
                this.setState({
                    recoverTime: moment(time).format('YYYY-MM-DD HH:mm:ss')
                    // showTime:this.formatShowTime(time,'day'),
                });
            }
        };
    };
    initIsLeftoverProblem = () => {
        return {
            codeKey: 'code',
            nameKey: 'name',
            dataArr: this.props.VerifyType,
            onSelectListener: item => {
                this.setState({
                    VerifyType: item
                });
            }
        };
    };
    renderPickedImage = () => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();
        this.state.imagelist.map((item, key) => {
            // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}/Attachment?code=${this.state.encryData}` } : require('../../../images/home_point_add.png');
            // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}`,headers:{ ProxyCode: encryData} } : require('../../../images/home_point_add.png');
            // const source = item.attachID != '' ? { uri: `${rootUrl.ReactUrl}/upload/${item.attachID}` } : require('../../../images/home_point_add.png');
            const source = item.attachID != '' ? {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.attachID}`
                    : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`
            } : require('../../../images/home_point_add.png');
            rtnVal.push(
                <View key={item.attachID} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ modalVisible: true, index: key });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: 50, width: 50 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(
                                createAction('alarm/DelPhotoRelation')({
                                    params: {
                                        code: item.attachID,
                                        callback: () => {
                                            this.setState(state => {
                                                const imagelist = state.imagelist;
                                                let imgUrls = state.imgUrls;
                                                const removeIndex = state.imagelist.findIndex((value, index, arr) => value.uploadID === item.uploadID);
                                                imagelist.splice(removeIndex, 1);
                                                imgUrls.splice(removeIndex, 1);
                                                const refresh = !state.refresh;
                                                return { imagelist, refresh, imgUrls };
                                            });
                                        }
                                    }
                                })
                            );
                        }}
                        style={[{ position: 'absolute', top: -8, left: SCREEN_WIDTH / 4 - 27 }]}
                    >
                        <Image source={require('../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                    </TouchableOpacity>
                </View>
            );
        });
        return rtnVal;
    };
    uploadImageCallBack = (img, isSuccess) => {
        if (isSuccess) {
            let encryData = getEncryptData();
            const rootUrl = getRootUrl();
            this.setState(state => {
                const ProxyCode = getEncryptData();
                // copy the map rather than modifying state.
                const imagelist = state.imagelist;
                let newImagelist = imagelist.concat(img);
                const refresh = !state.refresh;
                let imgUrls = state.imgUrls;
                let newImgUrls = [].concat(imgUrls);
                let imagUrl = UrlInfo.ImageUrl;
                // imagelist.push(img);
                img.map((item, index) => {
                    newImgUrls.push({
                        // url: `${UrlInfo.ImageUrl}${img.attachID}/Attachment?code=${this.state.encryData}`,
                        // url: `${UrlInfo.ImageUrl}${img.attachID}`,
                        // url: `${rootUrl.ReactUrl}/upload/${item.attachID}`
                        // url: `${ImageUrlPrefix}/${item.attachID}`
                        url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.attachID}`
                            : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`
                        // You can pass props to <Image />.
                        // props: {
                        //     headers: { ProxyCode: encryData}
                        // }
                    });
                });

                return { imagelist: newImagelist, refresh, imgUrls: newImgUrls };
            });
            CloseToast('上传成功');
        } else {
            CloseToast();
            ShowToast('上传失败！');
        }
    };
    componentDidMount() {
        let that = this;
        let encryData = getEncryptData();
        this.setState({ encryData: encryData });
        // let encryData = '';
        // AsyncStorage.getItem('encryptData', function(error, result) {
        //     if (error) {
        //         encryData = '';
        //     } else {
        //         if (result == null) {
        //             encryData = '';
        //         } else {
        //             encryData = result;
        //             that.setState({ encryData: encryData });
        //         }
        //     }
        // });
        this.props.dispatch(createAction('alarm/updateState')({ overDataTypeResult: { status: -1 } }));
        this.props.dispatch(createAction('alarm/getOverDataType')({}));
    }

    getTaskTypeOption = () => {
        return {
            disImage: true,
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择',
            defaultCode: '-1',
            dataArr: this.props.overDataTypes,
            onSelectListener: item => {
                this.setState({
                    selectedOverDataType: item
                });
            }
        };
    };

    cancelButton = () => { }
    confirm = () => {
        that = this;
        // 确认核实
        let ExceptionProcessingIDStr = '';
        this.props.route.params.params.alramData.map(item => {
            ExceptionProcessingIDStr = ExceptionProcessingIDStr + item.ID + ',';
        });
        let formdataJson = {
            cuid: that.state.TimeS,
            EntCode: that.props.alarmRecordsPointInfo.TargetId,
            DGIMN: this.props.route.params.params.alramData[0].DGIMN,
            VerifyState: that.state.selectedOverDataType.code,
            VerifyType: that.state.selectedOverDataType.code,
            RecoveryDateTime: that.state.recoverTime,
            VerifyImage: that.state.TimeS,
            VerifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            VerifyPerSon: getToken().User_Name,

            VerifyMessage: that.state.VerifyMessage
        };
        let verifyState = SentencedToEmpty(that.state, ['selectedOverDataType', 'code'], -1);
        if (verifyState == -1) {
            ShowToast('请选择检查状态！');
            return;
        }

        // 备注
        if (SentencedToEmpty(that.state, ['VerifyMessage'], '') == '') {
            ShowToast('备注信息不能为空！');
            return;
        }
        that.setState({ loading: true });

        that.props.dispatch(
            createAction('alarm/operationVerifyAdd')({
                params: {
                    ExceptionProcessingID: ExceptionProcessingIDStr,
                    // 选择的检查状态，接口获取
                    State: that.state.selectedOverDataType.code,
                    Remark: that.state.VerifyMessage,
                    // TechnologyOverType: that.state.selectedOverDataType.ID,
                    Data: formdataJson
                },
                callback: that.callback
            })
        );
    }

    render() {
        let alertOptions = {
            headTitle: '提示',
            messText: `确定要核实该报警吗？`,
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
                                    createAction('imageModel/uploadimage')({
                                        image: imageObj,
                                        images: assets,
                                        uuid: this.state.TimeS,
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
                                    createAction('imageModel/uploadimage')({
                                        image: imageObj,
                                        images: assets,
                                        uuid: this.state.TimeS,
                                        callback: this.uploadImageCallBack
                                    })
                                );
                            }
                        });
                    }
                }
            ]
        };
        return (
            <StatusPage
                status={this.props.overDataTypeResult.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyText={'配置信息错误'}
                errorText={'配置信息获取失败'}
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.props.dispatch(createAction('alarm/getOverDataType')({}));
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.props.dispatch(createAction('alarm/getOverDataType')({}));
                }}
            >
                <ScrollView>
                    <View style={{ width: SCREEN_WIDTH, height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                        <TextInput
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                this.setState({ VerifyMessage: text });
                            }}
                            value={this.state.VerifyMessage}
                            multiline={true}
                            placeholder="点击输入核查信息~"
                            placeholderTextColor={'#999999'}
                            style={{ color: '#333', width: SCREEN_WIDTH - 28, height: 140, backgroundColor: '#f0f0f0', padding: 13, textAlignVertical: 'top' }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (Platform.OS == 'ios') {
                                    SyanImagePicker.showImagePicker({}, (err, selectedPhotos) => {
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
                                                    uuid: this.state.TimeS,
                                                    callback: this.uploadImageCallBack
                                                })
                                            );
                                        }
                                    });
                                    return;
                                }
                                SyanImagePicker.showImagePicker({}, (err, selectedPhotos) => {
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
                                                uuid: this.state.TimeS,
                                                callback: this.uploadImageCallBack
                                            })
                                        );
                                    }
                                });
                                // this.refs.doAlert.show();

                                // ImagePicker.showImagePicker(options, response => {
                                //     if (response.didCancel) {
                                //     } else if (response.error) {
                                //     } else if (response.customButton) {
                                //     } else {
                                //         ShowLoadingToast('正在上传图片');
                                //         const imageIndex = this.state.imagelist.findIndex((value, index, arr) => value.origURL === response.origURL);
                                //         this.props.dispatch(
                                //             createAction('alarm/uploadimage')({
                                //                 image: response,
                                //                 uuid: this.state.TimeS,
                                //                 callback: this.uploadImageCallBack
                                //             })
                                //         );
                                //     }
                                // });
                            }}
                            style={{ position: 'absolute', bottom: 25, right: 15 }}
                        >
                            <Image source={require('../../../images/ic_attach_add.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, minHeight: 20, marginTop: 10, backgroundColor: '#ffffff' }}>
                        <SDLText style={[styles.texttitleStyle, { marginTop: 10, marginLeft: 13, color: '#333' }]}>附件图片：</SDLText>
                        <View style={{ flexDirection: 'row', marginTop: 10, width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>{this.renderPickedImage()}</View>
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between', height: 50, marginTop: 1 }]}>
                        <View style={[styles.rowInner, {}]}>
                            <SDLText style={{ marginLeft: 13 }}>{'检查状态'}</SDLText>
                            <SimplePicker
                                ref={ref => {
                                    this.simplePicker = ref;
                                }}
                                option={this.getTaskTypeOption()}
                                style={[{ marginLeft: 14, width: SCREEN_WIDTH - 140 }]}
                                textStyle={{ textAlign: 'left', flex: 1 }}
                            />
                        </View>

                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                    </View>

                    <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                        <ImageViewer
                            saveToLocalByLongPress={false}
                            onClick={() => {
                                {
                                    this.setState({
                                        modalVisible: false
                                    });
                                }
                            }}
                            imageUrls={this.state.imgUrls}
                            index={this.state.index}
                        />
                    </Modal>
                    <OperationAlertDialog options={dialogOptions} ref="doAlert" />
                    <AlertDialog options={alertOptions} ref="doAlert" />
                </ScrollView>
            </StatusPage>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    row: {
        width: '100%',
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
