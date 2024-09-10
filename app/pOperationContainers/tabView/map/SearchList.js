import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, FlatList, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux';

import { getSwitchToken } from '../../../dvapack/storage';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, transformColorToTransparency } from '../../../utils';
import { checkAlarmByTargetList } from '../../../pollutionModels/utils';
import AlarmIcon from '../../components/AlarmIcon';
import { StatusPage, Touchable, SDLText, TextInput } from '../../../components';
import globalcolor from '../../../config/globalcolor';
import TextLabel from '../../components/TextLabel';
import MyTextInput from '../../../components/base/TextInput';
import { NavigationActions } from '../../../utils/RouterUtils';

const lineHeight = 45;
/**
 * 搜索
 * @class Search
 * @extends {Component}
 */
@connect(({ map, websocket }) => ({
    searchText: map.searchText, //上次查询的记录 记住第一次进来时候使用
    searchEntList: map.searchEntList, //需要展示的企业
    searchhistoryList: map.searchhistoryList, //搜索历史
    searchStatus: map.searchStatus, //状态页
    isSearching: map.isSearching, //查询的时候 不显示搜索历史
    RealTimeAlarms: websocket.RealTimeAlarms //实时报警数据
}))
export default class SearchList extends Component {
    static navigationOptions = {
        header: null
    };

    // static navigationOptions = createNavigationOptions({
    //     title: '企业列表',
    //     headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    // });

    constructor(props) {
        super(props);
        this.state = {
            text: props.searchText ? props.searchText : ''
        };
    }

    componentDidMount() {
        this.getSearchHistory();
    }

    getSearchHistory = () => {
        console.log('getSearchHistory');
        this.props.dispatch(createAction('map/updateState')({ isSearching: false }));
        this.props.dispatch(createAction('map/getSearchHistory')({})); //加载搜索历史
    };

    search = text => {
        console.log('search fun');
        this.props.dispatch(createAction('map/searchEntList')({ params: { text } }));
        console.log('search fun end');
    };

    clear = () => {
        this.props.dispatch(createAction('map/clearSearchHistory')({}));
    };

    dismissSearch = () => {
        this.setState({ text: '' });
        this.props.dispatch(createAction('map/dismissSearch')({}));
    };

    /** 点击企业获取站点信息 */
    clickEnt = ({ Name, Id: entCode }) => {
        // let source = 'mapList'; //判断是地图页面还是列表页面
        // if (getSwitchToken() && getSwitchToken().mapPageDefSwitch == 'map') {
        //     source = 'map';
        // }
        // this.props.dispatch(createAction('map/getPointListByEntCode')({ params: { entCode, source } })); //获取站点列表
        // this.props.dispatch(createAction('map/insertSearchText')({ params: { SearchContent: Name } })); //插入搜索记录
        this.props.dispatch(NavigationActions.back()); //返回地图页
    };

    /** 渲染历史查询结果 */
    renderHistoryItem = ({ item, index }) => {
        return (
            <Touchable
                key={`h_${index}`}
                style={{ width: SCREEN_WIDTH, height: lineHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomColor: '#d9d9d9', borderBottomWidth: 0.5 }}
                onPress={() => {
                    const text = item['dbo.T_Bas_SearchHistory.SearchContent'];
                    this.search(text);
                    this.setState({ text });
                }}
            >
                <SDLText fontType={'normal'} style={{ flex: 1, marginLeft: 20 }} numberOfLines={1}>
                    {item['dbo.T_Bas_SearchHistory.SearchContent']}
                </SDLText>
                <Image style={{ width: 14, height: 14, marginLeft: 5, marginRight: 13 }} source={require('../../../images/right.png')} />
            </Touchable>
        );
    };

    /** 渲染企业条目 */
    renderEntItem = ({ item, index }) => {
        const { Abbreviation, Id, FooterText, Address, Name, Alarm } = item;
        return (
            <Touchable
                key={`ent_${index}`}
                style={{ width: '100%', paddingLeft: 13, paddingRight: 13, marginBottom: 10, flexDirection: 'column', backgroundColor: '#fff' }}
                onPress={() => {
                    this.clickEnt({ Name, Id });
                }}
            >
                <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                    <AlarmIcon Alarm={Alarm} style={{ marginRight: 4 }} />
                    <SDLText numberOfLines={1} fontType={'normal'} style={{ color: '#333' }}>
                        {Name}
                    </SDLText>
                </View>

                <SDLText fontType={'small'} style={{ marginTop: 10, lineHeight: 22 }}>
                    {Address ? Address : '暂无地址信息'}
                </SDLText>
                <View style={{ width: '100%', marginTop: 5, flexDirection: 'row', marginBottom: 15, height: 15 }}>
                    {FooterText
                        ? FooterText.split(',').map((item, key) => {
                            if (item) {
                                return <TextLabel key={`label${index}_${key}`} text={item} color={'#75A5FB'} />;
                            }
                        })
                        : null}
                </View>
            </Touchable>
        );
    };

