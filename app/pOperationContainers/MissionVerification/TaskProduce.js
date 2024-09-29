import React, { PureComponent } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Platform, TextInput, AsyncStorage, Modal, Text, ScrollView, PanResponder } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusPage, SelectButton, SimplePickerSingleTime, SDLText, SimplePicker, SimpleLoadingComponent, OperationAlertDialog } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, ShowLoadingToast, CloseToast, ShowToast, SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../config/globalconst';
import { SCREEN_HEIGHT } from '../../components/SDLPicker/constant/globalsize';
import globalcolor from '../../config/globalcolor';
import { getEncryptData, getRootUrl, getToken } from '../../dvapack/storage';
import { generateRdStr, random5 } from '../../gridModels/mathUtils';
import { WebView } from 'react-native-webview';
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
let editSi = {};
let editSiIndex = 0;
/**
 * 任务生成
 */
@connect(({ abnormalTask }) => ({
    checkPlanList: abnormalTask.checkPlanList,
    checkUserList: abnormalTask.checkUserList,
    takeFlagList: abnormalTask.takeFlagList,

    commitVerifyResult: abnormalTask.commitVerifyResult,
    alarmVerifyDetail: abnormalTask.alarmVerifyDetail,
    editCommitEnable: abnormalTask.editCommitEnable
}))
export default class TaskProduce extends PureComponent {
    constructor(props) {
        super(props);
        that = this;
        this.alarmObj = SentencedToEmpty(this.props, ['route', 'params', 'params'], {});
        this.state = {
            //选择需要生成任务
            selectPlan: null, //选中的核查方案
            selectUser: null, //选中的核查人
            planItems: [], //方案执行步骤
            FileUuidArray: [], //方案步骤图片uuid数组

            //无需生成任务
            selectPreTakeFlag: null, //选中的专家意见
            selectSubPreTakeFlag: null, //选中的具体意见
            selectCheckResult: null, //是否符合线索
            selectPauseGivingClues: null,
            CheckConclusion: '', //核查结论

            showImages: [],
            showImageIndex: 0,
            modalVisible: false,

            //其他数据源
            dataArray: [
                {
                    title: '需要',
                    id: '1'
                },
                {
                    title: '不需要',
                    id: '2'
                }
            ],

            hideRadio: false,
            imagelist: [],
            imgUrls: [],
            selectUntruthReason: '',
            modalVisible: false
        };


        props.navigation.setOptions({
            title: '任务生成',
            headerRight: () => props.route.params.params.headerRight
        });
    }

