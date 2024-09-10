//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

import SingleWheel from './SingleWheel';
import DateSingleWheel from './DateSingleWheel';
import { SentencedToEmpty } from '../../../utils';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

let scaleFactor = 375;
// let calendarHeight = 320*(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let calendarHeight = 200;

// create a component
class AnyValueWheelPicker extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            result: props.defaultDate,
        };
    }

    static defaultProps = {
        pickerType: 'anyValue',//time date data
        defaultValue: 'defaultValue',
        dataArray: [],
        defaultIndexFun: (dataArray, value) => { return 0; },
        getShowValue: (item) => { return 'showValue'; },
        getValue: (item) => { return 'Value'; },
        callbackFun: (result) => { },
    }

    creactePicker = () => {
        let pickerComponentArray = [];
        let _format = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'format'], 'HH:mm');
        if (this.props.pickerType == 'time') {

        } else {
            pickerComponentArray.push(<SingleWheel
                defaultValue={this.props.defaultValue}
                defaultIndexFun={this.props.defaultIndexFun}
                key={3}
                callback={(item, index) => {
                    this.props.callbackFun(item, index);
                }}
                style={{ height: calendarHeight }}
                getShowValue={this.props.getShowValue}
                dataArray={this.props.dataArray} />);
        }
        return <View style={[{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: WINDOW_WIDTH,
            height: 200,
        }]}>
            {
                pickerComponentArray.map((item) => {
                    return item;
                })
            }
        </View>;
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={[{
                        width: WINDOW_WIDTH,
                        height: calendarHeight,
                        backgroundColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}>
                    {/* <LinearGradient colors={['#ffffffff', '#ffffff88', '#ffffff00']} style={[styles.linearGradient,{position:'absolute',top:0,left:0}]}></LinearGradient> */}
                    {
                        this.creactePicker()
                    }
                    {/* <LinearGradient colors={['#ffffff00', '#ffffff88', '#ffffffff']} style={[styles.linearGradient,{position:'absolute',bottom:0,left:0}]}></LinearGradient> */}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default AnyValueWheelPicker;
