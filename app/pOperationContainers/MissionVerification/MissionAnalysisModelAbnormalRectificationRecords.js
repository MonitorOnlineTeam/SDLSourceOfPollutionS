/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-10-26 14:49:11
 * @LastEditTime: 2024-11-04 10:06:14
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/MissionVerification/MissionAnalysisModelAbnormalRectificationRecords.js
 */
import { Text, View, Platform, TouchableOpacity, Image } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import { FlatListWithHeaderAndFooter, SDLText, SimplePickerRangeDay, StatusPage } from '../../components';
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../config/globalsize';
import moment from 'moment';
import { getStatusObject } from './MissionVerificationRectificationList';

@connect(({ abnormalTask }) => ({
    btime: abnormalTask.btime,// 整改记录参数 列表开始时间
    etime: abnormalTask.etime,
    checkedRectificationCompleteListData: abnormalTask.checkedRectificationCompleteListData,
    checkedRectificationCompleteListResult: abnormalTask.checkedRectificationCompleteListResult
}))
export default class MissionAnalysisModelAbnormalRectificationRecords extends Component {
    componentDidMount() {
        this.props.navigation.setOptions({
            title: '整改记录',
        });

        this.props.dispatch(createAction('abnormalTask/updateState')({
            checkedRectificationCompleteListResult: { status: -1 },
            completeIndex: 1,
            "btime": moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),// 整改记录参数 列表开始时间
            "etime": moment().format('YYYY-MM-DD 23:59:59'),// 整改记录参数 列表结束时间
        }));
        this.simpleRefresh();
    }

    simpleRefresh = () => {
        this.props.dispatch(createAction('abnormalTask/getCheckedRectificationCompleteList')({
            params: {}
        }));
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('abnormalTask/updateState')({
            checkedRectificationCompleteListResult: { status: -1 },
            completeIndex: 1
        }));
        this.simpleRefresh();
    }
    onRefresh = () => {
        this.props.dispatch(createAction('abnormalTask/updateState')({
            completeIndex: 1
        }));
        this.props.dispatch(createAction('abnormalTask/getCheckedRectificationCompleteList')({
            params: {},
            setListData: this.list.setListData,
        }));
    }

    _renderItem = ({ item, index }) => {
        return (<TouchableOpacity
            onPress={() => {
                // this.props.dispatch(NavigationActions.navigate({
                //     routeName: 'AbnormalRectification',
                //     params: {
                //         // ID: map.extras.alarm_id,
                //         // alarmTime: map.extras.alarm_time
                //     }
                // }));
                this.props.dispatch(createAction('abnormalTask/updateState')({
                    recheckItemId: SentencedToEmpty(item, ['ID'], '')
                }));
                this.props.dispatch(NavigationActions.navigate({
                    // routeName: 'RectificationReviewDetails', 
                    routeName: 'MissionRectificationReviewDetails',
                    params: {
                    }
                }));
            }}
        >
            <View
                style={[{ width: SCREEN_WIDTH, height: 136, backgroundColor: 'white' }]}
            >
                <View style={{ marginTop: 15, marginLeft: 30, width: SCREEN_WIDTH - 60, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#5CA9FF', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#FFFFFF' }}>企</Text>
                    </View>
                    <Text numberOfLines={1} style={{ flex: 1, marginLeft: 5, fontSize: 14, color: '#333333' }}>{`${SentencedToEmpty(item, ['EntName'], '--')}-${SentencedToEmpty(item, ['PointName'], '--')}`}</Text>
                    {/* <Text style={{ marginLeft: 4, fontSize: 12, color: '#4AA0FF' }}>{`(${SentencedToEmpty(item, ['Count'], '0')})`}</Text> */}
                    <View style={[{
                        minWidth: 50, height: 20
                        , justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: getStatusObject(SentencedToEmpty(item, ['RectificationStatus'], 1)).bgColor
                    }]}>
                        <Text style={[{
                            marginHorizontal: 4,
                            fontSize: 13, color: getStatusObject(SentencedToEmpty(item, ['RectificationStatus'], 1)).textColor
                        }]}>
                            {`${SentencedToEmpty(item, ['RectificationStatusName'], '---')}`}
                        </Text>
                    </View>
                </View>
                <Text style={[{ color: '#333333', marginTop: 6, width: SCREEN_WIDTH - 60, height: 63, marginLeft: 30 }]}
                    numberOfLines={3}
                >
                    {`${SentencedToEmpty(item, ['CheckedDes'], '-----')}`}
                </Text>
                <View style={[{
                    alignItems: 'center', flexDirection: 'row', width: SCREEN_WIDTH - 60
                    , marginLeft: 30, height: 20
                }]}>
                    <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }]} >
                        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#5CA9FF', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#FFFFFF' }}>整</Text>
                        </View>
                        <SDLText numberOfLines={1} fontType={'normal'} style={[{ color: '#666666', flex: 1 }]}>
                            {`${SentencedToEmpty(item, ['RectificationUserName'], '----')}`}
                        </SDLText>
                    </View>
                    <View style={[{ width: 4 }]} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 16, height: 16, marginRight: 3 }} source={require('../../images/ic_tab_statistics_selected.png')} />
                        {/* RectificationStatus 1.CreateTime 2 CompleteTime 3 CreateTime */}
                        <SDLText fontType={'normal'} style={[{ color: '#666666' }]}>
                            {`${SentencedToEmpty(item, ['CompleteTime'], '----')}`}
                        </SDLText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>);
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = this.props.btime;
        endTime = this.props.etime;
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.props.dispatch(createAction('abnormalTask/updateState')({
                    checkedRectificationCompleteListResult: { status: -1 },
                    completeIndex: 1,
                    "btime": startMoment.format('YYYY-MM-DD 00:00:00'),// 整改记录参数 列表开始时间
                    "etime": endMoment.format('YYYY-MM-DD 23:59:59'),// 整改记录参数 列表结束时间
                }));

                this.simpleRefresh();
            }
        };
    };

    render() {
        return (
            <StatusPage
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
                status={SentencedToEmpty(this.props, ['checkedRectificationCompleteListResult', 'status'], 1000)}
                errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.statusPageOnRefresh();
                }}>
                <View style={{ flexDirection: 'row', marginBottom: 10, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <SimplePickerRangeDay style={[{ backgroundColor: '#fff', width: SCREEN_WIDTH, justifyContent: 'center' }]} ref={ref => (this.simplePickerRangeDay = ref)} option={this.getRangeDaySelectOption()} />
                </View>
                <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                    <FlatListWithHeaderAndFooter
                        ref={ref => (this.list = ref)}
                        // pageSize={this.props.pageSize}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2' }]} />}
                        hasMore={() => {
                            return false;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.props.dispatch(createAction('abnormalTask/updateState')({
                                completeIndex: index
                            }));
                            this.props.dispatch(createAction('abnormalTask/getCheckedRectificationCompleteList')({
                                params: {},
                                setListData: this.list.setListData,
                            }));
                        }}
                        renderItem={this._renderItem}
                        data={SentencedToEmpty(this.props, ['checkedRectificationCompleteListData'], [])}
                    />
                </View>
            </StatusPage>
        )
    }
    // render() {
    //     return (<View><Text>123</Text></View>);
    // }
}