/*
 * @Description: 示值误差和响应时间 编辑器
 * @LastEditors: hxf
 * @Date: 2025-02-26 17:20:49
 * @LastEditTime: 2025-02-26 17:21:05
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/IndicationErrorAndResponseTimeEditor.js
 */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SCREEN_WIDTH} from '../../../../config/globalsize';
import FormInput from '../components/FormInput';
import FormDatePicker from '../components/FormDatePicker';
import FormPicker from '../components/FormPicker';
import FormRangInput from '../components/FormRangInput';
import globalcolor from '../../../../config/globalcolor';
import {PickerTouchable, MoreSelectTouchable} from '../../../../components';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {
  ShowToast,
  createAction,
  ShowLoadingToast,
  CloseToast,
} from '../../../../utils';

// 完成标识组件
const CompletedIndicator = ({size = 16, style}) => (
  <View
    style={[
      styles.completedIndicator,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
      style,
    ]}>
    <Text style={[styles.completedText, {fontSize: size * 0.75}]}>✓</Text>
  </View>
);

// 通用的表单输入配置
const commonFormInputProps = {
  required: true,
  requireIconPosition: 'left',
  hasColon: true,
  propsLabelStyle: {
    // fontSize: 15,
    // color: '#333333',
  },
  propsTextStyle: {
    // color: '#333333',
    // fontSize: 14,
    // marginRight: 0,
  },
  keyboardType: 'default',
};

