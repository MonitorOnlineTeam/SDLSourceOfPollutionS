import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import globalcolor from '../config/globalcolor';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config/globalsize';

export default class SimpleLoadingComponent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        return (
            <View
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', backgroundColor: '#00000000', zIndex: 600 }}
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
            >
                <View style={{ width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator color={globalcolor.white} />
                        <Text style={{ color: 'white', fontSize: 14 }}>{this.props.message}</Text>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    loadingBox: {
        // Loading居中
        height: 80,
        width: 120,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)' // 半透明 0.5
    }
});
