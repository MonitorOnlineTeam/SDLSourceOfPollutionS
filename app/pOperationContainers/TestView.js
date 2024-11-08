/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-09-11 14:03:38
 * @LastEditTime: 2024-11-04 11:56:23
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/TestView.js
 */
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import { MessageBarManager } from 'react-native-message-bar';

import { createAction, SentencedToEmpty, ShowToast } from '../utils';
// import RNEChartsPro from 'react-native-echarts-pro';
import { SCREEN_WIDTH } from '../config/globalsize';

let that;

// const option = {
//     tooltip: {
//         trigger: 'axis'
//     },
//     xAxis: {
//         type: 'category',
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//         type: 'value',
//         axisTick: {
//             show: false
//         },
//         splitLine: {
//             //坐标轴在 grid 区域中的分隔线。
//             show: true,
//             interval: 5,
//             lineStyle: {
//                 type: 'line'
//             }
//         },
//         axisLabel: {
//             textStyle: {
//                 color: '#999',
//                 fontSize: 12
//             }
//         },
//         axisLine: {
//             show: true,
//             lineStyle: {
//                 color: '#999'
//             }
//         }
//     },
//     series: [
//         {
//             data: [150, 230, 224, 218, 135, 147, 260],
//             type: 'line',
//             itemStyle: {
//                 normal: {
//                     color: 'red'
//                 }
//             },
//             markLine: {
//                 data: [
//                     { type: 'average', name: '平均值' }
//                 ]
//             }
//         }
//     ]
// };
const option = {
    "tooltip": {
        // position: function (pt) {
        //     return [pt[0], 130];
        // },
        trigger: 'axis',
        // formatter: function (params) {
        //     alert('123')
        //     // 自定义格式化回调
        //     return null;
        // },
        // formatter: '{a2}: {c2}<br />{a3}: {c3}'
    }, "legend": { "y": "10px", "data": ["实测烟尘", "折算烟尘", "实测SO₂", "折算SO₂", "氧含量", "烟气温度", "流速", "流量"], "type": "scroll", tooltip: { show: false }, "selectedMode": false }, "grid": { "show": true, "top": 50, "left": "3%", "right": "4%", "bottom": "3%", "containLabel": true }, "xAxis": [{ "boundaryGap": false, "type": "category", "gridIndex": 0, "axisTick": { "show": false }, "axisLabel": { "textStyle": { "color": "#999", "fontWeight": "normal", "fontSize": 12 } }, "data": ["14:00\\nn09/10", "15:00\\nn09/10", "16:00\\nn09/10", "17:00\\nn09/10", "18:00\\nn09/10", "19:00\\nn09/10", "20:00\\nn09/10", "21:00\\nn09/10", "22:00\\nn09/10", "23:00\\nn09/10", "00:00\\nn09/11", "01:00\\nn09/11", "02:00\\nn09/11", "03:00\\nn09/11", "04:00\\nn09/11", "05:00\\nn09/11", "06:00\\nn09/11", "07:00\\nn09/11", "08:00\\nn09/11", "09:00\\nn09/11", "10:00\\nn09/11", "11:00\\nn09/11", "12:00\\nn09/11", "13:00\\nn09/11", "14:00\\nn09/11"] }], "yAxis": [{ "type": "value", "axisTick": { "show": false }, "splitLine": { "show": true, "interval": 5, "lineStyle": { "type": "line" } }, "axisLabel": { "textStyle": { "color": "#999", "fontSize": 12 } }, "axisLine": { "show": true, "lineStyle": { "color": "#999" } } }], "series": [{ "name": "实测烟尘", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#88ff2b" } }, "data": ["29.210", "28.790", "28.180", "28.350", "28.270", "28.470", "28.430", "28.210", "28.410", "28.460", "28.300", "28.110", "28.010", "28.120", "28.210", "28.040", "27.900", "27.850", "27.770", "27.740", "27.420", "26.780", "26.660", "26.800", "26.950"] }, { "name": "折算烟尘", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#13cfe8" } }, "data": ["28.260", "28.690", "33.760", "32.670", "33.820", "32.950", "31.560", "33.570", "32.040", "30.030", "32.190", "34.140", "33.040", "33.420", "30.600", "32.210", "32.910", "32.300", "31.450", "29.530", "162.380", "31.300", "31.250", "31.780", "31.600"] }, { "name": "实测SO₂", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#ffdc00" } }, "data": ["1759.130", "1773.340", "1770.140", "1817.040", "1761.630", "1834.120", "1918.910", "1826.670", "1888.180", "1902.960", "1774.090", "1904.220", "2028.730", "2017.410", "1892.030", "1778.040", "1777.790", "1633.460", "1514.100", "1500.700", "1527.300", "1576.170", "1577.990", "1552.100", "1556.300"] }, { "name": "折算SO₂", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["1701.910", "1767.220", "2121.350", "2093.250", "2103.190", "2114.080", "2130.110", "2172.680", "2129.020", "2006.080", "2014.430", "2308.930", "2393.300", "2397.220", "2050.330", "2038.740", "2096.460", "1893.760", "1713.210", "1597.390", "1921.290", "1841.330", "1849.050", "1840.320", "1824.810"] }, { "name": "氧含量", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["5.490", "5.940", "8.450", "7.940", "8.430", "8.000", "7.490", "8.380", "7.660", "6.770", "7.770", "8.640", "8.290", "8.380", "7.160", "7.900", "8.280", "8.060", "7.730", "6.900", "8.330", "8.160", "8.200", "8.300", "8.200"] }, { "name": "烟气温度", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["124.580", "124.700", "122.100", "119.050", "117.490", "116.570", "114.770", "113.340", "114.010", "118.030", "119.790", "118.330", "113.940", "111.520", "112.190", "113.620", "112.950", "112.060", "113.010", "116.260", "116.820", "113.940", "113.360", "114.500", "114.400"] }, { "name": "流速", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["13.660", "13.690", "13.720", "13.750", "13.740", "13.890", "13.830", "13.730", "13.870", "13.950", "13.910", "13.860", "13.860", "13.850", "14.140", "14.110", "14.090", "14.090", "14.040", "13.320", "13.050", "9.860", "9.860", "9.860", "9.860"] }, { "name": "流量", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["1782142.000", "1785543.000", "1561588.000", "1819005.000", "1825658.000", "1849675.000", "1850181.000", "1844313.000", "1611376.000", "1850733.000", "1837114.000", "1837627.000", "1858138.000", "1868620.000", "1651027.000", "1893605.000", "1893725.000", "1899029.000", "1887627.000", "1775790.000", "1215444.000", "1321557.000", "1323939.000", "1320501.500", "1319959.625"] }]
}
// let option = {
//     tooltip: {
//         trigger: 'axis',
//         formatter: function (params) {
//             alert('123');
//             var relVal = params[0].name;

//             for (var i = 0; i < params.length; i++) {
//                 var v = params[i].value;
//                 if (typeof v == 'undefined') {
//                     v = '--';
//                 } //默认值
//                 if (params[i].data) {
//                     if (params[i].data.unit) v = '' + v + params[i].data.unit;
//                     if (params[i].data.direction) v = '' + v + params[i].data.direction;
//                 }
//                 relVal +=
//                     '<div class="circle" style= "font-size: 0.7rem;display:none;margin-top:-4px"><span style="background-color:' +
//                     params[i].color +
//                     ';display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;"></span>' +
//                     params[i].seriesName +
//                     ' : ' +
//                     v +
//                     '</div>';
//             }
//             var seen = [];
//             var paramsString = JSON.stringify(params, function (key, val) {
//                 if (val != null && typeof val == 'object') {
//                     if (seen.indexOf(val) >= 0) {
//                         return;
//                     }
//                     seen.push(val);
//                 }
//                 return val;
//             });
//             window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: paramsString }));
//             return null;
//         }
//     },
//     legend: {
//         data: [],
//         y: '20px'
//     },

//     grid: {
//         show: true,
//         top: 50,
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//     },
//     xAxis: [
//         {
//             boundaryGap: false,
//             type: 'category',
//             gridIndex: 0,
//             axisTick: {
//                 show: false
//             },

//             data: []
//         }
//     ],
//     yAxis: [
//         {
//             type: 'value',
//             axisTick: {
//                 show: false
//             },
//             splitLine: {
//                 //坐标轴在 grid 区域中的分隔线。
//                 show: true,
//                 interval: 5,
//                 lineStyle: {
//                     type: 'line'
//                 }
//             },
//             axisLabel: {
//                 textStyle: {
//                     color: '#999',
//                     fontSize: 12
//                 }
//             },
//             axisLine: {
//                 show: true,
//                 lineStyle: {
//                     color: '#999'
//                 }
//             }
//         }
//     ],
//     series: []
// }

@connect(({ pointDetails, historyDataModel }) => ({
    PollantCodes: pointDetails.PollantCodes,
    chartStatus: pointDetails.chartStatus,
    selectCodeArr: pointDetails.selectCodeArr,
    selectTime: pointDetails.selectTime,

    chartOrList: historyDataModel.chartOrList,
}))
export default class TestView extends Component {

    static propTypes = {};

    static defaultProps = {
        listKey: "a",
        key: "1",
        tabLabel: "小时",
        datatype: "hour",
        showIndex: 0
        // dgimn={ this.props.route.params.params.DGIMN }
    };

    constructor(props) {
        super(props);
        that = this;
        this.state = {
            loading: false,
            chartDatas: [],
            clickDatas: [],
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            option1: {
                tooltip: {
                    trigger: 'axis',
                    // formatter: function (params) {
                    //     Alert('123')
                    //     var relVal = params[0].name;

                    //     for (var i = 0; i < params.length; i++) {
                    //         var v = params[i].value;
                    //         if (typeof v == 'undefined') {
                    //             v = '--';
                    //         } //默认值
                    //         if (params[i].data) {
                    //             if (params[i].data.unit) v = '' + v + params[i].data.unit;
                    //             if (params[i].data.direction) v = '' + v + params[i].data.direction;
                    //         }
                    //         relVal +=
                    //             '<div class="circle" style= "font-size: 0.7rem;display:none;margin-top:-4px"><span style="background-color:' +
                    //             params[i].color +
                    //             ';display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;"></span>' +
                    //             params[i].seriesName +
                    //             ' : ' +
                    //             v +
                    //             '</div>';
                    //     }
                    //     var seen = [];
                    //     var paramsString = JSON.stringify(params, function (key, val) {
                    //         if (val != null && typeof val == 'object') {
                    //             if (seen.indexOf(val) >= 0) {
                    //                 return;
                    //             }
                    //             seen.push(val);
                    //         }
                    //         return val;
                    //     });
                    //     window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: paramsString }));
                    //     window.postMessage(JSON.stringify({ types: 'ON_PRESS', payload: "{'key':'test'}" }));
                    //     return null;
                    // }
                },
                legend: {
                    data: [],
                    y: '20px'
                },

                grid: {
                    show: true,
                    top: 50,
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        type: 'category',
                        gridIndex: 0,
                        axisTick: {
                            show: false
                        },

                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            //坐标轴在 grid 区域中的分隔线。
                            show: true,
                            interval: 5,
                            lineStyle: {
                                type: 'line'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999',
                                fontSize: 12
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    }
                ],
                series: []
            }
        };
    }


    componentDidMount() {
        this.setState({ loading: true }, () => {
            this.props.dispatch(createAction('pointDetails/getPollantCodes')({ params: { DGIMNs: this.props.route.params.params.DGIMN }, callBack: this.callBack }));
        })
    }

    callBack = (isSuc, pollArr) => {
        // 如果传入的数据包含因子，则将因子设置为传入的值
        const params = SentencedToEmpty(this.props, [
            'route', 'params', 'params'
        ], {});
        if ('PollutantCode' in params) {
            if (params.PollutantCode != 'All') {
                let index = pollArr.findIndex((item) => {
                    return item.PollutantCode == params.PollutantCode;
                });
                if (index != -1) {
                    this.props.dispatch(createAction('pointDetails/updateState')({
                        selectCodeArr: [
                            { AlarmType: 0, Color: null, DGIMN: null, LowerValue: null, PollutantCode: params.PollutantCode, PollutantName: pollArr[index].PollutantName, Sort: 1, StandardValue: null, StandardValueStr: null, Unit: '', UpperValue: null }
                        ]
                    }));
                }
            } else {
                // 传入参数为All则不需要修改，获取因子后就会全部选中
            }
        }

        if (isSuc == true && pollArr.length > 0) {
            that.onChange(this.props.showIndex);
        } else if (isSuc == true && pollArr.length == 0) {
            ShowToast('该站点暂未配置污染因子');
        } else {
            ShowToast('获取污染因子失败，请退出重试');
        }
    }

    onChange = (e, type) => {
        this.props.dispatch(createAction('historyDataModel/updateState')({
            showIndex: e,
        }));
        this.refreshData();
    };

    refreshData = () => {
        let codeStr = '';
        this.props.selectCodeArr.map(item => {
            codeStr = codeStr + ',' + item.PollutantCode;
        });
        this.setState({ clickDatas: [] });

        this.props.dispatch(
            createAction('pointDetails/getChartLstDatas')({
                params: {
                    datatype: this.props.datatype,
                    DGIMNs: this.props.route.params.params.DGIMN,
                    pageIndex: 1,
                    pageSize: 2000,
                    beginTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[0],

                    endTime: this.getRequestTime(this.props.selectTime, this.props.datatype)[1],
                    pollutantCodes: codeStr,
                    isAsc: true
                },
                callback: data => {
                    this.setState({ chartDatas: data });
                    this.editOption(data);
                }
            })
        );
    }

    editOption = datas => {
        let colors = ['#88ff2b', '#13cfe8', '#ffdc00'];
        let xData = [];
        let seriesData = [];
        let useSeries = [];
        let legendNames = [];
        this.props.selectCodeArr.map(item => {
            if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
                item.PollutantName = '综合指数';
            }
            if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
                return;
            }
            if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
                item.PollutantName = 'AQI';
            }
            legendNames.push(item.PollutantName);
        });
        for (let i = 0; i < this.props.selectCodeArr.length; i++) {
            seriesData.push([]);
        }
        datas.map(item => {
            if (this.props.datatype == 'day') {
                xData.push(moment(item.MonitorTime).format('YY/MM/DD'));
            } else if (this.props.datatype == 'realtime') {
                xData.push(
                    moment(item.MonitorTime)
                        .format('HH:mm:ss MM/DD')
                        .replace(' ', '\\nn')
                );
            } else if (this.props.datatype == 'month') {
                xData.push(moment(item.MonitorTime).format('YYYY-MM'));
            } else {
                xData.push(
                    moment(item.MonitorTime)
                        .format('HH:mm MM/DD')
                        .replace(' ', '\\nn')
                );
            }

            for (let i = 0; i < this.props.selectCodeArr.length; i++) {
                if (item[this.props.selectCodeArr[i].PollutantCode] && typeof item[this.props.selectCodeArr[i].PollutantCode] != 'undefined') {
                    seriesData[i].push(item[this.props.selectCodeArr[i].PollutantCode]);
                } else {
                    seriesData[i].push('-');
                }
            }
        });
        for (let i = 0; i < this.props.selectCodeArr.length; i++) {
            useSeries.push({
                name: this.props.selectCodeArr[i].PollutantName,
                showSymbol: false,
                type: 'line',
                itemStyle: {
                    normal: {
                        color: colors[i]
                    }
                },
                data: seriesData[i]
            });
        }

        let newOption = {
            ...this.state.option1,
            legend: {
                y: '10px',
                data: legendNames,
                type: 'scroll',
                selectedMode: false //取消图例上的点击事件
            },

            xAxis: [
                {
                    boundaryGap: false,
                    type: 'category',
                    gridIndex: 0,
                    axisTick: {
                        show: false
                    },

                    axisLabel: {
                        //坐标轴刻度标签的相关设置。

                        textStyle: {
                            color: '#999',
                            fontWeight: 'normal',
                            fontSize: 12
                        }
                    },
                    data: xData
                }
            ],
            series: useSeries
        }

        console.log('newOption = ', newOption);

        // this.setState({
        //     option1: {
        //         ...this.state.option1,
        //         legend: {
        //             y: '10px',
        //             data: legendNames,
        //             type: 'scroll',
        //             selectedMode: false //取消图例上的点击事件
        //         },

        //         xAxis: [
        //             {
        //                 boundaryGap: false,
        //                 type: 'category',
        //                 gridIndex: 0,
        //                 axisTick: {
        //                     show: false
        //                 },

        //                 axisLabel: {
        //                     //坐标轴刻度标签的相关设置。

        //                     textStyle: {
        //                         color: '#999',
        //                         fontWeight: 'normal',
        //                         fontSize: 12
        //                     }
        //                 },
        //                 data: xData
        //             }
        //         ],
        //         series: useSeries
        //     }
        // }, () => {
        //     console.log('last option1 = ', JSON.stringify(this.state.option1));
        //     this.setState({ loading: false });
        // });

        this.setState({
            option1: {
                "tooltip": {
                    trigger: 'axis'
                }, "legend": { "y": "10px", "data": ["实测烟尘", "折算烟尘", "实测SO₂", "折算SO₂", "氧含量", "烟气温度", "流速", "流量"], "type": "scroll", tooltip: { show: false }, "selectedMode": false }, "grid": { "show": true, "top": 50, "left": "3%", "right": "4%", "bottom": "3%", "containLabel": true }, "xAxis": [{ "boundaryGap": false, "type": "category", "gridIndex": 0, "axisTick": { "show": false }, "axisLabel": { "textStyle": { "color": "#999", "fontWeight": "normal", "fontSize": 12 } }, "data": ["14:00\\nn09/10", "15:00\\nn09/10", "16:00\\nn09/10", "17:00\\nn09/10", "18:00\\nn09/10", "19:00\\nn09/10", "20:00\\nn09/10", "21:00\\nn09/10", "22:00\\nn09/10", "23:00\\nn09/10", "00:00\\nn09/11", "01:00\\nn09/11", "02:00\\nn09/11", "03:00\\nn09/11", "04:00\\nn09/11", "05:00\\nn09/11", "06:00\\nn09/11", "07:00\\nn09/11", "08:00\\nn09/11", "09:00\\nn09/11", "10:00\\nn09/11", "11:00\\nn09/11", "12:00\\nn09/11", "13:00\\nn09/11", "14:00\\nn09/11"] }], "yAxis": [{ "type": "value", "axisTick": { "show": false }, "splitLine": { "show": true, "interval": 5, "lineStyle": { "type": "line" } }, "axisLabel": { "textStyle": { "color": "#999", "fontSize": 12 } }, "axisLine": { "show": true, "lineStyle": { "color": "#999" } } }], "series": [{ "name": "实测烟尘", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#88ff2b" } }, "data": ["29.210", "28.790", "28.180", "28.350", "28.270", "28.470", "28.430", "28.210", "28.410", "28.460", "28.300", "28.110", "28.010", "28.120", "28.210", "28.040", "27.900", "27.850", "27.770", "27.740", "27.420", "26.780", "26.660", "26.800", "26.950"] }, { "name": "折算烟尘", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#13cfe8" } }, "data": ["28.260", "28.690", "33.760", "32.670", "33.820", "32.950", "31.560", "33.570", "32.040", "30.030", "32.190", "34.140", "33.040", "33.420", "30.600", "32.210", "32.910", "32.300", "31.450", "29.530", "162.380", "31.300", "31.250", "31.780", "31.600"] }, { "name": "实测SO₂", "showSymbol": false, "type": "line", "itemStyle": { "normal": { "color": "#ffdc00" } }, "data": ["1759.130", "1773.340", "1770.140", "1817.040", "1761.630", "1834.120", "1918.910", "1826.670", "1888.180", "1902.960", "1774.090", "1904.220", "2028.730", "2017.410", "1892.030", "1778.040", "1777.790", "1633.460", "1514.100", "1500.700", "1527.300", "1576.170", "1577.990", "1552.100", "1556.300"] }, { "name": "折算SO₂", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["1701.910", "1767.220", "2121.350", "2093.250", "2103.190", "2114.080", "2130.110", "2172.680", "2129.020", "2006.080", "2014.430", "2308.930", "2393.300", "2397.220", "2050.330", "2038.740", "2096.460", "1893.760", "1713.210", "1597.390", "1921.290", "1841.330", "1849.050", "1840.320", "1824.810"] }, { "name": "氧含量", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["5.490", "5.940", "8.450", "7.940", "8.430", "8.000", "7.490", "8.380", "7.660", "6.770", "7.770", "8.640", "8.290", "8.380", "7.160", "7.900", "8.280", "8.060", "7.730", "6.900", "8.330", "8.160", "8.200", "8.300", "8.200"] }, { "name": "烟气温度", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["124.580", "124.700", "122.100", "119.050", "117.490", "116.570", "114.770", "113.340", "114.010", "118.030", "119.790", "118.330", "113.940", "111.520", "112.190", "113.620", "112.950", "112.060", "113.010", "116.260", "116.820", "113.940", "113.360", "114.500", "114.400"] }, { "name": "流速", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["13.660", "13.690", "13.720", "13.750", "13.740", "13.890", "13.830", "13.730", "13.870", "13.950", "13.910", "13.860", "13.860", "13.850", "14.140", "14.110", "14.090", "14.090", "14.040", "13.320", "13.050", "9.860", "9.860", "9.860", "9.860"] }, { "name": "流量", "showSymbol": false, "type": "line", "itemStyle": { "normal": {} }, "data": ["1782142.000", "1785543.000", "1561588.000", "1819005.000", "1825658.000", "1849675.000", "1850181.000", "1844313.000", "1611376.000", "1850733.000", "1837114.000", "1837627.000", "1858138.000", "1868620.000", "1651027.000", "1893605.000", "1893725.000", "1899029.000", "1887627.000", "1775790.000", "1215444.000", "1321557.000", "1323939.000", "1320501.500", "1319959.625"] }]
            }
        }, () => {
            console.log('last option1 = ', JSON.stringify(this.state.option1));
            this.setState({ loading: false });
        });

    };

    getRequestTime(time, type) {
        let beginTime;
        let endTime;
        if (type == 'hour') {
            beginTime = moment(time)
                .subtract(24, 'hours')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'day') {
            beginTime = moment(time)
                .subtract(31, 'days')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time)
                .subtract(1, 'days')
                .format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'realtime') {
            beginTime = moment(time)
                .subtract(1, 'hours')
                .format('YYYY-MM-DD HH:mm:ss');
            endTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        } else if (type == 'minute') {
            // beginTime =
            //     moment(time)
            //         .subtract(1440, 'minutes')
            //         .format('YYYY-MM-DD HH:mm:ss')
            //         .substr(0, 15) + '0:00';
            /**
             * 20240205
             * 张洪斌
             * 分钟数据减少条数，查询最近3小时
             */
            beginTime =
                moment(time)
                    .subtract(180, 'minutes')
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
            endTime =
                moment(time)
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
        } else {
            beginTime =
                moment(time)
                    .subtract(12, 'months')
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
            endTime =
                moment(time)
                    .format('YYYY-MM-DD HH:mm:ss')
                    .substr(0, 15) + '0:00';
        }
        return [beginTime, endTime];
    }

    onPress = e => {
        console.log('e = ', e);
        // this.setState({ clickDatas: e });
    };

    render() {
        // console.log('this.state.option1 = ', JSON.stringify(this.state.option1));
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        // MessageBarManager.showAlert({
                        //     message: '请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空请输入完整的授权码,当前授权码为空',
                        //     alertType: 'success',
                        // })
                        ShowToast({
                            message: '上传成功',
                            alertType: 'success',
                        });
                    }
                    }
                >
                    <View
                        style={[{
                            width: 80, height: 40, justifyContent: 'center'
                            , alignItems: 'center'
                        }]}
                    >
                        <Text style={[{ color: '#333333' }]}>点击</Text>
                    </View>
                </TouchableOpacity>
                <Text style={[{ color: '#333333' }]}>TestView</Text>
                {
                    this.state.loading ? <ActivityIndicator size="large" color="#0000ff" />
                        // : <RNEChartsPro width={SCREEN_WIDTH} height={250} option={this.state.option1} onPress={this.onPress} />
                        : <SDLChartView option={this.state.option1} />
                }

                {/* <RNEChartsPro width={400} height={250} option={option} onPress={this.onPress} tooltipEvent={e => { console.log('e = ', e); }} /> */}
            </View>
        )
    }
}

class SDLChartView extends Component {
    onPress = e => {
        console.log('SDLChartView e = ', e);
        // this.setState({ clickDatas: e });
    };
    render() {
        return (
            //  <RNEChartsPro width={SCREEN_WIDTH} height={250} option={this.props.option} onPress={this.onPress} />
            <View />
        )
    }
}