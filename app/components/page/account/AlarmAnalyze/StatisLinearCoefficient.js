import React from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SimpleMultipleItemPicker, SDLText, StatusPage } from '../../../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import moment from 'moment';
import { lockToLandscapeLeft, lockToLandscapeRight, lockToPortrait } from 'react-native-orientation';
import globalcolor from '../../../../config/globalcolor';
/**
 *
 *图表数据
 */
@connect(({ alarmAnaly }) => ({
    StatisLinearCoefficientValue: alarmAnaly.StatisLinearCoefficientValue
}))
export default class StatisLinearCoefficient extends React.Component {
    static propTypes = {};
    static defaultProps = {};
    constructor(props) {
        super(props);
        this.state = {
            chartDatas: [],
            clickDatas: [],
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            option1: {}
        };

        props.navigation.setOptions({
            headerShown: false,
        });
    }

    componentDidMount() {
        this.refreshData();
        if (Platform.OS == 'ios') {
            lockToLandscapeRight();
        } else {
            lockToLandscapeLeft();
        }
    }

    componentWillUnmount() {
        lockToPortrait();
        SentencedToEmpty(this.props,
            ['route', 'params', 'params', 'backFunction']
            , () => { })();
    }

    refreshData() {
        this.props.dispatch(
            createAction(`alarmAnaly/${this.props.route.params.params.type}`)({
                DGIMN: this.props.route.params.params.DGIMN || '45007750002401'
            })
        );
    }
    getLinearCoefficientOption = () => {
        const hours = SentencedToEmpty(this.props.StatisLinearCoefficientValue, ['data', 'Datas', 'name'], []);
        // prettier-ignore
        const days = SentencedToEmpty(this.props.StatisLinearCoefficientValue, ['data', 'Datas', 'name'], []);
        // prettier-ignore
        const data = SentencedToEmpty(this.props.StatisLinearCoefficientValue, ['data', 'Datas', 'data'], [])
            .map(function (item) {
                return [item[1], item[0], item[2] || '-'];
            });
        let option = {
            tooltip: {
                position: 'top'
            },
            grid: {
                height: '85%',
                top: 20,
                left: 110
            },
            xAxis: {
                type: 'category',
                data: hours,
                splitArea: {
                    show: false
                },
                axisLabel: {
                    interval: 0
                }
            },
            yAxis: {
                type: 'category',
                data: days,
                splitArea: {
                    show: false
                }
            },
            visualMap: {
                min: -1,
                max: 1,
                top: 20,
                orient: 'horizontal',
                left: 'center',
                calculable: true,
                realtime: false,
                precision: 2,
                // itemHeight: 500,
                // range: [1, 0.75, 0.50, 0.25, 0.00, -0.25, -0.50, -0.75, -1],
                inRange: {
                    color: ['#407D92', '#699AA8', '#96B9C2', '#C2D4DA', '#F0F2F1', '#EBC7C2', '#DBA394', '#CE7C67', '#C4543D']
                }
            },
            series: [
                {
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true,
                        color: 'black'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return option;
    };

    render() {
        return (
            <View flex={1}>
                <StatusPage
                    errorPaddingTop={50}
                    emptyPaddingTop={50}
                    style={{ flex: 1 }}
                    status={this.props.route.params.params.type == 'StatisPolValueNumsByDGIMN' ? this.props.StatisPolValue.status : this.props.StatisLinearCoefficientValue.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.refreshData();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.refreshData();
                    }}
                >
                    {this.props.StatisLinearCoefficientValue.status == 200 ? (
                        <View style={{ flex: 1 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ backgroundColor: '#fff', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Echarts option={this.getLinearCoefficientOption()} width={SCREEN_HEIGHT} height={SCREEN_WIDTH} />
                            </View>
                        </View>
                    ) : null}
                </StatusPage>
                <TouchableOpacity
                    style={{ position: 'absolute', right: 13, top: 48, width: 48, height: 48, borderRadius: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: globalcolor.headerBackgroundColor }}
                    onPress={() => {
                        lockToPortrait();
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <SDLText style={{ color: '#fff' }}>返回</SDLText>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({});
