/*
 * @Description: 已整改/申诉中 问题详情
 * @LastEditors: hxf
 * @Date: 2023-02-09 09:46:20
 * @LastEditTime: 2023-02-22 16:52:06
 * @FilePath: /SDLMainProject/app/pOperationContainers/KeyParameterVerification/KeyParameterVerificationProblemDetail.js
 * 
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FormHorizontalTextArea from '../../operationContainers/taskViews/taskExecution/components/FormHorizontalTextArea';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import { createNavigationOptions, SentencedToEmpty, NavigationActions, createAction } from '../../utils';

@connect(({ keyParameterVerificationModel })=>({
    verificationProblemDetailResult:keyParameterVerificationModel.verificationProblemDetailResult
}))
export default class KeyParameterVerificationProblemDetail extends Component {

    /**
     * 
     * SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Rectify'?'整改'
            :SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉':'问题描述'
     */

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '问题详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    statusPageOnRefresh = () => {
        // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            verificationProblemDetailResult:{status:-1},
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getVerificationProblemDetail')(
            {
                params:SentencedToEmpty(this.props,['navigation','state','params','requestParam',],{}),
                dispatch:this.props.dispatch
            }
        ))
    }

    onRefresh = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/getVerificationProblemDetail')(
            {
                params:SentencedToEmpty(this.props,['navigation','state','params','requestParam',],{}),
                dispatch:this.props.dispatch,
                setListData:SentencedToEmpty(this,['list','setListData'],()=>{})
                // setListData:this.list.setListData
            }
        ))
    }

    // nextPage = (index) => {
    //     let newParams = {...this.props.unsubmitParams};
    //     newParams.index = index;
    //     this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
    //         unsubmitParams:newParams,
    //     }));
    //     this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({
    //         setListData:this.list.setListData
    //     }));
    // }
    
    renderItem = ({ item, index }) => {
        const { typeName='标题'
            ,questionRemark=''
            ,questionFileList=[]
        } = item;
        item.isLast = SentencedToEmpty(this.props
                        ,['verificationProblemDetailResult','data','Datas']
                        ,[]).length == 1
        let typeID = SentencedToEmpty(this.props,['navigation','state','params','requestParam','typeID'],'')
        return(<View style={{
                width:SCREEN_WIDTH, minHeight:244
                , backgroundColor:'white'
            }}>
                <View style={{marginLeft:19, width:SCREEN_WIDTH-38}}>
                    <FormLabel label={typeName} />
                </View>
                <View style={{marginLeft:19, width:SCREEN_WIDTH-38, marginTop:10, height:48}}>
                    <FormHorizontalTextArea
                        label={'问题描述：'}
                        labelStyle={{fontSize:14,color:'#666666'}}
                        inputStyle={{fontSize:14,color:'#666666', flex:1, marginBottom:0}}
                        last={true}
                        editable={false}
                        value={questionRemark}
                    />
                </View>
                <View
                    style={{width:SCREEN_WIDTH-38, marginLeft:19}}
                >
                    <Text style={{marginTop:10, fontSize:14,color:'#666666'}}>{'问题图片：'}</Text>
                </View>
                <ImageGrid style={{ paddingHorizontal:9, paddingBottom: 10, backgroundColor: '#fff', minHeight:75  }} 
                    Imgs={questionFileList} 
                    isUpload={false} isDel={false} 
                    UUID={`123`} />
                <View style={{
                    width:SCREEN_WIDTH-38, marginLeft:19,
                    flexDirection:'row', justifyContent:'flex-end'
                    , height:38
                }}>
                    <TouchableOpacity
                        onPress={()=>{
                            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'RectifyOrAppealDetail',
                                params:{
                                    type:typeID==5?'Appeal':typeID == 4?'Rectify':'Rectify',
                                    data:item,
                                    superListData:SentencedToEmpty(this.props,['navigation','state','params','itemData'],{}),
                                }
                            }))
                        }}
                    >
                        <View style={{height:23, width:62
                        , backgroundColor:'#4AA0FF', borderRadius:10
                        , justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:12, color:'#FEFEFF'}}>{`${typeID==5?'申诉':typeID == 4?'整改':'整改'}详情`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    render() {
        let message = SentencedToEmpty(this.props,
                        ['verificationProblemDetailResult','data','Datas',0],{})
        return (<StatusPage
            status={SentencedToEmpty(this.props,
                ['verificationProblemDetailResult','status'],1000)}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.statusPageOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.statusPageOnRefresh();
            }}
        >
            <View style={{width:SCREEN_WIDTH, flex:1}}>
                <View style={{ width:SCREEN_WIDTH, height:91, backgroundColor:'white',
                    paddingVertical:15, justifyContent:'space-between'
                    , paddingHorizontal:19, marginBottom:8
                }}>
                    <Text style={{fontSize:15,color:'#333333'}}>{`企业名称：${SentencedToEmpty(message,['entName'],'----')}`}</Text>
                    <Text style={{fontSize:15,color:'#333333'}}>{`监测点名称：${SentencedToEmpty(message,['pointName'],'----')}`}</Text>
                    <View style={{width:SCREEN_WIDTH-38,flexDirection:'row'
                        , justifyContent:'space-between'
                    }}>
                        <Text numberOfLines={1} 
                            style={{width:SCREEN_WIDTH/2-31,fontSize:15,color:'#333333'}}>
                            {`核查人：${SentencedToEmpty(message,['checkUserName'],'----')}`}
                        </Text>
                        <Text numberOfLines={1} 
                            style={{width:SCREEN_WIDTH/2-19,fontSize:15,color:'#333333'}}>
                            {`核查日期：${SentencedToEmpty(message,['questionTime'],'----')=='----'?
                                '----':moment(message.questionTime).format('YYYY-MM-DD')
                            }`}
                        </Text>
                    </View>
                </View>
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        return false;
                        // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        // this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index }));
                        // this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props
                        ,['verificationProblemDetailResult','data','Datas']
                        ,[])}
                />
            </View>
        </StatusPage>
        )
    }
}
