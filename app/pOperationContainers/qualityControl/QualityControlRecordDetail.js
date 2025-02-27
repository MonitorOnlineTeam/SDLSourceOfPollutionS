/*
 * @Description: 质控记录详情
 * @LastEditors: hxf
 * @Date: 2020-12-09 09:46:18
 * @LastEditTime: 2025-02-13 14:06:27
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/qualityControl/QualityControlRecordDetail.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import Echarts from 'native-echarts';

import { SCREEN_WIDTH } from '../../config/globalsize';
import globalcolor from '../../config/globalcolor';
import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty, ShowToast } from '../../utils';
import { StatusPage, FlatListWithHeaderAndFooter, Touchable, SDLText } from '../../components'

const checkTypeList = [
    { label: '零点核查', value: '3101' },
    { label: '零点漂移', value: '3101_py' },
    { label: '量程核查', value: '3102' },
    { label: '量程漂移', value: '3102_py' },
    { label: '盲样核查', value: '3105' },
    { label: '响应时间', value: '3103' },
    { label: '线性核查', value: '3104' },
];
let a = ['3101', '3101_py', '3102', '3102_py', '3105']
// 
const pollutantList = [
    { PollutantName: "SO2", PollutantCode: "02" },
    { PollutantName: "NOx", PollutantCode: "03" },
    { PollutantName: "O2", PollutantCode: "s01" },
];
@connect(({ qualityControl }) => ({
    QCAResultInfoResult: qualityControl.QCAResultInfoResult,
    currentEntName: qualityControl.currentEntName,
    currentPointName: qualityControl.currentPointName,
    currentResult: qualityControl.currentResult,
}))
export default class QualityControlRecordDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        let title = SentencedToEmpty(navigation, ['state', 'params', 'title'], '核查记录详情');
        return createNavigationOptions({
            title: title,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            chartOption: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    padding: 32,
                    data: ['测量浓度', '配比标气浓度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '测量浓度',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '配比标气浓度',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                ]
            }
        };
    }


    componentDidMount() {
        const info = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(createAction('qualityControl/updateState')({
            QCAResultInfoResult: {
                statuse: -1, chartOption: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        padding: 32,
                        data: ['测量浓度', '配比标气浓度']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '测量浓度',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '配比标气浓度',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                    ]
                }
            }
        }))
        this.props.dispatch(createAction('qualityControl/getQCAResultInfo')({ params: info }));
        // 设置标题
        // this.props.navigation.setParams({
        //     title: `${SentencedToEmpty(info, ['PollutantName'], '--')}${this.getCN(SentencedToEmpty(info, ['CN'], '--'))}`
        // });
        this.props.navigation.setOptions({
            title: `${SentencedToEmpty(info, ['PollutantName'], '--')}${this.getCN(SentencedToEmpty(info, ['CN'], '--'))}`,
        });
    }

    getCN = (code) => {
        switch (code) {
            case '3101':
                return '零点核查';
            case '3101_py':
                return '零点漂移';
            case '3102':
                return '量程核查';
            case '3102_py':
                return '量程漂移';
            case '3105':
                return '盲样核查';
            case '3103':
                return '响应时间';
            case '3104':
                return '线性核查';
            default:
                return '';
        }
    }

    renderStatus = () => {
        let statusStr = '---';
        let statusColor = '#696969'
        const item = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        // switch (item.Result) {
        switch (this.props.currentResult) {
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
            default:
                statusStr = '---';
                statusColor = '#696969'
                break;
        }
        statusStr = this.props.currentResult
        return <View style={[{ height: 22, minWidth: 48, borderRadius: 11, backgroundColor: statusColor, justifyContent: 'center', alignItems: 'center' }]}>
            <SDLText style={[{ color: 'white', fontSize: 13 }]}>{statusStr}</SDLText>
        </View>
    }

    render() {
        //WorkMode 1 定时    hd 现场3 ; rd 远程 2
        let workModeStr = '', cWorkModeStr = '';
        switch (this.props.route.params.params.item.WorkMode) {
            case 2:
                cWorkModeStr = '远程rd';
                workModeStr = 'rd';
                break;
            case 3:
                cWorkModeStr = '现场hd';
                workModeStr = 'hd';
                break;
            case 1:
            default:
                cWorkModeStr = '定时';
                workModeStr = '';
                break;
        }
        const info = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        return (
            <StatusPage
                status={200}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                    // this.statusPageOnRefresh();
                }}
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                {/*  '3101_py' 零点漂移, '3102_py' 量程漂移,没有图表 */}
                {
                    ['3101_py', '3102_py'].findIndex((cnItem) => {
                        if (cnItem == this.props.route.params.params.item.CN) return true;
                    }) != -1 || this.props.QCAResultInfoResult.status != 200 ? (null)
                        : <View style={[{ width: SCREEN_WIDTH, height: 200, backgroundColor: 'white' }]}>
                            {/* 此处插入图表 */}
                            {/* <Echarts width={SCREEN_WIDTH} option={this.state.chartOption} height={200} styles={[{ borderWidth: 1 }]} /> */}
                            <Echarts width={SCREEN_WIDTH} option={this.props.QCAResultInfoResult.chartOption} height={200} styles={[{ borderWidth: 1 }]} />
                        </View>
                }

                <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: globalcolor.lightGreyBackground }]}></View>
                <View style={[{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 15 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* 通用数据 */}
                        <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'企业'}</SDLText>
                            {/* param EntName */}
                            {/* <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['EntName'], '未知企业')}`}</SDLText>*/}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['currentEntName'], '未知企业')}`}</SDLText>
                        </View>
                        <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'排口'}</SDLText>
                            {/* param title */}
                            {/* <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['PointName'], '未知排口')}`}</SDLText> */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['currentPointName'], '未知排口')}`}</SDLText>
                        </View>
                        <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'执行时间'}</SDLText>
                            {/* param  MonitorTime*/}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['MonitorTime'], '----/--/-- --:--:--')}`}</SDLText>
                        </View>
                        <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'合格情况'}</SDLText>
                            {/* param Result */}
                            {this.renderStatus()}
                        </View>
                        {/* 通用数据 end */}
                        {/* 响应时间 3103 */}
                        {this.props.route.params.params.item.CN == '3103' ?
                            <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                                <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'监测项目'}</SDLText>
                                {/* param PollutantName */}
                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['PollutantName'], '--')}`}</SDLText>
                            </View> : (null)}
                        {this.props.route.params.params.item.CN == '3103' ?
                            <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                                <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'平均响应时间'}</SDLText>
                                {/* param AvgTime */}
                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['Offset'], '--')}`}</SDLText>
                            </View> : (null)}

                        {/* 响应时间 end */}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查, '3104' 线性核查 */}
                        {['3101', '3101_py', '3102', '3102_py', '3105', '3104'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'监测项目'}</SDLText>
                            {/* param PollutantName */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['PollutantName'], '--')}`}</SDLText>
                        </View> : null}

                        {/* 线性核查 3104 */}
                        {this.props.route.params.params.item.CN == '3104' ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'示值误差'}</SDLText>
                            {/* param MaxOffset */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['Offset'], '--')}`}</SDLText>
                        </View> : (null)
                        }
                        {/* 线性核查 end */}
                        {/* '3101' 零点核查, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 */}
                        {['3101', '3102', '3102_py', '3105'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'标准气浓度'}</SDLText>
                            {/* param if not('3101_py', '3102_py') StandardValue */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['StandValue'], '--')}`}</SDLText>
                        </View> : null}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 */}
                        {['3101', '3101_py', '3102', '3102_py', '3105'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'测量浓度'}</SDLText>
                            {/* param Check if('3101_py', '3102_py')StandardValue  WorkMode 需要同时显示数值和工作模式*/}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['CheckValue'], '--')}`}</SDLText>
                        </View> : null}
                        {/* 只有漂移才有这个字段 */}
                        {['3101_py', '3102_py'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'24小时前测量浓度'}</SDLText>
                            {/* param Check WorkMode24 */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['StandValue'], '--')}   ${workModeStr}`}</SDLText>
                        </View> : null}
                        {/* 只有漂移才有这个字段 end */}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 */}
                        {['3101', '3101_py', '3102', '3102_py', '3105'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'量程范围'}</SDLText>
                            {/* param SpanValue */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['SpanValue'], '--')}`}</SDLText>
                        </View> : null}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 */}
                        {['3101', '3101_py', '3102', '3102_py', '3105'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'相对误差'}</SDLText>
                            {/* param Offset */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['Offset'], '--')}`}</SDLText>
                        </View> : null}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 , 3103 响应时间 , '3104' 线性核查 , */}
                        {['3101', '3101_py', '3102', '3102_py', '3105', '3103', '3104'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'标准要求'}</SDLText>
                            {/* param standard */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['Origin'], '--')}`}</SDLText>
                        </View> : null}
                        {/* 线性核查 3104 */}
                        {this.props.route.params.params.item.CN == '3104' ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'线性系数'}</SDLText>
                            {/* param Ratio */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${SentencedToEmpty(info, ['Ratio'], '--')}`}</SDLText>
                        </View> : (null)
                        }
                        {/* 线性核查 end */}
                        {/* '3101' 零点核查, '3101_py' 零点漂移, '3102' 量程核查, '3102_py' 量程漂移, '3105' 盲样核查 , 3103 响应时间 , '3104' 线性核查 , */}
                        {['3101', '3101_py', '3102', '3102_py', '3105', '3103', '3104'].findIndex((cnItem) => {
                            if (cnItem == this.props.route.params.params.item.CN) return true;
                        }) != -1 ? <View style={[{ height: 36, width: SCREEN_WIDTH - 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#999999', minWidth: 70, marginRight: 16 }]}>{'工作模式'}</SDLText>
                            {/* param WorkMode */}
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${cWorkModeStr}`}</SDLText>
                        </View> : null}
                    </ScrollView>
                </View>
            </StatusPage>
        )
    }
}
