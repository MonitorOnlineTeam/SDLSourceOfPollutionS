/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-02-07 09:08:10
 * @LastEditTime: 2023-06-16 11:32:48
 * @FilePath: /SDLMainProject36/app/pOperationContainers/KeyParameterVerification/KeyParameterVerificationEditView.js
 */
import React, { Component } from 'react'
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { PickerTouchable, SimpleLoadingComponent, StatusPage } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import FormTextArea from '../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import { createNavigationOptions, NavigationActions, SentencedToEmpty, createAction, ShowToast } from '../../utils';

@connect(({ keyParameterVerificationModel, app })=>({
    selectEnterprise: app.selectEnterprise,
    KeyParameterCodeListResult:keyParameterVerificationModel.KeyParameterCodeListResult,
    keyParameterVerificationEditData:keyParameterVerificationModel.keyParameterVerificationEditData,
    addOrUpdOperationKeyParameterResult:keyParameterVerificationModel.addOrUpdOperationKeyParameterResult,
    operationKeyParameterDetailResult:keyParameterVerificationModel.operationKeyParameterDetailResult
}))
export default class KeyParameterVerificationEditView extends Component {
    
    static navigationOptions =({navigation}) =>  createNavigationOptions({
        title: SentencedToEmpty(navigation,['state','params','type'])=='update'
        ||SentencedToEmpty(navigation,['state','params','type'])=='create'?'新增核查信息'
        :SentencedToEmpty(navigation,['state','params','type'])=='submitted_update'?'修改核查信息'
        :SentencedToEmpty(navigation,['state','params','type'])=='show_completed_records'?'核查详情':'新增核查信息',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const type = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            KeyParameterCodeListResult:{status:-1},
            operationKeyParameterDetailResult:{status:-1},
        }))
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterCodeList')({
            callback:()=>{
                if (type == 'update'||type == 'submitted_update'||type == 'show_completed_records') {
                    this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterDetailList')(
                        {
                            params:SentencedToEmpty(this.props,['navigation','state','params',],{}),
                            dispatch:this.props.dispatch,
                            // setDataToPointPicker:item=>{
                            //     SentencedToEmpty(this,['pointPicker','wrappedInstance','setSelectItem'],()=>{})(item);
                            // }
                        }
                    ))
                }
            }
        }))
    }
    
    componentWillUnmount() {
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
        // 在父组件中清除数据保证数据状态一致
        this.props.dispatch(createAction('app/updateState')({selectEnterprise: { EntName: '请选择' }}))
    }

    onFreshData = ()=>{
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            KeyParameterCodeListResult:{status:-1}
        }))
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterCodeList')({}))
    }

    isEdit = () => {
        const type = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        let params = SentencedToEmpty(this.props,['navigation','state','params'],null);
        let formId = SentencedToEmpty(this.props.keyParameterVerificationEditData
            ,['id'],'');
        if (formId=='') {
            return true
        }
        let editable = true;
        if (params!=null&&params.editable == false) {
            editable = false;
        }
        if (type == 'show_completed_records'||!editable) {
            console.log('isEdit false');
            return false
        } else {
            console.log('isEdit true');
            return true
        }
    }

    renderItem = (item,key) => {
        const type = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        let data = SentencedToEmpty(this.props.keyParameterVerificationEditData
            ,['list',key],{});
        let isEditAble = this.isEdit();
        return(<View 
            key={`item${key}`}
            style={{width:SCREEN_WIDTH, backgroundColor:'white'
            , alignItems:'center', marginTop:7.5
        }}>
            <View style={{width:SCREEN_WIDTH-38}}>
                <FormLabel label={`${item.sort}、${item.name}`} />
            </View>
            <View
                style={{width:SCREEN_WIDTH-38}}
            >
                <Text style={{marginTop:10, fontSize:14,color:'#666666'}}>{'照片附件：'}</Text>
            </View>
            <ImageGrid 
                uploadCallback={(imageItems)=>{
                    let newDataUpdateImage = {...this.props.keyParameterVerificationEditData};
                    let imageList = SentencedToEmpty(newDataUpdateImage,['list',key,'fileList'],[]);
                    let newImageList = imageList.concat(imageItems);
                    newDataUpdateImage.list[key].fileList = newImageList;
                    this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                        keyParameterVerificationEditData:newDataUpdateImage
                    }));
                }}
                delCallback={(imageIndex)=>{
                    let newDataUpdateImage = {...this.props.keyParameterVerificationEditData};
                    let imageList = SentencedToEmpty(newDataUpdateImage,['list',key,'fileList'],[]);
                    imageList.splice(imageIndex, 1);
                    newDataUpdateImage.list[key].fileList = imageList;
                    this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                        keyParameterVerificationEditData:newDataUpdateImage
                    }));
                }}
                style={{ paddingHorizontal:9, paddingBottom: 10, backgroundColor: '#fff' }} 
                Imgs={SentencedToEmpty(data,['fileList'],[])} 
                isUpload={isEditAble} 
                isDel={isEditAble} 
                UUID={`${SentencedToEmpty(data,['File'],'empty_id')}`} />
            <View
                style={{width:SCREEN_WIDTH-38}}
            >
                <FormTextArea 
                    editable={isEditAble}
                    areaHeight={58}
                    required={false}
                    label='备注：'
                    placeholder=''
                    value={SentencedToEmpty(data,[`Remark`],'')}
                    onChangeText={(text)=>{
                        // let paramKey = `remark${key}`;
                        // let newData = {};
                        // newData[paramKey] = text;
                        // this.setState(newData);

                        let newDataUpdateText = {...this.props.keyParameterVerificationEditData};
                        newDataUpdateText.list[key].Remark = text;
                        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                            keyParameterVerificationEditData:newDataUpdateText
                        }));
                    }}
                />
                <View style={{height:15,width:SCREEN_WIDTH-38}} />
            </View>
        </View>);
    }

    render() {
        const type = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        const formType = SentencedToEmpty(this.props,['navigation','state','params','type'],'');
        let isEditAble = this.isEdit();
        return (
            <StatusPage
                status={ 
                    type == 'update'||type == 'submitted_update'||type == 'show_completed_records'
                    ?SentencedToEmpty(this.props,['operationKeyParameterDetailResult','status'],1000):
                    SentencedToEmpty(this.props,['KeyParameterCodeListResult','status'],1000) }
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onFreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    // this.onFreshData();
                }}
            >
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View
                        style={{width:SCREEN_WIDTH, backgroundColor:'white'
                        }}
                    >
                        <View style={{width:SCREEN_WIDTH-34
                            , marginLeft:13.5
                        }}>
                            <FormEnterprisePicker 
                                editable={isEditAble}
                                label={'企业'}
                                required={false}
                                selectCallback={(item)=>{
                                    // console.log('item = ',item);
                                }}
                            />
                            <FormPointPicker
                                ref={ref => (this.pointPicker = ref)}
                                editable={isEditAble} 
                                label={'监测点'}
                                required={false}
                                selectPointItem={SentencedToEmpty(this.props,[
                                        'keyParameterVerificationEditData','selectPointItem'
                                    ],{ PointName: '请选择监测点' })}
                                callback={(item)=>{
                                    let newData = {...this.props.keyParameterVerificationEditData};
                                    newData.DGIMN = item.DGIMN;
                                    newData.selectPointItem = item;
                                    this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                        keyParameterVerificationEditData:newData
                                    }));
                                }}
                            />
                        </View>
                    </View>
                    {/*
                        [
                            '1、上位机量程与参数设置照片'
                            ,'2、备案信息表量程与参数照片'
                            ,'3、72小时溯源与粉尘仪A/D值照片'
                            ,'4、分析仪实时数据照片'
                            ,'5、上位机实时数据照片'
                            ,'6、数采仪实时数据照片'
                        ].map((item,index)=>{
                            return this.renderItem(item,index)
                        })
                    */}
                    {
                        SentencedToEmpty(this.props,['KeyParameterCodeListResult','data','Datas'],[]).map((item,index)=>{
                            return this.renderItem(item,index)
                        })
                    }
                </KeyboardAwareScrollView>
                {
                    isEditAble?type == 'submitted_update'
                    ?<View style={{height:82, width:SCREEN_WIDTH
                        , flexDirection:'row', alignItems:'center'
                        , justifyContent:'space-around'}}>
                            <TouchableOpacity
                            onPress={()=>{
                                // submitStatus 1暂存 2提交
                                let newData = {...this.props.keyParameterVerificationEditData};
                                newData.submitStatus = 2;
                                // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                                // newData.typeID = 1;
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    keyParameterVerificationEditData:newData,
                                }));
                                this.props.dispatch(createAction('keyParameterVerificationModel/addOrUpdOperationKeyParameter')({}));
                            }}
                        >
                            <View style={{
                                width:SCREEN_WIDTH-64, height:44
                                , justifyContent:'center'
                                , alignItems:'center', borderRadius:5
                                , backgroundColor:'#4DA9FF'
                            }}>
                                <Text style={{fontSize:17, color:'white'}}>{'提交'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :<View style={{height:82, width:SCREEN_WIDTH
                        , flexDirection:'row', alignItems:'center'
                        , justifyContent:'space-around'}}>
                        <TouchableOpacity
                            onPress={()=>{
                                // submitStatus 1暂存 2提交
                                let newData = {...this.props.keyParameterVerificationEditData};
                                newData.submitStatus = 1;
                                // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                                // newData.typeID = 1;
                                console.log('keyParameterVerificationEditData = ',newData);
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    keyParameterVerificationEditData:newData,
                                }));
                                this.props.dispatch(createAction('keyParameterVerificationModel/addOrUpdOperationKeyParameter')({}));
                            }}
                        >
                            <View style={{
                                width:135, height:44
                                , justifyContent:'center'
                                , alignItems:'center', borderRadius:5
                                , backgroundColor:'#FFB64D'
                            }}>
                                <Text style={{fontSize:17, color:'white'}}>{'暂存'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                // submitStatus 1暂存 2提交
                                let newData = {...this.props.keyParameterVerificationEditData};
                                newData.submitStatus = 2;
                                // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                                // newData.typeID = 1;
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    keyParameterVerificationEditData:newData,
                                }));
                                this.props.dispatch(createAction('keyParameterVerificationModel/addOrUpdOperationKeyParameter')({}));
                            }}
                        >
                            <View style={{
                                width:135, height:44
                                , justifyContent:'center'
                                , alignItems:'center', borderRadius:5
                                , backgroundColor:'#4DA9FF'
                            }}>
                                <Text style={{fontSize:17, color:'white'}}>{'提交'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>:null
                }
                {SentencedToEmpty(this.props,['keyParameterVerificationEditData','submitStatus'],-1)==2
                    &&SentencedToEmpty(this.props,['addOrUpdOperationKeyParameterResult','status'],200) == -1?<SimpleLoadingComponent message={'提交中'} />:null}
                {SentencedToEmpty(this.props,['keyParameterVerificationEditData','submitStatus'],-1)==1
                    &&SentencedToEmpty(this.props,['addOrUpdOperationKeyParameterResult','status'],200) == -1?<SimpleLoadingComponent message={'暂存中'} />:null}
            </StatusPage>
        )
    }
}

