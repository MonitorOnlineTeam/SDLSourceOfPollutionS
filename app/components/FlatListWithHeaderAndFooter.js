import React, { PureComponent, Component } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

import { ShowToast, SentencedToEmpty } from '../utils';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/globalsize';
import { EmptyView } from './StatusPages/EmptyView';
let that;

export default class FlatListWithHeaderAndFooter extends Component {
    constructor(props) {
        super(props);
        //状态
        this.state = {
            //当前页
            index: 1,
            // 列表数据结构
            data: props.data,
            // 下拉刷新
            isRefresh: false,
            // 加载更多
            isLoadMore: false,
            //没有更多
            isNothingMore: false,
            refreshing: false,
            //已经加载到最后
            hasNothingMore: false
        };
        that = this;
    }

    static defaultProps = {
        style: [{ backgroundColor: '#f2f2f2' }],
        ItemSeparatorComponent: () => <View style={[{ width: SCREEN_WIDTH, height: 0.5, backgroundColor: '#d9d9d9' }]} />,
        pageSize: 10,
        data: [],
        hasMore: () => {
            ShowToast('您还没有设置hasMore，无法判断能否加载下一页');
            return false;
        },
        onRefresh: index => {
            ShowToast('您还没有设置列表刷新方法onRefresh');
        },
        onEndReached: index => {
            ShowToast('您还没有设置分页加载方法onEndReached');
        },
        renderItem: ({ item, index }) => {
            return (
                <TouchableOpacity onPress={() => this._onItemClick(item)}>
                    <View style={[{ height: 45, width: SCREEN_WIDTH, backgroundColor: index % 2 == 1 ? '#c66ffa' : '#0084fb' }]} />
                </TouchableOpacity>
            );
        },
        getPageIndex: pageIndex => { },
        ListHeaderComponent: () => {
            return (
                <View style={styles.headView}>
                    <ActivityIndicator style={[{ marginRight: 16, width: 8, height: 8 }]} />
                    <Text style={{ color: '#666', fontSize: 13 }}>{'正在刷新页面'}</Text>
                    <View style={[{ marginLeft: 16, width: 8, height: 8 }]} />
                </View>
            );
        },
        ListFooterComponent: () => {
            return (
                <View style={styles.footerView}>
                    <ActivityIndicator style={[{ marginRight: 16, width: 8, height: 8 }]} />
                    <Text style={{ color: '#666', fontSize: 13 }}>{'正在加载下一页'}</Text>
                    <View style={[{ marginLeft: 16, width: 8, height: 8 }]} />
                </View>
            );
        },
        ListFooterNothingMore: () => {
            return (
                <View style={styles.footerView}>
                    <ActivityIndicator style={[{ marginRight: 16, width: 8, height: 8 }]} />
                    <Text style={{ color: '#666', fontSize: 13 }}>{'没有更多'}</Text>
                    <View style={[{ marginLeft: 16, width: 8, height: 8 }]} />
                </View>
            );
        },
        onEndReachedThreshold: 0.2
    };

    setListData = (data, duration = -1) => {
        let index = Math.ceil(data.length / this.props.pageSize);
        if (duration == -1) {
            this.setState({ data: data, isRefresh: false, isLoadMore: false, refreshing: false, index });
        } else if (duration < 1500) {
            setTimeout(() => {
                this.setState({ data: data, isRefresh: false, isLoadMore: false, refreshing: false, index });
            }, 1500 - duration);
        } else {
            this.setState({ data: data, isRefresh: false, isLoadMore: false, refreshing: false, index });
        }
    };

    loadFail = () => {
        this.setState({ isRefresh: false, isLoadMore: false });
    };

    render() {
        const {
            ListEmptyComponent = () => {
                return (
                    <EmptyView
                        title={'暂无数据'}
                        backgroundColor={'#00000000'}
                        btnText={'点击重试'}
                        paddingTop={SCREEN_HEIGHT / 5 - 40}
                        onPress={() => {
                            this.onRefresh();
                        }}
                    />
                );
            }
        } = this.props;
        return (
            <FlatList
                style={[styles.container, this.props.style]}
                // data={this.state.data}
                data={this.props.data}
                //item显示的布局
                renderItem={this.props.renderItem}
                // 空布局
                ListEmptyComponent={() => {
                    if (this.state.refreshing) {
                        return <View />;
                    } else {
                        return ListEmptyComponent();
                    }
                }}
                //添加头尾布局
                ListHeaderComponent={this.ListHeaderComponent}
                ListFooterComponent={this.ListFooterComponent}
                //下拉刷新相关
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isRefresh}
                //加载更多
                onEndReached={() => this.onEndReached()}
                onEndReachedThreshold={this.props.onEndReachedThreshold}
                ItemSeparatorComponent={this.props.ItemSeparatorComponent}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
    /**
     * 创建头部布局
     */
    ListHeaderComponent = () => {
        return null;
        // if (this.state.isRefresh) {
        //     return this.props.ListHeaderComponent();
        // } else {
        //     return null;
        // }
    };
    /**
     * 创建footer布局
     */
    ListFooterComponent = () => {
        if (this.state.isLoadMore) {
            return this.props.ListFooterComponent();
        } else if (this.state.isNothingMore) {
            return this.props.ListFooterNothingMore();
        } else {
            return null;
        }
    };

    /**
     * 下啦刷新
     * @private
     */
    onRefresh = () => {
        console.log('onRefresh');
        // 尝试页码由组件控制
        this.setState({ isRefresh: true, refreshing: true, hasNothingMore: false, index: 1 });
        // 不处于 下拉刷新
        if (!this.state.isRefresh && !this.state.isLoadMore) {
            this.props.onRefresh(1);
        }
    };

    /**
     * 加载更多
     * @private
     */
    onEndReached = () => {
        if (this.state.hasNothingMore) return;
        // 不处于正在加载更多 && 有下拉刷新过，因为没数据的时候 会触发加载
        if (!this.state.isLoadMore && !this.state.isRefresh && this.state.data.length > 0 && this.props.hasMore() && this.props.pageSize * this.state.index == this.state.data.length) {
            // 尝试页码由组件控制
            let nextPageIndex = this.state.index + 1;
            this.setState({ isLoadMore: true });
            this.props.onEndReached(nextPageIndex);
        } else if (!this.props.hasMore() && SentencedToEmpty(this.props, ['data'], []).length >= this.props.pageSize) {
            this.setState({ isNothingMore: true, hasNothingMore: true });
            let that = this;
            setTimeout(() => {
                if (that) {
                    that.setState({ isNothingMore: false });
                }
            }, 2000);
        }
    };

    /**
     * item点击事件
     */
    _onItemClick = item => {
        console.log('page' + this.state.page + ' = ' + item.baike_name);
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    headView: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 80,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerView: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 80,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemImages: {
        width: 120,
        height: 120,
        resizeMode: 'stretch'
    }
});
