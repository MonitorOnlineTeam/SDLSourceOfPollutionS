/*
 * @Description: 帮助中心 搜索列表
 * @LastEditors: hxf
 * @Date: 2022-09-28 13:42:15
 * @LastEditTime: 2024-11-04 18:56:03
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/account/HelpCenterSearchList.js
 */
import React, { Component } from 'react'
import { Platform, Text, View, Image, TouchableOpacity, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { getRootUrl } from '../../../dvapack/storage'
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils'
import FlatListWithHeaderAndFooter from '../../FlatListWithHeaderAndFooter'
import { StatusPage } from '../../StatusPages'

@connect(({ helpCenter }) => ({
    QuestionDetialListResult: helpCenter.QuestionDetialListResult,
    helpCenterData: helpCenter.helpCenterData,
    helpCenterTotal: helpCenter.helpCenterTotal,
}))
export default class HelpCenterSearchList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '帮助中心'),
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            QuestionName: ''
        }
    }

    componentDidMount() {
        this.statusPageOnRefresh();
    }
    statusPageOnRefresh = () => {
        let QuestionName = this.state.QuestionName;// 由前一级传入
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex: 1,
                QuestionDetialListResult: { status: -1 },
                firstLevel: 515
            })
        );
        this.props.dispatch(createAction('helpCenter/getHelpCenterList')({
            params: { QuestionName }
        }))
    }

    onRefresh = () => {
        this.nextPage(1);
    }

    nextPage = (index) => {
        let QuestionName = this.state.QuestionName;// 由前一级传入
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex: index,
            })
        );
        this.props.dispatch(createAction('helpCenter/getNoticeContentList')({
            setListData: this.list.setListData,
            params: {
                QuestionName
            }
        }));
    }

    renderItem = ({ item, index }) => {
        let rootUrl = getRootUrl();
        return (<TouchableOpacity
            key={`key${index}`}
            onPress={() => {
                //  修改前 title:item.QuestionName 
                this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl + '/appoperation/appQuestionDetail/' + item.ID, title: '帮助中心', item, reloadList: () => { } } }));
            }}
        >
            <View style={{ width: SCREEN_WIDTH, backgroundColor: 'white' }}>
                <View style={{
                    width: SCREEN_WIDTH - 26, marginHorizontal: 13
                    , minHeight: 43, borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                    , flexDirection: 'row', alignItems: 'center'
                    , justifyContent: 'space-between'
                }}>
                    <Text style={{ color: '#333333', lineHeight: 16, marginVertical: 12 }}>{`${item.QuestionName}`}</Text>
                </View>
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (<View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <View style={{
                height: 48, width: SCREEN_WIDTH
                , justifyContent: 'center', alignItems: 'center'
                , backgroundColor: '#ffffff'
            }}>
                <View style={{
                    height: 29, width: SCREEN_WIDTH - 27
                    , borderRadius: 5, backgroundColor: '#F4F4F4'
                    , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Image source={require('../../../images/ic_search_help_center.png')}
                        style={{ width: 14, height: 14, marginLeft: 10 }}
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder={'请输入问题或关键字'}
                        style={{
                            flex: 1, color: '#999999', fontSize: 14, marginLeft: 5,
                            padding: 0
                        }}
                        value={this.state.QuestionName}
                        onChangeText={text => {
                            this.setState({
                                QuestionName: text
                            });
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                        placeholderTextColor={'#999999'}
                    />
                    {/* <Text style={{flex:1,color:'#999999',fontSize:14, marginLeft:5}}>{'请输入问题或关键字'}</Text> */}
                    <View style={{ height: 22, width: 0.5, backgroundColor: '#E7E7E7' }}></View>
                    <TouchableOpacity
                        onPress={() => {
                            this.statusPageOnRefresh();
                        }}
                    >
                        <Text style={{ color: '#666666', fontSize: 14, marginHorizontal: 10 }}>{'搜索'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusPage
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
                    console.log('重新刷新');
                    this.statusPageOnRefresh();
                }}
                status={SentencedToEmpty(this.props
                    , ['QuestionDetialListResult', 'status'], 200)}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        // return this.props.unhandleTaskListData.length < this.props.unhandleTaskListTotal;
                        return false;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props, ['helpCenterData'], [])}
                />
            </StatusPage>
        </View>)
    }
}
