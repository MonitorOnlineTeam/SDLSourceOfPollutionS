/*
 * @Description: 关键参数核查 列表
 * @LastEditors: hxf
 * @Date: 2023-02-06 09:22:09
 * @LastEditTime: 2024-09-26 20:45:12
 * @FilePath: /SDLMainProject/app/pOperationContainers/KeyParameterVerification/KeyParameterVerificationList.js
 */
import React, { Component, PureComponent } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
// import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import MyTabBarWithCount from '../../operationContainers/taskViews/taskExecution/components/MyTabBarWithCount';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createNavigationOptions, SentencedToEmpty, NavigationActions, createAction } from '../../utils';
import { AlertDialog, FlatListWithHeaderAndFooter, SimpleLoadingComponent, StatusPage } from '../../components';
import globalcolor from '../../config/globalcolor';
import SDLTabButton from '../../components/SDLTabButton';

let _me;
@connect(({ keyParameterVerificationModel }) => ({
    listTabIndex: keyParameterVerificationModel.listTabIndex,
    OperationKeyParameterCountResult: keyParameterVerificationModel.OperationKeyParameterCountResult,
    unsubmitParams: keyParameterVerificationModel.unsubmitParams,
    submittedParams: keyParameterVerificationModel.submittedParams,
    toBeCorrectedParams: keyParameterVerificationModel.toBeCorrectedParams,
    alreadyCorrectedParams: keyParameterVerificationModel.alreadyCorrectedParams,
    underAppealParams: keyParameterVerificationModel.underAppealParams,
    deleteOperationKeyResult: keyParameterVerificationModel.deleteOperationKeyResult
}))
export default class KeyParameterVerificationList extends Component {

