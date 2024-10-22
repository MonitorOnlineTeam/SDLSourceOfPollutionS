import React, { PureComponent } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StatusPage, Touchable, PickerTouchable } from '../../components';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { NavigationActions, createAction, SentencedToEmpty, ShowToast } from '../../utils';
import { connect } from 'react-redux';
import moment from 'moment';
const ic_filt_arrows = require('../../images/ic_filt_arrows.png');
/**
 * 审核列表
 */
@connect(({ app }) => ({
    // taskType: app.taskType
}))
export default class ApprovalPendingList extends PureComponent {
    static navigationOptions = {
        headerStyle: { backgroundColor: '#5688f6', height: 45 },

        headerTintColor: '#ffffff'
    };
    constructor(props) {
        super(props);
        this.state = {
            selectItem: this.props.selectItem,
            code: ''
        };
        _me = this;
    }

    formatShowTime = (time, dataType) => {
        if (time == null || time == '') {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('MM/DD HH:mm');
            case 'DayData':
                return moment(time).format('YYYY/MM/DD');
            case 'MonthData':
                return moment(time).format('YYYY/MM');
            case 'YearData':
                return moment(time).format('YYYY年');
        }
    };
    _extraUniqueKey = (item, index) => `index10${index}${item}`;
    getBQDate = (item) => {
        let ArriveTime = SentencedToEmpty(item, ['ArriveTime'], '');
        let LeaveTime = SentencedToEmpty(item, ['LeaveTime'], '');
        if (ArriveTime != '') {
            return moment(ArriveTime).format('YYYY-MM-DD');
        } else if (LeaveTime != '') {
            return moment(LeaveTime).format('YYYY-MM-DD');
        } else {
            return '------';
        }
    }
    _renderItemList = ({ item, index }) => {
        if (item.type == 1) {
            // 运维任务审批
            return (<TouchableOpacity
                onPress={() => {
                    this.props.dispatch(createAction('approvalModel/updateState')({ currentApproval: item }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'ApprovalDetails',
                            params: {
                                item: item
                            }
                        })
                    );
                }}
                style={[{ marginBottom: 5 }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 145
                        , paddingLeft: 20, backgroundColor: 'white'
                        , paddingVertical: 15, justifyContent: 'space-between'
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 20
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 15, color: '#333333'
                                , width: SCREEN_WIDTH - 100
                            }]}
                        >
                            {item.ImpPerson + '提交的任务申请'}
                        </Text>
                        <Image
                            style={[{ width: 60, height: 23 }]}
                            source={require('../../images/tag_task.png')}
                        />
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`企业名称：${item.EntName}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`监测点位：${item.PointName}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`计划执行时间：${this.formatShowTime(item.ImpTime, 'DayData')}`}
                        </Text>
                    </View>
                    {this.props.datatype == 0 ? (
                        //ExamStatus 0：待审批   1：同意  2：拒绝
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(createAction('approvalModel/updateState')({ currentApproval: item }));
                                let TaskID = SentencedToEmpty(item, ['TaskID'], '');
                                let DGIMN = SentencedToEmpty(item, ['DGIMN'], '');
                                if (TaskID != '') {
                                    this.props.dispatch(createAction('taskModel/updateState')({ TaskID, DGIMN, TaskCode: TaskID }));
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            // routeName: 'TaskExecution',
                                            routeName: 'TaskDetail',
                                            params: {
                                                needApproval: true,
                                                taskID: TaskID,
                                                TaskID,
                                                DGIMN,
                                                TaskCode: TaskID,
                                                canTransmitTask: false,
                                                onRefresh: this.props.onRefresh
                                            }
                                        })
                                    );
                                } else {
                                    ShowToast('任务信息错误');
                                }
                            }}
                        >
                            <View
                                style={[{
                                    width: 60, height: 23
                                    , backgroundColor: '#4AA0FF'
                                    , borderRadius: 5
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{
                                    fontSize: 12, color: '#FEFEFF'
                                }]}
                                >{'审批'}</Text>
                            </View>
                        </TouchableOpacity>) : null
                    }
                    {this.props.datatype != 0 ? (
                        //ExamStatus 0：待审批   1：同意  2：拒绝
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={[
                                    styles.grayText,
                                    {
                                        color: item.ExamStatus == 0 ? '#ECB142' : item.ExamStatus == 1 ? '#84C896' : '#DE5A59'
                                    }
                                ]}
                            >
                                {item.ExamStatus == 0 ? item.ExamPerson + '审批中' : item.ExamStatus == 1 ? '审批通过' : '审批未通过'}
                            </Text>
                            {item.ExamStatus == 2 && item.ExamMsg != null ? <Text style={[styles.grayText]}>{'原因：' + item.ExamMsg}</Text> : null}
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity >)
        } else {
            // item.type == 2
            // 补签审批
            return (<TouchableOpacity
                onPress={() => {
                    // SupplementarySignInApprove
                    // 整理图片数据
                    let _file = SentencedToEmpty(item, ['File'], []);
                    _file = [].concat(_file);
                    _file.map((imageItem, index) => {
                        imageItem.AttachID = imageItem.FileName;
                    });
                    item.File = _file;
                    // 整理时间线数据
                    // let timeLineList = [];
                    // timeLineList.push({
                    //     title: '发起申请',// 节点标题
                    //     chargePerson: item.ImpPerson,//节点负责人
                    //     time: item.CreateTime,// 节点触发时间
                    //     postscript: '',// 附言
                    //     processState: ''// 处理状态
                    // });
                    // timeLineList.push({
                    //     title: '审批人',// 节点标题
                    //     chargePerson: item.ExamPerson,//节点负责人
                    //     time: item.CreateTime,// 节点触发时间
                    //     postscript: '',// 附言
                    //     processState: '处理中'// 处理状态
                    // });
                    // item.timeLineList = timeLineList;
                    /**
                     * datatype
                     * 待我审批 0
                     * 我已审批 2
                     * 我发起的 1
                     */
                    if (this.props.datatype == 0) {
                        item.editType = 'approver';
                    } else if (this.props.datatype == 1) {
                        item.editType = 'uploader';
                    } else if (this.props.datatype == 2) {

                    }

                    // item.editType =
                    this.props.dispatch(NavigationActions.navigate({
                        routeName: 'SupplementarySignInApprove'
                        , params: { item: item }
                    }));
                }}
                style={[{ marginBottom: 5 }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 145
                        , paddingLeft: 20, backgroundColor: 'white'
                        , paddingVertical: 15, justifyContent: 'space-between'
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 20
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 15, color: '#333333'
                                , width: SCREEN_WIDTH - 100
                            }]}
                        >
                            {item.ImpPerson + '提交的补签申请'}
                        </Text>
                        <Image
                            style={[{ width: 60, height: 23 }]}
                            source={require('../../images/tag_retroactive.png')}
                        />
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`企业名称：${item.EntName}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {/* {`补签日期：${this.formatShowTime(item.ImpTime, 'DayData')}`} */}
                            {`补签日期：${this.getBQDate(item)}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`现场类型：运维现场`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', alignItems: 'center'
                            , justifyContent: 'space-between'
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 14, color: '#666666'
                            }]}
                        >
                            {`补签类型：${SentencedToEmpty(item, ['RepairSignType'], '')}`}
                        </Text>
                    </View>
                    {this.props.datatype == 0 ? (
                        //ExamStatus 0：待审批   1：同意  2：拒绝
                        <TouchableOpacity
                            onPress={() => {
                                let _file = SentencedToEmpty(item, ['File'], []);
                                _file = [].concat(_file);
                                _file.map((imageItem, index) => {
                                    imageItem.AttachID = imageItem.FileName;
                                });
                                item.File = _file;
                                /**
                                 * datatype
                                 * 待我审批 0
                                 * 我已审批 2
                                 * 我发起的 1
                                 */
                                if (this.props.datatype == 0) {
                                    item.editType = 'approver';
                                } else if (this.props.datatype == 1) {
                                    item.editType = 'uploader';
                                } else if (this.props.datatype == 2) {

                                }
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'SupplementarySignInApprove'
                                    , params: { item: item }
                                }));
                            }}
                        >
                            <View
                                style={[{
                                    width: 60, height: 23
                                    , backgroundColor: '#4AA0FF'
                                    , borderRadius: 5
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{
                                    fontSize: 12, color: '#FEFEFF'
                                }]}
                                >{'审批'}</Text>
                            </View>
                        </TouchableOpacity>) : null
                    }
                    {this.props.datatype != 0 ? (
                        //ExamStatus 0：待审批   1：同意  2：拒绝
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={[
                                    styles.grayText,
                                    {
                                        color: item.ExamStatus == 0 ? '#ECB142' : item.ExamStatus == 1 ? '#84C896' : '#DE5A59'
                                    }
                                ]}
                            >
                                {item.ExamStatus == 0 ? item.ExamPerson + '审批中'
                                    : item.ExamStatus == 1 ? '审批通过'
                                        : item.ExamStatus == 2 ? '审批未通过'
                                            : item.ExamStatus == 4 ? '补签已撤销' : '未知状态'}
                            </Text>
                            {/* {item.ExamStatus == 2 && item.ExamMsg != null ? <Text style={[styles.grayText]}>{'原因：' + item.ExamMsg}</Text> : null} */}
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>);
        }
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    backgroundColor: '#ffffff',
                    width: SCREEN_WIDTH,
                    minHeight: this.props.datatype != 1 ? 130 : 110,
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    this.props.dispatch(createAction('approvalModel/updateState')({ currentApproval: item }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'ApprovalDetails',
                            params: {
                                item: item
                            }
                        })
                    );
                }}
            >
                <View style={{ marginBottom: 10, maxWidth: SCREEN_WIDTH - 90 }}>
                    {/* <Text style={[styles.grayText, { marginTop: 15, fontSize: 15, color: '#333333' }]}>{item.ImpPerson + '提交的' + item.TaskContentTypeName + '申请'}</Text> */}
                    <Text numberOfLines={1} style={[styles.grayText, { marginTop: 15, fontSize: 15, color: '#333333' }]}>{item.ImpPerson + '提交的任务申请'}</Text>
                    <Text numberOfLines={1} style={[styles.grayText, { marginTop: 10 }]}>
                        {'企业名称：' + item.EntName}
                    </Text>
                    <Text style={styles.grayText}>{'监测点位：' + item.PointName}</Text>
                    <Text style={styles.grayText}>{'计划执行日期：' + this.formatShowTime(item.ImpTime, 'DayData')}</Text>
                    {this.props.datatype != 0 ? (
                        //ExamStatus 0：待审批   1：同意  2：拒绝
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={[
                                    styles.grayText,
                                    {
                                        color: item.ExamStatus == 0 ? '#ECB142' : item.ExamStatus == 1 ? '#84C896' : '#DE5A59'
                                    }
                                ]}
                            >
                                {item.ExamStatus == 0 ? item.ExamPerson + '审批中' : item.ExamStatus == 1 ? '审批通过' : '审批未通过'}
                            </Text>
                            {item.ExamStatus == 2 && item.ExamMsg != null ? <Text style={[styles.grayText]}>{'原因：' + item.ExamMsg}</Text> : null}
                        </View>
                    ) : null}
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text
                        style={[
                            styles.grayText,
                            {
                                right: 15,
                                width: 90,
                                top: 5,
                                position: 'absolute',
                                textAlign: 'right',
                                color: '#999999'
                            }
                        ]}
                    >
                        {this.formatShowTime(item.CreateTime, 'HourData')}
                    </Text>
                    {this.props.datatype == 0 ? (
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#5688f6',
                                width: 55,
                                height: 30,
                                borderRadius: 3
                            }}
                            onPress={() => {
                                this.props.dispatch(createAction('approvalModel/updateState')({ currentApproval: item }));
                                let TaskID = SentencedToEmpty(item, ['item', 'TaskID'], '');
                                let DGIMN = SentencedToEmpty(item, ['item', 'DGIMN'], '');
                                if (TaskID != '') {
                                    this.props.dispatch(createAction('taskModel/updateState')({ TaskID, DGIMN, TaskCode: TaskID }));
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            // routeName: 'TaskExecution',
                                            routeName: 'TaskDetail',
                                            params: {
                                                needApproval: true,
                                                taskID: TaskID,
                                                TaskID,
                                                DGIMN,
                                                TaskCode: TaskID,
                                                canTransmitTask: false,
                                                onRefresh: this.props.onRefresh
                                            }
                                        })
                                    );
                                } else {
                                    ShowToast('任务信息错误');
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>审批</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        const { needLeaveRefresh = true } = this.props;
        return (
            <View style={styles.container}>
                <StatusPage
                    // backRef={needLeaveRefresh}
                    status={this.props.approvaData.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.props.onRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.props.onRefresh();
                    }}
                >
                    <FlatList
                        style={{ height: SCREEN_HEIGHT - 160 }}
                        // ListEmptyComponent={() => (this.props.data ? null : <View style={{ height: SCREEN_HEIGHT - 600, marginTop: 200 }}><NoDataComponent Message={'暂无数据'} /></View>)}
                        overScrollMode={'never'}
                        // data={this.props.approvaData.status == 200 ? this.props.approvaData.data.data : []}
                        data={this.props.approvaData.status == 200 ? this.props.approvaData.data.Datas : []}
                        renderItem={this._renderItemList}
                        keyExtractor={this._extraUniqueKey}
                        onEndReachedThreshold={0.5}
                        initialNumToRender={30}
                        refreshing={false}
                        onRefresh={this.props.onRefresh}
                        onEndReached={info => {
                            if (this.props.approvaData.data.Datas.length >= 10) {
                                this.props.onEndReached();
                            }
                        }}
                    />
                </StatusPage>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column'
    },
    grayText: {
        color: '#666666',
        fontSize: 13,
        marginLeft: 10,
        marginTop: 6
    }
});
