/*
 * @Description: 报警响应记录
 * @LastEditors: hxf
 * @Date: 2024-10-16 11:08:33
 * @LastEditTime: 2024-11-01 14:50:11
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbench/AlarmResponseRecord.js
 */
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { FlatListWithHeaderAndFooter, SimplePickerRangeDay, StatusPage } from '../../../components';
import moment from 'moment';
import { connect } from 'react-redux';

@connect(({ alarm }) => ({
    responseRecordType: alarm.responseRecordType,
    exceptionResult: alarm.exceptionResult,
    exceptionData: alarm.exceptionData,
    missResult: alarm.missResult,
    missData: alarm.missData,
    overResult: alarm.overResult,
    overData: alarm.overData,

    missBeginTime: alarm.missBeginTime,
    missEndTime: alarm.missEndTime,
    missEntName: alarm.missEntName,

    overBeginTime: alarm.overBeginTime,
    overEndTime: alarm.overEndTime,
    overEntName: alarm.overEntName,

    exceptionBeginTime: alarm.exceptionBeginTime,
    exceptionEndTime: alarm.exceptionEndTime,
    exceptionEntName: alarm.exceptionEntName,

    exceptionDataLength: alarm.exceptionDataLength,
    overDataLength: alarm.overDataLength,
    missDataLength: alarm.missDataLength,
}))
export default class AlarmResponseRecord extends Component {
    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '报警响应记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            this.props.dispatch(createAction('alarm/updateState')({
                missPageIndex: 1,
                missResult: { status: -1 },
                missData: [],
                missBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                missEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                missEntName: '',
            }));
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            this.props.dispatch(createAction('alarm/updateState')({
                exceptionPageIndex: 1,
                exceptionResult: { status: -1 },
                exceptionData: [],
                exceptionBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                exceptionEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                exceptionEntName: '',
            }));
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            this.props.dispatch(createAction('alarm/updateState')({
                overPageIndex: 1,
                overResult: { status: -1 },
                overData: [],
                overBeginTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                overEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                overEntName: '',
            }));
        }
        this.props.dispatch(createAction('alarm/getExceptionInfoList')({}));
    }

    onRefresh = () => {
        /**
         * WorkbenchMiss
         * WorkbenchException
         * WorkbenchOver
         * 
         * missBeginTime: moment().subtract(14, 'days').format('YYYY-MM-DD HH:mm:ss'),
        missEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        missEntName: '',
        missPageIndex: 1,
        missResult: { status: -1 },
        missData: [],
        responseRecordType: '',

        overBeginTime: moment().subtract(14, 'days').format('YYYY-MM-DD HH:mm:ss'),
        overEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        overEntName: '',
        overPageIndex: 1,
        overResult: { status: -1 },
        overData: [],

        exceptionBeginTime: moment().subtract(14, 'days').format('YYYY-MM-DD HH:mm:ss'),
        exceptionEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        exceptionEntName: '',
        exceptionPageIndex: 1,
        exceptionResult: { status: -1 },
        exceptionData: [],
         */
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            this.props.dispatch(createAction('alarm/updateState')({
                missPageIndex: 1,
                // missResult: { status: -1 },
                missData: [],
            }));
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            this.props.dispatch(createAction('alarm/updateState')({
                exceptionPageIndex: 1,
                // exceptionResult: { status: -1 },
                exceptionData: [],
            }));
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            this.props.dispatch(createAction('alarm/updateState')({
                overPageIndex: 1,
                // overResult: { status: -1 },
                overData: [],
            }));
        }
        this.props.dispatch(createAction('alarm/getExceptionInfoList')({ setListData: this.list.setListData, }));
    }

    statusPageOnRefresh = () => {

        if (this.props.responseRecordType == 'WorkbenchMiss') {
            this.props.dispatch(createAction('alarm/updateState')({
                missPageIndex: 1,
                missResult: { status: -1 },
                missData: [],
            }));
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            this.props.dispatch(createAction('alarm/updateState')({
                exceptionPageIndex: 1,
                exceptionResult: { status: -1 },
                exceptionData: [],
            }));
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            this.props.dispatch(createAction('alarm/updateState')({
                overPageIndex: 1,
                overResult: { status: -1 },
                overData: [],
            }));
        }
        this.props.dispatch(createAction('alarm/getExceptionInfoList')({ setListData: this.list.setListData, }));
    }

    getStartTime = () => {
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            return this.props.missBeginTime;
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            return this.props.exceptionBeginTime;
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            return this.props.overBeginTime;
        }
    }

    getEndTime = () => {
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            return this.props.missEndTime;
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            return this.props.exceptionEndTime;
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            return this.props.overEndTime;
        }
    }

    getRangeDaySelectOption = () => {
        return {
            // defaultTime: this.state.selectTime[0],
            // start: this.state.selectTime[0],
            // end: this.state.selectTime[1],
            defaultTime: this.getStartTime(),
            start: this.getStartTime(),
            end: this.getEndTime(),
            formatStr: 'YYYY-MM-DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                if (this.props.responseRecordType == 'WorkbenchMiss') {
                    this.props.dispatch(createAction('alarm/updateState')({
                        missBeginTime: startMoment.format('YYYY-MM-DD HH:mm:ss'),
                        missEndTime: endMoment.format('YYYY-MM-DD HH:mm:ss'),
                    }));
                } else if (this.props.responseRecordType == 'WorkbenchException') {
                    this.props.dispatch(createAction('alarm/updateState')({
                        exceptionBeginTime: startMoment.format('YYYY-MM-DD HH:mm:ss'),
                        exceptionEndTime: endMoment.format('YYYY-MM-DD HH:mm:ss'),
                    }));
                } else if (this.props.responseRecordType == 'WorkbenchOver') {
                    this.props.dispatch(createAction('alarm/updateState')({
                        overBeginTime: startMoment.format('YYYY-MM-DD HH:mm:ss'),
                        overEndTime: endMoment.format('YYYY-MM-DD HH:mm:ss'),
                    }));
                }
                this.statusPageOnRefresh();
            }
        };
    };

    _renderItem = ({ item, index }) => {
        return (<View
            style={[{
                width: SCREEN_WIDTH, height: 148
                , backgroundColor: '#fff'
                , paddingHorizontal: 15
                , justifyContent: 'space-around'
            }]}
        >
            <Text
                style={[{
                    fontSize: 14, color: '#333',
                    marginTop: 4
                }]}
            >{`${SentencedToEmpty(item, ['pointName'], '-----')}`}</Text>
            <Text
                style={[{
                    fontSize: 14, color: '#333',
                }]}
            >{`${SentencedToEmpty(item, ['entName'], '-----')}`}</Text>
            <Text
                style={[{
                    fontSize: 14, color: '#333',
                }]}
            >{`响应人：${SentencedToEmpty(item, ['operationUserName'], '---')}`}</Text>
            <Text
                style={[{
                    fontSize: 14, color: '#333',
                }]}
            >{`响应时间：${SentencedToEmpty(item, ['responseTime'], 'YYYY-MM-DD HH:mm:ss')}`}</Text>
            <View style={[{ height: 32, flexDirection: 'row' }]}>
                <TouchableOpacity
                    onPress={() => {
                        // this.props.dispatch(
                        //     createAction('alarm/getExResponseInfoList')({
                        //         params: {
                        //             taskID: item.taskID,
                        //             DGIMN: item.DGIMN,
                        //         }
                        //     })
                        // );
                        this.props.dispatch(
                            createAction('pointDetails/updateState')({
                                alarmRecordsIndex: 1,
                                alarmRecordsTotal: 0,
                                alarmRecordsListData: [],
                                alarmRecordsListTargetDGIMN: item.DGIMN,
                                // alarmRecordsListTargetDGIMN: item.DGIMNs,
                                alarmRecordsBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                                alarmRecordsEndTime: moment().format('YYYY-MM-DD 23:59:59')
                            })
                        );

                        let functionType = 'AlarmVerify';

                        if (this.props.responseRecordType == 'WorkbenchException') {
                            functionType = 'AlarmResponse';
                        } else if (this.props.responseRecordType == 'WorkbenchOver') {
                            functionType = 'OverVerify';
                        } else if (this.props.responseRecordType == 'WorkbenchMiss') {
                            // functionType = 'AlarmResponse';
                            functionType = 'WorkbenchMiss'; // 需要区分开报警响应 和 缺失报警
                        }
                        //alarmResponseAlarmDetailResult
                        // this.props.dispatch(
                        //     createAction('alarm/updateState')({
                        //         alarmResponseAlarmDetailResult: { status: -1 }
                        //     })
                        // );
                        if (this.props.responseRecordType == 'WorkbenchException'
                            || this.props.responseRecordType == 'WorkbenchMiss'
                        ) {
                            this.props.dispatch(createAction('alarm/updateState')({
                                alarmResponseAlarmDetailResult: { status: -1 },
                                taskID: item.taskID,
                                DGIMN: item.DGIMN,
                            }));
                            this.props.dispatch(
                                createAction('alarm/getExResponseInfoList')({
                                    params: {
                                        taskID: item.taskID,
                                        DGIMN: item.DGIMN,
                                    }
                                })
                            );
                        } else if (this.props.responseRecordType == 'WorkbenchOver') {
                            this.props.dispatch(createAction('alarm/updateState')({
                                alarmResponseAlarmDetailResult: { status: -1 },
                                VID: item.ID,
                                DGIMN: item.DGIMN,
                            }));
                            this.props.dispatch(
                                createAction('alarm/getOverResponseInfoList')({
                                    params: {
                                        VID: item.ID,
                                        DGIMN: item.DGIMN,
                                    }
                                })
                            );
                        }
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'AlarmResponseAlarmDetail',
                                params: {
                                    // OperationEntCode: item.OperationEntCode,
                                    pageType: 'AlarmDetail',
                                    functionType //AlarmDetail查看报警详情，AlarmResponse报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)
                                }
                            })
                        );
                    }}
                >
                    <View
                        style={[{
                            justifyContent: 'center', height: 36
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#4AA0FF'
                                , marginRight: 15
                            }]}>{
                                '报警详情'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // getExResponseInfoList
                        // this.props.dispatch(
                        //     createAction('alarm/getExResponseInfoList')({
                        //         params: {
                        //             taskID: item.taskID,
                        //             DGIMN: item.DGIMN,
                        //         }
                        //     })
                        // );
                        console.log('item = ', item);
                        if (this.props.responseRecordType == 'WorkbenchOver') {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'AlarmHandleDetail',
                                    params: {
                                        recordData: item,
                                        // OperationEntCode: item.OperationEntCode,
                                        // pageType: 'AlarmDetail',
                                        // functionType //AlarmDetail查看报警详情，AlarmResponse报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)
                                    }
                                })
                            );
                        } else if (this.props.responseRecordType == 'WorkbenchException'
                            || this.props.responseRecordType == 'WorkbenchMiss') {
                            this.props.dispatch(createAction('taskModel/updateState')({ TaskID: item.taskID, DGIMN: item.DGIMN }));
                            this.props.dispatch(createAction('taskDetailModel/updateState')({ status: -1 }));
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'TaskDetail',
                                    params: { taskID: item.taskID, from: 'AlarmResponseRecord' }
                                })
                            );
                        }
                    }}
                >
                    <View
                        style={[{
                            justifyContent: 'center', height: 36
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#4AA0FF'
                                , marginLeft: 5
                                , marginRight: 15
                            }]}>{
                                '处理详情'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >);
    }

    getData = () => {
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            return SentencedToEmpty(this.props, ['missData'], []);
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            return SentencedToEmpty(this.props, ['exceptionData'], []);
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            return SentencedToEmpty(this.props, ['overData'], []);
        }
    }

    getStatus = () => {
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            return SentencedToEmpty(this.props, ['missResult', 'status'], 1000);
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            return SentencedToEmpty(this.props, ['exceptionResult', 'status'], 1000);
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            return SentencedToEmpty(this.props, ['overResult', 'status'], 1000);
        }
    }

    getSearchStr = () => {
        // missEntName
        // exceptionEntName
        // overEntName
        if (this.props.responseRecordType == 'WorkbenchMiss') {
            return SentencedToEmpty(this.props, ['missEntName'], '');
        } else if (this.props.responseRecordType == 'WorkbenchException') {
            return SentencedToEmpty(this.props, ['exceptionEntName'], '');
        } else if (this.props.responseRecordType == 'WorkbenchOver') {
            return SentencedToEmpty(this.props, ['overEntName'], '');
        }
    }

    render() {
        console.log('responseRecordType = ', this.props.responseRecordType);
        console.log('getStatus = ', this.getStatus());
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    width: SCREEN_WIDTH, backgroundColor: '#fff'
                    , flexDirection: 'row', marginBottom: 10
                    , alignItems: 'center', justifyContent: 'center'
                }]}>
                    <SimplePickerRangeDay
                        separator={'~'}
                        style={[{ width: 200, marginLeft: 15 }]}
                        option={this.getRangeDaySelectOption()} />

                </View>
                <View style={[{
                    width: SCREEN_WIDTH, backgroundColor: '#fff'
                    , height: 44, flexDirection: 'row', alignItems: 'center'
                    , marginBottom: 1
                }]}>
                    <View
                        style={[{
                            height: 30, flex: 1
                            , borderRadius: 15, backgroundColor: '#F2F2F2'
                            , flexDirection: 'row', alignItems: 'center'
                        }]}
                    >
                        <Image
                            style={[{
                                height: 13, width: 13
                                , tintColor: '#999999'
                                , marginLeft: 15
                            }]}
                            source={require('../../../images/ic_search_help_center.png')}
                        />
                        <TextInput
                            style={[{
                                color: '#333333',
                                flex: 1
                                , paddingVertical: 0
                                , marginHorizontal: 5
                            }]}
                            placeholder={SentencedToEmpty(this.props
                                , ['route', 'params', 'params', 'searchPlaceHolder']
                                , '搜索企业名称、点位名称')}
                            onChangeText={(text) => {
                                if (this.props.responseRecordType == 'WorkbenchMiss') {
                                    this.props.dispatch(createAction('alarm/updateState')({
                                        missEntName: text
                                    }));
                                } else if (this.props.responseRecordType == 'WorkbenchException') {
                                    this.props.dispatch(createAction('alarm/updateState')({
                                        exceptionEntName: text
                                    }));
                                } else if (this.props.responseRecordType == 'WorkbenchOver') {
                                    this.props.dispatch(createAction('alarm/updateState')({
                                        overEntName: text
                                    }));
                                }

                            }}
                        >{this.getSearchStr()}</TextInput>
                        <TouchableOpacity
                            onPress={() => {
                                // 搜索
                                this.statusPageOnRefresh();
                            }}
                        >
                            <View
                                style={[{
                                    width: 49, height: 24
                                    , borderRadius: 12, backgroundColor: '#058BFA'
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{ fontSize: 14, color: '#fefefe' }]}>{'搜索'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            // 搜索
                            // 取消
                            if (this.props.responseRecordType == 'WorkbenchMiss') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    missEntName: ''
                                }));
                            } else if (this.props.responseRecordType == 'WorkbenchException') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    exceptionEntName: ''
                                }));
                            } else if (this.props.responseRecordType == 'WorkbenchOver') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    overEntName: ''
                                }));
                            }
                            this.statusPageOnRefresh();
                        }}
                    >
                        <View
                            style={[{
                                height: 42
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{ fontSize: 14, color: '#666', marginHorizontal: 5 }]}>{'取消'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <StatusPage
                    status={this.getStatus()}
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
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        ListEmptyComponent={() => {
                            return (<View
                                style={[{
                                    width: SCREEN_WIDTH
                                    , flex: 1
                                }]}
                            >

                            </View>);
                        }}
                        ref={ref => (this.list = ref)}
                        // pageSize={this.props.pageSize}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 5, backgroundColor: '#f2f2f2' }]} />}
                        hasMore={() => {
                            // exceptionDataLength: alarm.exceptionDataLength,
                            // overDataLength: alarm.overDataLength,
                            // missDataLength: alarm.missDataLength,
                            // return this.getData().length < this.props.missDataLength;
                            if (this.props.responseRecordType == 'WorkbenchMiss') {
                                return this.getData().length < this.props.missDataLength;
                            } else if (this.props.responseRecordType == 'WorkbenchException') {
                                return this.getData().length < this.props.exceptionDataLength;
                            } else if (this.props.responseRecordType == 'WorkbenchOver') {
                                return this.getData().length < this.props.overDataLength;
                            }
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            // this.onRefresh(index);
                            if (this.props.responseRecordType == 'WorkbenchMiss') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    missPageIndex: index,
                                }));
                            } else if (this.props.responseRecordType == 'WorkbenchException') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    exceptionPageIndex: index,
                                }));
                            } else if (this.props.responseRecordType == 'WorkbenchOver') {
                                this.props.dispatch(createAction('alarm/updateState')({
                                    overPageIndex: index,
                                }));
                            }
                            this.props.dispatch(createAction('alarm/getExceptionInfoList')({ setListData: this.list.setListData, }));
                        }}
                        renderItem={this._renderItem}
                        data={this.getData()}
                    />
                </StatusPage>
            </View>
        )
    }
}