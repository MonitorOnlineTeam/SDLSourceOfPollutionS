/*
 * @Description: 整改/申诉 详情
 * @LastEditors: hxf
 * @Date: 2023-02-09 10:57:45
 * @LastEditTime: 2023-07-27 16:03:14
 * @FilePath: /SDLMainProject36/app/pOperationContainers/KeyParameterVerification/RectifyOrAppealDetail.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import FormHorizontalTextArea from '../../operationContainers/taskViews/taskExecution/components/FormHorizontalTextArea';
import FormLabel from '../../operationContainers/taskViews/taskExecution/components/FormLabel';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../utils';

@connect()
export default class RectifyOrAppealDetail extends Component {

    /**
     * 
     * SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Rectify'?'整改'
            :SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉':'问题描述'
     */

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Rectify'?'整改详情'
                :SentencedToEmpty(navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉详情':'整改详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }

    cancelButton = () => {}
    confirm = () => {
        const data = SentencedToEmpty(this.props,
            ['navigation','state','params','data'],{}
        )
        const {isLast = false} = data;
        this.props.dispatch(createAction('keyParameterVerificationModel/withdrawQuestionKeyParameter')({
            params:{
                id:data.id
            },
            type:SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],''),
            superListData:SentencedToEmpty(this.props,
                ['navigation','state','params','superListData'],{}
            ),
            isLast
        }));
    }

    render() {
        let alertOptions_rectify_appeal_detail = {
            headTitle: '提示',
            messText: `是否确定要撤销这条${
                SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Rectify'?'整改'
                :SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉':'整改'
            }记录？`,
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
        const data = SentencedToEmpty(this.props,
            ['navigation','state','params','data'],{}
        )
        const superListData = SentencedToEmpty(this.props,
            ['navigation','state','params','superListData'],{}
        )
        return (<View style={{width:SCREEN_WIDTH,flex:1}}>
            <ScrollView style={{width:SCREEN_WIDTH}}>
                <View style={{width:SCREEN_WIDTH}}>
                    <View style={{width:SCREEN_WIDTH,height:44, backgroundColor:'white', marginBottom:10}}>
                        <View style={{width:SCREEN_WIDTH-42, marginLeft:21}}>
                            <FormLabel label={SentencedToEmpty(data,['typeName'],'----')} last={true} />
                        </View>
                    </View>
                </View>
                <View style={{width:SCREEN_WIDTH,minHeight:198, backgroundColor:'white', marginBottom:10}}>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`运维人：${SentencedToEmpty(superListData,['operationUserName'],'----')}`}</Text>
                    </View>
                    <View style={{ height:23, marginTop:10, marginLeft:19, justifyContent:'center'}}>
                        <Text style={{fontSize:14,color:'#333333'}}>{`提交时间：${SentencedToEmpty(data,['createTime'],'----')}`}</Text>
                    </View>
                    <View style={{marginLeft:19, width:SCREEN_WIDTH-38, marginTop:10, minHeight:80, }}>
                        <FormHorizontalTextArea
                            label={`${
                                SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Rectify'?'整改'
                                :SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉':'整改'
                            }描述：`}
                            labelStyle={{fontSize:14,color:'#666666', width: 80}}
                            inputStyle={{fontSize:14,color:'#666666', width:SCREEN_WIDTH-120, marginBottom:0, minHeight:80, }}
                            last={true}
                            editable={false}
                            value={SentencedToEmpty(data,['remark'],'----')}
                        />
                    </View>
                    <View
                        style={{width:SCREEN_WIDTH-38, marginLeft:19}}
                    >
                        <Text style={{marginTop:10, fontSize:14,color:'#666666'}}>{`${
                            SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Rectify'?'整改'
                            :SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'')=='Appeal'?'申诉':'整改'
                        }图片：`}</Text>
                    </View>
                    <ImageGrid style={{ paddingHorizontal:9, paddingBottom: 10, backgroundColor: '#fff', minHeight:75  }} 
                        Imgs={SentencedToEmpty(data,['fileList'],[])} 
                        isUpload={false} isDel={false} 
                        UUID={`${SentencedToEmpty(this.props.navigation,['state', 'params', 'type'],'Rectify')}Image${new Date().getTime()}`} />
                </View>
            </ScrollView>
            <View style={{width:SCREEN_WIDTH, height:74
                , flexDirection:'row', justifyContent:'center'
                , alignItems:'center'
            }}>
                <TouchableOpacity
                    onPress={()=>{
                        this.refs.doAlert.show();
                    }}
                >
                    <View style={{
                        width:270, height:44
                        , justifyContent:'center'
                        , alignItems:'center', borderRadius:5
                        , backgroundColor:'#FFB64D'
                    }}>
                        <Text style={{fontSize:17,color:'white'}}>{'撤销'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <AlertDialog options={alertOptions_rectify_appeal_detail} ref="doAlert" />
        </View>)
    }
}
