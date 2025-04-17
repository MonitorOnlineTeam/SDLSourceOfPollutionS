/*
 * @Author: JiaQi
 * @Date: 2025-04-02 16:00:00
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-17 16:44:21
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
import {SimpleLoadingComponent, AlertDialog} from '../../../../../components';
import FormDatePicker from '../../components/FormDatePicker';
import FormInput from '../../components/FormInput';
import FormPicker from '../../components/FormPicker';
import FormTextArea from '../../components/FormTextArea';
import ImageGrid from '../../../../../components/form/images/ImageGrid';
import FormText from '../../components/FormText';

@connect(({patrolModel}) => ({
  editstatus: patrolModel.editstatus,
}))
class RMR_Form extends Component {
  constructor(props) {
    super(props);
    const {PollutantList} = props.route.params.params;
    this.state = {
      loading: false,
      formData: {
        ID: '', // 主键ID
        StandardGasCode: '', // 标准物质编码
        StandardGasCodeName: '', // 标准物质编码名称，用于显示
        StandardGasName: '', // 标准物质名称, 选择其他的时候使用
        StandardGasDensity: '', // 浓度
        LastDate: '', // 上次更换日期
        ReplaceDate: '', // 更换日期
        ChangeBTime: '', // 本次更换开始日期
        ChangeETime: '', // 本次更换结束日期
        StandardGasModel: '', // 气瓶编号
        Unit: '', // 单位
        Num: '', // 数量
        Supplier: '', // 供应商
        Volume: '', // 体积
        ChangeDescribe: '', // 更换情况说明
        ExpirationDate: '', // 有效日期至
        BeforeChange: new Date().getTime() + 'beforeChange', // 更换前照片
        AfterChange: new Date().getTime() + 'afterChange', // 更换后照片
        Density: '', // 中高低浓度
      },
      standardNameOptions: PollutantList,
      imageList1: [],
      imageList2: [],
      isEditLastDate: false, // 是否可以编辑上次更换日期
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
    console.log('record11', record);
    if (record) {
      this.setState({
        formData: {
          ...record.Data,
          StandardGasCodeName: record.StandardGasCodeName,
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

  // 计算上次更换日期和浓度中高低
  GetStandardGasRepalceLastDate = () => {
    const {StandardGasCode, StandardGasDensity} = this.state.formData;
    const {TaskID, TypeID} = this.props.route.params.params;
    if (!StandardGasDensity) {
      ShowToast('请输入浓度');
      return;
    }
    if (!StandardGasCode) {
      ShowToast('请选择标准物质名称');
      return;
    }
    this.props.dispatch(
      createAction('patrolModel/GetStandardGasRepalceLastDate')({
        params: {
          pollutantCode: StandardGasCode,
          standardGasDensity: StandardGasDensity,
          taskID: TaskID,
        },
        callback: result => {
          if (result.status == 200) {
            console.log('result', result);
            const {formData} = this.state;
            let data = result.data.Datas;
            // 三种情况：
            // 1. 选择其他，上次更换日期可以自己填写
            // 2. 非其他，如果接口返回中高低浓度，但是没返回时间，可以自己填写
            // 3. 非其他，如果接口没有返回中高低浓度（接口返回 null），提示浓度非法，不可自己填写，不能提交
            if (data && data.Density !== 3) {
              if (!data.LastDate) {
                ShowToast('未查询到上次更换日期，请手动填写！');
              }
              this.setState({
                isEditLastDate: true,
                formData: {
                  ...formData,
                  LastDate: data.LastDate,
                  Density: data.Density,
                },
              });
            } else {
              this.setState({
                isEditLastDate: false,
                formData: {
                  ...formData,
                  StandardGasDensity: '',
                  LastDate: '',
                  Density: data.Density,
                },
              });
              ShowToast('浓度非法，请重新填写');
            }
          }
        },
      }),
    );
  };

  // 处理标准物质选择变化
  handleStandardGasChange = item => {
    this.setState(
      prevState => ({
        formData: {
          ...prevState.formData,
          StandardGasCode: item.ChildID,
          StandardGasCodeName: item.Name,
        },
        isEditLastDate: item.ChildID === '820', // 标准物质编码为其他的时候，可以编辑上次更换日期
      }),
      () => {
        // 选择标准物质后，如果浓度已填写，且不是"其他"选项，则自动计算
        if (this.state.formData.StandardGasDensity && item.ChildID !== '820') {
          this.GetStandardGasRepalceLastDate();
        }
      },
    );
  };

  // 处理浓度变化
  handleDensityChange = text => {
    this.setState(prevState => ({
      formData: {...prevState.formData, StandardGasDensity: text},
    }));
  };

  // 处理浓度输入框失去焦点
  handleDensityBlur = () => {
    const {StandardGasCode, StandardGasDensity} = this.state.formData;
    // 只有在标准物质已选择、浓度已填写，且标准物质不是"其他"时才计算
    if (StandardGasCode && StandardGasDensity && StandardGasCode !== '820') {
      this.GetStandardGasRepalceLastDate();
    }
  };

  onSubmit = () => {
    const {formData, imageList1, imageList2} = this.state;
    // 表单验证
    if (!formData.StandardGasCode) {
      ShowToast('请选择标准物质名称');
      return;
    }
    if (formData.StandardGasCode === '820' && !formData.StandardGasName) {
      ShowToast('请输入标准物质名称');
      return;
    }
    if (!formData.StandardGasDensity) {
      ShowToast('请输入浓度');
      return;
    }
    if (!formData.LastDate) {
      ShowToast('请选择上次更换日期');
      return;
    }
    if (!formData.ChangeBTime) {
      ShowToast('请选择本次更换开始时间');
      return;
    }
    if (!formData.ChangeETime) {
      ShowToast('请选择本次更换结束时间');
      return;
    }
    if (!formData.StandardGasModel) {
      ShowToast('请输入气瓶编号');
      return;
    }
    // if (!formData.Unit) {
    //   ShowToast('请输入单位');
    //   return;
    // }
    if (!formData.Num) {
      ShowToast('请输入数量');
      return;
    }
    if (!formData.Volume) {
      ShowToast('请输入体积');
      return;
    }
    if (!formData.ExpirationDate) {
      ShowToast('请选择有效日期至');
      return;
    }
    if (!formData.ChangeDescribe) {
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
    this.refs.doAlert.show();
  };

  // 执行删除操作
  doDeleteRecord = () => {
    this.setState({loading: true});
    const {ID} = this.state.formData;

    this.props.dispatch(
      createAction('patrolModel/DeleteRecord')({
        actionType: 'DeletetStandardGasRepalceRecordZBById',
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
            <View style={styles.formGroup}>
              <FormPicker
                label="标准物质"
                required={true}
                defaultCode={formData.StandardGasCode}
                option={{
                  codeKey: 'ChildID',
                  nameKey: 'Name',
                  defaultCode: formData.StandardGasCode,
                  dataArr: this.state.standardNameOptions,
                  onSelectListener: this.handleStandardGasChange,
                }}
                showText={formData.StandardGasCodeName}
                placeHolder="请选择"
              />
              {
                // 标准物质编码为其他的时候，显示标准物质名称
                formData.StandardGasCode === '820' && (
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
                )
              }
              <FormInput
                label="浓度"
                required={true}
                placeholder="请填写"
                keyboardType={
                  Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
                }
                value={formData.StandardGasDensity}
                onChangeText={this.handleDensityChange}
                onBlur={this.handleDensityBlur}
              />
            </View>
          </View>
          <View style={styles.formSection}>
            {true ? (
              <FormDatePicker
                label="上次更换日期"
                required={true}
                disabled={true}
                timeString={
                  formData.LastDate
                    ? moment(formData.LastDate).format('YYYY-MM-DD')
                    : '请选择上次更换日期'
                }
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
            ) : (
              <FormText
                label="上次更换日期"
                required={true}
                showString={
                  formData.LastDate
                    ? moment(formData.LastDate).format('YYYY-MM-DD')
                    : '请点击计算按钮'
                }
              />
            )}

            <FormDatePicker
              label="本次更换开始时间"
              required={true}
              timeString={formData.ChangeBTime || '请选择开始时间'}
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
              label="本次更换结束时间"
              required={true}
              timeString={formData.ChangeETime || '请选择结束时间'}
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
              label="气瓶编号"
              required={true}
              value={formData.StandardGasModel}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, StandardGasModel: text},
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
              label="供应商"
              value={formData.Supplier}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, Supplier: text},
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
              label="体积"
              required={true}
              keyboardType={
                Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'
              }
              value={formData.Volume}
              placeholder="请输入"
              onChangeText={text => {
                this.setState(prevState => ({
                  formData: {...prevState.formData, Volume: text},
                }));
              }}
            />
            <FormDatePicker
              label="有效日期至"
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
            <FormTextArea
              label="更换情况说明"
              required={true}
              labelStyle={{color: globalcolor.taskFormLabel, fontSize: 14}}
              value={formData.ChangeDescribe}
              onChangeText={value =>
                this.setState(prevState => ({
                  formData: {...prevState.formData, ChangeDescribe: value},
                }))
              }
              placeholder="请输入"
              areaHeight={20}
              numberOfLines={2}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.imageTitle}>
              <Text style={[{color: 'red'}]}>*</Text>标准气体更换前：
            </Text>
            <ImageGrid
              componentType={'normalWaterMaskCamera'}
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
              <Text style={[{color: 'red'}]}>*</Text>标准气体更换后：
            </Text>
            <ImageGrid
              componentType={'normalWaterMaskCamera'}
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
        
        <AlertDialog
          ref="doAlert"
          options={{
            headTitle: '提示',
            messText: '是否确定要删除此表单吗？',
            headStyle: {
              backgroundColor: globalcolor.headerBackgroundColor,
              color: '#ffffff',
              fontSize: 18,
            },
            buttons: [
              {
                txt: '取消',
                btnStyle: { backgroundColor: 'transparent' },
                txtStyle: { color: globalcolor.headerBackgroundColor },
                onpress: () => { },
              },
              {
                txt: '确定',
                btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                txtStyle: { color: '#ffffff' },
                onpress: this.doDeleteRecord,
              },
            ],
          }}
        />
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
