/**
 * Container for ScrollView/FlatList, providing custom pull-to-refresh Header support
 */
/* eslint-disable */
/**
 * 处理滚动冲突，ScrollView 和 FlatList 需要是该控件的第一子组建
 */
import React from 'react';

import { View, Animated, PanResponder } from 'react-native';
import { SentencedToEmpty } from '../../utils';

// export interface PullToRefreshHeaderProps {
//     // 当前下拉的距离，也穿给header，方便组件内部进行各种自定义计算
//     pullDistance: number;
//     // 当前下拉的百分比 [0, 1]
//     percentAnimatedValue: Animated.AnimatedDivision;
//     // 下拉百分比 [0, 1] 因为percentAnimatedValue 不能直接读取当前值，需要给header直接一个当前比例，方便内部处理
//     percent: number;
//     // 当前是否正在刷新中
//     refreshing: boolean;
// }

// export interface Props {
//     // 容器样式
//     style: ViewStyle;
//     // 下拉刷新的header组件类
//     HeaderComponent: ComponentType<PullToRefreshHeaderProps & RefAttributes<any>>;
//     // Header 组件的高度，也是触发刷新的下拉距离
//     headerHeight: number;
//     // 下拉过程中，可以触发刷新的下拉距离。不穿，则默认等于 headerHeight
//     refreshTriggerHeight?: number;
//     // 正在刷新时，容器保持的顶部距离，如果用户不传，则默认等于 headerHeight
//     refreshingHoldHeight?: number;
//     // 当前是否正在下拉刷新请求数据中
//     refreshing: boolean;
//     // 下拉刷新达到阈值时，回调父级
//     onRefresh: () => void;
//     // 子组件，只能是  ScrollView/FlatList 等
//     children: JSX.Element;
//     // 内部滚动组件，contentOffset.y <= topPullThreshold 时，触发顶部的下拉刷新动作
//     topPullThreshold: number;
// }

// interface State {
//     // 容器顶部的偏移距离
//     containerTop: Animated.Value;
//     scrollEnabled: boolean;
// }

