/*
 * @Description: 示值误差和响应时间 入口
 * @LastEditors: hxf
 * @Date: 2025-02-26 11:53:29
 * @LastEditTime: 2025-02-26 17:29:30
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/IndicationErrorAndResponseTimeList.js
 */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import {SCREEN_WIDTH} from '../../../../../config/globalsize';
import FormInput from '../../components/FormInput';
import globalcolor from '../../../../../config/globalcolor';
import {MoreSelectTouchable} from '../../../../../components';
import {connect} from 'react-redux';
import {
  createAction,
  NavigationActions,
  ShowToast,
  ShowLoadingToast,
  CloseToast,
} from '../../../../../utils';
import AlertDialog from '../../../../../components/modal/AlertDialog';
import moment from 'moment';
import FormDatePicker from '../../components/FormDatePicker';
import ImageGrid from '../../../../../components/form/images/ImageGrid';

// 通用的表单输入配置
const commonFormInputProps = {
  required: true,
  requireIconPosition: 'left',
  hasColon: true,
  propsLabelStyle: {
    fontSize: 15,
    // color: globalcolor.textBlack,
  },
  propsTextStyle: {
    // color: globalcolor.datepickerGreyText,
    fontSize: 14,
    marginRight: 0,
  },
  keyboardType: 'default',
};

// 图片上传渲染数据
const IMAGE_LIST = [
  {
    name: '示值误差工作过程及数据（低浓度）',
    key: 'DFile',
  },
  {
    name: '示值误差工作过程及数据（中浓度）',
    key: 'ZFile',
  },
  {
    name: '示值误差工作过程及数据（高浓度）',
    key: 'GFile',
  },
  {
    name: '工作标气标签',
    key: 'BFile',
  },
  {
    name: '系统响应时间测量工作照片',
    key: 'BeforeFile',
  },
  {
    name: '系统响应时间（秒表）照片',
    key: 'AfterFile',
  },
];

class IndicationErrorAndResponseTimeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // dataSource 结构:
      // {
      //   MaintenanceManagementUnit: string, // 运维管理单位
      //   Tester: string, // 测试人员
      //   PointInfoList: [ // 污染物列表
      //     {
      //       ChildID: string, // 污染物ID
      //       Name: string, // 污染物名称
      //       ChildList: [ // 量程列表
      //         {
      //           ID: string, // 量程ID，新建的以 'new-range-' 开头
      //           Sort: number, // 量程序号
      //           MainId: string, // 主记录ID
      //           SZWCValue: string | null, // 示值误差值
      //           XYSJValue: string | null, // 响应时间值
      //           IsSZWC: number, // 示值误差是否合格
      //           IsXYSJ: number, // 响应时间是否合格
      //         }
      //       ]
      //     }
      //   ]
      // }
      dataSource: {},
      // selectedPollutants 存储当前选中的污染物数据，结构同 PointInfoList 中的元素
      selectedPollutants: [],
      FormMainID: props.route.params.params.FormMainID,
      imageList1: [],
      imageList2: [],
      imageList3: [],
      imageList4: [],
      imageList5: [],
      imageList6: [],
    };
    console.log('props1111', props);
  }

  componentDidMount() {
    this.getPageData();
  }

  componentDidUpdate(prevProps, prevState) {
    // 当数据源更新时，自动选中有量程数据的污染物
    if (
      prevState.dataSource !== this.state.dataSource &&
      this.state.dataSource?.PointInfoList
    ) {
      // 只在 PointInfoList 发生变化时才更新选中状态
      if (
        prevState.dataSource?.PointInfoList !==
        this.state.dataSource.PointInfoList
      ) {
        const pollutantsWithData = this.state.dataSource.PointInfoList.filter(
          item => item.ChildList && item.ChildList.length > 0,
        );

        if (pollutantsWithData.length > 0) {
          // 更新选中的污染物列表
          this.setState({
            selectedPollutants: pollutantsWithData,
          });

          // 更新多选框的选中状态
          if (this._picker) {
            const selectCodes = pollutantsWithData.map(p => p.ChildID);
            this._picker.selectItems(selectCodes);
          }
        }
      }
      console.log('this.props.dataSource', this.props.dataSource)
      // 处理图片数据
      this.setState({
        imageList1:
          this.state.dataSource?.DFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
        imageList2:
          this.state.dataSource?.ZFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
        imageList3:
          this.state.dataSource?.GFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
        imageList4:
          this.state.dataSource?.BFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
        imageList5:
          this.state.dataSource?.BeforeFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
        imageList6:
          this.state.dataSource?.AfterFilePic?.ImgNameList?.map(item => ({
            AttachID: item,
          })) || [],
      });
    }
  }

  // 获取页面初始数据
  getPageData = () => {
    const {params} = this.props.route.params;
    this.props.dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/GetIndicationErrorSystemResponseRecordList',
      )({
        isZB: true,
        params: {
          taskID: params.TaskID,
          typeID: params.TypeID,
        },
        callback: res => {
          this.setState({
            dataSource: res,
            AfterFile: res.AfterFile || new Date().getTime() + 'AfterFile',
            BeforeFile: res.BeforeFile || new Date().getTime() + 'BeforeFile',
            BFile: res.BFile || new Date().getTime() + 'BFile',
            DFile: res.DFile || new Date().getTime() + 'DFile',
            GFile: res.GFile || new Date().getTime() + 'GFile',
            ZFile: res.ZFile || new Date().getTime() + 'ZFile',
          });
          if (!params.FormMainID) {
            this.setState({
              FormMainID: res.FormMainID,
            });
            // this.props.dispatch(
            //   createAction('taskDetailModel/updateFormStatus')({
            //     cID: 92,
            //     isAdd: true,
            //   }),
            // );
          }
        },
      }),
    );
  };

  // 获取污染物配置项
  getJzConfigItemOption = () => {
    const {dataSource, selectedPollutants} = this.state;
    let selectCodes = [];
    let dataArr = [];

    if (dataSource?.PointInfoList) {
      // 转换数据格式用于多选框显示
      dataArr = dataSource.PointInfoList.map(item => ({
        ItemCode: item.ChildID,
        ItemName: item.Name,
        selected: item.ChildList && item.ChildList.length > 0,
      }));

      selectCodes = dataArr
        .filter(item => item.selected)
        .map(item => item.ItemCode);
    }

    return {
      contentWidth: 166,
      selectName: '选择污染物',
      placeHolderStr: '污染物',
      codeKey: 'ItemCode',
      nameKey: 'ItemName',
      selectCode: selectCodes,
      dataArr: dataArr,
      callback: ({selectData}) => {
        if (!selectData) {
          // 取消全选时，检查是否有已提交的量程
          const hasSubmittedRanges = this.state.selectedPollutants.some(
            pollutant =>
              pollutant.ChildList?.some(
                range => !range.ID.startsWith('new-range'),
              ),
          );

          if (hasSubmittedRanges) {
            ShowToast('已提交量程的污染物不能取消选择');
            // 恢复之前的选中状态
            if (this._picker) {
              const currentSelectCodes = this.state.selectedPollutants.map(
                p => p.ChildID,
              );
              this._picker.selectItems(currentSelectCodes);
            }
            return;
          }
          this.setState({selectedPollutants: []});
          return;
        }

        // 检查取消选择的污染物中是否有已提交的量程
        const deselectedPollutants = this.state.selectedPollutants.filter(
          pollutant =>
            !selectData.find(item => item.ItemCode === pollutant.ChildID),
        );

        const hasSubmittedRangesInDeselected = deselectedPollutants.some(
          pollutant =>
            pollutant.ChildList?.some(
              range => !range.ID.startsWith('new-range'),
            ),
        );

        if (hasSubmittedRangesInDeselected) {
          ShowToast('已提交量程的污染物不能取消选择');
          // 恢复之前的选中状态
          if (this._picker) {
            const currentSelectCodes = this.state.selectedPollutants.map(
              p => p.ChildID,
            );
            this._picker.selectItems(currentSelectCodes);
          }
          return;
        }

        // 更新选中的污染物数据
        const updatedPollutants = selectData.map(item => {
          const pointInfo = dataSource.PointInfoList.find(
            p => p.ChildID === item.ItemCode,
          );

          // 如果是新选中的污染物，自动添加一个空的量程
          if (!pointInfo.ChildList || pointInfo.ChildList.length === 0) {
            pointInfo.ChildList = [
              {
                ID: `new-range-${Date.now()}`,
                Sort: 1,
                MainId: pointInfo.ID,
                SZWCValue: null,
                XYSJValue: null,
                IsSZWC: 0,
                IsXYSJ: 0,
              },
            ];
          }

          return pointInfo;
        });

        this.setState({
          selectedPollutants: updatedPollutants,
        });
      },
    };
  };

  // 添加新的量程
  handleAddRange = pollutantId => {
    const {selectedPollutants} = this.state;
    const updatedPollutants = selectedPollutants.map(pollutant => {
      if (pollutant.ChildID === pollutantId) {
        // 获取当前最大的量程序号
        const maxSort =
          pollutant.ChildList && pollutant.ChildList.length > 0
            ? Math.max(...pollutant.ChildList.map(item => item.Sort))
            : 0;

        // 创建新的量程对象
        const newRange = {
          ID: `new-range-${Date.now()}`,
          Sort: maxSort + 1,
          MainId: pollutant.ID,
          SZWCValue: null,
          XYSJValue: null,
          IsSZWC: 0,
          IsXYSJ: 0,
        };

        return {
          ...pollutant,
          ChildList: [...(pollutant.ChildList || []), newRange],
        };
      }
      return pollutant;
    });

    this.setState({
      selectedPollutants: updatedPollutants,
    });
  };

  cancelButton = () => {};

  // 提交表单
  onSubmit = () => {
    const {
      dataSource,
      selectedPollutants,
      imageList1,
      imageList2,
      imageList3,
      imageList4,
      imageList5,
      imageList6,
    } = this.state;
    const {params} = this.props.route.params;
    // 检验必填项是否已填写
    // 判断是否存在污染物
    if (selectedPollutants.length === 0) {
      ShowToast('请选择污染物');
      return;
    }
    console.log('body', {
      taskID: params.TaskID,
      typeID: params.TypeID,
      content: {
        MaintenanceManagementUnit: dataSource.MaintenanceManagementUnit,
        Tester: dataSource.Tester,
        LastCheckTime: dataSource.LastCheckTime,
        CheckBTime: dataSource.CheckBTime,
        CheckETime: dataSource.CheckETime,
        DFile: dataSource.DFile,
        ZFile: dataSource.ZFile,
        GFile: dataSource.GFile,
        BFile: dataSource.BFile,
        BeforeFile: dataSource.BeforeFile,
        AfterFile: dataSource.AfterFile,
        WorkingDateBegin: dataSource.WorkingDateBegin,
        WorkingDateEnd: dataSource.WorkingDateEnd,
      },
      signContent: dataSource.SignContent,
      signTime: dataSource.SignTime,
    });
    if (!dataSource.MaintenanceManagementUnit) {
      ShowToast('请填写运维管理单位');
      return;
    }
    if (!dataSource.Tester) {
      ShowToast('请填写测试人员');
      return;
    }
    if (!dataSource.SignContent) {
      ShowToast('请签名');
      return;
    }
    if (!dataSource.LastCheckTime) {
      ShowToast('请填写上次测试时间');
      return;
    }
    if (!dataSource.CheckBTime) {
      ShowToast('请填写本次测试开始时间');
      return;
    }
    if (!dataSource.CheckETime) {
      ShowToast('请填写本次测试结束时间');
      return;
    }
    if (!imageList1.length) {
      ShowToast('示值误差工作过程及数据（低浓度）不能为空');
      return;
    }
    if (!imageList2.length) {
      ShowToast('示值误差工作过程及数据（中浓度）不能为空');
      return;
    }
    if (!imageList3.length) {
      ShowToast('示值误差工作过程及数据（高浓度）不能为空');
      return;
    }
    if (!imageList4.length) {
      ShowToast('工作标气标签不能为空');
      return;
    }
    if (!imageList5.length) {
      ShowToast('系统响应时间测量工作照片不能为空');
      return;
    }
    if (!imageList6.length) {
      ShowToast('系统响应时间（秒表）照片不能为空');
      return;
    }
    this.props.dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/SubmitIndicationErrorSystemResponseRecordZB',
      )({
        params: {
          taskID: params.TaskID,
          typeID: params.TypeID,
          content: {
            MaintenanceManagementUnit: dataSource.MaintenanceManagementUnit,
            Tester: dataSource.Tester,
            LastCheckTime: dataSource.LastCheckTime,
            CheckBTime: dataSource.CheckBTime,
            CheckETime: dataSource.CheckETime,
            DFile: dataSource.DFile,
            ZFile: dataSource.ZFile,
            GFile: dataSource.GFile,
            BFile: dataSource.BFile,
            BeforeFile: dataSource.BeforeFile,
            AfterFile: dataSource.AfterFile,
            WorkingDateBegin: dataSource.WorkingDateBegin,
            WorkingDateEnd: dataSource.WorkingDateEnd,
          },
          signContent: dataSource.SignContent,
          signTime: dataSource.SignTime,
        },
        callback: () => {
          this.props.navigation.goBack();
        },
      }),
    );
  };

  // 删除整个表单
  deleteForm = () => {
    const {FormMainID} = this.state;
    ShowLoadingToast('正在删除表单');
    this.props.dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/DeleteErrorSystemResponseRecord',
      )({
        isZB: true,
        params: {
          FormMainID,
        },
        callback: () => {
          CloseToast();
          // this.props.navigation.goBack();
          this.props.dispatch(NavigationActions.back());
          this.props.dispatch(
            createAction('taskDetailModel/updateFormStatus')({
              cID: 92,
              isAdd: false,
            }),
          );
        },
      }),
    );
  };

  confirm = (pollutantId, rangeId, rangeToDelete) => {
    if (!rangeToDelete.ID.startsWith('new-range')) {
      ShowLoadingToast('正在删除量程');
      this.props.dispatch(
        createAction(
          'indicationErrorAndResponseTimeModel/DeleteErrorSystemResponseRecordInfo',
        )({
          isZB: true,
          params: {
            id: rangeToDelete.ID,
          },
          callback: () => {
            this.doDeleteRange(pollutantId, rangeId);
            this.getPageData();
            CloseToast();
          },
        }),
      );
    } else {
      this.doDeleteRange(pollutantId, rangeId);
    }
  };

  // 删除量程
  handleDeleteRange = (pollutantId, rangeId) => {
    const pollutant = this.state.selectedPollutants.find(
      p => p.ChildID === pollutantId,
    );
    const rangeToDelete = pollutant?.ChildList?.find(
      item => item.ID === rangeId,
    );

    if (rangeToDelete && (rangeToDelete.SZWCValue || rangeToDelete.XYSJValue)) {
      this.refs.deleteAlert.show();
      // 保存当前要删除的数据，供确认时使用
      this.currentDeleteData = {
        pollutantId,
        rangeId,
        rangeToDelete,
      };
    } else {
      this.doDeleteRange(pollutantId, rangeId);
    }
  };

  doDeleteRange = (pollutantId, rangeId) => {
    this.setState(prevState => {
      const pollutant = prevState.selectedPollutants.find(
        p => p.ChildID === pollutantId,
      );
      if (!pollutant) return prevState;

      const newChildList = pollutant.ChildList.filter(
        item => item.ID !== rangeId,
      );

      let newSelectedPollutants;
      if (newChildList.length === 0) {
        // 当量程全部删除时，从选中的污染物列表中移除该污染物
        newSelectedPollutants = prevState.selectedPollutants.filter(
          p => p.ChildID !== pollutantId,
        );

        // 更新选择器的状态
        if (this._picker) {
          const selectCodes = newSelectedPollutants.map(p => p.ChildID);
          this._picker.selectItems(selectCodes);
        }
      } else {
        newSelectedPollutants = prevState.selectedPollutants.map(p =>
          p.ChildID === pollutantId ? {...p, ChildList: newChildList} : p,
        );
      }

      return {
        selectedPollutants: newSelectedPollutants,
      };
    });
  };

  // 渲染量程项
  renderRangeItem = (pollutant, rangeData, index) => {
    const {params} = this.props.route.params;
    const {dataSource, DFile, ZFile, GFile, BFile, BeforeFile, AfterFile} =
      this.state;

    const handleRangePress = () => {
      // 检查必填项是否已填写
      if (!dataSource.MaintenanceManagementUnit) {
        ShowToast('请先填写运维管理单位');
        return;
      }
      if (!dataSource.Tester) {
        ShowToast('请先填写测试人员');
        return;
      }
      if (!dataSource.LastCheckTime) {
        ShowToast('请先填写上次测试日期');
        return;
      }
      if (!dataSource.CheckBTime) {
        ShowToast('请先填写本次测试开始时间');
        return;
      }
      if (!dataSource.CheckETime) {
        ShowToast('请先填写本次测试结束时间');
        return;
      }
      // 跳转到量程编辑页面
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'IndicationErrorAndResponseTimeEditor_zb',
          params: {
            pollutant,
            rangeTitle: `量程 ${index + 1}`,
            rangeData,
            rangeIndex: index,
            taskID: params.TaskID,
            typeID: params.TypeID,
            maintenanceManagementUnit: dataSource.MaintenanceManagementUnit,
            tester: dataSource.Tester,
            UnitList: dataSource.UnitList,
            MainInfo: {
              DFile,
              ZFile,
              GFile,
              BFile,
              BeforeFile,
              AfterFile,
              LastCheckTime: dataSource.LastCheckTime,
              CheckBTime: dataSource.CheckBTime,
              CheckETime: dataSource.CheckETime,
              WorkingDateBegin: dataSource.WorkingDateBegin,
              WorkingDateEnd: dataSource.WorkingDateEnd,
              SignContent: dataSource.SignContent,
              SignTime: dataSource.SignTime,
            },

            onResult: () => {
              this.props.dispatch(
                createAction('taskDetailModel/updateFormStatus')({
                  cID: 92,
                }),
              );
              this.getPageData();
            },
          },
        }),
      );
    };

    return (
      <View key={rangeData.ID} style={styles.rangeItemContainer}>
        <View style={styles.rangeHeaderContainer}>
          <View style={styles.rangeTitleContainer}>
            <Text style={styles.rangeTitle}>{`量程 ${index + 1}`}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              this.handleDeleteRange(pollutant.ChildID, rangeData.ID)
            }>
            <Text style={styles.deleteText}>删除</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.rangeContentButton}
          onPress={handleRangePress}>
          <View style={styles.rangeContent}>
            <View style={styles.rangeDataRow}>
              <Text style={styles.rangeLabel}>示值误差:</Text>
              <Text
                style={[
                  styles.rangeValue,
                  rangeData.SZWCValue && {
                    color: rangeData.IsSZWC === 1 ? '#52c41a' : '#ff4d4f',
                  },
                ]}>
                {rangeData.SZWCValue ? `${rangeData.SZWCValue}%` : '未填写'}
              </Text>
              <Text style={[styles.rangeLabel, {marginLeft: 16}]}>
                响应时间:
              </Text>
              <Text
                style={[
                  styles.rangeValue,
                  rangeData.XYSJValue && {
                    color: rangeData.IsXYSJ === 1 ? '#52c41a' : '#ff4d4f',
                  },
                ]}>
                {rangeData.XYSJValue ? `${rangeData.XYSJValue}` : '未填写'}
              </Text>
            </View>
            {rangeData.Col1 && (
              <View style={styles.evaluationRow}>
                <Text style={styles.evaluationLabel}>评价依据:</Text>
                <Text style={styles.evaluationValue}>
                  {rangeData?.Col1?.replace(/\\n/g, '\n')?.replace(/\\/g, '') ||
                    ''}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染污染物卡片
  renderPollutantCard = pollutant => {
    if (!pollutant) return null;

    return (
      <View key={pollutant.ChildID} style={styles.pollutantCard}>
        <View style={styles.pollutantHeader}>
          <Text style={styles.pollutantName}>{pollutant.Name}</Text>
          <TouchableOpacity
            style={styles.addRangeButton}
            onPress={() => this.handleAddRange(pollutant.ChildID)}>
            <Image
              source={require('../../../../../images/jiarecord.png')}
              style={styles.addButtonIcon}
            />
            <Text style={styles.addButtonText}>添加量程</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rangeList}>
          {pollutant.ChildList &&
            pollutant.ChildList.map((rangeData, index) =>
              this.renderRangeItem(pollutant, rangeData, index),
            )}
        </View>
      </View>
    );
  };

  // 上传图片回调
  uploadCallback = (items, imageIndex) => {
    let newImgList = [...this.state[`imageList${imageIndex}`]];
    items.map(imageItem => {
      newImgList.push(imageItem);
    });
    this.setState({[`imageList${imageIndex}`]: newImgList});
  };

  // 删除图片回调
  delCallback = index => {
    let newImgList = [...this.state[`imageList${index + 1}`]];
    newImgList.splice(index, 1);
    this.setState({[`imageList${index + 1}`]: newImgList});
  };

  // 处理签名完成
  handleSignature = signature => {
    this.setState(prevState => ({
      dataSource: {
        ...prevState.dataSource,
        SignContent: signature,
        SignTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    }));
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
        },
      }),
    );
  };

  render() {
    const {dataSource, selectedPollutants, FormMainID} = this.state;

    const deleteFormOptions = {
      headTitle: '提示',
      messText: '是否确定要删除表单',
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
          onpress: this.cancelButton,
        },
        {
          txt: '确定',
          btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
          txtStyle: {color: '#ffffff'},
          onpress: this.deleteForm,
        },
      ],
    };

    const options = {
      headTitle: '提示',
      messText: '是否确定要删除量程',
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
          onpress: this.cancelButton,
        },
        {
          txt: '确定',
          btnStyle: {backgroundColor: globalcolor.headerBackgroundColor},
          txtStyle: {color: '#ffffff'},
          onpress: () => {
            if (this.currentDeleteData) {
              const {pollutantId, rangeId, rangeToDelete} =
                this.currentDeleteData;
              this.confirm(pollutantId, rangeId, rangeToDelete);
            }
          },
        },
      ],
    };

    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View
            style={{
              width: '100%',
              height: 45,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: globalcolor.borderBottomColor,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: globalcolor.textBlack,
              }}>
              工作时间：
            </Text>
            <Text style={{fontSize: 14, color: globalcolor.datepickerGreyText}}>
              {dataSource.WorkingDateBegin} ～ {dataSource.WorkingDateEnd}
            </Text>
          </View>
          <FormInput
            {...commonFormInputProps}
            label={'维护管理单位'}
            placeholder="请记录"
            value={dataSource.MaintenanceManagementUnit || ''}
            onChangeText={text => {
              // 只更新对应字段，保持其他数据不变
              const newDataSource = {
                ...this.state.dataSource,
                MaintenanceManagementUnit: text,
              };
              // 确保 PointInfoList 的引用不变
              newDataSource.PointInfoList = this.state.dataSource.PointInfoList;
              this.setState({
                dataSource: newDataSource,
              });
            }}
          />
          <FormInput
            {...commonFormInputProps}
            label={'测试人员'}
            placeholder="请记录"
            value={dataSource.Tester || ''}
            onChangeText={text => {
              // 只更新对应字段，保持其他数据不变
              const newDataSource = {
                ...this.state.dataSource,
                Tester: text,
              };
              // 确保 PointInfoList 的引用不变
              newDataSource.PointInfoList = this.state.dataSource.PointInfoList;
              this.setState({
                dataSource: newDataSource,
              });
            }}
          />
          <FormDatePicker
            required={true}
            getPickerOption={() => ({
              defaultTime: dataSource.LastCheckTime,
              type: 'day',
              onSureClickListener: time => {
                // 只更新对应字段，保持其他数据不变
                const newDataSource = {
                  ...this.state.dataSource,
                  LastCheckTime: time,
                };
                // 确保 PointInfoList 的引用不变
                newDataSource.PointInfoList =
                  this.state.dataSource.PointInfoList;
                this.setState({
                  dataSource: newDataSource,
                });
              },
            })}
            label={'上次测试日期'}
            timeString={
              dataSource.LastCheckTime
                ? moment(dataSource.LastCheckTime).format('YYYY-MM-DD')
                : '请选择上次测试日期'
            }
          />
          <FormDatePicker
            required={true}
            getPickerOption={() => ({
              defaultTime: dataSource.CheckBTime,
              type: 'day',
              onSureClickListener: time => {
                // 只更新对应字段，保持其他数据不变
                const newDataSource = {
                  ...this.state.dataSource,
                  CheckBTime: time,
                };
                // 确保 PointInfoList 的引用不变
                newDataSource.PointInfoList =
                  this.state.dataSource.PointInfoList;
                this.setState({
                  dataSource: newDataSource,
                });
              },
            })}
            label={'本次测试开始时间'}
            timeString={
              dataSource.CheckBTime
                ? moment(dataSource.CheckBTime).format('YYYY-MM-DD HH:mm:ss')
                : '请选择本次测试开始时间'
            }
          />
          <FormDatePicker
            required={true}
            getPickerOption={() => ({
              defaultTime: dataSource.CheckETime,
              type: 'day',
              onSureClickListener: time => {
                // 只更新对应字段，保持其他数据不变
                const newDataSource = {
                  ...this.state.dataSource,
                  CheckETime: time,
                };
                // 确保 PointInfoList 的引用不变
                newDataSource.PointInfoList =
                  this.state.dataSource.PointInfoList;
                this.setState({
                  dataSource: newDataSource,
                });
              },
            })}
            label={'本次测试结束时间'}
            timeString={
              dataSource.CheckETime
                ? moment(dataSource.CheckETime).format('YYYY-MM-DD HH:mm:ss')
                : '请选择本次测试结束时间'
            }
          />
        </View>
        <MoreSelectTouchable
          ref={ref => (this._picker = ref)}
          option={this.getJzConfigItemOption()}
          style={styles.pickerContainer}>
          <View style={styles.pickerButton}>
            <Text style={styles.pickerButtonText}>{'选择污染物'}</Text>
          </View>
        </MoreSelectTouchable>

        <ScrollView style={styles.scrollView}>
          {selectedPollutants.map(pollutant =>
            this.renderPollutantCard(pollutant),
          )}

          {IMAGE_LIST.map((item, index) => {
            console.log('this.state[item.key]', this.state[item.key]);
            return (
              <View style={styles.content2}>
                <Text style={styles.title}>
                  <Text style={[{fontSize: 15, color: 'red'}]}>*</Text>
                  {item.name}：
                </Text>
                <ImageGrid
                  componentType={'normalWaterMaskCamera'}
                  style={{
                    backgroundColor: '#fff',
                  }}
                  Imgs={this.state[`imageList${index + 1}`]}
                  isUpload={true}
                  isDel={true}
                  UUID={this.state[item.key]}
                  uploadCallback={items => {
                    this.uploadCallback(items, index + 1);
                  }}
                  delCallback={index => {
                    this.delCallback(index);
                  }}
                />
              </View>
            );
          })}
          <Text style={styles.title}>
            <Text style={[{fontSize: 15, color: 'red'}]}>*</Text>
            签名：
          </Text>
          <TouchableOpacity
            style={styles.signatureContainer}
            onPress={this.openSignaturePage}>
            {dataSource.SignContent ? (
              <Image
                source={{uri: dataSource.SignContent}}
                style={styles.signaturePreview}
              />
            ) : (
              <Text style={styles.signaturePlaceholder}>点击此处签名</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
        </View>
        {FormMainID && (
          <TouchableOpacity
            style={styles.deleteFormButton}
            onPress={() => {
              this.refs.deleteFormAlert.show();
            }}>
            <View style={styles.deleteFormButtonInner}>
              <Text style={styles.deleteFormButtonText}>{'删除'}</Text>
              <Text style={styles.deleteFormButtonText}>{'表单'}</Text>
            </View>
          </TouchableOpacity>
        )}
        <AlertDialog ref="deleteAlert" options={options} />
        <AlertDialog ref="deleteFormAlert" options={deleteFormOptions} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // content1: {
  //   flexDirection: 'column',
  //   backgroundColor: '#ffffff',
  //   borderRadius: 2,
  //   paddingLeft: 10,
  //   paddingRight: 10,
  // },
  title: {
    marginLeft: 10,
    lineHeight: 36,
    fontSize: 15,
    color: '#333333',
  },
  signatureContainer: {
    width: SCREEN_WIDTH - 16,
    height: 80,
    backgroundColor: globalcolor.white,
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
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 6,
  },
  pickerContainer: {
    marginBottom: 6,
  },
  pickerButton: {
    width: SCREEN_WIDTH - 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  pickerButtonText: {
    fontSize: 15,
    color: globalcolor.taskImfoLabel,
  },
  scrollView: {
    width: SCREEN_WIDTH,
    marginBottom: 64,
    paddingHorizontal: 8,
  },
  pollutantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 8,
    // marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pollutantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    height: 36,
  },
  pollutantName: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  addRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: globalcolor.blue,
    borderRadius: 2,
  },
  addButtonIcon: {
    width: 12,
    height: 12,
    tintColor: globalcolor.blue,
    marginRight: 4,
  },
  addButtonText: {
    fontSize: 13,
    color: globalcolor.blue,
  },
  rangeList: {
    marginTop: 8,
  },
  rangeItemContainer: {
    marginBottom: 4,
    // borderBottomWidth: 1,
    // borderBottomColor: '#EAEAEA',
    paddingBottom: 4,
  },
  rangeHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    height: 28,
  },
  rangeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeTitle: {
    fontSize: 14,
    color: globalcolor.blue,
    fontWeight: '500',
  },
  statusTag: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 2,
    marginLeft: 8,
  },
  statusTagText: {
    fontSize: 12,
    color: globalcolor.blue,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 13,
    color: globalcolor.blue,
  },
  rangeContentButton: {
    backgroundColor: '#F8F8F8',
    borderRadius: 2,
    padding: 8,
  },
  rangeContent: {
    gap: 4,
  },
  rangeDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rangeLabel: {
    // fontSize: 14,
    color: '#666666',
    width: 70,
  },
  rangeValue: {
    // fontSize: 14,
    // color: '#333333',
    flex: 1,
  },
  evaluationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  evaluationLabel: {
    fontSize: 14,
    color: '#666666',
    width: 70,
  },
  evaluationValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  deleteFormButton: {
    position: 'absolute',
    right: 18,
    bottom: 60,
  },
  deleteFormButtonInner: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteFormButtonText: {
    color: '#ffffff',
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
});

export default connect(({indicationErrorAndResponseTimeModel}) => ({
  list: indicationErrorAndResponseTimeModel.list,
}))(IndicationErrorAndResponseTimeList);
