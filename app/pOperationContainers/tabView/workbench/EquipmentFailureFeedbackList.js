/*
 * @Description: 设备故障反馈记录 列表
 * @LastEditors: hxf
 * @Date: 2022-02-10 09:59:44
 * @LastEditTime: 2023-03-29 15:00:07
 * @FilePath: /SDLMainProject34/app/pOperationContainers/tabView/workbench/EquipmentFailureFeedbackList.js
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, DeclareModule, FlatListWithHeaderAndFooter, SDLText, SimplePicker, SimplePickerRangeDay, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getToken } from '../../../dvapack/storage';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

@connect(({ equipmentFailureFeedbackModel })=>({
    FaultBTime:equipmentFailureFeedbackModel.FaultBTime,
    FaultETime:equipmentFailureFeedbackModel.FaultETime,
    PollutantTypeCode:equipmentFailureFeedbackModel.PollutantTypeCode,
    faultFeedbackListResult:equipmentFailureFeedbackModel.faultFeedbackListResult,
    faultFeedbackListTotal:equipmentFailureFeedbackModel.faultFeedbackListTotal,
    faultFeedbackList:equipmentFailureFeedbackModel.faultFeedbackList,
    pageSize:equipmentFailureFeedbackModel.pageSize,
}))
export default class EquipmentFailureFeedbackList extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        title: '设备故障反馈',
        headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17 }, //标题居中
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 180,
                    messText: `现场设备出现故障后，如果一周以内无明确解决方案时，则通过该功能页面上报故障信息。`,
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

    constructor (props) {
        super(props);
        this.state = {
            selectItem:null
        }
    }

    componentDidMount() {
        this.props.dispatch(createAction('equipmentFailureFeedbackModel/getFaultFeedbackList')({}))
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = this.props.FaultBTime;
        endTime = this.props.FaultETime;
        console.log('beginTime = ',beginTime);
        console.log('endTime = ',endTime);
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.props.dispatch(createAction('equipmentFailureFeedbackModel/updateState')({ 
                    FaultBTime:startMoment.hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
                    FaultETime:endMoment.hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss'),
                    faultFeedbackListResult:{status:-1}
                }));
                this.props.dispatch(createAction('equipmentFailureFeedbackModel/getFaultFeedbackList')({}))
            }
        };
    };

    getDataTypeSelectOption = () => {
        const dataArr = [{ name: '全部', code: '0' }, { name: '废水', code: '1' }, { name: '废气', code: '2' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择污染源类型',
            defaultCode: this.props.PollutantTypeCode,
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(createAction('equipmentFailureFeedbackModel/updateState')({ 
                    PollutantTypeCode:item.code,
                    faultFeedbackListResult:{status:-1}
                }));
                this.props.dispatch(createAction('equipmentFailureFeedbackModel/getFaultFeedbackList')({}))
            }
        };
    };

    onRefresh = (index=1) => {
        this.props.dispatch(createAction('equipmentFailureFeedbackModel/updateState')({ 
            index,
        }));
        this.props.dispatch(createAction('equipmentFailureFeedbackModel/getFaultFeedbackList')({ setListData: this.list.setListData }));
    }

    statePageRefresh = () => {
        this.props.dispatch(createAction('equipmentFailureFeedbackModel/updateState')({ 
            index:1,
            faultFeedbackListResult:{status:-1}
        }));
        this.props.dispatch(createAction('equipmentFailureFeedbackModel/getFaultFeedbackList')({  }));
    }

    cancelButton = () => {}

    // 删除提交
    confirm = () => {
        if (SentencedToEmpty(this.state,['selectItem'],null)!=null) {
            this.props.dispatch(createAction('equipmentFailureFeedbackModel/deleteFaultFeedback')({ ID: this.state.selectItem.ID }));
        }
    }

    render() {
        var deleoptions = {
            headTitle: '提示',
            messText: '是否确定要删除这条设备故障反馈记录',
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
        // 设备故障反馈默认查询时间 默认7天
        // 全部 不传 水 1 气 2
        const {UserId} = getToken();
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: 10, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 13 }}>
                    <SimplePickerRangeDay style={[{ backgroundColor: '#fff', justifyContent: 'center' }]} ref={ref => (this.simplePickerRangeDay = ref)} option={this.getRangeDaySelectOption()} />
                    <SimplePicker option={this.getDataTypeSelectOption()} />
                </View>
                <StatusPage
                    status={SentencedToEmpty(this.props,['faultFeedbackListResult','status'],200)}
                    style={{ width:SCREEN_WIDTH, flex: 1, flexDirection: 'column', alignItems: 'center',backgroundColor: globalcolor.backgroundGrey }}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.statePageRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.statePageRefresh();
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        ref={ref => (this.list = ref)}
                        pageSize={this.props.pageSize}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                        hasMore={() => {
                            return SentencedToEmpty(this.props,['faultFeedbackList'],[]).length < this.props.faultFeedbackListTotal;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.onRefresh(index);
                        }}
                        renderItem= {({ item, index }) => {
                            /**
                                
                                */
                            return <View>
                                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginTop: 0 }]}>
                                        <View style={[{ width: SCREEN_WIDTH, borderColor: globalcolor.borderLightGreyColor, backgroundColor: globalcolor.white, paddingLeft: 13, paddingRight: 13 }]}>
                                            <Text style={[{ fontSize: 16, color: globalcolor.textBlack, marginTop: 10 }]}>{SentencedToEmpty(item, ['PointName'], '2#脱硫出口')}</Text>
                                            <View style={[{ flexDirection: 'row', height: 30, marginTop: 10 }]}>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>企业名称：</Text>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{SentencedToEmpty(item, ['ParentName'], '未填写')}</Text>
                                            </View>
                                            <View style={[{ flexDirection: 'row', height: 30 }]}>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>故障单元：</Text>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{SentencedToEmpty(item, ['FaultUnitName'], '未填写')}</Text>
                                            </View>
                                            <View style={[{ flexDirection: 'row', height: 30 }]}>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>反馈人：</Text>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{SentencedToEmpty(item, ['CreatUserName'], '---')}</Text>
                                            </View>
                                            <View style={[{ flexDirection: 'row', height: 30 }]}>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>反馈时间：</Text>
                                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{SentencedToEmpty(item, ['CreatDateTime'], '---')}</Text>
                                            </View>
                                            <View style={{ backgroundColor: '#e6e6e6', height: 1, flex: 1 }} />
                                            <View style={[{ flexDirection: 'row', height: 50, justifyContent: 'space-between', alignItems: 'center' }]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'EquipmentFailureFeedbackDetail', params: { item } }));
                                                    }}
                                                    style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                >
                                                    <SDLText style={{ color: globalcolor.headerBackgroundColor }}>查看</SDLText>
                                                </TouchableOpacity>
                                                <View style={[{ flexDirection: 'row', width: 1, height: 40, backgroundColor: '#e6e6e6' }]} />
                                                {
                                                    SentencedToEmpty(item, ['CreatUserId'], '') == UserId
                                                    && moment(item.CreatDateTime).add(15,'days').isAfter(moment())?
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.props.dispatch(
                                                                createAction('equipmentFailureFeedbackModel/updateState')({dataArray:item}));
                                                            this.props.dispatch(
                                                                createAction('app/updateState')({
                                                                    selectEnterprise: { 
                                                                        EntName: SentencedToEmpty(item,['ParentName'],''),
                                                                        }}));
                                                            this.props.dispatch(NavigationActions.navigate({ routeName: 'EquipmentFailureFeedbackEdit', params: { item } }));
                                                        }}
                                                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                    >
                                                        <SDLText style={{ color: globalcolor.headerBackgroundColor }}>修改</SDLText>
                                                    </TouchableOpacity>
                                                    :<TouchableOpacity
                                                        onPress={() => {
                                                        }}
                                                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                    >
                                                        <SDLText style={{ color: '#D3D3D3' }}>修改</SDLText>
                                                    </TouchableOpacity>
                                                }
                                                <View style={[{ flexDirection: 'row', width: 1, height: 40, backgroundColor: '#e6e6e6' }]} />
                                                {
                                                    SentencedToEmpty(item, ['CreatUserId'], '') == UserId
                                                    && moment(item.CreatDateTime).add(15,'days').isAfter(moment())?
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({ selectItem: item });
                                                            this.refs.deleAlert.show();
                                                        }}
                                                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                    >
                                                        <SDLText style={{ color: globalcolor.headerBackgroundColor }}>删除</SDLText>
                                                    </TouchableOpacity>
                                                    :<TouchableOpacity
                                                        onPress={() => {
                                                        }}
                                                        style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                                                    >
                                                        <SDLText style={{ color: '#D3D3D3' }}>删除</SDLText>
                                                    </TouchableOpacity>
                                                }
                                                
                                            </View>
                                        </View>
                                    </View>
                                </View>
                        }}
                        data={SentencedToEmpty(this.props,['faultFeedbackList'],[])}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(
                                createAction('equipmentFailureFeedbackModel/updateState')({
                                    dataArray:{
                                        ID:'',
                                        FaultTime:moment().minute(0).second(0).format('YYYY-MM-DD HH:mm:ss')
                                    }}));
                            this.props.dispatch(
                                createAction('app/updateState')({
                                    selectEnterprise: { EntName: '请选择' }}));    
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'EquipmentFailureFeedbackEdit' }));
                        }}
                        style={[{ position: 'absolute', bottom: 128, right: 18 }]}
                    >
                        <Image source={require('../../../images/ic_add_suspend_production.png')} style={[{ height: 60, width: 60 }]} />
                    </TouchableOpacity>
                </StatusPage>
                <AlertDialog options={deleoptions} ref="deleAlert" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }
});