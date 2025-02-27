/*
 * @Description: 质控记录列表
 * @LastEditors: hxf
 * @Date: 2020-12-03 10:03:16
 * @LastEditTime: 2025-02-13 14:02:38
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/qualityControl/QualityControlRecordList.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux';
import moment from 'moment';

import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { StatusPage, FlatListWithHeaderAndFooter, Touchable, SDLText } from '../../components'
import AnyValueWheelPicker from '../../components/SDLPicker/component/AnyValueWheelPicker';

const barHeight = 44;

const pollutantList = [
    { PollutantName: "SO2", PollutantCode: "02" },
    { PollutantName: "NOx", PollutantCode: "03" },
    { PollutantName: "O2", PollutantCode: "s01" },
];

const checkTypeList = [
    { label: '全部核查', value: 'all' },
    { label: '零点核查', value: '3101' },
    { label: '零点漂移', value: '3101_py' },
    { label: '量程核查', value: '3102' },
    { label: '量程漂移', value: '3102_py' },
    { label: '盲样核查', value: '3105' },
    { label: '响应时间', value: '3103' },
    { label: '线性核查', value: '3104' },
];
let a = ['3101', '3101_py', '3102', '3102_py', '3105', '3103', '3104'];

@connect(({ qualityControl, pointDetails }) => ({
    QCAResultRecordTotal: qualityControl.QCAResultRecordTotal,
    QCAResultRecordResult: qualityControl.QCAResultRecordResult,
    QCAResultRecordData: qualityControl.QCAResultRecordData,
    // PollantCodes: pointDetails.PollantCodes,
    CNTypeList: qualityControl.CNTypeList,
    CNPollutantCodeList: qualityControl.CNPollutantCodeList,
    CNTypeObjectList: qualityControl.CNTypeObjectList,// 存储 选择器 核查类型选中实体
    CNPollutantCodeObjectList: qualityControl.CNPollutantCodeObjectList,// 存储 选择器 污染物类型选中实体
    CNTypeLabelString: qualityControl.CNTypeLabelString,// 存储 选择器 label 文字
    QCAResultRecordTime: qualityControl.QCAResultRecordTime// 存储 选择器 时间
}))
export default class QualityControlRecordList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '核查记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        let datePicker = [];
        let date = moment().date(1);
        datePicker.push({ label: '全部时间', value: 'all' });
        while (date.isAfter('2019-12-31', 'date')) {
            datePicker.push({ label: date.format('YYYY.MM'), value: date.format('YYYY-MM-DD 00:00:00') });
            date.subtract(1, 'months');
        }
        this.state = {
            layoutHeight: 0,
            showFilter: false,
            pickerType: 'checkType', // checkType 核查picker time  核查时间
            datePickerData: datePicker, // 时间选择器 数据
        }
    }

    componentDidMount() {
        // 进入此页面前清空过滤条件
        this.props.dispatch(createAction('qualityControl/updateState')({ CNTypeList: [], CNPollutantCodeList: [], CNTypeObjectList: [], CNPollutantCodeObjectList: [], CNTypeLabelString: '全部核查', QCAResultRecordTime: { label: '全部时间', value: 'all' } }))
        // this.props.dispatch(createAction('qualityControl/test')({}));
        this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordIndex: 1, verifyTotal: 0, QCAResultRecordResult: { status: -1 } }));
        this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
        // this.props.dispatch(createAction('pointDetails/getPollantCodes')({ params: { DGIMNs: this.props.navigation.state.params.DGIMN }, callBack: this.callBack }));
    }

    callBack(isSuc, pollArr) {
        if (isSuc == true && pollArr.length > 0) {
            // this.onChange(0);
        } else if (isSuc == true && pollArr.length == 0) {
            ShowToast('该站点暂未配置污染因子');
        } else {
            ShowToast('获取污染因子失败，请退出重试');
        }
    }

    onRefresh = index => {
        this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordIndex: index, verifyTotal: 0 }));
        this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordIndex: 1, verifyTotal: 0, QCAResultRecordResult: { status: -1 } }));
        this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
    };

    _onItemClick = (item) => {
        this.props.dispatch(createAction('qualityControl/updateState')({ currentResult: item.Result }));

        this.props.dispatch(NavigationActions.navigate({
            routeName: 'QualityControlRecordDetail',
            params: {
                item
            }
        }));
    }

    measureContent = (params) => {
        let target = params.target;
        let { x, y, width, height } = params.nativeEvent.layout;
        if (params.name == 'layout') {
            this.setState({ layoutHeight: height });
        }
    }

    render() {
        const codeKey = 'value';
        const nameKey = 'label';
        return (
            <View onLayout={(x) => { this.measureContent({ ...x, ...{ name: 'layout' } }) }} style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <View style={[{ flexDirection: 'row', height: barHeight, width: SCREEN_WIDTH, backgroundColor: 'white', borderBottomColor: '#f2f2f2', borderBottomWidth: 1 }]}>
                    <Touchable
                        onPress={() => {
                            if (this.state.pickerType == 'time' && this.state.showFilter) {
                                this.setState({ pickerType: 'checkType' });
                            } else {
                                this.setState({ showFilter: !this.state.showFilter, pickerType: 'checkType' });
                            }
                        }}
                        style={[{ flex: 1, height: barHeight, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText numberOfLines={1} ellipsizeMode={'middle'} style={[{ maxWidth: SCREEN_WIDTH / 5, fontSize: 14, color: this.state.pickerType == 'checkType' && this.state.showFilter ? '#4aa0ff' : '#333333' }]}>{SentencedToEmpty(this.props, ['CNTypeLabelString'], '全部核查')}</SDLText>
                            <Image style={[{ height: 14, width: 14, tintColor: this.state.pickerType == 'checkType' && this.state.showFilter ? '#4aa0ff' : '#666666', transform: [{ rotateZ: this.state.pickerType == 'checkType' && this.state.showFilter ? '180deg' : '0deg' }] }]} source={require('../../images/down.png')} />
                        </View>
                    </Touchable>
                    <Touchable
                        onPress={() => {
                            if (this.state.pickerType == 'checkType' && this.state.showFilter) {
                                this.setState({ pickerType: 'time' });
                            } else {
                                this.setState({ showFilter: !this.state.showFilter, pickerType: 'time' });
                            }
                        }}
                        style={[{ flex: 1, height: barHeight, justifyContent: 'center', alignItems: 'center' }]}>
                        <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText style={[{ fontSize: 14, color: this.state.pickerType == 'time' && this.state.showFilter ? '#4aa0ff' : '#333333' }]}>{SentencedToEmpty(this.props, ['QCAResultRecordTime', 'label'], '全部时间')}</SDLText>
                            <Image style={[{ height: 14, width: 14, tintColor: this.state.pickerType == 'time' && this.state.showFilter ? '#4aa0ff' : '#666666', transform: [{ rotateZ: this.state.pickerType == 'time' && this.state.showFilter ? '180deg' : '0deg' }] }]} source={require('../../images/down.png')} />
                        </View>
                    </Touchable>
                </View>
                {this.state.showFilter ? <View style={[{
                    height: this.state.layoutHeight - barHeight, width: SCREEN_WIDTH, position: 'absolute', top: 44, zIndex: 99
                }]}>
                    {this.state.pickerType == 'checkType' ?
                        <View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', alignItems: 'center' }]}>
                            <View style={[{ height: 48, width: SCREEN_WIDTH - 40, justifyContent: 'center' }]}>
                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{'核查'}</SDLText>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 30, flexWrap: 'wrap', flexDirection: 'row' }]}>
                                {checkTypeList.map((item, key) => {
                                    let selectedIndex = this.props.CNTypeList.findIndex((findItem) => {
                                        if (findItem == item.value) {
                                            return true;
                                        }
                                    });
                                    return <View key={`checkType${key}`} style={[{ width: (SCREEN_WIDTH - 32) / 4, alignItems: 'center' }]}>
                                        <Touchable onPress={() => {
                                            if (item.value == 'all') {
                                                this.props.dispatch(createAction('qualityControl/updateState')({ CNTypeList: [], CNPollutantCodeList: [], CNTypeObjectList: [], CNPollutantCodeObjectList: [], CNTypeLabelString: '全部核查' }))
                                            } else {
                                                let newData = [].concat(this.props.CNTypeList);
                                                let newObjectData = [].concat(this.props.CNTypeObjectList);
                                                let findIndex = newData.findIndex((findItem) => {
                                                    if (findItem == item.value) {
                                                        return true;
                                                    }
                                                });
                                                if (findIndex != -1) {
                                                    newData.splice(findIndex, 1);
                                                    newObjectData.splice(findIndex, 1);
                                                } else {
                                                    newData.push(item.value);
                                                    newObjectData.push(item);
                                                }
                                                let label = '';
                                                const { CNPollutantCodeObjectList } = this.props;
                                                if (newObjectData.length == 0 && CNPollutantCodeObjectList.length == 0) {
                                                    label = '全部核查';
                                                } else {
                                                    newObjectData.map(item => {
                                                        if (label == '') {
                                                            label = item.label;
                                                        } else {
                                                            label = label + '、' + item.label;
                                                        }
                                                    })
                                                    CNPollutantCodeObjectList.map(item => {
                                                        if (label == '') {
                                                            label = item.PollutantName;
                                                        } else {
                                                            label = label + '、' + item.PollutantName;
                                                        }
                                                    })
                                                }
                                                this.props.dispatch(createAction('qualityControl/updateState')({ CNTypeList: newData, CNTypeObjectList: newObjectData, CNTypeLabelString: label }));
                                            }
                                        }} style={[{ backgroundColor: selectedIndex != -1 || (item.value == 'all' && this.props.CNTypeList.length == 0 && this.props.CNPollutantCodeList.length == 0) ? '#4aa0ff' : '#f6f6f6', width: 77, height: 24, marginBottom: 12, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                            <SDLText style={[{ color: selectedIndex != -1 || (item.value == 'all' && this.props.CNTypeList.length == 0 && this.props.CNPollutantCodeList.length == 0) ? 'white' : '#666666', fontSize: 12 }]}>{SentencedToEmpty(item, ['label'], '--')}</SDLText>
                                        </Touchable>
                                    </View>
                                })}
                            </View>
                            <View style={[{ marginTop: 6, width: SCREEN_WIDTH - 30, height: 1, backgroundColor: '#d9d9d9' }]}></View>
                            <View style={[{ height: 48, width: SCREEN_WIDTH - 40, justifyContent: 'center' }]}>
                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{'污染物'}</SDLText>
                            </View>
                            <View style={[{ width: SCREEN_WIDTH - 30, flexWrap: 'wrap', flexDirection: 'row' }]}>
                                {pollutantList.map((item, key) => {
                                    let selectedIndex = this.props.CNPollutantCodeList.findIndex((findItem) => {
                                        if (findItem == item.PollutantCode) {
                                            return true;
                                        }
                                    });
                                    return <View key={`pollutant${key}`} style={[{ width: (SCREEN_WIDTH - 32) / 4, alignItems: 'center' }]}>
                                        <Touchable onPress={() => {
                                            let newData = [].concat(this.props.CNPollutantCodeList);
                                            let newObjectData = [].concat(this.props.CNPollutantCodeObjectList);
                                            let findIndex = newData.findIndex((findItem) => {
                                                if (findItem == item.PollutantCode) {
                                                    return true;
                                                }
                                            });
                                            if (findIndex != -1) {
                                                newData.splice(findIndex, 1);
                                                newObjectData.splice(findIndex, 1);
                                            } else {
                                                newData.push(item.PollutantCode);
                                                newObjectData.push(item);
                                            }
                                            let label = '';
                                            const { CNTypeObjectList } = this.props;
                                            if (newObjectData.length == 0 && CNTypeObjectList.length == 0) {
                                                label = '全部核查';
                                            } else {
                                                CNTypeObjectList.map(item => {
                                                    if (label == '') {
                                                        label = item.label;
                                                    } else {
                                                        label = label + '、' + item.label;
                                                    }
                                                })
                                                newObjectData.map(item => {
                                                    if (label == '') {
                                                        label = item.PollutantName;
                                                    } else {
                                                        label = label + '、' + item.PollutantName;
                                                    }
                                                })
                                            }
                                            this.props.dispatch(createAction('qualityControl/updateState')({ CNPollutantCodeList: newData, CNPollutantCodeObjectList: newObjectData, CNTypeLabelString: label }));
                                        }} style={[{ backgroundColor: selectedIndex != -1 ? '#4aa0ff' : '#f6f6f6', width: 77, height: 24, marginBottom: 12, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                            <SDLText style={[{ color: selectedIndex != -1 ? 'white' : '#666666', fontSize: 12 }]}>{SentencedToEmpty(item, ['PollutantName'], '--')}</SDLText>
                                        </Touchable>
                                    </View>
                                })}
                            </View>
                            <View style={[{ marginTop: 6, width: SCREEN_WIDTH - 30, height: 1, }]}></View>
                            <View style={[{ width: SCREEN_WIDTH, height: 44, flexDirection: 'row', borderTopColor: '#d9d9d9', borderTopWidth: 1 }]}>
                                <Touchable
                                    onPress={() => {
                                        this.props.dispatch(createAction('qualityControl/updateState')({ CNTypeList: [], CNPollutantCodeList: [], CNTypeObjectList: [], CNPollutantCodeObjectList: [], CNTypeLabelString: '全部核查', QCAResultRecordIndex: 1, verifyTotal: 0, QCAResultRecordResult: { status: -1 } }));
                                        this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
                                        this.setState({ showFilter: false });
                                    }}
                                    style={[{ backgroundColor: 'white', flex: 1, height: 44, justifyContent: 'center', alignItems: 'center' }]}>
                                    <SDLText style={[{ fontSize: 15, color: '#666666' }]}>{'清除筛选'}</SDLText>
                                </Touchable>
                                <Touchable onPress={() => {
                                    this.statusPageOnRefresh();
                                    // this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
                                    this.setState({ showFilter: false });
                                }} style={[{ backgroundColor: '#4aa0ff', flex: 1, height: 44, justifyContent: 'center', alignItems: 'center' }]}>
                                    <SDLText style={[{ fontSize: 15, color: 'white' }]}>{'确定'}</SDLText>
                                </Touchable>
                            </View>
                        </View>
                        : <View style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', alignItems: 'center' }]}>
                            <AnyValueWheelPicker
                                pickerType={'anyValue'}
                                callbackFun={(result, index) => {
                                    this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordTime: result }));
                                }}
                                defaultValue={this.props.QCAResultRecordTime.value}
                                dataArray={this.state.datePickerData}
                                defaultIndexFun={(dataArray, value) => {
                                    return dataArray.findIndex((item, index) => {
                                        if (value && item[codeKey] == value) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                }}
                                getShowValue={item => {
                                    return item[nameKey];
                                }}
                            />
                            <View style={[{ width: SCREEN_WIDTH, height: 44, flexDirection: 'row', borderTopColor: '#d9d9d9', borderTopWidth: 1 }]}>
                                <Touchable
                                    onPress={() => {
                                        this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordTime: { label: '全部时间', value: 'all' }, QCAResultRecordIndex: 1, verifyTotal: 0, QCAResultRecordResult: { status: -1 } }));
                                        this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
                                        this.setState({ showFilter: false });
                                    }}
                                    style={[{ backgroundColor: 'white', flex: 1, height: 44, justifyContent: 'center', alignItems: 'center' }]}>
                                    <SDLText style={[{ fontSize: 15, color: '#666666' }]}>{'清除筛选'}</SDLText>
                                </Touchable>
                                <Touchable onPress={() => {
                                    this.statusPageOnRefresh();
                                    // this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
                                    this.setState({ showFilter: false });
                                }} style={[{ backgroundColor: '#4aa0ff', flex: 1, height: 44, justifyContent: 'center', alignItems: 'center' }]}>
                                    <SDLText style={[{ fontSize: 15, color: 'white' }]}>{'确定'}</SDLText>
                                </Touchable>
                            </View>
                        </View>
                    }

                    <TouchableWithoutFeedback style={[{
                        width: SCREEN_WIDTH, flex: 1
                    }]} onPress={() => {
                        this.setState({ showFilter: false });
                        this.statusPageOnRefresh();
                        // this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({}));
                    }}>
                        <View style={[{
                            width: SCREEN_WIDTH, flex: 1, backgroundColor: "#383838",
                            opacity: 0.8,
                        }]}></View>
                    </TouchableWithoutFeedback>
                </View> : (null)}
                <StatusPage
                    status={SentencedToEmpty(this.props.QCAResultRecordResult, ['status'], 1000)}
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
                    <View style={[styles.container,]}>
                        <FlatListWithHeaderAndFooter
                            ItemSeparatorComponent={() => {
                                return <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />;
                            }}
                            ref={ref => (this.list = ref)}
                            pageSize={20}
                            hasMore={() => {
                                return this.props.QCAResultRecordData.length < this.props.QCAResultRecordTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('qualityControl/updateState')({ QCAResultRecordIndex: index }));
                                this.props.dispatch(createAction('qualityControl/getQCAResultRecord')({ setListData: this.list.setListData }));
                            }}
                            renderItem={({ item, index }) => {
                                let time = SentencedToEmpty(item, ['MonitorTime'], '-');
                                let timeStr = '--/-- --:--'
                                if (time != '-') {
                                    timeStr = moment(time).format('MM/DD HH:mm');
                                }
                                let statusStr = '---';
                                let statusColor = '#696969'
                                // 0合格  1不合格  2无效
                                switch (item.Result) {
                                    case -1:
                                        statusStr = '---';
                                        statusColor = '#696969'
                                        break;
                                    case 0:
                                    case '0':
                                    case '合格':
                                        statusStr = '合格';
                                        statusColor = '#55c995'
                                        break;
                                    case 1:
                                    case '不合格':
                                        statusStr = '不合格';
                                        statusColor = '#ff5a5a'
                                        break;
                                    case 2:
                                    case '无效':
                                        statusStr = '无效';
                                        statusColor = '#696969'
                                        break;
                                }
                                //WorkMode 1 定时    hd 现场3 ; rd 远程 2
                                let workModeStr = '';
                                switch (item.WorkMode) {
                                    case 2:
                                        workModeStr = 'rd';
                                        break;
                                    case 3:
                                        workModeStr = 'hd';
                                        break;
                                    case 1:
                                    default:
                                        workModeStr = '';
                                        break;
                                }

                                /**
                                 *  case "3104":qcaName = "线性核查";
                                    case "3102":qcaName = "量程核查";
                                    case "3103":qcaName = "响应时间核查";
                                    case "3105":qcaName = "盲样核查";
                                    case "3101":qcaName = "零点核查";
                                    case "3106":qcaName = "示值误差核查";
                                 */
                                const checkTypeList = [
                                    // { label: '全部核查', value: 'all' },
                                    // { label: '零点核查', value: '3101' },
                                    // { label: '零点漂移', value: '3101_py' },
                                    // { label: '量程核查', value: '3102' },
                                    // { label: '量程漂移', value: '3102_py' },
                                    // { label: '盲样核查', value: '3105' },
                                    // { label: '响应时间', value: '3103' },
                                    // { label: '线性核查', value: '3104' },
                                    { label: '全部核查', value: 'all' },
                                    { label: '零点核查', value: '3101' },
                                    { label: '量程核查', value: '3102' },
                                    { label: '盲样核查', value: '3105' },
                                    { label: '响应时间', value: '3103' },
                                    { label: '线性核查', value: '3104' },
                                ];
                                let labelStr = '----';
                                let imageId = require('../../images/ic_default_circle.png');
                                // switch (item.CN) {
                                switch (item.QCAType) {
                                    case '3101':
                                    case 3101:
                                        labelStr = '零点核查';
                                        imageId = require('../../images/ic_lingdian_hecha.png');
                                        break;
                                    case '3101_py':
                                        labelStr = '零点漂移';
                                        imageId = require('../../images/ic_lingdianpiaoyi_hecha.png');
                                        break;
                                    case '3102':
                                    case 3102:
                                        labelStr = '量程核查';
                                        imageId = require('../../images/ic_liangcheng_hecha.png');
                                        break;
                                    case '3102_py':
                                        labelStr = '量程漂移';
                                        imageId = require('../../images/ic_liangchengpiaoyi_hecha.png');
                                        break;
                                    case '3105':
                                    case 3105:
                                        labelStr = '盲样核查';
                                        imageId = require('../../images/ic_mangyang_hecha.png');
                                        break;
                                    case '3103':
                                    case 3103:
                                        labelStr = '响应时间';
                                        imageId = require('../../images/ic_xiangyingshijian_hecha.png');
                                        break;
                                    case '3104':
                                    case 3104:
                                        labelStr = '线性核查';
                                        imageId = require('../../images/ic_xianxing_hecha.png');
                                        break;
                                    default:
                                        imageId = require('../../images/ic_del_helper.png');
                                        break;
                                }
                                labelStr = item.QCATypeName;
                                if (index == 0 || (index > 0 && moment(item.Time).month() != moment(this.props.QCAResultRecordData[index - 1].Time).month())) {
                                    return (
                                        <Touchable
                                            style={[{ height: 95, backgroundColor: '#fff' }]}
                                            onPress={() => this._onItemClick(item)}>
                                            <View style={[{ height: 24, width: SCREEN_WIDTH, paddingHorizontal: 13, justifyContent: 'center', backgroundColor: '#f2f2f2' }]}>
                                                <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{moment(item.Time).format('YYYY/MM')}</SDLText>
                                            </View>
                                            <View style={[{ height: 70, width: SCREEN_WIDTH, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }]}>
                                                <Image source={imageId} style={[{ height: 32, width: 32, borderRadius: 16, backgroundColor: '#bbd1e4', marginRight: 17 }]} />
                                                <View style={[{ flex: 1 }]}>
                                                    <SDLText style={[{ fontSize: 15, color: '#333333' }]}>{`${item.PollutantName} ${labelStr}  ${workModeStr}`}</SDLText>
                                                    <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{timeStr}</SDLText>
                                                </View>
                                                <View style={[{ height: 22, minWidth: 48, borderRadius: 11, backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center' }]}>
                                                    <SDLText style={[{ color: 'white', fontSize: 13 }]}>{statusStr}</SDLText>
                                                </View>
                                            </View>
                                            <View style={[{ width: SCREEN_WIDTH - 26, marginLeft: 13, height: 1, borderBottomColor: '#d9d9d9', borderBottomWidth: 0.5 }]}></View>
                                        </Touchable>
                                    );
                                } else {
                                    return (
                                        <Touchable
                                            style={[{ height: 71, backgroundColor: '#fff' }]}
                                            onPress={() => this._onItemClick(item)}>
                                            <View style={[{ height: 70, width: SCREEN_WIDTH, paddingHorizontal: 20, alignItems: 'center', flexDirection: 'row' }]}>
                                                <Image source={imageId} style={[{ height: 32, width: 32, borderRadius: 16, backgroundColor: '#bbd1e4', marginRight: 17 }]} />
                                                <View style={[{ flex: 1 }]}>
                                                    <SDLText style={[{ fontSize: 15, color: '#333333' }]}>{`${item.PollutantName} ${labelStr}  ${workModeStr}`}</SDLText>
                                                    <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{timeStr}</SDLText>
                                                </View>
                                                <View style={[{ height: 22, minWidth: 48, borderRadius: 11, backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center' }]}>
                                                    <SDLText style={[{ color: 'white', fontSize: 13 }]}>{statusStr}</SDLText>
                                                </View>
                                            </View>
                                            <View style={[{ width: SCREEN_WIDTH - 26, marginLeft: 13, height: 1, borderBottomColor: '#d9d9d9', borderBottomWidth: 0.5 }]}></View>
                                        </Touchable>
                                    );
                                }
                            }}
                            data={this.props.QCAResultRecordData}
                        />
                    </View>
                </StatusPage>
            </View>
        )
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }
});