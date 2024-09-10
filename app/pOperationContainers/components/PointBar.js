import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';
import { SDLText, Touchable } from '../../components';
import { getImageByType, getStatusByCode, checkAlarmByMN } from '../../pOperationModels/utils';
import AlarmIcon from './AlarmIcon';

/**
 * 站点bar
 * @export
 * @class PointBar
 * @extends {PureComponent}
 */
@connect(({ websocket }) => ({
    RealTimeAlarms: websocket.RealTimeAlarms
}))
export default class PointBar extends PureComponent {
    render() {
        const { style, DGIMN, entName = '企业名称', pointName = '站点名称', status, pollutantType, rest } = this.props;
        const Alarm = checkAlarmByMN(DGIMN, this.props.RealTimeAlarms);
        return (
            <Touchable style={[styles.container, style]} {...rest}>
                <View style={{ marginTop: 15, marginLeft: 13, marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <SDLText fontType={'normal'} style={{ color: '#333', flex: 1 }} numberOfLines={1}>
                        {entName}
                    </SDLText>
                    <AlarmIcon imageStyle={{ width: 15, height: 15 }} Alarm={Alarm} />
                    <Image style={{ width: 15, height: 15, marginLeft: 15, tintColor: getStatusByCode(status).color }} source={getImageByType(pollutantType).image} />
                </View>
                <View style={{ marginTop: 5, marginBottom: 15, flexDirection: 'row', alignItems: 'center', marginLeft: 13 }}>
                    <Image style={{ width: 13, height: 13 }} source={require('../../images/icon_location.png')} />
                    <SDLText fontType={'small'} style={{ color: '#666', flex: 1, marginLeft: 2 }} numberOfLines={1}>
                        {pointName}
                    </SDLText>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'column'
    }
});
