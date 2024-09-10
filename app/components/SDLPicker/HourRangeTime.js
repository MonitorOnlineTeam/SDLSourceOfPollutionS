//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import {
//     createStackNavigator,
//     createBottomTabNavigator,
//     NavigationActions,
//   } from 'react-navigation';
import moment from 'moment';

import CalendarView from './component/CalendarView';
import WheelPicker from './component/WheelPicker';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
let scaleFactor = 375;
// let calendarHeight = 320*(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let calendarHeight = 370 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);

// create a component
class HourRangeTime extends PureComponent {

    constructor(props) {
        super(props);
        // const TimeNavigator = createBottomTabNavigator({
        //     biginCalendarView: { screen: CalendarView },
        //     endCalendarView: { screen: CalendarView },
        //     biginTimePicker: { screen: WheelPicker },
        //     endTimePicker: { screen: WheelPicker },
        // }, {
        //     // lazy:false
        //     initialRouteParams: {
        //         defaultDate: props.defaultDate.format('YYYY-MM-DD'),
        //         callbackFun: (date) => {
        //             let preSelectedStartDat;
        //             if (this.state.selectedStartDate) {
        //                 let dateStr = this.state.selectedStartDate.format('YYYY-MM-DD HH:mm');
        //                 preSelectedStartDat = moment(dateStr);
        //             } else {
        //                 preSelectedStartDat = moment();
        //                 preSelectedStartDat.set('minute', 0);
        //             }
        //             preSelectedStartDat.set('year', date.get('year'));
        //             preSelectedStartDat.set('month', date.get('month'));
        //             preSelectedStartDat.set('date', date.get('date'));
        //             this.setState({ 'selectedStartDate': preSelectedStartDat, });
        //             this.selectStartTimeFun();
        //         },
        //         allowRangeSelection: false,
        //         selectedStartDate: this.props.selectedStartDate,
        //         selectedEndDate: null,
        //     }
        // });
        this.state = {
            selectItem: 0,
            selectedStartDate: props.selectedStartDate,
            selectedEndDate: props.selectedEndDate,
            // TimeNavigator
        };
    }

    static defaultProps = {
        hidePicker: () => { },
        callbackForResult: (date) => { },
        defaultDate: moment(),
        selectedStartDate: null,
        selectedEndDate: null,
        format: 'YYYY-MM-DD HH:mm',
    }

    selectStartDateFun = () => {
        this.timeNavigator.dispatch(NavigationActions.navigate({
            routeName: 'biginCalendarView',
            params: {
                defaultDate: this.props.defaultDate.format('YYYY-MM-DD'),
                callbackFun: (date) => {
                    let preSelectedStartDat;
                    if (this.state.selectedStartDate) {
                        let dateStr = this.state.selectedStartDate.format('YYYY-MM-DD HH:mm');
                        preSelectedStartDat = moment(dateStr);
                    } else {
                        preSelectedStartDat = moment();
                        preSelectedStartDat.set('minute', 0);
                    }
                    preSelectedStartDat.set('year', date.get('year'));
                    preSelectedStartDat.set('month', date.get('month'));
                    preSelectedStartDat.set('date', date.get('date'));
                    this.setState({ 'selectedStartDate': preSelectedStartDat, });
                    this.selectStartTimeFun();
                },
                allowRangeSelection: false,
                selectedStartDate: this.state.selectedStartDate,
                selectedEndDate: null,
            }
        }));
        this.setState({ selectItem: 0 });
    }

    selectEndDateFun = () => {
        let defaultTime;
        if (typeof this.state.selectedEndDate == 'undefined' || !this.state.selectedEndDate) {
            defaultTime = moment().format('YYYY-MM-DD');
        } else {
            defaultTime = this.state.selectedEndDate.format('YYYY-MM-DD');
        }
        this.timeNavigator.dispatch(NavigationActions.navigate({
            routeName: 'endCalendarView',
            params: {
                defaultDate: defaultTime,
                callbackFun: (date) => {
                    let preSelectedEndDate;
                    if (this.state.selectedEndDate) {
                        let dateStr = this.state.selectedEndDate.format('YYYY-MM-DD HH:mm');
                        preSelectedEndDate = moment(dateStr);
                    } else {
                        preSelectedEndDate = moment();
                        preSelectedEndDate.set('minute', 0);
                    }
                    preSelectedEndDate.set('year', date.get('year'));
                    preSelectedEndDate.set('month', date.get('month'));
                    preSelectedEndDate.set('date', date.get('date'));
                    this.setState({ 'selectedEndDate': preSelectedEndDate });
                    this.selectEndTimeFun();
                },
                allowRangeSelection: false,
                selectedStartDate: this.state.selectedEndDate,
                selectedEndDate: null,
            }
        }));
        this.setState({ selectItem: 1 });
    }

