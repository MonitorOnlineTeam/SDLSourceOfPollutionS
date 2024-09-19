import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';

/**
 * 超标记录
 */
@connect(({ pointDetails }) => ({
    overDataListData: pointDetails.overDataListData,
    overDataListResult: pointDetails.overDataListResult,
    overDataIndex: pointDetails.overDataIndex,
    overDataDataType: pointDetails.overDataDataType,
    overDataTotal: pointDetails.overDataTotal
}))
export default class OverData extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '超标数据',
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
                console.log('endMoment = ', endMoment);
                console.log('startMoment = ', startMoment);
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        overDataIndex: 1,
                        overDataTotal: 0,
                        overDataBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        overDataEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );
                // this.props.dispatch(createAction('pointDetails/getOverDataList')({ setListData: this.list.setListData }));
                // this.list.onRefresh();
                if (this.props.overDataListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    onRefresh = index => {
        this.props.dispatch(createAction('pointDetails/updateState')({ overDataIndex: index, overDataTotal: 0 }));
        this.props.dispatch(createAction('pointDetails/getOverDataList')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        const beginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        const endTime = moment().format('YYYY-MM-DD 23:59:59');

        this.props.dispatch(createAction('pointDetails/updateState')({ overDataIndex: 1, overDataTotal: 0, overDataBeginTime: beginTime, overDataEndTime: endTime, overDataListResult: { status: -1 } }));
        this.props.dispatch(createAction('pointDetails/getOverDataList')({}));
    };

    /**
     *  RealTimeData   实时数据
        MinuteData  分钟数据
        HourData  小时数据
        DayData  日数据
     *  */
    getDataTypeSelectOption = () => {
        // const dataArr = [{ name: '实时数据', code: 'RealTimeData' }, { name: '分钟数据', code: 'MinuteData' }, { name: '小时数据', code: 'HourData' }, { name: '日数据', code: 'DayData' }];
        const dataArr = [{ name: '小时数据', code: 'HourData' }, { name: '日数据', code: 'DayData' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择时间类型',
            defaultCode: 'HourData',
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        overDataDataType: item.code
                    })
                );
                // this.props.dispatch(createAction('pointDetails/getOverDataList')({ setListData: this.list.setListData }));
                // this.list.onRefresh();
                if (this.props.overDataListResult.status == 200) {
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

    getTimeStr = item => {
        let time = SentencedToEmpty(item, ['OverTime'], '');
        switch (this.props.overDataDataType) {
            case 'RealTimeData':
                if (time == '') {
                    return '缺少超标时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'MinuteData':
                if (time == '') {
                    return '缺少超标时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('MM-DD HH:mm');
                break;
            case 'HourData':
                if (time == '') {
                    return '缺少超标时间';
                    // return moment().format('MM-DD');
                }
                return moment(time).format('MM-DD HH:mm');
                break;
            case 'DayData':
                if (time == '') {
                    return '缺少超标时间';
                    // return moment().format('YYYY-MM-DD');
                }
                return moment(time).format('YYYY-MM-DD');
                break;
            default:
                if (time == '') {
                    return '缺少超标时间';
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
                    <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'标准'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'倍数'}
                        </SDLText>
                    </View>
                </View>
                <StatusPage
                    status={this.props.overDataListResult.status}
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
                                return this.props.overDataListData.length < this.props.overDataTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('pointDetails/updateState')({ overDataIndex: index }));
                                this.props.dispatch(createAction('pointDetails/getOverDataList')({ setListData: this.list.setListData }));
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Touchable onPress={() => this._onItemClick(item)}>
                                        <View style={[{ width: SCREEN_WIDTH, minHeight: 46, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                                            <View style={[{ height: 45, flex: 6, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {this.getTimeStr(item)}
                                                </SDLText>
                                            </View>
                                            <View style={[{ minHeight: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['PollutantCode'], '未知污染物')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['MonitorValue'], '--')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['StandValue'], '--')}
                                                </SDLText>
                                            </View>
                                            <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                                <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                    {SentencedToEmpty(item, ['OverShoot'], '--')}
                                                </SDLText>
                                            </View>
                                        </View>
                                    </Touchable>
                                );
                            }}
                            data={this.props.overDataListData}
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
