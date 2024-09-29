//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import MyTextInput from '../../../../components/base/TextInput';
import { ModalParent, PickerSingleTimeTouchable, SimpleLoadingComponent } from '../../../../components';
import Mask from '../../../../components/Mask';
import ConfirmDialog from '../components/ConfirmDialog';
import { ShowToast, createAction, NavigationActions, SentencedToEmpty } from '../../../../utils';
import PickerView from '../../../../components/SDLPicker/PickerView';

const ic_filt_arrows = require('../../../../images/ic_filt_arrows.png');

/**
 * 校准记录表
 */

// create a component
@connect(({ calibrationRecord }) => ({
    MainInfo: calibrationRecord.MainInfo,
    editstatus: calibrationRecord.editstatus,
}))
// @connect()
class CalibrationRecordTime extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerMode: 'float',
            title: '校准执行时间',
            animationEnabled: false,
            headerBackTitle: null,
            headerTintColor: '#ffffff',
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS == 'android' ? 75 : 13 }, //标题居中
            headerStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                height: 45
                //elevation: 0//去掉header下方的阴影
                //borderBottomWidth: 0,//去掉ios下的分割线
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    getBeginTimeSelectOption = () => {
        return {
            defaultTime: SentencedToEmpty(this.props.MainInfo, ['AdjustStartTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newMainInfo = { ...this.props.MainInfo };
                newMainInfo.AdjustDate = moment(time).format('YYYY-MM-DD');
                newMainInfo.AdjustStartTime = moment(time).format('YYYY-MM-DD HH:mm');
                this.props.dispatch(createAction('calibrationRecord/updateState')({ MainInfo: newMainInfo }));
            }
        };
    };

    getEndTimeSelectOption = () => {
        return {
            defaultTime: SentencedToEmpty(this.props.MainInfo, ['AdjustEndTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: 'minute',
            onSureClickListener: time => {
                let newMainInfo = { ...this.props.MainInfo };
                newMainInfo.AdjustEndTime = moment(time).format('YYYY-MM-DD HH:mm');
                this.props.dispatch(createAction('calibrationRecord/updateState')({ MainInfo: newMainInfo }));
            }
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={[{ width: SCREEN_WIDTH, flex: 1 }]} showsVerticalScrollIndicator={false}>
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 28,
                                    marginVertical: 12
                                }
                            ]}
                        />
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 24,
                                    paddingHorizontal: 24,
                                    borderRadius: 2,
                                    backgroundColor: globalcolor.white
                                }
                            ]}
                        >
                            <View style={[styles.layoutWithBottomBorder]}>
                                <Text style={[styles.labelStyle]}>校准开始时间：</Text>
                                <PickerSingleTimeTouchable option={this.getBeginTimeSelectOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{SentencedToEmpty(this.props.MainInfo, ['AdjustStartTime'], moment().format('YYYY-MM-DD HH:mm'))}</Text>
                                    <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={ic_filt_arrows} />
                                </PickerSingleTimeTouchable>
                            </View>
                            <View style={[styles.layoutWithBottomBorder, { marginBottom: 20 }]}>
                                <Text style={[styles.labelStyle]}>校准结束时间：</Text>
                                <PickerSingleTimeTouchable option={this.getEndTimeSelectOption()} style={{ flexDirection: 'row', height: 45, alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{SentencedToEmpty(this.props.MainInfo, ['AdjustEndTime'], moment().format('YYYY-MM-DD HH:mm'))}</Text>
                                    <Image style={{ width: 10, height: 10, marginLeft: 4 }} source={ic_filt_arrows} />
                                </PickerSingleTimeTouchable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: globalcolor.blue }, { marginVertical: 20 }]}
                    onPress={() => {
                        let newMainInfo = { ...this.props.MainInfo };
                        if (SentencedToEmpty(this.props.MainInfo, ['AdjustStartTime'], '') == '' || SentencedToEmpty(this.props.MainInfo, ['AdjustEndTime'], '') == '') {
                            newMainInfo.AdjustStartTime = SentencedToEmpty(this.props.MainInfo, ['AdjustStartTime'], moment().format('YYYY-MM-DD HH:mm'));
                            newMainInfo.AdjustEndTime = SentencedToEmpty(this.props.MainInfo, ['AdjustEndTime'], moment().format('YYYY-MM-DD HH:mm'));
                        }
                        this.props.dispatch(createAction('calibrationRecord/updateState')({ MainInfo: newMainInfo }));
                        this.props.dispatch(
                            createAction('calibrationRecord/saveItem')({
                                index: this.props.route.params.params.index,
                                record: null,
                                callback: () => {
                                    this.props.dispatch(createAction('calibrationRecord/getInfo')({ createForm: false }));
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                >
                    <View style={styles.button}>
                        <Image style={{ tintColor: globalcolor.white, height: 16, width: 18 }} resizeMode={'contain'} source={require('../../../../images/icon_submit.png')} />
                        <Text style={[{ color: globalcolor.whiteFont, fontSize: 15, marginLeft: 8 }]}>确定提交</Text>
                    </View>
                </TouchableOpacity>
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey
    },
    layoutWithBottomBorder: {
        flexDirection: 'row',
        height: 45,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: globalcolor.borderBottomColor,
        alignItems: 'center'
    },
    labelStyle: {
        fontSize: 14,
        color: globalcolor.taskImfoLabel
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    innerlayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        color: globalcolor.taskFormLabel,
        flex: 1
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18
    },
    button: {
        flexDirection: 'row',
        height: 46,
        width: 282,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28
    },
    lastItem: {
        flexDirection: 'row',
        height: 45,
        marginBottom: 10,
        alignItems: 'center'
    }
});

//make this component available to the app
export default CalibrationRecordTime;
