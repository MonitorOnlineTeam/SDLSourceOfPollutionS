/*
 * @Description: 关键参数核查 整改/申诉记录 
 * @LastEditors: hxf
 * @Date: 2023-02-08 17:08:13
 * @LastEditTime: 2023-02-09 09:25:30
 * @FilePath: /SDLMainProject/app/pOperationContainers/KeyParameterVerification/RectifyOrAppealRecord.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, View } from 'react-native'
import { StatusPage } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FormHorizontalTextArea from '../../operationContainers/taskViews/taskExecution/components/FormHorizontalTextArea';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import { createNavigationOptions } from '../../utils';

export default class RectifyOrAppealRecord extends Component {

    static navigationOptions = createNavigationOptions({
        title: '整改/申诉记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    render() {
        return (<StatusPage
            status={200}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                // this.onFreshData();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.onFreshData();
            }}
        >
            <ScrollView style={{width:SCREEN_WIDTH}}>
                <View style={{width:SCREEN_WIDTH,height:44, backgroundColor:'white', marginBottom:10}}>
                    <View style={{width:SCREEN_WIDTH-42, marginLeft:21}}>
                        <FormLabel label={'1、上位机量程与参数设置照片'} last={true} />
                    </View>
                </View>
                <View style={{width:SCREEN_WIDTH,minHeight:395, backgroundColor:'white', marginBottom:10}}>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`核查人：${'王小山'}`}</Text>
                    </View>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`提交时间：${'2023-01-30  11:12'}`}</Text>
                    </View>
                    <View style={{marginLeft:19, width:SCREEN_WIDTH-38, marginTop:10, height:48}}>
                        <FormHorizontalTextArea
                            label={'问题描述：'}
                            labelStyle={{fontSize:14,color:'#666666'}}
                            inputStyle={{fontSize:14,color:'#666666', flex:1, marginBottom:0}}
                            last={true}
                            editable={false}
                            value={'问题描述内容测试文字'}
                        />
                    </View>
                    <View
                        style={{width:SCREEN_WIDTH-38, marginLeft:19}}
                    >
                        <Text style={{marginTop:10, fontSize:14,color:'#666666'}}>{'问题图片：'}</Text>
                    </View>
                    <ImageGrid style={{ paddingHorizontal:9, paddingBottom: 10, backgroundColor: '#fff', minHeight:75  }} 
                        Imgs={[]} 
                        isUpload={false} isDel={false} 
                        UUID={`problemImage${new Date().getTime()}`} />
                    <View style={{width:SCREEN_WIDTH-38, marginLeft:19
                        , height:1, backgroundColor:'#EAEAEA'
                    }}/>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`运维人：${'王小山'}`}</Text>
                    </View>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`提交时间：${'2023-01-30  11:12'}`}</Text>
                    </View>
                    <View style={{marginLeft:19, width:SCREEN_WIDTH-38, marginTop:10, height:48}}>
                        <FormHorizontalTextArea
                            label={'整改描述：'}
                            labelStyle={{fontSize:14,color:'#666666'}}
                            inputStyle={{fontSize:14,color:'#666666', flex:1, marginBottom:0}}
                            last={true}
                            editable={false}
                            value={'问题描述内容测试文字'}
                        />
                    </View>
                    <View
                        style={{width:SCREEN_WIDTH-38, marginLeft:19}}
                    >
                        <Text style={{marginTop:10, fontSize:14,color:'#666666'}}>{'整改图片：'}</Text>
                    </View>
                    <ImageGrid style={{ paddingHorizontal:9, paddingBottom: 10, backgroundColor: '#fff', minHeight:75  }} 
                        Imgs={[]} 
                        isUpload={false} isDel={false} 
                        UUID={`problemImage${new Date().getTime()}`} />
                </View>
            </ScrollView>
        </StatusPage>)
    }
}
