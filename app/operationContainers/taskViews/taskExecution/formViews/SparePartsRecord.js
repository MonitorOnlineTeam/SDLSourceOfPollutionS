//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, FlatList, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import globalcolor from '../../../../config/globalcolor';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../../config/globalsize';
import { NavigationActions, createAction, createNavigationOptions } from '../../../../utils';
// import { getToken, } from '../../dvapack/storage';
import { StatusPage, Touchable, PickerTouchable } from '../../../../components';
import { AlertDialog } from '../../../../components';
import moment from 'moment';
// create a component
@connect(({ taskModel }) => ({
    sparePartsReplace: taskModel.sparePartsReplace,
    currentTask: taskModel.currentTask
}))
class SparePartsRecord extends Component {
    static navigationOptions = createNavigationOptions({
        title: '备品备件更换记录',
        headerRight: (
            <TouchableOpacity
                onPress={() => {
                    _me.props.dispatch(NavigationActions.navigate({ routeName: 'SparePartsForm' }));
                }}
            >
                <Image source={require('../../../../images/jiarecord.png')} style={{ width: 24, height: 24, marginRight: 16 }} />
                {/* <Text style = {{color:'white',marginRight:5}}>删除表单</Text> */}
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
                    _me.props.dispatch(NavigationActions.navigate({ routeName: 'SparePartsForm' }));
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
        // console.log(this.props.navigation.state.params)
        this.props.dispatch(
            createAction('taskModel/getSparePartsRecord')({
                params: {
                    TaskID: this.props.currentTask.TaskID
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
        // } else if (this.props.navigation.state.params.ID == 4) {
        return (
            <View style={[{ width: SCREEN_WIDTH, alignItems: 'center' }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.dispatch(
                            NavigationActions.navigate({
                                routeName: 'SparePartsForm',
                                params: {
                                    item: item,
                                    key: index
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
                    <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }]}>
                        <View style={[{ flexDirection: 'row', minWidth: SCREEN_WIDTH / 2 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>物品名称：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.SparePartName}</Text>
                        </View>
                        <View style={[{ flexDirection: 'row', flex: 1, marginLeft: 20 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>单位：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.Unit}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', marginTop: 6, alignItems: 'center' }]}>
                        <View style={[{ flexDirection: 'row', minWidth: SCREEN_WIDTH / 2 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>规格型号：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.Model}</Text>
                        </View>
                        <View style={[{ flexDirection: 'row', flex: 1, marginLeft: 20 }]}>
                            <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>数量：</Text>
                            <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{item.Num}</Text>
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', marginTop: 5 }]}>
                        <Text style={[{ fontSize: 15, color: globalcolor.taskImfoLabel }]}>更换时间：</Text>
                        <Text style={[{ fontSize: 15, color: globalcolor.recordde }]}>{this.formatShowTime(item.ReplaceDate, 'HourData')}</Text>
                    </View>
                    <View style={{ width: SCREEN_WIDTH - 20, height: 1, backgroundColor: '#efefef', marginTop: 10 }} />
                    <Text style={[{ fontSize: 16, color: globalcolor.taskImfoLabel, marginTop: 10 }]}>更换原因</Text>
                    <Text style={[{ marginTop: 10, fontSize: 14, color: globalcolor.recordde, marginBottom: 10 }]}>{item.Remark}</Text>
                </TouchableOpacity>
            </View>
        );
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
                        this.props.dispatch(NavigationActions.navigate({ routeName: 'ConsumablesReplaceForm' }));
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
                        <Text style={[{ color: '#333333', fontSize: 15 }]}>添加记录</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    cancelButton = () => { };
    confirm = () => {
        // this.refs.doAlert2.hideModal()
        // Alert.alert(
        //     '标题',
        //     '提交成功',
        //   );
        this.props.dispatch(
            createAction('taskModel/deleteSpareParts')({
                params: {
                    TaskID: this.props.sparePartsReplace.data.data.Record.TaskID,
                }
            })
        );
    };
    render() {
        var options = {
            headTitle: '提示',
            messText: '是否确定要删除所有备件记录的表单',
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
                status={this.props.sparePartsReplace.status}
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
                {this.props.sparePartsReplace.status == 200 ? (
                    <View style={styles.container}>
                        <FlatList ListEmptyComponent={null} data={this.props.sparePartsReplace.data.data.Record.RecordList} keyExtractor={this._keyExtractor} renderItem={this._renderItem} />

                        <TouchableOpacity
                            style={[{ position: 'absolute', right: 18, bottom: 128 }]}
                            onPress={() => {
                                this.deleteALL();
                            }}
                        >
                            {
                                <View style={[{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={[{ color: globalcolor.whiteFont }]}>{'删除'}</Text>
                                    <Text style={[{ color: globalcolor.whiteFont }]}>{'表单'}</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                ) : null}

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

        backgroundColor: globalcolor.backgroundGrey
    }
});

//make this component available to the app
export default SparePartsRecord;
