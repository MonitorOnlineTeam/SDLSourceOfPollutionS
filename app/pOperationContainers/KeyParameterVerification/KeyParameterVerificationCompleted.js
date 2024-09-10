/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2023-02-06 15:06:58
 * @LastEditTime: 2023-08-17 10:52:05
 * @FilePath: /SDLMainProject36/app/pOperationContainers/KeyParameterVerification/KeyParameterVerificationCompleted.js
 */
import moment from 'moment';
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, PickerRangeDayTouchable, SimplePickerRangeDay, StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../utils';

/**
 * // 已完成 6
        completedRecordsParams:{
            // index:1,
            // pageSize:20,
            typeID:6,
        },
        completedRecordsResult:{status:-1},
        completedRecordsDataList:[],
 */
@connect(({ keyParameterVerificationModel })=>({
    completedRecordsParams:keyParameterVerificationModel.completedRecordsParams,
    completedRecordsResult:keyParameterVerificationModel.completedRecordsResult,
    completedRecordsDataList:keyParameterVerificationModel.completedRecordsDataList
}))
export default class KeyParameterVerificationCompleted extends Component {
    
    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '已完成核查记录 ',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor (props) {
        super(props);
        // let initStart = moment().format('YYYY/MM/01')
        // , initEnd = moment().add(1,'months').subtract(1,'days')
        //     .format('YYYY/MM/DD');
        let initStart = moment(SentencedToEmpty(props,['completedRecordsParams','beginTime']
                ,moment().subtract(1,'months').format('YYYY/MM/DD'))).format('YYYY/MM/DD'),
            initEnd = moment(SentencedToEmpty(props,['completedRecordsParams','endTime']
                ,moment().format('YYYY/MM/DD'))).format('YYYY/MM/DD');
        this.state = {
            start:initStart
            , end:initEnd
            , showTime:`${initStart}-${initEnd}`
        };
    }

