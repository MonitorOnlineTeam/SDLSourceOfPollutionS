//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

import SingleWheel from './SingleWheel';
import DateSingleWheel from './DateSingleWheel';
import { hour, minuteOrSecond, year, month, day28, day29, day30, day31 } from '../constant/baseConstant';
import { SentencedToEmpty } from '../../../utils';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

let scaleFactor = 375;
// let calendarHeight = 320*(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let calendarHeight = 200;

// create a component
class WheelPicker extends PureComponent {
    static navigationOptions = {
        tabBarVisible: false
    };

    constructor(props) {
        super(props);
        // let month = props.navigation.state.params.defaultDate.month();
        // let year = props.navigation.state.params.defaultDate.year();
        let month = props.defaultDate.month();
        let year = props.defaultDate.year();
        let _date = day31;
        if (isNaN(month)) {
            month = moment().month();
        }
        if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
            _date = day31;
        } else if (month == 3 || month == 5 || month == 8 || month == 10) {
            _date = day30;
        } else if (month == 1) {
            if (year % 400 == 0) {
                _date = day29;
            } else if (year % 100 != 0 && year % 4 == 0) {
                _date = day29;
            } else {
                _date = day28;
            }
        }
        this.state = {
            result: props.defaultDate,
            date: _date
        };
    }

    static defaultProps = {
        pickerType: 'time', //time date data
        defaultDate: moment(),
        callbackFun: () => { },
        initResult: moment().format('HH:mm'),
        format: 'HH:mm',
    };

    creactePicker = () => {
        let pickerComponentArray = [];
        let _format = SentencedToEmpty(this.props, ['format'], 'HH:mm');
        if (this.props.pickerType == 'time') {
            if (_format.indexOf('YYYY') != -1) {
                let _year = this.props.defaultDate.year();
                if (isNaN(_year)) {
                    _year = moment().year();
                }
                pickerComponentArray.push(
                    <SingleWheel
                        defaultValue={_year}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={3}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.year())) {
                                result = moment();
                            }
                            result.set('year', item.value);
                            this.setState({ result });
                            if (this.dateWheel && typeof this.dateWheel != 'undefined') {
                                this.dateWheel.yearMonthChange(result.year(), result.month(), result.date());
                            }
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}年`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={year}
                    />
                );
            }
            if (_format.indexOf('MM') != -1) {
                let _month = this.props.defaultDate.month();
                if (isNaN(_month)) {
                    _month = moment().month();
                }
                pickerComponentArray.push(
                    <SingleWheel
                        defaultValue={_month}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={4}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.month())) {
                                result = moment();
                            }
                            result.set('month', item.value);
                            this.setState({ result });
                            if (this.dateWheel && typeof this.dateWheel != 'undefined') {
                                this.dateWheel.yearMonthChange(result.year(), result.month(), result.date());
                            }
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}月`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={month}
                    />
                );
            }
            if (_format.indexOf('DD') != -1) {
                let _date = this.props.defaultDate.date();
                if (isNaN(_date)) {
                    _date = moment().date();
                }
                pickerComponentArray.push(
                    <DateSingleWheel
                        ref={ref => (this.dateWheel = ref)}
                        defaultValue={_date}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={5}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.date())) {
                                result = moment();
                            }
                            result.set('date', item.value);
                            this.setState({ result });
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}日`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={this.state.date}
                    />
                );
            }
            if (_format.indexOf('HH') != -1) {
                let _hours = this.props.defaultDate.hours();
                if (isNaN(_hours)) {
                    _hours = moment().hours();
                }
                pickerComponentArray.push(
                    <SingleWheel
                        defaultValue={_hours}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={0}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.hours())) {
                                result = moment();
                            }
                            result.set('hour', item.value);
                            this.setState({ result });
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}时`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={hour}
                    />
                );
            }
            if (_format.indexOf('mm') != -1) {
                let _minute = this.props.defaultDate.minute();
                if (isNaN(_minute)) {
                    _minute = moment().minutes();
                }
                pickerComponentArray.push(
                    <SingleWheel
                        defaultValue={_minute}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={1}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.minute())) {
                                result = moment();
                            }
                            result.set('minute', item.value);
                            this.setState({ result });
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}分`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={minuteOrSecond}
                    />
                );
            }
            if (_format.indexOf('ss') != -1) {
                let _second = this.props.defaultDate.second();
                if (isNaN(_second)) {
                    _second = moment().seconds();
                }
                pickerComponentArray.push(
                    <SingleWheel
                        defaultValue={_second}
                        defaultIndexFun={(dataArray, value) => {
                            return dataArray.findIndex((item, index) => {
                                if (item.value == value) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        }}
                        key={1}
                        callback={item => {
                            let result = moment(this.state.result.format('YYYY-MM-DD HH:mm:ss'));
                            if (isNaN(result.seconds())) {
                                result = moment();
                            }
                            result.set('second', item.value);
                            this.setState({ result });
                            this.props.callbackFun(result);
                        }}
                        getShowValue={(item, selected) => {
                            if (selected) {
                                return `${item.showValue}秒`;
                            } else {
                                return item.showValue;
                            }
                        }}
                        style={{ height: calendarHeight }}
                        dataArray={minuteOrSecond}
                    />
                );
            }
            if (_format == 'HH:00') {
            }
        }
        return (
            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: _format == 'YYYY-MM' ? 'space-around' : _format == 'YYYY-MM-DD' || _format == 'YYYY-MM-DD HH:00' || _format == 'YYYY-MM-DD 00:00' ? 'space-between' : 'center',
                        paddingHorizontal: 21,
                        width: WINDOW_WIDTH
                    }
                ]}
            >
                {pickerComponentArray.map(item => {
                    return item;
                })}
            </View>
        );
    };

    render() {
        return (
            <View style={[styles.container, { height: calendarHeight }]}>
                <View
                    style={[
                        {
                            width: WINDOW_WIDTH,
                            height: calendarHeight,
                            backgroundColor: 'white',
                            alignItems: 'center'
                        }
                    ]}
                >
                    {/* <LinearGradient colors={['#ffffffff', '#ffffff88', '#ffffff00']} style={[styles.linearGradient,{position:'absolute',top:0,left:0}]}></LinearGradient> */}
                    {this.creactePicker()}
                    {/* <LinearGradient colors={['#ffffff00', '#ffffff88', '#ffffffff']} style={[styles.linearGradient,{position:'absolute',bottom:0,left:0}]}></LinearGradient> */}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    linearGradient: {
        height: (calendarHeight - 50) / 2,
        width: WINDOW_WIDTH
    }
});

//make this component available to the app
export default WheelPicker;
