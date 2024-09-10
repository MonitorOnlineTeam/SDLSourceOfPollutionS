import React from 'react';
import { connect } from 'react-redux';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty } from '../../../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { SimplePickerSingleTime, SimpleMultipleItemPicker, SDLText, StatusPage } from '../../../../components';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Platform, FlatList, TouchableWithoutFeedback, ImageBackground, ScrollView } from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import moment from 'moment';
import { lockToLandscapeRight, lockToPortrait } from 'react-native-orientation';
import globalcolor from '../../../../config/globalcolor';
/**
 *
 *图表数据
 */
@connect(({ alarmAnaly }) => ({
    StatisPolValue: alarmAnaly.StatisPolValue
}))
export default class StatisPolValueNumsByDGIMN extends React.Component {
    static navigationOptions = createNavigationOptions({
        title: '密度分布直方图',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
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
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        this.props.dispatch(
            createAction(`alarmAnaly/${this.props.navigation.state.params.type}`)({
                DGIMN: this.props.navigation.state.params.DGIMN || '45007750002401'
            })
        );
    }

    getOption = item => {
        let option = {
            title: {
                text: item.PollutantName
            },
            tooltip: { formatter: '{c0}' },
            xAxis: {
                scale: true
            },
            color: '#5470c6',
            yAxis: {},
            series: [
                {
                    type: 'custom',
                    renderItem: function(params, api) {
                        var yValue = api.value(2);
                        var start = api.coord([api.value(0), yValue]);
                        var size = api.size([api.value(1) - api.value(0), yValue]);
                        var style = api.style();
                        return {
                            type: 'rect',
                            shape: {
                                x: start[0],
                                y: start[1],
                                width: size[0],
                                height: size[1]
                            },
                            style: style
                        };
                    },

                    encode: {
                        x: [0, 1],
                        y: 2
                    },
                    data: item.Data
                }
            ]
        };
        return option;
    };
    render() {
        return (
            <StatusPage
                style={{ flex: 1 }}
                status={SentencedToEmpty(this.props.StatisPolValue, ['data', 'Datas'], []).length == 0 ? 0 : this.props.StatisPolValue.status}
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
                {this.props.StatisPolValue.status == 200 ? (
                    <ScrollView style={{ flex: 1 }}>
                        {SentencedToEmpty(this.props.StatisPolValue, ['data', 'Datas'], []).map(item => {
                            return (
                                <View style={{ height: 250, width: SCREEN_WIDTH, backgroundColor: '#fff', marginTop: 10 }}>
                                    <Echarts option={this.getOption(item)} height={250} width={SCREEN_WIDTH} />
                                </View>
                            );
                        })}
                    </ScrollView>
                ) : null}
            </StatusPage>
        );
    }
}

const styles = StyleSheet.create({});
