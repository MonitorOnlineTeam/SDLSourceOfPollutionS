/*
 * @Description: 报警处理详情
 * @LastEditors: hxf
 * @Date: 2024-10-17 18:56:00
 * @LastEditTime: 2024-10-22 16:38:54
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbench/AlarmHandleDetail.js
 */
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { createNavigationOptions, SentencedToEmpty } from '../../../utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { SDLText } from '../../../components';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';
import { getEncryptData, getRootUrl } from '../../../dvapack/storage';
import { IMAGE_DEBUG, ImageUrlPrefix } from '../../../config';
import { connect } from 'react-redux';

@connect(({ alarm }) => ({
    responseRecordType: alarm.responseRecordType,
    // exceptionResult: alarm.exceptionResult,
    // exceptionData: alarm.exceptionData,
    // missResult: alarm.missResult,
    // missData: alarm.missData,
    // overResult: alarm.overResult,
    // overData: alarm.overData,
}))
export default class AlarmHandleDetail extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '报警响应记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        that = this;
        console.log('props = ', props);
        const ProxyCode = getEncryptData();
        let recordData = SentencedToEmpty(props
            , ['route', 'params', 'params', 'recordData'], {});
        let _imageList = SentencedToEmpty(recordData, ['file'], []);
        _imageList.map((item, key) => {
            item.attachID = item.FileName;
            item.url = `${ImageUrlPrefix}${ProxyCode}/${item.FileName}`;
        })
        this.state = {
            datatype: 0,
            loading: false,
            encryData: '',
            imagelist: _imageList,
            imgUrls: _imageList,
            VerifyState: SentencedToEmpty(recordData, ['responseStatus'], ''),
            VerifyMessage: SentencedToEmpty(recordData, ['responseMsg'], ''),
            VerifyType: {},
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
    }

    renderPickedImage = () => {
        const ProxyCode = getEncryptData();
        const rtnVal = [];
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();
        this.state.imagelist.map((item, key) => {
            // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}/Attachment?code=${this.state.encryData}` } : require('../../../images/home_point_add.png');
            // const source = item.attachID != '' ? { uri: `${UrlInfo.ImageUrl}${item.attachID}`,headers:{ ProxyCode: encryData} } : require('../../../images/home_point_add.png');
            // const source = item.attachID != '' ? { uri: `${rootUrl.ReactUrl}/upload/${item.attachID}` } : require('../../../images/home_point_add.png');
            const source = item.attachID != '' ? {
                uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.attachID}`
                    : `${ImageUrlPrefix}${ProxyCode}/${item.attachID}`
            } : require('../../../images/home_point_add.png');
            rtnVal.push(
                <View key={item.attachID} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                    <Image resizeMethod={'resize'} source={source} style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }} />
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ modalVisible: true, index: key });
                        }}
                        style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                    >
                        <View style={[{ height: 50, width: 50 }]} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(
                                createAction('alarm/DelPhotoRelation')({
                                    params: {
                                        code: item.attachID,
                                        callback: () => {
                                            this.setState(state => {
                                                const imagelist = state.imagelist;
                                                let imgUrls = state.imgUrls;
                                                const removeIndex = state.imagelist.findIndex((value, index, arr) => value.uploadID === item.uploadID);
                                                imagelist.splice(removeIndex, 1);
                                                imgUrls.splice(removeIndex, 1);
                                                const refresh = !state.refresh;
                                                return { imagelist, refresh, imgUrls };
                                            });
                                        }
                                    }
                                })
                            );
                        }}
                        style={[{ position: 'absolute', top: -8, left: SCREEN_WIDTH / 4 - 27 }]}
                    >
                        <Image source={require('../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                    </TouchableOpacity> */}
                </View>
            );
        });
        return rtnVal;
    };

    render() {
        return (
            <ScrollView
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
            >
                <View style={{ width: SCREEN_WIDTH, height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <TextInput
                        editable={false}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        onChangeText={text => {
                            //动态更新组件内state 记录输入内容
                            this.setState({ VerifyMessage: text });
                        }}
                        value={this.state.VerifyMessage}
                        multiline={true}
                        placeholder="点击输入核查信息~"
                        style={{ color: '#333', width: SCREEN_WIDTH - 28, height: 140, backgroundColor: '#f0f0f0', padding: 13, textAlignVertical: 'top' }}
                    />
                </View>
                <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, minHeight: 20, marginTop: 10, backgroundColor: '#ffffff' }}>
                    <SDLText style={[styles.texttitleStyle, { marginTop: 10, marginLeft: 13, color: '#333' }]}>附件图片：</SDLText>
                    <View style={{ flexDirection: 'row', marginTop: 10, width: SCREEN_WIDTH, backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                        {this.renderPickedImage()}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }}>
                    <SDLText style={{ marginLeft: 13 }}>检查状态</SDLText>
                    <Text
                        style={[{ flex: 1, textAlign: 'right', marginRight: 13, color: '#666' }]}
                    >
                        {`${this.state.VerifyState}`}
                    </Text>
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
                {this.state.loading == true ? <SimpleLoadingComponent message={'提交中'} /> : null}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});