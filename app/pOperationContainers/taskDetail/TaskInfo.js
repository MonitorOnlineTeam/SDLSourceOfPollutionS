import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment';

import { SCREEN_WIDTH } from '../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty, makePhone } from '../../utils';
import { StatusPage, SimpleLoadingComponent, Touchable, ModalParent, SDLText } from '../../components';
import TimeLine from '../../components/TimeLine';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import globalcolor from '../../config/globalcolor';
/**
 * 任务信息
 * @class TaskInfo
 * @extends {Component}
 */
@connect(({ taskDetailModel, approvalModel }) => ({
    taskDetail: taskDetailModel.taskDetail,
    currentApproval: approvalModel.currentApproval,
    approvalStatue:approvalModel.approvalStatue
}))
export default class TaskInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocal: {}
        };
    }

    componentDidMount() {
        if (this.props.taskDetail.isSigned == false
            &&SentencedToEmpty(this.props,['taskDetail','OperationFlag'],'1') != 2) {
            this._modalParent.showModal();
        }
    }

    //任务申请审批
    examApplication = isConsent => {
        let params = {};
        params.appID = this.props.currentApproval.ID;
        if (isConsent) {
            params.examStaus = 1;
            params.examMsg = SentencedToEmpty(this.state, ['ExamMsg'], '同意') || '同意';
        } else {
            params.examStaus = 2;
            params.examMsg = SentencedToEmpty(this.state, ['ExamMsg'], '拒绝');
        }
        this.props.dispatch(
            createAction('approvalModel/examApplication')({
                params,
                callback: () => {
                    ShowToast('审批完成')
                    this.props.dispatch(createAction('approvalModel/getTaskListRight')({
                        params:{
                        type:'0',
                        pageIndex:1,
                        pageSize:10
                        }
                    }));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    render() {
        return (
            <StatusPage
                status={200}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调

                    console.log('重新刷新');
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                }}
            >
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[styles.card]}>
                        <SDLText fontType={'large'}>{`${SentencedToEmpty(this.props.taskDetail, ['EnterpriseName'], '')}-${SentencedToEmpty(this.props.taskDetail, ['PointName'], '')}`}</SDLText>
                        <View style={[styles.oneRow, { marginTop: 15 }]}>
                            <SDLText style={[styles.label]}>任务单号：</SDLText>
                            <SDLText style={[styles.content]}>{`${this.props.taskDetail.TaskCode && typeof this.props.taskDetail.TaskCode != 'undefined' ? this.props.taskDetail.TaskCode : ''}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>运营时段：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(this.props.taskDetail, ['OperationTime'], '')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>创建时间：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(this.props.taskDetail, ['CreateTime'], '')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>创建人：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(this.props.taskDetail, ['CreateUserName'], '')}`}</SDLText>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>来源及类型：</SDLText>
                            <SDLText style={[styles.content]}>{`${SentencedToEmpty(this.props.taskDetail, ['TaskFromText'], '')} | ${SentencedToEmpty(this.props.taskDetail, ['TaskTypeText'], '')}`}</SDLText>
                        </View>
                        
                        <View style={[styles.oneRow, {}]}>
                            <SDLText style={[styles.label]}>描述：</SDLText>
                            <SDLText style={[styles.content, { flex: 1 }]}>{`${SentencedToEmpty(this.props.taskDetail, ['Remark'], '暂未填写')}`}</SDLText>
                        </View>
                    </View>
                    <View style={[{ backgroundColor: globalcolor.white, marginTop: 10, marginBottom: 10, width: SCREEN_WIDTH, minHeight: 32, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'PointDetail',
                                        params: { DGIMN: this.props.taskDetail.DGIMN, Abbreviation: '', TargetName: this.props.taskDetail.EnterpriseName, PointName: this.props.taskDetail.PointName }
                                    })
                                );
                            }}
                        >
                            <View
                                style={[
                                    {
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Image source={require('../../images/intoTheStation.png')} style={{ width: 36, height: 36, marginBottom: 5 }} />
                                <Text style={[styles.actionLabel, {}]}>进入站房</Text>
                            </View>
                        </TouchableOpacity>
                        {SentencedToEmpty(this.props,['taskDetail','AlarmNums'],0)>0?(
                            <TouchableOpacity
                                onPress={() => {
                                    //'报警记录'
                                    this.props.dispatch(
                                        createAction('pointDetails/updateState')({
                                            sourceType:'AssociatedAlarm',// 任务中看报警
                                            alarmRecordsIndex: 1,
                                            alarmRecordsTotal: 0,
                                            alarmRecordsListData: [],
                                            alarmRecordsListTargetDGIMN: this.props.taskDetail.DGIMN,
                                            alarmRecordsBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                                            alarmRecordsEndTime: moment().format('YYYY-MM-DD 23:59:59'),
                                            alarmType: ''
                                        })
                                    );
                                    this.props.dispatch(
                                        createAction('alarm/updateState')({
                                            sourceType: 'AssociatedAlarm' // 任务详情关联报警
                                        })
                                    );
                                    let pFunctionType = 'AssociatedAlarm'
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'AlarmRecords',
                                            params: {
                                                pageType: 'AlarmDetail',
                                                functionType: pFunctionType //只查看报警信息
                                            }
                                        })
                                    );
                                    this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } }));
                                    this.props.dispatch(createAction('pointDetails/getAlarmRecords')({}));
                                    /**
                                     * GetTaskDetails 新加的字段 AlarmType
                                     * 0 异常报警 12 缺失报警 -1非响应任务
                                     */
                                    // let type = SentencedToEmpty(this.props.taskDetail,['AlarmType'],-1);
                                    // if ( type == 0 || type == 12) {
                                    //     let pFunctionType = 'OverVerify'
                                    //     if (this.props.taskDetail.AlarmType == 0) {
                                    //         pFunctionType = 'AlarmResponse'
                                    //         this.props.dispatch(
                                    //             createAction('alarm/updateState')({
                                    //                 sourceType: 'WorkbenchException'
                                    //             })
                                    //         );
                                    //         this.props.dispatch(
                                    //             createAction('pointDetails/updateState')({
                                    //                 sourceType: 'WorkbenchException'
                                    //             })
                                    //         );
                                    //     } else if (this.props.taskDetail.AlarmType == 12) {
                                    //         this.props.dispatch(
                                    //             createAction('alarm/updateState')({
                                    //                 sourceType: 'WorkbenchMiss'
                                    //             })
                                    //         );
                                    //         this.props.dispatch(
                                    //             createAction('pointDetails/updateState')({
                                    //                 sourceType: 'WorkbenchMiss'
                                    //             })
                                    //         );
                                    //         pFunctionType = 'WorkbenchMiss'
                                    //     }
                                    //     this.props.dispatch(
                                    //         NavigationActions.navigate({
                                    //             routeName: 'AlarmRecords',
                                    //             params: {
                                    //                 pageType: 'AlarmDetail',
                                    //                 functionType: pFunctionType //只查看报警信息
                                    //             }
                                    //         })
                                    //     );
                                    //     this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsIndex: 1, alarmRecordsTotal: 0, alarmRecordsListDataSelected: [], alarmRecordsListResult: { status: -1 } }));
                                    //     this.props.dispatch(createAction('pointDetails/getAlarmRecords')({}));
                                    // } else {
                                    //     ShowToast('报警信息获取失败');
                                    // }
                                    
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Image source={require('../../images/checkTheAlarm.png')} style={{ width: 36, height: 36, marginBottom: 5 }} />
                                    <Text style={[styles.actionLabel, {}]}>查看报警</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                            onPress={() => {
                                makePhone(this.props.taskDetail.EnProtectionPhone);
                            }}
                        >
                            <View
                                style={[
                                    {
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Image source={require('../../images/connection.png')} style={{ width: 36, height: 36, marginBottom: 5 }} />
                                <Text style={[styles.actionLabel, {}]}>{'联系专工'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* 审批 */}
                    {
                        this.props.needApproval?<View style={[styles.card, {marginTop:0, minHeight: 162, borderBottomWidth:1, borderBottomColor:globalcolor.borderBottomColor }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>拒绝原因</Text>
                            <View style={[styles.selectRow, { marginBottom: 15 }]}>
                                <TextInput
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            fontSize: 14,
                                            color: '#666666',
                                            textAlignVertical: 'top'
                                        }
                                    ]}
                                    placeholder={'请输入拒绝原因'}
                                    multiline={true}
                                    numberOfLines={2}
                                    placeholderTextColor={globalcolor.placeholderTextColor}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            ExamMsg: text
                                        });
                                    }}
                                />
                            </View>
                        </View>:null
                    }
                    {
                        this.props.needApproval?<View style={[{ height: 45, width: SCREEN_WIDTH, flexDirection: 'row', marginVertical:4 }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.examApplication(false);
                                    }}
                                >
                                    <View
                                        style={[
                                            {
                                                height: 45,
                                                width: SCREEN_WIDTH / 2 - 6,
                                                backgroundColor: 'white',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth:1,
                                                borderColor: globalcolor.borderBottomColor,
                                                borderRadius:8,
                                            }
                                        ]}
                                    >
                                        <Text style={[{ fontSize: 15, color: '#666666' }]}>拒绝</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width:8}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.examApplication(true);
                                    }}
                                >
                                    <View
                                        style={[
                                            {
                                                height: 45,
                                                width: SCREEN_WIDTH / 2 - 6,
                                                backgroundColor: 'white',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth:1,
                                                borderColor: globalcolor.borderBottomColor,
                                                borderRadius:8,
                                            }
                                        ]}
                                    >
                                        <Text style={[{ fontSize: 15, color: '#4ba1ff' }]}>同意</Text>
                                    </View>
                                </TouchableOpacity>
                        </View>:null
                    }
                    {/* 审批 end */}
                    {
                        SentencedToEmpty(this.props,['taskDetail','TaskLogList'],[]).length>0
                        ?<View style={[{ backgroundColor: globalcolor.white, width: SCREEN_WIDTH, flex: 1 }]}>
                            <TimeLine data={this.props.taskDetail.TaskLogList ? this.props.taskDetail.TaskLogList : []} />
                        </View>:null
                    }
                </KeyboardAwareScrollView>
                {/* {this.props.gasParametersChangeRecordSaveResult.status == -1?<SimpleLoadingComponent message={'提交中'} />:null} */}
                {this.props.approvalStatue.status== -1?<SimpleLoadingComponent message={'提交中'} />:null}
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    },
    oneRow: {
        width: SCREEN_WIDTH - 28,
        flexDirection: 'row',
        marginVertical: 5
    },
    card: {
        paddingHorizontal: 14,
        paddingVertical: 22,
        backgroundColor: 'white',
        marginTop: 11
    },
    label: {
        width: 88,
        color: globalcolor.recordde,
        fontSize: 15,
        marginRight: 15
    },
    content: {
        color: globalcolor.recordde,
        fontSize: 15
    }
});
