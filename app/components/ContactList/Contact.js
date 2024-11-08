import React, { Component } from 'react';
import { View, SectionList, TouchableHighlight, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Line } from '../../';
import styles from './ContactStyle';
import sectionListGetItemLayout from './ComputeItemLayout';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { connect } from 'react-redux';
import globalcolor from '../../config/globalcolor';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
import { EmptyView } from '../StatusPages/EmptyView';
/**
 * author HH
 */
@connect()
//带搜索的组列表或者普通列表
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: props.searchValue || ''
        };
        this.py = Array.from(new Array(27), (val, index) => index + 65).map(item => {
            if (item === 91) {
                return '#';
            }
            return String.fromCharCode(item);
        });
        this.sectionList = undefined;
    }
    renderSectionHeader = ({ section }) => {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.key || ''}</Text>
            </View>
        );
    };

    itemSeparatorComponent = () => {
        return <View style={{ height: 0.5, backgroundColor: '#EBEBEB' }} />;
    };
    scrollToLocation = (letter, sections) => {
        let index = -1;
        sections.forEach((item, idx) => {
            if (item.key === letter) {
                index = idx;
            }
        });
        if (index === -1) {
            return;
        }
        if (this.sectionList) {
            this.sectionList.scrollToLocation({
                itemIndex: 0,
                animated: true,
                sectionIndex: index,
                viewOffset: 0
            });
            //短暂的显示滚动指示器
            //this.sectionList.flashScrollIndicators();
        }
    };
    getItemLayout = () => {
        const index0Height = this.props.index0Height || 0;
        const ItemHeight = this.props.ItemHeight || 50;
        const ListHeaderComponentHeight = this.props.ListHeaderComponentHeight || 0;
        return sectionListGetItemLayout({
            // The height of the row with rowData at the given sectionIndex and rowIndex
            getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 0 ? index0Height + ItemHeight : ItemHeight),
            // These four properties are optional
            getSeparatorHeight: () => 0.5, // The height of your separators
            getSectionHeaderHeight: () => 30, // The height of your section headers
            getSectionFooterHeight: () => 0.5, // The height of your section footers
            listHeaderHeight: ListHeaderComponentHeight // The height of your list header
        });
    };
    renderPy = (sections = []) => {
        let onRenderPy = [];
        sections.forEach(item => {
            onRenderPy.push(item.key);
        });

        return this.props.renderAllPy
            ? this.py.map((item, index) => {
                return (
                    <TouchableHighlight
                        underlayColor={'rgba(158,158,158,1)'}
                        key={index}
                        onPress={() => {
                            this.scrollToLocation(item, sections);
                        }}
                    >
                        <Text style={styles.pyTextStyle}>{item}</Text>
                    </TouchableHighlight>
                );
            })
            : onRenderPy.map((item, index) => {
                return (
                    <TouchableHighlight
                        underlayColor={'rgba(158,158,158,1)'}
                        key={index}
                        onPress={() => {
                            this.scrollToLocation(item, sections);
                        }}
                    >
                        <Text style={styles.pyTextStyle}>{item}</Text>
                    </TouchableHighlight>
                );
            });
    };

    _extraUniqueKey = (item, index) => `index10${index}${item}`;
    _extraUniqueKeys = (item, index) => `index11${index}${item}`;
    search = text => {
        // this.refs.keyWordInput.blur()

        this.props.SearchCallback(text);
    };
    render() {
        const { searchResult = [], secType = '', flatData = [], sections = [], renderAllPy = false, ListHeaderComponent, ListHeaderComponentHeight, index0Height, searchPlaceholder = '' } = this.props;
        return (
            <View style={[styles.flex1, styles.sectionListWrapper]}>
                <View style={styles.leftContent}>
                    {!SentencedToEmpty(this.props, ['hideSearchInput'], false) ? <View
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
                        {/* <Image source={require('../../images/house.png')} style={{ width: 15, height: 15 }}></Image> */}
                        <TextInput
                            onFocus={() => {
                                this.props.dispatch(
                                    createAction('app/updateState')({
                                        enterpriseSearchData: { status: -1 }
                                    })
                                );
                            }}
                            underlineColorAndroid="transparent"
                            placeholder={searchPlaceholder ? searchPlaceholder : secType == 'people' ? '人员名称' : '输入关键字搜索'}
                            style={{
                                textAlign: 'center',
                                width: SCREEN_WIDTH - 90,
                                borderColor: '#cccccc',
                                borderWidth: 0.5,
                                borderRadius: 15,
                                height: 30,
                                backgroundColor: '#fff',
                                paddingVertical: 0,
                                color: '#333333',
                            }}
                            onChangeText={text => {
                                //动态更新组件内state 记录输入内容
                                this.setState({ searchValue: text });
                                if (secType == 'SparePart' || secType == 'Consumables') {

                                } else {
                                    this.search(text);
                                }
                            }}
                            clearButtonMode="while-editing"
                            ref="keyWordInput"
                        />
                        {Platform.OS == 'andriod' ? (
                            <TouchableOpacity
                                style={{ left: -30 }}
                                onPress={() => {
                                    this.refs.keyWordInput.blur();
                                    this.setState({ searchValue: '' });
                                }}
                            >
                                <Image source={require('../../images/clear.png')} style={{ width: 15, height: 15 }} />
                                {/* <Text style={{ color: '#fff', fontSize: 14,marginRight:10 }}>{'搜索'}</Text> */}
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity
                            onPress={() => {
                                // 搜索
                                this.search(this.state.searchValue);
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
                    </View> : null}
                    {this.state.searchValue.length > 0 ? (
                        <FlatList
                            style={{
                                height: '100%',
                                marginTop: 10,
                                width: SCREEN_WIDTH
                            }}
                            ListEmptyComponent={() => (
                                <EmptyView
                                    title={'暂无数据'}
                                    backgroundColor={'#00000000'}
                                    btnText={'点击重试'}
                                    paddingTop={SCREEN_HEIGHT / 5 - 40}
                                    onPress={() => {
                                        this.props.onRefresh;
                                    }}
                                />
                            )}
                            overScrollMode={'never'}
                            data={searchResult}
                            renderItem={this.props.renderSearchItem}
                            // keyExtractor={this._extraUniqueKeys}
                            onEndReachedThreshold={0.5}
                            initialNumToRender={30}
                            refreshing={false}
                        />
                    ) : secType == 'people' ? (
                        <SectionList
                            style={{
                                marginTop: 10,
                                width: SCREEN_WIDTH,
                                marginBottom: 35
                            }}
                            ref={ref => (this.sectionList = ref)}
                            keyExtractor={(item, index) => index}
                            ListHeaderComponent={ListHeaderComponent}
                            sections={sections}
                            stickySectionHeadersEnabled={false}
                            renderSectionHeader={this.renderSectionHeader}
                            renderItem={this.props.renderItem}
                            ItemSeparatorComponent={this.itemSeparatorComponent}
                            SectionSeparatorComponent={this.itemSeparatorComponent}
                            getItemLayout={this.getItemLayout()}
                        />
                    ) : (
                        <FlatList
                            style={[
                                {
                                    marginTop: 10,
                                    width: SCREEN_WIDTH,
                                    marginBottom: 35
                                },
                                this.props.style
                            ]}
                            ListEmptyComponent={() => (
                                <EmptyView
                                    title={'暂无数据'}
                                    backgroundColor={'#00000000'}
                                    btnText={'点击重试'}
                                    paddingTop={SCREEN_HEIGHT / 5 - 40}
                                    onPress={() => {
                                        this.props.onRefresh;
                                    }}
                                />
                            )}
                            overScrollMode={'never'}
                            onRefresh={this.props.onRefresh}
                            data={flatData}
                            renderItem={this.props.renderItem}
                            keyExtractor={this._extraUniqueKey}
                            onEndReachedThreshold={0.5}
                            initialNumToRender={30}
                            refreshing={false}
                        />
                    )}
                </View>
                {secType == 'people' ? (
                    <View style={styles.rightContent}>
                        <ScrollView>{this.renderPy(sections)}</ScrollView>
                    </View>
                ) : null}
            </View>
        );
    }
}
export default Contact;
