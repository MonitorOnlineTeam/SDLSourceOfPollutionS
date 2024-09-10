import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { SDLText, Touchable } from '../../components';
import { getToken } from '../../dvapack/storage';

/**
 *
 * @param {*} param0
 */
export const MonthBar = ({ timeStr, onPrePress, onNextPress, style }) => {
    const { UserName } = getToken();
    return (
        <View style={[{ flexDirection: 'row', width: '100%', height: 45, alignItems: 'center', justifyContent: 'space-between', paddingLeft: 13, paddingRight: 13, backgroundColor: '#fff' }, style]}>
            <SDLText fontType={'large'} style={{ color: '#333', flex: 1 }}>
                {UserName}
            </SDLText>
            <Touchable style={{ height: '100%', width: 36, justifyContent: 'center', alignItems: 'center' }} onPress={onPrePress}>
                <Image style={{ width: 14, height: 14 }} source={require('../../images/calenderLeft.png')} />
            </Touchable>
            <SDLText fontType={'small'} style={{ color: '#666' }}>
                {timeStr}
            </SDLText>
            <Touchable style={{ height: '100%', width: 36, justifyContent: 'center', alignItems: 'center' }} onPress={onNextPress}>
                <Image style={{ width: 14, height: 14 }} source={require('../../images/calendarRight.png')} />
            </Touchable>
        </View>
    );
};

export default MonthBar;
