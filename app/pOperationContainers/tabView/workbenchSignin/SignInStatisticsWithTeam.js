/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2025-01-01 12:55:57
 * @LastEditTime: 2025-01-02 18:42:54
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/workbenchSignin/SignInStatisticsWithTeam.js
 */
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { useSelector } from 'react-redux';
import { dispatch } from '../../../..';
import { createAction, NavigationActions, SentencedToEmpty, SentencedToEmptyTimeString } from '../../../utils';
import SignInStatistics from './SignInStatistics';
import { SimplePickerRangeDay, StatusPage } from '../../../components';
import moment from 'moment';

export default function SignInStatisticsWithTeam() {

    const { statisticsType, statisticsTypeList
    } = useSelector(state => state.SignInTeamStatisticsModel);
    const topButtonWidth = SCREEN_WIDTH / (statisticsTypeList.length);
    console.log('statisticsTypeList = ', statisticsTypeList);
    console.log('statisticsType = ', statisticsType);
    return (
        <View style={[{
            width: SCREEN_WIDTH, flex: 1
        }]}>
            {
                statisticsTypeList.length < 2 ? null
                    : <View style={[{
                        flexDirection: 'row', height: 44
                        , width: SCREEN_WIDTH, alignItems: 'center'
                        , justifyContent: 'space-between'
                        , backgroundColor: 'white', marginBottom: 4
                    }]}>
                        {
                            statisticsTypeList.map((item, index) => {
                                return <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                        onPress={() => {
                                            dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                                statisticsType: item.value
                                            }))
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
                                                    , color: statisticsType == item.value ? '#4AA0FF' : '#666666'
                                                }]}>{item.label}</Text>
                                            </View>
                                            <View style={[{
                                                width: 40, height: 2
                                                , backgroundColor: statisticsType == item.value ? '#4AA0FF' : 'white'
                                            }]}>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            })
                        }

                    </View>
            }

            {
                statisticsType == 'team' ? <TeamStatistics />
                    : statisticsType == 'personal' ? <SignInStatistics /> : null
            }
        </View>
    )
}

