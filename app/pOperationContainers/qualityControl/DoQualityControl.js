/*
 * @Description: 手动核查
 * @LastEditors: hxf
 * @Date: 2020-12-11 11:22:19
 * @LastEditTime: 2025-02-12 10:02:38
 * @FilePath: /SDLSourceOfPollutionS_dev/app/pOperationContainers/qualityControl/DoQualityControl.js
 */
import React, { Component } from 'react'
import { Text, View, Platform, Image, TextInput, StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty, ShowToast } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import globalcolor from '../../config/globalcolor';
import { getToken } from '../../dvapack/storage';
import { SDLText, Touchable, SelectButton, StatusPage } from '../../components';
import SimpleLoadingComponent from '../../components/SimpleLoadingComponent';

@connect(({ qualityControl }) => ({
    QCAInfoResult: qualityControl.QCAInfoResult,
    doQualityControlCurrentPollutant: qualityControl.doQualityControlCurrentPollutant,
    n2Info: qualityControl.n2Info,
    currentQCAType: qualityControl.currentQCAType,
    StandardValue: qualityControl.StandardValue,
    QCAStatusResult: qualityControl.QCAStatusResult,
}))
export default class DoQualityControl extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '手动核查',
            headerStyle: {
                borderBottomWidth: 0,
                elevation: 0,
            },
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(createAction('qualityControl/getQCAInfo')({}));
        this.props.dispatch(createAction('qualityControl/updateState')({ doQualityControlCurrentPollutant: null, n2Info: null, StandardValue: '' }));
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('qualityControl/getQCAInfo')({}));
    }

    renderRadioButton = () => {
        const { QCAInfoResult } = this.props;
        if (QCAInfoResult.status == 200) {

            const reslist = SentencedToEmpty(QCAInfoResult, ['data', 'Datas', 'reslist'], []);
            let pollutants = [];
            let N2 = {};
            reslist.map((item, key) => {
                if (item.GasCode != 'n00000') {
                    item.title = item.PollutantName;
                    item.id = item.GasCode;
                    pollutants.push(item);
                } else {
                    N2 = item;
                }
            });
            console.log('pollutants = ', pollutants);
            // AlarmState 1 报警  0正常
            return <SelectButton
                style={{ flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH - 140, }} //整个组件的样式----这样可以垂直和水平
                itemStyle={{}}
                conTainStyle={{ height: 44, width: 65 }} //图片和文字的容器样式
                imageStyle={{ width: 18, height: 18 }} //图片样式
                textStyle={{ color: '#666' }} //文字样式
                selectIndex={''} //空字符串,表示不选中,数组索引表示默认选中
                data={pollutants} //数据源
                onPress={(index, item) => {
                    this.props.dispatch(createAction('qualityControl/updateState')({
                        doQualityControlCurrentPollutant: item, n2Info: N2, StandardValue: ''
                    }));
                }}
            />
        } else {
            return null;
        }
    }

    /**
     * CEMS正常运行状态下，按照规定的时间通入零点气体，仪器的读数与零值的偏差相对于满量程的百分比。并依据75标准考核是否满足要求。
     */

    /**
     * let buttons = [
           { label: '零点核查', backgroundImage: require('../../images/bg_lingdian.png'), code: '3101' },
           { label: '量程核查', backgroundImage: require('../../images/bg_liangcheng.png'), code: '3102' },
           { label: '盲样核查', backgroundImage: require('../../images/bg_mangyang.png'), code: '3105' },
           { label: '响应时间核查', backgroundImage: require('../../images/bg_xiangyingshijian.png'), code: '3103' },
           { label: '线性核查', backgroundImage: require('../../images/bg_xianxing.png'), code: '3104' },
       ];
       ['3101', '3102', '3105', '3103', '3104']
     */
    getDescribe = () => {
        const { currentQCAType } = this.props;
        switch (SentencedToEmpty(currentQCAType, ['code'], '')) {
            case '3101':
                return 'CEMS正常运行状态下，按照规定的时间通入零点气体，仪器的读数与零值的偏差相对于满量程的百分比。并依据75标准考核是否满足要求';
            case '3102':
                return 'CEMS正常运行状态下，按照规定的时间通入80%量程点气体，仪器的读数与量程值的偏差相对于满量程的百分比。并依据75标准考核是否满足要求';
            case '3105':
                return 'CEMS正常运行状态下，配置任意浓度的标准气体作为盲样气体，通入CEMS，仪器的读数与标准气体浓度值的偏差（示值误差）';
            case '3103':
                return 'CEMS正常运行状态下，从CEMS系统采样探头通入标准气体的时刻起，到分析仪示值达到标准气体标称值90%的时刻止，中间的时间间隔，按照75标准连续做3次。包括管线传输时间和仪表相应时间。';
            case '3104':
                return 'CEMS正常运行状态下，按照规定的时间分别通入20%、40%、60%、80%高浓度标准气体，仪器的读数与标准气体浓度值的偏差相对于满量程的百分比，取最大值作为线性核查结果。';
            default:
                return '-';
        }
    }

    // { label: '零点核查', backgroundImage: require('../../images/bg_lingdian.png'), code: '3101' },
    // { label: '量程核查', backgroundImage: require('../../images/bg_liangcheng.png'), code: '3102' },
    // { label: '盲样核查', backgroundImage: require('../../images/bg_mangyang.png'), code: '3105' },
    // { label: '响应时间核查', backgroundImage: require('../../images/bg_xiangyingshijian.png'), code: '3103' },
    // { label: '线性核查', backgroundImage: require('../../images/bg_xianxing.png'), code: '3104' },

    getTitle = () => {
        const { currentQCAType } = this.props;
        switch (SentencedToEmpty(currentQCAType, ['code'], '')) {
            case '3101':
                return '零点核查';
            case '3102':
                return '量程核查';
            case '3105':
                return '盲样核查';
            case '3103':
                return '响应时间核查';
            case '3104':
                return '线性核查';
            default:
                return '-';
        }
    }

    getIcon = () => {
        const { currentQCAType } = this.props;
        switch (SentencedToEmpty(currentQCAType, ['code'], '')) {
            case '3101':
                return require('../../images/ic_lingdian_hecha.png');
            case '3102':
                return require('../../images/ic_liangcheng_hecha.png');
            case '3105':
                return require('../../images/ic_mangyang_hecha.png');
            case '3103':
                return require('../../images/ic_xiangyingshijian_hecha.png');
            case '3104':
                return require('../../images/ic_xianxing_hecha.png');
            default:
                return require('../../images/bg_lingdian.png');
        }
    }

    getPlaceholderText = () => {
        if (SentencedToEmpty(this.props.currentQCAType, ['code'], '') == '3105') {
            if (SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['Range', 'min'], '?') == '?'
                || SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['Range', 'max'], '?') == '?') {
                return '请先选择需要核查的污染物！';
            } else {
                return `盲样浓度范围${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['Range', 'min'], '?')}-${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['Range', 'max'], '?')}`;
            }
        } else {
            return '';
        }
    }

    render() {
        return (
            <StatusPage
                style={[{ backgroundColor: 'white', flex: 1 }]}
                status={this.props.QCAInfoResult.status}
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
                {SentencedToEmpty(this.props, ['QCAStatusResult', 'status'], 200) == -1 ? <SimpleLoadingComponent message={'正在执行核查...'} /> : (null)}
                {SentencedToEmpty(this.props, ['QCAStatusResult', 'status'], 200) == -1 ? <SimpleLoadingComponent message={'正在执行核查...'} /> : (null)}
                {/* <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}> */}
                <ScrollView showsVerticalScrollIndicator={false} ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>

                    <View style={[{ width: SCREEN_WIDTH, padding: 10, backgroundColor: globalcolor.headerBackgroundColor }]}>
                        <SDLText numberOfLines={3} ellipsizeMode={'tail'} style={[{ fontSize: 13, color: '#666666', width: SCREEN_WIDTH - 20, backgroundColor: 'white', minHeight: 32, borderRadius: 4, padding: 10 }]}>
                            {this.getDescribe()}
                        </SDLText>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, height: 48, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }]}>
                        <Image style={[{ marginRight: 10, marginLeft: 20, height: 32, width: 32 }]} source={this.getIcon()} />
                        <SDLText style={[{ fontSize: 15, color: '#333333' }]}>{this.getTitle()}</SDLText>
                    </View>
                    <View style={[{ width: SCREEN_WIDTH, flex: 1, paddingTop: 15, paddingHorizontal: 20 }]}>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, minHeight: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'污染物'}
                            </SDLText>
                            {
                                this.renderRadioButton()
                            }
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'核查企业'}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {'北京雪迪龙科技股份有限公司'}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'核查排口'}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {'废气排口#1'}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'核查人'}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {`${getToken().UserName}`}
                            </SDLText>
                        </View>
                        {
                            SentencedToEmpty(this.props.currentQCAType, ['code'], '') == '3105' ?
                                <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center' }]}>
                                    <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                        {`${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['PollutantName'], '')}盲样浓度`}
                                    </SDLText>
                                    <View style={[{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }]}>
                                        <TextInput
                                            style={[{
                                                height: 32, paddingTop: 1,
                                                paddingBottom: 1,
                                            }]}
                                            onChangeText={text => {
                                                this.props.dispatch(createAction('qualityControl/updateState')({ StandardValue: text }));
                                            }}
                                            placeholderTextColor={'#666666'}
                                            placeholder={this.getPlaceholderText()}
                                        >
                                            {this.props.StandardValue}
                                        </TextInput>
                                    </View>

                                </View> : (null)
                        }
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {`${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['PollutantName'], '')}标气余量`}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {`${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['Allowance'], '---')}L${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['AlarmState'], 0) == 1 ? '(余量不足)' : ''}`}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'N₂标气余量'}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {`${SentencedToEmpty(this.props.n2Info, ['Allowance'], '---')}L${SentencedToEmpty(this.props.n2Info, ['AlarmState'], 0) == 1 ? '(余量不足)' : ''}`}
                            </SDLText>
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {`${SentencedToEmpty(this.props.doQualityControlCurrentPollutant, ['PollutantName'], '')}量程`}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {'100mg/m³'}
                            </SDLText>
                        </View>
                        {/* <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 40, height: 36, alignItems: 'center', }]}>
                            <SDLText style={[{ width: 110, fontSize: 14, color: '#999999' }]}>
                                {'预计时间'}
                            </SDLText>
                            <SDLText style={[{ fontSize: 14, color: '#333333' }]}>
                                {'10min'}
                            </SDLText>
                        </View> */}
                    </View>
                </ScrollView>
                <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                    <Touchable onPress={() => {

                        // getNewQCARecord
                        // this.props.dispatch(createAction('qualityControl/getNewQCARecord')({}))
                        if (true && this.props.doQualityControlCurrentPollutant) {
                            let QCAType = SentencedToEmpty(this.props.currentQCAType, ['code'], '');
                            let params = {
                                "PollutantCode": this.props.doQualityControlCurrentPollutant.GasCode, //标气CODE
                                "QCAType": QCAType, //质控核查类别
                            };
                            if (QCAType == '3105') {// 盲样核查
                                const patten = /^-?\d+\.?\d*$/;
                                if (patten.test(this.props.StandardValue)) {
                                    params.StandardValue = this.props.StandardValue;
                                } else {
                                    ShowToast('请输入盲样浓度');
                                    return;
                                }
                            }
                            // 测试
                            // this.props.dispatch(NavigationActions.navigate({
                            //     routeName: 'QualityControlDailyRecord',
                            //     params: { title: `${this.props.doQualityControlCurrentPollutant.PollutantName}${this.getTitle()}` }
                            // }));
                            this.props.dispatch(createAction('qualityControl/sendQCACheckCMD')({
                                params,
                                callback: () => {
                                    // 跳转到 质控日志
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'QualityControlDailyRecord',
                                        params: { title: `${this.props.doQualityControlCurrentPollutant.PollutantName}${this.getTitle()}` }
                                    }));
                                }
                            }))
                        } else {
                            ShowToast('请先选择需要核查的污染物！');
                        }
                    }} style={[{ marginBottom: 20 }]}>
                        <View style={[{ width: SCREEN_WIDTH - 20, height: 40, backgroundColor: '#4aa0ff', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText style={[{ fontSize: 14, color: 'white' }]}>{'开始核查'}</SDLText>
                        </View>
                    </Touchable>
                </View>
            </StatusPage>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column'
    },
    textInput: {
        color: '#666666',
        marginTop: 24,
        marginBottom: 30,
        padding: 0,
        color: '#666666',
        textAlignVertical: 'top',
        textAlign: 'left'
    },
});