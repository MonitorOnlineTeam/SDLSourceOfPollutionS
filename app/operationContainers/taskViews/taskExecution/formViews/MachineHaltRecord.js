//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { NavigationActions, createAction, createNavigationOptions, SentencedToEmpty, StackActions } from '../../../../utils';
// import { getToken, } from '../../dvapack/storage';
import { StatusPage, Touchable, PickerTouchable } from '../../../../components';
import { AlertDialog } from '../../../../components';

const enterpriseUser = 0;
const operationsStaff = 1;

// create a component
@connect(({ machineHaltRecord, standardGasReplacementRecord, calibrationRecord }) => ({
    RecordList: machineHaltRecord.RecordList,
    liststatus: machineHaltRecord.liststatus
}))
class MachineHaltRecord extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty('navigation', ['state', 'params', 'CnName'], '停机记录'),
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        _me.props.dispatch(NavigationActions.navigate({ routeName: 'AddMachineHaltRecord', params: { index: -1 } }));
                    }}
                >
                    <Image source={require('../../../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                </TouchableOpacity>
            )
        });

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    a: '2018-12-17 14:00',
                    b: '2018-12-17 15:00',
                    c: 1,
                    id: 1,
                    data: '停机维护,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度'
                }
            ],
            gasReplacementList: [
                {
                    a: '2018-12-17 14:00',
                    b: '二氧化硫标准气体',
                    g: '70mg/m³',
                    c: 'ml',
                    d: '100',
                    e: '雪迪龙',
                    f: '2019-12-17 14:00'
                }
            ]
        };
        _me = this;
        // this.props.navigation.setParams({navigatePress:this._deleteForm});
        this.props.navigation.setParams({ navigatePress: this._addForm });
    }

    _deleteForm = () => {
        if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
            this.props.dispatch(
                createAction('standardGasReplacementRecord/checkDelForm')({
                    callback: () => {
                        this._modalParent.showModal();
                    }
                })
            );
        } else if (this.props.navigation.state.params.TypeName == 'JzHistoryList') {
            this.props.dispatch(
                createAction('calibrationRecord/checkDelForm')({
                    callback: () => {
                        this._modalParent.showModal();
                    }
                })
            );
        } else if (this.props.navigation.state.params.TypeName == 'StopCemsHistoryList') {
            this.props.dispatch(
                createAction('machineHaltRecord/checkDelForm')({
                    callback: () => {
                        this._modalParent.showModal();
                    }
                })
            );
        }
    };

    _addForm = () => {
        if (this.props.navigation.state.params.TypeName == 'StopCemsHistoryList') {
            // if (this.props.navigation.state.params.TypeName == '停机记录表') {
            // if (this.props.navigation.state.params.ID == 2) {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'AddMachineHaltRecord', params: { index: -1 } }));
        } else if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
            // } else if (this.props.navigation.state.params.ID == 4) {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'StandardGasReplacementRecord', params: { index: -1 } }));
        }
    };

    _keyExtractor = (item, index) => {
        return index + '';
    };

    _renderItem = ({ item, index }) => {
        if (this.props.navigation.state.params.TypeName == 'StopCemsHistoryList') {
            // if (this.props.navigation.state.params.TypeName == '停机记录表') {
            // if (this.props.navigation.state.params.ID == 2) {
            let duration =
                (moment(item.EndTime, 'YYYY-MM-DD HH:mm:ss')
                    .toDate()
                    .getTime() -
                    moment(item.BeginTime, 'YYYY-MM-DD HH:mm')
                        .toDate()
                        .getTime()) /
                1000 /
                360;
            duration = Math.round(duration) / 10;
            let durationStr = duration + '小时';
            if (duration < 1) {
                duration =
                    (moment(item.EndTime, 'YYYY-MM-DD HH:mm:ss')
                        .toDate()
                        .getTime() -
                        moment(item.BeginTime, 'YYYY-MM-DD HH:mm')
                            .toDate()
                            .getTime()) /
                    1000 /
                    60;
                duration = Math.round(duration * 10) / 10;
                durationStr = duration + '分钟';
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'AddMachineHaltRecord', params: { index } }));
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginTop: index != 0 ? 8 : 0 }]}>
                        <View style={[{ paddingHorizontal: 13, borderColor: globalcolor.borderLightGreyColor, backgroundColor: globalcolor.white, paddingHorizontal: 13 }]}>
                            <View style={[{ flexDirection: 'row', height: 30, marginTop: 10 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>停机开始时间：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.BeginTime}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 30 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>停机结束时间：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.EndTime}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 30 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>停机持续时间：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{durationStr}</Text>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 26, borderBottomColor: globalcolor.borderBottomColor, borderBottomWidth: 1 }]} />
                            <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel, marginTop: 8 }]}>停机原因</Text>
                            <Text style={[{ marginBottom: 10, fontSize: 14, color: globalcolor.taskFormLabel, marginTop: 10 }]}>{item.ChangeSpareparts}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
            // } else if (this.props.navigation.state.params.ID == 4) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'StandardGasReplacementRecord', params: { index } }));
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginTop: index != 0 ? 8 : 0 }]}>
                        <View
                            style={[
                                {
                                    borderColor: globalcolor.borderLightGreyColor,
                                    backgroundColor: globalcolor.white,
                                    paddingHorizontal: 13
                                }
                            ]}
                        >
                            <View style={[{ flexDirection: 'row', height: 32, alignItems: 'center', marginTop: 8 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>供应商户：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.Supplier}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 24, height: 28, alignItems: 'center' }]}>
                                <View style={[{ flexDirection: 'row', height: 28, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>物质名称：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.StandardGasName}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 28, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>单位：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.Unit}</Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 24, height: 28, alignItems: 'center' }]}>
                                <View style={[{ flexDirection: 'row', height: 28, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>气体浓度：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.GasStrength}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 28, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>数量：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.Num}</Text>
                                </View>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 24, borderBottomColor: globalcolor.borderBottomColor, borderBottomWidth: 1 }]} />
                            <View style={[{ flexDirection: 'row', marginTop: 16 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>更换日期：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.ReplaceDate && typeof item.ReplaceDate != 'undefined' && item.ReplaceDate != '' ? item.ReplaceDate.split(' ')[0] : '------'}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 28, alignItems: 'center', marginBottom: 8 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>有效日期：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>
                                    {item.PeriodOfValidity && typeof item.PeriodOfValidity != 'undefined' && item.PeriodOfValidity != '' ? item.PeriodOfValidity.split(' ')[0] : '------'}
                                </Text>
                            </View>
                            {/* <Text style={[{fontSize:16,color:globalcolor.textBlack,}]}>停机原因</Text>
                        <Text style={[{marginBottom:10,fontSize:15,color:globalcolor.datepickerGreyText,}]}>
                            {item.data}
                        </Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else if (this.props.navigation.state.params.TypeName == 'JzHistoryList') {
            // } else if (this.props.navigation.state.params.ID == 4) {
            // if ((item.LdCalibrationIsOk&&item.LdCalibrationIsOk != '')||(item.LcCalibrationIsOk&&item.LcCalibrationIsOk != '')) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        // this.props.dispatch(NavigationActions.navigate({routeName:'StandardGasReplacementRecord',params:{index}}));
                        this.props.dispatch(
                            StackActions.push({
                                routeName: 'CalibrationRecordEdit',
                                params: { index, item }
                            })
                        );
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginTop: index != 0 ? 8 : 0 }]}>
                        <View
                            style={[
                                {
                                    borderColor: globalcolor.borderLightGreyColor,
                                    backgroundColor: globalcolor.white,
                                    paddingHorizontal: 13
                                }
                            ]}
                        >
                            <View style={[{ flexDirection: 'row', height: 30, marginTop: 10, borderBottomColor: globalcolor.borderLightGreyColor, borderBottomWidth: 1 }]}>
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>{item.ItemID + '分析仪校准'}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 30, marginTop: 10, alignItems: 'center' }]}>
                                <View
                                    style={[
                                        {
                                            backgroundColor:
                                                item.LdCalibrationIsOk && item.LdCalibrationIsOk != '' && item.LdCalibrationSufValue && item.LdCalibrationSufValue != '' ? globalcolor.hadCalibrationColor : globalcolor.uncalibratedColor,
                                            borderRadius: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 20,
                                            marginRight: 4
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 13, color: globalcolor.whiteFont, marginHorizontal: 4 }]}>
                                        {item.LdCalibrationIsOk && item.LdCalibrationIsOk != '' && item.LdCalibrationSufValue && item.LdCalibrationSufValue != '' ? '已校准' : '未校准'}
                                    </Text>
                                </View>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{'零点校准'}</Text>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10 }]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'上次校准后：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LdLastCalibrationValue && item.LdLastCalibrationValue != '' ? item.LdLastCalibrationValue : '--'}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'零点漂移：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LdPy && item.LdPy != '' ? item.LdPy : '--'}</Text>
                                </View>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10 }]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'校前测试：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LdCalibrationPreValue && item.LdCalibrationPreValue != '' ? item.LdCalibrationPreValue : '--'}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'是否正常：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LdCalibrationIsOk && item.LdCalibrationIsOk != '' ? item.LdCalibrationIsOk : '--'}</Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 30, marginTop: 10, alignItems: 'center' }]}>
                                <View
                                    style={[
                                        {
                                            backgroundColor:
                                                item.LcCalibrationIsOk && item.LcCalibrationIsOk != '' && item.LcCalibrationSufValue && item.LcCalibrationSufValue != '' ? globalcolor.hadCalibrationColor : globalcolor.uncalibratedColor,
                                            borderRadius: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 20
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 13, color: globalcolor.whiteFont, marginHorizontal: 4 }]}>
                                        {item.LcCalibrationIsOk && item.LcCalibrationIsOk != '' && item.LcCalibrationSufValue && item.LcCalibrationSufValue != '' ? '已校准' : '未校准'}
                                    </Text>
                                </View>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{'量程校准'}</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{'(' + item.FxyLc + ')'}</Text>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10 }]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'上次校准后：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LcLastCalibrationValue && item.LcLastCalibrationValue != '' ? item.LcLastCalibrationValue : '--'}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'零点漂移：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LcPy && item.LcPy != '' ? item.LcPy : '--'}</Text>
                                </View>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10 }]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'校前测试：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LcCalibrationPreValue && item.LcCalibrationPreValue != '' ? item.LcCalibrationPreValue : '--'}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{'是否正常：'}</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.datepickerGreyText }]}>{item.LcCalibrationIsOk && item.LcCalibrationIsOk != '' ? item.LcCalibrationIsOk : '--'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
            // } else {
            //     return(
            //         <TouchableOpacity onPress={()=>{
            //             // this.props.dispatch(NavigationActions.navigate({routeName:'StandardGasReplacementRecord',params:{index}}));
            //             this.props.dispatch(StackActions.push({
            //                 routeName: 'CalibrationRecordEdit',params:{index,item}
            //             }));
            //         }}>
            //         <View style={[{width:SCREEN_WIDTH,alignItems:'center'}]}>
            //             <View style={[{width:SCREEN_WIDTH-24,borderRadius:8,
            //                             marginVertical:8,borderColor:globalcolor.borderLightGreyColor,
            //                             backgroundColor:globalcolor.white,paddingHorizontal:15,}]}>
            //                 <View style={[{flexDirection:'row',height:30,marginTop:10,}]}>
            //                     <Text style={[{fontSize:15,color:globalcolor.datepickerGreyText,}]}>{item.ItemID+'分析仪校准'}</Text>
            //                 </View>
            //             </View>
            //         </View>
            //         </TouchableOpacity>
            //     );
            // }
        }
    };

    _ListHeaderComponent = () => {
        if (this.props.navigation.state.params.TypeName == 'JzHistoryList') {
            return null;
        } else {
            return (
                <View
                    style={[
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: SCREEN_WIDTH
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={[{ marginVertical: 10 }]}
                        onPress={() => {
                            if (this.props.navigation.state.params.TypeName == 'StopCemsHistoryList') {
                                // if (this.props.navigation.state.params.TypeName == '停机记录表') {
                                // if (this.props.navigation.state.params.ID == 2) {
                                this.props.dispatch(NavigationActions.navigate({ routeName: 'AddMachineHaltRecord', params: { index: -1 } }));
                            } else if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
                                // } else if (this.props.navigation.state.params.ID == 4) {
                                this.props.dispatch(NavigationActions.navigate({ routeName: 'StandardGasReplacementRecord', params: { index: -1 } }));
                            }
                        }}
                    >
                        <View style={[{ width: SCREEN_WIDTH - 24, height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: globalcolor.white, borderRadius: 8 }]}>
                            <Text style={[{ color: '#333333', fontSize: 15 }]}>添加记录</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    };
    cancelButton = () => { };
    confirm = () => {
        this.props.dispatch(
            createAction('machineHaltRecord/delForm')({
                callback: ID => {
                    //返回任务执行，刷新数据
                    // this.props.dispatch(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({taskID:ID}));
                    // this._modalParent.hideModal();
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除所有停机记录的表单',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <StatusPage status={this.props.liststatus.status}>
                <FlatList
                    // ListHeaderComponent={this._ListHeaderComponent}
                    data={this.props.RecordList}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        this.refs.doAlert.show();
                    }}
                >
                    {this.props.RecordList.length > 0 ? (
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    }
});

//make this component available to the app
export default MachineHaltRecord;
