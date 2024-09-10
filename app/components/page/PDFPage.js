/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2020-08-26 09:28:38
 * @LastEditTime: 2024-07-01 19:03:15
 * @FilePath: /SDLMainProject37_1/app/components/page/PDFPage.js
 */
import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Platform } from 'react-native';
import PDFView from 'react-native-pdf-view';
import RNFS from 'react-native-fs';

import { createNavigationOptions, ShowToast } from '../../utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default class PDFPage extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: `${navigation.state.params.ReportName} 查看报告`,
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            isPdfDownload: false,
            isDownloadFail: false
        };
        this.pdfView = null;
        this.pdfPath = RNFS.DocumentDirectoryPath + '/resport.pdf';
    }
    componentDidMount() {
        const options = {
            fromUrl: this.props.navigation.state.params.pdfDownloadURL,
            toFile: this.pdfPath
        };
        RNFS.downloadFile(options)
            .promise.then(res => {
                if (res.statusCode == 200) {
                    this.setState({ isPdfDownload: true, isDownloadFail: false });
                } else {
                    this.setState({ isDownloadFail: true });
                    ShowToast('文档获取失败');
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    zoom(val = 2.1) {
        this.pdfView &&
            setTimeout(() => {
                this.pdfView.setNativeProps({ zoom: val });
            }, 3000);
    }
    render() {
        if (this.state.isDownloadFail) {
            return (
                <View style={styles.container}>
                    <Text>下载失败</Text>
                </View>
            );
        }

        if (!this.state.isPdfDownload) {
            return (
                <View style={styles.container}>
                    <Text>加载中...</Text>
                </View>
            );
        }
        return (
            <PDFView
                ref={pdf => {
                    this.pdfView = pdf;
                }}
                key="sop"
                path={this.pdfPath}
                onLoadComplete={pageCount => { }}
                style={styles.pdf}
            />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdfcontainer: {
        flex: 1,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH
    },
    pdf: {
        flex: 1,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH
    }
});
