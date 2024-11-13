/*
 * @Description: 超时服务填报 
 * @LastEditors: hxf
 * @Date: 2024-03-18 15:50:31
 * @LastEditTime: 2024-11-11 13:51:50
 * @FilePath: /SDLSourceOfPollutionS/app/pOperationContainers/tabView/chengTaoXiaoXi/TimeoutService.js
 */
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { SCREEN_WIDTH } from '../../../config/globalsize'
import Form2Switch from '../../../operationContainers/taskViews/taskExecution/components/Form2Switch';
import { SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { DeclareModule, MoreSelectTouchable, StatusPage } from '../../../components';
import { connect } from 'react-redux';

@connect(({ CTModel, CTServiceStatisticsModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    recordQuestionResult: CTServiceStatisticsModel.recordQuestionResult, // 超时、重复派单原因码表 
    overTimeServiceRecordResult: CTServiceStatisticsModel.overTimeServiceRecordResult, // 超时派单信息 
    timeoutCauseList: CTServiceStatisticsModel.timeoutCauseList, // 记录列表
    timeoutCauseHasData: CTServiceStatisticsModel.timeoutCauseHasData, // 是否有超时服务表单
}))
export default class TimeoutService extends Component {

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '超时服务填报',
            // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
            headerRight: (
                <DeclareModule
                    contentRender={() => {
                        return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                    }}
                    options={{
                        headTitle: '说明',
                        innersHeight: 180,
                        // messText: `文字未提供`,
                        messText: ` `,
                        headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                        buttons: [
                            {
                                txt: '知道了',
                                btnStyle: { backgroundColor: '#fff' },
                                txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                                onpress: () => { }
                            }
                        ]
                    }}
                />
            )
        });
    };

    componentDidMount() {
        this.onRefreshWithLoading();
        this.props.navigation.setOptions({
            headerRight: () => <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 180,
                    // messText: `文字未提供`,
                    messText: ` `,
                    headStyle: { color: '#333', fontSize: 18, borderTopLeftRadius: 5, borderTopRightRadius: 5, fontWeight: 'bold' },
                    buttons: [
                        {
                            txt: '知道了',
                            btnStyle: { backgroundColor: '#fff' },
                            txtStyle: { color: '#f97740', fontSize: 15, fontWeight: 'bold' },
                            onpress: () => { }
                        }
                    ]
                }}
            />
        });
    }

    onRefreshWithLoading = () => {
        this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
            recordQuestionResult: { status: -1 }, // 超时、重复派单原因码表 
            overTimeServiceRecordResult: { status: -1 }, // 超时派单信息
            timeoutCauseList: [], // 记录列表
            timeoutCauseHasData: '', // 是否有超时服务表单
        }));
        // 参数 questionType （必传）  65 、 超时原因 66、重复派单原因   
        this.props.dispatch(createAction('CTServiceStatisticsModel/getRecordQuestion')({
            params: { questionType: 65 }
        }));
        this.props.dispatch(createAction('CTServiceStatisticsModel/getOverTimeServiceRecord')({
            params: {}
        }));
    }

    getTimeoutCauseOption = () => {
        let selectCodes = [];
        let dataSource = [];
        dataSource = SentencedToEmpty(this.props, ['recordQuestionResult', 'data', 'Datas'], []);
        const timeoutCauseList = SentencedToEmpty(this.props, ['timeoutCauseList'], []);
        timeoutCauseList.map((item, index) => {
            selectCodes.push(item.QuestionID)
        });

        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            selectName: '',
            // placeHolderStr: '污染物',
            codeKey: 'ChildID',
            nameKey: 'Name',
            // maxNum: 2,
            selectCode: selectCodes,
            dataArr: dataSource,
            callback: ({ selectCode = [], selectNameStr, selectCodeStr, selectData }) => {
                selectData.map((item, index) => {
                    item.QuestionID = item.ChildID;
                    item.QuestionName = item.Name;
                });
                let findIndex = -1;
                let selectedIndexList = [];
                let deleteIndexList = [];
                SentencedToEmpty(this.props
                    , ['timeoutCauseList'], [])
                    .map((item, index) => {
                        if (SentencedToEmpty(item, ['QuestionID'], '') != '') {
                            findIndex = selectCode.findIndex(codeItem => {
                                if (codeItem == item.QuestionID) {
                                    return true;
                                }
                            });
                            if (findIndex == -1) {
                                deleteIndexList.push({ findIndex, dataIndex: index, recordId: item.ChildID, recordName: item.Name });
                            } else {
                                selectedIndexList.push({ findIndex, dataIndex: index });
                            }
                        }
                    });
                selectedIndexList.map(selectedDateItem => {
                    console.log(selectData[selectedDateItem.findIndex]);
                    selectData[selectedDateItem.findIndex] = {
                        // QuestionID: selectData[selectedDateItem.findIndex].ChildID,
                        ...selectData[selectedDateItem.findIndex],
                        ...this.props.timeoutCauseList[selectedDateItem.dataIndex]
                    };
                });
                console.log('deleteIndexList = ', deleteIndexList)
                console.log('selectData = ', selectData)
                if (deleteIndexList.length > 0) {
                    // this.setState({
                    //     newData: selectData,
                    //     lastSelectCodes: this._picker.getBeforeSubmitData(),
                    //     pageSelectCodes: selectCode,
                    //     deleteIndexList
                    // });
                    // this.refs.delConfigItemsAlert.show();
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({ timeoutCauseList: selectData }));
                } else {
                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({ RecordList: selectData, timeoutCauseList: selectData }));
                }
            }
        };
    }

    getPageStatus = () => {
        const recordQuestionStatus = SentencedToEmpty(this.props
            , ['recordQuestionResult', 'status'], 1000);
        const overTimeServiceRecordStatus = SentencedToEmpty(this.props
            , ['overTimeServiceRecordResult', 'status'], 1000);
        if (recordQuestionStatus == 200
            && overTimeServiceRecordStatus == 200) {
            return 200;
        } else if (recordQuestionStatus == -1
            || overTimeServiceRecordStatus == -1) {
            return -1;
        } else {
            if (recordQuestionStatus != 200) {
                return recordQuestionStatus;
            } else if (overTimeServiceRecordStatus != 200) {
                return overTimeServiceRecordStatus;
            } else {
                return 1000;
            }
        }
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
        const timeoutCauseList = SentencedToEmpty(this.props, ['timeoutCauseList'], []);
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
            <View style={[{
                width: SCREEN_WIDTH,
                flex: 1
            }]}>
                <View style={[{
                    width: SCREEN_WIDTH, height: 44
                    , paddingHorizontal: 20
                    , justifyContent: 'center', alignItems: 'center'
                    , backgroundColor: '#fff'
                }]}>
                    <Form2Switch
                        editable={this.isEdit()}
                        label='是否有超时服务'
                        data={[{ name: '是', value: true }, { name: '否', value: false }]}
                        value={SentencedToEmpty(this.props, ['timeoutCauseHasData'], '')}
                        onChange={(value) => {
                            // timeoutCauseHasData
                            // console.log('timeoutCauseHasData = ', value);

                            this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                timeoutCauseHasData: value
                                , RecordList: [], timeoutCauseList: []
                            }));
                        }}
                    />
                </View>

                {SentencedToEmpty(this.props, ['timeoutCauseHasData'], false)
                    && this.isEdit() ? < MoreSelectTouchable
                        count={2}
                        ref={ref => (this._picker = ref)}
                        option={this.getTimeoutCauseOption()}
                    >
                    <View style={[{
                        width: SCREEN_WIDTH, height: 60
                        , justifyContent: 'center', alignItems: 'center', alignItems: 'center'
                        , backgroundColor: '#fff'
                    }]}>
                        <View
                            style={[{
                                width: 150, height: 30,
                                borderRadius: 5,
                                backgroundColor: '#F6F6F6'
                                , justifyContent: 'center', alignItems: 'center'
                            }]}
                        >
                            <Text
                                style={[{
                                    color: '#4AA0FF', fontSize: 14
                                }]}
                            >{'选择超时原因'}</Text>
                        </View>
                    </View>
                </MoreSelectTouchable> : null}
                <ScrollView
                    style={[{
                        width: SCREEN_WIDTH,
                    }]}
                >
                    <View style={[{
                        width: SCREEN_WIDTH, backgroundColor: '#fff',
                        marginTop: 1
                    }]}>
                        {
                            timeoutCauseList.map((item, index) => {
                                if (index == timeoutCauseList.length - 1) {
                                    return (<View style={[{
                                        width: SCREEN_WIDTH, height: 44
                                        , alignItems: 'center'
                                    }]}>
                                        <View
                                            style={[{
                                                width: SCREEN_WIDTH - 40, height: 44
                                                , flexDirection: 'row', alignItems: 'center'
                                                , justifyContent: 'space-between'
                                            }]}
                                        >
                                            <Text style={[{
                                                fontSize: 14, color: '#333333'
                                            }]}>{`${index + 1}、${item.QuestionName}`}</Text>
                                            <TextInput
                                                editable={this.isEdit()}
                                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                style={[{
                                                    fontSize: 14, color: '#666666'
                                                    , textAlign: 'right'
                                                }]}
                                                placeholder={'服务时长(小时)'}
                                                placeholderTextColor={'#999999'}
                                                onChangeText={text => {
                                                    let newItem = { ...item }
                                                    newItem.OverTime = text;
                                                    let newList = [].concat(timeoutCauseList);
                                                    newList[index] = newItem;
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                        timeoutCauseList: newList
                                                    }));
                                                }}
                                            >
                                                {SentencedToEmpty(item, ['OverTime'], '')}
                                            </TextInput>
                                        </View>
                                    </View>);
                                } else {
                                    return (<View style={[{
                                        width: SCREEN_WIDTH, height: 44
                                        , alignItems: 'center'
                                    }]}>
                                        <View
                                            style={[{
                                                width: SCREEN_WIDTH - 40, height: 44
                                                , borderBottomWidth: 1, borderBottomColor: '#E7E7E7'
                                                , flexDirection: 'row', alignItems: 'center'
                                                , justifyContent: 'space-between'
                                            }]}
                                        >
                                            <Text style={[{
                                                fontSize: 14, color: '#333333'
                                            }]}>{`${index + 1}、${item.QuestionName}`}</Text>
                                            <TextInput
                                                editable={this.isEdit()}
                                                keyboardType={Platform.OS == 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                                                style={[{
                                                    fontSize: 14, color: '#666666'
                                                    , textAlign: 'right'
                                                }]}
                                                placeholder={'服务时长(小时)'}
                                                placeholderTextColor={'#999999'}
                                                onChangeText={text => {
                                                    let newItem = { ...item }
                                                    newItem.OverTime = text;
                                                    let newList = [].concat(timeoutCauseList);
                                                    newList[index] = newItem;
                                                    this.props.dispatch(createAction('CTServiceStatisticsModel/updateState')({
                                                        timeoutCauseList: newList
                                                    }));
                                                }}
                                            >
                                                {SentencedToEmpty(item, ['OverTime'], '')}
                                            </TextInput>
                                        </View>
                                    </View>);
                                }

                            })
                        }
                    </View>
                </ScrollView>
                <View
                    style={[{
                        width: SCREEN_WIDTH, height: 75
                        , justifyContent: 'center', alignItems: 'center'
                    }]}
                >
                    {this.isEdit() ? <TouchableOpacity
                        onPress={() => {
                            const timeoutCauseHasData = SentencedToEmpty(this.props, ['timeoutCauseHasData'], '');
                            const timeoutCauseList = SentencedToEmpty(this.props, ['timeoutCauseList'], []);
                            if (timeoutCauseHasData === '') {
                                ShowToast('是否有超时服务表单为必选项！');
                            } else if (timeoutCauseHasData) {
                                if (timeoutCauseList.length > 0) {
                                    let allCorrect = true, errorItemIndex = -1;
                                    timeoutCauseList.map((item, index) => {
                                        if (SentencedToEmpty(item, ['OverTime'], '') == '') {
                                            if (allCorrect) errorItemIndex = index;
                                            allCorrect = false;
                                        }
                                    });
                                    if (allCorrect) {
                                        ShowLoadingToast('正在提交');
                                        this.props.dispatch(
                                            createAction('CTServiceStatisticsModel/addOrUpdOverTimeServiceRecord')({}));
                                    } else {
                                        ShowToast(`第${errorItemIndex + 1}项服务时长缺失！`);
                                    }
                                } else {
                                    ShowToast('未添加超时原因！');
                                }
                            } else {
                                ShowLoadingToast('正在提交');
                                this.props.dispatch(
                                    createAction('CTServiceStatisticsModel/addOrUpdOverTimeServiceRecord')({}));
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
            </View >
        </StatusPage >)
    }
}