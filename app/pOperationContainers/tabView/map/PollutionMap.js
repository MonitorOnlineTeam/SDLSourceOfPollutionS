import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { connect } from 'react-redux';
import { MapView, Marker, Polygon } from 'react-native-amap3d';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { getImageByType, getStatusByCode, checkAlarmByPointList, checkAlarmByTargetList, getTargetImageByType } from '../../../pollutionModels/utils';
import { StatusPagem, SimpleLoadingComponent, Touchable, SDLText, SimpleLoadingView } from '../../../components';
import MapPopContainer from './components/MapPopContainer';
import TextLabel from '../../components/TextLabel';
import DashSecondLine from '../../../components/DashSecondLine';
import { random5 } from '../../../gridModels/mathUtils';

const markerImageSize = 18;
const ic_alarm_icon = require('../../../images/ic_alarm_icon.png');
const mapImages = [
    require('../../../images/ic_ent.png'),
    require('../../../images/ic_site.png'),
    require('../../../images/ic_gas.png'),
    require('../../../images/ic_water.png'),
    require('../../../images/ic_voc.png'),
    require('../../../images/ic_dust.png'),
    require('../../../images/ic_monitoring_station.png'),
    require('../../../images/ic_stop.png'),
    ic_alarm_icon
];
/**
 * 地图
 * @class Audit
 * @extends {Component}
 */
@connect(({ map, websocket }) => ({
    legends: map.legends, //图例
    region: map.showRegion, //地图显示范围，选择企业后切换
    showEntList: map.showEntList, //需要展示的企业结合
    otherPointList: map.otherPointList, //大气站、水站等监测点 默认展示在地图
    showPointList: map.showPointList, //需要展示的站点集合 有站点时候 不显示企业
    mapStatus: map.mapStatus, //状态页
    selectEnt: map.selectEnt, //选中的企业 内含有lines 代表厂界
    RealTimeAlarms: websocket.RealTimeAlarms //实时报警
}))
class PollutionMap extends Component {
    static navigationOptions = {
        header: null
    };

    static defaultProps = {
        switchScale: 7
    };

    constructor(props) {
        super(props);
        this.state = {
            showLegend: true,
            zoomLevel: 9
        };
    }

    componentDidMount() { }

    /** 刷新页面 */
    refresh = () => {
        console.log('this.mapView = ', this.mapView);
        // this.mapView.destorydd();
        this.props.dispatch(createAction('map/loadEntListFirstTime')({ params: { source: 'map' } })); //首次加载
        this.props.dispatch(createAction('map/GetPhoneMapLegend')({ params: {} }));

        // const { selectEnt } = this.props;
        // if (selectEnt) {
        // } else {
        // }
    };

    /** 点击企业获取站点信息 */
    clickEnt = entCode => {
        this.props.dispatch(createAction('map/getPointListByEntCode')({ params: { entCode, source: 'map' } }));
    };

    /** 点击站点弹出气泡 */
    clickPoint = DGIMN => {
        // this.mapView.destorydd();
        this.props.dispatch(createAction('map/getPointLastData')({ params: { DGIMN } }));
        // ShowToast('--');
    };

