import React, { PureComponent } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Platform, TextInput, AsyncStorage, Modal, Text, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusPage, SelectButton, SimplePickerSingleTime, SDLText, SimplePicker, SimpleLoadingComponent, OperationAlertDialog } from '../../../../components';
import { createNavigationOptions, NavigationActions, createAction, ShowLoadingToast, CloseToast, ShowToast, SentencedToEmpty } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { ImageUrlPrefix, UrlInfo } from '../../../../config/globalconst';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_HEIGHT } from '../../../../components/SDLPicker/constant/globalsize';
import globalcolor from '../../../../config/globalcolor';
import { getEncryptData, getRootUrl } from '../../../../dvapack/storage';
const options = {
    mediaType: 'photo',
    quality: 0.7,
    selectionLimit: 1,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
let that;
/**
 * 报警核实
 */
@connect(({ alarmAnaly }) => ({
    commitVerifyResult: alarmAnaly.commitVerifyResult,
    alarmVerifyDetail: alarmAnaly.alarmVerifyDetail,
    editCommitEnable: alarmAnaly.editCommitEnable
}))
export default class AlarmReview extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '复核',
            headerRight: navigation.state.params.headerRight,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        that = this;
        this.alarmObj = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {});
        this.state = {
            loading: false,
            encryData: '',
            dataArray: [
                {
                    title: '通过',
                    id: '3'
                },
                {
                    title: '驳回',
                    id: '4'
                }
            ],
            imagelist: [],
            imgUrls: [],
            selectUntruthReason: '',
            modalVisible: false,

            TimeS: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AttachmentId'], new Date().getTime())
        };
    }

    renderPickedImage = () => {
        const rtnVal = [];
        const rootUrl = getRootUrl();
        const ProxyCode = getEncryptData();
        let fileName = '', tempArr = [];
        this.state.imagelist.map((item, key) => {
            tempArr = item.url.split('/');
            fileName = tempArr[tempArr.length - 1];
            // const source = item.attachID != '' ? { uri: `${UrlInfo.DataAnalyze}/${item.url}` } : require('../../../../images/addpic.png');
            const source = item.attachID != '' ? { uri: `${ImageUrlPrefix}${ProxyCode}/${fileName}` } : require('../../../../images/addpic.png');
            console.log('source = ', source);
            rtnVal.push(
                <View key={item.attachID} style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginTop: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ modalVisible: true, index: key });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: SCREEN_WIDTH / 4 - 10, width: SCREEN_WIDTH / 4 - 15 }]} />
                    </TouchableOpacity>
                    {this.props.editCommitEnable == true ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    createAction('alarmAnaly/DelPhotoRelation')({
                                        params: {
                                            code: item.attachID,
                                            callback: () => {
                                                const removeIndex = this.state.imagelist.findIndex((value, index, arr) => value.attachID === item.attachID);
                                                this.setState(state => {
                                                    const imagelist = state.imagelist;
                                                    let imgUrls = state.imgUrls;
                                                    let newImagelist = [].concat(imagelist);
                                                    let newImgUrls = [].concat(imgUrls);
                                                    newImagelist.splice(removeIndex, 1);
                                                    newImgUrls.splice(removeIndex, 1);
                                                    const refresh = !state.refresh;
                                                    return { imagelist: newImagelist, refresh, imgUrls: newImgUrls };
                                                });
                                            }
                                        }
                                    })
                                );
                            }}
                            style={[{ position: 'absolute', top: 2, right: 2 }]}
                        >
                            <Image source={require('../../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            );
        });
        return rtnVal;
    };

    uploadImageCallBack = (img, isSuccess) => {
        if (isSuccess) {
            const rootUrl = getRootUrl();
            const ProxyCode = getEncryptData();
            let fileName = '', tempArr = [];

            this.setState(state => {
                // copy the map rather than modifying state.
                const imagelist = state.imagelist;
                const refresh = !state.refresh;
                let imgUrls = state.imgUrls;
                let newImagelist = imagelist.concat(img);
                let newImgUrls = [].concat(imgUrls);
                console.log('newImagelist = ', newImagelist);
                console.log('newImgUrls = ', newImgUrls);
                img.map((item, index) => {
                    tempArr = item.url.split('/');
                    fileName = tempArr[tempArr.length - 1];
                    newImgUrls.push({
                        // url: `${UrlInfo.DataAnalyze}/${item.url}`
                        url: `${ImageUrlPrefix}${ProxyCode}/${fileName}`
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

    componentWillUnmount() {
        this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { status: 200 } }));
    }

    componentDidMount() { }
    statusPageOnRefresh = () => {
        // 页面状态码200，所以这个方法不会被调用
        this.props.dispatch(
            createAction('alarmAnaly/GetWarningVerifyInfor')({
                modelWarningGuid: this.alarmObj.ModelWarningGuid,
                callback: info => {
                    this.setState({ selectUntruthReason: info['UntruthReason'] });

                    let imageArr = info['FileList'];
                    let showImageList = [];
                    let showImageUrl = [];
                    imageArr.map(item => {
                        showImageList.push({
                            url: item.FileName,
                            attachID: item.FileName.split('/')[item.FileName.split('/').length - 1]
                        });
                        showImageUrl.push({
                            url: `${UrlInfo.DataAnalyze}/${item.FileName}`
                        });
                    });
                    this.setState({ imagelist: showImageList, imgUrls: showImageUrl, TimeS: info.FileUuid });
                }
            })
        );
    };
    getTypeOption = () => {
        let { UntruthReason } = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
        return {
            contentWidth: 166,
            placeHolder: UntruthReason || '请选择异常原因',
            codeKey: 'ID',
            hideImg: true,
            nameKey: 'TypeName',
            defaultCode: UntruthReason,
            dataArr: [
                { ID: '湿度仪堵塞', TypeName: '湿度仪堵塞' },
                { ID: '湿度仪故障', TypeName: '湿度仪故障' },
                { ID: '标定', TypeName: '标定' },
                { ID: '故障', TypeName: '故障' },
                { ID: '公共烟道窜烟', TypeName: '公共烟道窜烟' },
                { ID: '数采仪上传压力单位异常', TypeName: '数采仪上传压力单位异常' },
                { ID: '启炉/停炉/停运未标记', TypeName: '启炉/停炉/停运未标记' },
                { ID: '数采仪使用老版软件', TypeName: '数采仪使用老版软件' },
                { ID: '数采仪调试', TypeName: '数采仪调试' },
                { ID: '其他', TypeName: '其他' }
            ],
            onSelectListener: item => {
                this.setState({
                    selectUntruthReason: item.TypeName
                });
            }
        };
    };
    render() {
        console.log('state = ', this.state);
        let { approvalStatus, approvalRemarks, FileList } = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
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
                                    createAction('alarmAnaly/uploadimage')({
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
                                    createAction('alarmAnaly/uploadimage')({
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
                status={200}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.statusPageOnRefresh();
                }}
            >
                <KeyboardAwareScrollView style={[{ flex: 1, paddingTop: 13 }]} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <SDLText style={{ color: 'red' }}>*</SDLText>
                            <SDLText style={{}}>复核结果</SDLText>
                        </View>
                        <SelectButton
                            editable={this.props.editCommitEnable}
                            style={{ flexDirection: 'row', width: 200 }} //整个组件的样式----这样可以垂直和水平
                            conTainStyle={{ height: 44, width: 80 }} //图片和文字的容器样式
                            imageStyle={{ width: 18, height: 18 }} //图片样式
                            textStyle={{ color: '#666' }} //文字样式
                            selectIndex={approvalStatus == '3' ? '0' : approvalStatus == '4' ? '1' : ''} //空字符串,表示不选中,数组索引表示默认选中
                            data={this.state.dataArray} //数据源
                            onPress={(index, item) => {
                                let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
                                newObj.approvalStatus = item.id;
                                //动态更新组件内state 记录输入内容
                                this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                            }}
                        />
                        {this.props.editCommitEnable == false ? <View style={{ position: 'absolute', width: '100%', height: '100%' }}></View> : null}
                    </View>

                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, marginTop: 1, backgroundColor: '#ffffff', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SDLText style={{ color: 'red' }}>*</SDLText>
                            <SDLText style={{}}>复核意见</SDLText>
                        </View>
                        <TextInput
                            editable={this.props.editCommitEnable}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { approvalStatus: null, approvalRemarks: null, FileList: [] });
                                newObj.approvalRemarks = text;
                                //动态更新组件内state 记录输入内容
                                this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                                this.setState({ VerifyMessage: text });
                            }}
                            value={approvalRemarks}
                            multiline={true}
                            placeholder="请输入描述信息"
                            placeholderTextColor={'#999999'}
                            style={{ width: SCREEN_WIDTH - 26, backgroundColor: 'white', marginTop: 10, minHeight: 100, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 250, marginTop: 1, backgroundColor: '#ffffff', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <SDLText style={{ color: 'red' }}> </SDLText>
                            <SDLText style={{}}>附件</SDLText>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                            {this.renderPickedImage()}
                            {this.props.editCommitEnable == true ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (Platform.OS == 'ios') {
                                            SyanImagePicker.showImagePicker({ imageCount: 1 }, (err, selectedPhotos) => {
                                                if (err) {
                                                    // 取消选择
                                                    return;
                                                }

                                                if (selectedPhotos.length < 1) {
                                                    return;
                                                } else {
                                                    that.props.dispatch(
                                                        createAction('alarmAnaly/uploadimage')({
                                                            image: selectedPhotos[0],
                                                            images: selectedPhotos,
                                                            uuid: this.state.TimeS,
                                                            callback: this.uploadImageCallBack
                                                        })
                                                    );
                                                }
                                            });
                                            return;
                                        }
                                        SyanImagePicker.showImagePicker({ imageCount: 1 }, (err, selectedPhotos) => {
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
                                    }}
                                    style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25 }}
                                >
                                    <Image source={require('../../../../images/addpic.png')} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginBottom: 5 }} />
                                </TouchableOpacity>
                            ) : null}
                        </View>

                        {this.props.editCommitEnable == true ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (approvalStatus == '' || approvalRemarks == '' || approvalStatus == null || approvalRemarks == null) {
                                        ShowToast('请完善相关信息');
                                        return;
                                    } else {
                                        this.props.dispatch(
                                            createAction('alarmAnaly/commitVerify')({
                                                params: {
                                                    modelCheckedGuid: this.alarmObj.ID,
                                                    ModelWarningGuid: [],
                                                    approvalStatus: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'approvalStatus'], ''),
                                                    approvalRemarks: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'approvalRemarks'], ''),
                                                    approvalDocs: this.state.TimeS
                                                },
                                                callback: () => {
                                                    this.props.dispatch(NavigationActions.back());
                                                    this.props.dispatch(NavigationActions.back());
                                                    this.alarmObj.onRefresh();
                                                }
                                            })
                                        );
                                    }
                                }}
                                style={{
                                    marginVertical: 10,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: SCREEN_WIDTH - 20,
                                    height: 52,
                                    backgroundColor: globalcolor.headerBackgroundColor
                                }}
                            >
                                <Text style={{ color: '#ffffff', fontSize: 18 }}>{'保存'}</Text>
                            </TouchableOpacity>
                        ) : null}
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
                    {this.props.commitVerifyResult.status == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                </KeyboardAwareScrollView>

                <OperationAlertDialog options={dialogOptions} ref="doAlert" />
            </StatusPage>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
