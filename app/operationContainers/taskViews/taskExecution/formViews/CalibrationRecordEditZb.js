//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, ScrollView, TextInput, LogBox } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import MyTextInput from '../../../../components/base/TextInput';
import { ModalParent, OperationAlertDialog, SimpleLoadingComponent, SDLText } from '../../../../components';
import Mask from '../../../../components/Mask';
import ConfirmDialog from '../components/ConfirmDialog';
import { ShowToast, createAction, NavigationActions, SentencedToEmpty } from '../../../../utils';
import FormRangInput from '../components/FormRangInput';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import { accAdd, accSub, accMul, accDiv } from '../../../../utils/numutil'
import ImageGrid from '../../../../components/form/images/ImageGrid';

const saveItem = 0;
const deleteItem = 1;
const rangSeparator = '-';
/**
 * 校准记录表 淄博
 */

// create a component
@connect(({ calibrationRecordZb }) => ({
    RecordList: calibrationRecordZb.RecordList,
    unitsList: calibrationRecordZb.unitsList,
    editstatus: calibrationRecordZb.editstatus,
    JzConfigItemSelectedList: calibrationRecordZb.JzConfigItemSelectedList,
}))
// @connect() 
class CalibrationRecordEditZb extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerMode: 'float',
            title: navigation.state.params.item.ItemID + '校准记录表',
            tabBarLable: '校准记录表',
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS == 'android' ? 75 : 13 }, //标题居中
            headerStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                height: 45
            }
        };
    };

    constructor(props) {
        super(props);
        const item = props.route.params.params.item;
        // const { ItemId } = item;
        // let pic1Name, pic2Name, pic3Name, pic4Name, noSelectedFlag;
        // switch (ItemId) {
        //     case '770':
        //     case '771':
        //     case '772':
        //     case '774':
        //         //  SO2/NO/O2/NO2
        //         pic1Name = 'JZQSZ';
        //         pic2Name = 'JZHLDSZ';
        //         pic3Name = 'JZHLCSZ';
        //         pic4Name = 'SYBQNDJBQ';
        //         noSelectedFlag = this.props.RecordList.some(seletedItem =>
        //             ['770', '771', '772', '774'].includes(seletedItem.ItemId) &&
        //             (seletedItem?.[pic1Name + '_PIC']?.ImgNameList?.length ||
        //                 seletedItem?.[pic2Name + '_PIC']?.ImgNameList?.length) &&
        //             (!item?.[pic1Name + '_PIC']?.ImgNameList?.length)
        //         )

        //         break;
        //     case '780': //流速
        //         pic1Name = 'JZUSZJGZZ';
        //         pic2Name = 'JZDSZJGZZ';
        //         break;
        //     case '782': //湿度
        //         pic1Name = 'TRKQDQCLZ';
        //         pic2Name = 'SDYQWHGZ';
        //         break;
        //     default:
        //         pic1Name = 'LDSZU';
        //         pic2Name = 'LDSZD';
        //         pic3Name = 'LCSJU';
        //         pic4Name = 'LCSJD';
        //         break;
        // }

        // 初始化第一个模块数据，直接从 item 获取数据
        const initialModuleData = {
            ID: item.ID || '',
            ItemId: item.ItemId || '',  // 添加 ItemId 到模块数据中
            LqNdz: item.LqNdz || '',
            LdLastCalibrationValue: item.LdLastCalibrationValue || '',
            LdCalibrationPreValue: item.LdCalibrationPreValue || '',
            LdCalibrationSufValue: item.LdCalibrationSufValue || '',
            LdPy: item.LdPy || '',
            LdCalibrationIsOk: item.LdCalibrationIsOk || ''
        };
        this.state = {
            ID: item.ID || '',
            ItemId: item.ItemId || '',  // 保持在 state 中
            ItemID: item.ItemID || '',  // 用于显示
            ItemName: item.ItemName || '',
            IsLiangCheng: item.IsLiangCheng || 0,
            modules: [initialModuleData],  // 初始只有一个模块
            BqNdz: item.BqNdz || '',
            IsChange: item.IsChange || 0,
            LcNewCalibrationPreValue: item.LcNewCalibrationPreValue || '',
            LcLastCalibrationValue: item.LcLastCalibrationValue || '',
            LcCalibrationPreValue: item.LcCalibrationPreValue || '',
            LcCalibrationSufValue: item.LcCalibrationSufValue || '',
            LcPy: item.LcPy || '',
            LcCalibrationIsOk: item.LcCalibrationIsOk || '',
            FormMainID: item.FormMainID || '',
            FxyYl: item.FxyYl || '',
            FxyLc: item.FxyLc || '',
            JlUnit: item.JlUnit || '',
            dialogType: saveItem,
            TRQT: item.TRQT || '',
            Remark: item.Remark || '',
            // noSelectedFlag, //SO2/NO/O2/NO2 之前有选中过校准前数值和校准后零点数值照片 后面选的这两个不是必选
            // pic1Name, pic2Name, pic3Name, pic4Name,
            // [pic1Name]: item?.[pic1Name + '_PIC']?.AttachID || new Date().getTime() + pic1Name?.toLowerCase(),
            // [pic2Name]: item?.[pic2Name + '_PIC']?.AttachID || new Date().getTime() + pic2Name?.toLowerCase(),
            // [pic3Name]: item?.[pic3Name + '_PIC']?.AttachID || new Date().getTime() + pic3Name?.toLowerCase(),
            // [pic4Name]: item?.[pic4Name + '_PIC']?.AttachID || new Date().getTime() + pic4Name?.toLowerCase(),
            // [pic1Name + '_PIC']: item?.[pic1Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
            // [pic2Name + '_PIC']: item?.[pic2Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
            // [pic3Name + '_PIC']: item?.[pic3Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
            // [pic4Name + '_PIC']: item?.[pic4Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
        };

        this.props.navigation.setOptions({
            title: item.ItemID + '校准记录表',
        });

    }
    componentWillMount() {
        const item = this.props.route.params.params.item;
        const { ItemId } = item;
        let pic1Name, pic2Name, pic3Name, pic4Name, noSelectedFlag=false;
        switch (ItemId) {
            case '770':
            case '771':
            case '772':
            case '774':
                //  SO2/NO/O2/NO2
                pic1Name = 'JZQSZ';
                pic2Name = 'JZHLDSZ';
                pic3Name = 'JZHLCSZ';
                pic4Name = 'SYBQNDJBQ';
                noSelectedFlag = this.props.RecordList.some(seletedItem =>
                    ['770', '771', '772', '774'].includes(seletedItem.ItemId) &&
                    (seletedItem?.[pic1Name + '_PIC']?.ImgNameList?.length ||
                        seletedItem?.[pic2Name + '_PIC']?.ImgNameList?.length) &&
                    (!item?.[pic1Name + '_PIC']?.ImgNameList?.length)
                )

                break;
            case '780': //流速
                pic1Name = 'JZUSZJGZZ';
                pic2Name = 'JZDSZJGZZ';
                break;
            case '782': //湿度
                pic1Name = 'TRKQDQCLZ';
                pic2Name = 'SDYQWHGZ';
                break;
            default:
                pic1Name = 'LDSZU';
                pic2Name = 'LDSZD';
                pic3Name = 'LCSJU';
                pic4Name = 'LCSJD';
                break;
        }
        if(ItemId==780 || ItemId==782){
            this.setState({
                pic1Name, pic2Name,
                [pic1Name]: item?.[pic1Name + '_PIC']?.AttachID || new Date().getTime() + pic1Name?.toLowerCase(),
                [pic2Name]: item?.[pic2Name + '_PIC']?.AttachID || new Date().getTime() + pic2Name?.toLowerCase(),
                [pic1Name + '_PIC']: item?.[pic1Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
                [pic2Name + '_PIC']: item?.[pic2Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
            })
        }else{
            this.setState({
                noSelectedFlag,
                pic1Name, pic2Name, pic3Name, pic4Name,
                [pic1Name]: item?.[pic1Name + '_PIC']?.AttachID || new Date().getTime() + pic1Name?.toLowerCase(),
                [pic2Name]: item?.[pic2Name + '_PIC']?.AttachID || new Date().getTime() + pic2Name?.toLowerCase(),
                [pic3Name]: item?.[pic3Name + '_PIC']?.AttachID || new Date().getTime() + pic3Name?.toLowerCase(),
                [pic4Name]: item?.[pic4Name + '_PIC']?.AttachID || new Date().getTime() + pic4Name?.toLowerCase(),
                [pic1Name + '_PIC']: item?.[pic1Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
                [pic2Name + '_PIC']: item?.[pic2Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
                [pic3Name + '_PIC']: item?.[pic3Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
                [pic4Name + '_PIC']: item?.[pic4Name + '_PIC']?.ImgNameList?.map(item => ({ AttachID: item, })) || [],
            })
        }
  
    }

    addNewModule = () => {
        const newModule = {
            ID: '',  // 新模块的 ID 为空
            ItemId: this.state.ItemId,  // 从 state 中获取 ItemId
            LqNdz: '',
            LdLastCalibrationValue: this.state.modules[0].LdLastCalibrationValue, // 使用第一个模块的值
            LdCalibrationPreValue: '',
            LdCalibrationSufValue: '',
            LdPy: '',
            LdCalibrationIsOk: ''
        };
        this.setState({
            modules: [...this.state.modules, newModule]
        });
    }

    removeModule = (index) => {
        const newModules = this.state.modules.filter((_, i) => i !== index);
        this.setState({
            modules: newModules
        });
    }

    updateModuleData = (index, fieldOrUpdates, value) => {
        const newModules = [...this.state.modules];
        newModules[index] = {
            ...newModules[index],
            ...(typeof fieldOrUpdates === 'object' ? fieldOrUpdates : { [fieldOrUpdates]: value })
        };
        this.setState({
            modules: newModules
        });
    }

    _renderModal = () => {
        return (
            <ModalParent ref={ref => (this._modalParent = ref)}>
                <Mask
                    hideDialog={() => {
                        this._modalParent.hideModal();
                        this.setState({ doConfirm: false });
                    }}
                    style={{ justifyContent: 'center' }}
                >
                    <ConfirmDialog
                        title={'确认'}
                        description={this.state.dialogType == deleteItem ? '确认删除该校准记录吗？' : '确认提交' + this.props.route.params.params.item.ItemID + '校准记录吗？'}
                        doPositive={() => {
                            //dialog确定
                            if (this.state.dialogType == deleteItem) {
                                //删除记录
                                this.props.dispatch(createAction('calibrationRecordZb/updateState')({
                                    jzDeleteResult: { status: -1 }
                                }));
                                this.props.dispatch(createAction('calibrationRecordZb/deleteJzItem')({
                                    params: { ID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ID'], 'empty') },
                                    callback: () => {
                                        let index = this.props.JzConfigItemSelectedList.findIndex((seletedItem, selectedIndex) => {
                                            if (seletedItem.ItemID
                                                == SentencedToEmpty(this.props
                                                    , ['route', 'params', 'params', 'item', 'ItemID'], '')) {
                                                return true;
                                            }
                                        });
                                        if (index != -1) {
                                            let newData = this.props.JzConfigItemSelectedList.concat([]);
                                            newData.splice(index, 1);
                                            this.props.dispatch(createAction('calibrationRecordZb/updateState')({
                                                JzConfigItemSelectedList: newData, liststatus: { status: -1 }, JzConfigItemResult: { status: -1 },
                                            }));
                                        }
                                        this.props.dispatch(NavigationActions.back());
                                        this.props.dispatch(createAction('calibrationRecordZb/getJzItem')({}));
                                    }
                                }));
                            } else {
                                this.props.dispatch(
                                    createAction('calibrationRecordZb/saveItem')({
                                        index: this.props.route.params.params.index,
                                        record: this.state,
                                        callback: () => {
                                            this.props.dispatch(createAction('calibrationRecordZb/getInfo')({ createForm: false }));
                                            this._modalParent.hideModal();
                                            this.props.dispatch(NavigationActions.back());
                                        }
                                    })
                                );
                            }
                        }}
                        doNegative={() => {
                            //dialog取消
                            this._modalParent.hideModal();
                            this.setState({ doConfirm: false, willingAddForm: {} });
                        }}
                    />
                </Mask>
            </ModalParent>
        );
    };
    /**
     * {
                    "ID":"0f0d7b42-d69a-4bb3-b40b-97834526bf95",
                    "ItemID":"颗粒物",
                    "LqNdz":"3",        //零气浓度值
                    "LdLastCalibrationValue":"33",//上一次校准值
                    "LdCalibrationPreValue":"44",//校准前
                    "LdPy":"55",        //零点漂移%F.S.
                    "LdCalibrationIsOk":"是",//是否正常
                    "LdCalibrationSufValue":"66",//校准后
                    "BqNdz":"77",        //标气浓度值
                    "LcLastCalibrationValue":"88",//量程 上一次校准值
                    "LcCalibrationPreValue":"999",//校准前
                    "LcPy":"10111",     //量程漂移%F.S.
                    "LcCalibrationIsOk":"是",//是否正常
                    "LcCalibrationSufValue":"222",//校准后
                    "FormMainID":"d2409e78-8d89-42f7-b17f-017d24cc61ce",   //主表ID
                    "FxyYl":"52",           //分析仪原理
                    "FxyLc":"45",          //分析仪量程
                    "JlUnit":"26"//计量单位
                }
     */
    /**
     * 判断数字是否存在异常
    */
    testNumberException = (param) => {
        // 处理 undefined 和 null
        if (param === undefined || param === null) {
            return true;
        }
        // 处理空字符串
        if (param === '') {
            return true;
        }
        // 转换为数字
        let sample = Number(param);
        // 检查是否为 NaN
        if (isNaN(sample)) {
            return true;
        }
        // 检查是否为有效的数字格式（整数或小数）
        if (!(/^-?[0-9]+$/.test(param) || /^-?[0-9]+\.?[0-9]+?$/.test(param))) {
            return true;
        }
        return false;
    };

    //零点测试
    _zeroTest = (moduleIndex) => {
        console.log('开始零点测试，模块索引:', moduleIndex);
        console.log('测试前模块数据:', this.state.modules[moduleIndex]);

        if (typeof this.state.FxyLc == 'undefined' || !this.state.FxyLc || this.state.FxyLc.indexOf('-') == -1) {
            ShowToast('量程非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }
        let [min, max] = this.state.FxyLc.split('-');
        if (this.testNumberException(min)) {
            ShowToast('量程非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }
        if (this.testNumberException(max)) {
            ShowToast('量程非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }
        if (Number(min) >= Number(max)) {
            ShowToast('量程非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }
        let range = Number(max) - Number(min);
        // 校验零气浓度是否合理

        if (this.testNumberException(this.state.modules[moduleIndex].LqNdz)) {
            ShowToast('零点校准 零气浓度值非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }
        let LqNdz = Number(this.state.modules[moduleIndex].LqNdz);

        let LdLastCalibrationValue = this.state.modules[moduleIndex].LdLastCalibrationValue;
        if (this.testNumberException(LdLastCalibrationValue)) {
            ShowToast('零点校准 上次校准测试值非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }

        let LdCalibrationPreValue = this.state.modules[moduleIndex].LdCalibrationPreValue;
        if (this.testNumberException(LdCalibrationPreValue)) {
            ShowToast('零点校准 校准前测试值非法');
            this.updateModuleData(moduleIndex, {
                LdPy: '',
                LdCalibrationIsOk: ''
            });
            return;
        }

        // 计算公式：(校前测试值-上次校准后测试值)/量程
        let result = accDiv(accSub(LdCalibrationPreValue, LdLastCalibrationValue), range);
        console.log('零点漂移计算结果:', result, '校前测试值:', LdCalibrationPreValue, '上次校准后测试值:', LdLastCalibrationValue, '量程:', range);

        let signBit = '';
        if (result < 0) {
            signBit = '-';
        }
        let resultAbs = Math.round(Math.abs(result) * 10000);
        let strLength = (resultAbs + '').length;
        let prefix = '';
        if (strLength > 2) {
            prefix = (resultAbs + '').substr(0, strLength - 2);
        } else {
            prefix = '';
        }
        let suffix = (resultAbs + '').substr(strLength - 2, strLength);
        let suffixLength = suffix.length;
        let zhenshiLDPY = result;

        // 格式化显示的结果
        let formattedResult = signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%';
        console.log('格式化后的零点漂移结果:', formattedResult);

        let isOk = '';
        if (this.state.ItemId == '773') {
            //ItemID: "颗粒物"  ItemId: "773"
            isOk = Math.abs(zhenshiLDPY) <= 0.02 ? '是' : '否';
        } else if (this.state.ItemId == '780' || this.state.ItemId == '782') {
            // ItemID: "流速"   ItemId: "780"
            isOk = Math.abs(zhenshiLDPY) <= 0.03 ? '是' : '否';
        } else {
            isOk = Math.abs(zhenshiLDPY) <= 0.025 ? '是' : '否';
        }

        console.log('设置仪器校准是否正常:', isOk);

        this.updateModuleData(moduleIndex, {
            LdPy: formattedResult,
            LdCalibrationIsOk: isOk
        });
    };

    renderZeroCalibrationModule = (module, index) => {
        return (
            <View key={index} style={{ marginTop: index > 0 ? 20 : 0 }}>
                <View style={[{ flexDirection: 'row', alignItems: 'center', height: 40, width: SCREEN_WIDTH - 28 }]}>
                    <Text style={[{ color: '#333333', flex: 1, marginVertical: 12 }]}>
                        {this.state.ItemId === '780' || this.state.ItemId === '782' ? `零点漂移校准（差压表 ${this.props.route.params.params.index + index + 1})` : '零点漂移校准'}
                    </Text>
                    {(this.state.ItemId === '780' || this.state.ItemId === '782') && (
                        <View style={{ flexDirection: 'row' }}>
                            {index === 0 && (
                                <TouchableOpacity
                                    onPress={this.addNewModule}
                                    style={{
                                        marginLeft: 10,
                                        height: 24,
                                        width: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: globalcolor.blue,
                                        borderRadius: 4
                                    }}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 20,
                                        fontWeight: '300',
                                        marginTop: -2,
                                        textAlign: 'center'
                                    }}>+</Text>
                                </TouchableOpacity>
                            )}
                            {index > 0 && (
                                <TouchableOpacity
                                    onPress={() => this.removeModule(index)}
                                    style={{
                                        marginLeft: 10,
                                        height: 24,
                                        width: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: globalcolor.orange,
                                        borderRadius: 4
                                    }}
                                >
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 20,
                                        fontWeight: '300',
                                        marginTop: -2,
                                        textAlign: 'center'
                                    }}>-</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
                <View style={[{ width: SCREEN_WIDTH - 24, paddingHorizontal: 24, borderRadius: 2, backgroundColor: globalcolor.white, alignItems: 'center' }]}>
                    <View style={[styles.layoutWithBottomBorder]}>
                        <Text style={[styles.labelStyle]}>零气浓度值：</Text>
                        <MyTextInput
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={module.LqNdz}
                            style={[styles.textStyle, { flex: 1 }]}
                            placeholder={'请填写零气浓度值'}
                            onChangeText={text => {
                                this.updateModuleData(index, 'LqNdz', text);
                            }}
                        />
                    </View>
                    <View style={[styles.layoutWithBottomBorder]}>
                        <Text style={[styles.labelStyle]}>上次校准后测试值：</Text>
                        <MyTextInput
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={module.LdLastCalibrationValue}
                            style={[styles.textStyle, { flex: 1 }]}
                            placeholder={'需要补充数据'}
                            onChangeText={text => {
                                this.updateModuleData(index, 'LdLastCalibrationValue', text);
                            }}
                        />
                    </View>
                    <View style={[styles.layoutWithBottomBorder]}>
                        <Text style={[styles.labelStyle]}>校前测试值：</Text>
                        <TextInput
                            editable={true}
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={module.LdCalibrationPreValue}
                            placeholder={'请填写校前测试值'}
                            placeholderTextColor={'#999999'}
                            onChangeText={text => {
                                this.updateModuleData(index, 'LdCalibrationPreValue', text);
                            }}
                            underlineColorAndroid={'transparent'}
                            style={[styles.textStyle, { flex: 1 }]}
                        />
                    </View>
                    <TouchableOpacity
                        style={[{ marginTop: 8, marginBottom: 9 }]}
                        onPress={() => {
                            this._zeroTest(index);
                        }}
                    >
                        <View style={[{ width: 116, height: 30, backgroundColor: globalcolor.blue, borderRadius: 2, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.white }]}>{'计算'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[{ width: SCREEN_WIDTH - 24, paddingHorizontal: 24, borderRadius: 2, backgroundColor: globalcolor.white, marginTop: 10 }]}>
                    <View style={[styles.layoutWithBottomBorder]}>
                        <Text style={[styles.labelStyle]}>零点漂移%F.S.：</Text>
                        <View style={[styles.innerlayout]}>
                            <Text style={[styles.textStyle]}>{module.LdPy && module.LdPy != '' ? module.LdPy : '条件不足'}</Text>
                        </View>
                    </View>
                    <View style={[styles.layoutWithBottomBorder]}>
                        <Text style={[styles.labelStyle]}>仪器校准是否正常：</Text>
                        <View style={[styles.innerlayout]}>
                            <Text style={[styles.textStyle]}>{module.LdCalibrationIsOk && module.LdCalibrationIsOk != '' ? module.LdCalibrationIsOk : '条件不足'}</Text>
                        </View>
                    </View>
                    <View style={[styles.lastItem]}>
                        <Text style={[styles.labelStyle]}>校准后测试值：</Text>
                        <TextInput
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={module.LdCalibrationSufValue}
                            style={[styles.textStyle, { flex: 1 }]}
                            placeholder={'请填写测试值'}
                            placeholderTextColor={'#999999'}
                            onChangeText={text => {
                                this.updateModuleData(index, 'LdCalibrationSufValue', text);
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    //量程测试
    _rangeTest = () => {
        if (typeof this.state.FxyLc == 'undefined' || !this.state.FxyLc || this.state.FxyLc.indexOf('-') == -1) {
            ShowToast('量程非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        let [min, max] = this.state.FxyLc.split('-');
        if (this.testNumberException(min)) {
            ShowToast('量程非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        if (this.testNumberException(max)) {
            ShowToast('量程非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        if (Number(min) >= Number(max)) {
            ShowToast('量程非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        let range = Number(max) - Number(min);
        //上次校准值
        if (this.testNumberException(this.state.LcLastCalibrationValue)) {
            ShowToast('量程校准 上次校准测试值非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        let LcLastCalibrationValue = Number(this.state.LcLastCalibrationValue);
        //BqNdz 校验标气浓度值是否合法
        if (this.testNumberException(this.state.BqNdz)) {
            ShowToast('量程校准 标准气体浓度值非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        let BqNdz = Number(this.state.BqNdz);
        if (this.testNumberException(this.state.LcCalibrationPreValue)) {
            ShowToast('量程校准 校准前测试值非法');
            this.setState({ LcCalibrationIsOk: '', LcPy: '' });
            return;
        }
        let LcCalibrationPreValue = Number(this.state.LcCalibrationPreValue);
        // let result = Math.round(((LcCalibrationPreValue - BqNdz) / range) * 10000);
        // let result = ((LcCalibrationPreValue - LcLastCalibrationValue) / range) ;
        let result = accDiv(accSub(LcCalibrationPreValue, LcLastCalibrationValue), range);
        let signBit = '';
        if (result < 0) {
            signBit = '-';
        }
        let resultAbs = Math.round(Math.abs(result) * 10000)
        let strLength = (resultAbs + '').length;
        let prefix = '';
        if (strLength > 2) {
            prefix = (resultAbs + '').substr(0, strLength - 2);
        } else {
            prefix = '';
        }
        let suffix = (resultAbs + '').substr(strLength - 2, strLength);
        let suffixLength = suffix.length;
        // let zhenshiLCPY = result / 10000;
        let zhenshiLCPY = result;
        let ItemId = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ItemId'], '');
        if (ItemId == '773') {
            //ItemID: "颗粒物"  ItemId: "773"
            if (Math.abs(zhenshiLCPY) <= 0.02) {
                this.setState({ LcCalibrationIsOk: '是', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            } else {
                this.setState({ LcCalibrationIsOk: '否', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            }
        } else if (ItemId == '780' || ItemId == '782') {
            // ItemID: "流速"   ItemId: "780"  ItemID: "湿度"   ItemId: "782"
            if (Math.abs(zhenshiLCPY) <= 0.03) {
                this.setState({ LcCalibrationIsOk: '是', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            } else {
                this.setState({ LcCalibrationIsOk: '否', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            }
        } else {
            if (Math.abs(zhenshiLCPY) <= 0.025) {
                this.setState({ LcCalibrationIsOk: '是', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            } else {
                this.setState({ LcCalibrationIsOk: '否', LcPy: signBit + (prefix == '' ? 0 : prefix) + '.' + (suffixLength == 2 ? suffix : suffixLength == 1 ? '0' + suffix : '00') + '%' });
            }
        }
    };

    getLowerLimitValue = str => {
        if (str.indexOf(rangSeparator) != -1) {
            return str.split(rangSeparator)[0];
        } else {
            return '';
        }
    };

    getUpperLimitValue = str => {
        if (str.indexOf(rangSeparator) != -1) {
            return str.split(rangSeparator)[1];
        } else {
            return '';
        }
    };
    upLoadImg = (label, id) => {
        const noRequire = ['校准前数值', '校准后零点数值'].includes(label) && this.state.noSelectedFlag
        return <View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                {!noRequire && <Text style={[styles.labelStyle, { color: 'red' }]}>* </Text>}
                <Text style={[styles.labelStyle]}>{label}：</Text>
            </View>

            <View key={id} style={styles.imageUploadContainer}>
                <ImageGrid
                    componentType={'normalWaterMaskCamera'}
                    style={{
                        backgroundColor: '#fff',
                    }}
                    Imgs={this.state[id + '_PIC']}
                    isUpload={true}
                    isDel={true}
                    UUID={this.state[id]}
                    uploadCallback={items => {
                        console.log('items', items);
                        let newImgList = [...this.state[id + '_PIC']];
                        items.map(imageItem => {
                            newImgList.push(imageItem);
                        });
                        this.setState({ [id + '_PIC']: newImgList });
                    }}
                    delCallback={index => {
                        let newImgList = [...this.state[id + '_PIC']];
                        newImgList.splice(index, 1);
                        this.setState({ [id + '_PIC']: newImgList });
                    }}
                />
            </View>
        </View>
    }
    render() {
        let Item = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        let ItemId = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ItemId'], '');
        /**
         * ItemID == 780 ItemID == 782
         * 流速 湿度 不需要填写量程校准
         * 
         * '773': '颗粒物',
         * 
         * '782': '湿度',
         * 
         * IsPiaoYi
         * IsLiangCheng
         * 1表示必填
         */
        const isLs = ItemId === '780'


        const isSd = ItemId === '782'

        const isBasicGas = ItemId === '770' || ItemId === '771' || ItemId === '772' || ItemId === '774' // SO2/NO/O2/NO2

        const { pic1Name, pic2Name, pic3Name, pic4Name, noSelectedFlag } = this.state
        return (
            <View style={styles.container}>
                {/* <KeyboardAwareScrollView> */}
                <ScrollView style={[{ width: SCREEN_WIDTH, flex: 1 }]} showsVerticalScrollIndicator={false}>
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                        <Text
                            style={[
                                {
                                    color: '#333333',
                                    width: SCREEN_WIDTH - 28,
                                    marginVertical: 12
                                }
                            ]}
                        >
                            分析仪校准原理
                        </Text>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 24,
                                    paddingHorizontal: 24,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 72
                                    }
                                ]}
                            >
                                <FormInput
                                    label="分析仪原理"
                                    placeholder="请输入"
                                    keyboardType="default"
                                    value={this.state.FxyYl}
                                    onChangeText={text => {
                                        this.setState({
                                            FxyYl: text
                                        });
                                    }}
                                />
                            </View>
                            <View style={[styles.layoutWithBottomBorder, { flexDirection: 'column', justifyContent: 'center' }]}>
                                <FormRangInput
                                    label={'分析仪量程'}
                                    rangSeparator={rangSeparator}
                                    upperLimitValue={this.getUpperLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''))}
                                    lowerLimitValue={this.getLowerLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''))}
                                    onChangeText={arr => {
                                        this.setState({ FxyLc: `${arr[0]}${rangSeparator}${arr[1]}` });
                                    }}
                                />
                            </View>
                            <View
                                style={[{ flexDirection: 'column', justifyContent: 'center' }]}
                            >
                                <FormPicker
                                    last={false}
                                    label="计量单位"
                                    defaultCode={this.state.JlUnit}
                                    option={{
                                        codeKey: 'Name',
                                        nameKey: 'Name',
                                        defaultCode: this.state.JlUnit,
                                        dataArr: this.props.unitsList,
                                        onSelectListener: item => {
                                            this.setState({
                                                JlUnit: item.Name
                                            });
                                        }
                                    }}
                                    showText={this.state.JlUnit}
                                    placeHolder="请选择"
                                />
                            </View>
                            {isSd && <>
                                <View
                                    style={[{ flexDirection: 'column', justifyContent: 'center' }]}
                                >
                                    <FormPicker
                                        last={false}
                                        label="通入气体"
                                        defaultCode={this.state.TRQT}
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: this.state.TRQT,
                                            dataArr: [{ Name: '空气' }, { Name: '氮气' }],
                                            onSelectListener: item => {
                                                this.setState({
                                                    TRQT: item.Name
                                                });
                                            }
                                        }}
                                        showText={this.state.TRQT}
                                        placeHolder="请选择"
                                    />
                                </View>
                            </>}
                        </View>

                        {/* 使用 renderZeroCalibrationModule 渲染零点漂移校准模块 */}
                        {this.state.modules.map((module, index) => this.renderZeroCalibrationModule(module, index))}
                        {
                            // ItemID: "流速"   ItemId: "780"
                            ItemId != '780' && ItemId != '782' ? <View style={[{ flexDirection: 'row', alignItems: 'center', height: 40, width: SCREEN_WIDTH - 24 }]}>
                                <Text
                                    style={[
                                        {
                                            color: '#333333',
                                            flex: 1,
                                            marginVertical: 12
                                        }
                                    ]}
                                >
                                    量程漂移校准
                                </Text>
                            </View> : null
                        }
                        {   // ItemID: "流速"   ItemId: "780"
                            ItemId != '780' && ItemId != '782' ? <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 24,
                                        paddingHorizontal: 24,
                                        borderRadius: 2,
                                        backgroundColor: globalcolor.white,
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                {
                                    (ItemId != '780' && ItemId != '782') && ItemId != '773'
                                        ? <View
                                            style={[{
                                                flexDirection: 'row', alignItems: 'center'
                                                , height: 40, width: SCREEN_WIDTH - 24
                                                , paddingHorizontal: 24, marginTop: 8
                                            }]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        IsChange: this.state.IsChange ? 0 : 1
                                                    })
                                                }}
                                            >
                                                <View
                                                    style={[{
                                                        width: 21, height: 40
                                                        , justifyContent: 'center'
                                                    }]}
                                                >
                                                    <Image
                                                        style={{ marginRight: 5, height: 16, width: 16 }}
                                                        source={this.state.IsChange === 1 ? require('../../../../images/ic_reported_check.png') : require('../../../../images/ic_reported_uncheck.png')}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                            <Text style={[styles.labelStyle, { width: SCREEN_WIDTH - 93, lineHeight: 18 }]}>如果本次校准更换了标气且标气浓度发生了改变，请打勾<TouchableOpacity
                                                onPress={() => {
                                                    this.refs.doAlert.show();
                                                }}
                                                style={[{
                                                    height: 18, paddingTop: 4
                                                }]}>
                                                <Text style={[styles.labelStyle, { lineHeight: 18, height: 18, color: globalcolor.antBlue }]}>{'   操作说明'}</Text></TouchableOpacity></Text>
                                        </View> : null
                                }
                                {
                                    this.state.IsChange === 1 ? <View style={[styles.layoutWithBottomBorder, { marginTop: 0 }]}>
                                        <Text style={[styles.labelStyle]}>原标气浓度值：</Text>
                                        <MyTextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.BqNdz}
                                            ref={ref => (this._inputMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请填写标气浓度值'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    BqNdz: text
                                                });
                                            }}
                                        />
                                    </View> : null
                                }
                                {
                                    this.state.IsChange === 1 ? <View style={[styles.layoutWithBottomBorder]}>
                                        <Text style={[styles.labelStyle]}>新标气浓度值：</Text>
                                        <MyTextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.LcNewCalibrationPreValue}
                                            ref={ref => (this._inputNewMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请填写标气浓度值'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    LcNewCalibrationPreValue: text
                                                });
                                            }}
                                        />
                                    </View> : null
                                }
                                {
                                    this.state.IsChange === 0 ? <View style={[styles.layoutWithBottomBorder
                                        , (ItemId != '780' && ItemId != '782') && ItemId != '773' ? { marginTop: 0 } : null]}>
                                        <Text style={[styles.labelStyle]}>标气浓度值：</Text>
                                        <MyTextInput
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                            value={this.state.BqNdz}
                                            ref={ref => (this._inputMachineHaltReason = ref)}
                                            style={[styles.textStyle, { flex: 1 }]}
                                            placeholder={'请填写标气浓度值'}
                                            onChangeText={text => {
                                                // 动态更新组件内State记录
                                                this.setState({
                                                    BqNdz: text
                                                });
                                            }}
                                        />
                                    </View> : null
                                }
                                <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>上次校准后测试值：</Text>
                                    <MyTextInput
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        value={this.state.LcLastCalibrationValue}
                                        ref={ref => (this._inputMachineHaltReason = ref)}
                                        style={[styles.textStyle, { flex: 1 }]}
                                        placeholder={'请填写上次校准后测试值'}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录用户名
                                            this.setState({
                                                LcLastCalibrationValue: text
                                            });
                                        }}
                                    />
                                </View>
                                <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>校前测试值：</Text>
                                    <MyTextInput
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        value={this.state.LcCalibrationPreValue}
                                        ref={ref => (this._inputMachineHaltReason = ref)}
                                        style={[styles.textStyle, { flex: 1 }]}
                                        placeholder={'请填写校前测试值'}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录用户名
                                            this.setState({
                                                LcCalibrationPreValue: text
                                            });
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={[
                                        {
                                            marginTop: 8,
                                            marginBottom: 9
                                        }
                                    ]}
                                    onPress={() => {
                                        this._rangeTest();
                                    }}
                                >
                                    <View
                                        style={[
                                            {
                                                width: 116,
                                                height: 30,
                                                backgroundColor: globalcolor.blue,
                                                borderRadius: 2,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <Text style={[{ fontSize: 15, color: globalcolor.white }]}>{'计算'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : null
                        }
                        {
                            // ItemID: "流速"   ItemId: "780"
                            ItemId != '780' && ItemId != '782' ? <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 24,
                                        paddingHorizontal: 24,
                                        borderRadius: 2,
                                        backgroundColor: globalcolor.white,
                                        marginTop: 10
                                    }
                                ]}
                            >
                                <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>量程漂移%F.S.：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.LcPy && this.state.LcPy != '' ? this.state.LcPy : '条件不足'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.layoutWithBottomBorder]}>
                                    <Text style={[styles.labelStyle]}>仪器校准是否正常：</Text>
                                    <View style={[styles.innerlayout]}>
                                        <Text style={[styles.textStyle]}>{this.state.LcCalibrationIsOk && this.state.LcCalibrationIsOk != '' ? this.state.LcCalibrationIsOk : '条件不足'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.lastItem]}>
                                    <Text style={[styles.labelStyle]}>校准后测试值：</Text>
                                    <MyTextInput
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        value={this.state.LcCalibrationSufValue}
                                        ref={ref => (this._inputMachineHaltReason = ref)}
                                        style={[styles.textStyle, { flex: 1 }]}
                                        placeholder={'请填写测试值'}
                                        onChangeText={text => {
                                            // 动态更新组件内State记录
                                            this.setState({
                                                LcCalibrationSufValue: text
                                            });
                                        }}
                                    />
                                </View>
                            </View> : null
                        }
                        <View style={[
                            {
                                width: SCREEN_WIDTH - 24,
                                paddingHorizontal: 24,
                                borderRadius: 2,
                                backgroundColor: globalcolor.white,
                                marginTop: 10
                            }
                        ]}>
                            <View style={[styles.lastItem]}>
                                <Text style={[styles.labelStyle]}>情况说明：</Text>
                                <MyTextInput
                                    value={this.state.Remark}
                                    ref={ref => (this._inputMachineHaltReason = ref)}
                                    style={[styles.textStyle, { flex: 1 }]}
                                    placeholder={'请填写情况说明'}
                                    multiline={true}
                                    numberOfLines={2}
                                    onChangeText={text => {
                                        // 动态更新组件内State记录
                                        this.setState({
                                            Remark: text
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[
                        {
                            width: SCREEN_WIDTH - 24,
                            paddingHorizontal: 24,
                            borderRadius: 2,
                            backgroundColor: globalcolor.white,
                            marginTop: 10,
                            paddingTop:16,
                            paddingBottom:8,
                        }
                    ]}>
                        {isBasicGas ? [{ label: '校准前数值', picName: pic1Name }, { label: '校准后零点数值', picName: pic2Name }, { label: '校准后量程数值', picName: pic3Name }, { label: '使用标气浓度及标签', picName: pic4Name }].map(item => {
                            return this.upLoadImg(item.label, item.picName)
                        }) : isLs ?
                                [{ label: '校准前数值及工作照', picName: pic1Name }, { label: '校准后数值及工作照', picName: pic2Name }].map(item => {
                                    return this.upLoadImg(item.label, item.picName)
                                }) : isSd ?
                                    [{ label: '通入空气/氮气测量值', picName: pic1Name }, { label: '湿度仪器维护工作', picName: pic2Name }].map(item => {
                                        return this.upLoadImg(item.label, item.picName)
                                    })
                                    :
                                    [{ label: '零点数值（校准前）', picName: pic1Name }, { label: '零点数值（校准后）', picName: pic2Name }, { label: '量程数值（校准前）', picName: pic3Name }, { label: '量程数值（校准后）', picName: pic4Name }].map(item => {
                                        return this.upLoadImg(item.label, item.picName)
                                    })}

                    </View >
                    </View >
                
                </ScrollView >
                {/* </KeyboardAwareScrollView> */}
                {
                    this.props.route.params.params.index != -1 &&
                        this.props.route.params.params.item.FormMainID &&
                        ((this.props.route.params.params.item.LdCalibrationIsOk && this.props.route.params.params.item.LdCalibrationIsOk != '') ||
                            (this.props.route.params.params.item.LcCalibrationIsOk && this.props.route.params.params.item.LcCalibrationIsOk != '')) ? (
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                                onPress={() => {
                                    this.setState({ dialogType: deleteItem });
                                    this._modalParent.showModal();
                                }}
                            >
                                <View style={styles.button}>
                                    <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                                    <Text style={[{ color: globalcolor.whiteFont, fontSize: 20, marginLeft: 8 }]}>删除记录</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                }
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                        /**
                        * {
                                        "ID":"0f0d7b42-d69a-4bb3-b40b-97834526bf95",
                                        "ItemID":"颗粒物",
                                        "LqNdz":"3",        //零气浓度值
                                        "LdLastCalibrationValue":"33",//上一次校准值
                                        "LdCalibrationPreValue":"44",//校准前
                                        "LdPy":"55",        //零点漂移%F.S.
                                        "LdCalibrationIsOk":"是",//是否正常
                                        "LdCalibrationSufValue":"66",//校准后
                                        "BqNdz":"77",        //标气浓度值
                                        "LcLastCalibrationValue":"88",//量程 上一次校准值
                                        "LcCalibrationPreValue":"999",//校准前
                                        "LcPy":"10111",     //量程漂移%F.S.
                                        "LcCalibrationIsOk":"是",//是否正常
                                        "LcCalibrationSufValue":"222",//校准后
                                        "FormMainID":"d2409e78-8d89-42f7-b17f-017d24cc61ce",   //主表ID
                                        "FxyYl":"52",           //分析仪原理
                                        "FxyLc":"45",          //分析仪量程
                                        "JlUnit":"26"//计量单位
                
                                        upperLimitValue={this.getUpperLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''))}
                                        lowerLimitValue={this.getLowerLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''))}
                                    }
                        */
                        /**
                         * IsPiaoYi
                         * IsLiangCheng
                         * 1表示必填
                         */
                        const IsPiaoYi = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'IsPiaoYi'], -1);
                        const IsLiangCheng = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'IsLiangCheng'], -1);
                        let up = this.getUpperLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''));
                        let lower = this.getLowerLimitValue(SentencedToEmpty(this.state, ['FxyLc'], ''));
                        if (SentencedToEmpty(this.state, ['FxyYl'], '') == '') {
                            ShowToast('分析仪原理不能为空');
                            return;
                        } else if (up == '' || lower == '') {
                            ShowToast('分析仪量程不能为空');
                            return;
                        } else if (SentencedToEmpty(this.state, ['JlUnit'], '') == '') {
                            ShowToast('计量单位不能为空');
                            return;
                        }
                        if (IsPiaoYi == 1) { // 零点校准必填
                            for (let i = 0; i < this.state.modules.length; i++) {
                                const module = this.state.modules[i];
                                const moduleIndex = i + 1;
                                const isFlowRate = ItemId === '780' || ItemId === '782';
                                const modulePrefix = isFlowRate ? `差压表 ${this.props.route.params.params.index + moduleIndex} 中` : '';

                                if (SentencedToEmpty(module, ['LqNdz'], '') == '') {
                                    ShowToast(`${modulePrefix}零气浓度不能为空`);
                                    return;
                                } else if (SentencedToEmpty(module, ['LdLastCalibrationValue'], '') == '') {
                                    ShowToast(`${modulePrefix}零点上次校准后测试值不能为空`);
                                    return;
                                } else if (SentencedToEmpty(module, ['LdCalibrationPreValue'], '') == '') {
                                    ShowToast(`${modulePrefix}零点校准前测试值不能为空`);
                                    return;
                                } else if (SentencedToEmpty(module, ['LdPy'], '') == ''
                                    || SentencedToEmpty(module, ['LdCalibrationIsOk'], '') == '') {
                                    ShowToast(`${modulePrefix}零点漂移未进行计算，无法提交`);
                                    return;
                                } else if (SentencedToEmpty(module, ['LdCalibrationSufValue'], '') == '') {
                                    ShowToast(`${modulePrefix}零点校准后测试值不能为空`);
                                    return;
                                }
                            }
                        }
                        let ItemId = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ItemId'], '');
                        if (IsLiangCheng == 1 && (ItemId != '780' && ItemId != '782')) {
                            if (SentencedToEmpty(this.state, ['BqNdz'], '') == '') {
                                ShowToast('标气浓度不能为空');
                                return;
                            } else if (SentencedToEmpty(this.state, ['LcLastCalibrationValue'], '') == '') {
                                ShowToast('标气上次校准后测试值不能为空');
                                return;
                            } else if (SentencedToEmpty(this.state, ['LcCalibrationPreValue'], '') == '') {
                                ShowToast('标气校准前测试值不能为空');
                                return;
                            } else if (SentencedToEmpty(this.state, ['LcPy'], '') == ''
                                || SentencedToEmpty(this.state, ['LcCalibrationIsOk'], '') == '') {
                                ShowToast('量程漂移未进行计算，无法提交');
                                return;
                            } else if (SentencedToEmpty(this.state, ['LcCalibrationSufValue'], '') == '') {
                                ShowToast('量程校准后测试值不能为空');
                                return;
                            }
                        }

                        let imgFiles = {}
                        if (isBasicGas) {
                            imgFiles = {
                                JZQSZ: this.state[pic1Name],
                                JZHLDSZ: this.state[pic2Name],
                                JZHLCSZ: this.state[pic3Name],
                                SYBQNDJBQ: this.state[pic4Name],
                            }
                            if ((!this.state[pic1Name + '_PIC']?.length) && !noSelectedFlag) { ShowToast('校准前数值不能为空'); return }
                            if ((!this.state[pic2Name + '_PIC']?.length) && !noSelectedFlag) { ShowToast('校准后零点数值不能为空'); return }
                            if (!this.state[pic3Name + '_PIC']?.length) { ShowToast('校准后量程数值不能为空'); return }
                            if (!this.state[pic4Name + '_PIC']?.length) { ShowToast('使用标气浓度及标签不能为空'); return }
                        } else if (isLs) {
                            imgFiles = {
                                JZUSZJGZZ: this.state[pic1Name],
                                JZDSZJGZZ: this.state[pic2Name],
                            }
                            if (!this.state[pic1Name + '_PIC']?.length) { ShowToast('校准前数值及工作照不能为空'); return }
                            if (!this.state[pic2Name + '_PIC']?.length) { ShowToast('校准后数值及工作照不能为空'); return }
                        } else if (isSd) {
                            imgFiles = {
                                TRKQDQCLZ: this.state[pic1Name],
                                SDYQWHGZ: this.state[pic2Name],
                            }
                            if (!this.state[pic1Name + '_PIC']?.length) { ShowToast('通入空气/氮气测量值不能为空'); return }
                            if (!this.state[pic2Name + '_PIC']?.length) { ShowToast('湿度仪器维护工作不能为空'); return }
                        } else {
                            imgFiles = {
                                LDSZU: this.state[pic1Name],
                                LDSZD: this.state[pic2Name],
                                LCSJU: this.state[pic3Name],
                                LCSJD: this.state[pic4Name],
                            }
                            if (!this.state[pic1Name + '_PIC']?.length) { ShowToast('零点数值（校准前）不能为空'); return }
                            if (!this.state[pic2Name + '_PIC']?.length) { ShowToast('零点数值（校准后）不能为空'); return }
                            if (!this.state[pic3Name + '_PIC']?.length) { ShowToast('量程数值（校准前）不能为空'); return }
                            if (!this.state[pic4Name + '_PIC']?.length) { ShowToast('量程数值（校准后）不能为空'); return }

                        }


                        // 构造提交数据
                        const submitData = this.state.modules.map((module, index) => ({
                            ID: module.ID,
                            ItemId: module.ItemId,  // 使用模块中的 ItemId
                            ItemID: this.state.ItemID,
                            ItemName: this.state.ItemName,
                            LqNdz: module.LqNdz,
                            LdLastCalibrationValue: module.LdLastCalibrationValue,
                            LdCalibrationPreValue: module.LdCalibrationPreValue,
                            LdPy: module.LdPy,
                            LdCalibrationIsOk: module.LdCalibrationIsOk,
                            LdCalibrationSufValue: module.LdCalibrationSufValue,
                            BqNdz: this.state.BqNdz,
                            IsChange: this.state.IsChange,
                            LcNewCalibrationPreValue: this.state.LcNewCalibrationPreValue,
                            LcLastCalibrationValue: this.state.LcLastCalibrationValue,
                            LcCalibrationPreValue: this.state.LcCalibrationPreValue,
                            LcPy: this.state.LcPy,
                            LcCalibrationIsOk: this.state.LcCalibrationIsOk,
                            LcCalibrationSufValue: this.state.LcCalibrationSufValue,
                            FormMainID: this.state.FormMainID,
                            FxyYl: this.state.FxyYl,
                            FxyLc: this.state.FxyLc,
                            JlUnit: this.state.JlUnit,
                            ModuleIndex: index,
                            TRQT: this.state.TRQT,
                            TRKQDQCLZ: this.state.TRKQDQCLZ,
                            Remark: this.state.Remark,
                            ...imgFiles

                        }));
                        // console.log('submitData',this.state['JZQSZ' + '_PIC'], submitData);
                        // return;

                        this.props.dispatch(
                            createAction('calibrationRecordZb/saveItem')({
                                index: this.props.route.params.params.index,
                                record: submitData,
                                callback: () => {
                                    this.props.dispatch(createAction('calibrationRecordZb/updateState')({
                                        liststatus: { status: -1 }
                                    }));
                                    this.props.dispatch(createAction('calibrationRecordZb/getJzItem')({}));
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                    </View>
                </TouchableOpacity>
                {this._renderModal()}
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
                <OperationAlertDialog options={{
                    headTitle: '说明',
                    innersHeight: 450,
                    messText: `如果本次校准更换了标气且标气浓度发生改变，请按照下面方法填写校准电子台账：
1、用更换前标气浓度进行校前测试，用更换后标气浓度进行校准后测试。
2、核准电子台账填写规则如下：
旧标气浓度值：填写更换前标气浓度值；
新标气浓度值：填写更换后标气浓度值；
校前测试值：用更换前标气浓度进行校前测试值；
量程漂移：（校前测试值-上次校准后测试值）/量程*100%；
校准后测试值：用更换后标气浓度进行校准后测试值；`,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }} ref="doAlert" />

            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    },
    lastItem: {
        flexDirection: 'row',
        height: 45,
        marginBottom: 10,
        alignItems: 'center'
    }
});

//make this component available to the app
export default CalibrationRecordEditZb;
