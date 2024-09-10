/*
 * @Description: 关键参数核查 整改编辑
 * @LastEditors: hxf
 * @Date: 2023-02-08 16:16:59
 * @LastEditTime: 2023-04-18 17:21:44
 * @FilePath: /SDLMainProject34/app/pOperationContainers/KeyParameterVerification/RectifyEditor.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../utils';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import ImageGrid from '../../components/form/images/ImageGrid';
import { AlertDialog, FlatListWithHeaderAndFooter, StatusPage } from '../../components';


@connect(({ keyParameterVerificationModel })=>({
    rectifyVerificationProblemParams:keyParameterVerificationModel.rectifyVerificationProblemParams
}))
export default class RectifyEditor extends Component {

    static navigationOptions = createNavigationOptions({
        title: '整改',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    isEdit = () => {
        return true;
    }

    cancelButton = () => {}
    confirm = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/rectifyVerificationProblem')({}));
    }

    render() {
        let alertOptions_rectify = {
            headTitle: '提示',
            messText: '是否确定要提交整改记录？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        // console.log(this.props);
        console.log(`File = ${SentencedToEmpty(this.props,
                                ['rectifyVerificationProblemParams','list',0,'File']
                                ,'empty_image_id'
                            )}`);
        let record = SentencedToEmpty(this.props,['navigation','state','params'],{})
        console.log('record = ',record);
        return (
            <View style={{width:SCREEN_WIDTH,flex:1}}>
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={{width:SCREEN_WIDTH,height:44, backgroundColor:'white', marginBottom:10}}>
                        <View style={{width:SCREEN_WIDTH-42, marginLeft:21}}>
                            <FormLabel 
                                label={`${SentencedToEmpty(record,['typeName'],'整改问题')}`} 
                                last={true} />
                        </View>
                    </View>
                    <View style={{width:SCREEN_WIDTH,minHeight:167, backgroundColor:'white', marginBottom:10}}>
                        <View style={{width:SCREEN_WIDTH-42, marginLeft:21}}>
                            <FormLabel required={true} label={'整改描述'} />
                        </View>
                        <TextInput
                            editable={true}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                let rectifyParams = {...this.props.rectifyVerificationProblemParams};
                                rectifyParams.list[0].Remark = text;
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    rectifyVerificationProblemParams:rectifyParams
                                }))
                            }}
                            style={[
                                {
                                    minHeight: 110,
                                    width: SCREEN_WIDTH-38,
                                    marginLeft:19,
                                    marginBottom: 20,
                                    color: globalcolor.datepickerGreyText,
                                    fontSize: 15,
                                    textAlign: 'left',
                                    textAlignVertical: 'top',
                                    padding: 4,
                                }
                            ]}
                            multiline={true}
                            value={SentencedToEmpty(this.props
                                ,['rectifyVerificationProblemParams','list',0,'Remark'],'')}
                            numberOfLines={4}
                            placeholder={'请输入'}
                        />
                    </View>
                    <View style={{width:SCREEN_WIDTH,minHeight:167, backgroundColor:'white', marginBottom:10}}>
                        <View style={{width:SCREEN_WIDTH-42, marginLeft:21, marginBottom:10}}>
                            <FormLabel label={'整改图片'} />
                        </View>
                        <ImageGrid 
                            uploadCallback={(imageItems)=>{
                                let newDataUpdateImage = {...this.props.rectifyVerificationProblemParams};
                                let imageList = SentencedToEmpty(newDataUpdateImage,['list',0,'fileList'],[]);
                                let newImageList = imageList.concat(imageItems);
                                newDataUpdateImage.list[0].fileList = newImageList;
                                console.log('RectifyEditor newDataUpdateImage = ',newDataUpdateImage);
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    rectifyVerificationProblemParams:newDataUpdateImage
                                }));
                            }}
                            delCallback={(imageIndex)=>{
                                let newDataUpdateImage = {...this.props.rectifyVerificationProblemParams};
                                let imageList = SentencedToEmpty(newDataUpdateImage,['list',0,'fileList'],[]);
                                imageList.splice(imageIndex, 1);
                                newDataUpdateImage.list[0].fileList = imageList;
                                console.log('RectifyEditor del newDataUpdateImage = ',newDataUpdateImage);
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    rectifyVerificationProblemParams:newDataUpdateImage
                                }));
                            }}
                            style={{ paddingHorizontal:11, paddingBottom: 10, backgroundColor: '#fff' }} 
                            Imgs={SentencedToEmpty(this.props
                                ,['rectifyVerificationProblemParams','list'
                                    ,0,'fileList'],[])} 
                            isUpload={this.isEdit()} 
                            isDel={this.isEdit()} 
                            UUID={`${SentencedToEmpty(this.props,
                                ['rectifyVerificationProblemParams','list',0,'File']
                                ,'empty_image_id'
                            )}`} />
                    </View>
                </KeyboardAwareScrollView>
                <View style={{width:SCREEN_WIDTH, height:74
                    , flexDirection:'row', justifyContent:'center'
                    , alignItems:'center'
                }}>
                    {/* <TouchableOpacity>
                        <View style={{
                            width:135, height:44
                            , justifyContent:'center'
                            , alignItems:'center', borderRadius:5
                            , backgroundColor:'#FFB64D'
                        }}>
                            <Text style={{fontSize:17,color:'white'}}>{'暂存'}</Text>
                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={()=>{
                            if (SentencedToEmpty(this.props
                                ,['rectifyVerificationProblemParams','list',0,'Remark'],'')=='') {
                                ShowToast('整改描述不能为空！');
                            } else {
                                this.refs.doAlert.show();
                            }
                        }}
                    >
                        <View style={{
                            width:270, height:44
                            , justifyContent:'center'
                            , alignItems:'center', borderRadius:5
                            , backgroundColor:'#4DA9FF'
                        }}>
                            <Text style={{fontSize:17,color:'white'}}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <AlertDialog options={alertOptions_rectify} ref="doAlert" />
            </View>
        )
    }
}