function TeamStatistics() {

    const { teamStatisticsType
        , teamResult
        , teamBeginTime,
        teamEndTime
    } = useSelector(state => state.SignInTeamStatisticsModel);

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        // beginTime = moment()
        //     // .subtract(7, 'day')
        //     .format('YYYY-MM-DD 00:00:00');
        // endTime = moment().format('YYYY-MM-DD 23:59:59');
        beginTime = teamBeginTime;
        endTime = teamEndTime;
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                console.log('endMoment = ', endMoment);
                console.log('startMoment = ', startMoment);
                dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                    teamBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                    teamEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                }));
                dispatch(createAction('SignInTeamStatisticsModel/getTeamOperationSignIn')({}));
            }
        };
    }

    getTag = (tagType) => {

        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        // #FFA415
        let _color = '#FFA415', tagTypeStr = '未知';
        if (tagType == 572) {
            _color = '#28DB96';
            tagTypeStr = '非驻厂';
        } else if (tagType == 573) {
            _color = '#4F6BF8';
            tagTypeStr = '白班';
        } else if (tagType == 574) {
            _color = '#FF4747';
            tagTypeStr = '夜班';
        } else if (tagType == 575
            || tagType == 576
            || tagType == 577
            || tagType == 578
            || tagType == 581
            || tagType == 706
            || tagType == 713
        ) {
            _color = '#FFA415';
            tagTypeStr = '非现场';
        } else if (tagType == 0) {
            _color = '#4F6BF8';
            tagTypeStr = '现场';
        }
        return (<View style={{ flexDirection: 'row', width: 44, height: 16 }}>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: 'transparent', borderRightColor: _color
                    , borderTopColor: 'transparent', borderBottomColor: _color
                }]}
            ></View>
            <View
                style={[{
                    height: 16, flex: 1
                    , backgroundColor: _color
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >

                <Text
                    style={[{
                        color: 'white', fontSize: 8
                        , padding: 0, lineHeight: 10
                    }]}
                >{`${tagTypeStr}`}</Text>
            </View>
            <View
                style={[{
                    height: 0, width: 0
                    , borderLeftWidth: 2, borderRightWidth: 2
                    , borderTopWidth: 8, borderBottomWidth: 8
                    , borderLeftColor: _color, borderRightColor: 'transparent'
                    , borderTopColor: _color, borderBottomColor: 'transparent'
                }]}
            ></View>
        </View>);
    }

    getTagType = (tagType) => {

        /**
         * 572  非驻厂运维
         * 573  驻厂白班
         * 574  驻厂夜班
         * 
         * 非现场
         * 575  环保局/监测站
         * 576  拜访客户
         * 577  现场检查
         * 578  总部/办事处
         * 581  其他
         */
        // #FFA415
        let _color = '#FFA415', tagTypeStr = '未知';
        if (tagType == 572) {
            _color = '#28DB96';
            tagTypeStr = '非驻厂';
        } else if (tagType == 573) {
            _color = '#4F6BF8';
            tagTypeStr = '白班';
        } else if (tagType == 574) {
            _color = '#FF4747';
            tagTypeStr = '夜班';
        } else if (tagType == 575
            || tagType == 576
            || tagType == 577
            || tagType == 578
            || tagType == 581
            || tagType == 706
            || tagType == 713
        ) {
            _color = '#FFA415';
            tagTypeStr = '非现场';
        } else if (tagType == 0) {
            _color = '#4F6BF8';
            tagTypeStr = '现场';
        }
        return { _color, tagTypeStr };
    }

    return (
        <View style={[{
            width: SCREEN_WIDTH, flex: 1
            , backgroundColor: 'white'
        }]}>
            <SimplePickerRangeDay ref={ref => (this.rangePicker = ref)} style={[{ width: 120 }]} option={this.getRangeDaySelectOption()} />
            <StatusPage
                status={SentencedToEmpty(teamResult, ['status'], 1000)}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    // this.statusPageOnRefresh();
                }}>
                <View
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , backgroundColor: 'white'
                    }]}>
                    <View
                        style={[{
                            flexDirection: 'row', width: SCREEN_WIDTH - 40
                            , marginLeft: 20, justifyContent: 'space-between'
                        }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                    teamStatisticsType: 'signIn'
                                }));
                            }}
                        >
                            <View
                                style={[{
                                    alignItems: 'center'
                                }]}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 50) / 2, height: 72
                                        , borderRadius: 4
                                        , backgroundColor: teamStatisticsType == 'signIn' ? '#4AA0FF' : '#F1F2F4'
                                        , paddingLeft: 15
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 12, color: teamStatisticsType == 'signIn' ? '#D7EAFE' : '#999999'
                                            , marginTop: 15
                                        }]}>
                                        {'已签到'}
                                    </Text>
                                    <Text
                                        style={[{
                                            fontSize: 19, color: teamStatisticsType == 'signIn' ? '#ffffff' : '#333333'
                                            , marginTop: 6
                                        }]}>
                                        {SentencedToEmpty(teamResult, ['data', 'Datas', 'signCount'], 0)}
                                        <Text
                                            style={[{
                                                fontSize: 12, marginLeft: 7
                                                , color: teamStatisticsType == 'signIn' ? '#D7EAFE' : '#999999'
                                            }]}
                                        >{'人'}</Text>
                                    </Text>
                                </View>
                                {
                                    teamStatisticsType == 'signIn' ?
                                        <View style={[{
                                            width: 0,
                                            height: 0,
                                            backgroundColor: 'transparent',
                                            borderStyle: 'solid',
                                            borderTopWidth: 10,
                                            borderRightWidth: 12,
                                            borderBottomWidth: 10,
                                            borderLeftWidth: 12,
                                            borderTopColor: '#4AA0FF',
                                            borderRightColor: 'transparent',
                                            borderBottomColor: 'transparent',
                                            borderLeftColor: 'transparent',
                                        }]} /> : <View style={[{ width: 12, height: 24 }]}></View>
                                }

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                    teamStatisticsType: 'noSignIn'
                                }));
                            }}
                        >
                            <View
                                style={[{
                                    alignItems: 'center'
                                }]}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 50) / 2, height: 72
                                        , borderRadius: 4
                                        , backgroundColor: teamStatisticsType == 'noSignIn' ? '#4AA0FF' : '#F1F2F4'
                                        , paddingLeft: 15
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 12, marginTop: 15
                                            , color: teamStatisticsType == 'noSignIn' ? '#D7EAFE' : '#999999'
                                        }]}>
                                        {'未签到'}
                                    </Text>
                                    <Text
                                        style={[{
                                            fontSize: 19, marginTop: 6
                                            , color: teamStatisticsType == 'noSignIn' ? '#ffffff' : '#333333'
                                        }]}>
                                        {SentencedToEmpty(teamResult, ['data', 'Datas', 'notSignCount'], 0)}
                                        <Text
                                            style={[{
                                                fontSize: 12, marginLeft: 7
                                                , color: teamStatisticsType == 'noSignIn' ? '#D7EAFE' : '#999999'
                                            }]}
                                        >{'人'}</Text>
                                    </Text>
                                </View>
                                {
                                    teamStatisticsType == 'noSignIn' ?
                                        <View style={[{
                                            width: 0,
                                            height: 0,
                                            backgroundColor: 'transparent',
                                            borderStyle: 'solid',
                                            borderTopWidth: 10,
                                            borderRightWidth: 12,
                                            borderBottomWidth: 10,
                                            borderLeftWidth: 12,
                                            borderTopColor: '#4AA0FF',
                                            borderRightColor: 'transparent',
                                            borderBottomColor: 'transparent',
                                            borderLeftColor: 'transparent',
                                        }]} /> : <View style={[{ width: 12, height: 24 }]}></View>
                                }

                            </View>
                        </TouchableOpacity>

                    </View>
                    {
                        teamStatisticsType == 'signIn'
                            ? <ScrollView
                                style={[{
                                    width: SCREEN_WIDTH, flex: 1
                                }]}
                            >
                                {
                                    SentencedToEmpty(teamResult, ['data', 'Datas', 'signList'], [])
                                        .map((item, index) => {
                                            if (getTagType(item.workType).tagTypeStr == '非现场') {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                                            currentUserID: item.userID,
                                                            personalBeginTime: teamBeginTime,
                                                            personalEndTime: teamEndTime,
                                                        }));
                                                        dispatch(createAction('SignInTeamStatisticsModel/getPersonSignList')({}));
                                                        dispatch(NavigationActions.navigate({
                                                            routeName: 'SignInstatisticsWithPersonal',
                                                            params: {
                                                                title: item.userName
                                                            },
                                                        }));
                                                    }}
                                                >
                                                    <View
                                                        style={[{
                                                            width: SCREEN_WIDTH - 40, marginLeft: 20
                                                            , height: 190, borderWidth: 1, borderColor: '#EAEAEA'
                                                            , borderRadius: 5, marginBottom: 10
                                                            , justifyContent: 'space-around'
                                                            , paddingVertical: 10
                                                        }]}
                                                    >
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH - 70, flexDirection: 'row'
                                                                , justifyContent: 'space-between', alignItems: 'center'
                                                                , marginLeft: 15
                                                            }]}
                                                        >
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#333333'
                                                                }]}
                                                            >{SentencedToEmpty(item, ['userName'], '--')}</Text>
                                                            <View
                                                                style={[{
                                                                    flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <Text
                                                                    style={[{
                                                                        fontSize: 14, color: '#999999'
                                                                    }]}
                                                                >{'签到 '}
                                                                    <Text
                                                                        style={[{
                                                                            fontSize: 14, color: '#333333'
                                                                        }]}
                                                                    >{SentencedToEmpty(item, ['count'], '--')}</Text>
                                                                </Text>
                                                                <Image
                                                                    source={require('../../../images/ic_arrows_right.png')}
                                                                    style={[{
                                                                        width: 14, height: 14, marginLeft: 15
                                                                    }]}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH - 70, flexDirection: 'row'
                                                                , alignItems: 'center', marginLeft: 15
                                                            }]}
                                                        >
                                                            {getTag(item.workType)}
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#000028'
                                                                    , marginLeft: 5
                                                                }]}
                                                            >{SentencedToEmptyTimeString(item, ['signTime'], '----/--/--', 'YYYY-MM-DD HH:mm')}</Text>
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#000028'
                                                                    , marginLeft: 5
                                                                }]}
                                                            >{'签到'}</Text>
                                                        </View>
                                                        {/* <Text
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'北京雪迪龙科技股份有限公司'}</Text> */}
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#666666'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'地址'}</Text>
                                                        <Text
                                                            numberOfLines={2}
                                                            ellipsizeMode={'middle'}
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{SentencedToEmpty(item, ['address'], '----')}</Text>

                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#666666'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'工作类型'}</Text>
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{SentencedToEmpty(item, ['workTypeName'], '----')}</Text>
                                                    </View>
                                                </TouchableOpacity>;
                                            } else {
                                                return <TouchableOpacity
                                                    onPress={() => {
                                                        dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                                            currentUserID: item.userID,
                                                            personalBeginTime: teamBeginTime,
                                                            personalEndTime: teamEndTime,
                                                        }));
                                                        dispatch(createAction('SignInTeamStatisticsModel/getPersonSignList')({}));
                                                        dispatch(NavigationActions.navigate({
                                                            routeName: 'SignInstatisticsWithPersonal',
                                                            params: {
                                                                title: item.userName
                                                            },
                                                        }));
                                                    }}
                                                >
                                                    <View
                                                        style={[{
                                                            width: SCREEN_WIDTH - 40, marginLeft: 20
                                                            , height: 130, borderWidth: 1, borderColor: '#EAEAEA'
                                                            , borderRadius: 5, marginBottom: 10
                                                            , justifyContent: 'space-around'
                                                            , paddingVertical: 10
                                                        }]}
                                                    >
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH - 70, flexDirection: 'row'
                                                                , justifyContent: 'space-between', alignItems: 'center'
                                                                , marginLeft: 15
                                                            }]}
                                                        >
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#333333'
                                                                }]}
                                                            >{SentencedToEmpty(item, ['userName'], '--')}</Text>
                                                            <View
                                                                style={[{
                                                                    flexDirection: 'row', alignItems: 'center'
                                                                }]}
                                                            >
                                                                <Text
                                                                    style={[{
                                                                        fontSize: 14, color: '#999999'
                                                                    }]}
                                                                >{'签到 '}
                                                                    <Text
                                                                        style={[{
                                                                            fontSize: 14, color: '#333333'
                                                                        }]}
                                                                    >{item.count}</Text>
                                                                </Text>
                                                                <Image
                                                                    source={require('../../../images/ic_arrows_right.png')}
                                                                    style={[{
                                                                        width: 14, height: 14, marginLeft: 15
                                                                    }]}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View
                                                            style={[{
                                                                width: SCREEN_WIDTH - 70, flexDirection: 'row'
                                                                , alignItems: 'center', marginLeft: 15
                                                            }]}
                                                        >
                                                            {getTag(item.workType)}
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#000028'
                                                                    , marginLeft: 5
                                                                }]}
                                                            >{SentencedToEmptyTimeString(item, ['signTime'], '----/--/--', 'YYYY-MM-DD HH:mm')}</Text>
                                                            <Text
                                                                style={[{
                                                                    fontSize: 14, color: '#000028'
                                                                    , marginLeft: 5
                                                                }]}
                                                            >{'签到'}</Text>
                                                        </View>
                                                        <Text
                                                            style={[{
                                                                fontSize: 13, color: '#666666'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{'企业'}</Text>
                                                        <Text
                                                            numberOfLines={2}
                                                            ellipsizeMode={'middle'}
                                                            style={[{
                                                                fontSize: 13, color: '#333333'
                                                                , marginLeft: 15
                                                            }]}
                                                        >{SentencedToEmpty(item, ['entName'], '----')}</Text>
                                                    </View >
                                                </TouchableOpacity>;
                                            }
                                        })
                                }
                            </ScrollView > : null
                    }
                    {
                        teamStatisticsType == 'noSignIn'
                            ? <ScrollView
                                style={[{
                                    width: SCREEN_WIDTH, flex: 1
                                }]}
                            >
                                <View
                                    style={[{
                                        flexDirection: 'row', flexWrap: 'wrap'
                                        , width: SCREEN_WIDTH - 27
                                        , marginLeft: 20
                                    }]}
                                >
                                    {
                                        SentencedToEmpty(teamResult, ['data', 'Datas', 'notSignList'], [])
                                            .map((item, index) => {
                                                return <View
                                                    style={[{
                                                        width: (SCREEN_WIDTH - 80) / 4,
                                                        height: 30, justifyContent: 'center'
                                                        , alignItems: 'center', backgroundColor: '#4AA0FF'
                                                        , borderRadius: 4, marginRight: 13
                                                        , marginBottom: 9
                                                    }]}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[{
                                                            fontSize: 14, color: '#FFFFFF'
                                                            , maxWidth: (SCREEN_WIDTH - 80) / 4 - 10
                                                        }]}
                                                    >{item}</Text>
                                                </View>
                                            })
                                    }
                                </View>
                            </ScrollView> : null
                    }
                </View>
            </StatusPage>
        </View >
    )
}

{/* <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                        statisticsType: 'team'
                                    }))
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
                                            , color: statisticsType == 'team' ? '#4AA0FF' : '#666666'
                                        }]}>{'团队统计'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: statisticsType == 'team' ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                            <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                onPress={() => {
                                    dispatch(createAction('SignInTeamStatisticsModel/updateState')({
                                        statisticsType: 'personal'
                                    }))
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
                                            , color: statisticsType == 'personal' ? '#4AA0FF' : '#666666'
                                        }]}>{'个人统计'}</Text>
                                    </View>
                                    <View style={[{
                                        width: 40, height: 2
                                        , backgroundColor: statisticsType == 'personal' ? '#4AA0FF' : 'white'
                                    }]}>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View> */}