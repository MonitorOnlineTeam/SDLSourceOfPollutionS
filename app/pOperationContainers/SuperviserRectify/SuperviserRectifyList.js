/*
 * @Description: 设施核查 列表
 * @LastEditors: hxf
 * @Date: 2023-02-06 09:22:09
 * @LastEditTime: 2023-04-19 10:37:59
 * @FilePath: /SDLMainProject34/app/pOperationContainers/SuperviserRectify/SuperviserRectifyList.js
 */
import React, { Component, PureComponent } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import MyTabBarWithCount from '../../operationContainers/taskViews/taskExecution/components/MyTabBarWithCount';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty, NavigationActions, createAction } from '../../utils';
import { AlertDialog, FlatListWithHeaderAndFooter, SimpleLoadingComponent, StatusPage } from '../../components';
import globalcolor from '../../config/globalcolor';

let _me;
@connect(({ supervision })=>({
    OperationKeyParameterCountResult:supervision.OperationKeyParameterCountResult,
    unsubmitParams:supervision.unsubmitParams,
    submittedParams:supervision.submittedParams,
    toBeCorrectedParams:supervision.toBeCorrectedParams,
    alreadyCorrectedParams:supervision.alreadyCorrectedParams,
    underAppealParams:supervision.underAppealParams,
    deleteOperationKeyResult:supervision.deleteOperationKeyResult,
    rectificationNumResult:supervision.rectificationNumResult,// 设施核查整改 计数
}))
export default class SuperviserRectifyList extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '设施核查',
        // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        headerRight: (<TouchableOpacity
            onPress={() => {
                _me.props.dispatch(createAction('supervision/updateState')({
                    currentList:3,
                    Status:3, // Status 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                // _me.props.dispatch(NavigationActions.navigate({ routeName: 'KeyParameterVerificationCompleted' }));
                _me.props.dispatch(NavigationActions.navigate({
                    routeName: 'CorrectedSupervisionRecords',
                }));
            }}>
            <Text style = {{color:'#fff',marginRight:5}}>已完成核查记录</Text>
        </TouchableOpacity>)
    });

    constructor(props){
        super(props);
        _me = this;
    }

    componentDidMount() {
        // 待提交
        // let newParams = {...this.props.unsubmitParams};
        // newParams.index = 1;
        // this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
        //     unsubmitParams:newParams,
        //     unsubmitResult:{status:-1},
        // }));
        // // this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({}));
        // this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({}));
        // this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
        /**
         * Rectification 0 未完成整改 1 已完成整改
         * Status 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
         */
        this.props.dispatch(createAction('supervision/updateState')({
            toBeCorrectedParams: {
                Rectification:0,
                Status:2,
                inspectorRectificationListIndex: 1,
                "pageSize": 20
            },
            Status:2,
            toBeCorrectedResult: { status: -1 },
            toBeCorrectedDataList: [],
        }));
        this.props.dispatch(createAction('supervision/getToBeCorrectedList')({}));
        this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
    }

    onChange = (index) => {
        let newParams;
        // 计数接口
        this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
        switch(index) {
            case 0:
                // 未整改2
                newParams = {...this.props.toBeCorrectedParams};
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList:0,
                    toBeCorrectedParams:newParams,
                    toBeCorrectedResult:{status:-1},
                    Status: 2, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getToBeCorrectedList')({}));
                break;
            case 1:
                // 已整改1
                newParams = {...this.props.alreadyCorrectedParams};
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList:1,
                    alreadyCorrectedParams:newParams,
                    alreadyCorrectedResult:{status:-1},
                    Status: 1, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getAlreadyCorrectedList')({}));
                break;
            case 2:
                newParams = {...this.props.underAppealParams};
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList:2,
                    underAppealParams:newParams,
                    underAppealResult:{status:-1},
                    Status: 5, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getUnderAppealList')({}));
                break;
        }
    }

    render() {
        let tabs = [];
        let couts = SentencedToEmpty(this.props.rectificationNumResult
            ,['data','Datas'],{});
        if (SentencedToEmpty(couts,['DaiZG'],0)==0) {
            tabs.push('待整改');
        } else {
            tabs.push({label:'待整改',count:couts.DaiZG});
        }

        if (SentencedToEmpty(couts,['YiZG'],0)==0) {
            tabs.push('已整改');
        } else {
            tabs.push({label:'已整改',count:couts.YiZG});
        }

        if (SentencedToEmpty(couts,['ShenSZ'],0)==0) {
            tabs.push('申诉中');
        } else {
            tabs.push({label:'申诉中',count:couts.ShenSZ});
        }
        return (<View style={{width:SCREEN_WIDTH,flex:1}}>
            <ScrollableTabView
                ref={ref => (this.scrollableTabView = ref)}
                onChangeTab={obj => {
                    this.onChange(obj.i);
                    // console.log('onChangeTab = ',obj);
                }}
                initialPage={0}
                style={{ flex: 1, width: SCREEN_WIDTH }}
                renderTabBar={() => <MyTabBarWithCount tabNames={tabs} />}
                tabBarUnderlineStyle={{
                    width: SCREEN_WIDTH / 3,
                    height: 2,
                    backgroundColor: '#4aa1fd',
                    marginBottom: -1
                }}
                tabBarPosition="top"
                scrollWithoutAnimation={false}
                tabBarUnderlineColor="#4aa1fd"
                tabBarBackgroundColor="#FFFFFF"
                tabBarActiveTextColor="#4aa1fd"
                tabBarInactiveTextColor="#000033"
                tabBarTextStyle={{ fontSize: 15, backgroundColor: 'red' }}
            >
                <KeyParameterVerificationToBeCorrectedList />
                <KeyParameterVerificationAlreadyCorrectedList />
                <KeyParameterVerificationUnderAppealList />
            </ScrollableTabView>
            {SentencedToEmpty(this.props,['deleteOperationKeyResult','status'],200) == -1?<SimpleLoadingComponent message={'正在撤销'} />:null}
        </View>)
    }
}

