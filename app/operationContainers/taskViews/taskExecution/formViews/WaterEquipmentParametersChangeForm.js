/*
 * @Description: 水质 设备参数变动记录表
 * @LastEditors: hxf
 * @Date: 2022-01-11 14:03:45
 * @LastEditTime: 2022-03-15 11:18:41
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/WaterEquipmentParametersChangeForm.js
 */

import moment from 'moment';
import React, { Component, PureComponent } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, ScrollView, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, DeclareModule, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../../utils';
import Form2Switch from '../components/Form2Switch';
import FormDatePicker from '../components/FormDatePicker';
import FormSaveButton from '../components/FormSaveButton';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import FormText from '../components/FormText';
const formarStr = 'YYYY-MM-DD HH:00:00'

@connect(({waterParametersChangeModel})=>({
    waterParametersChangeRecordListResult:waterParametersChangeModel.waterParametersChangeRecordListResult,
    content:waterParametersChangeModel.content,
    WaterCheckRecordListSaveResult:waterParametersChangeModel.WaterCheckRecordListSaveResult,
    formDeleteResult:waterParametersChangeModel.formDeleteResult,
}))
export default class WaterEquipmentParametersChangeForm extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        // title: '设备参数变动记录表',
        title: '设备参数变动记录',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17,  }, //标题居中
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 180,
                    messText: `在表单上填写上个月设备参数的变动记录.`,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => {}
                        }
                    ]
                }}
            />
        )
    });

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props,['navigation','state','params','item'],{});
        this.props.dispatch(createAction('waterParametersChangeModel/updateState')({
            waterParametersChangeRecordListResult:{status:-1},
            innerList:[],
        }));
        this.props.dispatch(createAction('waterParametersChangeModel/getWaterParametersChangeRecordList')({
            TypeID:ID
        }));
    }

    componentDidMount() {
        this.onRefresh()
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    getStartOption = () => {
        return {
            defaultTime: moment(this.props.content.BeginTime).format(formarStr),
            type: 'hour',
            onSureClickListener: time => {
                let temp = {... this.props.content}
                temp.BeginTime = moment(time).format(formarStr);
                this.props.dispatch(createAction('waterParametersChangeModel/updateState')({
                    content:temp
                }))
            },
        };
    };

    getEndOption = () => {
        return {
            defaultTime: moment(this.props.content.EndTime).format(formarStr),
            type: 'hour',
            onSureClickListener: time => {
                let temp = {... this.props.content}
                temp.EndTime = moment(time).format(formarStr);
                this.props.dispatch(createAction('waterParametersChangeModel/updateState')({
                    content:temp
                }))
            },
        };
    };

    confirm = () => {
        this.props.dispatch(createAction('waterParametersChangeModel/delForm')({ }))
    }

    render() {
        let recordList = SentencedToEmpty(this.props
            ,['waterParametersChangeRecordListResult','data','Datas'
            ,'Record','RecordList'],[])
        let options = {
            headTitle: '提示',
            messText:  `确认删除参数核对记录吗？`,
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
                status={this.props.waterParametersChangeRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', alignItems: 'center',backgroundColor: globalcolor.backgroundGrey }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10,marginTop:10}]}>
                    {/* <FormDatePicker 
                        getPickerOption={this.getStartOption} 
                        label='统计开始时间' 
                        timeString={moment(this.props.content.BeginTime).format('YYYY-MM-DD HH:mm')}
                    /> */}
                    <FormText
                        label={'统计开始时间'} 
                        showString={moment(this.props.content.BeginTime).format('YYYY-MM-DD HH:mm')}
                    />
                </View>
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10}]}>
                    {/* <FormDatePicker 
                        getPickerOption={this.getEndOption} 
                        label='统计截止时间' 
                        timeString={moment(this.props.content.EndTime).format('YYYY-MM-DD HH:mm')}
                    /> */}
                    <FormText
                        label={'统计截止时间'} 
                        showString={moment(this.props.content.EndTime).format('YYYY-MM-DD HH:mm')}
                    />
                </View>
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10}]}>
                    <Form2Switch 
                        label='是否有变动'
                        data={[{name:'是',value:1},{name:'否',value:0}]}
                        value={SentencedToEmpty(this.props,['content','IsFlag'],0)}
                        onChange={(value)=>{
                            let temp = {... this.props.content}
                            temp.IsFlag = value;
                            this.props.dispatch(createAction('waterParametersChangeModel/updateState')({
                                content:temp
                            }))
                        }}
                    />
                </View>
                <ScrollView
                    style={{width:SCREEN_WIDTH-20, marginTop:10}}
                >
                    {
                        this.props.content.IsFlag == 1? <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                            ,paddingHorizontal:10, marginTop:10}]}>
                            {
                                recordList.map((item,index)=>{
                                    return(<TouchableOpacity 
                                        onPress={()=>{
                                            // 各参数核对项目
                                            let children = SentencedToEmpty(item,['childList'],[]);
                                            if (children.length == 0) {
                                                children.push({
                                                    // FormMainID:'', // 主表ID
                                                    ParametersID:item.ParametersID, //  参数ID
                                                    ParametersName:item.ParametersName, //  参数名称
                                                    Range:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //   量程 组合值   用逗号分隔    0-2(变化前),0-3(变化后),2021-01-01(变化时间)
                                                    DigestionTemperature:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //  消解温度   组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
                                                    DigestionTime:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //   消解时间 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
                                                    CorrelationCoefficient:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //   线性相关系数 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
                                                    DetectionLimit:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //  检出限 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
                                                    MeasurementAccuracy:`,,${moment().format('YYYY-MM-DD HH:mm:ss')}`, //  测量精度 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
                                                });
                                            }
                                            this.props.dispatch(createAction('waterParametersChangeModel/updateState')({
                                                innerList:children,
                                                rowID:SentencedToEmpty(item,['childList',0,'ID'],''),
                                                ParametersID:item.ParametersID,// 参数ID
                                                ParametersName:item.ParametersName,// 参数名称
                                            })) 
                                            this.props.dispatch(NavigationActions.navigate({
                                                routeName: 'WaterEquipmentParametersChangeItemEdit', params: { item }
                                            }));
                                        }}
                                        key={`item${index}`}
                                        style={[
                                            {width:SCREEN_WIDTH-40,height:45}
                                        ]}
                                    >   
                                        <View style={[{width:SCREEN_WIDTH-40,height:44
                                            ,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                                            <Text style={[{fontSize:14,color:globalcolor.taskImfoLabel}]}>{item.ParametersName}</Text>
                                            {
                                                item.IsWrite == 1?<Text style={[{fontSize:14,color:globalcolor.antBlue}]}>{'已填写'}</Text>
                                                :<Text style={[{fontSize:14,color:globalcolor.taskImfoLabel}]}>{'未填写'}</Text>
                                            }
                                        </View>
                                        <View style={[{height:1,width:SCREEN_WIDTH-40,backgroundColor:'#E7E7E7'}]}/>
                                    </TouchableOpacity>)
                                })
                            }
                        </View>:null
                    }
                </ScrollView>
                <FormSaveButton 
                    onPress={()=>{
                        // console.log('设备参数变动记录表');
                        // console.log('content = ', this.props.content);
                        this.props.dispatch(createAction('waterParametersChangeModel/addWaterParametersChangeRecord')({}))
                    }}
                />
                {
                    SentencedToEmpty(this.props
                        ,['waterParametersChangeRecordListResult','data','Datas'
                        ,'Record','ID'],'') !=''?<FormSuspendDelButton 
                        onPress={()=>{
                            // console.log('设备参数变动记录表 delete');
                            this.refs.doAlert.show();
                        }}
                    />:null
                }
                <AlertDialog options={options} ref="doAlert" />
                {this.props.WaterCheckRecordListSaveResult.status == -2?<SimpleLoadingComponent message={'提交中'} />:null}
                {this.props.formDeleteResult.status == -1?<SimpleLoadingComponent message={'删除中'} />:null}
            </StatusPage>
        )
    }
}