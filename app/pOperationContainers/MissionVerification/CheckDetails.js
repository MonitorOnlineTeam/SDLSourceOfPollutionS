import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image, ScrollView, TextInput, Platform, Modal } from 'react-native';
import { connect } from 'react-redux';
import { StatusPage, FlatListWithHeaderAndFooter, SDLText, OperationAlertDialog, SimplePicker, AlertDialog, SelectButton } from '../../components';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast, ShowLoadingToast, CloseToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getEncryptData } from '../../dvapack/storage';
import { ImageUrlPrefix } from '../../config';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SyanImagePicker from 'react-native-syan-image-picker';
import { generateRdStr, random5 } from '../../gridModels/mathUtils';
import globalcolor from '../../config/globalcolor';
import ImageViewer from 'react-native-image-zoom-viewer';
import { WebView } from 'react-native-webview';
import moment from 'moment';
let that;
let editSi = {};
let editSiIndex = 0;
const androidPicOptions = {
    mediaType: 'photo',
    // title: '选择照片',
    // cancelButtonTitle: '关闭',
    // takePhotoButtonTitle: '打开相机',
    // chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    selectionLimit: 5,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

@connect(({ abnormalTask }) => ({
    chekTaskDetail: abnormalTask.chekTaskDetail,
    takeFlagList: abnormalTask.takeFlagList
}))
export default class CheckDetails extends Component {
    constructor(props) {
        super(props);
        that = this;
        this.state = {
            editCommitEnable: props.route.params.params.editCommitEnable,
            showError: false,
            showImages: [],
            showImageIndex: 0,
            modalVisible: false,
            selectPreTakeFlag: null, //选中的专家意见
            selectSubPreTakeFlag: null, //选中的具体意见
            selectCheckResult: null, //是否符合线索
            selectPauseGivingClues: null, //是否暂停发放线索
            CheckConclusion: '', //核查结论
            planItems: [], //方案执行步骤
            UuidArray: [], //图片回传uuid
            basicInfo: [
                {
                    name: '创建人',
                    code: 'CreateUserName'
                },
                {
                    name: '企业',
                    code: 'EntName'
                },
                {
                    name: '创建时间',
                    code: 'CreateTime'
                },
                {
                    name: '排口',
                    code: 'PointName'
                },
                {
                    name: '是否生成核查任务',
                    code: 'IsRectificationRecordName'
                },
                {
                    name: '场景类型',
                    code: 'WarningTypeName'
                }
            ],
            oldPlanList: [], // 被打回的核查动作记录
            currentPlanItems: [], // 当前核查动作记录
            IsRectificationRecord: -1, // 是否生成核查任务
        };


        props.navigation.setOptions({
            title: '核查详情',
        });
    }
    componentDidMount() {
        this.statusPageOnRefresh();
    }
    statusPageOnRefresh() {
        this.props.dispatch(
            createAction('abnormalTask/GetCheckedView')({
                id: this.props.route.params.params.item.ID
            })
        );
        this.props.dispatch(createAction('abnormalTask/GetPreTakeFlagDatas')({}));
    }
    componentWillReceiveProps(nextProps) {
        let { checkInfo, Plan, finalResult } = SentencedToEmpty(nextProps.chekTaskDetail, ['data', 'Datas'], {});
        let uuidArr = [];
        let oldPlanList = [], groupArray = []
            , oIndex = -1, currentPlanItems = [];
        if (Plan) {
            Plan.PlanItem.map((item, index) => {
                if (!item.Flag) {
                    oIndex = groupArray.findIndex((gitem, gindex) => {
                        return item.TableType == gitem;
                    });
                    if (oIndex == -1) {
                        groupArray.push(item.TableType);
                        oldPlanList.push({
                            RepulseUserName: item.RepulseUserName,
                            RepulseTime: item.RepulseTime,
                            oldPlanItems: [item]
                        })
                    } else {
                        oldPlanList[oIndex].oldPlanItems.push(item);
                    }
                } else {
                    currentPlanItems.push(item);
                    uuidArr.push(item.ReAttachment.AttachUuid || generateRdStr());
                }
                // uuidArr.push(item.ReAttachment.AttachUuid || generateRdStr());
            });
            this.setState({ currentPlanItems, oldPlanList, planItems: Plan.PlanItem, UuidArray: uuidArr });
        }
    }

    renderPickedImage = (si, type, idx) => {
        const rtnVal = [];
        const ProxyCode = getEncryptData();
        let showImages = [];
        if (type == 'A') {
            showImages = si.QAttachment.ImgNameList;
        } else {
            showImages = si.ReAttachment.ImgNameList;
        }
        showImages.map((item, key) => {
            const source = item ? { uri: `${ImageUrlPrefix}${ProxyCode}/${item}` } : require('../../images/addpic.png');
            rtnVal.push(
                <View style={{ alignItems: 'center' }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: (SCREEN_WIDTH - 86) / 3, height: (SCREEN_WIDTH - 86) / 3, margin: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            let showImageArr = [];
                            showImages.map((sitem, skey) => {
                                showImageArr.push({ url: `${ImageUrlPrefix}${ProxyCode}/${sitem}` });
                            });

                            this.setState({
                                modalVisible: true,
                                showImageIndex: key,
                                showImages: showImageArr
                            });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: (SCREEN_WIDTH - 86) / 3, width: (SCREEN_WIDTH - 86) / 3 }]} />
                    </TouchableOpacity>
                    {this.state.editCommitEnable == true && type == 'R' ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    createAction('abnormalTask/DelPhotoRelation')({
                                        params: {
                                            code: item,
                                            callback: () => {
                                                let newImages = si.ReAttachment.ImgNameList;
                                                newImages.splice(key, 1);
                                                // let newplanItems = this.state.planItems;
                                                let newplanItems = this.state.currentPlanItems;
                                                si.ReAttachment.ImgNameList = newImages;
                                                newplanItems[idx] = si;
                                                this.setState({ planItems: newplanItems }, () => {
                                                    this.forceUpdate();
                                                });
                                                // this.statusPageOnRefresh();
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
    renderCheckStep = (si, idx) => {
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#ffffff', flexWrap: 'wrap', marginBottom: 10, paddingHorizontal: 13 }}>
                <Text style={{ color: '#333', width: SCREEN_WIDTH - 46 }}>{`步骤${idx + 1}：${SentencedToEmpty(si, ['QTitle'], '')}`}</Text>

                <Text style={{ lineHeight: 19, color: '#666666', marginTop: 10, width: SCREEN_WIDTH - 46 }}>{`${SentencedToEmpty(si, ['QContent'], '')}`}</Text>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH - 46, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginTop: 5 }}>{this.renderPickedImage(si, 'A')}</View>

                <View style={{ flexDirection: 'column', marginTop: 1, backgroundColor: '#ffffff', paddingVertical: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <SDLText style={{ color: 'red' }}>*</SDLText>
                        <SDLText style={{}}>填写核查结果</SDLText>
                    </View>
                    <TextInput
                        editable={this.state.editCommitEnable}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        onChangeText={text => {
                            // let newplanItems = this.state.planItems;
                            let newplanItems = this.state.currentPlanItems;
                            si.ReContent = text;
                            newplanItems[idx] = si;
                            // this.setState({ planItems: newplanItems, ReContent: text }, () => {
                            this.setState({ currentPlanItems: newplanItems, ReContent: text }, () => {
                                this.forceUpdate();
                            });
                        }}
                        value={si.ReContent}
                        multiline={true}
                        placeholder="请输入描述信息"
                        placeholderTextColor={'#999999'}
                        style={{ width: SCREEN_WIDTH - 56, backgroundColor: 'white', marginTop: 10, minHeight: 60, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                    />
                </View>
                {si.ReAttachment && si.ReAttachment.ImgNameList.length > 0 && <SDLText style={{}}>上传凭据</SDLText>}
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginTop: 5 }}>
                    {this.renderPickedImage(si, 'R', idx)}
                    {this.state.editCommitEnable == true && (
                        <TouchableOpacity
                            onPress={() => {
                                editSi = si;
                                editSiIndex = idx;
                                if (Platform.OS == 'ios') {
                                    SyanImagePicker.showImagePicker({ imageCount: 15 }, (err, selectedPhotos) => {
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
                                                    uuid: this.state.UuidArray[idx],
                                                    callback: (img, isSuccess) => {
                                                        this.uploadImageCallBack(img, isSuccess, si, idx);
                                                    }
                                                })
                                            );
                                        }
                                    });
                                    return;
                                }
                                SyanImagePicker.showImagePicker({ imageCount: 15 }, (err, selectedPhotos) => {
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
                                                uuid: this.state.UuidArray[idx],
                                                callback: (img, isSuccess) => {
                                                    this.uploadImageCallBack(img, isSuccess, si, idx);
                                                }
                                            })
                                        );
                                    }
                                });
                                // this.refs.doAlert.show();
                            }}
                            style={{ width: (SCREEN_WIDTH - 86) / 3, height: (SCREEN_WIDTH - 86) / 3 }}
                        >
                            <Image source={require('../../images/addpic.png')} style={{ width: (SCREEN_WIDTH - 86) / 3, height: (SCREEN_WIDTH - 86) / 3, marginLeft: 10, marginBottom: 5 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };
    uploadImageCallBack = (images, isSuccess, si, idx) => {
        si = editSi;
        idx = editSiIndex;
        if (isSuccess) {
            let newImages = si.ReAttachment.ImgNameList;
            images.map(img => {
                newImages.push(img.attachID);
            });

            // let newplanItems = this.state.planItems;
            let newplanItems = this.state.currentPlanItems;
            si.ReAttachment.ImgNameList = newImages;
            newplanItems[idx] = si;
            // this.setState({ planItems: newplanItems }, () => {
            this.setState({ currentPlanItems: newplanItems }, () => {
                this.forceUpdate();
            });
            ShowToast('上传成功');
        } else {
            ShowToast('上传失败！');
        }
    };
    UpdatePlanItem(stype) {
        let newplanItems = [];
        let showError = false;
        // this.state.planItems.map((item, index) => {
        this.state.currentPlanItems.map((item, index) => {
            if (item.Flag) {
                newplanItems.push({
                    modelPlanItemGuid: item.ID,
                    reContent: item.ReContent,
                    reAttachment: this.state.UuidArray[index]
                });

                if (item.ReContent == '' || item.ReContent == null || item.ReContent.length == 0) {
                    showError = true;
                }
            }
        });
        if (showError == true) {
            ShowToast('请填写每个步骤的核查结果！');
            return;
        }

        this.props.dispatch(
            createAction('abnormalTask/UpdatePlanItem')({
                params: {
                    stype: stype,
                    modelCheckedGuid: this.props.route.params.params.item.ModelCheckedGuid,
                    planItems: newplanItems
                },
                callback: () => {
                    if (stype == '2') {
                        this.props.dispatch(NavigationActions.back());
                        this.props.route.params.params.onRefresh();
                    }
                }
            })
        );
    }
    cancelButton(stype) {
        that.setState({ selectSubPreTakeFlag: null, selectCheckResult: null, CheckConclusion: '', selectPreTakeFlag: null, showError: false });
    }
    CheckConfirm(stype) {
        if (
            // that.state.selectSubPreTakeFlag == null || 
            that.state.selectCheckResult == null || that.state.CheckConclusion == '') {
            that.setState({ showError: true });
            return;
        }

        let _params = {
            modelCheckedGuid: that.props.route.params.params.item.ModelCheckedGuid,
            // flag: that.state.selectSubPreTakeFlag.FlagCode,
            flag: SentencedToEmpty(that.state, ['selectSubPreTakeFlag', 'FlagCode'], ''),
            checkedResult: that.state.selectCheckResult,
            checkedDes: that.state.CheckConclusion
        };
        if (that.state.IsRectificationRecord == 1
            || (typeof that.state.IsRectificationRecord == 'number'
                && that.state.IsRectificationRecord == 0)
        ) {
            _params.IsRectificationRecord = that.state.IsRectificationRecord;// 1需要 0不需要
        } else {
            // ShowToast('是否需要生成整改单为必填项！');
            that.setState({ showError: true });
            return;
        }
        if (that.state.selectPauseGivingClues == 1) {
            // 一周
            _params.StopBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
            _params.StopEndTime = moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss');
        } else if (that.state.selectPauseGivingClues == 2) {
            // 一个月
            _params.StopBeginTime = moment().format('YYYY-MM-DD HH:mm:ss');
            _params.StopEndTime = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');
        }

        that.props.dispatch(
            createAction('abnormalTask/CheckConfirm')({
                // params: {
                //     modelCheckedGuid: that.props.navigation.state.params.item.ModelCheckedGuid,
                //     // flag: that.state.selectSubPreTakeFlag.FlagCode,
                //     flag: SentencedToEmpty(that.state, ['selectSubPreTakeFlag', 'FlagCode'], ''),
                //     checkedResult: that.state.selectCheckResult,
                //     checkedDes: that.state.CheckConclusion
                // },
                params: _params,
                callback: () => {
                    that.props.dispatch(NavigationActions.back());
                    that.props.route.params.params.onRefresh();
                }
            })
        );
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
                this.setState({
                    selectPreTakeFlag: item
                });
            }
        };
    };
    getPauseGivingCluesOption = () => {
        return {
            contentWidth: 166,
            placeHolder: '请选择暂停发出线索',
            codeKey: 'code',
            hideImg: true,
            nameKey: 'label',
            defaultCode: this.state.selectPauseGivingClues,
            dataArr: [
                { label: '一周', code: '1' },
                { label: '一个月', code: '2' },
            ],
            onSelectListener: item => {
                this.setState({
                    selectPauseGivingClues: item.code
                });
            }
        };
    }
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
    renderOldPlan = (_oItem, _oIndex) => {
        return (<TouchableOpacity
            onPress={() => {
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'RepulseCheckList',
                    params: {
                        data: _oItem
                    }
                }));
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 50, backgroundColor: '#ffffff'
                    , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: 5, paddingHorizontal: 16
                }]}
            >
                <SDLText>{`${_oItem.RepulseUserName}在${_oItem.RepulseTime}打回`}</SDLText>
                <Image
                    style={[{ width: 16, height: 16 }]}
                    source={require('../../images/ic_arrows_right.png')}
                />
            </View>
        </TouchableOpacity>);
    }
    render() {
        let { checkInfo, Plan, finalResult } = SentencedToEmpty(this.props.chekTaskDetail, ['data', 'Datas'], {});
        const currentPlanItems = this.state.currentPlanItems;
        var options = {
            headTitle: '确认信息',
            messText: '',
            alertDialogHideCallback: this.cancelButton,
            innersHeight: 560,
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
                    openDialog: true,
                    onpress: this.CheckConfirm
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
                        launchCamera(androidPicOptions, response => {
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
                                        uuid: this.state.UuidArray[editSiIndex],
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
                        launchImageLibrary(androidPicOptions, response => {
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
                                        uuid: this.state.UuidArray[editSiIndex],
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
                status={SentencedToEmpty(this.props.chekTaskDetail, ['status'], -1)}
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
                {checkInfo && (
                    <ScrollView>
                        <View style={{ minHeight: 108, width: '100%', backgroundColor: '#fff', padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[{ color: '#333333', fontSize: 15, maxWidth: SCREEN_WIDTH - 80 }]}>{`方案：${Plan.PlanName}`}</Text>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: 10,
                                        backgroundColor: checkInfo.StatusName == '待核查' ? '#4AA0FF50' : checkInfo.StatusName == '待确认' ? '#FF930650' : '#34d39950',
                                        padding: 3
                                    }}
                                >
                                    <Text style={[{ color: checkInfo.StatusName == '待核查' ? '#4AA0FF' : checkInfo.StatusName == '待确认' ? '#FF9306' : '#34d399', fontSize: 12 }]}>{checkInfo.StatusName}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {this.state.basicInfo.map((item, index) => {
                                    return <Text style={{ width: '50%', marginTop: 5, fontSize: 12, color: '#666666', lineHeight: 15 }}>{`${item.name}：${checkInfo[item.code]}`}</Text>;
                                })}
                            </View>
                        </View>

                        <View style={{ minHeight: 108, width: '100%', backgroundColor: '#fff', marginTop: 5, padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 3, height: 14, backgroundColor: '#4AA0FF' }}></View>
                                <Text style={{ marginLeft: 10, fontSize: 15, color: '#333' }}>线索详情</Text>
                            </View>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                {finalResult.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.dispatch(
                                                    NavigationActions.navigate({
                                                        routeName: 'ClueDetail',
                                                        params: { ...item, onRefresh: null, DGIMN: item.Dgimn }
                                                    })
                                                );
                                            }}
                                            style={{ justifyContent: 'space-between', minHeight: 120, paddingHorizontal: 13 }}
                                        >
                                            <Text style={{ color: '#666666', lineHeight: 20 }}>{`企业：${item.EntName}`}</Text>
                                            <Text style={{ color: '#666666', lineHeight: 20 }}>{`排口：${item.PointName}`}</Text>
                                            <Text style={{ color: '#666666', lineHeight: 20 }}>{`发现时间：${item.WarningTime}`}</Text>
                                            <Text style={{ color: '#666666', lineHeight: 20 }}>{`场景类别：${item.WarningTypeName}`}</Text>
                                            <Text style={{ color: '#666666', lineHeight: 20 }}>{`内容：${item.WarningContent}`}</Text>
                                            {index == finalResult.length - 1 ? null : <View style={{ backgroundColor: '#ccc', height: 0.5, width: '100%', marginBottom: 10, marginTop: 10 }}></View>}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        <View style={{ minHeight: 108, width: '100%', backgroundColor: '#fff', marginTop: 5, padding: 13 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 3, height: 14, backgroundColor: '#4AA0FF' }}></View>
                                <Text style={{ marginLeft: 10, fontSize: 15, color: '#333' }}>方案及核查信息</Text>
                            </View>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, paddingHorizontal: 13 }}>
                                <View style={{ justifyContent: 'space-between', minHeight: 60 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
                                        <Text style={{ color: '#666666' }}>{`核查状态：${checkInfo.StatusName}`}</Text>
                                        <Text style={{ color: '#666666' }}>{`核查人：${checkInfo.CheckUserName}`}</Text>
                                    </View>

                                    <Text style={{ color: '#666666' }}>{`核查时间：${checkInfo.CheckedTime || '-'}`}</Text>
                                    <Text style={{ color: '#666666' }}>{`核查结论：${checkInfo.CheckedResult || '-'}`}</Text>
                                    <Text style={{ color: '#666666' }}>{`描述：${checkInfo.CheckedDes || '-'}`}</Text>
                                    {Plan.ContentBody && Plan.ContentBody.length > 0 ? (
                                        <View style={{ width: SCREEN_WIDTH - 50, borderWidth: 0.5, borderBlockColor: '#ccc', height: 150, marginTop: 5 }}>
                                            <WebView
                                                source={{
                                                    html: `<html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"></head>${Plan.ContentBody}<ml>`
                                                }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                        {
                            this.state.oldPlanList.map((_oItem, _oIndex) => {
                                return this.renderOldPlan(_oItem, _oIndex);
                            })
                        }
                        {/* {Plan.PlanItem && Plan.PlanItem.length > 0 && ( */}
                        {currentPlanItems && currentPlanItems.length > 0 && (
                            <View style={{ minHeight: 108, width: '100%', backgroundColor: '#fff', marginTop: 5, padding: 13 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 3, height: 14, backgroundColor: '#4AA0FF' }}></View>
                                    <Text style={{ marginLeft: 10, fontSize: 15, color: '#333' }}>核查动作</Text>
                                </View>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                                    {/* {Plan.PlanItem.map((item, index) => { */}
                                    {this.state.currentPlanItems.map((item, index) => {
                                        if (item.Flag) {
                                            return this.renderCheckStep(item, index);
                                        }
                                    })}
                                </View>
                            </View>
                        )}

                        <View style={{ height: 50 }}></View>
                    </ScrollView>
                )}
                {this.props.route.params.params.item.Status == 1 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', bottom: 5, position: 'absolute', width: SCREEN_WIDTH }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.UpdatePlanItem(1);
                            }}
                            style={{ width: 135, height: 44, backgroundColor: '#4DA9FF', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>保存</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.UpdatePlanItem(2);
                            }}
                            style={{ width: 135, height: 44, backgroundColor: '#FFB64D', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>提交</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {this.props.route.params.params.item.Status == 2 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', bottom: 5, position: 'absolute', width: SCREEN_WIDTH }}>
                        <TouchableOpacity
                            onPress={() => {
                                // this.refs.doAlert3.show();
                                // let editPlanItem = [];
                                // Plan.PlanItem.map((item, index) => {
                                //     if (item.Flag) {
                                //         editPlanItem.push(item);
                                //     }
                                // });
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'RepulseMissionVerification',
                                    params: {
                                        // PlanItem: Plan.PlanItem,
                                        PlanItem: this.state.currentPlanItems,
                                        ModelCheckedGuid: this.props.route.params.params.item.ModelCheckedGuid,
                                    }
                                }));
                            }}
                            style={{ width: SCREEN_WIDTH * 0.4, height: 44, backgroundColor: globalcolor.red, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>打回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.doAlert3.show();
                            }}
                            style={{ width: SCREEN_WIDTH * 0.4, height: 44, backgroundColor: '#4DA9FF', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#fff' }}>确认</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <OperationAlertDialog options={dialogOptions} ref="doAlert" />
                <AlertDialog
                    components={
                        <View style={{ width: '100%' }}>
                            {this.state.showError == true && <Text style={{ color: 'red', marginLeft: 13 }}>请完善下列信息</Text>}

                            {this.props.takeFlagList.length > 0 && (
                                <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 5 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                        <SDLText style={{}}>专家意见</SDLText>
                                    </View>

                                    <SimplePicker
                                        ref={ref => {
                                            this.simplePicker = ref;
                                        }}
                                        option={this.getPreFlagOption()}
                                        style={[{ justifyContent: 'flex-end' }]}
                                        textStyle={{ textAlign: 'right', flex: 1 }}
                                    />
                                </View>
                            )}

                            {SentencedToEmpty(this.state, ['selectPreTakeFlag'], null) != null ? (
                                <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 5 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                        <SDLText style={{}}>详细意见</SDLText>
                                    </View>

                                    <SimplePicker
                                        ref={ref => {
                                            this.simplePicker = ref;
                                        }}
                                        option={this.getPreSubFlagOption()}
                                        style={[{ marginLeft: 40, flex: 1, justifyContent: 'flex-end' }]}
                                        textStyle={{ textAlign: 'right', flex: 1 }}
                                    />
                                </View>
                            ) : (null
                                // <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 5 }]}>
                                //     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                //         {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                //         <SDLText style={{}}>详细意见</SDLText>
                                //     </View>

                                //     <Text style={{ color: '#666' }}>请先选择上一条专家意见</Text>
                                // </View>
                            )}

                            <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 5 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    {/* <SDLText style={{ color: 'red' }}>*</SDLText> */}
                                    <SDLText style={{}}>暂停发出线索</SDLText>
                                </View>

                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getPauseGivingCluesOption()}
                                    style={[{ justifyContent: 'flex-end' }]}
                                    textStyle={{ textAlign: 'right', flex: 1 }}
                                />
                            </View>

                            <View style={{ backgroundColor: 'white', padding: 5, alignItems: 'flex-start', marginTop: 8 }}>
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

                            <View style={{ backgroundColor: 'white', padding: 5, alignItems: 'flex-start', marginTop: 8 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <SDLText style={{ color: 'red' }}>*</SDLText>
                                    <SDLText style={{}}>是否需要生成整改单</SDLText>
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
                                            title: '需要',
                                            id: 1
                                        },
                                        {
                                            title: '不需要',
                                            id: 0
                                        }
                                    ]} //数据源
                                    onPress={(index, item) => {
                                        this.setState({
                                            IsRectificationRecord: item.id
                                        });
                                    }}
                                />
                                {this.props.editCommitEnable == false ? <View style={{ position: 'absolute', width: '100%', height: '100%' }}></View> : null}
                            </View>

                            <View style={{ flexDirection: 'column', marginTop: 1, backgroundColor: '#ffffff', paddingHorizontal: 5, paddingVertical: 5 }}>
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
                                    placeholderTextColor={'#999999'}
                                    style={{ width: '100%', backgroundColor: 'white', marginTop: 10, height: 90, borderWidth: 0.5, color: '#333', borderColor: '#999', padding: 13 }}
                                />
                            </View>
                            {
                                SentencedToEmpty(this.state, ['selectPreTakeFlag'], null) != null ? null : <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 1, backgroundColor: '#ffffff', justifyContent: 'space-between', padding: 5 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <SDLText style={{}}></SDLText>
                                    </View>

                                    <Text style={{ color: '#666' }}></Text>
                                </View>
                            }
                        </View>
                    }
                    options={options}
                    ref="doAlert3"
                />
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
