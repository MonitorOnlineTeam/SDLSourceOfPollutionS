//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';

import globalcolor from '../../../../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../../../config/globalsize';
import {
  NavigationActions,
  createAction,
  createNavigationOptions,
  SentencedToEmpty,
  StackActions,
  ShowToast,
} from '../../../../utils';
// import { getToken, } from '../../dvapack/storage';
import {
  StatusPage,
  Touchable,
  PickerTouchable,
  SimpleLoadingComponent,
  MoreSelectTouchable,
  SimpleLoadingView,
} from '../../../../components';
import {AlertDialog} from '../../../../components';

const enterpriseUser = 0;
const operationsStaff = 1;

// create a component
@connect(({calibrationRecord}) => ({
  MainInfo: calibrationRecord.MainInfo,
  liststatus: calibrationRecord.liststatus,
  calibrationRecordList: calibrationRecord.RecordList,
  MainInfo: calibrationRecord.MainInfo,
  editstatus: calibrationRecord.editstatus,
  JzConfigItemResult: calibrationRecord.JzConfigItemResult,
  jzDeleteResult: calibrationRecord.jzDeleteResult,
  JzConfigItemSelectedList: calibrationRecord.JzConfigItemSelectedList,
}))
class CalibrationRecordList extends Component {
  static navigationOptions = ({navigation}) => {
    return createNavigationOptions({
      // title: SentencedToEmpty(navigation, ['state', 'params', 'CnName'], '校准记录'),
      title: '零点量程漂移校准',
      headerTitleStyle: {marginRight: Platform.OS === 'android' ? 76 : 0},
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      newData: [], // 待修改的数据列表
      pageSelectCodes: [], // 当前选中的分析仪
      lastSelectCodes: [], // 上次选中的分析仪
      deleteIndexList: [], //待删除数据列表
    };
    _me = this;
  }

  componentWillUnmount() {
    DeviceEventEmitter.emit('refreshTask', {
      newMessage: '刷新',
    });
  }

  _deleteForm = () => {
    if (this.props.route.params.params.TypeName == 'JzHistoryList') {
      this.props.dispatch(
        createAction('calibrationRecord/checkDelForm')({
          callback: () => {
            // this._modalParent.showModal();
            this.refs.doAlert.show();
          },
        }),
      );
    }
  };

  _keyExtractor = (item, index) => {
    return index + '';
  };

  // 零点漂移内容，参数isLS为true时，表示是流速
  _renderLDContent = (item, isLS, index) => {
    return (
      <>
        <View
          style={[
            {
              flexDirection: 'row',
              height: 30,
              marginTop: 10,
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              {
                backgroundColor:
                  item.LdCalibrationIsOk &&
                  item.LdCalibrationIsOk != '' &&
                  item.LdCalibrationSufValue &&
                  item.LdCalibrationSufValue != ''
                    ? globalcolor.hadCalibrationColor
                    : globalcolor.uncalibratedColor,
                borderRadius: 2,
                justifyContent: 'center',
                alignItems: 'center',
                height: 20,
                marginRight: 4,
              },
            ]}>
            <Text
              style={[
                {
                  fontSize: 13,
                  color: globalcolor.whiteFont,
                  marginHorizontal: 4,
                },
              ]}>
              {item.LdCalibrationIsOk &&
              item.LdCalibrationIsOk != '' &&
              item.LdCalibrationSufValue &&
              item.LdCalibrationSufValue != ''
                ? '已校准'
                : '未校准'}
            </Text>
          </View>
          <Text style={[{fontSize: 14, color: globalcolor.taskImfoLabel}]}>
            {isLS ? `零点校准（差压表${index + 1}）` : '零点校准'}
          </Text>
        </View>
        <View
          style={[
            {width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10},
          ]}>
          <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
            <Text
              style={[{fontSize: 14, color: globalcolor.datepickerGreyText}]}>
              {'上次校准后：'}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                {
                  width: (SCREEN_WIDTH - 24) / 2 - 100,
                  fontSize: 14,
                  color: globalcolor.datepickerGreyText,
                },
              ]}>
              {item.LdLastCalibrationValue && item.LdLastCalibrationValue != ''
                ? item.LdLastCalibrationValue
                : '--'}
            </Text>
          </View>
          <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
            <Text
              style={[{fontSize: 14, color: globalcolor.datepickerGreyText}]}>
              {'零点漂移：'}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                {
                  width: (SCREEN_WIDTH - 24) / 2 - 80,
                  fontSize: 14,
                  color: globalcolor.datepickerGreyText,
                },
              ]}>
              {item.LdPy && item.LdPy != '' ? item.LdPy : '--'}
            </Text>
          </View>
        </View>
        <View
          style={[
            {width: SCREEN_WIDTH - 24, flexDirection: 'row', marginTop: 10},
          ]}>
          <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
            <Text
              style={[{fontSize: 14, color: globalcolor.datepickerGreyText}]}>
              {'校前测试：'}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                {
                  width: (SCREEN_WIDTH - 24) / 2 - 80,
                  fontSize: 14,
                  color: globalcolor.datepickerGreyText,
                },
              ]}>
              {item.LdCalibrationPreValue && item.LdCalibrationPreValue != ''
                ? item.LdCalibrationPreValue
                : '--'}
            </Text>
          </View>
          <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
            <Text
              style={[{fontSize: 14, color: globalcolor.datepickerGreyText}]}>
              {'是否正常：'}
            </Text>
            <Text
              style={[{fontSize: 14, color: globalcolor.datepickerGreyText}]}>
              {item.LdCalibrationIsOk && item.LdCalibrationIsOk != ''
                ? item.LdCalibrationIsOk
                : '--'}
            </Text>
          </View>
        </View>
      </>
    );
  };

  _renderItem = ({item, index}) => {
    if (this.props.route.params.params.TypeName == 'JzHistoryList') {
      // } else if (this.props.navigation.state.params.ID == 4) {
      // if ((item.LdCalibrationIsOk&&item.LdCalibrationIsOk != '')||(item.LcCalibrationIsOk&&item.LcCalibrationIsOk != '')) {

      // 流量校准
      if (item.ItemId == 543) {
        return (
          <View
            style={[
              {
                width: SCREEN_WIDTH,
                alignItems: 'center',
                marginTop: index != 0 ? 8 : 0,
              },
            ]}>
            <View
              style={[
                {
                  borderColor: globalcolor.borderLightGreyColor,
                  backgroundColor: globalcolor.white,
                  paddingHorizontal: 13,
                },
              ]}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 30,
                    marginTop: 10,
                    borderBottomColor: globalcolor.borderLightGreyColor,
                    borderBottomWidth: 1,
                  },
                ]}>
                <Text
                  style={[{fontSize: 15, color: globalcolor.taskImfoLabel}]}>
                  {item.ItemID + '分析仪校准'}
                </Text>
              </View>
              {item.ChildList
                ? item.ChildList.map((child, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          let currentPollutant = this.props.JzConfigItemSelectedList.find(_item => _item.ItemId == item.ItemId)
                          console.log('currentPollutant', currentPollutant)
                          this.props.dispatch(
                            NavigationActions.navigate({
                              routeName: 'CalibrationRecordEdit',
                              params: {index, item: {...child, ItemId: '543', IsLiangCheng: currentPollutant.IsLiangCheng, IsPiaoYi: currentPollutant.IsPiaoYi}},
                            }),
                          );
                        }}>
                        {this._renderLDContent(child, true, index)}
                      </TouchableOpacity>
                    );
                  })
                : ''}
            </View>
          </View>
        );
      }
      return (
        <TouchableOpacity
          onPress={() => {
            let currentPollutant = this.props.JzConfigItemSelectedList.find(_item => _item.ItemId == item.ItemId)
            this.props.dispatch(
              NavigationActions.navigate({
                routeName: 'CalibrationRecordEdit',
                params: {index, item: {...item, IsLiangCheng: currentPollutant.IsLiangCheng, IsPiaoYi: currentPollutant.IsPiaoYi}},
              }),
            );
          }}>
          <View
            style={[
              {
                width: SCREEN_WIDTH,
                alignItems: 'center',
                marginTop: index != 0 ? 8 : 0,
              },
            ]}>
            <View
              style={[
                {
                  borderColor: globalcolor.borderLightGreyColor,
                  backgroundColor: globalcolor.white,
                  paddingHorizontal: 13,
                },
              ]}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 30,
                    marginTop: 10,
                    borderBottomColor: globalcolor.borderLightGreyColor,
                    borderBottomWidth: 1,
                  },
                ]}>
                <Text
                  style={[{fontSize: 15, color: globalcolor.taskImfoLabel}]}>
                  {item.ItemID + '分析仪校准'}
                </Text>
              </View>
              {this._renderLDContent(item, false)}
              {
                <View>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        height: 30,
                        marginTop: 10,
                        alignItems: 'center',
                      },
                    ]}>
                    <View
                      style={[
                        {
                          backgroundColor:
                            item.LcCalibrationIsOk &&
                            item.LcCalibrationIsOk != '' &&
                            item.LcCalibrationSufValue &&
                            item.LcCalibrationSufValue != ''
                              ? globalcolor.hadCalibrationColor
                              : globalcolor.uncalibratedColor,
                          borderRadius: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 20,
                        },
                      ]}>
                      <Text
                        style={[
                          {
                            fontSize: 13,
                            color: globalcolor.whiteFont,
                            marginHorizontal: 4,
                          },
                        ]}>
                        {item.LcCalibrationIsOk &&
                        item.LcCalibrationIsOk != '' &&
                        item.LcCalibrationSufValue &&
                        item.LcCalibrationSufValue != ''
                          ? '已校准'
                          : '未校准'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        {fontSize: 14, color: globalcolor.taskImfoLabel},
                      ]}>
                      {'量程校准'}
                    </Text>
                    <Text
                      style={[
                        {fontSize: 14, color: globalcolor.taskImfoLabel},
                      ]}>{`(${item.FxyLc ? item.FxyLc : ' '})`}</Text>
                  </View>
                  <View
                    style={[
                      {
                        width: SCREEN_WIDTH - 24,
                        flexDirection: 'row',
                        marginTop: 10,
                      },
                    ]}>
                    <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
                      <Text
                        style={[
                          {fontSize: 14, color: globalcolor.datepickerGreyText},
                        ]}>
                        {'上次校准后：'}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          {
                            width: (SCREEN_WIDTH - 24) / 2 - 100,
                            fontSize: 14,
                            color: globalcolor.datepickerGreyText,
                          },
                        ]}>
                        {item.LcLastCalibrationValue &&
                        item.LcLastCalibrationValue != ''
                          ? item.LcLastCalibrationValue
                          : '--'}
                      </Text>
                    </View>
                    <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
                      <Text
                        style={[
                          {fontSize: 14, color: globalcolor.datepickerGreyText},
                        ]}>
                        {'量程漂移：'}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          {
                            width: (SCREEN_WIDTH - 24) / 2 - 80,
                            fontSize: 14,
                            color: globalcolor.datepickerGreyText,
                          },
                        ]}>
                        {item.LcPy && item.LcPy != '' ? item.LcPy : '--'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      {
                        width: SCREEN_WIDTH - 24,
                        flexDirection: 'row',
                        marginTop: 10,
                      },
                    ]}>
                    <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
                      <Text
                        style={[
                          {fontSize: 14, color: globalcolor.datepickerGreyText},
                        ]}>
                        {'校前测试：'}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          {
                            width: (SCREEN_WIDTH - 24) / 2 - 80,
                            fontSize: 14,
                            color: globalcolor.datepickerGreyText,
                          },
                        ]}>
                        {item.LcCalibrationPreValue &&
                        item.LcCalibrationPreValue != ''
                          ? item.LcCalibrationPreValue
                          : '--'}
                      </Text>
                    </View>
                    <View style={[{flexDirection: 'row', height: 30, flex: 1}]}>
                      <Text
                        style={[
                          {fontSize: 14, color: globalcolor.datepickerGreyText},
                        ]}>
                        {'是否正常：'}
                      </Text>
                      <Text
                        style={[
                          {fontSize: 14, color: globalcolor.datepickerGreyText},
                        ]}>
                        {item.LcCalibrationIsOk && item.LcCalibrationIsOk != ''
                          ? item.LcCalibrationIsOk
                          : '--'}
                      </Text>
                    </View>
                  </View>
                </View>
              }
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  cancelButton = () => {};
  confirm = () => {
    this.props.dispatch(
      createAction('calibrationRecord/delForm')({
        callback: ID => {
          //返回任务执行，刷新数据
          // this.props.dispatch(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: ID }));
          this.props.dispatch(NavigationActions.back());
        },
      }),
    );
  };

  getPageStatus = () => {
    console.log('JzConfigItemResult = ', this.props.JzConfigItemResult);
    console.log('liststatus = ', this.props.liststatus);
    let configItemsStatus = SentencedToEmpty(
      this.props,
      ['JzConfigItemResult', 'status'],
      1000,
    );
    if (configItemsStatus != 200) {
      return configItemsStatus;
    } else {
      return SentencedToEmpty(this.props, ['liststatus', 'status'], 1000);
    }
  };

  getJzConfigItemOption = () => {
    let selectCodes = [];
    let dataSource = [];
    dataSource = SentencedToEmpty(
      this.props,
      ['JzConfigItemResult', 'data', 'Datas'],
      [],
    );
    const JzConfigItemSelectedList = SentencedToEmpty(
      this.props,
      ['JzConfigItemSelectedList'],
      [],
    );
    if (JzConfigItemSelectedList.length == 0) {
      dataSource.map((item, index) => {
        if (item.CheckIn == 1) {
          selectCodes.push(item.ItemName);
        }
      });
    } else {
      JzConfigItemSelectedList.map((item, index) => {
        selectCodes.push(item.ItemName);
      });
    }

    // this.setState({pageSelectCodes:selectCodes});
    // this.props.selectCodeArr.map(item => {
    //     selectCodes.push(item.PollutantCode);
    // });
    // this.props.PollantCodes.map(item => {
    //     if ((this.props.datatype == 'realtime' || this.props.datatype == 'minute') && item.PollutantCode == 'AQI') {
    //         return;
    //     }
    //     if (this.props.datatype == 'month' && item.PollutantCode == 'AQI') {
    //         item.PollutantName = '综合指数';
    //     }
    //     if ((this.props.datatype == 'hour' || this.props.datatype == 'day') && item.PollutantCode == 'AQI') {
    //         item.PollutantName = 'AQI';
    //     }
    //     dataSource.push(item);
    // });
    return {
      contentWidth: 166,
      selectName: '选择污染物',
      placeHolderStr: '污染物',
      codeKey: 'ItemName',
      nameKey: 'ItemName',
      // maxNum: 3,
      selectCode: selectCodes,
      dataArr: dataSource,
      callback: ({
        selectCode = [],
        selectNameStr,
        selectCodeStr,
        selectData,
      }) => {
        selectData.map((item, index) => {
          item.ItemID = item.ItemName;
        });
        let findIndex = -1;
        let selectedIndexList = [];
        let deleteIndexList = [];
        this.props.calibrationRecordList.map((item, index) => {
          if (SentencedToEmpty(item, ['ID'], '') != '') {
            findIndex = selectCode.findIndex(codeItem => {
              if (codeItem == item.ItemID) {
                return true;
              }
            });
            if (findIndex == -1) {
              deleteIndexList.push({
                findIndex,
                dataIndex: index,
                recordId: item.ID,
                recordName: item.ItemName,
              });
            } else {
              selectedIndexList.push({findIndex, dataIndex: index});
            }
          }
        });
        selectedIndexList.map(selectedDateItem => {
          selectData[selectedDateItem.findIndex] = {
            ...selectData[selectedDateItem.findIndex],
            ...this.props.calibrationRecordList[selectedDateItem.dataIndex],
          };
        });
        if (deleteIndexList.length > 0) {
          this.setState({
            newData: selectData,
            lastSelectCodes: this._picker.getBeforeSubmitData(),
            pageSelectCodes: selectCode,
            deleteIndexList,
          });
          this.refs.delConfigItemsAlert.show();
          this.props.dispatch(
            createAction('calibrationRecord/updateState')({
              JzConfigItemSelectedList: selectData,
            }),
          );
        } else {
          this.props.dispatch(
            createAction('calibrationRecord/updateState')({
              RecordList: selectData,
              JzConfigItemSelectedList: selectData,
            }),
          );
        }
      },
    };
  };

  refreshStatePage = () => {
    this.props.dispatch(
      createAction('calibrationRecord/updateState')({
        liststatus: {status: -1},
        JzConfigItemResult: {status: -1},
        JzConfigItemSelectedList: [],
      }),
    );
    this.props.dispatch(createAction('calibrationRecord/getJzItem')({}));
  };

  render() {
    var options = {
      headTitle: '提示',
      messText: '是否确定要删除当前校准记录的表单',
      headStyle: {
        backgroundColor: globalcolor.headerBackgroundColor,
        color: '#ffffff',
        fontSize: 18,
      },
      buttons: [
        {
          txt: '取消',
          btnStyle: {backgroundColor: 'transparent'},
          txtStyle: {color: globalcolor.headerBackgroundColor},
          onpress: this.cancelButton,
        },
        {
          txt: '确定',
          btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
          txtStyle: {color: '#ffffff'},
          onpress: this.confirm,
        },
      ],
    };
    let delConfigItemsAlert = {
      headTitle: '提示',
      messText: '确定要删除这条记录吗？',
      headStyle: {
        backgroundColor: globalcolor.headerBackgroundColor,
        color: '#ffffff',
        fontSize: 18,
      },
      buttons: [
        {
          txt: '取消',
          btnStyle: {backgroundColor: 'transparent'},
          txtStyle: {color: globalcolor.headerBackgroundColor},
          // onpress: this.cancelButton
          onpress: () => {
            this._picker.setData(this.state.lastSelectCodes);
          },
        },
        {
          txt: '确定',
          btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
          txtStyle: {color: '#ffffff'},
          // onpress: this.confirm
          onpress: () => {
            let nameStr = '';
            let idStr = '';
            this.state.deleteIndexList.map((item, index) => {
              if (index == 0) {
                nameStr = item.recordName;
                idStr = item.recordId;
              } else {
                nameStr = nameStr + '、' + item.recordName;
                idStr = idStr + ',' + item.recordId;
              }
            });
            this.props.dispatch(
              createAction('calibrationRecord/updateState')({
                RecordList: this.state.newData,
                jzDeleteResult: {status: -1},
              }),
            );
            this.props.dispatch(
              createAction('calibrationRecord/deleteJzItem')({
                params: {ID: idStr},
              }),
            );
          },
        },
      ],
    };
    return (
      <StatusPage
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
          //空页面按钮回调
          console.log('重新刷新');
          // this.props.dispatch(createAction('pointDetail/getHistoryData')({}));
          this.refreshStatePage();
        }}
        onErrorPress={() => {
          //错误页面按钮回调
          console.log('重新刷新');
          // this.props.dispatch(createAction('pointDetail/getHistoryData')({}));
          this.refreshStatePage();
        }}
        status={this.getPageStatus()}>
        <View style={styles.container}>
          <TouchableOpacity
            style={[{marginBottom: 8}]}
            onPress={() => {
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: 'CalibrationRecordTime',
                  params: {},
                }),
              );
            }}>
            <View
              style={[
                {
                  width: SCREEN_WIDTH,
                  paddingHorizontal: 24,
                  backgroundColor: globalcolor.white,
                },
              ]}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 45,
                    marginTop: 10,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    borderBottomColor: globalcolor.borderBottomColor,
                  },
                ]}>
                <Text
                  style={[{fontSize: 15, color: globalcolor.taskImfoLabel}]}>
                  校准开始时间：
                </Text>
                <View
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      height: 45,
                      alignItems: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        color: globalcolor.taskFormLabel,
                        flex: 1,
                        textAlign: 'right',
                      },
                    ]}>
                    {SentencedToEmpty(
                      this.props.MainInfo,
                      ['AdjustStartTime'],
                      '----/--/-- --:--',
                    )}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    height: 45,
                    marginTop: 10,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    borderBottomColor: globalcolor.borderBottomColor,
                    marginBottom: 10,
                  },
                ]}>
                <Text
                  style={[{fontSize: 15, color: globalcolor.taskImfoLabel}]}>
                  校准结束时间：
                </Text>
                <View
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      height: 45,
                      alignItems: 'center',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        color: globalcolor.taskFormLabel,
                        flex: 1,
                        textAlign: 'right',
                      },
                    ]}>
                    {SentencedToEmpty(
                      this.props.MainInfo,
                      ['AdjustEndTime'],
                      '----/--/-- --:--',
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {SentencedToEmpty(this.props, ['MainInfo', 'AdjustEndTime'], '') ==
            '' ||
          SentencedToEmpty(this.props, ['MainInfo', 'AdjustStartTime'], '') ==
            '' ? (
            <TouchableOpacity
              onPress={() => {
                ShowToast('请您先填写校准开始和结束时间');
              }}
              style={[{marginBottom: 8}]}>
              <View
                style={{
                  width: SCREEN_WIDTH - 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 45,
                  backgroundColor: 'white',
                  borderRadius: 4,
                }}>
                <Text style={{fontSize: 15, color: globalcolor.taskImfoLabel}}>
                  {'选择校准因子'}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <MoreSelectTouchable
              ref={ref => (this._picker = ref)}
              option={this.getJzConfigItemOption()}
              style={[{marginBottom: 8}]}>
              <View
                style={{
                  width: SCREEN_WIDTH - 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 45,
                  backgroundColor: 'white',
                  borderRadius: 4,
                }}>
                <Text style={{fontSize: 15, color: globalcolor.taskImfoLabel}}>
                  {'选择校准因子'}
                </Text>
              </View>
            </MoreSelectTouchable>
          )}
          <FlatList
            data={this.props.calibrationRecordList}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <TouchableOpacity
            style={[{position: 'absolute', right: 18, bottom: 128}]}
            onPress={() => {
              this._deleteForm();
            }}>
            <View
              style={[
                {
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Text style={[{color: globalcolor.whiteFont}]}>{'删除'}</Text>
              <Text style={[{color: globalcolor.whiteFont}]}>{'表单'}</Text>
            </View>
          </TouchableOpacity>
          <AlertDialog options={options} ref="doAlert" />
          {this.props.editstatus.status == -1 ? (
            <SimpleLoadingView message={'删除中'} />
          ) : null}
          {this.props.jzDeleteResult.status == -1 ? (
            <SimpleLoadingView message={'删除中'} />
          ) : null}
          <AlertDialog
            options={delConfigItemsAlert}
            ref="delConfigItemsAlert"
          />
        </View>
      </StatusPage>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalcolor.backgroundGrey,
  },
});

//make this component available to the app
export default CalibrationRecordList;
