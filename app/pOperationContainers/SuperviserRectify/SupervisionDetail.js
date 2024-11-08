/*
 * @Description: 督查整改记录详情
 * @LastEditors: hxf
 * @Date: 2022-11-29 09:29:42
 * @LastEditTime: 2024-11-04 08:41:42
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/SuperviserRectify/SupervisionDetail.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { StatusPage } from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty } from '../../utils';

@connect(({ supervision }) => ({
    currentList: supervision.currentList,
    toBeCorrectedParams: supervision.toBeCorrectedParams,
    alreadyCorrectedParams: supervision.alreadyCorrectedParams,
    underAppealParams: supervision.underAppealParams,
    inspectorRectificationInfoResult: supervision.inspectorRectificationInfoResult
}))
export default class SupervisionDetail extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '督查整改详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('supervision/updateState')({
            inspectorRectificationInfoResult: { status: -1 }
        }));
        this.props.dispatch(createAction('supervision/getInspectorRectificationInfoList')({}));
    }

    componentWillUnmount() {
        this.props.dispatch(createAction('supervision/GetInspectorRectificationNum')({}));
        let newParams;
        // 0 待整改 1 已整改    2 申诉中
        switch (this.props.currentList) {
            case 0:
                // 未整改2
                newParams = { ...this.props.toBeCorrectedParams };
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList: 0,
                    toBeCorrectedParams: newParams,
                    toBeCorrectedResult: { status: -1 },
                    Status: 2, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getToBeCorrectedList')({}));
                break;
            case 1:
                // 已整改1
                newParams = { ...this.props.alreadyCorrectedParams };
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList: 1,
                    alreadyCorrectedParams: newParams,
                    alreadyCorrectedResult: { status: -1 },
                    Status: 1, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getAlreadyCorrectedList')({}));
                break;
            case 2:
                newParams = { ...this.props.underAppealParams };
                newParams.index = 1;
                this.props.dispatch(createAction('supervision/updateState')({
                    currentList: 2,
                    underAppealParams: newParams,
                    underAppealResult: { status: -1 },
                    Status: 5, // 已整改1 未整改2 整改通过3 整改驳回4 申诉中5 申诉通过6
                }));
                this.props.dispatch(createAction('supervision/getUnderAppealList')({}));
                break;
            case 3:
                // 整改通过
                break;
        }
    }

    render() {
        let isEmpty = (
            SentencedToEmpty(this.props
                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'PrincipleProblemList']
                , []).length == 0
            && SentencedToEmpty(this.props
                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'importanProblemList']
                , []).length == 0
            && SentencedToEmpty(this.props
                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'CommonlyProblemList']
                , []).length == 0
        );

        return (
            <StatusPage
                status={SentencedToEmpty(this.props, ['inspectorRectificationInfoResult', 'status'], 1000)}
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
                <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                    <View style={{
                        width: SCREEN_WIDTH, height: 84
                        , paddingLeft: 20, paddingVertical: 15
                        , backgroundColor: 'white', marginBottom: 14
                    }}>
                        <Text numberOfLines={1} style={{ fontSize: 15, color: '#333333', width: SCREEN_WIDTH - 30 }}>
                            {`企业名称：${SentencedToEmpty(this.props
                                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'Info', 0, 'EntName'], '--')}`}
                        </Text>
                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#666666' }}>
                            {`监测点名称：${SentencedToEmpty(this.props
                                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'Info', 0, 'PointName'], '--')}`}
                        </Text>
                        <View style={{
                            flexDirection: 'row', width: SCREEN_WIDTH - 30
                        }}>
                            <Text numberOfLines={1} style={{ flex: 1, fontSize: 12, color: '#666666' }}>
                                {`督查人：${SentencedToEmpty(this.props
                                    , ['inspectorRectificationInfoResult', 'data', 'Datas', 'Info', 0, 'InspectorName'], '--')}`}
                            </Text>
                            <Text style={{ flex: 1, fontSize: 12, color: '#666666' }}>
                                {`督查日期：${SentencedToEmpty(this.props
                                    , ['inspectorRectificationInfoResult', 'data', 'Datas', 'Info', 0, 'InspectorDate'], 'xxxx-xx-xx')}`}
                            </Text>
                        </View>
                    </View>
                    {
                        isEmpty ? <View style={[{
                            width: SCREEN_WIDTH, flex: 1,
                            justifyContent: 'center', alignItems: 'center'
                        }]}>
                            <Image resizeMode="contain" source={require('../../components/StatusPages/ic_contractlist_empty.png')} style={{ height: 307 / 2, width: 236 / 2 }} />
                            <Text style={[{ color: '#333333' }]}>{'数据已处理完，请返回上一页！'}</Text>
                        </View>
                            : <ScrollView
                                style={{ width: SCREEN_WIDTH }}
                            >
                                {/* PrincipleProblemList 原则问题 */}
                                {
                                    SentencedToEmpty(this.props
                                        , ['inspectorRectificationInfoResult', 'data', 'Datas', 'PrincipleProblemList']
                                        , []).length > 0 ? <View style={{
                                            width: SCREEN_WIDTH, backgroundColor: 'white'
                                            , marginBottom: 10
                                        }}>
                                        <Text style={{
                                            fontSize: 15, color: '#333333',
                                            marginTop: 15, marginLeft: 20
                                        }}>{`原则问题`}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'PrincipleProblemList']
                                                , []).map((item, index) => {
                                                    return <View
                                                        style={{ marginLeft: 19 }}
                                                        onPress={() => {

                                                        }}
                                                    >
                                                        <View style={[{
                                                            width: SCREEN_WIDTH - 38
                                                            , alignItems: 'center', paddingVertical: 15
                                                        }, index != 0 ? { borderTopWidth: 1, borderTopColor: '#EAEAEA' } : {}]}>
                                                            <View style={{
                                                                width: SCREEN_WIDTH - 40, flexDirection: 'row'
                                                                , alignItems: 'flex-end'
                                                            }}>
                                                                <Text style={{ flex: 1, fontSize: 12, lineHeight: 13, color: '#666666' }}>
                                                                    {`${index + 1}、${SentencedToEmpty(item, ['ContentItem'], '----')}`}
                                                                </Text>
                                                                {
                                                                    /**
                                                                    1	已整改
                                                                    2	未整改
                                                                    3	整改通过
                                                                    4	整改驳回
                                                                    */
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1 ?
                                                                        <View style={{
                                                                            width: 64, height: 24, borderRadius: 12
                                                                            , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                            , alignItems: 'center', marginLeft: 15
                                                                        }}>
                                                                            <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '已整改')}`}</Text>
                                                                        </View>
                                                                        : SentencedToEmpty(item, ['Status'], 2) == 2 ?
                                                                            <View style={{
                                                                                width: 64, height: 24, borderRadius: 12
                                                                                , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                , alignItems: 'center', marginLeft: 15
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                            </View>
                                                                            : SentencedToEmpty(item, ['Status'], 2) == 3 ?
                                                                                <View style={{
                                                                                    width: 64, height: 24, borderRadius: 12
                                                                                    , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                                    , alignItems: 'center', marginLeft: 15
                                                                                }}>
                                                                                    <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改通过')}`}</Text>
                                                                                </View>
                                                                                : SentencedToEmpty(item, ['Status'], 2) == 4 ?
                                                                                    <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改驳回')}`}</Text>
                                                                                    </View>
                                                                                    : <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                                    </View>
                                                                }

                                                            </View>
                                                            <View style={{
                                                                height: 38, width: SCREEN_WIDTH - 38, flexDirection: 'row'
                                                                , alignItems: 'center'
                                                            }}>
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '原则问题整改'
                                                                                    }
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '原则问题申诉'
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <View style={{
                                                                                height: 23, width: 62
                                                                                , backgroundColor: '#4AA0FF', borderRadius: 10
                                                                                , justifyContent: 'center', alignItems: 'center'
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'申诉'}</Text>
                                                                            </View>
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已整改
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1
                                                                        || SentencedToEmpty(item, ['Status'], 2) == 3
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '原则问题整改'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已申诉
                                                                    SentencedToEmpty(item, ['Status'], 2) == 5
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '原则问题申诉'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                })
                                        }
                                    </View> : null
                                }
                                {/* importanProblemList 重点问题 */}
                                {
                                    SentencedToEmpty(this.props
                                        , ['inspectorRectificationInfoResult', 'data', 'Datas', 'importanProblemList']
                                        , []).length > 0 ? <View style={{
                                            width: SCREEN_WIDTH, backgroundColor: 'white'
                                            , marginBottom: 10
                                        }}>
                                        <Text style={{
                                            fontSize: 15, color: '#333333',
                                            marginTop: 15, marginLeft: 20
                                        }}>{`重点问题`}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'importanProblemList']
                                                , []).map((item, index) => {
                                                    return <View
                                                        style={{ marginLeft: 19 }}
                                                        onPress={() => {

                                                        }}
                                                    >
                                                        <View style={[{
                                                            width: SCREEN_WIDTH - 38
                                                            , alignItems: 'center', paddingVertical: 15
                                                        }, index != 0 ? { borderTopWidth: 1, borderTopColor: '#EAEAEA' } : {}]}>
                                                            <View style={{
                                                                width: SCREEN_WIDTH - 40, flexDirection: 'row'
                                                                , alignItems: 'flex-end'
                                                            }}>
                                                                <Text style={{ flex: 1, fontSize: 12, lineHeight: 13, color: '#666666' }}>
                                                                    {`${index + 1}、${SentencedToEmpty(item, ['ContentItem'], '----')}`}
                                                                </Text>
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1 ?
                                                                        <View style={{
                                                                            width: 64, height: 24, borderRadius: 12
                                                                            , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                            , alignItems: 'center', marginLeft: 15
                                                                        }}>
                                                                            <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改通过')}`}</Text>
                                                                        </View>
                                                                        : SentencedToEmpty(item, ['Status'], 2) == 2 ?
                                                                            <View style={{
                                                                                width: 64, height: 24, borderRadius: 12
                                                                                , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                , alignItems: 'center', marginLeft: 15
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                            </View>
                                                                            : SentencedToEmpty(item, ['Status'], 2) == 3 ?
                                                                                <View style={{
                                                                                    width: 64, height: 24, borderRadius: 12
                                                                                    , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                                    , alignItems: 'center', marginLeft: 15
                                                                                }}>
                                                                                    <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改通过')}`}</Text>
                                                                                </View>
                                                                                : SentencedToEmpty(item, ['Status'], 2) == 4 ?
                                                                                    <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改驳回')}`}</Text>
                                                                                    </View>
                                                                                    : <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                                    </View>
                                                                }

                                                            </View>
                                                            <View style={{
                                                                height: 38, width: SCREEN_WIDTH - 38, flexDirection: 'row'
                                                                , alignItems: 'center'
                                                            }}>
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '重点问题整改'
                                                                                    }
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '重点问题申诉'
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <View style={{
                                                                                height: 23, width: 62
                                                                                , backgroundColor: '#4AA0FF', borderRadius: 10
                                                                                , justifyContent: 'center', alignItems: 'center'
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'申诉'}</Text>
                                                                            </View>
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已整改
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1
                                                                        || SentencedToEmpty(item, ['Status'], 2) == 3
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '重点问题整改'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已申诉
                                                                    SentencedToEmpty(item, ['Status'], 2) == 5
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '重点问题申诉'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                })
                                        }
                                    </View> : null
                                }
                                {/* CommonlyProblemList 一般问题 */}
                                {
                                    SentencedToEmpty(this.props
                                        , ['inspectorRectificationInfoResult', 'data', 'Datas', 'CommonlyProblemList']
                                        , []).length > 0 ? <View style={{
                                            width: SCREEN_WIDTH, backgroundColor: 'white'
                                        }}>
                                        <Text style={{
                                            fontSize: 15, color: '#333333',
                                            marginTop: 15, marginLeft: 20
                                        }}>{`一般问题`}</Text>
                                        {
                                            SentencedToEmpty(this.props
                                                , ['inspectorRectificationInfoResult', 'data', 'Datas', 'CommonlyProblemList']
                                                , []).map((item, index) => {
                                                    return <View
                                                        style={{ marginLeft: 19 }}
                                                        onPress={() => {

                                                        }}
                                                    >
                                                        <View style={[{
                                                            width: SCREEN_WIDTH - 38
                                                            , alignItems: 'center', paddingVertical: 15
                                                        }, index != 0 ? { borderTopWidth: 1, borderTopColor: '#EAEAEA' } : {}]}>
                                                            <View style={{
                                                                width: SCREEN_WIDTH - 40, flexDirection: 'row'
                                                                , alignItems: 'flex-end', marginBottom: 14
                                                            }}>
                                                                <Text style={{ flex: 1, fontSize: 12, lineHeight: 13, color: '#666666' }}>
                                                                    {`${index + 1}、${SentencedToEmpty(item, ['ContentItem'], '----')}`}
                                                                </Text>
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1 ?
                                                                        <View style={{
                                                                            width: 64, height: 24, borderRadius: 12
                                                                            , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                            , alignItems: 'center', marginLeft: 15
                                                                        }}>
                                                                            <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改通过')}`}</Text>
                                                                        </View>
                                                                        : SentencedToEmpty(item, ['Status'], 2) == 2 ?
                                                                            <View style={{
                                                                                width: 64, height: 24, borderRadius: 12
                                                                                , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                , alignItems: 'center', marginLeft: 15
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                            </View>
                                                                            : SentencedToEmpty(item, ['Status'], 2) == 3 ?
                                                                                <View style={{
                                                                                    width: 64, height: 24, borderRadius: 12
                                                                                    , backgroundColor: '#4AA0FF', justifyContent: 'center'
                                                                                    , alignItems: 'center', marginLeft: 15
                                                                                }}>
                                                                                    <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改通过')}`}</Text>
                                                                                </View>
                                                                                : SentencedToEmpty(item, ['Status'], 2) == 4 ?
                                                                                    <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '整改驳回')}`}</Text>
                                                                                    </View>
                                                                                    : <View style={{
                                                                                        width: 64, height: 24, borderRadius: 12
                                                                                        , backgroundColor: '#CCCCCC', justifyContent: 'center'
                                                                                        , alignItems: 'center', marginLeft: 15
                                                                                    }}>
                                                                                        <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{`${SentencedToEmpty(item, ['StatusName'], '未整改')}`}</Text>
                                                                                    </View>
                                                                }

                                                            </View>
                                                            <View style={{
                                                                height: 38, width: SCREEN_WIDTH - 38, flexDirection: 'row'
                                                                , alignItems: 'center'
                                                            }}>
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '一般问题整改'
                                                                                    }
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    SentencedToEmpty(item, ['Status'], 2) == 2
                                                                        ? <TouchableOpacity
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '一般问题申诉'
                                                                                    }
                                                                                }));
                                                                            }}
                                                                        >
                                                                            <View style={{
                                                                                height: 23, width: 62
                                                                                , backgroundColor: '#4AA0FF', borderRadius: 10
                                                                                , justifyContent: 'center', alignItems: 'center'
                                                                            }}>
                                                                                <Text style={{ fontSize: 12, color: '#FEFEFF' }}>{'申诉'}</Text>
                                                                            </View>
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已整改
                                                                    SentencedToEmpty(item, ['Status'], 2) == 1
                                                                        || SentencedToEmpty(item, ['Status'], 2) == 3
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemEditor',
                                                                                    params: {
                                                                                        title: '一般问题整改'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                                {
                                                                    //已申诉
                                                                    SentencedToEmpty(item, ['Status'], 2) == 5
                                                                        ? <TouchableOpacity
                                                                            style={{ marginRight: 20 }}
                                                                            onPress={() => {
                                                                                this.props.dispatch(createAction('supervision/updateState')({
                                                                                    editItem: item,
                                                                                }));
                                                                                this.props.dispatch(NavigationActions.navigate({
                                                                                    routeName: 'SupervisionItemAppeal',
                                                                                    params: {
                                                                                        title: '一般问题申诉'
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
                                                                        </TouchableOpacity> : null
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                })
                                        }
                                    </View> : null
                                }
                            </ScrollView>
                    }
                </View>
            </StatusPage>
        )
    }
}
