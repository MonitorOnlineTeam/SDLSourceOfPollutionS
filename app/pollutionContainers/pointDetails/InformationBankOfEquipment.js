import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, TextInput, AsyncStorage } from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import Intent from 'react-native-android-intent';

import { StatusPage, Touchable, PickerTouchable, SDLText, FlatListWithHeaderAndFooter, SimpleLoadingComponent } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, getDocumentIcon, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../components/SDLPicker/constant/globalsize';
import { UrlInfo } from '../../config';
import { getEncryptData, getRootUrl } from '../../dvapack/storage';

/**
 * 设备资料库/运维知识库
 */
@connect(({ pointDetails }) => ({
    equipmentInfoListData: pointDetails.equipmentInfoListData,
    equipmentInfoListResult: pointDetails.equipmentInfoListResult
}))
export default class InformationBankOfEquipment extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        let pageType = SentencedToEmpty(navigation, ['state', 'params', 'pageType'], 'InformationBankOfEquipment');
        return createNavigationOptions({
            title: 'InformationBankOfEquipment' == pageType ? '设备资料库' : '运维知识库',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0,
            viewEquipmentInfoFileName: '',
            downLoading: false
        };
    }

    componentDidMount() {
        this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoFileName: '' }));
        // this.list.onRefresh();
        this.statusPageOnRefresh();
    }

    onRefresh = index => {
        let pageType = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'pageType'], 'InformationBankOfEquipment');
        this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoListResult: { status: -1 } }));
        if ('InformationBankOfEquipment' == pageType) {
            this.props.dispatch(createAction('pointDetails/getEquipmentInfo')({ setListData: this.list.setListData, apiParam: api.pollutionApi.PointDetails.GetEquipmentInfo }));
        } else {
            this.props.dispatch(createAction('pointDetails/getEquipmentInfo')({ setListData: this.list.setListData, apiParam: api.pOperationApi.WorkBench.GetOperationDocuments }));
        }
    };

    statusPageOnRefresh = () => {
        console.log(this.props.navigation.state.params);
        let pageType = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'pageType'], 'InformationBankOfEquipment');
        this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoListResult: { status: -1 } }));
        if ('InformationBankOfEquipment' == pageType) {
            this.props.dispatch(createAction('pointDetails/getEquipmentInfo')({ apiParam: api.pollutionApi.PointDetails.GetEquipmentInfo }));
        } else {
            this.props.dispatch(createAction('pointDetails/getEquipmentInfo')({ apiParam: api.pOperationApi.WorkBench.GetOperationDocuments }));
        }
    };

    getDocumentCreateTime = timeStr => {
        if (timeStr == '') {
            return 'xxxx-xx-xx';
        } else {
            let tempArray = timeStr.split(' ');
            if (tempArray.length == 2) {
                return tempArray[0];
            } else {
                return 'xxxx-xx-xx';
            }
        }
    };

    getDocumentSuffix = name => {
        if (name == '') {
            return 'default';
        } else {
            let tempArray = name.split('.');
            if (tempArray.length > 1) {
                return tempArray[tempArray.length - 1];
            } else {
                return 'default';
            }
        }
    };

    _onItemClick = async item => {
        let encryData = getEncryptData();
        if (Platform.OS === 'ios') {
            const rootUrl = getRootUrl();
            // console.log(`${UrlInfo.ImageUrl}${SentencedToEmpty(item, ['AttachmentName'], '')}/Attachment?code=${encryData}`);
            console.log(`${rootUrl.ReactUrl}/upload/${SentencedToEmpty(item, ['AttachmentName'], '')}`);
            if (SentencedToEmpty(item, ['AttachmentName'], '') != '' && SentencedToEmpty(item, ['fileUrl'], '') != '') {
                OpenFile.openDocBinaryinUrl(
                    [
                        {
                            // url: `${UrlInfo.ImageUrl}${SentencedToEmpty(item, ['AttachmentName'], '')}/Attachment?code=${encryData}`,
                            url: `${rootUrl.ReactUrl}/upload/${SentencedToEmpty(item, ['AttachmentName'], '')}`,
                            fileName: SentencedToEmpty(item, ['DocumentName'], ''),
                            fileType: SentencedToEmpty(item, ['AttachmentName'], '').split('.')[1]
                        }
                    ],
                    (error, url) => {
                        if (error) {
                            this.setState({ animating: false });
                        } else {
                            this.setState({ animating: false });
                            //    console.log(url)
                        }
                    }
                );
            }
        } else {
            console.log(SentencedToEmpty(item, ['fileUrl'], ''));
            let fileExist = false;
            if (SentencedToEmpty(item, ['AttachmentName'], '') != '') {
                fileExist = await RNFS.exists(`${RNFS.ExternalDirectoryPath}/${SentencedToEmpty(item, ['AttachmentName'], '')}`);
                console.log(`${RNFS.ExternalDirectoryPath}/${SentencedToEmpty(item, ['AttachmentName'], '')}  fileExist = ${fileExist}`);
                console.log(fileExist);
                if (fileExist) {
                    // 打开该应用
                    console.log('打开文件');
                    let filePath = `${RNFS.ExternalDirectoryPath}/${item.AttachmentName}`;
                    console.log('filePath = ', filePath);
                    Intent.open(filePath, isOpen => {
                        if (isOpen) {
                            console.log('Can open');
                        } else {
                            console.log("can't open");
                        }
                    });
                } else {
                    // 下载 并 打开
                    console.log('开始下载');
                    // this.downloadFile(SentencedToEmpty(item, ['AttachmentName'], ''), `${UrlInfo.ImageUrl}${SentencedToEmpty(item, ['AttachmentName'], '')}/Attachment?code=${encryData}`, fileUri => {
                    this.downloadFile(SentencedToEmpty(item, ['AttachmentName'], ''), `${UrlInfo.ImageUrl}${SentencedToEmpty(item, ['AttachmentName'], '')}`, fileUri => {
                        console.log('openFileFun fileUri = ', fileUri);
                        Intent.open(fileUri, isOpen => {
                            if (isOpen) {
                                console.log('Can open');
                            } else {
                                console.log("can't open");
                            }
                        });
                    });
                }
            }
        }
    };

    /*下载文件*/
    downloadFile = (fileName, fileUrl, openFileFun = fileUri => {}) => {
        this.setState({ downLoading: true });
        if (Platform.OS == 'ios') {
            //ios利用系统直接下载打开
            this.showModal();
            Linking.openURL(this.props.DownLoadPath);
            this.hideModal();
            return;
        }
        const downloadDest = `${RNFS.ExternalDirectoryPath}/${fileName}`;
        let encryData = getEncryptData();
        const options = {
            fromUrl: fileUrl,
            headers:{
                ProxyCode: encryData
            },
            toFile: downloadDest,
            background: true,
            begin: res => {},
            progress: res => {
                // let pro = res.bytesWritten +'/'+ res.contentLength;
                let pro = Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
                let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
                this.setState({
                    progressText: _text,
                    number: pro
                });
                console.log('下载 progressText = ', _text, ',number = ', pro);
            }
        };
        console.log('download options = ', options);
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise
                .then(res => {
                    // 未奔溃，无法访问到文件
                    if (SentencedToEmpty(res, ['statusCode'], 404) == 404) {
                        this.setState({
                            //关闭进度条
                            downLoading: false
                        });
                        ShowToast('文件下载失败！');
                        return;
                    }
                    let pro = Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
                    let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
                    this.setState({
                        progressText: _text,
                        number: pro,
                        //关闭进度条
                        downLoading: false
                    });
                    console.log('完成 progressText = ', _text, ',number = ', pro);
                    // 打开文件
                    openFileFun(downloadDest);
                })
                .catch(err => {
                    this.setState({
                        //关闭进度条
                        downLoading: false
                    });
                    console.log('err', err);
                });
        } catch (e) {
            console.log(error);
            this.setState({
                //关闭进度条
                downLoading: false
            });
            return;
        }
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.downLoading == true ? <SimpleLoadingComponent message={'正在下载相关文档'} /> : null}
                <View style={[{ height: 60, width: SCREEN_WIDTH, paddingHorizontal: 20, flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#d9d9d9', borderBottomWidth: 1, alignItems: 'center' }]}>
                    <View style={[{ height: 30, flex: 1, borderRadius: 15, backgroundColor: '#f2f2f2', marginRight: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }]}>
                        <Image source={require('../../images/ic_datacheck.png')} style={[{ height: 18, width: 18 }]} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder={'请输入内容'}
                            style={{
                                marginLeft: 5,
                                fontSize: 15,
                                color: '#666',
                                flex: 1,
                                // lineHeight: 30,
                                padding: 0
                            }}
                            value={this.state.viewEquipmentInfoFileName}
                            onChangeText={text => {
                                this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoFileName: text ? text : '' }));
                                this.setState({ viewEquipmentInfoFileName: text });
                                if (this.props.equipmentInfoListResult.status == 200) {
                                    this.list.onRefresh();
                                } else {
                                    this.statusPageOnRefresh();
                                }
                            }}
                            clearButtonMode="while-editing"
                            ref="keyWordInput"
                            placeholderTextColor={'#999'}
                        />
                    </View>
                    {this.state.viewEquipmentInfoFileName ? (
                        <Touchable
                            onPress={() => {
                                this.setState({ viewEquipmentInfoFileName: '' });
                                this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoFileName: '' }));
                                // this.list.onRefresh();
                                if (this.props.equipmentInfoListResult.status == 200) {
                                    this.list.onRefresh();
                                } else {
                                    this.statusPageOnRefresh();
                                }
                            }}
                        >
                            <View style={[{ height: 30, width: 33, justifyContent: 'center', alignItems: 'center' }]}>
                                <SDLText style={[{ color: '#333' }]} fontType={'small'}>
                                    {'取消'}
                                </SDLText>
                            </View>
                        </Touchable>
                    ) : null}
                </View>
                <StatusPage
                    status={this.props.equipmentInfoListResult.status}
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
                    <View style={styles.container}>
                        <FlatListWithHeaderAndFooter
                            ref={ref => (this.list = ref)}
                            ItemSeparatorComponent={() => {
                                return (
                                    <View style={[{ height: 0.5, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }]}>
                                        <View style={[{ height: 0.5, width: SCREEN_WIDTH - 13, backgroundColor: '#d9d9d9' }]} />
                                    </View>
                                );
                            }}
                            pageSize={20}
                            hasMore={() => {
                                // return this.props.alarmRecordsListData.length < this.props.alarmRecordsTotal;
                                return false;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {}}
                            renderItem={({ item, index }) => {
                                return (
                                    <Touchable onPress={() => this._onItemClick(item)}>
                                        <View style={[{ height: 65, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10 }]}>
                                            <Image style={[{ height: 24, width: 24 }]} source={getDocumentIcon(this.getDocumentSuffix(SentencedToEmpty(item, ['AttachmentName'], '')))} />
                                            <View style={[{ flex: 1, marginLeft: 10 }]}>
                                                <SDLText style={[{ color: '#333' }]} fontType={'normal'}>
                                                    {SentencedToEmpty(item, ['DocumentName'], '---')}
                                                </SDLText>
                                                <SDLText style={[{ color: '#999', marginTop: 5 }]} fontType={'small'}>{`${SentencedToEmpty(item, ['CreateName'], '未知创建人')}   ${this.getDocumentCreateTime(
                                                    SentencedToEmpty(item, ['CreateTime'], '')
                                                )}`}</SDLText>
                                            </View>
                                        </View>
                                    </Touchable>
                                );
                            }}
                            data={this.props.equipmentInfoListData}
                        />
                    </View>
                </StatusPage>
            </View>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
