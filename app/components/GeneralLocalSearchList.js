/*
 * @Description: 本地搜索列表
 * @LastEditors: hxf
 * @Date: 2024-05-10 15:30:38
 * @LastEditTime: 2024-11-11 14:33:13
 * @FilePath: /SDLSourceOfPollutionS/app/components/GeneralLocalSearchList.js
 */
// import { Text, View } from 'react-native'
// import React, { Component } from 'react'

// export default class GeneralLocalSearchList extends Component {
//     render() {
//         return (
//             <View>
//                 <Text>GeneralLocalSearchList</Text>
//             </View>
//         )
//     }
// }

import React, { Component } from 'react'
import { Platform, Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { SCREEN_WIDTH } from '../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../utils';
import FlatListWithHeaderAndFooter from './FlatListWithHeaderAndFooter';
import { StatusPage } from './StatusPages';

@connect(({ GeneralSearchModel }) => ({
    keyWords: GeneralSearchModel.keyWords
}))
export default class GeneralLocalSearchList extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation
                , ['state', 'params', 'title'], '本地列表'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            metaData: SentencedToEmpty(props
                , ['route', 'params', 'params', 'data'], []),
            showData: SentencedToEmpty(props
                , ['route', 'params', 'params', 'data'], []),
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(props
                , ['route', 'params', 'params', 'title'], '本地列表')
        });
    }

    componentDidMount() {
        this.statusPageOnRefresh();
    }

    onRefresh = () => {
        // this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({ setListData: this.list.setListData }));
    }

    statusPageOnRefresh = () => {
        // this.props.dispatch(createAction('CTModel/updateState')({
        //     checkInProjectListResult: { status: -1 }
        // }));
        // this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({}));
    }

    _renderItem = ({ item, index }) => {
        return SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'renderItem']
            , (dItem, dIndex) => {
                return (<TouchableOpacity>
                    <View
                        style={[{
                            width: SCREEN_WIDTH, height: 113
                            , backgroundColor: dIndex % 2 == 0 ? '#F7F7F7' : '#FFFFFF'
                        }]}
                    ></View>
                </TouchableOpacity>);
            })(item, index, this);

        //ItemCode 立项号  ProjectCode 项目号  EntName 企业名称
        return (<TouchableOpacity
            onPress={() => {
                // let newData = { ...this.props.addServiceReminderParams };
                // newData.ProjectCode = SentencedToEmpty(item, ['ProjectCode'], '');
                // newData.ProjectID = SentencedToEmpty(item, ['ProjectID'], '');
                // newData.EntName = SentencedToEmpty(item, ['EntName'], '');

                // this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
                //     addServiceReminderParams: newData,
                //     pointList: SentencedToEmpty(item, ['PointList'], []),
                // }));
                // this.props.dispatch(NavigationActions.back());
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
            </View>
        </TouchableOpacity>);
    }

    doSearch = () => {
        let newData = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'doSearch']
            , () => { return [] }
        )(this.props.keyWords);
        this.setState({
            showData: newData
        });
        // const searchStr = SentencedToEmpty(this.props
        //     , ['contractNumberSearchString'], '').trim();
        // if (searchStr == '') {
        //     this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
        //         contractNumberSearchList: []
        //     }))
        //     return;
        // }
        // const metaData = SentencedToEmpty(this.props, ['contractNumberList'], []);
        // //ItemCode 立项号  ProjectCode 项目号  EntName 企业名称
        // let ItemCode = ''
        //     , ProjectCode = ''
        //     , EntName = '';
        // let resultArr = [];
        // console.log('metaData = ', metaData);
        // metaData.map((item, index) => {
        //     ProjectCode = SentencedToEmpty(item, ['ProjectCode'], '');
        //     EntName = SentencedToEmpty(item, ['EntName'], '');
        //     ItemCode = SentencedToEmpty(item, ['ItemCode'], '');
        //     console.log('ProjectCode = ', ProjectCode);
        //     console.log('EntName = ', EntName);
        //     console.log('ItemCode = ', ItemCode);
        //     if (ProjectCode.indexOf(searchStr) > -1) {
        //         resultArr.push(item);
        //     } else if (EntName.indexOf(searchStr) > -1) {
        //         resultArr.push(item);
        //     } else if (ItemCode.indexOf(searchStr) > -1) {
        //         resultArr.push(item);
        //     }
        // });
        // console.log('resultArr = ', resultArr);
        // this.props.dispatch(createAction('CTServiceReminderModel/updateState')({
        //     contractNumberSearchList: resultArr
        // }))
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
                            source={require('../images/ic_search_help_center.png')}
                        />
                        <TextInput
                            style={[{
                                flex: 1, color: '#333333'
                                , paddingVertical: 0
                                , marginHorizontal: 5
                            }]}
                            placeholder={SentencedToEmpty(this.props
                                , ['route', 'params', 'params', 'searchPlaceHolder']
                                , '企业名称、合同编号、立项号1')}
                            placeholderTextColor={'#999999'}
                            onChangeText={(text) => {

                                this.props.dispatch(createAction('GeneralSearchModel/updateState')({
                                    keyWords: text
                                }));
                                setTimeout(() => {
                                    this.doSearch();
                                }, 200)
                            }}
                        >{SentencedToEmpty(this.props, ['keyWords'], '')}</TextInput>
                        <TouchableOpacity
                            onPress={() => {
                                // this.props.dispatch(createAction('CTServiceReminderModel/GetCheckInProjectList')({}));
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
                <View
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , marginTop: 5
                    }]}
                >
                    <StatusPage
                        status={200}
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
                            ListEmptyComponent={() => {
                                return (<View
                                    style={[{
                                        width: SCREEN_WIDTH
                                        , flex: 1
                                    }]}
                                >

                                </View>);
                            }}
                            ref={ref => (this.list = ref)}
                            // pageSize={this.props.pageSize}
                            ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 5, backgroundColor: '#f2f2f2' }]} />}
                            hasMore={() => {
                                return false;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                // this.onRefresh(index);
                            }}
                            renderItem={this._renderItem}
                            data={SentencedToEmpty(this.state, ['showData'], [])}
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