/*
 * @Description: 超标预警
 * @LastEditors: hxf
 * @Date: 2022-08-22 11:58:18
 * @LastEditTime: 2024-07-17 10:29:17
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/workbench/OverWarning.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { DeclareModule, FlatListWithHeaderAndFooter, SDLText, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import TextLabel from '../../../pollutionContainers/components/TextLabel';
import { getImageByType } from '../../../pollutionModels/utils';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

@connect(({ alarm, app }) => ({
    monitorAlarmIndex: alarm.monitorAlarmIndex,
    monitorAlarmTotal: alarm.monitorAlarmTotal,
    monitorAlarmResult: alarm.monitorAlarmResult,
    monitorAlarmData: alarm.monitorAlarmData,
}))
export default class OverWarning extends Component {

    static navigationOptions = createNavigationOptions({
        title: '超标预警',
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 220,
                    messText: `1、监测点分钟数据出现超标后，系统发出超标预警，并推送预警消息给点位运维负责人。
2、该页面只显示今日、昨日出现分钟数据超标的企业监测点。`,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }}
            />
        )
    });

    componentDidMount() {
        this.statusOnRefresh();
    }
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
        return (<StatusPage
            backRef={true}
            status={SentencedToEmpty(this.props, ['monitorAlarmResult', 'status'], 200)}
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
                        <TouchableOpacity
                            onPress={() => {
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
                                    {item.AlarmTag.split(',').map((typeT, index) => {
                                        if (typeT != '') {
                                            return <TextLabel key={index} style={{ marginLeft: 3 }} color={'#75A5FB'} text={typeT} />;
                                        }
                                    })}
                                </View>
                                <SDLText fontType={'small'} style={{ color: '#666', marginTop: 5 }}>
                                    {item.PointName}
                                </SDLText>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                data={this.props.monitorAlarmData}
            />
        </StatusPage>
        )
    }
}
