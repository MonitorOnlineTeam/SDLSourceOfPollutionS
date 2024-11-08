import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, PickerTouchable } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import ImageGrid from '../../../components/form/images/ImageGrid';
import { createAction, createNavigationOptions, SentencedToEmpty } from '../../../utils';
import moment from 'moment';
import globalcolor from '../../../config/globalcolor';

@connect(({ CTModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    dispatchId: CTModel.dispatchId,
    ProjectID: CTModel.ProjectID,
    secondItem: CTModel.secondItem,
    firstItem: CTModel.firstItem,
    acceptanceServiceRecordResult: CTModel.acceptanceServiceRecordResult,
    addAcceptanceServiceRecordResult: CTModel.addAcceptanceServiceRecordResult,
    deleteAcceptanceServiceRecordResult: CTModel.deleteAcceptanceServiceRecordResult
}))
export default class RepairRecords extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '维修记录',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            stateDatas: []
        };
    }

    componentDidMount() {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTRepair/GetRepairRecord')({
                mainId: this.props.dispatchId,
                serviceId: serviceId,
                recordId: recordId,
                callback: data => {
                    this.setState({
                        stateDatas: data
                    });
                }
            })
        );
    }

    getEnterpriseSelect = index => {
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            dataArr: [],
            onSelectListener: item => { }
        };
    };

    getPointSelect = index => {
        return {
            codeKey: 'DGIMN',
            nameKey: 'PointName',
            dataArr: [],
            onSelectListener: item => {
                if (item && typeof item != 'undefined') {
                }
            }
        };
    };
    delConfirm = () => {
        const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
        const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
        this.props.dispatch(
            createAction('CTRepair/repairRecordDel')({
                mainId: this.props.dispatchId,
                serviceId: serviceId,
                recordId: recordId
            })
        );
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
        let delFormOptions = {
            headTitle: '提示',
            messText: '确认删除该设备维修记录表吗？',
            headStyle: { backgroundColor: globalcolor.headerBackgroundColor, color: '#ffffff', fontSize: 18 },
            buttons: [
                {
                    txt: '取消',
                    btnStyle: { backgroundColor: 'transparent' },
                    txtStyle: { color: globalcolor.headerBackgroundColor },
                    onpress: () => { }
                },
                {
                    txt: '确定',
                    btnStyle: { backgroundColor: globalcolor.headerBackgroundColor },
                    txtStyle: { color: '#ffffff' },
                    onpress: this.delConfirm
                }
            ]
        };
        return (
            <View style={[{ width: SCREEN_WIDTH, flex: 1 }]}>
                <ScrollView style={[{ width: SCREEN_WIDTH }]}>
                    {/* {[0,1,2].map((item,index)=>{ */}
                    {SentencedToEmpty(this.state, ['stateDatas'], []).map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={[{ width: SCREEN_WIDTH, backgroundColor: 'white', marginTop: index == 0 ? 0 : 4 }]}
                                onPress={() => {
                                    // 跳转详情  修改
                                    item.index = index;
                                    item.EquipmentName = item.EquipmentNameModel;

                                    if (SentencedToEmpty(item, ['FaultUnitID'], '') == "bfc92f7a-c0b2-44df-a644-ea83fa21aa6b") {
                                        item.IsMaster = 1;
                                    }
                                    this.props.dispatch(
                                        createAction('CTRepair/updateState')({
                                            dataArray: [item],
                                            RepairDate: item.RepairDate,
                                            DepartureTime: item.DepartureTime,
                                        })
                                    );
                                    this.props.navigation.navigate('RepairSubmitForm', {
                                        callback: item => {
                                            if (item.PointId) {
                                                let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                                datas.splice(item.index, 1, item);
                                                this.setState({
                                                    stateDatas: datas
                                                });
                                            } else {
                                                let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                                datas.splice(item.index, 1);
                                                this.setState({
                                                    stateDatas: datas
                                                });
                                            }
                                        }
                                    });
                                }}
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
                                    <View
                                        style={[
                                            {
                                                width: SCREEN_WIDTH - 38,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }
                                        ]}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <View
                                                style={[
                                                    {
                                                        width: 2,
                                                        height: 15,
                                                        backgroundColor: '#4DA9FF',
                                                        marginRight: 9
                                                    }
                                                ]}
                                            />
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: 15,
                                                        color: '#333333',
                                                        fontWeight: '700'
                                                    }
                                                ]}
                                            >{`条目${index + 1}`}</Text>
                                        </View>
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 14,
                                                    color: '#4aa0ff'
                                                }
                                            ]}
                                        >{`${this.isEdit() ? '点击条目查看或修改具体信息' : '点击条目查看具体信息'}`}</Text>
                                    </View>
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
                                            height: 38,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
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
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`企业名称:`}</Text>
                                        <Text
                                            numberOfLines={1}
                                            style={[{
                                                color: '#333333',
                                                width: SCREEN_WIDTH - 140
                                            }]}
                                        >{item.EntName}</Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        {
                                            height: 38,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
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
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`监测点名称:`}</Text>
                                        <Text style={[{ color: '#333333' }]}>{item.PointName}</Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        {
                                            height: 38,
                                            width: SCREEN_WIDTH,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
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
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`维修日期:`}</Text>
                                        <Text style={[{ color: '#333333' }]}>{moment(item.RepairDate).format('YYYY-MM-DD')}</Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        {
                                            height: 38,
                                            width: SCREEN_WIDTH - 38,
                                            paddingHorizontal: 19,
                                            justifyContent: 'center'
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            {
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`故障单元:`}</Text>
                                        <Text style={[{ color: '#333333' }]} numberOfLines={1}>{item.FaultUnitName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    {this.isEdit() ? <View style={[{ backgroundColor: 'white' }]}>
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
                        <TouchableOpacity
                            onPress={() => {
                                // 跳转详情  新建
                                this.props.dispatch(
                                    createAction('CTRepair/updateState')({
                                        dataArray: [
                                            {
                                                index: SentencedToEmpty(this.state, ['stateDatas'], []).length,
                                                faultTime: moment()
                                                    .minute(0)
                                                    .second(0)
                                                    .format('YYYY-MM-DD HH:mm:ss')
                                            }
                                        ],
                                        RepairDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        DepartureTime: moment().format('YYYY-MM-DD HH:00:00'),
                                    })
                                );
                                this.props.navigation.navigate('RepairSubmitForm', {
                                    callback: item => {
                                        if (item.PointId) {
                                            let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                            datas.splice(item.index, 1, item);
                                            this.setState({
                                                stateDatas: datas
                                            });
                                        } else {
                                            let datas = [].concat(SentencedToEmpty(this.state, ['stateDatas'], []));
                                            datas.splice(item.index, 1);
                                            this.setState({
                                                stateDatas: datas
                                            });
                                        }
                                    }
                                });
                            }}
                        >
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH,
                                        height: 43,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: 'white'
                                    }
                                ]}
                            >
                                <Image
                                    style={[
                                        {
                                            height: 12,
                                            width: 12,
                                            tintColor: '#4DA9FF',
                                            marginRight: 2
                                        }
                                    ]}
                                    source={require('../../../images/jiarecord.png')}
                                />
                                <Text
                                    style={[
                                        {
                                            color: '#4DA9FF',
                                            fontSize: 15
                                        }
                                    ]}
                                >
                                    {'添加条目'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View> : null}
                </ScrollView>
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
                                this.refs.delFormAlert.show();
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
                                // 提交
                                const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                                const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                                let commitData = {
                                    mainId: this.props.dispatchId,
                                    serviceId: serviceId,
                                    recordId: recordId
                                };
                                commitData.cList = SentencedToEmpty(this.state, ['stateDatas'], []);
                                this.props.dispatch(createAction('CTRepair/saveRepairRecordOpr')(commitData));
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
                            const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                            const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                            let commitData = {
                                mainId: this.props.dispatchId,
                                serviceId: serviceId,
                                recordId: recordId
                            };
                            commitData.cList = SentencedToEmpty(this.state, ['stateDatas'], []);
                            this.props.dispatch(createAction('CTRepair/saveRepairRecordOpr')(commitData));
                        }}
                        style={[
                            {
                                marginHorizontal: 10,
                                marginBottom: 20,
                                marginTop: 10
                            }
                        ]}
                    >
                        <View
                            style={[
                                {
                                    width: SCREEN_WIDTH - 20,
                                    height: 44,
                                    borderRadius: 2,
                                    backgroundColor: '#4DA9FF',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                        >
                            <Text style={[{ fontSize: 17, color: '#FEFEFE' }]}>{'提交'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <AlertDialog options={delFormOptions} ref="delFormAlert" />
            </View>
        );
    }
}
