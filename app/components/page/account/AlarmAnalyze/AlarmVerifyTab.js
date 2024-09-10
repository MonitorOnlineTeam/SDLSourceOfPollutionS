import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Platform, DeviceEventEmitter, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import MyTabBar from '../../../../operationContainers/taskViews/taskExecution/components/MyTabBar';
import AlarmDetails from './AlarmDetails';
import AlarmVerify from './AlarmVerifyAnalyze';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../../../utils';
import { StatusPage, Touchable, ModalParent, SDLText, SimpleLoadingView, AlertDialog } from '../../../../components';
import moment from 'moment';
/**
 * 报警核实
 * @class AlarmVerifyTab
 * @extends {Component}
 */
let alertContent = [];
@connect(({ taskDetailModel }) => ({
    status: taskDetailModel.status,
    taskDetail: taskDetailModel.taskDetail,
    isMyTask: taskDetailModel.isMyTask,
    taskStatus: taskDetailModel.taskStatus,
    taskSingResult: taskDetailModel.taskSingResult
}))
export default class AlarmVerifyTab extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '线索核实',
            headerRight: navigation.state.params.headerRight
        });

    constructor(props) {
        super(props);
        this.state = {
            clockingIn: false,
            errorNum: 0
        };
        let currentItem = SentencedToEmpty(this.props.navigation, ['state', 'params'], {});
        alertContent = [
            {
                text: '未来一天',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.stopAlarm(1);
                }
            },
            {
                text: '未来三天',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.stopAlarm(3);
                }
            },
            {
                text: '未来一周',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.stopAlarm(7);
                }
            },
            {
                text: '未来十五天',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                    this.stopAlarm(15);
                }
            },
            {
                text: '取消',
                onPress: () => {
                    this.refs.doAlert3.hideModal();
                }
            }
        ];
        this.props.dispatch(
            createAction('alarmAnaly/IsHaveStopTime')({
                params: {
                    callback: re => {
                        if (re == false) {
                            this.props.navigation.setParams({
                                headerRight: (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (Platform.OS == 'ios') {
                                                Alert.alert('提示', '请选择暂停报警时间', alertContent);
                                            } else {
                                                this.refs.doAlert3.show();
                                            }
                                        }}
                                    >
                                        {/* <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                                        <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'暂停报警'}</SDLText>
                                    </TouchableOpacity>
                                )
                            });
                        }
                    },
                    dgimn: currentItem.Dgimn,
                    modelGuid: currentItem.WarningTypeCode,
                    warningTime: currentItem.WarningTime
                }
            })
        );
    }

    stopAlarm = timeType => {
        let currentItem = SentencedToEmpty(this.props.navigation, ['state', 'params'], {});

        this.props.dispatch(
            createAction('alarmAnaly/SetStopTime')({
                params: {
                    callback: () => {
                        currentItem.onRefresh();
                        this.props.navigation.setParams({
                            headerRight: null
                        });
                    },
                    dgimn: currentItem.Dgimn,
                    modelGuid: currentItem.WarningTypeCode,
                    stopAlarmBeginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    stopAlarmEndTime: moment()
                        .add(timeType, 'days')
                        .format('YYYY-MM-DD 23:59:59')
                }
            })
        );
    };
    componentDidMount() {
        let currentItem = SentencedToEmpty(this.props.navigation, ['state', 'params'], {});
        if (SentencedToEmpty(currentItem, ['Status'], '') == 1) {
            this.props.dispatch(createAction('alarmAnaly/updateState')({ editCommitEnable: true }));
        } else {
            this.props.dispatch(createAction('alarmAnaly/updateState')({ editCommitEnable: false }));
        }
    }

    onRefresh = () => {};

    onChange = e => {
        const i = e;
    };
    componentWillUnmount() {}
    render() {
        var options = {
            hiddenTitle: true,
            innersHeight: 300
        };
        return (
            <View style={styles.container}>
                <StatusPage
                    status={200}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调

                        this.onRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调

                        this.onRefresh();
                    }}
                >
                    <ScrollableTabView
                        ref={ref => (this.scrollableTabView = ref)}
                        onChangeTab={obj => {
                            this.onChange(obj.i);
                            // console.log('onChangeTab = ',obj);
                        }}
                        style={{ flex: 1, width: SCREEN_WIDTH }}
                        renderTabBar={() => <MyTabBar tabNames={['线索详情', '线索核实']} />}
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
                        <AlarmDetails tabLabel="报警信息" listKey="a" key="0" alarmObj={SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {})} />
                        <AlarmVerify alarmObj={SentencedToEmpty(this.props, ['navigation', 'state', 'params'], {})} tabLabel="任务处理" listKey="b" key="1" />
                    </ScrollableTabView>
                    <AlertDialog components={<MyView />} options={options} ref="doAlert3" />
                </StatusPage>
            </View>
        );
    }
}
class MyView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                {alertContent.map((item, index) => {
                    return (
                        <TouchableOpacity onPress={item.onPress} style={{ padding: 18, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text key={index} style={{ color: 'rgba(0,111,255,1)', fontSize: 18, marginLeft: 10 }}>
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF'
    }
});
