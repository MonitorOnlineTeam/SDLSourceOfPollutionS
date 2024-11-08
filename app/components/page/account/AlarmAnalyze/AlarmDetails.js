import React, { PureComponent, Component } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Echarts, echarts } from 'react-native-secharts';
import { SCREEN_WIDTH } from '../../../LineSelectBar';
import globalcolor from '../../../../config/globalcolor';
import { SDLText, StatusPage, AlertDialog } from '../../../../components';
import {
  NavigationActions,
  SentencedToEmpty,
  createAction,
  createNavigationOptions,
} from '../../../../utils';
import moment from 'moment';
let alertContent = [];
@connect(({ alarmAnaly }) => ({
  alarmDetailInfo: alarmAnaly.alarmDetailInfo,
  alarmChartData: alarmAnaly.alarmChartData,
  showDataSort: alarmAnaly.showDataSort,
  alramButtonList: alarmAnaly.alramButtonList,
}))
class AlarmDetails extends PureComponent {
  constructor(props) {
    super(props);
    console.log('报警信息1.0');
    this.state = {};
    this.alarmObj = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params'],
      {},
    );
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '报警信息',
      headerRight: this.props.route.params.params.headerRight,
    });
    this.statusPageOnRefresh();
    alertContent = [
      {
        text: '数据列表',
        onPress: () => {
          let describe = SentencedToEmpty(
            this.props.alarmChartData,
            ['data', 'Datas', 'describe'],
            '',
          );
          // 我这里假设str是等于上面的混合字符串哈, 因为在这里复制太长, 网页显示是直接横向滚动条, 影响网友阅读
          var str = describe;
          var arr = str.match(/\d{4}-\d{2}-\d{2}/g) || []; //年月日匹配
          var arr1 = str.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/g) || []; //年月日时匹配;
          let rtnFinal = SentencedToEmpty(
            this.props.alarmChartData,
            ['data', 'Datas', 'rtnFinal', 0, 'Data'],
            [],
          );
          if (arr.length == 0 && arr1.length == 0 && rtnFinal.length > 0) {
            rtnFinal.map(item => {
              arr1.push(item.Time);
            });
            arr1.sort(function (a, b) {
              return (
                Date.parse(a.replace(/-/g, '/')) -
                Date.parse(b.replace(/-/g, '/'))
              );
            });
          }
          this.refs.doAlert3.hideModal();
          console.log('this.alarmObj', this.alarmObj)
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: 'AlarmDataChart',
              params: {
                ...this.alarmObj,
                type: 'AlarmDataChart',
                timeRange: arr1.length > 0 ? arr1 : arr,
              },
            }),
          );
        },
      },
      {
        text: '密度分布直方图',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: 'StatisPolValueNumsByDGIMN',
              params: { ...this.alarmObj, type: 'StatisPolValueNumsByDGIMN' },
            }),
          );
        },
      },
      {
        text: '波动范围',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: 'FluctuationRange',
              params: this.alarmObj,
            }),
          );
        },
      },
      {
        text: '相关系数表',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: 'StatisLinearCoefficient',
              params: { ...this.alarmObj, type: 'StatisLinearCoefficient' },
            }),
          );
        },
      },
      {
        text: '取消',
        onPress: () => {
          this.refs.doAlert3.hideModal();
        },
      },
    ];
  }
  statusPageOnRefresh = () => {
    this.props.dispatch(
      createAction('alarmAnaly/getSingleWarning')({
        modelWarningGuid: this.alarmObj.ID || this.alarmObj.ModelWarningGuid,
      }),
    );
  };
  getTrendOption = (item, idx) => {
    //使用其它排放口烟气代替本排放口烟气
    //同一现场借用其他合格监测设备数据
    //引用错误、虚假的原始信号值
    let series = [];
    let xData = [];
    let yData = [];
    let colors = ['#5873C7', '#90CB74', '#EA7BCC', '#32cd32', '#6495ed'];
    let formatDates = [];
    let legends = [];
    SentencedToEmpty(item, ['data'], []).map((subI, subId) => {
      if (subId == 0) {
        subI.date.map(subDate => {
          formatDates.push(moment(subDate).format('MM-DD HH:mm'));
        });
      }
      legends.push(subI.PointName ? subI.PointName : subI.pollutantName);
      series.push({
        name: subI.PointName ? subI.PointName : subI.pollutantName,
        type: 'line',
        data: subI.data,
        color: colors[subId],
      });
      yData.push({
        axisLine: {
          show: true,
        },
        type: 'value',

        axisTick: {
          show: false,
        },

        //设置网格线颜色
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#999999'],
            width: 0.5,
            type: 'solid',
          },
        },
      });
    });
    xData.push({
      axisLine: {
        show: true, // 不显示坐标轴线
      },

      type: 'category',

      //设置网格线颜色
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#999999'],
          width: 0.5,
          type: 'solid',
        },
      },
      axisTick: {
        show: false,
      },

      data: formatDates,
    });
    let option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legends,
      },
      grid: { left: '12%', top: '12%', width: '82%', height: '78%' },

      xAxis: xData,
      yAxis: yData,

      series: series,
    };
    return option;
  };
  getSandianOption = (item, idx) => {
    //使用其它排放口烟气代替本排放口烟气
    //同一现场借用其他合格监测设备数据
    //引用错误、虚假的原始信号值
    let dataAll = [];
    let markLineOpt = [];
    let datas1 = SentencedToEmpty(item, ['data', 0, 'data'], []);
    let datas2 = SentencedToEmpty(item, ['data', 1, 'data'], []);
    datas1.map((subI, subId) => {
      dataAll.push([subI, datas2[subId]]);
    });
    markLineOpt = {
      animation: false,
      label: {
        formatter: 'R² = ' + SentencedToEmpty(item, ['linear'], ''),
        align: 'right',
      },
      lineStyle: {
        type: 'solid',
      },
      tooltip: {
        formatter: 'R² = ' + SentencedToEmpty(item, ['linear'], ''),
      },
      data: [
        [
          {
            coord: item.startPoint,
            symbol: 'none',
          },
          {
            coord: item.endPoint,
            symbol: 'none',
          },
        ],
      ],
    };

    let option = {
      grid: [{ left: '12%', top: '12%', width: '82%', height: '73%' }],
      tooltip: {
        formatter: '{a}<br />({c})',
      },
      xAxis: {
        min: item.startPoint[0],
        max: item.endPoint[0],
      },
      yAxis: {
        min: item.startPoint[1],
        max: item.endPoint[1],
      },
      series: [
        {
          type: 'scatter',
          name:
            SentencedToEmpty(item, ['data', 0, 'pollutantName'], '') != ''
              ? SentencedToEmpty(item, ['data', 0, 'pollutantName'], '') +
              ',' +
              SentencedToEmpty(item, ['data', 1, 'pollutantName'], '')
              : SentencedToEmpty(item, ['data', 0, 'PointName'], '') +
              ',' +
              SentencedToEmpty(item, ['data', 1, 'PointName'], ''),
          data: dataAll,
          markLine: markLineOpt,
        },
      ],
    };
    return option;
  };
  getHistoryOption = (item, idx) => {
    //借用本设备合格历史数据

    let series = [];
    let xData = [];
    let yData = [];
    let colors = ['#5873C7', '#90CB74', '#EA7BCC', '#32cd32', '#6495ed'];
    let formatDates = [];

    SentencedToEmpty(item, ['data'], []).map((subI, subId) => {
      if (this.props.showDataSort[idx] == subId) {
        subI.dateHistory.map(subDate => {
          formatDates.push(moment(subDate).format('MM-DD HH:mm'));
        });

        series.push({
          name: subI.pollutantName,
          type: 'line',
          data: subI.dataHistory,
          color: colors[0],
        });
        yData.push({
          axisLine: {
            show: true,
          },
          type: 'value',

          axisTick: {
            show: false,
          },

          //设置网格线颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#999999'],
              width: 0.5,
              type: 'solid',
            },
          },
        });
      }
    });
    xData.push({
      axisLine: {
        show: true, // 不显示坐标轴线
      },

      type: 'category',

      //设置网格线颜色
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#999999'],
          width: 0.5,
          type: 'solid',
        },
      },
      axisTick: {
        show: false,
      },

      data: formatDates,
    });
    let option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: { left: '12%', top: '12%', width: '82%', height: '78%' },

      xAxis: xData,
      yAxis: yData,

      series: series,
    };
    return option;
  };
  getOption = (item, idx) => {
    let data = SentencedToEmpty(this.props.alarmDetailInfo, ['data', 'Datas']);
    let showFlag = -1;
    switch (SentencedToEmpty(data, ['WarningTypeCode'], '')) {
      case '6675e28e-271a-4fb7-955b-79bf0b858e8e':
        //设定限值，超过预设值给出非正常测量数
        showFlag = 1;
        break;
      case '39680c93-e03f-42cf-a21f-115255251d4e':
        //设置上限，超过预设值使用随机数处理
        showFlag = 2;
        break;
      case '1a606047-6f21-4357-a459-03ef7788e09a':
        // 设置上限，超过预设值数据恒定
        showFlag = 3;
        break;
      case 'b52087fb-563c-4939-a11f-f86b10da63c1':
        // "远程控制监测数据"
        showFlag = 4;
        break;
      case '069ab699-428a-4f4b-8df7-915d6b4f3215':
        // "篡改量程与原始信号的对应关系"
        showFlag = 5;
        break;
      case '5bfd23c7-03da-4f4b-a258-a9c618774ab9':
        // "人为修改颗粒物截距斜率"
        showFlag = 5;
        break;
      default:
        break;
    }

    let newChartData = [];
    let series = [];
    let xData = [];
    let yData = [];
    let colors = ['#5873C7', '#90CB74', '#EA7BCC', '#32cd32', '#6495ed'];
    let formatDates = [];
    let markLineArr = [];
    let markPoint = [];
    SentencedToEmpty(item, ['data'], []).map((subI, subId) => {
      if (showFlag == 5) {
        subI.splitTime.map((split, spID) => {
          markLineArr.push({
            xAxis: moment(split).format('MM-DD HH:mm'),
          });
        });

        subI.splitDate.map((split, spID) => {
          markLineArr.push([
            {
              name: '波动下限',
              lineStyle: {
                color: colors[spID + 2],
              },
              coord: [
                moment(split.startTime).format('MM-DD HH:mm'),
                split.LowLimit,
              ],
            },
            {
              coord: [
                moment(split.endTime).format('MM-DD HH:mm'),
                split.LowLimit,
              ],
            },
          ]);
          markLineArr.push([
            {
              lineStyle: {
                color: colors[spID + 2],
              },
              name: '波动上限',
              coord: [
                moment(split.startTime).format('MM-DD HH:mm'),
                split.UpperLimit,
              ],
            },
            {
              coord: [
                moment(split.endTime).format('MM-DD HH:mm'),
                split.UpperLimit,
              ],
            },
          ]);
        });
      } else if (showFlag == 2 || showFlag == 3) {
        //设置上限，超过预设值使用随机数处理
        markLineArr.push(
          {
            yAxis: subI.defaultValue,
            lineStyle: { color: colors[idx] },
            name: '预设值',
          },
          {
            yAxis: subI.monitorValue,
            lineStyle: { color: colors[idx] },
            name: '标准值',
          },
        );
      } else if (showFlag == 4) {
        //远程控制监测数据
        subI.splitTime.map((split, spID) => {
          markLineArr.push({
            xAxis: moment(split).format('MM-DD HH:mm'),
            label: { show: false },
            lineStyle: { color: 'rgba(242, 10, 10, 1)' },
          });
        });
        markLineArr.push({
          yAxis: subI.monitorValue,
          name: '值',
          lineStyle: { color: colors[idx] },
        });
      } else {
        markLineArr.push([
          {
            yAxis: subI.standardLower || 'min',
            lineStyle: { color: colors[idx] },
            name: '下限值',
          },
          {
            yAxis: subI.standardUpper || 'max',
            name: '上限值',
            lineStyle: { color: colors[idx] },
          },
        ]);
      }
      if (this.props.showDataSort[idx] == subId) {
        let OutDefaultTimes = [];
        subI.date.map((subDate, dateID) => {
          if (showFlag == 3 || showFlag == 2) {
            subI.OutDefaultTimes.map(outT => {
              if (outT == subDate) {
                OutDefaultTimes.push(dateID);
              }
            });
          }
          formatDates.push(moment(subDate).format('MM-DD HH:mm'));
        });
        if (showFlag == -1) {
          newChartData = subI.data;
        } else if (showFlag == 1) {
          subI.data.map((subData, j) => {
            newChartData.push({
              value: subData,
              symbol: 'triangle',
              symbolSize: 20,
              workingFlagName: subI.workingFlagName[j],
              dataFlagName: subI.dataFlagName[j],
              unit: subI.unit,
            });
          });
        } else if (showFlag == 3 || showFlag == 2) {
          subI.data.map((subData, j) => {
            if (
              OutDefaultTimes.findIndex(item => {
                return item == j;
              }) > -1
            ) {
              markPoint.push({
                xAxis: formatDates[j],
                yAxis: subData,
                symbolSize: 5,
                symbol: 'circle',
                itemStyle: {
                  color: 'rgba(242, 10, 10, 1)',
                },
              });
              newChartData.push({
                value: subData,
                itemStyle: {
                  color: 'rgba(242, 10, 10, 1)',
                },
                showSymbol: true,
                symbolSize: 5,
                workingFlagName: subI.workingFlagName[j],
                dataFlagName: subI.dataFlagName[j],
                unit: subI.unit,
                symbol: 'circle',
              });
            } else {
              newChartData.push({
                value: subData,
                showSymbol: false,
                symbolSize: 0,
                workingFlagName: subI.workingFlagName[j],
                dataFlagName: subI.dataFlagName[j],
                unit: subI.unit,
              });
            }
          });
        } else {
          newChartData = subI.data;
        }
        yData.push({
          axisLine: {
            show: true,
          },
          type: 'value',

          axisTick: {
            show: false,
          },
          max: subI.max || subI.monitorValue || null,
          min: subI.min || null,
          //设置网格线颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#999999'],
              width: 0.5,
              type: 'solid',
            },
          },
        });
        xData.push({
          axisLine: {
            show: true, // 不显示坐标轴线
          },

          type: 'category',

          //设置网格线颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#999999'],
              width: 0.5,
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },

          data: formatDates,
        });
        series.push({
          name: subI.pollutantName,
          type: 'line',
          data: newChartData,
          markPoint: {
            data: markPoint,
          },
          markLine: {
            label: {
              formatter:
                showFlag == 5
                  ? '{b}'
                  : showFlag == 2 || showFlag == 3
                    ? '{b}: {c}'
                    : '{c}',
            },
            data:
              showFlag == 1 || showFlag == -1
                ? markLineArr[subId]
                : markLineArr,
          },
        });
      }
    });
    let option = {
      tooltip: {
        trigger: 'axis',
        position:
          showFlag == 1
            ? function (pos, params, dom, rect, size) {
              // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
              var obj = { top: 10 };
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            }
            : null,
        formatter:
          showFlag == 1
            ? function (params) {
              'show source';
              var htmlStr =
                '<div style="height: auto;display: flex;flex-direction: column;justify-content:space-between;align-items:flex-start;"><span style="color: #fff;">' +
                params[0].axisValue +
                '</span>';
              for (var i = 0; i < params.length; i++) {
                htmlStr +=
                  '<span style="color: #fff;">' +
                  `${'工况：'}${params[i].data.workingFlagName}` +
                  '</span>';
                htmlStr +=
                  '<span style="color: #fff;">' +
                  params[i].marker +
                  params[i].seriesName +
                  ':' +
                  params[i].value +
                  params[i].data.unit +
                  '(' +
                  params[i].data.dataFlagName +
                  ')' +
                  '</span>';
              }
              htmlStr += '</div>';
              return htmlStr;
            }
            : null,
      },
      color: colors[idx],
      grid: {
        left: '10%',
        top: '12%',
        width:
          showFlag == 5
            ? '78%'
            : showFlag == 2 || showFlag == 3
              ? '67%'
              : '78%',
        height: '78%',
      },

      xAxis: xData,
      yAxis: yData,

      series: series,
    };

    return option;
  };
  renderTable() {
    let views = [];

    let rtnFinal = SentencedToEmpty(
      this.props.alarmChartData,
      ['data', 'Datas', 'rtnFinal'],
      [],
    );

    if (rtnFinal.length > 0) {
      rtnFinal.map(rtnItem => {
        let rtnViews = [];
        let titleArr = [
          { PollutantName: '时间', PollutantCode: 'Time' },
          ...SentencedToEmpty(rtnItem, ['Column'], []),
        ];
        let Data = SentencedToEmpty(rtnItem, ['Data'], []);
        titleArr.map((item, idx) => {
          rtnViews.push(
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <View
                style={{
                  backgroundColor: '#F3F3F3',
                  height: 1,
                  marginBottom: 10,
                  marginTop: 10,
                  width: '100%',
                }}></View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  minHeight: 40,
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.content,
                    {
                      color: '#333',
                      fontSize: 15,
                      textAlign: 'center',
                      width: 100,
                    },
                  ]}>
                  {item.PollutantName}
                </Text>

                {item.PollutantCode == 'Error' ? (
                  <Text
                    style={[
                      styles.content,
                      {
                        color: 'red',
                        fontSize: 17,
                        textAlign: 'center',
                        width: 100,
                      },
                    ]}>
                    {Data[0][item.PollutantCode]}
                  </Text>
                ) : (
                  Data.map(subI => {
                    return (
                      <Text
                        style={[
                          styles.content,
                          {
                            color: '#666',
                            fontSize: 15,
                            width: 100,
                            textAlign: 'center',
                          },
                        ]}>
                        {subI[item.PollutantCode]}
                      </Text>
                    );
                  })
                )}
              </View>
            </View>,
          );
        });
        views.push(
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {rtnViews}
            </View>
          </ScrollView>,
        );
      });
    } else {
      let titleArr = [
        { PollutantName: '时间', PollutantCode: 'Time' },
        ...SentencedToEmpty(
          this.props.alarmChartData,
          ['data', 'Datas', 'Column'],
          [],
        ),
      ];
      let Data = SentencedToEmpty(
        this.props.alarmChartData,
        ['data', 'Datas', 'Data'],
        [],
      );
      titleArr.map((item, idx) => {
        views.push(
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                height: 1,
                width: '100%',
                marginBottom: 10,
                marginTop: 10,
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 40,
              }}>
              <Text
                style={[
                  styles.content,
                  {
                    color: '#333',
                    fontSize: 15,
                    width: '38%',
                    textAlign: 'center',
                  },
                ]}>
                {item.PollutantName}
              </Text>

              {item.PollutantCode == 'Error' ? (
                <Text
                  style={[
                    styles.content,
                    {
                      color: 'red',
                      fontSize: 17,
                      width: '60%',
                      textAlign: 'center',
                    },
                  ]}>
                  {Data[0][item.PollutantCode]}
                </Text>
              ) : (
                Data.map(subI => {
                  return (
                    <Text
                      style={[
                        styles.content,
                        {
                          color: '#666',
                          fontSize: 15,
                          width: Data.length > 1 ? '30%' : '60%',
                          textAlign: 'center',
                        },
                      ]}>
                      {subI[item.PollutantCode]}
                    </Text>
                  );
                })
              )}
            </View>
          </View>,
        );
      });
    }

    return views;
  }

  renderChart() {
    let views = [];
    let chartData = SentencedToEmpty(this.props.alarmChartData, [
      'data',
      'Datas',
    ]);
    let info = SentencedToEmpty(this.props.alarmDetailInfo, ['data', 'Datas']);
    let typeCode = SentencedToEmpty(info, ['WarningTypeCode'], '');

    SentencedToEmpty(chartData, ['chartData'], []).map((item, idx) => {
      {
        typeCode == 'c0af25fb-220b-45c6-a3de-f6c8142de8f1' ||
          typeCode == 'ab2bf5ec-3ade-43fc-a720-c8fd92ede402' ||
          typeCode == 'f021147d-e7c6-4c1d-9634-1d814ff9880a'
          ? views.push(
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.content, { color: '#333', fontSize: 15 }]}>
                {item.title}
              </Text>
              <View style={{ height: 180, backgroundColor: '#ffffff' }}>
                <Echarts
                  option={this.getSandianOption(item, idx)}
                  height={180}
                  flex={1}
                />
              </View>
              <View
                style={{
                  height: 180,
                  backgroundColor: '#ffffff',
                  marginTop: 10,
                }}>
                <Echarts
                  option={this.getTrendOption(item, idx)}
                  height={180}
                  flex={1}
                />
              </View>
            </View>,
          )
          : views.push(
            <View style={{ marginTop: 10 }}>
              <SDLText
                style={[styles.content, { color: '#333', fontSize: 15 }]}>
                {item.title}
              </SDLText>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: 'row', marginTop: 10 }}>
                {item.data.map((subI, subid) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let newSort = [...this.props.showDataSort];
                        newSort[idx] = subid;
                        this.props.dispatch(
                          createAction('alarmAnaly/updateState')({
                            showDataSort: newSort,
                          }),
                        );
                      }}
                      style={{
                        backgroundColor: '#F4F7FF',
                        borderRadius: 13,
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 5,
                        paddingRight: 5,
                        marginRight: 5,
                      }}>
                      <Text
                        style={{
                          color:
                            this.props.showDataSort[idx] == subid
                              ? '#4AA0FF'
                              : '#999999',
                        }}>
                        {subI.pollutantName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={{ height: 180, backgroundColor: '#ffffff' }}>
                <Echarts
                  option={this.getOption(item, idx)}
                  height={180}
                  flex={1}
                />
              </View>
              {
                //借用本设备合格历史数据
                typeCode == 'd5dea4cc-bd6c-44fa-a122-a1f44514b465' ? (
                  <View
                    style={{
                      height: 180,
                      marginTop: 10,
                      backgroundColor: '#ffffff',
                    }}>
                    <Echarts
                      option={this.getHistoryOption(item, idx)}
                      height={180}
                      flex={1}
                    />
                  </View>
                ) : null
              }
            </View>,
          );
      }
    });
    return views;
  }

  render() {
    var options = {
      hiddenTitle: true,
      innersHeight: 300,
    };
    let data = SentencedToEmpty(this.props.alarmDetailInfo, ['data', 'Datas']);
    let chartData = SentencedToEmpty(this.props.alarmChartData, [
      'data',
      'Datas',
    ]);
    let showChart = true;
    if (
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      '3d209ce2-da92-44c4-916b-8874d05da558' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      'ce61d9a9-5d0d-4b66-abbd-72a89e823ee2' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      'c934b575-a357-4a2c-b493-02849ce9cee3' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      'a59cce2a-8558-4c42-8a45-4d8402e4b29d' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      '0fa091a3-7a19-4c9e-91bd-c5a4bf2e9827' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      '178fd470-ca31-480a-835a-3322fd57a4f0' ||
      SentencedToEmpty(data, ['WarningTypeCode'], '') ==
      'b9601a0f-22af-4a07-927f-82d6369f2e12'
    ) {
      showChart = false;
    }
    return (
      <StatusPage
        status={this.props.alarmDetailInfo.status}
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
          //空页面按钮回调
          console.log('重新刷新');
          this.statusPageOnRefresh();
        }}
        onErrorPress={() => {
          //错误页面按钮回调
          console.log('错误操作回调');
          this.statusPageOnRefresh();
        }}>
        <ScrollView style={{ flex: 1, width: SCREEN_WIDTH, padding: 13 }}>
          <View style={[styles.card]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -13,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: '#4AA0FF',
                    width: 3,
                    height: 14,
                  }}></View>
                <SDLText
                  fontType={'large'}
                  style={{ color: '#333333', marginLeft: 8 }}>
                  线索信息
                </SDLText>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS == 'ios') {
                    Alert.alert('提示', '请选择数据类型', alertContent);
                  } else {
                    this.refs.doAlert3.show();
                  }
                }}
                style={{
                  backgroundColor: '#4AA0FF',
                  width: 100,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <SDLText fontType={'large'} style={{ color: '#fff' }}>
                  线索数据
                </SDLText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                width: '100%',
                marginTop: 15,
                height: 1,
              }}></View>
            <View style={[styles.oneRow, { marginTop: 15 }]}>
              <SDLText style={[styles.label]}>场景类型：</SDLText>
              <SDLText
                style={[
                  styles.content,
                  { maxWidth: SCREEN_WIDTH - 140 },
                ]}>{`${SentencedToEmpty(
                  data,
                  ['WarningTypeName'],
                  '-',
                )}`}</SDLText>
            </View>
            <View style={[styles.oneRow, {}]}>
              <SDLText style={[styles.label]}>发现时间：</SDLText>
              <SDLText style={[styles.content]}>{`${SentencedToEmpty(
                data,
                ['WarningTime'],
                '-',
              )}`}</SDLText>
            </View>
            <View style={[styles.oneRow, {}]}>
              <SDLText style={[styles.label]}>企业：</SDLText>
              <SDLText
                style={[
                  styles.content,
                  { maxWidth: SCREEN_WIDTH - 140 },
                ]}>{`${SentencedToEmpty(data, ['EntNmae'], '-')}`}</SDLText>
            </View>
            <View style={[styles.oneRow, {}]}>
              <SDLText style={[styles.label]}>排放口：</SDLText>
              <SDLText style={[styles.content]}>{`${SentencedToEmpty(
                data,
                ['PointName'],
                '-',
              )}`}</SDLText>
            </View>
            <View style={[styles.oneRow, { alignItems: 'center' }]}>
              <SDLText style={[styles.label]}>核实状态：</SDLText>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor:
                    SentencedToEmpty(data, ['CheckedResultCode'], '') == 3
                      ? 'rgba(102,102,102,0.1)'
                      : SentencedToEmpty(data, ['CheckedResultCode'], '') == 1
                        ? 'rgba(255,87,74,0.1)'
                        : 'rgba(38,193,154,0.1)',
                  marginLeft: 3,

                  height: 20,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Text
                  style={[
                    {
                      color:
                        SentencedToEmpty(data, ['CheckedResultCode'], '') == 3
                          ? '#666666'
                          : SentencedToEmpty(data, ['CheckedResultCode'], '') ==
                            1
                            ? '#FF574A'
                            : '#26C19A',
                      textAlign: 'center',
                      fontSize: 12,
                    },
                  ]}>
                  {SentencedToEmpty(data, ['CheckedResult'], '')}
                </Text>
              </View>
            </View>

            <View style={[styles.oneRow, { paddingRight: 23 }]}>
              <SDLText style={[styles.label]}>线索内容：</SDLText>
              <SDLText style={[styles.content, { flex: 1 }]}>{`${SentencedToEmpty(
                data,
                ['WarningContent'],
                '暂未填写',
              )}`}</SDLText>
            </View>
          </View>
          <View style={[styles.card, { marginTop: 13, marginBottom: 20 }]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -13,
              }}>
              <View
                style={{
                  backgroundColor: '#4AA0FF',
                  width: 3,
                  height: 14,
                }}></View>
              <SDLText
                fontType={'large'}
                style={{ color: '#333333', marginLeft: 8 }}>
                线索特征
              </SDLText>
            </View>
            <View
              style={{
                backgroundColor: '#F3F3F3',
                width: '100%',
                marginTop: 15,
                height: 1,
              }}></View>
            <SDLText
              style={[
                {
                  flex: 1,
                  marginTop: 10,
                  color: globalcolor.recordde,
                  fontSize: 15,
                  lineHeight: 18,
                },
              ]}>{`${SentencedToEmpty(chartData, ['describe'], '')}`}</SDLText>

            {showChart == true ? this.renderChart() : this.renderTable()}
          </View>
          <View style={{ flex: 1, height: 100 }}></View>
        </ScrollView>
        <AlertDialog components={<MyView />} options={options} ref="doAlert3" />

        {SentencedToEmpty(data, ['Status'], '1') == '1' &&
          this.props.alramButtonList.findIndex(sItem => {
            if (sItem.id == '3a5d2719-91d0-430a-ad11-00d277065881') return true;
          }) >= 0 &&
          SentencedToEmpty(this.alarmObj, ['IsCheck'], 0) == 0 && (
            <TouchableOpacity
              onPress={() => {
                this.props.dispatch(
                  NavigationActions.navigate({
                    routeName: 'AlarmVerifyAnalyze',
                    params: [
                      { ...this.alarmObj, ModelWarningGuid: this.alarmObj.ID },
                    ],
                  }),
                );
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                flex: 1,
                alignSelf: 'center',
                width: SCREEN_WIDTH - 30,
                height: 44,
                borderRadius: 5,
                backgroundColor: '#4DA9FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: '#fff' }}>核实</Text>
            </TouchableOpacity>
          )}
      </StatusPage>
    );
  }
}
class MyView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
        {alertContent.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={item.onPress}
              style={{
                padding: 18,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                key={index}
                style={{
                  color: 'rgba(0,111,255,1)',
                  fontSize: 18,
                  marginLeft: 10,
                }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  oneRow: {
    width: SCREEN_WIDTH - 28,
    flexDirection: 'row',
    marginVertical: 7,
  },
  card: {
    paddingRight: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  label: {
    width: 82,
    color: '#666666',
    fontSize: 14,
    marginRight: 5,
  },
  content: {
    color: globalcolor.recordde,
    fontSize: 15,
    lineHeight: 18,
  },
});

//make this component available to the app
export default AlarmDetails;
