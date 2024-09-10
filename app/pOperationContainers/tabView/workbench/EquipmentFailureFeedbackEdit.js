/*
 * @Description: 设备故障反馈记录 编辑页
 * @LastEditors: hxf
 * @Date: 2022-02-10 10:04:13
 * @LastEditTime: 2023-06-26 15:43:06
 * @FilePath: /SDLMainProject36/app/pOperationContainers/tabView/workbench/EquipmentFailureFeedbackEdit.js
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux';
import { PickerTouchable, SDLText } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import FormDatePicker from '../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import FormInput from '../../../operationContainers/taskViews/taskExecution/components/FormInput';
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker';
import FormSaveButton, { FormDeleteButton } from '../../../operationContainers/taskViews/taskExecution/components/FormSaveButton';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowToast } from '../../../utils';
const ic_arrows_down = require('../../../images/ic_arrows_down.png');

@connect(({ app, equipmentFailureFeedbackModel }) => ({
    selectEnterprise: app.selectEnterprise,
    dataArray:equipmentFailureFeedbackModel.dataArray,
    faultFeedbackParamesResult:equipmentFailureFeedbackModel.faultFeedbackParamesResult,
}))
export default class EquipmentFailureFeedbackEdit extends Component {

    static navigationOptions = ({ navigation }) => {
        return  createNavigationOptions({
            title: `故障反馈记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    }
    constructor(props) {
        super(props);
        console.log('constructor ID = ',SentencedToEmpty(props,['dataArray','ID'],''));
        this.state = {
            selectPointItem: { PointName: '请选择监测点位' }, // 选中排口
        };
        if (SentencedToEmpty(props,['dataArray','ID'],'') != '') {
            this.state.selectPointItem = {
                PointName:SentencedToEmpty(props,['dataArray','PointName'],''),
                DGIMN:SentencedToEmpty(props,['dataArray','DGIMN'],''),
            }
        }
    }

    componentDidMount() {
        if (SentencedToEmpty(this.props,['dataArray','ID'],'') != '') {
            this.props.dispatch(
                createAction('app/getPointListByEntCode')({
                    params: {
                        entCode: SentencedToEmpty(this.props,['dataArray','EntCode'],''),
                        callback: item => {
                            this.props.selectEnterprise.PointList = item;
                            if (this.pointS && typeof this.pointS != 'undefined') {
                                this.pointS.setSelectItem(item[0]);
                                this.forceUpdate();
                            }
                        }
                    }
                })
            );
            this.props.dispatch(
                createAction('equipmentFailureFeedbackModel/getFaultFeedbackParames')({
                    DGIMN: SentencedToEmpty(this.props,['dataArray','DGIMN'],''),
                    callback:(result)=>{
                        const arr = SentencedToEmpty(result,['data','Datas','FaultUnitList'],[])
                        console.log('arr = ',arr);
                        let newArray = SentencedToEmpty(this.props,['dataArray'],{})
                        arr.map((item,index)=>{
                            if (SentencedToEmpty(this.props,['dataArray','FaultUnitID'],'')== item.ID) {
                                newArray.IsMaster = item.IsMaster;
                                this.props.dispatch(
                                    createAction('equipmentFailureFeedbackModel/updateState')(
                                        {dataArray:newArray}));
                            }
                        })
                    }
                })
            );
        }
    }

    callback = item => {
        console.log('企业：',item);
        this.setState({ selectPointItem: { PointName: '请选择监测点位' } });
        this.props.dispatch(
            createAction('app/updateState')({
                selectEnterprise: item
            })
        );
        this.props.dispatch(
            createAction('app/getPointListByEntCode')({
                params: {
                    entCode: item.Id,
                    callback: item => {
                        this.props.selectEnterprise.PointList = item;
                        if (this.pointS && typeof this.pointS != 'undefined') {
                            this.pointS.setSelectItem(item[0]);
                            this.forceUpdate();
                        }
                    }
                }
            })
        );
    };

    // 排口选择器配置
    getPointSelect = () => {
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            dataArr: this.props.selectEnterprise.PointList || [],
            onSelectListener: item => {
                console.log('EquipmentFailureFeedbackEdit getPointSelect item = ',item);
                if (item && typeof item != 'undefined') {
                    this.props.dispatch(
                        createAction('equipmentFailureFeedbackModel/getFaultFeedbackParames')({
                            DGIMN: item.DGIMN,
                        })
                    );
                    this.setState({
                        selectPointItem: item
                    });
                }
            }
        };
    };

    upDateItem = (index,paramName,value) =>{
        // let newArray = [...this.props.dataArray];
        // newArray[index][paramName] = value;
        let newArray = {...this.props.dataArray};
        newArray[paramName] = value;
        this.props.dispatch(
            createAction('equipmentFailureFeedbackModel/updateState')(
                {dataArray:newArray}));
    }

    render() {
        let item = SentencedToEmpty(this.props,['dataArray'],{})
        console.log('item = ',item);
        console.log('item = ',SentencedToEmpty(this.props,['navigation'],{}));
        return (
            <View style={[{width:SCREEN_WIDTH,flex:1, alignItems:'center'}]}>
                <ScrollView style={[{width:SCREEN_WIDTH}]} >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'ContactOperation',
                                    params: {
                                        isCreatTask: true,
                                        selectType: 'enterprise',
                                        callback: this.callback
                                    }
                                })
                            );
                        }}
                        style={[styles.row, { justifyContent: 'space-between' }]}
                    >
                        <View style={[styles.rowInner,{flex:1, marginRight:8}]}>
                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* '}</Text>
                            <Text style={{ fontSize: 14, color: globalcolor.textBlack }}>{'企业/监测站'}</Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    flex:1,
                                    maxWidth: SCREEN_WIDTH - 150,
                                    fontSize: 14,
                                    color: '#666',
                                    marginLeft: 24,
                                    textAlign:'right'
                                }}
                            >
                                {this.props.selectEnterprise.EntName}
                            </Text>
                        </View>

                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={require('../../../images/ic_arrows_right.png')} />
                    </TouchableOpacity>

                    <View style={styles.line} />
                    <PickerTouchable
                        ref={ref => (this.pointS = ref)}
                        option={this.getPointSelect()}
                        onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                        style={[styles.row, { justifyContent: 'space-between' }]}
                    >
                        <View style={[styles.rowInner,{flex:1, marginRight:8}]}>
                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* '}</Text>
                            <Text style={{ fontSize: 14, color: globalcolor.textBlack }}>{'监测点位'}</Text>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24, textAlign:'right', flex:1 }}>{SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '')}</Text>
                        </View>

                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                    </PickerTouchable>
                    <View style={[{ width: SCREEN_WIDTH-24, alignItems: 'center'
                        , marginHorizontal: 12, paddingHorizontal:6 }]}>
                        {
                            /**
                                ID 传ID就是修改否则就是添加
                                DGIMN 排口编号
                                CauseAnalysis   原因分析
                                EquipmentInfoID 是主机就填写ID 否则手动填写
                                EquipmentNumber 有主机就带出序列号否则为空
                                FaultPhenomenon 故障现象
                                FaultTime 故障时间
                                FaultUnitID 故障单元ID
                                ProcessingMethod 处理方法
                                */
                        }
                        <View style={[{ width: SCREEN_WIDTH-24, alignItems: 'center'
                                ,  marginTop:12}]}>
                            <View style={[{width: SCREEN_WIDTH-24,height:32,flexDirection:'row'
                                ,justifyContent:'space-between' }]}>
                                <Text style={[{ fontSize:16 }]}>{`故障记录`}</Text>
                                {/* <TouchableOpacity
                                    onPress={() => {
                                        let newArray = [...this.props.dataArray];
                                        newArray.splice(index,1);
                                        this.props.dispatch(
                                            createAction('equipmentFailureFeedbackModel/updateState')(
                                                {dataArray:newArray}));
                                    }}
                                    style={{ flexDirection: 'row', flex: 1, marginTop: 1, justifyContent: 'flex-end' }}
                                >
                                    <SDLText style={{ color: '#4aa0ff' }}>删除</SDLText>
                                </TouchableOpacity> */}
                            </View>
                            <View style={[{ width: SCREEN_WIDTH-24, alignItems: 'center'
                                ,backgroundColor:globalcolor.white,paddingHorizontal:6,}]}>
                                <FormPicker
                                    required={true}
                                    label='故障单元'
                                    defaultCode={SentencedToEmpty(item,['FaultUnitID'],'')}
                                    option={{
                                        codeKey: 'ID',
                                        nameKey: 'FaultUnitName',
                                        defaultCode: SentencedToEmpty(item,['FaultUnitID'],''),
                                        dataArr:SentencedToEmpty(this.props.faultFeedbackParamesResult,['data','Datas','FaultUnitList'],[]),
                                        onSelectListener: callBackItem => {
                                            // let newArray = [...this.props.dataArray];
                                            let newArray = {...this.props.dataArray};
                                            newArray.selectedFaultUnit = callBackItem;
                                            newArray.FaultUnitID = callBackItem.ID;
                                            newArray.FaultUnitName = callBackItem.FaultUnitName;
                                            newArray.IsMaster = callBackItem.IsMaster;
                                            this.props.dispatch(
                                                createAction('equipmentFailureFeedbackModel/updateState')(
                                                    {dataArray:newArray}));
                                        }
                                    }}
                                    showText={SentencedToEmpty(item,['FaultUnitName'],'') } 
                                    placeHolder='请选择'
                                />
                                <FormDatePicker 
                                    required={true}
                                    getPickerOption={
                                        () =>{
                                            return {
                                                defaultTime: moment(item.FaultTime).format('YYYY-MM-DD HH:mm:ss'),
                                                type: 'hour',
                                                onSureClickListener: time => {
                                                    console.log('time = ',time);
                                                    this.upDateItem(0,'FaultTime',time);
                                                },
                                            };
                                        }
                                    }
                                    label={'故障时间'} 
                                    timeString={moment(item.FaultTime).format('YYYY-MM-DD HH:00')}
                                />
                                {   
                                    // IsMaster 1 主机  2是其他吗？
                                    SentencedToEmpty(item,['IsMaster'],2) == 1?<FormPicker
                                        required={true}
                                        label='主机名称型号'
                                        defaultCode={SentencedToEmpty(item,['EquipmentInfoID'],'')}
                                        option={{
                                            codeKey: 'ID',
                                            nameKey: 'Name',
                                            defaultCode: SentencedToEmpty(item,['EquipmentInfoID'],''),
                                            dataArr:SentencedToEmpty(this.props.faultFeedbackParamesResult,['data','Datas','EquipmentInfoList'],[]),
                                            onSelectListener: callBackItem => {
                                                // let newArray = [...this.props.dataArray];
                                                let newArray = {...this.props.dataArray};
                                                newArray.selectedEquipmentInfo = callBackItem;
                                                newArray.EquipmentInfoID = callBackItem.ID;
                                                newArray.EquipmentNumber = callBackItem.EquipmentNumber;
                                                newArray.EquipmentName = callBackItem.Name;
                                                this.props.dispatch(
                                                    createAction('equipmentFailureFeedbackModel/updateState')(
                                                        {dataArray:newArray}));
                                            }
                                        }}
                                        showText={SentencedToEmpty(item,['EquipmentName'],'') } 
                                        placeHolder='请选择'
                                    />:<FormInput 
                                        required={true}
                                        label={'名称型号'}
                                        placeholder='请记录'
                                        keyboardType='default'
                                        value={item.EquipmentInfoID}
                                        onChangeText={
                                            (text)=>{
                                                this.upDateItem(0,'EquipmentInfoID',text);
                                            }
                                        }
                                    />
                                }
                                <FormTextArea 
                                    required={true}
                                    label='故障现象'
                                    areaWidth={SCREEN_WIDTH-36}
                                    placeholder=''
                                    value={item.FaultPhenomenon}
                                    onChangeText={(text)=>{
                                        this.upDateItem(0,'FaultPhenomenon',text);
                                    }}
                                />
                                <FormTextArea 
                                    label='原因分析'
                                    areaWidth={SCREEN_WIDTH-36}
                                    placeholder=''
                                    value={item.CauseAnalysis}
                                    onChangeText={(text)=>{
                                        this.upDateItem(0,'CauseAnalysis',text);
                                    }}
                                />
                                <FormTextArea 
                                    label='处理方法'
                                    areaWidth={SCREEN_WIDTH-36}
                                    placeholder=''
                                    value={item.ProcessingMethod}
                                    onChangeText={(text)=>{
                                        this.upDateItem(0,'ProcessingMethod',text);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {
                    SentencedToEmpty(this.props,['navigation','state','params','item','IsWrite'],0)
                    == 1?<FormDeleteButton 
                        onPress={()=>{
                            // this.refs.doAlert.show();
                        }}
                    />:null
                }
                
                <View style={[{height:10}]} />
                <FormSaveButton 
                    onPress={()=>{
                        console.log('selectEnterprise = ',this.props.selectEnterprise);
                        console.log('dataArray = ',this.props.dataArray);
                        if (this.props.selectEnterprise.EntName == '请选择') {
                            ShowToast('企业/监测站不能为空');
                            return;
                        }
                        if (SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '请选择监测点位') == '请选择监测点位') {
                            ShowToast('监测点位不能为空');
                            return;
                        }
                        if (SentencedToEmpty(this.props, ['dataArray', 'FaultUnitID'], '') == '') {
                            ShowToast('故障单元不能为空');
                            return;
                        }
                        if (SentencedToEmpty(this.props,['dataArray','EquipmentInfoID'],'') == ''){
                            if (SentencedToEmpty(this.props,['dataArray','IsMaster'],2) == 1) {
                                ShowToast('主机名称不能为空');
                            } else {
                                ShowToast('名称型号不能为空');
                            }
                            return;
                        }
                        if (SentencedToEmpty(this.props, ['dataArray', 'FaultPhenomenon'], '') == '') {
                            ShowToast('故障现象不能为空');
                            return;
                        }
                        this.props.dispatch(createAction('equipmentFailureFeedbackModel/addFaultFeedback')({selectPointItem:this.state.selectPointItem}))
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    row: {
        width: '100%',
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e5e5e5'
    }
});
