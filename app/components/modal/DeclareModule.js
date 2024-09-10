/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-11-17 13:47:49
 * @LastEditTime: 2024-09-05 09:22:54
 * @FilePath: /SDLMainProject/app/components/modal/DeclareModule.js
 */
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

import OperationAlertDialog from './OperationAlertDialog';

/**
 * demo
 * 
 * 可选字段
 * iconColor={'black'}
 * iconStyle={{ marginRight: 0 }}
 * 
 * props.navigation.setParams({
            rightButton: (
                <DeclareModule
                    
                    options={{
                        headTitle: '说明',
                        innersHeight: 280,
                        messText: `1、日历上橙色点表示当日存在异常任务，蓝色表示当日存在正常执行的任务，绿色点表示未来某日存在运维任务；\n2、报警响应异常：监测点位设备第一次出现数据异常报警至响应报警超过3个小时；\n3、打卡异常：执行任务时打卡，超过打卡范围(1000米)；\n4、工作超时：任务单生成至结束任务超过个5小时。`,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '知道了',
                                btnStyle: { backgroundColor: '#fff' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => {
                                    alert('nihao');
                                }
                            }
                        ]
                    }}
                />
            )
        });
 */
/**
 * 说明 控件
 */

export default class DeclareModule extends Component {
    renderIcon = () => {
        let iconStyle = {};
        if (typeof this.props.iconStyle != 'undefined' && this.props.iconStyle) {
            iconStyle = this.props.iconStyle;
        }
        if (typeof this.props.contentRender != 'undefined' && this.props.contentRender) {
            return this.props.contentRender();
        } else {
            return <Image
                source={require('../../images/xinxi.png')}
                style={[{ width: 20, height: 20 }]}
            />
            // return (
            //     <Icon
            //         name="ios-information-circle-outline"
            //         style={[{ width: 18, marginRight: 16, fontSize: 20, height: 22, color: typeof this.props.iconColor != 'undefined' && this.props.iconColor ? this.props.iconColor : 'white' }, iconStyle]}
            //     />
            // );
        }
    };

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.refs.doAlert.show();
                    }}
                >
                    {this.renderIcon()}
                </TouchableOpacity>
                <OperationAlertDialog options={this.props.options} ref="doAlert" />
            </View>
        );
    }
}
