import React, { Component } from 'react';
import { Platform, ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
// import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../components';
import { WINDOW_HEIGHT } from '../../../components/SDLPicker/constant/globalsize';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../config/globalsize';
import MyTabBar from '../../../operationContainers/taskViews/taskExecution/components/MyTabBar';
import { createNavigationOptions, SentencedToEmpty, NavigationActions, createAction, ShowToast } from '../../../utils';
import { getStatusObject } from './ChengTaoGTask';
import color from '../../../components/StatusPages/color';
import SDLTabButton from '../../../components/SDLTabButton';

@connect(({ CTModel }) => ({
    OneServiceDispatchResult: CTModel.OneServiceDispatchResult,
    ctTaskDetailIndex: CTModel.ctTaskDetailIndex,
}))
export default class ChengTaoTaskDetail extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return createNavigationOptions({
    //         title: '派单详情',
    //         headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    //     });
    // };

    componentDidMount() {
        // 获取 服务统计 的状态
        this.props.dispatch(createAction('CTServiceStatisticsModel/getServiceRecordStatus')({}));
    }

    getBaseInfo = () => {
        const content = SentencedToEmpty(this.props, ['route', 'params', 'params'], null);
        if (content) {
            return content;
        } else {
            return SentencedToEmpty(this.props, ['OneServiceDispatchResult', 'data', 'Datas', 0], {});
        }
    };

    onChange = (index) => {
        if (index == 0 || index == 2) {
            // 获取 服务统计 的状态
            this.props.dispatch(createAction('CTServiceStatisticsModel/getServiceRecordStatus')({}));
        }
    }

    render() {
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <StatusPage
                    status={this.props.OneServiceDispatchResult.status}
                    errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                    errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
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
                        flexDirection: 'row', height: 44
                        , width: SCREEN_WIDTH, alignItems: 'center'
                        , justifyContent: 'space-between'
                        , backgroundColor: 'white', marginBottom: 5
                    }]}>
                        <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.ctTaskDetailIndex == 0}
                            label='基本信息'
                            onPress={() => {
                                this.props.dispatch(createAction('CTModel/updateState')({ ctTaskDetailIndex: 0 }));
                            }}
                        />
                        <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.ctTaskDetailIndex == 1}
                            label='服务内容'
                            onPress={() => {
                                this.props.dispatch(createAction('CTModel/updateState')({ ctTaskDetailIndex: 1 }));
                            }}
                        />
                        <SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / 3}
                            selected={this.props.ctTaskDetailIndex == 2}
                            label='服务统计'
                            onPress={() => {
                                this.props.dispatch(createAction('CTModel/updateState')({ ctTaskDetailIndex: 2 }));
                            }}
                        />
                    </View>
                    {
                        this.props.ctTaskDetailIndex == 0
                            ? <BaseInfo {...this.getBaseInfo()} tabLabel="基本信息" listKey="a" key="1" />
                            : this.props.ctTaskDetailIndex == 1
                                ? <ServiceContent style={[{ width: SCREEN_WIDTH, flex: 1 }]} tabLabel="服务内容" listKey="b" key="2"></ServiceContent>
                                : this.props.ctTaskDetailIndex == 2
                                    ? <ServiceStatistics />
                                    : <BaseInfo {...this.getBaseInfo()} tabLabel="基本信息" listKey="a" key="1" />
                    }
                    {/* <ScrollableTabView
                        ref={ref => (this.scrollableTabView = ref)}
                        onChangeTab={obj => {
                            this.onChange(obj.i);
                            // console.log('onChangeTab = ', obj);
                        }}
                        // initialPage={1}
                        style={{ flex: 1, width: SCREEN_WIDTH }}
                        // renderTabBar={() => <MyTabBar tabNames={['基本信息', '服务内容']} />}
                        renderTabBar={() => <MyTabBar tabNames={['基本信息', '服务内容', '服务统计']} />}
                        tabBarUnderlineStyle={{
                            width: SCREEN_WIDTH / 3,
                            // width: SCREEN_WIDTH / 2,
                            height: 2,
                            backgroundColor: '#4aa1fd',
                            marginBottom: -1
                        }}
                        tabBarPosition="top"
                        scrollWithoutAnimation={false}
                        tabBarUnderlineColor="#4aa1fd"
                        tabBarBackgroundColor="#FFFFFF"
                        tabBarActiveTextColor="#4aa1fd"
                        tabBarInactiveTextColor="#000033"
                        tabBarTextStyle={{ fontSize: 15, backgroundColor: 'red' }}
                    >
                        <BaseInfo {...this.getBaseInfo()} tabLabel="基本信息" listKey="a" key="1" />
                        <ServiceContent style={[{ width: SCREEN_WIDTH, flex: 1 }]} tabLabel="服务内容" listKey="b" key="2"></ServiceContent>
                        <ServiceStatistics />
                    </ScrollableTabView> */}
                </StatusPage>
            </View>
        );
    }
}

