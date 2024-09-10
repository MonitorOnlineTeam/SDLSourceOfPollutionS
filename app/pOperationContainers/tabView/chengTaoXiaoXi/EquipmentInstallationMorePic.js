/*
 * @Description: 更多图片
 * @LastEditors: hxf
 * @Date: 2024-04-10 13:55:18
 * @LastEditTime: 2024-04-10 14:27:01
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/EquipmentInstallationMorePic.js
 */
import {
    Text, View, Modal
    , Image
    , TouchableOpacity
    , ScrollView
    , Platform
    , ActivityIndicator
} from 'react-native'
import React, { Component } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer';

import { SCREEN_WIDTH } from '../../../config/globalsize'
import { ImageUrlPrefix } from '../../../config';
import { getEncryptData } from '../../../dvapack/storage';
import { SentencedToEmpty, createNavigationOptions } from '../../../utils';
import globalcolor from '../../../config/globalcolor';

export default class EquipmentInstallationMorePic extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '附件',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        console.log('constructor props = ', props);
        this.state = {
            imagelist: SentencedToEmpty(props
                , ['navigation', 'state', 'params', 'AuditImages'], []),
            showImageView: false,
            currentPage: -1
        };
    }

    renderPickedImage = () => {
        const rtnVal = [];
        let imagelst = this.state.imagelist;
        const ProxyCode = getEncryptData();
        // let selectDelImgs = this.state.selectImages;
        this.state.imagelist.map((item, key) => {
            const source = { ...item };
            // const source = { uri: `${ImageUrlPrefix}${ProxyCode}/${item}` };
            console.log('source = ', source);

            // let attachID = item.attachID ? item.attachID : item.uri.split('/upload/')[1];

            rtnVal.push(
                <View key={`EquipmentInstallation${key}`}
                    style={{ alignItems: 'center', justifyContent: 'center', marginTop: 13, width: SCREEN_WIDTH / 3, backgroundColor: '#F5F6F9' }}>
                    <TouchableOpacity
                        onPress={() => {
                            let arr = this.state.selectImages;
                            this.setState({
                                showImageView: true
                                , currentPage: key
                            });
                        }}
                    >
                        <View style={{ borderWidth: 1 }}>
                            <Image
                                onError={() => {
                                    console.log('onError');
                                    // key
                                    let newData = this.state.imagelist.concat([]);
                                    newData[key].loadError = true;
                                    this.setState({ imagelist: newData });
                                }}
                                onLoadEnd={() => {
                                    console.log('onLoadEnd');
                                }}
                                resizeMethod={'resize'}
                                source={source.loadError ? require('../../../images/img_load_failure.png') : source}
                                style={{ width: (SCREEN_WIDTH - 40) / 3, height: (SCREEN_WIDTH - 40) / 3 }}
                            />
                        </View>
                        {false ? (
                            <Image
                                source={item.isSelect == true ? require('../../../images/login_checkbox_on.png') : require('../../../images/login_checkbox_off.png')}
                                style={{ width: 20, height: 20, position: 'absolute', bottom: 5, right: 5 }}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View >
            );
        });
        return rtnVal;
    };

    render() {
        return (
            <View style={[{
                width: SCREEN_WIDTH, flex: 1
            }]}>
                <ScrollView style={{ width: '100%', backgroundColor: '#F5F6F9' }}>
                    <View style={{ marginTop: 10, flexDirection: 'row', width: SCREEN_WIDTH, backgroundColor: '#F5F6F9', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>{
                        this.renderPickedImage()
                    }</View>
                </ScrollView>
                <Modal visible={this.state.showImageView} transparent={true} onRequestClose={() => this.setState({ showImageView: false })} enableSwipeDown={true}>
                    <ImageViewer
                        loadingRender={() => <ActivityIndicator color={globalcolor.backgroundGrey} size="large" />}
                        onClick={() => {
                            this.setState({ showImageView: false });
                        }}
                        ref="imageview"
                        saveToLocalByLongPress={false}
                        imageUrls={this.state.imagelist}
                        index={this.state.currentPage}
                    />
                </Modal>
            </View>
        )
    }
}