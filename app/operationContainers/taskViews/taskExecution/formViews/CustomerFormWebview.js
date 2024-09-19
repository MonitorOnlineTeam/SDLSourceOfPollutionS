//import liraries
import React, { PureComponent } from 'react';
import { View, Platform, StyleSheet, WebView, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import globalcolor from '../../../../config/globalcolor';
import { NavigationActions, createAction } from '../../../../utils';
import { getToken } from '../../../../dvapack/storage';

/**
 * 网页展示任务表单（非执行人查看）
 */
@connect()
class CustomerFormWebview extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        if (navigation.state.params && navigation.state.params.title) {
            return {
                title: navigation.state.params.title,
                tabBarLable: navigation.state.params.title,
                animationEnabled: false,
                headerBackTitle: null,
                headerTintColor: '#ffffff',
                headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }, //标题居中
                headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 45 },
                labelStyle: { fontSize: 14 }
            };
        } else {
            return {
                title: '表单',
                tabBarLable: '表单',
                animationEnabled: false,
                headerBackTitle: null,
                headerTintColor: '#ffffff',
                headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 }, //标题居中
                headerStyle: { backgroundColor: globalcolor.headerBackgroundColor, height: 45 },
                labelStyle: { fontSize: 14 }
            };
        }
    };
    constructor(props) {
        let user = getToken();
        super(props);
        this.state = {
            scalingEnabled: true,
            RoleEnum: user.RoleEnum,
            IsSign: this.props.navigation.state.params.item.IsSign
        };
    }

    render() {
        let url = 'http://172.16.12.35:8013/development/h5/Knowledge.html';
        if (this.props.navigation.state.params && this.props.navigation.state.params.FormUrl && this.props.navigation.state.params.FormUrl != '') {
            url = this.props.navigation.state.params.FormUrl;
        }
        console.log(url);
        return (
            <View style={styles.container}>
                <WebView
                    useWebKit={true}
                    style={{ backgroundColor: '#ffffff', width: '100%', flex: 1 }}
                    ref={ref => (this._webview = ref)}
                    source={{ uri: url }}
                    scalesPageToFit={this.state.scalingEnabled}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
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
export default CustomerFormWebview;