@connect(({ CTModel, CTServiceStatisticsModel }) => ({
    updateServiceDispatchResult: CTModel.updateServiceDispatchResult,
    serviceRecordStatusResult: CTServiceStatisticsModel.serviceRecordStatusResult
}))
class BaseInfo extends Component {
    // TaskStatus  1 待完成 2  进行中  3 已完成

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['updateServiceDispatchResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />;
        } else {
            return null;
        }
    };

    cancelButton = () => { }
    confirmForm = () => {
        const {
            overTimeRecord = false,
            problemsRecord = false,
            repeatRecord = false,
            warrantyRecord = false
        } = SentencedToEmpty(this.props, ['serviceRecordStatusResult', 'data', 'Datas'], {});
        console.log(
            'overTimeRecord = ', overTimeRecord
            , ',problemsRecord = ', problemsRecord
            , ',repeatRecord = ', repeatRecord
            , ',warrantyRecord = ', warrantyRecord
        );
        if (overTimeRecord && problemsRecord
            && repeatRecord && warrantyRecord
        ) {
            this.props.dispatch(createAction('CTModel/updateServiceDispatch')({}));
        } else {
            ShowToast('服务统计中的表单为必填项，请填写完整');
        }
    }

    render() {
        const alertCompletedFormOptions = {
            headTitle: '提示',
            messText: '确定要完成这个成套任务吗',
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
                    onpress: this.confirmForm
                }
            ]
        };
        /**
         * 服务申请人 ApplicantUserName、下单日期OrderDate、派工单号Num
         * 、合同编号ProjectCode、立项号ItemCode、最终客户名称CustomName
         * 、最终客户单位名称CustomEnt、任务状态TaskStatusName、服务内容Remark
         *
         * TaskStatus  1 待完成 2  进行中  3 已完成
         */
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1, marginTop: 5 }]}>
                <View
                    style={[
                        {
                            width: SCREEN_WIDTH,
                            height: 202,
                            paddingHorizontal: 20,
                            backgroundColor: 'white',
                            paddingTop: 10,
                            paddingBottom: 15,
                            justifyContent: 'space-between'
                        }
                    ]}
                >
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`服务申请人：${SentencedToEmpty(this.props, ['ApplicantUserName'], '---')}`}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`下单日期：${SentencedToEmpty(this.props, ['OrderDate'], '---')}`}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`派单工号：${SentencedToEmpty(this.props, ['Num'], '---')}`}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`合同编号：${SentencedToEmpty(this.props, ['ProjectCode'], '---')}`}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`立项号：${SentencedToEmpty(this.props, ['ItemCode'], '---')}`}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`最终客户名称：${SentencedToEmpty(this.props, ['CustomName'], '---')}`}
                    </Text>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                flexDirection: 'row'
                            }
                        ]}
                    >
                        <Text style={[{ fontSize: 14, color: '#333333' }]}>任务状态：</Text>
                        <View
                            style={[
                                {
                                    backgroundColor: getStatusObject(SentencedToEmpty(this.props, ['TaskStatus'], 1)).bgColor
                                }
                            ]}
                        >
                            <Text style={[{ fontSize: 13, color: getStatusObject(SentencedToEmpty(this.props, ['TaskStatus'], 1)).textColor, marginHorizontal: 6, marginTop: 1, marginBottom: 1 }]}>
                                {SentencedToEmpty(this.props, ['TaskStatusName'], '-')}
                            </Text>
                        </View>
                    </View>
                    <Text
                        numberOfLines={1}
                        style={[
                            {
                                width: SCREEN_WIDTH - 40,
                                fontSize: 14,
                                color: '#333333'
                            }
                        ]}
                    >
                        {`服务内容：${SentencedToEmpty(this.props, ['Remark'], '---')}`}
                    </Text>
                </View>
                <View style={[{ flex: 1 }]} />
                {SentencedToEmpty(this.props, ['TaskStatus'], 3) != 3 ? <TouchableOpacity
                    onPress={() => {
                        this.refs.completedFormAlert.show();
                    }}
                    style={[
                        {
                            marginHorizontal: 10,
                            marginBottom: 20,
                            marginTop: 10
                        }
                    ]}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 20,
                                height: 44,
                                borderRadius: 2,
                                backgroundColor: '#4DA9FF',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'完成'}</Text>
                    </View>
                </TouchableOpacity> : null}
                <AlertDialog options={alertCompletedFormOptions} ref="completedFormAlert" />
                {
                    this.renderLoadingComponent()
                }
            </View>
        );
    }
}

