/*
 * @Description: 数据一致性（小时日均数据）记录
 * @LastEditors: hxf
 * @Date: 2021-12-16 16:59:02
 * @LastEditTime: 2024-07-01 19:12:08
 * @FilePath: /SDLMainProject37_1/app/operationContainers/taskViews/taskExecution/formViews/DataConsistencyHDRecord.js
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, StyleSheet, Image, DeviceEventEmitter } from 'react-native'
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { AlertDialog, DeclareModule, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../../utils';
import FormDatePicker, { FormDateTimePicker } from '../components/FormDatePicker';
import FormText from '../components/FormText';
import { ItemButton } from './DataConsistencyRecord';

@connect(({ dataConsistencyModel, taskDetailModel }) => ({
    hdEditstatus: dataConsistencyModel.hdEditstatus,
    dataConsistencyHDRecordListResult: dataConsistencyModel.dataConsistencyHDRecordListResult,// 数据一致性（实时数据）记录 查询结果
    hDate: dataConsistencyModel.hDate, // 数据一致性（小时）
    dDate: dataConsistencyModel.dDate, // 数据一致性（日均）
    taskDetail: taskDetailModel.taskDetail, // 任务信息
}))
export default class DataConsistencyHDRecord extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '数据一致性（小时与日数据）记录',
            title: '数据一致性记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17 }, //标题居中
            headerRight: (
                <DeclareModule
                    contentRender={() => {
                        return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                    }}
                    options={{
                        headTitle: '说明',
                        innersHeight: 180,
                        messText: `1、填写该电子表单目的是确定历史数据情况。2、每个月填写一次。3、填写同一小时、同一日在DAS、各个监控平台上的小时、日均数据。4、若项目无DAS，无需填写该表单。`,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '知道了',
                                btnStyle: { backgroundColor: '#fff' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => { }
                            }
                        ]
                    }}
                />
            )
        });

    componentDidMount() {
        this.onRefresh()
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item'], {});
        this.props.dispatch(
            createAction('dataConsistencyModel/updateState')(
                { dataConsistencyHDRecordListResult: { status: -1 } }));
        this.props.dispatch(createAction('dataConsistencyModel/getDataConsistencyHDRecordList')({
            TypeID: ID
        }));
    }

    getDDateOption = () => {
        return {
            defaultTime: moment(this.props.dDate).format('YYYY-MM-DD HH:mm:ss'),
            type: 'day',
            onSureClickListener: (time, setTime) => {
                const datas = SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas'], {});
                const recordList = SentencedToEmpty(datas, ['Record', 'RecordList'], []);
                let IsWrite = false;
                recordList.map((item, index) => {
                    // DataType 3日
                    if (item.DataType == 3 && item.IsWrite == '1') {
                        IsWrite = true
                    }
                })
                if (SentencedToEmpty(this.props.dataConsistencyHDRecordListResult
                    , ['data', 'Datas', 'Record', 'ID'], '') != '' && IsWrite) {
                    const TypeID = SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas', 'Record', 'TypeID'], {});
                    this.props.dispatch(
                        createAction('dataConsistencyModel/updateConsistencyTime')(
                            { dDate: time, oldDate: this.props.dDate, TypeID, setTime }));
                } else {
                    this.props.dispatch(
                        createAction('dataConsistencyModel/updateState')(
                            { dDate: time }));
                }
            },
        };
    };

    getHDateOption = () => {
        return {
            defaultTime: moment(this.props.hDate).format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: (time, setTime) => {
                const datas = SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas'], {});
                const recordList = SentencedToEmpty(datas, ['Record', 'RecordList'], []);
                let IsWrite = false;
                recordList.map((item, index) => {
                    // DataType 2小时
                    if (item.DataType == 2 && item.IsWrite == '1') {
                        IsWrite = true
                    }
                })
                if (SentencedToEmpty(this.props.dataConsistencyHDRecordListResult
                    , ['data', 'Datas', 'Record', 'ID'], '') != '' && IsWrite) {
                    const TypeID = SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas', 'Record', 'TypeID'], {});
                    this.props.dispatch(
                        createAction('dataConsistencyModel/updateConsistencyTime')(
                            { hDate: time, oldDate: this.props.hDate, TypeID, setTime }));
                } else {
                    this.props.dispatch(
                        createAction('dataConsistencyModel/updateState')(
                            { hDate: time }));
                }
            },
        };
    };

    cancelButton = () => { }

    confirm = () => {
        this.props.dispatch(createAction('dataConsistencyModel/deleteDataConsistencyRecordNew')({
            params: {
                ZhuID: this.props.taskDetail.ID,
                TypeID: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'TypeID'], ''),
            }
        }))
    }


    render() {
        // DataType 1实时 2小时 3日
        const datas = SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas'], {});
        const recordList = SentencedToEmpty(datas, ['Record', 'RecordList'], []);
        const { EnterpriseName = '--', PointName = '--' } = SentencedToEmpty(datas, ['Record', 'Content'], []);
        const columnList = SentencedToEmpty(datas, ['ColumnList'], []);
        const unitList = SentencedToEmpty(datas, ['UnitList'], []);
        const platformTypeList = SentencedToEmpty(datas, ['PlatformTypeList'], []);
        let options = {
            headTitle: '提示',
            messText: '确认删除该数据一致性记录吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        return (<StatusPage
            errorText={SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Message'], '获取表单信息发生错误')}
            status={this.props.dataConsistencyHDRecordListResult.status}
            style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: globalcolor.backgroundGrey }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefresh();
            }}
        >
            <ScrollView>
                <View style={[{
                    width: SCREEN_WIDTH - 24, alignItems: 'center'
                    , backgroundColor: globalcolor.white, marginHorizontal: 12, paddingHorizontal: 6, marginTop: 12
                }]}>
                    <FormText
                        label={'企业名称'}
                        showString={EnterpriseName}
                    />
                    <FormText
                        last={true}
                        label={'监测点名称'}
                        showString={PointName}
                    />
                </View>
                <Text style={[styles.title, { marginLeft: 16, marginTop: 12 }]}>{'小时数据'}</Text>
                <View style={[{
                    width: SCREEN_WIDTH - 24, alignItems: 'center'
                    , backgroundColor: globalcolor.white, marginHorizontal: 12, paddingHorizontal: 6, marginTop: 12
                }]}>
                    <FormDatePicker
                        required={true}
                        getPickerOption={this.getHDateOption}
                        label={'小时数据时间'}
                        timeString={moment(this.props.hDate).format('YYYY-MM-DD HH:00')}
                    />
                    {
                        recordList.map((item, index) => {
                            // DataType 2小时
                            if (item.DataType == 2) {
                                return (<ItemButton
                                    key={`button${index}`}
                                    label={item.PollutantName}
                                    filled={item.IsWrite == '1'}
                                    click={() => {
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyHDEditItem', params: { item, columnList, unitList, platformTypeList } }));
                                        // this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyEditItem', params: { item, columnList, unitList, platformTypeList } }))
                                    }}
                                />)
                            }
                        })
                    }
                </View>
                <Text style={[styles.title, { marginLeft: 16, marginTop: 12 }]}>{'日数据'}</Text>
                <View style={[{
                    width: SCREEN_WIDTH - 24, alignItems: 'center'
                    , backgroundColor: globalcolor.white, marginHorizontal: 12, paddingHorizontal: 6, marginTop: 12
                }]}>
                    <FormDatePicker
                        required={true}
                        getPickerOption={this.getDDateOption}
                        label={'日数据时间'}
                        timeString={moment(this.props.dDate).format('YYYY-MM-DD')}
                    />
                    {
                        recordList.map((item, index) => {
                            // DataType 3日
                            if (item.DataType == 3) {
                                return (<ItemButton
                                    key={`button${index}`}
                                    label={item.PollutantName}
                                    filled={item.IsWrite == '1'}
                                    click={() => {
                                        this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyHDEditItem', params: { item, columnList, unitList, platformTypeList } }));
                                        // this.props.dispatch(NavigationActions.navigate({ routeName: 'DataConsistencyEditItem', params: { item, columnList, unitList, platformTypeList } }))
                                    }}
                                />)
                            }
                        })
                    }
                </View>
            </ScrollView>
            <View style={[{ width: SCREEN_WIDTH - 24, alignItems: 'center' }]}>
                {SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'FormMainID'], '') != ''
                    || SentencedToEmpty(this.props, ['dataConsistencyHDRecordListResult', 'data', 'Datas', 'Record', 'ID'], '') != '' ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
            </View>
            <AlertDialog options={options} ref="doAlert" />
            {this.props.hdEditstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
        </StatusPage>)
    }
}

const styles = StyleSheet.create({
    title: {
        lineHeight: 24,
        fontSize: 15,
        color: '#333333'
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    },
})