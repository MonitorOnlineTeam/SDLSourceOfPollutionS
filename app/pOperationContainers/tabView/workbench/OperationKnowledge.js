import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { StatusPagem, SimpleLoadingComponent, Touchable } from '../../../components';

/**
 * 运维知识库
 * @class OperationKnowledge
 * @extends {Component}
 */
@connect()
export default class OperationKnowledge extends Component {
    static navigationOptions = createNavigationOptions({
        title: '运维知识库',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return <View />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