@connect(({ CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    serviceDispatchTypeAndRecordResult: CTModel.serviceDispatchTypeAndRecordResult
}))
class ServiceContent extends Component {
    constructor(props) {
        super(props);
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        let firstLevelSelectedIndex = 0
        if (TaskStatus == 3) {
            let first = true;
            SentencedToEmpty(this.props
                , ['serviceDispatchTypeAndRecordResult', 'data'
                    , 'Datas'], [])
                .map((item, index) => {
                    if (SentencedToEmpty(item, ['ItemStatus'], 0) == 1) {
                        if (first) {
                            firstLevelSelectedIndex = index;
                            first = false;
                        }
                    }
                })
        }
        this.state = {
            contentHeight: 0,
            'firstLevelSelectedIndex': firstLevelSelectedIndex
        };
    }

    /**
     * 调整界面高度
     */
    scrollViewLayout = event => {
        if (Platform.OS === 'ios') {
            this.setState({ contentHeight: SCREEN_HEIGHT - 64 });
        } else if (this.state.contentHeight == 0) {
            this.setState({ contentHeight: event.nativeEvent.layout.height });
        }
    };

    getImage = item => {
        switch (item.RecordId) {
            case '9':
                // "验收服务报告" ic_ct_acceptance_report.png
                return require('../../../images/ic_ct_acceptance_report.png');
            case '10':
                // 现场勘查信息
                return require('../../../images/ic_ct_survey_information.png');
            case '11':
                // 工作记录"
                return require('../../../images/ic_ct_work_record.png');
            case '12':
                // 验货单
                return require('../../../images/ic_ct_inspection_sheet.png');
            case '13':
                // 静态调试 项目交接单
                return require('../../../images/ic_ct_survey_information.png');
            case '14':
                // 安装报告
                return require('../../../images/ic_ct_inspection_sheet.png');
            case '17':
                // 安装照片
                return require('../../../images/ic_ct_72_hour_commissioning.png');
            case '18':
                // 参数照片
                return require('../../../images/ic_ct_params_photo.png');
            case '19':
                // 72小时调试检测
                return require('../../../images/ic_ct_72_hour_commissioning.png');
            case '20':
                // 参数设置照片
                return require('../../../images/ic_ct_params_photo.png');
            case '21':
                // 数据一致性
                return require('../../../images/ic_ct_data_consistency.png');
            case '22':
                // 比对监测报告
                return require('../../../images/ic_ct_inspection_sheet.png');
            case '23':
                // 验收资料
                return require('../../../images/ic_ct_inspection_sheet.png');
            case '24':
                // 第三方检查汇报
                return require('../../../images/ic_ct_inspection_sheet.png');
            case '25':
                // 维修记录
                return require('../../../images/ic_ct_inspection_sheet.png');
            default:
                return require('../../../images/ic_ct_inspection_sheet.png');
        }
    };

