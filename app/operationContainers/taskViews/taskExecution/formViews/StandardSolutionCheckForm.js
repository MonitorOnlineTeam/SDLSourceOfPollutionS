// /*
//  * @Description: 标准溶液核查记录 
//  * @LastEditors: hxf
//  * @Date: 2022-01-09 18:46:15
//  * @LastEditTime: 2022-01-09 18:46:16
//  * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/StandardSolutionCheckList.js
//  */

import moment from 'moment';
import React, { Component, PureComponent } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingComponent, StatusPage } from '../../../../components';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../../utils';
import FormSuspendDelButton from '../components/FormSuspendDelButton';
import FormText from '../components/FormText';

@connect(({ standardSolutionCheckModel }) => ({
    waterCheckRecordListResult: standardSolutionCheckModel.waterCheckRecordListResult,
    formDeleteResult: standardSolutionCheckModel.formDeleteResult
}))
export default class StandardSolutionCheckForm extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '标准溶液检查记录',
            title: '标液检查记录',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
            waterCheckRecordListResult: { status: -1 },
            innerList: [],
        }));
        this.props.dispatch(createAction('standardSolutionCheckModel/getWaterCheckRecordList')({
            TypeID: ID
        }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    confirm = () => {
        this.props.dispatch(createAction('standardSolutionCheckModel/delForm')({}))
    }

    render() {
        let recordList = SentencedToEmpty(this.props
            , ['waterCheckRecordListResult', 'data', 'Datas'
                , 'Record', 'RecordList'], [])
        let options = {
            headTitle: '提示',
            messText: `确认删除标液检查记录吗？`,
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
            <StatusPage
                status={this.props.waterCheckRecordListResult.status}
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
                <View style={[{
                    width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                    , paddingHorizontal: 10, marginTop: 10
                }]}>
                    <FormText
                        label={'运维单位'}
                        showString={SentencedToEmpty(this.props
                            , ['waterCheckRecordListResult', 'data', 'Datas'
                                , 'Record', 'Content', 'MaintenanceManagementUnit'], '--')}
                    />
                </View>
                <View style={[{
                    width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                    , paddingHorizontal: 10, marginBottom: 10
                }]}>
                    <FormText
                        label={'安装地点'}
                        last={true}
                        showString={SentencedToEmpty(this.props
                            , ['waterCheckRecordListResult', 'data', 'Datas'
                                , 'Record', 'Content', 'PointPosition'], '--')}
                    />
                </View>
                <View style={[{
                    width: SCREEN_WIDTH - 20, backgroundColor: 'white'
                    , paddingHorizontal: 10
                }]}>
                    {
                        recordList.map((item, index) => {
                            return (<TouchableOpacity
                                onPress={() => {
                                    let children = SentencedToEmpty(item, ['childList'], []);
                                    if (children.length == 0) {
                                        children.push({
                                            // FormMainID:SentencedToEmpty(this.props,['waterCheckRecordListResult','data','Datas','Record']),// 主表ID
                                            AnalyzerID: item.AnalyzerID,// 项目ID
                                            AnalyzerName: item.AnalyzerName,// 项目名称
                                            CompletionTime: moment().format('YYYY-MM-DD HH:mm:ss'),// 核查完成时间
                                            Concentration: '',// 标准容易浓度  浓度值与单位用逗号分隔 单位存中文名称
                                            Result: '',// 仪器测量结果  浓度值与单位用逗号分隔  单位存中文名称
                                            IsQualified: 0,// 是否合格 0否 1是FormMainID 主表ID
                                        });

                                    }
                                    this.props.dispatch(createAction('standardSolutionCheckModel/updateState')({
                                        innerList: children,
                                        AnalyzerID: item.AnalyzerID,// 项目ID
                                        AnalyzerName: item.AnalyzerName,// 项目名称
                                    }))
                                    // 各核查项目
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'StandardSolutionCheckItemEdit', params: { item }
                                    }));
                                }}
                                key={`item${index}`}
                                style={[
                                    { width: SCREEN_WIDTH - 40, height: 45 }
                                ]}
                            >
                                <View style={[{
                                    width: SCREEN_WIDTH - 40, height: 44
                                    , flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                                }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{item.AnalyzerName}</Text>
                                    {
                                        item.IsWrite == 1 ? <Text style={[{ fontSize: 14, color: globalcolor.antBlue }]}>{'已填写'}</Text>
                                            : <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>{'未填写'}</Text>
                                    }
                                </View>
                                <View style={[{ height: 1, width: SCREEN_WIDTH - 40, backgroundColor: '#E7E7E7' }]} />
                            </TouchableOpacity>)
                        })
                    }
                </View>
                {
                    SentencedToEmpty(this.props
                        , ['waterCheckRecordListResult', 'data', 'Datas'
                            , 'Record', 'ID'], '') != '' ? <FormSuspendDelButton
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    /> : null
                }
                <AlertDialog options={options} ref="doAlert" />
                {this.props.formDeleteResult.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        )
    }
}