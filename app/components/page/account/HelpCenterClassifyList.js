/*
 * @Description: 帮助中心 分类列表
 * @LastEditors: hxf
 * @Date: 2022-09-28 11:15:22
 * @LastEditTime: 2023-02-27 16:42:53
 * @FilePath: /SDLMainProject/app/components/page/account/HelpCenterClassifyList.js
 */
import React, { Component } from 'react'
import { Platform, Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getRootUrl } from '../../../dvapack/storage';
import { createAction, createNavigationOptions, SentencedToEmpty, NavigationActions } from '../../../utils';
import FlatListWithHeaderAndFooter from '../../FlatListWithHeaderAndFooter';
import { StatusPage } from '../../StatusPages';

@connect(({ helpCenter })=>({
    QuestionDetialListResult:helpCenter.QuestionDetialListResult,
    helpCenterData:helpCenter.helpCenterData,
    helpCenterTotal:helpCenter.helpCenterTotal,
}))
export default class HelpCenterClassifyList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '帮助中心'),
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    componentDidMount() {
        this.statusPageOnRefresh();
    }
    statusPageOnRefresh = () => {
        let secondLevel = this.props.navigation.state.params.secondLevel;// 由前一级传入
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex:1,
                QuestionDetialListResult:{status:-1},
                firstLevel:515
            })
        );
        this.props.dispatch(createAction('helpCenter/getHelpCenterList')({
            params:{ firstLevel:secondLevel }
            // params:{ secondLevel }
        }))
    }

    onRefresh = () => {
        this.nextPage(1);
    }

    nextPage = (index) => {
        let secondLevel = this.props.navigation.state.params.secondLevel;// 由前一级传入
        this.props.dispatch(
            createAction('helpCenter/updateState')({
                helpCenterPageIndex:index,
            })
        );
        // this.props.dispatch(createAction('helpCenter/getNoticeContentList')({ 
        //     setListData: this.list.setListData,
        //     params:{
        //         secondLevel
        //     }
        // }));
        this.props.dispatch(createAction('helpCenter/getHelpCenterList')({
            setListData: this.list.setListData,
            params:{ firstLevel:secondLevel }
        }))
    }

    renderItem = ({item,index}) => {
        let rootUrl = getRootUrl();
        return(<TouchableOpacity
            key={`key${index}`}
            onPress={()=>{
                //  修改前 title:item.QuestionName
                this.props.dispatch(NavigationActions.navigate({ routeName: 'CusWebView', params: { CusUrl: rootUrl.ReactUrl+'/appoperation/appQuestionDetail/'+item.ID, title: '帮助中心', item, reloadList: () => {} } }));
            }}
        >
            <View style={{width:SCREEN_WIDTH,backgroundColor:'white'}}>
                <View style={{width:SCREEN_WIDTH-26,marginHorizontal:13
                , minHeight:43, borderBottomWidth:1, borderBottomColor:'#E7E7E7'
                , flexDirection:'row', alignItems:'center'
                , justifyContent:'space-between'}}>
                    <Text style={{ lineHeight:16, marginVertical:12}}>{`${item.QuestionName}`}</Text>
                </View>
            </View>
        </TouchableOpacity>);
    }

    render() {
        return (
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
                ,['QuestionDetialListResult','status'],200)}
            >
                <FlatListWithHeaderAndFooter
                    style={[{ backgroundColor: '#f2f2f2' }]}
                    ref={ref => (this.list = ref)}
                    ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 0, backgroundColor: '#f2f2f2' }]} />}
                    pageSize={20}
                    hasMore={() => {
                        return this.props.helpCenterData.length < this.props.helpCenterTotal;
                    }}
                    onRefresh={index => {
                        this.onRefresh(index);
                    }}
                    onEndReached={index => {
                        this.nextPage(index);
                    }}
                    renderItem={this.renderItem}
                    data={SentencedToEmpty(this.props,['helpCenterData'],[])}
                />
            </StatusPage>
        )
    }
}