    renderPickedImage = (si, idx) => {
        const rtnVal = [];
        const ProxyCode = getEncryptData();

        si.planItemAttachment.map((item, key) => {
            const source = item.FileName != '' ? { uri: `${ImageUrlPrefix}${ProxyCode}/${item.FileName}` } : require('../../images/addpic.png');
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

    componentWillUnmount() {
        this.props.dispatch(createAction('abnormalTask/updateState')({ alarmVerifyDetail: { status: 200 } }));
    }

    statusPageOnRefresh() {
        this.props.dispatch(createAction('abnormalTask/GetPlanDatas')({}));
        this.props.dispatch(createAction('abnormalTask/GetPreTakeFlagDatas')({}));
    }
    componentDidMount() {
        this.statusPageOnRefresh();
    }

    getPauseGivingCluesOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择暂停发出线索',
            codeKey: 'code',
            hideImg: true,
            nameKey: 'label',
            defaultCode: null,
            dataArr: [
                { label: '一周', code: '1' },
                { label: '一个月', code: '2' },
            ],
            onSelectListener: item => {
                // console.log('PreSubFlagPicker = ', this.PreSubFlagPicker)
                // this.setState({
                //     selectPreTakeFlag: item
                // });
                // SentencedToEmpty(this.PreSubFlagPicker, ['setDataArr'], () => { })(item.ChildrenFlags);
                this.setState({
                    selectPauseGivingClues: item.code
                });
            }
        };
    }

    getPreFlagOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择专家意见',
            codeKey: 'FlagCode',
            hideImg: true,
            nameKey: 'FlagName',
            defaultCode: null,
            dataArr: this.props.takeFlagList,
            onSelectListener: item => {
                console.log('PreSubFlagPicker = ', this.PreSubFlagPicker)
                this.setState({
                    selectPreTakeFlag: item
                });
                SentencedToEmpty(this.PreSubFlagPicker, ['setDataArr'], () => { })(item.ChildrenFlags);
            }
        };
    };
    getPreSubFlagOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择专家意见',
            codeKey: 'FlagCode',
            hideImg: true,
            nameKey: 'FlagName',
            defaultCode: null,
            dataArr: this.state.selectPreTakeFlag.ChildrenFlags,
            onSelectListener: item => {
                this.setState({
                    selectSubPreTakeFlag: item
                });
            }
        };
    };

    getCheckListOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择执行方案',
            codeKey: 'PlanCode',
            hideImg: true,
            nameKey: 'PlanName',
            defaultCode: null,
            dataArr: [
                {
                    PlanCode: null,
                    PlanName: '临时自定义方案',
                    PlanContent: null,
                    PlanItemDatas: []
                },
                ...this.props.checkPlanList
            ],
            onSelectListener: item => {
                let selectPlanArr = [];
                let uuidArr = [];

                item.PlanItemDatas.map(sItem => {
                    selectPlanArr.push({
                        planItemCode: sItem.PlanItemCode,
                        planItemContent: sItem.QTitle,
                        planItemDesc: sItem.QContent,
                        planItemAttachment: sItem.QAttachment
                    });
                    if (sItem.QAttachment && sItem.QAttachment.length > 0) {
                        uuidArr.push(sItem.QAttachment[0].FileUuid);
                        //   uuidArr.push(generateRdStr());
                    } else {
                        uuidArr.push(generateRdStr());
                    }
                });
                this.setState({
                    selectPlan: item,
                    planItems: selectPlanArr,
                    FileUuidArray: uuidArr
                });
                if (item.PlanName == '临时自定义方案') {
                    this.setState({
                        planItems: [
                            {
                                planItemCode: '',
                                planItemContent: '',
                                planItemDesc: '',
                                planItemAttachment: []
                            }
                        ],
                        FileUuidArray: [generateRdStr()]
                    });
                }
            }
        };
    };
    getUserListOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择核查人',
            codeKey: 'UserID',
            hideImg: true,
            nameKey: 'UserName',
            dataArr: this.props.checkUserList,
            onSelectListener: item => {
                this.setState({
                    selectUser: item
                });
            }
        };
    };
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
                                this.refs.doAlert.show();
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
    render() {
        let { CheckedResult } = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null });
        let {
            selectPlan,
            selectUser,
            planItems,
            selectPreTakeFlag,
            selectSubPreTakeFlag, //选中的具体意见
            selectCheckResult, //是否符合线索
            CheckConclusion
        } = this.state;
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
        console.log('planItems = ', this.state.planItems);
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
                <ScrollView
                    nestedScrollEnabled={true}
                    // scrollEnabled={this.state.scrollEnabled}
                    // scrollEnabled={scrollEnabled}
                    style={[{ flex: 1, paddingTop: 13 }]} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <SDLText style={{}}>企业</SDLText>
                        </View>
                        <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{SentencedToEmpty(this.alarmObj, [0, 'EntName'], '')}</SDLText>
                    </View>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <SDLText style={{}}>排口</SDLText>
                        </View>
                        <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{SentencedToEmpty(this.alarmObj, [0, 'PointName'], '')}</SDLText>
                    </View>
                    {this.state.hideRadio == false && (
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>现场核查</SDLText>
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
                                    if (item.id == '2') {
                                        this.setState({ selectPlan: null });
                                    }
                                    let newObj = SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas'], { CheckedResult: null, CheckedDes: null, FileList: [] });
                                    newObj.CheckedResult = item.id;
                                    //动态更新组件内state 记录输入内容
                                    this.props.dispatch(createAction('abnormalTask/updateState')({ alarmVerifyDetail: { ...this.props.alarmVerifyDetail, data: { Datas: newObj } } }));
                                }}
                            />
                            {this.props.editCommitEnable == false ? <View style={{ position: 'absolute', width: '100%', height: '100%' }}></View> : null}
                        </View>
                    )}

                    {CheckedResult == '2' && (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                <SDLText style={{}}>暂停发出线索</SDLText>
                            </View>
                            {this.props.editCommitEnable == true ? (
                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getPauseGivingCluesOption()}
                                    style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            ) : (
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    )}

                    {this.props.takeFlagList.length > 0 && (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                <SDLText style={{}}>专家意见</SDLText>
                            </View>
                            {this.props.editCommitEnable == true ? (
                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getPreFlagOption()}
                                    style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            ) : (
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    )}
                    {this.state.selectPreTakeFlag != null
                        && SentencedToEmpty(this.state, ['selectPreTakeFlag', 'FlagCode'], '') != 8 ? (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                <SDLText style={{}}>详细意见</SDLText>
                            </View>
                            {this.props.editCommitEnable == true ? (
                                <SimplePicker
                                    ref={ref => {
                                        this.PreSubFlagPicker = ref;
                                    }}
                                    option={this.getPreSubFlagOption()}
                                    style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            ) : (
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    ) : null}
                    {CheckedResult == '2' && (
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, marginTop: 1, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>与线索是否符合</SDLText>
                            </View>
                            <SelectButton
                                editable={this.props.editCommitEnable}
                                style={{ flexDirection: 'row', width: 250 }} //整个组件的样式----这样可以垂直和水平
                                conTainStyle={{ height: 44, width: 80 }} //图片和文字的容器样式
                                imageStyle={{ width: 18, height: 18 }} //图片样式
                                textStyle={{ color: '#666' }} //文字样式
                                selectIndex={''} //空字符串,表示不选中,数组索引表示默认选中
                                data={[
                                    {
                                        title: '符合',
                                        id: '1'
                                    },
                                    {
                                        title: '部分符合',
                                        id: '2'
                                    },
                                    {
                                        title: '不符合',
                                        id: '3'
                                    }
                                ]} //数据源
                                onPress={(index, item) => {
                                    this.setState({
                                        selectCheckResult: item.id
                                    });
                                }}
                            />
                            {this.props.editCommitEnable == false ? <View style={{ position: 'absolute', width: '100%', height: '100%' }}></View> : null}
                        </View>
                    )}
                    {CheckedResult == '2' && (
                        <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, marginTop: 1, backgroundColor: '#ffffff', paddingHorizontal: 13, paddingVertical: 5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>核查结论</SDLText>
                            </View>
                            <TextInput
                                editable={this.props.editCommitEnable}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                underlineColorAndroid={'transparent'}
                                onChangeText={text => {
                                    this.setState({ CheckConclusion: text });
                                }}
                                value={this.state.CheckConclusion}
                                multiline={true}
                                placeholder="请输入核查结论"
                                style={{ width: SCREEN_WIDTH - 26, backgroundColor: 'white', marginTop: 10, minHeight: 60, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                            />
                        </View>
                    )}
                    {CheckedResult == '1' ? (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>核查方案</SDLText>
                            </View>
                            {this.props.editCommitEnable == true ? (
                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getCheckListOption()}
                                    style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            ) : (
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    ) : null}

                    {CheckedResult == '1' ? (
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', padding: 13, height: 50, justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <SDLText style={{ color: 'red' }}>*</SDLText>
                                <SDLText style={{}}>核查人</SDLText>
                            </View>

                            {this.props.editCommitEnable == true ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'CheckRoleList',
                                                params: {
                                                    callback: item => {
                                                        this.setState({
                                                            selectUser: item
                                                        });
                                                    }
                                                }
                                            })
                                        );
                                    }}
                                    style={{ flexDirection: 'row', alignItems: 'center', width: 80 }}
                                >
                                    <Text style={{ color: '#666' }}>{(this.state.selectUser && this.state.selectUser.UserName) || '请选择'}</Text>
                                    <Image style={{ width: 10, height: 10, marginLeft: 15 }} source={require('../../images/ic_filt_arrows.png')} />
                                </TouchableOpacity>
                            ) : (
                                // <SimplePicker
                                //     ref={ref => {
                                //         this.simplePicker = ref;
                                //     }}
                                //     option={this.getUserListOption()}
                                //     style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                //     textStyle={{ textAlign: 'right', flex: 1 }}
                                // />
                                <Text>{SentencedToEmpty(this.props.alarmVerifyDetail, ['data', 'Datas', 'UntruthReason'], '')}</Text>
                            )}
                        </View>
                    ) : null}
                    {this.state.selectPlan != null && this.state.selectPlan.PlanContent && (
                        <View style={{ marginTop: 10, backgroundColor: '#fff', paddingBottom: 10 }}>
                            <View style={{ flexDirection: 'row', padding: 13, alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 3, height: 14, backgroundColor: '#4AA0FF' }}></View>
                                    <SDLText style={{ marginLeft: 5 }}>核查内容及信息：</SDLText>
                                </View>
                            </View>
                            <View
                                style={{ width: SCREEN_WIDTH, height: 200, backgroundColor: '#' }}>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{
                                        html: `<html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"></head>${this.state.selectPlan.PlanContent}<ml>`
                                    }}
                                />
                            </View>
                        </View>
                    )}

                    {this.state.selectPlan != null && (
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
                        </View>
                    )}

                    <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 250, marginTop: 1, backgroundColor: '#ffffff', padding: 13 }}>
                        {this.props.editCommitEnable == true ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (
                                        CheckedResult == null ||
                                        (selectPlan == null && CheckedResult == '1') ||
                                        (selectUser == null && CheckedResult == '1') ||
                                        // selectSubPreTakeFlag == null ||
                                        (selectCheckResult == null && CheckedResult == '2') ||
                                        (CheckConclusion == '' && CheckedResult == '2')
                                    ) {
                                        ShowToast('请完善相关信息');
                                        return;
                                    } else {
                                        let modelWarningGuids = [];
                                        let planEmpty = -1;
                                        this.alarmObj.map((item, index) => {
                                            modelWarningGuids.push(item.WarningCode);
                                        });
                                        if (CheckedResult == '1') {
                                            // 现场核查  1    需要
                                            let newplanItems = [];
                                            planItems.map((item, index) => {
                                                newplanItems.push({ ...item, planItemAttachment: this.state.FileUuidArray[index] });
                                                if (item.planItemContent == '' || item.planItemDesc == '') {
                                                    planEmpty = index;
                                                }
                                            });
                                            if (planEmpty > -1) {
                                                ShowToast(`请完善核查动作第${planEmpty + 1}计划项`);
                                                return;
                                            }
                                            this.props.dispatch(
                                                createAction('abnormalTask/AddPlanTask')({
                                                    params: {
                                                        planAction: 3,
                                                        isSceneCheck: CheckedResult,
                                                        isSavePlan: 2,
                                                        preTakeFlag: SentencedToEmpty(this.state, ['selectPreTakeFlag', 'FlagCode'], '') == 8 ? 8
                                                            : SentencedToEmpty(selectSubPreTakeFlag, ['FlagCode'], ''),
                                                        checkResult: null,
                                                        checkConclusion: null,
                                                        checkReason: null,
                                                        checkUserId: selectUser.UserID,
                                                        createUserId: getToken().UserId,
                                                        checkPlan: {
                                                            planCode: selectPlan.PlanCode,
                                                            planName: selectPlan.PlanName,
                                                            planContent: selectPlan.PlanContent,
                                                            planItems: newplanItems
                                                        },
                                                        warningCodes: modelWarningGuids.join(',')
                                                    },
                                                    callback: () => {
                                                        this.props.dispatch(NavigationActions.back());
                                                        if (this.alarmObj[0].onRefresh) {
                                                            this.alarmObj[0].onRefresh();
                                                        }
                                                    }
                                                })
                                            );
                                        } else {
                                            // 现场核查     2   不需要
                                            let _params = {
                                                planAction: 3,
                                                isSceneCheck: CheckedResult,
                                                preTakeFlag: SentencedToEmpty(selectSubPreTakeFlag, ['FlagCode'], ''),
                                                checkResult: selectCheckResult,
                                                checkConclusion: CheckConclusion,
                                                createUserId: getToken().UserId,
                                                warningCodes: modelWarningGuids.join(',')
                                            };

                                            if (this.state.selectPauseGivingClues == 1) {
                                                // 一周
                                                _params.StopBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
                                                _params.StopEndTime = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
                                            } else if (this.state.selectPauseGivingClues == 2) {
                                                // 一个月
                                                _params.StopBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
                                                _params.StopEndTime = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
                                            }
                                            this.props.dispatch(
                                                createAction('abnormalTask/AddPlanTask')({
                                                    // params: {
                                                    //     planAction: 3,
                                                    //     isSceneCheck: CheckedResult,
                                                    //     preTakeFlag: selectSubPreTakeFlag.FlagCode,
                                                    //     checkResult: selectCheckResult,
                                                    //     checkConclusion: CheckConclusion,
                                                    //     createUserId: getToken().UserId,
                                                    //     warningCodes: modelWarningGuids.join(',')
                                                    // },
                                                    params: _params,
                                                    callback: () => {
                                                        this.props.dispatch(NavigationActions.back());
                                                        if (this.alarmObj[0].onRefresh) {
                                                            this.alarmObj[0].onRefresh();
                                                        }
                                                    }
                                                })
                                            );
                                        }
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

                    {this.props.commitVerifyResult.status == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                </ScrollView>

                <OperationAlertDialog options={dialogOptions} ref="doAlert" />
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
                        imageUrls={this.state.showImages}
                        index={this.state.showImageIndex}
                    />
                </Modal>
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
