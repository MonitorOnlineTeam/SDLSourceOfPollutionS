/*
 * @Description: 通知公告
 * @LastEditors: hxf
 * @Date: 2022-09-23 14:29:34
 * @LastEditTime: 2024-09-06 10:56:29
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/AnnouncementsList.js
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View, Image } from 'react-native'
import { connect } from 'react-redux';
import { FlatListWithHeaderAndFooter, StatusPage } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getRootUrl } from '../../../dvapack/storage';
import { createNavigationOptions, NavigationActions, SentencedToEmpty, createAction } from '../../../utils';

@connect(({ helpCenter }) => ({
    noticeContentResult: helpCenter.noticeContentResult,
    noticeContentData: helpCenter.noticeContentData,
    noticeContentTotal: helpCenter.noticeContentTotal,
}))
export default class AnnouncementsList extends Component {

    static navigationOptions = createNavigationOptions({
        title: '通知公告',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    componentDidMount() {
        this.statusPageOnRefresh();
    }
    statusPageOnRefresh = () => {
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                noticeContentPageIndex: 1,
                noticeContentPageSize: 20,
                noticeContentResult: { status: -1 }
            })
        );
        this.props.dispatch(createAction('helpCenter/getNoticeContentList')({}));
    }

    onRefresh = () => {
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                noticeContentPageIndex: 1,
                noticeContentPageSize: 20,
                // noticeContentResult:{status:-1}
            })
        );
        this.props.dispatch(createAction('helpCenter/getNoticeContentList')({ setListData: this.list.setListData }));
    }

    renderItem = ({ item, index }) => {
        let rootUrl = getRootUrl();
        return (<TouchableOpacity
            onPress={() => {
                // console.log('url = ', rootUrl.ReactUrl + '/appoperation/noticeContentDetail/' + item.ID);
                // 标题的字段修改 未通知手机端  QuestionName
                this.props.dispatch(NavigationActions.navigate({
                    routeName: 'CusWebView'
                    , params: { CusUrl: rootUrl.ReactUrl + '/appoperation/noticeContentDetail/' + item.ID, title: '公告详情', item, reloadList: () => { } }
                }));
            }}
        >
            <View style={{
                width: SCREEN_WIDTH, height: 68
                , flexDirection: 'row', backgroundColor: '#ffffff'
            }}>
                <Image source={require('../../../images/ic_announcement_list.png')}
                    style={{ height: 19, width: 19, marginTop: 13, marginLeft: 13, marginRight: 10 }}
                />
                <View style={{ height: 68, flex: 1, borderBottomWidth: 1, borderBottomColor: '#E7E7E7' }}>
                    <Text numberOfLines={1} style={{ fontSize: 14, color: '#333333', marginTop: 13 }}>{SentencedToEmpty(item, ['NoticeTitle'], '---')}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 12, color: '#666666', marginTop: 12 }}>{`发布时间：${SentencedToEmpty(item, ['CreateTime'], '---- -- -- --:--')}`}</Text>
                </View>
                {false ? <Image source={require('../../../images/ic_istop.png')}
                    style={{ height: 16, width: 16, marginTop: 11 }}
                /> : null}
                <Image source={require('../../../images/right.png')}
                    style={{ height: 13, width: 13, marginTop: 28, marginRight: 12 }}
                />
            </View>
        </TouchableOpacity>)
    }

    render() {
        return (<StatusPage
            backRef={true}
            status={SentencedToEmpty(this.props
                , ['noticeContentResult', 'status'], 200)}
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
                style={[{ backgroundColor: '#ffffff' }]}
                ref={ref => (this.list = ref)}
                ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                pageSize={20}
                hasMore={() => {
                    return this.props.noticeContentData.length < this.props.noticeContentTotal;
                }}
                onRefresh={index => {
                    this.onRefresh(index);
                }}
                onEndReached={index => {
                    this.props.dispatch(createAction('helpCenter/updateState')({ noticeContentPageIndex: index }));
                    this.props.dispatch(createAction('helpCenter/getNoticeContentList')({ setListData: this.list.setListData }));
                }}
                renderItem={this.renderItem}
                data={SentencedToEmpty(this.props, ['noticeContentData'], [])}
            />
        </StatusPage>);
    }
}