    static navigationOptions = ({ navigation }) => createNavigationOptions({
        title: '关键参数核查',
        // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        headerRight: (<TouchableOpacity
            onPress={() => {
                _me.props.dispatch(NavigationActions.navigate({ routeName: 'KeyParameterVerificationCompleted' }));
            }}>
            <Text style={{ color: '#fff', marginRight: 5 }}>已完成核查记录</Text>
        </TouchableOpacity>)
    });

    constructor(props) {
        super(props);
        _me = this;
    }

    componentDidMount() {
        // 待提交
        let newParams = { ...this.props.unsubmitParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            unsubmitParams: newParams,
            unsubmitResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onChange = (index) => {
        let newParams;
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
        switch (index) {
            case 0:
                newParams = { ...this.props.unsubmitParams };
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    unsubmitParams: newParams,
                    unsubmitResult: { status: -1 },
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({}));
                break;
            case 1:
                newParams = { ...this.props.submittedParams };
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    submittedParams: newParams,
                    submittedResult: { status: -1 },
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getSubmittedList')({}));
                break;
            case 2:
                newParams = { ...this.props.toBeCorrectedParams };
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    toBeCorrectedParams: newParams,
                    toBeCorrectedResult: { status: -1 },
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({}));
                break;
            case 3:
                newParams = { ...this.props.alreadyCorrectedParams };
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    alreadyCorrectedParams: newParams,
                    alreadyCorrectedResult: { status: -1 },
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getAlreadyCorrectedList')({}));
                break;
            case 4:
                newParams = { ...this.props.underAppealParams };
                newParams.index = 1;
                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                    underAppealParams: newParams,
                    underAppealResult: { status: -1 },
                }));
                this.props.dispatch(createAction('keyParameterVerificationModel/getUnderAppealList')({}));
                break;
        }
    }

    render() {
        let tabs = [];
        let couts = SentencedToEmpty(this.props.OperationKeyParameterCountResult
            , ['data', 'Datas'], {});
        if (SentencedToEmpty(couts, ['noSubmit'], 0) == 0) {
            tabs.push('待提交');
        } else {
            tabs.push({ label: '待提交', count: couts.noSubmit });
        }

        if (SentencedToEmpty(couts, ['submit'], 0) == 0) {
            tabs.push('已提交');
        } else {
            tabs.push({ label: '已提交', count: couts.submit });
        }

        if (SentencedToEmpty(couts, ['norectified'], 0) == 0) {
            tabs.push('待整改');
        } else {
            tabs.push({ label: '待整改', count: couts.norectified });
        }

        if (SentencedToEmpty(couts, ['rectified'], 0) == 0) {
            tabs.push('已整改');
        } else {
            tabs.push({ label: '已整改', count: couts.rectified });
        }

        if (SentencedToEmpty(couts, ['appeal'], 0) == 0) {
            tabs.push('申诉中');
        } else {
            tabs.push({ label: '申诉中', count: couts.appeal });
        }
        return (<StatusPage
            backRef={true}
            status={200}
            style={{ width: SCREEN_WIDTH, flex: 1 }}
        >
            <View style={[{
                flexDirection: 'row', height: 44
                , width: SCREEN_WIDTH, alignItems: 'center'
                , justifyContent: 'space-between'
                , backgroundColor: 'white', marginBottom: 5
            }]}>
                {
                    tabs.map((item, index) => {
                        let label = '';
                        if (index == 0) {
                            if (SentencedToEmpty(couts, ['noSubmit'], 0) == 0) {
                                label = '待提交';
                            } else {
                                label = `待提交(${couts.noSubmit})`;
                            }
                        }

                        if (index == 1) {
                            if (SentencedToEmpty(couts, ['submit'], 0) == 0) {
                                label = '已提交';
                            } else {
                                label = `已提交(${couts.submit})`;
                            }
                        }

                        if (index == 2) {
                            if (SentencedToEmpty(couts, ['norectified'], 0) == 0) {
                                label = '待整改';
                            } else {
                                label = `待整改(${couts.norectified})`;
                            }
                        }

                        if (index == 3) {
                            if (SentencedToEmpty(couts, ['rectified'], 0) == 0) {
                                label = '已整改';
                            } else {
                                label = `已整改(${couts.rectified})`;
                            }
                        }

                        if (index == 4) {
                            if (SentencedToEmpty(couts, ['appeal'], 0) == 0) {
                                label = '申诉中';
                            } else {
                                label = `申诉中(${couts.appeal})`;
                            }
                        }

                        return (<SDLTabButton
                            topButtonWidth={SCREEN_WIDTH / (tabs.length)}
                            selected={this.props.listTabIndex == index}
                            label={label}
                            onPress={() => {
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({ listTabIndex: index }));
                                this.onChange(index);
                            }}
                        />);
                    })
                }
            </View>
            {
                this.props.listTabIndex == 0
                    ? <KeyParameterVerificationCreateList />
                    : this.props.listTabIndex == 1
                        ? <KeyParameterVerificationAlreadySubmitList />
                        : this.props.listTabIndex == 2
                            ? <KeyParameterVerificationToBeCorrectedList />
                            : this.props.listTabIndex == 3
                                ? <KeyParameterVerificationAlreadyCorrectedList />
                                : this.props.listTabIndex == 4
                                    ? <KeyParameterVerificationUnderAppealList />
                                    : null
            }
            {/* <ScrollableTabView
                ref={ref => (this.scrollableTabView = ref)}
                onChangeTab={obj => {
                    this.onChange(obj.i);
                    // console.log('onChangeTab = ',obj);
                }}
                initialPage={0}
                style={{ flex: 1, width: SCREEN_WIDTH }}
                renderTabBar={() => <MyTabBarWithCount tabNames={tabs} />}
                tabBarUnderlineStyle={{
                    width: SCREEN_WIDTH / 5,
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
                <KeyParameterVerificationCreateList />
                <KeyParameterVerificationAlreadySubmitList />
                <KeyParameterVerificationToBeCorrectedList />
                <KeyParameterVerificationAlreadyCorrectedList />
                <KeyParameterVerificationUnderAppealList />
            </ScrollableTabView> */}
            {SentencedToEmpty(this.props, ['deleteOperationKeyResult', 'status'], 200) == -1 ? <SimpleLoadingComponent message={'正在撤销'} /> : null}
        </StatusPage>)
    }
}

