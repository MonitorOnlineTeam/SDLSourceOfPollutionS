import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, ScrollView, DeviceEventEmitter, ActivityIndicator, Modal, Alert } from 'react-native';
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../utils';
import { StatusPage, SimpleLoadingComponent, Touchable, ModalParent, SDLText, AlertDialog, DeclareModule } from '../../components';

import ImageViewer from 'react-native-image-zoom-viewer';
// import ImageView from 'react-native-image-viewing';
import ImageUploadTouch from '../../components/form/images/ImageUploadTouch';
import ImageDeleteTouch from '../../components/form/images/ImageDeleteTouch';
import globalcolor from '../../config/globalcolor';
import { getEncryptData, getRootUrl } from '../../dvapack/storage';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../config';
import { SCREEN_HEIGHT } from '../../components/SDLPicker/constant/globalsize';

/**
 * 图片表单
 * @class ImageForm
 * @extends {Component}
 */
let _me;

@connect(({ taskDetailModel, imageFormModel }) => ({
    taskDetail: taskDetailModel.taskDetail,
    ImageForm: imageFormModel.ImageForm,
    imageStatus: imageFormModel.imageStatus
}))
export default class ImageForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'viewTitle'], '图片表单'),
            headerRight: SentencedToEmpty(navigation, ['state', 'params', 'headerRight'], <View />)
        });

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            FormMainID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'FormMainID'], ''),
            imagelist: [],
            multipleImagesUploadState: false,
            showImageView: false,
            selectImages: [],
            showDelete: false
        };
        _me = this;
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'viewTitle'], '图片表单')
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    refreshData() {
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();

        this.props.dispatch(
            createAction('imageFormModel/getForm')({
                params: {
                    formMainID: this.state.FormMainID,
                    // taskID: SentencedToEmpty(this.props, ['taskDetail', 'TaskID'], ''),
                },
                callback: ImageForm => {
                    const ProxyCode = getEncryptData();
                    let imagelist = [];
                    // ImageForm.ImgList.map(item => {
                    ImageForm.ImgNameList.map(item => {
                        // imagelist.push({ url: `${UrlInfo.ImageUrl + item}/Attachment?code=${encryData._55}` });
                        imagelist.push({
                            loadError: false,
                            // url: `${rootUrl.ReactUrl}/upload/${item}`,
                            // uri: `${rootUrl.ReactUrl}/upload/${item}`,
                            url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item}`
                                : `${ImageUrlPrefix}${ProxyCode}/${item}`,
                            uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item}`
                                : `${ImageUrlPrefix}${ProxyCode}/thumb_${item}`,
                            attachID: item
                        });
                    });
                    this.setState({ imagelist: imagelist });
                    if (SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit') {
                        this.props.navigation.setOptions({
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 67 ? (
                                        <DeclareModule
                                            contentRender={() => {
                                                return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                            }}
                                            options={{
                                                headTitle: '说明',
                                                innersHeight: 180,
                                                messText: `上传铭牌范围：皮托管铭牌（含皮托管系数），粉尘仪铭牌（含量程），温度变送器铭牌（含量程）`,
                                                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                                buttons: [
                                                    {
                                                        txt: '知道了',
                                                        btnStyle: { backgroundColor: '#fff' },
                                                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                                        onpress: () => { }
                                                    }
                                                ]
                                            }}
                                        />
                                    ) : null}
                                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 5 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 6 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 7 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 11 ? (
                                        <DeclareModule
                                            contentRender={() => {
                                                return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                            }}
                                            options={{
                                                headTitle: '说明',
                                                innersHeight: 180,
                                                messText: `如果当天在现场填写了纸质巡检台账，则拍照上传，否则不要拍照上传。`,
                                                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                                buttons: [
                                                    {
                                                        txt: '知道了',
                                                        btnStyle: { backgroundColor: '#fff' },
                                                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                                        onpress: () => { }
                                                    }
                                                ]
                                            }}
                                        />
                                    ) : null}
                                    <ImageUploadTouch
                                        callback={images => {
                                            images.map(img => {
                                                imagelist.push({
                                                    loadError: false,
                                                    url: 'data:image/jpg;base64,' + img.base64,
                                                    uri: 'data:image/jpg;base64,' + img.base64,
                                                    attachID: img.attachID
                                                    // props: { source: { uri: img.uri } }
                                                });
                                            });

                                            _me.setState({ imagelist: imagelist }, () => {
                                                this.refreshData();
                                                this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: 200 } }));
                                            });
                                        }}
                                        style={{ width: 40, height: 24 }}
                                        uploadMethods={['alarm', 'uploadimage']}
                                        uuid={_me.props.ImageForm.AttachID}
                                    >
                                        <Image source={require('../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                                    </ImageUploadTouch>
                                </View>
                            )
                        });

                        _me.props.navigation.setParams({
                            headerRight: (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 67 ? (
                                        <DeclareModule
                                            contentRender={() => {
                                                return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                            }}
                                            options={{
                                                headTitle: '说明',
                                                innersHeight: 180,
                                                messText: `上传铭牌范围：皮托管铭牌（含皮托管系数），粉尘仪铭牌（含量程），温度变送器铭牌（含量程）`,
                                                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                                buttons: [
                                                    {
                                                        txt: '知道了',
                                                        btnStyle: { backgroundColor: '#fff' },
                                                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                                        onpress: () => { }
                                                    }
                                                ]
                                            }}
                                        />
                                    ) : null}
                                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 5 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 6 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 7 ||
                                        SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 11 ? (
                                        <DeclareModule
                                            contentRender={() => {
                                                return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                            }}
                                            options={{
                                                headTitle: '说明',
                                                innersHeight: 180,
                                                messText: `如果当天在现场填写了纸质巡检台账，则拍照上传，否则不要拍照上传。`,
                                                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                                buttons: [
                                                    {
                                                        txt: '知道了',
                                                        btnStyle: { backgroundColor: '#fff' },
                                                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                                        onpress: () => { }
                                                    }
                                                ]
                                            }}
                                        />
                                    ) : null}
                                    <ImageUploadTouch
                                        callback={images => {
                                            images.map(img => {
                                                imagelist.push({
                                                    loadError: false,
                                                    url: 'data:image/jpg;base64,' + img.base64,
                                                    uri: 'data:image/jpg;base64,' + img.base64,
                                                    attachID: img.attachID
                                                    // props: { source: { uri: img.uri } }
                                                });
                                            });

                                            _me.setState({ imagelist: imagelist }, () => {
                                                this.refreshData();
                                                this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: 200 } }));
                                            });
                                        }}
                                        style={{ width: 40, height: 24 }}
                                        uploadMethods={['alarm', 'uploadimage']}
                                        uuid={_me.props.ImageForm.AttachID}
                                    >
                                        <Image source={require('../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                                    </ImageUploadTouch>
                                </View>
                            )
                        });
                    }
                }
            })
        );
    }
    componentDidMount() {
        /**
         * 如果需要创建表单createForm == false
         * 生成uuid
         * 完善ImageForm的数据格式
         * 设置第一次上传的按钮逻辑
         * 上传
         */
        if (this.props.route.params.params.createForm == false) {
            let imageUUID = new Date().getTime();
            this.props.dispatch(
                createAction('imageFormModel/updateState')({
                    ImageForm: {
                        AttachID: imageUUID,
                        ImgList: [],
                        ImgNameList: [],
                        LowimgList: [],
                        ThumbimgList: []
                    },
                    imageStatus: { status: 200 }
                })
            );

            _me.props.navigation.setOptions({
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 67 ? (
                            <DeclareModule
                                contentRender={() => {
                                    return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                }}
                                options={{
                                    headTitle: '说明',
                                    innersHeight: 180,
                                    messText: `上传铭牌范围：皮托管铭牌（含皮托管系数），粉尘仪铭牌（含量程），温度变送器铭牌（含量程）`,
                                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                    buttons: [
                                        {
                                            txt: '知道了',
                                            btnStyle: { backgroundColor: '#fff' },
                                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                            onpress: () => { }
                                        }
                                    ]
                                }}
                            />
                        ) : null}
                        {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 5 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 6 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 7 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 11 ? (
                            <DeclareModule
                                contentRender={() => {
                                    return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                }}
                                options={{
                                    headTitle: '说明',
                                    innersHeight: 180,
                                    messText: `如果当天在现场填写了纸质巡检台账，则拍照上传，否则不要拍照上传。`,
                                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                    buttons: [
                                        {
                                            txt: '知道了',
                                            btnStyle: { backgroundColor: '#fff' },
                                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                            onpress: () => { }
                                        }
                                    ]
                                }}
                            />
                        ) : null}
                        <ImageUploadTouch
                            callback={images => {
                                let imagelist = [];
                                images.map(img => {
                                    imagelist.push({
                                        loadError: false,
                                        url: 'data:image/jpg;base64,' + img.base64,
                                        uri: 'data:image/jpg;base64,' + img.base64,
                                        attachID: img.attachID
                                        // props: { source: { uri: img.uri } }
                                    });
                                });

                                _me.setState({ imagelist: imagelist }, () => {
                                    this.props.dispatch(
                                        createAction('imageFormModel/addImageForm')({
                                            params: {
                                                TaskID: this.props.route.params.params.TaskID,
                                                TypeID: this.props.route.params.params.ID,
                                                attachID: imageUUID
                                            },
                                            callback: FormMainID => {
                                                let newTaskFormList = [].concat(this.props.taskDetail.TaskFormList);
                                                let newTaskDetail = { ...this.props.taskDetail };
                                                let cID = this.props.route.params.params.ID;
                                                newTaskFormList.map((item, index) => {
                                                    if (item.ID == cID) {
                                                        item.FormMainID = FormMainID;
                                                    }
                                                });
                                                newTaskDetail.TaskFormList = newTaskFormList;
                                                this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
                                                this.setState({ FormMainID: FormMainID }, () => {
                                                    this.refreshData();
                                                });
                                            }
                                        })
                                    );
                                    // this.refreshData();
                                    // this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: 200 } }));
                                });
                            }}
                            style={{ width: 40, height: 24 }}
                            uploadMethods={['alarm', 'uploadimage']}
                            uuid={imageUUID}
                        >
                            <Image source={require('../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                        </ImageUploadTouch>
                    </View>
                )
            });

            _me.props.navigation.setParams({
                headerRight: (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 67 ? (
                            <DeclareModule
                                contentRender={() => {
                                    return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                }}
                                options={{
                                    headTitle: '说明',
                                    innersHeight: 180,
                                    messText: `上传铭牌范围：皮托管铭牌（含皮托管系数），粉尘仪铭牌（含量程），温度变送器铭牌（含量程）`,
                                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                    buttons: [
                                        {
                                            txt: '知道了',
                                            btnStyle: { backgroundColor: '#fff' },
                                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                            onpress: () => { }
                                        }
                                    ]
                                }}
                            />
                        ) : null}
                        {SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 5 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 6 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 7 ||
                            SentencedToEmpty(this.props, ['route', 'params', 'params', 'ID'], 'edit') == 11 ? (
                            <DeclareModule
                                contentRender={() => {
                                    return <Text style={[{ fontSize: 15, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                                }}
                                options={{
                                    headTitle: '说明',
                                    innersHeight: 180,
                                    messText: `如果当天在现场填写了纸质巡检台账，则拍照上传，否则不要拍照上传。`,
                                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                    buttons: [
                                        {
                                            txt: '知道了',
                                            btnStyle: { backgroundColor: '#fff' },
                                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                            onpress: () => { }
                                        }
                                    ]
                                }}
                            />
                        ) : null}
                        <ImageUploadTouch
                            callback={images => {
                                let imagelist = [];
                                images.map(img => {
                                    imagelist.push({
                                        loadError: false,
                                        url: 'data:image/jpg;base64,' + img.base64,
                                        uri: 'data:image/jpg;base64,' + img.base64,
                                        attachID: img.attachID
                                        // props: { source: { uri: img.uri } }
                                    });
                                });

                                _me.setState({ imagelist: imagelist }, () => {
                                    this.props.dispatch(
                                        createAction('imageFormModel/addImageForm')({
                                            params: {
                                                TaskID: this.props.route.params.params.TaskID,
                                                TypeID: this.props.route.params.params.ID,
                                                attachID: imageUUID
                                            },
                                            callback: FormMainID => {
                                                let newTaskFormList = [].concat(this.props.taskDetail.TaskFormList);
                                                let newTaskDetail = { ...this.props.taskDetail };
                                                let cID = this.props.route.params.params.ID;
                                                newTaskFormList.map((item, index) => {
                                                    if (item.ID == cID) {
                                                        item.FormMainID = FormMainID;
                                                    }
                                                });
                                                newTaskDetail.TaskFormList = newTaskFormList;
                                                this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
                                                this.setState({ FormMainID: FormMainID }, () => {
                                                    this.refreshData();
                                                });
                                            }
                                        })
                                    );
                                    // this.refreshData();
                                    // this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: 200 } }));
                                });
                            }}
                            style={{ width: 40, height: 24 }}
                            uploadMethods={['alarm', 'uploadimage']}
                            uuid={imageUUID}
                        >
                            <Image source={require('../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                        </ImageUploadTouch>
                    </View>
                )
            });
        } else {
            this.refreshData();
        }
    }
    renderPickedImage = () => {
        const rtnVal = [];
        let imagelst = this.state.imagelist;
        let selectDelImgs = this.state.selectImages;
        this.state.imagelist.map((item, key) => {
            const source = { ...item };
            console.log('source = ', source);

            let attachID = item.attachID ? item.attachID : item.uri.split('/upload/')[1];

            rtnVal.push(
                <View key={item.attachID} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 13, width: SCREEN_WIDTH / 3, backgroundColor: '#F5F6F9' }}>
                    <TouchableOpacity
                        deleteMethods={['alarm', 'DelPhotoRelation']}
                        callback={() => {
                            let newPage = this.state.currentPage;
                            if (this.state.currentPage == imagelst.length - 1) {
                                newPage = this.state.currentPage - 1;
                            }
                            imagelst.splice(key, 1);

                            this.setState({ imagelist: imagelst, currentPage: newPage });
                        }}
                        AttachID={attachID}
                        deleType={SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit' ? 'LongPress' : 'noDelete'}
                        onPress={() => {
                            let arr = this.state.selectImages;

                            if (this.state.showDelete == true) {
                                item.isSelect = !item.isSelect;
                                if (item.isSelect == true) {
                                    arr.push(item);
                                    this.setState({ selectImages: [...arr] });
                                } else {
                                    let idx = arr.findIndex((c, index) => {
                                        if (c.attachID == item.attachID) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                    arr.splice(idx, 1);
                                    this.setState({ selectImages: [...arr] });
                                }
                            } else {
                                this.setState({ showImageView: true, currentPage: key });
                            }
                        }}
                        onLongPress={() => {
                            let arr = this.state.selectImages;
                            item.isSelect = true;
                            this.setState({ selectImages: [...arr, item], showDelete: true });
                        }}
                    >
                        <View style={{ borderWidth: 1 }}>
                            <Image
                                // defaultSource={require('../../images/chaobiaoxianzhi.png')}
                                // loadingIndicatorSource={require('../../images/map_refresh_option.png')}
                                onError={() => {
                                    console.log('onError');
                                    // key
                                    let newData = this.state.imagelist.concat([]);
                                    newData[key].loadError = true;
                                    this.setState({ imagelist: newData });
                                }}
                                onLoadEnd={() => {
                                    console.log('onLoadEnd');
                                }}
                                resizeMethod={'resize'}
                                source={source.loadError ? require('../../images/img_load_failure.png') : source}
                                style={{ width: (SCREEN_WIDTH - 40) / 3, height: (SCREEN_WIDTH - 40) / 3 }}
                            />
                        </View>
                        {this.state.showDelete == true ? (
                            <Image
                                source={item.isSelect == true ? require('../../images/login_checkbox_on.png') : require('../../images/login_checkbox_off.png')}
                                style={{ width: 20, height: 20, position: 'absolute', bottom: 5, right: 5 }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>
            );
        });
        return rtnVal;
    };
    deleteALL = () => {
        this.refs.doAlert.show();
    };
    cancelButton = () => { };
    confirm = () => {
        this.props.dispatch(
            createAction('imageFormModel/delForm')({
                params: { FormMainID: this.state.FormMainID },
                callback: () => {
                    let newTaskFormList = [].concat(this.props.taskDetail.TaskFormList);
                    let newTaskDetail = { ...this.props.taskDetail };
                    let cID = this.props.route.params.params.ID;
                    newTaskFormList.map((item, index) => {
                        if (item.ID == cID) {
                            item.FormMainID = '';
                        }
                    });
                    newTaskDetail.TaskFormList = newTaskFormList;
                    this.props.dispatch(createAction('taskDetailModel/updateState')({ taskDetail: newTaskDetail }));
                }
            })
        );
    };
    render() {
        console.log('ImageForm = ', this.props.ImageForm);
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除此表单',
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
        return (
            <StatusPage
                status={this.props.imageStatus.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refreshData();
                    console.log('重新刷新');
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refreshData();
                    console.log('错误操作回调');
                }}
            >
                <ScrollView style={{ width: '100%', backgroundColor: '#F5F6F9' }}>
                    <View style={{ marginTop: 10, flexDirection: 'row', width: SCREEN_WIDTH, backgroundColor: '#F5F6F9', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>{this.renderPickedImage()}</View>
                </ScrollView>
                {SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit' && this.state.FormMainID != '' ? (
                    <TouchableOpacity
                        style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                        onPress={() => {
                            this.deleteALL();
                        }}
                    >
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
                <AlertDialog options={options} ref="doAlert" />
                <Modal visible={this.state.showImageView} transparent={true} onRequestClose={() => this.setState({ showImageView: false })} enableSwipeDown={true}>
                    <ImageViewer
                        loadingRender={() => <ActivityIndicator color={globalcolor.backgroundGrey} size="large" />}
                        onClick={() => {
                            this.setState({ showImageView: false });
                        }}
                        ref="imageview"
                        saveToLocalByLongPress={false}
                        imageUrls={this.state.imagelist}
                        index={this.state.currentPage}
                    />
                </Modal>
                {SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit' && this.state.showDelete == true ? (
                    <View style={[{ height: 60, width: SCREEN_WIDTH, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                let images = this.state.imagelist;
                                images.map(ii => {
                                    ii.isSelect = false;
                                });
                                this.setState({ selectImages: [], showDelete: false, imagelist: images });
                            }}
                        >
                            <Image source={require('../../images/guanbi.png')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 30 }}
                            onPress={() => {
                                Alert.alert('删除图片', '请确认您是否要继续删除图片', [
                                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                    {
                                        text: '确定',
                                        onPress: () => {
                                            this.state.selectImages.map(delImg => {
                                                this.props.dispatch(
                                                    createAction(`imageModel/DelPhotoRelation`)({
                                                        params: {
                                                            code: delImg.attachID,
                                                            callback: () => {
                                                                let newImgList = this.state.imagelist;
                                                                let idx = newImgList.findIndex((c, index) => {
                                                                    if (c.attachID == delImg.attachID) {
                                                                        return true;
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                });
                                                                if (idx >= 0) {
                                                                    newImgList.splice(idx, 1);
                                                                    this.setState({ imagelist: newImgList });
                                                                }
                                                            }
                                                        }
                                                    })
                                                );
                                            });
                                        }
                                    }
                                ]);
                            }}
                        >
                            <Image source={require('../../images/shanchu.png')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
