/*
 * @Description: 搜索列表 无加载
 * @LastEditors: hxf
 * @Date: 2023-11-07 10:06:19
 * @LastEditTime: 2024-11-11 14:29:02
 * @FilePath: /SDLSourceOfPollutionS/app/components/page/SearchListWithoutLoad.js
 */
import { Text, View, TouchableOpacity, TextInput, Image, Platform } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../config/globalsize'
import { connect } from 'react-redux';
import { NavigationActions, SentencedToEmpty, createNavigationOptions } from '../../utils';
import { ScrollView } from 'react-native';
import LineSelectBar from '../LineSelectBar';
import globalcolor from '../../config/globalcolor';

@connect()
export default class SearchListWithoutLoad extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '请选择'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            changeText: '',
            searchText: ''
        };
    }

    render() {
        const getDataFun = SentencedToEmpty(this.props.route, ['params', 'params', 'getDataFun'], () => { return []; })
        const callback = SentencedToEmpty(this.props.route, ['params', 'params', 'callback'], () => { return []; })
        const showTextNames = SentencedToEmpty(this.props.route, ['params', 'params', 'showTextNames'], [])
        const searchPlaceHolder = SentencedToEmpty(this.props.route, ['params', 'params', 'searchPlaceHolder'], '搜索名称')
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <View
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
                    <TextInput
                        onFocus={() => { }}
                        underlineColorAndroid="transparent"
                        placeholder={searchPlaceHolder}
                        placeholderTextColor={'#999999'}
                        style={{
                            textAlign: 'center',
                            width: SCREEN_WIDTH - 40,
                            borderColor: '#cccccc',
                            borderWidth: 0.5,
                            borderRadius: 15,
                            height: 30,
                            backgroundColor: '#fff',
                            paddingVertical: 0
                        }}
                        onChangeText={text => {
                            this.setState({
                                changeText: text,
                                searchText: text
                            });
                        }}
                        clearButtonMode="while-editing"
                        ref="keyWordInput"
                    />
                    {Platform.OS == 'andriod' ? (
                        <TouchableOpacity
                            style={{ left: -30 }}
                            onPress={() => {
                                this.setState({
                                    changeText: '',
                                    searchText: ''
                                });
                            }}
                        >
                            <Image source={require('../../images/clear.png')} style={{ width: 15, height: 15 }} />
                            {/* <Text style={{ color: '#fff', fontSize: 14,marginRight:10 }}>{'搜索'}</Text> */}
                        </TouchableOpacity>
                    ) : null}
                </View>
                {/* <View
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
                            source={require('../../images/ic_search_help_center.png')}
                        />
                        <TextInput
                            style={[{
                                flex: 1
                                , paddingVertical: 0
                                , marginHorizontal: 5
                            }]}
                            placeholder={searchPlaceHolder}
                            onChangeText={(text) => {
                                if (text == '') {
                                    this.setState({
                                        changeText: text,
                                        searchText: text
                                    });
                                } else {
                                    this.setState({
                                        changeText: text
                                    });
                                }

                            }}
                        >{SentencedToEmpty(this.props, ['projectInfoListSearchStr'], '')}</TextInput>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    searchText: this.state.changeText
                                });
                                // this.props.dispatch(createAction('CTModel/GetCheckInProjectList')({}));
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
                </View> */}
                <ScrollView style={[{ width: SCREEN_WIDTH, marginTop: 8 }]}>
                    {
                        getDataFun().map((item, index) => {
                            const findIndex = SentencedToEmpty(item, showTextNames, '').indexOf(this.state.searchText);
                            if (findIndex != -1) {
                                return <TouchableOpacity
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
                                        this.props.dispatch(NavigationActions.back());
                                        callback(item);
                                    }}
                                >
                                    <Text style={[{ marginLeft: 20, color: '#666666' }]}>{SentencedToEmpty(item, showTextNames, '---')}</Text>
                                </TouchableOpacity>
                            }
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}