import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
// import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
// import ApprovalPendingList from './ApprovalPendingList';
import { connect } from 'react-redux';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { StatusPage, Touchable, PickerTouchable } from '../../components';
import { createNavigationOptions, NavigationActions, createAction } from '../../utils';
import TimeLine from './components/TimeLine';
import moment from 'moment';
const ic_filt_arrows = require('../../images/ic_filt_arrows.png');
/**
 * 审批详情
 */
@connect()
export default class ApprovalDetails extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: navigation.state.params.item.ImpPerson + '提交的审批',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0,
            DGIMNs: '',
            selectItem: this.props.route.params.params.item
        };
        _me = this;
        this.props.navigation.setOptions({
            title: this.props.route.params.params.item.ImpPerson + '提交的审批',
        });

    }
    formatShowTime = (time, dataType) => {
        if (time == null || time == '') {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('MM/DD HH:00');
            case 'DayData':
                return moment(time).format('YYYY/MM/DD');
            case 'MonthData':
                return moment(time).format('YYYY/MM');
            case 'YearData':
                return moment(time).format('YYYY年');
        }
    };

    render() {
        return (
            <StatusPage
                status={200}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('错误操作回调');
                }}
            >
                <View style={{ width: SCREEN_WIDTH, height: '40%', backgroundColor: '#ffffff', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{ justifyContent: 'center' }}>
                        <View style={styles.itemStyle}>
                            <Text style={styles.title}>审批编号</Text>
                            <Text style={styles.content}>{this.state.selectItem.ExamNumber}</Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.title}>企业名称</Text>
                            <Text style={styles.content}>{this.state.selectItem.EntName}</Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.title}>监测点位</Text>
                            <Text style={styles.content}>{this.state.selectItem.PointName}</Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.title}>计划执行日期</Text>
                            <Text style={styles.content}>{this.formatShowTime(this.state.selectItem.ImpTime, 'DayData')}</Text>
                        </View>
                        <View style={styles.itemStyle}>
                            <Text style={styles.title}>任务单号</Text>
                            <Text style={styles.content}>{this.state.selectItem.TaskCode}</Text>
                        </View>
                        <Touchable
                            style={styles.itemStyle}
                            onPress={() => {
                                // this.props.dispatch(createAction('taskModel/updateState')({ TaskID: this.state.selectItem.TaskID, DGIMN: this.state.selectItem.DGIMN, TaskCode: this.state.selectItem.TaskID }));
                                // this.props.dispatch(
                                //     NavigationActions.navigate({
                                //         routeName: 'TaskExecution',
                                //         params: { TaskID: this.state.selectItem.TaskID, DGIMN: this.state.selectItem.DGIMN, canTransmitTask: false, TaskCode: this.state.selectItem.TaskID }
                                //     })
                                // );
                                //代办任务没有任务单号
                                this.props.dispatch(createAction('taskModel/updateState')({ TaskID: this.state.selectItem.TaskID, DGIMN: this.state.selectItem.DGIMN }));
                                this.props.dispatch(createAction('taskDetailModel/updateState')({ status: -1 }));
                                this.props.dispatch(
                                    NavigationActions.navigate({
                                        routeName: 'TaskDetail',
                                        params: { taskID: this.state.selectItem.TaskID }
                                    })
                                );
                            }}
                        >
                            <Text style={{ color: '#5688f6' }}>任务单详情</Text>
                        </Touchable>
                    </View>

                    <Image
                        style={{ width: 50, height: 50, position: 'absolute', top: 10, right: 20 }}
                        source={this.state.selectItem.ExamStatus == 0 ? require('../../images/shenpizhong.png') : this.state.selectItem.ExamStatus == 1 ? require('../../images/tongguo.png') : require('../../images/weitongguo.png')}
                    />
                </View>
                <View style={{ width: SCREEN_WIDTH, flex: 1, marginTop: 10, backgroundColor: '#ffffff' }}>
                    <TimeLine approvalDetail={this.state.selectItem} />
                </View>
            </StatusPage>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column'
    },
    itemStyle: {
        flexDirection: 'row',
        marginLeft: 20,
        marginBottom: 10
    },
    title: {
        color: '#999999'
    },
    content: {
        color: '#666666',
        marginLeft: 10
    }
});
