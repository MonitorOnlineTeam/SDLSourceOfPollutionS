//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Clipboard, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BoxShadow } from 'react-native-shadow';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../config/globalsize';
import globalcolor from '../../../config/globalcolor';
import { ShowToast, createAction, SentencedToEmpty, NavigationActions } from '../../../utils';
import { getToken } from '../../../dvapack/storage';

/**任务描述tab页 */
@connect(({ taskModel, approvalModel }) => ({
    currentTask: taskModel.currentTask,
    currentApproval: approvalModel.currentApproval
}))
class TaskInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ExamMsg: ''
        };
    }

    componentDidMount() { }

    _copyTaskCode = () => {
        Clipboard.setString(this.props.TaskDetail && this.props.TaskDetail.TaskCode ? this.props.TaskDetail.TaskCode : '');
        ShowToast('任务单号已复制');
    };

    onRefresh = () => {
        this.props.dispatch(createAction('excuteTask/getTaskDetail')({}));
    };

    showTaskStatus = () => {
        let showStr = '未知状态';
        if (SentencedToEmpty(this.props.currentTask, ['TaskStatus'], '') == '') {
            showStr = '未知状态';
        } else if (this.props.currentTask.TaskStatus == 1) {
            showStr = '待执行';
        } else if (this.props.currentTask.TaskStatus == 2) {
            showStr = '进行中';
        } else if (this.props.currentTask.TaskStatus == 3) {
            showStr = '已完成';
        }
        return showStr;
    };

    showAuditStatus = () => {
        let showStr = '未知状态';
        if (SentencedToEmpty(this.props.currentTask, ['AuditStatus'], '') == '') {
            showStr = '未知状态';
        } else if (this.props.currentTask.AuditStatus == 1) {
            showStr = '待审批';
        } else if (this.props.currentTask.AuditStatus == 2) {
            showStr = '同意';
        } else if (this.props.currentTask.AuditStatus == 3) {
            showStr = '拒绝';
        }
        return showStr;
    };

    needApproval = () => {
        let boolNeedApproval = false;
        if (SentencedToEmpty(this.props.currentTask, ['AuditStatus'], '') == '') {
            boolNeedApproval = false;
        } else if (this.props.currentTask.AuditStatus == 1) {
            //待审批
            if (this.props.currentTask.OperationsUserID != getToken().User_ID) {
                boolNeedApproval = true;
            } else {
                boolNeedApproval = false;
            }
        } else if (this.props.currentTask.AuditStatus == 2) {
            //同意
            boolNeedApproval = false;
        } else if (this.props.currentTask.AuditStatus == 3) {
            //拒绝
            boolNeedApproval = false;
        }
        return boolNeedApproval;
    };

    //任务申请审批
    examApplication = isConsent => {
        let params = {};
        params.ID = this.props.currentApproval.ID;
        if (isConsent) {
            params.ExamStaus = 1;
            params.ExamMsg = SentencedToEmpty(this.state, ['ExamMsg'], '同意') || '同意';
        } else {
            params.ExamStaus = 2;
            params.ExamMsg = SentencedToEmpty(this.state, ['ExamMsg'], '拒绝');
        }
        this.props.dispatch(
            createAction('approvalModel/examApplication')({
                params,
                callback: () => {
                    this.props.onRefresh();
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    getDay = dateStr => {
        if (dateStr == '') {
            return '';
        } else {
            return dateStr.split(' ')[0];
        }
    };

    render() {
        // console.log(this.props.TaskDetail.TaskLogList);
        // return (
        //     <StatusPage style={{flex:1,justifyContent:'center'}} status={this.props.status} button={{name:"重新加载",callback:()=>{this.onRefresh();}}}>
        //     <View style={styles.container}>
        //             <View style={{width:SCREEN_WIDTH,flex:1}}>
        //                 <View style={[{backgroundColor:globalcolor.white,width:SCREEN_WIDTH,flex:1,}]}>
        //                     <TimeLine data={this.props.TaskDetail.TaskLogList?this.props.TaskDetail.TaskLogList:[]} />
        //                 </View>
        //             </View>
        //     </View>
        //     </StatusPage>
        // );
        return (
            <View style={[styles.container]}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[styles.card]}>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>任务单号</Text>
                            <Text style={[styles.content]}>{`${this.props.currentTask.TaskCode && typeof this.props.currentTask.TaskCode != 'undefined' ? this.props.currentTask.TaskCode : ''}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>企业名称</Text>
                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.content, { flex: 1 }]}>{`${SentencedToEmpty(this.props.currentTask, ['EntName'], '')}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>监测点位</Text>
                            <Text style={[styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['PointName'], '')}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>项目编号</Text>
                            <Text style={[styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['ItemNumber'], '')}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>接手运营日期</Text>
                            <Text style={[styles.content]}>{`${this.getDay(SentencedToEmpty(this.props.currentTask, ['OperationStartTime'], ''))}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>运营结束日期</Text>
                            <Text style={[styles.content]}>{`${this.getDay(SentencedToEmpty(this.props.currentTask, ['OperationEndTime'], ''))}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>任务类型</Text>
                            <Text style={[styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['TaskContentType'], '')}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>审批状态</Text>
                            <Text style={[styles.content]}>{`${this.showAuditStatus()}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>创 建 人</Text>
                            <Text style={[styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['CreateUser'], '')}`}</Text>
                        </View>
                        <View style={[styles.oneRow, {}]}>
                            <Text style={[styles.label]}>创建时间</Text>
                            <Text style={[styles.content]}>{`${SentencedToEmpty(this.props.currentTask, ['CreateTime'], '')}`}</Text>
                        </View>
                    </View>
                    {this.needApproval() ? (
                        <View style={[styles.card, { minHeight: 162 }]}>
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
                        </View>
                    ) : null}
                </KeyboardAwareScrollView>
                {this.needApproval() ? (
                    <View style={[{ height: 45, width: SCREEN_WIDTH, flexDirection: 'row' }]}>
                        <BoxShadow
                            setting={{
                                height: 45,
                                width: SCREEN_WIDTH / 2 - 1,
                                color: '#666',
                                border: 2,
                                radius: 0,
                                opacity: 0.5,
                                x: 0,
                                y: 0
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.examApplication(false);
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH / 2 - 1,
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 15, color: '#666666' }]}>拒绝</Text>
                                </View>
                            </TouchableOpacity>
                        </BoxShadow>
                        <BoxShadow
                            setting={{
                                height: 45,
                                width: SCREEN_WIDTH / 2 - 1,
                                color: '#666',
                                border: 2,
                                radius: 0,
                                opacity: 0.5,
                                x: 0,
                                y: 0
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.examApplication(true);
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH / 2 - 1,
                                            backgroundColor: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 15, color: '#4ba1ff' }]}>同意</Text>
                                </View>
                            </TouchableOpacity>
                        </BoxShadow>
                    </View>
                ) : null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    card: {
        paddingHorizontal: 14,
        paddingVertical: 22,
        backgroundColor: 'white',
        marginTop: 11
    },
    oneRow: {
        width: SCREEN_WIDTH - 28,
        flexDirection: 'row',
        marginVertical: 8
    },
    selectRow: {
        width: SCREEN_WIDTH - 26,
        height: 45,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        color: globalcolor.searchbartv,
        fontSize: 15,
        marginRight: 15
    },
    content: {
        color: globalcolor.recordde,
        fontSize: 15
    },
    scrollView: {
        flex: 1,
        width: SCREEN_WIDTH,
        backgroundColor: 'white'
    },
    infoContainer: {
        width: SCREEN_WIDTH,
        marginVertical: 10,
        backgroundColor: globalcolor.white,
        padding: 13
    },
    infoRow: {
        width: SCREEN_WIDTH - 28,
        flexDirection: 'row'
    },
    infoLabel: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel,
        width: 80
    },
    actionLabel: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    textContent: {
        flex: 1,
        color: globalcolor.normalFont
    },
    title: {
        fontSize: 14,
        // fontWeight: 'bold'
        color: '#666666'
    },
    descriptionContainer: {
        paddingRight: 50,
        marginTop: 10
    },
    textDescription: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 10
    }
});

//make this component available to the app
export default TaskInfo;
