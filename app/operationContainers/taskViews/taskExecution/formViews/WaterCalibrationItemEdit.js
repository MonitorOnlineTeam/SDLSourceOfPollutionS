/*
 * @Description: 废水 校准记录表 子表编辑器
 * @LastEditors: hxf
 * @Date: 2022-01-06 16:50:22
 * @LastEditTime: 2023-07-17 14:21:38
 * @FilePath: /SDLMainProject36/app/operationContainers/taskViews/taskExecution/formViews/WaterCalibrationItemEdit.js
 */

import moment from 'moment';
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, getPlatformValue, SentencedToEmpty, setPlatformValue } from '../../../../utils';
import Form2Switch from '../components/Form2Switch';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import { FormInputWidthUnit } from './DataConsistencyEditItem';

const itemName = ['FirstPoint', 'SecondPoint', 'ThirdPoint', 'FourthPoint'];
@connect(({ waterCalibrationFormModel }) => ({
    innerList: waterCalibrationFormModel.innerList, // 数据
    waterCalibrationRecordSaveResult: waterCalibrationFormModel.waterCalibrationRecordSaveResult, // 保存提交状态
    AnalyzerID: waterCalibrationFormModel.AnalyzerID, // 项目ID
    AnalyzerName: waterCalibrationFormModel.AnalyzerName,
    loadingText: waterCalibrationFormModel.loadingText,
    waterCalibrationRecordSaveResult: waterCalibrationFormModel.waterCalibrationRecordSaveResult,
    itemDeleteResult: waterCalibrationFormModel.itemDeleteResult,
    waterCalibrationUnitList: waterCalibrationFormModel.waterCalibrationUnitList,
}))
export default class WaterCalibrationItemEdit extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: `${SentencedToEmpty(navigation, ['state', 'params', 'item', 'AnalyzerName'], '')}校准记录表`,
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });
    };

    componentDidMount() {
        const TypeID = SentencedToEmpty(this.props.navigation, ['state', 'params', 'item', 'AnalyzerID'], '');
        this.props.dispatch(
            createAction('waterCalibrationFormModel/getWaterCheckRecordList')({
                TypeID
            })
        );
    }

    getHDateOption = (item, index) => {
        return {
            defaultTime: moment(item['CompletionTime']).format('YYYY-MM-DD HH:mm:ss'),
            type: 'minute',
            onSureClickListener: time => {
                let newInnerList = [].concat(this.props.innerList);
                newInnerList[index]['CompletionTime'] = time;
                this.props.dispatch(
                    createAction('waterCalibrationFormModel/updateState')({
                        innerList: newInnerList
                    })
                );
            }
        };
    };

    confirm = () => {
        this.props.dispatch(
            createAction('waterCalibrationFormModel/delSubtable')({
                params: { ID: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AnalyzerID'], '') }
            })
        );
    };

    render() {
        let options = {
            headTitle: '提示',
            messText: `确认删除${SentencedToEmpty(this.props.navigation, ['state', 'params', 'item', 'AnalyzerName'], '')}校准记录表吗？`,
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
                    {this.props.innerList.map((item, index) => {
                        return (
                            <View style={[{ width: SCREEN_WIDTH - 20 }]} key={`subtable_table${index}`}>
                                <View style={[{ width: SCREEN_WIDTH - 20, height: 33, flexDirection: 'row', alignItems: 'center', paddingLeft: 9, paddingRight: 4, justifyContent: 'space-between' }]}>
                                    <Text style={[{ fontSize: 15, color: '#333333' }]}>{`校准记录表${index + 1}`}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            newInnerList.splice(index, 1);
                                            this.props.dispatch(
                                                createAction('waterCalibrationFormModel/updateState')({
                                                    innerList: newInnerList
                                                })
                                            );
                                        }}
                                        style={[{ height: 33, width: 64, alignItems: 'flex-end', justifyContent: 'center' }]}
                                    >
                                        <Image style={[{ width: 12, height: 12, tintColor: '#D0D0D0' }]} source={require('../../../../images/clear.png')} />
                                    </TouchableOpacity>
                                </View>
                                {['第一点', '第二点', '第三点', '第四点'].map((rowItem, rowIndex) => {
                                    return (
                                        <View key={`editItem_${index}_${rowIndex}`} style={[{ width: SCREEN_WIDTH - 20, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 10 }]}>
                                            <View style={[{ width: SCREEN_WIDTH - 40, height: 44, flexDirection: 'row', alignItems: 'center' }]}>
                                                <View style={{ width: 2, height: 13, backgroundColor: '#4DA9FF', marginRight: 8 }} />
                                                <Text style={{ fontSize: 14, color: '#4DA9FF' }}>{rowItem}</Text>
                                            </View>
                                            <View style={{ height: 1, width: SCREEN_WIDTH - 40, backgroundColor: '#E7E7E7' }} />
                                            {/* <FormInput
                                                label="标液浓度"
                                                placeholder="请填写标液浓度"
                                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                value={getPlatformValue(item[itemName[rowIndex]], 0)}
                                                onChangeText={text => {
                                                    let newData = '';
                                                    let newInnerList = [].concat(this.props.innerList);
                                                    newData = setPlatformValue(item[itemName[rowIndex]], text, 0);
                                                    newInnerList[index][itemName[rowIndex]] = newData;
                                                    this.props.dispatch(
                                                        createAction('waterCalibrationFormModel/updateState')({
                                                            innerList: newInnerList
                                                        })
                                                    );
                                                }}
                                            /> */}
                                            {/* 
                                                FirstPoint:'',//  第一点   标准浓度 与信号值用逗号分隔
                                                FourthPoint:'',// 第四点   标准浓度 与信号值用逗号分隔
                                                IsQualified:IsQualified,// 是否合格 0否 1是
                                                SecondPoint:'',// 第二点   标准浓度 与信号值用逗号分隔
                                                ThirdPoint:'',// 第三点   标准浓度 与信号值用逗号分隔
                                            */}
                                            <FormInputWidthUnit
                                                label="标液浓度"
                                                textPlaceHolder="请填写标液浓度"
                                                selectorPlaceHolder="选择单位"
                                                option={{
                                                    codeKey: 'Name',
                                                    nameKey: 'Name',
                                                    defaultCode: getPlatformValue(item[itemName[rowIndex]], 2),//getPlatformValue(item[itemName[rowIndex]], 2)
                                                    dataArr: this.props.waterCalibrationUnitList,
                                                    onSelectListener: unitItem => {
                                                        // console.log('unitItem = ',unitItem);
                                                        // let newInnerList = [].concat(this.props.innerList);
                                                        // let newStr = setPlatformValue(item.ErrorValue, unitItem.Name, 1);
                                                        // newInnerList[index]['ErrorValue'] = newStr;
                                                        // this.props.dispatch(
                                                        //     createAction('waterSampleComparisonTestModel/updateState')({
                                                        //         innerList: newInnerList
                                                        //     })
                                                        // );
                                                        const unit = SentencedToEmpty(unitItem, ['Name'], '');
                                                        let newData = '';
                                                        let newInnerList = [].concat(this.props.innerList);
                                                        newData = setPlatformValue(item[itemName[rowIndex]], unit, 2, 3);
                                                        newInnerList[index][itemName[rowIndex]] = newData;
                                                        this.props.dispatch(
                                                            createAction('waterCalibrationFormModel/updateState')({
                                                                innerList: newInnerList
                                                            })
                                                        );
                                                    }
                                                }}
                                                showText={getPlatformValue(item[itemName[rowIndex]], 2)}
                                                onChangeText={text => {
                                                    let newData = '';
                                                    let newInnerList = [].concat(this.props.innerList);
                                                    newData = setPlatformValue(item[itemName[rowIndex]], text, 0, 3);
                                                    newInnerList[index][itemName[rowIndex]] = newData;
                                                    this.props.dispatch(
                                                        createAction('waterCalibrationFormModel/updateState')({
                                                            innerList: newInnerList
                                                        })
                                                    );
                                                }}
                                                textValue={getPlatformValue(item[itemName[rowIndex]], 0)}
                                            />
                                            <FormInput
                                                last={true}
                                                label="信号值"
                                                placeholder="请填写信号值"
                                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                value={getPlatformValue(item[itemName[rowIndex]], 1)}
                                                onChangeText={text => {
                                                    let newData = '';
                                                    let newInnerList = [].concat(this.props.innerList);
                                                    newData = setPlatformValue(item[itemName[rowIndex]], text, 1, 3);
                                                    newInnerList[index][itemName[rowIndex]] = newData;
                                                    this.props.dispatch(
                                                        createAction('waterCalibrationFormModel/updateState')({
                                                            innerList: newInnerList
                                                        })
                                                    );
                                                }}
                                            />
                                        </View>
                                    );
                                })}
                                <View style={[{ width: SCREEN_WIDTH - 20, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 10 }]}>
                                    <Form2Switch
                                        label="是否通过"
                                        // data={[{name:'有',value:true},{name:'无',value:false}]}
                                        data={[
                                            { name: '是', value: 1 },
                                            { name: '否', value: 0 }
                                        ]}
                                        value={item['IsQualified']}
                                        onChange={value => {
                                            let newInnerList = [].concat(this.props.innerList);
                                            newInnerList[index]['IsQualified'] = value;
                                            this.props.dispatch(
                                                createAction('waterCalibrationFormModel/updateState')({
                                                    innerList: newInnerList
                                                })
                                            );
                                        }}
                                    />
                                    <FormDatePicker
                                        getPickerOption={() => {
                                            return this.getHDateOption(item, index);
                                        }}
                                        label="校准完成时间"
                                        timeString={moment(item['CompletionTime']).format('YYYY-MM-DD HH:mm')}
                                    />
                                </View>
                            </View>
                        );
                    })}
                    <TouchableOpacity
                        onPress={() => {
                            let newInnerList = [].concat(this.props.innerList);
                            newInnerList.push({
                                AnalyzerID: this.props.AnalyzerID, // 项目ID
                                AnalyzerName: this.props.AnalyzerName,
                                FirstPoint: '', //  第一点   标准浓度 与信号值用逗号分隔
                                FourthPoint: '', // 第四点   标准浓度 与信号值用逗号分隔
                                IsQualified: 0, // 是否合格 0否 1是
                                SecondPoint: '', // 第二点   标准浓度 与信号值用逗号分隔
                                ThirdPoint: '', // 第三点   标准浓度 与信号值用逗号分隔
                                CompletionTime: moment().format('YYYY-MM-DD HH:mm:ss') // 校准完成时间
                            });
                            this.props.dispatch(
                                createAction('waterCalibrationFormModel/updateState')({
                                    innerList: newInnerList
                                })
                            );
                        }}
                    >
                        <View style={[{ width: SCREEN_WIDTH - 20, justifyContent: 'center', alignItems: 'center', height: 64 }]}>
                            <View style={{ height: 30, width: 110, borderColor: '#4DA9FF', borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[{ fontSize: 17, color: '#4DA9FF' }]}>{'添加校准项'}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                {SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'IsWrite'], 0) == 1 ? (
                    <FormSuspendDelButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    />
                ) : null}
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('waterCalibrationFormModel/addWaterCalibrationRecord')({}));
                    }}
                    style={[{ height: 44, width: SCREEN_WIDTH - 20, backgroundColor: '#4DA9FF', justifyContent: 'center', alignItems: 'center' }]}
                >
                    <Text style={{ fontSize: 17, color: 'white' }}>保存</Text>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.waterCalibrationRecordSaveResult.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.itemDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </View>
        );
    }
}
