import {
    Text, View
    , Image, ScrollView
    , TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import React, { Component } from 'react'
import { CloseToast, NavigationActions, SentencedToEmpty, ShowLoadingToast, ShowToast, createAction, createNavigationOptions } from '../../../utils';
import { Platform } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import moment from 'moment';

import { SCREEN_WIDTH } from '../../../config/globalsize';
import ImageGrid from '../../../components/form/images/ImageGrid';
import { } from 'react-native';
import { connect } from 'react-redux';
import { getEncryptData } from '../../../dvapack/storage';
import { ImageUrlPrefix } from '../../../config';
import { Modal } from 'react-native';
import Mask from '../../../components/Mask';
import globalcolor from '../../../config/globalcolor';

@connect(({ }) => ({

}))
export default class EquipmentInstallationPicAuditEditor extends Component {

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return createNavigationOptions({
            title: SentencedToEmpty(navigation
                , ['state', 'params', 'data', 'PointName'],
                '安装照片不合格'),
            headerTitleStyle: { marginRight: Platform.OS === 'android' ? 76 : 0 }
        });
    };

    constructor(props) {
        super(props);
        const data = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'data'], {});
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
            currentPage: -1
        };
        this.props.navigation.setOptions({
            title: SentencedToEmpty(this.props.route
                , ['params', 'params', 'data', 'PointName'],
                '安装照片不合格'),
        });
        this.lastSignInTime = new Date().getTime();
    }

    isEdit = () => {
        return true;
    }

    getAuditTime = () => {
        let AuditTime = SentencedToEmpty(this.props
            , ['route', 'params', 'params', 'data', 'AuditTime'], '');
        if (AuditTime == '') {
            return '';
        } else {
            let AuditTimeMoment = moment(AuditTime);
            if (AuditTimeMoment.isValid()) {
                return AuditTimeMoment.format('YYYY-MM-DD');
            } else {
                return '';
            }
        }
    }

    render() {
        // const data = SentencedToEmpty(this.props
        //     , ['navigation', 'state', 'params', 'data'], {});
        const data = SentencedToEmpty(this.state
            , ['data'], {});
        console.log('data = ', data);
        const AuditImages = SentencedToEmpty(data, ['AuditFilesList', 'ImgNameList'], []);
        let Images = [];
        if (AuditImages.length > 3) {
            Images.push(AuditImages[0]);
            Images.push(AuditImages[1]);
            Images.push(AuditImages[2]);
        } else {
            Images = AuditImages;
        }
        const ProxyCode = getEncryptData();
        return (
            <View
                style={[{
                    width: SCREEN_WIDTH, flex: 1
                }]}
            >
                <View
                    style={[{
                        width: SCREEN_WIDTH, maxHeight: 180
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
                        >{`不合格原因：${SentencedToEmpty(data, ['UnqualifiedReason'], '----')
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
                                console.log(`${ImageUrlPrefix}${ProxyCode}/${item}`);
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
                                    console.log('AuditImages = ', AuditImages);
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
                                        source={require('../../../images/ic_anzhuangzhaopianzhenggai_more.png')}
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
                        >{`审核人:${SentencedToEmpty(data, ['AuditUserUserName'], '--')}`}</Text>
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
                        height: 38, width: SCREEN_WIDTH
                    }]}
                />
                <ScrollView
                    style={[{ width: SCREEN_WIDTH }]}
                >
                    {
                        SentencedToEmpty(data, ['ChildList'], []).map(
                            (sitem, index) => {
                                return (<TouchableOpacity
                                    onPress={() => {
                                        console.log('sitem = ', sitem);
                                        let newItem = { ...sitem };
                                        newItem.InstallationPhotoList = SentencedToEmpty(newItem, ['InstallationPhoto'], []);
                                        newItem.InstallationPhoto = SentencedToEmpty(newItem, ['InstallationPhoto', 'AttachID'], '');
                                        this.props.dispatch(
                                            NavigationActions.navigate({
                                                routeName: 'EquipmentInstallationPicItemEditor',
                                                params: {
                                                    title: sitem.InstallationItemsName,
                                                    // item: sitem,
                                                    origin: 'audit',
                                                    item: newItem,
                                                    callback: changeI => {
                                                        console.log('changeI = ', changeI);
                                                        let newStates = { ...this.state.data };
                                                        console.log(' 原 item = ', newStates['ChildList'][index]);
                                                        newStates['ChildList'][index]['InstallationPhoto'] = changeI['InstallationPhotoList'];
                                                        newStates['ChildList'][index]['uploadStatus'] = changeI['uploadStatus'];
                                                        newStates['ChildList'][index]['Remark'] = changeI['Remark'];
                                                        // console.log('newStates= ', newStates);
                                                        this.setState({ data: newStates });
                                                    },
                                                    deleteCallback: changeI => {
                                                        console.log('deleteCallback changeI = ', changeI);
                                                        changeI.InstallationPhotoList.AttachID = changeI.InstallationPhoto;
                                                        let newStates = { ...this.state.data };
                                                        console.log(' deleteCallback 原 item = ', newStates['ChildList'][index]);
                                                        newStates['ChildList'][index]['InstallationPhoto'] = changeI['InstallationPhotoList'];
                                                        newStates['ChildList'][index]['uploadStatus'] = changeI['uploadStatus'];
                                                        newStates['ChildList'][index]['Remark'] = changeI['Remark'];
                                                        console.log('newStates= ', newStates);
                                                        this.setState({ data: newStates });
                                                    }
                                                }
                                            })
                                        );
                                        // this.props.dispatch(
                                        //     NavigationActions.navigate({
                                        //         routeName: 'EquipmentInstallationPicItemEditor',
                                        //         params: {
                                        //             title: sitem.InstallationItemsName,
                                        //             item: sitem,
                                        //             callback: changeI => {
                                        //                 let newStates = [].concat(this.state.stateDatas);
                                        //                 newStates[index]['ImageArray'][sindex] = changeI;
                                        //                 console.log('newStates= ', newStates);
                                        //                 this.setState({ stateDatas: newStates });
                                        //             }
                                        //         }
                                        //     })
                                        // );
                                    }}
                                >
                                    <View
                                        style={[
                                            {
                                                height: 45,
                                                width: SCREEN_WIDTH,
                                                paddingHorizontal: 19,
                                                justifyContent: 'center'
                                                , backgroundColor: '#fff'
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                {
                                                    width: SCREEN_WIDTH - 38,
                                                    height: 44,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: 14,
                                                        color: '#333333'
                                                    }
                                                ]}
                                            >{`${sitem.InstallationItemsName}`}</Text>
                                            <Text
                                                style={[
                                                    {
                                                        fontSize: 14,
                                                        color: sitem.uploadStatus == 1 ? '#3591F8' : '#333333'
                                                    }
                                                ]}
                                            >{`${sitem.uploadStatus == 1 ? '已上传' : sitem.uploadStatus == 2 ? '待上传' : '未上传'}`}</Text>
                                        </View>
                                        {index == 7 ? null : (
                                            <View
                                                style={[
                                                    {
                                                        width: SCREEN_WIDTH - 38,
                                                        height: 1,
                                                        backgroundColor: '#EAEAEA'
                                                    }
                                                ]}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>);
                            })
                    }
                </ScrollView>

                <View style={[{ flex: 1 }]} />
                {
                    (this.state.data.Status == 1 // 待整改
                    )
                        ? (<View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'space-around', flexDirection: 'row'
                                , alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    const data = this.state.data;
                                    // let imageEmptyIndex = -1
                                    //     , imageEmptyTitle = ''
                                    //     , imageList = [];
                                    // SentencedToEmpty(data, ['ChildList'], [])
                                    //     .map((item, index) => {
                                    //         // 没有发现错误则整理数据
                                    //         if (imageEmptyIndex == -1) {
                                    //             imageList = SentencedToEmpty(item
                                    //                 , ['InstallationPhoto', 'ImgList'], []);
                                    //             // 图片为必传字段
                                    //             if (imageList.length == 0) {
                                    //                 console.log(`第${index}项 = `, imageList);
                                    //                 console.log(`第${index}项 = `, item);
                                    //                 imageEmptyIndex = index + 1;
                                    //                 imageEmptyTitle = item.InstallationItemsName;
                                    //             }
                                    //         }
                                    //     });
                                    // if (imageEmptyIndex == -1) {
                                    /**
                                     *  "systemModel": data.SystemModel, //系统型号id  列表里有
                                        "pointId": data.PointId, //监测点id 列表里有
                                        "mainId": data.DispatchId, //派单id 列表有 DispatchId
                                        "equipmentAuditId": data.EquipmentAuditId, //审核表id 列表有
                                        "projectCode": data.ProjectCode, //项目号 列表有
                                        "entName": data.EntName, //企业名称 列表有
                                        "pointName": data.PointName, //监测点名称 列表有
                                     */
                                    let a = {
                                        "equipmentAuditId": data.EquipmentAuditId, // 审核表id 列表有
                                        "opinion": "string", // 申诉描述
                                        "appealFiles": "string", // 申诉图片
                                        "projectCode": data.ProjectCode, // 项目号 列表有
                                        "entName": data.EntName, // 企业名称  列表有
                                        "pointName": data.PointName  // 监测点名称 列表有
                                    };
                                    this.props.dispatch(NavigationActions.navigate({
                                        routeName: 'EquipmentAuditRectificationAppeal',
                                        params: {
                                            data
                                        }
                                    }));

                                    // } else {
                                    //     CloseToast();
                                    //     ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitle}未上传图片`);
                                    // }
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
                                    ShowLoadingToast('正在提交');
                                    const data = this.state.data;
                                    let cList = [];
                                    let imageEmptyIndex = -1
                                        , imageEmptyTitle = ''
                                        , imageList = []
                                        , allEmpty = true;
                                    SentencedToEmpty(data, ['ChildList'], [])
                                        .map((item, index) => {
                                            imageList = SentencedToEmpty(item
                                                , ['InstallationPhoto', 'ImgList'], []);
                                            if (imageList.length != 0) {
                                                allEmpty = false;
                                            }
                                            // 没有发现错误则整理数据
                                            // if (imageEmptyIndex == -1) {
                                            //     imageList = SentencedToEmpty(item
                                            //         , ['InstallationPhoto', 'ImgList'], []);
                                            //     // 图片为必传字段
                                            //     if (imageList.length == 0) {
                                            //         console.log(`第${index}项 = `, imageList);
                                            //         console.log(`第${index}项 = `, item);
                                            //         imageEmptyIndex = index + 1;
                                            //         imageEmptyTitle = item.InstallationItemsName;
                                            //     } else {
                                            cList.push({
                                                // "id": "string",
                                                "mainId": data.DispatchId, // 有
                                                "pointId": data.PointId, // 有
                                                "col1": data.SystemModel, // SystemModel
                                                "installationItems": SentencedToEmpty(item, ['InstallationItems'], ''),// 有
                                                "installationPhoto": SentencedToEmpty(item, ['InstallationPhoto', 'AttachID'], ''),//  uuid
                                                "remark": SentencedToEmpty(item, ['Remark'], ''), // 有
                                            });
                                            //     }
                                            // }
                                        });
                                    // if (imageEmptyIndex == -1) {
                                    if (allEmpty) {
                                        ShowToast('您至少要上传一张照片！');
                                    } else {
                                        let submitParams = {
                                            "systemModel": data.SystemModel, //系统型号id  列表里有
                                            "pointId": data.PointId, //监测点id 列表里有
                                            "mainId": data.DispatchId, //派单id 列表有 DispatchId
                                            "equipmentAuditId": data.EquipmentAuditId, //审核表id 列表有
                                            "projectCode": data.ProjectCode, //项目号 列表有
                                            "entName": data.EntName, //企业名称 列表有
                                            "pointName": data.PointName, //监测点名称 列表有
                                            "cList": cList
                                            // "cList": [//这个原来表单的实体
                                            //     {
                                            //         "id": "string",
                                            //         "mainId": "string", // 有
                                            //         "pointId": "string", // 有
                                            //         "createUser": "string",
                                            //         "createTime": "2024-03-28T05:53:24.095Z",
                                            //         "updateUser": "string",
                                            //         "updateTime": "2024-03-28T05:53:24.095Z",
                                            //         "col1": "string", // SystemModel
                                            //         "col2": "string",
                                            //         "serviceId": "string",
                                            //         "recordId": "string",
                                            //         "installationItems": "string",// 有
                                            //         "installationPhoto": "string",//  uuid
                                            //         "remark": "string" // 有
                                            //     }
                                            // ]
                                        };
                                        // console.log('submitParams = ', submitParams);
                                        // 提交
                                        this.props.dispatch(createAction('CTEquipmentPicAuditModel/equipmentAuditRectificationSubmit')({
                                            params: submitParams
                                        }));
                                    }
                                    // } else {
                                    //     CloseToast();
                                    //     ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitle}未上传图片`);
                                    // }

                                }
                                }
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
                    (this.state.data.Status == 2 // 已整改
                    )
                        ? <View
                            style={[{
                                width: SCREEN_WIDTH, height: 75
                                , justifyContent: 'space-around', flexDirection: 'row'
                                , alignItems: 'center'
                            }]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    let currentSignInTime = new Date().getTime();
                                    let sub = currentSignInTime - this.lastSignInTime;
                                    this.lastSignInTime = currentSignInTime;
                                    if (sub < 2000) {
                                        return;
                                    }
                                    ShowLoadingToast('正在提交');
                                    const data = this.state.data;
                                    console.log('data = ', data);
                                    let cList = [];
                                    let imageEmptyIndex = -1
                                        , imageEmptyTitle = ''
                                        , imageList = []
                                        , allEmpty = true;
                                    SentencedToEmpty(data, ['ChildList'], [])
                                        .map((item, index) => {
                                            // 没有发现错误则整理数据
                                            if (imageEmptyIndex == -1) {
                                                imageList = SentencedToEmpty(item
                                                    , ['InstallationPhoto', 'ImgList'], []);
                                                // 图片为必传字段
                                                if (imageList.length != 0) {
                                                    allEmpty = false;
                                                }
                                                // if (imageList.length == 0) {
                                                //     console.log(`第${index}项 = `, imageList);
                                                //     console.log(`第${index}项 = `, item);
                                                //     imageEmptyIndex = index + 1;
                                                //     imageEmptyTitle = item.InstallationItemsName;
                                                // } else {
                                                cList.push({
                                                    // "id": "string",
                                                    "mainId": data.DispatchId, // 有
                                                    "pointId": data.PointId, // 有
                                                    "col1": data.SystemModel, // SystemModel
                                                    "installationItems": SentencedToEmpty(item, ['InstallationItems'], ''),// 有
                                                    "installationPhoto": SentencedToEmpty(item, ['InstallationPhoto', 'AttachID'], ''),//  uuid
                                                    "remark": SentencedToEmpty(item, ['Remark'], ''), // 有
                                                });
                                                // }
                                            }

                                        });
                                    // if (imageEmptyIndex == -1) {
                                    if (allEmpty) {
                                        ShowToast('您至少要上传一张照片！');
                                    } else {
                                        let submitParams = {
                                            "systemModel": data.SystemModel, //系统型号id  列表里有
                                            "pointId": data.PointId, //监测点id 列表里有
                                            "mainId": data.DispatchId, //派单id 列表有 DispatchId
                                            "equipmentAuditId": data.EquipmentAuditId, //审核表id 列表有
                                            "projectCode": data.ProjectCode, //项目号 列表有
                                            "entName": data.EntName, //企业名称 列表有
                                            "pointName": data.PointName, //监测点名称 列表有
                                            "cList": cList
                                            // "cList": [//这个原来表单的实体
                                            //     {
                                            //         "id": "string",
                                            //         "mainId": "string", // 有
                                            //         "pointId": "string", // 有
                                            //         "createUser": "string",
                                            //         "createTime": "2024-03-28T05:53:24.095Z",
                                            //         "updateUser": "string",
                                            //         "updateTime": "2024-03-28T05:53:24.095Z",
                                            //         "col1": "string", // SystemModel
                                            //         "col2": "string",
                                            //         "serviceId": "string",
                                            //         "recordId": "string",
                                            //         "installationItems": "string",// 有
                                            //         "installationPhoto": "string",//  uuid
                                            //         "remark": "string" // 有
                                            //     }
                                            // ]
                                        };
                                        console.log('submitParams = ', submitParams);
                                        // 提交
                                        this.props.dispatch(createAction('CTEquipmentPicAuditModel/equipmentAuditRectificationSubmit')({
                                            params: submitParams
                                        }));
                                    }
                                    // } else {
                                    //     CloseToast();
                                    //     ShowToast(`请检查条目${imageEmptyIndex}的${imageEmptyTitle}未上传图片`);
                                    // }

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
                                        SentencedToEmpty(data, ['UnqualifiedReason'], '----')
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
                                        source={require('../../../images/ic_dialog_close.png')}
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
                        imageUrls={this.state.showImageList}
                        index={this.state.currentPage}
                    />
                </Modal>
            </View >
        )
    }
}