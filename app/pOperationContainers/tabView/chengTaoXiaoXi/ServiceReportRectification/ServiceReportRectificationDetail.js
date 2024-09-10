import {
    Text, View
    , Image, ScrollView
    , TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import React, { Component } from 'react'
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../../utils';
import { Platform } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

import { SCREEN_WIDTH } from '../../../../config/globalsize';
import ImageGrid from '../../../../components/form/images/ImageGrid';
import { } from 'react-native';
import { connect } from 'react-redux';
import { getEncryptData } from '../../../../dvapack/storage';
import { ImageUrlPrefix } from '../../../../config';
import { Modal } from 'react-native';
import Mask from '../../../../components/Mask';
import globalcolor from '../../../../config/globalcolor';
import { AlertDialog, StatusPage } from '../../../../components';

@connect(({ CTModel, CTServiceReportRectificationModel }) => ({
    chengTaoTaskDetailData: CTModel.chengTaoTaskDetailData,
    serviceDispatchTypeAndRecordResult: CTModel.serviceDispatchTypeAndRecordResult,
    serviceDescResult: CTServiceReportRectificationModel.serviceDescResult,
    firstLevelSelectedIndex: CTServiceReportRectificationModel.firstLevelSelectedIndex,
    editData: CTServiceReportRectificationModel.editData,
}))
export default class ServiceReportRectificationDetail extends Component {

    /**
     * 
     * @param {*} param0 
     * @returns 
     */

    static navigationOptions = ({ navigation }) => {
        return createNavigationOptions({
            title: SentencedToEmpty(navigation
                , ['state', 'params', 'data', 'Num'],
                '验收服务报告整改'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        const data = SentencedToEmpty(this.props
            , ['navigation', 'state', 'params', 'data'], {});
        let ImgNameList = SentencedToEmpty(data
            , ['AuditFilesList', 'ImgNameList'], []);
        let showImageList = [];
        ImgNameList.map((item, index) => {
            showImageList.push({
                name: item,
                url: `${ImageUrlPrefix}${getEncryptData()}/${item}`
            })
        });
        this.state = {
            data,
            showReasonView: false
            , imagelist: SentencedToEmpty(data
                , ['AuditFilesList', 'ImgNameList'], []),
            showImageList: showImageList,
            showImageView: false,
            currentPage: -1,

            contentHeight: 0, // 双滚动组件的高度

            // firstLevelSelectedIndex: 0,
        };
    }

    isEdit = () => {
        return true;
    }

    getAuditTime = () => {
        let AuditTime = SentencedToEmpty(this.props
            , ['navigation', 'state', 'params', 'data', 'AuditDate'], '');
        return AuditTime;
    }

    /**
     * 调整界面高度
     */
    scrollViewLayout = event => {
        if (Platform.OS === 'ios') {
            // this.setState({ contentHeight: SCREEN_HEIGHT - 64 });
            this.setState({ contentHeight: event.nativeEvent.layout.height });
        } else if (this.state.contentHeight == 0) {
            this.setState({ contentHeight: event.nativeEvent.layout.height });
        }
    };

    getImage = item => {
        switch (item.RecordId) {
            case '9':
                // "验收服务报告" ic_ct_acceptance_report.png
                return require('../../../../images/ic_ct_acceptance_report.png');
            case '10':
                // 现场勘查信息
                return require('../../../../images/ic_ct_survey_information.png');
            case '11':
                // 工作记录"
                return require('../../../../images/ic_ct_work_record.png');
            case '12':
                // 验货单
                return require('../../../../images/ic_ct_inspection_sheet.png');
            case '13':
                // 静态调试 项目交接单
                return require('../../../../images/ic_ct_survey_information.png');
            case '14':
                // 安装报告
                return require('../../../../images/ic_ct_inspection_sheet.png');
            case '17':
                // 安装照片
                return require('../../../../images/ic_ct_72_hour_commissioning.png');
            case '18':
                // 参数照片
                return require('../../../../images/ic_ct_params_photo.png');
            case '19':
                // 72小时调试检测
                return require('../../../../images/ic_ct_72_hour_commissioning.png');
            case '20':
                // 参数设置照片
                return require('../../../../images/ic_ct_params_photo.png');
            case '21':
                // 数据一致性
                return require('../../../../images/ic_ct_data_consistency.png');
            case '22':
                // 比对监测报告
                return require('../../../../images/ic_ct_inspection_sheet.png');
            case '23':
                // 验收资料
                return require('../../../../images/ic_ct_inspection_sheet.png');
            case '24':
                // 第三方检查汇报
                return require('../../../../images/ic_ct_inspection_sheet.png');
            case '25':
                // 维修记录
                return require('../../../../images/ic_ct_inspection_sheet.png');
            default:
                return require('../../../../images/ic_ct_inspection_sheet.png');
        }
    };

    secondItemClick = (secondItem) => {
        // const firstItem = SentencedToEmpty(this.props
        //     , [
        //         'serviceDescResult', 'data', 'Datas'
        //         , 'ReportDesc', this.props.firstLevelSelectedIndex
        //     ], {});
        const firstItem = SentencedToEmpty(this.props
            , [
                'editData', this.props.firstLevelSelectedIndex
            ], {});
        console.log('serviceDescResult = ', this.props.serviceDescResult);
        console.log('editData = ', this.props.editData);
        var str = JSON.stringify(this.props.editData);
        console.log(str);
        const firstItem_ItemId = SentencedToEmpty(firstItem
            , [
                'ServiceId'
            ], '');
        // 1 前期勘查   2 设备验货  13 培训      14 其它
        if (
            firstItem_ItemId == 1 ||
            firstItem_ItemId == 2 ||
            firstItem_ItemId == 13 ||
            firstItem_ItemId == 14
            // || firstItem_ItemId == 3  // 3 指导安装
        ) {
            // 单条记录
            this.props.dispatch(
                NavigationActions.navigate({
                    routeName: 'ServiceReportRectificationEditor',
                    params: {
                        title: '验收服务报告',
                        item: SentencedToEmpty(firstItem, ['ServiceList', 0], {}),
                        callback: changeI => {
                        }
                    }
                })
            );
        } else {
            // 多条记录
            const ProjectId = SentencedToEmpty(this.props
                , [
                    'serviceDescResult', 'data', 'Datas'
                    , 'CheckDesc', 'ProjectId'
                ], {});
            let newData = [].concat(SentencedToEmpty(firstItem, ['ServiceList'], []));
            let imageArr = [], imageObject = {}
                , imageObjectArr = [];
            newData.map((item, index) => {
                // 'FileList', 'ImgNameList'
                imageObjectArr = [];
                imageArr = SentencedToEmpty(item, ['FileList', 'ImgNameList'], []);
                imageArr.map((innerItem, innerIndex) => {
                    imageObject = {
                        AttachID: innerItem,
                    };
                    imageObjectArr.push(imageObject);
                })
                // item.FileList.imageObjectArr = imageObjectArr;
                item.ImageObjectList = imageObjectArr;
            })

            this.props.dispatch(createAction('CTModel/updateState')({
                projectEntPointSysModelResult: { status: -1 }
            }));
            this.props.dispatch(
                NavigationActions.navigate({
                    routeName: 'ServiceReportRectificationMultipleEditor',
                    params: {
                        title: '验收服务报告',
                        ProjectId,
                        item: newData,
                        callback: changeI => {

                        }
                    }
                })
            );
        }
    }

    getPageStatus = () => {
        return SentencedToEmpty(this.props
            , ['serviceDescResult', 'status'], 1000);
    }

    onRefreshWithLoading = () => {
        const item = SentencedToEmpty(this.props, ['navigation', 'state', 'params', 'data'], {});
        this.props.dispatch(createAction('CTServiceReportRectificationModel/getServiceDesc')({
            params: {
                ID: item.ID
            }
        }));
    }

    cancelButton = () => { }
    confirm = () => {
        const ID = SentencedToEmpty(this.props
            , ['navigation', 'state'
                , 'params', 'data', 'ID'], '')
        const CheckStatus = SentencedToEmpty(this.props
            , ['navigation', 'state'
                , 'params', 'data', 'CheckStatus'], '')
        if (ID == '' || CheckStatus == '') {
            ShowToast('数据错误');
        } else {
            // 2 不合格 4 已提交 5 申诉中
            this.props.dispatch(
                createAction('CTServiceReportRectificationModel/auditService')({
                    params: {
                        ID,
                        CheckStatus,
                        auditStatus: 4
                    },
                    callback: () => {
                        this.props.dispatch(NavigationActions.back());
                        // 初始化列表索引 刷新列表数据
                        this.props.dispatch(
                            createAction('CTServiceReportRectificationModel/updateState')({
                                tabSelectedIndex: 1
                            })
                        );
                        // 2 不合格 4 已提交 5 申诉中
                        this.props.dispatch(
                            createAction('CTServiceReportRectificationModel/getStayCheckServices')({}));
                        this.props.dispatch(
                            createAction('CTServiceReportRectificationModel/GetServiceStatusNum')({}));
                    }
                }));
        }
    }

    renderDialog = () => {
        return (< AlertDialog options={{
            headTitle: '提示',
            messText: '确定要提交整改报告吗？',
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
        }} ref="commitAlert" />)
    }

    render() {
        const ProxyCode = getEncryptData();
        const data = SentencedToEmpty(this.props
            , ['serviceDescResult', 'data', 'Datas', 'CheckDesc'], {});
        const listItem = SentencedToEmpty(this.props,
            ['navigation', 'state', 'params', 'data'], {});
        console.log('listItem = ', listItem);
        const AuditImages = SentencedToEmpty(data, ['FileList', 'ImgNameList'], []);
        let Images = [];
        if (AuditImages.length > 3) {
            Images.push(AuditImages[0]);
            Images.push(AuditImages[1]);
            Images.push(AuditImages[2]);
        } else {
            Images = AuditImages;
        }
        let showImageList = [];
        AuditImages.map((item, index) => {
            showImageList.push({
                name: item,
                url: `${ImageUrlPrefix}${getEncryptData()}/${item}`
            })
        });

        const TaskStatus = SentencedToEmpty(this.props, ['chengTaoTaskDetailData', 'TaskStatus'], -1);
        return (<StatusPage
            status={this.getPageStatus()}
            errorText={SentencedToEmpty(this.props, ['errorMsg'], '服务器加载错误')}
            errorTextStyle={{ width: SCREEN_WIDTH - 100, lineHeight: 20, textAlign: 'center' }}
            //页面是否有回调按钮，如果不传，没有按钮，
            emptyBtnText={'重新请求'}
            errorBtnText={'点击重试'}
            onEmptyPress={() => {
                //空页面按钮回调
                // this.onRefreshWithLoading();
            }}
            onErrorPress={() => {
                //错误页面按钮回调
                // this.onRefreshWithLoading();
            }}
        >
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, maxHeight: 150
                        , backgroundColor: 'white'
                        , paddingHorizontal: 20
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                showReasonView: true
                            })
                        }}
                    >
                        <Text
                            numberOfLines={3}
                            style={[{
                                fontSize: 15, color: '#333333'
                                , marginTop: 12, width: SCREEN_WIDTH - 40
                                , lineHeight: 19
                            }]}
                        >{`不合格原因：${SentencedToEmpty(data, ['Opinion'], '----')
                            }`}</Text>
                    </TouchableOpacity>

                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: 15, color: '#333333'
                            , marginTop: 2, width: SCREEN_WIDTH - 40
                            , marginBottom: 4
                        }]}
                    >{`附件：`}</Text>
                    {Images.length > 0 ? <View
                        style={[{
                            width: SCREEN_WIDTH - 40, flexDirection: 'row'
                            , height: (SCREEN_WIDTH - 40) / 4 - 10
                            , marginBottom: 8
                        }]}
                    >
                        {
                            Images.map((item, key) => {
                                // console.log(`${ImageUrlPrefix}${ProxyCode}/${item}`);
                                return (<TouchableOpacity
                                    style={[{
                                        marginRight: 13
                                    }]}
                                    onPress={() => {
                                        let arr = this.state.selectImages;
                                        this.setState({
                                            showImageView: true
                                            , currentPage: key
                                        });
                                    }}
                                >
                                    <Image
                                        style={[{
                                            height: (SCREEN_WIDTH - 40) / 4 - 10
                                            , width: (SCREEN_WIDTH - 40) / 4 - 10
                                        }]}
                                        source={{ uri: `${ImageUrlPrefix}${ProxyCode}/${item}` }}
                                    />
                                </TouchableOpacity>);
                            })
                        }
                        {AuditImages.length > 3
                            ? <TouchableOpacity
                                onPress={() => {
                                    let newData = [];
                                    AuditImages.map(item => {
                                        newData.push({
                                            uri: `${ImageUrlPrefix}${ProxyCode}/${item}`
                                            , url: `${ImageUrlPrefix}${ProxyCode}/${item}`
                                        })
                                    })
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'EquipmentInstallationMorePic',
                                        params: {
                                            AuditImages: newData,
                                        }
                                    }));
                                }}
                            >
                                <View
                                    style={[{
                                        height: (SCREEN_WIDTH - 40) / 4 - 10
                                        , width: (SCREEN_WIDTH - 40) / 4 - 10
                                        , backgroundColor: '#F6F7FB'
                                        , borderRadius: 4
                                        , alignItems: 'center', justifyContent: 'center'
                                    }]}
                                >
                                    <Image
                                        style={[{
                                            height: 4, width: 19
                                        }]}
                                        source={require('../../../../images/ic_anzhuangzhaopianzhenggai_more.png')}
                                    />
                                </View>
                            </TouchableOpacity> : null}
                    </View> : null}
                    <View
                        style={[{
                            width: SCREEN_WIDTH - 40
                            , flexDirection: 'row', justifyContent: 'space-between'
                            , marginBottom: 8
                        }]}
                    >
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 15, color: '#333333'
                                , width: (SCREEN_WIDTH - 46) * 3 / 8
                            }]}
                        >{`审核人:${SentencedToEmpty(listItem, ['AuditUserName'], '--')}`}</Text>
                        <Text
                            numberOfLines={1}
                            style={[{
                                fontSize: 15, color: '#333333'
                                , width: (SCREEN_WIDTH - 46) / 2
                            }]}
                        >{`审核时间:${this.getAuditTime()}`}</Text>
                    </View>
                </View>
                <View
                    style={[{
                        height: 10, width: SCREEN_WIDTH
                    }]}
                />
                <View
                    onLayout={event => {
                        this.scrollViewLayout(event);
                    }}
                    style={[{
                        width: SCREEN_WIDTH, flex: 1
                        , flexDirection: 'row'
                        , backgroundColor: '#ffffff'
                    }]}>
                    <View
                        style={[
                            {
                                width: 133,
                                height: this.state.contentHeight
                            }
                        ]}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={[
                                {
                                    width: 133
                                }
                            ]}
                        >
                            {/* {SentencedToEmpty(this.props, ['serviceDescResult', 'data', 'Datas', 'ReportDesc'], []).map((item, index) => { */}
                            {SentencedToEmpty(this.props, ['editData'], []).map((item, index) => {
                                /**
                                 * 1	前期勘查
                                 * 2	设备验货
                                 * 3	指导安装
                                 * 4	静态调试
                                 * 5	动态投运
                                 * 6	168试运行
                                 * 7	72小时调试检测
                                 * 8	联网
                                 * 9	比对监测
                                 * 10	项目验收
                                 * 11	配合检查
                                 * 12	维修
                                 * 13	培训
                                 * 14	其它
                                 */
                                /**
                                 * 如果任务未完成，全部显示
                                 * 如果任务完成，只显示有内容的记录
                                 */
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.dispatch(createAction('CTServiceReportRectificationModel/updateState')({
                                                firstLevelSelectedIndex: index
                                            }));
                                        }}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: 133
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    {
                                                        width: 133,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 15,
                                                        marginBottom: 10
                                                    }
                                                ]}
                                            >
                                                {this.props.firstLevelSelectedIndex == index ? (
                                                    <View
                                                        style={[
                                                            {
                                                                width: 2,
                                                                height: 20,
                                                                backgroundColor: '#4DA9FF'
                                                            }
                                                        ]}
                                                    />
                                                ) : (
                                                    <View
                                                        style={[
                                                            {
                                                                width: 2,
                                                                height: 20
                                                            }
                                                        ]}
                                                    />
                                                )}
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        {
                                                            fontSize: 14,
                                                            color: this.props.firstLevelSelectedIndex == index ? '#333333' : '#666666',
                                                            flex: 1,
                                                            marginLeft: 20,
                                                            fontWeight: this.props.firstLevelSelectedIndex == index ? '700' : '400'
                                                        }
                                                    ]}
                                                >{`${SentencedToEmpty(item, ['ServiceName'], '----')}`}</Text>
                                                {SentencedToEmpty(item, ['ItemStatus'], 0) == 1 ? (
                                                    <Image style={[{ width: 12, height: 12, marginHorizontal: 4 }]} source={require('../../../../images/ic_green_check_mark.png')} />
                                                ) : (
                                                    <View style={[{ width: 12, height: 12, marginHorizontal: 4 }]} />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            <View style={{ height: 200, flex: 1 }}></View>
                        </ScrollView>
                    </View>
                    <View
                        style={[
                            {
                                width: 1,
                                backgroundColor: '#EAEAEA',
                                marginTop: 10,
                                height: this.state.contentHeight > 10 ? this.state.contentHeight - 10 : 0
                            }
                        ]}
                    />
                    <View
                        style={[
                            {
                                flex: 1,
                                height: this.state.contentHeight
                            }
                        ]}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={[
                                {
                                    width: SCREEN_WIDTH - 134,
                                    paddingVertical: 4
                                }
                            ]}
                        >
                            <View style={[{ width: SCREEN_WIDTH - 134, flexDirection: 'row', flexWrap: 'wrap' }]}>
                                <TouchableOpacity
                                    key={`${new Date().getTime()}1`}
                                    onPress={() => {
                                        this.secondItemClick();
                                    }}
                                >
                                    <View
                                        style={[
                                            {
                                                width: (SCREEN_WIDTH - 136) / 2,
                                                height: 82,
                                                alignItems: 'center'
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    flexDirection: 'row',
                                                    height: 35,
                                                    marginTop: 15,
                                                    marginBottom: 10
                                                }
                                            ]}
                                        >
                                            {/* {SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1 ? <View style={[{ width: 12, height: 12, marginRight: -6, marginTop: -6 }]} /> : null} */}
                                            <Image
                                                source={this.getImage({ RecordId: 9 })}
                                                style={[
                                                    {
                                                        width: 35,
                                                        height: 35
                                                    }
                                                ]}
                                            />
                                            {/* {SentencedToEmpty(secondItem, ['RecordStatus'], -1) == 1 ? (
                                                <Image style={[{ width: 12, height: 12, marginLeft: -6, marginTop: -6 }]} source={require('../../../../images/ic_green_check_mark.png')} />
                                            ) : null} */}
                                        </View>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                {
                                                    fontSize: 14,
                                                    color: '#666666',
                                                    lineHeight: 18
                                                }
                                            ]}
                                        >
                                            {`${'验收服务报告'}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {
                    (SentencedToEmpty(listItem, ['AuditStatus'], '') == 2)
                        ? (<View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'space-around', flexDirection: 'row'
                                , alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    const ID = SentencedToEmpty(this.props
                                        , ['navigation', 'state'
                                            , 'params', 'data', 'ID'], '')
                                    const CheckStatus = SentencedToEmpty(this.props
                                        , ['navigation', 'state'
                                            , 'params', 'data', 'CheckStatus'], '')
                                    if (ID == '' || CheckStatus == '') {
                                        ShowToast('数据错误');
                                    } else {
                                        // 2 不合格 4 已提交 5 申诉中
                                        // this.props.dispatch(
                                        //     createAction('CTServiceReportRectificationModel/auditService')({
                                        //         params: {
                                        //             ID,
                                        //             CheckStatus,
                                        //             auditStatus: 5
                                        //         }
                                        //     }));
                                        this.props.dispatch(NavigationActions.navigate({
                                            routeName: 'ServiceReportRectificationAppeal',
                                            params: {
                                                ID,
                                                CheckStatus,
                                                auditStatus: 5
                                            }
                                        }));
                                    }
                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 84) / 2, height: 45
                                        , justifyContent: 'center', alignItems: 'center'
                                        , backgroundColor: '#E6E6E6'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 17, color: '#666666'
                                        }]}
                                    >{'申诉'}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    // 提交
                                    this.refs.commitAlert.show();
                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 84) / 2, height: 45
                                        , justifyContent: 'center', alignItems: 'center'
                                        , backgroundColor: '#4AA0FF'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 17, color: '#FFFFFF'
                                        }]}
                                    >{'提交'}</Text>
                                </View>
                            </TouchableOpacity >
                        </View >)
                        : null
                }
                {
                    (false)
                        ? <View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'space-around', flexDirection: 'row'
                                , alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    ShowLoadingToast('正在提交');
                                    const data = this.state.data;
                                    let cList = [];
                                    let imageEmptyIndex = -1
                                        , imageEmptyTitle = ''
                                        , imageList = [];
                                    SentencedToEmpty(data, ['ChildList'], [])
                                        .map((item, index) => {
                                            // 没有发现错误则整理数据
                                            if (imageEmptyIndex == -1) {
                                                imageList = SentencedToEmpty(item
                                                    , ['InstallationPhoto', 'ImgList'], []);
                                                // 图片为必传字段
                                                if (imageList.length == 0) {
                                                    imageEmptyIndex = index + 1;
                                                    imageEmptyTitle = item.InstallationItemsName;
                                                } else {
                                                    cList.push({
                                                        // "id": "string",
                                                        "mainId": data.DispatchId, // 有
                                                        "pointId": data.PointId, // 有
                                                        "col1": data.SystemModel, // SystemModel
                                                        "installationItems": SentencedToEmpty(item, ['InstallationItems'], ''),// 有
                                                        "installationPhoto": SentencedToEmpty(item, ['InstallationPhoto', 'AttachID'], ''),//  uuid
                                                        "remark": SentencedToEmpty(item, ['Remark'], ''), // 有
                                                    });
                                                }
                                            }

                                        });
                                    if (imageEmptyIndex == -1) {
                                        let submitParams = {
                                            "systemModel": data.SystemModel, //系统型号id  列表里有
                                            "pointId": data.PointId, //监测点id 列表里有
                                            "mainId": data.DispatchId, //派单id 列表有 DispatchId
                                            "equipmentAuditId": data.EquipmentAuditId, //审核表id 列表有
                                            "projectCode": data.ProjectCode, //项目号 列表有
                                            "entName": data.EntName, //企业名称 列表有
                                            "pointName": data.PointName, //监测点名称 列表有
                                            "cList": cList
                                        };
                                        // 提交
                                        this.props.dispatch(createAction('CTEquipmentPicAuditModel/equipmentAuditRectificationSubmit')({
                                            params: submitParams
                                        }));
                                    } else {
                                        CloseToast();
                                        ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitle}未上传图片`);
                                    }

                                }}
                            >
                                <View
                                    style={[{
                                        width: (SCREEN_WIDTH - 40), height: 45
                                        , justifyContent: 'center', alignItems: 'center'
                                        , backgroundColor: '#4AA0FF'
                                    }]}
                                >
                                    <Text
                                        style={[{
                                            fontSize: 17, color: '#FFFFFF'
                                        }]}
                                    >{'提交'}</Text>
                                </View>
                            </TouchableOpacity >
                        </View >
                        : null
                }
                <Modal visible={this.state.showReasonView} transparent={true} onRequestClose={() => this.setState({ showImageView: false })} enableSwipeDown={true}>
                    <Mask
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        hideDialog={() => {
                            this.setState({ showReasonView: false })
                        }}
                    >
                        <View
                            style={[{
                                width: SCREEN_WIDTH * 2 / 3
                                , height: 160
                                , backgroundColor: '#FFFFFF'
                                , alignItems: 'center'
                                , borderRadius: 5
                            }]}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH * 2 / 3, height: 45
                                    , alignItems: 'center'
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 15, color: '#333333'
                                        , marginTop: 18
                                    }]}
                                >{'不合格原因'}</Text>
                            </View>
                            <ScrollView
                                style={[{
                                    width: SCREEN_WIDTH * 2 / 3
                                    , marginBottom: 12
                                }]}
                            >
                                <Text
                                    style={[{
                                        fontSize: 12, color: '#666666'
                                        , width: SCREEN_WIDTH * 2 / 3 - 32
                                        , lineHeight: 19
                                        , marginLeft: 16
                                    }]}
                                >{
                                        SentencedToEmpty(data, ['Opinion'], '----')
                                    }</Text>
                            </ScrollView>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ showReasonView: false })
                                }}
                                style={[{
                                    position: 'absolute', top: -10, right: -10
                                }]}
                            >
                                <View
                                    style={[{
                                        width: 20, height: 20
                                        , justifyContent: 'center', alignItems: 'center'
                                    }]}
                                >
                                    <Image
                                        style={[{
                                            width: 15, height: 15
                                        }]}
                                        source={require('../../../../images/ic_dialog_close.png')}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Mask>
                </Modal>
                <Modal visible={this.state.showImageView} transparent={true} onRequestClose={() => this.setState({ showImageView: false })} enableSwipeDown={true}>
                    <ImageViewer
                        loadingRender={() => <ActivityIndicator color={globalcolor.backgroundGrey} size="large" />}
                        onClick={() => {
                            this.setState({ showImageView: false });
                        }}
                        ref="imageview"
                        saveToLocalByLongPress={false}
                        imageUrls={showImageList}
                        index={this.state.currentPage}
                    />
                </Modal>
                {
                    this.renderDialog()
                }
            </View >
        </StatusPage>
        )
    }
}