export default class PullToRefresh extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // 容器偏离顶部的距离
            containerTop: new Animated.Value(0),
            // 是否允许内部scrollview滚动
            scrollEnabled: false
        };

        // 当前容器移动的距离
        this.containerTranslateY = 0;
        // 内部scroll容器顶部滚动的距离
        this.innerScrollTop = 0;
        // 容器上的 PanResponder
        this._panResponder = null;
        // header 组件的引用
        this.headerRef = null;
        // inner scroll ref
        this.scrollRef = null;

        this._updateInnerScrollRef = this._updateInnerScrollRef.bind(this);
        this._innerScrollCallback = this._innerScrollCallback.bind(this);
        this._containerTopChange = this._containerTopChange.bind(this);
        this._checkScroll = this._checkScroll.bind(this);
        this._resetContainerPosition = this._resetContainerPosition.bind(this);
        this._isInnerScrollTop = this._isInnerScrollTop.bind(this);
        this.onMoveShouldSetPanResponderCapture = this.onMoveShouldSetPanResponderCapture.bind(this);
        this.onPanResponderGrant = this.onPanResponderGrant.bind(this);
        this.onPanResponderReject = this.onPanResponderReject.bind(this);
        this.onPanResponderMove = this.onPanResponderMove.bind(this);
        this.onPanResponderRelease = this.onPanResponderRelease.bind(this);
        this.onPanResponderTerminate = this.onPanResponderTerminate.bind(this);
        this.onPanResponderTerminationRequest = this.onPanResponderTerminationRequest.bind(this);

        this.state.containerTop.addListener(this._containerTopChange);

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderReject: this.onPanResponderReject,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminationRequest: this.onPanResponderTerminationRequest,
            onPanResponderTerminate: this.onPanResponderTerminate,
            onShouldBlockNativeResponder: () => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            }
        });
    }

    _updateInnerScrollRef(ref) {
        // console.log('====== _updateInnerScrollRef ', ref && ref.scrollToOffset);
        this.scrollRef = ref;
    }

    resetLastPositionY = () => {
        this.lastPositionY = 0;
    }

    onMoveShouldSetPanResponderCapture(event, gestureState) {
        if (this.props.refreshing) {
            // 正在刷新中，不接受再次下拉
            return false;
        }
        if (this.state.scrollEnabled) {
            return false;
        }
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
            return !this.state.scrollEnabled;
        } else {
            this.lastPositionY = gestureState.moveY;
            return false;
        }
    }

    onPanResponderGrant(event, gestureState) {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // gestureState.{x,y} 现在会被设置为0
    }

    onPanResponderReject(event, gestureState) {
        // console.log(`====== reject`);
    }

    onPanResponderMove(event, gestureState) {
        // 最近一次的移动距离为 gestureState.move{X,Y}
        // 从成为响应者开始时的累计手势移动距离为 gestureState.d{x,y}
        if (gestureState.dy >= 0) {
            if (gestureState.dy < 120) {
                this.state.containerTop.setValue(gestureState.dy);
            }
        } else {
            this.state.containerTop.setValue(0);
            if (this.scrollRef) {
                if (typeof this.scrollRef.scrollToOffset === 'function') {
                    // inner is FlatList
                    this.scrollRef.scrollToOffset({
                        offset: -gestureState.dy,
                        animated: true
                    });
                } else if (typeof this.scrollRef.scrollTo === 'function') {
                    // inner is ScrollView
                    this.scrollRef.scrollTo({
                        y: -gestureState.dy,
                        animated: true
                    });
                }
            }
        }
    }

    onPanResponderRelease(event, gestureState) {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        // 判断是否达到了触发刷新的条件
        const threshold = this.props.refreshTriggerHeight || this.props.headerHeight;
        if (this.containerTranslateY >= threshold) {
            // 触发刷新
            this.props.onRefresh();
        } else {
            // 没到刷新的位置，回退到顶部
            this._resetContainerPosition();
        }
        this._checkScroll();
    }

    onPanResponderTerminationRequest(event) {
        // console.log(`====== terminate request`);
        return false;
    }

    onPanResponderTerminate(event, gestureState) {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        // console.log(`====== terminate`, this.innerScrollTop, gestureState.dy, gestureState.dy);
        this._resetContainerPosition();
        this._checkScroll();
    }

    _resetContainerPosition() {
        Animated.timing(this.state.containerTop, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();
    }

    // 下拉容器的过程中，动态传递下拉的距离给 header 组件，直接调用方法，不走本组件的 setState，避免卡顿
    _containerTopChange({ value }) {
        this.containerTranslateY = value;
        if (this.headerRef) {
            this.headerRef.setProgress({
                pullDistance: value,
                percent: value / (this.props.refreshTriggerHeight || this.props.headerHeight)
            });
        }
    }

    _innerScrollCallback(event) {
        this.innerScrollTop = event.nativeEvent.contentOffset.y;
        this._checkScroll();
    }

    _checkScroll() {
        if (this._isInnerScrollTop()) {
            if (this.state.scrollEnabled) {
                this.setState({
                    scrollEnabled: false
                });
            }
        } else {
            if (!this.state.scrollEnabled) {
                this.setState({
                    scrollEnabled: true
                });
            }
        }
    }

    _isInnerScrollTop() {
        return this.innerScrollTop <= this.props.topPullThreshold;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.refreshing && this.props.refreshing) {
            // 从 未加载 变化到 加载中
            const holdHeight = this.props.refreshingHoldHeight || this.props.headerHeight;
            Animated.timing(this.state.containerTop, {
                toValue: holdHeight,
                duration: 150,
                useNativeDriver: true
            }).start();
        } else if (prevProps.refreshing && !this.props.refreshing) {
            // 从 加载中 变化到 未加载
            Animated.timing(this.state.containerTop, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }).start();
        }
    }

    componentWillUnmount() {
        this.state.containerTop.removeAllListeners();
    }

    renderHeader() {
        const style = {
            position: 'absolute',
            left: 0,
            width: '100%',
            top: -this.props.headerHeight,
            transform: [{ translateY: this.state.containerTop }]
        };
        const percent = Animated.divide(this.state.containerTop, this.props.refreshTriggerHeight || this.props.headerHeight);
        const Header = this.props.HeaderComponent;
        return (
            <Animated.View style={[style]}>
                <Header
                    ref={c => {
                        this.headerRef = c;
                    }}
                    percentAnimatedValue={percent}
                    pullDistance={this.containerTranslateY}
                    percent={this.containerTranslateY / this.props.headerHeight}
                    refreshing={this.props.refreshing}
                />
            </Animated.View>
        );
    }

    render() {
        const child = React.cloneElement(this.props.children, {
            onScroll: this._innerScrollCallback,
            bounces: false,
            alwaysBounceVertical: false,
            scrollEnabled: this.state.scrollEnabled,
            ref: this._updateInnerScrollRef
        });
        return (
            <View
                style={[
                    this.props.style
                    // , { borderWidth: 1, borderColor: 'blue' }
                ]}
                {...this._panResponder.panHandlers}
            >
                <Animated.View style={[{ flex: 1, transform: [{ translateY: this.state.containerTop }] }]}>{child}</Animated.View>
                {this.renderHeader()}
            </View>
        );
    }
}

PullToRefresh.defaultProps = {
    style: {
        flex: 1,
        // Android上，不设置这个背景色，貌似会触发  onPanResponderTerminate ！！！
        backgroundColor: '#fff'
    },
    refreshing: false,
    topPullThreshold: 2,
    headerHeight: 50
};
