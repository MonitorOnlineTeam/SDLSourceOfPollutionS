/*
 * @Description: 质控日志
 * @LastEditors: hxf
 * @Date: 2020-12-09 09:46:18
 * @LastEditTime: 2024-11-15 14:27:13
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/qualityControl/QualityControlDailyRecord.js
 */
import React, { Component } from 'react';
import { Text, View, Platform, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';

import { SCREEN_WIDTH } from '../../config/globalsize';
import globalcolor from '../../config/globalcolor';
import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty, ShowToast } from '../../utils';
import { StatusPage, FlatListWithHeaderAndFooter, Touchable, SDLText } from '../../components';

const checkTypeList = [
    { label: '零点核查', value: '3101' },
    { label: '零点漂移', value: '3101_py' },
    { label: '量程核查', value: '3102' },
    { label: '量程漂移', value: '3102_py' },
    { label: '盲样核查', value: '3105' },
    { label: '响应时间', value: '3103' },
    { label: '线性核查', value: '3104' }
];
let a = ['3101', '3101_py', '3102', '3102_py', '3105'];
//
@connect(({ qualityControl }) => ({
    NewQCARecordResult: qualityControl.NewQCARecordResult
}))
export default class QualityControlDailyRecord extends Component {
    static navigationOptions = ({ navigation }) => {
        let title = SentencedToEmpty(navigation, ['state', 'params', 'title'], '核查记录详情');
        return createNavigationOptions({
            title: title,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        // console.log('item = ', this.props.navigation.state.params.item);
        // this.props.dispatch(createAction('qualityControl/test')({}));
        // // 设置标题
        const { dispatch } = this.props;
        // dispatch(createAction('qualityControl/updateState')({
        //     NewQCARecordResult: {
        //         status: 200, data: {
        //             Datas: [
        //                 {
        //                     "user": "质控测试员", "Str": "零点核查命令",
        //                     "PoinName": "展厅演示样机", "Time": "2021-03-2516:13:16", "PollutantName": "o2"
        //                 },
        //                 {
        //                     "PointName": "展厅演示祥机", "Str": "零点核查命令",
        //                     'Answer': "收到应答",
        //                     "Time": "2021-03-2516:13:16", "PollutantName": "o2",
        //                     "Result": false
        //                 },
        //             ]
        //         }
        //     },
        // }));

        dispatch(createAction('qualityControl/updateState')({ NewQCARecordResult: { status: -1 } }));
        dispatch(createAction('qualityControl/getNewQCARecord')({}));
        this.mInterval = setInterval(function () {
            console.log('执行一次');
            dispatch(createAction('qualityControl/updateState')({ NewQCARecordResult: { status: -1 } }));
            dispatch(createAction('qualityControl/getNewQCARecord')({}));
        }, 30000);
        // this.props.navigation.setParams({
        //     title: SentencedToEmpty(this.props.navigation, ['state', 'params', 'title'], '质控日志')
        // });
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route, ['params', 'params', 'title'], '质控日志'),
        });
    }

    componentWillUnmount() {
        this.mInterval && clearInterval(this.mInterval);
    }

    getButtonStatusText = () => {
        const data = SentencedToEmpty(this.props.NewQCARecordResult, ['data', 'Datas'], []);
        if (data.length == 0) {
            return '质控错误';
        } else if (data.length == 1) {
            return '质控中';
        } else if (data.length == 2) {
            if (!data[1].Result) {
                return '';
            } else {
                return '质控中';
            }
        } else {
            return '查看详情';
        }
    };

    checkDetail = () => {
        const data = SentencedToEmpty(this.props.NewQCARecordResult, ['data', 'Datas'], []);
        if (data.length == 0) {
            return 3; // 消失
        } else if (data.length == 1) {
            return 1; // 显示不可交互
        } else if (data.length == 2) {
            if (!data[1].Result) {
                return 3;
            } else {
                return 1;
            }
        } else if (data.length == 3) {
            if (data[2].ResultStr == '合格' || data[2].ResultStr == '不合格') {
                return 2; // 查看详情
            } else {
                return 3;
            }
        }
    };

    buttonRender = () => {
        const buttonStatus = this.checkDetail();
        if (buttonStatus == 1 || buttonStatus == 2) {
            return (
                <Touchable
                    onPress={() => {
                        const goDetail = this.checkDetail();
                        if (goDetail == 2) {
                            const item = SentencedToEmpty(this.props.NewQCARecordResult, ['data', 'Datas', 2, 'QCAResultList', 0], {});
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'QualityControlRecordDetail',
                                    params: {
                                        item
                                    }
                                })
                            );
                        }
                    }}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 32,
                                borderRadius: 24,
                                height: 48,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#4499f0'
                            }
                        ]}
                    >
                        <Text style={[{ fontSize: 15, color: '#ffffff' }]}>{this.getButtonStatusText()}</Text>
                    </View>
                </Touchable>
            );
        } else {
            return null;
        }
    };

    render() {
        console.log('NewQCARecordResult = ', this.props.NewQCARecordResult);
        return (
            <StatusPage
                status={this.props.NewQCARecordResult.status}
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
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
            >
                {/* <View style={[{ width: SCREEN_WIDTH, height: 200, backgroundColor: 'white' }]}>
                    此处插入图表
                    {
                        "User": "质控测试员", "Str": "零点核查命令",
                        "PointName": "展厅演示样机", "Time": "2021-03-2516:13:16", "PollutantName": "o2"
                    },
                    {
                        "PointName": "展厅演示祥机", "Str": "零点核查命令",
                        'Answer': "收到应答",
                        "Time": "2021-03-2516:13:16", "PollutantName": "o2",
                        "Result": true
                    },
                    {
                        "PointName": "展厅演示样机",
                        "Str": "向平台反馈零点核查成功,核查结果", "PollutantName": "02",
                        "Time": "2021-03-2516:17:50", "ResultStr": "无效数据"
                    }
                </View>
                <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: globalcolor.lightGreyBackground }]}></View> */}
                <View style={[{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 15 }]}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.NewQCARecordResult.status == -1}
                                onRefresh={() => {
                                    this.props.dispatch(createAction('qualityControl/updateState')({ NewQCARecordResult: { status: -1 } }));
                                    this.props.dispatch(createAction('qualityControl/getNewQCARecord')({}));
                                }}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    >
                        {SentencedToEmpty(this.props.NewQCARecordResult, ['data', 'Datas'], []).map((item, key) => {
                            {
                                /* if (key == this.props.NewQCARecordResult.data.Datas.length - 1) { */
                            }
                            if (key == 0) {
                                return (
                                    <View key={0} style={[{ flexDirection: 'row' }]}>
                                        <View style={[{ width: 60, alignItems: 'center' }]}>
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#b8b8b8' }]} />
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 88, width: 1, backgroundColor: '#b8b8b8' }]} />
                                        </View>
                                        <View style={[{ flex: 1 }]}>
                                            <View style={[{ justifyContent: 'center' }]}>
                                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${item.User}【${item.PointName}】,发送${item.PollutantName}${item.Str}`}</SDLText>
                                            </View>
                                            <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{`${SentencedToEmpty(item, ['Time'], '')}`}</SDLText>
                                        </View>
                                    </View>
                                );
                            } else if (key == 1) {
                                return (
                                    <View key={1} style={[{ flexDirection: 'row' }]}>
                                        <View style={[{ width: 60, alignItems: 'center' }]}>
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#b8b8b8' }]} />
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 88, width: 1, backgroundColor: SentencedToEmpty(this.props.NewQCARecordResult, ['data', 'Datas'], []).length == 2 ? '#ffffff' : '#b8b8b8' }]} />
                                        </View>
                                        <View style={[{ flex: 1 }]}>
                                            {item.Str === '通讯超时' ? (
                                                <View style={[{ justifyContent: 'center' }]}>
                                                    <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${item.Str}`}</SDLText>
                                                </View>
                                            ) : item.Result ? (
                                                <View style={[{ justifyContent: 'center' }]}>
                                                    <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`收到${item.PollutantName}${item.Str}`}</SDLText>
                                                    <View style={[{ height: 20, borderWidth: 1, backgroundColor: '#87d068', borderColor: '#87d068', width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 2 }]}>
                                                        <Text style={[{ fontSize: 12, color: '#ffffff', marginHorizontal: 4 }]}>{'应答成功'}</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                <View style={[{ justifyContent: 'center' }]}>
                                                    <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`收到${item.PollutantName}${item.Str}`}</SDLText>
                                                    <View style={[{ height: 20, borderWidth: 1, backgroundColor: '#f81d22', borderColor: '#f81d22', width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 2 }]}>
                                                        <Text style={[{ fontSize: 12, color: '#ffffff', marginHorizontal: 4 }]}>{'应答失败'}</Text>
                                                    </View>
                                                </View>
                                            )}

                                            <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{`${SentencedToEmpty(item, ['Time'], '')}`}</SDLText>
                                        </View>
                                    </View>
                                );
                            } else if (key == 2) {
                                return (
                                    <View key={2} style={[{ flexDirection: 'row' }]}>
                                        <View style={[{ width: 60, alignItems: 'center' }]}>
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#b8b8b8' }]} />
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 88, width: 1, backgroundColor: 'white' }]} />
                                        </View>
                                        <View style={[{ flex: 1 }]}>
                                            <View style={[{ justifyContent: 'center' }]}>
                                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`【${item.PointName}】${item.Str}`}</SDLText>
                                                {item.ResultStr == '合格' ? (
                                                    <View style={[{ height: 20, borderWidth: 1, borderColor: '#87d068', backgroundColor: '#87d068', width: 40, borderRadius: 2, alignItems: 'center', justifyContent: 'center' }]}>
                                                        <Text style={[{ fontSize: 12, color: '#ffffff', marginHorizontal: 4 }]}>{item.ResultStr}</Text>
                                                    </View>
                                                ) : item.ResultStr == '不合格' ? (
                                                    <View style={[{ height: 20, borderWidth: 1, borderColor: '#f81d22', backgroundColor: '#f81d22', borderRadius: 2, width: 56, alignItems: 'center', justifyContent: 'center' }]}>
                                                        <Text style={[{ fontSize: 12, color: '#ffffff', marginHorizontal: 4 }]}>{item.ResultStr}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={[{ height: 20, borderWidth: 1, borderColor: '#f81d22', borderRadius: 2, width: 80, alignItems: 'center', justifyContent: 'center' }]}>
                                                        <Text style={[{ fontSize: 12, color: '#f81d22', marginHorizontal: 4 }]}>{item.ResultStr}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{`${SentencedToEmpty(item, ['Time'], '')}`}</SDLText>
                                        </View>
                                    </View>
                                );
                            } else {
                                return (
                                    <View style={[{ flexDirection: 'row' }]}>
                                        <View style={[{ width: 60, alignItems: 'center' }]}>
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#b8b8b8' }]} />
                                            <View style={[{ height: 8 }]} />
                                            <View style={[{ height: 44, width: 1, backgroundColor: '#b8b8b8' }]} />
                                        </View>
                                        <View style={[{ flex: 1 }]}>
                                            <View style={[{ height: 20, justifyContent: 'center' }]}>
                                                <SDLText style={[{ fontSize: 14, color: '#333333' }]}>{`${item.Str}`}</SDLText>
                                            </View>
                                            <SDLText style={[{ fontSize: 13, color: '#999999' }]}>{`${SentencedToEmpty(item, ['Time'], '')}`}</SDLText>
                                        </View>
                                    </View>
                                );
                            }
                        })}
                    </ScrollView>
                    {this.buttonRender()}
                </View>
            </StatusPage>
        );
    }
}