// 待提交列表
@connect(({ keyParameterVerificationModel }) => ({
    unsubmitParams: keyParameterVerificationModel.unsubmitParams,
    unsubmitResult: keyParameterVerificationModel.unsubmitResult,
    unsubmitDataList: keyParameterVerificationModel.unsubmitDataList,
}))
class KeyParameterVerificationCreateList extends PureComponent {

    statusPageOnRefresh = () => {
        let newParams = { ...this.props.unsubmitParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            unsubmitParams: newParams,
            unsubmitResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = { ...this.props.unsubmitParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            unsubmitParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({
            setListData: this.list.setListData
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = { ...this.props.unsubmitParams };
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            unsubmitParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnsubmitList')({
            setListData: this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return (<View
            key={`Create${index}`}
            style={[{
                width: SCREEN_WIDTH, height: 150
                , backgroundColor: '#ffffff', paddingLeft: 20.5
            }]}
        >
            <View style={[{
                marginTop: 4.5, height: 34
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <Text style={{
                    color: '#333333'
                    , fontSize: 15, marginRight: 12, maxWidth: (SCREEN_WIDTH - 80)
                }} numberOfLines={1}>{SentencedToEmpty(item, ['pointName'], '--')}</Text>
                <View style={{
                    width: 43, height: 14
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#E3E3E34D',
                }}>
                    <Text style={{ fontSize: 10, color: '#999999' }}>{SentencedToEmpty(item, ['submitStatusName'], '--')}</Text>
                </View>
            </View>
            <View style={{ height: 22.5 }}>
                <Text numberOfLines={1} style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`企业名称：${SentencedToEmpty(item, ['entName'], '--')}`}</Text>
            </View>
            <View style={{ height: 22.5 }}>
                <Text numberOfLines={1} style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`运维人员：${SentencedToEmpty(item, ['operationUserName'], '--')}`}</Text>
            </View>
            <View style={{ height: 28 }}>
                <Text numberOfLines={1} style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`任务派发时间：${SentencedToEmpty(item, ['createTime'], '--')}`}</Text>
            </View>
            <View style={{ height: 38, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={[{ marginRight: 8 }]}
                    onPress={() => {
                        this.props.dispatch(createAction('app/updateState')({
                            selectEnterprise: {
                                EntName: SentencedToEmpty(item, ['entName'], '')
                            }
                        }));
                        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                            operationKeyParameterDetailId: item.id,
                            keyParameterVerificationEditData: {
                                DGIMN: SentencedToEmpty(item, ['DGIMN'], ''),
                                selectPointItem: {
                                    DGIMN: SentencedToEmpty(item, ['DGIMN'], ''),
                                    PointName: SentencedToEmpty(item, ['pointName'], '')
                                },
                                list: [
                                    {
                                        "Type": "",
                                        "File": "",
                                        "Remark": "",
                                    }
                                ]
                            }
                        }));
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'KeyParameterVerificationEditView',
                            params: {
                                type: 'update',
                                typeID: 1,
                                id: item.id
                            }
                        }));
                    }}
                >
                    <View style={{
                        height: 23, width: 62
                        , backgroundColor: '#4AA0FF', borderRadius: 10
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'编辑'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'KeyParameterTransfer',
                            params: {
                                type: 'update',
                                typeID: 1,
                                ...item,
                                id: item.id
                            }
                        }));
                    }}
                >
                    <View style={{
                        height: 23, width: 62
                        , backgroundColor: '#4AA0FF', borderRadius: 10
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'转发'}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{ marginLeft:20 }}
                    onPress={()=>{
                        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                            deleteRecordParams:{
                                ID:item.id,
                                typeID: 1,
                            }
                        }));
                        this.refs.doAlert.show();
                    }}
                >
                    <View style={{height:23, width:62
                    , backgroundColor:'#E3E3E3', borderRadius:10
                    , justifyContent:'center', alignItems:'center'
                    }}>
                        <Text style={{fontSize:12, color:'#666666'}}>{'撤销'}</Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        </View>);
    }
    cancelButton = () => { }
    confirm = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            deleteOperationKeyResult: { status: -1 }
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/deleteOperationKeyParameter')({}));
    }
    render() {
        let alertOptions_create = {
            headTitle: '提示',
            messText: '是否确定要删除此核查记录？',
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
        return (<View style={{ width: SCREEN_WIDTH, flex: 1, paddingTop: 9.5, }}>
            <StatusPage
                status={SentencedToEmpty(this.props, ['unsubmitResult', 'status'], 1000)}
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
                    data={SentencedToEmpty(this.props, ['unsubmitDataList'], [])}
                />
                {/* <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        // 清空数据
                        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                            keyParameterVerificationEditData:{
                                DGIMN:'',
                                list:[
                                    {
                                        "Type": "",
                                        "File": "",
                                        "Remark": "",
                                    }
                                ]
                            }
                        }));
                        
                        this.props.dispatch(NavigationActions.navigate({
                            routeName:'KeyParameterVerificationEditView',
                            params: {
                                        type: 'create'
                                    }
                        }));
                    }}
                >
                    <Image 
                        style={{
                            width:60, height:60
                        }}
                        source={require('../../images/ic_blue_float_add.png')} />
                </TouchableOpacity> */}
                <AlertDialog options={alertOptions_create} ref="doAlert" />
            </StatusPage>
        </View>)
    }
}

