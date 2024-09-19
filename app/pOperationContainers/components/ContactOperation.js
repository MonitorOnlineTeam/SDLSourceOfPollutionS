/**
 * 企业选择相关修改需要关注
 * ../../pOperationContainers/tabView/workbench/SelectEnterpriseList
 * 可能需要同时修改
 */
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button, StatusPage, Contact, LineSelectBar } from '../../components';
import { connect } from 'react-redux';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
import { CURRENT_PROJECT } from '../../config';
import { SCREEN_WIDTH } from '../../config/globalsize';
let platformContainerStyles;
if (Platform.OS === 'ios') {
    platformContainerStyles = {
        backgroundColor: '#49a1fe',
        height: 45,
        borderBottomWidth: 0, //修改的地方
        borderBottomColor: '#A7A7AA'
    };
} else {
    platformContainerStyles = {
        backgroundColor: '#49a1fe',
        height: 45,
        elevation: 0
    };
}
@connect(({ app, taskModel }) => ({
    enterpriseData: app.enterpriseData,
    enterpriseSearchData: app.enterpriseSearchData,
    selectableMaintenanceStaff: taskModel.selectableMaintenanceStaff,
    searchtableMaintenanceStaff: taskModel.searchtableMaintenanceStaff
}))
class ContactOperation extends Component {
    // static navigationOptions = ({ navigation }) =>
    //     createNavigationOptions({
    //         title: route.params.params.selectType == 'enterprise' ? '监测目标' : '用户名册',
    //         headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    //     });
    constructor(props) {
        super(props);
        this.state = {
            targetType: '1'
        };
    }
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
                    if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                        this.props.route.params.params.callback(item.item);
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Text style={[{ marginLeft: 20, color: '#666666' }]}>{item.item.EntName}</Text>
            </TouchableOpacity>
        );
    };

    _rendersecItemList = item => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 50,
                    marginBottom: 1,
                    alignItems: 'center'
                }}
                onPress={() => {
                    if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                        this.props.route.params.params.callback(item.item);
                        this.props.dispatch(NavigationActions.back());
                        return;
                    }
                    if (SentencedToEmpty(this.props.navigation, ['state', 'params', 'callFrom'], '') == 'addHelper') {
                        if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                            this.props.route.params.params.callback(item.item);
                        }
                    } else {
                        this.props.dispatch(
                            createAction('taskModel/updateState')({
                                selectTransUser: item.item
                            })
                        );
                        if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                            this.props.route.params.params.callback(item.item);
                        }
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Image source={require('../../images/yunweiren.png')} style={{ marginLeft: 20, width: 30, height: 30 }} />
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{ marginLeft: 10, color: '#666666' }]}>{item.item.title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={[{ marginLeft: 10, color: '#999999' }]}>{item.item.UserGroup_Name}</Text>
                        <Text style={[{ marginLeft: 10, color: '#999999' }]}>{item.item.User_Number}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    _renderSearchItem = item => {
        return (
            <TouchableOpacity
                style={{
                    // flexDirection: 'row',
                    // backgroundColor: '#ffffff',
                    // flex: 1,
                    // minHeight: 45,
                    // alignItems: 'center',
                    // marginBottom: 10,
                    // justifyContent: 'space-between'
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 45,
                    alignItems: 'center',
                    marginBottom: 1,
                    justifyContent: 'space-between'
                }}
                onPress={() => {
                    if (this.props.route.params.params.selectType == 'enterprise') {
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
                    if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                        this.props.route.params.params.callback(item.item);
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
    _rendersecSearchItem = item => {
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 50,
                    marginBottom: 1,
                    alignItems: 'center'
                }}
                onPress={() => {
                    item.item.title = item.item.User_Name;
                    this.props.dispatch(
                        createAction('taskModel/updateState')({
                            selectTransUser: item.item
                        })
                    );
                    if (this.props.route.params.params.callback && typeof this.props.route.params.params.callback != 'undefined') {
                        this.props.route.params.params.callback(item.item);
                        this.props.dispatch(NavigationActions.back());
                        return;
                    }
                    this.props.dispatch(NavigationActions.back());
                }}
            >
                <Image source={require('../../images/yunweiren.png')} style={{ marginLeft: 20, width: 30, height: 30 }} />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={[{ marginLeft: 10, color: '#666666' }]}>{item.item.User_Name}</Text>
                    <Text style={[{ marginLeft: 10, marginTop: 5, color: '#999999' }]}>{item.item.UserGroup_Name}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    componentDidMount() {
        this.onFreshData();
    }
    onFreshData = () => {
        if (this.props.route.params.params.selectType == 'enterprise') {
            this.props.dispatch(
                createAction('app/getEnterpriseType')({
                    params: {
                        targetType: this.state.targetType
                    }
                })
            );
        } else {
            this.props.dispatch(
                createAction('taskModel/getPersonGroup')({
                    params: {
                        UserName: ''
                    }
                })
            );
        }
    };
    searchData = item => {
        if (this.props.route.params.params.selectType == 'enterprise') {
            this.props.dispatch(
                createAction('app/searchEnterpriseType')({
                    params: {
                        EntName: item,
                        targetType: this.state.targetType
                    }
                })
            );
        } else {
            this.props.dispatch(
                createAction('taskModel/searchPersonGroup')({
                    params: {
                        UserName: item
                    }
                })
            );
        }
    };
    render() {
        if (this.props.route.params.params.selectType == 'enterprise') {
            return (
                <View style={{ flex: 1 }}>
                    {false && CURRENT_PROJECT == 'POLLUTION_ORERATION_PROJECT' && this.props.route.params.params.isCreatTask == true ? (
                        <LineSelectBar
                            scrollable={false}
                            defaultSelectArray={[0]}
                            contentWidth={SCREEN_WIDTH}
                            isMultiple={false}
                            disCursor={true}
                            creactItemFun={(item, key, selectArray, isMultiple) => {
                                return (
                                    <View
                                        style={[
                                            {
                                                height: 45,
                                                width: SCREEN_WIDTH / 2,
                                                marginHorizontal: 4,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderBottomColor: selectArray.indexOf(key) != -1 && isMultiple ? SentencedToEmpty(item, ['selectColor'], '#00000000') : '#00000000'
                                            }
                                        ]}
                                    >
                                        <Text style={[{ fontSize: 15, color: selectArray.indexOf(key) != -1 ? SentencedToEmpty(item, ['selectColor'], '#00000000') : '#666' }]}>{item.showValue}</Text>
                                    </View>
                                );
                            }}
                            callBack={(item, array) => {
                                this.props.dispatch(
                                    createAction('app/getEnterpriseType')({
                                        params: {
                                            targetType: item.value
                                        }
                                    })
                                );
                                this.setState({ targetType: item.value });
                            }}
                            data={[{ showValue: '查找企业', value: '1', selectColor: '#4c9fff' }, { showValue: '查找大气站', value: '2', selectColor: '#4c9fff' }]}
                        />
                    ) : null}
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
                                secType={this.props.route.params.params.selectType} //查询页面的类型，默认不传是带右侧索引的带分组的，如不需要索引和分组传任意字符
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
            );
        } else {
            return (
                <StatusPage
                    status={this.props.selectableMaintenanceStaff.status}
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
                    {this.props.selectableMaintenanceStaff.status == 200 ? (
                        <Contact
                            renderAllPy
                            secType={this.props.route.params.params.selectType} //查询页面的类型，默认不传是带右侧索引的带分组的，如不需要索引和分组传任意字符
                            renderItem={this._rendersecItemList}
                            searchResult={this.props.searchtableMaintenanceStaff.data ? this.props.searchtableMaintenanceStaff.data.data : []}
                            renderSearchItem={this._rendersecSearchItem}
                            SearchCallback={item => {
                                //搜索按钮的回调
                                this.searchData(item);
                            }}
                            sections={this.props.selectableMaintenanceStaff.data.data} //sectionList数据
                            ListHeaderComponent={null}
                            ListHeaderComponentHeight={0}
                            ItemHeight={50}
                        />
                    ) : null}
                </StatusPage>
            );
        }
    }
}

export default ContactOperation;
