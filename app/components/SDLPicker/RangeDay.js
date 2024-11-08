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

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
let scaleFactor = 375;
let calendarHeight = 320 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
// let calendarHeight = 370*(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);

// create a component
class RangeDay extends PureComponent {

    constructor(props) {
        super(props);
        // const TimeNavigator = (<CalendarView />);
        // const TimeNavigator = createStackNavigator({
        //     CalendarView: { screen: CalendarView,navigationOptions:{header:null} },
        // },{
        //     // lazy:false
        //     initialRouteParams:{
        //         defaultDate:props.defaultDate.format('YYYY-MM-DD'),
        //         callbackFun:([selectedStartDate,selectedEndDate])=>{
        //             let preSelectedStartDate,preSelectedEndDate;
        //             if (this.state.selectedStartDate) {
        //                 let dateStr = this.state.selectedStartDate.format('YYYY-MM-DD HH:mm');
        //                 preSelectedStartDate = moment(dateStr);
        //             } else {
        //                 preSelectedStartDate = moment();
        //             }
        //             if (this.state.selectedEndDate) {
        //                 let dateStr = this.state.selectedEndDate.format('YYYY-MM-DD HH:mm');
        //                 preSelectedEndDate = moment(dateStr);
        //             } else {
        //                 preSelectedEndDate = moment();
        //             }
        //             preSelectedStartDate.set('year',selectedStartDate.get('year'));
        //             preSelectedStartDate.set('month',selectedStartDate.get('month'));
        //             preSelectedStartDate.set('date',selectedStartDate.get('date'));
        //             preSelectedEndDate.set('year',selectedEndDate.get('year'));
        //             preSelectedEndDate.set('month',selectedEndDate.get('month'));
        //             preSelectedEndDate.set('date',selectedEndDate.get('date'));
        //             this.setState({'selectedStartDate':preSelectedStartDate,'selectedEndDate':preSelectedEndDate});
        //         },
        //         allowRangeSelection:true,
        //         selectedStartDate: this.props.selectedStartDate,
        //         selectedEndDate: this.props.selectedEndDate,
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
    }

    render() {
        return (
            <View style={[styles.container,]}>
                <View style={[{
                    width: WINDOW_WIDTH,
                    flexDirection: 'row',
                    // height:72,
                    paddingHorizontal: 8,
                }]}>
                    {/* <TouchableOpacity 
                        onPress={()=>{
                            this.timeNavigator.dispatch(NavigationActions.navigate({
                                routeName: 'CalendarView',
                                params:{
                                    // defaultDate:this.state.currentDate.format('YYYY-MM-DD'),
                                    callbackFun:([selectedStartDate,selectedEndDate])=>{
                                        let preSelectedStartDat,preSelectedEndDate;
                                        if (this.state.selectedStartDate) {
                                            let dateStr = this.state.selectedStartDate.format('YYYY-MM-DD HH:mm');
                                            preSelectedStartDat = moment(dateStr);
                                        } else {
                                            preSelectedStartDat = moment();
                                        }
                                        if (this.state.selectedEndDate) {
                                            let dateStr = this.state.selectedEndDate.format('YYYY-MM-DD HH:mm');
                                            preSelectedEndDate = moment(dateStr);
                                        } else {
                                            preSelectedEndDate = moment();
                                        }

                                        preSelectedStartDat.set('year',selectedStartDate.get('year'));
                                        preSelectedStartDat.set('month',selectedStartDate.get('month'));
                                        preSelectedStartDat.set('date',selectedStartDate.get('date'));
                                        preSelectedEndDate.set('year',selectedEndDate.get('year'));
                                        preSelectedEndDate.set('month',selectedEndDate.get('month'));
                                        preSelectedEndDate.set('date',selectedEndDate.get('date'));
                                        this.setState({'selectedStartDate':preSelectedStartDat,'selectedEndDate':preSelectedEndDate});
                                    },
                                    allowRangeSelection:true,
                                    selectedStartDate: this.props.selectedStartDate,
                                    selectedEndDate: this.props.selectedEndDate,
                                }
                            }));
                            this.setState({selectItem:0});
                        }}>
                        <View style={[{height:72,justifyContent:'space-around',alignItems:'center',minWidth:WINDOW_WIDTH*3/7,}]}>
                            <Text style={[{fontSize:14,color:'#4499f0',marginLeft:32,marginRight:16,fontWeight:this.state.selectItem==0?'bold':'normal'}]}>{this.state.selectedStartDate?this.state.selectedStartDate.format('YYYY年MM月DD日'):'---- -- --'}</Text>
                            <Text style={[{fontSize:14,color:'#4499f0',marginLeft:32,marginRight:16,fontWeight:this.state.selectItem==0?'bold':'normal'}]}>{this.state.selectedEndDate?this.state.selectedEndDate.format('YYYY年MM月DD日'):'---- -- --'}</Text>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.props.hidePicker();
                            }
                        }>
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center', }]}>
                            <Text style={[{ fontSize: 15, color: '#989898' }]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[{ height: 42, flex: 1, }]}></View>
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
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center', }]}>
                            <Text style={[{ fontSize: 15, color: '#4aa0fe' }]}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ height: calendarHeight, width: WINDOW_WIDTH, paddingTop: 3, }]}>
                    {/* <this.state.TimeNavigator ref={ref => {
                        if (ref !== null && __DEV__) {
                            // console.log(ref);
                            // console.log(ref._navigation);
                        }
                        return this.timeNavigator = ref;
                    }} /> */}
                    <CalendarView
                        // defaultDate={this.props.defaultDate.format('YYYY-MM-DD')}
                        callbackFun={([selectedStartDate, selectedEndDate]) => {
                            let preSelectedStartDate, preSelectedEndDate;
                            if (this.state.selectedStartDate) {
                                let dateStr = this.state.selectedStartDate.format('YYYY-MM-DD HH:mm');
                                preSelectedStartDate = moment(dateStr);
                            } else {
                                preSelectedStartDate = moment();
                            }
                            if (this.state.selectedEndDate) {
                                let dateStr = this.state.selectedEndDate.format('YYYY-MM-DD HH:mm');
                                preSelectedEndDate = moment(dateStr);
                            } else {
                                preSelectedEndDate = moment();
                            }
                            preSelectedStartDate.set('year', selectedStartDate.get('year'));
                            preSelectedStartDate.set('month', selectedStartDate.get('month'));
                            preSelectedStartDate.set('date', selectedStartDate.get('date'));
                            preSelectedEndDate.set('year', selectedEndDate.get('year'));
                            preSelectedEndDate.set('month', selectedEndDate.get('month'));
                            preSelectedEndDate.set('date', selectedEndDate.get('date'));
                            this.setState({ 'selectedStartDate': preSelectedStartDate, 'selectedEndDate': preSelectedEndDate });
                        }}
                        allowRangeSelection={true}
                        selectedStartDate={this.props.selectedStartDate}
                        selectedEndDate={this.props.selectedEndDate}
                    />
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
export default RangeDay;

