/*
 * @Description: 成套签到项目列表
 * @LastEditors: hxf
 * @Date: 2023-09-21 09:19:56
 * @LastEditTime: 2024-11-11 13:39:49
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/CTProjectInfoList.js
 */
import React, { Component } from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils';

@connect(({ CTModel }) => ({
    projectInfoListSearchStr: CTModel.projectInfoListSearchStr,
    checkInProjectListResult: CTModel.checkInProjectListResult,
    checkInProjectList: CTModel.checkInProjectList,
}))
export default class CTProjectInfoList extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '项目信息',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    componentDidMount() {
        // this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({}));
        this.statusPageOnRefresh();
    }

    onRefresh = () => {
        this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({ setListData: this.list.setListData }));
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('CTModel/updateState')({
            checkInProjectListResult: { status: -1 }
        }));
        this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({}));
    }

    _renderItem = ({ item }) => {
        //ItemCode 立项号  项目号 ProjectCode CustomEnt 最终客户
        return (<TouchableOpacity
            onPress={() => {
                this.props.dispatch(createAction('CTModel/updateState')({
                    selectedProject: item,
                    orientationStatus: 'out'
                }));
                this.props.dispatch(createAction('CTModel/getCTSignInProject')({
                    params: {
                        ProjectId: item.ProjectId, entId: item.EntId
                    }
                }));
                this.props.dispatch(NavigationActions.back());
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, height: 113
                    , paddingHorizontal: 19, paddingVertical: 14
                    , justifyContent: 'space-between'
                    , backgroundColor: 'white'
                }]}
            >
                <Text
                    numberOfLines={1}
                    style={[styles.itemText, { fontSize: 17 }]}
                >
                    {`${SentencedToEmpty(item, ['EntName'], '--')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[styles.itemText]}
                >
                    {`合同编号：${SentencedToEmpty(item, ['ProjectCode'], '--')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[styles.itemText]}
                >
                    {`立项号：${SentencedToEmpty(item, ['ItemCode'], '--')}`}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[styles.itemText]}
                >
                    {`项目名称：${SentencedToEmpty(item, ['ProjectName'], '--')}`}
                </Text>
                {/* <Text 
                    numberOfLines={1}
                    style={[styles.itemText]}
                >
                    {`最终客户名称：${SentencedToEmpty(item,['CustomEnt'],'--')}`}
                </Text> */}
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (
            <View
                style={[{ width: SCREEN_WIDTH, flex: 1 }]}
            >
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
                            source={require('../../../images/ic_search_help_center.png')}
                        />
                        <TextInput
                            style={[{
                                color: '#333333',
                                flex: 1
                                , paddingVertical: 0
                                , marginHorizontal: 5
                            }]}
                            placeholder={'企业名称、合同编号、立项号'}
                            placeholderTextColor={'#999999'}
                            onChangeText={(text) => {
                                this.props.dispatch(createAction('CTModel/updateState')({
                                    projectInfoListSearchStr: text
                                }));
                            }}
                        >{SentencedToEmpty(this.props, ['projectInfoListSearchStr'], '')}</TextInput>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({}));
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
                <View
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , marginTop: 5
                    }]}
                >
                    <StatusPage
                        status={SentencedToEmpty(this.props, ['checkInProjectListResult', 'status'], 1000)}
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
                            ref={ref => (this.list = ref)}
                            // pageSize={this.props.pageSize}
                            ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 5, backgroundColor: '#f2f2f2' }]} />}
                            hasMore={() => {
                                return false;
                                // return SentencedToEmpty(this.props,['faultFeedbackList'],[]).length < this.props.faultFeedbackListTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                // this.onRefresh(index);
                            }}
                            renderItem={this._renderItem}
                            data={SentencedToEmpty(this.props, ['checkInProjectList'], [])}
                        />
                    </StatusPage>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 14, color: '#333333'
    },
})