/*
 * @Description: 烟气 设备参数变动记录表
 * @LastEditors: hxf
 * @Date: 2022-01-10 09:03:42
 * @LastEditTime: 2022-03-15 10:02:20
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/GasEquipmentParametersChangeForm.js
 */
import moment from 'moment';
import React, { Component, PureComponent } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, ScrollView, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, DeclareModule, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions, ShowToast } from '../../../../utils';
import Form2Switch from '../components/Form2Switch';
import FormDatePicker from '../components/FormDatePicker';
import FormSaveButton from '../components/FormSaveButton';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import FormText from '../components/FormText';

@connect(({gasParametersChangeModel})=>({
    gasParametersChangeRecordListResult:gasParametersChangeModel.gasParametersChangeRecordListResult,
    content:gasParametersChangeModel.content,
    gasParametersChangeRecordSaveResult:gasParametersChangeModel.gasParametersChangeRecordSaveResult,
    formDeleteResult:gasParametersChangeModel.formDeleteResult,
}))
export default class GasEquipmentParametersChangeForm extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        title: `设备参数变动记录`,
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, }, //标题居中
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

    componentDidMount() {
        const { ID } = SentencedToEmpty(this.props,['navigation','state','params','item'],{});
        this.props.dispatch(createAction('gasParametersChangeModel/updateState')({
            gasParametersChangeRecordListResult:{status:-1},
            innerList:[],
        }));
        this.props.dispatch(createAction('gasParametersChangeModel/getGasParametersChangeRecordList')({
            TypeID:ID
        }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    getStartOption = () => {
        return {
            defaultTime: moment(this.props.content.BeginTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: time => {
                let temp = {... this.props.content}
                temp.BeginTime = time;
                this.props.dispatch(createAction('gasParametersChangeModel/updateState')({
                    content:temp
                }))
            },
        };
    };

    getEndOption = () => {
        return {
            defaultTime: moment(this.props.content.EndTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: time => {
                let temp = {... this.props.content}
                temp.EndTime = time;
                this.props.dispatch(createAction('gasParametersChangeModel/updateState')({
                    content:temp
                }))
            },
        };
    };

    confirm = () => {
        this.props.dispatch(createAction('gasParametersChangeModel/delForm')({ }))
    }

    render() {
        // console.log('begin = ',moment().subtract(1,'months').date(1).format('YYYY-MM-DD 00:00:00'))
        // console.log('end = ',moment().date(1).hours(0).minutes(0).seconds(0).subtract(1,'seconds').format('YYYY-MM-DD HH:mm:ss'))
        let recordList = SentencedToEmpty(this.props
            ,['gasParametersChangeRecordListResult','data','Datas'
            ,'Record','RecordList'],[])
        let options = {
            headTitle: '提示',
            messText:  `确认删除设备参数变动记录表吗？`,
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
        /**
         * BeginTime: moment().format('YYYY-MM-DD HH:00:00'),
            EndTime: moment().format('YYYY-MM-DD HH:00:00'),
            IsFlag: 1
         */
        return (
            <StatusPage
                status={this.props.gasParametersChangeRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', alignItems: 'center',backgroundColor: globalcolor.backgroundGrey }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    // this.onRefresh();
                }}
            >
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10,marginTop:10}]}>
                    {/* <FormDatePicker 
                        getPickerOption={this.getStartOption} 
                        label='统计开始时间' 
                        timeString={moment(this.props.content.BeginTime).format('YYYY-MM-DD HH:00')}
                    /> */}
                    <FormText
                        label={'统计开始时间'} 
                        showString={moment(this.props.content.BeginTime).format('YYYY-MM-DD HH:00')}
                    />
                </View>
                <View style={[{width:SCREEN_WIDTH-20,backgroundColor:'white'
                    ,paddingHorizontal:10}]}>
                    {/* <FormDatePicker 
                        getPickerOption={this.getEndOption} 
                        label='统计截止时间' 
                        timeString={moment(this.props.content.EndTime).format('YYYY-MM-DD HH:59')}
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
                        value={this.props.content.IsFlag}
                        onChange={(value)=>{
                            let temp = {... this.props.content}
                            temp.IsFlag = value;
                            this.props.dispatch(createAction('gasParametersChangeModel/updateState')({
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
                                            /**
                                            *   FormMainID 主表ID
                                                ParametersID 参数ID
                                                ParametersName 参数名称
                                                ChangeTime  修改日期
                                                PType 1.量程参数2.其它参数
                                                RangeAfterChange 变化后量程值 传组合值 0-20
                                                RangeBeforeChange 变化前量程值  传组合值  0-20
                                            */
                                            // 各核查项目
                                            let children = SentencedToEmpty(item,['childList'],[]);
                                            if (children.length == 0) {
                                                children.push({
                                                    // FormMainID:'', // 主表ID
                                                    ParametersID:item.ParametersID, //  参数ID
                                                    ParametersName:item.ParametersName, //  参数名称
                                                    ChangeTime:moment().format('YYYY-MM-DD HH:mm:ss'), //  修改日期
                                                    PType:item.PType, //  1.量程参数2.其它参数
                                                    RangeAfterChange:'', //  变化后量程值 传组合值 0-20
                                                    RangeBeforeChange:'', //  变化前量程值  传组合值  0-20
                                                });
                                            }
                                            this.props.dispatch(createAction('gasParametersChangeModel/updateState')({
                                                innerList:children,
                                                ParametersID:item.ParametersID,// 参数ID
                                                ParametersName:item.ParametersName,// 参数名称
                                                PType:item.PType, // 行类型
                                            }))
                                            this.props.dispatch(NavigationActions.navigate({
                                                routeName: 'GasEquipmentParametersChangeItemEdit', params: { item }
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
                        let couldSave = false;
                        if (this.props.content.IsFlag == 0) {
                            couldSave = true;
                        }
                        recordList.map((item,index)=>{
                            if (item.IsWrite == 1) {
                                couldSave = true;
                            }
                        });
                        if (couldSave) {
                            this.props.dispatch(createAction('gasParametersChangeModel/addGasParametersChangeRecord')({}))
                        } else {
                            ShowToast('请填写变动记录');
                        }
                    }}
                />
                {
                    SentencedToEmpty(this.props
                        ,['gasParametersChangeRecordListResult','data','Datas'
                        ,'Record','ID'],'') !=''?<FormSuspendDelButton 
                        onPress={()=>{
                            // console.log('设备参数变动记录表 delete');
                            this.refs.doAlert.show();
                        }}
                    />:null
                }
                <AlertDialog options={options} ref="doAlert" />
                {this.props.gasParametersChangeRecordSaveResult.status == -1?<SimpleLoadingComponent message={'提交中'} />:null}
                {this.props.formDeleteResult.status == -1?<SimpleLoadingComponent message={'删除中'} />:null}
            </StatusPage>
        )
    }
}