import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Platform } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { StatusPage, Touchable, PickerTouchable, SimplePickerRangeDay, SimplePicker, SDLText } from '../../components';
import { createNavigationOptions, NavigationActions, createAction, SentencedToEmpty, transformColorToTransparency, ShowToast, StackActions } from '../../utils';
import { SCREEN_WIDTH } from '../../config/globalsize';
import { getRootUrl } from '../../dvapack/storage';
import { getFormUrl } from '../../utils/taskUtils';

import FlatListWithHeaderAndFooter from '../../components/FlatListWithHeaderAndFooter';

/**
 * 运维日志
 */
@connect(({ pointDetails, app }) => ({
    operationLogsListData: pointDetails.operationLogsListData,
    operationLogsIndex: pointDetails.operationLogsIndex,
    operationLogsTotal: pointDetails.operationLogsTotal,
    operationLogsListResult: pointDetails.operationLogsListResult,
    operationLogsRecordType: pointDetails.operationLogsRecordType
}))
export default class OperationLog extends PureComponent {
    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: '运维日志',
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });

    constructor(props) {
        super(props);
        this.state = {
            datatype: 0
        };
    }

    componentDidMount() {
        // this.list.onRefresh();
        this.statusPageOnRefresh();
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
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        operationLogsIndex: 1,
                        operationLogsTotal: 0,
                        operationLogsBeginTime: startMoment.format('YYYY-MM-DD 00:00:00'),
                        operationLogsEndTime: endMoment.format('YYYY-MM-DD 23:59:59')
                    })
                );
                // this.list.onRefresh();
                if (this.props.operationLogsListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };

    getOperationLogsTypeSelectOption = () => {
        let dataArr = [{ CnName: '全部', TypeId: -1, Abbreviation: '全部' }];
        dataArr = dataArr.concat(this.props.operationLogsRecordType);
        return {
            codeKey: 'TypeId',
            nameKey: 'Abbreviation',
            placeHolder: '类别',
            defaultCode: '-1',
            dataArr,
            onSelectListener: item => {
                this.props.dispatch(
                    createAction('pointDetails/updateState')({
                        operationLogsType: item.TypeId
                    })
                );
                // this.list.onRefresh();
                if (this.props.operationLogsListResult.status == 200) {
                    this.list.onRefresh();
                } else {
                    this.statusPageOnRefresh();
                }
            }
        };
    };
    setDataArr = () => {
        if (this.operationLogsTypePicker == null) {
            console.log('ref 空空空空');
        } else {
            let dataArr = [{ CnName: '全部', TypeId: -1, Abbreviation: '全部' }];
            dataArr = dataArr.concat(this.props.operationLogsRecordType);
            this.operationLogsTypePicker.setDataArr(dataArr);
        }
    };

    onRefresh = index => {
        this.props.dispatch(createAction('pointDetails/updateState')({ operationLogsIndex: index, operationLogsTotal: 0 }));
        this.props.dispatch(createAction('pointDetails/getOperationLogs')({ setListData: this.list.setListData, setDataArr: this.setDataArr }));
    };

    statusPageOnRefresh = () => {
        const operationLogsBeginTime = moment()
            .subtract(7, 'day')
            .format('YYYY-MM-DD 00:00:00');
        const operationLogsEndTime = moment().format('YYYY-MM-DD 23:59:59');

        this.props.dispatch(createAction('pointDetails/updateState')({ operationLogsIndex: 1, operationLogsTotal: 0, operationLogsBeginTime, operationLogsEndTime, operationLogsListResult: { status: -1 } }));
        this.props.dispatch(createAction('pointDetails/getOperationLogs')({ setDataArr: this.setDataArr }));
    };

    _onItemClick = item => {
        console.log(item);
    };

    getItemHeight = (index, outerItem) => {
        if (SentencedToEmpty(outerItem, ['TypeID'], 0) == 0 || SentencedToEmpty(outerItem, ['MainFormID']) == '') {
            return 220;
        } else {
            let topBorder = 20,
                contentHeight;
            if (index == 0) {
                topBorder = 40;
            }
            //判断类型
            // if (index == 0||index ==2) {
            if (true) {
                contentHeight =
                    60 +
                    6 + //下边距
                    33 * 1; //下方列表的高度
            } else {
                contentHeight = 98;
            }

            return topBorder + contentHeight + 20;
        }
    };

    getTypeAbbreviation = TypeId => {
        // console.log('TypeId = ', TypeId);
        let returnStr = '--';
        this.props.operationLogsRecordType.map((item, index) => {
            // console.log('item.TypeId = ', item.TypeId, ',TypeId == item.TypeId :', TypeId == item.TypeId);
            if (TypeId == item.TypeId) {
                returnStr = item.Abbreviation;
            }
        });
        // console.log(returnStr);
        return returnStr;
    };

    renderItemContent = (outerItem, outerIndex) => {
        // console.log('outerItem = ', outerItem);
        if (SentencedToEmpty(outerItem, ['TypeID'], 0) == 0 || SentencedToEmpty(outerItem, ['MainFormID']) == '') {
            return (
                <View style={[{ minHeight: 98, width: SCREEN_WIDTH - 57, justifyContent: 'center', backgroundColor: '#fff', borderRadius: 2, padding: 15 }]}>
                    <SDLText fontType={'normal'} style={[{ color: '#333' }]}>
                        {'设备异常报警'}
                    </SDLText>
                    <SDLText fontType={'small'} style={[{ marginTop: 5, color: '#666' }]}>
                        {SentencedToEmpty(outerItem, ['CreateTime'], 0)}
                    </SDLText>
                    <SDLText fontType={'normal'} style={[{ marginTop: 10, color: '#666' }]}>
                        {SentencedToEmpty(outerItem, ['DisplayInfo'], '----')}
                    </SDLText>
                </View>
            );
        } else {
            return (
                <Touchable
                    key={outerIndex}
                    onPress={() => {
                        let rootUrl = getRootUrl();
                        let currentItem = outerItem;
                        let formUrl = getFormUrl(currentItem, rootUrl.ReactUrl, currentItem.TaskID, 0);
                        console.log(formUrl);
                        console.log(outerItem);

                        //  0：图片   1：电子表单    Type字段
                        if (outerItem.Type == '0') {
                            outerItem.FormMainID = outerItem.MainFormID;
                            this.props.dispatch(
                                StackActions.push({
                                    routeName: 'ImageForm',
                                    params: { ...outerItem, createForm: outerItem.FormMainID != null ? true : false, isEdit: 'noEdit', viewTitle: SentencedToEmpty(outerItem, ['Abbreviation'], '图片表单') }
                                })
                            );
                        } else if (outerItem.Type == '1') {
                            this.props.dispatch(
                                NavigationActions.navigate({
                                    routeName: 'CusWebView',
                                    params: { CusUrl: formUrl, title: SentencedToEmpty(outerItem, ['Abbreviation'], {}), currentItem, reloadList: () => { } }
                                })
                            );
                        }
                    }}
                >
                    <View style={[{ width: SCREEN_WIDTH - 57, backgroundColor: '#fff', borderRadius: 2 }]}>
                        <View style={[{ width: SCREEN_WIDTH - 57, height: 60, borderBottomColor: '#f2f2f2', borderBottomWidth: 1, justifyContent: 'center', paddingHorizontal: 15 }]}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                <SDLText fontType={'normal'} style={[{ color: '#333', lineHeight: 20 }]}>
                                    {SentencedToEmpty(outerItem, ['CreateUser'], '----')}
                                </SDLText>
                                {SentencedToEmpty(outerItem, ['CertificateInfos'], []).map(item => {
                                    return (
                                        <Image
                                            style={{ width: 18, height: 12, marginLeft: 3 }}
                                            source={
                                                item.CertificateType == 240
                                                    ? item.IsExpired == true
                                                        ? require('../../images/ic_certificate_flue_gas_Invalid.png')
                                                        : require('../../images/ic_certificate_flue_gas_valid.png')
                                                    : item.CertificateType == 242
                                                        ? item.IsExpired == true
                                                            ? require('../../images/ic_certificate_voc_Invalid.png')
                                                            : require('../../images/ic_certificate_voc_valid.png')
                                                        : item.CertificateType == 241
                                                            ? item.IsExpired == true
                                                                ? require('../../images/ic_certificate_waste_water_Invalid.png')
                                                                : require('../../images/ic_certificate_waste_water_valid.png')
                                                            : null
                                            }
                                        />
                                    );
                                })}
                                <SDLText fontType={'small'} style={[{ color: '#4aa2ff', backgroundColor: transformColorToTransparency('#4aa2ff'), paddingHorizontal: 8, marginLeft: 10, lineHeight: 20 }]}>
                                    {this.getTypeAbbreviation(SentencedToEmpty(outerItem, ['TypeID'], -1))}
                                </SDLText>
                            </View>
                            <SDLText fontType={'small'} style={[{ marginTop: 5, color: '#666' }]}>
                                {SentencedToEmpty(outerItem, ['CreateTime'], 0)}
                            </SDLText>
                        </View>
                        <View style={[{ paddingBottom: 6 }]}>
                            <View key={'' + outerIndex} style={[{ height: 33, width: SCREEN_WIDTH - 57, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }]}>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <Image source={require('../../images/ic_lian.png')} style={[{ height: 11, width: 7, marginRight: 2 }]} />
                                    <SDLText fontType={'normal'}>{`${SentencedToEmpty(outerItem, ['Abbreviation'], '')}`}</SDLText>
                                </View>
                                <Image source={require('../../images/ic_arrows_right.png')} style={[{ height: 11, width: 11 }]} />
                            </View>
                        </View>
                    </View>
                </Touchable>
            );
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[{ width: SCREEN_WIDTH, height: 45, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff' }]}>
                    <SimplePickerRangeDay option={this.getRangeDaySelectOption()} />
                    <SimplePicker style={[{ width: 120 }]} ref={ref => (this.operationLogsTypePicker = ref)} option={this.getOperationLogsTypeSelectOption()} />
                </View>
                <StatusPage
                    status={this.props.operationLogsListResult.status}
                    //页面是否有回调按钮，如果不传，没有按钮，
                    emptyBtnText={'重新请求'}
                    errorBtnText={'点击重试'}
                    onEmptyPress={() => {
                        //空页面按钮回调
                        console.log('重新刷新');
                        this.statusPageOnRefresh();
                    }}
                    onErrorPress={() => {
                        //错误页面按钮回调
                        console.log('错误操作回调');
                        this.statusPageOnRefresh();
                    }}
                >
                    <View style={styles.container}>
                        <FlatListWithHeaderAndFooter
                            ref={ref => (this.list = ref)}
                            ItemSeparatorComponent={() => {
                                return <View style={[{ height: 0 }]} />;
                            }}
                            pageSize={20}
                            hasMore={() => {
                                return this.props.operationLogsListData.length < this.props.alarmRecordsTotal;
                            }}
                            onRefresh={index => {
                                this.onRefresh(index);
                            }}
                            onEndReached={index => {
                                this.props.dispatch(createAction('pointDetails/updateState')({ operationLogsIndex: index }));
                                this.props.dispatch(createAction('pointDetails/getOperationLogs')({ setListData: this.list.setListData, setDataArr: this.setDataArr }));
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={[{ width: SCREEN_WIDTH, flexDirection: 'row', backgroundColor: '#f2f2f2' }]}>
                                        <View style={[{ width: 40, height: this.getItemHeight(index, item) }]}>
                                            <View style={[{ width: 14, height: this.getItemHeight(index, item), marginLeft: 18, alignItems: 'center' }]}>
                                                <View style={[{ flex: 1, width: 1, backgroundColor: index == 0 ? '#f2f2f2' : '#999' }]} />
                                                <View
                                                    style={[
                                                        {
                                                            height: 14,
                                                            width: 14,
                                                            borderRadius: 7,
                                                            backgroundColor: SentencedToEmpty(item, ['TypeID'], 0) == 0 || SentencedToEmpty(item, ['MainFormID']) == '' ? '#ff5b5c' : '#49a1fe',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }
                                                    ]}
                                                >
                                                    <View style={[{ height: 6, width: 6, borderRadius: 3, backgroundColor: '#fff' }]} />
                                                </View>
                                                <View style={[{ flex: 1, width: 1, backgroundColor: this.props.operationLogsListData.length == 1 || index == this.props.operationLogsListData.length - 1 ? '#f2f2f2' : '#999' }]} />
                                            </View>
                                        </View>
                                        <View style={[{ width: SCREEN_WIDTH - 57 }]}>
                                            <View style={[{ height: index == 0 ? 40 : 20 }]} />
                                            {this.renderItemContent(item, index)}
                                            <View style={[{ height: 20 }]} />
                                        </View>
                                    </View>
                                );
                            }}
                            data={this.props.operationLogsListData}
                        />
                    </View>
                </StatusPage>
            </View>
        );
    }
}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});
