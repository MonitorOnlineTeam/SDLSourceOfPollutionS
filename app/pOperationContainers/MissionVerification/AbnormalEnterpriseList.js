import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import {
  StatusPage,
  FlatListWithHeaderAndFooter,
  SDLText,
  SimplePickerRangeDay,
  SimplePicker,
} from '../../components';
import {SCREEN_WIDTH} from '../../config/globalsize';
import {
  createAction,
  createNavigationOptions,
  SentencedToEmpty,
  NavigationActions,
} from '../../utils';
import moment from 'moment';

//异常识别报警企业列表
@connect(({abnormalTask, login}) => ({
  clueDatasTotal: abnormalTask.clueDatasTotal,
  clueDatasList: abnormalTask.clueDatasList,
  ExceptionNumsByPointAuth: abnormalTask.ExceptionNumsByPointAuth,
  MoldList: abnormalTask.MoldList,
  alarmAnalyBeginTime: abnormalTask.alarmAnalyBeginTime,
  alarmAnalyEndTime: abnormalTask.alarmAnalyEndTime,
  proFlag: abnormalTask.proFlag,
}))
export default class AbnormalEnterpriseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warningTypeCode: props.proFlag == 1 ? 2 : 1,
    };

    props.navigation.setOptions({
      title: '异常识别线索',
    });
  }
  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      'refreshSec',
      this.statusPageOnRefresh,
    );
    this.statusPageOnRefresh();
  }
  componentWillUnmount() {
    this.props.dispatch(
      createAction('abnormalTask/updateState')({
        ExceptionNumsByPointAuth: {status: -1},
        alarmAnalyIndex: 1,
        alarmAnalyTotal: 0,
        alarmAnalyBeginTime: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD 00:00:00'),
        alarmAnalyEndTime: moment().format('YYYY-MM-DD 23:59:59'),
      }),
    );
  }
  renderItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          width: SCREEN_WIDTH,
          minHeight: 45,
          paddingHorizontal: 10,
          paddingTop: 10,
        }}>
        <View
          style={{
            minHeight: 45,
            width: SCREEN_WIDTH - 20,
            backgroundColor: 'white',
            paddingHorizontal: 10,
          }}>
          <View
            style={{
              marginTop: 15,
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
                marginLeft: 5,
                fontSize: 14,
                color: '#333333',
              }}>{`${SentencedToEmpty(
              item,
              ['EntName'],
              '--',
            )}-${SentencedToEmpty(item, ['PointName'], '--')}`}</Text>
          </View>
          <View
            style={{
              width: SCREEN_WIDTH - 40,
              minHeight: 48,
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 15,
            }}>
            {/* {item[0].WarningDatas.map((typeItem, typeIndex) => { */}
            {item.WarningDatas.map((typeItem, typeIndex) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.props.dispatch(
                      NavigationActions.navigate({
                        routeName: 'AbnormalOneETypeList',
                        params: {
                          // item: { ...typeItem, ...item[0] }
                          item: {...typeItem, ...item},
                        },
                      }),
                    );
                  }}
                  key={`${index}item${typeIndex}`}>
                  <View
                    style={{
                      width: (SCREEN_WIDTH - 60) / 2,
                      marginLeft: typeIndex % 2 == 0 ? 0 : 10,
                      minHeight: 33,
                      flexDirection: 'row',
                      backgroundColor: '#F7F8FA',
                      borderRadius: 5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#666666',
                        maxWidth: (SCREEN_WIDTH - 150) / 2,
                      }}>
                      {SentencedToEmpty(typeItem, ['WarningName'], '--')}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#4AA0FF',
                      }}>{`${SentencedToEmpty(
                      typeItem,
                      ['WarningCount'],
                      '0',
                    )}个`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };
  statusPageOnRefresh = () => {
    this.props.dispatch(
      createAction('abnormalTask/updateState')({
        clueDatasPageIndex: 1,
        clueDatasTotal: 0,
        clueDatasList: [],
        ExceptionNumsByPointAuth: {status: -1},
      }),
    );
    this.props.dispatch(
      createAction('abnormalTask/GetClueDatas')({
        setListData: this.list ? this.list.setListData : null,
      }),
    );
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
          createAction('abnormalTask/updateState')({
            ExceptionNumsByPointAuth: {status: -1},
            alarmAnalyIndex: 1,
            alarmAnalyTotal: 0,
            alarmAnalyBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
            alarmAnalyEndTime: endMoment.format('YYYY-MM-DD 23:59:59'),
          }),
        );
        this.statusPageOnRefresh();
      },
    };
  };

  getDataTypeSelectOption = () => {
    return {
      codeKey: 'ModelGuid',
      nameKey: 'ModelName',
      placeHolder: '',
      defaultCode: this.state.warningTypeCode,
      dataArr:
        this.props.proFlag == 1
          ? [
              {ModelGuid: 2, ModelName: '待复核'},
              {ModelGuid: 3, ModelName: '核实完成'},
            ]
          : [
              {ModelGuid: 1, ModelName: '待核实'},
              {ModelGuid: 2, ModelName: '待复核'},
              {ModelGuid: 3, ModelName: '核实完成'},
            ],
      onSelectListener: item => {
        this.setState({warningTypeCode: item.ModelGuid}, () => {
          this.statusPageOnRefresh();
        });
      },
    };
  };

  render() {
    const grouped = SentencedToEmpty(
      this.props,
      ['ExceptionNumsByPointAuth', 'data', 'Datas', 'showWarnings'],
      [],
    ).reduce((acc, obj) => {
      const key = obj.DGIMN;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
    return (
      <View style={{width: SCREEN_WIDTH, flex: 1}}>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              height: 45,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#fff',
              marginBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
            },
          ]}>
          <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
        </View>

        <StatusPage
          status={SentencedToEmpty(
            this.props,
            ['ExceptionNumsByPointAuth', 'status'],
            200,
          )}
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
          <FlatListWithHeaderAndFooter
            style={[{backgroundColor: '#f2f2f2'}]}
            ref={ref => (this.list = ref)}
            ItemSeparatorComponent={() => (
              <View
                style={[
                  {width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2'},
                ]}
              />
            )}
            pageSize={20}
            onEndReachedThreshold={0.6}
            hasMore={() => {
              return (
                this.props.clueDatasList.length < this.props.clueDatasTotal
              );
            }}
            onRefresh={index => {
              console.log('onRefresh');
              this.statusPageOnRefresh();
            }}
            onEndReached={index => {
              this.props.dispatch(
                createAction('abnormalTask/updateState')({
                  clueDatasPageIndex: index,
                }),
              );
              this.props.dispatch(
                createAction('abnormalTask/GetClueDatas')({
                  setListData: this.list ? this.list.setListData : null,
                }),
              );
              // this.props.dispatch(createAction('abnormalTask/updateState')({ unhandleTaskListPageIndex: index }));
              // this.props.dispatch(createAction('abnormalTask/getUnhandleTaskList')({ setListData: this.list.setListData }));
            }}
            renderItem={this.renderItem}
            // data={Object.values(grouped)}
            data={this.props.clueDatasList}
          />
        </StatusPage>
      </View>
    );
  }
}
