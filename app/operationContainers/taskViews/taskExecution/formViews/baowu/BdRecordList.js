import React, { Component, PureComponent } from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import {
  NavigationActions,
  createAction,
  SentencedToEmpty,
  ShowToast,
} from '../../../../../utils';
import { connect } from 'react-redux';
import ImageGrid from '../../../../../components/form/images/ImageGrid';
import globalcolor from '../../../../../config/globalcolor';
import {
  StatusPage,
  ModalParent,
  SimpleLoadingComponent,
  SimplePickerSingleTime,
} from '../../../../../components';
import FormDatePicker from '../../components/FormDatePicker';
import FormInput from '../../components/FormInput';
import Mask from '../../../../../components/Mask';
import ConfirmDialog from '../../components/ConfirmDialog';
import moment from 'moment';
import MaintenanceOpera from './components/MaintenanceOpera';//头部组件
import ImageSignature from './components/ImageSignature';//上传图片和运维人员签字组件
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * CEMS校验测试记录 列表界面
 * @class DataWarningView
 * @extends {PureComponent}
 */
@connect(
  ({ bdRecordBWModel }) => ({
    BaseInfo: bdRecordBWModel.BaseInfo,
    liststatus: bdRecordBWModel.liststatus,
    editstatus: bdRecordBWModel.editstatus,
    LastCheckTime: bdRecordBWModel.LastCheckTime,
    MainInfo: bdRecordBWModel.MainInfo,
  }),
  null,
  null,
  { withRef: true },
)
class BdRecordList extends PureComponent {


  static defaultProps = {
    liststatus: 200,
  };

  constructor(props) {
    super(props);
    this.state = {
      equipmentInfoList:[],
      basicInfo:{
        cemsSupplier: '',
        maintenanceManageUnit: '',
        operationPerson: '',
        checkDate: '',
        lastCheckDate: '',
        uploadPicture: new Date().getTime(),
        signContent: '',
        signTime: '',
      },
      imageList: [],
    };
    props.navigation.setParams({
      navigatePress: () => {
        this._modalParent.showModal();
      },
    });
    // console.log('liststatus', this.props.liststatus);
    this.props.navigation.setOptions({
      headerRight: () => {
        if (SentencedToEmpty(this.props, ['liststatus', 'status'], -1) == 200) {
          return (
            <TouchableOpacity
              onPress={() => {
                this._modalParent.showModal();
              }}>
              <Text style={{ color: 'white', marginRight: 12 }}>删除</Text>
            </TouchableOpacity>
          );
        } else {
          return <View />;
        }
      },
    });
  }

  componentDidMount() {
    this.onRefresh();
  }

