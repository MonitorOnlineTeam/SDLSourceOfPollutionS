/*
 * @Description: 成套待办列表
 * @LastEditors: hxf
 * @Date: 2023-09-14 13:47:52
 * @LastEditTime: 2024-09-26 09:45:31
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/chengTaoXiaoXi/ChengTaoGTask.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { FlatListWithHeaderAndFooter, SDLText, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils';

/**
 * 成套待办
 */
@connect(({ CTModel }) => ({
    serviceDispatchData: CTModel.serviceDispatchData,
    serviceDispatchResult: CTModel.serviceDispatchResult
}))
export default class ChengTaoGTask extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            // title: '服务派单',
            title: '待办任务',
            // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
            headerRight: navigation.state.params ? navigation.state.params.headerRight : <View style={{ height: 20, width: 20, marginHorizontal: 16 }} />
        });
    };

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => <TouchableOpacity
                onPress={() => {
                    this.props.dispatch(NavigationActions.navigate({ routeName: 'ChengTaoTaskRecord' }));
                }}
            >
                <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'派单记录'}</SDLText>
            </TouchableOpacity>
        });

        this.props.navigation.setParams({
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'ChengTaoTaskRecord' }));
                    }}
                >
                    <SDLText style={{ color: '#fff', marginHorizontal: 16 }}>{'派单记录'}</SDLText>
                </TouchableOpacity>
            )
        });
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('CTModel/updateState')({
            serviceDispatchResult: { status: -1 }
        }));
        this.props.dispatch(createAction('CTModel/getServiceDispatch')({}));
    }

    onRefresh = () => {
        this.props.dispatch(createAction('CTModel/getServiceDispatch')({ setListData: this.list.setListData }));
    }

    _renderItem = ({ item, index }) => {
        const TaskStatus = SentencedToEmpty(item, ['TaskStatus'], '3');
        let textColor = '#3591F8'
            , bgColor = '#D1E7FF4D';
        if (TaskStatus == 3) {
            // 已完成
            textColor = '#3591F8';
            bgColor = '#D1E7FF4D'
        } else if (TaskStatus == 1) {
            // 待完成
            textColor = '#3591F8';
            bgColor = '#D1E7FF4D'
        } else if (TaskStatus == 2) {
            // 进行中
            textColor = '#19B319';
            bgColor = '#DCFFDC4D'
        }

        return (<TouchableOpacity
            onPress={() => {
                this.props.dispatch(createAction('CTModel/updateState')({
                    chengTaoTaskDetailData: item, // 待办列表选中的项目
                    dispatchId: item.ID,
                    ProjectID: item.ProjectID,
                    OneServiceDispatchResult: { status: 200 }
                }));
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'ChengTaoTaskDetail',
                    params: {
                        ...item
                    }
                }));
                this.props.dispatch(createAction('CTModel/getServiceDispatchTypeAndRecord')({
                    params: {
                        dispatchId: item.ID
                    }
                }));
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH, height: 138
                , paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12
                , justifyContent: 'space-between'
                , backgroundColor: '#FFFFFF'
            }]}>
                <Text
                    numberOfLines={1}
                    style={[{
                        width: SCREEN_WIDTH - 40, fontSize: 15
                        , color: '#333333'
                    }]}
                >
                    {`${SentencedToEmpty(item, ['CustomEnt'], '---')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        width: SCREEN_WIDTH - 40, fontSize: 14
                        , color: '#666666'
                    }]}
                >
                    {`服务申请人：${SentencedToEmpty(item, ['ApplicantUserName'], '---')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        width: SCREEN_WIDTH - 40, fontSize: 14
                        , color: '#666666'
                    }]}
                >
                    {`下单日期：${SentencedToEmpty(item, ['OrderDate'], '---')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[{
                        width: SCREEN_WIDTH - 40, fontSize: 14
                        , color: '#666666'
                    }]}
                >
                    {`派单工号：${SentencedToEmpty(item, ['Num'], '---')}`}
                </Text>
                <View style={[{
                    width: SCREEN_WIDTH - 40
                    , flexDirection: 'row', alignItems: 'center'
                }]}>
                    <Text
                        style={[{
                            fontSize: 14
                            , color: '#666666'
                        }]}
                    >
                        {'任务状态：'}
                    </Text>
                    <View style={[{
                        width: 50, height: 20
                        , justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: getStatusObject(SentencedToEmpty(item, ['TaskStatus'], 1)).bgColor
                    }]}>
                        <Text style={[{
                            fontSize: 13, color: getStatusObject(SentencedToEmpty(item, ['TaskStatus'], 1)).textColor
                        }]}>
                            {`${SentencedToEmpty(item, ['TaskStatusName'], '---')}`}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (
            <StatusPage
                backRef={true}
                status={SentencedToEmpty(this.props.serviceDispatchResult
                    , ['status'], 200)}
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
                <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                    <FlatListWithHeaderAndFooter
                        ref={ref => (this.list = ref)}
                        // pageSize={this.props.pageSize}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 1, backgroundColor: '#f2f2f2' }]} />}
                        hasMore={() => {
                            return false;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                        }}
                        renderItem={this._renderItem}
                        data={this.props.serviceDispatchData}
                    />
                </View>
            </StatusPage>
        )
    }
}

export const getStatusObject = function (TaskStatus) {
    let textColor = '#3591F8'
        , bgColor = '#D1E7FF4D';
    if (TaskStatus == 3) {
        // 已完成
        textColor = '#3591F8';
        bgColor = '#D1E7FF4D'
    } else if (TaskStatus == 1) {
        // 待完成
        textColor = '#F89B22';
        bgColor = '#FFDCAE4D'
    } else if (TaskStatus == 2) {
        // 进行中
        textColor = '#19B319';
        bgColor = '#DCFFDC4D'
    }
    return { textColor, bgColor };
}