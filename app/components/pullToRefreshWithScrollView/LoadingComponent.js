/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-01-09 10:12:02
 * @LastEditTime: 2024-01-09 14:52:00
 * @FilePath: /SDLMainProject37/app/components/pullToRefreshWithScrollView/LoadingComponent.js
 */
/* eslint-disable */
/**
 * custom header component for pull to refresh
 */
import React from 'react';
import {
    Text,
    Image,
    Animated,
    StyleSheet
} from 'react-native';

// interface ClassHeaderState {
//     pullDistance: number;
//     percent: number;
// }

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pullDistance: props.pullDistance,
            percent: props.percent,
        };

        this.setProgress = this.setProgress.bind(this);
    }

    setProgress({ pullDistance, percent }) {
        this.setState({
            pullDistance,
            percent,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            pullDistance: nextProps.pullDistance,
            percent: nextProps.percent,
        });
    }

    render() {
        const { percentAnimatedValue, refreshing } = this.props;
        const { percent } = this.state;
        let content = <Text style={styles.tip}>下拉更新</Text>
        if (percent >= 1) {
            if (refreshing) {
                content = (
                    <Text style={styles.tip}>加载中......</Text>
                )
            } else {
                content = <Text style={styles.tip}>松开更新</Text>
            }
        }
        return (
            <Animated.View style={[styles.con, { opacity: percentAnimatedValue }]}>
                {content}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    con: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tip: {
        marginTop: 16,
        fontSize: 13,
        lineHeight: 16,
        color: '#000000',
    },
    icon: {
        marginTop: 13,
        width: 22,
        height: 22,
    }
})