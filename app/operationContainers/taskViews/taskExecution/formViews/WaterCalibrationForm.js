/*
 * @Description: 废水 校准记录表
 * @LastEditors: hxf
 * @Date: 2022-01-06 16:49:16
 * @LastEditTime: 2022-03-15 13:20:55
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/WaterCalibrationForm.js
 */

import moment from 'moment';
import React, { Component, PureComponent } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../../utils';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import FormText from '../components/FormText';

@connect(({waterCalibrationFormModel})=>({
    waterCalibrationRecordListResult:waterCalibrationFormModel.waterCalibrationRecordListResult,
    formDeleteResult:waterCalibrationFormModel.formDeleteResult,
}))
export default class WaterCalibrationForm extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        title: '水质校准记录表',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
    });

    componentDidMount() {
        this.statePageOnRefresh()
    }

    statePageOnRefresh = () =>{
        const { ID } = SentencedToEmpty(this.props,['navigation','state','params','item'],{});
        this.props.dispatch(createAction('waterCalibrationFormModel/updateState')({
            waterCalibrationRecordListResult:{status:-1},
            innerList:[],
        }));
        this.props.dispatch(createAction('waterCalibrationFormModel/getWaterCalibrationRecordList')({
            TypeID:ID
        }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    confirm = () => {
        this.props.dispatch(createAction('waterCalibrationFormModel/delForm')({}))
    }

    render() {
        let recordList = SentencedToEmpty(this.props
            ,['waterCalibrationRecordListResult','data','Datas'
            ,'Record','RecordList'],[])
        let options = {
            headTitle: '提示',
            messText:  `确认删除水质校准记录表吗？`,
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: ()=>{}
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <StatusPage
                status={this.props.waterCalibrationRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', alignItems: 'center',backgroundColor: globalcolor.backgroundGrey }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.statePageOnRefresh()
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.statePageOnRefresh()
                }}
            >
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10,marginTop:10}]}>
                    <FormText 
                        label={'运维单位'} 
                        showString={SentencedToEmpty(this.props
                            ,['waterCalibrationRecordListResult','data','Datas'
                            ,'Record','Content','MaintenanceManagementUnit'],'--')}
                    />
                </View>
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10,marginBottom:10}]}>
                    <FormText 
                        label={'安装地点'} 
                        last={true}
                        showString={SentencedToEmpty(this.props
                            ,['waterCalibrationRecordListResult','data','Datas'
                            ,'Record','Content','PointPosition'],'--')}
                    />
                </View>
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10}]}>
                    {
                        recordList.map((item,index)=>{
                            return(<TouchableOpacity 
                                key={`primary_table${index}`}
                                onPress={()=>{
                                    let childList = SentencedToEmpty(item,['childList'],[])
                                    if (childList.length == 0) {
                                        childList.push({
                                            AnalyzerID:item.AnalyzerID,// 项目ID
                                            AnalyzerName:item.AnalyzerName,
                                            FirstPoint:'',//  第一点   标准浓度 与信号值用逗号分隔
                                            FourthPoint:'',// 第四点   标准浓度 与信号值用逗号分隔
                                            IsQualified:0,// 是否合格 0否 1是
                                            SecondPoint:'',// 第二点   标准浓度 与信号值用逗号分隔
                                            ThirdPoint:'',// 第三点   标准浓度 与信号值用逗号分隔
                                            CompletionTime:moment().format('YYYY-MM-DD HH:mm:ss'),// 校准完成时间
                                        })
                                    }
                                    this.props.dispatch(createAction('waterCalibrationFormModel/updateState')({
                                        AnalyzerID:item.AnalyzerID,// 项目ID
                                        AnalyzerName:item.AnalyzerName,// 项目名称
                                        innerList:childList
                                        // CompletionTime:moment().format('YYYY-MM-DD HH:mm:ss'),// 校准完成时间
                                    }));
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'WaterCalibrationItemEdit', params: { item }
                                    }));
                                }}
                                key={`item${index}`}
                                style={[
                                    {width:SCREEN_WIDTH-40,height:45}
                                ]}
                            >   
                                <View style={[{width:SCREEN_WIDTH-40,height:44
                                    ,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                                    <Text style={[{fontSize:14,color:globalcolor.taskImfoLabel}]}>{item.AnalyzerName}</Text>
                                    {
                                        item.IsWrite == 1?<Text style={[{fontSize:14,color:globalcolor.antBlue}]}>{'已填写'}</Text>
                                        :<Text style={[{fontSize:14,color:globalcolor.taskImfoLabel}]}>{'未填写'}</Text>
                                    }
                                </View>
                                <View style={[{height:1,width:SCREEN_WIDTH-40,backgroundColor:'#E7E7E7'}]}/>
                            </TouchableOpacity>)
                        })
                    }
                </View>
                {
                    SentencedToEmpty(this.props
                        ,['waterCalibrationRecordListResult','data','Datas'
                        ,'Record','ID'],'') !=''?<FormSuspendDelButton 
                        onPress={()=>{
                            this.refs.doAlert.show();
                        }}
                    />:null
                }
                <AlertDialog options={options} ref="doAlert" />
                {this.props.formDeleteResult.status == -1?<SimpleLoadingComponent message={'删除中'} />:null}
            </StatusPage>
        )
    }
}