/*
 * @Description: 申诉
 * @LastEditors: hxf
 * @Date: 2024-03-29 16:56:12
 * @LastEditTime: 2024-03-29 18:58:17
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/EquipmentAuditRectificationAppeal.js
 */
// import { Text, View } from 'react-native'
// import React, { Component } from 'react'

// export default class EquipmentAuditRectificationAppeal extends Component {
//     render() {
//         return (
//             <View>
//                 <Text>EquipmentAuditRectificationAppeal</Text>
//             </View>
//         )
//     }
// }

import React, { Component } from 'react'
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux';
import { AlertDialog, SimpleLoadingView, StatusPage } from '../../../components';
import ImageGrid from '../../../components/form/images/ImageGrid';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';

@connect(({ CTModel, CT7FormModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    publicRecordResult: CT7FormModel.publicRecordResult,
    addPublicRecordResult: CT7FormModel.addPublicRecordResult,
    deletePublicRecordResult: CT7FormModel.deletePublicRecordResult,
}))
export default class EquipmentAuditRectificationAppeal extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            // title: SentencedToEmpty(navigation, ['state', 'params', 'secondItem', 'RecordName'], '跳转时未提供标题信息'),
            title: '申诉',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            TimeS: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AttachmentId'], new Date().getTime()),
            remark: '',
            images: [],
            nativeStatus: 200
        };
    }

    componentDidMount() {
        this.onRefresh();
        this.getImageTitle();
    }

    onRefresh = () => {
        if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
            this.setState({
                nativeStatus: -1
            });
            const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            this.props.dispatch(createAction('CT7FormModel/getPublicRecord')({
                params: {
                    "mainId": this.props.dispatchId,
                    "serviceId": serviceId,
                    "recordId": recordId,
                }
                , callback: (result) => {
                    const data = SentencedToEmpty(result, ['data', 'Datas', 0], {});
                    let newImages = [];
                    SentencedToEmpty(data, ['FileList', 'ImgList'], []).map((item, index) => {
                        newImages.push(
                            { AttachID: SentencedToEmpty(data, ['FileList', 'ImgNameList', index], ''), url: item }
                        );
                    })
                    this.setState({
                        TimeS: SentencedToEmpty(data, ['FileId'], new Date().getTime()),
                        remark: SentencedToEmpty(data, ['Remark'], ''),
                        images: newImages,
                        nativeStatus: 200
                    }, () => {
                        this.props.dispatch(createAction('CT7FormModel/updateState')({
                            publicRecordResult: result
                        }))
                    });
                    return true
                }
            }));
        } else {
            this.setState({
                nativeStatus: 200
            });
        }
    }


    cancelButton = () => { }
    confirm = () => {
        const data = SentencedToEmpty(this.props
            , ['navigation', 'state', 'params', 'data'], {});
        const remark = SentencedToEmpty(this
            , ['state', 'remark'], '');
        let appealParams = {
            "equipmentAuditId": data.EquipmentAuditId, // 审核表id 列表有
            "opinion": remark, // 申诉描述
            "appealFiles": this.state.TimeS, // 申诉图片
            "projectCode": data.ProjectCode, // 项目号 列表有
            "entName": data.EntName, // 企业名称  列表有
            "pointName": data.PointName  // 监测点名称 列表有
        };
        this.props.dispatch(createAction('CTEquipmentPicAuditModel/equipmentAuditRectificationAppeal')({
            params: appealParams,
        }));
    }

    getImageTitle = () => {
        return '申诉图片';
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let alertOptions = {
            headTitle: '提示',
            messText: '是否确定要提交申诉吗？',
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
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onRefresh();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onRefresh();
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
                            , backgroundColor: 'white'
                        }]}>
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH, flexDirection: 'row'
                                , paddingHorizontal: 19, alignItems: 'center'
                            }]}>
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text>{'申诉描述'}</Text>
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
                                placeholder={true ? '请填写' : '暂无信息'}
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
                        <View
                            style={[{
                                width: SCREEN_WIDTH, minHeight: 154
                                , backgroundColor: 'white', marginTop: 5
                            }]}
                        >
                            <View style={[{
                                height: 44, width: SCREEN_WIDTH, flexDirection: 'row'
                                , paddingHorizontal: 19, alignItems: 'center'
                            }]}>
                                {/* <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text> */}
                                <Text>{`${this.getImageTitle()}`}</Text>
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
                                    interfaceName={'netCore'}
                                    style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                    Imgs={SentencedToEmpty(this.state
                                        , ['images']
                                        , []
                                    )}
                                    isUpload={this.isEdit()}
                                    isDel={this.isEdit()}
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
                            const data = SentencedToEmpty(this.props
                                , ['navigation', 'state', 'params', 'data'], {});
                            const remark = SentencedToEmpty(this
                                , ['state', 'remark'], '');
                            if (remark == '') {
                                ShowToast('申诉描述不能为空');
                                return;
                            }
                            this.refs.doAlert.show();
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
                            }]}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
            <AlertDialog options={alertOptions} ref="doAlert" />
            {SentencedToEmpty(this.props, ['addPublicRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'提交中'} /> : null}
            {SentencedToEmpty(this.props, ['deletePublicRecordResult', 'status'], 200) == -1 ? <SimpleLoadingView message={'删除中'} /> : null}
        </StatusPage>
        )
    }
}
