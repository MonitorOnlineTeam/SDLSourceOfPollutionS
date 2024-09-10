/**
 * Created by Lcs on 2017/5/19.
 */
import React, { Component } from 'react';

import { StyleSheet, View, Dimensions } from 'react-native';
import Loading from './Loading';
import { ErrorView } from './ErrorView';
import { EmptyView } from './EmptyView';
import Common from './constants';
import { DeviceEventEmitter } from 'react-native';
import globalcolor from '../../config/globalcolor';
let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
};

export class StatusPage extends Component {
    constructor(props) {
        super(props);
    }

    // props: {
    //     children: any,
    //     onEmptyPress: () => void,
    //     onErrorPress: () => void,
    //     emptyImgSource: Image.propTypes.source,
    //     errorImgSource: Image.propTypes.source,
    //     emptyText: React.PropTypes.string,
    //     errorText: React.PropTypes.string,
    //     emptyBtnText: React.PropTypes.string,
    //     errorBtnText: React.PropTypes.string,
    //     emptyTextStyle: Text.propTypes.style,
    //     errorTextStyle: Text.propTypes.style,
    //     emptyButtonStyle: ViewPropTypes.style,
    //     errorButtonStyle: ViewPropTypes.style,
    //     emptyBgColor: View.propTypes.backgroundColor,
    //     errorBgColor: View.propTypes.backgroundColor,
    //     initHint: React.PropTypes.string,
    //     loadingHint: React.PropTypes.string,
    //     initHintStyle: Text.propTypes.style,
    //     loadingHintStyle: Text.propTypes.style,
    //     initIndicatorColor: ActivityIndicator.props.color,
    //     loadingIndicatorColor: ActivityIndicator.props.color,
    //     initContainerBgColor: View.propTypes.backgroundColor,
    //     loadingContainerBgColor: View.propTypes.backgroundColor,
    // };

    _onEmptyPress = () => {
        this.props.onEmptyPress();
    };

    _onErrorPress = () => {
        this.props.onErrorPress();
    };

    static defaultProps = {
        status: Common.PageStatus.content,
        neterrorImgSource: require('./ic_net_error.png'),
        errorImgSource: require('./ic_error.png')
    };

    render() {
        // 第一次加载等待的view
        if (this.props.status === Common.PageStatus.init) {
            return this.renderLoadingView();
        } else if (this.props.status === Common.PageStatus.empty) {
            //请求为空的view
            return this.renderEmptyView();
        } else if (this.props.status === Common.PageStatus.neterror) {
            //网络请求失败view
            return this.renderNetErrorView();
        } else if (this.props.status === Common.PageStatus.error) {
            //请求失败view
            return this.renderErrorView();
        } else if (this.props.status === Common.PageStatus.content) {
            //加载数据
            return this.renderData();
        } else {
            //加载数据
            return this.renderData();
        }
    }
    componentWillUnmount() {
        // 传入 backRef为true的时候 返回到该页面 执行 refresh监听的方法
        if (this.props.backRef == true) {
            DeviceEventEmitter.emit('refresh', 'true');
        }
    }

    //加载等待的view
    renderLoadingView() {
        return <Loading hintStyle={this.props.initHintStyle} indicatorColor={this.props.initIndicatorColor} containerBgColor={this.props.initContainerBgColor} loadingHint={this.props.initHint} />;
    }

    //网络加载失败view
    renderNetErrorView() {
        let errorPaddingTop = 0;
        if (typeof this.props.errorPaddingTop == 'undefined') {
            errorPaddingTop = Common.window.height / 5;
        } else {
            errorPaddingTop = this.props.errorPaddingTop;
        }
        return (
            <ErrorView
                title={this.props.neterrorText || '网络异常，请检查网络配置'}
                imgSource={this.props.neterrorImgSource}
                btnText={this.props.errorBtnText}
                textStyle={this.props.errorTextStyle}
                buttonStyle={this.props.errorButtonStyle}
                backgroundColor={this.props.errorBgColor}
                paddingTop={errorPaddingTop}
                onPress={() => {
                    this._onErrorPress();
                }}
            />
        );
    }
    //加载失败view
    renderErrorView() {
        let errorPaddingTop = 0;
        if (typeof this.props.errorPaddingTop == 'undefined') {
            errorPaddingTop = Common.window.height / 5;
        } else {
            errorPaddingTop = this.props.errorPaddingTop;
        }
        return (
            <ErrorView
                title={this.props.errorText || '服务器加载错误'}
                imgSource={this.props.errorImgSource}
                btnText={this.props.errorBtnText}
                textStyle={this.props.errorTextStyle}
                buttonStyle={this.props.errorButtonStyle}
                backgroundColor={this.props.errorBgColor}
                paddingTop={errorPaddingTop}
                onPress={() => {
                    this._onErrorPress();
                }}
            />
        );
    }

    //加载失败view
    renderEmptyView = () => {
        let emptyPaddingTop = 0;
        if (typeof this.props.emptyPaddingTop == 'undefined') {
            emptyPaddingTop = Common.window.height / 5;
        } else {
            emptyPaddingTop = this.props.emptyPaddingTop;
        }
        return (
            <EmptyView
                title={this.props.emptyText || '暂无数据'}
                imgSource={this.props.emptyImgSource}
                btnText={this.props.emptyBtnText}
                textStyle={this.props.emptyTextStyle}
                buttonStyle={this.props.emptyButtonStyle}
                backgroundColor={this.props.emptyBgColor}
                paddingTop={emptyPaddingTop}
                onPress={() => {
                    this._onEmptyPress();
                }}
            />
        );
    };

    renderData() {
        return (
            <View style={{ flex: 1 }} {...this.props}>
                <View style={styles.just_loading_container}>
                    {this.props.status === Common.PageStatus.loading ? (
                        <Loading hintStyle={this.props.loadingHintStyle} indicatorColor={this.props.loadingIndicatorColor} containerBgColor={this.props.loadingContainerBgColor} loadingHint={this.props.loadingHint} />
                    ) : null}
                </View>
                <View style={styles.position_container} {...this.props}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    position_container: {
        flex: 1,
        backgroundColor: globalcolor.statusPageBackgroundColor,
        flexDirection: 'column'
    },

    just_loading_container: {
        width: window.width,
        height: window.height - 40,
        backgroundColor: 'transparent',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0
    }
});
