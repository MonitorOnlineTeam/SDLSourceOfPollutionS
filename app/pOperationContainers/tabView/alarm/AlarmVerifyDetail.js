import React, { PureComponent } from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Platform, TextInput, AsyncStorage, Modal } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { getEncryptData, getRootUrl, getToken, loadStorage } from '../../../dvapack/storage';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StatusPage, SelectButton, SimplePickerSingleTime, SDLText, SimplePicker, Touchable } from '../../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, CloseToast, ShowToast } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { UrlInfo } from '../../../config/globalconst';
import { SCREEN_HEIGHT } from '../../../components/SDLPicker/constant/globalsize';
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
let that;
/**
 * 报警核实
 */
@connect(({ app, alarm }) => ({
    VerifyType: app.VerifyType,
    alarmVerifyDetailsRuslt: alarm.alarmVerifyDetailsRuslt
}))
export default class AlarmVerifyDetail extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '核实信息',
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        that.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'VerifyAlarmsRecord',
                                params: {
                                    isOpreationVerify: navigation.state.params.recordType == 'VerifyRecords' ? false : true,
                                    ExceptionVerifyID: navigation.state.params.recordType == 'VerifyRecords' ? navigation.state.params.item['dbo.T_Cod_ExceptionVerify.ID'] : navigation.state.params.item['ID']
                                }
                            })
                        );
                    }}
                >
                    <SDLText style={{ color: '#fff', marginRight: 16 }}>关联报警</SDLText>
                </TouchableOpacity>
            )
        });

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            showImage: '',
            datatype: 0,
            imagelist: [],
            imgUrls: [],
            VerifyState: '',
            VerifyMessage: '',
            VerifyType: {},
            index: 0,
            encryData: '',
            modalVisible: false,
            recoverTime: moment()
                .add(4, 'hours')
                .format('YYYY-MM-DD HH:mm:ss'),
            TimeS: new Date().getTime(),
            dataArray: [
                {
                    title: '有异常',
                    id: 2
                },
                {
                    title: '无异常',
                    id: 1
                }
            ]
        };
        this.recordType = SentencedToEmpty(this.props.route, ['params', 'params', 'recordType'], 'VerifyRecords');
        if (this.recordType == 'OverAlarmVerify') {
            this.state.dataArray = [
                {
                    title: '工艺超标',
                    id: 1
                },
                {
                    title: '设备异常',
                    id: 2
                }
            ];
        }
    }
    callback = isSuccess => {
        if (isSuccess == true) {
            this.props.navigation.dispatch(NavigationActions.back());
            ShowToast('提交成功');
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
        const rtnVal = [];
        let imgStr = SentencedToEmpty(this.props.alarmVerifyDetailsRuslt.data.Datas[0], ['dbo.T_Cod_ExceptionVerify.VerifyImage'], null);
        let imageLst = imgStr == null ? [] : imgStr.split(';');
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();

        imageLst.map((item, key) => {
            // const source = { uri: `${UrlInfo.ImageUrl + item.split('|')[0]}/Attachment?code=${this.state.encryData}` };
            // const source = { uri: `${UrlInfo.ImageUrl + item.split('|')[0]}`, ProxyCode: encryData };
            const source = { uri: `${rootUrl.ReactUrl}/upload/${item.split('|')[0]}` };

            rtnVal.push(
                <View key={`img_${key}`} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            // this.setState({ modalVisible: true, index: 0, showImage: { url: `${UrlInfo.ImageUrl + item.split('|')[0]}/Attachment?code=${this.state.encryData}` } });
                            // this.setState({ modalVisible: true, index: 0, showImage: { url: `${UrlInfo.ImageUrl + item.split('|')[0]}`,props: {headers: { ProxyCode: encryData}} } });
                            this.setState({ modalVisible: true, index: 0, showImage: { url: `${rootUrl.ReactUrl}/upload/${item.split('|')[0]}` } });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: 50, width: 50 }]} />
                    </TouchableOpacity>
                </View>
            );
        });
        return rtnVal;
    };
    componentDidMount() {
        this.refresh();
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
    }
    refresh() {
        //传入页面身份信息 OverAlarmVerify 运维超标报警核实 VerifyRecords 监控报警核实
        if (this.recordType == 'VerifyRecords') {
            this.props.dispatch(
                createAction('alarm/getAlarmVerifyDetails')({
                    params: {
                        configId: 'ExceptionVerify',
                        'dbo.T_Cod_ExceptionVerify.ID': this.props.route.params.params.item['dbo.T_Cod_ExceptionVerify.ID']
                    }
                })
            );
        } else {
            // OverAlarmVerify
            let item = this.props.route.params.params.item;
            let imageStr = '';
            if (SentencedToEmpty(item, ['ImageID'], []).length > 0) {
                item.ImageID.map((itemImg, index) => {
                    console.log(itemImg);
                    if (index == item.ImageID.length - 1) {
                        imageStr = imageStr + itemImg + '|';
                    } else {
                        imageStr = imageStr + itemImg + '|;';
                    }
                });
            }
            this.props.dispatch(
                createAction('alarm/updateState')({
                    alarmVerifyDetailsRuslt: {
                        status: 200,
                        data: {
                            Datas: [
                                {
                                    VerifyMessage: item.VerifyMessage, //备注信息
                                    VerifyState: item.VerifyState, //核实结果
                                    'dbo.T_Cod_ExceptionVerify.VerifyImage': imageStr,
                                    VerifyState_Name: item.VerifyState_Name
                                }
                            ]
                        }
                    }
                })
            );
        }
    }

    render() {
        return (
            <StatusPage
                status={this.props.alarmVerifyDetailsRuslt.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refresh();
                }}
            >
                {this.props.alarmVerifyDetailsRuslt.status == 200 ? (
                    <View>
                        <View style={{ width: SCREEN_WIDTH, height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                            <TextInput
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                editable={false}
                                underlineColorAndroid={'transparent'}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    this.setState({ VerifyMessage: text });
                                }}
                                value={this.props.alarmVerifyDetailsRuslt.data.Datas[0].VerifyMessage}
                                multiline={true}
                                placeholder="无信息输入~"
                                placeholderTextColor={'#999999'}
                                style={{ color: '#333', width: SCREEN_WIDTH - 28, height: 140, backgroundColor: '#f0f0f0', padding: 13, textAlignVertical: 'top' }}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, minHeight: 20, marginTop: 10, backgroundColor: '#ffffff' }}>
                            <SDLText style={[styles.texttitleStyle, { marginTop: 10, marginLeft: 13, color: '#333' }]}>附件图片：</SDLText>
                            <View style={{ flexDirection: 'row', marginTop: 10, width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>{this.renderPickedImage()}</View>
                        </View>
                        {this.recordType == 'VerifyRecords' ? (
                            <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 10 }}>
                                <SDLText style={{ marginLeft: 13 }}>恢复时间</SDLText>
                                <SDLText style={{ marginRight: 13, color: '#666' }}>{moment(this.props.alarmVerifyDetailsRuslt.data.Datas[0].RecoveryDateTime).format('YYYY-MM-DD hh:00')}</SDLText>
                            </View>
                        ) : null}

                        {this.recordType == 'OverAlarmVerify' ? (
                            <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }]}>
                                <SDLText style={{ marginLeft: 13 }}>{'检查状态'}</SDLText>
                                <SDLText style={[{ marginRight: 13 }]}>{this.props.alarmVerifyDetailsRuslt.data.Datas[0]['VerifyState_Name'] || '---'}</SDLText>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }}>
                                <SDLText style={{ marginLeft: 13 }}>{'检查状态'}</SDLText>
                                <SelectButton
                                    disabled={true}
                                    style={{ flexDirection: 'row' }} //整个组件的样式----这样可以垂直和水平
                                    conTainStyle={{ height: 44, width: 165 }} //图片和文字的容器样式
                                    imageStyle={{ width: 18, height: 18 }} //图片样式
                                    textStyle={{ color: '#666' }} //文字样式
                                    selectIndex={
                                        this.recordType == 'VerifyRecords' ? (this.props.alarmVerifyDetailsRuslt.data.Datas[0].VerifyState == '1' ? '1' : '0') : this.props.route.params.params.item.VerifyState == '2' ? '1' : '0'
                                    } //空字符串,表示不选中,数组索引表示默认选中
                                    data={this.state.dataArray} //数据源
                                />
                            </View>
                        )}
                        {this.recordType == 'VerifyRecords' ? (
                            <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }}>
                                <SDLText style={{ marginLeft: 13 }}>报警类型</SDLText>
                                <SDLText style={{ marginRight: 13, color: '#666' }}>{this.props.alarmVerifyDetailsRuslt.data.Datas[0]['dbo.T_Cod_ExceptionVerify.VerifyType_Name']}</SDLText>
                            </View>
                        ) : null}
                    </View>
                ) : null}
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
                        imageUrls={[this.state.showImage]}
                        index={this.state.index}
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
