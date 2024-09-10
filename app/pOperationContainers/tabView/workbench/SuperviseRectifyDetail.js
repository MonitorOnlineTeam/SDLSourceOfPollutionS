/*
 * @Description: 督查整改详情
 * @LastEditors: hxf
 * @Date: 2023-08-06 21:19:30
 * @LastEditTime: 2023-08-08 15:28:39
 * @FilePath: /SDLMainProject36/app/pOperationContainers/tabView/workbench/SuperviseRectifyDetail.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, View } from 'react-native'
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { connect } from 'react-redux';

@connect(({ notice })=>({
    inspectorMessageResult:notice.inspectorMessageResult
}))
export default class SuperviseRectifyDetail extends Component {
    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '设施核查详情',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ inspectorMessageResult:{status:-1} }));
        this.props.dispatch(createAction('notice/getInspectorMessage')({
            ID:this.props.navigation.state.params.ID
        }))
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.inspectorMessageResult
                ,['status'],1000)}
                // status={200}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.statusPageOnRefresh();
                }}
            >
                    <View style={{width:SCREEN_WIDTH, alignItems:'center',flex:1}}>
                        <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                        ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'
                        ,marginTop:10}}>
                            <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'企业名称'}</Text>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#333333',marginRight:30}}>{SentencedToEmpty(this.props.inspectorMessageResult,['data','Datas','EntName'],'--')}</Text>
                        </View>
                        <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                        ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'
                        ,marginTop:10}}>
                            <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'监测点名称'}</Text>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#333333',marginRight:30}}>{SentencedToEmpty(this.props.inspectorMessageResult,['data','Datas','PointName'],'--')}</Text>
                        </View>
                        <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                        ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'
                        ,marginTop:10}}>
                            <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'督查人'}</Text>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#333333',marginRight:30}}>{SentencedToEmpty(this.props.inspectorMessageResult,['data','Datas','UserName'],'--')}</Text>
                        </View>
                        <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                        ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'
                        ,marginTop:10}}>
                            <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'得分'}</Text>
                            <Text style={{fontSize:14,color:'#333333',marginRight:30}}>{SentencedToEmpty(this.props.inspectorMessageResult,['data','Datas','TotalScore'],'--')}</Text>
                        </View>
                        <Text ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:18, fontWeight:'500',color:'#333333'}}>
                            督查评价:
                        </Text>
                        <ScrollView style={[{width:SCREEN_WIDTH, flex:1}]}>
                            <Text ellipsizeMode={'tail'} style={{ marginLeft:20, marginTop:4, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333', lineHeight:18}}>
                                {SentencedToEmpty(this.props.inspectorMessageResult,['data','Datas','Evaluate'],'--')}
                            </Text>
                        </ScrollView>
                    </View>
            </StatusPage>
        )
    }
}
