import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { ShowToast, createNavigationOptions, createAction, SentencedToEmpty } from '../../utils';
import { StatusPagem, SimpleLoadingComponent, StatusPage, Touchable, SimplePickerRangeDay, FlatListWithHeaderAndFooter, SDLText } from '../../components';
import TextLabel from '../../pollutionContainers/components/TextLabel';
import { getToken } from '../../dvapack/storage';
/**
 * 排口任务记录
 * @class PointTaskRecord
 * @extends {Component}
 */
@connect(({ enterpriseListModel }) => ({
    TaskRecordIndex: enterpriseListModel.TaskRecordIndex,
    TaskRecordTotal: enterpriseListModel.TaskRecordTotal,
    TaskRecordResult: enterpriseListModel.TaskRecordResult,
    TaskRecordData: enterpriseListModel.TaskRecordData,
    TaskRecordbeginTime: enterpriseListModel.TaskRecordbeginTime,
    TaskRecordendTime: enterpriseListModel.TaskRecordendTime
}))
export default class PointTaskRecord extends Component {
    static navigationOptions = createNavigationOptions({
        title: '运维工单',
        headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
    });

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.statusOnRefresh();
    }

    onRefresh = index => {
        const UserId = getToken().UserId;
        this.props.dispatch(createAction('enterpriseListModel/updateState')({ TaskRecordIndex: index, TaskRecordTotal: 0 }));
        this.props.dispatch(
            createAction('enterpriseListModel/getOperationHistoryRecordByDGIMN')({
                params: {
                    IsQueryAllUser: true,
                    IsPaging: true,
                    operationUserId: UserId,
                    exceptionType: '0',
                    beginTime: this.props.TaskRecordbeginTime,
                    endTime: this.props.TaskRecordendTime,
                    DGIMN: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'DGIMN'], ''),
                    pageIndex: 1,
                    pageSize: 20
                },
                setListData: this.list.setListData
            })
        );
    };
    statusOnRefresh = () => {
        const UserId = getToken().UserId;
        this.props.dispatch(createAction('enterpriseListModel/updateState')({ TaskRecordIndex: 1, TaskRecordTotal: 0, TaskRecordResult: { status: -1 } }));
        this.props.dispatch(
            createAction('enterpriseListModel/getOperationHistoryRecordByDGIMN')({
                params: {
                    "isApp": "1",
                    IsQueryAllUser: true,
                    IsPaging: true,
                    operationUserId: UserId,
                    exceptionType: '0',
                    beginTime: this.props.TaskRecordbeginTime,
                    endTime: this.props.TaskRecordendTime,
                    DGIMN: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'DGIMN'], ''),
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

                this.props.dispatch(createAction('enterpriseListModel/updateState')({ TaskRecordbeginTime: startMoment.format('YYYY-MM-DD 00:00:00'), TaskRecordendTime: endMoment.format('YYYY-MM-DD 23:59:59') }));
                // this.list.onRefresh();

                this.props.dispatch(createAction('enterpriseListModel/updateState')({ TaskRecordIndex: 1, TaskRecordTotal: 0, TaskRecordResult: { status: -1 } }));
                this.props.dispatch(
                    createAction('enterpriseListModel/getOperationHistoryRecordByDGIMN')({
                        params: {
                            IsQueryAllUser: true,
                            IsPaging: true,
                            operationUserId: '',
                            exceptionType: '0',
                            beginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                            endTime: endMoment.format('YYYY-MM-DD 23:59:59'),
                            DGIMN: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'DGIMN'], ''),
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
                <View style={{ flexDirection: 'row', marginBottom: 10, width: SCREEN_WIDTH, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                    <SimplePickerRangeDay style={[{ backgroundColor: '#fff', width: SCREEN_WIDTH, justifyContent: 'center' }]} ref={ref => (this.simplePickerRangeDay = ref)} option={this.getRangeDaySelectOption()} />
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
                            this.props.dispatch(createAction('enterpriseListModel/updateState')({ TaskRecordIndex: index }));
                            this.props.dispatch(
                                createAction('enterpriseListModel/getOperationHistoryRecordByDGIMN')({
                                    params: {
                                        IsQueryAllUser: true,
                                        exceptionType: '0',
                                        IsPaging: true,
                                        operationUserId: '',
                                        beginTime: this.props.TaskRecordbeginTime,
                                        endTime: this.props.TaskRecordendTime,
                                        DGIMN: SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'DGIMN'], ''),
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
                                        <SDLText style={{ marginTop: 15, fontSize: 17, color: '#333' }}>{`${item.EnterpriseName}-${item.PointName}`}</SDLText>
                                        <SDLText style={{ marginTop: 15, color: '#666' }}>{moment(item.CompleteTime).format('YYYY/MM/DD HH:mm')}</SDLText>
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
                                            {SentencedToEmpty(item, ['TaskRecordTypeName'], []).map((tag, key) => {
                                                return <TextLabel key={`tag_${index}_${key}`} style={{ marginLeft: key == 0 ? 0 : 3 }} color={'#75A5FB'} text={tag.TypeName} />;
                                            })}
                                        </View>
                                    </View> */}
                                    <View style={{ width: SCREEN_WIDTH - 26, marginLeft: 13, marginRight: 13 }}>
                                        <SDLText style={{ marginTop: 15, fontSize: 15, color: '#333', lineHeight: 18 }}>{`${item.EnterpriseName}-${item.PointName}`}</SDLText>
                                        <View style={[{ flexDirection: 'row', width: SCREEN_WIDTH - 13, marginRight: 13 }]}>
                                            <View style={[{ flex: 1 }]}>

                                                <View style={{ flexDirection: 'row' }}>

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
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                                    <SDLText style={{ color: '#666' }}>{`运维人员：${SentencedToEmpty(item, ['OperationName'], '---')}`}</SDLText>
                                                    {
                                                        item.UpdateStatus ?
                                                            <TextLabel style={{ marginLeft: 3 }} color={'#D28B38'} text={'修改'} />
                                                            : null
                                                    }
                                                </View>
                                                <SDLText style={{ marginTop: 10, flex: 1, color: '#666' }}>{'时间：' + (SentencedToEmpty(item, ['CompleteTime'], '') == '' ? '---/--/-- --:--' : moment(item.CompleteTime).format('YYYY/MM/DD HH:mm'))}</SDLText>
                                            </View>
                                            {
                                                SentencedToEmpty(item, ['TaskStatus'], -1) == 3
                                                    ? <Image style={{ width: 100, height: 100, marginRight: 13 }} source={require('../../images/img_record_complete.png')} />
                                                    : SentencedToEmpty(item, ['TaskStatus'], -1) == 10 ? <Image style={{ width: 100, height: 100, marginRight: 13 }} source={require('../../images/img_record_closed.png')} />
                                                        : <View style={{ width: 100, height: 100, marginRight: 13 }} />
                                            }

                                        </View>
                                        {/* <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
                                            {
                                                item.UpdateStatus || true ?
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
