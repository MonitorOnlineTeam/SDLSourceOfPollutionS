import { Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer';

import { createNavigationOptions, SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { SDLText } from '../../components';
import { getEncryptData } from '../../dvapack/storage';
import { ImageUrlPrefix } from '../../config';

export default class RepulseCheckList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editCommitEnable: false,
            modalVisible: false,
            showImages: [],
            showImageIndex: 0,
        };

        props.navigation.setOptions({
            title: '打回记录',
        });
    }

    renderCheckStep = (si, idx) => {
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#ffffff', flexWrap: 'wrap', marginBottom: 10, paddingHorizontal: 13 }}>
                <Text style={{ color: '#333', width: SCREEN_WIDTH - 46 }}>{`步骤${idx + 1}：${si.QTitle}`}</Text>

                <Text style={{ color: '#666666', marginTop: 10, width: SCREEN_WIDTH - 46 }}>{`${si.QContent}`}</Text>
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
                            let newplanItems = this.state.planItems;
                            si.ReContent = text;
                            newplanItems[idx] = si;
                            this.setState({ planItems: newplanItems, ReContent: text }, () => {
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
                </View>
            </View>
        );
    };

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
                </View>
            );
        });
        return rtnVal;
    };

    render() {
        console.log('props = ', this.props);
        const oldPlanItems = SentencedToEmpty(this.props
            , ['route', 'params',
                'params', 'data', 'oldPlanItems'], []);
        return (
            <ScrollView
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                    , paddingTop: 10
                }]}
            >
                {oldPlanItems.map((item, index) => {
                    return this.renderCheckStep(item, index);
                })}
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
            </ScrollView>
        )
    }
}