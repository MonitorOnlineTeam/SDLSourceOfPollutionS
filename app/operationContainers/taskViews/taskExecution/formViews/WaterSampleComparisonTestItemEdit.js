/*
 * @Description: 实际水样比对试验结果记录表 水样比对试验记录 项目编辑
 * @LastEditors: hxf
 * @Date: 2022-01-25 11:51:20
 * @LastEditTime: 2024-09-25 19:47:58
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/WaterSampleComparisonTestItemEdit.js
 */

import moment from 'moment';
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, setPlatformValue } from '../../../../utils';
import Form2Switch from '../components/Form2Switch';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormPicker from '../components/FormPicker';
import FormRangInput from '../components/FormRangInput';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import { FormInputWidthUnit } from './DataConsistencyEditItem';
let normalkeyboardType = Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric';

@connect(({ waterSampleComparisonTestModel }) => ({
    waterComparisonTestRecordListResult: waterSampleComparisonTestModel.waterComparisonTestRecordListResult,
    innerList: waterSampleComparisonTestModel.innerList,
    ParametersID: waterSampleComparisonTestModel.ParametersID, // 项目ID
    ParametersName: waterSampleComparisonTestModel.ParametersName, // 项目名称
    waterComparisonTestRecordListSaveResult: waterSampleComparisonTestModel.waterComparisonTestRecordListSaveResult,
    itemDeleteResult: waterSampleComparisonTestModel.itemDeleteResult
}))
export default class WaterSampleComparisonTestItemEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: `${SentencedToEmpty(navigation, ['state', 'params', 'item', 'ParametersName'], '')}水样比对试验记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    };

    componentWillUnmount() {
        this.props.dispatch(
            createAction('waterSampleComparisonTestModel/updateState')({
                innerList: []
            })
        );
    }

    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            title: `${SentencedToEmpty(this.props.route, ['params', 'params', 'item', 'ParametersName'], '')}水样比对试验记录`,
        });
    }

    getHDateOption = (item, index) => {
        return {
            defaultTime: moment(item.CompletionTime).format('YYYY-MM-DD HH:mm:ss'),
            // type: 'hour',
            type: 'minute',
            onSureClickListener: time => {
                let newInnerList = [].concat(this.props.innerList);
                newInnerList[index]['CompletionTime'] = time;
                this.props.dispatch(
                    createAction('waterSampleComparisonTestModel/updateState')({
                        innerList: newInnerList
                    })
                );
            }
        };
    };

    confirm = () => {
        this.props.dispatch(
            createAction('waterSampleComparisonTestModel/delSubtable')({
                params: { ID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'ParametersID'], '') }
            })
        );
    };

    render() {
        let unitList = SentencedToEmpty(this.props, ['waterComparisonTestRecordListResult', 'data', 'Datas', 'UnitList'], []);
        let options = {
            headTitle: '提示',
            messText: `确认删除${SentencedToEmpty(this.props.route, ['params', 'params', 'item', 'ParametersName'], '')}水样比对试验记录吗？`,
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: () => { }
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1, paddingHorizontal: 10 }]}>
                {/* <KeyboardAwareScrollView> */}
                <ScrollView style={[{ width: SCREEN_WIDTH - 20 }]}>
                    {this.props.innerList.map((item, index) => {
                        /**
                                FormMainID 主表ID
                                ParametersID 校验项目ID
                                ParametersName 校验项目名称
                                Unit  单位
                                OnlineMonitoringValue 在线监测仪器测定结果
                                AlignmentMethodValue 比对方法测定结果 组合值 0,1
                                AlignmentMethodAvgValue 比对方法测定结果平均值
                                ErrorValue 测定误差  组合值   1,mg/m3
                                IsQualified 是否合格  1合格 0 不合格,
                            */
                        return (
                            <View style={[{ width: SCREEN_WIDTH - 20 }]} key={`list${index}`}>
                                <View style={[{ width: SCREEN_WIDTH - 20, height: 33, flexDirection: 'row', alignItems: 'center', paddingLeft: 9, paddingRight: 4, justifyContent: 'space-between' }]}>
                                    <Text style={[{ fontSize: 15, color: '#333333' }]}>{`比对试验记录${index + 1}`}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let newList = [].concat(this.props.innerList);
                                            newList.splice(index, 1);
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newList
                                                })
                                            );
                                        }}
                                        style={[{ height: 33, width: 64, alignItems: 'flex-end', justifyContent: 'center' }]}
                                    >
                                        <Image style={[{ width: 12, height: 12, tintColor: '#D0D0D0' }]} source={require('../../../../images/clear.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[{ width: SCREEN_WIDTH - 20, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 10 }]}>
                                    <FormPicker
                                        label="单位"
                                        defaultCode={SentencedToEmpty(item, ['Unit'], '')}
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: SentencedToEmpty(item, ['Unit'], ''),
                                            dataArr: unitList,
                                            onSelectListener: item => {
                                                let newList = [].concat(this.props.innerList);
                                                newList[index]['Unit'] = item.Name;
                                                this.props.dispatch(
                                                    createAction('waterSampleComparisonTestModel/updateState')({
                                                        innerList: newList
                                                    })
                                                );
                                            }
                                        }}
                                        showText={SentencedToEmpty(item, ['Unit'], '')}
                                        placeHolder="请选择"
                                    />
                                    <FormInput
                                        label="在线监测仪器测定结果"
                                        placeholder="请填写浓度值"
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        value={SentencedToEmpty(item, ['OnlineMonitoringValue'], '')}
                                        onChangeText={text => {
                                            let newList = [].concat(this.props.innerList);
                                            newList[index]['OnlineMonitoringValue'] = text;
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newList
                                                })
                                            );
                                        }}
                                    />
                                    <FormRangInput
                                        label={'比对方法测定结果'}
                                        keyboardType={normalkeyboardType}
                                        rangSeparator={''}
                                        upperLimitPlaceholder="浓度值2"
                                        lowerLimitPlaceholder="浓度值1"
                                        upperLimitValue={getPlatformValue(SentencedToEmpty(item, ['AlignmentMethodValue'], ''), 1)}
                                        lowerLimitValue={getPlatformValue(SentencedToEmpty(item, ['AlignmentMethodValue'], ''), 0)}
                                        onChangeText={arr => {
                                            let newList = [].concat(this.props.innerList);
                                            newList[index]['AlignmentMethodValue'] = `${arr[0]},${arr[1]}`;
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newList
                                                })
                                            );
                                        }}
                                    />
                                    <FormInput
                                        label="比对方法测定结果平均值"
                                        placeholder="请填写浓度值"
                                        keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        value={SentencedToEmpty(item, ['AlignmentMethodAvgValue'], '')}
                                        onChangeText={text => {
                                            let newList = [].concat(this.props.innerList);
                                            newList[index]['AlignmentMethodAvgValue'] = text;
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newList
                                                })
                                            );
                                        }}
                                    />
                                    <FormInputWidthUnit
                                        label="测定误差"
                                        selectorPlaceHolder="选择单位"
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(item.ErrorValue, 1),
                                            dataArr: unitList,
                                            onSelectListener: unitItem => {
                                                let newInnerList = [].concat(this.props.innerList);
                                                let newStr = setPlatformValue(item.ErrorValue, unitItem.Name, 1);
                                                newInnerList[index]['ErrorValue'] = newStr;
                                                this.props.dispatch(
                                                    createAction('waterSampleComparisonTestModel/updateState')({
                                                        innerList: newInnerList
                                                    })
                                                );
                                            }
                                        }}
                                        showText={getPlatformValue(item.ErrorValue, 1)}
                                        textPlaceHolder="请填写测定误差"
                                        onChangeText={text => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            let newStr = setPlatformValue(item.ErrorValue, text, 0);
                                            newInnerList[index]['ErrorValue'] = newStr;
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newInnerList
                                                })
                                            );
                                        }}
                                        textValue={getPlatformValue(item.ErrorValue, 0)}
                                    />
                                    <Form2Switch
                                        label="是否合格"
                                        data={[
                                            { name: '是', value: 1 },
                                            { name: '否', value: 0 }
                                        ]}
                                        value={item['IsQualified']}
                                        onChange={value => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            newInnerList[index]['IsQualified'] = value;
                                            this.props.dispatch(
                                                createAction('waterSampleComparisonTestModel/updateState')({
                                                    innerList: newInnerList
                                                })
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                    <TouchableOpacity
                        onPress={() => {
                            let newInnerList = [].concat(this.props.innerList);
                            newInnerList.push({
                                ParametersID: this.props.ParametersID, //  校验项目ID
                                ParametersName: this.props.ParametersName, //  校验项目名称
                                Unit: '', //   单位
                                OnlineMonitoringValue: '', //  在线监测仪器测定结果
                                AlignmentMethodValue: '', //  比对方法测定结果 组合值 0,1
                                AlignmentMethodAvgValue: '', //  比对方法测定结果平均值
                                ErrorValue: '', //  测定误差  组合值   1,mg/m3
                                IsQualified: 0 //  是否合格  1合格 0 不合格,
                            });
                            this.props.dispatch(
                                createAction('waterSampleComparisonTestModel/updateState')({
                                    innerList: newInnerList
                                })
                            );
                        }}
                    >
                        <View style={[{ width: SCREEN_WIDTH - 20, justifyContent: 'center', alignItems: 'center', height: 64 }]}>
                            <View style={{ height: 30, width: 180, borderColor: '#4DA9FF', borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[{ fontSize: 17, color: '#4DA9FF' }]}>{'添加实验结果记录'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {/* </KeyboardAwareScrollView> */}

                {SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'IsWrite'], 0) == 1 ? (
                    <FormSuspendDelButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    />
                ) : null}
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('waterSampleComparisonTestModel/addWaterComparisonTestRecord')({}));
                    }}
                    style={[{ height: 44, width: SCREEN_WIDTH - 20, backgroundColor: '#4DA9FF', justifyContent: 'center', alignItems: 'center' }]}
                >
                    <Text style={{ fontSize: 17, color: 'white' }}>保存</Text>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.waterComparisonTestRecordListSaveResult.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.itemDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        );
    }
}
