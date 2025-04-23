/*
 * @Description: 管道流量计维护记录
 * @LastEditors: hxf
 * @Date: 2025-04-11 09:21:23
 * @LastEditTime: 2025-04-21 10:54:17
 * @FilePath: /SDLSourceOfPollutionS_dev/app/operationContainers/taskViews/taskExecution/formViews/zibo/PipelineFlowMeterMaintenanceRecord.js
 */
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { SelectButton, StatusPage } from '../../../../../components'
import { SCREEN_WIDTH } from '../../../../../config/globalsize'
import { NavigationActions, SentencedToEmpty } from '../../../../../utils'
import globalcolor from '../../../../../config/globalcolor'
import FormDatePicker from '../../components/FormDatePicker'
import moment from 'moment'
import FormPicker from '../../components/FormPicker'
import FormImagePicker from '../../components/FormImagePicker'
import { dispatch } from '../../../../../..'

//PipelineFlowMeterMaintenanceRecord
//WasteLiquidConsumablesReplacementRecord
export default function PipelineFlowMeterMaintenanceRecord() {

    const [signContent, setSignContent] = useState('');

    const Content = {
        WorkingDateBegin: '2025-04-08 15:00:00',
        WorkingDateEnd: '2025-04-10 16:00:00',
    }

    const isEdit = () => {
        return true
    }

    // 处理签名完成
    const handleSignature = signature => {
        setSignContent(signature);
        // dispatch(createAction('zbRepairRecordModel/updateState')({
        //     signContent: signature,
        // }));
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

    const isNewRecord = () => {
        return true;
    }

    return (
        <StatusPage
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
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormDatePicker
                            required={true}
                            getPickerOption={() => ({
                                defaultTime: Content.WorkingDateBegin,
                                type: 'miniute',
                                onSureClickListener: time => {
                                    // this.setState(prevState => ({
                                    //     Content: {
                                    //         ...prevState.Content,
                                    //         WorkingDateBegin: time,
                                    //     },
                                    // }));
                                },
                            })}
                            label={'工作时间'}
                            timeString={moment(Content.WorkingDateBegin).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )}
                        />
                        <FormDatePicker
                            required={true}
                            getPickerOption={() => ({
                                defaultTime: Content.WorkingDateEnd,
                                type: 'miniute',
                                onSureClickListener: time => {
                                    // this.setState(prevState => ({
                                    //     Content: {
                                    //         ...prevState.Content,
                                    //         WorkingDateEnd: time,
                                    //     },
                                    // }));
                                },
                            })}
                            label={'结束时间'}
                            timeString={moment(Content.WorkingDateEnd).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <View key={'xxx_1'} style={styles.checkItem}>
                            <Text style={styles.checkItemTitle}>{'流量计仪表管道内径设置是否与实际一致'}</Text>
                            <SelectButton
                                editable={true}
                                style={{
                                    flexDirection: 'row',
                                    width: 120,
                                    paddingHorizontal: 10,
                                }}
                                conTainStyle={{ height: 44, width: 40 }}
                                imageStyle={{ width: 18, height: 18 }}
                                textStyle={{ color: '#666' }}
                                selectIndex={''}
                                data={[
                                    {
                                        title: '正常',
                                        id: '1',
                                    },
                                    {
                                        title: '异常',
                                        id: '0',
                                    },
                                ]}
                                onPress={(index, _item) => {
                                    // this.handleFormDataChange(
                                    //     item.id,
                                    //     _item.id === '1' ? 1 : 0,
                                    // );
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <View key={'xxx_1'} style={styles.checkItem}>
                            <Text style={styles.checkItemTitle}>{'流量模拟信号传输误差是否小于1‰'}</Text>
                            <SelectButton
                                editable={true}
                                style={{
                                    flexDirection: 'row',
                                    width: 120,
                                    paddingHorizontal: 10,
                                }}
                                conTainStyle={{ height: 44, width: 40 }}
                                imageStyle={{ width: 18, height: 18 }}
                                textStyle={{ color: '#666' }}
                                selectIndex={''}
                                data={[
                                    {
                                        title: '正常',
                                        id: '1',
                                    },
                                    {
                                        title: '异常',
                                        id: '0',
                                    },
                                ]}
                                onPress={(index, _item) => {
                                    // this.handleFormDataChange(
                                    //     item.id,
                                    //     _item.id === '1' ? 1 : 0,
                                    // );
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <View key={'xxx_1'} style={styles.checkItem}>
                            <Text style={styles.checkItemTitle}>{'管道电磁流量计检定证书是否存在'}</Text>
                            <SelectButton
                                editable={true}
                                style={{
                                    flexDirection: 'row',
                                    width: 120,
                                    paddingHorizontal: 10,
                                }}
                                conTainStyle={{ height: 44, width: 40 }}
                                imageStyle={{ width: 18, height: 18 }}
                                textStyle={{ color: '#666' }}
                                selectIndex={''}
                                data={[
                                    {
                                        title: '正常',
                                        id: '1',
                                    },
                                    {
                                        title: '异常',
                                        id: '0',
                                    },
                                ]}
                                onPress={(index, _item) => {
                                    // this.handleFormDataChange(
                                    //     item.id,
                                    //     _item.id === '1' ? 1 : 0,
                                    // );
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <View key={'xxx_1'} style={styles.checkItem}>
                            <Text style={styles.checkItemTitle}>{'管道电磁流量计检定证书是否有效期内'}</Text>
                            <SelectButton
                                editable={true}
                                style={{
                                    flexDirection: 'row',
                                    width: 120,
                                    paddingHorizontal: 10,
                                }}
                                conTainStyle={{ height: 44, width: 40 }}
                                imageStyle={{ width: 18, height: 18 }}
                                textStyle={{ color: '#666' }}
                                selectIndex={''}
                                data={[
                                    {
                                        title: '正常',
                                        id: '1',
                                    },
                                    {
                                        title: '异常',
                                        id: '0',
                                    },
                                ]}
                                onPress={(index, _item) => {
                                    // this.handleFormDataChange(
                                    //     item.id,
                                    //     _item.id === '1' ? 1 : 0,
                                    // );
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={[{ width: SCREEN_WIDTH - 26, backgroundColor: 'white' }]}
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
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormImagePicker
                            required={true}
                            label={'管道流量计外观'}
                            imageGridWidth={SCREEN_WIDTH - 40}
                            localId={''}
                            Imgs={
                                []
                            }
                            delCallback={(key) => {
                                // let delImgList = [].concat(BDJGPic);
                                // delImgList.splice(key, 1);
                                // dispatch(createAction('zbRepairRecordModel/updateState')({
                                //     BDJGPic: delImgList
                                // }));
                            }}
                            uploadCallback={(images) => {
                                // let addData = [].concat(BDJGPic);
                                // images.map((item) => {
                                //     addData.push({ AttachID: item.AttachID });
                                // });
                                // dispatch(createAction('zbRepairRecordModel/updateState')({
                                //     BDJGPic: addData
                                // }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}>
                        <FormImagePicker
                            required={true}
                            label={'管道流量计检定证书'}
                            imageGridWidth={SCREEN_WIDTH - 40}
                            localId={''}
                            Imgs={
                                []
                            }
                            delCallback={(key) => {
                                // let delImgList = [].concat(BDRYPic);
                                // delImgList.splice(key, 1);
                                // dispatch(createAction('zbRepairRecordModel/updateState')({
                                //     BDRYPic: delImgList
                                // }));
                            }}
                            uploadCallback={(images) => {
                                // let addData = [].concat(BDRYPic);
                                // images.map((item) => {
                                //     addData.push({ AttachID: item.AttachID });
                                // });
                                // dispatch(createAction('zbRepairRecordModel/updateState')({
                                //     BDRYPic: addData
                                // }));
                            }}
                        />
                    </View>
                    <View
                        style={[
                            styles.rowLayout, {}
                        ]}
                    >
                        <View style={[{
                            flexDirection: 'row', alignItems: 'center'
                            , width: SCREEN_WIDTH - 26
                        }]}>
                            {<Text style={[{
                                fontSize: 14,
                                color: globalcolor.textBlack
                            }, { color: 'red' }]}>*</Text>}
                            <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }, {
                                fontSize: 14,
                                color: globalcolor.textBlack
                            }]}>{'运维人员签字'}</Text>
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
                </View>
            </ScrollView>
            {isNewRecord() ? <View
                style={[{
                    width: SCREEN_WIDTH
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >
                <TouchableOpacity
                    style={styles.commit}
                    onPress={() => {
                        // this.commit();
                    }}
                >
                    <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                    <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                </TouchableOpacity>
            </View>
                : <View
                    style={[{
                        width: SCREEN_WIDTH
                        , flexDirection: 'row'
                        , justifyContent: 'space-around', alignItems: 'center'
                    }]}
                >
                    <TouchableOpacity
                        style={{
                            width: (SCREEN_WIDTH - 100) / 2,
                            marginVertical: 10,
                            marginBottom: 15,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#ee9944',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            // _delDialogRef.current.show();
                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>删除记录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: (SCREEN_WIDTH - 100) / 2,
                            marginTop: 10,
                            marginBottom: 15,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#4499f0',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            // this.commit();

                        }}
                    >
                        <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                        <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                    </TouchableOpacity>
                </View>}
            {/* <View
                style={[{
                    width: SCREEN_WIDTH
                    , justifyContent: 'center', alignItems: 'center'
                }]}
            >
                <TouchableOpacity
                    style={styles.commit}
                    onPress={() => {
                        // this.commit();
                    }}
                >
                    <Image style={{ width: 15, height: 15 }} source={require('../../../../../images/ic_commit.png')} />
                    <Text style={{ marginLeft: 20, fontSize: 15, color: '#ffffff' }}>提交保存</Text>
                </TouchableOpacity>
            </View> */}
        </StatusPage>
    )
}

const styles = StyleSheet.create({
    rowLayout: {
        width: SCREEN_WIDTH - 24,
        alignItems: 'center',
        backgroundColor: globalcolor.white,
        marginHorizontal: 12,
        paddingHorizontal: 6,
        // marginTop: 12,
        borderRadius: 4,
    },
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