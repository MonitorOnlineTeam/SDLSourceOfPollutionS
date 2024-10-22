/*
 * @Description: 领取记录
 * @LastEditors: hxf
 * @Date: 2021-10-09 11:30:19
 * @LastEditTime: 2024-10-12 15:57:38
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/ClaimTaskList.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, Image, TouchableOpacity } from 'react-native'
import moment from 'moment';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { PickerRangeDayTouchable, StatusPage, FlatListWithHeaderAndFooter } from '../../../components'
const calendarRight = require('../../../images/calendarRight.png');
const calenderLeft = require('../../../images/calenderLeft.png');

@connect(({ claimTaskModels }) => ({
    receivingRecordListResult: claimTaskModels.receivingRecordListResult,
}))
export default class ClaimTaskList extends Component {

    static navigationOptions = createNavigationOptions({
        title: '领取记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            showTime: `${moment()
                .subtract(7, 'days')
                .format('YYYY.MM.DD')}-${moment().format('MM.DD')}`,
            beginTime: moment()
                .subtract(7, 'days')
                .format('YYYY-MM-DD 00:00:00'),
            endTime: moment()
                .format('YYYY-MM-DD 23:59:59'),

            selectPointStr: '选择站点',
            selectPointList: [], //逗号分隔
            DGIMNs: '', //逗号分隔

            selectPollutantStr: '报警因子',
            selectPollutantCodeList: [],
            PollutantCode: '', //逗号分隔

            pageIndex: 1,
            pageSize: 100
        };
    }

    componentDidMount() {
        this.props.dispatch(createAction('claimTaskModels/updateState')({ receivingRecordListResult: { status: -1 } }));
        this.props.dispatch(createAction('claimTaskModels/getReceivingRecordList')({
            params: {
                BeginTime: this.state.beginTime,
                EndTime: this.state.endTime
            }
        }));
    }

    /**
     * 时间选择框的option
     * @memberof Alarm
     */
    getTimeSelectOption = () => {
        return {
            defaultTime: this.state.startTime,
            start: this.state.startTime,
            end: this.state.endTime,
            onSureClickListener: (start, end) => {
                // 最大不能超过30天
                if (moment(start).add(30, 'days').isAfter(end)) {
                    const beginTime = moment(start).format('YYYY-MM-DD 00:00:00');
                    const endTime = moment(end).format('YYYY-MM-DD 23:59:59');
                    this.setState({
                        beginTime,
                        endTime,
                        showTime: `${moment(start).format('YYYY.MM.DD')}-${moment(end).format('MM.DD')}`
                    });

                    this.props.dispatch(createAction('claimTaskModels/getReceivingRecordList')({
                        params: {
                            BeginTime: beginTime,
                            EndTime: endTime
                        }
                    }));
                }

            }
        };
    };

    getData = (success = () => { }, failure = () => { }) => {
        this.props.dispatch(createAction('claimTaskModels/updateState')({ receivingRecordListResult: { status: -1 } }));
        this.props.dispatch(createAction('claimTaskModels/getReceivingRecordList')({
            params: {
                BeginTime: this.state.beginTime,
                EndTime: this.state.endTime
            },
            success, failure
        }));
    }

    _renderItemList = ({ item }) => {
        // hxf 表示不需要分割
        const separator = SentencedToEmpty(item, ['recordType'], 'hxf');
        const messageList = item.message.split(separator);
        let dataArray = [];
        messageList.map((msgItem, index) => {
            if (index == messageList.length - 1) {
                dataArray.push(msgItem);
            } else {
                dataArray.push(msgItem);
                dataArray.push(separator);
            }
        });
        return <View style={[{ height: 151.5, width: SCREEN_WIDTH }]}>
            <View style={[{
                height: 48, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2'
                , justifyContent: 'center', alignItems: 'center'
            }]}>
                <View style={[{
                    height: 16, width: 162.5, borderRadius: 8
                    , justifyContent: 'center', alignItems: "center", backgroundColor: '#D7D7D7'
                }]}>
                    <Text style={[{ fontSize: 12, color: '#666666' }]}>{`${item.createTime}`}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <View style={[{
                    height: 103.5, width: SCREEN_WIDTH, backgroundColor: 'white'
                    , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 9
                }]}>
                    <Image style={[{ height: 27.5, width: 27.5, marginLeft: 9, marginRight: 12 }]} source={item == 1 ? require('../../../images/ic_claim.png')
                        : item == 2 ? require('../../../images/ic_give_up_claim.png')
                            : require('../../../images/ic_system_close.png')} />
                    <View style={[{ flex: 1 }]}>
                        <Text style={[{ fontSize: 15, color: '#333333', padding: 0 }]}>{`${item.typeName}`}</Text>
                        <Text numberOfLines={1} ellipsizeMode={'middle'} style={[{ fontSize: 12, color: '#666666', padding: 0, marginTop: 3 }]}>{`${item.parentName}-${item.pointName}`}</Text>
                        {/* <Text numberOfLines={2} ellipsizeMode={'tail'}style={[{fontSize:12,color:'#666666',padding:0,marginTop:3}]}>{`${item.userName}${item.message}`}</Text> */}
                        {(() => {
                            if (messageList.length > 1) {
                                return <Text numberOfLines={2} ellipsizeMode={'tail'} style={[{ fontSize: 12, color: '#666666', padding: 0, marginTop: 3, lineHeight: 16 }]}>{
                                    dataArray.map((msgItem, index) => {
                                        if (msgItem == separator) {
                                            return <Text style={[{ fontSize: 12, color: 'red', padding: 0, fontWeight: 'bold' }]}>{separator}</Text>
                                        } else if (index == 0) {
                                            return (item.userName + msgItem);
                                        } else {
                                            return (msgItem);
                                        }
                                    })
                                }</Text>
                            } else {
                                return <Text numberOfLines={2} ellipsizeMode={'tail'} style={[{ fontSize: 12, color: '#666666', padding: 0, marginTop: 3, lineHeight: 16 }]}>{item.userName + item.message}</Text>
                            }
                        })()}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        return (
            <View style={[{ flex: 1 }]} >
                <View
                    style={{
                        width: SCREEN_WIDTH,
                        height: 50,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        alignItems: 'center'
                    }}
                >
                    <PickerRangeDayTouchable option={this.getTimeSelectOption()} style={{ flex: 1, flexDirection: 'row', height: 45, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={calenderLeft} />
                        <Text style={{ fontSize: 14, color: '#666' }}>{this.state.showTime}</Text>
                        <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={calendarRight} />
                    </PickerRangeDayTouchable>
                </View>
                <StatusPage
                    status={this.props.receivingRecordListResult.status}
                    errorBtnText={'点击重试'}
                    emptyBtnText={'点击重试'}
                    onErrorPress={() => {
                        this.getData()
                    }}
                    onEmptyPress={() => {
                        this.getData()
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        style={[{ backgroundColor: '#f2f2f2' }]}
                        ref={ref => (this.list = ref)}
                        pageSize={20}
                        hasMore={() => {
                            return false;
                        }}
                        onRefresh={index => {
                            this.getData()
                        }}
                        onEndReached={index => {
                            // 不分页
                        }}
                        renderItem={item => {
                            return this._renderItemList(item);
                        }}
                        data={SentencedToEmpty(this.props.receivingRecordListResult
                            , ['data', 'Datas'], [])}
                    />
                </StatusPage>
            </View>
        )
    }
}
