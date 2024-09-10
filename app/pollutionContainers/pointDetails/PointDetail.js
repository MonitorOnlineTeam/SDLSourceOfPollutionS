import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform, ScrollView, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { IconUrl, CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT, POLLUTION_PROJECT } from '../../config/globalconst';
import { StatusPage, Touchable, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, makePhone, SentencedToEmpty } from '../../utils';
import PointBar from '../components/PointBar';
import { AqiBar } from '../../airContainers/tabView/home/components';
import * as Progress from 'react-native-progress';
import { getAirPM25Code, getAirPM10Code, getAirNO2Code, getAirSO2Code, getAirO3Code, getAirCOCode } from '../../utils/mapconfig';
import { getShowIndex } from '../../utils/historyDataUtil';

/**
 * 排口主页
 */

@connect(({ pointDetails, app }) => ({
    isVerifyOrHandle: app.isVerifyOrHandle,
    ponitInfo: pointDetails.ponitInfo,
    cityNewModel: pointDetails.cityNewModel,
    systemMenu: pointDetails.systemMenu,
    cityAQIDataList: pointDetails.cityAQIDataList
}))
export default class PointDetail extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '站点详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0
        };
    }
    refreshData() {
        let condiJson = {
            rel: '$and',
            group: [
                {
                    rel: '$and',
                    group: [
                        {
                            Key: 'DGIMN',
                            // Value: this.props.navigation.state.params.DGIMN, // this.props.route.params.params
                            Value: this.props.route.params.params.DGIMN, // this.props.route.params.params
                            Where: '$='
                        }
                    ]
                }
            ]
        };
        // this.props.dispatch(
        //     createAction('pointDetails/getPointInfo')({
        //         params: { configId: 'service_DeviceStatus', ConditionWhere: JSON.stringify(condiJson) }
        //     })
        // );
        this.props.dispatch(
            createAction('pointDetails/getPointInfo')({
                // params: { DGIMN: this.props.navigation.state.params.DGIMN }
                params: { DGIMN: this.props.route.params.params.DGIMN }
            })
        );
    }
    componentDidMount() {
        this.refreshData();
    }
    findImage = item => {
        let source = {};
        if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
            switch (item.id) {
                case '6d5b5e59-8833-496c-89b6-461eacf1bfbb':
                    //异常报告
                    source = 'yichangbaogao.png';
                    break;
                case 'f9801b6d-9b89-4465-8a63-d57ed31b46a1':
                    //基础设置
                    source = 'jichusheshi.png';
                    break;

                case 'bc2efeff-b775-47e8-bb61-cbf8b8a31e7a':
                    //停运记录
                    source = 'tingchanjilu.png';
                    break;
                // case '7dbc22e1-1eab-41ba-af86-90ef933910e7':4b2f2a58-d18a-4fe1-97bb-03d2609d6fa4
                case '4b2f2a58-d18a-4fe1-97bb-03d2609d6fa4':
                    //数据查询
                    source = 'shujuchaxun.png';
                    break;
                // case 'a1bdee58-5032-4487-893c-ab37c9f079d0':f4f359b4-6c27-4757-84f4-00df140e011d
                case 'f4f359b4-6c27-4757-84f4-00df140e011d':
                    // '超标数据'
                    source = 'chaobiaoshuju.png';
                    break;
                case 'dc136895-e4bb-44c8-ad0e-100eb66aea26':
                    //核实记录
                    source = 'heshijilu.png';
                    break;
                case '6ccf32ce-a416-4578-b2cf-02aec0766d81':
                case 'b3f6a1dc-23da-4150-ace1-bc83788cd7c1':
                    //'报警记录'
                    source = 'baojingjilu.png';
                    break;
                case '8af79971-96d2-4bc2-bfc3-e52b4f6e4b30':
                    //视频监控
                    source = 'shipinjiankong.png';
                    break;
                case 'cb5fb48f-a7c9-466e-9306-1d5d623b4297':
                    //运维日志
                    source = 'yunweirizhi.png';
                    break;
                case '50feba5c-2af5-4872-84a3-fe3d74ff5334':
                    //异常数据
                    source = 'yichangshuju.png';
                    break;
                case '96fc2848-ca34-4a95-9c80-02c97a50d32b':
                    //运维派单
                    source = 'yunweipaidan.png';
                    break;
                case '3377e4b8-433e-4594-b093-280a3124e892':
                    //设备资料库
                    source = 'shebeiziliao.png';
                    break;
                case 'e59b5992-d796-42a9-94f4-1ef819de62b9':
                    // '超标限值'
                    source = 'chaobiaoxianzhi.png';
                    break;
                case '5401aa02-6bd1-47b9-afbf-0af7cfb035f6':
                    // '运维工单'
                    source = 'yunweigongdan.png';
                    break;
                case '9dda0f41-2390-46d8-8d9b-2f8ad81c4521':
                    // '缺失数据'
                    source = 'queshishuju.png';
                    break;
            }
        } else {
            switch (item.id) {
                case '2a21f58e-89ae-4bc7-8eec-9dce6df9487c':
                    //停运记录
                    source = 'tingchanjilu.png';
                    break;
                case '7dbc22e1-1eab-41ba-af86-90ef933910e7':
                    //数据查询
                    source = 'shujuchaxun.png';
                    break;
                case 'a1bdee58-5032-4487-893c-ab37c9f079d0':
                    // '超标数据'
                    source = 'chaobiaoshuju.png';
                    break;
                case '8a457123-dbbc-4213-b0cb-ebe26b264abc':
                    //核实记录
                    source = 'heshijilu.png';
                    break;
                case '6ea49f41-b707-4d47-9e9e-1feff965d7da':
                    //'报警记录'
                    source = 'baojingjilu.png';
                    break;
                case '8af79971-96d2-4bc2-bfc3-e52b4f6e4b30':
                    //视频监控
                    source = 'shipinjiankong.png';
                    break;
                case '82535ab1-c375-4f45-bf87-7b561469cc66':
                    //运维日志
                    source = 'yunweirizhi.png';
                    break;
                case '8c34acb1-feca-4245-8c5f-9b98e5e29741':
                    //异常数据
                    source = 'yichangshuju.png';
                    break;
                case '96fc2848-ca34-4a95-9c80-02c97a50d32b':
                    //运维派单
                    source = 'yunweipaidan.png';
                    break;
                case 'ace78718-dd8b-4b4d-ba8a-4ab6c18bbe1f':
                    //设备资料库
                    source = 'shebeiziliao.png';
                    break;
                case 'c8291635-cc6e-4086-9666-766f8f929204':
                    // '超标限值'
                    source = 'chaobiaoxianzhi.png';
                    break;
                case 'fccbe5e5-4b8d-41fa-a8be-f4fd53d8d19d':
                    // '超标核实记录'
                    source = 'heshijilu.png';
                    break;
                case 'c63b0480-e310-4877-a8d7-031630fa769c':
                    // '运维工单'
                    source = 'yunweigongdan.png';
                    break;
                case '57951163-ff33-47c4-88d9-4fd016d95628':
                    // '缺失数据'
                    source = 'queshishuju.png';
                    break;
            }
        }

        return source;
    };
    render() {
        console.log('render props = ', this.props);
        return (
            <StatusPage
                status={this.props.ponitInfo.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refreshData();
                    console.log('重新刷新');
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refreshData();
                    console.log('错误操作回调');
                }}
            >
                {this.props.ponitInfo.status == 200 ? (
                    <ScrollView style={{ flex: 1 }}>
                        {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '12' ? null : (
                            <View style={{ height: 200, backgroundColor: 'white', width: SCREEN_WIDTH, marginTop: 0 }}>
                                <Image
                                    style={{ width: SCREEN_WIDTH, height: '100%' }}
                                    // source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557825944422&di=8cb34e5694c352cd62234d91221e1da5&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131009%2F10721699_230939373000_2.jpg' }}
                                    source={require('../../images/banner.jpg')}
                                />
                            </View>
                        )}

                        <PointBar
                            style={{ width: SCREEN_WIDTH }}
                            showImg={SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '5' ? false : true}
                            // DGIMN={this.props.navigation.state.params.DGIMN}
                            // entName={this.props.navigation.state.params.TargetName}
                            DGIMN={this.props.route.params.params.DGIMN}
                            entName={this.props.route.params.params.TargetName}
                            pointName={SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PointName'], '--')}
                            status={SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['Status'], '')}
                            pollutantType={SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '')}
                            outputFlag={SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['OutPutFlag'], 0)}
                        />

                        <View style={{ height: 80, backgroundColor: 'white', width: SCREEN_WIDTH, marginTop: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                            <View style={{ width: SCREEN_WIDTH / 2 - 1, height: '100%', borderRightColor: '#f0f0f0', borderRightWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 14, height: 14 }}
                                        // source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557825944422&di=8cb34e5694c352cd62234d91221e1da5&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131009%2F10721699_230939373000_2.jpg' }}
                                        source={require('../../images/icon_station_director.png')}
                                    />
                                    <SDLText style={{ color: '#999' }}>{` ${SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantType'], '1') == 5 ? '站点' : '企业环保'}负责人`}</SDLText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, height: 20 }}>
                                    <SDLText fontType={'small'} style={{ maxWidth: 100, color: '#666' }}>
                                        {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['LinkManName'], '-') || '-'}
                                    </SDLText>
                                    <SDLText fontType={'small'} style={{ color: '#666' }}>
                                        {' | '}
                                    </SDLText>
                                    <SDLText
                                        fontType={'small'}
                                        onPress={() => {
                                            makePhone(this.props.ponitInfo.data.Datas[0]['LinkManPhone']);
                                        }}
                                        style={{ color: '#64A9EF' }}
                                    >
                                        {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['LinkManPhone'], '-') || '-'}
                                    </SDLText>
                                </View>
                            </View>
                            <View style={{ width: SCREEN_WIDTH / 2 - 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 14, height: 14 }}
                                        // source={{ uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557825944422&di=8cb34e5694c352cd62234d91221e1da5&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131009%2F10721699_230939373000_2.jpg' }}
                                        source={require('../../images/icon_maintenancer.png')}
                                    />
                                    <SDLText style={{ color: '#999' }}> 运维负责人</SDLText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <SDLText fontType={'small'} style={{ maxWidth: 100, color: '#666' }}>
                                        {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['OperationName'], '-') || '-'}
                                    </SDLText>
                                    <SDLText fontType={'small'} style={{ color: '#666' }}>
                                        {' | '}
                                    </SDLText>
                                    <SDLText
                                        fontType={'small'}
                                        onPress={() => {
                                            makePhone(this.props.ponitInfo.data.Datas[0]['OperationPhone']);
                                        }}
                                        style={{ color: '#64A9EF' }}
                                    >
                                        {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['OperationPhone'], '-') || '-'}
                                    </SDLText>
                                </View>
                            </View>
                        </View>
                        {(SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '12') &&
                            SentencedToEmpty(this.props.cityNewModel, ['MonitorTime'], '') != '' ? (
                            <View style={{ width: SCREEN_WIDTH, marginTop: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: SCREEN_WIDTH }}>
                                <View style={{ backgroundColor: 'white', alignItems: 'center', flexDirection: 'row', padding: 15, marginTop: 10, justifyContent: 'space-between', width: SCREEN_WIDTH }}>
                                    <SDLText style={{ color: '#333' }}>{`最新监测数据    ${SentencedToEmpty(this.props.cityNewModel, ['MonitorTime'], '').split(' ')[1]}`}</SDLText>

                                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                        <SDLText style={{ marginLeft: 20, fontWeight: '500' }}>AQI</SDLText>
                                        <View style={{ marginLeft: 5, backgroundColor: SentencedToEmpty(this.props.cityNewModel, ['Color'], '#fff'), alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                            <SDLText style={{ paddingLeft: 2, paddingRight: 2, fontWeight: '900', color: '#fff' }}>{SentencedToEmpty(this.props.cityNewModel, ['AQI'], '-')}</SDLText>
                                        </View>
                                    </View>
                                    {/* 
                                        <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                        <SDLText style={{ marginLeft: 20, fontWeight: '900' }}>首要污染物 {SentencedToEmpty(this.props.cityNewModel, ['PrimaryPollutantName'], '-')}</SDLText>
                                    </View>
*/}
                                </View>
                                {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '5' ? this.getSubAqiView() : null}
                                {SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '12' ? this.getSubDustView() : null}
                                {this.getAqiBar()}
                            </View>
                        ) : null}

                        <View style={{ flex: 1, backgroundColor: 'white', width: SCREEN_WIDTH, marginTop: 10 }}>
                            <View style={{ width: SCREEN_WIDTH, padding: 15 }}>
                                <SDLText style={{ color: '#333' }}>系统功能</SDLText>
                            </View>
                            <View style={{ marginLeft: 13, width: SCREEN_WIDTH - 26, flex: 1, flexDirection: 'row', marginTop: 0, flexWrap: 'wrap' }}>
                                {this.props.systemMenu.map((item, key) => {
                                    if (SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '5' || SentencedToEmpty(this.props.ponitInfo.data.Datas[0], ['PollutantTypeCode'], '') == '12') {
                                        switch (item.id) {
                                            case 'f4f359b4-6c27-4757-84f4-00df140e011d': //超标数据 运维
                                            case 'bc2efeff-b775-47e8-bb61-cbf8b8a31e7a': //停机记录 运维
                                            case 'e59b5992-d796-42a9-94f4-1ef819de62b9': //超标限值 运维
                                            case '6ccf32ce-a416-4578-b2cf-02aec0766d81': //现场处置 运维
                                            case 'cb5cdbf6-d098-4d36-bd29-a59ab5d62d52': //处置记录 运维
                                            case '236e202b-db8e-405f-bf96-bce36af895be': //核实记录 运维
                                            case 'b3f6a1dc-23da-4150-ace1-bc83788cd7c1': //超标核实 运维

                                            case 'a1bdee58-5032-4487-893c-ab37c9f079d0': //超标记录 监控
                                            case '2a21f58e-89ae-4bc7-8eec-9dce6df9487c': //停机记录 监控
                                            case 'c8291635-cc6e-4086-9666-766f8f929204': //超标限值 监控
                                            case '6ea49f41-b707-4d47-9e9e-1feff965d7da': //现场处置 监控
                                            case '8a457123-dbbc-4213-b0cb-ebe26b264abc': //处置记录 监控
                                            case 'dc136895-e4bb-44c8-ad0e-100eb66aea26': //核实记录 监控
                                            case 'fccbe5e5-4b8d-41fa-a8be-f4fd53d8d19d': //超标核实 监控
                                                return null;
                                        }
                                    }
                                    return (
                                        <TouchableOpacity
                                            key={`a${key}`}
                                            onPress={() => {
                                                this.click(item);
                                            }}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <View style={[{ width: (SCREEN_WIDTH - 26) / 4, height: 64, justifyContent: 'center', alignItems: 'center' }]}>
                                                <Image style={{ width: 25, height: 25 }} source={{ uri: IconUrl + this.findImage(item) }} />

                                                <SDLText fontType={'small'} style={[{ marginTop: 10, color: '#666666' }]}>
                                                    {item.name}
                                                </SDLText>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        {/* <View style={{ height: 10, width: SCREEN_WIDTH }} /> */}
                    </ScrollView>
                ) : null}
            </StatusPage>
        );
    }

    getSubDustView = () => {
        let cityNewModel;
        if (this.props.cityNewModel) {
            cityNewModel = this.props.cityNewModel;
        }
        if (!cityNewModel) return null;
        const subViews = [];
        const PrimaryPollutantCode = SentencedToEmpty(this.props.cityNewModel, ['PrimaryPollutantCode'], '');

        const subData = [
            { title: 'PM2.5', value: Number(cityNewModel['a34004']), color: cityNewModel['a34004_LevelColor'] ? cityNewModel['a34004_LevelColor'] : '#ddd', unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf('a34004') >= 0 },
            { title: 'PM10', value: Number(cityNewModel['a34002']), color: cityNewModel['a34002_LevelColor'] ? cityNewModel['a34002_LevelColor'] : '#ddd', unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf('a34002') >= 0 },
            { title: 'TSP', value: Number(cityNewModel['a34001']), color: '#dddddd', unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf('a34001') >= 0 },
            { title: '风速', value: Number(cityNewModel['a01007']), color: '#dddddd', unit: 'm/s', isPrimary: PrimaryPollutantCode.indexOf('a01007') >= 0 }
        ];

        subData.map((item, index) => {
            subViews.push(
                <View key={`dust_${index}`} style={{ flexDirection: 'row', alignItems: 'center', width: SCREEN_WIDTH / 2 - 26, height: 28, marginBottom: 4, paddingLeft: 4, paddingRight: 4, backgroundColor: item.color }}>
                    <SDLText style={{ color: '#333' }}>{item.title}</SDLText>
                    {item.isPrimary ? (
                        <View style={{ justifyContent: 'center', marginBottom: 15, alignItems: 'center', width: 12, height: 12, borderRadius: 6, backgroundColor: '#f00' }}>
                            <Text style={{ color: '#fff', fontSize: 10 }}>{'首'}</Text>
                        </View>
                    ) : null}
                    <SDLText style={{ color: '#333', textAlign: 'right', flex: 1 }}>{item.value == null || typeof item.value == 'undefined' ? '-' : `${item.value}${item.unit}`}</SDLText>
                </View>
            );
        });

        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    backgroundColor: '#ffffff',
                    paddingBottom: 10
                }}
            >
                {subViews}
            </View>
        );
    };

    /**
     * 获取六项最新值
     * @memberof Home
     */
    getSubAqiView = () => {
        let cityNewModel;
        if (this.props.cityNewModel) {
            cityNewModel = this.props.cityNewModel;
        }
        if (!cityNewModel) return null;

        const subAqiViews = [];
        const PrimaryPollutantCode = SentencedToEmpty(this.props.cityNewModel, ['PrimaryPollutantCode'], '');

        const subAqiData = [
            { title: 'PM2.5', value: Number(cityNewModel[getAirPM25Code()]), color: cityNewModel[`${getAirPM25Code()}_LevelColor`], unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirPM25Code()) >= 0 },
            { title: 'PM10', value: Number(cityNewModel[getAirPM10Code()]), color: cityNewModel[`${getAirPM10Code()}_LevelColor`], unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirPM10Code()) >= 0 },
            { title: 'NO2', value: Number(cityNewModel[getAirNO2Code()]), color: cityNewModel[`${getAirNO2Code()}_LevelColor`], unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirNO2Code()) >= 0 },
            { title: 'SO2', value: Number(cityNewModel[getAirSO2Code()]), color: cityNewModel[`${getAirSO2Code()}_LevelColor`], unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirSO2Code()) >= 0 },
            { title: 'O3', value: Number(cityNewModel[getAirO3Code()]), color: cityNewModel[`${getAirO3Code()}_LevelColor`], unit: 'ug/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirO3Code()) >= 0 },
            { title: 'CO', value: Number(cityNewModel[getAirCOCode()]), color: cityNewModel[`${getAirCOCode()}_LevelColor`], unit: 'mg/m3', isPrimary: PrimaryPollutantCode.indexOf(getAirCOCode()) >= 0 }
        ];

        subAqiData.map((item, index) => {
            let progressNum = (1.0 * item.value) / 500;
            if (typeof progressNum != 'number' || isNaN(progressNum)) {
                progressNum = 0;
            }
            subAqiViews.push(
                <View key={index.toString()} style={{ flexDirection: 'column', width: SCREEN_WIDTH / 3, alignItems: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 15,
                            marginTop: 8,
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}
                    >
                        <Text style={{ color: '#666', fontSize: 15 }}>{item.value || '-'}</Text>
                        <Text style={{ color: '#999', fontSize: 12 }}>{item.unit}</Text>
                    </View>
                    <Progress.Bar progress={progressNum} borderWidth={0} color={item.color} unfilledColor={'#dddddd'} width={86} style={{ marginTop: 6, marginBottom: 6 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 12 }} />
                        <Text style={{ color: '#999', fontSize: 12, marginBottom: 15 }}>{item.title}</Text>
                        <View style={{ justifyContent: 'center', marginBottom: 15, alignItems: 'center', width: 12, height: 12, borderRadius: 6, backgroundColor: item.isPrimary ? '#f00' : '#fff' }}>
                            <Text style={{ color: '#fff', fontSize: 10 }}>{'首'}</Text>
                        </View>
                    </View>
                </View>
            );
        });
        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    paddingTop: 12
                }}
            >
                {subAqiViews}
            </View>
        );
    };

    /**
     * 获取AQI的24小时趋势
     * @memberof Home
     */
    getAqiBar = () => {
        let cityAQIDataList;
        if (this.props.cityAQIDataList) cityAQIDataList = this.props.cityAQIDataList;
        return (
            <View style={{ flexDirection: 'column', backgroundColor: '#fff', marginTop: 10, alignItems: 'center', height: 180 }}>
                <SDLText style={{ padding: 15, fontSize: 14, color: '#333', paddingLeft: 13, width: SCREEN_WIDTH }}>{'历史AQI24小时趋势'}</SDLText>
                <AqiBar height={120} width={SCREEN_WIDTH} cityAQIDataList={cityAQIDataList} />
            </View>
        );
    };

    click = item => {
        if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
            switch (item.id) {
                case '6d5b5e59-8833-496c-89b6-461eacf1bfbb':
                    // 异常报告
                    this.props.dispatch(createAction('pointDetails/updateState')({ abnormalListDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'AbnormalityReportLst', params: { abnormalListDGIMN: this.props.route.params.params.DGIMN } }));
                    break;
                case 'f9801b6d-9b89-4465-8a63-d57ed31b46a1':
                    // 基础设置
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'BaseFacilities', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    break;
                case 'b3f6a1dc-23da-4150-ace1-bc83788cd7c1':
                    // 超标报警核实
                    this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VerifyRecords',
                            params: {
                                pageType: 'OverAlarmVerify'
                            }
                        })
                    );
                    break;
                case '4b2f2a58-d18a-4fe1-97bb-03d2609d6fa4':
                    //数据查询
                    this.props.dispatch(createAction('historyDataModel/updateState')({
                        showIndex: getShowIndex({}),
                        chartOrList: 'chart',
                    }));
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    break;
                case 'f4f359b4-6c27-4757-84f4-00df140e011d':
                    // '超标数据'
                    this.props.dispatch(createAction('pointDetails/updateState')({ overDataListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OverData',
                            params: {}
                        })
                    );
                    break;
                case 'dc136895-e4bb-44c8-ad0e-100eb66aea26':
                    //核实记录
                    this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VerifyRecords',
                            params: {}
                        })
                    );
                    break;
                case '6ccf32ce-a416-4578-b2cf-02aec0766d81':
                    //'报警记录'
                    this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'], AlarmRecords: '' }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'AlarmRecords',
                            params: {
                                pageType: 'AlarmRecords',
                                functionType: 'AlarmDetail',
                                pagehide: '1'
                            }
                        })
                    );
                    break;
                case '8af79971-96d2-4bc2-bfc3-e52b4f6e4b30':
                    //视频监控
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VideoList',
                            params: {
                                DGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN']
                            }
                        })
                    );
                    break;
                case 'cb5fb48f-a7c9-466e-9306-1d5d623b4297':
                    //运维日志
                    this.props.dispatch(createAction('pointDetails/updateState')({
                        operationLogsListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN']
                        , operationLogsType: -1
                    }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OperationLog',
                            params: {}
                        })
                    );
                    break;
                case '50feba5c-2af5-4872-84a3-fe3d74ff5334':
                    //异常数据
                    this.props.dispatch(createAction('alarm/updateState')({ exceptionDataListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'ExceptionData',
                            params: {}
                        })
                    );
                    break;
                case '96fc2848-ca34-4a95-9c80-02c97a50d32b':
                    //运维派单 DistributeTask
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'DistributeTask',
                            params: {
                                DGIMN: this.props.route.params.params.DGIMN,
                                entName: this.props.route.params.params.TargetName,
                                pointName: SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PointName'], ''),
                                PollutantType: SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '')
                                // pointName: this.props.ponitInfo.data.Datas[0]['PointName'],
                                // PollutantType: this.props.ponitInfo.data.Datas[0]['PollutantType']
                            }
                        })
                    );
                    break;
                case '3377e4b8-433e-4594-b093-280a3124e892':
                    //设备资料库
                    this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'InformationBankOfEquipment',
                            params: {}
                        })
                    );
                    break;
                case 'e59b5992-d796-42a9-94f4-1ef819de62b9':
                    //超标限值
                    this.props.dispatch(createAction('pointDetails/updateState')({ overLimitsDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OverLimits',
                            params: {}
                        })
                    );
                    break;
                case 'bc2efeff-b775-47e8-bb61-cbf8b8a31e7a':
                    //停机记录
                    console.log('this.props = ', this.props);
                    this.props.dispatch(createAction('pointDetails/updateState')({ outputStopListDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'SuspendProductionList',
                            params: {}
                        })
                    );
                    break;
                case '5401aa02-6bd1-47b9-afbf-0af7cfb035f6':
                    //运维工单
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'PointTaskRecord', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    break;
                case '9dda0f41-2390-46d8-8d9b-2f8ad81c4521':
                    // 缺失数据
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'MissDataList',
                            params: {}
                        })
                    );
                    break;
            }
        } else {
            switch (item.id) {
                case '57951163-ff33-47c4-88d9-4fd016d95628':
                    // 缺失数据
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'MissDataList',
                            params: {}
                        })
                    );
                    break;
                case 'fccbe5e5-4b8d-41fa-a8be-f4fd53d8d19d':
                    // 超标报警核实
                    this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VerifyRecords',
                            params: {
                                pageType: 'OverAlarmVerify'
                            }
                        })
                    );
                    this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    break;
                case '2a21f58e-89ae-4bc7-8eec-9dce6df9487c':
                    //停机记录
                    this.props.dispatch(createAction('pointDetails/updateState')({ outputStopListDGIMN: this.props.route.params.params.DGIMN }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'SuspendProductionList',
                            params: {}
                        })
                    );
                    break;
                case '7dbc22e1-1eab-41ba-af86-90ef933910e7':
                    //数据查询
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'HistoryData', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    // 排口任务记录
                    // this.props.dispatch(NavigationActions.navigate({ routeName: 'PointTaskRecord', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    break;
                case 'a1bdee58-5032-4487-893c-ab37c9f079d0':
                    // '超标数据'
                    this.props.dispatch(createAction('pointDetails/updateState')({ overDataListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OverData',
                            params: {}
                        })
                    );
                    break;
                case '8a457123-dbbc-4213-b0cb-ebe26b264abc':
                    //核实记录或者处置记录
                    if (this.props.isVerifyOrHandle == 'handle') {
                        this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'DisposalRecord',
                                params: {}
                            })
                        );
                    } else {
                        this.props.dispatch(createAction('pointDetails/updateState')({ verifyListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'VerifyRecords',
                                params: {}
                            })
                        );
                    }

                    break;
                case '6ea49f41-b707-4d47-9e9e-1feff965d7da':
                    //'报警记录'
                    this.props.dispatch(createAction('pointDetails/updateState')({ alarmRecordsListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'], AlarmRecords: '' }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'AlarmRecords',
                            params: {
                                pageType: 'AlarmRecords',
                                functionType: 'AlarmVerify' //AlarmDetail查看报警详情，AlarmResponse报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)
                            }
                        })
                    );
                    break;
                case '8af79971-96d2-4bc2-bfc3-e52b4f6e4b30':
                    //视频监控
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'VideoList',
                            params: {
                                DGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN']
                            }
                        })
                    );
                    break;
                case '82535ab1-c375-4f45-bf87-7b561469cc66':
                    //运维日志
                    this.props.dispatch(createAction('pointDetails/updateState')({
                        operationLogsListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN']
                        , operationLogsType: -1
                    }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OperationLog',
                            params: {}
                        })
                    );
                    break;
                case '8c34acb1-feca-4245-8c5f-9b98e5e29741':
                    //异常数据
                    this.props.dispatch(createAction('alarm/updateState')({ exceptionDataListTargetDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'ExceptionData',
                            params: {}
                        })
                    );
                    break;
                case '96fc2848-ca34-4a95-9c80-02c97a50d32b':
                    //运维派单 DistributeTask
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'DistributeTask',
                            params: {
                                DGIMN: this.props.route.params.params.DGIMN,
                                entName: this.props.route.params.params.TargetName,
                                pointName: SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PointName'], ''),
                                PollutantType: SentencedToEmpty(this.props.ponitInfo, ['data', 'Datas', 0, 'PollutantType'], '')
                                // pointName: this.props.ponitInfo.data.Datas[0]['PointName'],
                                // PollutantType: this.props.ponitInfo.data.Datas[0]['PollutantType']
                            }
                        })
                    );
                    break;
                case 'ace78718-dd8b-4b4d-ba8a-4ab6c18bbe1f':
                    //设备资料库
                    this.props.dispatch(createAction('pointDetails/updateState')({ equipmentInfoDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'InformationBankOfEquipment',
                            params: {}
                        })
                    );
                    break;
                case 'c8291635-cc6e-4086-9666-766f8f929204':
                    //超标限值
                    this.props.dispatch(createAction('pointDetails/updateState')({ overLimitsDGIMN: this.props.ponitInfo.data.Datas[0]['DGIMN'] }));
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'OverLimits',
                            params: {}
                        })
                    );
                    break;
                case 'c63b0480-e310-4877-a8d7-031630fa769c':
                    //运维工单
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'PointTaskRecord', params: { DGIMN: this.props.route.params.params.DGIMN } }));
                    break;
            }
        }
    };
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