// 已提交列表
@connect(({ keyParameterVerificationModel }) => ({
    submittedParams: keyParameterVerificationModel.submittedParams,
    submittedResult: keyParameterVerificationModel.submittedResult,
    submittedDataList: keyParameterVerificationModel.submittedDataList
}))
class KeyParameterVerificationAlreadySubmitList extends PureComponent {

    statusPageOnRefresh = () => {
        let newParams = { ...this.props.submittedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            submittedParams: newParams,
            submittedResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getSubmittedList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = { ...this.props.submittedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            submittedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getSubmittedList')({
            setListData: this.list.setListData
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = { ...this.props.submittedParams };
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            submittedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getSubmittedList')({
            setListData: this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return (<View
            key={`AlreadySubmit${index}`}
            style={[{
                width: SCREEN_WIDTH, height: 150
                , backgroundColor: '#ffffff', paddingLeft: 20.5
            }]}
        >
            <View style={[{
                marginTop: 4.5, height: 34
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <Text style={{
                    color: '#333333'
                    , fontSize: 15, marginRight: 12, maxWidth: SCREEN_WIDTH - 80
                }} numberOfLines={1}>{SentencedToEmpty(item, ['pointName'], '--')}</Text>
                {
                    SentencedToEmpty(item, ['submitStatusName'], '--') == '核查中' ?
                        <View style={{
                            width: 43, height: 14
                            , justifyContent: 'center', alignItems: 'center'
                            , backgroundColor: '#FFC2874D',
                        }}>
                            <Text style={{ fontSize: 10, color: '#F5993F' }}>{SentencedToEmpty(item, ['submitStatusName'], '--')}</Text>
                        </View>
                        : <View style={{
                            width: 43, height: 14
                            , justifyContent: 'center', alignItems: 'center'
                            , backgroundColor: '#94C4FB4D'
                        }}>
                            <Text style={{ fontSize: 10, color: '#66ADFF' }}>{SentencedToEmpty(item, ['submitStatusName'], '--')}</Text>
                        </View>
                }
            </View>
            <View style={{ height: 22.5 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`企业名称：${SentencedToEmpty(item, ['entName'], '--')}`}</Text>
            </View>
            <View style={{ height: 23 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`运维人员：${SentencedToEmpty(item, ['operationUserName'], '--')}`}</Text>
            </View>
            <View style={{ height: 28 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`提交时间：${SentencedToEmpty(item, ['createTime'], '--')}`}</Text>
            </View>
            {
                SentencedToEmpty(item, ['submitStatusName'], '--') == '核查中'
                    ? <View style={{ height: 38, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => {
                                // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                                // this.props.dispatch(NavigationActions.navigate({
                                //     routeName:'KeyParameterVerificationProblemDetail',
                                //     params: {
                                //         requestParam:{
                                //             typeID: 3,
                                //             id:item.id
                                //         }
                                //         ,itemData:item
                                //     }
                                // }));
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'KeyParameterVerificationEditView',
                                    params: {
                                        type: 'submitted_update',
                                        typeID: 2,
                                        id: item.id,
                                        editable: false
                                    }
                                }));
                            }}
                        >
                            <View style={{
                                height: 23, width: 62
                                , backgroundColor: '#4AA0FF', borderRadius: 10
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'查看详情'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    : <View style={{ height: 38, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(NavigationActions.navigate({
                                    routeName: 'KeyParameterVerificationEditView',
                                    params: {
                                        type: 'submitted_update',
                                        typeID: 2,
                                        id: item.id,
                                        editable: true
                                    }
                                }));
                            }}
                        >
                            <View style={{
                                height: 23, width: 62
                                , backgroundColor: '#4AA0FF', borderRadius: 10
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'修改'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                                    deleteRecordParams: {
                                        ID: item.id,
                                        typeID: 2,
                                    }
                                }));
                                this.refs.doAlert.show();
                            }}
                            style={{ marginLeft: 20 }}
                        >
                            <View style={{
                                height: 23, width: 62
                                , backgroundColor: '#E3E3E3', borderRadius: 10
                                , justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ fontSize: 12, color: '#666666' }}>{'撤销'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            }
        </View>);
    }

    cancelButton = () => { }
    confirm = () => {
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            deleteOperationKeyResult: { status: -1 }
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/deleteOperationKeyParameter')({}));
    }

    render() {
        let alertOptions_submitted = {
            headTitle: '提示',
            messText: '是否确定要删除此核查记录？',
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
        return (<View style={{ width: SCREEN_WIDTH, flex: 1, paddingTop: 9.5, }}>
            <StatusPage
                status={SentencedToEmpty(this.props, ['submittedResult', 'status'], 1000)}
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
                    data={SentencedToEmpty(this.props, ['submittedDataList'], [])}
                />
                <AlertDialog options={alertOptions_submitted} ref="doAlert" />
            </StatusPage>
        </View>)
    }
}

// 待整改
@connect(({ keyParameterVerificationModel }) => ({
    toBeCorrectedParams: keyParameterVerificationModel.toBeCorrectedParams,
    toBeCorrectedResult: keyParameterVerificationModel.toBeCorrectedResult,
    toBeCorrectedDataList: keyParameterVerificationModel.toBeCorrectedDataList
}))
class KeyParameterVerificationToBeCorrectedList extends PureComponent {

    statusPageOnRefresh = () => {
        let newParams = { ...this.props.toBeCorrectedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            toBeCorrectedParams: newParams,
            toBeCorrectedResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = { ...this.props.toBeCorrectedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            toBeCorrectedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({
            setListData: this.list.setListData
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = { ...this.props.toBeCorrectedParams };
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            toBeCorrectedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getToBeCorrectedList')({
            setListData: this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return (<View
            key={`ToBeCorrected${index}`}
            style={[{
                width: SCREEN_WIDTH, height: 150
                , backgroundColor: '#ffffff', paddingLeft: 20.5
            }]}
        >
            <View style={[{
                marginTop: 4.5, height: 34
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <Text style={{
                    color: '#333333'
                    , fontSize: 15, marginRight: 12, maxWidth: SCREEN_WIDTH - 80
                }} numberOfLines={1}>{SentencedToEmpty(item, ['pointName'], '--')}</Text>
                <View style={{
                    width: 43, height: 14
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#FFC2874D',
                }}>
                    <Text style={{ fontSize: 10, color: '#F5993F' }}>{'待整改'}</Text>
                </View>
            </View>
            <View style={{ height: 22.5 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`企业名称：${SentencedToEmpty(item, ['entName'], '--')}`}</Text>
            </View>
            <View style={{ height: 23 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`运维人员：${SentencedToEmpty(item, ['operationUserName'], '--')}`}</Text>
            </View>
            <View style={{ height: 28 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`提交时间：${SentencedToEmpty(item, ['createTime'], '--')}`}</Text>
            </View>
            <View style={{ height: 38, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
                            rectifyVerificationProblemParams: {
                                id: item.id,
                                DGIMN: item.DGIMN
                            },
                            verificationProblemParams: {
                                typeID: 3,
                                id: item.id
                            }
                        }))
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'VerificationProblem',
                            params: {
                                requestParams: {
                                    type: 'do_rectify',
                                    typeID: 3,
                                    id: item.id
                                },
                                titleMessage: item
                            },
                        }));
                    }}
                >
                    <View style={{
                        height: 23, width: 62
                        , backgroundColor: '#4AA0FF', borderRadius: 10
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'整改'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);
    }
    render() {
        return (<View style={{ width: SCREEN_WIDTH, flex: 1, paddingTop: 9.5, }}>
            <StatusPage
                status={SentencedToEmpty(this.props, ['toBeCorrectedResult', 'status'], 1000)}
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
                    data={SentencedToEmpty(this.props, ['toBeCorrectedDataList'], [])}
                />
            </StatusPage>
        </View>)
    }
}

// 已整改
@connect(({ keyParameterVerificationModel }) => ({
    alreadyCorrectedParams: keyParameterVerificationModel.alreadyCorrectedParams,
    alreadyCorrectedResult: keyParameterVerificationModel.alreadyCorrectedResult,
    alreadyCorrectedDataList: keyParameterVerificationModel.alreadyCorrectedDataList
}))
class KeyParameterVerificationAlreadyCorrectedList extends PureComponent {


    statusPageOnRefresh = () => {
        let newParams = { ...this.props.alreadyCorrectedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            alreadyCorrectedParams: newParams,
            alreadyCorrectedResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getAlreadyCorrectedList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = { ...this.props.alreadyCorrectedParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            alreadyCorrectedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getAlreadyCorrectedList')({
            setListData: this.list.setListData
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = { ...this.props.alreadyCorrectedParams };
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            alreadyCorrectedParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getAlreadyCorrectedList')({
            setListData: this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return (<View
            key={`AlreadySubmit${index}`}
            style={[{
                width: SCREEN_WIDTH, height: 150
                , backgroundColor: '#ffffff', paddingLeft: 20.5
            }]}
        >
            <View style={[{
                marginTop: 4.5, height: 34
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <Text style={{
                    color: '#333333'
                    , fontSize: 15, marginRight: 12, maxWidth: SCREEN_WIDTH - 80
                }} numberOfLines={1}>{SentencedToEmpty(item, ['pointName'], '--')}</Text>
                <View style={{
                    width: 43, height: 14
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#94C4FB4D',
                }}>
                    <Text style={{ fontSize: 10, color: '#66ADFF' }}>{'已整改'}</Text>
                </View>
            </View>
            <View style={{ height: 22.5 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`企业名称：${SentencedToEmpty(item, ['entName'], '--')}`}</Text>
            </View>
            <View style={{ height: 23 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`运维人员：${SentencedToEmpty(item, ['operationUserName'], '--')}`}</Text>
            </View>
            <View style={{ height: 28 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`提交时间：${SentencedToEmpty(item, ['createTime'], '--')}`}</Text>
            </View>
            <View style={{ height: 38, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'KeyParameterVerificationProblemDetail',
                            params: {
                                requestParam: {
                                    typeID: 4,
                                    id: item.id
                                }
                                , itemData: item
                            }
                        }));
                    }}
                >
                    <View style={{
                        height: 23, width: 62
                        , backgroundColor: '#4AA0FF', borderRadius: 10
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'查看详情'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);
    }
    render() {
        return (<View style={{ width: SCREEN_WIDTH, flex: 1, paddingTop: 9.5, }}>
            <StatusPage
                status={SentencedToEmpty(this.props, ['alreadyCorrectedResult', 'status'], 1000)}
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
                    data={SentencedToEmpty(this.props, ['alreadyCorrectedDataList'], [])}
                />
            </StatusPage>
        </View>)
    }
}

// 申诉中 
@connect(({ keyParameterVerificationModel }) => ({
    underAppealParams: keyParameterVerificationModel.underAppealParams,
    underAppealResult: keyParameterVerificationModel.underAppealResult,
    underAppealDataList: keyParameterVerificationModel.underAppealDataList
}))
class KeyParameterVerificationUnderAppealList extends PureComponent {

    statusPageOnRefresh = () => {
        let newParams = { ...this.props.underAppealParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            underAppealParams: newParams,
            underAppealResult: { status: -1 },
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnderAppealList')({}));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    onRefresh = () => {
        let newParams = { ...this.props.underAppealParams };
        newParams.index = 1;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            underAppealParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnderAppealList')({
            setListData: this.list.setListData
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getOperationKeyParameterCount')({}));
    }

    nextPage = (index) => {
        let newParams = { ...this.props.underAppealParams };
        newParams.index = index;
        this.props.dispatch(createAction('keyParameterVerificationModel/updateState')({
            underAppealParams: newParams,
        }));
        this.props.dispatch(createAction('keyParameterVerificationModel/getUnderAppealList')({
            setListData: this.list.setListData
        }));
    }

    renderItem = ({ item, index }) => {
        return (<View
            key={`AlreadySubmit${index}`}
            style={[{
                width: SCREEN_WIDTH, height: 150
                , backgroundColor: '#ffffff', paddingLeft: 20.5
            }]}
        >
            <View style={[{
                marginTop: 4.5, height: 34
                , flexDirection: 'row', alignItems: 'center'
            }]}>
                <Text style={{
                    color: '#333333'
                    , fontSize: 15, marginRight: 12, maxWidth: SCREEN_WIDTH - 80
                }} numberOfLines={1}>{SentencedToEmpty(item, ['pointName'], '--')}</Text>
                <View style={{
                    width: 43, height: 14
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#98F8D34D',
                }}>
                    <Text style={{ fontSize: 10, color: '#48C594' }}>{'申诉中'}</Text>
                </View>
            </View>
            <View style={{ height: 22.5 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`企业名称：${SentencedToEmpty(item, ['entName'], '--')}`}</Text>
            </View>
            <View style={{ height: 23 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }} numberOfLines={1}>{`运维人员：${SentencedToEmpty(item, ['operationUserName'], '--')}`}</Text>
            </View>
            <View style={{ height: 28 }}>
                <Text style={{
                    color: '#666666'
                    , fontSize: 14, marginRight: 12
                }}>{`提交时间：${SentencedToEmpty(item, ['createTime'], '--')}`}</Text>
            </View>
            <View style={{ height: 38, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        // 列表类型 typeID 1、待提交 2、已提交 3、待整改 4、已整改 5、申诉中 6、已完成
                        this.props.dispatch(NavigationActions.navigate({
                            routeName: 'KeyParameterVerificationProblemDetail',
                            params: {
                                requestParam: {
                                    typeID: 5,
                                    id: item.id
                                }
                                , itemData: item
                            }
                        }));
                    }}
                >
                    <View style={{
                        height: 23, width: 62
                        , backgroundColor: '#4AA0FF', borderRadius: 10
                        , justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'查看详情'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>);
    }
    render() {
        return (<View style={{ width: SCREEN_WIDTH, flex: 1, paddingTop: 9.5, }}>
            <StatusPage
                status={SentencedToEmpty(this.props, ['underAppealResult', 'status'], 1000)}
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
                    data={SentencedToEmpty(this.props, ['underAppealDataList'], [])}
                />
            </StatusPage>
        </View>)
    }
}