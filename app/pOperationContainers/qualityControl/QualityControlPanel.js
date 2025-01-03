/*
 * @Description: 手动质控
 * @LastEditors: hxf
 * @Date: 2020-12-11 10:03:37
 * @LastEditTime: 2024-11-26 09:27:55
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/qualityControl/QualityControlPanel.js
 */
import React, { Component } from 'react';
import { Text, View, Platform, ImageBackground } from 'react-native';
import { connect } from 'react-redux';

import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { SDLText, Touchable } from '../../components';
import PullToRefreshLayout from '../../components/PullToRefreshLayout';
import ConsumablesReplaceForm from '../../operationContainers/taskViews/taskExecution/formViews/ConsumablesReplaceForm';

@connect(({ qualityControl }) => ({
    QCAStatusResult: qualityControl.QCAStatusResult
}))
export default class QualityControlPanel extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '手动质控',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    componentDidMount() {
        this.props.dispatch(createAction('qualityControl/getQCAStatus')({}));
    }

    /**
     * qcaState  :空闲（待机）（0），运行（1），
        维护（2），故障（3），断电（5），离线（6）
        空闲（待机）（0）#52c41a，
        运行（1）#1890ff，
        维护（2）#faad14，
        故障（3）#ffad4f，
        断电（5）#ff4d4f，
        离线（6）#d9d9d9



        监测点状态：
        正常(#52c41a)、离线（#d9d9d9）、超标（#f5222d）、异常（#fa8c16）、备案不符（#fa8c16）、检测不合格（#faad14）
        decviceState: 0 正常   1 离线 2超标 3 异常  4 备案不符  5监测不合格
     * 
     * 
     *  { text: "正常", checked: false, color: "success", value: "0", count: 10, className: "green" },
        { text: "离线", checked: false, color: "default", value: 1, count: 1, className: "default" },
        { text: "超标", checked: false, color: "error", value: 2, count: 2, className: "red" },
        { text: "异常", checked: false, color: "warning", value: 3, count: 3, className: "orange" },
        { text: "备案不符", checked: false, color: "orange", value: 4, count: 4, className: "volcano" },
        { text: "监测不合格", checked: false, color: "gold", value: 5, count: 14, className: "magenta" },
     * 
     */

    getQcaState = code => {
        // 空闲（待机）（0）#52c41a，运行（1）#1890ff，维护（2）#faad14，故障（3）#ffad4f，断电（5）#ff4d4f，离线（6）#d9d9d9
        switch (code) {
            case 0:
                return { text: '空闲', color: '#52c41a' };
            case 1:
                return { text: '运行', color: '#1890ff' };
            case 2:
                return { text: '维护', color: '#faad14' };
            case 3:
                return { text: '故障', color: '#ffad4f' };
            case 5:
                return { text: '断电', color: '#ff4d4f' };
            case 6:
                return { text: '离线', color: '#d9d9d9' };
            default:
                return { text: '--', color: '#d9d9d9' };
        }
    };

    getDecviceState = code => {
        switch (code) {
            case 0:
                return { text: '离线', color: '#d9d9d9' };
            case 1:
                return { text: '正常', color: '#52c41a' };
            case 2:
                return { text: '超标', color: '#f5222d' };
            case 3:
                return { text: '异常', color: '#fa8c16' };
            case 4:
                return { text: '检测不合格', color: '#faad14' };
            case 5:
                return { text: '备案不符', color: '#fa8c16' };
            default:
                return { text: '--', color: '#d9d9d9' };
        }
    };

    render() {
        // 零点核查 量程核查 盲样核查 响应时间核查 线性核查
        /**
         *  { label: '全部核查', value: 'all' },
            { label: '零点核查', value: '3101' },
            { label: '零点漂移', value: '3101_py' },
            { label: '量程核查', value: '3102' },
            { label: '量程漂移', value: '3102_py' },
            { label: '盲样核查', value: '3105' },
            { label: '响应时间', value: '3103' },
            { label: '线性核查', value: '3104' },
         */
        let buttons = [
            { label: '零点核查', backgroundImage: require('../../images/bg_lingdian.png'), code: '3101' },
            { label: '量程核查', backgroundImage: require('../../images/bg_liangcheng.png'), code: '3102' },
            { label: '盲样核查', backgroundImage: require('../../images/bg_mangyang.png'), code: '3105' },
            { label: '响应时间核查', backgroundImage: require('../../images/bg_xiangyingshijian.png'), code: '3103' },
            { label: '线性核查', backgroundImage: require('../../images/bg_xianxing.png'), code: '3104' }
        ];
        let qcaStateObject = this.getQcaState(SentencedToEmpty(this.props, ['QCAStatusResult', 'data', 'Datas'], { qcaState: 100, decviceState: 100 }).qcaState);
        let decviceStateObject = this.getDecviceState(SentencedToEmpty(this.props, ['QCAStatusResult', 'data', 'Datas'], { qcaState: 100, decviceState: 100 }).decviceState);
        return (
            // <PullToRefreshLayout
            <PullToRefreshLayout
                QCAStatusResult={this.props.QCAStatusResult}
                ref={ref => (this.layout = ref)}
                style={{ width: SCREEN_WIDTH }}
                onRefresh={() => {
                    let _this = this;
                    this.props.dispatch(
                        createAction('qualityControl/getQCAStatus')({
                            callback: () => {
                                this.layout.stopRefresh();
                            }
                        })
                    );
                }}
            >
                <View style={[{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'white', alignItems: 'center', paddingHorizontal: 15 }]}>
                    <View style={[{ width: SCREEN_WIDTH - 30, height: 48, justifyContent: 'center' }]}>
                        <SDLText style={[{ color: '#333333', fontSize: 14 }]}>{'状态信息'}</SDLText>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH - 30, height: 48, flexDirection: 'row', alignItems: 'center', borderRadius: 4, backgroundColor: '#f0f0f0' }]}>
                        <View style={[{ flex: 1, paddingLeft: 20, flexDirection: 'row' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#666666' }]}>{'质控仪：'}</SDLText>
                            <SDLText style={[{ fontSize: 14, color: qcaStateObject.color }]}>{`${qcaStateObject.text}`}</SDLText>
                        </View>
                        <View style={[{ height: 24, width: 1, backgroundColor: '#cccccc' }]} />
                        <View style={[{ flex: 1, paddingLeft: 20, flexDirection: 'row' }]}>
                            <SDLText style={[{ fontSize: 14, color: '#666666' }]}>{'CEMS：'}</SDLText>
                            <SDLText style={[{ fontSize: 14, color: decviceStateObject.color }]}>{`${decviceStateObject.text}`}</SDLText>
                        </View>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH - 30, height: 48, justifyContent: 'center' }]}>
                        <SDLText style={[{ color: '#333333', fontSize: 14 }]}>{'质控操作'}</SDLText>
                    </View>
                    {buttons.map((item, index) => {
                        return (
                            <Touchable
                                key={`button${index}`}
                                onPress={() => {
                                    console.log('Touchable = ', item);
                                    //currentQCAType
                                    this.props.dispatch(createAction('qualityControl/updateState')({ currentQCAType: item }));
                                    this.props.dispatch(
                                        NavigationActions.navigate({
                                            routeName: 'DoQualityControl',
                                            params: {
                                                item
                                            }
                                        })
                                    );
                                }}
                            >
                                <ImageBackground style={[{ width: SCREEN_WIDTH - 30, height: 48, flexDirection: 'row', alignItems: 'center', marginBottom: 15 }]} source={item.backgroundImage}>
                                    <SDLText style={[{ fontSize: 17, marginLeft: 56, color: 'white' }]}>{item.label}</SDLText>
                                </ImageBackground>
                            </Touchable>
                        );
                    })}
                </View>
            </PullToRefreshLayout>
        );
    }
}
