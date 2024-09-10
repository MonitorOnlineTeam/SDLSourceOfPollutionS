//import liraries
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { day28, day29, day30, day31 } from '../constant/baseConstant';

const WINDOW_WIDTH = Dimensions.get('window').width;

let myData = [];
for (let i = 0; i < 50; i += 1) {
    myData.push({ showValue: `item${i}`, value: i });
}

// create a component
class DateSingleWheel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            select: this.props.defaultIndexFun(this.props.dataArray, this.props.defaultValue),
            dataArray: this.props.dataArray
        };
    }

    static defaultProps = {
        dataArray: myData,
        defaultIndexFun: () => {
            return 0;
        },
        scrollEnabled: true
    };

    yearMonthChange = (year, month, date) => {
        let _date = day31;
        let select = this.state.select;
        if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
            _date = day31;
        } else if (month == 3 || month == 5 || month == 8 || month == 10) {
            _date = day30;
            if (select == 30) {
                select = 29;
            }
        } else if (month == 1) {
            if (year % 400 == 0) {
                _date = day29;
                if (select > 28) {
                    select = 28;
                }
            } else if (year % 100 != 0 && year % 4 == 0) {
                _date = day29;
                if (select > 28) {
                    select = 28;
                }
            } else {
                _date = day28;
                if (select > 27) {
                    select = 27;
                }
            }
        }

        this.setState({
            dataArray: _date,
            select
        });
    };

    defaultOffsetY = positon => {
        this._scrollView.scrollTo(positon);
    };

    render() {
        let defaultStyle = { height: 200, minWidth: 64 };
        let scrollViewStyle = { ...{ height: 200, minWidth: 64, marginHorizontal: 2 }, ...this.props.style };
        return (
            <View style={[scrollViewStyle]}>
                <View style={[{ height: 1, width: '100%', position: 'absolute', top: scrollViewStyle.height / 2 - 21, backgroundColor: '#49a1fe' }]} />
                <View style={[{ height: 1, width: '100%', position: 'absolute', top: scrollViewStyle.height / 2 + 19, backgroundColor: '#49a1fe' }]} />
                <ScrollView
                    ref={ref => {
                        if (ref !== null && typeof this._scrollView == 'undefined') {
                            setTimeout(() => {
                                let contentOffsetY = this.props.defaultIndexFun(this.state.dataArray, this.props.defaultValue) * 40;
                                if (this._scrollView && typeof this._scrollView != 'undefined') {
                                    this._scrollView.scrollTo({ y: contentOffsetY, x: 0, animated: false });
                                }
                            }, 1);
                        }
                        return (this._scrollView = ref);
                    }}
                    scrollEnabled={this.props.scrollEnabled}
                    style={[scrollViewStyle]}
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        let itemHeight = 40;
                        let index = Math.floor(nativeEvent.contentOffset.y / itemHeight);
                        if (index < 0) {
                            index = 0;
                        } else if (index >= this.state.dataArray.length) {
                            index = this.props.dataArray.length - 1;
                        }
                        let remainder = nativeEvent.contentOffset.y % itemHeight;
                        let lastPosition = 0;
                        if (remainder <= itemHeight / 2) {
                            lastPosition = index * itemHeight;
                        } else {
                            if (index < this.props.dataArray.length - 1) {
                                index += 1;
                            }
                            lastPosition = index * itemHeight;
                        }
                        this._scrollView.scrollTo({ y: lastPosition, x: 0, animated: false });
                        this.setState({ select: index });
                        this.props.callback(this.state.dataArray[index]);
                    }}
                >
                    <View style={[{ alignItems: 'center' }]}>
                        <View style={[{ height: scrollViewStyle.height / 2 - 20 }]} />
                        {this.state.dataArray.map((item, key) => {
                            return (
                                <View key={key} style={[{ height: 40, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text
                                        style={[
                                            {
                                                color: this.state.select == key ? '#333333' : '#999999',
                                                fontSize: 14
                                                // fontWeight: this.state.select == key ? ('bold', '200') : 'normal'
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    }
});

//make this component available to the app
export default DateSingleWheel;
