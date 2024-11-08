import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Platform, DeviceEventEmitter, ActivityIndicator, ScrollView } from 'react-native';
// import { BaseTable, PickerSingleTimeTouchable, PickerTouchable, KeyboardDis, AlertDialog, Touchable, SimpleMultipleItemPicker, StatusPage, SimplePicker, OperationAlertDialog, SimpleLoadingView } from '../../../components';
import { PickerTouchable, KeyboardDis, AlertDialog, Touchable, StatusPage, OperationAlertDialog, SimpleLoadingView, SimplePicker } from '../../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../config/globalsize';
import { connect } from 'react-redux';
import moment from 'moment';
import SimpleLoadingComponent from '../../../components/SimpleLoadingComponent';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import { getToken } from '../../../dvapack/storage';
import { TouchableOpacity } from 'react-native';
const ic_arrows_down = require('../../../images/ic_arrows_down.png');

/**
 * 创建任务
 * @class CreateTask
 * @extends {Component}
 */
@connect(({ app, taskModel }) => ({
    enterpriseData: app.enterpriseData,
    applyData: taskModel.applyData,
    selectEnterprise: app.selectEnterprise,
    taskType: taskModel.taskType,
    pointListByEntResult: app.pointListByEntResult,
    operationSettingResult: app.operationSettingResult,
}))
export default class CreateTask extends Component {
    static navigationOptions = createNavigationOptions({
        title: '创建任务',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            selectPointItem: { PointName: '请选择监测点位' }, // 选中排口
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss'),// 执行时间
            remark: '', // 备注
            selectTaskItem: [],// 任务类型
            claimTaskCheck: false, // 是否经过任务领取检验
            claimTaskState: -1, // 当前排口领取任务状态
            // 已领取任务提示信息配置
            calibrationTaskAlreadyClaimedOptions: {
                hiddenTitle: true,
                innersHeight: 120,
                messText: `运维工程师“***”名下存在待执行/执行中的校准工单，完成后方可申领新的校准工单。`,
                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                buttons: [
                    {
                        txt: '确定',
                        btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                        onpress: () => { }
                    }
                ]
            }
        };
        // 创建任务钱最后确认信息，确认排口所属运维公司
        this.state.commitTaskOptions = {
            hiddenTitle: true,
            innersHeight: 150,
            messText: '该监测点是否由《雪迪龙科技股份有限公司》运维？如果不是请联系管理员进行设置。',
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '不是',
                    btnStyle: { backgroundColor: '#fff' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => { }
                },
                {
                    txt: '确定并创建',
                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                    txtStyle: { color: '#5688f6', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => {
                        console.log('selectPointItem = ', this.state.selectPointItem);
                        let taskStr = '';
                        this.state.selectTaskItem.map(item => {
                            taskStr = item.ID + ',' + taskStr;
                        });

                        this.props.dispatch(
                            createAction('taskModel/commitTaskApply')({
                                params: {
                                    operationEntCode: this.state.selectPointItem.OperationCompanyID,
                                    ImplementDate: this.state.selectTime,
                                    taskFrom: '1',
                                    remark: this.state.remark,
                                    DGIMNs: this.state.selectPointItem.DGIMN,
                                    RecordType: taskStr,
                                    // createUserId:getToken().UserId,
                                    operationsUserId: getToken().UserId,
                                },
                                backViewFun: () => {
                                    this.props.dispatch(NavigationActions.back({ routeName: 'Workbench' }));
                                }
                            })
                        );
                    }
                }
            ]
        }
    }