    /* 渲染搜索历史 */
    renderHistorys = () => {
        const { searchhistoryList } = this.props;

        return (
            <View style={{ width: SCREEN_WIDTH }}>
                <View style={{ width: '100%', height: 35, backgroundColor: '#F2F2F2', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SDLText fontType={'small'} style={{ marginLeft: 22, color: '#999' }}>
                        {'搜索历史'}
                    </SDLText>
                    <Touchable
                        style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            this.clear();
                        }}
                    >
                        <SDLText fontType={'small'} style={{ marginRight: 22, marginLeft: 22, color: globalcolor.headerBackgroundColor }}>
                            {'删除'}
                        </SDLText>
                    </Touchable>
                </View>
                <FlatList keyboardShouldPersistTaps="handled" style={{ width: '100%' }} data={searchhistoryList} renderItem={this.renderHistoryItem} keyExtractor={(item, index) => index.toString()} />
            </View>
        );
    };

    /* 渲染企业列表 */
    renderEnts = () => {
        const { searchEntList, RealTimeAlarms } = this.props;
        if (searchEntList && searchEntList.length > 0) checkAlarmByTargetList(searchEntList, 'Id', RealTimeAlarms);
        return <FlatList keyboardShouldPersistTaps="handled" style={{ width: '100%' }} data={searchEntList} renderItem={this.renderEntItem} refreshing={false} onRefresh={() => { }} keyExtractor={(item, index) => index.toString()} />;
    };

    /* 渲染标题头 */
    renderHeader = () => {
        const { searchStatus } = this.props;
        return (
            <View style={{ width: '100%', height: 44, backgroundColor: globalcolor.headerBackgroundColor, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 30, flex: 1, marginLeft: 22, backgroundColor: '#ffffff', borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 18, height: 18, tintColor: '#9a9a9a', marginLeft: 8 }} source={require('../../../images/ic_search.png')} />
                    <TextInput
                        autoFocus={true}
                        style={{ flex: 1, height: '100%', paddingLeft: 8, paddingRight: 8, paddingTop: 0, paddingBottom: 0, color: '#999', fontSize: 14 }}
                        // value={this.state.text}
                        onChangeText={text => {
                            this.setState({ text });
                            this.search(text);
                        }}
                    >
                        <Text>{this.state.text}</Text>
                    </TextInput>
                    {this.state.text ? (
                        <Touchable
                            onPress={() => {
                                this.dismissSearch();
                            }}
                            style={{ width: 32, height: 30, justifyContent: 'center', alignItems: 'center' }}
                        >
                            {searchStatus == -1 ? <ActivityIndicator color={'#999'} /> : <Image style={{ width: 18, height: 18, tintColor: '#9a9a9a' }} source={require('../../../images/clear.png')} />}
                        </Touchable>
                    ) : null}
                </View>

                <Touchable
                    style={{ width: 53, height: '100%', flexDirection: 'row', paddingLeft: 6, alignItems: 'center' }}
                    onPress={() => {
                        this.dismissSearch();
                        this.props.dispatch(NavigationActions.back());
                    }}
                >
                    <SDLText style={{ color: '#fff' }} fontType={'normal'}>
                        {'取消'}
                    </SDLText>
                </Touchable>
            </View>
        );
    };

    render() {
        const { searchStatus, isSearching } = this.props;
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <StatusPage
                    status={searchStatus == -1 ? 200 : searchStatus}
                    errorBtnText={'点击重试'}
                    emptyBtnText={'点击重试'}
                    onErrorPress={() => {
                        if (this.state.text) this.search(this.state.text);
                        this.getSearchHistory();
                    }}
                    onEmptyPress={() => { }}
                >
                    {isSearching ? this.renderEnts() : this.renderHistorys()}
                </StatusPage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#F2F2F2'
    }
});