    componentDidMount() {
        let newParams = {...this.props.completedRecordsParams}
        newParams.beginTime = moment().subtract(1,'months').format('YYYY-MM-DD 00:00:00')
        newParams.endTime = moment().format('YYYY-MM-DD 23:59:59')
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({}));
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = moment().date(1)
            .format('YYYY/MM/DD');
        endTime = moment().add(1,'months').date(1).subtract(1,'days')
            .format('YYYY/MM/DD');
        console.log('beginTime = ',beginTime);
        console.log('endTime = ',endTime);
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start).format('YYYY/MM/DD');
                let endMoment = moment(end).format('YYYY/MM/DD');
                this.setState({ start, end, showTime: `${startMoment}-${endMoment}` });
                let newParams = {...this.props.completedRecordsParams}
                newParams.beginTime = moment(start).format('YYYY-MM-DD 00:00:00')
                newParams.endTime = moment(end).format('YYYY-MM-DD 23:59:59')
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    completedRecordsParams:newParams,
                    completedRecordsResult:{status:-1}
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({}));
            }
        };
    };

    statusPageOnRefresh = () => {
        let newParams = {...this.props.completedRecordsParams};
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams,
            completedRecordsResult:{status:-1}
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({}));
    }

    onRefresh = (index) => {
        let newParams = {...this.props.completedRecordsParams};
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({
            setListData:this.list.setListData
        }));
    }

    nextPage = (index) => {
        let newParams = {...this.props.completedRecordsParams};
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({
            setListData:this.list.setListData}));
    }

    next = () => {
        let newParams = {...this.props.completedRecordsParams}
        let beginTime = moment(SentencedToEmpty(this.props,['completedRecordsParams','beginTime']
                ,moment().subtract(1,'months').format('YYYY/MM/DD'))).add(1,'months'),
            endTime = moment(SentencedToEmpty(this.props,['completedRecordsParams','endTime']
                ,moment().format('YYYY/MM/DD'))).add(1,'months');
        this.setState({ start:beginTime.format('YYYY/MM/DD'), end:endTime.format('YYYY/MM/DD'), showTime: `${beginTime.format('YYYY/MM/DD')}-${endTime.format('YYYY/MM/DD')}` });
        newParams.beginTime = beginTime.format('YYYY-MM-DD 00:00:00')
        newParams.endTime = endTime.format('YYYY-MM-DD 23:59:59')
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams,
            completedRecordsResult:{status:-1}
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({}));
    }

    previous = () => {
        let newParams = {...this.props.completedRecordsParams}
        let beginTime = moment(SentencedToEmpty(this.props,['completedRecordsParams','beginTime']
                ,moment().subtract(1,'months').format('YYYY/MM/DD'))).subtract(1,'months'),
            endTime = moment(SentencedToEmpty(this.props,['completedRecordsParams','endTime']
                ,moment().format('YYYY/MM/DD'))).subtract(1,'months');
        this.setState({ start:beginTime.format('YYYY/MM/DD'), end:endTime.format('YYYY/MM/DD'), showTime: `${beginTime.format('YYYY/MM/DD')}-${endTime.format('YYYY/MM/DD')}` });
        newParams.beginTime = beginTime.format('YYYY-MM-DD 00:00:00')
        newParams.endTime = endTime.format('YYYY-MM-DD 23:59:59')
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            completedRecordsParams:newParams,
            completedRecordsResult:{status:-1}
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getKeyParameterVerificationCompletedList')({}));
    }

    renderItem = ({ item, index }) => {
        return(<View
            key={`AlreadySubmit${index}`}
            style={[{width:SCREEN_WIDTH, height:150
                , backgroundColor:'#ffffff', paddingLeft:20.5
            }]}
        >
            <View style={[{
                marginTop:4.5, height: 34
                , flexDirection:'row', alignItems:'center'
            }]}>
                <Text style={{color:'#333333'
                    , fontSize:15, marginRight:12
                }}>{SentencedToEmpty(item,['pointName'],'--')}</Text>
                <View style={{width:43, height:14
                    , justifyContent:'center', alignItems:'center'
                    , backgroundColor:'#B3B5FF4D', 
                }}>
                    <Text style={{fontSize:10,color:'#777AFB'}}>{'已完成'}</Text>
                </View>
            </View>
            <View style={{height:22.5}}>
                <Text style={{color:'#666666'
                    , fontSize:14, marginRight:12
                }}>{`企业名称：${SentencedToEmpty(item,['entName'],'--')}`}</Text>
            </View>
            <View style={{height:23}}>
                <Text style={{color:'#666666'
                    , fontSize:14, marginRight:12
                }}>{`运维人员：${SentencedToEmpty(item,['operationUserName'],'--')}`}</Text>
            </View>
            <View style={{height:28}}>
                <Text style={{color:'#666666'
                    , fontSize:14, marginRight:12
                }}>{`提交时间：${SentencedToEmpty(item,['createTime'],'--')}`}</Text>
            </View>
            <View style={{height:38, flexDirection:'row' }}>
                <TouchableOpacity
                    onPress={()=>{
                        // this.props.dispatch(NavigationActions.navigate({
                        //     routeName:'KeyParameterVerificationProblemDetail',
                        //     params: {
                        //         requestParam:{
                        //             typeID: 6,
                        //             id:item.id
                        //         }
                        //         ,itemData:item
                        //     }
                        // }));
                        this.props.dispatch(NavigationActions.navigate({
                            routeName:'KeyParameterVerificationEditView',
                            params: {
                                        type: 'show_completed_records',
                                        typeID: 6,
                                        id:item.id
                                    }
                        }));
                    }}
                >
                    <View style={{height:23, width:62
                    , backgroundColor:'#4AA0FF', borderRadius:10
                    , justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:12, color:'#FEFEFF'}}>{'查看详情'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);
    }
    
    render() {
        return (
            <View style={{width:SCREEN_WIDTH, flex:1}}>
                <View style={{width:SCREEN_WIDTH
                    , height:45, backgroundColor:'#FFFFFF'
                    , justifyContent:'center', alignItems:'center'
                    , marginBottom:8.5
                }}>
                    {/* <SimplePickerRangeDay 
                        style={[{ backgroundColor: '#fff', justifyContent: 'center' }]} 
                        ref={ref => (this.simplePickerRangeDay = ref)} 
                        option={this.getRangeDaySelectOption()} /> */}
                    <View style={{flexDirection:'row'
                        ,alignItems:'center'
                    }}>
                        <TouchableOpacity
                            style={{ height:40,width:40,alignItems:'flex-end', justifyContent:'center'}}
                            onPress={()=>{
                                this.previous()
                            }}
                        >
                            <Image style={{width:10,height:10}} source={require('../../images/calenderLeft.png')} />
                        </TouchableOpacity>
                        <PickerRangeDayTouchable 
                            ref={ref => (this._touchable = ref)}
                            option={this.getRangeDaySelectOption()}
                            style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45, paddingLeft: 12, paddingRight: 12 }
                            , {}]}
                        >
                            <Text style={{ fontSize: 14, color: '#666' }}>{this.state.showTime}</Text>
                        </PickerRangeDayTouchable>
                        <TouchableOpacity
                            style={{ height:40,width:40, alignItems:'flex-start',justifyContent:'center'}}
                            onPress={()=>{
                                this.next();
                            }}
                        >
                            <Image style={{width:10,height:10}} source={require('../../images/calendarRight.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <StatusPage
                    status={SentencedToEmpty(this.props,['completedRecordsResult','status'],1000)}
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
                            return false;
                            // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.nextPage(index);
                        }}
                        renderItem={this.renderItem}
                        data={SentencedToEmpty(this.props,['completedRecordsDataList'],[])}
                    />
                </StatusPage>
            </View>
        )
    }
}
