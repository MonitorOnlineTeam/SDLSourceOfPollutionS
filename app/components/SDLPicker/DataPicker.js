//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import moment from 'moment';

import AnyValueWheelPicker from './component/AnyValueWheelPicker';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
let scaleFactor = 375;
let calendarHeight = 320 * (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / scaleFactor);
let t = moment();
t.set('date', 1);

// create a component
class DataPicker extends PureComponent {
    constructor(props) {
        super(props);
        let index = props.defaultIndexFun(props.dataArray, props.defaultValue);
        if (index < 0) {
            index = 0;
        }
        this.state = {
            selectItem: index,
            result: props.dataArray[index]
        };
    }

    static defaultProps = {
        pickerType: 'anyValue', //time date data
        hidePicker: () => { },
        callbackForResult: data => { },
        defaultValue: 'defaultValue',
        dataArray: [],
        defaultIndexFun: (dataArray, value) => {
            return 0;
        },
        getShowValue: item => {
            return 'showValue';
        },
        getValue: item => {
            return 'Value';
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={[
                        {
                            width: WINDOW_WIDTH,
                            flexDirection: 'row',
                            height: 42
                        }
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.hidePicker();
                        }}
                    >
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#989898' }]}>取消</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[{ flex: 1 }]} />
                    <TouchableOpacity
                        onPress={() => {
                            this.props.callbackForResult(this.state.result);
                            this.props.hidePicker();
                        }}
                    >
                        <View style={[{ height: 42, width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: '#4aa0fe' }]}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ flex: 1, width: WINDOW_WIDTH, justifyContent: 'center', alignItems: 'center' }]}>
                    <AnyValueWheelPicker
                        pickerType={this.props.pickerType}
                        callbackFun={(result, index) => {
                            this.setState({ result, selectItem: index });
                        }}
                        defaultValue={this.props.defaultValue}
                        dataArray={this.props.dataArray}
                        defaultIndexFun={this.props.defaultIndexFun}
                        getShowValue={this.props.getShowValue}
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
        backgroundColor: 'white',
        height: 295
    }
});

//make this component available to the app
export default DataPicker;
