import React, {Component, PureComponent} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  NavigationActions,
  createAction,
  ShowToast,
  SentencedToEmpty,
} from '../../../../../utils';
import {connect} from 'react-redux';
import moment from 'moment';

import globalcolor from '../../../../../config/globalcolor';
import {
  StatusPage,
  SimpleLoadingComponent,
  SimplePickerSingleTime,
  AlertDialog,
} from '../../../../../components';
import MyTextInput from '../../../../../components/base/TextInput';
import Picker from 'react-native-picker';
import FormText from '../../components/FormText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ic_arrows_down = require('../../../../../images/ic_arrows_right.png');

/**
 * 校验测试记录 编辑界面
 * @class DataWarningView
 * @extends {PureComponent}
 */
@connect(
  ({bdRecordZBModel}) => ({
    editstatus: bdRecordZBModel.editstatus,
    delSubtableStatus: bdRecordZBModel.delSubtableStatus,
  }),
  null,
  null,
  {withRef: true},
)
class BdRecordEdit extends PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.ItemData.Name + '校验测试记录',
      tabBarLable: navigation.state.params.ItemData.Name + '校验测试记录',
      animationEnabled: false,
      headerBackTitle: null,
      headerTintColor: '#ffffff',
      headerTitleStyle: {flex: 1, textAlign: 'center', fontSize: 17},
      headerStyle: {
        backgroundColor: globalcolor.headerBackgroundColor,
        height: 45,
      },
      labelStyle: {fontSize: 14},
      headerRight:
        SentencedToEmpty(
          navigation,
          ['state', 'params', 'ItemData', 'ID'],
          '',
        ) != '' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.state.params.navigatePress();
            }}>
            <Text style={{color: 'white', marginRight: 16}}>删除</Text>
          </TouchableOpacity>
        ) : (
          <View />
        ),
    };
  };

  static defaultProps = {
    editstatus: 200,
  };

  constructor(props) {
    super(props);
    this.state = {
      UnitList: [], //单位的列表
      Name: '', //名字
      ItemID: '', //校验项目ID
      Unit: '', //单位 有的写死 有的选择
      Formula: '', //公式（相对准确度、相对误差、绝对误差）
      EvaluateStadard: '', //评价标准
      EvaluateResults: '', //评价结果
      CbAvgValue: '', //参比方法测定值的平均值
      CemsTextValue: '', //CEMS测定值的平均值
      TestResult: [], //校验值(多组)
      Completed: false,
      // 校验值的实体
      // {
      //     "ItemID":"161",
      //     "TestTime":"2018-12-07 09:24:18",
      //     "CbValue":"10",//参比方法测定值
      //     "CemsTextValue":"10"//CEMS测定值
      // }
    };
    props.navigation.setParams({
      navigatePress: () => {
        this.refs.doAlert.show();
      },
    });

    this.props.navigation.setOptions({
      headerRight: () => {
        if (
          SentencedToEmpty(
            this.props.route,
            ['params', 'params', 'ItemData', 'ID'],
            '',
          ) != ''
        ) {
          return (
            <TouchableOpacity
              onPress={() => {
                this.refs.doAlert.show();
              }}>
              <Text style={{color: 'white', marginRight: 16}}>删除</Text>
            </TouchableOpacity>
          );
        } else {
          return <View />;
        }
      },
    });

    this.props.navigation.setOptions({
      title: this.props.route.params.params.ItemData.Name + '校验测试记录',
    });
  }

  componentWillMount() {
    // let ItemData = this.props.navigation.state.params.ItemData;
    let ItemData = this.props.route.params.params.ItemData;
    /**
     * 如果数据为空，增加一条空记录
     */
    if (ItemData.TestResult == '' || ItemData.TestResult == null)
      ItemData.TestResult = [
        {
          ItemID: ItemData.ItemID,
          ItemName: ItemData.Name,
          TestTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          CbValue: '', //参比方法测定值
          CemsTextValue: '', //CEMS测定值
        },
      ];
    this.setState({...this.state, ...ItemData});
    this.initUnit(ItemData.ItemID);
  }

  deleteConfirm = () => {
    // const { ItemID } = this.props.navigation.state.params.ItemData;
    const {ItemID} = this.props.route.params.params.ItemData;
    this.props.dispatch(
      createAction('bdRecordZBModel/delSubtable')({
        params: {ID: ItemID},
      }),
    );
  };

  render() {
    let options = {
      headTitle: '提示',
      // messText: `确认删除${this.props.navigation.state.params.ItemData.Name}校验测试记录吗？`,
      messText: `确认删除${this.props.route.params.params.ItemData.Name}校验测试记录吗？`,
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
          onpress: () => {},
        },
        {
          txt: '确定',
          btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
          txtStyle: {color: '#ffffff'},
          onpress: this.deleteConfirm,
        },
      ],
    };
    //不为空时候 最后一个给出标识
    // let params = SentencedToEmpty(this.props, ['navigation', 'state', 'params'], '-');
    let params = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params'],
      '-',
    );
    const {ItemData} = this.props.route.params.params;
    console.log('ItemData', ItemData);
    return (
      <StatusPage style={styles.container} status={200}>
        <KeyboardAvoidingView
          style={{alignItems: 'center'}}
          behavior={Platform.OS == 'ios' ? 'padding' : ''}
          keyboardVerticalOffset={100}>
          <ScrollView style={styles.scroll}>
            <View style={styles.scrollContent}>
              <View
                style={[
                  {
                    backgroundColor: '#ffffff',
                    marginTop: 10,
                    width: '100%',
                    minHeight: 40,
                    paddingLeft: 13,
                    paddingRight: 13,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    paddingBottom: 12,
                  },
                ]}>
                <Text style={[styles.textlabel, {flex: 1}]}>{'评价标准:'}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666666',
                    maxWidth: SCREEN_WIDTH - 100,
                  }}>
                  {SentencedToEmpty(
                    this.props,
                    [
                      'route',
                      'params',
                      'params',
                      'ItemData',
                      'EvaluateStadard',
                    ],
                    '提交保存后系统生成',
                  ).replace(/\r\n/g, '')}
                </Text>
              </View>
              <Text style={styles.line} />
              <View
                style={[
                  styles.item,
                  {backgroundColor: '#ffffff', flexDirection: 'column'},
                ]}>
                <FormText
                  last={true}
                  label="评价结果"
                  itemHeight={40}
                  showString={
                    // SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'ItemData', 'EvaluateResults'], '0') == 1
                    SentencedToEmpty(
                      this.props,
                      [
                        'route',
                        'params',
                        'params',
                        'ItemData',
                        'EvaluateResults',
                      ],
                      '0',
                    ) == 1
                      ? '合格'
                      : SentencedToEmpty(
                          this.props,
                          [
                            'route',
                            'params',
                            'params',
                            'ItemData',
                            'EvaluateResults',
                          ],
                          '',
                        ) == ''
                      ? '提交保存后系统生成'
                      : '不合格'
                  }
                />
              </View>
              <Text style={styles.line} />
              <View
                style={[
                  styles.item,
                  {backgroundColor: '#ffffff', flexDirection: 'column'},
                ]}>
                <FormText
                  last={true}
                  label="参比方法平均值"
                  itemHeight={40}
                  showString={
                    ItemData.CbAvgValue
                      ? ItemData.CbAvgValue
                      : '提交保存后系统生成'
                  }
                />
              </View>
              <Text style={styles.line} />
              <View
                style={[
                  styles.item,
                  {backgroundColor: '#ffffff', flexDirection: 'column'},
                ]}>
                <FormText
                  last={true}
                  label="CEMS测定值平均值"
                  itemHeight={40}
                  showString={
                    ItemData.CemsTextValue
                      ? ItemData.CemsTextValue
                      : '提交保存后系统生成'
                  }
                />
              </View>
              {
                // 颗粒物、流速、温度、湿度不显示
                ItemData.ItemID !== '161' &&
                  ItemData.ItemID !== '165' &&
                  ItemData.ItemID !== '166' &&
                  ItemData.ItemID !== '167' && (
                    <>
                      <Text style={styles.line} />
                      <View
                        style={[
                          styles.item,
                          {backgroundColor: '#ffffff', flexDirection: 'column'},
                        ]}>
                        <FormText
                          last={true}
                          label="数据对差平均值"
                          itemHeight={40}
                          showString={
                            ItemData.CbAvgValue && ItemData.CemsTextValue
                              ? (
                                  parseFloat(ItemData.CemsTextValue) -
                                  parseFloat(ItemData.CbAvgValue)
                                ).toFixed(3)
                              : '提交保存后系统生成'
                          }
                        />
                      </View>
                    </>
                  )
              }
              <Text style={styles.line} />
              <TouchableOpacity
                style={[styles.item, {backgroundColor: '#ffffff'}]}
                onPress={() => {
                  Picker.toggle();
                }}>
                <Text style={styles.textlabel}>测量单位:</Text>
                <Text style={styles.textcontent}>{this.state.Unit}</Text>
                <Image
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 8,
                    marginRight: 12,
                  }}
                  source={ic_arrows_down}
                />
              </TouchableOpacity>
              <View>
                {this.state.TestResult.map((item, key) => {
                  return this.getItem(key);
                })}
              </View>
              <TouchableOpacity
                style={{
                  height: 41,
                  backgroundColor: '#ffffff',
                  flexDirection: 'column',
                }}
                onPress={() => {
                  this.addItem();
                }}>
                <Text style={styles.line} />
                <Text
                  style={{
                    fontSize: 15,
                    color: '#0080ff',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: 40,
                  }}>
                  + 添加测量记录
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.bottomOperate}>
            {this.state.Completed ? (
              <TouchableOpacity
                style={styles.del}
                onPress={() => {
                  this.del();
                }}>
                <Image
                  style={{width: 15, height: 15}}
                  source={require('../../../../../images/ic_commit.png')}
                />
                <Text style={{marginLeft: 20, fontSize: 15, color: '#ffffff'}}>
                  删除记录
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.commit}
              onPress={() => {
                this.commit();
              }}>
              <Image
                style={{width: 15, height: 15}}
                source={require('../../../../../images/ic_commit.png')}
              />
              <Text style={{marginLeft: 20, fontSize: 15, color: '#ffffff'}}>
                提交保存
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        {this.props.editstatus.status == -2 ? (
          <SimpleLoadingComponent message={'提交中'} />
        ) : null}
        {this.props.delSubtableStatus.status == -2 ? (
          <SimpleLoadingComponent message={'删除中'} />
        ) : null}
        <AlertDialog options={options} ref="doAlert" />
      </StatusPage>
    );
  }

  addItem() {
    let TestResult = [];
    TestResult.push(...this.state.TestResult);
    TestResult.push({
      ItemName: this.state.Name,
      ItemID: this.state.ItemID,
      TestTime: moment().format('YYYY-MM-DD HH:mm:00'),
      EndTime: moment().format('YYYY-MM-DD HH:mm:59'),
      CbValue: '', //参比方法测定值
      CemsTextValue: '', //CEMS测定值
    });
    this.setState({TestResult});
  }

  del(index) {
    let TestResult = [];
    TestResult.push(...this.state.TestResult);
    TestResult.splice(index, 1);
    this.setState({TestResult});
  }
  getTimeSelectOption = index => {
    let type = this.props.datatype;
    return {
      formatStr: 'YYYY-MM-DD HH:mm',
      type: type,
      defaultTime:
        this.state.TestResult[index].TestTime ||
        moment().format('YYYY-MM-DD HH:mm:ss'),
      onSureClickListener: time => {
        let TestResult = this.state.TestResult;
        TestResult[index].TestTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        this.setState({TestResult});
      },
    };
  };
  getEndTimeSelectOption = index => {
    let type = this.props.datatype;
    return {
      formatStr: 'YYYY-MM-DD HH:mm',
      type: type,
      defaultTime:
        this.state.TestResult[index].EndTime ||
        moment().format('YYYY-MM-DD HH:mm:ss'),
      onSureClickListener: time => {
        let TestResult = this.state.TestResult;
        TestResult[index].EndTime = moment(time).format('YYYY-MM-DD HH:mm:ss');
        this.setState({TestResult});
      },
    };
  };
  getItem = index => {
    let i = index + 1;
    return (
      <View key={`item${i}`} style={styles.itemcontainer}>
        <View style={styles.itemtitle}>
          <Text style={{color: '#666666', fontSize: 12}}>
            {'监测记录(' + i + ')'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.del(index);
            }}>
            <Text
              style={{
                color: '#666666',
                fontSize: 12,
                width: 48,
                lineHeight: 37,
                textAlign: 'right',
              }}>
              删除
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemContent}>
          <View style={styles.item}>
            <Text style={styles.textlabel}>监测开始时间：</Text>
            <SimplePickerSingleTime
              style={{width: 160}}
              option={this.getTimeSelectOption(index)}
            />
          </View>
          <Text style={styles.line} />
          <View style={styles.item}>
            <Text style={styles.textlabel}>监测结束时间：</Text>
            <SimplePickerSingleTime
              style={{width: 160}}
              option={this.getEndTimeSelectOption(index)}
            />
          </View>
          <Text style={styles.line} />

          <View style={styles.item}>
            <Text style={styles.textlabel}>参比法测定值：</Text>
            <MyTextInput
              style={styles.textinput}
              keyboardType={
                Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              onChangeText={text => {
                let TestResult = this.state.TestResult;
                TestResult[index].CbValue = text;
                this.setState({TestResult});
              }}
              underlineColorAndroid="transparent"
              placeholder="请填写"
              multiline={false}>
              {this.state.TestResult[index].CbValue}
            </MyTextInput>
          </View>
          <Text style={styles.line} />

          <View style={styles.item}>
            <Text style={styles.textlabel}>CEMS测定值：</Text>
            <MyTextInput
              keyboardType={
                Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              style={styles.textinput}
              onChangeText={text => {
                let TestResult = this.state.TestResult;
                TestResult[index].CemsTextValue = text;
                this.setState({TestResult});
              }}
              underlineColorAndroid="transparent"
              placeholder="请填写"
              multiline={false}>
              {this.state.TestResult[index].CemsTextValue}
            </MyTextInput>
          </View>
        </View>
      </View>
    );
  };

  commit = () => {
    let CbAvgValue = 0;
    let CemsTextValue = 0;
    if (
      '162' == this.state.ItemID ||
      '163' == this.state.ItemID ||
      '164' == this.state.ItemID
    ) {
      //气态至少9对
      if (this.state.TestResult.length < 9) {
        ShowToast(this.state.Name + '最少需要测量9次');
        return;
      }
    } else {
      if (this.state.TestResult.length < 5) {
        ShowToast(this.state.Name + '最少需要测量5次');
        return;
      }
    }
    if (this.state.TestResult.length > 0) {
      for (let i = 0; i < this.state.TestResult.length; i++) {
        let item = this.state.TestResult[i];
        if (this.isNumber(item.CbValue)) {
          CbAvgValue += parseFloat(item.CbValue);
        } else {
          ShowToast('参比法测量值不合法');
          return;
        }
        if (this.isNumber(item.CemsTextValue)) {
          CemsTextValue += parseFloat(item.CemsTextValue);
        } else {
          ShowToast('CEMS测定值不合法');
          return;
        }
      }
    } else {
      ShowToast('测量值不为空');
    }
    CbAvgValue = ((CbAvgValue * 1.0) / this.state.TestResult.length).toFixed(3);
    CemsTextValue = (
      (CemsTextValue * 1.0) /
      this.state.TestResult.length
    ).toFixed(3);
    // 修改本地的数据
    this.props.dispatch(
      createAction('bdRecordZBModel/saveItem')({
        params: {
          ItemID: this.state.ItemID,
          ItemName: this.state.Name,
          Unit: this.state.Unit,
          Formula: '',
          EvaluateStadard: '',
          EvaluateResults: '',
          CbAvgValue: CbAvgValue,
          CemsTextValue: CemsTextValue,
          TestResult: this.state.TestResult,
        },
      }),
    );
    // 提交本地的数据
    this.props.dispatch(createAction('bdRecordZBModel/saveForm')({params: {}}));
  };

  /**
   * 初始化单位 若有多个单位则初始化选择框
   */
  initUnit = ItemID => {
    let UnitList = [];
    switch (ItemID) {
      // 颗粒物、SO2、NOX、O2、流速、温度、湿度
      case '161': //颗粒物 mg/m3
        UnitList = ['mg/m3'];
        break;
      case '162': //SO2 μmol/mol mg/m3
      case '163': //NOX μmol/mol mg/m3
        UnitList = ['mg/m3', 'μmol/mol'];
        break;
      case '164': //O2 μmol/mol mg/m3
        UnitList = ['%'];
        break;
      case '165': //流速 m/s
        UnitList = ['m/s'];
        break;
      case '166': //温度 ℃
        UnitList = ['℃'];
        break;
      case '167': //湿度 %
        UnitList = ['%'];
        break;
    }
    /**
     * CO、HCL、NH3
     * 碳排放里应该有CO2
     * VOCS里还有非甲烷总烃
     * 气态的一般就是那三个单位
     * mg/m3、ppm、%
     */
    if (UnitList.length == 0) {
      UnitList = ['mg/m3', 'ppm', '%'];
    }
    this.setState({UnitList});
    this.initPicker(UnitList);
    if (this.state.Unit == '' || this.state.Unit == null) {
      if (UnitList.length > 0) {
        this.setState({Unit: UnitList[0]}); //未填写单位时候默认显示单位列表中的第一个
      }
    }
  };

  initPicker = UnitList => {
    Picker.init({
      pickerTextEllipsisLen: 18,
      pickerData: UnitList,
      selectedValue: [UnitList[0]],
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '测量单位选择',
      onPickerConfirm: data => {
        this.setState({Unit: data[0]});
        //     Picker.hide();//调用后ios会主动销毁，建议不写
      },
      // onPickerCancel: data => {
      //     Picker.hide();//调用后ios会主动销毁，建议不写
      // }
    });
  };
  isNumber = val => {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg =
      /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  scroll: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  scrollContent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#00000000',
  },

  itemcontainer: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#00000000',
  },

  itemtitle: {
    paddingLeft: 13,
    paddingRight: 13,
    backgroundColor: '#00000000',
    height: 37,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemContent: {
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  item: {
    width: '100%',
    height: 40,
    paddingLeft: 13,
    paddingRight: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textlabel: {
    fontSize: 14,
    color: '#333333',
  },

  textcontent: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },

  textinput: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },

  line: {
    height: 1,
    backgroundColor: '#e7e7e7',
  },

  bottomOperate: {
    marginTop: 10,
    width: SCREEN_WIDTH - 24,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#00000000',
  },
  del: {
    marginTop: 10,
    width: 282,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ee9944',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commit: {
    marginBottom: 15,
    marginTop: 10,
    width: 282,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4499f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//make this component available to the app
export default BdRecordEdit;
