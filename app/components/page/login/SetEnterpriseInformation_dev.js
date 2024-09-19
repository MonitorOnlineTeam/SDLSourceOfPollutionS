//import liraries
import React, { Component } from 'react';
import { Image, View, Text, StyleSheet, Button, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { SCREEN_WIDTH, WINDOW_HEIGHT } from '../../../config/globalsize';
import globalcolor from '../../../config/globalcolor';
import { createAction, ShowToast } from '../../../utils';
import { NavigationActions } from '../../../utils/RouterUtils';
// import SimpleLoadingComponent from '../../SimpleLoadingComponent';

// create a component
// @connect(({ loading }) => ({
//     submitLoading: loading.effects['app/getEnterpriseConfig']
// }))
/**
 * 根据权限码 获取服务器信息
 */
@connect(({ app }) => ({
    networkTest: app.networkTest,
}))
class SetEnterpriseInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            str: '',
            dataArray: [],
            select: 0,
            contentHeight: 0,
            showTestButton: false,
        };
    }

    static navigationOptions = {
        header: null,
        title: '',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 0 }
    };

    _onFocus = index => {
        this.setState({ select: index });
    };

    _onChange = (str, index) => {
        let array = this.state.dataArray;
        if (this['text' + index].isFocused() && str == 'Backspace' && array[index] != '' && typeof array[index] != 'undefined') {
            array[index] = '';
            let newArray = array.slice();
            if (index > 0) {
                this['text' + (index - 1)].focus();
                this.setState({ select: index - 1, dataArray: newArray });
            } else {
                this.setState({ dataArray: newArray });
            }
        } else {
            if (str != 'Backspace' && str != '' && str != array[index]) {
                array[index] = str;
                let newArray = array.slice();
                if (index == 4) {
                    this.setState({ dataArray: newArray });
                } else {
                    this['text' + (index + 1)].focus();
                    this.setState({ dataArray: newArray, select: index + 1 });
                }
            }
        }
    };

    /**
     * 调整界面高度
     */
    scrollViewLayout = event => {
        if (Platform.OS === 'ios') {
            this.setState({ contentHeight: WINDOW_HEIGHT - 64 });
        } else if (this.state.contentHeight == 0) {
            this.setState({ contentHeight: event.nativeEvent.layout.height });
        }
    };



    onPress = e => {
        console.log('e = ', e);
    };

    render() {
        return (
            <ScrollView style={{ flex: 1, width: SCREEN_WIDTH }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onLayout={event => {
                    this.scrollViewLayout(event);
                }}
            >
                <ImageBackground source={require('../../../images/background_blue.png')} style={[{ width: '100%' }, { height: this.state.contentHeight }]}>
                    <ImageBackground source={require('../../../images/bacground_grey.png')} opacity={0.6} style={[{ width: '100%' }, { height: this.state.contentHeight }]}>
                        <View style={[{ flex: 1, width: SCREEN_WIDTH }]}>

                            <TouchableOpacity onPress={() => { }} style={styles.container}>
                                <Text
                                    style={[
                                        {
                                            color: globalcolor.whiteFont,
                                            fontSize: 24,
                                            marginBottom: 40
                                        }
                                    ]}
                                >
                                    请输入授权码
                                </Text>
                                {/* <Text>企业用户通过录入或扫码设置企业的ip</Text> */}
                                <KeyboardAvoidingView style={[{ alignItems: 'center' }]}>
                                    <View
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                width: SCREEN_WIDTH,
                                                height: 64,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <TextInput
                                            ref={ref => {
                                                this.text4 = ref;
                                            }}
                                            style={[
                                                {
                                                    height: 48,
                                                    width: 240,
                                                    backgroundColor: globalcolor.white,
                                                    textAlign: 'center'
                                                }
                                            ]}
                                            maxLength={5}
                                            onChangeText={str => {
                                                if (str.length <= 5) {
                                                    this.setState({
                                                        str
                                                    });
                                                }
                                            }}
                                            value={this.state.str}
                                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.button, { backgroundColor: globalcolor.white }, { marginTop: 100 }]}
                                        onPress={() => {
                                            let isPass = true;
                                            if (this.state.str.length == 5) {
                                                let authorizationCode = this.state.str;
                                                this.props.dispatch(
                                                    createAction('login/getEnterpriseConfig')({
                                                        AuthCode: authorizationCode
                                                    })
                                                );
                                            } else {
                                                ShowToast('请输入完整的授权码,当前授权码为' + this.state.str);
                                            }
                                            // this.props.dispatch(
                                            //     NavigationActions.navigate({ routeName: 'Login' })
                                            // );
                                        }}
                                    >
                                        <View style={styles.button}>
                                            <Text style={[{ color: globalcolor.blue, fontSize: 20 }]}>确认</Text>
                                        </View>
                                    </TouchableOpacity>
                                </KeyboardAvoidingView>
                            </TouchableOpacity>
                            <View style={[{ width: SCREEN_WIDTH, flexDirection: 'row' }]}>
                                {this.props.networkTest ? <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            showTestButton: !this.state.showTestButton
                                        })
                                    }}
                                >
                                    <Image
                                        style={[{ width: 32, height: 32, marginRight: 10 }]}
                                        source={
                                            this.state.showTestButton ?
                                                require('../../../images/icon_correct.png')
                                                : require('../../../images/icon_close_red.png')}
                                    />
                                </TouchableOpacity> : null}
                                {this.state.showTestButton ? <View
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
                                    <TouchableOpacity
                                        onPress={() => {
                                            /**
                                             * 百度访问通过
                                             * 代理服务器访问通过
                                             * 服务器直连访问通过
                                             */
                                            this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'SetEnterpriseInformationTestPage',
                                                    params: {

                                                    }
                                                }))
                                        }}
                                    >
                                        <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                            <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>测试页面</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.dispatch(
                                                NavigationActions.navigate({
                                                    routeName: 'OfflineImageUploadTest',
                                                    params: {

                                                    }
                                                }))
                                        }}
                                    >
                                        <View style={[{ height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 8 }]}>
                                            <Text style={[{ color: globalcolor.blue, fontSize: 14, marginHorizontal: 10 }]}>测试页面</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> : null}
                            </View>
                        </View>
                    </ImageBackground>
                </ImageBackground>
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        // backgroundColor: '#7CB9FC',
    },
    button: {
        height: 56,
        width: SCREEN_WIDTH - 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    }
});

//make this component available to the app
export default SetEnterpriseInformation;
