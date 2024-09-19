/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';

// import Icon from 'react-native-vector-icons/Ionicons'; //这个是图标

export default class MyTabBar extends Component {
    // static propTypes = {

    //     goToPage: React.PropTypes.func, // 跳转到对应tab的方法
    //     activeTab: React.PropTypes.number, // 当前被选中的tab下标
    //     tabs: React.PropTypes.array, // 所有tabs集合

    //     tabNames: React.PropTypes.array, // 保存Tab名称
    //     tabIconNames: React.PropTypes.array, // 保存Tab图标

    // };  // 注意这里有分号

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs / 2,
            height: 4,
            backgroundColor: 'navy',
            bottom: 0
        };
        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs]
        });
        return (
            <View style={styles.tabs}>
                {/*遍历。系统会提供一个tab和下标 调用一个自定义的方法*/}
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                <Animated.View
                    style={[
                        tabUnderlineStyle,
                        {
                            transform: [{ translateX }],
                            alignItems: 'center'
                        },
                        this.props.underlineStyle,
                        {
                            backgroundColor: 'white'
                        }
                    ]}
                >
                    <View style={[this.props.underlineStyle, { width: this.props.underlineStyle.width / 2 }]} />
                </Animated.View>
            </View>
        );
    }

    componentDidMount() {
        // Animated.Value监听范围 [0, tab数量-1]
        this.props.scrollValue.addListener(this.setAnimationValue);
    }

    setAnimationValue({ value }) {
        // console.log('动画值：'+value);
    }

    ///  处理tabbar的颜色和字体及图标
    renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? '#4aa1fd' : '#666666'; // 判断i是否是当前选中的tab，设置不同的颜色
        return (
            //因为要有点击效果 所以要引入可触摸组件
            <TouchableOpacity onPress={() => this.props.goToPage(i)} style={styles.tab} key={tab}>
                <View style={styles.tabItem}>
                    {/*<Icon
                        
                        name={this.props.tabIconNames[i]} // 图标 调用传入的属性
                        size={30}
                    color={color}/>*/}
                    <Text style={{ color: color, fontSize: 15 }}>{this.props.tabNames[i]}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        height: 45,
        backgroundColor: 'white'
    },

    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    tabItem: {
        flexDirection: 'column',
        alignItems: 'center'
    }
});
