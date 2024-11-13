/*
 * @Description: 服务记录详情和提醒
 * @LastEditors: hxf
 * @Date: 2024-04-11 18:59:17
 * @LastEditTime: 2024-11-11 14:02:12
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/ServiceReminder/ServiceReminderDetailEditor.js
 */
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, ShowToast, createAction, createNavigationOptions } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { connect } from 'react-redux';
import { AlertDialog, PickerTouchable, SimpleLoadingComponent, StatusPage } from '../../components';
import FormDatePicker from '../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import moment from 'moment';
import globalcolor from '../../config/globalcolor';
import FormDatePicker_Unselected from '../../operationContainers/taskViews/taskExecution/components/FormDatePicker_Unselected';

@connect(({ CTServiceReminderModel }) => ({
    deleteServiceReminderResult: CTServiceReminderModel.deleteServiceReminderResult,
    serviceReminderViewResult: CTServiceReminderModel.serviceReminderViewResult, // 提醒详情请求结果
    addServiceReminderResult: CTServiceReminderModel.addServiceReminderResult,
    startReminderOptionList: CTServiceReminderModel.startReminderOptionList,
    pointList: CTServiceReminderModel.pointList,
    serviceTypeList: CTServiceReminderModel.serviceTypeList,
    addServiceReminderParams: CTServiceReminderModel.addServiceReminderParams
}))
export default class ServiceReminderDetailEditor extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '添加服务提醒',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    getPointSelect = () => {
        return {
            codeKey: 'PointId',
            nameKey: 'PointName',
            // dataArr: this.state.entList,
            dataArr: SentencedToEmpty(this.props, ['pointList'], []),
            defaultCode: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'PointId'], ''),
            onSelectListener: item => {

                let newData = { ...this.props.addServiceReminderParams };
                newData.PointName = SentencedToEmpty(item, ['PointName'], '');
                newData.PointId = SentencedToEmpty(item, ['PointId'], '');
                this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                    addServiceReminderParams: newData
                }));
            }
        };
    }

    isEdit = () => {
        return true;
    }

    getServiceStartDateOption = () => {
        return {
            defaultTime: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'ExpectedTime']
                , moment().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newData = { ...this.props.addServiceReminderParams };
                // 至少提前30分钟创建提醒
                if (moment().add(30, 'minutes').isBefore(moment(time))) {
                    newData.ExpectedTime = moment(time).format('YYYY-MM-DD HH:mm');
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        addServiceReminderParams: newData
                    }));
                } else {
                    ShowToast('至少提前30分钟创建提醒');
                }

            }
        };
    }

    getDailyReminder = () => {
        let dailyReminderList = [];
        dailyReminderList.push({
            "MType": "1", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
            // "ReminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
            "EModel": "-2"  // 开始提醒枚举
        });
        dailyReminderList.push({
            "MType": "2", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
            // "ReminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
            "EModel": "-2"  // 开始提醒枚举
        });
        dailyReminderList.push({
            "MType": "3", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
            // "ReminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
            "EModel": "-1"  // 开始提醒枚举
        });
        dailyReminderList.push({
            "MType": "4", // 1 日提醒1 2 日提醒2 3开始提醒1 4开始提醒2
            // "ReminderTime": "2024-04-13 14:30", // 提醒时间一定要传 计算好
            "EModel": "-1"  // 开始提醒枚举
        });
        return dailyReminderList;
    }

    getDailyReminder1Option = () => {
        return {
            defaultTime: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'serviceReminderInfoList'
                    , 0, 'ReminderTime']
                , moment().format('YYYY-MM-DD')),
            type: 'day',
            onSureClickListener: time => {
                let newData = { ...this.props.addServiceReminderParams };
                let serviceReminderInfoList = SentencedToEmpty(newData, ['serviceReminderInfoList'], []);
                if (serviceReminderInfoList.length == 0) {
                    serviceReminderInfoList = this.getDailyReminder();
                }
                if (time == 'unselected') {
                    serviceReminderInfoList[0].ReminderTime = '无提醒';
                    // + " " + moment(newData.ExpectedTime).format('HH:mm');
                    newData.serviceReminderInfoList = serviceReminderInfoList;
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        addServiceReminderParams: newData
                    }));
                    return;
                }

                let checkTime = moment(time).format('YYYY-MM-DD') + ' ' + moment(newData.ExpectedTime).format('HH:mm');
                // 需要先选择 预计开始时间 
                if (moment(checkTime)
                    .isBefore(moment(newData.ExpectedTime))) {
                    serviceReminderInfoList[0].ReminderTime = moment(time).format('YYYY-MM-DD');
                    // + " " + moment(newData.ExpectedTime).format('HH:mm');
                    newData.serviceReminderInfoList = serviceReminderInfoList;
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        addServiceReminderParams: newData
                    }));
                } else {
                    ShowToast('日提醒需要早于预计开始时间');
                }
            }
        };
    }

    getDailyReminder2Option = () => {
        return {
            defaultTime: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'serviceReminderInfoList'
                    , 1, 'ReminderTime']
                , moment().format('YYYY-MM-DD')),
            type: 'day',
            onSureClickListener: time => {
                let newData = { ...this.props.addServiceReminderParams };
                let serviceReminderInfoList = SentencedToEmpty(newData, ['serviceReminderInfoList'], []);
                if (serviceReminderInfoList.length == 0) {
                    serviceReminderInfoList = this.getDailyReminder();
                }
                if (time == 'unselected') {
                    serviceReminderInfoList[1].ReminderTime = '无提醒';
                    newData.serviceReminderInfoList = serviceReminderInfoList;
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        addServiceReminderParams: newData
                    }));
                    return;
                }

                // 需要先选择 预计开始时间 
                let checkTime = moment(time).format('YYYY-MM-DD') + ' ' + moment(newData.ExpectedTime).format('HH:mm');
                // 需要先选择 预计开始时间 
                if (moment(checkTime)
                    .isBefore(moment(newData.ExpectedTime))) {
                    serviceReminderInfoList[1].ReminderTime = moment(time).format('YYYY-MM-DD');
                    // + " " + moment(newData.ExpectedTime).format('HH:mm');
                    newData.serviceReminderInfoList = serviceReminderInfoList;
                    this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                        addServiceReminderParams: newData
                    }));
                } else {
                    ShowToast('日提醒需要早于预计开始时间');
                }
            }
        };
    }

    getStartReminderTime = (type) => {
        const ExpectedTime = this.props.addServiceReminderParams.ExpectedTime;
        // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时

        if (type == 1) {
            return moment(ExpectedTime).subtract(15, 'minutes').format('YYYY-MM-DD HH:mm');
        } else if (type == 2) {
            return moment(ExpectedTime).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm');
        } else if (type == 3) {
            return moment(ExpectedTime).subtract(1, 'hours').format('YYYY-MM-DD HH:mm');
        } else if (type == 4) {
            return moment(ExpectedTime).subtract(2, 'hours').format('YYYY-MM-DD HH:mm');
        }
    }

    getStartReminder1Option = () => {
        return {
            codeKey: 'value',
            nameKey: 'label',
            // dataArr: this.state.entList,
            dataArr: SentencedToEmpty(this.props, ['startReminderOptionList'], []),
            defaultCode: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'serviceReminderInfoList'
                    , 2, 'EModel']
                , ''),
            onSelectListener: item => {

                let newData = { ...this.props.addServiceReminderParams };
                let serviceReminderInfoList = SentencedToEmpty(newData, ['serviceReminderInfoList'], []);
                if (serviceReminderInfoList.length == 0) {
                    serviceReminderInfoList = this.getDailyReminder();
                }

                // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
                // 需要先选择 预计开始时间 
                serviceReminderInfoList[2].ReminderTime = this.getStartReminderTime(item.value);
                serviceReminderInfoList[2].EModel = item.value;
                serviceReminderInfoList[2].EModelName = item.label;
                // + " " + moment(newData.ExpectedTime).format('HH:mm');
                newData.serviceReminderInfoList = serviceReminderInfoList;
                this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                    addServiceReminderParams: newData
                }));
            }
        };
    }

    getStartReminder2Option = () => {
        return {
            codeKey: 'value',
            nameKey: 'label',
            // dataArr: this.state.entList,
            dataArr: SentencedToEmpty(this.props, ['startReminderOptionList'], []),
            defaultCode: SentencedToEmpty(this.props
                , ['addServiceReminderParams', 'serviceReminderInfoList'
                    , 3, 'EModel']
                , ''),
            onSelectListener: item => {

                let newData = { ...this.props.addServiceReminderParams };
                let serviceReminderInfoList = SentencedToEmpty(newData, ['serviceReminderInfoList'], []);
                if (serviceReminderInfoList.length == 0) {
                    serviceReminderInfoList = this.getDailyReminder();
                }

                // 开始提醒枚举 1: 15分钟 2: 30分钟    3: 1小时 4: 2小时
                // 需要先选择 预计开始时间 
                serviceReminderInfoList[3].ReminderTime = this.getStartReminderTime(item.value);
                serviceReminderInfoList[3].EModel = item.value;
                serviceReminderInfoList[3].EModelName = item.label;
                // + " " + moment(newData.ExpectedTime).format('HH:mm');
                newData.serviceReminderInfoList = serviceReminderInfoList;
                this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                    addServiceReminderParams: newData
                }));
            }
        };
    }

    getServiceTypeOption = () => {
        return {
            codeKey: 'ServiceId',
            nameKey: 'ServiceName',
            // dataArr: this.state.entList,
            dataArr: this.props.serviceTypeList,
            defaultCode: SentencedToEmpty(this.props, ['addServiceReminderParams', 'ServiceId'], ''),
            onSelectListener: item => {
                let newData = { ...SentencedToEmpty(this.props, ['addServiceReminderParams'], {}) };
                newData.ServiceId = item.ServiceId;
                newData.ServiceName = item.ServiceName;
                this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                    addServiceReminderParams: newData
                }));
            }
        };
    }

    judgePoint = () => {
        ShowToast('您还没有选择企业');
    }

    checkExpectedTime = () => {
        ShowToast('您还没有选择预计开始时间');
    }

    cancelButton = () => { }
    confirm = () => {
        this.props.dispatch(
            createAction('CTServiceReminderModel/deleteServiceReminder')({
                callback: (res) => {
                    this.props.dispatch(
                        createAction('CTServiceReminderModel/updateState')
                            ({
                                serviceReminderListResult: { status: -1 },
                                // recordDate: moment().format('YYYY-MM-DD 01:00')
                                recordDate: moment().format('YYYY-MM-DD')
                            }));
                    this.props.dispatch(
                        createAction('CTServiceReminderModel/getServiceReminderList')
                            ({}));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    }

    render() {

        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要删除此服务提醒吗？',
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

        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <StatusPage
                    status={SentencedToEmpty(this.props, ['serviceReminderViewResult', 'status'], 1000)}
                    errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                    errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        // this.statusPageOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        // this.statusPageOnRefresh();
                    }}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH, flex: 1
                        }]}
                    >
                        <ScrollView
                            style={[{
                                width: SCREEN_WIDTH
                            }]}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 20
                                    , marginLeft: 10, marginTop: 10
                                    , borderRadius: 5, backgroundColor: '#ffffff'
                                }]}
                            >
                                {/* 0 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`合同编号`}</Text>
                                        <TouchableOpacity
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                            onPress={
                                                () => {
                                                    this.props.dispatch(NavigationActions.navigate({
                                                        routeName: 'ContractNumberLocalSearchList',
                                                        params: {}
                                                    }));
                                                }
                                            }
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['addServiceReminderParams', 'ProjectCode'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 9 */}
                                {/* 1 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业`}</Text>
                                        <TouchableOpacity
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                            onPress={
                                                () => {
                                                    this.props.dispatch(NavigationActions.navigate({
                                                        routeName: 'ContractNumberLocalSearchList',
                                                        params: {}
                                                    }));
                                                }
                                            }
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['addServiceReminderParams', 'EntName'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 1 */}
                                {/* 2 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点`}</Text>
                                        <PickerTouchable
                                            // available={this.isEdit()}
                                            // ref={ref => (this.pointS = ref)}
                                            option={this.getPointSelect()}
                                            onPress={(() => {
                                                if (SentencedToEmpty(this.props
                                                    , ['addServiceReminderParams', 'EntName'], '') == '') {
                                                    return true;
                                                }
                                            })() ? this.judgePoint : null}
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['addServiceReminderParams', 'PointName'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 2 */}
                                {/* 3 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`服务类型`}</Text>
                                        <PickerTouchable
                                            // available={this.isEdit()}
                                            // ref={ref => (this.pointS = ref)}
                                            option={this.getServiceTypeOption()}
                                            // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['addServiceReminderParams', 'ServiceName'], '')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 3 */}
                                {/* 4 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 40, marginLeft: 10
                                    }]}
                                >
                                    <FormDatePicker
                                        rightIcon={require('../../images/ic_arrows_right.png')}
                                        rightIconStyle={{ height: 15, width: 15, tintColor: '' }}
                                        editable={this.isEdit()}
                                        required={false}
                                        getPickerOption={this.getServiceStartDateOption}
                                        label={'预计开始时间'}
                                        timeString={SentencedToEmpty(this.props
                                            , ['addServiceReminderParams', 'ExpectedTime'], '请选择')}
                                    />
                                </View>
                                {/* 4 */}
                                {/* 5 */}
                                <View
                                    style={[
                                        {
                                            width: SCREEN_WIDTH,
                                            minHeight: 107,
                                            marginTop: 5,
                                            backgroundColor: 'white'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                height: 44,
                                                width: SCREEN_WIDTH,
                                                paddingHorizontal: 19,
                                                justifyContent: 'center'
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 14,
                                                    color: '#333333'
                                                }
                                            ]}
                                        >
                                            {'服务提醒说明'}
                                        </Text>
                                    </View>
                                    <TextInput
                                        editable={this.isEdit()}
                                        multiline={true}
                                        placeholder={this.isEdit() ? '请填写服务提醒说明' : '未记录服务提醒说明'}
                                        placeholderTextColor={'#999999'}
                                        style={{
                                            width: SCREEN_WIDTH - 38 + 15,
                                            marginLeft: 19,
                                            marginRight: 4,
                                            minHeight: 40,
                                            marginTop: 4,
                                            marginBottom: 15,
                                            textAlignVertical: 'top',
                                            color: '#666666',
                                            fontSize: 15
                                        }}
                                        onChangeText={text => {
                                            let newData = { ...this.props.addServiceReminderParams };
                                            newData.RemindMsg = text;
                                            this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                                                addServiceReminderParams: newData
                                            }));
                                        }}
                                    >
                                        {`${SentencedToEmpty(this.props, ['addServiceReminderParams', 'RemindMsg'], '')}`}
                                    </TextInput>
                                </View>
                                {/* 5 */}
                                {/* 6 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 40, marginLeft: 10
                                    }]}
                                >
                                    <FormDatePicker_Unselected
                                        onPress={SentencedToEmpty(this.props
                                            , ['addServiceReminderParams', 'ExpectedTime'], '') == '' ? this.checkExpectedTime : null}
                                        rightIcon={require('../../images/ic_arrows_right.png')}
                                        rightIconStyle={{ height: 15, width: 15, tintColor: '' }}
                                        editable={this.isEdit()}
                                        required={false}
                                        getPickerOption={this.getDailyReminder1Option}
                                        label={'日提醒1'}
                                        timeString={SentencedToEmpty(this.props
                                            , ['addServiceReminderParams', 'serviceReminderInfoList'
                                                , 0, 'ReminderTime'], '请选择')}
                                    />
                                </View>
                                {/* 6 */}
                                {/* 7 */}
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 40, marginLeft: 10
                                    }]}
                                >
                                    <FormDatePicker_Unselected
                                        onPress={SentencedToEmpty(this.props
                                            , ['addServiceReminderParams', 'ExpectedTime'], '') == '' ? this.checkExpectedTime : null}
                                        rightIcon={require('../../images/ic_arrows_right.png')}
                                        rightIconStyle={{ height: 15, width: 15, tintColor: '' }}
                                        editable={this.isEdit()}
                                        required={false}
                                        getPickerOption={this.getDailyReminder2Option}
                                        label={'日提醒2'}
                                        timeString={SentencedToEmpty(this.props
                                            , ['addServiceReminderParams', 'serviceReminderInfoList'
                                                , 1, 'ReminderTime'], '请选择')}
                                    />
                                </View>
                                {/* 7 */}
                                {/* 8 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`开始提醒1：`}</Text>
                                        <PickerTouchable
                                            // available={this.isEdit()}
                                            // ref={ref => (this.pointS = ref)}
                                            option={this.getStartReminder1Option()}
                                            // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                            onPress={SentencedToEmpty(this.props
                                                , ['addServiceReminderParams', 'ExpectedTime'], '') == '' ? this.checkExpectedTime : null}
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{
                                                    fontSize: 14,
                                                    color: globalcolor.datepickerGreyText,
                                                    flex: 1,
                                                    textAlign: 'right'
                                                }]}>{`${SentencedToEmpty(this.props
                                                    , ['addServiceReminderParams', 'serviceReminderInfoList'
                                                        , 2, 'EModelName']
                                                    , '请选择')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15, marginLeft: 16 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 8 */}
                                {/* 9 */}
                                <View style={[{
                                    height: 45, width: SCREEN_WIDTH - 40
                                    , paddingHorizontal: 10, justifyContent: 'center'
                                }]}>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , flexDirection: 'row', alignItems: 'center'
                                        }]}
                                    >
                                        {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`开始提醒2：`}</Text>
                                        <PickerTouchable
                                            // available={this.isEdit()}
                                            // ref={ref => (this.pointS = ref)}
                                            option={this.getStartReminder2Option()}
                                            // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                            onPress={SentencedToEmpty(this.props
                                                , ['addServiceReminderParams', 'ExpectedTime'], '') == '' ? this.checkExpectedTime : null}
                                            style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                            }]}
                                        >
                                            <View style={[{
                                                flex: 1, height: 44
                                                , flexDirection: 'row'
                                                , justifyContent: 'flex-end', alignItems: 'center'
                                            }]}>
                                                <Text style={[{
                                                    fontSize: 14,
                                                    color: globalcolor.datepickerGreyText,
                                                    flex: 1,
                                                    textAlign: 'right'
                                                }]}>{`${SentencedToEmpty(this.props
                                                    , ['addServiceReminderParams', 'serviceReminderInfoList'
                                                        , 3, 'EModelName']
                                                    , '请选择')}`}</Text>
                                                <Image
                                                    style={[{ height: 15, width: 15, marginLeft: 16 }]}
                                                    source={require('../../images/ic_arrows_right.png')} />
                                            </View>
                                        </PickerTouchable>
                                    </View>
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 40
                                            , height: 1, backgroundColor: '#EAEAEA'
                                        }]}
                                    />
                                </View>
                                {/* 9 */}
                            </View>
                        </ScrollView>
                        {
                            SentencedToEmpty(this.props
                                , ['addServiceReminderParams', 'ID'], ''
                            ) == ''
                                ? <TouchableOpacity
                                    style={[{
                                        marginLeft: 40, marginVertical: 24
                                    }]}
                                    onPress={() => {
                                        console.log('addServiceReminderParams = ', this.props.addServiceReminderParams);
                                        const data = { ...this.props.addServiceReminderParams };
                                        if (SentencedToEmpty(data, ['ProjectID'], '') == '') {
                                            ShowToast('合同编号不能为空');
                                            return;
                                        }
                                        if (SentencedToEmpty(data, ['PointId'], '') == '') {
                                            ShowToast('监测点不能为空');
                                            return;
                                        }
                                        if (SentencedToEmpty(data, ['ServiceId'], '') == '') {
                                            ShowToast('服务类型不能为空');
                                            return;
                                        }
                                        if (SentencedToEmpty(data, ['ExpectedTime'], '') == '') {
                                            ShowToast('预计开始时间不能为空');
                                            return;
                                        }
                                        if (SentencedToEmpty(data, ['ExpectedTime'], '') == '') {
                                            ShowToast('预计开始时间不能为空');
                                            return;
                                        }
                                        if (!moment().add(30, 'minutes').isBefore(moment(data.ExpectedTime))) {
                                            ShowToast('至少提前30分钟创建提醒');
                                            return;
                                        }
                                        const serviceReminderInfoList = SentencedToEmpty(data, ['serviceReminderInfoList'], []);
                                        let newInfoList = [];
                                        let checkReminderTime = '';
                                        let checkTime = '';
                                        serviceReminderInfoList.map((item, index) => {
                                            if (item.MType == 1) {
                                                // 日提醒1
                                                if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                    checkReminderTime = item.ReminderTime;
                                                    checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                    // 需要先选择 预计开始时间 
                                                    if (moment(checkTime)
                                                        .isBefore(moment(data.ExpectedTime))) {
                                                        newInfoList.push({
                                                            'MType': 1,
                                                            'ReminderTime': checkTime,
                                                        });
                                                    }
                                                }
                                            }
                                            if (item.MType == 2) {
                                                // 日提醒2
                                                if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                    checkReminderTime = item.ReminderTime;
                                                    checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                    // 需要先选择 预计开始时间 
                                                    if (moment(checkTime)
                                                        .isBefore(moment(data.ExpectedTime))) {
                                                        newInfoList.push({
                                                            'MType': 2,
                                                            'ReminderTime': checkTime,
                                                        });
                                                    }
                                                }
                                            }
                                            if (item.MType == 3) {
                                                // 开始提醒1
                                                if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                    checkReminderTime = item.ReminderTime;
                                                    // checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                    // 需要先选择 预计开始时间 
                                                    if (moment()
                                                        .isBefore(moment(checkReminderTime))) {
                                                        newInfoList.push({
                                                            'MType': 3,
                                                            'ReminderTime': checkReminderTime,
                                                            'EModel': item.EModel
                                                        });
                                                    }
                                                }
                                            }
                                            if (item.MType == 4) {
                                                // 开始提醒2
                                                if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                    checkReminderTime = item.ReminderTime;
                                                    // checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                    // 需要先选择 预计开始时间 
                                                    if (moment()
                                                        .isBefore(moment(checkReminderTime))) {
                                                        newInfoList.push({
                                                            'MType': 4,
                                                            'ReminderTime': checkReminderTime,
                                                            'EModel': item.EModel
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                        if (newInfoList.length <= 0) {
                                            ShowToast('至少选择一个提醒时间');
                                            return;
                                        }
                                        data.serviceReminderInfoList = newInfoList;
                                        console.log('data = ', data);
                                        this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                                            addServiceReminderParams: data
                                        }));
                                        this.props.dispatch(createAction('CTServiceReminderModel/addServiceReminder')({
                                            callback: () => {
                                                this.props.dispatch(
                                                    createAction('CTServiceReminderModel/updateState')
                                                        ({
                                                            serviceReminderListResult: { status: -1 },
                                                            // recordDate: moment().format('YYYY-MM-DD 01:00')
                                                            recordDate: moment().format('YYYY-MM-DD')
                                                        }));
                                                this.props.dispatch(
                                                    createAction('CTServiceReminderModel/getServiceReminderList')
                                                        ({}));
                                                this.props.dispatch(NavigationActions.back());
                                            }
                                        }))
                                    }}
                                >
                                    <View
                                        style={[{
                                            width: SCREEN_WIDTH - 80, height: 44
                                            , justifyContent: 'center', alignItems: 'center'
                                            , backgroundColor: '#4AA0FF'
                                        }]}
                                    >
                                        <Text
                                            style={[{
                                                color: '#ffffff', fontSize: 17
                                            }]}
                                        >{'确定'}</Text>
                                    </View>
                                </TouchableOpacity>
                                : <View
                                    style={[{
                                        width: SCREEN_WIDTH, height: 92
                                        , flexDirection: 'row', alignItems: 'center'
                                        , justifyContent: 'space-around'
                                    }]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.doAlert.show();
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: SCREEN_WIDTH * 2 / 5, height: 44
                                                , justifyContent: 'center', alignItems: 'center'
                                                , backgroundColor: '#E6E6E6'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    color: '#666666', fontSize: 17
                                                }]}
                                            >{'删除'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            console.log('addServiceReminderParams = ', this.props.addServiceReminderParams);
                                            const data = { ...this.props.addServiceReminderParams };
                                            if (SentencedToEmpty(data, ['ProjectID'], '') == '') {
                                                ShowToast('合同编号不能为空');
                                                return;
                                            }
                                            if (SentencedToEmpty(data, ['PointId'], '') == '') {
                                                ShowToast('监测点不能为空');
                                                return;
                                            }
                                            if (SentencedToEmpty(data, ['ServiceId'], '') == '') {
                                                ShowToast('服务类型不能为空');
                                                return;
                                            }
                                            if (SentencedToEmpty(data, ['ExpectedTime'], '') == '') {
                                                ShowToast('预计开始时间不能为空');
                                                return;
                                            }
                                            if (SentencedToEmpty(data, ['ExpectedTime'], '') == '') {
                                                ShowToast('预计开始时间不能为空');
                                                return;
                                            }
                                            if (!moment().add(30, 'minutes').isBefore(moment(data.ExpectedTime))) {
                                                ShowToast('至少提前30分钟创建提醒');
                                                return;
                                            }
                                            const serviceReminderInfoList = SentencedToEmpty(data, ['serviceReminderInfoList'], []);
                                            let newInfoList = [];
                                            let checkReminderTime = '';
                                            let checkTime = '';
                                            serviceReminderInfoList.map((item, index) => {
                                                if (item.MType == 1) {
                                                    // 日提醒1
                                                    if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                        checkReminderTime = item.ReminderTime;
                                                        checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                        // 需要先选择 预计开始时间 
                                                        if (moment(checkTime)
                                                            .isBefore(moment(data.ExpectedTime))) {
                                                            newInfoList.push({
                                                                'MType': 1,
                                                                'ReminderTime': checkTime,
                                                            });
                                                        }
                                                    }
                                                }
                                                if (item.MType == 2) {
                                                    // 日提醒2
                                                    if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                        checkReminderTime = item.ReminderTime;
                                                        checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                        // 需要先选择 预计开始时间 
                                                        if (moment(checkTime)
                                                            .isBefore(moment(data.ExpectedTime))) {
                                                            newInfoList.push({
                                                                'MType': 2,
                                                                'ReminderTime': checkTime,
                                                            });
                                                        }
                                                    }
                                                }
                                                if (item.MType == 3) {
                                                    // 开始提醒1
                                                    if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                        checkReminderTime = item.ReminderTime;
                                                        // checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                        // 需要先选择 预计开始时间 
                                                        if (moment()
                                                            .isBefore(moment(checkReminderTime))) {
                                                            newInfoList.push({
                                                                'MType': 3,
                                                                'ReminderTime': checkReminderTime,
                                                                'EModel': item.EModel
                                                            });
                                                        }
                                                    }
                                                }
                                                if (item.MType == 4) {
                                                    // 开始提醒2
                                                    if (SentencedToEmpty(item, ['ReminderTime'], '') != '') {
                                                        checkReminderTime = item.ReminderTime;
                                                        // checkTime = moment(checkReminderTime).format('YYYY-MM-DD') + ' ' + moment(data.ExpectedTime).format('HH:mm');
                                                        // 需要先选择 预计开始时间 
                                                        if (moment()
                                                            .isBefore(moment(checkReminderTime))) {
                                                            newInfoList.push({
                                                                'MType': 4,
                                                                'ReminderTime': checkReminderTime,
                                                                'EModel': item.EModel
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                            if (newInfoList.length <= 0) {
                                                ShowToast('至少选择一个提醒时间');
                                                return;
                                            }
                                            data.serviceReminderInfoList = newInfoList;
                                            console.log('data = ', data);
                                            this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                                                addServiceReminderParams: data
                                            }));
                                            this.props.dispatch(createAction('CTServiceReminderModel/addServiceReminder')({
                                                callback: () => {
                                                    this.props.dispatch(
                                                        createAction('CTServiceReminderModel/updateState')
                                                            ({
                                                                serviceReminderListResult: { status: -1 },
                                                                // recordDate: moment().format('YYYY-MM-DD 01:00')
                                                                recordDate: moment().format('YYYY-MM-DD')
                                                            }));
                                                    this.props.dispatch(
                                                        createAction('CTServiceReminderModel/getServiceReminderList')
                                                            ({}));
                                                    this.props.dispatch(NavigationActions.back());
                                                }
                                            }))
                                        }}
                                    >
                                        <View
                                            style={[{
                                                width: SCREEN_WIDTH * 2 / 5, height: 44
                                                , justifyContent: 'center', alignItems: 'center'
                                                , backgroundColor: '#4AA0FF'
                                            }]}
                                        >
                                            <Text
                                                style={[{
                                                    color: '#ffffff', fontSize: 17
                                                }]}
                                            >{'确定'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                        }

                        {this.props.addServiceReminderResult.status == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                        {this.props.deleteServiceReminderResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
                        <AlertDialog options={alertOptions} ref="doAlert" />
                    </View >
                </StatusPage >
            </View>
        )
    }
}