  componentDidUpdate(prevProps) {
  }
  componentWillUnmount() {
    DeviceEventEmitter.emit('refreshTask', {
      newMessage: '刷新',
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      SentencedToEmpty(nextProps, ['liststatus', 'status'], 'undefined') !==
      SentencedToEmpty(prevState, ['liststatus', 'status'], 'undefined')
    ) {
      nextProps.navigation.setParams({
        liststatus: nextProps.liststatus.status,
      });
      return nextProps; // <- this is setState equivalent
    } else {
      return prevState;
    }
  }

  onRefresh = () => {


    // 第一次加载数据
    this.props.dispatch(
      createAction('bdRecordBWModel/updateState')({ initPage: true }),
    );
    //刷新数据
    this.props.dispatch(createAction('bdRecordBWModel/getForm')({ params: {}, callback:(data)=>{
      const record = data?.Record || {};
      // const content = record?.Content || {};
      // const recordList = record?.RecordList || [];
      this.setState({
        basicInfo: {
          cemsSupplier:  record?.CEMSSupplier || '',
          maintenanceManageUnit:  record?.MaintenanceManageUnit || '',
          operationPerson:  record?.OperationPerson || '',
          checkDate: record?.CheckDate || '',
          lastCheckDate: record?.LastCheckDate || '',
          uploadPicture: record?.UploadPicture || this.state.basicInfo.uploadPicture,
          signContent: record?.SignContent || '',
          signTime: record?.SignTime || '',
        },
        imageList: record.AttachmentViewModel?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
      });


    } }));
  };

  _deleteForm() {
    this.props.dispatch(createAction('bdRecordBWModel/delForm')({})); //删除
  }

  commit() {
    const {basicInfo, basicInfo:{cemsSupplier, maintenanceManageUnit, operationPerson,checkDate,lastCheckDate,signContent,},imageList, } = this.state;


    if (!cemsSupplier) {
      ShowToast('请输入CEMS供应商');
      return;
    }
    if (!maintenanceManageUnit) {
      ShowToast('请输入维护管理单位');
      return;
    }
    if (!operationPerson) {
      ShowToast('请选择运维人');
      return;
    }
    if (!checkDate) {
      ShowToast('请选择本次校验日期');
      return;
    }
    if (!lastCheckDate) {
      ShowToast('请选择上次校验日期');
      return;
    }
    if (!imageList.length ) {
      ShowToast('请上传图片');
      return;
    }
    if (!signContent) {
      ShowToast('请签名');
      return;
    }
    SentencedToEmpty(this._RecordResult, ['saveResult'], () => { })();
    // this.RecordResult.wrappedInstance.saveResult();
    // 提交本地的数据
    this.props.dispatch(
      createAction('bdRecordBWModel/saveMainForm')({ params: basicInfo }),
    );
  }



  render() { 
    const { basicInfo:{cemsSupplier, maintenanceManageUnit, operationPerson,checkDate,lastCheckDate,uploadPicture,signContent}, imageList,} = this.state;
    const { MainInfo, BaseInfo } = this.props;
    // console.log('BaseInfo1', BaseInfo);
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <StatusPage
          style={[styles.container, { justifyContent: 'center' }]}
          status={this.props.liststatus.status}
          errorBtnText={'点击重试'}
          onErrorPress={() => {
            //错误页面按钮回调
            this.onRefresh();
          }}
          button={{
            name: '重新加载',
            callback: () => {
              this.onRefresh();
            },
          }}
          commitok_button={[
            {
              name: '返回上页',
              callback: () => {
                this.props.dispatch(NavigationActions.back());
              },
            },
            {
              name: '继续填写',
              isFirst: true,
              callback: () => {
                this.props.dispatch(
                  createAction('bdRecordBWModel/updateState')({
                    liststatus: 'ok',
                  }),
                );
              },
            },
          ]}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : ''}>
            <ScrollView style={styles.scroll}>
              <MaintenanceOpera
                {...this.props}
                isJycs
                isOperationPersonBorder
                formContainerSty={{marginHorizontal:0,paddingHorizontal:12}}
                cemsSupplier={cemsSupplier}
                cemsChange={(text) => {
                  this.setState(prevState => ({
                    basicInfo: {...prevState.basicInfo, cemsSupplier: text},
                  }));
                }}
                checkDate={checkDate}
                checkDateChange={(text) => {
                  this.setState(prevState => ({
                    basicInfo: {...prevState.basicInfo, checkDate: text},
                  }));
                }}
                lastCheckDate={lastCheckDate}
                lastDateChange={(text) => {
                  this.setState(prevState => ({
                    basicInfo: {...prevState.basicInfo, lastCheckDate: text},
                  }));
                }}
                maintenanceManageUnit={maintenanceManageUnit}
                unitChange={(text) => {
                  this.setState(prevState => ({
                    basicInfo: {...prevState.basicInfo, maintenanceManageUnit: text},
                  }));
                }}
                operationPerson={operationPerson}
                userChange={(text) => {
                  this.setState(prevState => ({
                    basicInfo: {...prevState.basicInfo, operationPerson: text},
                  }));
                }}
              />
              <RecordList />
              <BdSelectedStandardGas />
              <BdSelectedEquipment />
              <BdSelectedCompany />
              <RecordResult
                onRef={ref => {
                  console.log('RecordResult ref = ', ref);
                  return (this._RecordResult = ref);
                }}
              />
            
              {/* 选择的标气<StandardGas></StandardGas>*/}
              {/* 选择的测试设备<CbTestEquipment></CbTestEquipment>*/}
              <ImageSignature
                    {...this.props}
                    formContainerSty={{paddingHorizontal:0}}
                    signContent={signContent}
                    handleSignatureCallback={(signature,signTime) => {
                      this.setState(prevState => ({
                        basicInfo: {...prevState.basicInfo, signContent: signature,signTime: signTime},
                      }));
                    }}
                    uuid={uploadPicture}
                    imageList={imageList}
                    uploadCallback={(item) => {
                      this.setState({ imageList: item })
                    }}
                  />
            </ScrollView>
            <View style={styles.commitContainer}>
              <TouchableOpacity
                style={styles.commit}
                onPress={() => {
                  this.commit();
                }}>
                <Image
                  style={{ width: 15, height: 15 }}
                  source={require('../../../../../images/ic_commit.png')}
                />
                <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>
                  提交保存
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </StatusPage>
        <ModalParent ref={ref => (this._modalParent = ref)}>
          <Mask
            hideDialog={() => {
              this._modalParent.hideModal();
            }}
            style={{ justifyContent: 'center' }}>
            <ConfirmDialog
              title={'确认'}
              description={'确认要删除CEMS校验测试记录？'}
              doPositive={() => {
                this._deleteForm();
                this._modalParent.hideModal();
              }}
              doNegative={() => {
                this._modalParent.hideModal();
              }}
            />
          </Mask>
        </ModalParent>
        {this.props.editstatus.status == -2 ? (
          <SimpleLoadingComponent message={'提交中'} />
        ) : null}
        {this.props.editstatus.status == -1 ? (
          <SimpleLoadingComponent message={'删除中'} />
        ) : null}
      </View>
    );
  }
}

