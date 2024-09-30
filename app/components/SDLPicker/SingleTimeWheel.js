//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import {
//     createStackNavigator,
//     createBottomTabNavigator,
//     NavigationActions,
// } from 'react-navigation';
import moment from 'moment';

import CalendarView from './component/CalendarView';
import WheelPicker from './component/WheelPicker';
import { calendarHeight, WINDOW_HEIGHT, WINDOW_WIDTH } from '../../config/globalsize';

// const WINDOW_WIDTH = Dimensions.get('window').width;
// const WINDOW_HEIGHT = Dimensions.get('window').height;
// let scaleFactor = 375;
// let calendarHeight = 320 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let t = moment();
t.set('date', 1);
// const TimeNavigator = createBottomTabNavigator({
//     WheelPicker: { screen: WheelPicker },
// }, {
//     // lazy:false
//     initialRouteParams: {
//         defaultDate: '2018-09-11',
//     }
// });


// create a component
class SingleTimeWheel extends PureComponent {

    constructor(props) {
        super(props);
        let defaultDate = moment(props.defaultDate.format(props.format));
        // const TimeNavigator = createBottomTabNavigator({
        //     WheelPicker: { screen: WheelPicker },
        // }, {
        //     // lazy:false
        //     initialRouteParams: {
        //         defaultDate: defaultDate,
        //         callbackFun: (date) => {
        //             let dateStr = this.state.currentDate.format(props.format);
        //             let preDate = moment(dateStr);
        //             // let preDate = this.state.currentDate;
        //             date = moment(date.format(props.format));
        //             preDate.set('year', date.get('year'));
        //             preDate.set('month', date.get('month'));
        //             preDate.set('date', date.get('date'));
        //             preDate.set('hour', date.get('hour'));
        //             preDate.set('minute', date.get('minute'));
        //             this.setState({ currentDate: preDate });
        //         },
        //         'format': props.format,
        //     }
        // });
        this.state = {
            selectItem: 0,
            currentDate: props.defaultDate.format('YYYY-MM-DD HH:mm') == 'Invalid date' ?
                moment()
                : props.defaultDate,
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
        let defaultDate = moment(this.props.defaultDate.format(this.props.format));
        return (
            <View
                style={[styles.container
                    , this.props.orientation == 'LANDSCAPE'
                    ? { width: WINDOW_HEIGHT } : { width: WINDOW_WIDTH }]}
            >
                <View style={[{
                    width: this.props.orientation == 'LANDSCAPE' ? WINDOW_HEIGHT : WINDOW_WIDTH,
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                }]}>
                    {/* <View style={[{height:46,justifyContent:'center',alignItems:'center',borderBottomColor:'#4499f0',borderBottomWidth:1,}]}>
                        <Text style={[{fontSize:14,color:'#4499f0',marginLeft:32,marginRight:16,fontWeight:'bold'}]}>{this.state.currentDate.format(this.props.format)}</Text>
                    </View> */}
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.props.hidePicker();
                            }
                        }>
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#989898' }]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[{ flex: 1 }]}></View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.callbackForResult(this.state.currentDate);
                            this.props.hidePicker();
                        }}>
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#4aa0fe' }]}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{
                    height: calendarHeight,
                    width: this.props.orientation == 'LANDSCAPE' ? WINDOW_HEIGHT : WINDOW_WIDTH
                    , justifyContent: 'center'
                }]}>
                    <View
                        // onStartShouldSetResponderCapture={() => {
                        //     // 拦截事件 不传递给父组件
                        //     console.log('onStartShouldSetResponderCapture orientation = ', this.props.orientation);
                        //     if (this.props.orientation == 'LANDSCAPE') {
                        //         return true;
                        //     } else {
                        //         return false;
                        //     }
                        // }}
                        style={{
                            height: 200
                            , width: this.props.orientation == 'LANDSCAPE' ? WINDOW_HEIGHT : WINDOW_WIDTH
                        }}>
                        {/* <this.state.TimeNavigator ref={ref => {
                            if (ref !== null && __DEV__) {
                                // console.log(ref);
                                // console.log(ref._navigation);
                            }
                            return this.timeNavigator = ref;
                        }} /> */}
                        <WheelPicker
                            orientation={this.props.orientation}
                            defaultDate={defaultDate}
                            callbackFun={(date) => {
                                let dateStr = this.state.currentDate.format(this.props.format);
                                let preDate = moment(dateStr);
                                // let preDate = this.state.currentDate;
                                date = moment(date.format(this.props.format));
                                preDate.set('year', date.get('year'));
                                preDate.set('month', date.get('month'));
                                preDate.set('date', date.get('date'));
                                preDate.set('hour', date.get('hour'));
                                preDate.set('minute', date.get('minute'));
                                this.setState({ currentDate: preDate });
                            }}
                            format={this.props.format}
                        />
                    </View>
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
        backgroundColor: 'white',
        height: calendarHeight + 45//295,
    },
});

//make this component available to the app
export default SingleTimeWheel;

