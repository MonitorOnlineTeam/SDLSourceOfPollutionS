/*
 * @Description: 
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2024-05-08 18:21:09
 * @LastEditTime: 2025-04-10 15:24:08
 * @FilePath: /SDLMainProject37/app/pOperationContainers/operationPlan/DailyPlan.js
 */
import { Animated, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../config/globalsize'
import moment from 'moment'
import CalendarPicker from 'react-native-calendar-picker'
import ImageViewer from 'react-native-image-zoom-viewer'
import { SentencedToEmpty, createAction } from '../../utils'
import { connect } from 'react-redux'
import { StatusPage } from '../../components'

const calenderComponentHeight = 260;
const SWIPE_LEFT = 'SWIPE_LEFT';
const SWIPE_RIGHT = 'SWIPE_RIGHT';
const formatStr = 'YYYY-MM-DD';

@connect(({ operationPlanModel }) => ({
    calenderCurrentMonth: operationPlanModel.calenderCurrentMonth,
    calenderSelectedDate: operationPlanModel.calenderSelectedDate,

    calenderData: operationPlanModel.calenderData,
    appOperationPlanCalendarDateListResult: operationPlanModel.appOperationPlanCalendarDateListResult,
    calenderDataObject: operationPlanModel.calenderDataObject,
}))
export default class DailyPlan extends Component {

    static defaultProps = {
        calenderCurrentMonth: moment().format("YYYY-MM-DD")
    }

    constructor(props) {
        super(props);
        this.state = {
            calendarHeight: new Animated.Value(calenderComponentHeight), // 0-300 calenderComponentHeight
            panResponder: {},
            hideCalendar: false,
            calenderOpacity: 1,
            startPosition: 0,
            selectedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            // listType: 0,
            // largImage: [],
            // index: 0,
            // modalVisible: false
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        this.props.dispatch(
            createAction('operationPlanModel/updateState')({
                calenderSelectedDate: moment().format('YYYY-MM-DD'),
                calenderCurrentMonth: moment().format('YYYY-MM-DD'),
                appOperationPlanCalendarDateListResult: { status: -1 }
            })
        );
        this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanCalendarDateList')({
            params: {
                calendarDate: moment().format('YYYY-MM-DD')
            }
        }));
    }

    getMonthAndDate = () => {
        if (this.props.calenderSelectedDate == '') {
            return moment(this.props.calenderCurrentMonth).format('MM')
        } else {
            return moment(this.props.calenderSelectedDate).format('MM.DD')
        }
    }

    showCalenderFun = (nextFun = () => { }) => {
        console.log('calendarHeight = ', this.state.calendarHeight._value);
        if (Math.round(this.state.calendarHeight._value) == calenderComponentHeight) {
            this.setState({ hideCalendar: true, calenderOpacity: 0 }, () => {
                nextFun();
            });
        } else if (Math.round(this.state.calendarHeight._value) == 0) {
            this.setState({ hideCalendar: false }, () => {
                nextFun();
            });
        }
    };

    getText = () => {
        if (this.props.calenderSelectedDate == '') {
            return '';
        } else {
            const data = SentencedToEmpty(this.props
                , ['calenderDataObject', this.props.calenderSelectedDate], {})

            console.log('getText data = ', data);
            return `${this.props.calenderSelectedDate}计划运维废气点位${SentencedToEmpty(data, ['fqPointCount'], 0)}个，废水点位${SentencedToEmpty(data, ['fsPointCount'], 0)}个`;
        }
    }

    getList = () => {
        return SentencedToEmpty(this.props
            , ['calenderDataObject'
                , this.props.calenderSelectedDate
                , 'taskList'], [])
    }

    getTag = (item) => {
        return (<View
            style={[{
                height: 16, width: 45
                , backgroundColor: '#A7CFFC'
                , justifyContent: 'center'
                , alignItems: 'center'
                , marginLeft: 5
            }]}
        >
            <Text
                style={[{
                    fontSize: 10, color: '#FFFFFF',
                }]}
            >{item}</Text>
        </View>);
    }

    renderLineItem = (item, index, length = 0) => {
        return (<TouchableOpacity>
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 50,
                    paddingVertical: 10, paddingHorizontal: 22,
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff'
                }]}
            >
                <View
                    style={[{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }]}
                >
                    <Text
                        style={[{
                            fontSize: 14, color: '#000028',
                        }]}
                    >{SentencedToEmpty(item, ['PointName'], '-')}</Text>
                    {
                        SentencedToEmpty(item, ['RecordTypeName'], []).map((item, index) => {
                            return this.getTag(item)
                        })
                    }
                </View>
                <View
                    style={[{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }]}
                >
                    <Image
                        style={[{
                            width: 10, height: 10,
                        }]}
                        source={require('../../images/icon_location.png')}
                    />
                    <Text
                        style={[{
                            fontSize: 11, color: '#666666',
                        }]}
                    >
                        {SentencedToEmpty(item, ['EntName'], '-')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>);
    };

    nextDateFun = () => {
        let nextDate = moment(this.props.calenderCurrentMonth).add(1, 'months');
        let selectedDate = nextDate.format("YYYY-MM-01");
        if (nextDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = nextDate.format(formatStr);
        let newCalendarDate = nextDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressNext();
        this.props.dispatch(
            createAction('operationPlanModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: nextDate,
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanCalendarDateList')({
            params: {
                calendarDate: nextDate.format('YYYY-MM-DD')
            }
        }));
    }

    previousDateFun = () => {
        let previousDate = moment(this.props.calenderCurrentMonth).subtract(1, 'months');
        let selectedDate = previousDate.format("YYYY-MM-01");
        if (previousDate.format('MM') == moment().format('MM')) {
            selectedDate = moment().format('YYYY-MM-DD');
        }
        let showDate = previousDate.format(formatStr);
        let newCalendarDate = previousDate.format('YYYY-MM-01 HH:mm:ss');
        this.setState({ showDate });
        this.CalendarPicker.handleOnPressPrevious();
        this.props.dispatch(
            createAction('operationPlanModel/updateState')({
                calenderSelectedDate: selectedDate,
                calenderCurrentMonth: previousDate
            })
        );
        this.CalendarPicker.resetSelections();
        this.props.dispatch(createAction('operationPlanModel/getAppOperationPlanCalendarDateList')({
            params: {
                calendarDate: previousDate.format('YYYY-MM-DD')
            }
        }));
    }

    onDateChange = (date) => {
        this.props.dispatch(createAction('operationPlanModel/updateState')({
            calenderSelectedDate: date.format('YYYY-MM-DD')
        }));
    }

    render() {
        return (<StatusPage
            backRef={true}
            status={SentencedToEmpty(this.props, ['appOperationPlanCalendarDateListResult', 'status'], 200)}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                console.log('重新刷新');
                this.refresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                console.log('错误操作回调');
                this.refresh();
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    width: SCREEN_WIDTH,
                    // marginTop: 6,
                     backgroundColor: '#ffffff'
                    , alignItems: 'center'
                }]}>
                    <View style={[{
                        width: SCREEN_WIDTH - 20, height: 40
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
                            <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'flex-end' }]}>
                                <Image style={[{ tintColor: '#666666', width: 20, height: 20 }]} source={require('../../images/ic_new_left.png')} />
                            </View>
                        </TouchableOpacity> : null}
                        {!this.state.hideCalendar ? <TouchableOpacity
                            onPress={() => {
                                this.nextDateFun();
                            }}
                        >
                            <View style={[{ width: 64, height: 40, justifyContent: 'flex-end', alignItems: 'center' }]}>
                                <Image style={[{ tintColor: '#666666', width: 20, height: 20 }]} source={require('../../images/ic_new_right.png')} />
                            </View>
                        </TouchableOpacity> : null}
                    </View>

                    {this.state.hideCalendar ? null : <View style={[{ opacity: this.state.calenderOpacity, width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#EAEAEA' }]}></View>}
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 20,
                        }]}
                    >
                        <Animated.View style={[{ height: this.state.calendarHeight, width: SCREEN_WIDTH - 20, }]}>
                            {this.state.hideCalendar ? null : <CalendarPicker
                                ref={ref => (this.CalendarPicker = ref)}
                                showHeader={false}
                                startFromMonday={true}
                                selectedStartDate={this.props.calenderSelectedDate}
                                // selectedEndDate={this.state.selectedEndDate}
                                initialDate={this.props.calenderSelectedDate}
                                weekdays={['一', '二', '三', '四', '五', '六', '日']}
                                months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}
                                // previousTitle={require('../../images/calenderLeft.png')}
                                // nextTitle={require('../../images/calendarRight.png')}
                                previousTitle={require('../../images/ic_new_left.png')}
                                nextTitle={require('../../images/ic_new_right.png')}
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
                        <View style={[{
                            height: 16, width: SCREEN_WIDTH - 20,
                        }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('onPress calendarHeight = ', this.state.calendarHeight._value);
                                    if (Math.round(this.state.calendarHeight._value) == 0) {
                                        this.showCalenderFun(() => {
                                            Animated.spring(
                                                this.state.calendarHeight, // Auto-multiplexed
                                                { toValue: calenderComponentHeight } // Back to zero
                                            ).start(() => {
                                                this.setState({ calenderOpacity: 1 });
                                            });
                                        });
                                    } else if (Math.round(this.state.calendarHeight._value) == calenderComponentHeight) {
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
                                <View style={[{ width: SCREEN_WIDTH - 20, flexDirection: 'row', alignItems: 'center' }]}>
                                    <View style={[{ flex: 1, height: 1, backgroundColor: '#EAEAEA' }]}></View>
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
                        </View>
                    </View>
                </View>
                <Animated.View
                    style={[{ width: SCREEN_WIDTH, flex: 1, marginBottom: 10 }]}
                >

                    {
                        <View style={[{
                            width: SCREEN_WIDTH
                            , backgroundColor: '#ffffff'
                            , height: 40, justifyContent: 'center'
                        }]}>
                            <View style={[{
                                width: SCREEN_WIDTH - 40, height: 49
                                , flexDirection: 'row'
                                , marginLeft: 22
                            }]}>
                                <Text
                                    numberOfLines={2}
                                    style={[{
                                        width: SCREEN_WIDTH - 40,
                                        fontSize: 11, color: '#666666'
                                        , marginTop: 17, lineHeight: 16
                                    }]}>{
                                        `${this.getText()}`
                                    }</Text>
                            </View>
                        </View>
                    }

                    {
                        SentencedToEmpty(this.props
                            , ['calenderDataObject'
                                , this.props.calenderSelectedDate
                                , 'taskList'], []).length == 0
                            ? null
                            : <View style={[{
                                width: SCREEN_WIDTH
                                , alignItems: 'center', flex: 1
                            }]}>
                                <ScrollView style={[{
                                    width: SCREEN_WIDTH, flex: 1
                                }]}>
                                    {
                                        this.getList().map((item, index) => {
                                            return this.renderLineItem(item, index, this.getList().length);
                                        })
                                    }
                                    <View
                                        style={[{
                                            height: 10, width: SCREEN_WIDTH
                                            , backgroundColor: '#ffffff'
                                        }]}
                                    />
                                </ScrollView>
                            </View>
                    }
                </Animated.View>
            </View>
        </StatusPage>
        )
    }
}