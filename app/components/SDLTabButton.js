/*
 * @Description: tabview 切换按钮
 * @LastEditors: hxf
 * @Date: 2024-09-09 09:46:04
 * @LastEditTime: 2024-09-09 09:54:47
 * @FilePath: /SDLMainProject/app/components/SDLTabButton.js
 */
import { Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

export default class SDLTabButton extends Component {
    render() {
        const { topButtonWidth, selected = false
            , label = '缺少label设置'
            , onPress = () => { }
        } = this.props;
        return (
            <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                    onPress={() => {
                        onPress();
                    }}
                >
                    <View
                        style={[{
                            width: topButtonWidth, height: 44
                            , alignItems: 'center'
                        }]}
                    >
                        <View style={[{
                            width: topButtonWidth, height: 42
                            , alignItems: 'center', justifyContent: 'center'
                        }]}>
                            <Text style={[{
                                fontSize: 15
                                , color: selected ? '#4AA0FF' : '#666666'
                            }]}>{label}</Text>
                        </View>
                        <View style={[{
                            width: 40, height: 2
                            , backgroundColor: selected ? '#4AA0FF' : 'white'
                        }]}>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}