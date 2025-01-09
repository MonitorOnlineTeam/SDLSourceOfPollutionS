import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import globalcolor from '../config/globalcolor';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../config/globalsize';

export default class GlobalLoadingView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            showState: false,
            message: '加载中...',
        };
    }

    setNewState = (state) => {
        this.setState(state);
    }

    show = (message) => {
        this.setState({ showState: true, message: message });
    }

    hide = () => {
        this.setState({ showState: false, message: 'loading结束' });
    }

    render() {
        if (this.state.showState) {
            return (
                <View
                    style={{ top: 0, left: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', backgroundColor: '#00000000', zIndex: 600 }}
                    transparent={true}
                    onRequestClose={() => this.onRequestClose()}
                >
                    <View style={{ width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator color={globalcolor.white} />
                            <Text style={{ color: 'white', fontSize: 14 }}>{this.state.message}</Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            return null;
        }
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
