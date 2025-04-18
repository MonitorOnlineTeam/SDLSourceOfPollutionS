/*
 * @Description:
 * @LastEditors: outman0611 jia_anbo@163.com
 * @Date: 2020-08-26 09:28:38
 * @LastEditTime: 2025-04-18 15:24:12
 * @FilePath: /SDLSourceOfPollutionS_dev/app/components/CusWebView.js
 */
//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

import globalcolor from '../config/globalcolor';
import { NavigationActions, SentencedToEmpty, createAction, createNavigationOptions } from '../utils';
import { getToken } from '../dvapack/storage';

const enterpriseUser = 0;
const operationsStaff = 1;

// create a component
@connect()
class CusWebView extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: navigation.state.params.title || '表单',
            tabBarLable: navigation.state.params.title,
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }, //标题居中
            labelStyle: { fontSize: 14 }
        });

    constructor(props) {
        super(props);
        this.state = {
            scalingEnabled: true
            // IsSign:this.props.navigation.state.params.item.IsSign,
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props, ['route', 'params', 'params', 'title'], '详情')
        });
    }

    render() {
        let url = 'https://www.baidu.com';
        console.log('props = ', this.props);
        console.log('props = ', this.props.route.params.params.CusUrl);
        url = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'CusUrl']
            , 'https://www.baidu.com'
        );
        if (this.props.navigation.state.params && this.props.navigation.state.params.CusUrl && this.props.navigation.state.params.CusUrl != '') {
            url = this.props.navigation.state.params.CusUrl;
        }
        let Ticket = getToken().dataAnalyzeTicket;
        url = url + '?Ticket=' + Ticket;
        // console.log('url = ', url);
        return (
            <View style={styles.container}>
                <WebView
                    style={{ backgroundColor: '#ffffff' }}
                    ref={ref => (this._webview = ref)}
                    source={{ uri: url, method: 'GET', headers: { 'Cache-Control': 'no-cache' } }}
                    scalesPageToFit={this.state.scalingEnabled}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
                    useWebKit={true}
                />
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    }
});

//make this component available to the app
export default CusWebView;
