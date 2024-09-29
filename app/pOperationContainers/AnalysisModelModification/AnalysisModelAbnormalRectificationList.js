/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-10-25 11:49:44
 * @LastEditTime: 2023-11-09 16:12:30
 * @FilePath: /SDLMainProject36/app/pOperationContainers/AnalysisModelModification/AnalysisModelAbnormalRectificationList.js
 */
import {Text, View, Platform} from 'react-native';
import React, {Component} from 'react';
// import ScrollableTabView from 'react-native-scrollable-tab-view';

import {SCREEN_WIDTH} from '../../config/globalsize';
import {
  NavigationActions,
  SentencedToEmpty,
  createAction,
  createNavigationOptions,
} from '../../utils';
import {
  FlatListWithHeaderAndFooter,
  SDLText,
  StatusPage,
} from '../../components';
import MyTabBar from '../../operationContainers/taskViews/taskExecution/components/MyTabBar';
import {TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';

@connect(({modelAnalysisAectificationModel}) => ({
  checkedRectificationListGResult:
    modelAnalysisAectificationModel.checkedRectificationListGResult,
}))
export default class AnalysisModelAbnormalRectificationList extends Component {
  // static navigationOptions = ({ navigation }) => {
  //     return createNavigationOptions({
  //         title: '异常整改',
  //         // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
  //         headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
  //     });
  // }

  componentDidMount() {
    // this.props.navigation.setParams({
    //   headerRight: (
    //     <TouchableOpacity
    //       onPress={() => {
    //         this.props.dispatch(
    //           NavigationActions.navigate({
    //             routeName: 'AnalysisModelAbnormalRectificationRecords',
    //           }),
    //         );
    //       }}>
    //       <SDLText style={{color: '#fff', marginHorizontal: 16}}>
    //         {'整改记录'}
    //       </SDLText>
    //     </TouchableOpacity>
    //   ),
    // });

    this.props.navigation.setOptions({
      title: '异常整改',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.props.dispatch(
              NavigationActions.navigate({
                routeName: 'AnalysisModelAbnormalRectificationRecords',
              }),
            );
          }}>
          <SDLText style={{color: '#fff', marginHorizontal: 16}}>
            {'整改记录'}
          </SDLText>
        </TouchableOpacity>
      ),
    });

    this.statusPageOnRefresh();
    // this.props.dispatch(createAction('modelAnalysisAectificationModel/updateState')({
    //     checkedRectificationListGResult: { status: -1 }
    // }));
    // this.props.dispatch(createAction('modelAnalysisAectificationModel/getCheckedRectificationList')({}));
  }

  statusPageOnRefresh = () => {
    this.props.dispatch(
      createAction('modelAnalysisAectificationModel/updateState')({
        checkedRectificationListGResult: {status: -1},
      }),
    );
    this.props.dispatch(
      createAction(
        'modelAnalysisAectificationModel/getCheckedRectificationList',
      )({}),
    );
  };

  onRefresh = () => {
    this.props.dispatch(
      createAction(
        'modelAnalysisAectificationModel/getCheckedRectificationList',
      )({
        setListData: this.list.setListData,
      }),
    );
  };

  // render() {
  //     return (
  //         <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
  //             <StatusPage
  //                 status={200}
  //                 errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
  //                 errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
  //                 //页面是否有回调按钮，如果不传，没有按钮，
  //                 emptyBtnText={'重新请求'}
  //                 errorBtnText={'点击重试'}
  //                 onEmptyPress={() => {
  //                     //空页面按钮回调
  //                     // this.onRefresh();
  //                 }}
  //                 onErrorPress={() => {
  //                     //错误页面按钮回调
  //                     // this.onRefresh();
  //                 }}
  //             >
  //                 <ScrollableTabView
  //                     ref={ref => (this.scrollableTabView = ref)}
  //                     onChangeTab={obj => {
  //                         // this.onChange(obj.i);
  //                         // console.log('onChangeTab = ',obj);
  //                     }}
  //                     // initialPage={1}
  //                     style={{ flex: 1, width: SCREEN_WIDTH }}
  //                     // renderTabBar={() => <MyTabBar tabNames={['基本信息', '服务内容', '必填表单']} />}
  //                     renderTabBar={() => <MyTabBar tabNames={['待整改', '待复核']} />}
  //                     tabBarUnderlineStyle={{
  //                         // width: SCREEN_WIDTH / 3,
  //                         width: SCREEN_WIDTH / 2,
  //                         height: 2,
  //                         backgroundColor: '#4aa1fd',
  //                         marginBottom: -1
  //                     }}
  //                     tabBarPosition="top"
  //                     scrollWithoutAnimation={false}
  //                     tabBarUnderlineColor="#4aa1fd"
  //                     tabBarBackgroundColor="#FFFFFF"
  //                     tabBarActiveTextColor="#4aa1fd"
  //                     tabBarInactiveTextColor="#000033"
  //                     tabBarTextStyle={{ fontSize: 15, backgroundColor: 'red' }}
  //                 >
  //                     {/* <BaseInfo {...this.getBaseInfo()} tabLabel="基本信息" listKey="a" key="1" /> */}
  //                     {/* <ServiceContent style={[{ width: SCREEN_WIDTH, flex: 1 }]} tabLabel="服务内容" listKey="b" key="2"></ServiceContent> */}
  //                     {/* <View style={[{ width: SCREEN_WIDTH, flex: 1 }]} tabLabel="待整改" listKey="c" key="3">
  //                         <Text>3</Text>
  //                     </View> */}
  //                     <ToBeRectified
  //                         tabLabel="待整改" listKey="a" key="0"
  //                     />
  //                     <ToBeReviewed
  //                         tabLabel="待复核" listKey="b" key="1"
  //                     />
  //                     {/* <View style={[{ width: SCREEN_WIDTH, flex: 1 }]} tabLabel="待复核" listKey="d" key="4">
  //                         <Text>4</Text>
  //                     </View> */}
  //                 </ScrollableTabView>
  //             </StatusPage>
  //         </View>
  //     )
  // }

  getShowTime = item => {
    {
      /* RectificationStatus 1.CreateTime 2 CompleteTime 3 CreateTime */
    }
    const RectificationStatus = SentencedToEmpty(
      item,
      ['RectificationStatus'],
      1,
    );
    if (RectificationStatus == 1 || RectificationStatus == 3) {
      return SentencedToEmpty(item, ['CreateTime'], '----');
    } else if (RectificationStatus == 2) {
      return SentencedToEmpty(item, ['CompleteTime'], '----');
    } else {
      return '----';
    }
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // if (index == 0) {
          //     this.props.dispatch(NavigationActions.navigate({
          //         routeName: 'AbnormalRectification',
          //         params: {
          //             // ID: map.extras.alarm_id,
          //             // alarmTime: map.extras.alarm_time
          //         }
          //     }));
          // } else if (index == 1) {
          if (item.RectificationStatus == 1) {
            if (item.Col1 == 1) {
              this.props.dispatch(
                createAction('modelAnalysisAectificationModel/updateState')({
                  recheckItemId: SentencedToEmpty(item, ['ID'], ''),
                }),
              );
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: 'RectificationReviewDetails',
                  params: {
                    ...item,
                  },
                }),
              );
            } else {
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: 'AbnormalVerifyDetails',
                  params: {
                    ...item,
                    // ID: '8b95428d-ae67-4491-80f9-c35b6f9c150f'
                    commitID: SentencedToEmpty(item, ['ID'], ''),
                    ID: SentencedToEmpty(item, ['CheckedId'], ''),
                    // ID: map.extras.alarm_id,
                    // alarmTime: map.extras.alarm_time
                  },
                }),
              );
            }
          } else if (item.RectificationStatus == 2) {
            this.props.dispatch(
              createAction('modelAnalysisAectificationModel/updateState')({
                recheckItemId: SentencedToEmpty(item, ['ID'], ''),
              }),
            );
            this.props.dispatch(
              NavigationActions.navigate({
                routeName: 'RectificationReviewDetails',
                params: {
                  ...item,
                },
              }),
            );
          }

          // }
        }}>
        <View
          style={[
            {
              justifyContent: 'space-around',
              width: SCREEN_WIDTH,
              height: 136,
              backgroundColor: 'white',
            },
          ]}>
          <View
            style={{
              marginTop: 15,
              marginLeft: 30,
              width: SCREEN_WIDTH - 60,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* 待整改 RectificationStatus == 1 ;Col1 列表中这个字段等于1代表打回。 */}
            {item.RectificationStatus == 1 && item.Col1 == 1 && (
              <Image
                style={{width: 25, height: 25, marginRight: 3}}
                source={require('../../images/chehui.png')}
              />
            )}
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: '#5CA9FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 10, color: '#FFFFFF'}}>企</Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                marginLeft: 5,
                fontSize: 14,
                color: '#333333',
              }}>{`${SentencedToEmpty(
              item,
              ['EntName'],
              '--',
            )}-${SentencedToEmpty(item, ['PointName'], '--')}`}</Text>
            {/* <Text style={{ marginLeft: 4, fontSize: 12, color: '#4AA0FF' }}>{`(${SentencedToEmpty(item, ['Count'], '0')})`}</Text> */}
            <View
              style={[
                {
                  width: 50,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: getStatusObject(
                    SentencedToEmpty(item, ['RectificationStatus'], 1),
                  ).bgColor,
                  // , backgroundColor: getStatusObject(index % 3 + 1).bgColor
                },
              ]}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    color: getStatusObject(
                      SentencedToEmpty(item, ['RectificationStatus'], 1),
                    ).textColor,
                    // color: getStatusObject(index % 3 + 1).textColor
                  },
                ]}>
                {`${SentencedToEmpty(
                  item,
                  ['RectificationStatusName'],
                  '---',
                )}`}
              </Text>
            </View>
          </View>
          <Text
            style={[
              {
                lineHeight: 19,
                marginTop: 6,
                width: SCREEN_WIDTH - 60,
                maxHeight: 63,
                marginLeft: 30,
              },
            ]}
            numberOfLines={3}>
            {`${
              index == 1 && false
                ? '测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123测试文字123'
                : SentencedToEmpty(item, ['CheckedDes'], '-----')
            }`}
          </Text>
          <View
            style={[
              {
                alignItems: 'center',
                flexDirection: 'row',
                width: SCREEN_WIDTH - 60,
                marginLeft: 30,
                height: 20,
              },
            ]}>
            <View
              style={[{flex: 1, flexDirection: 'row', alignItems: 'center'}]}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#5CA9FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 10, color: '#FFFFFF'}}>整</Text>
              </View>
              <SDLText
                numberOfLines={1}
                fontType={'normal'}
                style={[{color: '#666666', flex: 1}]}>
                {`${SentencedToEmpty(item, ['RectificationUserName'], '----')}`}
              </SDLText>
            </View>
            <View style={[{width: 4}]} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 16, height: 16, marginRight: 3}}
                source={require('../../images/ic_tab_statistics_selected.png')}
              />
              <SDLText fontType={'normal'} style={[{color: '#666666'}]}>
                {`${this.getShowTime(item)}`}
              </SDLText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <StatusPage
        backRef={true}
        style={[{width: SCREEN_WIDTH, flex: 1, marginTop: 8}]}
        status={SentencedToEmpty(
          this.props,
          ['checkedRectificationListGResult', 'status'],
          1000,
        )}
        errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
        errorTextStyle={{
          width: SCREEN_WIDTH - 100,
          lineHeight: 20,
          textAlign: 'center',
        }}
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
          //空页面按钮回调
          this.statusPageOnRefresh();
        }}
        onErrorPress={() => {
          //错误页面按钮回调
          this.statusPageOnRefresh();
        }}>
        <FlatListWithHeaderAndFooter
          ref={ref => (this.list = ref)}
          // pageSize={this.props.pageSize}
          ItemSeparatorComponent={() => (
            <View
              style={[
                {width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2'},
              ]}
            />
          )}
          hasMore={() => {
            return false;
          }}
          onRefresh={index => {
            this.onRefresh(index);
          }}
          onEndReached={index => {}}
          renderItem={this._renderItem}
          data={SentencedToEmpty(
            this.props,
            ['checkedRectificationListGResult', 'data', 'Datas'],
            [],
          )}
          // data={[{}, {}]}
        />
      </StatusPage>
    );
  }
}

