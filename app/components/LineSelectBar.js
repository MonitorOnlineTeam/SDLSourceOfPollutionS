//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Animated, Easing, NativeModules, LayoutAnimation } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

// create a component
class LineSelectBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectArray: props.isMultiple ? this.props.defaultSelectArray : props.defaultSelectArray.length == 0 ? [0] : props.defaultSelectArray,
            cursorColor: '#00000000',
            cursorLeft: new Animated.Value(props.defaultSelectArray.length == 0 ? 0 : (props.defaultSelectArray[0] * props.contentWidth) / props.data.length)
        };
        if (!props.isMultiple) {
            this.state.cursorItemWidth = props.contentWidth / this.props.data.length;
        }
    }

    static defaultProps = {
        height: 32, //item高度
        width: SCREEN_WIDTH, //容器宽度
        contentWidth: SCREEN_WIDTH, //内容宽度
        backgroundColor: 'white', //默认背景颜色
        defaultSelectArray: [], //初始化选中item
        scrollable: true, //是否开启滚动
        data: [], //item数据集合
        isMultiple: false, //是否支持复选//关闭复选自动开启选择动画
        cursorStyle: {
            //动画控件样式
            flex: 1,
            marginHorizontal: 4
        },
        callBack: () => {}, //点击回调
        creactItemFun: (item, key, selectArray, isMultiple) => {
            //item渲染方法
            return (
                <View
                    style={[
                        {
                            height: 32,
                            width: SCREEN_WIDTH / 6 - 8,
                            marginHorizontal: 4,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: selectArray.indexOf(key) != -1 && isMultiple ? item.selectColor : '#00000000'
                        }
                    ]}
                >
                    <Text style={[{ fontSize: 13, color: selectArray.indexOf(key) != -1 ? item.selectColor : '#F0F0F0' }]}>{item.showValue}</Text>
                </View>
            );
        }
    };

    _click = (item, key) => {
        let temp = this.state.selectArray;
        if (this.props.isMultiple) {
            let index = temp.indexOf(key);
            if (index == -1) {
                temp.push(key);
            } else {
                temp.splice(index, 1);
            }
            temp = [].concat(temp);
        } else {
            temp = [key];
        }
        let nextPosition = (key * this.props.contentWidth) / this.props.data.length;
        //执行动画
        LayoutAnimation.spring();
        this.setState({ selectArray: temp, cursorLeft: nextPosition });
        //执行动画之后调用回调函数
        this.props.callBack(item, temp);
    };
    //渲染动画控件
    renderCursor = () => {
        if (this.props.isMultiple || this.props.disCursor) {
            return null;
        } else {
            return (
                <View style={[{ width: this.props.contentWidth, height: 2 }]}>
                    <View style={[{ width: this.props.contentWidth, flexDirection: 'row', height: 2, position: 'absolute', left: 0, top: 0, backgroundColor: '#e5e5e5' }]}>
                        <Animated.View style={[{ marginLeft: this.state.cursorLeft, height: 2, width: this.props.contentWidth / this.props.data.length }]}>
                            <View style={[this.props.cursorStyle, { height: 2, backgroundColor: this.props.data.length > 0 ? this.props.data[this.state.selectArray[0]].selectColor : '#fff' }]} />
                        </Animated.View>
                    </View>
                </View>
            );
        }
    };

    render() {
        if (this.props.scrollable) {
            return (
                <View style={[{ height: this.props.height + 3, width: this.props.width, backgroundColor: this.props.backgroundColor }]}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={[{ width: this.props.contentWidth }]}>
                            <View style={[{ flexDirection: 'row', height: this.props.height, width: this.props.contentWidth }]}>
                                {this.props.data.map((item, key) => {
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            onPress={() => {
                                                this._click(item, key);
                                            }}
                                        >
                                            {this.props.creactItemFun(item, key, this.state.selectArray, this.props.isMultiple)}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            {this.renderCursor()}
                        </View>
                    </ScrollView>
                </View>
            );
        } else {
            return (
                <View>
                    <View
                        style={[
                            styles.container,
                            {
                                flexDirection: 'row',
                                minHeight: this.props.height,
                                width: this.props.width,
                                backgroundColor: this.props.backgroundColor
                            }
                        ]}
                    >
                        {this.props.data.map((item, key) => {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => {
                                        this._click(item, key);
                                    }}
                                >
                                    {this.props.creactItemFun(item, key, this.state.selectArray)}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {this.renderCursor()}
                </View>
            );
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//make this component available to the app
export default LineSelectBar;
