import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Platform, DeviceEventEmitter } from 'react-native';
import { BaseTable, PickerSingleTimeTouchable, PickerTouchable, KeyboardDis, AlertDialog, Touchable, SelectButton, SimpleMultipleItemPicker, SimplePicker } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/globalsize';
import { connect } from 'react-redux';
import moment from 'moment';
import SimpleLoadingComponent from '../../components/SimpleLoadingComponent';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
const ic_arrows_down = require('../../images/ic_arrows_down.png');

/**
 * 派发任务
 */
@connect(({ taskModel }) => ({
    taskType: taskModel.taskType,
    applyData: taskModel.applyData
}))
export default class DistributeTask extends PureComponent {
    static navigationOptions = createNavigationOptions({
        title: '派发任务',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });
    constructor(props) {
        super(props);
        this.state = {
            taskTypes: [],
            code: '',
            remark: '',
            selectTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            selectTaskItem: []
        };
        _me = this;
    }
    componentDidMount() {
        this.props.dispatch(
            createAction('taskModel/getTaskType')({
                params: {
                    PollutantType: this.props.navigation.state.params.PollutantType,
                    callback: item => {
                        this.props.taskType = item;
                        this.forceUpdate();
                    }
                }
            })
        );
    }
    componentWillUnmount() { }

    getTaskTypeOption = () => {
        // let selectCodes = [];
        // this.props.selectCodeArr.map(item => {
        //     selectCodes.push(item.PollutantCode);
        // });
        return {
            contentWidth: 166,
            // selectName: '选择污染物',
            placeHolderStr: '请选择任务类型',
            codeKey: 'ID',
            hideImg: true,
            nameKey: 'TypeName',
            // maxNum: 3,
            // selectCode: selectCodes,
            dataArr: SentencedToEmpty(this.props.taskType, ['data', 'Datas'], []),
            callback: ({ selectCode, selectNameStr, selectCodeStr, selectData }) => {
                this.setState({
                    selectTaskItem: selectData
                });
            }
        };
    };

    getTimeSelectOption = () => {
        let type = 'day';
        return {
            // defaultTime:'2019-05-22 00:00',
            type: type,
            onSureClickListener: time => {
                this.setState({
                    selectTime: this.formatTime(time, 'DayData')
                });
            }
        };
    };

    formatShowTime = (time, dataType) => {
        if (time == null || time == '') {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('MM/DD HH:00');
            case 'DayData':
                return moment(time).format('YYYY/MM/DD');
            case 'MonthData':
                return moment(time).format('YYYY/MM');
            case 'YearData':
                return moment(time).format('YYYY年');
        }
    };