    componentDidMount() {
        this.props.dispatch(createAction('taskModel/updateState')({ taskType: { status: -1 } }));
        const operationSettingStatus = SentencedToEmpty(this.props, ['operationSettingResult', 'status'], -1);
        if (operationSettingStatus != 200) {
            this.onFreshData();
        }
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('app/updateState')({ selectEnterprise: { EntName: '请选择' } }))
    }

    // 企业选择器配置
    getEnterprise = () => {
        return {
            codeKey: 'EntCode',
            nameKey: 'EntName',
            defaultCode: this.props.enterpriseData.data.data[0].EntCode,
            dataArr: this.props.enterpriseData.data.data,
            onSelectListener: item => {
                this.setState({
                    selectEnterPriseItem: item
                });
            }
        };
    };

    // 排口选择器配置
    getPointSelect = () => {
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            dataArr: this.props.selectEnterprise.PointList || [],
            onSelectListener: item => {
                this.handlePointSelected(item)
            }
        };
    };

    handlePointSelected = (item) => {
        if (item && typeof item != 'undefined') {
            this.props.dispatch(
                createAction('taskModel/getTaskType')({
                    params: {
                        PollutantType: item.PollutantType,
                        isApplication: 1,// 过滤掉报警处理的任务类型
                        callback: item => {
                            this.props.taskType = item;
                            this.forceUpdate();
                        }
                    }
                })
            );
            this.setState({
                selectPointItem: item
            }, () => {
                /**
                 * OperationName    运维公司名称
                 * OperationStatus  是否在运维周期内
                 * OperationType    1SDL运维，2其他公司
                 */
                const user = getToken();
                if (!SentencedToEmpty(user, ['IsShowTask'], false) && SentencedToEmpty(this.state, ['selectPointItem', 'OperationUserName'], '') == '') {
                    SentencedToEmpty(this, ['refs', 'withoutOperationUserNameAlert', 'show'], () => { })();
                    return;
                } else if (!item.OperationStatus) {
                    // 合同到期
                    SentencedToEmpty(this, ['refs', 'outContractAlert', 'show'], () => { })();
                }
            });
        }
    }

    // 执行时间选择器配置
    getTimeSelectOption = () => {
        let type = 'day';
        return {
            type: type,
            onSureClickListener: time => {
                this.setState({
                    selectTime: this.formatTime(time, 'DayData')
                });
            }
        };
    };
    // 日期格式化工具
    formatShowTime = (time, dataType) => {
        if (time == null || time == '') {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('MM/DD HH:00');
            case 'DayData':
                return moment(time).format('YYYY/MM/DD');
            case 'MonthData':
                return moment(time).format('YYYY/MM');
            case 'YearData':
                return moment(time).format('YYYY年');
        }
    };
    // 获取标准时间工具
    formatTime = (time, dataType) => {
        if (time == null) {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('YYYY-MM-DD HH:00:00');
            case 'DayData':
                return moment(time).format('YYYY-MM-DD 00:00:00');
            case 'MonthData':
                return moment(time).format('YYYY-MM-01 00:00:00');
            case 'YearData':
                return moment(time).format('YYYY-01-01 00:00:00');
        }
    };

    judgeEnterprise = () => {
        ShowToast('请先选择企业或监测站');
    };
    callback = item => {
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
                        let newData = { ...this.props.selectEnterprise }
                        newData.PointList = item;
                        this.props.dispatch(
                            createAction('app/updateState')({
                                selectEnterprise: newData
                            })
                        );
                        // this.props.selectEnterprise.PointList = item;
                        if (this.pointS && typeof this.pointS != 'undefined') {
                            this.pointS.setSelectItem(item[0]);
                            this.forceUpdate();
                        }
                    }
                }
            })
        );
    };

    getTaskTypeOption = () => {
        return {
            disImage: true,
            codeKey: 'ID',
            nameKey: 'TypeName',
            placeHolder: '请选择任务类型',
            defaultCode: '-1',
            dataArr: SentencedToEmpty(this.props.taskType, ['data', 'Datas'], []),
            onSelectListener: item => {
                if (item.ID == 3 || item.ID == 9) {
                    // 校准
                    this.setState({ claimTaskCheck: false });
                    this.props.dispatch(createAction('claimTaskModels/getCalibrationTaskStatus')({
                        params: { DGIMN: this.state.selectPointItem.DGIMN }
                        , success: (result) => {
                            // 1、已领取未完成 2、未领取 0、可以创建
                            this.setState({ claimTaskCheck: true, claimTaskState: result }, () => {
                                if (result.status == 1) {
                                    this.setState({
                                        calibrationTaskAlreadyClaimedOptions: {
                                            hiddenTitle: true,
                                            innersHeight: 120,
                                            messText: `运维工程师“${result.userName}”名下存在待执行/执行中的校准工单，完成后方可申领新的校准工单。`,
                                            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                            buttons: [
                                                {
                                                    txt: '确定',
                                                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                                                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                                    onpress: () => { }
                                                }
                                            ]
                                        }
                                    }, () => {
                                        SentencedToEmpty(this, ['refs', 'calibrationTaskAlreadyClaimedUnAlert', 'show'], () => { })();
                                    });
                                } else if (result.status == 2) {
                                    SentencedToEmpty(this, ['refs', 'calibrationTaskUnclaimedUnAlert', 'show'], () => { })();
                                } else if (result.status == 0) {
                                    ShowToast('可以创建校准工单。');
                                } else {
                                    SentencedToEmpty(this, ['refs', 'claimTaskCheckFailureAlert', 'show'], () => { })();
                                }
                            })
                        }, failure: () => {
                            SentencedToEmpty(this, ['refs', 'claimTaskCheckFailureAlert', 'show'], () => { })();
                        }
                    }));
                } else if (item.ID == 1 || item.ID == 7) {
                    // 运维APP上是否允许申请巡检工单1、否2、是
                    const InspectionType = SentencedToEmpty(this.props
                        , ['operationSettingResult', 'data', 'Datas', 'InspectionType'], 1);
                    if (InspectionType == 1) {
                        // 巡检
                        this.setState({
                            calibrationTaskAlreadyClaimedOptions: {
                                hiddenTitle: true,
                                innersHeight: 120,
                                messText: `不允许手工申请巡检工单，系统会自动派发巡检工单`,
                                headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                                buttons: [
                                    {
                                        txt: '确定',
                                        btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                                        txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                        onpress: () => { }
                                    }
                                ]
                            }
                        }, () => {
                            SentencedToEmpty(this, ['refs', 'calibrationTaskAlreadyClaimedUnAlert', 'show'], () => { })();
                        });
                    }
                }
                this.setState({
                    selectTaskItem: [item]
                });
            }
        };
    };

    getPointTypeOption = () => {
        return {
            contentWidth: 166,
            placeHolderStr: '请选择任务类型',
            codeKey: 'ID',
            hideImg: true,
            nameKey: 'TypeName',
            dataArr: SentencedToEmpty(this.props.taskType, ['data', 'Datas'], []),
            callback: ({ selectCode, selectNameStr, selectCodeStr, selectData }) => {
                this.setState({
                    selectTaskItem: selectData
                });
            }
        };
    };

    stopLoading = () => {
        this.setState({
            uploading: false
        });
    }

    commit = () => {
        if (this.props.selectEnterprise.EntName == '请选择') {
            this.stopLoading();
            ShowToast('请选择企业或监测站');
            return;
        }
        if (this.state.selectPointItem.PointName == '请选择监测点位') {
            this.stopLoading();
            ShowToast('请选择监测点位');
            return;
        }
        if (this.state.selectTaskItem.length == 0) {
            this.stopLoading();
            ShowToast('请选择任务类型');
            return;
        }
        const user = getToken();
        if (!SentencedToEmpty(user, ['IsShowTask'], false) && SentencedToEmpty(this.state, ['selectPointItem', 'OperationUserName'], '') == '') {
            SentencedToEmpty(this, ['refs', 'withoutOperationUserNameAlert', 'show'], () => { })();
            this.stopLoading();
            return;
        }
        if (!this.state.selectPointItem.OperationStatus) {
            SentencedToEmpty(this, ['refs', 'outContractAlert', 'show'], () => { })();
            this.stopLoading();
            return;
        }
        if (this.state.selectTaskItem[0].ID == 3 || this.state.selectTaskItem[0].ID == 9) {
            if (this.state.claimTaskCheck) {
                // 1、已领取未完成 
                if (this.state.claimTaskState.status == 1) {
                    // calibrationTaskAlreadyClaimedUnAlert
                    this.setState({
                        calibrationTaskAlreadyClaimedOptions: {
                            hiddenTitle: true,
                            innersHeight: 120,
                            messText: `运维工程师“${this.state.claimTaskState.userName}”名下存在待执行/执行中的校准工单，完成后方可申领新的校准工单。`,
                            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                            buttons: [
                                {
                                    txt: '确定',
                                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                    onpress: () => { }
                                }
                            ]
                        }
                    }, () => {
                        SentencedToEmpty(this, ['refs', 'calibrationTaskAlreadyClaimedUnAlert', 'show'], () => { })();
                    });
                    this.stopLoading();
                    return;
                } else if (this.state.claimTaskState.status == 2) {
                    // 2、未领取 
                    SentencedToEmpty(this, ['refs', 'calibrationTaskUnclaimedUnAlert', 'show'], () => { })();
                    this.stopLoading();
                    return;
                } else if (this.state.claimTaskState.status == 0) {
                    // 0、可以创建
                    // ShowToast('可以创建校准工单。');
                } else {
                    SentencedToEmpty(this, ['refs', 'claimTaskCheckFailureAlert', 'show'], () => { })();
                    this.stopLoading();
                    return;
                }
            } else {
                SentencedToEmpty(this, ['refs', 'claimTaskCheckFailureAlert', 'show'], () => { })();
                this.stopLoading();
                return;
            }
        } else if (this.state.selectTaskItem[0].ID == 1 || this.state.selectTaskItem[0].ID == 7) {
            // 运维APP上是否允许申请巡检工单1、否2、是
            const InspectionType = SentencedToEmpty(this.props
                , ['operationSettingResult', 'data', 'Datas', 'InspectionType'], 1);
            // InspectionType 2的情况需要可以创建巡检任务
            if (InspectionType == 1) {
                // 巡检
                this.setState({
                    calibrationTaskAlreadyClaimedOptions: {
                        hiddenTitle: true,
                        innersHeight: 120,
                        messText: `不允许手工申请巡检工单，系统会自动派发巡检工单`,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '确定',
                                btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => { }
                            }
                        ]
                    }
                }, () => {
                    SentencedToEmpty(this, ['refs', 'calibrationTaskAlreadyClaimedUnAlert', 'show'], () => { })();
                });
                this.stopLoading();
                return;
            }

        }
        /**
        * OperationName    运维公司名称
        * OperationStatus  是否在运维周期内
        * OperationType    1SDL运维，2其他公司
        */
        let taskStr = '';
        this.state.selectTaskItem.map(item => {
            taskStr = item.ID + ',' + taskStr;
        });
        // 去掉创建前的提示信息
        this.props.dispatch(
            createAction('taskModel/commitTaskApply')({
                params: {
                    operationEntCode: this.state.selectPointItem.OperationCompanyID,
                    ImplementDate: this.state.selectTime,
                    taskFrom: '1',
                    remark: this.state.remark,
                    DGIMNs: this.state.selectPointItem.DGIMN,
                    RecordType: taskStr,
                    // createUserId:getToken().UserId,
                    operationsUserId: getToken().UserId,
                },
                backViewFun: () => {
                    this.stopLoading();
                    // 刷新任务企业列表
                    this.props.dispatch(createAction('taskModel/updateState')({ UnhandleTaskTypeListResult: { status: -1 } }))
                    this.props.dispatch(createAction('taskModel/getUnhandleTaskTypeList')({}))
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    }

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['pointListByEntResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'点位数据加载中'} />;
        } else {
            return null;
        }
    };

    onFreshData = () => {
        console.log('onFreshData');
        this.props.dispatch(createAction('app/getOperationSetting')({
        }));
    }

    getPageStatus = () => {
        const operationSettingStatus = SentencedToEmpty(this.props, ['operationSettingResult', 'status'], -1);
        return operationSettingStatus;
    }

    render() {
        const outContractOptions = {
            hiddenTitle: true,
            innersHeight: 150,
            messText: '该监测点未查询到运维信息，可能原因如下：\n1.未设置运维信息；\n2.运维服务已到期；\n请联系管理员进行设置。',
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => { }
                }
            ]
        }
        const alreadyExistOptions = {
            hiddenTitle: true,
            innersHeight: 150,
            messText: '请到“工作台 - 领取工单”页面领取校准工单。',
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => { }
                }
            ]
        }

        const withoutOperationUserNameOptions = {
            hiddenTitle: true,
            innersHeight: 150,
            messText: '点位没有设置运维负责人，设置后才能创建任务',
            headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
            buttons: [
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                    txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                    onpress: () => { }
                }
            ]
        }

        // console.log('render');
        // console.log('PointList = ', SentencedToEmpty(this.props, ['selectEnterprise', 'PointList'], []));
        // console.log('EntName = ', this.props.selectEnterprise.EntName);
        return (
            <StatusPage
                // backRef={SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'needRefresh'], 'true') == 'true'}
                status={this.getPageStatus()}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onFreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onFreshData();
                }}
            >
                <View style={styles.container}>
                    {this.props.applyData.status == -1 ? <SimpleLoadingComponent message={'正在提交申请'} /> : null}

                    <ScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                        <Touchable
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
                            <View style={styles.rowInner}>
                                <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 企业/监测站'}</Text>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        maxWidth: SCREEN_WIDTH - 150,
                                        fontSize: 14,
                                        color: '#666',
                                        marginLeft: 24
                                    }}
                                >
                                    {this.props.selectEnterprise.EntName}
                                </Text>
                            </View>

                            <Image style={{ width: 10, height: 10, right: 20 }} source={require('../../../images/ic_arrows_right.png')} />
                        </Touchable>

                        <View style={styles.line} />
                        {
                            SentencedToEmpty(this.props, ['selectEnterprise', 'PointList'], []).length == 0
                                || this.props.selectEnterprise.EntName == '请选择' ?
                                <TouchableOpacity
                                    onPress={() => {
                                        if (this.props.selectEnterprise.EntName == '请选择') {
                                            ShowToast('您还没有选择企业！');
                                        } else if (SentencedToEmpty(this.props, ['selectEnterprise', 'PointList'], []).length == 0) {
                                            ShowToast('您选择的企业下没有可用的监测点！');
                                        }
                                    }}
                                >
                                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                        <View style={styles.rowInner}>
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 监测点位'}</Text>
                                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '')}</Text>
                                        </View>

                                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                                    </View>
                                </TouchableOpacity>
                                : SentencedToEmpty(this.props, ['selectEnterprise', 'PointList'], []).length > 3 || true
                                    ? <TouchableOpacity
                                        onPress={() => {
                                            this.props.dispatch(NavigationActions.navigate({
                                                routeName: 'SearchListWithoutLoad',
                                                params: {
                                                    title: '监测点选择',
                                                    getDataFun: () => {
                                                        return SentencedToEmpty(this.props, ['selectEnterprise', 'PointList'], []);
                                                    },
                                                    searchPlaceHolder: '监测点名称',
                                                    showTextNames: ['PointName'],
                                                    // callback: pointSelectedCallback
                                                    callback: (item) => {
                                                        console.log('123');
                                                        this.handlePointSelected(item)
                                                    }
                                                    // isCreatTask: true,
                                                    // selectType: 'enterprise',
                                                    // callback: this.callback
                                                }
                                            }));
                                        }}
                                    >
                                        <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                            <View style={styles.rowInner}>
                                                <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 监测点位'}</Text>
                                                <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '')}</Text>
                                            </View>

                                            <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                                        </View>
                                    </TouchableOpacity>
                                    : <PickerTouchable
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getPointSelect()}
                                        onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                        style={[styles.row, { justifyContent: 'space-between' }]}
                                    >
                                        <View style={styles.rowInner}>
                                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 监测点位'}</Text>
                                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '')}</Text>
                                        </View>

                                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                                    </PickerTouchable>
                        }
                        {/* <PickerTouchable
                            ref={ref => (this.pointS = ref)}
                            option={this.getPointSelect()}
                            onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                            style={[styles.row, { justifyContent: 'space-between' }]}
                        >
                            <View style={styles.rowInner}>
                                <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 监测点位'}</Text>
                                <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{SentencedToEmpty(this.state, ['selectPointItem', 'PointName'], '')}</Text>
                            </View>

                            <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                        </PickerTouchable> */}
                        {this.props.taskType.status == 200 ? <View style={styles.line} /> : null}
                        {this.props.taskType.status == 200 ? (
                            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                <View style={[styles.rowInner, {}]}>
                                    <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 任务类型'}</Text>
                                    <SimplePicker
                                        ref={ref => {
                                            this.simplePicker = ref;
                                        }}
                                        option={this.getTaskTypeOption()}
                                        style={[{ marginLeft: 14, width: SCREEN_WIDTH - 140 }]}
                                        textStyle={{ textAlign: 'left', flex: 1 }}
                                    />
                                </View>
                                <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                            </View>
                        ) : null}
                        <View style={styles.line} />

                        {/* <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={[styles.row, { justifyContent: 'space-between' }]}>
                            <View style={styles.rowInner}>
                                <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 执行日期'}</Text>
                                <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{this.formatShowTime(this.state.selectTime, 'DayData')}</Text>
                            </View>
                            <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                        </PickerSingleTimeTouchable> */}
                        <View style={styles.line} />
                        <View style={{ minHeight: 100, width: SCREEN_WIDTH, padding: 20, backgroundColor: 'white' }}>
                            <Text style={[{ color: '#333333' }]}>备注</Text>
                            <TextInput
                                placeholder={'请输入备注信息'}
                                style={{ textAlignVertical: 'top', height: 54, width: SCREEN_WIDTH - 40, backgroundColor: 'white' }}
                                multiline={true}
                                onChangeText={text => {
                                    // 动态更新组件内State记录
                                    this.setState({
                                        remark: text
                                    });
                                }}
                            />
                        </View>

                        <View style={styles.line} />
                    </ScrollView>
                    {
                        this.state.uploading ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#5688f6',
                                    marginBottom: 10,
                                    height: 50,
                                    width: SCREEN_WIDTH - 20
                                }}
                            >
                                <ActivityIndicator color={'#fff'} size="small" />
                                <Text style={{ color: 'white' }}>确定</Text>
                            </View>
                            : <Touchable
                                onPress={() => {
                                    this.setState({
                                        uploading: true
                                    }, () => {
                                        this.commit();
                                    });

                                }}
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#5688f6',
                                    marginBottom: 10,
                                    height: 50,
                                    width: SCREEN_WIDTH - 20
                                }}
                            >
                                <Text style={{ color: 'white' }}>确定</Text>
                            </Touchable>
                    }
                </View>
                {/* 未设置运维负责人 */}
                <OperationAlertDialog options={withoutOperationUserNameOptions} ref="withoutOperationUserNameAlert" />
                {/* 超出运维周期 */}
                <OperationAlertDialog options={outContractOptions} ref="outContractAlert" />
                {/* 校准任务已存在 */}
                <OperationAlertDialog options={alreadyExistOptions} ref="alreadyExistAlert" />
                {/* 创建任务最后确认 */}
                <OperationAlertDialog options={this.state.commitTaskOptions} ref="commitTaskAlert" />
                {/* 校准任务状态查询失败 */}
                <OperationAlertDialog options={this.claimTaskCheckFailureOptions} ref="claimTaskCheckFailureAlert" />
                {/* 存在未领取的校准任务 */}
                <OperationAlertDialog options={this.calibrationTaskUnclaimedOptions} ref="calibrationTaskUnclaimedUnAlert" />
                {/* 校准任务已经被领取 */}
                <OperationAlertDialog options={this.state.calibrationTaskAlreadyClaimedOptions} ref="calibrationTaskAlreadyClaimedUnAlert" />
                {
                    this.renderLoadingComponent()
                }
            </StatusPage>
        );
    }
    // 校准任务未领取 提示信息配置
    calibrationTaskUnclaimedOptions = {
        hiddenTitle: true,
        innersHeight: 100,
        messText: '请到“工作台 - 领取工单”页面领取校准工单。',
        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
        buttons: [
            {
                txt: '确定',
                btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                onpress: () => { }
            }
        ]
    };
    // 校准信息测试失败 提示信息配置
    claimTaskCheckFailureOptions = {
        hiddenTitle: true,
        innersHeight: 100,
        messText: '校准任务状态创建失败，请重新选择。',
        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
        buttons: [
            {
                txt: '确定',
                btnStyle: { backgroundColor: '#fff', borderColor: 'white' },
                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                onpress: () => { }
            }
        ]
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
