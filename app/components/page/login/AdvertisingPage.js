/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-09-01 18:09:52
 * @LastEditTime: 2023-04-15 15:34:00
 * @FilePath: /SDLMainProject34/app/components/page/login/AdvertisingPage.js
 */
import React, { Component } from 'react'
import { Platform, ScrollView, Text, View, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, CameraRoll } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createNavigationOptions, StackActions, NavigationActions, createAction, SentencedToEmpty, ShowToast } from '../../../utils';

@connect(({baseModel})=>({
    maintain:baseModel.maintain,
    maintenanceResult:baseModel.maintenanceResult
}))
export default class AdvertisingPage extends Component {

    static navigationOptions = createNavigationOptions({
        title: '公告',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            modalVisible: false
        };
    }

    componentWillUnmount(){
        console.log('componentWillUnmount');
        this.props.dispatch(createAction('baseModel/updateState')({showAdvertising:false}))
        if (this.props.maintain) {
            this.props.dispatch(
                StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'OperationalSystemNotice'
                    , params:{
                        ...SentencedToEmpty(this.props.maintenanceResult,['data','maintenance'],{})
                    } })]
                })
            );
        } else {
            this.props.dispatch(
                StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Login' })]
                })
            );
        }
    }

    render() {
        return (<ScrollView style={{width:SCREEN_WIDTH, flex:1}}>
            <View style={{width:SCREEN_WIDTH}}>
                <Text style={{marginTop:15,marginLeft:13.5
                ,color:'#333333',fontSize:14}}>{'关于开通企业业主账户通知'}</Text>
                <Text style={{marginTop:20,marginLeft:13.5
                ,color:'#666666',fontSize:11}}>{'智慧环保研究院污染源产品组'}</Text>
                <Text style={{marginTop:7,marginLeft:13.5
                ,color:'#A2A0A0',fontSize:9}}>{'2022.08.30 14:20'}</Text>
                <View style={{width:SCREEN_WIDTH-27,height:(SCREEN_WIDTH-27)*2332/1400
                    ,marginBottom:10, marginLeft:13.5, marginTop:15}}>
                    <TouchableWithoutFeedback
                        onPress={()=>{
                            this.setState({modalVisible:true});
                        }}
                        style={{width:SCREEN_WIDTH-27,height:(SCREEN_WIDTH-27)*2332/1400}}
                    >
                        <Image 
                            style={{width:SCREEN_WIDTH-27,height:(SCREEN_WIDTH-27)*2332/1400}}
                            source={require('../../../images/img_advertising.png')}
                        />
                    </TouchableWithoutFeedback>
                </View>
                
                <Modal animationType={'fade'} visible={this.state.modalVisible} transparent={true} onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer
                        saveToLocalByLongPress={false}
                        menuContext={{ saveToLocal: '保存图片', cancel: '取消' }}
                        onClick={() => {
                            {
                                this.setState({
                                    modalVisible: false
                                });
                            }
                        }}
                        onSave={url => {
                            let promise = this.DownloadImage('https://xuedilong.chsdl.com/upload/img_advertising.png')
                            promise.then((res)=>{
                                this.setState({
                                    modalVisible: false
                                });
                                ShowToast('保存成功')
                            }).catch((e)=>{
                                this.setState({
                                    modalVisible: false
                                });
                                ShowToast('保存失败')
                            })
                        }}
                        imageUrls={[
                            {
                                props: {
                                    source: require('../../../images/img_advertising.png')
                                }
                            }
                            // {
                            //     url:'https://xuedilong.chsdl.com/upload/SDL202209021632553255333.jpg'
                            // }
                        ]}
                        index={0}
                    />
                </Modal>
            </View>
        </ScrollView>)
    }

    DownloadImage= (uri) => {
        if (!uri) return null;

        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
        const downloadDest = `${dirs}/${'关于开通企业业主账户通知'}.jpg`;

        const formUrl = uri;
        const options = {
            fromUrl: formUrl,
            toFile: downloadDest,
            // background: true,
            // begin: (res) = {
            // console.log('begin', res);
            // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            // },
        };
        return new Promise((resolve, reject) => {
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    // console.log('success', res);
                    if (res&&res.statusCode == 200) {
                        var promise = CameraRoll.saveToCameraRoll(downloadDest);
                        promise.then(function(result) {
                            resolve(result);
                            // alert('保存成功！地址如下：\n' + result);
                        }).catch(function(error) {
                        // console.log('error', error);
                        // alert('保存失败！\n' + error);
                            reject(new Error(error))
                        });
                    } else {
                        reject(res)
                    }
                    // console.log('file://' + downloadDest)
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }
        });
    }
}
