/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2025-04-15 12:01:45
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2025-04-17 17:21:01
 * @Description: 标准物质更换记录表单
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


@connect(({patrolModelBw}) => ({
  editstatus: patrolModelBw.editstatus,
}))
class RMR_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formData: {
        ID: '', // 主键ID
        ReplaceDate:'',
        StandardGasName: '', // 标准物质名称
        StandardGasDensity: '', // 浓度
        Unit: '', // 单位
        Num: '', // 数量
        Supplier: '', // 供应商
        ExpirationDate: '', // 有效日期
      },
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: '标准物质更换记录表',
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
    if (!formData.StandardGasName) {
      ShowToast('请输入标准物质名称');
      return;
    }
    if (!formData.StandardGasDensity) {
      ShowToast('请输入气体浓度');
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
    if (!formData.Supplier) {
      ShowToast('请输入供应商');
      return;
    }
    if (!formData.ExpirationDate) {
      ShowToast('请选择有效日期');
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
      createAction('patrolModelBw/DeleteRecord')({
        actionType: 'DeletetStandardGasRepalceRecordBWById',
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
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <View style={styles.formGroup}>
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
                    label="标准物质名称"
                    required={true}
                    value={formData.StandardGasName}
                    placeholder="请输入"
                    onChangeText={text => {
                      this.setState(prevState => ({
                        formData: {
                          ...prevState.formData,
                          StandardGasName: text,
                        },
                      }));
                    }}
                  />
              <FormInput
                label="气体浓度"
                required={true}
                placeholder="请填写"
                keyboardType={
                  Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
                }
                value={formData.StandardGasDensity}
                onChangeText={text => {
                  this.setState(prevState => ({
                    formData: {...prevState.formData, StandardGasDensity: text},
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
           
            <FormInput
              label="供应商"
              required={true}
              value={formData.Supplier}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, Supplier: text},
                }));
              }}
            />
          
          
            <FormDatePicker
              label="有效日期"
              required={true}
              timeString={
                formData.ExpirationDate
                  ? moment(formData.ExpirationDate).format('YYYY-MM-DD')
                  : '请选择有效日期'
              }
              getPickerOption={() => ({
                type: 'day',
                onSureClickListener: date => {
                  this.setState(prevState => ({
                    formData: {...prevState.formData, ExpirationDate: date},
                  }));
                },
              })}
            />
           
            </View>
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
  },
  formGroup: {
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

export default RMR_Form;
