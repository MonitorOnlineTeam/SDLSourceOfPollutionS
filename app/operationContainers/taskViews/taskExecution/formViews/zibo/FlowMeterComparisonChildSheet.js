/*
 * @Description: 液位比对/累计流量
 * @LastEditors: hxf
 * @Date: 2025-04-22 16:07:31
 * @LastEditTime: 2025-04-23 11:17:16
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/zibo/FlowMeterComparisonChildSheet.js
 */
import { View, Text } from 'react-native'
import React from 'react'
import { SentencedToEmpty } from '../../../../../utils';
import { StatusPage } from '../../../../../components';

export default function FlowMeterComparisonChildSheet(props) {

    console.log('FlowMeterComparisonChildSheet props = ', props)
    const { navigation } = props;
    navigation.setOptions({
        title: SentencedToEmpty(props, ['route', 'params', 'params', 'title'], '流量计比对记录子表'),
    })
    return (<StatusPage
        status={200}
        errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
        errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
            //空页面按钮回调
            // this.statusPageOnRefresh();
        }}
        onErrorPress={() => {
            //错误页面按钮回调
            // this.statusPageOnRefresh();
        }}
    >
        <View>
            <Text>FlowMeterComparisonChildSheet</Text>
        </View>
    </StatusPage>)
}