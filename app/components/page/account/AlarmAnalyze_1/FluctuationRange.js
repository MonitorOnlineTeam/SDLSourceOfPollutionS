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
export default class FluctuationRange extends Component {
    static navigationOptions = createNavigationOptions({
        title: '波动范围',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.props.dispatch(
            createAction('alarmAnaly/GetRangePollutantListByDgimn')({
                DGIMNs: this.props.navigation.state.params.DGIMN
            })
        );
        this.props.dispatch(
            createAction('alarmAnaly/GetPointParamsRange')({
                DGIMN: this.props.navigation.state.params.DGIMN
            })
        );
    };

    render() {
        const PollutantArr = SentencedToEmpty(this.props.AlarmChartPollutant, ['data', 'Datas'], []);
        const fluctuationRange = SentencedToEmpty(this.props.fluctuationRange, ['data', 'Datas', 'range'], {});
        let data = SentencedToEmpty(this.props.fluctuationRange, ['data', 'Datas', 'image'], {});
        console.log('PollutantArr = ', PollutantArr);
        console.log('data = ', data);
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
                    {this.props.fluctuationRange.status == 200 && PollutantArr.length > 0 ? (
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', justifyContent: 'center' }}>
                            {PollutantArr.map(item => {
                                if (SentencedToEmpty(fluctuationRange, [item.PollutantCode, [0]], '').length != '') {
                                    return (
                                        <View style={{ marginTop: 10, height: 30, marginTop: 10 }}>
                                            <Text>{`${item.PollutantName}:${fluctuationRange[item.PollutantCode][0]}-${fluctuationRange[item.PollutantCode][1]}${item.Unit}`}</Text>
                                        </View>
                                    );
                                }
                            })}
                        </View>
                    ) : null}
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
