import React, { Component } from 'react';
import { Text, View, Image, TextInput, Alert, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import { NavigationActions, createAction, createNavigationOptions, transformColorToTransparency, SentencedToEmpty, isNum } from '../../../utils';
import { LineSelectBar, SimplePicker, StatusPage, DTable, SimplePickerSingleTime, Touchable, SDLText } from '../../../components';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { getStatusByCode } from '../../../pOperationModels/utils/index';
import { GetDataTime } from '../../../utils/apputil';
import TextLabel from '../../../pollutionContainers/components/TextLabel';

@connect(({ dataForm }) => ({
    allTypeSummaryList: dataForm.allTypeSummaryList,
    allTypeSummaryListResult: dataForm.allTypeSummaryListResult,
    pollutantTypeListResult: dataForm.pollutantTypeListResult,
    pollutantTypeCodeResult: dataForm.pollutantTypeCodeResult,
    selectPollutantType: dataForm.selectPollutantType,
    selectTimeType: dataForm.selectTimeType,
    time: dataForm.time,
    pointName: dataForm.pointName,
    pollutantTypeList: dataForm.pollutantTypeList,
    pollutantTypeCode: dataForm.pollutantTypeCode
}))
class DataForm extends Component {
    static navigationOptions = createNavigationOptions({
        title: '数据一览'
    });

    constructor(props) {
        super(props);
        this.state = {
            pointName: this.props.pointName,
            dataType: 'HourData'
        };
    }
    componentDidMount() {
        const defaultTime = moment()
            .subtract(1, 'hours')
            .format('YYYY-MM-DD HH:00:00');
        this.props.dispatch(createAction('dataForm/updateState')({ selectPollutantType: -1, selectTimeType: 'HourData', time: defaultTime, pointName: '', pollutantTypeList: [] }));

        this.props.dispatch(createAction('dataForm/init')({}));
        // this.subscription = DeviceEventEmitter.addListener('refresh', () => {
        //     this.props.dispatch(createAction('dataForm/getData')({}));
        // });
    }

    componentWillUnmount() {
        // this.subscription.remove();
    }

    getTimeTypeOption = () => {
        const dataArr = [{ code: 'RealTimeData', name: '实时数据' }, { code: 'MinuteData', name: '分钟数据' }, { code: 'HourData', name: '小时数据' }, { code: 'DayData', name: '日均数据' }];
        return {
            codeKey: 'code',
            nameKey: 'name',
            placeHolder: '请选择数据类型',
            defaultCode: 'HourData',
            dataArr,
            onSelectListener: item => {
                if (item.code == 'HourData') {
                    this.props.dispatch(
                        createAction('dataForm/updateState')({
                            selectTimeType: item.code,
                            time: moment()
                                .subtract(1, 'hours')
                                .format('YYYY-MM-DD HH:00:00')
                        })
                    );
                } else if (item.code == 'DayData') {
                    this.props.dispatch(
                        createAction('dataForm/updateState')({
                            selectTimeType: item.code,
                            time: moment()
                                .subtract(1, 'days')
                                .format('YYYY-MM-DD 01:00:00')
                        })
                    );
                } else {
                    this.props.dispatch(
                        createAction('dataForm/updateState')({
                            selectTimeType: item.code
                        })
                    );
                }

                this.props.dispatch(createAction('dataForm/getData')({}));
            }
        };
    };

    getTitleProps = () => {
        let titleData = [],
            widthArr = [],
            alignArr = [],
            itemWidth = 80;
        // if (this.props.selectPollutantType == '5') itemWidth = 80;
        const nameWidth = (SCREEN_WIDTH * 2) / 5;
        titleData.push({ title: '排口名称', key: 'pointName' });
        widthArr.push(nameWidth);
        alignArr.push('center');
        if (this.props.pollutantTypeCode.length < 3) {
            itemWidth = (SCREEN_WIDTH - nameWidth) / this.props.pollutantTypeCode.length;
        }

        let pollutantTypeCode = [];
        pollutantTypeCode = pollutantTypeCode.concat(this.props.pollutantTypeCode);
        if (this.props.selectPollutantType == '5' || this.props.selectPollutantType == '12') {
            if (this.props.selectTimeType == 'HourData' || this.props.selectTimeType == 'DayData') {
                pollutantTypeCode.unshift({ field: 'PrimaryPollutant', title: '首要污染', unit: '', name: '首要污染' });
                pollutantTypeCode.unshift({ field: 'AQI', title: 'AQI', unit: '', name: 'AQI' });
            }
        }

        pollutantTypeCode.map((item, index) => {
            let title = item.unit ? `${SentencedToEmpty(item, ['name'], '--')}\n${SentencedToEmpty(item, ['unit'], '--')}` : `${SentencedToEmpty(item, ['name'], '--')}`;
            let order = item.field != 'PrimaryPollutant' && (this.props.selectPollutantType == '5' || this.props.selectPollutantType == '12');
            titleData.push({ title, key: SentencedToEmpty(item, ['field'], '-1'), order });
            widthArr.push(itemWidth);
            alignArr.push('center');
        });
        return {
            data: titleData,
            widthArr: widthArr,
            alignArr,
            backgroundColor: '#ffffff',
            isSingleLine: false,
            height: 45,
            textStyle: {
                fontSize: 13,
                color: '#333',
                fontWeight: '500',
                textAlign: 'center'
            },
            borderStyle: {
                borderColor: '#e5e5e5',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0
            },
            order: {
                orderKey: 'AQI',
                orderType: 'desc',
                orderFun: (list, key, type) => {
                    list.sort((a, b) => {
                        _a = a[key];
                        _b = b[key];
                        if (!isNum(_a) && !isNum(_b)) return 0;
                        if (!isNum(_a)) return 1;
                        if (!isNum(_b)) return -1;

                        if (_a == 0 && _b == 0) return 0;
                        if (_a == 0) return 1;
                        if (_b == 0) return -1;

                        if (_a == -99 && _b == -99) return 0;
                        if (_a == -99) return 1;
                        if (_b == -99) return -1;

                        if (type == 'asc') {
                            return _a - _b;
                        } else {
                            return _b - _a;
                        }
                    });
                }
            },
            fixCol: 1
        };
    };

    getContentProps = () => {
        let itemWidth = 80;
        // if (this.props.selectPollutantType == '5') itemWidth = 80;

        const widthArr = [];
        const alignArr = ['center'];
        const nameWidth = (SCREEN_WIDTH * 2) / 5;
        if (this.props.pollutantTypeCode.length < 3) {
            itemWidth = (SCREEN_WIDTH - nameWidth) / this.props.pollutantTypeCode.length;
        }
        widthArr.push(nameWidth);

        let pollutantTypeCode = [];
        pollutantTypeCode = pollutantTypeCode.concat(this.props.pollutantTypeCode);
        if (this.props.selectPollutantType == '5' || this.props.selectPollutantType == '12') {
            if (this.props.selectTimeType == 'HourData' || this.props.selectTimeType == 'DayData') {
                pollutantTypeCode.unshift({ field: 'PrimaryPollutant', title: '首要污染', unit: '', name: '首要污染' });
                pollutantTypeCode.unshift({ field: 'AQI', title: 'AQI', unit: '', name: 'AQI' });
            }
        }

        pollutantTypeCode.map((item, key) => {
            widthArr.push(itemWidth);
            alignArr.push('center');
        });

        return {
            data: this.props.allTypeSummaryList,
            widthArr: widthArr,
            alignArr,
            backgroundColor: '#fff',
            height: 60,
            textStyle: {
                fontSize: 14,
                color: '#666',
                fontWeight: '400'
            },
            defaultContent: '-',
            borderStyle: {
                borderColor: '#e5e5e5',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 0,
                borderRightWidth: 0
            },

            renderCell: (index, colKey, dataItem) => {
                if (colKey == 'pointName') {
                    let pointNameWidth = nameWidth - 20;
                    if (dataItem.outPutFlag == '1' || dataItem.outPutFlag == 1) pointNameWidth = nameWidth - 64;
                    return (
                        <View style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#fff' }}>
                            <View style={{ width: 8, height: 8, marginLeft: 8, marginRight: 4, borderRadius: 4, backgroundColor: getStatusByCode(dataItem.status).color }} />
                            <View style={{ height: '100%', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
                                <View style={{ flexDirection: 'row', width: nameWidth - 20, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ lineHeight: 20, fontSize: 14, color: '#666', maxWidth: pointNameWidth }}>
                                        {`${dataItem.pointName}`}
                                    </Text>
                                    {dataItem.outPutFlag == '1' || dataItem.outPutFlag == 1 ? <TextLabel style={{ marginLeft: 4 }} color={'#ff0000'} text={'停运'} /> : null}
                                </View>

                                <SDLText fontType={'small'} numberOfLines={1} ellipsizeMode={'tail'} style={{ lineHeight: 20, color: '#666', width: nameWidth - 20 }}>
                                    {`${dataItem.Abbreviation}`}
                                </SDLText>
                            </View>
                        </View>
                    );
                } else if (colKey == 'AQI') {
                    if (typeof dataItem[colKey] == 'undefined' || dataItem[colKey] == '-') {
                        return (
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                                <Text
                                    style={{
                                        width: 40,
                                        height: 22,
                                        borderRadius: 11,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        lineHeight: 22,
                                        backgroundColor: dataItem.AQI_Color && typeof dataItem.AQI_Color != 'undefined' && dataItem.AQI_Color != '-' ? dataItem.AQI_Color : '#4aa0ff'
                                    }}
                                >
                                    {'-'}
                                </Text>
                            </View>
                        );
                    } else {
                        return (
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                                <Text
                                    style={{
                                        width: 40,
                                        height: 22,
                                        borderRadius: 11,
                                        fontWeight: '400',
                                        textAlign: 'center',
                                        lineHeight: 22,
                                        backgroundColor: dataItem.AQI_Color && typeof dataItem.AQI_Color != 'undefined' && dataItem.AQI_Color != '-' ? dataItem.AQI_Color : '#4aa0ff',
                                        color: '#fff'
                                    }}
                                >
                                    {dataItem[colKey]}
                                </Text>
                            </View>
                        );
                    }
                }
                return -1;
            },
            onRowClick: (index, dataItem) => {
                const { DGIMN, Abbreviation, entName: TargetName, pointName: PointName } = dataItem;
                this.props.dispatch(NavigationActions.navigate({ routeName: 'PointDetail', params: { DGIMN, Abbreviation, TargetName, PointName } }));
            }
        };
    };

    getTimeComponent = () => {
        let option = {};
        if (this.props.selectTimeType == 'HourData') {
            option = {
                formatStr: 'MM/DD HH:00',
                type: 'hour',
                defaultTime: this.props.time,
                onSureClickListener: time => {
                    this.props.dispatch(
                        createAction('dataForm/updateState')({
                            time: moment(time).format('YYYY-MM-DD HH:00:00')
                        })
                    );
                    this.props.dispatch(createAction('dataForm/getData')({}));
                }
            };
            return <SimplePickerSingleTime key={'HourData'} style={{ width: 120 }} option={option} />;
        } else if (this.props.selectTimeType == 'DayData') {
            option = {
                formatStr: 'YYYY-MM-DD',
                type: 'day',
                defaultTime: this.props.time,
                onSureClickListener: time => {
                    this.props.dispatch(
                        createAction('dataForm/updateState')({
                            time: moment(time).format('YYYY-MM-DD 00:00:00')
                        })
                    );
                    this.props.dispatch(createAction('dataForm/getData')({}));
                }
            };
            return <SimplePickerSingleTime key={'DayData'} style={{ width: 120 }} option={option} />;
        } else {
            return <Text style={[{ marginRight: 13 }]}>{GetDataTime(this.props.allTypeSummaryList) == '-' ? '' : moment(GetDataTime(this.props.allTypeSummaryList)).format('MM-DD HH:mm')}</Text>;
        }
    };

    render() {
        let outStatus = 200;
        let pollutantTypeListStatus = SentencedToEmpty(this.props.pollutantTypeListResult, ['status'], 1000);
        let pollutantTypeCodeStatus = SentencedToEmpty(this.props.pollutantTypeCodeResult, ['status'], 1000);
        if (pollutantTypeListStatus == 200 && pollutantTypeCodeStatus == 200) {
            outStatus = 200;
        } else if (pollutantTypeListStatus == 0 || pollutantTypeCodeStatus == 0) {
            outStatus = 0;
        } else if (pollutantTypeListStatus == 1000 || pollutantTypeCodeStatus == 1000) {
            outStatus = 1000;
        } else if (pollutantTypeListStatus == 404 || pollutantTypeCodeStatus == 404) {
            outStatus = 404;
        } else if (pollutantTypeListStatus == -1 || pollutantTypeCodeStatus == -1) {
            outStatus = -1;
        }

        return (
            <StatusPage
                status={outStatus}
                backRef={true}
                //页面是否有回调按钮，如果不传，没有按钮，
                emptyBtnText={'重新请求'}
                errorBtnText={'点击重试'}
                onEmptyPress={() => {
                    //空页面按钮回调
                    this.props.dispatch(createAction('dataForm/init')({}));
                }}
                onErrorPress={() => {
                    //错误页面按钮回调
                    this.props.dispatch(createAction('dataForm/init')({}));
                }}
            >
                {
                    this.props.pollutantTypeList && this.props.pollutantTypeList.length > 1 ? (<LineSelectBar
                        scrollable={false}
                        defaultSelectArray={[0]}
                        contentWidth={SCREEN_WIDTH}
                        isMultiple={false}
                        creactItemFun={(item, key, selectArray, isMultiple) => {
                            return (
                                <View
                                    style={[
                                        {
                                            height: 45,
                                            width: SCREEN_WIDTH / this.props.pollutantTypeList.length - 8, //去掉了年均 改成了3
                                            marginHorizontal: 4,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderBottomWidth: 1,
                                            borderBottomColor: selectArray.indexOf(key) != -1 && isMultiple ? SentencedToEmpty(item, ['selectColor'], '#00000000') : '#00000000'
                                        }
                                    ]}
                                >
                                    <Text style={[{ fontSize: 15, color: selectArray.indexOf(key) != -1 ? SentencedToEmpty(item, ['selectColor'], '#00000000') : '#666' }]}>{item.showValue}</Text>
                                </View>
                            );
                        }}
                        callBack={(item, array) => {
                            this.props.dispatch(createAction('dataForm/updateState')({ selectPollutantType: item.value }));
                            this.props.dispatch(createAction('dataForm/setPollutantType')({}));
                        }}
                        data={this.props.pollutantTypeList}
                    />) : null
                }
                <View
                    style={{
                        width: SCREEN_WIDTH,
                        height: 50,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        marginBottom: 1,
                    }}
                >
                    <View style={[{ flex: 1 }, { height: 30, flex: 1, borderRadius: 15, backgroundColor: '#f2f2f2', marginRight: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginLeft: 10 }]}>
                        <Image source={require('../../../images/ic_datacheck.png')} style={[{ height: 18, width: 18 }]} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder={'请输入内容'}
                            style={{
                                marginLeft: 5,
                                fontSize: 15,
                                color: '#666',
                                flex: 1,
                                lineHeight: 30,
                                padding: 0
                            }}
                            value={this.props.pointName}
                            onChangeText={text => {
                                this.props.dispatch(createAction('dataForm/updateState')({ pointName: text ? text : '' }));
                                // this.props.dispatch(createAction('dataForm/getData')({}));
                                // this.setState({ pointName: text });
                                // if (this.props.equipmentInfoListResult.status == 200) {
                                //     this.list.onRefresh();
                                // } else {
                                //     this.statusPageOnRefresh();
                                // }
                            }}
                            clearButtonMode="while-editing"
                            ref="keyWordInput"
                            placeholderTextColor={'#999'}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.dispatch(createAction('dataForm/getData')({}));
                        }}
                    >
                        <View style={[{
                            height: 30, width: 72,
                            justifyContent: 'center', alignItems: 'center',
                            marginHorizontal: 16, borderRadius: 4,
                            backgroundColor: '#4AA0FF',
                        }]}>
                            <Text style={{ color: 'white', fontSize: 14 }}>{'搜索'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: SCREEN_WIDTH,
                        height: 40,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: 'white'
                    }}
                >
                    {/* <View style={[{ flex: 1 }, { height: 30, flex: 1, borderRadius: 15, backgroundColor: '#f2f2f2', marginRight: 4, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginLeft: 10 }]}>
                        <Image source={require('../../../images/ic_datacheck.png')} style={[{ height: 18, width: 18 }]} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholder={'请输入内容'}
                            style={{
                                marginLeft: 5,
                                fontSize: 15,
                                color: '#666',
                                flex: 1,
                                lineHeight: 30,
                                padding: 0
                            }}
                            value={this.state.pointName}
                            onChangeText={text => {
                                this.props.dispatch(createAction('dataForm/updateState')({ pointName: text ? text : '' }));
                                this.props.dispatch(createAction('dataForm/getData')({}));
                                this.setState({ pointName: text });
                                // if (this.props.equipmentInfoListResult.status == 200) {
                                //     this.list.onRefresh();
                                // } else {
                                //     this.statusPageOnRefresh();
                                // }
                            }}
                            clearButtonMode="while-editing"
                            ref="keyWordInput"
                            placeholderTextColor={'#999'}
                        /> 
                    </View>*/}
                    <SimplePicker style={[{ marginLeft: -10 }]} option={this.getTimeTypeOption()} />
                    <View />
                    {this.getTimeComponent()}
                </View>
                <View style={[{ height: 4, width: SCREEN_WIDTH, backgroundColor: '#f2f2f2' }]} />
                <StatusPage
                    status={this.props.allTypeSummaryListResult.status}
                    backRef={true}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        this.props.dispatch(createAction('dataForm/getData')({}));
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        this.props.dispatch(createAction('dataForm/getData')({}));
                    }}
                >
                    <DTable type={'fix'} titleProps={this.getTitleProps()} contentProps={this.getContentProps()} />
                </StatusPage>
                {/* 刷新 */}
                <Touchable
                    style={{ width: 40, height: 40, position: 'absolute', right: 13, bottom: 40 + (this.state.showLegend ? 60 : 0), backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => {
                        this.props.dispatch(createAction('dataForm/getData')({}));
                    }}
                >
                    <Image style={{ width: 20, height: 20 }} source={require('../../../images/map_refresh_option.png')} />
                </Touchable>
            </StatusPage>
        );
    }
}

export default DataForm;
