import React, { PureComponent, Component } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text, Alert, Image, Modal, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Echarts, echarts } from 'react-native-secharts';
import { SCREEN_WIDTH } from '../../../LineSelectBar';
import globalcolor from '../../../../config/globalcolor';
import { SDLText, StatusPage, AlertDialog } from '../../../../components';
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../../../utils';
import moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../../../config';
import { getEncryptData } from '../../../../dvapack/storage';
let alertContent = [];
@connect(({ alarmAnaly }) => ({
    WarningVerifyCheckInfo: alarmAnaly.WarningVerifyCheckInfo,
    alarmChartData: alarmAnaly.alarmChartData,
    showDataSort: alarmAnaly.showDataSort,
    proFlag: alarmAnaly.proFlag,
    alramButtonList: alarmAnaly.alramButtonList
}))
class VerifyProgress extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '线索核实',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            selectItems: SentencedToEmpty(props, ['navigation', 'state', 'params'], []),
            alarmObj: SentencedToEmpty(props, ['navigation', 'state', 'params'], {}),
            showImage: '',
            materialImage: []
            , processingProgressImages: []
            , largeImageIndex: 0
        };
    }
    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(
            createAction('alarmAnaly/GetWarningVerifyCheckInfo')({
                modelCheckedGuid: this.state.alarmObj.ID,
                callback: (result) => {
                    let materialImage = [];
                    let processingProgressImages = []
                        , processingProgressImageItem = [];
                    let FileList = SentencedToEmpty(result, ['data', 'Datas', 'checkInfo', 'FileList'], []);
                    let nameArray = [];
                    const ProxyCode = getEncryptData();
                    FileList.map((item, key) => {
                        nameArray = item.FileName.split('/');
                        materialImage.push({
                            url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                                : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
                        });
                    });
                    let appResult = SentencedToEmpty(this.props.WarningVerifyCheckInfo, ['data', 'Datas', 'appResult'], []);
                    appResult.map((item1, key1) => {
                        processingProgressImageItem = [];
                        SentencedToEmpty(item1, ['FileList'], [])
                            .map((item2, index2) => {
                                let urlArray = item2.split('/');
                                processingProgressImageItem.push({
                                    // url: `${UrlInfo.DataAnalyze}/${item2}`
                                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${urlArray[urlArray.length - 1]}`
                                        : `${ImageUrlPrefix}${ProxyCode}/${urlArray[urlArray.length - 1]}`
                                });
                            });
                        processingProgressImages.push(processingProgressImageItem);
                    });
                    this.setState({
                        materialImage
                        , processingProgressImages
                    });
                },
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
                            // this.setState({ modalVisible: true, showImage: { url: source.uri } });
                            this.setState({ modalVisible: true, largeImageIndex: key, showImage: this.state.materialImage });
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
            // const source = { uri: `${UrlInfo.DataAnalyze}/${item}` };
            const nameArray = item.split('/');
            // const source = { uri: `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}` };
            const source = {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${nameArray[nameArray.length - 1]}`
                    : `${ImageUrlPrefix}${ProxyCode}/${nameArray[nameArray.length - 1]}`
            };
            rtnVal.push(
                <View key={item.attachID} style={{ width: SCREEN_WIDTH / 4 - 5, height: SCREEN_WIDTH / 4 - 5 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: SCREEN_WIDTH / 4 - 25, height: SCREEN_WIDTH / 4 - 25, marginLeft: 10, marginTop: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            // this.setState({ modalVisible: true, showImage: { url: source.uri } });
                            this.setState({
                                modalVisible: true, largeImageIndex: key
                                , showImage: SentencedToEmpty(this.state, ['processingProgressImages', idx], [])
                            });
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

    getRectificationRecordName = () => {
        let IsRectificationRecord = SentencedToEmpty(this.props.WarningVerifyCheckInfo, ['data', 'Datas', 'checkInfo', 'IsRectificationRecord'], 0);
        if (IsRectificationRecord == 1) {
            return '是'
        } else {
            return '否'
        }
    }

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
                    {/* <View style={[styles.card]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                                <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                    线索信息
                                </SDLText>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>场景类型：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['WarningTypeName'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>发现时间：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['WarningTime'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>企业：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['EntNmae'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>排放口：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['PointName'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, { alignItems: 'center' }]}>
                            <SDLText style={[styles.label]}>核实状态：</SDLText>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 5,
                                    backgroundColor: SentencedToEmpty(data, ['CheckedResultCode'], '') == 3 ? 'rgba(102,102,102,0.1)' : SentencedToEmpty(data, ['CheckedResultCode'], '') == 1 ? 'rgba(255,87,74,0.1)' : 'rgba(38,193,154,0.1)',
                                    marginLeft: 3,

                                    height: 20,
                                    paddingLeft: 5,
                                    paddingRight: 5
                                }}
                            >
                                <Text
                                    style={[{ color: SentencedToEmpty(data, ['CheckedResultCode'], '') == 3 ? '#666666' : SentencedToEmpty(data, ['CheckedResultCode'], '') == 1 ? '#FF574A' : '#26C19A', textAlign: 'center', fontSize: 12 }]}
                                >
                                    {SentencedToEmpty(data, ['CheckedResult'], '')}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.oneRow, { paddingRight: 23 }]}>
                            <SDLText style={[styles.label]}>线索内容：</SDLText>
                            <SDLText style={[styles.content, { flex: 1 }]}>{`${SentencedToEmpty(data, ['WarningContent'], '暂未填写')}`}</SDLText>
                        </View>
                    </View> */}
                    <View style={[styles.card, { marginTop: 5 }]}>
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
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'AlarmDetails',
                                                params: { ...this.state.alarmObj, ...item, ID: item.ModelWarningGuid, onRefresh: () => { }, DGIMN: item.Dgimn }
                                            })
                                        );
                                    }}
                                >
                                    <Text style={[{ flex: 1, color: globalcolor.recordde, fontSize: 15, lineHeight: 19 }]}>{item.WarningContent}</Text>
                                    <Image style={{ width: 16, height: 16, marginRight: 3, marginLeft: 10 }} source={require('../../../../images/right.png')} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={[styles.card, { marginTop: 13 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -13 }}>
                            <View style={{ backgroundColor: '#4AA0FF', width: 3, height: 14 }}></View>
                            <SDLText fontType={'large'} style={{ color: '#333333', marginLeft: 8 }}>
                                核实结果
                            </SDLText>
                        </View>
                        <View style={{ backgroundColor: '#F3F3F3', width: '100%', marginTop: 15, height: 1 }}></View>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>核实时间：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedTime'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实人：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedUser'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实结果：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedResultName'], '-')}`}</SDLText>
                        </View>
                        {
                            SentencedToEmpty(data, ['checkInfo', 'CheckedResult'], 1) == 2
                                ? <View style={[styles.oneRow, {}]}>
                                    <SDLText style={[styles.label, { width: 120 }]}>是否生成整改单：</SDLText>
                                    <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${this.getRectificationRecordName()}`}</SDLText>
                                </View> : null
                        }

                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实描述：</SDLText>
                            <SDLText style={[styles.content, { maxWidth: SCREEN_WIDTH - 140 }]}>{`${SentencedToEmpty(data, ['checkInfo', 'CheckedDes'], '-')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>核实材料：</SDLText>
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
                        {SentencedToEmpty(data, ['appResult'], []).map((item, idx) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', maxWidth: '82%' }}>
                                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Image
                                                style={{ width: 16, height: 16, marginRight: 3 }}
                                                source={idx == SentencedToEmpty(data, ['appResult'], []).length - 1 ? require('../../../../images/auditselect.png') : require('../../../../images/alarm_unselect.png')}
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
                            // imageUrls={[this.state.showImage]}
                            imageUrls={this.state.showImage}
                            index={this.state.largeImageIndex}
                        />
                    </Modal>
                </KeyboardAwareScrollView>
                {this.props.alramButtonList.findIndex(sItem => {
                    if (sItem.id == '3a5d2719-91d0-430a-ad11-00d277065881') return true;
                }) >= 0 &&
                    this.state.alarmObj.Status == '待核实' && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'AlarmVerifyAnalyze',
                                        params: [{ ...this.state.alarmObj, modelCheckedGuid: this.state.alarmObj.ID }]
                                    })
                                );
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
                            <Text style={{ color: '#fff' }}>核实</Text>
                        </TouchableOpacity>
                    )}
                {this.props.alramButtonList.findIndex(sItem => {
                    if (sItem.id == 'a276806e-890e-4c3f-b51e-ca35f704bd26') return true;
                }) >= 0 &&
                    this.state.alarmObj.Status == '待复核' && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'AlarmReview',
                                        params: this.state.alarmObj
                                    })
                                );
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
                            <Text style={{ color: '#fff' }}>复核</Text>
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
export default VerifyProgress;
