
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import { createAction, createNavigationOptions } from '../../../utils';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';

@connect(({ requestTestModel }) => ({
    url: requestTestModel.url,
    response: requestTestModel.response,
}))
export default class SetEnterpriseInformationTestPage extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '测试详情',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    render() {
        return (
            <ScrollView
                style={[{
                    width: SCREEN_WIDTH
                }]}
            >
                <View style={[{
                    width: SCREEN_WIDTH,
                }]}>
                    <View
                        style={[{ width: SCREEN_WIDTH - 42, flexDirection: 'row', flexWrap: 'wrap' }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                /**
                                 * 百度访问通过
                                 * 代理服务器访问通过
                                 * 服务器直连访问通过
                                 */
                                this.props.dispatch(
                                    createAction('requestTestModel/testGetBaidu')({})
                                );
                            }}
                        >
                            <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>测试百度</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                /**
                                 * 百度访问通过
                                 * 代理服务器访问通过
                                 * 服务器直连访问通过
                                 */
                                this.props.dispatch(
                                    createAction('requestTestModel/testGetProxy80')({})
                                );
                            }}
                        >
                            <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>代理80</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                /**
                                 * 百度访问通过
                                 * 代理服务器访问通过
                                 * 服务器直连访问通过
                                 */
                                this.props.dispatch(
                                    createAction('requestTestModel/testGetProxy5017')({})
                                );
                            }}
                        >
                            <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>代理5017</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                /**
                                 * 百度访问通过
                                 * 代理服务器访问通过
                                 * 服务器直连访问通过
                                 */
                                this.props.dispatch(
                                    createAction('requestTestModel/testGetDirect80')({})
                                );
                            }}
                        >
                            <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>直接访问80</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                /**
                                 * 百度访问通过
                                 * 代理服务器访问通过
                                 * 服务器直连访问通过
                                 */
                                this.props.dispatch(
                                    createAction('requestTestModel/testGetProxy5017AppConfig')({})
                                );
                            }}
                        >
                            <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>AppConfig</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text>{`url:${this.props.url}`}</Text>
                    <Text style={[{ lineHeight: 20 }]}>{`response:${this.props.response}`}</Text>
                </View>
            </ScrollView>
        )
    }
}