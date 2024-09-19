/*
 * @Description: 上月委托第三方检测次数
 * @LastEditors: hxf
 * @Date: 2021-12-29 10:15:21
 * @LastEditTime: 2022-03-04 16:56:33
 * @FilePath: /SDLMainProject/app/operationContainers/taskViews/taskExecution/formViews/DetectionTimesForm.js
 */
import moment from 'moment';
import React, { Component } from 'react';
import { DeviceEventEmitter, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, DeclareModule, SimpleLoadingView, StatusPage } from '../../../../components';
import { SCREEN_WIDTH } from '../../../../components/SDLPicker/constant/globalsize';
import globalcolor from '../../../../config/globalcolor';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../../utils';
import FormDatePicker from '../components/FormDatePicker';
import FormInput from '../components/FormInput';
import FormText from '../components/FormText';

@connect(({ detectionTimesNewModel }) => ({
    detectionTimesRecordListResult: detectionTimesNewModel.detectionTimesRecordListResult,
    checkDate: detectionTimesNewModel.checkDate,
    checkTimes: detectionTimesNewModel.checkTimes,
    detectionTimesSaveResult: detectionTimesNewModel.detectionTimesSaveResult,
    detectionTimesDelResult: detectionTimesNewModel.detectionTimesDelResult
}))
export default class DetectionTimesForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            // title: '上月委托第三方检测次数',
            title: '第三方检测次数',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17 }, //标题居中
            headerRight: (
                <DeclareModule
                    contentRender={() => {
                        return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                    }}
                    options={{
                        headTitle: '说明',
                        innersHeight: 180,
                        messText: `在本表单上填写上月委托第三方检测次数，如果有则填写检测次数，如果没有则填写0。`,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '知道了',
                                btnStyle: { backgroundColor: '#fff' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => {}
                            }
                        ]
                    }}
                />
            )
        });

    constructor(props) {
        super(props);
        this.state = {
            // time:moment().format('YYYY-MM-DD HH:mm:ss'),
            // checkTimes:''
        };
    }

    componentDidMount() {
        this.props.dispatch(
            createAction('detectionTimesNewModel/updateState')({
                detectionTimesRecordListResult: { status: -1 },
                checkTimes: '',
                checkDate: moment()
                    .subtract(1, 'months')
                    .format('YYYY-MM-DD HH:mm:ss')
            })
        );
        const { ID } = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item'], {});
        this.props.dispatch(createAction('detectionTimesNewModel/getDetectionTimesRecordList')({ TypeID: `${ID}` }));
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }

    getCheckDateOption = () => {
        return {
            defaultTime: this.props.checkDate,
            type: 'month',
            onSureClickListener: time => {
                this.props.dispatch(
                    createAction('detectionTimesNewModel/updateState')({
                        checkDate: moment(time).format('YYYY-MM-DD HH:mm:ss')
                    })
                );
            }
        };
    };

    cancelButton = () => {};
    confirm = () => {
        this.props.dispatch(createAction('detectionTimesNewModel/deleteDetectionTimesRecord')({}));
    };

    render() {
        let options = {
            headTitle: '提示',
            messText: '确认删除委托第三方检测次数记录吗？',
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
        return (
            <StatusPage
                status={this.props.detectionTimesRecordListResult.status}
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: globalcolor.backgroundGrey }}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    // this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    // this.onRefresh();
                }}
            >
                <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: globalcolor.white, paddingHorizontal: 6 }]}>
                        <FormText label={'维护管理单位'} showString={SentencedToEmpty(this.props.detectionTimesRecordListResult, ['data', 'Datas', 'Record', 'Content', 'MaintenanceManagementUnit'], '--')} />
                        <FormText label={'安装地点'} showString={SentencedToEmpty(this.props.detectionTimesRecordListResult, ['data', 'Datas', 'Record', 'Content', 'PointPosition'], '--')} />
                        {/* <FormDatePicker 
                            required={true}
                            getPickerOption={this.getCheckDateOption}
                            label={'统计月份'} 
                            timeString={moment(this.props.checkDate).format('YYYY-MM')}
                        /> */}
                        <FormText label={'统计月份'} showString={moment(this.props.checkDate).format('YYYY-MM')} />
                        <FormInput
                            label="检测次数"
                            placeholder="只能填写正整数"
                            keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                            value={this.props.checkTimes}
                            onChangeText={text => {
                                this.props.dispatch(
                                    createAction('detectionTimesNewModel/updateState')({
                                        checkTimes: text
                                    })
                                );
                            }}
                        />
                    </View>
                </View>
                {SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'FormMainID'], '') != '' ? (
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: globalcolor.orange }, { marginVertical: 10 }]}
                        onPress={() => {
                            this.refs.doAlert.show();
                        }}
                    >
                        <View style={styles.button}>
                            <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                            <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>删除记录</Text>
                        </View>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                        this.props.dispatch(createAction('detectionTimesNewModel/addDetectionTimesRecord')({}));
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                    </View>
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.detectionTimesSaveResult.status == -1 ? <SimpleLoadingView message={'正在保存中'} /> : null}
                {this.props.detectionTimesDelResult.status == -1 ? <SimpleLoadingView message={'正在删除表单'} /> : null}
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    }
});
