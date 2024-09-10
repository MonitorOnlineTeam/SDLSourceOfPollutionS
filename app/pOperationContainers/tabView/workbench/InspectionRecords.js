/*
 * @Description: 督查记录
 * @LastEditors: hxf
 * @Date: 2022-03-23 09:07:46
 * @LastEditTime: 2022-06-02 14:15:02
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/InspectionRecords.js
 */

import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, SDLText, SimplePicker, SimplePickerRangeDay, SimplePickerSingleTime, StatusPage } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../../utils';

@connect(({ app, inspectionRecordsModel }) => ({
    selectEnterprise: app.selectEnterprise,
    remoteInspectorListResult:inspectionRecordsModel.remoteInspectorListResult,
    remoteInspectorListData:inspectionRecordsModel.remoteInspectorListData,
    BeginTime:inspectionRecordsModel.BeginTime,
    EndTime:inspectionRecordsModel.EndTime,
    remoteInspectorListTotal:inspectionRecordsModel.remoteInspectorListTotal,
}))
export default class InspectionRecords extends Component {

    static navigationOptions = createNavigationOptions({
        title: '督查记录',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        console.log('componentDidMount');
        this.props.dispatch(
            createAction('inspectionRecordsModel/updateState')({
                selectEnterprise: { EntName: '请选择' }, remoteInspectorListResult:{status:-1},
                remoteInspectorListData:[],DateTime: moment().format('YYYY-MM-DD 00:00:00')
            }));
        this.props.dispatch(
            createAction('inspectionRecordsModel/getRemoteInspectorList')({}));
    }

    getInspectionResultOption = () => {
        const dataArr = [{ name: '全部', code: -1 }, { name: '合格', code: 1 }, { name: '不合格', code: 0 }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择核查结果',
            defaultCode: -1,
            dataArr,
            onSelectListener: item => {
                console.log('getInspectionResultOption item = ',item);
                this.props.dispatch(
                    createAction('inspectionRecordsModel/updateState')({
                        CheckStatus: item.code }));
                this.statusPageOnRefresh();
            }
        };
    };

    renderItem = ({ item, index }) => {
        let resultCheck = SentencedToEmpty(item, ['resultCheck'], -1);
        return(<TouchableOpacity 
        onPress={()=>{
            console.log(item);
            this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: item.formUrl, title: '督查记录', item, reloadList: () => {} } }));
        }}
        style={{width:SCREEN_WIDTH
        , flexDirection:'row', backgroundColor:'white', paddingVertical:13}}>
            <View style={[{width:SCREEN_WIDTH*3/4,paddingLeft: 13}]}>
                <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                    {`${SentencedToEmpty(item, ['pointName'], '未知排口')}`}
                </SDLText>
                <SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                    {`企业名称:${SentencedToEmpty(item, ['entName'], '未知')}`}
                </SDLText>
                <SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                    {`核查月份:${SentencedToEmpty(item, ['dateTime'], '')}`}
                </SDLText>
                {/* resultCheck  1  合格 2 不合格 */}
                <SDLText fontType={'small'} style={[{ color: '#666', marginTop: 8 }]}>
                    {`核查结果:${ resultCheck }`}
                </SDLText>
            </View>
            <View style={[{width:SCREEN_WIDTH/4,paddingRight:24
            ,justifyContent:'flex-end',alignItems:'flex-end'}]}>
                <View style={[{}]}>
                    <SDLText fontType={'normal'} style={[{ color: globalcolor.antBlue }]}>
                        {'详情>'}
                    </SDLText>
                </View>
            </View>
        </TouchableOpacity>);
    }

    callback = (params) => {
        // console.log(params);
        // this.props.dispatch(
        //     createAction('inspectionRecordsModel/getRemoteInspectorList')({}));
        this.statusPageOnRefresh();
    }

    onRefresh = () =>{
        this.props.dispatch(
                    createAction('inspectionRecordsModel/updateState')({
                        PageIndex: 1 }));
        this.props.dispatch(
            createAction('inspectionRecordsModel/getRemoteInspectorList')({setListData: this.list.setListData}));
    }

    statusPageOnRefresh = () =>{
        this.props.dispatch(
                    createAction('inspectionRecordsModel/updateState')({
                        PageIndex: 1, remoteInspectorListResult:{status:-1} }));
        this.props.dispatch(
            createAction('inspectionRecordsModel/getRemoteInspectorList')({}));
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = this.props.BeginTime;
        endTime = this.props.EndTime;
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM-DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.props.dispatch(createAction('inspectionRecordsModel/updateState')({ 
                    BeginTime: startMoment.format('YYYY-MM-DD 00:00:00'), 
                    EndTime: endMoment.format('YYYY-MM-DD 23:59:59') 
                }));
                this.statusPageOnRefresh();
            }
        };
    };

    render() {
        return (
            <View style={[{width:SCREEN_WIDTH,flex:1}]}>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff'
                ,borderBottomColor:globalcolor.lightGreyBackground,borderBottomWidth:1, paddingHorizontal:8 }}>
                    <SimplePicker option={this.getInspectionResultOption()}
                        textStyle={{textAlign:'left'}}
                        style={{minWidth:80}}
                    />
                    {/* <SimplePickerSingleTime
                        lastIcon={require('../../../images/ic_filt_arrows.png')}
                        ref={ref => (this._daytouchable = ref)}
                        option={{
                            formatStr: 'YYYY-MM-DD',
                            type: 'day',
                            onSureClickListener: time => {
                                // console.log('TestView1 time = ', time);
                                this.props.dispatch(
                                    createAction('inspectionRecordsModel/updateState')({
                                        DateTime: time }));
                                // this.props.dispatch(
                                //     createAction('inspectionRecordsModel/getRemoteInspectorList')({}));
                                this.statusPageOnRefresh();
                            }
                        }}
                        style={[{ width: 120 }]}
                    /> */}
                    <SimplePickerRangeDay separator={'~'} option={this.getRangeDaySelectOption()}/>
                </View>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, marginBottom: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    // routeName: 'ContactOperation',
                                    routeName: 'SelectEnterpriseList',
                                    params: {
                                        isCreatTask: true,
                                        selectType: 'enterprise',
                                        callback: this.callback
                                    }
                                })
                            );
                        }}
                        style={[{
                            flex:1,
                            height: 45,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }]}
                    >
                        <View style={{
                            flex:1,
                            height: 45,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <Text style={{ fontSize: 14, marginLeft: 18 }}>{' 企业'}</Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    maxWidth: SCREEN_WIDTH - 150,
                                    fontSize: 14,
                                    color: '#666',
                                    marginLeft: 24
                                }}
                            >
                                {this.props.selectEnterprise.EntName}
                            </Text>
                        </View>

                        <Image style={{ width: 10, height: 10, right: 16 }} source={require('../../../images/ic_filt_arrows.png')} />
                    </TouchableOpacity>
                </View>
                
                <StatusPage
                    backRef={true}
                    status={SentencedToEmpty(this.props.remoteInspectorListResult,['status'],1000)}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.statusPageOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.statusPageOnRefresh();
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        style={[{ backgroundColor: '#f2f2f2' }]}
                        ref={ref => (this.list = ref)}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                        pageSize={20}
                        hasMore={() => {
                            return this.props.remoteInspectorListTotal> this.props.remoteInspectorListData.length;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.props.dispatch(createAction('inspectionRecordsModel/updateState')({ PageIndex: index }));
                            this.props.dispatch(
                                createAction('inspectionRecordsModel/getRemoteInspectorList')({setListData: this.list.setListData}));
                        }}
                        renderItem={this.renderItem}
                        data={this.props.remoteInspectorListData}
                        // data={[{},{},{}]}
                    />
                </StatusPage>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    row: {
        width: '100%',
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e5e5e5'
    }
});