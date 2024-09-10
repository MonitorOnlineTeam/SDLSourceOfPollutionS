/*
 * @Description: 
 * @LastEditors: hxf
 * @Date: 2024-08-16 15:27:19
 * @LastEditTime: 2024-08-22 13:37:17
 * @FilePath: /SDLMainProject37/app/components/page/account/OfflineImageUploadList.js
 */
import { Platform, ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import {
    getOfflineImageList
} from 'react-native-offline-image-upload';
import { CloseToast, createAction, createNavigationOptions, SentencedToEmpty, ShowLoadingToast } from '../../../utils';
import { getToken } from '../../../dvapack/storage';
import { SCREEN_WIDTH } from '../../../config/globalsize';
import { connect } from 'react-redux';

@connect()
export default class OfflineImageUploadList extends Component {

    static navigationOptions = ({ navigation }) =>
        createNavigationOptions({
            title: SentencedToEmpty(navigation, ['state', 'params', 'title'], '离线图片上传'),
            headerTitleStyle: { flex: 1, textAlign: 'center', fontSize: 17, marginRight: Platform.OS === 'android' ? 76 : 0 } //标题居中
        });

    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        }
    }

    componentDidMount() {
        // this.statusPageOnRefresh();
        const user = getToken();
        getOfflineImageList({
            userAccount: user.UserAccount,
        }, (response) => {
            console.log(response);
            let imageInfo = []
                , _uuid = ''
                , imageGroup = null
                , dataList = [];
            response.map((item, index) => {
                if (_uuid == item.uuid) {
                    imageGroup.imageList.push(item);
                } else {
                    if (imageGroup) {
                        dataList.push(imageGroup);
                    }
                    _uuid = item.uuid;
                    imageGroup = {
                        uuid: item.uuid,
                        imageList: [item]
                    };
                }
            });
            dataList.push(imageGroup);
            console.log('dataList = ', dataList);
            this.setState({ dataList });
        })
    }

    getRecordType = (item) => {
        /**
         *  SIGN_IN_WATER_MASK  1
         *  TASK_WATER_MASK     2
         *  TASK_IMAGE          3
         *  TASK_FORM_IMAGE     4
         *  OTHER               5
         *  CT_SIGN_IN_WATER_MASK 6
         *  CT_SIGN_IN_IMAGE 7
         *  SIGN_IN_IMAGE 8
         */
        console.log('imageFrom = ', item.imageFrom);
        const imageFrom = SentencedToEmpty(item, ['imageList', 0, 'imageFrom'], -1)
        if (imageFrom == 7 || imageFrom == 6) {
            return '成套签到';
        } else if (imageFrom == 1 || imageFrom == 8) {
            return '运维签到';
        } else if (imageFrom == 2 || imageFrom == 3) {
            return '任务图片';
        } else if (imageFrom == 4) {
            return '任务表单';
        } else {
            return '其他';
        }
    }

    render() {
        return (
            <ScrollView
                style={[{
                    width: SCREEN_WIDTH
                }]}
            >
                {
                    this.state.dataList.map((item, index) => {
                        if (!item) return null;
                        return <View
                            style={[{
                                width: SCREEN_WIDTH,
                                borderWidth: 1,
                            }]}
                        >
                            <View
                                style={[{
                                    width: SCREEN_WIDTH,
                                    height: 40,
                                    alginItems: 'center',
                                    justifyContent: 'center',
                                }]}
                            >
                                <Text>{this.getRecordType(item)}</Text>
                                {/* <Text>{item.uuid}</Text> */}
                            </View>
                            {
                                item.imageList.map((imageItem, imageIndex) => {
                                    return <View
                                        style={[{
                                            width: SCREEN_WIDTH,
                                            height: 64,
                                            alginItems: 'center',
                                            borderBottemWidth: 1,
                                        }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                // ic_ct_up_load
                                                /**
                                                 *  SIGN_IN_WATER_MASK  1
                                                 *  TASK_WATER_MASK     2
                                                 *  TASK_IMAGE          3
                                                 *  TASK_FORM_IMAGE     4
                                                 *  OTHER               5
                                                 */
                                                console.log('imageItem = ', imageItem);
                                                if (imageItem.imageFrom == 1) {
                                                    // SIGN_IN_WATER_MASK
                                                    const locationArr = imageItem.waterMaskLocation.split(',');
                                                    let long = '', lat = '';
                                                    if (locationArr.length == 2) {
                                                        long = locationArr[0];
                                                        lat = locationArr[1];
                                                    }
                                                    this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                                    this.props.dispatch(
                                                        createAction('imageModel/uploadimageWaterMask')({
                                                            // createAction('imageModel/uploadimage')({
                                                            // image: imageObj,
                                                            images: [{
                                                                uri: imageItem.url
                                                            }],
                                                            uuid: imageItem.uuid,
                                                            imageParams: {
                                                                // waterMaskLocation:"116.299049,40.110573"
                                                                EntName: imageItem.waterMaskEntName,
                                                                PointName: '',
                                                                RegionName: imageItem.waterMaskAddress,
                                                                str_lat: lat,
                                                                str_long: long,
                                                            },
                                                            callback: (result) => {
                                                                console.log('result = ', result);
                                                            }
                                                        })
                                                    );
                                                } else if (imageItem.imageFrom == 2) {
                                                    // TASK_WATER_MASK
                                                    const locationArr = imageItem.waterMaskLocation.split(',');
                                                    let long = '', lat = '';
                                                    if (locationArr.length == 2) {
                                                        long = locationArr[0];
                                                        lat = locationArr[1];
                                                    }
                                                    this.props.dispatch(createAction('imageFormModel/updateState')({ imageStatus: { status: -1 } }));
                                                    this.props.dispatch(
                                                        createAction('imageModel/uploadimageWaterMask')({
                                                            // createAction('imageModel/uploadimage')({
                                                            // image: imageObj,
                                                            images: [{
                                                                uri: imageItem.url
                                                            }],
                                                            uuid: imageItem.uuid,
                                                            imageParams: {
                                                                // waterMaskLocation:"116.299049,40.110573"
                                                                EntName: imageItem.waterMaskEntName,
                                                                PointName: imageItem.waterMaskPointName,
                                                                RegionName: imageItem.waterMaskAddress,
                                                                str_lat: lat,
                                                                str_long: long,
                                                            },
                                                            callback: (result) => {
                                                                console.log('result = ', result);
                                                            }
                                                        })
                                                    );
                                                } else if (imageItem.imageFrom == 3) {
                                                    // TASK_IMAGE
                                                    ShowLoadingToast('正在上传图片');
                                                    this.props.dispatch(
                                                        createAction('imageModel/uploadimage')({
                                                            images: [{ uri: imageItem.url }],
                                                            uuid: imageItem.uuid,
                                                            callback: (result) => {
                                                                console.log('result = ', result);
                                                                CloseToast();
                                                            }
                                                        })
                                                    );
                                                } else if (imageItem.imageFrom == 4) {
                                                    // TASK_FORM_IMAGE
                                                    ShowLoadingToast('正在上传图片');
                                                    this.props.dispatch(
                                                        createAction('imageModel/uploadimage')({
                                                            images: [{ uri: imageItem.url }],
                                                            uuid: imageItem.uuid,
                                                            callback: (result) => {
                                                                console.log('result = ', result);
                                                                CloseToast();
                                                            }
                                                        })
                                                    );
                                                } else if (imageItem.imageFrom == 5) {
                                                    // OTHER
                                                    ShowLoadingToast('正在上传图片');
                                                    this.props.dispatch(
                                                        createAction('imageModel/uploadimage')({
                                                            images: [{ uri: imageItem.url }],
                                                            uuid: imageItem.uuid,
                                                            callback: (result) => {
                                                                console.log('result = ', result);
                                                                CloseToast();
                                                            }
                                                        })
                                                    );
                                                }
                                            }}
                                        >
                                            <Image
                                                style={[{
                                                    width: 64,
                                                    height: 64,
                                                }]}
                                                source={{
                                                    url: imageItem.url,
                                                    uri: imageItem.url,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                })
                            }
                        </View>
                    })
                }
            </ScrollView>
        )
    }
}