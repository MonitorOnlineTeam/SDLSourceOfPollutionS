/*
 * @Description: 设备故障反馈记录展示页
 * @LastEditors: hxf
 * @Date: 2022-02-16 11:11:34
 * @LastEditTime: 2022-02-16 11:50:21
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/EquipmentFailureFeedbackDetail.js
 */

import React, { Component } from 'react'
import { Platform, ScrollView, Text, View } from 'react-native'
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty } from '../../../utils';

export default class EquipmentFailureFeedbackDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return  createNavigationOptions({
            title: `故障反馈记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    }

    render() {
        return (
            <ScrollView style={{width:SCREEN_WIDTH}}>
                <View style={[{ backgroundColor: '#fff' }]}>
                    {/* {this.state.downLoading == true ? <SimpleLoadingComponent message={'正在下载相关文档'} /> : null} */}
                    <View style={[{ width: SCREEN_WIDTH, height: 44, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <Text style={[{ fontSize: 14, color: '#333' }]}>* 企业/监测站</Text>
                        <Text style={[{ marginLeft: 28, fontSize: 14, color: '#666' }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'ParentName'], '--')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, height: 44, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <Text style={[{ fontSize: 14, color: '#333' }]}>* 监测点位</Text>
                        <Text style={[{ marginLeft: 28, fontSize: 14, color: '#666' }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'PointName'], '--')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, height: 44, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <Text style={[{ fontSize: 14, color: '#333' }]}>故障单元：</Text>
                        <Text style={[{ marginLeft: 28, fontSize: 14, color: '#666' }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'FaultUnitName'], '--')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, height: 44, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <Text style={[{ fontSize: 14, color: '#333' }]}>故障时间：</Text>
                        <Text style={[{ marginLeft: 28, fontSize: 14, color: '#666' }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'CreatDateTime'], '--')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, height: 44, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <Text style={[{ fontSize: 14, color: '#333' }]}>名称型号：</Text>
                        <Text style={[{ marginLeft: 28, fontSize: 14, color: '#666' }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'EquipmentName'], '--')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <View style={[{ width: SCREEN_WIDTH, height: 44, alignItems: 'center', flexDirection: 'row' }]}>
                            <Text style={[{ fontSize: 14, color: '#333' }]}>故障现象</Text>
                        </View>
                        <Text style={[{ fontSize: 14, color: '#666', lineHeight: 25, marginBottom: 11 }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'FaultPhenomenon'], '----')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <View style={[{ width: SCREEN_WIDTH, height: 44, alignItems: 'center', flexDirection: 'row' }]}>
                            <Text style={[{ fontSize: 14, color: '#333' }]}>原因分析</Text>
                        </View>
                        <Text style={[{ fontSize: 14, color: '#666', lineHeight: 25, marginBottom: 11 }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'CauseAnalysis'], '----')}</Text>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' }]}>
                        <View style={[{ width: SCREEN_WIDTH, height: 44, alignItems: 'center', flexDirection: 'row' }]}>
                            <Text style={[{ fontSize: 14, color: '#333' }]}>处理方法</Text>
                        </View>
                        <Text style={[{ fontSize: 14, color: '#666', lineHeight: 25, marginBottom: 11 }]}>{SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'ProcessingMethod'], '----')}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }
}