export const getStatusObject = function (TaskStatus) {
  /**
   * 待整改       1
   * 待复核       2
   * 整改完成     3
   */
  let textColor = '#3591F8',
    bgColor = '#D1E7FF4D';
  if (TaskStatus == 1) {
    // 已完成
    textColor = '#3591F8';
    bgColor = '#D1E7FF4D';
  } else if (TaskStatus == 2) {
    // 待完成
    textColor = '#F89B22';
    bgColor = '#FFDCAE4D';
  } else if (TaskStatus == 3) {
    // 进行中
    textColor = '#19B319';
    bgColor = '#DCFFDC4D';
  }
  return {textColor, bgColor};
};

@connect()
class ToBeRectified extends Component {
  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.dispatch(
            NavigationActions.navigate({
              routeName: 'AbnormalRectification',
              params: {
                // ID: map.extras.alarm_id,
                // alarmTime: map.extras.alarm_time
              },
            }),
          );
        }}>
        <View
          style={[
            {width: SCREEN_WIDTH, height: 136, backgroundColor: 'white'},
          ]}>
          <View
            style={{
              marginTop: 15,
              marginLeft: 30,
              width: SCREEN_WIDTH - 60,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: '#5CA9FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 10, color: '#FFFFFF'}}>企</Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                marginLeft: 5,
                fontSize: 14,
                color: '#333333',
              }}>{`${SentencedToEmpty(
              item,
              [0, 'EntName'],
              '--',
            )}-${SentencedToEmpty(item, [0, 'PointName'], '--')}`}</Text>
            {/* <Text style={{ marginLeft: 4, fontSize: 12, color: '#4AA0FF' }}>{`(${SentencedToEmpty(item, ['Count'], '0')})`}</Text> */}
            <View
              style={[
                {
                  width: 50,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: getStatusObject(
                    SentencedToEmpty(item, ['TaskStatus'], 1),
                  ).bgColor,
                },
              ]}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    color: getStatusObject(
                      SentencedToEmpty(item, ['TaskStatus'], 1),
                    ).textColor,
                  },
                ]}>
                {`${SentencedToEmpty(item, ['TaskStatusName'], '---')}`}
              </Text>
            </View>
          </View>
          <Text
            style={[
              {
                marginTop: 6,
                width: SCREEN_WIDTH - 60,
                height: 63,
                marginLeft: 30,
              },
            ]}
            numberOfLines={3}>
            {`核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息`}
          </Text>
          <View
            style={[
              {
                alignItems: 'center',
                flexDirection: 'row',
                width: SCREEN_WIDTH - 60,
                marginLeft: 30,
                height: 20,
              },
            ]}>
            <View style={[{flex: 1}]} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 16, height: 16, marginRight: 3}}
                source={require('../../images/ic_tab_statistics_selected.png')}
              />
              <SDLText fontType={'normal'} style={[{color: '#666666'}]}>
                {`2023-10-26 11:00:00`}
              </SDLText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={[{width: SCREEN_WIDTH, flex: 1, marginTop: 8}]}>
        <FlatListWithHeaderAndFooter
          ref={ref => (this.list = ref)}
          // pageSize={this.props.pageSize}
          ItemSeparatorComponent={() => (
            <View
              style={[
                {width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2'},
              ]}
            />
          )}
          hasMore={() => {
            return false;
          }}
          onRefresh={index => {
            // this.onRefresh(index);
          }}
          onEndReached={index => {}}
          renderItem={this._renderItem}
          // data={this.props.serviceDispatchData}
          data={[{}, {}]}
        />
      </View>
    );
  }
}
//To be reviewed

