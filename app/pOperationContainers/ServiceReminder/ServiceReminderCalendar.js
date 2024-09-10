/*
 * @Description: 服务提醒日历
 * @LastEditors: hxf
 * @Date: 2024-04-11 14:36:33
 * @LastEditTime: 2024-06-03 14:16:50
 * @FilePath: /SDLMainProject37/app/pOperationContainers/ServiceReminder/ServiceReminderCalendar.js
 */
import { Animated, Image, PanResponder, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import moment from 'moment';
import { connect } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker';

import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import color from '../../components/StatusPages/color';
import { StatusPage } from '../../components';
const calenderComponentHeight = 300;
const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY-MM-DD';

@connect(({ CTServiceReminderModel, CTModel }) => ({
    serviceReminderListResult: CTServiceReminderModel.serviceReminderListResult,
    calenderData: CTServiceReminderModel.calenderData,
    ctSignInHistoryListResult: CTModel.ctSignInHistoryListResult,
    calenderCurrentMonth: CTServiceReminderModel.calenderCurrentMonth,
    recordDate: CTServiceReminderModel.recordDate,
    calenderDataObject: CTServiceReminderModel.calenderDataObject
}))
export default class ServiceReminderCalendar extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '服务提醒',
            headerRight: (
                <TouchableOpacity
                    style={{ width: 44, height: 40, justifyContent: 'center' }}
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    <View
                        style={[{
                            width: 44, height: 40,
                            alignItems: 'flex-end', justifyContent: 'center',
                        }]}
                    >
                        <Image
                            style={[{
                                width: 13, height: 13
                                , marginRight: 15
                            }]}
                            source={require('../../images/jiarecord.png')}
                        />
                    </View>
                </TouchableOpacity>
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            calendarHeight: new Animated.Value(calenderComponentHeight), // 0-300 calenderComponentHeight
            panResponder: {},
            hideCalendar: false,
            calenderOpacity: 1,
            startPosition: 0,
            selectedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            listType: 0,
        };
        props.navigation.setParams({
            navigatePress: () => {
                this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                    addServiceReminderParams: {
                        // "id": "", // 主表ID  如果是修改一定要传
                        // "ID": "cba5bf52-3f4f-4944-93dc-2bedb18dcd66",
                        "ProjectID": "", // 项目ID
                        "PointId": "", // 监测点ID
                        "ServiceId": "", // 服务内容ID 1  72小时调试检测    2 验收
                        "RemindMsg": "", // 服务提醒说明
                        "ExpectedTime": "", // 预计开始时间
                        "serviceReminderInfoList": [//  子表

                            {
                                "MType": "1", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "reminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-2"  // 开始提醒枚举
                            }
                            , {
                                "MType": "2", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "ReminderTime": "2024-04-14 14:30", // 提醒时间一定要传 计算好
                                "EModel": "-2"  // 开始提醒枚举
                            }
                            , {
                                "MType": "3", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "ReminderTime": "2024-04-18 14:15", // 提醒时间一定要传 计算好
                                "EModel": "-1"  // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
                            }
                            , {
                                "MType": "4", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
                                // "ReminderTime": "2024-04-18 12:30", // 提醒时间一定要传 计算好
                                "EModel": "-1"  // 开始提醒枚举
                            }
                        ]
                    }
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'ServiceReminderDetailEditor'
                    , params: {

                    }
                }));
            }
        });
    }

    statusPageOnRefresh = () => {
        // 提醒服务列表
        this.props.dispatch(
            createAction('CTServiceReminderModel/updateState')
                ({
                    serviceReminderListResult: { status: -1 },
                }));
        this.props.dispatch(
            createAction('CTServiceReminderModel/getServiceReminderList')
                ({}));
    }

    componentDidMount() {
        // 提醒服务列表
        this.props.dispatch(
            createAction('CTServiceReminderModel/updateState')
                ({
                    serviceReminderListResult: { status: -1 },
                    // recordDate: moment().format('YYYY-MM-DD 01:00')
                    recordDate: moment().format('YYYY-MM-DD'),
                    calenderCurrentMonth: moment().format('YYYY-MM-DD')

                }));
        this.props.dispatch(
            createAction('CTServiceReminderModel/getServiceReminderList')
                ({}));

        let panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //是否成为响应者
                return true;
            },
            onPanResponderGrant: () => {
                //开始手势操作
                // console.log('this.state.calendarHeight._value = ', this.state.calendarHeight._value);
                // console.log('this.state.calendarHeight._offset = ', this.state.calendarHeight._offset);
                //是Animated的方法
                this.setState({ startPosition: this.state.calendarHeight._offset });
                this.state.calendarHeight.setOffset(this.state.calendarHeight._offset);
            },
            onPanResponderMove: (e, gestureState) => {
                let newData = this.state.calendarHeight;
                let abc = -(gestureState.y0 - gestureState.moveY);
                let realValue = 0;
                if (abc > 0) {
                    realValue = -calenderComponentHeight + abc;
                } else {
                    if (this.state.startPosition >= 0) {
                        realValue = abc;
                    } else {
                        realValue = newData._offset + abc;
                        if (realValue > -calenderComponentHeight) {
                            realValue = calenderComponentHeight;
                        } else {
                            realValue = newData._offset + abc;
                        }
                    }
                }
                newData.setOffset(realValue);
                if (newData._offset == -calenderComponentHeight && abc < 0) {
                } else if (realValue <= 0) {
                    this.setState({
                        calendarHeight: newData
                    });
                }
            },
            onPanResponderRelease: () => {
                let newData = this.state.calendarHeight;
                if (this.state.calendarHeight._offset < -200) {
                    newData.setOffset(-newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: true
                    });
                } else {
                    newData.setOffset(calenderComponentHeight - newData._value);
                    this.setState({
                        calendarHeight: newData,
                        hideCalendar: false
                    });
                }
            }
        });
        this.setState({ panResponder: panResponder });
    }

    getExpectedTimeStr = (item) => {
        const ExpectedTime = SentencedToEmpty(item, ['ExpectedTime'], '');
        if (ExpectedTime == '') {
            return 'XX:XX';
        } else {
            let ExpectedTimeMoment = moment(ExpectedTime);
            if (ExpectedTimeMoment.isValid()) {
                return ExpectedTimeMoment.format('HH:mm');
            } else {
                return 'XX:XX';
            }
        }
    }

    renderLineItem = (item, index, length = 0) => {
        console.log('item = ', item);
        return (
            <TouchableOpacity
                onPress={() => {
                    // detailID
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        detailID: item.ID,
                        serviceReminderViewResult: { status: -1 }
                    }))
                    this.props.dispatch(createAction('CTServiceReminderModel/getServiceReminderView')({}));
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'ServiceReminderDetailEditor'
                        , params: {

                        }
                    }));
                }}
            >
                <View style={[{
                    width: SCREEN_WIDTH - 20,
                    height: 114,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    justifyContent: 'space-around',
                    marginTop: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                }]}>
                    <Text
                        style={[{
                            width: SCREEN_WIDTH - 44,
                            fontSize: 14, color: '#333333'
                        }]}
                    >
                        {`${SentencedToEmpty(item, ['ServiceName'], '-----')}`}
                    </Text>
                    <Text
                        style={[{
                            width: SCREEN_WIDTH - 44,
                            fontSize: 14, color: '#333333'
                        }]}
                    >
                        {`${SentencedToEmpty(item, ['EntName'], '-----')}`}
                    </Text>
                    <Text
                        style={[{
                            width: SCREEN_WIDTH - 44,
                            fontSize: 14, color: '#333333'
                        }]}
                    >
                        {`${SentencedToEmpty(item, ['PointName'], '-----')}`}
                    </Text>
                    <Text
                        style={[{
                            width: SCREEN_WIDTH - 44,
                            fontSize: 14, color: '#333333'
                        }]}
                    >
                        {`预计开始执行时间：${this.getExpectedTimeStr(item)}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    showCalenderFun = (nextFun = () => { }) => {
        if (this.state.calendarHeight._value == calenderComponentHeight) {
            this.setState({ hideCalendar: true, calenderOpacity: 0 }, () => {
                nextFun();
            });
        } else if (this.state.calendarHeight._value == 0) {
            this.setState({ hideCalendar: false }, () => {
                nextFun();
            });
        }
    };

    onDateChange = (date) => {
        console.log('onDateChange date = ', date);
        this.props.dispatch(
            createAction('CTServiceReminderModel/updateState')
                ({
                    // recordDate: date.format('YYYY-MM-DD 01:00')
                    recordDate: date.format('YYYY-MM-DD')
                }));
        this.props.dispatch(
            createAction('CTServiceReminderModel/getServiceReminderList')
                ({

                }));
    }
    onSwipe = (gestureName, gestureState) => {
        switch (gestureName) {
            case SWIPE_LEFT:
                this.nextDateFun();
                break;
            case SWIPE_RIGHT:
                this.previousDateFun();
                break;
        }
    };

    nextDateFun = () => {
        let nextDate = moment(this.props.calenderCurrentMonth).add(1, 'months');
        let selectedDate = nextDate.format("YYYY-MM-01");
        if (nextDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = nextDate.format(formatStr);
        // let newCalendarDate = nextDate.format('YYYY-MM-01 HH:mm:ss');
        let newCalendarDate = nextDate.format('YYYY-MM-01');
        this.CalendarPicker.handleOnPressNext();
        this.props.dispatch(
            createAction('CTServiceReminderModel/updateState')
                ({
                    serviceReminderListResult: { status: -1 },
                    recordDate: selectedDate,
                    calenderCurrentMonth: newCalendarDate

                }));
        this.CalendarPicker.resetSelections();
        this.props.dispatch(
            createAction('CTServiceReminderModel/getServiceReminderList')
                ({}));
    }

    previousDateFun = () => {
        let previousDate = moment(this.props.calenderCurrentMonth).subtract(1, 'months');
        let selectedDate = previousDate.format("YYYY-MM-01");
        if (previousDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = previousDate.format(formatStr);
        // let newCalendarDate = previousDate.format('YYYY-MM-01 HH:mm:ss');
        let newCalendarDate = previousDate.format('YYYY-MM-01');
        this.CalendarPicker.handleOnPressPrevious();
        this.props.dispatch(
            createAction('CTServiceReminderModel/updateState')
                ({
                    serviceReminderListResult: { status: -1 },
                    recordDate: selectedDate,
                    calenderCurrentMonth: newCalendarDate

                }));
        this.CalendarPicker.resetSelections();
        this.props.dispatch(
            createAction('CTServiceReminderModel/getServiceReminderList')
                ({}));
    }

    getMonthAndDate = () => {
        if (this.props.recordDate == '') {
            return moment(this.props.calenderCurrentMonth).format('MM')
        } else {
            return moment(this.props.recordDate).format('MM.DD')
        }
    }


    getList = () => {
        if (this.props.recordDate == '') {
            return [];
        } else {
            console.log('getList = ', this.props);
            console.log(this.props.recordDate, ' = ', SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.recordDate], []));
            return SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.recordDate], [])
        }
    }

    render() {
        return (<StatusPage
            backRef={true}
            status={SentencedToEmpty(this.props, ['serviceReminderListResult', 'status'], 1000)}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.statusPageOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.statusPageOnRefresh();
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH - 20, marginTop: 10
                , marginLeft: 10
                , borderRadius: 5, flex: 1
                , alignItems: 'center'
            }]}>
                <View
                    style={[{
                        width: SCREEN_WIDTH - 20
                        , alignItems: 'center'
                        , backgroundColor: '#ffffff'
                        , borderTopLeftRadius: 5
                        , borderTopRightRadius: 5
                    }]}
                >
                    <View style={[{
                        width: SCREEN_WIDTH - 40, height: 40
                        , flexDirection: 'row', alignItems: 'flex-end'
                        , paddingBottom: 6
                    }]}>
                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`${`${moment(this.props.calenderCurrentMonth).format("YYYY")}年`}`}</Text>
                        <Text style={[{ fontSize: 14, color: '#333333', marginLeft: 16 }]}>{`${this.getMonthAndDate()}`}</Text>
                        <View style={[{ flex: 1 }]} />
                        {!this.state.hideCalendar ? <TouchableOpacity
                            onPress={() => {
                                this.previousDateFun();
                            }}
                        >
                            <View style={[{ marginBottom: 5, width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                                <Image style={[{ width: 12, height: 12 }]} source={require('../../images/calenderLeft.png')} />
                            </View>
                        </TouchableOpacity> : null}
                        {!this.state.hideCalendar ? <TouchableOpacity
                            onPress={() => {
                                this.nextDateFun();
                            }}
                        >
                            <View style={[{ marginBottom: 5, width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'center' }]}>
                                <Image style={[{ width: 12, height: 12 }]} source={require('../../images/calendarRight.png')} />
                            </View>
                        </TouchableOpacity> : null}
                    </View>
                    {this.state.hideCalendar ? null : <View style={[{ opacity: this.state.calenderOpacity, width: SCREEN_WIDTH - 40, height: 1, backgroundColor: '#EAEAEA' }]}></View>}
                    <Animated.View style={[{ height: this.state.calendarHeight, width: SCREEN_WIDTH - 40, }]}>
                        {this.state.hideCalendar ? null : <CalendarPicker
                            ref={ref => (this.CalendarPicker = ref)}
                            showHeader={false}
                            startFromMonday={true}
                            selectedStartDate={this.props.recordDate}
                            // selectedEndDate={this.state.selectedEndDate}
                            initialDate={this.props.recordDate}
                            weekdays={['一', '二', '三', '四', '五', '六', '日']}
                            months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                            previousTitle={require('../../images/calenderLeft.png')}
                            nextTitle={require('../../images/calendarRight.png')}
                            // minDate={minDate}
                            // maxDate={maxDate}
                            todayBackgroundColor="#EEE685"
                            selectedDayColor="#dff0ff"
                            selectedDayTextColor="#333333"
                            onDateChange={this.onDateChange}
                            onSwipe={this.onSwipe}
                            customDotDatesStyles={this.props.calenderData}
                        />}
                    </Animated.View>
                </View>



                <TouchableOpacity
                    onPress={() => {
                        if (this.state.calendarHeight._value == 0) {
                            this.showCalenderFun(() => {
                                Animated.spring(
                                    this.state.calendarHeight, // Auto-multiplexed
                                    { toValue: calenderComponentHeight } // Back to zero
                                ).start(() => {
                                    this.setState({ calenderOpacity: 1 });
                                });
                            });
                        } else if (this.state.calendarHeight._value == calenderComponentHeight) {
                            this.showCalenderFun(() => {
                                Animated.spring(
                                    this.state.calendarHeight, // Auto-multiplexed
                                    { toValue: 0 } // Back to zero
                                ).start(() => {
                                    // this.setState({hideCalendar:true});
                                });
                            });
                        }
                    }}
                >
                    <View style={[{
                        width: SCREEN_WIDTH - 20
                        , flexDirection: 'row'
                        , alignItems: 'center'
                        , backgroundColor: '#ffffff'
                        , paddingHorizontal: 10
                        , borderBottomLeftRadius: 5
                        , borderBottomRightRadius: 5
                    }]}>
                        <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                        {/* <View style={[{width:20,height:8,backgroundColor:'#EAEAEA'}]}></View> */}
                        <Image
                            style={[{ width: 20, height: 8 }]}
                            source={this.state.hideCalendar
                                ? require('../../images/ic_ct_calendar_down.png')
                                : require('../../images/ic_ct_calendar_up.png')
                            }
                        />
                        <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
                    </View>
                </TouchableOpacity>
                <Animated.View
                    style={[{ width: SCREEN_WIDTH - 20, flex: 1, marginBottom: 10 }]}
                // {...this.state.panResponder.panHandlers }
                >
                    <View style={[{
                        width: SCREEN_WIDTH - 20, flex: 1
                    }]}>
                        <ScrollView style={[{
                            width: SCREEN_WIDTH - 20, flex: 1
                        }]}>
                            {
                                this.getList().map((item, index) => {
                                    return this.renderLineItem(item, index, this.getList().length);
                                })
                            }
                        </ScrollView>
                    </View>
                </Animated.View>
            </View >
        </StatusPage>
        );
    }
}