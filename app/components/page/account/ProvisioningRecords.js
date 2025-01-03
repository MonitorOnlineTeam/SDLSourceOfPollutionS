/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-07-25 16:06:38
 * @LastEditTime: 2024-12-25 16:26:07
 * @FilePath: /SDLSourceOfPollutionS_dev/app/components/page/account/ProvisioningRecords.js
 */
import React, { Component } from 'react'
import { ImageBackground, Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createNavigationOptions, NavigationActions, SentencedToEmpty, createAction } from '../../../utils';
import FlatListWithHeaderAndFooter from '../../FlatListWithHeaderAndFooter';

@connect(({ provisioning }) => ({
    personalCenterOrderInfoResult: provisioning.personalCenterOrderInfoResult,
    point: provisioning.point
}))
export default class ProvisioningRecords extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '开通记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        this.props.dispatch(createAction('provisioning/getPersonalCenterOrderInfo')({}));
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('provisioning/updateState')({ orderID: '' }))
    }

    onRefresh = () => {
        this.props.dispatch(createAction('provisioning/getPersonalCenterOrderInfo')({ setListData: this.list.setListData }));
    }

    render() {
        return (
            <View style={{ width: SCREEN_WIDTH, alignItems: 'center', flex: 1, backgroundColor: '#f2f2f2' }}>
                <ImageBackground source={require('../../../images/bg_provisioning_records.png')}
                    style={{
                        width: SCREEN_WIDTH - 24, height: ((SCREEN_WIDTH - 24) * 0.257)
                        , marginVertical: 10
                    }}>
                    <Text style={{
                        fontSize: 17, fontWeight: '500',
                        color: '#FFFFFF', marginTop: ((SCREEN_WIDTH - 24) * 0.09)
                        , marginLeft: 25
                    }}>{SentencedToEmpty(this.props.point, ['PointName'], '----')}</Text>
                    <Text style={{
                        fontSize: 14, color: '#FFFFFF'
                        , marginTop: 5
                        , marginLeft: 25
                    }}>{SentencedToEmpty(this.props.point, ['EntName'], '----')}</Text>
                </ImageBackground>
                <FlatListWithHeaderAndFooter
                    style={{ width: SCREEN_WIDTH, flex: 1, backgroundColor: '#f2f2f2' }}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => {
                        return (<View style={{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }}></View>);
                    }}
                    pageSize={20}
                    hasMore={() => {
                        // return this.props.alarmRecordsListData.length < this.props.alarmRecordsTotal;
                        return false;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => { }}
                    renderItem={({ item, index }) => {
                        return (
                            <View
                                style={{ width: SCREEN_WIDTH }}
                                onPress={() => {
                                }}>
                                <View style={[{
                                    height: 90, width: SCREEN_WIDTH - 24, marginLeft: 12, backgroundColor: '#fff'
                                    , borderRadius: 10
                                }]}>
                                    <ImageBackground source={require('../../../images/bg_provisioning_records_month.png')}
                                        style={{ width: 45, height: 20, marginLeft: SCREEN_WIDTH - 69, justifyContent: 'center' }}
                                    >
                                        <Text style={{
                                            width: 45, textAlign: 'center', fontSize: 14
                                            , color: '#9B6B17', fontWeight: '500'
                                        }}>{SentencedToEmpty(item, ['RenewalTime'], '--')}</Text>
                                    </ImageBackground>
                                    <View style={{ marginLeft: 20, flexDirection: 'row' }}>
                                        <Image source={SentencedToEmpty(this.props.point, ['PollutantType'], '2') == '2'
                                            ? require('../../../images/ic_waste_gas.png')
                                            : require('../../../images/ic_waste_water.png')}
                                            style={{ height: 39, width: 39 }} />
                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={{ fontSize: 12, color: '#666666' }}>{`到期时间：${SentencedToEmpty(item, ['Col1'], '----')}`}</Text>
                                            <Text style={{ fontSize: 12, color: '#666666', marginTop: 14 }}>{`开通时间：${SentencedToEmpty(item, ['CreateTime'], '----')}`}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    data={SentencedToEmpty(this.props
                        , ['personalCenterOrderInfoResult', 'data', 'Datas'], [])}
                />
            </View>
        )
    }
}
