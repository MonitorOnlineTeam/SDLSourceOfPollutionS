//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    TouchableOpacity,
    Image,
    DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Signature from 'react-native-signature-canvas';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import {
    NavigationActions,
    createAction,
    createNavigationOptions,
    SentencedToEmpty,
    StackActions,
    ShowToast,
} from '../../../../utils';
// import { getToken, } from '../../dvapack/storage';
import {
    StatusPage,
    Touchable,
    PickerTouchable,
    SimpleLoadingComponent,
    MoreSelectTouchable,
    SimpleLoadingView,
} from '../../../../components';
import { AlertDialog } from '../../../../components';

const enterpriseUser = 0;
const operationsStaff = 1;

// create a component
@connect(({ calibrationRecordZbFs }) => ({
    MainInfo: calibrationRecordZbFs.MainInfo,
    liststatus: calibrationRecordZbFs.liststatus,
    calibrationRecordList: calibrationRecordZbFs.RecordList,
    editstatus: calibrationRecordZbFs.editstatus,
    JzConfigItemResult: calibrationRecordZbFs.JzConfigItemResult,
    jzDeleteResult: calibrationRecordZbFs.jzDeleteResult,
    JzConfigItemSelectedList: calibrationRecordZbFs.JzConfigItemSelectedList,
    signContent: calibrationRecordZbFs.signContent,
}))
class CalibrationRecordListZb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newData: [], // 待修改的数据列表
            pageSelectCodes: [], // 当前选中的分析仪
            lastSelectCodes: [], // 上次选中的分析仪
            deleteIndexList: [], //待删除数据列表
            signContent: '', // 签名内容
            signTime: '',
            signLoading: false,
            // signature: '',
        };
        _me = this;
    }
    componentDidMount(prevProps, prevState) {
        this.setState({
            signContent: this.props.signContent
        })

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.signContent && prevProps.signContent != this.props.signContent) {
            if (this.props.signContent) {
                this.setState({
                    signContent: this.props.signContent
                })

            }

        }
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新',
        });
    }

    _deleteForm = () => {
        if (this.props.route.params.params.TypeName == 'Fs81') {
            this.props.dispatch(
                createAction('calibrationRecordZbFs/checkDelForm')({
                    callback: () => {
                        // this._modalParent.showModal();
                        this.refs.doAlert.show();
                    },
                }),
            );
        }
    };

    _keyExtractor = (item, index) => {
        return index + '';
    };


    signatureComponents = () => {
        const { signContent } = this.state;
        return <View style={styles.signatureContainer}>
            <TouchableOpacity
                style={styles.signatureWrapper}
                onPress={this.openSignaturePage}>
                {signContent ? (
                    <Image
                        source={{ uri: signContent }}
                        style={styles.signaturePreview}
                    />
                ) : (
                        <Text style={styles.signaturePlaceholder}>
                            点击此处签名
                        </Text>
                    )}
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => {
                    if(!this.state.signContent){
                        ShowToast('签名不能为空');
                        return
                    }
                    this.submitSign()
                }}
            >
                <Text style={[{ color: globalcolor.whiteFont, }]}>确认提交</Text>
            </TouchableOpacity>
        </View>
    }
    _renderItem = ({ item, index }) => {
        if (this.props.route.params.params.TypeName == 'Fs81') {
            return (<View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'CalibrationRecordEditZbFs',
                                params: { index, item: { ...item, } },
                            }),
                        );
                    }}>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                alignItems: 'center',
                                marginTop: index != 0 ? 8 : 0,
                            },
                        ]}>
                        <View
                            style={[
                                {
                                    borderColor: globalcolor.borderLightGreyColor,
                                    backgroundColor: globalcolor.white,
                                    paddingHorizontal: 13,
                                },
                            ]}>
                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        height: 30,
                                        marginTop: 10,
                                        borderBottomColor: globalcolor.borderLightGreyColor,
                                        borderBottomWidth: 1,
                                    },
                                ]}>
                                <Text
                                    style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>
                                    {item.ItemID + '分析仪校准'}
                                </Text>
                            </View>

                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 24,
                                        flexDirection: 'row',
                                        marginTop: 10,
                                    },
                                ]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text
                                        style={[
                                            { fontSize: 14, color: globalcolor.datepickerGreyText },
                                        ]}>
                                        {'上次校准日期：'}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            {
                                                width: (SCREEN_WIDTH - 24) / 2 - 100,
                                                fontSize: 14,
                                                color: globalcolor.datepickerGreyText,
                                            },
                                        ]}>
                                        {item.LastJZTime &&
                                            item.LastJZTime != ''
                                            ? item.LastJZTime
                                            : '--'}
                                    </Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text
                                        style={[
                                            { fontSize: 14, color: globalcolor.datepickerGreyText },
                                        ]}>
                                        {'最新校准日期：'}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            {
                                                width: (SCREEN_WIDTH - 24) / 2 - 100,
                                                fontSize: 14,
                                                color: globalcolor.datepickerGreyText,
                                            },
                                        ]}>
                                        {item.NewJZTime && item.NewJZTime != '' ? item.NewJZTime : '--'}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 24,
                                        flexDirection: 'row',
                                        marginTop: 10,
                                    },
                                ]}>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text
                                        style={[
                                            { fontSize: 14, color: globalcolor.datepickerGreyText },
                                        ]}>
                                        {'校准参数名称：'}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            {
                                                width: (SCREEN_WIDTH - 24) / 2 - 100,
                                                fontSize: 14,
                                                color: globalcolor.datepickerGreyText,
                                            },
                                        ]}>
                                        {item.JZCSMC &&
                                            item.JZCSMC != ''
                                            ? item.JZCSMC
                                            : '--'}
                                    </Text>
                                </View>
                                <View style={[{ flexDirection: 'row', height: 30, flex: 1 }]}>
                                    <Text
                                        style={[
                                            { fontSize: 14, color: globalcolor.datepickerGreyText },
                                        ]}>
                                        {'最新校准参数：'}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            { width: (SCREEN_WIDTH - 24) / 2 - 100, fontSize: 14, color: globalcolor.datepickerGreyText },
                                        ]}>
                                        {item.ZXJZCSZ && item.ZXJZCSZ != ''
                                            ? item.ZXJZCSZ
                                            : '--'}
                                    </Text>
                                </View>
                            </View>





                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            );
        }
    };

    cancelButton = () => { };
    confirm = () => {
        this.props.dispatch(
            createAction('calibrationRecordZbFs/delForm')({
                callback: ID => {
                    //返回任务执行，刷新数据
                    // this.props.dispatch(createAction('excuteTask/getTaskDetailWithoutTaskDescription')({ taskID: ID }));
                    this.props.dispatch(NavigationActions.back());
                    this.props.dispatch(
                        createAction('calibrationRecordZbFs/updateState')({
                            signContent: ''
                        })
                    );
                },
            }),
        );
    };

    getPageStatus = () => {
        let configItemsStatus = SentencedToEmpty(
            this.props,
            ['JzConfigItemResult', 'status'],
            1000,
        );
        if (configItemsStatus != 200) {
            return configItemsStatus;
        } else {
            return SentencedToEmpty(this.props, ['liststatus', 'status'], 1000);
        }
    };

    getJzConfigItemOption = () => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(
            this.props,
            ['JzConfigItemResult', 'data', 'Datas'],
            [],
        );
        const JzConfigItemSelectedList = SentencedToEmpty(
            this.props,
            ['JzConfigItemSelectedList'],
            [],
        );
        if (JzConfigItemSelectedList.length == 0) {
            dataSource.map((item, index) => {
                if (item.CheckIn == 1) {
                    selectCodes.push(item.ItemName);
                }
            });
        } else {
            JzConfigItemSelectedList.map((item, index) => {
                selectCodes.push(item.ItemName);
            });
        }
        return {
            contentWidth: 166,
            selectName: '选择污染物',
            placeHolderStr: '污染物',
            codeKey: 'ItemName',
            nameKey: 'ItemName',
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({
                selectCode = [],
                selectNameStr,
                selectCodeStr,
                selectData,
            }) => {
                selectData.map((item, index) => {
                    // 基础数据初始化
                    item.ItemID = item.ItemName;
                    item.ID = '';  // 确保有ID字段
                });
                let findIndex = -1;
                let selectedIndexList = [];
                let deleteIndexList = [];
                this.props.calibrationRecordList.map((item, index) => {
                    if (SentencedToEmpty(item, ['ID'], '') != '') {
                        findIndex = selectCode.findIndex(codeItem => {
                            if (codeItem == item.ItemID) {
                                return true;
                            }
                        });
                        if (findIndex == -1) {
                            deleteIndexList.push({
                                findIndex,
                                dataIndex: index,
                                recordId: item.ID,
                                recordName: item.ItemName,
                            });
                        } else {
                            selectedIndexList.push({ findIndex, dataIndex: index });
                        }
                    }
                });
                selectedIndexList.map(selectedDateItem => {

                    selectData[selectedDateItem.findIndex] = {
                        ...selectData[selectedDateItem.findIndex],
                        ...this.props.calibrationRecordList[selectedDateItem.dataIndex],
                    };

                });
                if (deleteIndexList.length > 0) {
                    this.setState({
                        newData: selectData,
                        lastSelectCodes: this._picker.getBeforeSubmitData(),
                        pageSelectCodes: selectCode,
                        deleteIndexList,
                    });
                    this.refs.delConfigItemsAlert.show();
                    this.props.dispatch(
                        createAction('calibrationRecordZbFs/updateState')({
                            JzConfigItemSelectedList: selectData,
                        }),
                    );
                } else {
                    this.props.dispatch(
                        createAction('calibrationRecordZbFs/updateState')({
                            RecordList: selectData,
                            JzConfigItemSelectedList: selectData,
                        }),
                    );
                }
            },
        };
    };

    refreshStatePage = () => {
        this.props.dispatch(
            createAction('calibrationRecordZbFs/updateState')({
                liststatus: { status: -1 },
                JzConfigItemResult: { status: -1 },
                JzConfigItemSelectedList: [],
            }),
        );
        this.props.dispatch(createAction('calibrationRecordZbFs/getJzItem')({}));
    };

    // 处理签名完成
    handleSignature = signature => {
        this.setState({
            signContent: signature,
            signTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        });
    };

    // 处理签名取消
    handleSignatureCancel = () => {
        this.props.navigation.goBack();
    };

    // 打开签名页面
    openSignaturePage = () => {
        this.props.dispatch(
            NavigationActions.navigate({
                routeName: 'SignaturePage',
                params: {
                    onOK: this.handleSignature,
                    onCancel: this.handleSignatureCancel,
                    signature: this.state.signContent,
                },
            }),
        );
    };
    // 提交签名
    submitSign = () => {
        this.refs.signConfigItemsAlert.show();
    };
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除当前校准记录的表单',
            headStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                color: '#ffffff',
                fontSize: 18,
            },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: this.cancelButton,
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.confirm,
                },
            ],
        };
        let delConfigItemsAlert = {
            headTitle: '提示',
            messText: '确定要删除这条记录吗？',
            headStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                color: '#ffffff',
                fontSize: 18,
            },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    // onpress: this.cancelButton
                    onpress: () => {
                        this._picker.setData(this.state.lastSelectCodes);
                    },
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    // onpress: this.confirm
                    onpress: () => {
                        let nameStr = '';
                        let idStr = '';
                        this.state.deleteIndexList.map((item, index) => {
                            if (index == 0) {
                                nameStr = item.recordName;
                                idStr = item.recordId;
                            } else {
                                nameStr = nameStr + '、' + item.recordName;
                                idStr = idStr + ',' + item.recordId;
                            }
                        });
                        this.props.dispatch(
                            createAction('calibrationRecordZbFs/updateState')({
                                RecordList: this.state.newData,
                                jzDeleteResult: { status: -1 },
                            }),
                        );
                        this.props.dispatch(
                            createAction('calibrationRecordZbFs/deleteJzItem')({
                                params: { ID: idStr },
                            }),
                        );
                    },
                },
            ],
        };
        let signConfigItemsAlertOption = {
            headTitle: '提示',
            messText: '确定要提交签名吗？',
            headStyle: {
                backgroundColor: globalcolor.headerBackgroundColor,
                color: '#ffffff',
                fontSize: 18,
            },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: () => {
                    },
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: () => {
                        this.setState({ signLoading: true })
                        this.props.dispatch(
                            createAction('calibrationRecordZbFs/addOrUpdateSign')({
                                signContent: this.state.signContent, signTime: this.state.signTime,
                                callback: () => {
                                    this.setState({ signLoading: false })
                                }
                            },


                            ),
                        );
                    },
                },
            ],
        };
        const calibratedList = this.props.calibrationRecordList //已经校准的污染物
        return (
            <StatusPage
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    console.log('重新刷新');
                    // this.props.dispatch(createAction('pointDetail/getHistoryData')({}));
                    this.refreshStatePage();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    console.log('重新刷新');
                    // this.props.dispatch(createAction('pointDetail/getHistoryData')({}));
                    this.refreshStatePage();
                }}
                status={this.getPageStatus()}>
                <View style={styles.container}>
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                paddingHorizontal: 10,
                                backgroundColor: globalcolor.white,
                            },
                        ]}>
                        {/* <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    height: 45,
                                    marginTop: 10,
                                    borderBottomWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomColor: globalcolor.borderBottomColor,
                                },
                            ]}>
                            <Text style={[{ color: globalcolor.taskFormLabel, fontSize: 15, }]}>
                                工作开始时间：
                                 </Text>
                            <Text style={[{ color: globalcolor.taskFormLabel, fontSize: 15, }]}>
                                {SentencedToEmpty(
                                    this.props.MainInfo,
                                    ['WorkingDateBegin'],
                                    '----/--/-- --:--',
                                )}
                            </Text>
                        </View>
                        <View
                            style={[
                                {
                                    flexDirection: 'row',
                                    height: 45,
                                    marginTop: 10,
                                    borderBottomWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomColor: globalcolor.borderBottomColor,
                                },
                            ]}>
                            <Text style={[{ color: globalcolor.taskFormLabel, fontSize: 15, }]}>
                                工作结束时间：
                                 </Text>
                            <Text style={[{ color: globalcolor.taskFormLabel, fontSize: 15, }]}>
                                {SentencedToEmpty(
                                    this.props.MainInfo,
                                    ['WorkingDateEnd'],
                                    '----/--/-- --:--',
                                )}
                            </Text>
                        </View> */}
                          <View
                            style={{
                                width: '100%',
                                height: 45,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: globalcolor.borderBottomColor,
                            }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#333333',
                                }}>
                                工作时间：
                            </Text>
                            <Text style={{ fontSize: 14, color: '#666' }}>
                            {this.props.MainInfo.WorkingDateBegin && moment(this.props.MainInfo.WorkingDateBegin).format('YYYY-MM-DD')} ～ {this.props.MainInfo.WorkingDateEnd  && moment(this.props.MainInfo.WorkingDateEnd).format('YYYY-MM-DD')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[{ marginBottom: 8 }]}
                        onPress={() => {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'CalibrationRecordTimeZbFs',
                                    params: {},
                                }),
                            );
                        }}>
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    paddingHorizontal: 10,
                                    backgroundColor: globalcolor.white,
                                },
                            ]}>

                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        height: 45,
                                        marginTop: 10,
                                        borderBottomWidth: 1,
                                        alignItems: 'center',
                                        borderBottomColor: globalcolor.borderBottomColor,
                                    },
                                ]}>
                                <Text
                                    style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>
                                    校准开始时间：
                </Text>
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            flexDirection: 'row',
                                            height: 45,
                                            alignItems: 'center',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            {
                                                fontSize: 14,
                                                color: globalcolor.taskFormLabel,
                                                flex: 1,
                                                textAlign: 'right',
                                            },
                                        ]}>
                                        {SentencedToEmpty(
                                            this.props.MainInfo,
                                            ['AdjustStartTime'],
                                            '----/--/-- --:--',
                                        )}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    {
                                        flexDirection: 'row',
                                        height: 45,
                                        marginTop: 10,
                                        borderBottomWidth: 1,
                                        alignItems: 'center',
                                        borderBottomColor: globalcolor.borderBottomColor,
                                        marginBottom: 10,
                                    },
                                ]}>
                                <Text
                                    style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>
                                    校准结束时间：
                                  </Text>
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            flexDirection: 'row',
                                            height: 45,
                                            alignItems: 'center',
                                        },
                                    ]}>
                                    <Text
                                        style={[
                                            {
                                                fontSize: 14,
                                                color: globalcolor.taskFormLabel,
                                                flex: 1,
                                                textAlign: 'right',
                                            },
                                        ]}>
                                        {SentencedToEmpty(
                                            this.props.MainInfo,
                                            ['AdjustEndTime'],
                                            '----/--/-- --:--',
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {SentencedToEmpty(this.props, ['MainInfo', 'AdjustEndTime'], '') ==
                        '' ||
                        SentencedToEmpty(this.props, ['MainInfo', 'AdjustStartTime'], '') ==
                        '' ? (
                            <TouchableOpacity
                                onPress={() => {
                                    ShowToast('请您先填写校准开始和结束时间');
                                }}
                                style={[{ marginBottom: 8 }]}>
                                <View
                                    style={{
                                        width: SCREEN_WIDTH - 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 45,
                                        backgroundColor: 'white',
                                        borderRadius: 4,
                                    }}>
                                    <Text style={{ fontSize: 15, color: globalcolor.taskImfoLabel }}>
                                        {'选择校准因子'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <MoreSelectTouchable
                                ref={ref => (this._picker = ref)}
                                option={this.getJzConfigItemOption()}
                                style={[{ marginBottom: 8 }]}>
                                <View
                                    style={{
                                        width: SCREEN_WIDTH - 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 45,
                                        backgroundColor: 'white',
                                        borderRadius: 4,
                                    }}>
                                    <Text style={{ fontSize: 15, color: globalcolor.taskImfoLabel }}>
                                        {'选择校准因子'}
                                    </Text>
                                </View>
                            </MoreSelectTouchable>
                        )}
                    <FlatList
                        data={this.props.calibrationRecordList}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                    />
                    {this.signatureComponents()}
                    <TouchableOpacity
                        style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                        onPress={() => {
                            this._deleteForm();
                        }}>
                        <View
                            style={[
                                {
                                    height: 60,
                                    width: 60,
                                    borderRadius: 30,
                                    backgroundColor: 'red',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                            <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                        </View>
                    </TouchableOpacity>
                    <AlertDialog options={options} ref="doAlert" />
                    {this.props.editstatus.status == -1 ? (
                        <SimpleLoadingView message={'删除中'} />
                    ) : null}
                    {this.props.jzDeleteResult.status == -1 ? (
                        <SimpleLoadingView message={'删除中'} />
                    ) : null}
                    <AlertDialog
                        options={signConfigItemsAlertOption}
                        ref="signConfigItemsAlert"
                    />
                    <AlertDialog
                        options={delConfigItemsAlert}
                        ref="delConfigItemsAlert"
                    />
                    {this.state.signLoading ? <SimpleLoadingView message={'提交签名中'} /> : null}

                </View>
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: globalcolor.backgroundGrey,
    },
    signatureContainer: {
        width: '100%',
        marginTop: 6,
        backgroundColor: "#fff",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    signatureWrapper: {
        width: '60%',
        height: 60,
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
    button: {
        height: 36,
        width: 80,
        marginRight: 12,
        backgroundColor: globalcolor.blue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
});

//make this component available to the app
export default CalibrationRecordListZb;
