import React, { PureComponent } from 'react';
import { View, Image, Modal, Alert, CameraRoll, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
// import RNFS from 'react-native-fs';

import Touchable from '../../base/Touchable';
import ImageUploadTouch from './ImageUploadTouch';
import ImageUploadTouchNetCore from './ImageUploadTouchNetCore';
import ImageDeleteTouch from './ImageDeleteTouch';
import { getEncryptData, getRootUrl } from '../../../dvapack/storage';
import { IMAGE_DEBUG, ImageUrlPrefix, UrlInfo } from '../../../config';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SDLText } from '../..';
import ImageDeleteTouchNetCore from './ImageDeleteTouchNetCore';
import { SentencedToEmpty } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
// 大图展示多条记录
const isMultiplePictures = true;
/**
 * 封装后的ImageGrid
 */
@connect(({ imageModel }) => ({
    status: imageModel.status
}))
export default class ImageGrid extends PureComponent {
    constructor(props) {
        super(props);
        const { Imgs = [], interfaceName = 'original' } = this.props; //Imgs [{AttachID:''}]
        this.propsImage = Imgs;
        const rootUrl = getRootUrl();
        let largImage = [];
        let tempObject = {}
        if (isMultiplePictures) {
            const ProxyCode = getEncryptData();
            Imgs.map((item, index) => {
                tempObject = {
                    // url: `${rootUrl.ReactUrl}/upload/${item.AttachID}`, 
                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                        : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                    AttachID: item.AttachID
                }
                if (
                    // interfaceName == 'netCore'|| 
                    false && interfaceName == 'DataAnalyze') {
                    tempObject = {
                        url: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}`,
                        AttachID: item.AttachID
                    }
                }
                largImage.push(tempObject);
            });
        }

        this.state = {
            Imgs: Imgs,
            encryData: {},
            showUrls: [],
            index: 0,
            modalVisible: false,
            largImage,
        };
    }

    async componentDidMount() {
        const encryData = await getEncryptData();
        this.setState({ encryData });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { Imgs, interfaceName = 'original' } = nextProps;
        // 当传入的type发生变化的时候，更新state
        if (Imgs != this.propsImage) {
            this.propsImage = Imgs;

            const rootUrl = getRootUrl();
            let largImage = [];
            let tempObject = {}
            if (isMultiplePictures) {
                const ProxyCode = getEncryptData();
                Imgs.map((item, index) => {
                    tempObject = {
                        // url: `${rootUrl.ReactUrl}/upload/${item.AttachID}`,
                        // url: `${ImageUrlPrefix}/${item.AttachID}`,
                        url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                            : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                        AttachID: item.AttachID
                    }
                    if (
                        // interfaceName == 'netCore'|| 
                        false && interfaceName == 'DataAnalyze') {
                        tempObject = {
                            url: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}`,
                            AttachID: item.AttachID
                        }
                    }
                    largImage.push(tempObject);
                });
            }