    getExplainText = () => {
        console.log('firstLevelSelectedIndex = ', this.state.firstLevelSelectedIndex);
        const list = SentencedToEmpty(this.props, ['serviceDispatchTypeAndRecordResult', 'data', 'Datas'], []);
        console.log(list[this.state.firstLevelSelectedIndex]);
        /**
         * 1	前期勘查
         * 2	设备验货
         * 3	指导安装
         * 4	静态调试
         * 5	动态投运
         * 6	168试运行
         * 7	72小时调试检测
         * 8	联网
         * 9	比对监测
         * 10	项目验收
         * 11	配合检查
         * 12	维修
         * 13	培训
         * 14	其它
         */
        switch (list[this.state.firstLevelSelectedIndex].ItemId) {
            case '1':// 前期勘查
            case '2':// 设备验货
            case '5':// 动态投运
            case '6':// 168试运行
            case '7':// 72小时调试检测
            case '8':// 联网
            case '9':// 比对监测
            case '10':// 项目验收
            case '11':// 配合检查
            case '13':// 培训
            case '14':// 其它
                return (<Text
                    style={[{
                        width: SCREEN_WIDTH - 142,
                        fontSize: 14, color: 'red'
                        , lineHeight: 18, marginLeft: 4
                        , marginBottom: 8
                    }]}
                >
                    {`说明：
指导安装、静态调试、维修以外服务节点只要上传一份验收服务报告即可。`}
                </Text>);
            case '3':
                // 指导安装
                return (<Text
                    style={[{
                        width: SCREEN_WIDTH - 142,
                        fontSize: 14, color: 'red'
                        , lineHeight: 18, marginLeft: 4
                        , marginBottom: 8
                    }]}
                >
                    {`说明：
指导安装、静态调试两个服务节点同一个点位上传一份验收服务报告即可。`}
                </Text>);
            case '4':
                // 静态调试
                return (<Text
                    style={[{
                        width: SCREEN_WIDTH - 142,
                        fontSize: 14, color: 'red'
                        , lineHeight: 18, marginLeft: 4
                        , marginBottom: 8
                    }]}
                >
                    {`说明：
指导安装、静态调试两个服务节点同一个点位上传一份验收服务报告即可。`}
                </Text>);
            case '12':
                // 维修
                return (<Text
                    style={[{
                        width: SCREEN_WIDTH - 142,
                        fontSize: 14, color: 'red'
                        , lineHeight: 18, marginLeft: 4
                        , marginBottom: 8
                    }]}
                >
                    {`说明：
维修服务节点要求至少一份验收服务报告。`}
                </Text>);
        }
    }