    /* 地图状态变化完成事件 */
    onStatusChangeComplete = ({ nativeEvent }) => {
        this.setState({ zoomLevel: nativeEvent.zoomLevel });
        if (nativeEvent.zoomLevel === 10) {
            return;
        }
        if (nativeEvent.zoomLevel < 11) {
            const { selectEnt } = this.props;
            if (selectEnt) {
                const { Id: entCode } = selectEnt;
                this.props.dispatch(createAction('map/dismissPoints')({ params: { entCode } })); //取消展示站点
            }
        }
    };
    /* 地图状态变化完成事件 */
    onStatusChangeCompleteiOS = ({ center, region, zoomLevel }) => {
        this.setState({ zoomLevel: zoomLevel });
        if (zoomLevel === 10) {
            return;
        }
        if (zoomLevel < 11) {
            const { selectEnt } = this.props;
            if (selectEnt) {
                const { Id: entCode } = selectEnt;
                this.props.dispatch(createAction('map/dismissPoints')({ params: { entCode } })); //取消展示站点
            }
        }
    };
    /** 绘制厂界面 */
    renderEntPolygon = () => {
        const { selectEnt } = this.props;
        if (selectEnt) {
            const { lines } = selectEnt;
            if (lines && lines.length > 0) {
                const entPolygons = [];
                lines.map((line, index) => {
                    entPolygons.push(<Polygon key={`polygon_${index}`} coordinates={line} strokeWidth={1} strokeColor={'#0232ff33'} fillColor={'#a3ccff33'} />);
                });
                return entPolygons;
            }
        }
    };
    getEntPlygons = () => {
        let entPolys = [];
        if (this.props.curPage == 'pollution') {
            const { selectEnt } = this.props;
            if (selectEnt) {
                const { lines } = selectEnt;
                if (lines && lines.length > 0) {
                    lines.map((line, index) => {
                        entPolys.push({ latitude: line.latitude, longitude: line.longitude });
                    });
                }
            }
        }
        return [entPolys];
    };
    /** 渲染其他类型监测点列表 */
    renderOtherLayer = () => {
        const { otherPointList } = this.props;
        return this.renderPointLayer(otherPointList);
    };

    /** 渲染排口列表 */
    renderOutletLayer = () => {
        const { showPointList } = this.props;
        return this.renderPointLayer(showPointList);
    };

