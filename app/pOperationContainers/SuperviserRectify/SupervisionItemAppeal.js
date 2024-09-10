/*
 * @Description: 督查 申诉
 * @LastEditors: hxf
 * @Date: 2022-11-29 11:32:39
 * @LastEditTime: 2023-12-13 11:45:56
 * @FilePath: /SDLMainProject37/app/pOperationContainers/SuperviserRectify/SupervisionItemAppeal.js
 */
import React, { Component } from 'react'
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import { AlertDialog } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRootUrl } from '../../dvapack/storage';
import { CloseToast, createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../utils';

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

@connect(({ supervision }) => ({
    editItem: supervision.editItem
}))
export default class SupervisionItemAppeal extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation
                , ['state', 'params', 'title'], '填写申诉内容'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }


    constructor(props) {
        super(props);
        let showUrlList = [];
        const rootUrl = getRootUrl();
        SentencedToEmpty(props, ['editItem', 'InspectorAttachment', 'ImgList'], []).map((item, index) => {
            showUrlList.push({ url: `${rootUrl.ReactUrl}/upload/${item}` });
        })
        this.state = {
            uuid: SentencedToEmpty(this.props, ['editItem', 'RectificationAttachment', 'AttachID'], new Date().getTime()),
            modalVisible: false,
            // showUrls: [],
            showUrls: showUrlList,
            showImageIndex: 0,
            supervisionInputString: SentencedToEmpty(this.props, ['editItem', 'RectificationDescribe'], ''),
            // litimgList: SentencedToEmpty(this.props, ['editItem', 'RectificationAttachment', 'ImgList'], [])
            litimgList: SentencedToEmpty(this.props, ['editItem', 'RectificationAttachment', 'ImgNameList'], [])
        }
    }

    uploadImageCallBack = (img, isSuccess) => {
        if (isSuccess) {
            let newList = this.state.litimgList.concat(img.attachID);
            this.setState({
                litimgList: newList
            });
            CloseToast('上传成功');
        } else {
            CloseToast('上传失败！');
        }
    };

    cancelButton = () => { }
    confirm = () => {
        // 撤销
        this.props.dispatch(createAction('supervision/RevokeInspectorRectificationInfo')({
            sendParams: {
                "ID": this.props.editItem.Id,
            },
            callback: () => {
                this.props.dispatch(createAction('supervision/updateState')({
                    inspectorRectificationInfoResult: { status: -1 }
                }));
                this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
                this.props.dispatch(NavigationActions.back());
            }
        }));
    }

    render() {
        const imageWidth = ((SCREEN_WIDTH - 20) / 4) - 20;
        const rootUrl = getRootUrl();
        const ImgList = this.state.litimgList;
        const Images = [];
        if (ImgList && ImgList.length > 0) {
            ImgList.map(item => {
                Images.push({ AttachID: `${item}` });
            });
        }
        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要撤回此申诉记录？',
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
        // this.props.editItem.Status = 3;
        return (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                <ScrollView style={{
                    width: SCREEN_WIDTH, flex: 1,
                }}>
                    <View style={{
                        width: SCREEN_WIDTH, paddingVertical: 15
                        , paddingLeft: 20, paddingRight: 35
                        , backgroundColor: 'white'
                    }}>
                        <Text style={{
                            fontSize: 15, color: '#333333'
                        }}>{`督查内容`}</Text>
                        <Text style={{ marginTop: 10, fontSize: 14, color: '#666666' }}>{`${SentencedToEmpty(this.props, ['editItem', 'ContentItem'], '未填写督查内容')}`}</Text>
                    </View>
                    <View style={{
                        width: SCREEN_WIDTH, marginTop: 10
                        , backgroundColor: 'white', paddingBottom: 15
                    }}>
                        <Text style={{
                            fontSize: 15, color: '#333333'
                            , marginLeft: 20, marginVertical: 15
                        }}>{`问题描述`}</Text>
                        <View style={{
                            height: 1, width: SCREEN_WIDTH - 38
                            , marginLeft: 19, backgroundColor: '#EAEAEA'
                        }}></View>
                        <Text style={{
                            marginTop: 10, fontSize: 14, color: '#666666'
                            , width: SCREEN_WIDTH - 40, marginLeft: 20
                        }}>{`${SentencedToEmpty(this.props, ['editItem', 'InspectorProblem'], '未填写问题描述')}`}</Text>
                        <View style={{
                            width: SCREEN_WIDTH - 20
                            , flexDirection: 'row', flexWrap: 'wrap'
                        }}>
                            {
                                // SentencedToEmpty(this.props, ['editItem', 'InspectorAttachment', 'ImgList'], []).map((item, index) => {
                                SentencedToEmpty(this.props, ['editItem', 'InspectorAttachment', 'ImgNameList'], []).map((item, index) => {
                                    return (<TouchableOpacity
                                        onPress={() => {
                                            // this.setState({
                                            //     modalVisible: true,
                                            //     // showUrls:[{url:`https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload.pig66.com%2Fuploadfile%2F2017%2F0511%2F20170511075802322.jpg&refer=http%3A%2F%2Fupload.pig66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672297667&t=5d1cbc3a05c14a618af7d51791eb80bfhttps://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload.pig66.com%2Fuploadfile%2F2017%2F0511%2F20170511075802322.jpg&refer=http%3A%2F%2Fupload.pig66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672297667&t=5d1cbc3a05c14a618af7d51791eb80bf`}]
                                            //     showUrls: [{ url: `${rootUrl.ReactUrl}/upload/${item}` }]
                                            // });
                                            this.setState({
                                                modalVisible: true,
                                                showImageIndex: index
                                            });
                                        }}
                                        style={[
                                            { marginLeft: 20, marginTop: 20 }
                                        ]}>
                                        <Image
                                            resizeMethod={'resize'}
                                            // source={{ uri: `https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload.pig66.com%2Fuploadfile%2F2017%2F0511%2F20170511075802322.jpg&refer=http%3A%2F%2Fupload.pig66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672297667&t=5d1cbc3a05c14a618af7d51791eb80bfhttps://gimg2.baidu.com/image_search/src=http%3A%2F%2Fupload.pig66.com%2Fuploadfile%2F2017%2F0511%2F20170511075802322.jpg&refer=http%3A%2F%2Fupload.pig66.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1672297667&t=5d1cbc3a05c14a618af7d51791eb80bf`}}
                                            source={{ uri: `${rootUrl.ReactUrl}/upload/${item}` }}
                                            style={{
                                                width: imageWidth
                                                , height: imageWidth
                                            }} />
                                    </TouchableOpacity>)
                                })
                            }
                        </View>
                    </View>
                    <View style={{
                        width: SCREEN_WIDTH, paddingVertical: 15
                        , paddingRight: 35
                        , backgroundColor: 'white', minHeight: 150
                        , marginVertical: 10
                    }}>
                        <Text style={{
                            fontSize: 15, color: '#333333'
                            , marginBottom: 15, marginLeft: 20
                        }}><Text style={[{ fontSize: 14, color: 'red' }]}>*</Text>{`申诉描述`}</Text>
                        <View style={{
                            height: 1, width: SCREEN_WIDTH - 38
                            , marginLeft: 19, backgroundColor: '#EAEAEA'
                        }}></View>
                        {
                            SentencedToEmpty(this.props, ['editItem', 'Status'], 2) != 3 ?
                                <TextInput
                                    multiline={true}
                                    placeholder="请输入"
                                    style={{
                                        width: SCREEN_WIDTH - 40
                                        , marginTop: 15, height: 75, marginLeft: 20, textAlignVertical: 'top'
                                    }}
                                    onChangeText={text => this.setState({ supervisionInputString: text })}
                                >
                                    {`${this.state.supervisionInputString}`}
                                </TextInput>
                                : <Text style={{
                                    width: SCREEN_WIDTH - 40
                                    , marginTop: 15, height: 75, marginLeft: 20, textAlignVertical: 'top'
                                }}>
                                    {`${this.state.supervisionInputString}`}
                                </Text>
                        }

                    </View>
                    <View style={{
                        width: SCREEN_WIDTH, paddingVertical: 15
                        , paddingRight: 35, marginBottom: 10
                        , backgroundColor: 'white',
                    }}>
                        <Text style={{
                            fontSize: 15, color: '#333333'
                            , marginBottom: 15, marginLeft: 20
                        }}>{`申诉附件`}</Text>
                        <View style={{
                            height: 1, width: SCREEN_WIDTH - 38
                            , marginLeft: 19, backgroundColor: '#EAEAEA'
                        }}></View>
                        <ImageGrid style={{ paddingLeft: 10, paddingRight: 0, backgroundColor: '#fff', width: SCREEN_WIDTH, paddingTop: 20 }}
                            Imgs={Images} isUpload={SentencedToEmpty(this.props, ['editItem', 'Status'], 2) != 3}
                            isDel={SentencedToEmpty(this.props, ['editItem', 'Status'], 2) != 3} UUID={this.state.uuid}
                            delCallback={(key) => {
                                const delImgList = [...this.state.litimgList];
                                delImgList.splice(key, 1);
                                this.setState({ litimgList: delImgList });
                                let AttachID = SentencedToEmpty(this.props, ['editItem', 'RectificationAttachment', 'AttachID'], '');
                                if (AttachID != '') {
                                    this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
                                }
                            }}
                            uploadCallback={(images) => {
                                let addData = [];
                                images.map((item) => {
                                    addData.push(item.AttachID);
                                });
                                const uploadImgList = this.state.litimgList;
                                let newList = uploadImgList.concat(addData);
                                this.setState({ litimgList: newList });
                                let AttachID = SentencedToEmpty(this.props, ['editItem', 'RectificationAttachment', 'AttachID'], '');
                                if (AttachID != '') {
                                    this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
                                }
                            }}
                        />
                    </View>
                </ScrollView>
                {
                    SentencedToEmpty(this.props, ['editItem', 'Status'], 2) != 3 ? <View style={{
                        width: SCREEN_WIDTH, paddingVertical: 15
                        , paddingHorizontal: 20, flexDirection: 'row'
                        , alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        {
                            SentencedToEmpty(this.props, ['editItem', 'Status'], 2) == 5
                                ? <TouchableOpacity
                                    onPress={() => {
                                        this.refs.doAlert.show();
                                    }}
                                >
                                    <View style={{
                                        width: 135, height: 44
                                        , backgroundColor: '#FFB64D'
                                        , justifyContent: 'center', alignItems: 'center'
                                        , borderRadius: 5
                                    }}>
                                        <Text style={{
                                            fontSize: 17
                                            , color: '#ffffff'
                                        }}>{'撤回'}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            SentencedToEmpty(this.props, ['editItem', 'Status'], 2) == 5
                                ? <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.supervisionInputString == '') {
                                            ShowToast('申诉描述不能为空！');
                                            return;
                                        }
                                        this.props.dispatch(createAction('supervision/AppealInspectorRectificationInfo')({
                                            sendParams: {
                                                "ID": this.props.editItem.Id,
                                                "RectificationDescribe": this.state.supervisionInputString,
                                                "RectificationAttachment": this.state.uuid,
                                                "SubmitType": 1, // 0 暂存 1 提交
                                            },
                                            callback: () => {
                                                this.props.dispatch(createAction('supervision/updateState')({
                                                    inspectorRectificationInfoResult: { status: -1 }
                                                }));
                                                this.props.dispatch(NavigationActions.back());
                                                this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
                                            }
                                        }));
                                    }}
                                >
                                    <View style={{
                                        width: 135, height: 44
                                        , backgroundColor: '#4DA9FF'
                                        , justifyContent: 'center', alignItems: 'center'
                                        , borderRadius: 5
                                    }}>
                                        <Text style={{
                                            fontSize: 17
                                            , color: '#ffffff'
                                        }}>{'提交'}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                        }
                        {
                            SentencedToEmpty(this.props, ['editItem', 'Status'], 2) == 2
                                ? <TouchableOpacity
                                    onPress={() => {
                                        if (this.state.supervisionInputString == '') {
                                            ShowToast('申诉描述不能为空！');
                                            return;
                                        }
                                        this.props.dispatch(createAction('supervision/AppealInspectorRectificationInfo')({
                                            sendParams: {
                                                "ID": this.props.editItem.Id,
                                                "RectificationDescribe": this.state.supervisionInputString,
                                                "RectificationAttachment": this.state.uuid,
                                                "SubmitType": 1, // 0 暂存 1 提交
                                            },
                                            callback: () => {
                                                this.props.dispatch(createAction('supervision/updateState')({
                                                    inspectorRectificationInfoResult: { status: -1 }
                                                }));
                                                this.props.dispatch(NavigationActions.back());
                                                this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
                                            }
                                        }));
                                    }}
                                >
                                    <View style={{
                                        width: SCREEN_WIDTH - 40, height: 44
                                        , backgroundColor: '#4DA9FF'
                                        , justifyContent: 'center', alignItems: 'center'
                                        , borderRadius: 5
                                    }}>
                                        <Text style={{
                                            fontSize: 17
                                            , color: '#ffffff'
                                        }}>{'提交'}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                        }
                    </View> : null
                }
                <AlertDialog options={alertOptions} ref="doAlert" />
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
                        imageUrls={this.state.showUrls}
                        // index={0}
                        index={this.state.showImageIndex}
                    />
                </Modal>
            </View>
        )
    }
}