// 待整改
@connect(({ supervision })=>({
    toBeCorrectedParams:supervision.toBeCorrectedParams,
    toBeCorrectedResult:supervision.toBeCorrectedResult,
    toBeCorrectedDataList:supervision.toBeCorrectedDataList
}))
class KeyParameterVerificationToBeCorrectedList extends PureComponent {
    
    statusPageOnRefresh = () => {
        let newParams = {...this.props.toBeCorrectedParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            toBeCorrectedParams:newParams,
            toBeCorrectedResult:{status:-1},
        }));
        this.props.dispatch(createAction('supervision/getToBeCorrectedList')({}));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = {...this.props.toBeCorrectedParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            toBeCorrectedParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getToBeCorrectedList')({
            setListData:this.list.setListData
        }));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = {...this.props.toBeCorrectedParams};
        newParams.index = index;
        this.props.dispatch(createAction('supervision/updateState')({
            toBeCorrectedParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getToBeCorrectedList')({
            setListData:this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return(<TouchableOpacity
            onPress={()=>{
                this.props.dispatch(createAction('supervision/updateState')({
                    rectificationID: item.ID,
                    Status:2,
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'SupervisionDetail',
                }));
            }}
        >
            <View
                key={`ToBeCorrected${index}`}
                style={[{width:SCREEN_WIDTH, height:89
                    , backgroundColor:'#ffffff', paddingLeft:20.5
                }]}
            >
                <View style={[{
                    marginTop:4.5, height: 34
                    , flexDirection:'row', alignItems:'center'
                }]}>
                    <Text style={{color:'#333333'
                        , fontSize:15, marginRight:12
                    }}>{SentencedToEmpty(item,['PointName'],'--')}</Text>
                    <View style={{width:43, height:14
                        , justifyContent:'center', alignItems:'center'
                        , backgroundColor:'#FFC2874D', 
                    }}>
                        <Text style={{fontSize:10,color:'#F5993F'}}>{'待整改'}</Text>
                    </View>
                </View>
                <View style={{height:22.5}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`企业名称：${SentencedToEmpty(item,['EntName'],'--')}`}</Text>
                </View>
                {/* 
                彭宇说不展示督查人，需要多查一个表，没必要
                <View style={{height:23}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`督查人：${SentencedToEmpty(item,['operationUserName'],'--')}`}</Text>
                </View> */}
                <View style={{height:28}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`督查日期：${SentencedToEmpty(item,['Time'],'--')}`}</Text>
                </View>
            </View>
        </TouchableOpacity>);
    }
    render() {
        return (<View style={{ width:SCREEN_WIDTH, flex:1, paddingTop:9.5,}}>
            <StatusPage
                status={SentencedToEmpty(this.props,['toBeCorrectedResult','status'],1000)}
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
                        this.onRefresh(1);
                    }}
                    onEndReached={index => {
                        this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props,['toBeCorrectedDataList'],[])}
                />
            </StatusPage>
        </View>)
    }
}

