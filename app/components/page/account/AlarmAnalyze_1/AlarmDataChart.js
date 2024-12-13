import React from 'react';
import { connect } from 'react-redux';
import {
  createNavigationOptions,
  NavigationActions,
  createAction,
  SentencedToEmpty,
  ShowToast,
} from '../../../../utils';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import {
  SimplePickerSingleTime,
  SDLText,
  StatusPage,
  SimplePickerRangeDay,
  SimplePicker,
} from '../../../../components';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Echarts, echarts } from 'react-native-secharts';
import moment from 'moment';
import {
  lockToLandscapeLeft,
  lockToLandscapeRight,
  lockToPortrait,
} from 'react-native-orientation';
import globalcolor from '../../../../config/globalcolor';
/**
 *
 *图表数据
 */
@connect(({ alarmAnaly }) => ({
  AlarmDataChartValue: alarmAnaly.AlarmDataChartValue,
  AlarmChartPollutant: alarmAnaly.AlarmChartPollutant,
  alarmChartData: alarmAnaly.alarmChartData,
}))
export default class AlarmDataChart extends React.Component {
  // static navigationOptions = {
  //     header: null
  // };
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    let timeRange = props.route.params.params.timeRange;
    super(props);
    console.log('数据列表1.0');
    this.state = {
      _harmonyOSHide: false,
      selectDGIMN: props.route.params.params.DGIMN || '',
      hideEchart: false,
      selectDateRange: '两周',
      colors: [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
      ],
      selectTime: [
        moment(timeRange[timeRange.length - 1])
          .subtract(7, 'days')
          .format('YYYY-MM-DD 00:00:00'),
        moment(timeRange[timeRange.length - 1])
          .add(7, 'days')
          .format('YYYY-MM-DD 23:59:59'),
      ],
      option1: {},
    };

