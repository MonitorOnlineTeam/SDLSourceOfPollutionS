/*
 * @Description: 备件更换历史记录 成套
 * @LastEditors: hxf
 * @Date: 2024-04-28 14:01:42
 * @LastEditTime: 2024-06-06 20:16:10
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/SparePartsChange/SparePartsChangeRecords.js
 */
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../../utils';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import globalcolor from '../../../../config/globalcolor';
import { AlertDialog, FlatListWithHeaderAndFooter, StatusPage } from '../../../../components';
import { connect } from 'react-redux';

@connect(({
    CTSparePartsChangeModel
}) => ({
    SpareReplacementRecordKeyVal: CTSparePartsChangeModel.SpareReplacementRecordKeyVal,
    SpareReplacementRecordIndex: CTSparePartsChangeModel.SpareReplacementRecordIndex,
    SpareReplacementRecordPageSize: CTSparePartsChangeModel.SpareReplacementRecordPageSize,
    SpareReplacementRecordTotal: CTSparePartsChangeModel.SpareReplacementRecordTotal,
    SpareReplacementRecordList: CTSparePartsChangeModel.SpareReplacementRecordList,// 备件更换历史记录
    SpareReplacementRecordListResult: CTSparePartsChangeModel.SpareReplacementRecordListResult,// 备件更换记录请求结果
}))
export default class SparePartsChangeRecords extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            // title: SentencedToEmpty(navigation
            //     , ['state', 'params', 'data', 'PointName'],
            //     '安装照片不合格'),
            title: '备件更换历史记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            deleteID: '',
        }
    }

    componentDidMount() {
        this.props.dispatch(createAction(
            'CTSparePartsChangeModel/updateState')
            ({
                SpareReplacementRecordIndex: 1,
                // SpareReplacementRecordPageSize: 20,
                SpareReplacementRecordListResult: { status: -1 },
                SpareReplacementRecordType: 2, // 1.派单备件更换2.工作台备件更换
            }));
        this.props.dispatch(createAction('CTSparePartsChangeModel/getSpareReplacementRecordList')
            ({
                params: {
                    // pageIndex: 1, pageSize: 20,
                    // "recordType": 2, // 1.派单备件更换2.工作台备件更换
                }
            }))
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction(
            'CTSparePartsChangeModel/updateState')
            ({
                SpareReplacementRecordIndex: 1,
                SpareReplacementRecordListResult: { status: -1 }
            }));
        this.props.dispatch(createAction('CTSparePartsChangeModel/getSpareReplacementRecordList')
            ({
                params: {
                }
            }))
    }

    onRefresh = () => {
        this.props.dispatch(createAction(
            'CTSparePartsChangeModel/updateState')
            ({
                SpareReplacementRecordIndex: 1,
            }));
        this.props.dispatch(createAction('CTSparePartsChangeModel/getSpareReplacementRecordList')
            ({
                setListData: this.list.setListData,
                params: {
                }
            }))
    }

    doSearch = () => {
        this.statusPageOnRefresh();
    }

    gotoUpdate = (item) => {
        console.log('item = ', item);
        let naviParams = {
            "id": item.ID, // 主表ID
            "recordType": 2, //1.派单备件更换2.工作台备件更换
            "cList": [
                {
                    IsPoint: item.IsPoint, // 点位情况
                    "id": item.ID, // 主表ID
                    "projectId": item.ProjectId, // 项目iD
                    "entId": item.EntId, // 企业iD
                    entName: item.EntName,
                    "pointId": item.PointId, // 监测点ID
                    pointName: item.PointName,
                    "projectCode": item.ProjectCode, // 合同号
                    "projectName": item.ProjectName, // 项目名称
                    "systemModeId": item.SystemModeId, // 系统型号ID
                    systemModel: item.SystemModelName, // 系统型号
                    "cisPartId": item.CisPartId, // cis申请单ID
                    "replacementNum": item.ReplacementNum, // 更换数量
                    "failureCause": item.FailureCause, // 故障原因
                    failureCauseName: item.FailureCauseName,
                    "replacementUser": item.ReplacementUser, // 更换人
                    "replacementTime": item.ReplacementTime, // 更换日期

                    ApplicationUser: item.ApplicationUser, // 申请人
                    ApplicationDate: item.ApplicationDate, // 申请时间
                    U8Code: item.U8Code, // 物料编码
                    PartsName: item.PartsName, // 部件名称 
                    ModelType: item.ModelType, // 规格型号 
                    CISreplacementNum: item.CisChangeCount, // 规格型号 
                    // cisPartId: item.cisPartId, // cis申请单ID 
                }
            ]
        }
        this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
            upDateEquipmentInstalled: item.IsPoint ? 1 : 2
        }));
        this.props.dispatch(NavigationActions.navigate({
            routeName: 'SparePartsChangeUpdate',
            params: {
                naviParams: naviParams
            }
        }))
    }

    renderItem = ({ item, index }) => {
        return (<View
            style={[{
                width: SCREEN_WIDTH, height: 120,
                paddingHorizontal: 15,
                justifyContent: 'space-around',
                backgroundColor: '#fff',
            }]}
        >
            <TouchableOpacity
                onPress={() => {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'SparePartsChangeDetail',
                            params: {
                                data: item
                            }
                        })
                    )
                }}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 30,
                        height: 80, justifyContent: 'space-around',
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 30,
                            flexDirection: 'row',
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1 }}>
                            {`项目编号：${SentencedToEmpty(item, ['ProjectCode'], '')}`}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1, marginLeft: 8 }}>
                            {`企业名称：${SentencedToEmpty(item, ['EntName'], '')}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 30,
                            flexDirection: 'row',
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1 }}>
                            {`点位名称：${SentencedToEmpty(item, ['PointName'], '')}`}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1, marginLeft: 8 }}>
                            {`物料编码：${SentencedToEmpty(item, ['U8Code'], '')}`}
                        </Text>
                    </View>
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 30,
                            flexDirection: 'row',
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1 }}>
                            {`部件名称：${SentencedToEmpty(item, ['PartsName'], '-')}`}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 13, color: '#333333', flex: 1, marginLeft: 8 }}>
                            {`更换数量：${SentencedToEmpty(item, ['ReplacementNum'], '-')}`}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={[{ width: SCREEN_WIDTH - 30, height: 1, backgroundColor: '#E5E5E5', marginVertical: 5 }]} />
            <View
                style={[{
                    width: SCREEN_WIDTH - 30,
                    flexDirection: 'row',
                }]}
            >
                <Text style={{ fontSize: 10, color: '#333333', width: 90 }}>{
                    `更换人：${SentencedToEmpty(item, ['ReplacementUser'], '--')}`
                }</Text>
                <Text style={{ fontSize: 10, color: '#333333', width: 110 }}>{
                    `更换时间：${SentencedToEmpty(item, ['ReplacementTime'], '----')}`
                }</Text>
                {true || (typeof item.IsEditDelete == 'boolean'
                    && item.IsEditDelete) ? < View
                        style={[{
                            // width: SCREEN_WIDTH - 30,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }]}
                    >
                    <TouchableOpacity
                        onPress={() => {
                            this.gotoUpdate(item);
                        }}
                        style={[{ marginLeft: 8 }]}
                    >
                        <View
                            style={[{
                                width: 60,
                                height: 25,
                                borderRadius: 15,
                                backgroundColor: globalcolor.blue,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }]}
                        >
                            <Text style={[{ fontSize: 11, color: 'white' }]}>{'修改'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            const _this = this;
                            this.setState({
                                deleteID: item.ID,
                            }, () => {
                                _this.refs.doAlert.show();
                            });
                        }}
                        style={[{ marginLeft: 8 }]}
                    >
                        <View
                            style={[{
                                width: 60,
                                height: 25,
                                borderRadius: 15,
                                backgroundColor: globalcolor.blue,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }]}
                        >
                            <Text style={[{ fontSize: 11, color: 'white' }]}>{'删除'}</Text>
                        </View>
                    </TouchableOpacity>
                </View> : null}
            </View>
        </View >)
    }

    getPageStatus = () => {
        return SentencedToEmpty(this.props
            , ['SpareReplacementRecordListResult', 'status'], 1000);
    }

    cancelButton = () => { }
    confirm = () => {
        if (SentencedToEmpty(this.state, ['deleteID'], '') != '') {
            ShowLoadingToast('删除中...');
            this.props.dispatch(createAction('CTSparePartsChangeModel/deleteSpareReplacementRecord')({
                params: {
                    RecordType: 2, //1服务属性的单子 2 工作台的单子
                    ID: this.state.deleteID // 如果是工作台单子传ID
                },
                successCallback: (data) => {
                    this.statusPageOnRefresh();
                },
                failCallback: (data) => {

                }
            }));
        } else {
            ShowToast('信息错误，删除失败');
        }
    }

    render() {
        var options = {
            headTitle: '提示',
            messText: '确认删除这条备件更换记录吗？',
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
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1,
                }]}
            >
                {/* <View
                    style={{
                        height: 40,
                        backgroundColor: globalcolor.headerBackgroundColor,
                        width: SCREEN_WIDTH,
                        paddingLeft: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextInput
                        onFocus={() => {
                            // this.props.dispatch(
                            //     createAction('app/updateState')({
                            //         enterpriseSearchData: { status: -1 }
                            //     })
                            // );
                        }}
                        underlineColorAndroid="transparent"
                        placeholder={SentencedToEmpty(this.props, ['searchPlaceholder'], '项目编号、企业名称、物料编码、部件名称')}
                        style={{
                            textAlign: 'center',
                            width: SCREEN_WIDTH - 40,
                            borderColor: '#cccccc',
                            borderWidth: 0.5,
                            borderRadius: 15,
                            height: 30,
                            backgroundColor: '#fff',
                            paddingVertical: 0
                        }}
                        onChangeText={text => {
                            //动态更新组件内state 记录输入内容
                            // this.setState({ searchValue: text });
                            // this.search(text);
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                    />
                    {Platform.OS == 'android' ? (
                        <TouchableOpacity
                            style={{ left: -30 }}
                            onPress={() => {
                                // this.refs.keyWordInput.blur();
                                // this.setState({ searchValue: '' });
                            }}
                        >
                            <Image source={require('../../../../images/clear.png')} style={{ width: 15, height: 15, borderWidth: 1 }} />
                        </TouchableOpacity>
                    ) : null}
                </View> */}
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 49
                        , justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: 'white'
                    }]}
                >
                    <View
                        style={[{
                            height: 30, width: SCREEN_WIDTH - 40
                            , borderRadius: 15, backgroundColor: '#F2F2F2'
                            , flexDirection: 'row', alignItems: 'center'
                        }]}
                    >
                        <Image
                            style={[{
                                height: 13, width: 13
                                , tintColor: '#999999'
                                , marginLeft: 15
                            }]}
                            source={require('../../../../images/ic_search_help_center.png')}
                        />
                        <TextInput
                            style={[{
                                flex: 1
                                , paddingVertical: 0
                                , marginHorizontal: 5
                            }]}
                            placeholder={SentencedToEmpty(this.props
                                , ['navigation', 'state', 'params', 'searchPlaceHolder']
                                , '企业名称、合同编号、立项号')}
                            onChangeText={(text) => {
                                this.props.dispatch(createAction('CTSparePartsChangeModel/updateState')({
                                    SpareReplacementRecordKeyVal: text
                                }));
                                setTimeout(() => {
                                    if (text == '') {
                                        this.doSearch();
                                    }
                                }, 200)
                            }}
                        >{SentencedToEmpty(this.props, ['SpareReplacementRecordKeyVal'], '')}</TextInput>
                        <TouchableOpacity
                            onPress={() => {
                                // 搜索
                                this.doSearch();
                            }}
                        >
                            <View
                                style={[{
                                    width: 49, height: 24
                                    , borderRadius: 12, backgroundColor: '#058BFA'
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{ fontSize: 14, color: '#fefefe' }]}>{'搜索'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <StatusPage
                    status={this.getPageStatus()}
                    errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                    errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.statusPageOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.statusPageOnRefresh();
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        style={[{ backgroundColor: '#f2f2f2', marginTop: 8 }]}
                        ref={ref => (this.list = ref)}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                        pageSize={this.props.SpareReplacementRecordPageSize}
                        hasMore={() => {
                            return true;
                            // return this.props.SpareReplacementRecordList.length < this.props.SpareReplacementRecordTotal;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.props.dispatch(createAction(
                                'CTSparePartsChangeModel/updateState')
                                ({
                                    SpareReplacementRecordIndex: index,
                                }));
                            this.props.dispatch(createAction('CTSparePartsChangeModel/getSpareReplacementRecordList')
                                ({
                                    params: {}
                                }))
                            // this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index }));
                            // this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
                        }}
                        renderItem={this.renderItem}
                        data={SentencedToEmpty(this.props, ['SpareReplacementRecordList'], [])}
                    />
                </StatusPage>
                <AlertDialog options={options} ref="doAlert" />
            </View>
        )
    }
}