class ToBeReviewed extends Component {
  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 136,
              backgroundColor: 'white',
              marginTop: 8,
            },
          ]}>
          <View
            style={{
              marginTop: 15,
              marginLeft: 30,
              width: SCREEN_WIDTH - 60,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: '#5CA9FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 10, color: '#FFFFFF'}}>企</Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                marginLeft: 5,
                fontSize: 14,
                color: '#333333',
              }}>{`${SentencedToEmpty(
              item,
              [0, 'EntName'],
              '--',
            )}-${SentencedToEmpty(item, [0, 'PointName'], '--')}`}</Text>
            {/* <Text style={{ marginLeft: 4, fontSize: 12, color: '#4AA0FF' }}>{`(${SentencedToEmpty(item, ['Count'], '0')})`}</Text> */}
            <View
              style={[
                {
                  width: 50,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: getStatusObject(
                    SentencedToEmpty(item, ['TaskStatus'], 1),
                  ).bgColor,
                },
              ]}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    color: getStatusObject(
                      SentencedToEmpty(item, ['TaskStatus'], 1),
                    ).textColor,
                  },
                ]}>
                {`${SentencedToEmpty(item, ['TaskStatusName'], '---')}`}
              </Text>
            </View>
          </View>
          <Text
            style={[
              {
                marginTop: 6,
                width: SCREEN_WIDTH - 60,
                height: 63,
                marginLeft: 30,
              },
            ]}
            numberOfLines={3}>
            {`核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息核实信息`}
          </Text>
          <View
            style={[
              {
                alignItems: 'center',
                flexDirection: 'row',
                width: SCREEN_WIDTH - 60,
                marginLeft: 30,
                height: 20,
              },
            ]}>
            <View style={[{flex: 1}]}></View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 16, height: 16, marginRight: 3}}
                source={require('../../images/ic_tab_statistics_selected.png')}
              />
              <SDLText fontType={'normal'} style={[{color: '#666666'}]}>
                {`2023-10-26 11:00:00`}
              </SDLText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <StatusPage style={[{width: SCREEN_WIDTH, flex: 1}]}>
        <FlatListWithHeaderAndFooter
          ref={ref => (this.list = ref)}
          // pageSize={this.props.pageSize}
          ItemSeparatorComponent={() => (
            <View
              style={[
                {width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2'},
              ]}
            />
          )}
          hasMore={() => {
            return false;
          }}
          onRefresh={index => {
            // this.onRefresh(index);
          }}
          onEndReached={index => {}}
          renderItem={this._renderItem}
          // data={this.props.serviceDispatchData}
          data={[{}, {}, {}]}
        />
      </StatusPage>
    );
  }
}
