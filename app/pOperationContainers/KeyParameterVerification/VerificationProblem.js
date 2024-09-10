/*
 * @Description: 关键参数核查 核查问题
 * @LastEditors: hxf
 * @Date: 2023-02-08 08:51:47
 * @LastEditTime: 2023-07-27 16:00:52
 * @FilePath: /SDLMainProject36/app/pOperationContainers/KeyParameterVerification/VerificationProblem.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, TextInput } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FormHorizontalTextArea from '../../operationContainers/taskViews/taskExecution/components/FormHorizontalTextArea';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../utils';

@connect(({ keyParameterVerificationModel })=>({
    verificationProblemDetailResult:keyParameterVerificationModel.verificationProblemDetailResult,
    rectifyVerificationProblemParams:keyParameterVerificationModel.rectifyVerificationProblemParams,
    toBeCorrectedParams:keyParameterVerificationModel.toBeCorrectedParams
}))
export default class VerificationProblem extends Component {

    static navigationOptions = createNavigationOptions({
        title: '核查问题',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            param0Images:[],
            param1Images:[],
            param2Images:[],
            param3Images:[],
            param4Images:[],
            param5Images:[],
        }
    }

    componentDidMount() {
        console.log('VerificationProblem = ',this.props);
        const type = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        console.log('type = ',type);
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            verificationProblemDetailResult:{status:-1}
        }))
        this.props.dispatch(createAction('keyParameterVerificationModel/getVerificationProblemDetail')(
            {
                params:SentencedToEmpty(this.props,['navigation','state','params','requestParams'],{}),
                dispatch:this.props.dispatch
            }
        ))
    }

    componentWillUnmount() {
        this.refreshHigherUpPage()
    }

    refreshHigherUpPage = () => {
        let newParams = {...this.props.toBeCorrectedParams};
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            toBeCorrectedParams:newParams,
            toBeCorrectedResult:{status:-1},
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            verificationProblemDetailResult:{status:-1}
        }))
        this.props.dispatch(createAction('keyParameterVerificationModel/getVerificationProblemDetail')(
            {
                params:SentencedToEmpty(this.props,['navigation','state','params','requestParams'],{}),
                dispatch:this.props.dispatch
            }
        ))
    }

    onRefresh = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/getVerificationProblemDetail')(
            {
                params:SentencedToEmpty(this.props,['navigation','state','params','requestParams'],{}),
                dispatch:this.props.dispatch,
                setListData:this.list.setListData
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

    isEdit = () =>{
        return true;
    }

    renderItem = ({ item, index }) => {
        const { 
            typeName='标题'
            ,questionRemark=''
            ,questionFileList=[]
        } = item;
        
        return(<View style={{
                width:SCREEN_WIDTH, minHeight:244
                , backgroundColor:'white'
            }}>
                <View style={{marginLeft:19, width:SCREEN_WIDTH-38}}>
                    <FormLabel label={typeName} />
                </View>
                <View style={{marginLeft:19, width:SCREEN_WIDTH-38, marginTop:10, minHeight:48}}>
                    <FormHorizontalTextArea
                        label={'问题描述：'}
                        labelStyle={{fontSize:14,color:'#666666'}}
                        inputStyle={{lineHeight:18,fontSize:14,color:'#666666', flex:1, marginBottom:0}}
                        last={true}
                        editable={false}
                        value={questionRemark}
                        numberOfLines={-1}
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
                    UUID={`param${index}${new Date().getTime()}`} />
                <View style={{
                    width:SCREEN_WIDTH-38, marginLeft:19,
                    flexDirection:'row', justifyContent:'flex-end'
                    , height:38
                }}>
                    <TouchableOpacity
                        style={{marginRight:20}}
                        onPress={()=>{
                            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                            let rectifyParams = {...this.props.rectifyVerificationProblemParams};
                            rectifyParams.isLast = SentencedToEmpty(this.props,
                                ['verificationProblemDetailResult','data','Datas'],[])
                                .length == 1
                            rectifyParams.typeID = 5;
                            rectifyParams.list=[{
                                ID:item.id,
                                Remark:'',
                                File:`appeal_image_${new Date().getTime()}`,
                                SubmitStatus:2
                            }];
                            this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                rectifyVerificationProblemParams:rectifyParams
                            }))
                            
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'AppealEditor',
                                params:item
                            }))
                        }}
                    >
                        <View style={{height:23, width:62
                        , backgroundColor:'#4AA0FF', borderRadius:10
                        , justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:12, color:'#FEFEFF'}}>{'申诉'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                            let rectifyParams = {...this.props.rectifyVerificationProblemParams};
                            rectifyParams.isLast = SentencedToEmpty(this.props,
                                ['verificationProblemDetailResult','data','Datas'],[])
                                .length == 1
                            rectifyParams.typeID = 4;
                            rectifyParams.list=[{
                                ID:item.id,
                                Remark:'',
                                File:`rectify_image_${new Date().getTime()}`,
                                SubmitStatus:2
                            }];
                            this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                rectifyVerificationProblemParams:rectifyParams
                            }))
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'RectifyEditor',
                                params:item
                            }))
                        }}
                    >
                        <View style={{height:23, width:62
                        , backgroundColor:'#4AA0FF', borderRadius:10
                        , justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:12, color:'#FEFEFF'}}>{'整改'}</Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        style={{marginLeft:20}}
                        onPress={()=>{
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'RectifyOrAppealRecord'
                            }))
                        }}
                    >
                        <View style={{height:23, width:62
                        , borderRadius:10
                        , justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:12, color:'#666666'}}>{'查看记录 >'}</Text>
                        </View>
                    </TouchableOpacity> */}
                </View>
            </View>)
    }

    render() {
        // console.log('verificationProblemDetailResult = ',this.props.verificationProblemDetailResult);
        // let message = SentencedToEmpty(this.props,['navigation','state','params','titleMessage'],{})
        let message = SentencedToEmpty(this.props,
                        ['verificationProblemDetailResult','data','Datas',0],{})
        // console.log('message = ',message);
        return (
            <StatusPage
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
                <View style={{width:SCREEN_WIDTH, height:91, marginBottom:10
                    , backgroundColor:'white', paddingHorizontal:20
                    , justifyContent:'space-around', paddingVertical:10}}>
                    <Text numberOfLines={1} style={{fontSize:15, color:'#333333'}}>{`企业名称：${SentencedToEmpty(message,['entName'],'----')}`}</Text>
                    <Text numberOfLines={1} style={{fontSize:15, color:'#333333'}}>{`监测点名称：${SentencedToEmpty(message,['pointName'],'----')}`}</Text>
                    <View style={{width:SCREEN_WIDTH-40, flexDirection:'row'
                        , justifyContent:'space-between'}}>
                        <Text numberOfLines={1} style={{fontSize:15, color:'#333333', width:(SCREEN_WIDTH-60)/2}}>{`核查人：${SentencedToEmpty(message,['checkUserName'],'----')}`}</Text>
                        <Text numberOfLines={1} style={{fontSize:15, color:'#333333', width:(SCREEN_WIDTH-40)/2}}>{`核查日期：${SentencedToEmpty(message,['questionTime'],'----')}`}</Text>
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
                    data={SentencedToEmpty(this.props,
                        ['verificationProblemDetailResult','data','Datas'],[])}
                />
            </StatusPage>
        )
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        marginBottom: 10, 
        alignItems: 'center'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.textBlack
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
})