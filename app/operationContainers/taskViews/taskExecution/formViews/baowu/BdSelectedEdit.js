/*
 * @Description: CEMS校验测试记录 标气记录/设备 编辑页面
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2022-01-04 10:52:26
 * @LastEditTime: 2025-04-21 16:57:04
 * @FilePath: /SDLSourceOfPollutionS/app/operationContainers/taskViews/taskExecution/formViews/BdSelectedEdit.js
 */
import React, {Component} from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {
  AlertDialog,
  SDLText,
  SimpleLoadingView,
} from '../../../../../components';
import FormPicker from '../../components/FormPicker';
import globalcolor from '../../../../../config/globalcolor';
import {SCREEN_WIDTH} from '../../../../../config/globalsize';
import {
  createAction,
  createNavigationOptions,
  SentencedToEmpty,
} from '../../../../../utils';

@connect(({bdRecordBWModel}) => ({
  BaseInfo: bdRecordBWModel.BaseInfo,
  additionResult: bdRecordBWModel.additionResult,
  delAdditionItmeStatus: bdRecordBWModel.delAdditionItmeStatus,
}))
export default class BdSelectedEdit extends Component {


  constructor(props) {
    super(props);
    let state = {};
    let label = SentencedToEmpty(
      props.route,
      ['params', 'params', 'label'],
      '',
    );
    let itemData = SentencedToEmpty(
      props.route,
      ['params', 'params', 'item'],
      '',
    );
    let ParamsType = 1;
    if (label == '参比方法测试设备') {
      ParamsType = 2;
    }
    if (label == '参比监测公司') {
      ParamsType = 3;
    }
    SentencedToEmpty(props.route, ['params', 'params', 'columns'], []).map(
      (item, key) => {
        state[item.code] = SentencedToEmpty(itemData, [item.code], '');
      },
    );
    state.ID = SentencedToEmpty(itemData, ['ID'], '');
    state.ParamsType = ParamsType;
    this.state = state;

    let title = '添加标准气体';
    if (label == '参比方法测试设备') {
      title = '添加测试设备';
    }
    if (label == '参比监测公司') {
      title = '添加公司';
    }
    this.props.navigation.setOptions({
      title: title,
    });
  }

  deleteConfirm = () => {
    let itemData = SentencedToEmpty(
      this.props.route,
      ['params', 'params', 'item'],
      '',
    );
    this.props.dispatch(
      createAction('bdRecordBWModel/delAdditionItem')({
        params: {ID: itemData.ID},
      }),
    );
  };

