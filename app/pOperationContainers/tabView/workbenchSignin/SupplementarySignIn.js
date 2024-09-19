/*
 * @Description: 补签
 * @LastEditors: hxf
 * @Date: 2024-02-01 14:59:20
 * @LastEditTime: 2024-09-19 11:44:27
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/workbenchSignin/SupplementarySignIn.js
 */
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationActions, SentencedToEmpty, SentencedToEmptyTimeString, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import globalcolor from '../../../config/globalcolor';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import FormDatePicker from '../../../operationContainers/taskViews/taskExecution/components/FormDatePicker';
import moment from 'moment';
import FormPicker from '../../../operationContainers/taskViews/taskExecution/components/FormPicker';
import FormImagePicker from '../../../operationContainers/taskViews/taskExecution/components/FormImagePicker';
import FormTextArea from '../../../operationContainers/taskViews/taskExecution/components/FormTextArea';
import { connect } from 'react-redux';
import { StatusPage } from '../../../components';

@connect(({ signInModel }) => ({
    supplementaryWorkTypeList: signInModel.supplementaryWorkTypeList,
    supplementaryWorkTypeSelectedItem: signInModel.supplementaryWorkTypeSelectedItem,
    supplementaryTypeList: signInModel.supplementaryTypeList,
    supplementaryTypeSelectedItem: signInModel.supplementaryTypeSelectedItem,

    supplementaryImageID: signInModel.supplementaryImageID, // 图片uuid
    supplementaryImageList: signInModel.supplementaryImageList, // 补签 图片列表

    supplementaryDate: signInModel.supplementaryDate, // 补签日期
    supplementaryArriveTime: signInModel.supplementaryArriveTime, // 补签到达时间
    supplementaryLeaveTime: signInModel.supplementaryLeaveTime, // 补签离开时间
    supplementaryStatement: signInModel.supplementaryStatement, // 补签说明

    allSignInEntList: signInModel.allSignInEntList, // 补签 所有企业列表
    replenishmentSelectedEntItem: signInModel.replenishmentSelectedEntItem, // 选中的补签企业
    allSignInEntListResult: signInModel.allSignInEntListResult,// 补签 所有企业列表请求结果
    supplementaryWorkTypeResult: signInModel.supplementaryWorkTypeResult, // 现场类型 工作类型 请求结果

    signID: signInModel.signID, // 修改补签记录时需要这个参数
    appID: signInModel.appID,// 修改补签记录时需要这个参数

    signInType: signInModel.signInType,// 签到类型
}))
export default class SupplementarySignIn extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '补签',
            // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
            headerRight: (
                <TouchableOpacity
                    style={{ width: 64, height: 40, justifyContent: 'center' }}
                    onPress={() => {
                        navigation.state.params.navigatePress();
                    }}
                >
                    {/* <Text style={[{ fontSize: 12, color: globalcolor.whiteFont }]}>{'申诉记录'}</Text> */}
                    <Text style={[{ fontSize: 12, color: globalcolor.whiteFont }]}>{'补签记录'}</Text>
                </TouchableOpacity>
            )
        });
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.props.navigation.setParams({
            navigatePress: () => {
                //跳转站点信息
                this.props.dispatch(
                    NavigationActions.navigate({
                        routeName: 'SupplementarySignInRecord',
                        params: {
                        }
                    })
                );
            },
        });
    }

    componentDidMount() {
        this.onFreshData();
    }

    onFreshData = () => {
        // 因为有修改功能，不能在进入时清理数据，需要在进入前清理数据
        // this.props.dispatch(createAction('signInModel/updateState')({
        //     supplementaryWorkTypeSelectedItem: null,
        //     supplementaryWorkTypeResult: { status: -1 },
        //     replenishmentSelectedEntItem: null,// 运维企业
        //     supplementaryDate: '',
        //     supplementaryArriveTime: '',
        //     supplementaryLeaveTime: '',
        //     supplementaryImageID: `supplementaryImage${new Date().getTime()}`,
        //     supplementaryImageList: [],
        // }));
        this.props.dispatch(createAction('signInModel/getSupplementarySignInType')({
            params: {}
        }));
        this.props.dispatch(createAction('signInModel/getAllSignInEntList')({
            params: {}
        }));
    }

    getSupplementaryDateOption = () => {
        return {
            defaultTime: moment(this.props.supplementaryDate).format('YYYY-MM-DD HH:mm:ss'),
            // type: 'hour',
            type: 'day',
            onSureClickListener: (time, setTime) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    supplementaryDate: time,
                    supplementaryArriveTime: moment(time).format('YYYY-MM-DD HH:mm'),
                    supplementaryLeaveTime: moment(time).format('YYYY-MM-DD HH:mm')
                }));
                SentencedToEmpty(this,
                    ['arriveDatePicker', 'setTime']
                    , () => { })(moment(time).format('YYYY-MM-DD HH:mm:00'));
                SentencedToEmpty(this,
                    ['leaveDatePicker', 'setTime']
                    , () => { })(moment(time).format('YYYY-MM-DD HH:mm:00'));
            },
        };
    };

    getArriveDateOption = () => {
        return {
            defaultTime: moment(this.props.supplementaryArriveTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'minute',
            // type: 'hour',
            onSureClickListener: (time, setTime) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    supplementaryDate: time,
                    supplementaryArriveTime: time
                }));
                SentencedToEmpty(this,
                    ['supplementaryDatePicker', 'setTime']
                    , () => { })(time);
            },
        };
    };

    getLeaveDateOption = () => {
        return {
            // defaultTime: moment(this.props.supplementaryLeaveTime).format('YYYY-MM-DD HH:mm:ss'),
            defaultTime: moment(this.props.supplementaryLeaveTime).format('YYYY-MM-DD HH:mm:ss'),
            type: 'minute',
            // type: 'hour',
            onSureClickListener: (time, setTime) => {
                this.props.dispatch(createAction('signInModel/updateState')({
                    supplementaryLeaveTime: time
                }));
            },
        };
    };

    getLoadStatus = () => {
        console.log('getLoadStatus this.props = ', this.props);
        const allSignInEntListStatus = SentencedToEmpty(
            this.props, ['allSignInEntListResult', 'status'], 1000
        );
        const supplementaryWorkTypeStatus = SentencedToEmpty(
            this.props, ['supplementaryWorkTypeResult', 'status'], 1000
        );
        if (allSignInEntListStatus == 200
            && supplementaryWorkTypeStatus == 200) {
            return 200;
        } if (allSignInEntListStatus == -1
            || supplementaryWorkTypeStatus == -1) {
            return -1;
        } else {
            return 1000;
        }
    }

    render() {
        return (<StatusPage
            status={this.getLoadStatus()}
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
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH
                    }]}
                >
                    <View
                        style={[{
                            width: SCREEN_WIDTH, alignItems: 'center'
                            , backgroundColor: 'white'
                        }]}
                    >
                        <View
                            style={[{
                                height: 44, width: SCREEN_WIDTH - 40
                            }]}
                        >
                            <FormDatePicker
                                ref={ref => this.supplementaryDatePicker = ref}
                                showRightIcon={false}
                                // required={true}
                                getPickerOption={this.getSupplementaryDateOption}
                                label={'补签日期'}
                                // timeString={moment().format('YYYY-MM-DD HH:00')}
                                timeString={SentencedToEmptyTimeString(this.props
                                    , ['supplementaryDate']
                                    , '请选择补签日期'
                                    , 'YYYY-MM-DD')}
                            />
                        </View>
                        <View style={[{
                            width: SCREEN_WIDTH - 40, height: 44
                            , justifyContent: 'center',
                        }]}>
                            <FormPicker
                                hasColon={true}
                                label='运维企业'
                                propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                                propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                                propsHolderStyle={{ marginRight: 10 }}
                                propsRightIconStyle={{ tintColor: '#999999', width: 16 }}

                                defaultCode={SentencedToEmpty(
                                    this.props, ['replenishmentSelectedEntItem', 'entCode'], ''
                                )}
                                option={{
                                    codeKey: 'entCode',
                                    nameKey: 'entName',
                                    defaultCode: SentencedToEmpty(this.props, ['replenishmentSelectedEntItem', 'entCode'], ''),
                                    dataArr: SentencedToEmpty(this.props, ['allSignInEntList'], []),
                                    onSelectListener: item => {
                                        this.props.dispatch(createAction('signInModel/updateState')({
                                            replenishmentSelectedEntItem: item,
                                        }));
                                    }
                                }}
                                showText={SentencedToEmpty(
                                    this.props, ['replenishmentSelectedEntItem', 'entName'], '请选择'
                                )}
                                placeHolder='请选择'
                            />
                        </View>
                        <View
                            style={[{
                                height: 44, width: SCREEN_WIDTH - 40
                            }]}
                        >
                            <FormPicker
                                hasColon={false}
                                label='现场类型'
                                propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                                propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                                propsHolderStyle={{ marginRight: 10 }}
                                propsRightIconStyle={{ tintColor: '#999999', width: 16 }}

                                defaultCode={SentencedToEmpty(this.props, ['supplementaryWorkTypeSelectedItem', 'ChildID'], '')}
                                option={{
                                    codeKey: 'ChildID',
                                    nameKey: 'Name',
                                    defaultCode: SentencedToEmpty(this.props, ['supplementaryWorkTypeSelectedItem', 'ChildID'], ''),
                                    dataArr: SentencedToEmpty(this.props, ['supplementaryWorkTypeList'], []),
                                    onSelectListener: item => {
                                        let params = {
                                            supplementaryWorkTypeSelectedItem: item
                                        }
                                        /**
                                         * 白班和非驻场 只有签退（2）和签到签退（3）
                                         * 夜班  签到（1）   签退（2）
                                         */
                                        if (item.ChildID == '572') {
                                            params.supplementaryTypeList = [
                                                { ID: '2', Name: '签退' },
                                                { ID: '3', Name: '签到签退' },
                                            ]
                                        } else if (item.ChildID == '573') {
                                            params.supplementaryTypeList = [
                                                { ID: '2', Name: '签退' },
                                                { ID: '3', Name: '签到签退' },
                                            ]
                                        } else {
                                            params.supplementaryTypeList = [
                                                { ID: '1', Name: '签到' },
                                                { ID: '2', Name: '签退' },
                                            ]
                                        }
                                        params.supplementaryTypeSelectedItem = null;
                                        this.props.dispatch(createAction('signInModel/updateState')(params));
                                    }
                                }}
                                showText={SentencedToEmpty(
                                    this.props, ['supplementaryWorkTypeSelectedItem', 'Name'], '请选择'
                                )}
                            // placeHolder='请选择'
                            />
                        </View>
                        <View
                            style={[{
                                height: 44, width: SCREEN_WIDTH - 40
                            }]}
                        >
                            {
                                !this.props.supplementaryWorkTypeSelectedItem ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            ShowToast('您还没选择现场类型！')
                                        }}
                                    >
                                        <FormPicker
                                            editable={false}
                                            hasColon={false}
                                            label='补签类型'
                                            propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                                            propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                                            propsHolderStyle={{ marginRight: 10 }}
                                            propsRightIconStyle={{ tintColor: '#999999', width: 16 }}
                                            defaultCode={'code2'}
                                            showText={'请选择'}
                                        />
                                    </TouchableOpacity>
                                    : <FormPicker
                                        hasColon={false}
                                        label='补签类型'
                                        propsLabelStyle={{ color: '#333333', fontSize: 14 }}
                                        propsTextStyle={{ marginRight: 10, color: '#333333', fontSize: 14 }}
                                        propsHolderStyle={{ marginRight: 10 }}
                                        propsRightIconStyle={{ tintColor: '#999999', width: 16 }}

                                        defaultCode={SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], '')}
                                        option={{
                                            codeKey: 'ID',
                                            nameKey: 'Name',
                                            defaultCode: SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], ''),
                                            dataArr: SentencedToEmpty(this.props, ['supplementaryTypeList'], []),
                                            onSelectListener: item => {
                                                this.props.dispatch(createAction('signInModel/updateState')({
                                                    supplementaryTypeSelectedItem: item
                                                }));
                                            }
                                        }}
                                        showText={SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'Name'], '请选择')}
                                    // placeHolder='请选择'
                                    />
                            }
                        </View>
                        {
                            SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], '') == 1
                                || SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], '') == 3
                                ? <View
                                    style={[{
                                        height: 44, width: SCREEN_WIDTH - 40
                                    }]}
                                >
                                    <FormDatePicker
                                        ref={ref => this.arriveDatePicker = ref}
                                        showRightIcon={false}
                                        // required={true}
                                        getPickerOption={this.getArriveDateOption}
                                        label={'到达时间'}
                                        timeString={SentencedToEmptyTimeString(this.props
                                            , ['supplementaryArriveTime']
                                            , '请选择到达时间'
                                            , 'YYYY-MM-DD HH:mm')}
                                    />
                                </View> : null
                        }
                        {
                            SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], '') == 2
                                || SentencedToEmpty(this.props, ['supplementaryTypeSelectedItem', 'ID'], '') == 3
                                ? <View
                                    style={[{
                                        height: 44, width: SCREEN_WIDTH - 40
                                    }]}
                                >
                                    <FormDatePicker
                                        ref={ref => this.leaveDatePicker = ref}
                                        showRightIcon={false}
                                        // required={true}
                                        getPickerOption={this.getLeaveDateOption}
                                        label={'离开时间'}
                                        timeString={SentencedToEmptyTimeString(this.props
                                            , ['supplementaryLeaveTime']
                                            , '请选择离开时间'
                                            , 'YYYY-MM-DD HH:mm')}
                                    />
                                </View> : null
                        }

                        <View
                            style={[{
                                width: SCREEN_WIDTH - 40
                            }]}
                        >
                            <FormImagePicker
                                imageGridWidth={SCREEN_WIDTH - 40}
                                localId={this.props.supplementaryImageID}
                                Imgs={
                                    SentencedToEmpty(this.props
                                        , ['supplementaryImageList'], [])
                                }
                                delCallback={(key) => {
                                    console.log('delCallback key = ', key);
                                    let delImgList = [].concat(SentencedToEmpty(this.props, ['supplementaryImageList'], []));
                                    delImgList.splice(key, 1);
                                    this.props.dispatch(createAction('signInModel/updateState')({
                                        supplementaryImageList: delImgList
                                    }));
                                }}
                                uploadCallback={(images) => {
                                    let addData = [].concat(SentencedToEmpty(this.props, ['supplementaryImageList'], []));
                                    images.map((item) => {
                                        addData.push({ AttachID: item.AttachID });
                                    });
                                    this.props.dispatch(createAction('signInModel/updateState')({
                                        supplementaryImageList: addData
                                    }));
                                }}
                            />
                        </View>
                        <View
                            style={[{
                                height: 150, width: SCREEN_WIDTH - 40
                            }]}
                        >
                            <FormTextArea
                                editable={true}
                                areaHeight={50}
                                areaWidth={SCREEN_WIDTH - 40}
                                required={false}
                                // label='申诉说明'
                                label='补签说明'
                                placeholder=''
                                value={this.props.supplementaryStatement}
                                onChangeText={(text) => {
                                    this.props.dispatch(createAction('signInModel/updateState')({
                                        supplementaryStatement: text
                                    }));
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 84
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            ShowLoadingToast('提交中');
                            /**
                             * 如果是修改需要传
                             * signID、appID
                             */
                            // 校验数据完整
                            let params = {
                                File: this.props.supplementaryImageID,
                                SignWorkType: 60, //运维现场 非现场不需要补签
                            };
                            const signID = SentencedToEmpty(this.props, ['signID'], ''); // 修改补签记录时需要这个参数
                            const appID = SentencedToEmpty(this.props, ['appID'], '');// 修改补签记录时需要这个参数
                            if (signID != '' && appID != '') {
                                params.signID = signID;
                                params.appID = appID;
                            }
                            if (SentencedToEmpty(this.props
                                , ['supplementaryDate'], '')
                                == '') {
                                ShowToast('您没有选择补签日期');
                                return;
                            } else {
                                // params.WorkType = SentencedToEmpty(this.props
                                //     , ['supplementaryDate'], '');
                            }

                            if (SentencedToEmpty(this.props
                                , ['replenishmentSelectedEntItem', 'entCode'], '')
                                == '') {
                                ShowToast('您没有选择补签企业');
                                return;
                            } else {
                                params.entID = SentencedToEmpty(this.props
                                    , ['replenishmentSelectedEntItem', 'entCode'], '');
                            }

                            if (SentencedToEmpty(this.props
                                , ['supplementaryWorkTypeSelectedItem', 'ChildID'], '')
                                == '') {
                                ShowToast('您没有选择现场类型');
                                return;
                            } else {
                                params.WorkType = SentencedToEmpty(this.props
                                    , ['supplementaryWorkTypeSelectedItem', 'ChildID'], '');
                            }

                            if (SentencedToEmpty(this.props
                                , ['supplementaryTypeSelectedItem', 'ID'], '')
                                == '') {
                                ShowToast('您没有选择补签类型');
                                return;
                            } else {
                                params.RepairSignType = SentencedToEmpty(this.props
                                    , ['supplementaryTypeSelectedItem', 'ID'], '');
                            }

                            if ((params.RepairSignType == 1
                                || params.RepairSignType == 3)) {
                                if (SentencedToEmpty(this.props
                                    , ['supplementaryArriveTime'], '')
                                    == '') {
                                    ShowToast('您没有选择到达时间');
                                    return;
                                } else if (moment(this.props.supplementaryArriveTime).isAfter(moment())) {
                                    ShowToast('到达时间不能晚于当前时间');
                                    return;
                                } else {
                                    params.ArriveTime = SentencedToEmpty(this.props
                                        , ['supplementaryArriveTime'], '');
                                }
                            }

                            if ((params.RepairSignType == 2
                                || params.RepairSignType == 3)) {
                                if (SentencedToEmpty(this.props
                                    , ['supplementaryLeaveTime'], '')
                                    == '') {
                                    ShowToast('您没有选择离开时间');
                                    return;
                                } else if (moment(this.props.supplementaryLeaveTime).isAfter(moment())) {
                                    ShowToast('离开时间不能晚于当前时间');
                                    return;
                                } else {
                                    params.LeaveTime = SentencedToEmpty(this.props
                                        , ['supplementaryLeaveTime'], '');
                                }
                            }

                            if (params.RepairSignType == 3) {
                                if (!(moment(this.props.supplementaryArriveTime)
                                    .isBefore(moment(this.props.supplementaryLeaveTime)))) {
                                    ShowToast('补签结束时间不能早于补签开始时间');
                                    return;
                                }
                            }

                            if (SentencedToEmpty(this.props
                                , ['supplementaryStatement'], '')
                                == '') {
                                ShowToast('您没有填写补签说明');
                                return;
                            } else {
                                params.Remark = SentencedToEmpty(this.props
                                    , ['supplementaryStatement'], '');
                            }

                            this.props.dispatch(createAction('signInModel/repairSignIn')({
                                params: params,
                                successCallback: () => {
                                    this.props.dispatch(NavigationActions.back());
                                    // 当前一个页面为运维现场时，需要刷新
                                    // 非现场时，不需要刷新
                                    if (this.props.signInType == 0) {
                                        // 刷新签到页面
                                        let params = { SignWorkType: 60 };
                                        const entCode = SentencedToEmpty(
                                            this.props, ['signInEntItem', 'entCode'], ''
                                        );
                                        if (entCode == '') {
                                            this.props.dispatch(
                                                createAction('signInModel/getLastSingInfo')({
                                                    params: params
                                                })
                                            );
                                        } else {
                                            params.entID = entCode;
                                            const WorkType = SentencedToEmpty(this.props, ['workTypeSelectedItem', 'ChildID'], '');
                                            if (WorkType != '') {
                                                params.WorkType = WorkType;
                                            }
                                            this.props.dispatch(
                                                createAction('signInModel/getLastSingInfo')({
                                                    params: params
                                                })
                                            );
                                        }
                                    }
                                }
                            }));
                        }}
                    >
                        <View
                            style={[{
                                height: 44, width: SCREEN_WIDTH - 20
                                , backgroundColor: '#4DA9FF'
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    fontSize: 17, color: '#FEFEFE'
                                }]}
                            >{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </StatusPage>
        )
    }
}