/*
 * @Description: 质保内服务填报 
 * @LastEditors: hxf
 * @Date: 2024-03-22 17:03:40
 * @LastEditTime: 2024-11-25 14:14:13
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/ServiceUnderWarranty.js
 */
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { CloseToast, SentencedToEmpty, SentencedToEmptyTimeString, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import Form2Switch from '../../../operationContainers/taskViews/taskExecution/components/Form2Switch';
import FormDatePicker from '../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import { DeclareModule, MoreSelectTouchable, PickerTouchable, StatusPage } from '../../../components';
import moment from 'moment';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';


@connect(({ CTServiceStatisticsModel, CTModel }) => ({
    ProjectID: CTModel.ProjectID,
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult,
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    warrantyServiceRecordResult: CTServiceStatisticsModel.warrantyServiceRecordResult,
    serviceUnderWarrantySubmitParams: CTServiceStatisticsModel.serviceUnderWarrantySubmitParams,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult
}))
export default class ServiceUnderWarranty extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '质保内服务填报',
            // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
            headerRight: (
                <DeclareModule
                    contentRender={() => {
                        return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                    }}
                    options={{
                        headTitle: '说明',
                        innersHeight: 180,
                        // messText: `文字未提供`,
                        messText: ` `,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '知道了',
                                btnStyle: { backgroundColor: '#fff' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => { }
                            }
                        ]
                    }}
                />
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            signInType: 0,
            entList: [], // 企业列表
            // pointList:[],// 监测点列表
            // systemModleList:[], // 设备型号列表
        }

        this.props.navigation.setOptions({
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 180,
                    // messText: `文字未提供`,
                    messText: ` `,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }}
            />
        });
    }

    componentDidMount() {
        this.onRefreshWithLoading();
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    checkTime = (params) => {
        const workDuration = SentencedToEmpty(params, ['workDuration'], '');
        const ProjectCount = SentencedToEmpty(params, ['ProjectCount'], '');
        const ServiceCount = SentencedToEmpty(params, ['ServiceCount'], '');
        if (workDuration != ''
            && ProjectCount != ''
            && ServiceCount != '') {
            if (workDuration <= 0) {
                ShowToast('开始和结束时间异常');
                return false;
            }
            if (workDuration < ServiceCount) {
                ShowToast('服务时长必须处理开始和结束时间之间');
            }
            if (ServiceCount - ProjectCount < 0) {
                ShowToast('服务时长、合同时长出现异常');
                return false;
            }
        }
    }

    getServiceStartDateOption = () => {
        return {
            defaultTime: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'BeginTime']
                , moment().format('YYYY-MM-DD')),
            // defaultTime: moment().format('YYYY-MM-DD'),
            type: 'day',
            onSureClickListener: time => {
                let newData = { ...this.props.serviceUnderWarrantySubmitParams };
                newData.BeginTime = moment(time).format('YYYY-MM-DD');
                let bmoment = moment(newData.BeginTime);
                let emoment = moment(newData.EndTime);
                let diffDay = emoment.diff(bmoment, 'days');
                if (diffDay >= 0) {
                    diffDay = diffDay + 1;
                }
                if (diffDay < 0) {
                    ShowToast('服务开始时间应该早于服务结束时间');
                    newData.workDuration = 0;
                } else {
                    newData.workDuration = diffDay * 24;
                }
                this.checkTime(newData);
                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                    serviceUnderWarrantySubmitParams: newData
                }));
            }
        };
    };

    getServiceEndDateOption = () => {
        return {
            defaultTime: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'EndTime']
                , moment().format('YYYY-MM-DD')),
            // defaultTime: moment().format('YYYY-MM-DD'),
            type: 'day',
            onSureClickListener: time => {
                let newData = { ...this.props.serviceUnderWarrantySubmitParams };
                newData.EndTime = moment(time).format('YYYY-MM-DD');
                let bmoment = moment(newData.BeginTime);
                let emoment = moment(newData.EndTime);
                let diffDay = emoment.diff(bmoment, 'days');
                if (diffDay >= 0) {
                    diffDay = diffDay + 1;
                }
                if (diffDay < 0) {
                    ShowToast('服务结束时间应该晚于服务开始时间');
                    newData.workDuration = 0;
                } else {
                    newData.workDuration = diffDay * 24;
                }
                this.checkTime(newData);
                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                    serviceUnderWarrantySubmitParams: newData
                }));
            }
        };
    };

    getPageStatus = () => {
        const recordQuestionStatus = SentencedToEmpty(this.props
            , ['recordQuestionResult', 'status'], 1000);
        const warrantyServiceRecordStatus = SentencedToEmpty(this.props
            , ['warrantyServiceRecordResult', 'status'], 1000);
        const projectEntPointSysModelStatus = SentencedToEmpty(this.props
            , ['projectEntPointSysModelResult', 'status'], 1000);
        if (recordQuestionStatus == 200
            && warrantyServiceRecordStatus == 200
            && projectEntPointSysModelStatus == 200) {
            return 200;
        } else if (recordQuestionStatus == -1
            || warrantyServiceRecordStatus == -1
            || projectEntPointSysModelStatus == -1) {
            return -1;
        } else {
            return 1000;
        }

    }

    onRefreshWithLoading = () => {
        this.props.dispatch(
            createAction('CTModel/getProjectEntPointSysModel')({
                params: {
                    projectId: SentencedToEmpty(this.props, ['ProjectID'], '')
                },
                callback: result => {
                    this.setState(
                        {
                            entList: SentencedToEmpty(result, ['data', 'Datas'], [])
                        },
                        () => {
                            this.props.dispatch(
                                createAction('CTModel/updateState')({
                                    projectEntPointSysModelResult: result
                                })
                            );
                        }
                    );
                    // }
                    return true;
                }
            })
        );
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            serviceUnderWarrantyLoadDataStatus: -1,
            recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表
            // duplicateServiceRecordResult: { status: -1 }, // 超时派单信息
            // duplicateServiceRecordList: [], // 记录列表
            // duplicateServicHasData: false, // 是否有重复服务表单
        }));
        // 68质保内服务-产品类别  69质保内服务-服务原因
        this.props.dispatch(createAction('CTServiceStatisticsModel/getRecordQuestion')({
            params: { questionType: 68 }
        }));
        this.props.dispatch(createAction('CTServiceStatisticsModel/getWarrantyServiceRecord')({
            params: {}
        }));

        // 如果没有获取到数据则填充空数据
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            serviceUnderWarrantySubmitParams: {
                ID: '',
                RecordId: '', // 成套任务id
                // HasData: false, // 是否有表单 （true 是 false 否）
                HasData: '', // 是否有表单 （true 是 false 否）
                BeginTime: '',// 本次服务开始时间
                EndTime: '', // 本次服务结束时间
                ProjectCount: '', // 合同要求时长
                ServiceCount: '', // 本次服务时长
                productCategoryList: [
                    // {
                    //     Level: '',// 索引
                    //     // Type: '', // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                    //     InfoList: [
                    //         {
                    //             QuestionID: '', //类别ID
                    //             ServiceCount: '', // 服务时长
                    //             SolveStatus: '', // 是否解决（true 是 false 否）
                    //             Remark: '', // 未解决原因
                    //         }
                    //     ], // 二级列表
                    // }
                ], // 一级列表
                serviceReasonsList: [
                    // {
                    //     Level: '',// 索引
                    //     Type: '', // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                    //     InfoList: [
                    //         {
                    //             QuestionID: '', //类别ID
                    //             ServiceCount: '', // 服务时长
                    //             SolveStatus: '', // 是否解决（true 是 false 否）
                    //             Remark: '', // 未解决原因
                    //         }
                    //     ], // 二级列表
                    // }
                ], // 一级列表
            }
        }));
    }

    getDateString = (obj, params, defaultStr) => {
        const baseStr = SentencedToEmpty(obj, params, '');
        if (baseStr == '') {
            return defaultStr;
        } else {
            let aMoment = moment(baseStr);
            if (aMoment.isValid()) {
                return aMoment.format('YYYY-MM-DD')
            } else {
                return defaultStr;
            }
        }
    }

    render() {
        const topButtonWidth = SCREEN_WIDTH / 2;
        return (
            <StatusPage
                status={this.getPageStatus()}
                errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefreshWithLoading();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefreshWithLoading();
                }}
            >
                <View style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}>
                    <View style={[{
                        width: SCREEN_WIDTH, height: 44
                        , paddingHorizontal: 20
                        , justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: '#fff'
                    }]}>
                        <Form2Switch
                            editable={this.isEdit()}
                            label='是否有质保内服务'
                            data={[{ name: '是', value: true }, { name: '否', value: false }]}
                            value={SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams', 'HasData'], '')}
                            onChange={(value) => {
                                let params = {
                                    serviceUnderWarrantySubmitParams: {
                                        ...SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams'], {}),
                                        HasData: value
                                    }

                                }
                                // if (!value) {
                                // } else {
                                // }
                                this.props.dispatch(
                                    createAction('CTServiceStatisticsModel/updateState')(params));
                            }}
                        />
                    </View>
                    <ScrollView
                        style={[{
                            width: SCREEN_WIDTH
                        }]}
                    >


                        {SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams', 'HasData']
                            , false) ? <View
                                style={[{
                                    width: SCREEN_WIDTH, backgroundColor: 'white'
                                    , alignItems: 'center', marginTop: 5
                                }]}
                            >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40,
                                }]}
                            >
                                <FormDatePicker
                                    rightIcon={require('../../../images/ic_arrows_right.png')}
                                    rightIconStyle={{ height: 15, width: 15, tintColor: '' }}
                                    editable={this.isEdit()}
                                    required={false}
                                    getPickerOption={this.getServiceStartDateOption}
                                    label={'本次服务开始时间'}
                                    timeString={this.getDateString(this.props
                                        , ['serviceUnderWarrantySubmitParams', 'BeginTime'], '请选择')}
                                />
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40,
                                }]}
                            >
                                <FormDatePicker
                                    rightIcon={require('../../../images/ic_arrows_right.png')}
                                    rightIconStyle={{ height: 15, width: 15, tintColor: '' }}
                                    editable={this.isEdit()}
                                    required={false}
                                    getPickerOption={this.getServiceEndDateOption}
                                    label={'本次服务结束时间'}
                                    timeString={this.getDateString(this.props
                                        , ['serviceUnderWarrantySubmitParams', 'EndTime'], '请选择')}
                                />
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40, height: 44
                                    , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                    , flexDirection: 'row', alignItems: 'center'
                                    , justifyContent: 'space-between'
                                }]}
                            >
                                <Text style={[{
                                    fontSize: 14, color: '#333333'
                                }]}>{`${'质保内服务时长(小时)'}`}</Text>
                                <TextInput
                                    editable={this.isEdit()}
                                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                    style={[{
                                        fontSize: 14, color: '#666666'
                                        , textAlign: 'right'
                                    }]}
                                    placeholder={'服务时长(小时)'}
                                    placeholderTextColor={'#999999'}
                                    onChangeText={text => {
                                        let params = {
                                            serviceUnderWarrantySubmitParams: {
                                                ...SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams'], {}),
                                                ServiceCount: text
                                            }

                                        }
                                        const workDuration = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'workDuration'], '');
                                        if (!(/^\d+(\.\d+)?$/.test(text))) {
                                            // if (/^(0|[1-9]\d*(\.\d+)?)$/.test(text)) {
                                            // !(/^\d+(\.\d+)?$/.
                                            ShowToast('无效的服务时长');
                                        } else if (workDuration != ''
                                            && Number(text) > Number(workDuration)) {
                                            ShowToast('服务时长不能大于服务结束与服务开始之间的时间长度！')
                                        }
                                        // else {
                                        //     params.serviceUnderWarrantySubmitParams
                                        //         .ProjectCount = text;
                                        // }
                                        // const ProjectCount = SentencedToEmpty(this.props
                                        //     , ['serviceUnderWarrantySubmitParams', 'ProjectCount'], '');
                                        // if (ProjectCount != '') {
                                        //     const test = Number(text) - Number(ProjectCount);
                                        //     if (test < 0) {
                                        //         ShowToast('服务时长不能小于合同要求工作时长！')
                                        //     } else {
                                        //         params.serviceUnderWarrantySubmitParams
                                        //             .ServiceHoursUnderWarranty = test;
                                        //     }
                                        // }
                                        // params.serviceUnderWarrantySubmitParams
                                        //     .ServiceHoursUnderWarranty = test;
                                        this.props.dispatch(
                                            createAction('CTServiceStatisticsModel/updateState')(params));

                                    }}
                                >
                                    {SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams', 'ServiceCount'], '')}
                                </TextInput>
                            </View>
                            {/* <View
                                style={[{
                                    width: SCREEN_WIDTH - 40, height: 44
                                    , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                    , flexDirection: 'row', alignItems: 'center'
                                    , justifyContent: 'space-between'
                                }]}
                            >
                                <Text style={[{
                                    fontSize: 14, color: '#333333'
                                }]}>{`${'本次服务时长(小时)'}`}</Text>
                                <TextInput
                                    editable={this.isEdit()}
                                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                    style={[{
                                        fontSize: 14, color: '#666666'
                                        , textAlign: 'right'
                                    }]}
                                    placeholder={'服务时长(小时)'}
                                    onChangeText={text => {
                                        let params = {
                                            serviceUnderWarrantySubmitParams: {
                                                ...SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams'], {}),
                                                ServiceCount: text
                                            }

                                        }
                                        const workDuration = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'workDuration'], '');
                                        if (workDuration != ''
                                            && Number(text) > Number(workDuration)) {
                                            ShowToast('服务时长不能大于服务结束与服务开始之间的时间长度！')
                                        }
                                        const ProjectCount = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'ProjectCount'], '');
                                        if (ProjectCount != '') {
                                            const test = Number(text) - Number(ProjectCount);
                                            if (test < 0) {
                                                ShowToast('服务时长不能小于合同要求工作时长！')
                                            } else {
                                                params.serviceUnderWarrantySubmitParams
                                                    .ServiceHoursUnderWarranty = test;
                                            }
                                        }
                                        this.props.dispatch(
                                            createAction('CTServiceStatisticsModel/updateState')(params));

                                    }}
                                >
                                    {SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams', 'ServiceCount'], '')}
                                </TextInput>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40, height: 44
                                    , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                    , flexDirection: 'row', alignItems: 'center'
                                    , justifyContent: 'space-between'
                                }]}
                            >
                                <Text style={[{
                                    fontSize: 14, color: '#333333'
                                }]}>{`${'合同要求工作时长(小时)'}`}</Text>
                                <TextInput
                                    editable={this.isEdit()}
                                    keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                    style={[{
                                        fontSize: 14, color: '#666666'
                                        , textAlign: 'right'
                                    }]}
                                    placeholder={'服务时长(小时)'}
                                    onChangeText={text => {
                                        let params = {
                                            serviceUnderWarrantySubmitParams: {
                                                ...SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams'], {}),
                                                ProjectCount: text
                                            }
                                        }
                                        const ServiceCount = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'ServiceCount'], '');
                                        if (ServiceCount != '') {
                                            const test = Number(ServiceCount) - Number(text);
                                            if (test < 0) {
                                                ShowToast('服务时长不能小于合同要求工作时长！')
                                            } else {
                                                params.serviceUnderWarrantySubmitParams
                                                    .ServiceHoursUnderWarranty = test;
                                            }
                                        }
                                        this.props.dispatch(
                                            createAction('CTServiceStatisticsModel/updateState')(params));

                                    }}
                                >
                                    {SentencedToEmpty(this.props, ['serviceUnderWarrantySubmitParams', 'ProjectCount'], '')}
                                </TextInput>
                            </View> */}
                        </View> : null}
                        {SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams', 'HasData']
                            , false) ? <View
                                style={[{
                                    width: SCREEN_WIDTH, flex: 1
                                    , marginTop: 5
                                }]}
                            >
                            <View style={[{
                                flexDirection: 'row', height: 44
                                , width: SCREEN_WIDTH, alignItems: 'center'
                                , justifyContent: 'space-between'
                                , backgroundColor: 'white', marginBottom: 5
                            }]}>
                                <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                        onPress={() => {
                                            this.setState({ signInType: 0 }
                                                , () => {
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                        recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表
                                                    }));
                                                    // 68质保内服务-产品类别  69质保内服务-服务原因
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/getRecordQuestion')({
                                                        params: { questionType: 68 }
                                                    }));
                                                    //         this.props.dispatch(createAction('signInModel/updateState')({
                                                    //             workTypeSelectedItem: null,
                                                    //             signInEntItem: null
                                                    //         }));
                                                    //         this.getSignInType(0);
                                                });
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: topButtonWidth, height: 44
                                                , alignItems: 'center'
                                            }]}
                                        >
                                            <View style={[{
                                                width: topButtonWidth, height: 42
                                                , alignItems: 'center', justifyContent: 'center'
                                            }]}>
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode={'head'}
                                                    style={[{
                                                        fontSize: 15
                                                        , color: this.state.signInType == 0 ? '#4AA0FF' : '#666666'
                                                    }]}>{'质保内服务-产品类别'}</Text>
                                            </View>
                                            <View style={[{
                                                width: SCREEN_WIDTH / 2 - 40, height: 2
                                                , backgroundColor: this.state.signInType == 0 ? '#4AA0FF' : 'white'
                                            }]}>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ flex: 1, height: 44, flexDirection: 'row' }]}>
                                    <TouchableOpacity style={[{ flex: 1, height: 44 }]}
                                        onPress={() => {
                                            this.setState({ signInType: 1 }
                                                , () => {
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                        recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表
                                                    }));
                                                    // 68质保内服务-产品类别  69质保内服务-服务原因
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/getRecordQuestion')({
                                                        params: { questionType: 69 }
                                                    }));
                                                    //         this.props.dispatch(createAction('signInModel/updateState')({
                                                    //             workTypeSelectedItem: null,
                                                    //             signInEntItem: null,
                                                    //             remark: '',
                                                    //         }));
                                                    //         this.getSignInType(1);
                                                });
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: topButtonWidth, height: 44
                                                , alignItems: 'center'
                                            }]}
                                        >
                                            <View style={[{
                                                width: topButtonWidth, height: 42
                                                , alignItems: 'center', justifyContent: 'center'
                                            }]}>
                                                <Text
                                                    numberOfLines={1}
                                                    ellipsizeMode={'head'}
                                                    style={[{
                                                        fontSize: 15
                                                        , color: this.state.signInType == 1 ? '#4AA0FF' : '#666666'
                                                    }]}>{'质保内服务-服务原因'}</Text>
                                            </View>
                                            <View style={[{
                                                width: SCREEN_WIDTH / 2 - 40, height: 2
                                                , backgroundColor: this.state.signInType == 1 ? '#4AA0FF' : 'white'
                                            }]}>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* 切换tab页 */}
                            {
                                this.state.signInType == 0
                                    ? <ProductCategory
                                        entList={this.state.entList}
                                    />
                                    : <ServiceReason
                                        entList={this.state.entList}
                                    />
                            }
                        </View> : null}
                    </ScrollView>
                    {
                        !SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams', 'HasData']
                            , false)
                            ? <View
                                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
                            /> : null
                    }
                    {
                        this.isEdit() ? <View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    ShowLoadingToast('正在提交');
                                    // 提交前测试
                                    const HasData = this.props.serviceUnderWarrantySubmitParams.HasData;
                                    if (typeof HasData == 'boolean' && !HasData) {
                                        // 不存在 质保内服务表单
                                        this.props.dispatch(
                                            createAction('CTServiceStatisticsModel/addOrUpdWarrantyServiceRecord')({
                                                params: {}
                                            }));
                                    } else if (HasData == '') {
                                        CloseToast();
                                        ShowToast('是否有质保内服务表单为必选项！');
                                        return;
                                    } else {
                                        const BeginTime = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'BeginTime'], '');
                                        if (BeginTime == '') {
                                            CloseToast();
                                            ShowToast('本次服务开始时间不能为空！');
                                            return;
                                        }
                                        const EndTime = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'EndTime'], '');
                                        if (EndTime == '') {
                                            CloseToast();
                                            ShowToast('本次服务结束时间不能为空！');
                                            return;
                                        }
                                        const ServiceCount = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'ServiceCount'], '');
                                        if (ServiceCount == '') {
                                            CloseToast();
                                            ShowToast('本次服务时长不能为空！');
                                            return;
                                        }
                                        if (ServiceCount > this.props.serviceUnderWarrantySubmitParams.workDuration) {
                                            CloseToast();
                                            ShowToast('本次服务时长不能大于服务结束与服务开始的差值！');
                                            return;
                                        }
                                        // const ProjectCount = this.props.serviceUnderWarrantySubmitParams.ProjectCount;
                                        // console.log('ProjectCount = ', ProjectCount);
                                        // if ((typeof ProjectCount == 'string' && ProjectCount == '')
                                        //     || (typeof ProjectCount == 'number' && ProjectCount < 0)) {
                                        //     CloseToast();
                                        //     ShowToast('合同要求工作时长错误！');
                                        //     return;
                                        // }
                                        // const targetServiceCount = ServiceCount - ProjectCount; // 预计质保内服务时长
                                        const targetServiceCount = ServiceCount; // 预计质保内服务时长
                                        let hasError = false
                                            , errorMsg = ''
                                            , InfoList = []
                                            , checkInfoList = []
                                            , _PointId = ''
                                            , _QuestionID = ''
                                            , checkPointId = ''
                                            , checkQuestionID = ''
                                            , iServiceCount = '' // 服务时长
                                            , SolveStatus = ''// 是否解决（true 是 false 否）;
                                            , Remark = ''
                                            , productTimeCount = 0
                                            , serviceTimeCount = 0;
                                        const productCategoryList = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'productCategoryList'], []);
                                        productCategoryList.map((item, index) => {
                                            InfoList = SentencedToEmpty(item, ['InfoList'], []);
                                            if (!hasError && InfoList.length <= 0) {
                                                hasError = true;
                                                errorMsg = `产品类别第${index + 1}次记录中缺少产品信息`;
                                            }
                                            if (!hasError) {
                                                // 重写校验逻辑
                                                iServiceCount = SentencedToEmpty(InfoList, [0, 'ServiceCount'], ''); // 服务时长
                                                SolveStatus = SentencedToEmpty(InfoList, [0, 'SolveStatus'], ''); // 是否解决（true 是 false 否）
                                                if ((typeof iServiceCount == 'string' && iServiceCount == '')
                                                    || (typeof iServiceCount == 'number' && iServiceCount <= 0)) {
                                                    hasError = true;
                                                    errorMsg = `产品类别条目${index + 1}记录的服务时长错误`;
                                                    return;
                                                }
                                                productTimeCount = productTimeCount + Number(iServiceCount);
                                                if (typeof SolveStatus == 'string' && SolveStatus == 'unselected') {
                                                    hasError = true;
                                                    errorMsg = `产品类别条目${index + 1}记录的是否解决未选中`;
                                                    return;
                                                }
                                                if (SolveStatus == false || SolveStatus == 'false') {
                                                    Remark = SentencedToEmpty(InfoList, [0, 'Remark'], ''); // 未解决原因
                                                    if (Remark == '') {
                                                        hasError = true;
                                                        errorMsg = `产品类别条目${index + 1}记录的未解决原因为空`;
                                                        return;
                                                    }
                                                } else if (SolveStatus == false || SolveStatus == 'false') {
                                                    Remark = '';
                                                }
                                                _PointId = SentencedToEmpty(InfoList, [0, 'PointId'], '');
                                                _QuestionID = SentencedToEmpty(InfoList, [0, 'QuestionID'], '');
                                                if (_PointId == '') {
                                                    hasError = true;
                                                    errorMsg = `产品类别条目${index + 1}记录的监测点不能为空`;
                                                    return;
                                                }
                                                if (_QuestionID == '') {
                                                    hasError = true;
                                                    errorMsg = `产品类别条目${index + 1}记录的设备型号不能为空`;
                                                    return;
                                                }
                                                productCategoryList.map((checkItem, checkIndex) => {
                                                    if (!hasError) {
                                                        checkInfoList = SentencedToEmpty(checkItem, ['InfoList'], []);
                                                        checkPointId = SentencedToEmpty(checkInfoList, [0, 'PointId'], '');
                                                        checkQuestionID = SentencedToEmpty(checkInfoList, [0, 'QuestionID'], '');
                                                        if (index != checkIndex
                                                            && _PointId == checkPointId
                                                            && _QuestionID == checkQuestionID
                                                        ) {
                                                            hasError = true;
                                                            errorMsg = `产品类别条目${index + 1}和条目${checkIndex + 1}监测点与设备型号重复`;
                                                            return;
                                                        }
                                                    }
                                                })
                                                // InfoList.map((innerItem, innerIndex) => {
                                                //     if (!hasError) {
                                                //         iServiceCount = SentencedToEmpty(innerItem, ['ServiceCount'], ''); // 服务时长
                                                //         SolveStatus = SentencedToEmpty(innerItem, ['SolveStatus'], ''); // 是否解决（true 是 false 否）
                                                //         if ((typeof iServiceCount == 'string' && iServiceCount == '')
                                                //             || (typeof iServiceCount == 'number' && iServiceCount <= 0)) {
                                                //             hasError = true;
                                                //             errorMsg = `产品类别第${index + 1}次记录中第${innerIndex + 1}个设备的服务时长错误`;
                                                //             return;
                                                //         }
                                                //         productTimeCount = productTimeCount + Number(iServiceCount);
                                                //         if (typeof SolveStatus == 'string' && SolveStatus == 'unselected') {
                                                //             hasError = true;
                                                //             errorMsg = `产品类别第${index + 1}次记录中第${innerIndex + 1}个设备的是否解决未选中`;
                                                //             return;
                                                //         }
                                                //         if (SolveStatus == false || SolveStatus == 'false') {
                                                //             Remark = SentencedToEmpty(innerItem, ['Remark'], ''); // 未解决原因
                                                //             if (Remark == '') {
                                                //                 hasError = true;
                                                //                 errorMsg = `产品类别第${index + 1}次记录中第${innerIndex + 1}个设备的未解决原因为空`;
                                                //                 return;
                                                //             }
                                                //         }
                                                //     }
                                                // });
                                            }
                                        });
                                        if (!hasError && targetServiceCount != productTimeCount) {
                                            hasError = true;
                                            errorMsg = `产品类别实际服务时长不等于本次质保内服务填报总时长`;
                                        }
                                        if (hasError) {
                                            CloseToast();
                                            ShowToast(errorMsg);
                                            return;
                                        }
                                        const serviceReasonsList = SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'], []);
                                        serviceReasonsList.map((item, index) => {
                                            InfoList = SentencedToEmpty(item, ['InfoList'], []);
                                            // if (!hasError && InfoList.length <= 0) {
                                            //     hasError = true;
                                            //     errorMsg = `服务原因第${index + 1}次记录中缺少服务原因`;
                                            // }
                                            // if (!hasError) {
                                            //     InfoList.map((innerItem, innerIndex) => {
                                            //         if (!hasError) {
                                            //             iServiceCount = SentencedToEmpty(innerItem, ['ServiceCount'], ''); // 服务时长
                                            //             if ((typeof iServiceCount == 'string' && iServiceCount == '')
                                            //                 || (typeof iServiceCount == 'number' && iServiceCount <= 0)) {
                                            //                 hasError = true;
                                            //                 errorMsg = `服务原因第${index + 1}次记录中第${innerIndex + 1}个服务时长错误`;
                                            //             }
                                            //             serviceTimeCount = serviceTimeCount + Number(iServiceCount);
                                            //         }
                                            //     });
                                            // }
                                            if (!hasError) {
                                                _PointId = SentencedToEmpty(InfoList, [0, 'PointId'], '');
                                                _QuestionID = SentencedToEmpty(InfoList, [0, 'QuestionID'], '');
                                                if (_PointId == '') {
                                                    hasError = true;
                                                    errorMsg = `服务原因条目${index + 1}记录的监测点不能为空`;
                                                    return;
                                                }
                                                if (_QuestionID == '') {
                                                    hasError = true;
                                                    errorMsg = `服务原因条目${index + 1}记录的服务原因不能为空`;
                                                    return;
                                                }

                                                iServiceCount = SentencedToEmpty(InfoList, [0, 'ServiceCount'], ''); // 服务时长
                                                if (iServiceCount == '') {
                                                    hasError = true;
                                                    errorMsg = `服务原因条目${index + 1}记录的服务时长不能为空`;
                                                    return;
                                                } else {
                                                    serviceTimeCount = serviceTimeCount + Number(iServiceCount);
                                                }

                                                serviceReasonsList.map((checkItem, checkIndex) => {
                                                    if (!hasError) {
                                                        checkInfoList = SentencedToEmpty(checkItem, ['InfoList'], []);
                                                        checkPointId = SentencedToEmpty(checkInfoList, [0, 'PointId'], '');
                                                        checkQuestionID = SentencedToEmpty(checkInfoList, [0, 'QuestionID'], '');
                                                        if (index != checkIndex
                                                            && _PointId == checkPointId
                                                            && _QuestionID == checkQuestionID
                                                        ) {
                                                            hasError = true;
                                                            errorMsg = `服务原因条目${index + 1}和条目${checkIndex + 1}监测点与服务原因重复`;
                                                            return;
                                                        }
                                                    }
                                                })
                                            }

                                        });
                                        if (!hasError && targetServiceCount != serviceTimeCount) {
                                            hasError = true;
                                            errorMsg = `服务原因实际服务时长不等于本次质保内服务填报总时长`;
                                        }
                                        if (hasError) {
                                            CloseToast();
                                            ShowToast(errorMsg);
                                            return;
                                        }
                                    }

                                    this.props.dispatch(
                                        createAction('CTServiceStatisticsModel/addOrUpdWarrantyServiceRecord')({
                                            params: {}
                                        }));
                                }}
                            >
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 20, height: 44
                                        , borderRadius: 2, backgroundColor: '#4DA9FF'
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'提交'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null
                    }
                </View >
            </StatusPage >)
    }


}

