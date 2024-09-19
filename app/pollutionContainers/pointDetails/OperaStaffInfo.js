import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { getToken, loadStorage, getEncryptData, getRootUrl } from '../../dvapack/storage';
import { StatusPage, Touchable, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, makePhone, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../components/SDLPicker/constant/globalsize';
import { IMAGE_DEBUG, UrlInfo } from '../../config/globalconst';
/**
 * 超标记录
 */
@connect(({ pointDetails, app }) => ({
    operationStaffInfo: pointDetails.operationStaffInfo
}))
export default class OperaStaffInfo extends PureComponent {
    // static navigationOptions = ({ navigation }) =>
    //     createNavigationOptions({
    //         title: '运维人员',
    //         headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    //     });

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0,
            swiperShow: false,
            modalVisible: false,
            encryData: ''
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0);
        this.refreshData();
    }
    refreshData() {
        let encryData = getEncryptData();
        this.setState({ encryData: encryData });
        this.props.dispatch(
            createAction('pointDetails/operationStaffInfo')({
                params: {
                    UserID: getToken().UserId
                }
            })
        );
    }
    loadHandle(i) {
        let loadQueue = this.state.loadQueue;
        loadQueue[i] = 1;
        this.setState({
            loadQueue
        });
    }
    render() {
        const ProxyCode = getEncryptData();
        const imageUrls = [];
        let encryData = getEncryptData();
        const rootUrl = getRootUrl();
        if (this.props.operationStaffInfo.status == 200) {
            this.props.operationStaffInfo.data.Datas.CertAttachment.ImgList.map(item => {
                // imageUrls.push({ url: `${UrlInfo.ImageUrl + item}/Attachment?code=${this.state.encryData._55}` });
                let urlArray = item.split('/');
                imageUrls.push({
                    // url: `${UrlInfo.ImageUrl + item}`,
                    // url: `${rootUrl.ReactUrl}/upload/${item}`,
                    url: IMAGE_DEBUG ? `${ImageUrlPrefix}/${urlArray[urlArray.length - 1]}`
                        : `${ImageUrlPrefix}${ProxyCode}/${urlArray[urlArray.length - 1]}`,
                    // props: {
                    //     headers: {
                    //         ProxyCode: encryData
                    //     }
                    // }
                });
            });
        }

        return (
            <StatusPage
                status={this.props.operationStaffInfo.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.refreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.refreshData();
                }}
            >
                {this.props.operationStaffInfo.status == 200 ? (
                    <View>
                        {this.state.swiperShow == true && this.props.operationStaffInfo.data.Datas.CertAttachment.ImgList.length > 0 ? (
                            <View style={{ width: SCREEN_WIDTH, height: 200, backgroundColor: '#f0f0f0' }}>
                                <Swiper paginationStyle={styles.paginationStyle} loadMinimal loadMinimalSize={1} loop={true} style={styles.wrapper} height={(SCREEN_WIDTH * 40) / 75} showsButtons={false} autoplay={true}>
                                    {this.props.operationStaffInfo.data.Datas.CertAttachment.ImgList.map(item => {
                                        let urlArray = item.split('/');
                                        return (
                                            <Touchable
                                                onPress={() => {
                                                    this.setState({ modalVisible: true });
                                                }}
                                            >
                                                {/* <Image source={{ uri: `${UrlInfo.ImageUrl + item}/Attachment?code=${this.state.encryData._55}` }} style={styles.bannerImg} /> */}
                                                {/* <Image source={{ uri: `${UrlInfo.ImageUrl + item}`,headers:{ ProxyCode: encryData} }} style={styles.bannerImg} /> */}
                                                <Image source={{
                                                    // uri: `${rootUrl.ReactUrl}/upload/${item}`
                                                    uri: IMAGE_DEBUG ? `${ImageUrlPrefix}/${urlArray[urlArray.length - 1]}`
                                                        : `${ImageUrlPrefix}${ProxyCode}/${urlArray[urlArray.length - 1]}`,
                                                }} style={styles.bannerImg} />
                                            </Touchable>
                                        );
                                    })}
                                </Swiper>
                            </View>
                        ) : (
                            <View style={{ width: SCREEN_WIDTH, height: 200, backgroundColor: '#E9E9E9', justifyContent: 'center', alignItems: 'center' }}>
                                <SDLText style={{ fontSize: 30, color: '#aaa' }}>{'未上传证书照'}</SDLText>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', backgroundColor: 'white', marginTop: 1 }}>
                            <SDLText style={{ marginLeft: 13, width: 100 }}>运维区域</SDLText>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, marginRight: 13 }}>
                                <SDLText style={{ color: '#666' }}>{this.props.operationStaffInfo.data.Datas.GroupName || '暂未录入'}</SDLText>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', backgroundColor: 'white', marginTop: 1 }}>
                            <SDLText style={{ marginLeft: 13, width: 100 }}>姓名</SDLText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: 13 }}>
                                <SDLText style={{ color: '#666' }}>{this.props.operationStaffInfo.data.Datas.UserName}</SDLText>
                                <Touchable
                                    onPress={() => {
                                        if (imageUrls.length > 0) {
                                            this.setState({ modalVisible: true });
                                        } else {
                                            ShowToast('未上传证书照');
                                        }
                                    }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        {this.props.operationStaffInfo.data.Datas.CertInfo.map((item, index) => {
                                            return (
                                                <Image
                                                    key={`ic${index}`}
                                                    style={{ width: 30, height: 20, marginLeft: 3 }}
                                                    source={
                                                        item.CertificateTypeID == 240
                                                            ? item.IsExpire == true
                                                                ? require('../../images/ic_certificate_flue_gas_Invalid.png')
                                                                : require('../../images/ic_certificate_flue_gas_valid.png')
                                                            : item.CertificateTypeID == 242
                                                                ? item.IsExpire == true
                                                                    ? require('../../images/ic_certificate_voc_Invalid.png')
                                                                    : require('../../images/ic_certificate_voc_valid.png')
                                                                : item.CertificateTypeID == 241
                                                                    ? item.IsExpire == true
                                                                        ? require('../../images/ic_certificate_waste_water_Invalid.png')
                                                                        : require('../../images/ic_certificate_waste_water_valid.png')
                                                                    : null
                                                    }
                                                />
                                            );
                                        })}
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', backgroundColor: 'white', marginTop: 1 }}>
                            <SDLText style={{ marginLeft: 13, width: 100 }}>{'手机号'}</SDLText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: 13 }}>
                                <SDLText
                                    onPress={() => {
                                        makePhone(this.props.operationStaffInfo.data.Datas.Phone);
                                    }}
                                    style={{ color: '#666' }}
                                >
                                    {this.props.operationStaffInfo.data.Datas.Phone}
                                </SDLText>
                                <Touchable
                                    onPress={() => {
                                        makePhone(this.props.operationStaffInfo.data.Datas.Phone);
                                    }}
                                >
                                    <Image
                                        style={{ width: 30, height: 30 }}
                                        // source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557825944422&di=8cb34e5694c352cd62234d91221e1da5&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131009%2F10721699_230939373000_2.jpg' }}
                                        source={require('../../images/ic_phone.png')}
                                    />
                                </Touchable>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', backgroundColor: 'white', marginTop: 1 }}>
                            <SDLText style={{ marginLeft: 13, width: 100 }}>邮箱</SDLText>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, marginRight: 13 }}>
                                <SDLText style={{ color: '#666' }}>{this.props.operationStaffInfo.data.Datas.Email}</SDLText>
                            </View>
                        </View>
                    </View>
                ) : null}

                <Modal animationType={'slide'} visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        onClick={() => {
                            {
                                this.setState({
                                    modalVisible: false
                                });
                            }
                        }}
                        imageUrls={imageUrls}
                        index={0}
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
    },
    bannerImg: {
        height: (SCREEN_WIDTH * 40) / 75,
        width: SCREEN_WIDTH
    },
    wrapper: {
        height: (SCREEN_WIDTH * 40) / 75
    },
    paginationStyle: {
        bottom: 10
    },
    dotStyle: {
        width: 22,
        height: 3,
        backgroundColor: '#000',
        opacity: 0.4,
        borderRadius: 0
    },
    activeDotStyle: {
        width: 22,
        height: 3,
        backgroundColor: '#fff',
        borderRadius: 0
    },

    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.5)'
    },

    loadingImage: {
        width: 60,
        height: 60
    }
});
