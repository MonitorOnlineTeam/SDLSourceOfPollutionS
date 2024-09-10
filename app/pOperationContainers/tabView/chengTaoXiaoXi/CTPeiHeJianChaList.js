import React, { Component } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { AlertDialog, PickerTouchable } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
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
export default class CTPeiHeJianChaList extends Component {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '第三方检查汇报',// 配合检查记录
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
            createAction('CTPeiHeJianCha/GetCooperateRecord')({
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
            createAction('CTPeiHeJianCha/DeleteCooperateRecord')({
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
            messText: '确认删除该第三方检查汇报吗？',
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
                                    item.index = index;
                                    this.props.navigation.navigate('CTPeiHeJianChaSubmitForm', {
                                        currentItem: item,
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
                                        <Text>{item.PointName}</Text>
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
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`核查日期:`}</Text>
                                        <Text>{moment(item.CooperationDate).format('YYYY-MM-DD')}</Text>
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
                                        <Text style={[{ fontSize: 14, color: '#333333' }]}>{`核查主题:`}</Text>
                                        <Text numberOfLines={1}>{item.CooperationTheme}</Text>
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
                                this.props.navigation.navigate('CTPeiHeJianChaSubmitForm', {
                                    currentItem: { index: SentencedToEmpty(this.state, ['stateDatas'], []).length },
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
                                const recordId = SentencedToEmpty(this.props, ['secondItem', 'RecordId'], '');
                                const serviceId = SentencedToEmpty(this.props, ['firstItem', 'ItemId'], '');
                                let commitData = {
                                    mainId: this.props.dispatchId,
                                    serviceId: serviceId,
                                    recordId: recordId
                                };
                                commitData.cList = SentencedToEmpty(this.state, ['stateDatas'], []);
                                this.props.dispatch(createAction('CTPeiHeJianCha/addCooperationInspectionRecord')(commitData));
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
                            this.props.dispatch(createAction('CTPeiHeJianCha/addCooperationInspectionRecord')(commitData));
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
