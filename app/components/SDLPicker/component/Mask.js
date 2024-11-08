/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-12-29 11:36:14
 * @LastEditTime: 2024-10-30 15:50:29
 * @FilePath: /SDLSourceOfPollutionS/app/components/SDLPicker/component/Mask.js
 */
//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback, Animated } from 'react-native';

import { connect } from 'react-redux';

import { SCREEN_HEIGHT, SCREEN_WIDTH, WINDOW_HEIGHT } from '../constant/globalsize';
import Orientation, { getOrientation } from 'react-native-orientation';
/**
 * 对比点选择dialog
 */
// create a component
@connect()
class Mask extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            viewHeight: WINDOW_HEIGHT,
            orientation: 'portrait'
        };
        Orientation.getOrientation((err, orientation) => {
            this.setState({ orientation });
        });
    }

    componentDidMount() {
        Orientation.getOrientation((err, orientation) => {
            this.setState({ orientation });
        });
    }

    componentWillUnmount() { }

    onLayout = event => {
        this.setState({ viewHeight: this.SentencedToEmpty(event, ['nativeEvent', 'layout', 'height'], WINDOW_HEIGHT) });
    };

    SentencedToEmpty = (obj, keys, emptyValue) => {
        let temp = obj,
            tempResult;
        keys.map((item, key) => {
            temp = temp[item];
            if (typeof temp != 'undefined' && temp) {
                tempResult = temp;
            } else {
                tempResult = temp = emptyValue;
            }
        });
        return tempResult;
    };

    render() {
        if (this.props.orientation == 'LANDSCAPE') {
            return (
                <View style={[{ flexDirection: 'row', zIndex: 0, flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, this.props.style]} onLayout={event => this.onLayout(event)}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.hideDialog();
                        }}
                    >
                        <Animated.View style={styles.mask} />
                    </TouchableWithoutFeedback>
                    {/**此处添加需要弹出的框体*/}
                    {this.props.children}
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.hideDialog();
                        }}
                    >
                        <Animated.View style={styles.mask} />
                    </TouchableWithoutFeedback>
                </View>
            );
        } else {
            return (
                <View style={[{ zIndex: 0, flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, this.props.style]} onLayout={event => this.onLayout(event)}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.hideDialog();
                        }}
                    >
                        <Animated.View style={styles.mask} />
                    </TouchableWithoutFeedback>
                    {/**此处添加需要弹出的框体*/}
                    {this.props.children}
                </View>
            );
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    mask: {
        backgroundColor: '#000000',
        opacity: 0.4,
        width: SCREEN_WIDTH,
        height: WINDOW_HEIGHT,
        left: 0,
        flex: 1
    }
});

export default Mask;
