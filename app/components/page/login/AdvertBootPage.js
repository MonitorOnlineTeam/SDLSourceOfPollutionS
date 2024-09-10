import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { getRootUrl, loadEncryptData, loadRootUrl } from '../../../dvapack/storage';
import { SentencedToEmpty, createAction } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, POLLUTION_PROJECT } from '../../../config/globalconst';
import CountdownText from './CountdownText';
import { NavigationActions } from '../../../utils/RouterUtils';

@connect(({ baseModel }) => ({
    maintain: baseModel.maintain,
    showAdvertising: baseModel.showAdvertising
}))
export default class AdvertBootPage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            canLeave: false,
            text: '污染源监控平台'
        };
    }

    getNoticeConfig = () => {
        // 获取系统是否正在维护
        /**
         * {
         * ... 
         * maintain:true,
            maintenance:{
            title:系统维护公告
            subTitle：维护时间：6月25日9:30起
            start：尊敬的用户
            content：我们将于5月12日9:30起进行系统维护，预计完成时间为4-8小时。维护期间智慧运维APP、公司运维平台、智慧运维小程序将暂停使用，还请您提前做好相关安排，耐心等待。
            contentTags：[6月25日9:30起，4-8小时]
            end：给您带来的不便…..
            sender：智慧环保
            }
         * ...
         * }
         */
        this.props.dispatch(
            createAction('baseModel/chechUpdate')({
                successCallback: result => {
                    // 是否维护
                    let maintain = SentencedToEmpty(result, ['data', 'maintain'], false);
                    if (maintain) {
                        setTimeout(() => {
                            // this.props.dispatch(
                            //     StackActions.reset({
                            //         index: 0,
                            //         actions: [NavigationActions.navigate({
                            //             routeName: 'OperationalSystemNotice'
                            //             , params: {
                            //                 ...SentencedToEmpty(result, ['data', 'maintenance'], {})
                            //             }
                            //         })]
                            //     })
                            // );
                        }, 3000);
                    } else {
                        this.loadNativeConfig()
                    }
                },
                failureCallback: reason => {
                    this.loadNativeConfig()
                }
            })
        );
    }

    loadNativeConfig = async () => {
        await loadRootUrl();
        let rootUrl = getRootUrl();
        this.setState({ text: SentencedToEmpty(rootUrl, ['SystemName'], '污染源监控平台') });
        this.props.dispatch(createAction('login/updateState')({ ProjectName: SentencedToEmpty(rootUrl, ['SystemName'], '污染源监控平台') }));
        if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT || CURRENT_PROJECT == POLLUTION_PROJECT) {
            if (typeof rootUrl == 'undefined' || !rootUrl) {
                setTimeout(() => {
                    // this.props.dispatch(
                    //     StackActions.reset({
                    //         index: 0,
                    //         actions: [NavigationActions.navigate({ routeName: 'SetEnterpriseInformation' })]
                    //     })
                    // );
                }, 3000);
            } else {
                setTimeout(() => {

                }, 3000);
            }
        }
    }

    async componentDidMount() {
        await loadEncryptData();//初始获取本地授权码加密信息
        // this.getNoticeConfig ();
        // this.loadNativeConfig();
        await loadRootUrl();
    }

    render() {
        let that = this;
        return (<ImageBackground
            source={require('../../../images/bg_boot_page.png')}
            style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <View style={{
                width: SCREEN_WIDTH
                , flexDirection: 'row', justifyContent: 'flex-end'
            }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.reset({ routeName: 'Login' }));
                    }}
                >
                    <View style={{
                        height: 30, minWidth: 68
                        , alignItems: 'center', justifyContent: 'center'
                        , backgroundColor: '#4B4B4B55', marginTop: 25
                        , marginRight: 13, borderRadius: 20
                    }}>
                        <CountdownText textStyle={{ fontSize: 16, color: '#fff' }} duration={5}
                            prefix={'跳过'}
                            endCallback={() => {
                                // setTimeout(() => {
                                // console.log('maintain = ',that.props.maintain);
                                // console.log('showAdvertising = ',that.props.showAdvertising);
                                if (!that.props.maintain && !this.props.showAdvertising) {
                                    console.log('AdvertBootPage goto Login');
                                    this.props.dispatch(NavigationActions.reset({ routeName: 'Login' }));
                                }
                                // }, 3000);
                            }}
                            changeCallback={(remainingTime) => { }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ width: SCREEN_WIDTH, flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={require('../../../images/img_advert_boot_title.png')}
                    style={{ width: SCREEN_WIDTH * 3 / 4, height: SCREEN_WIDTH * 3 / 8, marginTop: 22 }}
                    resizeMode={'cover'}
                />
                <Image source={require('../../../images/img_advert_boot_text.png')}
                    style={{ width: 120, height: 45 }}
                    resizeMode={'cover'}
                />
                <View>
                    <Text style={{ fontSize: 16, color: '#ffffff' }}>{'监测数据查询、数据超标报警'}</Text>
                    <Text style={{ fontSize: 16, color: '#ffffff', marginTop: 15 }}>{'运维情况查询、设备信息查询'}</Text>
                </View>
                <Image source={require('../../../images/img_advert_boot_arrow.png')}
                    style={{ width: 25, height: 25 }}
                    resizeMode={'cover'}
                />
                <View style={{ marginBottom: 18 }}>
                    <Image source={require('../../../images/img_advert_boot_qrcode.png')}
                        style={{ width: 75, height: 75 }}
                        resizeMode={'cover'}
                    />
                    <Text style={{ fontSize: 14, color: '#ffffff', marginTop: 8 }}>{'扫一扫查看'}</Text>
                </View>
            </View>
            <View style={{ width: SCREEN_WIDTH, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('baseModel/updateState')({ showAdvertising: true }))
                        this.props.dispatch(
                            NavigationActions.navigate({ routeName: 'AdvertisingPage' })
                        );
                    }}
                >
                    <View style={{
                        width: 220, height: 42, borderRadius: 21
                        , backgroundColor: '#4B4B4B55', justifyContent: 'center'
                        , alignItems: 'center', flexDirection: 'row', marginBottom: 53
                    }}>
                        <Text style={{ fontSize: 17, color: '#ffffff' }}>{'点击跳转至详情页'}</Text>
                        <Image style={{ tintColor: 'white', height: 13, width: 13, marginLeft: 9 }} source={require('../../../images/right.png')} />
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>);
    }
}
