import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../../utils';
import { StatusPagem, SimpleLoadingComponent, Touchable, StatusPage, SDLText, OperationAlertDialog } from '../../../components';
import TextLabel from '../../../pollutionContainers/components/TextLabel';
import MonthBar from '../../components/MonthBar';

const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY.MM';
/**
 * 本月异常
 * @class MonthException
 * @extends {Component}
 */
@connect(({ exceptionModel }) => ({
    ExceptionCalenderDataResult: exceptionModel.ExceptionCalenderDataResult,
    ExceptionCalenderData: exceptionModel.ExceptionCalenderData,
    StatisticsDataStr: exceptionModel.StatisticsDataStr,
    ExceptionTasks: exceptionModel.ExceptionTasks,
    FuturePointInfo: exceptionModel.FuturePointInfo,
    CalendarDate: exceptionModel.CalendarDate,
    seletedDate: exceptionModel.seletedDate
}))
export default class MonthException extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '运维日历',
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    <Icon name="ios-information-circle-outline" style={[{ width: 18, marginRight: 16, fontSize: 20, height: 22, color: 'white' }]} />
                </TouchableOpacity>
            )
        });

    constructor(props) {
        super(props);
        this.state = {
            showDate: moment(this.props.seletedDate).format(formatStr)
        };
        props.navigation.setParams({
            navigatePress: () => {
                this.refs.doAlert.show();
            }
        });
    }

    componentDidMount() {
        this.props.dispatch(createAction('exceptionModel/updateState')({ CalendarDate: moment(this.props.seletedDate).format('YYYY-MM-01 HH:mm:ss') }));
        this.props.dispatch(createAction('exceptionModel/getMobileCalendarInfo')({}));
        this.props.dispatch(createAction('exceptionModel/getTaskInfoByDate')({}));
    }

    onDateChange = (date, type) => {
        console.log('date = ', date, ',type = ', type);
        this.props.dispatch(createAction('exceptionModel/updateState')({ seletedDate: date.format('YYYY-MM-DD HH:mm:ss'), CalendarDate: date.format('YYYY-MM-01 HH:mm:ss') }));
        this.props.dispatch(createAction('exceptionModel/getTaskInfoByDate')({}));
    };
    onSwipe = gestureName => {
        switch (gestureName) {
            case SWIPE_LEFT:
                this.nextDateFun();
                break;
            case SWIPE_RIGHT:
                this.previousDateFun();
                break;
        }
    };

    previousDateFun = () => {
        let previousDate = moment(this.props.CalendarDate).subtract(1, 'months');
        let showDate = previousDate.format(formatStr);
        let newCalendarDate = previousDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressPrevious();
        this.props.dispatch(createAction('exceptionModel/updateState')({ CalendarDate: newCalendarDate, seletedDate: newCalendarDate }));
        this.props.dispatch(createAction('exceptionModel/getMobileCalendarInfo')({}));
        this.props.dispatch(createAction('exceptionModel/getTaskInfoByDate')({}));
    };

    nextDateFun = () => {
        let nextDate = moment(this.props.CalendarDate).add(1, 'months');
        let showDate = nextDate.format(formatStr);
        let newCalendarDate = nextDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressNext();
        this.props.dispatch(createAction('exceptionModel/updateState')({ CalendarDate: newCalendarDate, seletedDate: newCalendarDate }));
        this.props.dispatch(createAction('exceptionModel/getMobileCalendarInfo')({}));
        this.props.dispatch(createAction('exceptionModel/getTaskInfoByDate')({}));
    };

    renderItem = ({ item, index }) => {
        if (this.props.ExceptionTasks && this.props.ExceptionTasks.length > 0) {
            return (
                <Touchable style={[{ minHeight: 103, width: SCREEN_WIDTH, backgroundColor: '#fff' }]}>
                    <View style={[{ minHeight: 103, width: SCREEN_WIDTH, padding: 15 }]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#fc953f', marginHorizontal: 8 }]} />
                            <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                {`${SentencedToEmpty(item, ['EnterName'], '企业名称')}-${SentencedToEmpty(item, ['PointName'], '排口名称')}`}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', marginLeft: 22, marginTop: 20 }]}>{this.renderTag(index, SentencedToEmpty(item, ['ExceptionTypeText'], ''))}</View>
                        <SDLText fontType={'normal'} style={[{ color: '#666', marginLeft: 22, marginTop: 10 }]}>
                            {SentencedToEmpty(item, ['TaskTypeName'], '未知任务类型')}
                        </SDLText>
                    </View>
                </Touchable>
            );
        } else {
            return (
                <Touchable style={[{ minHeight: 103, width: SCREEN_WIDTH, backgroundColor: '#fff' }]}>
                    <View style={[{ minHeight: 103, width: SCREEN_WIDTH, padding: 15 }]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#99d55d', marginHorizontal: 8 }]} />
                            <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                                {`${SentencedToEmpty(item, ['EntName'], '企业名称')}-${SentencedToEmpty(item, ['PointName'], '排口名称')}`}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', marginLeft: 22, marginTop: 20, flexWrap: 'wrap' }]}>{this.renderFutureTaskTag(index, SentencedToEmpty(item, ['Child'], []))}</View>
                    </View>
                </Touchable>
            );
        }
    };

    renderTag = (index, text) => {
        let strArray = text.split(',');
        let renderView = [];
        if (strArray.length > 0) {
            strArray.map((item, key) => {
                renderView.push(<TextLabel key={`${index}_${key}`} text={item} color={'#ff5959'} />);
            });
        }
        return renderView;
    };

    renderFutureTaskTag = (index, arry) => {
        let renderView = [];
        arry.map((item, key) => {
            renderView.push(<TextLabel key={`${index}_${key}`} text={item.TypeName} color={'#99d55d'} />);
        });
        return renderView;
    };

    ListEmptyComponent = () => {
        return <View style={{ height: 96, alignItems: 'center', justifyContent: 'center' }} />;
    };

    render() {
        console.log('this.props.ExceptionCalenderDataResult = ', this.props.ExceptionCalenderDataResult);
        console.log('this.props.OperationOverTime = ', SentencedToEmpty(this.props.ExceptionCalenderDataResult, ['data', 'Datas', 'OperationOverTime'], '--'));
        var options = {
            headTitle: '说明',
            innersHeight: 280,
            messText: `1、日历上橙色点表示当日存在异常任务，蓝色表示当日存在正常执行的任务，绿色点表示未来某日存在运维任务；\n2、报警响应异常：监测点位设备第一次出现数据异常报警至响应报警超过${SentencedToEmpty(
                this.props.ExceptionCalenderDataResult,
                ['data', 'Datas', 'OperationOverTime'],
                '--'
            )}个小时；\n3、打卡异常：执行任务时打卡，超过打卡范围(${SentencedToEmpty(this.props.ExceptionCalenderDataResult, ['data', 'Datas', 'OperationRadius'], '--')}米)；\n4、工作超时：任务单生成至结束任务超过${SentencedToEmpty(
                this.props.ExceptionCalenderDataResult,
                ['data', 'Datas', 'PostTaskOverTime'],
                '--'
            )}个小时。`,
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '知道了',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: this.confirm
                }
            ]
        };
        // console.log('futureTimeList = ', SentencedToEmpty(this.props.ExceptionCalenderData, ['futureTimeList'], []));
        return (
            <StatusPage>
                <MonthBar
                    timeStr={`${this.state.showDate}`}
                    onPrePress={() => {
                        this.previousDateFun();
                    }}
                    onNextPress={() => {
                        this.nextDateFun();
                    }}
                />

                <View style={{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }} />

                <View style={[{ backgroundColor: '#fff' }]}>
                    <CalendarPicker
                        ref={ref => (this.CalendarPicker = ref)}
                        showHeader={false}
                        startFromMonday={true}
                        selectedStartDate={this.props.seletedDate}
                        // selectedEndDate={this.state.selectedEndDate}
                        initialDate={this.props.seletedDate}
                        weekdays={['一', '二', '三', '四', '五', '六', '日']}
                        months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                        previousTitle={require('../../../images/calenderLeft.png')}
                        nextTitle={require('../../../images/calendarRight.png')}
                        // minDate={minDate}
                        // maxDate={maxDate}
                        todayBackgroundColor="#EEE685"
                        selectedDayColor="#dff0ff"
                        selectedDayTextColor="#333333"
                        onDateChange={this.onDateChange}
                        onSwipe={this.onSwipe}
                        customDotDatesStyles={this.props.ExceptionCalenderData}
                    />
                </View>
                {this.props.StatisticsDataStr == '' ? (
                    <View
                        style={[
                            {
                                minHeight: 45,
                                width: SCREEN_WIDTH,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                paddingVertical: 15,
                                borderTopWidth: 10,
                                borderTopColor: '#f2f2f2',
                                borderBottomColor: '#d9d9d9',
                                borderBottomWidth: 0.5,
                                backgroundColor: '#fff'
                            }
                        ]}
                    >
                        <Image style={[{ height: 18, width: 18, marginHorizontal: 5 }]} source={require('../../../images/daishenpi.png')} />
                        <SDLText fontType={'normal'} style={[{ color: '#666' }]}>
                            {'今日没有运维任务'}
                        </SDLText>
                    </View>
                ) : (
                    <View
                        style={[
                            {
                                minHeight: 45,
                                width: SCREEN_WIDTH,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                paddingVertical: 15,
                                borderTopWidth: 10,
                                borderTopColor: '#f2f2f2',
                                borderBottomColor: '#d9d9d9',
                                borderBottomWidth: 0.5,
                                backgroundColor: '#fff'
                            }
                        ]}
                    >
                        <Image style={[{ height: 18, width: 18, marginHorizontal: 5 }]} source={require('../../../images/daishenpi.png')} />
                        <SDLText fontType={'normal'} style={[{ color: '#666', width: SCREEN_WIDTH - 48 }]}>
                            {this.props.StatisticsDataStr}
                        </SDLText>
                    </View>
                )}
                <FlatList
                    keyExtractor={(item, index) => index + ''}
                    renderItem={this.renderItem}
                    data={this.props.ExceptionTasks && this.props.ExceptionTasks.length > 0 ? this.props.ExceptionTasks : this.props.FuturePointInfo}
                    ListEmptyComponent={() => {
                        return this.ListEmptyComponent();
                    }}
                />
                <OperationAlertDialog options={options} ref="doAlert" />
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
