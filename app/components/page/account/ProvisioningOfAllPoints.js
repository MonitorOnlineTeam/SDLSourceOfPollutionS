/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-07-25 11:00:11
 * @LastEditTime: 2024-12-29 21:26:07
 * @FilePath: /SDLSourceOfPollutionS_dev/app/components/page/account/ProvisioningOfAllPoints.js
 */
import React, { Component } from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../../utils';
import FlatListWithHeaderAndFooter from '../../FlatListWithHeaderAndFooter';

@connect(({ provisioning }) => ({
    searchValue: provisioning.searchValue,
    personalCenterOrderResult: provisioning.personalCenterOrderResult
}))
export default class ProvisioningOfAllPoints extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '全部点位',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        this.onRefresh()
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('provisioning/updateState')({ searchValue: '' }))
        this.props.dispatch(createAction('provisioning/getPersonalCenterOrder')({}));
    }

    onRefresh = () => {
        this.props.dispatch(createAction('provisioning/getPersonalCenterOrder')({ setListData: this.list.setListData }));
    }

    render() {
        return (
            <View style={{ width: SCREEN_WIDTH, alignItems: 'center', flex: 1, backgroundColor: '#f2f2f2' }}>
                <View style={{
                    width: SCREEN_WIDTH - 40, height: 50
                    , justifyContent: 'center'
                }}>
                    <View style={{
                        height: 30, width: SCREEN_WIDTH - 40
                        , backgroundColor: 'white', borderRadius: 15, flexDirection: 'row'
                        , alignItems: 'center'
                    }}>
                        <Image source={require('../../../images/ic_search_blue.png')}
                            style={{ width: 14, height: 14, marginLeft: 10 }} />
                        <TextInput
                            value={this.props.searchValue}
                            onChangeText={(text) => {
                                this.props.dispatch(createAction('provisioning/updateState')({ searchValue: text }))
                            }}
                            style={{
                                flex: 1, height: 30, fontSize: 15, paddingVertical: 0
                                , color: '#333333'
                            }} />
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(createAction('provisioning/getPersonalCenterOrder')({}));
                            }}
                            style={{ marginHorizontal: 5 }}
                        >
                            <View style={{
                                width: 43, height: 24, borderRadius: 12
                                , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                , alignItems: 'center'
                            }}>
                                <Text style={{ color: 'white', fontSize: 14 }}>{'搜索'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
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
                            <TouchableOpacity
                                style={{ width: SCREEN_WIDTH }}
                                onPress={() => {
                                    this.props.dispatch(createAction('provisioning/updateState')({
                                        orderID: SentencedToEmpty(item, ['OrderID'], ''),
                                        point: item,
                                    }))
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'ProvisioningRecords'
                                    }))
                                }}>
                                <View style={[{
                                    height: 90, width: SCREEN_WIDTH, backgroundColor: SentencedToEmpty(item, ['expire'], false) ? '#ececec' : '#fff'
                                    , paddingLeft: 12, paddingRight: 10
                                }]}>
                                    <View style={{ width: SCREEN_WIDTH - 22, marginTop: 12, flexDirection: 'row' }}>
                                        {/* 2 废气 ；1 废水 */}
                                        <Image style={[{ height: 18, width: 18, marginLeft: 5 }]}
                                            source={SentencedToEmpty(item, ['PollutantType'], '2') == '2'
                                                ? require('../../../images/ic_waste_gas.png')
                                                : require('../../../images/ic_waste_water.png')} />
                                        <Text style={{ marginLeft: 10, color: '#333333', fontSize: 14 }}>{SentencedToEmpty(item, ['PointName'], '----')}</Text>
                                    </View>
                                    <Text style={{ marginTop: 7, fontSize: 12, color: '#666666' }}>{SentencedToEmpty(item, ['EntName'], '----')}</Text>
                                    <View style={{ marginTop: 5, width: SCREEN_WIDTH - 22, flexDirection: 'row', }}>
                                        <Text style={{ fontSize: 10, color: '#666666', flex: 1 }}>{`有效期：${SentencedToEmpty(item, ['ExpirationDate'], '----')}`}</Text>
                                        <Text style={{ fontSize: 10, color: '#666666' }}>{`开通记录 >`}</Text>
                                    </View>
                                    {
                                        SentencedToEmpty(item, ['expire'], false) ? <Image
                                            style={{ position: 'absolute', height: 60, width: 70, bottom: 12, left: SCREEN_WIDTH / 3 }}
                                            source={require('../../../images/watermark_expire.png')} />
                                            : null
                                    }
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    data={SentencedToEmpty(this.props
                        , ['personalCenterOrderResult', 'data', 'Datas', 'query'], [])}
                />
            </View>
        )
    }
}
