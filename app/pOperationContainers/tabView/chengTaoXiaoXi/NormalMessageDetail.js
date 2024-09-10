/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-09-12 11:31:23
 * @LastEditTime: 2023-09-13 15:47:38
 * @FilePath: /SDLMainProject36/app/pOperationContainers/tabView/chengTaoXiaoXi/NormalMessageDetail.js
 */
import React, { Component } from 'react'
import { Platform, Text, View } from 'react-native'
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty } from '../../../utils';

export default class NormalMessageDetail extends Component {
    
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation,['state','params','viewTitle'],'消息'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    render() {
        return (
            <View style={[{width:SCREEN_WIDTH,flex:1}]}>
                <View style={[{width:SCREEN_WIDTH, backgroundColor:'white'
                    , paddingHorizontal:20
                }]}>
                    <Text
                        style={[{ fontSize:14,color:'#333333' 
                            , lineHeight:18, marginVertical:12
                            , width:SCREEN_WIDTH-40
                        }]}
                    >
                        {`${SentencedToEmpty(this.props
                            , ['navigation','state','params','title']
                            , '消息标题'
                        )}`}
                    </Text>
                </View>
                <View style={[{width:SCREEN_WIDTH, backgroundColor:'white'
                    , paddingHorizontal:20, marginTop:5
                }]}>
                    <View style={[{
                        width:SCREEN_WIDTH-40, height:44
                    }]}>
                        <View style={[{
                            width:SCREEN_WIDTH-40, height:44
                            , justifyContent:'center'
                        }]}>
                            <Text>{`消息时间:${SentencedToEmpty(this.props
                                , ['navigation','state','params','dateTime']
                                , '----'
                            )}`}</Text>
                        </View>
                    </View>
                    <View style={[{width:SCREEN_WIDTH-40, height:1, backgroundColor:'#EAEAEA'}]} />
                        <View style={[{
                            width:SCREEN_WIDTH-40, height:44
                            , justifyContent:'center'
                        }]}>
                            <Text>{`推送时间:${SentencedToEmpty(this.props
                                , ['navigation','state','params','PushTime']
                                , '----'
                            )}`}</Text>
                        </View>
                </View>
                <View style={[{width:SCREEN_WIDTH, backgroundColor:'white'
                    , paddingHorizontal:20, marginTop:5
                }]}>
                    <View style={[{
                        width:SCREEN_WIDTH-40, height:45
                    }]}>
                        <View style={[{
                            width:SCREEN_WIDTH-40, height:44
                            , justifyContent:'center'
                        }]}>
                            <Text>{'消息详情'}</Text>
                        </View>
                        <View style={[{width:SCREEN_WIDTH-40, height:1, backgroundColor:'#EAEAEA'}]} />
                    </View>
                    <Text style={[{
                        width:SCREEN_WIDTH-40, fontSize:15
                        , color:'#666666', lineHeight:19, marginVertical:12
                    }]}>
                        {`${SentencedToEmpty(this.props
                        , ['navigation','state','params','Msg']
                        , '消息内容'
                    )}`}
                    </Text>
                </View>
            </View>
        )
    }
}
