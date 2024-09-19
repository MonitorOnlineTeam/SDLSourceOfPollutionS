//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

import { SentencedToEmpty } from '../../../utils';


const WINDOW_WIDTH = Dimensions.get('window').width;

// create a component
class CalendarView extends PureComponent {

    static navigationOptions = {
        tabBarVisible: false,
    }

    constructor(props) {
        super(props);
        // if (props.navigation.state.params.allowRangeSelection) {
        if (props.allowRangeSelection) {
            this.state = {
                // selectedStartDate: props.navigation.state.params.selectedStartDate,
                // selectedEndDate: props.navigation.state.params.selectedEndDate,
                selectedStartDate: props.selectedStartDate,
                selectedEndDate: props.selectedEndDate,
            };
        } else {
            this.state = {
                // selectedStartDate: props.navigation.state.params.selectedStartDate,
                selectedStartDate: props.selectedStartDate,
                selectedEndDate: null,
            };
        }

        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            let _moment = moment();
            let selectedEndDate = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'selectedEndDate'], _moment);
            this.setState({
                'selectedEndDate': date,
            });
            // if (this.props.navigation.state.params.allowRangeSelection) {
            //     this.props.navigation.state.params.callbackFun([this.state.selectedStartDate, date]);
            // }
            if (this.props.allowRangeSelection) {
                this.props.callbackFun([this.state.selectedStartDate, date]);
            }
        } else {
            let selectedStartDate = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'selectedStartDate'], moment());
            this.setState({
                'selectedStartDate': date,
                'selectedEndDate': null,
            });
            // if (!this.props.navigation.state.params.allowRangeSelection) {
            //     this.props.navigation.state.params.callbackFun(date);
            // }
            if (!this.props.allowRangeSelection) {
                this.props.callbackFun(date);
            }
        }
    }

    static defaultProps = {
        navigation: {
            state: {
                params: {
                    defaultDate: moment().format('YYYY-MM-DD'),
                    callbackFun: () => { },
                    allowRangeSelection: false,
                    selectedStartDate: null,
                    selectedEndDate: null,
                }
            }
        }
    }

    render() {
        const { selectedStartDate, selectedEndDate } = this.state;
        const minDate = new Date(1949, 6, 3);
        const maxDate = new Date(2120, 6, 3);
        return (
            <View style={[{ backgroundColor: 'white' }]}>
                <CalendarPicker
                    startFromMonday={true}
                    selectedStartDate={this.state.selectedStartDate}
                    selectedEndDate={this.state.selectedEndDate}
                    // allowRangeSelection={this.props.navigation.state.params.allowRangeSelection}
                    allowRangeSelection={this.props.allowRangeSelection}
                    // initialDate={this.props.navigation.state.params.defaultDate}
                    initialDate={this.props.defaultDate}
                    weekdays={['一', '二', '三', '四', '五', '六', '日']}
                    months={['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',]}
                    previousTitle={require('../../../images/calenderLeft.png')}
                    nextTitle={require('../../../images/calendarRight.png')}
                    minDate={minDate}
                    maxDate={maxDate}
                    todayBackgroundColor="#EEE685"
                    selectedDayColor="#dff0ff"
                    selectedDayTextColor="#333333"
                    onDateChange={this.onDateChange}
                />
            </View>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default CalendarView;
