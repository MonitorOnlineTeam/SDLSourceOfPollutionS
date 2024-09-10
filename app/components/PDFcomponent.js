import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, Platform, ActivityIndicator, NativeAppEventEmitter, NativeModules, NativeEventEmitter } from 'react-native';
import { NavigationActions } from '../utils';
import PDFView from 'react-native-pdf-view';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import OpenFile from 'react-native-doc-viewer';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

@connect()
export default class PDFcomponent extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            title: `查看报告`,
            tabBarLable: '查看报告',
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: { alignSelf: 'center', marginRight: Platform.OS === 'android' ? 76 : 0 }, //标题居中
            headerStyle: { backgroundColor: 'blue', height: 45 },
            labelStyle: { fontSize: 14 }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            isPdfDownload: false,
            animating: true,
            progress: '',
            back: false
        };
        this.pdfView = null;
        this.pdfPath = RNFS.DocumentDirectoryPath + '/pollutant.pdf';
        this.eventEmitter = new NativeEventEmitter(NativeModules.RNReactNativeDocViewer);
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            OpenFile.openDoc(
                [
                    {
                        url: this.props.navigation.state.params.pdfDownloadURL,
                        fileNameOptional: this.props.navigation.state.params.ReportName
                    }
                ],
                (error, url) => {
                    if (error) {
                        this.setState({ animating: false });
                    } else {
                        this.setState({ animating: false });
                    }
                }
            );
            this.eventEmitter.addListener('DoneButtonEvent', data => {
                /*
                 *Done Button Clicked
                 * return true
                 */

                if (this.state.back == true) {
                } else {
                    this.setState({ back: true });
                    this.props.dispatch(NavigationActions.back());
                }
            });
            this.eventEmitter.addListener('RNDownloaderProgress', Event => {
                // console.log("Progress - Download "+Event.progress  + " %")
                // this.setState({progress: Event.progress.toFixed(2)-1 + " %"});
            });
        } else {
            const options = {
                fromUrl: this.props.navigation.state.params.pdfDownloadURL,
                toFile: this.pdfPath
            };

            RNFS.downloadFile(options)
                .promise.then(res => {
                    this.setState({ isPdfDownload: true });
                })
                .catch(err => {
                    // console.log(err);
                });
        }
    }
    componentDidMount() { }
    zoom(val = 2.1) {
        this.pdfView &&
            setTimeout(() => {
                this.pdfView.setNativeProps({ zoom: val });
            }, 3000);
    }
    componentWillUnmount() {
        this.eventEmitter.removeListener();
    }
    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.container}>
                    <ActivityIndicator animating={this.state.animating} />
                    {/* <Text>{this.state.progress}</Text> */}
                </View>
            );
        } else {
            if (!this.state.isPdfDownload) {
                return (
                    <View style={styles.container}>
                        <Text>Downloading</Text>
                    </View>
                );
            } else {
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

        // return(
        //   <View style={styles.container}>
        //       <Text>ok</Text>
        //     </View>
        // )
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
