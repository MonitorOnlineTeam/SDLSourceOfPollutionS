/*
 * @Author: jab
 * @Date: 2025-04-02 10:51:04
 * @Last Modified by: jab
 * @Last Modified time: 2025-04-07 16:24:04
 * @Description:  废气、废水易耗品更换记录
 */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import globalcolor from '../../../../../config/globalcolor';
import {SCREEN_WIDTH} from '../../../../../config/globalsize';
import {
  ShowToast,
  createAction,
  NavigationActions,
  SentencedToEmpty,
} from '../../../../../utils';
import {
  SimpleLoadingComponent,
  DeclareModule,
  StatusPage,
  SelectButton,
  AlertDialog,
} from '../../../../../components';
import FormTextArea from '../../components/FormTextArea';
import FormDatePicker from '../../components/FormDatePicker';
import ImageGrid from '../../../../../components/form/images/ImageGrid';
import MaintenanceOpera from './components/MaintenanceOpera';//维护单位和运维人员组件
import ImageSignature from './components/ImageSignature';//上传图片和运维人员签字组件
@connect(({patrolModel}) => ({
  editstatus: patrolModel.editstatus,
  workTimeStart: patrolModel.workTimeStart,
  workTimeEnd: patrolModel.workTimeEnd,
}))
class ConsumableReplace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FormMainID: props.route.params.params.FormMainID,
      loading: false,
      Content: {
      },
      standardList: [],
      maintenanceManageUnit: '',
      operationPerson: '',
      uploadPicture: new Date().getTime(),
      imageList: [],
      signContent: '',
      signTime: '',
    };
    const {PollutantType} = props.route.params.params;
    props.navigation.setOptions({
      title: PollutantType == 1 ? '废水易耗品更换记录' : '废气易耗品更换记录',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.jumpToForm({});
          }}>
          <Image
            source={require('../../../../../images/jiarecord.png')}
            style={{width: 18, height: 18, marginRight: 16}}
          />
        </TouchableOpacity>
      ),
    });
  }

  componentDidMount() {
    // 获取记录数据
    this.GetAllRecord();
  }

  // 跳转添加、修改记录
  jumpToForm = params => {
    const {TaskID, TypeID, ID} = this.props.route.params.params;
    this.props.navigation.navigate('ConsumableReplaceForm_BW', {
      params: {
        TaskID: TaskID,
        TypeID: TypeID,
        PollutantList: this.state.PollutantList,
        onOK: this.onOK,
        onDelete: this.GetAllRecord,
        ...params,
      },
    });
  };

  // 添加、修改记录
  onOK = (record, resolve) => {
    const { Content, standardList,maintenanceManageUnit,operationPerson,uploadPicture, signContent,signTime } = this.state;
    const {TaskID, TypeID, ID} = this.props.route.params.params;

    let body = {
      id: ID,
      taskID: TaskID,
      typeID: TypeID,
      content: Content,
      recordList: [record],
      maintenanceManageUnit: maintenanceManageUnit,
      operationPerson: operationPerson,
      uploadPicture: uploadPicture,
      signContent: signContent,
      signTime: signTime,
    };
    this.props.dispatch(
      createAction('patrolModel/AddOrUpdateRecord')({
        actionType: 'AddOrUpdateConsumablesReplaceRecordBW',
        params: body,
        callback: result => {
          if (result.status == 200) {
            if (!standardList?.length) {
              this.props.dispatch(
                createAction('taskDetailModel/updateFormStatus')({
                  cID: TypeID,
                  isAdd: true,
                }),
              );
            }
            ShowToast('提交成功');
            this.GetAllRecord();
            // 如果提供了 resolve 函数，则调用它
            if (resolve && typeof resolve === 'function') {
              resolve();
            }
          } else {
            // 如果提供了 resolve 函数，则调用它并传递错误
            if (resolve && typeof resolve === 'function') {
              resolve(new Error('提交失败'));
            }
          }
        },
      }),
    );
  };

  // 获取记录数据
  GetAllRecord = () => {
    this.setState({loading: true});
    const {TaskID, TypeID} = this.props.route.params.params;
    this.props.dispatch(
      createAction('patrolModel/GetAllRecord')({
        actionType: 'GetConsumablesReplaceRecordBW',
        params: {
          taskID: TaskID,
          typeID: TypeID,
        },
        callback: result => {
          if (result.status == 200) {
            let res = result.data.Datas?.[0] || {};
            const Main = res?.Main || {};
            const RecordList = res?.RecordList || [];
            this.setState({
              FormMainID: Main?.ID || '',
              Content: Main?.Content || this.state.Content,
              standardList: RecordList || this.state.standardList,
              maintenanceManageUnit:  Main?.MaintenanceManageUnit || '',
              operationPerson:  Main?.OperationPerson || '',
              uploadPicture: Main?.UploadPicture || this.state.uploadPicture,
              imageList: Main.AttachmentViewModel?.ImgNameList.map(item => ({
                AttachID: item,
              })) || [],
              signContent: Main?.SignContent || '',
              signTime: Main?.SignTime || '',
            });
          }
          this.setState({loading: false});
        },
      }),
    );
  };

  // 提交记录
  onSubmit = () => {
    const { TaskID, TypeID, ID} = this.props.route.params.params;
    const { Content, maintenanceManageUnit, operationPerson,standardList,uploadPicture, imageList, signContent, signTime } = this.state;

    if (!maintenanceManageUnit) {
      ShowToast('请输入维护管理单位');
      return;
    }
    if (!operationPerson) {
      ShowToast('请选择运维人');
      return;
    }
    if (!standardList.length) {
      ShowToast('请添加易耗品更换记录');
      return;
    }

    if (imageList.length === 0) {
      ShowToast('请上传图片');
      return;
    }
    if (!signContent) {
      ShowToast('请签名');
      return;
    }
    this.setState({loading: true});
    let body = {
      id: ID,
      taskID: TaskID,
      typeID: TypeID,
      content: Content,
      maintenanceManageUnit: maintenanceManageUnit,
      operationPerson: operationPerson,
      uploadPicture: uploadPicture,
      signContent: signContent,
      signTime: signTime,
    };

    this.props.dispatch(
      createAction('patrolModel/AddOrUpdateRecord')({
        actionType: 'SubmitConsumablesReplaceRecordBW',
        params: body,
        callback: result => {
          if (result.status == 200) {
            this.props.dispatch(
              createAction('taskDetailModel/updateFormStatus')({
                cID: TypeID,
                isAdd: true,
              }),
            );
            this.props.navigation.goBack();
            ShowToast('提交成功');
          }
          this.setState({loading: false});
        },
      }),
    );
  };

  // 删除记录
  onDeleteRecord = () => {
    this.setState({loading: true});
    const {FormMainID} = this.state;
    const {TypeID} = this.props.route.params.params;

    this.props.dispatch(
      createAction('patrolModel/DeleteRecord')({
        actionType: 'DeletetConsumablesReplaceRecordBW',
        params: {formMainID: FormMainID},
        callback: result => {
          this.setState({loading: false});
          if (result.status == 200) {
            ShowToast('删除成功');
            this.props.dispatch(
              createAction('taskDetailModel/updateFormStatus')({
                cID: TypeID,
                isAdd: false,
              }),
            );
            this.props.navigation.goBack();
          }
        },
      }),
    );
  };

  // 显示删除确认框
  showDeleteConfirm = () => {
    this.refs.doAlert.show();
  };




  // 渲染易耗品列表项
  renderStandardItem = ({item, index}) => {
    console.log('record', record);
    let record = item.Data || {};
    return (
      <TouchableOpacity
        onPress={() => {
          this.jumpToForm({
            record: item,
          });
        }}>
        <View style={styles.standardItem}>
          <View style={styles.standardContent}>
            <View style={styles.standardRow}>
              <Text style={styles.label}>更换日期：</Text>
              <Text style={styles.value}>
                {moment(record.ReplaceDate).format('YYYY-MM-DD')}
              </Text>
            </View>
            <View style={styles.standardRow}>
              <Text style={styles.label}>标准物质名称：</Text>
              <Text style={styles.value}>{item.ConsumablesName}</Text>
            </View>
            <View style={styles.standardRow}>
              <Text style={styles.label}>规格型号：</Text>
              <Text style={styles.value}>{record.Model}</Text>
            </View>
            <View style={styles.standardRow}>
              <Text style={styles.label}>单位：</Text>
              <Text style={styles.value}>{record.Unit}</Text>
            </View>

            <View style={styles.standardRow}>
              <Text style={styles.label}>数量：</Text>
              <Text style={styles.value}>{record.Num}</Text>
            </View>
            <View style={[styles.standardRow,{marginBottom:0}]}>
              <Text style={styles.label}>更换原因说明：</Text>
              <Text style={styles.value}>{record.ReplaceSuggestion}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { FormMainID, loading, standardList, maintenanceManageUnit, operationPerson, } = this.state;
    return (
      <View style={styles.container}>
        <MaintenanceOpera
          {...this.props}
          maintenanceManageUnit={maintenanceManageUnit}
          unitChange={(text) => {
            this.setState({ maintenanceManageUnit: text })
          }}
          operationPerson={operationPerson}
          userChange={(userName) => {
            this.setState({ operationPerson: userName })
          }}
        />
        <View style={styles.listContainer}>
          <FlatList
            data={standardList}
            renderItem={this.renderStandardItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 70 }} // 按钮纵向的空间
            ListFooterComponent={() => {
              return (
                <>
                  {!standardList.length ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.jumpToForm({});
                      }}>
                      <View style={styles.signatureContainer}>
                        <Text style={styles.signaturePlaceholder}>
                          点击此处或右上角 + 添加易耗品更换记录
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    ''
                  )}
                    <ImageSignature
                    {...this.props}
                    signContent={this.state.signContent}
                    handleSignatureCallback={(signature,signTime) => {
                      this.setState({signContent: signature,signTime: signTime });
                    }}
                    uuid={this.state.uploadPicture}
                    imageList={this.state.imageList}
                    uploadCallback={(item) => {
                      this.setState({ imageList: item })
                    }}
                  />
                </>
              );
            }}
          />
        </View>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={() => {
              this.onSubmit();
            }}>
            <View style={styles.button}>
              <Image
                style={{
                  tintColor: globalcolor.whiteFont,
                  height: 16,
                  width: 18,
                }}
                resizeMode={'contain'}
                source={require('../../../../../images/icon_submit.png')}
              />
              <Text
                style={[
                  {color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8},
                ]}>
                确定提交
              </Text>
            </View>
          </TouchableOpacity>
          {FormMainID && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={this.showDeleteConfirm}>
              <Text style={styles.buttonText}>删除表单</Text>
            </TouchableOpacity>
          )}
        </View>
        {loading && <SimpleLoadingComponent message={'加载中...'} />}
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
                btnStyle: {backgroundColor: 'transparent'},
                txtStyle: {color: globalcolor.headerBackgroundColor},
                onpress: () => {},
              },
              {
                txt: '确定',
                btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
                txtStyle: {color: '#ffffff'},
                onpress: this.onDeleteRecord,
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
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    backgroundColor: globalcolor.backgroundGrey,
  },
  formContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    marginBottom: 6,
  },
  listContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: globalcolor.backgroundGrey,
    paddingVertical: 2,
    marginBottom: 64, // 为底部按钮留出空间
  },
  standardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginTop:8,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: 12,
  },
  standardContent: {
    borderRadius: 2,
    // padding: 8,
  },
  standardRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: SCREEN_WIDTH - 40,
    paddingRight: 8,
  },
  standardRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    // fontSize: 14,
    // color: '#666666',
    // width: 90,
  },
  value: {
    // fontSize: 14,
    // color: '#333333',
    color: globalcolor.textBlack,
    flex: 1,
  },
  signatureContainer: {
    width: SCREEN_WIDTH - 16,
    height: 80,
    backgroundColor: globalcolor.white,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signaturePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  signaturePlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  bottomButtonContainer: {
    width: SCREEN_WIDTH,
    height: 64,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    bottom: 0,
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
  buttonText: {
    color: globalcolor.whiteFont,
    fontSize: 15,
  },
});

export default ConsumableReplace;
