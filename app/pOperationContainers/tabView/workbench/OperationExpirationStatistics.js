/*
 * @Description: 运营到期统计
 * @LastEditors: hxf
 * @Date: 2022-05-29 20:50:03
 * @LastEditTime: 2022-06-01 14:11:03
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/OperationExpirationStatistics.js
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Platform, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

@connect(({notice})=>({
    operationInfoListResult:notice.operationInfoListResult
}))
export default class OperationExpirationStatistics extends Component {

    static navigationOptions = createNavigationOptions({
        title: '运营到期统计',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () =>{
        this.props.dispatch(createAction('notice/updateState')({ operationInfoListResult : { status: -1}}));
        this.props.dispatch(createAction('notice/getOperationInfoList')({
            ID:this.props.navigation.state.params.ID
        }));
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.operationInfoListResult
                ,['status'],1000)}
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
                <View style={{width:SCREEN_WIDTH, alignItems:'center'}}>
                    <Text numberOfLines={2} ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333'}}>
                        {`${moment(this.props.navigation.state.params.PushTime).format('YYYY-MM-DD')}运营到期的监测点信息统计`}
                    </Text>
                    <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,flexDirection:'row',alignItems:'center',marginTop:10}}>
                        <View style={{height:42,flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:14,color:'#000000'}}>{'企业名称'}</Text>
                        </View>
                        <View style={{height:42,flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:14,color:'#000000'}}>{'监测点名称'}</Text>
                        </View>
                        <View style={{height:42,flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:14,color:'#000000'}}>{'项目号'}</Text>
                        </View>
                    </View>
                    <ScrollView style={{width:SCREEN_WIDTH,paddingHorizontal:10}}>
                        {
                            SentencedToEmpty(this.props.operationInfoListResult
                            ,['data','Datas'],[]).map((item,index)=>{
                                return(<View style={{height:40,width:SCREEN_WIDTH-20,backgroundColor:'white'
                                ,flexDirection:'row',alignItems:'center',borderTopWidth:1, borderTopColor:'#F3F3F3'}}>
                                    <View style={{height:40,flex:1,justifyContent:'center',alignItems:'center',paddingLeft:10}}>
                                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#666666'}}>{item.entName}</Text>
                                    </View>
                                    <View style={{height:40,flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#666666'}}>{item.pointName}</Text>
                                    </View>
                                    <View style={{height:40,flex:1,justifyContent:'center',alignItems:'center'}}>
                                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:14,color:'#666666'}}>{item.projectCode}</Text>
                                    </View>
                                </View>)
                            })
                        }
                    </ScrollView>
                </View>
            </StatusPage>
            
        )
    }
}