            return {
                Imgs, largImage
            };
        }
        // 否则，对于state不进行任何操作
        return null;
    }
    savePhoto(url) {
        if (Platform.OS == 'ios') {
            let promise = CameraRoll.saveToCameraRoll(url);
            promise
                .then(function (result) {
                    Alert.alert('提示', '已保存到系统相册');
                })
                .catch(function (error) {
                    Alert.alert('提示', '保存失败！\n' + error);
                });
            return;
        }
        let fileUrl = url;
        let fileName = this.state.showUrls[0].AttachID;
        // const downloadDest = `${RNFS.PicturesDirectoryPath}/${fileName}`;
        // const options = {
        //     fromUrl: fileUrl,
        //     toFile: downloadDest,
        //     background: true,
        //     begin: res => { },
        //     progress: res => {
        //         // let pro = res.bytesWritten +'/'+ res.contentLength;
        //         let pro = Math.round((res.bytesWritten / res.contentLength) * 100) / 100;
        //         let _text = Math.round((res.bytesWritten / res.contentLength) * 100);
        //         this.setState({
        //             progressText: _text,
        //             number: pro
        //         });
        //     }
        // };
        // try {
        //     const ret = RNFS.downloadFile(options);
        //     ret.promise
        //         .then(res => {
        //             // 未奔溃，无法访问到文件
        //             if (res && typeof res != 'undefined' && res.statusCode == 200) {
        //                 Alert.alert('提示', '图片保存成功！');
        //                 return;
        //             }
        //             Alert.alert('提示', '图片保存失败！');
        //         })
        //         .catch(err => {
        //             console.log('err', err);
        //         });
        // } catch (e) {
        //     console.log(error);
        //     return;
        // }
    }

    render() {
        const rootUrl = getRootUrl();

        /**
         * componentType    normal      普通相机 
         *                  taskhandle  水印相机
         */
        const { componentType = 'normal', isUpload = false, isDel = false, UUID = '', uploadCallback = () => { }, delCallback = () => { }, extraInfo = {} } = this.props;
        const { style, interfaceName = 'original', buttonPosition = 'front' } = this.props;
        /**
         * interfaceName    original:原有接口       netCore:netCore接口
         * buttonPosition   front:添加按钮在前              behind:添加按钮在后
         */
        if (!isUpload && this.props.Imgs.length == 0) {
            return <View style={[{ flexDirection: 'row', width: '100%', backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap' }, style, {}]} />;
        } else {
            const rtnVal = [];
            if (isUpload && buttonPosition != 'behind') {
                if (
                    // interfaceName != 'netCore'&& 
                    true || interfaceName != 'DataAnalyze'
                ) {
                    rtnVal.push(
                        <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 8 }}>
                            <ImageUploadTouch
                                style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }}
                                componentType={componentType}
                                extraInfo={extraInfo}
                                uuid={UUID}
                                callback={images => {
                                    console.log('ImageGrid images = ', images);
                                    const ProxyCode = getEncryptData();
                                    let Imgs = [...this.state.Imgs];
                                    let largImage = [].concat(this.state.largImage);
                                    let newItem = [];
                                    let tempObject;
                                    images.map((item, key) => {
                                        newItem.push({ AttachID: item.attachID });
                                        Imgs.push({ AttachID: item.attachID });
                                        tempObject = {
                                            // url: `${rootUrl.ReactUrl}/upload/${item.AttachID}`,
                                            // url: `${ImageUrlPrefix}/${item.AttachID}`,
                                            url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                                                : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                                            AttachID: item.AttachID
                                        }
                                        largImage.push(tempObject);
                                    });

                                    this.setState({ Imgs: Imgs, largImage });
                                    uploadCallback(newItem);
                                }}
                            >
                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 60, height: 60 }} />
                            </ImageUploadTouch>
                        </View>
                    );
                } else {
                    rtnVal.push(
                        <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 8 }}>
                            <ImageUploadTouchNetCore
                                interfaceName={interfaceName}
                                style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }}
                                componentType={componentType}
                                extraInfo={extraInfo}
                                uuid={UUID}
                                callback={images => {
                                    let Imgs = [...this.state.Imgs];
                                    let largImage = [].concat(this.state.largImage);
                                    let newItem = [];
                                    let tempObject;
                                    images.map((item, key) => {
                                        newItem.push({ AttachID: item.attachID, url: item.url });
                                        Imgs.push({ AttachID: item.attachID, url: item.url });
                                        tempObject = {
                                            url: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}`,
                                            AttachID: item.AttachID
                                        }
                                        largImage.push(tempObject);
                                    });

                                    this.setState({ Imgs: Imgs, largImage });
                                    uploadCallback(newItem);
                                }}
                            >
                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 60, height: 60 }} />
                            </ImageUploadTouchNetCore>
                        </View>
                    );
                }
            }
            const ProxyCode = getEncryptData();
            this.state.Imgs.map((item, key) => {
                let encryData = getEncryptData();
                const rootUrl = getRootUrl();
                let source = {
                    uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/thumb_${item.AttachID}`
                        : `${ImageUrlPrefix}${ProxyCode}/thumb_${item.AttachID}`,
                };
                if (
                    false && interfaceName == 'DataAnalyze') {
                    source = { uri: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}` };
                }
                console.log('source = ', source);

                // 增加 resizeMethod={'resize'} 在图片解码之前，使用软件算法对其在内存中的数据进行修改。当图片尺寸比容器尺寸大得多时，应该优先使用此选项。
                rtnVal.push(
                    <View key={`image_${key}`} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                        <Image source={source} style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }} resizeMethod={'resize'} />
                        <Touchable
                            onPress={() => {
                                const ProxyCode = getEncryptData();
                                if (
                                    // interfaceName == 'netCore'|| 
                                    false && interfaceName == 'DataAnalyze'
                                ) {
                                    this.setState({
                                        modalVisible: true,
                                        index: key,
                                        showUrls: [
                                            {
                                                url: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}`,
                                                AttachID: item.AttachID
                                                // You can pass props to <Image />.
                                                // props: {
                                                //     headers: { ProxyCode: encryData}
                                                // }
                                            }
                                        ]
                                    });
                                } else {
                                    this.setState({
                                        modalVisible: true,
                                        index: key,
                                        showUrls: [
                                            {
                                                url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                                                    : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                                                AttachID: item.AttachID
                                                // You can pass props to <Image />.
                                                // props: {
                                                //     headers: { ProxyCode: encryData}
                                                // }
                                            }
                                        ]
                                    });
                                }
                            }}
                            style={[{ position: 'absolute', bottom: 0, left: 0 }]}
                        >
                            <View style={[{ height: 50, width: 50 }]} />
                        </Touchable>
                        {isDel ? (
                            <View style={[{ position: 'absolute', top: 0, left: 60 }]}>
                                {
                                    // interfaceName != 'netCore'&& 
                                    true || interfaceName != 'DataAnalyze' ? (
                                        <ImageDeleteTouch
                                            AttachID={item.AttachID}
                                            callback={() => {
                                                let Imgs = [...this.state.Imgs];
                                                let largImage = [...this.state.largImage];
                                                Imgs.splice(key, 1);
                                                largImage.splice(key, 1);
                                                this.setState({ Imgs: Imgs, largImage });
                                                delCallback(key);
                                            }}
                                        >
                                            <Image source={require('../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                                        </ImageDeleteTouch>
                                    ) : (
                                        <ImageDeleteTouchNetCore
                                            interfaceName={interfaceName}
                                            AttachID={item.AttachID}
                                            callback={() => {
                                                let Imgs = [...this.state.Imgs];
                                                let largImage = [...this.state.largImage];
                                                Imgs.splice(key, 1);
                                                largImage.splice(key, 1);
                                                this.setState({ Imgs: Imgs, largImage });
                                                delCallback(key);
                                            }}
                                        >
                                            <Image source={require('../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                                        </ImageDeleteTouchNetCore>
                                    )}
                            </View>
                        ) : null}
                    </View>
                );
            });
            if (isUpload && buttonPosition == 'behind') {
                if (
                    // interfaceName != 'netCore'&& 
                    true || interfaceName != 'DataAnalyze') {
                    rtnVal.push(
                        <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 8 }}>
                            <ImageUploadTouch
                                style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }}
                                componentType={componentType}
                                extraInfo={extraInfo}
                                uuid={UUID}
                                callback={images => {
                                    const ProxyCode = getEncryptData();
                                    let Imgs = [...this.state.Imgs];
                                    let largImage = [].concat(this.state.largImage);
                                    let newItem = [];
                                    let tempObject;
                                    images.map((item, key) => {
                                        newItem.push({ AttachID: item.attachID });
                                        Imgs.push({ AttachID: item.attachID });
                                        tempObject = {
                                            // url: `${rootUrl.ReactUrl}/upload/${item.AttachID}`,
                                            // url: `${ImageUrlPrefix}/${item.AttachID}`,
                                            url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${item.AttachID}`
                                                : `${ImageUrlPrefix}${ProxyCode}/${item.AttachID}`,
                                            AttachID: item.AttachID
                                        }
                                        largImage.push(tempObject);
                                    });
                                    this.setState({ Imgs: Imgs, largImage });
                                    uploadCallback(newItem);
                                }}
                            >
                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 60, height: 60 }} />
                            </ImageUploadTouch>
                        </View>
                    );
                } else {
                    rtnVal.push(
                        <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 8 }}>
                            <ImageUploadTouchNetCore
                                interfaceName={interfaceName}
                                style={{ width: 60, height: 60, marginRight: 4, marginLeft: 8, marginBottom: 5, marginTop: 8 }}
                                componentType={componentType}
                                extraInfo={extraInfo}
                                uuid={UUID}
                                callback={images => {
                                    let Imgs = [...this.state.Imgs];
                                    let largImage = [].concat(this.state.largImage);
                                    let newItem = [];
                                    images.map((item, key) => {
                                        newItem.push({ AttachID: item.attachID, url: item.url });
                                        Imgs.push({ AttachID: item.attachID, url: item.url });
                                        tempObject = {
                                            url: `${UrlInfo.DataAnalyze}/${SentencedToEmpty(item, ['url'], '')}`,
                                            AttachID: item.AttachID
                                        }
                                        largImage.push(tempObject);
                                    });
                                    this.setState({ Imgs: Imgs, largImage });
                                    uploadCallback(newItem);
                                }}
                            >
                                <Image source={require('../../../images/home_point_add.png')} style={{ width: 60, height: 60 }} />
                            </ImageUploadTouchNetCore>
                        </View>
                    );
                }
            }
            if (rtnVal.length == 0) {
                rtnVal.push(
                    <View key={'imge_upload'} style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 10 }}>
                        <View style={{ width: 60, height: 60, marginRight: 5, marginLeft: 10, marginBottom: 5 }}></View>
                    </View>
                );
            }
            return (
                <View style={[{ flexDirection: 'row', width: '100%', backgroundColor: '#ffffff', alignItems: 'center', flexWrap: 'wrap' }, style, {}]}>
                    {rtnVal}
                    <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                        <ImageViewer
                            saveToLocalByLongPress={false}
                            menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                            onClick={() => {
                                {
                                    this.setState({
                                        modalVisible: false
                                    });
                                }
                            }}
                            onSave={url => {
                                this.savePhoto(this.state.showUrls[0].url);
                            }}
                            imageUrls={isMultiplePictures ? this.state.largImage : this.state.showUrls}
                            // index={0}
                            index={isMultiplePictures ? this.state.index : 0}
                        />
                    </Modal>
                </View>
            );
        }
    }
}
