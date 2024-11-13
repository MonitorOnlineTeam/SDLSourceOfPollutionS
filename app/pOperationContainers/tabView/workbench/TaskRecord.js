import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, TextInput } from 'react-native';
import { connect } from 'react-redux';
// import { createStackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty, NavigationActions } from '../../../utils';
// import { StatusPagem, SimpleLoadingComponent, StatusPage, Touchable, SimplePickerRangeDay, FlatListWithHeaderAndFooter, SDLText, DeclareModule } from '../../../components';
import { StatusPage, FlatListWithHeaderAndFooter, SDLText, DeclareModule, SimplePickerRangeDay } from '../../../components';
import TextLabel from '../../components/TextLabel';
import { getToken } from '../../../dvapack/storage';
import globalcolor from '../../../config/globalcolor';
/**
 * 任务记录
 * @class TaskRecord
 * @extends {Component}
 */
@connect(({ taskModel }) => ({
    TaskRecordIndex: taskModel.TaskRecordIndex,
    TaskRecordTotal: taskModel.TaskRecordTotal,
    TaskRecordResult: taskModel.TaskRecordResult,
    TaskRecordData: taskModel.TaskRecordData,
    TaskRecordbeginTime: taskModel.TaskRecordbeginTime,
    TaskRecordendTime: taskModel.TaskRecordendTime
}))
export default class TaskRecord extends Component {
    static navigationOptions = createNavigationOptions({
        title: '任务记录',
        // headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 },
        headerRight: (
            <DeclareModule
                contentRender={() => {
                    return <Text style={[{ fontSize: 13, color: 'white', marginHorizontal: 16 }]}>{'说明'}</Text>;
                }}
                options={{
                    headTitle: '说明',
                    innersHeight: 140,
                    messText: `任务工单在结束后720分钟内允许修改。`,
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
        this.state = {};
    }

    componentDidMount() {
        this.statusOnRefresh();
    }

    onRefresh = index => {
        this.props.dispatch(createAction('taskModel/updateState')({ TaskRecordIndex: index, TaskRecordTotal: 0 }));
        this.props.dispatch(
            createAction('taskModel/getTaskRecords')({
                params: {
                    IsQueryAllUser: false,
                    IsPaging: true,
                    operationUserId: getToken().UserId,
                    exceptionType: '0',
                    // beginTime: this.props.TaskRecordbeginTime,
                    // endTime: this.props.TaskRecordendTime,
                    completeBeginTime: this.props.TaskRecordbeginTime,
                    completeEndTime: this.props.TaskRecordendTime,
                    pageIndex: 1,
                    pageSize: 20
                },
                setListData: this.list.setListData
            })
        );
    };
    statusOnRefresh = () => {
        this.props.dispatch(createAction('taskModel/updateState')({ taskRecordSearchStr: '', TaskRecordIndex: 1, TaskRecordTotal: 0, TaskRecordResult: { status: -1 } }));
        this.props.dispatch(
            createAction('taskModel/getTaskRecords')({
                params: {
                    IsQueryAllUser: false,
                    IsPaging: true,
                    operationUserId: getToken().UserId,
                    exceptionType: '0',
                    // beginTime: this.props.TaskRecordbeginTime,
                    // endTime: this.props.TaskRecordendTime,
                    completeBeginTime: this.props.TaskRecordbeginTime,
                    completeEndTime: this.props.TaskRecordendTime,
                    pageIndex: 1,
                    pageSize: 20
                }
            })
        );
    };
    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = this.props.TaskRecordbeginTime;
        endTime = this.props.TaskRecordendTime;
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);

                // this.props.dispatch(createAction('taskModel/updateState')({ TaskRecordbeginTime: startMoment.format('YYYY-MM-DD 00:00:00'), TaskRecordendTime: endMoment.format('YYYY-MM-DD 23:59:59') }));
                // this.list.onRefresh();

                this.props.dispatch(createAction('taskModel/updateState')({
                    TaskRecordbeginTime: startMoment.format('YYYY-MM-DD 00:00:00'), TaskRecordendTime: endMoment.format('YYYY-MM-DD 23:59:59'),
                    TaskRecordIndex: 1, TaskRecordTotal: 0, TaskRecordResult: { status: -1 }
                }));
                this.props.dispatch(
                    createAction('taskModel/getTaskRecords')({
                        params: {
                            IsQueryAllUser: false,
                            IsPaging: true,
                            operationUserId: getToken().UserId,
                            exceptionType: '0',
                            // beginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                            // endTime: endMoment.format('YYYY-MM-DD 23:59:59'),
                            completeBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                            completeEndTime: endMoment.format('YYYY-MM-DD 23:59:59'),
                            pageIndex: 1,
                            pageSize: 20
                        }
                    })
                );
            }
        };
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: 10, width: SCREEN_WIDTH, alignItems: 'center', backgroundColor: '#fff' }}>
                    <SimplePickerRangeDay style={[{ width: SCREEN_WIDTH / 3, justifyContent: 'center' }]} ref={ref => (this.simplePickerRangeDay = ref)} option={this.getRangeDaySelectOption()} />
                    <View
                        style={{
                            height: 40,
                            // backgroundColor: globalcolor.headerBackgroundColor,
                            // width: SCREEN_WIDTH,
                            flex: 1,
                            paddingLeft: 25,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        {/* <Image source={require('../../images/house.png')} style={{ width: 15, height: 15 }}></Image> */}
                        <TextInput
                            onFocus={() => { }}
                            underlineColorAndroid="transparent"
                            placeholder={'企业、点位、工单类型'}
                            placeholderTextColor={'#999999'}
                            style={{
                                color: '#333333',
                                textAlign: 'center',
                                width: SCREEN_WIDTH * 2 / 3 - 80,
                                borderColor: '#cccccc',
                                borderWidth: 1,
                                borderRadius: 15,
                                height: 30,
                                backgroundColor: '#fff',
                                paddingVertical: 0
                            }}
                            onChangeText={text => {
                                this.props.dispatch(createAction('taskModel/updateState')({ taskRecordSearchStr: text }));
                                if (text == '') {
                                    this.onRefresh(1);
                                }
                            }}
                            clearButtonMode="while-editing"
                            ref="keyWordInput"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                // 搜索
                                // this.search(this.state.searchValue);
                                this.props.dispatch(createAction('taskModel/updateState')({
                                    TaskRecordIndex: 1, TaskRecordTotal: 0, TaskRecordResult: { status: -1 }
                                }));
                                this.props.dispatch(
                                    createAction('taskModel/getTaskRecords')({
                                        params: {
                                            IsQueryAllUser: false,
                                            IsPaging: true,
                                            operationUserId: getToken().UserId,
                                            exceptionType: '0',
                                            completeBeginTime: this.props.TaskRecordbeginTime,
                                            completeEndTime: this.props.TaskRecordendTime,
                                            pageIndex: 1,
                                            pageSize: 20
                                        }
                                    })
                                );
                            }}
                        >
                            <View
                                style={[{
                                    width: 49, height: 24
                                    , borderRadius: 12, backgroundColor: '#058BFA'
                                    , justifyContent: 'center', alignItems: 'center'
                                }]}
                            >
                                <Text style={[{ fontSize: 14, color: '#fefefe' }]}>{'搜索'}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <StatusPage
                    backRef={true}
                    status={this.props.TaskRecordResult.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.statusOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.statusOnRefresh();
                        console.log('错误操作回调');
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        ref={ref => (this.list = ref)}
                        pageSize={20}
                        ItemSeparatorComponent={() => <View style={[{ width: SCREEN_WIDTH, height: 10, backgroundColor: '#f2f2f2' }]} />}
                        hasMore={() => {
                            return this.props.TaskRecordData.length < this.props.TaskRecordTotal;
                        }}
                        onRefresh={index => {
                            this.onRefresh(index);
                        }}
                        onEndReached={index => {
                            this.props.dispatch(createAction('taskModel/updateState')({ TaskRecordIndex: index }));
                            this.props.dispatch(
                                createAction('taskModel/getTaskRecords')({
                                    params: {
                                        IsQueryAllUser: false,
                                        exceptionType: '0',
                                        IsPaging: true,
                                        operationUserId: getToken().UserId,
                                        // beginTime: this.props.TaskRecordbeginTime,
                                        // endTime: this.props.TaskRecordendTime,
                                        completeBeginTime: this.props.TaskRecordbeginTime,
                                        completeEndTime: this.props.TaskRecordendTime,
                                        pageIndex: index,
                                        pageSize: 20
                                    },
                                    setListData: this.list.setListData
                                })
                            );
                        }}
                        renderItem={({ item, index }) => {
                            // TaskStatus 3 完成    10 关闭
                            return (
                                <TouchableOpacity
                                    key={`${index}`}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#ffffff',
                                        width: SCREEN_WIDTH,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        this.props.dispatch(createAction('taskModel/updateState')({ TaskID: item.TaskID, DGIMN: item.DGIMN, TaskCode: item.TaskCode }));
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'TaskDetail',
                                                params: { taskID: item.TaskID }
                                            })
                                        );
                                    }}
                                >
                                    {/* <View style={{ width: SCREEN_WIDTH - 26, marginLeft: 13, marginRight: 13 }}>
                                        <SDLText style={{ marginTop: 15, fontSize: 15, color: '#333', lineHeight:18 }}>{`${item.EnterpriseName}-${item.PointName}`}</SDLText>
                                        <SDLText style={{ marginTop: 15, color: '#666' }}>{SentencedToEmpty(item,['CompleteTime'],'')==''?'---/--/-- --:--':moment(item.CompleteTime).format('YYYY/MM/DD HH:mm')}</SDLText>
                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                            <SDLText style={{ color: '#666' }}>{item.TaskFromText}</SDLText>

                                            {SentencedToEmpty(item, ['ExceptionTypeText'], '')
                                                .split(',')
                                                .map((et, key) => {
                                                    return (
                                                        <View key={`e_${index}_${key}`} style={{ flexDirection: 'row' }}>
                                                            {et.length > 1 ? <SDLText style={{ color: '#666' }}>{' | '}</SDLText> : null}
                                                            <SDLText style={{ color: '#D28B38' }}>{et}</SDLText>
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                            <View style={{ flexDirection: 'row', flex:1}}>
                                                {SentencedToEmpty(item, ['TaskRecordTypeName'], []).map((tag, key) => {
                                                    return <TextLabel key={`tag_${index}_${key}`} style={{ marginLeft: key == 0 ? 0 : 3 }} color={'#75A5FB'} text={tag.TypeName} />;
                                                })}
                                            </View>
                                            {
                                                item.UpdateStatus?
                                                <TextLabel style={{  }} color={'#D28B38'} text={'修改'} />
                                                :null
                                            }
                                        </View>
                                    </View> */}
                                    <View style={{ width: SCREEN_WIDTH - 26, marginLeft: 13, marginRight: 13 }}>
                                        <SDLText style={{ marginTop: 15, fontSize: 15, color: '#333', lineHeight: 18 }}>{`${item.EnterpriseName}-${item.PointName}`}</SDLText>
                                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 13, marginRight: 13 }]}>
                                            <View style={[{ flex: 1 }]}>
                                                {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    {SentencedToEmpty(item, ['TaskRecordTypeName'], []).map((tag, key) => {
                                                        return <TextLabel key={`tag_${index}_${key}`} style={{ marginLeft: key == 0 ? 0 : 3 }} color={'#75A5FB'} text={tag.TypeName} />;
                                                    })}
                                                </View> */}
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>

                                                    <SDLText style={{ color: '#666', marginRight: 8 }}>{item.TaskFromText}</SDLText>
                                                    {SentencedToEmpty(item, ['TaskRecordTypeName'], []).map((tag, key) => {
                                                        return <TextLabel key={`tag_${index}_${key}`} style={{ marginLeft: key == 0 ? 0 : 3 }} color={'#75A5FB'} text={tag.TypeName} />;
                                                    })}

                                                    {SentencedToEmpty(item, ['ExceptionTypeText'], '')
                                                        .split(',')
                                                        .map((et, key) => {
                                                            return (
                                                                <View key={`e_${index}_${key}`} style={{ flexDirection: 'row' }}>
                                                                    {key > 0 ? <SDLText style={{ color: '#666' }}>{' | '}</SDLText> : null}
                                                                    <SDLText style={{ color: '#D28B38' }}>{et}</SDLText>
                                                                </View>
                                                            );
                                                        })}
                                                </View>
                                                <View style={[{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }]}>
                                                    <SDLText style={{ color: '#666', marginRight: 8 }}>{`运维人员：${SentencedToEmpty(item, ['OperationName'], '---')}`}</SDLText>
                                                    {
                                                        item.UpdateStatus ?
                                                            <TextLabel style={{}} color={'#D28B38'} text={'修改'} />
                                                            : null
                                                    }
                                                </View>
                                                <SDLText style={{ marginTop: 10, flex: 1, color: '#666' }}>{'时间：' + (SentencedToEmpty(item, ['CompleteTime'], '') == '' ? '---/--/-- --:--' : moment(item.CompleteTime).format('YYYY/MM/DD HH:mm'))}</SDLText>
                                            </View>
                                            {
                                                SentencedToEmpty(item, ['TaskOver'], -1) == 1
                                                    // ? <Text style={[{ fontSize: 20, color: 'orange' }]}>{'超时'}</Text> :
                                                    ? <Image style={{ width: 100, height: 100, marginRight: 13 }} source={require('../../../images/img_record_over_time.png')} /> :
                                                    SentencedToEmpty(item, ['TaskStatus'], -1) == 3
                                                        ? <Image style={{ width: 100, height: 100, marginRight: 13 }} source={require('../../../images/img_record_complete.png')} />
                                                        : SentencedToEmpty(item, ['TaskStatus'], -1) == 10 ? <Image style={{ width: 100, height: 100, marginRight: 13 }} source={require('../../../images/img_record_closed.png')} />
                                                            : <View style={{ width: 100, height: 100, marginRight: 13 }} />
                                            }

                                        </View>
                                        {/* <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                            {
                                                item.UpdateStatus ?
                                                    <TextLabel style={{}} color={'#D28B38'} text={'修改'} />
                                                    : null
                                            }
                                        </View> */}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        data={this.props.TaskRecordData}
                    />
                </StatusPage>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f2f2f2'
    }
});
