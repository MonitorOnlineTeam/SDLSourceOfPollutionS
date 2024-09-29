//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { NavigationActions, createAction, createNavigationOptions, SentencedToEmpty } from '../../../../utils';
import { StatusPage, Touchable, PickerTouchable, AlertDialog, SimpleLoadingComponent } from '../../../../components';
import moment from 'moment';
// create a component
@connect(({ taskModel }) => ({
    consumablesReplace: taskModel.consumablesReplace,
    currentTask: taskModel.currentTask,
    consumableRecord: taskModel.consumableRecord,
    editstatus: taskModel.editstatus
}))
class PoConsumablesReplaceRecord extends Component {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '易耗品更换记录',
            headerRight: (
                <TouchableOpacity
                    onPress={() => {
                        const formItem = SentencedToEmpty(navigation, ['state', 'params', 'item'], {});
                        _me.props.dispatch(NavigationActions.navigate({ routeName: 'PoConsumablesReplaceForm', params: { formItem } }));
                    }}
                >
                    <Image source={require('../../../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                </TouchableOpacity>
            )
        });

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modaConVisible: false
        };

        _me = this;
        this.props.navigation.setOptions({
            headerRight: () => <TouchableOpacity
                onPress={() => {
                    const formItem = SentencedToEmpty(this.props.route, ['params', 'params', 'item'], {});
                    _me.props.dispatch(NavigationActions.navigate({ routeName: 'PoConsumablesReplaceForm', params: { formItem } }));
                }}
            >
                <Image source={require('../../../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
            </TouchableOpacity>
        });
    }

    componentDidMount() {
        this.onRefresh();
    }
    componentWillUnmount() {
        DeviceEventEmitter.emit('refreshTask', {
            newMessage: '刷新'
        });
    }
    onRefresh() {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(
            createAction('taskModel/getConsumablesReplace')({
                params: {
                    TaskID: this.props.currentTask.TaskID,
                    TypeID: ID,
                }
            })
        );
    }
    _keyExtractor = (item, index) => {
        return index + '';
    };
    deleteALL = () => {
        // this._modalParent.showModal();
        this.refs.doAlert.show();
    };
    hideModal = () => {
        this.setState({ modaConVisible: false });
    };
    _renderItem = ({ item, index }) => {
        const contentWidth = SCREEN_WIDTH - 30;
        return (
            <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                <TouchableOpacity
                    onPress={() => {
                        const formItem = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'PoConsumablesReplaceForm',
                                params: {
                                    item: item,
                                    key: index,
                                    formItem
                                }
                            })
                        );
                    }}
                    style={[
                        {
                            width: SCREEN_WIDTH,
                            borderRadius: 0,
                            marginVertical: 8,
                            borderColor: globalcolor.borderLightGreyColor,
                            backgroundColor: globalcolor.white,
                            paddingHorizontal: 15
                        }
                    ]}
                >
                    <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: contentWidth }]}>
                        <View style={[{ flexDirection: 'row', width: contentWidth }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>易耗品名称：</Text>
                            <Text numberOfLines={1} style={[{ fontSize: 15, color: globalcolor.recordde, flex: 1 }]}>{item.ConsumablesName}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: contentWidth }]}>
                        <View style={[{ flexDirection: 'row', flex: 1, width: SCREEN_WIDTH / 2 - 15 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>数量：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.Num}</Text>
                        </View>
                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH / 2 - 15 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>单位：</Text>
                            <Text numberOfLines={1} style={[{ fontSize: 15, color: globalcolor.recordde, flex: 1 }]}>{item.Unit}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', marginTop: 6, alignItems: 'center', width: contentWidth }]}>
                        <View style={[{ flexDirection: 'row', width: contentWidth }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>规格型号：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde, flex: 1 }]}>{item.Model}</Text>
                        </View>
                    </View>
                    {
                        SentencedToEmpty(item, ['PartType'], 1) == 1 ? <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: contentWidth }]}>
                            <View style={[{ flexDirection: 'row', minWidth: contentWidth }]}>
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>存货编码：</Text>
                                <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.PartCode}</Text>
                            </View>
                        </View>
                            : null
                    }
                    {
                        SentencedToEmpty(item, ['PartType'], 1) == 1 ? <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center', width: contentWidth }]}>
                            <View style={[{ flexDirection: 'row', minWidth: contentWidth }]}>
                                <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>仓库名称：</Text>
                                <Text style={[{ fontSize: 15, color: globalcolor.recordde, flex: 1 }]}>{item.StorehouseName}</Text>
                            </View>
                        </View>
                            : null
                    }

                    <View style={[{ flexDirection: 'row', marginTop: 10 }]}>
                        <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>更换时间：</Text>
                        <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{moment(item.ReplaceDate).format('YYYY-MM-DD')}</Text>
                    </View>
                    <View style={{ width: contentWidth, height: 1, backgroundColor: '#efefef', marginTop: 10 }} />
                    <Text style={[{ fontSize: 16, color: globalcolor.taskImfoLabel, marginTop: 10 }]}>更换原因</Text>
                    <Text style={[{ width: contentWidth, marginTop: 10, fontSize: 14, color: globalcolor.recordde, marginBottom: 10 }]}>{item.Remark}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    _ListHeaderComponent = () => {
        return (
            <View
                style={[
                    {
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: SCREEN_WIDTH
                    }
                ]}
            >
                <TouchableOpacity
                    style={[{ marginVertical: 10 }]}
                    onPress={() => {
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'PoConsumablesReplaceForm' }));
                    }}
                >
                    <View
                        style={[
                            {
                                width: SCREEN_WIDTH - 24,
                                height: 48,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: globalcolor.white,
                                borderRadius: 2
                            }
                        ]}
                    >
                        <Text style={[{ fontSize: 15 }]}>添加记录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    cancelButton = () => { };
    confirm = () => {
        const { ID } = SentencedToEmpty(this.props, ['route', 'params', 'params', 'item'], {});
        this.props.dispatch(
            createAction('taskModel/deleteConsumablesReplace')({
                params: {
                    TaskID: this.props.consumableRecord.TaskID,
                    TypeID: ID,
                }
            })
        );
    };
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除所有易耗品记录的表单',
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
                status={this.props.consumablesReplace.status}
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
                {this.props.consumablesReplace.status == 200 ? (
                    <View style={styles.container}>
                        <FlatList ListEmptyComponent={null} data={this.props.consumableRecord.RecordList} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />

                        <TouchableOpacity
                            style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                            onPress={() => {
                                this.deleteALL();
                            }}
                        >
                            {this.props.consumableRecord.RecordList.length > 0 ? (
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
                            ) : null}
                        </TouchableOpacity>
                    </View>
                ) : null}
                <AlertDialog options={options} ref="doAlert" />
                {this.props.editstatus.status == -1 ? <SimpleLoadingComponent message={'删除中'} /> : null}
            </StatusPage>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

        backgroundColor: globalcolor.backgroundGrey
    }
});

//make this component available to the app
export default PoConsumablesReplaceRecord;
