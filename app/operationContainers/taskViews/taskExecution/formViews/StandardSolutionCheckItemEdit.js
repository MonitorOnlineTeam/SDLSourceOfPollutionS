/*
 * @Description: 标准溶液核查记录 项目编辑
 * @LastEditors: hxf
 * @Date: 2022-01-09 18:49:22
 * @LastEditTime: 2024-09-25 18:54:05
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/StandardSolutionCheckItemEdit.js
 */


import moment from 'moment';
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize'
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, setPlatformValue } from '../../../../utils';
import Form2Switch from '../components/Form2Switch';
import FormDatePicker from '../components/FormDatePicker';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import { FormInputWidthUnit } from './DataConsistencyEditItem';

@connect(({ standardSolutionCheckModel }) => ({
    waterCheckRecordListResult: standardSolutionCheckModel.waterCheckRecordListResult,
    innerList: standardSolutionCheckModel.innerList,
    AnalyzerID: standardSolutionCheckModel.AnalyzerID,// 项目ID
    AnalyzerName: standardSolutionCheckModel.AnalyzerName,// 项目名称
    waterCheckRecordListSaveResult: standardSolutionCheckModel.waterCheckRecordListSaveResult,
    itemDeleteResult: standardSolutionCheckModel.itemDeleteResult,
}))
export default class StandardSolutionCheckItemEdit extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: `${SentencedToEmpty(navigation, ['state', 'params', 'item', 'AnalyzerName'], '')}检查记录`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
            innerList: [],
        }))
    }

    getHDateOption = (item, index) => {
        return {
            defaultTime: moment(item.CompletionTime).format('YYYY-MM-DD HH:mm:ss'),
            // type: 'hour',
            type: 'minute',
            onSureClickListener: time => {
                let newInnerList = [].concat(this.props.innerList);
                newInnerList[index]['CompletionTime'] = time
                this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                    innerList: newInnerList
                }))
            },
        };
    };

    confirm = () => {
        this.props.dispatch(createAction('standardSolutionCheckModel/delSubtable')({
            params: { ID: SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'AnalyzerID'], '') }
        }))
    }

    render() {
        let unitList = SentencedToEmpty(this.props, ['waterCheckRecordListResult', 'data', 'Datas', 'UnitList'], [])
        let options = {
            headTitle: '提示',
            messText: `确认删除${SentencedToEmpty(this.props.route, ['params', 'params', 'item', 'AnalyzerName'], '')}检查记录吗？`,
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
                <ScrollView style={[{ width: SCREEN_WIDTH - 20 }]} >
                    {
                        this.props.innerList.map((item, index) => {
                            return (<View style={[{ width: SCREEN_WIDTH - 20 }]}>
                                <View style={[{
                                    width: SCREEN_WIDTH - 20, height: 33
                                    , flexDirection: 'row', alignItems: 'center'
                                    , paddingLeft: 9, paddingRight: 4, justifyContent: 'space-between'
                                }]}>
                                    <Text style={[{ fontSize: 15, color: '#333333' }]}>{`核查记录表${(index + 1)}`}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            newInnerList.splice(index, 1);
                                            this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                innerList: newInnerList
                                            }))
                                        }}
                                        style={[{
                                            height: 33, width: 64
                                            , alignItems: 'flex-end', justifyContent: 'center'
                                        }]}>
                                        <Image
                                            style={[{ width: 12, height: 12, tintColor: '#D0D0D0' }]}
                                            source={require('../../../../images/clear.png')} />
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                                        , paddingHorizontal: 10, marginBottom: 10
                                    }]}
                                >
                                    <FormDatePicker
                                        getPickerOption={() => {
                                            return this.getHDateOption(item, index)
                                        }}
                                        label='核查完成时间'
                                        timeString={moment(item.CompletionTime).format('YYYY-MM-DD HH:mm')}
                                    />
                                    <FormInputWidthUnit
                                        label='标准溶液浓度'
                                        selectorPlaceHolder='选择单位'
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(item.Concentration, 1),
                                            dataArr: unitList,
                                            onSelectListener: unitItem => {
                                                let newInnerList = [].concat(this.props.innerList);
                                                let newStr = setPlatformValue(
                                                    item.Concentration, unitItem.Name, 1);
                                                newInnerList[index]['Concentration'] = newStr
                                                this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                    innerList: newInnerList
                                                }))
                                            }
                                        }}
                                        showText={getPlatformValue(item.Concentration, 1)}
                                        textPlaceHolder='请输入浓度'
                                        onChangeText={(text) => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            let newStr = setPlatformValue(
                                                item.Concentration, text, 0);
                                            newInnerList[index]['Concentration'] = newStr
                                            this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                innerList: newInnerList
                                            }))
                                        }}
                                        textValue={getPlatformValue(item.Concentration, 0)}
                                    />
                                    <FormInputWidthUnit
                                        label='仪器测量结果'
                                        selectorPlaceHolder='选择单位'
                                        option={{
                                            codeKey: 'Name',
                                            nameKey: 'Name',
                                            defaultCode: getPlatformValue(item.Result, 1),
                                            dataArr: unitList,
                                            onSelectListener: unitItem => {
                                                let newInnerList = [].concat(this.props.innerList);
                                                let newStr = setPlatformValue(
                                                    item.Result, unitItem.Name, 1);
                                                newInnerList[index]['Result'] = newStr
                                                this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                    innerList: newInnerList
                                                }))
                                            }
                                        }}
                                        showText={getPlatformValue(item.Result, 1)}
                                        textPlaceHolder='请输入浓度'
                                        onChangeText={(text) => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            let newStr = setPlatformValue(
                                                item.Result, text, 0);
                                            newInnerList[index]['Result'] = newStr
                                            this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                innerList: newInnerList
                                            }))
                                        }}
                                        textValue={getPlatformValue(item.Result, 0)}
                                    />
                                    <Form2Switch
                                        label='是否合格'
                                        data={[{ name: '是', value: 1 }, { name: '否', value: 0 }]}
                                        value={item['IsQualified']}
                                        onChange={(value) => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            newInnerList[index]['IsQualified'] = value
                                            this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                                innerList: newInnerList
                                            }))
                                        }}
                                    />
                                </View>
                            </View>)
                        })
                    }
                    <TouchableOpacity
                        onPress={() => {
                            let newInnerList = [].concat(this.props.innerList);
                            newInnerList.push({
                                AnalyzerID: this.props.AnalyzerID,// 项目ID
                                AnalyzerName: this.props.AnalyzerName,// 项目名称
                                CompletionTime: moment().format('YYYY-MM-DD HH:mm:ss'),// 核查完成时间
                                Concentration: '',// 标准容易浓度  浓度值与单位用逗号分隔 单位存中文名称
                                Result: '',// 仪器测量结果  浓度值与单位用逗号分隔  单位存中文名称
                                IsQualified: 0,// 是否合格 0否 1是FormMainID 主表ID
                            });
                            this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                innerList: newInnerList
                            }))
                        }}
                    >
                        <View style={[{ width: SCREEN_WIDTH - 20, justifyContent: 'center', alignItems: 'center', height: 64 }]}>
                            <View style={{
                                height: 30, width: 110,
                                borderColor: '#4DA9FF', borderRadius: 15,
                                borderWidth: 1, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={[{ fontSize: 17, color: '#4DA9FF' }]}>{'添加核查项'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {
                    SentencedToEmpty(this.props, ['route', 'params', 'params', 'item', 'IsWrite'], 0)
                        == 1 ? <FormSuspendDelButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    /> : null
                }
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('standardSolutionCheckModel/addWaterCheckRecordRecord')({
                        }))
                    }}
                    style={[{
                        height: 44, width: SCREEN_WIDTH - 20
                        , backgroundColor: '#4DA9FF'
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    <Text style={{ fontSize: 17, color: 'white' }}>保存</Text>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.waterCheckRecordListSaveResult.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.itemDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        )
    }
}
