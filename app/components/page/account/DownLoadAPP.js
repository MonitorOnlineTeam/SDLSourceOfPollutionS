/*
 * @Description: 下载App
 * @LastEditors: hxf
 * @Date: 2023-04-19 10:54:51
 * @LastEditTime: 2023-04-19 11:20:52
 * @FilePath: /SDLMainProject34/app/components/page/account/DownLoadAPP.js
 */
import React, { Component } from 'react'
import { Text, View, Image, Platform } from 'react-native'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createNavigationOptions } from '../../../utils';

export default class DownLoadAPP extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '下载应用',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    render() {
        return (
            <View style={[{width:SCREEN_WIDTH, flex:1, alignItems:'center'}]}>
                <Image source={require('../../../images/img_app_install.png')} 
                    style={[{width:SCREEN_WIDTH*3/5, height:SCREEN_WIDTH*3/5
                        , marginTop:SCREEN_WIDTH/5
                    }]}
                    resizeMethod={'resize'}
                    resizeMode={'contain'}
                />
            </View>
        )
    }
}
