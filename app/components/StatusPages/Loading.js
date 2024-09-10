import React from 'react';
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/globalsize';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        loadingHint: '加载中…',
        indicatorColor: 'white',
        containerBgColor: 'rgba(102,102,102, 0.4)'
    };

    render() {
        let hasHint = this.props.loadingHint && this.props.loadingHint !== '';
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} transparent={true} onRequestClose={() => this.onRequestClose()}>
                <View style={[styles.loading, { backgroundColor: this.props.containerBgColor }]}>
                    <ActivityIndicator color={this.props.indicatorColor} />
                    {hasHint ? <Text style={[styles.loadingTitle, this.props.hintStyle]}>{this.props.loadingHint}</Text> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        height: 80,
        width: 120,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: SCREEN_HEIGHT / 2 - 40,
        marginLeft: SCREEN_WIDTH / 2 - 60
    },
    loadingTitle: {
        marginTop: 10,
        fontSize: 14,
        color: 'white'
    }
});
