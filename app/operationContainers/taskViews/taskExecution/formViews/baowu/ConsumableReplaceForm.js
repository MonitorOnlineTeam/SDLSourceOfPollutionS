/*
 * @Author: jab
 * @Date: 2025-04-02 16:00:00
 * @Last Modified by: jab
 * @Last Modified time: 2025-04-10 16:09:38
 * @Description: 废气、废水易耗品更换记录
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import globalcolor from '../../../../../config/globalcolor';
import {SCREEN_WIDTH} from '../../../../../config/globalsize';
import {ShowToast, createAction} from '../../../../../utils';
import {SimpleLoadingComponent} from '../../../../../components';
import FormDatePicker from '../../components/FormDatePicker';
import FormInput from '../../components/FormInput';
import FormPicker from '../../components/FormPicker';
import FormTextArea from '../../components/FormTextArea';
import ImageGrid from '../../../../../components/form/images/ImageGrid';
import FormText from '../../components/FormText';

@connect(({patrolModel}) => ({
  editstatus: patrolModel.editstatus,
}))
class ConsumableReplaceForm extends Component {
  constructor(props) {
    super(props);
    const {PollutantList} = props.route.params.params;
    this.state = {
      loading: false,
      formData: {
        ID: '', // 主键ID
        ReplaceDate: '', // 更换日期
        ConsumablesName: '', // 易耗品名称
        Model: '', // 规格型号
        Unit: '', // 单位
        Num: '', // 数量
        ReplaceSuggestion: '', // 更换原因说明
      },
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '易耗品更换记录表',
    });
    this.initState();
  }

  // 初始化表单数据
  initState = () => {
    const {record} = this.props.route.params.params;
    if (record) {
      this.setState({
        formData: {
          ...record.Data,
        },
      });
    }
  };


  onSubmit = () => {
    const {formData, imageList1, imageList2} = this.state;
    // 表单验证
    if (!formData.ReplaceDate) {
      ShowToast('请选择更换日期');
      return;
    }
    if (!formData.ConsumablesName) {
      ShowToast('请输入易耗品名称');
      return;
    }
    if (!formData.Model) {
      ShowToast('请输入规格型号');
      return;
    }
    if (!formData.Unit) {
      ShowToast('请输入单位');
      return;
    }
    if (!formData.Num) {
      ShowToast('请输入数量');
      return;
    }
    if (!formData.ReplaceSuggestion) {
      ShowToast('请输入更换原因说明');
      return;
    }

    this.setState({loading: true});

    // 将 onOK 包装成 Promise
    new Promise((resolve, reject) => {
      try {
        this.props.route.params.params.onOK(
          {
            ...formData,
          },
          resolve,
        );
      } catch (error) {
        reject(error);
      }
    })
      .then(() => {
        // 接口请求成功后执行
        this.setState({loading: false});
        this.props.navigation.goBack();
      })
      .catch(error => {
        // 接口请求失败处理
        this.setState({loading: false});
        ShowToast('提交失败，请重试');
        console.error('提交表单失败:', error);
      });
  };

  // 删除记录
  onDelete = () => {
    this.setState({loading: true});
    const {ID} = this.state.formData;

    this.props.dispatch(
      createAction('patrolModel/DeleteRecord')({
        actionType: 'DeletetConsumablesReplaceRecordBWById',
        params: {id: ID},
        callback: result => {
          this.setState({loading: false});
          if (result.status == 200) {
            ShowToast('删除成功');
            this.props.route.params.params.onDelete();
            this.props.navigation.goBack();
          }
        },
      }),
    );
  };

  render() {
    const {formData,} = this.state;
    const {recordIndex} = this.props.route.params.params;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formSection}>
          <FormDatePicker
                label="更换日期"
                required={true}
                disabled={true}
                timeString={
                  formData.ReplaceDate
                    ? moment(formData.ReplaceDate).format('YYYY-MM-DD')
                    : '请选择更换日期'
                }
                getPickerOption={() => ({
                  type: 'day',
                  onSureClickListener: date => {
                    this.setState(prevState => ({
                      formData: {
                        ...prevState.formData,
                        ReplaceDate: moment(date).format('YYYY-MM-DD'),
                      },
                    }));
                  },
                })}
              />
            <FormInput
              label="易耗品名称"
              required={true}
              value={formData.ConsumablesName}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, ConsumablesName: text},
                }));
              }}
            />
          
        
         
            <FormInput
              label="规格型号"
              required={true}
              value={formData.Model}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, Model: text},
                }));
              }}
            />
            <FormInput
              label="单位"
              required={true}
              value={formData.Unit}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, Unit: text},
                }));
              }}
            />
            <FormInput
              label="数量"
              required={true}
              value={formData.Num}
              keyboardType={
                Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              placeholder="请输入"
              onChangeText={text => {
                // 只允许输入正整数（不包括负号和小数点）
                const newText = text.replace(/[^0-9]/g, ''); // 移除所有非数字字符
                this.setState(prevState => ({
                  formData: {...prevState.formData, Num: newText},
                }));
              }}
            />
        
            <FormTextArea
              label="更换原因说明"
              required={true}
              labelStyle={{color: globalcolor.taskFormLabel, fontSize: 14}}
              value={formData.ReplaceSuggestion}
              onChangeText={value =>
                this.setState(prevState => ({
                  formData: {...prevState.formData, ReplaceSuggestion: value},
                }))
              }
              placeholder="请输入"
              areaHeight={20}
              numberOfLines={2}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={this.onSubmit}>
            <Image
              style={styles.buttonIcon}
              source={require('../../../../../images/icon_submit.png')}
            />
            <Text style={styles.buttonText}>提交表单</Text>
          </TouchableOpacity>
          {this.state.formData.ID && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={this.onDelete}>
              <Text style={styles.buttonText}>删除表单</Text>
            </TouchableOpacity>
          )}
        </View>

        {this.state.loading && <SimpleLoadingComponent message="加载中..." />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalcolor.backgroundGrey,
  },
  scrollView: {
    flex: 1,
  },
  formSection: {
    backgroundColor: '#fff',
    // marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  imageTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 4,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 6,
  },
  submitButton: {
    backgroundColor: globalcolor.blue,
    // width: SCREEN_WIDTH - 40,
  },
  deleteButton: {
    backgroundColor: globalcolor.red,
    marginLeft: 12,
  },
  buttonIcon: {
    width: 18,
    height: 16,
    tintColor: '#fff',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default ConsumableReplaceForm;
