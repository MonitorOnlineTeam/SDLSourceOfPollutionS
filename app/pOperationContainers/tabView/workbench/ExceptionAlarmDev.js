import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../../utils';
import { DeclareModule, Touchable, StatusPage, FlatListWithHeaderAndFooter, SDLText } from '../../../components';
import AlarmList from '../../../pollutionContainers/tabView/alarm/AlarmList';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyTabBarWithCount from '../../../operationContainers/taskViews/taskExecution/components/MyTabBarWithCount';
import moment from 'moment';
import globalcolor from '../../../config/globalcolor';
import { getImageByType } from '../../../pollutionModels/utils';
import TextLabel from '../../../pollutionContainers/components/TextLabel';

/**
 * 异常报警 开发版 增加 数据变化趋势异常报警
 * @class Notice
 * @extends {Component}
 */
@connect(({ alarm }) => ({
    trendCountRuslt: alarm.trendCountRuslt
}))
export default class ExceptionAlarm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '异常报警',
        // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'响应时限说明'}</Text>;
                }}
                options={{
                    headTitle: '响应时限说明',
                    innersHeight: 220,
                    messText: `报警信息如在8:30-17:30发生，需要在4小时内进行响应，如在其他时间发生，需要在12小时之内进行响应`,
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
        )
        // headerRight: (
        //     <View>
        //         <TouchableOpacity
        //             style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
        //             onPress={(e) => {
        //                 const {
        //                     nativeEvent: { pageX, pageY }
        //                 } = e;
        //                 navigation.state.params.navigateRightPress(pageX, pageY);
        //             }}
        //         >
        //             <Image source={require('../../../images/ic_more_option.png')} style={{ width: 18, height: 18, marginRight: 16, tintColor: '#fff' }} />
        //         </TouchableOpacity>
        //     </View>
        // )
    });

    constructor(props) {
        super(props);
        this.state = {
            currentPageIndex: 0,
            isVisible: false,
            spinnerRect: {},
        };
        this.props.navigation.setParams({
            navigateRightPress: (pageX, pageY) => {
                this.showSpinner(pageX, pageY);
            }
        });
    }

    //显示下拉列表
    showSpinner = (pageX, pageY) => {
        pageY = 35;
        const width = 44,
            height = 44;
        const placement = 'bottom';
        this.setState({
            isVisible: true,
            spinnerRect: { x: pageX - width / 2, y: placement == 'bottom' ? pageY - 80 : pageY - 50, width: width, height: height }
        });
    };

    componentDidMount() {
        if (this.state.currentPageIndex == 0) {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'WorkbenchException'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'WorkbenchException'
                })
            );
        } else if (this.state.currentPageIndex == 1) {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'TrendException'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'TrendException'
                })
            );
        }
        this.onRefresh();
        this.getCount();
    }

    getCount = () => {
        this.props.dispatch(createAction('alarm/getAlarmCount')({
            params: {
                alarmType: 'WorkbenchException'
            }
        }));
    }

    onChange = (index) => {
        if (index == 0) {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'WorkbenchException'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'WorkbenchException'
                })
            );
        } else if (index == 1) {
            this.props.dispatch(
                createAction('alarm/updateState')({
                    sourceType: 'TrendException'
                    , monitorAlarmIndex: 1, monitorAlarmTotal: 0
                    , monitorAlarmResult: { status: -1 }
                })
            );
            this.props.dispatch(
                createAction('pointDetails/updateState')({
                    sourceType: 'TrendException'
                })
            );
        }
        this.onRefresh();
        this.getCount();
    }
    onRefresh = () => {
        this.props.dispatch(
            createAction('alarm/getAlarmRecords')({
                params: {
                    BeginTime: moment()
                        // .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00'),
                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    AlarmType: '2',
                    PageIndex: 1,
                    PageSize: 20
                },
            })
        );
    };

    render() {
        return (<ScrollableTabView
            ref={ref => (this.scrollableTabView = ref)}
            onChangeTab={obj => {
                this.onChange(obj.i);
                // console.log('onChangeTab = ',obj);
            }}
            initialPage={0}
            style={{ flex: 1, width: SCREEN_WIDTH }}
            renderTabBar={() => <MyTabBarWithCount tabNames={[
                {
                    label: '数据异常报警', count: SentencedToEmpty(this.props,
                        ['trendCountRuslt', 'data', 'Datas', 'exceptionCount'], 0)
                }
                , {
                    label: '数据变化趋势异常报警', count: SentencedToEmpty(this.props,
                        ['trendCountRuslt', 'data', 'Datas', 'trend'], 0)
                }]} />}
            tabBarUnderlineStyle={{
                width: SCREEN_WIDTH / 2,
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
            <ExceptionAlarmList
                tabLabel="数据异常报警"
                listKey="a"
                key="0"
            />
            <ExceptionAlarmList
                tabLabel="数据变化趋势异常报警"
                listKey="b"
                key="1"
            />
        </ScrollableTabView>);
    }
}

@connect(({ alarm, app }) => ({
    monitorAlarmIndex: alarm.monitorAlarmIndex,
    monitorAlarmTotal: alarm.monitorAlarmTotal,
    monitorAlarmResult: alarm.monitorAlarmResult,
    monitorAlarmData: alarm.monitorAlarmData,
    sourceType: alarm.sourceType
}))
class ExceptionAlarmList extends Component {

    statusOnRefresh = () => {
        this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: 1, monitorAlarmTotal: 0, monitorAlarmResult: { status: -1 } }));
        this.props.dispatch(
            createAction('alarm/getAlarmRecords')({
                params: {
                    BeginTime: moment()
                        // .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00'),
                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    AlarmType: '2',
                    PageIndex: 1,
                    PageSize: 20
                }
            })
        );
    };

    onRefresh = index => {
        this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: index, monitorAlarmTotal: 0 }));
        this.props.dispatch(
            createAction('alarm/getAlarmRecords')({
                params: {
                    BeginTime: moment()
                        // .subtract(1, 'days')
                        .format('YYYY-MM-DD 00:00:00'),
                    EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    AlarmType: '2',
                    PageIndex: 1,
                    PageSize: 20
                },
                setListData: this.list.setListData
            })
        );
    };

    render() {
        return (<StatusPage
            backRef={true}
            status={this.props.monitorAlarmResult.status}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                console.log('重新刷新');
                this.statusOnRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.statusOnRefresh();
                console.log('错误操作回调');
            }}
        >
            <FlatListWithHeaderAndFooter
                ref={ref => (this.list = ref)}
                pageSize={20}
                ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2' }]} />}
                hasMore={() => {
                    return this.props.monitorAlarmData.length < this.props.monitorAlarmTotal;
                }}
                onRefresh={index => {
                    this.onRefresh(index);
                }}
                onEndReached={index => {
                    this.props.dispatch(createAction('alarm/updateState')({ monitorAlarmIndex: index }));
                    this.props.dispatch(
                        createAction('alarm/getAlarmRecords')({
                            params: {
                                BeginTime: moment()
                                    // .subtract(1, 'days')
                                    .format('YYYY-MM-DD 00:00:00'),
                                EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                AlarmType: '2',
                                PageIndex: index,
                                PageSize: 20
                            },
                            setListData: this.list.setListData
                        })
                    );
                }}
                renderItem={({ item, index }) => {
                    const iamgeCircleSize = 28;
                    const imageSize = 16;
                    return (
                        <Touchable
                            onPress={() => {
                                this.props.dispatch(
                                    createAction('pointDetails/updateState')({
                                        alarmRecordsIndex: 1,
                                        alarmRecordsTotal: 0,
                                        alarmRecordsListData: [],
                                        alarmRecordsListTargetDGIMN: item.DGIMN,
                                        alarmRecordsBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
                                        alarmRecordsEndTime: moment().format('YYYY-MM-DD 23:59:59')
                                    })
                                );

                                let functionType = 'AlarmVerify';

                                if (this.props.sourceType == 'WorkbenchException') {
                                    functionType = 'AlarmResponse';
                                } else if (this.props.sourceType == 'TrendException') {
                                    functionType = 'TrendException';
                                }

                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'AlarmRecords',
                                        params: {
                                            OperationEntCode: item.OperationEntCode,
                                            pageType: 'AlarmDetail',
                                            functionType //AlarmDetail查看报警详情，AlarmResponse报警响应，OverVerify超标核实,AlarmVerify报警核实(监管人员核实)
                                            // TrendException 数据变化趋势异常报警
                                        }
                                    })
                                );
                            }}
                            style={{ width: SCREEN_WIDTH, height: 65, marginTop: 0.5, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}
                        >
                            <View
                                style={{
                                    marginLeft: 13,
                                    width: iamgeCircleSize,
                                    height: iamgeCircleSize,
                                    backgroundColor: globalcolor.headerBackgroundColor,
                                    borderRadius: iamgeCircleSize / 2,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image source={getImageByType(item.PollutantType).image} style={{ width: imageSize, height: imageSize, tintColor: '#fff' }} />
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row', marginRight: 8 }}>
                                    <SDLText numberOfLines={1} style={{ color: '#333', maxWidth: 210 }}>
                                        {item.Abbreviation}
                                    </SDLText>
                                    {SentencedToEmpty(item, ['AlarmTag'], '').split(',').map((typeT, index) => {
                                        if (typeT != '') {
                                            return <TextLabel key={index} style={{ marginLeft: 3 }} color={'#75A5FB'} text={typeT} />;
                                        }
                                    })}
                                </View>
                                <SDLText fontType={'small'} style={{ color: '#666', marginTop: 5 }}>
                                    {item.PointName}
                                </SDLText>
                            </View>
                        </Touchable>
                    );
                }}
                data={this.props.monitorAlarmData}
            />
            <Popover
                //设置可见性
                isVisible={this.state.isVisible}
                //设置下拉位置
                fromRect={this.state.spinnerRect}
                placement="bottom"
                //点击下拉框外范围关闭下拉框
                onClose={() => this.closeSpinner()}
                //设置内容样式
                contentStyle={{ opacity: 0.82, backgroundColor: '#343434' }}
                style={{ backgroundColor: 'red' }}
                contentHeight={135}
            >
                <View style={{ alignItems: 'center', }}>
                    {['响应时限说明', '响应核实历史'].map((result, i, arr) => {
                        return (
                            <TouchableOpacity key={i} onPress={() => this.onItemClick(arr[i])} underlayColor="transparent">
                                <Text style={{ fontSize: 16, color: 'white', padding: 8, fontWeight: '400' }}>{arr[i]}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Popover>
        </StatusPage>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
