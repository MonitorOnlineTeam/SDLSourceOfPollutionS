/*
 * @Description: 上传运维信息
 * @LastEditors: hxf
 * @Date: 2023-05-08 09:24:43
 * @LastEditTime: 2023-07-10 15:42:50
 * @FilePath: /SDLMainProject36/app/pOperationContainers/shanghaihuanjing/UploadOperationInformation.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast } from '../../utils';
import moment from 'moment';
import { PickerSingleTimeTouchable, SDLText, SimpleLoadingView, StatusPage } from '../../components';

const options = {
    mediaType: 'photo',
    // title: '选择照片',
    // cancelButtonTitle: '关闭',
    // takePhotoButtonTitle: '打开相机',
    // chooseFromLibraryButtonTitle: '选择照片',
    quality: 0.7,
    selectionLimit: 5,
    includeBase64: true,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

@connect(({ BWModel })=>({
    uploadData:BWModel.uploadData, // 提交数据
    loadUploadOptionStatus:BWModel.loadUploadOptionStatus,// 上传运维数据页面的选项加载状态
    uploadOpenationTime:BWModel.uploadOpenationTime,
    loadUploadImageStatus:BWModel.loadUploadImageStatus,

    openationTaskTypeSelectedItems:BWModel.openationTaskTypeSelectedItems,// 运维任务类别 选中数据
    getOperationDetailSelectedItems:BWModel.getOperationDetailSelectedItems, //  运维内容 选中
    getALLWorkersSelectedItems:BWModel.getALLWorkersSelectedItems, //  人员信息 选中
    getALLDevicesSelectedItems:BWModel.getALLDevicesSelectedItems, //  设备信息 选中

    operationPlanList:BWModel.operationPlanList, // 运维计划
    validCycleList:BWModel.validCycleList, // 有效运维周期列表
    OPCID:BWModel.OPCID, // 运维计划周期 ID
    OPTPID:BWModel.OPTPID,//运维计划 ID
}))
export default class UploadOperationInformation extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '上传运维信息',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        const inParams = SentencedToEmpty(this.props,['navigation', 'state', 'params', 'item'],{});
        this.props.dispatch(createAction('BWModel/loadUploadOption')({}))
    }

    statusPageOnRefresh = () =>{
        this.props.dispatch(createAction('BWModel/loadUploadOption')({}))
    }

    componentWillUnmount () {
        this.props.dispatch(createAction('BWModel/updateState')({
            
        }));
    }

    getCurrentDate = () =>{
        // const dateStr = SentencedToEmpty(this.props,
        //     ['uploadData', 'xmlParamList', 0, 'YWDATE'],'');
        // if (dateStr == '') {
        //     return'----';
        // } else {
        //     return moment(dateStr).format('YYYY/MM/DD');
        // }
        return moment().format('YYYY/MM/DD');
    }

    showSelectedStr = (data,type) => {
        /**
         * type
         * operationType 运维类别
         * operationContentType 运维内容
         * operationWorkers 运维人员
         * operationDevices 运维设备
         */
        if (data.length == 0) {
            return `未选中`;
        } else if (data.length == 1) {
            if (type == 'operationType') {
                return `${SentencedToEmpty(data,[0,'NAME'],'---')}`;
            } else if (type == 'operationContentType') {
                return `${SentencedToEmpty(data,[0,'DETAILNAME'],'---')}`;
            } else if (type == 'operationWorkers') {
                return `${SentencedToEmpty(data,[0,'XM'],'---')}`;
            } else if (type == 'operationDevices') {
                return `${SentencedToEmpty(data,[0,'SBMC'],'---')}`;
            }
        } else {
            if (type == 'operationType') {
                //'3个内容被选中'
                return `${data.length}个运维项被选中`;
            } else if (type == 'operationContentType') {
                return `${data.length}个运维内容被选中`;
            } else if (type == 'operationWorkers') {
                return `${data.length}个运维人员被选中`;
            } else if (type == 'operationDevices') {
                return `${data.length}个运维设备被选中`;
            } else {
                return `选中：(${data.length})项`;
            }
        }
    }

    getTimePickerOption = () => {
        // console.log('this.props.uploadOpenationTime = ',this.props.uploadOpenationTime);
        return {
            defaultTime: this.props.uploadOpenationTime == ''?'':moment(this.props.uploadOpenationTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'minute',
            beforeCheck: ()=> {
                const { uploadData } = this.props;
                // newUploadData.xmlParamList[0].OPTPID
                const OPTPID = SentencedToEmpty(uploadData,['xmlParamList',0,'OPTPID'],'');
                if (OPTPID == '') {
                    ShowToast('先选择运维内容，才能选择运维时间');
                    return false;
                } else {
                    return true;
                }
            },
            onSureClickListener: time => {
                /**
                 *  ID 周期 ID
                    OPTID 任务 ID
                    OPTPID 任务计划 ID
                    CYCLENUM 执行序号
                    START_DATE 执行开始日期
                    END_DATE 执行结束日期
                 * 
                 */
                let findIndex;
                const { validCycleList } = this.props;
                let matchingList = [];
                validCycleList.map((innerList,innerListIndex)=>{
                    findIndex = innerList.findIndex((item,index)=>{
                        // console.log('START_DATE = ',SentencedToEmpty(item,['START_DATE'],''));
                        // console.log('END_DATE = ',SentencedToEmpty(item,['END_DATE'],''));
                        // console.log('isBefore = ',moment(SentencedToEmpty(item,['START_DATE'],'')).isBefore(moment(time)));
                        // console.log('isAfter = ',moment(SentencedToEmpty(item,['END_DATE'],'')).isAfter(moment(time)));
                        
                        if (SentencedToEmpty(item,['START_DATE'],'')!=''
                            &&SentencedToEmpty(item,['END_DATE'],'')!=''
                            &&moment(SentencedToEmpty(item,['START_DATE'],'')).isBefore(moment(time))
                            &&moment(SentencedToEmpty(item,['END_DATE'],'')).isAfter(moment(time))
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (findIndex == -1) {
                        matchingList.push(null);
                    } else {
                        matchingList.push(innerList[findIndex]);
                    }
                });
                let OPCIDStr = '', everyThingIsFine = true;
                matchingList.map((matchingItem,matchingIndex)=>{
                    if (matchingItem == null) {
                    // if (true) {
                        console.log('您选择的时间没有落入运维计划的运维周期内');
                        everyThingIsFine = false;
                        return;
                    } else {
                        if (OPCIDStr == '') {
                            OPCIDStr = '' + matchingItem.ID;// 运维计划周期 ID
                        } else {
                            OPCIDStr = OPCIDStr + `,${matchingItem.ID}`;// 运维计划周期 ID
                        }
                    }
                });
                if (everyThingIsFine) {
                    console.log('matchingList 循环后的代码 OPCIDStr = ',OPCIDStr);
                    const newUploadData =  {...SentencedToEmpty(this.props,['uploadData'],{})};
                    //         OPCID, // 运维计划周期 ID
                    //         OPTPID,//运维计划 ID
                    newUploadData.xmlParamList[0].OPCID = OPCIDStr;
                    newUploadData.xmlParamList[0].YWDATE = time;

                    this.props.dispatch(
                        createAction('BWModel/updateState')({
                            uploadData:newUploadData,
                            OPCID:OPCIDStr, // 运维计划周期 ID
                            uploadOpenationTime: moment(time).format('YYYY-MM-DD HH:mm')
                        })
                    );
                } else {
                    ShowToast('您选择的时间没有落入运维计划的运维周期内');
                }
            }
        };
    }

    /* 渲染底部按钮 */
    renderBottomBtn = () => {
        return (
            <View style={{ width: SCREEN_WIDTH, height: 56, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 13, paddingRight: 13, paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff' }}>
                <TouchableOpacity
                    style={{ backgroundColor: '#339afe', borderRadius: 4, height: '100%', width: SCREEN_WIDTH - 13 - 13, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        // console.log(this.props.uploadData);
                        if ( SentencedToEmpty(this.props
                            ,['uploadData','xmlParamList',0,'OPTPID'],'') == '' ) {
                            ShowToast('运维类别不能为空'); // 运维计划 ID
                            return;
                        }
                        if ( SentencedToEmpty(this.props
                            ,['uploadData','xmlParamList',0,'ODID'],'') == '' ) {
                            ShowToast('运维内容不能为空'); // 运维内容 ID
                            return;
                        }
                        if ( SentencedToEmpty(this.props
                            ,['uploadData','xmlParamList',0,'YWRY'],'') == '' ) {
                            ShowToast('运维人员不能为空'); // 运维人员（逗号分隔如：128634,128635）
                            return;
                        }
                        if ( SentencedToEmpty(this.props
                            ,['uploadData','xmlParamList',0,'YWSB'],'') == '' ) {
                            ShowToast('运维设备不能为空'); // 运维设备（逗号分隔如：128634,128635）
                            return;
                        }
                        
                        const entity = SentencedToEmpty(this.props
                            ,['uploadData','xmlParamList',0,],{});
                        let hasImage = false;
                        // [1,2,3,4,5,6,7,8].map((item)=>{
                        [1,2,3,4].map((item)=>{
                            if (entity[`PATH${item}`]!='') {
                                hasImage = true;
                            }
                        });
                        if (!hasImage) {
                            ShowToast('至少要上传一张图片'); // 运维设备（逗号分隔如：128634,128635）
                            return;
                        }
                        const newUploadData =  {...SentencedToEmpty(this.props,['uploadData'],{})};
                        newUploadData.xmlParamList[0].YWSJ = moment()
                            // .subtract(5,'minute')
                            .format('YYYY-MM-DD HH:mm:ss');
                        this.props.dispatch(createAction('BWModel/updateState')({
                            uploadData:newUploadData
                        }));
                        // 调用提交接口
                        this.props.dispatch(createAction('BWModel/insertOperationTaskPlanLog')({}))
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: '#fff' }}>
                        {'上传'}
                    </SDLText>
                </TouchableOpacity>
            </View>
        );
    };

    renderImage = (item,index)=>{
        return(<View style={[{
            marginBottom:12,
            width:(SCREEN_WIDTH-136)/2,
            height:(SCREEN_WIDTH-136)/2
            , borderWidth:1
            , backgroundColor:'#ededed'
            , justifyContent:'center', alignItems:'center'
        }]}
        >
            {
                SentencedToEmpty(this.state
                    ,[`showImage${index+1}Uri`],'')==''
                ?<Image 
                    style={[{
                        width:(SCREEN_WIDTH-136)/2-20,
                        height:(SCREEN_WIDTH-136)/2-20
                    }]}
                    source={require('../../images/jiarecord.png')} 
                />
                :<Image 
                    resizeMethod={'resize'}
                    style={[{
                        width:(SCREEN_WIDTH-136)/2,
                        height:(SCREEN_WIDTH-136)/2
                    }]}
                    source={{uri:this.state[`showImage${index+1}Uri`]}} 
                />
            }
            {   SentencedToEmpty(this.props
                    ,['uploadData','xmlParamList',0
                        ,`PATH${index+1}`
                    ],''
                )!=''?
                <TouchableOpacity 
                    onPress={()=>{
                        console.log('close');
                        let stateParams = {};
                        stateParams[`showImage${index+1}Uri`] = ''

                        let newUploadData  = {...this.props.uploadData};
                        newUploadData['xmlParamList'][0][`PATH${index+1}`] = '';
                        newUploadData['xmlParamList'][0][`PATH${index+1}_UPLOADTIME`] = '';
                        this.props.dispatch(createAction('BWModel/updateState')({uploadData:newUploadData}));
                        this.setState(stateParams);
                    }}
                    style={[{
                        position:'absolute', top:-16, right:-16
                        , width:32, height:32 , justifyContent:'center'
                        , alignItems:'center'
                    }]}
                >
                    <Image source={require('../../images/ic_close_blue.png')} 
                        style={{ width: 16, height: 16, }} />
                </TouchableOpacity>:null
            }
            <TouchableOpacity 
                onPress={()=>{
                    launchCamera(options, response => {
                        // console.log('response = ',response);
                        if (SentencedToEmpty(response,['assets'],[]).length>0) {
                            let str = SentencedToEmpty(response,['assets',0,'base64'],'');
                            let fileName = SentencedToEmpty(response,['assets',0,'fileName'],'');
                        
                            this.props.dispatch(createAction('BWModel/uploadimage')({
                                imageIndex:index,
                                byteArray:str,
                                fileName,
                                successCallback:()=>{
                                    let baseImg=`data:image/png;base64,${str}`;
                                    let stateParams = {};
                                    stateParams[`showImage${index+1}Uri`] = baseImg
                                    this.setState(stateParams);
                                }
                            }));
                        }
                        
                        // ShowLoadingToast('正在上传图片');
                    });
                }}
                style={[{
                    position:'absolute', bottom:0, left:0 
                }]}
            >
                <View style={[{
                    width:(SCREEN_WIDTH-136)/2-20,
                    height:(SCREEN_WIDTH-136)/2-20
                }]}></View>
            </TouchableOpacity>
        </View>);
    }

    render() {
        
        return (<StatusPage
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
                status={SentencedToEmpty(this.props.loadUploadOptionStatus
                    ,['status'],200)}>
            <ScrollView style={[{width:SCREEN_WIDTH}]}>
            <View style={[{ width:SCREEN_WIDTH, flex:1
                , alignItems:'center' }]}
            >
                {/* <TouchableOpacity
                    style={{marginTop:12}}
                >
                    <View style={[{
                        height:32, width:SCREEN_WIDTH-20
                        , backgroundColor:'#74AFF7'
                        , justifyContent:'center'
                        , alignItems:'center'
                        , borderRadius:2
                    }]}>
                        <Text style={[{ fontSize:12, color:'#ffffff'}]}>{'点此查看历史上传'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{marginTop:12}}
                >
                    <View style={[{
                        height:32, width:SCREEN_WIDTH-20
                        , backgroundColor:'#74AFF7'
                        , justifyContent:'center'
                        , alignItems:'center'
                        , borderRadius:2
                    }]}>
                        <Text style={[{ fontSize:12, color:'#ffffff'}]}>{'异常情况信息上传入口'}</Text>
                    </View>
                </TouchableOpacity>
                <View style={[{backgroundColor:'#e4c8c8', marginTop:12, marginBottom:16
                    , width:SCREEN_WIDTH-20, paddingVertical:12
                    , paddingHorizontal:20, borderRadius:8
                    , justifyContent:'center', alignItems:'center'
                }]}>
                    <Text style={{fontSize:12,color:'#9d4a45', padding:1, lineHeight:15}}>{'现场不具备信息上传条件时，请点击“'}
                        <Text style={{fontSize:12,color:'#9d4a45', fontWeight:"bold"}}>{'异常情况信息上传入口'}</Text>
                    {'”。“'}
                        <Text style={{fontSize:12,color:'#9d4a45', fontWeight:"bold"}}>{'不具备信息上传条件'}</Text>
                    {'”是指由于现场安全、保密，通讯信号等不可抗力原因导致机构现场采样人员无法实时上传。'}</Text>
                </View> */}
                <View style={[{marginBottom:16
                    , width:SCREEN_WIDTH-20, height:1}]}></View>
                <View style={[ styles.baseStyleContainer, styles.labelContainer, { borderTopWidth:1, borderTopColor:'#c8c8c8' } ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'当前时间'}</Text>
                    <Text style={[{ color:'#333333', fontSize:13 }]}>{`${this.getCurrentDate()}`}</Text>
                </View>
                <View style={[ styles.baseStyleContainer, styles.labelContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'经度'}</Text>
                    <Text style={[{ color:'#333333', fontSize:13 }]}>{`${
                        SentencedToEmpty(this.props,
                            ['uploadData', 'xmlParamList', 0, 'X'],'-')
                    }`}</Text>
                </View>
                <View style={[ styles.baseStyleContainer, styles.labelContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'纬度'}</Text>
                    <Text style={[{ color:'#333333', fontSize:13 }]}>{`${
                        SentencedToEmpty(this.props,
                            ['uploadData', 'xmlParamList', 0, 'Y'],'-')
                    }`}</Text>
                </View>
                {/* <View style={[ styles.baseStyleContainer, styles.pickerContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'运维类别'}</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'SHPicker',
                                params: {
                                    pickerType:'operationType'
                                }
                            }));
                        }}
                    >
                        <View style={[{
                            height:32, minWidth:SCREEN_WIDTH*2/5, flexDirection:'row'
                            , borderWidth:1, borderColor:'#c8c8c8'
                            , borderRadius:4, justifyContent:'center', alignItems:'center'
                        }]}>
                            <Text style={{color:'#333333', fontSize:14}}>{`${
                                this.showSelectedStr(this.props.openationTaskTypeSelectedItems,'operationType')
                            }`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </TouchableOpacity>
                </View> */}
                <View style={[ styles.baseStyleContainer, styles.pickerContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'运维内容'}</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'SHPicker',
                                params: {
                                    pickerType:'operationContentType'
                                }
                            }));
                        }}
                    >
                        <View style={[styles.pickerBorder]}>
                            <Text style={{color:'#333333', fontSize:14}}>{`${
                                this.showSelectedStr(this.props.getOperationDetailSelectedItems,'operationContentType')
                            }`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[ styles.baseStyleContainer, styles.pickerContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'运维时间'}</Text>
                    {/* <TouchableOpacity
                        onPress={()=>{
                            // 选时间
                            // this.props.dispatch(NavigationActions.navigate({
                            //     routeName: 'SHPicker',
                            //     params: {
                            //         pickerType:'operationContentType'
                            //     }
                            // }));
                        }}
                    >
                        <View style={[styles.pickerBorder]}>
                            <Text style={{color:'#333333', fontSize:14}}>{`${'请选择运维时间'}`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </TouchableOpacity> */}
                    <PickerSingleTimeTouchable option={this.getTimePickerOption()} style={{  }}>
                        <View style={[styles.pickerBorder]}>
                            <Text style={{color:'#333333', fontSize:14}}>{`${
                                SentencedToEmpty(this.props,['uploadOpenationTime'],'') == ''?'请选择运维时间'
                                :moment(this.props.uploadOpenationTime).format('YYYY/MM/DD HH:mm')}`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </PickerSingleTimeTouchable>
                </View>
                <View style={[ styles.baseStyleContainer, styles.pickerContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'运维人员'}</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'SHPicker',
                                params: {
                                    pickerType:'operationWorkers'
                                }
                            }));
                        }}
                    >
                        <View style={[styles.pickerBorder]}>
                            <Text style={{color:'#333333', fontSize:14}}>{`${
                                this.showSelectedStr(this.props.getALLWorkersSelectedItems,'operationWorkers')
                            }`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[ styles.baseStyleContainer, styles.pickerContainer ]}>
                    <Text style={[{ color:'#74aff7', fontSize:13 }]}>{'运维设备'}</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.dispatch(NavigationActions.navigate({
                                routeName: 'SHPicker',
                                params: {
                                    pickerType:'operationDevices'
                                }
                            }));
                        }}
                    >
                        <View style={[styles.pickerBorder]}>
                            <Text numberOfLines={1} style={{color:'#333333', fontSize:14, maxWidth:SCREEN_WIDTH/2}}>{`${
                                this.showSelectedStr(this.props.getALLDevicesSelectedItems,'operationDevices')
                            }`}</Text>
                            <Image style={{ width:8,height:8,marginLeft:4 }} source={require('../../images/lc_icon_down_fill.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[ styles.baseStyleContainer, {
                    paddingVertical:16, paddingHorizontal:48
                    , flexDirection:'row', flexWrap:'wrap'
                    , backgroundColor:'white'
                } ]}>
                    {
                        [0,1,2,3
                            // ,4,5,6,7
                        ].map((item,index)=>{
                            return this.renderImage(item,index)
                        })
                    }
                </View>
                {this.props.loadUploadOptionStatus.status == -1?<SimpleLoadingView message={'加载中'}/>:null}
                {this.props.loadUploadImageStatus.status == -1?<SimpleLoadingView message={'正在上传图片'}/>:null}
                {false?<SimpleLoadingView message={'正在配置运维计划'}/>:null}
            </View>
        </ScrollView>
        {
            this.renderBottomBtn()
        }
        </StatusPage>);
    }
}

const styles = StyleSheet.create({
    baseStyleContainer:{
        backgroundColor:'white', width:SCREEN_WIDTH-20
        , borderBottomWidth:1, borderBottomColor:'#c8c8c8'
        , flexDirection:'row', alignItems:'center'
        , paddingHorizontal:16, justifyContent:'space-between'
    },
    labelContainer:{
        height:32,
    },
    pickerContainer:{
        height:40,
    },
    pickerBorder:{
        height:32, minWidth:SCREEN_WIDTH*2/5, flexDirection:'row'
        , borderWidth:1, borderColor:'#c8c8c8', paddingHorizontal:16
        , borderRadius:4, justifyContent:'center', alignItems:'center'
    },
});