import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { init } from 'react-native-amap-geolocation';
import { NavigationActions } from '../../../utils/RouterUtils'


import { getRootUrl, loadEncryptData, loadRootUrl } from '../../../dvapack/storage';
// import { NavigationActions, StackActions, SentencedToEmpty, createAction } from '../../../utils';
import { StackActions, SentencedToEmpty, createAction } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getLoginImage } from '../../../config/globalconst';
import { VersionInfo, CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, POLLUTION_PROJECT } from '../../../config/globalconst';
import { MyNavigationActions } from '../../../framework/RootView';

@connect()
export default class BootPage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
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
                    // console.log('BootPage getNoticeConfig = ', result);
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

    /**
     * 配置定位
     * @memberof Router
     */
    initLocation = () => {
        init({
            ios: '9df5f713ad0f0b8d2550436f5793e371',
            android:
                CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' || CURRENT_PROJECT == 'POLLUTION_PROJECT'
                    ? // ? '4502a480cb8cefdeb655628a5c89c36d'
                    '90af9eb2dd0b43367d0102d81842b5f7'
                    : CURRENT_PROJECT == 'GRID_PROJECT'
                        ? 'c1e5f6237a8bdd6d80cca037d9d48721'
                        : CURRENT_PROJECT == 'GRID_ORERATION_PROJECT'
                            ? 'e0038624faec949f08168cc5dc41222a'
                            : '90af9eb2dd0b43367d0102d81842b5f7'
        }); //后台定位~
    };

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
                    // this.props.dispatch(
                    //     StackActions.reset({
                    //         index: 0,
                    //         actions: [NavigationActions.navigate({ routeName: 'Login' })]
                    //     })
                    // );
                }, 3000);
            }
        }
    }

    async componentDidMount() {
        console.log('BootPage componentDidMount');
        let _this = this;
        console.log(5);
        let ProxyCode = await loadEncryptData();//初始获取本地授权码加密信息
        // let ProxyCode = ''
        console.log('4');
        if (ProxyCode && typeof ProxyCode == 'string'
            && ProxyCode != ''
        ) {
            console.log('1');
            // 每次启动获取最新的配置信息
            this.props.dispatch(
                createAction('login/reloadEnterpriseConfig')({
                    AuthCode: ProxyCode
                })
            );
        }
        if (ProxyCode == '61000' || ProxyCode == '61002') {
            console.log('2');
            setTimeout(() => {
                this.props.dispatch(NavigationActions.reset({ routeName: 'AdvertBootPage' }));
            }, 1000)
        } else {
            console.log('3');
            setTimeout(() => {
                this.props.dispatch(NavigationActions.reset({ routeName: 'Login' }));
            }, 1000)
        }
        // this.getNoticeConfig () ;
        this.initLocation();
    }

    render() {
        return (
            <View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', flex: 1, alignItems: 'center' }]}>
                <Image style={[{ height: 250, width: 250, marginTop: 104 }]} source={require('../../../images/splash_logo.png')} />
                <View style={[{ flex: 1 }]} />
                <Text style={[{ marginBottom: 100, fontSize: 18 }]}>{this.state.text}</Text>
            </View>
        );
    }
}
