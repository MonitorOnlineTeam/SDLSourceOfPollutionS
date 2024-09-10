import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction } from '../../../utils';
import { StatusPagem, SimpleLoadingComponent, Touchable, StatusPage, SDLText } from '../../../components';
import MonthBar from '../../components/MonthBar';

/**
 * 运维统计
 * @class Statistics
 * @extends {Component}
 */
@connect(({ taskModel }) => ({
    taskStatistics: taskModel.taskStatistics, //状态
    taskStatisticsData: taskModel.taskStatisticsData //数据
}))
export default class Statistics extends Component {
    static navigationOptions = createNavigationOptions({
        title: '运维统计',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            Month: moment().format('YYYY-MM-01 00:00:00')
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.props.dispatch(createAction('taskModel/GetOperationStatistics')({ params: { Month: this.state.Month } }));
    };

    renderItem = (name, count, index) => {
        return (
            <Touchable key={index.toString()} style={{ width: '100%', height: 40, borderBottomWidth: 0.5, borderBottomColor: '#d9d9d9', flexDirection: 'row', alignItems: 'center' }}>
                <SDLText fontType={'normal'} style={{ flex: 1, color: '#666' }}>
                    {name}
                </SDLText>
                <SDLText fontType={'normal'} style={{ color: '#666' }}>
                    {`${count}次`}
                </SDLText>
                <Image style={{ width: 10, height: 10, marginLeft: 10 }} source={require('../../../images/ic_arrows_down.png')} />
            </Touchable>
        );
    };

    render() {
        const { taskStatistics, taskStatisticsData } = this.props;
        return (
            <StatusPage
                style={[styles.container, { flexDirection: 'column' }]}
                status={taskStatistics}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.getData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.getData();
                }}
            >
                <MonthBar
                    timeStr={moment(this.state.Month).format('YYYY.MM')}
                    onPrePress={() => {
                        this.state.Month = moment(this.state.Month)
                            .subtract(1, 'months')
                            .format('YYYY-MM-01 00:00:00');
                        this.setState({ ...this.state });
                        this.getData();
                    }}
                    onNextPress={() => {
                        this.state.Month = moment(this.state.Month)
                            .add(1, 'months')
                            .format('YYYY-MM-01 00:00:00');
                        this.setState({ ...this.state });
                        this.getData();
                    }}
                />
                <View style={{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#F2F2F2' }} />
                <View style={{ width: SCREEN_WIDTH, paddingLeft: 10, paddingRight: 10, flexDirection: 'column', flex: 1 }}>
                    {this.renderItem('例行运维', taskStatisticsData.PatrolTaskCount, 0)}
                    {this.renderItem('处理应急任务', taskStatisticsData.EmergencyTaskCount, 4)}
                    {this.renderItem('备件更换', taskStatisticsData.SpareCount, 1)}
                    {this.renderItem('保养', taskStatisticsData.ExceptionTaskCount, 2)}
                    {this.renderItem('异常', taskStatisticsData.ExceptionTaskCount, 3)}
                </View>
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
