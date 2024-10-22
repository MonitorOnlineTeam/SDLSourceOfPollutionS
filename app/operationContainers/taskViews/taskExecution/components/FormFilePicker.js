/*
 * @Description: 表单附件选择器
 * @LastEditors: hxf
 * @Date: 2021-11-30 16:17:34
 * @LastEditTime: 2024-10-09 16:22:32
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/components/FormFilePicker.js
 */
import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize'
import ImageGrid from '../../../../components/form/images/ImageGrid';
import { ShowToast, ShowLoadingToast, CloseToast, createAction, SentencedToEmpty } from '../../../../utils';
import ImageDeleteTouch from '../../../../components/form/images/ImageDeleteTouch';

@connect()
export default class FormImagePicker extends Component {
    render() {
        const {
            label = '图片',
            files = [],
            isUpload = true,
            isDel = true,
            localId = '123',
            required = false,
            callback = () => { },
            delCallback = () => { },
            uploadIconRender = () => { return <Image style={{ height: 36, width: 36 }} source={require('../../../../images/home_point_add.png')} /> },
            interfaceName = 'original',
            itemWidth = (SCREEN_WIDTH - 98)
        } = this.props;
        const rtnVal = [];
        let AttachIDStr = '';
        let splitStrs;
        files.map((item, index) => {
            if (SentencedToEmpty(item, ['AttachID'], '') != '') {
                splitStrs = item.AttachID.split('/');
                AttachIDStr = splitStrs[splitStrs.length - 1];
            } else {
                AttachIDStr = '';
            }
            rtnVal.push(
                <View key={`file${index}`} style={[{ width: itemWidth, height: 36 }
                    , files.length == index + 1 ? {} : styles.bottomBorder
                    , { alignItems: 'center', flexDirection: 'row', }]}
                >
                    <Image style={[{ height: 24, width: 24, marginRight: 8 }]} source={require('../../../../images/ic_pic.png')} />
                    <Text style={[{ fontSize: 13, color: globalcolor.datepickerGreyText }]}>{SentencedToEmpty(item, ['showName'], '-')}</Text>
                    {isDel ? (
                        <View style={[{ position: 'absolute', top: 0, right: 8 }]}>
                            <ImageDeleteTouch
                                // AttachID={item.AttachID}
                                AttachID={AttachIDStr}
                                callback={() => {
                                    // let Imgs = [...this.state.files];
                                    // Imgs.splice(index, 1);
                                    // this.setState({ files: Imgs });
                                    delCallback(index);
                                }}
                            >
                                <Image source={require('../../../../images/ic_close_blue.png')} style={{ width: 16, height: 16 }} />
                            </ImageDeleteTouch>
                        </View>
                    ) : null}
                </View>
            );
        });

        return (
            <View style={[styles.layoutStyle, false ? {} : styles.bottomBorder]}>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                        {required ? <Text style={[styles.labelStyle, { color: 'red' }]}>*</Text> : null}
                        <Text style={[styles.labelStyle, { marginVertical: 10 }]}>{`${label}：`}</Text>
                    </View>
                    {isUpload ? <TouchableOpacity
                        onPress={async () => {
                            try {
                                const res = await DocumentPicker.pick({
                                    type: [DocumentPicker.types.allFiles],
                                    copyTo: 'cachesDirectory',
                                });
                                console.log('res = ', res);
                                if (SentencedToEmpty(res, ['uri'], '') == '') {
                                    if (SentencedToEmpty(res, ['fileCopyUri'], '') != '') {
                                        res.uri = res.fileCopyUri;
                                    }
                                }
                                if (SentencedToEmpty(res, ['uri'], '') == '') {
                                    ShowToast('文件获取错误');
                                } else {
                                    // ShowLoadingToast('正在上传附件'+res.uri+","+res.name);
                                    ShowLoadingToast('正在上传附件');
                                    /**
                                    * interfaceName    original:原有接口       netCore:netCore接口
                                    */
                                    if (false && interfaceName == 'netCore') {
                                        this.props.dispatch(createAction('CTModel/uploadFile')({
                                            file: res, callback: (msg, requestSuccess) => {
                                                if (requestSuccess) {
                                                    ShowToast('上传成功');
                                                    callback(msg);
                                                } else {
                                                    ShowToast(msg);
                                                }
                                            }, uuid: localId
                                        }))
                                    } else {
                                        this.props.dispatch(createAction('imageModel/uploadFile')({
                                            file: res, callback: (msg, requestSuccess) => {
                                                CloseToast();
                                                if (requestSuccess) {
                                                    ShowToast('上传成功');
                                                    callback(msg);
                                                } else {
                                                    ShowToast(msg);
                                                }
                                            }, uuid: localId
                                        }))
                                    }
                                }
                            } catch (err) {
                                if (DocumentPicker.isCancel(err)) {
                                    // User cancelled the picker, exit any dialogs or menus and move on
                                } else {
                                    throw err;
                                }
                            }
                        }}
                    >
                        {/* <Image style={{height:36,width:36}} source={require('../../../../images/home_point_add.png')} /> */}
                        {uploadIconRender()}
                    </TouchableOpacity> : null}
                </View>

                <View style={[{
                    minHeight: 100,
                    width: SCREEN_WIDTH - 72,
                    backgroundColor: 'white',
                    paddingHorizontal: 13,
                    alignItems: 'center',
                    justifyContent: 'center'
                }]}>
                    {rtnVal}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    layoutStyle: {
        minHeight: 45,
        marginTop: 10,
        marginBottom: 10,
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
    },
    labelStyle: {
        fontSize: 15,
        color: globalcolor.textBlack
    },
});