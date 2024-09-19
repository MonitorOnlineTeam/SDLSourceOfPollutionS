/*
 * @Description: 数据一致性（实时数据）记录
 * @LastEditors: hxf
 * @Date: 2021-12-13 16:41:10
 * @LastEditTime: 2022-04-18 11:41:50
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/DataConsistencyRecord.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet
    , TouchableOpacity, DeviceEventEmitter
    , ScrollView, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import moment from 'moment';

import { StatusPage, DeclareModule, AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';

import { createAction, SentencedToEmpty, createNavigationOptions, NavigationActions } from '../../../../utils';
import { FormDateTimePicker } from '../components/FormDatePicker';
import FormText from '../components/FormText';
import { SCREEN_WIDTH } from '../../../../config/globalsize';

/**
 *  model 位置  app/pOperationModels/taskModel.js peiHeJianChaModel
 */
@connect(({ dataConsistencyModel, taskDetailModel })=>({
    editstatus:dataConsistencyModel.editstatus,
    dataConsistencyRecordListResult:dataConsistencyModel.dataConsistencyRecordListResult,// 数据一致性（实时数据）记录 查询结果
    date:dataConsistencyModel.date, // 表单日期
    taskDetail:taskDetailModel.taskDetail, // 任务信息
}))
export default class DataConsistencyRecord extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        // title: '数据一致性（实时数据）记录',
        title: '数据一致性记录',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, }, //标题居中
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 180,
                    messText: `1.此表单是统计各个仪表与各个平台间某个特定时间实时数据是否一致的表单。\n2.请在同一时刻记录各个因子的不同仪表与平台间的数据。`,
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

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.onRefresh()
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props,['navigation','state','params','item'],{});
        this.props.dispatch(
            createAction('dataConsistencyModel/updateState')(
                {dataConsistencyRecordListResult:{status:-1} }));
        this.props.dispatch(createAction('dataConsistencyModel/getDataConsistencyRecordList')({
            TypeID:ID
        }));
    }

    cancelButton = () => {}

    confirm = () => {
        this.props.dispatch(createAction('dataConsistencyModel/deleteDataConsistencyRecord')({
            params:{
                ZhuID:this.props.taskDetail.ID,
                TypeID:SentencedToEmpty(this.props,['navigation','state','params','item','TypeID'],''),
            } 
        }))
    }

    render() {
        const datas = SentencedToEmpty(this.props,['dataConsistencyRecordListResult','data','Datas'],{});
        const recordList = SentencedToEmpty(datas,['Record','RecordList'],[]);
        const {EnterpriseName='--',PointName='--'} = SentencedToEmpty(datas,['Record','Content'],[]);
        const columnList = SentencedToEmpty(datas,['ColumnList'],[]);
        const unitList = SentencedToEmpty(datas,['UnitList'],[]);
        const platformTypeList = SentencedToEmpty(datas,['PlatformTypeList'],[]);
        let options = {
            headTitle: '提示',
            messText: '确认删除该数据一致性记录吗？',
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

        return (
            <StatusPage
                errorText={SentencedToEmpty(this.props,['dataConsistencyRecordListResult','data','Message'],'获取表单信息发生错误')}
                status={this.props.dataConsistencyRecordListResult.status}
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
                <ScrollView>
                    <View style={[{ width: SCREEN_WIDTH-24, alignItems: 'center'
                        ,backgroundColor:globalcolor.white, marginHorizontal: 12, paddingHorizontal:6, marginTop:12}]}>
                        <FormText 
                            label={'企业名称'} 
                            showString={EnterpriseName}
                        />
                        <FormText 
                            label={'监测点名称'} 
                            showString={PointName}
                        />
                        <FormDateTimePicker
                            last={true}
                            defaultValue={moment(this.props.date)}
                            required={true}
                            label={'实时数据时间'} 
                            timeString={moment(this.props.date).format('YYYY-MM-DD HH:mm:ss')}
                            callback={(resultMoment)=>{
                                if (SentencedToEmpty(this.props.dataConsistencyRecordListResult
                                    ,['data','Datas','Record','ID'],'') != '') 
                                {
                                    const TypeID = SentencedToEmpty(this.props,['dataConsistencyRecordListResult','data','Datas','Record','TypeID'],{});
                                    this.props.dispatch(
                                        createAction('dataConsistencyModel/updateConsistencyTime')(
                                            {date:resultMoment.format('YYYY-MM-DD HH:mm:ss')
                                            ,oldDate:this.props.date,TypeID}));
                                } else {
                                    this.props.dispatch(
                                        createAction('dataConsistencyModel/updateState')(
                                            {date:resultMoment.format('YYYY-MM-DD HH:mm:ss')}));
                                }
                            }}
                        />
                        <View style={[{height:8, width:SCREEN_WIDTH-24,backgroundColor:globalcolor.lightGreyBackground}]}></View>
                        {
                            recordList.map((item,index)=>{
                                return <ItemButton
                                    last={recordList.length-1 == index}
                                    key={`button${index}`}
                                    label={item.PollutantName}
                                    filled={item.IsWrite == '1'}
                                    click={()=>{
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyEditItem', params: { item, columnList, unitList, platformTypeList } }))
                                    }}
                                />
                            })
                        }
                    </View>
                </ScrollView>
                <View style={[{width:SCREEN_WIDTH-24, alignItems:'center'}]}>
                    {SentencedToEmpty(this.props,['navigation','state','params','item','FormMainID'],'')!='' 
                    ||SentencedToEmpty(this.props,['dataConsistencyRecordListResult','data','Datas','Record','ID'],'')!='' ? (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                            onPress={() => {
                                this.refs.doAlert.show();
                            }}
                        >
                            <View style={styles.button}>
                                <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -1?<SimpleLoadingComponent message={'删除中'} />:null}
            </StatusPage>
        )
    }
}

export class ItemButton extends Component {
    render() {
        const { label='', filled=false, click=()=>{}, key, last=false} = this.props;
        return(<TouchableOpacity
            key={key}
            onPress={()=>{
                click();
            }}
            style={[styles.layout,last?{}:styles.bottomBorder,{width:SCREEN_WIDTH-60}]}>
            <View style={{ flexDirection: 'row', height: 45, alignItems: 'center', justifyContent:'space-between', flex: 1 }}>
                <Text style={[styles.labelStyle]}>{`${label}`}</Text>
                <Text style={[styles.textStyle,{fontSize:13, color:globalcolor.antBlue}]}>{filled?'已填写':'未填写'}</Text>
            </View>
        </TouchableOpacity>)
    }
}

// define your styles
const styles = StyleSheet.create({
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
    },
    layout: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        alignItems: 'center'
    },
    bottomBorder:{
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 15,
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
        fontSize: 15,
        color: globalcolor.datepickerGreyText,
        flex: 1,
        textAlign: 'right'
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    }
});