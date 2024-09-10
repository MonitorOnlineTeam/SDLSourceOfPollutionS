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
let calendarHeight = 320 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);

// create a component
class RangeTime extends PureComponent {

    constructor(props) {
        super(props);
        // const TimeNavigator = createBottomTabNavigator({
        //     biginMonthPicker: { screen: WheelPicker },
        //     endMonthPicker: { screen: WheelPicker },
        // }, {
        //     // lazy:false
        //     initialRouteParams: {
        //         format: 'YYYY-MM',
        //         callbackFun: (date) => {
        //             let dateStr, preDate;
        //             if (this.state.selectedStartDate) {
        //                 dateStr = this.state.selectedStartDate.format('YYYY-MM-01 00:00');
        //                 preDate = moment(dateStr);
        //             } else {
        //                 preDate = moment();
        //                 preDate.set('date', 1);
        //                 preDate.set('hour', 0);
        //                 preDate.set('minute', 0);
        //             }
        //             preDate.set('year', date.get('year'));
        //             preDate.set('month', date.get('month'));
        //             this.setState({ selectedStartDate: preDate });
        //         },
        //         defaultDate: props.selectedStartDate ? this.props.selectedStartDate : moment(),
        //     }
        // });
        this.state = {
            selectItem: 1,
            selectedStartDate: props.selectedStartDate,
            selectedEndDate: props.selectedEndDate,
            // TimeNavigator
        };
    }

    static defaultProps = {
        hidePicker: () => { },
        callbackForResult: (date) => { },
        defaultDate: moment(),
        selectedStartDate: moment(),
        selectedEndDate: moment(),
    }

    render() {
        return (<View><Text>RangeMonth</Text></View>)
        return (
            <View style={[styles.container, { height: (72 + 240) }]}>
                <View style={[{
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                }]}>
                    <View style={[{ height: 72, marginHorizatal: 8, justifyContent: 'center', alignItems: 'center', width: WINDOW_WIDTH / 3 }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.timeNavigator.dispatch(NavigationActions.navigate({
                                    routeName: 'biginMonthPicker',
                                    params: {
                                        // initResult:this.state.currentDate.format('HH:mm'),
                                        format: 'YYYY-MM',
                                        callbackFun: (date) => {
                                            let dateStr, preDate;
                                            if (this.state.selectedStartDate) {
                                                dateStr = this.state.selectedStartDate.format('YYYY-MM-01 00:00');
                                                preDate = moment(dateStr);
                                            } else {
                                                preDate = moment();
                                                preDate.set('date', 1);
                                                preDate.set('hour', 0);
                                                preDate.set('minute', 0);
                                            }
                                            preDate.set('year', date.get('year'));
                                            preDate.set('month', date.get('month'));
                                            this.setState({ selectedStartDate: preDate });
                                        },
                                        defaultDate: this.props.selectedStartDate ? this.props.selectedStartDate : moment(),
                                    }
                                }));
                                this.setState({ selectItem: 1 });
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', fontWeight: this.state.selectItem == 1 ? 'bold' : 'normal' }]}>{this.state.selectedStartDate ? this.state.selectedStartDate.format('YYYY-MM') : 'xxxx-xx'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.timeNavigator.dispatch(NavigationActions.navigate({
                                    routeName: 'endMonthPicker',
                                    params: {
                                        // initResult:this.state.currentDate.format('HH:mm'),
                                        format: 'YYYY-MM',
                                        callbackFun: (date) => {
                                            let dateStr, preDate;
                                            if (this.state.selectedEndDate) {
                                                dateStr = this.state.selectedEndDate.format('YYYY-MM-01 00:00');
                                                preDate = moment(dateStr);
                                            } else {
                                                preDate = moment();
                                                preDate.set('date', 1);
                                                preDate.set('hour', 0);
                                                preDate.set('minute', 0);
                                            }
                                            preDate.set('year', date.get('year'));
                                            preDate.set('month', date.get('month'));
                                            this.setState({ selectedEndDate: preDate });
                                        },
                                        defaultDate: this.props.selectedEndDate ? this.props.selectedEndDate : moment(),
                                    }
                                }));
                                this.setState({ selectItem: 2 });
                            }}>
                            <View style={[{ height: 36, marginHorizatal: 8, justifyContent: 'center', minWidth: WINDOW_WIDTH / 4 }]}>
                                <Text style={[{ fontSize: 14, color: '#4499f0', fontWeight: this.state.selectItem == 2 ? 'bold' : 'normal' }]}>{this.state.selectedEndDate ? this.state.selectedEndDate.format('YYYY-MM') : 'xxxx-xx'}</Text>
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
                <View style={[{ height: 240, width: WINDOW_WIDTH }]}>
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
export default RangeTime;

