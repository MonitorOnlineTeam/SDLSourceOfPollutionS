import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
// import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty, NavigationActions } from '../../../utils';
import { StatusPagem, SimpleLoadingComponent, Touchable, FlatListWithHeaderAndFooter, SDLText, StatusPage, AlertDialog } from '../../../components';
import globalcolor from '../../../config/globalcolor.js';
import { SCREEN_HEIGHT } from '../../../components/SDLPicker/constant/globalsize';

/**
 * 待办任务
 * @class Audit
 * @extends {Component}
 */
@connect(({ taskModel }) => ({
    unhandleTaskListResult: taskModel.unhandleTaskListResult,
    unhandleTaskListTotal: taskModel.unhandleTaskListTotal,
    unhandleTaskListData: taskModel.unhandleTaskListData
}))
export default class GTasks extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '待办任务'),
            headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
        });

    constructor(props) {
        super(props);
        this.state = {
            rightButtonText: '编辑',
            editState: false,
            selectArr: [],
            giveUpTask: null,// 弃领任务信息
            revokeTask: null, // 撤销任务
        };

        this.props.navigation.setOptions({
            headerRight: () => <TouchableOpacity
                onPress={() => {
                    this.changeHeaderRight();
                    this.setState({ editState: !this.state.editState, selectArr: [] });
                }}
            >
                {/* <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{this.state.editState ? '取消' : '转发'}</SDLText>
            </TouchableOpacity>
        });
    }

    componentDidMount() {
        // 前一级设置为加载状态
        this.props.dispatch(createAction('taskModel/updateState')({ UnhandleTaskTypeListResult: { status: -1 } }))
        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.changeHeaderRight();
                        this.setState({ editState: !this.state.editState, selectArr: [] });
                    }}
                >
                    {/* <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'转发'}</SDLText>
                </TouchableOpacity>
            )
        });
        this.statusPageOnRefresh();
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('taskModel/getUnhandleTaskTypeList')({}))
    }

    onRefresh = index => {
        this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index, unhandleTaskListTotal: 0 }));
        this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
    };

    onPress = (item, index) => {
        if (this.state.editState == true) {
            this.selectItem(item, index);
        } else {
            this.excuteTask(item);
        }
    };

    selectItem = (item, index) => {
        console.log(item, ' ', index);
        let newUnhandleTaskListData = this.props.unhandleTaskListData.concat([]);
        let selectArr = this.state.selectArr;
        if (SentencedToEmpty(newUnhandleTaskListData[index], ['selected'], false)) {
            newUnhandleTaskListData[index].selected = false;
            delete selectArr[index];
        } else {
            newUnhandleTaskListData[index].selected = true;
            selectArr[index] = item;
        }
        this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListData: newUnhandleTaskListData }));
        this.setState(
            Object.assign({}, this.state, {
                selectArr: selectArr
            })
        );
        this.forceUpdate();
        console.log(selectArr);
    };

    excuteTask = item => {
        //代办任务没有任务单号
        this.props.dispatch(createAction('taskModel/updateState')({ TaskID: item.TaskID, DGIMN: item.DGIMN }));
        this.props.dispatch(createAction('taskDetailModel/updateState')({ tabIndex: 0, status: -1 }));
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'TaskDetail',
                params: { taskID: item.TaskID }
            })
        );
    };

    transTask = (TaskID, DGIMN) => {
        this.props.dispatch(createAction('taskModel/updateState')({ TaskID, DGIMN }));
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'TaskTransfer',
                params: {}
            })
        );
    };

    onLongPress = () => {
        console.log('onLongPress');
        this.setState({ editState: true, selectArr: [] });
        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.changeHeaderRight();
                        this.setState({ editState: !this.state.editState, selectArr: [] });
                    }}
                >
                    {/* <Image style={{ height: 16, width: 16, marginHorizontal: 16 }} source={require('../../../images/ic_fork.png')} /> */}
                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'取消'}</SDLText>
                </TouchableOpacity>
            )
        });
    };

    changeHeaderRight = () => {
        this.state.selectArr.map((item, index) => {
            this.selectItem(item, index);
        });
        if (this.state.editState == false) {
            this.props.navigation.setParams({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => {
                            this.changeHeaderRight();
                            this.setState({ editState: !this.state.editState, selectArr: [] });
                        }}
                    >
                        {/* <Image style={{ height: 16, width: 16, marginHorizontal: 16 }} source={require('../../../images/ic_fork.png')} /> */}
                        <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'取消'}</SDLText>
                    </TouchableOpacity>
                )
            });
        } else {
            this.props.navigation.setParams({
                headerRight: (
                    <TouchableOpacity
                        onPress={() => {
                            this.changeHeaderRight();
                            this.setState({ editState: !this.state.editState, selectArr: [] });
                        }}
                    >
                        {/* <Image style={{ height: 16, width: 16, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                        <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'转发'}</SDLText>
                    </TouchableOpacity>
                )
            });
        }
    };

    getItemTime = (item, name, formatStr, defaultStr) => {
        let incomeTimeStr = SentencedToEmpty(item, [name], '');
        if (incomeTimeStr == '') {
            if (typeof defaultStr == 'undefined') {
                return 'xxxx-xx-xx xx:xx';
            } else {
                return defaultStr;
            }
        } else {
            return moment(incomeTimeStr).format(formatStr);
        }
    };

    renderItem = ({ item, index }) => {
        /**
         * item.TaskFrom
         * 任务来源
         * 1 手动创建
         * 2 报警响应
         * 3 监管派单
         * 4 自动派单
         */
        return (
            <Touchable
                onPress={() => this.onPress(item, index)}
                // onLongPress={() => this.onLongPress()}
                style={[{ height: 165, width: SCREEN_WIDTH, backgroundColor: '#fff', paddingHorizontal: 13, justifyContent: 'center', paddingTop: 15, paddingBottom: 16, paddingHorizontal: 13 }]}
            >
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        {this.state.editState ? (
                            <Image
                                source={SentencedToEmpty(item, ['selected'], false) ? require('../../../images/ic_reported_check.png') : require('../../../images/ic_reported_uncheck.png')}
                                style={[{ width: 16, height: 16, marginRight: 8 }]}
                            />
                        ) : null}
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {`${SentencedToEmpty(item, ['PointName'], '未知排口')}`}
                        </SDLText>
                    </View>
                    <SDLText fontType={'small'} style={[{ color: '#f73f38' }]}>
                        {`${SentencedToEmpty(item, ['ExpireRemind'], '')}`}
                    </SDLText>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            (item.RecordType == 3 || item.RecordType == 9 || item.RecordType == 1 || item.RecordType == 7) && item.TaskFrom == 4 && item.GiveUp
                                ? <Touchable
                                    onPress={() => {
                                        // console.log('弃领');
                                        this.setState({ giveUpTask: item });
                                        this.refs.giveUpCalibration.show();
                                    }}>
                                    <View style={[{
                                        height: 21, width: 37, borderRadius: 10, borderWidth: 1, borderColor: '#7398bf'
                                        , justifyContent: 'center', alignItems: 'center', marginLeft: 16, marginVertical: 4
                                    }]}>
                                        <Text style={[{ color: '#7398bf', fontSize: 11 }]}>{'弃领'}</Text>
                                    </View>
                                </Touchable> : null
                        }
                        {
                            /***
                                任务类型为 手工创建
                            */
                            SentencedToEmpty(item, ['TaskFrom'], -1) == 1 ?
                                <Touchable
                                    onPress={() => {
                                        console.log('撤销');
                                        this.setState({ revokeTask: item });
                                        this.refs.revokeTaskAlert.show();
                                    }}>
                                    <View style={[{
                                        height: 21, width: 37, borderRadius: 10, borderWidth: 1, borderColor: '#7398bf'
                                        , justifyContent: 'center', alignItems: 'center', marginLeft: 16, marginVertical: 4
                                    }]}>
                                        <Text style={[{ color: '#7398bf', fontSize: 11 }]}>{'撤销'}</Text>
                                    </View>
                                </Touchable> : (null)
                        }
                    </View>
                </View>
                <View style={{ width: SCREEN_WIDTH - 26 }}>
                    <SDLText numberOfLines={1} fontType={'small'} style={[{ color: '#666', marginTop: 13 }]}>
                        {SentencedToEmpty(item, ['PollutantTypeCode'], '') == '5' ? `大气站：${SentencedToEmpty(item, ['EnterName'], '---')}` : `企业名称：${SentencedToEmpty(item, ['EnterName'], '未知企业')}`}
                    </SDLText>

                    <SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                        {`任务来源及类型：${SentencedToEmpty(item, ['TaskFromName'], '-')}|${SentencedToEmpty(item, ['RecordTypeName'], '-')}`}
                    </SDLText>
                    <View style={[{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }]}>
                        <SDLText fontType={'small'} style={[{ color: '#666' }]}>
                            {`任务状态：`}
                        </SDLText>
                        <SDLText fontType={'small'} style={[{ color: '#49a1fe' }]}>
                            {`${SentencedToEmpty(item, ['TaskStatus'], '未知任务状态')}`}
                        </SDLText>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }}>
                            {/*//null 0 为 未审核   1 审核中 2 审核通过 3 审核未通过
                                typeof item.AuditStatus != 'undefined'?<Image
                                style={{ position: 'absolute', width: 24, height: 24, right: 0, bottom: 0 }}
                                source={typeof item.AuditStatus != 'undefined'&& item.AuditStatus == null ? require('../../../images/daishenpi.png') 
                                    :item.AuditStatus == 1 ? require('../../../images/daishenpi.png') 
                                    :item.AuditStatus == 2 ? require('../../../images/duihao.png') 
                                    :item.AuditStatus == 3? require('../../../images/cuohao.png')
                                    :require('../../../images/daohang.png')}
                            />:null */}
                            <SDLText fontType={'small'} style={[{
                                marginVertical: 4,
                                color: typeof item.AuditStatus != 'undefined' && item.AuditStatus == null ? '#FFD700'
                                    : item.AuditStatus == 0 ? '#FFD700'
                                        : item.AuditStatus == 1 ? '#FFD700'
                                            : item.AuditStatus == 2 ? '#3CB371'
                                                : item.AuditStatus == 3 ? '#FF6347'
                                                    : '#FFD700'
                            }]}>
                                {
                                    SentencedToEmpty(item, ['AuditStatusName'], '')
                                }
                            </SDLText>
                        </View>
                    </View>
                    <SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                        {/* {`创建时间：${this.getItemTime(item, 'CreateTime', 'YYYY/MM/DD HH:mm', '----/--/-- --:--')}`} */}
                        {`派发时间：${this.getItemTime(item, 'CreateTime', 'YYYY/MM/DD HH:mm', '----/--/-- --:--')}`}
                    </SDLText>
                    {item.TaskFrom == 4 ? <SDLText SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                        {/* {`创建时间：${this.getItemTime(item, 'CreateTime', 'YYYY/MM/DD HH:mm', '----/--/-- --:--')}`} */}
                        {`有效期：${this.getItemTime(item, 'TaskOverTime', 'YYYY/MM/DD HH:mm', '----/--/-- --:--')}`}
                    </SDLText> : null}
                    {/* <SDLText numberOfLines={1} ellipsizeMode={'tail'} fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                        {`备        注：${SentencedToEmpty(item, ['Remark'], '无备注信息')}`}
                    </SDLText> */}
                </View>
            </Touchable >
        );
    };

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: 1, unhandleTaskListTotal: 0, unhandleTaskListResult: { status: -1 } }));
        this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({}));
    };

    giveUpTask = () => {
        if (typeof this.state.giveUpTask != 'undefined' && this.state.giveUpTask) {
            // 参数  Type（1、领取；2、弃领） TaskID
            this.props.dispatch(createAction('claimTaskModels/receiveTask')({
                params: { Type: 2, TaskID: this.state.giveUpTask.TaskID }
                , success: () => {
                    ShowToast('弃领任务成功');
                    // this.statusPageOnRefresh();
                    this.onRefresh(1);
                }, failure: () => {
                    ShowToast('弃领任务失败');
                }
            }));
        } else {
            ShowToast('任务信息错误');
        }
    }

    giveUpCalibrationOptions = {
        headTitle: '提示',
        messText: '是否确定要弃领此任务吗？',
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
                onpress: this.giveUpTask
            }
        ]
    };

    revokeTask = () => {
        console.log('revokeTask fun ');
        this.props.dispatch(createAction('taskModel/revokeTask')({
            item: this.state.revokeTask,
            callback: () => {
                this.setState({ revokeTask: null });
            }
        }));
    }

    revokeTaskOptions = {
        headTitle: '提示',
        messText: '是否确定要撤销此任务吗？',
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
                onpress: this.revokeTask
            }
        ]
    };

    render() {
        return (
            <StatusPage
                // backRef={true}
                status={this.props.unhandleTaskListResult.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    this.statusPageOnRefresh();
                }}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index }));
                        this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
                    }}
                    renderItem={this.renderItem}
                    data={this.props.unhandleTaskListData}
                />
                {this.state.editState == true ? (
                    <TouchableOpacity
                        onPress={() => {
                            let taskid = '';
                            this.state.selectArr.map(item => {
                                if (item.TaskID) {
                                    taskid = taskid + item.TaskID + ',';
                                }
                            });
                            if (taskid == '') {
                                ShowToast('请选择任务后继续操作');
                            } else {
                                this.transTask(taskid);
                            }
                        }}
                        style={{ height: 45, width: SCREEN_WIDTH, backgroundColor: globalcolor.headerBackgroundColor, position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>转发</SDLText>
                    </TouchableOpacity>
                ) : null}
                <AlertDialog options={this.giveUpCalibrationOptions} ref="giveUpCalibration" />
                <AlertDialog options={this.revokeTaskOptions} ref="revokeTaskAlert" />
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
