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
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import {SCREEN_WIDTH} from '../../../../config/globalsize';
import FormInput from '../components/FormInput';
import globalcolor from '../../../../config/globalcolor';
import {MoreSelectTouchable} from '../../../../components';
import {connect} from 'react-redux';
import {
  createAction,
  NavigationActions,
  createNavigationOptions,
  getPlatformValue,
  SentencedToEmpty,
  ShowToast,
  ShowLoadingToast,
  CloseToast,
} from '../../../../utils';
import AlertDialog from '../../../../components/modal/AlertDialog';

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

class IndicationErrorAndResponseTimeList extends Component {
  static navigationOptions = createNavigationOptions({
    title: '设备保养记录表',
    headerTitleStyle: {marginRight: Platform.OS === 'android' ? 76 : 0},
  });

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
    }
  }

  // 获取页面初始数据
  getPageData = () => {
    const {params} = this.props.route.params;
    this.props.dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/GetIndicationErrorSystemResponseRecordList',
      )({
        params: {
          taskID: params.TaskID,
          typeID: params.TypeID,
        },
        callback: res => {
          console.log('res', res);
          this.setState({
            dataSource: res,
          });
          if (!params.FormMainID) {
            this.setState({
              FormMainID: res.FormMainID,
            });
            this.props.dispatch(
              createAction('taskDetailModel/updateFormStatus')({
                cID: 74,
                isAdd: true,
              }),
            );
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

  // 删除整个表单
  deleteForm = () => {
    const {FormMainID} = this.state;
    ShowLoadingToast('正在删除表单');
    this.props.dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/DeleteErrorSystemResponseRecord',
      )({
        params: {
          FormMainID,
        },
        callback: () => {
          CloseToast();
          // this.props.navigation.goBack();
          this.props.dispatch(NavigationActions.back());
          this.props.dispatch(
            createAction('taskDetailModel/updateFormStatus')({
              cID: 74,
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
    const {dataSource} = this.state;

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

      // 跳转到量程编辑页面
      this.props.dispatch(
        NavigationActions.navigate({
          routeName: 'IndicationErrorAndResponseTimeEditor',
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
            onResult: () => {
              this.props.dispatch(
                createAction('taskDetailModel/updateFormStatus')({
                  cID: 74,
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
                <Text style={styles.evaluationValue}>{rangeData.Col1}</Text>
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
              source={require('../../../../images/jiarecord.png')}
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
        </ScrollView>
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
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 24,
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
    marginBottom: 6,
  },
  pollutantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 8,
    marginHorizontal: 8,
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
    bottom: 40,
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
});

export default connect(({indicationErrorAndResponseTimeModel}) => ({
  list: indicationErrorAndResponseTimeModel.list,
}))(IndicationErrorAndResponseTimeList);
