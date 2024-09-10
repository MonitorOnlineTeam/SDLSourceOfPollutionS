import React, { Component } from 'react'
import { ImageBackground, Text, View, Image, ScrollView } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../config/globalsize'
import { createNavigationOptions, SentencedToEmpty } from '../../../utils';

export default class OperationalSystemNotice extends Component {

    static navigationOptions = {
        header: null
    };

    render() {
        /**
         * {
         * ... 
         * maintain:true,
            maintenance:{
            title:系统维护公告
            subTitle：维护时间：6月25日9:30起
            start：尊敬的用户
            content：我们将于5月12日9:30起进行系统维护，预计完成时间为4-8小时。维护期间智慧运维APP、公司运维平台、智慧运维小程序将暂停使用，还请您提前做好相关安排，耐心等待。
            end：给您带来的不便…..
            sender：智慧环保
            }
         * ...
         * }
         */
        let imageWidth = SCREEN_WIDTH * 5 / 7;
        let imageHeight = imageWidth * 4 / 5;
        let message = SentencedToEmpty(this.props,['navigation','state','params'],{})
        return (
            <ImageBackground source={require('../../../images/bg_operational_notice.png')} style={{width:SCREEN_WIDTH, flex:1}}>
                <View style={{width:SCREEN_WIDTH, flex:1, alignItems:'center'}}>
                    <Text style={{ marginTop:SCREEN_HEIGHT/11, fontSize:20, color: 'white'}}>
                        {`${SentencedToEmpty(message,['title'],'')}`}
                    </Text>
                    <Text style={{ marginTop:15, fontSize:12, color: 'white'}}>
                        {`${SentencedToEmpty(message,['subTitle'],'')}`}
                    </Text>
                    <Image style={{width:imageWidth, height:imageHeight, marginTop: 38 }}
                        source={require('../../../images/img_system_logo.png')} />
                    <ScrollView style={{ width:SCREEN_WIDTH - 40, flex: 1, marginVertical: 20}}>
                        <Text style={{ fontSize:12, color: 'white' }}>{`${SentencedToEmpty(message,['start'],'')}`}</Text>
                        <Text style={{ marginTop:15, fontSize:12, color: 'white', width: SCREEN_WIDTH - 40}}>
                            {`${SentencedToEmpty(message,['content'],'')}`}
                        </Text>
                        <Text style={{ marginTop:15,fontSize:12, color: 'white', width: SCREEN_WIDTH - 40}}>
                            {`${SentencedToEmpty(message,['end'],'')}`}
                        </Text>
                        <Text style={{ marginTop:20, fontSize:12, color: 'white', width: SCREEN_WIDTH - 40, textAlign: 'right' }}>
                            {`${SentencedToEmpty(message,['sender'],'')}`}
                        </Text>
                    </ScrollView>
                </View>
            </ImageBackground>
        )
    }
}
