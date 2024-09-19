/*
 * @Description: 水质 设备参数变动记录表 项目编辑
 * @LastEditors: hxf
 * @Date: 2022-01-11 15:02:24
 * @LastEditTime: 2024-07-01 19:16:12
 * @FilePath: /SDLMainProject37_1/app/operationContainers/taskViews/taskExecution/formViews/WaterEquipmentParametersChangeItemEdit.js
 */

import moment from 'moment';
import React, { Component } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, setPlatformValue, ShowToast } from '../../../../utils';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormRangInput from '../components/FormRangInput';
import FormSaveButton, { FormDeleteButton } from '../components/FormSaveButton';
const showRangSeparator = '-';
const rangSeparator = '-';
let normalkeyboardType = Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric';

@connect(({ waterParametersChangeModel }) => ({
    innerList: waterParametersChangeModel.innerList,
    itemDeleteResult: waterParametersChangeModel.itemDeleteResult,
    WaterCheckRecordListSaveResult: waterParametersChangeModel.WaterCheckRecordListSaveResult
}))
export default class WaterEquipmentParametersChangeItemEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: `${SentencedToEmpty(navigation, ['state', 'params', 'item', 'ParametersName'], '')}参数变动记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    };

    componentWillUnmount() {
        this.props.dispatch(
            createAction('waterParametersChangeModel/updateState')({
                innerList: []
            })
        );
    }

    getTimeOption = (index, paramName, paramPosition, paramsLength = 2) => {
        return {
            defaultTime:
                getPlatformValue(this.props.innerList[index][paramName], paramPosition, paramsLength) != ''
                    ? moment(getPlatformValue(this.props.innerList[index][paramName], paramPosition, paramsLength)).format('YYYY-MM-DD HH:mm:ss')
                    : moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'day',
            onSureClickListener: time => {
                let newList = [].concat(this.props.innerList);
                let newData = setPlatformValue(newList[index][paramName], time, paramPosition, paramsLength);
                newList[index][paramName] = newData;
                this.props.dispatch(
                    createAction('waterParametersChangeModel/updateState')({
                        innerList: newList
                    })
                );
            }
        };
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

    confirm = () => {
        this.props.dispatch(
            createAction('waterParametersChangeModel/delSubtable')({
                params: { ID: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'childList', 0, 'ID'], '') }
            })
        );
    };

    render() {
        let item = this.props.innerList[0];
        let options = {
            headTitle: '提示',
            messText: `确认删除${SentencedToEmpty(this.props.navigation, ['state', 'params', 'item', 'ParametersName'], '')}参数变动记录表录吗？`,
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
        /**
         *  ParametersID:item.ParametersID, //  参数ID
            ParametersName:item.ParametersName, //  参数名称
            Range:'', //   量程 组合值   用逗号分隔    0-2(变化前),0-3(变化后),2021-01-01(变化时间)
            DigestionTemperature:'', //  消解温度   组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
            DigestionTime:'', //   消解时间 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
            CorrelationCoefficient:'', //   线性相关系数 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
            DetectionLimit:'', //  检出限 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
            MeasurementAccuracy:'', //  测量精度 组合值   用逗号分隔 0(变化前),3(变化后),2021-01-01(变化时间),
            
            CorrelationCoefficient,DetectionLimit,DigestionTemperature,DigestionTime,MeasurementAccuracy,Range

            CorrelationCoefficient: ",,2022-02-28 15:42:48"
            DetectionLimit: ",,2022-02-28 15:42:48"
            DigestionTemperature: ",,2022-02-28 15:42:48"
            DigestionTime: ",,2022-02-28 15:42:48"
            FormMainID: "53b130ca-5602-4d9a-9636-9dcfd87e02fb"
            ID: "4f15c9ee-9a56-406b-932c-11f7ae4cc572"
            MeasurementAccuracy: ",,2022-02-28 15:42:48"
            ParametersID: "387"
            ParametersName: "COD"
            Range: ",,2022-02-28 15:42:48"
         */
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1, paddingHorizontal: 10 }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH - 20 }]}>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'量程'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormRangInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                rangSeparator={showRangSeparator}
                                upperLimitValue={this.getUpperLimitValue(getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 0, 3))}
                                lowerLimitValue={this.getLowerLimitValue(getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 0, 3))}
                                onChangeText={arr => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['Range'], `${arr[0]}${rangSeparator}${arr[1]}`, 0, 3);
                                    newList[0]['Range'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormRangInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                rangSeparator={showRangSeparator}
                                upperLimitValue={this.getUpperLimitValue(getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 1, 3))}
                                lowerLimitValue={this.getLowerLimitValue(getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 1, 3))}
                                onChangeText={arr => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['Range'], `${arr[0]}${rangSeparator}${arr[1]}`, 1, 3);
                                    newList[0]['Range'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 2, 3) != '' ? moment(getPlatformValue(SentencedToEmpty(item, ['Range'], ''), 2, 3)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'Range', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'消解温度'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更前参数值"
                                value={getPlatformValue(item['DigestionTemperature'], 0, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DigestionTemperature'], text, 0, 3);
                                    newList[0]['DigestionTemperature'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更后参数值"
                                value={getPlatformValue(item['DigestionTemperature'], 1, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DigestionTemperature'], text, 1, 3);
                                    newList[0]['DigestionTemperature'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={
                                    getPlatformValue(SentencedToEmpty(item, ['DigestionTemperature'], ''), 2, 3) != ''
                                        ? moment(getPlatformValue(SentencedToEmpty(item, ['DigestionTemperature'], ''), 2, 3)).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD')
                                }
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'DigestionTemperature', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'消解时间'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更前参数值"
                                value={getPlatformValue(item['DigestionTime'], 0, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DigestionTime'], text, 0, 3);
                                    newList[0]['DigestionTime'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更后参数值"
                                value={getPlatformValue(item['DigestionTime'], 1, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DigestionTime'], text, 1, 3);
                                    newList[0]['DigestionTime'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={
                                    getPlatformValue(SentencedToEmpty(item, ['DigestionTime'], ''), 2, 3) != ''
                                        ? moment(getPlatformValue(SentencedToEmpty(item, ['DigestionTime'], ''), 2, 3)).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD')
                                }
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'DigestionTime', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'线性相关系数'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更前参数值"
                                value={getPlatformValue(item['CorrelationCoefficient'], 0, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['CorrelationCoefficient'], text, 0, 3);
                                    newList[0]['CorrelationCoefficient'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更后参数值"
                                value={getPlatformValue(item['CorrelationCoefficient'], 1, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['CorrelationCoefficient'], text, 1, 3);
                                    newList[0]['CorrelationCoefficient'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={
                                    getPlatformValue(SentencedToEmpty(item, ['CorrelationCoefficient'], ''), 2, 3) != ''
                                        ? moment(getPlatformValue(SentencedToEmpty(item, ['CorrelationCoefficient'], ''), 2, 3)).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD')
                                }
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'CorrelationCoefficient', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'检出限'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更前参数值"
                                value={getPlatformValue(item['DetectionLimit'], 0, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DetectionLimit'], text, 0, 3);
                                    newList[0]['DetectionLimit'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更后参数值"
                                value={getPlatformValue(item['DetectionLimit'], 1, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['DetectionLimit'], text, 1, 3);
                                    newList[0]['DetectionLimit'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={
                                    getPlatformValue(SentencedToEmpty(item, ['DetectionLimit'], ''), 2, 3) != ''
                                        ? moment(getPlatformValue(SentencedToEmpty(item, ['DetectionLimit'], ''), 2, 3)).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD')
                                }
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'DetectionLimit', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20 }}>
                        <View style={[{ height: 34, justifyContent: 'center' }]}>
                            <Text
                                style={{
                                    color: globalcolor.taskImfoLabel,
                                    fontSize: 15,
                                    marginLeft: 10
                                }}
                            >
                                {'测量精度'}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更前）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更前参数值"
                                value={getPlatformValue(item['MeasurementAccuracy'], 0, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['MeasurementAccuracy'], text, 0, 3);
                                    newList[0]['MeasurementAccuracy'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormInput
                                label={'参数值（变更后）'}
                                keyboardType={normalkeyboardType}
                                placeholder="请填写变更后参数值"
                                value={getPlatformValue(item['MeasurementAccuracy'], 1, 3)}
                                onChangeText={text => {
                                    let newList = [].concat(this.props.innerList);
                                    let newData = setPlatformValue(newList[0]['MeasurementAccuracy'], text, 1, 3);
                                    newList[0]['MeasurementAccuracy'] = newData;
                                    this.props.dispatch(
                                        createAction('waterParametersChangeModel/updateState')({
                                            innerList: newList
                                        })
                                    );
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            <FormDatePicker
                                last={true}
                                label={'修改日期'}
                                timeString={
                                    getPlatformValue(SentencedToEmpty(item, ['MeasurementAccuracy'], ''), 2, 3) != ''
                                        ? moment(getPlatformValue(SentencedToEmpty(item, ['MeasurementAccuracy'], ''), 2, 3)).format('YYYY-MM-DD')
                                        : moment().format('YYYY-MM-DD')
                                }
                                getPickerOption={() => {
                                    return this.getTimeOption(0, 'MeasurementAccuracy', 2, 3);
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={[{ height: 10 }]} />
                {SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'IsWrite'], 0) == 1 ? (
                    <FormDeleteButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    />
                ) : null}

                <View style={[{ height: 10 }]} />
                <FormSaveButton
                    onPress={() => {
                        let editOne = false;
                        let keyArray = ['CorrelationCoefficient', 'DetectionLimit', 'DigestionTemperature', 'DigestionTime', 'MeasurementAccuracy', 'Range'];
                        keyArray.map(item => {
                            if (this.props.innerList[0][item] != '' && SentencedToEmpty(this.props, ['innerList', 0, item], '').indexOf(',,') != 0) {
                                editOne = true;
                            }
                        });
                        if (editOne) {
                            this.props.dispatch(createAction('waterParametersChangeModel/addWaterParametersChangeRecord')({}));
                        } else {
                            ShowToast('请填写变动记录');
                        }
                    }}
                />
                <AlertDialog options={options} ref="doAlert" />
                {this.props.WaterCheckRecordListSaveResult.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.itemDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        );
    }
}