    secondItemClick = (secondItem) => {
        /**
         *  9   验收服务报告
         *  10	现场勘查信息
            11	工作记录
            12	验货单
            13	项目交接单
            14	安装报告
            17	安装照片
            19	72小时调试检测
            20	参数设置照片
            22	比对监测报告
            23	验收资料
            24	第三方检查汇报
            25	维修记录
 
            13 项目交接单， 14 安装报告，22 比对监测报告，23 验收资料
        */
        /**
            * 单条记录提交的项目
            * 一级大类：前期勘查、设备验货
            * 二级小类：验收服务报告、现场勘查信息、工作记录、验货单
            */
        /**
            * 多条记录企业和监测点 不应该重复，目前没有限制
            * 由于安装照片需要根据点位分组，因此不支持重复点位添加，提交前需要做出校验，否则会引起数据混乱
            */
        const firstItem = SentencedToEmpty(this.props, ['serviceDispatchTypeAndRecordResult', 'data', 'Datas', this.state.firstLevelSelectedIndex], {});
        let firstItem_ItemId;
        switch (SentencedToEmpty(secondItem, ['RecordId'], -1)) {
            case '9':
                // 验收服务报告
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CTModel/updateState')({
                            secondItem,
                            firstItem,
                            acceptanceServiceRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CTModel/updateState')({
                            secondItem,
                            firstItem,
                            acceptanceServiceRecordResult: { status: 200 }
                        })
                    );
                }
                firstItem_ItemId = firstItem.ItemId;
                // 1 前期勘查   2 设备验货  13 培训      14 其它
                if (
                    firstItem_ItemId == 1 ||
                    firstItem_ItemId == 2 ||
                    firstItem_ItemId == 13 ||
                    firstItem_ItemId == 14
                    // || firstItem_ItemId == 3  // 3 指导安装
                ) {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'AcceptanceServiceReportSingle',
                            params: {
                                secondItem,
                                firstItem
                            }
                        })
                    );
                } else {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'AcceptanceServiceReportMultiple',
                            params: {
                                secondItem,
                                firstItem
                            }
                        })
                    );
                }
                break;
            case '10':
                // 现场勘查信息
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewSingle',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '11':
                // 工作记录
                /**
                    * 所有的工作记录中的完成状态为必填项
                    * 如果选择未完成0完成时间不显示，
                    * 如果选择已完成1 那么完成时间显示并必填写
                    *
                    * 72小时调试检测的工作记录加一个是否调试完成接口的字段Col1
                    * 其它的工作记录表都没有
                    *
                    * 分为三类
                    * ==========================
                    * 工作记录
                    * 工作记录多条
                    * 72小时调试工作记录
                    */
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CTWorkRecordModel/updateState')({
                            workRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CTWorkRecordModel/updateState')({
                            workRecordResult: { status: 200 }
                        })
                    );
                }
                firstItem_ItemId = firstItem.ItemId;
                // 1 前期勘查   2 设备验货      13 培训     14 其它
                if (firstItem_ItemId == 1 || firstItem_ItemId == 2 || firstItem_ItemId == 13 || firstItem_ItemId == 14) {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'WorkRecordSingle',
                            params: {
                                secondItem,
                                firstItem
                            }
                        })
                    );
                } else {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'WorkRecord72',
                            params: {
                                secondItem,
                                firstItem
                            }
                        })
                    );
                }
                break;
            case '12':
                // 验货单
                // SevenFormViewSingle
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewSingle',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '13':
                // 项目交接单
                // SevenFormViewMultiple
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewMultiple',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '14':
                // 安装报告
                // SevenFormViewMultiple
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewMultiple',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '17':
                // 安装照片
                /**
                    * 由于安装照片需要根据点位分组，因此不支持重复点位添加，提交前需要做出校验，否则会引起数据混乱
                    */
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'EquipmentInstallationPic',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '19':
                // 72小时调试检测
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'DebuggingDetection72',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '20':
                // 参数设置照片
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'ParameterSettingPic',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '22':
                // 比对监测报告
                // SevenFormViewMultiple
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewMultiple',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '23':
                // 验收资料
                // SevenFormViewMultiple
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem
                    })
                );
                if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: -1 }
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('CT7FormModel/updateState')({
                            publicRecordResult: { status: 200 }
                        })
                    );
                }
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SevenFormViewMultiple',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '24':
                // 第三方检查汇报
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem,
                        acceptanceServiceRecordResult: { status: -1 }
                    })
                );
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'CTPeiHeJianChaList',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '25':
                // 维修记录
                this.props.dispatch(
                    createAction('CTModel/updateState')({
                        secondItem,
                        firstItem,
                        acceptanceServiceRecordResult: { status: -1 }
                    })
                );
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'RepairRecords',
                        params: {
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            case '26':
                // 备件更换 
                console.log('secondItem = ', secondItem);
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SparePartsChangeEditor',
                        params: {
                            from: 'ChengTaoTaskDetail',
                            secondItem,
                            firstItem
                        }
                    })
                );
                break;
            default:
                break;
        }
    }

    render() {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        return (
            <View
                onLayout={event => {
                    this.scrollViewLayout(event);
                }}
                style={[
                    {
                        width: SCREEN_WIDTH,
                        flex: 1,
                        marginTop: 5,
                        flexDirection: 'row',
                        backgroundColor: '#ffffff'
                    }
                ]}
            >
                <View
                    style={[
                        {
                            width: 133,
                            height: this.state.contentHeight
                        }
                    ]}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={[
                            {
                                width: 133
                            }
                        ]}
                    >
                        {SentencedToEmpty(this.props, ['serviceDispatchTypeAndRecordResult', 'data', 'Datas'], []).map((item, index) => {
                            /**
                             * 1	前期勘查
                             * 2	设备验货
                             * 3	指导安装
                             * 4	静态调试
                             * 5	动态投运
                             * 6	168试运行
                             * 7	72小时调试检测
                             * 8	联网
                             * 9	比对监测
                             * 10	项目验收
                             * 11	配合检查
                             * 12	维修
                             * 13	培训
                             * 14	其它
                             */
                            /**
                             * 如果任务未完成，全部显示
                             * 如果任务完成，只显示有内容的记录
                             */
                            if (TaskStatus == 3) {
                                // 已完成的任务
                                if (SentencedToEmpty(item, ['ItemStatus'], 0) == 1) {
                                    // 填写过的表单
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    firstLevelSelectedIndex: index
                                                });
                                            }}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: 133
                                                    }
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            width: 133,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            marginTop: 15,
                                                            marginBottom: 10
                                                        }
                                                    ]}
                                                >
                                                    {this.state.firstLevelSelectedIndex == index ? (
                                                        <View
                                                            style={[
                                                                {
                                                                    width: 2,
                                                                    height: 20,
                                                                    backgroundColor: '#4DA9FF'
                                                                }
                                                            ]}
                                                        />
                                                    ) : (
                                                        <View
                                                            style={[
                                                                {
                                                                    width: 2,
                                                                    height: 20
                                                                }
                                                            ]}
                                                        />
                                                    )}
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            {
                                                                fontSize: 14,
                                                                color: this.state.firstLevelSelectedIndex == index ? '#333333' : '#666666',
                                                                flex: 1,
                                                                marginLeft: 20,
                                                                fontWeight: this.state.firstLevelSelectedIndex == index ? '700' : '400'
                                                            }
                                                        ]}
                                                    >{`${SentencedToEmpty(item, ['ItemName'], '----')}`}</Text>
                                                    <Image style={[{ width: 12, height: 12, marginHorizontal: 4 }]} source={require('../../../images/ic_green_check_mark.png')} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }
                            } else {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                firstLevelSelectedIndex: index
                                            });
                                        }}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: 133
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: 133,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 15,
                                                        marginBottom: 10
                                                    }
                                                ]}
                                            >
                                                {this.state.firstLevelSelectedIndex == index ? (
                                                    <View
                                                        style={[
                                                            {
                                                                width: 2,
                                                                height: 20,
                                                                backgroundColor: '#4DA9FF'
                                                            }
                                                        ]}
                                                    />
                                                ) : (
                                                    <View
                                                        style={[
                                                            {
                                                                width: 2,
                                                                height: 20
                                                            }
                                                        ]}
                                                    />
                                                )}
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        {
                                                            fontSize: 14,
                                                            color: this.state.firstLevelSelectedIndex == index ? '#333333' : '#666666',
                                                            flex: 1,
                                                            marginLeft: 20,
                                                            fontWeight: this.state.firstLevelSelectedIndex == index ? '700' : '400'
                                                        }
                                                    ]}
                                                >{`${SentencedToEmpty(item, ['ItemName'], '----')}`}</Text>
                                                {SentencedToEmpty(item, ['ItemStatus'], 0) == 1 ? (
                                                    <Image style={[{ width: 12, height: 12, marginHorizontal: 4 }]} source={require('../../../images/ic_green_check_mark.png')} />
                                                ) : (
                                                    <View style={[{ width: 12, height: 12, marginHorizontal: 4 }]} />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                        })}
                        <View style={{ height: 200, flex: 1 }}></View>
                    </ScrollView>
                </View>
                <View
                    style={[
                        {
                            width: 1,
                            backgroundColor: '#EAEAEA',
                            marginTop: 10,
                            height: this.state.contentHeight > 10 ? this.state.contentHeight - 10 : 0
                        }
                    ]}
                />
                <View
                    style={[
                        {
                            flex: 1,
                            height: this.state.contentHeight
                        }
                    ]}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={[
                            {
                                width: SCREEN_WIDTH - 134,
                                paddingVertical: 4
                            }
                        ]}
                    >
                        <View style={[{ width: SCREEN_WIDTH - 134, flexDirection: 'row', flexWrap: 'wrap' }]}>
                            {SentencedToEmpty(this.props, ['serviceDispatchTypeAndRecordResult', 'data', 'Datas', this.state.firstLevelSelectedIndex, 'RecordList'], []).map((secondItem, secondIndex) => {
                                if (TaskStatus == 3) {
                                    if (SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1) {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.secondItemClick(secondItem);
                                                }}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            width: (SCREEN_WIDTH - 136) / 2,
                                                            height: 82,
                                                            alignItems: 'center'
                                                        }
                                                    ]}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                flexDirection: 'row',
                                                                height: 35,
                                                                marginTop: 15,
                                                                marginBottom: 10
                                                            }
                                                        ]}
                                                    >
                                                        <View style={[{ width: 12, height: 12, marginRight: -6, marginTop: -6 }]} />
                                                        <Image
                                                            source={this.getImage(secondItem)}
                                                            style={[
                                                                {
                                                                    width: 35,
                                                                    height: 35
                                                                }
                                                            ]}
                                                        />
                                                        <Image style={[{ width: 12, height: 12, marginLeft: -6, marginTop: -6 }]} source={require('../../../images/ic_green_check_mark.png')} />
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            {
                                                                fontSize: 14,
                                                                color: '#666666',
                                                                lineHeight: 18
                                                            }
                                                        ]}
                                                    >
                                                        {`${SentencedToEmpty(secondItem, ['RecordName'], '-----')}`}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }
                                } else {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.secondItemClick(secondItem);
                                            }}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: (SCREEN_WIDTH - 136) / 2,
                                                        height: 82,
                                                        alignItems: 'center'
                                                    }
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            flexDirection: 'row',
                                                            height: 35,
                                                            marginTop: 15,
                                                            marginBottom: 10
                                                        }
                                                    ]}
                                                >
                                                    {SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1 ? <View style={[{ width: 12, height: 12, marginRight: -6, marginTop: -6 }]} /> : null}
                                                    <Image
                                                        source={this.getImage(secondItem)}
                                                        style={[
                                                            {
                                                                width: 35,
                                                                height: 35
                                                            }
                                                        ]}
                                                    />
                                                    {SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1 ? (
                                                        <Image style={[{ width: 12, height: 12, marginLeft: -6, marginTop: -6 }]} source={require('../../../images/ic_green_check_mark.png')} />
                                                    ) : null}
                                                </View>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        {
                                                            fontSize: 14,
                                                            color: '#666666',
                                                            lineHeight: 18
                                                        }
                                                    ]}
                                                >
                                                    {`${SentencedToEmpty(secondItem, ['RecordName'], '-----')}`}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }
                            })}
                        </View>
                    </ScrollView>
                    {
                        this.getExplainText()
                    }
                </View>
            </View>
        );
    }
}

