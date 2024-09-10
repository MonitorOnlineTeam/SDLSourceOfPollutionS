/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-10-26 17:29:48
 * @LastEditTime: 2024-09-06 14:15:27
 * @FilePath: /SDLMainProject/app/pOperationContainers/MissionVerification/MissionAbnormalVerifyDetails.js
 */
import React, { PureComponent, Component } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Alert, Image, Modal, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Echarts, echarts } from 'react-native-secharts';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { SDLText, StatusPage, AlertDialog } from '../../components';
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../config';
import { getEncryptData } from '../../dvapack/storage';
let alertContent = [];
const multipleImage = true;

@connect(({ abnormalTask }) => ({
    WarningVerifyCheckInfo: abnormalTask.WarningVerifyCheckInfo,
    alarmChartData: abnormalTask.alarmChartData,
    showDataSort: abnormalTask.showDataSort,
    proFlag: abnormalTask.proFlag,
}))
class MissionAbnormalVerifyDetails extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '核实详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        console.log('props = ', props)
        this.state = {
            modalVisible: false,
            selectItems: SentencedToEmpty(props, ['navigation', 'state', 'params'], []),
            alarmObj: SentencedToEmpty(props, ['navigation', 'state', 'params'], {}),
            showImage: [],
            largeImageIndex: 0,
            appResultLargeImages: [],
            checkInfoLargeImages: [],
        };
    }
    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(
            createAction('abnormalTask/GetWarningVerifyCheckInfo')({
                modelCheckedGuid: this.state.alarmObj.ID,
                callback: (result) => {
                    const ProxyCode = getEncryptData();
                    const Datas = SentencedToEmpty(result, ['data', 'Datas'], {});
                    let checkInfoLargeImages = [];
                    SentencedToEmpty(Datas, ['checkInfo', 'FileList'], [])
                        .map((item, index) => {
                            const nameArray = item.FileName.split('/');
                            checkInfoLargeImages.push({
                                // url: `${UrlInfo.DataAnalyze}/${item.FileName}`
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
                    this.setState({ appResultLargeImages, checkInfoLargeImages });
                }
            })
        );
    };
    renderPickedImage = () => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        let FileList = SentencedToEmpty(this.props.WarningVerifyCheckInfo, ['data', 'Datas', 'checkInfo', 'FileList'], []);
        FileList.map((item, key) => {
            // const source = { uri: `${UrlInfo.DataAnalyze}/${item.FileName}` };
            const nameArray = item.FileName.split('/');
            const source = {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                    : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
            };
            rtnVal.push(
                <View key={item.attachID} style={{ width: (SCREEN_WIDTH - 130) / 3 - 5, height: (SCREEN_WIDTH - 130) / 3 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: (SCREEN_WIDTH - 130) / 3 - 25, height: (SCREEN_WIDTH - 130) / 3 - 25, marginTop: 5, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            if (multipleImage) {
                                this.setState({ modalVisible: true, largeImageIndex: key, showImage: this.state.checkInfoLargeImages });
                            } else {
                                this.setState({ modalVisible: true, showImage: [{ url: source.uri }] });
                            }
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
    renderTimeLinePickedImage = (FileList, idx = 0) => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        FileList.map((item, key) => {
            // const source = { uri: `${UrlInfo.DataAnalyze}/${item}` };
            const nameArray = item.split('/');
            const source = {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                    : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
            };
            rtnVal.push(
                <View key={item.attachID} style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginTop: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            if (multipleImage) {
                                this.setState({ modalVisible: true, largeImageIndex: key, showImage: SentencedToEmpty(this.state, ['appResultLargeImages', idx], []) });
                            } else {
                                this.setState({ modalVisible: true, showImage: [{ url: source.uri }] });
                            }
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
        let data = SentencedToEmpty(this.props.WarningVerifyCheckInfo, ['data', 'Datas']);

        return (
            <StatusPage
                status={this.props.WarningVerifyCheckInfo.status}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                核实结果
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>核实时间：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedTime'], '-')} `}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实人：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedUser'], '-')} `}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实结果：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedResultName'], '-')} `}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实描述：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedDes'], '-')} `}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实材料：</SDLText>
                            <View style={{ flexDirection: 'row', backgroundColor: '#fff', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 10, width: SCREEN_WIDTH - 130 }}>{this.renderPickedImage()}</View>
                        </View>
                    </View>

                    <View style={[styles.card, { marginTop: 13 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                线索记录
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        {SentencedToEmpty(data, ['finalResult'], []).map(item => {
                            return (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}
                                    onPress={() => {
                                        // ClueDetail
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'ClueDetail',
                                                params: { ...this.state.alarmObj, ...item, ID: item.ModelWarningGuid, onRefresh: () => { }, DGIMN: item.Dgimn }
                                            })
                                        );
                                        // this.props.dispatch(
                                        //     NavigationActions.navigate({
                                        //         routeName: 'AlarmDetails',
                                        //         params: { ...this.state.alarmObj, ...item, ID: item.ModelWarningGuid, onRefresh: () => { }, DGIMN: item.Dgimn }
                                        //     })
                                        // );
                                    }}
                                >
                                    <Text style={[{ flex: 1, color: globalcolor.recordde, fontSize: 15, lineHeight: 19 }]}>{item.WarningContent}</Text>
                                    <Image style={{ width: 16, height: 16, marginRight: 3, marginLeft: 10 }} source={require('../../images/right.png')} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={[styles.card, { marginTop: 13, marginBottom: 50 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                处理进度
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1, marginBottom: 10 }}></View>
                        {SentencedToEmpty(data, ['appResult'], []).map((item, idx) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', maxWidth: '82%' }}>
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Image
                                                style={{ width: 16, height: 16, marginRight: 3 }}
                                                source={idx == SentencedToEmpty(data, ['appResult'], []).length - 1 ? require('../../images/auditselect.png') : require('../../images/alarm_unselect.png')}
                                            />
                                            {idx == SentencedToEmpty(data, ['appResult'], []).length - 1 ? null : <View style={{ backgroundColor: '#A4A4A4', width: 1, flex: 1 }}></View>}
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
                            index={multipleImage ? this.state.largeImageIndex : 0}
                        />
                    </Modal>
                </KeyboardAwareScrollView>
                {/**
                 * 待整改       1
                 * 待复核       2
                 * 整改完成     3
                 */}
                {
                    this.state.alarmObj.RectificationStatus == 1 && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'MissionAbnormalRectification',
                                    params: {
                                        ID: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'commitID'], ''),
                                        // alarmTime: map.extras.alarm_time
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
                    )}
            </StatusPage>
        );
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
        maxWidth: SCREEN_WIDTH - 40
    }
});

//make this component available to the app
export default MissionAbnormalVerifyDetails;
