import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';

import {
  createNavigationOptions,
  SentencedToEmpty,
  createAction,
  NavigationActions,
  ShowToast,
} from '../../utils';
import {
  StatusPage,
  FlatListWithHeaderAndFooter,
  Touchable,
  SDLText,
  OperationAlertDialog,
  AlertDialog,
  DeclareModule,
} from '../../components';
import globalcolor from '../../config/globalcolor';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../config/globalsize';
import Popover from 'react-native-popover';
import {CURRENT_PROJECT, POLLUTION_ORERATION_PROJECT} from '../../config';
//rest/PollutantSourceApi/OutputStopApi/getAbnormalList
const spinnerTextArray = ['说明', '上报'];
@connect(({pointDetails, app}) => ({
  abnormalList: pointDetails.abnormalList,
  abnormalListResult: pointDetails.abnormalListResult,
}))
export default class AbnormalityReportLst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //下拉列表是否可见
      isVisible: false,
      //下拉列表大小范围
      spinnerRect: {},
      selectItem: {},
    };
    let that = this;
    this.props.navigation.setParams({
      navigateRightPress: () => {
        that.showSpinner();
      },
    });
  }

  setNavigationOptions = () => {
    //点击切换右上角图标
    this.props.navigation.setOptions({
      title: '异常报告',
      headerRight: () => {
        return (
          <DeclareModule
            contentRender={() => {
              return (
                <Text
                  style={[
                    {fontSize: 13, color: 'white', marginHorizontal: 16},
                  ]}>
                  {'说明'}
                </Text>
              );
            }}
            options={{
              headTitle: '说明',
              innersHeight: 280,
              messText: `1、如2020-08-24 13:00至2020-08-24 16:00连续4个小时数据发生异常，请填写异常开始时间：2020-08-24 13:00，异常截止时间：2020-08-24 16:00；\n2、如2020-08-24 13:00、16:00两个小时数据发生异常，请填写开始时间：2020-08-24 13:00，异常截止时间：2020-08-24 16:00；\n3、如2020-08-24 13:00、16:00两个小时数据异常、2020-08-24 00:00一个日数据异常，请填写开始时间：2020-08-24 00:00，异常截止时间：2020-08-24 23:00\n4、必须上传异常报告附件。`,
              headStyle: {
                color: '#333',
                fontSize: 18,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                fontWeight: 'bold',
              },
              buttons: [
                {
                  txt: '知道了',
                  btnStyle: {backgroundColor: '#fff'},
                  txtStyle: {
                    color: '#f97740',
                    fontSize: 15,
                    fontWeight: 'bold',
                  },
                  onpress: () => {},
                },
              ],
            }}
          />
        );
      },
    });
  };

  onRefresh = index => {
    this.props.dispatch(
      createAction('pointDetails/updateState')({
        abnormalListIndex: index,
        abnormalListTotal: 0,
      }),
    );
    /**
     */
    this.props.dispatch(
      createAction('pointDetails/getAbnormalList')({
        setListData: this.list.setListData,
      }),
    );
  };

  statusPageOnRefresh = () => {
    this.props.dispatch(
      createAction('pointDetails/updateState')({
        abnormalListIndex: 1,
        abnormalListTotal: 0,
        abnormalListResult: {status: -1},
      }),
    );
    this.props.dispatch(createAction('pointDetails/getAbnormalList')({}));
  };

  componentDidMount() {
    this.setNavigationOptions();
    this.statusPageOnRefresh();
  }
  //显示下拉列表
  showSpinner = () => {
    this.setState({
      isVisible: true,
      spinnerRect: {
        x: SCREEN_WIDTH - 85,
        y: -SCREEN_HEIGHT / 2 + 70,
        width: 100,
        height: 300,
      },
    });
  };

  //隐藏下拉列表
  closeSpinner() {
    this.setState({
      isVisible: false,
    });
  }

  //下拉列表每一行点击事件
  onItemClick(spinnerItem) {
    this.closeSpinner();
    if (spinnerItem == '上报') {
      if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
        this.props.dispatch(
          NavigationActions.navigate({routeName: 'SuspendReport', params: {}}),
        );
      } else {
        ShowToast('非运维人员无法进行添加');
      }
    } else {
      this.refs.doAlert.show();
    }
  }
  cancelButton = () => {};
  confirm = () => {
    if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
      this.props.dispatch(
        createAction('enterpriseListModel/deleteAbnormalRec')({
          params: {
            ID: this.state.selectItem.ID,
          },
        }),
      );
    } else {
      ShowToast('非运维人员无法进行操作');
    }
  };
  render() {
    var deleoptions = {
      headTitle: '提示',
      messText: '是否确定要删除这条异常报告',
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
    return (
      <View style={styles.container}>
        <StatusPage
          status={this.props.abnormalListResult.status}
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
              ItemSeparatorComponent={() => {
                return (
                  <View
                    style={[
                      {
                        width: SCREEN_WIDTH,
                        height: 10,
                        backgroundColor: '#f2f2f2',
                      },
                    ]}
                  />
                );
              }}
              ref={ref => (this.list = ref)}
              pageSize={20}
              hasMore={() => {
                return (
                  this.props.abnormalList.length < this.props.abnormalListTotal
                );
              }}
              onRefresh={index => {
                this.onRefresh(index);
              }}
              onEndReached={index => {
                this.props.dispatch(
                  createAction('pointDetails/updateState')({
                    abnormalListIndex: index,
                  }),
                );
                this.props.dispatch(
                  createAction('pointDetails/getAbnormalList')({
                    setListData: this.list.setListData,
                  }),
                );
              }}
              renderItem={({item, index}) => {
                /**
                                    Attachment: "SDL202005181630133013384.png"
                                    BeginTime: "2020年05月05日 16时"
                                    DGIMN: "399435xd5febbc"
                                    EndTime: "2020年05月13日 16时"
                                    OutputStopID: "a50ff644-0bce-4087-be00-6a56d8124437"
                                    StopDescription: "qwwwwwwwwwwwwwwwwwww"
                                 */
                return (
                  <Touchable>
                    <View
                      style={[
                        {
                          width: SCREEN_WIDTH,
                          alignItems: 'center',
                          marginTop: 0,
                        },
                      ]}>
                      <View
                        style={[
                          {
                            width: SCREEN_WIDTH,
                            borderColor: globalcolor.borderLightGreyColor,
                            backgroundColor: globalcolor.white,
                            paddingLeft: 13,
                            paddingRight: 13,
                          },
                        ]}>
                        <View
                          style={[
                            {flexDirection: 'row', height: 30, marginTop: 10},
                          ]}>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            开始时间：
                          </Text>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            {SentencedToEmpty(item, ['BeginTime'], '未填写')}
                          </Text>
                        </View>
                        <View style={[{flexDirection: 'row', height: 30}]}>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            截止时间：
                          </Text>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            {SentencedToEmpty(item, ['EndTime'], '未填写')}
                          </Text>
                        </View>
                        <View style={[{flexDirection: 'row', height: 30}]}>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            异常描述：
                          </Text>
                          <Text
                            style={[
                              {fontSize: 14, color: globalcolor.taskImfoLabel},
                            ]}>
                            {SentencedToEmpty(item, ['Msg'], '---')}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#e6e6e6',
                            height: 1,
                            flex: 1,
                          }}
                        />
                        <View
                          style={[
                            {
                              flexDirection: 'row',
                              height: 50,
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.dispatch(
                                NavigationActions.navigate({
                                  routeName: 'AbnormalityReportDetails',
                                  params: {item},
                                }),
                              );
                            }}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 1,
                            }}>
                            <SDLText
                              style={{
                                color: globalcolor.headerBackgroundColor,
                              }}>
                              查看
                            </SDLText>
                          </TouchableOpacity>
                          <View
                            style={[
                              {
                                flexDirection: 'row',
                                width: 1,
                                height: 40,
                                backgroundColor: '#e6e6e6',
                              },
                            ]}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.props.dispatch(
                                NavigationActions.navigate({
                                  routeName: 'AbnormalityReport',
                                  params: {item},
                                }),
                              );
                            }}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 1,
                            }}>
                            <SDLText
                              style={{
                                color: globalcolor.headerBackgroundColor,
                              }}>
                              修改
                            </SDLText>
                          </TouchableOpacity>
                          <View
                            style={[
                              {
                                flexDirection: 'row',
                                width: 1,
                                height: 40,
                                backgroundColor: '#e6e6e6',
                              },
                            ]}
                          />
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({selectItem: item});
                              this.refs.deleAlert.show();
                            }}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              flex: 1,
                            }}>
                            <SDLText
                              style={{
                                color: globalcolor.headerBackgroundColor,
                              }}>
                              删除
                            </SDLText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Touchable>
                );
              }}
              data={this.props.abnormalList}
            />
          </View>
          <Popover
            //设置可见性
            isVisible={this.state.isVisible}
            //设置下拉位置
            fromRect={this.state.spinnerRect}
            placement="bottom"
            //点击下拉框外范围关闭下拉框
            onClose={() => this.closeSpinner()}
            //设置内容样式
            contentStyle={{opacity: 0.82, backgroundColor: '#343434'}}
            style={{backgroundColor: 'red'}}>
            <View style={{alignItems: 'center'}}>
              {spinnerTextArray.map((result, i, arr) => {
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => this.onItemClick(arr[i])}
                    underlayColor="transparent">
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        padding: 8,
                        fontWeight: '400',
                      }}>
                      {arr[i]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Popover>
          <AlertDialog options={deleoptions} ref="deleAlert" />
          <Touchable
            onPress={() => {
              if (CURRENT_PROJECT == POLLUTION_ORERATION_PROJECT) {
                this.props.dispatch(
                  NavigationActions.navigate({routeName: 'AbnormalityReport'}),
                );
              } else {
                ShowToast('非运维人员无法进行添加');
              }
            }}
            style={[{position: 'absolute', bottom: 128, right: 18}]}>
            <Image
              source={require('../../images/ic_add_suspend_production.png')}
              style={[{height: 60, width: 60}]}
            />
          </Touchable>
        </StatusPage>
      </View>
    );
  }
}
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
});
