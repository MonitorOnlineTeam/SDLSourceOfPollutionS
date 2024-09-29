/*
 * @Description: 验收服务报告
 * @LastEditors: hxf
 * @Date: 2023-09-18 09:27:53
 * @LastEditTime: 2024-08-27 17:14:21
 * @FilePath: /SDLMainProject37/app/pOperationContainers/MissionVerification/MissionAbnormalRectification.js
 */
import React, { Component } from 'react'
import { Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, PickerSingleTimeTouchable, SimpleLoadingView, StatusPage } from '../../components';
import ImageGrid from '../../components/form/images/ImageGrid';
import globalcolor from '../../config/globalcolor';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../utils';
import moment from 'moment';

@connect(({ abnormalTask }) => ({
    updateCheckedRectificationResult: abnormalTask.updateCheckedRectificationResult
}))
export default class MissionAbnormalRectification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: SentencedToEmpty(props, ['route', 'params', 'params', 'ID'], ''),
            // TimeS: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AttachmentId'], new Date().getTime()),
            TimeS: `mxzg_${new Date().getTime()}`,
            // CompletionTime: moment().format('YYYY-MM-DD HH:00'),
            CompletionTime: '',
            remark: '',
            images: [],
            nativeStatus: 200
        };
        props.navigation.setOptions({
            title: '异常整改',
        });
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefreshWithLoading = () => {

    }

    onRefresh = () => {

    }


    // cancelButton = () => { }
    // confirm = () => {
    //     const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
    //     const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
    //     this.props.dispatch(createAction('CTModel/deleteAcceptanceServiceRecord')({
    //         params: {
    //             "mainId": this.props.dispatchId,
    //             "serviceId": serviceId,
    //             "recordId": recordId,
    //         }
    //     }));
    // }

    checkParams = () => {
        if (SentencedToEmpty(this.state, ['CompletionTime'], '') == '') {
            ShowToast('完成时间为必填项');
            return false;
        } else if (SentencedToEmpty(this.state, ['images'], []).length == 0) {
            ShowToast('整改材料为必填项');
            return false;
        } else {
            return true;
        }
    }

    isEdit = () => {
        return true;
    }

    getCompletionTimeOption = index => {
        let type = 'hour';

        return {
            // defaultTime: this.state.CompletionTime,
            defaultTime: moment().format('YYYY-MM-DD HH:00'),
            type: type,
            onSureClickListener: time => {
                this.setState({
                    CompletionTime: moment(time).format('YYYY-MM-DD HH:mm')
                });
            }
        };
    };

    cancelButton = () => { }
    confirm = () => {
        if (this.checkParams()) {
            this.props.dispatch(createAction('abnormalTask/updateCheckedRectification')({
                params: {
                    "id": this.state.ID,
                    "rectificationDes": this.state.remark,  // 整改描述
                    "rectificationMaterial": this.state.TimeS, // 图片id
                    "completeTime": this.state.CompletionTime // 完成时间 精确到小时
                }
            }));
        }
    }

    render() {
        console.log('state = ', this.state);
        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要提交此整改记录吗？',
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
        return (<StatusPage
            status={200}
            // status={SentencedToEmpty(this.props
            //     , ['acceptanceServiceRecordResult', 'status'], 1000)}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，  
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onRefreshWithLoading();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefreshWithLoading();
            }}
        >
            <View style={[{
                width: SCREEN_WIDTH, flex: 1
            }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View
                        style={[{
                            width: SCREEN_WIDTH
                        }]}
                    >

                        <View style={[{
                            width: SCREEN_WIDTH, minHeight: 107
                            , marginTop: 5, backgroundColor: 'white'
                        }]}>
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH
                                , paddingHorizontal: 19, justifyContent: 'center'
                            }]}>
                                <Text>{'整改描述'}</Text>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 38, marginLeft: 19
                                    , height: 1, backgroundColor: '#EAEAEA'
                                }]}
                            />
                            <TextInput
                                editable={this.isEdit()}
                                multiline={true}
                                placeholder={true ? '请填写备注' : '暂无备注信息'}
                                style={{
                                    width: SCREEN_WIDTH - 38 + 15
                                    , marginLeft: 19, marginRight: 4, minHeight: 40
                                    , marginTop: 4, marginBottom: 15
                                    , textAlignVertical: 'top', color: '#666666'
                                    , fontSize: 15
                                }}
                                onChangeText={text => this.setState({ remark: text })}
                            >
                                {`${this.state.remark}`}
                            </TextInput>
                        </View>

                        <View style={[{
                            width: SCREEN_WIDTH,
                            height: 46,
                            backgroundColor: 'white',
                            alignItems: 'center'
                        }]}>
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        height: 1,
                                        backgroundColor: '#EAEAEA'
                                    }
                                ]}
                            />
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH,
                                        height: 44,
                                        paddingHorizontal: 20,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text
                                    style={[
                                        {
                                            fontSize: 14,
                                            color: '#333333'
                                        }
                                    ]}
                                >
                                    {'完成时间'}
                                </Text>
                                <PickerSingleTimeTouchable
                                    available={this.isEdit()}
                                    option={this.getCompletionTimeOption()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 0, height: 25 }}>
                                    <Text style={{ fontSize: 14, color: '#666' }}>{`${this.state.CompletionTime == '' ? '' : moment(this.state.CompletionTime).format('YYYY-MM-DD HH:mm')}`}</Text>
                                    <Image style={[{ height: 15, width: 15 }]} source={require('../../images/ic_arrows_right.png')} />
                                </PickerSingleTimeTouchable>
                            </View>
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        height: 1,
                                        backgroundColor: '#EAEAEA'
                                    }
                                ]}
                            />
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH, minHeight: 154
                                , backgroundColor: 'white'
                            }]}
                        >
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH, flexDirection: 'row'
                                , paddingHorizontal: 19, alignItems: 'center'
                            }]}>
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text>{'整改材料'}</Text>
                            </View>
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 38, marginLeft: 19
                                    , height: 1, backgroundColor: '#EAEAEA'
                                }]}
                            />
                            <View style={[{
                                width: SCREEN_WIDTH
                            }]}>
                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'DataAnalyze'}
                                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    Imgs={SentencedToEmpty(this.state
                                        , ['images']
                                        , []
                                    )}
                                    UUID={this.state.TimeS}
                                    uploadCallback={items => {
                                        let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                        this.setState({
                                            images: newImages
                                        });
                                    }}
                                    delCallback={index => {
                                        let newImages = [].concat(SentencedToEmpty(this.state, ['images'], []));
                                        newImages.splice(index, 1);
                                        this.setState({
                                            images: newImages
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {
                    !this.isEdit() ? null : <TouchableOpacity
                        onPress={() => {
                            if (this.checkParams()) {
                                this.refs.doAlert.show();
                            }
                        }}
                    >
                        <View style={[{
                            width: SCREEN_WIDTH - 20, marginLeft: 10
                            , height: 44, borderRadius: 2
                            , backgroundColor: '#4DA9FF'
                            , justifyContent: 'center', alignItems: 'center'
                            , marginVertical: 20
                        }]}>
                            <Text style={[{
                                fontSize: 17, color: '#FEFEFE'
                            }]}>{'整改'}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            <AlertDialog options={alertOptions} ref="doAlert" />
            {SentencedToEmpty(this.props, ['updateCheckedRectificationResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'提交中'} /> : null}
            {/* {SentencedToEmpty(this.props, ['deleteAcceptanceServiceRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'删除中'} /> : null} */}
        </StatusPage>
        )
    }
}
