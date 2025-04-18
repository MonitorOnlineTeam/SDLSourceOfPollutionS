/**
 * ModalDialog
 * Created by penglei on 2018/6/19.
 * Copyright © 2018 penglei. All rights reserved.
 */

import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Dimensions, Modal, Button, Platform, StatusBar } from 'react-native';
import { SentencedToEmpty } from '../../utils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/globalsize';
const { width, height } = Dimensions.get('window');
const [defaultWidth, defaultHeight] = [320, 240];

export default class AlertDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickScreenToHide: true, //点击背景隐藏弹框
            animationType: 'fade', //modal弹出方式，目前有三种 slide，fade，none
            modalVisible: false, //modal是否显示
            transparent: true, //modal弹出是否有透明背景视图
            headTitle: '提示', //弹框头部提示title
            hiddenTitle: false, //是否隐藏头部title
            headStyle: '', //头部样式，需要的话要自定义
            messText: null,
            innersHeight: defaultHeight, //弹出框高度
            innersWidth: defaultWidth, //弹框宽度
            buttons: [], //底部按钮数组
            btnW: (defaultWidth - 60) / 2 //按钮宽度
        };
    }
    render() {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.hideModal;
                }}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
            >
                <StatusBar hidden={true} />
                <View style={this.props.orientation == 'LANDSCAPE'
                    ? {
                        width: SCREEN_HEIGHT,
                        height: SCREEN_WIDTH - 96,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                    } : styles.container}>
                    {this.state.clickScreenToHide && (
                        <TouchableHighlight
                            onPress={() => {
                                const { alertDialogHideCallback = () => { } } = this.props.options;
                                alertDialogHideCallback();
                                this.hideModal();
                            }}
                            style={this.props.orientation == 'LANDSCAPE' ? {
                                justifyContent: 'center',
                                backgroundColor: '#383838',
                                opacity: 0.8,
                                position: 'absolute',
                                width: SCREEN_HEIGHT,
                                height: SCREEN_WIDTH,
                                left: 0,
                                top: 0
                            } : styles.mask}
                        >
                            <Text />
                        </TouchableHighlight>
                    )}

                    <View style={[styles.containView, { width: this.state.innersWidth, height: this.state.innersHeight }, {}]}>
                        {!this.state.hiddenTitle && (
                            <View style={styles.headerView}>
                                <Text style={[styles.headerTitle, this.state.headStyle]}>{this.state.headTitle}</Text>
                            </View>
                        )}
                        <View style={[styles.componentView, { width: this.state.innersWidth }]}>{this.props.components}</View>
                        {/* {this.state.messText && (
                            <View style={styles.messText}>
                                <Text>{this.state.messText}</Text>
                            </View>
                        )} */}
                        {SentencedToEmpty(this.props, ['options', 'messText'], '') != '' && (
                            <View style={styles.messText}>
                                <Text style={[{ color: '#333333' }]}>{`${SentencedToEmpty(this.props, ['options', 'messText'], '未传入提示信息')}`}</Text>
                            </View>
                        )}
                        {this.state.buttons && <View style={styles.buttonView}>{this.state.buttons.map((item, i) => this.CreateBtns(item, i))}</View>}
                    </View>
                </View>
            </Modal >
        );
    }

    CreateBtns(item, i) {
        return <CreateButton key={i} btnW={this.state.btnW} onClick={()=>this.hideModal(item)} item={item} indexs={i} />;
    }

    show = () => {
        this.setState({ modalVisible: true });
    };

    hide = () => {
        this.setState({ modalVisible: false });
    };

    hideModal = (item) => {
        this.setState({ modalVisible: false });
        item?.txt=='确定' &&  this.props.options?.submitCallback && this.props.options.submitCallback()
    };
    componentDidMount() {
        if (this.props.options) {
            let options = this.props.options;
            clickScreenToHide = options.clickScreenToHide == undefined ? true : options.clickScreenToHide;
            animationType = options.animationType == undefined ? 'fade' : options.animationType;
            headTitle = options.headTitle == undefined ? '提示' : options.headTitle;
            hiddenTitle = options.hiddenTitle == undefined ? false : options.hiddenTitle;
            headStyle = options.headStyle == undefined ? '' : options.headStyle;
            messText = options.messText && options.messText == undefined ? '' : options.messText;
            innersWidth = options.innersWidth == undefined ? defaultWidth : options.innersWidth;
            innersHeight = options.innersHeight == undefined ? defaultHeight : options.innersHeight;
            buttons = options.buttons == undefined ? null : options.buttons;

            if (!this.state.modalVisible) {
                this.setState({
                    headTitle: headTitle,
                    messText: messText,
                    hiddenTitle: hiddenTitle,
                    headStyle: headStyle,
                    // modalVisible: true,
                    innersHeight: innersHeight,
                    innersWidth: innersWidth,
                    buttons: buttons,
                    animationType: animationType,
                    clickScreenToHide: clickScreenToHide
                });
                if (buttons) {
                    this.state.btnW = (innersWidth - 60) / buttons.length;
                }
            }
        } else {
            // this.setState({ modalVisible: true })
        }
    }
}

class CreateButton extends Component {
    constructor(props) {
        super(props);
    }
    click = () => {
        if (this.props.item.onpress) {
            this.props.item.onpress();
        }
        if (this.props.item.openDialog == true) {
        } else {
            this.props.onClick();
        }
    };
    render() {
        return (
            <TouchableHighlight style={[styles.comBtnBtnView, { width: this.props.btnW }, this.props.item.btnStyle]} underlayColor="gray" onPress={this.click}>
                <View style={styles.comBtnTextView}>
                    <Text style={[styles.comBtnText, this.props.item.txtStyle]}>{this.props.item.txt}</Text>
                </View>
            </TouchableHighlight>
        );
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
        paddingHorizontal: Platform.OS === 'ios' ? 0 : 16,
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
