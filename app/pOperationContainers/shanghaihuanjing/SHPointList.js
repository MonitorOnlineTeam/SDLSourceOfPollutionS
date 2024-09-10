/*
 * @Description: 点位列表
 * @LastEditors: hxf
 * @Date: 2023-05-08 09:00:20
 * @LastEditTime: 2023-07-10 14:59:23
 * @FilePath: /SDLMainProject36/app/pOperationContainers/shanghaihuanjing/SHPointList.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRootUrl } from '../../dvapack/storage';

import { SentencedToEmpty, createAction, NavigationActions, createNavigationOptions } from '../../utils';

@connect(({ BWModel })=>({
    IDtoOPTID:BWModel.IDtoOPTID,
    operationTaskByIDQuestionName:BWModel.operationTaskByIDQuestionName,
    getOperationTaskByIDResult:BWModel.getOperationTaskByIDResult,//运维任务信息列表 
    getOperationTaskByIDData:BWModel.getOperationTaskByIDData,//运维任务信息列表 
}))
export default class SHPointList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '运维任务',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch(createAction('BWModel/updateState')({ operationTaskByIDQuestionName:'', getOperationTaskByIDResult:{status:-1} }))
        this.refresh();
    }

    refresh = (setListData=()=>{}) => {
        this.props.dispatch(createAction('BWModel/getOperationTaskByID')({setListData:setListData}));
    }

    renderItem = ({item,index}) => {
        let rootUrl = getRootUrl();
        return(<TouchableOpacity
            key={`key${index}`}
            onPress={()=>{
                // console.log('item = ',item);
                //  修改前 title:item.QuestionName 
                // IDtoOPTID // 任务 ID
                // this.props.dispatch(createAction('BWModel/updateState')({ IDtoOPTID:item.ID }))
                // this.props.dispatch(createAction('BWModel/getOperationTaskByID')({ }))
                
                /**
                 * uploadData:{
                        noCancelFlag:true,
                        functionName:'M_InsertOperationTaskPlanLog',
                        ID:item.ID,
                        xmlParamList:[{
                            OPTPID:SentencedToEmpty(this.props,[
                                    'getOperationTaskByIDResult','data','Datas'
                                    , 'soap:Envelope', 'soap:Body', 'M_GetOperationTaskByIDResponse'
                                    , 'M_GetOperationTaskByIDResult', 'Items', 'Item'
                                    , ''
                                ],''), // 运维计划 ID
                            OTSID:SentencedToEmpty(item,['ID'],''), // 运维点位 ID
                            YWSJ:'', // 运维记录保存时间
                            YWDATE:moment().format('YYYY-MM-DD HH:mm:ss'), // 运维时间
                            ODID:'', // 运维内容 ID
                            OPCID:'1', // 运维计划周期 ID
                            YWRY:'', // 运维人员（逗号分隔如：128634,128635）
                            YWSB:'', // 运维设备（逗号分隔如：128634,128635）
                            // YWMS:'', // 异常说明（异常情况补录必填）
                            
                            PATH1:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH1_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH2:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH2_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH3:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH3_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH4:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH4_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH5:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH5_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH6:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH6_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH7:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH7_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH8:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH8_UPLOADTIME:'', //图片上传时间（真实时间）

                            X:item.LONGITUDE, // 经度
                            Y:item.LATITUDE, // 维度
                            IS_SPECIAL:0, // 是否异常补录（0 正常 1 补录）
                        }]
                    }
                 * 
                 */
                
                this.props.dispatch(createAction('BWModel/updateState')({ 
                    openationTaskTypeSelectedItems:[], //  运维任务类别 选中 清空选中状态
                    getOperationDetailSelectedItems:[], //  运维内容 选中
                    getALLWorkersSelectedItems:[], //  人员信息 选中
                    getALLDevicesSelectedItems:[], //  设备信息 选中
                    // uploadOpenationTime:moment().format('YYYY-MM-DD HH:mm'),
                    uploadOpenationTime:'',

                    uploadData:{
                        noCancelFlag:true,
                        functionName:'M_InsertOperationTaskPlanLog',
                        
                        paramList:{
                            // ID:item.ID,
                            ID:this.props.IDtoOPTID,
                        },
                        xmlParamList:[{
                            YWMS:'', // 必填 异常说明（异常情况补录必填）
                            OPTPID:'', // 运维计划 ID
                            OTSID:SentencedToEmpty(item,['ID'],''), // 运维点位 ID
                            YWSJ:'', // 运维记录保存时间
                            YWDATE:moment().format('YYYY-MM-DD HH:mm:ss'), // 运维时间
                            ODID:'', // 运维内容 ID
                            OPCID:'', // 运维计划周期 ID
                            YWRY:'', // 运维人员（逗号分隔如：128634,128635）
                            YWSB:'', // 运维设备（逗号分隔如：128634,128635）
                            
                            PATH1:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH1_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH2:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH2_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH3:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH3_UPLOADTIME:'', //图片上传时间（真实时间）
                            PATH4:'', // 图片名称（调用附件上传接口产生图片名）
                            PATH4_UPLOADTIME:'', //图片上传时间（真实时间）
                            // PATH5:'', // 图片名称（调用附件上传接口产生图片名）
                            // PATH5_UPLOADTIME:'', //图片上传时间（真实时间）
                            // PATH6:'', // 图片名称（调用附件上传接口产生图片名）
                            // PATH6_UPLOADTIME:'', //图片上传时间（真实时间）
                            // PATH7:'', // 图片名称（调用附件上传接口产生图片名）
                            // PATH7_UPLOADTIME:'', //图片上传时间（真实时间）
                            // PATH8:'', // 图片名称（调用附件上传接口产生图片名）
                            // PATH8_UPLOADTIME:'', //图片上传时间（真实时间）

                            X:item.LONGITUDE, // 经度
                            Y:item.LATITUDE, // 维度
                            IS_SPECIAL:0, // 是否异常补录（0 正常 1 补录）
                        }]
                    }
                 }))
                this.props.dispatch(NavigationActions.navigate({ routeName: 'UploadOperationInformation', params: { item } }));
                this.props.dispatch(createAction('BWModel/getOperationTaskPlanList')({ }))

                // this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl+'/appoperation/appQuestionDetail/'+item.ID, title: '帮助中心', item, reloadList: () => {} } }));
            }}
        >
            <View style={{width:SCREEN_WIDTH,backgroundColor:'white'}}>
                <View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                , minHeight:43, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                , justifyContent:'center'
                }}>
                    <Text numberOfLines={1} style={{ lineHeight:16, fontSize:15, color:'#87CEEB', lineHeight:17}}>{`${SentencedToEmpty(item,['MC'],'')}`}</Text>
                </View>
            </View>
        </TouchableOpacity>);
    }
    
    render() {
        return (<View style={{width:SCREEN_WIDTH, flex:1}}>
            <View style={{height:48,width:SCREEN_WIDTH
            , justifyContent:'center', alignItems:'center'
            , backgroundColor:'#ffffff'}}>
                <View style={{height:29,width:SCREEN_WIDTH-27
                , borderRadius:5, backgroundColor:'#F4F4F4'
                , flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <Image source={require('../../images/ic_search_help_center.png')}
                        style={{width:14, height:14, marginLeft:10}}
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'请输入搜索关键字'}
                        style={{
                            flex:1,color:'#999999',fontSize:14, marginLeft:5,
                            padding:0
                        }}
                        value={this.props.operationTaskByIDQuestionName}
                        onChangeText={text => {
                            // this.setState({
                            //     QuestionName:text
                            // });
                            this.props.dispatch(createAction('BWModel/updateState')({ operationTaskByIDQuestionName:text }))
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                        placeholderTextColor={'#999999'}
                    />
                    {/* <Text style={{flex:1,color:'#999999',fontSize:14, marginLeft:5}}>{'请输入问题或关键字'}</Text> */}
                    <View style={{height:22, width:0.5, backgroundColor:'#E7E7E7'}}></View>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.dispatch(createAction('BWModel/updateState')({ getOperationTaskByIDResult:{status:-1} }))
                            this.refresh();
                        }}
                    >
                        <Text style={{color:'#666666',fontSize:14, marginHorizontal: 10}}>{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusPage
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                status={SentencedToEmpty(this.props
                ,['getOperationTaskByIDResult','status'],200)}
                // status={200}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                        return false;
                    }}
                    onRefresh={index => {
                        this.refresh(this.list.setListData);
                    }}
                    onEndReached={index => {
                        // this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props,['getOperationTaskByIDData'],[])}
                />
            </StatusPage>
        </View>)
    }
}
