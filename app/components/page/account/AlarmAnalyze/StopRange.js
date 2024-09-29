import React, { Component } from 'react';
import { Text, View, Platform, Image, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, ShowToast, SentencedToEmpty } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { PickerRangeDayTouchable, StatusPage, FlatListWithHeaderAndFooter } from '../../../../components';

@connect(({ alarmAnaly }) => ({
    fluctuationRange: alarmAnaly.fluctuationRange,
    AlarmChartPollutant: alarmAnaly.AlarmChartPollutant
}))
export default class StopRange extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        props.navigation.setOptions({
            title: '停运范围',
        });
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.props.dispatch(
            createAction('alarmAnaly/GetPointParamsRange')({
                DGIMN: this.props.route.params.params.DGIMN
            })
        );
    };

    render() {
        let data = SentencedToEmpty(this.props.fluctuationRange, ['data', 'Datas', 'stopImage'], {});
        return (
            <StatusPage
                status={this.props.fluctuationRange.status}
                errorBtnText={'点击重试'}
                emptyBtnText={'点击重试'}
                onErrorPress={() => {
                    this.getData();
                }}
                onEmptyPress={() => {
                    this.getData();
                }}
            >
                <ScrollView style={[{ flex: 1 }]}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                        {SentencedToEmpty(this.props.fluctuationRange, ['imageKeys'], []).map(item => {
                            return <Image style={{ width: SCREEN_WIDTH, height: 300 }} source={{ uri: data[item] }}></Image>;
                        })}
                    </View>
                </ScrollView>
            </StatusPage>
        );
    }
}
