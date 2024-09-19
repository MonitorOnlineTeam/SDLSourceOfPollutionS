import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';

const duihao = require('../../images/ic_nomal.png');
const cuohao = require('../../images/ic_exceptional.png');

/**
 * 核实记录
 */
@connect(({ pointDetails, app, alarm }) => ({
    overDataTypeResult: alarm.overDataTypeResult,
    overDataTypes: alarm.overDataTypes,
    verifyListData: pointDetails.verifyListData,
    verifyTotal: pointDetails.verifyTotal,
    verifyStateCod: app.verifyStateCod,
    verifyListResult: pointDetails.verifyListResult,
    verifyIndex: pointDetails.verifyIndex
}))
export default class VerifyRecords extends PureComponent {
    static navigationOptions = ({ route }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(route, ['params', 'params', 'pageType'], 'VerifyRecords') == 'VerifyRecords' ? '核实记录' : '超标核实记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0
        };
        this.recordType = SentencedToEmpty(this.props.route, ['params', 'params', 'pageType'], 'VerifyRecords');
    }

    getRangeDaySelectOption = () => {
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
                /**
                 * recordType == 'VerifyRecords' 原有核实记录
                 * 'OverAlarmVerifyRecords' 运维人员超标核实记录 OverAlarmVerify
                 * 需要将参数更新到不同的state中
                 */
                // if (this.recordType == 'VerifyRecords') {
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        verifyIndex: 1,
                        verifyTotal: 0,
                        verifyBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        verifyEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );
                // } else {
                // }

                if (this.props.verifyListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    componentDidMount() {
        // this.list.onRefresh();
        /**
         * recordType == 'VerifyRecords' 原有核实记录
         * 'OverAlarmVerifyRecords' 运维人员超标核实记录 OverAlarmVerify
         * 需要将初始化不同的参数
         */
        if (this.recordType == 'VerifyRecords') {
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    VerifyState: 0,
                    verifyBeginTime: moment()
                        .subtract(7, 'day')
                        .format('YYYY-MM-DD 00:00:00'),
                    verifyEndTime: moment().format('YYYY-MM-DD 23:59:59')
                })
            );
            this.statusPageOnRefresh();
        } else {
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    VerifyState: '',
                    verifyBeginTime: moment()
                        .subtract(7, 'day')
                        .format('YYYY-MM-DD 00:00:00'),
                    verifyEndTime: moment().format('YYYY-MM-DD 23:59:59')
                })
            );
            this.optionStatusPageOnRefresh();
        }
    }

    getVerifyTypeSelectOption = () => {
        let dataArr = this.props.verifyStateCod;
        if (this.recordType == 'OverAlarmVerify') {
            // dataArr = [
            //     { name: '全部', code: '' },
            //     {
            //         name: '工艺超标',
            //         code: 1
            //     },
            //     {
            //         name: '监测设备故障',
            //         code: 2
            //     },
            //     {
            //         name: '监测设备维护',
            //         code: 3
            //     },
            //     {
            //         name: '工艺设备故障',
            //         code: 4
            //     },
            //     {
            //         name: '停炉启炉',
            //         code: 5
            //     }
            // ];
            dataArr = this.props.overDataTypes
        }
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '核实结果',
            defaultCode: '-1',
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        VerifyState: item.code
                    })
                );
                // this.props.dispatch(createAction('pointDetails/getVerifyRecordList')({ setListData: this.list.setListData }));
                if (this.props.verifyListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    _onItemClick = item => {
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'AlarmVerifyDetail',
                params: {
                    item,
                    recordType: this.recordType //传入页面身份信息 OverAlarmVerify 运维超标报警核实 VerifyRecords 监控报警核实
                }
            })
        );
    };

    onRefresh = index => {
        this.props.dispatch(createAction('pointDetails/updateState')({ verifyIndex: index, verifyTotal: 0 }));
        /**
         * recordType == 'VerifyRecords' 原有核实记录
         * 'OverAlarmVerifyRecords' 运维人员超标核实记录 OverAlarmVerify
         * 需要将初始化不同的参数
         */
        if (this.recordType == 'VerifyRecords') {
            this.props.dispatch(createAction('pointDetails/getVerifyRecordList')({ setListData: this.list.setListData }));
        } else {
            this.props.dispatch(createAction('pointDetails/getOpetaionVerifyList')({ setListData: this.list.setListData }));
        }
    };

    optionStatusPageOnRefresh = () => {
        // 先获取筛选条件
        this.props.dispatch(createAction('alarm/getOverDataType')({
            callback: (preResult) => {
                if (SentencedToEmpty(preResult, ['status'], -1) == 200) {
                    this.statusPageOnRefresh();
                }
            }
        }));
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('pointDetails/updateState')({ verifyIndex: 1, verifyTotal: 0, verifyListResult: { status: -1 } }));
        if (this.recordType == 'VerifyRecords') {
            this.props.dispatch(createAction('pointDetails/getVerifyRecordList')({}));
        } else {
            this.props.dispatch(createAction('pointDetails/getOpetaionVerifyList')({}));
        }
    };

    render() {
        return (
            <StatusPage
                status={this.recordType == 'VerifyRecords' ? 200 : this.props.overDataTypeResult.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.optionStatusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.optionStatusPageOnRefresh();
                }}
            >
                <View style={styles.container}>
                    <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10 }]}>
                        <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                        <SimplePicker option={this.getVerifyTypeSelectOption()} />
                    </View>
                    <StatusPage
                        status={this.props.verifyListResult.status}
                        //页面是否有回调按钮，如果不传，没有按钮，
                        emptyBtnText={'重新请求'}
                        errorBtnText={'点击重试'}
                        onEmptyPress={() => {
                            //空页面按钮回调
                            console.log('重新刷新');
                            this.statusPageOnRefresh();
                        }}
                        onErrorPress={() => {
                            //错误页面按钮回调
                            console.log('错误操作回调');
                            this.statusPageOnRefresh();
                        }}
                    >
                        <View style={styles.container}>
                            <FlatListWithHeaderAndFooter
                                ItemSeparatorComponent={() => {
                                    return <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />;
                                }}
                                ref={ref => (this.list = ref)}
                                pageSize={20}
                                hasMore={() => {
                                    return this.props.verifyListData.length < this.props.verifyTotal;
                                }}
                                onRefresh={index => {
                                    this.onRefresh(index);
                                }}
                                onEndReached={index => {
                                    this.props.dispatch(createAction('pointDetails/updateState')({ verifyIndex: index }));
                                    this.props.dispatch(createAction('pointDetails/getVerifyRecordList')({ setListData: this.list.setListData }));
                                }}
                                renderItem={({ item, index }) => {
                                    if (this.recordType == 'VerifyRecords') {
                                        return (
                                            <Touchable onPress={() => this._onItemClick(item)}>
                                                <View style={[{ height: 115, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13 }]}>
                                                    <View style={[{ height: 44, width: SCREEN_WIDTH - 26, flexDirection: 'row', alignItems: 'center' }]}>
                                                        <Image style={[{ height: 15, width: 15 }]} source={SentencedToEmpty(item, ['dbo.T_Cod_ExceptionVerify.VerifyState'], 0) == 1 ? duihao : cuohao} />
                                                        <SDLText fontType={'normal'} style={[{ marginLeft: 5, color: '#666' }]}>
                                                            {item['dbo.T_Cod_ExceptionVerify.VerifyState_Name']}
                                                        </SDLText>
                                                        <View style={[{ flex: 1 }]} />
                                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>{`核查人:${item['dbo.T_Cod_ExceptionVerify.VerifyPerSon']}`}</SDLText>
                                                    </View>
                                                    <View style={[{ height: 1, width: SCREEN_WIDTH - 26, backgroundColor: '#d9d9d9' }]} />
                                                    <View style={[{ height: 33, width: SCREEN_WIDTH - 26, justifyContent: 'center' }]}>
                                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                                            {item['dbo.T_Cod_ExceptionVerify.VerifyTime']}
                                                        </SDLText>
                                                    </View>
                                                    <View style={[{ height: 27, width: SCREEN_WIDTH - 26, backgroundColor: '#e5e5e5', borderRadius: 2, justifyContent: 'center' }]}>
                                                        <SDLText numberOfLines={1} ellipsizeMode={'tail'} fontType={'normal'} style={[{ marginLeft: 11, color: '#666' }]}>
                                                            {item['dbo.T_Cod_ExceptionVerify.VerifyMessage']}
                                                        </SDLText>
                                                    </View>
                                                </View>
                                            </Touchable>
                                        );
                                    } else {
                                        return (
                                            <Touchable onPress={() => this._onItemClick(item)}>
                                                <View style={[{ height: 115, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13 }]}>
                                                    <View style={[{ height: 44, width: SCREEN_WIDTH - 26, flexDirection: 'row', alignItems: 'center' }]}>
                                                        <Image style={[{ height: 15, width: 15 }]} source={SentencedToEmpty(item, ['VerifyState'], 0) == 1 ? duihao : cuohao} />
                                                        <SDLText fontType={'normal'} style={[{ marginLeft: 5, color: '#666' }]}>
                                                            {item['VerifyState_Name']}
                                                        </SDLText>
                                                        <View style={[{ flex: 1 }]} />
                                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>{`核查人:${item['VerifyPerSon']}`}</SDLText>
                                                    </View>
                                                    <View style={[{ height: 1, width: SCREEN_WIDTH - 26, backgroundColor: '#d9d9d9' }]} />
                                                    <View style={[{ height: 33, width: SCREEN_WIDTH - 26, justifyContent: 'center' }]}>
                                                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                                            {item['VerifyTime']}
                                                        </SDLText>
                                                    </View>
                                                    <View style={[{ height: 27, width: SCREEN_WIDTH - 26, backgroundColor: '#e5e5e5', borderRadius: 2, justifyContent: 'center' }]}>
                                                        <SDLText numberOfLines={1} ellipsizeMode={'tail'} fontType={'normal'} style={[{ marginLeft: 11, color: '#666' }]}>
                                                            {item['VerifyMessage']}
                                                        </SDLText>
                                                    </View>
                                                </View>
                                            </Touchable>
                                        );
                                    }
                                }}
                                data={this.props.verifyListData}
                            />
                        </View>
                    </StatusPage>
                </View>
            </StatusPage>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }
});