// 已整改
@connect(({ supervision })=>({
    alreadyCorrectedParams:supervision.alreadyCorrectedParams,
    alreadyCorrectedResult:supervision.alreadyCorrectedResult,
    alreadyCorrectedDataList:supervision.alreadyCorrectedDataList
}))
class KeyParameterVerificationAlreadyCorrectedList extends PureComponent {
    

    statusPageOnRefresh = () => {
        let newParams = {...this.props.alreadyCorrectedParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            alreadyCorrectedParams:newParams,
            alreadyCorrectedResult:{status:-1},
        }));
        this.props.dispatch(createAction('supervision/getAlreadyCorrectedList')({}));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = {...this.props.alreadyCorrectedParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            alreadyCorrectedParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getAlreadyCorrectedList')({
            setListData:this.list.setListData
        }));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = {...this.props.alreadyCorrectedParams};
        newParams.index = index;
        this.props.dispatch(createAction('supervision/updateState')({
            alreadyCorrectedParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getAlreadyCorrectedList')({
            setListData:this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return(<TouchableOpacity
            onPress={()=>{
                this.props.dispatch(createAction('supervision/updateState')({
                    rectificationID: item.ID,
                    Status:1,
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'SupervisionDetail',
                }));
            }}
        >
            <View
                key={`AlreadySubmit${index}`}
                style={[{width:SCREEN_WIDTH, height:89
                    , backgroundColor:'#ffffff', paddingLeft:20.5
                }]}
            >
                <View style={[{
                    marginTop:4.5, height: 34
                    , flexDirection:'row', alignItems:'center'
                }]}>
                    <Text style={{color:'#333333'
                        , fontSize:15, marginRight:12
                    }}>{SentencedToEmpty(item,['PointName'],'--')}</Text>
                    <View style={{width:43, height:14
                        , justifyContent:'center', alignItems:'center'
                        , backgroundColor:'#94C4FB4D', 
                    }}>
                        <Text style={{fontSize:10,color:'#66ADFF'}}>{'已整改'}</Text>
                    </View>
                </View>
                <View style={{height:22.5}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`企业名称：${SentencedToEmpty(item,['EntName'],'--')}`}</Text>
                </View>
                {/* <View style={{height:23}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`运维人员：${SentencedToEmpty(item,['operationUserName'],'--')}`}</Text>
                </View> */}
                <View style={{height:28}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`督查日期：${SentencedToEmpty(item,['Time'],'--')}`}</Text>
                </View>
                {/* <View style={{height:38, flexDirection:'row' }}>
                    <TouchableOpacity
                        onPress={()=>{
                            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'KeyParameterVerificationProblemDetail',
                                params: {
                                    requestParam:{
                                        typeID: 4,
                                        id:item.id
                                    }
                                    ,itemData:item
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
                </View> */}
            </View>
        </TouchableOpacity>);
    }
    render() {
        return (<View style={{ width:SCREEN_WIDTH, flex:1, paddingTop:9.5,}}>
            <StatusPage
                status={SentencedToEmpty(this.props,['alreadyCorrectedResult','status'],1000)}
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
                        this.onRefresh(1);
                    }}
                    onEndReached={index => {
                        this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props,['alreadyCorrectedDataList'],[])}
                />
            </StatusPage>
        </View>)
    }
}

