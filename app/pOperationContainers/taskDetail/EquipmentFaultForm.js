import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createNavigationOptions, createAction, ShowToast, SentencedToEmpty } from '../../utils';
import { View, Platform, StyleSheet, Image, ScrollView, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import {
    StatusPage, SDLText, PickerSingleTimeTouchable
    , SelectButton, Touchable, TextInput, Button, AlertDialog
    , MoreSelectTouchable, PickerTouchable, SimpleLoadingComponent
} from '../../components';
import { SCREEN_WIDTH } from '../../config/globalsize';
import moment from 'moment';
import globalcolor from '../../config/globalcolor';
import DeclareModule from '../../components/modal/DeclareModule';
import { getToken } from '../../dvapack/storage';
const HeaderStart = 'headerStart';
const HeaderEnd = 'headerEnd';
const SelectItemStart = 'selectItemStart';
const SelectItemEnd = 'selectItemEnd';
/**
 *
 *设备故障小时记录
 */
@connect(({ equipmentFautModel }) => ({
    liststatus: equipmentFautModel.liststatus,
    editstatus: equipmentFautModel.editstatus,
    RecordList: equipmentFautModel.RecordList,
    MainInfo: equipmentFautModel.MainInfo,
    BaseInfo: equipmentFautModel.BaseInfo,
    faultRecordParamesResult: equipmentFautModel.faultRecordParamesResult
}))
export default class EquipmentFaultForm extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '异常小时数记录',
            headerRight: (
                <DeclareModule
                    options={{
                        headTitle: '说明',
                        innersHeight: 280,
                        messText: `1、通过异常小时数记录表统计上次填报至今由于各种原因导致的现场异常小时数据的个数。
2、填报说明：如6月1日【2点、3点】由于各种原因导致小时数据异常，则填写06-01 02:00至06-01 03:00，异常小时数为2小时（自动计算）。
3、填报方式为连续时间段填报，即一条记录内的异常小时数据必须是连续的，否则填写多条记录。
4、若一个时间段内的异常小时数据只有一条，如6月1日【2点】，则填写06-01 02:00至06-01 02:00，异常小时数为1小时（自动计算）。`,
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

    constructor(props) {
        super(props);
        this.state = {
            StartTime: '',
            FormMainID: this.props.route.params.params.FormMainID,
            aa: '',
            Flag: '0',
            MaintenanceManagementUnit: '',
            PointPosition: '',
            EndTime: '',
            CurrentEdit: 0,
            recordNum: 0,
            recordLst: [],
            dataArray: [
                {
                    title: '有',
                    id: 1
                },
                {
                    title: '无',
                    id: 0
                }
            ]
        };
        _me = this;

        this.props.navigation.setOptions({
            headerRight: () => (
                <DeclareModule
                    options={{
                        headTitle: '说明',
                        innersHeight: 280,
                        messText: `1、通过异常小时数记录表统计上次填报至今由于各种原因导致的现场异常小时数据的个数。
2、填报说明：如6月1日【2点、3点】由于各种原因导致小时数据异常，则填写06-01 02:00至06-01 03:00，异常小时数为2小时（自动计算）。
3、填报方式为连续时间段填报，即一条记录内的异常小时数据必须是连续的，否则填写多条记录。
4、若一个时间段内的异常小时数据只有一条，如6月1日【2点】，则填写06-01 02:00至06-01 02:00，异常小时数为1小时（自动计算）。`,
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
    }
    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        this.props.dispatch(
            createAction('equipmentFautModel/getFaultRecordparames')({}))
        this.props.dispatch(
            createAction('equipmentFautModel/getForm')({
                params: { TypeID: this.props.route.params.params.ID },
                callback: (item, liststatus) => {
                    this.setState({
                        StartTime: item.Content.BeginTime,
                        EndTime: item.Content.EndTime == null ? moment().subtract(1, 'hours').format('YYYY-MM-DD HH:00:00') : item.Content.EndTime,
                        recordLst: item.RecordList || [],
                        Flag: item.Content.Flag,
                        MaintenanceManagementUnit: item.Content.MaintenanceManagementUnit,
                        PointPosition: item.Content.PointPosition,
                    }, () => {
                        this.props.dispatch(
                            createAction('equipmentFautModel/updateState')({
                                liststatus
                            }))
                    });
                    /**
                     * true     页面更新status
                     * false    effect更新status 
                     */
                    return true;
                }
            })
        );
    }

    getTimeSelectOption = (type, recordNum) => {
        recLst = this.state.recordLst;
        switch (type) {
            case HeaderStart:
                return {
                    defaultTime: this.state.StartTime,

                    type: 'hour',
                    onSureClickListener: time => {
                        this.setState({
                            StartTime: moment(time).format('YYYY-MM-DD HH:00')
                        });
                    }
                };
                break;
            case HeaderEnd:
                return {
                    defaultTime: this.state.EndTime,

                    type: 'hour',
                    onSureClickListener: time => {
                        if (moment(time).diff(moment(this.state.StartTime), 'hour') < 0) {
                            ShowToast('请选择开始时间之后的时间');
                            return;
                        }
                        this.setState({
                            EndTime: moment(time).format('YYYY-MM-DD HH:00')
                        });
                    }
                };
                break;
            case SelectItemStart:
                return {
                    defaultTime: recLst[recordNum].BeginTime,

                    type: 'hour',
                    onSureClickListener: time => {
                        if (moment(recLst[recordNum].EndTime).diff(moment(time), 'hour') < 0) {
                            ShowToast('请选择结束时间之前的时间');
                            return;
                        }
                        if (moment(time).isBetween(moment(this.state.StartTime), moment(this.state.EndTime), 'hour', '[]')) {
                            // recLst[recordNum] = {
                            //     FormMainID: this.state.FormMainID,
                            //     BeginTime: moment(time).format('YYYY-MM-DD HH:00:00'),
                            //     EndTime: recLst[recordNum].EndTime,
                            //     Hour: moment(recst[recordNum].EndTime).diff(moment(time), 'hour') + 1,
                            //     Remark: recLst[recordNum].Remark
                            // };
                            let newData = [].concat(recLst);
                            newData[recordNum].BeginTime = moment(time).format('YYYY-MM-DD HH:00:00')
                            newData[recordNum].Hour = moment(recLst[recordNum].EndTime).diff(moment(time), 'hour') + 1
                            this.setState({
                                // recordLst: recLst
                                recordLst: newData
                            });
                            this.forceUpdate();
                            return;
                        } else {
                            ShowToast('请选择统计开始结束时间段内的时间');
                            return;
                        }
                    }
                };
                break;
            case SelectItemEnd:
                return {
                    defaultTime: recLst[recordNum].EndTime,

                    type: 'hour',
                    onSureClickListener: time => {
                        if (moment(time).diff(moment(recLst[recordNum].BeginTime), 'hour') < 0) {
                            ShowToast('请选择开始时间之后的时间');
                            return;
                        }
                        if (moment(time).isBetween(moment(this.state.StartTime), moment(this.state.EndTime), 'hour', '[]')) {
                            // recLst[recordNum] = {
                            //     FormMainID: this.state.FormMainID,
                            //     BeginTime: recLst[recordNum].BeginTime,
                            //     EndTime: moment(time).format('YYYY-MM-DD HH:00:00'),
                            //     Hour: moment(time).diff(moment(recLst[recordNum].BeginTime), 'hour') + 1,
                            //     Remark: recLst[recordNum].Remark
                            // };
                            let newData = [].concat(recLst);
                            newData[recordNum].EndTime = moment(time).format('YYYY-MM-DD HH:00:00')
                            newData[recordNum].Hour = moment(time).diff(moment(recLst[recordNum].BeginTime), 'hour') + 1
                            this.setState({
                                // recordLst: recLst
                                recordLst: newData
                            });
                            this.forceUpdate();
                            return;
                        } else {
                            ShowToast('请选择统计开始结束时间段内的时间');
                            return;
                        }
                    }
                };
                break;
            default:
                return {
                    type: 'hour',
                    onSureClickListener: time => { }
                };
                break;
        }
    };
    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    creatHeader = () => {
        let index = '';
        if (this.state.Flag == '1') {
            index = '0';
        } else {
            index = '1';
        }
        return (
            <View style={{}}>
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>统计开始时间</SDLText>
                    <View option={this.getTimeSelectOption(HeaderStart)} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <SDLText style={{ color: '#666' }}>{this.state.StartTime != null ? moment(this.state.StartTime).format('YYYY-MM-DD HH:00') : moment().format('YYYY-MM-DD HH:00')}</SDLText>
                        <Image style={(styles.timeIcon, { tintColor: globalcolor.borderGreyColor, height: 16, width: 18, marginLeft: 16 })} resizeMode={'contain'} source={require('../../images/icon_select_date.png')} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>统计截止时间</SDLText>
                    <PickerSingleTimeTouchable option={this.getTimeSelectOption(HeaderEnd)} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <SDLText style={{ fontSize: 14, color: '#666' }}>{this.state.EndTime != null ? moment(this.state.EndTime).format('YYYY-MM-DD HH:00') : moment().format('YYYY-MM-DD HH:00')}</SDLText>
                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/icon_select_date.png')} />
                    </PickerSingleTimeTouchable>
                </View>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }}>
                    <SDLText style={{ marginLeft: 15 }}>有无异常</SDLText>
                    <SelectButton
                        style={{ flexDirection: 'row' }} //整个组件的样式----这样可以垂直和水平
                        conTainStyle={{ height: 44, width: 165 }} //图片和文字的容器样式
                        imageStyle={{ width: 18, height: 18 }} //图片样式
                        textStyle={{ color: '#666' }} //文字样式
                        selectIndex={index} //空字符串,表示不选中,数组索引表示默认选中
                        data={this.state.dataArray} //数据源
                        onPress={(index, item) => {
                            this.setState({
                                Flag: `${item.id}`,
                                recordLst: []
                            });
                        }}
                    />
                </View>
            </View>
        );
    };
    addRecord = (recordNum, item) => {
        recLst = this.state.recordLst;
        let mSelect = [];
        if (SentencedToEmpty(item, ['PollutantCode'], '') != '') {
            mSelect = item.PollutantCode.split(',');
        }
        const mPollutantOption = {
            codeKey: 'ID',
            nameKey: 'Name',
            maxNum: 999,
            selectCode: mSelect,
            dataArr: SentencedToEmpty(
                this.props.faultRecordParamesResult
                , ['data', 'Datas', 'PollutantList'], []),
            callback: ({ selectCode, selectNameStr, selectCodeStr, selectData }) => {
                let recordNumInner = recordNum;
                let array = [].concat(this.state.recordLst)
                array[recordNumInner]['PollutantCode'] = selectCodeStr;//设备参数类别编号
                array[recordNumInner]['PollutantName'] = selectNameStr;//设备参数类别名称
                this.setState({
                    recordLst: array
                });
            }
        }
        // const pollutantOption = {
        //     codeKey: 'ID',
        //     nameKey: 'Name',
        //     defaultCode: '',
        //     dataArr:SentencedToEmpty(
        //         this.props.faultRecordParamesResult
        //         ,['data','Datas','PollutantList'],[]),
        //     onSelectListener: item => {
        //         let recordNumInner = recordNum;
        //         console.log(item);
        //         console.log('recordNumInner = ' ,recordNumInner);
        //         let array = [].concat(this.state.recordLst)
        //         array[recordNumInner]['PollutantCode'] = item.ID;//设备参数类别编号
        //         array[recordNumInner]['PollutantName'] = item.Name;//设备参数类别名称
        //         this.setState({
        //             recordLst:array
        //         });
        //     }
        // }
        const exceptionTypeOption = {
            codeKey: 'ChildID',
            nameKey: 'Name',
            defaultCode: SentencedToEmpty(item, ['ExceptionTypeId'], ''),
            dataArr: SentencedToEmpty(
                this.props.faultRecordParamesResult
                , ['data', 'Datas', 'ExceptionTypeList'], []),
            onSelectListener: item => {
                let recordNumInner = recordNum;
                let array = [].concat(this.state.recordLst)
                array[recordNumInner]['ExceptionTypeId'] = item.ChildID;//异常类别编码
                array[recordNumInner]['ExceptionTypeName'] = item.Name;//异常类别名称
                this.setState({
                    recordLst: array
                });
            }
        }
        return (
            <View>
                <View style={{ flexDirection: 'row', height: 44, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SDLText style={{ color: '#666', padding: 13 }}>{`异常小时记录${recordNum + 1}`}</SDLText>
                    <Touchable
                        onPress={() => {
                            recLst.splice(recordNum, 1);
                            this.setState({
                                recordLst: recLst
                            });
                            this.forceUpdate();
                        }}
                        style={{ flexDirection: 'row', flex: 1, marginTop: 1, justifyContent: 'flex-end', marginRight: 15 }}
                    >
                        <SDLText style={{ color: '#4aa0ff' }}>删除</SDLText>
                    </Touchable>
                </View>
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>设备参数类别</SDLText>
                    {
                        SentencedToEmpty(
                            this.props.faultRecordParamesResult
                            , ['data', 'Datas', 'ExceptionTypeList'], []).length == 0 ?
                            <MoreSelectTouchable
                                count={2}
                                ref={ref => (this._picker = ref)}
                                option={mPollutantOption}
                                style={[{ flexDirection: 'row', width: 100, justifyContent: 'flex-end', height: 45, alignItems: 'center', paddingLeft: 12, paddingRight: 12, flex: 1 }]}
                            >
                                <SDLText style={{ color: '#666' }}>{item.PollutantName && item.PollutantName != '' ? item.PollutantName : '请选择'}</SDLText>
                                <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/ic_arrows_right.png')} />
                            </MoreSelectTouchable>
                            : <MoreSelectTouchable
                                count={2}
                                ref={ref => (this._picker = ref)}
                                option={{
                                    codeKey: 'ID',
                                    nameKey: 'Name',
                                    maxNum: 999,
                                    selectCode: mSelect,
                                    dataArr: SentencedToEmpty(
                                        this.props.faultRecordParamesResult
                                        , ['data', 'Datas', 'PollutantList'], []),
                                    callback: ({ selectCode, selectNameStr, selectCodeStr, selectData }) => {
                                        let recordNumInner = recordNum;
                                        let array = [].concat(this.state.recordLst)
                                        array[recordNumInner]['PollutantCode'] = selectCodeStr;//设备参数类别编号
                                        array[recordNumInner]['PollutantName'] = selectNameStr;//设备参数类别名称
                                        this.setState({
                                            recordLst: array
                                        });
                                    }
                                }}
                                style={[{ flexDirection: 'row', width: 100, justifyContent: 'flex-end', height: 45, alignItems: 'center', paddingLeft: 12, paddingRight: 12, flex: 1 }]}
                            >
                                <SDLText style={{ color: '#666' }}>{item.PollutantName && item.PollutantName != '' ? item.PollutantName : '请选择'}</SDLText>
                                <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/ic_arrows_right.png')} />
                            </MoreSelectTouchable>
                    }
                </View>
                {/* <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>设备参数类别</SDLText>
                    <PickerTouchable option={pollutantOption} style={{flexDirection:'row',height:44,alignItems:'center', flex:1, justifyContent:'flex-end', marginRight: 15}}>
                        <SDLText style={{ color: '#666' }}>{item.PollutantName != ''?item.PollutantName:'请选择'}</SDLText>
                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/ic_arrows_right.png')} />
                    </PickerTouchable>
                </View> */}
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>异常类别</SDLText>
                    {
                        SentencedToEmpty(
                            this.props.faultRecordParamesResult
                            , ['data', 'Datas', 'ExceptionTypeList'], []).length == 0 ?
                            <PickerTouchable option={exceptionTypeOption} style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginRight: 15 }}>
                                <SDLText style={{ color: '#666' }}>{item.ExceptionTypeName != '' ? item.ExceptionTypeName : '请选择'}</SDLText>
                                <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/ic_arrows_right.png')} />
                            </PickerTouchable>
                            : <PickerTouchable option={{
                                codeKey: 'ChildID',
                                nameKey: 'Name',
                                defaultCode: SentencedToEmpty(item, ['ExceptionTypeId'], ''),
                                dataArr: SentencedToEmpty(
                                    this.props.faultRecordParamesResult
                                    , ['data', 'Datas', 'ExceptionTypeList'], []),
                                onSelectListener: item => {
                                    let recordNumInner = recordNum;
                                    let array = [].concat(this.state.recordLst)
                                    array[recordNumInner]['ExceptionTypeId'] = item.ChildID;//异常类别编码
                                    array[recordNumInner]['ExceptionTypeName'] = item.Name;//异常类别名称
                                    this.setState({
                                        recordLst: array
                                    });
                                }
                            }} style={{ flexDirection: 'row', height: 44, alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginRight: 15 }}>
                                <SDLText style={{ color: '#666' }}>{item.ExceptionTypeName != '' ? item.ExceptionTypeName : '请选择'}</SDLText>
                                <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/ic_arrows_right.png')} />
                            </PickerTouchable>
                    }

                </View>
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>开始时间</SDLText>
                    <PickerSingleTimeTouchable option={this.getTimeSelectOption(SelectItemStart, recordNum)} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <SDLText style={{ color: '#666' }}>{moment(item.BeginTime).format('YYYY-MM-DD HH:00')}</SDLText>
                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/icon_select_date.png')} />
                    </PickerSingleTimeTouchable>
                </View>
                <View style={{ flexDirection: 'row', height: 44, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', marginTop: 1 }}>
                    <SDLText style={{ color: '#333', marginLeft: 15 }}>截止时间</SDLText>
                    <PickerSingleTimeTouchable option={this.getTimeSelectOption(SelectItemEnd, recordNum)} style={{ flexDirection: 'row', backgroundColor: '#', justifyContent: 'flex-end', alignItems: 'center', flex: 1, marginRight: 15 }}>
                        <SDLText style={{ fontSize: 14, color: '#666' }}>{moment(item.EndTime).format('YYYY-MM-DD HH:00')}</SDLText>
                        <Image style={styles.timeIcon} resizeMode={'contain'} source={require('../../images/icon_select_date.png')} />
                    </PickerSingleTimeTouchable>
                </View>
                <View style={{ flexDirection: 'row', width: SCREEN_WIDTH, height: 50, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: 1 }}>
                    <SDLText style={{ marginLeft: 15 }}>异常小时数</SDLText>
                    <SDLText style={{ marginRight: 15 }}>{item.Hour}</SDLText>
                </View>
                <View style={{ flexDirection: 'column', width: SCREEN_WIDTH, backgroundColor: 'white', marginTop: 1 }}>
                    <SDLText style={{ marginLeft: 15, marginTop: 13 }}>异常原因</SDLText>
                    <TextInput
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        onChangeText={text => {
                            //动态更新组件内state 记录输入内容
                            // (recLst = this.state.recordLst),
                            //     (recLst[recordNum] = {
                            //         FormMainID: this.state.FormMainID,
                            //         BeginTime: recLst[recordNum].BeginTime,
                            //         EndTime: recLst[recordNum].EndTime,
                            //         Hour: moment(recLst[recordNum].EndTime).diff(recLst[recordNum].BeginTime, 'hour') + 1,
                            //         Remark: text
                            //     });
                            let recordNumInner = recordNum;
                            let array = [].concat(this.state.recordLst)
                            array[recordNumInner]['Remark'] = text;//设备参数类别编号
                            this.setState({ recordLst: array });
                        }}
                        placeholder={'请输入故障原因描述'}
                        multiline={true}
                        style={{ color: '#333333', width: SCREEN_WIDTH - 28, height: 80, padding: 15, textAlignVertical: 'top' }}
                    >
                        {item.Remark}
                    </TextInput>
                </View>
            </View>
        );
    };
    deleteALL = () => {
        // this._modalParent.showModal();
        this.refs.doAlert.show();
    };
    cancelButton = () => { };
    confirm = () => {
        this.props.dispatch(
            createAction('equipmentFautModel/delForm')({
                params: {},
                callback: item => {
                    this.props.dispatch(createAction('taskDetailModel/updateFormStatus')({ cID: this.props.route.params.params.ID, isAdd: false }))
                    // 提交时没有返回信息无法进行更新所以去掉此段代码
                    // this.setState({
                    //     StartTime: item.Content.StartTime,
                    //     EndTime: item.Content.EndTime == null ? moment().format('YYYY-MM-DD HH:00:00') : item.Content.EndTime,
                    //     recordLst: item.RecordList || []
                    // });
                }
            })
        );
    };

    getInitStatus = () => {
        /**
         * faultRecordParamesResult
         * liststatus
         */
        let faultRecordParamesResult = this.props.faultRecordParamesResult;
        let liststatus = this.props.liststatus;
        if (faultRecordParamesResult.status == -1
            || liststatus.status == -1) {
            return -1;
        }
        if (faultRecordParamesResult.status != 200) {
            return faultRecordParamesResult.status;
        }
        if (liststatus.status != 200) {
            return liststatus.status;
        }
        if (faultRecordParamesResult.status == 200
            || liststatus.status == 200) {
            return 200;
        }
    }

    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除此表单',
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
        return (
            <StatusPage
                style={{ flex: 1 }}
                status={this.getInitStatus()}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.refreshData();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.refreshData();
                }}
            >
                {/* <KeyboardAwareScrollView> */}
                <ScrollView>
                    {this.creatHeader()}

                    {this.state.recordLst.map((item, key) => {
                        return this.addRecord(key, item);
                    })}
                    {this.state.Flag == '1' ? (
                        <Touchable
                            onPress={() => {
                                let recordLst = this.state.recordLst;
                                let beginStr = moment(this.state.StartTime).format('YYYY-MM-DD HH:00:00')
                                let endStr = moment(this.state.EndTime).format('YYYY-MM-DD HH:00:00')
                                recordLst = [
                                    ...recordLst,
                                    {
                                        // ID: 'd9d4c956-90a6-4253-a7e8-c8993a4a3a4j',
                                        FormMainID: this.state.FormMainID,
                                        BeginTime: beginStr,
                                        EndTime: endStr,
                                        Hour: moment(endStr).diff(moment(beginStr), 'hours') + 1,
                                        Remark: '',
                                        PollutantCode: '',//设备参数类别编号
                                        PollutantName: '',//设备参数类别名称                                
                                        ExceptionTypeId: '', //异常类别编码
                                        ExceptionTypeName: '', //异常类别名称
                                    }
                                ];
                                this.setState({
                                    recordLst: recordLst
                                });
                            }}
                            style={{ backgroundColor: 'white', height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}
                        >
                            <SDLText aa={this.state.aa} fontType="large" style={{ color: '#4aa0ff' }}>
                                {`添加异常信息`}
                            </SDLText>
                        </Touchable>
                    ) : null}
                </ScrollView>
                {/* </KeyboardAwareScrollView> */}

                <Button
                    text={'保存'}
                    style={{
                        width: SCREEN_WIDTH,
                        backgroundColor: '#4ca9ff',
                        height: 45,
                        borderRadius: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    textStyle={{ color: '#fff', fontSize: 15 }}
                    onPress={() => {
                        this.commit();
                    }}
                />
                <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        this.deleteALL();
                    }}
                >
                    {SentencedToEmpty(this.props, ['route', 'params', 'params', 'isEdit'], 'edit') == 'edit' ? (
                        <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'删除'}</SDLText>
                            <SDLText style={[{ color: globalcolor.whiteFont }]}>{'表单'}</SDLText>
                        </View>
                    ) : null}
                </TouchableOpacity>
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -2 ? <SimpleLoadingComponent message={'提交中'} /> : null}
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        );
    }
    commit = () => {
        let canBeSubmitted = true;
        if (this.state.Flag == '1' && this.state.recordLst.length == 0) {
            ShowToast('请添加故障记录或选择无故障');
            return;
        }
        if (this.state.Flag == '1' && this.state.recordLst.length > 0) {
            /**
             *  PollutantCode: '',//设备参数类别编号
                PollutantName: '',//设备参数类别名称                                
                ExceptionTypeId: '', //异常类别编码
                ExceptionTypeName: '', //异常类别名称
             */
            this.state.recordLst.map((item, index) => {
                if (canBeSubmitted) {
                    if (item.PollutantCode == '' || item.PollutantName == '') {
                        ShowToast(`请在第${index + 1}条添加设备参数类别`);
                        canBeSubmitted = false;
                        return;
                    }

                    if (item.ExceptionTypeId == '' || item.ExceptionTypeName == '') {
                        ShowToast(`请在第${index + 1}条添加异常类别`);
                        canBeSubmitted = false;
                        return;
                    }
                }
            })
        }
        if (canBeSubmitted) {
            let commitInfo = this.props.BaseInfo;
            const user = getToken();
            this.props.dispatch(
                createAction('equipmentFautModel/saveForm')({
                    params: {
                        ...commitInfo,
                        Content: {
                            BeginTime: moment(this.state.StartTime).format('YYYY-MM-DD HH:00:00'),
                            EndTime: this.state.EndTime != null ? moment(this.state.EndTime).format('YYYY-MM-DD HH:00:00') : moment().format('YYYY-MM-DD HH:00:00'),
                            Flag: this.state.Flag || '0',
                            MaintenanceManagementUnit: this.state.MaintenanceManagementUnit,
                            PointPosition: this.state.PointPosition,
                        },
                        CreateUserID: user.UserId,
                        RecordList: this.state.Flag == '0' ? [] : this.state.recordLst,
                        TypeID: this.props.route.params.params.ID
                    },
                    callback: item => {
                        this.props.dispatch(createAction('taskDetailModel/updateFormStatus')({ cID: this.props.route.params.params.ID }))
                        // 提交时没有返回信息无法进行更新所以去掉此段代码
                        // this.setState({
                        //     StartTime: item.Content.BeginTime,
                        //     EndTime: item.Content.EndTime == null ? moment().format('YYYY-MM-DD HH:00:00') : item.Content.EndTime,
                        //     recordLst: item.RecordList || [],
                        //     Flag: item.Content.Flag
                        // });
                    }
                })
            );
        }
    };
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efeeee',
        flexDirection: 'column'
    },
    timeIcon: {
        tintColor: globalcolor.blue,
        height: 16,
        width: 18,
        marginLeft: 16
    },

    button: {
        flexDirection: 'row',
        height: 46,
        width: SCREEN_WIDTH - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        marginLeft: 50
    }
});
