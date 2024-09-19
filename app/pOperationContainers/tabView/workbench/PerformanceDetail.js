/*
 * @Description: 绩效详情
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2022-05-29 18:32:27
 * @LastEditTime: 2024-09-12 17:32:54
 * @FilePath: /SDLMainProject36/app/pOperationContainers/tabView/workbench/PerformanceDetail.js
 */
import React, { Component } from 'react'
import { Platform, Text, View } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

@connect(({ notice })=>({
    coefficientMsgInfoResult:notice.coefficientMsgInfoResult
}))
export default class PerformanceDetail extends Component {

    // static navigationOptions = ({ navigation }) => createNavigationOptions({
    //     title: SentencedToEmpty(navigation,['state','params','title'],'绩效统计'),
    //     headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    // });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('notice/updateState')({ coefficientMsgInfoResult:{status:-1} }));
        this.props.dispatch(createAction('notice/getCoefficientMsgInfo')({
            ID:this.props.route.params.params.ID
        }))
    }

    render() {
        return (
            <StatusPage
                status={SentencedToEmpty(this.props.coefficientMsgInfoResult
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
                    {/* <Text numberOfLines={2} ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333'}}>
                        {'小王，你好！2022年4月21日-2022年5月20日绩效 信息已生成：'}
                    </Text> */}
                    {/* <Text numberOfLines={2} ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333'}}>
                        {SentencedToEmpty(this.props.coefficientMsgInfoResult,['data','Datas','msgContent'],'绩效信息：')}
                    </Text> */}
                    <Text ellipsizeMode={'tail'} style={{marginTop:10, width:SCREEN_WIDTH-40,fontSize:15,color:'#333333', lineHeight:19 }}>
                        {SentencedToEmpty(this.props.coefficientMsgInfoResult,['data','Datas','msgContent'],'绩效信息：')}
                    </Text>
                    <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'
                    ,marginTop:10}}>
                        <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'污染源气绩效套数'}</Text>
                        <Text style={{fontSize:14,color:'#FD915B',marginRight:30}}>{SentencedToEmpty(this.props.coefficientMsgInfoResult,['data','Datas','GasPerformance'],'--')}</Text>
                    </View>
                    <View style={{height:42,width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontSize:14,color:'#000000',marginLeft:10}}>{'污染源水绩效套数'}</Text>
                        <Text style={{fontSize:14,color:'#FD915B',marginRight:30}}>{SentencedToEmpty(this.props.coefficientMsgInfoResult,['data','Datas','WaterPerformance'],'--')}</Text>
                    </View>
                </View>
            </StatusPage>
        )
    }
}
