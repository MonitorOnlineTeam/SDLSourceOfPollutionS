/*
 * @Description: 督查整改记录详情
 * @LastEditors: hxf
 * @Date: 2022-11-29 09:29:42
 * @LastEditTime: 2022-12-07 09:18:24
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/SupervisionDetail.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

@connect(({ supervision })=>({
    inspectorRectificationInfoResult:supervision.inspectorRectificationInfoResult
}))
export default class SupervisionDetail extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '督查整改详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    
    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('supervision/updateState')({
            inspectorRectificationInfoResult:{status:-1}
        }));
        this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props,['inspectorRectificationInfoResult','status'],1000)}
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
                <View style={{width:SCREEN_WIDTH,flex:1}}>
                    <View style={{width:SCREEN_WIDTH,height:84
                    , paddingLeft: 20, paddingVertical:15
                    , backgroundColor:'white', marginBottom:14}}>
                        <Text numberOfLines={1} style={{fontSize:15,color:'#333333',width:SCREEN_WIDTH-30}}>
                            {`企业名称：${SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','Info',0,'EntName'],'--')}`}
                        </Text>
                        <Text numberOfLines={1} style={{fontSize:12,color:'#666666'}}>
                            {`监测点名称：${SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','Info',0,'PointName'],'--')}`}
                        </Text>
                        <View style={{
                            flexDirection:'row', width:SCREEN_WIDTH-30
                        }}>
                            <Text numberOfLines={1} style={{flex:1, fontSize:12,color:'#666666'}}>
                                {`督查人：${SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','Info',0,'InspectorName'],'--')}`}
                            </Text>
                            <Text style={{flex:1,fontSize:12,color:'#666666'}}>
                                {`督查日期：${SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','Info',0,'InspectorDate'],'xxxx-xx-xx')}`}
                            </Text>
                        </View>
                    </View>
                    <ScrollView
                        style={{width:SCREEN_WIDTH}}
                    >
                        {/* PrincipleProblemList 原则问题 */}
                        {
                            SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','PrincipleProblemList']
                                ,[]).length>0?<View style={{
                                width:SCREEN_WIDTH, backgroundColor:'white'
                                , marginBottom:14
                            }}>
                                <Text style={{
                                    fontSize:15,color:'#333333',
                                    marginTop:15, marginLeft:20
                                }}>{`原则问题`}</Text>
                                {
                                    SentencedToEmpty(this.props
                                    ,['inspectorRectificationInfoResult','data','Datas','PrincipleProblemList']
                                    ,[]).map((item,index)=>{
                                        return<TouchableOpacity
                                            style={{ marginLeft:19 }}
                                            onPress={()=>{
                                                this.props.dispatch(createAction('supervision/updateState')({
                                                    editItem:item,
                                                }));
                                                this.props.dispatch(NavigationActions.navigate({
                                                    routeName: 'SupervisionItemEditor',
                                                    params: {
                                                        title:'原则问题'
                                                    }
                                                }));
                                            }}
                                        >
                                            <View style={[{
                                                width:SCREEN_WIDTH-38
                                                , alignItems:'center', paddingVertical:15
                                            },index!=0?{borderTopWidth:1,borderTopColor:'#EAEAEA'}:{}]}>
                                                <View style={{
                                                    width:SCREEN_WIDTH-40, flexDirection:'row'
                                                    , alignItems:'flex-end'
                                                }}>
                                                    <Text style={{flex:1, fontSize:12, color:'#666666'}}>
                                                        {`${index+1}、${SentencedToEmpty(item,['ContentItem'],'----')}`}
                                                    </Text>
                                                    {
                                                        /**
                                                        1	已整改
                                                        2	未整改
                                                        3	整改通过
                                                        4	整改驳回
                                                         */
                                                        SentencedToEmpty(item,['Status'],2) ==1?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'已整改')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==2?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==3?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改通过')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==4?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改驳回')}`}</Text>
                                                        </View>
                                                        :<View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                    }
                                                    
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>:null
                        }
                        {/* importanProblemList 重点问题 */}
                        {
                            SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','importanProblemList']
                                ,[]).length>0?<View style={{
                                width:SCREEN_WIDTH, backgroundColor:'white'
                                , marginBottom:14
                            }}>
                                <Text style={{
                                    fontSize:15,color:'#333333',
                                    marginTop:15, marginLeft:20
                                }}>{`重点问题`}</Text>
                                {
                                    SentencedToEmpty(this.props
                                    ,['inspectorRectificationInfoResult','data','Datas','importanProblemList']
                                    ,[]).map((item,index)=>{
                                        return<TouchableOpacity
                                            style={{ marginLeft:19 }}
                                            onPress={()=>{
                                                this.props.dispatch(createAction('supervision/updateState')({
                                                    editItem:item,
                                                }));
                                                this.props.dispatch(NavigationActions.navigate({
                                                    routeName: 'SupervisionItemEditor',
                                                    params: {
                                                        title:'重点问题'
                                                    }
                                                }));
                                            }}
                                        >
                                            <View style={[{
                                                width:SCREEN_WIDTH-38
                                                , alignItems:'center', paddingVertical:15
                                            },index!=0?{borderTopWidth:1,borderTopColor:'#EAEAEA'}:{}]}>
                                                <View style={{
                                                    width:SCREEN_WIDTH-40, flexDirection:'row'
                                                    , alignItems:'flex-end'
                                                }}>
                                                    <Text style={{flex:1, fontSize:12, color:'#666666'}}>
                                                        {`${index+1}、${SentencedToEmpty(item,['ContentItem'],'----')}`}
                                                    </Text>
                                                    {
                                                        SentencedToEmpty(item,['Status'],2) ==1?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改通过')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==2?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==3?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改通过')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==4?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改驳回')}`}</Text>
                                                        </View>
                                                        :<View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                    }
                                                    
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>:null
                        }
                        {/* CommonlyProblemList 一般问题 */}
                        {
                            SentencedToEmpty(this.props
                                ,['inspectorRectificationInfoResult','data','Datas','CommonlyProblemList']
                                ,[]).length>0?<View style={{
                                width:SCREEN_WIDTH, backgroundColor:'white'
                                , marginBottom:14
                            }}>
                                <Text style={{
                                    fontSize:15,color:'#333333',
                                    marginTop:15, marginLeft:20
                                }}>{`一般问题`}</Text>
                                {
                                    SentencedToEmpty(this.props
                                    ,['inspectorRectificationInfoResult','data','Datas','CommonlyProblemList']
                                    ,[]).map((item,index)=>{
                                        return<TouchableOpacity
                                            style={{ marginLeft:19 }}
                                            onPress={()=>{
                                                this.props.dispatch(createAction('supervision/updateState')({
                                                    editItem:item,
                                                }));
                                                this.props.dispatch(NavigationActions.navigate({
                                                    routeName: 'SupervisionItemEditor',
                                                    params: {
                                                        title:'一般问题'
                                                    }
                                                }));
                                            }}
                                        >
                                            <View style={[{
                                                width:SCREEN_WIDTH-38
                                                , alignItems:'center', paddingVertical:15
                                            },index!=0?{borderTopWidth:1,borderTopColor:'#EAEAEA'}:{}]}>
                                                <View style={{
                                                    width:SCREEN_WIDTH-40, flexDirection:'row'
                                                    , alignItems:'flex-end'
                                                }}>
                                                    <Text style={{flex:1, fontSize:12, color:'#666666'}}>
                                                        {`${index+1}、${SentencedToEmpty(item,['ContentItem'],'----')}`}
                                                    </Text>
                                                    {
                                                        SentencedToEmpty(item,['Status'],2) ==1?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改通过')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==2?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==3?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#4AA0FF', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改通过')}`}</Text>
                                                        </View>
                                                        :SentencedToEmpty(item,['Status'],2) ==4?
                                                        <View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'整改驳回')}`}</Text>
                                                        </View>
                                                        :<View style={{
                                                            width:64, height:24, borderRadius:12
                                                            , backgroundColor:'#CCCCCC', justifyContent:'center'
                                                            , alignItems:'center', marginLeft:15
                                                        }}>
                                                            <Text style={{fontSize:12,color:'#FEFEFF'}}>{`${SentencedToEmpty(item,['StatusName'],'未整改')}`}</Text>
                                                        </View>
                                                    }
                                                    
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>:null
                        }
                    </ScrollView>
                </View>
            </StatusPage>
        )
    }
}
