/*
 * @Description: 遗留问题表单 
 * @LastEditors: hxf
 * @Date: 2024-03-21 19:10:33
 * @LastEditTime: 2024-07-10 10:11:51
 * @FilePath: /SDLMainProject37/app/pOperationContainers/tabView/chengTaoXiaoXi/LeftoverProblem.js
 */
import { Platform, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import Form2Switch from '../../../operationContainers/taskViews/taskExecution/components/Form2Switch';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import ImageGrid from '../../../components/form/images/ImageGrid';
import globalcolor from '../../../config/globalcolor';
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';

@connect(({ CTServiceStatisticsModel, CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    leftoverProblemResult: CTServiceStatisticsModel.leftoverProblemResult,
    leftoverProblemHasData: CTServiceStatisticsModel.leftoverProblemHasData, //
    leftoverProblemProblemDescription: CTServiceStatisticsModel.leftoverProblemProblemDescription,
    leftoverProblemImageUUID: CTServiceStatisticsModel.leftoverProblemImageUUID,
    leftoverProblemImageList: CTServiceStatisticsModel.leftoverProblemImageList, // 图片
}))
export default class LeftoverProblem extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '遗留问题填报',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            // TimeS: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'item', 'AttachmentId'], new Date().getTime()),
            // remark: '',
            // images: [],
            // nativeStatus: 200
        };
    }

    componentDidMount() {
        this.onRefreshWithLoading();
    }

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    getPageStatus = () => {
        return SentencedToEmpty(this.props, ['leftoverProblemResult', 'status'], 1000);
    }

    onRefreshWithLoading = () => {
        console.log('onRefreshWithLoading');
        this.props.dispatch(
            createAction('CTServiceStatisticsModel/updateState')({
                leftoverProblemHasData: null,
                leftoverProblemProblemDescription: '',
                leftoverProblemResult: { status: -1 },
                leftoverProblemImageUUID: new Date().getTime(),
                leftoverProblemImageList: [],
            }));
        this.props.dispatch(createAction('CTServiceStatisticsModel/getProblemsServiceRecord')({
            params: {}
        }));
    }

    render() {
        return (<StatusPage
            status={this.getPageStatus()}
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
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View style={[{
                    width: SCREEN_WIDTH, height: 44
                    , paddingHorizontal: 20
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#fff'
                }]}>
                    <Form2Switch
                        editable={this.isEdit()}
                        required={true}
                        label='是否有遗留问题'
                        data={[{ name: '是', value: true }, { name: '否', value: false }]}
                        value={this.props.leftoverProblemHasData}
                        onChange={(value) => {
                            let params = {
                                leftoverProblemHasData: value
                            }
                            this.props.dispatch(
                                createAction('CTServiceStatisticsModel/updateState')(params));
                        }}
                    />
                </View>
                {
                    SentencedToEmpty(this.props, ['leftoverProblemHasData'], false)
                        ? <View
                            style={[{
                                width: SCREEN_WIDTH, backgroundColor: '#fff',
                                alignItems: 'center', marginTop: 5
                            }]}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH - 40, paddingTop: 12
                                }]}
                            >
                                <FormTextArea
                                    editable={this.isEdit()}
                                    required={true}
                                    label='问题描述'
                                    placeholder=''
                                    value={this.props.leftoverProblemProblemDescription}
                                    onChangeText={(text) => {
                                        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                            leftoverProblemProblemDescription: text
                                        }));
                                    }}
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
                                    <Text
                                        style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}
                                    >{`${'附件'}`}</Text>
                                </View>
                                <View style={[{
                                    width: SCREEN_WIDTH
                                }]}>
                                    <ImageGrid
                                        buttonPosition={'behind'}
                                        interfaceName={'netCore'}
                                        style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                        Imgs={SentencedToEmpty(this.props
                                            , ['leftoverProblemImageList']
                                            , []
                                        )}
                                        isUpload={this.isEdit()}
                                        isDel={this.isEdit()}
                                        UUID={this.props.leftoverProblemImageUUID}
                                        uploadCallback={items => {
                                            // let newImages = SentencedToEmpty(this.state, ['images'], []).concat(items);
                                            // this.setState({
                                            //     images: newImages
                                            // });
                                        }}
                                        delCallback={index => {
                                            // let newImages = [].concat(SentencedToEmpty(this.state, ['images'], []));
                                            // newImages.splice(index, 1);
                                            // this.setState({
                                            //     images: newImages
                                            // });
                                        }}
                                    />
                                </View>
                            </View>
                        </View> : null
                }
                <View style={[{ flex: 1, width: SCREEN_WIDTH }]} />
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 75
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    {this.isEdit() ? <TouchableOpacity
                        onPress={() => {
                            if (typeof this.props.leftoverProblemHasData
                                != 'boolean'
                            ) {
                                ShowToast('是否有遗留问题表单为必填项');
                                return;
                            }
                            if (typeof this.props.leftoverProblemHasData
                                == 'boolean' && !this.props.leftoverProblemHasData) {
                                ShowLoadingToast('正在提交');
                                this.props.dispatch(createAction('CTServiceStatisticsModel/addOrUpdProblemsServiceRecord')({
                                    params: {}
                                }));
                            } else {
                                if (typeof this.props.leftoverProblemProblemDescription
                                    != 'string' || this.props.leftoverProblemProblemDescription.length <= 0
                                ) {
                                    ShowToast('问题描述为必填项');
                                    return;
                                }
                                ShowLoadingToast('正在提交');
                                this.props.dispatch(createAction('CTServiceStatisticsModel/addOrUpdProblemsServiceRecord')({
                                    params: {}
                                }));
                            }


                        }}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 20, height: 44
                                , borderRadius: 2, backgroundColor: '#4DA9FF'
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity> : null}
                </View>
            </View>
        </StatusPage>)
    }
}