@connect(({ app })=>({
    selectEnterprise: app.selectEnterprise,
}))
class FormEnterprisePicker extends Component {

    enterpriseCallback = item => {
        const { selectCallback=() =>{} } = this.props;
        selectCallback(item);
        // this.setState({ selectPointItem: { PointName: '请选择监测点位' } });
        this.props.dispatch(
            createAction('app/updateState')({
                selectEnterprise: item
            })
        );
        this.props.dispatch(
            createAction('app/getPointListByEntCode')({
                params: {
                    entCode: item.Id,
                    callback: pointItem => {
                        let newData = {...item};
                        newData.PointList = pointItem
                        this.props.dispatch(createAction('app/updateState')({
                            selectEnterprise:newData
                        }));
                    }
                }
            })
        );
    }

    componentWillUnmount() {
        /**
         * 父组件先componentDidMount,再触发loading
         * 导致子组件执行componentWillUnmount，最后子组件清除了相关数据
         */
        // this.props.dispatch(createAction('app/updateState')({selectEnterprise: { EntName: '请选择' }}))
    }

    render() {
        const { 
            last=false,
            label='标题',
            showString,
            itemHeight=44,
            value='',
            onChangeText=()=>{},
            required=false
            , propsLabelStyle={}, propsTextStyle={}, propsHolderStyle={}
            , hasColon=true, requireIconPosition='left'
            , editable=true
        } = this.props;
        // 业务修改 核查为服务端派发，不需要修改
        // if (editable) {
        if(false) {
            return (<TouchableOpacity
                onPress={()=>{
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'ContactOperation',
                            params: {
                                isCreatTask: true,
                                selectType: 'enterprise',
                                callback: this.enterpriseCallback
                            }
                        })
                    );
                }}
            >
                <View style={[styles.layout,last?{}:styles.bottomBorder,{height:itemHeight}]}>
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height:itemHeight }}>
                        {required&&requireIconPosition == 'left'?<Text style={[styles.labelStyle,propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <Text numberOfLines={1} style={[styles.labelStyle,propsLabelStyle,]}>{`${label}${hasColon?'：':''}`}</Text>
                        {required&&requireIconPosition == 'right'?<Text style={[{marginLeft: 10,fontSize: 15,},propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <View style={[styles.innerlayout]}>
                            {
                                SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == ''
                                || SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == '请选择'
                                ? <Text style={[styles.textStyle,{marginLeft: 16}]}>{'请选择企业'}</Text>
                                : <Text style={[styles.textStyle,{marginLeft: 16}]}>{SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') }</Text>
                            }
                        </View>
                        <Image 
                            style={{width:15, height:15}}
                            source={require('../../images/calendarRight.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>)
        } else {
            return(<View>
                <View style={[styles.layout,last?{}:styles.bottomBorder,{height:itemHeight}]}>
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height:itemHeight }}>
                        {required&&requireIconPosition == 'left'?<Text style={[styles.labelStyle,propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <Text numberOfLines={1} style={[styles.labelStyle,propsLabelStyle,]}>{`${label}${hasColon?'：':''}`}</Text>
                        {required&&requireIconPosition == 'right'?<Text style={[{marginLeft: 10,fontSize: 15,},propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <View style={[styles.innerlayout]}>
                            {
                                SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == ''
                                || SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == '请选择'
                                ? <Text style={[styles.textStyle,{marginLeft: 16}]}>{'请选择企业'}</Text>
                                : <Text style={[styles.textStyle,{marginLeft: 16}]}>{SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') }</Text>
                            }
                        </View>
                        <Image 
                            style={{width:15, height:15}}
                            source={require('../../images/calendarRight.png')}
                        />
                    </View>
                </View>
            </View>)
        }
    }
}

@connect(({ app })=>({
    selectEnterprise: app.selectEnterprise,
}),null,
null,
{ withRef: true })
class FormPointPicker extends Component {

    judgeEnterprise = () => {
        ShowToast('请先选择企业或监测站');
    };

    // 排口选择器配置
    getPointSelect = () => {
        const { callback=()=>{} } = this.props;
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            dataArr: this.props.selectEnterprise.PointList || [],
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    callback(item)
                }
            }
        };
    };

    setSelectItem = item => {
        this.pointS.setSelectItem(item);
    }

    render() {
        const { 
            last=false,
            label='标题',
            showString,
            itemHeight=44,
            value='',
            onChangeText=()=>{},
            required=false
            , propsLabelStyle={}, propsTextStyle={}, propsHolderStyle={}
            , hasColon=true, requireIconPosition='left',
              selectPointItem 
            , editable=true
         } = this.props;
        // 业务修改 核查为服务端派发，不需要修改
        // if (editable) {
        if (false) {
            return(<PickerTouchable
                ref={ref => (this.pointS = ref)}
                option={this.getPointSelect()}
                onPress={(this.props.selectEnterprise.PointList || []).length == 0 ? ()=>{ShowToast('监测点数据加载中，请稍后！')} : null}
                style={[styles.row, { justifyContent: 'space-between' }]}
            >
                <View style={[styles.layout,last?{}:styles.bottomBorder,{height:itemHeight}]}>
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height:itemHeight }}>
                        {required&&requireIconPosition == 'left'?<Text style={[styles.labelStyle,propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <Text numberOfLines={1} style={[styles.labelStyle,propsLabelStyle,]}>{`${label}${hasColon?'：':''}`}</Text>
                        {required&&requireIconPosition == 'right'?<Text style={[{marginLeft: 10,fontSize: 15,},propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <View style={[styles.innerlayout]}>
                            {
                                SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == ''
                                || SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == '请选择'
                                ? <Text style={[styles.textStyle,{marginLeft: 16}]}>{'请选择监测点'}</Text>
                                : <Text style={[styles.textStyle,{marginLeft: 16}]}>{SentencedToEmpty(this.props,['selectPointItem','PointName'],'') }</Text>
                            }
                        </View>
                        <Image 
                            style={{width:15, height:15}}
                            source={require('../../images/calendarRight.png')}
                        />
                    </View>
                </View>
            </PickerTouchable>);
        } else {
            console.log('EntName = ',SentencedToEmpty(this.props,['selectEnterprise','EntName'],''));
            console.log('PointName = ',SentencedToEmpty(this.props,['selectPointItem','PointName'],''));
            return(<View>
                <View style={[styles.layout,last?{}:styles.bottomBorder,{height:itemHeight}]}>
                    <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, height:itemHeight }}>
                        {required&&requireIconPosition == 'left'?<Text style={[styles.labelStyle,propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <Text numberOfLines={1} style={[styles.labelStyle,propsLabelStyle,]}>{`${label}${hasColon?'：':''}`}</Text>
                        {required&&requireIconPosition == 'right'?<Text style={[{marginLeft: 10,fontSize: 15,},propsLabelStyle,{color:'red'} ]}>*</Text>:null}
                        <View style={[styles.innerlayout]}>
                            {
                                SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == ''
                                || SentencedToEmpty(this.props,['selectEnterprise','EntName'],'') == '请选择'
                                ? <Text style={[styles.textStyle,{marginLeft: 16}]}>{'请选择监测点'}</Text>
                                : <Text style={[styles.textStyle,{marginLeft: 16}]}>{SentencedToEmpty(this.props,['selectPointItem','PointName'],'') }</Text>
                            }
                        </View>
                        <Image 
                            style={{width:15, height:15}}
                            source={require('../../images/calendarRight.png')}
                        />
                    </View>
                </View>
            </View>);
        }
    }
}



const styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center'
    },
    bottomBorder:{
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor, 
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1,
        textAlign: 'right'
    },
})