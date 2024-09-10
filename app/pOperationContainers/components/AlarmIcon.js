import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

/**
 * 报警铃铛
 * @param {*} param0
 */
export const AlarmIcon = ({ style, imageStyle, Alarm, color = '#f07270' }) =>
    Alarm ? (
        <Animatable.View
            style={style}
            duration={2000} //动画时长
            useNativeDriver={true} //使用机子内部处理动画提升效率，但是不支持某些动画
            direction="reverse" //动画反向
            easing="ease" //重复动画的样式，0-1-0-1
            animation="swing" //动画格式抖动
            iterationCount="infinite" //执行时长，重复执行
        >
            <Image style={[{ width: 18, height: 18, tintColor: color }, imageStyle]} source={require('../../images/ic_alarm_icon.png')} />
        </Animatable.View>
    ) : null;

export default AlarmIcon;
