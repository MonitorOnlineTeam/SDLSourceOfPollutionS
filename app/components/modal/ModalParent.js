//import liraries
import React, { PureComponent } from 'react';
import { Modal, View, Image, TouchableOpacity, Text, Platform, Linking, NativeModules } from 'react-native';
import * as Progress from 'react-native-progress';
import Mask from '../Mask';
import RNFS from 'react-native-fs';

import { UrlInfo } from '../../config/globalconst';
import globalcolor from '../../config/globalcolor';
import { SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH, SCREEN_HEIGHT, little_font_size, WINDOW_HEIGHT, NOSTATUSHEIGHT } from '../../config/globalsize';
// create a component
class ModelParent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            UpdateContent: this.props.UpdateContent || '',
            progressText: 0,
            number: 0,
            failureReason: null,
            DownLoadPath: this.props.DownLoadPath || '',
            canUpdate: true
        };
    }

    showModal = () => {
        this.setState({ modalVisible: true });
    };
    hideModal = () => {
        if (this.props.ForcedUpdate == true) {
            return;
        } else {
            this.setState({ modalVisible: false });
        }
    };

    render() {
        return (
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    // 非强制更新才能用
                    if (this.props.ForcedUpdate == false) {
                        this.setState({ modalVisible: false });
                    }
                }}
            >
                {this.props.children ? (
                    this.props.children
                ) : (
                    <Mask
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        hideDialog={() => {
                            this.hideModal();
                        }}
                    >
                        <View
                            style={[
                                {
                                    height: (SCREEN_HEIGHT * 2) / 5,
                                    width: (SCREEN_WIDTH * 4) / 5 + 20,
                                    backgroundColor: 'transparent',
                                    paddingHorizontal: 10,
                                    borderBottomRightRadius: 5,
                                    borderBottomLeftRadius: 5,
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <Image
                                style={[
                                    {
                                        width: (SCREEN_WIDTH * 4) / 5,
                                        height: (SCREEN_WIDTH * 4 * 281) / 5 / 588
                                    }
                                ]}
                                resizeMode={'contain'}
                                source={require('../../images/uploadTitleImage.png')}
                            />
                            {SentencedToEmpty(this.props, ['ForcedUpdate'], false) == true ? null : (
                                <TouchableOpacity
                                    style={[{ position: 'absolute', top: 12, right: 0 }]}
                                    onPress={() => {
                                        this.hideModal();
                                    }}
                                >
                                    <Image source={require('../../images/icon_close_red.png')} style={[{ height: 20, width: 20 }]} />
                                </TouchableOpacity>
                            )}
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        width: (SCREEN_WIDTH * 4) / 5,
                                        backgroundColor: globalcolor.white,
                                        marginTop: 0,
                                        borderBottomRightRadius: 5,
                                        borderBottomLeftRadius: 5,
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text style={[{ width: (SCREEN_WIDTH * 4) / 5 - 60 }]}>{this.props.UpdateContent}</Text>
                                {this.state.canUpdate || true ? (
                                    <TouchableOpacity
                                        style={[{ marginTop: 15 }]}
                                        onPress={() => {
                                            this.setState({ canUpdate: false });
                                            this.downloadFile();
                                        }}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: (SCREEN_WIDTH * 4) / 5 - 60,
                                                    height: 29,
                                                    backgroundColor: '#4499f0',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 2
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: 14,
                                                        color: globalcolor.whiteFont
                                                    }
                                                ]}
                                            >
                                                {'更新'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <View
                                        style={[
                                            {
                                                width: (SCREEN_WIDTH * 4) / 5 - 60,
                                                height: 29,
                                                backgroundColor: '#4499f0',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: 2,
                                                marginTop: 15
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 14,
                                                    color: globalcolor.whiteFont
                                                }
                                            ]}
                                        >
                                            {'更新中'}
                                        </Text>
                                    </View>
                                )}
                                {<Progress.Bar progress={this.state.number} width={(SCREEN_WIDTH * 4) / 5 - 60} style={[{ marginTop: 10, marginBottom: 4 }]} />}
                                <Text
                                    style={[
                                        {
                                            fontSize: 14,
                                            color: '#dff4ff',
                                            marginBottom: 8
                                        }
                                    ]}
                                >
                                    {this.state.progressText + '%'}
                                </Text>
                            </View>
                        </View>
                    </Mask>
                )}
            </Modal>
        );
    }

    /*下载文件*/
    downloadFile = () => {
        if (Platform.OS == 'ios') {
            //ios利用系统直接下载打开
            this.showModal();
            Linking.openURL(this.props.DownLoadPath);
            this.hideModal();
            return;
        }
        // Linking.openURL(this.props.DownLoadPath);
        // console.log(this.props.DownLoadPath);
        // Linking.openURL('http://api.chsdl.net/phonemanager/IntelligenceOperations/app_download/Download.html');
        Linking.openURL(UrlInfo.AndroidUpdateWebPage);
        return;

        const downloadDest = `${RNFS.ExternalDirectoryPath}/${(Math.random() * 1000) | 0}.apk`;

        const options = {
            fromUrl: this.props.DownLoadPath,
            toFile: downloadDest,
            background: true,
            begin: res => { },
            progress: res => {
                // let pro = res.bytesWritten +'/'+ res.contentLength;
                let pro = Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
                let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
                this.setState({
                    progressText: _text,
                    number: pro
                });
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise
                .then(res => {
                    let pro = Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
                    let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
                    this.setState({
                        progressText: _text,
                        number: pro
                    });
                    NativeModules.InstallApk.install(downloadDest);
                    this.setState({ canUpdate: true });
                })
                .catch(err => {
                    this.setState({ canUpdate: true });
                    console.log('err', err);
                });
        } catch (e) {
            //   console.log(error);
            this.setState({ canUpdate: true });
        }
    };
}

//make this component available to the app
export default ModelParent;
