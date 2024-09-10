//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableWithoutFeedback, Animated } from 'react-native';

import { connect } from 'react-redux';

import globalcolor from '../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT, little_font_size, WINDOW_HEIGHT, NOSTATUSHEIGHT } from '../config/globalsize';
/**
 * 对比点选择dialog
 */
// create a component
@connect()
class Tabbadge extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <View style={{ width: 50, height: 49, alignItems: 'center', justifyContent: 'center' }}>
                {this.props.img}
                {this.props.badgeNum > 0 ? (
                    <View style={{ backgroundColor: 'red', minWidth: 20, height: 20, position: 'absolute', top: 6, right: 0, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', paddingLeft: 3, paddingRight: 3 }}>{this.props.badgeNum > 99 ? '99+' : this.props.badgeNum}</Text>
                    </View>
                ) : (
                    <View style={{ backgroundColor: 'red', minWidth: 10, height: 10, position: 'absolute', top: 10, right: 12, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} />
                )}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: SCREEN_HEIGHT / 2,
        width: (SCREEN_WIDTH * 3) / 4,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleContainer: {
        height: 40,
        backgroundColor: globalcolor.titleBlue,
        flexDirection: 'row',
        width: (SCREEN_WIDTH * 3) / 4 - 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    titleText: {
        color: globalcolor.white,
        fontWeight: 'bold'
    },
    closeIconTouchable: {
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4
    },
    flatlist: {
        flex: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        width: (SCREEN_WIDTH * 3) / 4 - 1
    },
    noDataComponent: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    mask: {
        backgroundColor: '#383838',
        opacity: 0.8,
        position: 'absolute',
        width: SCREEN_HEIGHT,
        height: SCREEN_HEIGHT,
        left: 0,
        top: 0
    }
});

export default Tabbadge;
