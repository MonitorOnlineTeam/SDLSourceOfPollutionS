/*
 * @Description:
 * @LastEditors: hxf
 * @Date: 2023-09-20 14:55:47
 * @LastEditTime: 2024-10-15 16:01:55
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/chengTaoXiaoXi/ServiceReportRectification/ServiceReportRectificationAppeal.js
 */
import React, { Component } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../../components';
import ImageGrid from '../../../../components/form/images/ImageGrid';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../../config/globalsize';
import { createAction, createNavigationOptions, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast } from '../../../../utils';
import { UrlInfo } from '../../../../config';
import { getEncryptData } from '../../../../dvapack/storage';


@connect()
export default class ServiceReportRectificationAppeal extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '申诉',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        console.log('ServiceReportRectificationAppeal constructor props = ', props);
        this.state = {
            imageUUID: `appeal_${new Date().getTime()}`,
            Remark: '',
            images: [],
            nativeStatus: 200
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    cancelButton = () => { }
    confirm = () => {
        ShowLoadingToast('正在提交申诉信息')
        // 真正提交申诉
        // 2 不合格 4 已提交 5 申诉中
        const params = SentencedToEmpty(this.props
            , ['route', 'params', 'params'], {}
        )
        this.props.dispatch(
            createAction('CTServiceReportRectificationModel/auditService')({
                params: {
                    ...params,
                    files: this.state.imageUUID,
                    opinion: this.state.Remark,
                }
                , callback: () => {
                    ShowToast('申诉成功');
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(
                        createAction('CTServiceReportRectificationModel/getStayCheckServices')({}));
                    this.props.dispatch(createAction('CTServiceReportRectificationModel/GetServiceStatusNum')({}));
                }
            }));
    }

    renderDialog = () => {
        return (< AlertDialog options={{
            headTitle: '提示',
            messText: '确定要提交申诉吗？',
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
        }} ref="commitAlert" />)
    }

    render() {
        return (
            <View
                style={[
                    {
                        width: SCREEN_WIDTH,
                        flex: 1
                    }
                ]}
            >
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    minHeight: 107,
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        height: 44,
                                        width: SCREEN_WIDTH,
                                        paddingHorizontal: 19,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text>{'申诉描述'}</Text>
                            </View>
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        marginLeft: 19,
                                        height: 1,
                                        backgroundColor: '#EAEAEA'
                                    }
                                ]}
                            />
                            <TextInput
                                editable={this.isEdit()}
                                multiline={true}
                                placeholder={this.isEdit() ? '请填写备注' : '未填写备注信息'}
                                style={{
                                    width: SCREEN_WIDTH - 38 + 15,
                                    marginLeft: 19,
                                    marginRight: 4,
                                    minHeight: 40,
                                    marginTop: 4,
                                    marginBottom: 15,
                                    textAlignVertical: 'top',
                                    color: '#666666',
                                    fontSize: 15
                                }}
                                onChangeText={text => this.setState({ Remark: text })}
                            >
                                {`${this.state.Remark}`}
                            </TextInput>
                        </View>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    minHeight: 154,
                                    marginTop: 5,
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        height: 44,
                                        width: SCREEN_WIDTH,
                                        paddingHorizontal: 19,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text>{'申诉图片'}</Text>
                            </View>
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        marginLeft: 19,
                                        height: 1,
                                        backgroundColor: '#EAEAEA'
                                    }
                                ]}
                            />
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH,
                                        minHeight: 36
                                    }
                                ]}
                            >
                                <ImageGrid
                                    buttonPosition={'behind'}
                                    interfaceName={'netCore'}
                                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
                                    Imgs={SentencedToEmpty(this.state, ['images'], [])}
                                    UUID={this.state.imageUUID}
                                    uploadCallback={(items = []) => {
                                        let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                        let newCallbackImages = SentencedToEmpty(this.state, ['callbackImages'], [])
                                        // newCallbackImages.push(items[0].url);
                                        // newCallbackImages.push(items[0].AttachID);
                                        items.map((item, index) => {
                                            newCallbackImages.push(item.AttachID);
                                        });
                                        this.setState({
                                            images: newImages
                                            , callbackImages: newCallbackImages
                                        });

                                    }}
                                    delCallback={index => {
                                        let newImages = [].concat(SentencedToEmpty(this.state, ['images'], []));
                                        let newCallbackImages = [].concat(SentencedToEmpty(this.state, ['callbackImages'], []));
                                        newImages.splice(index, 1);
                                        newCallbackImages.splice(index, 1);
                                        this.setState({
                                            images: newImages
                                            , callbackImages: newCallbackImages
                                        });
                                    }}
                                />
                            </View>
                        </View>

                    </View>
                </ScrollView>

                {this.isEdit() ? <TouchableOpacity
                    onPress={() => {
                        // 提交
                        this.refs.commitAlert.show();
                    }}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 20,
                                marginLeft: 10,
                                height: 44,
                                borderRadius: 2,
                                backgroundColor: '#4DA9FF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginVertical: 20
                            }
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: 17,
                                    color: '#FEFEFE'
                                }
                            ]}
                        >
                            {'提交'}
                        </Text>
                    </View>
                </TouchableOpacity> : null}
                {
                    this.renderDialog()
                }
                {SentencedToEmpty(this.props, ['addAcceptanceServiceRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'正在提交申诉记录'} /> : null}
            </View>
        );
    }
}
