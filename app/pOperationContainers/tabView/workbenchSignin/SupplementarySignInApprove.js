import { Platform, ScrollView, Text, View, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { Component } from 'react'
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import ImageGrid from '../../../components/form/images/ImageGrid';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import globalcolor from '../../../config/globalcolor';
import { connect } from 'react-redux';
import { AlertDialog, StatusPage } from '../../../components';
import moment from 'moment';

@connect(({ signInModel }) => ({
    updAndRevokeStatusResult: signInModel.updAndRevokeStatusResult
}))
export default class SupplementarySignInApprove extends Component {

    static navigationOptions = ({ navigation }) => {
        const editType = SentencedToEmpty(navigation
            , [
                'state', 'params', 'item', 'editType'
            ], 'uploader');
        return createNavigationOptions({
            title: editType == 'approver' ? '审批' : '补签记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            refusalCause: ''
        };
    }

    componentDidMount() {
        const editType = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'item', 'editType'], '');

        if (editType == 'uploader') {
            // 设置加载状态
            this.props.dispatch(createAction('signInModel/updateState')({
                updAndRevokeStatusResult: { status: -1 }
            }));
            this.props.dispatch(createAction('signInModel/getUpdAndRevokeStatus')(
                {
                    params: {
                        appID: SentencedToEmpty(this.props
                            , ['route', 'params', 'params', 'item', 'ID'], ''),// 审核ID
                    }
                }
            ));
        }

    }

    getStatusText = (status = 0) => {
        if (status == 0) {
            return (<Text style={[{ fontSize: 12, color: '#F6A821' }]}>{
                `${'审批中'}`
            }</Text>)
        } else if (status == 2) {
            return (<Text style={[{ fontSize: 12, color: '#FF4141' }]}>{
                `${'审批未通过'}`
            }</Text>)
        } else if (status == 1) {
            return (<Text style={[{ fontSize: 12, color: '#3AD583' }]}>{
                `${'审批通过'}`
            }</Text>)
        } else if (status == 4) {
            return (<Text style={[{ fontSize: 12, color: '#3AD583' }]}>{
                `${'补签已撤销'}`
            }</Text>)
        } else {
            return (<View></View>);
        }
    }

    isEdit = () => {
        return false;
    }

    // 审批
    examApplication = isConsent => {
        let params = {};
        // params.appID = this.props.currentApproval.ID;
        params.appID = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'item', 'ID'], '');
        if (isConsent) {
            params.examStaus = 1;
            params.examMsg = SentencedToEmpty(this.state, ['refusalCause'], '同意') || '同意';
        } else {
            params.examStaus = 2;
            params.examMsg = SentencedToEmpty(this.state, ['refusalCause'], '拒绝');
        }
        this.props.dispatch(
            createAction('approvalModel/examApplication')({
                params,
                callback: () => {
                    ShowToast('审批完成')
                    this.props.dispatch(createAction('approvalModel/getTaskListRight')({
                        params: {
                            type: '0',
                            pageIndex: 1,
                            pageSize: 10
                        }
                    }));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };

    cancelButton = () => { }

    withdrawConfirm = () => {
        // 确认撤销，真实调用撤销接口
        this.props.dispatch(createAction('signInModel/revokeApproved')(
            {
                params: {
                    appID: SentencedToEmpty(this.props
                        , ['route', 'params', 'params', 'item', 'ID'], ''),// 审核ID
                }
            }
        ));
    }

    approveConfirm = () => {
        // 确认审批通过
        this.examApplication(true);
    }

    refuseConfirm = () => {
        // 确认 拒绝申请
        this.examApplication(false);
    }

    // 补签日期字符串
    getSupplementaryTargetDateStr = () => {
        const itemData = SentencedToEmpty(this.props
            , ['route', 'state', 'params', 'item'], {});
        const SupplementaryTargetDate = SentencedToEmpty(itemData, ['SupplementaryTargetDate'], '')
        if (SupplementaryTargetDate == '') {
            return '--------'
        } else {
            const SupplementaryTargetDateMoment = moment(SupplementaryTargetDate);
            if (SupplementaryTargetDateMoment.isValid()) {

                return SupplementaryTargetDateMoment.format('YYYY-MM-DD');
            } else {
                return '--------'
            }
        }
    }

    render() {
        const itemData = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'item'], {});
        const editType = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'item', 'editType'], '');
        const withdrawApplicationOptions = {
            headTitle: '提示',
            messText: '是否确定要撤销这条申请？',
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
                    onpress: this.withdrawConfirm
                }
            ]
        };

        const approveOptions = {
            headTitle: '提示',
            messText: '是否确定要通过这条申请？',
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
                    onpress: this.approveConfirm
                }
            ]
        };

        const refuseOptions = {
            headTitle: '提示',
            messText: '是否确定要拒绝这条申请？',
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
                    onpress: this.refuseConfirm
                }
            ]
        };

        return (<StatusPage
            status={SentencedToEmpty(this.props, ['updAndRevokeStatusResult', 'status'], 200)}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                this.onFreshData();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                this.onFreshData();
            }}
        >
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , backgroundColor: '#f2f2f2'
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH, height: 64
                                , paddingHorizontal: 20, justifyContent: 'center'
                                , backgroundColor: '#fff'
                            }]}
                        >
                            <Text style={[{ marginBottom: 10, fontSize: 15, color: '#333' }]}>{
                                `${SentencedToEmpty(itemData, ['ImpPerson'], '')}提交的申诉记录`
                            }</Text>
                            {
                                this.getStatusText(SentencedToEmpty(itemData, ['ExamStatus'], 0))
                            }
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH
                                , paddingVertical: 15
                                , paddingLeft: 20, justifyContent: 'space-between'
                                , backgroundColor: '#fff', marginTop: 5
                            }]}
                        >
                            <Text style={[{ marginBottom: 10, fontSize: 14, color: '#999999' }]}>
                                {`审批编号：${SentencedToEmpty(itemData, ['ExamNumber'], '')}`}
                            </Text>
                            <Text style={[{ marginBottom: 8, fontSize: 14, color: '#333333' }]}>
                                {`${'补签日期：'}`}
                                <Text style={[{ fontSize: 14, color: '#999999' }]}>{
                                    `${this.getSupplementaryTargetDateStr()}`
                                }</Text>
                            </Text>
                            <Text style={[{ marginBottom: 8, fontSize: 14, color: '#333333' }]}>
                                {`${'现场类型：'}`}
                                <Text style={[{ fontSize: 14, color: '#999999' }]}>{
                                    `${SentencedToEmpty(itemData, ['WorkType'], '')}`
                                }</Text>
                            </Text>
                            <Text style={[{ marginBottom: 8, fontSize: 14, color: '#333333' }]}>
                                {`${'补签类型：'}`}
                                <Text style={[{ fontSize: 14, color: '#999999' }]}>{
                                    `${SentencedToEmpty(itemData, ['RepairSignType'], '')}`
                                }</Text>
                            </Text>
                            {SentencedToEmpty(itemData, ['ArriveTime'], '') != '' ? <Text style={[{ marginBottom: 8, fontSize: 14, color: '#333333' }]}>
                                {`${'到达时间：'}`}
                                <Text style={[{ fontSize: 14, color: '#999999' }]}>{
                                    `${SentencedToEmpty(itemData, ['ArriveTime'], '')}`
                                }</Text>
                            </Text> : null}
                            {SentencedToEmpty(itemData, ['LeaveTime'], '') != '' ? <Text style={[{ marginBottom: 8, fontSize: 14, color: '#333333' }]}>
                                {`${'离开时间：'}`}
                                <Text style={[{ fontSize: 14, color: '#999999' }]}>{
                                    `${SentencedToEmpty(itemData, ['LeaveTime'], '')}`
                                }</Text>
                            </Text> : null}
                            <Text style={[{ marginBottom: 4, fontSize: 14, color: '#333333' }]}>
                                {`${'申诉附件：'}`}
                            </Text>
                            <ImageGrid
                                style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 10, backgroundColor: '#fff' }}
                                Imgs={SentencedToEmpty(itemData, ['File'], [])}
                                isUpload={this.isEdit()}
                                isDel={this.isEdit()}
                                UUID={'AttachmentsId123456'}
                                uploadCallback={items => {

                                }}
                                delCallback={index => {

                                }}
                            />
                            <View
                                style={[{ width: SCREEN_WIDTH - 40 }]}
                            >
                                <FormTextArea
                                    label={'补签说明：'}
                                    labelStyle={{ fontSize: 14, color: '#666666' }}
                                    inputStyle={{
                                        fontSize: 14, color: '#666666', flex: 1, marginBottom: 0
                                        , lineHeight: 18
                                    }}
                                    last={true}
                                    editable={false}
                                    // value={'问题描述内容测试文字'}
                                    // value={'修改应用版本号只需要修改apktool.yml即可,apktool.yml文件中找到versionCode,修改里面的versionCode对应的值保存即可。 3:通过修改后的文件重新回编成apk文件 然后就是再使用下面的'}
                                    value={SentencedToEmpty(itemData, ['Msg'], '未填写补签说明')}
                                />
                            </View>
                        </View>

                        <View style={{
                            width: SCREEN_WIDTH, flex: 1, marginTop: 5
                            , backgroundColor: '#ffffff'
                            , paddingHorizontal: 20, paddingTop: 10
                        }}>
                            <Text style={[{ marginBottom: 10, fontSize: 14, color: '#333333' }]}>
                                {`${'流程'}`}
                            </Text>
                            <SignInApproveTimeLine
                                timeLineList={SentencedToEmpty(itemData, ['logMsgList'], [])}
                            />
                        </View>
                    </View>
                </ScrollView >
                {editType == 'approver' ? <View
                    style={[{
                        width: SCREEN_WIDTH, height: 220
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH, height: 140
                            , alignItems: 'center'
                        }]}
                    >
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 120
                            , borderRadius: 8, backgroundColor: '#fff'
                            , marginTop: 20, padding: 10
                            , alignItems: 'center'
                        }]}>
                            <View style={[{ width: SCREEN_WIDTH - 60, flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={[{ marginVertical: 10, fontSize: 15, color: globalcolor.taskImfoLabel }]}>{'拒绝原因'}</Text>
                            </View>
                            <TextInput
                                onChangeText={text => {
                                    this.setState({
                                        refusalCause: text
                                    });
                                }}
                                style={[
                                    {
                                        height: 60,
                                        width: SCREEN_WIDTH - 60,
                                        marginBottom: 20,
                                        color: globalcolor.datepickerGreyText,
                                        fontSize: 15,
                                        textAlign: 'left',
                                        textAlignVertical: 'top',
                                        padding: 4
                                    }
                                ]}
                                multiline={true}
                                value={this.state.refusalCause}
                                placeholder={'请输入拒绝原因'}
                                placeholderTextColor={'#999999'}
                            />
                        </View>
                    </View>
                    <View style={[{
                        height: 80, width: SCREEN_WIDTH
                        , flexDirection: 'row', alignItems: 'center'
                        , justifyContent: 'space-around'
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                // this.examApplication(false);
                                this.refs.refuseAlert.show();
                            }}
                        >
                            <View
                                style={[{
                                    height: 44, width: 105
                                    , backgroundColor: '#E6E6E6', borderRadius: 2
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{
                                    color: '#666666', fontSize: 17
                                }]}>{'拒绝'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // 审批通过前需要询问用户确认
                                this.refs.approveAlert.show();
                            }}
                        >
                            <View
                                style={[{
                                    height: 44, width: 105
                                    , backgroundColor: '#4DA9FF', borderRadius: 2
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{
                                    color: '#FEFEFE', fontSize: 17
                                }]}>{'同意'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                    : editType == 'uploader' && itemData.ExamStatus != 1
                        && SentencedToEmpty(this.props, ['updAndRevokeStatusResult', 'data', 'Datas'], false)
                        ? <View
                            ps={'itemData.ExamStatus == 1 是审核通过'}
                            style={[{
                                height: 80, width: SCREEN_WIDTH
                                , flexDirection: 'row', alignItems: 'center'
                                , justifyContent: 'space-around'
                            }]}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 加载进度
                                    // 获取数据
                                    // 拿到数据跳转
                                    ShowLoadingToast('加载修改数据');

                                    this.props.dispatch(createAction('signInModel/updateApproved')(
                                        {
                                            params: {
                                                appID: SentencedToEmpty(this.props
                                                    , ['route', 'params', 'params', 'item', 'ID'], ''),// 审核ID
                                            }, successCallback: (response) => {
                                                console.log('successCallback');
                                                // 关闭进度
                                                CloseToast();
                                                // 跳转编辑页面
                                                this.props.dispatch(createAction('signInModel/getSupplementarySignInType')({
                                                    params: {}
                                                }));
                                                this.props.dispatch(createAction('signInModel/getAllSignInEntList')({
                                                    params: {}
                                                }));
                                                // this.props.dispatch(NavigationActions.navigate({
                                                //     routeName: 'SupplementarySignIn',
                                                //     params: {

                                                //     }
                                                // }));
                                                this.props.dispatch(NavigationActions.navigate({
                                                    routeName: 'SupplementarySignIn',
                                                    params: {

                                                    }
                                                }));
                                                console.log('successCallback end');

                                            }, failureCallback: (error) => {
                                                // 关闭进度
                                                CloseToast();
                                                // 报错
                                            }
                                        }
                                    ));
                                }}
                            >
                                <View
                                    style={[{
                                        height: 44, width: 105
                                        , backgroundColor: '#4DA9FF', borderRadius: 2
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{
                                        color: '#FEFEFE', fontSize: 17
                                    }]}>{'修改'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    // 撤销前需要询问用户确认
                                    this.refs.withdrawApplicationAlert.show();
                                }}
                            >
                                <View
                                    style={[{
                                        height: 44, width: 105
                                        , backgroundColor: '#E6E6E6', borderRadius: 2
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}
                                >
                                    <Text style={[{
                                        color: '#666666', fontSize: 17
                                    }]}>{'撤销'}</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null
                }
                <AlertDialog options={withdrawApplicationOptions} ref="withdrawApplicationAlert" />
                <AlertDialog options={approveOptions} ref="approveAlert" />
                <AlertDialog options={refuseOptions} ref="refuseAlert" />
            </View>
        </StatusPage>
        )
    }
}

class SignInApproveTimeLine extends Component {
    render() {
        const { timeLineList } = this.props;
        let dataList = timeLineList;
        return (<View style={[{
            width: SCREEN_WIDTH - 40,
        }]}>
            {
                dataList.map((item, index) => {
                    return (<View
                        style={[{ width: SCREEN_WIDTH - 40, }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40, flexDirection: 'row'
                                , height: 50
                            }]}
                        >
                            <View style={[{
                                width: 26, height: 50
                                , alignItems: 'center'
                            }]}>
                                <View
                                    style={[{
                                        width: 1, height: 4
                                        , backgroundColor: index != 0 ? '#4AA0FF' : 'white'
                                    }]}
                                />
                                <Image
                                    style={[{
                                        height: 12, width: 12
                                    }]}
                                    source={require('../../../images/ic_ct_had_sign_in.png')}
                                />
                                <View
                                    style={[{
                                        width: 1, flex: 1
                                        , backgroundColor: dataList.length - 1 != index ? '#4AA0FF' : 'white'
                                    }]}
                                />
                            </View>
                            <View
                                style={[{
                                    flex: 1, height: 50
                                    , marginLeft: 15
                                }]}
                            >
                                <View
                                    style={[{
                                        width: SCREEN_WIDTH - 90
                                        , flexDirection: 'row', alignItems: 'center'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 14, color: '#333333'
                                        }]}
                                    >
                                        {`${SentencedToEmpty(item, ['title'], '缺少标题信息')}`}
                                    </Text>
                                    <View style={[{ flex: 1 }]} />
                                    <Text
                                        style={[{
                                            fontSize: 12, color: '#999999'
                                        }]}
                                    >
                                        {`${SentencedToEmpty(item, ['time'], '缺少时间信息')}`}
                                    </Text>
                                </View>
                                <Text
                                    style={[{
                                        marginTop: 10
                                        , fontSize: 13, color: '#666666'
                                    }]}
                                >
                                    {`${SentencedToEmpty(item, ['chargePerson'], '缺少处理人信息')}`}
                                    {SentencedToEmpty(item, ['processState'], '') != '' ? <Text
                                        style={[{ fontSize: 13, color: '#666666' }]}
                                    >{`(${SentencedToEmpty(item, ['processState'], '')})`}</Text> : null}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40, flexDirection: 'row'
                            }]}
                        >
                            <View style={[{
                                width: 26, alignItems: 'center'
                            }]} >
                                <View
                                    style={[{
                                        width: 1, flex: 1
                                        , backgroundColor: dataList.length - 1 != index ? '#4AA0FF' : 'white'
                                    }]}
                                />
                            </View>
                            <View
                                style={[{
                                    flex: 1, marginLeft: 15
                                    , marginTop: 10, marginBottom: 20
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 13, color: '#999999'
                                        , width: SCREEN_WIDTH - 90
                                        , lineHeight: 17
                                    }]}
                                >
                                    {/* {`${'备注信息：修改应用版本号只需要修改apktool.yml即可,apktool.yml文件中找到versionCode,修改里面的versionCode对应的值保存即可。 3:通过修改后的文件重新回编成apk文件 然后就是再使用下面的.'}`} */}
                                    {`${SentencedToEmpty(item, ['postscript'], '') != '' ? '备注信息：' : ''}${SentencedToEmpty(item, ['postscript'], '')}`}
                                </Text>
                            </View>
                        </View>
                    </View>);
                })
            }
            {/* begin */}
            {/* <View
                style={[{ width: SCREEN_WIDTH - 40, }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 40, flexDirection: 'row'
                        , height: 50
                    }]}
                >
                    <View style={[{
                        width: 26, height: 50
                        , alignItems: 'center'
                    }]}>
                        <View
                            style={[{
                                width: 1, height: 4
                                , backgroundColor: false ? '#4AA0FF' : 'white'
                            }]}
                        />
                        <Image
                            style={[{
                                height: 12, width: 12
                            }]}
                            source={require('../../../images/ic_ct_had_sign_in.png')}
                        />
                        <View
                            style={[{
                                width: 1, flex: 1
                                , backgroundColor: '#4AA0FF'
                            }]}
                        />
                    </View>
                    <View
                        style={[{
                            flex: 1, height: 50
                            , marginLeft: 15
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 90
                                , flexDirection: 'row', alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 14, color: '#333333'
                                }]}
                            >
                                {`${'发起申请'}`}
                            </Text>
                            <View style={[{ flex: 1 }]} />
                            <Text
                                style={[{
                                    fontSize: 12, color: '#999999'
                                }]}
                            >
                                {`${'2023.03.24 10:54'}`}
                            </Text>
                        </View>
                        <Text
                            style={[{
                                marginTop: 10
                                , fontSize: 13, color: '#666666'
                            }]}
                        >
                            {`${'张三'}`}
                        </Text>
                    </View>
                </View>
                <View
                    style={[{
                        width: SCREEN_WIDTH - 40, flexDirection: 'row'
                    }]}
                >
                    <View style={[{
                        width: 26, alignItems: 'center'
                    }]} >
                        <View
                            style={[{
                                width: 1, flex: 1
                                , backgroundColor: '#4AA0FF'
                            }]}
                        />
                    </View>
                    <View
                        style={[{
                            flex: 1, marginLeft: 15
                            , marginTop: 10, marginBottom: 20
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 13, color: '#999999'
                                , width: SCREEN_WIDTH - 90
                                , lineHeight: 17
                            }]}
                        >
                            {`${'备注信息：修改应用版本号只需要修改apktool.yml即可,apktool.yml文件中找到versionCode,修改里面的versionCode对应的值保存即可。 3:通过修改后的文件重新回编成apk文件 然后就是再使用下面的.'}`}
                        </Text>
                    </View>
                </View>
            </View> */}
            {/* end */}
            {/* begin */}
            {/* <View
                style={[{ width: SCREEN_WIDTH - 40, }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH - 40, flexDirection: 'row'
                        , height: 50
                    }]}
                >
                    <View style={[{
                        width: 26, height: 50
                        , alignItems: 'center'
                    }]}>
                        <View
                            style={[{
                                width: 1, height: 4
                                , backgroundColor: true ? '#4AA0FF' : 'white'
                            }]}
                        />
                        <Image
                            style={[{
                                height: 12, width: 12
                            }]}
                            source={require('../../../images/ic_ct_had_sign_in.png')}
                        />
                        <View
                            style={[{
                                width: 1, flex: 1
                                , backgroundColor: false ? '#4AA0FF' : 'white'
                            }]}
                        />
                    </View>
                    <View
                        style={[{
                            flex: 1, height: 50
                            , marginLeft: 15
                        }]}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH - 90
                                , flexDirection: 'row', alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 14, color: '#333333'
                                }]}
                            >
                                {`${'领导'}`}
                            </Text>
                            <View style={[{ flex: 1 }]} />
                            <Text
                                style={[{
                                    fontSize: 12, color: '#999999'
                                }]}
                            >
                                {`${'2023.03.24 10:54'}`}
                            </Text>
                        </View>
                        <Text
                            style={[{
                                marginTop: 10
                                , fontSize: 13, color: '#666666'
                            }]}
                        >
                            {`${'王五（已同意）'}`}
                        </Text>
                    </View>
                </View>
                <View
                    style={[{
                        width: SCREEN_WIDTH - 40, flexDirection: 'row'
                    }]}
                >
                    <View style={[{
                        width: 26, alignItems: 'center'
                    }]} >
                        <View
                            style={[{
                                width: 1, flex: 1
                                , backgroundColor: false ? '#4AA0FF' : 'white'
                            }]}
                        />
                    </View>
                    <View
                        style={[{
                            flex: 1, marginLeft: 15
                            , marginTop: 10, marginBottom: 20
                        }]}
                    >
                        <Text
                            style={[{
                                fontSize: 13, color: '#999999'
                                , width: SCREEN_WIDTH - 90
                                , lineHeight: 17
                            }]}
                        >
                            {`${'备注：修改应用版本号只需要修改apktool.yml即可,apktool.yml文件中找到versionCode,修改里面的versionCode对应的值保存即可。 3:通过修改后的文件重新回编成apk文件 然后就是再使用下面的.'}`}
                        </Text>
                    </View>
                </View>
            </View> */}
            {/* end */}
        </View>);
    }
}