    formatTime = (time, dataType) => {
        if (time == null) {
            time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        switch (dataType) {
            case 'HourData':
                return moment(time).format('YYYY-MM-DD HH:00:00');
            case 'DayData':
                return moment(time).format('YYYY-MM-DD 00:00:00');
            case 'MonthData':
                return moment(time).format('YYYY-MM-01 00:00:00');
            case 'YearData':
                return moment(time).format('YYYY-01-01 00:00:00');
        }
    };

    getTaskTypeOption = () => {
        return {
            disImage: true,
            codeKey: 'ID',
            nameKey: 'TypeName',
            placeHolder: '请选择任务类型',
            defaultCode: '-1',
            dataArr: SentencedToEmpty(this.props.taskType, ['data', 'Datas'], []),
            onSelectListener: item => {
                this.setState({
                    selectTaskItem: [item]
                });
            }
        };
    };

    render() {
        return (
            <View style={styles.container}>
                {this.props.applyData.status == -1 ? <SimpleLoadingComponent message={'正在派发任务'} /> : null}
                <KeyboardAwareScrollView ref="scroll" style={{ flex: 1, width: SCREEN_WIDTH }}>
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                        <View style={styles.rowInner}>
                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 企业/监测站'}</Text>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{this.props.navigation.state.params.entName}</Text>
                        </View>
                    </View>
                    <View style={styles.line} />
                    <View style={[styles.row, { justifyContent: 'space-between' }]}>
                        <View style={styles.rowInner}>
                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 监测点位'}</Text>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{this.props.navigation.state.params.pointName}</Text>
                        </View>
                    </View>
                    <View style={styles.line} />
                    {this.props.taskType.status == 200 ? (
                        <View style={[styles.row, { justifyContent: 'space-between' }]}>
                            <View style={[styles.rowInner, {}]}>
                                <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 任务类型'}</Text>
                                {/* <SimpleMultipleItemPicker
                                    ref={ref => {
                                        this.simpleMultipleItemPicker = ref;
                                    }}
                                    option={this.getTaskTypeOption()}
                                    style={[{ marginLeft: 14 }]}
                                    textStyle={{ textAlign: 'left' }}
                                /> */}
                                <SimplePicker
                                    ref={ref => {
                                        this.simplePicker = ref;
                                    }}
                                    option={this.getTaskTypeOption()}
                                    style={[{ marginLeft: 14, width: SCREEN_WIDTH - 140 }]}
                                    textStyle={{ textAlign: 'left', flex: 1 }}
                                />
                            </View>
                            <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                        </View>
                    ) : null}
                    <View style={styles.line} />
                    {/* <PickerSingleTimeTouchable option={this.getTimeSelectOption()} style={[styles.row, { justifyContent: 'space-between' }]}>
                        <View style={styles.rowInner}>
                            <Text style={{ fontSize: 14, color: 'red', marginLeft: 20 }}>{'* 执行日期'}</Text>
                            <Text style={{ fontSize: 14, color: '#666', marginLeft: 24 }}>{this.formatShowTime(this.state.selectTime, 'DayData')}</Text>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={ic_arrows_down} />
                    </PickerSingleTimeTouchable> */}
                    <View style={styles.line} />
                    <View style={{ minHeight: 100, width: SCREEN_WIDTH, padding: 20, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 14, color: '#333' }}>任务描述</Text>
                        <TextInput
                            placeholder={'请输入批注内容'}
                            style={{
                                color: '#333333',
                                textAlignVertical: 'top', height: 54
                                , width: SCREEN_WIDTH - 40, backgroundColor: 'white'
                            }}
                            multiline={true}
                            onChangeText={text => {
                                // 动态更新组件内State记录
                                this.setState({
                                    remark: text
                                });
                            }}
                        />
                    </View>

                    <View style={styles.line} />
                </KeyboardAwareScrollView>

                <Touchable
                    onPress={() => {
                        if (this.state.selectTaskItem.length == 0) {
                            ShowToast('请选择任务类型');
                            return;
                        }
                        let taskStr = '';
                        this.state.selectTaskItem.map(item => {
                            taskStr = item.ID + ',' + taskStr;
                        });

                        this.props.dispatch(
                            createAction('taskModel/commitTaskApply')({
                                params: {
                                    // ImplementDate: this.state.selectTime,
                                    taskType: '1',
                                    taskFrom: '3',
                                    remark: this.state.remark,
                                    DGIMNs: this.props.navigation.state.params.DGIMN,
                                    RecordType: taskStr
                                },
                                successMsg: '任务派发成功',
                                errorMsg: '任务派发失败',
                                backViewFun: () => {
                                    this.props.dispatch(NavigationActions.back());
                                }
                            })
                        );
                    }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#5688f6',
                        marginBottom: 10,
                        height: 50,
                        width: SCREEN_WIDTH - 20
                    }}
                >
                    <Text style={{ color: 'white' }}>派发</Text>
                </Touchable>
            </View>
        );
    }
    componentWillUnmount() {
        // DeviceEventEmitter.emit('refresh', 'true');
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    row: {
        width: '100%',
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rowInner: {
        height: 45,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#e5e5e5'
    }
});
