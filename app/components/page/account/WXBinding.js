import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import WebView from 'react-native-webview'
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getEncryptData, getToken } from '../../../dvapack/storage';

export default function WXBinding() {

    const wxBinding = useRef(null);
    const [loadOnce, setLoadOnce] = useState(true);
    let encryData = getEncryptData();
    const user = getToken();
    return (
        <View
            style={[{
                width: SCREEN_WIDTH, flex: 1
            }]}
        >
            <WebView
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
                ref={wxBinding}
                scrollEnabled={false}
                allowUniversalAccessFromFileURLs={true}
                scalesPageToFit={Platform.OS !== 'ios'}
                originWhitelist={['*']}
                // source={Platform.OS === 'ios' ? {} : { uri: 'file:///android_asset/wxBinding/index.html' }}
                source={Platform.OS === 'ios' ? {} : { uri: `file:///android_asset/wxBinding/index.html?proxyCode=${encryData}&token=${'Bearer ' + user.dataAnalyzeTicket}&userAccount=${user.UserAccount}&userPwd=${user.LocalPwd}&department=${'污染源技术服务部'}&UserId=${user.UserId}` }}
                onLoad={() => {
                    if (loadOnce) {
                        setLoadOnce(false);
                        let encryData = getEncryptData();
                        const user = getToken();
                        console.log('user = ', user);
                        let data = {
                            proxyCode: encryData,
                            token: 'Bearer ' + user.dataAnalyzeTicket,
                            userAccount: user.UserAccount,
                            userPwd: user.LocalPwd,
                            department: '污染源技术服务部',
                            UserId: user.UserId,
                        }
                        //h5加载完后 向H5发送一些上传图片需要的其它字段比如token  id等等
                        // this.refs.wxBinding.postMessage(JSON.stringify(data));
                        console.log('wxBinding = ', wxBinding);
                        wxBinding.current.postMessage(JSON.stringify(data));
                    }
                }}
            />
        </View>
    )
}