  render() {
    let label = SentencedToEmpty(
      this.props.route,
      ['params', 'params', 'label'],
      '',
    );
    let msg = '确认删除该标气吗？';
    if (label == '参比方法测试设备') {
      msg = '确认删除该测试设备吗？';
    }
    let options = {
      headTitle: '提示',
      messText: `${msg}`,
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
    const columns = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'columns'],
      [],
    );
    const configList = SentencedToEmpty(
      this.props,
      ['route', 'params', 'params', 'configList'],
      [],
    );
    // console.log(columns,configList,'2222222')
    return (
      <View
        style={[
          {
            flex: 1,
            width: SCREEN_WIDTH,
          },
        ]}>
        <View
          style={[
            {
              width: SCREEN_WIDTH,
              backgroundColor: 'white',
              paddingHorizontal: 20,
            },
          ]}>
          {columns.map((comlumn, index) => {
            if (comlumn.code == 'Unit') {
              // 'mg/m3','ppm','%'
              return (
                <FormPicker
                  hasColon={true}
                  propsLabelStyle={{
                    fontSize: 14,
                    color: '#333333',
                  }}
                  propsTextStyle={{
                    color: globalcolor.datepickerGreyText,
                    fontSize: 14,
                    marginRight: 0,
                  }}
                  label="单位"
                  defaultCode={this.state.PartType}
                  option={{
                    codeKey: 'code',
                    nameKey: 'name',
                    defaultCode: '',
                    dataArr: [
                      {name: 'mg/m3', code: 'mg/m3'},
                      {name: 'ppm', code: 'ppm'},
                      {name: '%', code: '%'},
                    ],
                    onSelectListener: item => {
                      let params = {};
                      params[comlumn.code] = item.code;
                      this.setState(params);
                    },
                  }}
                  showText={this.state[comlumn.code]}
                  placeHolder="请选择"
                />
              );
            }else if(comlumn.name == '测试项目'){ 
              return (
                <FormPicker
                  hasColon={true}
                  propsLabelStyle={{
                    fontSize: 14,
                    color: '#333333',
                  }}
                  propsTextStyle={{
                    color: globalcolor.datepickerGreyText,
                    fontSize: 14,
                    marginRight: 0,
                  }}
                  label={comlumn.name}
                  defaultCode={this.state.PartType}
                  option={{
                    codeKey: 'Name',
                    nameKey: 'Name',
                    defaultCode: '',
                    dataArr: configList,
                    onSelectListener: item => {
                      let params = {};
                      params[comlumn.code] = item.Name;
                      this.setState(params);
                    },
                  }}
                  showText={this.state[comlumn.code]}
                  placeHolder="请选择"
                />
              );
            } else {
              return (
                <View
                  key={`${comlumn.code + index}`}
                  style={[{width: SCREEN_WIDTH - 40}]}>
                  <View style={[styles.item]}>
                    <Text style={styles.text}>{comlumn.name}</Text>
                    <TextInput
                      keyboardType={
                        comlumn.code == 'ConcentrationValue'
                          ? 'numeric'
                          : 'default'
                      }
                      value={
                        SentencedToEmpty(this, ['state', comlumn.code], '') + ''
                      }
                      style={[styles.textStyle, {flex: 1}]}
                      placeholder={'未填写'}
                      placeholderTextColor={'#999999'}
                      onChangeText={text => {
                        let newData = {};
                        newData[comlumn.code] = `${text}`;
                        this.setState(newData);
                      }}
                    />
                  </View>
                  <Text style={styles.line} />
                </View>
              );
            }
          })}
        </View>
        <View style={{flex: 1}} />
        {SentencedToEmpty(this.state, ['ID'], '') != '' ? (
          <TouchableOpacity
            style={[{position: 'absolute', right: 18, bottom: 128}]}
            onPress={() => {
              this.refs.doAlert.show();
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
              <SDLText style={[{color: globalcolor.whiteFont}]}>
                {'删除'}
              </SDLText>
              <SDLText style={[{color: globalcolor.whiteFont}]}>
                {'表单'}
              </SDLText>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            this.props.dispatch(
              createAction('bdRecordBWModel/addorUpdateCalibrationTestParams')(
                this.state,
              ),
            );
          }}
          style={[
            {
              height: 44,
              width: SCREEN_WIDTH - 20,
              marginLeft: 10,
              backgroundColor: '#4DA9FF',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text style={{fontSize: 17, color: 'white'}}>保存</Text>
        </TouchableOpacity>
        <AlertDialog options={options} ref="doAlert" />
        {this.props.additionResult.status == -1 ? (
          <SimpleLoadingView message={'正在保存'} />
        ) : null}
        {this.props.delAdditionItmeStatus.status == -1 ? (
          <SimpleLoadingView message={'正在删除'} />
        ) : null}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    color: globalcolor.datepickerGreyText,
    flex: 1,
    textAlign: 'right',
  },
  item: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    color: '#333333',
  },
  line: {
    height: 1,
    backgroundColor: '#e7e7e7',
  },
  textDefault: {
    fontSize: 14,
    color: '#666666',
  },
  textInput: {
    marginTop: 8,
    marginBottom: 10,
    padding: 0,
    color: '#666666',
    fontSize: 14,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
});
