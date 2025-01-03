import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, transformColorToTransparency } from '../../../utils';
import { getImageByType, getStatusByCode } from '../../../pollutionModels/utils';
import { StatusPage, SDLText, SimplePickerSingleTime, SimplePicker, SimpleMultipleItemPicker, SimplePickerRangeDay, FlatListWithHeaderAndFooter, Touchable } from '../../../components';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { from } from 'rxjs';
import TextLabel from '../../components/TextLabel';
import globalcolor from '../../../config/globalcolor';
/**
 * 报警
 * @class Audit
 * @extends {Component}
 */
@connect(({ alarm, app }) => ({
    isVerifyOrHandle: app.isVerifyOrHandle,
    monitorAlarmIndex: alarm.monitorAlarmIndex,
    monitorAlarmTotal: alarm.monitorAlarmTotal,
    monitorAlarmResult: alarm.monitorAlarmResult,
    monitorAlarmData: alarm.monitorAlarmData,
    sourceType: alarm.sourceType
}))
export default class OneTabAlarmList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1
        };
    }

    getTimeSelectOption = () => {
        let type = 'hour';
        return {
            defaultTime: '2019-05-22 00:00',
            formatStr: 'YYYY-MM-DD HH:mm',
            type: type,
            onSureClickListener: time => {
                // this.setState({
                //     selectTime: this.formatTime(time, 'DayData')
                //     // showTime:this.formatShowTime(time,'day'),
                // });
                console.log('TestView1 time = ', time);
            }
        };
    };
    initIsLeftoverProblem = () => {
        const dataArr = [{ code: '1', name: '是' }, { code: '0', name: '否' }, { code: '2', name: '2' }, { code: '3', name: '3' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            defaultCode: '1',
            dataArr,
            onSelectListener: item => {
                this.setState({
                    isLeftoverProblem: item
                });
            }
        };
    };
    getPointTypeOption = () => {
        const dataArr = [{ code: '1', name: '是12323123' }, { code: '0', name: '否3123123' }, { code: '2', name: '231231' }, { code: '3', name: '3313213' }, { code: '4', name: '4' }, { code: '5', name: '5' }, { code: '6', name: '6' }];
        // const dataArr = [{ code: '1', name: '是12323123' }, { code: '0', name: '否3123123' }, { code: '2', name: '231231' }, { code: '3', name: '3313213' }];
        return {
            contentWidth: 166,
            placeHolderStr: '站点类型',
            codeKey: 'code',
            nameKey: 'name',
            selectCode: ['1', '0'],
            dataArr: dataArr,
            callback: ({ selectCode, selectNameStr, selectCodeStr }) => {
                this.setState({
                    selectedItemsNameStr: selectNameStr || '站点类型',
                    pointTypeCodeStr: selectCodeStr,
                    selectPointTypeCode: selectCode
                });
            }
        };
    };
    componentDidMount() {
        // this.statusOnRefresh();
    }
    getTimeSelectOption1 = () => {
        let beginTime, endTime;
        beginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        endTime = moment().format('YYYY-MM-DD 23:59:59');
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
            }
        };
    };
    onRefresh = index => {
        this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: index, monitorAlarmTotal: 0 }));
        this.props.dispatch(
            createAction('alarm/getAlarmRecords')({
                params: {
                    BeginTime: moment()
                        // .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00'),
                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    AlarmType: '2',
                    PageIndex: 1,
                    PageSize: 20
                },
                setListData: this.list.setListData
            })
        );
    };
    statusOnRefresh = () => {
        this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: 1, monitorAlarmTotal: 0, monitorAlarmResult: { status: -1 } }));
        this.props.dispatch(
            createAction('alarm/getAlarmRecords')({
                params: {
                    BeginTime: moment()
                        // .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00'),
                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    AlarmType: '2',
                    PageIndex: 1,
                    PageSize: 20
                }
            })
        );
    };
    render() {
        console.log('monitorAlarmData = ', this.props.monitorAlarmData);
        return <StatusPage
            status={this.props.monitorAlarmResult.status}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                console.log('重新刷新');
                this.statusOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.statusOnRefresh();
                console.log('错误操作回调');
            }}
        >
            <FlatListWithHeaderAndFooter
                ref={ref => (this.list = ref)}
                pageSize={20}
                ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2' }]} />}
                hasMore={() => {
                    return this.props.monitorAlarmData.length < this.props.monitorAlarmTotal;
                }}
                onRefresh={index => {
                    this.onRefresh(index);
                }}
                onEndReached={index => {
                    this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: index }));
                    this.props.dispatch(
                        createAction('alarm/getAlarmRecords')({
                            params: {
                                BeginTime: moment()
                                    // .subtract(1, 'days')
                                    .format('YYYY-MM-DD 00:00:00'),
                                EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                AlarmType: '2',
                                PageIndex: index,
                                PageSize: 20
                            },
                            setListData: this.list.setListData
                        })
                    );
                }}
                renderItem={({ item, index }) => {

                    const iamgeCircleSize = 28;
                    const imageSize = 16;
                    return (
                        <Touchable
                            onPress={() => {
                                if (this.props.itemType == 'warning') {
                                    this.props.dispatch(
                                        createAction('pointDetails/updateState')({
                                            alarmRecordsIndex: 1,
                                            alarmRecordsTotal: 0,
                                            alarmRecordsListData: [],
                                            alarmRecordsListTargetDGIMN: item.DGIMN,
                                            alarmRecordsBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                                            alarmRecordsEndTime: moment().format('YYYY-MM-DD 23:59:59')
                                        })
                                    );
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'WarningDetail',
                                        params: {
                                            // initialRouteName: 'Alarm'
                                        }
                                    }));
                                } else {
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

                                    if (this.props.sourceType == 'WorkbenchException') {
                                        functionType = 'AlarmResponse';
                                    } else if (this.props.sourceType == 'WorkbenchOver') {
                                        functionType = 'OverVerify';
                                    } else if (this.props.sourceType == 'WorkbenchMiss') {
                                        // functionType = 'AlarmResponse';
                                        functionType = 'WorkbenchMiss'; // 需要区分开报警响应 和 缺失报警
                                    }
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'AlarmRecords',
                                            params: {
                                                OperationEntCode: item.OperationEntCode,
                                                pageType: 'AlarmDetail',
                                                functionType //AlarmDetail查看报警详情，AlarmResponse报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)
                                            }
                                        })
                                    );
                                }

                            }}
                            style={{ width: SCREEN_WIDTH, height: 65, marginTop: 0.5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}
                        >
                            <View
                                style={{
                                    marginLeft: 13,
                                    width: iamgeCircleSize,
                                    height: iamgeCircleSize,
                                    backgroundColor: globalcolor.headerBackgroundColor,
                                    borderRadius: iamgeCircleSize / 2,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image source={getImageByType(item.PollutantType).image} style={{ width: imageSize, height: imageSize, tintColor: '#fff' }} />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row', marginRight: 8 }}>
                                    <SDLText numberOfLines={1} style={{ color: '#333', maxWidth: 210 }}>
                                        {item.Abbreviation}
                                    </SDLText>
                                    {SentencedToEmpty(item, ['AlarmTag'], '').split(',').map((typeT, index) => {
                                        if (typeT != '') {
                                            return <TextLabel key={index} style={{ marginLeft: 3 }} color={'#75A5FB'} text={typeT} />;
                                        }
                                    })}
                                </View>
                                <SDLText fontType={'small'} style={{ color: '#666', marginTop: 5 }}>
                                    {item.PointName}
                                </SDLText>
                            </View>
                        </Touchable>
                    );
                }}
                data={this.props.monitorAlarmData}
            />
        </StatusPage>

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
