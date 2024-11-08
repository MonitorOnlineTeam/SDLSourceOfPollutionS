/*
 * @Description: 宝武上海环境平台-企业列表
 * @LastEditors: hxf
 * @Date: 2023-05-05 16:09:28
 * @LastEditTime: 2024-11-04 08:55:07
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/shanghaihuanjing/SHEnterpriseList.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRootUrl } from '../../dvapack/storage';

import { SentencedToEmpty, createAction, NavigationActions, createNavigationOptions } from '../../utils';

@connect(({ BWModel }) => ({
    aLLOperationQuestionName: BWModel.aLLOperationQuestionName,
    getALLOperationTaskResult: BWModel.getALLOperationTaskResult,//运维任务信息列表 
    getALLOperationTaskData: BWModel.getALLOperationTaskData,//运维任务信息列表 
}))
export default class SHEnterpriseList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '运维任务',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.dispatch(createAction('BWModel/updateState')({ aLLOperationQuestionName: '', getALLOperationTaskResult: { status: -1 } }))
        this.refresh();
    }

    refresh = (setListData = () => { }) => {
        this.props.dispatch(createAction('BWModel/getALLOperationTask')({ setListData: setListData }));
    }

    renderItem = ({ item, index }) => {
        let rootUrl = getRootUrl();
        return (<TouchableOpacity
            key={`key${index}`}
            onPress={() => {
                //  修改前 title:item.QuestionName 
                // IDtoOPTID // 任务 ID
                this.props.dispatch(createAction('BWModel/updateState')({
                    IDtoOPTID: item.ID,
                    OTID: item.OTID, // 任务类别 ID 
                }));
                // this.props.dispatch(createAction('BWModel/getOperationTaskByID')({ }))

                this.props.dispatch(NavigationActions.navigate({ routeName: 'SHPointList', params: {} }));
                // this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl+'/appoperation/appQuestionDetail/'+item.ID, title: '帮助中心', item, reloadList: () => {} } }));
            }}
        >
            <View style={{ width: SCREEN_WIDTH, backgroundColor: 'white' }}>
                <View style={{
                    width: SCREEN_WIDTH - 26, marginHorizontal: 13
                    , minHeight: 43, borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                    , justifyContent: 'center'
                }}>
                    <Text numberOfLines={1} style={{ lineHeight: 16, fontSize: 15, color: '#87CEEB', lineHeight: 17 }}>{`${SentencedToEmpty(item, ['RWMC'], '')}`}</Text>
                    <Text style={{ lineHeight: 16, fontSize: 13, color: '#333333' }}>{
                        `${SentencedToEmpty(item, ['RWRQKS'], '') == '' ? '(----/--/--)' : moment(item.RWRQKS).format('YYYY/MM/DD')
                        }--${SentencedToEmpty(item, ['RWRQJS'], '') == '' ? '(----/--/--)' : moment(item.RWRQJS).format('YYYY/MM/DD')
                        }`
                    }</Text>
                </View>
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (<View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <View style={{
                height: 48, width: SCREEN_WIDTH
                , justifyContent: 'center', alignItems: 'center'
                , backgroundColor: '#ffffff'
            }}>
                <View style={{
                    height: 29, width: SCREEN_WIDTH - 27
                    , borderRadius: 5, backgroundColor: '#F4F4F4'
                    , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Image source={require('../../images/ic_search_help_center.png')}
                        style={{ width: 14, height: 14, marginLeft: 10 }}
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'请输入搜索关键字'}
                        style={{
                            flex: 1, color: '#999999', fontSize: 14, marginLeft: 5,
                            padding: 0
                        }}
                        value={this.props.aLLOperationQuestionName}
                        onChangeText={text => {
                            // this.setState({
                            //     QuestionName:text
                            // });
                            this.props.dispatch(createAction('BWModel/updateState')({ aLLOperationQuestionName: text }))
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                        placeholderTextColor={'#999999'}
                    />
                    {/* <Text style={{flex:1,color:'#999999',fontSize:14, marginLeft:5}}>{'请输入问题或关键字'}</Text> */}
                    <View style={{ height: 22, width: 0.5, backgroundColor: '#E7E7E7' }}></View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(createAction('BWModel/updateState')({ getALLOperationTaskResult: { status: -1 } }))
                            this.refresh();
                        }}
                    >
                        <Text style={{ color: '#666666', fontSize: 14, marginHorizontal: 10 }}>{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusPage
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('重新刷新');
                    // this.statusPageOnRefresh();
                }}
                status={SentencedToEmpty(this.props
                    , ['getALLOperationTaskResult', 'status'], 200)}
            // status={200}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                        return false;
                    }}
                    onRefresh={index => {
                        this.refresh(this.list.setListData);
                    }}
                    onEndReached={index => {
                        // this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props, ['getALLOperationTaskData'], [])}
                />
            </StatusPage>
        </View>)
    }
}