// 申诉中 
@connect(({ supervision })=>({
    underAppealParams:supervision.underAppealParams,
    underAppealResult:supervision.underAppealResult,
    underAppealDataList:supervision.underAppealDataList
}))
class KeyParameterVerificationUnderAppealList extends PureComponent {
    
    statusPageOnRefresh = () => {
        let newParams = {...this.props.underAppealParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            underAppealParams:newParams,
            underAppealResult:{status:-1},
        }));
        this.props.dispatch(createAction('supervision/getUnderAppealList')({}));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = {...this.props.underAppealParams};
        newParams.index = 1;
        this.props.dispatch(createAction('supervision/updateState')({
            underAppealParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getUnderAppealList')({
            setListData:this.list.setListData
        }));
        this.props.dispatch(createAction('supervision/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = {...this.props.underAppealParams};
        newParams.index = index;
        this.props.dispatch(createAction('supervision/updateState')({
            underAppealParams:newParams,
        }));
        this.props.dispatch(createAction('supervision/getUnderAppealList')({
            setListData:this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return(<TouchableOpacity
            onPress={()=>{
                this.props.dispatch(createAction('supervision/updateState')({
                    rectificationID: item.ID,
                    Status:5,
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'SupervisionDetail',
                }));
            }}
        >
            <View
                key={`AlreadySubmit${index}`}
                style={[{width:SCREEN_WIDTH, height:90
                    , backgroundColor:'#ffffff', paddingLeft:20.5
                }]}
            >
                <View style={[{
                    marginTop:4.5, height: 34
                    , flexDirection:'row', alignItems:'center'
                }]}>
                    <Text style={{color:'#333333'
                        , fontSize:15, marginRight:12
                    }}>{SentencedToEmpty(item,['PointName'],'--')}</Text>
                    <View style={{width:43, height:14
                        , justifyContent:'center', alignItems:'center'
                        , backgroundColor:'#98F8D34D', 
                    }}>
                        <Text style={{fontSize:10,color:'#48C594'}}>{'申诉中'}</Text>
                    </View>
                </View>
                <View style={{height:22.5}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`企业名称：${SentencedToEmpty(item,['EntName'],'--')}`}</Text>
                </View>
                {/* <View style={{height:23}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`运维人员：${SentencedToEmpty(item,['operationUserName'],'--')}`}</Text>
                </View> */}
                <View style={{height:28}}>
                    <Text style={{color:'#666666'
                        , fontSize:14, marginRight:12
                    }}>{`督查日期：${SentencedToEmpty(item,['Time'],'--')}`}</Text>
                </View>
                {/* <View style={{height:38, flexDirection:'row' }}>
                    <TouchableOpacity
                        onPress={()=>{
                            // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                            this.props.dispatch(NavigationActions.navigate({
                                routeName:'KeyParameterVerificationProblemDetail',
                                params: {
                                    requestParam:{
                                        typeID: 5,
                                        id:item.id
                                    }
                                    ,itemData:item
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
                </View> */}
            </View>
        </TouchableOpacity>);
    }
    render() {
        return (<View style={{ width:SCREEN_WIDTH, flex:1, paddingTop:9.5,}}>
            <StatusPage
                status={SentencedToEmpty(this.props,['underAppealResult','status'],1000)}
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
                        this.onRefresh(1);
                    }}
                    onEndReached={index => {
                        this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props,['underAppealDataList'],[])}
                />
            </StatusPage>
        </View>)
    }
}