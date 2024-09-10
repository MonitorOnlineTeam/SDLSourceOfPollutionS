
import React, { Component } from 'react'
import { Platform, Text, View, Image, TouchableOpacity } from 'react-native'
import NavigationActions from 'react-navigation/src/NavigationActions';
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';

const msgs = [
    {time:'今天13:19', message:'xxxxxxxxxx有限公司-窑头2022-05-17被更换了SO2，有效期 为2022-05-17，请到期及时更换。'}
    ,{time:'今天11:19', message:'xxxxxxxxxx有限公司-窑头2022-05-17被更换了SO2，有效期 为2022-05-17，请到期及时更换。', firstRead:true}
    ,{time:'今天11:19', message:'xxxxxxxxxx有限公司-窑头2022-05-17被更换了SO2，有效期 为2022-05-17，请到期及时更换。'}
] 

@connect(({ notice })=>({
    PushType:notice.PushType,
    messageInfoListResult: notice.messageInfoListResult,
    messageInfoList:notice.messageInfoList,
    messageInfoListTotal:notice.messageInfoListTotal,
    messageInfoListPageSize:notice.messageInfoListPageSize
}))
export default class ReplaceReminder extends Component {
    
    static navigationOptions = createNavigationOptions({
        title: '更换提醒',
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
            <View >
                <View style={{height:105,width:SCREEN_WIDTH
                ,backgroundColor:'#FFFFFF',alignItems:'center'}}>
                    <View style={{height:45,width:SCREEN_WIDTH-40
                    ,borderBottomWidth:1,borderBottomColor:'#F3F3F3'
                    ,flexDirection:'row',alignItems:'center'
                    ,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../../../images/ic_msg_replace.png')}
                            style={{height:16,width:16,marginRight:10}} />
                            <Text style={{fontSize:'#333333',fontSize:15}}>{'标气更换提醒'}</Text>
                        </View>
                    </View>
                    <View style={{width:SCREEN_WIDTH-40,flex:1,justifyContent:'center'}}>
                        <Text numberOfLines={2} ellipsizeMode={'tail'} style={{color:'#666666',fontSize:12}}>{item.Msg}</Text>
                    </View>
                </View>
            </View>
        </View>)
    }

    render() {
        return (<StatusPage
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