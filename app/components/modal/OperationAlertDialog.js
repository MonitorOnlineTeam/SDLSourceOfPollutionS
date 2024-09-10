import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Dimensions, Modal, Button, Platform, ScrollView } from 'react-native';
import { SentencedToEmpty } from '../../utils';

const { width, height } = Dimensions.get('window');
const [defaultWidth, defaultHeight] = [320, 180];

export default class OperationAlertDialog extends Component {
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
                onRequestClose={this.hideModal}
                supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
            >
                <View style={styles.container}>
                    {this.state.clickScreenToHide && (
                        <TouchableHighlight onPress={this.hideModal} style={styles.mask}>
                            <Text />
                        </TouchableHighlight>
                    )}

                    <View style={[styles.containView, { width: this.state.innersWidth, minHeight: this.state.innersHeight }]}>
                        {!this.state.hiddenTitle && (
                            <View style={styles.headerView}>
                                <Text style={[styles.headerTitle, this.state.headStyle]}>{this.state.headTitle}</Text>
                            </View>
                        )}
                        {this.state.messText && (
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.messText}>
                                <Text style={[{ fontSize: 15, lineHeight: 24, color: '#666' }]}>{this.state.messText}</Text>
                            </ScrollView>
                        )}
                        <View style={[{ height: 1, width: this.state.innersWidth, backgroundColor: '#f4f4f4' }]} />
                        {this.state.buttons && <View style={[styles.buttonView
                            , {
                            flexDirection: SentencedToEmpty(this.props.options, ['buttonDirection'], 'row'),
                        }]}>{this.state.buttons.map((item, i) => this.CreateBtns(item, i, this.state.buttons.length))}</View>}
                    </View>
                </View>
            </Modal>
        );
    }

    CreateBtns(item, i, length) {
        return <CreateButton key={i} isLast={i == length - 1} btnW={this.state.btnW} onClick={this.hideModal} item={item} indexs={i} />;
    }

    show = () => {
        this.setState({ messText: this.props.options.messText && this.props.options.messText == undefined ? '' : this.props.options.messText, modalVisible: true });
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
            headTitle = options.headTitle == undefined ? '提示' : options.headTitle;
            hiddenTitle = options.hiddenTitle == undefined ? false : options.hiddenTitle;
            headStyle = options.headStyle == undefined ? '' : options.headStyle;
            messText = options.messText && options.messText == undefined ? '' : options.messText;
            innersWidth = options.innersWidth == undefined ? defaultWidth : options.innersWidth;
            innersHeight = options.innersHeight == undefined ? defaultHeight : options.innersHeight;
            buttons = options.buttons == undefined ? null : options.buttons;
            const buttonDirection = SentencedToEmpty(options, ['buttonDirection'], 'row');

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
                    if (buttonDirection == 'row') {
                        this.state.btnW = (innersWidth - 60) / buttons.length;
                    } else if (buttonDirection == 'column') {
                        this.state.btnW = innersWidth - 60;
                    } else {
                        this.state.btnW = (innersWidth - 60) / buttons.length;
                    }
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
        this.props.onClick();
        if (this.props.item.onpress) {
            this.props.item.onpress();
        }
    };
    render() {
        return (
            <TouchableHighlight style={[this.props.isLast ? {} : styles.rightCutOffRule, styles.comBtnBtnView, { width: this.props.btnW }, this.props.item.btnStyle]} underlayColor="gray" onPress={this.click}>
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
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white'
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
        padding: 8
    },
    componentView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messText: {
        flexDirection: 'column',
        marginTop: 10,
        paddingHorizontal: Platform.OS === 'ios' ? 16 : 16,
        flex: 1,
        color: '#666'
    },
    buttonView: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8
    },
    comBtnBtnView: {
        height: 32,
        backgroundColor: '#e6454a',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 8,
        marginRight: 8
    },
    rightCutOffRule: {
        borderRightWidth: 1 / 2,
        borderColor: '#f0f0f0',
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
