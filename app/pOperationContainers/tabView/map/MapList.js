import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TouchableWithoutFeedback, FlatList, Platform } from 'react-native';
import { connect } from 'react-redux';

import Popover from 'react-native-popover';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { getImageByType, getStatusByCode, checkAlarmByPointList, checkAlarmByTargetList, getTargetImageByType } from '../../../pollutionModels/utils';
import { StatusPage, Touchable, SDLText, DeclareModule } from '../../../components';
import AlarmIcon from '../../components/AlarmIcon';

import globalcolor from '../../../config/globalcolor';
import TextLabel from '../../components/TextLabel';
import { NavigationActions } from '../../../utils/RouterUtils';

const lineHeight = 45;

/**
 * 地图对应的列表
 * @class Audit
 * @extends {Component}
 */
@connect(({ map, websocket }) => ({
    region: map.showRegion, //地图显示范围，选择企业后切换
    showEntList: map.showEntList_List, //需要展示的企业结合
    showPointList: map.showPointList_List, //需要展示的站点集合
    mapListStatus: map.mapListStatus, //状态页
    selectEnt: map.selectEnt_List, //选中的企业
    RealTimeAlarms: websocket.RealTimeAlarms //实时报警数据
}))
export default class MapList extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            placement: 'bottom',
            buttonRect: { x: 100 - 100 / 2, y: 100 - 80, width: 100, height: 40 },
            // buttonRect: {},
            contentData: ''
        };
    }

    componentDidMount() { }

    /** 刷新页面 注意刷新与第一加载不一样 */
    refresh = () => {
        const { selectEnt } = this.props;
        if (selectEnt) {
            this.clickEnt(selectEnt.Id);
        } else {
            this.props.dispatch(createAction('map/loadEntListFirstTime')({ params: { source: 'mapList' } })); //首次加载
        }
    };

    /** 点击企业获取站点信息 */
    clickEnt = entCode => {
        this.props.dispatch(createAction('map/getPointListByEntCode')({ params: { entCode, source: 'mapList' } }));
    };

    /** 取消企业显示 */
    dismissEnt = entCode => {
        this.props.dispatch(createAction('map/dismissPoints')({ params: { entCode } })); //取消展示站点
    };

    /** 点击站点进行跳转 */
    clickPoint = selectPoint => {
        const { PointName = '名称', DGIMN = '', MTAbbreviation: Abbreviation = '', MonitorTargetName: TargetName = '' } = selectPoint;
        this.props.dispatch(NavigationActions.navigate({ routeName: 'PointDetail', params: { DGIMN, Abbreviation, TargetName, PointName } }));
    };

    /**
     * 渲染顶部
     * 选中一个企业的时候顶部显示结构 企业列表/xxx企业
     */
    renderHeader = () => {
        const { selectEnt } = this.props;
        console.log('selectEnt = ', selectEnt);
        return (
            <View style={{ width: '100%', paddingRight: 13, height: lineHeight, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                <Touchable
                    style={{ height: lineHeight, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        if (selectEnt) {
                            this.dismissEnt(selectEnt.Id);
                        }
                    }}
                >
                    <SDLText fontType={'normal'} style={{ color: selectEnt ? globalcolor.headerBackgroundColor : '#666', paddingLeft: 13, paddingRight: 4 }}>
                        {'污染源列表'}
                    </SDLText>
                </Touchable>
                {selectEnt ? (
                    <SDLText fontType={'normal'} numberOfLines={1} style={{ color: '#666', paddingLeft: 4, paddingRight: 20, flex: 1 }}>{`> ${selectEnt.Name}`}</SDLText>
                ) : (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <DeclareModule
                            iconColor={globalcolor.headerBackgroundColor}
                            iconStyle={{ marginRight: 0 }}
                            options={{
                                headTitle: '说明',
                                innersHeight: 220,
                                messText: `1、长按企业条目弹出【置顶】按钮，点击后永久显示在列表顶部，背景颜色会加深\n2、长按已置顶的企业条目，弹出【取消置顶】按钮，点击后取消置顶，背景颜色变为白色`,
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
                    </View>
                )}
            </View>
        );
    };

    /** 渲染站点条目 */
    renderPointItem = ({ item, index }) => {
        const { PointName, DGIMN, DeviceStatus, PollutantType, Alarm, outPutFlag } = item; //outPutFlag 停运 1是已停运

        let tintColor = '#4aa0ff';
        if (PollutantType == '5' || PollutantType == '12') tintColor = item.Point_Color ? item.Point_Color : '#4aa0ff';
        else tintColor = getStatusByCode(DeviceStatus).color;

        return (
            <Touchable
                key={`ent_${index}`}
                style={{ width: '100%', height: lineHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }}
                onPress={() => {
                    this.clickPoint(item);
                }}
            >
                <Image style={{ width: 18, height: 18, marginLeft: 16, marginRight: 5, tintColor: tintColor }} source={getImageByType(PollutantType).image} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SDLText fontType={'normal'} style={{ color: '#666' }} numberOfLines={1}>
                        {PointName}
                    </SDLText>
                    {outPutFlag == '1' || outPutFlag == 1 ? <TextLabel text={'停运'} color={'#ff0000'} style={{ marginLeft: 4 }} /> : null}
                </View>

                <AlarmIcon style={{ marginRight: 4 }} Alarm={Alarm} />
                <Image style={{ width: 14, height: 14, marginLeft: 5, marginRight: 13 }} source={require('../../../images/right.png')} />
            </Touchable>
        );
    };

    /** 渲染企业条目 */
    renderEntItem = ({ item, index }) => {
        const { Abbreviation, Id, Name, Alarm, MTType, IsTopping: FooterText } = item;
        //FooterText 1代表置顶
        return (
            <Touchable
                key={`ent_${index}`}
                style={{ width: '100%', height: lineHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: FooterText == 0 || FooterText == '0' ? '#fff' : '#f7f7f7', borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }}
                onPress={() => {
                    this.clickEnt(Id);
                }}
                // delayLongPress={1000}
                onLongPress={e => {
                    const {
                        nativeEvent: { pageX, pageY }
                    } = e;
                    const width = 100,
                        height = 40;
                    let placement = 'bottom';
                    if (pageY > SCREEN_HEIGHT - 140) placement = 'top';
                    this.props.dispatch(createAction('map/updateState')({}));
                    let contentData = '置顶';
                    if (FooterText == 0 || FooterText == '0') {
                        //置顶操作
                        this.props.dispatch(createAction('map/updateState')({ addOrDelStickyEntCode: Id, addOrDel: '1' }));
                    } else {
                        contentData = '取消置顶';
                        //取消置顶操作
                        this.props.dispatch(createAction('map/updateState')({ addOrDelStickyEntCode: Id, addOrDel: '0' }));
                    }
                    this.setState({
                        isVisible: true,
                        contentData,
                        placement,
                        buttonRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
                    });
                }}
            >
                <Image style={{ width: 18, height: 18, marginLeft: 16, marginRight: 5 }} source={getTargetImageByType(MTType).image} />
                <SDLText fontType={'normal'} style={{ color: '#666', flex: 1 }} numberOfLines={1}>
                    {Name}
                </SDLText>
                <AlarmIcon style={{ marginRight: 4 }} Alarm={Alarm} />
                <Image style={{ width: 14, height: 14, marginLeft: 5, marginRight: 13 }} source={require('../../../images/right.png')} />
            </Touchable>
        );
    };

    /* 渲染站点列表 */
    renderPoints = () => {
        const { mapListStatus, showPointList, DGIMN, RealTimeAlarms } = this.props;
        if (showPointList == null || typeof showPointList == 'undefined' || showPointList.length == 0) return null;

        checkAlarmByPointList(showPointList, 'DGIMN', RealTimeAlarms); //判断是否报警
        return (
            <FlatList
                style={{ flex: 1, width: '100%' }}
                data={showPointList}
                renderItem={this.renderPointItem}
                refreshing={mapListStatus == -1}
                onRefresh={() => {
                    this.refresh();
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    };

    /* 渲染企业列表 */
    renderEnts = () => {
        const { showPointList, mapListStatus, showEntList, RealTimeAlarms } = this.props;
        if (showPointList && showPointList.length > 0) return null;
        if (showEntList && showEntList.length > 0) checkAlarmByTargetList(showEntList, 'Id', RealTimeAlarms); //判断是否报警
        return (
            <FlatList
                style={{ flex: 1, width: '100%' }}
                data={showEntList}
                renderItem={this.renderEntItem}
                refreshing={mapListStatus == -1}
                onRefresh={() => {
                    this.refresh();
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    };

    // showPopover(ref, content) {
    //         this.setState({
    //             isVisible: true,
    //             contentData: content,
    //             buttonRect: { x: px, y: Platform.OS == 'android' ? py - 85 : py - 105, width: width, height: height }
    //         });
    // }

    closePopover() {
        this.setState({ isVisible: false });
    }

    render() {
        const { mapListStatus } = this.props;
        const displayArea = { x: 0, y: 44 + 20, width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 44 - 44 - 20 };
        return (
            <StatusPage
                status={mapListStatus}
                errorBtnText={'点击重试'}
                emptyBtnText={'点击重试'}
                onErrorPress={() => {
                    this.refresh();
                }}
                onEmptyPress={() => {
                    this.refresh();
                }}
            >
                <View style={styles.container}>
                    {this.renderHeader()}
                    <View style={{ width: '100%', height: 10, backgroundColor: '#F0F0F0' }} />
                    {this.renderPoints()}
                    {this.renderEnts()}
                </View>
                <Popover isVisible={this.state.isVisible} fromRect={this.state.buttonRect} displayArea={displayArea} placement={this.state.placement} onClose={this.closePopover.bind(this)}>
                    <View style={styles.popoverContent}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closePopover();
                                this.props.dispatch(createAction('map/addOrDelStickyEnt')({}));
                            }}
                        >
                            <SDLText>{this.state.contentData}</SDLText>
                        </TouchableOpacity>
                    </View>
                </Popover>
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    popoverContent: {
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    popoverText: {
        color: '#333333'
    }
});
