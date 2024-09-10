import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../../components/FlatListWithHeaderAndFooter';

/**
 * 报警记录
 */
@connect(({ alarmAnaly }) => ({
    alarmAnalyListData: alarmAnaly.alarmAnalyListData,
    alarmAnalyListResult: alarmAnaly.alarmAnalyListResult,
    alarmAnalyIndex: alarmAnaly.alarmAnalyIndex,
    alarmAnalyDataType: alarmAnaly.alarmAnalyDataType,
    alarmAnalyTotal: alarmAnaly.alarmAnalyTotal,
    MoldList: alarmAnaly.MoldList,
    alarmAnalyBeginTime: alarmAnaly.alarmAnalyBeginTime,
    alarmAnalyEndTime: alarmAnaly.alarmAnalyEndTime
}))
export default class AlarmReview extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '异常识别线索',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            warningTypeCode: ''
        };
    }
    componentWillUnmount() {
        this.props.dispatch(
            createAction('alarmAnaly/updateState')({
                alarmAnalyIndex: 1,
                alarmAnalyTotal: 0,
                alarmAnalyBeginTime: moment()
                    .subtract(1, 'month')
                    .format('YYYY-MM-DD 00:00:00'),
                alarmAnalyEndTime: moment().format('YYYY-MM-DD 23:59:59')
            })
        );
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
                this.props.dispatch(
                    createAction('alarmAnaly/updateState')({
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
        this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmAnalyIndex: 1, alarmAnalyTotal: 0 }));
        this.props.dispatch(createAction('alarmAnaly/getalarmAnalyList')({ setListData: this.list.setListData, warningTypeCode: this.state.warningTypeCode }));
    };

    statusPageOnRefresh = () => {
        // 先获取筛选条件
        this.props.dispatch(
            createAction('alarmAnaly/getMoldListType')({
                callback: preResult => {
                    this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmAnalyIndex: 1, alarmAnalyTotal: 0, alarmAnalyListResult: { status: -1 } }));
                    this.props.dispatch(createAction('alarmAnaly/getalarmAnalyList')({}));
                }
            })
        );
    };

    getDataTypeSelectOption = () => {
        return {
            codeKey: 'ModelGuid',
            nameKey: 'ModelName',
            placeHolder: '全部类型',
            dataArr: [{ ModelGuid: '', ModelName: '全部类型' }, ...this.props.MoldList],
            defaultCode: '',
            onSelectListener: item => {
                this.setState({ warningTypeCode: item.ModelGuid }, () => {
                    this.onRefresh();
                });
            }
        };
    };

    _onItemClick = item => {
        item.onRefresh = this.onRefresh;
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'AlarmVerifyTab',
                params: item
            })
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10, paddingLeft: 20, paddingRight: 20 }]}>
                    <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                    {this.props.MoldList.length > 0 ? <SimplePicker option={this.getDataTypeSelectOption()} style={[{ width: 150 }]} /> : null}
                </View>

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
                            onEndReached={index => {
                                this.props.dispatch(createAction('alarmAnaly/updateState')({ alarmAnalyIndex: index }));
                                this.props.dispatch(createAction('alarmAnaly/getalarmAnalyList')({ setListData: this.list.setListData, warningTypeCode: this.state.warningTypeCode }));
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Touchable onPress={() => this._onItemClick(item)}>
                                        <View style={[{ width: SCREEN_WIDTH, minHeight: 123, flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                                            <View style={[{ height: 45, alignItems: 'center', flexDirection: 'row', paddingStart: 13 }]}>
                                                <TouchableOpacity onPress={() => { }}>
                                                    <Image style={{ width: 20, height: 20, marginRight: 3 }} source={require('../../../images/alarm_unselect.png')} />
                                                </TouchableOpacity>
                                                <Text numberOfLines={1} style={[{ color: '#333', textAlign: 'center', maxWidth: SCREEN_WIDTH - 150, lineHight: 45 }]}>{`${item.EntNmae || ''}-${item.PointName || ''}`}</Text>
                                                <View
                                                    style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 5,
                                                        backgroundColor: item.CheckedResultCode == 3 ? 'rgba(102,102,102,0.1)' : item.CheckedResultCode == 1 ? 'rgba(255,87,74,0.1)' : 'rgba(38,193,154,0.1)',
                                                        marginLeft: 3,

                                                        height: 20,
                                                        paddingLeft: 5,
                                                        paddingRight: 5
                                                    }}
                                                >
                                                    <Text style={[{ color: item.CheckedResultCode == 3 ? '#666666' : item.CheckedResultCode == 1 ? '#FF574A' : '#26C19A', textAlign: 'center', fontSize: 11 }]}>{item.CheckedResult}</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: 5,
                                                        backgroundColor: item.CheckedResultCode == 3 ? 'rgba(102,102,102,0.1)' : item.CheckedResultCode == 1 ? 'rgba(255,87,74,0.1)' : 'rgba(38,193,154,0.1)',
                                                        marginLeft: 3,

                                                        height: 20,
                                                        paddingLeft: 5,
                                                        paddingRight: 5
                                                    }}
                                                >
                                                    <Text style={[{ color: item.CheckedResultCode == 3 ? '#666666' : item.CheckedResultCode == 1 ? '#FF574A' : '#26C19A', textAlign: 'center', fontSize: 11 }]}>{item.CheckedResult}</Text>
                                                </View>
                                            </View>
                                            <View style={[{ alignItems: 'center', flexDirection: 'row', paddingStart: 13, paddingEnd: 13 }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666666', lineHeight: 18 }]}>
                                                    {item.WarningContent}
                                                </SDLText>
                                            </View>
                                            <View style={[{ alignItems: 'center', flexDirection: 'row', paddingStart: 13, justifyContent: 'space-between', paddingEnd: 13, padding: 13 }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={[{ marginLeft: 5, backgroundColor: '#5CA9FF', padding: 2, borderRadius: 3, alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }]}>
                                                        <Text style={[{ color: '#fff', fontSize: 11 }]}>{'核'}</Text>
                                                    </View>
                                                    <SDLText style={[{ color: '#666666', marginLeft: 5, maxWidth: (SCREEN_WIDTH - 30) / 2 }]}>{item.CheckedUser ? item.CheckedUser : '---'}</SDLText>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image style={{ width: 16, height: 16, marginRight: 3 }} source={require('../../../images/ic_tab_statistics_selected.png')} />
                                                    <SDLText fontType={'normal'} style={[{ color: '#666666' }]}>
                                                        {item.WarningTime}
                                                    </SDLText>
                                                </View>
                                            </View>
                                        </View>
                                    </Touchable>
                                );
                            }}
                            data={this.props.alarmAnalyListData}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
                    <TouchableOpacity
                        style={{ position: 'absolute', bottom: 0, flex: 1, alignSelf: 'center', width: SCREEN_WIDTH - 30, height: 44, borderRadius: 5, backgroundColor: '#4DA9FF', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ color: '#fff' }}>批量核实</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#f2f2f2'
    }
});
