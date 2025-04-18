/*
 * @Author: JiaQi
 * @Date: 2025-04-02 10:51:04
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-17 15:32:14
 * @Description:  标准物质更换记录表
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

@connect(({patrolModel}) => ({
  editstatus: patrolModel.editstatus,
  workTimeStart: patrolModel.workTimeStart,
  workTimeEnd: patrolModel.workTimeEnd,
}))
class RMR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FormMainID: props.route.params.params.FormMainID,
      loading: false,
      Content: {
        WorkingDateBegin: moment().format('YYYY-MM-DD 00:00:00'),
        WorkingDateEnd: moment().format('YYYY-MM-DD 23:59:59'),
      },
      standardList: [],
      PollutantList: [],
      signContent: '',
      signTime: '',
    };

    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            this.jumpToRMRForm({});
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
  jumpToRMRForm = params => {
    const {TaskID, TypeID, ID} = this.props.route.params.params;
    this.props.navigation.navigate('RMRForm', {
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
    const {Content, standardList, signContent} = this.state;
    const {TaskID, TypeID, ID} = this.props.route.params.params;

    let body = {
      id: ID,
      taskID: TaskID,
      typeID: TypeID,
      content: Content,
      recordList: [record],
      signContent: signContent,
    };
    this.props.dispatch(
      createAction('patrolModel/AddOrUpdateRecord')({
        actionType: 'AddOrUpdateStandardGasRepalceRecordZB',
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
        actionType: 'GetStandardGasRepalceRecordZB',
        params: {
          taskID: TaskID,
          typeID: TypeID,
        },
        callback: result => {
          if (result.status == 200) {
            let res = result.data.Datas?.[0] || {};
            const RecordList = res?.RecordList || {};
            const Main = res?.Main || {};
            this.setState({
              FormMainID: Main?.ID || '',
              Content: Main?.Content || this.state.Content,
              standardList: RecordList || this.state.standardList,
              signContent: Main?.SignContent || '',
              signTime: Main?.SignTime || '',
              PollutantList: res?.PollutantList || [],
            });
          }
          this.setState({loading: false});
        },
      }),
    );
  };

  // 提交记录
  onSubmit = () => {
    const {TaskID, TypeID, ID} = this.props.route.params.params;
    const {Content, standardList, signContent, signTime} = this.state;

    if (!Content.WorkingDateBegin) {
      ShowToast('请选择工作时间');
      return;
    }
    if (!Content.WorkingDateEnd) {
      ShowToast('请选择结束时间');
      return;
    }
    if (!standardList.length) {
      ShowToast('请添加标准物质更换记录');
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
      signContent: signContent,
      signTime: signTime,
    };

    this.props.dispatch(
      createAction('patrolModel/AddOrUpdateRecord')({
        actionType: 'SubmitStandardGasRepalceRecordZB',
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
        actionType: 'DeletetStandardGasRepalceRecordZB',
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

  // 处理签名完成
  handleSignature = signature => {
    this.setState({
      signContent: signature,
      signTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  // 处理签名取消
  handleSignatureCancel = () => {
    this.props.navigation.goBack();
  };

  // 打开签名页面
  openSignaturePage = () => {
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'SignaturePage',
        params: {
          onOK: this.handleSignature,
          onCancel: this.handleSignatureCancel,
          signature: this.state.signContent,
        },
      }),
    );
  };

  // 渲染时间选择部分
  renderTimeSection = () => {
    const {Content} = this.state;
    return (
      <View
        style={[
          {
            // width: SCREEN_WIDTH - 24,
            alignItems: 'center',
            backgroundColor: globalcolor.white,
            // marginHorizontal: 12,
            paddingHorizontal: 6,
            marginTop: 0,
            borderRadius: 4,
          },
        ]}>
        <FormDatePicker
          required={true}
          getPickerOption={() => ({
            defaultTime: Content.WorkingDateBegin,
            type: 'minute',
            onSureClickListener: time => {
              this.setState(prevState => ({
                Content: {
                  ...prevState.Content,
                  WorkingDateBegin: time,
                },
              }));
            },
          })}
          label={'工作时间'}
          timeString={moment(Content.WorkingDateBegin).format(
            'YYYY-MM-DD HH:mm:ss',
          )}
        />
        <FormDatePicker
          required={true}
          getPickerOption={() => ({
            defaultTime: Content.WorkingDateEnd,
            type: 'minute',
            onSureClickListener: time => {
              this.setState(prevState => ({
                Content: {
                  ...prevState.Content,
                  WorkingDateEnd: time,
                },
              }));
            },
          })}
          label={'结束时间'}
          timeString={moment(Content.WorkingDateEnd).format(
            'YYYY-MM-DD HH:mm:ss',
          )}
          last={true}
        />
      </View>
    );
  };

  // 渲染标准物质列表项
  renderStandardItem = ({item, index}) => {
    let record = item.Data || {};
    return (
      <TouchableOpacity
        onPress={() => {
          this.jumpToRMRForm({
            record: item,
          });
        }}>
        <View style={styles.standardItem}>
          <View style={styles.standardContent}>
            <View style={styles.standardRow}>
              <Text style={styles.label}>供应商：</Text>
              <Text style={styles.value}>{record.Supplier || '-'}</Text>
            </View>
            <View style={styles.standardRow}>
              <View style={{...styles.standardRowItem, flex: 2}}>
                <Text style={styles.label}>标准物质名称：</Text>
                <Text style={styles.value}>{item.StandardGasCodeName}</Text>
              </View>
              <View
                style={{...styles.standardRowItem, flex: 1, paddingLeft: 8}}>
                <Text style={[styles.label, {width: 42}]}>单位：</Text>
                <Text style={styles.value}>{record.Unit || '-'}</Text>
              </View>
            </View>
            <View style={styles.standardRow}>
              <View style={{...styles.standardRowItem, flex: 2}}>
                <Text style={styles.label}>气瓶编号：</Text>
                <Text style={styles.value}>{record.StandardGasModel}</Text>
              </View>
              <View
                style={{...styles.standardRowItem, flex: 1, paddingLeft: 8}}>
                <Text style={[styles.label, {width: 42}]}>数量：</Text>
                <Text style={styles.value}>{record.Num}</Text>
              </View>
            </View>
            <View
              style={{
                height: 1,
                marginVertical: 6,
                backgroundColor: globalcolor.borderBottomColor,
                marginBottom: 10,
              }}></View>
            <View style={styles.standardRow}>
              <Text style={styles.label}>更换日期：</Text>
              <Text style={styles.value}>
                {moment(record.ReplaceDate).format('YYYY-MM-DD')}
              </Text>
            </View>
            <View style={styles.standardRow}>
              <Text style={styles.label}>有效日期：</Text>
              <Text style={styles.value}>
                {moment(record.ExpirationDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {FormMainID, loading, standardList} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>{this.renderTimeSection()}</View>
        <View style={styles.listContainer}>
          <FlatList
            data={standardList}
            renderItem={this.renderStandardItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={() => {
              return (
                <>
                  {!standardList.length ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.jumpToRMRForm({});
                      }}>
                      <View style={styles.signatureContainer}>
                        <Text style={styles.signaturePlaceholder}>
                          点击此处或右上角 + 添加标准物质更换记录
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    ''
                  )}
                  <Text
                    style={{
                      color: globalcolor.textBlack,
                      fontSize: 14,
                      marginTop: 8,
                      marginLeft: 12,
                    }}>
                    签名
                  </Text>
                  <TouchableOpacity
                    style={styles.signatureContainer}
                    onPress={this.openSignaturePage}>
                    {this.state.signContent ? (
                      <Image
                        source={{uri: this.state.signContent}}
                        style={styles.signaturePreview}
                      />
                    ) : (
                      <Text style={styles.signaturePlaceholder}>
                        点击此处签名
                      </Text>
                    )}
                  </TouchableOpacity>
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
    marginBottom: 8,
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

export default RMR;
