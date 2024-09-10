/*
 * @Description: 帮助中心
 * @LastEditors: hxf
 * @Date: 2022-09-27 10:19:00
 * @LastEditTime: 2023-02-06 16:14:30
 * @FilePath: /SDLMainProject/app/components/page/account/HelpCenter.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getRootUrl } from '../../../dvapack/storage';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';
import { StatusPage } from '../../StatusPages';

/**
 * HelpCenterClassifyList
 * HelpCenterSearchList
 *  */ 
@connect(({ helpCenter })=>({
    helpCenterResult:helpCenter.helpCenterResult
}))
export default class HelpCenter extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '帮助中心',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    componentDidMount() {
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex:1,
                helpCenterResult:{status:-1},
                firstLevel:515
            })
        );
        this.props.dispatch(createAction('helpCenter/getHelpCenterList')({
            params:{}
        }))
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex:1,
                helpCenterResult:{status:-1},
                firstLevel:515
            })
        );
        this.props.dispatch(createAction('helpCenter/getHelpCenterList')({
            params:{}
        }))
    }

    render() {
        let rootUrl = getRootUrl();
        return (<View style={{width:SCREEN_WIDTH, flex:1}}>
            <TouchableOpacity
                onPress={()=>{
                    this.props.dispatch(NavigationActions.navigate({
                        routeName:'HelpCenterSearchList',
                        params: {
                            
                        }
                    }));
                }}
            >
                <View style={{height:48,width:SCREEN_WIDTH
                , justifyContent:'center', alignItems:'center'
                , backgroundColor:'#ffffff'}}>
                    <View style={{height:29,width:SCREEN_WIDTH-27
                    , borderRadius:5, backgroundColor:'#F4F4F4'
                    , flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <Image source={require('../../../images/ic_search_help_center.png')}
                            style={{width:14, height:14, marginLeft:10}}
                        />
                        <Text style={{flex:1,color:'#999999',fontSize:14, marginLeft:5}}>{'请输入问题或关键字'}</Text>
                        <View style={{height:22, width:0.5, backgroundColor:'#E7E7E7'}}></View>
                        <Text style={{color:'#666666',fontSize:14, marginHorizontal: 10}}>{'搜索'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <StatusPage
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
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                status={this.props.helpCenterResult.status}
            >
                <ScrollView style={{width:SCREEN_WIDTH,flex:1}}>
                    {
                        SentencedToEmpty(this.props
                        ,['helpCenterResult','data','Datas','appPage','children',0,'contentList'],[]).length >0?
                        <View style={{width:SCREEN_WIDTH, backgroundColor:'#ffffff'
                        , alignItems:'center'}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName:'HelpCenterClassifyList',
                                        params: {
                                            secondLevel:SentencedToEmpty(this.props
                                            ,['helpCenterResult','data','Datas','appPage','children',0,'type'],'')
                                        }
                                    }));
                                }}
                            >
                                <View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                                , height:44, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                                , flexDirection:'row', alignItems:'center'
                                , justifyContent:'space-between'}}>
                                    <Text style={{fontSize:15,color:'#333333',fontWeight:'bold'}}>{'常见问题'}</Text>
                                    <Image source={require('../../../images/ic_arrows_right.png')}
                                        style={{width:14,height:14}}
                                    />
                                </View>
                            </TouchableOpacity>
                            {SentencedToEmpty(this.props
                            ,['helpCenterResult','data','Datas','appPage','children',0,'contentList'],[]).map((item,index)=>{
                                return(<TouchableOpacity
                                    key={`${SentencedToEmpty(this.props
                                            ,['helpCenterResult','data','Datas','appPage','children',0,'type'],'')}-${index}`}
                                    onPress={()=>{
                                        //  修改前 title:item.QuestionName
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl+'/appoperation/appQuestionDetail/'+item.ID, title: '帮助中心', item, reloadList: () => {} } }));
                                    }}
                                ><View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                                , minHeight:43, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                                , flexDirection:'row', alignItems:'center'
                                , justifyContent:'space-between'}}>
                                    <Text style={{fontSize:14,color:'#333333', lineHeight:16
                                        , marginVertical:12}}>{`${item.QuestionName}`}</Text>
                                </View></TouchableOpacity>)
                            })}
                        </View>:null
                    }
                    {
                        SentencedToEmpty(this.props
                        ,['helpCenterResult','data','Datas','appPage','children',1,'contentList'],[]).length>0?
                        <View style={{width:SCREEN_WIDTH, backgroundColor:'#ffffff'
                        , alignItems:'center', marginTop:10}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName:'HelpCenterClassifyList',
                                        params: {
                                            secondLevel:SentencedToEmpty(this.props
                                            ,['helpCenterResult','data','Datas','appPage','children',1,'type'],'')
                                        }
                                    }));
                                }}
                            >
                                <View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                                , height:44, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                                , flexDirection:'row', alignItems:'center'
                                , justifyContent:'space-between'}}>
                                    <Text style={{fontSize:15,color:'#333333',fontWeight:'bold'}}>{'功能使用'}</Text>
                                    <Image source={require('../../../images/ic_arrows_right.png')}
                                        style={{width:14,height:14}}
                                    />
                                </View>
                            </TouchableOpacity>
                            {SentencedToEmpty(this.props
                            ,['helpCenterResult','data','Datas','appPage','children',1,'contentList'],[]).map((item,index)=>{
                                return(<TouchableOpacity
                                    key={`${SentencedToEmpty(this.props
                                            ,['helpCenterResult','data','Datas','appPage','children',0,'type'],'')}-${index}`}
                                    onPress={()=>{
                                        //  修改前 title:item.QuestionName 
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl+'/appoperation/appQuestionDetail/'+item.ID, title: '帮助中心', item, reloadList: () => {} } }));
                                    }}
                                ><View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                                , minHeight:43, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                                , flexDirection:'row', alignItems:'center'
                                , justifyContent:'space-between'}}>
                                    <Text style={{fontSize:14,color:'#333333', lineHeight:16
                                        , marginVertical:12}}>{`${item.QuestionName}`}</Text>
                                </View></TouchableOpacity>)
                            })}
                        </View>:null
                    }
                </ScrollView>
            </StatusPage>
        </View>)
    }
}
