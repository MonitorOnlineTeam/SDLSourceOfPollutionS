/*
 * @Description: 绩效消息
 * @LastEditors: hxf
 * @Date: 2022-05-29 16:14:48
 * @LastEditTime: 2022-06-01 16:53:30
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/PerformanceMessage.js
 */
import React, { Component } from 'react'
import { Platform, Text, View, Image, TouchableOpacity } from 'react-native'
import NavigationActions from 'react-navigation/src/NavigationActions';
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty, createAction } from '../../../utils';

const msgs = [
    {time:'今天13:19', message:'你的5月份绩效信息已生成，请查收'}
    ,{time:'今天11:19', message:'你的5月份绩效信息已生成，请查收', firstRead:true}
    ,{time:'今天11:19', message:'你的4月期间完成的运维工单存在待审核工单，请联系审批人进 行审批'}
] 

@connect(({ notice })=>({
    PushType:notice.PushType,
    messageInfoListResult: notice.messageInfoListResult,
    messageInfoList:notice.messageInfoList,
    messageInfoListTotal:notice.messageInfoListTotal,
    messageInfoListPageSize:notice.messageInfoListPageSize
}))
export default class PerformanceMessage extends Component {
    
    static navigationOptions = createNavigationOptions({
        title: '绩效消息',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    onRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:1 }));
        this.props.dispatch(createAction('notice/getMessageInfoList')({setListData: this.list.setListData}))
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:1, messageInfoListResult : { status: -1}}));
        this.props.dispatch(createAction('notice/getMessageInfoList')({setListData:()=>{
            /**
            设置为已读
            */
            this.props.dispatch(createAction('notice/setMessageRead')({params:{pushType:this.props.PushType}}))
        }}))
    }

    renderItem = ({item,index}) => {
        return(<View style={{width:SCREEN_WIDTH, }}>
            {
                SentencedToEmpty(item,['firstRead'],false)
                ?<View style={{width:SCREEN_WIDTH,flexDirection:'row'
                ,marginTop:45,justifyContent:'center',alignItems:'center'}}>
                    <View style={{height:1,width:30,backgroundColor:'#666666'}}></View>
                    <Text style={{fontSize:12,color:'#666666'}}>{'以下为已读消息'}</Text>
                    <View style={{height:1,width:30,backgroundColor:'#666666'}}></View>
                </View>:null
            }
            <View style={{height:38,width:SCREEN_WIDTH
            ,justifyContent:'center',alignItems:'center'}}>
                <View style={{height:18,width:128,borderRadius:9
                ,backgroundColor:'#D7D7D7',justifyContent:'center'
                ,alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'#666666'}}>{item.dateTime}</Text>
                </View>
            </View>
            <TouchableOpacity 
                onPress={()=>{
                    if (item.messageType ==1 ) {
                        // "绩效统计"
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'PerformanceDetail',
                            params: {
                                title:item.title,
                                ID:item.ID
                            }
                        }))
                    } else if (item.messageType ==2)  {
                        // "待审批工单统计"
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'ReviewWorkOrderStatistics',
                            params: {
                                title:item.title,
                                ID:item.ID
                            }
                        }))
                    }
                    
                }}
            >
                <View style={{height:85,width:SCREEN_WIDTH
                ,backgroundColor:'#FFFFFF',alignItems:'center'}}>
                    <View style={{height:45,width:SCREEN_WIDTH-40
                    ,borderBottomWidth:1,borderBottomColor:'#F3F3F3'
                    ,flexDirection:'row',alignItems:'center'
                    ,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../../../images/ic_performance_message.png')}
                            style={{height:16,width:16,marginRight:10}} />
                            <Text style={{fontSize:'#333333',fontSize:15}}>{'绩效小助手'}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:'#999999',fontSize:15,marginLeft:10}}>{'查看详情'}</Text>
                            <Image style={{width:8,height:12,tintColor:'#999999'}}
                                source={require('../../../images/right.png')}
                            />
                        </View>
                    </View>
                    <View style={{width:SCREEN_WIDTH-40,flex:1,justifyContent:'center'}}>
                        <Text numberOfLines={2} ellipsizeMode={'tail'} style={{color:'#666666',fontSize:12}}>{item.Msg}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>)
    }

    render() {
        return (<StatusPage
                backRef={true}
                status={SentencedToEmpty(this.props.messageInfoListResult
                ,['status'],200)}
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
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={this.props.messageInfoListPageSize}
                    hasMore={() => {
                        return this.props.messageInfoListTotal>this.props.messageInfoList.length;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.props.dispatch(createAction('notice/updateState')({ messageInfoListIndex:index }));
                        this.props.dispatch(createAction('notice/getMessageInfoList')({ setListData: this.list.setListData }))
                    }}
                    renderItem={this.renderItem}
                    data={this.props.messageInfoList}
                />
            </StatusPage>
        )
    }
}
