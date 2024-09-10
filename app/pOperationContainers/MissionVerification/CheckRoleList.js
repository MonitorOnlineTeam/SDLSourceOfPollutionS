import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform, Image, TextInput, TouchableOpacity } from 'react-native';
import { Button, StatusPage, Contact, LineSelectBar } from '../../components';
import { connect } from 'react-redux';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
import { CURRENT_PROJECT } from '../../config';
import { SCREEN_WIDTH } from '../../components/SDLPicker/constant/globalsize';
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
@connect(({ abnormalTask }) => ({
    checkUserList: abnormalTask.checkUserList
}))
class CheckRoleList extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '用户名册',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    constructor(props) {
        super(props);
        this.state = {
            searchResult: []
        };
    }
    _renderItemList = item => {
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
                <Image source={require('../../images/yunweiren.png')} style={{ marginLeft: 20, width: 30, height: 30 }} />
                <View style={{ flexDirection: 'column' }}>
                    <Text style={[{ marginLeft: 10, color: '#666666' }]}>{item.item.UserName}</Text>
                    {/* <Text style={[{ marginLeft: 10, marginTop: 5, color: '#999999' }]}>{item.item.UserID}</Text> */}
                </View>
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        this.onFreshData();
    }

    searchData = text => {
        let searchArr = [];
        this.props.checkUserList.map(item => {
            if (item.UserName.indexOf(text) > -1) {
                searchArr.push(item);
            }
        });
        this.setState({
            searchResult: searchArr
        });
    };
    onFreshData = () => {
        this.props.dispatch(createAction('abnormalTask/GetCheckRoleDatas')({}));
    };
    render() {
        return (
            <StatusPage
                status={1}
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
                <Contact
                    renderAllPy
                    renderItem={this._renderItemList}
                    searchResult={this.state.searchResult}
                    renderSearchItem={this._renderItemList}
                    SearchCallback={item => {
                        //搜索按钮的回调
                        this.searchData(item);
                    }}
                    flatData={this.props.checkUserList} //sectionList数据
                    ListHeaderComponent={null}
                    ListHeaderComponentHeight={0}
                    ItemHeight={50}
                />
            </StatusPage>
        );
    }
}

export default CheckRoleList;