    selectStartTimeFun = () => {
        let format = this.props.format.split(' ')[1];
        this.timeNavigator.dispatch(NavigationActions.navigate({
            routeName: 'biginTimePicker',
            params: {
                // initResult:this.state.currentDate.format('HH:mm'),
                callbackFun: (date) => {
                    let dateStr, preDate;
                    if (this.state.selectedStartDate) {
                        dateStr = this.state.selectedStartDate.format(this.props.format);
                        preDate = moment(dateStr);
                    } else {
                        preDate = moment();
                    }
                    date = moment(date.format(this.props.format));
                    preDate.set('hour', date.get('hour'));
                    preDate.set('minute', date.get('minute'));
                    this.setState({ selectedStartDate: preDate });
                },
                defaultDate: this.props.selectedStartDate ? this.props.selectedStartDate : moment(),
                format,
            }
        }));
        this.setState({ selectItem: 2 });
    }

    selectEndTimeFun = () => {
        let format = this.props.format.split(' ')[1];
        this.timeNavigator.dispatch(NavigationActions.navigate({
            routeName: 'endTimePicker',
            params: {
                // initResult:this.state.currentDate.format('HH:mm'),
                callbackFun: (date) => {
                    let dateStr, preDate;
                    if (this.state.selectedEndDate) {
                        dateStr = this.state.selectedEndDate.format(this.props.format);
                        preDate = moment(dateStr);
                    } else {
                        preDate = moment();
                    }
                    date = moment(date.format(this.props.format));
                    preDate.set('hour', date.get('hour'));
                    preDate.set('minute', date.get('minute'));
                    this.setState({ selectedEndDate: preDate });
                },
                defaultDate: this.props.selectedEndDate ? this.props.selectedEndDate : moment(),
                format,
            }
        }));
        this.setState({ selectItem: 3 });
    }

    render() {
        return (<View><Text>HourRangeTime</Text></View>)
        return (
            <View style={[styles.container, { height: (72 + calendarHeight) }]}>
                <View style={[{
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                }]}>
                    <View style={[{ height: 72, marginHorizatal: 8, justifyContent: 'center', alignItems: 'center', minWidth: WINDOW_WIDTH * 3 / 7 }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectStartDateFun();
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', marginLeft: 32, marginRight: 16, fontWeight: this.state.selectItem == 0 ? 'bold' : 'normal' }]}>{this.state.selectedStartDate ? this.state.selectedStartDate.format('YYYY年MM月DD日') : '---- -- --'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectEndDateFun();
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', marginLeft: 32, marginRight: 16, fontWeight: this.state.selectItem == 1 ? 'bold' : 'normal' }]}>{this.state.selectedEndDate ? this.state.selectedEndDate.format('YYYY年MM月DD日') : '---- -- --'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ height: 72, marginHorizatal: 8, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectStartTimeFun();
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', fontWeight: this.state.selectItem == 2 ? 'bold' : 'normal' }]}>{this.state.selectedStartDate ? this.state.selectedStartDate.format('HH:mm') : '--:--'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectEndTimeFun();
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', fontWeight: this.state.selectItem == 3 ? 'bold' : 'normal' }]}>{this.state.selectedEndDate ? this.state.selectedEndDate.format('HH:mm') : '--:--'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[{ flex: 1 }]}></View>
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.props.hidePicker();
                            }
                        }>
                        <View style={[{ height: 72, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#989898' }]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (!this.state.selectedStartDate || typeof this.state.selectedStartDate == 'undefined') {
                                console.log('你还没有选择开始时间');
                            } else if (!this.state.selectedEndDate || typeof this.state.selectedEndDate == 'undefined') {
                                console.log('你还没有选择结束时间');
                            } else if (this.state.selectedEndDate.isBefore(this.state.selectedStartDate.format('YYYY-MM-DD HH:mm'))) {
                                console.log("结束时间不能小于开始时间：", this.state.selectedEndDate.isBefore(this.state.selectedStartDate.format('YYYY-MM-DD HH:mm')));
                            } else {
                                this.props.callbackForResult([this.state.selectedStartDate, this.state.selectedEndDate]);
                                this.props.hidePicker();
                            }
                        }}>
                        <View style={[{ height: 72, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#4aa0fe' }]}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ height: calendarHeight, width: WINDOW_WIDTH }]}>
                    <this.state.TimeNavigator ref={ref => {
                        if (ref !== null && __DEV__) {
                            // console.log(ref);
                            // console.log(ref._navigation);
                        }
                        return this.timeNavigator = ref;
                    }} />
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: WINDOW_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default HourRangeTime;