@connect(({ CTServiceStatisticsModel, CTModel }) => ({
    recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult,
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    serviceUnderWarrantySubmitParams: CTServiceStatisticsModel.serviceUnderWarrantySubmitParams,
    serviceUnderWarrantyLoadDataStatus: CTServiceStatisticsModel.serviceUnderWarrantyLoadDataStatus
}))
class ProductCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entList: props.entList
        }
    }

    componentDidMount() {
        const productCategoryList = SentencedToEmpty(this.props
            , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
            ], [])
        // pointList
        // systemModleList
        const newProductCategoryList = [].concat(productCategoryList);
        let tempItem, tempPointList = [];
        newProductCategoryList.map((item, index) => {
            tempItem = SentencedToEmpty(item, ['InfoList', 0], {});
            this.props.entList.map((entItem, entIndex) => {
                if (tempItem.EntId == entItem.EntId) {
                    tempItem.pointList = entItem.PointList;
                    // tempPointList = entItem.PointList;
                    entItem.PointList.map((pointItem, pointIndex) => {
                        if (tempItem.PointId == pointItem.PointId) {
                            tempItem.systemModleList = pointItem.systemModleList;
                        }
                    });
                }
            });
        });
        let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
        newServiceUnderWarrantySubmitParams.productCategoryList = newProductCategoryList;
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams,
            serviceUnderWarrantyLoadDataStatus: 200
        }));
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    getProductCategoryOption = (index) => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['recordQuestionResult', 'data', 'Datas'], []);

        const duplicateServiceRecordList = SentencedToEmpty(this.props
            , ['serviceUnderWarrantySubmitParams'
                , 'productCategoryList', index, 'InfoList'], []);
        duplicateServiceRecordList
            .map((item, index) => {
                selectCodes.push(item.QuestionID)
            });
        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            // placeHolderStr: '污染物',
            codeKey: 'ChildID',
            nameKey: 'Name',
            // maxNum: 2,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                let newInfoList = [];
                let oldInfoList = [].concat(SentencedToEmpty(this.props
                    , ['serviceUnderWarrantySubmitParams'
                        , 'productCategoryList', index, 'InfoList'], []));
                selectData.map((pickerItem, index) => {

                    let findIndex = oldInfoList.findIndex(item => {
                        return item.QuestionID == pickerItem.ChildID;
                    })
                    if (findIndex != -1) {
                        newInfoList.push(oldInfoList[findIndex]);
                    } else {
                        newInfoList.push({
                            QuestionID: pickerItem.ChildID, //类别ID
                            QuestionName: pickerItem.Name, //类别名称
                            ServiceCount: '', // 服务时长
                            SolveStatus: 'unselected', // 是否解决（true 是 false 否）
                            Remark: '', // 未解决原因
                        });
                    }
                });
                newServiceUnderWarrantySubmitParams.productCategoryList[index].InfoList = newInfoList;
                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                    serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                }));
                // selectData.map((item, index) => {
                //     item.QuestionID = item.ChildID;
                //     item.QuestionName = item.Name;
                // });
                // let findIndex = -1;
                // let selectedIndexList = [];
                // let deleteIndexList = [];
                // SentencedToEmpty(this.props
                //     , ['duplicateServiceRecordList', index, 'InfoList'], [])
                //     .map((item, index) => {
                //         if (SentencedToEmpty(item, ['ChildID'], '') != '') {
                //             findIndex = selectCode.findIndex(codeItem => {
                //                 if (codeItem == item.ChildID) {
                //                     return true;
                //                 }
                //             });
                //             if (findIndex == -1) {
                //                 deleteIndexList.push({ findIndex, dataIndex: index, recordId: item.ChildID, recordName: item.Name });
                //             } else {
                //                 selectedIndexList.push({ findIndex, dataIndex: index });
                //             }
                //         }
                //     });
                // selectedIndexList.map(selectedDateItem => {
                //     console.log(selectData[selectedDateItem.findIndex]);
                //     selectData[selectedDateItem.findIndex] = {
                //         ...selectData[selectedDateItem.findIndex],
                //         ...this.props.duplicateServiceRecordList[index].InfoList[selectedDateItem.dataIndex]
                //     };
                // });
                // console.log('deleteIndexList = ', deleteIndexList)
                // console.log('selectData = ', selectData)
                // let newDuplicateServiceRecordList = [].concat(this.props.duplicateServiceRecordList);
                // if (newDuplicateServiceRecordList.length > index) {
                //     newDuplicateServiceRecordList[index].InfoList = selectData;
                // }
                // console.log('newDuplicateServiceRecordList = ', newDuplicateServiceRecordList);
                // if (deleteIndexList.length > 0) {
                //     this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                //         duplicateServiceRecordList: newDuplicateServiceRecordList
                //     }));
                // } else {
                //     this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                //         // RecordList: selectData, 
                //         duplicateServiceRecordList: newDuplicateServiceRecordList
                //     }));
                // }
            }
        };
    }

    getEnterpriseSelect = index => {
        return {
            codeKey: 'EntId',
            nameKey: 'EntName',
            dataArr: this.state.entList,
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
                    , index, 'InfoList', 0, 'EntID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'productCategoryList', index, 'InfoList'], [])
                    );
                    //     EntID: '',// 企业id
                    //     PointID: '',// 点位id
                    //     SystemCode: '',// 系统编码 设备型号
                    // newData[index].EntId = item.EntId;
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    newData[0].EntID = item.EntId;
                    newData[0].EntName = item.EntName;
                    // 清空数据
                    newData[0].PointID = '';
                    newData[0].PointId = '';
                    newData[0].PointName = '';
                    newData[0].systemModleList = [];
                    newData[0].SystemCode = '';
                    newData[0].SystemName = '';
                    newData[0].QuestionID = '';//类别ID
                    newData[0].QuestionName = '';//类别名称
                    // 清空数据 end
                    newData[0].pointList = SentencedToEmpty(item, ['PointList'], []);
                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.productCategoryList[index].InfoList = newData;

                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    getPointSelect = index => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            dataArr: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
                    , index, 'InfoList', 0, 'pointList'], []),
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
                    , index, 'InfoList', 0, 'PointId'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'productCategoryList', index, 'InfoList'], [])
                    );
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    newData[0].PointID = item.PointId;
                    newData[0].PointId = item.PointId;
                    newData[0].PointName = item.PointName;
                    //     // 清空数据
                    newData[0].SystemCode = '';
                    newData[0].SystemName = '';
                    newData[0].QuestionID = '';//类别ID
                    newData[0].QuestionName = '';//类别名称
                    // 清空数据 end
                    newData[0].systemModleList = SentencedToEmpty(item, ['systemModleList'], []);
                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.productCategoryList[index].InfoList = newData;

                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    getEquipmentSelect = index => {
        return {
            codeKey: 'SystemModelID',
            nameKey: 'SystemModel',
            dataArr: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
                    , index, 'InfoList', 0, 'systemModleList'], []),
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'
                    , index, 'InfoList', 0, 'QuestionID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    // 检查是否重复
                    const checkList = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'productCategoryList'], []));
                    let hasDuplicateRecord = false, rCheckItem
                        , currentRecord = SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'productCategoryList', index, 'InfoList', 0,], {});
                    let checkItemIndex = -1, currentItemIndex = index;
                    checkList.map((checkItem, checkIndex) => {
                        if (!hasDuplicateRecord) {
                            checkItemIndex = checkIndex;
                            rCheckItem = SentencedToEmpty(checkItem
                                , ['InfoList', 0], {})
                            if ((SentencedToEmpty(rCheckItem
                                , ['QuestionID'], '')
                                == item.SystemModelID)
                                && (SentencedToEmpty(rCheckItem, ['PointId'], '')
                                    == SentencedToEmpty(currentRecord, ['PointId'], ''))
                                && (checkItemIndex != currentItemIndex)
                            ) {
                                // 出现重复
                                ShowToast(`第${(checkItemIndex + 1)}项与第${(currentItemIndex + 1)}项监测点与设备型号出现重复`);
                            }
                        } else {
                            // 出现一次重复记录停止检测
                        }

                    });
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'productCategoryList', index, 'InfoList'], [])
                    );
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    // newData[0].SystemCode = item.SystemModelID;
                    // newData[0].SystemName = item.SystemModel;
                    newData[0].QuestionID = item.SystemModelID;//类别ID
                    newData[0].QuestionName = item.SystemModel;//类别名称

                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.productCategoryList[index].InfoList = newData;
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    render() {
        return (<StatusPage
            status={this.props.serviceUnderWarrantyLoadDataStatus}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
            }}
            onErrorPress={() => {
                //错误页面按钮回调
            }}
        >
            {
                SentencedToEmpty(this.props
                    , ['serviceUnderWarrantySubmitParams', 'productCategoryList'], [])
                    .map((item, index) => {
                        return (<View
                            style={[{
                                width: SCREEN_WIDTH, alignItems: 'center'
                                , marginBottom: 2
                            }]}
                        >
                            <View style={[{
                                width: SCREEN_WIDTH, height: 60
                                , flexDirection: 'row', paddingHorizontal: 20
                                , justifyContent: 'space-between', alignItems: 'center', alignItems: 'center'
                                , backgroundColor: '#fff'
                            }]}>
                                <Text
                                    style={[{
                                        fontSize: 15, color: '#4AA0FF'
                                    }]}
                                >{`条目${index + 1}`}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        // 删除项目
                                        let newProductCategoryList = [].concat(SentencedToEmpty(this.props
                                            , ['serviceUnderWarrantySubmitParams', 'productCategoryList'], []));
                                        newProductCategoryList.splice(index, 1);
                                        let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                        newServiceUnderWarrantySubmitParams.productCategoryList = newProductCategoryList;
                                        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                            serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                        }));
                                    }}
                                >
                                    <View
                                        style={[{
                                            width: 64, height: 30,
                                            borderRadius: 5,
                                            backgroundColor: '#F6F6F6'
                                            , justifyContent: 'center', alignItems: 'center'
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                color: '#4AA0FF', fontSize: 14
                                            }]}
                                        >{'删除'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH, alignItems: 'center'
                                    , backgroundColor: '#fff'
                                }]}
                            >
                                {/* 1 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            backgroundColor: '#fff',
                                            justifyContent: 'center'

                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业名称`}</Text>
                                        <PickerTouchable
                                            available={this.isEdit()}
                                            ref={ref => (this.pointS = ref)}
                                            option={this.getEnterpriseSelect(index)}
                                            // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={[{
                                                        color: '#333333',
                                                        width: SCREEN_WIDTH - 140
                                                        , textAlign: 'right',
                                                    }]}
                                                >{`${SentencedToEmpty(item
                                                    , ['InfoList', 0, 'EntName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                height: 1,
                                                backgroundColor: '#EAEAEA'
                                            }
                                        ]}
                                    />
                                </View>
                                {/* 1 */}
                                {/* 2 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            backgroundColor: '#fff',
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点名称`}</Text>
                                        <PickerTouchable
                                            available={this.isEdit()}
                                            ref={ref => (this.pointS = ref)}
                                            option={this.getPointSelect(index)}
                                            onPress={SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'EntID'], '') == '' ? this.judgeEnterprise : null}
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                    , ['InfoList', 0, 'PointName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                height: 1,
                                                backgroundColor: '#EAEAEA'
                                            }
                                        ]}
                                    />
                                </View>
                                {/* 2 */}
                                {/* 3 */}
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            backgroundColor: '#fff',
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`设备型号`}</Text>
                                        {this.isEdit() ? <PickerTouchable
                                            available={this.isEdit()}
                                            ref={ref => (this.pointS = ref)}
                                            option={this.getEquipmentSelect(index)}
                                            onPress={SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'EntID'], '') == '' ? this.judgeEnterprise : null}
                                            style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                    , ['InfoList', 0, 'QuestionName'], '')}`}</Text>
                                                <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                            : <View
                                                style={[
                                                    {
                                                        flex: 1,
                                                        height: 44,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                    , ['InfoList', 0, 'QuestionName'], '')}`}</Text>
                                            </View>}
                                    </View>
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                height: 1,
                                                backgroundColor: '#EAEAEA'
                                            }
                                        ]}
                                    />
                                </View>
                                {/* 3 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 40, height: 44
                                        , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                        , flexDirection: 'row', alignItems: 'center'
                                        , justifyContent: 'space-between'
                                    }]}
                                >
                                    <Text style={[{
                                        fontSize: 14, color: '#333333'
                                    }]}>{`${'服务时长(小时)'}`}</Text>
                                    <TextInput
                                        editable={this.isEdit()}
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        style={[{
                                            fontSize: 14, color: '#666666'
                                            , textAlign: 'right'
                                        }]}
                                        placeholder={'服务时长(小时)'}
                                        placeholderTextColor={'#999999'}
                                        onChangeText={text => {
                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                            let newData = newServiceUnderWarrantySubmitParams
                                                .productCategoryList[index]
                                                .InfoList;
                                            if (typeof newData[0] == 'undefined') {
                                                newData = [{}];
                                            }
                                            newData[0].ServiceCount = text;
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                            }));
                                        }}
                                    >
                                        {SentencedToEmpty(item, ['InfoList', 0, 'ServiceCount'], '')}
                                    </TextInput>
                                </View>

                                <View style={[{
                                    width: SCREEN_WIDTH, height: 44
                                    , paddingHorizontal: 20
                                    , justifyContent: 'center', alignItems: 'center'
                                    , backgroundColor: '#fff'
                                }]}>
                                    <Form2Switch
                                        editable={this.isEdit()}
                                        label='是否解决'
                                        data={[{ name: '是', value: true }, { name: '否', value: false }]}
                                        value={SentencedToEmpty(item, ['InfoList', 0, 'SolveStatus'], null)}
                                        onChange={(value) => {
                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                            let newData = newServiceUnderWarrantySubmitParams
                                                .productCategoryList[index]
                                                .InfoList;
                                            if (typeof newData[0] == 'undefined') {
                                                newData = [{}];
                                            }
                                            newData[0].SolveStatus = value;
                                            newServiceUnderWarrantySubmitParams
                                                .productCategoryList[index]
                                                .InfoList = newData;
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                            }));
                                        }}
                                    />
                                </View>

                                {SentencedToEmpty(item
                                    , ['InfoList', 0, 'SolveStatus'], false) == false ? <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40, paddingTop: 12
                                        }]}
                                    >
                                    <FormTextArea
                                        editable={this.isEdit()}
                                        areaHeight={40}
                                        numberOfLines={2}
                                        required={false}
                                        label='未解决原因'
                                        placeholder=''
                                        value={SentencedToEmpty(item, ['InfoList', 0, 'Remark'], '')}
                                        onChangeText={(text) => {
                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                            let newData = newServiceUnderWarrantySubmitParams
                                                .productCategoryList[index]
                                                .InfoList;
                                            if (typeof newData[0] == 'undefined') {
                                                newData = [{}];
                                            }
                                            newData[0].Remark = text;
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                            }));
                                        }}
                                    />
                                </View> : null}
                            </View>
                            {/* {
                                    SentencedToEmpty(this.props
                                        , ['serviceUnderWarrantySubmitParams', 'productCategoryList', index, 'InfoList']
                                        , [])
                                        .map((innerItem, innerIndex) => {
                                            return (<View
                                                style={[{
                                                    width: SCREEN_WIDTH, alignItems: 'center'
                                                    , backgroundColor: '#fff'
                                                }]}
                                            >
                                                <View
                                                    style={[{
                                                        width: SCREEN_WIDTH - 40, height: 44
                                                        , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                                        , flexDirection: 'row', alignItems: 'center'
                                                        , justifyContent: 'space-between'
                                                    }]}
                                                >
                                                    <Text style={[{
                                                        fontSize: 14, color: '#333333'
                                                    }]}>{`${innerIndex + 1}、${innerItem.QuestionName}`}</Text>
                                                    <TextInput
                                                        editable={this.isEdit()}
                                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                        style={[{
                                                            fontSize: 14, color: '#666666'
                                                            , textAlign: 'right'
                                                        }]}
                                                        placeholder={'服务时长(小时)'}
                                                        onChangeText={text => {
                                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                                            newServiceUnderWarrantySubmitParams
                                                                .productCategoryList[index]
                                                                .InfoList[innerIndex].ServiceCount = text;
                                                            // let newItem = { ...item }
                                                            // newItem.OverTime = text;
                                                            // let newList = [].concat(timeoutCauseList);
                                                            // newList[index] = newItem;
                                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                                            }));
                                                        }}
                                                    >
                                                        {SentencedToEmpty(innerItem, ['ServiceCount'], '')}
                                                    </TextInput>
                                                </View>

                                                <View style={[{
                                                    width: SCREEN_WIDTH, height: 44
                                                    , paddingHorizontal: 20
                                                    , justifyContent: 'center', alignItems: 'center'
                                                    , backgroundColor: '#fff'
                                                }]}>
                                                    <Form2Switch
                                                        editable={this.isEdit()}
                                                        label='是否解决'
                                                        data={[{ name: '是', value: true }, { name: '否', value: false }]}
                                                        value={innerItem.SolveStatus}
                                                        onChange={(value) => {
                                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                                            newServiceUnderWarrantySubmitParams
                                                                .productCategoryList[index]
                                                                .InfoList[innerIndex].SolveStatus = value;
                                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                                            }));
                                                        }}
                                                    />
                                                </View>

                                                {SentencedToEmpty(innerItem
                                                    , ['SolveStatus'], false) == false ? <View
                                                        style={[{
                                                            width: SCREEN_WIDTH - 40, paddingTop: 12
                                                        }]}
                                                    >
                                                    <FormTextArea
                                                        editable={this.isEdit()}
                                                        areaHeight={40}
                                                        numberOfLines={2}
                                                        required={false}
                                                        label='未解决原因'
                                                        placeholder=''
                                                        value={SentencedToEmpty(innerItem, ['Remark'], '')}
                                                        onChangeText={(text) => {
                                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                                            newServiceUnderWarrantySubmitParams
                                                                .productCategoryList[index]
                                                                .InfoList[innerIndex].Remark = text;
                                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                                            }));
                                                        }}
                                                    />
                                                </View> : null}
                                            </View>)
                                        })
                                } */}
                        </View>);
                    })
            }
            {
                this.isEdit() ? <View style={[{ backgroundColor: 'white' }]}>
                    <TouchableOpacity
                        onPress={() => {
                            let newProductCategoryList = [].concat(SentencedToEmpty(this.props
                                , ['serviceUnderWarrantySubmitParams', 'productCategoryList'], []));
                            newProductCategoryList.push({
                                Type: 1, // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                                InfoList: [
                                    {
                                        QuestionID: '', //类别ID
                                        ServiceCount: '', // 服务时长
                                        SolveStatus: 'unselected', // 是否解决（true 是 false 否）
                                        Remark: '', // 未解决原因
                                    }
                                ], // 二级列表
                            });
                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                            newServiceUnderWarrantySubmitParams.productCategoryList = newProductCategoryList;
                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                            }));
                        }}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    height: 43,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <Image
                                style={[
                                    {
                                        height: 12,
                                        width: 12,
                                        tintColor: '#4DA9FF',
                                        marginRight: 2
                                    }
                                ]}
                                source={require('../../../images/jiarecord.png')}
                            />
                            <Text
                                style={[
                                    {
                                        color: '#4DA9FF',
                                        fontSize: 15
                                    }
                                ]}
                            >
                                {'添加条目'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View> : null
            }
            {/* </ScrollView > */}
        </StatusPage>);
    }
}

