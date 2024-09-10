//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, TouchableOpacity } from 'react-native';
// import JPushModule from 'jpush-react-native';
import { setSilenceTime } from 'react-native-alipush';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import globalcolor from '../../../config/globalcolor';
import { savePushSetting, getPushSetting } from '../../../dvapack/storage';

/**
 *推送设置
 *HelenChen
 * @class PushSetting
 * @extends {PureComponent}
 */
class PushSetting extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: '推送设置',
        tabBarLable: '推送设置',
        animationEnabled: false,
        headerBackTitle: null,
        headerTintColor: '#ffffff',
        headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            marginRight: Platform.OS === 'android' ? 76 : 0
        }, //标题居中
        headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 45 },
        labelStyle: { fontSize: 14 }
    });
    constructor(props) {
        super(props);
        let pushSetting = getPushSetting();
        if (!pushSetting) {
            this.state = {
                voive: 'on',
                vibrate: 'on',
                underline: 'off'
            };
        } else {
            let soundEnable = 'on',
                vibrateEnable = 'on',
                _underline = 'off';
            if (pushSetting.soundEnable) {
                soundEnable = 'on';
            } else {
                soundEnable = 'off';
            }
            if (pushSetting.vibrateEnable) {
                vibrateEnable = 'on';
            } else {
                vibrateEnable = 'off';
            }
            if (!pushSetting.vibrateEnable && !pushSetting.soundEnable) {
                _underline = 'on';
            } else {
                _underline = 'off';
            }
            this.state = {
                voive: soundEnable,
                vibrate: vibrateEnable,
                underline: _underline
            };
        }
    }
    voicesetting = item => {
        switch (item) {
            case 'underline':
                if (this.state.underline == 'on') {
                    this.setState({ underline: 'off', vibrate: 'on', voive: 'on' });
                    this.savePushSetting(true, true);
                } else {
                    this.setState({ underline: 'on', voive: 'off', vibrate: 'off' });
                    this.savePushSetting(false, false);
                }
                break;
        }
    };

    savePushSetting = async (voive, vibrate) => {
        await savePushSetting({ soundEnable: voive, vibrateEnable: vibrate });
        //设置提醒方式 setSoundAndVibrate(soundEnable,vibrateEnable)
        //推送时必须设置 通知栏样式编号 为 1 才有效
        if (!voive && !vibrate) {
            setSilenceTime({ startTime: '00:00', endTime: '23:59' });
        } else {
            setSilenceTime({ startTime: '00:00', endTime: '00:00' });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        height: 45,
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10
                    }}
                >
                    <Text style={{ backgroundColor: '#f2f2f2', height: 1, marginLeft: 5, marginRight: 5 }} />

                    <TouchableOpacity
                        onPress={() => {
                            this.voicesetting('underline');
                        }}
                    >
                        <View style={styles.usertype}>
                            <Text style={{ fontSize: 14, color: '#333333', marginLeft: 20, flex: 1 }}>勿扰模式</Text>
                            <Image
                                source={
                                    this.state.underline == 'off'
                                        ? require('./../../../images/bt_off.png')
                                        : require('./../../../images/bt_on.png')
                                }
                                style={{ width: 45, height: 22, marginRight: 34 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    usertype: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        borderBottomColor: '#fefefe',
        borderBottomWidth: 1,
        height: 45,
        alignItems: 'center'
    }
});

//make this component available to the app
export default PushSetting;
