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
export default class AlarmVerifyAnalyze1 extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '报警核实',
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
                    title: '有异常',
                    id: '2'
                },
                {
                    title: '系统误报',
                    id: '1'
                }
            ],
            IsRectificationRecordDataArray: [
                {
                    title: '是',
                    id: '1'
                },
                {
                    title: '否',
                    id: '0'
                }
            ],
            hideRadio: false,
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
            console.log(`${ImageUrlPrefix}${ProxyCode}/${fileName}`);
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
            this.setState(state => {
                // copy the map rather than modifying state.
                const imagelist = state.imagelist;
                const refresh = !state.refresh;
                let imgUrls = state.imgUrls;
                let newImagelist = imagelist.concat(img);
                let newImgUrls = [].concat(imgUrls);
                console.log('newImagelist = ', newImagelist);
                console.log('newImgUrls = ', newImgUrls);
                let fileName = '', tempArr = [];
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

    componentDidMount() {
        /**ModelGuid	ModelName
069ab699-428a-4f4b-8df7-915d6b4f3215	气态污染物波动大幅减小
0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827	数据零值微小波动
178fd470-ca31-480a-835a-3322fd57a4f0	设备或工控机断电
1a606047-6f21-4357-a459-03ef7788e09a	超过预设值数据恒定
1b9afa8d-1200-4fb1-aab0-a59936c3f22d	湿度异常陡降
1fed575c-48d7-4eef-9266-735fe4bbdb2a	气态污染物异常陡降
3568b3c6-d8db-42f1-bbff-e76406a67f7f	停运标记不符合停运特征
39680c93-e03f-42cf-a21f-115255251d4e	超过预设值波动变小
3d209ce2-da92-44c4-916b-8874d05da558	折算浓度异常
5520e6f2-ac4a-4f24-bafd-48746a13f4a4	疑似采样管线不密封
5bfd23c7-03da-4f4b-a258-a9c618774ab9	颗粒物浓度波动异常
6675e28e-271a-4fb7-955b-79bf0b858e8e	疑似数据标记异常
9104ab9f-d3f3-4bd9-a0d9-898d87def4dd	疑似采样管线断开
928ec327-d30d-4803-ae83-eab3a93538c1	机组停运未做停运标识
983cd7b9-55e1-47f3-b369-2df7bc0a6111	超过预设值有规律波动
a59cce2a-8558-4c42-8a45-4d8402e4b29d	计算公式或备案参数异常
ab2bf5ec-3ade-43fc-a720-c8fd92ede402	与其他监测数据高度一致
b52087fb-563c-4939-a11f-f86b10da63c1	超标时数据异常陡降
b9601a0f-22af-4a07-927f-82d6369f2e12	数据波动范围超行业特征
c0af25fb-220b-45c6-a3de-f6c8142de8f1	与其他监测数据趋势一致
c934b575-a357-4a2c-b493-02849ce9cee3	烟气排放量数值异常
cda1f2e2-ec5f-425b-93d2-94ba62b17146	数据恒定值微小波动
ce61d9a9-5d0d-4b66-abbd-72a89e823ee2	污染物排放量异常
d5dea4cc-bd6c-44fa-a122-a1f44514b465	与本设备历史数据高度一致
f021147d-e7c6-4c1d-9634-1d814ff9880a	多个污染物数据趋势一致 */
        const { WarningType } = this.alarmObj[0];
        if (WarningType == '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827' || WarningType == 'cda1f2e2-ec5f-425b-93d2-94ba62b17146' || WarningType == '178fd470-ca31-480a-835a-3322fd57a4f0') {
            let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
            newObj.CheckedResult = '2';
            //动态更新组件内state 记录输入内容
            this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
            this.setState({ hideRadio: true });
        }
        this.statusPageOnRefresh();
    }
    statusPageOnRefresh = () => { };
    getTypeOption = () => {
        let { UntruthReason } = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
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
        let { CheckedResult, IsRectificationRecord = '', CheckedDes, FileList } = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
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
                status={this.props.alarmVerifyDetail.status}
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
                    {this.state.hideRadio == false && (
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>核实结果</SDLText>
                            </View>
                            <SelectButton
                                editable={this.props.editCommitEnable}
                                style={{ flexDirection: 'row', width: 200 }} //整个组件的样式----这样可以垂直和水平
                                conTainStyle={{ height: 44, width: 80 }} //图片和文字的容器样式
                                imageStyle={{ width: 18, height: 18 }} //图片样式
                                textStyle={{ color: '#666' }} //文字样式
                                selectIndex={CheckedResult == '2' ? '0' : CheckedResult == '1' ? '1' : ''} //空字符串,表示不选中,数组索引表示默认选中
                                data={this.state.dataArray} //数据源
                                onPress={(index, item) => {
                                    let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
                                    newObj.CheckedResult = item.id;
                                    //动态更新组件内state 记录输入内容
                                    this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                                }}
                            />
                            {this.props.editCommitEnable == false ? <View style={{ position: 'absolute', width: '100%', height: '100%' }}></View> : null}
                        </View>
                    )}

                    {CheckedResult == '2' ? (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>异常原因</SDLText>
                            </View>
                            {this.props.editCommitEnable == true ? (
                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getTypeOption()}
                                    style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            ) : (
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    ) : null}
                    {CheckedResult == '2' ? <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <SDLText style={{ color: 'red' }}>*</SDLText>
                            <SDLText style={{}}>是否生成整改单</SDLText>
                        </View>
                        <SelectButton
                            editable={this.props.editCommitEnable}
                            style={{ flexDirection: 'row', width: 200 }} //整个组件的样式----这样可以垂直和水平
                            conTainStyle={{ height: 44, width: 80 }} //图片和文字的容器样式
                            imageStyle={{ width: 18, height: 18 }} //图片样式
                            textStyle={{ color: '#666' }} //文字样式
                            selectIndex={IsRectificationRecord == '0' ? '0' : IsRectificationRecord == '1' ? '1' : ''} //空字符串,表示不选中,数组索引表示默认选中
                            data={this.state.IsRectificationRecordDataArray} //数据源
                            onPress={(index, item) => {
                                let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
                                newObj.IsRectificationRecord = item.id;
                                //动态更新组件内state 记录输入内容
                                this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                            }}
                        />
                    </View> : null}
                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, marginTop: 1, backgroundColor: '#ffffff', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SDLText style={{ color: 'red' }}>*</SDLText>
                            <SDLText style={{}}>核实描述</SDLText>
                        </View>
                        <TextInput
                            editable={this.props.editCommitEnable}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text => {
                                let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
                                newObj.CheckedDes = text;
                                //动态更新组件内state 记录输入内容
                                this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                                this.setState({ VerifyMessage: text });
                            }}
                            value={CheckedDes}
                            multiline={true}
                            placeholder="请输入描述信息"
                            style={{ width: SCREEN_WIDTH - 26, backgroundColor: 'white', marginTop: 10, minHeight: 100, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 250, marginTop: 1, backgroundColor: '#ffffff', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <SDLText style={{ color: 'red' }}> </SDLText>
                            <SDLText style={{}}>核实材料</SDLText>
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
                                                        uuid: uuid,
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
                                    // IsRectificationRecord 是否生成整改单
                                    if (CheckedResult == '' || CheckedDes == '' || CheckedResult == null || CheckedDes == null || (CheckedResult == '2' && (this.state.selectUntruthReason == '' || IsRectificationRecord == ''))) {
                                        ShowToast('请完善相关信息');
                                        return;
                                    } else {
                                        let modelWarningGuids = [];
                                        this.alarmObj.map((item, index) => {
                                            modelWarningGuids.push(item.ID);
                                        });
                                        this.props.dispatch(
                                            createAction('alarmAnaly/commitVerify')({
                                                params: {
                                                    dgimn: this.alarmObj[0].DGIMN,
                                                    warningType: this.alarmObj[0].WarningType,
                                                    warningTime: this.alarmObj[0].WarningTime,
                                                    modelWarningGuid: this.alarmObj[0].modelCheckedGuid && this.alarmObj[0].modelCheckedGuid.length > 0 ? [] : modelWarningGuids,
                                                    modelCheckedGuid: this.alarmObj[0].modelCheckedGuid,
                                                    // ApprovalRemarks: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'CheckedDes'], ''),
                                                    checkedResult: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'CheckedResult'], ''),
                                                    checkedDes: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'CheckedDes'], ''),
                                                    IsRectificationRecord: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'IsRectificationRecord'], ''),
                                                    fileUuid: this.state.TimeS,
                                                    UntruthReason: SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'CheckedResult'], '') == '2' ? this.state.selectUntruthReason : ''
                                                },
                                                callback: () => {
                                                    if (this.alarmObj.length > 1) {
                                                        this.props.dispatch(NavigationActions.back('AlarmAnalyList'));
                                                    } else {
                                                        this.props.dispatch(NavigationActions.back());
                                                        this.props.dispatch(NavigationActions.back());
                                                    }
                                                    if (this.alarmObj[0].onRefresh) {
                                                        this.alarmObj[0].onRefresh();
                                                    }
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
                        <View>
                            <Text style={{ color: '#ee6666' }}>
                                说明：如发现的线索属于监测正常波动，现场工况、CEMS、数采仪一切正常（不存在设备故障、停产未标记等情况）且污染物及辅助参数数据波动正常，选择系统误报并提交。
                                如发现异常情况请选择【异常原因】，找不到相符的选项请选择“其他”并在【核实描述】中简述现场存在的异常，上传核实材料后提交核实结果。
                            </Text>
                        </View>
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
            </StatusPage >
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