@connect(({ CTServiceStatisticsModel, CTModel }) => ({
    recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult,
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    serviceUnderWarrantySubmitParams: CTServiceStatisticsModel.serviceUnderWarrantySubmitParams,
}))
class ServiceReason extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entList: props.entList
        }
    }

    componentDidMount() {
        // 123
        const serviceReasonsList = SentencedToEmpty(this.props
            , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'
            ], [])
        // pointList
        // systemModleList
        const newServiceReasonsList = [].concat(serviceReasonsList);
        let tempItem, tempPointList = [];
        newServiceReasonsList.map((item, index) => {
            tempItem = SentencedToEmpty(item, ['InfoList', 0], {});
            this.props.entList.map((entItem, entIndex) => {
                if (tempItem.EntId == entItem.EntId) {
                    tempItem.pointList = entItem.PointList;
                }
            });
        });
        let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
        newServiceUnderWarrantySubmitParams.serviceReasonsList = newServiceReasonsList;
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams,
            serviceUnderWarrantyLoadDataStatus: 200
        }));
    }


    getEnterpriseSelect = index => {
        return {
            codeKey: 'EntId',
            nameKey: 'EntName',
            dataArr: this.state.entList,
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'
                    , index, 'InfoList', 0, 'EntID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'serviceReasonsList', index, 'InfoList'], [])
                    );
                    //     EntID: '',// 企业id
                    //     PointID: '',// 点位id
                    //     SystemCode: '',// 系统编码 设备型号
                    // newData[index].EntId = item.EntId;
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    newData[0].EntID = item.EntId;
                    newData[0].EntName = item.EntName;
                    // 清空数据
                    newData[0].PointID = '';
                    newData[0].PointName = '';
                    newData[0].systemModleList = [];
                    newData[0].SystemCode = '';
                    newData[0].SystemName = '';
                    newData[0].QuestionID = ''; //类别ID
                    newData[0].QuestionName = '';
                    // 清空数据 end
                    newData[0].pointList = SentencedToEmpty(item, ['PointList'], []);
                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.serviceReasonsList[index].InfoList = newData;

                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    getPointSelect = index => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            dataArr: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'
                    , index, 'InfoList', 0, 'pointList'], []),
            // dataArr: [],
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'
                    , index, 'InfoList', 0, 'PointID'], ''),
            defaultCode: SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'PointID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'serviceReasonsList', index, 'InfoList'], [])
                    );
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    newData[0].PointID = item.PointId;
                    newData[0].PointId = item.PointId;
                    newData[0].PointName = item.PointName;
                    //     // 清空数据
                    newData[0].SystemCode = '';
                    newData[0].SystemName = '';
                    newData[0].QuestionID = ''; //类别ID
                    newData[0].QuestionName = '';
                    // 清空数据 end
                    newData[0].systemModleList = SentencedToEmpty(item, ['systemModleList'], []);
                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.serviceReasonsList[index].InfoList = newData;

                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    getEquipmentSelect = index => {
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['recordQuestionResult', 'data', 'Datas'], []);
        return {
            codeKey: 'ChildID',
            nameKey: 'Name',
            // codeKey: 'SystemModelID',
            // nameKey: 'SystemModel',
            dataArr: dataSource,
            defaultCode: SentencedToEmpty(this.props
                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'
                    , index, 'InfoList', 0, 'QuestionID'], ''),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let checkData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'serviceReasonsList'], [])
                    );
                    let newData = [].concat(
                        SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'serviceReasonsList', index, 'InfoList'], [])
                    );
                    if (typeof newData[0] == 'undefined') {
                        newData = [{}];
                    }
                    let hasDuplicateRecord = false, rCheckItem
                        , currentRecord = SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'
                                , 'serviceReasonsList', index, 'InfoList', 0,], {});
                    let checkItemIndex = -1, currentItemIndex = index
                        , tempItem = {};
                    checkData.map((checkItem, checkIndex) => {
                        if (!hasDuplicateRecord) {
                            checkItemIndex = checkIndex;
                            tempItem = SentencedToEmpty(checkItem, ['InfoList', 0], {});
                            if (checkItemIndex != currentItemIndex
                                && tempItem.PointID == currentRecord.PointID
                                && tempItem.QuestionID == item.ChildID
                            ) {
                                // 出现重复
                                hasDuplicateRecord = true;
                                ShowToast(`第${(checkItemIndex + 1)}项与第${(currentItemIndex + 1)}项监测点与服务原因出现重复`);
                            }
                        }
                    });
                    newData[0].QuestionID = item.ChildID;
                    newData[0].QuestionName = item.Name;

                    let newServiceUnderWarrantySubmitParams = {
                        ...SentencedToEmpty(this.props
                            , ['serviceUnderWarrantySubmitParams'], {})
                    }
                    newServiceUnderWarrantySubmitParams.serviceReasonsList[index].InfoList = newData;
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                        serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                    }));
                }
            }
        };
    };

    getServiceReasonOption = (index) => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['recordQuestionResult', 'data', 'Datas'], []);

        const duplicateServiceRecordList = SentencedToEmpty(this.props
            , ['serviceUnderWarrantySubmitParams'
                , 'serviceReasonsList', index, 'InfoList'], []);
        duplicateServiceRecordList
            .map((item, index) => {
                selectCodes.push(item.QuestionID)
            });

        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            // placeHolderStr: '污染物',
            codeKey: 'ChildID',
            nameKey: 'Name',
            // maxNum: 2,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                let newInfoList = [];
                let oldInfoList = [].concat(SentencedToEmpty(this.props
                    , ['serviceUnderWarrantySubmitParams'
                        , 'serviceReasonsList', index, 'InfoList'], []));
                selectData.map((pickerItem, index) => {

                    let findIndex = oldInfoList.findIndex(item => {
                        return item.QuestionID == pickerItem.ChildID;
                    })

                    if (findIndex != -1) {
                        newInfoList.push(oldInfoList[findIndex]);
                    } else {
                        newInfoList.push({
                            QuestionID: pickerItem.ChildID, //类别ID
                            QuestionName: pickerItem.Name, //类别名称
                            ServiceCount: '', // 服务时长
                            // SolveStatus: 'unselected', // 是否解决（true 是 false 否）
                            // Remark: '', // 未解决原因
                        });
                    }
                });
                newServiceUnderWarrantySubmitParams.serviceReasonsList[index].InfoList = newInfoList;
                this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                    serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                }));
            }
        };
    }

    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH
            }]}
        >
            {/* <ScrollView
                    style={[{
                        width: SCREEN_WIDTH
                    }]}
                > */}
            {
                // [1, 2]
                SentencedToEmpty(this.props
                    , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'], [])
                    .map((item, index) => {
                        return (<View
                            style={[{
                                width: SCREEN_WIDTH, alignItems: 'center'
                                , marginBottom: 2
                            }]}
                        >
                            {this.isEdit() ? <View style={[{
                                width: SCREEN_WIDTH, flex: 1
                            }]}>
                                <View style={[{
                                    width: SCREEN_WIDTH, height: 60
                                    , flexDirection: 'row', paddingHorizontal: 20
                                    , justifyContent: 'space-between', alignItems: 'center', alignItems: 'center'
                                    , backgroundColor: '#fff'
                                }]}>
                                    <Text
                                        style={[{
                                            fontSize: 15, color: '#4AA0FF'
                                        }]}
                                    >{`条目${index + 1}`}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // 删除项目
                                            let newProductCategoryList = [].concat(SentencedToEmpty(this.props
                                                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'], []));
                                            newProductCategoryList.splice(index, 1);
                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                            newServiceUnderWarrantySubmitParams.serviceReasonsList = newProductCategoryList;
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                            }));
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: 64, height: 30,
                                                borderRadius: 5,
                                                backgroundColor: '#F6F6F6'
                                                , justifyContent: 'center', alignItems: 'center'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    color: '#4AA0FF', fontSize: 14
                                                }]}
                                            >{'删除'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                                : <View style={[{
                                    width: SCREEN_WIDTH, flex: 1
                                }]}>
                                    <View style={[{
                                        width: SCREEN_WIDTH, height: 60
                                        , flexDirection: 'row', paddingHorizontal: 20
                                        , justifyContent: 'space-between', alignItems: 'center', alignItems: 'center'
                                        , backgroundColor: '#fff'
                                    }]}>
                                        <Text
                                            style={[{
                                                fontSize: 14, color: '#333333'
                                            }]}
                                        >{`第${index + 1}次`}</Text>
                                    </View>
                                </View>
                            }
                            {/* 1 */}
                            <View
                                style={[
                                    {
                                        height: 45,
                                        width: SCREEN_WIDTH,
                                        paddingHorizontal: 19,
                                        backgroundColor: '#fff',
                                        justifyContent: 'center'

                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业名称`}</Text>
                                    <PickerTouchable
                                        available={this.isEdit()}
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getEnterpriseSelect(index)}
                                        // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                        style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    flex: 1,
                                                    height: 44,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={[{
                                                    color: '#333333',
                                                    width: SCREEN_WIDTH - 140
                                                    , textAlign: 'right',
                                                }]}
                                            >{`${SentencedToEmpty(item
                                                , ['InfoList', 0, 'EntName'], '')}`}</Text>
                                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                        </View>
                                    </PickerTouchable>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            height: 1,
                                            backgroundColor: '#EAEAEA'
                                        }
                                    ]}
                                />
                            </View>
                            {/* 1 */}
                            {/* 2 */}
                            <View
                                style={[
                                    {
                                        height: 45,
                                        width: SCREEN_WIDTH,
                                        paddingHorizontal: 19,
                                        backgroundColor: '#fff',
                                        justifyContent: 'center'
                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点名称`}</Text>
                                    <PickerTouchable
                                        available={this.isEdit()}
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getPointSelect(index)}
                                        onPress={SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'EntID'], '') == '' ? this.judgeEnterprise : null}
                                        style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    flex: 1,
                                                    height: 44,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                , ['InfoList', 0, 'PointName'], '')}`}</Text>
                                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                        </View>
                                    </PickerTouchable>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            height: 1,
                                            backgroundColor: '#EAEAEA'
                                        }
                                    ]}
                                />
                            </View>
                            {/* 2 */}
                            {/* 3 */}
                            <View
                                style={[
                                    {
                                        height: 45,
                                        width: SCREEN_WIDTH,
                                        paddingHorizontal: 19,
                                        backgroundColor: '#fff',
                                        justifyContent: 'center'
                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`服务原因`}</Text>
                                    {this.isEdit() ? <PickerTouchable
                                        available={this.isEdit()}
                                        ref={ref => (this.pointS = ref)}
                                        option={this.getEquipmentSelect(index)}
                                        onPress={SentencedToEmpty(this.props, ['duplicateServiceRecordList', index, 'EntID'], '') == '' ? this.judgeEnterprise : null}
                                        style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    flex: 1,
                                                    height: 44,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                , ['InfoList', 0, 'QuestionName'], '')}`}</Text>
                                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                        </View>
                                    </PickerTouchable>
                                        : <View
                                            style={[
                                                {
                                                    flex: 1,
                                                    height: 44,
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                        >
                                            <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(item
                                                , ['InfoList', 0, 'QuestionName'], '')}`}</Text>
                                        </View>}
                                </View>
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            height: 1,
                                            backgroundColor: '#EAEAEA'
                                        }
                                    ]}
                                />
                            </View>
                            {/* 3 */}
                            <View
                                style={[{
                                    height: 45,
                                    width: SCREEN_WIDTH,
                                    paddingHorizontal: 19,
                                    backgroundColor: '#fff',
                                    justifyContent: 'center'
                                }]}
                            >
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                    <Text style={[{ fontSize: 14, color: '#333333' }]}>{`服务时长（小时）`}</Text>
                                    <TextInput
                                        editable={this.isEdit()}
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        style={[{
                                            flex: 1
                                            , fontSize: 14, color: '#666666'
                                            , textAlign: 'right'
                                        }]}
                                        placeholder={'服务时长(小时)'}
                                        placeholderTextColor={'#999999'}
                                        onChangeText={text => {
                                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                                            let newData = newServiceUnderWarrantySubmitParams
                                                .serviceReasonsList[index]
                                                .InfoList;
                                            if (typeof newData[0] == 'undefined') {
                                                newData = [{}];
                                            }
                                            newData[0].ServiceCount = text;
                                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                                            }));
                                        }}
                                    >
                                        {SentencedToEmpty(item, ['InfoList', 0, 'ServiceCount'], '')}
                                    </TextInput>
                                </View>
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH - 38,
                                            height: 1,
                                            backgroundColor: '#EAEAEA'
                                        }
                                    ]}
                                />
                            </View>
                        </View >);
                    })
            }
            {
                this.isEdit() ? <View style={[{ backgroundColor: 'white' }]}>
                    <TouchableOpacity
                        onPress={() => {
                            let newServiceReasonsList = [].concat(SentencedToEmpty(this.props
                                , ['serviceUnderWarrantySubmitParams', 'serviceReasonsList'], []));
                            newServiceReasonsList.push({
                                Type: 2, // 表单明细类型（1、质保内服务- 产品类别 2、质保内服务 - 服务原因  ）
                                InfoList: [
                                    {
                                        QuestionID: '', //类别ID
                                        ServiceCount: '', // 服务时长
                                        SolveStatus: '', // 是否解决（true 是 false 否）
                                        Remark: '', // 未解决原因
                                    }
                                ], // 二级列表
                            });
                            let newServiceUnderWarrantySubmitParams = { ...this.props.serviceUnderWarrantySubmitParams };
                            newServiceUnderWarrantySubmitParams.serviceReasonsList = newServiceReasonsList;
                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                serviceUnderWarrantySubmitParams: newServiceUnderWarrantySubmitParams
                            }));
                        }}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    height: 43,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <Image
                                style={[
                                    {
                                        height: 12,
                                        width: 12,
                                        tintColor: '#4DA9FF',
                                        marginRight: 2
                                    }
                                ]}
                                source={require('../../../images/jiarecord.png')}
                            />
                            <Text
                                style={[
                                    {
                                        color: '#4DA9FF',
                                        fontSize: 15
                                    }
                                ]}
                            >
                                {'添加条目'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View> : null
            }
            {/* </ScrollView> */}
        </View >)
    }
}