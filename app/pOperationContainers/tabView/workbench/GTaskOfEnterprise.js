/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-08-25 09:44:43
 * @LastEditTime: 2024-10-25 16:43:33
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/workbench/GTaskOfEnterprise.js
 */
import React, { Component } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage, FlatListWithHeaderAndFooter, SDLText } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils';

@connect(({ taskModel }) => ({
    UnhandleTaskTypeListResult: taskModel.UnhandleTaskTypeListResult
}))
export default class GTaskOfEnterprise extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '待办任务',
            headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
        });

    componentDidMount() {
        // 获取当前路由信息
        // console.log('componentDidMount props = ', this.props);
        this.props.dispatch(createAction('taskModel/updateState')({ UnhandleTaskTypeListResult: { status: -1 } }))
        this.props.dispatch(createAction('taskModel/getUnhandleTaskTypeList')({}))
        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'TaskRecord' }));
                    }}
                >
                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'工单记录'}</SDLText>
                </TouchableOpacity>
            )
        });
    }

    renderItem = ({ item, index }) => {
        return (<View key={index} style={{
            width: SCREEN_WIDTH
            , minHeight: 45, paddingHorizontal: 10, paddingTop: 10
        }}>
            <View style={{
                minHeight: 45, width: SCREEN_WIDTH - 20
                , backgroundColor: 'white', paddingHorizontal: 10
            }}>
                <View style={{
                    marginTop: 15, width: SCREEN_WIDTH - 40
                    , flexDirection: 'row', alignItems: 'center'
                }}>
                    <Image style={{ height: 16, width: 16 }} source={require('../../../images/ic_ent_circle.png')} />
                    <Text style={{ marginLeft: 5, fontSize: 14, color: '#333333' }}>{SentencedToEmpty(item, ['parentName'], '--')}</Text>
                    <Text style={{ marginLeft: 4, fontSize: 12, color: '#4AA0FF' }}>{`(${SentencedToEmpty(item, ['count'], '0')})`}</Text>
                </View>
                <View style={{
                    width: SCREEN_WIDTH - 40, minHeight: 37
                    , flexDirection: 'row', flexWrap: 'wrap', marginTop: 15
                }}>
                    {
                        SentencedToEmpty(item, ['taskInfo'], []).map((typeItem, typeIndex) => {
                            return (<TouchableOpacity
                                onPress={() => {
                                    this.props.dispatch(createAction('taskModel/updateState')({
                                        entID: SentencedToEmpty(item, ['entID'], ''),
                                        recordTypeID: SentencedToEmpty(typeItem, ['recordTypeID'], '')
                                    }));
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'GTasks'
                                        , params: {
                                            entName: item.parentName,
                                            entID: item.entID,
                                            recordTypeID: typeItem.recordTypeID
                                        }
                                    }));
                                }}
                                key={`${index}item${typeIndex}`}>
                                <View style={{
                                    width: (SCREEN_WIDTH - 60) / 3
                                    , marginLeft: typeIndex % 3 == 0 ? 0 : 10, height: 27
                                    , flexDirection: 'row', backgroundColor: '#F7F8FA'
                                    , borderRadius: 5, justifyContent: 'space-between'
                                    , alignItems: 'center', paddingHorizontal: 5
                                    , marginBottom: 10
                                }}>
                                    <Text style={{ fontSize: 12, color: '#666666' }}>{SentencedToEmpty(typeItem, ['recordTypeName'], '--')}</Text>
                                    <Text style={{ fontSize: 12, color: '#4AA0FF' }}>{`${SentencedToEmpty(typeItem, ['count'], '0')}个`}</Text>
                                </View>
                            </TouchableOpacity>);
                        })
                    }

                </View>
            </View>
        </View>);
    }
    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('taskModel/updateState')({ UnhandleTaskTypeListResult: { status: -1 } }))
        this.props.dispatch(createAction('taskModel/getUnhandleTaskTypeList')({}))
    }

    render() {
        return (
            <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                <StatusPage
                    backRef={true}
                    status={SentencedToEmpty(this.props, ['UnhandleTaskTypeListResult', 'status'], 200)}
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
                        }}
                        onRefresh={index => {
                            console.log('onRefresh');
                            this.statusPageOnRefresh();
                        }}
                        onEndReached={index => {
                            // this.props.dispatch(createAction('taskModel/updateState')({ unhandleTaskListPageIndex: index }));
                            // this.props.dispatch(createAction('taskModel/getUnhandleTaskList')({ setListData: this.list.setListData }));
                        }}
                        renderItem={this.renderItem}
                        data={SentencedToEmpty(this.props, ['UnhandleTaskTypeListResult'
                            , 'data', 'Datas'], [])}
                    />
                    <TouchableOpacity
                        style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                        onPress={() => {
                            this.props.dispatch(
                                createAction('app/updateState')({
                                    selectEnterprise: { EntName: '请选择' }
                                }));
                            this.props.dispatch(NavigationActions.navigate({ routeName: 'CreateTask' }));
                        }}
                    >
                        <Image
                            style={{
                                width: 60, height: 60
                            }}
                            source={require('../../../images/ic_blue_float_add.png')} />
                    </TouchableOpacity>
                </StatusPage>
            </View>
        )
    }
}
