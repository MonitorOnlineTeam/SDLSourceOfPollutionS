/*
 * @Description: 统一签到入口
 * @LastEditors: hxf
 * @Date: 2024-01-29 11:07:20
 * @LastEditTime: 2025-01-02 18:48:43
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/workbenchSignin/SignInEnter.js
 */
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../../utils';
import OnSideSignIn from './OnSideSignIn';
import OffSideSignIn from './OffSideSignIn';
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import moment from 'moment';

@connect(({ signInModel, SignInTeamStatisticsModel }) => ({
    topLevelTypeList: signInModel.topLevelTypeList // 第一大类数据
    , workTypeList: signInModel.workTypeList, // 工作类型数据
    signInType: signInModel.signInType, // 签到类型
    statisticsTypeList: SignInTeamStatisticsModel.statisticsTypeList,
}))
export default class SignInEnter extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '签到',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            // signInType: 0,
        }
    }

    componentDidMount() {
        this.props.dispatch(createAction('signInModel/getSignInType')({
            params: {}
        }));
        // 重新进入页面清空之前的数据
        this.props.dispatch(createAction('signInModel/updateState')({
            workTypeSelectedItem: null, // 选中的工作类型
            signInEntItem: null, // 选中的企业
            signInTime: '',
            signOutTime: '',
            signInType: 0
        }));
        /**
         * 获取打卡数据
         * 方法在SignInEnter中
         * 这样只有第一次进入签到页的时候才会触发
         * 切换运维现场和非现场时不在获取最近一条数据
         */

    }

    getSignInType = (typeIndex) => {
        const topLevelTypeList = SentencedToEmpty(this.props, ['topLevelTypeList'], []);

        if (topLevelTypeList.length >= 2) {
            this.props.dispatch(createAction('signInModel/getSignInType')({
                params: { ID: SentencedToEmpty(topLevelTypeList, [typeIndex, 'ID'], '') }
            }));
        } else {
            this.props.dispatch(createAction('signInModel/updateState')({
                signInType: 0
            }));
            this.props.dispatch(createAction('signInModel/getSignInType')({
                params: {}
            }));
        }
    }

    render() {
        const topButtonWidth = SCREEN_WIDTH / 2;
        return (<StatusPage
            backRef={true}
            status={200}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
            }}
            onErrorPress={() => {
                //错误页面按钮回调
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH, flex: 1
                , backgroundColor: '#f2f2f2'
            }]}>
                <View style={[{
                    flexDirection: 'row', height: 44
                    , width: SCREEN_WIDTH, alignItems: 'center'
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white', marginBottom: 5
                }]}>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    signInType: 0
                                }));
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    workTypeSelectedItem: null,
                                    signInEntItem: null
                                }));
                                this.getSignInType(0);
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 15
                                        , color: this.props.signInType == 0 ? '#4AA0FF' : '#666666'
                                    }]}>{'运维现场'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.signInType == 0 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                        <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                            onPress={() => {
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    signInType: 1
                                }));
                                // 点击运维现场不刷新fileUUID，切换到非现场生成新fileUUID，
                                // 回到运维现场时刷新fileUUID
                                this.props.dispatch(createAction('signInModel/updateState')({
                                    workTypeSelectedItem: null,
                                    signInEntItem: null,
                                    remark: '',
                                    fileUUID: `_sign_in_${new Date().getTime()}`
                                }));
                                this.getSignInType(1);
                            }}
                        >
                            <View
                                style={[{
                                    width: topButtonWidth, height: 44
                                    , alignItems: 'center'
                                }]}
                            >
                                <View style={[{
                                    width: topButtonWidth, height: 42
                                    , alignItems: 'center', justifyContent: 'center'
                                }]}>
                                    <Text style={[{
                                        fontSize: 15
                                        , color: this.props.signInType == 1 ? '#4AA0FF' : '#666666'
                                    }]}>{'非现场'}</Text>
                                </View>
                                <View style={[{
                                    width: 40, height: 2
                                    , backgroundColor: this.props.signInType == 1 ? '#4AA0FF' : 'white'
                                }]}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    (() => {
                        if (this.props.signInType == 0) {
                            return <OnSideSignIn />
                        } else if (this.props.signInType == 1) {
                            return <OffSideSignIn />
                        } else {
                            return null
                        }
                    })()
                }
                <View style={[{ width: SCREEN_WIDTH, height: Platform.OS === 'ios' ? 84 : 50, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, marginTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 34 : 0 // Add bottom margin for iOS safe area
                }]}>
                    <View>
                        <View
                            style={[{
                                alignItems: 'center'
                            }]}
                        >
                            <Image
                                style={[
                                    {
                                        height: 18,
                                        width: 18,
                                        // tintColor: this.state.showView == 'sign' ? '#4AA0FF' : '#666666'
                                        tintColor: '#4AA0FF'
                                    }
                                ]}
                                source={require('../../../images/ic_ct_tab_sign_in.png')}
                            />
                            <Text
                                style={[
                                    {
                                        fontSize: 11,
                                        color: this.state.showView == 'sign' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                            >
                                {`${'签到'}`}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            // 因为有修改功能，不能在进入时清理数据，需要在进入前清理数据
                            this.props.dispatch(createAction('signInModel/updateState')({
                                supplementaryTypeSelectedItem: null,
                                supplementaryTypeList: [],
                                supplementaryWorkTypeSelectedItem: null,
                                supplementaryWorkTypeResult: { status: -1 },
                                replenishmentSelectedEntItem: null,// 运维企业
                                supplementaryDate: '',
                                supplementaryArriveTime: '',
                                supplementaryLeaveTime: '',
                                supplementaryImageID: `supplementaryImage${new Date().getTime()}`,
                                supplementaryImageList: [],
                                supplementaryStatement: '',
                                signID: '', // 修改补签记录时需要这个参数
                                appID: '',// 修改补签记录时需要这个参数
                            }));
                            /**
                             * 修改补签时需要
                             * signID、appID
                             * 因此创建补签记录是要清除这两个参数
                             */
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'SupplementarySignIn' }))
                        }}
                    >
                        <View
                            style={[{
                                alignItems: 'center'
                            }]}
                        >
                            <Image
                                style={[
                                    {
                                        height: 16,
                                        width: 18,
                                        // tintColor: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                        tintColor: '#666666'
                                    }
                                ]}
                                source={require('../../../images/ic_supplementary_sign_in.png')}
                            />
                            <Text
                                style={[
                                    {
                                        fontSize: 11,
                                        color: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                            >
                                {`${'补签'}`}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            // 测试

                            this.props.dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                teamBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                                teamEndTime: moment().format('YYYY-MM-DD 23:59:59'),
                                statisticsType: this.props.statisticsTypeList.length > 1 ? 'team' : 'personal',//统计类型选中状态 team personal
                                teamStatisticsType: 'signIn',// signIn noSignIn
                            }));
                            this.props.dispatch(createAction('SignInTeamStatisticsModel/getTeamOperationSignIn')({}));
                            // this.props.dispatch(createAction('SignInTeamStatisticsModel/getPersonSignList')({}));

                            // this.props.dispatch(NavigationActions.navigate({ routeName: 'SignInStatistics' }))
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'SignInStatisticsWithTeam' }))
                        }}
                    >
                        <View
                            style={[{
                                alignItems: 'center'
                            }]}
                        >
                            <Image
                                style={[
                                    {
                                        height: 18,
                                        width: 18,
                                        // tintColor: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                        tintColor: '#666666'
                                    }
                                ]}
                                source={require('../../../images/ic_ct_tab_signin_statistics.png')}
                            />
                            <Text
                                style={[
                                    {
                                        fontSize: 11,
                                        color: this.state.showView == 'statistics' ? '#4AA0FF' : '#666666'
                                    }
                                ]}
                            >
                                {`${'统计'}`}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </StatusPage>);
    }
}