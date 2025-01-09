import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Platform, Image, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { Button, StatusPage, Contact, SimplePickerRangeDay, SimplePicker } from '../../components';
import coordinate from '../../utils/coordinate';
import { ShowToast, createAction, NavigationActions, createNavigationOptions, SentencedToEmpty } from '../../utils';
import moment from 'moment';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../config/globalsize';
import PickerView from '../../components/SDLPicker/PickerView';
let platformContainerStyles;

if (Platform.OS === 'ios') {
    platformContainerStyles = {
        backgroundColor: '#49a1fe',
        height: 45,
        borderBottomWidth: 0, //修改的地方
        borderBottomColor: '#A7A7AA'
    };
} else {
    platformContainerStyles = {
        backgroundColor: '#49a1fe',
        height: 45,
        elevation: 0
    };
}
@connect(({ abnormalTask, login }) => ({
    checkTaskList: abnormalTask.checkTaskList,
    checkSearchTaskList: abnormalTask.checkSearchTaskList,
    workerBenchMenu: login.workerBenchMenu // 动态菜单
}))
class TaskToBeVerifiedList extends Component {
    constructor(props) {
        super(props);
        let buttons = [];
        console.log('this.props.workerBenchMenu = ', this.props.workerBenchMenu);
        this.props.workerBenchMenu.map(item => {
            // if (item.id === 'd92e9aab-486f-4cb5-abd6-344674d4b0d5') {
            if (item.id === "a7ab5b6c-b14a-4ee4-8eee-9151be0ea88a") {
                item.children.map(sItem => {
                    // if (sItem.id === '2273c00d-7594-4f85-8174-b46903a93ff7') {
                    if (sItem.id === "89afcc6f-e994-4478-92ac-31696d275975") {
                        sItem.buttonList.map(btn => {
                            buttons.push({ ModelGuid: btn.code.replace(/[^0-9]/g, ''), ModelName: btn.name });
                        });
                    }
                });
            }
        });
        buttons = buttons.sort((a, b) => {
            return a.ModelGuid - b.ModelGuid;
        });

        this.state = {
            filterArray: buttons,
            serchName: '',
            // CheckStatus: buttons[0].ModelGuid,
            CheckStatus: SentencedToEmpty(buttons, [0, 'ModelGuid'], ''),
            beginTime: moment()
                .subtract(1, 'months')
                .format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        props.navigation.setOptions({
            title: '核查任务',
        });
    }

    componentDidMount() {
        this.onFreshData();
    }

    onFreshData = () => {
        this.props.dispatch(
            createAction('abnormalTask/updateState')({
                getCheckedListParams: {
                    IsTotal: false,
                    CheckStatus: this.state.CheckStatus,
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    serchName: this.state.serchName,
                    pageSize: 200,
                    pageIndex: 1
                }
            })
        );
        this.props.dispatch(
            createAction('abnormalTask/GetCheckedList')({
                IsTotal: false,
                CheckStatus: this.state.CheckStatus,
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                serchName: this.state.serchName,
                pageSize: 200,
                pageIndex: 1
            })
        );
    };
    searchData = serchName => {
        this.props.dispatch(
            createAction('abnormalTask/updateState')({
                getCheckedListParams: {
                    IsTotal: false,
                    CheckStatus: this.state.CheckStatus,
                    serchName: serchName,
                    beginTime: this.state.beginTime,
                    endTime: this.state.endTime,
                    pageSize: 200,
                    pageIndex: 1
                }
            })
        );
        this.props.dispatch(
            createAction('abnormalTask/GetCheckedList')({
                CheckStatus: this.state.CheckStatus,
                serchName: serchName,
                beginTime: this.state.beginTime,
                endTime: this.state.endTime,
                pageSize: 200,
                pageIndex: 1
            })
        );
    };

    renderItemList = item => {
        return (
            <TouchableOpacity
                key={item.index.toString()}
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    minHeight: 45,
                    marginBottom: 1,
                    padding: 13
                }}
                onPress={() => {
                    this.props.dispatch(
                        NavigationActions.navigate({
                            routeName: 'CheckDetails',
                            params: { ...item, onRefresh: this.onFreshData, editCommitEnable: item.item.Status == 1 ? true : false }
                        })
                    );
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[{ color: '#333333', maxWidth: SCREEN_WIDTH - 80 }]}>{`企业：${item.item.EntName}`}</Text>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 10, backgroundColor: item.item.Status == 1 ? '#4AA0FF50' : item.item.Status == 2 ? '#FF930650' : '#34d39950', padding: 3 }}>
                        <Text style={[{ color: item.item.Status == 1 ? '#4AA0FF' : item.item.Status == 2 ? '#FF9306' : '#34d399', fontSize: 12 }]}>{item.item.StatusName}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={[{ color: '#333333' }]}>{`排口：${item.item.PointName}`}</Text>
                    <Text style={[{ color: '#333333' }]}>{`核查人：${item.item.CheckedUserName}`}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={[{ color: '#333333' }]}>{`类型：${item.item.ModelName}`}</Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: item.index == SentencedToEmpty(this.props.checkTaskList, ['data', 'Datas'], []).length - 1 && item.index >= 5 ? 50 : 10
                    }}
                >
                    <Text style={[{ color: '#333333' }]}>{`时间：${item.item.CreateTime}`}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    getRangeDaySelectOption = () => {
        return {
            defaultTime: this.state.beginTime,
            start: this.state.beginTime,
            end: this.state.endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                this.setState({ beginTime: startMoment.format('YYYY-MM-DD 00:00:00'), endTime: endMoment.format('YYYY-MM-DD 23:59:59') }, () => {
                    this.onFreshData();
                });
            }
        };
    };
    getDataTypeSelectOption = () => {
        return {
            codeKey: 'ModelGuid',
            nameKey: 'ModelName',
            placeHolder: '',
            // defaultCode: this.state.filterArray[0].ModelGuid,
            defaultCode: SentencedToEmpty(this.state, ['filterArray', 0, 'ModelGuid'], ''),
            dataArr: this.state.filterArray,
            onSelectListener: item => {
                this.setState({ CheckStatus: item.ModelGuid }, () => {
                    this.onFreshData();
                });
            }
        };
    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10, paddingLeft: 20, paddingRight: 20 }]}>
                    <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                    <SimplePicker option={this.getDataTypeSelectOption()} style={[{ width: 150 }]} />
                </View>
                <StatusPage
                    backRef={true}
                    status={SentencedToEmpty(this.props.checkTaskList, ['status'], -1)}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.onFreshData();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.onFreshData();
                    }}
                >
                    <Contact
                        style={{ marginBottom: 100 }}
                        flatData={SentencedToEmpty(this.props.checkTaskList, ['data', 'Datas'], [])} //FlatList数据
                        renderItem={this.renderItemList}
                        searchResult={SentencedToEmpty(this.props.checkTaskList, ['data', 'Datas'], [])}
                        renderSearchItem={this.renderItemList}
                        searchPlaceholder={'搜索排口或企业名称'}
                        searchValue={this.state.serchName}
                        SearchCallback={tag => {
                            //搜索按钮的回调
                            this.setState({ serchName: tag });

                            this.searchData(tag);
                        }}
                        onRefresh={() => {
                            this.onFreshData();
                        }}
                        ListHeaderComponent={null}
                        ListHeaderComponentHeight={0}
                    />
                </StatusPage>
            </View>
        );
    }
}

export default TaskToBeVerifiedList;
