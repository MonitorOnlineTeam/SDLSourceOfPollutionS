import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';

/**
 * 异常数据
 */
@connect(({ alarm }) => ({
    exceptionDataListData: alarm.exceptionDataListData,
    exceptionDataListResult: alarm.exceptionDataListResult,
    exceptionDataIndex: alarm.exceptionDataIndex,
    exceptionDataDataType: alarm.exceptionDataDataType,
    exceptionDataTotal: alarm.exceptionDataTotal
}))
export default class ExceptionData extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '异常数据',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0
        };
    }

    componentDidMount() {
        // this.list.onRefresh();
        this.statusPageOnRefresh();
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
                this.props.dispatch(
                    createAction('alarm/updateState')({
                        exceptionDataIndex: 1,
                        exceptionDataTotal: 0,
                        exceptionDataBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        exceptionDataEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );
                // this.props.dispatch(createAction('alarm/getExceptionDataList')({ setListData: this.list.setListData }));
                // this.list.onRefresh();
                if (this.props.exceptionDataListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    onRefresh = index => {
        this.props.dispatch(createAction('alarm/updateState')({ exceptionDataIndex: index, exceptionDataTotal: 0 }));
        this.props.dispatch(createAction('alarm/getExceptionDataList')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        const exceptionDataBeginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        const exceptionDataEndTime = moment().format('YYYY-MM-DD 23:59:59');

        this.props.dispatch(createAction('alarm/updateState')({ exceptionDataIndex: 1, exceptionDataTotal: 0, exceptionDataBeginTime, exceptionDataEndTime, exceptionDataListResult: { status: -1 } }));
        this.props.dispatch(createAction('alarm/getExceptionDataList')({}));
    };

    /**
     *  RealTimeData   实时数据
        MinuteData  分钟数据
        HourData  小时数据
        DayData  日数据
     *  */
    getDataTypeSelectOption = () => {
        const dataArr = [{ name: '实时数据', code: 'RealTimeData' }, { name: '分钟数据', code: 'MinuteData' }, { name: '小时数据', code: 'HourData' }, { name: '日数据', code: 'DayData' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择时间类型',
            defaultCode: SentencedToEmpty(this.props, ['exceptionDataDataType'], 'HourData'),
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(
                    createAction('alarm/updateState')({
                        exceptionDataDataType: item.code
                    })
                );
                // this.props.dispatch(createAction('alarm/getExceptionDataList')({ setListData: this.list.setListData }));
                // this.list.onRefresh();
                if (this.props.exceptionDataListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    _onItemClick = item => {
        console.log(item);
    };

    getTimeStr = (item, name, placeHolder) => {
        let time = SentencedToEmpty(item, [name], '');
        switch (this.props.exceptionDataDataType) {
            case 'RealTimeData':
                if (time == '') {
                    return placeHolder ? placeHolder : '缺少时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'MinuteData':
                if (time == '') {
                    return placeHolder ? placeHolder : '缺少时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('MM-DD HH:mm');
                break;
            case 'HourData':
                if (time == '') {
                    return placeHolder ? placeHolder : '缺少时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('MM-DD HH:mm');
                break;
            case 'DayData':
                if (time == '') {
                    return placeHolder ? placeHolder : '缺少时间';
                    // return moment().format('YYYY-MM-DD');
                }
                return moment(time).format('YYYY-MM-DD');
                break;
            default:
                if (time == '') {
                    return placeHolder ? placeHolder : '缺少时间';
                }
                return time;
        }
        return '';
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10 }]}>
                    <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                    <SimplePicker option={this.getDataTypeSelectOption()} />
                </View>
                <View style={[{ width: SCREEN_WIDTH, height: 46, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomColor: '#f2f2f2', borderBottomWidth: 1 }]}>
                    <View style={[{ height: 45, flex: 6, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'时间'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'污染物'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'监测数值'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'异常类型'}
                        </SDLText>
                    </View>
                </View>
                <StatusPage
                    status={this.props.exceptionDataListResult.status}
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
                                return this.props.exceptionDataListData.length < this.props.exceptionDataTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('alarm/updateState')({ exceptionDataIndex: index }));
                                this.props.dispatch(createAction('alarm/getExceptionDataList')({ setListData: this.list.setListData }));
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Touchable onPress={() => this._onItemClick(item)}>
                                        <View style={[{ width: SCREEN_WIDTH, height: 46, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                                            <View style={[{ minHeight: 45, flex: 6, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {this.getTimeStr(item, 'ExceptionTime', '缺少异常时间')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['PollutantCode'], '未知污染物')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {item && item.MonitorValue === 0 ? '0.0' : SentencedToEmpty(item, ['MonitorValue'], '--')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText numberOfLines={1} ellipsizeMode={'tail'} fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['ExceptionType'], '--')}
                                                </SDLText>
                                            </View>
                                        </View>
                                    </Touchable>
                                );
                            }}
                            data={this.props.exceptionDataListData}
                            onEndReachedThreshold={0.1}
                        />
                    </View>
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
