/*
 * @Description: 企业选择组件
 * @LastEditors: hxf
 * @Date: 2022-03-23 15:32:16
 * @LastEditTime: 2022-03-23 16:11:52
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbench/SelectEnterpriseList.js
 */
/**
 * 企业选择相关修改需要关注
 * ../../../operationContainers/taskViews/ContactOperation
 * 可能需要同时修改
 */
import React, { Component } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { Contact, StatusPage } from '../../../components';
import { createAction, createNavigationOptions, NavigationActions } from '../../../utils';

@connect(({ app, taskModel }) => ({
    enterpriseData: app.enterpriseData,
    enterpriseSearchData: app.enterpriseSearchData,
}))
export default class SelectEnterpriseList extends Component {

    static navigationOptions = ({ navigation }) =>
    createNavigationOptions({
        title: '企业列表',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
    
    constructor(props) {
        super(props);
        this.state = {
            targetType: '1'
        };
    }

    componentDidMount() {
        this.onFreshData();
    }

    onFreshData = () => {
        this.props.dispatch(
            createAction('app/getEnterpriseType')({
                params: {
                    targetType: this.state.targetType
                }
            })
        );
    };

    _renderItemList = item => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 45,
                    alignItems: 'center',
                    marginBottom: 1,
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    this.props.dispatch(
                        createAction('app/updateState')({
                            selectEnterprise: item.item
                        })
                    );
                    if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                        this.props.navigation.state.params.callback(item.item);
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ marginLeft: 20, color: '#666666' }]}>{item.item.EntName}</Text>
            </TouchableOpacity>
        );
    };

    _renderSearchItem = item => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 45,
                    alignItems: 'center',
                    marginBottom: 10,
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    if (this.props.navigation.state.params.selectType == 'enterprise') {
                        this.props.dispatch(
                            createAction('app/updateState')({
                                selectEnterprise: item.item
                            })
                        );
                    } else {
                        this.props.dispatch(
                            createAction('taskModel/updateState')({
                                selectTransUser: item.item
                            })
                        );
                    }
                    if (this.props.navigation.state.params.callback && typeof this.props.navigation.state.params.callback != 'undefined') {
                        this.props.navigation.state.params.callback(item.item);
                        this.props.dispatch(NavigationActions.back());
                        return;
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ marginLeft: 20, color: '#666666' }]}>{item.item.EntName}</Text>
            </TouchableOpacity>
        );
    };

    searchData = item => {
        this.props.dispatch(
            createAction('app/searchEnterpriseType')({
                params: {
                    EntName: item,
                    targetType: this.state.targetType
                }
            })
        );
    };

    render() {
        return (
            <View style={{flex:1}}>
                <StatusPage
                    status={this.props.enterpriseData.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.onFreshData();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.onFreshData();
                    }}
                >
                    {this.props.enterpriseData.status == 200 ? (
                        <Contact
                            secType={this.props.navigation.state.params.selectType} //查询页面的类型，默认不传是带右侧索引的带分组的，如不需要索引和分组传任意字符
                            flatData={this.props.enterpriseData.data.data} //FlatList数据
                            renderItem={this._renderItemList}
                            searchResult={this.props.enterpriseSearchData.data ? this.props.enterpriseSearchData.data.data : []}
                            renderSearchItem={this._renderSearchItem}
                            SearchCallback={item => {
                                //搜索按钮的回调
                                this.searchData(item);
                            }}
                            ListHeaderComponent={null}
                            ListHeaderComponentHeight={0}
                            ItemHeight={50}
                        />
                    ) : null}
                </StatusPage>
            </View>
        )
    }
}
