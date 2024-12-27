//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

let myData = [];
for (let i = 0; i < 50; i += 1) {
    myData.push({ showValue: `item${i}`, value: i });
}

// create a component
class SingleWheel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            select: this.props.defaultIndexFun(this.props.dataArray, this.props.defaultValue)
        };
    }

    static defaultProps = {
        dataArray: myData,
        defaultIndexFun: () => {
            return 0;
        },
        scrollEnabled: true,
        getShowValue: item => {
            return 'showValue';
        },
        getValue: item => {
            return 'Value';
        }
    };

    defaultOffsetY = positon => {
        this._scrollView.scrollTo(positon);
    };

    handleScrollEnd = (contentOffsetY) => {
        let itemHeight = 40;
        let index = Math.round(contentOffsetY / itemHeight);
        
        if (index < 0) {
            index = 0;
        } else if (index >= this.props.dataArray.length) {
            index = this.props.dataArray.length - 1;
        }
        
        const lastPosition = index * itemHeight;
        console.log('lastPosition', lastPosition);
        
        requestAnimationFrame(() => {
            this._scrollView.scrollTo({
                y: lastPosition,
                x: 0,
                animated: true
            });
            this.setState({ select: index });
            this.props.callback(this.props.dataArray[index], index);
        });
    };

    render() {
        let defaultStyle = { height: 200, minWidth: 64 };
        let scrollViewStyle = {
            ...{ height: 200, minWidth: 64, marginHorizontal: 2 },
            ...this.props.style
        };
        return (
            <View style={[scrollViewStyle]}>
                <View
                    style={[
                        {
                            height: 1,
                            width: '100%',
                            // position: 'absolute',
                            top: scrollViewStyle.height / 2 - 21,
                            backgroundColor: '#49a1fe'
                        }
                    ]}
                />
                <View
                    style={[
                        {
                            height: 1,
                            width: '100%',
                            // position: 'absolute',
                            top: scrollViewStyle.height / 2 + 19,
                            backgroundColor: '#49a1fe'
                        }
                    ]}
                />
                <ScrollView
                    // pagingEnabled={true}
                    ref={ref => {
                        if (ref !== null && typeof this._scrollView == 'undefined') {
                            setTimeout(() => {
                                let contentOffsetY = this.props.defaultIndexFun(this.props.dataArray, this.props.defaultValue) * 40;
                                if (contentOffsetY < 0) {
                                    contentOffsetY = 0;
                                }
                                if (this._scrollView && typeof this._scrollView != 'undefined') {
                                    this._scrollView.scrollTo({
                                        y: contentOffsetY,
                                        x: 0,
                                        animated: false
                                    });
                                }
                            }, 1);
                        }
                        return (this._scrollView = ref);
                    }}
                    scrollEnabled={this.props.scrollEnabled}
                    style={[scrollViewStyle, { zIndex: 800 }]}
                    showsVerticalScrollIndicator={false}
                    onScrollEndDrag={({ nativeEvent }) => {
                        // 如果发现速度阈值 0.05 不够合适，可以根据实际体验调整。
                        if (Math.abs(nativeEvent.velocity.y) < 0.05) {
                            this.handleScrollEnd(nativeEvent.contentOffset.y);
                        }
                    }}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        this.handleScrollEnd(nativeEvent.contentOffset.y);
                    }}
                >
                    <View style={[{ alignItems: 'center' }]}>
                        <View style={[{ height: scrollViewStyle.height / 2 - 20 }]} />
                        {this.props.dataArray.map((item, key) => {
                            return (
                                <View
                                    key={key}
                                    style={[
                                        {
                                            height: 40,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            {
                                                color: this.state.select == key ? '#333333' : '#999999',
                                                fontSize: 14
                                                // fontWeight:this.state.select == key?'bold':'normal'
                                            }
                                        ]}
                                    >
                                        {this.props.getShowValue(item, this.state.select == key)}
                                    </Text>
                                </View>
                            );
                        })}
                        <View style={[{ height: scrollViewStyle.height / 2 - 20 }]} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    }
});

//make this component available to the app
export default SingleWheel;
