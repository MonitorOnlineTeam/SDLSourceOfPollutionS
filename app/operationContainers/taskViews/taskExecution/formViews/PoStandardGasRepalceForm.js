//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { NavigationActions, createAction, StackActions, SentencedToEmpty, createNavigationOptions } from '../../../../utils';
import { getToken } from '../../../../dvapack/storage';
import { AlertDialog, SimpleLoadingComponent, StatusPage } from '../../../../components';

/**
 * 标准气体更换记录表
 */
@connect(({ taskModel }) => ({
    editstatus:taskModel.editstatus,
    gasRecordList: taskModel.gasRecordList,
    gasRecordListStatus: taskModel.gasRecordListStatus
}))
class PoStandardGasRepalceForm extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '标准物质更换记录表',
            headerRight:
                navigation.state.params.TypeName == 'StandardGasRepalceHistoryList' ? (
                    <TouchableOpacity
                        style={{ width: 44, height: 40, justifyContent: 'center', alignItems: 'flex-end' }}
                        onPress={() => {
                            _me._addForm();
                        }}
                    >
                        <Image source={require('../../../../images/jiarecord.png')} style={{ marginRight: 16, height: 24, width: 24 }} />
                    </TouchableOpacity>
                ) : (
                    <View />
                )
        });

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    a: '2018-12-17 14:00',
                    b: '2018-12-17 15:00',
                    c: 1,
                    id: 1,
                    data: '停机维护,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度,测试文字长度'
                }
            ],
            gasReplacementList: [
                {
                    a: '2018-12-17 14:00',
                    b: '二氧化硫标准气体',
                    g: '70mg/m³',
                    c: 'ml',
                    d: '100',
                    e: '雪迪龙',
                    f: '2019-12-17 14:00'
                }
            ]
        };
        _me = this;
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    _deleteForm = () => {
        this.refs.doAlert.show();
    };

    _addForm = () => {
        if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
            this.props.dispatch(NavigationActions.navigate({ routeName: 'PoStandardGasReplacementRecord', params: { index: -1 } }));
        }
    };

    _keyExtractor = (item, index) => {
        return index + '';
    };

    _renderItem = ({ item, index }) => {
        if (this.props.navigation.state.params.TypeName == 'StandardGasRepalceHistoryList') {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PoStandardGasReplacementRecord', params: { index } }));
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH, alignItems: 'center', marginTop: index != 0 ? 8 : 0 }]}>
                        <View
                            style={[
                                {
                                    borderColor: globalcolor.borderLightGreyColor,
                                    backgroundColor: globalcolor.white,
                                    paddingHorizontal: 13
                                }
                            ]}
                        >
                            <View style={[{ flexDirection: 'row', height: 32, alignItems: 'center', marginTop: 8 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>生产商：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.Supplier}</Text>
                            </View>
                            {
                                SentencedToEmpty(item,['PartType'],1) == 1?<View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 24, height: 28, alignItems: 'center' }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>存货编码：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.StandardGasBottleCode}</Text>
                                </View>
                                :null
                            }
                            <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 24, height: 28, alignItems: 'center' }]}>
                                <View style={[{ flexDirection: 'row', width: (SCREEN_WIDTH - 24)/2, }]}>
                                    <Text numberOfLines={1} style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>标准物质名称：</Text>
                                    <Text numberOfLines={1} style={[{ fontSize: 14, color: globalcolor.taskFormLabel, flex:1  }]}>{item.StandardGasName}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', width: (SCREEN_WIDTH - 24)/2}]}>
                                    <Text numberOfLines={1} style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>单位：</Text>
                                    <Text numberOfLines={1} style={[{ fontSize: 14, color: globalcolor.taskFormLabel, flex:1 }]}>{item.Unit}</Text>
                                </View>
                            </View>
                            <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 24, height: 28, alignItems: 'center' }]}>
                                <View style={[{ flexDirection: 'row', flex: 1 }]}>
                                    {/* <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>气体浓度：</Text>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{ fontSize: 14, color: globalcolor.taskFormLabel, flex: 1 }]}>
                                        {item.GasStrength}
                                    </Text> */}
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>规格型号：</Text>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[{ fontSize: 14, color: globalcolor.taskFormLabel, flex: 1 }]}>
                                        {item.GasStrength}
                                    </Text>
                                </View>
                                <View style={[{ flexDirection: 'row', flex: 1 }]}>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>数量：</Text>
                                    <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.Num}</Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    {
                                        width: SCREEN_WIDTH - 24,
                                        borderBottomColor: globalcolor.borderBottomColor,
                                        borderBottomWidth: 1
                                    }
                                ]}
                            />
                            <View style={[{ flexDirection: 'row', marginTop: 16 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>更换日期：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>{item.ReplaceDate && typeof item.ReplaceDate != 'undefined' && item.ReplaceDate != '' ? item.ReplaceDate.split(' ')[0] : '------'}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', height: 28, alignItems: 'center', marginBottom: 8 }]}>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskImfoLabel }]}>有效日期：</Text>
                                <Text style={[{ fontSize: 14, color: globalcolor.taskFormLabel }]}>
                                    {item.AnotherTimeOfChange && typeof item.AnotherTimeOfChange != 'undefined' && item.AnotherTimeOfChange != '' ? item.AnotherTimeOfChange.split(' ')[0] : '------'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };
    cancelButton = () => {};
    confirm = () => {
        this.props.dispatch(
            createAction('taskModel/delFormGas')({
                callback: ID => {
                    
                    //返回任务执行，刷新数据
                    this.props.dispatch(createAction('taskModel/getTaskDetailWithoutTaskDescription')({}));
                    this.props.dispatch(NavigationActions.back());
                }
            })
        );
    };
    onRefresh = () => {
        this.props.dispatch(createAction('taskModel/getInfoGas')({}));
    };

    render() {
        var options = {
            headTitle: '提示',
            messText: '确认要删除标气更换记录表吗？',
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
                status={this.props.gasRecordListStatus.status}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.onRefresh();
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.onRefresh();
                }}
            >
                <FlatList
                    // data={SentencedToEmpty(this.props.gasRecordList, ['data', 'data', 'Record', 'RecordList'], [])}
                    data={this.props.gasRecordList}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                <TouchableOpacity
                    style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                    onPress={() => {
                        this._deleteForm();
                    }}
                >
                    <View
                        style={[
                            {
                                height: 60,
                                width: 60,
                                borderRadius: 30,
                                backgroundColor: 'red',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                        <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                    </View>
                </TouchableOpacity>
                {this.props.editstatus.status == -1?<SimpleLoadingComponent message={'删除中'} />:null}
                <AlertDialog options={options} ref="doAlert" />
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
        backgroundColor: globalcolor.backgroundGrey
    }
});

//make this component available to the app
export default PoStandardGasRepalceForm;