/**
 * 校验项目
 */
@connect(
  ({ bdRecordBWModel }) => ({
    List: bdRecordBWModel.List,
    EquipmentInfoList: bdRecordBWModel.EquipmentInfoList,
  }),
  null,
  null,
  { withRef: true },
)
class RecordList extends PureComponent {
  static defaultProps = {
    List: [{}],
  };

  goTo = item => {
    //跳转到编辑界面
    this.props.dispatch(
      NavigationActions.navigate({
        routeName: 'BdRecordEdit_BW',
        params: { ItemData: {...item,EquipmentInfoList: this.props.EquipmentInfoList}},
      }),
    ); //跳转到编辑页面
  };

  render() {
    // console.log('List = ',this.props.List)
    const configList = this.props.List?.filter(item=>item.EvaluateResults==2 || item.IsComplete)
    // const configList = this.props.List
  
    return (
      <View>
        <Text style={styles.title}>校验项目</Text>
        <View style={styles.content1}>
          <TouchableOpacity
            style={{
              height: 41,
              backgroundColor: '#ffffff',
              flexDirection: 'column',
            }}
            onPress={() => {
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: 'BdItemSetting_BW',
                  params: {
                    // item,
                    // columns,
                    // label,
                  },
                }),
              );
            }}>
            <View
              style={[
                {
                  width: '100%',
                  height: 39,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Image
                style={[{ width: 20, height: 20, marginRight: 8 }]}
                source={require('../../../../../images/ic_tab_operation_selected.png')}
              />
              <Text style={{ fontSize: 15, color: '#0080ff' }}>配置测试项目</Text>
            </View>
            {configList?.[0] && <Text style={styles.line} /> }
          </TouchableOpacity>
          {configList.map((item, key) => {
            return (
              <TouchableOpacity
                key={`checkout${item.ItemID}`}
                onPress={() => {
                  this.goTo(item);
                }}>
                {key == 0 ? null : <Text style={styles.line} />}
                <View style={styles.item}>
                  <Text style={styles.text}>{item.Name}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <Text style={this.getStyle(item.EvaluateResults)}>
                      {this.getValue(item.EvaluateResults)}
                    </Text>
                    <Image
                      style={{ width: 14, height: 14 }}
                      source={require('../../../../../images/right.png')}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
  getStyle(result) {
    if ('0' == result) return styles.textError;
    if ('1' == result) return styles.textOK;
    if ('2' == result) return styles.textDefault;
    else return styles.textDefault;
  }

  getValue(result) {
    // if ('0' == result) return '异常';
    // if ('1' == result) return '正常';
    if ('0' == result) return '不合格';
    if ('1' == result) return '合格';
    if ('2' == result) return '已配置';
    else return '未处理';
  }
}

/**
 * 校验结论
 */
@connect(({ bdRecordBWModel }) => ({
  MainInfo: bdRecordBWModel.MainInfo,
}))
class RecordResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      CheckConclusionResult1: '',
      CheckConclusionResult2: '',
      CheckIsOk: '',
    };
    this.props.onRef(this);
  }

  static defaultProps = {
    MainInfo: {},
  };

  componentWillMount() {
    this.setState({
      CheckConclusionResult1: this.props.MainInfo.CheckConclusionResult1,
      CheckConclusionResult2: this.props.MainInfo.CheckConclusionResult2,
      CheckIsOk: this.props.MainInfo.CheckIsOk,
    });
  }

  saveResult = () => {
    let that = this;
    // 修改本地的数据
    this.props.dispatch(
      createAction('bdRecordBWModel/saveMainInfo')({
        params: {
          CheckConclusionResult1: that.state.CheckConclusionResult1, //结论1 如校验合格前对系统进行过处理、调整、参数修改，请说明：
          CheckConclusionResult2: that.state.CheckConclusionResult2, //结论2 如校验后，颗粒物测量仪、流速仪的原校正系统改动，请说明：
          CheckIsOk: that.state.CheckIsOk, //校验是否合格
          //                    CheckDate:""//校验日期
        },
      }),
    );
  };

  render() {
    return (
      <View style={styles.content2}>
        <Text style={styles.title}>校验结论</Text>
        <View style={styles.itemEdit}>
          <Text style={[styles.text]}>校前修改说明</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              this.setState({ CheckConclusionResult1: text });
            }}
            underlineColorAndroid="transparent"
            placeholder="如校验合格前对系统进行过处理、调整、参数修改，请说明："
            placeholderTextColor={'#999999'}
            multiline={true}
            numberOfLines={2}>
            {this.state.CheckConclusionResult1}
          </TextInput>
        </View>
        <View style={[styles.itemEdit, { marginTop: 10 }]}>
          <Text style={[styles.text]}>校后修改说明</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              this.setState({ CheckConclusionResult2: text });
            }}
            underlineColorAndroid="transparent"
            placeholder="如校验后，颗粒物测量仪、流速仪的原校正系统改动，请说明："
            placeholderTextColor={'#999999'}
            multiline={true}
            numberOfLines={2}>
            {this.state.CheckConclusionResult2}
          </TextInput>
        </View>
        {SentencedToEmpty(this.props, ['MainInfo', 'CheckIsOk'], '') ==
          '' ? null : (
            <View style={[styles.itemEdit, { marginTop: 10 }]}>
              <Text style={[styles.text]}>总体校验是否合格</Text>
              <Text style={[styles.textInput, { fontSize: 14, color: '#666666' }]}>
                {this.props.MainInfo.CheckIsOk == 1 ? '合格' : '不合格'}
              </Text>
            </View>
          )}

        {/* <View style={[styles.itemRadio, { marginTop: 10 }]}>
           <Text style={styles.text}>校验是否合格</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                            onPress={() => {
                                this.setState({ CheckIsOk: '1' });
                            }}
                        >
                            <Text style={styles.radioValue}>是</Text>
                            <Image style={{ width: 15, height: 15, marginLeft: 12 }} source={this.state.CheckIsOk == '是' ? require('../../../../../images/ic_reported_check.png') : require('../../../../../images/ic_reported_uncheck.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
                            onPress={() => {
                                this.setState({ CheckIsOk: '0' });
                            }}
                        >
                            <Text style={styles.radioValue}>否</Text>
                            <Image style={{ width: 15, height: 15, marginLeft: 12 }} source={this.state.CheckIsOk == '否' ? require('../../../../../images/ic_reported_check.png') : require('../../../../../images/ic_reported_uncheck.png')} />
                        </TouchableOpacity>
                    </View> 
        </View> */}
      </View>
    );
  }
}

