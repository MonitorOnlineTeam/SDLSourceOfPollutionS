/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2022-12-05 08:28:31
 * @LastEditTime: 2022-12-05 10:28:14
 * @FilePath: /SDLMainProject32/app/operationContainers/taskViews/taskExecution/components/IconDialog.js
 */

import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableHighlight, Text, Dimensions, Modal, Button,Platform, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const [defaultWidth, defaultHeight] = [320, 240];

export default class IconDialog extends Component {

    static defaultProps = {
        hasCloseButton:false,
        icUri:require('../../../../images/ic_dialog_no_check_in.png')
    }

    constructor(props) {
        super(props);
        this.state = {
            clickScreenToHide: true, //点击背景隐藏弹框
            animationType: 'fade', //modal弹出方式，目前有三种 slide，fade，none
            modalVisible: false, //modal是否显示
            transparent: true, //modal弹出是否有透明背景视图
        };
    }
    render() {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={this.hideModal}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
            >
                <View style={styles.container}>
                    {this.state.clickScreenToHide && (
                        <TouchableHighlight onPress={this.hideModal} style={styles.mask}>
                            <Text />
                        </TouchableHighlight>
                    )}
                    <View style={{minWidth:270, alignItems:'center'}}>
                        <View style={{width:270,height:89, zIndex:10, flexDirection:'row'}}>
                            <Image source={this.props.icUri} style={{height:89,width:89, marginLeft:90.5}} />
                            {this.props.hasCloseButton?<TouchableOpacity 
                                onPress={()=>{
                                    this.hide();
                                }}
                                style={{ marginTop:10,marginLeft:80 }}>
                                <View style={{height:16,width:16,borderRadius:8,borderWidth:1,borderColor:'white',backgroundColor:'transparent'
                                , justifyContent:'center', alignItems:'center'}}>
                                    <Image style={{height:7,width:7,tintColor:'white',}} source={require('../../../../images/mapclose.png')} />
                                </View>
                            </TouchableOpacity>:null}
                        </View>
                        <View style={{minWidth:270,borderRadius:10,backgroundColor:'white'
                            , marginTop:-55, paddingTop:55, zIndex:2
                        }}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    show = () => {
        this.setState({ modalVisible: true });
    };
    
    showModal = () => {
        this.setState({ modalVisible: true });
    };

    hide = () => {
        this.setState({ modalVisible: false });
    };

    hideModal = () => {
        this.setState({ modalVisible: false });
    };
    componentDidMount() {
        if (this.props.options) {
            let options = this.props.options;
            clickScreenToHide = options.clickScreenToHide == undefined ? true : options.clickScreenToHide;
            animationType = options.animationType == undefined ? 'fade' : options.animationType;

            if (!this.state.modalVisible) {
                this.setState({
                    animationType: animationType,
                    clickScreenToHide: clickScreenToHide
                });
            }
        } else {
            // this.setState({ modalVisible: true })
        }
    }
}


const styles = StyleSheet.create({
    boxCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flex: 1
    },
    mask: {
        justifyContent: 'center',
        backgroundColor: '#383838',
        opacity: 0.8,
        position: 'absolute',
        width: width,
        height: height,
        left: 0,
        top: 0
    },
    containView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 5
    },
    headerView: {
        flexDirection: 'row',
        height: 40,
        borderRadius: 5
    },
    headerTitle: {
        backgroundColor: '#ffffff',
        color: '#141414',
        height: 40,
        flex: 1,
        textAlignVertical: 'center',
        textAlign: 'center',
        padding: 10
    },
    componentView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messText: {
        flexDirection: 'row',
        paddingHorizontal: Platform.OS === 'ios'?0:16,
        flex: 1
    },
    buttonView: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 15
    },
    comBtnBtnView: {
        height: 32,
        backgroundColor: '#e6454a',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1 / 2,
        borderColor: '#f0f0f0',
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 8,
        marginRight: 8
    },
    comBtnTextView: {
        height: 28,
        justifyContent: 'center',
        alignItems: 'center'
    },
    comBtnText: {
        fontSize: 14,
        color: '#ffffff'
    }
});

