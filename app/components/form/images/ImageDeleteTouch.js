import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ShowToast, ShowLoadingToast, CloseToast, createAction } from '../../../utils';

import AlertDialog from '../../modal/AlertDialog';
import globalcolor from '../../../config/globalcolor';
const { width, height } = Dimensions.get('window');
let that;

@connect()
export default class ImageDeleteTouch extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {};
        that = this;
    }
    componentDidMount() { }

    uploadImageCallBack = (img, isSuccess) => {
        if (isSuccess) {
            this.props.callback(img);

            CloseToast('上传成功');
        } else {
            CloseToast('上传失败！');
        }
    };
    cancelButton = () => { };
    confirm = () => {
        const { style, children, deleteMethods, AttachID, deleType, onPress, callback } = this.props;
        ShowLoadingToast('正在删除图片');
        that.props.dispatch(
            createAction(`imageModel/DelPhotoRelation`)({
                params: {
                    code: AttachID,
                    callback: () => {
                        callback();
                    }
                }
            })
        );
    };
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除图片',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm
                }
            ]
        };
        const { style, children, deleteMethods, AttachID = '', deleType, onPress, callback } = this.props;
        return (
            <TouchableOpacity
                onLongPress={() => {
                    if (deleType == 'LongPress') {
                        this.refs.doAlert.show();
                    }
                }}
                onPress={() => {
                    if (deleType == 'LongPress') {
                        onPress();
                    } else if (deleType == 'noDelete') {
                        onPress();
                    } else {
                        let paramAttachID = ''
                            , strArray = [];
                        if (AttachID.indexOf('/') != -1) {
                            strArray = AttachID.split('/');
                            paramAttachID = strArray[strArray.length - 1];
                        } else {
                            paramAttachID = AttachID;
                        }
                        ShowLoadingToast('正在删除图片');
                        that.props.dispatch(
                            createAction(`imageModel/DelPhotoRelation`)({
                                params: {
                                    code: paramAttachID,
                                    callback: () => {
                                        callback();
                                    }
                                }
                            })
                        );
                    }
                }}
                style={style}
            >
                {children}
                <AlertDialog options={options} ref="doAlert" />
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2',
        marginTop: 30
    },
    item: {
        flexDirection: 'row'
    }
});
