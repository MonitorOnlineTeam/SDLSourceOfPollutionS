/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2025-04-15 14:01:48
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2025-04-17 14:48:37
 * @Description: 上传图片和运维人员签字 组件
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import moment from 'moment';
import FormInput from '../../../components/FormInput';
import globalcolor from '../../../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../../../config/globalsize';
import { NavigationActions, } from '../../../../../../utils';
const { width, height } = Dimensions.get('window');
import ImageGrid from '../../../../../../components/form/images/ImageGrid';
const ImageSignature = (props) => {


    useEffect(() => {

    }, []);

    // 处理签名完成
    const handleSignature = signature => {
        const signTime = moment().format('YYYY-MM-DD HH:mm:ss')
        props.handleSignatureCallback(signature,signTime)
    };

    // 处理签名取消
    const handleSignatureCancel = () => {
        props.navigation.goBack();
    };
    // 打开签名页面
    const openSignaturePage = () => {
        props.dispatch(
            NavigationActions.navigate({
                routeName: 'SignaturePage',
                params: {
                    onOK: handleSignature,
                    onCancel: handleSignatureCancel,
                    signature: signContent,
                },
            }),
        );
    };

    const {signContent, uuid, imageList,  } = props;
    return (
        <View style={styles.formContainer}>
            <View style={styles.formSection}>
                <Text style={styles.labelStyle}>
                    <Text style={[{ color: 'red' }]}>*</Text>上传图片：
                </Text>
                <View style={styles.imgContent}>
                <Text style={[{ color: 'red',paddingHorizontal:8 }]}>
                请至少上传一张与开展的运维工作相关的照片,
                请上传运维人员现场工作照,要求面部清晰
                </Text>
                <ImageGrid
                    componentType={'normalWaterMaskCamera'}
                    style={{
                        backgroundColor: '#fff',
                    }}
                    Imgs={imageList}
                    isUpload={true}
                    isDel={true}
                    UUID={uuid}
                    uploadCallback={items => {
                        let newImgList = [...imageList];
                        items.map(imageItem => {
                            newImgList.push(imageItem);
                        });
                        props.uploadCallback?.(newImgList)
                    }}
                    delCallback={index => {
                        let newImgList = [...imageList];
                        newImgList.splice(index, 1);
                        props.uploadCallback?.(newImgList)
                    }}
                />
            </View>
            </View>
            <View style={styles.formSection}>
            <Text style={styles.labelStyle}>
                <Text style={[{ color: 'red' }]}>*</Text>运维人员签字：
            </Text>
            <TouchableOpacity
                style={styles.signatureContainer}
                onPress={openSignaturePage}>
                {signContent ? (
                    <Image
                        source={{ uri: signContent }}
                        style={styles.signaturePreview}
                    />
                ) : (
                        <Text style={styles.signaturePlaceholder}>
                            点击此处签名
                        </Text>
                    )}
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: SCREEN_WIDTH - 16,
        marginHorizontal: 8,
    },
      formSection: {
        marginTop:10,
      },
      imgContent: {
        width: SCREEN_WIDTH - 16,
        borderRadius: 2,
        backgroundColor: globalcolor.white,
        marginTop: 8,
        paddingTop:8,
      },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.textBlack
    },
    signatureContainer: {
        width: SCREEN_WIDTH - 16,
        marginTop: 8,
        borderRadius: 2,
        height: 80,
        backgroundColor: globalcolor.white,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signaturePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    signaturePlaceholder: {
        color: '#999',
        fontSize: 14,
    },
});

export default ImageSignature; 