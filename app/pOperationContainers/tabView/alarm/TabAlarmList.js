/*
 * @Description: 企业用户主导航报警展示
 * @LastEditors: hxf
 * @Date: 2024-12-27 10:07:37
 * @LastEditTime: 2025-01-02 16:25:18
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/tabView/alarm/TabAlarmList.js
 */
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { useSelector } from 'react-redux';
import { dispatch } from '../../../..';
import { createAction } from '../../../utils';
import OneTabAlarmList from './OneTabAlarmList';
import AlarmList from './AlarmList';


export default function TabAlarmList() {

    const topButtonWidth = SCREEN_WIDTH / 3;
    const { alarmType,
        dataExceptionCount,
        dataOverHourCount,
        dataOverMinuteCount
    } = useSelector(state => state.tabAlarmListModel);
    const { sourceType, monitorAlarmResult } = useSelector(state => state.alarm);

    // useEffect(() => {
    //     console.log('TabAlarmList sourceType = ', sourceType);
    //     console.log('TabAlarmList monitorAlarmResult = ', monitorAlarmResult);
    // }, [sourceType, monitorAlarmResult])
    // useEffect(() => {
    //     dispatch(
    //         createAction('pointDetails/updateState')({
    //             sourceType: 'WorkbenchOver'
    //         })
    //     );
    //     dispatch(createAction('alarm/updateState')({
    //         monitorAlarmIndex: 1, monitorAlarmTotal: 0
    //         , monitorAlarmResult: { status: -1 }
    //         , sourceType: 'tabWorkbenchException'
    //     }));
    //     dispatch(
    //         createAction('alarm/getAlarmRecords')({
    //             params: {
    //                 AlarmType: '2',
    //                 PageIndex: 1,
    //                 PageSize: 20
    //             }
    //         })
    //     );
    // }, [])

    tabOnclick = (index) => {
        dispatch(createAction('tabAlarmListModel/getAlarmCountForEnt')({}));
        // 时间跨度要改
        if (index == 0) {
            dispatch(
                createAction('alarm/updateState')({
                    // sourceType: 'WorkbenchOver'
                    sourceType: 'tabWorkbenchOver'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            dispatch(
                createAction('pointDetails/updateState')({
                    // sourceType: 'WorkbenchOver'
                    sourceType: 'tabWorkbenchOver'
                })
            );
            dispatch(
                createAction('alarm/getAlarmRecords')({
                    params: {
                        AlarmType: '2',
                        PageIndex: 1,
                        PageSize: 20
                    }
                })
            );
        } else if (index == 1) {
            dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'tabOverWarning'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            dispatch(
                createAction('pointDetails/updateState')({
                    // sourceType: 'OverWarning'
                    sourceType: 'tabOverWarning'
                })
            );
            dispatch(
                createAction('alarm/getAlarmRecords')({
                    params: {
                        AlarmType: '2',
                        PageIndex: 1,
                        PageSize: 20
                    }
                })
            );
        } else if (index == 2) {
            dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'tabWorkbenchException'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            dispatch(
                createAction('pointDetails/updateState')({
                    // sourceType: 'WorkbenchException'
                    sourceType: 'tabWorkbenchException'
                })
            );
            dispatch(
                createAction('alarm/getAlarmRecords')({
                    params: {
                        AlarmType: '2',
                        PageIndex: 1,
                        PageSize: 20
                    }
                })
            );
        }
        setTimeout(() => {
            dispatch(createAction('tabAlarmListModel/updateState')({
                alarmType: index
            }))
        }, 200);

    }
    return (
        <View
            style={[{
                width: '100%', height: '100%',
            }]}
        >
            <View style={[{
                flexDirection: 'row', height: 44
                , width: SCREEN_WIDTH, alignItems: 'center'
                , justifyContent: 'space-between'
                , backgroundColor: 'white', marginBottom: 5
            }]}>
                <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                        onPress={() => {
                            tabOnclick(0);
                            // dispatch(createAction('tabAlarmListModel/updateState')({
                            //     alarmType: 0
                            // }))
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     signInType: 0
                            // }));
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     workTypeSelectedItem: null,
                            //     signInEntItem: null
                            // }));
                            // this.getSignInType(0);
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
                                    , color: alarmType == 0 ? '#4AA0FF' : '#666666'
                                }]}>{'超标报警'}</Text>
                            </View>
                            {dataOverHourCount > 0 ? <View
                                style={[{
                                    width: 16, height: 16, borderRadius: 8
                                    , justifyContent: 'center', alignItems: 'center'
                                    , backgroundColor: 'red'
                                    , position: 'absolute', right: (topButtonWidth - 90) / 2, top: 4
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 12, color: 'white'
                                    }]}
                                >{dataOverHourCount}</Text>
                            </View> : null}
                            <View style={[{
                                width: 40, height: 2
                                , backgroundColor: alarmType == 0 ? '#4AA0FF' : 'white'
                            }]}>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                        onPress={() => {
                            tabOnclick(1);
                            // dispatch(createAction('tabAlarmListModel/updateState')({
                            //     alarmType: 1
                            // }))
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     signInType: 1
                            // }));
                            // // 点击运维现场不刷新fileUUID，切换到非现场生成新fileUUID，
                            // // 回到运维现场时刷新fileUUID
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     workTypeSelectedItem: null,
                            //     signInEntItem: null,
                            //     remark: '',
                            //     fileUUID: `_sign_in_${new Date().getTime()}`
                            // }));
                            // this.getSignInType(1);
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
                                    , color: alarmType == 1 ? '#4AA0FF' : '#666666'
                                }]}>{'超标预警'}</Text>
                            </View>
                            {dataOverMinuteCount > 0 ? <View
                                style={[{
                                    width: 16, height: 16, borderRadius: 8
                                    , justifyContent: 'center', alignItems: 'center'
                                    , backgroundColor: 'red'
                                    , position: 'absolute', right: (topButtonWidth - 90) / 2, top: 4
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 12, color: 'white'
                                    }]}
                                >{dataOverMinuteCount}</Text>
                            </View> : null}
                            <View style={[{
                                width: 40, height: 2
                                , backgroundColor: alarmType == 1 ? '#4AA0FF' : 'white'
                            }]}>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                        onPress={() => {
                            tabOnclick(2);
                            // dispatch(createAction('tabAlarmListModel/updateState')({
                            //     alarmType: 2
                            // }))
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     signInType: 1
                            // }));
                            // // 点击运维现场不刷新fileUUID，切换到非现场生成新fileUUID，
                            // // 回到运维现场时刷新fileUUID
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     workTypeSelectedItem: null,
                            //     signInEntItem: null,
                            //     remark: '',
                            //     fileUUID: `_sign_in_${new Date().getTime()}`
                            // }));
                            // this.getSignInType(1);
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
                                    , color: alarmType == 2 ? '#4AA0FF' : '#666666'
                                }]}>{'异常报警'}</Text>
                            </View>
                            {dataExceptionCount > 0 ? <View
                                style={[{
                                    width: 16, height: 16, borderRadius: 8
                                    , justifyContent: 'center', alignItems: 'center'
                                    , backgroundColor: 'red'
                                    , position: 'absolute', right: (topButtonWidth - 90) / 2, top: 4
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 12, color: 'white'
                                    }]}
                                >{dataExceptionCount}</Text>
                            </View> : null}
                            <View style={[{
                                width: 40, height: 2
                                , backgroundColor: alarmType == 2 ? '#4AA0FF' : 'white'
                            }]}>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {
                // alarmType == 0
                //     ? <OneTabAlarmList />
                //     : alarmType == 1
                //         ? <OneTabAlarmList />
                //         : alarmType == 2
                //             ? <View><Text>异常报警</Text></View>
                //             : null
            }
            <OneTabAlarmList itemType={alarmType == 0 ? 'over' : alarmType == 1 ? 'warning' : alarmType == 2 ? 'exception' : ''} />
        </View>
    )
}