@connect(({ CTServiceStatisticsModel }) => ({
    serviceRecordStatusResult: CTServiceStatisticsModel.serviceRecordStatusResult
}))
class ServiceStatistics extends Component {

    componentDidMount() {
    }

    getButtonStatus = (item) => {
        // overTimeRecord超时服务、repeatRecord重复表单、problemsRecord遗留问题 、warrantyRecord质保内服务
        if (item.title == '质保内服务填报') {
            return SentencedToEmpty(this.props
                , ['serviceRecordStatusResult', 'data'
                    , 'Datas', 'warrantyRecord'], false);
        } else if (item.title == '超时服务填报') {
            return SentencedToEmpty(this.props
                , ['serviceRecordStatusResult', 'data'
                    , 'Datas', 'overTimeRecord'], false);
        } else if (item.title == '重复服务填报') {
            return SentencedToEmpty(this.props
                , ['serviceRecordStatusResult', 'data'
                    , 'Datas', 'repeatRecord'], false);
        } else if (item.title == '遗留问题填报') {
            return SentencedToEmpty(this.props
                , ['serviceRecordStatusResult', 'data'
                    , 'Datas', 'problemsRecord'], false);
        } else {
            return false;
        }

    }

    render() {
        return (<View
            style={[{
                width: SCREEN_WIDTH, flex: 1
                , backgroundColor: 'white'
                , marginTop: 5
                , paddingTop: 4
            }]}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH,
                    flexDirection: 'row'
                    , flexWrap: 'wrap'
                }]}
            >
                {
                    [
                        {
                            icon: require('../../../images/ic_under_warranty_service.png'),
                            title: '质保内服务填报',
                        },
                        {
                            icon: require('../../../images/ic_timeout_service.png'),
                            title: '超时服务填报',
                        },
                        {
                            icon: require('../../../images/ic_duplicate_service.png'),
                            title: '重复服务填报',
                        },
                        {
                            icon: require('../../../images/ic_leftover_problem.png'),
                            title: '遗留问题填报',
                        },
                    ].map((item, index) => {
                        return (<TouchableOpacity
                            onPress={() => {
                                if (item.title == '质保内服务填报') {
                                    // ServiceUnderWarranty
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'ServiceUnderWarranty',
                                        params: {
                                        }
                                    }));
                                } else if (item.title == '超时服务填报') {
                                    // recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult, // 超时、重复派单原因码表 
                                    // overTimeServiceRecordResult: CTServiceStatisticsModel.overTimeServiceRecordResult, // 超时派单信息
                                    // timeoutCauseList: CTServiceStatisticsModel.timeoutCauseList, // 记录列表
                                    // timeoutCauseHasData: CTServiceStatisticsModel.timeoutCauseHasData, // 是否有超时服务表单

                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'TimeoutService',
                                        params: {
                                        }
                                    }));
                                } else if (item.title == '重复服务填报') {
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'DuplicateService',
                                        params: {
                                        }
                                    }));
                                } else if (item.title == '遗留问题填报') {
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'LeftoverProblem',
                                        params: {
                                        }
                                    }));
                                }
                            }}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH / 3, height: 90
                                    , alignItems: 'center'
                                }]}
                            >
                                <Image style={[{
                                    marginTop: 16
                                    , height: 35, width: 35
                                }]}
                                    source={item.icon}
                                />
                                {this.getButtonStatus(item) ? <Image
                                    style={[{
                                        position: 'absolute', left: SCREEN_WIDTH / 6 + 12, top: 12,
                                        width: 12, height: 12
                                    }]}
                                    source={require('../../../images/ic_ct_submit_status.png')}
                                /> : null}
                                <Text
                                    style={[{
                                        marginTop: 10,
                                        fontSize: 14, color: '#333333'
                                    }]}
                                >{
                                        `${item.title}`
                                    }</Text>
                            </View>
                        </TouchableOpacity>)
                    })
                }
            </View>
            <View style={[{
                flex: 1
            }]} />
            <Text
                style={[{
                    fontSize: 14, color: 'red'
                    , width: SCREEN_WIDTH - 20, marginLeft: 10
                    , lineHeight: 20, marginBottom: 8
                }]}
            >
                {`说明：服务内容包含项目验收及前面服务节点时，勿需填报质保服务，否则必填质保内服务统计信息。`}
            </Text>
        </View >);
    }
}