    this.echart1 = React.createRef();

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
      createAction(`alarmAnaly/GetPollutantListByDgimn`)({
        DGIMNs: this.state.selectDGIMN,
        selectTime: this.state.selectTime,
        callback: data => {
          this.setState({
            option1: this.getLinearCoefficientOption(),
          });
        },
      }),
    );
  }
  getDataTypeSelectOption = () => {
    let PointArr = SentencedToEmpty(
      this.props.alarmChartData,
      ['data', 'Datas', 'chartData', 0, 'data'],
      [],
    );
    return {
      codeKey: 'DGIMN',
      nameKey: 'PointName',
      placeHolder: this.props.route.params.params.PointName,
      dataArr:
        PointArr.length > 0 && PointArr[0].DGIMN
          ? PointArr
          : [
            {
              PointName: this.props.route.params.params.PointName,
              DGIMN: this.props.route.params.params.DGIMN,
            },
          ],
      defaultCode: '',
      onSelectListener: item => {
        this.setState({ selectDGIMN: item.DGIMN }, () => {
          this.refreshData();
        });
      },
    };
  };
  getLinearCoefficientOption = () => {
    let self = this;
    const PollutantArr = SentencedToEmpty(
      this.props.AlarmChartPollutant,
      ['data', 'Datas'],
      [],
    );
    // prettier-ignore
    const ChartArr = SentencedToEmpty(this.props.AlarmDataChartValue, ['data', 'Datas',], []);
    // prettier-ignore
    const PollutanStArr = SentencedToEmpty(this.props.AlarmChartPollutant, ['pollttantSelect'], []);
    let markLineArr = [];
    let xAxisArr = [];
    let yAxisArr = [];
    let seriesArr = [];
    let PollutantNameArr = [];
    let showColors = [];
    let markAreaArr = [];
    let subMarkArea = [];

    self.props.route.params.params.timeRange.map(item => {
      if (
        ChartArr.length > 0 &&
        Date.parse(item.replace(/-/g, '/')) -
        Date.parse(ChartArr[0]['MonitorTime'].replace(/-/g, '/')) >
        0 &&
        Date.parse(item.replace(/-/g, '/')) -
        Date.parse(
          ChartArr[ChartArr.length - 1]['MonitorTime'].replace(/-/g, '/'),
        ) <
        0
      ) {
        markLineArr.push({
          name: '发现异常',
          xAxis: moment(item).format('YYYY-MM-DD HH:mm'),
        });
      }
    });
    ChartArr.map(function (item) {
      if (subMarkArea.length < 2) {
        if (item['WorkCon_Status'] == true) {
          subMarkArea.push({
            name: '工况异常',
            xAxis: item['MonitorTime'],
          });
        } else {
          if (subMarkArea.length > 0) {
            subMarkArea.push({
              name: '工况异常',
              xAxis: item['MonitorTime'],
            });
            markAreaArr.push(subMarkArea);
          }
        }
      }

      xAxisArr.push(item['MonitorTime']);
    });
    PollutantArr.map(function (item, idx) {
      let selectIndex = PollutanStArr.findIndex(subI => {
        if (subI.PollutantName == item.PollutantName) return true;
      });
      if (selectIndex < 0) {
      } else {
        showColors.push(self.state.colors[selectIndex]);
        yAxisArr.push({
          type: 'value',
          offset: selectIndex <= 2 ? selectIndex * 50 : (selectIndex - 3) * 50,
          name: item.PollutantName,
          alignTicks: true,
          position: selectIndex <= 2 ? 'left' : 'right',
          axisLine: {
            show: true,
          },
        });
        let data = [];
        ChartArr.map(function (subitem) {
          data.push({
            value: subitem[item.PollutantCode],
            workingFlagName: subitem['WorkCon'],
            dataFlagName: subitem[item.PollutantCode + '_Flag'] || '-',
            unit: '8',
          });
        });
        PollutantNameArr.push(item.PollutantName);
        seriesArr.push({
          name: item.PollutantName,
          type: 'line',
          data: data,
          yAxisIndex: selectIndex,
          markLine: {
            label: { formatter: '发现异常' },
            lineStyle: {
              color: 'red',
            },
            data: markLineArr,
          },
          markArea: {
            label: { color: 'rgba(228, 223, 223, 1)' },
            itemStyle: {
              color: 'rgba(228, 223, 223, 1)',
            },
            data: markAreaArr,
          },
        });
      }
    });
    let option = {
      tooltip: {
        position: function (point, params, dom, rect, size) {
          'show source';
          return [point[0], '8%'];
        },
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: function (params) {
          'show source';
          var htmlStr =
            '<div style="height: auto;display: flex;flex-direction: column;justify-content:space-between;align-items:flex-start;"><span style="color: #fff;">' +
            params[0].axisValue +
            '</span>';
          htmlStr +=
            '<span style="color: #fff;">' +
            `${'工况：'}${params[0].data.workingFlagName}` +
            '</span>';
          for (var i = 0; i < params.length; i++) {
            htmlStr +=
              '<span style="color: #fff;">' +
              params[i].marker +
              params[i].seriesName +
              ':' +
              params[i].value +
              '(' +
              params[i].data.dataFlagName +
              ')' +
              '</span>';
          }
          htmlStr += '</div>';
          return htmlStr;
        },
      },
      grid: {
        top: Platform.OS == 'android' ? '13%' : '11%',
        bottom: '10%',
        left: '21%',
        right: '21%',
      },

      xAxis: {
        data: xAxisArr,
      },

      dataZoom: [
        {
          id: 'dataZoomX',
          type: 'inside',
          filterMode: 'empty',
        },
      ],
      color: showColors,
      yAxis: yAxisArr,
      axisSame: true, // 让y轴格数一致
      series: seriesArr,
    };

    return option;
  };
  getRangeDaySelectOption = () => {
    return {
      defaultTime: this.state.selectTime[0],
      start: this.state.selectTime[0],
      end: this.state.selectTime[1],
      formatStr: 'MM/DD',
      onSureClickListener: (start, end) => {
        let startMoment = moment(start);
        let endMoment = moment(end);

        this.setState(
          {
            selectDateRange: '',
            selectTime: [
              startMoment.format('YYYY-MM-DD 00:00:00'),
              endMoment.format('YYYY-MM-DD 23:59:59'),
            ],
          },
          () => {
            this.refreshData();
          },
        );
      },
    };
  };
  render() {
    let self = this;
    console.log('option1 = ', self.state.option1);
    return (
      <View style={{ flex: 1 }}>
        <StatusPage
          style={{ flex: 1 }}
          errorPaddingTop={50}
          emptyPaddingTop={50}
          status={this.props.AlarmDataChartValue.status}
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
          }}>
          {this.props.AlarmDataChartValue.status == 200 && !this.state._harmonyOSHide ? (
            <View
              style={{ flex: 1 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  backgroundColor: '#fff',
                  paddingRight: 100,
                  alignItems: 'center',
                }}>
                {SentencedToEmpty(
                  this.props.AlarmChartPollutant,
                  ['data', 'Datas'],
                  [],
                ).map((item, idx) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let nowSelect = SentencedToEmpty(
                          this.props.AlarmChartPollutant,
                          ['pollttantSelect'],
                          [],
                        );

                        if (
                          nowSelect.findIndex(subI => {
                            if (subI.PollutantName == item.PollutantName)
                              return true;
                          }) < 0
                        ) {
                          if (nowSelect.length >= 6) {
                            ShowToast('同时最多支持选择6种因子');
                            return;
                          } else {
                            nowSelect.push(item);
                          }
                        } else {
                          nowSelect.splice(
                            SentencedToEmpty(
                              this.props.AlarmChartPollutant,
                              ['pollttantSelect'],
                              [],
                            ).findIndex(subI => {
                              if (subI.PollutantName == item.PollutantName)
                                return true;
                            }),
                            1,
                          );
                        }
                        self.setState({ hideEchart: true }, () => {
                          let newOP = self.getLinearCoefficientOption();
                          self.setState({ option1: newOP, hideEchart: false });
                        });
                      }}
                      style={{
                        backgroundColor:
                          SentencedToEmpty(
                            this.props.AlarmChartPollutant,
                            ['pollttantSelect'],
                            [],
                          ).findIndex(subI => {
                            if (subI.PollutantName == item.PollutantName)
                              return true;
                          }) < 0
                            ? '#ccc'
                            : this.state.colors[
                            SentencedToEmpty(
                              this.props.AlarmChartPollutant,
                              ['pollttantSelect'],
                              [],
                            ).findIndex(subI => {
                              if (subI.PollutantName == item.PollutantName)
                                return true;
                            })
                            ],
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 5,
                        marginTop: 5,
                        marginLeft: 5,
                      }}>
                      <Text style={{ color: '#fff' }}>{item.PollutantName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {this.state.hideEchart == false ? (
                  <Echarts
                    option={self.state.option1}
                    width={SCREEN_HEIGHT}
                    height={SCREEN_WIDTH - 140}
                    onPress={this.onPress}
                  />
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  backgroundColor: '#fff',
                  paddingRight: 100,
                  alignItems: 'center',
                }}>
                <Text>发现线索前后数据:</Text>
                {['两周', '一月', '三月'].map((item, idx) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        let timeRange =
                          this.props.route.params.params.timeRange;
                        let selectTime = [];
                        if (item == '两周') {
                          selectTime = [
                            moment(timeRange[timeRange.length - 1])
                              .subtract(7, 'days')
                              .format('YYYY-MM-DD 00:00:00'),
                            moment(timeRange[timeRange.length - 1])
                              .add(7, 'days')
                              .format('YYYY-MM-DD 23:59:59'),
                          ];
                        } else if (item == '一月') {
                          selectTime = [
                            moment(timeRange[timeRange.length - 1])
                              .subtract(15, 'days')
                              .format('YYYY-MM-DD 00:00:00'),
                            moment(timeRange[timeRange.length - 1])
                              .add(15, 'days')
                              .format('YYYY-MM-DD 23:59:59'),
                          ];
                        } else {
                          selectTime = [
                            moment(timeRange[timeRange.length - 1])
                              .subtract(45, 'days')
                              .format('YYYY-MM-DD 00:00:00'),
                            moment(timeRange[timeRange.length - 1])
                              .add(45, 'days')
                              .format('YYYY-MM-DD 23:59:59'),
                          ];
                        }
                        this.setState(
                          {
                            selectDateRange: item,
                            selectTime,
                          },
                          () => {
                            this.refreshData();
                          },
                        );
                      }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 15,
                      }}>
                      <Text
                        style={{
                          color:
                            this.state.selectDateRange == item
                              ? '#ee6666'
                              : '#333',
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <SimplePickerRangeDay
                  style={[{ width: 120, marginLeft: 15 }]}
                  option={this.getRangeDaySelectOption()}
                />
                <SimplePicker
                  option={this.getDataTypeSelectOption()}
                  style={[{ width: 120, marginLeft: 15 }]}
                />
              </View>
            </View>
          ) : null}
        </StatusPage>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 48,
            height: 48,
            borderRadius: 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: globalcolor.headerBackgroundColor,
          }}
          onPress={() => {
            const _this = this;
            this.setState({
              hideEchart: true,
              _harmonyOSHide: true,
            }, () => {
              lockToPortrait();
              _this.props.dispatch(NavigationActions.back());
              // setTimeout(() => {
              //   _this.props.dispatch(NavigationActions.back());
              // }, 100);
            });
          }}>
          <SDLText style={{ color: '#fff' }}>返回</SDLText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
