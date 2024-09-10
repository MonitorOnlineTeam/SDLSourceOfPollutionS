import React, { PureComponent, Component } from 'react';
import { Text, View, StyleSheet, Image, Platform, TouchableOpacity, DeviceEventEmitter, Alert } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText, AlertDialog } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';
/**
 * 异常识别某个企业下的某一类报警列表
 */
@connect(({ abnormalTask }) => ({
    alarmAnalyListData: abnormalTask.alarmAnalyListData,
    alarmAnalyListResult: abnormalTask.alarmAnalyListResult,
    alarmAnalyIndex: abnormalTask.alarmAnalyIndex,
    alarmAnalyDataType: abnormalTask.alarmAnalyDataType,
    alarmAnalyTotal: abnormalTask.alarmAnalyTotal,
    MoldList: abnormalTask.MoldList,
    alarmAnalyBeginTime: abnormalTask.alarmAnalyBeginTime,
    alarmAnalyEndTime: abnormalTask.alarmAnalyEndTime
}))
export default class AbnormalOneETypeList extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '异常识别线索',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            warningTypeCode: '',
            selectItems: []
        };
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshSec', 'true');
    }
    componentDidMount() {
        this.statusPageOnRefresh();
    }

    getRangeDaySelectOption = () => {
        return {
            defaultTime: this.props.alarmAnalyBeginTime,
            start: this.props.alarmAnalyBeginTime,
            end: this.props.alarmAnalyEndTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                console.log('endMoment = ', endMoment);
                console.log('startMoment = ', startMoment);
                this.props.dispatch(
                    createAction('abnormalTask/updateState')({
                        alarmAnalyIndex: 1,
                        alarmAnalyTotal: 0,
                        alarmAnalyBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        alarmAnalyEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );

                this.onRefresh();
            }
        };
    };

    onRefresh = index => {
        this.setState({ selectItems: [] });
        let item = SentencedToEmpty(this.props.navigation, ['state', 'params', 'item'], {});
        this.props.dispatch(createAction('abnormalTask/updateState')({ alarmAnalyIndex: 1, alarmAnalyTotal: 0 }));
        this.props.dispatch(
            createAction('abnormalTask/GetWaitCheckDatas')({
                setListData: this.list.setListData,
                params: {
                    warningCode: item.WarningCode,
                    dgimn: item.DGIMN
                }
            })
        );
    };

    statusPageOnRefresh = () => {
        let item = SentencedToEmpty(this.props.navigation, ['state', 'params', 'item'], {});
        console.log('statusPageOnRefresh item = ', item);
        this.props.dispatch(createAction('abnormalTask/updateState')({ alarmAnalyIndex: 1, alarmAnalyTotal: 0, alarmAnalyListResult: { status: -1 } }));
        this.props.dispatch(
            createAction('abnormalTask/GetWaitCheckDatas')({
                params: {
                    warningCode: item.WarningCode,
                    dgimn: item.DGIMN
                }
            })
        );
    };

    _onItemClick = item => {
        console.log(item);
        let newSelect = [].concat(this.state.selectItems);
        item.onRefresh = this.onRefresh;
        let newSelectIndex = newSelect.findIndex(sitem => sitem.WarningCode == item.WarningCode);
        if (newSelectIndex > -1) {
            newSelect.splice(newSelectIndex, 1);
        } else {
            newSelect.push(item);
        }
        this.setState({ selectItems: newSelect });
        return;
    };

    render() {
        let naviItem = SentencedToEmpty(this.props.navigation, ['state', 'params', 'item'], {});

        return (
            <View style={styles.container}>
                <StatusPage
                    status={this.props.alarmAnalyListResult.status}
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
                            ref={ref => (this.list = ref)}
                            pageSize={20}
                            hasMore={() => {
                                return this.props.alarmAnalyListData.length < this.props.alarmAnalyTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            ItemSeparatorComponent={() => {
                                return <View style={{ height: 1, backgroundColor: '#d9d9d9' }} />;
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('abnormalTask/updateState')({ alarmAnalyIndex: index }));
                                this.props.dispatch(
                                    createAction('abnormalTask/GetWaitCheckDatas')({
                                        setListData: this.list.setListData,
                                        params: {
                                            warningCode: naviItem.WarningCode,
                                            dgimn: naviItem.DGIMN
                                        }
                                    })
                                );
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Touchable
                                        onPress={() =>
                                            this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'ClueDetail',
                                                    params: { ...item, onRefresh: null }
                                                })
                                            )
                                        }
                                    >
                                        <View style={[{ width: SCREEN_WIDTH, minHeight: 123, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                                            <View style={[{ height: 45, alignItems: 'center', flexDirection: 'row', paddingStart: 13 }]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this._onItemClick(item);
                                                    }}
                                                >
                                                    <Image
                                                        style={{ width: 25, height: 25, marginRight: 3 }}
                                                        source={this.state.selectItems.findIndex(sitem => sitem.WarningCode == item.WarningCode) > -1 ? require('../../images/auditselect.png') : require('../../images/alarm_unselect.png')}
                                                    />
                                                </TouchableOpacity>

                                                {item.IsCheck == 1 && naviItem.status == 1 && <Image style={{ width: 25, height: 25, marginRight: 3 }} source={require('../../images/chehui.png')} />}
                                                <Text numberOfLines={1} style={[{ color: '#333', textAlign: 'center', maxWidth: SCREEN_WIDTH - 60, lineHight: 45 }]}>{`${item.EntName || ''}-${item.PointName || ''}`}</Text>
                                            </View>
                                            <View style={[{ alignItems: 'center', flexDirection: 'row', paddingStart: 13, paddingEnd: 13 }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666666', lineHeight: 18 }]}>
                                                    {item.WarningContent}
                                                </SDLText>
                                            </View>
                                            <View style={[{ alignItems: 'center', flexDirection: 'row', paddingStart: 13, justifyContent: 'space-between', paddingEnd: 13, padding: 13 }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 16, height: 16, marginRight: 3 }} source={require('../../images/ic_tab_statistics_selected.png')} />
                                                    <SDLText fontType={'normal'} style={[{ color: '#666666' }]}>
                                                        {item.ClueTime}
                                                    </SDLText>
                                                </View>
                                            </View>
                                        </View>
                                        {item.IsList == 1 ? (
                                            <View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopColor: '#ccc', borderTopWidth: 5, flex: 1, height: 6, backgroundColor: '#fff' }}></View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopColor: '#ccc', borderTopWidth: 5, flex: 1, height: 5, backgroundColor: '#fff' }}></View>
                                            </View>
                                        ) : null}
                                    </Touchable>
                                );
                            }}
                            data={this.props.alarmAnalyListData}
                            onEndReachedThreshold={0.1}
                        />
                    </View>

                    {this.props.alarmAnalyListData.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.selectItems.length > 0) {
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'TaskProduce',
                                            params: this.state.selectItems
                                        })
                                    );
                                } else {
                                    ShowToast('至少选择一条以上线索进行核实');
                                }
                            }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                flex: 1,
                                alignSelf: 'center',
                                width: SCREEN_WIDTH - 30,
                                height: 44,
                                borderRadius: 5,
                                backgroundColor: this.state.selectItems.length > 0 ? '#4DA9FF' : '#cccccc',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff' }}>生成任务</Text>
                        </TouchableOpacity>
                    )}
                </StatusPage>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
