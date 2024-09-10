/*
 * @Description: 整改复核详情
 * @LastEditors: hxf
 * @Date: 2023-10-31 17:22:17
 * @LastEditTime: 2024-08-29 09:58:10
 * @FilePath: /SDLMainProject37/app/pOperationContainers/AnalysisModelModification/RectificationReviewDetails.js
 */
import { Text, View, Platform, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer';

import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import { SDLText, StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import globalcolor from '../../config/globalcolor';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../config';
import { getEncryptData } from '../../dvapack/storage';

//
@connect(({ modelAnalysisAectificationModel }) => ({
    checkedRectificationApprovalsResult: modelAnalysisAectificationModel.checkedRectificationApprovalsResult
}))
export default class RectificationReviewDetails extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'RectificationStatus'], '') == 1 ? '驳回详情' : '整改复核',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            showImage: [],
            largeImageIndex: 0,
            appResultLargeImages: [],
            checkedRectificationListLargeImages: [],
        };
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('modelAnalysisAectificationModel/updateState')({
            checkedRectificationApprovalsResult: { status: -1 }
        }));
        this.props.dispatch(createAction('modelAnalysisAectificationModel/getCheckedRectificationApprovals')({
            params: {},
            callback: (result) => {
                const ProxyCode = getEncryptData();
                const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                let checkedRectificationListLargeImages = [];
                SentencedToEmpty(Datas, ['CheckedRectificationList', 0, 'FileList'], [])
                    .map((item, index) => {
                        const nameArray = item.split('/');
                        checkedRectificationListLargeImages.push({
                            // url: `${UrlInfo.DataAnalyze}/${item}`
                            url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                                : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
                        });
                    });
                let appResultLargeImages = [], tempArray = [];
                SentencedToEmpty(Datas, ['appResult'], []).
                    map((item, index) => {
                        tempArray = [];
                        SentencedToEmpty(item, ['FileList'], [])
                            .map((imageItem, imageIndex) => {
                                const nameArray = imageItem.split('/');
                                tempArray.push({
                                    // url: `${UrlInfo.DataAnalyze}/${imageItem}`
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
                                });
                            });
                        appResultLargeImages.push(tempArray);
                    });
                this.setState({ appResultLargeImages, checkedRectificationListLargeImages });
                return false;
            }
        }));
    }

    renderPickedImage = () => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        let FileList = SentencedToEmpty(this.props.checkedRectificationApprovalsResult, ['data', 'Datas', 'CheckedRectificationList', 0, 'FileList'], []);
        FileList.map((item, key) => {
            const nameArray = item.split('/');
            // const source = { uri: `${UrlInfo.DataAnalyze}/${item}` };
            const source = {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                    : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
            };
            rtnVal.push(
                <View key={item.attachID} style={{ width: (SCREEN_WIDTH - 130) / 3 - 5, height: (SCREEN_WIDTH - 130) / 3 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: (SCREEN_WIDTH - 130) / 3 - 25, height: (SCREEN_WIDTH - 130) / 3 - 25, marginTop: 5, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ modalVisible: true, largeImageIndex: key, showImage: this.state.checkedRectificationListLargeImages });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: (SCREEN_WIDTH - 130) / 3 - 10, width: (SCREEN_WIDTH - 130) / 3 - 15 }]} />
                    </TouchableOpacity>
                </View>
            );
        });
        return rtnVal;
    };

    renderTimeLinePickedImage = (FileList, idx) => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        FileList.map((item, key) => {
            const nameArray = item.split('/');
            // const source = { uri: `${UrlInfo.DataAnalyze}/${item}` };
            const source = {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                    : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
            };
            rtnVal.push(
                <View key={item.attachID} style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginTop: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ modalVisible: true, largeImageIndex: key, showImage: this.state.appResultLargeImages[idx] });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: SCREEN_WIDTH / 4 - 10, width: SCREEN_WIDTH / 4 - 15 }]} />
                    </TouchableOpacity>
                </View>
            );
        });
        return rtnVal;
    };

    render() {
        console.log('state = ', this.state);
        let data = SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult', 'data', 'Datas', 'CheckedRectificationList', 0], {});
        return (
            <StatusPage
                status={SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult', 'status'], 1000)}
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
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH, padding: 13 }}>
                    <View style={[styles.card, { marginTop: 5 }]}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                                <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                    核实整改
                                </SDLText>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'AbnormalVerifyDetails',
                                        params: {
                                            ID: SentencedToEmpty(this.props
                                                , ['checkedRectificationApprovalsResult'
                                                    , 'data', 'Datas', 'CheckedRectificationList', 0, 'CheckedId'], '')
                                        }
                                    }));
                                }}
                                style={{ backgroundColor: '#4AA0FF', width: 100, height: 40, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <SDLText fontType={'large'} style={{ color: '#fff' }}>
                                    线索核实
                                </SDLText>
                            </TouchableOpacity>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>整改人：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['RectificationUserName'], '----')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>整改描述：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['RectificationDes'], '----')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>整改时间：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['CompleteTime'], '----')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>整改材料：</SDLText>
                            <View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10, width: SCREEN_WIDTH - 130 }}>
                                {this.renderPickedImage()}
                            </View>
                        </View>
                    </View>
                    <View style={[styles.card, { marginTop: 13, marginBottom: 50 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                处理进度
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1, marginBottom: 10 }}></View>
                        {SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult'
                            , 'data', 'Datas', 'appResult'], []).map((item, idx) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                                        <View style={{ flexDirection: 'row', maxWidth: '82%' }}>
                                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                                <Image
                                                    style={{ width: 16, height: 16, marginRight: 3 }}
                                                    source={idx == SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult'
                                                        , 'data', 'Datas', 'appResult'], []).length - 1 ? require('../../images/auditselect.png') : require('../../images/alarm_unselect.png')}
                                                />
                                                {idx == SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult'
                                                    , 'data', 'Datas', 'appResult'], []).length - 1 ? null : <View style={{ backgroundColor: '#A4A4A4', width: 1, flex: 1 }}></View>}
                                            </View>
                                            <View style={{ flexDirection: 'column', minHeight: 100, marginLeft: 5 }}>
                                                <SDLText style={[{ color: '#333333', fontSize: 15, lineHeight: 18 }]}>{item.ApproverUserName}</SDLText>
                                                <SDLText style={[{ color: '#666666', fontSize: 15, lineHeight: 18, marginTop: 10 }]}>{item.ApprovalDate}</SDLText>
                                                <SDLText style={[{ color: '#666666', fontSize: 15, lineHeight: 18, marginTop: 10 }]}>{item.ApprovalRemarks}</SDLText>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{this.renderTimeLinePickedImage(item.FileList, idx)}</View>
                                            </View>
                                        </View>
                                        <SDLText style={[{ color: '#666666', fontSize: 15, lineHeight: 18 }]}>{item.ApprovalStatusName}</SDLText>
                                    </View>
                                );
                            })}
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
                            imageUrls={this.state.showImage}
                            index={this.state.largeImageIndex}
                        />
                    </Modal>
                </KeyboardAwareScrollView>
                {
                    SentencedToEmpty(this.props
                        , ['checkedRectificationApprovalsResult'
                            , 'data', 'Datas', 'CheckedRectificationList'
                            , 0, 'RectificationStatus'], '') == 1 && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'AbnormalRectification',
                                    params: {
                                        ID: SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult', 'data', 'Datas', 'CheckedRectificationList', 0, 'ID'], ''),
                                    }
                                }));
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                flex: 1,
                                alignSelf: 'center',
                                width: SCREEN_WIDTH - 30,
                                height: 44,
                                borderRadius: 5,
                                backgroundColor: '#4DA9FF',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff' }}>整改</Text>
                        </TouchableOpacity>
                    )
                }
                {
                    SentencedToEmpty(this.props
                        , ['checkedRectificationApprovalsResult'
                            , 'data', 'Datas', 'CheckedRectificationList'
                            , 0, 'RectificationStatus'], '') == 2 ?
                        < TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'RectificationReviewExecution',
                                    params: {
                                        ID: SentencedToEmpty(this.props, ['checkedRectificationApprovalsResult', 'data', 'Datas', 'CheckedRectificationList', 0, 'ID'], ''),
                                        // alarmTime: map.extras.alarm_time
                                    }
                                }));
                            }}
                            style={{
                                // position: 'absolute',
                                // bottom: 0,
                                // flex: 1,
                                alignSelf: 'center',
                                width: SCREEN_WIDTH - 30,
                                height: 44,
                                borderRadius: 5,
                                backgroundColor: '#4DA9FF',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff' }}>复核</Text>
                        </TouchableOpacity> : null
                }
            </StatusPage >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    },
    oneRow: {
        width: SCREEN_WIDTH - 28,
        flexDirection: 'row',
        marginVertical: 7
    },
    card: {
        paddingRight: 13,
        paddingHorizontal: 14,
        paddingVertical: 13,
        backgroundColor: 'white',
        borderRadius: 5
    },
    label: {
        width: 82,
        color: '#666666',
        fontSize: 14,
        marginRight: 5
    },
    content: {
        color: globalcolor.recordde,
        fontSize: 15,
        lineHeight: 18,
        maxWidth: SCREEN_WIDTH - 140
    }
});