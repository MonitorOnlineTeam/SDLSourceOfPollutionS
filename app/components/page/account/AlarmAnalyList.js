import React, { PureComponent, Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import {
  StatusPage,
  Touchable,
  PickerTouchable,
  SimplePickerRangeDay,
  SimplePicker,
  SDLText,
  AlertDialog,
} from '../../../components';
import {
  createNavigationOptions,
  NavigationActions,
  createAction,
  SentencedToEmpty,
  ShowToast,
} from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import FlatListWithHeaderAndFooter from '../../../components/FlatListWithHeaderAndFooter';
let alertContent = [];
/**
 * 报警记录
 */
@connect(({ alarmAnaly }) => ({
  alarmAnalyListData: alarmAnaly.alarmAnalyListData,
  alarmAnalyListResult: alarmAnaly.alarmAnalyListResult,
  alarmAnalyIndex: alarmAnaly.alarmAnalyIndex,
  alarmAnalyDataType: alarmAnaly.alarmAnalyDataType,
  alarmAnalyTotal: alarmAnaly.alarmAnalyTotal,
  MoldList: alarmAnaly.MoldList,
  alarmAnalyBeginTime: alarmAnaly.alarmAnalyBeginTime,
  alarmAnalyEndTime: alarmAnaly.alarmAnalyEndTime,
  alramButtonList: alarmAnaly.alramButtonList,
  proFlag: alarmAnaly.proFlag,
}))
export default class AlarmAnalyList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      warningTypeCode: '',
      selectItems: [],
    };
    alertContent = [
      {
        text: '未来一天',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.stopAlarm(1);
        },
      },
      {
        text: '未来三天',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.stopAlarm(3);
        },
      },
      {
        text: '未来一周',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.stopAlarm(7);
        },
      },
      {
        text: '未来十五天',
        onPress: () => {
          this.refs.doAlert3.hideModal();
          this.stopAlarm(15);
        },
      },
      {
        text: '取消',
        onPress: () => {
          this.refs.doAlert3.hideModal();
        },
      },
    ];
    let currentItem = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item'],
      {},
    );
    if (this.props.proFlag == 1) {
    } else {
      this.props.dispatch(
        createAction('alarmAnaly/IsHaveStopTime')({
          params: {
            callback: re => {
              if (re == false) {
                this.props.navigation.setOptions({
                  headerRight: () => <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS == 'ios') {
                        Alert.alert(
                          '提示',
                          '请选择暂停报警时间',
                          alertContent,
                        );
                      } else {
                        this.refs.doAlert3.show();
                      }
                    }}>
                    {/* <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>
                      {'暂停报警'}
                    </SDLText>
                  </TouchableOpacity>
                });

                // this.props.navigation.setParams({
                //   headerRight: (
                //     <TouchableOpacity
                //       onPress={() => {
                //         if (Platform.OS == 'ios') {
                //           Alert.alert(
                //             '提示',
                //             '请选择暂停报警时间',
                //             alertContent,
                //           );
                //         } else {
                //           this.refs.doAlert3.show();
                //         }
                //       }}>
                //       {/* <Image style={{ height: 20, width: 20, marginHorizontal: 16 }} source={require('../../../images/icon_transmit.png')} /> */}
                //       <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>
                //         {'暂停报警'}
                //       </SDLText>
                //     </TouchableOpacity>
                //   ),
                // });
              }
            },
            dgimn: currentItem.DGIMN,
            modelGuid: currentItem.ModelGuid,
          },
        }),
      );
    }
  }
  stopAlarm = timeType => {
    let currentItem = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item'],
      {},
    );

    this.props.dispatch(
      createAction('alarmAnaly/SetStopTime')({
        params: {
          callback: () => {
            this.props.navigation.setParams({
              headerRight: null,
            });
          },
          dgimn: currentItem.DGIMN,
          modelGuid: currentItem.ModelGuid,
          stopAlarmBeginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          stopAlarmEndTime: moment()
            .add(timeType, 'days')
            .format('YYYY-MM-DD 23:59:59'),
        },
      }),
    );
  };
  componentWillUnmount() {
    DeviceEventEmitter.emit('refreshSec', 'true');
  }
  componentDidMount() {
    this.statusPageOnRefresh();
  }

  setNavigationOptions = () => {
    if (
      typeof this.props.params.params.headerRight != 'undefined' &&
      this.props.params.params.headerRight
    ) {
      this.props.navigation.setOptions({
        title: '异常识别线索',
        headerRight: this.props.params.params.headerRight,
      });
    } else {
      this.props.navigation.setOptions({
        title: '异常识别线索',
      });
    }
  };

  getRangeDaySelectOption = () => {
    return {
      defaultTime: this.props.alarmAnalyBeginTime,
      start: this.props.alarmAnalyBeginTime,
      end: this.props.alarmAnalyEndTime,
      formatStr: 'MM/DD',
      onSureClickListener: (start, end) => {
        let startMoment = moment(start);
        let endMoment = moment(end);
        this.props.dispatch(
          createAction('alarmAnaly/updateState')({
            alarmAnalyIndex: 1,
            alarmAnalyTotal: 0,
            alarmAnalyBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
            alarmAnalyEndTime: endMoment.format('YYYY-MM-DD 23:59:59'),
          }),
        );

        this.onRefresh();
      },
    };
  };

  onRefresh = index => {
    this.setState({ selectItems: [] });
    let item = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item'],
      {},
    );
    this.props.dispatch(
      createAction('alarmAnaly/updateState')({
        alarmAnalyIndex: 1,
        alarmAnalyTotal: 0,
      }),
    );
    this.props.dispatch(
      createAction('alarmAnaly/getalarmAnalyList')({
        setListData: this.list.setListData,
        params: {
          status: item.status,

          dgimn: item.DGIMN,
          modelGuid: item.ModelGuid,
        },
      }),
    );
  };

  statusPageOnRefresh = () => {
    let item = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item'],
      {},
    );

    this.props.dispatch(
      createAction('alarmAnaly/updateState')({
        alarmAnalyIndex: 1,
        alarmAnalyTotal: 0,
        alarmAnalyListResult: { status: -1 },
      }),
    );
    this.props.dispatch(
      createAction('alarmAnaly/getalarmAnalyList')({
        params: {
          status: item.status,

          dgimn: item.DGIMN,
          modelGuid: item.ModelGuid,
        },
      }),
    );
  };

  getDataTypeSelectOption = () => {
    return {
      codeKey: 'ModelGuid',
      nameKey: 'ModelName',
      placeHolder: '全部类型',
      dataArr: [{ ModelGuid: '', ModelName: '全部类型' }, ...this.props.MoldList],
      defaultCode: '',
      onSelectListener: item => {
        this.setState({ warningTypeCode: item.ModelGuid }, () => {
          this.onRefresh();
        });
      },
    };
  };

  _onItemClick = item => {
    item.onRefresh = this.onRefresh;
    if (item.IsCheck == 0) {
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'AlarmDetails',
          params: { ...item, onRefresh: this.onRefresh },
        }),
      );
    } else {
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'VerifyProgress',
          params: { ...item, onRefresh: this.onRefresh },
        }),
      );
    }
  };

  render() {
    let naviItem = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'item'],
      {},
    );
    var options = {
      hiddenTitle: true,
      innersHeight: 300,
    };
    return (
      <View style={styles.container}>
        <StatusPage
          status={this.props.alarmAnalyListResult.status}
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
          <View style={styles.container}>
            <FlatListWithHeaderAndFooter
              style={{
                marginBottom:
                  this.props.alramButtonList.findIndex(sItem => {
                    if (sItem.id == '3a5d2719-91d0-430a-ad11-00d277065881')
                      return true;
                  }) >= 0 && naviItem.status == 1
                    ? 50
                    : 0,
              }}
              ref={ref => (this.list = ref)}
              pageSize={20}
              hasMore={() => {
                return (
                  this.props.alarmAnalyListData.length <
                  this.props.alarmAnalyTotal
                );
              }}
              onRefresh={index => {
                this.onRefresh(index);
              }}
              ItemSeparatorComponent={() => {
                return <View style={{ height: 1, backgroundColor: '#d9d9d9' }} />;
              }}
              onEndReached={index => {
                this.props.dispatch(
                  createAction('alarmAnaly/updateState')({
                    alarmAnalyIndex: index,
                  }),
                );
                this.props.dispatch(
                  createAction('alarmAnaly/getalarmAnalyList')({
                    setListData: this.list.setListData,
                    params: {
                      status: naviItem.status,

                      dgimn: naviItem.DGIMN,
                      modelGuid: naviItem.ModelGuid,
                    },
                  }),
                );
              }}
              renderItem={({ item, index }) => {
                return (
                  <Touchable onPress={() => this._onItemClick(item)}>
                    <View
                      style={[
                        {
                          width: SCREEN_WIDTH,
                          minHeight: 123,
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          backgroundColor: '#fff',
                        },
                      ]}>
                      <View
                        style={[
                          {
                            height: 45,
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingStart: 13,
                          },
                        ]}>
                        {this.props.alramButtonList.findIndex(sItem => {
                          if (
                            sItem.id == '3a5d2719-91d0-430a-ad11-00d277065881'
                          )
                            return true;
                        }) >= 0 &&
                          naviItem.status == 1 &&
                          item.IsCheck == 0 && (
                            <TouchableOpacity
                              onPress={() => {
                                let newSelect = [].concat(
                                  this.state.selectItems,
                                );
                                item.onRefresh = this.onRefresh;
                                let newSelectIndex = newSelect.findIndex(
                                  sitem => sitem.ID == item.ID,
                                );
                                if (newSelectIndex > -1) {
                                  newSelect.splice(newSelectIndex, 1);
                                } else {
                                  newSelect.push(item);
                                }
                                this.setState({ selectItems: newSelect });
                              }}>
                              <Image
                                style={{ width: 25, height: 25, marginRight: 3 }}
                                source={
                                  this.state.selectItems.findIndex(
                                    sitem => sitem.ID == item.ID,
                                  ) > -1
                                    ? require('../../../images/auditselect.png')
                                    : require('../../../images/alarm_unselect.png')
                                }
                              />
                            </TouchableOpacity>
                          )}
                        {item.IsCheck == 1 && naviItem.status == 1 && (
                          <Image
                            style={{ width: 25, height: 25, marginRight: 3 }}
                            source={require('../../../images/chehui.png')}
                          />
                        )}
                        <Text
                          numberOfLines={1}
                          style={[
                            {
                              color: '#333',
                              textAlign: 'center',
                              maxWidth: SCREEN_WIDTH - 150,
                              lineHight: 45,
                            },
                          ]}>{`${item.ParentName || ''}-${item.PointName || ''
                            }`}</Text>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor:
                              item.CheckResult == '未核实'
                                ? 'rgba(102,102,102,0.1)'
                                : item.CheckResult == '有异常'
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
                                  item.CheckResult == '未核实'
                                    ? '#666666'
                                    : item.CheckResult == '有异常'
                                      ? '#FF574A'
                                      : '#26C19A',
                                textAlign: 'center',
                                fontSize: 11,
                              },
                            ]}>
                            {item.CheckResult}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            backgroundColor:
                              item.Status == '待核实'
                                ? 'rgba(47, 169, 255, 0.1)'
                                : item.Status == '待复核'
                                  ? 'rgba(47, 169, 255, 0.1)'
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
                                  item.Status == '待核实'
                                    ? '#666666'
                                    : item.Status == '待复核'
                                      ? '#2FA9FF'
                                      : '#26C19A',
                                textAlign: 'center',
                                fontSize: 11,
                              },
                            ]}>
                            {item.Status}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingStart: 13,
                            paddingEnd: 13,
                          },
                        ]}>
                        <SDLText
                          fontType={'normal'}
                          style={[{ color: '#666666', lineHeight: 18 }]}>
                          {item.WarningContent}
                        </SDLText>
                      </View>
                      <View
                        style={[
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            paddingStart: 13,
                            justifyContent: 'space-between',
                            paddingEnd: 13,
                            padding: 13,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={[
                              {
                                marginLeft: 5,
                                backgroundColor: '#5CA9FF',
                                padding: 2,
                                borderRadius: 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 18,
                                height: 18,
                              },
                            ]}>
                            <Text style={[{ color: '#fff', fontSize: 11 }]}>
                              {'核'}
                            </Text>
                          </View>
                          <SDLText
                            style={[
                              {
                                color: '#666666',
                                marginLeft: 5,
                                maxWidth: (SCREEN_WIDTH - 30) / 2,
                              },
                            ]}>
                            {item.CheckedUser ? item.CheckedUser : '---'}
                          </SDLText>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Image
                            style={{ width: 16, height: 16, marginRight: 3 }}
                            source={require('../../../images/ic_tab_statistics_selected.png')}
                          />
                          <SDLText
                            fontType={'normal'}
                            style={[{ color: '#666666' }]}>
                            {item.WarningTime}
                          </SDLText>
                        </View>
                      </View>
                    </View>
                    {item.IsList == 1 ? (
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopColor: '#ccc',
                            borderTopWidth: 5,
                            flex: 1,
                            height: 6,
                            backgroundColor: '#fff',
                          }}></View>

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopColor: '#ccc', borderTopWidth: 5, flex: 1, height: 5, backgroundColor: '#fff' }}></View> */}
                      </View>
                    ) : null}
                  </Touchable>
                );
              }}
              data={this.props.alarmAnalyListData}
              onEndReachedThreshold={0.1}
            />
          </View>

          {this.props.alramButtonList.findIndex(sItem => {
            if (sItem.id == '3a5d2719-91d0-430a-ad11-00d277065881') return true;
          }) >= 0 &&
            naviItem.status == 1 &&
            this.props.alarmAnalyListData.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  if (this.state.selectItems.length > 0) {
                    this.props.dispatch(
                      NavigationActions.navigate({
                        routeName: 'AlarmVerifyAnalyze',
                        params: this.state.selectItems,
                      }),
                    );
                  } else {
                    ShowToast('至少选择一条以上线索进行核实');
                  }
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flex: 1,
                  alignSelf: 'center',
                  width: SCREEN_WIDTH - 30,
                  height: 44,
                  borderRadius: 5,
                  backgroundColor:
                    this.state.selectItems.length > 0 ? '#4DA9FF' : '#cccccc',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: '#fff' }}>批量核实</Text>
              </TouchableOpacity>
            )}
          <AlertDialog
            components={<MyView />}
            options={options}
            ref="doAlert3"
          />
        </StatusPage>
      </View>
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
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