export default function IndicationErrorAndResponseTimeEditor({route}) {
  const dispatch = useDispatch();
  const {
    pollutant,
    rangeTitle,
    rangeData,
    rangeIndex,
    taskID,
    typeID,
    maintenanceManagementUnit,
    tester,
    UnitList,
    onResult,
  } = route.params.params;
  console.log('route', route);

  // 基本信息表单数据
  const [formData, setFormData] = useState({
    testDate: rangeData?.TestDate
      ? moment(rangeData.TestDate).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
    cemsManufacturer: rangeData?.CEMSPlant || pollutant.gasManufacturerName,
    cemsModelNumber: rangeData?.CEMSNumModel || pollutant.gasEquipment,
    cemsPrinciple: rangeData?.CEMSPrinciple || pollutant.AnalyticalMethod,
    unit: rangeData?.Unit,
    range: {
      min: rangeData?.MinRange || pollutant.MinRange,
      max: rangeData?.MaxRange || pollutant.MaxRange,
    },
  });

  // 从 ChildList 中获取示值误差和响应时间数据
  const getErrorAndResponseData = () => {
    if (!rangeData?.ChildList) return null;

    const errorData = {};
    const responseData = {};
    console.log('rangeData', rangeData);
    rangeData.ChildList.forEach(item => {
      if (item.RecordType === 1) {
        // 示值误差数据
        errorData[item.Sort] = {
          nominalValue: item.NominalValue || '',
          labelGas1: item.LabelGas1 || '',
          labelGas2: item.LabelGas2 || '',
          labelGas3: item.LabelGas3 || '',
          CEMSAvg: item.CEMSAvg || '-',
          IndicationError: item.IndicationError || '-',
          remarks: item.Remark || '',
          completed: !!(item.NominalValue && item.LabelGas1 && item.LabelGas2 && item.LabelGas3 && item.CEMSAvg && item.IndicationError),
        };
      } else if (item.RecordType === 2) {
        // 响应时间数据
        responseData[item.Sort] = {
          timeT1: item.TimeT1 || '',
          timeT2: item.TimeT2 || '',
          responseTime: item.ResponseTime || '-',
          TimeAvg: item.TimeAvg || '',  // 注意这里使用大写的 TimeAvg
        };
      }
    });

    return {errorData, responseData};
  };

  const initialData = getErrorAndResponseData();

  // 示值误差相关状态
  const [errorTabs, setErrorTabs] = useState([
    {
      title: '高浓度',
      active: true,
      completed: initialData?.errorData?.[1]?.completed || false,
      data: initialData?.errorData?.[1] || {
        nominalValue: '',
        labelGas1: '',
        labelGas2: '',
        labelGas3: '',
        CEMSAvg: '-',
        IndicationError: '-',
        remarks: '',
      },
    },
    {
      title: '中浓度',
      active: false,
      completed: initialData?.errorData?.[2]?.completed || false,
      data: initialData?.errorData?.[2] || {
        nominalValue: '',
        labelGas1: '',
        labelGas2: '',
        labelGas3: '',
        CEMSAvg: '-',
        IndicationError: '-',
        remarks: '',
      },
    },
    {
      title: '低浓度',
      active: false,
      completed: initialData?.errorData?.[3]?.completed || false,
      data: initialData?.errorData?.[3] || {
        nominalValue: '',
        labelGas1: '',
        labelGas2: '',
        labelGas3: '',
        CEMSAvg: '-',
        IndicationError: '-',
        remarks: '',
      },
    },
  ]);

  // 示值误差结果
  const [errorResult, setErrorResult] = useState({
    CEMSAvg: '-',
    IndicationError: rangeData?.SZWCValue || '-',
    completed: !!(rangeData?.SZWCValue && rangeData?.SZWCValue !== '-'),
  });

  // 响应时间相关状态
  const [responseTimeData, setResponseTimeData] = useState(() => {
    // 初始化响应时间数据
    const t1_1 = initialData?.responseData?.[1]?.timeT1 || '';
    const t1_2 = initialData?.responseData?.[1]?.timeT2 || '';
    const t2_1 = initialData?.responseData?.[2]?.timeT1 || '';
    const t2_2 = initialData?.responseData?.[2]?.timeT2 || '';
    const t3_1 = initialData?.responseData?.[3]?.timeT1 || '';
    const t3_2 = initialData?.responseData?.[3]?.timeT2 || '';

    // 使用 TimeAvg 作为平均值（注意大写）
    const average = initialData?.responseData?.[1]?.TimeAvg || '';

    // 检查是否所有必填字段都有值
    const hasAllValues = t1_1 && t1_2 && t2_1 && t2_2 && t3_1 && t3_2 && average;

    return {
      t1_1,
      t1_2,
      t2_1,
      t2_2,
      t3_1,
      t3_2,
      t1_result: t1_1 && t1_2 ? (parseFloat(t1_1) + parseFloat(t1_2)).toString() : '-',
      t2_result: t2_1 && t2_2 ? (parseFloat(t2_1) + parseFloat(t2_2)).toString() : '-',
      t3_result: t3_1 && t3_2 ? (parseFloat(t3_1) + parseFloat(t3_2)).toString() : '-',
      average,
      completed: hasAllValues,  // 根据所有字段是否都有值来设置 completed
    };
  });

  // 表单是否可提交
  const [canSubmit, setCanSubmit] = useState(false);

  // 添加 loading 状态
  const [loadingStates, setLoadingStates] = useState({
    calculating: false,
    calculatingResponseTime: false,
    submitting: false,
  });

  // 切换示值误差Tab
  const switchErrorTab = index => {
    const newTabs = errorTabs.map((tab, i) => ({
      ...tab,
      active: i === index,
    }));
    setErrorTabs(newTabs);
  };

  // 更新示值误差数据
  const updateErrorData = (
    field,
    value,
    tabIndex = errorTabs.findIndex(tab => tab.active),
  ) => {
    const newTabs = [...errorTabs];
    newTabs[tabIndex].data = {
      ...newTabs[tabIndex].data,
      [field]: value,
    };
    setErrorTabs(newTabs);
  };

  // 计算示值误差
  const calculateError = (
    tabIndex = errorTabs.findIndex(tab => tab.active),
  ) => {
    // 检查必填项
    const requiredFields = [
      'nominalValue',
      'labelGas1',
      'labelGas2',
      'labelGas3',
    ];
    const emptyFields = requiredFields.filter(
      field =>
        !errorTabs[tabIndex].data[field] ||
        errorTabs[tabIndex].data[field].trim() === '',
    );

    if (emptyFields.length > 0) {
      const fieldNames = {
        nominalValue: '标准气体浓度',
        labelGas1: 'CEMS显示值1',
        labelGas2: 'CEMS显示值2',
        labelGas3: 'CEMS显示值3',
      };
      ShowToast(`请填写${fieldNames[emptyFields[0]]}`);
      return;
    }

    // 检查输入值是否为有效数字
    const invalidFields = requiredFields.filter(field => {
      const value = errorTabs[tabIndex].data[field];
      return isNaN(parseFloat(value)) || parseFloat(value) < 0;
    });

    if (invalidFields.length > 0) {
      const fieldNames = {
        nominalValue: '标准气体浓度',
        labelGas1: 'CEMS显示值1',
        labelGas2: 'CEMS显示值2',
        labelGas3: 'CEMS显示值3',
      };
      ShowToast(`${fieldNames[invalidFields[0]]}必须是大于等于0的数字`);
      return;
    }

    // 设置计算中状态
    setLoadingStates(prev => ({...prev, calculating: true}));

    // 计算量程（最大值-最小值）
    const calculationRange =
      parseFloat(formData.range.max) - parseFloat(formData.range.min);

    dispatch(
      createAction('indicationErrorAndResponseTimeModel/GetIndicationError')({
        params: {
          nominalValue: errorTabs[tabIndex].data.nominalValue,
          labelGas1: errorTabs[tabIndex].data.labelGas1,
          labelGas2: errorTabs[tabIndex].data.labelGas2,
          labelGas3: errorTabs[tabIndex].data.labelGas3,
          range: calculationRange.toString(), // 传递计算后的量程值
          pollutantCode: pollutant.ChildID,
        },
        callback: res => {
          // 计算完成，关闭 loading
          setLoadingStates(prev => ({...prev, calculating: false}));
          console.log('计算示值误差结果', res);

          // 更新当前 tab 的完成状态和计算结果
          const updatedTabs = errorTabs.map((tab, idx) => {
            if (idx === tabIndex) {
              return {
                ...tab,
                completed: true,
                data: {
                  ...tab.data,
                  CEMSAvg: res.CEMSAvg?.toString() || '-',
                  IndicationError: res.IndicationError?.toString() || '-',
                },
              };
            }
            return tab;
          });

          // 更新 tabs 状态
          setErrorTabs(updatedTabs);

          // 检查是否所有 tab 都已完成
          checkAllErrorTabsCompleted(updatedTabs);
        },
      }),
    );
  };

  // 检查所有示值误差Tab是否都已完成
  const checkAllErrorTabsCompleted = (tabs = errorTabs) => {
    const allCompleted = tabs.every(tab => tab.completed);
    setErrorResult({
      ...errorResult,
      completed: allCompleted,
    });

    // 检查整个表单是否可提交
    checkFormCanSubmit(allCompleted, responseTimeData.completed);
  };

  // 更新响应时间数据
  const updateResponseTimeData = (field, value) => {
    const newData = {
      ...responseTimeData,
      [field]: value,
    };

    // 实时计算结果
    if (field.startsWith('t1_')) {
      const t1_1 = parseFloat(field === 't1_1' ? value : newData.t1_1) || 0;
      const t1_2 = parseFloat(field === 't1_2' ? value : newData.t1_2) || 0;
      newData.t1_result = (t1_1 + t1_2).toString();
    } else if (field.startsWith('t2_')) {
      const t2_1 = parseFloat(field === 't2_1' ? value : newData.t2_1) || 0;
      const t2_2 = parseFloat(field === 't2_2' ? value : newData.t2_2) || 0;
      newData.t2_result = (t2_1 + t2_2).toString();
    } else if (field.startsWith('t3_')) {
      const t3_1 = parseFloat(field === 't3_1' ? value : newData.t3_1) || 0;
      const t3_2 = parseFloat(field === 't3_2' ? value : newData.t3_2) || 0;
      newData.t3_result = (t3_1 + t3_2).toString();
    }

    setResponseTimeData(newData);
  };

  // 计算响应时间
  const calculateResponseTime = () => {
    // 检查是否所有字段都已填写
    const fields = ['t1_1', 't1_2', 't2_1', 't2_2', 't3_1', 't3_2'];
    const emptyFields = fields.filter(
      field =>
        !responseTimeData[field] || responseTimeData[field].trim() === '',
    );

    if (emptyFields.length > 0) {
      const fieldNames = {
        t1_1: 'T1第一次测量值',
        t1_2: 'T1第二次测量值',
        t2_1: 'T2第一次测量值',
        t2_2: 'T2第二次测量值',
        t3_1: 'T3第一次测量值',
        t3_2: 'T3第二次测量值',
      };
      ShowToast(`请填写${fieldNames[emptyFields[0]]}`);
      return;
    }

    // 检查输入值是否为有效数字
    const invalidFields = fields.filter(field => {
      const value = responseTimeData[field];
      return isNaN(parseFloat(value)) || parseFloat(value) < 0;
    });

    if (invalidFields.length > 0) {
      const fieldNames = {
        t1_1: 'T1第一次测量值',
        t1_2: 'T1第二次测量值',
        t2_1: 'T2第一次测量值',
        t2_2: 'T2第二次测量值',
        t3_1: 'T3第一次测量值',
        t3_2: 'T3第二次测量值',
      };
      ShowToast(`${fieldNames[invalidFields[0]]}必须是大于等于0的数字`);
      return;
    }

    // 设置计算中状态
    setLoadingStates(prev => ({...prev, calculatingResponseTime: true}));

    // 计算每组的和
    const t1 =
      parseFloat(responseTimeData.t1_1) + parseFloat(responseTimeData.t1_2);
    const t2 =
      parseFloat(responseTimeData.t2_1) + parseFloat(responseTimeData.t2_2);
    const t3 =
      parseFloat(responseTimeData.t3_1) + parseFloat(responseTimeData.t3_2);

    // 计算平均值，四舍五入不保留小数
    const average = Math.round((t1 + t2 + t3) / 3);

    // 模拟异步计算过程
    setTimeout(() => {
      setResponseTimeData({
        ...responseTimeData,
        average: average.toString(),
        completed: true,
      });

      // 计算完成，关闭 loading
      setLoadingStates(prev => ({...prev, calculatingResponseTime: false}));

      // 检查整个表单是否可提交
      checkFormCanSubmit(errorResult.completed, true);
    }, 500);
  };

  // 检查表单是否可提交
  const checkFormCanSubmit = (
    errorCompleted = errorResult.completed,
    responseCompleted = responseTimeData.completed,
  ) => {
    setCanSubmit(errorCompleted && responseCompleted);
  };

  // 更新标题
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: `${pollutant.Name} - ${rangeTitle}`,
    });
  }, []);

  // 检查表单是否可提交
  useEffect(() => {
    const errorCompleted = errorResult.completed;
    const responseCompleted = responseTimeData.completed;
    setCanSubmit(errorCompleted && responseCompleted);
  }, [errorResult.completed, responseTimeData.completed]);

  // 修改提交表单函数
  const submitForm = () => {
    // 检查必填项
    if (!formData.testDate) {
      ShowToast('请选择测试日期');
      return;
    }
    if (!formData.cemsManufacturer) {
      ShowToast('请输入CEMS生产商');
      return;
    }
    if (!formData.cemsModelNumber) {
      ShowToast('请输入CEMS型号、编号');
      return;
    }
    if (!formData.cemsPrinciple) {
      ShowToast('请输入CEMS原理');
      return;
    }
    if (!formData.unit) {
      ShowToast('请选择计量单位');
      return;
    }
    if (!formData.range.min || !formData.range.max) {
      ShowToast('请输入量程范围');
      return;
    }

    // 检查示值误差是否已完成计算
    if (!errorResult.completed) {
      ShowToast('请完成示值误差计算');
      return;
    }

    // 检查响应时间数据是否完整且已计算
    const responseTimeFields = ['t1_1', 't1_2', 't2_1', 't2_2', 't3_1', 't3_2'];
    const emptyResponseTimeFields = responseTimeFields.filter(
      field =>
        !responseTimeData[field] || responseTimeData[field].trim() === '',
    );

    if (emptyResponseTimeFields.length > 0) {
      const fieldNames = {
        t1_1: 'T1第一次测量值',
        t1_2: 'T1第二次测量值',
        t2_1: 'T2第一次测量值',
        t2_2: 'T2第二次测量值',
        t3_1: 'T3第一次测量值',
        t3_2: 'T3第二次测量值',
      };
      ShowToast(`请填写${fieldNames[emptyResponseTimeFields[0]]}`);
      return;
    }

    if (!responseTimeData.completed) {
      ShowToast('请完成响应时间计算');
      return;
    }

    // 显示加载提示
    ShowLoadingToast();

    // 组装记录列表数据
    const records = [
      // 示值误差记录 - 高浓度
      {
        recordType: 1,
        sort: 1,
        nominalValue: errorTabs[0].data.nominalValue,
        labelGas1: errorTabs[0].data.labelGas1,
        labelGas2: errorTabs[0].data.labelGas2,
        labelGas3: errorTabs[0].data.labelGas3,
        remark: errorTabs[0].data.remarks,
        cemsAvg: errorTabs[0].data.CEMSAvg,
        indicationError: errorTabs[0].data.IndicationError,
      },
      // 示值误差记录 - 中浓度
      {
        recordType: 1,
        sort: 2,
        nominalValue: errorTabs[1].data.nominalValue,
        labelGas1: errorTabs[1].data.labelGas1,
        labelGas2: errorTabs[1].data.labelGas2,
        labelGas3: errorTabs[1].data.labelGas3,
        remark: errorTabs[1].data.remarks,
        cemsAvg: errorTabs[1].data.CEMSAvg,
        indicationError: errorTabs[1].data.IndicationError,
      },
      // 示值误差记录 - 低浓度
      {
        recordType: 1,
        sort: 3,
        nominalValue: errorTabs[2].data.nominalValue,
        labelGas1: errorTabs[2].data.labelGas1,
        labelGas2: errorTabs[2].data.labelGas2,
        labelGas3: errorTabs[2].data.labelGas3,
        remark: errorTabs[2].data.remarks,
        cemsAvg: errorTabs[2].data.CEMSAvg,
        indicationError: errorTabs[2].data.IndicationError,
      },
      // 响应时间记录 - T1
      {
        recordType: 2,
        sort: 1,
        timeT1: responseTimeData.t1_1,
        timeT2: responseTimeData.t1_2,
        responseTime: responseTimeData.t1_result,
        timeAvg: responseTimeData.average,
      },
      // 响应时间记录 - T2
      {
        recordType: 2,
        sort: 2,
        timeT1: responseTimeData.t2_1,
        timeT2: responseTimeData.t2_2,
        responseTime: responseTimeData.t2_result,
        timeAvg: responseTimeData.average,
      },
      // 响应时间记录 - T3
      {
        recordType: 2,
        sort: 3,
        timeT1: responseTimeData.t3_1,
        timeT2: responseTimeData.t3_2,
        responseTime: responseTimeData.t3_result,
        timeAvg: responseTimeData.average,
      },
    ];

    // 提交表单时使用最小值,最大值格式
    const range = `${parseFloat(formData.range.min)},${parseFloat(
      formData.range.max,
    )}`;

    // 整理提交的数据
    const submitData = {
      taskID,
      typeID,
      content: {
        id: rangeData?.ID,
        maintenanceManagementUnit,
        tester,
        pollutantCode: pollutant.ChildID,
        testDate: formData.testDate,
        cemsPlant: formData.cemsManufacturer,
        cemsNumModel: formData.cemsModelNumber,
        cemsPrinciple: formData.cemsPrinciple,
        unit: formData.unit,
        range: range,
      },
      recordList: records,
    };
    console.log('submitData', submitData);
    dispatch(
      createAction(
        'indicationErrorAndResponseTimeModel/AddOrUpdateIndicationErrorSystemResponseRecord',
      )({
        params: submitData,
        callback: res => {
          // 关闭加载提示
          CloseToast();
          console.log('保存结果', res);
          navigation.goBack();
          onResult();
        },
      }),
    );
  };

  // 日期选择器配置
  const getTestDateOption = () => {
    return {
      defaultTime: formData.testDate,
      type: 'day',
      onSureClickListener: time => {
        setFormData({...formData, testDate: time});
      },
    };
  };

  // 计量单位选择器配置
  const getUnitOption = () => {
    return {
      codeKey: 'Name',
      nameKey: 'Name',
      defaultCode: formData.unit,
      dataArr: UnitList,
      onSelectListener: item => {
        setFormData({...formData, unit: item.Name });
      },
    };
  };

  // 渲染示值误差Tab标题
  const renderErrorTabTitles = () => {
    return (
      <View style={styles.tabContainer}>
        {errorTabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              tab.active ? styles.activeTabButton : null,
            ]}
            onPress={() => switchErrorTab(index)}>
            <View style={styles.tabTitleContainer}>
              <Text
                style={[
                  styles.tabText,
                  tab.active ? styles.activeTabText : null,
                ]}>
                {tab.title}
              </Text>
              {tab.completed && <CompletedIndicator style={{marginLeft: 4}} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染当前活动的示值误差Tab内容
  const renderActiveErrorTabContent = () => {
    const activeTab = errorTabs.find(tab => tab.active) || errorTabs[0];
    const activeIndex = errorTabs.findIndex(tab => tab.active);

    return (
      <View style={styles.tabContent}>
        <FormInput
          {...commonFormInputProps}
          label="标准气体浓度"
          placeholder="支持填写数字，包括小数点"
          keyboardType="numeric"
          value={activeTab.data.nominalValue}
          onChangeText={text => updateErrorData('nominalValue', text)}
        />

        <FormInput
          {...commonFormInputProps}
          label="CEMS显示值1"
          placeholder="支持填写数字，包括小数点"
          keyboardType="numeric"
          value={activeTab.data.labelGas1}
          onChangeText={text => updateErrorData('labelGas1', text)}
        />

        <FormInput
          {...commonFormInputProps}
          label="CEMS显示值2"
          placeholder="支持填写数字，包括小数点"
          keyboardType="numeric"
          value={activeTab.data.labelGas2}
          onChangeText={text => updateErrorData('labelGas2', text)}
        />

        <FormInput
          {...commonFormInputProps}
          label="CEMS显示值3"
          placeholder="支持填写数字，包括小数点"
          keyboardType="numeric"
          value={activeTab.data.labelGas3}
          onChangeText={text => updateErrorData('labelGas3', text)}
        />

        <TouchableOpacity
          style={[
            styles.calculateButton,
            loadingStates.calculating && styles.disabledButton,
          ]}
          disabled={loadingStates.calculating}
          onPress={() => calculateError(activeIndex)}>
          <Text style={styles.calculateButtonText}>
            {loadingStates.calculating ? '计算中...' : '计算'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            CEMS显示值的平均值: {activeTab.data.CEMSAvg}
          </Text>
          <Text style={styles.resultText}>
            示值误差 (%): {activeTab.data.IndicationError}
          </Text>
        </View>

        <View style={styles.remarksContainer}>
          <Text style={styles.remarksTitle}>备注</Text>
          <TextInput
            style={styles.remarksInput}
            value={activeTab.data.remarks}
            onChangeText={text => updateErrorData('remarks', text)}
            placeholder="请输入备注信息"
            placeholderTextColor="#999999"
            multiline={true}
            numberOfLines={4}
          />
        </View>
      </View>
    );
  };
  console.log('responseTimeData', responseTimeData);
  // 渲染响应时间内容
  const renderResponseTimeContent = () => {
    return (
      <View style={styles.responseTimeContainer}>
        {/* T1 测量组 */}
        <View style={styles.responseTimeRow}>
          <View style={styles.responseLabelContainer}>
            <Text style={styles.requiredStar}>*</Text>
            <Text style={styles.responseTimeLabel}>T1:</Text>
          </View>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t1_1}
            onChangeText={text => updateResponseTimeData('t1_1', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>+</Text>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t1_2}
            onChangeText={text => updateResponseTimeData('t1_2', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>=</Text>
          <Text style={styles.responseTimeResult}>
            {responseTimeData.t1_result || '-'}
          </Text>
        </View>

        {/* T2 测量组 */}
        <View style={styles.responseTimeRow}>
          <View style={styles.responseLabelContainer}>
            <Text style={styles.requiredStar}>*</Text>
            <Text style={styles.responseTimeLabel}>T2:</Text>
          </View>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t2_1}
            onChangeText={text => updateResponseTimeData('t2_1', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>+</Text>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t2_2}
            onChangeText={text => updateResponseTimeData('t2_2', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>=</Text>
          <Text style={styles.responseTimeResult}>
            {responseTimeData.t2_result || '-'}
          </Text>
        </View>

        {/* T3 测量组 */}
        <View style={styles.responseTimeRow}>
          <View style={styles.responseLabelContainer}>
            <Text style={styles.requiredStar}>*</Text>
            <Text style={styles.responseTimeLabel}>T3:</Text>
          </View>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t3_1}
            onChangeText={text => updateResponseTimeData('t3_1', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>+</Text>
          <TextInput
            style={styles.responseTimeInput}
            value={responseTimeData.t3_2}
            onChangeText={text => updateResponseTimeData('t3_2', text)}
            placeholder="请输入"
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
          <Text style={styles.responseTimeOperator}>=</Text>
          <Text style={styles.responseTimeResult}>
            {responseTimeData.t3_result || '-'}
          </Text>
        </View>

        <View style={styles.responseTimeActionRow}>
          <TouchableOpacity
            style={[
              styles.calculateButton,
              {marginVertical: 0},
              loadingStates.calculatingResponseTime && styles.disabledButton,
            ]}
            disabled={loadingStates.calculatingResponseTime}
            onPress={calculateResponseTime}>
            <Text style={styles.calculateButtonText}>
              {loadingStates.calculatingResponseTime ? '计算中...' : '计算'}
            </Text>
          </TouchableOpacity>
            {console.log('responseTimeData', responseTimeData)}
          {responseTimeData.completed && (
            <View
              style={[
                styles.resultContainer,
                {flex: 1, marginBottom: 0, marginLeft: 15},
              ]}>
              <Text style={styles.resultText}>
                平均值: {responseTimeData.average}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* 基本信息部分 */}
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>基本信息</Text>
          </View>
          <View style={styles.formCard}>
            <FormDatePicker
              required={true}
              requireIconPosition="left"
              hasColon={true}
              //   propsTextStyle={{
              //     color: '#333333',
              //     fontSize: 14,
              //     marginRight: 0,
              //   }}
              label="测试日期"
              timeString={formData.testDate}
              getPickerOption={getTestDateOption}
            />

            <FormInput
              {...commonFormInputProps}
              label="CEMS生产商"
              placeholder="请输入CEMS生产商"
              value={formData.cemsManufacturer}
              onChangeText={text =>
                setFormData({...formData, cemsManufacturer: text})
              }
            />

            <FormInput
              {...commonFormInputProps}
              label="CEMS型号、编号"
              placeholder="请输入CEMS型号、编号"
              value={formData.cemsModelNumber}
              onChangeText={text =>
                setFormData({...formData, cemsModelNumber: text})
              }
            />

            <FormInput
              {...commonFormInputProps}
              label="CEMS原理"
              placeholder="请输入CEMS原理"
              value={formData.cemsPrinciple}
              onChangeText={text =>
                setFormData({...formData, cemsPrinciple: text})
              }
            />

            <FormPicker
              required={true}
              requireIconPosition="left"
              hasColon={true}
              propsLabelStyle={{
                color: '#333333',
              }}
              propsTextStyle={{
                fontSize: 14,
                marginRight: 0,
              }}
              label="计量单位"
              option={getUnitOption()}
              defaultCode={formData.unit}
              // showText={UnitList.find(item => item.ChildID === formData.unit)?.Name || ''}
              showText={formData.unit || ''}
              placeHolder="请选择计量单位"
            />

            <FormRangInput
              required={true}
              requireIconPosition="left"
              hasColon={true}
              propsLabelStyle={{
                fontSize: 15,
                color: '#333333',
              }}
              propsTextStyle={{
                color: '#333333',
                fontSize: 14,
                marginRight: 0,
              }}
              label="量程"
              rangSeparator="-"
              lowerLimitValue={formData.range.min}
              upperLimitValue={formData.range.max}
              onChangeText={([min, max]) =>
                setFormData({...formData, range: {min, max}})
              }
              last={true}
            />
          </View>

          {/* 示值误差部分 */}
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>示值误差</Text>
            {errorResult.completed && (
              <CompletedIndicator size={18} style={{marginLeft: 8}} />
            )}
          </View>
          <View style={styles.formCard}>
            {renderErrorTabTitles()}
            {renderActiveErrorTabContent()}
          </View>

          {/* 响应时间部分 */}
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>响应时间</Text>
            {responseTimeData.completed && (
              <CompletedIndicator size={18} style={{marginLeft: 8}} />
            )}
          </View>
          <View style={styles.formCard}>{renderResponseTimeContent()}</View>
        </View>
      </ScrollView>

      {/* 提交按钮 - 固定在底部 */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
          <Text style={styles.submitButtonText}>提交</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingBottom: 84,
  },
  sectionHeaderContainer: {
    width: SCREEN_WIDTH - 28,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  sectionHeader: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '400',
  },
  sectionCompletedIndicator: {
    marginLeft: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  formCard: {
    width: SCREEN_WIDTH - 24,
    paddingHorizontal: 24,
    borderRadius: 2,
    backgroundColor: globalcolor.white,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: globalcolor.blue,
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: globalcolor.blue,
    fontWeight: '500',
  },
  tabContent: {
    width: '100%',
  },
  calculateButton: {
    width: 116,
    height: 30,
    backgroundColor: globalcolor.blue,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 15,
  },
  calculateButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  resultContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    marginBottom: 2,
  },
  resultText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 24,
  },
  responseTimeContainer: {
    width: '100%',
    paddingVertical: 20,
  },
  responseTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  responseTimeLabel: {
    color: '#333333',
    fontWeight: '500',
    width: 40,
  },
  responseTimeInput: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  responseTimeOperator: {
    fontSize: 16,
    color: '#666666',
    marginHorizontal: 10,
  },
  responseTimeResult: {
    // fontSize: 15,
    color: '#333333',
    fontWeight: '500',
    marginLeft: 5,
    minWidth: 40,
  },
  remarksContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  remarksTitle: {
    // fontSize: 15,
    color: '#333333',
    marginBottom: 2,
    fontWeight: '400',
  },
  remarksInput: {
    width: '100%',
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333333',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 4,
    padding: 8,
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
  submitButton: {
    width: SCREEN_WIDTH - 40,
    height: 44,
    backgroundColor: globalcolor.blue,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tabTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedIndicator: {
    backgroundColor: '#52c41a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  responseTimeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    // marginTop: 20,
    // marginBottom: 15,
  },
  responseLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  requiredStar: {
    color: '#ff4d4f',
    marginRight: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