@connect(({ bdRecordBWModel }) => ({
  bdSelectedStandardGas: bdRecordBWModel.bdSelectedStandardGas,
}))
class BdSelectedStandardGas extends PureComponent {
  render() {
    return (
      <ListComponent label="标准气体" list={this.props.bdSelectedStandardGas} />
    );
  }
}

@connect(({ bdRecordBWModel }) => ({
  bdSelectedEquipment: bdRecordBWModel.bdSelectedEquipment,
}))
class BdSelectedEquipment extends PureComponent {
  render() {
    return (
      <ListComponent
        label="参比方法测试设备"
        list={this.props.bdSelectedEquipment}
      />
    );
  }
}

@connect(({ bdRecordBWModel }) => ({
  ParamsList: bdRecordBWModel.ParamsList,
}))
class BdSelectedCompany extends PureComponent {
  render() {
    return <ListComponent label="参比监测公司" list={this.props.ParamsList} />;
  }
}

/**
 * 测试所用标气
 */
@connect(({ bdRecordBWModel }) => ({
  BaseInfo: bdRecordBWModel.BaseInfo,
  List: bdRecordBWModel.List,
}))
class ListComponent extends Component {
  constructor(props) {
    super(props);
  }
  /**
     *  ID 有id是修改没有id就是添加
        Name  标识名称或者测试项目名称
        Manufacturer 生产厂商名称
        ParamsType  1是标气2是测试设备
        ConcentrationValue 浓度值
        TestMethod 方法依据
        EquipmentModel 设备型号
        FormMainID 主表ID
     */
  render() {
    const { label = '标准气体', list = [] } = this.props;
    let columns = [
      { name: '标准气体名称', code: 'Name' },
      { name: '浓度值', code: 'ConcentrationValue' },
      { name: '生产厂商名称', code: 'Manufacturer' },
    ];
    let addLabel = '增加标气';
    if (label == '标准气体') {
      columns = [
        { name: '标准气体名称', code: 'Name' },
        { name: '浓度值', code: 'ConcentrationValue' },
        { name: '单位', code: 'Unit' },
        { name: '生产厂商名称', code: 'Manufacturer' },
      ];
    } else if (label == '参比方法测试设备') {
      addLabel = '增加测试设备';
      columns = [
        { name: '测试项目', code: 'Name' },
        { name: '测试设备生产厂商', code: 'Manufacturer' },
        { name: '测试设备型号', code: 'EquipmentModel' },
        { name: '方法依据', code: 'TestMethod' },
      ];
    } else if (label == '参比监测公司') {
      addLabel = '增加公司';
      columns = [
        { name: '公司名称（对比方）', code: 'Name' },
        { name: '设备品牌', code: 'Manufacturer' },
        { name: '设备型号', code: 'EquipmentModel' },
      ];
    }
    let holderItem = [];
    if (list.length == 0) {
      holderItem = [{}, {}];
    } else if (list.length == 1) {
      holderItem = [{}];
    } else {
      holderItem = [];
    }
    let columnWidth = (SCREEN_WIDTH - 49) / columns.length;
    const configList = this.props.List?.filter(item=>item.EvaluateResults==2 ||  item.IsComplete)
    // console.log(configList,'333333333333')
    return (
      <View style={styles.content3}>
        <Text style={styles.title}>{label}</Text>
        <View
          style={[
            { flexDirection: 'row', height: 42, backgroundColor: 'white' },
          ]}>
          {columns.map((item, index) => {
            return (
              <View
                key={`${label}_title_${index}`}
                style={{
                  flex: 1,
                  height: 42,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[{ color: '#333333' }]}>{item.name}</Text>
              </View>
            );
          })}
          <View style={[{ width: 29 }]} />
        </View>
        <Text style={styles.line} />
        {list.map((item, key) => {
          return (
            <TouchableOpacity
              key={`${label}_row${key}`}
              onPress={() => {
                this.props.dispatch(
                  NavigationActions.navigate({
                    routeName: 'BdSelectedEdit_BW',
                    params: {
                      item,
                      columns,
                      label,
                    },
                  }),
                );
              }}
              style={[{ height: 41, backgroundColor: 'white' }]}>
              <View
                style={[
                  {
                    width: SCREEN_WIDTH - 20,
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                {columns.map((columnItem, columnIndex) => {
                  return (
                    <View
                      key={`${label}_row${key}_column_${columnIndex}`}
                      style={[
                        {
                          height: 40,
                          width: columnWidth,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}>
                      <Text numberOfLines={1} style={[{ maxWidth: columnWidth }]}>
                        {SentencedToEmpty(item, [columnItem.code], '--')}
                      </Text>
                    </View>
                  );
                })}
                <Image
                  style={[{ height: 15, width: 15, marginHorizontal: 7 }]}
                  source={require('../../../../../images/ic_edit.png')}
                />
              </View>
              <Text style={styles.line} />
            </TouchableOpacity>
          );
        })}
        {holderItem.map((item, key) => {
          return (
            <View key={`${label}_holder${key}`}>
              <View
                style={[
                  styles.itemStandardGas,
                  { flexDirection: 'row', height: 40 },
                ]}
              />
              <Text style={styles.line} />
            </View>
          );
        })}
        <TouchableOpacity
          onPress={() => {
            if (SentencedToEmpty(this.props, ['BaseInfo', 'ID'], '') == '') {
              let msg = '请先填写校验项目后，再添加标气。';
              if (this.props.label == '参比方法测试设备') {
                msg = '请先填写校验项目后，再添加测试设备。';
              }
              ShowToast(msg);
            } else {
              this.props.dispatch(
                NavigationActions.navigate({
                  routeName: 'BdSelectedEdit_BW',
                  params: {
                    columns,
                    label,
                    configList,
                  },
                }),
              );
            }
          }}>
          <View
            style={[
              styles.item,
              { justifyContent: 'center', backgroundColor: 'white', height: 64 },
            ]}>
            <View
              style={{
                height: 30,
                width: 110,
                borderColor: '#4DA9FF',
                borderRadius: 15,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.text, { color: '#4DA9FF' }]}>{addLabel}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

/**
 * 标准气体
 */
@connect(
  ({ bdRecordBWModel }) => ({
    MainInfo: bdRecordBWModel.MainInfo,
  }),
  null,
  null,
  { withRef: true },
)
class StandardGas extends PureComponent {
  render() {
    if (
      this.props.MainInfo.standardGas == null ||
      this.props.MainInfo.standardGas.length == 0
    ) {
      return null;
    }
    return (
      <View style={styles.content3}>
        <Text style={styles.title}>标准气体</Text>
        {this.props.MainInfo.standardGas.map((item, key) => {
          return (
            <TouchableOpacity key={item.StandardGasName}>
              <View
                style={[
                  styles.itemStandardGas,
                  key > 0 ? { marginTop: 10 } : {},
                ]}>
                <View style={[styles.item]}>
                  <Text style={styles.text}>标准气体名称</Text>
                  <Text style={styles.textDefault}>{item.StandardGasName}</Text>
                </View>
                <Text style={styles.line} />
                <View style={styles.item}>
                  <Text style={styles.text}>标气浓度</Text>
                  <Text style={styles.textDefault}>{item.Ndz}</Text>
                </View>
                <Text style={styles.line} />
                <View style={styles.item}>
                  <Text style={styles.text}>生产厂商</Text>
                  <Text style={styles.textDefault}>{item.Manufacturer}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

/**
 * 参比方法测试设备
 */
@connect(
  ({ bdRecordBWModel }) => ({
    MainInfo: bdRecordBWModel.MainInfo,
  }),
  null,
  null,
  { withRef: true },
)
class CbTestEquipment extends PureComponent {
  render() {
    if (
      this.props.MainInfo.cbTestEquipment == null ||
      this.props.MainInfo.cbTestEquipment.length == 0
    ) {
      return null;
    }
    return (
      <View style={styles.content4}>
        <Text style={styles.title}>参比方法测试设备</Text>
        {this.props.MainInfo.cbTestEquipment.map((item, key) => {
          return (
            <TouchableOpacity key={item.TestItem}>
              {key == 0 ? null : <Text style={styles.line} />}
              <View style={styles.itemCbTestEquipment}>
                <View style={styles.item}>
                  <Text style={styles.text}>测试项目</Text>
                  <Text style={styles.textDefault}>{item.TestItem}</Text>
                </View>
                <Text style={styles.line} />
                <View style={styles.item}>
                  <Text style={styles.text}>生产厂商</Text>
                  <Text style={styles.textDefault}>
                    {item.TestEquipmentManufacturer}
                  </Text>
                </View>
                <Text style={styles.line} />
                <View style={styles.item}>
                  <Text style={styles.text}>设备型号</Text>
                  <Text style={styles.textDefault}>
                    {item.TestEquipmenCode}
                  </Text>
                </View>
                <Text style={styles.line} />
                <View style={styles.item}>
                  <Text style={styles.text}>方法依据</Text>
                  <Text style={styles.textDefault}>{item.MethodBasis}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },

  scroll: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: SCREEN_WIDTH,
  },

  title: {
    marginLeft: 10,
    lineHeight: 36,
    fontSize: 15,
    color: '#333333',
  },

  content1: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },

  item: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  content2: {
    flexDirection: 'column',
    backgroundColor: '#00000000',
  },

  content3: {
    flexDirection: 'column',
    backgroundColor: '#00000000',
  },

  content4: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00000000',
  },

  line: {
    height: 1,
    backgroundColor: '#e7e7e7',
  },

  text: {
    fontSize: 14,
    color: '#333333',
  },

  textDefault: {
    fontSize: 14,
    color: '#666666',
  },

  textOK: {
    fontSize: 14,
    color: '#33c066',
  },

  textError: {
    fontSize: 14,
    color: '#ef4d4d',
  },

  itemEdit: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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

  itemRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
  },

  radioValue: {
    fontSize: 14,
    color: '#666666',
  },

  commitContainer: {
    width: SCREEN_WIDTH,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#00000000',
  },

  commit: {
    marginBottom: 15,
    width: 282,
    height: 36,
    borderRadius: 32,
    backgroundColor: '#4499f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    fontSize: 14,
    color: '#333333',
  },
  itemCbTestEquipment: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  itemStandardGas: {
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  image: {
    width: 15,
    height: 15,
  },
  signatureContainer: {
    width: SCREEN_WIDTH - 16,
    height: 80,
    backgroundColor: globalcolor.white,
    marginHorizontal: 8,
    // marginTop: 8,
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
});

//make this component available to the app
export default BdRecordList;
