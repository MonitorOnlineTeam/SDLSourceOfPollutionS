/*
 * @Description: 实际水样比对试验结果记录表 水污染源校验记录
 * @LastEditors: hxf
 * @Date: 2022-01-25 11:50:11
 * @LastEditTime: 2024-09-25 19:40:09
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/WaterSampleComparisonTestForm.js
 */

import moment from 'moment';
import React, { Component, PureComponent } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, DeviceEventEmitter, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../../utils';
import FormDatePicker from '../components/FormDatePicker';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import FormText from '../components/FormText';
const formarStr = 'YYYY-MM-DD HH:mm:ss'

@connect(({ waterSampleComparisonTestModel }) => ({
    waterComparisonTestRecordListResult: waterSampleComparisonTestModel.waterComparisonTestRecordListResult,
    content: waterSampleComparisonTestModel.content,
    waterComparisonTestRecordListSaveResult: waterSampleComparisonTestModel.waterComparisonTestRecordListSaveResult,
    formDeleteResult: waterSampleComparisonTestModel.formDeleteResult,
}))
export default class WaterSampleComparisonTestForm extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '比对试验结果记录表',
            // title: '水污染源校验记录',
            title: '水样比对试验记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    componentDidMount() {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(createAction('waterSampleComparisonTestModel/updateState')({
            waterComparisonTestRecordListResult: { status: -1 },
            innerList: [],
        }));
        this.props.dispatch(createAction('waterSampleComparisonTestModel/getWaterComparisonTestRecordList')({
            TypeID: ID
        }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    getTestTimeOption = () => {
        return {
            defaultTime: moment(this.props.content.TestTime).format(formarStr),
            type: 'day',
            onSureClickListener: time => {
                let temp = { ... this.props.content }
                temp.TestTime = moment(time).format(formarStr);
                this.props.dispatch(createAction('waterSampleComparisonTestModel/updateState')({
                    content: temp
                }))
            },
        };
    }

    confirm = () => {
        this.props.dispatch(createAction('waterSampleComparisonTestModel/delForm')({}))
    }

    render() {
        let recordList = SentencedToEmpty(this.props
            , ['waterComparisonTestRecordListResult', 'data', 'Datas'
                , 'Record', 'RecordList'], [])
        let options = {
            headTitle: '提示',
            messText: `确认删除此表单吗？`,
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: () => { }
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
                status={this.props.waterComparisonTestRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: globalcolor.backgroundGrey }}
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
                <View style={[{
                    width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                    , paddingHorizontal: 10, marginTop: 10
                }]}>
                    <FormText
                        label={'运维单位'}
                        showString={SentencedToEmpty(this.props
                            , ['waterComparisonTestRecordListResult', 'data', 'Datas'
                                , 'Record', 'Content', 'MaintenanceManagementUnit'], '--')}
                    />
                </View>
                <View style={[{
                    width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                    , paddingHorizontal: 10, marginBottom: 10
                }]}>
                    <FormDatePicker
                        last={true}
                        getPickerOption={this.getTestTimeOption}
                        label='统计截止时间'
                        timeString={moment(this.props.content.TestTime).format('YYYY-MM-DD')}
                    />
                </View>
                <ScrollView>
                    <View style={[{
                        width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                        , paddingHorizontal: 10
                    }]}>
                        {
                            recordList.map((item, index) => {
                                return (<TouchableOpacity
                                    onPress={() => {
                                        let children = SentencedToEmpty(item, ['childList'], []);
                                        if (children.length == 0) {
                                            children.push({
                                                ParametersID: item.ParametersID,//  校验项目ID
                                                ParametersName: item.ParametersName,//  校验项目名称
                                                Unit: '',//   单位
                                                OnlineMonitoringValue: '',//  在线监测仪器测定结果
                                                AlignmentMethodValue: '',//  比对方法测定结果 组合值 0,1
                                                AlignmentMethodAvgValue: '',//  比对方法测定结果平均值
                                                ErrorValue: '',//  测定误差  组合值   1,mg/m3
                                                IsQualified: 0,//  是否合格  1合格 0 不合格,	
                                            });

                                        }
                                        this.props.dispatch(createAction('waterSampleComparisonTestModel/updateState')({
                                            innerList: children,
                                            ParametersID: item.ParametersID,//  校验项目ID
                                            ParametersName: item.ParametersName,//  校验项目名称
                                        }))
                                        // 各核查项目
                                        this.props.dispatch(NavigationActions.navigate({
                                            routeName: 'WaterSampleComparisonTestItemEdit', params: { item }
                                        }));
                                    }}
                                    key={`item${index}`}
                                    style={[
                                        { width: SCREEN_WIDTH - 40, height: 45 }
                                    ]}
                                >
                                    <View style={[{
                                        width: SCREEN_WIDTH - 40, height: 44
                                        , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                    }]}>
                                        <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{item.ParametersName}</Text>
                                        {
                                            item.IsWrite == 1 ? <Text style={[{ fontSize: 14, color: globalcolor.antBlue }]}>{'已填写'}</Text>
                                                : <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{'未填写'}</Text>
                                        }
                                    </View>
                                    <View style={[{ height: 1, width: SCREEN_WIDTH - 40, backgroundColor: '#E7E7E7' }]} />
                                </TouchableOpacity>)
                            })
                        }
                    </View>
                </ScrollView>
                {
                    SentencedToEmpty(this.props
                        , ['waterComparisonTestRecordListResult', 'data', 'Datas'
                            , 'Record', 'ID'], '') != '' ? <FormSuspendDelButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    /> : null
                }
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('waterSampleComparisonTestModel/addWaterComparisonTestRecord')({
                        }))
                    }}
                    style={[{
                        height: 44, width: SCREEN_WIDTH - 20
                        , backgroundColor: '#4DA9FF'
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    <Text style={{ fontSize: 17, color: 'white' }}>保存</Text>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.waterComparisonTestRecordListSaveResult.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.formDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        )
    }
}