/*
 * @Description: 缺失数据
 * @LastEditors: hxf
 * @Date: 2020-10-30 15:19:50
 * @LastEditTime: 2021-01-13 15:47:24
 * @FilePath: /SDLMainProject/app/pollutionContainers/pointDetails/MissDataList.js
 */
import React, { PureComponent } from 'react';
import { Text, View, Platform } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { SCREEN_WIDTH } from '../../config/globalsize';
import { StatusPage, FlatListWithHeaderAndFooter, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, makePhone, ShowToast, SentencedToEmpty } from '../../utils';

@connect(({ pointDetails }) => ({
    missDataListResult: pointDetails.missDataListResult,
    missDataListData: pointDetails.missDataListData,
    missDataListIndex: pointDetails.missDataListIndex,
    missDataListTotal: pointDetails.missDataListTotal,
    missDataListDataType: pointDetails.missDataListDataType,
    beginTime: pointDetails.missDataListBeginTime,
    endTime: pointDetails.missDataListEndTime
}))
export class MissDataList extends PureComponent {
    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: '缺失数据',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    componentDidMount() {
        this.props.dispatch(
            createAction('pointDetails/updateState')({
                missDataListIndex: 1,
                missDataListDataType: 'HourData',
                missDataListBeginTime: moment()
                    .subtract(7, 'day')
                    .format('YYYY-MM-DD 00:00:00'),
                missDataListEndTime: moment().format('YYYY-MM-DD 23:59:59'),
                missDataListResult: { status: -1 }
            })
        );
        this.props.dispatch(createAction('pointDetails/getMissDataList')({}));
    }

    getRangeDaySelectOption = () => {
        let beginTime, endTime;
        beginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        endTime = moment().format('YYYY-MM-DD 23:59:59');
        return {
            defaultTime: beginTime,
            start: beginTime,
            end: endTime,
            formatStr: 'MM/DD',
            onSureClickListener: (start, end) => {
                let startMoment = moment(start);
                let endMoment = moment(end);
                console.log('endMoment = ', endMoment);
                console.log('startMoment = ', startMoment);
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        missDataListIndex: 1,
                        missDataListBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        missDataListEndTime: endMoment.format('YYYY-MM-DD 23:59:59'),
                        missDataListResult: { status: -1 }
                    })
                );
                this.statusPageOnRefresh();
            }
        };
    };

    /**
        HourData  小时数据
        DayData  日数据
     *  */
    getDataTypeSelectOption = () => {
        const dataArr = [{ name: '小时数据', code: 'HourData' }, { name: '日数据', code: 'DayData' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择时间类型',
            defaultCode: 'HourData',
            dataArr,
            onSelectListener: item => {
                this.rangePicker.setTimeRange(
                    moment()
                        .subtract(7, 'day')
                        .format('YYYY-MM-DD 00:00:00'),
                    moment().format('YYYY-MM-DD 23:59:59')
                );
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        missDataListDataType: item.code,
                        missDataListIndex: 1,
                        missDataListBeginTime: moment()
                            .subtract(7, 'day')
                            .format('YYYY-MM-DD 00:00:00'),
                        missDataListEndTime: moment().format('YYYY-MM-DD 23:59:59'),
                        missDataListResult: { status: -1 }
                    })
                );
                this.statusPageOnRefresh();
            }
        };
    };

    onRefresh = () => {
        this.props.dispatch(createAction('pointDetails/getMissDataList')({ setListData: this.list.setListData }));
    };

    statusPageOnRefresh = () => {
        this.props.dispatch(createAction('pointDetails/getMissDataList')({}));
    };

    _onItemClick = item => {
        console.log(item);
    };

    render() {
        return (
            <View style={[{ flex: 1 }]}>
                <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 1, paddingHorizontal: 13 }]}>
                    <SimplePickerRangeDay ref={ref => (this.rangePicker = ref)} style={[{ width: 120 }]} option={this.getRangeDaySelectOption()} />
                    <SimplePicker option={this.getDataTypeSelectOption()} />
                </View>
                <View style={[{ width: SCREEN_WIDTH, height: 46, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', marginBottom: 10 }]}>
                    <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'开始时间'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {'截止时间'}
                        </SDLText>
                    </View>
                    <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                        <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                            {`${true ? '缺失小时个数' : '缺失日个数'}`}
                        </SDLText>
                    </View>
                </View>
                <StatusPage
                    status={this.props.missDataListResult.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.props.dispatch(
                            createAction('pointDetails/updateState')({
                                missDataListResult: { status: -1 }
                            })
                        );
                        this.statusPageOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.props.dispatch(
                            createAction('pointDetails/updateState')({
                                missDataListResult: { status: -1 }
                            })
                        );
                        this.statusPageOnRefresh();
                    }}
                >
                    <FlatListWithHeaderAndFooter
                        ref={ref => (this.list = ref)}
                        pageSize={20}
                        hasMore={() => {
                            return this.props.missDataListData.length < this.props.missDataListTotal;
                        }}
                        onRefresh={index => {
                            this.props.dispatch(
                                createAction('pointDetails/updateState')({
                                    missDataListIndex: 1,
                                    missDataListResult: { status: -1 }
                                })
                            );
                            this.statusPageOnRefresh();
                        }}
                        onEndReached={index => {
                            this.props.dispatch(createAction('pointDetails/updateState')({ missDataListIndex: index }));
                            this.props.dispatch(createAction('pointDetails/getExceptionDataList')({ setListData: this.list.setListData }));
                            this.onRefresh();
                        }}
                        renderItem={({ item, index }) => {
                            console.log('render item');
                            return (
                                <Touchable onPress={() => this._onItemClick(item)}>
                                    <View style={[{ width: SCREEN_WIDTH, height: 46, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                                        <View style={[{ minHeight: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                                            <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                {SentencedToEmpty(item, ['firstAlarmTime'], '----') != '----' ? moment(item.firstAlarmTime).format('MM-DD HH:mm') : '----'}
                                            </SDLText>
                                        </View>
                                        <View style={[{ height: 45, flex: 3, justifyContent: 'center', alignItems: 'center' }]}>
                                            <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                {SentencedToEmpty(item, ['alarmTime'], '----') != '----' ? moment(item.alarmTime).format('MM-DD HH:mm') : '----'}
                                            </SDLText>
                                        </View>
                                        <View style={[{ height: 45, flex: 4, justifyContent: 'center', alignItems: 'center' }]}>
                                            <SDLText fontType={'normal'} style={[{ color: '#666', textAlign: 'center' }]}>
                                                {SentencedToEmpty(item, ['defectCount'], '----')}
                                            </SDLText>
                                        </View>
                                    </View>
                                </Touchable>
                            );
                        }}
                        data={this.props.missDataListData}
                        onEndReachedThreshold={0.1}
                    />
                </StatusPage>
            </View>
        );
    }
}

export default MissDataList;
