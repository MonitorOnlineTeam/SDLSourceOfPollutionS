//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import {
//     createBottomTabNavigator,
//     NavigationActions,
// } from 'react-navigation';
import moment from 'moment';

import CalendarView from './component/CalendarView';
import WheelPicker from './component/WheelPicker';
import { NavigationActions } from '../../utils';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
let scaleFactor = 375;
let calendarHeight = 320 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let t = moment();
t.set('date', 1);
// const TimeNavigator = createBottomTabNavigator({
//     CalendarView: { screen: CalendarView },
//     WheelPicker: { screen: WheelPicker },
// }, {
//     // lazy:false
//     initialRouteParams: {
//         defaultDate: '2018-09-11',
//     }
// });


// create a component
class SingleTime extends PureComponent {

    constructor(props) {
        super(props);
        // const TimeNavigator = createBottomTabNavigator({
        //     CalendarView: { screen: CalendarView },
        //     WheelPicker: { screen: WheelPicker },
        // }, {
        //     // lazy:false
        //     initialRouteParams: {
        //         // defaultDate:props.defaultDate.format('YYYY-MM-DD'),
        //         selectedStartDate: props.defaultDate.format('YYYY-MM-DD'),
        //         callbackFun: (date) => {
        //             let dateStr = this.state.currentDate.format(props.format);
        //             let preDate = moment(dateStr);
        //             preDate.set('year', date.get('year'));
        //             preDate.set('month', date.get('month'));
        //             preDate.set('date', date.get('date'));
        //             this.setState({ currentDate: preDate });
        //         }
        //     }
        // });
        this.state = {
            selectItem: 0,
            currentDate: props.defaultDate,
            // TimeNavigator
        };
    }

    static defaultProps = {
        hidePicker: () => { },
        callbackForResult: (date) => { },
        defaultDate: moment(),
        format: 'YYYY-MM-DD HH:mm',
    }

    render() {
        let timeFormat = this.props.format.split(' ')[1];
        return (<View><Text>SingleTime_unselected</Text></View>)
        return (
            <View style={[styles.container]}>
                <View style={[{
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.timeNavigator.dispatch(NavigationActions.navigate({
                                routeName: 'CalendarView',
                                params: {
                                    defaultDate: this.state.currentDate.format('YYYY-MM-DD'),
                                    callbackFun: (date) => {
                                        let dateStr = this.state.currentDate.format(this.props.format);
                                        let preDate = moment(dateStr);
                                        preDate.set('year', date.get('year'));
                                        preDate.set('month', date.get('month'));
                                        preDate.set('date', date.get('date'));
                                        this.setState({ currentDate: preDate });
                                    }
                                }
                            }));
                            this.setState({ selectItem: 0 });
                        }}>
                        <View style={[{ height: 46, justifyContent: 'center', alignItems: 'center', borderBottomColor: this.state.selectItem == 0 ? '#4499f0' : '#00000000', borderBottomWidth: 1, }]}>
                            <Text style={[{ fontSize: 14, color: '#4499f0', marginLeft: 32, marginRight: 16, fontWeight: this.state.selectItem == 0 ? 'bold' : 'normal' }]}>{this.state.currentDate.format('YYYY年MM月DD日')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.timeNavigator.dispatch(NavigationActions.navigate({
                                routeName: 'WheelPicker',
                                params: {
                                    selectedStartDate: this.state.currentDate,
                                    selectedEndDate: null,
                                    defaultDate: this.state.currentDate,
                                    callbackFun: (date) => {
                                        let dateStr = this.state.currentDate.format(this.props.format);
                                        let preDate = moment(dateStr);
                                        preDate.set('hour', date.get('hour'));
                                        preDate.set('minute', date.get('minute'));
                                        preDate.set('second', date.get('second'));
                                        this.setState({ currentDate: preDate });
                                    },
                                    format: timeFormat
                                }
                            }));
                            this.setState({ selectItem: 1 });
                        }}>
                        <View style={[{ height: 46, marginHorizatal: 8, justifyContent: 'center', alignItems: 'center', borderBottomColor: this.state.selectItem == 1 ? '#4499f0' : '#00000000', borderBottomWidth: 1, }]}>
                            <Text style={[{ fontSize: 14, color: '#4499f0', fontWeight: this.state.selectItem == 1 ? 'bold' : 'normal', marginHorizontal: 8, }]}>{this.state.currentDate.format(timeFormat)}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[{ flex: 1 }]}></View>
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.props.hidePicker();
                            }
                        }>
                        <View style={[{ height: 48, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#989898' }]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.callbackForResult(this.state.currentDate);
                            this.props.hidePicker();
                        }}>
                        <View style={[{ height: 48, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
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
                <TouchableOpacity
                    style={[{ marginLeft: 10, marginVertical: 10 }]}
                >
                    <View
                        style={[{
                            width: WINDOW_WIDTH - 20,
                            height: 48
                            , borderWidth: 1, borderColor: '#999999'
                            , justifyContent: 'center', alignItems: 'center'
                        }]}
                    >
                        <Text style={[{ fontSize: 15, color: '#989898' }]}>清除</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

// class SingleTime extends PureComponent {
//     render() {
//         return (<Text>123</Text>);
//     }
// }

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
export default SingleTime;

