/*
 * @Description: 工作记录 单条
 * @LastEditors: hxf
 * @Date: 2023-09-24 09:16:27
 * @LastEditTime: 2024-09-26 10:48:32
 * @FilePath: /SDLMainProject/app/pOperationContainers/tabView/chengTaoXiaoXi/WorkRecordSingle.js
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Platform, Text, View, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { PickerSingleTimeTouchable, PickerTouchable, StatusPage, AlertDialog, SimpleLoadingView } from '../../../components';
import { createAction, createNavigationOptions, SentencedToEmpty, ShowToast } from '../../../utils';
import { connect } from 'react-redux';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel, CTWorkRecordModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    ProjectID: CTModel.ProjectID,
    dispatchId: CTModel.dispatchId,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    projectEntPointSysModelResult: CTModel.projectEntPointSysModelResult, // 点位信息
    workRecordResult: CTWorkRecordModel.workRecordResult,
    deleteWorkRecordResult: CTWorkRecordModel.deleteWorkRecordResult,
    addWorkRecordResult: CTWorkRecordModel.addWorkRecordResult
    // addPublicRecordResult:CT7FormModel.addPublicRecordResult,
    // deletePublicRecordResult:CT7FormModel.deletePublicRecordResult,
}))
export default class WorkRecordSingle extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '工作记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            deleteItemIndex: -1, // 删除的item的索引
            DepartureTime: moment().format('YYYY-MM-DD HH:mm'),
            stateDatas: [],
            entList: [], // 企业列表
            completionStatusList: [
                { code: 1, label: '已完成' },
                { code: 0, label: '未完成' }
            ] // 完成状态列表
        };
    }

    componentDidMount() {
        if (SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1) {
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            this.props.dispatch(
                createAction('CTWorkRecordModel/getWorkRecord')({
                    params: {
                        mainId: this.props.dispatchId,
                        serviceId: serviceId,
                        RecordId: RecordId
                    },
                    callback: result => {
                        const ishandle = this.combinedData('workRecordResult', result);
                        if (!ishandle) {
                            const data = SentencedToEmpty(result, ['data', 'Datas'], {});
                            this.setState(
                                {
                                    DepartureTime: SentencedToEmpty(data, ['0', 'DepartureTime'], moment().format('YYYY-MM-DD HH:mm')),
                                    stateDatas: data
                                },
                                () => {
                                    this.props.dispatch(
                                        createAction('CTWorkRecordModel/updateState')({
                                            workRecordResult: result
                                        })
                                    );
                                }
                            );
                        }
                        return true;
                    }
                })
            );
        } else {
            let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            let item = {
                pointList: [], // 监测点列表

                mainId: this.props.dispatchId,
                serviceId: serviceId,
                RecordId: RecordId,
                PointId: '', //多条时 传监测点ID
                Remark: '', //备注
                // "SystemModelId": "string",// 系统型号ID (指导安装大类下的工作记录要传这个)
                ActualHour: '', //实际工时
                CompletionStatus: -1, //完成状态 （0 未完成 1已完成, -1 未填写 ，已完成时必填完成时间）
                CompletionTime: moment().format('YYYY-MM-DD HH:mm'), //完成时间
                DepartureTime: moment().format('YYYY-MM-DD HH:mm') //离开现场时间
                // "Col1": 0,//是否调试完成  72小时调试检测的工作记录加一个是否调试完成接口的字段Col1
            };
            datas.push(item);
            this.setState({
                stateDatas: datas
            });
        }
    }

    combinedData = (currentFunName, result) => {
        let optionStatus, dataStatus, entlist, dataList;
        if (currentFunName == 'workRecordResult') {
            optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
            dataStatus = result.status;
            entlist = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'data', 'Datas'], []);
            dataList = SentencedToEmpty(result, ['data', 'Datas'], []);
        } else if (currentFunName == 'projectEntPointSysModelResult') {
            optionStatus = result.status;
            dataStatus = SentencedToEmpty(this.props, ['workRecordResult', 'status'], 1000);
            entlist = SentencedToEmpty(result, ['data', 'Datas'], []);
            dataList = SentencedToEmpty(this.props, ['workRecordResult', 'data', 'Datas'], []);
        }
        if (optionStatus == 200 && dataStatus == 200) {
            // dataList.map((item,index)=>{
            //     console.log(item.EntId);
            //     console.log(item.PointId);
            //     entlist.map((entItem,entIndex)=>{
            //         if (entItem.EntId == item.EntId) {
            //             item.pointList = entItem.PointList;
            //             entItem.PointList.map((pointItem,pointIndex)=>{
            //                 if (pointItem.PointId == item.PointId) {
            //                     item.systemModleList = pointItem.systemModleList
            //                 }
            //             });
            //         }
            //     });
            // });
            if (currentFunName == 'workRecordResult') {
                this.setState(
                    {
                        DepartureTime: SentencedToEmpty(dataList, ['0', 'DepartureTime'], moment().format('YYYY-MM-DD HH:mm')),
                        stateDatas: dataList
                    },
                    () => {
                        this.props.dispatch(
                            createAction('CTWorkRecordModel/updateState')({
                                workRecordResult: result
                            })
                        );
                    }
                );
            } else if (currentFunName == 'projectEntPointSysModelResult') {
                this.setState(
                    {
                        entList: SentencedToEmpty(result, ['data', 'Datas'], []),
                        stateDatas: dataList
                    },
                    () => {
                        this.props.dispatch(
                            createAction('CTModel/updateState')({
                                projectEntPointSysModelResult: result
                            })
                        );
                    }
                );
            }
            return true;
        }
        return false;
    };

    getDepartureTimeOption = index => {
        let type = 'minute';

        return {
            defaultTime: this.state.DepartureTime,
            type: type,
            onSureClickListener: time => {
                this.setState({
                    DepartureTime: moment(time).format('YYYY-MM-DD HH:mm')
                });
            }
        };
    };

    getCompletionTimeOption = index => {
        let type = 'minute';

        return {
            defaultTime: SentencedToEmpty(this.state, ['stateDatas', index, 'CompletionTime'], moment().format('YYYY-MM-DD HH:mm')),
            type: type,
            onSureClickListener: time => {
                let newData = [].concat(this.state.stateDatas);
                newData[index].CompletionTime = moment(time).format('YYYY-MM-DD HH:mm');
                this.setState({
                    stateDatas: newData
                });
            }
        };
    };

    getCompletionStatusLabel = (index, key) => {
        //'CompletionStatus'
        const item = this.state.completionStatusList.filter((item, listIndex) => {
            return item.code == SentencedToEmpty(this.state, ['stateDatas', index, key], 0);
        });
        return SentencedToEmpty(item, [0, 'label'], '');
    };

    // 完成状态 配置
    getCompletionStatusSelectOption = index => {
        return {
            codeKey: 'code',
            nameKey: 'label',
            dataArr: this.state.completionStatusList,
            defaultCode: SentencedToEmpty(this.state, ['stateDatas', index, 'CompletionStatus'], -1),
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                    let newData = [].concat(this.state.stateDatas);
                    newData[index].CompletionStatus = item.code;
                    if (item.code == 1) {
                        // 已完成
                        newData[index].CompletionTime = moment().format('YYYY-MM-DD HH:mm');
                    } else {
                        newData[index].CompletionTime = null;
                    }
                    this.setState({
                        stateDatas: newData
                    });
                }
            }
        };
    };

    getPageStatus = () => {
        // projectEntPointSysModelResult
        // workRecordResult
        const dataStatus = SentencedToEmpty(this.props, ['workRecordResult', 'status'], 1000);
        const optionStatus = SentencedToEmpty(this.props, ['projectEntPointSysModelResult', 'status'], 1000);
        if (dataStatus == 404 || optionStatus == 404) {
            return 404;
        } else if (dataStatus == 1000 || optionStatus == 1000) {
            return 1000;
        } else if (dataStatus == -1 || optionStatus == -1) {
            return -1;
        } else if (dataStatus == 0) {
            return 0;
        } else if (dataStatus == 200 && optionStatus == 200) {
            return 200;
        } else {
            return 1000;
        }
    };

    checkParams = checkData => {
        let realCheckData = checkData;
        if (typeof commitList == 'undefined' || !commitList) {
            realCheckData = SentencedToEmpty(this.state, ['stateDatas'], []);
        }
        if (realCheckData.length == 0) {
            ShowToast('表单数据不能为空！');
            return { checkStatus: false };
        }
        let checkStatus = true;
        let cList = [],
            tempItem;
        realCheckData.map((item, index) => {
            tempItem = item;
            if (SentencedToEmpty(item, ['ActualHour'], '') == '') {
                ShowToast(`实际工时未填写`);
                checkStatus = false;
                return false;
            } else if (!/^\d+(\.\d+)?$/.test(SentencedToEmpty(item, ['ActualHour'], ''))) {
                ShowToast('实际工时数字格式非法');
                checkStatus = false;
                return false;
            }
            if (SentencedToEmpty(item, ['CompletionStatus'], -1) != 0 && SentencedToEmpty(item, ['CompletionStatus'], -1) != 1) {
                ShowToast(`完成状态不能为空`);
                checkStatus = false;
                return false;
            }

            if (SentencedToEmpty(item, ['CompletionStatus'], -1) == 1 && SentencedToEmpty(item, ['CompletionTime'], '') == '') {
                ShowToast(`完成时间未填写`);
                checkStatus = false;
                return false;
            }

            if (SentencedToEmpty(item, ['CompletionStatus'], 0) == 0) {
                tempItem = { ...item };
                delete tempItem.CompletionTime;
            }
            // 去掉 离开现场时间
            // tempItem.DepartureTime = this.state.DepartureTime;

            cList.push(tempItem);
        });
        if (checkStatus) {
            const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
            let params = {
                mainId: this.props.dispatchId,
                serviceId: serviceId,
                RecordId: RecordId,
                cList
            };
            return { checkStatus: true, params };
        } else {
            return { checkStatus: false };
        }
    };

    cancelButton = () => { };

    confirmDeleteForm = () => {
        const RecordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTWorkRecordModel/deleteWorkRecord')({
                // this.props.dispatch(createAction('CTModel/deleteAcceptanceServiceRecord')({
                params: {
                    mainId: this.props.dispatchId,
                    serviceId: serviceId,
                    RecordId: RecordId
                },
                callback: result => { }
            })
        );
    };

    renderLoadingComponent = () => {
        if (SentencedToEmpty(this.props, ['addWorkRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'提交中'} />;
        } else if (SentencedToEmpty(this.props, ['deleteWorkRecordResult', 'status'], 200) == -1) {
            return <SimpleLoadingView message={'删除中'} />;
        } else {
            return null;
        }
    };

    isEdit = () => {
        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        if (TaskStatus == 3) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let alertDeleteFormOptions = {
            headTitle: '提示',
            messText: '是否确定要删除此工作记录？',
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
                    onpress: this.confirmDeleteForm
                }
            ]
        };
        return (
            <StatusPage
                status={SentencedToEmpty(this.props, ['workRecordResult', 'status'], 1000)}
                errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
                errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
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
                <View
                    style={[
                        {
                            width: SCREEN_WIDTH,
                            flex: 1
                        }
                    ]}
                >
                    {/* 5 */}
                    <View
                        style={[
                            {
                                height: 45,
                                width: SCREEN_WIDTH,
                                paddingHorizontal: 19,
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 38,
                                    height: 44,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`实际工时（小时）`}</Text>
                            <TextInput
                                editable={this.isEdit()}
                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                placeholder=""
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                underlineColorAndroid={'transparent'}
                                onChangeText={text => {
                                    //动态更新组件内state 记录输入内容
                                    let newData = [].concat(this.state.stateDatas);
                                    newData[0].ActualHour = text;
                                    this.setState({
                                        stateDatas: newData
                                    });
                                }}
                                value={SentencedToEmpty(this.state, ['stateDatas', 0, 'ActualHour'], '') + ''}
                                style={{ textAlign: 'right', color: '#666666', marginRight: 0, fontSize: 14, height: 40, flex: 1 }}
                            />
                            {/* <Text style={[{ fontSize:14, color:'#333333' }]}>{`小时`}</Text> */}
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
                    {/* 5 */}
                    {/* 6 */}
                    <View
                        style={[
                            {
                                height: 45,
                                width: SCREEN_WIDTH,
                                paddingHorizontal: 19,
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 38,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                            <Text style={[{ fontSize: 14, color: '#333333' }]}>{`完成状态`}</Text>
                            <PickerTouchable
                                available={this.isEdit()}
                                ref={ref => (this.pointS = ref)}
                                option={this.getCompletionStatusSelectOption(0)}
                                // onPress={this.props.selectEnterprise.EntName == '请选择' ? this.judgeEnterprise : null}
                                style={[{ flex: 1, height: 44, flexDirection: 'row' }]}
                            >
                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            height: 44,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center'
                                        }
                                    ]}
                                >
                                    <Text>{`${this.getCompletionStatusLabel(0, 'CompletionStatus')}`}</Text>
                                    <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                </View>
                            </PickerTouchable>
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
                    {/* 6 */}
                    {/* 7 */}
                    {SentencedToEmpty(this.state, ['stateDatas', 0, 'CompletionStatus'], 0) == 1 ? (
                        <View
                            style={[
                                {
                                    height: 45,
                                    width: SCREEN_WIDTH,
                                    paddingHorizontal: 19,
                                    justifyContent: 'center',
                                    backgroundColor: 'white'
                                }
                            ]}
                        >
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 38,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }
                                ]}
                            >
                                <Text style={[{ color: 'red', marginRight: 4 }]}>{'*'}</Text>
                                <Text style={[{ fontSize: 14, color: '#333333' }]}>{`完成时间`}</Text>
                                <PickerSingleTimeTouchable
                                    available={this.isEdit()}
                                    option={this.getCompletionTimeOption(0)} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 0, height: 44 }}>
                                    <View
                                        style={[
                                            {
                                                flex: 1,
                                                height: 44,
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.stateDatas[0].CompletionTime).format('YYYY-MM-DD HH:mm')}</Text>
                                        <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                                    </View>
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
                    ) : null}
                    {/* 7 */}
                    {/* <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                height: 44,
                                backgroundColor: 'white',
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
                            {'离开现场时间'}
                        </Text>
                        <PickerSingleTimeTouchable
                            available={this.isEdit()}
                            option={this.getDepartureTimeOption()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 0, height: 25 }}>
                            <Text style={{ fontSize: 14, color: '#666' }}>{moment(this.state.DepartureTime).format('YYYY-MM-DD HH:mm')}</Text>
                            <Image style={[{ height: 15, width: 15 }]} source={require('../../../images/ic_arrows_right.png')} />
                        </PickerSingleTimeTouchable>
                    </View> */}
                    {/* 9 */}
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH,
                                minHeight: 107,
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
                                    justifyContent: 'center'
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        fontSize: 14,
                                        color: '#333333'
                                    }
                                ]}
                            >
                                {'备注'}
                            </Text>
                        </View>
                        <TextInput
                            editable={this.isEdit()}
                            multiline={true}
                            placeholder={this.isEdit() ? '请填写备注' : '未记录备注'}
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
                            onChangeText={text => {
                                let newData = [].concat(this.state.stateDatas);
                                newData[0].Remark = text;
                                this.setState({
                                    stateDatas: newData
                                });
                            }}
                        >
                            {`${SentencedToEmpty(this.state, ['stateDatas', 0, 'Remark'], '')}`}
                        </TextInput>
                    </View>
                    {/* 9 */}
                    <View style={[{ flex: 1 }]} />
                    {!this.isEdit() ? null : SentencedToEmpty(this.props, ['secondItem', 'RecordStatus'], -1) == 1 ? (
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH,
                                    height: 84,
                                    flexDirection: 'row',
                                    paddingHorizontal: 10,
                                    paddingVertical: 20,
                                    justifyContent: 'space-between'
                                }
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.refs.deleteFormAlert.show();
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: (SCREEN_WIDTH - 30) / 2,
                                            height: 44,
                                            borderRadius: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#FFA500'
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
                                        {'删除'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    const paramsCheckResult = this.checkParams();
                                    if (paramsCheckResult.checkStatus) {
                                        this.props.dispatch(createAction('CTWorkRecordModel/addWorkRecord')({ params: paramsCheckResult.params }));
                                    }
                                }}
                            >
                                <View
                                    style={[
                                        {
                                            width: (SCREEN_WIDTH - 30) / 2,
                                            height: 44,
                                            borderRadius: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#4DA9FF'
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
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                const paramsCheckResult = this.checkParams();
                                if (paramsCheckResult.checkStatus) {
                                    this.props.dispatch(createAction('CTWorkRecordModel/addWorkRecord')({ params: paramsCheckResult.params }));
                                }
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
                        </TouchableOpacity>
                    )}
                </View>
                <AlertDialog options={alertDeleteFormOptions} ref="deleteFormAlert" />
                {this.renderLoadingComponent()}
            </StatusPage>
        );
    }
}
