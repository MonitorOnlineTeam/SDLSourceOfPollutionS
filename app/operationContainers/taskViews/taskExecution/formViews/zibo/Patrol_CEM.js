/*
 * @Author: JiaQi 
 * @Date: 2025-04-02 10:48:34 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2025-04-02 10:50:26
 * @Description: 5个 CEMS 日常巡检
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
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Signature from 'react-native-signature-canvas';
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
import FORM_CONST from './Patrol_Form_CONST';  
@connect(({patrolModel}) => ({
  editstatus: patrolModel.editstatus,
  workTimeStart: patrolModel.workTimeStart,
  workTimeEnd: patrolModel.workTimeEnd,
  maintenanceStartTime: patrolModel.maintenanceStartTime,
  maintenanceEndTime: patrolModel.maintenanceEndTime,
}))
class Patrol_CEM extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState();

    let title = '';
    switch (props.route.params.params.TypeID) {
      case 76:
        title = '完全抽取法 CEMS 日常巡检';
        break;
      case 77:
        title = '稀释采样法 CEMS 日常巡检';
        break;
      case 78:
        title = '直接测量法 CEMS 日常巡检';
        break;
      case 79:
        title = 'VOCs 日常巡检';
        break;
      case 80:
        title = '废水巡检维护';
        break;
    }
    props.navigation.setOptions({
      title: title,
    });
  }

  // 初始化状态
  initState = () => {
    const {ID, FormMainID} = this.props.route.params.params;
    let pic1Name, pic2Name;
    switch (ID) {
      case 76:
      case 77:
      case 78:
      case 79:
      case 80:
        // 完全抽取法,稀释采样法,直接测量法,VOCs,废水
        pic1Name = 'WHGGDYGZGCZP';
        pic2Name = 'ZFQJZP';
        break;
    }
    return {
      pic1Name,
      pic2Name,
      FormMainID,
      expandedSections: [],
      formData: {
        [pic1Name]: new Date().getTime() + pic1Name.toLowerCase(),
        [pic2Name]: new Date().getTime() + pic2Name.toLowerCase(),
      }, // 存储所有表单数据，包括选择项、输入框和文本域的值
      [pic1Name + '_PIC']: [],
      [pic2Name + '_PIC']: [],
      signContent: '', // 签名内容
      sections: FORM_CONST[ID],
      Content: {},
    };
  };

  componentDidMount() {
    this.GetAllRecord();
  }

  // 获取 CEMS 日常巡检  
  GetAllRecord = () => {
    this.setState({loading: true});
    const {TaskID, TypeID} = this.props.route.params.params;
    const {pic1Name, pic2Name} = this.state;

    let actionType = '';
    switch (TypeID) {
      case 76: // 完全抽取法
        actionType = 'GetAllExInspectionRecord';
        break;
      case 77: // 稀释采样法
        actionType = 'GetXSExInspectionRecord';
        break;
      case 78: // 直接测量法
        actionType = 'GetZJExInspectionRecord';
        break;
      case 79: // VOCs
        actionType = 'GetVOCsExInspectionRecord';
        break;
      case 80: // 废水
        actionType = 'GetFSExInspectionRecord';
        break;
    }
    this.props.dispatch(
      createAction('patrolModel/GetAllRecord')({
        actionType,
        params: {
          taskID: TaskID,
          typeID: TypeID,
        },
        callback: result => {
          if (result.status == 200) {
            let res = result.data.Datas?.[0] || {};
            const RecordList = res?.RecordList?.[0] || {};
            const Main = res?.Main || {};
            let formData = RecordList.Data || this.state.formData;
            if (RecordList[pic1Name]) {
              // 照片 1
              formData[pic1Name] = RecordList[pic1Name + '_PIC'].AttachID;
            }
            if (RecordList[pic2Name]) {
              // 照片 2
              formData[pic2Name] = RecordList[pic2Name + '_PIC'].AttachID;
            }
            this.setState(prevState => ({
              formData: formData,
              [pic1Name + '_PIC']:
                RecordList?.[pic1Name + '_PIC']?.ImgNameList.map(item => ({
                  AttachID: item,
                })) || [],
              [pic2Name + '_PIC']:
                RecordList?.[pic2Name + '_PIC']?.ImgNameList.map(item => ({
                  AttachID: item,
                })) || [],
              FormMainID: RecordList?.Data?.FormMainID || prevState.FormMainID, // 防止添加后，再次进入FormMainID是假的情况
              signContent: Main?.SignContent || '',
              signTime: Main?.SignTime || '',
              Content: Main?.Content || {},
            }));
          }
          this.setState({loading: false});
        },
      }),
    );
  };

  // 添加修改完全抽取法 CEMS 日常巡检
  onSubmit = () => {
    const {TaskID, ID, TypeID} = this.props.route.params.params;
    const {signContent, Content, formData, pic1Name, pic2Name} = this.state;

    if (!Content.MaintenanceBeginTime || !Content.MaintenanceEndTime) {
      ShowToast('请选择运行维护开始时间和结束时间');
      return;
    }
    if (!signContent) {
      ShowToast('请签名');
      return;
    }
    if (!formData[pic1Name].length || !formData[pic2Name].length) {
      ShowToast('请上传照片');
      return;
    }
    if (!formData.ExceptionRecord) {
      ShowToast('请填写异常情况处理记录');
      return;
    }

    this.setState({loading: true});
    let body = {
      id: ID,
      taskID: TaskID,
      typeID: TypeID,
      content: Content,
      recordList: [{...this.state.formData}],
      signContent: signContent,
    };
    console.log('body', body);
    let actionType = '';
    switch (TypeID) {
      case 76: // 完全抽取法
        actionType = 'AddOrUpdateAllExInspectionRecord';
        break;
      case 77: // 稀释采样法
        actionType = 'AddOrUpdateXSExInspectionRecord';
        break;
      case 78: // 直接测量法
        actionType = 'AddOrUpdateZJExInspectionRecord';
        break;
      case 79: // VOCs
        actionType = 'AddOrUpdateVOCsExInspectionRecord';
        break;
      case 80: // 废水
        actionType = 'AddOrUpdateFSExInspectionRecord';
        break;
    }
    // return;
    this.props.dispatch(
      createAction('patrolModel/AddOrUpdateRecord')({
        actionType,
        params: body,
        callback: result => {
          if (result.status == 200) {
            this.props.dispatch(
              createAction('taskDetailModel/updateFormStatus')({
                cID: TypeID,
                isAdd: true, // 添加
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

  // 删除完全抽取法 CEMS 日常巡检
  onDeleteRecord = () => {
    this.setState({loading: true});
    const {FormMainID} = this.state;
    const {TypeID} = this.props.route.params.params;
    let actionType = '';
    switch (TypeID) {
      case 76: // 完全抽取法
        actionType = 'DeleteAllExInspectionRecord';
        break;
      case 77: // 稀释采样法
        actionType = 'DeleteXSExInspectionRecord';
        break;
      case 78: // 直接测量法
        actionType = 'DeleteZJExInspectionRecord';
        break;
      case 79: // VOCs
        actionType = 'DeleteVOCsExInspectionRecord';
        break;
      case 80: // 废水
        actionType = 'DeleteFSExInspectionRecord';
        break;
    }
    this.props.dispatch(
      createAction('patrolModel/DeleteRecord')({
        actionType,
        params: {formMainID: FormMainID},
        callback: result => {
          this.setState({loading: false});
          if (result.status == 200) {
            ShowToast('删除成功');
            this.props.dispatch(
              createAction('taskDetailModel/updateFormStatus')({
                cID: TypeID,
                isAdd: false, // 删除
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

  // 点击展开/收起
  toggleSection = index => {
    const {expandedSections} = this.state;
    const isExpanded = expandedSections.includes(index);

    if (isExpanded) {
      this.setState({
        expandedSections: expandedSections.filter(i => i !== index),
      });
    } else {
      this.setState({
        expandedSections: [...expandedSections, index],
      });
    }
  };

  getMaintenanceStartTimeOption = () => {
    const {Content} = this.state;
    console.log('Content', Content);
    return {
      defaultTime: Content.MaintenanceBeginTime
        ? moment(Content.MaintenanceBeginTime).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      type: 'hour',
      onSureClickListener: time => {
        this.setState(prevState => ({
          Content: {
            ...prevState.Content,
            MaintenanceBeginTime: time,
          },
        }));
      },
    };
  };

  getMaintenanceEndTimeOption = () => {
    const {Content} = this.state;
    return {
      defaultTime: Content.MaintenanceEndTime
        ? moment(Content.MaintenanceEndTime).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      type: 'hour',
      onSureClickListener: time => {
        this.setState(prevState => ({
          Content: {
            ...prevState.Content,
            MaintenanceEndTime: time,
          },
        }));
      },
    };
  };

  handleFormDataChange = (itemId, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [itemId]: value,
      },
    }));
  };

  getFormValue = itemId => {
    return this.state.formData[itemId];
  };

  renderTimeSection = () => {
    const {Content} = this.state;
    return (
      <View
        style={[
          {
            width: SCREEN_WIDTH - 24,
            alignItems: 'center',
            backgroundColor: globalcolor.white,
            marginHorizontal: 12,
            paddingHorizontal: 6,
            marginTop: 12,
            borderRadius: 4,
          },
        ]}>
        <View style={styles.layoutWithBottomBorder}>
          <Text style={styles.labelStyle}>工作时间：</Text>
          <View style={styles.timeRangeContainer}>
            <Text style={[styles.timeValue, {flex: 1}]}>
              {Content.WorkingDateBegin}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: globalcolor.taskFormLabel,
                paddingHorizontal: 2,
                textAlign: 'center',
              }}>
              ~
            </Text>
            <Text style={[styles.timeValue, {flex: 1}]}>
              {Content.WorkingDateEnd}
            </Text>
          </View>
        </View>
        <FormDatePicker
          required={true}
          getPickerOption={this.getMaintenanceStartTimeOption}
          label={'运行维护开始时间'}
          timeString={
            Content.MaintenanceBeginTime
              ? moment(Content.MaintenanceBeginTime).format(
                  'YYYY-MM-DD HH:mm:ss',
                )
              : '请选择开始时间'
          }
        />
        <FormDatePicker
          required={true}
          getPickerOption={this.getMaintenanceEndTimeOption}
          label={'运行维护结束时间'}
          timeString={
            Content.MaintenanceEndTime
              ? moment(Content.MaintenanceEndTime).format('YYYY-MM-DD HH:mm:ss')
              : '请选择结束时间'
          }
          last={true}
        />
      </View>
    );
  };

  renderSection = (section, index) => {
    const isExpanded = this.state.expandedSections.includes(index);

    return (
      <View
        key={section.id}
        style={[
          {
            width: SCREEN_WIDTH - 24,
            backgroundColor: globalcolor.white,
            marginHorizontal: 12,
            marginTop: 12,
            borderRadius: 4,
            overflow: 'hidden',
          },
        ]}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => this.toggleSection(index)}>
          <Text style={styles.sectionTitle}>
            {section.id}. {section.title}
          </Text>
          <Image
            source={require('../../../../../images/ic_arrows_up.png')}
            style={[
              styles.arrow,
              {
                transform: [{rotate: isExpanded ? '0deg' : '180deg'}],
              },
            ]}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.sectionContent}>
            {this.renderSectionContent(section)}
          </View>
        )}
      </View>
    );
  };

  // 渲染section内容
  renderSectionContent = section => {
    if (!section.items || section.items.length === 0) {
      return null;
    }
    return this.renderCheckList(section.items);
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
          signature: this.state.formData.signature,
        },
      }),
    );
  };

  // 渲染检查项
  renderCheckList = items => {
    const {TaskID} = this.props.route.params.params;
    const {formData, signContent} = this.state;
    console.log('formData', formData);
    console.log('state', this.state);
    return (
      <View style={styles.checkListContainer}>
        {items.map((item, index) => {
          // 处理图片上传项
          if (item.type === 'upload') {
            return (
              <View key={index} style={styles.imageUploadContainer}>
                <ImageGrid
                  componentType={'taskhandle'}
                  style={{
                    // paddingLeft: 13,
                    // paddingRight: 13,
                    // paddingBottom: 10,
                    backgroundColor: '#fff',
                  }}
                  Imgs={this.state[item.id + '_PIC']}
                  isUpload={true}
                  isDel={true}
                  UUID={formData[item.id]}
                  uploadCallback={items => {
                    console.log('items', items);
                    // let newFormData = {...this.state.formData};
                    // let newImgList = [].concat(
                    //   this.state.formData[item.id] || [],
                    // );
                    let newImgList = [...this.state[item.id + '_PIC']];
                    items.map(imageItem => {
                      newImgList.push(imageItem);
                    });
                    this.setState({[item.id + '_PIC']: newImgList});
                  }}
                  delCallback={index => {
                    let newImgList = [...this.state[item.id + '_PIC']];
                    newImgList.splice(index, 1);
                    this.setState({[item.id + '_PIC']: newImgList});
                  }}
                />
              </View>
            );
          }

          if (item.type === 'input') {
            // 渲染输入框
            return (
              <FormTextArea
                key={item.id}
                label={item.title}
                labelStyle={{color: globalcolor.taskFormLabel, fontSize: 14}}
                value={this.getFormValue(item.id) || ''}
                onChangeText={value =>
                  this.handleFormDataChange(item.id, value)
                }
                placeholder="请输入"
                numberOfLines={1}
                areaHeight={20}
                style={styles.formItem}
              />
            );
          } else if (item.type === 'textarea') {
            // 渲染文本域
            return (
              <FormTextArea
                key={item.id}
                label={item.title}
                labelStyle={{color: globalcolor.taskFormLabel, fontSize: 14}}
                value={this.getFormValue(item.id) || ''}
                onChangeText={value =>
                  this.handleFormDataChange(item.id, value)
                }
                placeholder="请输入"
                areaHeight={40}
                numberOfLines={4}
                style={styles.formItem}
              />
            );
          } else if (item.type === 'signature') {
            // 渲染签名组件
            return (
              <View key={item.id} style={styles.signatureContainer}>
                {/* <Text style={styles.checkItemTitle}>{item.title}</Text> */}
                <TouchableOpacity
                  style={styles.signatureWrapper}
                  onPress={this.openSignaturePage}>
                  {signContent ? (
                    <Image
                      source={{uri: signContent}}
                      style={styles.signaturePreview}
                    />
                  ) : (
                    <Text style={styles.signaturePlaceholder}>
                      点击此处签名
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          } else {
            // 渲染正常/异常选择按钮
            const value = this.getFormValue(item.id);
            return (
              <View key={item.id} style={styles.checkItem}>
                <Text style={styles.checkItemTitle}>{item.title}</Text>
                <SelectButton
                  editable={true}
                  style={{
                    flexDirection: 'row',
                    width: 120,
                    paddingHorizontal: 10,
                  }}
                  conTainStyle={{height: 44, width: 40}}
                  imageStyle={{width: 18, height: 18}}
                  textStyle={{color: '#666'}}
                  selectIndex={
                    value == undefined ? '' : value === 1 ? '0' : '1'
                  }
                  data={[
                    {
                      title: '正常',
                      id: '1',
                    },
                    {
                      title: '异常',
                      id: '0',
                    },
                  ]}
                  onPress={(index, _item) => {
                    this.handleFormDataChange(
                      item.id,
                      _item.id === '1' ? 1 : 0,
                    );
                  }}
                />
              </View>
            );
          }
        })}
      </View>
    );
  };

  render() {
    const {FormMainID, loading} = this.state;
    return (
      <StatusPage
        status={1} // 1表示正常状态
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: globalcolor.backgroundGrey,
        }}
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {}}
        onErrorPress={() => {}}>
        <ScrollView style={styles.scrollView}>
          {this.renderTimeSection()}
          {this.state.sections.map((section, index) =>
            this.renderSection(section, index),
          )}
        </ScrollView>
        <View style={[{width: SCREEN_WIDTH - 24, alignItems: 'center'}]}>
          <View style={styles.buttonContainer}>
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
      </StatusPage>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  layoutWithBottomBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: globalcolor.borderBottomColor,
    width: '100%',
  },
  labelStyle: {
    fontSize: 14,
    color: globalcolor.taskFormLabel,
    width: 70,
  },
  timeRangeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 14,
    color: globalcolor.taskFormValue,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: globalcolor.white,
  },
  sectionTitle: {
    fontSize: 15,
    color: globalcolor.taskFormLabel,
    flex: 1,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  sectionContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: globalcolor.borderBottomColor,
  },
  checkListContainer: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  imageUploadContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: globalcolor.borderBottomColor,
    paddingRight: 20,
  },
  checkItemTitle: {
    fontSize: 14,
    color: globalcolor.taskFormLabel,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
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
  },
  deleteButton: {
    backgroundColor: globalcolor.red,
  },
  signatureContainer: {
    width: '100%',
    marginBottom: 12,
  },
  signatureWrapper: {
    height: 100,
    borderWidth: 1,
    borderColor: globalcolor.borderBottomColor,
    borderRadius: 4,
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
  signatureTitle: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 10,
  },
  completedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: globalcolor.borderBottomColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    color: globalcolor.taskFormLabel,
  },
  formItem: {
    width: '100%',
    paddingVertical: 10,
  },
  buttonText: {
    color: globalcolor.whiteFont,
    fontSize: 15,
  },
});

export default Patrol_CEM;
