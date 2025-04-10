/*
 * @Author: JiaQi
 * @Date: 2025-04-02 16:00:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-07 17:09:13
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
        LastDate: '', // 上次更换日期
        ReplaceDate: '', // 更换日期
        ChangeBTime: '', // 本次更换开始日期
        ChangeETime: '', // 本次更换结束日期
        ConsumablesName: '', // 易耗品名称
        Model: '', // 规格型号
        Unit: '', // 单位
        Num: '', // 数量
        SuggestionDate: '', // 说明书建议周期
        ReplaceSuggestion: '', // 更换情况说明
        BeforeChange: new Date().getTime() + 'beforeChange', // 更换前照片
        AfterChange: new Date().getTime() + 'afterChange', // 更换后照片
      },
      standardNameOptions: PollutantList,
      imageList1: [],
      imageList2: [],
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
    console.log('record11', record);
    if (record) {
      this.setState({
        formData: {
          ...record.Data,
        },
        imageList1:
          record.BeforeChange_PIC?.ImgNameList.map(item => ({
            AttachID: item,
          })) || [],
        imageList2:
          record.AfterChange_PIC?.ImgNameList.map(item => ({
            AttachID: item,
          })) || [],
      });
    }
  };

  onSubmit = () => {
    const {formData, imageList1, imageList2} = this.state;
    // 表单验证
    if (!formData.ConsumablesName) {
      ShowToast('请输入易耗品名称');
      return;
    }
    if (!formData.LastDate) {
      ShowToast('请选择上次更换日期');
      return;
    }
    if (!formData.ChangeBTime) {
      ShowToast('请选择本次更换开始日期');
      return;
    }
    if (!formData.ChangeETime) {
      ShowToast('请选择本次更换结束日期');
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
      ShowToast('请输入更换情况说明');
      return;
    }
    if (imageList1.length === 0) {
      ShowToast('请上传更换前照片');
      return;
    }
    if (imageList2.length === 0) {
      ShowToast('请上传更换后照片');
      return;
    }

    this.setState({loading: true});

    // 将 onOK 包装成 Promise
    new Promise((resolve, reject) => {
      try {
        this.props.route.params.params.onOK(
          {
            ...formData,
            ReplaceDate: formData.ChangeBTime,
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
        actionType: 'DeletetConsumablesReplaceRecordZBById',
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
    const {formData, imageList1, imageList2, isEditLastDate} = this.state;
    const {recordIndex} = this.props.route.params.params;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.formSection}>
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
            <FormDatePicker
              label="上次更换日期"
              required={true}
              disabled={true}
              timeString={formData.LastDate || '请选择上次更换日期'}
              getPickerOption={() => ({
                type: 'day',
                onSureClickListener: date => {
                  this.setState(prevState => ({
                    formData: {
                      ...prevState.formData,
                      LastDate: moment(date).format('YYYY-MM-DD'),
                    },
                  }));
                },
              })}
            />
            <FormDatePicker
              label="本次更换开始日期"
              required={true}
              timeString={formData.ChangeBTime || '请选择开始日期'}
              getPickerOption={() => ({
                type: 'realtime',
                onSureClickListener: date => {
                  this.setState(prevState => ({
                    formData: {
                      ...prevState.formData,
                      ChangeBTime: moment(date).format('YYYY-MM-DD HH:mm:ss'),
                    },
                  }));
                },
              })}
            />
            <FormDatePicker
              label="本次更换结束日期"
              required={true}
              timeString={formData.ChangeETime || '请选择结束日期'}
              getPickerOption={() => ({
                type: 'realtime',
                onSureClickListener: date => {
                  this.setState(prevState => ({
                    formData: {
                      ...prevState.formData,
                      ChangeETime: moment(date).format('YYYY-MM-DD HH:mm:ss'),
                    },
                  }));
                },
              })}
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
              label="说明书建议周期"
              required={true}
              value={formData.SuggestionDate}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, SuggestionDate: text},
                }));
              }}
            />
            <FormTextArea
              label="更换情况说明"
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

          <View style={styles.formSection}>
            <Text style={styles.imageTitle}>
              <Text style={[{color: 'red'}]}>*</Text>易耗品更换前：
            </Text>
            <ImageGrid
              componentType={'taskhandle'}
              style={{
                backgroundColor: '#fff',
              }}
              Imgs={imageList1}
              isUpload={true}
              isDel={true}
              UUID={formData.BeforeChange}
              uploadCallback={items => {
                let newImgList = [...imageList1];
                items.map(imageItem => {
                  newImgList.push(imageItem);
                });
                this.setState({imageList1: newImgList});
              }}
              delCallback={index => {
                let newImgList = [...imageList1];
                newImgList.splice(index, 1);
                this.setState({imageList1: newImgList});
              }}
            />
          </View>
          <View style={[styles.formSection, {marginBottom: 80}]}>
            <Text style={styles.imageTitle}>
              <Text style={[{color: 'red'}]}>*</Text>易耗品更换后：
            </Text>
            <ImageGrid
              componentType={'taskhandle'}
              style={{
                backgroundColor: '#fff',
              }}
              Imgs={imageList2}
              isUpload={true}
              isDel={true}
              UUID={formData.AfterChange}
              uploadCallback={items => {
                console.log('items', items);
                let newImgList = [...imageList2];
                items.map(imageItem => {
                  newImgList.push(imageItem);
                });
                this.setState({imageList2: newImgList});
              }}
              delCallback={index => {
                let newImgList = [...imageList2];
                newImgList.splice(index, 1);
                this.setState({imageList2: newImgList});
              }}
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
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
