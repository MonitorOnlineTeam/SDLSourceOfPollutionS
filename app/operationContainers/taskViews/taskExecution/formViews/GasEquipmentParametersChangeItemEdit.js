/*
 * @Description: 设备参数变动记录表 项目编辑
 * @LastEditors: hxf
 * @Date: 2022-01-10 09:06:44
 * @LastEditTime: 2024-07-01 19:12:23
 * @FilePath: /SDLMainProject37_1/app/operationContainers/taskViews/taskExecution/formViews/GasEquipmentParametersChangeItemEdit.js
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, ShowToast } from '../../../../utils';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormRangInput from '../components/FormRangInput';
import FormSaveButton, { FormDeleteButton } from '../components/FormSaveButton';

const showRangSeparator = '-';
const rangSeparator = '-';
let normalkeyboardType = Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric';

@connect(({ gasParametersChangeModel }) => ({
    innerList: gasParametersChangeModel.innerList,
    gasParametersChangeRecordSaveResult: gasParametersChangeModel.gasParametersChangeRecordSaveResult,
    itemDeleteResult: gasParametersChangeModel.itemDeleteResult
}))
export default class GasEquipmentParametersChangeItemEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: `${SentencedToEmpty(navigation, ['state', 'params', 'item', 'ParametersName'], '')}参数变动记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    };

    componentWillUnmount() {
        this.props.dispatch(
            createAction('gasParametersChangeModel/updateState')({
                innerList: []
            })
        );
    }

    getTimeOption = () => {
        let item = this.props.innerList[0];
        return {
            defaultTime: SentencedToEmpty(item, ['ChangeTime'], '') == '' ? moment().format('YYYY-MM-DD') : moment(item.ChangeTime).format('YYYY-MM-DD'),
            type: 'day',
            onSureClickListener: time => {
                let newList = [].concat(this.props.innerList);
                newList[0]['ChangeTime'] = `${time}`;
                this.props.dispatch(
                    createAction('gasParametersChangeModel/updateState')({
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

    /**
     *  FormMainID 主表ID
        ParametersID 参数ID
        ParametersName 参数名称
        ChangeTime  修改日期
        PType 1.量程参数2.其它参数
        RangeAfterChange 变化后量程值 传组合值 0-20
        RangeBeforeChange 变化前量程值  传组合值  0-20
     */

    confirm = () => {
        let item = this.props.innerList[0];
        this.props.dispatch(
            createAction('gasParametersChangeModel/delSubtable')({
                params: { ID: SentencedToEmpty(this.props, ['innerList', 0, 'ID'], '') }
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
                                {item.PType == 1 ? '量程' : '参数值'}
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
                            {item.PType == 1 ? (
                                <FormRangInput
                                    label={'变更前'}
                                    keyboardType={normalkeyboardType}
                                    rangSeparator={showRangSeparator}
                                    upperLimitValue={this.getUpperLimitValue(SentencedToEmpty(item, ['RangeBeforeChange'], ''))}
                                    lowerLimitValue={this.getLowerLimitValue(SentencedToEmpty(item, ['RangeBeforeChange'], ''))}
                                    onChangeText={arr => {
                                        let newList = [].concat(this.props.innerList);
                                        newList[0]['RangeBeforeChange'] = `${arr[0]}${rangSeparator}${arr[1]}`;
                                        this.props.dispatch(
                                            createAction('gasParametersChangeModel/updateState')({
                                                innerList: newList
                                            })
                                        );
                                    }}
                                />
                            ) : (
                                <FormInput
                                    label={'变更前'}
                                    placeholder="请填写变更前参数值"
                                    value={SentencedToEmpty(item, ['RangeBeforeChange'], '')}
                                    onChangeText={text => {
                                        let newList = [].concat(this.props.innerList);
                                        newList[0]['RangeBeforeChange'] = text;
                                        this.props.dispatch(
                                            createAction('gasParametersChangeModel/updateState')({
                                                innerList: newList
                                            })
                                        );
                                    }}
                                />
                            )}
                        </View>
                        <View
                            style={{
                                height: 45,
                                width: SCREEN_WIDTH - 20,
                                paddingHorizontal: 10,
                                backgroundColor: 'white'
                            }}
                        >
                            {item.PType == 1 ? (
                                <FormRangInput
                                    label={'变更后'}
                                    keyboardType={normalkeyboardType}
                                    rangSeparator={showRangSeparator}
                                    upperLimitValue={this.getUpperLimitValue(SentencedToEmpty(item, ['RangeAfterChange'], ''))}
                                    lowerLimitValue={this.getLowerLimitValue(SentencedToEmpty(item, ['RangeAfterChange'], ''))}
                                    onChangeText={arr => {
                                        let newList = [].concat(this.props.innerList);
                                        newList[0]['RangeAfterChange'] = `${arr[0]}${rangSeparator}${arr[1]}`;
                                        this.props.dispatch(
                                            createAction('gasParametersChangeModel/updateState')({
                                                innerList: newList
                                            })
                                        );
                                    }}
                                />
                            ) : (
                                <FormInput
                                    label={'变更后'}
                                    placeholder="请填写变更后参数值"
                                    value={SentencedToEmpty(item, ['RangeAfterChange'], '')}
                                    onChangeText={text => {
                                        let newList = [].concat(this.props.innerList);
                                        newList[0]['RangeAfterChange'] = text;
                                        this.props.dispatch(
                                            createAction('gasParametersChangeModel/updateState')({
                                                innerList: newList
                                            })
                                        );
                                    }}
                                />
                            )}
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
                                timeString={SentencedToEmpty(item, ['ChangeTime'], '') == '' ? moment().format('YYYY-MM-DD') : moment(item.ChangeTime).format('YYYY-MM-DD')}
                                getPickerOption={this.getTimeOption}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={[{ height: 10 }]} />
                {SentencedToEmpty(item, ['ID'], '') != '' ? (
                    <FormDeleteButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    />
                ) : null}

                <View style={[{ height: 10 }]} />
                <FormSaveButton
                    onPress={() => {
                        if (item.RangeBeforeChange == '' || item.RangeAfterChange == '') {
                            ShowToast('请完整填写后提交');
                        } else {
                            this.props.dispatch(createAction('gasParametersChangeModel/addGasParametersChangeRecord')({}));
                        }
                    }}
                />
                <AlertDialog options={options} ref="doAlert" />
                {this.props.gasParametersChangeRecordSaveResult.status == -1 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.itemDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        );
    }
}
