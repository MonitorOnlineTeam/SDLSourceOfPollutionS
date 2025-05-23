/*
 * @Description: 废液处置记录表
 * @LastEditors: hxf
 * @Date: 2025-04-10 11:38:39
 * @LastEditTime: 2025-04-11 09:20:55
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/WasteLiquidDisposalRecord.js
 */

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { StatusPage } from '../../../../../components'
import { NavigationActions, SentencedToEmpty } from '../../../../../utils'
import { SCREEN_WIDTH } from '../../../../../config/globalsize'
import globalcolor from '../../../../../config/globalcolor'
import FormDatePicker from '../../components/FormDatePicker'
import moment from 'moment'
import FormPicker from '../../components/FormPicker'
import FormInput from '../../components/FormInput'
import FormImagePicker from '../../components/FormImagePicker'
import { dispatch } from '../../../../../..'


export default function WasteLiquidDisposalRecord() {

    const [signContent, setSignContent] = useState('');

    const Content = {
        WorkingDateBegin: '2025-04-08 15:00:00',
        WorkingDateEnd: '2025-04-10 16:00:00',
    }

    const getTimeGeneratedOption = () => {
        return {
            defaultTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: 'hour',
            onSureClickListener: time => {
            },
        };
    }

    const isEdit = () => {
        return true;
    }

    // 处理签名完成
    const handleSignature = signature => {
        setSignContent(signature);
        // this.setState({
        //     signContent: signature,
        //     signTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });
    };

    // 处理签名取消
    const handleSignatureCancel = () => {
        this.props.navigation.goBack();
    };
    // 打开签名页面
    const openSignaturePage = () => {
        dispatch(
            NavigationActions.navigate({
                routeName: 'SignaturePage',
                params: {
                    onOK: handleSignature,
                    onCancel: handleSignatureCancel,
                    signature: signContent,
                    // signature: this.state.formData.signature,
                },
            }),
        );
    };

    return (<StatusPage
        status={200}
        errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
        errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
        //页面是否有回调按钮，如果不传，没有按钮，
        emptyBtnText={'重新请求'}
        errorBtnText={'点击重试'}
        onEmptyPress={() => {
            //空页面按钮回调
            // this.statusPageOnRefresh();
        }}
        onErrorPress={() => {
            //错误页面按钮回调
            // this.statusPageOnRefresh();
        }}
    >
        <ScrollView
            style={[{ width: SCREEN_WIDTH, flex: 1 }]}
        >
            <View
                style={{ width: SCREEN_WIDTH, alignItems: 'center' }}
            >
                <View style={styles.layoutWithBottomBorder}>
                    <Text style={styles.labelStyle}>工作时间：</Text>
                    <View style={[styles.timeRangeContainer, { justifyContent: 'space-around', alignItems: 'center' }]}>
                        <Text style={[styles.timeValue, { maxWidth: 120 }]}>
                            {Content.WorkingDateBegin}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: globalcolor.taskFormLabel,
                                paddingHorizontal: 2,
                                textAlign: 'center',
                            }}>
                            ~
                        </Text>
                        <Text style={[styles.timeValue, { maxWidth: 120 }]}>
                            {Content.WorkingDateEnd}
                        </Text>
                    </View>
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormPicker
                        editable={isEdit()}
                        propsRightIconStyle={{ width: 18 }}
                        required={true}
                        label="产生批次编码"
                        defaultCode={SentencedToEmpty({}, ['EntId'], '')}
                        // option={{
                        //     codeKey: 'EntId',
                        //     nameKey: 'EntName',
                        //     defaultCode: SentencedToEmpty({}, ['EntId'], ''),
                        //     dataArr: SentencedToEmpty({}, ['data', 'Datas'], []),
                        //     onSelectListener: callBackItem => {

                        //     }
                        // }}
                        showText={SentencedToEmpty({}, ['EntName'], '')}
                        placeHolder={isEdit() ? "请选择" : '未选择'}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormDatePicker
                        rightIconStyle={{}}
                        required={true}
                        getPickerOption={getTimeGeneratedOption}
                        label={'产生时间'}
                        timeString={
                            false
                                ? moment().format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )
                                : '请选择开始时间'
                        }
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'行业俗称/去向单位内部名称'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'国家危险废物名录名称'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'危险废物类别'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'危险废物代码'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'产生量'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'计量单位'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'容器/包装编码'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'容器/包装类型'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'容器/包装数量'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'产生危险废物设施编码'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'去向'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'情况说明'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormInput
                        editable={isEdit()}
                        label={'名称型号'}
                        placeholder="请记录"
                        keyboardType="default"
                        value={''}
                        onChangeText={text => {

                        }}
                    />
                </View>
                <View
                    style={[{ width: SCREEN_WIDTH - 26 }]}
                >
                    <FormImagePicker
                        label={'现场废液情况'}
                        imageGridWidth={SCREEN_WIDTH - 40}
                        localId={'this.props.supplementaryImageID'}
                        Imgs={
                            SentencedToEmpty(this.props
                                , ['supplementaryImageList'], [])
                        }
                        delCallback={(key) => {
                            console.log('delCallback key = ', key);
                            // let delImgList = [].concat(SentencedToEmpty(this.props, ['supplementaryImageList'], []));
                            // delImgList.splice(key, 1);
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     supplementaryImageList: delImgList
                            // }));
                        }}
                        uploadCallback={(images) => {
                            // let addData = [].concat(SentencedToEmpty(this.props, ['supplementaryImageList'], []));
                            // images.map((item) => {
                            //     addData.push({ AttachID: item.AttachID });
                            // });
                            // this.props.dispatch(createAction('signInModel/updateState')({
                            //     supplementaryImageList: addData
                            // }));
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={styles.signatureWrapper}
                    onPress={openSignaturePage}>
                    {signContent ? (
                        <Image
                            source={{ uri: signContent }}
                            style={[styles.signaturePreview, {}]}
                        />
                    ) : (
                        <Text style={styles.signaturePlaceholder}>
                            点击此处签名
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
        <View
            style={[{
                width: SCREEN_WIDTH
                , justifyContent: 'center', alignItems: 'center'
            }]}
        >
            <TouchableOpacity
                style={styles.commit}
                onPress={() => {
                    this.commit();
                }}
            >
                <Image style={{ width: 15, height: 15 }} source={require('../../../../images/ic_commit.png')} />
                <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
            </TouchableOpacity>
        </View>
    </StatusPage>
    )
}

const styles = StyleSheet.create({
    commit: {
        marginBottom: 15,
        marginTop: 10,
        width: 282,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4499f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollView: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        width: SCREEN_WIDTH - 26,
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        width: 70,
    },
    timeRangeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeValue: {
        fontSize: 14,
        color: globalcolor.taskFormValue,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: globalcolor.white,
    },
    sectionTitle: {
        fontSize: 15,
        color: globalcolor.taskFormLabel,
        flex: 1,
    },
    arrow: {
        width: 20,
        height: 20,
    },
    sectionContent: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: globalcolor.borderBottomColor,
    },
    checkListContainer: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        paddingVertical: 10,
    },
    imageUploadContainer: {
        width: '100%',
        paddingVertical: 10,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 2,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        paddingRight: 20,
    },
    checkItemTitle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 4,
        paddingHorizontal: 16,
        flex: 1,
        marginHorizontal: 6,
    },
    submitButton: {
        backgroundColor: globalcolor.blue,
    },
    deleteButton: {
        backgroundColor: globalcolor.red,
    },
    signatureContainer: {
        width: '100%',
        marginBottom: 12,
    },
    signatureWrapper: {
        width: SCREEN_WIDTH - 26,
        height: 100,
        borderWidth: 1,
        borderColor: globalcolor.borderBottomColor,
        borderRadius: 4,
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
    signatureTitle: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 10,
    },
    completedIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalcolor.borderBottomColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedText: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
    },
    formItem: {
        width: '100%',
        paddingVertical: 10,
    },
    buttonText: {
        color: globalcolor.whiteFont,
        fontSize: 15,
    },
});