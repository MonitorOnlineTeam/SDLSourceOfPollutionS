import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, transformColorToTransparency } from '../../../utils';
import { getImageByType, getStatusByCode } from '../../../pollutionModels/utils';
import { StatusPage, SDLText, SimplePickerSingleTime, SimplePicker, SimpleMultipleItemPicker, SimplePickerRangeDay, FlatListWithHeaderAndFooter, Touchable } from '../../../components';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import TextLabel from '../../components/TextLabel';
import AlarmList from './AlarmList';
/**
 * 报警
 * @class Audit
 * @extends {Component}
 */
@connect()
class Alarm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '报警'
    });

    constructor(props) {
        super(props);
        this.state = {
            type: 1
        };
    }

    render() {
        return <AlarmList />;
    }
}

export default Alarm;
