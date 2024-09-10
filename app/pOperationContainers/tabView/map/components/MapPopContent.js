import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import { connect } from 'react-redux';

import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../../../utils';
import { WindTransform, getWindDirection, getWindSpeed } from '../../../../utils/mapconfig';
import { StatusPagem, Touchable, BaseTable, SDLText } from '../../../../components';
import { getDataStatusByData } from '../../../../pollutionModels/utils';

const lineHeight = 30;
const colNum = 4;
const flexArr = [1, 1, 1, 1];

/**
 * 地图气泡数据组件
 */
@connect(({ map }) => ({
    selectPoint: map.selectPoint,
    popStatus: map.popStatus,
    popData: map.popData
}))
export default class MapPopContent extends PureComponent {
    constructor(props) {
        super(props);
    }

    /**
     * 渲染table里面的 views
     */
    renderTableItems = () => {
        const { popStatus, popData, showPollutantNum: maxPollutantNum } = this.props;
        const { MonitorPollutants: Pollutants } = this.props.selectPoint;
        let MonitorPollutants = [];
        if (Pollutants && Pollutants.length > 0) {
            MonitorPollutants = [...Pollutants];
        }

        if (popData.pollutantTypeCode == '5' || popData.pollutantTypeCode == '12') {
            MonitorPollutants.unshift({
                AlarmType: 0,
                Color: null,
                LowerValue: null,
                PollutantCode: 'PrimaryPollutant',
                PollutantName: '首要污染',
                Sort: null,
                StandardValue: null,
                StandardValueStr: null,
                Unit: '',
                UpperValue: null
            });
            MonitorPollutants.unshift({
                AlarmType: 0,
                Color: null,
                LowerValue: null,
                PollutantCode: 'AQI',
                PollutantName: 'AQI',
                Sort: null,
                StandardValue: null,
                StandardValueStr: null,
                Unit: '',
                UpperValue: null
            });
        }

        const tableItems = [];
        let windDirectionCode = getWindDirection(),
            windSpeedCode = getWindSpeed();
        if (popStatus == 200 && popData && MonitorPollutants) {
            MonitorPollutants.map((item, key) => {
                if (key >= maxPollutantNum) return;
                tableItems.push(
                    <View key={`h_${key.toString()}`} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <SDLText fontType={'small'} style={{ color: '#333' }}>
                            {item.PollutantName}
                        </SDLText>
                    </View>
                );
                let value = popData[item.PollutantCode];
                if (item.PollutantCode == windDirectionCode) {
                    if (SentencedToEmpty(popData, [windDirectionCode], '') != '' && (SentencedToEmpty(popData, [windSpeedCode], '') != '' || popData[windSpeedCode] == 0)) {
                        value = WindTransform(popData[windDirectionCode], popData[windSpeedCode]);
                    }
                }
                if (value == null || value === '' || typeof value == 'undefined') value = '--';
                let bgColor = '#fff';
                if (popData.pollutantTypeCode == '5' || popData.pollutantTypeCode == '12') {
                    if (item.PollutantCode == 'AQI') bgColor = popData['AQI_Color'] ? popData['AQI_Color'] : '#fff';
                    else bgColor = popData[`${item.PollutantCode}_LevelColor`] ? popData[`${item.PollutantCode}_LevelColor`] : '#fff';
                } else bgColor = getDataStatusByData(popData, item.PollutantCode).color;
                tableItems.push(
                    <View key={`d_${key.toString()}`} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: bgColor }}>
                        <SDLText fontType={'small'} style={{ color: '#333' }}>
                            {value}
                        </SDLText>
                    </View>
                );
            });
        }
        return tableItems;
    };

    /** 渲染具体内容 显示加载中 完成后显示具体数据 异常显示异常 暂时没做异常后重新加载 */
    renderContent = () => {
        const { popStatus } = this.props;
        if (popStatus == -1) return <ActivityIndicator color={'#999'} />;
        else if (popStatus == 200) return <BaseTable style={{ padding: 5 }} lineData={this.renderTableItems()} colNum={colNum} flexArr={flexArr} borderWidth={1} borderColor={'#efefef'} height={lineHeight} />;
        else if (popStatus == 1000) return <SDLText style={{ color: '#999' }}>{'服务器异常'}</SDLText>;
        else return <SDLText style={{ color: '#999' }}>{'网络异常'}</SDLText>;
    };

    render() {
        const { popData } = this.props;
        return (
            <View style={{ width: '100%', flex: 1, flexDirection: 'column' }}>
                <SDLText fontType={'small'} style={{ alignSelf: 'center', color: '#999' }}>
                    {popData && popData.MonitorTime ? popData.MonitorTime : '监测时间'}
                </SDLText>
                <View style={{ backgroundColor: '#efefef', height: 1, marginTop: 5 }} />
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>{this.renderContent()}</View>
            </View>
        );
    }
}
