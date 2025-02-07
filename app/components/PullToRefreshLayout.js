'use strict'

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    PanResponder,
    LayoutAnimation,
    ProgressBarAndroid,
    Dimensions,
    Text,
    // AsyncStorage,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SentencedToEmpty } from '../utils';

let self;
/**ref的引用*/
const PULL_REFRESH_LAYOUT = "pullLayout";
/**屏幕宽度*/
const deviceWidth = Dimensions.get('window').width;
/**下拉阻力系数*/
const factor = 1.8;
/**最大下拉高度*/
const MAX_PULL_LENGTH = 170;
/**Loading的高度*/
const REFRESH_PULL_LENGTH = 70;
/**动画时长*/
const BACK_TIME = 400;
/**存储最后刷新时间的Key*/
const REFRESH_LAST_TIME_KEY = "refresh_last";

const RefreshStatus = {
    Refresh_NONE: 0,
    Refresh_Drag_Down: 1,
    Refresh_Loading: 2,
    Refresh_Reset: 3,
};

const ShowLoadingStatus = {
    SHOW_DOWN: 0,
    SHOW_UP: 1,
    SHOW_LOADING: 2,
};

class PullToRefreshLayout extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            currentDistance: 0,

            pullRefreshStatus: RefreshStatus.Refresh_NONE,

            showPullStatus: ShowLoadingStatus.SHOW_DOWN,

            showPullLastTime: 'NONE',
        };
        this.resetHeader = this.resetHeader.bind(this);
        this.refreshStateHeader = this.refreshStateHeader.bind(this);
        this.getTime = this.getTime.bind(this);
        this.addZeroAtFront = this.addZeroAtFront.bind(this);
    }

    //要求成为响应者
    _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
        console.log('_handleStartShouldSetPanResponder');
        return true;
        // return false;
    }
    _handleMoveShouldSetPanResponder(e: Object, gestureState: Object): boolean {
        console.log('_handleMoveShouldSetPanResponder');
        return true;
        // return false;
    }
    //touch down 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
    _handlePanResponderGrant(e: Object, gestureState: Object) {
        console.log('_handlePanResponderGrant');
    }

    //touch move 响应滑动事件
    _handlePanResponderMove(e: Object, gestureState: Object) {
        console.log('_handlePanResponderMove');
        if (self.state.currentDistance > REFRESH_PULL_LENGTH) {
            if (self.state.showPullStatus === ShowLoadingStatus.SHOW_DOWN) {
                self.setState({
                    showPullStatus: ShowLoadingStatus.SHOW_UP,
                });
            }
        }
        else {
            if (self.state.showPullStatus === ShowLoadingStatus.SHOW_UP) {
                self.setState({
                    showPullStatus: ShowLoadingStatus.SHOW_DOWN,
                });
            }
        }
        if (self.state.pullRefreshStatus === RefreshStatus.Refresh_Loading) {
            self.setState({
                currentDistance: REFRESH_PULL_LENGTH + gestureState.dy / factor,
                // refreshStateHeader:2,
            });
            self.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style: {
                    marginTop: self.state.currentDistance,
                }
            });
            return;
        }
        if (gestureState.dy > 0 && self.state.currentDistance < MAX_PULL_LENGTH) {
            self.setState({
                currentDistance: gestureState.dy / factor,
                pullRefreshStatus: RefreshStatus.Refresh_Drag_Down,
            });
            self.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style: {
                    marginTop: self.state.currentDistance,
                }
            });
        }
        else if (gestureState.dy > 0 && self.state.currentDistance > MAX_PULL_LENGTH) {//则不再往下移动
            self.setState({
                currentDistance: MAX_PULL_LENGTH,
                pullRefreshStatus: RefreshStatus.Refresh_Drag_Down,
            });
            self.refs[PULL_REFRESH_LAYOUT].setNativeProps({
                style: {
                    marginTop: self.state.currentDistance,
                }
            });
        }
    }


    resetHeader() {
        LayoutAnimation.configureNext({
            duration: BACK_TIME,
            update: {
                type: 'linear',
            }
        });
        self.refs[PULL_REFRESH_LAYOUT].setNativeProps({
            style: {
                marginTop: 0,
            }
        });
        self.setState({
            currentDistance: 0,
            pullRefreshStatus: RefreshStatus.Refresh_Reset,
            showPullStatus: ShowLoadingStatus.SHOW_DOWN,
        });
    }

    refreshStateHeader() {
        self.setState({
            pullRefreshStatus: RefreshStatus.Refresh_Loading,
            currentDistance: REFRESH_PULL_LENGTH,
            showPullStatus: ShowLoadingStatus.SHOW_LOADING,
        }, () => {
            if (self.props.onRefresh) {
                self.props.onRefresh();
            }
        });
        LayoutAnimation.configureNext({
            duration: BACK_TIME,
            update: {
                type: 'linear',
            }
        });
        self.refs[PULL_REFRESH_LAYOUT].setNativeProps({
            style: {
                marginTop: REFRESH_PULL_LENGTH,
            }
        });
    }


    addZeroAtFront(count) {
        if (count < 10) {
            count = "0" + count;
        }
        return count;
    }


    getTime() {
        let date = new Date();

        let mMonth = this.addZeroAtFront(date.getMonth() + 1);

        let mDate = this.addZeroAtFront(date.getDate());

        let mHours = this.addZeroAtFront(date.getHours());

        let mMinutes = this.addZeroAtFront(date.getMinutes());

        return mMonth + "-" + mDate + "  " + mHours + ":" + mMinutes;
    }

    stopRefresh() {
        let savedDate = this.getTime();
        self.setState({
            showPullLastTime: savedDate,
        });
        AsyncStorage.setItem(REFRESH_LAST_TIME_KEY, savedDate, () => {

        });
        this.resetHeader();
    }

    _handlePanResponderEnd(e: Object, gestureState: Object) {
        console.log('_handlePanResponderEnd');
        if (self.state.currentDistance >= REFRESH_PULL_LENGTH) {
            self.refreshStateHeader();
        }
        else {
            self.resetHeader();
        }
    }

    componentDidMount() {
        AsyncStorage.getItem(REFRESH_LAST_TIME_KEY, (err, result) => {
            if (result) {
                self.setState({
                    showPullLastTime: result,
                });
            }
        });
    }

    componentWillMount() {
        self = this;
        this._panResponder = PanResponder.create({
            onStartShouldSetResponderCapture: () => {
                console.log("onStartShouldSetResponderCapture");
                return false;
            },
            onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            // 不设置这个参数，是否捕获事件交给onMoveShouldSetPanResponderCapture
            // onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
            onPanResponderTerminationRequest: this.onPanResponderTerminationRequest,
            onShouldBlockNativeResponder: () => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            }
        });
    }

    onPanResponderTerminationRequest(event) {
        return false;
    }

    onMoveShouldSetPanResponderCapture(event, gestureState) {
        console.log("onMoveShouldSetPanResponderCapture");
        // return false;
        // if (this.props.refreshing) {
        //     // 正在刷新中，不接受再次下拉
        //     return false;
        // }
        // if (this.state.scrollEnabled) {
        //     return false;
        // }
        /**
         * 判断是否捕获事件
         * 两次坐标相差大于2认为可以拦截事件
         * 大于20可能是分两次点击距离过远需要重置lastPositionY的位置
         */
        let lastPositionY = SentencedToEmpty(this, ['lastPositionY'], 0);
        let moveY = SentencedToEmpty(gestureState, ['moveY'], 0);
        if (lastPositionY == 0) {
            this.lastPositionY = gestureState.moveY;
            return false;
        } else if (Math.abs(moveY - lastPositionY) > 2
            && Math.abs(moveY - lastPositionY) < 20) {
            // this.lastPositionY = gestureState.moveY;
            this.lastPositionY = 0;
            // return !this.state.scrollEnabled;
            return true;
        } else {
            this.lastPositionY = gestureState.moveY;
            return false;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.showPullStatus !== self.state.showPullStatus) {
            return true;
        }
        if (self.state.showPullLastTime !== nextState.showPullLastTime) {
            return true;
        }
        // 可以控制住组建内部的刷新机制
        if (nextProps != self.props) {
            return true;
        }
        return false;
    }

    render() {
        let pullText;
        let indicatorView;
        if (this.state.showPullStatus === ShowLoadingStatus.SHOW_DOWN) {
            indicatorView = <Image
                style={{ height: 30, width: 30, marginRight: 10 }}
                source={require('../images/chaobiaoxianzhi.png')}
                resizeMode={'contain'}
            />;
            pullText = "下拉刷新";
        }
        else if (this.state.showPullStatus === ShowLoadingStatus.SHOW_UP) {
            indicatorView = <Image
                style={{ height: 30, width: 30, marginRight: 10, transform: [{ rotate: "180deg" }] }}
                source={require('../images/chaobiaoxianzhi.png')}
                resizeMode={'contain'}
            />;
            pullText = "释放刷新";
        }
        else if (this.state.showPullStatus === ShowLoadingStatus.SHOW_LOADING) {
            indicatorView = <ProgressBarAndroid style={{ marginRight: 10, width: 30, height: 30 }} />
            pullText = "刷新中......";
        }
        return (
            <View
                style={[styles.base
                    , {}]}
            >
                <View style={{ backgroundColor: 'white', position: 'absolute', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: deviceWidth, height: REFRESH_PULL_LENGTH, flexDirection: 'row' }}>
                        {indicatorView}
                        <View style={{ height: REFRESH_PULL_LENGTH, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 1 }}>{pullText}</Text>
                            <Text style={{ fontSize: 12, color: '#666', marginTop: 1 }}>最后更新:   {this.state.showPullLastTime}</Text>
                        </View>
                    </View>
                </View>
                <View
                    ref={PULL_REFRESH_LAYOUT}
                    style={{ flex: 1, position: 'absolute' }}  {...this._panResponder.panHandlers} >
                    {this.props.children}
                </View>
            </View>
        );
    }
}

export default PullToRefreshLayout;

var styles = StyleSheet.create({
    base: {
        flex: 1,
        position: 'relative',
    },
});

/**
 *  使用方法
 *  render() {
        return (
            <PullToRefreshLayout QCAStatusResult={this.props.QCAStatusResult} ref={ref => this.layout = ref} style={{ width: SCREEN_WIDTH }} onRefresh={() => {
                // 刷新方法
                this.props.dispatch(createAction('qualityControl/getQCAStatus')({ callback: () => { this.layout.stopRefresh() } }));
            }}>
                <View style={[{ width: SCREEN_WIDTH, flex: 1, backgroundColor: 'white', alignItems: 'center', paddingHorizontal: 15 }]}>
                    ...
                </View>
            </PullToRefreshLayout>
        )
    }
 *
 */