    /** 渲染站点列表 */
    renderPointLayer = showPointList => {
        // console.log('renderPointLayer showPointList = ', showPointList);
        // isPoint 是否为普通排口，fasle表示监测站下的监测点
        const pointMarkers = [];
        const { RealTimeAlarms } = this.props;
        if (showPointList) {
            checkAlarmByPointList(showPointList, 'DGIMN', RealTimeAlarms);

            showPointList.map((item, index) => {
                let isOutLet = item.PollutantType == '1' || item.PollutantType == '2';
                const { MonitorPollutants } = item;

                // 计算气泡的高度
                const colNum = 4; //气泡里面一排几个污染物（除以二）
                const lineHeight = 30; //气泡中 污染源行高
                const showPollutantNum = item.PollutantType == '5' || item.PollutantType == '12' ? 8 : 6;
                const pollutantNum = MonitorPollutants.length > showPollutantNum ? showPollutantNum : MonitorPollutants.length;
                const popHeight = ((pollutantNum + colNum / 2 - 1) / (colNum / 2)) * lineHeight + 64; //计算出气泡总高度(公式不要乱动 调最后那个值)
                const { Latitude: latitude = null, Longitude: longitude = null, DeviceStatus, PollutantType } = item;
                if (latitude && longitude)
                    pointMarkers.push(
                        <MapView.Marker
                            key={`point_${index.toString()}`}
                            onPress={() => {
                                this.clickPoint(item.DGIMN); //点击排口 弹出pop
                            }}
                            infoWindowDisabled={false}
                            anchor={{ x: 0.5, y: 0.5 }}
                            cusBottomMargin={-10} //距离marker顶部高
                            //头部50+表格行数*30+上下空间20，这俩属性安卓可能用不到，ios原生地图气泡宽高
                            cusViewHeight={popHeight}
                            cusViewWidth={305}
                            coordinate={{ latitude, longitude }}
                            icon={() => {
                                const circleSize = 18;
                                const imageSize = 13;
                                if (isOutLet) {
                                    if (item.outPutFlag == '1' || item.outPutFlag == 1) {
                                        return (
                                            <View style={{ width: 100, height: 58, backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <View
                                                    style={{
                                                        width: circleSize,
                                                        height: circleSize,
                                                        borderRadius: circleSize / 2,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderWidth: 1,
                                                        borderColor: getStatusByCode(DeviceStatus).color,
                                                        backgroundColor: '#fff'
                                                    }}
                                                >
                                                    <Image style={{ width: imageSize, height: imageSize, tintColor: getStatusByCode(DeviceStatus).color }} source={getImageByType(PollutantType).image} />
                                                </View>
                                                <View
                                                    style={{
                                                        maxWidth: 100,
                                                        height: 22,
                                                        marginTop: 5,
                                                        paddingLeft: 2,
                                                        paddingRight: 2,
                                                        borderColor: '#ffffffcc',
                                                        borderRadius: 2,
                                                        borderWidth: 1,
                                                        backgroundColor: '#ffffffcc',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#333', fontSize: 13, maxWidth: 200 }}>
                                                        {item.PointName}
                                                    </Text>
                                                </View>
                                                <SDLText style={{ fontSize: 10, backgroundColor: '#ff000022', color: '#ff0000', lineHeight: 12, paddingVertical: 0, paddingLeft: 2, paddingRight: 2 }}>{'停运'}</SDLText>
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <View style={{ width: 100, height: 46, backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <View
                                                    style={{
                                                        width: circleSize,
                                                        height: circleSize,
                                                        borderRadius: circleSize / 2,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderWidth: 1,
                                                        borderColor: getStatusByCode(DeviceStatus).color,
                                                        backgroundColor: '#fff'
                                                    }}
                                                >
                                                    <Image style={{ width: imageSize, height: imageSize, tintColor: getStatusByCode(DeviceStatus).color }} source={getImageByType(PollutantType).image} />
                                                </View>
                                                <View
                                                    style={{
                                                        maxWidth: 100,
                                                        height: 22,
                                                        marginTop: 5,
                                                        paddingLeft: 2,
                                                        paddingRight: 2,
                                                        borderColor: '#ffffffcc',
                                                        borderRadius: 2,
                                                        borderWidth: 1,
                                                        backgroundColor: '#ffffffcc',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#333', fontSize: 13, maxWidth: 200 }}>
                                                        {item.PointName}
                                                    </Text>
                                                </View>
                                                {item.Alarm ? <View style={{ position: 'absolute', top: (32 - circleSize) / 2, right: (32 - circleSize) / 2, width: 6, height: 6, borderRadius: 3, backgroundColor: '#e96a6a' }} /> : null}
                                            </View>
                                        );
                                    }
                                } else {
                                    if (this.state.zoomLevel <= this.props.switchScale) {
                                        <View style={{ width: 32, height: 32, backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image style={{ width: markerImageSize, height: markerImageSize, tintColor: item.Point_Color ? item.Point_Color : '#4aa0ff' }} source={getImageByType(PollutantType).image} />
                                        </View>;
                                    } else {
                                        return (
                                            <View style={{ width: 210, height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff00', borderWidth: 1, borderColor: '#ffffff00' }}>
                                                <Image style={{ width: markerImageSize, height: markerImageSize, tintColor: item.Point_Color ? item.Point_Color : '#4aa0ff' }} source={getImageByType(PollutantType).image} />
                                                {item.Alarm ? <View style={{ position: 'absolute', top: (60 - 30) / 2, right: (210 + markerImageSize) / 2, width: 6, height: 6, borderRadius: 3, backgroundColor: '#e96a6a' }} /> : null}
                                                <View
                                                    style={{
                                                        maxWidth: 210,
                                                        height: 22,
                                                        marginTop: 5,
                                                        paddingLeft: 2,
                                                        paddingRight: 2,
                                                        borderColor: '#ffffffcc',
                                                        borderRadius: 2,
                                                        borderWidth: 1,
                                                        backgroundColor: '#ffffffcc',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#333', fontSize: 13, maxWidth: 200 }}>
                                                        {item.PointName}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    }
                                }
                                if (item.outPutFlag == '1' || item.outPutFlag == 1) {
                                    return (
                                        <View style={{ width: 32, height: 32, backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            {isOutLet ? (
                                                <View
                                                    style={{
                                                        width: circleSize,
                                                        height: circleSize,
                                                        borderRadius: circleSize / 2,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderWidth: 1,
                                                        borderColor: getStatusByCode(DeviceStatus).color,
                                                        backgroundColor: '#fff'
                                                    }}
                                                >
                                                    <Image style={{ width: imageSize, height: imageSize, tintColor: getStatusByCode(DeviceStatus).color }} source={getImageByType(PollutantType).image} />
                                                </View>
                                            ) : (
                                                <Image style={{ width: markerImageSize, height: markerImageSize, tintColor: item.Point_Color ? item.Point_Color : '#4aa0ff' }} source={getImageByType(PollutantType).image} />
                                            )}
                                            <SDLText style={{ fontSize: 10, backgroundColor: '#ff000022', color: '#ff0000', lineHeight: 12, paddingVertical: 0, paddingLeft: 2, paddingRight: 2 }}>{'停运'}</SDLText>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={{ width: 32, height: 32, backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            {isOutLet ? (
                                                <View
                                                    style={{
                                                        width: circleSize,
                                                        height: circleSize,
                                                        borderRadius: circleSize / 2,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderWidth: 1,
                                                        borderColor: getStatusByCode(DeviceStatus).color,
                                                        backgroundColor: '#fff'
                                                    }}
                                                >
                                                    <Image style={{ width: imageSize, height: imageSize, tintColor: getStatusByCode(DeviceStatus).color }} source={getImageByType(PollutantType).image} />
                                                </View>
                                            ) : (
                                                <Image style={{ width: markerImageSize, height: markerImageSize, tintColor: item.Point_Color ? item.Point_Color : '#4aa0ff' }} source={getImageByType(PollutantType).image} />
                                            )}
                                            {item.Alarm ? <View style={{ position: 'absolute', top: (32 - circleSize) / 2, right: (32 - circleSize) / 2, width: 6, height: 6, borderRadius: 3, backgroundColor: '#e96a6a' }} /> : null}
                                        </View>
                                    );
                                }
                            }}
                        >
                            <MapPopContainer
                                showPollutantNum={showPollutantNum}
                                height={popHeight}
                                pointInfo={item}
                                onDismiss={() => {
                                    this.mapView.destorydd();
                                }}
                            />
                        </MapView.Marker>
                    );
            });
        }
        return pointMarkers;
    };

    /**
     * 获取站点图标的高度
     * @param MTType 站点类型
     */
    getMarkerImageSize = MTType => {
        if (MTType == 1 || MTType == '1') {
            return 24;
            // return 30;
        } else {
            return markerImageSize;
        }
    };
    /**
     * 渲染企业列表
     * @memberof PollutionMap
     */
    renderEntLayer = () => {
        const entMarkers = [];
        const { showEntList, selectEnt, RealTimeAlarms } = this.props;

        if (selectEnt) return; //点击一个企业时候 不再显示企业marker
        checkAlarmByTargetList(showEntList, 'Id', RealTimeAlarms); //判断是否报警

        if (showEntList && showEntList.length > 0) {
            showEntList.map((item, index) => {
                const { Latitude: latitude = null, Longitude: longitude = null, Id: entCode, MTType } = item;
                if (latitude && longitude)
                    entMarkers.push(
                        <MapView.Marker
                            key={`ent_${index.toString()}`}
                            onPress={() => {
                                this.clickEnt(entCode); //点击企业 展示企业下面的排口
                            }}
                            infoWindowDisabled={true}
                            anchor={{ x: 0.5, y: 0.5 }}
                            cusBottomMargin={-10} //距离marker顶部高
                            //头部50+表格行数*30+上下空间20，这俩属性安卓可能用不到，ios原生地图气泡宽高
                            cusViewHeight={150}
                            cusViewWidth={305}
                            coordinate={{ latitude, longitude }}
                            icon={() => {
                                if (this.state.zoomLevel <= this.props.switchScale) {
                                    return (
                                        <View
                                            style={{ width: this.getMarkerImageSize(MTType), height: this.getMarkerImageSize(MTType), backgroundColor: '#00000000', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <Image style={{ width: this.getMarkerImageSize(MTType), height: this.getMarkerImageSize(MTType) }} source={getTargetImageByType(MTType).image_circle} />
                                            {item.Alarm ? (
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        top: this.getMarkerImageSize(MTType) / 8,
                                                        right: this.getMarkerImageSize(MTType) / 16,
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: 3,
                                                        backgroundColor: '#e96a6a'
                                                    }}
                                                />
                                            ) : null}
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={{ width: 210, height: 60, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff00', borderWidth: 1, borderColor: '#ffffff00' }}>
                                            <Image style={{ width: 30, height: 30 }} source={getTargetImageByType(MTType).image_circle} />
                                            {item.Alarm ? <View style={{ position: 'absolute', top: 30 / 8, right: 210 / 2 - 15, width: 6, height: 6, borderRadius: 3, backgroundColor: '#e96a6a' }} /> : null}
                                            <View
                                                style={{
                                                    maxWidth: 210,
                                                    height: 22,
                                                    marginTop: 5,
                                                    paddingLeft: 2,
                                                    paddingRight: 2,
                                                    borderColor: '#ffffffcc',
                                                    borderRadius: 2,
                                                    borderWidth: 1,
                                                    backgroundColor: '#ffffffcc',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#333', fontSize: 13, maxWidth: 200 }}>
                                                    {item.Name}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                }
                            }}
                        />
                    );
            });
        }
        return entMarkers;
    };

    /* 绘制 图例 按钮 */
    renderLegendBtn = () => {
        if (this.state.showLegend) return null;
        return (
            <Touchable
                onPress={() => {
                    this.setState({ showLegend: true });
                }}
                style={{ position: 'absolute', left: 13, bottom: 40, width: 40, height: 40, backgroundColor: '#fff', borderRadius: 2, justifyContent: 'center', alignItems: 'center' }}
            >
                <Image style={{ width: 18, height: 18, margin: 2 }} source={require('../../../images/map_legend_option.png')} />
                <SDLText style={{ fontSize: 10, color: '#666' }}>{'图例'}</SDLText>
            </Touchable>
        );
    };

    /** 渲染图例 */
    renderLegend = () => {
        if (!this.state.showLegend) {
            return null;
        }
        const imageSize = 15;
        const { legends } = this.props;
        // console.log('原始图例->', legends);
        if (legends) {
            const mLegends = [];
            if (legends.TargetTypes && legends.TargetTypes.length > 0) {
                //找出监控目标的图标
                legends.TargetTypes.map(item => {
                    if (item.TargetType != 2) {
                        let targetType = getTargetImageByType(item.TargetType);
                        mLegends.push({
                            image: targetType.image,
                            name: item.TargetName
                        });
                    }
                });
            }
            if (legends.PointTypes && legends.PointTypes.length > 0) {
                //找出监测点位的图标
                legends.PointTypes.map(item => {
                    let pointType = getImageByType(item.pollutantTypeCode);
                    mLegends.push({
                        image: pointType.image,
                        name: item.pollutantTypeName
                    });
                });
            }
            // console.log('转换后图例->', legends);

            //     return (
            //         <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, backgroundColor: '#00000000', position: 'absolute', left: 0, bottom: 0, alignItems: 'center' }}>
            //             <Touchable
            //                 onPress={() => {
            //                     this.setState({ showLegend: false });
            //                 }}
            //                 style={{ width: 44, height: 15, backgroundColor: '#fff', borderTopLeftRadius: 2, borderTopRightRadius: 2, justifyContent: 'center', alignItems: 'center' }}
            //             >
            //                 <Image source={require('../../../images/ic_arrows_down.png')} style={{ width: 10, height: 10 }} />
            //             </Touchable>
            //             <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, paddingTop: 10, paddingLeft: 13, paddingRight: 13, flexWrap: 'wrap', backgroundColor: '#ffffff' }}>
            //                 {mLegends.map((item, index) => (
            //                     <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginRight: 30 }} key={`legend${index}`}>
            //                         <Image source={item.image} style={{ width: imageSize, height: imageSize }} />
            //                         <SDLText fontType={'small'} style={{ color: '#333', marginLeft: 4, marginRight: 4 }}>
            //                             {item.name}
            //                         </SDLText>
            //                     </View>
            //                 ))}
            //             </View>

            //             <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, paddingTop: 15, paddingBottom: 10, paddingLeft: 13, backgroundColor: '#ffffff' }}>
            //                 <SDLText fontType={'small'} style={{ width: 40, height: 16, textAlign: 'center', lineHeight: 16, color: '#333', backgroundColor: getStatusByCode(0).color }}>
            //                     {'离线'}
            //                 </SDLText>
            //                 <SDLText fontType={'small'} style={{ width: 40, height: 16, textAlign: 'center', lineHeight: 16, color: '#333', backgroundColor: getStatusByCode(1).color, marginLeft: 30 }}>
            //                     {'在线'}
            //                 </SDLText>
            //                 <SDLText fontType={'small'} style={{ width: 40, height: 16, textAlign: 'center', lineHeight: 16, color: '#333', backgroundColor: getStatusByCode(2).color, marginLeft: 30 }}>
            //                     {'超标'}
            //                 </SDLText>
            //                 <SDLText fontType={'small'} style={{ width: 40, height: 16, textAlign: 'center', lineHeight: 16, color: '#333', backgroundColor: getStatusByCode(3).color, marginLeft: 30 }}>
            //                     {'异常'}
            //                 </SDLText>
            //             </View>
            //         </View>
            //     );
            return (
                <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, backgroundColor: '#00000000', position: 'absolute', left: 0, bottom: 0, alignItems: 'center' }}>
                    <Touchable
                        onPress={() => {
                            this.setState({ showLegend: false });
                        }}
                        style={{ width: 44, height: 15, backgroundColor: '#fff', borderTopLeftRadius: 2, borderTopRightRadius: 2, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Image source={require('../../../images/ic_arrows_down.png')} style={{ width: 10, height: 10 }} />
                    </Touchable>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 55, alignItems: 'center', justifyContent: 'space-around', paddingLeft: 13, paddingRight: 13, flexWrap: 'wrap', backgroundColor: '#ffffff' }}>
                        {mLegends.map((item, index) => (
                            <View style={{ alignItems: 'center', marginTop: 5, marginRight: 30 }} key={`legend${index}`}>
                                <Image source={item.image} style={{ width: imageSize, height: imageSize }} />
                                <SDLText fontType={'small'} style={{ color: '#999', marginLeft: 4, marginRight: 4 }}>
                                    {item.name}
                                </SDLText>
                            </View>
                        ))}
                    </View>
                    <View style={[{ backgroundColor: 'white', width: SCREEN_WIDTH, alignItems: 'center' }]}>
                        <DashSecondLine backgroundColor="#ccc" len={130} width={SCREEN_WIDTH - 40} />
                    </View>
                    <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 48, alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 13, backgroundColor: '#ffffff' }}>
                        <SDLText fontType={'small'} style={{ width: 40, height: 18, borderRadius: 2, textAlign: 'center', lineHeight: 16, color: 'white', backgroundColor: getStatusByCode(0).color }}>
                            {'离线'}
                        </SDLText>
                        <SDLText fontType={'small'} style={{ width: 40, height: 18, borderRadius: 2, textAlign: 'center', lineHeight: 16, color: 'white', backgroundColor: getStatusByCode(1).color, marginLeft: 30 }}>
                            {'在线'}
                        </SDLText>
                        <SDLText fontType={'small'} style={{ width: 40, height: 18, borderRadius: 2, textAlign: 'center', lineHeight: 16, color: 'white', backgroundColor: getStatusByCode(2).color, marginLeft: 30 }}>
                            {'超标'}
                        </SDLText>
                        <SDLText fontType={'small'} style={{ width: 40, height: 18, borderRadius: 2, textAlign: 'center', lineHeight: 16, color: 'white', backgroundColor: getStatusByCode(3).color, marginLeft: 30 }}>
                            {'异常'}
                        </SDLText>
                    </View>
                </View>
            );
        }
    };

    renderSelectEnt = () => {
        const { selectEnt } = this.props;
        if (selectEnt) {
            return (
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dae8f888', position: 'absolute', left: 0, top: 0 }}>
                    <SDLText fontType={'normal'} numberOfLines={1} style={{ color: '#666' }}>
                        {`${selectEnt.Name}`}
                    </SDLText>
                </View>
            );
        }
    };

    render() {
        const { mapStatus } = this.props;
        console.log('mapStatus = ', mapStatus);
        const { region } = this.props;
        let polys = this.getEntPlygons();
        return (
            <View style={styles.container}>
                {/* <View
                    style={[{ width: 100, height: 100, backgroundColor: 'red', position: 'absolute', top: 0, left: 0, zIndex: 999 }]}
                >

                </View> */}
                {mapStatus == -1 ? <SimpleLoadingView message={'加载中'} /> : null}
                {/* {mapStatus == -1 || true ? <SimpleLoadingComponent message={'加载中'} /> : null} */}
                {mapImages.map((item, index) => (
                    <Image key={index} style={{ width: 0, height: 0 }} source={item} />
                ))}
                {/* 新疆项目不使用自定义地图 */}
                <MapView
                    ref={ref => (this.mapView = ref)}
                    // cusMap={true}
                    locationEnabled={true}
                    rotateEnabled={false}
                    style={{
                        flex: 1,
                        width: SCREEN_WIDTH
                    }}
                    // zoomLevel={this.state.zoomLevel}
                    coordinate={region ? { latitude: region.latitude, longitude: region.longitude } : { latitude: 41.819963, longitude: 86.888151 }}
                    center={region ? { latitude: region.latitude, longitude: region.longitude } : { latitude: 41.819963, longitude: 86.888151 }}
                    showsCompass={false} //指南针
                    showsScale={false} //比例尺
                    showsLabels={true} //文本标签
                    showsZoomControls={true} //是否显示放大缩小按钮
                    region={region ? region : { latitude: 41.819963, longitude: 86.888151, latitudeDelta: 8, longitudeDelta: 8 }}
                    onStatusChangeComplete={Platform.OS == 'android' ? this.onStatusChangeComplete : this.onStatusChangeCompleteiOS}
                    polygonsArray={polys}
                >
                    {this.renderEntLayer() /* 此处注意 这个方法里面加了判断，如果有站点数据showPointList的时候不显示企业marker */}
                    {this.renderOutletLayer() /* 渲染站点列表 */}
                    {this.renderOtherLayer() /* 渲染其他列表 */}
                    {Platform.OS == 'android' ? this.renderEntPolygon() : null}
                </MapView>

                {/* 图例 */}
                {this.renderLegendBtn()}
                {this.renderLegend()}
                {/* 绘制选中的企业 */}
                {this.renderSelectEnt()}

                {/* 刷新 */}
                <Touchable
                    style={{ width: 40, height: 40, position: 'absolute', right: 13, bottom: 120, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.refresh();
                    }}
                >
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/map_refresh_option.png')} />
                </Touchable>
                {/* 放大 */}
                {/* <Touchable
                    style={{ width: 40, height: 40, position: 'absolute', right: 13, bottom: 70, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.setState({ zoomLevel: this.state.zoomLevel + 2 });
                    }}
                >
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/map_refresh_option.png')} />
                </Touchable> */}
                {/* 缩小 */}
                {/* <Touchable
                    style={{ width: 40, height: 40, position: 'absolute', right: 13, bottom: 30, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.setState({ zoomLevel: this.state.zoomLevel - 2 });
                    }}
                >
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/map_refresh_option.png')} />
                </Touchable> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    }
});

// export default createStackNavigator({ PollutionMap });
export default PollutionMap;
